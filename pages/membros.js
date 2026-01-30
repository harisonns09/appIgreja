import { API_BASE_URL } from '../index.js';
import { apiMinisterio } from './ministerios.js';

// --- INIT ---
(async function init() {
    const form = document.getElementById('member-form');
    const tableList = document.getElementById('full-members-list');

    // CASO 1: Estamos na tela de Formulário (Cadastro/Edição)
    if (form) {
        // 1. Carrega Select de Ministérios
        const selectMinisterio = document.getElementById('listMinisterio');
        if (selectMinisterio) {
            await preencherSelectMinisterios(selectMinisterio);
        }

        // 2. Verifica se é Edição
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (id) {
            prepararModoEdicao(form, id);
        }

        // 3. Configura o Envio
        configurarSalvar(form, id);
    } 
    
    // CASO 2: Estamos na tela de Listagem (Tabela)
    else if (tableList) {
        await carregarListaMembros(tableList);
    }
})();

// --- FUNÇÕES DE LISTAGEM ---

async function carregarListaMembros(tableBody) {
    tableBody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-slate-400 italic">Carregando membros...</td></tr>';
    
    const token = localStorage.getItem('auth_token');
    try {
        const response = await fetch(`${API_BASE_URL}/membros`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const lista = await response.json();
            
            if (lista.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-slate-400 italic">Nenhum membro encontrado.</td></tr>';
                return;
            }

            renderizarTabela(tableBody, lista);
        } else {
            tableBody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-red-400">Erro ao carregar lista.</td></tr>';
        }
    } catch (error) {
        console.error(error);
        tableBody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-red-400">Erro de conexão.</td></tr>';
    }
}

function renderizarTabela(tbody, lista) {
    tbody.innerHTML = lista.map(m => `
        <tr class="tr-std">
            <td class="td-std">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                        ${m.nome.charAt(0)}
                    </div>
                    <div>
                        <p class="font-bold text-slate-800">${m.nome}</p>
                        <p class="text-xs text-slate-400">${m.email}</p>
                    </div>
                </div>
            </td>
            <td class="td-std">${m.ministerio || '-'}</td>
            <td class="td-std">
                <span class="px-2 py-1 rounded-full text-[10px] font-black uppercase ${m.status === 'Líder' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}">
                    ${m.status}
                </span>
            </td>
            <td class="td-std text-right flex justify-end gap-2">
                <a href="novomembro.html?id=${m.id}" class="btn-icon-edit" title="Editar">
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                </a>
                <button onclick="window.confirmDelete('${m.id}')" class="btn-icon-danger" title="Excluir">
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>
            </td>
        </tr>
    `).join('');
}

// --- FUNÇÕES DE FORMULÁRIO (Igual ao anterior) ---

function prepararModoEdicao(form, id) {
    document.getElementById('form-title').innerText = "Editar Membro";
    document.getElementById('form-subtitle').innerText = "Atualize os dados cadastrais.";
    document.getElementById('btn-text').innerText = "Atualizar Dados";

    const cpfInput = form.querySelector('[name="cpf"]');
    if (cpfInput) {
        cpfInput.setAttribute('readonly', true);
        cpfInput.classList.remove('input-std');
        cpfInput.classList.add('input-readonly');
        cpfInput.title = "O CPF não pode ser alterado.";
    }
    carregarDadosMembro(form, id);
}

async function preencherSelectMinisterios(selectElement) {
    try {
        const lista = await apiMinisterio.carregarMinisterios();
        selectElement.innerHTML = '<option value="">Selecione um ministério</option>';
        if (lista && lista.length) {
            lista.forEach(min => {
                const option = document.createElement('option');
                option.value = min.nome;
                option.textContent = min.nome;
                selectElement.appendChild(option);
            });
        }
    } catch (e) { console.warn("Erro ao carregar select ministérios"); }
}

async function carregarDadosMembro(form, id) {
    const token = localStorage.getItem('auth_token');
    try {
        const response = await fetch(`${API_BASE_URL}/membro/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const m = await response.json();
            if(form.elements['id']) form.elements['id'].value = m.id;
            if(form.elements['nome']) form.elements['nome'].value = m.nome;
            if(form.elements['cpf']) form.elements['cpf'].value = formatarStringCPF(m.cpf);
            if(form.elements['dataNascimento']) form.elements['dataNascimento'].value = m.dataNascimento ? m.dataNascimento.split('T')[0] : '';
            if(form.elements['telefone']) form.elements['telefone'].value = m.telefone;
            if(form.elements['email']) form.elements['email'].value = m.email;
            if(form.elements['ministerio']) form.elements['ministerio'].value = m.ministerio;
            if(form.elements['status']) form.elements['status'].value = m.status;
        }
    } catch (error) { console.error(error); }
}

function configurarSalvar(form, idEdicao) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const txtOriginal = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = 'Processando...';

        const formData = new FormData(form);
        const dados = Object.fromEntries(formData.entries());
        if(dados.cpf) dados.cpf = dados.cpf.replace(/\D/g, "");

        if (idEdicao && !dados.cpf) {
             const cpfVisible = form.querySelector('[name="cpf"]').value;
             dados.cpf = cpfVisible.replace(/\D/g, "");
        }

        const url = idEdicao ? `${API_BASE_URL}/membro/${idEdicao}` : `${API_BASE_URL}/membros`;
        const method = idEdicao ? 'PUT' : 'POST';
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
                alert(idEdicao ? "Dados atualizados!" : "Membro cadastrado!");
                window.location.href = 'members.html';
            } else {
                let erroMsg = "Erro ao salvar.";
                try {
                    const erroJson = await response.json();
                    if(erroJson.mensagem) erroMsg = erroJson.mensagem;
                } catch(e) { erroMsg = await response.text(); }
                alert("Atenção: " + erroMsg);
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão.");
        } finally {
            if(btn) {
                btn.disabled = false;
                btn.innerHTML = txtOriginal;
            }
        }
    });
}

// Global para o botão de excluir na tabela
window.confirmDelete = async (id) => {
    if (confirm("Tem certeza que deseja excluir?")) {
        const token = localStorage.getItem('auth_token');
        try {
            const response = await fetch(`${API_BASE_URL}/membro/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                alert("Excluído com sucesso!");
                // Recarrega a tabela
                const tableBody = document.getElementById('full-members-list');
                if(tableBody) carregarListaMembros(tableBody);
            } else {
                alert("Erro ao excluir.");
            }
        } catch(e) { console.error(e); alert("Erro de conexão."); }
    }
};

function formatarStringCPF(cpf) {
    if (!cpf) return "";
    return cpf.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

window.mascaraCPF = function(input) {
    let v = input.value.replace(/\D/g, "");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    input.value = v;
};