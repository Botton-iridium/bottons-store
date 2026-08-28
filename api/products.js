```javascript
export default async function handler(req, res) {

    // Permitir apenas requisições POST
    if (req.method !== "POST") {
        return res.status(405).json({
            erro: "Método não permitido."
        });
    }


    try {

        const {
            nome,
            descricao,
            preco,
            imagem
        } = req.body;


        // Verificar dados obrigatórios

        if (!nome || preco === undefined || !imagem) {

            return res.status(400).json({
                erro: "Nome, preço e imagem são obrigatórios."
            });

        }


        // Verificar se o preço é válido

        const precoNumerico = Number(preco);

        if (
            !Number.isFinite(precoNumerico) ||
            precoNumerico <= 0
        ) {

            return res.status(400).json({
                erro: "Preço inválido."
            });

        }


        // Produto recebido com sucesso

        const produto = {

            id: Date.now(),

            nome: String(nome).trim(),

            descricao: String(descricao || "").trim(),

            preco: precoNumerico,

            imagem: String(imagem)

        };


        // Por enquanto, apenas devolvemos o produto.
        // No próximo passo vamos fazer a API enviar
        // esse produto para o GitHub.

        return res.status(200).json({

            sucesso: true,

            mensagem: "Produto recebido com sucesso!",

            produto: produto

        });


    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro: "Erro interno do servidor."
        });

    }

}
```
