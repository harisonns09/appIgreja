// pages/membros.js
import { API_BASE_URL } from '../index.js';
import { apiMinisterio } from './ministerios.js';

// --- FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO ---
async function init() {
    console.clear(); // Limpa o console para facilitar a leitura
    console.log("=== DIAGNÓSTICO DO SCRIPT MEMBROS.JS ===");

    // 1. Tenta encontrar os formulários separadamente
    const formEdicao = document.getElementById('edit-member-form');
    const formCadastro = document.getElementById('add-member-form');
    
    // 2. Busca o select
    const selectMinisterio = document.getElementById('listMinisterioNew') || document.getElementById('listaMinisteriosEdit');

    console.log("Status da Busca:");
    console.log("- Formulário de Edição (edit-member-form):", formEdicao ? "ENCONTRADO" : "NÃO ENCONTRADO");
    console.log("- Formulário de Cadastro (add-member-form):", formCadastro ? "ENCONTRADO" : "NÃO ENCONTRADO");
    console.log("- Select de Ministérios:", selectMinisterio ? "ENCONTRADO" : "NÃO ENCONTRADO");

    // 3. Carrega Ministérios se houver select
    if (selectMinisterio) {
        await preencherSelectMinisterios(selectMinisterio);
    }

    // 4. Lógica de Decisão EXPLICITA
    if (formEdicao) {
        // ESTAMOS NA PÁGINA PESSOA.HTML
        console.log("--> Fluxo: MODO EDIÇÃO");
        
        // Configura o evento de salvar no form de edição
        configurarSalvar(formEdicao, true);
        
        // Carrega os dados
        await carregarDadosEdicao(formEdicao);
        
    } else if (formCadastro) {
        // ESTAMOS NA PÁGINA NOVOMEMBRO.HTML
        console.log("--> Fluxo: MODO CADASTRO");
        
        // Configura o evento de salvar no form de cadastro
        configurarSalvar(formCadastro, false);
        
    } else {
        console.warn("ALERTA: Nenhum formulário detectado. Verifique se o ID no HTML está correto.");
    }
}

// --- FUNÇÕES DE APOIO ---

async function preencherSelectMinisterios(selectElement) {
    try {
        const lista = await apiMinisterio.carregarMinisterios();
        
        selectElement.innerHTML = '<option value="">Selecione um ministério</option>';

        lista.forEach(min => {
            const option = document.createElement('option');
            option.value = min.nome; // Confirme se o backend espera 'nome' ou 'id'
            option.textContent = min.nome;
            selectElement.appendChild(option);
        });
        console.log("Ministérios preenchidos.");
    } catch (e) {
        console.error("Erro ao listar ministérios:", e);
    }
}

async function carregarDadosEdicao(form) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        alert("Erro: ID não fornecido na URL.");
        return;
    }

    console.log(`Buscando dados do ID: ${id}`);

    try {
        const response = await fetch(`${API_BASE_URL}/membro/${id}`);
        if (response.ok) {
            const membro = await response.json();
            console.log("Dados recebidos:", membro);

            // Preenche os inputs
            form.querySelector('[name="id"]').value = membro.id;
            form.querySelector('[name="nome"]').value = membro.nome;
            form.querySelector('[name="cpf"]').value = formatarStringCPF(membro.cpf);
            form.querySelector('[name="telefone"]').value = membro.telefone;
            form.querySelector('[name="email"]').value = membro.email;
            
            // Tratamento da Data (Crucial)
            if (membro.dataNascimento) {
                const dataLimpa = membro.dataNascimento.toString().split('T')[0];
                form.querySelector('[name="dataNascimento"]').value = dataLimpa;
            }

            // Selects
            form.querySelector('[name="ministerio"]').value = membro.ministerio;
            form.querySelector('[name="status"]').value = membro.status;

        } else {
            console.error("Membro não encontrado (404)");
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
    }
}

function configurarSalvar(form, isEditMode) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const txtOriginal = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = 'Salvando...';

        const formData = new FormData(form);
        const dados = Object.fromEntries(formData.entries());

        const url = isEditMode ? `${API_BASE_URL}/membro/${dados.id}` : `${API_BASE_URL}/membros`;
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            if (response.ok) {
                alert("Salvo com sucesso!");
                window.location.href = 'members.html';
            } else {
                alert("Erro ao salvar.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão.");
        } finally {
            btn.disabled = false;
            btn.innerHTML = txtOriginal;
        }
    });
}

function formatarStringCPF(cpf) {
    if (!cpf) return "";
    return cpf.replace(/\D/g, "")
              .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

// --- GARANTIA DE EXECUÇÃO ---
// Verifica se o documento já carregou. Se sim, roda init(). Se não, espera carregar.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Função Global para o HTML (oninput="mascaraCPF(this)")
window.mascaraCPF = function(input) {
    let v = input.value.replace(/\D/g, "");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    input.value = v;
};