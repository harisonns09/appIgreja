// pages/membros.js
import { API_BASE_URL } from '../index.js';
import { apiMinisterio } from './ministerios.js'; // Importamos a função de listar

// Identifica elementos
const formMember = document.getElementById('add-member-form') || document.getElementById('edit-member-form');
// Pega o select independente da página que estamos
const selectMinisterio = document.getElementById('listMinisterioNew') || document.getElementById('listaMinisteriosEdit');

// INICIALIZAÇÃO
(async function init() {
    if (selectMinisterio) {
        await preencherSelectMinisterios();
    }

    // Se estivermos na página de EDIÇÃO (pessoa.html), carregamos os dados
    if (formMember && formMember.id === 'edit-member-form') {
        await carregarDadosEdicao();
    }
})();

// 1. PREENCHER SELECT (Usa a API do ministerios.js)
async function preencherSelectMinisterios() {
    const lista = await apiMinisterio.carregarMinisterios();

    selectMinisterio.innerHTML = '<option value="">Selecione um ministério</option>';

    lista.forEach(min => {
        const option = document.createElement('option');
        option.value = min.nome;
        option.textContent = min.nome;
        selectMinisterio.appendChild(option);
    });
}

// 2. CARREGAR DADOS NA EDIÇÃO (Só para pessoa.html)
async function carregarDadosEdicao() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        alert("ID não encontrado!");
        window.location.href = 'members.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/membro/${id}`); // Ajuste a rota se for /membros/{id}
        if (response.ok) {
            const membro = await response.json();

            // Preenche os campos automaticamente
            const form = document.getElementById('edit-member-form');
            form.querySelector('[name="id"]').value = membro.id;
            form.querySelector('[name="nome"]').value = membro.nome;
            form.querySelector('[name="dataNascimento"]').value = membro.dataNascimento;
            form.querySelector('[name="telefone"]').value = membro.telefone;
            form.querySelector('[name="email"]').value = membro.email;
            form.querySelector('[name="cpf"]').value = formatarStringCPF(membro.cpf);
            form.querySelector('[name="ministerio"]').value = membro.ministerio;
            form.querySelector('[name="status"]').value = membro.status;
        }
    } catch (error) {
        console.error("Erro ao carregar membro:", error);
    }
}

// 3. ENVIO DO FORMULÁRIO (Serve para Criar e Editar)
if (formMember) {
    formMember.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = formMember.querySelector('button[type="submit"]');
        const txtOriginal = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = 'Salvando...';

        const formData = new FormData(formMember);
        const dados = Object.fromEntries(formData.entries());

        // Decide se é POST (Novo) ou PUT (Editar)
        const isEdit = formMember.id === 'edit-member-form';
        const url = isEdit ? `${API_BASE_URL}/membro/${dados.id}` : `${API_BASE_URL}/membros`;
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            if (response.ok) {
                alert(isEdit ? "Membro atualizado!" : "Membro cadastrado!");
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

    // Função auxiliar para formatar CPF que vem do banco
    function formatarStringCPF(cpf) {
        if (!cpf) return "";
        // Garante que só tem números
        const v = cpf.replace(/\D/g, "");

        // Se tiver 11 dígitos, aplica a máscara
        if (v.length === 11) {
            return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        }

        return cpf; // Se estiver incompleto, retorna como está
    }
}