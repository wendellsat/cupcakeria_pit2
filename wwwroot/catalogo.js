async function carregarCatalogo() {
  const mensagem = document.getElementById("mensagem");
  const catalogo = document.getElementById("catalogo");

  try {
    const resposta = await fetch("/api/cupcakes");
    if (!resposta.ok) throw new Error("Falha ao buscar o catálogo");
    const cupcakes = await resposta.json();

    mensagem.textContent = "";
    for (const c of cupcakes) {
      const card = document.createElement("div");
      card.className = "card";

      const nome = document.createElement("h3");
      nome.textContent = c.nome;

      const descricao = document.createElement("p");
      descricao.textContent = c.descricao;

      const preco = document.createElement("p");
      preco.className = "preco";
      preco.textContent = "R$ " + c.preco.toFixed(2).replace(".", ",");

            const botao = document.createElement("button");
      botao.className = "btn";
      botao.textContent = "Adicionar ao carrinho";
      botao.onclick = () => adicionarAoCarrinho(c);

      card.append(nome, descricao, preco, botao);
      catalogo.appendChild(card);
    }
  } catch (erro) {
    mensagem.textContent = "Não foi possível carregar o catálogo. Tente novamente mais tarde.";
  }
}

carregarCatalogo();