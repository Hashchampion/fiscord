"""
Routes module for Fiskord API
"""
from flask import Blueprint

# Create blueprints
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
server_bp = Blueprint('server', __name__, url_prefix='/api/servers')
message_bp = Blueprint('message', __name__, url_prefix='/api/messages')

# Import routes to register them
from . import auth, server, message
