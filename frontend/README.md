# Fiskord Frontend

Modern LAN-based chat client web interface.

## Project Structure

```
frontend/
├── src/
│   ├── js/
│   │   ├── api.js           # REST API client
│   │   ├── socket.js        # WebSocket manager
│   │   ├── ui.js            # UI state manager
│   │   └── app.js           # Main application
│   └── css/
│       ├── style.css        # Global styles
│       ├── layout.css       # Layout styles
│       └── chat.css         # Chat UI styles
├── assets/                  # Images, icons, etc.
└── index.html              # Main HTML file
```

## Features

- **Real-time Chat**: WebSocket-based messaging with instant delivery
- **Multiple Servers**: Create and join different chat servers
- **Channels**: Organize conversations within servers
- **Typing Indicators**: See when others are typing
- **Responsive Design**: Works on desktop and mobile
- **Modern UI**: Discord-like interface with dark theme

## Getting Started

1. Open `index.html` in a web browser
2. Enter a username and server address
3. Connect to the Fiskord backend server
4. Start chatting!

## Configuration

The frontend connects to the backend at `http://localhost:5000` by default. You can change this in the login form by entering a different server address.

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Socket.IO (for real-time communication)
- Fetch API (for REST calls)

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

No build process required! Simply edit the source files and refresh the browser.

### Key JavaScript Modules

- **api.js**: Handles all REST API communications
- **socket.js**: Manages WebSocket connections and events
- **ui.js**: Controls all UI interactions and DOM updates
- **app.js**: Orchestrates the application logic

## Styling

The application uses CSS custom properties (variables) for consistent theming. Colors can be customized in `src/css/style.css`.
