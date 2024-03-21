window.addEventListener('load', () => {
    const createButton = document.getElementById('create-chat-btn');
    createButton.addEventListener('click', () => {
        const createChatwindow = document.createElement('div');
        createChatwindow.classList.add('modal', 'floating');
        createChatwindow.setAttribute('id', 'createChatWindow');
        const idEntry = document.createElement('input');
        idEntry.setAttribute('type', 'text');
        idEntry.setAttribute('id', 'userIDEntry');
        idEntry.setAttribute('placeholder', 'User ID');
        const createChatButton = document.createElement('button');
        createChatButton.setAttribute('id', 'createChat');
        createChatButton.setAttribute('onclick', 'createChat()');
        createChatButton.innerHTML = 'Create chat';
        createChatwindow.appendChild(idEntry);
        createChatwindow.appendChild(createChatButton);
        document.body.appendChild(createChatwindow);

        window.addEventListener('click', (e) => {
            // console.log(e.target, createChatwindow, idEntry, createButton);
            if (e.target !== createChatwindow && e.target !== idEntry && e.target !== createChatButton && e.target !== createButton) {
                createChatwindow.classList.add('close');
                setTimeout(() => {
                    createChatwindow.remove();
                }, 500);
                // console.log('removed');
            }
        });
    });
})

const createChat = () => {
    const userID = document.getElementById('userIDEntry').value;
    fetch('/createChat', {
        method: 'POST',
        body: userID
    }).then((response) => {
        return response.text();
    }).then((data) => {
        if (data === false || data.error || data === 'false' || data === 'Error') {
            return createAlert("Error occured detected duplicate chat", 'danger');
        }
        console.log(data);
        window.location.href = '/chat?chatId=' + data;
    });
};