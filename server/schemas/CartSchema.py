from marshmallow import Schema, fields, post_load
from models import Cart
from schemas import CartItemSchema

class CartSchema(Schema):
    id = fields.Integer(dump_only=True)
    business_id = fields.Integer(required=True)
    customer_id = fields.Integer(required=True)
    total = fields.Float(dump_only=True)
    cart_items = fields.Nested(CartItemSchema, many=True)
    
    @post_load
    def make_cart(self, data, **kwargs):
        return Cart(**data)