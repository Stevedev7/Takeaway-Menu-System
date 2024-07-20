from utils.database import BaseModel, db
from enum import Enum as PyEnum

class OrderStatus(PyEnum):
    PENDING = 'pending'
    PROCESSING = 'processing'
    READY = 'ready'
    COMPLETED = 'completed'
    CANCELLED = 'cancelled'
    
class Order(BaseModel):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    client_secret = db.Column(db.String(255), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    business_id = db.Column(db.Integer, db.ForeignKey('business.id'), nullable=False)
    points = db.Column(db.Integer, default=0)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.Enum(OrderStatus), nullable=False, default=OrderStatus.PENDING)
    instructions = db.Column(db.Text(1000))


    customer = db.relationship('Customer', back_populates='orders')
    business = db.relationship('Business', back_populates='orders')
    order_items = db.relationship('OrderItem', back_populates='order')
