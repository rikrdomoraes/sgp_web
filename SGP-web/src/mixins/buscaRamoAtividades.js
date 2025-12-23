export const buscaRamoAtividades = {
  methods: {
    buscaRamoAtividades: async function (store) {
      // Se os ramos de atividades já estiverem no store não chama novamente o Back End
      if (_.isEmpty(store.state.ramoAtividades)) {
        await axiosLaravel.get('ramo-atividades/').then((response) => {
          store.commit('SET_RAMO_ATIVIDADES', response.data)
        })
      }
    }
  }
}
