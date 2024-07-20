import json
import os
from flask_restful import Resource
from flask import request
from schemas import AccountSchema, CartSchema
from api.middleware import login_required
import stripe
from services.cart_services import get_cart_by_id

class PaymentApi(Resource):
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
		points = 0
		cart_id = None
		cart_data = None
		try:
			points = body['points']
		except KeyError:
			pass
		try:
			cart_id = body['cart_id']
		except KeyError:
			pass
		try:
			if(cart_id):
				cart = get_cart_by_id(cart_id)
				if(user.id != cart.customer_id):
					return {"error": "Forbidden"}, 403
				
				cart_data = CartSchema().dump(cart)
				filtered_cart_items = []
				for item in cart_data['cart_items']:
					filtered_item = {
						"menu_item_id": item['menu_item_id'],
						"quantity": item['quantity'],
						"price": item['price']
					}
					filtered_cart_items.append(filtered_item)
				cart_data['cart_items'] = json.dumps(filtered_cart_items)
				cart_data['points'] = points
				cart_data['instructions'] = body['instructions']
				cart_total = cart.total - (points/100)
				cart_data['total'] = cart_total
			else :
				payment_intent_id = body['client_secret'].split("_secret_")[0]
				order_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
				cart_data = order_intent.metadata
				cart_data['total'] = (((float(cart_data['total'])*100) + float(cart_data['points'])))/100.00
				cart_total = cart_data['total']
				cart_data['points'] = 0
			intent = stripe.PaymentIntent.create(
                amount=int(((float(cart_total)) * 100.00)),
                currency='gbp',
                metadata={str(key): str(value) for key, value in cart_data.items()},
                receipt_email="takeawaymenu101@gmail.com"
            )
			return {"clientSecret": intent['client_secret']}, 200
		except (KeyError) as e:
			return {'error':f'Missing parameter {e}'}, 400
		except Exception as e:
			return {"error": str(e)}, 500