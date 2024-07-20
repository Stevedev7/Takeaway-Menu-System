import json
from flask import request
from models import Menu, Business
from flask_restful import Resource
from api.middleware import login_required
from schemas import MenuSchema, BusinessSchema
from services.business_services import get_business_by_id
from services.menu_services import get_item_by_id, delete_item_by_id
from utils.database import db
from models.Account import Role
class ItemApi(Resource):
	method_decorators = {
        'post': [login_required],
        'put': [login_required],
        'delete': [login_required],
    }

	def get(self, id=None, item_id=None):
		if(id== None or item_id == None):
			return {"error": "Bad request"}, 400
		try:
			restaurant = get_business_by_id(id)
			item = get_item_by_id(item_id)
			return MenuSchema().dump(item), 200

		except Exception as e:
			return {"error": f"{str(e)}"}, 500
	
	def put(self, id=None, item_id=None):
		if(id== None or item_id == None):
			return {"error": "Bad request"}, 400
		try:
			account = request.account
			if account.role != Role.ADMIN and int(id) != account.id:
				return  {'error':'Unauthorized'},  401
			item = get_item_by_id(item_id)
			body = json.loads(request.data)
			item.item_name = body["item_name"] or item.item_name
			item.description = body["description"] or item.description
			item.price = body["price"] or item.price
			item.img = body["img"] or item.img
			db.session.commit()
			return  MenuSchema().dump(item), 204
		except Exception as e:
			return {"error": str(e)}, 500
	
	def delete(self, id=None, item_id=None):
		if(id== None or item_id == None):
			return {"error": "Bad request"}, 400
		try:
			account = request.account
			if account.role != Role.ADMIN and int(id) != account.id:
				return  {'error':'Unauthorized'},  401
			item = delete_item_by_id(item_id)
			return  None, 204
		except Exception as e:
			return {"error": str(e)}, 500