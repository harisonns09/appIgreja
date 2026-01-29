import { API_BASE_URL } from '../index.js';

// Elementos da Tela
const tituloEvento = document.getElementById('titulo-evento');
const infoEvento = document.getElementById('info-evento');
const form = document.getElementById('form-auto-inscricao');

// Inicialização
(async function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = urlParams.get('eventoId');

    if (!eventoId) {
        alert("Link de evento inválido.");
        return;
    }

    // 1. Carrega dados do evento (Endpoint Público GET)
    await carregarDadosEvento(eventoId);

    // 2. Configura o envio do formulário
    form.addEventListener('submit', (e) => enviarInscricao(e, eventoId));
})();

async function carregarDadosEvento(id) {
    try {
        // Nota: Não enviamos Header Authorization aqui, pois é público
        const response = await fetch(`${API_BASE_URL}/evento/${id}`);
        
        if (response.ok) {
            const evento = await response.json();
            tituloEvento.textContent = evento.nomeEvento;
            infoEvento.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                ${formatarData(evento.dataEvento)} às ${evento.horario}
            `;
        } else {
            tituloEvento.textContent = "Evento não encontrado";
            form.style.display = 'none';
        }
    } catch (error) {
        console.error("Erro ao carregar evento:", error);
    }
}

async function enviarInscricao(e, eventoId) {
    e.preventDefault();
    const btn = form.querySelector('button');
    const txtOriginal = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = 'Processando...';

    const formData = new FormData(form);
    const dadosPessoa = Object.fromEntries(formData.entries());

    // ADICIONA CAMPOS OBRIGATÓRIOS DO DTO AUTOMATICAMENTE
    // O backend exige esses campos, então fixamos como "Visitante"
    dadosPessoa.ministerio = "Visitante";
    dadosPessoa.status = "Visitante";
    
    // Tratamento de email vazio (Backend exige NotBlank? Se sim, coloque um dummy ou ajuste o Backend)
    // Assumindo que seu DTO exige email:
    if (!dadosPessoa.email) dadosPessoa.email = "sem_email@cadastro.com";

    try {
        const response = await fetch(`${API_BASE_URL}/eventos/${eventoId}/inscricao-publica`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Sem Auth Header
            body: JSON.stringify(dadosPessoa)
        });

        if (response.ok) {
            // Sucesso!
            document.body.innerHTML = `
                <div class="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-slate-50">
                    <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </div>
                    <h1 class="text-3xl font-black text-slate-800 mb-2">Inscrição Confirmada!</h1>
                    <p class="text-slate-600 mb-8">Sua presença foi registrada com sucesso.</p>
                    <button onclick="window.location.reload()" class="text-indigo-600 font-bold hover:underline">Nova Inscrição</button>
                </div>
            `;
        } else {
            const erro = await response.json();
            alert("Atenção: " + (erro.mensagem || "Erro ao realizar inscrição. Verifique os dados."));
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão com o servidor.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = txtOriginal;
    }
}

function formatarData(dataString) {
    if(!dataString) return "";
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
}