<template>

  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="titulo"/>

    <div style="">
      <section class="content-header ">

        <h1 v-if="!editavel || editando === ''" style="display: flex;" :title="$route.params.numero + ' - ' + proposta.ds_nome" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
          <span style="max-width: 60%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Projeto {{$route.params.numero}} - {{proposta.ds_nome}}</span>
          <span v-if="usuarioLogado.userType === 'FUNDACAO' && !loading.tela">(<span class="text-bold">{{ _.get(proposta, 'projetoSapiens.0.sitprj', '') }}</span>)</span>
        </h1>

        <h1 v-if="editavel && editando !== ''">Alterando {{editando.replace('_', ' ')}}
          <span v-show="!loading.tela" v-if="editando !== 'periodo_projeto'">
            <g-button-moema color="success" @click.native="permiteConcluir(editando)" type="button"><i class="fa fa-check" aria-hidden="true"></i> Concluir</g-button-moema>
            <g-button-moema color="warning" size="button--size-ss" @click.native="cancelar(editando)"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</g-button-moema>
          </span>
        </h1>

        <i v-show="!loading.tela" class="fa fa-caret-down opcao" aria-hidden="true" v-if="!_.find(mostrar, function (k) { return k === true})" @click="Object.keys(mostrar).forEach(m => { mostrar[m] = true }); $refs['proposta'].scrollIntoView()"
         :title="'<h5>Abre todas as seções</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
        </i>

        <i v-show="!loading.tela" class="fa fa-caret-up opcao" aria-hidden="true" v-if="_.find(mostrar, function (k) { return k === true })" @click="Object.keys(mostrar).forEach(m => { mostrar[m] = false }); $refs['proposta'].scrollIntoView()"
           :title="'<h5>Fecha todas as seções</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
        </i>

        <i v-show="!loading.tela" class="fa fa-angle-double-up opcao" aria-hidden="true" @click="$refs['topo'].scrollIntoView()"
           :title="'<h5>Vai para o topo da página</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
        </i>

        <i v-if="this.$root.isFundacao(this.usuarioLogado)" v-show="!loading.tela" class="fa fa-print opcao" aria-hidden="true" @click="emitir(248)"
           :title="'<h5>248 - Monitoramento Administrativo (PDF)</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
          <span>Monitoramento Administrativo</span>
        </i>

        <i v-show="!loading.tela" class="fa fa-print opcao" aria-hidden="true" @click="emitir(222)"
           :title="'<h5>222 - Extrato de Projeto (PDF)</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
          <span>Extrato de Projeto</span>
        </i>

        <i v-show="!loading.tela" class="fa fa-print opcao" aria-hidden="true" @click="emitir(219)"
           :title="'<h5>219 - Adiantamentos (PDF)</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
          <span>Adiantamentos</span>
        </i>

        <i v-show="!loading.tela" class="fa fa-external-link opcao" aria-hidden="true" @click="$router.push({name: 'visualiza-relatorio-execucao', params: { id: projeto.proposta.projeto.id }})"
           :title="'<h5>Abrirá a tela de Relatórios de Execução desse projeto</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
          <span>Relatórios de Execução</span>
        </i>

        <i v-show="!loading.tela" class="fa fa-external-link opcao" aria-hidden="true" @click="$router.push({name: 'solicitacao-alteracoes-projeto', params: {numero: proposta.ds_codigo_projeto_erp}})"
           :title="'<h5>Vai para tela de Alterações deste Projeto</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
          <span>Alterações de Projeto</span>
        </i>

        <i v-show="loading.tela" class="fa fa-refresh fa-spin" style="font-size: 30px"></i>

        <b-breadcrumb :items="[{text: 'Inicial', href: '/'}, {text: 'Projeto', href: '#'}, {text: $route.params.numero, active: true}]"/>
      </section>

      <!-- main content -->
      <section class="content projetoAprovado" ref="topo">
        <br>
        
        <!-- Informação Chamados Abertos do projeto -->
        <span v-if="!_.isEmpty(chamado) && usuarioLogado.userType === 'FUNDACAO'">
              <span class="text-red">* Atenção: O projeto possui {{chamado.length > 1 ? 'chamados abertos' : 'chamado aberto'}}: </span>
              <span v-for="(c, index) in chamado">
              <span class="text-bold" :title="'<h5 class=\'text-left\'>Chamado SGP <span class=\'realce\'>' + c.id + '</span><br/>' + ((c.descricao).substr(0, 200) + (c.descricao.length > 200 ? '...' : '')) + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', placement:'top', interactive:true}">
              <router-link target="_blank" :to="{name: 'cadastro-chamado-edita', params: { id: c.id}}">{{c.id}}</router-link>
              </span>
                              {{index < chamado.length - 1 ? ', ' : ''}}
              </span>
            </span>

        <!-- Timeline do projeto -->
        <div v-if="this.$root.isFundacao(this.usuarioLogado)">
          <div class="box box-widget">
            <div class="box-header">
              <h3 class="box-title">Timeline</h3>
            </div>
            <div class="box-body">
              <visualiza-timeline :numeroProjeto="$route.params.numero" :atualizar="atualizar_timeline" @idAcompanhamento="filtro_acompanhamento = $event" @idAlteracoes="filtro_alteracoes = $event"></visualiza-timeline>
            </div>
          </div>
        </div>

        <!--Ocorrências de Projeto-->
        <div v-if="$root.isFundacao(this.usuarioLogado)" class="box box-widget" ref="ocorrencias">
          <div class="box-header">
            <h3 class="box-title">
              <span class="grupoMostrarOcultar" @click="mostrar.ocorrencias = !(mostrar.ocorrencias)"><i :class="'fa fa-caret-' + (mostrar.ocorrencias ? 'up' : 'down')" aria-hidden="true"></i> Ocorrências do Projeto </span>
            </h3>
          </div>
          <div class="box-body" v-if="mostrar.ocorrencias">
            <edita-ocorrencias
              :numeroProjeto="$route.params.numero"
              :itensLayout="['botaoNovo', 'botaoExportarExcel', 'filtroNivelOcorrencia', 'filtroCodigoOcorrencia', 'filtroSituacaoOcorrencia', 'totalizador', 'colunaCodigo', 'colunaObservacao', 'colunaUsuarioCriador', 'colunaSituacao', 'colunaDataCriacao', 'colunaAcoes']"
              @acaoOcorrencia="ocorrenciaSelecionada = $event"
              @acaoProcessamento="loading = true"
              @acaoAguardando="loading = false"
              @acaoCancelar="ocorrenciaSelecionada.id = null"
              @acaoOk="loading = false">
            </edita-ocorrencias>
          </div>
        </div>

        <!--Alterações no Projeto-->
        <div v-if="this.$root.isFundacao(this.usuarioLogado)" ref="alteracoes">
          <div class="box box-widget">
            <div class="box-header">
              <h3 class="box-title">
                <span class="grupoMostrarOcultar" @click="mostrar.alteracoes = !mostrar.alteracoes"><i :class="'fa fa-caret-' + (mostrar.alteracoes ? 'up' : 'down')" aria-hidden="true"></i> Alterações no Projeto</span>
              </h3>
            </div>

            <div class="box-body" v-if="mostrar.alteracoes">
              <alteracoesProjetos :ParmProjetos="projeto" :ParmAlteracao="atProp" :filtro="filtro_alteracoes" @atualizarTimeline="atualizar_timeline = $event"></alteracoesProjetos>
            </div>
          </div>
        </div>

        <!--Opções de alteração do Projeto-->
        <div v-if="this.$root.isFundacao(this.usuarioLogado)" ref="opcoesProjeto">
          <div class="box box-widget">
            <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

            <div class="box-header">
              <h3 class="box-title">
                <span class="grupoMostrarOcultar" @click="toggleOpcoesProjeto()"><i :class="'fa fa-caret-' + (mostrar.opcoesProjeto ? 'up' : 'down')" aria-hidden="true"></i> Opções das alterações do projeto</span>
              </h3>
            </div>

            <div class="box-body" v-if="mostrar.opcoesProjeto">
              <div class="col-md-12">
                <label class="control-label col-md-2">Passíveis de solicitação:</label>
                <div class="col-md-11">

                  <div class="checkbox-inline"><label class="checkbox-inline new-control new-control-checkbox"><input type="checkbox" v-model="proposta.opcoes.alteracoesPermitidas" value="periodoProjeto" @change="atualizaOpcoesAlteracoes()"> Prorrogação de Prazo<div class="new-control-indicator"></div></label></div>
                  <div class="checkbox-inline"><label class="checkbox-inline new-control new-control-checkbox"><input type="checkbox" v-model="proposta.opcoes.alteracoesPermitidas" value="metas" @change="atualizaOpcoesAlteracoes()"> Metas<div class="new-control-indicator"></div></label></div>
                  <div class="checkbox-inline"><label class="checkbox-inline new-control new-control-checkbox"><input type="checkbox" v-model="proposta.opcoes.alteracoesPermitidas" value="atividades" @change="atualizaOpcoesAlteracoes()"> Atividades<div class="new-control-indicator"></div></label></div>
                  <div class="checkbox-inline"><label class="checkbox-inline new-control new-control-checkbox"><input type="checkbox" v-model="proposta.opcoes.alteracoesPermitidas" value="remanejamento" @change="atualizaOpcoesAlteracoes()"> Remanejamento<div class="new-control-indicator"></div></label></div>
                  <div class="checkbox-inline"><label class="checkbox-inline new-control new-control-checkbox"><input type="checkbox" v-model="proposta.opcoes.alteracoesPermitidas" value="suplementacao" @change="atualizaOpcoesAlteracoes()"> Suplementação<div class="new-control-indicator"></div></label></div>
                  <div class="checkbox-inline"><label class="checkbox-inline new-control new-control-checkbox"><input type="checkbox" v-model="proposta.opcoes.alteracoesPermitidas" value="parcelasAdiantamento" :disabled="proposta.adiantamentos.length === 0"> Parcelas de Adiantamento<div class="new-control-indicator"></div></label></div>
                  <div class="checkbox-inline"><label class="checkbox-inline new-control new-control-checkbox"><input type="checkbox" v-model="proposta.opcoes.alteracoesPermitidas" value="municipios" @change="atualizaOpcoesAlteracoes()"> Municípios atendidos<div class="new-control-indicator"></div></label></div>

                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Consulta de Alterações do Projeto -->
        <!--<div ref="consultaAlteracoesProjeto">-->
          <!--<div class="box box-widget">-->
            <!--<div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>-->

            <!--<div class="box-header">-->
              <!--<h3 class="box-title" style="width: 100%;">-->
                <!--<span>-->
                  <!--<span class="grupoMostrarOcultar" @click="mostrar.consultaAlteracoesProjeto = !mostrar.consultaAlteracoesProjeto"><i :class="'fa fa-caret-' + (mostrar.consultaAlteracoesProjeto ? 'up' : 'down')" aria-hidden="true"></i> Consulta Alterações do Projeto</span>-->
                  <!--<span class="text-muted contador_processos" v-show="!loading.alteracoesProjeto">{{(_.countBy(processosAlteracao, ['mostrar', true]))['true'] < processosAlteracao.length ? ('Mostrando ' + (_.countBy(processosAlteracao, ['mostrar', true]))['true'] + ' de ') : '' }} {{ processosAlteracao.length }} {{ processosAlteracao.length > 1 ? 'processos' : 'processo' }} </span>-->
                  <!--<span v-if="(_.flatten(_.values(_.omit(_.get(filtroTabela, 'alteracoesProjeto'), 'data')))).length > 0 || !_.isEqual(filtroTabela.alteracoesProjeto.data, [1,18])" @click="_.set(filtroTabela, 'alteracoesProjeto', {id: [], solicitacao: [], situacao: [], etapa: [], data: [1, proposta.nr_periodos]})" class="limpar_todos_filtros_processos" v-show="!loading.alteracoesProjeto">-->
                    <!--<span class="fa fa-stack"><i class="fa fa-filter fa-stack-1x"></i><i class="fa fa-times fa-stack-1x"></i></span> Limpar todos os filtros-->
                  <!--</span>-->
                <!--</span>-->
              <!--</h3>-->
            <!--</div>-->

            <!--<div class="box-body" v-if="mostrar.consultaAlteracoesProjeto">-->
              <!--<div class="col-md-12" v-if="loading.alteracoesProjeto"><span class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando tabela ...</span></div>-->
              <!--<div class="col-md-12" v-else>-->
                <!--<table class="table table-condensed table-bordered">-->
                  <!--<thead class="">-->
                  <!--<tr>-->
                    <!--<th class="centralizado">-->
                      <!--ID-->
                      <!--<div class="btn-group dropdown botao_filtro">-->
                        <!--<div class="btn-group pull-right">-->
                          <!--<button data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i :class="'fa ' + (filtroTabela.alteracoesProjeto.id.length > 0 ? 'fa-filter text-blue' : 'fa-caret-down')"></i></button>-->
                          <!--<ul class="dropdown-menu">-->
                            <!--<span @click="_.set(filtroTabela, 'alteracoesProjeto.id', [])" class="limpar_filtro">-->
                              <!--<span class="fa fa-stack"><i class="fa fa-filter fa-stack-1x"></i><i class="fa fa-times fa-stack-1x"></i></span> Limpar Filtro "ID"-->
                            <!--</span>-->
                            <!--<li v-for="id in _.orderBy(_.uniq(_.map(_.filter(processosAlteracao, ['mostrar', true]), 'id')), null, ['asc'])">-->
                              <!--<input type="checkbox" v-model="filtroTabela.alteracoesProjeto.id" :value="id"/> <span @click="filtroTabela.alteracoesProjeto.id = _.xor(filtroTabela.alteracoesProjeto.id, [id])">{{ id }}</span>-->
                            <!--</li>-->
                          <!--</ul>-->
                        <!--</div>-->
                      <!--</div>-->
                    <!--</th>-->

                    <!--<th>-->
                      <!--Solicitação-->
                      <!--<div class="btn-group dropdown botao_filtro">-->
                        <!--<div class="btn-group pull-right">-->
                          <!--<button data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i :class="'fa ' + (filtroTabela.alteracoesProjeto.solicitacao.length > 0 ? 'fa-filter text-blue' : 'fa-caret-down')"></i></button>-->
                          <!--<ul class="dropdown-menu">-->
                            <!--<span @click="_.set(filtroTabela, 'alteracoesProjeto.solicitacao', [])" class="limpar_filtro">-->
                              <!--<span class="fa fa-stack"><i class="fa fa-filter fa-stack-1x"></i><i class="fa fa-times fa-stack-1x"></i></span> Limpar Filtro "Solicitação"-->
                            <!--</span>-->
                            <!--<li v-for="solicitacao in _.orderBy(_.uniq(_.map(_.flatten(_.map(_.filter(processosAlteracao, ['mostrar', true]), 'requisicao.processos')), 'nome')), null, ['asc'])">-->
                              <!--<input type="checkbox" v-model="filtroTabela.alteracoesProjeto.solicitacao" :value="solicitacao"/> <span @click="filtroTabela.alteracoesProjeto.solicitacao = _.xor(filtroTabela.alteracoesProjeto.solicitacao, [solicitacao])">{{descricoesDiversas[solicitacao]}}</span>-->
                            <!--</li>-->
                          <!--</ul>-->
                        <!--</div>-->
                      <!--</div>-->
                    <!--</th>-->

                    <!--<th class="centralizado">-->
                      <!--Data-->
                      <!--<div class="btn-group dropdown botao_filtro">-->
                        <!--<div class="btn-group pull-right">-->
                          <!--<button data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i :class="'fa ' + (!_.isEqual(filtroTabela.alteracoesProjeto.data, [1, proposta.nr_periodos]) ? 'fa-filter text-blue' : 'fa-caret-down')"></i></button>-->
                          <!--<ul class="dropdown-menu" style="width: 300px;">-->
                            <!--<span @click="_.set(filtroTabela, 'alteracoesProjeto.data', [1, proposta.nr_periodos])" class="limpar_filtro">-->
                              <!--<span class="fa fa-stack"><i class="fa fa-filter fa-stack-1x"></i><i class="fa fa-times fa-stack-1x"></i></span> Limpar Filtro "Data"-->
                            <!--</span>-->
                            <!--<vue-slider-->
                              <!--v-model="filtroTabela.alteracoesProjeto.data"-->
                              <!--:lazy="true"-->
                              <!--:process="true"-->
                              <!--:adsorb="true"-->
                              <!--:enable-cross="false"-->
                              <!--:tooltip="'always'"-->
                              <!--:tooltip-placement="['bottom']"-->
                              <!--:tooltip-formatter="periodo => periodoParaMesAno(periodo, proposta.dt_assinatura_convenio, 'MMMM/YYYY')"-->
                              <!--:min="1"-->
                              <!--:max="proposta.nr_periodos">-->
                            <!--</vue-slider>-->
                          <!--</ul>-->
                        <!--</div>-->
                      <!--</div>-->
                    <!--</th>-->

                    <!--<th class="centralizado">-->
                      <!--Etapa-->
                      <!--<div class="btn-group dropdown botao_filtro">-->
                        <!--<div class="btn-group pull-right">-->
                          <!--<button data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i :class="'fa ' + (filtroTabela.alteracoesProjeto.etapa.length > 0 ? 'fa-filter text-blue' : 'fa-caret-down')"></i></button>-->
                          <!--<ul class="dropdown-menu">-->
                            <!--<span @click="_.set(filtroTabela, 'alteracoesProjeto.etapa', [])" class="limpar_filtro">-->
                              <!--<span class="fa fa-stack"><i class="fa fa-filter fa-stack-1x"></i><i class="fa fa-times fa-stack-1x"></i></span> Limpar Filtro "Etapa"-->
                            <!--</span>-->
                            <!--<li v-for="etapa in _.orderBy(_.uniq(_.map(_.filter(processosAlteracao, ['mostrar', true]), 'etapa')), null, ['asc'])">-->
                              <!--<input type="checkbox" v-model="filtroTabela.alteracoesProjeto.etapa" :value="etapa"/> <span @click="filtroTabela.alteracoesProjeto.etapa = _.xor(filtroTabela.alteracoesProjeto.etapa, [etapa])">{{descricoesDiversas[etapa]}}</span>-->
                            <!--</li>-->
                          <!--</ul>-->
                        <!--</div>-->
                      <!--</div>-->
                    <!--</th>-->

                    <!--<th class="centralizado">-->
                      <!--Situação-->
                      <!--<div class="btn-group dropdown botao_filtro">-->
                        <!--<div class="btn-group pull-right">-->
                          <!--<button data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i :class="'fa ' + (filtroTabela.alteracoesProjeto.situacao.length > 0 ? 'fa-filter text-blue' : 'fa-caret-down')"></i></button>-->
                          <!--<ul class="dropdown-menu">-->
                            <!--<span @click="_.set(filtroTabela, 'alteracoesProjeto.situacao', [])" class="limpar_filtro">-->
                              <!--<span class="fa fa-stack"><i class="fa fa-filter fa-stack-1x"></i><i class="fa fa-times fa-stack-1x"></i></span> Limpar Filtro "Situação"-->
                            <!--</span>-->
                            <!--<li v-for="situacao in _.orderBy(_.uniq(_.map(_.filter(processosAlteracao, ['mostrar', true]), 'situacao')), null, ['asc'])">-->
                              <!--<input type="checkbox" v-model="filtroTabela.alteracoesProjeto.situacao" :value="situacao"/> <span @click="filtroTabela.alteracoesProjeto.situacao = _.xor(filtroTabela.alteracoesProjeto.situacao, [situacao])">{{descricoesDiversas[situacao]}}</span>-->
                            <!--</li>-->
                          <!--</ul>-->
                        <!--</div>-->
                      <!--</div>-->
                    <!--</th>-->
                  <!--</tr>-->
                  <!--</thead>-->
                  <!--<tbody>-->
                  <!--<tr v-for="processoAlteracao in processosAlteracao" v-if="_.get(processoAlteracao, 'mostrar', true)">-->
                    <!--<td class="col-md-1 centralizado">-->
                      <!--<span class="grupoMostrarOcultar" :title="'<h5>Abre este processo em nova janela</h5>'" v-tippy="{inertia: true, arrow: true, placement: 'top', animation: 'perspective', distance: '3', size: 'large'}"-->
                            <!--@click="abrirLink('/solicitacao/alteracoesprojeto/' + processoAlteracao.id, true)">{{processoAlteracao.id}} <i class="fa fa-external-link"></i>-->
                      <!--</span>-->
                    <!--</td>-->
                    <!--<td class="col-md-5"><span v-if="_.has(processoAlteracao, 'solicitacao')">{{ processoAlteracao.solicitacao }}</span></td>-->
                    <!--<td class="col-md-2 centralizado">{{ processoAlteracao.inicio | moment("L") }}</td>-->
                    <!--<td class="col-md-2 centralizado">{{ descricoesDiversas[processoAlteracao.etapa] }}</td>-->
                    <!--<td class="col-md-2 centralizado">{{ descricoesDiversas[processoAlteracao.situacao] }}</td>-->
                  <!--</tr>-->
                  <!--</tbody>-->
                <!--</table>-->

              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->

        <div ref="proposta">

          <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

          <!--<div v-if="!loading.tela">-->
          <div>

            <!--<fieldset>-->

              <div class="form-horizontal">

<!-- Projeto -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <div v-if="false"><!-- Foi pedido para não mostrar pois já está no cabeçalho da seção -->
                   Dados do Projeto

                  <div class="form-group">

                    <div v-if="mostrarRef('projeto_numero')">
                      <div>
                        <div class="col-md-2">
                          <label class="control-label">Nº do projeto </label>
                          <div name="proposta.ds_codigo_projeto_erp">
                            <input :disabled="true" v-model="proposta.ds_codigo_projeto_erp" name="idProjectErp" class="form-control" type="number" maxlength="10">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="mostrarRef('projeto_nome')">
                      <div class="col-md-10">
                        <label class="control-label">Nome do projeto </label>
                        <div name="proposal.name">
                          <input v-model="proposta.ds_nome" name="nome" data-vv-as="Nome da Proposta" class="form-control col" type="text" :disabled="true">
                        </div>
                      </div>
                    </div>

                  </div>
                </div>


                <!--Dados da entidade ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <div v-if="_.get(usuarioLogado, 'entidade.id', 0) !== 1439" class="box box-widget"><!-- Usuários ligados a "entidade" FBB (1439) não tem acesso a esta opção (chamado 68455) -->
                  <div class="box-header">
                    <h3 class="box-title">
                      <span class="grupoMostrarOcultar" @click="mostrar.entidade = !mostrar.entidade"><i :class="'fa fa-caret-' + (mostrar.entidade ? 'up' : 'down')" aria-hidden="true"></i> Dados da Entidade</span>
                    </h3>
                  </div>

                  <div class="box-body" v-if="mostrar.entidade">

                    <!--CNPJ da entidade-->
                    <div class="col-md-3">
                      <label class="control-label">CNPJ</label>
                      <div>
                        <div class="form-control" disabled="disabled">{{proposta.entidade.ds_cnpj | cnpj}}</div>
                      </div>
                    </div>

                    <!--Razão social da entidade-->
                    <div class="col-md-9">
                      <label class="control-label">Nome da entidade</label>
                      <div>
                        <div class="form-control" disabled="disabled">
                          <router-link :title="'<h5>Ir para o Cadastro dessa Entidade</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }" :to="{name: 'cadastro-entidade-visualiza', params: { id: proposta.entidade.id }}" target="_blank"> {{proposta.entidade.ds_nome}} &nbsp<i class="fa fa-external-link"></i></router-link>
                        </div>
                      </div>
                    </div>

                    <!--Endereço da entidade-->
                    <div class="col-md-12">
                      <label class="control-label">Endereço</label>
                      <div>
                        <div class="form-control" disabled="disabled" v-if="proposta.entidade.endereco">{{proposta.entidade.endereco[0].ds_rua}}, {{proposta.entidade.endereco[0].ds_numero}} -
                          {{proposta.entidade.endereco[0].ds_bairro}}, {{proposta.entidade.endereco[0].ds_cidade}} - {{proposta.entidade.endereco[0].ds_estado}}</div>
                        <div v-else>Sem endereço! Verificar o cadastro da entidade</div>
                      </div>
                    </div>

                    <!--E-mail da entidade-->
                    <div class="col-md-4">
                      <label class="control-label">E-mail</label>
                      <div>
                        <div class="form-control" disabled="disabled">{{proposta.entidade.ds_email}}</div>
                      </div>
                    </div>

                    <!--Telefone da entidade-->
                    <div class="col-md-3">
                      <label class="control-label">Telefone</label>
                      <div>
                        <div class="form-control" disabled="disabled">{{telefone}}</div>
                      </div>
                    </div>

                    <!-- Lista de Dirigentes -->
                    <div class="col-md-12">
                      <label class="control-label">Representante Legal da Entidade (que assina pela entidade e tem mandato vigente)</label>
                      <div v-for="dirigente in proposta.entidade.dirigentes">
                        <table class="table table-condensed table-bordered listaDirigentes">
                          <tbody>
                          <tr>
                            <td class="cabecalho">Nome</td>
                            <td class="ressaltar w30">{{dirigente.ds_nome}}</td>
                            <td class="cabecalho">Cargo</td>
                            <td v-if="dirigente.cargo.ds_descricao" class="ressaltar">{{dirigente.cargo.ds_descricao}}</td>
                            <td class="cabecalho">CPF</td>
                            <td class="ressaltar">{{dirigente.ds_cpf | cpf}}</td>
                            <td class="cabecalho">Final do Mandato</td>
                            <td class="ressaltar">{{dirigente.dt_fim_mandato | moment("L")}}</td>
                          </tr>
                          <tr>
                            <td class="cabecalho">RG</td>
                            <td class="ressaltar">{{dirigente.ds_rg}} - {{dirigente.ds_orgao_emissor}}/{{dirigente.ds_uf}}</td>
                            <td class="cabecalho">Estado Civil</td>
                            <td class="ressaltar">{{dirigente.ds_estado_civil}}</td>
                            <td class="cabecalho">Profissão</td>
                            <td class="ressaltar">{{dirigente.ds_profissao}}</td>
                            <td class="cabecalho">Telefone</td>
                            <td class="ressaltar">{{dirigente.contato.ds_telefone | telefone}}</td>
                          </tr>
                          <tr>
                            <td class="cabecalho">Endereço</td>
                            <td class="ressaltar">{{dirigente.endereco.ds_rua}}, {{dirigente.endereco.ds_numero}}, {{dirigente.endereco.ds_bairro}}, {{dirigente.endereco.ds_complemento}}</td>
                            <td class="cabecalho">CEP</td>
                            <td class="ressaltar">{{dirigente.endereco.ds_cep | cep}}</td>
                            <td class="cabecalho">Cidade/UF</td>
                            <td class="ressaltar">{{dirigente.endereco.ds_cidade}} / {{dirigente.endereco.ds_uf}}</td>
                            <td class="cabecalho">E-mail</td>
                            <td class="ressaltar">{{dirigente.contato.ds_email}}</td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                </div>


                <!-- Período de execução do projeto -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <div v-if="mostrarRef('projeto_periodo_execucao')">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">
                        <span v-if="editando !== 'periodo_projeto'" class="grupoMostrarOcultar" @click="mostrar.periodo = !mostrar.periodo"><i :class="'fa fa-caret-' + (mostrar.periodo ? 'up' : 'down')" aria-hidden="true"></i> Período de execução do projeto</span>
                        <span v-else><i class="fa fa-pencil" aria-hidden="true"></i> Período de execução do projeto</span>
                      </h3>
                    </div>

                    <div class="box-body" v-if="mostrar.periodo">

                      <div class="col-md-12">
                        <!--Data inicial-->
                        <!-- 66888/68639 - Alteracao de periodo de execucao do projeto -->
                        <div v-if="mostrarRef('projeto_data_inicial')" class="col-md-3">
                          <label class="control-label">Data inicial</label>
                          <i class="fa fa-question-circle" aria-hidden="true"
                                      :title="'<h5>(!)Data de Assinatura do Convênio <br/></h5>'"
                                  v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"
                                  v-if="editando === 'periodo_projeto' && usuarioLogado.userType === 'FUNDACAO'"
                                  ></i>
                          <div>
                            <!--Sup 60026 de proposta.dt_data_inicial para proposta.dt_assinatura_convenio -->
                            <input v-model="proposta.dt_assinatura_convenio" data-vv-as="Data Inicial do Projeto" lang="pt-br" name="periodo" class="form-control" type="date"
                                   v-validate="'required|min_value:' + projetoPeriodos + '|max_value:' + proposta.periodo_vigencia" :disabled="(editando !== 'periodo_projeto' && usuarioLogado.userType === 'FUNDACAO' || !acessoGerSolucoes)"
                                   v-on:change="dataFinalVigencia()"
                                   >
                          </div>
                        </div>

                        <!--Número de meses do projeto-->
                        <div v-if="mostrarRef('projeto_periodo_execucao')" class="required-field col-md-3 required"
                             :class="{ 'has-error' : errors.first('periodo')}">
                          <label class="control-label">Número de meses de Execução do Projeto</label>
                          <div>
                            <input v-model="proposta.nr_periodos" data-vv-as="Número de Meses do Projeto" lang="pt-br" name="periodo" class="form-control" type="number" min="1"
                                   v-validate="'required|min_value:' + projetoPeriodos + '|max_value:' + proposta.periodo_vigencia" :disabled="editando !== 'periodo_projeto'">
                          </div>
                          <span v-if="errors.first('periodo')" class="label label-danger"> {{ errors.first('periodo') }}</span>
                        </div>

                        <!--Data final de execução-->
                        <div v-if="mostrarRef('projeto_periodos') && mostrarRef('projeto_data_inicial')" class="col-md-3">
                          <label class="control-label">Data final de execução</label>
                          <div>
                            <!-- 68144 - Nota Técnica 2023/00114 -->
                            <!-- 70650 - Alteracao de periodo de execucao do projeto -->
                            <div class="form-control" disabled="disabled">{{dataFinal}}</div>
                          </div>
                        </div>
                      </div>

                      <div v-if="usuarioLogado.userType === 'FUNDACAO'" class="col-md-12">
                        <div class="col-md-3"></div>

                        <!--Número de meses da vigência-->
                        <div v-if="mostrarRef('projeto_periodo_execucao')" class="col-md-3">
                          <label class="control-label">Número de meses de Vigência</label>
                          <div>
                            <input v-model="proposta.periodo_vigencia" v-on:change="dataFinalVigencia()" v-on:keyup="dataFinalVigencia()" data-vv-as="Período Vigência" lang="pt-br" name="periodoVigencia"
                                   class="form-control" type="number" max="72" :min="proposta.nr_periodos"
                                   :disabled="editando !== 'periodo_projeto'" v-validate="'required|min_value:' + proposta.nr_periodos">
                          </div>
                        </div>

                        <!--Data final de vigência-->
                        <div v-if="mostrarRef('projeto_periodos') && mostrarRef('projeto_data_inicial')" class="col-md-3">
                          <label class="control-label">Data final da vigência</label>
                          <div>
                            <div class="form-control" disabled="disabled">{{proposta.dt_data_vigencia | moment("L")}}</div>
                          </div>
                        </div>
                      </div>

                      <!-- Justificativa e Anexos de documento -->
                      <!-- 66888/68639 - Alteracao de periodo de execucao do projeto -->
                      <div v-if="editando === 'periodo_projeto'">
                          <alteracoesPeriodoExecucao
                            :ParmProjetos ="projeto"
                            :ParmAlteracao ="atProp"
                            :filtro ="filtro_alteracoes"
                            @atualizarTimeline ="atualizar_timeline = $event"
                            :refreshTable ="refreshAlteracoes"
                            :cancelar ="cancelar"
                            :editando ="editando"
                            :permiteConcluir = "permiteConcluir"
                            :historicoAlteracaoPeriodo = "historicoAlteracaoPeriodo"
                            :editandoBloco = "editandoBloco"
                            :dataInicialAlteracao = "proposta.dt_assinatura_convenio"
                            :nr_periodos = "proposta.nr_periodos"
                            :dt_data_final = "dataFinalExecucao"
                            :periodo_vigencia = "proposta.periodo_vigencia"
                            :dt_data_vigencia = "proposta.dt_data_vigencia"
                            >
                          </alteracoesPeriodoExecucao>
                      </div>

                    </div>
                  </div>
                </div>


                <!-- Carteira do projeto -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <div v-if="usuarioLogado.userType === 'FUNDACAO'">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">
                        <span v-if="editando !== 'carteira_projeto'" class="grupoMostrarOcultar" @click="mostrar.carteira = !mostrar.carteira"><i :class="'fa fa-caret-' + (mostrar.carteira ? 'up' : 'down')" aria-hidden="true"></i> Carteira</span>
                        <span v-else><i class="fa fa-pencil" aria-hidden="true"></i> Seleção da Carteira</span>
                      </h3>
                      <span v-if="editavel && editando !== 'carteira_projeto' && mostrar.carteira" class="opcaoAlterar">
                        <g-button-ujarak color="primary" size="button--size-ss" @click.native="editar('carteira_projeto')"><i class="fa fa-pencil" aria-hidden="true"></i> Alterar</g-button-ujarak>
                        <i class="fa fa-question-circle" aria-hidden="true"
                           :title="'<h5>Será possível atribuir ou alterar a carteira deste projeto (somente disponível para Fundação)</h5>'"
                           v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"></i>
                      </span>
                    </div>

                    <div class="box-body" v-if="mostrar.carteira">

                      <div class="col-md-12">
                        <!-- Encarteiramento -->
                        <div class="col-md-3">
                          <label class="control-label">Carteira Atual</label>
                          <div>
                            <select v-model="carteiraSelecionada" class="form-control" :disabled="!editavel || editando !== 'carteira_projeto'">
                              <option :value="null">Não encarteirado</option>
                              <option v-for="carteira in listaCarteiras" :value="carteira.usu_codcart">{{carteira.usu_codcart}} - {{carteira.usu_nomcart}}</option>
                            </select>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>


                <!-- Avaliação do projeto -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <div>
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">
                        <span class="grupoMostrarOcultar" @click="mostrar.avaliacao = !mostrar.avaliacao"><i :class="'fa fa-caret-' + (mostrar.avaliacao ? 'up' : 'down')" aria-hidden="true"></i> Avaliação de Projeto</span>
                      </h3>
                    </div>

                    <div class="box-body" v-if="mostrar.avaliacao">
                      <avaliacoes-projeto :numeroProjeto="$route.params.numero" :editavel="editavel"></avaliacoes-projeto>
                    </div>
                  </div>
                </div>


                <!--Objetivos Específicos -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <div v-if="mostrarRef('objetivo_especifico')">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">
                        <span class="grupoMostrarOcultar" @click="mostrar.objetivos = !mostrar.objetivos"><i :class="'fa fa-caret-' + (mostrar.objetivos ? 'up' : 'down')" aria-hidden="true"></i> Objetivo Específico</span>
                      </h3>
                    </div>

                    <div class="box-body" v-if="mostrar.objetivos">
                      <objetivo-especifico :propsObjetivos="proposta.objetivos" :propsProposta="proposta" @objetivoAdicionado="proposta.objetivos = $event"></objetivo-especifico>
                    </div>
                  </div>
                </div>


                <!--Metas -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <div v-if="mostrarRef('metas')" ref="metas">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">
                        <span class="grupoMostrarOcultar" @click="mostrar.metas = !mostrar.metas"><i :class="'fa fa-caret-' + (mostrar.metas ? 'up' : 'down')" aria-hidden="true"></i> Metas</span>
                      </h3>
                    </div>

                    <div class="box-body" v-if="mostrar.metas">
                      <metas :editavel="false" :propsObjetivos="proposta.objetivos" :propsMetas="proposta.metas" :propsProposta="proposta" @metaAdicionada="proposta.metas = $event" :atvSemMetas="atvSemMetas"  @validacaoMetas="adicionaRestricao($event)"></metas>
                    </div>
                  </div>
                </div>


                <!--Atividades -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <div v-if="mostrarRef('atividades')" ref="atividades">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">
                        <span class="grupoMostrarOcultar" @click="mostrar.atividades = !mostrar.atividades"><i :class="'fa fa-caret-' + (mostrar.atividades ? 'up' : 'down')" aria-hidden="true"></i> Atividades</span>
                      </h3>
                    </div>

                    <div class="box-body" v-if="mostrar.atividades">
                      <atividades :editavel="false" :meses="proposta.nr_periodos" :propsMetas="proposta.metas" :propsAtividades="proposta.atividades" :propsProposta="proposta" @atividadeAdicionada="proposta.atividades = $event" @validacaoAtividades="adicionaRestricao($event)"></atividades>
                    </div>
                  </div>
                </div>


                <!--Cronograma com o Extrato de execução do projeto ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <div v-if="mostrarRef('cronograma_fisicofinanceiro')">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">
                        <span v-if="editando !== 'cronograma'" class="grupoMostrarOcultar" @click="mostrar.extratoProjeto = !mostrar.extratoProjeto"><i :class="'fa fa-caret-' + (mostrar.extratoProjeto ? 'up' : 'down')" aria-hidden="true"></i> Extrato do cronograma</span>
                        <span v-else><i class="fa fa-pencil" aria-hidden="true"></i> Extrato do cronograma</span>
                      </h3>
                      <span v-if="editavel && editando !== 'cronograma' && mostrar.extratoProjeto" class="opcaoAlterar">
                        <g-button-ujarak color="primary" size="button--size-ss" @click.native="editar('cronograma')"><i class="fa fa-pencil" aria-hidden="true"></i> Alterar</g-button-ujarak>
                        <i class="fa fa-question-circle" aria-hidden="true"
                           :title="'<h5>Pode aumentar a quantidade de um item<br/>Essas alterações no SGP não alterarão o Sapiens</h5>'"
                           v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"></i>
                      </span>
                    </div>

                    <div class="box-body" v-if="mostrar.extratoProjeto">
                      <extrato :editavel="editavel && editando === 'cronograma'" :propsObjetivos="proposta.objetivos" :layout="'classico'" :etapa="'VISUALIZACAO'" :itensLayout="['quantidade', 'contaFinanceira', 'idItem', 'filtroItens']" :key="componentKey" :propsAtividades="proposta.atividades" :metas="proposta.metas" :proposta="proposta" :meses="proposta.nr_periodos" :projetoDuplicacao="proposta.nr_projeto_duplicacao" @cronogramaAtividades="proposta.atividades = $event" @alteracoesCronograma="cronogramaAlteracoes = $event" @validacaoCronograma="adicionaRestricao($event)"></extrato>

                      <acertos-financeiros :editavel="editavel && editando === 'acertos_financeiros'" :numeroProjeto="this.$route.params.numero" :propsAtividades="proposta.atividades" @alteracoesAcertosFinenceiros="acertosFinanceirosAlteracoes = $event" @validacaoAcertosFinenceiros="adicionaRestricao($event)"></acertos-financeiros>

        <!--Gantt -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                      <div v-if="mostrarRef('gantt')">

                        <!--<visualiza-gestao-atividades :editavel="editavel && editando === 'gantt_atividades'" :itensLayout="['justificativa', 'opcoes']" :propsProposta="proposta" :propsNumeroProjeto="$route.params.numero" @atividadesGantt="proposta.gantt_atividades = $event" @atividadesAlteracoes="proposta.gantt_alterado = $event" @validacaoAtividadesGantt="adicionaRestricao($event)"></visualiza-gestao-atividades>-->
                        <visualiza-gestao-atividades :editavel="editavel && editando === 'gantt_atividades'" :itensLayout="['justificativa', 'opcoes']" :propsNumeroProjeto="$route.params.numero" :propsAtividades="proposta.atividades" @atividadesProposta="proposta.atividades = $event" @atividadesGantt="proposta.gantt_atividades = $event" @atividadesAlteracoes="proposta.gantt_alterado = $event" @validacaoAtividadesGantt="adicionaRestricao($event)"></visualiza-gestao-atividades>

                      </div>

                    </div>

                  </div>
                </div>

                <!-- Demanda 66506 Cadastro da conta de adiantamento -->
                <!-- Conta de Adiantamento  -->
                <div v-if="usuarioLogado.userType === 'FUNDACAO'">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">
                        <span v-if="editando !== 'conta_adiantamento'"
                          class="grupoMostrarOcultar"
                          @click="mostrar.contaAdiantamento = !mostrar.contaAdiantamento">
                          <i :class="'fa fa-caret-' + (mostrar.contaAdiantamento ? 'up' : 'down')" aria-hidden="true"></i>
                          Contas do Projeto</span>
                        <span v-else><i class="fa fa-pencil" aria-hiden="true"></i> Contas do Projeto</span>
                      </h3>
                      <span v-if="editavel && editando !== 'conta_adiantamento' && mostrar.contaAdiantamento" class="opcaoAlterar">
                        <g-button-ujarak color="primary"
                          size="button--size-ss"
                          @click.native="editar('conta_adiantamento')">
                          <i class="fa fa-pencil" aria-hidden="true"></i> Alterar</g-button-ujarak>
                          <i class="fa fa-question-circle" aria-hidden="true"
                            :title="'<h5>A conta de adiantamento pode ser alterada</h5>'"
                            v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"></i>
                      </span>
                    </div>
                    <div class="box-body" v-if="mostrar.contaAdiantamento">
                      <div class="col-md-3">
                        <label class="control-label">Banco (Para Adiantamento)</label>
                        <div>
                          <div class="form-control" disabled="disabled">001 - Banco do Brasil</div>
                        </div>
                      </div>
                      <div class="col-md-3">
                        <label class="control-label">Agência (Para Adiantamento)</label>
                        <div>
                          <the-mask v-validate="'required|agency'"
                            :masked="true"
                            name="agencia de adiantamento"
                            class="form-control"
                            :mask="['####-X']"
                            v-model="dadosBancariosAdiantamento.agencia"
                            :disabled="!editavel || editando !== 'conta_adiantamento'"
                          ></the-mask>
                          <span v-if="errors.first('agencia de adiantamento')"
                            class="label label-danger"
                            > {{ errors.first('agencia de adiantamento') }}
                          </span>
                        </div>
                      </div>
                      <div class="col-md-3">
                        <label class="control-label">Conta de Adiantamento</label>
                        <div>
                          <the-mask v-validate="'required|contacorrente'"
                            :masked="true"
                            name="conta corrente de adiantamento"
                            class="form-control"
                            :mask="['###-X', '####-X', '#####-X', '######-X', '#######-X', '########-X', '#########-X']"
                            v-model="dadosBancariosAdiantamento.conta"
                            :disabled="!editavel || editando !== 'conta_adiantamento'"
                          ></the-mask>
                          <span v-if="errors.first('conta corrente de adiantamento')"
                            class="label label-danger"
                          > {{errors.first('conta corrente de adiantamento')}}</span>
                        </div>
                      </div>
                      <div class="col-md-3">
                        <label class="control-label">MCI</label>
                        <div>
                          <input :disabled="!editavel || editando !== 'conta_adiantamento'" class="form-control" type="text" v-model="dadosBancariosAdiantamento.mci" @input="limitarDigitosMCI" >
                          <span v-if="errors.first('conta corrente de adiantamento')"
                            class="label label-danger"
                          > {{errors.first('mci')}}</span>
                        </div>
                      </div>
                    </div>
                    <div class="box-body" v-if="mostrar.contaAdiantamento">
                      <div class="col-md-3">
                        <label class="control-label">Banco (Conta Interna)</label>
                        <div>
                          <div class="form-control" disabled="disabled">001 - Banco do Brasil</div>
                        </div>
                      </div>
                      <div class="col-md-3">
                        <label class="control-label">Agência (Conta Interna)</label>
                        <div>
                          <the-mask v-validate="'required|agency'"
                            :masked="true"
                            name="agencia de adiantamento"
                            class="form-control"
                            :mask="['####-X']"
                            v-model="agenciaContaInterna"
                            disabled
                          ></the-mask>
                        </div>
                      </div>
                      <div class="col-md-3">
                        <label class="control-label">Conta Interna</label>
                        <div>
                          <the-mask v-validate="'required|contacorrente'"
                            :masked="true"
                            name="conta corrente de adiantamento"
                            class="form-control"
                            :mask="['###-X', '####-X', '#####-X', '######-X', '#######-X', '########-X', '#########-X']"
                            v-model="contaInterna"
                            disabled
                          ></the-mask>
                        </div>
                      </div>
                      <div class="col-md-3">
                        <label class="control-label">Código Fornecedor</label>
                        <div>
                          <input disabled class="form-control" type="text" v-model="codFor" >
                        </div>
                      </div>
                      <div class="col-md-3" v-if="proposta.intervencao_bndes">
                        <label class="control-label">Número Intervenção BNDES</label>
                        <div>
                          <input disabled class="form-control" type="text" v-model="proposta.intervencao_bndes" >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                <!-- Parcela de adiantamento -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <div v-if="mostrarRef('parcelas_adiantamento')">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">
                        <span class="grupoMostrarOcultar" @click="mostrar.parcelasAdiantamento = !mostrar.parcelasAdiantamento"><i :class="'fa fa-caret-' + (mostrar.parcelasAdiantamento ? 'up' : 'down')" aria-hidden="true"></i> Parcelas de Adiantamento</span>
                      </h3>
                    </div>

                    <div class="box-body" v-if="mostrar.parcelasAdiantamento">
                      <parcela-adiantamento :editavel="false" :propsProposta="proposta" :propsParcelas="proposta.adiantamentos" :propsAtividades="proposta.atividades" :propsLayout="'EXECUCAO'" @parcelaAdicionada="proposta.adiantamentos = $event" @validacaoParcelasAdiantamento="adicionaRestricao($event)"></parcela-adiantamento>
                    </div>
                  </div>
                </div>


                <!--Publico alvo ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <div v-if="mostrarRef('publico_alvo')">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">
                        <span v-if="editando !== 'publicos_alvo'" class="grupoMostrarOcultar" @click="mostrar.publicoAlvo = !mostrar.publicoAlvo"><i :class="'fa fa-caret-' + (mostrar.publicoAlvo ? 'up' : 'down')" aria-hidden="true"></i> Público-alvo</span>
                        <span v-else><i class="fa fa-pencil" aria-hidden="true"></i> Público-alvo</span>
                      </h3>
                      <span v-if="editavel && editando !== 'publicos_alvo' && mostrar.publicoAlvo" class="opcaoAlterar">
                        <g-button-ujarak color="primary" size="button--size-ss" @click.native="editar('publicos_alvo')"><i class="fa fa-pencil" aria-hidden="true"></i> Alterar</g-button-ujarak>
                        <i class="fa fa-question-circle" aria-hidden="true"
                           :title="'<h5>Público-alvo pode ser acrescentado, mas não alterado o que foi contratado para não divergir do informado em relatórios de atividades anteriores<br/>Ao concluir o SGP alterará o Sapiens também</h5>'"
                           v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"></i>
                      </span>
                    </div>

                    <div class="box-body" v-if="mostrar.publicoAlvo">
                      <publico-alvo :editavel="editavel && editando === 'publicos_alvo'" :propsPublicosGrid="proposta.publicos_alvo" @publicoAlvoAdicionado="proposta.publicos_alvo = $event" @validacaoPublicoAlvo="adicionaRestricao($event)"></publico-alvo>
                    </div>
                    <!-- 69906 - Definicao de publico alvo -->
                    <div class="box-body" v-if="mostrar.publicoAlvo">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Detalhamento do Público-alvo <strong>Previsto</strong>:</h3>
                          </div>
                        </div>
                      <publicoAlvoDescricao ref="publicoAlvoDescricao" :proposta="proposta.id" :fixado="false" :permiteEditar="true" :abrirAbas="true" :telaProjeto="true"/>
                    </div>
                    <div class="box-body" v-if="mostrar.publicoAlvo">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Detalhamento do Público-alvo <strong>Realizado</strong>:</h3>
                          </div>
                        </div>
                      <publicoAlvoDescricaoRealizado ref="publicoAlvoDescricaoRealizado" :proposta="proposta.id" :fixado="false" :abrirAbas="false"/>
                    </div>
                  </div>
                </div>

                <!-- Tecnologia Social -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <!-- 69906 - Cadastro de Tecnologia Social -->
                <div v-if="mostrarRef('publico_alvo')">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">
                        <span v-if="editando !== 'municipalizacao'" class="grupoMostrarOcultar" @click="mostrar.tecnologiaSocial = !mostrar.tecnologiaSocial"><i :class="'fa fa-caret-' + (mostrar.tecnologiaSocial ? 'up' : 'down')" aria-hidden="true"></i> Tecnologia Social</span>
                        <span v-else><i class="fa fa-pencil" aria-hidden="true"></i> Tecnologia Social</span>
                      </h3>
                    </div>

                    <div class="box-body" v-if="mostrar.tecnologiaSocial">
                      <tecnologiaSocial ref="tecnologiaSocial" :proposta="proposta.id" :fk_processo="proposta.fk_processo" :telaProjeto="true"/>
                    </div>
                  </div>
                </div>

                <div v-if="mostrarRef('publico_alvo') && usuarioLogado.userType === 'FUNDACAO'">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">
                        <span v-if="editando !== 'municipalizacao'" class="grupoMostrarOcultar" @click="mostrar.ods = !mostrar.ods"><i :class="'fa fa-caret-' + (mostrar.ods ? 'up' : 'down')" aria-hidden="true"></i> ODS - Objetivos de Desenvolvimento Sustentável </span>
                        <span v-else><i class="fa fa-pencil" aria-hidden="true"></i> ODS - Objetivos de Desenvolvimento Sustentável</span>
                      </h3>
                    </div>
                    <!-- 69906 - Marcação de ODS no projeto -->
                    <div class="box-body" v-if="mostrar.ods">
                      <odsMarcacao :proposta="proposta.id" :telaProjeto="true"/>
                    </div>
                  </div>
                </div>

                <!-- 66201 - Licenciamento Ambiental -->
                <div v-if="mostrarRef('publico_alvo')">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">
                        <span v-if="editando !== 'municipalizacao'" class="grupoMostrarOcultar" @click="mostrar.licenciamentoAmbiental = !mostrar.licenciamentoAmbiental"><i :class="'fa fa-caret-' + (mostrar.licenciamentoAmbiental ? 'up' : 'down')" aria-hidden="true"></i> Licenciamento Ambiental </span>
                        <span v-else><i class="fa fa-pencil" aria-hidden="true"></i> Licenciamento Ambiental </span>
                      </h3>
                    </div>

                    <div class="box-body" v-if="mostrar.licenciamentoAmbiental">
                      <licenciamentoAmbientalProjeto 
                        :tipoUsuario="usuarioLogado.userType" 
                        :idProposta="proposta.id"
                        :numeroProjeto="this.$route.params.numero"
                        :nomeProjeto="proposta.ds_nome"
                      ></licenciamentoAmbientalProjeto>
                    </div>
                  </div>
                </div>


                <!-- Municípios -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <div v-if="mostrarRef('municipios')">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">
                        <span class="grupoMostrarOcultar" @click="mostrar.municipios = !mostrar.municipios"><i :class="'fa fa-caret-' + (mostrar.municipios ? 'up' : 'down')" aria-hidden="true"></i> Municípios - Locais de execução</span>
                      </h3>
                    </div>

                    <div class="box-body" v-if="mostrar.municipios">
                      <municipalizacao :editavel="false" :propsProposta="proposta" @municipioAdicionado="proposta.municipalizacao = $event" @validacaoMunicipio="adicionaRestricao($event)"></municipalizacao>
                    </div>
                  </div>
                </div>


                <!-- Responsável pela Proposta -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <div v-if="mostrarRef('coordenador')">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">
                        <span v-if="editando !== 'coordenador'" class="grupoMostrarOcultar" @click="mostrar.coordenador = !mostrar.coordenador"><i :class="'fa fa-caret-' + (mostrar.coordenador ? 'up' : 'down')" aria-hidden="true"></i> Responsável pela Proposta</span>
                        <span v-else><i class="fa fa-pencil" aria-hidden="true"></i> Responsável pela Proposta</span>
                      </h3>
                      <span v-if="editavel && editando !== 'coordenador' && mostrar.coordenador" class="opcaoAlterar">
                        <g-button-ujarak color="primary" size="button--size-ss" @click.native="editar('coordenador')"><i class="fa fa-pencil" aria-hidden="true"></i> Alterar</g-button-ujarak>
                          <i class="fa fa-question-circle" aria-hidden="true"
                          :title="'<h5>Qualquer informação abaixo relativo ao Responsável pela Proposta pode ser alterado<br/><br/>Após Concluir, Esta alteração será enviada automaticamente ao Sapiens</h5>'"
                          v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"></i>
                      </span>
                    </div>

                    <div class="box-body form-group" v-if="mostrar.coordenador">
                      <!--Nome-->
                      <div v-if="mostrarRef('coordenador_nome')"
                           class="required-field col-md-8 required"
                           :class="{ 'has-error' : errors.first('nome do coordenador')}">
                        <label class="control-label">Nome</label>
                        <div name="proposal.coordinatorName">
                          <input v-model="proposta.ds_nome_coordenador" name="nome do coordenador" class="form-control" type="text" v-validate="'required|max:100'" data-vv-as="Nome do Coordenador" maxlength="100" :disabled="editando !== 'coordenador'">
                        </div>
                        <span v-if="errors.first('nome do coordenador')" class="label label-danger"> {{ errors.first('nome do coordenador') }}</span>
                      </div>

                      <!--CPF-->
                      <div v-if="mostrarRef('coordenador_cpf')"
                           class="required-field col-md-4 required"
                           :class="{ 'has-error' : errors.first('cpf do coordenador')}">
                        <label class="control-label">CPF</label>
                        <div name="proposal.coordinatorCpf">
                          <the-mask v-if="this.$router.currentRoute.name === 'proposta-visualiza'" v-model="proposta.ds_cpf_coordenador"
                                    name="cpf do coordenador" class="form-control" type="text" data-vv-as="CPF do Coordenador" :disabled="editando !== 'coordenador'"
                                    :mask="'###.###.###-##'">
                          </the-mask>
                          <the-mask v-if="this.$router.currentRoute.name !== 'proposta-visualiza'" v-model="proposta.ds_cpf_coordenador"
                                    name="cpf do coordenador" class="form-control" type="text" :disabled="editando !== 'coordenador'"
                                    :mask="'###.###.###-##'" v-validate="'cpf|required'">
                          </the-mask>
                        </div>
                        <span v-if="errors.first('cpf do coordenador')" class="label label-danger"> {{ errors.first('cpf do coordenador') }}</span>
                      </div>

                      <!--E-mail-->
                      <div v-if="mostrarRef('coordenador_email')"
                           class="required-field col-md-6 required"
                           :class="{ 'has-error' : errors.first('email do coordenador')}">
                        <label class="control-label">E-mail</label>
                        <div name="proposal.coordinatorEmail">
                          <input v-model="proposta.ds_email_coordenador" :disabled="editando !== 'coordenador'"
                                 name="ds_email_coordenador" class="form-control" type="email" data-vv-as="E-mail do Coordenador"
                                 maxlength="255"
                                 v-validate="'required|email|max:255'">
                        </div>
                        <span v-if="errors.first('email do coordenador')" class="label label-danger"> {{ errors.first('email do coordenador') }}</span>
                      </div>

                      <!--Telefone-->
                      <div v-if="mostrarRef('coordenador_telefone')"
                           class="col-md-3 required-field"
                           :class="{ 'has-error' : errors.first('Telefone')}">
                        <label class="control-label">Telefone</label>
                        <div name="proposal.coordinatorPhone">
                          <the-mask v-model="proposta.ds_telefone_coordenador" name="Telefone" class="form-control" type="tel" data-vv-as="Telefone do Coordenador"
                                    v-validate="'required'" :mask="['(##) ####-####', '(##) #####-####']" :disabled="editando !== 'coordenador'"></the-mask>
                          <span v-if="errors.first('Telefone')" class="label label-danger"> {{ errors.first('Telefone') }}</span>
                        </div>
                      </div>

                      <!--Celular-->
                      <div v-if="mostrarRef('coordenador_celular')"
                           class="col-md-3">
                        <label class="control-label">Telefone Celular</label>
                        <div name="proposal.coordinatorPhone">
                          <the-mask v-model="proposta.ds_celular_coordenador" name="Telefone Celular" class="form-control" type="tel" data-vv-as="Celular do Coordenador"
                                    :mask="['(##) ####-####', '(##) #####-####']" :disabled="editando !== 'coordenador'"></the-mask>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>


                <!--Cursos -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <div v-if="mostrarRef('cursos')">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">
                        <span class="grupoMostrarOcultar" @click="mostrar.cursos = !mostrar.cursos"><i :class="'fa fa-caret-' + (mostrar.cursos ? 'up' : 'down')" aria-hidden="true"></i> Cursos</span>
                      </h3>
                    </div>

                    <div class="box-body" v-if="mostrar.cursos">
                      <cursos :propsCursos="proposta.cursos"></cursos>
                    </div>
                  </div>
                </div>


                <!--Equipe do Projeto -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <div v-if="mostrarRef('equipe_do_projeto')">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">
                        <span class="grupoMostrarOcultar" @click="mostrar.equipeProjeto = !mostrar.equipeProjeto"><i :class="'fa fa-caret-' + (mostrar.equipeProjeto ? 'up' : 'down')" aria-hidden="true"></i> Equipe do Projeto</span>
                      </h3>
                    </div>

                    <div class="box-body" v-if="mostrar.equipeProjeto">
                        <span v-if="entidadeEhFundacao" class="col-md-12 entidadeEhFundacao">
                          Dispensado registro pela proponente Fundação BB
                        </span>
                      <span v-else>
                        <equipe-projeto :propsEquipes="proposta.equipes" @equipeAdicionada="proposta.equipes = $event"></equipe-projeto>
                      </span>
                    </div>
                  </div>
                </div>


                <!--Informações introdutórias --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <div v-if="mostrarRef('informacoes_introdutorias')">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">
                        <span class="grupoMostrarOcultar" @click="mostrar.informacoesProjeto = !mostrar.informacoesProjeto"><i :class="'fa fa-caret-' + (mostrar.informacoesProjeto ? 'up' : 'down')" aria-hidden="true"></i> Informações do Projeto</span>
                      </h3>
                    </div>

                    <div class="box-body" v-if="mostrar.informacoesProjeto">
                      <!-- Introdução -->
                      <div v-if="mostrarRef('informacoes_introdutorias_introducao')" class="col-md-12">
                        <label class="control-label">Introdução</label>
                        <div>
                          <textarea-autosize v-resizable :disabled="true" v-model="proposta.ds_introducao" name="introducao" class="form-control" data-vv-as="Informações Introdutórias do Projeto" rows="4" v-validate="'required'"></textarea-autosize>
                        </div>
                      </div>

                      <!-- Apresentação -->
                      <div v-if="mostrarRef('informacoes_introdutorias_apresentacao')" class="col-md-12">
                        <label class="control-label">Apresentação</label>
                        <div>
                          <textarea-autosize v-resizable :disabled="true" data-vv-as="Apresentação do Projeto" v-model="proposta.ds_apresentacao" name="apresentacao" class="form-control" rows="4" v-validate="'required'"></textarea-autosize>
                        </div>
                      </div>

                      <!-- Território -->
                      <div v-if="mostrarRef('informacoes_introdutorias_territorio')" class="col-md-12">
                        <label class="control-label">Território de desenvolvimento do projeto</label>
                        <div>
                          <textarea-autosize v-resizable :disabled="true" data-vv-as="Território de Desenvolvimento do Projeto" v-model="proposta.ds_territorio" name="territorio" class="form-control" rows="4" v-validate="'required'"></textarea-autosize>
                        </div>
                      </div>

                      <!-- Justificativa -->
                      <div v-if="mostrarRef('informacoes_introdutorias_justificativa')" class="col-md-12">
                        <label class="control-label">Justificativa</label>
                        <div>
                          <textarea-autosize v-resizable :disabled="true" data-vv-as="Justificativa do Projeto" v-model="proposta.ds_justificativa" name="justificativa" class="form-control" rows="4" v-validate="'required'"></textarea-autosize>
                        </div>
                      </div>

                      <!-- Objetivo Geral -->
                      <div v-if="mostrarRef('informacoes_introdutorias_objetivo_geral')" class="col-md-12">
                        <label class="control-label">Objetivo geral</label>
                        <div>
                          <textarea-autosize v-resizable :disabled="true" data-vv-as="Objetivo Geral do Projeto" v-model="proposta.ds_objetivo_geral" name="objetivo Geral" class="form-control" rows="4" v-validate="'required'"></textarea-autosize>
                        </div>
                      </div>

                      <!-- Resultados esperados -->
                      <div v-if="mostrarRef('informacoes_gerais_resultados')" class="col-md-12">
                        <label class="control-label">Resultados esperados</label>
                        <div>
                          <textarea-autosize v-resizable :disabled="true" data-vv-as="Resultados Esperados do Projeto" v-model="proposta.ds_resultados" name="Resultados esperados" class="form-control" rows="4" v-validate="'required'"></textarea-autosize>
                        </div>
                      </div>

                      <!-- Operacionalização -->
                      <div v-if="mostrarRef('informacoes_gerais_operacionalizacao')" class="col-md-12">
                        <label class="control-label">Operacionalização</label>
                        <div>
                          <textarea-autosize v-resizable :disabled="true" data-vv-as="Operacionalização do Projeto" v-model="proposta.ds_operacao" name="Operacionalização" class="form-control" rows="4" v-validate="'required'"></textarea-autosize>
                        </div>
                      </div>

                      <!-- Parceria -->
                      <div v-if="mostrarRef('informacoes_gerais_parceria')" class="col-md-12">
                        <label class="control-label">Parceria</label>
                        <div>
                          <textarea-autosize v-resizable :disabled="true" data-vv-as="Parceria do Projeto" v-model="proposta.ds_parceria" name="Parceria" class="form-control" rows="4" v-validate="'required'"></textarea-autosize>
                        </div>
                      </div>

                      <!-- Resumo -->
                      <div v-if="mostrarRef('informacoes_introdutorias_resumo')" class="col-md-12">
                        <label class="control-label">Resumo</label>
                        <div>
                          <textarea-autosize v-resizable :disabled="true" data-vv-as="Resumo do Projeto" v-model="proposta.ds_resumo" name="sumario" class="form-control" rows="4" v-validate="'required'"></textarea-autosize>
                        </div>
                      </div>

                      <!-- Ações de comunicação -->
                      <div v-if="mostrarRef('informacoes_introdutorias_acoes')" class="col-md-12">
                        <label class="control-label">Ações de Comunicação</label>
                        <div>
                          <textarea-autosize v-resizable :disabled="true" data-vv-as="indicadores" v-model="proposta.ds_acoes_comunicacao" name="acoes" class="form-control " rows="4" v-validate="'required'"></textarea-autosize>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>


                <!--Análise do projeto -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <div v-if="usuarioLogado.userType === 'FUNDACAO'">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">
                        <span class="grupoMostrarOcultar" @click="mostrar.analiseProjeto = !mostrar.analiseProjeto"><i :class="'fa fa-caret-' + (mostrar.analiseProjeto ? 'up' : 'down')" aria-hidden="true"></i> Análise do Projeto</span>
                      </h3>
                    </div>

                    <div class="box-body" v-if="mostrar.analiseProjeto">
                      <analise :propsAnalise="proposta" :propsFluxo="fluxo" @analiseProposta="analise = $event" ref="child"></analise>
                    </div>
                  </div>
                </div>


                <!--Documentos -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <div v-if="mostrarRef('documentos')">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">
                        <span class="grupoMostrarOcultar" @click="mostrar.documentos = !mostrar.documentos"><i :class="'fa fa-caret-' + (mostrar.documentos ? 'up' : 'down')" aria-hidden="true"></i> Documentos da Proposta</span>
                      </h3>
                    </div>

                    <div class="box-body" v-if="mostrar.documentos">
                      <upload-documentos-php-novo :propDocumentos="documentosProposta" :documentTypes="proposta.tipoDocumentos" :localUso="'PROPOSTA_COMPLETA_DOCUMENTOS_ANEXOS'" :propsEtapa="nulo"></upload-documentos-php-novo>
                    </div>
                  </div>
                </div>


                <!--Histórico de Aprovações -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <div v-if="mostrarRef('historico')">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">
                        <span class="grupoMostrarOcultar" @click="mostrar.historico = !mostrar.historico"><i :class="'fa fa-caret-' + (mostrar.historico ? 'up' : 'down')" aria-hidden="true"></i> Histórico</span>
                      </h3>
                    </div>

                    <div class="box-body" v-if="mostrar.historico">
                      <historico-proposta :proposta="proposta" @historico_itens="historico_atualizado = $event"></historico-proposta>
                    </div>
                  </div>
                </div>


<!--Entidade executora  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <div v-if="false && mostrarRef('entidade_executora_proponente')" v-show="false">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">Entidade executora</h3>
                    </div>

                    <div class="box-body">
                      <div class="row">
                        <!--Sim ou Não -->
                        <fieldset class="col-md-12">
                          <legend>A proponente será a executora do projeto?</legend>
                          <div name="proposal.entityIsExecutioner">
                            <label class="radio-inline control-label">
                              <input type="radio" name="entityExecutingBool" id="proposal-entity-executing-true"
                                     v-model="proposta.bt_entidade_executora" value="true" :selected="proposta.entityIsExecutioner === 'true'" :disabled="true"> Sim
                            </label>
                            <label class="radio-inline control-label">
                              <input type="radio" name="entityExecutingBool" id="proposal-entity-executing-false"
                                     v-model="proposta.bt_entidade_executora" value="false" :selected="proposta.entityIsExecutioner === 'false'" :disabled="true"> Não
                            </label>
                          </div>
                        </fieldset>

                        <!--Se Não mostra os campos abaixo-->
                        <div v-if="proposta.bt_entidade_executora === 'false'">

                          <!-- dados da entidade -->
                          <fieldset class="col-md-4 col-sm-6 col-xs-12" :disabled="true">
                            <legend>Entidade</legend>
                            <!--Nome Entidade Executora-->
                            <div class="form-group required-field  col-md-12"
                                 :class="{ 'has-error' : errors.first('Nome Entidade Executora')}">
                              <label class="control-label">Nome</label>
                              <div>
                                <input v-model="proposta.ds_entidade_nome"
                                       name="Nome Entidade Executora" class="form-control" type="text"
                                       maxlength="255"
                                       v-validate="'required:!proposta.entityIsExecutioner'">
                              </div>
                              <span v-if="errors.first('Nome Entidade Executora')" class="label label-danger"> {{ errors.first('Nome Entidade Executora') }}</span>
                            </div>

                            <!--Representante legal-->
                            <div  class="form-group required-field col-md-12"
                                  :class="{ 'has-error' : errors.first('Representante legal')}">
                              <label class="control-label">Representante legal</label>
                              <div name="proposal.entityExecutingProcurator" >
                                <input v-model="proposta.ds_entidade_representante_legal"
                                       name="Representante legal" class="form-control" type="text"
                                       maxlength="255"
                                       v-validate="'required:!proposta.ds_entidade_representante_legal'">
                              </div>
                              <span v-if="errors.first('Representante legal')" class="label label-danger"> {{ errors.first('Representante legal') }}</span>
                            </div>

                            <!--CNPJ Entidade Executora-->
                            <div  class="form-group required-field col-md-12"
                                  :class="{ 'has-error' : errors.first('CNPJ entidade executora')}">
                              <label class="control-label">CNPJ</label>
                              <div name="proposal.entityExecutingCNPJ" >
                                <the-mask v-model="proposta.ds_entidade_cnpj"
                                          name="CNPJ entidade executora" class="form-control" type="text"
                                          v-validate="'required:!proposta.ds_entidade_cnpj|cnpj'" :mask="['##.###.###/####-##']">
                                </the-mask>
                              </div>
                              <span v-if="errors.first('CNPJ entidade executora')" class="label label-danger"> {{ errors.first('CNPJ entidade executora') }}</span>
                            </div>
                          </fieldset>

                          <!-- dados de contato -->
                          <fieldset class="col-md-4 col-sm-6 col-xs-12" :disabled="true">
                            <legend>Contato</legend>
                            <!--Email-->
                            <div class="form-group required-field col-md-12"
                                 :class="{ 'has-error' : errors.first('E-mail executora')}">
                              <label class="control-label">E-mail</label>
                              <div name="proposal.entityExecutingEmail">
                                <input v-model="proposta.ds_entidade_email"
                                       name="E-mail executora" class="form-control" type="text"
                                       maxlength="255"
                                       v-validate="'required:!proposta.ds_entidade_email|email'">
                              </div>
                              <span v-if="errors.first('E-mail executora')" class="label label-danger"> {{ errors.first('E-mail executora') }}</span>
                            </div>

                            <!--Telefone Fixo-->
                            <div  class="form-group required-field col-md-12"
                                  :class="{ 'has-error' : errors.first('Telefone Executora')}">
                              <label class="control-label">Telefone fixo</label>
                              <div name="proposal.entityExecutingPhone">
                                <the-mask v-model="proposta.ds_entidade_telefone"
                                          name="Telefone Executora" class="form-control" type="text"
                                          :mask="['(##) ####-####', '(##) #####-####']"
                                          v-validate="'required:!proposta.ds_entidade_telefone'">
                                </the-mask>
                              </div>
                              <span v-if="errors.first('Telefone Executora')" class="label label-danger"> {{ errors.first('Telefone Executora') }}</span>
                            </div>

                            <!--Celular-->
                            <div class="form-group required-field col-md-12"
                                 :class="{ 'has-error' : errors.first('Telefone celular da executora')}">
                              <label class="control-label">Telefone celular</label>
                              <div name="proposal.entityExecutingMobile">
                                <the-mask v-model="proposta.ds_entidade_celular"
                                          name="Telefone celular da executora" class="form-control" type="text"
                                          :mask="['(##) ####-####', '(##) #####-####']"
                                          v-validate="'required:!proposta.ds_entidade_celular'">
                                </the-mask>
                              </div>
                              <span v-if="errors.first('Telefone celular da executora')" class="label label-danger"> {{ errors.first('Telefone celular da executora') }}</span>
                            </div>

                          </fieldset>

                          <!-- dados de endereço -->
                          <fieldset class="col-md-4 col-sm-6 col-xs-12" :disabled="true">
                            <legend>Endereço</legend>
                            <!--CEP-->
                            <div class="form-group required-field col-md-12"
                                 :class="{ 'has-error' : errors.first('CEP da executora')}">
                              <label class="control-label">CEP</label>
                              <div name="proposal.entityExecutingCEP">
                                <the-mask v-model="proposta.entityExecutingCEP"
                                          name="CEP da executora" class="form-control" type="text"
                                          :mask="['#####-###']"
                                          v-validate="'required:!proposta.entityIsExecutioner'">
                                </the-mask>
                              </div>
                              <span v-if="errors.first('CEP da executora')" class="label label-danger"> {{ errors.first('CEP da executora') }}</span>
                            </div>

                            <!--UF-->
                            <div
                              class="form-group required-field col-md-12"
                              :class="{ 'has-error' : errors.first('UF executora')}">
                              <label class="control-label">UF</label>
                              <div name="proposal.entityExecutingState">
                                <select v-model="proposta.entityExecutingState"
                                        class="form-control" name="UF executora"
                                        v-validate="'required:!proposta.entityIsExecutioner'">
                                  <option v-for="uf in estados" :value="uf">{{uf}}</option>
                                </select>
                              </div>
                              <span v-if="errors.first('UF executora')" class="label label-danger"> {{ errors.first('UF executora') }}</span>
                            </div>

                            <!--Cidade-->
                            <div  class="form-group required-field col-md-12"
                                  :class="{ 'has-error' : errors.first('Cidade da Executora')}">
                              <label class="control-label">Cidade</label>
                              <div name="proposal.entityExecutingCity">
                                <input v-model="proposta.entityExecutingCity"
                                       name="Cidade da Executora" class="form-control" type="text"
                                       v-validate="'required:!proposta.entityIsExecutioner'">
                              </div>
                              <span v-if="errors.first('Cidade da Executora')" class="label label-danger"> {{ errors.first('Cidade da Executora') }}</span>
                            </div>

                            <!--Endereço-->
                            <div class="form-group required-field col-md-12"
                                 :class="{ 'has-error' : errors.first('Endereço da Executora')}">
                              <label class="control-label">Endereço</label>
                              <div name="proposal.entityExecutingAddress">
                                <input v-model="proposta.entityExecutingAddress"
                                       name="Endereço da Executora" class="form-control" type="text"
                                       maxlength="255"
                                       v-validate="'required:!proposta.entityIsExecutioner'">
                              </div>
                              <span v-if="errors.first('Endereço da Executora')" class="label label-danger"> {{ errors.first('Endereço da Executora') }}</span>
                            </div>
                          </fieldset>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


<!--Projeto Duplicação -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <!--<div v-if="mostrarRef('projeto_de_duplicacao') && usuarioLogado.userType === 'FUNDACAO'">-->
                  <!--<div class="box box-widget">-->
                    <!--<div class="box-header">-->
                      <!--<h3 class="box-title">-->
                        <!--<span class="grupoMostrarOcultar" @click="mostrar.projetoDuplicador = !mostrar.projetoDuplicador"><i :class="'fa fa-caret-' + (mostrar.projetoDuplicador ? 'up' : 'down')" aria-hidden="true"></i> Projeto de duplicação</span>-->
                      <!--</h3>-->
                    <!--</div>-->

                    <!--<div class="box-body" v-if="mostrar.projetoDuplicador">-->
                      <!--<div uib-tooltip="O projeto de duplicação não pode ser alterado após aprovação desse projeto">-->
                        <!--<div name="proposal.duplicateProject">-->
                          <!--<select name="Projeto Duplicação" class="form-control" aria-hidden="true" :disabled="true" v-model="proposta.nr_projeto_duplicacao">-->
                            <!--<option v-for="projeto in arvoreProjetos" :value="projeto.numprj" >{{projeto.numprj + ' / ' + projeto.nomprj}}</option>-->
                          <!--</select>-->
                        <!--</div>-->
                      <!--</div>-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</div>-->

              </div>

          </div>
        </div>
      </section>
    </div>
  </div>

</template>

<script>
  import Telefone from '../modules/telefone'
  import PublicoAlvo from '../modules/publicoAlvo'
  import ParcelaAdiantamento from '../modules/parcela-adiantamento'
  import EquipeProjeto from '../modules/equipeProjeto'
  import ObjetivoEspecifico from '../modules/objetivoEspecifico'
  import Metas from '../modules/metas'
  import Atividades from '../modules/atividades'
  import Cronograma from '../modules/cronograma'
  import Extrato from '../modules/extrato'
  import { mapGetters } from 'vuex'
  import Municipalizacao from '../modules/municipalizacao'
  import Cursos from '../modules/cursos'
  // import Solenizacao from '../modules/solenizacao'
  import HistoricoProposta from '../modules/historicoProposta'
  import PreAnaliseForm from '../validação/proposta/preAnaliseForm'
  import Analise from '../validação/proposta/analise'
  import Deferimento from '../validação/proposta/deferimento'
  import Formalizacao from '../validação/proposta/formalizacao'
  import Aprovacao from '../validação/proposta/aprovacao_OLD'
  import UploadDocumentosPhpNovo from '../modules/uploadDocumentosPhpNovo'
  import VisualizaGestaoAtividades from './GestaoAtividades'
  import moment from 'moment'
  // import acompanhamentoProjetos from '../projetos/acompanhamentoProjetos'
  import alteracoesProjetos from '../projetos/alteracoesProjetos'
  import AlteracoesPeriodoExecucao from './AlteracoesPeriodoExecucao.vue'
  import VisualizaTimeline from './Timeline'
  import AcertosFinanceiros from './AcertosFinanceiros'
  import AvaliacoesProjeto from '../modules/avaliacoesProjeto'
  import BankAccountValidator from 'br-bank-account-validator'
  import EditaOcorrencias from '../cadastro/ocorrencias/EditaOcorrencias'
  import publicoAlvoDescricao from '../modules/publicoAlvoDescricao.vue'
  import publicoAlvoDescricaoRealizado from '../modules/publicoAlvoDescricaoRealizado.vue'
  import tecnologiaSocial from '../modules/tecnologiaSocial.vue'
  import odsMarcacao from '../modules/odsMarcacao.vue'
  import licenciamentoAmbientalProjeto from '../modules/licenciamentoAmbiental/licenciamentoAmbientalProjeto.vue'
  export default {
    components: {
      EditaOcorrencias,
      AvaliacoesProjeto,
      AcertosFinanceiros,
      // acompanhamentoProjetos,
      alteracoesProjetos,
      AlteracoesPeriodoExecucao,
      VisualizaTimeline,
      VisualizaGestaoAtividades,
      UploadDocumentosPhpNovo,
      PreAnaliseForm,
      ParcelaAdiantamento,
      Analise,
      Deferimento,
      Formalizacao,
      Aprovacao,
      HistoricoProposta,
      // Solenizacao,
      Cursos,
      Municipalizacao,
      Cronograma,
      Extrato,
      Atividades,
      Metas,
      ObjetivoEspecifico,
      Telefone,
      PublicoAlvo,
      EquipeProjeto,
      publicoAlvoDescricao,
      publicoAlvoDescricaoRealizado,
      tecnologiaSocial,
      odsMarcacao,
      licenciamentoAmbientalProjeto},
    name: 'edita-proposta',
    data () {
      return {
        titulo: 'SGP',
        restricaParaConcluir: [],
        entidadeEhFundacao: false,
        chamado: [],
        acProp: [],
        atProp: [],
        filtro_acompanhamento: '',
        filtro_alteracoes: '',
        atualizar_timeline: null,
        editavel: false,
        editando: '',
        editandoBloco: {},
        projeto: {
          proposal: {
            entity: {
              active: true
            }
          }
        },
        ocorrenciaSelecionada: {
          id: null,
          ehVisualizacao: false
        },
        //
        progressBar: {
          stepAtual: null,
          stepTotal: null,
          tarefaAtual: null
        },
        loading: {
          tela: false,
          alteracoesProjeto: true
        },
        tel: '',
        finalizou: false,
        nulo: null,
        array: [],
        atvSemMetas: [],
        metaNaoAchada: [],
        camposOK: true,
        verificaFilhos: false,
        esconder: true,
        esconderEntidade: false,
        analise: {},
        preAnalise: {},
        deferimento: {},
        formalizacao: {},
        aprovacao: {},
        fluxo: {},
        filtro: [],
        elementos: {
          visivel: ''
        },
        projetoPeriodos: 0,
        dataFinalExecucao: '',
        historico_atualizado: [],
        documentosProposta: [],
        bloqueiaBotoes: false,
        // processo: 'PRE_ANALISE',
        cronogramaAlteracoes: [],
        listaCarteiras: [],
        carteiraSelecionada: null,
        proposta: {
          entidade: {},
          // solenizacoes: [],
          documentos: {
            proposta: []
          },
          ds_projeto_duplicacao_descricao: ''
        },
        descricoesDiversas: {'ALTERACAO_ATIVIDADES': 'Atividades', 'ALTERACAO_ATIVIDADES_GANTT': 'Atividades (via Gantt)', 'ALTERACAO_METAS': 'Metas', 'ALTERACAO_MUNICIPIOS': 'Municípios', 'ALTERACAO_PARCELAS_ADIANTAMENTO': 'Parcelas de Adiantamento', 'ALTERACAO_PERIODO_PROJETO': 'Prorrogação de Prazo', 'ALTERACOES_PROJETO': 'Alterações do Projeto', 'REMANEJAMENTO': 'Remanejamento', 'SUPLEMENTACAO': 'Suplementação', 'SOLICITACAO': 'Solicitação', 'ANALISE': 'Análise', 'AUTORIZACAO': 'Autorização', 'REVISAO': 'Revisão', 'FEITO': 'Feito', 'EM_EXECUCAO': 'Em Execução', 'CANCELADO': 'Cancelado'},
        processosAlteracao: [],
        filtroTabela: {
          alteracoesProjeto: {
            id: [],
            solicitacao: [],
            situacao: [],
            etapa: [],
            data: [1, 1]
          }
        },
        mostrar: {
          ocorrencias: false,
          alteracoes: false,
          consultaAlteracoesProjeto: false,
          opcoesProjeto: false,
          coordenador: false,
          periodo: false,
          carteira: false,
          avaliacao: false,
          entidade: false,
          informacoesProjeto: false,
          equipeProjeto: false,
          projetoDuplicador: false,
          objetivos: false,
          metas: false,
          atividades: false,
          extratoProjeto: false,
          // Demanda 66506 Cadastro da conta de adiantamento
          contaAdiantamento: false,
          parcelasAdiantamento: false,
          municipios: false,
          cursos: false,
          documentos: false,
          historico: false,
          analiseProjeto: false,
          publicoAlvo: false,
          tecnologiaSocial: false,
          ods: false,
          licenciamentoAmbiental: false
        },
        componentKey: 0,
        estados: ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'],
        messagemConfirmacao: {
          'municipalizacao': 'Confirma a <b>Alteração dos Municípios</b> desse projeto?',
          'metas': 'Confirma a <b>Alteração das Metas</b> desse projeto?',
          'atividades': 'Confirma a <b>Alteração das Atividades</b> desse projeto?',
          'coordenador': 'Confirma a <b>Alteração do Coordenador</b> desse projeto?',
          'periodo_projeto': 'Confirma a <b>Alteração da Duração</b> desse projeto?',
          'publicos_alvo': 'Confirma a <b>Alteração do Público-alvo</b> desse projeto?',
          'cronograma': 'Confirma a <b>Alteração do Cronograma</b> desse projeto?',
          'parcelas_adiantamento': 'Confirma a <b>Alteração da(s) Parcela(s) de Adiantamento</b> desse projeto?'
        },
        arvoreProjetos: [],
        // Demanda 66506 Cadastro da conta de adiantamento
        dadosBancariosAdiantamento: {
          banco: '001',
          agencia: '',
          conta: '',
          tipo: 1
        },
        listaBancos: [{'codigo': '001', 'nome': 'Banco do Brasil S.A.', 'caracteresConta': 8}, {'codigo': '033', 'nome': 'Banco Santander (Brasil) S.A.', 'caracteresConta': 8, 'digitoAgencia': false}, {'codigo': '070', 'nome': 'BRB - Banco de Brasília S.A.'}, {'codigo': '104', 'nome': 'Caixa Econômica Federal', 'digitoAgencia': false}, {'codigo': '237', 'nome': 'Banco Bradesco S.A.', 'caracteresConta': 7}, {'codigo': '341', 'nome': 'Itaú Unibanco S.A.', 'caracteresConta': 5, 'digitoAgencia': false},
          {'codigo': '', 'nome': '', $isDisabled: true}, // Separador (elemento disabled)
          {'codigo': '003', 'nome': 'BANCO DA AMAZONIA S.A.'}, {'codigo': '004', 'nome': 'Banco do Nordeste do Brasil S.A.'}, {'codigo': '007', 'nome': 'BANCO NACIONAL DE DESENVOLVIMENTO ECONOMICO E SOCIAL'}, {'codigo': '010', 'nome': 'CREDICOAMO CREDITO RURAL COOPERATIVA'}, {'codigo': '011', 'nome': 'CREDIT SUISSE HEDGING-GRIFFO CORRETORA DE VALORES S.A'}, {'codigo': '012', 'nome': 'Banco Inbursa S.A.'}, {'codigo': '014', 'nome': 'STATE STREET BRASIL S.A. ? BANCO COMERCIAL'}, {'codigo': '015', 'nome': 'UBS Brasil Corretora de Câmbio, Títulos e Valores Mobiliários S.A.'}, {'codigo': '016', 'nome': 'COOPERATIVA DE CRÉDITO MÚTUO DOS DESPACHANTES DE TRÂNSITO DE SANTA CATARINA E RI'}, {'codigo': '017', 'nome': 'BNY Mellon Banco S.A.'}, {'codigo': '018', 'nome': 'Banco Tricury S.A.'}, {'codigo': '021', 'nome': 'BANESTES S.A. BANCO DO ESTADO DO ESPIRITO SANTO'}, {'codigo': '024', 'nome': 'Banco Bandepe S.A.'}, {'codigo': '025', 'nome': 'Banco Alfa S.A.'}, {'codigo': '029', 'nome': 'Banco Itaú Consignado S.A.'}, {'codigo': '036', 'nome': 'Banco Bradesco BBI S.A.'}, {'codigo': '037', 'nome': 'Banco do Estado do Pará S.A.'}, {'codigo': '040', 'nome': 'Banco Cargill S.A.'}, {'codigo': '041', 'nome': 'Banco do Estado do Rio Grande do Sul S.A.', 'caracteresConta': 9}, {'codigo': '047', 'nome': 'Banco do Estado de Sergipe S.A.'}, {'codigo': '060', 'nome': 'Confidence Corretora de Câmbio S.A.'}, {'codigo': '062', 'nome': 'Hipercard Banco Múltiplo S.A.'}, {'codigo': '063', 'nome': 'Banco Bradescard S.A.'}, {'codigo': '064', 'nome': 'GOLDMAN SACHS DO BRASIL BANCO MULTIPLO S.A.'}, {'codigo': '065', 'nome': 'Banco AndBank (Brasil) S.A.'}, {'codigo': '066', 'nome': 'BANCO MORGAN STANLEY S.A.'}, {'codigo': '069', 'nome': 'Banco Crefisa S.A.'}, {'codigo': '074', 'nome': 'Banco J. Safra S.A.'}, {'codigo': '075', 'nome': 'Banco ABN Amro S.A.'}, {'codigo': '076', 'nome': 'Banco KDB do Brasil S.A.'}, {'codigo': '077', 'nome': 'Banco Inter S.A.'}, {'codigo': '078', 'nome': 'Haitong Banco de Investimento do Brasil S.A.'}, {'codigo': '079', 'nome': 'Banco Original do Agronegócio S.A.'}, {'codigo': '080', 'nome': 'B&T CORRETORA DE CAMBIO LTDA.'}, {'codigo': '081', 'nome': 'BancoSeguro S.A.'}, {'codigo': '082', 'nome': 'BANCO TOPÁZIO S.A.'}, {'codigo': '083', 'nome': 'Banco da China Brasil S.A.'}, {'codigo': '084', 'nome': 'UNIPRIME NORTE DO PARANÁ – COOPERATIVA DE CRÉDITO LTDA'}, {'codigo': '085', 'nome': 'Cooperativa Central de Crédito – Ailos'}, {'codigo': '088', 'nome': 'BANCO RANDON S.A.'}, {'codigo': '089', 'nome': 'CREDISAN COOPERATIVA DE CRÉDITO'}, {'codigo': '091', 'nome': 'CENTRAL DE COOPERATIVAS DE ECONOMIA E CRÉDITO MÚTUO DO ESTADO DO RIO GRANDE DO S'}, {'codigo': '092', 'nome': 'BRK S.A. Crédito, Financiamento e Investimento'}, {'codigo': '093', 'nome': 'PÓLOCRED   SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORT'}, {'codigo': '094', 'nome': 'Banco Finaxis S.A.'}, {'codigo': '095', 'nome': 'Travelex Banco de Câmbio S.A.'}, {'codigo': '096', 'nome': 'Banco B3 S.A.'}, {'codigo': '097', 'nome': 'Credisis – Central de Cooperativas de Crédito Ltda.'}, {'codigo': '098', 'nome': 'Credialiança Cooperativa de Crédito Rural'}, {'codigo': '099', 'nome': 'UNIPRIME CENTRAL – CENTRAL INTERESTADUAL DE COOPERATIVAS DE CREDITO LTDA.'}, {'codigo': '100', 'nome': 'Planner Corretora de Valores S.A.'}, {'codigo': '101', 'nome': 'RENASCENCA DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '102', 'nome': 'XP INVESTIMENTOS CORRETORA DE CÂMBIO,TÍTULOS E VALORES MOBILIÁRIOS S/A'}, {'codigo': '105', 'nome': 'Lecca Crédito, Financiamento e Investimento S/A'}, {'codigo': '107', 'nome': 'Banco Bocom BBM S.A.'}, {'codigo': '108', 'nome': 'PORTOCRED S.A. – CREDITO, FINANCIAMENTO E INVESTIMENTO'}, {'codigo': '111', 'nome': 'OLIVEIRA TRUST DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIARIOS S.A.'}, {'codigo': '113', 'nome': 'Magliano S.A. Corretora de Cambio e Valores Mobiliarios'}, {'codigo': '114', 'nome': 'Central Cooperativa de Crédito no Estado do Espírito Santo – CECOOP'}, {'codigo': '117', 'nome': 'ADVANCED CORRETORA DE CÂMBIO LTDA'}, {'codigo': '119', 'nome': 'Banco Western Union do Brasil S.A.'}, {'codigo': '120', 'nome': 'BANCO RODOBENS S.A.'}, {'codigo': '121', 'nome': 'Banco Agibank S.A.'}, {'codigo': '122', 'nome': 'Banco Bradesco BERJ S.A.'}, {'codigo': '124', 'nome': 'Banco Woori Bank do Brasil S.A.'}, {'codigo': '125', 'nome': 'Plural S.A. Banco Múltiplo'}, {'codigo': '126', 'nome': 'BR Partners Banco de Investimento S.A.'}, {'codigo': '127', 'nome': 'Codepe Corretora de Valores e Câmbio S.A.'}, {'codigo': '128', 'nome': 'MS Bank S.A. Banco de Câmbio'}, {'codigo': '129', 'nome': 'UBS Brasil Banco de Investimento S.A.'}, {'codigo': '130', 'nome': 'CARUANA S.A. – SOCIEDADE DE CRÉDITO, FINANCIAMENTO E INVESTIMENTO'}, {'codigo': '131', 'nome': 'TULLETT PREBON BRASIL CORRETORA DE VALORES E CÂMBIO LTDA'}, {'codigo': '132', 'nome': 'ICBC do Brasil Banco Múltiplo S.A.'}, {'codigo': '133', 'nome': 'CONFEDERAÇÃO NACIONAL DAS COOPERATIVAS CENTRAIS DE CRÉDITO E ECONOMIA FAMILIAR E'}, {'codigo': '134', 'nome': 'BGC LIQUIDEZ DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '136', 'nome': 'CONFEDERAÇÃO NACIONAL DAS COOPERATIVAS CENTRAIS UNICRED LTDA. – UNICRED DO BRASI'}, {'codigo': '138', 'nome': 'Get Money Corretora de Câmbio S.A.'}, {'codigo': '139', 'nome': 'Intesa Sanpaolo Brasil S.A. – Banco Múltiplo'}, {'codigo': '140', 'nome': 'Easynvest – Título Corretora de Valores SA'}, {'codigo': '142', 'nome': 'Broker Brasil Corretora de Câmbio Ltda.'}, {'codigo': '143', 'nome': 'Treviso Corretora de Câmbio S.A.'}, {'codigo': '144', 'nome': 'BEXS BANCO DE CÂMBIO S/A'}, {'codigo': '145', 'nome': 'LEVYCAM – CORRETORA DE CAMBIO E VALORES LTDA.'}, {'codigo': '146', 'nome': 'GUITTA CORRETORA DE CAMBIO LTDA.'}, {'codigo': '149', 'nome': 'Facta Financeira S.A. – Crédito Financiamento e Investimento'}, {'codigo': '157', 'nome': 'ICAP do Brasil Corretora de Títulos e Valores Mobiliários Ltda.'}, {'codigo': '159', 'nome': 'Casa do Crédito S.A. Sociedade de Crédito ao Microempreendedor'}, {'codigo': '163', 'nome': 'Commerzbank Brasil S.A. – Banco Múltiplo'}, {'codigo': '169', 'nome': 'BANCO OLÉ CONSIGNADO S.A.'}, {'codigo': '173', 'nome': 'BRL Trust Distribuidora de Títulos e Valores Mobiliários S.A.'}, {'codigo': '174', 'nome': 'PEFISA S.A. – CRÉDITO, FINANCIAMENTO E INVESTIMENTO'}, {'codigo': '177', 'nome': 'Guide Investimentos S.A. Corretora de Valores'}, {'codigo': '180', 'nome': 'CM CAPITAL MARKETS CORRETORA DE CÂMBIO, TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '183', 'nome': 'SOCRED S.A. – SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO P'}, {'codigo': '184', 'nome': 'Banco Itaú BBA S.A.'}, {'codigo': '188', 'nome': 'ATIVA INVESTIMENTOS S.A. CORRETORA DE TÍTULOS, CÂMBIO E VALORES'}, {'codigo': '189', 'nome': 'HS FINANCEIRA S/A CREDITO, FINANCIAMENTO E INVESTIMENTOS'}, {'codigo': '190', 'nome': 'SERVICOOP – COOPERATIVA DE CRÉDITO DOS SERVIDORES PÚBLICOS ESTADUAIS DO RIO GRAN'}, {'codigo': '191', 'nome': 'Nova Futura Corretora de Títulos e Valores Mobiliários Ltda.'}, {'codigo': '194', 'nome': 'PARMETAL DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '196', 'nome': 'FAIR CORRETORA DE CAMBIO S.A.'}, {'codigo': '197', 'nome': 'Stone Pagamentos S.A.'}, {'codigo': '208', 'nome': 'Banco BTG Pactual S.A.'}, {'codigo': '212', 'nome': 'Banco Original S.A.'}, {'codigo': '213', 'nome': 'Banco Arbi S.A.'}, {'codigo': '217', 'nome': 'Banco John Deere S.A.'}, {'codigo': '218', 'nome': 'Banco BS2 S.A.'}, {'codigo': '222', 'nome': 'BANCO CRÉDIT AGRICOLE BRASIL S.A.'}, {'codigo': '224', 'nome': 'Banco Fibra S.A.'}, {'codigo': '233', 'nome': 'Banco Cifra S.A.'}, {'codigo': '241', 'nome': 'BANCO CLASSICO S.A.'}, {'codigo': '243', 'nome': 'Banco Máxima S.A.'}, {'codigo': '246', 'nome': 'Banco ABC Brasil S.A.'}, {'codigo': '249', 'nome': 'Banco Investcred Unibanco S.A.'}, {'codigo': '250', 'nome': 'BCV – BANCO DE CRÉDITO E VAREJO S.A.'}, {'codigo': '253', 'nome': 'Bexs Corretora de Câmbio S/A'}, {'codigo': '254', 'nome': 'PARANÁ BANCO S.A.'}, {'codigo': '259', 'nome': 'MONEYCORP BANCO DE CÂMBIO S.A.'}, {'codigo': '260', 'nome': 'Nu Pagamentos S.A.'}, {'codigo': '265', 'nome': 'Banco Fator S.A.'}, {'codigo': '266', 'nome': 'BANCO CEDULA S.A.'}, {'codigo': '268', 'nome': 'BARI COMPANHIA HIPOTECÁRIA'}, {'codigo': '269', 'nome': 'BANCO HSBC S.A.'}, {'codigo': '270', 'nome': 'Sagitur Corretora de Câmbio Ltda.'}, {'codigo': '271', 'nome': 'IB Corretora de Câmbio, Títulos e Valores Mobiliários S.A.'}, {'codigo': '272', 'nome': 'AGK CORRETORA DE CAMBIO S.A.'}, {'codigo': '273', 'nome': 'Cooperativa de Crédito Rural de São Miguel do Oeste – Sulcredi/São Miguel'}, {'codigo': '274', 'nome': 'MONEY PLUS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E A EMPRESA DE PEQUENO PORT'}, {'codigo': '276', 'nome': 'Senff S.A. – Crédito, Financiamento e Investimento'}, {'codigo': '278', 'nome': 'Genial Investimentos Corretora de Valores Mobiliários S.A.'}, {'codigo': '279', 'nome': 'COOPERATIVA DE CREDITO RURAL DE PRIMAVERA DO LESTE'}, {'codigo': '280', 'nome': 'Avista S.A. Crédito, Financiamento e Investimento'}, {'codigo': '281', 'nome': 'Cooperativa de Crédito Rural Coopavel'}, {'codigo': '283', 'nome': 'RB CAPITAL INVESTIMENTOS DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LIMITADA'}, {'codigo': '285', 'nome': 'Frente Corretora de Câmbio Ltda.'}, {'codigo': '286', 'nome': 'COOPERATIVA DE CRÉDITO RURAL DE OURO   SULCREDI/OURO'}, {'codigo': '288', 'nome': 'CAROL DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.'}, {'codigo': '289', 'nome': 'DECYSEO CORRETORA DE CAMBIO LTDA.'}, {'codigo': '290', 'nome': 'Pagseguro Internet S.A.'}, {'codigo': '292', 'nome': 'BS2 Distribuidora de Títulos e Valores Mobiliários S.A.'}, {'codigo': '293', 'nome': 'Lastro RDV Distribuidora de Títulos e Valores Mobiliários Ltda.'}, {'codigo': '296', 'nome': 'VISION S.A. CORRETORA DE CAMBIO'}, {'codigo': '298', 'nome': 'Vip’s Corretora de Câmbio Ltda.'}, {'codigo': '299', 'nome': 'SOROCRED   CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.'}, {'codigo': '300', 'nome': 'Banco de la Nacion Argentina'}, {'codigo': '301', 'nome': 'BPP Instituição de Pagamento S.A.'}, {'codigo': '306', 'nome': 'PORTOPAR DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.'}, {'codigo': '307', 'nome': 'Terra Investimentos Distribuidora de Títulos e Valores Mobiliários Ltda.'}, {'codigo': '309', 'nome': 'CAMBIONET CORRETORA DE CÂMBIO LTDA.'}, {'codigo': '310', 'nome': 'VORTX DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.'}, {'codigo': '311', 'nome': 'DOURADA CORRETORA'}, {'codigo': '312', 'nome': 'HSCM SCMEPP LTDA.'}, {'codigo': '313', 'nome': 'AMAZÔNIA CORRETORA DE CÂMBIO LTDA.'}, {'codigo': '315', 'nome': 'PI Distribuidora de Títulos e Valores Mobiliários S.A.'}, {'codigo': '318', 'nome': 'Banco BMG S.A.'}, {'codigo': '319', 'nome': 'OM DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '320', 'nome': 'China Construction Bank (Brasil) Banco Múltiplo S/A'}, {'codigo': '321', 'nome': 'CREFAZ SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E A EMPRESA DE PEQUENO PORTE LT'}, {'codigo': '322', 'nome': 'Cooperativa de Crédito Rural de Abelardo Luz – Sulcredi/Crediluz'}, {'codigo': '323', 'nome': 'MERCADOPAGO.COM REPRESENTACOES LTDA.'}, {'codigo': '324', 'nome': 'CARTOS SOCIEDADE DE CRÉDITO DIRETO S.A.'}, {'codigo': '325', 'nome': 'Órama Distribuidora de Títulos e Valores Mobiliários S.A.'}, {'codigo': '326', 'nome': 'PARATI – CREDITO, FINANCIAMENTO E INVESTIMENTO S.A.'}, {'codigo': '329', 'nome': 'QI Sociedade de Crédito Direto S.A.'}, {'codigo': '330', 'nome': 'BANCO BARI DE INVESTIMENTOS E FINANCIAMENTOS S.A.'}, {'codigo': '331', 'nome': 'Fram Capital Distribuidora de Títulos e Valores Mobiliários S.A.'}, {'codigo': '332', 'nome': 'Acesso Soluções de Pagamento S.A.'}, {'codigo': '335', 'nome': 'Banco Digio S.A.'}, {'codigo': '336', 'nome': 'Banco C6 S.A.'}, {'codigo': '340', 'nome': 'Super Pagamentos e Administração de Meios Eletrônicos S.A.'}, {'codigo': '342', 'nome': 'Creditas Sociedade de Crédito Direto S.A.'}, {'codigo': '343', 'nome': 'FFA SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE LTDA.'}, {'codigo': '348', 'nome': 'Banco XP S.A.'}, {'codigo': '349', 'nome': 'AL5 S.A. CRÉDITO, FINANCIAMENTO E INVESTIMENTO'}, {'codigo': '350', 'nome': 'COOPERATIVA DE CRÉDITO RURAL DE PEQUENOS AGRICULTORES E DA REFORMA AGRÁRIA DO CE'}, {'codigo': '352', 'nome': 'TORO CORRETORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '354', 'nome': 'NECTON INVESTIMENTOS  S.A. CORRETORA DE VALORES MOBILIÁRIOS E COMMODITIES'}, {'codigo': '355', 'nome': 'ÓTIMO SOCIEDADE DE CRÉDITO DIRETO S.A.'}, {'codigo': '358', 'nome': 'MIDWAY S.A. - SCFI'}, {'codigo': '359', 'nome': 'ZEMA CRÉDITO, FINANCIAMENTO E INVESTIMENTO S/A'}, {'codigo': '360', 'nome': 'TRINUS CAPITAL DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.'}, {'codigo': '362', 'nome': 'CIELO S.A.'}, {'codigo': '363', 'nome': 'SOCOPA SOCIEDADE CORRETORA PAULISTA S.A.'}, {'codigo': '364', 'nome': 'GERENCIANET S.A.'}, {'codigo': '365', 'nome': 'SOLIDUS S.A. CORRETORA DE CAMBIO E VALORES MOBILIARIOS'}, {'codigo': '366', 'nome': 'BANCO SOCIETE GENERALE BRASIL S.A.'}, {'codigo': '367', 'nome': 'VITREO DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.'}, {'codigo': '368', 'nome': 'Banco CSF S.A.'}, {'codigo': '370', 'nome': 'Banco Mizuho do Brasil S.A.'}, {'codigo': '371', 'nome': 'WARREN CORRETORA DE VALORES MOBILIÁRIOS E CÂMBIO LTDA.'}, {'codigo': '373', 'nome': 'UP.P SOCIEDADE DE EMPRÉSTIMO ENTRE PESSOAS S.A.'}, {'codigo': '374', 'nome': 'REALIZE CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.'}, {'codigo': '376', 'nome': 'BANCO J.P. MORGAN S.A.'}, {'codigo': '377', 'nome': 'MS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE LTDA'}, {'codigo': '378', 'nome': 'BBC LEASING S.A. – ARRENDAMENTO MERCANTIL'}, {'codigo': '379', 'nome': 'COOPERFORTE – COOPERATIVA DE ECONOMIA E CRÉDITO MÚTUO DOS FUNCIONÁRIOS DE INSTIT'}, {'codigo': '380', 'nome': 'PICPAY SERVICOS S.A.'}, {'codigo': '381', 'nome': 'BANCO MERCEDES-BENZ DO BRASIL S.A.'}, {'codigo': '382', 'nome': 'FIDÚCIA SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE L'}, {'codigo': '383', 'nome': 'BOLETOBANCÁRIO.COM TECNOLOGIA DE PAGAMENTOS LTDA.'}, {'codigo': '384', 'nome': 'GLOBAL FINANÇAS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO'}, {'codigo': '386', 'nome': 'NU FINANCEIRA S.A. CFI'}, {'codigo': '387', 'nome': 'Banco Toyota do Brasil S.A.'}, {'codigo': '389', 'nome': 'Banco Mercantil do Brasil S.A.'}, {'codigo': '390', 'nome': 'BANCO GM S.A.'}, {'codigo': '391', 'nome': 'COOPERATIVA DE CREDITO RURAL DE IBIAM – SULCREDI/IBIAM'}, {'codigo': '393', 'nome': 'Banco Volkswagen S.A.'}, {'codigo': '394', 'nome': 'Banco Bradesco Financiamentos S.A.'}, {'codigo': '395', 'nome': 'F D GOLD DTVM LTDA'}, {'codigo': '396', 'nome': 'HUB PAGAMENTOS S.A'}, {'codigo': '397', 'nome': 'LISTO SOCIEDADE DE CREDITO DIRETO S.A.'}, {'codigo': '398', 'nome': 'IDEAL CTVM S.A.'}, {'codigo': '399', 'nome': 'Kirton Bank S.A. – Banco Múltiplo'}, {'codigo': '400', 'nome': 'CC POUP SER FIN CO'}, {'codigo': '402', 'nome': 'COBUCCIO SCD S.A.'}, {'codigo': '403', 'nome': 'CORA SOCIEDADE DE CRÉDITO DIRETO S.A.'}, {'codigo': '404', 'nome': 'SUMUP SOCIEDADE DE CRÉDITO DIRETO S.A.'}, {'codigo': '406', 'nome': 'ACCREDITO SCD S.A.'}, {'codigo': '407', 'nome': 'ÍNDIGO INVESTIMENTOS DTVM LTDA.'}, {'codigo': '408', 'nome': 'BÔNUSCRED SOCIEDADE DE CRÉDITO DIRETO S.A.'}, {'codigo': '410', 'nome': 'PLANNER SCM S.A.'}, {'codigo': '411', 'nome': 'VIA CERTA FINANCIADORA S.A. - CFI'}, {'codigo': '412', 'nome': 'BANCO CAPITAL S.A.'}, {'codigo': '419', 'nome': 'NUMBRS SCD S.A.'}, {'codigo': '422', 'nome': 'Banco Safra S.A.'}, {'codigo': '456', 'nome': 'Banco MUFG Brasil S.A.'}, {'codigo': '464', 'nome': 'Banco Sumitomo Mitsui Brasileiro S.A.'}, {'codigo': '473', 'nome': 'Banco Caixa Geral – Brasil S.A.'}, {'codigo': '477', 'nome': 'Citibank N.A.'}, {'codigo': '479', 'nome': 'Banco ItauBank S.A.'}, {'codigo': '487', 'nome': 'DEUTSCHE BANK S.A. – BANCO ALEMAO'}, {'codigo': '488', 'nome': 'JPMorgan Chase Bank, National Association'}, {'codigo': '492', 'nome': 'ING Bank N.V.'}, {'codigo': '495', 'nome': 'Banco de La Provincia de Buenos Aires'}, {'codigo': '505', 'nome': 'Banco Credit Suisse (Brasil) S.A.'}, {'codigo': '545', 'nome': 'SENSO CORRETORA DE CAMBIO E VALORES MOBILIARIOS S.A'}, {'codigo': '600', 'nome': 'Banco Luso Brasileiro S.A.'}, {'codigo': '604', 'nome': 'Banco Industrial do Brasil S.A.'}, {'codigo': '610', 'nome': 'Banco VR S.A.'}, {'codigo': '611', 'nome': 'Banco Paulista S.A.'}, {'codigo': '612', 'nome': 'Banco Guanabara S.A.'}, {'codigo': '613', 'nome': 'Omni Banco S.A.'}, {'codigo': '623', 'nome': 'Banco Pan S.A.'}, {'codigo': '626', 'nome': 'BANCO C6 CONSIGNADO S.A.'}, {'codigo': '630', 'nome': 'Banco Smartbank S.A.'}, {'codigo': '633', 'nome': 'Banco Rendimento S.A.'}, {'codigo': '634', 'nome': 'BANCO TRIANGULO S.A.'}, {'codigo': '637', 'nome': 'BANCO SOFISA S.A.'}, {'codigo': '643', 'nome': 'Banco Pine S.A.'}, {'codigo': '652', 'nome': 'Itaú Unibanco Holding S.A.'}, {'codigo': '653', 'nome': 'BANCO INDUSVAL S.A.'}, {'codigo': '654', 'nome': 'BANCO DIGIMAIS S.A.'}, {'codigo': '655', 'nome': 'Banco Votorantim S.A.'}, {'codigo': '707', 'nome': 'Banco Daycoval S.A.'}, {'codigo': '712', 'nome': 'Banco Ourinvest S.A.'}, {'codigo': '720', 'nome': 'BCO RNX S.A.'}, {'codigo': '739', 'nome': 'Banco Cetelem S.A.'}, {'codigo': '741', 'nome': 'BANCO RIBEIRAO PRETO S.A.'}, {'codigo': '743', 'nome': 'Banco Semear S.A.'}, {'codigo': '745', 'nome': 'Banco Citibank S.A.', 'caracteresConta': 8, 'digitoAgencia': false}, {'codigo': '746', 'nome': 'Banco Modal S.A.'}, {'codigo': '747', 'nome': 'Banco Rabobank International Brasil S.A.'}, {'codigo': '748', 'nome': 'BANCO COOPERATIVO SICREDI S.A.'}, {'codigo': '751', 'nome': 'Scotiabank Brasil S.A. Banco Múltiplo'}, {'codigo': '752', 'nome': 'Banco BNP Paribas Brasil S.A.'}, {'codigo': '753', 'nome': 'Novo Banco Continental S.A. – Banco Múltiplo'}, {'codigo': '754', 'nome': 'Banco Sistema S.A.'}, {'codigo': '755', 'nome': 'Bank of America Merrill Lynch Banco Múltiplo S.A.'}, {'codigo': '756', 'nome': 'BANCO COOPERATIVO DO BRASIL S.A. – BANCOOB'}, {'codigo': '757', 'nome': 'BANCO KEB HANA DO BRASIL S.A.'}],
        codFor: '',
        bancoContaInterna: '',
        agenciaContaInterna: '',
        contaInterna: '',
        refreshAlt: 0,
        historicoAlteracaoPeriodo: {},
        acessoGerSolucoes: false
      }
    },
    inject: ['$validator'],
    provide () {
      return {
        $validator: this.$validator
      }
    },
    watch: {
      loading: function () {
        this.titulo = this.loading.tela ? 'SGP Carregando ' + this.$route.params.numero : 'SGP - ' + this.$route.params.numero + ' - ' + this.proposta.ds_nome
      },
      'proposta.opcoes': {
        // handler: function () {
        //   this.loading.tela = true
        //   axiosLaravel.post('projeto/opcoes', {'id': this.proposta.id, 'opcoes': _.get(this.proposta, 'opcoes', [])}).then((response) => {
        //     this.$snotify.clear()
        //     this.$snotify.clear()
        //     this.loading.tela = false
        //   })
        //     .catch((error) => {
        //       this.loading.tela = false
        //       this.$root.trataErro(error)
        //     })
        // },
        // deep: true
      },
      filtroTabela: {
        handler: function () {
          console.log('filtroTabela')
          this.processosAlteracao.forEach((solicitacao) => {
            let filtroId = this.filtroTabela.alteracoesProjeto.id.length === 0 || _.includes(this.filtroTabela.alteracoesProjeto.id, solicitacao.id)
            let filtroSituacao = this.filtroTabela.alteracoesProjeto.situacao.length === 0 || _.includes(this.filtroTabela.alteracoesProjeto.situacao, solicitacao.situacao)
            let filtroEtapa = this.filtroTabela.alteracoesProjeto.etapa.length === 0 || _.includes(this.filtroTabela.alteracoesProjeto.etapa, solicitacao.etapa)
            let filtroSolicitacao = this.filtroTabela.alteracoesProjeto.solicitacao.length === 0 || (_.intersection(this.filtroTabela.alteracoesProjeto.solicitacao, _.map(solicitacao.requisicao.processos, 'nome'))).length > 0
            let filtroData = moment(solicitacao.inicio).isBetween(this.periodoParaMesAno(this.filtroTabela.alteracoesProjeto.data[0], this.proposta.dt_assinatura_convenio, 'YYYY-MM-DD'), this.periodoParaMesAno(this.filtroTabela.alteracoesProjeto.data[1], this.proposta.dt_assinatura_convenio, 'YYYY-MM-DD'), 'day')
            console.log('  filtroSolicitacao', solicitacao.id, filtroSolicitacao)
            console.log('     intersection', _.intersection(this.filtroTabela.alteracoesProjeto.solicitacao, _.map(solicitacao.requisicao.processos, 'nome')), this.filtroTabela.alteracoesProjeto.solicitacao, _.map(solicitacao.requisicao.processos, 'nome'))
            _.set(solicitacao, 'mostrar', (filtroId && filtroSituacao && filtroEtapa && filtroSolicitacao && filtroData))
          })
        },
        deep: true
      },
      documentosProposta () {
        if (this.documentosProposta) {
          this.proposta.documentos.proposta = this.documentosProposta
        }
      }
    },
    computed: {
      dataFinalVigencia: function () {
        if (this.proposta.dt_assinatura_convenio) {
          this.proposta.dt_data_vigencia = moment(this.proposta.dt_assinatura_convenio).add(parseInt(this.proposta.periodo_vigencia), 'M').format('YYYY-MM-DD')
        } else {
          if (this.proposta.dt_data_inicial) {
            this.proposta.dt_data_vigencia = moment(this.proposta.dt_data_inicial).add(parseInt(this.proposta.periodo_vigencia), 'M').format('YYYY-MM-DD')
          }
        }
      },
      // Suporte 60026 de proposta.dt_data_inicial para proposta.dt_assinatura_convenio
      dataFinal: function () {
        if (this.proposta.dt_assinatura_convenio) {
          this.dataFinalExecucao = moment(this.proposta.dt_assinatura_convenio).add(this.proposta.nr_periodos, 'M').format('DD/MM/YYYY')
          return this.dataFinalExecucao
        }
      },
      // atualiza: function () {
      //   if (this.proposta.documentos) {
      //     if (!this.proposta.documentos.proposta) {
      //       this.proposta.documentos.proposta = []
      //       if (this.documentosProposta.length > 0) {
      //         this.proposta.documentos.proposta = this.documentosProposta
      //       }
      //     } else {
      //       this.documentosProposta = this.proposta.documentos.proposta
      //     }
      //   }
      // },
      telefone: function () {
        if (this.proposta.entidade.contato) {
          let size = this.proposta.entidade.contato.ds_telefone.length
          if (size < 11) {
            this.tel = '(' + this.proposta.entidade.contato.ds_telefone.substring(0, 2) + ') ' + this.proposta.entidade.contato.ds_telefone.substring(2, 6) + ' - ' + this.proposta.entidade.contato.ds_telefone.substring(6, 10)
          } else {
            this.tel = '(' + this.proposta.entidade.contato.ds_telefone.substring(0, 2) + ') ' + this.proposta.entidade.contato.ds_telefone.substring(2, 7) + ' - ' + this.proposta.entidade.contato.ds_telefone.substring(7, 11)
          }
          return this.tel
        }
      },
      ...mapGetters([
        'usuarioLogado'
      ]),
      mostraCronograma: function () {
        // if (this.proposta.objetivos) {
        //   this.$forceUpdate()
        //   return this.proposta.objetivos.some((o) => { return o.metas.atividades !== null })
        // }
        this.$forceUpdate()
      }
    },
    destroyed () {
      Echo.leave(`Edita.Proposta.${this.proposta.id}`)
    },
    async created () {
      console.clear()
      this.$snotify.async('Carregando o projeto...', {timeout: 0})
      this.consultaAcessoGerenteSolucoes()
      await this.buscaProposta()
      this.entidadeEhFundacao = this.proposta.entidade.ds_cnpj === '01641000000133'
      this.assinaCanalProposta()
      //
      this.buscaArvoreProjeto()
      this.editavel = this.$root.isFundacao(this.usuarioLogado)
      this.consultaContaInterna()
    },
    methods: {
      adicionaRestricao (ev) {
        if (!_.isNil(ev) && _.has(ev, 'tag')) {
          // Se já existe, remova da lista
          _.remove(this.restricaParaConcluir, function (i) {
            return i.tag === ev.tag
          })
          // Adiciona a restrição
          this.restricaParaConcluir.push(ev)
        }
      },
      permiteConcluir (bloco) {
        console.log(bloco)
        if (this.restricaParaConcluir.length > 0 && _.filter(this.restricaParaConcluir, {'ativo': true}).length > 0) {
          let vm = this
          //
          let restricoes = _.filter(this.restricaParaConcluir, {'ativo': true, 'tipo': 'restricao'})
          let informacoes = _.filter(this.restricaParaConcluir, {'ativo': true, 'tipo': 'informacao'})
          let confirmacoes = _.filter(this.restricaParaConcluir, {'ativo': true, 'tipo': 'confirmacao'})
          if (restricoes.length > 0) {
            let mensagens = '<div class=avisoAlerta><li>' + _.join(_.map(restricoes, 'mensagem'), '<li>') + '</div>'
            this.$dialog.alert(mensagens, {html: true, animation: 'fade', customClass: 'avisoAlerta'}).then(function (dialog) {
            })
          } else {
            if (informacoes.length > 0) {
              let mensagens = '<div class=avisoInfo><li>' + _.join(_.map(informacoes, 'mensagem'), '<li>') + '</div>'
              this.$dialog.alert(mensagens, {html: true, animation: 'fade', customClass: 'avisoInfo'}).then(function (dialog) {
                //
                _.forEach(vm.restricaParaConcluir, function (item) {
                  if (item.tipo === 'informacao') {
                    _set(item, 'ativo', false)
                  }
                })
              })
            } else if (confirmacoes.length > 0) {
              let mensagens = '<div class=avisoConfirmacao><li>' + _.join(_.map(confirmacoes, 'mensagem'), '<li>') + '</div>'
              this.$dialog.confirm(mensagens, {html: true, animation: 'fade', customClass: 'avisoConfirmacao'}).then(function (dialog) {
                //
                _.forEach(vm.restricaParaConcluir, function (item) {
                  if (item.tipo === 'confirmacao') {
                    _set(item, 'ativo', false)
                  }
                })
              }).catch(function () {
              })
              //
              if (informacoes.length === 0 & confirmacoes.length === 0) {
                this.concluir(bloco)
              }
            }
          }
        } else {
          console.log('PERMITE CONCLUIR')
          this.concluir(bloco)
        }
      },
      assinaCanalProposta () {
        Echo.join(`Edita.Proposta.${this.proposta.id}`).listen('PropostaEvents', (e) => {
          // Se vier alguma mensagem mostra para o usuário
          if (!_.isEmpty(e) && !_.isNull(e)) {
            this.progressBar.stepAtual = e.dados.stepAtual
            this.progressBar.stepTotal = e.dados.stepTotal
            this.progressBar.tarefaAtual = e.dados.tarefaAtual
          }
        })
          .here((users) => {
            if (users.length > 1) {
              this.$snotify.warning('Existe outro usuário acessando essa mesma proposta')
            }
          })
          .joining((user) => {
            this.$snotify.warning('Usuário ' + user.ds_nome_usuario + ' entrou para alterar essa proposta')
          })
      },
      mostrarRef (ref) {
        return _.filter(this.elementos, item => item.nome === ref).some((item) => { return item.visivel })
      },
      async show () {
        this.$modal.show('visualizar')
        this.$forceUpdate()
      },
      hide () {
        this.$modal.hide('visualizar')
      },
      retiraAspas ($event) {
        let keyCode = ($event.keyCode ? $event.keyCode : $event.which)
        if (keyCode === 39 || keyCode === 34) {
          $event.preventDefault()
        }
      },
      buscaFluxo () {
        //  Verificar no retorno se a atividade atual é referente a esta página se não então erro
        //  Carregar array de refs de elementos ou não (v-if)
        this.loading.tela = true
        axiosLaravel.post('fluxo/', {'id_proposta': this.proposta.id, 'atividade': 'EXECUCAO'}).then((response) => {
          this.$snotify.clear()
          this.fluxo = response.data
          this.elementos = this.fluxo.elementos
          this.loading.tela = false
          // this.$snotify.success('Fluxo carregado com sucesso!', {timeout: 1000})
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      async buscaProposta () {
        this.loading.tela = true
        await axiosLaravel.get('projeto/numero/' + this.$route.params.numero).then((response) => {
          // TODO: criar parâmetro de ativo na proposta para situações de duplicidade
          this.proposta = response.data
          this.projeto['proposta'] = this.proposta
          this.projetoPeriodos = this.proposta.nr_periodos
          let mesesVigencia = Math.round(moment(this.proposta.projetoSapiens['0']['usu_datfimvig']).diff(moment(this.proposta.dt_assinatura_convenio), 'months', true))
          this.proposta.periodo_vigencia = this.ehNulo(this.proposta.periodo_vigencia, mesesVigencia)
          if (this.proposta.documentos) {
            if (_.isUndefined(this.proposta.documentos.proposta)) {
              if (this.proposta.documentos) {
                let documentosTemporarios = this.proposta.documentos
                this.proposta.documentos = {
                  proposta: documentosTemporarios
                }
                this.documentosProposta = this.proposta.documentos.proposta
              } else {
                this.proposta.documentos = {
                  proposta: []
                }
              }
            } else {
              this.documentosProposta = this.proposta.documentos.proposta
            }
          }
          this.buscaEntidades()
          this.verificaChamado()
          this.buscaFluxo()
          this.buscaArquivosEsperados()
          this.buscaCarteiras()
          this.buscaContaAdiantamento()
          this.verificaOpcoesProjeto()
          // this.buscaProcessosAlteracaoProjeto()
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      abrirLink (caminho, novaJanela) {
        window.open(location.protocol + '//' + location.host + caminho, (novaJanela ? '_blank' : '_self'))
      },
      // buscaProcessosAlteracaoProjeto () {
      //   this.loading.alteracoesProjeto = true
      //   axiosLaravel.get('projeto/alteracoes/lista/' + this.proposta.ds_codigo_projeto_erp).then((response) => {
      //     if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
      //       _.set(this.filtroTabela, 'alteracoesProjeto.data.1', this.proposta.nr_periodos) // O filtra de data começa no período 1 e vai até a quantidade de períodos do projeto
      //       let processosAlteracao = response.data.retorno
      //       processosAlteracao.forEach((solicitacao) => { // Se tiver processos gera uma lista de descrições dos processos, se não tiver devolve a jutificativa
      //         solicitacao['mostrar'] = true
      //         solicitacao['requisicao'] = JSON.parse(solicitacao['requisicao'])
      //         let listaProcessos = _.map(_.get(solicitacao, 'requisicao.processos', []), 'nome')
      //         let listaProcessosDescricao = []
      //         listaProcessos.forEach((prc) => {
      //           listaProcessosDescricao.push(this.descricoesDiversas[prc])
      //         })
      //         solicitacao['solicitacao'] = listaProcessos.length > 0 ? _.join(listaProcessosDescricao, ', ') : solicitacao.requisicao.justificativa
      //       })
      //       this.processosAlteracao = processosAlteracao
      //     } else {
      //       this.$snotify.error(response.data.mensagem)
      //     }
      //     this.loading.alteracoesProjeto = false
      //     this.$forceUpdate
      //   })
      //     .catch((error) => {
      //       this.$snotify.clear()
      //       this.loading.alteracoesProjeto = false
      //       this.$root.trataErro(error)
      //     })
      // },
      periodoParaMesAno (periodo, inicioProjeto, formato) {
        return moment(inicioProjeto).add(periodo - 1, 'month').format(formato)
      },
      // Demanda 66506 Cadastro da conta de adiantamento
      async buscaContaAdiantamento () {
        await axiosLaravel.get('conta-adiantamento/buscaConta', {params: {id: this.proposta.id}}).then((response) => {
          if (!_.includes(Object.keys(response.data), 'codigo')) {
            const dadosBancarios = response.data
            this.dadosBancariosAdiantamento.agencia = dadosBancarios.agencia
            this.dadosBancariosAdiantamento.conta = dadosBancarios.conta
            this.dadosBancariosAdiantamento.mci = dadosBancarios.mci
          }
        })
      },
      async buscaEntidades () {
        this.loading.tela = true
        let currentDate = new Date()
        let hoje = moment(currentDate).format('YYYYMMDD')
        await axiosLaravel.get('entidades/' + this.proposta.entidade.id).then((response) => {
          this.proposta.entidade = response.data
          let representantesValidos = []
          _.forEach(response.data.dirigentes, function (o) {
            if (o.bt_assinatura_entidade === 1 && o.bt_ativo === 1 && o.bt_representante_legal === 1 && o.bt_assinatura_requerida === 1) {
              let dataInicial = moment(o.dt_inicio_mandato).format('YYYYMMDD')
              let dataFinal = moment(o.dt_fim_mandato).format('YYYYMMDD')
              if (dataInicial <= hoje && hoje <= dataFinal) {
                representantesValidos.push(o)
              }
            }
          })
          this.proposta.entidade.dirigentes = representantesValidos
          this.loading.tela = false
          this.$forceUpdate
        })
          .catch((error) => {
            if (error) {
              this.$snotify.clear()
              this.$root.trataErro(error)
            }
          })
      },
      buscaArvoreProjeto () {
        axiosLaravel.get('projetos-duplicacao').then((response) => {
          this.arvoreProjetos = _.sortBy(response.data, 'numprj').reverse()
          this.$snotify.success('Projeto carregado!', {timeout: 1000})
          this.loading.tela = false
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      buscaCarteiras () {
        axiosLaravel.get('carteira/projeto/' + this.$route.params.numero).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            this.listaCarteiras = response.data.retorno['carteiras']
            this.carteiraSelecionada = response.data.retorno['carteira_projeto']['usu_codcart']
          } else {
            this.$snotify.error(response.data.mensagem)
          }
          this.$forceUpdate
        })
          .catch((error) => {
            this.loading.show = false
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      limpar () {
        this.proposta = Object.assign({}, {
          entidade: {
            ds_nome: ''
          },
          ds_projeto_duplicacao_descricao: ''})
      },
      toggleOpcoesProjeto () {
        if (!this.proposta.opcoes) {
          this.$forceUpdate()
        }
        this.mostrar.opcoesProjeto = !this.mostrar.opcoesProjeto
      },
      verificaOpcoesProjeto () {
        if (!this.proposta.opcoes) {
          this.$forceUpdate()
        }
      },
      buscaArquivosEsperados () {
        axiosLaravel.get('configuracoes/').then((response) => {
          this.proposta.tipoDocumentos = response.data.configuracao_proposta.documentos_obrigatorios
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      salvar () {
        this.loading.tela = true
        this.proposta.proximaEtapa = 'SALVAR'
        this.$snotify.async('Salvando proposta. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.put('propostas/' + this.proposta.id, this.proposta).then((response) => {
          this.$snotify.clear()
          this.bloqueiaBotoes = false
          this.$snotify.success('Proposta atualizada com sucesso')
          this.loading.tela = false
        })
          .catch((error) => {
            this.loading.tela = false
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      verificaChamado () {
        console.log('teste', this.proposta.id)
        axiosLaravel.post('chamado/chamadoProjeto/', {'projeto': this.proposta.id}).then((response) => {
          this.chamado = response.data
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
        console.log('chamados', this.chamado)
      },

      // Valida se todos os documentos foram adicionados
      isUploadingDocuments () {
        let documentosEsperados = this.proposta.documentTypes.map((item) => {
          return item.type
        })
        let documentosCarregados = this.proposta.documents.map((item) => {
          return item.documentType.type
        })
        return _.difference(documentosEsperados, documentosCarregados).length === 0
      },
      // Valida se todos os objetivos tem metas
      validaObjetivos () {
        return this.proposta.objetivos.every((item) => {
          return item.metas ? item.metas.length > 0 : false
        })
      },
      // Valida se todas as metas tem atividades
      validaMetas () {
        let metas = []
        this.proposta.objetivos.forEach((objetivo) => {
          if (objetivo.metas) {
            objetivo.metas.forEach((meta) => {
              metas.push(meta)
            })
          }
        })
        return metas.every((meta) => {
          return meta.atividades ? meta.atividades.length > 0 : false
        })
      },
      ehNulo (valor, opcao) {
        return _.isNull(valor) || _.isNil(valor) || _.isUndefined(valor) ? opcao : valor
      },
      editar (bloco) {
        console.log('EDITANDO...')
        this.editando = bloco
        if (bloco === '') {
          this.editandoBloco = {}
        }
        if (bloco === 'coordenador') {
          this.editandoBloco['ds_nome_coordenador'] = this.proposta.ds_nome_coordenador
          this.editandoBloco['ds_cpf_coordenador'] = this.proposta.ds_cpf_coordenador
          this.editandoBloco['ds_email_coordenador'] = this.proposta.ds_email_coordenador
          this.editandoBloco['ds_telefone_coordenador'] = this.proposta.ds_telefone_coordenador
          this.editandoBloco['ds_celular_coordenador'] = this.proposta.ds_celular_coordenador
        }
        if (bloco === 'periodo_projeto') {
          this.editandoBloco['nr_periodos'] = this.proposta.nr_periodos
          this.editandoBloco['dt_data_final'] = this.dataFinalExecucao
          this.editandoBloco['periodo_vigencia'] = this.proposta.periodo_vigencia
          this.editandoBloco['dt_data_vigencia'] = this.proposta.dt_data_vigencia
          this.proposta.periodo_vigencia = this.ehNulo(this.proposta.periodo_vigencia, parseInt(this.proposta.nr_periodos) + 12)
          // 66888/68639 - Alteracao de periodo de execucao do projeto
          // Grava os dados que estão sendo alterados para rastreio posterior
          if (_.isEmpty(this.historicoAlteracaoPeriodo)) {
            this.historicoAlteracaoPeriodo = {
              dt_assinatura_convenio: this.proposta.dt_assinatura_convenio,
              nr_periodos: this.proposta.nr_periodos,
              dt_data_final: this.dataFinalExecucao,
              periodo_vigencia: this.proposta.periodo_vigencia,
              dt_data_vigencia: this.proposta.dt_data_vigencia
            }
          }
          console.log('HistoricoAlteracaoObject: ', this.historicoAlteracaoPeriodo)
        }
        if (bloco === 'carteira_projeto') {
          this.editandoBloco['carteira'] = _.clone(this.carteiraSelecionada)
        }
        if (bloco === 'publicos_alvo') {
          this.editandoBloco['publicos_alvo'] = _.cloneDeep(this.proposta.publicos_alvo)
        }
        if (bloco === 'metas') {
          this.editandoBloco['metas'] = _.cloneDeep(this.proposta.metas)
        }
        if (bloco === 'atividades') {
          this.editandoBloco['atividades'] = _.cloneDeep(this.proposta.atividades)
        }
        if (bloco === 'gantt_atividades') {
          this.editandoBloco['gantt_atividades'] = _.cloneDeep(this.proposta.gantt_atividades)
        }
        if (bloco === 'cronograma') {
          this.editandoBloco['cronograma'] = _.cloneDeep(this.proposta.atividades)
        }
        if (bloco === 'parcelas_adiantamento') {
          this.editandoBloco['parcelas_adiantamento'] = _.cloneDeep(this.proposta.adiantamentos)
        }
        if (bloco === 'municipalizacao') {
          this.editandoBloco['municipalizacao'] = _.cloneDeep(this.proposta.municipalizacao)
        }
        // Demanda 66506 Cadastro da conta de adiantamento
        if (bloco === 'conta_adiantamento') {
          this.editandoBloco['conta_adiantamento'] = _.cloneDeep(this.dadosBancariosAdiantamento)
        }
        console.log('Editando ' + bloco, this.editandoBloco)
      },
      concluir (bloco) {
        let vm = this
        let msg = ''
        let rota = ''
        let post = {}
        //
        if (bloco === 'coordenador') {
          msg = 'Alterando coordenador e atualizando o Sapiens...'
          rota = 'projeto/atualiza/coordenador'
          post = {'projeto': this.proposta.ds_codigo_projeto_erp, 'antes': this.editandoBloco, 'alterado': {'ds_nome_coordenador': this.proposta.ds_nome_coordenador, 'ds_cpf_coordenador': this.proposta.ds_cpf_coordenador, 'ds_email_coordenador': this.proposta.ds_email_coordenador, 'ds_telefone_coordenador': this.proposta.ds_telefone_coordenador, 'ds_celular_coordenador': this.proposta.ds_celular_coordenador}}
          this.processarAlteracao(msg, rota, post)
        }
        if (bloco === 'carteira_projeto') {
          msg = 'Movendo o Projeto de uma Carteira para outra e atualizando o Sapiens...'
          rota = 'projeto/atualiza/carteira'
          post = {'projeto': this.proposta.ds_codigo_projeto_erp, 'antes': this.editandoBloco.carteira, 'alterado': this.carteiraSelecionada}
          this.processarAlteracao(msg, rota, post)
        }
        if (bloco === 'periodo_projeto') {
          msg = 'Prorrogando prazo/vigência do projeto e atualizando o Sapiens...'
          rota = 'projeto/atualiza/prazo_projeto'

          // 66888/68639 - Alteracao de periodo de execucao do projeto
          let dataConvenio = moment(this.proposta.dt_assinatura_convenio, ((this.proposta.dt_assinatura_convenio).indexOf('/') > 0 ? 'DD/MM/YYYY' : 'YYYY-MM-DD'), true)
          dataConvenio = dataConvenio.format('YYYY-MM-DD')
          let dataVigencia = moment(this.proposta.dt_data_vigencia, ((this.proposta.dt_data_vigencia).indexOf('/') > 0 ? 'DD/MM/YYYY' : 'YYYY-MM-DD'), true)
          dataVigencia = dataVigencia.format('YYYY-MM-DD')
          let dataFim = moment(this.dataFinalExecucao, ((this.dataFinalExecucao).indexOf('/') > 0 ? 'DD/MM/YYYY' : 'YYYY-MM-DD'), true)
          dataFim = dataFim.format('YYYY-MM-DD')

          let periodicidades = [{'codigo': 'MENSAL', 'duracao': 1}, {'codigo': 'BIMESTRAL', 'duracao': 2}, {'codigo': 'TRIMESTRAL', 'duracao': 3}, {'codigo': 'QUADRIMESTRAL', 'duracao': 4}, {'codigo': 'SEMESTRAL', 'duracao': 6}, {'codigo': 'ANUAL', 'duracao': 12}]
          let periodicidadeMeses = _.get(_.find(periodicidades, ['codigo', this.proposta.ds_periodicidade_formulario]), 'duracao')
          let diferencaMeses = parseInt(this.proposta.nr_periodos) - parseInt(this.editandoBloco.nr_periodos)
          let qtdeRelatoriosNovos = Math.trunc(diferencaMeses / periodicidadeMeses)
          //
          let mensagem = 'Alterada duração da execução do projeto em <b>' + (diferencaMeses > 1 ? diferencaMeses + ' meses' : diferencaMeses === 1 ? diferencaMeses + ' mês' : ' nenhum mês') + '</b>.<br/><br/>' +
            'A periodicidade de apresentação de relatório de execução é  <b>' + this.proposta.ds_periodicidade_formulario + '</b> para este projeto.<br/><br/>' +
            (qtdeRelatoriosNovos > 1 ? 'Serão criados <b>' + qtdeRelatoriosNovos + ' relatórios de execução</b>' : (qtdeRelatoriosNovos === 1 ? 'Será criado <b>' + qtdeRelatoriosNovos + ' relatório de execução</b>' : 'Nenhum relatório de execução será criado')) + ' automaticamente ao concluir esta alteração.<br/><br/>' +
            'Deseja continuar a alteração do período do projeto?'

          this.$dialog.confirm(mensagem, {html: true, animation: 'fade', customClass: 'avisoConfirmacao'}).then(function (dialog) {
            console.log('Iniciando processamento do post', post)
            // 66888/68639 - Alteracao de periodo de execucao do projeto
            let dtFim = moment(vm.historicoAlteracaoPeriodo.dt_data_final, ((vm.historicoAlteracaoPeriodo.dt_data_final).indexOf('/') > 0 ? 'DD/MM/YYYY' : 'YYYY-MM-DD'), true)
            dtFim = dtFim.format('YYYY-MM-DD')
            vm.historicoAlteracaoPeriodo.dt_data_final = dtFim
            post = {'projeto': vm.proposta.ds_codigo_projeto_erp, 'antes': vm.editandoBloco, 'historico': vm.historicoAlteracaoPeriodo, 'alterado': {'dt_assinatura_convenio': dataConvenio, 'nr_periodos': vm.proposta.nr_periodos, 'dt_data_final': dataFim, 'periodo_vigencia': vm.proposta.periodo_vigencia, 'dt_data_vigencia': dataVigencia, 'qtde_relatorios_novos': qtdeRelatoriosNovos}}
            vm.processarAlteracao(msg, rota, post)
          })
        }
        if (bloco === 'publicos_alvo') {
          msg = 'Alterando o Público-alvo do projeto e atualizando o Sapiens...'
          rota = 'projeto/atualiza/publicos_alvo'
          post = {'projeto': this.proposta.ds_codigo_projeto_erp, 'antes': this.editandoBloco, 'alterado': {'publicos_alvo': this.proposta.publicos_alvo}}
          this.processarAlteracao(msg, rota, post)
        }
        //
        if (bloco === 'metas') {
          msg = 'Alterando as Metas do projeto...'
          rota = 'projeto/atualiza/metas'
          post = {'projeto': this.proposta.ds_codigo_projeto_erp, 'antes': this.editandoBloco, 'alterado': {'metas': this.proposta.metas}}
          this.processarAlteracao(msg, rota, post)
        }
        //
        if (bloco === 'atividades') {
          msg = 'Alterando as Atividades do projeto...'
          rota = 'projeto/atualiza/atividades'
          post = {'projeto': this.proposta.ds_codigo_projeto_erp, 'antes': this.editandoBloco, 'alterado': {'atividades': this.proposta.atividades}}
          this.processarAlteracao(msg, rota, post)
        }
        //
        if (bloco === 'gantt_atividades') {
          msg = 'Alterando o Gantt de Atividades do projeto...'
          rota = 'projeto/atualiza/gantt_atividades'
          post = {'projeto': this.proposta.ds_codigo_projeto_erp, 'antes': this.editandoBloco, 'alterado': this.proposta.gantt_alterado.alterados, 'justificativa': this.proposta.gantt_alterado.justificativa}
          this.processarAlteracao(msg, rota, post)
        }
        //
        if (bloco === 'cronograma') {
          msg = 'Alterando o Cronograma do projeto no SGP ...'
          rota = 'projeto/atualiza/cronograma'
          post = {'projeto': this.proposta.ds_codigo_projeto_erp, 'antes': this.editandoBloco, 'alterado': {'cronograma': this.cronogramaAlteracoes}}
          this.processarAlteracao(msg, rota, post)
        }
        //
        if (bloco === 'parcelas_adiantamento') {
          msg = 'Alterando as Parcelas de Adiantamento do projeto...'
          rota = 'projeto/atualiza/parcelas_adiantamento'
          // Verificando exclusões
          let idsAntes = _.map(this.editandoBloco.parcelas_adiantamento, 'id')
          let idsDepois = _.map(this.proposta.adiantamentos, 'id')
          // Pegar os ids diferente e guardar como excluídos
          let excluido = _.filter(this.editandoBloco.parcelas_adiantamento, function (a) {
            return _.includes(_.difference(idsAntes, idsDepois), a.id)
          })
          let alterado = _.clone(this.proposta.adiantamentos)
          _.forEach(alterado, function (p) {
            _.unset(p, 'requisitado')
            _.unset(p, 'percentual_comprovado')
          })
          post = {'projeto': this.proposta.ds_codigo_projeto_erp, 'antes': this.editandoBloco, 'alterado': {'parcelas_adiantamento': alterado}, 'excluido': {'parcelas_adiantamento': excluido}}
          this.processarAlteracao(msg, rota, post)
        }
        //
        if (bloco === 'municipalizacao') {
          msg = 'Alterando os Municípios do projeto...'
          rota = 'projeto/atualiza/municipalizacao'
          // Verificando exclusões
          let idsAntes = _.map(this.editandoBloco.municipalizacao, 'id')
          let idsDepois = _.map(this.proposta.municipalizacao, 'id')
          // Pegar os ids diferente e guardar como excluídos
          let excluido = _.filter(this.editandoBloco.municipalizacao, function (a) {
            return _.includes(_.difference(idsAntes, idsDepois), a.id)
          })
          post = {'projeto': this.proposta.ds_codigo_projeto_erp, 'antes': this.editandoBloco, 'alterado': {'municipalizacao': this.proposta.municipalizacao}, 'excluido': {'municipalizacao': excluido}}
          this.processarAlteracao(msg, rota, post)
        }
        // Demanda 66506 Cadastro da conta de adiantamento
        if (bloco === 'conta_adiantamento') {
          msg = 'Alterando Conta de adiantamento'
          rota = 'conta-adiantamento/salvaConta'
          post = {
            id: this.proposta.id,
            banco: this.dadosBancariosAdiantamento.banco,
            tipo: this.dadosBancariosAdiantamento.tipo,
            agencia: this.dadosBancariosAdiantamento.agencia,
            conta: this.dadosBancariosAdiantamento.conta,
            mci: this.dadosBancariosAdiantamento.mci
          }
          // 68615 - Verificações adicionais em conta de adiantamento
          if (this.validandoDadosBancarios(this.dadosBancariosAdiantamento.agencia, this.dadosBancariosAdiantamento.conta)) {
            this.processarAlteracao(msg, rota, post)
          }
        }
      },
      processarAlteracao (msg, rota, post) {
        console.log('processarAlteracao', msg, rota, post)
        if (msg !== '' && rota !== '') {
          this.loading.tela = true
          this.$snotify.async(msg, {timeout: 0})
          axiosLaravel.post(rota, post).then((response) => {
            this.loading.tela = false
            this.$snotify.clear()
            this.$snotify.success('Alteração realizada!', {timeout: 1000})
            console.log(bloco + ' atualizado :: ', response.data)
            this.editar('')
            this.$router.go(0)
            this.$forceUpdate()
            this.historicoAlteracaoPeriodo = {}
          })
            .catch((error) => {
              this.loading.tela = false
              this.$snotify.clear()
              this.editar('')
              this.$root.trataErro(error)
            })
        }
      },
      cancelar (bloco) {
        if (bloco === 'coordenador' && !_.isNull(this.editandoBloco)) {
          this.proposta.ds_nome_coordenador = this.editandoBloco.ds_nome_coordenador
          this.proposta.ds_cpf_coordenador = this.editandoBloco.ds_cpf_coordenador
          this.proposta.ds_email_coordenador = this.editandoBloco.ds_email_coordenador
          this.proposta.ds_telefone_coordenador = this.editandoBloco.ds_telefone_coordenador
          this.proposta.ds_celular_coordenador = this.editandoBloco.ds_celular_coordenador
        }
        if (bloco === 'periodo_projeto') {
          this.proposta.nr_periodos = this.editandoBloco.nr_periodos
          this.dataFinalExecucao = this.editandoBloco.dt_data_final
          this.proposta.periodo_vigencia = this.editandoBloco.periodo_vigencia
          this.proposta.dt_data_vigencia = this.editandoBloco.dt_data_vigencia
        }
        if (bloco === 'publicos_alvo') {
          this.proposta.publicos_alvo = this.editandoBloco.publicos_alvo
        }
        if (bloco === 'metas') {
          this.proposta.metas = this.editandoBloco.metas
        }
        if (bloco === 'atividades') {
          this.proposta.atividades = this.editandoBloco.atividades
        }
        if (bloco === 'cronograma') {
          this.proposta.atividades = this.editandoBloco.cronograma
        }
        if (bloco === 'parcelas_adiantamento') {
          this.proposta.adiantamentos = this.editandoBloco['parcelas_adiantamento']
        }
        if (bloco === 'municipalizacao') {
          this.proposta.municipalizacao = this.editandoBloco['municipalizacao']
        }
        console.log('Cancelar ' + bloco, this.editandoBloco)
        //
        this.editar('')
        //
      },
      // Valida se todas as atividades tem itens
      validaAtividades () {
        let atividades = []
        this.proposta.objetivos.forEach((objetivo) => {
          if (objetivo.metas) {
            objetivo.goals.forEach((meta) => {
              if (meta.atividades) {
                meta.atividades.forEach((atividade) => {
                  atividades.push(atividade)
                })
              }
            })
          }
        })
        return atividades.every((atividade) => {
          return atividade.items ? atividade.items.length > 0 : false
        })
      },
      emitir (relatorio) {
        this.loading.tela = true
        let parametros = '<ECodEmp=1><ENumPrj=' + this.$route.params.numero + '>'
        if (relatorio === 222 || relatorio === 219) {
          parametros += ',<ESitPrj=ULT>'
        }
        if (relatorio === 222) {
          parametros += ',<EMosDes=S>'
        }
        this.$snotify.clear()
        this.$snotify.async('Gerando relatório ' + relatorio + '. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.post('relatorio-erp/emitir', {erpReport: {'ds_codigo': 'FJCF' + relatorio + '.GER'}, params: parametros}).then((response) => {
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
        if (!ie) {
          let blob = file
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = 'Relatório ' + relatorio + ' » ' + vm.proposta.ds_codigo_projeto_erp + ' - ' + vm.proposta.ds_nome
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } else {
          let blob = file
          let link = document.createElement('blob')
          link.href = window.navigator.msSaveOrOpenBlob(blob, item.name)
          link.download = 'Relatório ' + relatorio + ' » ' + vm.proposta.ds_codigo_projeto_erp + ' - ' + vm.proposta.ds_nome
          link.click()
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
      // 68615 - Verificações adicionais em conta de adiantamento
      validandoDadosBancarios (agenciaVal, contaVal) {
        console.log('Validando dados bancários - conta adiantamento')
        if (agenciaVal && contaVal) {
          let banco = '001'
          let conta = _.words(contaVal)
          let digitosConta = _.get(_.head(_.filter(this.listaBancos, ['codigo', banco])), 'caracteresConta') // Se tiver o tamanho da conta na lista de bancos então completa com zeros para o usuário não ter que fazer
          let contaSemDV = digitosConta ? _.padStart(conta[0], digitosConta, '0') : conta[0]
          let contaDV = conta[1] || ''

          let agencia = _.words(agenciaVal)
          let agenciaSemDV = agencia[0] || ''
          let agenciaDV = agencia[1] || ''
          console.log(agencia, conta)
          try {
            BankAccountValidator.validate({
              bankNumber: banco,
              agencyNumber: agenciaSemDV,
              agencyCheckNumber: agenciaDV,
              accountNumber: contaSemDV,
              accountCheckNumber: contaDV
            })
            return true
          } catch (e) {
            console.log('Erro na validação de dados bancários', e.message)
            this.$snotify.error(e.message)
            return false
          }
        }
        this.$snotify.error('Preencha o número da agência e conta corretamente antes de continuar ou clique em CANCELAR.')
        return false
      },
      limitarDigitosMCI () {
        if (this.dadosBancariosAdiantamento.mci.length > 9) {
          this.dadosBancariosAdiantamento.mci = this.dadosBancariosAdiantamento.mci.slice(0, 9)
        }
      },
      async consultaContaInterna () {
        console.log('CONSULTANDO CONTA INTERNA ', this.$route.params.numero)
        await axiosLaravel.get('conta-adiantamento/buscaContaInterna', {params: {codigoProjeto: this.$route.params.numero}}).then((response) => {
          let dadosFinanceiros = response.data[0]
          this.codFor = dadosFinanceiros.codfor
          this.bancoContaInterna = dadosFinanceiros.codban
          this.agenciaContaInterna = dadosFinanceiros.codage
          this.contaInterna = dadosFinanceiros.ccbfor
        })
      },
      // 66888/68639 - Alteracao de periodo de execucao do projeto
      refreshAlteracoes () {
        console.log('REFRESH ALTERACOES')
        this.refreshAlt++
      },
      consultaAcessoGerenteSolucoes () {
        this.acessoGerSolucoes = false
        if (this.usuarioLogado && Array.isArray(this.usuarioLogado.perfis)) {
          const perfis = this.usuarioLogado.perfis
          for (let i = 0; i < perfis.length; i++) {
            // console.log('ID PERFIL: ', perfis[i].id)
            if (perfis[i].id === 14) {
              this.acessoGerSolucoes = true
            }
          }
        }
        console.log('acesso GSOL: ', this.acessoGerSolucoes)
      },
      atualizaOpcoesAlteracoes () {
        this.loading.tela = true
        axiosLaravel.post('projeto/opcoes', {'id': this.proposta.id, 'opcoes': _.get(this.proposta, 'opcoes', [])}).then((response) => {
          this.$snotify.clear()
          this.$snotify.clear()
          this.loading.tela = false
        })
            .catch((error) => {
              this.loading.tela = false
              this.$root.trataErro(error)
            })
      }
    }
  }
</script>

<style scoped>
  .centralizado {
    text-align: center !important;
  }
  .botao_filtro {
    float: right !important;
  }
  .botao_filtro button {
    zoom: 0.7;
  }
  .botao_filtro .dropdown-menu {
    padding: 10px;
    width: max-content;
  }
  .botao_filtro li input, .botao_filtro li span {
    cursor: pointer;
  }
  .botao_filtro li span:hover {
    color: var(--cor-destaque-dark);
  }
  .limpar_filtro {
    font-size: small;
    color: var(--cor-fraca-dark);
    cursor: pointer;
    font-weight: normal;
  }
  .limpar_todos_filtros_processos {
    font-size: small;
    font-style: italic;
    color: var(--cor-destaque);
    cursor: pointer;
    float: right;
  }
  .limpar_todos_filtros_processos:hover, .limpar_filtro:hover {
    color: var(--cor-destaque-dark);
  }
  .limpar_todos_filtros_processos span i:nth-child(2), .limpar_filtro span i:nth-child(2) {
    font-size: x-small;
    left: 6px;
    top: 2px;
    color: tomato;
  }
  .contador_processos {
    font-size: small;
    font-style: italic;
    color: var(--cor-padrao-light);
    margin-left: 20px;
  }

  .opcaoAlterar {
    margin-left: 20px;
    vertical-align: middle;
  }

  .grupoMostrarOcultar {
    color: steelblue;
  }
  .grupoMostrarOcultar:hover {
    color: cornflowerblue;
    text-decoration: underline;
    cursor: pointer;
  }

  i.opcao:hover {
    color: white;
    background: gray;
    border: 0;
  }

  i.opcao {
    border: 1px solid #ddd;
    border-radius: 20px;
    padding: 5px;
    margin: 0 10px 0 0;
    font-size: 14px;
    min-width: 30px;
    text-align: center;
    cursor: pointer;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12) !important;
  }
  .opcao span {
    font-family: sans-serif, Arial, Verdana, "Trebuchet MS";
    padding-left: 5px;
  }
  .m0, .m0 table {
    margin: 0 !important;
  }

  .float{
    position:fixed;
    bottom:40px;
    z-index: 2;
    right:20px;
    color: #c1c1c1;
    text-align:center;
  }
  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .fa-question-circle {
    color: silver;
    cursor: default;
    font-size: x-large;
  }
  .fa-question-circle:hover {
    color: black
  }

  .listaDirigentes .cabecalho {
    font-weight: bold;
  }

</style>
