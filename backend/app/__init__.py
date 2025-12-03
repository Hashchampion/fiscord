"""
Flask app factory for Fiskord
"""
from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS

socketio = SocketIO(cors_allowed_origins="*")

def create_app(config):
    """Create and configure the Flask application"""
    app = Flask(__name__)
    app.config.from_object(config)
    
    # Initialize extensions
    CORS(app)
    socketio.init_app(app)
    
    # Register blueprints
    from app.routes import auth_bp, server_bp, message_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(server_bp)
    app.register_blueprint(message_bp)
    
    # Register socket events
    from app.events import socket_events
    
    return app
