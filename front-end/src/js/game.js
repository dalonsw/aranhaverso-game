const idSalvado = localStorage.getItem('playerId');

function jogadorLogado() {
    if (idSalvado == null) {
        window.location.href = 'user.html';
        return;
    }
}

async function carregarJogadores() {
    fetch('http://localhost:3000/player')
        .then(response => response.json())
        .then(data => {
            if (!data || data.length === 0) {
                window.location.href = 'user.html';
                return;
            }
            const jogadoresDiv = document.getElementById('players-list');
            data.forEach(jogador => {
                const jogadorElemento = document.createElement('div');
                jogadorElemento.className = 'player';
                jogadorElemento.id = jogador.id;
                jogadorElemento.innerHTML = `
                    <img class="user-icon" id="player-image-${jogador.id}" src="../src/images/user-icons/${jogador.profile_picture}.jpg" alt="${jogador.name}">`;
                jogadoresDiv.appendChild(jogadorElemento);
                if (jogador.id == idSalvado) {
                    jogadorElemento.innerHTML += `<p style="font-weight: bold; color: #ff8800;">Você</p>`;
                } else {
                    jogadorElemento.innerHTML += `<p>${jogador.name}</p>`;
                }
            });
        })
        .catch(error => console.error('Erro ao carregar jogadores:', error));
}

jogadorLogado();
window.onload = carregarJogadores;
