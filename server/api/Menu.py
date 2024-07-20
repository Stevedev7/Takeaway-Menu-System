import json
from flask import request
from models import Menu, Business
from flask_restful import Resource
from api.middleware import login_required
from schemas import MenuSchema, BusinessSchema
from services.business_services import get_business_by_id
from utils.database import db
from sqlalchemy import or_, func
from utils.Exceptions import NotFound

class MenuApi(Resource):
	method_decorators = {
        'post': [login_required],
        'put': [login_required],
        'delete': [login_required],
    }

	def get(self, id=None):
		if(id is None):
			schema = BusinessSchema(many=True)
			search = request.args.get('search')
			if(search):
				restaurants = Business.query.filter(
					or_(
						Business.name.ilike(f'%{search}%'),  
						Business.description.ilike(f'%{search}%'), 
						Business.website.ilike(f'%{search}%')
					)
				)
				return schema.dump(restaurants), 200
			restaurants = Business.query.all()
			return schema.dump(restaurants), 200
		else:
			try:
				search = request.args.get('search')
				if(search):
					restaurants = Menu.query.filter(
						or_(
							Menu.item_name.ilike(f'%{search}%'),  
							Menu.description.ilike(f'%{search}%')
						)
					)
					return schema.dump(restaurants), 200
				menu = get_business_by_id(int(id))
				schema = BusinessSchema()
				return schema.dump(menu), 200
			except NotFound as e:
				print(str(e))
				return {"error": f"{str(e)}"}, 404
			
	def post(self, id=None):
		if(id is None):
			return {"error": "Bad Request"}, 400
		else:
			account = request.account
			if(int(id) != account.id):
				return  {"error":"Unauthorized Access"}, 401
			
			body = json.loads(request.data)
			item = MenuSchema().load({**body, "business_id": account.id})
			db.session.add(item)
			db.session.commit()
			item = Menu.query.filter_by(business_id=account.id).order_by(Menu.created_at.desc()).first()
			return {**MenuSchema().dump(item)}, 201