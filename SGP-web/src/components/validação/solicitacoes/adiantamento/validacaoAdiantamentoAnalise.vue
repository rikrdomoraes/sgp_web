<template>
  <div>
    <div class="content-wrapper " style="min-height: 870px;">

      <div class="fade-transition ng-scope " style=""><!-- content header (page header) -->
        <section class="content-header ng-scope">
          <h1>Análise &nbsp;&nbsp;
            <span v-show="!loading" v-if="usuarioLogado.userType === 'FUNDACAO'">
              <g-button-ujarak color="primary" size="button--size-ss" @click.native="emitir(199)" href="javascript:void(0)"
                               :title="'<h5>199 - Comunicado Interno</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
                <i class="fa fa-print" aria-hidden="true"></i> 199
              </g-button-ujarak>

              <g-button-ujarak color="primary" size="button--size-ss" @click.native="emitir(219)" href="javascript:void(0)"
                               :title="'<h5>219 - Adiantamentos (PDF)</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
                <i class="fa fa-print" aria-hidden="true"></i> 219
              </g-button-ujarak>

              <g-button-ujarak color="primary" size="button--size-ss" @click.native="emitir(222)" href="javascript:void(0)"
                               :title="'<h5>222 - Extrato de Projeto (PDF)</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
                <i class="fa fa-print" aria-hidden="true"></i> 222
              </g-button-ujarak>

              <g-button-ujarak color="primary" size="button--size-ss" @click.native="emitir(248)" href="javascript:void(0)"
                               :title="'<h5>248 - Monitoramento Administrativo</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
                <i class="fa fa-print" aria-hidden="true"></i> 248
              </g-button-ujarak>
             <g-button-ujarak color="primary" size="button--size-ss" @click.native="onDownloadZIP()"
                              :title="'<h5>Faz o download de todos os arquivos da solicitação (zip)</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}"
                              v-if="usuarioLogado.userType !== 'ENTIDADE' && etapa !== 'Solicitação'">
                            <i class="fa fa-download" aria-hidden="true">&nbsp;Baixar arquivos</i>
          </g-button-ujarak>
          </span>
            <i v-show="loading" class="fa fa-refresh fa-spin" style="font-size: 30px"></i>
          </h1>

          <b-breadcrumb :items="[{
                text: 'Inicial',
                href: '/'
                }, {
                text: 'Validação',
                href: '#'
                }, {
                text: 'Adiantamento',
                active: true
                }]"/>
        </section>
        <!-- main content -->
        <section class="content ng-scope">

          <!--lista notas-->
          <form @submit.prevent="concluir">

          <div class="row">
            <div class="col-md-12 form-horizontal">
              <div class="ng-scope ng-isolate-scope">
                <span v-if="!_.isEmpty(chamado) && usuarioLogado.userType === 'FUNDACAO'" style="color: red; font-size: medium">* Atenção: O processo que será analisado possui chamado vinculado - <b>
                  <span v-for="(c, index) in chamado">
                    <router-link target="_blank" :to="{name: 'cadastro-chamado-edita',  params: { id: c.id}}"> {{c.id}} <span v-if="chamado.length > 1 && index === 0">, &nbsp;</span></router-link>
                </span>
              </b><br><br></span>
                <!--<span v-if="chamado && chamado.id" style="color: red; font-size: medium">* Atenção: O processo que será analisado possui chamado aberto - <b><router-link target="_blank" :to="{name: 'cadastro-chamado-edita',  params: { id: chamado.id}}"> {{chamado.id}}</router-link></b><br><br></span>-->

                <div v-if="(historicoTarefasTela.length > 0 && historicoTarefasTela[1].observacao != null && historicoTarefasTela[1].observacao !== '')" class="alert alert-dismissible alert-info">
                  <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
                  <h4><i class="fa fa fa-info"></i>&nbsp&nbsp Atenção!</h4>
                  <h5><span v-html=historicoTarefasTela[1].observacao></span></h5>
                </div>

                <div class="box box-primary">
                  <div class="box-header with-border">
                    <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Validação de Adiantamento - <i><font color="black" size="3">ID: {{form.id}} - Projeto: </font><font color="black" size="3">{{proposta.ds_codigo_projeto_erp}} - {{proposta.ds_nome}}</font></i></h3>
                  </div>
                  <div class="box-body">
                  <!--Dados do projeto inicio-->
                    <div class="box-header with-border">
                      <div class="row" ng-if="$ctrl.approvalState != 'DEFAULT'">
                        <div class="col-sm-12" >
                          <form name="frmSearch" class="form-horizontal" novalidate>
                            <div class="form-group required" >
                              <div class="col-md-12">
                                <dl class="proposal-definition-list">
                                  <dt>Objetivo Geral: </dt>
                                  <dd>{{proposta.ds_objetivo_geral}}</dd>
                                  <dt>Situação:</dt>
                                  <dd><span>Em Execução</span></dd>
                                </dl>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                    <!--Loading da tela-->
                    <div v-show="loadingShow" class="overlay"
                         style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                      <i class="fa fa-refresh fa-spin"></i>
                    </div>
                    <!--Campos do formulário para solicitação de adiantamento-->
                    <fieldset>
                      <cronograma-solicitacao-adiantamento-validacao v-if="form.documentos_liberacao.length" :props-fase="form.tarefas[0].nome" :props-enable="form.tarefas[0].nome === 'Análise' || form.tarefas[0].nome === 'Revisão'" :props-itens="form.documentos_liberacao[0].itens_liberados" @parcelaAdicionada="form.documentos_liberacao[0].itens_liberados = $event"></cronograma-solicitacao-adiantamento-validacao>
                      <!--Dados Bancários-->
                      <div class="col-md-12" v-if="!_.isEmpty(form.documentos_liberacao[0].dados_bancarios)">
                        <div class="box-header with-border">
                          <h3 class="box-title">Dados Bancários</h3>
                        </div>
                        <div class="col-md-6">
                          <div>
                            <div class="form-group required-field" :class="{'has-error': errors.first('banco')}">
                              <label class="control-label col-md-4">Banco:</label>
                              <div class="col-md-8">
                                <lista-bancos :propsBanco="form.documentos_liberacao[0].dados_bancarios.banco" v-bind:banco.sync="form.documentos_liberacao[0].dados_bancarios.banco"
                                              :disabled="usuarioLogado.userType !== 'FUNDACAO'"></lista-bancos>
                                <!-- alterado :disabled="usuarioLogado.userType === 'FUNDACAO' para :disabled="usuarioLogado.userType !== 'FUNDACAO' - suporte 63187-->
                              </div>
                            </div>
                            <!-- Agência -->
                            <div class="form-group required-field" :class="{'has-error': errors.first('agência')}">
                              <label class="control-label col-md-4">Agência:</label>
                              <div class="col-md-8">
                                <div :title="'<h5> ' + (_.has(form.documentos_liberacao[0].dados_bancarios.banco, 'digitoAgencia') && !form.documentos_liberacao[0].dados_bancarios.banco.digitoAgencia ? 'Informe a agência com 4 número sem dígito verificador. Exemplo: <span class=\'realce\'>1234</span>' : 'Informe a agência com 4 número e o dígito verificador. Exemplo: <span class=\'realce\'>1234-5</span>') + ' </h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
                                  <the-mask v-model="form.documentos_liberacao[0].dados_bancarios.agencia" name="agência" class="form-control text-right" :disabled="this.form.tarefas[0].nome !== 'Análise'"
                                            type="text" :mask="_.has(form.documentos_liberacao[0].dados_bancarios.banco, 'digitoAgencia') && !form.documentos_liberacao[0].dados_bancarios.banco.digitoAgencia ? '####' : '####-X'" v-validate="'required'" masked></the-mask>
                                </div>
                                <!--ALTERADO CONFORME SUPORTE 62747-->
                                <!--<div :title="'<h5> ' + (_.has(form.documentos_liberacao[0].dados_bancarios.banco, 'digitoAgencia') && !form.documentos_liberacao[0].dados_bancarios.banco.digitoAgencia ? 'Informe a agência com 4 número sem dígito verificador. Exemplo: <span class=\'realce\'>1234</span>' : 'Informe a agência com 4 número e o dígito verificador. Exemplo: <span class=\'realce\'>1234-5</span>') + ' </h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">-->
                                  <!--<the-mask v-model="form.documentos_liberacao[0].dados_bancarios.agencia" name="agência" class="form-control text-right"-->
                                            <!--:disabled="usuarioLogado.userType === 'FUNDACAO'"-->
                                            <!--type="text" :mask="_.has(form.documentos_liberacao[0].dados_bancarios.banco, 'digitoAgencia') && !form.documentos_liberacao[0].dados_bancarios.banco.digitoAgencia ? '####' : '####-X'" v-validate="'required'" masked></the-mask>-->
                                <!--</div>-->
                                <span v-if="errors.first('agência')" class="label label-danger">{{ errors.first('agência') }}</span>
                              </div>
                            </div>
                            <!--&lt;!&ndash; Conta Corrente &ndash;&gt;-->
                            <div class="form-group required-field" :class="{'has-error': errors.first('conta corrente')}">
                              <label class="control-label col-md-4">Conta {{form.documentos_liberacao[0].dados_bancarios.tipo === 1 ? 'Corrente' : (form.documentos_liberacao[0].dados_bancarios.tipo === 2 ? 'Poupança' : '')}}:</label>
                              <div class="col-md-8">
                                <div>
                                  <the-mask v-model="form.documentos_liberacao[0].dados_bancarios.conta" name="conta corrente" class="form-control text-right"
                                            type="text" v-validate="'required|min:3'" :mask="['#-X', '##-X', '###-X', '####-X', '#####-X', '######-X', '#######-X', '########-X', '#########-X', '##########-X', '###########-X']"
                                            masked :disabled="this.form.tarefas[0].nome !== 'Análise'"></the-mask>
                                </div>
                                <!--ALTERADO CONFORME SUPORTE 62747-->
                                <!--<div>-->
                                  <!--<the-mask v-model="form.documentos_liberacao[0].dados_bancarios.conta" name="conta corrente" class="form-control text-right"-->
                                            <!--:disabled="usuarioLogado.userType === 'FUNDACAO'"-->
                                            <!--type="text" v-validate="'required|min:3'" :mask="['#-X', '##-X', '###-X', '####-X', '#####-X', '######-X', '#######-X', '########-X', '#########-X', '##########-X', '###########-X']"-->
                                            <!--masked></the-mask>-->
                                <!--</div>-->
                                <span v-if="errors.first('conta corrente')" class="label label-danger">{{ errors.first('conta corrente') }}</span>
                              </div>
                            </div>
                            <!--&lt;!&ndash;Tipo de conta corrente&ndash;&gt;-->
                            <tipo-conta :propsTipo="form.documentos_liberacao[0].dados_bancarios.tipo" v-bind:tipo.sync="form.documentos_liberacao[0].dados_bancarios.tipo" :disabled="this.form.tarefas[0].nome !== 'Análise'"></tipo-conta>
                            <!--ALTERADO CONFORME SUPORTE 62747-->
                            <!--<tipo-conta :propsTipo="form.documentos_liberacao[0].dados_bancarios.tipo" v-bind:tipo.sync="form.documentos_liberacao[0].dados_bancarios.tipo" :disabled="usuarioLogado.userType === 'FUNDACAO'"></tipo-conta>-->

                          </div>
                        </div>
                      </div>
                      <br>
                      <div> </div>
                      <!--Documentos de solicitação de adiantamento-->
                      <div v-if="form.documentos_liberacao.length" class="col-md-12">
                        <div class="box-header with-border">
                          <h3 class="box-title">Documentos do Adiantamento</h3>
                        </div>
                        <upload-documentos-php :propDocumentos="form.documentos_liberacao[0].documentos_adiantamento" :documentTypes="''" :disable="form.tarefas[0].nome === 'Autorização'"></upload-documentos-php>
                      </div>
                      <div v-if="form.documentos_liberacao.length" class="col-md-12">
                        <div class="box-header with-border">
                          <h3 class="box-title">Documentos Anexos</h3>
                        </div>
                        <upload-documentos-php :propDocumentos="form.documentos_liberacao[0].documentos_anexos_adiantamento" :documentTypes="''" :disable="form.tarefas[0].nome === 'Autorização'"></upload-documentos-php>
                      </div>

                      <!--<div class="col-md-12">-->
                        <!--<div class="box box-widget">-->
                          <!--<div class="box-header with-border">-->
                            <!--<h3 class="box-title">Histórico de solicitação</h3>-->
                          <!--</div>-->
                          <!--<historico-solicitacao-pagamento v-if="!_.isUndefined(form.tarefas)" :propsValidacao="form" :propsHistorico="form.tarefas"></historico-solicitacao-pagamento>-->
                        <!--</div>-->
                      <!--</div>-->

                      <div class="col-md-12">
                        <div class="box box-widget">
                          <div class="box-header with-border">
                            <h3 class="box-title">Histórico de solicitação</h3>
                          </div>
                          <historico-solicitacao-pagamento v-if="historicoBack && !_.isNull(historicoBack) && !_.isEmpty(historicoBack)" :propsValidacao="form" :propsHistorico="historicoBack" :key="historicoBack"></historico-solicitacao-pagamento>
                        </div>
                        <div class="text-left box-header" v-if="!historicoBack">
                          <a href="" v-if="esconderHistorico === false" @click.prevent="esconderHistorico = true"><i class="fa fa-caret-down" aria-hidden="true"></i> Mostrar histórico antigo</a>
                          <a href="" v-if="esconderHistorico === true" @click.prevent="esconderHistorico = false"><i class="fa fa-caret-up" aria-hidden="true"></i> Ocultar histórico antigo</a>
                        </div>
                        <div class="col-md-8" v-if="esconderHistorico === true && !historicoBack">
                          <div class="box box-widget">
                            <div class="box-header with-border">
                              <h3 class="box-title">Histórico Antigo</h3>
                            </div>
                            <historico-solicitacao-pagamento v-if="!_.isUndefined(historicoAnt)" :propsValidacao="form" :propsHistorico="historicoAnt"></historico-solicitacao-pagamento>
                          </div>
                        </div>
                      </div>

                      <!-- Opções-->
                      <div class="col-md-12" v-if="usuarioLogado.userType === 'FUNDACAO' && form.tarefas[0].nome === 'Análise Financeira'">
                        <!-- requestApprovalResult -->
                        <div class="form-group full" style="margin-right:0;margin-left:0">
                          <label class="control-label">Opções para este documento:</label>
                          <br>
                          <br>
                          <div>
                            <label class=" new-control new-control-checkbox">
                              <input
                                type="checkbox"
                                v-model="bypass"
                                :false-value="''"
                                @change="atualizaOpcoes('BYPASS')"
                                class="form-control"
                                :true-value="'BYPASS'"
                                name="acao"/>Não integrar com Sapiens
                              <div class="new-control-indicator"></div>
                            </label>
                          </div>
                        </div>
                      </div>
<!--                      Opções de aprovação-->
                      <div class="col-md-12">
                        <div class="box box-widget" >
                          <div class="box-header with-border">
                            <h3 class="box-title">Aprovação da solicitação de adiantamento</h3>
                          </div>
                          <div class="box-body">
                            <div class="row" >

                              <div class="form-group required-field full" style="margin-right:0;margin-left:0"
                                   :class="{ 'has-error' : errors.first('resultadoAprovacao')}">
                                <label for="resultadoAprovacao" ref="resultadoAprovacao" class="control-label">Aprovar solicitação?</label>
                                <div>
                                  <!-- Análise e Aprovação da Solicitação de Adiantamento -->
                                  <label v-if="form.tarefas[0].nome === 'Análise' || form.tarefas[0].nome === 'ANALISE'" class="radio-inline new-control new-control-radio ng-binding">
                                    <input type="radio" name="resultadoAprovacao" v-model="tarefa.proximaEtapa" value="Autorização" class="ng-not-empty ng-dirty ng-valid-parse ng-valid ng-valid-required ng-touched"
                                           v-validate="'required'"> Aprovar solicitação de adiantamento
                                    <div class="new-control-indicator"></div>
                                  </label>
                                  <!-- Análise e Aprovação da Solicitação de Adiantamento -->
                                  <label v-else-if="form.tarefas[0].nome === 'Autorização'" class="radio-inline new-control new-control-radio ng-binding">
                                    <input type="radio" name="resultadoAprovacao" v-model="tarefa.proximaEtapa" value="Análise Financeira" class="ng-not-empty ng-dirty ng-valid-parse ng-valid ng-valid-required ng-touched"
                                           v-validate="'required'"> Aprovar solicitação de adiantamento
                                    <div class="new-control-indicator"></div>
                                  </label>
                                  <!-- Análise e Aprovação da Solicitação de Adiantamento -->
                                  <label v-else-if="form.tarefas[0].nome === 'Análise Financeira'" class="radio-inline new-control new-control-radio ng-binding">
                                    <input type="radio" name="resultadoAprovacao" v-model="tarefa.proximaEtapa" value="Conclusão" class="ng-not-empty ng-dirty ng-valid-parse ng-valid ng-valid-required ng-touched"
                                           v-validate="'required'"> Aprovar solicitação de adiantamento
                                    <div class="new-control-indicator"></div>
                                  </label>

                                  <!-- Encaminhar para revisão pela entidade -->
                                  <label v-if="form.tarefas[0].nome === 'Análise' || form.tarefas[0].nome === 'Autorização' || form.tarefas[0].nome === 'Análise Financeira'" class="radio-inline new-control new-control-radio ng-scope">
                                  <input type="radio" name="resultadoAprovacao" v-model="tarefa.proximaEtapa" value="Revisão" class="ng-pristine ng-untouched ng-not-empty ng-valid ng-valid-required"
                                         v-validate="'required'"> Encaminhar para revisão da entidade
                                  <div class="new-control-indicator"></div>
                                  </label>
                                  <!-- Voltar para analise da Solicitação de Adiantamento -->
                                  <label v-if="form.tarefas[0].nome === 'Autorização' || form.tarefas[0].nome === 'Análise Financeira' || form.tarefas[0].nome === 'Revisão'" class="radio-inline new-control new-control-radio ng-scope">
                                    <input type="radio" name="resultadoAprovacao" v-model="tarefa.proximaEtapa" value="Análise" class="ng-pristine ng-untouched ng-not-empty ng-valid ng-valid-required"
                                           v-validate="'required'"> Retornar para análise
                                    <div class="new-control-indicator"></div>
                                  </label>
                                  <!--Cancela solicitação de adiantamento-->
                                  <label class="radio-inline new-control new-control-radio ng-scope">
                                  <input type="radio" name="resultadoAprovacao" v-model="tarefa.proximaEtapa" value="Cancelar" class="ng-pristine ng-untouched ng-not-empty ng-valid ng-valid-required"
                                         v-validate="'required'"> Cancelar Solicitação
                                  <div class="new-control-indicator"></div>
                                </label>
                                </div>
                              </div>

                              <!-- motivo de devolução Suporte 59885 -->
                              <div class="form-group required-field full" v-if="tarefa.proximaEtapa === 'Revisão'"
                                   :class="{ 'has-error' : errors.first('justificativa')}" style="margin-right:0;margin-left:0">
                              <label for="motivo de devolucao" class="control-label">Motivo de devolução:</label>
                              <div>
                                <div>
                                  <multiselect v-model="motivoDevolucao"
                                               :options="motivosDevolucao"
                                               :multiple="false"
                                               :close-on-select="true"
                                               placeholder="Selecione um motivo de Devolução para a entidade"
                                               :custom-label="motivoDevolucaoDescricao"
                                               track-by="codigo"
                                               selectedLabel="Selecionado"
                                               selectLabel="Aperte ENTER para selecionar"
                                               deselectLabel="Aperte ENTER para remover"
                                               name="motivo de devolucao"
                                               data-vv-as="motivo de devolucao"
                                               :option-height="30"
                                               :disabled="ehVisualizacao"
                                               v-validate="'required'">
                                  </multiselect>
                                </div>
                                <span v-if="errors.first('motivo de devolucao')" class="label label-danger"> {{ errors.first('motivo de devolucao') }}</span>
                              </div>
                            </div>

<!--                              Justificativa para Revisão-->
                              <div v-if="tarefa.proximaEtapa"
                                   class="form-group full" style="margin-right: 0px; margin-left: 0px;" :class="[{'has-error' : errors.first('observacao')}, {'required-field' : tarefa.proximaEtapa !== 'Autorização'}]">
                                <label v-if="tarefa.proximaEtapa === 'Revisão'" for="observacao" class="control-label">Motivo para revisão:</label>
                                <label v-if="tarefa.proximaEtapa === 'Autorização'" for="observacao" class="control-label">Observação:</label>
                                <label v-if="tarefa.proximaEtapa === 'Cancelar'" for="observacao" class="control-label">Motivo para cancelamento:</label>
                                <textarea name="observacao" id="observacao" v-model="tarefa.observacao" rows="3"
                                          class="form-control ng-pristine ng-untouched ng-empty ng-invalid ng-invalid-required"
                                          v-validate="'required_if:resultadoAprovacao,Revisão'">
                                </textarea>
                                <span v-if="errors.first('observacao')" class="label label-danger"> {{ errors.first('observacao') }}</span>
                              </div>
                            </div>
                          </div> <!-- ./box-body -->
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
            </div>
            <div class="box-footer">
              <button type="submit" :disabled="restricao || tarefa.proximaEtapa === '' || form.busy" class="btn btn-success btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</button>
              <button @click="$router.go(-1)" type="button" class="btn btn-default btn-flat"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</button>

            </div>

          </div>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  import CronogramaSolicitacaoAdiantamentoValidacao from './componentes/cronograma-solicitacao-adiantamento-validacao'
  import UploadDocumentosPhp from '../../../modules/uploadDocumentosPhp'
  import HistoricoSolicitacaoPagamento from '../../../solicitacoes/modulos/historicoSolicitacaoPagamento'
  import HistoricoAntigo from '../../../solicitacoes/modulos/historicoAntigo'
  import listaBancos from '../../../solicitacoes/adiantamento/componentes/listaBancos'
  import tipoConta from '../../../solicitacoes/adiantamento/componentes/tipoConta'
  export default {
    name: 'validacaoAdiantamento',
    components: {UploadDocumentosPhp, CronogramaSolicitacaoAdiantamentoValidacao, HistoricoSolicitacaoPagamento, HistoricoAntigo, listaBancos, tipoConta},
    data () {
      return {
        loading: false,
        tipoTransacao: '',
        show: {
          info: false,
          message: ''},
        entidade: {
          dirigentes: []
        },
        historicoTarefasTela: [],
        resultadoAprovacao: '',
        restricao: false,
        form: new Form({
          tarefas: [
            {'nome': '', 'proxima_etapa': '', 'data_edicao': ''}
          ],
          documentos_liberacao: []
        }),
        processo: {
          nome: 'ADIANTAMENTO',
          situacao: 'EM_EXECUCAO'
        },
        tarefa: {
          'nome': 'ANALISE',
          'tipo': 'USUARIO',
          'situacao': 'PADRAO',
          'proximaEtapa': ''
        },
        item: {},
        esconderHistorico: false,
        historicoBack: [],
        historicoAnt: [],
        chamado: [],
        data_edicao: '',
        relat: {
          id: 13,
          createdAt: null,
          code: 'FJCF248.GER',
          codeNames: 'ENumPrj;ECodFor',
          fieldNames: 'Projeto;Beneficiário/Fornecedor',
          title: '248 - Monitoramento Administrativo'
        },
        proposta: {
          ds_codigo_projeto_erp: ''
        },
        motivoDevolucao: null,
        motivosDevolucao: []
      }
    },
    mounted () {
      if (this.$route.params.id) {
        this.verificaChamado()
      }
      this.buscaMotivosDevolucao()
    },
    created () {
      // Seta como default a transação com solicitação
      this.tipoTransacao = 'ANALISE'
      this.data_edicao = moment().format('YYYY-MM-DD HH:mm:ss')
      // Busca os projetos que podem ser pedidos adiantamentos
      this.buscaProcesso()
    },
    methods: {
      buscaHistorico (request) {
        console.log('caiu aqui historicoBack', request)
        axiosLaravel.post('historico-tarefas/lista', {'parametro': request}).then((response) => {
          this.historicoBack = response.data
          console.log('response historicoBack', response.data)
        })
      },
      gravaHistorico (parm) {
        axiosLaravel.post('historico-tarefas/', parm).then((response) => {
          console.log(response.data)
        })
      },
      atualizaOpcoes ($opcao) {
        if (_.isUndefined(this.form.documentos_liberacao[0].parametros_documento)) {
          this.form.documentos_liberacao[0].parametros_documento = []
        }
        let existe = this.form.documentos_liberacao[0].parametros_documento.some((item) => {
          return item.valor === $opcao
        })
        if (existe) {
          _.remove(this.form.documentos_liberacao[0].parametros_documento, (item) => {
            return item.valor === $opcao
          })
        } else {
          this.form.documentos_liberacao[0].parametros_documento.push({
            'parametro': 'OPCOES',
            'valor': $opcao
          })
        }
        this.$forceUpdate()
      },
      buscaProcesso () {
        console.log('caiu aqui')
        this.buscaHistorico(this.$route.params.id)
        this.loadingShow = true // bloquea a tela enquanto busca os dados
        axiosLaravel.get('processos/' + this.$route.params.id).then((response) => {
          this.form = response.data
          this.dataProcesso = moment(this.form.inicio).format('DD/MM/YYYY')
          console.log('this.form', this.form)
          console.log('this.form.tarefas', this.form.tarefas)
          this.historicoTarefasTela = _.cloneDeep(this.form.tarefas)
          // Pega dados do projeto
          this.proposta = this.form.documentos_liberacao[0].itens_liberados[0].parcelas_adiantamentos[0].proposta
          if (this.form.tarefas[0].nome === 'Revisão') {
            this.tarefa.proximaEtapa = 'Análise'
          }
          let arrayTemp = this.form.tarefas
          let array = arrayTemp.filter((item) => {
            return item.tipo === 'Usuário' && !_.isNull(item.termino)
          })
          this.historicoAnt = _.cloneDeep(array)
          this.$forceUpdate() // força o update da tela para não ter problema
          this.loadingShow = false // desbloquea a tela
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      async concluir  () {
        this.incluiMotivo()
        if (this.tarefa.proximaEtapa === 'Conclusão' || this.tarefa.proximaEtapa === 'Autorização' || this.tarefa.proximaEtapa === 'Análise Financeira') {
          if (await this.$root.verificaFormulario(this)) {
            var menssagem = ''
            this.$validator.errors.items.forEach((item) => {
              menssagem = menssagem + '\n' + item.msg
            })
            if (menssagem === '') {
              this.$snotify.error('Formulário possui erro favor verificar')
            } else {
              this.$snotify.error(menssagem)
            }
            return
          }
          // Validação das parcelas
          if (!this.validaItens()) {
            this.$snotify.error('Valores das parcelas precisa ser maior que 0')
            return
          }
          // Validação dos documentos
          if (!this.validaDocumentos()) {
            this.$snotify.error('Faltam documentos à serem adicionados')
            return
          }
        }
        // mover os dados para os objetos corretos
        this.preparaObjeto()
        this.$validator.validateAll().then((result) => {
          if (!result) {
            this.$snotify.error('Formulario possui erros favor verificar')
          } else {
            this.enviaBackEnd()
          }
        })
      },
      enviaBackEnd () {
        // Mostra notificacao na tela
        this.$snotify.info('Atualizando Validação', {timeout: 0})
        // enviar para o backend
        _.set(this.form, 'nr_projeto', this.proposta.ds_codigo_projeto_erp)
        axiosLaravel.put('processos/adiantamento/atualiza', this.form).then(async (response) => {
          // Retira a notificação da tela
          this.gravaHistorico(response.data)
          this.$snotify.clear()
          // volta do backend e retorna para tela anterior
          this.$snotify.success('Adiantamento validado com sucesso')
          if (this.tarefa.proximaEtapa === 'Autorização') {
            await this.emitir(199)
          }
          setTimeout(() => {
            this.$router.go(-1)
          }, 2000)
        })
          .catch((error) => {
            this.$snotify.clear()
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      validaItens () {
        return this.form.documentos_liberacao[0].itens_liberados.some((item) => {
          return item.valor > 0
        })
      },
      validaDocumentos () {
        return this.form.documentos_liberacao[0].documentos_adiantamento.length > 0
        // ALTERADO CONFORME SUPORTE 62747
        // return this.form.documentos_liberacao[0].documentos_adiantamento.length > 0 && this.form.documentos_liberacao[0].documentos_anexos_adiantamento.length > 0
      },
      preparaObjeto () {
        this.form.processo = this.processo
        this.form.tarefa = this.tarefa
        //
        this.tarefa.proxima_etapa = this.tarefa.proximaEtapa
        this.tarefa.data_edicao = this.data_edicao
        this.form.tarefas[0].proxima_etapa = this.tarefa.proximaEtapa
        this.form.tarefas[0].data_edicao = this.data_edicao
        this.form.projeto = this.projeto
      },
      onLoad () {
        this.$snotify.clear()
        this.$snotify.async('Gerando relatório. Por favor, aguarde...', {timeout: 0})
        axios.put('proxy/utility/erp-report/emit-report', {erpReport: this.relat, params: this.temp}).then((response) => {
          this.onDownload(response)
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      async emitir (relatorio) {
        this.loading = true
        let prefixo = 'FJCF'
        let parametros = '<ECodEmp=1><ENumPrj=' + this.proposta.ds_codigo_projeto_erp + '>'
        if (relatorio === 222 || relatorio === 219) {
          parametros += ',<ESitPrj=ULT>'
        } else if (relatorio === 248) {
          parametros += ',<ECodFor=>'
        }
        if (relatorio === 222) {
          parametros += ',<EMosDes=S>'
        }
        if (relatorio === 199) {
          console.log('rel 199')
          console.log('id', this.form.documentos_liberacao[0].id)
          prefixo = 'SRNF'
          axiosLaravel.get('processos/busca_seqban/' + this.form.documentos_liberacao[0].id).then((response) => {
            let seqBan = response.data.valor
            console.log('response', response)
            // console.log('seqBan', seqBan)
            // console.log('origem', this.form.documentos_liberacao[0].itens_liberados[0].parcelas_adiantamentos[0].origem)
            // console.log('lengthParcAdiantamentos', this.form.documentos_liberacao[0].itens_liberados[0].parcelas_adiantamentos.length)
            let strOrigem = 'RP'
            if (this.form.documentos_liberacao[0].itens_liberados[0].parcelas_adiantamentos[0].origem === 5) {
              strOrigem = 'RT'
            }
            this.$snotify.clear()
            let codigoRelatorio = prefixo + relatorio + '.GER'
            parametros += '<EVlrAdt=' + this.valorTotalSolicitacao + '><EPeriod=90><ECodFpj=' + strOrigem + '><ESeqBan=' + seqBan + '>'

            console.log('parametros', parametros)
            this.$snotify.async('Gerando relatório ' + relatorio + '. Por favor, aguarde...', {timeout: 0})
            axiosLaravel.post('relatorio-erp/emitir', {erpReport: {'ds_codigo': codigoRelatorio}, params: parametros}).then((response) => {
              this.onDownload(response, relatorio, this)
            })
              .catch((error) => {
                this.$snotify.clear()
                this.loading = false
                this.$root.trataErro(error)
              })
            // return `<EVlrAdt=${this.valorTotalSolicitacao}><EPeriod=90><ECodFpj=RP><ESeqBan=${seqBan}>`
          })
            .catch((error) => {
              console.log('error', error)
              this.$root.trataErro(error)
            })
        }
        if (relatorio !== 199) {
          this.$snotify.clear()
          let codigoRelatorio = prefixo + relatorio + '.GER'
          this.$snotify.async('Gerando relatório ' + relatorio + '. Por favor, aguarde...', {timeout: 0})
          axiosLaravel.post('relatorio-erp/emitir', {erpReport: {'ds_codigo': codigoRelatorio}, params: parametros}).then((response) => {
            this.onDownload(response, relatorio, this)
          })
            .catch((error) => {
              this.$snotify.clear()
              this.loading = false
              this.$root.trataErro(error)
            })
        }
      },
      onDownload (response, relatorio, vm) {
        let item = response.data.arquivo
        // Suporte 62296 - Ajuste do nome do arquivo do relatório
        let tipoProcesso = 'ADT ' + this.proposta.ds_codigo_projeto_erp
        const contentType = 'application/pdf'
        const b64Data = response.data.arquivo
        let file = this.b64toBlob(b64Data, contentType)
        let ie = !!window.MSInputMethodContext && !!document.documentMode
        if (!ie) {
          let blob = file
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = moment(vm.data_edicao).format('YYYYMMDD') + ' ID ' + this.form.id + ' ' + tipoProcesso
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } else {
          let blob = file
          let link = document.createElement('blob')
          link.href = window.navigator.msSaveOrOpenBlob(blob, item.name)
          link.download = moment(vm.data_edicao).format('YYYYMMDD') + ' ID ' + this.form.id + ' ' + tipoProcesso
          link.click()
        }
        this.$snotify.clear()
        this.$snotify.success('Relatório gerado com sucesso!')
        this.loading = false
      },
      b64toBlob (b64Data, contentType = '', sliceSize = 512) {
        const byteCharacters = atob(b64Data)
        const byteArrays = []
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize)
          const byteNumbers = new Array(slice.length)
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          byteArrays.push(byteArray)
        }
        const blob = new Blob(byteArrays, {type: contentType})
        return blob
      },
      incluiMotivo () {
        // Monta objeto para incluir gravação do motivo da devolução na tabela t_parametros_documentos
        if (this.tarefa.proximaEtapa === 'Revisão') {
          this.form.documentos_liberacao[0].parametros_documento = []
          // this.tarefa.observacao = '#' + this.motivoDevolucao + '# ' + this.tarefa.observacao
          this.tarefa.observacao = this.tarefa.observacao
          _.set(this.motivoDevolucao, 'fk_usuario', this.usuarioLogado.id)
          this.form.documentos_liberacao[0].parametros_documento.push({ 'parametro': 'MOTIVO_DEVOLUCAO', 'valor': JSON.stringify(this.motivoDevolucao) })
        }
      },
      verificaChamado () {
        axiosLaravel.post('chamado/chamadoProcesso/', {'parametro': this.$route.params.id}).then((response) => {
          this.chamado = response.data
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      onDownloadZIP () {
        this.$forceUpdate()
        this.$snotify.async('Baixando arquivos. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.get('processos/documentos/download/' + this.$route.params.id).then((response) => {
          let link = document.createElement('a')
          link.href = response.data
          link.download = 'Arquivo não localizado'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.$snotify.clear()
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      motivoDevolucaoDescricao (option) {
        return `${option.descricao}`
      },
      buscaMotivosDevolucao () {
        axiosLaravel.post('motivos/ativos').then((response) => {
          this.motivosDevolucao = response.data
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ]),
      valorTotalSolicitacao () {
        let resultado = this.form.documentos_liberacao[0].itens_liberados.reduce((acumulador, item) => acumulador + item.valor, 0)
        if (Number.isInteger(resultado)) {
          return resultado.toLocaleString('pt-BR') + ',00'
        } else {
          return resultado.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2})
        }
      }
    }
  }
</script>

<style scoped>

</style>
