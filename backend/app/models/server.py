"""
Server model for Fiskord
"""
from datetime import datetime

class Server:
    """Server model representing a chat server"""
    
    def __init__(self, server_name, owner_id, server_id=None, created_at=None):
        self.server_id = server_id
        self.server_name = server_name
        self.owner_id = owner_id
        self.created_at = created_at or datetime.now()
        self.members = []
        self.channels = []
        self.description = ""
    
    def add_member(self, user_id):
        """Add a member to the server"""
        if user_id not in self.members:
            self.members.append(user_id)
    
    def remove_member(self, user_id):
        """Remove a member from the server"""
        if user_id in self.members:
            self.members.remove(user_id)
    
    def add_channel(self, channel_id):
        """Add a channel to the server"""
        if channel_id not in self.channels:
            self.channels.append(channel_id)
    
    def to_dict(self):
        """Convert server to dictionary"""
        return {
            'server_id': self.server_id,
            'server_name': self.server_name,
            'owner_id': self.owner_id,
            'created_at': self.created_at.isoformat(),
            'members': self.members,
            'channels': self.channels,
            'description': self.description,
        }
