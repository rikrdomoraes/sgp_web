export const buscaQuestionarioRisco = {
  methods: {
    buscaQuestionarioRisco: async function (store) {
      // Se os questionario de risco já estiverem no store não chama novamente o Back End
      if (_.isEmpty(store.state.questionarioRisco)) {
        await axiosLaravel.get('questionario-risco/').then((response) => {
          store.commit('SET_QUESTIONARIO', response.data)
        })
      }
    }
  }
}
