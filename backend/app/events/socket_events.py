"""
Socket.IO event handlers for Fiskord
"""
from flask_socketio import emit, join_room, leave_room
from app import socketio

# Store connected users: {socket_id: {user_id, username, current_server, current_channel}}
connected_users = {}

@socketio.on('connect')
def handle_connect():
    """Handle user connection"""
    print(f'Client connected: {request.sid}')
    emit('response', {'data': 'Connected to Fiskord server'})

@socketio.on('disconnect')
def handle_disconnect():
    """Handle user disconnection"""
    if request.sid in connected_users:
        user_data = connected_users[request.sid]
        print(f'User disconnected: {user_data.get("username")}')
        del connected_users[request.sid]

@socketio.on('user_join')
def handle_user_join(data):
    """Handle user joining a server"""
    username = data.get('username')
    user_id = data.get('user_id')
    server_id = data.get('server_id')
    channel_id = data.get('channel_id')
    
    connected_users[request.sid] = {
        'user_id': user_id,
        'username': username,
        'current_server': server_id,
        'current_channel': channel_id
    }
    
    room = f"server_{server_id}_channel_{channel_id}"
    join_room(room)
    
    emit('user_joined', {
        'username': username,
        'user_id': user_id,
        'message': f'{username} joined the channel'
    }, room=room)

@socketio.on('send_message')
def handle_send_message(data):
    """Handle incoming message"""
    content = data.get('content')
    sender_id = data.get('sender_id')
    server_id = data.get('server_id')
    channel_id = data.get('channel_id')
    
    room = f"server_{server_id}_channel_{channel_id}"
    
    emit('new_message', {
        'content': content,
        'sender_id': sender_id,
        'timestamp': __import__('datetime').datetime.now().isoformat()
    }, room=room)

@socketio.on('typing')
def handle_typing(data):
    """Handle typing indicator"""
    username = data.get('username')
    server_id = data.get('server_id')
    channel_id = data.get('channel_id')
    
    room = f"server_{server_id}_channel_{channel_id}"
    emit('user_typing', {
        'username': username
    }, room=room, skip_sid=request.sid)

@socketio.on('stop_typing')
def handle_stop_typing(data):
    """Handle stop typing"""
    username = data.get('username')
    server_id = data.get('server_id')
    channel_id = data.get('channel_id')
    
    room = f"server_{server_id}_channel_{channel_id}"
    emit('user_stopped_typing', {
        'username': username
    }, room=room, skip_sid=request.sid)
