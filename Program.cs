using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<LojaContext>(o =>
    o.UseSqlite("Data Source=cupcakeria.db"));

var app = builder.Build();

// Cria o banco e cadastra alguns cupcakes na primeira execução
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<LojaContext>();
    db.Database.EnsureCreated();

    if (!db.Cupcakes.Any())
    {
        db.Cupcakes.AddRange(
            new Cupcake { Nome = "Red Velvet", Descricao = "Massa aveludada com cobertura de cream cheese", Preco = 12.90m },
            new Cupcake { Nome = "Brigadeiro Gourmet", Descricao = "Chocolate belga com granulado", Preco = 11.50m },
            new Cupcake { Nome = "Limão Siciliano", Descricao = "Massa cítrica com merengue", Preco = 10.90m }
        );
        db.SaveChanges();
    }
}

app.UseDefaultFiles();
app.UseStaticFiles();

// História 1: listar o catálogo
app.MapGet("/api/cupcakes", async (LojaContext db) =>
    await db.Cupcakes.ToListAsync());
// História 3: finalizar o pedido
app.MapPost("/api/pedidos", async (NovoPedidoDto dto, LojaContext db) =>
{
    var nome = dto.NomeCliente?.Trim();
    var endereco = dto.Endereco?.Trim();

    if (string.IsNullOrWhiteSpace(nome))
        return Results.BadRequest(new { erro = "Informe o seu nome." });
    if (string.IsNullOrWhiteSpace(endereco))
        return Results.BadRequest(new { erro = "Informe o endereço de entrega." });
    if (dto.Itens is null || dto.Itens.Count == 0)
        return Results.BadRequest(new { erro = "O carrinho está vazio." });

    var pedido = new Pedido { NomeCliente = nome, Endereco = endereco };

    foreach (var item in dto.Itens)
    {
        if (item.Quantidade <= 0)
            return Results.BadRequest(new { erro = "Quantidade inválida." });

        var cupcake = await db.Cupcakes.FindAsync(item.CupcakeId);
        if (cupcake is null)
            return Results.BadRequest(new { erro = $"O cupcake {item.CupcakeId} não existe." });

        pedido.Itens.Add(new ItemPedido
        {
            CupcakeId = cupcake.Id,
            NomeCupcake = cupcake.Nome,
            PrecoUnitario = cupcake.Preco,
            Quantidade = item.Quantidade
        });
    }

    pedido.Total = pedido.Itens.Sum(i => i.PrecoUnitario * i.Quantidade);

    db.Pedidos.Add(pedido);
    await db.SaveChangesAsync();

    return Results.Created($"/api/pedidos/{pedido.Id}", new { pedido.Id, pedido.Total });
});
// História 4: administrador cadastra e edita cupcakes
app.MapPost("/api/cupcakes", async (CupcakeDto dto, LojaContext db) =>
{
    var erro = Validacao.ValidarCupcake(dto);
    if (erro is not null)
        return Results.BadRequest(new { erro });

    var cupcake = new Cupcake
    {
        Nome = dto.Nome!.Trim(),
        Descricao = dto.Descricao!.Trim(),
        Preco = dto.Preco
    };

    db.Cupcakes.Add(cupcake);
    await db.SaveChangesAsync();

    return Results.Created($"/api/cupcakes/{cupcake.Id}", cupcake);
});

app.MapPut("/api/cupcakes/{id:int}", async (int id, CupcakeDto dto, LojaContext db) =>
{
    var erro = Validacao.ValidarCupcake(dto);
    if (erro is not null)
        return Results.BadRequest(new { erro });

    var cupcake = await db.Cupcakes.FindAsync(id);
    if (cupcake is null)
        return Results.NotFound(new { erro = "Cupcake não encontrado." });

    cupcake.Nome = dto.Nome!.Trim();
    cupcake.Descricao = dto.Descricao!.Trim();
    cupcake.Preco = dto.Preco;

    await db.SaveChangesAsync();

    return Results.Ok(cupcake);
});
app.Run();