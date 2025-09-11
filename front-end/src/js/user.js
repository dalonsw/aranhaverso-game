const icons = "../src/images/user-icons/";
const userIcon = document.getElementById('user-icon');
const iniciarBtn = document.getElementById('start-button');

async function criarPlayer() {
    const name = document.getElementById('username').value;
    const profile_picture = userIcon.src.split('/').pop().split('.')[0];

    const response = await fetch(`${host}player`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, profile_picture })
    });
    const data = await response.json();
    const playerId = data.id;
    localStorage.setItem('playerId', playerId);
    window.location.href = 'fila.html';
}

const randomIcon = () => {
    const iconAtual = userIcon.src.split('/').pop().split('.')[0];
    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * 10) + 1;
        userIcon.src = `${icons}${randomNumber}.jpg`;
    } while (iconAtual == randomNumber);
};

userIcon.addEventListener('click', () => {
    randomIcon();
});

iniciarBtn.addEventListener('click', (event) => {
    const playerId = localStorage.getItem('playerId');
    if (playerId == null) {
        event.preventDefault();
        criarPlayer();
    } else {
        window.location.href = 'fila.html';
    }
});

window.onload = () => {
    const playerId = localStorage.getItem('playerId');
    if (playerId != null) {
        window.location.href = 'fila.html';
    }
    randomIcon();
};
