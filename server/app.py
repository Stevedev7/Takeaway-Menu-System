import os
from flask import Flask
from flask_restful import Api
from flasgger import Swagger
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from utils.database import db
from utils.password import bcrypt
from api.routes import create_routes
from flask import Response, request
from pymysql.err import OperationalError
from sqlalchemy.exc import OperationalError as SQLAlchemyOperationalError

# def create_flask_app() -> Flask:

DATABASE_URI  = os.getenv('DATABASE_URI') or "mysql+pymysql://admin:password@127.0.0.1:3306/TAKEAWAY"
# os.system('cls' if os.name == 'nt' else 'clear')
app = Flask(__name__)
@app.before_request
def basic_authentication():
    if request.method.lower() == 'options':
        return Response()
api = Api(app)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATION"] = False

db.init_app(app)
bcrypt.init_app(app)

migrate = Migrate(app, db)
try:
    with app.app_context():
        db.create_all()
except OperationalError as e:
    print("\nERROR: --->Please check if the database server is started.\n")
    exit(1)
except SQLAlchemyOperationalError as e:
    print("\nERROR: --->Please check if the database server is started.\n")
    exit(1)
except Exception as e:
    print(str(e))
    exit(1)

swagger_config = Swagger.DEFAULT_CONFIG

#  Add custom configs for Swagger

swagger_config['specs'][0]['endpoint'] = '/api/docs/swagger'
swagger_config['specs'][0]['route'] = '/api/docs/swagger.json'
swagger_config['specs_route'] = '/api/docs/'

#  Setup Swagger UI with the config
app.config["SWAGGER"] = {
    'openapi': '3.0.0',
    'info': {    
        'title': 'Takeaway menu system API',
        'description': 'Some sort of description',
        'version': '1.0.0'
    },
    'components': {
        'securitySchemes': {
            'bearerAuth': {
                'type': 'http',
                'scheme': 'bearer',
                'bearerFormat': 'JWT'
            }
        }
    }
}

#  Connect the docs to the Flask app
swagger = Swagger(app, config=swagger_config)
create_routes(api=api)

    # return app


# if __name__ == "__main__":
#     PORT = os.getenv('PORT', 4000)

#     app = create_flask_app()
    
#     app.run(debug=True, host='0.0.0.0', port=PORT)

