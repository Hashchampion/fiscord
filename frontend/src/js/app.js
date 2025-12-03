/**
 * Fiskord Main Application
 * Orchestrates all components
 */

class FiskordApp {
    constructor() {
        this.currentUser = null;
        this.currentServer = null;
        this.currentChannel = null;
        this.serverAddress = null;

        this.initializeEventListeners();
    }

    /**
     * Initialize application event listeners
     */
    initializeEventListeners() {
        // User events
        window.addEventListener('userLogin', (e) => this.handleUserLogin(e.detail));
        window.addEventListener('userLogout', () => this.handleUserLogout());
        
        // Server events
        window.addEventListener('createServer', (e) => this.handleCreateServer(e.detail));
        window.addEventListener('selectServer', (e) => this.handleSelectServer(e.detail));
        
        // Message events
        window.addEventListener('sendMessage', (e) => this.handleSendMessage(e.detail));
        window.addEventListener('userTyping', () => this.handleUserTyping());
        window.addEventListener('userStoppedTyping', () => this.handleUserStoppedTyping());

        // Socket events
        socketManager.on('socketConnected', () => this.onSocketConnected());
        socketManager.on('newMessage', (data) => this.onNewMessage(data));
        socketManager.on('userJoined', (data) => this.onUserJoined(data));
        socketManager.on('userTyping', (data) => this.onUserTyping(data));
        socketManager.on('userStoppedTyping', (data) => this.onUserStoppedTyping(data));
    }

    /**
     * Handle user login
     */
    async handleUserLogin(detail) {
        const { username, serverAddress } = detail;
        
        try {
            // Login to API
            const response = await api.login(username);
            
            if (response.success) {
                this.currentUser = response.user;
                this.serverAddress = serverAddress;

                // Update UI
                uiManager.setCurrentUser(this.currentUser);
                uiManager.showChatPage();

                // Connect to WebSocket
                socketManager.connect(serverAddress);
                
                uiManager.showNotification(`Welcome, ${username}!`, 'success');
            }
        } catch (error) {
            console.error('Login error:', error);
            uiManager.showNotification('Login failed', 'error');
        }
    }

    /**
     * Handle user logout
     */
    async handleUserLogout() {
        try {
            socketManager.disconnect();
            this.currentUser = null;
            this.currentServer = null;
            this.currentChannel = null;
            
            uiManager.showLoginPage();
            uiManager.clearMessages();
            
            uiManager.showNotification('Logged out successfully', 'success');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    /**
     * Handle create server
     */
    async handleCreateServer(detail) {
        const { serverName, description } = detail;
        
        try {
            const response = await api.createServer(serverName, description);
            
            if (response.success) {
                const server = response.server;
                uiManager.addServerToList(server);
                uiManager.showNotification(`Server "${serverName}" created!`, 'success');
            }
        } catch (error) {
            console.error('Create server error:', error);
            uiManager.showNotification('Failed to create server', 'error');
        }
    }

    /**
     * Handle select server
     */
    handleSelectServer(detail) {
        const { server } = detail;
        this.currentServer = server;
        
        // For now, set default channel to 'general'
        this.currentChannel = {
            channel_id: 1,
            channel_name: 'general'
        };

        uiManager.clearMessages();
        uiManager.updateChannelDisplay(this.currentChannel.channel_name, server.members?.length || 0);

        // Join channel via WebSocket
        socketManager.joinChannel(
            this.currentUser.username,
            this.currentUser.user_id,
            server.server_id,
            this.currentChannel.channel_id
        );
    }

    /**
     * Handle send message
     */
    handleSendMessage(detail) {
        const { content } = detail;
        
        if (!this.currentServer || !this.currentChannel) {
            uiManager.showNotification('Please select a server and channel', 'warning');
            return;
        }

        socketManager.sendMessage(
            content,
            this.currentUser.user_id,
            this.currentServer.server_id,
            this.currentChannel.channel_id
        );
    }

    /**
     * Handle user typing
     */
    handleUserTyping() {
        if (this.currentServer && this.currentChannel) {
            socketManager.typing(
                this.currentUser.username,
                this.currentServer.server_id,
                this.currentChannel.channel_id
            );
        }
    }

    /**
     * Handle user stopped typing
     */
    handleUserStoppedTyping() {
        if (this.currentServer && this.currentChannel) {
            socketManager.stopTyping(
                this.currentUser.username,
                this.currentServer.server_id,
                this.currentChannel.channel_id
            );
        }
    }

    /**
     * Socket event: Connected
     */
    onSocketConnected() {
        console.log('Socket connected to server');
    }

    /**
     * Socket event: New message
     */
    onNewMessage(data) {
        uiManager.addMessage(data);
    }

    /**
     * Socket event: User joined
     */
    onUserJoined(data) {
        uiManager.showNotification(data.message, 'info');
    }

    /**
     * Socket event: User typing
     */
    onUserTyping(data) {
        uiManager.showTypingIndicator(data.username);
    }

    /**
     * Socket event: User stopped typing
     */
    onUserStoppedTyping(data) {
        uiManager.hideTypingIndicator();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FiskordApp();
    console.log('Fiskord app initialized');
});
