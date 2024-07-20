from flask_restful import  Resource
from flask import Response



class PingApi(Resource):
    def get(self) -> Response:
        """
        file: /api/docs/paths/ping.yaml
        """
        return Response(status=200)