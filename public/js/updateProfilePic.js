window.addEventListener('load', () => {

});

const editProfilePic = (previous) => {
    const profilePicWindow = document.createElement('div');
    profilePicWindow.classList.add('modal', 'floating');
    profilePicWindow.setAttribute('id', 'profilePicWindow');
    const profilePicPreview = document.createElement('img');
    profilePicPreview.setAttribute('id', 'profilePicPreview');
    profilePicPreview.setAttribute('src', `${previous}`);
    const profilePicInput = document.createElement('input');
    profilePicInput.setAttribute('type', 'file');
    profilePicInput.setAttribute('id', 'profilePicInput');
    const profilePicButton = document.createElement('button');
    profilePicButton.setAttribute('id', 'profilePicButton');
    profilePicButton.setAttribute('onclick', 'updateProfilePic()');
    profilePicButton.innerHTML = 'Update profile picture';
    const closeButton = document.createElement('div');
    closeButton.innerHTML = '✖'
    closeButton.classList.add('closeBtn');
    closeButton.setAttribute('onclick', 'closeProfilePicWindow()');
    profilePicWindow.appendChild(closeButton);
    profilePicWindow.appendChild(profilePicPreview);
    profilePicWindow.appendChild(profilePicInput);
    profilePicWindow.appendChild(profilePicButton);
    document.body.appendChild(profilePicWindow);
    profilePicInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            profilePicPreview.src = reader.result;
        };
        if (file) {
            reader.readAsDataURL(file);
            profilePicButton.innerHTML = 'Save profile picture';
            profilePicButton.setAttribute('onclick', 'saveProfilePic()');
        } else {
            profilePicPreview.src = '';
        }
    });

};

const saveProfilePic = () => {
    const profilePicInput = document.getElementById('profilePicInput');
    const profilePic = profilePicInput.files[0];
    const formData = new FormData();
    formData.append('profilePic', profilePic);
    fetch('/profilePic', {
        method: 'POST',
        body: formData
    }).then((response) => {
        return response.text();
    }).then((data) => {
        if (data.error) {
            return createAlert(data.error, 'danger');
        }
        createAlert(data, 'success');
        document.getElementById('profilePicPreview').src = data;
        document.getElementById('profilePicButton').innerHTML = 'Update profile picture';
        document.getElementById('profilePicButton').setAttribute('onclick', 'updateProfilePic()');
    });
}

const closeProfilePicWindow = () => {
    const profilePicWindow = document.getElementById('profilePicWindow');
    profilePicWindow.remove();
}
