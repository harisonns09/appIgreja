// ==========================================
// CONFIGURAÇÃO E ESTADO
// ==========================================

// Alternar entre Local e Produção conforme necessário
//export const API_BASE_URL = 'http://localhost:8080/api'; 
export const API_BASE_URL = 'https://gen-lang-client-0788356664.rj.r.appspot.com/api';

const state = {
    members: [],
    ministerios: [],
    searchQuery: '',
    isLoading: false
};

// Variável de controle do Menu Mobile
let isMobileMenuOpen = false;

// DETECÇÃO DE CAMINHOS (IMPORTANTE PARA A NOVA ESTRUTURA)
// Verifica se estamos dentro da pasta '/pages/'
const isPagesFolder = window.location.pathname.includes('/pages/');

// Define os prefixos para corrigir os links
// Se estou em 'pages/', volto um nível (../) para ir à raiz.
const PATH_TO_ROOT = isPagesFolder ? '../' : './';
// Se estou na raiz, entro em 'pages/' para ir aos módulos.
const PATH_TO_PAGES = isPagesFolder ? './' : './pages/';


// --- Gerar Cabeçalhos com Token ---
function getAuthHeaders() {
    const token = localStorage.getItem('auth_token');

    // Se não tiver token, manda para o login (proteção de rota)
    if (!token && !window.location.pathname.includes('login.html')) {
        // Ajuste o caminho dependendo de onde o script roda
        const loginPath = window.location.pathname.includes('/pages/') ? 'login.html' : 'pages/login.html';
        window.location.href = loginPath;
        return {};
    }

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // O padrão Bearer é essencial
    };
}

window.logout = function () {
    localStorage.removeItem('auth_token');
    const loginPath = window.location.pathname.includes('/pages/') ? 'login.html' : 'pages/login.html';
    window.location.href = loginPath;
}

// ==========================================
// API - COMUNICAÇÃO COM BACKEND
// ==========================================
export const api = {
    async fetchMembers() {
        state.isLoading = true;
        try {
            // ADICIONAR headers: getAuthHeaders()
            const response = await fetch(`${API_BASE_URL}/membros`, {
                headers: getAuthHeaders()
            });

            // Se o token expirou (Backend devolve 403)
            if (response.status === 403) {
                window.logout();
                return;
            }

            if (response.ok) {
                state.members = await response.json();
            }
        } catch (error) {
            console.warn("Erro ao buscar membros", error);
        } finally {
            state.isLoading = false;
        }
    },

    async fetchMinisterios() {
        state.isLoading = true;
        try {
            const response = await fetch(`${API_BASE_URL}/ministerios`);
            if (response.ok) {
                state.ministerios = await response.json();
            } else {
                throw new Error("Erro na resposta do servidor");
            }
        } catch (error) {
            console.warn("Erro ao carregar ministérios:");

        } finally {
            state.isLoading = false;
        }
    },

    async saveMember(memberData) {
        try {
            const response = await fetch(`${API_BASE_URL}/membros`, {
                method: 'POST',
                headers: getAuthHeaders(),
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
                method: 'DELETE',
                headers: getAuthHeaders(),
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
    },

    async saveMinistry(ministryData) {
        try {
            const response = await fetch(`${API_BASE_URL}/ministerios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ministryData)
            });
            return response.ok;
        } catch (error) {
            console.error("Erro ao salvar ministério:", error);
            return false;
        }
    }
};

// ==========================================
// INTERFACE DE USUÁRIO (UI)
// ==========================================

function injectCommonUI() {
    const sidebarContainer = document.getElementById('sidebar-container');
    const headerContainer = document.getElementById('header-container');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

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
                    <a href="${PATH_TO_ROOT}index.html" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${currentPage === 'index.html' || currentPage === '' ? 'bg-indigo-800 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-800/50'}">
                        Visão Geral
                    </a>
                    
                    <a href="${PATH_TO_PAGES}members.html" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${currentPage === 'members.html' || currentPage === 'novomembro.html' || currentPage === 'pessoa.html' ? 'bg-indigo-800 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-800/50'}">
                        Membros
                    </a>

                    <a href="${PATH_TO_PAGES}ministerios.html" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${currentPage === 'ministerios.html' ? 'bg-indigo-800 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-800/50'}">
                        Ministérios
                    </a>
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

    if (headerContainer) {
        const titles = {
            'index.html': 'Visão Geral',
            'members.html': 'Gestão de Membros',
            'novomembro.html': 'Novo Membro',
            'pessoa.html': 'Editar Membro',
            'ministerios.html': 'Ministérios e Grupos'
        };
        const pageKey = Object.keys(titles).find(k => currentPage.includes(k)) || 'index.html';
        const pageTitle = titles[pageKey] || 'Eclésia';

        headerContainer.innerHTML = `
            <header class="bg-white border-b px-4 md:px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <div class="flex items-center gap-3">
                    <button onclick="toggleMenu()" class="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <h2 class="text-lg md:text-xl font-extrabold text-slate-800 truncate">${pageTitle}</h2>
                </div>
                <div class="hidden md:block w-8"></div>
            </header>
        `;
    }
}

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

// ==========================================
// RENDERIZAÇÃO DE DADOS
// ==========================================

function renderDashboard() {
    const statCards = document.getElementById('stat-cards');
    const recentList = document.getElementById('recent-members-list');

    if (statCards) {
        statCards.innerHTML = `
            ${createStatCard('Total de Membros', state.members.length)}
            ${createStatCard('Ativos', state.members.filter(m => m.status !== 'Visitante').length)}
            ${createStatCard('Ministérios', state.ministerios.length)}
            ${createStatCard('Visitantes', 0)}
        `;
    }

    if (recentList) {
        recentList.innerHTML = state.members.length ? state.members.slice(0, 2).map(m => `
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
        `).join('') : '<p class="text-center text-slate-400 py-8 italic">Nenhum registro recente.</p>';
    }
}

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
                <a href="${PATH_TO_PAGES}pessoa.html?id=${m.id}" class="text-indigo-400 hover:text-indigo-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                </a>
                <button onclick="window.confirmDelete('${m.id}')" class="text-red-400 hover:text-red-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>
            </td>
        </tr>
    `).join('') : '<tr><td colspan="4" class="px-6 py-12 text-center text-slate-400 italic">Nenhum membro encontrado.</td></tr>';
}

function createStatCard(title, value) {
    return `
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">${title}</p>
            <p class="text-3xl font-black text-indigo-900">${value}</p>
        </div>
    `;
}


// ==========================================
// INICIALIZAÇÃO E EVENTOS
// ==========================================

window.handleSearch = (q) => {
    if (window.location.pathname.includes('members.html')) {
        renderMembersList(q);
    }
};

window.confirmDelete = async (id) => {
    if (confirm("Tem certeza que deseja excluir?")) {
        const ok = await api.deleteMember(id);
        if (ok) {
            await api.fetchMembers();
            renderMembersList();
            alert("Excluído com sucesso!");
        } else {
            alert("Erro ao excluir.");
        }
    }
};

async function init() {
    injectCommonUI();

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Roteamento Simples
    if (currentPage === 'index.html') {
        await api.fetchMembers();
        await api.fetchMinisterios();
        renderDashboard();
    }
    else if (currentPage === 'members.html') {
        await api.fetchMembers();
        renderMembersList();
    }

}

window.mascaraCPF = function (input) {
    let value = input.value;

    // 1. Remove tudo que não é número
    value = value.replace(/\D/g, "");

    // 2. Adiciona o primeiro ponto (após o 3º dígito)
    value = value.replace(/(\d{3})(\d)/, "$1.$2");

    // 3. Adiciona o segundo ponto (após o 6º dígito)
    value = value.replace(/(\d{3})(\d)/, "$1.$2");

    // 4. Adiciona o traço (após o 9º dígito)
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    // 5. Atualiza o valor no campo
    input.value = value;
}

document.addEventListener('DOMContentLoaded', init);