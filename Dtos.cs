public record NovoItemDto(int CupcakeId, int Quantidade);
public record NovoPedidoDto(string? NomeCliente, string? Endereco, List<NovoItemDto>? Itens);

public record CupcakeDto(string? Nome, string? Descricao, decimal Preco);

public static class Validacao
{
    public static string? ValidarCupcake(CupcakeDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nome))
            return "Informe o nome do cupcake.";
        if (string.IsNullOrWhiteSpace(dto.Descricao))
            return "Informe a descrição do cupcake.";
        if (dto.Preco <= 0)
            return "O preço deve ser maior que zero.";
        return null;
    }
}

public record StatusDto(string? Status);