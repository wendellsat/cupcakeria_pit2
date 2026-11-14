let idEmEdicao = null;

function formatarPreco(valor) {
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

function mostrarMensagem(texto, tipo) {
  const mensagem = document.getElementById("mensagem-admin");
  mensagem.className = tipo;
  mensagem.textContent = texto;
}

async function carregarLista() {
  const lista = document.getElementById("lista-admin");

  try {
    const resposta = await fetch("/api/cupcakes");
    if (!resposta.ok) throw new Error("Falha ao buscar os cupcakes");
    const cupcakes = await resposta.json();

    lista.innerHTML = "";
    for (const c of cupcakes) {
      const linha = document.createElement("div");
      linha.className = "linha-admin";

      const texto = document.createElement("span");
      texto.textContent = c.nome + " — " + formatarPreco(c.preco);

      const editar = document.createElement("button");
      editar.className = "btn";
      editar.textContent = "Editar";
      editar.onclick = () => iniciarEdicao(c);

      linha.append(texto, editar);
      lista.appendChild(linha);
    }
  } catch (erro) {
    lista.textContent = "Não foi possível carregar os cupcakes.";
  }
}

function iniciarEdicao(cupcake) {
  idEmEdicao = cupcake.id;
  document.getElementById("nome").value = cupcake.nome;
  document.getElementById("descricao").value = cupcake.descricao;
  document.getElementById("preco").value = cupcake.preco;
  document.getElementById("titulo-form").textContent = "Editar cupcake #" + cupcake.id;
  document.getElementById("btn-salvar").textContent = "Salvar alterações";
  document.getElementById("btn-cancelar").hidden = false;
  mostrarMensagem("", "");
}

function limparFormulario() {
  idEmEdicao = null;
  document.getElementById("nome").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("preco").value = "";
  document.getElementById("titulo-form").textContent = "Novo cupcake";
  document.getElementById("btn-salvar").textContent = "Cadastrar";
  document.getElementById("btn-cancelar").hidden = true;
}

async function salvarCupcake() {
  const nome = document.getElementById("nome").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const preco = parseFloat(document.getElementById("preco").value);

  if (!nome) {
    mostrarMensagem("Informe o nome do cupcake.", "erro");
    return;
  }
  if (!descricao) {
    mostrarMensagem("Informe a descrição do cupcake.", "erro");
    return;
  }
  if (isNaN(preco) || preco <= 0) {
    mostrarMensagem("Informe um preço maior que zero.", "erro");
    return;
  }

  const editando = idEmEdicao !== null;
  const url = editando ? "/api/cupcakes/" + idEmEdicao : "/api/cupcakes";
  const metodo = editando ? "PUT" : "POST";

  try {
    const resposta = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nome, descricao: descricao, preco: preco })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      mostrarMensagem(dados.erro || "Não foi possível salvar.", "erro");
      return;
    }

    limparFormulario();
    mostrarMensagem("Cupcake " + dados.nome + (editando ? " atualizado" : " cadastrado") + " com sucesso!", "sucesso");
    carregarLista();
  } catch (erro) {
    mostrarMensagem("Erro de conexão. Tente novamente.", "erro");
  }
}

document.getElementById("btn-salvar").onclick = salvarCupcake;
document.getElementById("btn-cancelar").onclick = () => {
  limparFormulario();
  mostrarMensagem("", "");
};

carregarLista();