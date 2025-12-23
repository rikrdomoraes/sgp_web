<template>
  <div class="content-wrapper" style="min-height: 870px;">
    <vue-headful :title="loading.tela ? 'Carregando aditivo' : 'Aditivo ' + (!_.isNull(id) ? 'ID ' + id : '')"/>

    <section class="content-header">
      <h1>
        <span class="col-md-5">{{ loading.tela ? 'Carregando aditivo...' : 'Aditivo ' + (!_.isNull(id) ? 'ID ' + id : '') }}</span>

        <span>
          <span v-if="!loading.tela" class="col-md-7 bloco_botoes">
            <g-button-moema color="primary" @click.native="imprimir"><i class="fa fa-print" aria-hidden="true"></i> Visualizar</g-button-moema>
          </span>
        </span>
      </h1>
    </section>


    <section class="content">
      <div class="box box-widget" style="min-height: 200px">
          <div v-if="loading.tela || _.isEmpty(solicitacao.aditivo.conteudo)">
            <div class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
          </div>

          <div v-else>
            <div class="box-header with-border hidden-print">
              <h3 class="box-title">{{ solicitacao.aditivo.modelo.nome }}</h3>
            </div>

            <div class="box-body">
              <div class="col-md-12" id="editorAditivo">
                <quill-editor
                  v-model="solicitacao.aditivo.conteudo"
                  :disabled="desabilitarEditor"
                  :options="quillOptions">
                </quill-editor>
              </div>
            </div>
          </div>

      </div>


    </section>

  </div>


</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    components: {
    },
    name: 'alteracoes-projeto-aditivo',
    data () {
      return {
        id: null,
        quillOptions: {
          theme: 'bubble'
        },
        desabilitarEditor: true,
        loading: {
          tela: false
        },
        solicitacao: {
          aditivo: {
            modelo: {},
            conteudo: ''
          }
        }
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    watch: {
    },
    mounted () {
    },
    created () {
      console.clear()
      if (_.has(this.$route.params, 'id')) {
        this.carregarDados({'id': this.$route.params.id})
      } else {
        this.$snotify.error('Não foi informado ID do processo')
        this.$router.go(-1)
      }
    },
    methods: {
      carregarDados (requisicao) {
        this.loading.tela = true
        axiosLaravel.post('projeto/alteracoes', requisicao).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            let solicitacao = response.data.retorno.solicitacao
            if (!_.isEmpty(solicitacao)) { // Se houver solicitação então carrega este objeto e transforma a proposta com as alterações dele
              this.solicitacao = solicitacao.dados
              this.id = solicitacao.processo.id
            }
            this.$forceUpdate()
            this.loading.tela = false
          } else {
            this.$snotify.error(response.data.mensagem)
          }
        })
          .catch((error) => {
            this.loading.tela = false
            this.$root.trataErro(error)
          })
      },
      imprimir () {
        window.print()
      }
    }
  }
</script>

<style>
  #editorAditivo .ql-editor {
    border: 0 !important;
    background: white;
  }
</style>
