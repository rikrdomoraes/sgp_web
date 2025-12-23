<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <section class="content-header">
      <h1>
        <span>{{ehVisualizacao ? 'Visualização da' : (ehAssinatura ? 'Assinar a ' : enumeradores[etapa] + ' de ')}} Ratificação {{!_.isNull(id) ? 'ID ' + id : ''}}</span>

        <span v-if="!ehAssinatura">
          <span v-if="!loading.tela && !ehVisualizacao || (_.includes(['SOLICITACAO', 'CONCLUSAO'], etapa)) || (etapa === 'ASSINATURA_RATIFICACAO' && ehAssinatura && usuarioPodeAssinar)">
              <g-button-moema color="success" @click.native="permiteConcluir" type="button"><i class="fa fa-check" aria-hidden="true"></i> Concluir</g-button-moema>
          </span>
        </span>
        <span v-if="ehAssinatura">
          <span v-if="!loading.tela && !ehVisualizacao || (_.includes(['SOLICITACAO', 'CONCLUSAO'], etapa)) || (etapa === 'ASSINATURA_RATIFICACAO' && ehAssinatura && usuarioPodeAssinar)">
              <g-button-moema color="primary" @click.native="permiteConcluir" type="button"><i class="fa fa-pencil" aria-hidden="true"></i> Assinar </g-button-moema>
          </span>
        </span>

        <span v-if="!loading.tela">
            <g-button-moema color="warning" @click.native="voltar" type="button"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</g-button-moema>
        </span>
      </h1>

      <b-breadcrumb :items="[{text: 'Inicial', href: '/'}, {text: 'Remessa', href: '#'}, {text: 'Lista de Ratificações', active: true}]"/>
    </section>


    <section class="content">
      <div v-show="!loading.tela && !usuarioPodeAssinar && ehAssinatura" class="alert alert-info mt-4" role="alert">Você não é destinatário desta ratificação.</div>

      <div class="row" id="edicaoRatificacao">
        <div class="col-md-12">

<!-- Formulário de edição para fazer solicitações e consultas de visualização ---------------------------------------------------------->
          <div class="box box-primary">

            <div v-show="loading.tela || loading.usuarios" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

            <div class="box-header">
              <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Solicitação</h3>
            </div>

            <div class="box-body">

              <div class="row">

                <div class="col-md-12">

                  <div class="form-horizontal">

                  <!-- Assunto da ratificação -------------------------------------->
                    <div class="col-md-12">
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('assunto')}">
                        <label for="assunto_ratificacao" class="control-label col-md-2">Assunto da ratificação?</label>
                        <div class="col-md-10">
                          <select name="assunto" v-model="ratificacao.assunto" class="form-control" id="assunto_ratificacao" aria-hidden="true" v-validate="'required'"
                                  :disabled="ehVisualizacao || ehAssinatura || etapa !== 'SOLICITACAO'" @change="selecaoAssunto">
                            <option v-for="item in listaAssuntos" :value="item.value">{{ item.name }}</option>
                          </select>
                          <span v-if="errors.first('assunto')" class="label label-danger"> {{ errors.first('assunto') }}</span>
                        </div>
                      </div>
                    </div>



                  <!-- Texto de Requerimento -------------------------------------->
                    <div class="col-md-12">
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('solicitação')}">
                        <label for="requerimento_ratificacao" class="control-label col-md-2">Solicitação</label>
                        <div class="col-md-10">
                          <textarea-autosize v-model="ratificacao.requerimento" placeholder="Descreva aqui a solicitação sobre o assunto selecionado" name="solicitação" id="requerimento_ratificacao"
                                             v-resizable class="form-control" v-validate="'required'" :disabled="ehVisualizacao || ehAssinatura">
                          </textarea-autosize>
                          <!--<textarea name="solicitação" v-model="ratificacao.requerimento" rows="3" id="requerimento_ratificacao" class="form-control" v-validate="'required'" :disabled="ehVisualizacao || ehAssinatura || etapa !== 'SOLICITACAO'"></textarea>-->
                          <span v-if="errors.first('solicitação')" class="label label-danger"> {{ errors.first('solicitação') }}</span>
                        </div>
                      </div>
                    </div>



                    <!-- Alçada da ratificação -------------------------------------------->
                    <div class="col-md-12">
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('destinatario')}">
                        <label for="alcada_ratificacao" class="control-label col-md-2">Destinatário</label>
                        <div class="col-md-6">
                          <span v-if="loading.usuarios"><i class="fa fa-refresh fa-spin"></i> Carregando...</span>
                          <span v-else>
                            <multiselect v-model="ratificacao.alcada"
                                         :options="listaUsuarios"
                                         :multiple="true"
                                         :value="ds_nome_usuario"
                                         :disabled="ehVisualizacao || ehAssinatura || etapa !== 'SOLICITACAO'"
                                         :custom-label="nomeUsuario"
                                         @input="selecionandoDestinatario"
                                         placeholder="Selecione um ou mais usuários"
                                         label="ds_nome_usuario"
                                         track-by="ds_nome_usuario"
                                         :preselect-first="false"
                                         :close-on-select="false"
                                         selectLabel="Aperte ENTER para selecionar"
                                         deselectLabel="Aperte ENTER para remover"
                                         selectedLabel=""
                                         name="destinatario"
                                         id="alcada_ratificacao"
                                         v-validate="'required'">
                              <template slot-scope="props"><span class="multiselect__tag"><span>{{ props.option.ds_nome_usuario }}</span><span class="custom__remove" @click="props.remove(props.option)">❌</span></span></template>
                              <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
                            </multiselect>
                            <span v-if="errors.first('destinatario')" class="label label-danger"> {{ errors.first('destinatario') }}</span>
                          </span>
                        </div>

                        <div class="col-md-4" :title="'<h5>Dos destinatários selecionados qual a quantidade mínima de assinaturas são necessárias para o processo retornar</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'top'}">
                          <label for="qtde_assinaturas_obrigatorias" class="control-label col-md-9">Quantidade de assinaturas obrigatórias</label>
                          <div class="col-md-3">
                            <select v-model="ratificacao.qtdeAssinaturasObrigatorias" id="qtde_assinaturas_obrigatorias" class="form-control" :disabled="ehVisualizacao || ehAssinatura || etapa !== 'SOLICITACAO'">
                              <option v-for="qtde in (_.isNull(ratificacao.alcada) ? 1 : ratificacao.alcada.length)" :value="qtde">{{qtde}}</option>
                            </select>
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>



            <!-- Lista de anexos -------------------------------------------->
            <div class="box-body">
              <div class="box-header">
                <h3 class="box-title"> Anexos</h3>
              </div>

              <div class="col-md-12 form-horizontal">
                <upload-documentos-ratificacao :foiAssinada="foiAssinada" :processo_ratificacao="id" :propDocumentos="ratificacao.anexos" :documentTypes="''" :disable="ehVisualizacao || ehAssinatura" :local-uso="ratificacao.assunto.codigo"></upload-documentos-ratificacao>
              </div>
            </div>



            <!-- Histórico do processo ----------------------------------------------------------------------------------------------------------->
            <div class="box-body" v-if="!_.isNull(id)">
              <div class="box-header">
                <h3 class="box-title">Histórico</h3>
              </div>

              <div class="col-md-12">
                <div class="table-responsive">
                  <table class="table table-condensed table-bordered table-striped">
                    <thead style="text-align: center;">
                    <tr>
                      <td style="width: 140px">Data de conclusão</td>
                      <td style="width: 140px">Fase</td>
                      <td style="width: 140px">Observação</td>
                      <td style="width: 140px">Aprovação</td>
                      <td style="width: 140px">Usuário Responsável</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="tarefa in historico">
                      <td class="text-center">{{tarefa.termino | moment('DD/MM/YYYY HH:mm')}}</td>
                      <td class="text-center">{{enumeradores[tarefa.nome]}}</td>
                      <td class="text-center">{{tarefa.observacao}}</td>
                      <td class="text-center">
                        <span v-if="tarefa.nome === 'ASSINATURA_RATIFICACAO'">
                          <span v-if="_.includes(tarefa.resultado, 'Sim')"><i class="fa fa-check text-green" aria-hidden="true"></i></span>
                          <span v-else-if="_.includes(tarefa.resultado, 'Nao')"><i class="fa fa-times text-red" aria-hidden="true"></i></span>
                          <span v-else class="text-blue">
                            {{ratificacao.qtdeAssinaturasObrigatorias > _.sumBy(historico, function(h) { return h.nome === 'ASSINATURA_RATIFICACAO' && _.includes(h.resultado, 'Sim') ? 1 : 0}) ? 'Pendente' : ''}}
                          </span>
                        </span>
                      </td>
                      <td class="text-center">{{tarefa.ds_nome_usuario}}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>




      <!-- Decisões ----------------------------------------------------------------------------->
      <div class="row" id="decisoes_aprovação" v-if="ehAssinatura && usuarioPodeAssinar">
        <div class="col-md-12 form-horizontal">
          <div class="box box-primary">
            <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

            <div class="box-header with-border">
              <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Decisões</h3>
            </div>

            <div class="form-horizontal">

              <div class="box-body">
                <div class="row">
                  <div class="col-md-12">
                    <div class="form-group required">

                      <!-- Aprovação -------------------------------------------------->
                      <div class="col-md-12">
                          <div class="form-group required-field" :class="{ 'has-error' : errors.first('aprovacao')}">
                            <label class="control-label col-md-2">Aprovar solicitação?</label>
                            <div class="col-md-10">
                              <label class="radio-inline new-control new-control-radio">
                                <input type="radio" name="aprovacao" :value="'Sim'" :disabled="ehVisualizacao" v-model="ratificacao.aprovacao" v-validate="'required'"> Sim
                                <div class="new-control-indicator"></div>
                              </label>
                              <label class="radio-inline new-control new-control-radio">
                                <input type="radio" name="aprovacao" :value="'Nao'" :disabled="ehVisualizacao" v-model="ratificacao.aprovacao" v-validate="'required'"> Não
                                <div class="new-control-indicator"></div>
                              </label>
                              <span v-if="errors.first('aprovacao')" class="label label-danger"> {{ errors.first('aprovacao') }}</span>
                            </div>
                          </div>
                      </div>

                      <!-- Observação opcional da aprovação -->
                      <div class="col-md-12">
                        <div class="form-group">
                          <label for="observacao_decisao" class="control-label col-md-2">Observação:</label>
                          <div class="col-md-10">
                            <textarea name="observacao_decisao" id="observacao_decisao" v-model="ratificacao.observacao" rows="3" class="form-control" :disabled="ehVisualizacao"></textarea>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      

    </section>

  </div>

</template>

<script>
  /* eslint-disable quotes,no-unused-vars */
  import { mapGetters } from 'vuex'
  import UploadDocumentosRatificacao from '../../cadastro/ratificacoes/UploadDocumentosRatificacao'
  import moment from 'moment'

  export default {
    components: {
      UploadDocumentosRatificacao
    },
    name: 'EditaRatificacao',
    data () {
      return {
        id: null,
        loading: {
          tela: false,
          usuarios: false
        },
        etapa: 'SOLICITACAO',
        historico: null,
        ehVisualizacao: false,
        ehAssinatura: false,
        usuarioPodeAssinar: false,
        listaUsuarios: [],
        ratificacao: {
          assunto: {},
          alcada: null,
          qtdeAssinaturasObrigatorias: 1,
          requerimento: null,
          anexos: [],
          aprovacao: null,
          observacao: null
        },
        listaAssuntos: [{'value': 'RATIFICACAO_PAGAMENTO', 'name': 'Ratificação de Pagamento'}, {'value': 'RATIFICACAO_APLICACAO', 'name': 'Ratificação de Aplicação'}],
        enumeradores: {'RATIFICACAO_APLICACAO': 'Ratificação de Aplicação', 'RATIFICACAO_PAGAMENTO': 'Ratificação de Pagamento', 'FEITO': 'Feito', 'CANCELADO': 'Cancelado', 'EM_EXECUCAO': 'Em Execução', 'SOLICITACAO': 'Solicitação', 'ASSINATURA_RATIFICACAO': 'Assinatura Requisitada', 'CONCLUSAO': 'Conclusão'},
        restricaoParaConcluir: [],
        foiAssinada: false
      }
    },
    computed: {
      sortOptions () {
        // Create an options list from our fields
        return this.fields
          .table.filter(f => f.sortable)
          .map(f => { return { text: f.label, value: f.key } })
      },
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    created: function () {
      if (_.has(this.$route.params, 'visualizacao')) {
        this.ehVisualizacao = this.$route.params.visualizacao
      }
      if (_.has(this.$route.params, 'assinar')) {
        this.ehAssinatura = this.$route.params.assinar
      }
      if (_.has(this.$route.params, 'id')) {
        // Se trata de uma edição pois é passado um id
        this.id = this.$route.params.id
        this.buscaDados()
        this.carregarHistorico()
        this.ratificacaoFoiAssinada()
      }
      this.carregarListaUsuarios()
    },
    mounted: function () {
    },
    methods: {
      selecaoAssunto () {
        if (this.ratificacao.assunto === 'RATIFICACAO_PAGAMENTO') {
          this.ratificacao.requerimento = '#interna\n' +
            'Prezada Diretora,\n' +
            'Seguem anexos os documentos para Ratificação dos Pagamentos referentes ao dia ' + moment().subtract(1, 'days').format('DD/MM/YYYY') + '.\n' +
            'Solicitamos seu "De Acordo".'
          this.ratificacao.alcada = _.filter(this.listaUsuarios, function (usuario) {
            // Suporte 63007
            // return _.includes([126, 3654, 114], usuario.id) // Adicionar Pepe, Roberto e Biruel
            // return _.includes([16142, 114], usuario.id) // Sônia Freire e Rogério Biruel
            return _.includes([16429, 16936], usuario.id) // Luciana e Gilson
          })
        } else if (this.ratificacao.assunto === 'RATIFICACAO_APLICACAO') {
          this.ratificacao.requerimento = '#interna\n' +
            'Prezada Diretora,\n' +
            'Seguem anexos os documentos para Ratificação das Aplicações Financeiras referentes ao dia ' + moment().subtract(1, 'days').format('DD/MM/YYYY') + '.\n' +
            'Solicitamos seu "De Acordo".'
          this.ratificacao.alcada = _.filter(this.listaUsuarios, function (usuario) {
            // Suporte 63007
            // return _.includes([126, 3654, 114], usuario.id) // Adicionar Pepe, Roberto e Biruel
            // return _.includes([16142, 114], usuario.id) // Sônia Freire e Rogério Biruel
            return _.includes([16429, 16936], usuario.id) // Luciana e Gilson
          })
        }
      },
      carregarHistorico () {
        axiosLaravel.post('/ratificacao/historico', {'id': this.id}).then((response) => {
          console.log('dados recebidos HISTORICO', response.data)
          this.historico = response.data.retorno
          this.etapa = _.chain(_.cloneDeep(this.historico)).remove(['tipo', 'USUARIO']).sortBy('id').last().get('nome').value()
        })
          .catch((error) => {
            this.loading.tela = false
            this.$root.trataErro(error)
          })
      },
      permiteConcluir () {
        // Regras para quando se tratar de assinatura
        if (this.ehAssinatura) {
          // Restringir se não há decisão registrada
          this.adicionaRestricao({'tag': 'decisaoAusente', 'ativo': (_.isNull(this.ratificacao.aprovacao)), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Deve escolher Sim ou Não para decisão'})
        }
        this.$validator.validateAll().then(validado => {
          this.adicionaRestricao({'tag': 'camposPendentes', 'ativo': !validado, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Revise os campos: ' + (_.join(_.uniq(_.map(this.$validator.errors.items, 'field')), ', '))})
          //
          if (this.restricaoParaConcluir.length > 0 && _.filter(this.restricaoParaConcluir, {'ativo': true}).length > 0) {
            let restricoes = _.filter(this.restricaoParaConcluir, {'ativo': true, 'tipo': 'restricao'})
            if (restricoes.length > 0) {
              let mensagens = '<div class=avisoAlerta><li>' + _.join(_.map(restricoes, 'mensagem'), '<li>') + '</div>'
              this.$dialog.alert(mensagens, {html: true, animation: 'fade', customClass: 'avisoAlerta'}).then(function (dialog) {})
            }
          } else {
            this.concluir()
          }
        })
      },
      concluir () {
        this.loading.tela = true
        this.$snotify.async('Processando. Por favor, aguarde...', {timeout: 0})
        let rota = this.ehAssinatura ? '/ratificacao/assinar' : (this.etapa === 'CONCLUSAO' ? '/ratificacao/concluir' : '/ratificacao/salvar')
        axiosLaravel.post(rota, {'id': this.id, 'ratificacao': this.ratificacao}).then((response) => {
          this.aviso(response.data)
          this.voltar()
          this.loading.tela = false
        })
          .catch((error) => {
            this.loading.tela = false
            this.$root.trataErro(error)
          })
      },
      voltar () {
        if (this.ehAssinatura) {
          this.$router.push({name: 'lista-ratificacao-pendentes'})
        } else {
          this.$router.push({name: 'lista-ratificacao'})
        }
        // this.$router.go(-1)
      },
      adicionaRestricao (ev) {
        if (!_.isNil(ev) && _.has(ev, 'tag')) {
          // Se já existe, remova da lista
          _.remove(this.restricaoParaConcluir, function (i) {
            return i.tag === ev.tag
          })
          // Adiciona a restrição
          this.restricaoParaConcluir.push(ev)
        }
      },
      nomeUsuario (option) {
        return `${option.ds_nome_usuario}`
      },
      selecionandoDestinatario () {
        if (this.ratificacao.alcada.length === 0) {
          this.ratificacao.qtdeAssinaturasObrigatorias = 1
        }
      },
      carregarListaUsuarios () {
        this.loading.usuarios = true
        console.log('carregarListaUsuarios')
        axiosLaravel.get('/ratificacao/usuarios').then((response) => {
          if (response.data.codigo === 'OK') {
            this.listaUsuarios = response.data.retorno
          }
          this.aviso(response.data)
          this.loading.usuarios = false
        })
          .catch((error) => {
            this.loading.usuarios = false
            this.$root.trataErro(error)
          })
      },
      aviso (retorno) {
        this.$snotify.clear()
        if (_.has(retorno, 'codigo')) {
          if (retorno.codigo === 'ERRO') {
            let mensagem = (_.has(retorno, 'mensagem') && !_.isNull(retorno.mensagem) && !_.isEmpty(retorno.mensagem)) ? retorno.mensagem : 'Erro de processamento. Não sei o que houve'
            this.$snotify.error(mensagem)
          } else {
            if (retorno.codigo === 'OK') {
              if (_.has(retorno, 'mensagem') && !_.isNull(retorno.mensagem) && !_.isEmpty(retorno.mensagem)) {
                this.$snotify.success(retorno.mensagem, {timeout: 3000})
              }
            }
          }
        }
      },
      buscaDados () {
        this.loading.tela = true
        console.log('buscaDados')
        let pendencia = this.ehAssinatura ? 'assinatura' : 'normal' // Futuramente poderão ser adicionadas outras pendências como feedback etc
        axiosLaravel.post('/ratificacao/edita', {'id': this.id, 'pendencia': pendencia}).then((response) => {
          if (response.data.codigo === 'OK') {
            this.ratificacao = JSON.parse(response.data.retorno[0]['requisicao'])
            this.usuarioPodeAssinar = !_.isEmpty(_.find(this.ratificacao.alcada, item => item.id === this.usuarioLogado.id))
            this.$forceUpdate()
          } else {
            this.voltar()
          }
          this.aviso(response.data)
          this.loading.tela = false
        })
          .catch((error) => {
            this.loading.tela = false
            this.$root.trataErro(error)
          })
      },
      filtrar () {
        console.log('filtrar')
      },
      ratificacaoFoiAssinada () {
        if (this.etapa === 'SOLICITACAO') {
          this.foiAssinada = false
        } else {
          axiosLaravel.get(`/ratificacao/foi_assinada/${this.id}`).then((response) => {
            this.foiAssinada = !!response.data.resposta // o !! é uma forma de fazer casting pra boolean
            this.$forceUpdate()
          })
        }
      }
    }
  }
</script>

<style scoped>
</style>
