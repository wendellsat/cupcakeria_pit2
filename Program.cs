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

app.Run();