window.addEventListener('load', () => {
    fetch('/chatList', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        console.log(response);
        return response.json();
    }).then((data) => {
        if (data.error) {
            return createAlert(data.error, 'danger');
        }
        console.log(data);
        const chatContainer = document.getElementById('chatContainer');
        data.chats.forEach((chat) => {
            const chatItem = document.createElement('div');
            chatItem.classList.add('chat');
            chatItem.setAttribute('id', chat.chatId);
            console.log(chat.chatId)
            const chatName = chat.participants.filter((participant) => participant !== data.username);
            const lastMessage = chat.lastMessage;
            const chatNameContainer = document.createElement('h2');
            chatNameContainer.setAttribute('id', chat.chatId);
            const lastMessageContainer = document.createElement('p');
            lastMessageContainer.setAttribute('id', chat.chatId);
            chatName.forEach((name) => {
                chatNameContainer.innerHTML += `${name}`;
                if (chatName.indexOf(name) < chatName.length - 1) {
                    chatNameContainer.innerHTML += ', ';
                }
            })
            lastMessageContainer.innerHTML = lastMessage;

            chatItem.appendChild(chatNameContainer);
            chatItem.appendChild(lastMessageContainer);
            chatContainer.appendChild(chatItem);
            chatItem.addEventListener('click', (e) => {
                console.log(e.target);
                console.log('You clicked on ' + e.target.id)
                // alert('You clicked on ' + e.target.id);
                if (e.target.id === '') return;
                window.location.href = '/chat?chatId=' + e.target.id;
                // fetch('chat', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify({ chatId: chat._id })
                // }).then((response) => {
                //     return response.json();
                // }).then((data) => {
                //     console.log(data);
                //     window.location.href = '/chat';
                // });
            });
        });
    });
});