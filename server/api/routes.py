from flask_restful import Api

from .Ping import PingApi
from .RegisterUser  import  RegisterUserApi
from .Login import LoginApi
from .Customer import Customer
from .Business import Business
from .Token import TokenApi
from .Menu import MenuApi
from .Item import ItemApi
from .Cart import CartApi
from .CartItem import CartItemApi
from .Pay import PaymentApi
from .CanclePay import CanclePayApi
from .Order import OrderApi
from .BusinessOrder import BusinessOrderApi
from .CustomerOrder import CustomerOrderApi
from .Favorite import FavoriteApi

def create_routes(api: Api):
    api.add_resource(PingApi, "/api/ping/")
    api.add_resource(RegisterUserApi,"/api/users/register/")
    api.add_resource(LoginApi,  "/api/users/login/")
    api.add_resource(FavoriteApi, '/api/users/customers/favorites/', '/api/users/customers/favorites/<id>/')
    api.add_resource(Customer, '/api/users/customers/<id>/')
    api.add_resource(Business, '/api/users/businesses/<id>/')
    api.add_resource(TokenApi, '/api/users/verify/')
    api.add_resource(MenuApi, '/api/menus/', '/api/menus/<id>/')
    api.add_resource(ItemApi, '/api/menus/<id>/items/<item_id>/')
    api.add_resource(CartApi, '/api/carts/','/api/carts/<customer_id>/', '/api/carts/<customer_id>/<business_id>/')
    api.add_resource(CartItemApi,'/api/cart/<cart_id>/', '/api/cart/<cart_id>/<item_id>/')
    api.add_resource(PaymentApi, '/api/pay/')
    api.add_resource(CanclePayApi, '/api/cancle-pay/')
    api.add_resource(OrderApi, '/api/orders/')
    api.add_resource(BusinessOrderApi, '/api/businesses/<id>/orders/','/api/businesses/<id>/orders/<order_id>/')
    api.add_resource(CustomerOrderApi, '/api/customers/<id>/orders/','/api/customers/<id>/orders/<order_id>/')

