"""
User model for Fiskord
"""
from datetime import datetime

class User:
    """User model representing a chat participant"""
    
    def __init__(self, username, user_id=None, created_at=None):
        self.user_id = user_id
        self.username = username
        self.created_at = created_at or datetime.now()
        self.online_status = False
        self.current_server = None
        self.current_channel = None
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'user_id': self.user_id,
            'username': self.username,
            'created_at': self.created_at.isoformat(),
            'online_status': self.online_status,
            'current_server': self.current_server,
            'current_channel': self.current_channel,
        }
