
const GITHUB_API = "https://api.github.com";

export default async function handler(req, res) {

    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    // Responder ao preflight
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // Apenas POST
    if (req.method !== "POST") {
        return res.status(405).json({
            erro: "Método não permitido."
        });
    }

    try {

        const token = process.env.GITHUB_TOKEN;
        const repo = process.env.GITHUB_REPO;

        if (!token || !repo) {
            return res.status(500).json({
                erro: "Variáveis da Vercel não configuradas."
            });
        }

        const {
            nome,
            descricao,
            preco,
            imagem
        } = req.body;

        // Verificar informações
        if (!nome || preco === undefined || !imagem) {
            return res.status(400).json({
                erro: "Nome, preço e imagem são obrigatórios."
            });
        }

        const precoNumerico = Number(preco);

        if (
            !Number.isFinite(precoNumerico) ||
            precoNumerico <= 0
        ) {
            return res.status(400).json({
                erro: "Preço inválido."
            });
        }

        // Verificar se a imagem está em Base64
        if (!imagem.startsWith("data:image/")) {
            return res.status(400).json({
                erro: "Imagem inválida."
            });
        }

        // Separar informações da imagem
        const partes = imagem.split(",");

        if (partes.length !== 2) {
            return res.status(400).json({
                erro: "Formato da imagem inválido."
            });
        }

        const imagemBase64 = partes[1];

        // Descobrir extensão
        const tipoImagem =
            imagem.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,/);

        let extensao = "png";

        if (tipoImagem && tipoImagem[1]) {
            extensao = tipoImagem[1]
                .replace("jpeg", "jpg")
                .replace("svg+xml", "svg");
        }

        // ID único
        const id = Date.now();

        // Nome seguro para o arquivo
        const nomeArquivo =
            nome
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");

        const caminhoImagem =
            `imagens/${nomeArquivo}-${id}.${extensao}`;

        // ==========================================
        // 1. ENVIAR IMAGEM PARA O GITHUB
        // ==========================================

        const uploadImagem =
            await fetch(
                `${GITHUB_API}/repos/${repo}/contents/${caminhoImagem}`,
                {
                    method: "PUT",

                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/vnd.github+json",
                        "X-GitHub-Api-Version": "2022-11-28"
                    },

                    body: JSON.stringify({
                        message: `Adicionar imagem: ${nome}`,
                        content: imagemBase64
                    })
                }
            );

        const resultadoImagem =
            await uploadImagem.json();

        if (!uploadImagem.ok) {

            console.error(resultadoImagem);

            return res.status(500).json({
                erro: "Não foi possível enviar a imagem para o GitHub."
            });
        }

        // ==========================================
        // 2. PEGAR produtos.json ATUAL
        // ==========================================

        const caminhoProdutos = "produtos.json";

        const respostaProdutos =
            await fetch(
                `${GITHUB_API}/repos/${repo}/contents/${caminhoProdutos}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/vnd.github+json",
                        "X-GitHub-Api-Version": "2022-11-28"
                    }
                }
            );

        let produtos = [];
        let sha = null;

        if (respostaProdutos.ok) {

            const arquivo =
                await respostaProdutos.json();

            sha = arquivo.sha;

            const conteudo =
                Buffer.from(
                    arquivo.content,
                    "base64"
                ).toString("utf-8");

            produtos = JSON.parse(conteudo);

        } else if (respostaProdutos.status !== 404) {

            return res.status(500).json({
                erro: "Não foi possível acessar produtos.json."
            });
        }

        // ==========================================
        // 3. CRIAR NOVO PRODUTO
        // ==========================================

        const novoProduto = {

            id: id,

            nome: String(nome).trim(),

            descricao:
                String(descricao || "").trim(),

            preco: precoNumerico,

            imagem: caminhoImagem
        };

        produtos.push(novoProduto);

        // ==========================================
        // 4. ATUALIZAR produtos.json
        // ==========================================

        const novoConteudo =
            Buffer
                .from(
                    JSON.stringify(produtos, null, 4)
                )
                .toString("base64");

        const atualizarProdutos =
            await fetch(
                `${GITHUB_API}/repos/${repo}/contents/${caminhoProdutos}`,
                {
                    method: "PUT",

                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/vnd.github+json",
                        "X-GitHub-Api-Version": "2022-11-28"
                    },

                    body: JSON.stringify({

                        message:
                            `Adicionar produto: ${nome}`,

                        content: novoConteudo,

                        ...(sha ? { sha } : {})
                    })
                }
            );

        const resultadoProdutos =
            await atualizarProdutos.json();

        if (!atualizarProdutos.ok) {

            console.error(resultadoProdutos);

            return res.status(500).json({
                erro:
                    "A imagem foi enviada, mas não foi possível atualizar produtos.json."
            });
        }

        // ==========================================
        // SUCESSO
        // ==========================================

        return res.status(200).json({

            sucesso: true,

            mensagem:
                "Produto adicionado com sucesso!",

            produto: novoProduto
        });

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro: "Erro interno do servidor."
        });
    }
}
