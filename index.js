
import { GoogleGenAI } from "@google/genai";

// Configuração Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Estado da Aplicação
const state = {
    view: 'dashboard',
    members: [
        {
            id: '1',
            fullName: 'João Silva Oliveira',
            birthDate: '1985-05-20',
            email: 'joao.silva@email.com',
            phone: '(11) 98888-7777',
            address: 'Rua das Oliveiras, 123 - Centro',
            membershipStatus: 'Membro',
            ministry: 'Louvor',
            createdAt: new Date().toISOString(),
            photoUrl: 'https://picsum.photos/seed/joao/200'
        },
        {
            id: '2',
            fullName: 'Maria Santos Ferreira',
            birthDate: '1992-10-12',
            email: 'maria.santos@email.com',
            phone: '(11) 97777-6666',
            address: 'Av. da Paz, 456 - Vila Esperança',
            membershipStatus: 'Líder',
            ministry: 'Infantil',
            createdAt: new Date().toISOString(),
            photoUrl: 'https://picsum.photos/seed/maria/200'
        }
    ],
    searchQuery: '',
    sidebarOpen: true,
    aiInsight: '',
    isAnalyzing: false
};

// Funções de Navegação e UI
window.navigate = (viewName) => {
    state.view = viewName;
    updateNavigationUI();
    render();
};

window.toggleSidebar = () => {
    state.sidebarOpen = !state.sidebarOpen;
    const sidebar = document.getElementById('sidebar');
    const texts = document.querySelectorAll('.sidebar-text');
    const toggleIcon = document.getElementById('sidebar-toggle-icon');

    if (state.sidebarOpen) {
        sidebar.classList.remove('w-20');
        sidebar.classList.add('w-64');
        texts.forEach(t => t.classList.remove('hidden'));
        toggleIcon.innerHTML = '<path d="m15 18-6-6 6-6"/>';
    } else {
        sidebar.classList.remove('w-64');
        sidebar.classList.add('w-20');
        texts.forEach(t => t.classList.add('hidden'));
        toggleIcon.innerHTML = '<path d="m9 18 6-6-6-6"/>';
    }
};

window.handleSearch = (query) => {
    state.searchQuery = query;
    if (state.view === 'members') {
        render(); // Re-renderiza apenas se estiver na lista
    }
};

function updateNavigationUI() {
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active-nav'));
    const activeBtn = document.getElementById(`nav-${state.view}`);
    if (activeBtn) activeBtn.classList.add('active-nav');
    
    const title = document.getElementById('view-title');
    const titles = {
        'dashboard': 'Resumo da Igreja',
        'members': 'Lista de Membros',
        'add-member': 'Cadastrar Novo Membro',
        'ai-insights': 'Inteligência Artificial'
    };
    title.innerText = titles[state.view] || 'Sistema Eclésia';
}

// Lógica de Membros
window.deleteMember = (id) => {
    if (confirm('Tem certeza que deseja remover este registro?')) {
        state.members = state.members.filter(m => m.id !== id);
        render();
    }
};

window.handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newMember = {
        id: Math.random().toString(36).substr(2, 9),
        fullName: formData.get('fullName'),
        birthDate: formData.get('birthDate'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        membershipStatus: formData.get('membershipStatus'),
        ministry: formData.get('ministry'),
        createdAt: new Date().toISOString(),
        photoUrl: `https://picsum.photos/seed/${formData.get('fullName')}/200`
    };
    state.members.unshift(newMember);
    navigate('members');
};

// IA Service
window.runAiAnalysis = async () => {
    state.isAnalyzing = true;
    render();

    try {
        const summary = state.members.map(m => `${m.fullName} (${m.membershipStatus}, ${m.ministry})`).join(', ');
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analise a composição da igreja com base nestes membros: ${summary}. Dê sugestões de crescimento em português.`,
        });
        state.aiInsight = response.text;
    } catch (error) {
        state.aiInsight = "Erro ao conectar com a IA. Verifique sua conexão.";
    } finally {
        state.isAnalyzing = false;
        render();
    }
};

// Renderização de Telas
function render() {
    const container = document.getElementById('content-area');
    
    if (state.view === 'dashboard') {
        renderDashboard(container);
    } else if (state.view === 'members') {
        renderMembersList(container);
    } else if (state.view === 'add-member') {
        renderAddMemberForm(container);
    } else if (state.view === 'ai-insights') {
        renderAiInsights(container);
    }
}

function renderDashboard(container) {
    const total = state.members.length;
    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            ${createStatCard('Total de Membros', total, 'blue')}
            ${createStatCard('Novos (30 dias)', state.members.length, 'green')}
            ${createStatCard('Ministérios', 8, 'purple')}
            ${createStatCard('Eventos', 3, 'orange')}
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 class="font-bold text-lg mb-6">Membros Recentes</h3>
                <div class="space-y-4">
                    ${state.members.slice(0, 4).map(m => `
                        <div class="flex items-center justify-between p-3 border-b border-slate-50">
                            <div class="flex items-center gap-3">
                                <img src="${m.photoUrl}" class="w-10 h-10 rounded-full border">
                                <div>
                                    <p class="font-semibold text-sm">${m.fullName}</p>
                                    <p class="text-xs text-slate-500">${m.ministry}</p>
                                </div>
                            </div>
                            <span class="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">${m.membershipStatus}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="bg-indigo-900 text-white p-6 rounded-2xl">
                <h3 class="font-bold text-lg mb-4">Versículo do Dia</h3>
                <p class="italic text-indigo-100 text-sm italic">"Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito..." - João 3:16</p>
                <button onclick="navigate('add-member')" class="w-full mt-8 py-3 bg-white text-indigo-900 rounded-xl font-bold">Novo Cadastro</button>
            </div>
        </div>
    `;
}

function renderMembersList(container) {
    const filtered = state.members.filter(m => 
        m.fullName.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        m.ministry.toLowerCase().includes(state.searchQuery.toLowerCase())
    );

    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table class="w-full text-left">
                <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                    <tr>
                        <th class="px-6 py-4">Membro</th>
                        <th class="px-6 py-4">Ministério</th>
                        <th class="px-6 py-4">Status</th>
                        <th class="px-6 py-4">Ações</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    ${filtered.map(m => `
                        <tr class="hover:bg-slate-50">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <img src="${m.photoUrl}" class="w-10 h-10 rounded-full">
                                    <div class="text-sm">
                                        <p class="font-semibold">${m.fullName}</p>
                                        <p class="text-slate-500 text-xs">${m.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm text-slate-600">${m.ministry}</td>
                            <td class="px-6 py-4">
                                <span class="px-3 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700">${m.membershipStatus}</span>
                            </td>
                            <td class="px-6 py-4">
                                <button onclick="deleteMember('${m.id}')" class="text-slate-400 hover:text-red-600 transition-colors">
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderAddMemberForm(container) {
    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-lg border">
            <h3 class="text-xl font-bold mb-6">Cadastro de Membro</h3>
            <form onsubmit="handleFormSubmit(event)" class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold mb-1">Nome Completo</label>
                    <input name="fullName" required class="w-full px-4 py-2 border rounded-xl outline-indigo-500">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-semibold mb-1">Nascimento</label>
                        <input name="birthDate" type="date" required class="w-full px-4 py-2 border rounded-xl">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-1">Telefone</label>
                        <input name="phone" required class="w-full px-4 py-2 border rounded-xl">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-semibold mb-1">E-mail</label>
                    <input name="email" type="email" required class="w-full px-4 py-2 border rounded-xl">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-semibold mb-1">Ministério</label>
                        <select name="ministry" class="w-full px-4 py-2 border rounded-xl bg-white">
                            <option>Nenhum</option>
                            <option>Louvor</option>
                            <option>Infantil</option>
                            <option>Jovens</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-1">Status</label>
                        <select name="membershipStatus" class="w-full px-4 py-2 border rounded-xl bg-white">
                            <option>Membro</option>
                            <option>Visitante</option>
                            <option>Líder</option>
                        </select>
                    </div>
                </div>
                <div class="pt-6 flex gap-4">
                    <button type="button" onclick="navigate('members')" class="flex-1 py-3 border rounded-xl font-bold">Cancelar</button>
                    <button type="submit" class="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">Salvar Membro</button>
                </div>
            </form>
        </div>
    `;
}

function renderAiInsights(container) {
    container.innerHTML = `
        <div class="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-sm border">
            <div class="flex items-center gap-4 mb-8">
                <div class="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">IA</div>
                <h3 class="text-2xl font-bold">Insights Estratégicos</h3>
            </div>
            
            <div class="bg-slate-50 p-6 rounded-2xl border border-dashed flex flex-col items-center justify-center text-center">
                ${state.isAnalyzing ? `
                    <div class="py-12">
                        <div class="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p class="text-indigo-600 font-medium">Analisando dados da membresia...</p>
                    </div>
                ` : state.aiInsight ? `
                    <div class="text-left w-full">
                        <div class="bg-white p-6 rounded-xl border whitespace-pre-wrap leading-relaxed">${state.aiInsight}</div>
                        <button onclick="runAiAnalysis()" class="mt-6 text-indigo-600 font-bold">Refazer Análise</button>
                    </div>
                ` : `
                    <p class="text-slate-500 mb-6">A IA pode analisar sua igreja e sugerir como melhorar os ministérios.</p>
                    <button onclick="runAiAnalysis()" class="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100">Gerar Análise</button>
                `}
            </div>
        </div>
    `;
}

function createStatCard(title, value, color) {
    return `
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h4 class="text-slate-500 text-sm font-medium mb-1">${title}</h4>
            <p class="text-3xl font-bold text-slate-800">${value}</p>
        </div>
    `;
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    navigate('dashboard');
});
