import os
from flask import request
from flask_restful import Resource
import json
import stripe
from utils.database import db
from api.middleware import login_required
from services.business_services import get_business_by_id
from services.customer_services import get_customer_by_id
from models import Order
from schemas import OrderSchema
from utils.Exceptions import NotFound
from utils.email import send_email
from utils.email_templates import generate_cancelled, generate_accepted, generate_order_ready_email, generate_complete

class BusinessOrderApi(Resource):

    method_decorators = {
        'get': [login_required],
        'patch': [login_required]
    }
    stripe_key = os.getenv('STRIPE_SECRET_KEY', None)
    def get(self, id, order_id=None):
        
        try:
            existing_business = get_business_by_id(id)
            if order_id is None:
            	return {"orders": OrderSchema(many=True).dump(existing_business.orders)}, 200
            else:
                order = Order.query.get(order_id)
                if not order:
                    raise NotFound("No such order exists")
                else:
                    if order.business_id == request.account.id:
                        return { **OrderSchema().dump(order)}, 200
            return  {"message":"Unauthorized Access"},401
        except NotFound as e:
            return {"error" :  str(e)}, 404
        
    def patch(self, id, order_id=None):
        
        try:
            existing_business = get_business_by_id(id)
            body = json.loads(request.data)
            if order_id is None:
            	return {"error": "Bad request"}, 400
            else:
                order = Order.query.get(order_id)
                if not order:
                    raise NotFound("No such order exists")
                else:
                    if order.status == 'CANCELLED':
                        return {"error": "This order has already been cancelled."}, 409
                    if body['status'] == 'COMPLETED':
                        customer = get_customer_by_id(id=order.customer_id)
                        customer.points += int(order.total_amount)
                        db.session.commit()
                    if(body['status'] == 'CANCELLED'):
                        send_email(generate_cancelled(order.id, order.created_at, f'{order.customer.first_name} {order.customer.last_name}'), order.customer.account.email)
                        stripe.api_key = self.stripe_key
                        payment_intent_id = order.client_secret.split("_secret_")[0]
                        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
                        stripe.Refund.create(charge=payment_intent.latest_charge)
                        order.status = body['status']
                        db.session.commit()
                        return { **OrderSchema().dump(order) }, 200
                    
                    html = ''
                    if(body['status'] == 'PROCESSING'):
                        html = generate_accepted(order.id, order.created_at, f'{order.customer.first_name} {order.customer.last_name}', order.business.name)
                    if(body['status'] == 'READY'):
                        html = generate_order_ready_email(order.id, order.created_at, f'{order.customer.first_name} {order.customer.last_name}', order.business.name)
                    if(body['status'] == 'COMPLETED'):
                        html = generate_complete(order.id, order.created_at, f'{order.customer.first_name} {order.customer.last_name}', order.business.name)
                    order.status = body['status']
                    db.session.commit()
                    send_email(html, order.customer.account.email)
                    if order.business_id == request.account.id:
                        return { **OrderSchema().dump(order)}, 200
            return  {"message":"Unauthorized Access"},401
        except NotFound as e:
            return {"error" :  str(e)}, 404
        except Exception as e:
            return {"error" :  str(e)}, 404
            