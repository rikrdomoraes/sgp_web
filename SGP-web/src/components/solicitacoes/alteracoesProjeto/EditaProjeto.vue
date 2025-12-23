<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="'SGP - ' + (_.isEmpty(proposta) && loading.tela ? 'Carregando ...' : (ehVisualizacao ? 'Visualizando ' + (!_.isNull(id) ? 'ID ' + id : '') : etapa + ' da Alteração ' + (!_.isNull(id) ? 'ID ' + id : '')))"/>

    <section class="content-header">
      <h1>
        <span class="col-md-5">
          <span v-if="_.isEmpty(proposta) && loading.tela">Carregando projeto ...</span>
          <span v-else>
            <span v-if="ehVisualizacao">Visualizar {{!_.isNull(id) ? 'ID ' + id : ''}}</span>
            <span v-else>{{etapa}} da Alteração em Projeto {{!_.isNull(id) ? 'ID ' + id : ''}}</span>
          </span>
        </span>

        <span v-if="!loading.tela || ehVisualizacao" class="col-md-4 bloco_botoes">
          <span><g-button-moema color="warning" @click.native="$router.go(-1)" type="button"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</g-button-moema></span>
          <span v-if="(!_.isEmpty(proposta) || !_.isNull(id)) && !ehVisualizacao"> <!-- Após lido o projeto ou processo -->
            <g-button-moema v-if="true && erroCronograma === false" color="primary" @click.native="processarSolicitacao('SALVAR')" type="button"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar</g-button-moema>
            <span v-if="!loading.poderes && _.includes(poderes, 'PERMITE_CONCLUIR') && erroCronograma === false">
              <g-button-moema color="success" @click.native="processarSolicitacao('ENCAMINHAR')"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</g-button-moema>
            </span>
            <span v-else-if="loading.poderes"><i class="fa fa-refresh fa-spin"></i></span>
          </span>
          <span v-if="(!_.isEmpty(proposta) || !_.isNull(id)) && _.includes(['Análise', 'Autorização', 'Deliberação', 'Pendências'], etapa) && usuarioLogado.userType === 'FUNDACAO'">

            <div class="btn-group dropdown">
              <div class="btn-group">
                <g-button-ujarak color="dark-primary" size="button--size-ss"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-print" aria-hidden="true"></i>  Relatórios <i class="fa fa-caret-down" aria-hidden="true"></i></g-button-ujarak>
                <ul class="dropdown-menu">
                  <li @click="emitir(219)"><a href="#"> 219 - Adiantamento de Projetos</a></li>
                  <li @click="emitir(222)"><a href="#"> 222 - Extrato de Projetos Analítico</a></li>
                  <li @click="emitir(248)"><a href="#"> 248 - Monitoramento Administrativo</a></li>
                  <li @click="emitir(268)"><a href="#"> 268 - Relatório de Ocorrências</a></li>
                  <li @click="emitir(300)"><a href="#"> 300 - Extrato de Projetos por Beneficiária</a></li>
                  <!-- 72436 Item 4 - Possibilitar a impressão/PDF da súmula já aprovada -->
                  <li>
                    <a :href="'alteracoesprojeto/sumula/' + id" target="_blank">Visualizar Sumula</a>
                  </li>
                </ul>
              </div>
            </div>
          </span>
        </span>
        <span v-if="!loading.tela && !ehVisualizacao && ((usuarioLogado.userType === 'ENTIDADE' && _.includes(['Solicitação'], etapa))||(usuarioLogado.userType === 'FUNDACAO' && this.usuarioLogado.perfis.some(perfil => perfil.ds_nome === 'Gerentes')))" class="col-md-3 bloco_botoes">
          <g-button-moema  color="error" onclick="alertaCancelamentoDialog.showModal()" type="button"><i class="fa fa-ban" aria-hidden="true"></i> Cancelar processo</g-button-moema>
        </span>

        <span v-if="(!loading.tela || ehVisualizacao) && !_.isEmpty(sumarioQtdeAlteracoes)" class="col-md-3" style="margin: 7px 0px;display: flex;justify-content: space-between;align-items: center;">
          <span @click="alterarModoModificacao('solicitacao')" class="bloco_resumo_alteracao">
            <span v-if="opcoesVisualizacao.solicitacao.modificacoes === 'RESUMIDO'" class="modificacaoResumido">
              <span>{{ _.sumBy(_.values(sumarioQtdeAlteracoes), 'total') }} {{ _.sumBy(_.values(sumarioQtdeAlteracoes), 'total') > 1 ? 'modificações' : 'modificação' }}</span>
            </span>
            <span v-else-if="opcoesVisualizacao.solicitacao.modificacoes === 'DETALHADO'" class="modificacaoDetalhado">
              <span v-if="_.sumBy(_.values(sumarioQtdeAlteracoes), 'exclusao')"  class="modificacaoTotalExclusao">{{  _.sumBy(_.values(sumarioQtdeAlteracoes), 'exclusao') }} {{ (_.sumBy(_.values(sumarioQtdeAlteracoes), 'exclusao')  > 1 ? 'exclusões' : 'exclusão')   }}</span>
              <span v-if="_.sumBy(_.values(sumarioQtdeAlteracoes), 'inclusao')"  class="modificacaoTotalInclusao">{{  _.sumBy(_.values(sumarioQtdeAlteracoes), 'inclusao') }} {{ (_.sumBy(_.values(sumarioQtdeAlteracoes), 'inclusao')  > 1 ? 'inclusões' : 'inclusão')   }}</span>
              <span v-if="_.sumBy(_.values(sumarioQtdeAlteracoes), 'alteracao')" class="modificacaoTotalAlteracao">{{ _.sumBy(_.values(sumarioQtdeAlteracoes), 'alteracao')}} {{ (_.sumBy(_.values(sumarioQtdeAlteracoes), 'alteracao') > 1 ? 'alterações' : 'alteração') }}</span>
            </span>
          </span>

          <span v-if="!_.isEmpty(msgErroProcessamento)" class="icon iconeAlerta pulsingAlerta" :title="'<h5>Mensagens de erro e alertas mais recentes</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', delay: [1000, 0]}"
                @click="$dialog.alert('<p>' + _.join(msgErroProcessamento, '</p>'), {html: true, animation: 'fade', customClass: 'avisoAlerta'}).then(function (dialog) {})">
            <span>!</span>
          </span>

        </span>
      </h1>
    </section>


    <section class="content">

      <div class="row" v-if="_.isEmpty(proposta) && _.isNull(id) && ehVisualizacao && loading.tela">
        <div class="col-md-12 form-horizontal"><div class="box box-body" style="height: 200px"><div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div></div></div>
      </div>

      <!-- Lista de projetos ---------------------------------------------------------------------------------------------------->
      <div class="row" id="listaProjetos" v-if="_.isEmpty(proposta) && _.isNull(id) && !ehVisualizacao">
        <div class="col-md-12 form-horizontal">
          <div class="box box-primary">
            <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

            <div class="box-body">
              <div v-show="listaProjetos.length === 0" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

              <!--Se for solicitacao de uma nova alteração de projeto mostra o campo de seleção de projeto-->
              <span ref="listaProjetosAlteraveis">
                <multiselect v-model="projeto"
                             :options="listaProjetos.validos"
                             :disabled="ehVisualizacao"
                             :multiple="false"
                             placeholder="Selecione um projeto"
                             track-by="ds_codigo_projeto_erp"
                             label="ds_nome"
                             :custom-label="(option) => { return `${option.ds_codigo_projeto_erp + option.ds_nome + option.ds_situacao_erp}`}"
                             :preselect-first="false"
                             :close-on-select="true"
                             selectLabel=""
                             deselectLabel=""
                             selectedLabel=""
                             name="projeto"
                             v-validate="'required'">
                  <template slot="option" slot-scope="props"><strong>{{props.option.ds_codigo_projeto_erp}}</strong> {{props.option.ds_nome}}</template>
                  <template slot="singleLabel" slot-scope="props"><span class="identificadorIDProjeto">{{props.option.ds_codigo_projeto_erp}}</span> {{props.option.ds_nome}}</template>
                  <template slot="noResult">Nenhum projeto localizado!</template>
                </multiselect>
              </span>

              <!--&lt;!&ndash; lista opcional que mostra os projetos não selecionáveis, caso o cliente queira que consta na tela &ndash;&gt;-->
              <!--<p v-show="false">-->
                <!--<multiselect-->
                             <!--:options="listaProjetos.demais"-->
                             <!--:multiple="false"-->
                             <!--placeholder="Projetos indisponíveis"-->
                             <!--label="ds_nome"-->
                             <!--track-by="ds_codigo_projeto_erp"-->
                             <!--:close-on-select="true"-->
                             <!--selectLabel=""-->
                             <!--deselectLabel=""-->
                             <!--selectedLabel=""-->
                             <!--name="projeto"-->
                             <!--v-validate="'required'">-->
                  <!--<template slot="option" slot-scope="props">{{props.option.ds_codigo_projeto_erp}} - {{props.option.ds_nome}}</template>-->
                  <!--<template slot="singleLabel" slot-scope="props"><strong>{{props.option.ds_codigo_projeto_erp}} - {{props.option.ds_nome}}</strong></template>-->
                  <!--<template slot="noResult">Nenhum projeto localizado!</template>-->
                <!--</multiselect>-->
              <!--</p>-->

            </div>
          </div>
        </div>
      </div>

      <!-- Formulário de principal --------------------------------------------------------------------------------------------------------------->
      <div class="row" id="alteracao_projeto" v-if="!_.isEmpty(propostaBackup) || !_.isNull(id)">
        <div class="col-md-12">
          <div class="box box-primary">
            <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

            <div class="box-header">
              <h3 class="box-title">
                {{propostaBackup.ds_codigo_projeto_erp}} - {{propostaBackup.ds_nome}}
                <span v-if="usuarioLogado.userType === 'FUNDACAO' && !loading.tela">(<strong>{{ _.get(propostaBackup, 'projetoSapiens.sitprj', '')}}</strong>)</span>
              </h3>
            </div>
            <div class="box-body">

              <div class="row form-horizontal">
                <div class="col-md-12">
                  <label class="control-label col-md-2">Objetivo Geral:</label>
                  <div class="col-md-10"><div class="form-control-static">{{propostaBackup.ds_objetivo_geral}}</div></div>
                </div>

                <div class="col-md-12">
                  <label class="control-label col-md-2">Período de execução:</label>
                  <div class="col-md-10"><div class="form-control-static">{{ propostaBackup.dt_assinatura_convenio | moment("L") }} a {{ dataFinalBackup }}</div></div>
                </div>

                <div class="col-md-12">
                  <label class="control-label col-md-2">Nome da Instituição:</label>
                  <div class="col-md-10"><div class="form-control-static">{{ _.get(propostaBackup, 'projetoSapiens.entidadeParceira.nomfor', '') }} </div></div>
                </div>

                <div class="col-md-12">
                  <label class="control-label col-md-2">Valor do projeto:</label>
                  <div class="col-md-2"><div class="form-control-static">{{ _.sumBy(_.map(_.filter(_.flatten(_.map(propostaBackup.atividades, 'itens_orcamentos')), function (i) { return _.includes(['1', '5'], ('' + i.origem).substr(0, 1)) }), 'valor_total')) | real }}</div></div>
                  <label class="control-label col-md-2">Valor de contrapartida:</label>
                  <div class="col-md-2"><div class="form-control-static">{{ _.sumBy(_.map(_.filter(_.flatten(_.map(propostaBackup.atividades, 'itens_orcamentos')), function (i) { return _.includes(['2'], ('' + i.origem).substr(0, 1)) }), 'valor_total')) | real }}</div></div>
                </div>

                <div class="col-md-12">
                  <label class="control-label col-md-2">Municipios atendidos:</label>
                  <div class="col-md-10"><div class="form-control-static">{{ _.join(_.uniq(_.map(propostaBackup.municipalizacao, function (m) { return m.ds_municipio + (_.isNil(m.ds_uf) ? '' : ' (' + m.ds_uf + ')') })), ', ') }}</div></div>
                </div>

                <div class="col-md-12">
                  <label class="control-label col-md-2">Projeto superior:</label>
                  <div class="col-md-10"><div class="form-control-static truncar">{{ _.get(propostaBackup, 'projetoSapiens.projetoSuperior.numprj', '') }} - {{ _.get(propostaBackup, 'projetoSapiens.projetoSuperior.nomprj', '') }}</div></div>
                </div>

                <div class="col-md-12 required-field" :class="{ 'has-error' : errors.first('justificativa')}" ref="justificativa">
                  <label class="control-label col-md-2">Justificativa:</label>
                  <div class="col-md-10">
                    <textarea-autosize v-resizable @input="resizable" placeholder="Qual a justificativa para esta solicitação de alteração de projeto"  :min-height="72" :autosize="true"
                                       v-model="solicitacao.justificativa" :disabled="ehVisualizacao || _.includes(['Autorização', 'Deliberação', 'Pendências'], etapa)" name="justificativa" rows="3" class="form-control" v-validate="'required'">
                    </textarea-autosize>
                    <span v-if="errors.first('justificativa')" class="label label-danger"> {{ errors.first('justificativa') }}</span>
                  </div>
                </div>
              </div>

              <div class="row">&nbsp;</div><!-- espaçamento de linha -->

              <div class="form-horizontal">
                <div v-if="_.get(ultimaTarefa, 'observacao', false)" class="alert alert-info alert-dismissible">
                  <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                  <h4><i class="fa fa-warning"></i> Atenção!</h4>
                  <p v-html="ultimaTarefa.observacao"></p>
                </div>

                <div v-if="restricaoParaInicializar.length > 0" class="alert alert-warning alert-dismissible">
                  <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                  <h4><i class="fa fa-warning"></i> Alerta!</h4>
                  <p v-for="restricao in _.uniq(restricaoParaInicializar)">{{restricao}}</p>
                </div>

                <div class="alert alert-info alert-dismissible" v-if="!ehVisualizacao && usuarioLogado.userType !== 'FUNDACAO'">
                  <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                  <h4><i class="fa fa-warning"></i> Alerta!</h4>
                  <p>As alterações solicitadas podem gerar aditivo para assinatura futura</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>


      <div class="row box-header" style="font-size: 16px" v-if="!_.isEmpty(proposta) && _.includes(['Autorização', 'Deliberação', 'Pendências'], etapa)">
        <span class="grupoMostrarOcultar" @click="mostrar.solicitacao = !mostrar.solicitacao"><i :class="'fa fa-caret-' + (mostrar.solicitacao ? 'up' : 'down')" aria-hidden="true"></i> Mostrar Solicitação</span>
      </div>
      <div class="form-horizontal" v-if="!_.isEmpty(proposta)" v-show="mostrar.solicitacao">

        <!-- Período de execução do projeto ------------------------------------------------------------------------------------------------------------------------------------------------------------------->
        <div v-if="_.has(sumarioQtdeAlteracoes, 'ALTERACAO_PERIODO_PROJETO') || (_.includes(_.get(proposta, 'opcoes.alteracoesPermitidas', []), 'periodoProjeto') && !ehVisualizacao && !_.includes(['Autorização', 'Deliberação', 'Pendências'], etapa))">
          <div :class="'box box-widget ' + (_.has(sumarioQtdeAlteracoes, 'ALTERACAO_PERIODO_PROJETO') ? 'bloco_com_alteracao' : '')">
            <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
            <div class="box-header">
              <h3 class="box-title">
                <span class="grupoMostrarOcultar" @click="alterarExpandirBloco('periodo')"><i :class="'fa fa-caret-' + (opcoesVisualizacao.periodo.expandir ? 'up' : 'down')" aria-hidden="true"></i> Período de execução do projeto</span>
              </h3>

              <span v-if="_.has(sumarioQtdeAlteracoes, 'ALTERACAO_PERIODO_PROJETO')" class="bloco_resumo_alteracao" @click="alterarModoModificacao('periodo')">
                <span v-if="opcoesVisualizacao.periodo.modificacoes === 'RESUMIDO'" class="modificacaoResumido">
                  <span>{{ _.get(sumarioQtdeAlteracoes, ['ALTERACAO_PERIODO_PROJETO', 'total']) }} {{ (_.get(sumarioQtdeAlteracoes, ['ALTERACAO_PERIODO_PROJETO', 'total']) > 1 ? 'modificações' : 'modificação') }}</span>
                </span>
                <span v-else-if="opcoesVisualizacao.periodo.modificacoes === 'DETALHADO'" class="modificacaoDetalhado">
                  <span v-if="_.get(sumarioQtdeAlteracoes, ['ALTERACAO_PERIODO_PROJETO', 'exclusao'], 0)  > 0" class="modificacaoTotalExclusao">{{  _.get(sumarioQtdeAlteracoes, ['ALTERACAO_PERIODO_PROJETO', 'exclusao']) }} {{ (_.get(sumarioQtdeAlteracoes, ['ALTERACAO_PERIODO_PROJETO', 'exclusao']) > 1  ? 'exclusões' : 'exclusão')   }}</span>
                  <span v-if="_.get(sumarioQtdeAlteracoes, ['ALTERACAO_PERIODO_PROJETO', 'inclusao'], 0)  > 0" class="modificacaoTotalInclusao">{{  _.get(sumarioQtdeAlteracoes, ['ALTERACAO_PERIODO_PROJETO', 'inclusao']) }} {{ (_.get(sumarioQtdeAlteracoes, ['ALTERACAO_PERIODO_PROJETO', 'inclusao']) > 1  ? 'inclusões' : 'inclusão')   }}</span>
                  <span v-if="_.get(sumarioQtdeAlteracoes, ['ALTERACAO_PERIODO_PROJETO', 'alteracao'], 0) > 0" class="modificacaoTotalAlteracao">{{ _.get(sumarioQtdeAlteracoes, ['ALTERACAO_PERIODO_PROJETO', 'alteracao'])}} {{ (_.get(sumarioQtdeAlteracoes, ['ALTERACAO_PERIODO_PROJETO', 'alteracao']) > 1 ? 'alterações' : 'alteração') }}</span>
                </span>
              </span>

            </div>

            <div class="box-body" v-if="opcoesVisualizacao.periodo.expandir">

              <div class="col-md-9">
                <div class="col-md-12">
                  <!--Data inicial-->
                  <div class="col-md-4">
                    <label class="control-label">Data inicial</label>
                    <div>
                      <div class="form-control" disabled="disabled">{{proposta.dt_assinatura_convenio | moment("L")}}</div>
                    </div>
                  </div>

                  <!--Número de meses do projeto-->
                  <div  class="required-field col-md-4 required" :class="{ 'has-error' : errors.first('periodo')}">
                    <label class="control-label">Número de meses do projeto</label>
                      <div class="input-group" style="display: inline-table;">
                        <span>
                          <input v-model="proposta.nr_periodos" data-vv-as="Número de Meses do Projeto" lang="pt-br" name="periodo" class="form-control" type="number" min="1" :max="proposta.periodo_vigencia" @blur="prepararSolicitacao()"
                                     v-validate="'required|min_value:' + projetoPeriodos + '|max_value:' + proposta.periodo_vigencia" :disabled="ehVisualizacao || _.includes(['Autorização', 'Deliberação', 'Pendências'], etapa)">
                        </span>
                        <span class="input-group-addon valorAlterado" v-if="opcoesVisualizacao.periodo.modificacoes === 'DETALHADO' && _.get(_.find(solicitacao.processos, ['nome', 'ALTERACAO_PERIODO_PROJETO']), 'alteracao.0.nr_periodos.0')" style="width: 50%">
                          {{ _.get(_.find(solicitacao.processos, ['nome', 'ALTERACAO_PERIODO_PROJETO']), 'alteracao.0.nr_periodos.0', 0) }}
                        </span>
                      </div>
                      <span v-if="errors.first('periodo')" class="label label-danger"> {{ errors.first('periodo') }}</span>
                  </div>

                  <!--Data final de execução-->
                  <div class="col-md-4">
                    <label class="control-label">Data final de execução</label>
                    <div>
                      <div class="form-control" disabled="disabled">{{ dataFinal }}</div>
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div class="col-md-4"></div>

                  <!--Número de meses da vigência-->
                  <div  class="required-field col-md-4 required" :class="{ 'has-error' : errors.first('periodoVigencia')}">
                    <label class="control-label">Número de meses de Vigência</label>


                    <div class="input-group" style="display: inline-table;">
                        <span>
                          <input v-model="proposta.periodo_vigencia" data-vv-as="Período Vigência" lang="pt-br" name="periodoVigencia" class="form-control" type="number" max="72" :min="proposta.nr_periodos" @blur="prepararSolicitacao()"
                                 v-validate="'required|min_value:' + proposta.nr_periodos" :disabled="ehVisualizacao || _.includes(['Autorização', 'Deliberação', 'Pendências'], etapa)">
                        </span>
                      <span class="input-group-addon valorAlterado" v-if="opcoesVisualizacao.periodo.modificacoes === 'DETALHADO'  && _.get(_.find(solicitacao.processos, ['nome', 'ALTERACAO_PERIODO_PROJETO']), 'alteracao.0.periodo_vigencia.0')" style="width: 50%">
                        {{ _.get(_.find(solicitacao.processos, ['nome', 'ALTERACAO_PERIODO_PROJETO']), 'alteracao.0.periodo_vigencia.0', 0) }}
                      </span>
                    </div>
                    <span v-if="errors.first('periodoVigencia')" class="label label-danger"> {{ errors.first('periodoVigencia') }}</span>
                  </div>

                  <!--Data final de vigência-->
                  <div class="col-md-4">
                    <label class="control-label">Data final da vigência</label>
                    <div>
                      <div class="form-control" disabled="disabled">{{ dataFinalVigencia | moment("L") }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-3 text-red" v-if="('' + proposta.nr_periodos) !== ('' + propostaBackup.nr_periodos) && _.includes(['Análise', 'Autorização'], etapa) && !ehVisualizacao">
                Atenção: o período foi alterado!<br>Passou de {{propostaBackup.nr_periodos}} meses para {{proposta.nr_periodos}} meses<br><br>
                Verifique se as atividades estão de acordo com o novo período.
              </div>

              <div class="col-md-12" v-if="_.has(proposta, 'historicos.periodos')">
                <br/>
                <span v-if="loading.historicos.periodos"><span class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando histórico de alterações em períodos de execução do projeto...</span></span>
                <span v-else class="grupoMostrarOcultar" @click="mostrar.historicos.periodos = !mostrar.historicos.periodos"><i :class="'fa fa-caret-' + (mostrar.historicos.periodos ? 'up' : 'down')" aria-hidden="true"></i>
                  Histórico de alterações de término do projeto
                </span>
                <div class="table-responsive" v-if="mostrar.historicos.periodos">
                  <b-container fluid>
                    <b-table stacked="md"
                             :items="proposta.historicos.periodos"
                             :bordered="tabela.historicos.periodos.bordered"
                             :fields="tabela.historicos.periodos.fields">

                      <template slot="id" scope="row">{{row.value}}</template>
                      <template slot="acao" scope="row">{{row.value | moment("L") }}</template>
                      <template slot="periodo" scope="row">
                        <span v-if="row.item.acao === 'Contratação'">{{row.item.periodo_inicial}} meses</span>
                        <span v-else class="text-muted">
                          <span class="text-green">{{row.item.periodo_alterado >= 0 ? '+' : ''}}{{row.item.periodo_alterado}}</span> para {{row.item.periodo_final}} meses
                        </span>
                      </template>
                      <template slot="termino_alterado" scope="row">
                        <span>{{row.value | moment("L") }}</span>
                      </template>
                    </b-table>
                  </b-container>
                </div>
              </div>

            </div>
          </div>
        </div>


        <!-- Metas -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
        <div v-if="_.has(sumarioQtdeAlteracoes, 'ALTERACAO_METAS') || (_.includes(_.get(proposta, 'opcoes.alteracoesPermitidas', []), 'metas') && !ehVisualizacao && !_.includes(['Autorização', 'Deliberação', 'Pendências'], etapa))">
          <div :class="'box box-widget ' + (_.has(sumarioQtdeAlteracoes, 'ALTERACAO_METAS') ? 'bloco_com_alteracao' : '')">
            <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
            <div class="box-header">
              <h3 class="box-title">
                <span class="grupoMostrarOcultar" @click="alterarExpandirBloco('metas')"><i :class="'fa fa-caret-' + (opcoesVisualizacao.metas.expandir ? 'up' : 'down')" aria-hidden="true"></i> Metas</span>
              </h3>
              
              <span v-if="_.has(sumarioQtdeAlteracoes, 'ALTERACAO_METAS')" class="bloco_resumo_alteracao" @click="alterarModoModificacao('metas')">
                <span v-if="opcoesVisualizacao.metas.modificacoes === 'RESUMIDO'" class="modificacaoResumido">
                  <span>{{ _.get(sumarioQtdeAlteracoes, ['ALTERACAO_METAS', 'total']) }} {{ (_.get(sumarioQtdeAlteracoes, ['ALTERACAO_METAS', 'total']) > 1 ? 'modificações' : 'modificação') }}</span>
                </span>
                <span v-else-if="opcoesVisualizacao.metas.modificacoes === 'DETALHADO'" class="modificacaoDetalhado">
                  <span v-if="_.get(sumarioQtdeAlteracoes, ['ALTERACAO_METAS', 'exclusao'], 0)  > 0" class="modificacaoTotalExclusao">{{  _.get(sumarioQtdeAlteracoes, ['ALTERACAO_METAS', 'exclusao']) }} {{ (_.get(sumarioQtdeAlteracoes, ['ALTERACAO_METAS', 'exclusao']) > 1  ? 'exclusões' : 'exclusão')   }}</span>
                  <span v-if="_.get(sumarioQtdeAlteracoes, ['ALTERACAO_METAS', 'inclusao'], 0)  > 0" class="modificacaoTotalInclusao">{{  _.get(sumarioQtdeAlteracoes, ['ALTERACAO_METAS', 'inclusao']) }} {{ (_.get(sumarioQtdeAlteracoes, ['ALTERACAO_METAS', 'inclusao']) > 1  ? 'inclusões' : 'inclusão')   }}</span>
                  <span v-if="_.get(sumarioQtdeAlteracoes, ['ALTERACAO_METAS', 'alteracao'], 0) > 0" class="modificacaoTotalAlteracao">{{ _.get(sumarioQtdeAlteracoes, ['ALTERACAO_METAS', 'alteracao'])}} {{ (_.get(sumarioQtdeAlteracoes, ['ALTERACAO_METAS', 'alteracao']) > 1 ? 'alterações' : 'alteração') }}</span>
                </span>
              </span>

            </div>

            <div class="box-body" v-if="opcoesVisualizacao.metas.expandir">
              <metas
                :editavel="!ehVisualizacao && !_.includes(['Autorização', 'Deliberação', 'Pendências'], etapa)"
                :propsObjetivos="proposta.objetivos"
                :propsMetas="proposta.metas"
                :propsProposta="proposta"
                :propsPropostaBackup="propostaBackup"
                :atvSemMetas="atvSemMetas"
                :processo-solicitacao="_.find(solicitacao.processos, ['nome', 'ALTERACAO_METAS'])"
                :modo-visualizacao-alteracoes="opcoesVisualizacao.metas.modificacoes"
                @acaoAtualizaSolicitacoes="prepararSolicitacao()"
                @metaAdicionada="proposta.metas = $event"
                @validacaoMetas="adicionaRestricao($event)">
              </metas>
            </div>
          </div>
        </div>


        <!--Atividades ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
        <div ref="atividades" v-if="_.has(sumarioQtdeAlteracoes, 'ALTERACAO_ATIVIDADES') || (_.includes(_.get(proposta, 'opcoes.alteracoesPermitidas', []), 'atividades') && !ehVisualizacao && !_.includes(['Autorização', 'Deliberação', 'Pendências'], etapa))">
          <div :class="'box box-widget ' + (_.has(sumarioQtdeAlteracoes, 'ALTERACAO_ATIVIDADES') ? 'bloco_com_alteracao' : '')">
          <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
            <div class="box-header">
              <h3 class="box-title">
                <span class="grupoMostrarOcultar" @click="alterarExpandirBloco('atividades')"><i :class="'fa fa-caret-' + (opcoesVisualizacao.atividades.expandir ? 'up' : 'down')" aria-hidden="true"></i> Atividades</span>
              </h3>
              
              <span v-if="_.has(sumarioQtdeAlteracoes, 'ALTERACAO_ATIVIDADES')" class="bloco_resumo_alteracao" @click="alterarModoModificacao('atividades')">
                <span v-if="opcoesVisualizacao.atividades.modificacoes === 'RESUMIDO'" class="modificacaoResumido">
                  <span>{{ _.get(sumarioQtdeAlteracoes, ['ALTERACAO_ATIVIDADES', 'total']) }} {{ (_.get(sumarioQtdeAlteracoes, ['ALTERACAO_ATIVIDADES', 'total']) > 1 ? 'modificações' : 'modificação') }}</span>
                </span>
                <span v-else-if="opcoesVisualizacao.atividades.modificacoes === 'DETALHADO'" class="modificacaoDetalhado">
                  <span v-if="_.get(sumarioQtdeAlteracoes, ['ALTERACAO_ATIVIDADES', 'exclusao'], 0)  > 0" class="modificacaoTotalExclusao">{{  _.get(sumarioQtdeAlteracoes, ['ALTERACAO_ATIVIDADES', 'exclusao']) }} {{ (_.get(sumarioQtdeAlteracoes, ['ALTERACAO_ATIVIDADES', 'exclusao']) > 1  ? 'exclusões' : 'exclusão')   }}</span>
                  <span v-if="_.get(sumarioQtdeAlteracoes, ['ALTERACAO_ATIVIDADES', 'inclusao'], 0)  > 0" class="modificacaoTotalInclusao">{{  _.get(sumarioQtdeAlteracoes, ['ALTERACAO_ATIVIDADES', 'inclusao']) }} {{ (_.get(sumarioQtdeAlteracoes, ['ALTERACAO_ATIVIDADES', 'inclusao']) > 1  ? 'inclusões' : 'inclusão')   }}</span>
                  <span v-if="_.get(sumarioQtdeAlteracoes, ['ALTERACAO_ATIVIDADES', 'alteracao'], 0) > 0" class="modificacaoTotalAlteracao">{{ _.get(sumarioQtdeAlteracoes, ['ALTERACAO_ATIVIDADES', 'alteracao'])}} {{ (_.get(sumarioQtdeAlteracoes, ['ALTERACAO_ATIVIDADES', 'alteracao']) > 1 ? 'alterações' : 'alteração') }}</span>
                </span>
              </span>
              
            </div>

            <div class="box-body" v-if="opcoesVisualizacao.atividades.expandir">
              <atividades
                :novaAtividade="criarAtividade"
                :editavel="!ehVisualizacao && !_.includes(['Autorização', 'Deliberação', 'Pendências'], etapa)"
                :meses="proposta.nr_periodos"
                :propsMetas="proposta.metas"
                :propsAtividades="proposta.atividades"
                :propsProposta="proposta"
                :propsPropostaBackup="propostaBackup"
                :atualizar="numeroAtualizacao"
                :processo-solicitacao="_.find(solicitacao.processos, ['nome', 'ALTERACAO_ATIVIDADES'])"
                :modo-visualizacao-alteracoes="opcoesVisualizacao.atividades.modificacoes"
                @acaoAtualizaSolicitacoes="prepararSolicitacao()"
                @atividadeAdicionada="proposta.atividades = $event"
                @validacaoAtividades="adicionaRestricao($event)">
              </atividades>
            </div>
          </div>
        </div>


        <!--Cronograma com o Extrato de execução do projeto --------------------------------------------------------------------------------------------------------------------------------------------------->
        <div v-if="(_.has(sumarioQtdeAlteracoes, 'REMANEJAMENTO') || _.has(sumarioQtdeAlteracoes, 'SUPLEMENTACAO') || (_.intersection(_.get(proposta, 'opcoes.alteracoesPermitidas', []), ['remanejamento', 'suplementacao'])).length > 0 && !ehVisualizacao && !_.includes(['Autorização', 'Deliberação', 'Pendências'], etapa))">
          <div :class="'box box-widget ' + (_.has(sumarioQtdeAlteracoes, 'REMANEJAMENTO') || _.has(sumarioQtdeAlteracoes, 'SUPLEMENTACAO') ? 'bloco_com_alteracao' : '')">
            <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block; z-index: 700"><i class="fa fa-refresh fa-spin"></i></div>
            <div class="box-header">
              <h3 class="box-title" style="width: 100%">
                <span style="display: flex; justify-content: space-between;">

                  <span class="grupoMostrarOcultar" @click="alterarExpandirBloco('extratoProjeto')"><i :class="'fa fa-caret-' + (opcoesVisualizacao.extratoProjeto.expandir ? 'up' : 'down')" aria-hidden="true"></i> Extrato do cronograma</span>

                  <span>
                    <span v-if="ehVisualizacao || _.includes(['Autorização', 'Deliberação', 'Pendências'], etapa)" class="text-blue">
                      {{ tipoAlteracaoCronograma === 'REMANEJAMENTO' ? 'Remanejamento' : 'Suplementação' }}
                    </span>
                    <span v-else>
                      <span v-if="(_.intersection(_.get(proposta, 'opcoes.alteracoesPermitidas', []), ['remanejamento', 'suplementacao'])).length > 1">
                        <span style="font-size: small; color: var(--cor-fraca-dark)">
                          <label class="new-control new-control-radio" v-bind:style="'padding-top: 10px;' + (tipoAlteracaoCronograma === 'REMANEJAMENTO' ? 'color: var(--cor-azul);' : '')"
                                 :title="'<h5>Remanejamento permite alterar o cronograma aumentando e subtraindo valores desde que a soma final seja zero</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}">
                            <input type="radio" name="tipoAlteracaoCronograma" :value="'REMANEJAMENTO'" v-model="tipoAlteracaoCronograma"/> Remanejamento<div class="new-control-indicator"></div>
                          </label>
                          <label class="new-control new-control-radio" v-bind:style="'padding-top: 10px;' + (tipoAlteracaoCronograma === 'SUPLEMENTACAO' ? 'color: var(--cor-azul);' : '') + 'margin-left: 20px'"
                                 :title="'<h5>Suplemetação permite aumentar o valor do projeto, aumentando orçamento de itens ou criando novos</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}">
                            <input type="radio" name="tipoAlteracaoCronograma" :value="'SUPLEMENTACAO'" v-model="tipoAlteracaoCronograma"/> Suplementação<div class="new-control-indicator"></div>
                          </label>
                        </span>
                      </span>
                      <span v-else>
                        <!-- só tem uma opção (remanejamento ou suplementação -->
                      </span>
                    </span>
                  </span>

                  <span class="text-danger" style="font-size: small;" v-if="_.includes(_.get(proposta, 'opcoes.alteracoesPermitidas', []), 'suplementacao') && !ehVisualizacao && !_.includes(['Autorização', 'Deliberação', 'Pendências'], etapa)">{{tipoAlteracaoCronograma === 'SUPLEMENTACAO' ? 'A suplementação não deve ultrapassar 25%' : ''}}</span>

                  <span v-if="_.has(sumarioQtdeAlteracoes, 'REMANEJAMENTO') || _.has(sumarioQtdeAlteracoes, 'SUPLEMENTACAO')" class="bloco_resumo_alteracao" @click="alterarModoModificacao('extratoProjeto')">
                    <span v-if="opcoesVisualizacao.extratoProjeto.modificacoes === 'RESUMIDO'" class="modificacaoResumido">
                      <span>{{ _.get(sumarioQtdeAlteracoes, ['REMANEJAMENTO', 'total'], _.get(sumarioQtdeAlteracoes, ['SUPLEMENTACAO', 'total'], '')) }} {{ (_.get(sumarioQtdeAlteracoes, ['REMANEJAMENTO', 'total'], _.get(sumarioQtdeAlteracoes, ['SUPLEMENTACAO', 'total'], 0)) > 1 ? 'modificações' : 'modificação') }}</span>
                    </span>
                    <span v-else-if="opcoesVisualizacao.extratoProjeto.modificacoes === 'DETALHADO'" class="modificacaoDetalhado">
                      <span v-if="_.get(sumarioQtdeAlteracoes, ['REMANEJAMENTO', 'exclusao'],  _.get(sumarioQtdeAlteracoes, ['SUPLEMENTACAO', 'exclusao'], 0))  > 0" class="modificacaoTotalExclusao">{{  _.get(sumarioQtdeAlteracoes, ['REMANEJAMENTO', 'exclusao'],  _.get(sumarioQtdeAlteracoes, ['SUPLEMENTACAO', 'exclusao']))  }} {{ (_.get(sumarioQtdeAlteracoes, ['REMANEJAMENTO', 'exclusao'],  _.get(sumarioQtdeAlteracoes, ['SUPLEMENTACAO', 'exclusao'], 0))  > 1 ? 'exclusões'  : 'exclusão')  }}</span>
                      <span v-if="_.get(sumarioQtdeAlteracoes, ['REMANEJAMENTO', 'inclusao'],  _.get(sumarioQtdeAlteracoes, ['SUPLEMENTACAO', 'inclusao'], 0))  > 0" class="modificacaoTotalInclusao">{{  _.get(sumarioQtdeAlteracoes, ['REMANEJAMENTO', 'inclusao'],  _.get(sumarioQtdeAlteracoes, ['SUPLEMENTACAO', 'inclusao']))  }} {{ (_.get(sumarioQtdeAlteracoes, ['REMANEJAMENTO', 'inclusao'],  _.get(sumarioQtdeAlteracoes, ['SUPLEMENTACAO', 'inclusao'], 0))  > 1 ? 'inclusões'  : 'inclusão')  }}</span>
                      <span v-if="_.get(sumarioQtdeAlteracoes, ['REMANEJAMENTO', 'alteracao'], _.get(sumarioQtdeAlteracoes, ['SUPLEMENTACAO', 'alteracao'], 0)) > 0" class="modificacaoTotalAlteracao">{{ _.get(sumarioQtdeAlteracoes, ['REMANEJAMENTO', 'alteracao'], _.get(sumarioQtdeAlteracoes, ['SUPLEMENTACAO', 'alteracao'])) }} {{ (_.get(sumarioQtdeAlteracoes, ['REMANEJAMENTO', 'alteracao'], _.get(sumarioQtdeAlteracoes, ['SUPLEMENTACAO', 'alteracao'], 0)) > 1 ? 'alterações' : 'alteração') }}</span>
                    </span>
                  </span>

                </span>
              </h3>
            </div>

            <div class="box-body" v-if="opcoesVisualizacao.extratoProjeto.expandir">
              <extrato
                ref="extratoCronograma"
                :editavel="!ehVisualizacao && !_.includes(['Autorização', 'Deliberação', 'Pendências'], etapa)"
                :etapa="'SOLICITACAO'"
                :tipo-solicitacao="tipoAlteracaoCronograma"
                :layout="'classico'"
                :itensLayout="etapa === 'Análise' ? ['filtroItens', 'substituicaoItem'] : []"
                :propsObjetivos="proposta.objetivos"
                :propsAtividades="proposta.atividades"
                :metas="proposta.metas"
                :proposta="proposta"
                :meses="proposta.nr_periodos"
                :projetoDuplicacao="proposta.nr_projeto_duplicacao"
                :filtro-inicial="ehVisualizacao ? ['solicitados'] : (_.includes(['REMANEJAMENTO', 'SUPLEMENTACAO'], _.map(solicitacao.processos, 'nome')) && _.includes(['Análise', 'Autorização', 'Deliberação', 'Pendências'], etapa) ? ['solicitados'] : [])"
                :processo-solicitacao="{'processo': processo, 'solicitacao': _.find(solicitacao.processos, ['nome', tipoAlteracaoCronograma])}"
                :modo-visualizacao-alteracoes="opcoesVisualizacao.extratoProjeto.modificacoes"
                :atualizar-extrato="!_.includes(['FEITO', 'CANCELADO'], _.get(processo, 'situacao', ''))"
                :processoSolicitacao="solicitacao"
                @acaoOk="prepararSolicitacao()"
                @acaoTotaisAtualizados="passarTotaisExtratoParaSumula($event)"
                @cronogramaAtividades="proposta.atividades = $event"
                @alteracoesCronograma="cronogramaAlteracoes = $event"
                @validacaoCronograma="adicionaRestricao($event)"
                @criacaoAtividade="criarAtividade = $event">
              </extrato>

              <!--Gantt -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
              <div>
                <visualiza-gestao-atividades
                  :editavel="!ehVisualizacao && !_.includes(['Autorização', 'Deliberação', 'Pendências'], etapa)"
                  :itensLayout="['opcoes']"
                  :propsNumeroProjeto="proposta.ds_codigo_projeto_erp"
                  :key="'GANTT-' + numeroAtualizacao"
                  :propsAtividades="proposta.atividades"
                  :atividades-alteradas="listaIdsAtividadesAlteradas"
                  :proposta="proposta"
                  :atualizar-gantt="!_.includes(['FEITO', 'CANCELADO'], _.get(processo, 'situacao', ''))"
                  @atividadesProposta="proposta.atividades = $event"
                  @atividadesGantt="proposta.gantt_atividades = $event"
                  @atividadesAlteracoes="proposta.gantt_alterado = $event"
                  @validacaoAtividadesGantt="adicionaRestricao($event)">
                </visualiza-gestao-atividades>
              </div>

            </div>

          </div>
        </div>


        <!-- Parcela de adiantamento -------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
        <div v-show="_.has(sumarioQtdeAlteracoes, 'ALTERACAO_PARCELAS_ADIANTAMENTO') || (_.includes(_.get(proposta, 'opcoes.alteracoesPermitidas', []), 'parcelasAdiantamento') && !ehVisualizacao && !_.includes(['Autorização', 'Deliberação', 'Pendências'], etapa))">
          <div :class="'box box-widget ' + (_.has(sumarioQtdeAlteracoes, 'ALTERACAO_PARCELAS_ADIANTAMENTO') ? 'bloco_com_alteracao' : '')">
            <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
            <div class="box-header">
              <h3 class="box-title">
                <span class="grupoMostrarOcultar" @click="alterarExpandirBloco('parcelasAdiantamento')"><i :class="'fa fa-caret-' + (opcoesVisualizacao.parcelasAdiantamento.expandir ? 'up' : 'down')" aria-hidden="true"></i> Parcelas de Adiantamento</span>
              </h3>
              
              <span v-if="_.has(sumarioQtdeAlteracoes, 'ALTERACAO_PARCELAS_ADIANTAMENTO')" class="bloco_resumo_alteracao" @click="alterarModoModificacao('parcelasAdiantamento')">
                <span v-if="opcoesVisualizacao.parcelasAdiantamento.modificacoes === 'RESUMIDO'" class="modificacaoResumido">
                  <span>{{ _.get(sumarioQtdeAlteracoes, ['ALTERACAO_PARCELAS_ADIANTAMENTO', 'total']) }} {{ (_.get(sumarioQtdeAlteracoes, ['ALTERACAO_PARCELAS_ADIANTAMENTO', 'total']) > 1 ? 'modificações' : 'modificação') }}</span>
                </span>
                <span v-else-if="opcoesVisualizacao.parcelasAdiantamento.modificacoes === 'DETALHADO'" class="modificacaoDetalhado">
                  <span v-if="_.get(sumarioQtdeAlteracoes, ['ALTERACAO_PARCELAS_ADIANTAMENTO', 'exclusao'], 0)  > 0" class="modificacaoTotalExclusao">{{  _.get(sumarioQtdeAlteracoes, ['ALTERACAO_PARCELAS_ADIANTAMENTO', 'exclusao']) }} {{ (_.get(sumarioQtdeAlteracoes, ['ALTERACAO_PARCELAS_ADIANTAMENTO', 'exclusao']) > 1  ? 'exclusões' : 'exclusão')   }}</span>
                  <span v-if="_.get(sumarioQtdeAlteracoes, ['ALTERACAO_PARCELAS_ADIANTAMENTO', 'inclusao'], 0)  > 0" class="modificacaoTotalInclusao">{{  _.get(sumarioQtdeAlteracoes, ['ALTERACAO_PARCELAS_ADIANTAMENTO', 'inclusao']) }} {{ (_.get(sumarioQtdeAlteracoes, ['ALTERACAO_PARCELAS_ADIANTAMENTO', 'inclusao']) > 1  ? 'inclusões' : 'inclusão')   }}</span>
                  <span v-if="_.get(sumarioQtdeAlteracoes, ['ALTERACAO_PARCELAS_ADIANTAMENTO', 'alteracao'], 0) > 0" class="modificacaoTotalAlteracao">{{ _.get(sumarioQtdeAlteracoes, ['ALTERACAO_PARCELAS_ADIANTAMENTO', 'alteracao'])}} {{ (_.get(sumarioQtdeAlteracoes, ['ALTERACAO_PARCELAS_ADIANTAMENTO', 'alteracao']) > 1 ? 'alterações' : 'alteração') }}</span>
                </span>
              </span>
              
            </div>

            <div class="box-body" v-show="opcoesVisualizacao.parcelasAdiantamento.expandir">
              <parcela-adiantamento
                :alteracaoProjeto="true"
                :editavel="!ehVisualizacao && !_.includes(['Autorização', 'Deliberação', 'Pendências'], etapa)"
                :propsProposta="proposta"
                :propsPropostaBackup="propostaBackup"
                :propsParcelas="_.get(proposta, 'adiantamentos', [])"
                :propsLayout="'EXECUCAO'"
                :propsAtividades="proposta.atividades"
                :atualizar="numeroAtualizacao"
                :processo-solicitacao="_.find(solicitacao.processos, ['nome', 'ALTERACAO_PARCELAS_ADIANTAMENTO'])"
                :modo-visualizacao-alteracoes="opcoesVisualizacao.parcelasAdiantamento.modificacoes"
                @acaoAtualizaSolicitacoes="prepararSolicitacao()"
                @parcelaAdicionada="proposta.adiantamentos = $event"
                @validacaoParcelasAdiantamento="adicionaRestricao($event)">
              </parcela-adiantamento>
            </div>
          </div>
        </div>


        <!-- Municípios -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
        <div v-show="_.has(sumarioQtdeAlteracoes, 'ALTERACAO_MUNICIPIOS') || (_.includes(_.get(proposta, 'opcoes.alteracoesPermitidas', []), 'municipios') && !ehVisualizacao && !_.includes(['Autorização', 'Deliberação', 'Pendências'], etapa))">
          <div :class="'box box-widget ' + (_.has(sumarioQtdeAlteracoes, 'ALTERACAO_MUNICIPIOS') ? 'bloco_com_alteracao' : '')">
            <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
            <div class="box-header">
              <h3 class="box-title">
                <span class="grupoMostrarOcultar" @click="alterarExpandirBloco('municipios')"><i :class="'fa fa-caret-' + (opcoesVisualizacao.municipios.expandir ? 'up' : 'down')" aria-hidden="true"></i> Municípios - Locais de execução</span>
              </h3>
              
              <span v-if="_.has(sumarioQtdeAlteracoes, 'ALTERACAO_MUNICIPIOS')" class="bloco_resumo_alteracao" @click="alterarModoModificacao('municipios')">
                <span v-if="opcoesVisualizacao.municipios.modificacoes === 'RESUMIDO'" class="modificacaoResumido">
                  <span>{{ _.get(sumarioQtdeAlteracoes, ['ALTERACAO_MUNICIPIOS', 'total']) }} {{ (_.get(sumarioQtdeAlteracoes, ['ALTERACAO_MUNICIPIOS', 'total']) > 1 ? 'modificações' : 'modificação') }}</span>
                </span>
                <span v-else-if="opcoesVisualizacao.municipios.modificacoes === 'DETALHADO'" class="modificacaoDetalhado">
                  <span v-if="_.get(sumarioQtdeAlteracoes, ['ALTERACAO_MUNICIPIOS', 'exclusao'], 0)  > 0" class="modificacaoTotalExclusao">{{  _.get(sumarioQtdeAlteracoes, ['ALTERACAO_MUNICIPIOS', 'exclusao']) }} {{ (_.get(sumarioQtdeAlteracoes, ['ALTERACAO_MUNICIPIOS', 'exclusao']) > 1  ? 'exclusões' : 'exclusão')   }}</span>
                  <span v-if="_.get(sumarioQtdeAlteracoes, ['ALTERACAO_MUNICIPIOS', 'inclusao'], 0)  > 0" class="modificacaoTotalInclusao">{{  _.get(sumarioQtdeAlteracoes, ['ALTERACAO_MUNICIPIOS', 'inclusao']) }} {{ (_.get(sumarioQtdeAlteracoes, ['ALTERACAO_MUNICIPIOS', 'inclusao']) > 1  ? 'inclusões' : 'inclusão')   }}</span>
                  <span v-if="_.get(sumarioQtdeAlteracoes, ['ALTERACAO_MUNICIPIOS', 'alteracao'], 0) > 0" class="modificacaoTotalAlteracao">{{ _.get(sumarioQtdeAlteracoes, ['ALTERACAO_MUNICIPIOS', 'alteracao'])}} {{ (_.get(sumarioQtdeAlteracoes, ['ALTERACAO_MUNICIPIOS', 'alteracao']) > 1 ? 'alterações' : 'alteração') }}</span>
                </span>
              </span>
              
            </div>

            <div class="box-body" v-show="opcoesVisualizacao.municipios.expandir">
              <municipalizacao
                :editavel="!ehVisualizacao && !_.includes(['Autorização', 'Deliberação', 'Pendências'], etapa)"
                :propsProposta="proposta"
                :propsPropostaBackup="propostaBackup"
                :propsLayout="_.includes(['Análise'], etapa) ? ['COM_BOTOES_DISTRIBUICAO'] : ['SEM_BOTOES_DISTRIBUICAO']"
                :atualizar="numeroAtualizacao"
                :processo-solicitacao="_.find(solicitacao.processos, ['nome', 'ALTERACAO_MUNICIPIOS'])"
                :modo-visualizacao-alteracoes="opcoesVisualizacao.municipios.modificacoes"
                @acaoAtualizaSolicitacoes="prepararSolicitacao()"
                @municipioAdicionado="proposta.municipalizacao = $event"
                @validacaoMunicipio="adicionaRestricao($event)">
              </municipalizacao>
            </div>
          </div>
        </div>


        <!-- Bloco de "Li e estou ciente" --------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
        <div v-if="usuarioLogado.userType !== 'FUNDACAO' && (_.includes(poderes, 'PERMITE_CONCLUIR') || !_.includes(['Solicitação', 'Revisão'], etapa))">
          <div class="box box-widget">
            <div class="box-body">
              <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
              <div :class="'col-md-12 alert alert-dismissible ' + (solicitacao.instrumentosLidos.ok ? 'alert-success' : (_.find(errors.items, ['field', 'instrumentosLidos']) ? 'alert-danger' : 'alert-warning'))" style="margin-bottom: 0"
                    ref="instrumentosLidos">
                <div :class="'col-md-' + (!_.isNull(solicitacao.instrumentosLidos.usuario) ? '8' : '12')">
                  <h4><i class="fa fa-warning"></i> Atenção!</h4>
                  <div class="juntos">
                    <span v-if="_.includes(['Solicitação', 'Revisão'], etapa)">
                      <i @click="solicitacao.instrumentosLidos.ok = !solicitacao.instrumentosLidos.ok; _.remove(errors.items, ['field', 'instrumentosLidos'])" :class="(solicitacao.instrumentosLidos.ok ? 'fa fa-check-square-o selecionado' : 'fa fa-square-o')" aria-hidden="true" style="cursor: pointer"></i>
                    </span>
                    <span :class="solicitacao.instrumentosLidos.ok ? 'selecionado' : ''"> Li e estou ciente das cláusulas do instrumento e seus aditivos</span>
                  </div>
                </div>
                <div class="col-md-4 text-right" v-if="!_.isNull(solicitacao.instrumentosLidos.usuario)">
                  {{ solicitacao.instrumentosLidos.usuario.ds_nome_usuario }}<br>
                  {{ solicitacao.instrumentosLidos.data | moment('DD/MM/YYYY HH:MM:SS') }}
                </div>
                <span v-if="_.find(errors.items, ['field', 'instrumentosLidos'])" class="label label-danger"> Deve ler os instrumentos legais. Após isso selecione a opção acima</span>
              </div>
            </div>
          </div>
        </div>
              <!-- Súmula e Nota Técnica ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
      <div v-if="!_.isEmpty(proposta)">
        <div class="box box-widget">
          <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
          <div class="box-header">
            <h3 class="box-title">
              <span class="grupoMostrarOcultar" @click="mostrar.anexos = !mostrar.anexos"><i :class="'fa fa-caret-' + (mostrar.anexos ? 'up' : 'down')" aria-hidden="true"></i>
                Anexos
              </span>
            </h3>
          </div>
          <div class="box-body" v-if="mostrar.anexos">
            <div class="form-horizontal col-md-12">
              <upload-documentos-online
                :idProcesso="id"
                :propDocumentos="solicitacao.anexos"
                :documentTypes="''"
                :ehVisualizacao="ehVisualizacao"
                :secaoOrigem="'ALTERACOES_PROJETO'"
                :local-uso="etapa === 'Deliberação' ? 'ALTERACOES_PROJETOS_NT_SML' : (etapa === 'Pendências' ? 'ALTERACOES_PROJETOS_ADT_PLT' : 'ALTERACOES_PROJETOS_ANEXOS')"
                :vigencia-obrigatoria="[2, 6, 40, 67]"
                :docs-informa-vencimento="[2, 6, 40, 67]"
                @arquivoAnexado="solicitacao.anexos.push($event)"
                @arquivoExcluido="_.remove(solicitacao.anexos, ['id', $event.id])"
                @layoutAtual=""
                @acaoSalvar="processarSolicitacao('SALVAR')"
                @acaoOk=""
                @acaoCancelar=""
                @acaoProcessamento="loading.tela = true"
                @acaoAguardando="loading.tela = false">
              </upload-documentos-online>
            </div>
          </div>
        </div>
      </div>


        <!-- Histórico ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
        <div v-if="etapa !== 'Solicitação'">
          <div class="box box-widget">
            <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
            <div class="box-header">
              <h3 class="box-title">
                <span class="grupoMostrarOcultar" @click="mostrar.historicos.tarefas = !mostrar.historicos.tarefas"><i :class="'fa fa-caret-' + (mostrar.historicos.tarefas ? 'up' : 'down')" aria-hidden="true"></i> Históricos tarefas</span>
              </h3>

              <span v-if="usuarioLogado.userType === 'FUNDACAO'" class="bloco_resumo_alteracao">
                <div class="btn-group dropdown">
                  <div class="btn-group">
                    <button data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="border: 0; background: transparent"> Modo {{ _.get(this.opcoesVisualizacao, 'historico.modo', 'PADRAO') === 'PADRAO' ? 'Padrão' : 'Completo' }} <i class="fa fa-caret-down" aria-hidden="true"></i></button>
                    <ul class="dropdown-menu">
                      <li @click="filtrarHistoricoPorModo('PADRAO')"><a href="#"> Padrão</a></li> <!-- mostra tarefas de usuário estendido -->
                      <li @click="filtrarHistoricoPorModo('COMPLETO')"><a href="#"> Completo</a></li> <!-- mostra todos os registros -->
                    </ul>
                  </div>
                </div>
              </span>
            </div>

            <div class="box-body" v-if="mostrar.historicos.tarefas">
              <table class="table table-condensed table-bordered" ref="historico_solicitacao">
                <thead class="">
                <tr>
                  <th>Etapa</th>
                  <th style="text-align: center; width: 120px">Data</th>
                  <th class="text-center">Usuário</th>
                  <th>Observação</th>
                </tr>
                </thead>
                <tbody class="">
                <tr v-for="tarefa in tarefas" v-if="_.get(tarefa, 'mostrar', true)" :class="_.includes(['INCLUSAO_DOCUMENTO', 'EXCLUSAO_DOCUMENTO', 'RecPrv_at_com_senior_g5_co_mfi_prj_recursosprevistosgrid', 'INSERINDO_RECURSOS_SAPIENS', 'VISUALIZACAO'], tarefa.nome) ? 'text-muted' : (_.get(opcoesVisualizacao, 'historico.modo', 'PADRAO') === 'PADRAO' ? '' : 'bg-gray-light')">
                  <td class="col-md-2">{{ _.get(tarefaNome, tarefa.nome, '!') }}</td>
                  <td class="col-md-2 text-center">{{ tarefa.termino | moment('DD/MM/YYYY HH:MM') }}</td>
                  <td class="col-md-3 truncar" style="width: 100px;">{{ tarefa.ds_nome_usuario }}</td>
                  <td class="col-md-5">{{ tarefa.observacao }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>


      <!-- Súmula ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
      <span v-if="usuarioLogado.userType === 'FUNDACAO' && !_.isEmpty(proposta) && _.includes(['Autorização', 'Deliberação', 'Pendências'], etapa)">
        <div class="row box-header" style="font-size: 16px">
          <span class="grupoMostrarOcultar" @click="mostrar.sumula = !mostrar.sumula"><i :class="'fa fa-caret-' + (mostrar.sumula ? 'up' : 'down')" aria-hidden="true"></i> Mostrar Súmula</span>
        </div>
        <div class="form-horizontal" v-show="mostrar.sumula">
          <sumula
            :id-processo="id"
            :props-proposta="proposta"
            :props-solicitacao="solicitacao">
          </sumula>
        </div>
      </span>

      <!-- Aditivo ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
      <div v-if="usuarioLogado.userType === 'FUNDACAO' && !_.isEmpty(proposta) && !_.isNull(id) && _.includes(['Pendências'], etapa) && _.find(solicitacao.sumula.providencias, function(p) { return _.includes(['PLT', 'ADT'], p.codigo) })">
        <div class="box box-widget">
          <div v-show="loading.tela || loading.aditivo.conteudo" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

          <div class="box-header">
            <h3 class="box-title">
              <span class="grupoMostrarOcultar" @click="mostrar.aditivo = !mostrar.aditivo"><i :class="'fa fa-caret-' + (mostrar.aditivo ? 'up' : 'down')" aria-hidden="true"></i>
                {{ _.join(_.map(_.filter(solicitacao.sumula.providencias, function(p) { return _.includes(['PLT', 'ADT'], p.codigo) }), 'descricao'), ' e ') }}
              </span>
            </h3>
          </div>

          <div class="box-body" v-if="mostrar.aditivo">
            <div class="form-horizontal">
              <div class="col-md-12 form-group">
                <label class="control-label col-md-2">Modelo de minuta:</label>
                <div class="col-md-6" ref="lista aditivo">
                  <span v-if="loading.aditivo.lista" class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando lista com modelos de minutas disponíveis...</span>
                  <span v-else>
                    <multiselect v-model="solicitacao.aditivo.modelo" :options="listaMinutasAditivo"
                                 :multiple="false"
                                 :close-on-select="true"
                                 :placeholder="'Selecione um modelo de minuta dentre os disponíveis'"
                                 track-by="id"
                                 :custom-label="(option) => { return `${option.nome}`}"
                                 :preselect-first="false"
                                 @select="verificaSeHaAditivoUsando($event)"
                                 selectLabel=""
                                 deselectLabel=""
                                 selectedLabel=""
                                 name="lista aditivo"
                                 v-validate="'required'"
                                 :disabled="ehVisualizacao">
                      <span slot="noResult"><span class="text-red">Nenhum registro localizado!</span></span>
                    </multiselect>
                    <span v-if="errors.first('lista aditivo')" class="label label-danger"> Deve selecionar um modelo de minuta</span>
                  </span>
                </div>
                <div class="col-md-4">
                  <g-button-moema color="warning" @click.native="processarSolicitacao('SALVAR', 'aditivo')" v-if="!loading.aditivo.lista"
                                  :title="'<h5>Salva a minuta atual e abre ela para impressão em nova guia</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}">
                    <i class="fa fa-external-link" aria-hidden="true"></i> Visualizar Minuta</g-button-moema>

                  <g-button-moema color="primary" @click.native="processarSolicitacao('SALVAR', 'plano-trabalho')" class="pull-right">
                    <i class="fa fa-external-link" aria-hidden="true"></i> Plano de Trabalho</g-button-moema>
                </div>
              </div>

              <div class="col-md-12 form-group" v-if="!_.isEmpty(solicitacao.aditivo.modelo)">
                <div class="col-md-12 etiquetaCarregando" v-if="loading.aditivo.conteudo"><i class="fa fa-refresh fa-spin"></i> Carregando modelo do documento...</div>
                <div class="col-md-11" v-else :ref="'refQuillEditor_' + quillOptions.theme" id="modeloMinutaEdicao">
                  <quill-editor
                    v-model="solicitacao.aditivo.conteudo"
                    :disabled="ehVisualizacao"
                    :theme="barra"
                    :options="quillOptions">
                  </quill-editor>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>


      <!-- Decisões ----------------------------------------------------------------------------->
      <div class="row" v-if="usuarioLogado.userType === 'FUNDACAO' && !_.isEmpty(proposta) && _.includes(['Análise', 'Autorização', 'Deliberação', 'Pendências'], etapa) && !ehVisualizacao">
        <div class="col-md-12 form-horizontal">
          <div class="box box-primary">
            <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

            <div class="box-header with-border">
              <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> {{ etapa === 'Análise' ? 'Análise da Proposta' : 'Decisão' }}
                <span v-if="_.includes(['Autorização', 'Deliberação', 'Pendências'], etapa)" style="margin-left: 30px; height: 0">
                  <g-button-moema color="warning" @click.native="processarSolicitacao('SALVAR', 'sumula')"><i class="fa fa-external-link" aria-hidden="true"></i> Súmula</g-button-moema>
                </span>
              </h3>
            </div>

            <div class="form-horizontal">

              <div class="box-body">
                <div class="row">
                  <div class="col-md-12">
                    <div class="form-group required col-md-12">

                      <div class="col-md-12" ref="decisão">
                        <!-- Aprovação -------------------------------------------------->
                        <label class="new-control new-control-radio" style="padding-top: 8px;">
                          <input type="radio" name="decisão" :disabled="ehVisualizacao" v-model="decisao.encaminhamento" v-validate="'required'" :value="
                                    etapa === 'Análise' ? 'AUTORIZACAO' : (
                                    etapa === 'Autorização' ?
                                      (solicitacao.sumula.alcada.codigo === 'DIRETOR_OU_GER_SOLUCOES' ?
                                        (solicitacao.sumula.providencias.length > 0 ? 'PENDENCIAS' : 'CONCLUSAO') : 'DELIBERACAO') : (
                                    etapa === 'Deliberação' ?
                                      (solicitacao.sumula.providencias.length > 0 ? 'PENDENCIAS' : 'CONCLUSAO') : (
                                    etapa === 'Pendências' ? 'CONCLUSAO' : '')))"/>
                           {{ etapa === 'Análise' ? 'Registro de Parecer' : 'Aprovar' }}
                          <div class="new-control-indicator"></div>

                          <span v-if="_.includes(['DELIBERACAO', 'PENDENCIAS', 'CONCLUSAO'], decisao.encaminhamento)" style="font-weight: normal;font-style: italic;">
                            <span v-if="_.includes(['CONCLUSAO'], decisao.encaminhamento)"> (concluir e finalizar o processo)</span>
                            <span v-else> (encaminhar para {{ tarefaNome[decisao.encaminhamento] }})</span>
                          </span>
                        </label>

                        <!--Observação Opcional Aprovação------------------------------------------->
                        <div class="col-md-12" v-if="decisao.encaminhamento === 'PENDENCIAS' || decisao.encaminhamento === 'DELIBERACAO'">
                            <div class="col-md-12">
                            <label for="justificativa_aprovacao" class="control-label">Observação Opcional:</label>
                            <textarea name="observacao_aprovacao" v-model="decisao.observacao" rows="3"  class="form-control" :disabled="ehVisualizacao"></textarea>
                            </div>
                        </div>

                        <!-- Preenchimento Súmula -------------------------------------------------->
                        <div class="col-md-12" v-if="(etapa === 'Análise' && decisao.encaminhamento === 'AUTORIZACAO')">
                          <div class="col-md-12">
                            <table class="sumula_formulario">
                              <tr v-for="(pergunta, idx) in _.filter(solicitacao.sumula.questionario, function(q) { return !_.includes(['Q011', 'Q012', 'Q013', 'Q014'], q.codigo) })" class="sumula_pergunta">
                                <td class="sumula_codigo">{{ idx + 1 }}</td>
                                <td class="sumula_questao">
                                  <span v-html="pergunta.questao"></span>
                                  <span v-if="!loading.ocorrencias && _.includes(['Q005'], pergunta.codigo)" class="link_acesso pad10" @click="executarRegrasQuestoes([pergunta.codigo], 'ATUALIZA_CONSULTA')">atualiza!</span>
                                </td>
                                <td class="sumula_resposta">
                                  <span><input v-model="pergunta.resposta" value="sim" type="radio" :name="'respostaSumulaQuestao' + pergunta.codigo" @change="executarRegrasQuestoes([pergunta.codigo])" /> Sim</span>
                                  <span><input v-model="pergunta.resposta" value="nao" type="radio" :name="'respostaSumulaQuestao' + pergunta.codigo" @change="executarRegrasQuestoes([pergunta.codigo])" /> Não</span>
                                  <span><input v-model="pergunta.resposta" value="pre" type="radio" :name="'respostaSumulaQuestao' + pergunta.codigo" @change="executarRegrasQuestoes([pergunta.codigo])" /> Prej.</span>
                                </td>
                              </tr>
                              <tr class="sumula_cabecalho_questoes">
                                <td class="sumula_codigo">&nbsp;</td>
                                <td class="sumula_questao"><label>Parceria Estratégica?</label></td>
                                <td class="sumula_resposta" ref="parceriaEstrategica">
                                  <span class="required-field" :class="{ 'has-error' : errors.first('parceriaEstrategica')}">
                                    <span><input v-model="solicitacao.sumula.parceriaEstrategica" value="sim" type="radio" name="parceriaEstrategica" v-validate="'required'"/> Sim</span>
                                    <span><input v-model="solicitacao.sumula.parceriaEstrategica" value="nao" type="radio" name="parceriaEstrategica" v-validate="'required'"/> Não</span>
                                  </span>
                                  <span v-if="errors.first('parceriaEstrategica')" class="label label-danger"> Selecione uma opção</span>
                                </td>
                              </tr>
                              <tr v-for="(pergunta, idx) in _.filter(solicitacao.sumula.questionario, function(q) { return _.includes(['Q011', 'Q012', 'Q013', 'Q014'], q.codigo) })" class="sumula_pergunta" v-if="solicitacao.sumula.parceriaEstrategica === 'sim'">
                                <td class="sumula_codigo">{{ idx + (_.filter(solicitacao.sumula.questionario, function(q) { return !_.includes(['Q011', 'Q012', 'Q013', 'Q014'], q.codigo) })).length + 1}}</td>
                                <td class="sumula_questao" v-html="pergunta.questao"></td>
                                <td class="sumula_resposta">
                                  <span><input v-model="pergunta.resposta" value="sim" type="radio" :name="'respostaSumulaQuestao' + pergunta.codigo" @change="executarRegrasQuestoes([pergunta.codigo])" /> Sim</span>
                                  <span><input v-model="pergunta.resposta" value="nao" type="radio" :name="'respostaSumulaQuestao' + pergunta.codigo" @change="executarRegrasQuestoes([pergunta.codigo])" /> Não</span>
                                  <span><input v-model="pergunta.resposta" value="pre" type="radio" :name="'respostaSumulaQuestao' + pergunta.codigo" @change="executarRegrasQuestoes([pergunta.codigo])" /> Prej.</span>
                                </td>
                              </tr>

                              <tr class="sumula_cabecalho_questoes">
                                <td class="sumula_codigo">&nbsp;</td>
                                <td class="sumula_questao"><label>Houve ajustes nas quantidades dos itens de despesa?</label></td>
                                <td class="sumula_resposta" ref="ajusteQuantidade" >
                                  <span class="required-field" :class="{ 'has-error' : errors.first('parceriaEstrategica')}">
                                    <span><input v-model="solicitacao.sumula.resumoAlteracoes.ajusteQuantidade" value="1" type="radio" name="ajusteQuantidade" v-validate="'required'"/> Sim</span>
                                    <span><input v-model="solicitacao.sumula.resumoAlteracoes.ajusteQuantidade" value="0" type="radio" name="ajusteQuantidade" v-validate="'required'"/> Não</span>
                                  </span>
                                  <span v-if="errors.first('ajusteQuantidade')" class="label label-danger"> Indique se houve esse ajuste</span>
                                </td>
                              </tr>

                              <tr class="sumula_cabecalho_questoes" v-if="_.find(solicitacao.processos, [nome, 'REMANEJAMENTO'])">
                                <td class="sumula_codigo">&nbsp;</td>
                                <td class="sumula_questao"><label>Percentual dos Remanejamentos Concedidos</label></td>
                                <td class="sumula_resposta" ref="percentualRemanejamentosConcedidos">
                                  <span class="indicadores-cb-inline" style="display: flex;align-items: center;">
                                    <div class="required-field" :class="{ 'has-error' : errors.first('percentualRemanejamentosConcedidos')}">
                                      <input v-model="solicitacao.sumula.resumoAlteracoes.percentualRemanejamentosConcedidos" value="0" class="form-control" type="number" name="percentualRemanejamentosConcedidos"
                                             v-validate="'required|min:0|max:100'" min="0" max="100"/>
                                    </div>
                                    <div style="margin-left: 10px">%</div>
                                  </span>
                                  <span v-if="errors.first('percentualRemanejamentosConcedidos')" class="label label-danger"> Percentual deve estar entre 0 e 100</span>
                                </td>
                              </tr>

                              <tr class="sumula_cabecalho_questoes" v-if="_.find(solicitacao.processos, [nome, 'SUPLEMENTACAO'])">
                                <td class="sumula_codigo">&nbsp;</td>
                                <td class="sumula_questao"><label>Enquadramento orçamentário (FEP)</label></td>
                                <td class="sumula_resposta" ref="enquadramentoOrcamentarioFEP">
                                  <div>
                                    <input v-model="solicitacao.sumula.resumoAlteracoes.enquadramentoOrcamentarioFEP" value="0" class="form-control" type="number" name="enquadramentoOrcamentarioFEP"/>
                                  </div>
                                </td>
                              </tr>

                              <tr class="sumula_cabecalho_questoes">
                                <td class="sumula_codigo">&nbsp;</td>
                                <td class="sumula_questao" colspan="2">
                                  <label class="control-label pull-left">Outras alterações</label>
                                  <div class="pull-right" style="width: 80%; margin-right: -10px;">
                                    <input v-model="solicitacao.sumula.resumoAlteracoes.outrasAlteracoes" value="" class="form-control" type="text" name="outrasAlteracoes"/>
                                  </div>
                                </td>
                              </tr>

                            </table>
                          </div>

                          <div class="col-md-12">&nbsp;</div><!-- espaçamento de linha -->

                          <div class="">
                            <h4 class="box-title"> Análise:</h4>
                          </div>

                          <div class="box-body">
                            <!-- Contexto da análise -->
                            <div class="col-md-12 required-field" :class="{ 'has-error' : errors.first('sumula_contexto')}" ref="sumula_contexto" >
                              <label class="control-label">Contexto:</label>
                              <textarea-autosize v-resizable @input="resizable" :placeholder="'Informe o Contexto da análise ref. este ID ' + id"  :min-height="72" :autosize="true"
                                                 v-model="solicitacao.sumula.textoContexto" :disabled="ehVisualizacao || etapa !== 'Análise'" name="sumula_contexto" rows="3" class="form-control" v-validate="'required'">
                              </textarea-autosize>
                              <span v-if="errors.first('sumula_contexto')" class="label label-danger"> Informe o contexto da análise</span>
                            </div>

                            <!-- Situação Problema da análise -->
                            <div class="col-md-12 required-field" :class="{ 'has-error' : errors.first('sumula_situacao_problema')}" ref="sumula_situacao_problema" >
                              <label class="control-label">Situação Problema:</label>
                              <textarea-autosize v-resizable @input="resizable" :placeholder="'Informe a Situação Problema que será analisada ref. este ID ' + id"  :min-height="72" :autosize="true"
                                                 v-model="solicitacao.sumula.textoSituacaoProblema" :disabled="ehVisualizacao || etapa !== 'Análise'" name="sumula_situacao_problema" rows="3" class="form-control" v-validate="'required'">
                              </textarea-autosize>
                              <span v-if="errors.first('sumula_situacao_problema')" class="label label-danger"> Descreva a situação problema para esta solicitação</span>
                            </div>

                            <!-- Parecer da análise -->
                            <div class="col-md-12 required-field" :class="{ 'has-error' : errors.first('sumula_parecer')}" ref="sumula_parecer" >
                              <label class="control-label">Parecer:</label>
                              <textarea-autosize v-resizable @input="resizable" :placeholder="'Informe o Parecer para deliberação ref. este ID ' + id"  :min-height="72" :autosize="true"
                                                 v-model="solicitacao.sumula.textoParecer" :disabled="ehVisualizacao || etapa !== 'Análise'" name="sumula_parecer" rows="3" class="form-control" v-validate="'required'">
                              </textarea-autosize>
                              <span v-if="errors.first('sumula_parecer')" class="label label-danger"> Informe o parecer desta análise</span>
                            </div>

                            <!-- Proposta da análise -->
                            <div class="col-md-12 required-field" :class="{ 'has-error' : errors.first('sumula_proposta')}" ref="sumula_proposta" >
                              <label class="control-label">Proposta:</label>
                              <textarea-autosize v-resizable @input="resizable" :placeholder="'Informe sua proposta para deliberação ref. este ID ' + id"  :min-height="72" :autosize="true"
                                                 v-model="solicitacao.sumula.textoProposta" :disabled="ehVisualizacao || etapa !== 'Análise'" name="sumula_proposta" rows="3" class="form-control" v-validate="'required'">
                              </textarea-autosize>
                              <span v-if="errors.first('sumula_proposta')" class="label label-danger"> Informe a proposta para a solicitação</span>
                            </div>

                          </div>

                          <div class="col-md-12">&nbsp;</div><!-- espaçamento de linha -->

                          <div class="col-md-12" ref="providencias">
                            <label class="control-label col-md-2">Providências:</label>
                            <div class="col-md-10">
                              <multiselect v-model="solicitacao.sumula.providencias" :options="listaProvidencias"
                                           :multiple="true"
                                           :close-on-select="false"
                                           :placeholder="'Selecione uma ou mais providências para efetivação desta solicitação ID ' + id"
                                           track-by="codigo"
                                           :custom-label="(option) => { return `${option.descricao}`}"
                                           selectLabel=""
                                           deselectLabel=""
                                           selectedLabel="Selecionado"
                                           name="providencias"
                                           :disabled="ehVisualizacao || etapa !== 'Análise'">
                                <span slot="noResult"><span class="text-red">Nenhum registro localizado!</span></span>
                              </multiselect>
                            </div>
                          </div>

                          <div class="col-md-12">&nbsp;</div><!-- espaçamento de linha -->

                          <div class="col-md-12 required-field" :class="{ 'has-error' : errors.first('alcada')}" ref="alcada">
                            <label class="control-label col-md-2">Alçada:</label>
                            <div class="col-md-10">
                              <multiselect v-model="solicitacao.sumula.alcada" :options="listaAlcadas"
                                           :multiple="false"
                                           :close-on-select="true"
                                           :placeholder="'Selecione a alçada para esta solicitação ID ' + id"
                                           track-by="codigo"
                                           :custom-label="(option) => { return `${option.descricao}`}"
                                           selectLabel=""
                                           deselectLabel=""
                                           selectedLabel="Selecionado"
                                           name="alcada"
                                           v-validate="'required'"
                                           :disabled="ehVisualizacao || etapa !== 'Análise'">
                                <span slot="noResult"><span class="text-red">Nenhum registro localizado!</span></span>
                              </multiselect>
                              <span v-if="errors.first('alcada')" class="label label-danger"> Deve selecionar a alçada</span>
                            </div>
                          </div>

                          <div class="col-md-12">&nbsp;</div><!-- espaçamento de linha -->

                          <!-- Enquadramento para o conjunto de alterações (Externalidade, Eficiência, FBB etc) -------------------------------------------------->
                          <div class="col-md-12 required-field" :class="{ 'has-error' : errors.first('motivo alteracao')}" ref="motivo alteracao">
                            <label class="control-label col-md-2">Motivo:</label>
                            <div class="col-md-10">
                              <span v-if="loading.motivosSolicitacao" class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando lista de motivos para este conjunto de alterações...</span>
                              <span v-else>
                                  <multiselect v-model="solicitacao.motivoAlteracao" :options="motivosSolicitacao"
                                               :multiple="false"
                                               :close-on-select="true"
                                               :clear-on-select="true"
                                               :hide-selected="false"
                                               :preserve-search="true"
                                               :placeholder="'Selecione um enquadramento para as alterações dessa solicitação ID ' + id"
                                               track-by="codigo"
                                               :custom-label="(option) => { return `${option.descricao}`}"
                                               :preselect-first="false"
                                               selectLabel=""
                                               deselectLabel=""
                                               selectedLabel="Selecionado"
                                               name="motivo alteracao"
                                               data-vv-as="Motivo da alteração"
                                               v-validate="'required'"
                                               :disabled="ehVisualizacao">
                                    <span slot="noResult"><span class="text-red">Nenhum registro localizado!</span></span>
                                  </multiselect>
                                  <span v-if="errors.first('motivo alteracao')" class="label label-danger"> Deve selecionar um motivo para este conjunto de alterações</span>
                                </span>
                            </div>
                          </div>
                        </div>


                        <div class="form-group col-md-12" v-if="(_.includes(['Autorização', 'Deliberação', 'Pendências'], etapa) && decisao.encaminhamento === 'CONCLUSAO')">
                         <!--Observação opcional da aprovação -->
                          <div class="col-md-12" v-if="_.includes(['Análise', 'Autorização', 'Deliberação', 'Pendências'], etapa)">
                            <div class="col-md-12">
                              <label class="control-label" :title="'<h5>Observação opcional. Algo escrito aqui ficará no histórico público do processo</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}"><i class="fa fa-exclamation-circle text-muted"></i> Observação:</label>
                              <textarea name="observacao_decisao" v-model="decisao.observacao" rows="3" class="form-control" :disabled="ehVisualizacao"></textarea>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Devolver para autorização -------------------------------------------------->
                      <div class="col-md-12" v-if="_.includes(['Pendências'], etapa)">
                        <label class="new-control new-control-radio" style="padding-top: 8px;">
                          <input type="radio" name="decisão" value="AUTORIZACAO" :disabled="ehVisualizacao"
                                 v-model="decisao.encaminhamento" v-validate="'required'"/> {{ 'Devolver para autorização' }}
                          <div class="new-control-indicator"></div>
                        </label>
                      </div>

                      <!-- Reanalisar -------------------------------------------------->
                      <div class="col-md-12" v-if="_.includes(['Autorização', 'Deliberação', 'Pendências'], etapa)">
                        <label class="new-control new-control-radio" style="padding-top: 8px;">
                          <input type="radio" name="decisão" value="ANALISE" :disabled="ehVisualizacao"
                                 v-model="decisao.encaminhamento" v-validate="'required'"/> {{ 'Devolver para ajuste do analista' }}
                          <div class="new-control-indicator"></div>
                        </label>

                        <!-- Motivo para reanalisar -->
                        <div class="col-md-12">
                          <div v-if="decisao.encaminhamento === 'ANALISE'"
                               class="required-field col-md-12" :class="{ 'has-error' : errors.first('justificativa reanalise')}">
                            <label for="justificativa_reanalise" class="control-label">Motivo para reanalisar:</label>
                            <textarea name="justificativa reanalise" v-model="decisao.observacao" rows="3" id="justificativa_reanalise" class="form-control" v-validate="'required'" :disabled="ehVisualizacao"></textarea>
                            <span v-if="errors.first('justificativa reanalise')" class="label label-danger"> {{ errors.first('justificativa reanalise') }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Revisão da entidade -------------------------------------------------->
                      <div class="col-md-12" v-if="etapa === 'Análise'">
                        <label class="new-control new-control-radio" style="padding-top: 8px;">
                          <input type="radio" name="decisão" value="REVISAO" :disabled="ehVisualizacao"
                                 v-model="decisao.encaminhamento" v-validate="'required'"/> Devolver para revisão da entidade
                          <div class="new-control-indicator"></div>
                        </label>

                        <div class="form-group col-md-12">
                          <div class="col-md-12">
                            <div class="required-field col-md-12" v-if="decisao.encaminhamento === 'REVISAO'" :class="{'has-error' : errors.first('motivo de devolucao')}" ref="motivo de devolucao">
                              <label class="control-label">Motivo de devolução:</label>
                              <div>
                                <multiselect v-model="solicitacao.motivosDevolucao"
                                             :options="listMotivosDevolucao"
                                             :multiple="true"
                                             :close-on-select="true"
                                             placeholder="Selecione um ou mais motivos para Devolução da solicitação à entidade"
                                             :custom-label="(option) => {return `${option.descricao}`}"
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

                          <!-- Justificativa de devolução para entidade -->
                          <div class="col-md-12">
                            <div v-if="decisao.encaminhamento === 'REVISAO'" class="required-field col-md-12" :class="{ 'has-error' : errors.first('justificativa')}">
                              <label class="control-label">Observação para revisão:</label>
                              <textarea name="motivo para revisão" ref="motivo para revisão" v-model="decisao.observacao" rows="3" class="form-control" v-validate="'required'" :disabled="ehVisualizacao"></textarea>
                              <span v-if="errors.first('motivo para revisão')" class="label label-danger"> {{ errors.first('motivo para revisão') }}</span>
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

      </div>


    </section>

    <dialog ref="alertaCancelamentoDialog" id="alertaCancelamentoDialog">
      <p><strong>Atenção!</strong> </p>
      <p style="margin:25px 0">
        Confirma o cancelamento da solicitação de alteração?
      </p>
      <p>
        Justificativa (obrigatório)
      </p>
      <textarea v-model="justificativaCancelamento" type="text" style="width: 100%; border: none; padding: 10px; margin:0 0 10px 0; color: #222" placeholder="Escreva a justificativa (min. 10 caracteres)"></textarea>
      <div style="text-align: right;" >
        <button class="btn btn-neutral" onclick="alertaCancelamentoDialog.close()" style="margin: 0 10px;">Fechar</button>
        <button class="btn btn-danger" @click="cancelarProcesso()" :disabled="justificativaCancelamento.length < 10">Sim, cancelar o processo</button>
      </div>
    </dialog>

  </div>


</template>

<script>
  import { mapGetters } from 'vuex'
  import extenso from 'extenso'
  import Metas from '../../../components/modules/metas'
  import ParcelaAdiantamento from '../../../components/modules/parcela-adiantamento'
  import Municipalizacao from '../../../components/modules/municipalizacao'
  import Extrato from '../../../components/modules/extrato'
  import VisualizaGestaoAtividades from '../../../components/projetos/GestaoAtividades'
  import Atividades from '../../../components/modules/atividades'
  import moment from 'moment'
  import UploadDocumentosPhp from '../../../components/modules/uploadDocumentosPhp'
  import UploadDocumentosOnline from '../../../components/cadastro/articulacao/UploadDocumentosOnline'
  import PlanoTrabalho from '../../proposta/PlanoTrabalho'
  import Sumula from '../../modules/sumula'
import _ from 'lodash'

  export default {
    components: {
      PlanoTrabalho,
      Metas,
      ParcelaAdiantamento,
      Municipalizacao,
      Extrato,
      VisualizaGestaoAtividades,
      Atividades,
      UploadDocumentosOnline,
      UploadDocumentosPhp,
      Sumula
    },
    name: 'alteracoes-projeto',
    data () {
      return {
        justificativaCancelamento: '',
        id: null,
        processo: null,
        etapa: 'Solicitação',
        quillOptions: {
          theme: 'snow'
        },
        historico: [],
        dados: {
          periodo: {
            dt_assinatura_convenio: null,
            nr_periodos: null,
            periodo_vigencia: null,
            dt_data_vigencia: null
          }
        },
        loading: {
          tela: false,
          projeto: false,
          motivosSolicitacao: false,
          planoTrabalho: false,
          notaTecnica: false,
          aditivo: {
            lista: false,
            conteudo: false
          },
          historicos: {
            periodos: false
          },
          ocorrencias: false,
          poderes: false
        },
        mostrar: {
          sumula: true,
          aditivo: false,
          planoTrabalho: false,
          notaTecnica: false,
          solicitacao: true,
          anexos: true,
          historicos: {
            periodos: true,
            tarefas: true
          }
        },
        justificativa: null,
        tarefas: [],
        ultimaTarefa: {},
        anexos: [],
        proposta: {},
        propostaBackup: {},
        atvSemMetas: [],
        criarAtividade: false,
        tabela: {
          historicos: {
            periodos: {
              bordered: true,
              fields: [
                { key: 'id', label: 'ID', thStyle: 'text-align: center; width: 10%', class: 'text-center' },
                { key: 'acao', label: 'Momento', thStyle: 'text-align: center; width: 15%', class: 'text-center' },
                { key: 'periodo', label: 'Períodos', thStyle: 'text-align: center; width: 20%', class: 'text-center' },
                { key: 'termino_alterado', label: 'Término do projeto', thStyle: 'text-align: center; width: 15%', class: 'text-center' }
              ]
            }
          }
        },
        numeroAtualizacao: 0,
        projetoPeriodos: 0,
        dataFinalExecucao: '',
        //
        chamado: [],
        listaProjetos: {
          validos: [],
          demais: []
        },
        projeto: {},
        desabilitarDatasFuturas: {
          from: new Date() // Desabilitar todas as datas depois desta (neste caso não permite data depois de hoje)
        },
        desabilitarDatasPassadas: {
          to: new Date() // Desabilitar todas as datas antes desta (neste caso não permite data antes de hoje)
        },
        municipiosUf: [],
        ehProjetoEspecial: false,
        //
        tipoAlteracaoCronograma: null,
        decisao: {
          encaminhamento: 'ANALISE'
        },
        analiseTributaria: {},
        layoutExtrato: 'classico',
        extratoFiltrosSelecionados: this.$route.name === 'solicitacao-contrapartida' ? ['saldos'] : ['saldos', 'fundacao'],
        adiantamentosFiltrosSelecionados: ['adiantamento_pendente'],
        sumarioQtdeAlteracoes: {},
        totais: {
          projeto: {
            fbb: {
              orcado: 0,
              solicitado: 0,
              saldo: 0
            },
            parceiros: {
              orcado: 0,
              solicitado: 0,
              saldo: 0
            },
            contrapartida: {
              orcado: 0,
              solicitado: 0,
              saldo: 0
            },
            total: {
              orcado: 0,
              solicitado: 0,
              saldo: 0
            }
          },
          adiantamento: {
            fbb: {
              orcado: 0,
              solicitado: 0,
              saldo: 0
            },
            parceiros: {
              orcado: 0,
              solicitado: 0,
              saldo: 0
            },
            total: {
              orcado: 0,
              solicitado: 0,
              saldo: 0
            }
          }
        },
        restricaoParaInicializar: [],
        restricaoParaConcluir: [],
        msgErroProcessamento: [],
        solicitacao: {
          instrumentosLidos: {
            ok: false,
            usuario: null,
            data: null
          },
          justificativa: null,
          motivosDevolucao: [],
          anexos: [],
          processos: [],
          aditivo: {
            modelo: {},
            conteudo: ''
          },
          planoTrabalho: {
            conteudo: {}
          },
          notaTecnica: {
            conteudo: {}
          },
          sumula: {
            textoAnalise: null,
            textoProposta: null,
            textoContexto: null,
            textoSituacaoProblema: null,
            textoParecer: null,
            questionario: [],
            parceriaEstrategica: null,
            providencias: [],
            resumoAlteracoes: {
              metas: 0,
              contrapartidas: 0,
              substituicaoItens: 0,
              ajusteQuantidade: 0,
              novosItens: 0,
              prorrogacaoExecucao: [0, 0],
              prorrogacaoVigencia: [0, 0],
              municipiosAlterados: 0,
              percentualRemanejamentosConcedidos: 0,
              percentualRemanejamentoSolicitado: 0,
              percentualRemanejamentoAcumulado: 0,
              valorSuplementacao: 0,
              valorRemanejado: 0,
              valorTotalComSuplementacao: 0,
              enquadramentoOrcamentarioFEP: null,
              outrasAlteracoes: null
            },
            alcada: {}
          }
        },
        opcoesVisualizacao: {
          solicitacao: {expandir: true, modificacoes: 'RESUMIDO'},
          periodo: {expandir: true, modificacoes: 'RESUMIDO'},
          metas: {expandir: true, modificacoes: 'RESUMIDO'},
          atividades: {expandir: true, modificacoes: 'RESUMIDO'},
          extratoProjeto: {expandir: true, modificacoes: 'RESUMIDO'},
          parcelasAdiantamento: {expandir: true, modificacoes: 'RESUMIDO'},
          municipios: {expandir: true, modificacoes: 'RESUMIDO'},
          historico: {expandir: true, modo: 'PADRAO'}
        },
        ehVisualizacao: false,
        validacao: {},
        registrosAlteracoes: [],
        cronogramaAlteracoes: [],
        ocorrencias: [],
        listaProvidencias: [{'codigo': 'PLT', 'descricao': 'Plano de Trabalho'}, {'codigo': 'ADT', 'descricao': 'Termo Aditivo'}, {'codigo': 'NT', 'descricao': 'Nota Técnica'}, {'codigo': 'SML', 'descricao': 'Súmula'}],
        listaAlcadas: [{'codigo': 'DIRETOR_OU_GER_SOLUCOES', 'descricao': 'Um Membro da Diretoria Executiva ou um Gerente de Soluções'}, {'codigo': '2_GER_SOLUCOES', 'descricao': '2 Gerentes de Solução da mesma Diretoria em conjunto'}, {'codigo': 'DIRETOR_E_GER_SOLUCOES', 'descricao': 'Um membro da Diretoria Executiva, em Conjunto com um Gerente de Soluções'}, {'codigo': 'CDS', 'descricao': 'Comitê de Desenvolvimento Social'}, {'codigo': 'CE', 'descricao': 'Comitê Estratégico'}],
        listaQuestionarioAnalise: [{'codigo': 'Q001', 'questao': 'Há concordância da convenente com a proposta de alteração quando de iniciativa da Fundação?', 'resposta': null}, {'codigo': 'Q002', 'questao': 'Há alteração nos objetivos específicos, metas e indicadores previstos no projeto?', 'resposta': null}, {'codigo': 'Q003', 'questao': 'Há impacto da alteração proposta no prazo de execução estabelecido?', 'resposta': null}, {'codigo': 'Q004', 'questao': 'Há impacto da alteração proposta nos resultados esperados do projeto?', 'resposta': null}, {'codigo': 'Q005', 'questao': 'Existem ocorrências restritivas para aprovação da alteração proposta, registrados no sistema informatizado da Fundação?', 'resposta': null}, {'codigo': 'Q006', 'questao': 'Foram apresentados orçamentos ou há enquadramento dos valores orçados aos parâmetros operacionais estabelecidos pela Fundação? Em caso negativo, registre a(s) justificativa(s) para apoio superior ao previsto no campo "Análise".', 'resposta': null}, {'codigo': 'Q009', 'questao': 'Há ajuste ou glosa realizados na proposta apresentada? Em caso afirmativo, registre a justificativa e itens alterados no campo "Análise".', 'resposta': null}, {'codigo': 'Q010', 'questao': 'A alteração proposta demanda formalização de termo aditivo?', 'resposta': null}, {'codigo': 'Q011', 'questao': 'Existem itens de despesas que não podem ser custeados, conforme as disposições gerais e as instruções específicas do SIC 13.3.7?', 'resposta': null}, {'codigo': 'Q012', 'questao': 'As certidões estão válidas, quando previstas em instruções específicas do SIC 13.3.7?', 'resposta': null}, {'codigo': 'Q013', 'questao': 'Consta autorização recebida do parceiro estratégico, conforme instruções específicas do SIC 13.3.7?', 'resposta': null}, {'codigo': 'Q014', 'questao': 'Foram cumpridas outras exigências previstas em instruções específicas do SIC 13.3.7?', 'resposta': null}, {'codigo': 'Q015', 'questao': 'Há compatibilidade da alteração proposta com os objetivos, as metas e as atividades do projeto?', 'resposta': null}],
        listaMinutasAditivo: [],
        listaIdsAtividadesAlteradas: [],
        listaRelatoriosSapiens: [{'codigo': 248, 'descricao': '248 - Monitoramento Administrativo'}, {'codigo': 300, 'descricao': '300 - Extrato de Projetos por Beneficiária'}],
        tarefaNome: {'ANALISE': 'Análise', 'AUTORIZACAO': 'Autorização', 'REVISAO': 'Revisão', 'SOLICITACAO': 'Solicitação', 'DELIBERACAO': 'Deliberação', 'PENDENCIAS': 'Pendências', 'CANCELADO': 'Processo Cancelado', 'CONCLUSAO': 'Conclusão', 'TAREFA_REATIVADA': 'Tarefa Reativada', 'TAREFA_ASSUMIDA': 'Tarefa Assumida', 'DEVOLVE_ATRIBUICAO': 'Devolvido para a Caixa', 'ENVIADO_ANALISE': 'Enviado para Análise', 'DEVOLVIDO_ANALISE': 'Devolvido para Análise', 'ENVIADO_REVISAO': 'Enviado para Revisão da Entidade', 'ENVIADO_AUTORIZACAO': 'Enviado para Autorização', 'DEVOLVIDO_AUTORIZACAO': 'Devolvido para Autorização', 'ENVIADO_DELIBERACAO': 'Enviado para Deliberação', 'DEVOLVIDO_DELIBERACAO': 'Devolvido para Deliberação', 'ENVIADO_PENDENCIAS': 'Enviado para Pendências', 'DEVOLVIDO_PENDENCIAS': 'Devolvido para Pendências', 'INCLUSAO_DOCUMENTO': 'Documento anexado', 'EXCLUSAO_DOCUMENTO': 'Documento excluído', 'RecPrv_at_com_senior_g5_co_mfi_prj_recursosprevistosgrid': 'Aprovação de Recurso', 'INSERINDO_RECURSOS_SAPIENS': 'Gravando Recurso', 'VISUALIZACAO': 'Visualizando a solicitação'},
        descricaoProcesso: {'PAGAMENTO': 'Pagamento', 'PRESTACAO_DE_CONTAS': 'Prestação de Contas', 'CONTRAPARTIDA': 'Contrapartida', 'RESSARCIMENTO': 'Ressarcimento'},
        poderes: [],
        motivosSolicitacao: [],
        listMotivosDevolucao: [],
        erroCronograma: false
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ]),
      dataFinalVigencia: function () {
        if (this.proposta.dt_assinatura_convenio) {
          this.proposta.dt_data_vigencia = moment(this.proposta.dt_assinatura_convenio).add(parseInt(this.proposta.periodo_vigencia), 'M').format('YYYY-MM-DD')
        } else {
          if (this.proposta.dt_data_inicial) {
            this.proposta.dt_data_vigencia = moment(this.proposta.dt_data_inicial).add(parseInt(this.proposta.periodo_vigencia), 'M').format('YYYY-MM-DD')
          }
        }
        return this.proposta.dt_data_vigencia
      },
      dataFinal: function () {
        if (this.proposta.dt_assinatura_convenio) {
          this.dataFinalExecucao = moment(this.proposta.dt_assinatura_convenio).add(this.proposta.nr_periodos, 'M').format('DD/MM/YYYY')
          return this.dataFinalExecucao
        }
      },
      dataFinalBackup: function () {
        if (this.propostaBackup.dt_assinatura_convenio) {
          return moment(this.propostaBackup.dt_assinatura_convenio).add(this.propostaBackup.nr_periodos, 'M').format('DD/MM/YYYY')
        }
      }
    },
    watch: {
      projeto: function () {
        if (!this.$route.path.startsWith('/solicitacao/alteracoesprojeto/visualizacao') && _.has(this.projeto, 'ds_codigo_projeto_erp') && !_.isEmpty(this.projeto.ds_codigo_projeto_erp)) {
          this.carregarDados({'numero': this.projeto.ds_codigo_projeto_erp})
        }
      },
      tipoAlteracaoCronograma: function () {
        this.prepararSolicitacao()
      },
      'solicitacao.processos': {
        handler: function (newValue, oldValue) {
          // Verifica se algo realmente mudou nos processos, compara o anterior com o atual
          if (_.isEqual(newValue, oldValue)) {
            return
          }
          this.numeroAtualizacao++
        },
        deep: true
      }
    },
    mounted () {
    },
    created () {
      console.clear()
      if (_.has(this.$route.params, 'visualizacao')) {
        this.ehVisualizacao = this.$route.params.visualizacao
      }
      this.ehVisualizacao = this.$route.path.startsWith('/solicitacao/alteracoesprojeto/visualizacao') ? true : this.ehVisualizacao
      if (this.usuarioLogado.userType !== 'FUNDACAO' || this.ehVisualizacao) { // Quando o usuário não for da FBB ou for visualização
        _.forEach(this.opcoesVisualizacao, function (opc) { // Resetar todas as opções de visualização
          _.set(opc, 'expandir', false)
          _.set(opc, 'modificacoes', null)
        })
      } else { // Se for usuário da Fundação BB
        let opcoesVisualizacao = _.merge(this.opcoesVisualizacao, _.get(this.usuarioLogado, 'configuracoes.alteracoes_projeto.opcoes')) // Combine as opções default com as do usuário (se houverem), priorizando as configurações do usuário
        _.forEach(opcoesVisualizacao, function (opc) {
          if (_.isNull(_.get(opc, 'modificacoes'))) { // Verifica se tem valor, senão retorna ao padrão
            _.set(opc, 'modificacoes', 'RESUMIDO')
          }
        })
        this.opcoesVisualizacao = opcoesVisualizacao
      }
      //
      if (_.has(this.$route.params, 'id')) {
        // Se trata de uma edição pois é passado um id
        this.carregarDados({'id': this.$route.params.id})
      } if (_.has(this.$route.params, 'numero')) {
        // Quando é passado um número como parâmetro se entende como número de projeto e assim se carrega logo o projeto selecionado se existir
        this.carregarDados({'numero': this.$route.params.numero})
      } else {
        if (_.isEmpty(this.listaProjetos.validos)) {
          this.carregarListaProjetos()
        }
      }
      this.listaMotivosSolicitacao()
    },
    methods: {
      carregarDados (requisicao) {
        this.loading.tela = true
        axiosLaravel.post('projeto/alteracoes', requisicao).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            let proposta = response.data.retorno.projeto
            this.propostaBackup = _.cloneDeep(proposta) // Guarda a proposta sem alterações para comparar ao final e ver se houve alterações com a original
            this.projeto = _.find(this.listaProjetos.validos, ['ds_codigo_projeto_erp', ('' + proposta.ds_codigo_projeto_erp)])
            let solicitacao = response.data.retorno.solicitacao
            if (!_.isEmpty(solicitacao)) { // Se houver solicitação então carrega este objeto e transforma a proposta com as alterações dele
              this.solicitacao = solicitacao.dados
              this.processo = solicitacao.processo
              this.id = this.processo.id
              this.ultimaTarefa = _.last(_.filter(solicitacao.tarefas, ['tipo', 'USUARIO']))
              this.tarefas = _.get(_.last(solicitacao.tarefas), 'tipo', 'USUARIO') === 'USUARIO' ? _.initial(solicitacao.tarefas) : solicitacao.tarefas // Todos os elementos exceto o ultimo
              this.filtrarHistoricoPorModo() // Para limitar o que aparece no historico
              this.etapa = this.tarefaNome[this.ultimaTarefa['nome']]
              if (!this.ehVisualizacao) { // Quando não esta em modo de Visualização, deve verificar se há alguma outra condição para alterar para o modo de Visualização
                this.ehVisualizacao = _.includes(['FEITO', 'CANCELADO'], this.processo.situacao) || (this.usuarioLogado.userType !== 'FUNDACAO' && !_.includes(['Revisão', 'Solicitação'], this.etapa))
              }
              if (!_.includes(['Solicitação', 'Revisão'], this.etapa)) {
                this.decisao.encaminhamento = null
              }
              this.mostrar.solicitacao = !_.includes([''], this.etapa) || this.ehVisualizacao // As etapas em que a solicitacao inicia 'fechada'
              this.mostrar.sumula = _.includes(['Autorização', 'Deliberação'], this.etapa) // As etapas em que a súmula inicia 'aberta'
              if (!_.includes(['FEITO', 'CANCELADO'], this.processo.situacao)) {
                let objetosRefProcesso = {'ALTERACAO_METAS': 'metas', 'ALTERACAO_ATIVIDADES': 'atividades', 'ALTERACAO_PARCELAS_ADIANTAMENTO': 'adiantamentos', 'ALTERACAO_MUNICIPIOS': 'municipalizacao', 'ALTERACAO_PERIODO_PROJETO': ''}
                this.solicitacao.processos.forEach((processo) => {
                  // Processa as Exclusões -------------------------------------------
                  let exclusoes = _.get(processo, 'exclusao', [])
                  exclusoes.forEach((exclusao) => {
                    _.remove(_.get(proposta, objetosRefProcesso[processo.nome], []), ['id', exclusao])
                  })
                  // Processa as Alterações -------------------------------------------
                  let alteracoes = _.get(processo, 'alteracao', [])
                  alteracoes.forEach((alteracao) => {
                    let registroAlterado = proposta // Inicialmente é proposta que vai ser alterada
                    if (_.includes(['REMANEJAMENTO', 'SUPLEMENTACAO'], processo.nome)) {
                      proposta.atividades.forEach((atividade) => { // Caso se trate de alteração de extrato (remanejamento ou suplementacao), então deve se pegar o item específico dentro das atividades
                        let itemAlterado = _.find(_.get(atividade, 'itens_orcamentos', []), ['id', alteracao.id])
                        if (itemAlterado) {
                          registroAlterado = itemAlterado
                        }
                      })
                    } else if (processo.nome !== 'ALTERACAO_PERIODO_PROJETO') { // Caso não se trate de prorrogação (que altera a proposta diretamente) nem de alteração de extrato, então deve se pegar o objeto específico dentro da proposta para se alterado
                      registroAlterado = _.find(_.get(proposta, objetosRefProcesso[processo.nome], []), ['id', alteracao.id])
                    }
                    _.forIn(alteracao, function (value, key, obj) { // Passa por cada alteração reatribuindo ao objeto a ser alterado
                      if (key !== 'id') {
                        let valor = _.isNaN(_.toNumber(value[1])) ? value[1] : _.toNumber(value[1]) // Se conversível para numero então use se devolve como está
                        _.set(registroAlterado, key, valor)
                      }
                    })
                  })
                  // Processa as Inclusões ------------------------------------------
                  let inclusoes = _.get(processo, 'inclusao', [])
                  let lista = _.get(proposta, [objetosRefProcesso[processo.nome]], [])
                  inclusoes.forEach((inclusao) => {
                    if (_.includes(['REMANEJAMENTO', 'SUPLEMENTACAO'], processo.nome)) {
                      lista = _.get(_.find(proposta.atividades, ['id', inclusao.atividade.id]), 'itens_orcamentos')
                    }
                    // // Verifica se o id da inclusao já existe na lista
                    // let idInclusao = _.find(lista, ['id', inclusao.id])
                    // // Se já existe, nao adiciona novamente
                    // if (_.isArray(lista) && !idInclusao) {
                    if (_.isArray(lista)) {
                      lista.push(inclusao)
                    }
                  })
                })
              }
              this.qteAlteracoes()
              if (_.includes(['Análise', 'Autorização', 'Deliberação', 'Pendências'], this.etapa)) {
                if (_.isEmpty(this.solicitacao.sumula.questionario)) {
                  this.carregarQuestionario()
                }
                this.buscaMotivosDevolucao()
                this.modelosDocumento(null, null, null) // Lista simples
              }
              if (_.includes(['Solicitação', 'Revisão'], this.etapa)) {
                this.solicitacao.instrumentosLidos = {'ok': false, 'usuario': null, 'data': null}
              }
            }
            //
            this.solicitacao.motivosDevolucao = []
            this.proposta = _.cloneDeep(proposta)
            this.projetoPeriodos = this.propostaBackup.nr_periodos
            let alteracaoCronogramaRealizada = _.find(_.get(this.solicitacao, 'processos', []), function (prc) { return _.includes(['REMANEJAMENTO', 'SUPLEMENTACAO'], prc.nome) })
            // Verifica quais opções são permitidas de alteração de cronograma, se somente uma é aceita (ou remanejamento ou suplementação) essa que vai para o extrato, do contrário (nenhuma opção ou mais de uma então vai null
            let tiposAlteracaoCronogramaPermitidos = alteracaoCronogramaRealizada ? [alteracaoCronogramaRealizada['nome']] : _.intersection(_.get(this.proposta, 'opcoes.alteracoesPermitidas', []), ['remanejamento', 'suplementacao'])
            this.tipoAlteracaoCronograma = tiposAlteracaoCronogramaPermitidos.length === 1 ? _.toUpper(_.head(tiposAlteracaoCronogramaPermitidos)) : null
            //
            this.ocultaSinalizarDocumentosInternos()
            this.buscaCidades()
            if (_.find(this.solicitacao.processo, ['nome', 'ALTERACAO_PERIODO_PROJETO']) || !this.id) {
              this.buscaHistoricos(this.proposta.ds_codigo_projeto_erp)
            }
            this.verificaUsuarioDirigente()
            this.resumoAlteracoesSumula()
            this.$forceUpdate()
            this.listaAtividadesAlteradas()
            this.acertarPeriodosAtividades()
            // if (this.etapa === 'Análise') {
            //   this.consultaCronogramaProjeto(this.proposta.ds_codigo_projeto_erp)
            // }
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
      acertarNovasAtividades () {
        // Remove os itens de orçamento com id igual com o prefixo 'novo' NAS atividades de id com prefixo 'novo'
      },
      acertarPeriodosAtividades () {
        this.proposta.atividades.forEach((atividade) => {
          // Em cada atividade, verifica o item orçamento
          atividade.itens_orcamentos.forEach((item) => {
            // Caso o periodo final seja menor que o periodo inicial
            if (item.periodo_final < item.periodo_inicial) {
              // Vamos pegar o MAX dos orçamentos mensalizados
              let unique = _.map(_.uniqBy(item.orcamentos_mensalizados, 'periodo'), 'periodo')
              let max = Math.max(...unique)
              item.periodo_final = max
            }
          })
        })
      },
      carregarListaProjetos (numero = null) {
        this.loading.tela = true
        axiosLaravel.post('projeto/lista', {'processo': 'ALTERACOES_PROJETO', 'numero': numero}).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            this.listaProjetos = response.data.retorno
            if (!_.isNull(numero)) {
              let projeto = _.find(this.listaProjetos.validos, ['ds_codigo_projeto_erp', numero])
              if (projeto) {
                this.projeto = projeto // seleciona o projeto informado nos parametros da route
                this.buscaHistoricos(numero)
              } else {
                this.$snotify.error('Este projeto não esta disponível para alterações')
                this.$router.go(-1)
              }
            } else {
              if (this.listaProjetos.validos.length === 1) { // Quando somente há um projeto, pega esse projeto na lista e o seleciona para iniciar a solicitação
                this.projeto = _.head(this.listaProjetos.validos)
              }
            }
          } else {
            this.$snotify.error(response.data.mensagem[0])
            this.listaProjetos = {'validos': [], 'demais': []}
          }
          this.$forceUpdate()
          this.loading.tela = false
        })
          .catch((error) => {
            this.loading.tela = false
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      carregarQuestionario () {
        this.solicitacao.sumula.questionario = _.cloneDeep(this.listaQuestionarioAnalise)
        this.executarRegrasQuestoes(['Q001', 'Q002', 'Q003', 'Q004', 'Q005', 'Q006', 'Q010', 'Q012'])
      },
      verQuestao (questao, backup = false) {
        let questionario = []
        if (backup) {
          questionario = _.clone(this.listaQuestionarioAnalise)
        } else {
          questionario = _.clone(this.solicitacao.sumula.questionario)
        }
        return _.find(questionario, ['codigo', questao])
      },
      alteraQuestao (questao, pergunta) {
        _.set(_.find(this.solicitacao.sumula.questionario, ['codigo', questao]), 'questao', pergunta)
      },
      respondeQuestao (questao, resposta) {
        _.set(_.find(this.solicitacao.sumula.questionario, ['codigo', questao]), 'resposta', resposta)
      },
      executarRegrasQuestoes (questoes, opcoes) {
        // "questoes" traz array com um ou mais códigos para executar e "opcoes" serve para adicionar tratamento diferenciado como forçar a atualização de consulta
        questoes.forEach((questao) => {
          let q = this.verQuestao(questao)
          let resposta = q['resposta']
          // let pergunta = q['questao']
          let perguntaBackup = this.verQuestao(questao, true)['questao']
          if (questao === 'Q001') { // Questão 001 -----------------------------------------------------------------------------------------------------------
            if (_.get(_.find(this.tarefas, ['nome', 'SOLICITACAO']), 'ds_tipo_usuario') !== 'FUNDACAO') {
              _.remove(this.solicitacao.sumula.questionario, ['codigo', 'Q001']) // A questão 1 só aparece se o processo for iniciado pela FBB
            }
          } else if (questao === 'Q002') { // Questão 002 ----------------------------------------------------------------------------------------------------
            if (_.isNull(resposta)) {
              if (_.find(this.solicitacao.processos, function (p) { return _.includes(['ALTERACAO_METAS', 'ALTERACAO_ATIVIDADES'], p.nome) })) {
                this.respondeQuestao('Q002', 'sim')
                this.executarRegrasQuestoes(['Q002'])
              }
            } else {
              if (resposta === 'sim') {
                this.alteraQuestao('Q002', perguntaBackup + '<span class=\'alertaQuestao\'>Em caso afirmativo, indique quais são no campo \'Análise\'</span>')
              } else {
                this.alteraQuestao('Q002', perguntaBackup)
              }
            }
          //
          } else if (questao === 'Q003') { // Questão 003 ----------------------------------------------------------------------------------------------------
            if (_.isNull(resposta)) {
              if (_.find(this.solicitacao.processos, function (p) { return _.includes(['ALTERACAO_PERIODO_PROJETO'], p.nome) })) {
                this.respondeQuestao('Q003', 'sim')
                this.executarRegrasQuestoes(['Q003'])
              }
            } else {
              if (resposta === 'sim') {
                this.alteraQuestao('Q003', perguntaBackup + '<span class=\'alertaQuestao\'>Em caso afirmativo, indique novo prazo e os impactos identificados no campo \'Análise\'</span>')
              } else {
                this.alteraQuestao('Q003', perguntaBackup)
              }
            }
          } else if (questao === 'Q004') { // Questão 004 ----------------------------------------------------------------------------------------------------
            if (resposta === 'sim') {
              this.alteraQuestao('Q004', perguntaBackup + '<span class=\'alertaQuestao\'>Em caso afirmativo, indique os impactos identificados no campo \'Análise\'</span>')
            } else {
              this.alteraQuestao('Q004', perguntaBackup)
            }
          } else if (questao === 'Q005') { // Questão 005 ----------------------------------------------------------------------------------------------------
            if ((opcoes && _.includes(['ATUALIZA_CONSULTA'], opcoes)) || _.isNull(resposta)) {
              if (this.usuarioLogado.userType === 'FUNDACAO' && !this.ehVisualizacao) {
                this.alteraQuestao('Q005', perguntaBackup + '<span class=\'avisoQuestao\'><i class=\'fa fa-refresh fa-spin\'></i> Consultando ocorrências ...</span>')
                this.loading.ocorrencias = true
                axiosLaravel.post('ocorrencia/busca', {'informacao': 'SIMPLIFICADO', 'projeto': this.proposta.ds_codigo_projeto_erp, 'nivel': [2, 3, 4], 'situacao': 'LIBERADO'}).then((response) => {
                  if (_.get(response.data, 'codigo', '') === 'OK') {
                    let dataHoraPesquisa = ' (pesquisado em ' + moment().format('DD/MM/YYYY HH:mm') + ')'
                    let ocorrencias = response.data.retorno
                    let qtdeOcorrenciasRestritivas = (_.filter(ocorrencias, function (o) { return o.codigo > 3000 })).length
                    let qtdeOcorrenciasFlexibilizacao = (_.filter(ocorrencias, function (o) { return _.includes([2200, 2201, 2202, 2203], o.codigo) })).length
                    if (ocorrencias.length > 0 && qtdeOcorrenciasRestritivas > 0 && qtdeOcorrenciasFlexibilizacao === 0) {
                      this.respondeQuestao('Q005', 'sim')
                      this.alteraQuestao('Q005', perguntaBackup + '<span class=\'alertaQuestao\'>Há ' + qtdeOcorrenciasRestritivas + (qtdeOcorrenciasRestritivas === 1 ? ' ocorrência' : ' ocorrências') + ' restritivas ativas' + dataHoraPesquisa + '</span>')
                    } else {
                      if (qtdeOcorrenciasRestritivas === 0) {
                        this.alteraQuestao('Q005', perguntaBackup + '<span class=\'avisoQuestao\'>Não há ocorrências restritivas ativas' + dataHoraPesquisa + '</span>')
                      } else if (qtdeOcorrenciasFlexibilizacao > 0) {
                        this.alteraQuestao('Q005', perguntaBackup + '<span class=\'avisoQuestao\'>Há ocorrência(s) de flexibilização ativa' + dataHoraPesquisa + '</span>')
                      } else {
                        this.alteraQuestao('Q005', perguntaBackup + '<span class=\'alertaQuestao\'>Quantidade de ocorrências indisponível' + dataHoraPesquisa + '</span>')
                      }
                    }
                  } else {
                    this.alteraQuestao('Q005', perguntaBackup)
                    this.$snotify.error(response.data.mensagem)
                  }
                  this.loading.ocorrencias = false
                  this.$forceUpdate()
                })
                  .catch((error) => {
                    this.loading.ocorrencias = false
                    this.alteraQuestao('Q005', perguntaBackup)
                    this.$root.trataErro(error)
                  })
              }
            }
          } else if (questao === 'Q006') { // Questão 006 ----------------------------------------------------------------------------------------------------
            if (_.isNull(resposta)) {
              if (_.find(this.solicitacao.anexos, ['fk_tipo_documento', 23])) {
                this.respondeQuestao('Q006', 'sim')
              }
            }
          //
          } else if (questao === 'Q007') { // Questão 007 ----------------------------------------------------------------------------------------------------
          //
          } else if (questao === 'Q008') { // Questão 008 ----------------------------------------------------------------------------------------------------
          //
          } else if (questao === 'Q009') { // Questão 009 ----------------------------------------------------------------------------------------------------
          //
          } else if (questao === 'Q010') { // Questão 010 ----------------------------------------------------------------------------------------------------
            if (_.isNull(resposta)) {
              if (_.find(this.solicitacao.processos, function (p) { return _.includes(['ALTERACAO_PARCELAS_ADIANTAMENTO', 'SUPLEMENTACAO'], p.nome) }) || _.has(_.find(this.solicitacao.processos, ['nome', 'ALTERACAO_PERIODO_PROJETO']), 'alteracao.0.periodo_vigencia')) {
                this.respondeQuestao('Q010', 'sim')
                this.executarRegrasQuestoes(['Q010'])
              }
            } else {
              if (resposta === 'sim') {
                this.alteraQuestao('Q010', perguntaBackup + '<span class=\'alertaQuestao\'>Em caso afirmativo, registre no campo \'Análise\' as informações sobre o parecer da Dijur e eventuais recomendações para a formalização de termo aditivo ao instrumento contratual.</span>')
              } else {
                this.alteraQuestao('Q010', perguntaBackup)
              }
            }
          } else if (questao === 'Q011') { // Questão 011 ----------------------------------------------------------------------------------------------------
          //
          } else if (questao === 'Q012') { // Questão 012 ----------------------------------------------------------------------------------------------------
            let documentosObrigatorios = [{'tipo': 2, 'desc': 'Comprovante de CNPJ'}, {'tipo': 67, 'desc': 'CNEP/CEPIM'}, {'tipo': 6, 'desc': 'Certidão negativa de débitos relativos a créditos tributários federais e a dívida ativa da união'}, {'tipo': 40, 'desc': 'CNDT'}]
            let certidoesComDataValidade = _.filter(this.solicitacao.anexos, function (a) { return !_.isEmpty(a.dt_data_validade) && moment(a.dt_data_validade).diff(moment(), 'days', true) < 0 && _.includes(_.map(documentosObrigatorios, 'tipo'), a.fk_tipo_documento) })
            if (certidoesComDataValidade.length > 0) {
              this.alteraQuestao('Q012', perguntaBackup + '<span class=\'alertaQuestao\'>Há ' + certidoesComDataValidade.length + ' ' + (certidoesComDataValidade.length > 1 ? 'certidões' : 'certidão') + ' em anexo expirando hoje ou vencida</span>')
              this.respondeQuestao('Q012', 'sim')
            }
          } else if (questao === 'Q013') { // Questão 013 ----------------------------------------------------------------------------------------------------
          //
          } else if (questao === 'Q014') { // Questão 014 ----------------------------------------------------------------------------------------------------
          //
          } else if (questao === 'Q015') { // Questão 015 ----------------------------------------------------------------------------------------------------
          //
          }
        })
        this.$forceUpdate()
      },
      qteAlteracoes () {
        let sumario = {}
        let processos = _.get(this.solicitacao, 'processos', [])
        let processoNew = _.cloneDeep(processos)
        console.log('contando alteracoes')
        processoNew.forEach(function (prc) {
          // Remove da soma os processos.alteracao caso seu valorAlterado esteja com item 0 = "" e item 1 = "0" ou ainda item 0 = null
          if (Array.isArray(prc.alteracao)) {
            prc.alteracao.forEach(a => {
              if (a.valorAlteracao &&
                (a.valorAlteracao[0] === null || a.valorAlteracao[0] === '' || _.isNull(a.valorAlteracao[0])) &&
                a.valorAlteracao[1] === '0') {
                console.log('removendo alteracao da soma', a)
                delete a.valorAlteracao
              }
            })
          }
          let desconsiderandoContagemParametros = _.includes(['REMANEJAMENTO', 'SUPLEMENTACAO'], prc.nome) ? 2 : 1 // Remanejamento/Suplementação tem um parâmetro a mais obrigatorio (justificativa) que não deve ser contado, então além de "id" tiramos mais este
          let qtdAlteracoes = _.sumBy(prc.alteracao, function (a) { return (_.keys(a)).length - desconsiderandoContagemParametros })
          let qtdInclusoes = (_.get(prc, 'inclusao', [])).length
          let qtdExclusoes = (_.get(prc, 'exclusao', [])).length
          _.set(sumario, [prc.nome, 'alteracao'], qtdAlteracoes)
          _.set(sumario, [prc.nome, 'inclusao'], qtdInclusoes)
          _.set(sumario, [prc.nome, 'exclusao'], qtdExclusoes)
          _.set(sumario, [prc.nome, 'total'], qtdAlteracoes + qtdInclusoes + qtdExclusoes)
        })
        this.sumarioQtdeAlteracoes = sumario
      },
      passarTotaisExtratoParaSumula (totais) {
        this.solicitacao.sumula.resumoAlteracoes.percentualRemanejamentoSolicitado = totais.solicitacao.percentual
        let valorSolicitado = totais.solicitacao.fbb + totais.solicitacao.parceiros + totais.solicitacao.contrapartida
        this.solicitacao.sumula.resumoAlteracoes.valorSuplementacao = _.has(this.sumarioQtdeAlteracoes, 'SUPLEMENTACAO') ? valorSolicitado : 0
        this.solicitacao.sumula.resumoAlteracoes.valorRemanejado = _.has(this.sumarioQtdeAlteracoes, 'REMANEJAMENTO') ? valorSolicitado : 0
        this.solicitacao.sumula.resumoAlteracoes.valorTotalComSuplementacao = totais.projeto.fbb.orcado + totais.projeto.parceiros.orcado + totais.projeto.contrapartida.orcado + this.solicitacao.sumula.resumoAlteracoes.valorSuplementacao
        this.numeroAtualizacao++
      },
      resumoAlteracoesSumula () {
        let vm = this
        let processos = _.get(this.solicitacao, 'processos', [])
        let qtdeContrapartidas = 0
        let qtdeItensSubstituidos = 0
        processos.forEach(function (prc) {
          if (prc.nome === 'ALTERACAO_METAS') {
            vm.solicitacao.sumula.resumoAlteracoes.metas = (_.get(prc, 'alteracao', [])).length + (_.get(prc, 'inclusao', [])).length
          }
          if (prc.nome === 'ALTERACAO_MUNICIPIOS') {
            vm.solicitacao.sumula.resumoAlteracoes.municipiosAlterados = (_.get(prc, 'alteracao', [])).length + (_.get(prc, 'inclusao', [])).length
          }
          if (prc.nome === 'ALTERACAO_PERIODO_PROJETO') {
            vm.solicitacao.sumula.resumoAlteracoes.prorrogacaoExecucao = _.get(prc, 'alteracao.0.nr_periodos', [0, 0])
            vm.solicitacao.sumula.resumoAlteracoes.prorrogacaoVigencia = _.get(prc, 'alteracao.0.periodo_vigencia', [0, 0])
          }
          if (_.includes(['REMANEJAMENTO', 'SUPLEMENTACAO'], prc.nome)) {
            vm.solicitacao.sumula.resumoAlteracoes.novosItens = (_.get(prc, 'inclusao', [])).length
            qtdeContrapartidas += (_.filter(_.get(prc, 'inclusao', []), ['origem', 2])).length
            let idsItensAlterados = _.map(_.get(prc, 'alteracao', []), 'id')
            qtdeContrapartidas += (_.filter(_.flatten(_.map(vm.proposta.atividades, 'itens_orcamentos')), function (i) { return _.includes([idsItensAlterados], i.id) && _.includes(['2'], ('' + i.origem).substr(0, 1)) })).length
            qtdeItensSubstituidos += _.get(_.countBy(_.get(prc, 'alteracao', []), function (i) { return _.get(i, 'substituicao.1') }), 'true', 0) + _.get(_.countBy(_.get(prc, 'inclusao', []), function (i) { return _.get(i, 'substituicao.1') }), 'true', 0)
          }
          vm.solicitacao.sumula.resumoAlteracoes.contrapartidas = qtdeContrapartidas
          vm.solicitacao.sumula.resumoAlteracoes.substituicaoItens = qtdeItensSubstituidos
        })
      },
      listaAtividadesAlteradas () {
        let ids = []
        let atividadesAlteradas = _.find(this.solicitacao.processo, ['nome', 'ALTERACAO_ATIVIDADES'])
        let alteracoes = _.get(atividadesAlteradas, 'alteracao', [])
        alteracoes.forEach((alteracao) => {
          if (_.get(alteracao, 'nr_periodo_inicial.0', null) !== _.get(alteracao, 'nr_periodo_final.0', null) || _.get(alteracao, 'nr_periodo_inicial.1', null) !== _.get(alteracao, 'nr_periodo_final.1', null)) {
            ids.push(alteracao.id)
          }
        })
        this.listaIdsAtividadesAlteradas = ids
      },
      listaMotivosSolicitacao () {
        this.loading.motivosSolicitacao = true
        axiosLaravel.get('tipo-registros/').then((response) => {
          this.motivosSolicitacao = _.filter(response.data, ['grupo', 'ALTERACAO_MOTIVO'])
          this.loading.motivosSolicitacao = false
        })
          .catch((error) => {
            this.loading.motivosSolicitacao = false
            this.$root.trataErro(error)
          })
      },
      filtrarHistoricoPorModo (opcao) {
        // Botão (opção) para alterar entre os modos padrão (não mostra algumas tarefas) e completo (mostra tudo)
        let modo = opcao || 'PADRAO'
        if (!opcao || _.get(this.opcoesVisualizacao, 'historico.modo', '') !== opcao) {
          _.set(this.opcoesVisualizacao, 'historico.modo', modo)
          let tarefas = _.cloneDeep(this.tarefas)
          if (!opcao || modo === 'PADRAO') {
            tarefas.forEach((tarefa) => {
              _.set(tarefa, 'mostrar', !_.includes(['INCLUSAO_DOCUMENTO', 'EXCLUSAO_DOCUMENTO', 'RecPrv_at_com_senior_g5_co_mfi_prj_recursosprevistosgrid', 'INSERINDO_RECURSOS_SAPIENS', 'VISUALIZACAO'], tarefa.nome))
            })
          } else if (modo === 'COMPLETO') {
            tarefas.forEach((tarefa) => {
              _.set(tarefa, 'mostrar', true)
            })
          }
          this.tarefas = _.cloneDeep(tarefas)
          if (opcao) { this.salvarConfiguracoes() }
        }
      },
      buscaHistoricos (numeroProjeto) {
        this.loading.historicos.periodos = true
        axiosLaravel.post('projeto/historicos', {'numero': numeroProjeto}).then((response) => {
          let dataFinal = moment(this.ehNulo(this.proposta.dt_assinatura_convenio, this.proposta.dt_data_inicial)).add(this.proposta.nr_periodos, 'M').format('DD/MM/YYYY')
          _.set(this.proposta, 'historicos.periodos', [{'id': this.proposta.fk_processo, 'acao': 'Contratação', 'inicio': this.proposta.dt_data_inicial, 'termino': dataFinal, 'periodos': this.proposta.nr_periodos, 'termino_alterado': null}])
          let historicosPeriodo = _.filter(response.data, ['nome', 'ALTERACAO_PERIODO_PROJETO'])
          historicosPeriodo.forEach((historico, idx) => {
            let registroAlteracao = JSON.parse(historico.ultimaTarefa.requisicao)
            if (idx === 0) {
              this.proposta.historicos.periodos[0] = {
                'id': this.proposta.fk_processo,
                'acao': 'Contratação',
                'periodo_inicial': registroAlteracao.antes.nr_periodos,
                'periodo_final': registroAlteracao.alterado.nr_periodos,
                'periodo_alterado': 0,
                'termino_alterado': moment(registroAlteracao.antes.dt_data_final).format('DD/MM/YYYY')
              }
            }
            this.proposta.historicos.periodos.push({
              'id': historico.id,
              'acao': 'Alteração',
              'periodo_inicial': registroAlteracao.antes.nr_periodos,
              'periodo_final': registroAlteracao.alterado.nr_periodos,
              'periodo_alterado': registroAlteracao.alterado.nr_periodos - registroAlteracao.antes.nr_periodos,
              'termino_alterado': new Date(registroAlteracao.alterado.dt_data_final)
            })
          })
          this.loading.historicos.periodos = false
        })
          .catch((error) => {
            this.loading.historicos.periodos = false
            this.$root.trataErro(error)
          })
      },
      buscaMotivosDevolucao () {
        // Pode usar ids, codigos, situacao ou grupos ... todos passando array
        if (this.usuarioLogado.userType === 'FUNDACAO' && !this.ehVisualizacao) {
          axiosLaravel.post('motivos/lista', {'grupos': ['ALTERACOES_PROJETOS']}).then((response) => {
            if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
              this.listMotivosDevolucao = response.data.retorno
            } else {
              this.$snotify.error(response.data.mensagem)
            }
          })
            .catch((error) => {
              console.log('error', error)
              this.$root.trataErro(error)
            })
        }
      },
      buscaCidades () {
        let lista = _.uniq(_.map(this.proposta.municipalizacao, 'ds_cep'))
        axiosLaravel.post('projeto/cidades', {'referencia': 'CEP', 'lista': lista}).then((response) => {
          this.proposta.municipalizacao.forEach((municipio) => {
            let cidade = _.find(response.data, function (cid) {
              return _.toNumber(municipio.ds_cep) >= _.toNumber(cid.nr_cep_inicio) && _.toNumber(municipio.ds_cep) <= _.toNumber(cid.nr_cep_final)
            })
            _.set(municipio, 'ds_uf', cidade.ds_uf)
          })
          this.propostaBackup.municipalizacao.forEach((municipio) => {
            let cidade = _.find(response.data, function (cid) {
              return _.toNumber(municipio.ds_cep) >= _.toNumber(cid.nr_cep_inicio) && _.toNumber(municipio.ds_cep) <= _.toNumber(cid.nr_cep_final)
            })
            _.set(municipio, 'ds_uf', cidade.ds_uf)
          })
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      verificaUsuarioDirigente () {
        if (this.usuarioLogado.userType !== 'FUNDACAO' && !this.ehVisualizacao) {
          this.loading.poderes = true
          axiosLaravel.get('projeto/usuario/dirigente').then((response) => {
            if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
              if (!_.isNull(response.data.retorno)) {
                _.remove(this.poderes, 'PERMITE_CONCLUIR')
                this.restricaoParaInicializar.push(response.data.retorno)
                this.adicionaRestricao({'tag': 'semPoderesParaConcluir', 'ativo': true, 'tipo': 'restricao', 'acao': null, 'mensagem': response.data.retorno + '. A conclusão e envio desta solicitação deverá ser realizada pelo representante legal ou designado.'})
              } else {
                this.poderes.push('PERMITE_CONCLUIR')
              }
              this.poderes = _.uniq(this.poderes)
            } else {
              this.$snotify.error(response.data.mensagem[0])
              this.ehVisualizacao = true
            }
            this.loading.poderes = false
          })
            .catch((error) => {
              this.loading.poderes = false
              console.log('error', error)
              this.$root.trataErro(error)
            })
        } else {
          this.poderes.push('PERMITE_CONCLUIR')
        }
      },
      processarSolicitacao (acao, abrirDocumento = null) {
        this.msgErroProcessamento = []
        if (this.verificaParcelaAdiantadaParcial() === true) {
          console.log('verificando parcela')
          _.remove(this.restricaoParaConcluir, function (i) {
            return i.tag === 'parcelasAcimaTotalAdiantavel'
          })
        }
        if (this.verificaSeProjetoNaoPossuiAdiantamento() === true) {
          console.log('verificando parcela')
          _.remove(this.restricaoParaConcluir, function (i) {
            return i.tag === 'parcelasAcimaTotalAdiantavel'
          })
        }
        if (_.includes(['Análise', 'Solicitação', 'Revisão'], this.etapa)) { this.prepararSolicitacao() }
        if (acao === 'ENCAMINHAR') { this.verificaConclusao() }
        if (acao === 'SALVAR' || (this.errors.items.length === 0 && _.filter(this.restricaoParaConcluir, {'ativo': true}).length === 0)) {
          if (_.includes(['SALVAR', 'ENCAMINHAR'], acao)) {
            if (this.decisao.encaminhamento === 'CONCLUSAO' && acao === 'ENCAMINHAR') {
              this.concluirSolicitacao()
            } else {
              this.encaminharSolicitacao(acao, abrirDocumento)
            }
          }
        }
      },
      verificaConclusao () {
        console.log('proposta', this.proposta.projetoSapiens.codfor)
        let vm = this
        this.adicionaRestricao({'tag': 'decisaoEncaminhamento', 'ativo': _.isNull(this.decisao.encaminhamento), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Selecione qual a decisão de encaminhamento para esta solicitação'})
        this.adicionaRestricao({'tag': 'nrPeriodos', 'ativo': _.isEmpty('' + this.proposta.nr_periodos), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Periodo do projeto em meses não informado'})
        this.adicionaRestricao({'tag': 'justificativa', 'ativo': _.isEmpty(this.solicitacao.justificativa), 'tipo': 'restricao', 'acao': null, 'mensagem': 'A Justificativa não informada. Por favor preencha o campo'})
        if (this.etapa === 'Análise' && this.decisao.encaminhamento === 'AUTORIZACAO') {
          this.adicionaRestricao({'tag': 'sumulaQuestionarioPreenchido', 'ativo': (_.filter(this.solicitacao.sumula.questionario, function (q1) { return !_.includes(['Q011', 'Q012', 'Q013', 'Q014'], q1.codigo) && _.isNull(q1.resposta) })).length > 0 || _.isNull(this.solicitacao.sumula.parceriaEstrategica) || (this.solicitacao.sumula.parceriaEstrategica === 'sim' && (_.filter(this.solicitacao.sumula.questionario, function (q2) { return _.includes(['Q011', 'Q012', 'Q013', 'Q014'], q2.codigo) && _.isNull(q2.resposta) })).length > 0), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Há questões na súmula que não foram respondidas. Preencha todos os campo'})
          this.adicionaRestricao({'tag': 'sumulaAnaliseProposta', 'ativo': _.isNull(this.solicitacao.sumula.textoContexto) || _.isNull(this.solicitacao.sumula.textoSituacaoProblema) || _.isNull(this.solicitacao.sumula.textoParecer) || _.isNull(this.solicitacao.sumula.textoProposta), 'tipo': 'restricao', 'acao': null, 'mensagem': 'O Contexto, a Situação Problema, o Parecer e a Proposta devem estar preenchidos'})
          this.adicionaRestricao({'tag': 'sumulaAlcadaSelecionada', 'ativo': _.isEmpty(this.solicitacao.sumula.alcada), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Selecione uma alçada decisória'})
          this.adicionaRestricao({'tag': 'motivoAlteracaoSelecionado', 'ativo': _.isEmpty(_.get(this.solicitacao, 'motivoAlteracao', '')), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Selecione um motivo para esse conjunto de alterações'})
          this.adicionaRestricao({'tag': 'q001HaArquivoAnexado', 'ativo': _.get(this.verQuestao('Q001'), 'resposta', '') === 'sim' && this.solicitacao.anexos.length === 0, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Anexe a concordância da entidade'})
          this.adicionaRestricao({'tag': 'q010HaAditivoEmProvidencias', 'ativo': _.get(this.verQuestao('Q010'), 'resposta', '') === 'sim' && !_.find(this.solicitacao.sumula.providencias, ['codigo', 'ADT']), 'tipo': 'restricao', 'acao': null, 'mensagem': 'No campo de Providências, selecione a opção Termo Aditivo'})
          this.adicionaRestricao({'tag': 'q013HaAutorizacaoParcEstratAnexado', 'ativo': _.get(this.verQuestao('Q013'), 'resposta', '') === 'sim' && !_.find(this.solicitacao.anexos, ['fk_tipo_documento', 76]), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Anexe Autorização – parceiro estratégico na solicitação'})
        }
        if (this.etapa === 'Pendências') {
          this.adicionaRestricao({'tag': 'planoTrabalhoObrigatorioAnexado', 'ativo': (this.decisao.encaminhamento === 'CONCLUSAO' && _.find(this.solicitacao.sumula.providencias, ['codigo', 'PLT']) && !_.find(this.solicitacao.anexos, ['fk_tipo_documento', 8])), 'tipo': 'restricao', 'acao': null, 'mensagem': 'É obrigatório anexar Plano de Trabalho'})
          this.adicionaRestricao({'tag': 'sumulaObrigatorioAnexado', 'ativo': (this.decisao.encaminhamento === 'CONCLUSAO' && _.find(this.solicitacao.sumula.providencias, ['codigo', 'SML']) && !_.find(this.solicitacao.anexos, ['fk_tipo_documento', 43])), 'tipo': 'restricao', 'acao': null, 'mensagem': 'É obrigatório anexar Súmula'})
          this.adicionaRestricao({'tag': 'minutaObrigatoriaAnexado', 'ativo': (this.decisao.encaminhamento === 'CONCLUSAO' && _.find(this.solicitacao.sumula.providencias, ['codigo', 'ADT']) && !_.find(this.solicitacao.anexos, ['fk_tipo_documento', 7])), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Minuta do termo aditivo não anexada'})
        }
        if ((_.includes(['Solicitação', 'Revisão'], this.etapa) && this.decisao.encaminhamento === 'ANALISE') || (_.includes(['Análise'], this.etapa) && this.decisao.encaminhamento === 'AUTORIZACAO')) {
          // Se vier da entidade para análise ou da análise para autorização e tiver suplementação na solicitação, então deve ter alguns documentos anexados obrigatoriamente
          this.removeRestricao({'tag': 'docsObrigatoriosSuplementacao'}) // Remove restrição de documento na suplementação antes de verificar se ainda há essa restrição
          if (this.proposta.projetoSapiens.codfor !== 18) {
            let documentosObrigatorios = [{'tipo': 2, 'desc': 'Comprovante de CNPJ'}, {'tipo': 67, 'desc': 'CNEP/CEPIM'}, {'tipo': 6, 'desc': 'Certidão negativa de débitos relativos a créditos tributários federais e a dívida ativa da união'}, {'tipo': 40, 'desc': 'CNDT'}]
            if (this.etapa === 'Análise') {
              // Verifica se as certidões em anexo tem data de validade informada e se estão válidas
              let certidoesComDataValidade = _.filter(this.solicitacao.anexos, function (a) { return !_.isEmpty(a.dt_data_validade) && moment(a.dt_data_validade).diff(moment(), 'days', true) < 0 })
              this.adicionaRestricao({'tag': 'docsObrigSemValidadeOuVencido', 'ativo': !this.ehVisualizacao && certidoesComDataValidade.length > 0, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Há ' + certidoesComDataValidade.length + ' ' + (certidoesComDataValidade.length > 1 ? 'certidões' : 'certidão') + ' em anexo expirando hoje ou vencida'})
            }
            if (_.find(this.solicitacao.processos, function (prc) { return _.includes(['SUPLEMENTACAO'], prc.nome) })) {
              if (this.etapa === 'Análise') {
                documentosObrigatorios.push({'tipo': 80, 'desc': 'CADIN'}) // Quando se tratar de análise avançando no processo deve acrescebtar a verificação de Cadin na lista de documentos obrigatorios na suplementação
              }
              let tiposJaAnexados = _.map(this.solicitacao.anexos, 'fk_tipo_documento')
              _.remove(documentosObrigatorios, function (obr) { return _.includes(tiposJaAnexados, obr.tipo) })
              this.adicionaRestricao({'tag': 'docsObrigatoriosSuplementacao', 'ativo': documentosObrigatorios.length > 0, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Há suplementação, neste caso' + (documentosObrigatorios.length > 1 ? ' são obrigatórios ' : ' falta ') + '<ul><li>' + (_.join(_.map(documentosObrigatorios, 'desc'), '<li>')) + '</ul>'})
            }
            // Quando se trata de remanejamento com itens novos ou de suplementação deve obrigar orçamento nos anexos
            this.adicionaRestricao({'tag': 'orcamentoObrigatorioEmSuplRemanejItemNovo', 'ativo': (_.find(this.solicitacao.processos, ['nome', 'SUPLEMENTACAO']) || (_.get(_.find(this.solicitacao.processos, ['nome', 'REMANEJAMENTO']), 'inclusao', [])).length > 0) && !_.find(this.solicitacao.anexos, ['fk_tipo_documento', 23]), 'tipo': 'restricao', 'acao': null, 'mensagem': (_.find(this.solicitacao.processos, ['nome', 'SUPLEMENTACAO']) ? 'Em suplementações' : 'Em remanejamentos com itens novos') + ' é obrigatório anexar orçamento(s)'})
          }
        }
        if (_.includes(['Solicitação', 'Revisão'], this.etapa)) {
          if (this.solicitacao.instrumentosLidos.ok) { // Na verificação quando estiver marcado o instrumento lido deve remover erros se houver e pegar o usuário atual se não houver nenhum
            this.errors.removeById('instrumentosLidos')
            if (_.isNull(this.solicitacao.instrumentosLidos.usuario)) {
              this.solicitacao.instrumentosLidos = {'ok': true, 'usuario': _.pick(this.usuarioLogado, ['id', 'ds_nome_usuario']), 'data': new Date()}
            }
          } else if (this.usuarioLogado.userType !== 'FUNDACAO') {
            this.errors.add({field: 'instrumentosLidos', rule: 'required'})
            this.solicitacao.instrumentosLidos = {'ok': false, 'usuario': null, 'data': null}
          }
        }
        this.adicionaRestricao({'tag': 'instrumentosLidos', 'ativo': !this.solicitacao.instrumentosLidos.ok && this.usuarioLogado.userType !== 'FUNDACAO', 'tipo': 'restricao', 'acao': null, 'mensagem': 'Leia os instrumentos legais. Após isso selecione a opção \'Li e estou ciente das cláusulas ...\''})
        if (this.decisao.encaminhamento === 'REVISAO' || (!_.includes(['Solicitação', 'Revisão'], this.etapa) && this.decisao.encaminhamento === 'ANALISE')) { // Quando a decisão do encaminhamento é para ir para Revisão ou devolvendo de alguma etapa seguinte (autorização, deliberação, pendências) para Análise, então qualquer restrição deve ser eliminada, pois para devolver não há travamento
          this.restricaoParaConcluir = []
        }
        let restricoes = _.filter(this.restricaoParaConcluir, {'ativo': true, 'tipo': 'restricao'})
        if (restricoes.length > 0) {
          let mensagens = '<div class=avisoAlerta><li>' + _.join(_.map(restricoes, 'mensagem'), '<li>') + '</div>'
          this.$dialog.alert(mensagens, {html: true, animation: 'fade', customClass: 'avisoAlerta'}).then(function (dialog) {})
          this.msgErroProcessamento.push(mensagens)
        }
        if (this.errors.items.length === 0) {
          this.$validator.validateAll().then(validado => {
            if (validado && this.errors.items.length === 0) {
              console.log('Validação sem erros')
            } else {
              let elementoErro = vm.$refs[_.get(_.head(vm.errors.items), 'field')]
              elementoErro = _.isArray(elementoErro) ? elementoErro[0] : elementoErro
              if (elementoErro) elementoErro.scrollIntoView() // Rola a tela para o primeiro erro da lista
            }
          })
        } else {
          let elementoErro = vm.$refs[_.get(_.head(vm.errors.items), 'field')]
          elementoErro = _.isArray(elementoErro) ? elementoErro[0] : elementoErro
          if (elementoErro) elementoErro.scrollIntoView() // Rola a tela para o primeiro erro da lista
        }
      },
      prepararSolicitacao () {
        // 66422 - Verifica se o processo é nulo antes de preparar a solicitação
        console.log('preparaSolicitacao')
        if (this.processo !== null) {
          if (_.includes(['FEITO', 'CANCELADO'], this.processo.situacao)) {
            return
          }
        }
        // if (!_.includes(['FEITO', 'CANCELADO'], this.processo.situacao)) {
        let processos = []
        let alteracoesPeriodos = this.adicionaAlteracao(['nr_periodos', 'periodo_vigencia'], this.propostaBackup, this.proposta)
        if (!_.isEmpty(alteracoesPeriodos)) { processos.push({'nome': 'ALTERACAO_PERIODO_PROJETO', 'id': null, 'alteracao': [alteracoesPeriodos]}) }
        this.registraAlteracaoInclusaoExclusao(processos, 'ALTERACAO_METAS', this.propostaBackup.metas, this.proposta.metas, ['nr_quantidade', 'ds_unidade_medida', 'ds_indicadores_execucao', 'ds_descricao'])
        this.registraAlteracaoInclusaoExclusao(processos, 'ALTERACAO_ATIVIDADES', this.propostaBackup.atividades, this.proposta.atividades, ['ds_nome', 'ds_documento_comprobatorio', 'nr_periodo_final', 'nr_periodo_inicial'])
        this.registraAlteracaoInclusaoExclusao(processos, 'ALTERACAO_PARCELAS_ADIANTAMENTO', this.propostaBackup.adiantamentos, this.proposta.adiantamentos, ['origem', 'valor', 'idx'])
        this.registraAlteracaoInclusaoExclusao(processos, 'ALTERACAO_MUNICIPIOS', this.propostaBackup.municipalizacao, this.proposta.municipalizacao, ['ds_fase', 'ds_cep', 'ds_municipio', 'nr_total_participantes', 'dc_valor_municipio', 'ds_uf'])
        // Alterações de EXTRATO do projeto ------------------------------------------------------------------------------------
        let alteracoesItensDespesa = []
        let inclusoesItensDespesa = []
        this.propostaBackup.atividades.forEach((atividade) => {
          atividade.itens_orcamentos.forEach((item) => {
            let atividadeComItemAlterado = _.find(this.proposta.atividades, ['id', atividade.id])
            let itemAlterado = _.find(atividadeComItemAlterado.itens_orcamentos, ['id', item.id])
            if (!itemAlterado) {
              // Quando um item é excluído. Não existe isso na prática, então fica aqui só o if caso haja implementações futuras
              console.log('EXCLUSAO DE ITEM')
            } else {
              if (_.includes(('' + item.id), 'novo')) {
                console.log('Grava alteracao', item, itemAlterado)
              }
              let alteracoesEmItem = this.adicionaAlteracao(['observacao', 'valorAlteracao', 'justificativa', 'adiantavel', 'substituicao'], item, itemAlterado)
              if (!_.isEmpty(alteracoesEmItem)) { alteracoesItensDespesa.push(alteracoesEmItem) }
            }
          })
        })
        this.proposta.atividades.forEach((atividade) => {
          atividade.itens_orcamentos.forEach((item) => {
            // Verifica se o id da atividade é novo
            if (_.includes(('' + item.id), 'novo')) {
              let itemNovo = _.cloneDeep(item)
              console.log('setando item novo!')
              _.set(itemNovo, 'atividade', {'id': atividade.id, 'ds_nome': atividade.ds_nome})
              inclusoesItensDespesa.push(itemNovo)
            }
          })
        })
        let registroExtrato = {'nome': this.tipoAlteracaoCronograma, 'id': null}
        if (alteracoesItensDespesa.length > 0) { _.set(registroExtrato, 'alteracao', alteracoesItensDespesa) }
        if (inclusoesItensDespesa.length > 0) { _.set(registroExtrato, 'inclusao', inclusoesItensDespesa) }
        if ((_.keys(registroExtrato)).length > 2) { processos.push(registroExtrato) }
        _.set(this.solicitacao, 'processos', processos)
        this.qteAlteracoes()
        this.resumoAlteracoesSumula()
        // }
      },
      concluirSolicitacao () {
        this.loading.tela = true
        let requisicaoProcessamento = []
        let solicitacaoBackup = _.cloneDeep(this.solicitacao)
        this.solicitacao.processos.forEach((processo) => {
          let parametros = {}
          if (processo.nome === 'ALTERACAO_PERIODO_PROJETO' && _.isNull(processo.id)) {
            let dataConvenio = moment(this.proposta.dt_assinatura_convenio, ((this.proposta.dt_assinatura_convenio).indexOf('/') > 0 ? 'DD/MM/YYYY' : 'YYYY-MM-DD'), true)
            dataConvenio = dataConvenio.format('YYYY-MM-DD')
            this.proposta.dt_data_vigencia = moment(this.proposta.dt_assinatura_convenio ? this.proposta.dt_assinatura_convenio : this.proposta.dt_data_inicial).add(parseInt(this.proposta.periodo_vigencia), 'M').format('YYYY-MM-DD')
            let dataVigencia = moment(this.proposta.dt_data_vigencia, ((this.proposta.dt_data_vigencia).indexOf('/') > 0 ? 'DD/MM/YYYY' : 'YYYY-MM-DD'), true)
            dataVigencia = dataVigencia.format('YYYY-MM-DD')
            let dataFim = moment(this.dataFinalExecucao, ((this.dataFinalExecucao).indexOf('/') > 0 ? 'DD/MM/YYYY' : 'YYYY-MM-DD'), true)
            dataFim = dataFim.format('YYYY-MM-DD 00:00:00.000')
            let periodicidades = [{'codigo': 'MENSAL', 'duracao': 1}, {'codigo': 'BIMESTRAL', 'duracao': 2}, {'codigo': 'TRIMESTRAL', 'duracao': 3}, {'codigo': 'QUADRIMESTRAL', 'duracao': 4}, {'codigo': 'SEMESTRAL', 'duracao': 6}, {'codigo': 'ANUAL', 'duracao': 12}]
            let periodicidadeMeses = _.get(_.find(periodicidades, ['codigo', this.proposta.ds_periodicidade_formulario]), 'duracao')
            let diferencaMesesVigencia = parseInt(this.proposta.periodo_vigencia) - parseInt(this.propostaBackup.periodo_vigencia)
            let diferencaMesesPrazo = parseInt(this.proposta.nr_periodos) - parseInt(this.propostaBackup.nr_periodos)
            let qtdeRelatoriosNovos = Math.trunc(diferencaMesesPrazo / periodicidadeMeses)
            parametros = {'numeroProjeto': this.proposta.ds_codigo_projeto_erp, 'dt_assinatura_convenio': dataConvenio, 'nr_periodos': this.proposta.nr_periodos, 'datfpj': dataFim, 'periodo_vigencia': this.proposta.periodo_vigencia, 'usu_datfimvig': dataVigencia, 'qtde_relatorios_novos': qtdeRelatoriosNovos, 'diferencaMesesPrazo': diferencaMesesPrazo, 'diferencaMesesVigencia': diferencaMesesVigencia}
          }
          if (processo.nome === 'ALTERACAO_METAS' && _.isNull(processo.id)) {
            parametros = {'numeroProjeto': this.proposta.ds_codigo_projeto_erp, 'metas': this.proposta.metas}
          }
          if (processo.nome === 'ALTERACAO_ATIVIDADES' && _.isNull(processo.id)) {
            parametros = {'numeroProjeto': this.proposta.ds_codigo_projeto_erp, 'atividades': this.proposta.atividades}
          }
          if (processo.nome === 'ALTERACAO_PARCELAS_ADIANTAMENTO' && _.isNull(processo.id)) {
            // Verificando exclusões
            let idsAntes = _.map(this.propostaBackup.adiantamentos, 'id')
            let idsDepois = _.map(this.proposta.adiantamentos, 'id')
            // Pegar os ids diferente e guardar como excluídos
            let excluido = _.filter(this.propostaBackup.adiantamentos, function (a) {
              return _.includes(_.difference(idsAntes, idsDepois), a.id)
            })
            let alterado = _.clone(this.proposta.adiantamentos)
            _.forEach(alterado, function (p) {
              _.unset(p, 'requisitado')
              _.unset(p, 'percentual_comprovado')
            })
            parametros = {'numeroProjeto': this.proposta.ds_codigo_projeto_erp, 'parcelas': alterado, 'excluido': excluido}
          }
          if (processo.nome === 'ALTERACAO_MUNICIPIOS' && _.isNull(processo.id)) {
            // Verificando exclusões
            let idsAntes = _.map(this.propostaBackup.municipalizacao, 'id')
            let idsDepois = _.map(this.proposta.municipalizacao, 'id')
            // Pegar os ids diferente e guardar como excluídos
            let excluido = _.filter(this.propostaBackup.municipalizacao, function (a) {
              return _.includes(_.difference(idsAntes, idsDepois), a.id)
            })
            parametros = {'numeroProjeto': this.proposta.ds_codigo_projeto_erp, 'municipios': this.proposta.municipalizacao, 'excluido': excluido}
          }
          if (_.includes(['REMANEJAMENTO', 'SUPLEMENTACAO'], processo.nome) && _.isNull(processo.id)) {
            let processoAlteracao = _.cloneDeep(_.find(this.solicitacao.processos, ['nome', processo.nome]))
            if (_.has(processoAlteracao, 'alteracao')) {
              processoAlteracao.alteracao.forEach((alteracao) => {
                this.proposta.atividades.forEach((atividade) => {
                  let itemAlterado = _.find(_.get(atividade, 'itens_orcamentos', []), ['id', alteracao.id])
                  if (itemAlterado) {
                    _.forIn(itemAlterado, function (value, key) {
                      if (!_.has(alteracao, key)) { // A propriedade do item que já foi salva está em um formato de array e neste caso deve manter esse valor
                        _.set(alteracao, key, value)
                      }
                    })
                  }
                })
              })
            }
            parametros = {'numeroProjeto': this.proposta.ds_codigo_projeto_erp, 'modificacao': processoAlteracao, 'dataAssinaturaConvenio': this.proposta.projetoSapiens.usu_datcon, 'dataTerminoVigencia': this.proposta.dt_data_vigencia, 'mesesVigencia': this.proposta.periodo_vigencia}
          }
          requisicaoProcessamento.push({'nome': processo.nome, 'id': processo.id, 'parametros': parametros})
        })
        this.loading.tela = true
        let toast = this.$snotify.async('Processando alterações do projeto...', {timeout: 0})
        axiosLaravel.post('projeto/alteracoes/processar', {'idSolicitacao': this.id, 'solicitacao': this.solicitacao, 'processos': requisicaoProcessamento, 'proposta': this.proposta}).then((response) => {
          this.$snotify.remove(toast.id)
          if (_.get(response.data, 'codigo', '') === 'OK') {
            this.$snotify.success('Projeto alterado', {timeout: 3000})
            this.$router.go(-1)
          } else {
            let msgErro = response.data.mensagem.replaceAll('\n', '<br/>')
            this.$snotify.error(msgErro, {timeout: 20000})
            this.msgErroProcessamento.push(msgErro)
          }
          this.solicitacao = _.cloneDeep(solicitacaoBackup)
          this.loading.tela = false
        })
          .catch((error) => {
            this.solicitacao = _.cloneDeep(solicitacaoBackup)
            let erroMsg = this.$root.trataErro(error)
            this.msgErroProcessamento.push(erroMsg.replaceAll('\n', '<br/>'))
            this.loading.tela = false
            this.$snotify.remove(toast.id)
          })
      },
      registraAlteracaoInclusaoExclusao (processos, nome, antes, depois, verificacoes) {
        let alteracoes = []
        let exclusoes = []
        let inclusoes = []
        antes.forEach((original) => {
          let alterado = _.find(depois, ['id', original.id])
          if (!alterado) {
            exclusoes.push(original.id)
          } else {
            let registroAlteracoes = this.adicionaAlteracao(verificacoes, original, alterado)
            if (nome === 'ALTERACAO_MUNICIPIOS' && (_.keys(registroAlteracoes)).length === 2 && _.get(registroAlteracoes, 'ds_uf') === '') {
              registroAlteracoes = {}
            }
            if (!_.isEmpty(registroAlteracoes)) { alteracoes.push(registroAlteracoes) }
          }
        })
        if (_.includes(['ALTERACAO_METAS', 'ALTERACAO_ATIVIDADES'], nome)) {
          inclusoes = _.filter(depois, function (item) {
            return !_.isNumber(item.id)
          })
        } else if (_.includes(['ALTERACAO_PARCELAS_ADIANTAMENTO', 'ALTERACAO_MUNICIPIOS'], nome)) {
          inclusoes = _.filter(depois, function (item) {
            return !_.has(item, 'id')
          })
        }
        let registroProcesso = {'nome': nome, 'id': null}
        if (alteracoes.length > 0) { _.set(registroProcesso, 'alteracao', alteracoes) }
        if (inclusoes.length > 0) { _.set(registroProcesso, 'inclusao', inclusoes) }
        if (exclusoes.length > 0) { _.set(registroProcesso, 'exclusao', exclusoes) }
        if ((_.keys(registroProcesso)).length > 2) { processos.push(registroProcesso) }
      },
      encaminharSolicitacao (acao, abrirDocumento = null) {
        this.loading.tela = true
        axiosLaravel.post('projeto/alteracoes/encaminhar', {'acao': acao, 'nrProjeto': this.proposta.ds_codigo_projeto_erp, 'idSolicitacao': this.id, 'solicitacao': this.solicitacao, 'decisao': this.decisao, 'etapa': this.etapa}).then((response) => {
          if (_.get(response.data, 'codigo', '') === 'OK') {
            this.$snotify.success(response.data.mensagem, {timeout: 3000})
            this.id = response.data.retorno.id // id do processo criado
            if (!_.isNull(abrirDocumento)) {
              window.open(location.protocol + '//' + location.host + '/solicitacao/alteracoesprojeto/' + abrirDocumento + '/' + this.id, '_blank')
            }
            if (acao !== 'SALVAR') {
              this.$router.go(-1)
            }
          } else {
            this.msgErroProcessamento.push(response.data.mensagem.replaceAll('\n', '<br/>'))
            this.$snotify.error(response.data.mensagem)
          }
          this.$forceUpdate()
          this.loading.tela = false
        })
          .catch((error) => {
            this.loading.tela = false
            console.log('error', error)
            let erroMsg = this.$root.trataErro(error)
            this.msgErroProcessamento.push(erroMsg.replaceAll('\n', '<br/>'))
          })
      },
      adicionaAlteracao (parametros, antes, depois) {
        let alteracoes = {}
        parametros.forEach((parametro) => {
          let valorAntes = '' + _.get(antes, parametro, '')
          let valorDepois = '' + _.get(depois, parametro, '')
          if (valorAntes !== valorDepois) { _.set(alteracoes, parametro, [valorAntes, valorDepois]) }
        })
        if (!_.isEmpty(alteracoes)) { _.set(alteracoes, 'id', antes['id']) }
        return alteracoes
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
      verificaParcelaAdiantadaParcial () {
        let parcelas = _.get(this.proposta, 'adiantamentos', [])
        // console.log('adiantada não parcial', parcelas)
        let requisitadoMenorDisponibilizado = false
        // Verifica se parcela de adiantamento X valor requisitado está diferente
        parcelas.forEach(parcela => {
          // Se requisitado não for undefined, verifica se valor é diferente do
          if (parcela.requisitado) {
            if (parcela.valor > parcela.requisitado) {
              requisitadoMenorDisponibilizado = true
            }
          }
        })
        // console.log(requisitadoMenorDisponibilizado)
        return requisitadoMenorDisponibilizado
      },
      // 72555 - Projetos que não possuem adiantamento
      verificaSeProjetoNaoPossuiAdiantamento () {
        let parcelas = _.get(this.proposta, 'adiantamentos', [])
        // console.log('adiantada não parcial', parcelas)
        let naoPossuiAdiantamento = true
        // Verifica se parcela de adiantamento X valor requisitado está diferente
        parcelas.forEach(parcela => {
          // Se requisitado não for undefined, verifica se valor é diferente do
          if (parcela.requisitado) {
            naoPossuiAdiantamento = false
          }
        })
        console.log('NAO POSSUI ADIANTAMENTO?', naoPossuiAdiantamento)
        return naoPossuiAdiantamento
      },
      removeRestricao (ev) {
        _.remove(this.restricaoParaConcluir, function (i) {
          return i.tag === ev.tag
        })
      },
      ehNulo (valor, opcao) {
        return _.isNull(valor) || _.isNil(valor) || _.isUndefined(valor) ? opcao : valor
      },
      modelosDocumento (id, grupo, tipo) {
        if (this.usuarioLogado.userType === 'FUNDACAO' && !this.ehVisualizacao) {
          this.loading.aditivo.lista = true
          axiosLaravel.post('projeto/modelos/documento', {'id': id, 'grupo': grupo, 'tipo': tipo}).then((response) => {
            if (_.get(response.data, 'codigo', '') === 'OK') {
              this.listaMinutasAditivo = response.data.retorno
            } else {
              this.$snotify.error(response.data.mensagem)
            }
            this.loading.aditivo.lista = false
          })
            .catch((error) => {
              this.loading.aditivo.lista = false
              this.$root.trataErro(error)
            })
        }
      },
      ocultaSinalizarDocumentosInternos () {
        // Deve marcar quais são da FBB e não mostrar os documentos quando o historico das tarefas aponte sua inclusão ter sido pela FBB. Como FBB pode ver tudo então só precisa verificar para Entidade
        let inclusoes = _.filter(this.tarefas, ['nome', 'INCLUSAO_DOCUMENTO'])
        inclusoes.forEach((tarefa) => {
          let id = tarefa.observacao.substr(tarefa.observacao.indexOf('#') + 1)
          let anexo = _.find(this.solicitacao.anexos, ['id', _.toNumber(id)])
          if (anexo) {
            if (this.usuarioLogado.userType === 'FUNDACAO') {
              _.set(anexo, 'ds_tipo_usuario', tarefa.ds_tipo_usuario) // Quando FBB estiver acessando deve incluir informação do tipo do usupario que incluiu o documento na tarefa
              _.set(anexo, 'ds_nome_usuario', tarefa.ds_nome_usuario) // Quando FBB estiver acessando deve incluir informação do tipo do usupario que incluiu o documento na tarefa
            }
            if (this.usuarioLogado.userType !== 'FUNDACAO' && tarefa.ds_tipo_usuario === 'FUNDACAO') {
              _.set(anexo, 'mostrar', false) // Quando entidade estiver acessanbdo e se tratar de documento com tarefa de inclusão feita por FBB, então não deve mostrar
            }
          }
        })
      },
      verificaSeHaAditivoUsando (modelo) {
        let vm = this
        if (!_.isEmpty(this.solicitacao.aditivo.conteudo) || !_.isEmpty(this.solicitacao.aditivo.modelo)) {
          this.$dialog.confirm('Já foi selecionado um modelo. Se selecionar outro, as alterações no atual serão perdidas.', {html: true, animation: 'fade', customClass: 'avisoConfirmacao'}).then(function (dialog) {
            if (!_.isEmpty(vm.solicitacao.anexos)) {
              vm.$dialog.alert('Já foi anexado aditivo. Verifique se ele esta condizente com o modelo selecionado', {html: true, animation: 'fade', customClass: 'avisoInfo'})
            }
            vm.gerarAditivo(modelo)
          }).catch(function () {
          })
        } else {
          vm.gerarAditivo(modelo)
        }
      },
      numeroPorExtenso (numero, tipo = 'INTEIRO') {
        let numeroExtenso = ''
        if (tipo === 'MOEDA') {
          numero = '' + (_.toNumber(numero)).toLocaleString('pt-BR')
          numero += numero.indexOf(',') !== -1 ? '' : ',00'
          numeroExtenso = extenso(numero, {mode: 'currency', number: {decimalSeparator: 'comma'}})
        } else if (tipo === 'INTEIRO') {
          numero = '' + (_.toNumber(numero)).toLocaleString('en-US')
          numeroExtenso = extenso(numero)
        }
        return numeroExtenso
      },
      gerarAditivo (modelo) {
        let preencher = true
        this.loading.aditivo.conteudo = true
        let id = modelo.id
        axiosLaravel.post('projeto/modelos/documento', {'id': id, 'grupo': null, 'tipo': 'COM_DADOS'}).then((response) => {
          if (_.get(response.data, 'codigo', '') === 'OK') {
            let conteudo = _.get(response.data.retorno, '0.dados')
            if (preencher) {
              conteudo = this.trocarTexto(conteudo, ['«ENTIDADE_NOME»'], this.proposta.projetoSapiens.entidadeParceira.nomfor, 'TEXTO')
              conteudo = this.trocarTexto(conteudo, ['«PROJETO_NUMERO»'], this.proposta.projetoSapiens.numprj, 'TEXTO')
              conteudo = this.trocarTexto(conteudo, ['«PROJETO_NOME»'], this.proposta.projetoSapiens.nomprj, 'TEXTO')
              conteudo = this.trocarTexto(conteudo, ['«PROJETO_ASSINATURA_CONVENIO»'], this.proposta.projetoSapiens.usu_datcon, 'DATA')
              conteudo = this.trocarTexto(conteudo, ['«PROJETO_PRAZO»'], this.proposta.nr_periodos, 'TEXTO')
              conteudo = this.trocarTexto(conteudo, ['«PROJETO_PRAZO_EXTENSO»'], this.numeroPorExtenso(this.proposta.nr_periodos, 'INTEIRO'), 'TEXTO')
              conteudo = this.trocarTexto(conteudo, ['«PROJETO_VIGENCIA»'], this.proposta.periodo_vigencia, 'TEXTO')
              conteudo = this.trocarTexto(conteudo, ['«PROJETO_VIGENCIA_EXTENSO»'], this.numeroPorExtenso(this.proposta.periodo_vigencia, 'INTEIRO'), 'TEXTO')
              conteudo = this.trocarTexto(conteudo, ['«PROJETO_TERMINO_EXECUCAO»'], this.dataFinal, 'TEXTO')
              let itensOrcamento = _.flatten(_.map(this.proposta.atividades, 'itens_orcamentos'))
              let totalProjeto = Math.round(_.sumBy(_.filter(itensOrcamento, function (i) { return i.fk_itens !== 'CTR' }), 'valor_total') * 100) / 100
              let totalFBB = Math.round(_.sumBy(_.filter(itensOrcamento, function (i) { return _.includes(['1'], ('' + i.origem).substr(0, 1)) }), 'valor_total') * 100) / 100
              let totalContrapartida = Math.round(_.sumBy(_.filter(itensOrcamento, function (i) { return !_.includes(['1', '5'], ('' + i.origem).substr(0, 1)) }), 'valor_total') * 100) / 100
              let totalSuplementacao = Math.round(_.sumBy(_.filter(itensOrcamento, function (i) { return _.get(i, 'valorAlteracao', 0) > 0 }), 'valorAlteracao') * 100) / 100
              conteudo = this.trocarTexto(conteudo, ['«PROJETO_VALOR_TOTAL»'], totalProjeto, 'MOEDA')
              conteudo = this.trocarTexto(conteudo, ['«PROJETO_FBB_TOTAL»'], totalFBB, 'MOEDA')
              conteudo = this.trocarTexto(conteudo, ['«PROJETO_CONTRAPARTIDA_TOTAL»'], totalContrapartida, 'MOEDA')
              conteudo = this.trocarTexto(conteudo, ['«PROJETO_SUPLEMENTACAO_TOTAL»'], totalSuplementacao, 'MOEDA')
              conteudo = this.trocarTexto(conteudo, ['«PROJETO_VALOR_TOTAL_EXTENSO»'], this.numeroPorExtenso(totalProjeto, 'MOEDA'), 'TEXTO')
              conteudo = this.trocarTexto(conteudo, ['«PROJETO_FBB_TOTAL_EXTENSO»'], this.numeroPorExtenso(totalFBB, 'MOEDA'), 'TEXTO')
              conteudo = this.trocarTexto(conteudo, ['«PROJETO_CONTRAPARTIDA_TOTAL_EXTENSO»'], this.numeroPorExtenso(totalContrapartida, 'MOEDA'), 'TEXTO')
              conteudo = this.trocarTexto(conteudo, ['«PROJETO_SUPLEMENTACAO_TOTAL_EXTENSO»'], this.numeroPorExtenso(totalSuplementacao, 'MOEDA'), 'TEXTO')
              conteudo = this.trocarTexto(conteudo, ['«ENTIDADE_CNPJ»'], this.proposta.projetoSapiens.entidadeParceira.cgccpf, 'CNPJ')
              conteudo = this.trocarTexto(conteudo, ['«ENTIDADE_SEDE_MUNICIPIO»'], this.proposta.projetoSapiens.entidadeParceira.cidfor, 'TEXTO')
              conteudo = this.trocarTexto(conteudo, ['«ENTIDADE_ENDERECO»'], this.proposta.projetoSapiens.entidadeParceira.endfor, 'TEXTO')
              conteudo = this.trocarTexto(conteudo, ['«ENTIDADE_CEP»'], this.proposta.projetoSapiens.entidadeParceira.cepfor, 'CEP')
              conteudo = this.trocarTexto(conteudo, ['«ENTIDADE_UF»'], this.proposta.projetoSapiens.entidadeParceira.sigufs, 'TEXTO')
              conteudo = this.trocarTexto(conteudo, ['«ENTIDADE_REPRESENTANTE_LEGAL_CARGO»'], _.get(this.proposta, 'projetoSapiens.entidadeParceira.dirigentes.0.desniv', ''), 'TEXTO')
              conteudo = this.trocarTexto(conteudo, ['«ENTIDADE_REPRESENTANTE_LEGAL_NOME»'], _.get(this.proposta, 'projetoSapiens.entidadeParceira.dirigentes.0.nomcto', ''), 'TEXTO')
              conteudo = this.trocarTexto(conteudo, ['«ENTIDADE_REPRESENTANTE_LEGAL_PROFISSAO»'], _.get(this.proposta, 'projetoSapiens.entidadeParceira.dirigentes.0.carcto', ''), 'TEXTO')
              conteudo = this.trocarTexto(conteudo, ['«ENTIDADE_REPRESENTANTE_LEGAL_DOC_IDENTIFICACAO»'], _.get(this.proposta, 'projetoSapiens.entidadeParceira.dirigentes.0.usu_rgcto', ''), 'TEXTO')
              conteudo = this.trocarTexto(conteudo, ['«ENTIDADE_REPRESENTANTE_LEGAL_CPF»'], _.get(this.proposta, 'projetoSapiens.entidadeParceira.dirigentes.0.cpfcto', ''), 'CPF')
              conteudo = this.trocarTexto(conteudo, ['«ENTIDADE_REPRESENTANTE_LEGAL_MUNICIPIO»'], _.get(this.proposta, 'projetoSapiens.entidadeParceira.dirigentes.0.usu_cidcto', ''), 'TEXTO')
              if ((_.get(this.proposta, 'projetoSapiens.entidadeParceira.dirigentes', [])).length > 1) { // Se houver mais de um dirigente na lista
                conteudo = this.trocarTexto(conteudo, ['«ENTIDADE_2_REPRESENTANTE_LEGAL_CARGO»'], _.get(this.proposta, 'projetoSapiens.entidadeParceira.dirigentes.1.desniv', ''), 'TEXTO')
                conteudo = this.trocarTexto(conteudo, ['«ENTIDADE_2_REPRESENTANTE_LEGAL_NOME»'], _.get(this.proposta, 'projetoSapiens.entidadeParceira.dirigentes.1.nomcto', ''), 'TEXTO')
                conteudo = this.trocarTexto(conteudo, ['«ENTIDADE_2_REPRESENTANTE_LEGAL_PROFISSAO»'], _.get(this.proposta, 'projetoSapiens.entidadeParceira.dirigentes.1.carcto', ''), 'TEXTO')
                conteudo = this.trocarTexto(conteudo, ['«ENTIDADE_2_REPRESENTANTE_LEGAL_DOC_IDENTIFICACAO»'], _.get(this.proposta, 'projetoSapiens.entidadeParceira.dirigentes.1.usu_rgcto', ''), 'TEXTO')
                conteudo = this.trocarTexto(conteudo, ['«ENTIDADE_2_REPRESENTANTE_LEGAL_CPF»'], _.get(this.proposta, 'projetoSapiens.entidadeParceira.dirigentes.1.cpfcto', ''), 'CPF')
                conteudo = this.trocarTexto(conteudo, ['«ENTIDADE_2_REPRESENTANTE_LEGAL_MUNICIPIO»'], _.get(this.proposta, 'projetoSapiens.entidadeParceira.dirigentes.1.usu_cidcto', ''), 'TEXTO')
              }
              conteudo = this.trocarTexto(conteudo, ['«AGENCIA_PREFIXO»'], _.get(this.proposta, 'ds_agencia_numero', ''), 'TEXTO')
              // TODO PROD - ALTERAR O ID AQUI
              if (id === '8') { // Modelo com Adiantamento
                let listaParcAdt = _.get(this.proposta, 'adiantamentos', [])
                conteudo = this.trocarTexto(conteudo, ['«PROJETO_ADIANTAMENTO_PARCELAS»'], listaParcAdt.length, 'TEXTO')
                let totalAdt = _.sumBy(listaParcAdt, 'valor')
                conteudo = this.trocarTexto(conteudo, ['«PROJETO_ADIANTAMENTO_TOTAL»'], totalAdt, 'MOEDA')
                let conv = ('' + totalAdt).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' })
                let totalAdtExtenso = this.numeroPorExtenso(conv, 'MOEDA')
                conteudo = this.trocarTexto(conteudo, ['«PROJETO_ADIANTAMENTO_TOTAL_EXTENSO»'], totalAdtExtenso, 'TEXTO')
                let listaParcAdtTexto = ''
                listaParcAdt.forEach((p) => {
                  listaParcAdtTexto = listaParcAdtTexto + p.parcela + 'ª parcela: até R$ ' + (p.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' }) + ' (' + 'por extenso' + ');<br/>'
                })
                conteudo = this.trocarTexto(conteudo, ['1ª parcela'], listaParcAdtTexto, 'TEXTO')
              }
              conteudo = this.trocarTexto(conteudo, ['«LOCAL_DATA»'], 'Brasília (DF), ' + moment().format('DD [de] MMMM [de] YYYY'), 'TEXTO')
              conteudo = this.trocarTexto(conteudo, ['&nbsp; &nbsp;'], '&nbsp;&nbsp;&nbsp;', 'TEXTO')
            }
            this.solicitacao.aditivo.conteudo = conteudo
            this.$forceUpdate()
          } else {
            this.$snotify.error(response.data.mensagem)
          }
          this.loading.aditivo.conteudo = false
        })
          .catch((error) => {
            this.loading.aditivo.conteudo = false
            this.$root.trataErro(error)
          })
      },
      trocarTexto (conteudo, textosAtuais, valorNovo, formato) {
        valorNovo = '' + valorNovo
        if (valorNovo && !_.isNil(valorNovo) && !_.isEmpty(valorNovo)) {
          if (formato === 'MOEDA') {
            valorNovo = (_.toNumber(valorNovo)).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' })
          } else if (formato === 'CNPJ') {
            valorNovo = valorNovo.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1')
          } else if (formato === 'CPF') {
            valorNovo = valorNovo.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1')
          } else if (formato === 'CEP') {
            valorNovo = valorNovo.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{3})\d+?$/, '$1')
          } else if (formato === 'DATA') {
            valorNovo = moment(valorNovo).format('DD/MM/YYYY')
          }
          if (textosAtuais.length === 1) { // quando enviado só um texto é o que deve ser trocado
            conteudo = conteudo.replaceAll(textosAtuais[0], valorNovo)
          } else if (textosAtuais.length === 2) { // quando enviado dois textos, funcionará com "de" e "para" para trocar tudo entre eles
            let i = conteudo.indexOf(textosAtuais[0])
            let f = conteudo.indexOf(textosAtuais[1], i)
            conteudo = conteudo.replaceAll(conteudo.substring(i, f), valorNovo)
          }
        }
        return conteudo
      },
      alterarExpandirBloco (bloco) {
        _.set(this.opcoesVisualizacao, [bloco, 'expandir'], !_.get(this.opcoesVisualizacao, [bloco, 'expandir']))
        this.salvarConfiguracoes()
      },
      alterarModoModificacao (bloco) {
        let modoAlterado = _.get(this.opcoesVisualizacao, [bloco, 'modificacoes']) === 'RESUMIDO' ? 'DETALHADO' : 'RESUMIDO'
        if (bloco === 'solicitacao') {
          _.forEach(this.opcoesVisualizacao, function (opc) {
            if (bloco !== 'solicitacoes') {
              _.set(opc, 'modificacoes', modoAlterado)
            }
          })
        } else {
          _.set(this.opcoesVisualizacao, [bloco, 'modificacoes'], modoAlterado)
        }
        this.salvarConfiguracoes()
      },
      salvarConfiguracoes () {
        if (!this.ehVisualizacao) {
          _.set(this.usuarioLogado, 'configuracoes.alteracoes_projeto.opcoes', this.opcoesVisualizacao)
          axiosLaravel.post('/usuario/configuracoes', {'configuracoes': this.usuarioLogado.configuracoes}).then((response) => {
            console.log('Configurações salvas')
          })
            .catch((error) => {
              if (error) {
                console.log('Configurações error', error)
                this.$root.trataErro(error)
              }
            })
        }
      },
      emitir (relatorio) {
        this.loading.tela = true
        let parametros = '<ECodEmp=1><ENumPrj=' + this.proposta.ds_codigo_projeto_erp + '>'
        if (relatorio === 222 || relatorio === 219) {
          parametros += ',<ESitPrj=ULT>'
        } else if (relatorio === 248) {
          parametros += ',<ECodFor=>'
        }
        if (relatorio === 222) {
          parametros += ',<EMosDes=S>'
        }
        if (relatorio === 200 && _.has(this.analiseTributaria, 'nf') && ('' + this.analiseTributaria.nf.SitNfc === '2')) { // Comunicado Interno não usa os parâmetros triviais acima, ent~çao se for este o relatório ele reescreve os parâmetros
          parametros = '<ECodFor=' + this.analiseTributaria.nf.CodFor + '>,<ENumNfc=' + this.analiseTributaria.nf.NumNfc + '>,<ECodSnf=' + this.analiseTributaria.nf.CodSnf + '>,<EForOrg=F>,<EPreCon=N>'
        }
        if (relatorio === 611) {
          parametros = `<ECodFor=${this.analiseTributaria.nf.CodFor}><ENumTit="${this.analiseTributaria.titulo.NumTit}"><ETitBai=S>`
        }
        this.$snotify.clear()
        let codigoRelatorio = (relatorio === 200 ? 'SRNF' : 'FJCF') + relatorio + '.GER'
        if (relatorio === 611) codigoRelatorio = 'FPCP' + relatorio + '.GER'
        this.$snotify.async('Gerando relatório ' + relatorio + '. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.post('relatorio-erp/emitir', {erpReport: {'ds_codigo': codigoRelatorio}, params: parametros}).then((response) => {
          this.onDownload(response, relatorio, this)
        })
          .catch((error) => {
            this.$snotify.clear()
            this.loading.tela = false
            this.$root.trataErro(error)
          })
      },
      onDownload (response, relatorio, vm) {
        let item = response.data.arquivo
        const contentType = 'application/pdf'
        const b64Data = response.data.arquivo
        let file = this.b64toBlob(b64Data, contentType)
        let ie = !!window.MSInputMethodContext && !!document.documentMode
        if (relatorio !== 200) {
          if (!ie) {
            let blob = file
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = 'Relatório ' + relatorio + ' » ' + vm.proposta.ds_codigo_projeto_erp
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          } else {
            let blob = file
            let link = document.createElement('blob')
            link.href = window.navigator.msSaveOrOpenBlob(blob, item.name)
            link.download = 'Relatório ' + relatorio + ' » ' + vm.proposta.ds_codigo_projeto_erp
            link.click()
          }
        } else {
          if (!ie) {
            let blob = file
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = moment(vm.data_edicao).format('YYYYMMDD') + ' ID ' + vm.id
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          } else {
            let blob = file
            let link = document.createElement('blob')
            link.href = window.navigator.msSaveOrOpenBlob(blob, item.name)
            link.download = moment(vm.data_edicao).format('YYYYMMDD') + ' ID ' + vm.id
            link.click()
          }
        }
        this.$snotify.clear()
        this.$snotify.success('Relatório gerado com sucesso!')
        this.loading.tela = false
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
      consultaCronogramaProjeto (numeroProjeto) {
        console.log('consultando cronograma do projeto', numeroProjeto)
        axiosLaravel.get('projeto/alteracoes/verificaItensMensalizados/' + numeroProjeto).then((response) => {
          console.log(response.data)
          this.erroCronograma = response.data.erro_cronograma
          if (this.erroCronograma === true) {
            this.adicionaRestricao({'tag': 'erroCronograma', 'ativo': true, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Erro na mensalização de itens do cronograma. Entre em contato com o administrador do sistema.'})
            let restricoes = _.filter(this.restricaoParaConcluir, {'ativo': true, 'tipo': 'restricao'})
            let mensagens = '<div class=avisoAlerta><li>' + _.join(_.map(restricoes, 'mensagem'), '<li>') + '</div>'
            this.$dialog.alert(mensagens, {html: true, animation: 'fade', customClass: 'avisoAlerta'}).then(function (dialog) {})
            this.msgErroProcessamento.push(mensagens)
          }
        })
        .catch((error) => {
          this.$snotify.clear()
          this.loading.tela = false
          this.$root.trataErro(error)
        })
      },
      cancelarProcesso () {
        this.$snotify.async('Cancelando o processo de alteração...', {timeout: 0})
        this.$refs.alertaCancelamentoDialog.close()
        this.loading.tela = true
        axiosLaravel.post('projeto/alteracoes/cancelar', {id: this.id, justificativa: this.justificativaCancelamento}).then((response) => {
          this.loading.tela = false
          this.$snotify.clear()
          this.$snotify.success('Processo cancelado com sucesso!')
          this.$router.go(-1)
        })
        .catch((error) => {
          this.$snotify.clear()
          this.$root.trataErro(error)
        })
      }
    }
  }
</script>

<style>
  .bloco_com_alteracao {
    border: 1px solid lightskyblue;
    box-shadow: 0px 0px 4px 2px rgba(0,0,0,.1) !important;
  }

  .bloco_resumo_alteracao {
    float: right;
    color: gray;
    cursor: pointer;
    font-size: 14px;
  }
  .bloco_resumo_alteracao:hover {
    color: black;
  }
  .bloco_botoes {
    display: flex;
  }
  .bloco_botoes span {
    margin-right: 2px;
  }

  .sumula_formulario {
    width: 100%;
  }
  .sumula_formulario td {
    border-bottom: 1px solid var(--cor-fraca);
  }

  .sumula_pergunta .alertaQuestao {
    color: var(--cor-atencao-dark);
    margin-left: 10px;
  }
  .sumula_pergunta .avisoQuestao {
    color: var(--cor-destaque-dark);
    margin-left: 10px;
  }

  .sumula_pergunta:hover {
    background: var(--cor-fraca-light);
  }
  .sumula_codigo {
    font-weight: bold;
    color: var(--cor-fraca);
  }
  .sumula_questao {
    padding: 10px 10px;
  }
  .sumula_resposta {
    width: 160px;
  }
  .sumula_resposta span {
    font-size: small;
    margin-right: 10px;
  }

  #modeloMinutaEdicao .ql-editor {
    white-space: normal !important;
  }

  #modeloMinutaEdicao .ql-clipboard {
    left: -100000px;
    height: 1px;
    overflow-y: hidden;
    position: absolute;
    top: 50%;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  /* Classes usadas em outros componentes para marcar registros como inclusão, alteração ou exclusão */
  .modificacaoInclusao {
    background: #c7fbcd;
  }
  .modificacaoExlusao {
    background: #fbc4b4;
  }
  .modificacaoAlteracao {
    background: #e2f7ff;
  }
  .valorAlterado {
    background: #e2f7ff !important;
    border: 1px solid var(--cor-borda) !important;
  }
  .modificacaoResumido {
    background: var(--cor-modificacao-projeto-resumo);
  }
  .modificacaoResumido, .modificacaoDetalhado span {
    padding: 0px 6px;
    border-radius: 20px;
    margin-right: 10px;
  }
  .modificacaoTotalInclusao {
    background: var(--cor-modificacao-projeto-inclusao);
  }
  .modificacaoTotalExclusao {
    background: var(--cor-modificacao-projeto-exclusao);
  }
  .modificacaoTotalAlteracao {
    background: var(--cor-modificacao-projeto-alteracao);
  }

  /* Efeito do botão de mensagens de alerta com hover e pulsing */
  .iconeAlerta {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    text-align: center;
    cursor: pointer;
    color: #000;
    background: #f55353;
    font-size: 14px !important;
  }
  .iconeAlerta span {
    font-weight: bolder;
    color: white;
    font-size: 18px;
  }
  .pulsingAlerta:before {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    border-radius: 50%;
    content: '';
    box-shadow: inset 0 0 0 3px #f55353;
    transition: transform 0.2s, opacity 0.2s;
    animation: pulsing 3s infinite;
  }
  .iconeAlerta:after {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    content: '';
    box-shadow: inset 0 0 0 1px #f55353;
    transition: transform 0.2s, opacity 0.2s;
  }
  .iconeAlerta:hover:after {
    transform: scale(2.45);
    opacity: 0.8;
  }
  @keyframes pulsing {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(2);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
  #alertaCancelamentoDialog {
  border-radius: 1rem;
  border: 0px;
  background-color: #fbc4b4;
  color: #222;
  padding: 35px 45px;
  box-shadow: 1px 1px 15px #222;
  z-index: 999999;
  position: fixed;
  font-size: 16px;
}
#alertaCancelamentoDialog button {
  color: #002D4B;
}
#alertaCancelamentoDialog::backdrop {
  background-color: #222222;
  opacity: 0.8;
}

</style>
