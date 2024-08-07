"""add client secret to orders table

Revision ID: f3147818cd49
Revises: 
Create Date: 2024-04-27 23:04:04.308725

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'f3147818cd49'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('image', schema=None) as batch_op:
        batch_op.alter_column('data',
               existing_type=mysql.LONGBLOB(),
               type_=sa.LargeBinary(length=2147483648),
               existing_nullable=False)

    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.add_column(sa.Column('client_secret', sa.String(length=255), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.drop_column('client_secret')

    with op.batch_alter_table('image', schema=None) as batch_op:
        batch_op.alter_column('data',
               existing_type=sa.LargeBinary(length=2147483648),
               type_=mysql.LONGBLOB(),
               existing_nullable=False)

    # ### end Alembic commands ###
