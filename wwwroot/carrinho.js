const CHAVE_CARRINHO = "cupcakeria-carrinho";

function lerCarrinho() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_CARRINHO)) || [];
  } catch {
    return [];
  }
}

function salvarCarrinho(itens) {
  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
  renderizarCarrinho();
}

function adicionarAoCarrinho(cupcake) {
  const itens = lerCarrinho();
  const existente = itens.find(i => i.id === cupcake.id);

  if (existente) {
    existente.quantidade += 1;
  } else {
    itens.push({ id: cupcake.id, nome: cupcake.nome, preco: cupcake.preco, quantidade: 1 });
  }
  salvarCarrinho(itens);
}

function alterarQuantidade(id, diferenca) {
  let itens = lerCarrinho();
  const item = itens.find(i => i.id === id);
  if (!item) return;

  item.quantidade += diferenca;
  if (item.quantidade <= 0) {
    itens = itens.filter(i => i.id !== id);
  }
  salvarCarrinho(itens);
}

function removerDoCarrinho(id) {
  salvarCarrinho(lerCarrinho().filter(i => i.id !== id));
}

function formatarPreco(valor) {
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

function renderizarCarrinho() {
  const itens = lerCarrinho();
  const lista = document.getElementById("itens-carrinho");
  const total = document.getElementById("total-carrinho");
  const contador = document.getElementById("contador-carrinho");

  lista.innerHTML = "";

  if (itens.length === 0) {
    const vazio = document.createElement("p");
    vazio.textContent = "Seu carrinho está vazio.";
    lista.appendChild(vazio);
  }

  let soma = 0;
  let quantidadeTotal = 0;

  for (const item of itens) {
    soma += item.preco * item.quantidade;
    quantidadeTotal += item.quantidade;

    const linha = document.createElement("div");
    linha.className = "item-carrinho";

    const nome = document.createElement("span");
    nome.textContent = item.nome + " — " + formatarPreco(item.preco);

    const menos = document.createElement("button");
    menos.textContent = "−";
    menos.onclick = () => alterarQuantidade(item.id, -1);

    const quantidade = document.createElement("strong");
    quantidade.textContent = item.quantidade;

    const mais = document.createElement("button");
    mais.textContent = "+";
    mais.onclick = () => alterarQuantidade(item.id, 1);

    const remover = document.createElement("button");
    remover.textContent = "Remover";
    remover.onclick = () => removerDoCarrinho(item.id);

    linha.append(nome, menos, quantidade, mais, remover);
    lista.appendChild(linha);
  }

  total.textContent = formatarPreco(soma);
  contador.textContent = quantidadeTotal;
}

renderizarCarrinho();