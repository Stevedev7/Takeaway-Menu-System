from models import Order

def get_order_by_client_secret(secret):
	return Order.query.filter_by(client_secret=secret).order_by(Order.created_at.desc()).first()