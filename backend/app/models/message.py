"""
Message model for Fiskord
"""
from datetime import datetime

class Message:
    """Message model representing a chat message"""
    
    def __init__(self, content, sender_id, channel_id, message_id=None, created_at=None):
        self.message_id = message_id
        self.content = content
        self.sender_id = sender_id
        self.channel_id = channel_id
        self.created_at = created_at or datetime.now()
        self.edited_at = None
    
    def to_dict(self):
        """Convert message to dictionary"""
        return {
            'message_id': self.message_id,
            'content': self.content,
            'sender_id': self.sender_id,
            'channel_id': self.channel_id,
            'created_at': self.created_at.isoformat(),
            'edited_at': self.edited_at.isoformat() if self.edited_at else None,
        }
