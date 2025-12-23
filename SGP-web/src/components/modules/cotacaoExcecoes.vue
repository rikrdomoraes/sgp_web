<template>
    <div class="content-wrapper cotacao-main-container" v-if="usuarioLogado.userType === 'FUNDACAO'">
      <div v-show="loading" class="overlay" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;display: none; background: rgba(255, 255, 255, 0.7); z-index: 1000">
            <i class="fa fa-refresh fa-spin" style="top: 50%; left: 50%; position: absolute; font-size: 30px"></i>
      </div>
      <vue-headful :title="'SGP - GERENCIAMENTO DE ACESSO DE COTAÇÃO AUTOMÁTICA'"/>
        <section class="content-header">
          <h1>
            <span>Gerenciamento de Acesso - Cotação Automática</span>
          </h1>
          <b-breadcrumb :items="[{text: 'Inicial', href: '/'}, {text: 'Cadastro', href: '#'}, {text: 'ODS', active: true}]"/>
        </section>
        <div class="column all-centered cotacao-content">
          <div class="row-flex centered-start button-row">
            <button color="primary" class="btn btn-primary btn-flat" @click="toggleEdicao(true)"><i class="fa fa-plus-circle" aria-hidden="true"></i>
              Autorizar Acesso</button>
          </div>

          <div class="column start-centered cotacao-restricao" v-if="editando">
              <div class="restricao-row">
                <label> Selecione o Escopo do Acesso: </label>
                <select class="form-control hidden-print" v-model="tipoSelecionado" @change="buscaOptions()">
                    <option v-for="tipo in tipos" :value="tipo">{{tipo}}</option>
                </select>
              </div>
              <div v-if="tipoSelecionado === 'EDITAL'" class="restricao-row">
                <label> Selecione o Edital: </label>
                <select class="form-control hidden-print" v-model="editalSelecionado" @change="">
                    <option v-for="edital in editais" :value="edital">{{edital.id}} | {{ edital.ds_numero_edital }}</option>
                </select>
              </div>
              <div v-if="tipoSelecionado === 'PROPOSTA'" class="restricao-row">
                <label> Selecione a Proposta: </label>
                <select class="form-control hidden-print" v-model="propostaSelecionada" @change="">
                    <option v-for="proposta in propostas" :value="proposta">{{proposta.id}} | {{ proposta.ds_nome }}</option>
                </select>
              </div>
              <div v-if="tipoSelecionado === 'EXCECAO EDITAL'" class="restricao-row">
                <label> Selecione a Proposta: </label>
                <select class="form-control hidden-print" v-model="propostaSelecionada" @change="">
                    <option v-for="proposta in propostas" :value="proposta">{{proposta.id}} | {{ proposta.ds_nome }}</option>
                </select>
              </div>
              <div class="restricao-row">
                <label>Justificativa:</label>
                <textarea v-model="justificativa" name="descricao" class="form-control"></textarea>
              </div>
              <div class="row-flex centered-start button-row">
                <button color="primary" class="btn btn-primary btn-flat" @click="gravaRestricao()"><i class="fa fa-plus-circle" aria-hidden="true"></i>
                  Salvar
                </button>
                <button color="error" class="btn btn-warning btn-flat" @click="toggleEdicao(false)"><i class="fa fa-trash" aria-hidden="true"></i>
                  Cancelar
                </button>
              </div>
            </div>


          <b-container fluid class="tabela-restricao">
                <b-table show-empty
                        stacked="md"
                        :bordered="table.bordered"
                        :items="table.items"
                        :hover="table.hover"
                        :fields="table.fields"
                        :filter="table.filter"
                        :current-page="table.currentPage"
                        :per-page="table.perPage"
                        :sort-by.sync="table.sortBy"
                        :sort-desc.sync="table.sortDesc"
                        empty-text="Nenhum registro encontrado"
                >
                <template slot="ativo" scope="row">
                    <i :class="['fa fa-circle ', row.value ? 'text-green' : 'text-red']" aria-hidden="true" style="cursor: pointer;" @click="ativaDesativaRestricao(row.item)"></i>
                </template>
                <template slot="updated_at" scope="row">
                    {{row.value | moment("L")}}
                </template>
                </b-table>
            </b-container>

        </div>
    </div>
</template>
      <script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'cotacaoExcecoes',
    components: {
    },
    data () {
      return {
        table: {
          items: this.restricoesCadastradas,
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          perPage: 10,
          fields: [
              { key: 'id', label: 'ID', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'tipo', label: 'Tipo', sortable: true, thStyle: 'text-align: left', class: 'text-center' },
              { key: 'id_restricao', label: 'ID Restricao', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'nome_restricao', label: 'Nome Restricao', sortable: true, thStyle: 'text-align: left', class: 'text-left' },
              { key: 'justificativa', label: 'Justificativa', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'responsavel', label: 'Alterado por', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'ativo', label: 'Ativo', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'updated_at', label: 'Data Alteração', sortable: true, thStyle: 'text-align: center', class: 'text-center' }
          ]
        },
        loading: false,
        editando: false,
        restricoesCadastradas: [],
        editais: [],
        propostas: [],
        tipos: ['EDITAL', 'PROPOSTA'],
        tipoSelecionado: '',
        justificativa: '',
        editalSelecionado: [],
        propostaSelecionada: []
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    watch: {
    },
    mounted: function () {
      console.log('Cotacao Excecoes!')
      this.buscaExcecoes()
    },
    methods: {
      toggleEdicao (valor) {
        this.editando = valor
        if (this.editando) {
          this.tipoSelecionado = ''
          this.editalSelecionado = ''
          this.propostaSelecionada = ''
          this.justificativa = ''
        }
      },
      buscaTodosEditais () {
        this.loading = true
        axiosLaravel.get('edital/').then((response) => {
          this.editais = response.data
          this.loading = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.loading = false
            this.$root.trataErro(error)
          })
      },
      buscaPropostas () {
        this.loading = true
        axiosLaravel.get('cotacao/getPropostas/').then((response) => {
          this.propostas = response.data
          this.loading = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.loading = false
            this.$root.trataErro(error)
          })
      },
      buscaExcecoes () {
        this.loading = true
        axiosLaravel.get('cotacao/getRestricoes/').then((response) => {
          this.restricoesCadastradas = response.data
          this.table.items = this.restricoesCadastradas
          this.loading = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.loading = false
            this.$root.trataErro(error)
          })
      },
      buscaOptions () {
        if (this.tipoSelecionado === 'PROPOSTA' || this.tipoSelecionado === 'EXCECAO EDITAL') {
          if (this.propostas.length === 0) {
            this.buscaPropostas()
          }
        } else {
          if (this.editais.length === 0) {
            this.buscaTodosEditais()
          }
        }
      },
      verificaCamposEmBranco () {
        if (this.tipoSelecionado === '') {
          this.$snotify.error('Selecione o tipo de restrição antes de continuar')
          return false
        }
        if (this.editalSelecionado === '' && this.tipoSelecionado === 'EDITAL') {
          this.$snotify.error('Selecione o edital de continuar')
          return false
        }
        if (this.propostaSelecionada === '' && this.tipoSelecionado === 'PROPOSTA') {
          this.$snotify.error('Selecione a proposta antes de continuar')
          return false
        }
        if (this.justificativa === '') {
          this.$snotify.error('Informe a Justificativa antes de continuar')
          return false
        }
        return true
      },
      gravaRestricao () {
        if (this.verificaCamposEmBranco() === false) {
          return
        }
        let obj = {
          tipo: this.tipoSelecionado,
          id_restricao: this.tipoSelecionado !== 'EDITAL' ? this.propostaSelecionada.id : this.editalSelecionado.id,
          nome_restricao: this.tipoSelecionado !== 'EDITAL' ? this.propostaSelecionada.ds_nome : this.editalSelecionado.ds_numero_edital,
          justificativa: this.justificativa,
          responsavel: this.usuarioLogado.ds_login + ' ' + this.usuarioLogado.ds_nome_usuario
        }
        this.loading = true
        axiosLaravel.post('/cotacao/gravarExcecaoCotacao/', obj).then((response) => {
          this.$snotify.success(response.data)
          this.toggleEdicao(false)
          this.buscaExcecoes()
          this.$forceUpdate()
        })
          .catch((error) => {
            this.loading = false
            this.$root.trataErro(error)
          })
      },
      ativaDesativaRestricao (item) {
        this.loading = true
        axiosLaravel.get('/cotacao/gravaAtivoInativo/' + item.id).then((response) => {
          this.$snotify.success(response.data)
          this.table.items = []
          this.buscaExcecoes()
          this.$forceUpdate()
        })
          .catch((error) => {
            this.loading = false
            this.$root.trataErro(error)
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
  
    .cotacao-main-container {
        width: 100%;
        min-height: 870px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
    }

    .tabela-restricao {
      width: 100%;
    }

    .cotacao-content {
        width: 87%;
        padding: 10px;
        margin-top: 120px;
        margin-left: 5px;
        background-color: #FFFFFF;
        border-radius: 10px;
    }
    .cotacao-restricao {
        width: 80%;
        padding: 10px 30px;
        margin-bottom: 10px;
        background-color: #fdfbdd;
        border-radius: 10px;
        gap: 10px;
        animation: fade 0.3s ease;
    }

    .button-row {
      width: 100%;
      padding: 18px;
      gap: 5px;
    }

    .restricao-row {
      width: 100%;
    }

    @media (max-width:1440px){
      .cotacao-main-container {
        width: 94%;
      }
    }


</style>