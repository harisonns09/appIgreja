// pages/novoministerio.js

// Importa a ferramenta de API do arquivo principal
import { api } from '../index.js';
import { API_BASE_URL } from '../index.js';

const form = document.getElementById('add-ministry-form');
const listBody = document.getElementById('listaTodosMinisterios');

const apiMinisterio = {

    async carregarMinisterios() {
        try {
            const response = await fetch(`${API_BASE_URL}/ministerios`);
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error("Erro na resposta do servidor");
            }
        } catch (error) {
            console.warn("Backend offline ou erro ao carregar ministérios.");
            return [];
        }
    },
            
};

if (form) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // UI: Feedback visual imediato (Opcional, mas recomendado)
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerText = "Salvando...";

        const formData = new FormData(form);
        
        const ministryData = {
            nome: formData.get('nome'),
            responsavel: formData.get('responsavel')
            
        };

        // Usa a API importada do index.js
        const success = await api.saveMinistry(ministryData);
        
        if (success) {
            alert("Ministério criado com sucesso!");
            window.location.href = 'ministerios.html';
        } else {
            alert("Erro ao salvar.");
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    });
}

const tabela = document.getElementById('listaTodosMinisterios');

if (tabela) {
    initListagem();
}

async function initListagem() {
    tabela.innerHTML = '<tr><td colspan="4" class="px-6 py-12 text-center text-slate-400">Carregando...</td></tr>';
    
    const dados = await apiMinisterio.carregarMinisterios();
    renderizarTabela(dados);
}

function renderizarTabela(lista) {
    if (!lista || lista.length === 0) {
        tabela.innerHTML = '<tr><td colspan="4" class="px-6 py-12 text-center text-slate-400 italic">Nenhum ministério encontrado.</td></tr>';
        return;
    }

    tabela.innerHTML = lista.map(m => `
        <tr class="hover:bg-slate-50 transition-colors group">
            <td class="px-6 py-4">
                <div class="flex flex-col">
                    <span class="font-bold text-slate-800">${m.nome}</span>
                    
                </div>
            </td>
            <td class="px-6 py-4 text-slate-600">${m.responsavel || '-'}</td>
            <td class="px-6 py-4 text-right">
                <button onclick="window.confirmarExclusao('${m.id}')" class="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg" title="Excluir">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>
            </td>
        </tr>
    `).join('');
}
