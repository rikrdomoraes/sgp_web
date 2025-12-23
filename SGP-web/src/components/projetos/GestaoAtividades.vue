<template>
  <div>

    <div :class="propsNumeroProjeto ? '' : 'box'" id="gestao_atividades">

      <span v-show="loading.carregando" class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando barras de tempo das atividades...</span>

      <div class="box-header" v-if="!propsNumeroProjeto">

        <span v-if="listaProjetos.length > 1">
          <div class="form-horizontal">
            <div class="form-group required-field">
              <label class="control-label col-md-2">Projeto:</label>
              <div class="col-md-10">
                <select v-model="configuracoes.numeroProjetoSelecionado" name="projeto" class="form-control" aria-hidden="true" @change="selecionaProjeto">
                  <option v-for="projeto in listaProjetos" :value="projeto.ds_codigo_projeto_erp" :selected="projeto.ds_codigo_projeto_erp === configuracoes.numeroProjetoSelecionado">{{projeto.ds_codigo_projeto_erp}} - {{projeto.ds_nome}} (<b>{{projeto.ds_situacao_erp}}</b>)</option>
                </select>
              </div>
            </div>
          </div>
        </span>
        <span v-else-if="listaProjetos.length === 1">
          <h3 class="box-title">{{listaProjetos[0].numero}} - {{listaProjetos[0].nome}}</h3>
        </span>
        <span v-else>
          <h3 class="box-title">Carregando projeto(s) ...</h3>
        </span>
      </div>


      <!-- Gantt de atividades do projeto ------------------------------------------------------------------------->
      <div class="box-body" v-if="!_.isEmpty(projeto)">
        <div v-show="loading.processando" class="overlay" style="z-index: 2000;position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

        <!-- Gráfico do Gantt ------------------>
        <div class="row" v-if="!loading.carregando">
          <div class="col-md-12">

            <div id="gantt">

              <div id="secao_gantt" v-bind:style="'height: ' + ((atividades.length * (configuracoes.altura + configuracoes.espacamento)) + (58 + 30) + ((_.get(_.find(atividades, ['expandir', true]), 'itens', [])).length * (configuracoes.altura + configuracoes.espacamento))) + 'px;'">

                <div id="grade_meses" v-if="configuracoes.mostrarGrade" v-bind:style="
                  'margin-left: ' + (configuracoes.larguraCabecalho + 5) + 'px;' +
                  'width: ' + ((configuracoes.larguraPadrao * projeto.periodos) + 150) + 'px;' +
                  'height: ' + ((atividades.length * (configuracoes.altura + configuracoes.espacamento)) + 30) + 'px;'">

                  <div class="linha_hoje" v-if="configuracoes.mostrarHoje && dataParaPeriodo(hoje, projeto.inicio) <= (projeto.periodos + 1)" ref="HOJE" v-bind:style="
                        'margin-left: ' + (((dataParaPeriodo(hoje, projeto.inicio) - 1) * configuracoes.larguraPadrao) + ((configuracoes.larguraPadrao * hoje.getDate())/30)) + 'px;' +
                        'height:' + ((atividades.length * (configuracoes.altura + configuracoes.espacamento)) + 20 + ((_.get(_.find(atividades, ['expandir', true]), 'itens', [])).length * (configuracoes.altura + configuracoes.espacamento))) + 'px'">
                    <i class="fa fa-sun-o"></i> Hoje
                  </div>

                  <div class="periodo_mes" v-for="p in projeto.periodos"
                       v-bind:style="
                        'width: ' + (configuracoes.larguraPadrao) + 'px;' +
                        'height: ' + ((atividades.length * (configuracoes.altura + configuracoes.espacamento)) + 30 + ((_.get(_.find(atividades, ['expandir', true]), 'itens', [])).length * (configuracoes.altura + configuracoes.espacamento))) + 'px;' +
                        'margin-left: ' + ((p-1) * configuracoes.larguraPadrao) + 'px;'+
                        (p === 1 ? 'border-left: 1px solid var(--cor-borda);' : '')">

                    <div class="periodo_mes_selecionado" v-if="configuracoes.mostrarGanttPorMes && (pendenciasPorPeriodo(p)).length > 0 && !modoEdicao"
                         @click="mostrarPendenciaAnoMes(periodoParaMesAno(p, projeto.inicio, 'YYYY'), periodoParaMesAno(p, projeto.inicio, 'MM - MMMM'))"

                         :title="
                       '<h5>Previsto para <b>' + periodoParaMesAno(p, projeto.inicio, 'MMMM/YYYY') + '</b>' +
                       '<hr/>' +
                       exibirInformacaoSeHouver('Mandato', 'Mandatos', _.sumBy(pendenciasPorPeriodo(p), function(m) { return m.grupo === 'Mandato' ? 1 : 0 })) +
                       exibirInformacaoSeHouver('Relatório de Execução', 'Relatórios de Execução', _.sumBy(pendenciasPorPeriodo(p), function(m) { return m.grupo === 'Relatório de Execução' ? 1 : 0 })) +
                       exibirInformacaoSeHouver('Item do Orçamento previsto', 'Itens do Orçamento previstos', _.sumBy(pendenciasPorPeriodo(p), function(m) { return m.grupo === 'Item Orçamento' ? 1 : 0 })) +

                       '<hr/>' +
                       exibirInformacaoSeHouver('Orçado', 'Orçado', _.sumBy(pendenciasPorPeriodo(p), function(m) { return m.grupo === 'Item Orçamento' ? parseFloat(m.info3) : 0 })) +
                       exibirInformacaoSeHouver('Executado', 'Executado', _.sumBy(pendenciasPorPeriodo(p), function(m) { return m.grupo === 'Item Orçamento' ? parseFloat(m.info4) : 0 })) +
                       '</h5>'"

                         v-tippy="{inertia: false, duration: 0, animation: 'fade', size: 'large', arrow: true, theme: 'light', placement: 'bottom', followCursor: true, distance: 40}">
                    </div>


                    <div class=""v-bind:style="
                      'width: ' + (configuracoes.larguraPadrao) + 'px;' +
                      (configuracoes.mostrarGanttPorMes && (pendenciasPorPeriodo(p)).length > 0 ? 'font-weight: bold;' : '')">
                      {{p}}
                    </div>

                  </div>

                </div>

                <div v-for="origem in configuracoes.mostrarRecursoMensal" v-if="configuracoes.mostrarOrcadoMensal">
                  <div class="" v-if="propsAtividades && !_.isEmpty(periodosOrcamento) && true" v-bind:style="
                    'margin-left: ' + (configuracoes.larguraCabecalho + 5) + 'px;' +
                    'width: ' + ((configuracoes.larguraPadrao * projeto.periodos) + 150) + 'px;' +
                    'height: ' + ((atividades.length * (configuracoes.altura + configuracoes.espacamento)) + 30) + 'px;' +
                    'position: absolute; z-index: 1000; top: 20px;'">
                    <div :class="'recurso_' + origem + '_mes'" v-for="p in projeto.periodos" v-bind:style="
                        'width: ' + (configuracoes.larguraPadrao) + 'px;' +
                        'height: ' + (parseInt(((_.get(periodosOrcamento, [origem, p], 0)*(atividades.length * (configuracoes.altura + configuracoes.espacamento)))/_.max(_.get(periodosOrcamento, [origem], 0))))) + 'px;' +
                        'margin-left: ' + ((p-1) * configuracoes.larguraPadrao) + 'px;'+
                        (p === 1 ? 'border-left: 1px solid var(--cor-borda);' : '')"

                         :title="'<h5>R$ ' + (parseInt(_.get(periodosOrcamento, [origem, p], 0)/1000)) + ' mil</h5>'"
                         v-tippy="{inertia: false, arrow: true, duration: 0, animation: 'fade', size: 'large', theme: 'light', placement: 'top', distance: 10}">
                    </div>
                  </div>
                </div>

                <div id="cabecalho_atividades"
                     v-bind:style="
                      'width: ' + (configuracoes.larguraCabecalho) + 'px;' +
                      'height: ' + ((atividades.length * (configuracoes.altura + configuracoes.espacamento))) + 'px;'">

                  <div class="nome_atividade truncar" v-for="atividade in atividades" v-bind:style="
                      'height: ' + (configuracoes.altura + (atividade.expandir ? (atividade.itens.length * (configuracoes.altura + configuracoes.espacamento)) : 0)) + 'px;' +
                      (configuracoes.altura < 20 ? 'font-size: x-small;' : '') +
                      'padding-top: ' + ((configuracoes.altura/4) - 5) + 'px;' +
                      'margin-bottom: ' + (configuracoes.espacamento) + 'px;'">
                    <!-- TODO tenho que encontrar formula para alinhar texto com itens quando a coluna fica mais larga-->
                    <div v-bind:style="'margin-bottom: ' + (configuracoes.altura / 4) + 'px;'"
                         :title="'<h5>' + atividade.descricao + '</h5>'" v-tippy="{inertia: false, arrow: true, duration: 0, animation: 'fade', size: 'large', theme: 'light', placement: 'bottom', followCursor: true, distance: 40}">
                      {{atividade.descricao}}
                    </div>

                    <div class="nome_item_despesa truncar" v-for="item in atividade.itens" v-if="atividade.expandir"
                         v-bind:style="
                          'height: ' + (configuracoes.altura) + 'px;' +
                          (configuracoes.altura < 20 ? 'font-size: x-small;' : '') +
                          'padding-top: ' + ((configuracoes.altura/4) - 5) + 'px;' +
                          'margin-bottom: ' + (configuracoes.espacamento) + 'px;'"
                         :title="'<h5>' + item.fk_itens + '<br/>' + item.observacao + '</h5>'" v-tippy="{inertia: false, arrow: true, duration: 0, animation: 'fade', size: 'large', theme: 'light', placement: 'bottom', followCursor: true, distance: 40}">
                      <span class="label label-info" v-if="_.includes(('' + item.id), 'novo')">Novo</span>
                      <span v-bind:style="(!_.includes(('' + item.id), 'novo') ? 'margin-left: 35px;' : '') + (_.get(itemAtividadeEditando, 'id', 0) === item.id ? 'color: red' : '')">{{item.fk_itens}} - {{item.observacao}}</span>
                    </div>

                  </div>

                </div>

                <div id="grafico_gantt" v-bind:style="
                  'margin-left: ' + (configuracoes.larguraCabecalho + 5) + 'px;' +
                  'width: ' + (configuracoes.larguraPadrao * projeto.periodos) + 'px;' +
                  'height: ' + ((atividades.length * (configuracoes.altura + configuracoes.espacamento)) + ((_.get(_.find(atividades, ['expandir', true]), 'itens', [])).length * (configuracoes.altura + configuracoes.espacamento))) + 'px'">

                  <div class="atividade_projeto" v-for="atividade in atividades" v-bind:style="
                    'height: ' + (configuracoes.altura + (atividade.expandir ? (atividade.itens.length * (configuracoes.altura + configuracoes.espacamento)) : 0)) + 'px;' +
                    'margin-bottom: ' + (configuracoes.espacamento) + 'px;'">

                    <div class="barra_execucao" v-if="!atividade.expandir"
                         v-bind:style="
                          'width: ' + (
                            ((atividade.termino - atividade.inicio + 1) * configuracoes.larguraPadrao) *
                            (atividade.executado / atividade.orcado)
                          ) + 'px;' +
                          'height: ' + (configuracoes.altura) + 'px;' +
                          'margin-left: ' + ((atividade.inicio-1) * configuracoes.larguraPadrao) + 'px;'">
                    </div>

                    <div class="barra_orcado" v-if="!atividade.expandir"
                         v-bind:style="
                          'width: ' + ((atividade.termino - atividade.inicio + 1) * configuracoes.larguraPadrao) + 'px;' +
                          'height: ' + (configuracoes.altura) + 'px;' +
                          'margin-left: ' + ((atividade.inicio-1) * configuracoes.larguraPadrao) + 'px;' +
                          (atividade.orcado > 0 && dataParaPeriodo(hoje, projeto.inicio) > atividade.termino && percentual(atividade.executado, atividade.orcado) < 100 ? 'background: #ffc8c8;' : '')">
                    </div>


                    <div class="info_externo"
                         v-bind:style="
                          'margin-left: ' + ((atividade.termino) * configuracoes.larguraPadrao) + 'px;' +
                          (configuracoes.altura < 20 ? 'font-size: x-small;' : '') +
                          'padding-top: ' + ((configuracoes.altura/4) - 5) + 'px;'">
                      <span v-if="modoEdicao">
                          <span class="botao_acao_desfazer" v-if="false"
                                @click="reverterAlteracaoAtividade(atividade.id)">
                            <i class="fa fa-refresh"></i>
                            {{verificaAlteracaoPeriodoAtividadeItem(atividade.id)}}
                          </span>
                      </span>
                      <span v-else-if="configuracoes.mostrarInfoExterno">
                        {{ atividade.orcado > 0 ? percentual(atividade.executado, atividade.orcado) + '%' : ''}}
                      </span>
                    </div>


                    <!-- Barra de atividade no Gantt -->
                    <div class="barra_atividade" @click="expandirAtividade(atividade)" v-if="!atividade.expandir"
                         v-bind:style="
                          'width: ' + ((atividade.termino - atividade.inicio + 1) * configuracoes.larguraPadrao) + 'px;' +
                          'height: ' + (configuracoes.altura) + 'px;' +
                          'margin-left: ' + ((atividade.inicio-1) * configuracoes.larguraPadrao) + 'px;' +
                          (modoEdicao && !atividade.expandir && _.find(atividades, ['expandir', true]) ? 'background: rgba(255, 255, 255, 0.75);' : '') +
                          (modoEdicao ? 'cursor: pointer;' : '')"

                         :title="
                          '<h5>' + atividade.descricao + '<br/>' +
                          (atividade.orcado > 0 ?
                          '<hr/>' +
                          'Orçado <b>' + (moeda(atividade.orcado)) + '</b><br/><br/>' +
                          'Executado <b>' + (moeda(atividade.executado)) + '</b><br/><br/>' +
                          '% liberado de <b>' + (percentual(atividade.executado, atividade.orcado)) + '%</b>' : '') +
                          '</h5>'"

                         v-tippy="{inertia: false, arrow: true, duration: 0, animation: 'fade', size: 'large', theme: 'light', placement: 'bottom', followCursor: true, distance: 40}">
                    </div>

                    <div class="barra_detalhamento" @click="expandirAtividade(atividade)" v-if="atividade.expandir"
                         v-bind:style="
                          'width: ' + ((atividade.termino - atividade.inicio + 1) * configuracoes.larguraPadrao) + 'px;' +
                          'height: ' + (configuracoes.altura + (atividade.expandir ? (atividade.itens.length * (configuracoes.altura + configuracoes.espacamento)) : 0)) + 'px;' +
                          'margin-left: ' + ((atividade.inicio-1) * configuracoes.larguraPadrao) + 'px;' +
                          (modoEdicao ? 'cursor: pointer;' : '')">


                      <div class="barra_grafico_totais_periodo" v-bind:style="'height: ' + configuracoes.altura + 'px;'">

                        <div v-for="ctp in _.range(atividade.inicio, atividade.termino + 1)" class="coluna_totais_periodo"
                             v-bind:style="
                              'width: ' + configuracoes.larguraPadrao + 'px;' +
                              'height: ' + configuracoes.altura + 'px;'"
                             :title="
                                '<h5>Período <b>' + ctp + '</b> ( ' + periodoParaMesAno(ctp, projeto.inicio, 'MMMM/YYYY') + ' )<br/><br/>' +
                                (_.get(atividade, ['mensalizacao', ctp, 1], 0) === 0 ? '' : 'Recursos FBB <b>' + (moeda(_.get(atividade, ['mensalizacao', ctp, 1], 0))) + '</b><br/><br/>') +
                                (_.get(atividade, ['mensalizacao', ctp, 2], 0) === 0 ? '' : 'Contrapartida <b>' + (moeda(_.get(atividade, ['mensalizacao', ctp, 2], 0))) + '</b><br/><br/>') +
                                (_.get(atividade, ['mensalizacao', ctp, 1], 0) > 0 && _.get(atividade, ['mensalizacao', ctp, 2], 0) > 0 ? 'Total <b>' + (moeda(_.get(atividade, ['mensalizacao', ctp, 0], 0))) + '</b>': '') +
                                '</h5>'"
                             v-tippy="{inertia: false, arrow: true, duration: 0, animation: 'fade', size: 'large', theme: 'light', placement: 'bottom', followCursor: true, distance: 40}">

                          <div class="acumulado_periodo_contrapartida" v-bind:style="'height: ' + (Math.ceil(Math.abs((_.get(atividade, ['mensalizacao', ctp, 2], 0) / atividade.orcado) * configuracoes.altura))) + 'px;'"></div>
                          <div class="acumulado_periodo_fbb" v-bind:style="'height: ' + (Math.ceil(Math.abs((_.get(atividade, ['mensalizacao', ctp, 1], 0) / atividade.orcado) * configuracoes.altura))) + 'px;'"></div>
                        </div>

                      </div>

                    </div>

                    <!-- Bloco de itens no Gantt -->
                    <div class="itens_atividade" v-if="atividade.expandir"
                         v-bind:style="
                          'height: ' + (atividade.itens.length * (configuracoes.altura + configuracoes.espacamento)) + 'px;' +
                          'margin-top: ' + (configuracoes.altura + 2) + 'px;'">

                      <!-- Barra que representa o item de despesa -->
                      <div v-for="item in atividade.itens">

                        <div :class="'truncar barra_item ' + ('' + item.origem === '2' ? 'item_contrapartida' : 'item_produto_servico')"
                             v-show="_.get(itemAtividadeEditando, 'id', 0) !== item.id"
                             v-bind:style="
                              'width: ' + ((item.periodo_final - item.periodo_inicial + 1) * configuracoes.larguraPadrao) + 'px;' +
                              'height: ' + (configuracoes.altura) + 'px;' +
                              'margin-left: ' + ((item.periodo_inicial-1) * configuracoes.larguraPadrao) + 'px;' +
                              (configuracoes.altura < 20 ? 'font-size: x-small;' : '') +
                              (modoEdicao ? 'cursor: pointer;' : '') +
                              (item.valorSaldo <= 0 ? ('' + item.origem === '2' ? 'background: mediumseagreen;' : 'background: cornflowerblue;') : '') +
                              'padding-top: ' + ((configuracoes.altura/4) - 5) + 'px;' +
                              'margin-bottom: ' + (configuracoes.espacamento) + 'px;'"
                             @click="itemAtividadeEditando = modoEdicao && atividade.executado < atividade.orcado ? _.clone(item) : {}"
                             :title="
                                '<h5>' + item.fk_itens + ' - ' + item.observacao + '<br/><br/>' +
                                'Orçado <b>' + (moeda(item.valorOrcado)) + '</b><br/><br/>' +
                                'Saldo <b>' + (moeda(item.valorSaldo)) + '</b><br/><br/>' +
                                '% liberado de <b>' + (percentual(item.valorOrcado - item.valorSaldo, item.valorOrcado)) + '%</b>' +
                                '</h5>'"
                             v-tippy="{inertia: false, arrow: true, duration: 0, animation: 'fade', size: 'large', theme: 'light', placement: 'bottom', followCursor: true, distance: 40}">

                          {{item.fk_itens}} - {{item.observacao}}
                        </div>


                        <!-- Slider de alteração do periodo de um item de uma atividade -->
                        <div class="slider_alteracao_item_atividade" v-if="modoEdicao && !_.isNull(itemAtividadeEditando) && itemAtividadeEditando.id === item.id"
                             v-bind:style="
                                  'width: ' + ((atividadeEditando.termino - atividadeEditando.inicio + 1) * configuracoes.larguraPadrao) + 'px;' +
                                  'height: ' + (configuracoes.altura) + 'px;' +
                                  'margin-left: ' + ((atividadeEditando.inicio-1) * configuracoes.larguraPadrao) + 'px;'">
                          <div class="barra_editando"
                               v-bind:style="
                                  'width: ' + ((atividadeEditando.termino - atividadeEditando.inicio + 1) * configuracoes.larguraPadrao) + 'px;' +
                                  'height: ' + (configuracoes.altura) + 'px;' +
                                  'margin-left: ' + ((atividadeEditando.inicio-1) * configuracoes.larguraPadrao) + 'px;'">
                          </div>
                          <vue-slider v-model="itemAtividadeEditando.periodo"
                                      :lazy="true"
                                      :process="true"
                                      :adsorb="true"
                                      :enable-cross="false"
                                      :tooltip="'always'"
                                      :tooltip-formatter="periodo => periodoParaMesAno(periodo, projeto.inicio, 'MMMM/YYYY')"
                                      @change="okAlteracaoItem"
                                      :min="atividadeEditando.inicio"
                                      :max=" atividadeEditando.termino">
                          </vue-slider>
                        </div>



                      </div>

                    </div>

                    <!-- Slider de alteração do periodo da atividade -->
                    <div class="slider_alteracao_atividade" v-if="modoEdicao && !_.isNull(atividadeEditando) && atividadeEditando.id === atividade.id"
                         v-bind:style="'height: ' + (configuracoes.altura) + 'px;'">
                      <div class="barra_editando"
                           v-bind:style="
                          'width: ' + ((atividadeEditando.termino - atividadeEditando.inicio + 1) * configuracoes.larguraPadrao) + 'px;' +
                          'height: ' + (configuracoes.altura) + 'px;' +
                          'margin-left: ' + ((atividadeEditando.inicio-1) * configuracoes.larguraPadrao) + 'px;'">
                      </div>
                      <vue-slider v-model="atividadeEditando.periodo"
                                  :lazy="true"
                                  :process="false"
                                  :adsorb="true"
                                  :enable-cross="false"
                                  :tooltip="'always'"
                                  :tooltip-formatter="periodo => periodoParaMesAno(periodo, projeto.inicio, 'MMMM/YYYY')"
                                  @change="okAlteracaoAtividade"
                                  :min="1"
                                  :max="projeto.periodos">
                      </vue-slider>
                    </div>

                  </div>

                </div>

              </div>

            </div>


          </div>
        </div>

        <!-- Legenda ------------------------------------------------------------------------------->
        <div class="col-md-12" v-if="configuracoes.mostrarLegenda && !loading.carregando">
          <table>
            <tr>
              <td class="legenda_etiqueta realce">Legendas</td>
              <td class="legenda_etiqueta" style="background: #dfe4eb" :title="'<h5>Barra que representa o início e término da atividade do projeto</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Atividade do projeto</td>
              <td class="legenda_etiqueta" style="background: var(--cor-destaque)"  :title="'<h5>Esta cor na barra representa o percentual já liberado em recursos financeiros dos itens da atividade</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Liberado</td>
            </tr>
          </table>
        </div>

        <!-- Modo de Edição ---------------------------------------------------------------------------------------------------->
        <div class="row" v-if="modoEdicao">
          <div class="col-md-12 form-horizontal">

            <!-- Alteração de atividade ---------->
            <div class="col-md-12" v-if="false && !_.isNull(atividadeEditando)">
              <div class="row well well-sm no-shadow">

                <div class="col-md-12 form-group">
                  <label class="control-label col-md-2">Atividade:</label>
                  <div class="col-md-10">{{atividadeEditando.descricao}}</div>
                </div>


                <div class="col-md-12 form-group">
                  <label class="control-label col-md-2">Alterar período para:</label>
                  <div class="col-md-10">
                    <strong>{{atividadeEditando.inicio}}</strong> até
                    <strong>{{atividadeEditando.termino}}</strong>
                  </div>
                </div>

                <div class="col-md-10 col-md-offset-2">
                  <button @click="okAlteracaoAtividade" type="button" class="btn btn-confirm btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Ok</button>
                  <button @click="cancelaAlteracao" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
                </div>

              </div>
            </div>


            <!-- Justificativa --------->
            <div class="col-md-12" v-if="_.includes(itensLayout, 'justificativa')">
              <div class="row well well-sm no-shadow">

                <div class="col-md-12 form-group required-field" :class="{'has-error' : errors.first('justificativa')}">
                  <label class="control-label col-md-2">Justificativa:</label>
                  <div class="col-md-10">
                    <textarea v-resizable v-model="alteracao.justificativa" name="justificativa" placeholder="Descreva justificativa" class="form-control" rows="3" v-validate="'required'" data-vv-as="Justificativa"></textarea>
                    <span v-if="errors.first('justificativa')" class="label label-danger"> {{ errors.first('justificativa') }}</span>
                  </div>
                </div>

                <div class="col-md-offset-2 col-md-10">
                    <span v-if="alteracao.alterados.length > 0">
                      <strong>{{alteracao.alterados.length}}</strong> atividades alteradas
                    </span>
                </div>

              </div>

            </div>

          </div>

        </div>


        <!-- Opções ----------------------------------------------------------------------------------------------->
        <div class="box-body" v-if="_.includes(itensLayout, 'opcoes') && !loading.carregando">
          <div class="opcoes" @click="configuracoes.mostrarOpcoes = !configuracoes.mostrarOpcoes; salvarConfiguracoes()">
            <i class="fa fa-gears"></i> Opções
          </div>
          <div class="opcoes" @click="modoEdicaoEntrarSair(!modoEdicao)" v-if="editavel">
            <i :class="'fa fa-' + (!modoEdicao ? 'pencil-square-o' : 'eye')"></i> {{!modoEdicao ? 'Editar' : 'Visualizar'}}
          </div>
        </div>

        <!-- Quadro com opções de configuração do gantt de atividades e pendências -->
        <div v-show="configuracoes.mostrarOpcoes" class="box-body">
          <div class="form-horizontal">

            <div class="form-group col-md-12">
              <label class="control-label col-md-2">Zoom períodos:</label>
              <div class="col-md-2">
                <vue-slider v-model="configuracoes.larguraPadrao"
                            :min="20" :max="60" :interval="1"
                            :hide-label="true"
                            :tooltip="'none'"
                            :drag-on-click="true"
                            @drag-end="salvarConfiguracoes">
                  <template v-slot:process>
                    <div class="escalaZoom"></div>
                  </template>
                </vue-slider>
              </div>
            </div>

            <div class="form-group col-md-12">
              <label class="control-label col-md-2">Altura da barra:</label>
              <div class="col-md-2">
                <vue-slider
                  v-model="configuracoes.altura"
                  :data="[{tamanho: 10, nome: 'Estreita'}, {tamanho: 20, nome: 'Normal'}, {tamanho: 30, nome: 'Larga'}, {tamanho: 40, nome: 'Extra'}]"
                  :data-value="'tamanho'"
                  :data-label="'nome'"
                  :drag-on-click="true"
                  @drag-end="salvarConfiguracoes">
                </vue-slider>
              </div>
            </div>

            <div class="form-group col-md-12">
              <label class="control-label col-md-2">Largura do Cabeçalho:</label>
              <div class="col-md-2">
                <vue-slider v-model="configuracoes.larguraCabecalho"
                            :min="0" :max="600" :interval="10"
                            :hide-label="true"
                            :tooltip="'none'"
                            :drag-on-click="true"
                            @drag-end="salvarConfiguracoes">
                </vue-slider>
              </div>
            </div>

            <div class="form-group col-md-12">
              <label class="control-label col-md-2">Mostrar Grade:</label>
              <span>
                <label class="radio-inline new-control new-control-radio">
                  <input type="radio" name="mostrarGrade" v-model="configuracoes.mostrarGrade" :value="true" @change="salvarConfiguracoes"> Sim <div class="new-control-indicator"></div>
                </label>
                <label class="radio-inline new-control new-control-radio">
                  <input type="radio" name="mostrarGrade" v-model="configuracoes.mostrarGrade" :value="false" @change="salvarConfiguracoes"> Não <div class="new-control-indicator"></div>
                </label>
              </span>
            </div>

            <div class="form-group col-md-12">
              <label class="control-label col-md-2">
                <i class="fa fa-exclamation-circle text-gray" v-if="dataParaPeriodo(hoje, projeto.inicio) > projeto.periodos"
                   :title="'<h5>Já passou do término do projeto, por isso não mostra a marcação de ´hoje´ neste gráfico</h5>'"
                   v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"></i>
                Mostrar Hoje:</label>
              <span>
                <label class="radio-inline new-control new-control-radio">
                  <input type="radio" name="mostrarHoje" v-model="configuracoes.mostrarHoje" :value="true" @change="salvarConfiguracoes"> Sim <div class="new-control-indicator"></div>
                </label>
                <label class="radio-inline new-control new-control-radio">
                  <input type="radio" name="mostrarHoje" v-model="configuracoes.mostrarHoje" :value="false" @change="salvarConfiguracoes"> Não <div class="new-control-indicator"></div>
                </label>
              </span>
            </div>

            <div class="form-group col-md-12">
              <label class="control-label col-md-2">
                Mostrar Orçado Mensal:</label>
              <span>
                <label class="radio-inline new-control new-control-radio">
                  <input type="radio" name="mostrarOrcadoMensal" v-model="configuracoes.mostrarOrcadoMensal" :value="true" @change="salvarConfiguracoes"> Sim <div class="new-control-indicator"></div>
                </label>
                <label class="radio-inline new-control new-control-radio">
                  <input type="radio" name="mostrarOrcadoMensal" v-model="configuracoes.mostrarOrcadoMensal" :value="false" @change="salvarConfiguracoes"> Não <div class="new-control-indicator"></div>
                </label>
              </span>
              <span v-if="configuracoes.mostrarOrcadoMensal">
                <i class="fa fa-arrow-right" style="margin: 0 20px"></i>
                <label class="radio-inline new-control new-control-radio">
                  <input type="radio" name="mostrarRecursoMensal" v-model="configuracoes.mostrarRecursoMensal" :value="[1]" @change="salvarConfiguracoes"> FBB <div class="new-control-indicator"></div>
                </label>
                <label class="radio-inline new-control new-control-radio">
                  <input type="radio" name="mostrarRecursoMensal" v-model="configuracoes.mostrarRecursoMensal" :value="[2]" @change="salvarConfiguracoes"> Contrapartida <div class="new-control-indicator"></div>
                </label>
              </span>
            </div>

            <div class="form-group col-md-12">
              <button @click="configuracaoPadrao" type="button" class="btn btn-primary btn-flat col-md-offset-2"><i class="fa fa-repeat" aria-hidden="true"></i> Voltar ao padrão</button>
            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

</template>



<script>
  import { mapGetters } from 'vuex'
  import moment from 'moment'

  export default {
    components: {
    },
    name: 'visualiza-gestao-atividades',
    data () {
      return {
        loading: {
          carregando: false,
          gantt: true,
          processando: false
        },
        hoje: new Date(),
        numeroProjeto: undefined,
        projeto: {},
        listaProjetos: [],
        atividades: [],
        periodosOrcamento: {},
        modoEdicao: false,
        configuracoes: {
          carteiraSelecionada: null,
          numeroProjetoSelecionado: null,
          altura: 20,
          espacamento: 5,
          larguraPadrao: 40, // Largura de cada periodo em px
          larguraCabecalho: 200, // Largura da seção de cabecalho com os nomeas das atividades
          mostrarGantt: true,
          mostrarLegenda: false,
          mostrarGrade: true,
          mostrarHoje: true,
          mostrarOrcadoMensal: false,
          mostrarRecursoMensal: [1],
          mostrarOpcoes: false,
          mostrarInfoExterno: true
        },
        alteracao: {
          alterados: [],
          justificativa: null
        },
        atividadesBackup: [],
        atividadeEditando: null,
        itemAtividadeEditando: null,
        atividadeDetalhando: null
      }
    },
    props: ['propsNumeroProjeto', 'propsAtividades', 'editavel', 'itensLayout', 'atividadesAlteradas',
      'proposta', // obrigatorio - a proposta passada para o Gantt pegar dados complementares
      'atualizarGantt' // opcional - se omitido ou true será atualizado por padrão (buscaCronograma será executado), se false então usará os dados passados por propsAtividades
    ],
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    watch: {
      'propsAtividades': {
        handler: function (after, before) {
          if (!_.isEqual(after, before)) {
            this.atualizarGanttPelaProposta()
          }
        },
        deep: true
      },
      editavel: function () {
        this.modoEdicaoEntrarSair(this.editavel)
      },
      atividadeEditando: function () {
        this.$emit('validacaoAtividadesGantt', {'tag': 'atividadeEditandoGantt', 'ativo': (!_.isEmpty(this.atividadeEditando)), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Atividade em edição'})
      },
      'alteracao.justificativa' () {
        if (_.includes(this.itensLayout, 'justificativa')) {
          this.$emit('validacaoAtividadesGantt', {'tag': 'justificativaFaltando', 'ativo': _.isEmpty(this.alteracao.justificativa), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Não foi informada a justificativa para alteração'})
        }
      }
    },
    mounted () {
    },
    created () {
      if (this.usuarioLogado.configuracoes.gantt_atividades) {
        this.configuracoes = this.usuarioLogado.configuracoes.gantt_atividades
      }
      this.numeroProjeto = this.propsNumeroProjeto
      if (this.numeroProjeto) {
        if (_.isUndefined(this.atualizarGantt) || this.atualizarGantt) { // Não informado ou true
          this.carregaAtividades()
        } else {
          this.atualizarGanttPelaProposta()
        }
      } else {
        this.carregarListaProjetos()
      }
    },
    methods: {
      carregaAtividades () {
        if (!this.loading.carregando) {
          this.loading.carregando = true
          axiosLaravel.get('atividade/gestao/' + this.numeroProjeto).then((response) => {
            if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
              this.projeto = response.data.retorno.projeto
              this.atualizarGanttPelaProposta()
              this.atividadesBackup = _.cloneDeep(this.atividades)
              this.$emit('atividadesGantt', this.atividadesBackup)
              // if (this.editavel) {
              //   this.entraModoEdicao()
              // }
              this.$emit('atividadesAlteracoes', this.alteracao)
            }
            this.$snotify.clear()
            this.loading.carregando = false
          })
            .catch((error) => {
              console.log('error', error)
              this.loading.carregando = false
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        }
      },
      atualizarGanttPelaProposta () {
        this.loading.processando = true
        if (_.isEmpty(this.projeto)) {
          this.projeto = {
            'inicio': this.proposta.dt_assinatura_convenio,
            'termino': moment(this.proposta.dt_assinatura_convenio).add(this.proposta.nr_periodos, 'M').format('YYYY-MM-DD'),
            'periodos': this.proposta.nr_periodos,
            'numero': this.proposta.ds_codigo_projeto_erp,
            'nome': this.proposta.ds_nome,
            'situacao': this.proposta.ds_situacao_erp,
            'id_projeto': this.proposta.id
          }
        }
        //
        if (this.propsAtividades) {
          const atividades = []
          this.propsAtividades.forEach((atividade) => {
            const mensalizacao = {}
            const itens = []
            _.get(atividade, 'itens_orcamentos', []).forEach((item) => {
              const origem = _.toNumber(('' + item.origem).slice(0, 1))
              // Usar this.$set para garantir reatividade
              this.$set(item, 'origem', origem)
              this.$set(item, 'periodo', [item.periodo_inicial, item.periodo_final])
              itens.push(_.pick(item, [
                'id', 'adiantavel', 'origem', 'fk_itens', 'observacao',
                'valorOrcado', 'valorSaldo', 'percAtingimento',
                'periodo_inicial', 'periodo_final', 'periodo'
              ]))
              _.get(item, 'orcamentos_mensalizados', []).forEach((mensalizado) => {
                const periodoOrigemTotal = _.get(mensalizacao, [mensalizado.periodo, origem], 0)
                const periodoTotal = _.get(mensalizacao, [mensalizado.periodo, 0], 0)
                // Usar this.$set para atualizações aninhadas
                this.$set(mensalizacao, [mensalizado.periodo, origem], periodoOrigemTotal + mensalizado.valor)
                this.$set(mensalizacao, [mensalizado.periodo, 0], periodoTotal + mensalizado.valor)
              })
            })
            const atividadeSimplificada = {
              'id': atividade.id,
              'inicio': atividade.nr_periodo_inicial,
              'termino': atividade.nr_periodo_final,
              'descricao': atividade.ds_nome,
              'orcado': atividade.valorOrcado,
              'executado': atividade.valorOrcado - atividade.valorSaldo,
              'periodo': [atividade.nr_periodo_inicial, atividade.nr_periodo_final],
              'mensalizacao': mensalizacao,
              'itens': _.clone(itens),
              'expandir': atividade.id === _.get(this.atividadeEditando, 'id', 0)
            }
            atividades.push(atividadeSimplificada)
            if (_.get(this.atividadeEditando, 'id', 0) === atividadeSimplificada.id) {
              this.atividadeEditando = _.cloneDeep(atividadeSimplificada)
              if (this.atividadesAlteradas && _.includes(this.atividadesAlteradas, atividadeSimplificada.id)) {
                this.okAlteracaoAtividade()
              }
            }
          })
          // Atualizar this.atividades de forma reativa
          this.$set(this, 'atividades', atividades)
          //
          this.loading.processando = false
          this.calculaOrcamentoMensal()
        }
      },
      calculaOrcamentoMensal () {
        let periodosOrcamento = {}
        this.propsAtividades.forEach((atividade) => {
          if (_.has(atividade, 'itens_orcamentos') && atividade.itens_orcamentos.length > 0) {
            atividade.itens_orcamentos.forEach((item) => {
              if (_.has(item, 'orcamentos_mensalizados') && item.orcamentos_mensalizados.length > 0) {
                item.orcamentos_mensalizados.forEach((mensalizacao) => {
                  let periodoOrigemTotal = _.get(periodosOrcamento, [item.origem, mensalizacao.periodo], 0)
                  _.set(periodosOrcamento, [item.origem, mensalizacao.periodo], periodoOrigemTotal + mensalizacao.valor)
                })
              }
            })
          }
        })
        this.periodosOrcamento = periodosOrcamento
        this.$forceUpdate()
      },
      periodoParaMesAno (periodo, inicioProjeto, formato) {
        return moment(inicioProjeto).add(periodo - 1, 'month').format(formato)
      },
      dataParaPeriodo (data, inicio) {
        const dataAjustada = moment(data).format('YYYY-MM-01')
        const inicioAjustado = moment(inicio).format('YYYY-MM-01')
        return moment(dataAjustada).diff(moment(inicioAjustado), 'month') + 1
      },
      modoEdicaoEntrarSair (editavel) {
        this.modoEdicao = editavel
        if (!this.modoEdicao) {
          this.atividadeEditando = {}
          this.itemAtividadeEditando = {}
        } else {
          this.atividadeEditando = _.find(this.atividades, ['expandir', true]) || {}
        }
      },
      verificaAlteracaoPeriodoAtividadeItem (id) {
        let atividadeAtual = _.find(this.atividades, ['id', id])
        let atividadeBackup = _.find(this.atividadesBackup, ['id', id])
        let comparacaoPeriodoAtividade = _.isEqual(atividadeAtual.periodo, atividadeBackup.periodo) // Comparando periodo da atividade
        let comparacaoPeriodoItens = _.isEqual(_.map(atividadeAtual.itens, 'periodo'), _.map(atividadeBackup.itens, 'periodo')) // Comparando os periodos de cada item na atividade
        return comparacaoPeriodoAtividade && comparacaoPeriodoItens
      },
      reverterAlteracaoAtividade (id) {
        let atividadeIdx = _.findIndex(this.atividadesBackup, ['id', id])
        if (_.get(this.atividadeEditando, 'id', 0) === id) {
          let expandir = this.atividadeEditando.expandir
          this.atividadeEditando = _.cloneDeep(this.atividadesBackup[atividadeIdx])
          _.set(this.atividadeEditando, 'expandir', expandir)
        }
        this.propsAtividades[atividadeIdx] = _.cloneDeep(this.atividadesBackup[atividadeIdx])
        this.atividades[atividadeIdx] = _.cloneDeep(this.atividadesBackup[atividadeIdx])
        this.$forceUpdate()
      },
      alterarAtividade (atividade) {
        if (this.modoEdicao && atividade.executado < atividade.orcado) {
          this.atividadeEditando = _.clone(atividade)
          this.atividadeEditando['periodo'] = [this.atividadeEditando.inicio, this.atividadeEditando.termino]
        }
      },
      expandirAtividade (atividade) {
        let atividadeAtualExpandida = atividade.expandir
        this.atividades.forEach(function (atv) { atv.expandir = false })
        atividade.expandir = !atividadeAtualExpandida
        this.alterarAtividade(atividade)
        this.$forceUpdate()
      },
      okAlteracaoAtividade () {
        this.loading.processando = true
        // Convertendo do padrão do slider (array) para inicio e termino na atividade em edição
        _.set(this.atividadeEditando, 'inicio', this.atividadeEditando.periodo[0])
        _.set(this.atividadeEditando, 'termino', this.atividadeEditando.periodo[1])
        // Atualizando a lista de atividades do Gannt com novo início e término
        let atividadeAlterada = _.find(this.atividades, ['id', this.atividadeEditando.id])
        _.set(atividadeAlterada, 'inicio', this.atividadeEditando.inicio)
        _.set(atividadeAlterada, 'termino', this.atividadeEditando.termino)
        // Atualizando a propsAtividades com novo início e término da atividade alterada
        this.propsAtividades.forEach((atividade) => {
          if (atividade.id === this.atividadeEditando.id) {
            _.set(atividade, 'nr_periodo_inicial', this.atividadeEditando.inicio)
            _.set(atividade, 'nr_periodo_final', this.atividadeEditando.termino)
            if (_.has(atividade, 'itens_orcamentos')) {
              atividade.itens_orcamentos.forEach((item) => {
                if (('' + item.origem).slice(0, 1) === '2') {
                  item.periodo_final = this.atividadeEditando.termino
                  item.periodo_inicial = this.atividadeEditando.termino
                } else {
                  if (('' + item.fk_itens).slice(0, 1) === 'P') {
                    item.periodo_inicial = this.atividadeEditando.inicio
                    item.periodo_final = this.atividadeEditando.inicio
                  } else if (('' + item.fk_itens).slice(0, 1) === 'S') {
                    item.periodo_inicial = this.atividadeEditando.inicio
                    item.periodo_final = this.atividadeEditando.termino
                  } else {
                    console.log('Item que não é produto nem serviço')
                  }
                }
                // Refazer mensalização
                let orcamentosMensalizados = []
                let valor = item.valorOrcado / (item.periodo_final - item.periodo_inicial + 1)
                for (let i = item.periodo_inicial; i <= item.periodo_final; i++) {
                  orcamentosMensalizados.push({'periodo': i, 'valor': valor})
                }
                item.orcamentos_mensalizados = orcamentosMensalizados
              })
              this.$forceUpdate()
            }
          }
        })
        this.itemAtividadeEditando = null
        this.$forceUpdate()
        this.loading.processando = false
      },
      okAlteracaoItem () {
        this.loading.processando = true
        // Convertendo do padrão do slider (array) para inicio e termino no item em edição
        _.set(this.itemAtividadeEditando, 'inicio', this.itemAtividadeEditando.periodo[0])
        _.set(this.itemAtividadeEditando, 'termino', this.itemAtividadeEditando.periodo[1])
        // Atualizando na lista de atividades do Gannt, o item especifico com novo início e término
        let itemAlterado = _.find(_.find(this.atividades, ['id', this.atividadeEditando.id]), ['id', this.itemAtividadeEditando.id])
        _.set(itemAlterado, 'inicio', this.itemAtividadeEditando.inicio)
        _.set(itemAlterado, 'termino', this.itemAtividadeEditando.termino)
        // Atualizando a propsAtividades com novo início e término do item alterado
        this.propsAtividades.forEach((atividade) => {
          if (atividade.id === this.atividadeEditando.id) {
            _.set(atividade, 'nr_periodo_inicial', this.atividadeEditando.inicio)
            _.set(atividade, 'nr_periodo_final', this.atividadeEditando.termino)
            if (_.has(atividade, 'itens_orcamentos')) {
              atividade.itens_orcamentos.forEach((item) => {
                if (item.id === this.itemAtividadeEditando.id) {
                  item.periodo_inicial = this.itemAtividadeEditando.inicio
                  item.periodo_final = this.itemAtividadeEditando.termino
                }
                // Refazer mensalização
                let orcamentosMensalizados = []
                let valor = item.valorOrcado / (item.periodo_final - item.periodo_inicial + 1)
                for (let i = item.periodo_inicial; i <= item.periodo_final; i++) {
                  orcamentosMensalizados.push({'periodo': i, 'valor': valor})
                }
                item.orcamentos_mensalizados = orcamentosMensalizados
              })
            }
          }
        })
        this.$forceUpdate()
        this.loading.processando = false
      },
      cancelaAlteracao () {
        this.atividadeEditando = null
      },
      carregarListaProjetos () {
        this.loading.carregando = true
        axiosLaravel.post('carteira/lista_projetos/', {'situacoesProjeto': ['APR', 'ENC', 'SO3']}).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            this.listaProjetos = response.data.retorno
            this.configuracoes.numeroProjetoSelecionado = this.listaProjetos[0]['ds_codigo_projeto_erp'] || null
            this.selecionaProjeto()
          } else {
            this.$snotify.error(response.data.mensagem)
          }
          this.loading.carregando = false
        })
          .catch((error) => {
            this.loading.carregando = false
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      selecionaProjeto () {
        this.numeroProjeto = this.configuracoes.numeroProjetoSelecionado
        this.atividadeEditando = null
        this.alteracao = {alterados: [], justificativa: null}
        this.modoEdicao = false
        this.carregaAtividades()
        this.salvarConfiguracoes()
      },
      percentual (valor, base, decimais = 0, limitar = true) {
        let percentagem = parseFloat(base) === 0 ? 0 : (parseFloat(valor) / parseFloat(base)) * 100
        if (limitar) {
          percentagem = percentagem < 0 ? 0 : (percentagem > 100 ? 100 : percentagem)
        }
        return percentagem.toFixed(decimais)
      },
      moeda (numero) {
        numero = _.toNumber(numero)
        return !isNaN(numero) ? numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' }) : ''
      },
      configuracaoPadrao () {
        this.configuracoes = {carteiraSelecionada: null, projetoSelecionado: {}, altura: 20, espacamento: 5, larguraPadrao: 40, larguraCabecalho: 200, mostrarGrade: true, mostrarHoje: true, mostrarOpcoes: false, mostrarInfoExterno: true, mostrarGantt: true, mostrarOrcadoMensal: false, mostrarRecursoMensal: [1]}
        this.salvarConfiguracoes()
      },
      salvarConfiguracoes () {
        _.set(this.usuarioLogado, 'configuracoes.gantt_atividades', this.configuracoes)
        axiosLaravel.post('/usuario/configuracoes', {'configuracoes': this.usuarioLogado.configuracoes}).then((response) => {
          console.log('Configurações salvas')
        })
          .catch((error) => {
            if (error) {
              console.log('error', error)
              this.$root.trataErro(error)
            }
          })
      }
    }
  }
</script>

<style>

  #gestao_atividades {
    position: relative;
  }

  #gestao_atividades #limite_projeto {
    font-size: 14px;
    height: 20px;
  }
  #gestao_atividades #inicio_projeto {
    border-left: 1px solid var(--cor-borda);
    padding-left: 5px;
    position: absolute;
  }
  #gestao_atividades #termino_projeto {
    border-right: 1px solid var(--cor-borda);
    padding-right: 5px;
    position: absolute;
  }

  #gestao_atividades #gantt {
    overflow-x: auto;
    margin-left: 30px;
  }

  #gestao_atividades #secao_gantt {
    position: relative;
  }

  /* Seção de Grade de períodos/meses  **********/
  #gestao_atividades #grade_meses {
    position: absolute;
  }

  #gestao_atividades .recurso_1_mes {
    background: rgba(0, 255, 255, 0.3);
    position: absolute;
  }
  #gestao_atividades .recurso_1_mes:hover {
    background: rgba(49, 179, 220, 0.3);
  }

  #gestao_atividades .recurso_2_mes {
    background: rgba(226, 203, 13, 0.3);
    position: absolute;
  }
  #gestao_atividades .recurso_2_mes:hover {
    background: rgba(226, 175, 65, 0.3);
  }

  #gestao_atividades .periodo_mes {
    position: absolute;
    border-right: 1px solid var(--cor-borda);
    z-index: 10;
    text-align: center;
    font-weight: bold;
  }
  #gestao_atividades .periodo_mes_selecionado {
    z-index: 20;
    width: 100%;
    height: 100%;
    position: absolute;
  }
  #gestao_atividades .periodo_mes_selecionado:hover {
    cursor: pointer;
    border: 1px solid white;
    box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.2) !important;
  }


  #gestao_atividades .texto_vertical {
    margin-top: 15px;
    transform: rotate(-90deg);
    transform-origin: right, top;
    -ms-transform: rotate(-90deg);
    -ms-transform-origin: right, top;
    -webkit-transform: rotate(-90deg);
    -webkit-transform-origin: right, top;
    -moz-transform: rotate(-90deg);
    -o-transform: rotate(-90deg);
  }

  #gestao_atividades #cabecalho_atividades .nome_atividade .nome_item_despesa {
    font-style: italic;
  }

  /* Seção de do cabecalho das atividades  *********************/
  #gestao_atividades #cabecalho_atividades {
    position: absolute;
    margin-top: 30px;
  }

  #gestao_atividades #cabecalho_atividades .nome_atividade {
    font-weight: bold;
    font-size: small;
  }


  /* Seção de Atividades  *********************/
  #gestao_atividades #grafico_gantt {
    position: absolute;
    margin-top: 30px;
  }

  #gestao_atividades .atividade_projeto {
    /*border: 1px solid red*/
  }

  #gestao_atividades .info_externo {
    font-weight: bold;
    padding: 5px;
    position: absolute;
  }

  #gestao_atividades .barra_atividade {
    position: absolute;
    height: 25px;
    z-index: 400;
    background: transparent;
  }
  #gestao_atividades .barra_atividade:hover {
    border: 1px solid white;
    height: 25px;
    z-index: 450;
    box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.2) !important;
  }
  #gestao_atividades .barra_editando {
    position: absolute;
    /*background: silver;*/
    /*background: darkslategray;*/
  }

  #gestao_atividades .barra_detalhamento {
    position: absolute;
    z-index: 400;
    background: silver;
    box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.2) !important;
  }
  #gestao_atividades .itens_atividade {
    z-index: 500;
    position: absolute;
    width: 100%;
  }
  #gestao_atividades .itens_atividade .barra_item {
    border-radius: 20px;
    font-weight: normal;
    color: white;
    padding: 0 4px;
    display: flex;
    align-items: center;
  }
  #gestao_atividades .itens_atividade .barra_item.item_contrapartida {
    background: forestgreen;
  }
  #gestao_atividades .itens_atividade .barra_item.item_produto_servico {
    background: royalblue;
  }
  #gestao_atividades div.barra_item.item_produto_servico + div.slider_alteracao_item_atividade .vue-slider-process {
    height: 20px !important;
    top: -10px !important;
    background: royalblue;
  }
  #gestao_atividades div.barra_item.item_contrapartida + div.slider_alteracao_item_atividade .vue-slider-process {
    height: 20px !important;
    top: -10px !important;
    background: forestgreen;
  }

  #gestao_atividades .barra_grafico_totais_periodo {
    width: 100%;
    background: darkgray;
    display: flex;
    align-items: flex-end;
  }
  #gestao_atividades .coluna_totais_periodo {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  #gestao_atividades .coluna_totais_periodo .acumulado_periodo_contrapartida {
    width: 100%;
    background: forestgreen;
  }
  #gestao_atividades .coluna_totais_periodo .acumulado_periodo_fbb {
    width: 100%;
    background: royalblue;
  }
  #gestao_atividades .botao_acao_ok {
    border-radius: 20px;
    cursor: pointer;
    border: 1px solid lightgray;
    box-shadow: 0px 2px 8px lightsteelblue;
    padding: 3px 6px;
    background: #2E7D32;
    color: white;
  }
  #gestao_atividades .botao_acao_cancelar {
    border-radius: 20px;
    cursor: pointer;
    border: 1px solid lightgray;
    box-shadow: 0px 2px 8px lightsteelblue;
    padding: 3px 6px;
    background: #7c7d2b;
    color: white;
  }
  #gestao_atividades .botao_acao_desfazer {
    border-radius: 20px;
    cursor: pointer;
    border: 1px solid lightgray;
    box-shadow: 0px 2px 8px lightsteelblue;
    padding: 3px 6px;
    background: gray;
    color: white;
  }


  #gestao_atividades .barra_execucao {
    position: absolute;
    height: 25px;
    z-index: 200;
    background: var(--cor-destaque);
    /* abaixo ignora evendos na div cursor sobre a div permitindo apontar o que esta atrás */
    pointer-events: none;
  }

  #gestao_atividades .barra_orcado {
    position: absolute;
    height: 25px;
    z-index: 100;
    background: #dfe4eb;
    /* abaixo ignora evendos na div cursor sobre a div permitindo apontar o que esta atrás */
    pointer-events: none;
  }

  /* camada de informação - acima das barras */
  #gestao_atividades .linha_hoje {
    width: 300px;
    position: absolute;
    z-index: 700;
    border-left: 4px solid #ca1b1b61;
    color: #b32b2b;
    display: flex;
    align-items: flex-end;
    /* abaixo ignora evendos na div cursor sobre a div permitindo apontar o que esta atrás */
    pointer-events: none;
    background: none !important;
    padding-left: 5px;
    margin-top: 20px;
  }

  #gestao_atividades .realce {
    color: var(--cor-azul);
  }

  #gestao_atividades .slider_alteracao_atividade {
    z-index: 1000;
    position: relative;
    /*background: white;*/
  }
  #gestao_atividades .slider_alteracao_atividade .vue-slider-rail {
    background: transparent;
  }

  /* Opções de configuração */
  #gestao_atividades .opcoes {
    cursor: pointer;
    border: 1px solid #ddd;
    border-radius: 25px;
    padding: 0px 10px;
    margin-right: 10px;
    z-index: 1000;
    background: #eee;
    float: left;
  }

  #gestao_atividades div.opcoes:hover {
    color: black;
    background: white;
    border: 1px solid silver;
  }

  /* Opções de configuração */
  #gestao_atividades .legenda {
    color: steelblue;
    font-weight: bold;
    cursor: default;
    float: right;
    font-size: 14px !important;
  }
  #gestao_atividades .legenda_etiqueta {
    width: 140px;
    border: 3px solid white;
    padding: 3px 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

</style>
