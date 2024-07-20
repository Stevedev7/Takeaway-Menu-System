from utils.database import BaseModel, db

class Customer(BaseModel):
    __tablename__ = "customer"

    id = db.Column(db.Integer, db.ForeignKey('account.id', ondelete='CASCADE', onupdate='CASCADE'), primary_key=True)
    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))
    phone = db.Column(db.String(11))
    points = db.Column(db.Integer, default=0)

    account = db.relationship('Account', back_populates='customer', uselist=False)
    carts = db.relationship('Cart', back_populates='customer', cascade='all, delete-orphan')
    orders = db.relationship('Order', back_populates='customer')
    favorites = db.relationship('Favorite', back_populates='customer', lazy='dynamic')
    def __repr__(self) -> str:
        return f'<Customer {self.id} {self.first_name} {self.last_name}>'