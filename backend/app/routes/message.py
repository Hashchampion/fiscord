"""
Message routes for Fiskord
"""
from flask import request, jsonify
from . import message_bp

@message_bp.route('/<int:channel_id>', methods=['GET'])
def get_messages(channel_id):
    """Get messages from a channel"""
    # TODO: Implement message retrieval
    return jsonify({
        'success': True,
        'messages': []
    }), 200

@message_bp.route('/', methods=['POST'])
def send_message():
    """Send a message (REST endpoint, primary use is via WebSocket)"""
    data = request.get_json()
    content = data.get('content')
    sender_id = data.get('sender_id')
    channel_id = data.get('channel_id')
    
    if not all([content, sender_id, channel_id]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # TODO: Implement message sending
    return jsonify({
        'success': True,
        'message': 'Message sent',
        'message_id': 1
    }), 201

@message_bp.route('/<int:message_id>', methods=['DELETE'])
def delete_message(message_id):
    """Delete a message"""
    # TODO: Implement message deletion
    return jsonify({'success': True, 'message': 'Message deleted'}), 200
