```javascript
// =========================
// PRODUTOS
// =========================

// Por enquanto, vamos usar alguns produtos de exemplo.
// Depois vamos trocar isso pelo sistema que permite
// adicionar produtos pelo painel.

const produtos = [
    {
        id: 1,
        nome: "Botton Gato",
        descricao: "Um botton fofo de gatinho.",
        preco: 5.00,
        imagem: "imagens/gato.png"
    },
    {
        id: 2,
        nome: "Botton Estrela",
        descricao: "Uma estrela para decorar sua mochila.",
        preco: 6.00,
        imagem: "imagens/estrela.png"
    },
    {
        id: 3,
        nome: "Botton Coração",
        descricao: "Um coração colorido e divertido.",
        preco: 5.50,
        imagem: "imagens/coracao.png"
    }
];


// =========================
// CARRINHO
// =========================

let carrinho = [];


// =========================
// MOSTRAR PRODUTOS
// =========================

function mostrarProdutos() {

    const lista = document.getElementById("lista-produtos");

    lista.innerHTML = "";

    produtos.forEach(produto => {

        const card = document.createElement("div");

        card.className = "produto";

        card.innerHTML = `
            <img 
                src="${produto.imagem}" 
                alt="${produto.nome}"
                onerror="this.src='https://via.placeholder.com/400x400?text=Sem+imagem'"
            >

            <div class="produto-info">

                <h3>${produto.nome}</h3>

                <p>${produto.descricao}</p>

                <div class="preco">
                    R$ ${produto.preco.toFixed(2).replace(".", ",")}
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


// =========================
// ADICIONAR AO CARRINHO
// =========================

function adicionarCarrinho(id) {

    const produto = produtos.find(p => p.id === id);

    if (!produto) {
        return;
    }

    carrinho.push(produto);

    atualizarCarrinho();

    alert(`${produto.nome} foi adicionado ao carrinho!`);
}


// =========================
// ATUALIZAR CARRINHO
// =========================

function atualizarCarrinho() {

    const contador =
        document.getElementById("contador-carrinho");

    const itens =
        document.getElementById("itens-carrinho");

    const total =
        document.getElementById("total-carrinho");


    // Atualiza contador

    contador.textContent = carrinho.length;


    // Carrinho vazio

    if (carrinho.length === 0) {

        itens.innerHTML =
            "<p>Seu carrinho está vazio.</p>";

        total.textContent = "R$ 0,00";

        return;
    }


    // Mostra os produtos

    itens.innerHTML = "";

    let valorTotal = 0;


    carrinho.forEach((produto, index) => {

        valorTotal += produto.preco;

        const item =
            document.createElement("div");

        item.style.marginBottom = "15px";

        item.innerHTML = `
            <strong>${produto.nome}</strong>

            <br>

            <span>
                R$ ${produto.preco
                    .toFixed(2)
                    .replace(".", ",")}
            </span>

            <button
                onclick="removerCarrinho(${index})"
                style="
                    float:right;
                    border:none;
                    background:none;
                    cursor:pointer;
                "
            >
                ❌
            </button>
        `;

        itens.appendChild(item);
    });


    // Atualiza total

    total.textContent =
        `R$ ${valorTotal.toFixed(2).replace(".", ",")}`;
}


// =========================
// REMOVER DO CARRINHO
// =========================

function removerCarrinho(index) {

    carrinho.splice(index, 1);

    atualizarCarrinho();
}


// =========================
// ABRIR CARRINHO
// =========================

function abrirCarrinho() {

    const carrinhoElemento =
        document.getElementById("carrinho");

    carrinhoElemento.classList.add("ativo");
}


// =========================
// FECHAR CARRINHO
// =========================

function fecharCarrinho() {

    const carrinhoElemento =
        document.getElementById("carrinho");

    carrinhoElemento.classList.remove("ativo");
}


// =========================
// FINALIZAR COMPRA
// =========================

function finalizarCompra() {

    if (carrinho.length === 0) {

        alert("Seu carrinho está vazio!");

        return;
    }

    alert(
        "A parte de finalização da compra será configurada depois. 🛒"
    );
}


// =========================
// INICIAR LOJA
// =========================

mostrarProdutos();

atualizarCarrinho();
```
