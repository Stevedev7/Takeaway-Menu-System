from utils.database import BaseModel, db


class Cart(BaseModel):
    __tablename__ = "cart"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, default=0)
    business_id = db.Column(db.Integer, db.ForeignKey('business.id', ondelete='CASCADE', onupdate='CASCADE'))
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id', ondelete='CASCADE', onupdate='CASCADE'))
    total = db.Column(db.Float, default=0)

    business = db.relationship('Business', back_populates='carts')
    customer = db.relationship('Customer', back_populates='carts')
    cart_items = db.relationship('CartItem', back_populates='cart', cascade='all, delete-orphan')

    def __repr__(self) -> str:
        return (
            f'<Cart {self.id}>'
			f'\nCustomer ID: {self.customer_id}'
			f'\nBusiness ID: {self.business_id}\n'
		)