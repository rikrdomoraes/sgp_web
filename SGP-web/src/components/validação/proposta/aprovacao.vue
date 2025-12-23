<template>

  <div class="box box-primary" id="aprovacao">
    <fieldset :disabled="this.$router.currentRoute.name === 'proposta-visualiza'">
        <div class="box-header with-border">
          <h3 class="box-title">Aprovação<span v-if="aprovacao.ds_codigo_projeto_erp"> do projeto <b>{{aprovacao.ds_codigo_projeto_erp}}</b></span></h3>
        </div>

        <div class="box-body">
          <form name="cmptDocPreparationForm" class="form-horizontal" novalidate>

            <div class="row">

              <div class="col-md-6">
                <legend>Datas</legend>
                <dl class="col-md-12">
                  <!--Data da Proposta-->
                  <div class="form-group col-md-12 required-field"
                       :class="{ 'has-error' : errors.first('data proposta')}">
                    <label class="control-label">Data da Proposta</label>
                    <span class="form-control" disabled="disabled">{{propsAprovacao.dt_proposta | moment("L")}}</span>
                    <!--<div class="input-group">-->
                      <!--<datepicker name="data proposta" v-model="aprovacao.dt_proposta" input-class="form-control"-->
                                  <!--:language="$datePickerPtBR" maxlength="20" :use-utc="false" placeholder="__ /__ /____" :disabled="true"-->
                                  <!--format="dd/MM/yyyy" v-validate="'required'">-->
                      <!--</datepicker>-->
                      <!--&lt;!&ndash;<input type="text" id="data proposta" name="data proposta" v-model="dataProposta"&ndash;&gt;-->
                        <!--&lt;!&ndash;class="form-control" v-mask="'##/##/####'" :masked="masked" v-validate="'required|validdate|dateeqpast'">&ndash;&gt;-->
                    <!--</div>-->
                    <!--<span v-if="errors.first('data proposta')" class="label label-danger"> {{ errors.first('data proposta') }}</span>-->
                  </div>
                </dl>
                <dl class="col-md-12">
                  <!--Data de análise-->
                  <div class="form-group col-md-12 required-field"
                       :class="{ 'has-error' : errors.first('data análise')}">
                    <label class="control-label">Data de análise</label>
                    <span class="form-control" disabled="disabled">{{propsAprovacao.dt_analise | moment("L")}}</span>
                    <!--<div class="input-group">-->
                      <!--<datepicker name="data análise" v-model="aprovacao.dt_analise"-->
                                  <!--input-class="form-control" :language="$datePickerPtBR" :use-utc="false"-->
                                  <!--format="dd/MM/yyyy" :disabled="true"-->
                                  <!--v-validate="'required'" placeholder="__/__/____"></datepicker>-->
                      <!--&lt;!&ndash;<input type="text" id="data análise" name="data análise" v-model="analysisDate"&ndash;&gt;-->
                             <!--&lt;!&ndash;class="form-control" v-mask="'##/##/####'" :masked="masked" v-validate="'required|validdate|dateeqpast'">&ndash;&gt;-->
                    <!--</div>-->
                    <!--<span v-if="errors.first('data análise')" class="label label-danger"> {{ errors.first('data análise') }}</span>-->
                  </div>
                </dl>

                <dl class="col-md-12">
                  <!--Data de deferimento-->
                  <div class="form-group col-md-12 required-field" uib-tooltip="Data de deferimento"
                       :class="{ 'has-error' : errors.first('data deferimento')}">
                    <label class="control-label">Data de deferimento</label>
                    <span class="form-control" disabled="disabled">{{propsAprovacao.dt_deferimento | moment("L")}}</span>
                    <!--<div class="input-group">-->
                      <!--<datepicker name="data deferimento" v-model="aprovacao.dt_deferimento"-->
                                  <!--input-class="form-control" :language="$datePickerPtBR" :use-utc="false" :disabled="true"-->
                                  <!--format="dd/MM/yyyy"-->
                                  <!--v-validate="'required'" placeholder="__/__/____"></datepicker>-->
                      <!--&lt;!&ndash;<input type="text" id="data deferimento" name="data deferimento" v-model="grantDate"&ndash;&gt;-->
                             <!--&lt;!&ndash;class="form-control" v-mask="'##/##/####'" :masked="masked" v-validate="'required|validdate|dateeqpast'">&ndash;&gt;-->
                    <!--</div>-->
                    <!--<span v-if="errors.first('data deferimento')" class="label label-danger"> {{ errors.first('data deferimento') }}</span>-->
                  </div>
                </dl>

                <!--Data de assinatura do convênio-->
                <dl class="col-md-12">
                  <div class="form-group col-md-12"  >
                    <label class="control-label">Data de assinatura do convênio</label>
                    <span class="form-control" disabled="disabled">{{propsAprovacao.dt_assinatura_convenio | moment("L")}}</span>
                    <!--<div class="input-group">-->
                      <!--<datepicker name="data assinatura" v-model="aprovacao.dt_assinatura_convenio"-->
                                  <!--input-class="form-control" :language="$datePickerPtBR" :use-utc="false" :disabled="true"-->
                                  <!--format="dd/MM/yyyy"-->
                                  <!--placeholder="__/__/____"></datepicker>-->
                      <!--&lt;!&ndash;<input type="text" id="data assinatura" name="data assinatura" v-model="agreementAssignmentDate"&ndash;&gt;-->
                             <!--&lt;!&ndash;class="form-control" v-mask="'##/##/####'" v-validate="'required|validdate|dateeqpast'">&ndash;&gt;-->
                    <!--</div>-->
                    <!--<span v-if="errors.first('data assinatura')" class="label label-danger"> {{ errors.first('data assinatura') }}</span>-->
                  </div>
                </dl>

                <!-- Data de Vigência -->
                <dl class="col-md-12">
                  <div class="form-group col-md-12 required-field" :class="{ 'has-error' : errors.first('data vigência')}">
                    <label class="control-label">Data de Vigência do Projeto</label>
                    <span class="form-control" disabled="disabled">{{propsAprovacao.dt_data_vigencia | moment("L")}}</span>
                    <!--<div class="input-group">-->
                      <!--&lt;!&ndash;<datepicker name="data vigência" v-model="aprovacao.dt_data_vigencia"&ndash;&gt;-->
                                  <!--&lt;!&ndash;input-class="form-control" :language="$datePickerPtBR" :use-utc="false" :disabled="true"&ndash;&gt;-->
                                  <!--&lt;!&ndash;format="dd/MM/yyyy"&ndash;&gt;-->
                                  <!--&lt;!&ndash;placeholder="__/__/____"&ndash;&gt;-->
                                  <!--&lt;!&ndash;v-validate="'required'">&ndash;&gt;-->
                      <!--&lt;!&ndash;</datepicker>&ndash;&gt;-->
                      <!--<input type="text" id="data vigência" name="data vigência" v-model="aprovacao.dt_data_vigencia"-->
                             <!--class="form-control" v-mask="'##/##/####'" :masked="masked" :disabled="true">-->
                    <!--</div>-->
                    <!--<span v-if="errors.first('data vigência')" class="label label-danger"> {{ errors.first('data vigência') }}</span>-->
                  </div>
                </dl>

              </div>
            </div>

          <!-- Documentos da Formalização para download somente na Aprovação -->
            <div class="row">
              <div class="col-md-12">
                <legend>Documentos da Formalização</legend>
                <div class="col-md-12">
                  <upload-documentos-php-novo :propDocumentos="this.propsAprovacao.documentos.formalizacao" :documentTypes="tiposDocumentos" :documentosObrigatorios="''" :local-uso="'TODOS'" :faseProposta="propsAprovacao.ds_fase"></upload-documentos-php-novo>
                </div>
              </div>
            </div>


          <!-- Ficha de autoverificação -->
            <div class="row">
              <div class="col-md-12">
                <legend>&nbsp;Ficha de Auto Verificação</legend>
                <div v-for="item in perguntasFAV">
                  <label v-if="item.nivel === 3" class="control-label col-md-10" :class="'favNivel' + item.nivel">{{item.numero}} {{item.pergunta}}</label>
                  <span v-if="item.nivel !== 3" class="control-label col-md-10" :class="'favNivel' + item.nivel">{{item.pergunta}}</span>
                  <div class="col-md-1" style="alignment: left" :title="'<h5>Pergunta <span class=\'realce\'>' + item.numero + '</span></h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                    <select v-model="item.resposta" class="form-control respostaFav" v-if="item.nivel === 3" disabled="disabled">
                      <option v-for="opcao in respostaFAV" :value="opcao.valor">{{opcao.resposta}}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>


          <!--Decisões da APROVAÇÃO do projeto-->
            <div class="row">
              <div class="col-md-12">
                <legend>Decisões</legend>
                <div class="form-group col-md-12 required-field" uib-tooltip="Decisões da preparação de documentos"
                     :class="{ 'has-error' : errors.first('aprovacao')}">
                  <div class="col-md-12">
                    <label class="new-control new-control-radio" style="padding-top: 8px;">
                      <input type="radio" name="aprovacao" value="APROVAR" @change="verificaDecisao"
                             v-model="propsAprovacao.resultadoAprovacao"
                             v-validate="'required'"/>
                      Aprovar o Projeto (APR)
                      <div class="new-control-indicator"></div>
                    </label>
                  </div>

                  <div class="col-md-12">
                    <label class="new-control new-control-radio" style="padding-top: 8px;">
                      <input type="radio" name="aprovacao" value="VOLTAR_ANALISE" @change="verificaDecisao"
                             v-model="propsAprovacao.resultadoAprovacao" id="msgDef"
                      />
                      Devolver para Reanálise
                      <div class="new-control-indicator"></div>
                    </label>
                  </div>

                  <div class="col-md-12">
                    <label class="new-control new-control-radio" style="padding-top: 8px;">
                      <input type="radio" name="aprovacao" value="VOLTAR_FORMALIZACAO" @change="verificaDecisao"
                             v-model="propsAprovacao.resultadoAprovacao" id="formalizacao"
                      />
                      Devolver para Formalização
                      <div class="new-control-indicator"></div>
                    </label>
                  </div>

                  <div class="col-md-12">
                    <label class="new-control new-control-radio" style="padding-top: 8px;">
                      <input type="radio" name="aprovacao" value="CANCELAR_PROJETO" @change="verificaDecisao"
                             v-model="propsAprovacao.resultadoAprovacao" id="cancelar"
                      />
                      Cancelar o Projeto (CAN)
                      <div class="new-control-indicator"></div>
                    </label>
                  </div>
                  <span v-if="errors.first('aprovacao')" class="label label-danger"> {{ errors.first('aprovacao') }}</span>
                </div>

                <!-- justificativa -->
                <div class="col-md-12">
                  <div v-if="propsAprovacao.resultadoAprovacao === 'VOLTAR_FORMALIZACAO'" class="form-group full col-md-12 required-field"
                       :class="{ 'has-error' : errors.first('justificativa')}">
                    <label class="control-label">Justificativa</label>
                    <textarea v-model="propsAprovacao.observacao"
                              name="justificativa"
                              class="form-control" v-validate="'required'">
                          </textarea>
                    <span v-if="errors.first('justificativa')" class="label label-danger"> {{ errors.first('justificativa') }}</span>
                  </div>

                  <!-- documentos obrigatorios para devolver ou cancelar o projeto -->
                  <div v-if="propsAprovacao.resultadoAprovacao === 'VOLTAR_ANALISE' || propsAprovacao.resultadoAprovacao === 'CANCELAR_PROJETO'" class="form-group col-md-12 required-field"
                       :class="{ 'has-error' : errors.first('anexo')}">
                    <label class="control-label">Anexo obrigatório</label>
                    <upload-documentos-php-novo :propDocumentos="aprovacaoDocumentos" :documentTypes="''" :documentosObrigatorios="''" :local-uso="'APROVACAO_PROJETO_RESTRICAO'"></upload-documentos-php-novo>
                    <span v-if="errors.first('anexo')" class="label label-danger"> {{ errors.first('anexo') }}</span>
                  </div>
                </div>

              </div>
            </div>

          </form>
        </div>
      </fieldset>
  </div>

</template>

<script>
  import Fav from '../../modules/fav'
  import UploadDocumentosPhpNovo from '../../modules/uploadDocumentosPhpNovo'
  import moment from 'moment'
  import Analise from '../../validação/proposta/analise'

  export default {
    name: 'aprovacao',
    components: {
      UploadDocumentosPhpNovo,
      Analise,
      Fav},
    data () {
      return {
        customTokens: {
          '#': {pattern: /\d/},
          'X': { pattern: /[0-9x-xX-X]/, transform: v => v.toUpperCase() }
        },
        requiredFormalizationDocumentsType: [],
        documentosObrigatorios: ['Minuta', 'Plano de Trabalho'],
        aprovacaoDocumentos: [],
        aguardaEnviar: 0,
        tiposDocumentos: [],
        dataProposta: null,
        // confirmado: 'Não confirmado',
        dt_analise: null,
        confirmou: false,
        grantDate: null,
        dt_assinatura_convenio: null,
        dt_data_vigencia: null,
        aprovacao: {
          documentos: {
            aprovacao: []
          }
        },
        perguntasFAV: [
          {'nivel': 1, 'numero': '1', 'pergunta': 'DEFERIMENTO', 'resposta': null},
          {'nivel': 2, 'numero': '', 'pergunta': 'Pré-Comitê', 'resposta': null},
          {'nivel': 3, 'numero': '1.1', 'pergunta': 'Em projetos de valor igual ou acima de R$ 3,8 milhões foi aplicado, pela COI, previamente à deliberação da instância decisória competente, o Teste de Verificação de Conformidade?', 'resposta': null},
          {'nivel': 2, 'numero': '', 'pergunta': 'Pós-Comitê', 'resposta': null},
          {'nivel': 3, 'numero': '1.2', 'pergunta': 'O despacho contém todas as assinaturas e carimbos dos componentes da instância decisória competente?', 'resposta': null},
          {'nivel': 3, 'numero': '1.3', 'pergunta': 'O despacho está datado?', 'resposta': null},
          {'nivel': 1, 'numero': '2', 'pergunta': 'PRÉ-FORMALIZAÇÃO', 'resposta': null},
          {'nivel': 2, 'numero': '', 'pergunta': 'Procedimentos Gerais', 'resposta': null},
          {'nivel': 3, 'numero': '2.1', 'pergunta': 'Foram cumpridas as condicionantes estabelecidas na análise e no deferimento?', 'resposta': null},
          {'nivel': 3, 'numero': '2.2', 'pergunta': 'Existe consulta ao CADIN - Cadastro Informatizado de Créditos não Quitados do Setor Público Federal, sem registro de ocorrências?', 'resposta': null},
          {'nivel': 3, 'numero': '2.3', 'pergunta': 'Existe consulta ao CEPIM - Cadastro de Entidades Privadas sem fins Lucrativos Impeditivas para a entidade, sem registro de ocorrências?', 'resposta': null},
          {'nivel': 3, 'numero': '2.4', 'pergunta': 'Foi verificado se existe(m) ocorrência(s) impeditiva(s) da entidade proponente e de seu(s) representante(s) legal(is) no sistema informatizado da Fundação? (Relatório 268 Sapiens)', 'resposta': null},
          {'nivel': 3, 'numero': '2.5', 'pergunta': 'Existe Certidão Negativa de Débitos Relativos a Tributos Federais e à Dívida Ativa da União ou Certidão Conjunta Positiva com Efeitos de Negativa?', 'resposta': null},
          {'nivel': 3, 'numero': '2.6', 'pergunta': 'Na minuta de convênio foram foram incluídas as cláusulas específicas do programa estruturado e de adiantamento de recursos, se for o caso?', 'resposta': null},
          {'nivel': 3, 'numero': '2.7', 'pergunta': 'Foi indicada, na minuta de convênio, a periodicidade de apresentação dos relatórios parciais conforme definido no deferimento?', 'resposta': null},
          {'nivel': 3, 'numero': '2.8', 'pergunta': 'Foi indicada, na minuta de convênio, o prazo de execução do projeto conforme definido no deferimento?', 'resposta': null},
          {'nivel': 3, 'numero': '2.9', 'pergunta': 'A minuta de convênio observou as recomendações do parecer jurídico?', 'resposta': null},
          {'nivel': 3, 'numero': '2.10', 'pergunta': 'Os signatários estão qualificados corretamente?', 'resposta': null},
          {'nivel': 3, 'numero': '2.11', 'pergunta': 'Foi encaminhada correspondência à agência condutora, com cópia para a entidade e eventuais intervenientes, contendo documentos e orientações para a formalização?', 'resposta': null},
          {'nivel': 3, 'numero': '2.12', 'pergunta': 'O instrumento jurídico está datado, assinado e rubricado pelas partes em todas as páginas, bem como contém a assinatura e identificação de testemunhas e o número da conta específica do projeto?', 'resposta': null},
          {'nivel': 3, 'numero': '2.13', 'pergunta': 'Foram registrados a data de assinatura, datas de início e fim de execução, número da conta corrente específica e o códido MCI da instituição no sistema informatizado?', 'resposta': null},
          {'nivel': 3, 'numero': '2.14', 'pergunta': 'Foi providenciada a publicação do instrumento jurídico na imprensa oficial?', 'resposta': null},
          {'nivel': 3, 'numero': '2.15', 'pergunta': 'A documentação do projeto está devidamente arquivada, com as páginas numeradas e rubricadas?', 'resposta': null},
          {'nivel': 2, 'numero': '', 'pergunta': 'Em caso de Parcerias Estratégicas', 'resposta': null},
          {'nivel': 3, 'numero': '2.16', 'pergunta': 'Foram realizados os procedimentos para verificação de internalização de recursos de parcerias estratégias, se necessário?', 'resposta': null},
          {'nivel': 3, 'numero': '2.17', 'pergunta': 'Foi verificada a situação de regularidade da entidade em instâncias específicas (FGTS, CNDT, Serasa, SPC, etc), se necessário?', 'resposta': null}
        ],
        //
        respostaFAV: [{resposta: 'Sim', valor: 1}, {resposta: 'Não', valor: 0}, {resposta: 'N/A', valor: 2}]
      }
    },
    props: ['propsAprovacao'],
    inject: ['$validator'],
    provide () {
      return {
        $validator: this.$validator
      }
    },
    watch: {
      propsAprovacao () {
        this.aprovacao = this.propsAprovacao
        if (this.propsAprovacao.perguntasFAV) {
          this.perguntasFAV = this.propsAprovacao.perguntasFAV
        }
        if (this.aprovacao.documentos) {
          if (this.aprovacao.documentos.aprovacao.length <= 0) {
            this.aprovacao.documentos.aprovacao = []
          } else {
            this.aprovacaoDocumentos = this.aprovacao.documentos.aprovacao
          }
        }
        // Ajusta as datas
        // this.grantDate = moment(this.aprovacao.grantDate, moment.defaultFormat).toDate()
        // this.dt_proposta = moment(this.aprovacao.dt_proposta, moment.defaultFormat).toDate()
        // this.dt_analise = moment(this.aprovacao.dt_analise, moment.defaultFormat).toDate()
        // this.dt_assinatura_convenio = moment(this.aprovacao.dt_assinatura_convenio, moment.defaultFormat).toDate()
        // linha comentada por erro de gravação de data
        // this.propsAprovacao.dt_data_vigencia = moment(this.propsAprovacao.dt_data_vigencia).format('YYYY-MM-DD HH:mm:ss')
        // Ajuste do format relacionado com  propostaController.php ['nomCmp' => 'USU_DATFIMVIG', 'valCmp' => Carbon::create($request->dt_data_vigencia)->format('d/m/Y')]);
        this.propsAprovacao.dt_data_vigencia = moment(this.propsAprovacao.dt_data_vigencia).format('YYYY-MM-DD')
        this.$emit('aprovacaoProposta', this.aprovacao)
        this.$forceUpdate()
      },
      aprovacaoDocumentos () {
        if (this.aprovacaoDocumentos) {
          this.aprovacao.documentos.aprovacao = this.aprovacaoDocumentos
        }
      }
    },
    computed: {
    },
    created () {
      this.buscaArquivosEsperados()
    },
    mounted () {
      if (this.propsAprovacao.perguntasFAV) {
        this.perguntasFAV = this.propsAprovacao.perguntasFAV
      }
    },
    methods: {
      buscaArquivosEsperados () {
        axiosLaravel.get('configuracoes/').then((response) => {
          this.tiposDocumentos.push(response.data.configuracao_proposta.minuta)
          this.tiposDocumentos.push(response.data.configuracao_proposta.plano_trabalho)
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      // confirmaOutraOpcao () {
      //   this.confirmado = 'Não confirmado'
      //   this.confirmou = false
      //   this.$forceUpdate()
      // },
      verificaDecisao () {
        let mensagem = ''
        let ativo = false
        if (this.propsAprovacao.resultadoAprovacao === 'VOLTAR_ANALISE') {
          mensagem = 'Devolver a proposta para ser reanalisada'
        }
        if (this.propsAprovacao.resultadoAprovacao === 'CANCELAR_PROJETO') {
          mensagem = 'Cancelar esse projeto'
          ativo = true
        }
        this.$emit('validacaoAprovacao', {'tag': 'aprovacaoProjeto', 'ativo': ativo, 'tipo': 'confirmacao', 'acao': null, 'mensagem': 'Você confirma que deseja <b>' + mensagem + '</b>'})
      },
      ajustaDatas () {
        this.aprovacao.dataProposta = moment(this.dataProposta, 'DD/MM/YYYY', true).format('YYYY-MM-DD')
        this.aprovacao.dt_analise = moment(this.dt_analise, 'DD/MM/YYYY', true).format('YYYY-MM-DD')
        this.aprovacao.grantDate = moment(this.grantDate, 'DD/MM/YYYY', true).format('YYYY-MM-DD')
        this.aprovacao.dt_assinatura_convenio = moment(this.dt_assinatura_convenio, 'DD/MM/YYYY', true).format('YYYY-MM-DD')
        this.aprovacao.dt_data_vigencia = moment(this.dt_data_vigencia, 'DD/MM/YYYY', true).format('YYYY-MM-DD')
        this.aprovacao.dataProposta = moment(this.dataProposta, 'DD/MM/YYYY', true).format('YYYY-MM-DD')
        this.aprovacao.analysisDate = moment(this.analysisDate, 'DD/MM/YYYY', true).toISOString()
        this.aprovacao.grantDate = moment(this.grantDate, 'DD/MM/YYYY', true).format('YYYY-MM-DD')
        this.aprovacao.agreementAssignmentDate = moment(this.agreementAssignmentDate, 'DD/MM/YYYY', true).format('YYYY-MM-DD')
        this.$forceUpdate()
      },
      // onSave () {
      //   // this.ajustaDatas()
      //  // this.analise.approval.proposal = this.analise.proposal
      //   this.$snotify.info('Atualizando Validação', {timeout: 0})
      //   axios.post('proxy/project/document-preparation/', this.analise).then((response) => {
      //     console.log(response)
      //     this.$snotify.clear()
      //     this.$snotify.success('Validação salva com sucesso')
      //   })
      //     .catch((error) => {
      //       this.$snotify.clear()
      //
      //       this.$root.trataErro(error)
      //     })
      // },
      // onConclude () {
      //   // this.ajustaDatas()
      //   this.$validator.validateAll().then((result) => {
      //     if (!result) {
      //       this.$snotify.error('Formulario possui erros favor verificar')
      //     } else {
      //       this.enviaBackEnd()
      //     }
      //   })
      // },
      // enviaBackEnd () {
      //   this.aguardaEnviar = 1
      //   this.$snotify.async('Validando proposta. Por favor, aguarde...', {timeout: 0})
      //   axios.put('proxy/project/document-preparation/' + this.approval.id, this.approval).then((response) => {
      //     this.$snotify.clear()
      //     this.$snotify.success('Formalização concluída com sucesso')
      //     setTimeout(() => { this.$router.go(-1) }, 2000)
      //   })
      //     .catch((error) => {
      //       this.aguardaEnviar = 0
      //       this.$snotify.clear()
      //       this.$root.trataErro(error)
      //     })
      // },
      onReturn () {
        this.$router.go(-1)
      }
      // preparaArquivos () {
      //   this.aprovacao.documentDraft = []
      //   if (this.aprovacao.proposal.documentDraft) {
      //     this.aprovacao.documentDraft.push(this.analise.proposal.documentDraft)
      //   }
      //   if (this.aprovacao.proposal.documentWorkPlan) {
      //     this.aprovacao.documentDraft.push(this.analise.proposal.documentWorkPlan)
      //   }
      // }
    }
  }
</script>

<style>
  .favNivel1, .favNivel2, .favNivel3 {
    text-align: left !important;
  }
  .favNivel1 {
    margin-left: 0px;
  }
  .favNivel2 {
    margin-left: 10px;
  }
  .favNivel3 {
    margin-left: 20px;
  }
  .respostaFav {
    min-width: 76px !important;
  }
  a {
    cursor: pointer !important;
  }
</style>
