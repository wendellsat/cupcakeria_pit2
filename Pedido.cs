public class Pedido
{
    public int Id { get; set; }
    public string NomeCliente { get; set; } = "";
    public string Endereco { get; set; } = "";
    public decimal Total { get; set; }
    public string Status { get; set; } = "Recebido";
    public DateTime CriadoEm { get; set; } = DateTime.Now;
    public List<ItemPedido> Itens { get; set; } = new();
}