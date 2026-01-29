// ==========================================
// CONFIGURAÇÃO E ESTADO
// ==========================================

//export const API_BASE_URL = 'http://localhost:8080/api'; 
export const API_BASE_URL = 'https://gen-lang-client-0788356664.rj.r.appspot.com/api';


const state = {
    members: [],
    eventos: [], // Novo estado para eventos
    ministerios: [],
    isLoading: false
};

let isMobileMenuOpen = false;

// DETECÇÃO DE CAMINHOS
const isPagesFolder = window.location.pathname.includes('/pages/');
const PATH_TO_ROOT = isPagesFolder ? '../' : './';
export const PATH_TO_PAGES = isPagesFolder ? './' : './pages/';

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
// MENU LATERAL (UI)
// ==========================================

function injectCommonUI() {
    const sidebarContainer = document.getElementById('sidebar-container');
    const headerContainer = document.getElementById('header-container');
    
    const token = localStorage.getItem('auth_token');
    const isLoggedIn = !!token;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isActive = (pages) => pages.includes(currentPage);
    const activeClass = 'bg-indigo-800 text-white shadow-md';
    const inactiveClass = 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white';

    const isAdminOpen = isActive(['members.html', 'novomembro.html', 'pessoa.html', 'ministerios.html']);
    
    // Agora o index.html é a página de Eventos principal também
    const isEventosOpen = isActive(['index.html', '', 'eventos.html', 'inscricao.html']);

    if (sidebarContainer) {
        let menuHTML = `
            <div id="mobile-overlay" onclick="toggleMenu()" class="fixed inset-0 bg-black/50 z-20 hidden md:hidden transition-opacity"></div>
            <aside id="sidebar" class="fixed inset-y-0 left-0 z-30 w-64 bg-indigo-900 text-white flex flex-col h-full shadow-2xl transform -translate-x-full md:translate-x-0 md:relative transition-transform duration-300 ease-in-out">
                <div class="p-6 md:p-8 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#312e81" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        </div>
                        <h1 class="text-2xl font-black tracking-tighter">Eclésia</h1>
                    </div>
                    <button onclick="toggleMenu()" class="md:hidden text-indigo-300 hover:text-white">X</button>
                </div>
                <nav class="flex-1 mt-2 px-4 space-y-4 overflow-y-auto">
                    
                    <a href="${PATH_TO_ROOT}index.html" class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${isActive(['index.html', '']) ? activeClass : inactiveClass}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        Agenda de Eventos
                    </a>
        `;

        // ADMINISTRAÇÃO (SÓ SE LOGADO)
        if (isLoggedIn) {
            menuHTML += `
                <div>
                    <button onclick="toggleSubmenu('submenu-admin')" class="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-indigo-400 uppercase tracking-wider hover:text-white transition-colors">
                        <span>Administração</span>
                        <svg id="arrow-submenu-admin" class="transition-transform duration-200 ${isAdminOpen ? 'rotate-180' : ''}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                    <div id="submenu-admin" class="mt-2 space-y-1 ${isAdminOpen ? '' : 'hidden'}">
                        <a href="${PATH_TO_PAGES}members.html" class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${isActive(['members.html', 'novomembro.html', 'pessoa.html']) ? activeClass : inactiveClass}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            Gestão de Membros
                        </a>
                        <a href="${PATH_TO_PAGES}ministerios.html" class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${isActive(['ministerios.html', 'novoministerio.html']) ? activeClass : inactiveClass}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            Gestão de Ministérios
                        </a>
                        <a href="${PATH_TO_PAGES}eventos.html" class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${isActive(['eventos.html']) ? activeClass : inactiveClass}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            Gerenciar Eventos
                        </a>
                    </div>
                </div>
            `;
        }

        menuHTML += `</nav><div class="p-6 border-t border-indigo-800/50 mt-auto">`;
        
        if (isLoggedIn) {
            menuHTML += `
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-[10px] font-bold">ADM</div>
                        <div class="overflow-hidden"><p class="text-xs font-bold truncate">Admin</p><p class="text-[10px] text-green-400">Online</p></div>
                    </div>
                    <button onclick="window.logout()" class="text-red-300 hover:text-white" title="Sair"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg></button>
                </div>
            `;
        } else {
            menuHTML += `<a href="${PATH_TO_PAGES}login.html" class="flex items-center justify-center gap-2 w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-bold transition-colors">Administrativo</a>`;
        }

        menuHTML += `</div></aside>`;
        sidebarContainer.innerHTML = menuHTML;
    }

    if (headerContainer) {
        let pageTitle = 'ADB Jacarepagua';
        if (currentPage === 'index.html' || currentPage === '') pageTitle = 'Seja Bem-vindo';
        else if (currentPage === 'members.html') pageTitle = 'Gestão de Membros';
        
        headerContainer.innerHTML = `
            <header class="bg-white border-b px-4 md:px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <div class="flex items-center gap-3">
                    <button onclick="toggleMenu()" class="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></button>
                    <h2 class="text-lg md:text-xl font-extrabold text-slate-800 truncate">${pageTitle}</h2>
                </div>
            </header>
        `;
    }
}

// ==========================================
// API & AUTENTICAÇÃO
// ==========================================

function getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    if (!token) return {}; 
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

window.logout = function () {
    localStorage.removeItem('auth_token');
    window.location.href = PATH_TO_PAGES + 'login.html';
}

export const api = {
    // Busca EVENTOS (Público)
    async fetchEventos() {
        state.isLoading = true;
        try {
            // Nota: NÃO precisa de Auth Header para GET (configurado no Java)
            const response = await fetch(`${API_BASE_URL}/eventos`);
            if (response.ok) { state.eventos = await response.json(); }
        } catch (error) { console.warn("Erro ao buscar eventos"); }
        finally { state.isLoading = false; }
    },

    async fetchMembers() {
        const token = localStorage.getItem('auth_token');
        if (!token) { state.members = []; return; } // Segurança Frontend

        state.isLoading = true;
        try {
            const response = await fetch(`${API_BASE_URL}/membros`, { headers: getAuthHeaders() });
            if (response.status === 403) { window.logout(); return; }
            if (response.ok) { state.members = await response.json(); }
        } catch (error) { console.warn("Erro ao buscar membros"); }
        finally { state.isLoading = false; }
    },

    async fetchMinisterios() {
        try {
            const response = await fetch(`${API_BASE_URL}/ministerios`, { headers: getAuthHeaders() });
            if (response.ok) { state.ministerios = await response.json(); }
        } catch (error) { console.warn("Erro ao carregar ministérios"); }
    },
    
    async deleteMember(id) { /* ... */ },
    async getMemberById(id) { return null; }
};

// ==========================================
// RENDERIZAÇÃO
// ==========================================

// Agora renderiza a AGENDA no index
function renderDashboard() {
    const eventsList = document.getElementById('dashboard-events-list');

    if (eventsList) {
        if (!state.eventos || state.eventos.length === 0) {
            eventsList.innerHTML = '<tr><td colspan="3" class="p-8 text-center text-slate-400 italic">Nenhum evento agendado para os próximos dias.</td></tr>';
            return;
        }

        // Ordena por data (opcional)
        // state.eventos.sort((a, b) => new Date(a.dataEvento) - new Date(b.dataEvento));

        eventsList.innerHTML = state.eventos.map(evento => `
            <tr class="hover:bg-indigo-50/50 transition-colors group border-b border-slate-100 last:border-0">
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex flex-col items-center justify-center shrink-0 border border-indigo-200">
                            <span class="text-[10px] font-bold uppercase leading-none mt-1">${formatarMes(evento.dataEvento)}</span>
                            <span class="text-lg font-black leading-none">${formatarDia(evento.dataEvento)}</span>
                        </div>
                        <div>
                            <p class="font-bold text-slate-800 text-base">${evento.nomeEvento}</p>
                            <p class="text-xs text-slate-500 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                ${evento.horario}
                            </p>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4">
                     <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        ${evento.ministerioResponsavel || 'Geral'}
                    </span>
                </td>
                <td class="px-6 py-4 text-center">
                    <a href="${PATH_TO_PAGES}inscricao.html?eventoId=${evento.id}" class="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wide rounded-lg transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                        Inscrever-se
                    </a>
                </td>
            </tr>
        `).join('');
    }
}

// Helpers de Data
function formatarData(dataString) {
    if(!dataString) return "";
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
}
function formatarDia(dataString) {
    if(!dataString) return "--";
    return dataString.split('-')[2];
}
function formatarMes(dataString) {
    if(!dataString) return "---";
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const mesIndex = parseInt(dataString.split('-')[1]) - 1;
    return meses[mesIndex];
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================

async function init() {
    injectCommonUI();

    const isDashboard = document.getElementById('dashboard-events-list'); // Novo ID do index
    const isMembersList = document.getElementById('full-members-list');

    // Se estiver no index, carrega EVENTOS
    if (isDashboard) {
        await api.fetchEventos();
        renderDashboard();
    } 
    // Se estiver em membros, carrega MEMBROS (com proteção)
    else if (isMembersList) {
        await api.fetchMembers();
        if (window.renderMembersList) window.renderMembersList();
    }
}

window.handleSearch = (q) => {
    if (document.getElementById('full-members-list') && window.renderMembersList) {
        window.renderMembersList(q);
    }
};

document.addEventListener('DOMContentLoaded', init);