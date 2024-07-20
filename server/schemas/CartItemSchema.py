from marshmallow import Schema, fields, validate, post_load
from models import CartItem
from schemas import MenuSchema

class CartItemSchema(Schema):
    id = fields.Integer(dump_only=True)
    cart_id = fields.Integer(required=True)
    menu_item_id = fields.Integer(required=True)
    quantity = fields.Integer(required=True, validate=validate.Range(min=1))
    price = fields.Float(required=True)
    menu_item = fields.Nested(MenuSchema)
    @post_load
    def make_cart_item(self, data, **kwargs):
        return CartItem(**data)