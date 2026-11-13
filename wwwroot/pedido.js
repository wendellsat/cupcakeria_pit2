async function finalizarPedido() {
  const mensagem = document.getElementById("mensagem-pedido");
  const campoNome = document.getElementById("nome-cliente");
  const campoEndereco = document.getElementById("endereco-cliente");
  const itens = lerCarrinho();

  mensagem.className = "erro";

  if (itens.length === 0) {
    mensagem.textContent = "Seu carrinho está vazio.";
    return;
  }
  if (!campoNome.value.trim()) {
    mensagem.textContent = "Informe o seu nome.";
    return;
  }
  if (!campoEndereco.value.trim()) {
    mensagem.textContent = "Informe o endereço de entrega.";
    return;
  }

  try {
    const resposta = await fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nomeCliente: campoNome.value,
        endereco: campoEndereco.value,
        itens: itens.map(i => ({ cupcakeId: i.id, quantidade: i.quantidade }))
      })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      mensagem.textContent = dados.erro || "Não foi possível finalizar o pedido.";
      return;
    }

    salvarCarrinho([]);
    campoNome.value = "";
    campoEndereco.value = "";
    mensagem.className = "sucesso";
    mensagem.textContent = "Pedido #" + dados.id + " recebido! Total: " + formatarPreco(dados.total);
  } catch (erro) {
    mensagem.textContent = "Erro de conexão. Tente novamente.";
  }
}

document.getElementById("btn-finalizar").onclick = finalizarPedido;