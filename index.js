// ==========================================
// CONFIGURAÇÃO E ESTADO
// ==========================================

export const API_BASE_URL = 'http://localhost:8080/api';
//export const API_BASE_URL = 'https://gen-lang-client-0788356664.rj.r.appspot.com/api';


const state = {
    members: [],
    ministerios: [],
    searchQuery: '',
    isLoading: false
};

let isMobileMenuOpen = false;

// DETECÇÃO DE CAMINHOS
const isPagesFolder = window.location.pathname.includes('/pages/');
const PATH_TO_ROOT = isPagesFolder ? '../' : './';
const PATH_TO_PAGES = isPagesFolder ? './' : './pages/';

// ==========================================
// FUNÇÕES AUXILIARES DE UI (NOVAS)
// ==========================================

// Função para abrir/fechar submenus
window.toggleSubmenu = (id) => {
    const submenu = document.getElementById(id);
    const arrow = document.getElementById(`arrow-${id}`);

    if (submenu) {
        // Toggle da visibilidade
        submenu.classList.toggle('hidden');

        // Toggle da rotação da seta (se existir)
        if (arrow) {
            arrow.classList.toggle('rotate-180');
        }
    }
};

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
// INTERFACE DE USUÁRIO (UI) - MENUS DROPDOWN
// ==========================================

function injectCommonUI() {
    const sidebarContainer = document.getElementById('sidebar-container');
    const headerContainer = document.getElementById('header-container');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Helpers de Estilo
    const isActive = (pages) => pages.includes(currentPage);
    const activeClass = 'bg-indigo-800 text-white shadow-md';
    const inactiveClass = 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white';

    // --- LÓGICA DE ESTADO INICIAL DOS DROPDOWNS ---
    // Verifica qual grupo deve começar aberto baseado na página atual

    const adminPages = ['index.html', '', 'members.html', 'novomembro.html', 'pessoa.html', 'ministerios.html'];
    const isAdminOpen = adminPages.includes(currentPage);

    // Como não temos páginas reais de eventos ainda, deixamos fechado por padrão
    const isEventosOpen = false;

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

                <nav class="flex-1 mt-2 px-4 space-y-4 overflow-y-auto">
                    
                    <div>
                        <button onclick="toggleSubmenu('submenu-admin')" class="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-indigo-400 uppercase tracking-wider hover:text-white transition-colors">
                            <span>Administração</span>
                            <svg id="arrow-submenu-admin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-200 ${isAdminOpen ? 'rotate-180' : ''}"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </button>
                        
                        <div id="submenu-admin" class="mt-2 space-y-1 ${isAdminOpen ? '' : 'hidden'}">
                            
                            <a href="${PATH_TO_ROOT}index.html" class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${isActive(['index.html', '']) ? activeClass : inactiveClass}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                Visão Geral
                            </a>

                            <a href="${PATH_TO_PAGES}members.html" class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${isActive(['members.html', 'novomembro.html', 'pessoa.html']) ? activeClass : inactiveClass}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                Membros
                            </a>

                            <a href="${PATH_TO_PAGES}ministerios.html" class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${isActive(['ministerios.html']) ? activeClass : inactiveClass}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                Ministérios
                            </a>
                        </div>
                    </div>

                    <div>
                        <button onclick="toggleSubmenu('submenu-eventos')" class="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-indigo-400 uppercase tracking-wider hover:text-white transition-colors">
                            <span>Eventos & Culto</span>
                            <svg id="arrow-submenu-eventos" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-200 ${isEventosOpen ? 'rotate-180' : ''}"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </button>

                        <div id="submenu-eventos" class="mt-2 space-y-1 ${isEventosOpen ? '' : 'hidden'}">
                            
                            <a href="#" class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm text-indigo-200 hover:bg-indigo-800/50 hover:text-white opacity-60">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                Calendário
                            </a>

                            <a href="#" class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm text-indigo-200 hover:bg-indigo-800/50 hover:text-white opacity-60">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                Escalas
                            </a>
                        </div>
                    </div>

                     <div class="pt-4 mt-4 border-t border-indigo-800/50">
                        <button onclick="window.logout()" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm text-red-300 hover:bg-red-900/30 hover:text-red-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            Sair do Sistema
                        </button>
                    </div>

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

    // Header render logic... (Inalterado)
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

// --- Cabeçalhos e Auth (Lógica inalterada) ---
function getAuthHeaders() {
    const token = localStorage.getItem('auth_token');

    if (!token && !window.location.pathname.includes('login.html')) {
        const loginPath = window.location.pathname.includes('/pages/') ? 'login.html' : 'pages/login.html';
        window.location.href = loginPath;
        return {};
    }

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

window.logout = function () {
    localStorage.removeItem('auth_token');
    const loginPath = window.location.pathname.includes('/pages/') ? 'login.html' : 'pages/login.html';
    window.location.href = loginPath;
}

// ==========================================
// API - MÉTODOS PARA INTERAÇÃO COM BACKEND
// ==========================================
export const api = {
    async fetchMembers() {
        state.isLoading = true;
        try {
            const response = await fetch(`${API_BASE_URL}/membros`, { headers: getAuthHeaders() });
            if (response.status === 403) { window.logout(); return; }
            if (response.ok) { state.members = await response.json(); }
        } catch (error) { console.warn("Erro ao buscar membros", error); }
        finally { state.isLoading = false; }
    },

    async fetchMinisterios() {
        state.isLoading = true;
        try {
            const response = await fetch(`${API_BASE_URL}/ministerios`, { headers: getAuthHeaders() });
            if (response.ok) { state.ministerios = await response.json(); }
        } catch (error) { console.warn("Erro ao carregar ministérios"); }
        finally { state.isLoading = false; }
    },

    async saveMember(memberData) {
        // (Sua lógica existente)
    },
    async deleteMember(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/membro/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
            return response.ok;
        } catch (error) { return false; }
    },
    async getMemberById(id) {
        // (Sua lógica existente)
        return null;
    }
};

// ==========================================
// RENDERIZAÇÃO E INIT (Mantidos do seu código original)
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
    // ... render recent list
}

function createStatCard(title, value) {
    return `
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">${title}</p>
            <p class="text-3xl font-black text-indigo-900">${value}</p>
        </div>
    `;
}

// Inicialização
async function init() {
    injectCommonUI();

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (currentPage === 'index.html') {
        await api.fetchMembers();
        await api.fetchMinisterios();
        renderDashboard();
    } else if (currentPage === 'members.html') {
        await api.fetchMembers();
        if (typeof renderMembersList === 'function') renderMembersList();
    }
}

// Handlers globais
window.handleSearch = (q) => {
    if (window.location.pathname.includes('members.html')) {
        // renderMembersList(q); // Certifique-se que essa função existe no escopo ou é importada
    }
};

window.confirmDelete = async (id) => {
    if (confirm("Tem certeza que deseja excluir?")) {
        const ok = await api.deleteMember(id);
        if (ok) {
            await api.fetchMembers();
            // renderMembersList(); 
            alert("Excluído com sucesso!");
        } else {
            alert("Erro ao excluir.");
        }
    }
};

document.addEventListener('DOMContentLoaded', init);