// ==========================================
// CONFIGURAÇÃO E ESTADO
// ==========================================

export const API_BASE_URL = 'http://localhost:8080/api'; 

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
// FUNÇÕES AUXILIARES DE UI
// ==========================================

window.toggleSubmenu = (id) => {
    const submenu = document.getElementById(id);
    const arrow = document.getElementById(`arrow-${id}`);
    
    if (submenu) {
        submenu.classList.toggle('hidden');
        if (arrow) arrow.classList.toggle('rotate-180');
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
// INTERFACE DE USUÁRIO (MENU LATERAL)
// ==========================================

function injectCommonUI() {
    const sidebarContainer = document.getElementById('sidebar-container');
    const headerContainer = document.getElementById('header-container');
    
    // Detecção da página atual para marcar o menu ativo
    const path = window.location.pathname;
    const pageName = path.split('/').pop() || 'index.html';
    
    const isActive = (names) => {
        // Se for index.html ou raiz (''), marca como ativo
        if (names.includes('index.html') && (pageName === 'index.html' || pageName === '')) return true;
        return names.includes(pageName);
    };

    const activeClass = 'bg-indigo-800 text-white shadow-md';
    const inactiveClass = 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white';

    // Se estamos em páginas de admin, abre o submenu por padrão
    const isAdminOpen = isActive(['index.html', '', 'members.html', 'novomembro.html', 'pessoa.html', 'ministerios.html', 'novoministerio.html']);
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
                            <a href="${PATH_TO_PAGES}ministerios.html" class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${isActive(['ministerios.html', 'novoministerio.html']) ? activeClass : inactiveClass}">
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

    if (headerContainer) {
        // Título dinâmico do Header
        let pageTitle = 'Eclésia';
        if (pageName === 'index.html' || pageName === '') pageTitle = 'Visão Geral';
        else if (pageName === 'members.html') pageTitle = 'Gestão de Membros';
        else if (pageName === 'novomembro.html') pageTitle = 'Novo Membro';
        else if (pageName === 'pessoa.html') pageTitle = 'Editar Membro';
        else if (pageName === 'ministerios.html') pageTitle = 'Ministérios e Grupos';

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

// ==========================================
// API & AUTENTICAÇÃO
// ==========================================

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

    async saveMember(memberData) { /* lógica no arquivo especifico */ },
    
    async deleteMember(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/membro/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
            return response.ok;
        } catch (error) { return false; }
    },
    
    async getMemberById(id) { return null; }
};

// ==========================================
// FUNÇÕES DE RENDERIZAÇÃO
// ==========================================

// 1. RENDERIZAR DASHBOARD (Preenche os cards e a lista recente)
function renderDashboard() {
    const statCards = document.getElementById('stat-cards');
    const recentList = document.getElementById('recent-members-list');

    // Cards Estatísticos
    if (statCards) {
        statCards.innerHTML = `
            ${createStatCard('Total de Membros', state.members.length)}
            ${createStatCard('Ativos', state.members.filter(m => m.status !== 'Visitante').length)}
            ${createStatCard('Ministérios', state.ministerios.length)}
            ${createStatCard('Visitantes', state.members.filter(m => m.status === 'Visitante').length)}
        `;
    }

    // Lista de Membros Recentes (Exibe os últimos 5)
    if (recentList) {
        if (state.members.length === 0) {
            recentList.innerHTML = '<p class="text-center text-slate-400 py-8 italic">Nenhum registro encontrado.</p>';
            return;
        }

        // Pega os últimos 5 membros (assumindo que a ordem da lista é do mais antigo pro novo)
        // Se a API traz ordenado, use .slice(0,5). Se for invertido, use .slice(-5).reverse()
        const ultimosMembros = state.members.slice(-5).reverse();

        recentList.innerHTML = ultimosMembros.map(m => `
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
        `).join('');
    }
}

// 2. RENDERIZAR LISTA COMPLETA DE MEMBROS
function renderMembersList(query = '') {
    const listBody = document.getElementById('full-members-list');
    
    if (!listBody) return;

    const filtered = state.members.filter(m => 
        m.nome.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
        listBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-slate-400 italic">Nenhum membro encontrado.</td></tr>';
        return;
    }

    listBody.innerHTML = filtered.map(m => `
        <tr class="hover:bg-slate-50 transition-colors group border-b">
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
    `).join('');
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
// INICIALIZAÇÃO AUTOMÁTICA
// ==========================================

async function init() {
    injectCommonUI();

    // Verificação Robusta: O que tem na tela?
    const isDashboard = document.getElementById('stat-cards');
    const isMembersList = document.getElementById('full-members-list');

    // 1. Se tem cards, é o Dashboard (index.html)
    if (isDashboard) {
        await api.fetchMembers();
        await api.fetchMinisterios();
        renderDashboard();
    } 
    // 2. Se tem tabela de membros, é a lista (members.html)
    else if (isMembersList) {
        await api.fetchMembers();
        renderMembersList();
    }
}

// ==========================================
// EVENTOS GLOBAIS
// ==========================================

window.handleSearch = (q) => {
    if (document.getElementById('full-members-list')) {
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

// Tornar renderMembersList global (opcional, para segurança)
window.renderMembersList = renderMembersList;

// Inicia quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);