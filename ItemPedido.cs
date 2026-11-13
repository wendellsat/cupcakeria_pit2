public class ItemPedido
{
    public int Id { get; set; }
    public int PedidoId { get; set; }
    public int CupcakeId { get; set; }
    public string NomeCupcake { get; set; } = "";
    public decimal PrecoUnitario { get; set; }
    public int Quantidade { get; set; }
}