public record NovoItemDto(int CupcakeId, int Quantidade);
public record NovoPedidoDto(string? NomeCliente, string? Endereco, List<NovoItemDto>? Itens);