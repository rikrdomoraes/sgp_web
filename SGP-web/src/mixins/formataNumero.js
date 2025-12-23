import moment from 'moment'

export const formataNumero = {
  methods: {
    formataNumero (numero, formato) {
      if (formato === 'moeda') {
        return 'R$ ' + numero.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      } else if (formato === 'percentual') {
        return (numero * 100).toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      } else if (formato === 'inteiro' || formato === 'numerico') {
        return numero.toLocaleString('pt-BR', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
      } else if (formato === 'data') {
        if (_.isEmpty(numero)) {
          return null
        } else {
          return moment(numero).format('L')
        }
      }
    }
  }
}
