from models import Cart, Customer, CartItem
from utils.database import db
from utils.Exceptions import NotFound

def create_cart(customer_id, business_id):
	new_cart = Cart(customer_id=customer_id, business_id=business_id)
	db.session.add(new_cart)
	db.session.commit()

	cart = Cart.query.filter_by(business_id=business_id, customer_id=customer_id).order_by(Cart.created_at.desc()).first()
	return cart

def get_all_carts():

    all_carts = Cart.query.all()
    return all_carts


def get_customer_carts(customer_id):

    customer = Customer.query.get(customer_id)

    customer_carts = customer.carts
    return customer_carts

def get_customer_business_cart(customer_id, business_id):
    cart = Cart.query.filter_by(customer_id=customer_id, business_id=business_id).first()
    return cart

def delete_cart(cart_id):
    cart = Cart.query.get(cart_id)
    
    if cart:
        db.session.delete(cart)
        db.session.commit()
        
def get_cart_by_id(cart_id):
    cart = Cart.query.get(int(cart_id))
    if cart is None:
         raise NotFound(message="Cart not found")
    return cart

def add_item(cart_id, menu_item_id, price, quantity=1):
    new_cart_item = CartItem(cart_id=cart_id, menu_item_id=menu_item_id, quantity=quantity, price=price)
    db.session.add(new_cart_item)
    db.session.commit()
    
    return get_cart_by_id(cart_id)
    