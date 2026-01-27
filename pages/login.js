// pages/login.js
import { API_BASE_URL } from '../index.js';

// 1. Pegamos o formulário
const form = document.getElementById('login-form');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede a página de recarregar

        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        
        // Feedback visual de carregamento
        btn.disabled = true;
        btn.innerText = 'Entrando...';

        // 2. Captura os dados (login e password)
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // O Java espera: { "login": "...", "password": "..." }
        // Seu HTML já tem name="login" e name="password", então 'data' já está correto.

        try {
            console.log("Tentando login em:", `${API_BASE_URL}/auth/login`);

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                
                // 3. Salva o Token (Crucial para o index.js funcionar)
                localStorage.setItem('auth_token', result.token);

                // Notificação de Sucesso (Toastify)
                if (typeof Toastify === 'function') {
                    Toastify({
                        text: "Login realizado com sucesso!",
                        duration: 3000,
                        style: { background: "linear-gradient(to right, #00b09b, #96c93d)" }
                    }).showToast();
                }

                // 4. Redireciona para a Home (Raiz)
                setTimeout(() => {
                    // Sai da pasta 'pages' e vai para o index.html na raiz
                    window.location.href = '../index.html'; 
                }, 1000);

            } else {
                // Se o Java retornou 403 ou 400
                throw new Error('Usuário ou senha incorretos');
            }

        } catch (error) {
            console.error("Erro no login:", error);
            
            if (typeof Toastify === 'function') {
                Toastify({
                    text: "Erro: Verifique suas credenciais.",
                    duration: 3000,
                    style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" }
                }).showToast();
            } else {
                alert("Erro: Verifique suas credenciais.");
            }
        } finally {
            // Restaura o botão
            btn.disabled = false;
            btn.innerText = originalText;
        }
    });
} else {
    console.error("Erro: Formulário 'login-form' não encontrado no HTML.");
}