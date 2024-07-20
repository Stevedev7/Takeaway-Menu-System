from flask_restful import Resource
from api.middleware import login_required
from flask import request
from schemas import AccountSchema
class TokenApi(Resource):
	method_decorators = {
        'get': [login_required],
    }

	def get(self):
		return {**AccountSchema().dump(request.account)}, 200