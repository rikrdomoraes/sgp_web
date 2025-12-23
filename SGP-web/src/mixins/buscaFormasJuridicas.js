export const buscaFormasJuridicas = {
  methods: {
    buscaFormasJuridicas: async function (store) {
      // Se os ramos de atividades já estiverem no store não chama novamente o Back End
      if (_.isEmpty(store.state.formasJuridicas)) {
        await axiosLaravel.get('formas-juridicas/').then((response) => {
          store.commit('SET_FORMAS_JURIDICAS', response.data)
        })
      }
    }
  }
}
