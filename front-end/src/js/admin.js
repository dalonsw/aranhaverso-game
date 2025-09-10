const senha = localStorage.getItem('senhaAdmin') ? localStorage.getItem('senhaAdmin') : prompt('Digite a senha de admin:');

async function entrarAdminPage() {
    try {
        const response = await fetch(`http://localhost:3000/admin?senha=${senha}`);
        console.log(response);
        if (!response.ok) {
            localStorage.removeItem('senhaAdmin');
            throw new Error('Senha incorreta');
        } else {
            localStorage.setItem('senhaAdmin', senha);
            console.log('Acesso concedido!');
        }
    } catch {
        alert('Acesso negado!');
        window.location.href = '../index.html';
    } 
}

entrarAdminPage();

