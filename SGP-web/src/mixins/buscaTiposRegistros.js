export const buscatiposRegistros = {
  methods: {
    buscatiposRegistros: async function (store) {
      // Se o tipo de registros já estiver no store não faz nada se não estiver, faz a chamada ao Bakc End
      if (_.isEmpty(store.state.tipoRegistros)) {
        await axiosLaravel.get('tipo-registros/').then(async (response) => {
          store.commit('SET_TIPOREGISTROS', response.data)
        })
      }
    }
  }
}
