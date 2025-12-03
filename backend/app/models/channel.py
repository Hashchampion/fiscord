"""
Channel model for Fiskord
"""
from datetime import datetime

class Channel:
    """Channel model representing a chat channel within a server"""
    
    def __init__(self, channel_name, server_id, channel_id=None, created_at=None):
        self.channel_id = channel_id
        self.channel_name = channel_name
        self.server_id = server_id
        self.created_at = created_at or datetime.now()
        self.description = ""
        self.is_private = False
        self.members = []
    
    def add_member(self, user_id):
        """Add a member to the channel"""
        if user_id not in self.members:
            self.members.append(user_id)
    
    def remove_member(self, user_id):
        """Remove a member from the channel"""
        if user_id in self.members:
            self.members.remove(user_id)
    
    def to_dict(self):
        """Convert channel to dictionary"""
        return {
            'channel_id': self.channel_id,
            'channel_name': self.channel_name,
            'server_id': self.server_id,
            'created_at': self.created_at.isoformat(),
            'description': self.description,
            'is_private': self.is_private,
            'members': self.members,
        }
