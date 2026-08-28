
// ================================
// CONFIGURAÇÃO
// ================================

let produtos = [];
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];


// ================================
// FORMATAR PREÇO
// ================================

function formatarPreco(preco) {
    return Number(preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// ================================
// CARREGAR PRODUTOS
// ================================

async function carregarProdutos() {

    const lista = document.getElementById("lista-produtos");

    try {

        const resposta = await fetch("produtos.json");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os produtos.");
        }

        produtos = await resposta.json();

        mostrarProdutos();

    } catch (erro) {

        console.error(erro);

        lista.innerHTML = `
            <div class="carregando">
                <p>Não foi possível carregar os produtos.</p>
            </div>
        `;
    }
}


// ================================
// MOSTRAR PRODUTOS
// ================================

function mostrarProdutos() {

    const lista = document.getElementById("lista-produtos");

    lista.innerHTML = "";

    if (produtos.length === 0) {

        lista.innerHTML = `
            <div class="carregando">
                <p>Nenhum produto disponível no momento.</p>
            </div>
        `;

        return;
    }

    produtos.forEach(produto => {

        const card = document.createElement("div");

        card.className = "produto";

        card.innerHTML = `
            <img
                src="${produto.imagem}"
                alt="${produto.nome}"
                onerror="this.src='https://placehold.co/400x400?text=Sem+imagem'"
            >

            <div class="produto-info">

                <h3>${produto.nome}</h3>

                <p>${produto.descricao || ""}</p>

                <div class="preco">
                    ${formatarPreco(produto.preco)}
                </div>

                <button
                    class="adicionar"
                    onclick="adicionarCarrinho(${produto.id})"
                >
                    🛒 Adicionar ao carrinho
                </button>

            </div>
        `;

        lista.appendChild(card);
    });
}


// ================================
// ADICIONAR AO CARRINHO
// ================================

function adicionarCarrinho(id) {

    const produto = produtos.find(
        produto => produto.id === id
    );

    if (!produto) {
        return;
    }

    carrinho.push(produto);

    salvarCarrinho();

    atualizarCarrinho();

    alert(`${produto.nome} foi adicionado ao carrinho!`);
}


// ================================
// REMOVER DO CARRINHO
// ================================

function removerCarrinho(index) {

    carrinho.splice(index, 1);

    salvarCarrinho();

    atualizarCarrinho();
}


// ================================
// SALVAR CARRINHO
// ================================

function salvarCarrinho() {

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );
}


// ================================
// ATUALIZAR CARRINHO
// ================================

function atualizarCarrinho() {

    const contador =
        document.getElementById("contador-carrinho");

    const itens =
        document.getElementById("itens-carrinho");

    const total =
        document.getElementById("total-carrinho");


    // Quantidade de produtos

    contador.textContent = carrinho.length;


    // Carrinho vazio

    if (carrinho.length === 0) {

        itens.innerHTML = `
            <p>Seu carrinho está vazio.</p>
        `;

        total.textContent = "R$ 0,00";

        return;
    }


    // Limpa a lista

    itens.innerHTML = "";

    let valorTotal = 0;


    // Cria cada item

    carrinho.forEach((produto, index) => {

        valorTotal += Number(produto.preco);

        const item =
            document.createElement("div");

        item.style.marginBottom = "20px";

        item.innerHTML = `
            <strong>
                ${produto.nome}
            </strong>

            <br>

            <span>
                ${formatarPreco(produto.preco)}
            </span>

            <button
                onclick="removerCarrinho(${index})"
                style="
                    float: right;
                    border: none;
                    background: none;
                    cursor: pointer;
                    font-size: 16px;
                "
                aria-label="Remover produto"
            >
                ❌
            </button>
        `;

        itens.appendChild(item);
    });


    // Total

    total.textContent =
        formatarPreco(valorTotal);
}


// ================================
// ABRIR CARRINHO
// ================================

function abrirCarrinho() {

    const elemento =
        document.getElementById("carrinho");

    elemento.classList.add("ativo");
}


// ================================
// FECHAR CARRINHO
// ================================

function fecharCarrinho() {

    const elemento =
        document.getElementById("carrinho");

    elemento.classList.remove("ativo");
}


// ================================
// FINALIZAR COMPRA
// ================================

function finalizarCompra() {

    if (carrinho.length === 0) {

        alert("Seu carrinho está vazio!");

        return;
    }

    alert(
        "A finalização da compra será configurada no próximo passo. 🛍️"
    );
}


// ================================
// INICIAR
// ================================

carregarProdutos();

atualizarCarrinho();

