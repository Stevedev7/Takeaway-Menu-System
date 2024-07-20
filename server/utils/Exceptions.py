class NotFound(Exception):
	def __init__(self, message="Not Found"):
		self.message = message
		super().__init__(self.message)