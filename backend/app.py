"""
Main entry point for Fiskord Backend Server
LAN-based chat application with server support
"""
from app import create_app
from config.config import Config

if __name__ == '__main__':
    app = create_app(Config)
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        allow_unsafe_werkzeug=True
    )
