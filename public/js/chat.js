window.addEventListener('load', () => {
    const socket = io('127.0.0.1:3000', { path: '/chat/socket/' });
    const currentUser = document.createElement('div');
    currentUser.style.display = 'none';
    socket.on('connect', () => {
        console.log('Connected to chat socket');
        const chatId = window.location.search.split('=')[1];
        socket.emit('joinChat', { chatId: `${chatId}` });
    });
    socket.once('chatData', (chatData) => {
        console.log(chatData);
        currentUser.innerHTML = chatData.username;
        let chatContainer = document.getElementById('messageArea');
        chatData.chatData.messages.forEach((message) => {
            let messageContainer = document.createElement('div');
            messageContainer.classList.add('speech-bubble');

            if (message.senderId === chatData.username) {
                messageContainer.classList.add('right');
                messageContainer.innerHTML = `<div class="messageAuthor">You</div><p>${message.content}</p>`;
            }
            else {
                messageContainer.innerHTML = `<div class="messageAuthor" onclick="openProfilePanel(this)" id="${message.senderId}">${message.senderId}</div><p>${message.content}</p>`;
            }
            chatContainer.appendChild(messageContainer);
            document.getElementById('messageArea').scrollTop = document.getElementById('messageArea').scrollHeight;
        });
    });
    socket.on('newMessage', (message) => {
        let chatContainer = document.getElementById('messageArea');
        let messageContainer = document.createElement('div');
        messageContainer.classList.add('speech-bubble');
        if (message.senderId === currentUser.innerHTML) {
            messageContainer.classList.add('right');
            messageContainer.innerHTML = `<div class="messageAuthor">You</div><p>${message.message}</p>`;
        }
        else {
            messageContainer.innerHTML = `<div class="messageAuthor" onclick="openProfilePanel(this)" id="${message.senderId}">${message.senderId}</div><p>${message.message}</p>`;
        }
        chatContainer.appendChild(messageContainer);
        document.getElementById('messageArea').scrollTop = document.getElementById('messageArea').scrollHeight;
    });
    const sendBtn = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');

    document.getElementById('messageInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMsg();
    });
    const sendMsg = () => {
        console.log('Sending message');
        const message = messageInput.value;
        if (message.trim() == '') return createAlert('Message cannot be empty', 'danger');
        if (currentUser.innerHTML === '') {
            currentUser.innerHTML = chatData.username;
        }
        messageInput.value = '';
        socket.emit('sendMessage', { chatId: window.location.search.split('=')[1], message });
    }
    sendBtn.addEventListener('click', (e) => { sendMsg() });
});