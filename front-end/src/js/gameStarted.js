const playerId = localStorage.getItem('playerId');

if (!playerId) {
    window.location.href = '../index.html';
}

async function fetchPlayerData() {
    try {
        const response = await fetch(`${host}player/${playerId}`);
        if (response.ok) {
            const playerData = await response.json();
            document.getElementById('user-name').textContent = playerData.name;
            document.getElementById('user-icon').src = `../src/images/user-icons/${playerData.profile_picture}.jpg`;
            const lifesContainer = document.querySelector('.player-lifes');
            lifesContainer.innerHTML = '';
            for (let i = 0; i < playerData.lifes; i++) {
                const lifeImg = document.createElement('img');
                lifeImg.src = '../src/images/spider-heart.webp';
                lifeImg.alt = 'Life';
                lifeImg.style.width = '30px';
                lifeImg.style.height = '30px';
                lifeImg.style.margin = '0 5px';
                lifesContainer.appendChild(lifeImg);
            }
            document.getElementById('player-pontos').textContent = playerData.score;
        } else {
            console.error('Erro ao buscar dados do jogador');
        }
    } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
    }
}

function proximaFase(numeroFase) {
    console.log(numeroFase);
    localStorage.setItem('faseAtual', numeroFase);
    const faseAnterior = document.querySelector(`.fase${numeroFase - 1}`);
    const faseAtual = document.querySelector(`.fase${numeroFase}`);
    if (faseAnterior) {
        faseAnterior.style.opacity = '0';
        faseAnterior.style.visibility = 'hidden';
        setTimeout(() => {
            faseAnterior.style.display = 'none';
            if (faseAtual) {
                faseAtual.style.display = 'block';
                setTimeout(() => {
                    faseAtual.style.opacity = '1';
                    faseAtual.style.visibility = 'visible';
                }, 50);
            }
            desbloquearBotaoAoFinalizarVideo(`video-fase${numeroFase - 1}`, `botao-codar${numeroFase - 1}`);
            iniciarVideoAoCarregar(`video-fase${numeroFase - 1}`);
        }, 500);
    } else if (faseAtual) {
        faseAtual.style.display = 'block';
        setTimeout(() => {
            faseAtual.style.opacity = '1';
            faseAtual.style.visibility = 'visible';
        }, 50);
    }
}

document.querySelector('.intro button').addEventListener('click', () => {
    localStorage.setItem('faseAtual', 1);
    document.querySelector('.intro').style.opacity = '0';
    document.querySelector('.intro').style.visibility = 'hidden';
    setTimeout(() => {
            document.querySelector('.intro').style.display = 'none';
    }, 500);
    setTimeout(() => {
        proximaFase(1);
    }, 500);
});

const faseAtual = parseInt(localStorage.getItem('faseAtual'));
if (faseAtual > 0) {
    document.querySelector('.intro').style.display = 'none';
    proximaFase(faseAtual);
}

function iniciarVideoAoCarregar(videoId) {
    const video = document.getElementById(videoId);
    console.log(videoId)
    if (video) {
        video.play();
    }
    video.addEventListener('click', () => {
        video.play();
    });
}

function desbloquearBotaoAoFinalizarVideo(videoId, botaoId) {
    const video = document.getElementById(videoId);
    const botao = document.getElementById(botaoId);

    if (video && botao) {
        video.addEventListener('ended', () => {
            botao.disabled = false;
            botao.style.backgroundColor = '#FF8800';
            botao.style.cursor = 'pointer';
        });
    }
}

async function verificarRespostas() {
    try {
        const response = await fetch(`${host}respostas`);
            if (!response.ok) {
                throw new Error('Erro ao buscar respostas corretas');
            }
            return response.json();
        } catch (error) {
            console.error('Erro ao conectar ao servidor:', error);
            return null;
        }
    }

const enviarResposta = (fase) => {
    const respostasInputs = document.querySelectorAll(`.codigo-fase${fase} input[type="text"]`);
    const tamanho = respostasInputs.length;
    const respostas = [];

    respostasInputs.forEach(input => {
        respostas.push(input.value.trim());
    });

    if (respostas.includes('') || respostas.length !== tamanho) {
        alert('Por favor, preencha todas as respostas antes de enviar.');
        return;
    }

    verificarRespostas().then(respostasCorretas => {
        const respostasCertas = respostasCorretas.fases[fase].respostas;
        console.log(respostas.toString());
        console.log(respostasCertas.toString());
        let respostasCertasCount = 0;
        
        for (let i = 0; i < respostasCertas.length; i++) {
            if (respostas[i] === respostasCertas[i]) {
                console.log(`Resposta ${i + 1} correta`);
                respostasCertasCount++;
            } else {
                console.log(`Resposta ${i + 1} incorreta`);
            }
        }

        console.log(`Total de respostas corretas: ${respostasCertasCount}`);

        if (respostasCertasCount === respostasCertas.length) {
            alert('Parabéns! Você acertou todas as respostas.');
            adicionarPontos(10 * respostasCertasCount);
            proximaFase(fase + 3);
        } else if (respostasCertasCount > respostasCertas.length - 2) {
            alert(`Você acertou ${respostasCertasCount} de ${tamanho} respostas.`);
            adicionarPontos(10 * respostasCertasCount);
            proximaFase(fase + 3);
        } else {
            alert(`Você errou a maioria das perguntas! Você perderá uma vida. :(`);
            perderVida();
        }
    });
}

const perderVida = async () => {
    try {
        const response = await fetch(`${host}player/${playerId}/perder-vida`, {
            method: 'POST'
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            if (data.newScore == 0) {
                alert('Você perdeu todas as vidas! Voltando para a tela inicial.');
                localStorage.removeItem('playerId');
                localStorage.removeItem('faseAtual');
                window.location.href = '../index.html';
            }
            fetchPlayerData();
        } else {
            console.error('Erro ao perder vida');
        }
    } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
    }
}

const adicionarPontos = async (pontos) => {
    try {
        const response = await fetch(`${host}player/${playerId}/adicionar-pontos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pontos })
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            fetchPlayerData();
        } else {
            console.error('Erro ao adicionar pontos');
        }
    } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
    }
}

const verStats = async () => {
    try {
        const response = await fetch(`${host}player/${playerId}`);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            document.getElementById('stats-pontos-valor').innerText = data.score;
            document.getElementById('stats-vidas-valor').innerText = data.lifes;
            document.getElementById('stats-total-valor').innerText = data.score * data.lifes;
            return data;
        } else {
            console.error('Erro ao buscar stats');
        }
    } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
    }
}

verStats();
fetchPlayerData();