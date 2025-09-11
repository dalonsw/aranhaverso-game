const startButton = document.getElementById('start-game-button');

async function carregarJogadoresAdmin() {
    fetch(`${host}player`)
        .then(response => response.json())
        .then(data => {
            if (!data || data.length === 0) {
                window.location.href = 'user.html';
                return;
            }
            data.sort((a, b) => (b.score * b.lifes) - (a.score * a.lifes));
            const jogadoresDiv = document.getElementById('players-list');
            data.forEach(jogador => {
                if (!document.getElementById(jogador.id)) {
                    const jogadorElemento = document.createElement('div');
                    jogadorElemento.className = 'player';
                    jogadorElemento.id = jogador.id;
                    jogadorElemento.innerHTML = `
                        <img class="user-icon" id="player-image-${jogador.id}" src="../src/images/user-icons/${jogador.profile_picture}.jpg" alt="${jogador.name}">
                        <p>${jogador.name}</p>
                        <p>${jogador.score} pontos</p>
                        <p>${jogador.lifes} vidas</p>
                        <p>${jogador.lifes > 0 ? "total: " + (jogador.score * jogador.lifes) : "Morto"}</p>
                    `;
                    jogadoresDiv.appendChild(jogadorElemento);
                }
            });
        })
        .catch(error => console.error('Erro ao carregar jogadores:', error));
}

async function comecarJogo() {
    try {
        fetch(`${host}iniciar-jogo`, {
            method: 'POST'
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao iniciar o jogo');
                } else {
                    alert('Jogo iniciado!');
                    startButton.disabled = true;
                }
            });
    } catch (error) {
        console.error('Erro ao iniciar o jogo:', error);
    }
}

async function verificarJogoIniciado() {
    try {
        const response = await fetch(`${host}iniciar-jogo`);
        if (response.ok) {
            const status = await response.json();
            return status;
        } else {
            console.error('Erro ao verificar status do jogo');
            return false;
        }
    } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
        return false;
    }
}

window.onload = () => {
    carregarJogadoresAdmin();
    setInterval(carregarJogadoresAdmin, 500);
    verificarJogoIniciado().then(iniciado => {
        if (iniciado) {
            startButton.disabled = true;
            startButton.textContent = 'Jogo Iniciado';
            startButton.style.backgroundColor = 'gray';
        }
    });
};

startButton.addEventListener('click', () => {
    comecarJogo();
    startButton.disabled = true;
    startButton.textContent = 'Jogo Iniciado';
    startButton.style.backgroundColor = 'gray';
});