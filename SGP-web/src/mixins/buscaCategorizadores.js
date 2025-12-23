export const buscaCategorizadores = {
  methods: {
    buscaCategorizadores: async function (store) {
      if (_.isEmpty(store.state.categorizadores)) {
        // Se os categorizadores já estiverem no store não chama novamente o Back End
        await axiosLaravel.get('categorizadores/').then((response) => {
          store.commit('SET_CATEGORIZADORES', response.data)
        })
      }
    }
  }
}
