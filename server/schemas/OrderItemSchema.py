from marshmallow import Schema, fields, post_load, validate
from schemas import MenuSchema
from models import OrderItem

class OrderItemSchema(Schema):
    id = fields.Int(dump_only=True)
    order_id = fields.Int(required=True)
    menu_item_id = fields.Int(required=True)
    quantity = fields.Int(required=True, validate=validate.Range(min=1))
    price = fields.Float(required=True, validate=validate.Range(min=0))
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    menu_item = fields.Nested(MenuSchema, dump_only=True)

    @post_load
    def make_order_item(self, data, **kwargs):
        return OrderItem(**data)