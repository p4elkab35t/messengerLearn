const register_btn = document.getElementById('register-btn');
document.getElementById('register-btn').addEventListener('click', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log(username, password);

    fetch('/register', {
        method: 'POST',
        body: new FormData(document.getElementById('register-details'))
    }).then(response => {
        if (response.status === 200) {
            createAlert('Registration successful', 'success');
            window.location.href = '/chat';
        } else {
            response.text().then(text => {
                // create_alert(text, response.status);
                createAlert(text, 'danger')
            });
        }
    });
});

const create_alert = (message, code) => {
    if (code != 200) {
        let labels = document.querySelectorAll("label");
        let inputs = document.querySelectorAll(".input-group input");
        let alert_message = document.createElement("h3");
        alert_message.innerHTML = message;
        for (let i = 0; i < 2; i++) {
            labels[i].style = "color: red;"
            inputs[i].style = "border: 1px solid red;"
        }
        alert_message.style = "color: red;"
        document.querySelector("h1").insertAdjacentElement("afterend", alert_message)


    }
}