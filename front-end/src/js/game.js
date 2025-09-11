function jogadorLogado() {
    if (idSalvado == null) {
    window.location.href = 'user.html';
    }
}

async function jogoIniciado() {
    try {
        const response = await fetch(`${host}/iniciar-jogo`);
        console.log(response);
        if (response.ok) {
            window.location.href = 'game.html';
        } else {
            console.error('Jogo não iniciado');
        }
    } catch (error) {
        console.error('Erro ao verificar o estado do jogo:', error);
    }
}

jogadorLogado();
setInterval(jogoIniciado, 1000);

