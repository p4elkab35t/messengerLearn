window.addEventListener('load', () => {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alertBox');
    alertBox.setAttribute('id', 'alertBox');
    document.body.prepend(alertBox);
    // const style = document.createElement('style');
    // style.setAttribute('type', 'text/css');
    // style.setAttribute('src', '/css/alert.css');
    // document.head.appendChild(style);

});

const createAlert = (message, type) => {
    const alert = document.createElement('div');
    alert.classList.add('alert', type);
    alert.innerHTML = message;
    const alertBox = document.querySelector('#alertBox');
    alertBox.appendChild(alert);
    setTimeout(() => {
        alert.remove();
    }, 3000);
};

// createAlert('Hello', 'success');