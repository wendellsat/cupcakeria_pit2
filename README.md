# 🧁 Cupcakeria

Loja virtual de uma confeitaria gourmet de cupcakes: o cliente vê o catálogo, monta o carrinho e finaliza o pedido, e o administrador cadastra os cupcakes e acompanha os pedidos recebidos.

Projeto desenvolvido para a disciplina **Projeto Integrador Transdisciplinar em Engenharia de Software II (PIT II)**, como continuação do PIT I, em que foram levantados os requisitos do aplicativo de cupcakes (histórias de usuário e backlog).

**Autor:** Wendell

## Funcionalidades (histórias de usuário)

| ID | História | Prioridade |
|----|----------|:----------:|
| 1 | Como **cliente**, quero ver o catálogo de cupcakes, para escolher o que comprar | A |
| 2 | Como **cliente**, quero adicionar cupcakes ao carrinho, para montar meu pedido | A |
| 3 | Como **cliente**, quero finalizar o pedido informando nome e endereço, para receber os cupcakes | A |
| 4 | Como **administrador**, quero cadastrar e editar cupcakes, para manter o catálogo atualizado | B |
| 5 | Como **administrador**, quero ver os pedidos recebidos e atualizar o status, para preparar e entregar | B |

## Tecnologias

- **Back-end:** C# com ASP.NET Core (.NET 10), usando Minimal API
- **Banco de dados:** SQLite, acessado com Entity Framework Core
- **Front-end:** HTML, CSS e JavaScript puro (sem frameworks)
- **Versionamento:** Git e GitHub, com commits atômicos e semânticos

## Como rodar

### Pré-requisitos

- [.NET SDK 10](https://dotnet.microsoft.com/download)
- [Git](https://git-scm.com/)

### Passo a passo

```
git clone https://github.com/wendellsat/cupcakeria_pit2.git
cd cupcakeria_pit2
dotnet run
```

O terminal mostra a linha `Now listening on: http://localhost:XXXX` (por padrão, `5221`). Abra esse endereço no navegador e **deixe o terminal aberto** enquanto usa o sistema. Para parar, aperte `Ctrl + C`.

Na primeira execução, o banco (`cupcakeria.db`) é criado automaticamente, já com 3 cupcakes cadastrados.

### Páginas

| Endereço | Descrição |
|----------|-----------|
| `/` | Loja: catálogo, carrinho e finalização do pedido |
| `/admin.html` | Administração: cadastrar e editar cupcakes |
| `/pedidos.html` | Administração: ver os pedidos e atualizar o status |

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/cupcakes` | Lista o catálogo |
| POST | `/api/cupcakes` | Cadastra um cupcake |
| PUT | `/api/cupcakes/{id}` | Edita um cupcake |
| POST | `/api/pedidos` | Cria um pedido a partir dos itens do carrinho |
| GET | `/api/pedidos` | Lista os pedidos, do mais novo para o mais antigo |
| PUT | `/api/pedidos/{id}/status` | Atualiza o status (Recebido, Em preparo ou Entregue) |

## Estrutura do projeto

```
cupcakeria_pit2/
├── Program.cs         # configuração, criação do banco e rotas da API
├── Cupcake.cs         # modelo do cupcake
├── Pedido.cs          # modelo do pedido
├── ItemPedido.cs      # itens de cada pedido
├── LojaContext.cs     # ponte entre o código e o banco SQLite
├── Dtos.cs            # formato dos dados recebidos e validações
└── wwwroot/           # front-end
    ├── index.html, estilos.css, catalogo.js, carrinho.js, pedido.js
    ├── admin.html, admin.js
    └── pedidos.html, pedidos.js
```

## Decisões de projeto

- **O preço é calculado no servidor.** O front-end envia só quais cupcakes e quantas unidades; os preços e o total vêm do banco, para que ninguém consiga alterar o valor pelo navegador.
- **Validação nos dois lados.** A tela valida os campos e o servidor valida de novo, então a API também recusa dados inválidos quando chamada diretamente.
- **O preço fica registrado no pedido.** Cada item guarda o preço do momento da compra, então editar o preço de um cupcake não altera pedidos antigos.
- **O número do pedido identifica o pedido, não o cliente.** Ele aumenta a cada pedido novo e nunca se repete.
- **O carrinho fica no navegador** (`localStorage`), por isso continua lá ao atualizar a página.

## Limitações conhecidas e melhorias futuras

- As páginas de administração **não têm login**: quem souber o endereço consegue alterar o catálogo e os pedidos.
- Não há login de cliente, então não existe "meus pedidos".
- O banco é criado com `EnsureCreated`. Num projeto maior, o ideal é usar *migrations* para alterar as tabelas sem apagar os dados.
- O sistema roda localmente, sem hospedagem.

## Padrão de commits

Os commits seguem o padrão `tipo: descrição`, com um assunto por commit:

- `feat`: funcionalidade nova
- `fix`: correção de erro
- `refactor`: reorganização do código, sem mudar o comportamento
- `docs`: documentação
- `chore`: configurações e tarefas de apoio