using Microsoft.EntityFrameworkCore;

public class LojaContext : DbContext
{
    public LojaContext(DbContextOptions<LojaContext> options) : base(options) { }

    public DbSet<Cupcake> Cupcakes => Set<Cupcake>();
}