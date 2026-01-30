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
    if (form) {
        form.addEventListener('submit', (e) => enviarInscricao(e, eventoId));
    }
})();

async function carregarDadosEvento(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/evento/${id}`); // Ajuste para o seu endpoint correto

        if (response.ok) {
            const evento = await response.json();
            tituloEvento.textContent = evento.nomeEvento;
            infoEvento.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                ${formatarData(evento.dataEvento)} às ${evento.horario}
            `;
        } else {
            tituloEvento.textContent = "Evento não encontrado";
            if (form) form.style.display = 'none';
        }
    } catch (error) {
        console.error("Erro ao carregar evento:", error);
    }
}

async function enviarInscricao(e, eventoId) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const txtOriginal = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = 'Processando...';

    const formData = new FormData(form);
    const dadosPessoa = Object.fromEntries(formData.entries());


    if (!dadosPessoa.email) dadosPessoa.email = "sem_email@cadastro.com";

    try {
        const response = await fetch(`${API_BASE_URL}/evento/${eventoId}/inscricao`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosPessoa)
        });

        if (response.ok) {
            const resultado = await response.json();
            const numInscricao = resultado.numeroInscricao || '---';

            // CORREÇÃO: Selecionamos apenas o container do conteúdo, não o body todo
            // O '.card-panel' é a div branca onde está o formulário
            const cardPanel = document.querySelector('.card-panel');

            // Substituímos o conteúdo APENAS de dentro do cartão
            cardPanel.innerHTML = `
                <div class="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
                    
                    <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>

                    <h1 class="text-2xl font-black text-slate-800 mb-2">Inscrição Confirmada!</h1>
                    <p class="text-slate-500 mb-8 max-w-sm">Sua presença foi registrada com sucesso na lista do evento.</p>

                    <div class="bg-slate-50 border border-slate-100 rounded-xl p-6 mb-8 w-full max-w-xs relative overflow-hidden group">
                        <div class="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                        <p class="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">Seu Número</p>
                        <p class="text-3xl font-mono font-bold text-slate-800 tracking-widest">${numInscricao}</p>
                    </div>

                    <button onclick="window.location.reload()" class="btn-primary w-full max-w-xs">
                        Nova Inscrição
                    </button>
                    
                </div>
            `;

            // Rola a tela para o topo para garantir que o usuário veja a mensagem
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const erro = await response.json();
            alert("Atenção: " + (erro.mensagem || "Erro ao realizar inscrição. Verifique os dados."));
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão com o servidor.");
    } finally {
        // Se o elemento ainda existir (não foi substituído pelo sucesso)
        if (document.body.contains(btn)) {
            btn.disabled = false;
            btn.innerHTML = txtOriginal;
        }
    }
}

function formatarData(dataString) {
    if (!dataString) return "";
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
}