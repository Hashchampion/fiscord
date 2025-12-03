# Fiskord Backend

LAN-based chat server application built with Flask and Socket.IO.

## Project Structure

```
backend/
├── app/
│   ├── models/           # Data models (User, Server, Channel, Message)
│   ├── routes/           # REST API endpoints
│   ├── events/           # WebSocket event handlers
│   ├── utils/            # Utility functions
│   └── __init__.py       # Flask app factory
├── config/               # Configuration files
├── tests/                # Unit tests
├── app.py               # Entry point
├── requirements.txt     # Python dependencies
└── README.md            # This file
```

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
```

## Running the Server

```bash
python app.py
```

The server will start on `http://0.0.0.0:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `POST /api/auth/logout` - Logout user

### Servers
- `GET /api/servers` - Get all servers
- `POST /api/servers` - Create new server
- `GET /api/servers/<server_id>` - Get server details
- `DELETE /api/servers/<server_id>` - Delete server
- `POST /api/servers/<server_id>/join` - Join server
- `POST /api/servers/<server_id>/leave` - Leave server

### Messages
- `GET /api/messages/<channel_id>` - Get channel messages
- `POST /api/messages` - Send message
- `DELETE /api/messages/<message_id>` - Delete message

## WebSocket Events

### Client → Server
- `connect` - Connect to server
- `user_join` - User joins server/channel
- `send_message` - Send a message
- `typing` - User is typing
- `stop_typing` - User stopped typing

### Server → Client
- `response` - Server response
- `user_joined` - User joined notification
- `new_message` - New message received
- `user_typing` - User typing indicator
- `user_stopped_typing` - User stopped typing indicator
