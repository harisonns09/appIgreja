
// Configuração do Backend Java
//const API_BASE_URL = 'http://localhost:8080/api';
const API_BASE_URL = 'https://gen-lang-client-0788356664.rj.r.appspot.com/api';

const state = {
    members: [],
    searchQuery: '',
    isLoading: false
};

// Funções de Comunicação com o Backend
const api = {
    async fetchMembers() {
        state.isLoading = true;
        try {
            const response = await fetch(`${API_BASE_URL}/membros`);
            if (response.ok) {
                state.members = await response.json();
            } else {
                throw new Error("Erro na resposta do servidor");
            }
        } catch (error) {
            console.warn("Backend offline ou erro na conexão. Usando dados fictícios.");
            state.members = [
                { id: '1', nome: 'Membro Exemplo 1', ministerio: 'Louvor', status: 'Membro', email: 'exemplo1@email.com' },
                { id: '2', nome: 'Membro Exemplo 2', ministerio: 'Infantil', status: 'Líder', email: 'exemplo2@email.com' }
            ];
        } finally {
            state.isLoading = false;
        }
    },

    async saveMember(memberData) {
        try {
            const response = await fetch(`${API_BASE_URL}/membros`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(memberData)
            });
            return response.ok;
        } catch (error) {
            console.error("Erro ao salvar:", error);
            return false;
        }
    },

    async deleteMember(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/membro/${id}`, {
                method: 'DELETE'
            });
            return response.ok;
        } catch (error) {
            console.error("Erro ao excluir:", error);
            return false;
        }
    },

    async getMemberById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/membro/${id}`);
            
            if (response.ok) return await response.json();
            throw new Error("Membro não encontrado");
        } catch (error) {
            console.error("Erro ao buscar membro:", error);
            return null;
        }
    },

    async updateMember(id, memberData) {
        try {
            const response = await fetch(`${API_BASE_URL}/membro/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(memberData)
            });
            return response.ok;
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            return false;
        }
    }
};

// Variável de controle
let isMobileMenuOpen = false;

function injectCommonUI() {
    const sidebarContainer = document.getElementById('sidebar-container');
    const headerContainer = document.getElementById('header-container');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // 1. SIDEBAR (Tailwind - Com lógica de deslizar)
    if (sidebarContainer) {
        sidebarContainer.innerHTML = `
            <div id="mobile-overlay" onclick="toggleMenu()" class="fixed inset-0 bg-black/50 z-20 hidden md:hidden transition-opacity"></div>

            <aside id="sidebar" class="fixed inset-y-0 left-0 z-30 w-64 bg-indigo-900 text-white flex flex-col h-full shadow-2xl transform -translate-x-full md:translate-x-0 md:relative transition-transform duration-300 ease-in-out">
                <div class="p-6 md:p-8 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#312e81" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        </div>
                        <h1 class="text-2xl font-black tracking-tighter">Eclésia</h1>
                    </div>
                    <button onclick="toggleMenu()" class="md:hidden text-indigo-300 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <nav class="flex-1 mt-2 px-4 space-y-2 overflow-y-auto">
                    <a href="index.html" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${currentPage === 'index.html' ? 'bg-indigo-800 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-800/50'}">Dashboard</a>
                    <a href="members.html" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${currentPage === 'members.html' ? 'bg-indigo-800 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-800/50'}">Membros</a>
                    <a href="novomembro.html" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${currentPage === 'novomembro.html' ? 'bg-indigo-800 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-800/50'}">Cadastrar</a>
                </nav>

                <div class="p-6 border-t border-indigo-800/50 mt-auto">
                    <div class="flex items-center gap-3 px-2">
                        <div class="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-[10px] font-bold">ADM</div>
                        <div class="overflow-hidden">
                            <p class="text-xs font-bold truncate">Administrador</p>
                            <p class="text-[10px] text-indigo-400">Online</p>
                        </div>
                    </div>
                </div>
            </aside>
        `;
    }

    // 2. HEADER (Tailwind - Com botão hambúrguer)
    if (headerContainer) {
        const titles = { 'index.html': 'Visão Geral', 'members.html': 'Lista de Membros', 'novomembro.html': 'Novo Registro', 'editarmembro.html': 'Editar Registro' };
        const pageTitle = Object.keys(titles).find(k => currentPage.includes(k)) ? titles[Object.keys(titles).find(k => currentPage.includes(k))] : 'Eclésia';

        headerContainer.innerHTML = `
            <header class="bg-white border-b px-4 md:px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <div class="flex items-center gap-3">
                    <button onclick="toggleMenu()" class="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <h2 class="text-lg md:text-xl font-extrabold text-slate-800 truncate">${pageTitle}</h2>
                </div>
                </header>
        `;
    }
}

// Função para animar o menu
window.toggleMenu = () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    isMobileMenuOpen = !isMobileMenuOpen;
    if (isMobileMenuOpen) {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
    } else {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    }
};

// Renderização do Dashboard
function renderDashboard() {
    const statCards = document.getElementById('stat-cards');
    const recentList = document.getElementById('recent-members-list');
    
    if (statCards) {
        statCards.innerHTML = `
            ${createStatCard('Total de Membros', state.members.length)}
            ${createStatCard('Ativos no Sistema', state.members.filter(m => m.status !== 'Visitante').length)}
            ${createStatCard('Ministérios Ativos', 4)}
            ${createStatCard('Visitantes Recentes', 0)}
        `;
    }

    if (recentList) {
        recentList.innerHTML = state.members.length ? state.members.slice(0, 5).map(m => `
            <div class="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">
                        ${m.nome.charAt(0)}
                    </div>
                    <div>
                        <p class="font-bold text-sm text-slate-800">${m.nome}</p>
                        <p class="text-[10px] text-slate-400 uppercase tracking-wider">${m.ministerio}</p>
                    </div>
                </div>
                <span class="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 text-slate-600 uppercase">${m.status}</span>
            </div>
        `).join('') : '<p class="text-center text-slate-400 py-8 italic">Nenhum membro encontrado.</p>';
    }
}

// Renderização da Lista de Membros
function renderMembersList(query = '') {
    const listBody = document.getElementById('full-members-list');
    if (!listBody) return;

    const filtered = state.members.filter(m => m.nome.toLowerCase().includes(query.toLowerCase()));

    listBody.innerHTML = filtered.length ? filtered.map(m => `
        <tr class="hover:bg-slate-50 transition-colors group">
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        ${m.nome.charAt(0)}
                    </div>
                    <div>
                        <p class="font-bold text-slate-800">${m.nome}</p>
                        <p class="text-xs text-slate-400">${m.email}</p>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 text-slate-600">${m.ministerio}</td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-full text-[10px] font-black uppercase ${m.status === 'Líder' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}">
                    ${m.status}
                </span>
            </td>
            <td class="px-6 py-4 text-right flex justify-end gap-3">
                <a href="pessoa.html?id=${m.id}" class="text-indigo-400 hover:text-indigo-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                </a>

                <button onclick="window.confirmDelete('${m.id}')" class="text-red-400 hover:text-red-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>
            </td>
        </tr>
    `).join('') : '<tr><td colspan="4" class="px-6 py-12 text-center text-slate-400 italic">Nenhum membro encontrado.</td></tr>';
}

// Configuração do Formulário
function setupForm() {
    const form = document.getElementById('add-member-form');
    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        
        // Mapeamento manual para garantir que o JSON combine com a classe Pessoa.java
        const memberData = {
            nome: formData.get('nome'),
            dataNascimento: formData.get('dataNascimento'), // HTML YYYY-MM-DD bate com o Java
            email: formData.get('email'),
            telefone: formData.get('telefone'),
            ministerio: formData.get('ministerio'),
            status: formData.get('status') // Aceita os dois nomes
        };

        console.log("Enviando para o Java:", memberData); // Debug para você ver o que está saindo

        const success = await api.saveMember(memberData);
        if (success) {
            alert("Membro cadastrado com sucesso!");
            window.location.href = 'members.html';
        } else {
            alert("Erro ao salvar. Verifique o console do Java para detalhes (F12 no navegador também).");
        }
    };
}

// Funções Auxiliares
function createStatCard(title, value) {
    return `
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">${title}</p>
            <p class="text-3xl font-black text-indigo-900">${value}</p>
        </div>
    `;
}



// Eventos Globais expostos ao Window
window.handleSearch = (q) => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === 'members.html') {
        renderMembersList(q);
    }
};

window.confirmDelete = async (id) => {
    if (confirm("Tem certeza que deseja excluir este registro do banco de dados?")) {
        const ok = await api.deleteMember(id);
        if (ok) {
            await api.fetchMembers();           
            renderMembersList(); 
            
            alert("Registro excluído com sucesso!");
        } else {
            alert("Não foi possível excluir o membro.");
        }
    }
};



// Inicialização Principal
async function init() {
    injectCommonUI();
    
    // Verifica qual página está aberta
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (currentPage === 'index.html') {
        await api.fetchMembers();
        renderDashboard();
    } 
    else if (currentPage === 'members.html') {
        await api.fetchMembers();
        renderMembersList();
    } 
    else if (currentPage === 'novomembro.html') {
        setupForm();
    }
    // NOVA LINHA AQUI:
    else if (currentPage.includes('pessoa.html')) {
        setupEditForm();
    }
}

//Carregamento e edicao de membro
async function setupEditForm() {
    const form = document.getElementById('edit-member-form');
    if (!form) return;

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        alert("ID não fornecido!");
        window.location.href = 'members.html';
        return;
    }

    const member = await api.getMemberById(id);
    if (!member) {
        alert("Erro ao carregar dados do membro.");
        return;
    }

    // Preenche o formulário automaticamente
    // (O nome dos inputs no HTML deve ser igual às chaves do JSON)
    Object.keys(member).forEach(key => {
        if (form.elements[key]) {
            form.elements[key].value = member[key];
        }
    });


    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const dataToUpdate = Object.fromEntries(formData.entries());

        const success = await api.updateMember(id, dataToUpdate);
        if (success) {
            alert("Dados atualizados com sucesso!");
            window.location.href = 'members.html';
        } else {
            alert("Erro ao atualizar.");
        }
    };
}

document.addEventListener('DOMContentLoaded', init);
