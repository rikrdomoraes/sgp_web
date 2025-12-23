<template>
    <div class="content-wrapper" style="min-height: 870px;">
        <div class="fade-transition ng-scope" style=""><!-- content header (page header) -->
        <section class="content-header ng-scope">
          <h1>Liberação</h1>
          <b-breadcrumb :items="[{
          text: 'Inicial',
          href: '/'
          }, {
          text: 'Cadastro',
          href: '#'
          }, {
          text: 'Liberação Proposta',
          active: true
          }]"/>
        </section>

        <!-- main content -->
        <section class="content ng-scope">
          <div class="row">
            <div class="col-md-12">
             <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
              <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Liberação da Proposta</h3>
              </div>
              <div class="box-body" >
                <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                  <i class="fa fa-refresh fa-spin"></i>
                </div>

                <div v-if="(!_.isEmpty(this.restricoesAtivasEntidade) || !_.isEmpty(this.restricoesAtivasProjetosDaEntidade))" class="alert alert-warning alert-dismissible" style="margin:10px">
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
                <h4><i class="fa fa-warning"></i> Alerta!</h4>
                <p><strong>A Entidade possui restrições que impedem a liberação da proposta.</strong></p>
                <p v-for="restricaoEntidade in this.restricoesAtivasEntidade">
                  {{ restricaoEntidade.codoco }} - {{  restricaoEntidade.desroc }}
                </p>
                <p v-for="restricaoProjeto in this.restricoesAtivasProjetosDaEntidade">
                  {{ restricaoProjeto.codoco }} - {{  restricaoProjeto.desroc }}
                </p>
              </div>

                <form name="frmProposalReleaseRegister" class="form-horizontal col-md-12" novalidate>
                  <div class="row">
                    <fieldset>
                      <br>
                      <div class="col-md-6">
                        <dl class="">
                          <dt>Entidade</dt>
                          <dd class="ng-binding"><font style="color: dimgrey"> Nome: {{preProposta.entidade.ds_nome}}</font></dd>
                          <dd class="ng-binding"><font style="color: dimgrey">&nbsp&nbspCNPJ: {{preProposta.entidade.ds_cnpj | cnpj}}</font></dd>
                          <!---->
                        </dl>
                      </div>
                    </fieldset>
                    <div class="col-md-12">
                      <div class="col-md-6">

                        <!--Título da proposta:-->
                        <div class="form-group required-field">
                          <div class="form-group col-md-12" uib-tooltip="Título da proposta"
                               :class="{ 'has-error' : errors.first('titulo da proposta')}">
                            <label for="titulo da proposta" class="control-label"> Título da proposta: </label>
                            <input v-model="preProposta.ds_nome" name="titulo da proposta" data-vv-as="Título da proposta"  maxlength="150" id="titulo da proposta" class="form-control" type="text" @keypress="retiraAspas"
                                   v-validate="'required|max:150'">

                            <span v-if="errors.first('titulo da proposta')" class="label label-danger"> {{ errors.first('titulo da proposta') }}</span>
                          </div>
                        </div>

                        <!--Documentos anexos obrigatórios-->
                        <div class="form-group required-field">
                          <div class="form-group col-md-12" :class="{ 'has-error' : errors.first('documentos')}">
                            <label class="control-label"> Documentos anexos obrigatórios: </label>
                            <br />
                            <multiselect v-model="preProposta.tipo_documentos" :options="tipoDocumentos"
                                         :multiple="true" :close-on-select="false"
                                         :clear-on-select="true" :hide-selected="false"
                                         :preserve-search="true"
                                         placeholder="Selecione um documento"
                                         label="ds_tipo" track-by="ds_tipo"
                                         :preselect-first="true"
                                         selectLabel="Aperte ENTER para selecionar"
                                         deselectLabel="Aperte ENTER para remover"
                                         selectedLabel="Selecionado"
                                         name="documentos"
                                         data-vv-as="Documentos anexos obrigatórios"
                                         v-validate="'required'">
                              <template slot-scope="props"><span class="multiselect__tag"><span>{{ props.option.type }}</span><span class="custom__remove" @click="props.remove(props.option)">❌</span></span></template>
                              <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
                            </multiselect>
                          </div>
                          <span v-if="errors.first('documentos')" class="label label-danger"> {{ errors.first('documentos') }}</span>
                        </div>
                        <div v-if="preProposta.dc_investimento <= 300000">
                          <label class="control-label"> Ref. Processo Simplificado: </label>
                          <input type="checkbox" v-model="preProposta.simplificado">
                        </div>
                      </div>

                      <!--Investimento previsto-->
                      <div class="col-md-6">
                        <div class="form-group required-field">
                          <div  class="form-group col-md-12" uib-tooltip="Investimento previsto"
                                :class="{ 'has-error' : errors.first('investimento previsto')}">
                            <label for="investimento previsto" class="control-label"> Investimento previsto: </label>
                            <money v-model="preProposta.dc_investimento" name="investimento previsto" id="investimento previsto" class="form-control text-right" data-vv-as="Investimento previsto" maxlength="20" type="text"
                                     v-validate="'required|max:20|between:0.01,9999999999999'"></money>
                            <span v-if="errors.first('investimento previsto')" class="label label-danger"> {{ 'o campo Investimento Previsto está com valor zerado ou incorreto.' }}</span>
                          </div>
                        </div>

                        <div class="form-group required-field">
                          <div class="form-group col-md-12" uib-tooltip="Mensagem a ser encaminhada para as entidades"
                               :class="{ 'has-error' : errors.first('mensagem')}">
                            <label for="mensagem" class="control-label"> Mensagem a ser encaminhada para as entidades: </label>
                            <textarea v-model="preProposta.ds_mensagem_entidades" data-vv-as="Mensagem a ser encaminhada" name="mensagem" id="mensagem" class="form-control" rows="10"
                                      v-validate="'required'"></textarea>
                            <span v-if="errors.first('mensagem')" class="label label-danger"> {{ errors.first('mensagem') }}</span>
                          </div>
                        </div>
                    </div>
                    </div>
                  </div>
                </form>
                <!-- buttons -->
                
                <div class="col-md-12">
                  <g-button-moema color="success" size="button--size-ss" @click.native="concluir" v-if="(_.isEmpty(this.restricoesAtivasEntidade) && _.isEmpty(this.restricoesAtivasProjetosDaEntidade))"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</g-button-moema>
                  <g-button-moema color="warning" size="button--size-ss" @click.native="$router.go(-1)"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</g-button-moema>
                </div>

              </div>
              
            </div>
            
            </div>
            </div>
          </div>
        </section>
      </div>
      </div>

</template>

<script>
    import UploadDocumentosPhpNovo from '../modules/uploadDocumentosPhpNovo'
    import ArvoreProjeto from '../modules/arvoreProjeto'
    import { mapGetters } from 'vuex'
    export default {
      components: {
        ArvoreProjeto,
        UploadDocumentosPhpNovo},
      computed: {
        ...mapGetters([
          'usuarioLogado'
        ])},
      watch: {
        'preProposta.dc_investimento' () {
          if (this.preProposta.dc_investimento > 300000) {
            this.preProposta.simplificado = false
          }
        }
      },
      name: 'liberacao',
      data () {
        return {
          preProposta: {
            tipo_documentos: [],
            entidade: {
              ds_nome: '',
              ds_cnpj: ''
            },
            documentos: [],
            ds_mensagem_entidades: '',
            simplificado: false,
            usuario: ''
          },
          loading: {
            show: false
          },
          erro: false,
          tipoDocumentos: [],
          projetoDuplicacao: {},
          restricoesAtivasEntidade: null,
          restricoesAtivasProjetosDaEntidade: null
        }
      },
      created () {
        this.loading.show = true
        axiosLaravel.get('entidades/' + this.$route.params.id).then((response) => {
          this.preProposta.entidade = response.data
          this.$forceUpdate()
          this.loading.show = false
          this.verificaSeExisteRestricoesAtivas()
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.show = false
          })
        this.preProposta.ds_mensagem_entidades = 'Caro(a) parceiro(a),\n' +
          'Comunicamos que, a partir deste momento, está autorizado o registro da proposta de projeto no Sistema de Gerenciamento de Projetos – SGP da Fundação BB.\n' +
          'Lembrando que o acesso ao SGP é realizado por meio de login e senha e o registro da proposta somente é possível ser realizado por usuários previamente cadastrados (exceto o usuário vinculado ao CNPJ da instituição). \n' +
          '\n' +
          'O registro dos dados da proposta deverá estar consonante com o acordado com a Fundação BB durante a fase de articulação do projeto.\n' +
          'Deverão ser anexados no SGP:\n' +
          '•\t02 orçamentos de fornecedores distintos para cada item de despesa, inclusive das relativas à contrapartida. Os orçamentos deverão conter data da emissão, nome ou razão social, CPF ou CNPJ, endereço, telefone. Poderá ser aceito orçamento da internet, desde que os produtos não estejam em promoção e o documento apresente dados do site e data da consulta. \n' +
          '•\tNo caso de previsão de consultoria: anexar plano de trabalho, perfil do profissional e entregas previstas para o serviço a ser realizado. \n' +
          '•\tNo caso de previsão de obra civil: documento do terreno comprovando sua disponibilidade para a instituição proponente, planta baixa e memorial descritivo (assinados pelo profissional responsável pelo projeto de obra).\n' +
          '•\tNo caso de bens fixos de uso industrial: documento do terreno comprovando sua disponibilidade para a instituição proponente e declaração de que a estrutura é apropriada para a execução do projeto e instalação dos bens.\n' +
          '•\tDeclaração conforme modelo disponível no menu Manuais e Modelos do SGP.\n' +
          'Estamos à disposição para esclarecimentos durante o preenchimento da proposta.\n\n' +
          'Atenciosamente,\n' +
          'Fundação Banco do Brasil\n' +
          'Gerência de Análise e Avaliação\n'
        this.preProposta.usuario = this.usuarioLogado.ds_login + ' ' + this.usuarioLogado.ds_nome_usuario
        if (this.localUso === undefined) {
          this.localUso = 'TODOS'
        }
        axiosLaravel.post('documentos/tipos/' + this.localUso).then((response) => {
          this.tipoDocumentos = response.data
          this.buscaArquivosEsperados()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      methods: {
        buscaArquivosEsperados () {
          axiosLaravel.get('configuracoes/').then((response) => {
            this.preProposta.tipo_documentos = response.data.configuracao_proposta.documentos_obrigatorios
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        },
        atualizaProjetoDuplicacao (projeto) {
          this.preProposta.nr_projeto_duplicacao = projeto.numprj
          this.preProposta.ds_projeto_duplicacao_descricao = projeto.nomprj
          this.$forceUpdate()
        },
        concluir () {
          this.preProposta.ds_fase = 'CADASTRO'
          this.$validator.validateAll().then((result) => {
            if (result) {
              this.$snotify.async('Efetuando a liberação da proposta. Por favor, aguarde...', {timeout: 0})
              axiosLaravel.post('/propostas/liberacao/', this.preProposta).then((response) => {
                this.$snotify.clear()
                this.$snotify.success('Liberação da proposta efetuada com sucesso!')
                setTimeout(() => { this.$router.go(-1) }, 2000)
              })
                .catch((error) => {
                  if (error) {
                    this.$snotify.clear()
                    this.$root.trataErro(error)
                  }
                })
            }
          })
        },
        retiraAspas ($event) {
          let keyCode = ($event.keyCode ? $event.keyCode : $event.which)
          if (keyCode === 39 || keyCode === 34) {
            $event.preventDefault()
          }
        },
        verificaSeExisteRestricoesAtivas () {
          // Suporte 71699
          if (this.preProposta.entidade.id === 1439) {
            return false
          }
          axiosLaravel.post('consulta/ocorrencias/entidade/', { 'id_entidade': this.preProposta.entidade.id, 'tipo': 4, 'situacao_ocorrencia': 'vigentes' }).then((response) => {
            this.restricoesAtivasEntidade = response.data
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
          axiosLaravel.post('consulta/ocorrencias/projeto/', { 'id_entidade': this.preProposta.entidade.id, 'tipo': 3, 'situacao_ocorrencia': 'vigentes' }).then((response) => {
            this.restricoesAtivasProjetosDaEntidade = response.data
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        }
      }
    }
</script>

<style scoped>

  /* Large checkboxes */
  .myinput.large {
    height: 18px;
    width: 18px;
    vertical-align: -4px;
    box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
    cursor: pointer;
  }

  .myinput.large[type="checkbox"]:before {
    width: 20px;
    height: 20px;
    vertical-align: -4px;
  }

  .myinput.large[type="checkbox"]:after {
    top: -20px;
    width: 16px;
    height: 16px;
    vertical-align: -4px;
  }

</style>
