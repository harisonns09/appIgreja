import { API_BASE_URL, PATH_TO_PAGES } from '../index.js';


// 1. API DO MÓDULO
export const apiMinisterio = {
    // Busca TODOS
    async carregarMinisterios() {
        const token = localStorage.getItem('auth_token'); 
        try {
            const response = await fetch(`${API_BASE_URL}/ministerios`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) return await response.json();
            throw new Error("Erro na resposta");
        } catch (error) {
            console.warn("Erro ao carregar ministérios:", error);
            return [];
        }
    },
    
    // Busca UM (Para edição)
    async getById(id) {
        const token = localStorage.getItem('auth_token');
        try {
            // Assumindo endpoint /ministerio/{id} consistente com /membro/{id}
            const response = await fetch(`${API_BASE_URL}/ministerio/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) return await response.json();
        } catch (error) {
            console.error(error);
        }
        return null;
    },

    // Salva (POST ou PUT)
    async salvar(dados, id = null) {
        const token = localStorage.getItem('auth_token'); 
        const url = id ? `${API_BASE_URL}/ministerio/${id}` : `${API_BASE_URL}/ministerios`;
        const method = id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
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
            const response = await fetch(`${API_BASE_URL}/ministerio/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
            });
            return response.ok;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
};

// 2. LÓGICA DA UI
const formMinisterio = document.getElementById('add-ministry-form');
const tabelaMinisterios = document.getElementById('listaTodosMinisterios');

// --- INICIALIZAÇÃO ---
(async function init() {
    // Se estiver na tela de listagem
    if (tabelaMinisterios) {
        carregarListaNaTabela();
    }

    // Se estiver na tela de formulário (Cadastro/Edição)
    if (formMinisterio) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (id) {
            // MODO EDIÇÃO
            document.getElementById('form-title').innerText = 'Editar Ministério';
            document.getElementById('form-subtitle').innerText = 'Atualize os dados do departamento.';
            document.getElementById('btn-text').innerText = 'Atualizar Ministério';
            
            await carregarDadosEdicao(id);
        }

        configurarEnvioFormulario(id);
    }
})();

async function carregarDadosEdicao(id) {
    const ministerio = await apiMinisterio.getById(id);
    if (ministerio) {
        const f = formMinisterio;
        if(f.elements['id']) f.elements['id'].value = ministerio.id;
        if(f.elements['nome']) f.elements['nome'].value = ministerio.nome;
        if(f.elements['responsavel']) f.elements['responsavel'].value = ministerio.responsavel;
        
        // Se você descomentar os campos opcionais no HTML, descomente aqui também:
        // if(f.elements['diaReuniao']) f.elements['diaReuniao'].value = ministerio.diaReuniao;
        // if(f.elements['horario']) f.elements['horario'].value = ministerio.horario;
    } else {
        alert("Erro ao carregar dados do ministério.");
        window.location.href = 'ministerios.html';
    }
}

function configurarEnvioFormulario(idEdicao) {
    formMinisterio.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = formMinisterio.querySelector('button[type="submit"]');
        const txtOriginal = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = 'Salvando...';

        const formData = new FormData(formMinisterio);
        const dados = {
            nome: formData.get('nome'),
            liderResponsavel: formData.get('liderResponsavel'),
            // diaReuniao: formData.get('diaReuniao'),
            // horario: formData.get('horario'),
            // descricao: formData.get('descricao')
        };

        // Passa o ID se for edição (idEdicao vem da URL)
        const sucesso = await apiMinisterio.salvar(dados, idEdicao);
        
        if (sucesso) {
            alert(idEdicao ? "Ministério atualizado!" : "Ministério criado!");
            window.location.href = 'ministerios.html';
        } else {
            alert("Erro ao salvar. Verifique os dados.");
            btn.disabled = false;
            btn.innerHTML = txtOriginal;
        }
    });
}

// Lógica da Tabela (Listagem)
async function carregarListaNaTabela() {
    tabelaMinisterios.innerHTML = '<tr><td colspan="3" class="p-8 text-center text-slate-400 italic">Carregando...</td></tr>';
    
    const lista = await apiMinisterio.carregarMinisterios();
    
    if (!lista || lista.length === 0) {
        tabelaMinisterios.innerHTML = '<tr><td colspan="3" class="p-8 text-center text-slate-400 italic">Nenhum ministério cadastrado.</td></tr>';
        return;
    }

    tabelaMinisterios.innerHTML = lista.map(m => `
        <tr class="tr-std">
            <td class="td-std font-bold text-slate-800">${m.nome}</td>
            <td class="td-std text-slate-600">${m.liderResponsavel || '<span class="text-xs text-slate-400 italic">Sem líder</span>'}</td>
            <td class="td-std text-right flex justify-end gap-2">
                <a href="ministerio.html?id=${m.id}" class="btn-icon-edit" title="Editar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                </a>
                <button onclick="window.deletarMinisterio(${m.id})" class="btn-icon-danger" title="Excluir">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>
            </td>
        </tr>
    `).join('');
}

// Global para o onclick do botão excluir
window.deletarMinisterio = async (id) => {
    if (confirm("Tem certeza que deseja excluir este ministério?")) {
        const sucesso = await apiMinisterio.excluir(id);
        if (sucesso) {
            alert("Ministério excluído!");
            carregarListaNaTabela();
        } else {
            alert("Erro ao excluir.");
        }
    }
};