/**
 * Fiskord UI Manager
 * Handles all UI interactions and DOM updates
 */

class UIManager {
    constructor() {
        this.currentUser = null;
        this.currentServer = null;
        this.currentChannel = null;
        this.servers = [];
        this.typingTimeout = null;
        this.isTyping = false;

        this.cacheElements();
        this.attachEventListeners();
    }

    /**
     * Cache frequently used DOM elements
     */
    cacheElements() {
        // Pages
        this.loginPage = document.getElementById('loginPage');
        this.chatPage = document.getElementById('chatPage');

        // Forms
        this.loginForm = document.getElementById('loginForm');
        this.messageForm = document.getElementById('messageForm');
        this.createServerForm = document.getElementById('createServerForm');

        // Inputs
        this.usernameInput = document.getElementById('username');
        this.serverAddressInput = document.getElementById('serverAddress');
        this.messageInput = document.getElementById('messageInput');
        this.newServerNameInput = document.getElementById('newServerName');
        this.serverDescriptionInput = document.getElementById('serverDescription');

        // Display elements
        this.currentUsername = document.getElementById('currentUsername');
        this.channelName = document.getElementById('channelName');
        this.channelMembers = document.getElementById('channelMembers');
        this.messagesList = document.getElementById('messagesList');
        this.serversList = document.getElementById('serversList');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.typingUser = document.getElementById('typingUser');

        // Buttons
        this.createServerBtn = document.getElementById('createServerBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.serverSettingsBtn = document.getElementById('serverSettingsBtn');

        // Modals
        this.createServerModal = document.getElementById('createServerModal');
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.messageForm.addEventListener('submit', (e) => this.handleSendMessage(e));
        this.createServerForm.addEventListener('submit', (e) => this.handleCreateServer(e));
        this.createServerBtn.addEventListener('click', () => this.showCreateServerModal());
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
        
        // Modal close buttons
        document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
            btn.addEventListener('click', () => this.closeModals());
        });

        // Typing indicator
        this.messageInput.addEventListener('input', () => this.handleTyping());
    }

    /**
     * Show login page
     */
    showLoginPage() {
        this.loginPage.classList.add('active');
        this.chatPage.classList.remove('active');
    }

    /**
     * Show chat page
     */
    showChatPage() {
        this.loginPage.classList.remove('active');
        this.chatPage.classList.add('active');
    }

    /**
     * Handle login form submission
     */
    async handleLogin(e) {
        e.preventDefault();
        const username = this.usernameInput.value.trim();
        const serverAddress = this.serverAddressInput.value.trim();

        if (!username) {
            alert('Please enter a username');
            return;
        }

        // Emit login event to main app
        window.dispatchEvent(new CustomEvent('userLogin', {
            detail: { username, serverAddress }
        }));
    }

    /**
     * Handle send message
     */
    handleSendMessage(e) {
        e.preventDefault();
        const content = this.messageInput.value.trim();

        if (!content || !this.currentServer || !this.currentChannel) {
            return;
        }

        window.dispatchEvent(new CustomEvent('sendMessage', {
            detail: { content }
        }));

        this.messageInput.value = '';
        this.messageInput.focus();
        this.stopTyping();
    }

    /**
     * Handle typing
     */
    handleTyping() {
        clearTimeout(this.typingTimeout);

        if (!this.isTyping && this.messageInput.value.trim()) {
            this.isTyping = true;
            window.dispatchEvent(new CustomEvent('userTyping', {}));
        }

        this.typingTimeout = setTimeout(() => {
            if (this.isTyping) {
                this.isTyping = false;
                this.stopTyping();
            }
        }, 2000);
    }

    /**
     * Stop typing notification
     */
    stopTyping() {
        if (this.isTyping) {
            this.isTyping = false;
            window.dispatchEvent(new CustomEvent('userStoppedTyping', {}));
        }
    }

    /**
     * Handle create server
     */
    async handleCreateServer(e) {
        e.preventDefault();
        const serverName = this.newServerNameInput.value.trim();
        const description = this.serverDescriptionInput.value.trim();

        if (!serverName) {
            alert('Please enter a server name');
            return;
        }

        window.dispatchEvent(new CustomEvent('createServer', {
            detail: { serverName, description }
        }));

        this.newServerNameInput.value = '';
        this.serverDescriptionInput.value = '';
        this.closeModals();
    }

    /**
     * Handle logout
     */
    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            window.dispatchEvent(new CustomEvent('userLogout', {}));
        }
    }

    /**
     * Show create server modal
     */
    showCreateServerModal() {
        this.createServerModal.classList.add('active');
    }

    /**
     * Close all modals
     */
    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    /**
     * Add message to chat
     */
    addMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = 'message';
        
        const isOwnMessage = message.sender_id === this.currentUser.user_id;
        if (isOwnMessage) {
            messageEl.classList.add('own-message');
        }

        const timestamp = new Date(message.timestamp).toLocaleTimeString();
        
        messageEl.innerHTML = `
            <div class="message-header">
                <span class="message-author">${message.sender_id}</span>
                <span class="message-time">${timestamp}</span>
            </div>
            <div class="message-content">${this.escapeHtml(message.content)}</div>
        `;

        this.messagesList.appendChild(messageEl);
        this.messagesList.scrollTop = this.messagesList.scrollHeight;
    }

    /**
     * Show typing indicator
     */
    showTypingIndicator(username) {
        this.typingIndicator.classList.add('active');
        this.typingUser.textContent = username;
    }

    /**
     * Hide typing indicator
     */
    hideTypingIndicator() {
        this.typingIndicator.classList.remove('active');
    }

    /**
     * Add server to list
     */
    addServerToList(server) {
        const serverEl = document.createElement('li');
        serverEl.className = 'server-item';
        serverEl.textContent = server.server_name;
        serverEl.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('selectServer', {
                detail: { server }
            }));
        });
        this.serversList.appendChild(serverEl);
    }

    /**
     * Clear chat messages
     */
    clearMessages() {
        this.messagesList.innerHTML = '';
    }

    /**
     * Update current channel display
     */
    updateChannelDisplay(channelName, memberCount) {
        this.channelName.textContent = `# ${channelName}`;
        this.channelMembers.textContent = `${memberCount} members`;
    }

    /**
     * Set current user
     */
    setCurrentUser(user) {
        this.currentUser = user;
        this.currentUsername.textContent = user.username;
    }

    /**
     * Escape HTML special characters
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        // Can be enhanced with a toast notification system
    }
}

// Create global UI manager instance
const uiManager = new UIManager();
