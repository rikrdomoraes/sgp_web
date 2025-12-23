<template>
  <div  v-if="!visibleForm"  class="content-wrapper" style="min-height: 870px;">
    <!-- ngView: --><div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
    <section class="content-header ng-scope">

      <vue-headful :title="'SGP - Solicitações'"/>

      <h1>Solicitações</h1>
      <b-breadcrumb :items="breadcrumb"/>
    </section>

    <!-- main content -->
    <section class="content ng-scope">

      <div class="row">
        <div class="col-md-12">
          <div v-if="((usuarioLogado.userType !== 'FUNDACAO') && possuiProcessoEmRevisao)" class="alert alert-warning" role="alert">
            <p><i class="fa fa-icon-warning-sign" aria-hidden="true"></i><strong>Atenção:</strong> as solicitações que estão em revisão pela entidade e não tiverem retorno para a Fundação BB serão canceladas automaticamente após 30 (trinta) dias a contar da data de devolução para revisão.</p>
          </div>
          <!-- grid -->
          <!-- ngIf: show.grid --><div class="ng-scope ng-isolate-scope"><div class="box box-primary">
          <div class="box-header with-border">
            <h3 class="box-title"><i class="fa fa-search" aria-hidden="true"></i> Consulta de Solicitações</h3>
          </div>
          <!-- /.box-header -->
          <div class="box-body" >
            <div class="row collapse in"  aria-expanded="true" aria-hidden="false" style="width: inherit; height: auto;">
            </div>
            <br>
            <div class="row">
            <div class="col-sm-3">
              <div class="btn-group dropdown">
                <div class="btn-group" v-if="_.find(_.get(usuarioLogado, 'configuracoes.acesso_projetos', [{ 'acesso': [{'codigo': 'INICIA_SOLICITACAO'}] }]), function (p) { return _.find(p.acesso, function (a) { return _.includes(['INICIA_SOLICITACAO'], a.codigo) }) })">
                    <!-- verifica se tem acessos definidos, se não tiver nada definido ou se tiver pelo menos um de iniciar solicitação, então mostra o botão -->
                  <g-button-ujarak color="dark-primary" size="button--size-ss"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-plus-circle" aria-hidden="true"></i>  Nova Solicitação </g-button-ujarak>
                  <ul class="dropdown-menu">
                    <li role="menuitem" v-if="$root.authorize('solicitacao-pagamento-editar') && !todasPropostasSimplificadas" class="ng-scope"><router-link :to="{name: 'solicitacao-pagamento', params: {visualizacao: false}}" ><i class="fa fa-angle-right"></i> Pagamento</router-link></li>
                    <li role="menuitem" v-if="$root.authorize('solicitacao-pagamento-editar') && !todasPropostasSimplificadas" class="ng-scope"><router-link :to="{name: 'solicitacao-ressarcimento', params: {visualizacao: false}}" ><i class="fa fa-angle-right"></i> Ressarcimento</router-link></li>
                    <li role="menuitem" v-if="$root.authorize('solicitacao-adiantamento-editar')" class="ng-scope"><router-link :to="{name: 'solicitacao-adiantamento'}" ><i class="fa fa-angle-right"></i> Adiantamento</router-link></li>
                    <li role="menuitem" v-if="$root.authorize('solicitacao-prestacaocontas-editar') && !todasPropostasSimplificadas" class="ng-scope"><router-link :to="{name: 'solicitacao-prestacaocontas', params: {visualizacao: false}}" ><i class="fa fa-angle-right"></i> Prestação de Contas</router-link></li>
                    <li role="menuitem" v-if="$root.authorize('solicitacao-devolucaoadiantamento-editar')" class="ng-scope"><router-link :to="{name: 'solicitacao-devolucao-adiantamento'}"><i class="fa fa-angle-right"></i> Devolução de Adiantamento</router-link></li>
                    <li role="menuitem" v-if="$root.authorize('solicitacao-contrapartida-editar')" class="ng-scope"><router-link :to="{name: 'solicitacao-contrapartida', params: {visualizacao: false}}" href="javascript:void(0)"><i class="fa fa-angle-right"></i> Contrapartida</router-link></li>

                    <li role="menuitem" v-if="$root.authorize('solicitacao-contrapartida-editar')" class="ng-scope"><router-link :to="{name: 'solicitacao-alteracoes-projeto', params: {visualizacao: false}}" href="javascript:void(0)"><i class="fa fa-angle-right"></i> Alterações em projeto</router-link></li>
                  </ul>
                </div>
              </div>
            </div>
              <!--Campo de pesquisa-->
              <div class="col-sm-offset-1 col-sm-4" style="margin-bottom: 1rem">
                <div class="input-group"
                     :title="'<h5 class=\'text-left\'>Pesquise por partes da informação ou combinação deles. Exemplos:<ul><li>Número ou parte do nome do projeto<li>Um ou mais tipos de solicitação<li>Situação da solicitação<li>Data, valor etc</ul></h5>'"
                     v-tippy="{ inertia : true, arrow : true,  animation : 'fade', distance:'1', size: 'large', placement: 'top'}">
                  <input v-model="pesquisa" @keyup.enter="onSearch" type="text" class="form-control ng-pristine ng-untouched ng-valid ng-empty" placeholder="Pesquisa..." autofocus>
                  <span class="input-group-btn">
                          <button @click="onSearch()" type="button" class="btn btn-default btn-flat"><i class="fa fa-search"></i>&nbsp;</button>
                    </span>
                </div>
              </div>
              <!-- 68772 Filtro de Situação de IDs -->
              <div class="col-md-2" v-if="usuarioLogado.userType === 'FUNDACAO'">
                <select v-model="situacaoFiltro" class="form-control" @change="filtrarSituacao">
                  <option :value="null" disabled>Situação</option>
                  <option value="FEITO">Feito</option>
                  <option value="CANCELADO">Cancelado</option>
                  <option value="EM_EXECUCAO">Em Execução</option>
                  <option value="TODOS">Todos</option>
                </select>
              </div>
              <!--Campo de pesquisa-->
              <div class="col-sm-1">
                <div class="legenda" :title="
                  '<table>' +
                      '<tr class=\'' + (usuarioLogado.userType !== 'FUNDACAO' ? 'hidden' : '') + '\'><td style=\'padding: 10px\'><span class=\'btn-primary\' style=\'font-size: 12px;padding: 10px;border-radius: 2px !important;width: 100px;float: right;\'><i class=\'fa fa-gavel\'></i> Validar</span></td><td style=\'font-size: 14px;text-align: left; padding: 10px; width: 480px\'>Atribui o processo a você e abre a solicitação para validação da tarefa.</td></tr>' +
                      '<tr><td style=\'padding: 10px\'><span class=\'button--moema warning\' style=\'font-size: 12px;padding: 10px;border-radius: 2px !important;width: 100px;float: right;\'><i class=\'fa fa-pencil-square-o\'></i> Revisar</span></td><td style=\'font-size: 14px;text-align: left; padding: 10px; width: 480px\'>Disponível a entidade para que revise a solicitação</td></tr>' +
                      '<tr class=\'' + (usuarioLogado.userType !== 'FUNDACAO' ? 'hidden' : '') + '\'><td style=\'padding: 10px\'><span class=\'btn-primary\' style=\'font-size: 12px;padding: 10px;border-radius: 2px !important;width: 100px;float: right;\'><i class=\'fa fa-undo\'></i> Reanalisar</span></td><td style=\'font-size: 14px;text-align: left; padding: 10px; width: 480px\'>Volta o processo para Análise se ele estiver na Autorização, mas ainda não atribuído ao gerente.</td></tr>' +
                      '<tr class=\'' + (usuarioLogado.userType !== 'FUNDACAO' ? 'hidden' : '') + '\'><td style=\'padding: 10px\'><span class=\'btn-primary\' style=\'font-size: 12px;padding: 10px;border-radius: 2px !important;width: 100px;float: right;\'><i class=\'fa fa-repeat\'></i> Retornar tarefa FBB</span></td><td style=\'font-size: 14px;text-align: left; padding: 10px; width: 480px\'>Volta o processo para Análise FBB quando ele está Em Revisão pela Entidade.</td></tr>' +
                      '<tr><td style=\'padding: 10px\'><span class=\'btn-danger\'  style=\'font-size: 12px;padding: 10px;border-radius: 2px !important;width: 100px;float: right;\'><i class=\'fa fa-times-circle\'></i> Cancelar</span></td><td style=\'font-size: 14px;text-align: left; padding: 10px; width: 480px\'>Cancela o processo atual e ele não será considerado no saldo do projeto</td></tr>' +
                      '<tr class=\'' + (usuarioLogado.userType !== 'FUNDACAO' ? 'hidden' : '') + '\'><td style=\'padding: 10px\'><span class=\'button--moema warning\' style=\'font-size: 12px;padding: 10px;border-radius: 2px !important;width: 100px;float: right;\'><i class=\'fa fa-play\'></i> Reativar</span></td><td style=\'font-size: 14px;text-align: left; padding: 10px; width: 480px\'>Se a solicitação estiver concluída, ela voltará para a execução na tarefa de Análise.</td></tr>' +
                      '<tr><td style=\'padding: 10px\'><span class=\'button--moema success\' style=\'font-size: 12px;padding: 10px;border-radius: 2px !important;width: 100px;float: right;\'><i class=\'fa fa-search\'></i> Visualizar</span></td><td style=\'font-size: 14px;text-align: left; padding: 10px; width: 480px\'>Abre janela para visualizar a solicitação feita ou cancelada</td></tr>' +
                      '<tr class=\'' + (usuarioLogado.userType !== 'FUNDACAO' ? 'hidden' : '') + '\'><td style=\'padding: 10px\'><span class=\'btn-primary\' style=\'font-size: 12px;padding: 10px;border-radius: 2px !important;width: 40px;float: right;\'><i class=\'fa fa-download\'></i></span></td><td style=\'font-size: 14px;text-align: left; padding: 10px; width: 480px\'>Fará download de um arquivo ZIP contendo todos os arquivos anexados na solicitação.</td></tr>' +
                      '<tr><td style=\'padding: 10px\'><span class=\'info\' style=\'font-size: 12px;padding: 10px;border-radius: 2px !important;width: 50px;float: right; color: #fff;\'>NF-e</span></td><td style=\'font-size: 14px;text-align: left; padding: 10px; width: 480px\'>Indica qual processo contém uma NF-e e permite fazer download em formato JSON</td></tr>' +
                    '</table>'"
                     v-tippy="{ inertia : true, arrow : true,  animation : 'fade', distance:'1', size: 'large', interactive: true, theme: 'light', position: 'top', maxWidth: '600px'}">
                  Legenda
                </div>
              </div>

            </div>
            <!-- /.row -->
            <br>
            <div class="row">
              <div class="col-sm-12">
                <b-container fluid>
                  <!-- Main table element -->
                  <b-table show-empty
                           stacked="md"
                           :bordered="bordered"
                           :items="items"
                           striped hover
                           :fields="fields"
                           :current-page="table.currentPage"
                           :per-page="table.perPage"
                           :filter="table.filter"
                           :sort-by.sync="table.sortBy"
                           :sort-desc.sync="table.sortDesc"
                           empty-text="Faça uma pesquisa acima"
                           table-layout: fixed
                           @filtered="onFiltered"
                  >
                    <template slot="data_solicitacao" scope="row">{{row.value | moment("L")}}</template>
                    <template slot="valor" scope="row">{{ parseFloat(row.value) | real}}</template>
                    <template slot="situacao" scope="row">{{row.value}} <br><span v-html="row.item.info"></span></template>
                    <template slot="actions" scope="row" :style="(usuarioLogado.userType !== 'FUNDACAO') ? 'width: 15%' : ''">
                      <div v-if="row.item.id">
                        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
                        <g-button-ujarak color="warning" size="button--size-ss" v-if="row.item.situacao !== 'Cancelado' && row.item.situacao !== 'Feito' && row.item.etapa === 'Revisão pela entidade' " :disabled="!authorizeEditRequest(row.item) || row.item.etapa !== 'Devolvido' || !chiefActive " @click.native="revisar(row.item)">
                          <i class="fa fa-pencil-square-o" aria-hidden="true"></i> Revisar
                        </g-button-ujarak >

                        <g-button-ujarak color="primary" size="button--size-ss" v-if="row.item.situacao === 'Em Execução' && row.item.etapa === 'Solicitação' " @click.native="revisar(row.item)">
                          <i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar
                        </g-button-ujarak >

                        <!-- Suporte 56596 -->
                        <g-button-ujarak color="dark-primary" size="button--size-ss" v-if="usuarioLogado.userType !== 'ENTIDADE' && row.item.etapa === 'Revisão pela entidade' && row.item.situacao != 'Cancelado' && !_.includes(['Alterações do Projeto'], row.item.tipo_solicitacao)" type="button" @click.native="segueRetornarTarefa(row.item)"
                                         :title="'<h6 style=\'text-align: left\'>' + 'A tarefa está Em Revisão pela entidade e será retornada para Análise da FBB' + '</h6>'" v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                                         v-confirm="{ok: retorno => segueRetornarTarefa(retorno, row.item), cancel: doNothing,
                                          message: 'Deseja <b>Retornar para a FBB</b> a solicitação de ' + '<font color=' + 'red' + '>' + row.item.tipo_solicitacao + '</font>' + '? <br><br> - ID: ' + '<i>' + '<font color=' + '#00008b' + '>' + row.item.id + '</font>' + '</i>'
                                           + '<br> - Projeto: ' + '<i>'  + '<font color=' + '#00008b' + '>' + row.item.projeto + '</font>' + '</i>' + '</i>'}"
                        >
                          <i class="fa fa-repeat" aria-hidden="true"></i> Retornar tarefa FBB
                        </g-button-ujarak>
                        <g-button-ujarak color="error" size="button--size-ss" v-if="showCancelButton(row.item)"
                                         v-confirm="{ok: retorno => cancelar(retorno, row.item), cancel: doNothing,
                                          message: 'Deseja <b>CANCELAR</b> a solicitação de ' + '<font color=' + 'red' + '>' + row.item.tipo_solicitacao + '</font>' + '? <br><br> - ID: ' + '<i>' + '<font color=' + '#00008b' + '>' + row.item.id + '</font>' + '</i>'
                                           + '<br> - Projeto: ' + '<i>'  + '<font color=' + '#00008b' + '>' + row.item.projeto + '</font>' + '</i>' + '</i>'}"
                                         type="button">
                          <i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar
                        </g-button-ujarak>

                        <span v-if="validaTipoFase(row.item) && autorizaValidacao(row.item) && usuarioLogado.userType === 'FUNDACAO'">
                          <g-button-ujarak color="primary" size="button--size-ss" type="button" v-on:click.native="onValidate(row.item)">
                            <i class="fa fa-gavel" aria-hidden="true"></i> Validar
                          </g-button-ujarak >

                          <g-button-ujarak color="primary" size="button--size-ss" type="button" v-on:click.native="segueReanalisar(row.item)"
                             v-if="(_.has(row.item, 'id_usuario') && _.isNull(row.item.id_usuario)) && row.item.etapa === 'Autorização' && row.item.situacao === 'Em Execução'">
                            <i class="fa fa-undo" aria-hidden="true"></i> Reanalisar
                          </g-button-ujarak >
                        </span>
                        <!-- ALTERAÇÃO DO BOTÃO PARA CORREÇÃO DE BUG COM TABELA E ORDENADOR PARA A OPÇÃO DE REATIVAÇÃO - SUPORTE 58248 - 05/01/2021 - AKIRA -->
                        <!-- USADO CLICK NATIVE PQ O V-CONFIRM CONFLITA COM DE DELEÇÃO -->
                        <!-- ALTERADO TIPO DE USUÁRIO APENAS PARA FUNDACAO -->
                        <!-- Suporte 62532 alteração no V-IF com include-->
                        <g-button-ujarak color="warning" size="button--size-ss"
                                         v-if="(_.includes(['Pagamento', 'Prestação de Contas', 'Adiantamento', 'Devolução de Adiantamento', 'Contrapartida', 'Ressarcimento'], row.item.tipo_solicitacao) && row.item.situacao === 'Feito') && usuarioLogado.userType == 'FUNDACAO' && acessoReativarLiberacaoRecursos"
                                         @click.native="solicitacaoReativar(row.item)"
                                         type="button" v-model="row.item.id">
                          <i class="fa fa-play" aria-hidden="true" /> Reativar
                        </g-button-ujarak>
                        <!-- 68448 - Voltar processo FEITO para APROVADO (Fase de liquidação) apenas em títulos processados em geração de remessa automática -->
                        <g-button-ujarak color="dark-primary" size="button--size-ss"
                                         v-if="(_.includes(['Pagamento', 'Adiantamento', 'Ressarcimento'], row.item.tipo_solicitacao) && row.item.situacao === 'Feito') && usuarioLogado.userType == 'FUNDACAO' && acessoReativarLiberacaoRecursos"
                                         @click.native="solicitacaoReativarRemessa(row.item)"
                                         type="button" v-model="row.item.id">
                          <i class="fa fa-repeat" aria-hidden="true" /> Reativar Liquidação
                        </g-button-ujarak>
                        <g-button-ujarak color="success" size="button--size-ss" v-if="row.item.tipo_solicitacao !== 'Migração'" type="button" @click.native="show(row)">
                          <i class="fa fa-search" aria-hidden="true"></i> Visualizar
                        </g-button-ujarak>

                        <g-button-ujarak :color="(_.has(row.item, 'downloading') ? 'light' : 'dark') + '-primary'" size="button--size-ss" @click.native="_.has(row.item, 'downloading') || onDownloadZIP(row.item)"
                           :title="'<h6 style=\'text-align: left\'>' + row.item.arquivos + '</h6>'" v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                           v-if="usuarioLogado.userType !== 'ENTIDADE' && !_.isNull(_.get(row.item, 'arquivos', null))">
                          <i v-if="_.has(row.item, 'downloading')" class="fa fa-refresh fa-spin"></i>
                          <i v-else class="fa fa-download" aria-hidden="true"></i>
                        </g-button-ujarak>

                      </div>
                      <!--<g-button-ujarak color="success" size="button&#45;&#45;size-ss" v-if="row.item.id < 50000" type="button" @click.native="show(row)">-->
                      <!--<i class="fa fa-search" aria-hidden="true"></i> Visualizar-->
                      <!--</g-button-ujarak>-->
                      <div class="modal-content" style="z-index: 10000">
                        <modal name="visualizar" width="70%" height="auto" :scrollable="true" class="topo modal-wrapper">
                          <div class="box-header with-border">
                            <h3 class="box-title"><i class="fa fa-caret-right" aria-hidden="true"></i> Consulta: Solicitação de {{textoTipo}}</h3>
                            <div align="right">
                            <!--<button type="button" data-dismiss="alert" aria-hidden="true" class="btn btn-primary btn-flat" @click="hide()"><span>Fechar</span></button>-->
                            <b-button type="button" data-dismiss="alert" aria-hidden="true" class="btn btn-warning btn-sm btn-flat" @click="hide()"><i class="fa fa-close" aria-hidden="true"></i>  Fechar </b-button>
                            </div>
                          </div>
                          <div  class="row" >
                            <div class="col-sm-12" >
                              <form name="frmSearch" novalidate>
                                <div class="form-group required" >
                                  <div class="col-md-6 col-md-offset-1">
                                    <dl class="proposal-definition-list">
                                      <dt>Projeto: </dt>
                                      <dd>{{num}} - {{prop}}</dd>

                                      <dt>Tipo de Solicitação:</dt>
                                      <dd><span>{{textoTipo}}</span></dd>
                                    </dl>
                                  </div>

                                  <div class="col-md-5">
                                    <dl class="proposal-definition-list">
                                      <dt>Etapa: </dt>
                                      <dd>{{etapaHist}}</dd>

                                      <dt>Situação:</dt>
                                      <dd><span>{{situacao}}</span></dd>
                                    </dl>
                                  </div>

                                </div>
                              </form>
                            </div>
                          </div>
                          <div  class="row" v-if="textoTipo === 'Adiantamento' && situacao !== 'Cancelado'">
                            <div class="col-sm-12">
                              <form name="frmSearch" novalidate>
                                <div class="form-group required" >
                                  <div class="col-md-6 col-md-offset-1">
                                    <dl class="proposal-definition-list">
                                      <dt>Dados Bancários: </dt>
                                      <dd><span>Banco: {{dadosBancariosAdiantamento.banco}}</span></dd>
                                      <dd><span>Agência/Conta: {{dadosBancariosAdiantamento.agencia}} / {{dadosBancariosAdiantamento.conta}}</span></dd>
                                      <dd><span>Tipo de Conta: {{dadosBancariosAdiantamento.tipo == 1 ? 'Conta Corrente' : 'Conta Poupança'}}</span></dd>
                                    </dl>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-12">
                              <div class="box-body">
                                <div class="box-header with-border"  v-if="textoTipo === 'Pagamento' || textoTipo === 'Ressarcimento' || textoTipo === 'Contrapartida' || textoTipo === 'Prestação de Contas'">
                                  <h3 class="box-title">Cronograma Físico-Financeiro</h3>
                                </div>
                                <!--<cronograma-solicitacao-contrapartida :propsNota="nota" :propsProjeto="projeto" :propsEtapa="etapa"></cronograma-solicitacao-contrapartida>-->
                                <div class="box-header with-border"  v-if="textoTipo === 'Devolução de Adiantamento' || textoTipo === 'Prestação de Contas'">
                                  <!-- form: Financial Physical Schedule -->
                                  <div class="row" >
                                    <div class="box-header with-border">
                                      <h3 class="box-title">Solicitações concedidas</h3>
                                    </div>
                                    <div class="col-sm-12">
                                      <!-- grid -->
                                      <div class="table-responsive" >
                                        <table class="table table-condensed table-bordered table-striped">
                                          <thead style="text-align: center;">
                                          <tr>
                                            <td>ID</td>
                                            <td>Processo de solicitação em andamento</td>
                                            <td>Valor liberado</td>
                                            <td>Valor não solicitado</td>
                                            <td>Data limite para prestação de contas</td>
                                            <td>Data da última prestação de contas</td>
                                          </tr>
                                          </thead>
                                          <tbody>
                                          <tr v-repeat="adiantamento">
                                            <td
                                              class="text-center">{{adiantamento.id}}</td>
                                            <td data-title="'Processo de solicitação em andamento'" sortable="'projectName'"
                                                class="text-center">{{adiantamento.projectName +' - '+ adiantamento.createDate}}</td>
                                            <td data-title="'Valor liberado'" sortable="'valueReleased'"
                                                class="text-center">{{adiantamento.totalValue | real}}</td>
                                            <td data-title="'Valor não solicitado'" sortable="'totalValueBalance'"
                                                class="text-center">{{adiantamento.totalValueBalance | real }}</td>
                                            <td data-title="'Data limite para prestação de contas'" sortable="'datLimAcc'"
                                                class="text-center">{{adiantamento.limitDate}}</td>
                                            <td data-title="'Data da última prestação de contas'" sortable="'lastDatLimAcc'"
                                                class="text-center">{{adiantamento.lastParcelDate || adiantamento.data_ultima_prestacao}}</td>
                                            <!--<td data-title="'Visualização'" ng-if="!grantedSolicCtrl.hideSnapshot" class="text-center">-->
                                            <!--<button type="button" ng-click="grantedSolicCtrl.openGrantedSnapshotModal(o.eventId, o.discriminator)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-search" aria-hidden="true"></i></button>-->
                                            <!--</td>-->
                                          </tr>
                                          </tbody>
                                          <tr v-show="(adiantamento.length === 0)">
                                            <td colspan="100%" class="text-center">Nenhum registro encontrado!</td>
                                          </tr>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="row" style="overflow:auto;">
                                  <div class="col-md-12 financial-physical-schedule" align="center" v-if="textoTipo === 'Pagamento' || textoTipo === 'Ressarcimento' ||  textoTipo === 'Contrapartida' || textoTipo === 'Prestação de Contas'  ">
                                    <table class="table table-condensed table-bordered">
                                      <thead>
                                      <tr>
                                        <th>Item</th>
                                        <th v-if="textoTipo === 'Pagamento' || textoTipo === 'Ressarcimento'">Tipo</th>
                                        <th>Quantidade</th>
                                        <th>Valor Total</th>
                                        <th>Quantidade a solicitar</th>

                                        <!-- Titulos referentes ao campo 'quantityRequest' -->
                                        <th>Valor a solicitar</th>
                                        <th v-if="textoTipo == 'Contrapartida'">Economicidade</th>

                                        <th uib-tooltip="Quantidade a comprovar calculada a partir do somatório de todas as solicitações aprovadas ou em andamento"
                                            tooltip-append-to-body="true">Quantidade a comprovar</th>

                                        <!-- Titulos referentes ao campo 'quantityProve' -->
                                        <th uib-tooltip="Valor a comprovar calculado a partir do somatório de todas as solicitações aprovadas ou em andamento"
                                            tooltip-append-to-body="true">Valor a comprovar</th>

                                      </tr>
                                      </thead>
                                      <tbody class="overlay">
                                      <tr v-for="(item, index) in montaCronograma" :item="item" :key="index">
                                        <!--Suporte 61159 mostrar o Item_Observacao para todos os tipos de solicitacao -->
                                        <!--<td>{{item.Item}} - {{item.Item_Descricao}}<br><div v-if="textoTipo === 'Contrapartida'">#{{item.Id_item}} {{item.Item_Observacao}}</div></td>-->
                                        <td>{{item.Item}} - {{item.Item_Descricao}}<br><div>#{{item.Id_item}} {{item.Item_Observacao}}</div></td>
                                        <td v-if="textoTipo === 'Pagamento' || textoTipo === 'Ressarcimento'">{{item.Item_Tipo}}</td>
                                        <td class="text-right">{{item.Qtde_orcado}}</td>
                                        <td class="text-right">{{parseFloat(item.Valor_orcado) | real}}</td>
                                        <td class="text-right">{{item.Qtde_solicitado}}</td>
                                        <td class="text-right">{{parseFloat(item.Valor_solicitado) | real}}</td>

                                        <td v-if="textoTipo == 'Contrapartida'" class="text-center">
                                          <label class="checkbox-inline new-control new-control-checkbox" style="margin-bottom: 10px;">
                                            <input :disabled="true" type="checkbox"  v-model="item.Economicidade" :true-value="1" >
                                            <div class="new-control-indicator"></div>
                                          </label>
                                        </td>

                                        <td class="text-right">{{item.Qtde_saldo}}</td>
                                        <td class="text-right">{{parseFloat(item.Valor_saldo) | real}}</td>

                                      </tr>
                                      </tbody>
                                      <tfoot>
                                      <!--<tr ng-if="finPhySchSolCtrl.solicitation == 'PAYMENT' || finPhySchSolCtrl.solicitation == 'COUNTERPART'">-->
                                      <!--<td colspan="{{finPhySchSolCtrl.colspanTitle}}" style="border-right: none;">Valor total de recursos contratados: </td>-->
                                      <!--<td colspan="{{finPhySchSolCtrl.colspanValue}}" class="text-right" style="border-left: none;">{{finPhySchSolCtrl.totais.valor_total_contratado | currency}}</td>-->
                                      <!--<td></td>-->
                                      <!--</tr>-->

                                      <tr>
                                        <td colspan="4" style="border-right: none;" >Valor total da solicitação: </td>
                                        <td colspan="4" class="text-right" style="border-left: none;">{{parseFloat(valorTotal) | real}}</td>
                                      </tr>

                                      <!--<tr ng-if="finPhySchSolCtrl.solicitation == 'PAYMENT' || finPhySchSolCtrl.solicitation == 'COUNTERPART'">-->
                                      <!--<td colspan="{{finPhySchSolCtrl.colspanTitle}}" style="border-right: none;">Saldo restante do projeto: </td>-->
                                      <!--<td colspan="{{finPhySchSolCtrl.colspanValue}}" class="text-right" style="border-left: none;">{{finPhySchSolCtrl.totais.saldo_restante_projeto - finPhySchSolCtrl.calculates.totalSolicitation | currency}}</td>-->

                                      <!--<td></td>-->
                                      <!--</tr>-->

                                      </tfoot>
                                    </table>

                                  </div>
                                </div>
                                <!-- RLMB -->
                                <div class="row" style="overflow:auto;" v-if="textoTipo === 'Adiantamento'">
                                  <div class="box-header with-border">
                                    <h3 class="box-title"> Solicitação de Adiantamento
                                    </h3>
                                  </div>
                                  <div class="col-md-12 financial-physical-schedule">
                                    <table align="center" class="table table-condensed table-bordered">
                                      <thead>
                                      <tr>
                                        <th>Parcela</th>
                                        <th>Recurso</th>
                                        <th>Fase</th>
                                        <th>Valor total por fase</th>
                                        <th>Valor a solicitar por fase</th>
                                        <th>Saldo restante por fase</th>
                                      </tr>
                                      </thead>
                                      <tbody>
                                      <tr v-for="(item, index) in itemAdt" disabled="true" :key="index">
                                        <td>{{item.parcela}}</td>
                                        <td>{{item.origem}}</td>
                                        <td>{{item.origem === 1 ? 'FUNDACAO' : 'PARCEIRO ESTRATÉGICO'}}</td>
                                        <td>{{item.valor | real}}</td>
                                        <td>{{vlrAdt | real}}</td>
                                        <td>{{item.valor  - (vlrAdt) | real}}</td>
                                      </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div class="box-body">
                              <div v-if="textoTipo === 'Pagamento' || textoTipo === 'Ressarcimento' ||textoTipo === 'Prestação de Contas'">
                                <br><br>
                              </div>
                              <fieldset disabled="true">
                                <div v-if="textoTipo === 'Pagamento' || textoTipo === 'Ressarcimento' || textoTipo === 'Prestação de Contas'">
                                  <div class="box-header with-border">
                                    <h3 class="box-title">Documento fiscal</h3>
                                  </div>
                                  <br>
                                  <div class="row" >
                                    <div class="col-md-6">
                                      <!-- payment -->
                                      <div>
                                        <label for="numero" class="control-label col-md-4">Número nota fiscal:</label>
                                        <div class="col-md-7 ">
                                          <input id="numero" v-model="numero" name="numero" class="form-control text-right"
                                                 type="text" maxlength="20" disabled="true">
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-md-6">
                                      <!-- issueDate -->
                                      <div>
                                        <label id="emissao" for="emissao" class="control-label col-md-4">Data de emissão do documento:</label>
                                        <div class="col-md-7 ">
                                          <input name="emissao" v-model="emissao"
                                                 type="date" class="form-control"/>
                                        </div>
                                      </div>
                                    </div>
                                    <br><br><br>
                                  </div>
                                  <div class="col-md-6">
                                    <div>
                                      <label for="serie" class="control-label col-md-4">Série:</label>
                                      <div class="col-md-7 ">
                                        <select id="serie" v-model="serie" class="form-control" name="serie" required>
                                          <option value="NOTA_FISCAL">1 - Nota fiscal</option>
                                          <option value="RECIBO_PAGAMENTO_AUTONOMO">10 - Recibo de pagamento a autônomo</option>
                                          <option value="DOCUMENTO_NAO_FISCAL">DNF - Documento não fiscal</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="col-md-6" v-if="validade">
                                    <div>
                                      <label for="validade" class="control-label col-md-4">Data de validade do documento:</label>
                                      <div class="col-md-7 ">
                                        <input id="validade" name="expirationDate" v-model="validade"
                                               type="date" class="form-control"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </fieldset>
                              <div v-if="textoTipo === 'Pagamento' || textoTipo === 'Ressarcimento' ||textoTipo === 'Prestação de Contas'  ">
                                <br><br>
                              </div>
                              <fieldset disabled="true">
                                <div v-if="textoTipo === 'Pagamento' || textoTipo === 'Ressarcimento' ||textoTipo === 'Prestação de Contas'  ">
                                  <div class="box-header with-border">
                                    <h3 class="box-title">Forma de Pagamento</h3>
                                  </div>
                                  <br>
                                  <div class="row" >
                                    <div class="col-md-6">
                                      <!-- payment -->
                                      <div>
                                        <label for="forma" class="control-label col-md-4">Forma de pagamento:</label>
                                        <div class="col-md-7 ">
                                          <input id="forma" v-model="forma" name="forma" class="form-control text-right"
                                                 type="text" maxlength="20" disabled="true">
                                        </div>
                                      </div>
                                    </div>

                                    <div class="col-md-6">
                                      <!-- paymentPriority -->
                                      <div>
                                        <label for="prioridade" class="control-label col-md-4">Pagamento Prioritário:</label>
                                        <div class="col-md-7 ">
                                          <input id="prioridade" v-model="prioridade" name="prioridade" class="form-control text-right"
                                                 type="text" maxlength="20" ng-disabled="true">
                                        </div>
                                      </div>
                                    </div></div>
                                </div>
                              </fieldset>
                              <div v-if="textoTipo === 'Pagamento' || textoTipo === 'Ressarcimento' ||textoTipo === 'Prestação de Contas'  ">
                                <br><br>
                              </div>
                              <fieldset disabled="true">
                                <div v-if="textoTipo === 'Pagamento' || textoTipo === 'Ressarcimento' ||textoTipo === 'Prestação de Contas'  ">
                                  <div class="box-header with-border">
                                    <h3 class="box-title">Fornecedor</h3>
                                  </div>
                                  <br>
                                  <div class="row" >
                                    <div class="col-md-6">
                                      <!-- payment -->
                                      <div>
                                        <label for="tipoPessoa" class="control-label col-md-4">Tipo de pessoa:</label>
                                        <div class="col-md-7 ">
                                          <input id="tipoPessoa" v-model="tipoPessoa" name="fornecedorTipo" class="form-control text-right"
                                                 type="text" maxlength="20">
                                        </div>
                                      </div>
                                    </div>

                                    <div class="col-md-6">
                                      <!-- paymentPriority -->
                                      <div>
                                        <label class="control-label col-md-4">{{texto}}</label>
                                        <div class="col-md-7 ">
                                          <!--<input v-model="fornecedor.identificador" name="nomeFornecedor" class="form-control text-right"-->
                                                 <!--type="text" maxlength="20" disabled="true">-->
                                          <span v-if="fornecedor.identificador.length > 11">{{fornecedor.identificador | cnpj}}</span>
                                          <span v-else>{{fornecedor.identificador | cpf}}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <br><br>
                                    <div class="col-md-6">
                                      <!-- payment -->
                                      <div>
                                        <label for="nomeFornecedor" class="control-label col-md-4">Nome:</label>
                                        <div class="col-md-7 ">
                                          <input id="nomeFornecedor" v-model="nomeFornecedor" name="nomeFornecedor" class="form-control text-right"
                                                 type="text" maxlength="20" disabled="true">
                                        </div>
                                      </div>
                                    </div>

                                    <div class="col-md-6">
                                      <!-- paymentPriority -->
                                      <div>
                                        <label for="endereco" class="control-label col-md-4">Endereço:</label>
                                        <div class="col-md-7 ">
                                          <input id="endereco" v-model="endereco" name="endereco" class="form-control text-right"
                                                 type="text" maxlength="20" disabled="true">
                                        </div>
                                      </div>
                                    </div>
                                    <br><br>
                                    <div class="col-md-6">
                                      <!-- payment -->
                                      <div>
                                        <label for="cep" class="control-label col-md-4">CEP:</label>
                                        <div class="col-md-7 ">
                                          <input id="cep" v-model="cep" name="cep" class="form-control text-right" v-mask="['#####-###']"
                                                 type="text" maxlength="20" disabled="true">
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </fieldset>
                            </div>
                            <br><br><br>
                            <div v-if="textoTipo === 'Pagamento' || textoTipo === 'Ressarcimento' ||textoTipo === 'Prestação de Contas'">
                              <br><br>
                            </div>
                            <fieldset disabled="true">
                              <div v-if="_.includes(['Pagamento', 'Ressarcimento'], textoTipo) && (banco !== 0)">
                                <div class="box-header with-border">
                                  <h3 class="box-title">Dados bancários</h3>
                                </div>
                                <br>
                                <div class="row" >
                                  <div class="col-md-6">
                                    <!-- payment -->
                                    <!--<div>-->
                                    <!-- ALTERAÇÃO REALIZADA EM 23/12/2020 POR AKIRA - SUPORTE 59454-->
                                    <label class="control-label col-md-4">Banco:</label>
                                    <div class="col-md-7 ">
                                      <select name="banco" class="form-control" for="banco" v-model="banco">
                                        <option disabled>Escolha um banco</option>
                                        <option v-for="banco in bancosMain" v-bind:value="banco.value" >{{banco.value + ' - ' + banco.label}}</option>
                                        <option disabled>--------------------------------------------------------------------------</option>
                                        <option v-for="banco in bancos" v-bind:value="banco.value" >{{banco.value + ' - ' + banco.label}}</option>
                                      </select>
                                      <!--<input v-model="banco" name="banco" class="form-control text-right"-->
                                      <!--type="text" maxlength="20" ng-disabled="true">-->
                                    </div>
                                    <!--</div>-->
                                  </div>

                                  <div class="col-md-6">
                                    <!-- paymentPriority -->
                                    <div>
                                      <label for="agencia" class="control-label col-md-4">Agência:</label>
                                      <div class="col-md-7 ">
                                        <input id="agencia" v-model="agencia" name="agencia" pattern="/[0-9]{4}\-{1}[0-9X]/" class="form-control text-right"
                                               type="text" maxlength="20" ng-disabled="true">
                                      </div>
                                    </div>
                                  </div>
                                  <br><br>
                                  <div class="col-md-6">
                                    <!-- payment -->
                                    <div>
                                      <label for="conta" class="control-label col-md-4">Conta Corrente:</label>
                                      <div class="col-md-7 ">
                                        <input id="conta" v-model="conta" name="conta" class="form-control text-right" pattern="/[0-9]{1,11}\-{1}([0-9]{1,2}$|\X{1}$)/"
                                               type="text" maxlength="20" ng-disabled="true">
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </fieldset>
                            <br><br>
                            <div v-if="_.includes(['Pagamento', 'Ressarcimento', 'Prestação de Contas', 'Contrapartida'], textoTipo) ">
                              <br><br>
                            </div>
                            <div class="col-md-12" v-if="_.includes(['Pagamento', 'Ressarcimento', 'Prestação de Contas', 'Contrapartida'], textoTipo) ">
                              <fieldset disabled="true">
                                <div class="box-header with-border">
                                  <h3 class="box-title">Documentos de solicitação de {{textoTipo}}</h3>
                                </div>
                                <br>
                                <div class="row" >
                                  <upload-documentos-php name="declaracao" :propDocumentos="documentosAnexo" :documentTypes="[]"></upload-documentos-php>
                                </div>
                              </fieldset>
                            </div>
                            <div class="col-md-12 financial-physical-schedule" v-if="textoTipo === 'Adiantamento' || textoTipo === 'Devolução de Adiantamento'">
                              <fieldset disabled="true">
                                <div class="box-header with-border">
                                  <h3 class="box-title">Documentos de solicitação de {{textoTipo}}</h3>
                                </div>
                                <br>
                                <div class="row" >
                                  <upload-documentos-php name="declaracao" :propDocumentos="documentosAnexo" :documentTypes="[]"></upload-documentos-php>
                                </div>
                              </fieldset>
                              <div align="center">
                                <!--<button type="button" class="btn btn-primary" @click="hide()" data-dismiss="modal">Fechar</button>-->
                              </div>
                            </div>
                            <div class="col-md-12">
                                <div class="box box-widget" v-if="historicoBack && !_.isNull(historicoBack) && !_.isEmpty(historicoBack)">
                                  <div class="box-header with-border">
                                    <h3 class="box-title">Histórico de solicitação</h3>
                                  </div>
                                    <historico-solicitacao-pagamento v-if="historicoBack && !_.isNull(historicoBack) && !_.isEmpty(historicoBack)" :propsValidacao="validacao" :propsHistorico="historicoBack" :key="historicoBack"></historico-solicitacao-pagamento>
                                </div>
                              <div class="text-left box-header" v-if="dataMenor === true || (!historicoBack || _.isNull(historicoBack) || _.isEmpty(historicoBack))">
                                <a href="" v-if="esconderHistorico === false" @click.prevent="esconderHistorico = true"><i class="fa fa-caret-down" aria-hidden="true"></i> Mostrar histórico antigo</a>
                                <a href="" v-if="esconderHistorico === true" @click.prevent="esconderHistorico = false"><i class="fa fa-caret-up" aria-hidden="true"></i> Ocultar histórico antigo</a>
                              </div>
                              <div class="col-md-8" v-if="esconderHistorico === true && dataMenor === true  || (!historicoBack || _.isNull(historicoBack) || _.isEmpty(historicoBack))">
                                <div class="box box-widget">
                                  <div class="box-header with-border">
                                    <h3 class="box-title">Histórico Antigo</h3>
                                  </div>
                                  <historico-antigo :propsValidacao="validacao" :propsHistorico="historicoAnt" :key="historicoAnt"></historico-antigo>
                                </div>
                              </div>
                            </div>
                          </div>
                          <!--<div align="center;">-->
                          <!--<button type="button" class="btn btn-white" @click="hide()" data-dismiss="modal">Fechar</button>-->
                          <!--</div>-->
                        </modal>
                      </div>
                      <!--<visualizar ref="modal"></visualizar>-->
                    </template>
                  </b-table>

                  <b-row>
                    <b-col md="8" class="my-1" right>
                      <b-pagination :total-rows="table.totalRows" :per-page="table.perPage" v-model="table.currentPage" class="my-3" />
                    </b-col>
                  </b-row>


                </b-container>
                <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                  <i class="fa fa-refresh fa-spin"></i>
                </div>
                <!--v-show="loading.show"-->

              </div>
              <!-- /.col -->
            </div>
            <!-- /.row -->
          </div>
          <!-- /.box-body -->
        </div>
          <!-- /.box -->
        </div><!-- end ngIf: show.grid -->

        </div>
        <!-- /.col -->


      </div>
      <!-- /.row -->

    </section>
    <!-- /.content -->
  </div>
  </div>
  <div v-else-if="visibleForm">
    <fieldset v-if="_.includes(['Pagamento', 'Ressarcimento'], textoTipo)">
      <form-validacao-pagamento :propsNota="nota" :propsValidacao="validacao" :propsHistorico="historicoTarefas"></form-validacao-pagamento>
    </fieldset>
    <fieldset v-if="textoTipo === 'Contrapartida'">
      <form-validacao-contrapartida :propsNota="nota" :propsValidacao="validacao"></form-validacao-contrapartida>
    </fieldset>
    <fieldset v-if="textoTipo === 'Prestação de Contas'">
      <form-validacao-prestacao-contas :propsNota="nota" :propsValidacao="validacao"></form-validacao-prestacao-contas>
    </fieldset>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  import visualizar from '../solicitacoes/modulos/visualizar'
  import UploadDocumentosPhp from '../modules/uploadDocumentosPhp'
  import formValidacaoPagamento from '../solicitacoes/pagamento/formValidacaoPagamento'
  import formValidacaoContrapartida from '../solicitacoes/contrapartida/formValidacaoContrapartida'
  import HistoricoSolicitacaoPagamento from '../solicitacoes/modulos/historicoSolicitacaoPagamento'
  import HistoricoAntigo from '../solicitacoes/modulos/historicoAntigo'
  export default {
    components: {
      visualizar,
      formValidacaoPagamento,
      formValidacaoContrapartida,
      UploadDocumentosPhp,
      HistoricoSolicitacaoPagamento,
      HistoricoAntigo
    },
    name: 'ListaSolicitacao',
    data () {
      return {
        idAdiantamento: null,
        todasPropostasSimplificadas: true,
        dadosBancariosAdiantamento: {
          banco: null,
          agencia: null,
          conta: null,
          tipo: null
        },
        dataCorte: '2020-12-10',
        data: [],
        dataMenor: false,
        items: [],
        pesquisa: '',
        listaHistorico: [],
        adt: {},
        adiant: [],
        nota: {},
        validacao: {},
        adiantamento: {},
        montaCronograma: [],
        esconderHistorico: false,
        visibleForm: false,
        filtros: {
          createdAt: null,
          createdAtDate: null,
          entityId: null,
          project: null,
          requestType: null
        },
        dadosHistorico: {
          fk_processo: null,
          id: null,
          fk_usuario: null,
          nome: null,
          situacao: 'PADRAO',
          inicio: null,
          termino: null,
          data_edicao: null,
          tipo: null,
          proxima_etapa: null,
          etapa_anterior: null,
          observacao: null
        },
        prop: null,
        num: null,
        etapa: null,
        etapaHist: null,
        projeto: null,
        textoTipo: null,
        loading: {
          show: false
        },
        historicoAnt: [],
        historicoBack: [],
        bordered: true,
        fields: [
          { key: 'id', label: 'ID', sortable: true, thStyle: 'width: 5%; text-align: center', class: 'text-center' },
          { key: 'tipo_solicitacao', label: 'Tipo de Solicitação', sortable: true, thStyle: 'width: 6%; text-align: center', class: 'text-center' },
          { key: 'projeto', label: 'Projeto', sortable: true, thStyle: 'width: 34%; text-align: center', class: 'centraliza' },
          { key: 'data_solicitacao', label: 'Data de Solicitação', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
          { key: 'valor', label: 'Valor', thStyle: 'text-align: center', class: 'text-center' },
          { key: 'etapa', label: 'Etapa', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
          { key: 'situacao', label: 'Situação', thStyle: 'text-align: center', class: 'text-center', sortable: true },
          { key: 'actions', label: 'Ações', thStyle: 'width: 25%; text-align: center', class: 'text-center' }
        ],
        table: {
          currentPage: 0,
          perPage: 10,
          totalRows: 0,
          sortBy: 'id',
          sortDesc: true,
          filter: null,
          emptyText: 'Não tem nenhum registro para mostrar'
        },
        store: this.$store,
        breadcrumb: [{
          text: 'Inicial',
          href: '/'
        }, {
          text: 'Solcitações',
          active: true
        }],
        possuiProcessoEmRevisao: false,
        situacaoFiltro: null,
        listaBackupFiltro: [],
        bancosMain: [{value: '001', label: 'Banco do Brasil S.A.'},
          {value: '033', label: 'BANCO SANTANDER (BRASIL) S.A.'},
          {value: '070', label: 'BRB – BANCO DE BRASILIA S.A.'},
          {value: '104', label: 'CAIXA ECONOMICA FEDERAL'},
          {value: '237', label: 'Banco Bradesco S.A.'},
          {value: '341', label: 'ITAÚ UNIBANCO S.A.'}],
        bancos: [{value: '332', label: 'Acesso Soluções de Pagamento S.A.'},
          {value: '117', label: 'ADVANCED CORRETORA DE CÂMBIO LTDA'},
          {value: '272', label: 'AGK CORRETORA DE CAMBIO S.A.'},
          {value: '349', label: 'AL5 S.A. CRÉDITO, FINANCIAMENTO E INVESTIMENTO'},
          {value: '313', label: 'AMAZÔNIA CORRETORA DE CÂMBIO LTDA.'},
          {value: '188', label: 'ATIVA INVESTIMENTOS S.A. CORRETORA DE TÍTULOS, CÂMBIO E VALORES'},
          {value: '280', label: 'Avista S.A. Crédito, Financiamento e Investimento'},
          {value: '080', label: 'B&T CORRETORA DE CAMBIO LTDA.'},
          {value: '246', label: 'Banco ABC Brasil S.A.'},
          {value: '075', label: 'Banco ABN Amro S.A.'},
          {value: '121', label: 'Banco Agibank S.A.'},
          {value: '025', label: 'Banco Alfa S.A.'},
          {value: '065', label: 'Banco AndBank (Brasil) S.A.'},
          {value: '213', label: 'Banco Arbi S.A.'},
          {value: '096', label: 'Banco B3 S.A.'},
          {value: '024', label: 'Banco Bandepe S.A.'},
          {value: '330', label: 'BANCO BARI DE INVESTIMENTOS E FINANCIAMENTOS S.A.'},
          {value: '318', label: 'Banco BMG S.A.'},
          {value: '752', label: 'Banco BNP Paribas Brasil S.A.'},
          {value: '107', label: 'Banco Bocom BBM S.A.'},
          {value: '063', label: 'Banco Bradescard S.A.'},
          {value: '036', label: 'Banco Bradesco BBI S.A.'},
          {value: '122', label: 'Banco Bradesco BERJ S.A.'},
          {value: '394', label: 'Banco Bradesco Financiamentos S.A.'},
          {value: '218', label: 'Banco BS2 S.A.'},
          {value: '208', label: 'Banco BTG Pactual S.A.'},
          {value: '626', label: 'BANCO C6 CONSIGNADO S.A.'},
          {value: '336', label: 'Banco C6 S.A.'},
          {value: '473', label: 'Banco Caixa Geral – Brasil S.A.'},
          {value: '412', label: 'BANCO CAPITAL S.A.'},
          {value: '040', label: 'Banco Cargill S.A.'},
          {value: '266', label: 'BANCO CEDULA S.A.'},
          {value: '739', label: 'Banco Cetelem S.A.'},
          {value: '233', label: 'Banco Cifra S.A.'},
          {value: '745', label: 'Banco Citibank S.A.'},
          {value: '241', label: 'BANCO CLASSICO S.A.'},
          {value: '756', label: 'BANCO COOPERATIVO DO BRASIL S.A. – BANCOOB'},
          {value: '748', label: 'BANCO COOPERATIVO SICREDI S.A.'},
          {value: '222', label: 'BANCO CRÉDIT AGRICOLE BRASIL S.A.'},
          {value: '505', label: 'Banco Credit Suisse (Brasil) S.A.'},
          {value: '069', label: 'Banco Crefisa S.A.'},
          {value: '368', label: 'Banco CSF S.A.'},
          {value: '003', label: 'BANCO DA AMAZONIA S.A.'},
          {value: '083', label: 'Banco da China Brasil S.A.'},
          {value: '707', label: 'Banco Daycoval S.A.'},
          {value: '300', label: 'Banco de la Nacion Argentina'},
          {value: '495', label: 'Banco de La Provincia de Buenos Aires'},
          {value: '654', label: 'BANCO DIGIMAIS S.A.'},
          {value: '335', label: 'Banco Digio S.A.'},
          {value: '047', label: 'Banco do Estado de Sergipe S.A.'},
          {value: '037', label: 'Banco do Estado do Pará S.A.'},
          {value: '041', label: 'Banco do Estado do Rio Grande do Sul S.A.'},
          {value: '004', label: 'Banco do Nordeste do Brasil S.A.'},
          {value: '265', label: 'Banco Fator S.A.'},
          {value: '224', label: 'Banco Fibra S.A.'},
          {value: '094', label: 'Banco Finaxis S.A.'},
          {value: '390', label: 'BANCO GM S.A.'},
          {value: '612', label: 'Banco Guanabara S.A.'},
          {value: '269', label: 'BANCO HSBC S.A.'},
          {value: '012', label: 'Banco Inbursa S.A.'},
          {value: '604', label: 'Banco Industrial do Brasil S.A.'},
          {value: '653', label: 'BANCO INDUSVAL S.A.'},
          {value: '077', label: 'Banco Inter S.A.'},
          {value: '249', label: 'Banco Investcred Unibanco S.A.'},
          {value: '184', label: 'Banco Itaú BBA S.A.'},
          {value: '029', label: 'Banco Itaú Consignado S.A.'},
          {value: '479', label: 'Banco ItauBank S.A.'},
          {value: '074', label: 'Banco J. Safra S.A.'},
          {value: '376', label: 'BANCO J.P. MORGAN S.A.'},
          {value: '217', label: 'Banco John Deere S.A.'},
          {value: '076', label: 'Banco KDB do Brasil S.A.'},
          {value: '757', label: 'BANCO KEB HANA DO BRASIL S.A.'},
          {value: '600', label: 'Banco Luso Brasileiro S.A.'},
          {value: '243', label: 'Banco Máxima S.A.'},
          {value: '389', label: 'Banco Mercantil do Brasil S.A.'},
          {value: '381', label: 'BANCO MERCEDES-BENZ DO BRASIL S.A.'},
          {value: '370', label: 'Banco Mizuho do Brasil S.A.'},
          {value: '746', label: 'Banco Modal S.A.'},
          {value: '066', label: 'BANCO MORGAN STANLEY S.A.'},
          {value: '456', label: 'Banco MUFG Brasil S.A.'},
          {value: '007', label: 'BANCO NACIONAL DE DESENVOLVIMENTO ECONOMICO E SOCIAL'},
          {value: '169', label: 'BANCO OLÉ CONSIGNADO S.A.'},
          {value: '079', label: 'Banco Original do Agronegócio S.A.'},
          {value: '212', label: 'Banco Original S.A.'},
          {value: '712', label: 'Banco Ourinvest S.A.'},
          {value: '623', label: 'Banco Pan S.A.'},
          {value: '611', label: 'Banco Paulista S.A.'},
          {value: '643', label: 'Banco Pine S.A.'},
          {value: '747', label: 'Banco Rabobank International Brasil S.A.'},
          {value: '088', label: 'BANCO RANDON S.A.'},
          {value: '633', label: 'Banco Rendimento S.A.'},
          {value: '741', label: 'BANCO RIBEIRAO PRETO S.A.'},
          {value: '120', label: 'BANCO RODOBENS S.A.'},
          {value: '422', label: 'Banco Safra S.A.'},
          {value: '743', label: 'Banco Semear S.A.'},
          {value: '754', label: 'Banco Sistema S.A.'},
          {value: '630', label: 'Banco Smartbank S.A.'},
          {value: '366', label: 'BANCO SOCIETE GENERALE BRASIL S.A.'},
          {value: '637', label: 'BANCO SOFISA S.A.'},
          {value: '464', label: 'Banco Sumitomo Mitsui Brasileiro S.A.'},
          {value: '082', label: 'BANCO TOPÁZIO S.A.'},
          {value: '387', label: 'Banco Toyota do Brasil S.A.'},
          {value: '634', label: 'BANCO TRIANGULO S.A.'},
          {value: '018', label: 'Banco Tricury S.A.'},
          {value: '393', label: 'Banco Volkswagen S.A.'},
          {value: '655', label: 'Banco Votorantim S.A.'},
          {value: '610', label: 'Banco VR S.A.'},
          {value: '119', label: 'Banco Western Union do Brasil S.A.'},
          {value: '124', label: 'Banco Woori Bank do Brasil S.A.'},
          {value: '348', label: 'Banco XP S.A.'},
          {value: '081', label: 'BancoSeguro S.A.'},
          {value: '021', label: 'BANESTES S.A. BANCO DO ESTADO DO ESPIRITO SANTO'},
          {value: '755', label: 'Bank of America Merrill Lynch Banco Múltiplo S.A.'},
          {value: '268', label: 'BARI COMPANHIA HIPOTECÁRIA'},
          {value: '378', label: 'BBC LEASING S.A. – ARRENDAMENTO MERCANTIL'},
          {value: '250', label: 'BCV – BANCO DE CRÉDITO E VAREJO S.A.'},
          {value: '144', label: 'BEXS BANCO DE CÂMBIO S/A'},
          {value: '253', label: 'Bexs Corretora de Câmbio S/A'},
          {value: '134', label: 'BGC LIQUIDEZ DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'},
          {value: '017', label: 'BNY Mellon Banco S.A.'},
          {value: '383', label: 'BOLETOBANCÁRIO.COM TECNOLOGIA DE PAGAMENTOS LTDA.'},
          {value: '408', label: 'BÔNUSCRED SOCIEDADE DE CRÉDITO DIRETO S.A.'},
          {value: '301', label: 'BPP Instituição de Pagamento S.A.'},
          {value: '126', label: 'BR Partners Banco de Investimento S.A.'},
          {value: '092', label: 'BRK S.A. Crédito, Financiamento e Investimento'},
          {value: '173', label: 'BRL Trust Distribuidora de Títulos e Valores Mobiliários S.A.'},
          {value: '142', label: 'Broker Brasil Corretora de Câmbio Ltda.'},
          {value: '292', label: 'BS2 Distribuidora de Títulos e Valores Mobiliários S.A.'},
          {value: '309', label: 'CAMBIONET CORRETORA DE CÂMBIO LTDA.'},
          {value: '288', label: 'CAROL DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.'},
          {value: '324', label: 'CARTOS SOCIEDADE DE CRÉDITO DIRETO S.A.'},
          {value: '130', label: 'CARUANA S.A. – SOCIEDADE DE CRÉDITO, FINANCIAMENTO E INVESTIMENTO'},
          {value: '159', label: 'Casa do Crédito S.A. Sociedade de Crédito ao Microempreendedor'},
          {value: '114', label: 'Central Cooperativa de Crédito no Estado do Espírito Santo – CECOOP'},
          {value: '091', label: 'CENTRAL DE COOPERATIVAS DE ECONOMIA E CRÉDITO MÚTUO DO ESTADO DO RIO GRANDE DO S'},
          {value: '320', label: 'China Construction Bank (Brasil) Banco Múltiplo S/A'},
          {value: '362', label: 'CIELO S.A.'},
          {value: '477', label: 'Citibank N.A.'},
          {value: '180', label: 'CM CAPITAL MARKETS CORRETORA DE CÂMBIO, TÍTULOS E VALORES MOBILIÁRIOS LTDA'},
          {value: '127', label: 'Codepe Corretora de Valores e Câmbio S.A.'},
          {value: '163', label: 'Commerzbank Brasil S.A. – Banco Múltiplo'},
          {value: '133', label: 'CONFEDERAÇÃO NACIONAL DAS COOPERATIVAS CENTRAIS DE CRÉDITO E ECONOMIA FAMILIAR E'},
          {value: '136', label: 'CONFEDERAÇÃO NACIONAL DAS COOPERATIVAS CENTRAIS UNICRED LTDA. – UNICRED DO BRASI'},
          {value: '060', label: 'Confidence Corretora de Câmbio S.A.'},
          {value: '085', label: 'Cooperativa Central de Crédito – Ailos'},
          {value: '016', label: 'COOPERATIVA DE CRÉDITO MÚTUO DOS DESPACHANTES DE TRÂNSITO DE SANTA CATARINA E RI'},
          {value: '281', label: 'Cooperativa de Crédito Rural Coopavel'},
          {value: '322', label: 'Cooperativa de Crédito Rural de Abelardo Luz – Sulcredi/Crediluz'},
          {value: '391', label: 'COOPERATIVA DE CREDITO RURAL DE IBIAM – SULCREDI/IBIAM'},
          {value: '286', label: 'COOPERATIVA DE CRÉDITO RURAL DE OURO   SULCREDI/OURO'},
          {value: '350', label: 'COOPERATIVA DE CRÉDITO RURAL DE PEQUENOS AGRICULTORES E DA REFORMA AGRÁRIA DO CE'},
          {value: '279', label: 'COOPERATIVA DE CREDITO RURAL DE PRIMAVERA DO LESTE'},
          {value: '273', label: 'Cooperativa de Crédito Rural de São Miguel do Oeste – Sulcredi/São Miguel'},
          {value: '379', label: 'COOPERFORTE – COOPERATIVA DE ECONOMIA E CRÉDITO MÚTUO DOS FUNCIONÁRIOS DE INSTIT'},
          {value: '403', label: 'CORA SOCIEDADE DE CRÉDITO DIRETO S.A.'},
          {value: '098', label: 'Credialiança Cooperativa de Crédito Rural'},
          {value: '010', label: 'CREDICOAMO CREDITO RURAL COOPERATIVA'},
          {value: '089', label: 'CREDISAN COOPERATIVA DE CRÉDITO'},
          {value: '097', label: 'Credisis – Central de Cooperativas de Crédito Ltda.'},
          {value: '011', label: 'CREDIT SUISSE HEDGING-GRIFFO CORRETORA DE VALORES S.A'},
          {value: '342', label: 'Creditas Sociedade de Crédito Direto S.A.'},
          {value: '321', label: 'CREFAZ SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E A EMPRESA DE PEQUENO PORTE LT'},
          {value: '289', label: 'DECYSEO CORRETORA DE CAMBIO LTDA.'},
          {value: '487', label: 'DEUTSCHE BANK S.A. – BANCO ALEMAO'},
          {value: '140', label: 'Easynvest – Título Corretora de Valores SA'},
          {value: '149', label: 'Facta Financeira S.A. – Crédito Financiamento e Investimento'},
          {value: '196', label: 'FAIR CORRETORA DE CAMBIO S.A.'},
          {value: '343', label: 'FFA SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE LTDA.'},
          {value: '382', label: 'FIDÚCIA SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE L'},
          {value: '331', label: 'Fram Capital Distribuidora de Títulos e Valores Mobiliários S.A.'},
          {value: '285', label: 'Frente Corretora de Câmbio Ltda.'},
          {value: '278', label: 'Genial Investimentos Corretora de Valores Mobiliários S.A.'},
          {value: '364', label: 'GERENCIANET S.A.'},
          {value: '138', label: 'Get Money Corretora de Câmbio S.A.'},
          {value: '384', label: 'GLOBAL FINANÇAS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO'},
          {value: '064', label: 'GOLDMAN SACHS DO BRASIL BANCO MULTIPLO S.A.'},
          {value: '177', label: 'Guide Investimentos S.A. Corretora de Valores'},
          {value: '146', label: 'GUITTA CORRETORA DE CAMBIO LTDA.'},
          {value: '078', label: 'Haitong Banco de Investimento do Brasil S.A.'},
          {value: '062', label: 'Hipercard Banco Múltiplo S.A.'},
          {value: '189', label: 'HS FINANCEIRA S/A CREDITO, FINANCIAMENTO E INVESTIMENTOS'},
          {value: '396', label: 'HUB PAGAMENTOS S.A'},
          {value: '271', label: 'IB Corretora de Câmbio, Títulos e Valores Mobiliários S.A.'},
          {value: '157', label: 'ICAP do Brasil Corretora de Títulos e Valores Mobiliários Ltda.'},
          {value: '132', label: 'ICBC do Brasil Banco Múltiplo S.A.'},
          {value: '492', label: 'ING Bank N.V.'},
          {value: '139', label: 'Intesa Sanpaolo Brasil S.A. – Banco Múltiplo'},
          {value: '652', label: 'Itaú Unibanco Holding S.A.'},
          {value: '488', label: 'JPMorgan Chase Bank, National Association'},
          {value: '399', label: 'Kirton Bank S.A. – Banco Múltiplo'},
          {value: '293', label: 'Lastro RDV Distribuidora de Títulos e Valores Mobiliários Ltda.'},
          {value: '105', label: 'Lecca Crédito, Financiamento e Investimento S/A'},
          {value: '145', label: 'LEVYCAM – CORRETORA DE CAMBIO E VALORES LTDA.'},
          {value: '397', label: 'LISTO SOCIEDADE DE CREDITO DIRETO S.A.'},
          {value: '113', label: 'Magliano S.A. Corretora de Cambio e Valores Mobiliarios'},
          {value: '323', label: 'MERCADOPAGO.COM REPRESENTACOES LTDA.'},
          {value: '274', label: 'MONEY PLUS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E A EMPRESA DE PEQUENO PORT'},
          {value: '259', label: 'MONEYCORP BANCO DE CÂMBIO S.A.'},
          {value: '128', label: 'MS Bank S.A. Banco de Câmbio'},
          {value: '377', label: 'MS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE LTDA'},
          {value: '354', label: 'NECTON INVESTIMENTOS  S.A. CORRETORA DE VALORES MOBILIÁRIOS E COMMODITIES'},
          {value: '191', label: 'Nova Futura Corretora de Títulos e Valores Mobiliários Ltda.'},
          {value: '753', label: 'Novo Banco Continental S.A. – Banco Múltiplo'},
          {value: '260', label: 'Nu Pagamentos S.A.'},
          {value: '111', label: 'OLIVEIRA TRUST DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIARIOS S.A.'},
          {value: '319', label: 'OM DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'},
          {value: '613', label: 'Omni Banco S.A.'},
          {value: '325', label: 'Órama Distribuidora de Títulos e Valores Mobiliários S.A.'},
          {value: '355', label: 'ÓTIMO SOCIEDADE DE CRÉDITO DIRETO S.A.'},
          {value: '290', label: 'Pagseguro Internet S.A.'},
          {value: '254', label: 'PARANÁ BANCO S.A.'},
          {value: '326', label: 'PARATI – CREDITO, FINANCIAMENTO E INVESTIMENTO S.A.'},
          {value: '194', label: 'PARMETAL DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'},
          {value: '174', label: 'PEFISA S.A. – CRÉDITO, FINANCIAMENTO E INVESTIMENTO'},
          {value: '315', label: 'PI Distribuidora de Títulos e Valores Mobiliários S.A.'},
          {value: '380', label: 'PICPAY SERVICOS S.A.'},
          {value: '100', label: 'Planner Corretora de Valores S.A.'},
          {value: '125', label: 'Plural S.A. Banco Múltiplo'},
          {value: '093', label: 'PÓLOCRED   SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORT'},
          {value: '108', label: 'PORTOCRED S.A. – CREDITO, FINANCIAMENTO E INVESTIMENTO'},
          {value: '306', label: 'PORTOPAR DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.'},
          {value: '329', label: 'QI Sociedade de Crédito Direto S.A.'},
          {value: '283', label: 'RB CAPITAL INVESTIMENTOS DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LIMITADA'},
          {value: '374', label: 'REALIZE CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.'},
          {value: '101', label: 'RENASCENCA DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'},
          {value: '270', label: 'Sagitur Corretora de Câmbio Ltda.'},
          {value: '751', label: 'Scotiabank Brasil S.A. Banco Múltiplo'},
          {value: '276', label: 'Senff S.A. – Crédito, Financiamento e Investimento'},
          {value: '545', label: 'SENSO CORRETORA DE CAMBIO E VALORES MOBILIARIOS S.A'},
          {value: '190', label: 'SERVICOOP – COOPERATIVA DE CRÉDITO DOS SERVIDORES PÚBLICOS ESTADUAIS DO RIO GRAN'},
          {value: '363', label: 'SOCOPA SOCIEDADE CORRETORA PAULISTA S.A.'},
          {value: '183', label: 'SOCRED S.A. – SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO P'},
          {value: '365', label: 'SOLIDUS S.A. CORRETORA DE CAMBIO E VALORES MOBILIARIOS'},
          {value: '299', label: 'SOROCRED   CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.'},
          {value: '014', label: 'STATE STREET BRASIL S.A. ? BANCO COMERCIAL'},
          {value: '197', label: 'Stone Pagamentos S.A.'},
          {value: '404', label: 'SUMUP SOCIEDADE DE CRÉDITO DIRETO S.A.'},
          {value: '340', label: 'Super Pagamentos e Administração de Meios Eletrônicos S.A.'},
          {value: '307', label: 'Terra Investimentos Distribuidora de Títulos e Valores Mobiliários Ltda.'},
          {value: '352', label: 'TORO CORRETORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'},
          {value: '095', label: 'Travelex Banco de Câmbio S.A.'},
          {value: '143', label: 'Treviso Corretora de Câmbio S.A.'},
          {value: '360', label: 'TRINUS CAPITAL DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.'},
          {value: '131', label: 'TULLETT PREBON BRASIL CORRETORA DE VALORES E CÂMBIO LTDA'},
          {value: '129', label: 'UBS Brasil Banco de Investimento S.A.'},
          {value: '015', label: 'UBS Brasil Corretora de Câmbio, Títulos e Valores Mobiliários S.A.'},
          {value: '099', label: 'UNIPRIME CENTRAL – CENTRAL INTERESTADUAL DE COOPERATIVAS DE CREDITO LTDA.'},
          {value: '084', label: 'UNIPRIME NORTE DO PARANÁ – COOPERATIVA DE CRÉDITO LTDA'},
          {value: '373', label: 'UP.P SOCIEDADE DE EMPRÉSTIMO ENTRE PESSOAS S.A.'},
          {value: '298', label: 'Vip’s Corretora de Câmbio Ltda.'},
          {value: '296', label: 'VISION S.A. CORRETORA DE CAMBIO'},
          {value: '367', label: 'VITREO DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.'},
          {value: '310', label: 'VORTX DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.'},
          {value: '371', label: 'WARREN CORRETORA DE VALORES MOBILIÁRIOS E CÂMBIO LTDA.'},
          {value: '102', label: 'XP INVESTIMENTOS CORRETORA DE CÂMBIO,TÍTULOS E VALORES MOBILIÁRIOS S/A'},
          {value: '359', label: 'ZEMA CRÉDITO, FINANCIAMENTO E INVESTIMENTO S/A'}],
        acessoReativarLiberacaoRecursos: false
      }
    },
    computed: {
      sortOptions () {
        // Create an options list from our fields
        return this.fields
          .table.filter(f => f.sortable)
          .map(f => { return {text: f.label, value: f.key} })
      },
      ...mapGetters([
        'usuarioLogado'
      ]),
      chiefActive () {
        return this.usuarioLogado.entity.chiefs.some(chefe => {
          return chefe.active === true && moment(new Date()).isSameOrAfter(moment(chefe.initialMandateDate)) && moment(new Date()).isSameOrBefore(moment(chefe.endMandateDate))
        })
      }
    },
    created: function () {
      this.verificaSimplificado()
      this.consultaAcessoReativacaoLiberacaoRecursos()
      if (this.usuarioLogado.userType !== 'FUNDACAO') {
        _.set(this.fields, '[7].thStyle', 'width: 15%; text-align: center')
        this.onSearch()
      }
      if (this.usuarioLogado.userType === 'FUNDACAO') {
        this.todasPropostasSimplificadas = false
      }
    },
    mounted: function () {
    },
    methods: {
      async verificaSimplificado () {
        console.log('verificaSimplificado')
        // Verifica só se não for FUNDACAO, para restringir a seleção de alguns itens da solicitação
        if (this.usuarioLogado.userType !== 'FUNDACAO') {
          let idEntidade = this.usuarioLogado.entity.id
          await axiosLaravel.get('prestacaoSimplificada/ehPropostaSimplificada/' + idEntidade).then((response) => {
            this.todasPropostasSimplificadas = response.data
            console.log('simplificado', this.todasPropostasSimplificadas)
          })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
        }
      },
      async buscaDadosBancariosAdiantamento (idSolicitacao) {
        axiosLaravel.get('processos/dados_bancarios_adiantamento/' + idSolicitacao).then((response) => {
          // this.$forceUpdate() // força o update da tela para não ter problema
          this.dadosBancariosAdiantamento.banco = response.data[0].banco
          this.dadosBancariosAdiantamento.agencia = response.data[0].agencia
          this.dadosBancariosAdiantamento.conta = response.data[0].conta
          this.dadosBancariosAdiantamento.tipo = response.data[0].tipo
          this.$forceUpdate()
        })
        .catch((error) => {
          console.log('error', error)
          this.$root.trataErro(error)
        })
      },
      validaTipoFase (request) {
        let validate = true
        if (request.etapa === 'Revisão pela entidade' && request.situacao === 'Em Execução') {
          this.possuiProcessoEmRevisao = true
        }

        if (_.includes(['Pagamento', 'Ressarcimento', 'Contrapartida'], request.tipo_solicitacao)) {
          if (request.situacao === 'Feito') {
            validate = false
          } else if (request.situacao === 'Cancelado') {
            validate = false
          }
        }
        if (request.tipo_solicitacao === 'Prestação de Contas') {
          if (request.situacao === 'Cancelado' || request.etapa === 'Revisão pela entidade' || (request.situacao === 'Feito')) {
            validate = false
          }
        }
        if (request.tipo_solicitacao === 'Adiantamento' || request.tipo_solicitacao === 'Devolução de Adiantamento') {
          if (request.situacao === 'Cancelado' || request.etapa === 'Revisão pela entidade' || (request.etapa === 'Análise Financeira' && request.situacao === 'Feito')) {
            validate = false
          }
        }

        return validate
      },
      async show (row) {
        if (row.item.tipo_solicitacao === 'Pagamento') {
          this.$router.push({name: 'solicitacao-pagamento', params: {id: row.item.id, visualizacao: true}})
        } else if (row.item.tipo_solicitacao === 'Contrapartida') {
          this.$router.push({name: 'solicitacao-contrapartida', params: {id: row.item.id, visualizacao: true}})
        } else if (row.item.tipo_solicitacao === 'Prestação de Contas') {
          this.$router.push({name: 'solicitacao-prestacaocontas', params: {id: row.item.id, visualizacao: true}})
        } else if (row.item.tipo_solicitacao === 'Ressarcimento') {
          this.$router.push({name: 'solicitacao-ressarcimento', params: {id: row.item.id, visualizacao: true}})
        } else if (row.item.tipo_solicitacao === 'Adiantamento') {
          this.$router.push({name: 'solicitacao-adiantamento', params: {id: row.item.id, visualizacao: true}})
        } else if (row.item.tipo_solicitacao === 'Devolução de Adiantamento') {
          this.$router.push({name: 'solicitacao-devolucao-adiantamento', params: {id: row.item.id, visualizacao: true}})
        } else if (row.item.tipo_solicitacao === 'Alterações do Projeto') {
          this.$router.push({name: 'solicitacao-alteracoes-projeto-visualizacao', params: {id: row.item.id, visualizacao: true}})
        }
      },
      hide () {
        this.prop = ''
        this.num = ''
        this.etapa = ''
        this.documentos = {}
        this.montaCronograma = []
        this.historicoBack = []
        this.historicoAnt = []
        this.$modal.hide('visualizar')
      },
      async carregaTarefa () {
        this.prop = ''
        this.num = ''
        this.etapa = ''
        this.serie = ''
        this.numero = ''
        this.emissao = ''
        this.validade = ''
        this.prioridade = ''
        this.cep = ''
        this.endereco = ''
        this.identificador = ''
        this.nomeFornecedor = ''
        this.tipoPessoa = ''
        this.forma = ''
        this.textoTipo = ''
        this.montaCronograma = []
        await this.buscaHistorico(this.row.item.id)
        await axiosLaravel.get('processos/' + this.row.item.id).then((response) => {
          this.req = response.data
          // console.log('this.req', this.req)
          this.dataProcesso = moment(this.req.inicio)
          // console.log('dataProcesso', this.dataProcesso)
          // console.log('dataBefore', moment('2020-12-10'))
          if (moment(this.dataProcesso).isSameOrBefore(moment(this.dataCorte))) {
            this.dataMenor = true
          } else {
            this.dataMenor = false
          }
          this.$emit('historico', response.data.tarefas)
          // this.$forceUpdate()
          this.etapa = this.req.tarefas[0].nome
          this.textoTipo = this.req.nome
          if (this.textoTipo === 'Adiantamento' || this.textoTipo === 'Devolução de Adiantamento') {
            this.prop = this.req.documentos_liberacao[0].itens_liberados[0].parcelas_adiantamentos[0].proposta.ds_nome
            this.num = this.req.documentos_liberacao[0].itens_liberados[0].parcelas_adiantamentos[0].proposta.ds_codigo_projeto_erp
            this.itemAdt = this.req.documentos_liberacao[0].itens_liberados[0].parcelas_adiantamentos
            this.vlrAdt = this.req.documentos_liberacao[0].itens_liberados[0].valor

            this.carregaAdiantamentos()
            this.$forceUpdate()
          } else {
            // console.log('this.req', this.req)
            this.prop = this.req.documentos_liberacao[0].itens_liberados[0].itens_orcamentos[0].proposta.ds_nome
            this.num = this.req.documentos_liberacao[0].itens_liberados[0].itens_orcamentos[0].proposta.ds_codigo_projeto_erp
          }

          this.situacao = this.req.situacao
          this.documentos = this.req.documentos_liberacao[0]
          if (_.includes(['Pagamento', 'Prestação de Contas', 'Ressarcimento'], this.textoTipo)) {
            this.serie = this.req.documentos_liberacao[0].serie
            this.numero = this.req.documentos_liberacao[0].numero
            this.emissao = this.req.documentos_liberacao[0].emissao

            this.validade = this.req.documentos_liberacao[0].validade
            this.formaPagamento = this.req.documentos_liberacao[0].forma_pagamento
            if (this.req.documentos_liberacao[0].prioridade === 0) {
              this.prioridade = 'Não'
            } else {
              this.prioridade = 'Sim'
            }
            if (_.includes(['Pagamento', 'Prestação de Contas', 'Ressarcimento'], this.textoTipo)) {
              this.fornecedor = this.req.documentos_liberacao[0].dados_bancarios.fornecedor
              this.cep = this.fornecedor.cep
              this.endereco = this.fornecedor.endereco
              this.identificador = this.fornecedor.identificador
              this.nomeFornecedor = this.fornecedor.nome
              this.banco = this.req.documentos_liberacao[0].dados_bancarios.banco
              this.agencia = this.req.documentos_liberacao[0].dados_bancarios.agencia
              this.conta = this.req.documentos_liberacao[0].dados_bancarios.conta
            }
            if (this.textoTipo !== 'Contrapartida') {
              this.carregaAdiantamentos()
              this.$forceUpdate()
            }
            this.$forceUpdate()
            if (this.fornecedor.identificador.length > 11) {
              this.texto = 'CNPJ:'
              this.tipoPessoa = 'Pessoa Jurídica'
              this.mascara = '99.999.999/9999-99'
            } else {
              this.texto = 'CPF:'
              this.tipoPessoa = 'Pessoa Física'
              this.mascara = '999.999.999-99'
            }
            switch (this.formaPagamento) {
              case 1:
                this.forma = 'Dinheiro'
                break
              case 2:
                this.forma = 'Crédito Conta Beneficiário'
                break
              case 3:
                this.forma = 'Crédito Conta Fornecedor'
                break
              case 4:
                this.forma = 'Docum. Código de Barras'
                break
              case 5:
                this.forma = 'DDA - Débito direto autorizado'
                break
              default:
                this.forma = ''
            }
          }
          if (this.textoTipo === 'Adiantamento' || this.textoTipo === 'Devolução de Adiantamento') {
            // console.log(this.req)
            if (_.isNull(this.req.documentos_liberacao[0].documentos_adiantamento)) {
              this.documentosAnexo = this.req.documentos_liberacao[0].documentos_anexos_adiantamento
            } else {
              this.documentosAnexo = this.req.documentos_liberacao[0].documentos_adiantamento
            }
          } else {
            this.documentosAnexo = this.req.documentos_liberacao[0].documentos
          }
          // console.log(this.documentosAnexo)
          this.tarefas = this.req.tarefas
          let array = []
          for (let i = 0; i < this.tarefas.length; i++) {
            if (this.tarefas[i].tipo === 'Usuário') {
              array.push(this.tarefas[i])
            }
          }
          this.listaHistorico = _.cloneDeep(array)
          for (let i = 0; i < this.listaHistorico.length; i++) {
            if (this.listaHistorico[i].usuario !== null) {
              this.usuario = this.listaHistorico[i].usuario.ds_nome_usuario
            }
          }
          let arrayAnt = this.listaHistorico.filter((item) => {
            return item.tipo === 'Usuário' && !_.isNull(item.termino)
          })
          this.historicoAnt = arrayAnt
          this.etapaHist = this.listaHistorico[0].nome
          this.historico()
          this.$forceUpdate()
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
        this.$forceUpdate()
      },
      async carregaAdiantamentos () {
        let totalSolicitation = 0
        let proj = ''
        this.montaCronograma = []
        if (this.textoTipo === 'Adiantamento' || this.textoTipo === 'Devolução de Adiantamento') {
          proj = this.req.documentos_liberacao[0].itens_liberados[0].parcelas_adiantamentos[0].proposta.id
        } else {
          proj = this.req.documentos_liberacao[0].itens_liberados[0].itens_orcamentos[0].proposta.id
        }
        // let balanceSolicitation = 0
        let totalValue = 0
        await axiosLaravel.get('processos/adiantamento/recursos/' + proj).then((response) => {
          if (_.includes(['Pagamento', 'Ressarcimento'], this.textoTipo)) {
            this.adiantamento = response.data.adiantamentos_concedidos.row
          }
          if (_.includes(['Prestação de Contas', 'Adiantamento', 'Devolução de Adiantamento'], this.textoTipo)) {
            this.adiantamento = response.data.adiantamentos_concedidos.row[0]
          }
          this.$forceUpdate()
          this.parcelas = response.data.parcels.row
          for (let i = 0; i < this.parcelas.length; i++) {
            totalSolicitation += this.parcelas[i].totalValueAdvanceRequest
            // balanceSolicitation += (this.parcelas[i].balanceAdvanceResource - this.parcelas[i].totalValueAdvanceRequest)
            totalValue += this.parcelas[i].totalValueAdvance
          }
          this.totalSolicitation = totalSolicitation
          this.totalValue = totalValue
          this.balanceSolicitation = totalValue - this.totalSolicitation
          this.adiantamento.limitDate = ''

          for (var i = 0; i < this.adiantamento.length; i++) {
            this.adiantamento[i].createDate = moment(this.adiantamento[i].data_solicitacao).format('DD/MM/YYYY')
            this.adiantamento[i].limitDate = moment(this.adiantamento[i].createDate, 'DD-MM-YYYY').add(90, 'days').format('DD/MM/YYYY')
            this.adiantamento[i].lastParcelDate = moment(this.adiantamento[i].accountabilityDate).format('DD/MM/YYYY')
          }
        })
          .catch(function (error) {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      historico () {
        let id = 0
        this.historicoTarefas = []
        this.montaCronograma = []
        this.valorTotal = 0
        if (this.req.situacao === 'Feito') {
          if (this.req.nome === 'Contrapartida') {
            id = this.listaHistorico[0].id
          }
        } else {
          id = this.listaHistorico[1].id
        }
        if (!id) {
          id = this.listaHistorico[0].id
        }
        axiosLaravel.get('processos/tarefas/buscahistorico/' + id).then((response) => {
          this.montaCronograma = response.data.cronogramaHistorico.dados.itens.row
          let array = []
          for (let i = 0; i < this.montaCronograma.length; i++) {
            if (this.montaCronograma[i].Valor_solicitado > 0 && this.montaCronograma[i].Qtde_solicitado > 0) {
              array.push(this.montaCronograma[i])
            }
          }

          this.montaCronograma = _.cloneDeep(array)
          // this.montaCronogramaTotais = response.data.cronogramaHistorico.dados.totais
          for (let j = 0; j < this.montaCronograma.length; j++) {
            this.valorTotal += parseFloat(this.montaCronograma[j].Valor_solicitado)
          }
          this.$forceUpdate()
        })
          .catch(function (error) {
            this.$root.trataErro(error)
          })
        this.$forceUpdate()
      },
      showCancelCounterPartButton (request) {
        let validate = true

        if (request.requestType === 'COUNTERPART') {
          if (request.approvalResult === 'CANCELED' || request.approvalResult === 'APPROVED' ||
            request.approvalResult === 'RETURN_TO_ENTITY' || request.approvalResult === 'REVIEW' ||
            request.eventType === 'COUNTERPART_REVIEW') {
            validate = false
          }
        }
        return validate
      },
      showCancelButton (request) {
        let validate = true
        // Suporte 61618
        if (this.usuarioLogado.userType === 'ENTIDADE') {
          // if (request.situacao === 'Cancelado' || request.situacao === 'Feito' || request.etapa === 'Análise' || request.etapa === 'Autorização' || request.etapa === 'Análise Tributária' || request.etapa === 'Análise Financeira') {
          if (request.situacao === 'Cancelado' || request.situacao === 'Feito' || request.etapa !== 'Revisão pela entidade') {
            validate = false
          }
        } else {
          if (_.includes(['Pagamento', 'Ressarcimento', 'Contrapartida', 'Alterações do Projeto'], request.tipo_solicitacao)) {
            if (request.situacao === 'Cancelado' || request.situacao === 'Feito' || request.etapa === 'Autorização' || request.etapa === 'Liquidação') {
              validate = false
            }
          }
          if (request.tipo_solicitacao === 'Migração') {
            validate = false
          }
          if (request.tipo_solicitacao === 'Prestação de Contas') {
            if (request.situacao === 'Cancelado' || request.situacao === 'Feito' || request.etapa === 'Autorização' || request.etapa === 'Liquidação') {
              validate = false
            }
          }
          if (request.tipo_solicitacao === 'Adiantamento') {
            if (request.situacao === 'Cancelado' || request.situacao === 'Feito') {
              validate = false
            }
          }
          if (request.tipo_solicitacao === 'Devolução de Adiantamento') {
            if (request.situacao === 'Cancelado' || request.situacao === 'Feito') {
              validate = false
            }
          }
        }
        return validate
      },
      async segueReativar (processo) {
        console.log('segueReativar - processo: ' + processo.id)
        this.$snotify.async('Reativando solicitação. Por favor, aguarde...', {timeout: 0})
        await axiosLaravel.put('processos/reativar/' + processo.id).then(async (response) => {
          console.log('response.data RLMB', response.data)
          await this.marcaReativado(response.data)
          this.$snotify.clear()
          this.$snotify.success('Solicitação reativada com sucesso!')
          processo.situacao = 'Análise'
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      // INCLUSÃO DE MÉTODO PARA CONFIRMAÇÃO DE REATIVAÇÃO - SUPORTE 58248 - 05/01/2021 - AKIRA
      async solicitacaoReativar (processo) {
        var tipo = processo.tipo_solicitacao
        var id = processo.id
        var projeto = processo.projeto
        var $message = 'Deseja <b>REATIVAR</b> a solicitação de <font color=\'red\'>' + tipo + '</font>? <br><br> - ID: <i><font color=\'#00008b\'>' + id + '</font></i><br> - Projeto: <i><font color=\'#00008b\'>' + projeto + '</font></i></i>' + '</br></br></br> <form><font color="red"> Ao prosseguir com a solicitação declaro que informei a Gefic e estou ciente das implicações decorrentes desta reativação.</font></label></form></div>'
        this.$dialog
          .confirm($message)
          .then(($dialog) => {
            this.segueReativar(processo)
          })
          .catch(function (error) {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      async segueRetornarTarefa (retorno, processo) {
        this.$snotify.async('Retornando tarefa para a FBB. Por favor, aguarde...', {timeout: 0})
        await axiosLaravel.put('processos/retornarFBB/' + processo.id).then(async (response) => {
          console.log('response.data RLMB 1', response.data)
          this.gravaHistorico(response.data)
          this.$snotify.clear()
          this.$snotify.success('Solicitação retornada para a FBB!')
          processo.etapa = 'Análise'
          processo.situacao = 'Em Execução'
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      gravaHistorico (parm) {
        axiosLaravel.post('historico-tarefas/', parm).then((response) => {
          console.log(response.data)
        })
      },
      segueReanalisar (processo) {
        this.$snotify.async('Encaminhando para reanálise da solicitação. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.put('processos/reanalisar/' + processo.id).then((response) => {
          this.$forceUpdate()
          this.$snotify.clear()
          this.$snotify.success('Solicitação devolvida para reanálise! Abrindo a tarefa. Aguarde...')
          processo.etapa = 'Análise'
          processo.situacao = 'Em Execução'
          this.segueValidacao(processo)
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      onDownloadZIP (item) {
        _.set(item, 'downloading', '1')
        this.$forceUpdate()
        axiosLaravel.get('processos/documentos/download/' + item.id).then((response) => {
          let link = document.createElement('a')
          link.href = response.data
          link.download = 'Arquivo não localizado'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          _.unset(item, 'downloading')
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      buscaHistorico (request) {
        axiosLaravel.post('historico-tarefas/lista', {'parametro': request}).then((response) => {
          this.historicoBack = response.data
          // Suporte 61223
          if (!_.find(this.historicoBack, {proxima_etapa: 'Conclusão'}) && this.req.situacao === 'Feito') {
            console.log('não encontrou no find')
            this.historicoBack.push({fk_processo: this.req.id, fk_tarefa: this.req.tarefas[0].id, fk_usuario: this.req.tarefas[0].usuario.id, nome: 'AUTORIZACAO', proxima_etapa: 'Conclusão', usuario: this.req.tarefas[0].usuario, data_edicao: this.req.tarefas[0].data_edicao, termino: this.req.tarefas[0].termino, observacao: this.req.tarefas[0].observacao})
          }
          if (!this.historicoBack) {
            this.esconderHistorico = false
          } else if (this.historicoBack && !_.isNull(this.historicoBack) && !_.isEmpty(this.historicoBack)) {
            this.esconderHistorico = false
          } else {
            this.esconderHistorico = true
          }
          this.$forceUpdate()
          console.log('response historicoBack', response.data)
        })
      },
      marcaAssumido (request) {
        this.dadosHistorico.fk_processo = request.id
        this.dadosHistorico.etapa_anterior = request.etapa
        this.dadosHistorico.fk_usuario = this.usuarioLogado.id
        this.dadosHistorico.nome = 'TAREFA_ASSUMIDA'
        this.dadosHistorico.tipo = 'SISTEMA'
        this.dadosHistorico.id = request.id_tarefa_atual
        this.dadosHistorico.inicio = moment().format('YYYY-MM-DD HH:mm:ss')
        axiosLaravel.post('historico-tarefas/', this.dadosHistorico).then((response) => {
          console.log(response.data)
        })
      },
      async marcaReativado (request) {
        this.dadosHistorico.fk_processo = request.id
        this.dadosHistorico.etapa_anterior = 'FINALIZADO'
        this.dadosHistorico.proxima_etapa = 'ANALISE'
        this.dadosHistorico.fk_usuario = this.usuarioLogado.id
        this.dadosHistorico.nome = 'TAREFA_REATIVADA'
        this.dadosHistorico.tipo = 'USUARIO'
        this.dadosHistorico.id = null
        this.dadosHistorico.inicio = moment().format('YYYY-MM-DD HH:mm:ss')
        this.dadosHistorico.observacao = 'Funcionário declarou que informou a Gefic e está ciente das implicações decorrentes desta reativação.'
        await axiosLaravel.post('historico-tarefas/', this.dadosHistorico).then((response) => {
          console.log(response.data)
        })
      },
      async marcaCancelado (request) {
        this.dadosHistorico.fk_processo = request.id
        this.dadosHistorico.etapa_anterior = request.etapa
        this.dadosHistorico.proxima_etapa = 'CANCELADO'
        this.dadosHistorico.fk_usuario = this.usuarioLogado.id
        this.dadosHistorico.nome = 'CANCELADO'
        this.dadosHistorico.tipo = 'USUARIO'
        this.dadosHistorico.id = request.id_tarefa_atual
        this.dadosHistorico.inicio = moment().format('YYYY-MM-DD HH:mm:ss')
        await axiosLaravel.post('historico-tarefas/', this.dadosHistorico).then((response) => {
          console.log(response.data)
        })
      },
      segueValidacao: function (request) {
        // alteração da variavel request.id para request.id_usuario em atendimento aos suportes 58481 58318 58297
        if (this.autorizaValidacao(request)) {
          if (request.id_usuario === null || request.id_usuario === 'null' || request.id_usuario !== this.usuarioLogado.id) {
            let atual = request.id_tarefa_atual
            axiosLaravel.put('processos/validacao/assumir/', {'id_tarefa': atual, 'item': request}).then((response) => {
              if (response.statusText === 'OK') {
                // this.marcaAssumido(request)
                this.goToApproval(request)
              }
            })
          } else if (request.id_usuario === this.usuarioLogado.id) {
            this.goToApproval(request)
          } else {
            let atual = request.id_tarefa_atual
            axiosLaravel.put('processos/validacao/assumir/', {'id_tarefa': atual, 'item': request}).then((response) => {
              if (response.statusText === 'OK') {
                this.goToApproval(request)
              }
            })
          }
        }
      },
      onValidate (request) {
        // Verifica se o tipo da solicitação é adiantamento segue com tratamento diferente
        if (_.includes(['Adiantamento', 'Devolução de Adiantamento', 'Pagamento', 'Ressarcimento', 'Prestação de Contas', 'Contrapartida'], request.tipo_solicitacao)) {
          this.segueValidacao(request)
          return
        }
        this.$snotify.async('Buscando validação. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.get('processos/' + request.id).then((response) => {
          this.validacao = response.data
          this.validacao.processo = _.omit(response.data, ['documentos_liberacao', 'tarefas'])
          this.historicoTarefas = _.cloneDeep(response.data.tarefas)
          let array = this.historicoTarefas.filter((item) => {
            return item.tipo === 'Usuário'
          })
          this.historicoTarefas = _.cloneDeep(array)
          for (let i = 0; i < this.historicoTarefas.length; i++) {
            if (this.historicoTarefas.usuario !== null) {
              this.usuario = this.historicoTarefas.usuario
            }
          }
          this.nota = _.cloneDeep(this.validacao.documentos_liberacao) // Faz um clone das notas e joga na tabela para não influenciar nos dados originais
          this.$forceUpdate()
          this.textoTipo = this.validacao.nome
          if (this.autorizaValidacao(request)) {
            if (request.id === null || request.id === 'null' || request.id !== this.usuarioLogado.id) {
              this.onAssign(request, false)
            } else if (request.id === this.usuarioLogado.id) {
              this.visibleForm = !this.visibleForm
            } else {
              this.onAssign(request, true)
            }
          }
          this.$snotify.clear()
          this.$snotify.success('Dados carregados com sucesso!')
        })
          .catch((error) => {
            this.$snotify.clear()
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      revisar (item) {
        let atual = item.id_tarefa_atual
        if (this.usuarioLogado.userType === 'ENTIDADE') {
          if (item.tipo_solicitacao === 'Devolução de Adiantamento') {
            this.$router.push('/solicitacao/devolucao_adiantamento/' + item.id)
          }
          if (item.tipo_solicitacao === 'Adiantamento') {
            this.$router.push('/solicitacao/adiantamento/' + item.id)
          }
          if (item.tipo_solicitacao === 'Contrapartida') {
            this.$router.push('/solicitacao/contrapartida/' + item.id)
          }
          if (item.tipo_solicitacao === 'Prestação de Contas') {
            this.$router.push('/solicitacao/prestacaocontas/' + item.id)
          }
          if (item.tipo_solicitacao === 'Pagamento') {
            this.$router.push('/solicitacao/pagamento/' + item.id)
          }
          if (item.tipo_solicitacao === 'Ressarcimento') {
            this.$router.push({path: '/solicitacao/ressarcimento/' + item.id})
          }
          if (item.tipo_solicitacao === 'Alterações do Projeto') {
            this.$router.push({name: 'solicitacao-alteracoes-projeto', params: {id: item.id}})
          }
        } else {
          axiosLaravel.put('processos/validacao/assumir/', {'id_tarefa': atual}).then((response) => {
            if (response.statusText === 'OK') {
              if (item.tipo_solicitacao === 'Devolução de Adiantamento') {
                this.$router.push('/solicitacao/devolucao_adiantamento/' + item.id)
              }
              if (item.tipo_solicitacao === 'Adiantamento') {
                this.$router.push('/solicitacao/adiantamento/' + item.id)
              }
              if (item.tipo_solicitacao === 'Contrapartida') {
                this.$router.push({path: '/solicitacao/contrapartida/' + item.id})
              }
              if (item.tipo_solicitacao === 'Prestação de Contas') {
                this.$router.push({path: '/solicitacao/prestacaocontas/' + item.id})
              }
              if (item.tipo_solicitacao === 'Pagamento') {
                this.$router.push({path: '/solicitacao/pagamento/' + item.id})
              }
              if (item.tipo_solicitacao === 'Ressarcimento') {
                this.$router.push({path: '/solicitacao/ressarcimento/' + item.id})
              }
            }
          })
        }
      },
      onAssign (request) {
        let atual = request.id_tarefa_atual
        axiosLaravel.put('processos/validacao/assumir/', {'id_tarefa': atual}).then((response) => {
          if (response.statusText === 'OK') {
            this.visibleForm = !this.visibleForm
          }
        })
      },
      goToApproval (request) {
        let path = ''
        let typePhase = this.getTypePhase(request)
        if (request.tipo_solicitacao === 'Pagamento' || typePhase === 'PAYMENT-MONITORING') {
          if (request.tipo_solicitacao === 'Ressarcimento') {
            this.$router.push({path: '/solicitacao/ressarcimento/' + request.id})
          } else {
            this.$router.push({path: '/solicitacao/pagamento/' + request.id})
          }
        } else if (request.tipo_solicitacao === 'Ressarcimento') {
          this.$router.push({path: '/solicitacao/ressarcimento/' + request.id})
        } else if (request.tipo_solicitacao === 'Contrapartida') {
          this.$router.push({path: '/solicitacao/contrapartida/' + request.id})
        } else if (request.tipo_solicitacao === 'Prestação de Contas' || typePhase === 'ACCOUNTABILITY-ANALYSIS' || typePhase === 'ACCOUNTABILITY-FINANCIAL_ANALYSIS') {
          this.$router.push({path: '/solicitacao/prestacaocontas/' + request.id})
        } else if (request.tipo_solicitacao === 'Adiantamento') {
          this.$router.push({path: '/solicitacao/adiantamento/' + request.id})
        } else if (request.tipo_solicitacao === 'Devolução de Adiantamento') {
          this.$router.push({path: '/solicitacao/devolucao_adiantamento/' + request.id})
        } else if (typePhase === 'ADVANCE_APPROVAL') {
          path += '/advance/do/accompany'
        } else if (typePhase === 'ADVANCE_APPROVAL_FINANCIAL_ANALYSIS') {
          path += '/advance/do'
        } else if (typePhase === 'ADVANCE_REFUND_APPROVAL') {
          path += '/advancerefund/do/analysis'
        } else if (typePhase === 'ADVANCEREFUND_FINANCIAL_ANALYSIS') {
          path += '/advancerefund/do'
        }
        this.$router.push(path)
      },
      authorizeEditRequest (request) {
        let auth = false
        if (this.usuarioLogado.entity) {
          if (_.includes(['Pagamento', 'Ressarcimento'], request.tipo_solicitacao) && request.eventType === 'PAYMENT_REVIEW') {
            auth = this.$root.authorize('solicitacao-pagamento-editar')
          } else if (request.tipo_solicitacao === 'Contrapartida' && request.eventType === 'Revisão pela entidade') {
            auth = this.$root.authorize('solicitacao-contrapartida-editar')
          } else if (request.tipo_solicitacao === 'Adiantamento' && request.etapa === 'Revisão pela entidade') {
            auth = this.$root.authorize('solicitacao-adiantamento-editar')
          } else if (request.tipo_solicitacao === 'Devolução de Adiantamento' && request.etapa === 'Revisão pela entidade') {
            auth = this.$root.authorize('solicitacao-devolucaoadiantamento-editar')
          } else if (request.tipo_solicitacao === 'Prestação de Contas' && request.eventType === 'Revisão pela entidade') {
            auth = this.$root.authorize('solicitacao-prestacaocontas-editar')
          }
        }
        return auth
      },
      autorizaValidacao (request) {
        let auth = false
        if (_.includes(['Pagamento', 'Ressarcimento'], request.tipo_solicitacao) && _.includes(['Análise', 'Análise Tributária', 'Liquidação'], request.etapa)) {
          auth = 'solicitacao-pagamento-analisar'
        } else if (_.includes(['Pagamento', 'Ressarcimento'], request.tipo_solicitacao) && request.etapa === 'Autorização') {
          auth = 'solicitacao-pagamento-acompanhar'
        } else if (request.tipo_solicitacao === 'Contrapartida' && request.etapa === 'Análise') {
          auth = 'solicitacao-contrapartida-analisar'
        } else if (request.tipo_solicitacao === 'Contrapartida' && request.etapa === 'Autorização') {
          auth = 'solicitacao-contrapartida-acompanhar'
        } else if (request.tipo_solicitacao === 'Prestação de Contas' && _.includes(['Análise', 'Análise Tributária', 'Liquidação'], request.etapa)) {
          auth = 'solicitacao-prestacaocontas-analisar'
        } else if (request.tipo_solicitacao === 'Prestação de Contas' && request.etapa === 'Autorização') {
          auth = 'solicitacao-prestacaocontas-analisefinanceira'
        } else if (request.tipo_solicitacao === 'Adiantamento' && request.etapa === 'Análise') {
          auth = 'solicitacao-adiantamento-analisar'
        } else if (request.tipo_solicitacao === 'Adiantamento' && request.etapa === 'Autorização') {
          auth = 'solicitacao-adiantamento-aprovar'
        } else if (request.tipo_solicitacao === 'Adiantamento' && request.etapa === 'Análise Financeira') {
          auth = 'solicitacao-adiantamento-analisefinanceira'
        } else if (request.tipo_solicitacao === 'Devolução de Adiantamento' && request.etapa === 'Análise') {
          auth = 'solicitacao-devolucaoadiantamento-analisar'
        } else if (request.tipo_solicitacao === 'Devolução de Adiantamento' && request.etapa === 'Análise Financeira') {
          auth = 'solicitacao-devolucaoadiantamento-analisefinanceira'
        }
        return auth && this.$root.authorize(auth)
      },
      getTypePhase (request) {
        // incluir Análise Tributária
        let typePhase
        if (_.includes(['Pagamento', 'Ressarcimento'], request.tipo_solicitacao) && request.etapa === 'Análise') {
          typePhase = 'PAYMENT-ANALYSIS'
        } else if (_.includes(['Pagamento', 'Ressarcimento'], request.tipo_solicitacao) && request.etapa === 'Autorização') {
          typePhase = 'PAYMENT-MONITORING'
        } else if (request.tipo_solicitacao === 'Contrapartida' && request.etapa === 'Análise') {
          typePhase = 'COUNTERPART-ANALYSIS'
        } else if (request.tipo_solicitacao === 'Prestação de Contas' && request.etapa === 'Análise') {
          typePhase = 'ACCOUNTABILITY-ANALYSIS'
        } else if (request.tipo_solicitacao === 'Prestação de Contas' && request.etapa === 'Autorização') {
          typePhase = 'ACCOUNTABILITY-FINANCIAL_ANALYSIS'
        } else if (_.includes(['Pagamento', 'Ressarcimento'], request.tipo_solicitacao) && request.etapa === 'Revisão pela entidade') {
          typePhase = 'PAYMENT_REVIEW'
        } else if (request.tipo_solicitacao === 'Adiantamento' && request.etapa === 'Revisão') {
          typePhase = 'ADVANCE_REVIEW'
        } else if (request.tipo_solicitacao === 'Adiantamento' && request.etapa === 'Autorização') {
          typePhase = 'ADVANCE_APPROVAL'
        } else if (request.tipo_solicitacao === 'Adiantamento' && request.etapa === 'Análise Financeira') {
          typePhase = 'ADVANCE_APPROVAL_FINANCIAL_ANALYSIS'
        } else if (request.tipo_solicitacao === 'Adiantamento' && request.etapa === 'Análise') {
          typePhase = 'ADVANCE_APPROVAL_ANALYSIS'
        } else if (request.tipo_solicitacao === 'Devolução de Adiantamento' && request.etapa === 'Análise') {
          typePhase = 'ADVANCE_REFUND_APPROVAL'
        } else if (request.tipo_solicitacao === 'Devolução de Adiantamento' && request.etapa === 'Análise Financeira') {
          typePhase = 'ADVANCE_REFUND_FINANCIAL_ANALYSIS'
        }
        return typePhase
      },
      onFiltered (filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.table.totalRows = filteredItems.length
        this.table.currentPage = 1
      },
      onSearch () {
        this.$forceUpdate()
        if (this.usuarioLogado.userType === 'ENTIDADE') {
          this.filtros.entityId = this.usuarioLogado.entity.id
        }
        if (this.filtros.requestDate) {
          this.filtros.requestDate = moment(this.filtros.requestDate).format()
        }
        this.items = null
        this.listaBackupFiltro = null
        this.loading.show = true
        this.pesquisa = (this.usuarioLogado.userType !== 'FUNDACAO' && this.pesquisa.length === 0) ? null : this.pesquisa

        let filtroSituacao = ''
        if (!_.isEmpty(this.situacaoFiltro)) {
          filtroSituacao = this.situacaoFiltro
        }
        axiosLaravel.post('processos/pesquisa/', {'termo': this.pesquisa, 'situacao': filtroSituacao}).then((response) => {
          // Limitar acesso a projetos
          let listaProjetos = response.data
          let acessosProjetos = _.get(this.usuarioLogado, 'configuracoes.acesso_projetos')
          if (acessosProjetos) {
            acessosProjetos.forEach((projeto) => {
              if (_.find(projeto.acesso, ['codigo', 'SEM_ACESSO'])) {
                _.remove(listaProjetos, function (item) {
                  return _.includes(item.projeto, projeto.numero)
                })
              }
            })
          }
          this.items = listaProjetos
          this.listaBackupFiltro = listaProjetos
          this.table.totalRows = response.data.length
          this.loading.show = false
          this.pesquisa = ''
          this.situacaoFiltro = null
          this.$forceUpdate()
          // Chama o restante dos dados
          // this.chamaRestante()
        })
          .catch((error) => {
            if (error) {
              this.$root.trataErro(error)
            }
          })
      },
      inativa (item) {
        axios.put('/proxy/project/requests' + item.id, item).then((response) => {
          item.approvalResultDesc = !item.approvalResultDesc
        })
          .catch((error) => {
            if (error) {
              this.$root.trataErro(error)
            }
          })
      },
      onNew () {},
      async cancelar (retorno, processo) {
        await axiosLaravel.put('processos/cancelar/' + processo.id).then((response) => {
          this.marcaCancelado(processo)
          this.$forceUpdate()
          this.$snotify.success('Processo cancelado com sucesso')
          processo.situacao = 'Cancelado'
          // this.onSearch()
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      chamaRestante () {
        axiosLaravel.get('processos').then((response) => {
          this.items = response.data
          this.table.totalRows = response.data.length
          this.$forceUpdate()
        })
          .catch((error) => {
            if (error) {
              this.$root.trataErro(error)
            }
          })
      },
      // 68448 - Voltar processo FEITO para APROVADO (Fase de liquidação) apenas em títulos processados em geração de remessa automática
      async solicitacaoReativarRemessa (processo) {
        var tipo = processo.tipo_solicitacao
        var id = processo.id
        var projeto = processo.projeto
        var $message = 'Deseja <b>REATIVAR</b> a solicitação de <font color=\'red\'>' + tipo + '</font>? <br><br> - ID: <i><font color=\'#00008b\'>' + id + '</font></i><br> - Projeto: <i><font color=\'#00008b\'>' + projeto + '</font></i></i>'

        this.$dialog
          .confirm($message)
          .then(($dialog) => {
            this.segueReativarRemessa(processo)
          })
          .catch(function (error) {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      async segueReativarRemessa (processo) {
        console.log('egueReativarRemessa - processo: ' + processo.id)
        this.$snotify.async('Reativando solicitação. Por favor, aguarde...', {timeout: 0})
        await axiosLaravel.put('processos/reativarPagamentoRemessa/' + processo.id).then(async (response) => {
          console.log('response.data RLMB', response.data)
          // await this.marcaReativado(response.data)
          this.$snotify.clear()
          this.$snotify.success('Solicitação reativada com sucesso!')
          processo.situacao = 'Em execução'
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      // 68772 Filtro de Situação de IDs
      filtrarSituacao () {
        console.log(this.situacaoFiltro)
        console.log(this.items)
        let situacao

        if (this.situacaoFiltro === 'EM_EXECUCAO') {
          situacao = 'Em Execução'
        }
        if (this.situacaoFiltro === 'FEITO') {
          situacao = 'Feito'
        }
        if (this.situacaoFiltro === 'CANCELADO') {
          situacao = 'Cancelado'
        }

        // Verifica se a lista de solicitações está vazia, caso não esteja, filtra a lista local
        if (!_.isEmpty(this.items)) {
          if (this.situacaoFiltro === 'TODOS') {
            this.items = _.cloneDeep(this.listaBackupFiltro) // Restaura a lista original
            console.log('RESETA FILTRO')
          } else {
            console.log('FILTRA')
            this.items = _.filter(this.listaBackupFiltro, { situacao: situacao })
          }
        }
      },
      // 68922 - Trava para evitar aberturas indevidas de Tarefas
      consultaAcessoReativacaoLiberacaoRecursos () {
        this.acessoReativarLiberacaoRecursos = false
        if (this.usuarioLogado && Array.isArray(this.usuarioLogado.perfis)) {
          const perfis = this.usuarioLogado.perfis
          for (let i = 0; i < perfis.length; i++) {
            if (perfis[i].id === 11 || perfis[i].id === 13 || perfis[i].id === 14 || perfis[i].id === 6) {
              this.acessoReativarLiberacaoRecursos = true
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
  .legenda {
    float: right;
    color: steelblue;
    font-weight: bold;
    cursor: pointer;
    padding-top: 5px;
    width: 100%;
    height: 35px;
    text-align: center;
  }
  .topo {
    top: 0.4%;
    height: 50%;
  }
  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }
  .dg-btn dg-btn--ok {
    background-color: green !important;
  }

  .debug {
    border: 1px solid red;
  }
</style>
