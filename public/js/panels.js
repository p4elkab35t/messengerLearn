window.addEventListener('load', () => {


  document.getElementById('burger-menu-btn').addEventListener('click', () => {
    const panel = document.createElement('div');
    panel.classList.add('panel', 'right');
    panel.setAttribute('id', 'userPanel');
    fetch('/getID', {
      method: 'GET'
    }).then((response) => {
      return response.text();
    }).then((userID) => {
      fetch(`/profilePic?userID=${userID}`, {
        method: 'GET'
      }).then((response) => {
        return response.text();
      }).then((result) => {
        let panelHTML = ''
        panelHTML += `<img src="${result}" />`;
        panelHTML += `<h2>${userID}</h2>`;
        panelHTML += `<div class="panelMainContainer settingsContainer"><h2> Settings</h2>`;
        panelHTML += `<div class="switchContainer"><h3>Theme</h3><input style="visibility: hidden" type="checkbox" id="switch" class="checkbox" />
      <label for="switch"></label></div>`;
        panelHTML += `<a href="javascript:void(0)" onclick="editUserName()">Edit
        username</a>
      <a href="#" onclick="editProfilePic('${result}')">Edit profile picture</a>`;

        panelHTML += `</div>`;
        panelHTML += `<div class="block_btn btn" onclick="window.location.href='/logout'">Logout</div>`;
        panel.innerHTML = panelHTML
      });
    });
    document.body.appendChild(panel);
    document.addEventListener('click', (e) => {
      if ((e.target !== panel) &&
        (e.target !== document.getElementById('burger-menu-btn')) &&
        (e.x < panel.offsetLeft - panel.offsetWidth)) {
        console.log(e.x, e.y);
        console.log(panel.offsetLeft, panel.offsetHeight)
        panel.classList.add('panelClose');
        setTimeout(() => {
          panel.remove();
        }, 300);
      }
    })
  })
});


const openProfilePanel = (element) => {
  const userIdentifier = element.id;
  const panel = document.createElement('div');
  panel.classList.add('panel');
  panel.setAttribute('id', 'profilePanel');
  // panel.innerHTML = `<h2>${userIdentifier}</h2>`;
  fetch(`/profilePic?userID=${userIdentifier}`, {
    method: 'GET'
  }).then((response) => {
    return response.text();
  }).then((result) => {
    console.log(result);
    panel.innerHTML = `<img src="${result}" />`;
    panel.innerHTML += `
      <h2>${userIdentifier}</h2>
      <div class="panelMainContainer commonChatsContainer">
      <h3>Common chats</h3>
      <a href="javascript:void(0)" onclick="openEditWindow()">Chat for
        friends</a>
      <a href="javascript:void(0)" onclick="openEditWindow()">Study
        group</a>
      <a href="javascript:void(0)" onclick="openEditWindow()">Project
        group</a>
    </div>
      <div class="block_btn btn">Block User</div>`;
  });

  document.body.appendChild(panel);
  document.addEventListener('click', (e) => {
    if (e.target !== element && e.target !== panel) {
      panel.classList.add('panelClose');
      setTimeout(() => {
        panel.remove();
      }, 300);
    }
  });

};

const editUserName = () => {
  console.log('editUserName');
  const userPanel = document.getElementById('userPanel');
  const oldName = document.querySelector('#userPanel h2')
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('id', 'editUserName');
  input.setAttribute('value', oldName.textContent);
  userPanel.replaceChild(input, oldName);
  input.focus();
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const newName = input.value;
      fetch('/editUserName', {
        method: 'POST',
        body: newName
      }).then((response) => {
        return response.text();
      }).then((result) => {
        if (result === 'OK') {
          createAlert('Username Updated', 'success');
          const h2 = document.createElement('h2');
          h2.textContent = newName;
          userPanel.replaceChild(h2, input);
        }
        else {
          createAlert('Incorrect Username or It Alreay Exists', 'danger');
        }
      });
    }
  });
}