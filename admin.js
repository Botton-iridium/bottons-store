```javascript
// ========================================
// ELEMENTOS DA PÁGINA
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
        preview.src = "";
        preview.style.display = "none";
        return;
    }

    // Verificar se o arquivo é uma imagem

    if (!arquivo.type.startsWith("image/")) {

        alert("Escolha um arquivo de imagem.");

        inputImagem.value = "";

        preview.src = "";
        preview.style.display = "none";

        return;
    }


    // Limite de tamanho: 5 MB

    const limite = 5 * 1024 * 1024;

    if (arquivo.size > limite) {

        alert("A imagem deve ter no máximo 5 MB.");

        inputImagem.value = "";

        preview.src = "";
        preview.style.display = "none";

        return;
    }


    // Criar prévia

    const leitor = new FileReader();

    leitor.onload = function (evento) {

        preview.src = evento.target.result;
        preview.style.display = "block";

    };

    leitor.onerror = function () {

        alert("Não foi possível carregar a imagem.");

    };

    leitor.readAsDataURL(arquivo);

});


// ========================================
// ENVIAR PRODUTO
// ========================================

formulario.addEventListener("submit", async function (evento) {

    evento.preventDefault();


    // Pegar informações do formulário

    const nome =
        document.getElementById("nome").value.trim();

    const preco =
        Number(document.getElementById("preco").value);

    const descricao =
        document.getElementById("descricao").value.trim();

    const arquivo =
        inputImagem.files[0];


    // ========================================
    // VALIDAR DADOS
    // ========================================

    if (!arquivo) {

        alert("Escolha uma foto para o produto.");

        return;
    }


    if (!nome) {

        alert("Digite o nome do produto.");

        return;
    }


    if (!Number.isFinite(preco) || preco <= 0) {

        alert("Digite um preço válido.");

        return;
    }


    // ========================================
    // BOTÃO DE ENVIO
    // ========================================

    const botao =
        formulario.querySelector(
            "button[type='submit']"
        );


    const textoOriginal =
        botao.textContent;


    botao.disabled = true;

    botao.textContent =
        "⏳ Enviando produto...";


    try {

        // ========================================
        // CONVERTER IMAGEM PARA BASE64
        // ========================================

        const imagemBase64 =
            await transformarBase64(arquivo);


        // ========================================
        // ENVIAR PARA A API DA VERCEL
        // ========================================

        const resposta =
            await fetch("/api/products", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    nome: nome,

                    descricao: descricao,

                    preco: preco,

                    imagem: imagemBase64

                })

            });


        // Tentar ler a resposta

        let resultado;

        try {

            resultado =
                await resposta.json();

        } catch {

            resultado = {};

        }


        // ========================================
        // VERIFICAR ERRO
        // ========================================

        if (!resposta.ok) {

            throw new Error(
                resultado.erro ||
                "Não foi possível adicionar o produto."
            );

        }


        // ========================================
        // PRODUTO ADICIONADO
        // ========================================

        alert(
            "🎉 Produto adicionado com sucesso!"
        );


        // Limpar formulário

        formulario.reset();

        preview.src = "";
        preview.style.display = "none";


        // Recarregar lista

        await carregarProdutos();


    } catch (erro) {

        console.error(
            "Erro ao adicionar produto:",
            erro
        );


        alert(
            "❌ Erro ao adicionar produto:\n\n" +
            erro.message
        );


    } finally {

        // Restaurar botão

        botao.disabled = false;

        botao.textContent =
            textoOriginal;

    }

});


// ========================================
// CONVERTER IMAGEM PARA BASE64
// ========================================

function transformarBase64(arquivo) {

    return new Promise((resolve, reject) => {

        const leitor =
            new FileReader();


        leitor.onload = function () {

            resolve(leitor.result);

        };


        leitor.onerror = function () {

            reject(
                new Error(
                    "Não foi possível ler a imagem."
                )
            );

        };


        leitor.readAsDataURL(arquivo);

    });

}


// ========================================
// CARREGAR PRODUTOS DO GITHUB
// ========================================

async function carregarProdutos() {

    try {

        const resposta =
            await fetch(
                "produtos.json?" + Date.now()
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao carregar produtos."
            );

        }


        const produtos =
            await resposta.json();


        mostrarProdutos(produtos);


    } catch (erro) {

        console.error(
            "Erro ao carregar produtos:",
            erro
        );


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

function mostrarProdutos(produtos) {

    listaProdutos.innerHTML = "";


    if (!Array.isArray(produtos)) {

        listaProdutos.innerHTML = `
            <p>
                O arquivo de produtos está inválido.
            </p>
        `;

        return;
    }


    if (produtos.length === 0) {

        listaProdutos.innerHTML = `
            <p>
                Nenhum produto cadastrado.
            </p>
        `;

        return;
    }


    produtos.forEach(function (produto) {

        const item =
            document.createElement("div");


        item.className =
            "admin-produto";


        item.innerHTML = `

            <img
                src="${produto.imagem}"
                alt="${produto.nome}"
                onerror="
                    this.src='https://placehold.co/100x100?text=Sem+imagem'
                "
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

        `;


        listaProdutos.appendChild(item);

    });

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
