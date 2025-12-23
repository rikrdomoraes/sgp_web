<template>
  <!-- 69906 - Definicao de publico alvo -->
  <div class="box-body">
    <div v-show="loading.show" class="overlay" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;display: none; background: rgba(255, 255, 255, 0.7); z-index: 1000">
        <i class="fa fa-refresh fa-spin" style="top: 50%; left: 50%; position: absolute; font-size: 30px"></i>
    </div>
    <div v-if="telaProjeto && definicoes.length === 0">
      <div class="publico-alvo-descritivo">Sem dados cadastrados de público-alvo <strong>previsto</strong>.</div>
    </div>
    <div v-else class="publico-alvo-previsto-container">
      <div class="publico-alvo-descritivo">
        Descrição de Público-alvo.
        <g-button-moema v-if="!editar && permiteEditar && !telaProjeto" color="primary" @click.native="toggleEdicao(true)" class="botao-editar-publico"><i class="fa fa-pencil" aria-hidden="true"></i>
          Alterar</g-button-moema>
      </div>
      <div class="column start-centered publico-alvo-table-container">
        <div class="publico-alvo-subtitulo">
           <i class="fa fa-users" aria-hidden="true"></i> Público-alvo <b>previsto</b> cadastrado ({{ itemTable.length }}):
        </div>
          <b-container fluid class="publico-alvo-table" v-if="!editar">
            <b-table show-empty
                      stacked="md"
                      :key="tableDataKey"
                      striped
                      :bordered="table.bordered"
                      :items="table.items"
                      :fields="table.fields"
                      :current-page="table.currentPage"
                      :per-page="table.perPage"
                      :filter="table.filter"
                      empty-text="Nenhum registro encontrado"
                      :sort-by.sync="table.sortBy"
                      :sort-desc.sync="table.sortDesc">
                      <template slot="publico" scope="row">
                        <b>{{ row.value }}</b>
                      </template>
                      <template slot="tipo" scope="row">
                        <div :title="row.item.descricao">
                          {{ row.value }}
                        </div>
                      </template>
            </b-table>
          </b-container>
      </div>
      <div class="publico-alvo-content" v-if="editar">
        <div class="publico-alvo-definicao-container">
          <div v-for="item, index in definicaoPublicoAlvo" class="publico-alvo-item-container"
            @click.self="toogleItem(index)" :class="{ 'adjust-height': item.aberto }" 
            v-if="!(item.tipo === 'Sociedade em geral' && telaParticipante)">
            
            <div class="publico-alvo-titulo" @click.self="toogleItem(index)">
              <strong>{{ item.tipo }}</strong> <i class="fa fa-caret-right" aria-hidden="true"
              :class="{ 'rotate-icon': item.aberto }"></i>
            </div>
            <div class="divider" :class="{ 'show-item': item.aberto }" v-if="item.aberto"></div>
            <div class="publico-alvo-content-container" v-if="item.aberto">
              <div v-for="detalhamento in item.subgrupos" :title="detalhamento.descricao" v-if="item.aberto"
                class="publico-alvo-items" :class="{ 'show-item': item.aberto }">
                <label class="conjunto-item">
                  {{ detalhamento.subgrupo }} <input :disabled="!editar" v-model="detalhamento.selecionado" type="checkbox"
                    class="publico-check" @change="updateSelecao(detalhamento.id, detalhamento.selecionado, item.tipo)" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="publico-alvo-acoes-container">
        <g-button-moema v-if="editar && !telaParticipante" color="error" @click.native="toggleEdicao(false)" type="button"><i class="fa fa-check-circle-o"
            aria-hidden="true"></i> Cancelar Edição</g-button-moema>
        <g-button-moema v-if="editar && !telaParticipante" color="warning" @click.native="limparSelecao()" type="button"><i class="fa fa-check-circle-o"
            aria-hidden="true"></i> Limpar</g-button-moema>
        <g-button-moema v-if="editar && !telaParticipante" color="primary" @click.native="salvarSelecao()"><i class="fa fa-floppy-o" aria-hidden="true"></i>
          Salvar</g-button-moema>
      </div>
    </div>
    <vue-snotify></vue-snotify>
  </div>
</template>
  
<script>
export default {
  name: 'publicoAlvoDescricao',
  data () {
    return {
      loading: {
        show: false
      },
      definicaoPublicoAlvo: {},
      defAux: [],
      definicoes: [],
      editar: false,
      table: {
        items: [],
        currentPage: 0,
        perPage: 999,
        totalRows: 0,
        sortBy: 'publico',
        sortDesc: false,
        filter: null,
        emptyText: 'Não tem nenhum registro para mostrar',
        fields: [
          { key: 'publico', label: 'Grupo', sortable: true, thStyle: 'width: 20%; text-align: left', class: 'text-left' },
          { key: 'tipo', label: 'Público-alvo', sortable: true, thStyle: 'width: 80%; text-align: left', class: 'text-left' }
        ]
      },
      itemTable: []
    }
  },
  props: {
    proposta: null,
    fixado: Boolean,
    permiteEditar: Boolean,
    abrirAbas: Boolean,
    telaProjeto: {
      type: Boolean,
      default: false
    },
    idParticipante: {
      type: Number,
      default: null
    },
    telaParticipante: {
      type: Boolean,
      default: false
    },
    tipoDescricao: {
      type: String,
      default: 'PREVISTO'
    },
    dataNascimentoEdit: {
      type: String,
      default: ''
    },
    sexoEdit: {
      type: String,
      default: ''
    },
    escolaridadeEdit: {
      type: String,
      default: ''
    }
  },
  computed: {
  },
  watch: {
    // Ajustar seleções de acordo com
    dataNascimentoEdit (newValue, oldValue) {
      console.log('MUDOU DE ', oldValue, 'PARA', newValue)
      if (newValue.length >= 10) {
        const parts = newValue.split('/')
        const year = parts[2]
        const yearNumber = parseInt(year, 10)
        if (yearNumber >= 1946 && yearNumber <= 1964) {
          this.updateSelecao(11, true, 'Geração')
        } else if (yearNumber >= 1965 && yearNumber <= 1980) {
          this.updateSelecao(12, true, 'Geração')
        } else if (yearNumber >= 1981 && yearNumber <= 1996) {
          this.updateSelecao(13, true, 'Geração')
        } else if (yearNumber >= 1997 && yearNumber <= 2009) {
          this.updateSelecao(14, true, 'Geração')
        } else if (yearNumber >= 2010) {
          this.updateSelecao(15, true, 'Geração')
        }
      }
    },
    sexoEdit (newValue, oldValue) {
      console.log('MUDOU DE ', oldValue, 'PARA', newValue)
      if (newValue === 'Masculino') {
        this.updateSelecao(7, true, 'Identidade de Gênero')
      } else if (newValue === 'Feminino') {
        this.updateSelecao(8, true, 'Identidade de Gênero')
      } else {
        this.updateSelecao(9, true, 'Identidade de Gênero')
      }
    },
    escolaridadeEdit (newValue, oldValue) {
      console.log('MUDOU DE ', oldValue, 'PARA', newValue)
      if (newValue === 'Analfabeto') {
        this.updateSelecao(27, true, 'Escolaridade')
      } else if (newValue === 'Ensino Fundamental') {
        this.updateSelecao(28, true, 'Escolaridade')
      } else if (newValue === 'Ensino Médio') {
        this.updateSelecao(29, true, 'Escolaridade')
      } else {
        this.updateSelecao(30, true, 'Escolaridade')
      }
    }
  },
  mounted: function () {
    if (this.telaParticipante) {
      this.editar = this.permiteEditar
      console.log(this.idParticipante)
    }
    this.buscaDefinicaoPublicoAlvo()
  },
  methods: {
    async buscaDefinicaoPublicoAlvo () {
      console.log('BUSCANDO DEFINICAO PUBLICO ALVO')
      this.loading.show = true
      await axiosLaravel.get('definicaoparticipante').then((response) => {
        this.definicaoPublicoAlvo = response.data
        console.log('RESULTADO CONSULTA>>>>>', this.definicaoPublicoAlvo)
        this.definicaoPublicoAlvo.forEach(item => {
          item.aberto = this.abrirAbas
          item.subgrupos.forEach(item => {
            item.selecionado = false
          })
        })
        if (!this.telaParticipante) {
          console.log('BUSCA GRAVADAS', this.telaParticipante)
          this.buscaDefinicoesGravadas()
        }
        if (this.idParticipante !== null) {
          this.buscaDefinicoesParticipante()
        }
        this.loading.show = false
      })
        .catch((error) => {
          this.$root.trataErro(error)
          this.loading.show = false
        })
    },
    buscaDefinicoesGravadas () {
      this.loading.show = true
      axiosLaravel.get('/definicaoparticipante/getPrevistosProjeto/' + this.proposta).then((response) => {
        this.definicoes = response.data
        this.defAux = this.definicoes.slice()
        console.log('1 - DEFINICOES CHECKBOX', this.definicoes)
        this.initCheckbox()
        this.loading.show = false
        this.$forceUpdate()
      })
        .catch((error) => {
          this.$root.trataErro(error)
          this.loading.show = false
          this.$forceUpdate()
        })
    },
    buscaDefinicoesParticipante () {
      this.loading.show = true
      axiosLaravel.get('/definicaoparticipante/getRealizadosParticipante/' + this.idParticipante).then((response) => {
        this.definicoes = response.data
        console.log('DEFINICOES', this.definicoes)
        this.defAux = this.definicoes.slice()
        this.initCheckbox()
        this.loading.show = false
        this.$forceUpdate()
      })
        .catch((error) => {
          this.$root.trataErro(error)
          this.loading.show = false
          this.$forceUpdate()
        })
    },
    initCheckbox () {
      console.log('2 - INIT CHECKBOX', this.definicaoPublicoAlvo, this.definicoes)
      this.itemTable = []
      if (_.isEmpty(this.definicaoPublicoAlvo)) {
        return
      }
      this.definicaoPublicoAlvo.forEach(subgrupo => {
        subgrupo.subgrupos.forEach(item => {
          // Verifica se item.id está presente em this.definicoes
          if (this.definicoes.includes(item.id)) {
            let obj = {
              publico: subgrupo.tipo,
              tipo: item.subgrupo,
              descricao: item.descricao
            }
            item.selecionado = true
            this.itemTable.push(obj)
            console.log(item, subgrupo.tipo)
          } else {
            item.selecionado = false
          }
        })
      })
      this.table.items = this.itemTable
      this.$forceUpdate()
    },
    toogleItem (index) {
      if (this.fixado) {
        return
      }
      this.definicaoPublicoAlvo[index].aberto = !this.definicaoPublicoAlvo[index].aberto
      this.$forceUpdate()
    },
    updateSelecao (id, seleciona, tipo) {
      console.log(id, seleciona, tipo)
      if (seleciona) {
        if (this.telaParticipante) {
          // Verifica se está na tela de Participante
          // Se estiver, pega os IDs que já estão selecionados do tipo
          // Deseleciona todos os que não forem o id passado
          // Seleciona normalmente o id
          let indexTipo = this.getDefinicoesPorTipo(tipo, id)
          this.removerDefinicoesSelecionadasLista(indexTipo)
        }
        console.log(id)
        if (id === 32) {
          this.limparSelecao()
        }
        // verifica se existe o ID no Array
        if (!this.definicoes.includes(id)) {
          // Adiciona
          this.definicoes.push(id)
        }
      } else {
        // verifica se existe o ID no Array
        let index = this.definicoes.indexOf(id)
        if (index !== -1) {
          // Remove
          this.definicoes.splice(index, 1)
        }
      }
      if (this.tipoDescricao === 'REALIZADO') {
        this.$emit('descricaoParticipanteDefs', this.definicoes)
      }
      console.log('definicoes atualizadas', this.definicoes)
      this.initCheckbox()
      this.$forceUpdate()
    },
    limparSelecao () {
      this.definicaoPublicoAlvo.forEach(item => {
        item.aberto = true
        item.subgrupos.forEach(item => {
          item.selecionado = false
        })
      })
      this.definicoes = [31]
      this.initCheckbox()
      this.$forceUpdate()
    },
    salvarSelecao () {
      if (_.isEmpty(this.definicoes)) {
        // se etiver vazio, coloca o indice de 'não respondido'
        this.definicoes.push(31)
      }
      this.loading.show = true
      let obj = {
        proposta: this.proposta,
        participante: this.idParticipante,
        tipo: this.tipoDescricao,
        definicoes: this.definicoes
      }
      axiosLaravel.post('definicaoparticipante/vincular', obj).then((response) => {
        this.$snotify.success(response.data.message)
        this.defAux = this.definicoes.slice()
        this.toggleEdicao(false)
        this.loading.show = false
      })
        .catch((error) => {
          this.$root.trataErro(error)
          this.loading.show = false
        })
    },
    toggleEdicao (value) {
      this.editar = value
      // Cancelou Edicao, reseta valores
      if (!this.editar) {
        this.definicoes = this.defAux.slice()
        this.initCheckbox()
      }
    },
    getDefinicoesPorTipo (tipo, idSelecionada) {
      let indices = []
      this.definicaoPublicoAlvo.forEach(item => {
        if (item.tipo === tipo) {
          item.subgrupos.forEach(subgrupo => {
            if (subgrupo.id !== idSelecionada) {
              indices.push(subgrupo.id)
            }
          })
        }
      })
      return indices
    },
    removerDefinicoesSelecionadasLista (indices) {
      indices.forEach(indice => {
        let index = this.definicoes.indexOf(indice)
        // verifica se existe o ID no Array
        if (index !== -1) {
          // Remove
          this.definicoes.splice(index, 1)
        }
      })
    }
  }
}
</script>
  
<style scoped>
@keyframes fade {
  0% {
    opacity: 0;
    transform: translateX(-10px);
  }

  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}

.publico-alvo-subtitulo {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
}

.publico-alvo-table-container {
  width: 100%;
}

.publico-alvo-table {
  width: 100%;
}

.publico-alvo-previsto-container {
  width: 100%;
  min-height: 400px;
  padding: 10px;
  border: 1px solid #DDDDDD;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}

.publico-alvo-descritivo {
  width: 100%;
  padding: 30px;
  background-color: #FFFDD6;
}

.publico-alvo-definicao-container {
  width: 90%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 10px;
}

.publico-alvo-titulo {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.publico-alvo-item-container {
  user-select: none;
  cursor: pointer;
  width: 30%;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #DDDDDD;
}

.adjust-height {
  min-height: 500px;
}

.show-item {
  animation: fade 0.3s ease;
}

.publico-alvo-items {
  padding: 10px;
  border: 1px solid #DDDDDD;
  border-radius: 2px;
  margin-top: 2px;
  margin-bottom: 2px;
  transition: 0.3s ease;
}

.publico-alvo-items:nth-child(even) {
  background-color: #eaeaea;
}

.divider {
  width: 100%;
  height: 2px;
  border-bottom: 1px solid #DDDDDD;
  margin-bottom: 10px;
  margin-top: 10px;
}

.rotate-icon {
  transform: rotate(90deg);
  transition: 0.2s ease;
}

.publico-alvo-content {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.publico-alvo-content-container {
  max-height: 400px;
  overflow-y: auto;
  padding: 5px;
  box-sizing: border-box;
  scrollbar-width: thin;
}
.publico-alvo-content-container::-webkit-scrollbar {
    width: 6px;
}

.conjunto-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-weight: 400;
  cursor: pointer;
  padding: 2px;
}

.publico-check {
  cursor: pointer;
  width: 20px;
  height: 20px;
}

.publico-alvo-acoes-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
}

.botao-editar-publico {
  margin-left: 10px;
}

</style>