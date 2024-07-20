import json
import os
from flask_restful import Resource
from flask import request
from schemas import OrderSchema, OrderItemSchema
from api.middleware import login_required
import stripe
from utils.database import db
from models import Order, OrderItem
from services.order_services import get_order_by_client_secret
from services.cart_services import delete_cart
from services.customer_services import get_customer_by_id
from utils.email import send_email
from utils.email_templates import generate_order_placed_email

class OrderApi(Resource):
	method_decorators = {
        'post': [login_required],
    }

	stripe_key = os.getenv('STRIPE_SECRET_KEY', None)

	def post(self):
		if(not  self.stripe_key):
			return {"error": "Stripe Secret Key is missing"}, 500
		stripe.api_key = self.stripe_key
		user = request.account
		body = json.loads(request.data)
		customer = get_customer_by_id(user.id)
		try:
			order = get_order_by_client_secret(body['client_secret'])
			if (OrderSchema().dump(order) != {}):
				return {"order": OrderSchema().dump(order)}, 200
			payment_intent_id = body['client_secret'].split("_secret_")[0]
			
			payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
			cart_items = json.loads(payment_intent.metadata.cart_items)
			order_data = {
				'customer_id': int(payment_intent.metadata.customer_id),
				'business_id': int(payment_intent.metadata.business_id),
				'points': int(payment_intent.metadata.points),
				'total_amount': float(payment_intent.metadata.total),
				"client_secret":  body['client_secret'],
				'instructions': payment_intent.metadata.instructions
			}
			order_schema = OrderSchema()
			order = order_schema.load(order_data)
			db.session.add(order)
			customer.points = customer.points - int(payment_intent.metadata.points)
			db.session.commit()
			delete_cart(payment_intent.metadata.id)

			order = Order.query.filter_by(client_secret=body['client_secret']).order_by(Order.created_at.desc()).first()


			for item in cart_items:
				order_item = {
					"order_id": order.id,
					"menu_item_id": item['menu_item_id'],
					"quantity": item['quantity'],
					"price": item['price']
				}
				order_item = OrderItem(**order_item)
				db.session.add(order_item)
			
			db.session.commit()
			order = Order.query.get(order.id)
		
			email_metadata = {
				"order_id": order.id,
				"business_name": order.business.name,
				"items": [],
				"total": order.total_amount,
				"points": order.points
			}
			for oi in order.order_items:
				i = {
					"name": oi.menu_item.item_name,
					"quantity": oi.quantity,
					"price": oi.menu_item.price,
				}
				email_metadata["items"].append(i)
			send_email(generate_order_placed_email(email_metadata), order.customer.account.email)

			
			return {"order": OrderSchema().dump(order)}, 200
		except stripe.error.StripeError as e:
			
			return {'success': False, 'error': str(e)}
		except Exception as e:
			return {'success': False, 'error': str(e)}
			