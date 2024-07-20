from flask import request
from flask_restful import Resource
import json

from api.middleware import login_required
from services.customer_services import get_customer_by_id
from models.Account import Role
from models import Order
from schemas import BusinessSchema, AccountSchema, OrderSchema
from utils.Exceptions import NotFound
class CustomerOrderApi(Resource):

    method_decorators = {
        'get': [login_required],
    }

    def get(self, id, order_id=None):
        
        try:
            existing_customer = get_customer_by_id(id)
            if order_id is None:
            	return {"orders": OrderSchema(many=True).dump(existing_customer.orders)}, 200
            else:
                order = Order.query.get(order_id)
                if not order:
                    raise NotFound("No such order exists")
                else:
                    if order.customer_id == request.account.id:
                        return { **OrderSchema().dump(order)}, 200
            return  {"message":"Unauthorized Access"},401
        except NotFound as e:
            return {"error" :  str(e)}, 404