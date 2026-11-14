const PROXIMO_STATUS = {
  "Recebido": "Em preparo",
  "Em preparo": "Entregue"
};

function formatarPreco(valor) {
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

function formatarData(texto) {
  return new Date(texto).toLocaleString("pt-BR");
}

async function carregarPedidos() {
  const mensagem = document.getElementById("mensagem-pedidos");
  const lista = document.getElementById("lista-pedidos");
  mensagem.className = "";

  try {
    const resposta = await fetch("/api/pedidos");
    if (!resposta.ok) throw new Error("Falha ao buscar os pedidos");
    const pedidos = await resposta.json();

    lista.innerHTML = "";
    mensagem.textContent = pedidos.length === 0 ? "Nenhum pedido recebido ainda." : "";

    for (const p of pedidos) {
      const cartao = document.createElement("div");
      cartao.className = "painel";

      const titulo = document.createElement("h3");
      titulo.textContent = "Pedido #" + p.id + " — " + p.status;

      const cliente = document.createElement("p");
      cliente.textContent = p.nomeCliente + " | " + p.endereco;

      const data = document.createElement("p");
      data.textContent = "Feito em " + formatarData(p.criadoEm);

      const itens = document.createElement("ul");
      for (const i of p.itens) {
        const li = document.createElement("li");
        li.textContent = i.quantidade + "x " + i.nomeCupcake + " (" + formatarPreco(i.precoUnitario) + ")";
        itens.appendChild(li);
      }

      const total = document.createElement("p");
      total.className = "total";
      total.textContent = "Total: " + formatarPreco(p.total);

      cartao.append(titulo, cliente, data, itens, total);

      const proximo = PROXIMO_STATUS[p.status];
      if (proximo) {
        const botao = document.createElement("button");
        botao.className = "btn";
        botao.textContent = "Marcar como " + proximo;
        botao.onclick = () => mudarStatus(p.id, proximo);
        cartao.appendChild(botao);
      }

      lista.appendChild(cartao);
    }
  } catch (erro) {
    mensagem.className = "erro";
    mensagem.textContent = "Não foi possível carregar os pedidos.";
  }
}

async function mudarStatus(id, status) {
  const mensagem = document.getElementById("mensagem-pedidos");

  try {
    const resposta = await fetch("/api/pedidos/" + id + "/status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: status })
    });

    if (!resposta.ok) {
      const dados = await resposta.json();
      mensagem.className = "erro";
      mensagem.textContent = dados.erro || "Não foi possível atualizar o status.";
      return;
    }

    carregarPedidos();
  } catch (erro) {
    mensagem.className = "erro";
    mensagem.textContent = "Erro de conexão. Tente novamente.";
  }
}

carregarPedidos();