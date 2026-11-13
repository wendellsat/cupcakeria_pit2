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

app.Run();