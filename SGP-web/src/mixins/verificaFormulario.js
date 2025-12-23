export const verificaFormulario = {
  methods: {
    reflect (promise) {
      return promise.then(function (v) {
        return {
          v: v, status: 'resolved'
        }
      },
        function (e) {
          return {
            e: e, status: 'rejected'
          }
        })
    },
    verificaFormulario: async function (componentePai) {
      let temErro = false
      let validacoesFilhos = componentePai.$children.map((componente) => {
        return componente.$validator.validateAll()
      })
      await Promise.all(validacoesFilhos.map(this.reflect)).then(results => {
        temErro = results.some(x => x.v === false)
      })
      return temErro
    }
  }
}
