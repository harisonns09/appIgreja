// pages/ministerios.js
import { API_BASE_URL } from '../index.js';

// 1. EXPORTAMOS A API PARA OUTROS ARQUIVOS USAREM
export const apiMinisterio = {
    async carregarMinisterios() {
        const token = localStorage.getItem('auth_token'); 

        try {
            const response = await fetch(`${API_BASE_URL}/ministerios`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) return await response.json();
            throw new Error("Erro na resposta");
        } catch (error) {
            console.warn("Erro ao carregar ministérios:", error);
            return [];
        }
    },
    
    async salvar(dados) {
        const token = localStorage.getItem('auth_token'); 

        try {
            const response = await fetch(`${API_BASE_URL}/ministerios`, {
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
        try {
            const response = await fetch(`${API_BASE_URL}/ministerio/${id}`, {
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

// 2. LÓGICA DA TELA DE MINISTÉRIOS (Tabela e Cadastro de Ministério)
const formMinisterio = document.getElementById('add-ministry-form');
const tabelaMinisterios = document.getElementById('listaTodosMinisterios');

// Se tiver formulário de ministério na tela (novoministerio.html)
if (formMinisterio) {
    formMinisterio.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = formMinisterio.querySelector('button');
        const txtOriginal = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = 'Salvando...';

        const formData = new FormData(formMinisterio);
        const dados = {
            nome: formData.get('nome'),
            responsavel: formData.get('responsavel'),
            diaReuniao: formData.get('diaReuniao'),
            horario: formData.get('horario'),
            descricao: formData.get('descricao')
        };

        const sucesso = await apiMinisterio.salvar(dados);
        if (sucesso) {
            alert("Ministério criado!");
            window.location.href = 'ministerios.html';
        } else {
            alert("Erro ao salvar.");
            btn.disabled = false;
            btn.innerHTML = txtOriginal;
        }
    });
}

// Se tiver tabela na tela (ministerios.html)
if (tabelaMinisterios) {
    carregarListaNaTabela();
}

async function carregarListaNaTabela() {
    tabelaMinisterios.innerHTML = '<tr><td colspan="4" class="p-4 text-center">Carregando...</td></tr>';
    const lista = await apiMinisterio.carregarMinisterios();
    
    if (lista.length === 0) {
        tabelaMinisterios.innerHTML = '<tr><td colspan="4" class="p-4 text-center">Nenhum registro.</td></tr>';
        return;
    }

    tabelaMinisterios.innerHTML = lista.map(m => `
        <tr class="border-b hover:bg-slate-50">
            <td class="px-6 py-4 font-bold text-slate-800">${m.nome}</td>
            <td class="px-6 py-4 text-slate-600">${m.responsavel || '-'}</td>
            <td class="px-6 py-4 text-right">
                <button onclick="window.deletarMinisterio(${m.id})" class="text-red-500 hover:text-red-700 font-medium transition-colors">
                    Excluir
                </button>
            </td>
        </tr>
    `).join('');

}

window.deletarMinisterio = async (id) => {
    if (confirm("Tem certeza que deseja excluir este ministério?")) {
        const sucesso = await apiMinisterio.excluir(id);
        if (sucesso) {
            alert("Ministério excluído com sucesso!");
            carregarListaNaTabela();
        } else {
            alert("Erro ao excluir o ministério.");
        }
    }
};