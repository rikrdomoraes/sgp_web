<template>
  <div class="content-wrapper">


    <section class="content-header">
      <h1>Relatórios de Execução
        <!-- Botões -->
        <span v-if="!loading.tela">
          <g-button-ujarak color="success" size="button--size-ss" @click.native="permiteConcluir" v-if="!ehVisualizacao && telaRelatorio.alerta.restricao !== 'ENVIO_BLOQUEADO'"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</g-button-ujarak>
          <g-button-ujarak color="primary" size="button--size-ss" @click.native="salvaRelatorio" v-if="!ehVisualizacao"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar</g-button-ujarak>
          <g-button-ujarak color="primary" size="button--size-ss" @click.native="print" ><i class="fa fa-print" aria-hidden="true"></i> PDF</g-button-ujarak>
          <g-button-ujarak color="primary" size="button--size-ss" @click.native="onDownloadZIP()"
                           :title="'<h5>Faz o download de todos os arquivos (zip)</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
                            <i class="fa fa-download" aria-hidden="true">&nbsp;Baixar arquivos</i>
          </g-button-ujarak>
          <g-button-ujarak color="warning" size="button--size-ss" @click.native="$router.go(-1)"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</g-button-ujarak>

        </span>
        <span v-else> <i class="fa fa-refresh fa-spin"></i></span>
      </h1>
      <b-breadcrumb :items="[{text: 'Inicial', href: '/'}, {text: 'Projetos', href: '/projetos/lista'}, {text: 'Relatório de Execuação', active: true}]"/>
    </section>

    <br/>

    <section class="content">
      <div class="box box-widget">
        <!--<div class="box-header with-border">-->
        <!--<h3 ng-if="execRepRegCtrl.report.executionReportPhase == 'APROVADO'" class="text-green box-title">Relatório Aprovado</h3>-->
        <!--<h3 ng-if="execRepRegCtrl.report.executionReportPhase == 'CANCELADO'" class="text-red box-title">Relatório Não aprovado</h3>-->
        <!--<h3 ng-if="execRepRegCtrl.report.executionReportPhase == 'ANALISE_REVISAO'" class="text-red box-title">Relatório em Revisão</h3>-->
        <!--</div>-->

        <div class="box-body">
          <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

          <div v-show="mostrar_msg" v-if="telaRelatorio.alerta.situacao !== 'OCULTO'" class="alert alert-dismissible alert-warning">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
            <h4><i class="fa fa fa-info"></i>&nbsp;&nbsp;{{telaRelatorio.alerta.titulo}}</h4>
            <span v-html=telaRelatorio.alerta.conteudo></span>
          </div>

          <div v-show="mostrar_msg" v-if="telaRelatorio.aviso.situacao !== 'OCULTO'" class="alert alert-dismissible alert-info">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
            <h4><i class="fa fa-info"></i>&nbsp;&nbsp;{{telaRelatorio.aviso.titulo}}</h4>
            <span v-html=telaRelatorio.aviso.conteudo></span>
          </div>

          <div  v-if="tipoUsu === 'FUNDACAO'" class="col-md-12" style="margin-top:100px; padding:0px;">
            <RelatorioBNDES
              ref="relatorioBNDESChildRef"
              :key="componentKey"
              :dadosRelatorio="telaRelatorio"
              :previstoPublicoAlvo="previstoPublicoAlvo"
              :totalizadores="totalizadoresListaParticipantes"
              :executadasparcial="executadasparcial"
              :naoexecutadas="naoexecutadas"
              :contrapartida="telaRelatorio.contrapartida_comprovada.row"
            />
            <div class="box box-primary">
              <div class="box-header with-border">
                <h3 class="box-title">Usuário que enviou o relatório</h3>
              </div><!-- /.box-header -->
              <div class="box-body" style="padding-top: 0px;">
                <div class="row">
                  <div class="col-md-4 form-group required-field" :class="{ 'has-error' : errors.first('usuarioEnvioNome')}">
                    <label class="col control-label">Nome:</label>
                    <div class="col ">
                      <input v-model="telaRelatorio.usuario_enviou.nome"  :disabled="true"  id="usuarioEnvioNome" name="usuarioEnvioNome" class="form-control" type="text" :class="{ 'has-error' : errors.first('usuarioEnvioNome')}">
                      <span v-if="errors.first('usuarioEnvioNome')" class="label label-danger"> {{('O campo Usuário que enviou é obrigatório') }}</span>
                    </div>
                  </div>

                  <div class="col-md-4 form-group required-field" :class="{ 'has-error' : errors.first('usuarioEnvioCPF')}">
                    <label class="col control-label">CPF:</label>
                    <div class="col">
                      <input v-model="telaRelatorio.usuario_enviou.cpf"  :disabled="true"  v-mask="['###.###.###-##']" id="usuarioEnvioCPF" name="usuarioEnvioCPF" class="form-control" type="text" :class="{ 'has-error' : errors.first('usuarioEnvioCPF')}">
                      <span v-if="errors.first('usuarioEnvioCPF')" class="label label-danger"> {{('O campo CPF do usuário que enviou é obrigatório') }}</span>
                    </div>
                  </div>

                  <div class="col-md-4 form-group required-field" :class="{ 'has-error' : errors.first('usuarioEnvioEmail')}">
                    <label class="col control-label">E-mail:</label>
                    <div class="col">
                      <input v-model="telaRelatorio.usuario_enviou.email" :disabled="true"  id="usuarioEnvioEmail" name="usuarioEnvioEmail" class="form-control" type="text" :class="{ 'has-error' : errors.first('usuarioEnvioEmail')}">
                      <span v-if="errors.first('usuarioEnvioEmail')" class="label label-danger"> {{('O campo Email do usuário que enviou é obrigatório') }}</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <!-- Project Data -->
          <div class="col-md-12" style="margin-top:15px; padding:0px;">
            <div class="box box-default">
              <div class="box-header with-border">
                <h3 class="box-title">Dados do projeto</h3>
              </div><!-- /.box-header -->
              <div class="box-body" style="padding-top: 0px;">
                <div class="row">
                  <div class="col-md-1">
                    <label>Nº do Projeto:</label>
                    <input :disabled="true"  v-model="telaRelatorio.cabecalho.numero_projeto" id="repNumber" name="repNumber" class="form-control" type="text">
                  </div>
                  <div class="col-md-11">
                    <!-- project title -->
                    <label class="col">Título do Projeto:</label>
                    <div class="col" >
                      <input :disabled="true" v-model="telaRelatorio.cabecalho.projeto" id="repTitle" name="repTitle" class="form-control" type="text">
                    </div>
                  </div>
                </div>
                <br>
                <div class="row">
                  <!-- period date -->
                  <div class="col-md-2">
                    <label class="col">Início de execução do projeto:</label>
                    <div class="input-group" >
                      <input :disabled="true" v-model="telaRelatorio.cabecalho.inicio" id="inicioProjeto" name="inicioProjeto" class="form-control" type="text">
                    </div>
                  </div>
                  <div class="col-md-2">
                    <label class="col">Fim de execução do projeto:</label>
                    <div class="input-group">
                      <input :disabled="true" v-model="telaRelatorio.cabecalho.termino" id="terminoProjeto" name="terminoProjeto" class="form-control" type="text">
                    </div>
                  </div>
                  <div class="col-md-4"></div>

                  <div class="col-md-2">
                    <label class="col">Percentual Financeiro Realizado:</label>
                    <div class="input-group">
                      <input :disabled="true" v-model="telaRelatorio.cabecalho.percentual_liberacao" id="percentualLiberacao" name="percentualLiberacao" class="form-control" type="text">
                    </div>
                  </div>

                  <div class="col-md-2">
                    <label class="col">Percentual de tempo decorrido:</label>
                    <div class="input-group">
                      <input :disabled="true" v-model="telaRelatorio.cabecalho.percentual_andamento" id="percentualAndamento" name="percentualAndamento" class="form-control" type="text">
                    </div>
                  </div>


                </div>
                <br>
                <div class="row">
                  <div class="col-md-12">
                    <!-- contractor -->
                    <label class="control-label col">Convenente:</label>
                    <div class="col">
                      <input :disabled="true"  v-model="telaRelatorio.cabecalho.entidade" id="contractor" name="contractor" class="form-control" type="text">
                    </div>

                  </div>
                </div>
                <fieldset>
                  <div class="row">
                    <br>
                    <!-- mail -->
                    <div class="col-md-6 form-group required-field" :class="{ 'has-error' : errors.first('mail')}">
                      <div class="col form-group required">
                        <label class="control-label">E-mail de contato:</label>
                        <input  v-model="telaRelatorio.cabecalho.email_contato" :disabled="ehVisualizacao"  v-validate="'required|email|min:1|max:255'" id="mail" name="mail" class="form-control"  :class="{ 'has-error' : errors.first('mail')}" type="text">
                        <span v-if="errors.first('mail')" class="label label-danger"> {{ errors.first('mail') }}</span>
                        <!--<span ng-show="execRepViewForm.$submitted && execRepViewForm.mail.$error.validateEmail" class="label label-danger">E-mail inválido</span>-->
                        <!--CAMPO OBRIGATORIO-->
                      </div>
                    </div>
                    <!-- phone -->
                    <div class="col-md-3 form-group required-field" :class="{ 'has-error' : errors.first('telefone1')}">
                      <div class="col form-group required">
                        <label class="control-label">Telefone 1:</label>
                        <input  v-model="telaRelatorio.cabecalho.telefone_contato_1" :disabled="ehVisualizacao"  v-validate="'required'" id="telefone1" v-mask="'(##) ####-#####'" :class="{ 'has-error' : errors.first('telefone1')}" :masked="masked" name="telefone1" class="form-control" type="text">
                        <span v-if="errors.first('telefone1')" class="label label-danger"> {{('O campo Telefone é obrigatório') }}</span>
                        <!--CAMPO OBRIGATORIO-->
                      </div>
                    </div>
                    <div class="col-md-3 form-group">
                      <div class="col form-group">
                        <label class="control-label">Telefone 2:</label>
                        <input  v-model="telaRelatorio.cabecalho.telefone_contato_2" :disabled="ehVisualizacao" id="telefone2" v-mask="'(##) ####-#####'" :masked="masked" name="telefone2" class="form-control" type="text">
                      </div>
                    </div>
                  </div>

                  <div class="col form-group required" :class="{ 'has-error' : errors.first('relFinal')}">
                    <label class="control-label" style="margin-right: 8px;">É o relatório final do projeto?</label>
                  </div>
                  <div class="row">
                    <div class="box-body" style="padding-top: 0px;">
                      <div class="col-md-2 form-group required" :class="{ 'has-error' : errors.first('relFinal')}">
                        <label class="new-control new-control-radio" style="padding-top: 8px;">
                          <input v-validate="'required'" type="radio" name="relFinal" v-model="telaRelatorio.tipo_relatorio" value="FINAL" class="ng-pristine ng-untouched ng-valid ng-not-empty" :disabled="ehVisualizacao"> Sim
                          <div class="new-control-indicator"></div>
                        </label>
                        <label class="new-control new-control-radio" style="padding-top: 8px;">
                          <input v-validate="'required'" type="radio" name="relFinal"  v-model="telaRelatorio.tipo_relatorio" value="PARCIAL" class="ng-pristine ng-untouched ng-valid ng-not-empty" :disabled="ehVisualizacao"> Não
                          <div class="new-control-indicator"></div>
                        </label>
                        <span v-if="errors.first('relFinal')" class="label label-danger"> {{('O campo Relatório final é obrigatório') }}</span>
                      </div>
                    </div>
                  </div>
                  <div v-if="telaRelatorio.tipo_relatorio === 'FINAL'" :class="{ 'has-error' : errors.first('objeto1')}">
                    <div class="col-md-12 form-group">
                      <div class="col-md-12 form-group">
                        <label style="margin-top: 0px; margin-bottom: 0px;font-size: 12px;" class="form-group control-label">Indicadores de Execução</label>
                        <textarea-autosize v-resizable :disabled="true" @input="resizable" v-model="proposta.indicadores_resultado" name="indicadoresResultado" class="form-control"></textarea-autosize>
                        <!--<div>{{proposta.indicadores_resultado}}</div>-->
                      </div>
                    </div>
                    <div class="col form-group required">
                      <label class="control-label" style="margin-right: 8px;">O objeto foi cumprido?</label>
                    </div>
                    <div class="row">
                      <div class="box-body" style="padding-top: 0px;">
                        <div class="col-md-2 form-group required">
                          <label class="new-control new-control-radio" style="padding-top: 8px;">
                            <input v-validate="'required'" type="radio" name="objeto1" v-model="telaRelatorio.objeto"  value="SIM" class=""> Sim
                            <div class="new-control-indicator"></div>
                          </label>
                          <label class="new-control new-control-radio" style="padding-top: 8px;">
                            <input v-validate="'required'" type="radio" name="objeto1" v-model="telaRelatorio.objeto"  value="NAO" class=""> Não
                            <div class="new-control-indicator"></div>
                          </label>
                        </div>
                      </div>
                      <div v-if="telaRelatorio.objeto === 'NAO'" class="col-md-6 form-group required-field" :class="{ 'has-error' : errors.first('justificativaObjeto')}">
                        <div class="col-md-12 form-group required">
                          <label style="margin-top: 0px; margin-bottom: 0px;font-size: 12px;" class="form-group control-label">Justifique</label>
                          <textarea v-validate="'required'" :disabled="ehVisualizacao"  v-model="telaRelatorio.objetoJustificativa" style="height:150px; resize:none;" name="justificativaObjeto" class="form-control" :class="{ 'has-error' : errors.first('justificativaObjeto')}"></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>

          <!--DIV DE METAS E ATIVIDADES-->
          <div class="col-md-12" style="margin-top:15px; padding:0px;" ref="metAtv">
            <div class="box box-default">
              <div class="box-header with-border form-group required">
                <h3 class="box-title control-label">Metas e Atividades</h3>
              </div><!-- /.box-header -->
              <div class="box-body" style="padding-top: 0px;">
                <table class="table table-condensed table-bordered">
                  <thead>
                  <tr style="background-color: #F2F3F4">
                    <th v-for="head in headerTable.thead"
                        :colspan="4"><div align="center">{{head.header}}</div></th>
                  </tr>
                  <tr>
                    <th v-for="sub in subArray"
                        :width="sub.width"><span><div align="center">{{sub.title}}</div></span></th>
                  </tr>
                  </thead>
                  <tbody v-for="data in telaRelatorio.metas.row">
                  <tr>
                    <td class="text-center" :rowspan="data.atividades.row.length + 1">{{data.meta}}</td>
                    <td class="text-center" :rowspan="data.atividades.row.length + 1">{{data.orcado}}</td>
                    <td class="text-center" :rowspan="data.atividades.row.length + 1">
                      <div class="col form-group required" :class="{ 'has-error' : errors.first('metaRealizado' + data.id)}">
                        <div class="input-group">
                          <input
                            v-model="data.realizado"
                            :disabled="ehVisualizacao"
                            :id="'realizado' + data.id"
                            :name="'metaRealizado' + data.id"
                            @keypress="onlyNumber"
                            class="form-control"
                            type="text"
                            v-validate="'required|min_value:0'">
                          <span class="input-group-append">{{data.unidade}}</span>
                        </div>
                      </div>
                    </td>
                    <td class="text-center" :rowspan="data.atividades.row.length + 1">
                      <div v-if="data.orcado > 0"><span v-if=" parseInt(data.realizado) >= parseInt(data.orcado)">100 %</span><span v-else-if="parseInt(data.realizado) < parseInt(data.orcado)">{{parseInt(data.realizado) / parseInt(data.orcado) | percentage}}</span>
                        <i v-show="parseInt(data.realizado) < parseInt(data.orcado)"
                           class="fa fa-exclamation fa-3" aria-hidden="true"
                           :title="'<h5>Necessário informar uma justificativa do não atigimento de meta.</h5>'"
                           v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                           style="color: blue; margin-left: 10px; font-size: large; cursor: pointer;"></i>
                        <i v-show="parseInt(data.realizado) / parseInt(data.orcado) > 1"
                           class="fa fa-exclamation-triangle fa-3" aria-hidden="true"
                           :title="'<h5>Atentar que o valor realizado está maior do que o orçado para a referida Meta.</h5>'"
                           v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                           style="color: orange; margin-left: 10px; font-size: large; cursor: pointer;"></i>
                      </div>
                      <div v-else>0 %
                        <i v-show="parseInt(data.realizado) < parseInt(data.orcado)"
                           class="fa fa-exclamation fa-3" aria-hidden="true"
                           v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                           :title="'<h5>Necessário informar uma justificativa do não atigimento de meta.</h5>'"
                           style="color: blue; margin-left: 10px; font-size: large; cursor: pointer;"></i>
                      </div>
                    </td>
                    <tr v-for="data2 in data.atividades.row">
                      <td :title="'<h5>Documentos comprobatórios: ' + data2.documento_comprobatorio + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }" class="text-center">{{data2.atividade}}</td>
                      <td class="text-left">
                        <div :class="{ 'has-error' : errors.first('data2.id')}">
                          <div class="col form-group required" :class="{ 'has-error' : errors.first('atividadeStatus' + data2.id)}">
                            <label class="radio-inline new-control new-control-radio">
                              <input type="radio" :name="'atividadeStatus_meta' + data2.id + 'atvd' + data.id"
                                     :id="'atvdStatus_meta' + data2.id + 'atvd' + data.id"
                                     v-model="data2.status"
                                     :disabled="ehVisualizacao"
                                     :value="1"
                                     v-on:change="passaMetas2(data, data2)"
                                     v-validate="'required'"> Executada
                              <div class="new-control-indicator" style="top: 2px"></div>
                            </label> <br /> <label class="radio-inline new-control new-control-radio">
                            <input type="radio"  :name="'atividadeStatus_meta' + data2.id + 'atvd' + data.id" :id="'execucao_meta' + data2.id + 'atvd' + data.id"
                                   v-model="data2.status"
                                   :disabled="ehVisualizacao"
                                   :value="2"
                                   v-on:change="passaMetas3(data, data2)"
                                   required> Em execução
                            <div class="new-control-indicator" style="top: 2px"></div>
                          </label> <br /> <label class="radio-inline new-control new-control-radio">
                            <input type="radio" :name="'atividadeStatus_meta' + data2.id + 'atvd' + data.id"
                                   v-model="data2.status"
                                   :disabled="ehVisualizacao"
                                   :value="3"
                                   v-on:change="passaMetas(data, data2)"
                                   required> Não executada
                            <div class="new-control-indicator" style="top: 2px"></div>
                          </label> <i v-show="data2.status === 3"
                                      class="fa fa-exclamation fa-3" aria-hidden="true"
                                      :title="'<h5>Necessário informar uma justificativa da não execução da atividade.</h5>'"
                                      v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                                      style="color: red; margin-left: 10px; font-size: large; cursor: pointer;"></i>
                          </div>
                        </div>
                      </td>
                      <td class="text-center">
                        <!--<div class="col input-group required" :class="{ 'has-error' : errors.first('execucao' + data.id)}">-->
                        <!--<div class="left">-->
                        <!--<input-->
                        <!--v-model="data2.execucao"-->
                        <!--:disabled="visualizacao === 'VISUALIZAR'"-->
                        <!--id="execucao"-->
                        <!--maxlength="5"-->
                        <!--@keypress="onlyNumber"-->
                        <!--:name="'execucao' + data.id"-->
                        <!--class="form-control"-->
                        <!--type="text"-->
                        <!--v-validate="'required'">-->
                        <!--<span class="input-group-text">%</span>-->
                        <!--</div>-->
                        <!--</div>-->
                        <div class="input-group mb-3" :class="{ 'has-error' : errors.first('execucao' + data.id)}">
                          <div class="left">
                            <input style="width: 65px" type="number" min="0" max="100"
                                   v-model="data2.execucao"
                                   :disabled="ehVisualizacao || data2.execucao === 100 || data2.execucao === 0"
                                   :id="'execucao_meta' + data2.id + 'atvd' + data.id"
                                   maxlength="3"
                                   @keypress="onlyNumber"
                                   @change="buscaAtividade"
                                   :name="'execucao_meta' + data2.id + 'atvd' + data.id"
                                   class="form-control"
                                   data-vv-as="percentual de execução"
                                   v-validate="'required|min_value:0|max_value:100|numeric'">
                            <span style="color: red;"><small>{{ errors.first('execucao_meta' + data2.id + 'atvd' + data.id) }}</small></span>
                          </div>
                          <span style="line-height: 35px;">%</span>
                        </div>
                      </td>
                      <td class="text-center">
                        <i class="glyphicon glyphicon-duplicate"
                           :style="(data2.anexos_atividades.row.length === 0) ? colorFadeStyle:''"
                           v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                           aria-en="true" style="font-size: large; cursor: pointer;"
                           @click="ativaDocumentos(data2)">
                        </i>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <!--</table>-->
              </div>
              <div class="row">
                <div v-if="ativarDocumentos" class="col-md-12">
                  <div class="box box-primary" name="doc" id="doc" ref="doc">
                    <div class="box-header with-border">
                      <h3 class="box-title">Anexo de comprovação da atividade
                        executada - {{documentosAtividade.atividade}}</h3>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                      <div class="col-md-12 form-horizontal" v-if="ehVisualizacao">
                        <upload-documentos-php-novo :propDocumentos="documentosAtividade.anexos_atividades.row" :documentTypes="''" :disable="'true'" :localUso="listaDocMetas" :salvouOK="salvouOK"></upload-documentos-php-novo>
                      </div>
                      <div class="col-md-12 form-horizontal" v-if="!ehVisualizacao">
                        <upload-documentos-php-novo :propDocumentos="documentosAtividade.anexos_atividades.row" :documentTypes="''" :disable="''" :localUso="listaDocMetas" :salvouOK="salvouOK"></upload-documentos-php-novo>
                      </div>
                      <div>
                        <button ng-if="goalActExeRepCrtl.approval.status != 'REJECTED' && goalActExeRepCrtl.approval.status != 'APPROVED'"
                                class="btn btn-success btn-flat" @click="ativarDocumentos = false">Fechar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- quadro -->

              <!--              <table v-if="visualizacao === 'VISUALIZAR'" class="table table-condensed table-bordered table-striped" name="js5" id="js5" ref="js5">-->
              <!--                <thead>-->
              <!--                <tr style="background-color: #BBDEFB">-->
              <!--                  <th colspan="4">-->
              <!--                    <div align="center"><i class="fa fa-exclamation fa-3"-->
              <!--                                           aria-hidden="true"-->
              <!--                                           style="color: blue; margin-left: 10px; font-size: large; cursor: pointer;"></i>&nbsp Justificativa pelo não atingimento de meta</div></th>-->
              <!--                </tr>-->
              <!--                <tr>-->
              <!--                  <th width="20%">Meta</th>-->
              <!--                  <th width="30%">Motivo</th>-->
              <!--                  <th width="30%">Providências</th>-->
              <!--                  <th width="20%">Prazo para regularização</th>-->
              <!--                </tr>-->
              <!--                </thead>-->
              <!--                <thead>-->
              <!--                <tr v-for="cs in consultaAtividades2">-->
              <!--                  <td>{{cs.meta}}</td>-->
              <!--                  <td>-->
              <!--                    <textarea :name="'metaMotivo' + data.id" v-model="cs.motivo" rows="7" cols="5"-->
              <!--                              class="form-control" type="text" minlength="1"-->
              <!--                              :id="cs.motivo + cs.id" :disabled="true"-->
              <!--                              required></textarea>-->
              <!--                  </td>-->
              <!--                  <td>-->
              <!--                      <textarea :name="'metaProvidencia' + data.id" v-model="cs.providencia" rows="7" cols="5"-->
              <!--                                class="form-control" type="text" minlength="1"-->
              <!--                                :id="cs.providencia + cs.id" :disabled="true"-->
              <!--                                v-validate="'required'"></textarea>-->
              <!--                  </td>-->
              <!--                  <td>-->
              <!--                    <date-picker :name="'metaPrazo_regularizacao' + data.id" v-model="cs.prazo_regularizacao[0]"-->
              <!--                                 input-class="form-control" lang="pt-br" format="DD/MM/YYYY" :disabled="true"-->
              <!--                                 v-validate="'required'" placeholder="__/__/____"></date-picker>-->
              <!--                  </td>-->
              <!--                  &lt;!&ndash;<th class="text-center">{{data3.meta}}</th>&ndash;&gt;-->
              <!--                </tr>-->
              <!--                </thead>-->

              <!--              </table>-->

              <!--              <table v-if="visualizacao === 'VISUALIZAR'"  class="table table-condensed table-bordered table-striped" name="js6" id="js6" ref="js6">-->
              <!--                <thead>-->
              <!--                <tr style="background-color: #FFCDD2">-->
              <!--                  <th colspan="5">-->
              <!--                    <div align="center">-->
              <!--                      <i class="fa fa-exclamation fa-3"-->
              <!--                         aria-hidden="true"-->
              <!--                         style="color: red; margin-left: 10px; font-size: large; cursor: pointer;"></i>&nbsp Justificativa pela não execução da atividade</div></th>-->
              <!--                </tr>-->
              <!--                <tr>-->
              <!--                  <th width="20%">Meta</th>-->
              <!--                  <th width="20%">Atividade</th>-->
              <!--                  <th width="20%">Motivo</th>-->
              <!--                  <th width="20%">Providências</th>-->
              <!--                  <th width="20%">Prazo para regularização</th>-->
              <!--                </tr>-->
              <!--                </thead>-->
              <!--                <thead>-->
              <!--                <tr v-for="cs2 in consultaAtividades">-->
              <!--                  <td>{{cs2.meta}}</td>-->
              <!--                  <td>{{cs2.atividade}}</td>-->
              <!--                  <td>-->
              <!--                    <textarea :name="cs2.motivo + cs2.id" v-model="cs2.motivo" rows="8" cols="6"-->
              <!--                              class="form-control" type="text" minlength="1"-->
              <!--                              :id="cs2.motivo + cs2.id" :disabled="true" v-validate="'required'"-->
              <!--                    ></textarea>-->
              <!--                  </td>-->
              <!--                  <td>-->
              <!--                      <textarea :name="cs2.providencia + cs2.id" v-model="cs2.providencia" rows="8" cols="5"-->
              <!--                                class="form-control" type="text" minlength="1"-->
              <!--                                :id="cs2.providencia + cs2.id" :disabled="true" v-validate="'required'"-->
              <!--                                required></textarea>-->
              <!--                  </td>-->
              <!--                  <td>-->
              <!--                    <date-picker :name="cs2.prazo_regularizacao + cs2.id" v-model="cs2.prazo_regularizacao[0]"-->
              <!--                                 input-class="form-control" :ang="pt-br" format="DD/MM/YYYY" :disabled="true"-->
              <!--                                 v-validate="'required'" placeholder="__/__/____"></date-picker>-->
              <!--                  </td>-->
              <!--                  &lt;!&ndash;<th class="text-center">{{data3.meta}}</th>&ndash;&gt;-->
              <!--                </tr>-->
              <!--                </thead>-->
              <!--              </table>-->
              <!---->
              <table v-if="(executadasparcial.length)" class="table table-condensed table-bordered table-striped" name="js1" id="js1" ref="js1">
                <thead>
                <tr style="background-color: #BBDEFB">
                  <th colspan="4">
                    <div align="center"><i class="fa fa-exclamation fa-3"
                                           aria-hidden="true"
                                           style="color: blue; margin-left: 10px; font-size: large; cursor: pointer;"></i>&nbsp Justificativa pelo não atingimento de meta</div></th>
                </tr>
                <tr>
                  <th width="20%">Meta</th>
                  <th width="30%">Motivo</th>
                  <th width="30%">Providências</th>
                  <th width="20%">Prazo para regularização</th>
                </tr>
                </thead>
                <thead>
                <tr v-for="data in executadasparcial">
                  <!-- <td>
                    {{data.meta}}
                  </td> -->
                  <td class="justificativa-meta">
                    {{data.meta}} <span class="justificativa-atividade"><b>{{ data.atividade }}</b></span>
                  </td>
                  <td>
                    <div class="form-group required" :class="{ 'has-error' : errors.first('metaMotivo' + data.id)}">
                      <textarea :name="'metaMotivo' + data.id" v-model="data.motivo" rows="7" cols="5"
                                class="form-control" type="text" minlength="1"
                                :id="data.motivo + data.id"
                                :class="{ 'has-error' : errors.first('metaMotivo' + data.id)}"
                                v-validate="'required'" :disabled="ehVisualizacao"></textarea>
                    </div>
                  </td>
                  <td>
                    <div class="form-group required" :class="{ 'has-error' : errors.first('metaProvidencia' + data.id)}">
                      <textarea :name="'metaProvidencia' + data.id" v-model="data.providencia" rows="7" cols="5"
                                class="form-control form-group required" type="text" minlength="1"
                                :id="data.providencia + data.id"
                                :class="{ 'has-error' : errors.first('metaProvidencia' + data.id)}"
                                v-validate="'required'" :disabled="ehVisualizacao"></textarea>
                    </div>
                  </td>
                  <td>
                    <datepicker  type="date" :name="'metaPrazo_regularizacao' + data.id"  v-model="data.prazo_regularizacao_meta" :disabled="ehVisualizacao" input-class="form-control datepicker"
                                 :class="{ 'has-error' : errors.first('metaPrazo_regularizacao' + data.id)}" :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                 format="dd/MM/yyyy" v-validate="'required'">
                    </datepicker>
                    <!--<input type="date" :name="'metaPrazo_regularizacao' + data.id"  v-model="data.prazo_regularizacao" :disabled="ehVisualizacao" class="form-control" v-validate="'required'" :class="{ 'has-error' : errors.first('metaPrazo_regularizacao' + data.id)}" placeholder="__/__/____"/>-->
                  </td>
                </tr>
                </thead>

              </table>
              <table v-if="naoexecutadas.length" class="table table-condensed table-bordered table-striped" name="js2" id="js2" ref="js2">
                <thead>
                <tr style="background-color: #FFCDD2">
                  <th colspan="5">
                    <div align="center">
                      <i class="fa fa-exclamation fa-3"
                         aria-hidden="true"
                         style="color: red; margin-left: 10px; font-size: large; cursor: pointer;"></i>&nbsp Justificativa pela não execução da atividade</div></th>
                </tr>
                <tr>
                  <th width="20%">Meta</th>
                  <th width="20%">Atividade</th>
                  <th width="20%">Motivo</th>
                  <th width="20%">Providências</th>
                  <th width="20%">Prazo para regularização</th>
                </tr>
                </thead>
                <thead>
                <tr v-for="data in naoexecutadas">
                  <td>{{data.meta}}</td>
                  <td>{{data.atividade}}</td>
                  <td>
                    <div class="form-group required" :class="{ 'has-error' : errors.first('dataMotivo' + data.id)}">
                    <textarea :name="'dataMotivo' + data.id" v-model="data.motivo" rows="8" cols="6"
                              class="form-control" type="text" minlength="1"
                              :class="{ 'has-error' : errors.first('dataMotivo' + data.id)}"
                              :id="data.motivo + data.id" v-validate="'required'" :disabled="ehVisualizacao"
                    ></textarea></div>
                  </td>
                  <td>
                    <div class="form-group required" :class="{ 'has-error' : errors.first('dataProvidencia' + data.id)}">
                      <textarea :name="'dataProvidencia' + data.id" v-model="data.providencia" rows="8" cols="5"
                                class="form-control" type="text" minlength="1" :class="{ 'has-error' : errors.first('dataProvidencia' + data.id)}"
                                :id="data.providencia + data.id" v-validate="'required'" :disabled="ehVisualizacao"
                      ></textarea></div>
                  </td>
                  <td>
                    <div class="form-group required" :class="{ 'has-error' : errors.first('metaPrazo_regularizacao1' + data.id)}">
                      <datepicker  type="date" :name="'metaPrazo_regularizacao1' + data.id" v-model="data.prazo_regularizacao_atividade" :disabled="ehVisualizacao" input-class="form-control datepicker"
                                   :class="{ 'has-error' : errors.first('metaPrazo_regularizacao1' + data.id)}" :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____" startDate="1900-01-01"
                                   format="dd/MM/yyyy" v-validate="'required'">
                      </datepicker>
                      <!-- <input type="date" :name="'metaPrazo_regularizacao1' + data.id" v-model="data.prazo_regularizacao" :disabled="ehVisualizacao" v-validate="'required'" class="form-control" :class="{ 'has-error' : errors.first('metaPrazo_regularizacao1' + data.id)}" placeholder="__/__/____"/>-->
                    </div>
                    <!--<div class='input-group date' :id="dt1">-->
                    <!--<input type='text' class="form-control" :id="dt2" :name="data.prazo_regularizacao"/>-->
                    <!--<span class="input-group-addon">-->
                    <!--<span class="glyphicon glyphicon-calendar"></span>-->
                    <!--</span>-->
                    <!--</div>-->
                  </td>
                  <!--<th class="text-center">{{data3.meta}}</th>-->
                </tr>
                </thead>
              </table>
              <!--<div class="col-md-14">-->
              <!--<ganttRel v-if="false" :periodo="proposta.nr_periodos" :dataInicial="proposta.dt_data_inicial" :propsObjetivos="proposta.objetivos" :atividades="atvGantt"></ganttRel>-->
              <!--</div>-->

              <!-- Gantt de Atividades do projeto-->
              <div class="row">
                <visualiza-gantt :numeroProjeto="_.has($route.params.row, 'item') ? $route.params.row.item.numero : !_.isEmpty($route.params.row.projeto) ? $route.params.row.projeto.substring(0, 5) : ''" :tipoBarra="'declarado'" :mostrarExecFinanc="false" :mostrarExecDeclarada="true"></visualiza-gantt>
              </div>

            </div>

            <br>

            <div class="box box-default">
              <div class="box-header with-border">
                <h3 class="box-title"> Público-alvo:</h3>
              </div>
              <div class="box-body">
                <div class="row">
                  <div class="col-md-12">
                    <table class="table b-table table-hover table-bordered b-table-stacked-md">
                      <thead><tr><th >Publico</th><th class="centro">Previsto</th><th class="centro">Realizado</th></tr></thead>
                      <tbody><tr><td>Participantes</td><td class="centro">{{previstoPublicoAlvo.participantes}}</td><td class="centro">{{totalizadoresListaParticipantes.participantes}}</td></tr></tbody>
                      <tbody><tr><td>Jovens</td><td class="centro">{{previstoPublicoAlvo.jovens}}</td><td class="centro">{{totalizadoresListaParticipantes.jovens}}</td></tr></tbody>
                      <tbody><tr><td>Mulheres</td><td class="centro">{{previstoPublicoAlvo.mulheres}}</td><td class="centro">{{totalizadoresListaParticipantes.mulheres}}</td></tr></tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div class="box-header with-border">
              <!--<label class="control-label">Número de participantes previsto: <font style="color: blue;">{{telaRelatorio.numero_participantes.previsto}}</font></label>-->
              <!--<br>-->
              <!--<div class="row">-->
              <!--<div class="col-md-6 form-group required-field" :class="{ 'has-error' : errors.first('participantes')}">-->
              <!--<div class="col form-group">-->
              <!--<label class="control-label">Número de participantes envolvidos atualmente no projeto:</label>-->
              <!--<input v-validate="'required'" :disabled="visualizacao === 'VISUALIZAR'" type="text" name="participantes" v-model="telaRelatorio.numero_participantes.valor" class="form-control">-->
              <!--<span v-if="errors.first('participantes')" class="label label-danger"> {{('O campo Número de participantes é obrigatório') }}</span>-->
              <!--</div>-->
              <!--</div>-->

              <!--</div>-->
              <div class="box-header with-border col form-group required">
                <h3 class="box-title control-label"> Lista de Participantes: <label class="control-label"><font style="color: red; font-size: medium">*</font></label></h3>
                <!--<a :href="urlLaravel + '/docs/Lista de beneficiários.xlsx'"><i class="fa fa-download" aria-hidden="true"></i> conforme esse modelo</a>-->
              </div>
              <!--/.box-header-->
              <div class="box-body">
                <!--<div class="col-md-12 form-horizontal" v-if="visualizacao === 'VISUALIZAR'">-->
                <!--<upload-documentos-php :propDocumentos="telaRelatorio.numero_participantes.anexo_lista_participantes.row" :documentTypes="''" :disable="'true'" :localUso="listaDocParticipantes"></upload-documentos-php>-->
                <!--</div>-->
                <!--<div ref="listPartc" class="col-md-12 form-horizontal" v-if="visualizacao !== 'VISUALIZAR'" :class="{ 'has-error' : errors.first('listaUpload')}">-->
                <!--<upload-documentos-php  ref="listPartc" name="listPartc" :propDocumentos="telaRelatorio.numero_participantes.anexo_lista_participantes.row" :documentTypes="''" :disable="''" :localUso="listaDocParticipantes"></upload-documentos-php>-->
                <!--</div>-->
                <!--</div>-->
                <!-- 69906 - Definicao de publico alvo -->
                <listaParticipantes :propsParticipantes="telaRelatorio.numero_participantes.lista_participantes" :disable="desabilitar" :propsRelatorio="telaRelatorio" @participantesAdicionado="telaRelatorio.numero_participantes.lista_participantes = $event" @totalizadores="totalizadoresListaParticipantes = $event" :usuarioLogado="tipoUsu" :idRelatorio="this.$route.params.row.item.id" :idProposta="this.proposta.id"></listaParticipantes>
              </div>
            </div>

            <!-- Considerações Gerais -->
            <div class="col-md-12" style="margin-top:15px; padding:0px;">
              <div class="col form-group">
                <label class="control-label">Considerações:</label>
              </div><!-- /.box-header -->
              <div class="box-body" style="padding-top: 0px;">
                <div class="col form-group required">
                        	<textarea v-model="telaRelatorio.consideracoes_gerais.valor" :placeholder="'Relate fatos relativos às metas e atividades, não contemplados no relatório, que você julgar importante para compreensão da situação atual do projeto'" style="height:150px; resize:none;" name="dsConsGerais"
                                    :disabled="ehVisualizacao" class="form-control"></textarea>
                </div>
              </div>
            </div>
            <div class="row col-md-12">
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('execCronograma')}">
                <div class="col form-group required">
                  <label class="control-label">O cronograma físico-financeiro está sendo executado conforme previsto?</label>
                  <div class="row">
                    <div class="box-body" style="padding-top: 0px;">
                      <div class="row">
                        <div class="box-body" style="padding-top: 0px;">
                          <div class="col-md-2 form-group required">
                            <label class="new-control new-control-radio" style="padding-top: 8px;">
                              <input v-validate="'required'" :disabled="ehVisualizacao" type="radio" name="execCronograma" v-model="telaRelatorio.cronograma_conforme_previsto.resposta" value="SIM" class=""> Sim
                              <div class="new-control-indicator"></div>
                            </label>
                            <label class="new-control new-control-radio" style="padding-top: 8px;">
                              <input v-validate="'required'" type="radio":disabled="ehVisualizacao"  name="execCronograma" v-model="telaRelatorio.cronograma_conforme_previsto.resposta" value="NAO" class=""> Não
                              <div class="new-control-indicator"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div v-if="telaRelatorio.cronograma_conforme_previsto.resposta === 'NAO'">
                        <div class="col-md-12 form-group required" :class="{ 'has-error' : errors.first('justificativaCronograma')}">
                          <label style="margin-top: 0px; margin-bottom: 0px;font-size: 12px;" class="form-group control-label">Justifique</label>
                          <textarea v-validate="'required'" :disabled="ehVisualizacao"  v-model="telaRelatorio.cronograma_conforme_previsto.justificativa" style="height:150px; resize:none;" name="justificativaCronograma" class="form-control"></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-12" style="margin-top:15px; padding:0px;">

            <!-- 68198 - Comprovacao de contrapartida relatorio execucao X sapiens inconsistente -->
            <div class="box box-default">
              <div class="box-header with-border form-group required">
                <h3 class="box-title control-label">Contrapartida (em {{ this.formataData(this.$route.params.row.item.apresentado_em) }}):</h3>
              </div>
              <div class="box-body">
                <table  class="table table-condensed table-bordered table-striped text-center">
                  <thead>
                  <tr>
                    <th class="centro" width="20%">Item</th>
                    <th class="centro" width="20%">Orçado</th>
                    <th class="centro" width="20%">Realizado</th>
                    <th class="centro" width="20%">Atingimento</th>
                  </tr>
                  </thead>
                  <thead>
                  <tr v-for="contra in contrapartida">
                    <td class="text-center">{{contra.item}} - {{contra.item_descricao}}</td>
                    <td class="text-center">{{contra.orcado}}</td>
                    <td class="text-center">{{contra.realizado}}</td>
                    <td class="text-center" >{{contra.atingimento}}</td>
                  </tr>
                  </thead>
                </table>
              </div>
            </div>

            <!-- 68198 - Comprovacao de contrapartida relatorio execucao X sapiens inconsistente -->
            <div v-if="tipoUsu === 'FUNDACAO'" class="box box-default">
              <div class="box-header with-border form-group required">
                <h3 class="box-title control-label">Contrapartida (em {{this.formataData(new Date)}}):</h3>
              </div>
              <div class="box-body">
                <table  class="table table-condensed table-bordered table-striped text-center">
                  <thead>
                  <tr>
                    <th class="centro" width="20%">Item</th>
                    <th class="centro" width="20%">Orçado</th>
                    <th class="centro" width="20%">Saldo</th>
                    <th class="centro" width="20%">Atingimento</th>
                  </tr>
                  </thead>
                  <thead v-if="!this.loadingProposta" v-for="(atividade) in this.atividadesProposta">
                  <tr v-if="item.origem == 2" v-for="(item) in atividade.itens_orcamentos">
                    <td class="text-center">({{ item.item.ds_type }}) {{ item.item.ds_code }} - {{ item.item.ds_description }}</td>
                    <td class="text-center">R$ {{ item.valorOrcado | decimal2 }}</td>
                    <td class="text-center">R$ {{ item.valorSaldo | decimal2 }}</td>
                    <td class="text-center">{{ item.percAtingimento | percentage }}</td>
                  </tr>
                  </thead>
                </table>
                <div v-if="this.loadingProposta" class="contrapartida-loading">
                  carregando... <i class="fa fa-refresh fa-spin"></i>
                </div>
              </div>
            </div>

            <div class="form-group required-field">
              <label class="col control-label " > a) A contrapartida está sendo comprovada de acordo com o previsto no Plano de Trabalho?</label>
              <div class="col form-group required-field" :class="{ 'has-error' : errors.first('enumContApr')}">
                <label class="new-control new-control-radio" style="padding-top: 8px;">
                  <input type="radio"
                         name="enumContApr"
                         value="SIM"
                         v-validate="'required'"
                         :disabled="ehVisualizacao"
                         v-model="telaRelatorio.contrapartida_comprovada_previsto.resposta" required/> Sim
                  <div class="new-control-indicator"></div>
                </label>
                <label class="new-control new-control-radio" style="padding-top: 8px;">
                  <input type="radio"
                         name="enumContApr"
                         value="NAO"
                         v-validate="'required'"
                         :disabled="ehVisualizacao"
                         v-model="telaRelatorio.contrapartida_comprovada_previsto.resposta" required/> Não
                  <div class="new-control-indicator"></div>
                </label>
                <label class="new-control new-control-radio" style="padding-top: 8px;">
                  <input type="radio"
                         name="enumContApr"
                         value="PARCIALMENTE"
                         v-validate="'required'"
                         :disabled="ehVisualizacao"
                         v-model="telaRelatorio.contrapartida_comprovada_previsto.resposta" required/> Parcialmente
                  <div class="new-control-indicator"></div>
                </label>
                <br>
                <span v-if="errors.first('enumContApr')" class="label label-danger"> {{('O campo Comprovação de contrapartida é obrigatório') }}</span>
                <div v-if="telaRelatorio.contrapartida_comprovada_previsto.resposta !== 'SIM'">
                  <div class="col form-group required" :class="{ 'has-error' : errors.first('justContra')}">
                    <label style="margin-top: 0px; margin-bottom: 0px;font-size: 12px;" class="control-label">Justifique</label>
                    <textarea :disabled="ehVisualizacao" v-model="telaRelatorio.contrapartida_comprovada_previsto.justificativa" name="justContra" id="justContra" class="form-control" rows="7" cols="5" v-validate="'required'"></textarea>
                    <span v-if="errors.first('justContra')" class="label label-danger"> {{('O campo Número de participantes é obrigatório') }}</span>
                  </div>
                </div>
              </div>
              <br />

              <label for="telaRelatorio.comprovantes_enviados_fbb.resposta" class="col control-label">b) Os comprovantes disponíveis foram enviados à Fundação BB?</label>
              <div class="col form-group required" :class="{ 'has-error' : errors.first('contCompr')}">
                <label class="new-control new-control-radio" style="padding-top: 8px;">
                  <input type="radio" name="contCompr" value="SIM" :disabled="ehVisualizacao" v-validate="'required'"
                         v-model="telaRelatorio.comprovantes_enviados_fbb.resposta" required/> Sim
                  <div class="new-control-indicator"></div>
                </label>
                <label class="new-control new-control-radio" style="padding-top: 8px;">
                  <input type="radio" name="contCompr" value="NAO" :disabled="ehVisualizacao" v-validate="'required'"
                         v-model="telaRelatorio.comprovantes_enviados_fbb.resposta"  required/> Não
                  <div class="new-control-indicator"></div>
                </label>
                <br>
                <span v-if="errors.first('contCompr')" class="label label-danger"> {{('O campo Comprovantes disponíveis é obrigatório') }}</span>
              </div>
            </div>
            <!-- Divulgação -->
            <div class="col-md-12" style="margin-top:15px; padding:0px;">
              <div class="box box-default required">
                <div class="box-header with-border form-group required">
                  <h3 class="box-title control-label">Quais foram as ações de divulgação realizadas no Projeto?</h3>
                </div><!-- /.box-header -->
                <div class="row ">
                  <div class="box-body" style="padding-top: 0px;">
                    <div class="col-md-12">
                      <div class="col form-group required-field" :class="{ 'has-error' : errors.first('justDivulgacao')}">
                        <label class="control-label required">Descrição das ações:</label>
                        <textarea v-model="telaRelatorio.acoes_divulgacao_prevista.justificativa" :disabled="ehVisualizacao" required style="height:150px; resize:none;" v-validate="'required'" name="justDivulgacao" class="form-control"></textarea>
                        <span v-if="errors.first('justDivulgacao')" class="label label-danger"> {{('O campo Divulgações realizadas é obrigatório') }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- PERGUNTAS -->
            <div class="col-md-12 form-group required" style="margin-top:15px; padding:0px;">
              <div class="box box-default">
                <div class="box-header with-border">
                  <h3 class="box-title">Sustentabilidade do Projeto</h3>
                </div><!-- /.box-header -->
                <div class="box-body required-field" :class="{ 'has-error' : errors.first('comercializacao')}" style="padding-top: 0px;">
                  <label class="control-label">O Projeto contribui para a Comercialização da Produção?</label>
                  <h5>Caso a resposta tenha sido "SIM" marque abaixo o(os) canal(is) utilizado(os);</h5>
                  <h5>Caso a resposta tenha sido "NÃO" justifique;</h5>
                  <h5>Caso não esteja prevista a comercialização de produtos do empreendimento, marque a opção "NÃO SE APLICA".</h5>
                  <label class="new-control new-control-radio" style="padding-top: 8px;">
                    <input type="radio"  value="SIM" :disabled="ehVisualizacao"
                           v-model="telaRelatorio.comercializacao_producao.resposta" name="comercializacao" v-validate="'required'"
                           required/> Sim
                    <div class="new-control-indicator"></div>
                  </label>
                  <label class="new-control new-control-radio" style="padding-top: 8px;">
                    <input type="radio" value="NAO" :disabled="ehVisualizacao"
                           v-model="telaRelatorio.comercializacao_producao.resposta" name="comercializacao" v-validate="'required'"
                           required/> Não
                    <div class="new-control-indicator"></div>
                  </label>
                  <label class="new-control new-control-radio" style="padding-top: 8px;">
                    <input type="radio" value="NAO-SE-APLICA" :disabled="ehVisualizacao"
                           v-model="telaRelatorio.comercializacao_producao.resposta" name="comercializacao" v-validate="'required'"
                           required/> Não se aplica
                    <div class="new-control-indicator"></div>
                  </label>
                  <br>
                  <span v-if="errors.first('comercializacao')" class="label label-danger"> {{('O campo Comercialização é obrigatório') }}</span>
                </div>
                <div class="col-md-12 form-group required-field" v-if="telaRelatorio.comercializacao_producao.resposta === 'SIM'"
                     style="display: inline-grid; margin-top:10px;">
                  <div class="col-md-8 required-field"  id="com" ref="com" :class="{ 'has-error' : errors.first('acao')}">
                    <div class="col-md-8">
                      <label class="checkbox-inline new-control new-control-checkbox">
                        <input
                          type="checkbox"  :disabled="ehVisualizacao"
                          v-model="telaRelatorio.comercializacao_producao.canal.venda_na_propriedade"
                          :false-value="'NAO'"
                          class="form-control"
                          :true-value="'SIM'"
                          @click="mudaEstilo(telaRelatorio.comercializacao_producao.canal)"
                          name="acao" />Venda na Propriedade
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="checkbox-inline new-control new-control-checkbox">
                        <input
                          type="checkbox" :disabled="ehVisualizacao"
                          v-model="telaRelatorio.comercializacao_producao.canal.direto_ao_consumidor"
                          :false-value="'NAO'"
                          @click="mudaEstilo(telaRelatorio.comercializacao_producao.canal)"
                          :true-value="'SIM'" />Direito ao Consumidor
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="checkbox-inline new-control new-control-checkbox">
                        <input
                          type="checkbox" :disabled="ehVisualizacao"
                          v-model="telaRelatorio.comercializacao_producao.canal.programa_de_aquisição_de_alimentos_paa"
                          :false-value="'NAO'"
                          :true-value="'SIM'" />Programa de Aquisição de Alimentos - PAA
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                    <div class="col-md-8">
                      <label class="checkbox-inline new-control new-control-checkbox">
                        <input
                          type="checkbox" :disabled="ehVisualizacao"
                          v-model="telaRelatorio.comercializacao_producao.canal.feiras_livres"
                          :false-value="'NAO'"
                          @click="mudaEstilo(telaRelatorio.comercializacao_producao.canal)"
                          :true-value="'SIM'" />Feiras Livres
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="checkbox-inline new-control new-control-checkbox" style="margin-left: 69px;">
                        <input
                          type="checkbox" :disabled="ehVisualizacao"
                          v-model="telaRelatorio.comercializacao_producao.canal.mercadinhos"
                          :false-value="'NAO'"
                          @click="mudaEstilo(telaRelatorio.comercializacao_producao.canal)"
                          :true-value="'SIM'" />Mercadinhos
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="checkbox-inline new-control new-control-checkbox" style="margin-left: 68px;">
                        <input
                          type="checkbox" :disabled="ehVisualizacao"
                          v-model="telaRelatorio.comercializacao_producao.canal.programa_nacional_de_alimentação_escolar_pnae"
                          :false-value="'NAO'"
                          @click="mudaEstilo(telaRelatorio.comercializacao_producao.canal)"
                          :true-value="'SIM'" />Programa Nacional de Alimentação Escolar -PNAE
                        <div class="new-control-indicator"></div>
                      </label>

                    </div>
                    <div class="col-md-8">
                      <label class="checkbox-inline new-control new-control-checkbox">
                        <input
                          type="checkbox"  :disabled="ehVisualizacao"
                          v-model="telaRelatorio.comercializacao_producao.canal.feiras_agroecológicas"
                          :false-value="'NAO'"
                          @click="mudaEstilo(telaRelatorio.comercializacao_producao.canal)"
                          :true-value="'SIM'" />Feiras Agroecológicas
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="checkbox-inline new-control new-control-checkbox" style="margin-left: 13px;">
                        <input
                          type="checkbox" :disabled="ehVisualizacao"
                          v-model="telaRelatorio.comercializacao_producao.canal.atravessadores"
                          :false-value="'NAO'"
                          @click="mudaEstilo(telaRelatorio.comercializacao_producao.canal)"
                          :true-value="'SIM'" />Atravessadores
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="checkbox-inline new-control new-control-checkbox" style="margin-left: 55px;">
                        <input
                          type="checkbox" :disabled="ehVisualizacao"
                          v-model="telaRelatorio.comercializacao_producao.canal.outros_canais_de_comercialização"
                          :false-value="'NAO'"
                          @click="mudaEstilo(telaRelatorio.comercializacao_producao.canal)"
                          :true-value="'SIM'" />Outros canais de comercialização
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="box-body form-group required" v-if="telaRelatorio.comercializacao_producao.resposta === 'NAO'"  :class="{ 'has-error' : errors.first('considera1')}">
                  <h5 class="control-label">Considerações :</h5>
                  <textarea v-model="telaRelatorio.comercializacao_producao.justificativa" @change="mudaEstilo" style="height:150px; resize:none;" ref="considera1" name="considera1" :disabled="ehVisualizacao" v-validate="'required'"
                            class="form-control"></textarea>
                </div>
              </div>
              <div class="col-md-12 " style="margin-top:15px; padding:0px;">
                <div class="box box-solid box-default required">
                  <div class="box-header with-border required">
                    <h5 style="text-align: center;"><b>RESPONDA AS QUESTÕES ABAIXO ATRIBUINDO A SEGUINTE ESCALA DE PONTUAÇÃO:</b></h5>
                    <h5 class="control-label" style="text-align: center;"><b>(1) Nem um Pouco (2) Um Pouco (3) Razoavelmente (4) Bastante (5) Totalmente</b></h5>
                  </div>
                  <!-- Pergunta 1 -->
                  <div class="box box-default form-group required" :class="{ 'has-error' : errors.first('questao1')}">
                    <div class="box-header with-border form-group required-field" style="background-color: #F2F3F4">
                      <label class="control-label">
                        O Projeto contribui para o desenvolvimento de novos conhecimentos/habilidades?
                      </label>
                    </div>
                    <div class="box-body form-group required" style="padding-top: 1px;" :class="{ 'has-error' : errors.first('questao1')}">
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao1" value="1" :disabled="ehVisualizacao"
                               v-model="telaRelatorio.questionario.questao_1.resposta" v-validate="'required'"
                               required/> 1
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao1" value="2"
                               v-model="telaRelatorio.questionario.questao_1.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 2
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao1" value="3"
                               v-model="telaRelatorio.questionario.questao_1.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 3
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao1" value="4"
                               v-model="telaRelatorio.questionario.questao_1.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 4
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao1" value="5"
                               v-model="telaRelatorio.questionario.questao_1.resposta"  :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 5
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                    <div class="box-body form-group required" :class="{ 'has-error' : errors.first('consideracaoQ1')}">
                      <textarea v-model="telaRelatorio.questionario.questao_1.consideracoes" :placeholder="'Comente sobre as ações desenvolvidas visando o aprimoramento e/ou o desenvolvimento de novas capacidades.'" style="height:150px; resize:none;" name="consideracaoQ1" :disabled="ehVisualizacao" v-validate="'required'"
                                class="form-control"></textarea>
                    </div>
                  </div>
                  <!-- Pergunta 2 -->
                  <div class="box box-default required">
                    <div class="box-header with-border form-group required-field" style="background-color: #F2F3F4">
                      <label class="control-label">
                        O Projeto contribui para o envolvimento de mulheres e jovens?
                      </label>
                    </div>
                    <div class="box-body form-group required" style="padding-top: 1px;" :class="{ 'has-error' : errors.first('questao2')}">
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao2" value="1"
                               v-model="telaRelatorio.questionario.questao_2.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 1
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao2" value="2"
                               v-model="telaRelatorio.questionario.questao_2.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 2
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao2" value="3"
                               v-model="telaRelatorio.questionario.questao_2.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 3
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao2" value="4"
                               v-model="telaRelatorio.questionario.questao_2.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 4
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao2" value="5"
                               v-model="telaRelatorio.questionario.questao_2.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 5
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                    <div class="box-body form-group required" :class="{ 'has-error' : errors.first('consideracaoQ2')}">
                      <textarea v-model="telaRelatorio.questionario.questao_2.consideracoes"  :placeholder="'Comente sobre as ações desenvolvidas que contribuem para o protagonismo de mulheres e jovens ou relate sobre as dificuldades encontradas.'" style="height:150px; resize:none;" name="consideracaoQ2" :disabled="ehVisualizacao" v-validate="'required'"
                                class="form-control"></textarea>
                    </div>
                  </div>
                  <!-- Pergunta 3 -->
                  <div class="box box-default required">
                    <div class="box-header with-border form-group required-field" style="background-color: #F2F3F4">
                      <label class="control-label">O Projeto contribui para a formação de novas parcerias além da Fundação Banco do Brasil?</label>
                    </div>
                    <div class="box-body form-group required" style="padding-top: 1px;" :class="{ 'has-error' : errors.first('questao3')}">
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao3" value="1"
                               v-model="telaRelatorio.questionario.questao_3.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 1
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao3" value="2"
                               v-model="telaRelatorio.questionario.questao_3.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 2
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao3" value="3"
                               v-model="telaRelatorio.questionario.questao_3.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 3
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao3" value="4"
                               v-model="telaRelatorio.questionario.questao_3.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 4
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao3" value="5"
                               v-model="telaRelatorio.questionario.questao_3.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 5
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                    <div class="box-body form-group required" :class="{ 'has-error' : errors.first('consideracaoQ3')}">
                      <textarea v-model="telaRelatorio.questionario.questao_3.consideracoes" :placeholder="'Comente sobre as ações desenvolvidas visando novas parcerias ou relate sobre as dificuldades encontradas'" style="height:150px; resize:none;" name="consideracaoQ3" :disabled="ehVisualizacao" v-validate="'required'"
                                class="form-control"></textarea>
                    </div>
                  </div>
                  <!-- Pergunta 4 -->
                  <div class="box box-default required">
                    <div class="box-header with-border form-group required-field" style="background-color: #F2F3F4">
                      <label class="control-label">O Projeto contribui para o surgimento de novas oportunidades de trabalho e/ou renda?</label>
                    </div>
                    <div class="box-body form-group required" style="padding-top: 1px;" :class="{ 'has-error' : errors.first('questao4')}">
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao4" value="1"
                               v-model="telaRelatorio.questionario.questao_4.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 1
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao4" value="2"
                               v-model="telaRelatorio.questionario.questao_4.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 2
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao4" value="3"
                               v-model="telaRelatorio.questionario.questao_4.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 3
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao4" value="4"
                               v-model="telaRelatorio.questionario.questao_4.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 4
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao4" value="5"
                               v-model="telaRelatorio.questionario.questao_4.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 5
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                    <div class="box-body form-group required" :class="{ 'has-error' : errors.first('consideracaoQ4')}">
                      <textarea v-model="telaRelatorio.questionario.questao_4.consideracoes" :placeholder="'Comente sobre as novas oportunidades, a quantidade de pessoas e as áreas de atuação, ou relate as dificuldades.'" style="height:150px; resize:none;" name="consideracaoQ4" :disabled="ehVisualizacao" v-validate="'required'"
                                class="form-control"></textarea>
                    </div>
                  </div>
                  <!-- Pergunta 5 -->
                  <div class="box box-default required">
                    <div class="box-header with-border form-group required" style="background-color: #F2F3F4">
                      <label class="control-label">O Projeto contribui para a preservação do meio ambiente e o cuidado ambiental?</label>
                    </div>
                    <div class="box-body form-group required-field" style="padding-top: 0px;" :class="{ 'has-error' : errors.first('questao5')}">
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao5" value="1"
                               v-model="telaRelatorio.questionario.questao_5.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 1
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao5" value="2"
                               v-model="telaRelatorio.questionario.questao_5.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 2
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao5" value="3"
                               v-model="telaRelatorio.questionario.questao_5.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 3
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao5" value="4"
                               v-model="telaRelatorio.questionario.questao_5.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 4
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao5" value="5"
                               v-model="telaRelatorio.questionario.questao_5.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 5
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                    <div class="box-body form-group" :class="{ 'has-error' : errors.first('consideracaoQ5')}">
                      <textarea  v-model="telaRelatorio.questionario.questao_5.consideracoes"  :placeholder="'Comente sobre as práticas adotadas e os resultados alcançados, ou relate as dificuldades'" style="height:150px; resize:none;" name="consideracaoQ5" :disabled="ehVisualizacao" v-validate="'required'"
                                 class="form-control"></textarea>
                    </div>
                  </div>
                  <!-- Pergunta 6 -->
                  <div class="box box-default required">
                    <div class="box-header with-border form-group required" style="background-color: #F2F3F4">
                      <label class="control-label">O Projeto contribui para a valorização de questões relativas a direitos humanos?</label>
                    </div>
                    <div class="box-body form-group required-field" style="padding-top: 0px;" :class="{ 'has-error' : errors.first('questao6')}">
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao6" value="1"
                               v-model="telaRelatorio.questionario.questao_6.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 1
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao6" value="2"
                               v-model="telaRelatorio.questionario.questao_6.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 2
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao6" value="3"
                               v-model="telaRelatorio.questionario.questao_6.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 3
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao6" value="4"
                               v-model="telaRelatorio.questionario.questao_6.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 4
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="questao6" value="5"
                               v-model="telaRelatorio.questionario.questao_6.resposta" :disabled="ehVisualizacao"
                               v-validate="'required'"
                               required/> 5
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                    <div class="box-body form-group required" :class="{ 'has-error' : errors.first('consideracaoQ6')}">
                      <textarea v-model="telaRelatorio.questionario.questao_6.consideracoes" :placeholder="'Comente sobre as ações realizadas contra a discriminação, desigualdade de gênero, trabalho escravo ou infantil, exploração sexual, etc, ou relate as dificuldades encontradas.'" style="height:150px; resize:none;" name="consideracaoQ6" :disabled="ehVisualizacao" v-validate="'required'"
                                class="form-control"></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- PERGUNTAS -->
            <!-- Social Impact -->
            <div class="col-md-12" style="margin-top:15px; padding:0px;">
              <div class="box box-default">
                <div class="box-header with-border">
                  <h3 class="box-title">Objeto do Convênio:</h3>
                </div><!-- /.box-header -->
                <div v-if="telaRelatorio.objeto_convenio.valor.length > 0" class="box-body" style="padding-top: 0px;">
                  <label class="control-label col">{{telaRelatorio.objeto_convenio.valor}}</label>
                </div>
                <div v-else class="box-body" style="padding-top: 0px;">
                  <label class="control-label col">Objeto não cadastrado</label>
                </div>
              </div>
            </div>

            <div class="col-md-12 required" style="margin-top:15px; padding:0px;">
              <div class="box box-default required-field">
                <div class="box-header with-border form-group required-field">
                  <h3 class="box-title control-label">Informar como está o desenvolvimento do Objeto do Convênio: <label><font style="color: red; font-size: medium">*</font></label></h3>
                </div><!-- /.box-header -->
                <div class="box-body">
                  <div class="col form-group required" :class="{ 'has-error' : errors.first('objetoConvenioTexto')}">
                        	<textarea v-model="telaRelatorio.desenvolvimento_objeto_convenio.valor" style="height:150px; resize:none;" name="objetoConvenioTexto" :disabled="ehVisualizacao" v-validate="'required'"
                                    class="form-control" required></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-12" style="margin-top:15px; padding:0px;">
              <div class="box box-default">
                <div class="box-header with-border form-group required">
                  <h3 class="box-title control-label">Informar sobre o alcance dos Objetivos do projeto:<label><font style="color: red; font-size: medium">&nbsp*</font></label></h3>
                </div><!-- /.box-header -->
                <div class="box-body">
                  <table  class="table table-condensed table-bordered table-striped text-center">
                    <thead>
                    <tr style="background-color: #F2F3F4">
                      <th class="text-center"  width="20%">Item</th>
                      <th class="centro" width="20%">Descrição</th>
                      <th class="centro control-label" width="20%" >Realizado</th>
                    </tr>
                    </thead>
                    <thead>
                    <tr v-for="objProj in telaRelatorio.objetivos_projeto.row">

                      <td data-title="'Item'" sortable="'item'" class="text-center" width="20%">{{objProj.item}}</td>
                      <td data-title="'Descrição'" sortable="'description'" class="text-center" width="40%">{{objProj.descricao}}</td>

                      <!--<td ng-if="achProExeRepCrtl.isApproval" data-title="'Realizado'" sortable="'realized'" class="text-center" width="40%">{{objProj.realizado}}</td>-->
                      <td data-title="'Realizado'" sortable="'realizado'"  width="40%">
                        <div class="form-group required" :class="{ 'has-error' : errors.first('descRealizado')}">
	                        <textarea v-model="objProj.realizado" name="descRealizado" :disabled="ehVisualizacao" v-validate="'required'" rows="5" cols="5"
                                    class="form-control" type="text" minlength="1" required></textarea>
                        </div>
                      </td>
                    </tr>
                    </thead>
                    <tr v-show="(telaRelatorio.objetivos_projeto.row.length === 0)">
                      <td colspan="7" class="text-center">Nenhum registro encontrado!</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            <!-- Resultados -->
            <div class="col-md-12" style="margin-top:15px; padding:0px;">
              <div class="box box-default">
                <div class="box-header with-border form-group required">
                  <h3 class="box-title control-label">Resultados alcançados até o momento:<label><font style="color: red; font-size: medium">&nbsp*</font></label></h3>
                </div><!-- /.box-header -->
                <div class="box-body">
                  <div class="col form-group required" :class="{ 'has-error' : errors.first('dsResultado')}">
                        	<textarea v-model="telaRelatorio.resultados_alcancados.valor" :placeholder="'Informar os benefícios aos participantes que já podem ser mensurados.'" style="height:150px; resize:none;" name="dsResultado" v-validate="'required'"
                                    :disabled="ehVisualizacao" class="form-control"  required></textarea>
                  </div>
                </div>
              </div>
            </div>
            <!-- Depoimentos / Anexos -->
            <div class="col-md-12" style="margin-top:15px; padding:0px;">
              <div class="box box-default">
                <div class="box-header with-border form-group required">
                  <h3 class="box-title control-label">Depoimentos:<label><font style="color: red; font-size: medium">&nbsp*</font></label></h3>
                </div><!-- /.box-header -->
                <div class="box-body">
                  <div class="col form-group required" :class="{ 'has-error' : errors.first('dsDepoimentos')}">

                        	<textarea v-model="telaRelatorio.depoimentos.valor" :placeholder="'Insira aqui depoimentos sobre os resultados e impactos do projeto, outros aspectos considerados relevantes, prestados por beneficiários, parceiros ou membros da equipe responsável pelo projeto. Esses depoimentos (ou trechos) poderão ser utilizados pela Fundação para divulgação interna e externa.'" style="height:150px; resize:none;" name="dsDepoimentos"
                                    v-validate="'required'" :disabled="ehVisualizacao" class="form-control"  required></textarea>

                  </div>

                  <div class="form-horizontal">
                    <div class="col-md-12">
                      <legend>Modelos de documentos:</legend>
                      <div class="box-body">
                        <div class="col-md-12 form-horizontal">
                          <ul style="list-style: none">
                            <li><a :href="urlLaravel + '/docs/modelo_cursos_e_capacitacoes.xls'" download><i class="fa fa-download" aria-hidden="true"></i> Cursos e Capacitações</a></li>
                            <li><a :href="urlLaravel + '/docs/modelo_relacao_de_bens.doc'" download><i class="fa fa-download" aria-hidden="true"></i> Relação de Bens</a></li>
                            <li><a :href="urlLaravel + '/docs/modelo_termo_de_designacao.docx'"><i class="fa fa-download" aria-hidden="true"></i> Termo de Designação</a></li>
                            <li><a :href="urlLaravel + '/docs/modelo_termo_de_recebimento_de_obra_civil.docx'"><i class="fa fa-download" aria-hidden="true"></i> Termo de Recebimento de Obra Civil</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="form-horizontal">
                    <div class="col-md-12">
                      <legend>Anexos diversos:
                        <span v-if="!ehVisualizacao" style="font-size: 14px;font-style: italic;margin-left: 10px;color: var(--cor-atencao-dark);">Obrigatório anexar e informar data de vigência dos documentos: CNEP/CEPIM e CNDT</span>
                      </legend>
                        <div v-if="ehVisualizacao">
                          <upload-documentos-php-novo :propDocumentos="telaRelatorio.anexos_diversos.row" :documentTypes="''" :disable="'true'" :localUso="listaDocDiversos" :salvouOK="salvouOK"></upload-documentos-php-novo>
                        </div>
                        <div v-if="!ehVisualizacao">
                          <upload-documentos-php-novo :propDocumentos="telaRelatorio.anexos_diversos.row" :documentTypes="''" :disable="''" :localUso="listaDocDiversos" :salvouOK="salvouOK"></upload-documentos-php-novo>
                        </div>
                    </div>
                  </div>

                  <div v-if="tipoUsu === 'FUNDACAO'" class="col-md-12">
                    <fieldset>
                      <legend>Histórico:</legend>
                      <div class="box-body">
                        <table  class="table table-condensed table-bordered table-striped text-center">
                          <thead>
                          <tr class="text-center">
                            <th class="text-center" width="20%">Nome da Tarefa</th>
                            <th class="text-center" width="20%">Data da execução da tarefa</th>
                            <th class="text-center" width="20%">Justificativa em caso de devolução</th>
                            <th class="text-center" width="20%">Usuário que executou a tarefa</th>
                          </tr>
                          </thead>
                          <thead>
                          <tr v-for="hist in historicoRelatorio">
                            <td class="text-center">{{hist.etapa}}</td>
                            <td class="text-center">{{hist.concluído_em}}</td>
                            <td class="text-center">{{hist.justificativa}}</td>
                            <td class="text-center" >{{hist.usuário}}</td>
                          </tr>
                          </thead>
                        </table>
                      </div>
                    </fieldset>
                  </div>

                </div>
              </div>
            </div>
            <!-- Conclusão-->
            <div class="col-md-12" v-if="(tipoUsu === 'FUNDACAO' && sit === 'VALIDAR') || ehVisualizacao">
              <div class="box box-primary" v-if="tipoUsu === 'FUNDACAO'">
                <div class="box-header with-border">
                  <h6 class="box-title" style="text-align:center">Conclusão do relatório</h6>
                </div>
                <div class="box-body">
                  <div class="row">
                    <div class="col-md-12 form-group required" :class="{ 'has-error' : errors.first('conclusao')}">
                      <div class="col-md-12">
                        <label class="new-control new-control-radio" style="padding-top: 8px;">
                          <input type="radio" name="conclusao" value="APROVADO" :disabled="ehVisualizacao" v-model="telaRelatorio.resultadoAprovacao" v-validate="'required'" /> Aprovar
                          <div class="new-control-indicator"></div>
                        </label>
                      </div>
                      <div class="col-md-12">
                        <label class="new-control new-control-radio" style="padding-top: 8px;">
                          <input type="radio" name="conclusao" value="REVISAO" :disabled="ehVisualizacao"  v-validate="'required'" @change="atualizaComponente" v-model="telaRelatorio.resultadoAprovacao"/> Enviar para Revisão
                          <div class="new-control-indicator"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div style="margin-top:15px;"
                       v-if="telaRelatorio.resultadoAprovacao != undefined && telaRelatorio.resultadoAprovacao != 'APROVADO'"
                       class="col-md-12 form-group required"
                  >
                    <label class="col control-label" uib-tooltip="Informe aqui as considerações da decisão acima">Considerações (para a entidade)</label> <em class="text-light"> (Limitado a 2.000 caracteres)</em>
                    <textarea v-model="telaRelatorio.justificativa_devolucao.valor" style="height:150px; resize:none;" maxlength="2000" v-on:keyup="countdown" name="dsReportApr" class="form-control" required></textarea>
                    <p class='text-right text-small' v-bind:class="{'text-danger': hasError }">{{remainingCount}}</p>
                  </div>
                  <div style="margin-top:15px;" :class="{ 'has-error' : errors.first('dsObsFbb')}"
                       v-if="telaRelatorio.resultadoAprovacao === 'APROVADO' && telaRelatorio.resultadoAprovacao != undefined"
                       class="col-md-12 form-group required"
                  >
                    <label class="col control-label" uib-tooltip="Informe aqui as considerações da decisão acima">Parecer Fundação BB:<font style="color: red; font-size: medium">&nbsp*</font></label>
                    <textarea v-model="telaRelatorio.parecer_fbb.valor" style="height:150px; resize:none;" name="dsObsFbb" maxlength="700" v-validate="'required'" :placeholder="'Insira seu parecer elencando as dificuldades e suas causas, destaques positivos quanto às metas e aos resultados e outros aspectos considerados relevantes'"
                              class="form-control" :disabled="ehVisualizacao"></textarea>
                  </div>

                  <div class="row">
                    <div class="col-md-12 form-group" v-if="telaRelatorio.resultadoAprovacao === 'APROVADO' && telaRelatorio.resultadoAprovacao != undefined && tipoUsu === 'FUNDACAO'">
                    <div class="box-header">
                      <h3 class="box-title">Encaminhamentos:</h3>
                    </div>
                    <div class="indicadores-cb-inline">
                      <div class="col-md-12">
                        Há restrição em:
                        <div style="margin: 0 10px;">
                          <i v-if="ehVisualizacao" :class="telaRelatorio.encaminhamento_restricao_cepim === 'NAO' ? 'fa fa-square-o' : 'fa fa-check-square-o'" style="color: var(--cor-fraca)"></i>
                          <i v-else @click="telaRelatorio.encaminhamento_restricao_cepim = (telaRelatorio.encaminhamento_restricao_cepim === 'SIM' ? 'NAO' : 'SIM')" :class="telaRelatorio.encaminhamento_restricao_cepim === 'SIM' ? 'fa fa-check-square-o selecionado' : 'fa fa-square-o'" aria-hidden="true"></i>
                          CNEP/CEPIM
                        </div>
                        <div style="margin: 0 10px;">
                          <i v-if="ehVisualizacao" :class="telaRelatorio.encaminhamento_restricao_cndt === 'NAO' ? 'fa fa-square-o' : 'fa fa-check-square-o'" style="color: var(--cor-fraca)"></i>
                          <i v-else @click="telaRelatorio.encaminhamento_restricao_cndt = (telaRelatorio.encaminhamento_restricao_cndt === 'SIM' ? 'NAO' : 'SIM')" :class="telaRelatorio.encaminhamento_restricao_cndt === 'SIM' ? 'fa fa-check-square-o selecionado' : 'fa fa-square-o'" aria-hidden="true"></i>
                          CNDT
                        </div>
                        <!--<div style="margin: 0 10px;">-->
                          <!--<i v-if="ehVisualizacao" :class="telaRelatorio.encaminhamento_restricao_cadin === 'NAO' ? 'fa fa-square-o' : 'fa fa-check-square-o'" style="color: var(&#45;&#45;cor-fraca)"></i>-->
                          <!--<i v-else @click="telaRelatorio.encaminhamento_restricao_cadin = (telaRelatorio.encaminhamento_restricao_cadin === 'SIM' ? 'NAO' : 'SIM')" :class="telaRelatorio.encaminhamento_restricao_cadin === 'SIM' ? 'fa fa-check-square-o selecionado' : 'fa fa-square-o'" aria-hidden="true"></i>-->
                          <!--CADIN-->
                        <!--</div>-->
                        <div style="margin: 0 10px;" v-if="!ehVisualizacao && (telaRelatorio.encaminhamento_restricao_cepim === 'SIM' || telaRelatorio.encaminhamento_restricao_cndt === 'SIM')">
                          <label class="label label-warning">Será encaminhado e-mail, registrada a anotação 2422 - Certidão com restrição e aberto chamado para acompanhamento da ocorrência</label>
                        </div>
                      </div>
                      <!--<div class="col-md-12">-->
                        <!--<i v-if="ehVisualizacao" :class="telaRelatorio.encaminhamento_notificacao_extrajudicial === 'NAO' ? 'fa fa-square-o' : 'fa fa-check-square-o'" style="color: var(&#45;&#45;cor-fraca)"></i>-->
                        <!--<i v-else @click="telaRelatorio.encaminhamento_notificacao_extrajudicial = (telaRelatorio.encaminhamento_notificacao_extrajudicial === 'SIM' ? 'NAO' : 'SIM')" :class="telaRelatorio.encaminhamento_notificacao_extrajudicial === 'SIM' ? 'fa fa-check-square-o selecionado' : 'fa fa-square-o'" aria-hidden="true"></i>-->
                        <!--Enviar notificação extrajudicial: <a :href="urlLaravel + '/docs/notificacao_extrajudicial_novo_modelo.doc'" style="font-style:italic">clique aqui</a> para baixar o modelo do ofício (após preenchido e assinado pelo gerente, enviar o documento físico por correio e digitalizado por e-mail)-->
                      <!--</div>-->
                      <!--<div class="col-md-12">-->
                        <!--<i v-if="ehVisualizacao" :class="telaRelatorio.encaminhamento_email_agencia_parceiro === 'NAO' ? 'fa fa-square-o' : 'fa fa-check-square-o'" style="color: var(&#45;&#45;cor-fraca)"></i>-->
                        <!--<i v-else @click="telaRelatorio.encaminhamento_email_agencia_parceiro = (telaRelatorio.encaminhamento_email_agencia_parceiro === 'SIM' ? 'NAO' : 'SIM')" :class="telaRelatorio.encaminhamento_email_agencia_parceiro === 'SIM' ? 'fa fa-check-square-o selecionado' : 'fa fa-square-o'" aria-hidden="true"></i>-->
                        <!--Enviar e-mail parceiro e agência comunicando a aprovação do relatório (automatizado)-->
                      <!--</div>-->
                      <!--<div class="col-md-12">-->
                        <!--<i v-if="ehVisualizacao" :class="telaRelatorio.encaminhamento_monitoramento === 'NAO' ? 'fa fa-square-o' : 'fa fa-check-square-o'" style="color: var(&#45;&#45;cor-fraca)"></i>-->
                        <!--<i v-else @click="telaRelatorio.encaminhamento_monitoramento = (telaRelatorio.encaminhamento_monitoramento === 'SIM' ? 'NAO' : 'SIM')" :class="telaRelatorio.encaminhamento_monitoramento === 'SIM' ? 'fa fa-check-square-o selecionado' : 'fa fa-square-o'" aria-hidden="true"></i>-->
                        <!--Encaminhar para monitoramento in loco-->
                      <!--</div>-->
                      <!--<div class="col-md-12">-->
                        <!--<i v-if="ehVisualizacao" :class="telaRelatorio.encaminhamento_visita_agencia === 'NAO' ? 'fa fa-square-o' : 'fa fa-check-square-o'" style="color: var(&#45;&#45;cor-fraca)"></i>-->
                        <!--<i v-else @click="telaRelatorio.encaminhamento_visita_agencia = (telaRelatorio.encaminhamento_visita_agencia === 'SIM' ? 'NAO' : 'SIM')" :class="telaRelatorio.encaminhamento_visita_agencia === 'SIM' ? 'fa fa-check-square-o selecionado' : 'fa fa-square-o'" aria-hidden="true"></i>-->
                        <!--Solicitar visita da agência ao projeto – neste caso, o e-mail NÃO irá de forma automatizada-->
                      <!--</div>-->
                    </div>
                  </div>
                  </div>

                  <div class="row">
                    <div class="col-md-12"><hr/></div>

                    <div class="col-md-12" v-if="tipoUsu === 'FUNDACAO' && (telaRelatorio.resultadoAprovacao === 'APROVADO' || telaRelatorio.resultadoAprovacao === 'REVISAO')">
                      <div class="box-header">
                        <h3 class="box-title">Registrar ocorrência no projeto referente à análise do relatório:
                          <span v-if="telaRelatorio.resultadoAprovacao === 'REVISAO'">Revisão</span>
                          <span v-if="telaRelatorio.resultadoAprovacao === 'APROVADO'">Aprovado</span>
                        </h3>
                      </div>


                      <span v-if="loading.projetoEntidadeOcorrencia || loading.listaOcorrencias">
                        <div class="col-md-12"><span class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando dados de projeto, entidade e lista de ocorrências...</span></div>
                      </span>
                      <span v-else>
                        <!-- Lista de ocorrencias --------------------------------------------------------------------------------------->
                        <div class="" v-if="_.isEmpty(ocorrenciaEditando)">
                          <div class="col-md-12">
                            <!-- Botão para nova ocorrência -->
                            <g-button-ujarak color="primary" size="button--size-ss" @click.native="novaOcorrencia" v-if="!ehVisualizacao"><i class="fa fa-plus-circle" aria-hidden="true"></i> Nova Ocorrência</g-button-ujarak>

                          </div>

                          <div class="col-md-12">&nbsp;</div> <!--Linha em branco-->

                          <div class="col-md-12">
                            <!-- Tabela com ocorrências -->
                            <table class="table table-condensed table-bordered">
                              <thead>
                              <tr>
                                <th class="centralizado">ID</th>
                                <th class="centralizado">Código</th>
                                <th class="centralizado">Tipo</th>
                                <th class="centralizado">Observação</th>
                                <th class="centralizado" v-if="!ehVisualizacao">Ação</th>
                              </tr>
                              </thead>
                              <tbody>
                              <template v-if="telaRelatorio.ocorrencias.length > 0">
                                <tr v-for="(ocorrencia, idx) in telaRelatorio.ocorrencias">
                                  <td style="width: 100px;" class="text-bold centralizado">{{ ocorrencia.id }}</td>
                                  <td style="width: 200px;">
                                    <div class="truncar" style="width: 200px;">
                                      {{ ocorrencia.enquadramento.codigo }} - {{ ocorrencia.enquadramento.descricao }}
                                    </div>
                                  </td>
                                  <td class="centralizado" style="width: 100px">{{ ocorrencia.tipo }}</td>
                                  <td>{{ ocorrencia.observacao }}</td>
                                  <td style="width: 170px;" class="centralizado" v-if="!ehVisualizacao">
                                    <g-button-ujarak color="primary" size="button--size-ss" @click.native="editaOcorrencia(idx)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</g-button-ujarak>
                                    <g-button-ujarak color="error" size="button--size-ss" @click.native="excluiOcorrencia(idx)"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</g-button-ujarak>
                                  </td>
                                </tr>
                              </template>
                              <template v-else>
                                <tr><td colspan="5">Nenhuma ocorrência para ser gerada!</td></tr>
                              </template>
                              </tbody>
                            </table>
                          </div>

                          <div class="col-md-12">
                            <!-- Sumário e Observações do que vai ser processado ou do resultado do processamento -->
                          </div>

                        </div>

                        <!-- Edição/Inclusão de ocorrencias --------------------------------------------------------------------------------------->
                        <div class="col-md-12 well" v-if="!_.isEmpty(ocorrenciaEditando)">

                        <div class="form-horizontal">

                          <div class="form-group">
                            <div class="required-field">
                              <label class="control-label col-md-2">Tipo:</label>
                              <div class="col-md-10">
                                <input type="radio" v-model="ocorrenciaEditando.tipo" name="tipoOcorrencia" :value="'PROJETO'" :disabled="ehVisualizacao"/> Projeto
                                <div class="espacamento_botoes"></div>
                                <input type="radio" v-model="ocorrenciaEditando.tipo" name="tipoOcorrencia" :value="'ENTIDADE'" :disabled="ehVisualizacao"/> Entidade
                                <span class="pull-right text-blue">
                                <span v-if="ocorrenciaEditando.tipo === 'PROJETO'"> Essa ocorrência será registrada no projeto <strong>{{ telaRelatorio.cabecalho.numero_projeto }}</strong></span>
                                <span v-if="ocorrenciaEditando.tipo === 'ENTIDADE'"> Essa ocorrência será registrada na entidade <strong>{{ telaRelatorio.cabecalho.entidade }}</strong></span>
                              </span>
                              </div>
                            </div>
                          </div>

                          <div class="form-group">
                            <div class="required-field" :class="{ 'has-error' : errors.first('codigo_ocorrencia')}">
                              <label class="control-label col-md-2">Código:</label>
                              <div class="col-md-10" v-if="loading.listaOcorrencias"><span class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando lista de ocorrências...</span></div>
                              <div class="col-md-10" v-else>

                                <multiselect v-model="ocorrenciaEditando.enquadramento"
                                             :options="_.orderBy(_.filter(listaTiposOcorrencias, function(o) { return o.criar === 1 && o.automatico === 0 && _.includes((ocorrenciaEditando.tipo === 'PROJETO' ? ['1', '2', '3'] : ['1', '2', '4']), ('' + o.codigo).substr(0, 1)) }), ['codigo'], ['asc'])"
                                             :custom-label="(option) => { return `${option.codigo + ' ' + option.descricao}`}"
                                             selectLabel="" deselectLabel="" selectedLabel="" track-by="codigo"
                                             placeholder="Selecione uma ocorrência" name="codigo_ocorrencia">
                                  <template slot="option" slot-scope="props"><strong>{{props.option.codigo}}</strong> {{props.option.descricao}}</template>
                                  <template slot="singleLabel" slot-scope="props"><div class="truncar"><span class="identificadorIDProjeto">{{props.option.codigo}}</span> {{props.option.descricao}}</div></template>
                                  <template slot="noResult">Nenhum registro localizado!</template>
                                </multiselect>
                                <span v-if="errors.first('codigo_ocorrencia')" class="label label-danger"> Deve selecionar o código da ocorrência desejada na lista</span>
                              </div>
                            </div>
                          </div>

                          <div class="form-group">
                            <div class="required-field" :class="{ 'has-error' : errors.first('descricao_ocorrencia')}">
                              <label class="control-label col-md-2">Observação:</label>
                              <div class="col-md-10">
                                <textarea-autosize v-model="ocorrenciaEditando.observacao" placeholder="Informe o detalhamento da situação que gerou a ocorrência" name="descricao_ocorrencia" id="descricao_ocorrencia"
                                                   v-resizable class="form-control" v-validate="'required'" :disabled="ehVisualizacao">
                                </textarea-autosize>
                                <span v-if="errors.first('descricao_ocorrencia')" class="label label-danger"> Informe o quê se refere essa ocorrência</span>
                              </div>
                            </div>
                          </div>

                        </div>

                        <div class="col-md-10 col-md-offset-2">
                          <button @click="okOcorrencia" v-if="!loading.listaOcorrencias && !_.isEmpty(ocorrenciaEditando.enquadramento) && !_.isEmpty(ocorrenciaEditando.observacao)" type="button" class="btn btn-confirm btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Ok</button>
                          <button @click="cancelaOcorrencia" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
                        </div>
                      </div>
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>


          <!-- botões -->

          <!--<div class="col-md-12">-->
          <!--&lt;!&ndash;<g-button-moema color="success" size="button&#45;&#45;size-ss" @click.native="gravaRelatorio"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</g-button-moema>&ndash;&gt;-->
          <!--<g-button-moema color="success" size="button&#45;&#45;size-ss" @click.native="gravaRelatorio" v-if="visualizacao !== 'VISUALIZAR' && telaRelatorio.alerta.restricao !== 'ENVIO_BLOQUEADO'"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</g-button-moema>-->
          <!--<g-button-moema color="primary" size="button&#45;&#45;size-ss" @click.native="salvaRelatorio" v-if="visualizacao !== 'VISUALIZAR'"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar</g-button-moema>-->
          <!--<g-button-moema color="warning" size="button&#45;&#45;size-ss" @click.native="$router.go(-1)"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</g-button-moema>-->
          <!--</div>-->
        </div> <!-- ./box-body -->
        <!--<a href="#" class="float">-->
        <!--<div class="col-md-12">-->
        <!--&lt;!&ndash;<g-button-moema color="success" size="button&#45;&#45;size-ss" @click.native="gravaRelatorio"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</g-button-moema>&ndash;&gt;-->
        <!--<g-button-ujarak color="success" size="button&#45;&#45;size-ss" @click.native="gravaRelatorio" v-if="visualizacao !== 'VISUALIZAR' && telaRelatorio.alerta.restricao !== 'ENVIO_BLOQUEADO'"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</g-button-ujarak>-->
        <!--<g-button-ujarak color="primary" size="button&#45;&#45;size-ss" @click.native="salvaRelatorio" v-if="visualizacao !== 'VISUALIZAR'"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar</g-button-ujarak>-->
        <!--<g-button-ujarak color="warning" size="button&#45;&#45;size-ss" @click.native="$router.go(-1)"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</g-button-ujarak>-->
        <!--</div>-->
        <!--</a>-->
      </div> <!-- ./box -->
    </section>
  </div>
</template>

<script>
/* eslint-disable no-invalid-regexp,space-before-function-paren,camelcase */

import UploadDocumentosPhpNovo from '../modules/uploadDocumentosPhpNovo'
import listaParticipantes from '../modules/listaParticipantes'
import VisualizaGantt from './Atividades'
// import GanttRel from '../modules/GanttRel'
import { mapGetters } from 'vuex'
import moment from 'moment'
import RelatorioBNDES from '../relatorios/RelatorioImpressaoBNDES.vue'
import html2pdf from 'html2pdf.js'

export default {
  components: {
    RelatorioBNDES,
    UploadDocumentosPhpNovo,
    listaParticipantes,
    // GanttRel
    VisualizaGantt
  },
  name: 'EditaRelExec',
  data () {
    return {
      listaAnexosZip: [],
      data: [],
      maxCount: 2000,
      remainingCount: 2000,
      message: '',
      hasError: false,
      salvouOK: false,
      bloq: false,
      documentosAtividade: {},
      loading: {
        tela: false,
        listaOcorrencias: false,
        projetoEntidadeOcorrencia: false
      },
      desabilitar: false,
      ehVisualizacao: false,
      sit: '',
      mostrar_msg: false,
      relatorio_execucao: {},
      listaDocMetas: 'REL_METAS_ATIVIDADES',
      listaDocParticipantes: 'REL_LISTA_PARTICIPANTES',
      listaDocDiversos: 'REL_ANEXOS_DIVERSOS',
      projeto: {},
      atvGantt: [],
      telaRelatorio: {
        id_relatorio: null,
        id_projeto: null,
        proximaEtapa: '',
        tarefa: {},
        cabecalho: [],
        usuario_enviou: {
          id_usuario: null
        },
        aviso: {
          conteudo: '',
          situacao: '',
          titulo: ''
        },
        alerta: {
          conteudo: '',
          situacao: '',
          titulo: ''
        },
        contrapartida_comprovada: {
          row: []
        },
        objetivos_projeto: {
          row: []
        },
        anexos_diversos: {
          row: []
        },
        metas: {
          row: []
        },
        atividades: {
          row: []
        },
        anexos: {
        },
        ocorrencia: {},
        contrapartida_comprovada_previsto: {},
        comercializacao_producao: {
          canal: {}
        },
        numero_participantes: {
          anexo_lista_participantes: {
            row: []
          },
          lista_participantes: []
        },
        consideracoes_gerais: {
          valor: ''
        },
        entidade: {
          codigo_sapiens: 0,
          nome: '',
          cnpj: '',
          endereco: '',
          complemento_endereco: '',
          bairro: '',
          cep: '',
          municipio: '',
          uf: ''
        },
        questionario: {
          questao_1: {
          },
          questao_2: {
          },
          questao_3: {
          },
          questao_4: {
          },
          questao_5: {
          },
          questao_6: {
          }
        },
        objeto_convenio: {
          valor: ''
        },
        desenvolvimento_objeto_convenio: {
        },
        resultados_alcancados: {
        },
        depoimentos: {
        },
        parecer_fbb: {
          valor: ''
        },
        cronograma_conforme_previsto: {
          resposta: ''
        },
        justificativa_devolucao: {
          valor: ''
        },
        resultadoAprovacao: null,
        comprovantes_enviados_fbb: {},
        acoes_divulgacao_prevista: {},
        objeto: '',
        objetoJustificativa: '',
        encaminhamento_notificacao_extrajudicial: '',
        encaminhamento_email_agencia_parceiro: '',
        encaminhamento_visita_agencia: '',
        encaminhamento_monitoramento: '',
        encaminhamento_registro_ocorrencia: 'NAO',
        encaminhamento_restricao_cepim: 'NAO',
        encaminhamento_restricao_cndt: 'NAO',
        // encaminhamento_restricao_cadin: 'NAO',
        ocorrencia_descricao: '',
        encaminhamento: {
        }
      },
      ocorrenciaModel: {
        id: 0,
        acao: 'SALVAR',
        tipo: 'PROJETO',
        alvo: null,
        enquadramento: null,
        observacao: '',
        prazo: null,
        anexos: []
      },
      projetoEntidadeOcorrencia: {},
      ocorrenciaEditando: {},
      listaTiposOcorrencias: [],
      atividades: {
        status: null
      },
      data2: [],
      metas: {
        meta: '',
        prazo_regularizacao_meta: ''
      },
      proposta: [],
      data4: {
        id: '',
        meta: '',
        motivo: '',
        providencia: '',
        prazo_regularizacao_atividade: ''
      },
      verificar: null,
      consultaAtividades: [],
      consultaAtividades2: [],
      consultaMetas: [],
      colorFadeStyle: {color: '#c1c1c1'},
      ativarDocumentos: false,
      subArray: [],
      headerTable: {
        thead: [ {
          header: 'Metas',
          subheaders: [ {
            title: 'Descrição',
            width: '20%',
            name: 'Descrição1'
          }, {
            title: 'Orçado',
            width: '10%',
            name: 'Orçado'
          }, {
            title: 'Realizado',
            width: '15%',
            name: 'Realizado'
          }, {
            title: 'Atingimento',
            width: '5%',
            name: 'Atingimento'
          } ]
        }, {
          header: 'Atividades',
          subheaders: [ {
            title: 'Descrição',
            width: '25%',
            name: 'Descrição2'
          }, {
            title: 'Status',
            width: '10%',
            name: 'Status'
          }, {
            title: 'Execução',
            width: '6%',
            name: 'Execucao'
          }, {
            title: 'Anexo',
            width: '10%',
            name: 'Anexo'
          }
          ]
        } ]},
      table: {
        items: this.publicoAlvo,
        filter: null,
        hover: true,
        bordered: true,
        currentPage: 1,
        perPage: 20,
        fields: [
          { key: 'fonte.ds_descricao', label: 'Público Alvo', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
          { key: 'nr_participantes_diretos', label: 'Participantes Diretos', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
          // { key: 'nr_participantes_indiretos', label: 'Participantes Indiretos', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
          { key: 'nr_jovens', label: 'Jovens atendidos', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
          { key: 'nr_mulheres', label: 'Mulheres atendidas?', sortable: true, thStyle: 'text-align: center', class: 'text-center' }
        ]
      },
      relatorio: {},
      parametro: null,
      historicoRelatorio: [],
      existe: 0,
      tipoUsu: null,
      publicoAlvo: [],
      totalizadoresListaParticipantes: {},
      previstoPublicoAlvo: {
        participantes: 0,
        jovens: 0,
        mulheres: 0
      },
      atividadesNaoExecutadas: [],
      atividadesNaoExecutadas2: [],
      store: this.$store,
      atividadesProposta: [],
      loadingProposta: false
    }
  },
  watch: {
    consultaMetas: function (value, oldValue) {
      console.log('consultaMetas mudou!')
      for (let i = 0; i < this.consultaMetas.length; i++) {
        this.consultaMetas[i].atividades.row.forEach((item) => {
          if (item.motivo.length > 0 && item.status === 3) {
            if (item.prazo_regularizacao_meta === '1900-01-01') {
              item.prazo_regularizacao_meta = ''
            }
            this.existe += 1
            this.consultaAtividades.push(item)
            this.$forceUpdate()
          }
          if (item.motivo.length > 0 && item.status === 1) {
            if (item.prazo_regularizacao_atividade === '1900-01-01') {
              item.prazo_regularizacao_atividade = ''
            }
            this.existe += 1
            this.consultaAtividades2.push(item)
            this.$forceUpdate()
          }
        })
      }
    },
    'ocorrenciaEditando.tipo': function () {
      if (_.has(this.ocorrenciaEditando, 'tipo')) {
        this.ocorrenciaEditando.enquadramento = null
      }
      this.$forceUpdate()
    }
  },
  mounted () {
    if (this.$route.params.row.item.acao === 'VISUALIZAR') {
      this.desabilitar = true
    } else {
      this.desabilitar = false
    }
  },
  computed: {
    // Busca dados do usuário que está logado
    ...mapGetters([
      'usuarioLogado',
      'urlLaravel'
    ]),
    naoexecutadas () {
      // Pega todas as atividades de todas as metas
      let atividades = this.consultaMetas.map((meta) => {
        return meta.atividades.row
      })
      // Ajusta os arrays para ficar um array só
      atividades = _.flatMapDeep(atividades)
      // Pega todas as atividades não executadas
      return atividades.filter((atividade) => {
        return atividade.status === 3
      })
    },
    executadasparcial () {
      // Pega as metas com realizado menor que orcado
      let metas = this.consultaMetas.filter((meta) => {
        return parseInt(meta.realizado) < parseInt(meta.orcado)
      })
      // Pega todas as atividades das metas
      let atividades = metas.map((meta) => {
        return meta.atividades.row
      })
      // Ajusta os arrays para ficar um array só
      atividades = _.flatMapDeep(atividades)
      // Pega todas as atividades executadas
      // Pega todas as atividades (executadas ou não: suporte 72457)
      return atividades
      // return atividades.filter((atividade) => {
      //  return atividade.status !== 3
      // })
    }
  },
  created: function () {
    this.loading.tela = true
    axiosLaravel.get('propostas/' + (_.has(this.$route.params.row, 'item') ? this.$route.params.row.item.id_proposta : this.$route.params.row.id_proposta)).then((response) => {
      this.proposta = response.data
      this.publicoAlvo = response.data.publicos_alvo
      this.table.items = this.publicoAlvo
      this.contaParticipantes()
      this.$forceUpdate()
    })
      .catch((error) => {
        this.loading.tela = false
        this.$root.trataErro(error)
      })
    // Verifica tipo de ação passada por parâmetro
    if (this.$route.params.acao) {
      this.sit = this.$route.params.acao
    }
    this.ehVisualizacao = _.get(this.$route, 'params.row.item.acao', true) === 'VISUALIZAR'
    // Busca o tipo do usuário que está logado (Ex: FUNDACAO. ENTIDADE...)
    this.tipoUsu = this.usuarioLogado.userType
    this.buscaDados()
    this.$forceUpdate()
    // Monta estrutura da tabela metas x atividades
    this.headerTable.thead.forEach((header) => {
      header.subheaders.forEach((subheader) => {
        this.subArray.push(subheader)
      })
    })
  },
  methods: {
    contaParticipantes() {
      this.previstoPublicoAlvo.participantes = _.sumBy(this.publicoAlvo, 'nr_participantes_diretos')
      this.previstoPublicoAlvo.jovens = _.sumBy(this.publicoAlvo, 'nr_jovens')
      this.previstoPublicoAlvo.mulheres = _.sumBy(this.publicoAlvo, 'nr_mulheres')
    },
    buscaDados() {
      // Verifica os parâmetro passados pelo componente chamador
      this.$snotify.async('Buscando dados do Relatório. Por favor, aguarde...', {timeout: 0})
      let objeto = {}
      let parametro = ''
      objeto.usuario_enviou = []
      objeto.usuario_enviou.nome = ''
      if (this.$route.params.row.item) {
        parametro = ''
        parametro = this.$route.params.row.item.id_processo
      } else {
        if (this.$route.params.row.item) {
          parametro = ''
          parametro = this.$route.params.row.id_processo
        } else {
          parametro = ''
          parametro = this.$route.params.row.id
        }
      }
      if (this.$route.params.row.item) {
        if (this.$route.params.row.item.acao === 'PREENCHER' || this.$route.params.row.item.acao === 'REVISAR') {
          parametro = ''
          parametro = this.$route.params.row.item.id
        }
      }
      if (this.$route.params.acao === 'VALIDAR') {
        if (this.$route.params.row) {
          parametro = ''
          parametro = this.$route.params.row.id_solicitacao
        }
      }
      if (this.$route.params.row.item) {
        if (this.$route.params.row.item.acao === 'VISUALIZAR') {
          parametro = ''
          parametro = this.$route.params.row.item.id
        }
      }
      // Chama back-end para criar a estrutura inicial do relatório
      axiosLaravel.get('/relatorio_execucao/cria/' + parametro).then((response) => {
        // Monta objeto com o retorno dos dados do relatório
        this.listaAnexosZip = response.data.dados.lista_anexos_zip
        objeto = response.data.dados.relatorio_execucao
        this.parmGeral = parametro
        if (this.parmGeral) {
          this.consultaHistorico()
          // this.marcaVisualizado()
        }
        // Adicionando novos parametros para evitar erros com relatórios já gravados sem eles
        _.set(objeto, 'encaminhamento_restricao_cepim', _.get(objeto, 'encaminhamento_restricao_cepim', this.telaRelatorio.encaminhamento_restricao_cepim))
        _.set(objeto, 'encaminhamento_restricao_cndt', _.get(objeto, 'encaminhamento_restricao_cndt', this.telaRelatorio.encaminhamento_restricao_cndt))
        _.set(objeto, 'ocorrencias', _.get(objeto, 'ocorrencias', []))
        _.set(objeto, 'entidade', {codigo_sapiens: 0, nome: '', cnpj: '', endereco: '', complemento_endereco: '', bairro: '', cep: '', municipio: '', uf: ''})
        this.telaRelatorio = objeto
        // this.buscaProposta()
        if (this.telaRelatorio.contrapartida_comprovada.row.length > 1) {
          this.contrapartida = this.telaRelatorio.contrapartida_comprovada.row
        } else {
          this.contrapartida = [this.telaRelatorio.contrapartida_comprovada.row]
        }
        this.telaRelatorio.encaminhamento_registro_ocorrencia = 'NAO'
        // this.telaRelatorio.encaminhamento_notificacao_extrajudicial = 'NAO'
        // this.telaRelatorio.encaminhamento_email_agencia_parceiro = 'NAO'
        // this.telaRelatorio.encaminhamento_visita_agencia = 'NAO'
        // this.telaRelatorio.encaminhamento_monitoramento = 'NAO'
        this.consultaMetas = objeto.metas.row
        //
        this.mostrar_msg = true
        this.$snotify.clear()
        this.$snotify.success('Relatório de Execução carregado com sucesso!')
        this.loading.tela = false
        // Converte caracteres para montar o link do documento
        // let textoAviso = this.telaRelatorio.aviso.conteudo.replace('»', '>').replace('«', '<')
        // textoAviso = textoAviso.replace('«', '<')
        // textoAviso = textoAviso.replace('»', '>')
        // this.telaRelatorio.aviso.conteudo = textoAviso
        // let textoAlerta = this.telaRelatorio.alerta.conteudo.replace('»', '>').replace('«', '<')
        // textoAlerta = textoAlerta.replace('«', '<')
        // this.telaRelatorio.alerta.conteudo = textoAlerta
        this.buscaPropostaAtividade()
        if (this.tipoUsu === 'FUNDACAO' && this.sit === 'VALIDAR') {
          this.carregarListaTiposOcorrencias()
        }
        console.log('this.telaRelatorio', this.telaRelatorio)
      })
        .catch((error) => {
          console.log('error', error)
          this.$snotify.clear()
          this.$root.trataErro(error)
        })
    },
    // buscaProposta () {
    //   this.$snotify.clear()
    //   this.$snotify.async('Buscando dados das Atividades. Por favor, aguarde...', {timeout: 0})
    //   axiosLaravel.get('/propostas/' + this.telaRelatorio.cabecalho.numero_projeto).then((response) => {
    //     this.proposta = response.data
    //     this.buscaAtividade()
    //     this.$snotify.clear()
    //   })
    //     .catch((error) => {
    //       this.$snotify.clear()
    //       console.log('error', error)
    //       this.$root.trataErro(error)
    //     })
    // },
    buscaAtividade () { // Carrega as atividades
      // console.log('Gantt >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', this.consultaMetas)
      this.atvGantt = []
      let atividades = []
      let atividadesRel = []
      this.consultaMetas.forEach((meta) => {
        //
        if (meta.atividades) {
          meta.atividades.row.forEach((atividade) => {
            let atv = {}
            atv['id'] = atividade.id
            atv['execucao'] = (typeof atividade.execucao === 'undefined') ? 0 : atividade.execucao
            atividadesRel.push(atv)
          })
        }
        //
      })
      // console.log('0')
      if (this.proposta.objetivos) {
        // console.log('1') // não esta entrando aqui
        this.proposta.objetivos.forEach((objetivo) => {
          // console.log('2')
          if (objetivo.metas && objetivo.bt_simbolico === 0) {
            // console.log('3')
            objetivo.metas.forEach((meta) => {
              // console.log('4')
              if (meta.atividades && meta.bt_simbolico === 0) {
                // console.log('5')
                meta.atividades.forEach((atividade) => {
                  // console.log('6')
                  atividade['execucao'] = _.filter(atividadesRel, function (o) {
                    // console.log('7')
                    if (o.id === atividade.id) return o
                  })[0].execucao
                  // console.log('8')
                  this.atvGantt.push(atividade)
                  this.$forceUpdate()
                })
              }
            })
          }
        })
      }
      return atividades
    },

    // marcaVisualizado() {
    //   // Chama o bank-end parar criar tarefa de visualização
    //   axiosLaravel.put('processos/visualizado/' + this.parmGeral).then((response) => {
    //     console.log('response', response.data)
    //   })
    //     .catch((error) => {
    //       console.log('error', error, parametroConsulta)
    //       this.$root.trataErro(error)
    //     })
    // },
    consultaHistorico() {
      // Monta parâmetros para chamar o back-end
      let parametroConsulta = ''
      if (this.$route.params.row.item) {
        parametroConsulta = this.$route.params.row.item.id_processo
      } else {
        if (this.$route.params.row.item) {
          parametroConsulta = this.$route.params.row.id_processo
        } else {
          parametroConsulta = this.$route.params.row.id
        }
      }
      // Chama back-end para mostrar o histórico da tarefa
      axiosLaravel.post('processos/consulta_historico/' + this.parmGeral).then((response) => {
        this.historicoRelatorio = response.data[0].dados.row
      })
        .catch((error) => {
          console.log('error', error)
          console.log(parametroConsulta)
          this.$root.trataErro(error)
        })
    },
    carregarListaTiposOcorrencias () {
      this.loading.listaOcorrencias = true
      this.carregarProjetoEntidadeOcorrencia()
      if (typeof Storage !== 'undefined') { // Ver se o browser suporta localStorage/sessionStorage.
        // Se sim, guardará a lista de codigos de ocorrência (raramente muda) junto com um timestamp da ultima atualizacao
        let listaTiposOcorrencias = JSON.parse(window.localStorage.getItem('codigos-ocorrencia'))
        // Calcula a diferenca em dias do timestamp de agora e do que foi gravadp no storage (que se não tiver ainda considera o inicio de 2023 para forçar atualização)
        let diferenca = Math.floor((((new Date()).getTime()) / 86400000) - ((_.get(listaTiposOcorrencias, 'atualizado', (new Date('2023-01-01')).getTime())) / 86400000))
        if (diferenca >= 1) { // Se não tiver lista ou a lista estiver desatualizada (com mais de 1 dia).. atualiza ela
          axiosLaravel.get('tipo-ocorrencia/').then((response) => {
            this.listaTiposOcorrencias = _.cloneDeep(response.data)
            window.localStorage.setItem('codigos-ocorrencia', JSON.stringify({'atualizado': Math.floor((new Date()).getTime()), 'lista': this.listaTiposOcorrencias}))
            this.loading.listaOcorrencias = false
            this.$forceUpdate()
          })
            .catch((error) => {
              this.loading.listaOcorrencias = false
              if (error) {
                this.$root.trataErro(error)
              }
            })
        } else {
          this.listaTiposOcorrencias = _.cloneDeep(listaTiposOcorrencias.lista)
          this.loading.listaOcorrencias = false
        }
      }
    },
    atualizaComponente() {
      this.telaRelatorio.encaminhamento_notificacao_extrajudicial = 'NAO'
      this.telaRelatorio.encaminhamento_email_agencia_parceiro = 'NAO'
      this.telaRelatorio.encaminhamento_visita_agencia = 'NAO'
      this.telaRelatorio.encaminhamento_monitoramento = 'NAO'
      this.telaRelatorio.encaminhamento_registro_ocorrencia = 'NAO'
      this.telaRelatorio.ocorrencia = ''
      this.telaRelatorio.parecer_fbb.valor = ''
      this.telaRelatorio.ocorrencia_descricao = ''
    },
    ativaDocumentos(data2) {
      // Habilita a visualização do componente de documentos das atividades
      this.documentosAtividade = data2
      this.ativarDocumentos = true
      this.$nextTick(() => {
        this.$refs['doc'].scrollIntoView()
      })
    },
    passaMetas(data, data2) {
      this.errors.clear()
      this.bloq = true
      data2.execucao = 0
      this.$nextTick(() => {
        this.$refs['js2'].scrollIntoView()
      })
      this.buscaAtividade()
    },
    passaMetas2(data, data2) {
      this.errors.clear()
      this.bloq = true
      data2.execucao = 100
      this.$nextTick(() => {
        this.$refs['js1'].scrollIntoView()
      })
      this.buscaAtividade()
    },
    passaMetas3(data, data2) {
      this.bloq = false
      data2.execucao = ''
      this.buscaAtividade()
    },
    validaOpcao() {
      if (this.telaRelatorio.encaminhamento_registro_ocorrencia === 'NAO') {
        this.telaRelatorio.ocorrencia = ''
        this.telaRelatorio.ocorrencia_descricao = ''
        this.$forceUpdate()
      }
    },
    mudaEstilo(parm) {
      if (parm.venda_na_propriedade === 'NAO' || parm.direto_ao_consumidor === 'NAO' || parm.programa_de_aquisição_de_alimentos_paa === 'NAO' || parm.feiras_livres === 'NAO' || parm.mercadinhos === 'NAO' || parm.programa_nacional_de_alimentação_escolar_pnae === 'NAO' || parm.feiras_agroecológicas === 'NAO' || parm.atravessadores === 'NAO' || parm.outros_canais_de_comercialização === 'NAO') {
        this.$refs['com'].style.color = '#000000'
      } else {
        this.$refs['com'].style.color = '#fb2916'
      }
      if (this.telaRelatorio.comercializacao_producao.resposta === 'NAO') {
        if (this.telaRelatorio.comercializacao_producao.justivicativa) {
          if (this.telaRelatorio.comercializacao_producao.justificativa.length === 0) {
            this.$refs['considera1'].style.color = '#fb2916'
          } else {
            this.$refs['considera1'].style.color = '#000000'
          }
        }
      }
    },
    onlyNumber ($event) {
      let keyCode = ($event.keyCode ? $event.keyCode : $event.which)
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 44) { // 44 é virgula
        $event.preventDefault()
      }
    },
    validaDocPreenchidos() {
      if (this.telaRelatorio.numero_participantes.anexo_lista_participantes.row.length === 0) {
        this.$nextTick(() => {
          this.$refs['listPartc'].scrollIntoView()
          this.$refs['listPartc'].style.color = '#fb2916'
          this.$snotify.error('É obrigatório anexar a Lista de Participantes!')
        })
      } else {
        this.$nextTick(() => {
          this.$refs['listPartc'].style.color = '#000000'
        })
      }
    },
    salvaRelatorio() {
      this.loading.tela = true
      // Apenas salva o relatório e mantem o processo/tarefa no mesmo estágio
      this.telaRelatorio.proximaEtapa = 'SALVAR'
      if (this.$route.params.row.item) {
        // this.telaRelatorio.id_relatorio = this.$route.params.row.item.id_relatorio
        this.telaRelatorio.id_projeto = this.$route.params.row.item.id_projeto
      }
      if (this.$route.params.row) {
        this.telaRelatorio.id_solicitacao = this.$route.params.row.id_solicitacao
        this.telaRelatorio.id_projeto = this.$route.params.row.id_projeto
      }
      console.log('relatorio', this.telaRelatorio)
      this.telaRelatorio.usuario_enviou.id_usuario = this.usuarioLogado.id
      this.$snotify.async('Salvando relatório. Por favor, aguarde...', {timeout: 0})
      axiosLaravel.post('relatorio_execucao/', this.telaRelatorio).then((response) => {
        this.salvouOK = true
        this.$snotify.clear()
        // volta do backend e permanece na mesma tela
        this.$snotify.success('Relatório de Execução salvo com sucesso')
        this.loading.tela = false
      })
        .catch((error) => {
          this.loading.tela = false
          this.$snotify.clear()
          console.log('error', error)
          this.$root.trataErro(error)
        })
    },
    permiteConcluir() {
      console.log('data termino ', this.telaRelatorio.cabecalho.termino)
      let mensagem = []
      let documentosObrigatorios = [{'codigo': 67, 'descricao': 'CNEP/CEPIM'}, {'codigo': 40, 'descricao': 'CNDT'}]
      // Verifica se os documentos obrigatórios estão com datas de validade
      if (this.tipoUsu === 'ENTIDADE' || (this.tipoUsu === 'FUNDACAO' && this.telaRelatorio.resultadoAprovacao !== 'REVISAO')) {
        let codigoDocsObrigatoriosSemDataValidade = _.uniq(_.map(_.filter(this.telaRelatorio.anexos_diversos.row, function (anexo) {
          return _.includes([67, 40], anexo.tipo_documento.id) && anexo.dt_data_vigencia === '' // CNPJ não tem data de validade e por isso não é verificada como as demais
        }), 'tipo_documento.id'))
        if (this.tipoUsu === 'FUNDACAO') {
          if (codigoDocsObrigatoriosSemDataValidade.length > 0) {
            mensagem.push('Falta data de validade: ' + _.join(_.map(_.filter(documentosObrigatorios, function(obr) { return _.includes(codigoDocsObrigatoriosSemDataValidade, obr.codigo) }), 'descricao'), ', '))
          }
          // Adiciona CADIN com doc obrigatório, mas somente depois de verificar as datas de validade, pois Cadin não tem validade
          // documentosObrigatorios.push({'codigo': 80, 'descricao': 'CADIN'})
        }
        // Verifica se os anexos obrigatórios estão presentes
        let codigosDocsAnexados = _.map(this.telaRelatorio.anexos_diversos.row, 'tipo_documento.id') // map de ids tem que ser sempre feito fora se for usado num remove
        _.remove(documentosObrigatorios, function (obr) { return _.includes(codigosDocsAnexados, obr.codigo) })
        if (documentosObrigatorios.length > 0) {
          mensagem.push('Obrigatório anexar os documento: ' + _.join(_.map(documentosObrigatorios, 'descricao'), ', '))
        }
      }
      // Suporte 75579 - Retirar a restrição de envio do relatório depois do prazo
      // Verifica se esta no período de envio do relatório
      let dataTermino = moment(this.telaRelatorio.cabecalho.termino, 'DD/MM/YYYY')
      if (moment().isAfter(dataTermino, 'day', '[]')) {
        mensagem.push('Relatório não pode ser enviado, vigência do convênio encerrada.')
      }
      if (mensagem.length > 0) {
        this.$dialog.alert('<ul><li>' + mensagem.join('</li><li>') + '</li></ul>', {
          html: true,
          animation: 'fade',
          customClass: 'avisoAlerta'
        })
        return
      } else {
        this.gravaRelatorio()
      }
    },
    gravaRelatorio() {
      this.loading.tela = true
      // Aprova ou devolve o relatório para a entidade
      if (this.$route.params.row.item) {
        if (this.$route.params.row.item.acao === 'PREENCHER') {
          this.telaRelatorio.tarefa = {
            nome: 'SOLICITACAO',
            tipo: 'USUARIO',
            situacao: 'PADRAO'
          }
          this.telaRelatorio.processo = {
            nome: 'RELATORIO_DE_EXECUCAO',
            situacao: 'EM_EXECUCAO'
          }
          this.telaRelatorio.proximaEtapa = 'ANALISE'
        }
        if (this.$route.params.row.item.acao === 'REVISAR') {
          this.telaRelatorio.tarefa = {
            nome: 'REVISAR',
            tipo: 'USUARIO',
            situacao: 'PADRAO'
          }
          this.telaRelatorio.processo = {
            nome: 'RELATORIO_DE_EXECUCAO',
            situacao: 'EM_EXECUCAO'
          }
          this.telaRelatorio.proximaEtapa = 'ANALISE'
        }
      }
      if (this.$route.params.acao === 'VALIDAR') {
        this.telaRelatorio.tarefa = {
          nome: 'ANALISE',
          tipo: 'USUARIO',
          situacao: 'PADRAO'
        }
        this.telaRelatorio.processo = {
          nome: 'RELATORIO_DE_EXECUCAO',
          situacao: 'EM_EXECUCAO'
        }
        if (this.telaRelatorio.resultadoAprovacao === 'APROVADO') {
          this.telaRelatorio.proximaEtapa = 'CONCLUSAO'
        }
        if (this.telaRelatorio.resultadoAprovacao === 'REVISAO') {
          this.telaRelatorio.proximaEtapa = 'REVISAO'
        }
      }
      if (this.$route.params.row.item) {
        // this.telaRelatorio.id_relatorio = this.$route.params.row.item.id_relatorio
        this.telaRelatorio.id_projeto = this.$route.params.row.item.id_projeto
      }
      if (this.$route.params.row) {
        this.telaRelatorio.id_solicitacao = this.$route.params.row.id_solicitacao
        this.telaRelatorio.id_projeto = this.$route.params.row.id_projeto
      }
      if (this.telaRelatorio.comercializacao_producao.resposta === 'SIM') {
        if (this.telaRelatorio.comercializacao_producao.canal.venda_na_propriedade === 'NAO' && this.telaRelatorio.comercializacao_producao.canal.direto_ao_consumidor === 'NAO' && this.telaRelatorio.comercializacao_producao.canal.programa_de_aquisição_de_alimentos_paa === 'NAO' && this.telaRelatorio.comercializacao_producao.canal.feiras_livres === 'NAO' && this.telaRelatorio.comercializacao_producao.canal.mercadinhos === 'NAO' && this.telaRelatorio.comercializacao_producao.canal.programa_nacional_de_alimentação_escolar_pnae === 'NAO' && this.telaRelatorio.comercializacao_producao.canal.feiras_agroecológicas === 'NAO' && this.telaRelatorio.comercializacao_producao.canal.atravessadores === 'NAO' && this.telaRelatorio.comercializacao_producao.canal.outros_canais_de_comercialização === 'NAO') {
          this.verificar = 0
        } else {
          this.verificar = 1
          this.$refs['com'].style.color = '#000000'
          this.$forceUpdate()
        }
      }
      if (this.telaRelatorio.comercializacao_producao.resposta === 'NAO') {
        if (this.telaRelatorio.comercializacao_producao.resposta.justificativa) {
          if (this.telaRelatorio.comercializacao_producao.resposta.justificativa.length === 0) {
            this.$nextTick(() => {
              this.$refs['considera1'].scrollIntoView()
              this.$refs['considera1'].style.color = '#fb2916'
              this.$snotify.error('O campo consideração é obrigatório, quando o campo comercialização é marcado como NÃO.')
              this.loading.tela = false
            })
          } else {
            this.$refs['considera1'].style.color = '#000000'
          }
        }
      }
      this.validaDocPreenchidos()
      //
      // Verifica se quando a meta esta 100 %, possui documentos anexados
      let metaRel = this.telaRelatorio.metas.row
      for (let i = 0; i < metaRel.length; i++) {
        if (parseInt(metaRel[i].realizado) >= parseInt(metaRel[i].orcado)) {
          for (let j = 0; j < metaRel[i].atividades.row.length; j++) {
            if (metaRel[i].atividades.row[j].anexos_atividades.row.length === 0) {
              this.$snotify.error('É obrigatório anexar documentos comprobatórios quando o atingimento da meta está 100% concluída!')
              this.loading.tela = false
              this.$nextTick(() => {
                this.$refs['metAtv'].scrollIntoView()
              })
              return
            }
          }
        }
      }
      if (_.isEmpty(this.telaRelatorio.numero_participantes.lista_participantes) && this.sit !== 'VALIDAR') {
        this.$snotify.error('É necessário preencher a lista de participantes!')
        this.loading.tela = false
        return
      }
      //
      // --------------------------------------------------
      this.$validator.validateAll().then((result) => {
        if (this.verificar === 0) {
          this.$nextTick(() => {
            this.$refs['com'].scrollIntoView()
            this.$refs['com'].style.color = '#fb2916'
          })
          if (this.telaRelatorio.comercializacao_producao.resposta === 'SIM') {
            this.$snotify.error('Preencha ao menos um canal de Comercialização da Produção')
          }
        } else {
          this.loading.tela = false
          // this.$refs['com'].style.color = '#000000'
          this.$forceUpdate()
        }
        if (result) {
          // Remover e adicionar se houver ocorrência relativa a restrição em certidões
          _.remove(this.telaRelatorio.ocorrencias, function (o) { return o.enquadramento.codigo === 2422 })
          // let certidoes = ['CEPIM', 'CNDT', 'CADIN']
          let certidoes = [{'codigo': 'CEPIM', 'descricao': 'CNEP/CEPIM'}, {'codigo': 'CNDT', 'descricao': 'CNDT'}]
          let restricoes = []
          certidoes.forEach((certidao) => {
            if (_.get(this.telaRelatorio, 'encaminhamento_restricao_' + _.toLower(certidao.codigo)) === 'SIM') {
              restricoes.push(certidao.descricao)
            }
          })
          if (restricoes.length > 0) {
            let alvo = _.find(this.projetoEntidadeOcorrencia.projetos, ['ds_codigo_projeto_erp', '' + this.telaRelatorio.cabecalho.numero_projeto])
            this.telaRelatorio.ocorrencias.push({'id': 0, 'acao': 'SALVAR', 'alvo': alvo, 'tipo': 'PROJETO', 'enquadramento': {'codigo': 2422, 'descricao': 'Certidão com restrição'}, 'descricao': '', 'observacao': _.join(restricoes, ', ') + ' com restricao'})
          }
          this.$snotify.async('Enviando relatório. Por favor, aguarde...', {timeout: 0})
          this.loading.tela = true
          axiosLaravel.post('relatorio_execucao/', this.telaRelatorio).then((response) => {
            this.salvouOK = true
            this.$snotify.clear()
            // volta do backend e retorna para tela anterior
            this.$snotify.success('Relatório de Execução enviado com sucesso')
            this.loading.tela = false
            setTimeout(() => { this.$router.go(-1) }, 1000)
          })
            .catch((error) => {
              this.loading.tela = false
              console.log('error', error)
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        } else {
          this.loading.tela = false
          this.$snotify.error('Verifique se todos os campos obrigatórios foram preenchidos!')
        }
      })
      // -----------------------------------
      // this.$snotify.async('Enviando validação do relatório. Por favor, aguarde...', {timeout: 0})
      // console.log('>>>>>>>>> objeto enviado', this.telaRelatorio)
      // axiosLaravel.post('relatorio_execucao/', this.telaRelatorio).then((response) => {
      //   console.log('response.data', response.data)
      //   this.$snotify.clear()
      //   // volta do backend e retorna para tela anterior
      //   this.$snotify.success('Relatório de Execução enviado com sucesso')
      //   setTimeout(() => { this.$router.go(-1) }, 1000)
      //   this.$snotify.clear()
      // })
      //   .catch((error) => {
      //     this.$snotify.clear()
      //     console.log('error', error)
      //     this.$root.trataErro(error)
      //   })
    },
    okOcorrencia () {
      let idx = _.get(this.ocorrenciaEditando, 'idx', -1)
      let valor = _.clone(this.ocorrenciaEditando)
      _.unset(valor, 'idx')
      let alvo = {}
      if (this.ocorrenciaEditando.tipo === 'PROJETO') {
        alvo = _.find(this.projetoEntidadeOcorrencia.projetos, ['ds_codigo_projeto_erp', '' + this.telaRelatorio.cabecalho.numero_projeto])
      } else {
        alvo = _.find(this.projetoEntidadeOcorrencia.entidades, ['ds_nome', this.telaRelatorio.cabecalho.entidade])
      }
      if (_.isNil(alvo)) {
        this.$snotify.error('Não consigo dados de ' + _.toLower(this.ocorrenciaEditando.tipo) + ' para prosseguir. Favor informar o administrador do sistema')
      } else {
        _.set(valor, 'alvo', alvo)
        if (idx >= 0) {
          this.telaRelatorio.ocorrencias[idx] = valor
        } else {
          this.telaRelatorio.ocorrencias.push(valor)
        }
        this.cancelaOcorrencia()
      }
    },
    cancelaOcorrencia () {
      this.ocorrenciaEditando = {}
      this.$forceUpdate()
    },
    excluiOcorrencia (idx) {
      this.telaRelatorio.ocorrencias.splice(idx, 1)
      this.$forceUpdate()
    },
    editaOcorrencia (idx) {
      this.ocorrenciaEditando = this.telaRelatorio.ocorrencias[idx]
      _.set(this.ocorrenciaEditando, 'idx', idx)
      this.$forceUpdate()
    },
    novaOcorrencia () {
      this.ocorrenciaEditando = _.clone(this.ocorrenciaModel)
      _.set(this.ocorrenciaEditando, 'idx', -1)
      this.$forceUpdate()
    },
    carregarProjetoEntidadeOcorrencia () {
      this.loading.projetoEntidadeOcorrencia = true
      axiosLaravel.get('consulta/projetos-entidades/lista/').then((response) => {
        if (_.get(response.data, 'codigo', '') === 'OK') {
          this.projetoEntidadeOcorrencia = response.data.retorno
        } else {
          this.$snotify.error(response.data.mensagem)
        }
        this.loading.projetoEntidadeOcorrencia = false
        this.$forceUpdate()
      })
        .catch((error) => {
          this.loading.projetoEntidadeOcorrencia = false
          if (error) {
            this.$root.trataErro(error)
          }
        })
    },
    countdown () {
      this.remainingCount = this.maxCount - this.telaRelatorio.justificativa_devolucao.valor.length
      this.hasError = this.remainingCount < 0
    },
    formataData (data) {
      return moment(data).format('DD/MM/YYYY')
    },
    // 68198 - Comprovacao de contrapartida relatorio execucao X sapiens inconsistente
    // Pega atividades da Proposta (atualizada)
    async buscaPropostaAtividade () {
      this.loadingProposta = true
      console.log('Proposta Atividade - ' + 'Numero Projeto: ' + this.telaRelatorio.cabecalho.numero_projeto)
      await axiosLaravel.get('projeto/numero/' + this.telaRelatorio.cabecalho.numero_projeto).then((response) => {
        this.atividadesProposta = response.data.atividades
        this.buscaCronograma()
        console.log(this.atividadesProposta)
      })
    },
    // 68198 - Comprovacao de contrapartida relatorio execucao X sapiens inconsistente
    async buscaCronograma () {
      console.log('id proposta: ', (_.has(this.$route.params.row, 'item') ? this.$route.params.row.item.id_proposta : this.$route.params.row.id_proposta))
      await axiosLaravel.post('processos/cronograma/projeto/', {'proposta': (_.has(this.$route.params.row, 'item') ? this.$route.params.row.item.id_proposta : this.$route.params.row.id_proposta), 'processo': 'PAGAMENTO', 'aglutinado': 'Completo', 'documento': 0}).then((response) => {
        let saldos = response.data
        if (_.isUndefined(this.atividadesProposta)) {
          return 0
        }
        this.atividadesProposta.forEach((atividade) => {
          if (atividade.itens_orcamentos) {
            atividade.itens_orcamentos.forEach((item) => {
              item['valorOrcado'] = _.sumBy(item.orcamentos_mensalizados, function (iVO) { return iVO.valor })
              item['quantidadeOrcado'] = _.sumBy(item.orcamentos_mensalizados, function (iQO) { return iQO.quantidade })
              //
              item['valorSaldo'] = _.sumBy(saldos.itens, function (sVS) { return (item.id === sVS['Id_item']) ? sVS['Valor_saldo'] : 0 })
              item['quantidadeSaldo'] = _.sumBy(saldos.itens, function (sQS) { return (item.id === sQS['Id_item']) ? sQS['Qtde_saldo'] : 0 })
              //
              item['contaFinanceiraDescricao'] = _.has(item, 'conta_financeira') && _.has(item.conta_financeira, 'descricao') ? item.conta_financeira.descricao : ''
              item['contaFinanceiraNumero'] = _.has(item, 'conta_financeira') && _.has(item.conta_financeira, 'numero_conta') ? item.conta_financeira.numero_conta : ''
              //
              item['observacaoOriginal'] = item['observacao']
              //
              // Ajustes de diferenças entre propsAtividades e proc cronograma
              _.unset(item, 'observacaoNova')
              let valorOrcado = _.sumBy(saldos.itens, function (sVS) { return (item.id === sVS['Id_item']) ? sVS['Valor_orcado'] : 0 })
              item['valorOrcado'] = (item['valorOrcado'] !== valorOrcado) ? valorOrcado : item['valorOrcado']
              //
              let quantidadeOrcado = _.sumBy(saldos.itens, function (sVS) { return (item.id === sVS['Id_item']) ? sVS['Qtde_orcado'] : 0 })
              item['quantidadeOrcado'] = (item['quantidadeOrcado'] !== quantidadeOrcado) ? quantidadeOrcado : item['quantidadeOrcado']
              //
              item['percAtingimento'] = Math.ceil(((('' + item.economicidade) === '1' ? item['valorOrcado'] : item['valorOrcado'] - item['valorSaldo']) / item['valorOrcado']) * 100) / 100
              item['percAtingimento'] = (item['percAtingimento'] > 1 ? 1 : (item['percAtingimento'] < 0 ? 0 : item['percAtingimento'])) // Correção de percentual em caso de estou limites 0% e 100%
            })
            atividade['valorOrcado'] = _.sumBy(atividade.itens_orcamentos, function (aVO) { return aVO.valorOrcado })
            atividade['quantidadeOrcado'] = _.sumBy(atividade.itens_orcamentos, function (aQO) { return aQO.quantidadeOrcado })
            //
            atividade['valorSaldo'] = _.sumBy(atividade.itens_orcamentos, function (aVS) { return aVS.valorSaldo })
            atividade['quantidadeSaldo'] = _.sumBy(atividade.itens_orcamentos, function (aQS) { return aQS.quantidadeSaldo })
            //
            atividade['percAtingimento'] = Math.ceil(((('' + atividade.economicidade) === '1' ? atividade['valorOrcado'] : atividade['valorOrcado'] - atividade['valorSaldo']) / atividade['valorOrcado']) * 100) / 100
            atividade['percAtingimento'] = (atividade['percAtingimento'] > 1 ? 1 : (atividade['percAtingimento'] < 0 ? 0 : atividade['percAtingimento'])) // Correção de percentual em caso de estou limites 0% e 100%
          }
        })
        this.loadingProposta = false
        this.$forceUpdate()
      })
        .catch((error) => {
          console.log('error', error)
          this.$root.trataErro(error)
        })
    },
    imprimir () {
      window.print()
    },
    forceRerender() {
      this.componentKey += 1
    },
    mostrarRelatorio(tipo) {
      let element = document.getElementById('FundacaoCode12646546516581')
      element.style.display = tipo
    },
    print () {
      this.mostrarRelatorio('block')
      this.forceRerender()
      let element = document.getElementById('FundacaoCode12646546516581')
      element.style.width = '750px' // largura da div que ficará mais próxima do export do PDF
      this.$refs.relatorioBNDESChildRef.verificaTamanhos(element)
      element.style.width = '100%'
      let opt = {
        margin: 0.3,
        filename: 'relatorio_SGP.pdf',
        image: {type: 'jpeg', quality: 0.98},
        html2canvas: {scale: 2},
        jsPDF: {unit: 'in', format: 'a4', orientation: 'portrait'}
      }
      html2pdf(element, opt).then(() => {
        element.style.display = 'none'
      })
    },
    onDownloadZIP () {
      this.$forceUpdate()
      this.$snotify.async('Baixando arquivos. Por favor, aguarde...', {timeout: 0})
      axiosLaravel.get('documentos/download_por_lista', {
        responseType: 'blob', // or 'blob' for binary data
        params: {
          lista: this.listaAnexosZip.map(item => item.id).join(',')
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'relatorio.zip')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        this.$snotify.clear()
        this.$forceUpdate()
      })
        .catch(async (error) => {
          this.$snotify.clear()
          if (error.response && error.response.data) {
            const objetoJsonDoBlob = JSON.parse(await error.response.data.text())
            if (objetoJsonDoBlob.error) {
              this.$snotify.error(objetoJsonDoBlob.error, {bodyMaxLength: 1200})
            }
          } else {
            this.$root.trataErro(error)
          }
        })
    }
  }
}
</script>

<style scoped>
.centro {
  text-align: center;
}

.centralizado {
  text-align: center !important;
}

span.mx-input-append {
  display: none;
}
/* 68198 - Comprovacao de contrapartida relatorio execucao X sapiens inconsistente */
.contrapartida-loading {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 30px;
}

.justificativa-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 200px;
}

.justificativa-atividade {
  font-size: 12px;
}

.contrapartida-obs {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  width: 100%;
}
@media print {
  #app .content-wrapper *:not(table):not(th):not(tr):not(td):not(tbody):not(thead):not(tfooter):not(.vdp-datepicker__calendar):not(button) {
    display: block !important;
    background: white !important;
  }

  .vdp-datepicker__calendar {
    display: none !important;
  }

  .button, button.btn.btn-primary.btn-flat {
    display: none !important;
  }

  .box-body.form-group label {
    margin-right: 20px;
    float: left;
  }

  i.fa.fa-exclamation.fa-3 {
    float: right;
  }

  @page {
    /*size: portrait;*/
  }
  .gantt_simples {
    width: 100%;
  }

  .gantt_simples thead th:nth-child(n+2) {
    text-align: center;
    max-width: 10px !important;
  }

  .gantt_simples td.meses {
    width: 30px !important;
  }

  td.passou {
    background: #204d74;
  }

  td.atual {
    background: #4c84b5;
  }

  td.pendente {
    background: #2e5a80
  }

  .gantt_simples tbody td.ganttAtividade {
    width: 20% !important;
  }
  .valuePadding {
    border: 1px inset #ccc;
  }
  .valuePadding input {
    border: none;
    padding:0px;
    outline: none;
  }

}
*{padding:0;margin:0;}

body{
  font-family:Verdana, Geneva, sans-serif;
  font-size:18px;
  background-color:#CCC;
}

.float{
  position:fixed;
  bottom:40px;
  z-index: 2;
  right:20px;
  color: #c1c1c1;
  text-align:center;
}

.my-float{
  margin-top:22px;
}
</style>
