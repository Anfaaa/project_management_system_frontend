// webSockets.js

export const connectToWebSocket = (onMessageCallback) => {
    const token = localStorage.getItem('access_token');  // Получаем токен из localStorage
    if (!token) {
        console.error('Token not found');
        return;
    }

    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/projects/?token=${token}`);

    socket.onopen = () => {
        console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
        console.log('Message received:', event.data);
        const data = JSON.parse(event.data);
        if (data.type === 'project_list') {
            onMessageCallback(data.projects);
        }
    };

    socket.onclose = (event) => {
        console.log('WebSocket connection closed', event);
    };

    socket.onerror = (error) => {
        console.error('WebSocket error', error);
    };

    return socket;
};