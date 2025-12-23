export const validaProposta = {
  data () {
    return {}
  },
  methods: {
    validaProposta (proposta) {
      let propostaOK = true
      if (!this.isUploadingDocuments(proposta)) {
        this.$snotify.error('Faltam documentos à serem adicionados')
        propostaOK = false
      }
      if (!this.validateParticipantsMunicipalization(proposta)) {
        this.$snotify.error('Faltam participantes a serem adicionados aos municípios')
        propostaOK = false
      }
      if (!this.validaObjetivos(proposta)) {
        this.$snotify.error('Faltam adicionar metas para todos os objetivos')
        propostaOK = false
      } else if (!this.validaMetas(proposta)) {
        this.$snotify.error('Faltam adicionar atividades para todos as metas')
        propostaOK = false
      } else if (!this.validaAtividades(proposta)) {
        this.$snotify.error('Faltam adicionar items para todas as atividades')
        propostaOK = false
      } else if (!this.outrasValidacoes(proposta)) {
        propostaOK = false
      }
      return propostaOK
    },
    isUploadingDocuments (proposta) {
      let documentosEsperados = proposta.documentTypes.map((item) => {
        return item.type
      })
      let documentosCarregados = proposta.documents.map((item) => {
        return item.documentType.type
      })
      return _.difference(documentosEsperados, documentosCarregados).length === 0
    },
    // Valida se todos os participantes foram adicionatos
    validateParticipantsMunicipalization (proposta) {
      let totalParticipantes = 0
      proposta.audiences.forEach((publico) => {
        totalParticipantes = totalParticipantes + publico.directParticipants
      })
      let totalParticipantesMunicipio = 0
      proposta.municipalizationResume.forEach((municipio) => {
        totalParticipantesMunicipio = totalParticipantesMunicipio + municipio.totalParticipants
      })
      return totalParticipantes === totalParticipantesMunicipio
    },
    // Valida se todas as metas tem atividades
    validaMetas (proposta) {
      let metas = []
      proposta.objectives.forEach((objetivo) => {
        if (objetivo.goals) {
          objetivo.goals.forEach((meta) => {
            metas.push(meta)
          })
        }
      })
      return metas.every((meta) => {
        return meta.activities ? meta.activities.length > 0 : false
      })
    },
    // Valida se todas as atividades tem itens
    validaAtividades (proposta) {
      let atividades = []
      proposta.objectives.forEach((objetivo) => {
        if (objetivo.goals) {
          objetivo.goals.forEach((meta) => {
            if (meta.activities) {
              meta.activities.forEach((atividade) => {
                atividades.push(atividade)
              })
            }
          })
        }
      })
      return atividades.every((atividade) => {
        return atividade.items ? atividade.items.length > 0 : false
      })
    },
    validaObjetivos (proposta) {
      return proposta.objectives.every((item) => {
        return item.goals ? item.goals.length > 0 : false
      })
    },
    outrasValidacoes (proposta) {
      if (!proposta.audiences || proposta.audiences === 0) {
        this.$snotify.error('Você deve informar ao menos um público alvo!')
        return false
      }

      if (!proposta.teams || proposta.audiences.teams === 0) {
        this.$snotify.error('Você deve informar ao menos uma equipe!')
        return false
      }

      if (!proposta.objectives || proposta.audiences.objectives === 0) {
        this.$snotify.error('Você deve informar ao menos um objetivo específico!')
        return false
      }

      if (!proposta.solemnizations) {
        this.$snotify.error('Você deve informar ao menos uma solenização!')
        return false
      } else if (proposta.solemnizations.length === 0) {
        this.$snotify.error('Você deve informar ao menos uma solenização!')
        return false
      }
      return true
    }
  }
}
