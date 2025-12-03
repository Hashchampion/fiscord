/**
 * Fiskord Socket.IO Manager
 * Handles real-time communication with the backend
 */

class SocketManager {
    constructor() {
        this.socket = null;
        this.listeners = {};
    }

    /**
     * Connect to WebSocket server
     */
    connect(serverAddress) {
        this.socket = io(`http://${serverAddress}`, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
        });

        this.setupDefaultListeners();
    }

    /**
     * Setup default event listeners
     */
    setupDefaultListeners() {
        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.emit('socketConnected');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.emit('socketDisconnected');
        });

        this.socket.on('response', (data) => {
            console.log('Server response:', data);
        });

        this.socket.on('user_joined', (data) => {
            this.emit('userJoined', data);
        });

        this.socket.on('new_message', (data) => {
            this.emit('newMessage', data);
        });

        this.socket.on('user_typing', (data) => {
            this.emit('userTyping', data);
        });

        this.socket.on('user_stopped_typing', (data) => {
            this.emit('userStoppedTyping', data);
        });
    }

    /**
     * Register event listener
     */
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    /**
     * Emit local event
     */
    emit(event, data = null) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }

    /**
     * Send message to server
     */
    sendMessage(content, senderId, serverId, channelId) {
        this.socket.emit('send_message', {
            content,
            sender_id: senderId,
            server_id: serverId,
            channel_id: channelId,
        });
    }

    /**
     * Notify user is typing
     */
    typing(username, serverId, channelId) {
        this.socket.emit('typing', {
            username,
            server_id: serverId,
            channel_id: channelId,
        });
    }

    /**
     * Notify user stopped typing
     */
    stopTyping(username, serverId, channelId) {
        this.socket.emit('stop_typing', {
            username,
            server_id: serverId,
            channel_id: channelId,
        });
    }

    /**
     * User joins server/channel
     */
    joinChannel(username, userId, serverId, channelId) {
        this.socket.emit('user_join', {
            username,
            user_id: userId,
            server_id: serverId,
            channel_id: channelId,
        });
    }

    /**
     * Disconnect from server
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}

// Create global socket manager instance
const socketManager = new SocketManager();
