const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));

const pastaArtigos = path.join(__dirname, "artigos");
if (!fs.existsSync(pastaArtigos)) {
    fs.mkdirSync(pastaArtigos);
}

app.get('/', (req, res) => {
    fs.readdir(pastaArtigos, (err, arquivos) => {
        const lista = arquivos.map(nome => {
            const titulo = nome.replace(".txt", "").replace(/-/g, " ");
            return `<li><a href="/artigo/${nome}">${titulo}</a></li>`;
        }).join("");

        res.send(`
            <html><head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no">
<meta charset="UTF-8"><title>VWIKI</title><style>
                body { font-family: sans-serif; background: #eee; padding: 40px; }
                .container { max-width: 800px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                ul { padding-left: 20px; }
                a { color: #007BFF; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style></head><body>
                <div class="container">
                    <h1>VWIKI</h1>
                    <p><a href="/novoartigo">Criar novo artigo</a></p>
                    <h2>Artigos:</h2>
                    <ul>${lista}</ul>
                </div>
            </body></html>
        `);
    });
});

app.get('/novoartigo', (req, res) => {
    res.send(`
        <html><head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no">
<meta charset="UTF-8"><title>Novo Artigo</title
><style>
            body { font-family: sans-serif; background: #eee; padding: 40px; }
            .container { max-width: 800px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            input, textarea { width: 100%; margin-bottom: 10px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
            button { padding: 10px 20px; border: none; background: #007BFF; color: white; border-radius: 4px; cursor: pointer; }
            button:hover { background: #0056b3; }
        </style>
      </head>
        <body>

            <div class="container">

                <h1>Criar novo artigo</h1>
                <p> formate seu artigo em html <p>
                <form method="POST" action="/salvar-artigo">
                <input type="text" name="titulo" placeholder="Título" required>
                <textarea name="conteudo" rows="10" placeholder="Conteúdo" required></textarea>
                 <button type="submit">Salvar</button>

                </form>
            </div>
        </body>
        </html>
    `);
});

app.post('/salvar-artigo', (req, res) => {
    const titulo = req.body.titulo?.trim();
    const conteudo = req.body.conteudo?.trim();

    if (!titulo || !conteudo) {
        return res.status(400).send("Título e conteúdo obrigatórios");
    }

    const nomeArquivo = titulo.toLowerCase().replace(/\s+/g, "-") + ".txt";
    const caminho = path.join(pastaArtigos, nomeArquivo);

    fs.writeFile(caminho, conteudo, err => {
        if (err) {
            return res.status(500).send("Erro ao salvar artigo");
        }

        res.send(`
            <html><head>

<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no">
<meta charset="UTF-8"><title>${titulo}</title><style>
                body { font-family: sans-serif; background: #eee; padding: 40px; }
                .container { max-width: 800px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                pre { white-space: pre-wrap; word-wrap: break-word; }
                a { color: #007BFF; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style></head><body>
                <div class="container">
                    <h1>${titulo}</h1>
                    <pre>${conteudo}</pre>
                    <p><a href="/">Voltar</a></p>
                </div>
            </body></html>
        `);
    });
});

app.get('/artigo/:nome', (req, res) => {
    const nome = req.params.nome;
    const caminho = path.join(pastaArtigos, nome);

    fs.readFile(caminho, "utf8", (err, conteudo) => {
        if (err) {
            return res.status(404).send("Artigo não encontrado");
        }

        const titulo = nome.replace(".txt", "").replace(/-/g, " ");

        res.send(`
            <html>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no">
<head><meta charset="UTF-8"><title>${titulo}</title><style>
                body { font-family: sans-serif; background: #eee; padding: 40px; }
                .container { max-width: 800px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                pre { white-space: pre-wrap; word-wrap: break-word; }
                a { color: #007BFF; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style></head><body>
                <div class="container">
                    <h1>${titulo}</h1>
                    <pre>${conteudo}</pre>
                    <p><a href="/">Voltar</a></p>
                </div>
            </body></html>
        `);
    });
});

app.use((req, res) => {
    res.status(404).send("Página não encontrada");
});

app.listen(3000, () => {
    console.log("VWIKI rodando em http://localhost:3000");
});
