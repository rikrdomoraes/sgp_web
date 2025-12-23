const dictionary = {
  pt: {
    messages: {
      cpf: () => 'CPF inválido',
      cnpj: () => 'CNPJ inválido',
      required: (field) => `O campo ${field} é obrigatório.`,
      confirmed: (field) => `O campo ${field} não tem o mesmo valor.`,
      email: (field) => `O valor do campo ${field} não é válido.`,
      min: (field) => `Tamanho mínimo do campo ${field} é menor que o permitido.`,
      max: (field) => `Tamanho máximo do campo ${field} é maior que o permitido.`,
      max_value: (field) => `O valor do campo ${field} é maior que o permitido.`,
      min_value: (field) => `O valor do campo ${field} é menor que o permitido.`,
      numeric: (field) => `O valor do campo ${field} tem que ser numérico.`,
      decimal: (field) => `O valor do campo ${field} tem que ser decimal.`,
      size: (field) => `Tamanho do arquivo superiror ao permitido`,
      mimes: (field) => `Tipo do arquivo não permitido`,
      validdate: (field) => `A data informada não é válida.`,
      validdatetime: (field) => `A data e hora informada não é válida.`,
      dateeqpast: (field) => `A data informada deve ser igual ou anterior a hoje.`,
      datetimeeqpast: (field) => `A data e hora informada deve ser igual ou anterior a hoje.`,
      dateeqfuture: (field) => `A data informada deve ser posterior a hoje.`,
      datetimeeqfuture: (field) => `A data e hora informada deve ser posterior a hoje.`,
      agency: (field) => `Formato da agência esta incorreto`,
      contacorrente: (field) => `Formato da conta corrente esta incorreto`
    }
  }
}
export default dictionary
