<template>
  <div class="box-body extratoff">

    <div v-show="loading.cronograma" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block; z-index: 1000"><i class="fa fa-refresh fa-spin"></i></div>

    <div class="row">
      <div class="col-md-12">
            <!-- 
                :editarCotacao="editarCotacao"
                :setDescricaoValor="setDescricaoValor" 
                :fecharValidacao="fecharValidacao"
                :atividadeIndex="atividadeIndex" 
                :itemIndex="itemIndex"
                :onAdd="onAdd"
                :atividade="atividade"
                :item="item" -->

        <b-button v-if="false" type="button" @click.stop="buscaCronograma" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-refresh" aria-hidden="true"></i> Atualizar</b-button>

        <div>

          <div class="col-md-6" v-if="!_.includes(['ANALISE', 'SOLICITACAO', 'REVISAO'], etapaProcesso)"
               :title="'<h5>Veja os itens em cada atividade a que pertente ou agrupado por recursos da Fundação e Contrapartidas</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
            <label class="control-label col-md-5">Layout agrupado por: </label>
            <div class="col-md-7">
              <select v-model="layoutExtrato" class="form-control">
                <option value="classico">Atividades</option>
                <option value="porOrigem">Origem do Recurso</option>
              </select>
            </div>
          </div>

          <div :class="!_.includes(['ANALISE', 'SOLICITACAO', 'REVISAO'], etapaProcesso) ? 'col-md-6' : 'col-md-12'" v-if="_.includes(itensLayout, 'filtroItens')"
               :title="'<h5>' + (layoutFiltrosSelecionados.length === 0 ? 'Mostrar o(s) item(ns) que contém o que for selecionado' : (layoutFiltrosSelecionados.length === 1 ? ('Somente mostrando os que tem ' + layoutFiltrosSelecionados[0]) : ('No cronograma filtrando os itens ao mesmo tempo por: ' + _.join(layoutFiltrosSelecionados, ', ')))) + '<br/>Obs.: Filtros não alteram totais</h5>'"
               v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
            <label class="control-label col-md-3">Mostrar item: </label>
            <div class="col-md-9">
              <div class="checkbox-inline">
                <label class="checkbox-inline new-control new-control-checkbox">
                  <input type="checkbox" v-model="layoutFiltrosSelecionados" value="saldos" class="" /> Com saldo <div class="new-control-indicator"></div>
                </label>
              </div>
              <div class="checkbox-inline">
                <label class="checkbox-inline new-control new-control-checkbox">
                  <input type="checkbox" v-model="layoutFiltrosSelecionados" value="produtos" class="" /> Produtos <div class="new-control-indicator"></div>
                </label>
              </div>
              <div class="checkbox-inline">
                <label class="checkbox-inline new-control new-control-checkbox">
                  <input type="checkbox" v-model="layoutFiltrosSelecionados" value="servicos" class="" /> Serviços <div class="new-control-indicator"></div>
                </label>
              </div>
              <div class="checkbox-inline">
                <label class="checkbox-inline new-control new-control-checkbox">
                  <input type="checkbox" v-model="layoutFiltrosSelecionados" value="contrapartidas" class="" /> Contrapartidas <div class="new-control-indicator"></div>
                </label>
              </div>
              <div class="checkbox-inline" v-show="totais.adiantavel.total.orcado !== 0">
                <label class="checkbox-inline new-control new-control-checkbox">
                  <input type="checkbox" v-model="layoutFiltrosSelecionados" value="adiantaveis" class="" /> Adiantáveis <div class="new-control-indicator"></div>
                </label>
              </div>
              <div class="checkbox-inline" v-show="(_.includes(['SUPLEMENTACAO', 'REMANEJAMENTO'], layoutSolicitacao) && totais.solicitacao.percentual !== 0) || alteracoes.length > 0 || inclusoes.length > 0 || !solicitacao">
                <label class="checkbox-inline new-control new-control-checkbox">
                  <input type="checkbox" v-model="layoutFiltrosSelecionados" value="solicitados" class="" /> Solicitado <div class="new-control-indicator"></div>
                </label>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>

    <div class="row" v-if="etapaProcesso != 'VISUALIZACAO' && formEditavel && !_.isNull(layoutSolicitacao)">
      <div class="col-md-12">
        <button type="button" class="btn btn-primary btn-sm btn-flat" @click="irAtividades"><i aria-hidden="true" class="fa fa-plus-circle"></i> Nova Atividade</button>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <table class="table table-condensed">
          <thead v-if="_.includes(itensLayout, 'quantidade') && _.includes(['VISUALIZACAO', 'SOLICITACAO', 'REVISAO'], etapaProcesso)">
          <tr class="cabecalho">
            <th colspan="2" class="">&nbsp;</th>
            <th colspan="2" class="centralizado" :title="'<h5>Valor total contratado no projeto por Atividade e Item</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Orçado</th>
            <th colspan="2" class="centralizado" :title="'<h5>Saldo restante de cada Atividade e Item</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Saldo</th>
            <th class="centralizado">&nbsp;</th>
            <th class="centralizado" v-if="formEditavel">&nbsp;</th>
          </tr>
          <tr class="cabecalho">
            <th colspan="2" class="">{{(layoutExtrato === 'porOrigem' ? 'Origem do Recurso' : 'Atividade')}} / Recursos (itens do cronograma)</th>
            <th class="centralizado">Qtde</th>
            <th class="centralizado">Valor</th>
            <th class="centralizado">Qtde</th>
            <th class="centralizado">Valor</th>
            <th class="centralizado" :title="'<h5>Percentual aproximado já liberado<br/>Não considera Economicidade</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Atingimento</th>
            <th class="centralizado" v-if="formEditavel">&nbsp;</th>
          </tr>
          </thead>

          <thead v-else>
          <tr class="cabecalho">
            <th colspan="2" class="">{{(layoutExtrato === 'porOrigem' ? 'Origem do Recurso' : 'Atividade')}} / Recursos (itens do cronograma)</th>
            <th class="centralizado">Orçado</th>
            <th class="centralizado">Saldo</th>
            <th class="centralizado" :title="'<h5>Percentual aproximado já liberado<br/>Não considera Economicidade</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Atingimento</th>
            <th class="centralizado" v-if="formEditavel">&nbsp;</th>
          </tr>
          </thead>

          <tbody>

          <!-- Tabela -->
          <template v-for="origem in (layoutExtrato === 'classico' ? [['1', '2', '5']] : (layoutExtrato === 'porOrigem') ? [['1', '5'], ['2']] : [[]])">

            <tr v-if="layoutExtrato === 'porOrigem'">
              <td colspan="8" class="atividade">{{(_.includes(origem, '2')) ? 'Recursos de Contrapartida' : 'Recursos da Fundação BB'}}</td>
            </tr>

            <template v-for="(atividade, atividadeIndex) in propsAtividades">
              <tr class="atividade" v-if="layoutExtrato === 'classico'" v-show="_.get(processoSolicitacao, 'processo.situacao', 'EM_EXECUCAO') === 'EM_EXECUCAO' || (_.includes(['FEITO', 'CANCELADO'], processoSolicitacao.processo.situacao) && _.countBy(atividade.itens_orcamentos, 'mostrar')['true'])">
                <td colspan="2" class="esquerda celula b1 b3 b4 nome_atividade">{{atividade.ds_nome}}</td>
                <td class="centralizado celula b1 b3 b4" v-if="_.includes(itensLayout, 'quantidade') && _.includes(['VISUALIZACAO', 'SOLICITACAO', 'REVISAO'], etapaProcesso)">&nbsp;</td>
                <td class="centralizado celula b1 b3">{{atividade.valorOrcado | decimal2}}</td>
                <td class="centralizado celula b1 b3 b4" v-if="_.includes(itensLayout, 'quantidade') && _.includes(['VISUALIZACAO', 'SOLICITACAO', 'REVISAO'], etapaProcesso)">&nbsp;</td>
                <td class="centralizado celula b1 b3">{{atividade.valorSaldo | decimal2}}</td>
                <td class="centralizado celula b1 b3 b2">{{atividade.percAtingimento | percentage}}</td>
                <td class="centralizado celula b1 b3 b2" v-if="formEditavel">
                  <button v-if="_.isEmpty(itemEditando) && !_.isNull(layoutSolicitacao) && etapaProcesso !== 'VISUALIZACAO'" @click="adicionaItem(atividade, atividadeIndex)" type="button" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-plus-circle"  aria-hidden="true"></i> Adicionar Novo Item</button>
                </td>
              </tr>

              <template v-for="(item, itemIndex) in atividade.itens_orcamentos" v-if="_.includes(origem, ('' + item.origem).substring(0, 1))">

                <template v-if="!_.has(item, 'mostrar') || item.mostrar">

                  <tr prefix="activityItem" suffix="item.id" row="item" :class="('' + modoVisualizacaoAlteracoes) === 'DETALHADO' && ehItemNovo(item) ? 'modificacaoInclusao' : ''">
                    <template v-if="_.isEmpty(itemEditando) || (!_.isEmpty(itemEditando) && itemEditando.item.id !== item.id)">
                      <td class="centralizado celula b3 b4">
                      <span v-if="('' + item.origem).substring(0, 1) === '1'">Fundação</span>
                      <span v-else-if="('' + item.origem).substring(0, 1) === '2'">Contrapartida</span>
                      <span v-else-if="('' + item.origem).substring(0, 1) === '5'">P.Estratégico</span>

                      <span v-if="_.find(alteracoes, function (a) { return alteracoes.length > 0 && a.id === item.id && a.alteracao === 'adiantavel' })" class="alteracao"><br/>
                        <!--se houver alteração-->
                        <span v-if="_.find(alteracoes, function (a) { return a.id === item.id && a.alteracao === 'adiantavel' && ('' + a.depois) === '1'})">Será adiantável</span>
                        <span v-else>Era adiantável</span>
                      </span>
                      <span v-else class="adiantavel">
                        <!--se não houver alteração-->
                        <span v-if="item.adiantavel === '1' || item.adiantavel === 1"><br/>Adiantável</span>
                      </span>
                    </td>

                    <td class="celula b3 b4">
                      <div class="item" v-if="!_.isNull(item.item)">
                        <div class="item_despesa esquerda" v-bind:style="(!_.includes(itensLayout, 'quantidade')) ? 'width: 100%' : ''">({{_.upperFirst(_.lowerCase(item.item.ds_type))}})  {{item.item.ds_code + ' / ' + item.item.ds_description}}</div>
                        <div v-if="_.includes(itensLayout, 'contaFinanceira')" class="conta_financeira direita">{{item.contaFinanceiraNumero}} / {{item.contaFinanceiraDescricao}}</div>
                        <div class="observacao esquerda">
                          <!-- <span class=id_item v-if="_.includes(itensLayout, 'idItem')">#{{item.id}} </span> -->
                          <!-- 72436 - Item 6 - Espelhar Hashtags dos Itens -->
                          <span class=id_item>#{{item.id}} </span>
                          <!-- 74126  Cronograma não carregava para o Parceiro-->
                          <div v-if="item.hasOwnProperty('observacaoOriginal')" class="column start-centered">
                            <span>{{ item.observacaoOriginal == 'undefined' ? '-' : item.observacaoOriginal }}</span>
                            <div class="row-flex centered-start" style="gap:5px" v-if="item.hasOwnProperty('observacaoNova') && item.observacaoNova !== ''">
                              <i class="fa fa-pencil" style="color: #2E7D32;"></i><span v-if="item.hasOwnProperty('observacaoNova') && item.observacaoNova !== ''" class="alteracao" v-html="item.observacaoNova"></span>
                            </div>
                          </div>
                          <div v-else>
                              <span>{{ item.observacao == 'undefined' ? '-' : item.observacao }}</span> 
                          </div>
                        </div>
                      </div>
                    </td>

                    <td class="centralizado celula b3 b4" :title="'<h5>' + (!_.has(item, 'unidade_medida') || _.isNull(item.unidade_medida) ? 'Sem unid. de medida' : (item.unidade_medida === 'Outros' && _.has(item, 'medida_outros') && !_.isNull(item.medida_outros) ? ('Outros:<br/>' + item.medida_outros) : item.unidade_medida)) + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}"
                        v-if="_.includes(itensLayout, 'quantidade') && _.includes(['VISUALIZACAO', 'SOLICITACAO', 'REVISAO'], etapaProcesso)">
                      <span :class="(_.find(alteracoes, function (a) { return alteracoes.length > 0 && a.id === item.id && a.alteracao === 'quantidadeOrcado' }) ? 'alteracao' : '')">{{item.quantidadeOrcado}}</span>
                    </td>
                    <td class="centralizado celula b3"><span :class="(_.find(alteracoes, function (a) { return alteracoes.length > 0 && a.id === item.id && a.alteracao === 'valorOrcado' }) ? 'alteracao' : '')">{{(ehItemNovo(item) && _.get(item, 'valorAlteracao', 0) !== 0 ? item.valorAlteracao : item.valorOrcado) | decimal2}}</span></td>
                    <td class="centralizado celula b3 b4" :title="'<h5>' + (!_.has(item, 'unidade_medida') || _.isNull(item.unidade_medida) ? 'Sem unid. de medida' : (item.unidade_medida === 'Outros' && _.has(item, 'medida_outros') && !_.isNull(item.medida_outros) ? ('Outros:<br/>' + item.medida_outros) : item.unidade_medida)) + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}"
                        v-if="_.includes(itensLayout, 'quantidade') && _.includes(['VISUALIZACAO', 'SOLICITACAO', 'REVISAO'], etapaProcesso)">
                      {{item.quantidadeSaldo}}
                    </td>
                    <td class="centralizado celula b3">
                      {{(ehItemNovo(item) && _.get(item, 'valorAlteracao', 0) !== 0 ? item.valorAlteracao : item.valorSaldo) | decimal2}}
                      <span v-if="_.get(item, 'valorAlteracao', 0) !== 0">
                      <br/>
                      <span :title="'<h5>' + item.justificativa + '</h5>'"
                            v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}">
                        <span :class="'valor_alterado' + (layoutSolicitacao === 'SUPLEMENTACAO' && item.valorAlteracao < 0 ? ' label-danger' : '') + (item.valorAlteracao > 0 ? ' acrescimo_valor' : (item.valorAlteracao < 0 ? ' diminuicao_valor' : ''))">
                          <i :class="(item.valorAlteracao > 0 ? 'fa fa-plus-circle' : (item.valorAlteracao < 0 ? 'fa fa-minus-circle' : ''))"></i> {{Math.abs(item.valorAlteracao) | real}}
                        </span>
                      </span>
                    </span>
                    </td>
                    <td class="centralizado celula b3 b2">
                    <span v-if="ehItemNovo(item)" class="label label-info">Novo</span>
                      <span v-else>
                      {{item.percAtingimento | percentage}}
                      <i v-if="('' + item.economicidade) === '1'" class="fa fa-dollar economicidade" :title="'<h5>Comprovado com Economicidade</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"></i>
                    </span>
                    </td>
                    <!-- 73511 - comparativo de precos -->
                    <td class="centralizado celula b3 b2" v-if="etapaProcesso === 'VISUALIZACAO'">
                      <div v-if="!_.isNull(item.fk_cotacao)" title="Abrir Cotação" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                        <b-button class="btn btn-primary btn-sm btn-flat" @click="consultarAbrirCotacao(item.fk_cotacao)"><i class="fa fa-dollar" aria-hidden="true"></i></b-button>
                      </div>
                      <div v-else> - </div>
                    </td>

                    <td class="celula b2 b3" v-if="formEditavel">
                      <div v-if="_.isEmpty(itemEditando)" class="centralizado">
                        <b-button v-if="formEditavel && !_.isNull(layoutSolicitacao)" type="button" @click.stop="editar(item, itemIndex, atividade, atividadeIndex)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>
                      </div>
                    </td>
                    </template>
                  </tr>


  <!--Formulario de item -------------------------------------------------------------------------->
                  <tr v-if="_.includes(['inserindo', 'editando'], itemEditando.acao) && !_.has(listaSolicitacoes, 'processos') && itemEditando.itemIndex === itemIndex && itemEditando.atividadeIndex === atividadeIndex">
                    <template v-if="!_.isEmpty(itemEditando) && itemEditando.item.id === item.id">
                      <td :colspan="formEditavel ? 8 : 7" style="padding: 0">
                        <div class="quadroEdicaoItem">

                          <div class="form-horizontal">

                            <!-- Origem e período de início e término do item -->
                            <!-- <div class="form-group" v-if="ehItemNovo(itemEditando.item)"> -->
                            <div class="form-group">
                              <div  v-if="ehItemNovo(itemEditando.item)" class="required-field" :class="{ 'has-error' : errors.first('origem')}">
                                <label class="control-label col-sm-2">Origem:</label>
                                <div class="col-sm-4">
                                  <select v-model="itemEditando.item.origem" name="origem" @change="zeraAdiantamento()" aria-label="origem" class="form-control" v-validate="'required'">
                                    <option value="1">Fundação</option>
                                    <option value="2">Contrapartida</option>
                                    <option value="5" v-if="totais.projeto.parceiros.orcado !== 0">P.Estratégico</option>
                                  </select>
                                  <span v-if="errors.first('origem')" class="label label-danger"> {{ errors.first('origem') }}</span>
                                </div>
                              </div>
                              <div class="required-field" :class="{ 'has-error' : errors.first('inicio')}">
                                <label class="control-label col-sm-2">Início:</label>
                                <div class="col-sm-1">
                                  <input type="number" v-model="itemEditando.item.periodo_inicial" ref="periodo_inicial" name="inicio" maxlength="2" aria-label="Inicio do período"
                                         class="form-control text-right" :min="atividade.inicio" :max="atividade.termino"
                                         v-validate="'required'" @change="validaPeriodo" />
                                  <span v-if="errors.first('inicio')" class="label label-danger"> {{ errors.first('inicio') }}</span>
                                </div>
                              </div>
                              <div class="required-field">
                                <label class="control-label col-sm-2">Fim:</label>
                                <div class="col-sm-1">
                                  <input type="number" v-model="itemEditando.item.periodo_final" name="fim" ref="periodo_final" maxlength="2" aria-label="Fim do período"
                                         class="form-control text-right" :min="atividade.inicio" :max="atividade.termino" v-validate="'required'" @change="validaPeriodo">
                                  <span v-if="errors.first('fim')" class="label label-danger"> {{ errors.first('fim') }}</span>
                                </div>
                              </div>
                            </div>


                            <!-- Item de despesa -->
                            <div class="form-group" v-if="ehItemNovo(itemEditando.item)">
                              <div class="required-field" :class="{ 'has-error' : errors.first('item')}">
                                <label class="control-label col-sm-2">Item de despesa:</label>
                                <div class="col-sm-10">
                                  <multiselect
                                    name="item"
                                    :custom-label="({ds_code, ds_description}) => { return `${ds_code} / ${ds_description}`}"
                                    :searchable="true"
                                    v-model="itemEditando.item.item" :options="items"
                                    :close-on-select='true'
                                    :hide-selected="true"
                                    :preserve-search="false"
                                    placeholder="Escolha um item"
                                    @select="buscaContasFinanceiras($event)"
                                    :disabled="itemEditando.item.origem === null"
                                    label="ds_description" track-by="ds_code"
                                    :preselect-first="false"
                                    v-validate="'required'">
                                    <template slot="option" slot-scope="props">
                                      <div class="option__desc"><span class="option__title">{{ props.option.ds_code }} / {{ props.option.ds_description }}</span></div>
                                    </template>
                                    <span slot="noResult"><font color="red">Nenhum registro localizado!</font></span>
                                  </multiselect>
                                  <span v-if="errors.first('item')" class="label label-danger"> {{ errors.first('item') }}</span>
                                </div>
                              </div>
                            </div>


                            <!-- Descrição do item -->
                            <div class="form-group">
                            <span v-if="ehItemNovo(itemEditando.item)">
                              <div class="required-field" :class="{ 'has-error' : errors.first('descrição item')}">
                                <label class="control-label col-sm-2">Descrição do item:</label>
                                <div class="col-sm-10">
                                  <input type="text" v-model="itemEditando.item.observacaoOriginal" name="descrição item" maxlength="255" v-validate="'required'" class="form-control"/>
                                  <span v-if="errors.first('descrição item')" class="label label-danger"> {{ errors.first('descrição item') }}</span>
                                </div>
                              </div>
                            </span>
                              <span v-else-if="etapaProcesso !== 'VISUALIZACAO'">
                              <div>
                                <label class="control-label col-sm-2">Descrição do item:</label>
                                <div class="col-sm-10">
                                  <span style="font-weight: normal;" v-html="itemEditando.item.observacaoOriginal"/>
                                  <input type="text" v-model="itemEditando.item['observacaoNova']" name="descrição item" maxlength="255" class="form-control" v-on:keyup="atualizaComponente"/>
                                </div>
                              </div>
                            </span>
                            </div>


                            <!-- Quantidade, Unidade de medida e valor unitário -->
                            <div class="form-group" v-if="ehFBB || ehItemNovo(itemEditando.item)">
                              <div class="required-field" v-if="ehItemNovo(itemEditando.item) || etapaProcesso === 'VISUALIZACAO'" :class="{ 'has-error' : errors.first('quantidade')}">
                                <label class="control-label col-sm-2">Quantidade:</label>
                                <div class="col-sm-1">
                                  <input type="number" v-model="itemEditando.item.quantidadeOrcado" name="quantidade" min="1" maxlength="6"  @change="$forceUpdate()"
                                         class="form-control text-right" v-validate="'required|min_value:' + (ehItemNovo(itemEditando.item) ? 0 : _.get(itemEditando, 'item.quantidadeMinima', 0))"/>
                                  <span v-if="errors.first('quantidade')" class="label label-danger">Deve ser maior que {{ _.get(itemEditando, 'item.quantidadeMinima', 0) }}</span>
                                </div>
                              </div>

                              <div class="required-field" v-if="ehItemNovo(itemEditando.item) || etapaProcesso === 'VISUALIZACAO'" :class="{ 'has-error' : errors.first('unidade de medida')}">
                                <div class="col-sm-2">
                                  <select v-model="itemEditando.item.unidade_medida" class="form-control" name="unidade de medida" v-validate="'required'" @change="atualizaComponente"
                                          :title="'<h5>Unidade de medida</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                                    <option :value="unidade_medida" v-for="unidade_medida in medidas">{{unidade_medida}}</option>
                                  </select>
                                  <span v-if="errors.first('unidade de medida')" class="label label-danger"> {{ errors.first('unidade de medida') }}</span>
                                </div>
                                <div class="col-sm-3">
                                  <div v-if="itemEditando.item.unidade_medida === 'Outros'" class="required-field" :class="{ 'has-error' : errors.first('medida outros')}">
                                    <input type="text" v-model="itemEditando.item.medida_outros" name="medida outros" maxlength="255" aria-label="Outros" v-validate="'required'"
                                           :title="'<h5>Qual essa outra unidade de medida?</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"
                                           class="form-control text-right"/>
                                    <span v-if="errors.first('medida outros')" class="label label-danger"> {{ errors.first('medida outros') }}</span>
                                  </div>
                                </div>
                              </div>

                              <div class="required-field" v-if="ehItemNovo(itemEditando.item)" :class="{ 'has-error' : errors.first('valor unitário')}">
                                <label class="control-label col-sm-2">Valor Unitário:</label>
                                <div class="col-sm-2">
                                  <money v-model="itemEditando.item.valor_unitario" class="form-control" name="valor unitário" v-validate="'required|min_value:1'" @change.native="$forceUpdate()"
                                         :title="'<h5>Valor unitário do item de despesa de acordo com orçamentos</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}">
                                  </money>
                                  <span v-if="errors.first('valor unitário')" class="label label-danger"> Deve ser maior que R$ 1,00</span>
                                </div>
                              </div>
                            </div>


                            <!-- Saldos e Movimentação -->
                            <div class="form-group" v-if="etapaProcesso !== 'VISUALIZACAO'">
                            <span v-if="ehItemNovo(itemEditando.item)">
                              <label class="control-label col-sm-offset-8 col-sm-2">Valor Total:</label>
                              <div class="col-sm-2">
                                <div style="padding: 6px 0">
                                  {{(_.toNumber(itemEditando.item.valor_unitario) * _.toNumber(itemEditando.item.quantidadeOrcado)) | real}}
                                </div>
                              </div>
                            </span>

                            <span v-else>
                              <label class="control-label col-sm-2">Saldo Atual:</label>
                              <div class="col-sm-1 col-lg-2">
                                <div style="padding: 6px 0">{{itemEditando.item.valorSaldo | real}}</div>
                              </div>

                              <div class="required-field" :class="{ 'has-error' : errors.first('valor alterado')}">
                                <label class="control-label col-sm-2">{{layoutSolicitacao === 'REMANEJAMENTO' ? 'Remanejamento' : 'Suplementação'}}:</label>
                                <div class="col-sm-4 col-lg-3">
                                  <div class="input-group">
                                    <span class="input-group-btn sinalValorAlterado" v-if="layoutSolicitacao === 'REMANEJAMENTO'">
                                      <button type="button" @click="itemEditando.item.valorAlteracao = Math.abs(itemEditando.item.valorAlteracao); $forceUpdate()" class="btn"><i class="fa fa-plus-circle" v-bind:style="(itemEditando.item.valorAlteracao > 0 ? 'color: var(--cor-sucesso)' : '')"></i></button>
                                      <button type="button" @click="itemEditando.item.valorAlteracao = Math.abs(itemEditando.item.valorAlteracao) * -1; $forceUpdate()" class="btn"><i class="fa fa-minus-circle" v-bind:style="(itemEditando.item.valorAlteracao < 0 ? 'color: var(--cor-atencao)' : '')"></i></button>
                                    </span>
                                    <money v-model="itemEditando.item.valorAlteracao" class="form-control" name="valor alterado" v-validate="'required|min_value:' + (layoutSolicitacao === 'REMANEJAMENTO' ? (_.toNumber(itemEditando.item.valorSaldo) * -1) : (layoutSolicitacao === 'SUPLEMENTACAO' ? 0.01 : 0))" @change.native="atualizaComponente"
                                           :title="'<h5>' + (layoutSolicitacao === 'REMANEJAMENTO' ? 'Valor que será remanejado, informe valor positivo ou negativo diferente de zero.<br/>Exemplos: 580,00  ou  -346,20.</br>Para alterar apenas a descrição do item deixe o valor igual a R$ 0,00.' : 'Valor que será suplementado, informe valor positivo maior que zero.<br/>Exemplos: 620,00.</br>Para alterar apenas a descrição do item deixe o valor igual a R$ 0,00.') + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}"
                                           v-bind:style="'color:' + (itemEditando.item.valorAlteracao > 0 ? 'var(--cor-verde)' : (itemEditando.item.valorAlteracao < 0 ? 'var(--cor-vermelha)' : ''))">
                                    </money>
                                  </div>
                                  <span v-if="errors.first('valor alterado')" class="label label-danger"> {{layoutSolicitacao === 'REMANEJAMENTO' ? 'Remanejamentos, o item não pode ser 0,00 nem menor que ' + (_.toNumber(itemEditando.item.valorSaldo) * -1) : 'Suplementação, o item não pode ser 0,00 nem negativo. Cancele ou desfaça alteração deste item'}}</span>
                                </div>
                              </div>
                              <label class="control-label col-sm-1 col-lg-1">Saldo final:</label>
                              <div class="col-sm-2">
                                <div style="padding: 6px 0">
                                  {{(_.toNumber(itemEditando.item.valorSaldo) + _.toNumber(itemEditando.item.valorAlteracao)) | real}}
                                </div>
                              </div>
                            </span>
                            </div>


                            <!-- Adiantável e Conta Financeira -->
                            <div class="form-group">
                              <div class="required-field" v-if="_.includes(['SOLICITACAO', 'REVISAO', 'ANALISE', 'AUTORIZACAO'], etapaProcesso)" :class="{ 'has-error' : errors.first('adiantavel')}">
                                <label class="control-label col-sm-2">Adiantável:</label>
                                <div class="col-sm-2">
                                  <select :disabled="itemEditando.item.origem === '2' || itemEditando.item.origem === 2" @change="atualizaComponente"
                                          v-model="itemEditando.item.adiantavel" name="adiantavel" class="form-control" v-validate="'required'">
                                    <option value="0">Não</option>
                                    <option value="1">Sim</option>
                                  </select>
                                  <span v-if="errors.first('adiantavel')" class="label label-danger"> {{ errors.first('adiantavel') }}</span>
                                </div>
                              </div>

                              <div class="required-field" v-if="_.includes(['ANALISE', 'AUTORIZACAO'], etapaProcesso)" :class="{ 'has-error' : errors.first('conta financeira')}">
                                <label class="control-label col-sm-2">Conta Financeira:</label>
                                <div class="col-sm-6">
                                  <multiselect :disabled="true" name="conta financeira" :custom-label="contaCodigo" v-model="itemEditando.item.conta_financeira"
                                               :options="contasFinanceiras" :close-on-select='true' :hide-selected="true" :preserve-search="false"
                                               placeholder="Escolha um item" label="numero_conta" track-by="numero_conta" :preselect-first="false" @select="selecionaConta"
                                               v-validate="'required'">
                                    <template slot="option" slot-scope="props">
                                      <div class="option__desc"><span class="option__title">{{ props.option.numero_conta }} / {{ props.option.descricao }}</span></div>
                                    </template>
                                    <span slot="noResult"><font color="red">Nenhum registro localizado!</font></span>
                                  </multiselect>
                                  <span v-if="errors.first('conta financeira')" class="label label-danger"> {{ errors.first('conta financeira') }}</span>
                                </div>
                              </div>
                            </div>


                            <!-- Justificativa -->
                            <div class="form-group" v-if="etapaProcesso !== 'VISUALIZACAO'">
                              <!-- Esta justificativa é desobrigada se não há observação nova, valor nem é alterado adiantável -->
                              <div v-if="('' + _.get(itemEditando, 'item.adiantavel', '')) === ('' + _.get(propsAtividades, [itemEditando.atividadeIndex, 'itens_orcamentos', itemEditando.itemIndex, 'adiantavel'], '')) &&
                                      Math.abs(_.toNumber(_.get(itemEditando, ['item', 'valorAlteracao'], 0))) === 0 && (_.get(itemEditando, ['item', 'observacaoNova'], '')).length === 0">
                                <label class="control-label col-sm-2">Justificativa:</label>
                                <div class="col-sm-10">
                                  <input type="text" v-model="itemEditando.item.justificativa" name="justificativa item" maxlength="400" class="form-control" v-on:keyup="atualizaComponente"/>
                                  <i class="text-muted"> {{ (_.get(itemEditando, 'item.justificativa', '')).length }} até 400 caracteres</i>
                                </div>
                              </div>
                              <!-- se algum desses é alterado ou preenchido então se torna obrigatória -->
                              <div v-else class="required-field" :class="{ 'has-error' : errors.first('justificativa item')}">
                                <label class="control-label col-sm-2">Justificativa:</label>
                                <div class="col-sm-10">
                                  <input type="text" v-model="itemEditando.item.justificativa" name="justificativa item" maxlength="400" v-validate="'required'" class="form-control" v-on:keyup="atualizaComponente"/>
                                  <i class="text-muted"> {{ (_.get(itemEditando, 'item.justificativa', '')).length }} até 400 caracteres</i>
                                  <span v-if="errors.first('justificativa item')" class="label label-danger"> {{ errors.first('justificativa item') }}</span>
                                </div>
                              </div>
                            </div>


                            <!-- Botões de OK e Cancelar -->
                            <div class="form-group">
                              <div class="col-sm-10 col-sm-offset-2">
                                <div class="col-md-4">
                                  <button @click="ok()" type="button" class="btn btn-confirm btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Ok</button>
                                  <button @click="cancelar(atividade)" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
                                </div>

                                <div class="col-md-4">
                                  <span v-if="_.includes(itensLayout, 'substituicaoItem')"><input type="checkbox" v-model="itemEditando.item['substituicao']" :value="true" /> Este item é substituição de algum outro?</span>
                                </div>

                                <div class="col-md-4">
                                  <button @click="itemEditando.acao = 'excluindo'; cancelar(atividade)" v-if="ehItemNovo(itemEditando.item) && itemEditando.acao === 'editando'" type="button" class="btn btn-danger btn-flat fr"><i class="fa fa-trash" aria-hidden="true"></i> Excluir Item Novo</button>
                                  <button @click="desfazerAlteracao(itemEditando.item)" v-if="!ehItemNovo(itemEditando.item) && _.find(alteracoes, ['id', itemEditando.item.id])" type="button" class="btn btn-primary btn-flat fr"><i class="fa fa-refresh" aria-hidden="true"></i> Desfazer Alterações</button>
                                </div>

                              </div>
                            </div>

                          </div>


                        </div>
                      </td>
                    </template>
                  </tr>

                </template>

              </template>

            </template>

          </template>

          </tbody>

        </table>

      </div>
    </div>

    <div class="row">
      <div class="animated fadeInDownOutUp modal-container">
        <cotacaoItens v-if="abrirCotacao && cotacaoForm.itemCotacao.length > 0"
          :idProposta="proposta.id"
          :fk_cotacao="cotacaoForm.id"
          :cotacaoGravada="cotacaoForm.itemCotacao"
          :cotacaoManualGravada="cotacaoForm.itemCotacaoManual" 
          :validandoCotacao="true"
          :visualizandoCotacao="true"
          :telaProjeto="true"
          :cotacaoValidada="cotacaoForm.itemCotacaoValidado" 
          :toggleCotacao="toggleCotacao"
          :fecharValidacao="toggleCotacao"
          ></cotacaoItens>
      </div>  
    </div>
<!-- Totais ----------------------------------------------------------------------------------------------------------------->

    <div class="row">
      <div class="col-md-12">
        <table :class="'totais ' + (_.includes(['SUPLEMENTACAO', 'REMANEJAMENTO'], _.get(solicitacao, 'nome', null)) ? 'solicitacao_total_' + (layoutSolicitacao === 'SUPLEMENTACAO' && totais.solicitacao.percentual > 0.25 ? 'atencao' : 'ok') : '')" v-if="!loading.cronograma">
          <tr>
            <td class="centralizado"><span v-if="totais.projeto.fbb.orcado !== 0">Total Fundação</span></td>
            <td class="centralizado"><span v-if="totais.projeto.parceiros.orcado !== 0">Total Parceiro Estratégico</span></td>
            <td class="centralizado"><span v-if="totais.projeto.contrapartida.orcado !== 0">Total Contrapartida</span></td>
            <td class="centralizado"><span v-if="totais.adiantavel.total.orcado !== 0">Total Adiantável</span></td>
            <td class="centralizado">Total do Projeto</td>
            <td class="centralizado"><span v-if="totais.solicitacao.fbb > 0 || totais.solicitacao.parceiros > 0 || totais.solicitacao.contrapartida > 0">{{layoutSolicitacao === 'SUPLEMENTACAO' ? 'Total da Suplementação' : 'Total do Remanejamento'}}</span></td>
          </tr>
          <tr>
            <td class="centralizado valor">
                <span v-if="totais.projeto.fbb.orcado !== 0" :title="'<h5>Valor total orçado com recursos da Fundação</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                {{totais.projeto.fbb.orcado | real}}</span>
            </td>
            <td class="centralizado valor">
                <span v-if="totais.projeto.parceiros.orcado !== 0" :title="'<h5>Valor total orçado com recursos de Parceiro Estratégico</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                {{totais.projeto.parceiros.orcado | real}}</span>
            </td>
            <td class="centralizado valor">
                <span v-if="totais.projeto.contrapartida.orcado !== 0" :title="'<h5>Valor total orçado com recursos da Contrapartida</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                {{totais.projeto.contrapartida.orcado | real}}</span>
            </td>
            <td class="centralizado valor">
                <span v-if="totais.adiantavel.total.orcado !== 0" :title="'<h5>Valor total orçado para Adiantamento</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                {{totais.adiantavel.total.orcado | real}}</span>
            </td>
            <td class="centralizado valor">
                <span :title="'<h5>Valor total orçado para este projeto</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                {{totais.projeto.total.orcado | real}}</span>
            </td>
            <td class="centralizado valor">
                <span v-if="(totais.solicitacao.fbb + totais.solicitacao.parceiros + totais.solicitacao.contrapartida) > 0 || inclusoes.length > 0" :title="'<h5>Total ' + (layoutSolicitacao === 'REMANEJAMENTO' ? 'remanejado' : 'suplementado') + ' nesta solicitação</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large' }">
                {{(totais.solicitacao.fbb + totais.solicitacao.parceiros + totais.solicitacao.contrapartida) | real}}</span>
            </td>
          </tr>
          <tr>
            <td class="centralizado valor">
                <span v-if="totais.projeto.fbb.orcado !== 0" class="saldo" :title="'<h5>Saldo dos recursos da Fundação com <span class=\'realce\'>' + (Math.round(100 - ((totais.projeto.fbb.saldo / totais.projeto.fbb.orcado) * 100)) | percent) + '%</span> de atingimento</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                {{totais.projeto.fbb.saldo | real}}</span>
            </td>
            <td class="centralizado valor">
                <span v-if="totais.projeto.parceiros.orcado !== 0" class="saldo" :title="'<h5>Saldo dos recursos de Parceiro Estratégico com <span class=\'realce\'>' + (Math.round(100 - ((totais.projeto.parceiros.saldo / totais.projeto.parceiros.orcado) * 100)) | percent) + '%</span> de atingimento</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                {{totais.projeto.parceiros.saldo | real}}</span>
            </td>
            <td class="centralizado valor">
                <span v-if="totais.projeto.contrapartida.orcado !== 0" class="saldo" :title="'<h5>Saldo dos recursos da Contrapartida com <span class=\'realce\'>' + (Math.round(100 - ((totais.projeto.contrapartida.saldo / totais.projeto.contrapartida.orcado) * 100)) | percent) + '%</span> de atingimento</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                {{totais.projeto.contrapartida.saldo | real}}</span>
            </td>
            <td class="centralizado valor">
                <span v-if="totais.adiantavel.total.orcado !== 0 && false" class="saldo" :title="'<h5>Saldo dos Adiantamento não solicitados ainda</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                {{totais.adiantavel.total.saldo | real}}</span>
            </td>
            <td class="centralizado valor">
                <span class="saldo" :title="'<h5>Saldo total do projeto com <span class=\'realce\'>' + (Math.round(100 - ((totais.projeto.total.saldo / totais.projeto.total.orcado) * 100)) | percent) + '%</span> de atingimento</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                {{totais.projeto.total.saldo | real}}</span>
            </td>
            <td class="centralizado valor">
                <span v-if="totais.solicitacao.percentual > 0" :title="'<h5>Percentual ' + (layoutSolicitacao === 'REMANEJAMENTO' ? 'remanejado' : 'suplementado') + ' referente ao total orçado em recursos próprios</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large' }">
                {{totais.solicitacao.percentual | percentage}}</span>
            </td>
          </tr>

          <template v-if="_.get(solicitacao, 'nome', null) === 'SUPLEMENTACAO' && (totais.solicitacao.fbb !== 0 || totais.solicitacao.parceiros !== 0 || totais.solicitacao.contrapartida !== 0 || totais.solicitacao.total !== 0 || totais.adiantavel.fbb.alterado !== 0 || totais.adiantavel.parceiros.alterado !== 0)">
            <tr>
              <td class="centralizado valor">
                <span v-if="totais.solicitacao.fbb !== 0" :title="'<h5>Total de ' + _.toLower(layoutSolicitacao) + ' para Fundação BB</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}">
                  <span :class="'valor_alterado ' + (totais.solicitacao.fbb > 0 ? 'acrescimo_valor' : (totais.solicitacao.fbb < 0 ? 'diminuicao_valor' : ''))">
                    <i :class="(totais.solicitacao.fbb > 0 ? 'fa fa-plus-circle' : (totais.solicitacao.fbb < 0 ? 'fa fa-minus-circle' : ''))"></i> {{Math.abs(totais.solicitacao.fbb) | real}}
                  </span>
                </span>
              </td>
              <td class="centralizado valor">
                <span v-if="totais.solicitacao.parceiros !== 0" :title="'<h5>Total de ' + _.toLower(layoutSolicitacao) + ' para Parceiros Estratégicos</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}">
                  <span :class="'valor_alterado ' + (totais.solicitacao.parceiros > 0 ? 'acrescimo_valor' : (totais.solicitacao.parceiros < 0 ? 'diminuicao_valor' : ''))">
                    <i :class="(totais.solicitacao.parceiros > 0 ? 'fa fa-plus-circle' : (totais.solicitacao.parceiros < 0 ? 'fa fa-minus-circle' : ''))"></i> {{Math.abs(totais.solicitacao.parceiros) | real}}
                  </span>
                </span>
              </td>
              <td class="centralizado valor">
                <span v-if="totais.solicitacao.contrapartida !== 0" :title="'<h5>Total de ' + _.toLower(layoutSolicitacao) + ' para Contrapartida</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}">
                  <span :class="'valor_alterado ' + (totais.solicitacao.contrapartida > 0 ? 'acrescimo_valor' : (totais.solicitacao.contrapartida < 0 ? 'diminuicao_valor' : ''))">
                    <i :class="(totais.solicitacao.contrapartida > 0 ? 'fa fa-plus-circle' : (totais.solicitacao.contrapartida < 0 ? 'fa fa-minus-circle' : ''))"></i> {{Math.abs(totais.solicitacao.contrapartida) | real}}
                  </span>
                </span>
              </td>
              <td class="centralizado valor">
                <span v-if="totais.solicitacao.adiantavel > 0" :title="'<h5>Total de ' + _.toLower(layoutSolicitacao) + ' em itens Adiantáveis</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}">
                  <span :class="'valor_alterado ' + (totais.solicitacao.adiantavel > 0 ? 'acrescimo_valor' : (totais.solicitacao.adiantavel < 0 ? 'diminuicao_valor' : ''))">
                    <i :class="(totais.solicitacao.adiantavel > 0 ? 'fa fa-plus-circle' : (totais.solicitacao.adiantavel < 0 ? 'fa fa-minus-circle' : ''))"></i> {{Math.abs(totais.solicitacao.adiantavel) | real}}
                  </span>
                </span>
              </td>
              <td class="centralizado valor">
                <span v-if="layoutSolicitacao === 'SUPLEMENTACAO'" :title="'<h5>Total de ' + _.toLower(layoutSolicitacao) + ' neste projeto</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}">
                  <span :class="'valor_alterado ' + ((totais.solicitacao.fbb + totais.solicitacao.parceiros + totais.solicitacao.contrapartida) > 0 ? 'acrescimo_valor' : ((totais.solicitacao.fbb + totais.solicitacao.parceiros + totais.solicitacao.contrapartida) < 0 ? 'diminuicao_valor' : ''))">
                    <i :class="((totais.solicitacao.fbb + totais.solicitacao.parceiros + totais.solicitacao.contrapartida) > 0 ? 'fa fa-plus-circle' : ((totais.solicitacao.fbb + totais.solicitacao.parceiros + totais.solicitacao.contrapartida) < 0 ? 'fa fa-minus-circle' : ''))"></i> {{ (totais.solicitacao.fbb + totais.solicitacao.parceiros + totais.solicitacao.contrapartida) | real}}
                  </span>
                </span>
              </td>
              <td class="centralizado valor"></td><!-- coluna de solicitação, logo abaixo do percentual-->
            </tr>


            <tr>
              <td class="centralizado valor b1 atividade">
                <span v-if="totais.solicitacao.fbb !== 0" :title="'<h5>Total Fundação BB após ' + _.toLower(layoutSolicitacao) + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}">
                  {{Math.abs(totais.projeto.fbb.orcado + totais.solicitacao.fbb) | real}}
                </span>
              </td>
              <td class="centralizado valor b1 atividade">
                <span v-if="totais.solicitacao.parceiros !== 0" :title="'<h5>Total em Parceiros Estratégicos após ' + _.toLower(layoutSolicitacao) + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}">
                  {{Math.abs(totais.projeto.parceiros.orcado + totais.solicitacao.parceiros) | real}}
                </span>
              </td>
              <td class="centralizado valor b1 atividade">
                <span v-if="totais.solicitacao.contrapartida !== 0" :title="'<h5>Total de Contrapartida após ' + _.toLower(layoutSolicitacao) + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}">
                  {{Math.abs(totais.projeto.contrapartida.orcado + totais.solicitacao.contrapartida) | real}}
                </span>
              </td>
              <td class="centralizado valor b1 atividade">
                <span v-if="totais.adiantavel.fbb.alterado !== 0 || totais.adiantavel.parceiros.alterado !== 0" :title="'<h5>Total de itens Adiantáveis após ' + _.toLower(layoutSolicitacao) + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}">
                  {{Math.abs(totais.adiantavel.total.orcado + totais.adiantavel.total.alterado) | real}}
                </span>
              </td>
              <td class="centralizado valor b1 atividade">
                <span :title="'<h5>Total do projeto após ' + _.toLower(layoutSolicitacao) + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}">
                  {{( totais.solicitacao.fbb + totais.solicitacao.parceiros + totais.solicitacao.contrapartida + totais.projeto.total.orcado) | real}}
                </span>
              </td>
              <td class="centralizado valor"><span v-if="totais.solicitacao.percentual > 0.25" class="label label-danger">Acima de 25%</span></td>
            </tr>
          </template>
          <tr v-if="totais.projeto.fbb.alterado !== 0 || totais.projeto.parceiros.alterado !== 0 || totais.projeto.contrapartida.alterado !== 0 || totais.adiantavel.fbb.alterado !== 0 || totais.adiantavel.parceiros.alterado !== 0">
            <td class="centralizado valor">
              <span v-if="totais.projeto.fbb.alterado !== 0 && layoutSolicitacao === 'REMANEJAMENTO'" :title="
                      (totais.projeto.fbb.alterado > 0 ? '<h5>O total alterado esta com diferença positiva de <span class=\'realce\'>' + totais.projeto.fbb.alterado + '</span> e precisa ser ´zerado´ subtraindo este valor de um ou mais itens para permitir o remanejamento' :
                      (totais.projeto.fbb.alterado < 0 ? '<h5>O total alterado esta com diferença de negativa de <span class=\'realce\'>' + totais.projeto.fbb.alterado + '</span> e precisa ser ´zerado´ acrescendo este valor em um ou mais itens ou criando itens novos para permitir o remanejamento' : ''))"
                    v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}">
                <span :class="'valor_alterado label-danger'">
                  <i :class="(totais.projeto.fbb.alterado > 0 ? 'fa fa-plus' : (totais.projeto.fbb.alterado < 0 ? 'fa fa-minus' : ''))"></i> {{Math.abs(totais.projeto.fbb.alterado) | real}}
                </span>
              </span>
            </td>
            <td class="centralizado valor">
              <span v-if="totais.projeto.parceiros.alterado !== 0 && layoutSolicitacao === 'REMANEJAMENTO'" :title="
                      (totais.projeto.parceiros.alterado > 0 ? '<h5>O total alterado esta com diferença positiva de <span class=\'realce\'>' + totais.projeto.parceiros.alterado + '</span> e precisa ser ´zerado´ subtraindo este valor de um ou mais itens para permitir o remanejamento' :
                      (totais.projeto.parceiros.alterado < 0 ? '<h5>O total alterado esta com diferença de negativa de <span class=\'realce\'>' + totais.projeto.parceiros.alterado + '</span> e precisa ser ´zerado´ acrescendo este valor em um ou mais itens ou criando itens novos para permitir o remanejamento' : ''))"
                    v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}">
                <span :class="'valor_alterado label-danger'">
                  <i :class="(totais.projeto.parceiros.alterado > 0 ? 'fa fa-plus' : (totais.projeto.parceiros.alterado < 0 ? 'fa fa-minus' : ''))"></i> {{Math.abs(totais.projeto.parceiros.alterado) | real}}
                </span>
              </span>
            </td>
            <td class="centralizado valor">
              <span v-if="totais.projeto.contrapartida.alterado !== 0 && layoutSolicitacao === 'REMANEJAMENTO'" :title="
                      (totais.projeto.contrapartida.alterado > 0 ? '<h5>O total alterado esta com diferença positiva de <span class=\'realce\'>' + totais.projeto.contrapartida.alterado + '</span> e precisa ser ´zerado´ subtraindo este valor de um ou mais itens para permitir o remanejamento</h5>' :
                      (totais.projeto.contrapartida.alterado < 0 ? '<h5>O total alterado esta com diferença de negativa de <span class=\'realce\'>' + totais.projeto.contrapartida.alterado + '</span> e precisa ser ´zerado´ acrescendo este valor em um ou mais itens ou criando itens novos para permitir o remanejamento</h5>' : ''))"
                    v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}">
                <span :class="'valor_alterado label-danger'">
                  <i :class="(totais.projeto.contrapartida.alterado > 0 ? 'fa fa-plus' : (totais.projeto.contrapartida.alterado < 0 ? 'fa fa-minus' : ''))"></i> {{Math.abs(totais.projeto.contrapartida.alterado) | real}}
                </span>
              </span>
            </td>
            <td class="centralizado valor">
              <span v-if="totais.adiantavel.fbb.alterado !== 0 || totais.adiantavel.parceiros.alterado !== 0" :title="
                      (totais.adiantavel.fbb.alterado !== 0 || totais.adiantavel.parceiros.alterado !== 0 ? '<h5>O total alterado nos Itens Adiantáveis esta com diferença. ' +
                      (totais.adiantavel.fbb.alterado !== 0 ? '<br/>Nos recursos Fundação BB a diferença é de <span class=\'realce\'>' + totais.adiantavel.fbb.alterado + '</span> e precisa ser ´zerado´ ajustando o valor somente em <i>itens adiantáveis</i> nesse remanejamento' : '') +
                      (totais.adiantavel.parceiros.alterado !== 0 ? '<br/>Nos recursos de Parc. Estratégico a diferença é de <span class=\'realce\'>' + totais.adiantavel.fbb.alterado + '</span> e precisa ser ´zerado´ ajustando o valor somente em <i>itens adiantáveis</i> nesse remanejamento' : '') : '') + '</h5>'"
                    v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}">
                <span :class="'valor_alterado label-danger'">
                  <span v-if="totais.adiantavel.fbb.alterado !== 0">
                    <i :class="(totais.adiantavel.fbb.alterado > 0 ? 'fa fa-plus' : (totais.adiantavel.fbb.alterado < 0 ? 'fa fa-minus' : ''))"></i>
                    {{Math.abs(totais.adiantavel.fbb.alterado) | real}}
                  </span>
                  <span v-if="totais.adiantavel.fbb.alterado !== 0 && totais.adiantavel.parceiros.alterado !== 0"> e </span>
                  <span v-if="totais.adiantavel.parceiros.alterado !== 0">
                    <i :class="(totais.adiantavel.parceiros.alterado > 0 ? 'fa fa-plus' : (totais.adiantavel.parceiros.alterado < 0 ? 'fa fa-minus' : ''))"></i>
                    {{Math.abs(totais.adiantavel.parceiros.alterado) | real}}
                  </span>
                </span>
              </span>
            </td>
            <td class="centralizado valor"></td>
            <td class="centralizado valor"></td>
          </tr>
        </table>
      </div>
    </div>

  </div>



</template>

<script>
  import {mapGetters} from 'vuex'
  import cotacaoItens from './comparativoPrecos/cotacaoItens.vue'
  import moment from 'moment'

  export default {
    name: 'extrato',
    data () {
      return {
        moment: moment,
        loading: {
          cronograma: true,
          item: true
        },
        totais: {
          projeto: {
            fbb: {
              orcado: 0,
              saldo: 0,
              alterado: 0
            },
            parceiros: {
              orcado: 0,
              saldo: 0,
              alterado: 0
            },
            contrapartida: {
              orcado: 0,
              saldo: 0,
              alterado: 0
            },
            total: {
              orcado: 0,
              saldo: 0,
              alterado: 0
            }
          },
          adiantavel: {
            fbb: {
              orcado: 0,
              saldo: 0,
              alterado: 0
            },
            parceiros: {
              orcado: 0,
              saldo: 0,
              alterado: 0
            },
            total: {
              orcado: 0,
              saldo: 0,
              alterado: 0
            }
          },
          solicitacao: {
            fbb: 0,
            parceiros: 0,
            contrapartida: 0,
            adiantavel: 0,
            percentual: 0
          }
        },
        layoutExtrato: 'classico', // Forma como estão agrupados os itens: por atividade ou por recursos
        layoutSolicitacao: null, // Quando se trata de uma solicitação, ela pode ser um remanejamento ou suplementção
        etapaProcesso: 'SOLICITACAO', // Quando se trata de uma solicitação, o layout pode ser diferente durante a análise, autorização etc
        layoutFiltrosSelecionados: [],
        listaSolicitacoes: {},
        showForm: false,
        bloqueiaBotoes: false, // Bloqueia botões quando estiver editando
        numeracaoItemNovo: 0,
        conta_financeira: {},
        objetivos: [],
        blockSelect: false,
        atividade: {},
        itemEditando: {},
        alteracoes: [],
        inclusoes: [],
        solicitacao: {},
        medidas: [
          'Caixas',
          'Capacitações',
          'Rolos',
          'Unidades',
          'Outros'
        ],
        componentKey: 0,
        itemTabela: {},
        items: [],
        formasContratacao: [],
        contasFinanceiras: [],
        formEditavel: false,
        atividadeTabela: {}, // Guarda o valor do objeto atividade antes da edição
        rules: `required|min_value:1|max_value:${this.meses}`,
        table: {
          currentPage: 0,
          perPage: 10,
          totalRows: 0,
          sortBy: 'id',
          sortDesc: true,
          fields: [
            { key: 'id', label: 'ID', sortable: true, thStyle: 'width: 6%; text-align: center', class: 'text-center' },
            { key: 'tipo_solicitacao', label: 'Tipo de Solicitação', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'data_solicitacao', label: 'Data de Solicitação', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'valor', label: 'Total da Solicitação', thStyle: 'text-align: center', class: 'text-center' },
            { key: 'etapa', label: 'Etapa', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'situacao', label: 'Situação', thStyle: 'text-align: center', class: 'text-center' }
          ]
        },
        abrirCotacao: false,
        cotacaoForm: []
      }
    },
    props: ['propsObjetivos', 'propsAtividades', 'propsMetas', 'proposta', 'meses', 'projetoDuplicacao', 'editavel', 'layout', 'itensLayout', 'etapa', 'filtroInicial', 'tipoSolicitacao',
      'atualizarExtrato', // opcional - se omitido ou true será atualizado por padrão (buscaCronograma será executado), se false então usará os dados passados por propsAtividades
      'modoVisualizacaoAlteracoes', // opcional - exibe as alterações realizadas. Se o valor for RESUMIDO mostra só o total de modificações, se DETALHADO mostrará quais alterações houveram. Sem valor, null ou outra opção, não mostrará as modificações
      'processoSolicitacao' // opcional - recebe um objeto com o 'processo' e a 'solicitação' de alteração, se houver prcoesso
    ],
    components: {
      cotacaoItens
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ]),
      ehFBB () {
        return this.usuarioLogado.userType === 'FUNDACAO'
      }
    },
    watch: {
      editavel: function () {
        this.formEditavel = this.editavel
        this.alteracoes = []
        this.calcularTotais()
      },
      propsObjetivos () { // Observa o objeto caso ele altere. envia um emit para atualizar o objeto pai
        // this.$emit('itemAdicionado', this.propsObjetivos)
      },
      projetoDuplicacao () {
        this.buscaContasFinanceiras()
      },
      meses () {
      },
      atividades () {
        this.componentKey += 1
      },
      layout () {
        this.layoutExtrato = this.layout
      },
      etapa () {
        this.etapaProcesso = this.etapa
      },
      tipoSolicitacao () {
        this.layoutSolicitacao = this.tipoSolicitacao
        this.calcularTotais()
      },
      processoSolicitacao () {
        this.solicitacao = _.get(this.processoSolicitacao, 'solicitacao', null)
        this.complementarDadosExtrato()
        this.$forceUpdate()
      },
      layoutFiltrosSelecionados () {
        this.filtrarExtrato()
        this.calcularTotais()
      }
    },
    created: function () {
      this.formEditavel = this.editavel
      this.etapaProcesso = this.etapa
      this.layoutExtrato = this.layout
      this.layoutSolicitacao = this.tipoSolicitacao
      this.solicitacao = _.get(this.processoSolicitacao, 'solicitacao', null)
      this.layoutFiltrosSelecionados = this.filtroInicial || []
      if (_.isUndefined(this.atualizarExtrato) || this.atualizarExtrato) { // Não informado ou true
        this.buscaCronograma()
        this.buscaItensDespesas()
      } else {
        this.complementarDadosExtrato()
      }
    },
    methods: {
      filtrarExtrato () {
        this.propsAtividades.forEach((atividade) => {
          if (atividade.itens_orcamentos) {
            atividade.itens_orcamentos.forEach((item) => {
              let selecionados = 0
              selecionados += _.includes(this.layoutFiltrosSelecionados, 'contrapartidas') && ('' + item.origem).substring(0, 1) === '2' ? 1 : 0
              selecionados += _.includes(this.layoutFiltrosSelecionados, 'adiantaveis') && ('' + item.adiantavel === '1') ? 1 : 0
              selecionados += _.includes(this.layoutFiltrosSelecionados, 'saldos') && (_.has(item, 'valorSaldo') && (item.valorSaldo > 0)) ? 1 : 0
              selecionados += _.includes(this.layoutFiltrosSelecionados, 'servicos') && ((item.fk_itens).substring(0, 1) === 'S') ? 1 : 0
              selecionados += _.includes(this.layoutFiltrosSelecionados, 'produtos') && ((item.fk_itens).substring(0, 1) === 'P') ? 1 : 0
              selecionados += _.includes(this.layoutFiltrosSelecionados, 'solicitados') && ((_.includes(['SUPLEMENTACAO', 'REMANEJAMENTO'], this.layoutSolicitacao) && _.get(item, 'valorAlteracao', 0) !== 0) || (_.find(this.alteracoes, ['id', item.id]) || _.find(this.inclusoes, ['id', item.id]))) ? 1 : 0
              item['mostrar'] = this.layoutFiltrosSelecionados.length === selecionados
            })
          }
        })
      },
      atualizaComponente () {
        this.$forceUpdate()
      },
      valorProjetoOrigem (origem) {
        let valorOrcado = 0
        let valorSaldo = 0
        let valorAlteracao = 0
        let valorSolicitado = 0
        let valorAdiantavelOrcado = 0
        let valorAdiantavelAlterado = 0
        let valorAdiantavelSolicitado = 0
        if (_.isUndefined(this.propsAtividades)) {
          return { orcado: 0, saldo: 0, adiantavel: 0, adiantavelAlterado: 0, adiantavelSolicitado: 0, alteracao: 0, solicitado: 0 }
        }
        this.propsAtividades.forEach((atividade) => {
          if (atividade.itens_orcamentos) {
            atividade.itens_orcamentos.forEach((item) => {
              if (('' + item.origem).substring(0, 1) === origem) {
                let orc = parseFloat(item.valorOrcado)
                let sld = parseFloat(item.valorSaldo)
                let alt = parseFloat(_.get(item, 'valorAlteracao', 0))
                valorOrcado += orc
                valorSaldo += sld
                valorAlteracao += alt
                valorSolicitado += alt > 0 ? alt : 0
                valorAdiantavelOrcado += ('' + item.adiantavel === '1') ? orc : 0
                valorAdiantavelAlterado += ('' + item.adiantavel === '1') ? alt : 0
                valorAdiantavelSolicitado += ('' + item.adiantavel === '1') && alt > 0 ? alt : 0
              }
            })
          }
        })
        return { orcado: valorOrcado, saldo: valorSaldo, adiantavel: valorAdiantavelOrcado, adiantavelAlterado: valorAdiantavelAlterado, adiantavelSolicitado: valorAdiantavelSolicitado, alterado: valorAlteracao, solicitado: valorSolicitado }
      },
      // truncarValor (valor) {
      //   let total = Math.ceil(valor * 100) / 100
      //   if (total > 0 && total < 0.09) {
      //     total = Math.floor(valor * 100) / 100
      //   }
      //   console.log(valor)
      //   return total
      // },
      truncarValor (valor) {
        // Corrige pequenas imprecisões de ponto flutuante
        const epsilon = 1e-10
        valor = valor - epsilon
        // Trunca para duas casas decimais
        let total = Math.ceil(valor * 100) / 100
        // Se estiver entre 0 e 0.09, mantém truncado
        if (total > 0 && total < 0.09) {
          total = Math.floor(valor * 100) / 100
        }
        // console.log(valor, '=>', total)
        return total
      },
      // O calcularTotais com return de multiplas variáveis economiza a quantidade de vezes que percorre o cronograma
      calcularTotais () {
        let fbb = this.valorProjetoOrigem('1')
        let contrapartida = this.valorProjetoOrigem('2')
        let parceiro = this.valorProjetoOrigem('5')
        this.totais.projeto.fbb.orcado = this.truncarValor(fbb.orcado)
        this.totais.projeto.fbb.saldo = this.truncarValor(fbb.saldo)
        this.totais.projeto.fbb.alterado = this.truncarValor(fbb.alterado)
        this.totais.adiantavel.fbb.orcado = this.truncarValor(fbb.adiantavel)
        this.totais.adiantavel.fbb.saldo = 0 // TODO pegar o valor já adiantado da proc
        this.totais.adiantavel.fbb.alterado = this.truncarValor(fbb.adiantavelAlterado)
        this.totais.projeto.contrapartida.orcado = this.truncarValor(contrapartida.orcado)
        this.totais.projeto.contrapartida.saldo = this.truncarValor(contrapartida.saldo)
        this.totais.projeto.contrapartida.alterado = this.truncarValor(contrapartida.alterado)
        this.totais.projeto.parceiros.orcado = this.truncarValor(parceiro.orcado)
        this.totais.projeto.parceiros.saldo = this.truncarValor(parceiro.saldo)
        this.totais.projeto.parceiros.alterado = this.truncarValor(parceiro.alterado)
        this.totais.adiantavel.parceiros.orcado = this.truncarValor(parceiro.adiantavel)
        this.totais.adiantavel.parceiros.saldo = 0 // TODO pegar o valor já adiantado da proc
        this.totais.adiantavel.parceiros.alterado = this.truncarValor(parceiro.adiantavelAlterado)
        this.totais.projeto.total.orcado = this.truncarValor(fbb.orcado + contrapartida.orcado + parceiro.orcado)
        this.totais.projeto.total.saldo = this.truncarValor(fbb.saldo + contrapartida.saldo + parceiro.saldo)
        this.totais.projeto.total.alterado = this.truncarValor(this.totais.projeto.fbb.alterado + this.totais.projeto.parceiros.alterado + this.totais.projeto.contrapartida.alterado)
        this.totais.adiantavel.total.orcado = this.truncarValor(fbb.adiantavel + parceiro.adiantavel)
        this.totais.adiantavel.total.saldo = this.truncarValor(this.totais.adiantavel.fbb.saldo + this.totais.adiantavel.parceiros.saldo)
        this.totais.adiantavel.total.alterado = this.truncarValor(this.totais.adiantavel.fbb.alterado + this.totais.adiantavel.parceiros.alterado)
        // Bloco de totais de solicitação, contém tudo que foi sinalizado com valor positivo no cronograma
        this.totais.solicitacao.fbb = this.truncarValor(fbb.solicitado)
        this.totais.solicitacao.parceiros = this.truncarValor(parceiro.solicitado)
        this.totais.solicitacao.contrapartida = this.truncarValor(contrapartida.solicitado)
        this.totais.solicitacao.adiantavel = this.truncarValor(fbb.adiantavelSolicitado + parceiro.adiantavelSolicitado)
        this.totais.solicitacao.percentual = this.totais.solicitacao.fbb / this.totais.projeto.fbb.orcado
        this.$forceUpdate()
        // Verificação se Remanejamento ou Suplementação corretos
        this.$emit('validacaoCronograma', {'tag': 'remanejamentoIncorreto', 'ativo': false})
        this.$emit('validacaoCronograma', {'tag': 'suplementacaoIncorreta', 'ativo': false})
        if (this.layoutSolicitacao === 'REMANEJAMENTO') {
          let invalido = this.totais.projeto.fbb.alterado !== 0 || this.totais.projeto.parceiros.alterado !== 0 || this.totais.projeto.contrapartida.alterado !== 0
          this.$emit('validacaoCronograma', {'tag': 'remanejamentoIncorreto', 'ativo': invalido, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Remanejamentos devem ter sua movimentação zerada. Verifique os totais!'})
        }
        if (this.layoutSolicitacao === 'SUPLEMENTACAO') {
          let invalido = (this.totais.projeto.fbb.alterado < 0 || this.totais.projeto.parceiros.alterado < 0 || this.totais.projeto.contrapartida.alterado < 0 || this.totais.adiantavel.fbb.alterado < 0 || this.totais.adiantavel.parceiros.alterado < 0) || !(this.totais.projeto.fbb.alterado > 0 || this.totais.projeto.parceiros.alterado > 0 || this.totais.projeto.contrapartida.alterado > 0)
          this.$emit('validacaoCronograma', {'tag': 'suplementacaoIncorreta', 'ativo': invalido, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Suplementação deve ter total maior que zero e não deve conter itens negativos. Verifique o extrato e os totais!'})
        }
        this.$emit('acaoTotaisAtualizados', this.totais)
      },
      //
      buscaCronograma () {
        this.loading.cronograma = true
        axiosLaravel.post('processos/cronograma/projeto/', {'proposta': this.proposta.id, 'processo': 'PAGAMENTO', 'aglutinado': 'Completo', 'documento': 0}).then((response) => {
          let saldos = response.data
          if (_.isUndefined(this.propsAtividades)) {
            return 0
          }
          this.complementarDadosExtrato(saldos)
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      complementarDadosExtrato (saldos) {
        this.loading.cronograma = true
        this.propsAtividades.forEach((atividade) => {
          if (atividade.itens_orcamentos) {
            atividade.itens_orcamentos.forEach((item) => {
              item['valorOrcado'] = _.sumBy(item.orcamentos_mensalizados, function (iVO) { return iVO.valor })
              item['quantidadeOrcado'] = _.sumBy(item.orcamentos_mensalizados, function (iQO) { return iQO.quantidade })
              item['valorSaldo'] = saldos ? _.sumBy(saldos.itens, function (sVS) { return (item.id === sVS['Id_item']) ? sVS['Valor_saldo'] : 0 }) : item['valorSaldo']
              item['quantidadeSaldo'] = saldos ? _.sumBy(saldos.itens, function (sQS) { return (item.id === sQS['Id_item']) ? sQS['Qtde_saldo'] : 0 }) : item['quantidadeSaldo']
              item['contaFinanceiraDescricao'] = _.has(item, 'conta_financeira') && _.has(item.conta_financeira, 'descricao') ? item.conta_financeira.descricao : ''
              item['contaFinanceiraNumero'] = _.has(item, 'conta_financeira') && _.has(item.conta_financeira, 'numero_conta') ? item.conta_financeira.numero_conta : ''
              // Verifica se processoSolicitacao está definido
              if (this.processoSolicitacao && this.processoSolicitacao.hasOwnProperty('processos')) {
                // Procura o id do item no array do processo >> processoSolicitacao.processos[0].alteracao[0].id sendo que cada array deve ser percorrido para verificar
                // faz um foreach
                this.processoSolicitacao.processos.forEach((proc) => {
                  if (proc.hasOwnProperty('alteracao') && proc.alteracao.length > 0) {
                    proc.alteracao.forEach((alteracao) => {
                      // Verifica se o item tem observação e se a observação é um array
                      if (!alteracao.hasOwnProperty('observacao') || !Array.isArray(alteracao.observacao)) {
                        // Se não tiver, passa para o próximo item
                        return
                      }
                      if (alteracao.id === item.id) {
                        console.log('achou', item.id)
                        // Verifica se observacao[1] é undefined
                        if (typeof alteracao.observacao[1] === 'undefined' || alteracao.observacao[1] === undefined || !alteracao.observacao[1] || alteracao.observacao[1] === 'undefined') {
                          item['observacaoOriginal'] = item['observacao']
                          item['observacaoNova'] = ''
                        } else {
                          if (alteracao.observacao[1].includes('<br/>')) {
                            alteracao.observacao[1] = alteracao.observacao[1].split('<br/>')[1]
                          }
                          item['observacao'] = alteracao.observacao[0]
                          item['observacaoOriginal'] = alteracao.observacao[0]
                          item['observacaoNova'] = alteracao.observacao[1]
                          console.log('obs0', alteracao.observacao[0])
                          console.log('obs1', alteracao.observacao[1])
                        }
                      }
                    })
                  }
                })
              } else {
                item['observacaoOriginal'] = item['observacao']
                item['observacaoNova'] = ''
              }
              // item['observacaoOriginal'] = item['observacao']
              // Ajustes de diferenças entre propsAtividades e proc cronograma
              // _.unset(item, 'observacaoNova')
              let valorOrcado = saldos ? _.sumBy(saldos.itens, function (sVS) { return (item.id === sVS['Id_item']) ? sVS['Valor_orcado'] : 0 }) : item['valorOrcado']
              item['valorOrcado'] = (item['valorOrcado'] !== valorOrcado) ? valorOrcado : item['valorOrcado']
              let quantidadeOrcado = saldos ? _.sumBy(saldos.itens, function (sVS) { return (item.id === sVS['Id_item']) ? sVS['Qtde_orcado'] : 0 }) : item['quantidadeOrcado']
              item['quantidadeOrcado'] = (item['quantidadeOrcado'] !== quantidadeOrcado) ? quantidadeOrcado : item['quantidadeOrcado']
              item['percAtingimento'] = Math.ceil(((('' + item.economicidade) === '1' ? item['valorOrcado'] : item['valorOrcado'] - item['valorSaldo']) / item['valorOrcado']) * 100) / 100
              item['percAtingimento'] = (item['percAtingimento'] > 1 ? 1 : (item['percAtingimento'] < 0 ? 0 : item['percAtingimento'])) // Correção de percentual em caso de estou limites 0% e 100%
              if (this.ehItemNovo(item)) {
                this.numeracaoItemNovo++
              }
            })
            atividade['valorOrcado'] = _.sumBy(atividade.itens_orcamentos, function (aVO) { return aVO.valorOrcado })
            atividade['quantidadeOrcado'] = _.sumBy(atividade.itens_orcamentos, function (aQO) { return aQO.quantidadeOrcado })
            atividade['valorSaldo'] = _.sumBy(atividade.itens_orcamentos, function (aVS) { return aVS.valorSaldo })
            atividade['quantidadeSaldo'] = _.sumBy(atividade.itens_orcamentos, function (aQS) { return aQS.quantidadeSaldo })
            atividade['percAtingimento'] = Math.ceil(((('' + atividade.economicidade) === '1' ? atividade['valorOrcado'] : atividade['valorOrcado'] - atividade['valorSaldo']) / atividade['valorOrcado']) * 100) / 100
            atividade['percAtingimento'] = (atividade['percAtingimento'] > 1 ? 1 : (atividade['percAtingimento'] < 0 ? 0 : atividade['percAtingimento'])) // Correção de percentual em caso de estou limites 0% e 100%
          }
        })
        this.calcularTotais()
        this.ok()
        this.loading.cronograma = false
      },
      editar (item, itemIndex, atividade, atividadeIndex) {
        this.itemEditando['acao'] = 'editando'
        this.itemEditando['atividade'] = atividade
        this.itemEditando['atividadeIndex'] = atividadeIndex
        this.itemEditando['item'] = _.clone(item)
        this.itemEditando['itemIndex'] = itemIndex
        this.itemEditando.item['observacaoNova'] = ''
        if (this.ehItemNovo(item)) {
          this.itemEditando.item['valor_unitario'] = parseFloat(item.valor_unitario)
          this.itemEditando.item['quantidadeMinima'] = item.quantidadeOrcado
          this.itemEditando.item['valorAlteracao'] = parseFloat(item.quantidadeOrcado) * parseFloat(item.valor_unitario)
        } else {
          this.itemEditando.item['quantidadeMinima'] = item.quantidadeOrcado
          this.itemEditando.item['valor_unitario'] = parseFloat(item.valorOrcado) / parseFloat(item.quantidadeOrcado)
          this.itemEditando.item['valorAlteracao'] = item.valorAlteracao || 0
        }
        this.$forceUpdate()
      },
      ok () {
        if (!this.itemEditando.hasOwnProperty('item')) {
          return
        }
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.propsAtividades.forEach((atividade) => {
              if (atividade.itens_orcamentos) {
                atividade.itens_orcamentos.forEach((item) => {
                  if (item.id === this.itemEditando.item.id) {
                    if (this.ehItemNovo(this.itemEditando.item)) {
                      _.set(item, 'observacao', this.itemEditando.item.observacaoOriginal)
                      _.set(item, 'fk_itens', this.itemEditando.item.item.ds_code)
                      let quantidade = _.toNumber(this.itemEditando.item.quantidadeOrcado)
                      _.set(item, 'quantidade', quantidade)
                      _.set(item, 'quantidadeMinima', quantidade)
                      _.set(item, 'quantidadeSaldo', quantidade)
                      let unitario = _.toNumber(_.get(this.itemEditando, 'item.valor_unitario', 0))
                      _.set(item, 'valor_unitario', unitario)
                      let valor = quantidade * unitario
                      _.set(item, 'valorSaldo', valor)
                      _.set(item, 'valorOrcado', valor)
                      _.set(item, 'valorAlteracao', valor)
                      _.set(item, 'valor_total', valor)
                      _.set(item, 'substituicao', _.get(this.itemEditando, 'substituicao', false))
                      let mensalizacaoNova = []
                      if (('' + item.origem) === '2') {
                        mensalizacaoNova.push({'periodo': item.periodo_final, 'valor': item.valorOrcado})
                      } else {
                        if (item.fk_itens.substr(0, 1) === 'P') {
                          mensalizacaoNova.push({'periodo': item.periodo_inicial, 'valor': item.valorOrcado})
                        } else if (item.fk_itens.substr(0, 1) === 'S') {
                          for (let i = item.periodo_inicial; i < item.periodo_final; i++) {
                            mensalizacaoNova.push({'periodo': i, 'valor': item.valorOrcado / i})
                          }
                        }
                      }
                      _.set(item, 'orcamentos_mensalizados', mensalizacaoNova)
                    } else {
                      this.itemEditando.item['observacao'] = this.itemEditando.item.observacaoOriginal + (this.itemEditando.item.observacaoNova.length > 1 ? '<br/>' + this.itemEditando.item.observacaoNova : '')
                      // Guardar o que foi alterado
                      this.listaAlteracoes('quantidadeOrcado', item, this.itemEditando.item)
                      this.listaAlteracoes('valorOrcado', item, this.itemEditando.item)
                      this.listaAlteracoes('valor_unitario', item, this.itemEditando.item)
                      this.listaAlteracoes('adiantavel', item, this.itemEditando.item)
                      this.listaAlteracoes('unidade_medida', item, this.itemEditando.item)
                      this.listaAlteracoes('medida_outros', item, this.itemEditando.item)
                      this.listaAlteracoes('observacao', item, this.itemEditando.item)
                      this.listaAlteracoes('justificativa', item, this.itemEditando.item)
                      this.listaAlteracoes('valorAlteracao', item, this.itemEditando.item)
                      this.listaAlteracoes('substituicao', item, this.itemEditando.item)
                    }
                    _.assign(item, this.itemEditando.item)
                  }
                })
              }
            })
            this.calcularTotais()
            this.$emit('cronogramaAtividades', this.propsAtividades)
            this.$emit('alteracoesCronograma', this.alteracoes)
            this.$emit('acaoOk', this.componentKey++)
            this.itemEditando = {}
          }
        })
      },
      //
      cancelar (atividade) {
        if (atividade && _.includes(['inserindo', 'excluindo'], this.itemEditando.acao)) {
          _.remove(atividade.itens_orcamentos, ['id', this.itemEditando.item.id])
          this.$emit('acaoOk', this.componentKey++)
        }
        this.itemEditando = {}
        this.calcularTotais()
      },
      listaAlteracoes (alteracao, antes, depois) {
        let vm = this
        if (_.get(antes, [alteracao], null) !== depois[alteracao]) {
          let registro = _.find(this.alteracoes, function (a) {
            return vm.alteracoes.length > 0 && a.id === antes.id && a.alteracao === alteracao
          })
          if (_.isNil(registro)) {
            this.alteracoes.push({'id': antes.id, 'alteracao': alteracao, 'antes': (antes[alteracao] || null), 'depois': depois[alteracao]})
          } else {
            if (('' + registro['antes']) === ('' + depois[alteracao])) {
              _.remove(this.alteracoes, function (n) {
                return vm.alteracoes.length > 0 && n.id === antes.id && n.alteracao === alteracao
              })
            } else {
              registro['depois'] = depois[alteracao]
            }
          }
        }
      },
      ehNulo (valor, opcao) {
        return _.isNull(valor) || _.isNil(valor) || _.isUndefined(valor) ? opcao : valor
      },
      zeraAdiantamento () {
        if (('' + this.itemEditando.item.origem) === '2') {
          this.itemEditando.item.adiantavel = 0
        }
      },
      validaPeriodo () {
        if (_.toSafeInteger(this.itemEditando.item.periodo_final) < _.toSafeInteger(this.itemEditando.item.periodo_inicial) && this.itemEditando.item.periodo_final && this.itemEditando.item.periodo_inicial) {
          const error = {field: 'inicio', msg: 'Período inicial não pode ser maior que o fim'}
          this.$validator.errors.add(error)
          return
        } else {
          this.$validator.reset()
        }
      },
      buscaItensDespesas () {
        axiosLaravel.post('itens/contratacao', {'tipos': ['PRODUTO', 'SERVICO']}).then((response) => {
          this.items = response.data
        })
      },
      buscaContasFinanceiras (row) {
        console.log('BUSCA CONTA FINANCEIRA')
        let codigoItem = ''
        if (row.ds_code) {
          codigoItem = row.ds_code
        }
        if (row.item) {
          codigoItem = row.item.ds_code
        }
        let tipoItem = codigoItem.substring(0, 1)
        this.itemEditando.item['ds_type'] = tipoItem === 'P' ? 'PRODUTO' : (tipoItem === 'S' ? 'SERVICO' : 'ERRO')
        let projDuplicacao = this.projetoDuplicacao
        let fase = this.itemEditando.item.origem
        if (fase === 2 || fase === '2') {
          fase = 1
        }
        let obj = {}
        obj.item = codigoItem
        obj.duplicador = projDuplicacao
        obj.fase = fase
        console.log(obj)
        if (this.projetoDuplicacao) {
          axiosLaravel.post('busca_conta_financeira/', obj).then((response) => {
            this.contasFinanceiras = response.data
            console.log(this.contasFinanceiras)
            if (this.contasFinanceiras.length === 1) {
              this.itemEditando.item.conta_financeira = this.contasFinanceiras[0]
              this.blockSelect = true
            } else {
              this.blockSelect = false
            }
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        }
      },
      ehItemNovo (item) {
        return !_.has(item, 'id') || _.includes(_.get(item, 'id', ''), 'novo') || _.find(_.get(this.solicitacao, 'inclusao', []), ['id', item.id])
      },
      adicionaItem (atividade, atividadeIndex) {
        // Verifica se é uma nova atividade com o prefixo 'novo-'
        if (_.includes(('' + atividade.id), 'novo')) {
          // Se for, não adiciona novo item
          this.$snotify.error('Não é possível adicionar itens a uma atividade nova. É necessário processar a alteração antes de incluir novos itens.')
          return
        }
        let id = 'novo-' + this.numeracaoItemNovo++
        let itemNovo = {
          'id': id,
          'adiantavel': 0,
          'origem': 1,
          'economicidade': 0,
          'observacao': '',
          'fk_itens': 'S',
          'unidade_medida': null,
          'medida_outros': null,
          'quantidade': 0,
          'valor_unitario': 0,
          'valor_total': 0,
          'periodo_inicial': atividade.nr_periodo_inicial,
          'periodo_final': atividade.nr_periodo_final,
          'item': null,
          'valorOrcado': 0,
          'quantidadeOrcado': 0,
          'valorSaldo': 0,
          'quantidadeSaldo': 0,
          'contaFinanceiraDescricao': '',
          'contaFinanceiraNumero': 0,
          'observacaoOriginal': '',
          'percAtingimento': 0
        }
        atividade.itens_orcamentos.push(itemNovo)
        this.itemEditando['acao'] = 'inserindo'
        this.itemEditando['atividade'] = atividade
        this.itemEditando['atividadeIndex'] = atividadeIndex
        this.itemEditando['item'] = itemNovo
        this.itemEditando['itemIndex'] = atividade.itens_orcamentos.length - 1
        this.$forceUpdate()
      },
      irAtividades () {
        this.$nextTick(() => {
          if (_.has(this.$parent, 'mostrar')) this.$parent.mostrar.atividades = true
          setTimeout(() => {
            this.$emit('criacaoAtividade', _.uniqueId()) // mandando sempre um número novo para o watch em atividades ser disparado com a alteração do número
            this.$parent.$refs['atividades'].scrollIntoView()
          }, 500)
        })
      },
      desfazerAlteracao (itemEdicao) {
        this.propsAtividades.forEach((atividade) => {
          if (atividade.itens_orcamentos) {
            atividade.itens_orcamentos.forEach((item) => {
              if (item.id === itemEdicao.id) {
                _.set(item, 'observacao', itemEdicao.observacaoOriginal)
                _.unset(item, 'observacaoNova')
                _.unset(item, 'valorAlteracao')
                _.unset(item, 'justificativa')
                _.unset(item, 'substituicao')
              }
            })
          }
        })
        this.calcularTotais()
        this.$emit('cronogramaAtividades', this.propsAtividades)
        this.$emit('alteracoesCronograma', this.alteracoes)
        this.$emit('acaoOk', this.componentKey++)
        this.itemEditando = {}
      },
      consultarAbrirCotacao (fkCotacao) {
        // Busca cotação
        // Cria objeto
        // Abre cotação
        axiosLaravel.get('cotacao/getCotacao/' + fkCotacao).then((response) => {
          let cotacoes = response.data
          console.log(response.data)
          // cria objeto template
          let itemCotacao = []
          let itemCotacaoManual = []
          // let remocaoManual = []
          if (cotacoes.itemCotacao[0].anexos.length > 0) {
            itemCotacaoManual[0] = this.transformObjectToCamelCase(cotacoes.itemCotacao)
            itemCotacao[0] = []
          } else {
            itemCotacao[0] = this.transformObjectToCamelCase(cotacoes.itemCotacao)
            itemCotacaoManual[0] = []
          }
          console.log('itemCotacao - ', itemCotacao)
          let cotacao = {
            itemCotacao: itemCotacao,
            itemCotacaoManual: itemCotacaoManual,
            itemCotacaoValidado: {
              responsavel: cotacoes.cotacao[0].responsavel_validacao,
              validado: cotacoes.cotacao[0].validado,
              horaValidacao: moment(new Date(cotacoes.cotacao[0].data_validacao)).format('DD/MM/YYYY HH:mm:ss')
            },
            fk_cotacao: cotacoes.cotacao.fk_cotacao
          }
          console.log(cotacao, cotacoes)
          this.cotacaoForm = cotacao
          this.toggleCotacao(true)
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      toggleCotacao (valor = false) {
        // this.$refs.cotacaoContainer.scrollIntoView({ behavior: 'smooth' })
        this.abrirCotacao = valor
      },
      toCamelCase (str) {
        return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
      },
      transformObjectToCamelCase (array) {
        let newArray = array.map(object => {
          let objetoCamelCase = {}
          for (const key in object) {
            if (object.hasOwnProperty(key)) {
              const camelCaseKey = this.toCamelCase(key)
              objetoCamelCase[camelCaseKey] = object[key]
            }
          }
          return objetoCamelCase
        })
        console.log('NEW', newArray)
        return newArray
      }
    }
  }
</script>

<style>
  .multiselect, .multiselect__input, .multiselect__single {
    font-size: 14px !important;
  }

  .extratoff .editarItem {
    background: #fffcf2 !important;
  }

  .extratoff .solicitacoesItem {
    background: #cff0ff !important;
  }

  .extratoff .quadroEdicaoItem, .extratoff .quadroSolicitacoesItem, .cronogramaff .edicaoItem {
    border: 1px solid white;
    padding: 15px 20px 0px 0px;
    box-shadow: 0px 0px 20px 2px rgba(0,0,0,.4) !important;
    background-color: #f5f5f5;
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }

  .extratoff, .parcelasAdiantamento, .municipalizacao, .cronogramaff, body {
    width: 100%;
    /* Cada cor segue o padrão do Material Design: cores primárias e suas verões light e dark */
    --cor-padrao: black;
    --cor-fraca: silver;
    --cor-destaque: cornflowerblue;
    --cor-alerta: darkgoldenrod;
    --cor-atencao: #dd4b39;
    --cor-sucesso: forestgreen;
    --cor-borda: #dddddd;

    /* Versões Light */
    --cor-padrao-light: #4f5b62;
    --cor-fraca-light: #f3f3f3;
    --cor-destaque-light: #9ac5ff;
    --cor-alerta-light: #eeb545;
    --cor-atencao-light: #ff7d64;
    --cor-sucesso-light: #5bbc51;
    --cor-borda-light: #ffffff;

    /* Versões Dark */
    --cor-padrao-dark: #000000;
    --cor-fraca-dark: #909090;
    --cor-destaque-dark: #2668ba;
    --cor-alerta-dark: #835900;
    --cor-atencao-dark: #a40f11;
    --cor-sucesso-dark: #005c00;
    --cor-borda-dark: #ababab;

    /* Cores de semáforos */
    --cor-verde: forestgreen;
    --cor-azul: steelblue;
    --cor-vermelha: tomato;
    --cor-amarela: #dbc314;
    --cor-cinza: silver;
    --cor-branca: white;

    /* Cores de alterações em projeto */
    --cor-modificacao-projeto-resumo: #e5e49f;
    --cor-modificacao-projeto-inclusao: #c7fbcd;
    --cor-modificacao-projeto-exclusao: #fbc4b4;
    --cor-modificacao-projeto-alteracao: #e2f7ff;
  }

  .extratoff .centralizado, .parcelasAdiantamento .centralizado, .municipalizacao .centralizado, .cronogramaff .centralizado {
    text-align: center !important;
  }

  .extratoff .direita, .parcelasAdiantamento .direita, .municipalizacao .direita, .cronogramaff .direita {
    text-align: right !important;
  }

  .extratoff .esquerda, .parcelasAdiantamento .esquerda, .municipalizacao .esquerda, .cronogramaff .esquerda {
    text-align: left !important;
  }

  .extratoff .atividade, .parcelasAdiantamento .atividade, .municipalizacao .atividade, .cronogramaff .atividade {
    background: rgb(223, 228, 235) !important;
    font-weight: bold;
  }

  .extratoff .nome_atividade, .parcelasAdiantamento .nome_atividade {
    width: 60%;
  }

  .extratoff .celula, .parcelasAdiantamento .celula, .cronogramaff .celula {
    padding: 3px 10px !important;
  }
  .extratoff .b0, .parcelasAdiantamento .b0, .cronogramaff .b0 {
    border: 0px !important;
  }
  .extratoff .b1, .parcelasAdiantamento .b1, .cronogramaff .b1 {
    border-top: 1px solid var(--cor-borda) !important;
  }
  .extratoff .b2, .parcelasAdiantamento .b2, .cronogramaff .b2 {
    border-right: 1px solid var(--cor-borda) !important;
  }
  .extratoff .b3, .parcelasAdiantamento .b3, .cronogramaff .b3 {
    border-bottom: 1px solid var(--cor-borda) !important;
  }
  .extratoff .b4, .parcelasAdiantamento .b4, .cronogramaff .b4 {
    border-left: 1px solid var(--cor-borda) !important;
  }
  .extratoff .borda, .parcelasAdiantamento .borda, .cronogramaff .borda {
    border: 1px solid var(--cor-borda) !important;
  }

  .extratoff .cabecalho th, .parcelasAdiantamento .cabecalho th, .cronogramaff .cabecalho th {
    border: 0 !important;
    color: var(--cor-fraca);
    font-weight: normal !important;
    vertical-align: bottom !important;
    padding: 0 !important;
  }

  .extratoff .adiantavel, .parcelasAdiantamento .adiantavel, .cronogramaff .adiantavel {
    color: var(--cor-destaque);
    font-style: italic;
  }

  .extratoff .esmaecido, .parcelasAdiantamento .esmaecido, .cronogramaff .esmaecido  {
    float: left;
    width: 50%;
    color: var(--cor-fraca);
  }

  .extratoff .conta_financeira, .parcelasAdiantamento .conta_financeira, .cronogramaff .conta_financeira {
    float: right;
    width: 50%;
    color: var(--cor-fraca);
  }

  .extratoff .observacao, .parcelasAdiantamento .observacao, .cronogramaff .observacao {
    /*font-weight: bold;*/
    color: var(--cor-padrao);
    width: 100%;
    float: left;
  }

  .extratoff .item_despesa, .parcelasAdiantamento .item_despesa, .cronogramaff .item_despesa {
    font-weight: bold;
    color: var(--cor-padrao);
    width: 50%;
    float: left;
  }

  .extratoff .totais, .parcelasAdiantamento .totais, .municipalizacao .totais, .cronogramaff .totais {
    width: 100%;
    border: 1px solid var(--cor-borda);
  }

  .extratoff .totais .valor, .parcelasAdiantamento .totais .valor, .municipalizacao .totais .valor, .cronogramaff .totais .valor {
    color: var(--cor-padrao);
    font-weight: bold;
  }

  .extratoff .totais.solicitacao_total_ok td:last-child {
    background: var(--cor-destaque-light);
  }
  .extratoff .totais.solicitacao_total_atencao td:last-child {
    background: #ffc7c7;
  }

  .extratoff .totais .saldo, .parcelasAdiantamento .totais .saldo, .municipalizacao .totais .saldo {
    color: var(--cor-destaque);
  }

  .extratoff .alteracao, .parcelasAdiantamento .alteracao, .municipalizacao .alteracao {
    background: palegreen;
  }

  .extratoff .atencao, .parcelasAdiantamento .atencao, .municipalizacao .atencao {
    color: white !important;
    background: var(--cor-atencao) !important;
    padding: 0.1em 0.4em;
    border-radius: 0.25em;
  }

  .extratoff .alerta, .parcelasAdiantamento .alerta, .municipalizacao .alerta {
    color: var(--cor-atencao) !important;
  }

  .extratoff .economicidade {
    color: var(--cor-destaque) !important;
  }

  .extratoff .id_item {
    color: var(--cor-destaque) !important;
    font-style: italic;
    margin-right: 10px;
  }

  .extratoff label.checkbox-inline {
    padding-top: 0 !important;
  }

  .extratoff .valor_alterado {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .extratoff .valor_alterado i {
    padding-right: 10px;
  }
  .extratoff .sinalValorAlterado button:hover {
    border: 1px solid var(--cor-fraca);
    color: var(--cor-padrao-light) !important;
    background: var(--cor-fraca-light) !important;
  }
  .extratoff .sinalValorAlterado button {
    color: silver !important;
    background: transparent !important;
  }
  .extratoff .acrescimo_valor {
    color: var(--cor-sucesso);
  }
  .extratoff .diminuicao_valor {
    color: var(--cor-vermelha);
  }

  .parcelasAdiantamento .atingido100 {
    color: var(--cor-azul);
    font-weight: bold;
  }
  .parcelasAdiantamento .atingido80 {
    color: var(--cor-verde);
  }
  .parcelasAdiantamento .nao_atingido {
    color: var(--cor-vermelha);
  }

  .restricaoEditandoInformacao {
    background: var(--cor-alerta);
    color: var(--cor-branca);
    padding: 0 5px;
  }

  /* .modal-container {
    width: 100%;
    border: 1px solid red;
    height: 800px;
  } */
</style>
