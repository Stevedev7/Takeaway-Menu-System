from marshmallow import Schema, fields, post_load, validate
from models.Order import OrderStatus, Order
from schemas.OrderItemSchema import OrderItemSchema
from schemas.BusinessSchema import BusinessSchema
from schemas.CustomerSchema import CustomerSchema

class OrderSchema(Schema):
    id = fields.Int(dump_only=True)
    customer_id = fields.Int(required=True)
    business_id = fields.Int(required=True)
    points = fields.Int()
    total_amount = fields.Float(required=True, validate=validate.Range(min=0))
    status = fields.Enum(OrderStatus)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    order_items = fields.Nested(OrderItemSchema, dump_only=True, many=True)
    client_secret = fields.Str(required=True)
    business = fields.Nested(BusinessSchema, only=('id', 'name'))
    customer = fields.Nested(CustomerSchema, only=('id', 'first_name', 'last_name', 'account.email'))
    instructions = fields.String()
    @post_load
    def make_order(self, data, **kwargs):
        return Order(**data)