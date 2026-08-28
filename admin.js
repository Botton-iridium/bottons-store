```javascript
// ========================================
// CONFIGURAÇÃO
// ========================================

let produtos = [];


// ========================================
// ELEMENTOS
// ========================================

const formulario = document.getElementById("form-produto");
const inputImagem = document.getElementById("imagem");
const preview = document.getElementById("preview");
const listaProdutos = document.getElementById("admin-produtos");


// ========================================
// PRÉ-VISUALIZAÇÃO DA IMAGEM
// ========================================

inputImagem.addEventListener("change", function () {

    const arquivo = this.files[0];

    if (!arquivo) {
        preview.style.display = "none";
        return;
    }

    const leitor = new FileReader();

    leitor.onload = function (evento) {

        preview.src = evento.target.result;
        preview.style.display = "block";

    };

    leitor.readAsDataURL(arquivo);

});


// ========================================
// CARREGAR PRODUTOS
// ========================================

async function carregarProdutos() {

    try {

        const resposta = await fetch("produtos.json");

        if (!resposta.ok) {
            throw new Error("Erro ao carregar produtos.");
        }

        produtos = await resposta.json();

        mostrarProdutos();

    } catch (erro) {

        console.error(erro);

        listaProdutos.innerHTML = `
            <p>
                Não foi possível carregar os produtos.
            </p>
        `;

    }

}


// ========================================
// MOSTRAR PRODUTOS
// ========================================

function mostrarProdutos() {

    listaProdutos.innerHTML = "";

    if (produtos.length === 0) {

        listaProdutos.innerHTML = `
            <p>Nenhum produto cadastrado.</p>
        `;

        return;
    }


    produtos.forEach((produto, index) => {

        const item = document.createElement("div");

        item.className = "admin-produto";


        item.innerHTML = `

            <img
                src="${produto.imagem}"
                alt="${produto.nome}"
                onerror="this.src='https://placehold.co/100x100?text=Sem+imagem'"
            >

            <div class="admin-produto-info">

                <h3>
                    ${produto.nome}
                </h3>

                <p>
                    ${produto.descricao || ""}
                </p>

                <strong>
                    ${formatarPreco(produto.preco)}
                </strong>

            </div>


            <button
                class="excluir"
                onclick="excluirProduto(${index})"
            >
                🗑️ Excluir
            </button>

        `;


        listaProdutos.appendChild(item);

    });

}


// ========================================
// ADICIONAR PRODUTO
// ========================================

formulario.addEventListener("submit", function (evento) {

    evento.preventDefault();


    const nome =
        document.getElementById("nome").value.trim();

    const preco =
        Number(document.getElementById("preco").value);

    const descricao =
        document.getElementById("descricao").value.trim();

    const arquivo =
        inputImagem.files[0];


    // Verificação

    if (!arquivo) {

        alert("Escolha uma imagem.");

        return;
    }


    if (!nome) {

        alert("Digite o nome do produto.");

        return;
    }


    if (preco <= 0) {

        alert("Digite um preço válido.");

        return;
    }


    // Criar URL temporária para a imagem

    const imagem =
        URL.createObjectURL(arquivo);


    // Novo produto

    const novoProduto = {

        id: Date.now(),

        nome: nome,

        descricao: descricao,

        preco: preco,

        imagem: imagem

    };


    produtos.push(novoProduto);


    mostrarProdutos();


    // Limpar formulário

    formulario.reset();

    preview.src = "";
    preview.style.display = "none";


    alert(
        "Produto adicionado à lista! 🎉"
    );

});


// ========================================
// EXCLUIR PRODUTO
// ========================================

function excluirProduto(index) {

    const produto = produtos[index];


    const confirmar =
        confirm(
            `Deseja excluir "${produto.nome}"?`
        );


    if (!confirmar) {
        return;
    }


    produtos.splice(index, 1);


    mostrarProdutos();

}


// ========================================
// FORMATAR PREÇO
// ========================================

function formatarPreco(preco) {

    return Number(preco).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// ========================================
// INICIAR PAINEL
// ========================================

preview.style.display = "none";

carregarProdutos();
```
