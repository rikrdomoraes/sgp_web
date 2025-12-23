<template>
  <div class="content-wrapper" ref="contentWrapper" id="liquidacoes" v-bind:style="'min-height: ' + alturaContentWrapper + 'px'">

    <vue-headful :title="'SGP - Geração de Remessa'"/>

    <section class="content-header">
      <h1> Liquidação Financeira</h1>
      <b-breadcrumb :items="[{text: 'Inicial', href: '/'}, {text: 'Remessa', href: '#'}, {text: 'Geração de Remessa', active: true}]"/>
    </section>

    <section class="content" style="padding-top: 20px;">
      <p class="visible-sm visible-xs nao_imprimir">&nbsp;</p><p class="visible-xs nao_imprimir">&nbsp;</p><p class="visible-xs nao_imprimir">&nbsp;</p>

      <table class="w100 imprimir">
        <tr>
          <td><img src="/static/img/logo-login.png" class="logo_relatorio"></td>
          <td></td>
          <td class="direita">
            <span style="font-size: 40px !important">Títulos Diversos</span>
          </td>
        </tr>
      </table>


      <!-- Títulos de Remessa (criação, consulta e alteração títulos nas remessas) -->
      <div class="box box-widget nao_imprimir">
        <div class="box-header with-border">
          <h3 class="box-title" v-if="_.isEmpty(remessa)"><i class="fa fa-calendar-check-o"></i> Preparação de Remessas de Pagamento Eletrônico</h3>
          <h3 class="box-title" v-else><i class="fa fa-pencil-square-o"></i> Consulta e Alteração de Remessas</h3>
        </div>

        <span class="box-body">
          <div v-show="loading.tela" class="overlay box box-widget" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

          <div class="col-lg-4" v-if="loading.portadores"><span class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Portadores...</span></div>
          <div class="col-lg-4" v-else>
            <multiselect v-model="portador"
                         :options="portadores"
                         :multiple="false"
                         placeholder="Selecione um Portador"
                         @input="portadorSelecionado"
                         :preselect-first="true"
                         label="DesPor"
                         track-by="DesPor"
                         :close-on-select="true"
                         selectLabel=""
                         deselectLabel=""
                         selectedLabel=""
                         name="portador"
                         :value="DesPor"
                         :disabled="!_.isEmpty(remessa)">

              <template slot="option" slot-scope="props">
                <div v-if="props.option.CodPor === 'Cabeçalho de portador'" class="col-md-12">
                  <div class="etiquetaPortador"><span>Portador</span><span>Agência e Conta</span></div>
                </div>
                <div v-else class="col-md-12">
                  <div class="etiquetaPortador"><span><strong>{{ props.option.CodPor }}</strong><span style="margin-left: 10px">{{ props.option.DesPor }}</span></span><span class="esmaecido">{{ props.option.CodPor === 'Todos' ? '' : props.option.CodAge + ' / ' + props.option.NumCco }}</span></div>
                </div>
              </template>
              <template slot="noResult">Nenhum registro localizado!</template>
              <template slot="singleLabel" slot-scope="props"><div class="etiquetaPortador"><span><strong>{{ props.option.CodPor }}</strong><span style="margin-left: 10px">{{ props.option.DesPor }}</span></span><span class="esmaecido">{{ props.option.CodPor === 'Todos' ? '' : props.option.CodAge + ' / ' + props.option.NumCco }}</span></div></template>
            </multiselect>
          </div>


          <div class="col-lg-3" v-if="loading.remessas"><span class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Remessas...</span></div>
          <div class="col-lg-3" v-else style="display: flex">
            <multiselect v-model="remessa"
                         :options="_.isEmpty(portador) || portador.CodPor === 'Todos' ? remessas : _.filter(remessas, ['CodPor', portador.CodPor])"
                         :multiple="false"
                         :placeholder="(_.isEmpty(portador) || portador.CodPor === 'Todos' ? remessas : _.filter(remessas, ['CodPor', portador.CodPor])).length + ' remessa(s)'"
                         @input="remessaSelecionada"
                         label="NumArb"
                         track-by="NumArb"
                         :close-on-select="true"
                         selectLabel=""
                         deselectLabel=""
                         selectedLabel=""
                         name="numero da remessa"
                         :value="NumArb">

              <template slot="option" slot-scope="props">
                <div v-if="props.option.CodPor === 'Cabeçalho de remessa'" class="col-md-12">
                  <div class="etiquetaPortador"><span>Portador</span><span>Remessa</span><span>Pagto.</span><span>Títulos</span></div>
                </div>
                <div v-else class="col-md-12">
                  <div class="etiquetaRemessa"><span class="text-muted"> {{ props.option.CodPor }}</span> <span class="text-bold">{{ props.option.NumArb }}</span> <span class="text-muted">{{ props.option.DatPgt }}</span> <span class="contadorRegistros" v-html="props.option.QtdeRegistros"></span></div>
                </div>
              </template>

              <template slot="noResult">Nenhum registro localizado!</template>
              <!--<template slot="option" slot-scope="props"><div class="etiquetaRemessa"><span class="text-muted"> {{ props.option.CodPor }}</span> <span class="text-bold">{{ props.option.NumArb }}</span> <span class="text-muted">{{ props.option.DatPgt }}</span> <span class="contadorRegistros" v-html="props.option.QtdeRegistros"></span></div></template>-->
              <template slot="singleLabel" slot-scope="props"><div class="etiquetaRemessa"><span class="text-muted"> {{ props.option.CodPor }}</span> <span class="text-bold">{{ props.option.NumArb }}</span> <span class="text-muted">{{ props.option.DatPgt }}</span> <span class="contadorRegistros" v-html="props.option.QtdeRegistros"></span></div></template>
            </multiselect>
            <button type="button" class="btn btn-default btn-flat" v-if="!_.isEmpty(remessa)" style="height: 40px;" @click="remessa = []; remessaSelecionada()"><i class="fa fa-remove"></i></button>
          </div>

          <div class="col-lg-5">
<!-- Preparando e criando remesas de pagamento ------------------------------------------------------------------------>
            <span v-if="_.isEmpty(remessa)">
              <g-button-ujarak color="primary" size="button--size-ss" @click.native="buscarTitulos(false)" :title="'<h5>Procura títulos em aberto para compor nova remessa</h5>'" v-tippy="{inertia: true, arrow: true, animation: 'perspective', distance: '1', size: 'large', arrow: true}"><i class="fa fa-search"></i> Buscar Títulos</g-button-ujarak>
              <g-button-ujarak v-if="(!_.isEmpty(titulos) && filtroTituloAprovado) || (listaVazia && filtroTituloAprovado)" color="warning" size="button--size-ss" @click.native="consultaNaoAprovados()" :title="'<h5>Mostra títulos Não-Aprovados</h5>'" v-tippy="{inertia: true, arrow: true, animation: 'perspective', distance: '1', size: 'large', arrow: true}"><i class="fa fa-times-circle"></i> Mostrar Não Aprovados</g-button-ujarak>
              <g-button-ujarak v-if="!_.isEmpty(titulos) && filtroTituloAprovado == false" color="success" size="button--size-ss" @click.native="limparFiltros()" :title="'<h5>Limpa filtro de títulos Não-Aprovados</h5>'" v-tippy="{inertia: true, arrow: true, animation: 'perspective', distance: '1', size: 'large', arrow: true}"><i class="fa fa-refresh"></i> Limpar Filtro</g-button-ujarak>
              <!--<g-button-ujarak color="error" size="button&#45;&#45;size-ss" v-if="titulos.length > 0" @click.native="consultarTitulos()"><i class="fa fa-ban"></i> Teste de Consulta</g-button-ujarak>-->
              <g-button-ujarak color="success" size="button--size-ss" v-if="titulos.length > 0 && titulosSelecionados.length > 0 && _.isEmpty(remessa) && processamentoRemessa.length === 0 && _.isEmpty(tituloEditando)" @click.native="gerarRemessa()" :title="'<h5>Cria arquivo(s) de remessa com <span class=\'realce\'>' + titulosSelecionados.length + '</span> item(ns) selecionado(s) abaixo</h5>'" v-tippy="{inertia: true, arrow: true, animation: 'perspective', distance: '1', size: 'large', arrow: true}"><i class="fa fa-gear"></i> Gerar Remessas</g-button-ujarak>
            </span>
            
<!-- Consultando remesas de pagamento cridas -------------------------------------------------------------------------->
            <span v-if="!_.isEmpty(remessa) && !loading.remessas">
              <g-button-ujarak color="warning" size="button--size-ss" @click.native="buscarTitulos(true)" :title="'<h5>Consultar a remessa <span class=\'realce\'>' + remessa.NumArb + '</span> e mostra seu conteúdo</h5>'" v-tippy="{inertia: true, arrow: true, animation: 'perspective', distance: '1', size: 'large', arrow: true}"><i class="fa fa-search"></i> Consulta Remessa</g-button-ujarak>
              <span v-if="titulos.length > 0 && processamentoRemessa.length === 0">
                <span v-if="titulosSelecionados.length === 0">
                  <g-button-ujarak color="error" size="button--size-ss" @click.native="gerarRemessa()" :title="'<h5>Excluirá a remessa <span class=\'realce\'>' + remessa.NumArb + '</span></h5>'" v-tippy="{inertia: true, arrow: true, animation: 'perspective', distance: '1', size: 'large', arrow: true}"><i class="fa fa-times"></i> Excluir Remessa</g-button-ujarak>
                </span>
                <span v-else>
                  <g-button-ujarak color="warning" size="button--size-ss" @click.native="gerarRemessa()" :title="'<h5>Altera a remessa <span class=\'realce\'>' + remessa.NumArb + '</span> que conterá o(s) <span class=\'realce\'>' + titulosSelecionados.length + '</span> item(ns) selecionado(s) abaixo</h5>'" v-tippy="{inertia: true, arrow: true, animation: 'perspective', distance: '1', size: 'large', arrow: true}"><i class="fa fa-gears"></i> Alterar Remessa</g-button-ujarak>
                </span>
              </span>
            </span>

<!-- Outros botões --------------------------------------------------------------------->
            <div class="pull-right" style="display: flex">
              <g-button-ujarak color="primary" size="button--size-ss" v-if="!_.isEmpty(remessa)" @click.native="emitir130(remessa.CodPor, remessa.NumArb)" :title="'<h5>Gerar PDF do relatório 130 da remessa <span class=\'realce\'>' + remessa.NumArb + '</span></h5>'" v-tippy="{inertia: true, arrow: true, animation: 'perspective', distance: '1', size: 'large', arrow: true}"><i class="fa fa-print"></i> Relatório 130</g-button-ujarak>
              <div class="espacamento_botoes"></div>
              <div :title="'<h5>Baixar <span class=\'realce\'>' + titulosSelecionados.length + '</span> item(ns) selecionado(s) em Excel</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"
                   v-if="titulos.length > 0 && titulosSelecionados.length > 0">
                <download-excel
                  :data   = "titulosSelecionados"
                  :meta   = "excelMeta"
                  :fields = "processamentoRemessa.length > 0 ? _.assign(excelCampos.basico, excelCampos.posProcessamento) : excelCampos.basico"
                  type    = "xls"
                  name    = "Títulos Selecionados.xls">
                  <g-button-ujarak color="primary" size="button--size-ss"><i class="fa fa-download" aria-hidden="true"></i> Baixar planilha</g-button-ujarak>
                </download-excel>
              </div>
            </div>

          </div>
            
          
<!-- Selecionar todos os registros na tela e contadores --------------------------------------------------------------->
          <div class="col-lg-12" v-if="titulos.length > 0">
            <div class="col-lg-12">&nbsp;</div><!-- pula linha -->
            <div class="col-lg-2">
              <span class="indicadores-cb-inline" :disabled="loading.tela">
                <div v-if="processamentoRemessa.length === 0">
                  <i @click="selecionarTodosItens(!(_.filter(titulos, function (t) { return !_.isEmpty(t.numcco) && !_.isEmpty(t.tippgt)}).length === titulosSelecionados.length && titulos.length > 0))"
                     :class="(_.filter(titulos, function (t) { return !_.isEmpty(t.numcco) && !_.isEmpty(t.tippgt)}).length === titulosSelecionados.length && titulos.length > 0 ? 'fa fa-check-square-o selecionado' : 'fa fa-square-o')" aria-hidden="true"></i>
                  <span :class="_.filter(titulos, function (t) { return !_.isEmpty(t.numcco) && !_.isEmpty(t.tippgt)}).length === titulosSelecionados.length && titulos.length > 0 ? 'selecionado' : ''" >Selecionar tudo </span>
                </div>
              </span>
            </div>
            <div class="col-lg-2">
              <span v-if="titulosSelecionados.length > 0 && processamentoRemessa.length === 0" class="esmaecido"><span style="color: var(--cor-azul);font-weight: bold;">{{titulosSelecionados.length}}</span> selecionado{{titulosSelecionados.length > 1 ? 's' : ''}} de </span>
              <span style="font-weight: bold;">{{titulos.length}}</span> <span class="esmaecido"> títulos</span>
            </div>
            <div class="col-lg-3">
              <span v-if="titulosSelecionados.length > 0 && processamentoRemessa.length === 0" class="esmaecido"><span style="color: var(--cor-azul);font-weight: bold;">{{ _.sumBy(titulosSelecionados, function (titulo) { return _.toNumber(titulo.vlrliq) }) | real }}</span> do </span>
              <span class="esmaecido">Total líquido </span> <span style="font-weight: bold;">{{ _.sumBy(titulos, function (titulo) { return _.toNumber(titulo.vlrliq) }) | real }}</span>
            </div>

            <div class="col-lg-2" v-if="titulosSelecionados.length > 0 && processamentoRemessa.length === 0">
              <div class="btn-group dropdown">
                <div class="btn-group">
                  <span class="esmaecido" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="cursor: pointer">
                    Previsão de <span style="color: var(--cor-azul);font-weight: bold;">{{ (_.keys(_.groupBy(titulosSelecionados, function (chave) { return chave.numcco + chave.tippgt }))).length }}</span>
                    remessa(s) <i class="fa fa-exclamation-circle"></i>
                  </span>

                  <div class="dropdown-menu">
                    <table class="table table-striped" style="width: 400px">
                      <thead><tr role="menuitem" class=""><th>Conta</th><th>Tipo</th><th>Títulos</th><th>Total</th></tr></thead>
                      <tbody>
                      <tr role="menuitem" v-for="remessa in _.values(_.groupBy(titulosSelecionados, function (chave) { return chave.numcco + chave.tippgt }))" class="">
                        <td>{{remessa[0].numcco}}</td><td>{{remessa[0].tippgt}}</td><td>{{remessa.length}}</td>
                        <td>{{_.sumBy(remessa, function (t) { return _.toNumber(t.vlrliq) }) | real}}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-3 pull-right">
              <span style="float: right;">
                <select class="form-control" v-model="ordenacao.por" style="width: auto; float: left;" :title="'<h5>Selecione por qual critério deseja ordenar</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                  <option value="id">ID</option>
                  <option value="tippgt">Tipo de Pagamento</option>
                  <option value="vlrliq">Valor Líquido</option>
                  <option value="numtit">Número do Título</option>
                  <option value="codtpt">Tipo do Título</option>
                  <option value="codfpg">Forma de Pagamento</option>
                </select>
                <button type="button" @click="ordenacao.ordem = ordenacao.ordem === 'asc' ? 'desc' : 'asc'" class="btn btn-default btn-flat" style="float: left;"
                        :title="'<h5>Clique para inverter a ordenação</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                  <i :class="'fa fa-sort-alpha-' + ordenacao.ordem" style="font-size: 14px;"></i>
                </button>
              </span>
            </div>

          </div>


<!-- Resultado da geração da remessa ---------------------------------------------------------------------------------->
          <span v-if="processamentoRemessa.length > 0">
            <div class="col-lg-12"><hr/></div>
            <span v-for="remessa in processamentoRemessa" class="row">
              <span v-if="!_.isNull(remessa.erroExecucao)">
                <div class="col-lg-12"><span class="label label-danger">{{remessa.erroExecucao}}</span></div>
              </span>
              <span v-else-if="_.get(remessa, 'retorno[0].tipRet')">
                <div class="col-lg-2">
                  <span v-if="remessa.remessa === 0" class="label label-danger"> Remessa não gerada</span>
                  <span v-if="remessa.remessa > 0 && (_.filter(remessa.retorno, ['tipRet', 2])).length === 0" class="label label-success"> Remessa {{_.isEmpty(remessa) ? 'gerada' : 'alterada'}} com sucesso </span>
                  <span v-if="remessa.remessa > 0 && (_.filter(remessa.retorno, ['tipRet', 2])).length > 0" class="label label-warning"> Remessa gerada com erros</span>
                </div>
                <span :class="remessa.remessa === 0 || (remessa.remessa > 0 && (_.filter(remessa.retorno, ['tipRet', 2])).length > 0) ? 'esmaecido' : ''">
                  <div class="col-lg-1">Portador: <b>{{remessa.portador.CodPor}}</b></div>
                  <div class="col-lg-1">Remessa: <b>{{remessa.remessa}}</b></div>
                  <div class="col-lg-1"><div class="contadorRegistros">{{remessa.retorno.length}}</div></div>
                  <div class="col-lg-7">Arquivo: <b>{{_.isNull(remessa.arquivoGerado) ? 'nenhum' : remessa.arquivoGerado}}</b></div>
                </span>
              </span>
            </span>
          </span>


<!-- Lista de Títulos da Remessa -------------------------------------------------------------------------------------->
          <div class="col-lg-12">&nbsp;</div>
          <div class="box-body">
            
            <div class="col-lg-12">

              <div v-for="titulo in ordenacao.por === 'vlrliq' ?
                  _.orderBy(titulos, [function(termo) { return parseFloat(termo[ordenacao.por]) }, ordenacao.por], [ordenacao.ordem]) :
                  _.orderBy(titulos, [ordenacao.por], [ordenacao.ordem])"
                   :class="'row tarefa ' +
              (_.has(titulo, 'processamento.tipRet') ? ' retornoProcessamento' + _.get(titulo, 'processamento.tipRet', '') : (_.find(titulosSelecionados, function(sel) { return sel.numtit + sel.codtpt + sel.codfor === titulo.numtit + titulo.codtpt + titulo.codfor }) ? 'selecionada' : ''))">
                <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" style="height: 46px;">
                  <span class="indicadores">
                    <span v-if="!_.isEmpty(titulo.numcco) && !_.isEmpty(titulo.tippgt)">
                      <span v-if="_.get(titulo, 'processamento.tipRet', '') === 1" class="label label-success">{{ titulo.processamento.remessa }}</span>
                      <span v-else-if="processamentoRemessa.length === 0">
                        <i @click="selecionarItem(titulo)" :class="(_.find(titulosSelecionados, function(sel) { return sel.numtit + sel.codtpt + sel.codfor === titulo.numtit + titulo.codtpt + titulo.codfor }) ? 'fa fa-check-square-o' : 'fa fa-square-o') + ' selecao'" class="nao_imprimir" aria-hidden="true"></i>
                      </span>
                    </span>
                    <span v-else><i class="fa fa-exclamation-triangle" style="color: var(--cor-atencao-light)" :title="'<h5>' + (_.isEmpty(remessa) ? 'Não pode incluir na remessa título' : 'Nesta remessa esse título está') + ' sem conta ou sem tipo de pagamento</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"></i></span>
                    <span class="text-muted">{{titulo.id}}</span>
                    <p class="truncar" :class="titulo.situacao === 'EM_EXECUCAO' ? 'text-green' : 'text-blue'">{{ enumeradores[titulo.situacao] }}</p>
                  </span>
                </div>

                <div class="col-lg-3 col-md-10 col-sm-10 col-xs-10" style="height: 46px;">
                  <div class="projeto truncar">{{titulo.numprj}} - {{titulo.nomprj}}</div>
                  <div class="fornecedor truncar">{{titulo.codfor}} - {{titulo.nomfor}}</div>
                </div>

                <div class="visible-xs col-xs-2" style="height: 46px;">&nbsp;</div>

                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style="height: 46px;">
                  <span>{{titulo.numtit}}</span>
                  <span v-if="_.get(titulo, 'datapr', '1900').substring(0, 4) === '1900'" :title="'<h5>Título não aprovado</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"><i class="fa fa-exclamation-triangle" style="color: var(--cor-alerta-light)"></i></span>
                  <span v-if="titulo.remessaAnterior === 'SIM' && _.isEmpty(remessa)" :title="'<h5>(!)Passou por remessa anteriormente</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"><i class="fa fa-exclamation-circle" style="color: var(--cor-destaque)"></i></span>
                  <br/>
                  <span class="text-bold">{{titulo.codtpt}}</span> / <span>{{titulo.codfor}}</span>
                </div>

                <div class="col-lg-1 col-md-2 col-sm-2 col-xs-3" style="height: 46px; display: flex; align-items: center;">
                  <span v-if="!_.isEmpty(remessa)">
                    <span :title="'<h5>' + (tiposPagamento.principais[titulo.tippgt] || tiposPagamento.outros[titulo.tippgt]) + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay:[500, 0]}">{{titulo.tippgt}}</span>
                  </span>
                  <span v-else>
                    <select v-model="titulo.tippgt" class="form-control" :disabled="processamentoRemessa.length > 0 || !_.isEmpty(tituloEditando)" :title="'<h5>' + (tiposPagamento.principais[titulo.tippgt] || tiposPagamento.outros[titulo.tippgt]) + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay:[500, 0]}">
                      <option v-for="(descricao, codigo) in tiposPagamento.principais" :value="codigo">{{codigo}} - {{descricao}}</option>
                      <option :value="null" disabled class="bg-gray">&nbsp;</option>
                      <option v-for="(descricao, codigo) in tiposPagamento.outros" :value="codigo">{{codigo}} - {{descricao}}</option>
                    </select>
                  </span>
                </div>

                <div class="col-lg-1 col-md-2 col-sm-2 col-xs-3" style="height: 46px;">
                  <span v-if="!_.includes(['AMT', 'AMP', 'MIS', 'MIX'], titulo.codtpt)" @click="processamentoRemessa.length === 0 ? editaTituloParaRemessa(titulo) : false" style="cursor: pointer;">
                    <span v-if="_.isNull(titulo.numcco)" class="label label-danger"><i class="fa fa-pencil"></i> sem conta</span>
                    <span v-if="!_.isNull(titulo.numcco)" class="link_acesso" @click="processamentoRemessa.length === 0 ? editaTituloParaRemessa(titulo) : false" style="cursor: pointer;"><i class="fa fa-pencil"></i> {{titulo.numcco}}</span>
                  </span>
                  <span v-else>{{titulo.numcco}}</span>
                  <br/>
                  <span>{{titulo.usu_mci}}</span>
                </div>

                <div class="col-lg-2 col-md-3 col-sm-3 col-xs-5" style="height: 46px;">
                  <div v-if="('' + titulo.codfpg) === '4' || _.isNull(titulo.codfpg)" class="truncar">
                    <span :class="processamentoRemessa.length === 0 ? 'link_acesso' : ''" @click="processamentoRemessa.length === 0 ? editaTituloParaRemessa(titulo) : false">
                      <span v-if="_.get(titulo, 'boleto.sucesso', false)"><i class="fa fa-pencil"></i> {{titulo.boleto.linhaDigitavel}}</span>
                      <span v-else class='label label-danger'><i class="fa fa-pencil"></i> sem código de barras</span>
                    </span>
                  </div>
                  <div v-else>{{titulo.codban}} <span class="esmaecido">/</span> {{titulo.codage}} <span class="esmaecido">/</span> {{titulo.ccbfor}}</div>
                  <div class="truncar">{{titulo.codfpg}} - {{titulo.desfpg}}</div>
                </div>

                <div class="visible-xs col-xs-2" style="height: 46px;">&nbsp;</div>

                <div class="col-lg-1 col-md-2 col-sm-2 col-xs-3" style="height: 46px;">
                  <span class="text-muted">{{titulo.vlrori | real}}</span> <br/>
                  <span>{{titulo.vlrliq | real}}</span>
                </div>

                <div class="col-lg-1 col-md-1 col-sm-1 col-xs-3 text-right" style="height: 46px; padding: 2px 0;">
                  <span v-if="!_.isNull(titulo.id) && _.isEmpty(tituloEditando)">
                    <g-button-ujarak color="primary" size="button--size-ss" @click.native="atribuirFazer(titulo)" v-if="titulo.situacao === 'EM_EXECUCAO'"
                                     :title="'<h5>Assumir e Fazer</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                      <i class="fa fa-pencil" aria-hidden="true"></i>
                    </g-button-ujarak>
                    <g-button-ujarak color="primary" size="button--size-ss" @click.native="segueReanalisarOuReativar(titulo.situacao, titulo.id, titulo)" v-else
                                     :title="'<h5>Está ' + enumeradores[titulo.situacao] + '. Clique para ' + (titulo.situacao === 'EM_EXECUCAO' ? 'Reanalisar' : 'Reativar') + ' este processo e devolver para Análise ' + (!_.isNull(titulo.numarb) ? '(será retirado desta remessa ' + titulo.numarb + ')' : '') + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                      <i :class="'fa fa-' + (titulo.situacao === 'EM_EXECUCAO' ? 'undo' : 'play')" aria-hidden="true"></i>
                    </g-button-ujarak>
                  </span>
                </div>


                <div class="col-md-12" v-if="!_.isEmpty(tituloEditando) && (tituloEditando.numtit + tituloEditando.codtpt + tituloEditando.codfor === titulo.numtit + titulo.codtpt + titulo.codfor)">
                  <div class="box-body well form-horizontal">

                    <!-- Código de Barras ----------------------------------------------------------------------------->
                    <div class="form-group required-field" v-if="('' + tituloEditando.codfpg) === '4' || _.isNull(tituloEditando.codfpg)" :class="{'has-error': errors.first('código de barras')}">
                      <label class="control-label col-md-2">Código de Barras:</label>
                      <div class="col-md-5">
                        <input type="text" v-model="tituloEditando.boleto.numeroInformadoTela" class="form-control" name="código de barras" @keyup="validaAjustaCodigoBarras" v-validate="'required'">
                        <span v-if="errors.first('código de barras')" class="label label-danger">{{ errors.first('código de barras') }}</span>
                        <span v-else-if="tituloEditando.boleto.sucesso" class="label label-success">
                          {{_.capitalize((tituloEditando.boleto.tipoCodigoInput + ' de ' + tituloEditando.boleto.tipoBoleto).replaceAll('_', ' ')) + ' correto!'}}
                        </span>
                      </div>
                    </div>

                    <!-- Conta Movimento - débito ----------------------------------------------------------------------------->
                    <div class="form-group required-field" :class="{'has-error': errors.first('conta')}">
                      <label class="control-label col-md-2">Conta:</label>
                      <div class="col-md-2">
                        <multiselect v-model="tituloEditando.numcco" :options="_.map(_.filter(portadores, function(p) { return p.CodPor !== 'Todos' }), 'NumCco')"
                                     placeholder="Selecione uma conta" selectLabel="" deselectLabel="" selectedLabel="" name="conta" v-validate="'required'">
                          <template slot="noResult">Nenhum registro localizado!</template>
                        </multiselect>
                        <span v-if="errors.first('conta')" class="label label-danger">{{ errors.first('conta') }}</span>
                      </div>
                    </div>

                    <div class="form-group">
                      <div class="col-md-10 col-md-offset-2">
                        <button @click="salvaEdicaoTituloParaRemessa()" type="button" class="btn btn-confirm btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Ok</button>
                        <button @click="cancelaEdicaoTituloParaRemessa()" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Retorno de processamento e outros alertas -------------------------------------------------------->
                <div class="box-body" v-if="_.get(titulo, 'processamento.tipRet', '') === 2">
                  <span v-for="detalhe in _.get(titulo, 'processamento.detalhes', [])" class="label label-danger">{{detalhe.msgRet}}<br/></span>
                </div>

              </div>

            </div>

          </div>

        </span>

      </div>

    </section>

  </div>

</template>

<script>
  import { mapGetters } from 'vuex'
  import boleto from '@mrmgomes/boleto-utils'

  export default {
    name: 'GeracaoRemessa',
    data () {
      return {
        portadores: [],
        portador: [],
        //
        remessas: [],
        remessa: [],
        //
        titulos: [],
        titulosBackup: [],
        titulosSelecionados: [],
        tituloEditando: null,
        //
        processamentoRemessa: [],
        diretorioDestino: null,
        loading: {
          tela: false,
          titulos: false,
          portadores: false,
          remessas: false
        },
        ordenacao: {
          por: 'codfpg',
          ordem: 'asc'
        },
        excelCampos: {
          basico: {
            'ID SGP': 'id',
            'Situação Processo ': 'situacao',
            'Projeto': 'numprj',
            'Cód. Entidade': 'codfor',
            'Título': 'numtit',
            'Tipo Título': 'codtpt',
            'Tipo de Pagamento': 'codfpg',
            'Forma de Pagamento': 'tippgt',
            'MCI Projeto': 'usu_mci',
            'Conta Movimento': 'numcco',
            'Banco': 'codban',
            'Agencia': 'codage',
            'Conta': 'ccbfor',
            'Cód. de Barras': 'boleto.linhaDigitavel',
            'Valor Original': 'vlrori',
            'Valor Líquido': 'vlrliq'
          },
          posProcessamento: {
            'Remessa': 'processamento.remessa'
          }
        },
        excelMeta: [[{'key': 'charset', 'value': 'utf-8'}]],
        enumeradores: { 'PAGAMENTO': 'Pagamento', 'PRESTACAO_DE_CONTAS': 'Prestação de Contas', 'LIQUIDACAO_FINANCEIRA': 'Liquidação Financeira', 'FEITO': 'Feito', 'EM_EXECUCAO': 'Em Execução', 'CANCELADO': 'Cancelado' },
        tiposPagamento: {
          principais: {'CC': 'Crédito em Conta Corrente', 'CP': 'Crédito em Conta Poupança', 'DF': 'DARF', 'PO': 'Pagamento Concessionária', 'PS': 'Guia da Previdência Social', 'TN': 'Títulos não registrados', 'TO': 'TED - Outro Titular', 'TR': 'Títulos registrados'},
          outros: {'CA': 'Cheque administrativo', 'CH': 'Cheque', 'CS': ' Crédito em Conta Salário', 'DB': 'Débito em Conta Corrente', 'DC': 'Documento em Crédito - Mesmo Titular', 'DJ': 'DARJ', 'DO': 'Documento de Crédito - Outro Titular', 'DP': 'Débito em Conta Poupança', 'DS': 'DARF Simples', 'DV': 'DPVAT', 'EC': 'Extrato de Conta Corrente', 'FG': 'FGTS', 'GS': 'GARE-SP (ICMS/DR/ITCMD)', 'IP': 'IPVA', 'LC': 'LICENCIAMENTO', 'OP': 'Ordem de Pagamento', 'OU': 'Outros Pagamentos', 'PA': 'Pagamento com Autenticação', 'PC': 'Pagamento p/ Cartão', 'PQ': 'PIX QR Code', 'PT': 'Pagamento Tributos', 'PX': 'PIX Transferência', 'TE': 'TED - Mesmo Titular'}
        },
        alturaContentWrapper: window.innerHeight - 51,
        filtroTituloAprovado: true,
        listaVazia: false
      }
    },
    watch: {
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    async created () {
      this.buscarPortadores()
      this.buscarRemessas()
    },
    methods: {
      buscarPortadores () {
        this.loading.portadores = true
        axiosLaravel.get('pagamento/portadores').then((response) => {
          console.log('Portadores: ', response.data)
          let portadores = response.data
          portadores.unshift({'CodPor': 'Todos', 'DesPor': '', 'CodBan': '', 'CodAge': '', 'NumCco': '', 'DirPrm': '', 'DirPrt': ''})
          portadores.unshift({'CodPor': 'Cabeçalho de portador', 'DesPor': '', 'CodBan': '', 'CodAge': '', 'NumCco': '', 'DirPrm': '', 'DirPrt': '', $isDisabled: true})
          this.portadores = portadores
          this.loading.portadores = false
        })
          .catch((error) => {
            this.loading.portadores = false
            this.$root.trataErro(error)
          })
      },
      buscarRemessas () {
        // Busca remessas em "dois turnos", consulta os primeiros X dias e depois os Y dias seguintes do BD para efeito de retorno mais rápido
        let dias = 30
        this.loading.remessas = true
        axiosLaravel.post('pagamento/remessas', {'faixa': '>=', 'corte': dias}).then((response) => {
          this.remessas = response.data
          this.remessas.unshift({'CodPor': 'Cabeçalho de remessa', 'DesPor': '', 'CodBan': '', 'CodAge': '', 'NumCco': '', 'DirPrm': '', 'DirPrt': '', $isDisabled: true})
          this.loading.remessas = false
          this.remessas.push({'NumArb': 'Carregando remessas mais antigas', 'CodPor': '', 'DatPgt': '', 'QtdeRegistros': '<i class=\'fa fa-refresh fa-spin\'></i>', $isDisabled: true})
          if (!_.isEmpty(this.remessa)) {
            this.remessa = _.find(this.remessas, {'CodPor': this.remessa.CodPor, 'NumArb': this.remessa.NumArb}) || []
          }
          //
          // 'Segundo turno' chamada complementar que ocorre em background e complementa os dados da primeira consulta
          axiosLaravel.post('pagamento/remessas', {'faixa': '<', 'corte': dias}).then((response) => {
            _.remove(this.remessas, {'NumArb': 'Carregando remessas mais antigas'})
            this.remessas = _.union(this.remessas, response.data)
            if (!_.isEmpty(this.remessa)) {
              this.remessa = _.find(this.remessas, {'CodPor': this.remessa.CodPor, 'NumArb': this.remessa.NumArb}) || []
            }
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        })
          .catch((error) => {
            this.loading.remessas = false
            this.$root.trataErro(error)
          })
      },
      inicializandoListas () {
        this.processamentoRemessa = []
        this.titulos = []
        this.titulosBackup = []
        this.titulosSelecionados = []
        this.tituloEditando = null
      },
      portadorSelecionado () {
        if (this.processamentoRemessa.length > 0) {
          this.inicializandoListas()
        }
        let titulos = _.clone(this.titulosBackup)
        this.titulos = this.portador.CodPor === 'Todos' ? titulos : _.filter(titulos, ['numcco', this.portador.NumCco])
        this.remessa = []
        this.selecionarTodosItens(this.processamentoRemessa.length > 0)
      },
      remessaSelecionada () {
        this.inicializandoListas()
        this.selecionarTodosItens(false)
        this.portador = _.find(this.portadores, ['CodPor', !_.isEmpty(this.remessa) ? this.remessa.CodPor : 'Todos'])
      },
      buscarTitulos (selecionaTudo) {
        this.loading.tela = true
        this.inicializandoListas()
        axiosLaravel.post('pagamento/titulos', {'remessa': _.isPlainObject(this.remessa) ? this.remessa : null}).then((response) => {
          console.log('Titulos para Remessa: ', response.data)
          let titulos = response.data.retorno
          titulos.forEach((titulo) => {
            if (_.isEmpty(titulo.numcco) && !_.isEmpty(this.remessa)) { // Quando se tratar de consulta a uma remessa, caso o titulo não tenha número de conta, então atribui a conta do portador da remessa ao titulo
              _.set(titulo, 'numcco', _.get(_.find(this.portadores, ['CodPor', titulo.codpor]), 'NumCco', null))
            }
            titulo.boleto = this.jsonValido(titulo.boleto)
            if (('' + titulo.codbar).length > 10) {
              // 70644 - Carregamento de Remessa bloqueado por retorno de titulo invalido
              titulo.boleto = boleto.validarBoleto(titulo.boleto.linhaDigitavel, boleto.identificarTipoCodigo(titulo.codbar))
              _.set(titulo.boleto, 'numeroInformadoTela', titulo.boleto.linhaDigitavel)
            }
            // 68448 - quando houver código de barras sugerir TR/TN ao invés de TO
            if (typeof titulo.boleto !== 'undefined' && titulo.codfpg === 4 && titulo.boleto.mens) {
              console.log(titulo)
              // 70525 - Verificacao de preenchimento de código do boleto
              if (!_.isNull(titulo.boleto.codigoBarras) && titulo.boleto.codigoBarras.startsWith('001')) {
                _.set(titulo, 'tippgt', 'TR')
              } else {
                if (!_.isNull(titulo.boleto.codigoBarras)) {
                  _.set(titulo, 'tippgt', 'TN')
                }
              }
            }
          })
          this.titulos = titulos
          // Consulta via ws para pegar valores líquidos e tipo de pagamento
          let selecaoTitulosProcessamentoRemessa = this.titulos.length === 0 ? [[]] : _.values(_.groupBy(this.titulos, function (chave) { return chave.numcco }))
          let qtdeTitulosProcessamentoRemessa = selecaoTitulosProcessamentoRemessa.length
          console.log('selecaoTitulosProcessamentoRemessa ', selecaoTitulosProcessamentoRemessa)
          selecaoTitulosProcessamentoRemessa.forEach((titulosAgrupados) => {
            --qtdeTitulosProcessamentoRemessa
            let portador = _.find(this.portadores, ['NumCco', _.get(titulosAgrupados, '[0].numcco')]) || _.find(this.portadores, ['CodPor', _.get(this.remessa, 'CodPor')])
            let diretorio = _.isNull(this.diretorioDestino) ? (_.has(portador, 'DirPrm') ? portador.DirPrm : null) : this.diretorioDestino
            let remessa = _.isEmpty(this.remessa) ? null : this.remessa.NumArb
            if (portador && !_.isNull(portador)) {
              axiosLaravel.post('pagamento/buscaTitulosRemessa', {'portador': portador, 'diretorio': diretorio, 'titulos': titulosAgrupados, 'remessa': remessa, 'processar': false}).then((response) => {
                // console.log('   retorno', response.data)
                this.titulos.forEach((titulo) => {
                  // console.log('      titulo', [titulo.numtit, titulo.codtpt, titulo.codfor])
                  let tituloConsultado = _.find(response.data, function (consulta) { return consulta.numTit + consulta.codTpt + consulta.codFor === titulo.numtit + titulo.codtpt + titulo.codfor })
                  // console.log('      tituloConsultado', tituloConsultado)
                  if (_.has(tituloConsultado, 'tipPgt') && _.has(tituloConsultado, 'vlrLiq')) {
                    _.set(titulo, 'tippgt', tituloConsultado.tipPgt)
                    if (!_.includes(['AMP', 'AMT'], tituloConsultado.codTpt)) {
                      _.set(titulo, 'vlrliq', '' + tituloConsultado.vlrLiq)
                    }
                  }
                  // 68448 - quando houver código de barras sugerir TR/TN ao invés de TO
                  if (typeof titulo.boleto !== 'undefined' && titulo.codfpg === 4) {
                    if (titulo.boleto.codigoBarras.startsWith('001')) {
                      _.set(titulo, 'tippgt', 'TR')
                    } else {
                      _.set(titulo, 'tippgt', 'TN')
                    }
                  }
                })
                this.titulosBackup = _.clone(this.titulos)
                if (qtdeTitulosProcessamentoRemessa === 0) { // Se terminou a lista de remessa de títulos para processar
                  console.log('      Finalizado normal')
                  this.loading.tela = false
                  this.selecionarTodosItens(selecionaTudo)
                }
                // 68903 - Filtrar titulos com status NAO APROVADO
                this.filtrarNaoAprovados(selecionaTudo)
                console.log(titulos)
                if (_.isEmpty(this.titulos)) {
                  this.listaVazia = true
                } else {
                  this.listaVazia = false
                }
              })
                .catch((error) => {
                  if (qtdeTitulosProcessamentoRemessa === 0) { // Se terminou a lista de remessa de títulos para processar
                    console.log('      Finalizado catch')
                    this.loading.tela = false
                    this.selecionarTodosItens(selecionaTudo)
                  }
                  if (portador && !_.isNull(portador)) {
                    this.$root.trataErro(error)
                  }
                })
            } else {
              if (qtdeTitulosProcessamentoRemessa === 0) { // Se terminou a lista de remessa de títulos para processar
                console.log('      Finalizado else')
                this.loading.tela = false
                this.selecionarTodosItens(selecionaTudo)
              }
              console.log('Portador nulo', portador)
            }
          })
        })
          .catch((error) => {
            this.loading.tela = false
            this.$root.trataErro(error)
          })
      },
      gerarRemessa () {
        this.loading.tela = true
        let selecaoTitulosProcessamentoRemessa = this.titulosSelecionados.length === 0 ? [[]] : _.values(_.groupBy(this.titulosSelecionados, function (chave) { return chave.numcco + chave.tippgt }))
        let qtdeRemessasParaProcessar = selecaoTitulosProcessamentoRemessa.length
        // console.log(selecaoTitulosProcessamentoRemessa)
        // if (selecaoTitulosProcessamentoRemessa) {
        //   return
        // }
        let excluidos = []
        // Cria uma lista de títulos "excluidos" da geração/alteração da remessa
        this.titulosBackup.forEach((titulo) => {
          if (!_.find(this.titulosSelecionados, function (sel) { return sel.numtit + sel.codtpt + sel.codfor === titulo.numtit + titulo.codtpt + titulo.codfor })) {
            excluidos.push(titulo)
          }
        })
        selecaoTitulosProcessamentoRemessa.forEach((titulos) => {
          // console.log(titulos)
          let portador = _.find(this.portadores, ['NumCco', _.get(titulos, '[0].numcco')]) || _.find(this.portadores, ['CodPor', _.get(this.remessa, 'CodPor')])
          let diretorio = _.isNull(this.diretorioDestino) ? portador.DirPrm : this.diretorioDestino
          let remessa = _.isEmpty(this.remessa) ? null : this.remessa.NumArb
          let data = _.isEmpty(this.remessa) ? null : this.remessa.DatPgt
          axiosLaravel.post('pagamento/gerarRemessa', {'portador': portador, 'diretorio': diretorio, 'titulos': titulos, 'remessa': remessa, 'data': data, 'excluidos': excluidos}).then((response) => {
            let remessaResultado = response.data
            if (!_.isNull(remessaResultado.erroExecucao)) {
              this.$snotify.error(remessaResultado.erroExecucao)
            }
            if (!_.isArray(remessaResultado.retorno)) {
              remessaResultado.retorno = [remessaResultado.retorno] // Quando só tem um registro de retorno, o PHP devolve como sendo um Objeto, neste caso é convertido para um array
            }
            // Copia os dados de retorno para o título equivalente selecionado na tela
            remessaResultado.retorno.forEach((tituloProcessado) => {
              _.set(tituloProcessado, 'remessa', remessaResultado.remessa) // Adiciona o número da remessa para facilitar exibição na listagem
              let tituloSelecionado = _.find(this.titulos, {'numtit': tituloProcessado.numTit, 'codtpt': tituloProcessado.codTpt, 'codfor': tituloProcessado.codFor})
              if (tituloSelecionado) {
                if (_.has(tituloProcessado, 'detalhes') && !_.isArray(tituloProcessado.detalhes)) {
                  tituloProcessado.detalhes = [tituloProcessado.detalhes] // Quando só tem um registro de erro, o PHP devolve como sendo um Objeto, neste caso é convertido para um array
                }
                _.set(tituloSelecionado, 'processamento', tituloProcessado)
              }
            })
            if (remessaResultado.retorno.length === 1 && _.isNull(remessaResultado.retorno[0]['numTit'])) {
              remessaResultado.erroExecucao = remessaResultado.retorno[0]['detalhes']['msgRet']
            }
            _.set(remessaResultado, 'portador', portador)
            this.processamentoRemessa.push(remessaResultado)
            if (--qtdeRemessasParaProcessar === 0) { this.finalizaGeracaoRemessa() } // Se terminou a lista de títulos para processar
          })
            .catch((error) => {
              if (--qtdeRemessasParaProcessar === 0) { this.finalizaGeracaoRemessa() } // Se terminou a lista de títulos para processar
              this.$root.trataErro(error)
            })
        })
      },
      finalizaGeracaoRemessa () {
        this.$snotify.clear()
        this.buscarRemessas()
        this.processamentoRemessa = _.orderBy(this.processamentoRemessa, ['portador.CodPor', 'remessa'], ['asc', 'asc'])
        this.titulos = _.orderBy(_.remove(this.titulos, function (t) { return _.has(t, 'processamento') }), ['numcco', 'processamento.remessa'], ['asc', 'asc'])
        this.titulosBackup = _.clone(this.titulos)
        this.loading.tela = false
        this.processamentoRemessa.forEach((remessa) => {
          if (remessa.remessa !== 0) { this.emitir130(remessa.portador.CodPor, remessa.remessa) }
        })
        // 68448 - Organizacao de arquivos gerados na remessa
        this.moverArquivos()
      },
      editaTituloParaRemessa (titulo) {
        if (!titulo.boleto) { // Se não tiver boleta, no início da edição inicializa o objeto
          titulo.boleto = {sucesso: false, mensagem: null, tipoCodigoInput: null, tipoBoleto: null, codigoBarras: null, linhaDigitavel: null, numeroInformadoTela: null, vencimento: null, valor: null}
        }
        this.tituloEditando = _.clone(titulo)
      },
      salvaEdicaoTituloParaRemessa () {
        if (!this.errors.first('código de barras') && !this.errors.first('conta')) {
          let titulo = {'numtit': this.tituloEditando.numtit, 'codtpt': this.tituloEditando.codtpt, 'codfor': this.tituloEditando.codfor}
          this.titulos[_.findIndex(this.titulos, titulo)] = _.clone(this.tituloEditando)
          this.titulosBackup[_.findIndex(this.titulosBackup, titulo)] = _.clone(this.tituloEditando)
          this.titulosSelecionados[_.findIndex(this.titulosSelecionados, titulo)] = _.clone(this.tituloEditando)
          this.tituloEditando = null
          this.$forceUpdate()
        }
      },
      cancelaEdicaoTituloParaRemessa () {
        this.tituloEditando = null
      },
      validaAjustaCodigoBarras () {
        let numeroInformadoLimpo = ('' + this.tituloEditando.boleto.numeroInformadoTela).replace(/\D+/g, '')
        if (numeroInformadoLimpo.length > 0 && (('' + this.tituloEditando.codfpg) === '4' || _.isNull(this.tituloEditando.codfpg))) {
          let tipo = boleto.identificarTipoCodigo(numeroInformadoLimpo)
          this.errors.remove('código de barras')
          if (tipo === 'TAMANHO_INCORRETO' || !_.includes([44, 47, 48], numeroInformadoLimpo.length)) {
            this.errors.add({field: 'código de barras', msg: 'Tamanho do número incorreto!'})
          } else {
            let validacao = boleto.validarBoleto(numeroInformadoLimpo, tipo)
            if (validacao.sucesso) {
              this.tituloEditando.boleto = validacao
              _.set(this.tituloEditando.boleto, 'numeroInformadoTela', numeroInformadoLimpo)
            } else {
              let mensagem = _.capitalize(tipo.replaceAll('_', ' ')) + ' acima está incorreto!'
              this.errors.add({field: 'código de barras', msg: mensagem})
            }
          }
        }
      },
      salvarConfiguracoes () {
        // TODO criar chamada background, tal como para configuraçoes de usuario para guardar todas as ações executadas
        // TODO guardarHistoricoAcoes () {
        let vm = this
        _.set(this.usuarioLogado, 'configuracoes.tela_liquidacao', {
          'selecionado': vm.selecionado
        })
        //
        axiosLaravel.post('/usuario/configuracoes', {'configuracoes': this.usuarioLogado.configuracoes}).then((response) => {
          console.log('configuracoes', this.usuarioLogado.configuracoes)
        })
          .catch((error) => {
            if (error) {
              console.log('error', error)
              this.$root.trataErro(error)
            }
          })
      },
      selecionarItem (item) {
        let jaSelecionado = _.find(this.titulosSelecionados, function (sel) { return sel.numtit + sel.codtpt + sel.codfor === item.numtit + item.codtpt + item.codfor })
        if (jaSelecionado) {
          _.remove(this.titulosSelecionados, jaSelecionado)
        } else {
          this.titulosSelecionados.push(item)
        }
        this.$forceUpdate()
      },
      selecionarTodosItens (selecionaTudo = true) {
        this.titulosSelecionados = []
        if (selecionaTudo) {
          this.titulos.forEach((titulo) => {
            if (!_.isEmpty(titulo.numcco) && !_.isEmpty(titulo.tippgt)) {
              this.titulosSelecionados.push(titulo)
            }
          })
        }
        this.$forceUpdate()
      },
      segueReanalisarOuReativar (situacao, idProcesso, titulo) {
        // TODO ao reativar ou reanalisar um processo, deve retirar da remesse se estiver em uma, reativar processo e desaprovar titulo
        let vm = this
        let acao = _.includes(['FEITO', 'CANCELADO'], situacao) ? 'reativar' : 'reanalisar'
        let numeroRemessa = _.get(titulo, 'numarb')
        this.$dialog.confirm('Tem certeza que deseja ' + acao + ' esta solicitação de id <b>' + idProcesso + '</b>? ' + (numeroRemessa ? '<br/>Ao confirmar ele será excluída desta remessa ' + numeroRemessa : ''), {html: true, animation: 'fade', customClass: 'avisoConfirmacao'}).then(function (dialog) {
          vm.loading.tela = true
          let rota = 'processos/' + acao + '/'
          vm.$snotify.async('Processando ação para ' + acao + ' esta solicitação...', {timeout: 0})
          axiosLaravel.put(rota + idProcesso).then((response) => {
            console.log('acao > response', acao, response)
            vm.$snotify.clear()
            vm.$snotify.success('ID ' + idProcesso + ' movido para análise!')
            _.remove(vm.titulos, ['id', idProcesso])
            _.remove(vm.titulosSelecionados, ['id', idProcesso])
            vm.titulosBackup = _.clone(vm.titulos)
            vm.loading.tela = false
            if (!_.isNull(numeroRemessa)) {
              vm.$snotify.async('Excluído título ' + titulo.numtit + '/' + titulo.codtpt + '/' + titulo.codfor + ' da remessa ' + numeroRemessa + '...', {timeout: 0})
              vm.gerarRemessa()
            }
          })
            .catch((error) => {
              vm.$snotify.clear()
              vm.loading.tela = false
              vm.$root.trataErro(error)
            })
          //
        }).catch(function () {
        })
      },
      atribuirFazer (item) {
        console.log('atribuirFazer (item)', item)
        console.log('  validacao de usuario', ('' + item.id_usuario), ('' + this.usuarioLogado.id))
        if (('' + item.id_usuario) !== ('' + this.usuarioLogado.id)) {
          console.log('    usuario diferente', item.id_usuario, this.usuarioLogado.id)
          axiosLaravel.put('processos/validacao/assumir/', {'item': item, 'id_tarefa': item['id_tarefa_atual']}).then((response) => {
            console.log('      Tarefa assumida', response)
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        }
        this.$router.push({name: 'solicitacao-pagamento', params: {id: item.id, row: item, acao: 'VALIDAR'}})
      },
      jsonValido (json) {
        // Aceita objeto ou string que represente objeto ou array válidos, não aceita números, funções, strings vazias, null etc
        try {
          if (typeof json !== 'string' && typeof json !== 'object') {
            json = undefined
          } else if (typeof json === 'string' && json.length > 0) {
            json = JSON.parse(json)
          } else if (typeof json === 'object') {
            json = JSON.parse(JSON.stringify(json))
          } else {
            json = undefined
          }
          json = _.isObjectLike(json) ? json : undefined
        } catch (e) {
          if (e instanceof SyntaxError) {
            json = undefined
          }
        }
        return json
      },
      emitir130 (portador, remessa, dataPagamento = null) {
        this.loading.tela = true
        let parametros = '<ECodPor=' + portador + '>,<ENumRem=' + remessa + '>' + (!_.isNull(dataPagamento) ? '>,<EDatPgt=' + dataPagamento + '>' : '')
        this.$snotify.async('Gerando relatório 130 para Portador ' + portador + ' e Remessa ' + remessa + ' ...', {timeout: 0})
        axiosLaravel.post('relatorio-erp/emitir', {erpReport: {'ds_codigo': 'FPCP130.GER'}, params: parametros}).then((response) => {
          this.onDownload(response, '130' + ' » ' + portador + ' » ' + remessa)
          this.loading.tela = false
        })
          .catch((error) => {
            this.$snotify.clear()
            this.loading.tela = false
            this.$root.trataErro(error)
          })
      },
      onDownload (response, relatorio) {
        let item = response.data.arquivo
        const contentType = 'application/pdf'
        const b64Data = response.data.arquivo
        let file = this.b64toBlob(b64Data, contentType)
        let ie = !!window.MSInputMethodContext && !!document.documentMode
        if (!ie) {
          let blob = file
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = 'Relatório ' + relatorio
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } else {
          let blob = file
          let link = document.createElement('blob')
          link.href = window.navigator.msSaveOrOpenBlob(blob, item.name)
          link.download = 'Relatório ' + relatorio
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
      // 68448 - Organizacao de arquivos gerados na remessa
      moverArquivos () {
        console.log('EXECUTANDO BATCH')
        this.$snotify.warning('Organizando arquivos no servidor...')
        axiosLaravel.get('/pagamento/moverArquivos')
          .then(response => {
          // Lógica a ser executada após a resposta bem-sucedida
            console.log(response.data)
            this.$snotify.clear()
            this.$forceUpdate()
            this.$snotify.success('Organização de arquivos concluída com sucesso!')
          })
          .catch(error => {
        // Lógica de tratamento de erro
            console.error(error)
            this.$snotify.clear()
          })
      },
      // 68903 - Filtrar titulos com status NAO APROVADO
      filtrarNaoAprovados (buscaRemessa) {
        if (buscaRemessa) {
          return
        }
        let titulosFiltrados = this.titulosBackup.filter(titulo => {
          const datapr = _.get(titulo, 'datapr', '1900').substring(0, 4)
          return datapr !== '1900'
        })
        this.titulos = titulosFiltrados
      },

      limparFiltros () {
        let titulosFiltrados = this.titulosBackup.filter(titulo => {
          const datapr = _.get(titulo, 'datapr', '1900').substring(0, 4)
          return datapr !== '1900'
        })
        this.titulos = titulosFiltrados
        this.filtroTituloAprovado = true
      },
      consultaNaoAprovados () {
        let titulosFiltrados = this.titulosBackup.filter(titulo => {
          const datapr = _.get(titulo, 'datapr', '1900').substring(0, 4)
          return datapr === '1900'
        })
        this.titulos = titulosFiltrados
        this.filtroTituloAprovado = false
      }
    }
  }
</script>

<style scoped>
  #liquidacoes .esmaecido {
    color: var(--cor-fraca);
  }

  #liquidacoes .indicadores-cb-inline div {
    display: inline;
  }
  #liquidacoes .indicadores-cb-inline div span {
    font-size: 14px;
    color: gray;
    vertical-align: text-bottom;
    padding-right: 15px;
  }
  #liquidacoes .indicadores-cb-inline div i {
    font-size: 20px;
    cursor: pointer;
  }
  #liquidacoes .indicadores-cb-inline div i:hover, .indicadores-cb-inline .selecionado {
    color: var(--cor-azul);
  }

  #liquidacoes .indicadores {
    font-size: 16px;
    color: silver;
  }

  #liquidacoes .indicadores i.selecao {
    cursor: pointer;
    padding-right: 10px;
  }

  #liquidacoes .indicadores i.selecao:hover {
    color: steelblue;
  }

  #liquidacoes .projeto {
    font-weight: bold;
  }
  #liquidacoes .fornecedor {
    font-style: italic;
  }
  #liquidacoes .tarefa:hover {
    background: #ecf0f5;
  }
  #liquidacoes .tarefa {
    border-top: 1px solid silver;
  }
  #liquidacoes .tarefa.selecionada {
    background: #dcebff;
  }
  #liquidacoes .truncar {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  #liquidacoes .retornoProcessamento1 {
    background: #dfd;
  }
  #liquidacoes .retornoProcessamento2 {
    background: #fdd;
  }

  #liquidacoes .etiquetaPortador, #liquidacoes .etiquetaRemessa, #liquidacoes .etiquetaRetorno {
    display: flex;
    justify-content: space-between;
  }

  #liquidacoes .esmaecido .contadorRegistros {
    display: none;
  }
  #liquidacoes .contadorRegistros {
    border-radius: 20px;
    background: steelblue;
    font-size: 14px;
    color: white;
    width: 20px;
    height: 20px;
    text-align: center;
    vertical-align: middle;
  }


/*Impressão *************************************************/
  #liquidacoes div.imprimir, #liquidacoes span.imprimir {
    display: none !important;
  }

  @media print {
    .control-label {
      text-transform: uppercase;
    }

    #liquidacoes div.nao_imprimir, #liquidacoes i.nao_imprimir, #liquidacoes p.nao_imprimir {
      display: none !important;
    }

    #liquidacoes table.nao_imprimir {
      visibility: collapse !important;
    }

    #liquidacoes div.imprimir, #liquidacoes span.imprimir {
      display: block !important;
    }

    #liquidacoes table.imprimir {
      visibility: visible !important;
    }
    #liquidacoes .zoom70 {
      zoom: .7;
    }
  }
</style>
