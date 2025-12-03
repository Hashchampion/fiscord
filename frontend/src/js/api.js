/**
 * Fiskord API Client
 * Handles all REST API calls to the backend
 */

class APIClient {
    constructor(baseURL = 'http://localhost:5000/api') {
        this.baseURL = baseURL;
    }

    /**
     * Make HTTP request
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Authentication Endpoints
     */
    async login(username) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username }),
        });
    }

    async register(username) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username }),
        });
    }

    async logout() {
        return this.request('/auth/logout', {
            method: 'POST',
        });
    }

    /**
     * Server Endpoints
     */
    async getServers() {
        return this.request('/servers');
    }

    async createServer(serverName, description = '') {
        return this.request('/servers', {
            method: 'POST',
            body: JSON.stringify({ 
                server_name: serverName,
                description,
            }),
        });
    }

    async getServer(serverId) {
        return this.request(`/servers/${serverId}`);
    }

    async deleteServer(serverId) {
        return this.request(`/servers/${serverId}`, {
            method: 'DELETE',
        });
    }

    async joinServer(serverId, userId) {
        return this.request(`/servers/${serverId}/join`, {
            method: 'POST',
            body: JSON.stringify({ user_id: userId }),
        });
    }

    async leaveServer(serverId, userId) {
        return this.request(`/servers/${serverId}/leave`, {
            method: 'POST',
            body: JSON.stringify({ user_id: userId }),
        });
    }

    /**
     * Message Endpoints
     */
    async getMessages(channelId) {
        return this.request(`/messages/${channelId}`);
    }

    async sendMessage(content, senderId, channelId) {
        return this.request('/messages', {
            method: 'POST',
            body: JSON.stringify({ 
                content,
                sender_id: senderId,
                channel_id: channelId,
            }),
        });
    }

    async deleteMessage(messageId) {
        return this.request(`/messages/${messageId}`, {
            method: 'DELETE',
        });
    }
}

// Create global API client instance
const api = new APIClient();
