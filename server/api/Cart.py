from flask_restful import Resource
from utils.Exceptions import NotFound
from api.middleware import login_required
from services.cart_services import get_all_carts, get_customer_business_cart, create_cart, get_customer_carts, delete_cart
from services.customer_services import get_customer_by_id
from services.business_services import get_business_by_id
from schemas import CartSchema, CartItemSchema
from models import Cart
from flask import request

class CartApi(Resource):
	method_decorators = {
        'get': [login_required],
        'post': [login_required],
        'delete': [login_required],
    }

	def get(self, customer_id=None, business_id=None):
		try:
			if(customer_id == None and business_id == None):
				if(request.account.role =="ADMIN"):
					return {"carts": CartSchema(many=True).dump(get_all_carts())},200
				else:
					return {"error": "Forbidden"}, 403
			customer = get_customer_by_id(int(customer_id))
			if(customer.account.id != request.account.id):
				return {"error": "Unauthorized"}, 401
			if(customer_id != None) and  (business_id==None):
				carts = CartSchema(many=True).dump(get_customer_carts(customer.id))
				return { 'carts': carts }, 200
			else:
				business = get_business_by_id(int(business_id))
				cart = CartSchema().dump(get_customer_business_cart(customer.id, business_id))
				if cart == {}:
					raise NotFound(message="Cart not found.")
				return {**cart}, 200
		except NotFound as e:
			return  {'error':str(e)},404
		
	def post(self, customer_id=None, business_id=None):
		if(customer_id == None or business_id == None):
			return None, 400
		try:
			customer = get_customer_by_id(int(customer_id))
			if(customer.account.id != request.account.id):
				return  {'error':'Unauthorized'},  401
			business = get_business_by_id(int(business_id))

			cart = get_customer_business_cart(business_id=business_id, customer_id=customer_id)
			if cart is not None:
				return {'error':'Cart already exists'}, 400
			cart = create_cart(business_id=business_id, customer_id=customer_id)
			return {**CartSchema().dump(cart)}, 201
		except NotFound:
			return  {'error':'Customer or Business not found'},404
		except Exception as e:
			return {"error": str(e)}, 500
	
	def delete(self, customer_id=None, business_id=None):
		try:
			if customer_id is None and business_id is None:
				return {"error": "Bad Request"}, 400

			customer = get_customer_by_id(customer_id)

			if customer.account.id != request.account.id:
				return {'error': 'Unauthorized'}, 401

			if customer_id is not None and business_id is None:
				carts = Cart.query.filter_by(customer_id=customer_id).all()
				for cart in carts:
					delete_cart(cart.id)
				return {"message": "All carts deleted."}, 204
			else:
				business = get_business_by_id(business_id)
				cart = get_customer_business_cart(business_id=business_id, customer_id=request.account.id)
				if cart:
					delete_cart(cart.id)
					return {"message": "Cart deleted."}, 204
				else:
					return {"error": "Cart not found."}, 404

		except Exception as e:
			return {"error": str(e)}, 500
