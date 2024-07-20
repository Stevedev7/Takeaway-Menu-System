import json
import os
from flask_restful import Resource
from flask import request
from api.middleware import login_required
import stripe

class CanclePayApi(Resource):
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

		try:
			payment_intent_id = body['client_secret'].split("_secret_")[0]
			
			payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
			payment_intent.cancel()
			
			return {'success': True}
		except stripe.error.StripeError as e:
			return {'success': False, 'error': str(e)}