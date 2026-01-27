// pages/membros.js
import { API_BASE_URL } from '../index.js';
import { apiMinisterio } from './ministerios.js';

// --- FUNÇÃO INIT ---
async function init() {
    console.clear();
    console.log("=== INICIALIZANDO SCRIPT MEMBROS ===");

    const formEdicao = document.getElementById('edit-member-form');
    const formCadastro = document.getElementById('add-member-form');
    const selectMinisterio = document.getElementById('listMinisterioNew') || document.getElementById('listaMinisteriosEdit');

    // 1. Carrega Select de Ministérios (Se existir)
    if (selectMinisterio) {
        await preencherSelectMinisterios(selectMinisterio);
    }

    // 2. Configura o Formulário (Edição ou Cadastro)
    if (formEdicao) {
        console.log("--> MODO EDIÇÃO");
        await carregarDadosEdicao(formEdicao);
        configurarSalvar(formEdicao, true); // true = É Edição
    } else if (formCadastro) {
        console.log("--> MODO CADASTRO");
        configurarSalvar(formCadastro, false); // false = Novo Cadastro
    }
}

// --- FUNÇÕES DE APOIO ---

async function preencherSelectMinisterios(selectElement) {
    const lista = await apiMinisterio.carregarMinisterios();
    
    selectElement.innerHTML = '<option value="">Selecione um ministério</option>';
    lista.forEach(min => {
        const option = document.createElement('option');
        option.value = min.nome; 
        option.textContent = min.nome;
        selectElement.appendChild(option);
    });
}

async function carregarDadosEdicao(form) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const token = localStorage.getItem('auth_token'); 

    if (!id) return;

    try {
        const response = await fetch(`${API_BASE_URL}/membro/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const membro = await response.json();
            form.querySelector('[name="id"]').value = membro.id;
            form.querySelector('[name="nome"]').value = membro.nome;
            form.querySelector('[name="cpf"]').value = formatarStringCPF(membro.cpf);
            form.querySelector('[name="telefone"]').value = membro.telefone;
            form.querySelector('[name="email"]').value = membro.email;
            
            if (membro.dataNascimento) {
                form.querySelector('[name="dataNascimento"]').value = membro.dataNascimento.split('T')[0];
            }
            form.querySelector('[name="ministerio"]').value = membro.ministerio;
            form.querySelector('[name="status"]').value = membro.status;
        } else {
            if (response.status === 403) alert("Sessão expirada.");
        }
    } catch (error) {
        console.error("Erro ao carregar:", error);
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

        // Se for edição, o CPF disabled não vem no formData, pegamos manualmente
        if (isEditMode) {
            const cpfInput = form.querySelector('[name="cpf"]');
            if (cpfInput) dados.cpf = cpfInput.value;
        }

        const url = isEditMode ? `${API_BASE_URL}/membro/${dados.id}` : `${API_BASE_URL}/membros`;
        const method = isEditMode ? 'PUT' : 'POST';
        
        // 1. PEGAMOS O TOKEN
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
                alert("Salvo com sucesso!");
                window.location.href = 'members.html';
            } else {
                // Tenta ler o JSON de erro que criamos no Passo 1
                let erroMsg = "Erro desconhecido.";
                try {
                    const erroJson = await response.json();
                    // Se vier do nosso Handler, usamos a mensagem bonita
                    if (erroJson.mensagem) {
                        erroMsg = erroJson.mensagem; 
                    }
                } catch (e) {
                    // Se não for JSON (ex: erro 404 padrão do Tomcat), pegamos texto puro
                    erroMsg = await response.text(); 
                }

                // Tratamento Específico para Token Expirado
                if (response.status === 403) {
                    alert("Sessão expirada. Faça login novamente.");
                    window.location.href = 'login.html';
                } else {
                    // Mostra o erro real (Ex: "CPF já cadastrado")
                    alert("Atenção: " + erroMsg);
                }
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
    return cpf.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

window.mascaraCPF = function(input) {
    let v = input.value.replace(/\D/g, "");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    input.value = v;
};

// Inicialização segura
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}