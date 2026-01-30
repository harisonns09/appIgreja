// pages/eventos.js
import { API_BASE_URL } from '../index.js';
import { apiMinisterio } from './ministerios.js';
import { PATH_TO_PAGES } from '../index.js';


const tabelaEventos = document.getElementById('listaEventos');

// INICIALIZAÇÃO
(async function init() {
    console.clear();
    console.log("=== INICIANDO GESTÃO DE EVENTOS ===");

    const form = document.getElementById('form-evento');
    const selectMinisterio = document.getElementById('select-ministerio');
    const titleElement = document.getElementById('form-title');
    const btnSubmit = document.getElementById('btn-submit');

    if (!form) return;

    // 1. Carrega a lista de ministérios primeiro
    await preencherSelectMinisterios(selectMinisterio);

    // 2. Verifica a URL para saber o modo (Criar ou Editar)
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        // --- MODO EDIÇÃO ---
        console.log("Modo: EDIÇÃO (ID " + id + ")");

        // Ajusta textos visuais
        titleElement.textContent = "Editar Evento";
        btnSubmit.textContent = "Atualizar Evento";

        // Carrega os dados do backend
        await carregarDadosEvento(id, form);

        // Configura o salvar para PUT
        configurarSalvar(form, true, id);
    } else {
        // --- MODO CRIAÇÃO ---
        console.log("Modo: NOVO CADASTRO");

        // Ajusta textos visuais
        titleElement.textContent = "Novo Evento";
        btnSubmit.textContent = "Criar Evento";

        // Configura o salvar para POST
        configurarSalvar(form, false, null);
    }
})();

// --- FUNÇÕES ---

export const apiEventos = {
    async carregarEventos() {
        const token = localStorage.getItem('auth_token');

        try {
            const response = await fetch(`${API_BASE_URL}/eventos`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) return await response.json();
            throw new Error("Erro na resposta");
        } catch (error) {
            console.warn("Erro ao carregar eventos:", error);
            return [];
        }
    },

    async salvar(dados) {
        const token = localStorage.getItem('auth_token');

        try {
            const response = await fetch(`${API_BASE_URL}/eventos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dados)
            });
            return response.ok;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    async excluir(id) {
        const token = localStorage.getItem('auth_token');
        try {
            const response = await fetch(`${API_BASE_URL}/evento/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            return response.ok;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
};

async function preencherSelectMinisterios(selectElement) {
    if (!selectElement) return;

    const lista = await apiMinisterio.carregarMinisterios();
    selectElement.innerHTML = '<option value="">Selecione um ministério</option>';

    lista.forEach(min => {
        const option = document.createElement('option');
        option.value = min.nome;
        option.textContent = min.nome;
        selectElement.appendChild(option);
    });
}

async function carregarDadosEvento(id, form) {
    const token = localStorage.getItem('auth_token');

    try {
        // ATENÇÃO: Certifique-se que o endpoint '/eventos/{id}' existe no seu backend
        const response = await fetch(`${API_BASE_URL}/evento/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const evento = await response.json();

            // Preenche os campos
            form.querySelector('[name="id"]').value = evento.id;
            form.querySelector('[name="nomeEvento"]').value = evento.nomeEvento;
            form.querySelector('[name="ministerioResponsavel"]').value = evento.ministerioResponsavel;
            form.querySelector('[name="descricao"]').value = evento.descricao;
            form.querySelector('[name="dataEvento"]').value = evento.dataEvento;

            // Formatação de Data (yyyy-MM-dd)
            if (evento.dataEvento) {
                form.querySelector('[name="dataEvento"]').value = evento.dataEvento.split('T')[0];
            }

            const containerInscritos = document.getElementById('container-inscritos');
            const tbody = document.getElementById('lista-inscritos');
            const contador = document.getElementById('contador-inscritos');


            if (evento.inscricoes && evento.inscricoes.length > 0) {
                // Mostra a tabela
                containerInscritos.classList.remove('hidden');
                contador.innerText = evento.inscricoes.length;

                // Cria as linhas da tabela
                tbody.innerHTML = evento.inscricoes.map(pessoa => `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-4 py-3 font-medium text-slate-800">${pessoa.nome}</td>
                    <td class="px-4 py-3 text-slate-600">${pessoa.telefone}</td>
                    <td class="px-4 py-3 text-slate-500">${pessoa.email}</td>
                </tr>
            `).join('');
            } else {
                // Se não tiver inscritos, mostra a área mas com aviso ou esconde a tabela
                containerInscritos.classList.remove('hidden');
                tbody.innerHTML = `<tr><td colspan="3" class="px-4 py-8 text-center text-slate-400 italic">Nenhuma inscrição realizada ainda.</td></tr>`;
            }



        } else {
            alert("Erro ao carregar evento: " + response.status);
            //window.location.href = 'eventos.html'; // Volta se não achar
        }
    } catch (error) {
        console.error("Erro:", error);
    }
}

function configurarSalvar(form, isEditMode, id) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const txtOriginal = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Salvando...';

        const formData = new FormData(form);
        const dados = Object.fromEntries(formData.entries());

        // Define URL e Método
        const url = isEditMode
            ? `${API_BASE_URL}/eventos/${id}`
            : `${API_BASE_URL}/eventos`;

        const method = isEditMode ? 'PUT' : 'POST';
        const token = localStorage.getItem('auth_token');

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dados)
            });

            if (response.ok) {
                alert(isEditMode ? "Evento atualizado!" : "Evento criado!");
                // Redireciona para a lista (assumindo que você criará uma lista de eventos depois)
                // Se não tiver lista, recarrega a página limpa
                window.location.href = 'eventos.html';
            } else {
                let erroMsg = "Erro ao salvar.";
                try {
                    const erroJson = await response.json();
                    if (erroJson.mensagem) erroMsg = erroJson.mensagem;
                } catch (e) { }

                alert("Atenção: " + erroMsg);
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão.");
        } finally {
            btn.disabled = false;
            btn.textContent = txtOriginal;
        }
    });
}

if (tabelaEventos) {
    carregarListaEventos();
}

async function carregarListaEventos() {
    tabelaEventos.innerHTML = '<tr><td colspan="4" class="p-4 text-center">Carregando...</td></tr>';
    const lista = await apiEventos.carregarEventos();

    if (lista.length === 0) {
        tabelaEventos.innerHTML = '<tr><td colspan="4" class="p-4 text-center">Nenhum registro.</td></tr>';
        return;
    }

    tabelaEventos.innerHTML = lista.map(evento => `
        <tr class="tr-std">
            <td class="td-std font-bold text-slate-800">${evento.nomeEvento}</td>
            <td class="td-std">
                <span class="px-2 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-bold uppercase">
                    ${evento.ministerioResponsavel || '-'}
                </span>
            </td>
            <td class="td-std text-sm">${evento.inscricoes ? evento.inscricoes.length : 0}</td>
            <td class="td-std text-right flex gap-2 items-center justify-end">    
                    <a href="${PATH_TO_PAGES}inscricao.html?eventoId=${evento.id}" 
                       class="text-green-500 hover:text-green-700 transition-colors p-1" 
                       title="Gerenciar Inscrições">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                    </a>

                    <a href="${PATH_TO_PAGES}evento.html?id=${evento.id}" 
                       class="text-indigo-400 hover:text-indigo-600 transition-colors p-1"
                       title="Editar Detalhes">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                    </a>

                    <button onclick="window.confirmDeleteEvento(${evento.id})" 
                            class="text-red-400 hover:text-red-600 transition-colors p-1"
                            title="Excluir Evento">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
            
            </td>
        </tr>
    `).join('');

}

// Adicione esta função ao final do arquivo para funcionar o clique do botão excluir
window.confirmDeleteEvento = async (id) => {
    if (confirm("Tem certeza que deseja cancelar este evento?")) {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/evento/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                alert("Evento excluído!");
                carregarListaEventos(); // Recarrega a tabela
            } else {
                alert("Erro ao excluir.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão.");
        }
    }
};

function formatarData(dataString) {
    if (!dataString) return "";
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
}