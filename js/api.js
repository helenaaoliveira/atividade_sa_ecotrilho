const API = new URL("../api/", document.currentScript.src).href;

async function requisicaoAPI(arquivo, opcoes = {}) {
    try {
        const resposta = await fetch(API + arquivo, {
            credentials: "same-origin",
            ...opcoes,
            headers: {
                "Content-Type": "application/json",
                ...(opcoes.headers || {})
            }
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro || dados.mensagem || "Erro na comunicação com o servidor.");
        }

        return dados;
    } catch (erro) {
        console.error(erro);
        throw erro;
    }
}
