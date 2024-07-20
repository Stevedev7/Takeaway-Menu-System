from utils.database import BaseModel, db
from enum import Enum as PyEnum


class Role(PyEnum):
    ADMIN = "ADMIN"
    BUSINESS = "BUSINESS"
    CUSTOMER = "CUSTOMER"

class Account(BaseModel):
    __tablename__ = "account"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum(Role), default=Role.CUSTOMER)

    customer = db.relationship('Customer', cascade='delete,save-update', back_populates='account', uselist=False)
    business = db.relationship("Business", cascade='delete,save-update', back_populates='account', uselist=False)


    def __repr__(self):
        return (
            f"--Account--"
            f"\nID: {self.id}"
            f"\nEmail: {self.email}"
            f"\nPassword: ****"
            f"\nRole: {self.role}"
            f"\n-----------"
        )