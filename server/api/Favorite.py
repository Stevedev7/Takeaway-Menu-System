import json
from flask import request
from flask_restful import Resource
from api.middleware import login_required
from models import Favorite
from utils.database import db
from services.menu_services import get_item_by_id
from services.customer_services import get_customer_by_id
from schemas import FavoriteSchema
from collections import defaultdict

class FavoriteApi(Resource):
	method_decorators = {
		'get': [login_required],
		'post': [login_required],
		'delete': [login_required]
	}

	def get(self, id=None):
		if not id:
			account = request.account
			customer = get_customer_by_id(request.account.id)
			if not customer:
				return {"message": "Customer does not exist."}, 401

			favorites_by_business = defaultdict(list)
			for favorite in customer.favorites:
				favorites_by_business[favorite.menu_item.business_id].append(favorite)

			grouped_favorites = {}
			for business_id, favorites in favorites_by_business.items():
				grouped_favorites[str(business_id)] = FavoriteSchema(many=True).dump(favorites)

			return {"data": grouped_favorites}
		return {"error": "Bad request"}, 400

	def post(self, id=None):
		account = request.account
		if(id is not None):
			return {"error": "Bad request"}, 400
		
		try:
			body = json.loads(request.data)
			menu_item = get_item_by_id(body["item_id"])
			if  menu_item is None:
				return {"error":"Item does not exist."}, 404
			existing_favorite = Favorite.query.filter_by(customer_id=account.id, menu_item_id=body["item_id"]).first()
			if existing_favorite is None:
				new_favorite = Favorite(customer_id=account.id, menu_item_id=body["item_id"])
				db.session.add(new_favorite)
				db.session.commit()
				new_favorite = Favorite.query.filter_by(customer_id=account.id, menu_item_id=body["item_id"]).order_by(Favorite.created_at.desc()).first()
				return {**FavoriteSchema().dump(new_favorite)}, 201
			else:
				return {"error": "Item already favorited."}, 409
		except (ValueError, KeyError):
			return {"error": "Invalid JSON format."}, 400
		except Exception as e:
			return {"error": str(e)}, 500

	def delete(self, id=None):
		account = request.account
		if(id is None):
			return {"error": "Bad request"}, 400
		
		try:
			existing_favorite = Favorite.query.filter_by(id=id,customer_id=account.id).first()
			if existing_favorite is None:
				return {"message": "Nothing to delete"}, 201
			else:
				db.session.delete(existing_favorite)
				db.session.commit()
				return {"message": "Item deleted"}, 201
		except (ValueError, KeyError):
			return {"error": "Invalid JSON format."}, 400
		except Exception as e:
			return {"error": str(e)}, 500