from flask_restful import Resource
from utils.Exceptions import NotFound
from utils.database import db
from api.middleware import login_required
from services.cart_services import get_cart_by_id, add_item, delete_cart
from services.menu_services import get_item_by_id
from services.customer_services import get_customer_by_id
from services.business_services import get_business_by_id
from schemas import CartSchema
from models import CartItem
from flask import request
import json

class CartItemApi(Resource):
	method_decorators = {
        'get': [login_required],
        'post': [login_required],
        'delete': [login_required],
		'put': [login_required]
    }

	def get(self, cart_id=None):
		try:
			customer = request.account
			if cart_id is None:
				return {"error": "Bad Request"}, 400
			cart = get_cart_by_id(cart_id)

			if customer.id != cart.customer_id:
				return {"error": "Forbidden"}, 403
			return {** CartSchema().dump(get_cart_by_id(cart_id))}
		except NotFound:
			return {"error": "Cart Not found."}, 404
		except Exception as e:
			return {"error": str(e) }

	def post(self, cart_id=None):
		try:
			customer = request.account
			if cart_id is None:
				return {"error": "Bad Request"}, 400
			existing_cart = get_cart_by_id(cart_id)
			if customer.id != existing_cart.customer_id:
				return {"error": "Forbidden"}, 403
			body = json.loads(request.data)
			item = get_item_by_id(id=body["item_id"])
			cart = add_item(cart_id=cart_id, menu_item_id=body["item_id"], price=(item.price * float(body["quantity"])), quantity=body["quantity"],)
			existing_cart.total = existing_cart.total +  item.price * float(body["quantity"])

			db.session.commit()

			return {** CartSchema().dump(cart)}, 201

		except NotFound as e:
			return {"error": str(e)}, 404
		except Exception as e:
			return {"error": str(e) }
		
	def put(self, cart_id=None, item_id=None):
		try:
			customer = request.account
			if cart_id is None:
				return {"error": "Bad Request"}, 400
			
			cart = get_cart_by_id(cart_id)
			if customer.id != cart.customer_id:
				return {"error": "Forbidden"}, 403
			
			if(item_id is None):
				return {"error": "Required item id."}, 400
			
			body = json.loads(request.data)
			item = CartItem.query.filter_by(cart_id=cart_id, id=item_id).first()
			menu_item = get_item_by_id(id=item.menu_item_id)
			if item is None:
				raise NotFound(message="Cart item not found.")
			
			cart.total = cart.total - item.price
			item.price = 0.0
			item.quantity = body["quantity"] or item.quantity
			new_price = float(item.quantity) * menu_item.price
			cart.total = cart.total + new_price
			item.price = new_price
			db.session.commit()
			return {** CartSchema().dump(get_cart_by_id(cart_id))}
		except NotFound:
			return {"error": "Cart Not found."}, 404
		except Exception as e:
			return {"error": str(e)}

	def delete(self, cart_id=None, item_id=None):
		try:
			customer = request.account
			if cart_id is None:
				return {"error": "Bad Request"}, 400
			
			cart = get_cart_by_id(cart_id)
			if customer.id != cart.customer_id:
				return {"error": "Forbidden"}, 403
			
			if(item_id is None):
				delete_cart(cart_id)
				return None,  204

			item = CartItem.query.filter_by(cart_id=cart_id, id=item_id).first()
			if item is None:
				return None, 204
			
			db.session.delete(item)
			cart.total = cart.total - item.price
			db.session.commit()
			return None, 204
		except NotFound as e:
			return {"error": str(e)}, 404
		except Exception as e:
			return {"error": str(e) }