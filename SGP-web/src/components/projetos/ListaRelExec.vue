<template>
  <div class="content-wrapper relatorio_execucao" style="min-height: 870px;">

    <vue-headful :title="titulo"/>

    <div class="fade-transition">
      <section class="content-header">
        <h1>{{modoEdicao ? 'Editando os Relatórios de Execução' : 'Relatórios de Execução'}}

          <span v-if="usuarioLogado.userType === 'FUNDACAO' && !loading.carregando && !loading.processando && relatorios.length > 0">
            <span v-if="modoEdicao">
              <g-button-moema color="success" @click.native="concluirAlteracaoListaRelatorios" type="button"><i class="fa fa-check" aria-hidden="true"></i> Concluir</g-button-moema>
              <g-button-moema color="warning" size="button--size-ss" @click.native="cancelarAlteracaoListaRelatorios"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</g-button-moema>
            </span>
            <span v-else>
              <g-button-moema color="primary" @click.native="alterarListaRelatorios" type="button"><i class="fa fa-tasks" aria-hidden="true"></i> Alterar Cronograma</g-button-moema>
            </span>
          </span>

          <div class="espacamento_botoes"></div>
          <g-button-moema color="primary" size="button--size-ss" @click.native="$router.push({name: 'projeto', params: { numero: projeto.numero }})" :title="'<h5>Vai para a tela deste Projeto</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"> <i class="fa fa-rocket" aria-label="false"></i> Projeto</g-button-moema >

          <div class="espacamento_botoes"></div>
          <i class="fa fa-question-circle icone_ajuda" aria-hidden="true" @click="configuracoes.tutorial.concluido = false; configuracoes.tutorial.passo = 1"
             :title="'<h5>Clique aqui para iniciar o tutorial</h5>'" v-if="relatorios.length > 0"
             v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"></i>
        </h1>

        <b-breadcrumb :items="[{text: 'Inicial', href: '/'}, {text: 'Projeto', href: '#'}, {text: 'Relatório de execução', active: true}]"/>
      </section>

      <section class="content">

        <div class="row tutorial" v-if="!configuracoes.tutorial.concluido && relatorios.length > 0">
          <div class="col-md-12">

            <div class="box box-primary">
              <div class="box-header">
                <h3 class="box-title" style="width: 100%">
                    <i class="fa fa-file-text-o" aria-hidden="true"></i> Tutorial
                </h3>

                <div class="col-md-12">
                  <div class="col-md-5">
                    <vue-slider
                      v-model="configuracoes.tutorial.passo"
                      :min="1" :max="usuarioLogado.userType === 'FUNDACAO' ? 13 : 7"
                      :adsorb="true"
                      :marks="true"
                      :tooltip="'none'"
                      :drag-on-click="true"
                      @drag-end="salvarConfiguracoes">
                      <template v-slot:step="{ label, active }">
                        <div :class="['passo', { active }]"></div>
                      </template>

                    </vue-slider>
                  </div>

                  <div class="col-md-1 btn btn-default" @click="configuracoes.tutorial.passo++; salvarConfiguracoes()" v-if="configuracoes.tutorial.passo < (usuarioLogado.userType === 'FUNDACAO' ? 13 : 7)">Próximo <i class="fa fa-caret-right" aria-hidden="true"></i></div>
                  <div class="col-md-1 btn btn-default" @click="configuracoes.tutorial.concluido = true; salvarConfiguracoes()" v-if="configuracoes.tutorial.passo !== (usuarioLogado.userType === 'FUNDACAO' ? 13 : 7)" :title="'<h5>Ao clicar você fecha este tutorial sem concluí-lo.<br/>Para reabrí-lo basta clicar em <i class=\'fa fa-question-circle icone_ajuda\'></i> </h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Pular <i class="fa fa-ban" aria-hidden="true"></i></div>
                  <div class="col-md-2 btn btn-success" @click="configuracoes.tutorial.concluido = true; salvarConfiguracoes()" v-if="configuracoes.tutorial.passo === (usuarioLogado.userType === 'FUNDACAO' ? 13 : 7)"><i class="fa fa-check" aria-hidden="true"></i> Entendi<br/>Clique para concluir</div>
                </div>
              </div>

              <div class="box-body" v-if="configuracoes.tutorial.passo ===  1"><div class="col-md-12"><img src="\static\img\tutoriais\xanjyjeekdpghr5dgap4.png"/></div></div>
              <div class="box-body" v-if="configuracoes.tutorial.passo ===  2"><div class="col-md-12"><img src="\static\img\tutoriais\o1hiqwks07hifa6aj1sz.png"/></div></div>
              <div class="box-body" v-if="configuracoes.tutorial.passo ===  3"><div class="col-md-12"><img src="\static\img\tutoriais\ddjwqe25q3tphkgefoqj.png"/></div></div>
              <div class="box-body" v-if="configuracoes.tutorial.passo ===  4"><div class="col-md-12"><img src="\static\img\tutoriais\jtoywuy44dq2zqzmtn5q.png"/></div></div>
              <div class="box-body" v-if="configuracoes.tutorial.passo ===  5"><div class="col-md-12"><img src="\static\img\tutoriais\auxeh01iknrmk563kspi.png"/></div></div>
              <div class="box-body" v-if="configuracoes.tutorial.passo ===  6"><div class="col-md-12"><img src="\static\img\tutoriais\f75fr57g1cf7h7jgk97p.png"/></div></div>
              <div class="box-body" v-if="configuracoes.tutorial.passo ===  7"><div class="col-md-12"><img src="\static\img\tutoriais\m8ebsjo3k1lg1eou5an4.png"/></div></div>
              <!-- Passos que são da FBB -->
              <div class="box-body" v-if="configuracoes.tutorial.passo ===  8"><div class="col-md-12"><img src="\static\img\tutoriais\gq2b2bzvxje0raavrl72.png"/></div></div>
              <div class="box-body" v-if="configuracoes.tutorial.passo ===  9"><div class="col-md-12"><img src="\static\img\tutoriais\zazzystmj2e41rktbkwo.png"/></div></div>
              <div class="box-body" v-if="configuracoes.tutorial.passo === 10"><div class="col-md-12"><img src="\static\img\tutoriais\t0dymw64se3jbv1373a2.png"/></div></div>
              <div class="box-body" v-if="configuracoes.tutorial.passo === 11"><div class="col-md-12"><img src="\static\img\tutoriais\pwdjofu0yqtgjb4ab5tv.png"/></div></div>
              <div class="box-body" v-if="configuracoes.tutorial.passo === 12"><div class="col-md-12"><img src="\static\img\tutoriais\yhxmo5y38646lwxf2v6d.png"/></div></div>
              <div class="box-body" v-if="configuracoes.tutorial.passo === 13"><div class="col-md-12"><img src="\static\img\tutoriais\gv3ws0odkz1hak5bg6ql.png"/></div></div>
            </div>
          </div>
        </div>

        <fieldset :disabled="blockStatusERP === true"> <!-- TODO verificar as condições de bloqueio se estão corretas -->
          <div class="row" v-if="configuracoes.tutorial.concluido">
            <div class="col-md-12">
              <div class="box box-primary">
                <div v-show="loading.processando" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block; z-index: 1000;"><i class="fa fa-refresh fa-spin"></i></div>
                <div class="box-header">
                  <h3 class="box-title" style="width: 100%">
                    <i class="fa fa-file-text-o" aria-hidden="true"></i>
                    <span v-if="loading.carregando">Carregando relatórios de execução...</span>
                    <span v-else>
                      <span v-if="relatorios.length === 0">Este projeto não tem Relatórios de Execução no SGP</span>
                      <span v-if="relatorios.length > 0">{{projeto.numero}} - {{projeto.nome}} <b v-if="usuarioLogado.userType === 'FUNDACAO'">{{'(' + projeto.situacao_projeto + ')'}}</b></span>
                    </span>

                    <!-- Legenda padrão desativada a pedido do Eduardo em prol de legenda fixa no rodapé da lista de relatórios -->
                    <span v-if="false" class="legenda" v-tippy="{inertia: true, arrow: true, animation: 'fade', distance: '1', size: 'large', interactive: true, theme: 'light', position: 'bottom', maxWidth: '600px'}" :title="
                              (modoEdicao ?
                                '<table class=\'table legenda_tabela borderless\'>' +
                                  '<tr><td style=\'font-weight: bold; background: #f5f5f5\'>Modo de Edição ativado:</td></tr>' +
                                  '<tr><td style=\' background: #f5f5f5\'>' +
                                    '<table class=\'table\'>' +
                                      '<tr><td style=\'background: #fbfbff\'>Relatório que não pode ser alterados</td></tr>' +
                                      '<tr><td class=\'success text-success\'>Relatório será Adicionado ao Concluir</td></tr>' +
                                      '<tr><td class=\'info text-info\'>Relatório terá datas Alteradas ao Concluir</td></tr>' +
                                      '<tr><td class=\'text-muted\' style=\'background: #e8e5e5\'>Relatório será Excluído ao Concluir</td></tr>' +
                                    '</table>' +
                                  '</td></tr>' +
                                '</table>'
                                :
                                '<table class=\'table legenda_tabela\'>' +
                                  '<tr><td style=\'background: #f0f0ff\'>Fora do período de preenchimento</td></tr>' +
                                  '<tr><td style=\'background: ' + cor('pendente', 'corFundo') + '\'>No período e Pendente, em Análise ou Devolvido</td></tr>' +
                                  '<tr><td style=\'background: ' + cor('aprovado', 'corFundo') + '\'>Relatório aprovado</td></tr>' +
                                  '<tr><td style=\'background: ' + cor('não apresentado', 'corFundo') + '\'>Não apresentado no prazo</td></tr>' +
                                  (usuarioLogado.userType === 'FUNDACAO' && configuracoes.mostrarExcluidos ? '<tr><td style=\'background: ' + cor('excluído', 'corFundo') + '\'>Reatório excluído</td></tr>' : '') +
                                '</table>'
                              )">
                      Legenda
                    </span>

                  </h3>
                  <span v-if="modoEdicao">
                    <span class="col-md-10">
                      <br/>
                      <g-button-ujarak color="primary" size="button--size-ss" @click.native="novoRelatorio"> <i  class="fa fa-plus-o" aria-label="true"></i> Incluir novo relatório</g-button-ujarak >
                    </span>
                  </span>
                </div>
                <div class="box-body">

                  <!-- Gantt de relatórios --------------------------------------------------------------------------------->
                  <div id="gantt_relatorios" v-if="!loading.carregando && mostrarGantt && relatorios.length > 0">
                    <div class="col-md-12">
                      <div class="col-md-12" v-bind:style="'margin-bottom: 10px; ' + (modoEdicao ? 'background: #f5f5f5;' : '')">

                        <div id="bloco_relatorios" v-bind:style="'width: ' + ((projeto.dias.duracao * configuracoes.zoom) + 35) + 'px;'">

                          <div id="limites_projeto" v-bind:style="'width: ' + ((projeto.dias.duracao * configuracoes.zoom) + 10) + 'px;'">
                            <span>Início em {{formataData(projeto.data_aprovacao_projeto)}}</span>
                            <span style="float: right">Término em {{formataData(projeto.data_final_projeto)}}</span>
                          </div>

                          <div id="grade_meses" v-if="configuracoes.mostrarGrade" v-bind:style="'height: ' + ((qtdeRelatoriosTela * configuracoes.altura) + 70) + 'px'">
                            <div class="secao_periodo" v-for="p in projeto.lista_meses"
                              v-bind:style="'margin-left: ' + (dias(projeto.data_aprovacao_projeto, p) * configuracoes.zoom) + 'px; height: ' + ((qtdeRelatoriosTela * configuracoes.altura) + 70) + 'px'">
                              <div class="texto_vertical">{{p | moment('MMM/YY')}}</div>
                            </div>
                          </div>


                          <div id="grafico_relatorio" v-bind:style="'height: ' + ((qtdeRelatoriosTela * configuracoes.altura) + 70) + 'px'">

                            <div class="validacao_periodo" v-for="faixa in validacaoPeriodos"
                                 v-if="usuarioLogado.userType === 'FUNDACAO' && projeto.dias.ateHoje <= (projeto.dias.duracao + 5)"
                                 v-bind:style="
                                 'margin-left: ' + (dias(projeto.data_aprovacao_projeto, faixa.inicio) * configuracoes.zoom) + 'px;' +
                                 'width:' + (dias(faixa.inicio, faixa.termino) * configuracoes.zoom) + 'px;' +
                                 'height:' + ((qtdeRelatoriosTela * configuracoes.altura) + 50) + 'px'">
                            </div>

                            <div class="linha_hoje" v-if="configuracoes.mostrarHoje" ref="HOJE"
                                 v-bind:style="'margin-left: ' + (projeto.dias.ateHoje * configuracoes.zoom) + 'px; height:' + ((qtdeRelatoriosTela * configuracoes.altura) + 50) + 'px'">
                              Hoje {{projeto.dias.ateHoje > projeto.dias.duracao ? 'após ' + (projeto.dias.ateHoje - projeto.dias.duracao) + ' dia(s) do término do projeto' : ''}}
                            </div>


                            <!-- Barras do Gantt --------------------------------------------------------------------------------->
                            <div class="barras_relatorios">

                              <div class="relatorio"
                                   v-bind:style="
                                   'height: ' + (configuracoes.altura) + 'px;' +
                                   'background: ' + realceAlteracao(relatorio)['cor'] + ';'"

                                   v-for="(relatorio, indexRelatorio) in relatorios" v-if="!_.includes(['Excluído via Sapiens', 'Excluído via SGP'], relatorio.situacao) || (configuracoes.mostrarExcluidos && _.includes(['Excluído via Sapiens', 'Excluído via SGP'], relatorio.situacao))">


                                <div class="info_acao" @click="clickAcaoBarra(relatorio)"
                                   v-bind:style="
                                      'height: ' + (configuracoes.altura - 5) + 'px;' +
                                      'width: ' + (_.includes(['Excluído via Sapiens', 'Excluído via SGP'], relatorio.situacao) ? (60 * configuracoes.zoom) : (dias(relatorio.inicio_preenchimento, relatorio.termino_preenchimento) * configuracoes.zoom)) + 'px;' +
                                      'margin-left: ' + (dias(projeto.data_aprovacao_projeto, relatorio.inicio_preenchimento) * configuracoes.zoom) + 'px;' +
                                      ((!modoEdicao && _.includes(['PREENCHER', 'REVISAR', 'VISUALIZAR'], relatorio.acao) || (modoEdicao && ehRelatorioEditavel(relatorio))) ? 'cursor: pointer;' : '') +

                                      (estaExcluido(relatorio) ? 'background: rgb(240, 240, 240, 0.8); z-index:400; border:1px solid white;' :
                                        (modoEdicao && !ehRelatorioEditavel(relatorio) ? 'background: rgb(255, 255, 255, 0.75); z-index:400;' :
                                          'background: ' + cor(relatorio.situacao, 'corFundo')))"


                                   :title="
                                     '<h5>Relatório ' + relatorio.tipo + ' nº <b>' + relatorio.sequencia + '</b>' +
                                     '<br/><span style=\'font-weight: bold; background: ' + realceAlteracao(relatorio)['cor'] + '; color: ' + (cor(relatorio.situacao, 'corTexto')) + '\'>' + (relatorio.situacao).replace('ajustes:', 'ajustes<br/><br/>') + '</span>' +
                                     '<hr/>' +
                                     'Período de entrega do relatório<br/><span class=\'data_periodo_entre\'>' + formataData(relatorio.antes_30_final_ciclo) + ' e ' + formataData(relatorio.depois_30_final_ciclo) + '</span>' +
                                     '<br/><br/>' +
                                     'Final de ciclo em<br/><span class=\'data_final_ciclo_em\'>' + formataData(relatorio.final_ciclo) + '</span>' +

                                     (_.has(relatorio, 'apresentado_em') && (relatorio.apresentado_em !== '1900-01-01' && !_.isNull(relatorio.apresentado_em)) ? '<br/><br/>Apresentado em<br/><span class=\'data_apresentado_em\'>' + formataData(relatorio.apresentado_em) + '</span>' : '') +
                                     (_.has(relatorio, 'aprovado_em') && (relatorio.aprovado_em !== '1900-01-01' && !_.isNull(relatorio.aprovado_em)) ? '<br/><br/>Aprovado em<br/><span class=\'data_aprovado_em\'>' + formataData(relatorio.aprovado_em) + '</span>' : '') +

                                     '<hr/><b>' +
                                     (
                                       !modoEdicao ? (relatorio.acao !== 'OCULTO' ? 'Clique para ' + _.toLower(relatorio.acao) : '') :
                                       (_.includes(['Não apresentado', 'Fora do período de preenchimento', 'Pendente de preenchimento', 'Relatório terá datas Alteradas ao Concluir', 'Relatório será Adicionado ao Concluir', 'Relatório será Excluído ao Concluir'], relatorio.situacao) || !_.has(relatorio, 'situacao') ? 'Clique para alterar ou excluir cronograma' : '')
                                     ) + '</b>' +
                                     '</h5>'"

                                       v-tippy="{inertia: true, arrow: true, animation: 'perspective', size: 'large', arrow: true, theme: 'light', placement: 'bottom', followCursor: true, distance: 40}">

                                </div>

                                <div class="faixa_preenchimento" v-bind:style="
                                  'height: ' + (configuracoes.altura - 5) + 'px;' +
                                  'width: ' + (_.includes(['Excluído via Sapiens', 'Excluído via SGP'], relatorio.situacao) ? (dias(relatorio.antes_30_final_ciclo, relatorio.depois_30_final_ciclo) * configuracoes.zoom) : (dias(relatorio.inicio_preenchimento, relatorio.termino_preenchimento) * configuracoes.zoom)) + 'px;' +
                                  'margin-left: ' + (dias(projeto.data_aprovacao_projeto, relatorio.inicio_preenchimento) * configuracoes.zoom) + 'px;'">
                                </div>

                                <div class="faixa_regular" v-bind:style="
                                  'height: ' + (configuracoes.altura - 5) + 'px;' +
                                  'width: ' + (dias(relatorio.antes_30_final_ciclo, relatorio.depois_30_final_ciclo) * configuracoes.zoom) + 'px;' +
                                  'margin-left: ' + (dias(projeto.data_aprovacao_projeto, relatorio.antes_30_final_ciclo) * configuracoes.zoom) + 'px'">
                                </div>

                                <div class="slider_alteracao_final_ciclo" v-if="modoEdicao && !_.isNull(relatorioEditando) && relatorioEditando.sequencia === relatorio.sequencia"
                                     v-bind:style="
                                      'margin-left: ' + (relatorioEditando.minimo * configuracoes.zoom) + 'px;' +
                                      'height: ' + (configuracoes.altura) + 'px;' +
                                      'padding-top: ' + (configuracoes.altura / 5) + 'px;' +
                                      'width: ' + ((relatorioEditando.maximo - relatorioEditando.minimo) * configuracoes.zoom) + 'px;'">

                                  <vue-slider v-model="relatorioEditando.alteracaoDias"
                                              :process="false"
                                              :lazy="true"
                                              :tooltip-formatter="diasCorridos => formataData(adicionaDias(projeto.data_aprovacao_projeto, diasCorridos))"
                                              :min="relatorioEditando.minimo"
                                              :max="relatorioEditando.maximo"
                                              @drag-end="atualizaAlteracao"
                                              @blur="cancelaEdicao">
                                  </vue-slider>

                                </div>


                                <div class="data_final_ciclo" v-bind:style="
                                    'margin-left: ' + (dias(projeto.data_aprovacao_projeto, relatorio.final_ciclo) * configuracoes.zoom) + 'px;' +
                                    'height: ' + (configuracoes.altura - 5) + 'px;'"
                                     :title="'<h5>Final de ciclo em<br/><span style=\'color: var(--cor-atencao-dark); font-weight: bold\'>' + formataData(relatorio.final_ciclo) + '</span></h5>'"
                                     v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, theme:'light'}">&nbsp;</div>

                                <div class="data_apresentacao" v-bind:style="
                                    'margin-left: ' + ((dias(projeto.data_aprovacao_projeto, relatorio.apresentado_em) * configuracoes.zoom) + 2) + 'px;' +
                                    'height: ' + (configuracoes.altura - 5) + 'px;'" v-if="_.has(relatorio, 'apresentado_em') && (relatorio.apresentado_em !== '1900-01-01' && !_.isNull(relatorio.apresentado_em))"
                                     :title="'<h5>Apresentado em<br/><span style=\'color: var(--cor-destaque-dark); font-weight: bold\'>' + formataData(relatorio.apresentado_em) + '</span></h5>'"
                                     v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, theme:'light'}">&nbsp;</div>

                                <div class="data_aprovacao" v-bind:style="
                                    'margin-left: ' + ((dias(projeto.data_aprovacao_projeto, relatorio.aprovado_em) * configuracoes.zoom) + 4) + 'px;' +
                                    'height: ' + (configuracoes.altura - 5) + 'px;'" v-if="_.has(relatorio, 'aprovado_em') && (relatorio.aprovado_em !== '1900-01-01' && !_.isNull(relatorio.aprovado_em))"
                                     :title="'<h5>Aprovado em<br/><span style=\'color: var(--cor-sucesso-dark); font-weight: bold\'>' + formataData(relatorio.aprovado_em) + '</span></h5>'"
                                     v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, theme:'light'}">&nbsp;</div>

                              </div>

                            </div>

                          </div>

                        </div>

                      </div>
                    </div>



                    <!-- Legenda ------------------------------------------------------------------------------->
                    <div class="col-md-12" v-if="configuracoes.mostrarLegenda">
                      <table>
                        <tr>
                          <td class="legenda_etiqueta" style="color: steelblue; font-weight: bold;">Legendas</td>
                          <td v-if="haRelatoriosPelasSituacoes(['fora do período'])" class="legenda_etiqueta" style="background: #f0f0ff" :title="'<h5>Relatório que ainda não abriu o período de preenchimento</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Fora do período</td>
                          <td v-if="haRelatoriosPelasSituacoes(['pendente', 'análise', 'devolvido'])" class="legenda_etiqueta" style="background: #c0d4ff"  :title="'<h5>Esta dentro do período e está Pendente de preenchimento ou em Análise ou está Devolvido para ajustes</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">No período</td>
                          <td v-if="haRelatoriosPelasSituacoes(['aprovado'])" class="legenda_etiqueta" style="background: #c0f3d2" :title="'<h5>Relatório registrado como aprovado</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Aprovado</td>
                          <td v-if="haRelatoriosPelasSituacoes(['não apresentado'])" class="legenda_etiqueta" style="background: #f3c0cc" :title="'<h5>Não apresentado e ainda disponível para preenchimento, mas que passou do prazo no período regular</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Não apresentado</td>
                          <td v-if="usuarioLogado.userType === 'FUNDACAO' && configuracoes.mostrarExcluidos && haRelatoriosPelasSituacoes(['excluído'])" class="legenda_etiqueta" style="background: #e3e7ec" :title="'<h5>Foi excluído via Sapiens ou SGP e não é mais visível para entidade</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Excluído</td>
                        </tr>
                        <tr v-if="modoEdicao">
                            <td class="legenda_etiqueta" style="color: steelblue; font-weight: bold;">Modo de Edição</td>
                            <td v-if="_.find(relatorios, function(rel) { return !ehRelatorioEditavel(rel) })" class="legenda_etiqueta" style="background: #fbfbff" :title="'<h5>Relatório que não pode ser alterados</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Não pode ser alterado</td>
                            <td v-if="alteracao.incluidos.length > 0" class="success legenda_etiqueta"    style="background: #dff0d8" :title="'<h5>Relatório será Adicionado ao Concluir</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Será Incluído</td>
                            <td v-if="alteracao.alterados.length > 0" class="info legenda_etiqueta"       style="background: #d9edf7" :title="'<h5>Relatório terá datas Alteradas ao Concluir</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Será Alterada Data</td>
                            <td v-if="alteracao.excluidos.length > 0" class="text-muted legenda_etiqueta" style="background: #e8e5e5" :title="'<h5>Relatório será Excluído ao Concluir</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Será Excluído</td>
                        </tr>
                      </table>
                    </div>



                    <!-- Resultado da validação de choque nos Relatórios ------------------------------------------------------------------------------->
                    <div class="col-md-12" v-if="usuarioLogado.userType === 'FUNDACAO' && validacaoPeriodos.length > 0">
                      <span style="background: rgba(202, 123, 73, 0.38);">Atenção:</span>
                      <p v-for="faixa in validacaoPeriodos">Relatório nº <b>{{faixa.relatorio1.sequencia}}</b> - {{faixa.tipo}} ( {{formataData(faixa.inicio)}}  a  {{formataData(faixa.termino)}})</p>
                    </div>



                    <!-- Edição de relatórios ---------------------------------------------------------------------------------------------------->
                    <div v-if="!_.isNull(relatorioEditando)" class="col-md-12">
                      <div class="col-md-12">
                        <div class="row well well-sm no-shadow">

                          <div class="col-md-12 form-group required-field" :class="{'has-error' : errors.first('final do ciclo')}">

                            <label class="control-label col-md-2">{{ _.has(relatorioEditando, 'id') ? 'Editando relatório ' + relatorioEditando.sequencia : 'Incluindo relatório novo' }} informe a data de Final do Ciclo:</label>

                            <div class="col-md-2">
                              <div class="input-group">
                                <datepicker v-model="relatorioEditando.final_ciclo" name="final do ciclo" input-class="form-control datepicker" :language="$datePickerPtBR" maxlength="20" :use-utc="false" placeholder="__ /__ /____"
                                            format="dd/MM/yyyy" v-validate="'required'" :disabled-dates="desabilitarDatas">
                                </datepicker>
                              </div>
                              <span v-if="errors.first('final do ciclo')" class="label label-danger"> {{ errors.first('final do ciclo') }}</span>
                            </div>

                            <div class="col-md-4">
                              <button @click="okEdicao" type="button" class="btn btn-confirm btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Ok</button>
                              <button @click="cancelaEdicao" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
                              <button @click="excluirRelatorio(relatorioEditando)" type="button" class="btn btn-danger btn-flat"><i class="fa fa-trash" aria-label="true"></i> Excluir</button>
                            </div>
                          </div>

                          <div class="col-md-12 col-md-offset-2">
                            Limitado a data de término do projeto de {{formataData(projeto.data_final_projeto)}}
                          </div>

                        </div>
                      </div>
                    </div>



                    <!-- Justificativa das alterações para registro ----------------------------------------------------------------------------------------------->
                    <div v-if="modoEdicao" class="col-md-12">
                      <div class="col-md-12">
                        <div class="row well well-sm no-shadow">
                          <div class="col-md-12 form-group required-field" :class="{'has-error' : errors.first('justificativa')}">
                            <label class="control-label col-md-2">Justificativa {{alteracao.incluidos.length + alteracao.excluidos.length + alteracao.alterados.length > 1 ? 'das alterações' : 'da alteração'}}:</label>
                            <div class="col-md-10">
                              <textarea v-resizable v-model="alteracao.justificativa" name="justificativa" placeholder="Descreva justificativa" class="form-control" rows="3" v-validate="'required'" data-vv-as="Justificativa"></textarea>
                              <span v-if="errors.first('justificativa')" class="label label-danger"> {{ errors.first('justificativa') }}</span>
                            </div>
                          </div>
                          <div class="col-md-offset-2 col-md-10">
                          <span v-if="alteracao.incluidos.length > 0 || alteracao.excluidos.length > 0 || alteracao.alterados.length > 0">
                            Relatórios: {{alteracao.incluidos.length}} incluído(s), {{alteracao.excluidos.length}} excluídos(s), {{alteracao.alterados.length}} alterados(s)
                          </span>
                          </div>
                        </div>
                      </div>
                    </div>



                    <!-- Opções ----------------------------------------------------------------------------------------------->
                    <div class="box-body" v-if="usuarioLogado.userType === 'FUNDACAO'">
                      <div class="opcoes" @click="mostrarOpcoes = !mostrarOpcoes">
                        <i class="fa fa-gears"></i> Opções
                      </div>
                    </div>



                    <!-- Quadro com opções de configuração do gantt de relatórios -->
                    <div v-show="mostrarOpcoes" class="box-body" v-if="usuarioLogado.userType === 'FUNDACAO'">
                      <div class="form-horizontal">

                        <div class="form-group col-md-12">
                          <label class="control-label col-md-2">Mostrar Excluídos:</label>
                          <span>
                              <label class="radio-inline new-control new-control-radio">
                                <input type="radio" name="mostrarExcluidos" v-model="configuracoes.mostrarExcluidos" :value="true" @change="salvarConfiguracoes"> Sim <div class="new-control-indicator"></div>
                              </label>
                              <label class="radio-inline new-control new-control-radio">
                                <input type="radio" name="mostrarExcluidos" v-model="configuracoes.mostrarExcluidos" :value="false" @change="salvarConfiguracoes"> Não <div class="new-control-indicator"></div>
                              </label>
                          </span>
                        </div>


                        <div class="form-group col-md-12">
                          <label class="control-label col-md-2">Zoom períodos:</label>
                          <div class="col-md-2">
                            <vue-slider v-model="configuracoes.zoom"
                                        :min="1" :max="3" :interval=".1"
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
                              :data="[{tamanho: 25, nome: 'Pequeno'}, {tamanho: 35, nome: 'Médio'}, {tamanho: 45, nome: 'Grande'}, {tamanho: 55, nome: 'Extra'}]"
                              :data-value="'tamanho'"
                              :data-label="'nome'"
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
                          <label class="control-label col-md-2">Mostrar Hoje:</label>
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
                          <label class="control-label col-md-2">Mostrar Legenda:</label>
                          <span>
                              <label class="radio-inline new-control new-control-radio">
                                <input type="radio" name="mostrarLegenda" v-model="configuracoes.mostrarLegenda" :value="true" @change="salvarConfiguracoes"> Sim <div class="new-control-indicator"></div>
                              </label>
                              <label class="radio-inline new-control new-control-radio">
                                <input type="radio" name="mostrarLegenda" v-model="configuracoes.mostrarLegenda" :value="false" @change="salvarConfiguracoes"> Não <div class="new-control-indicator"></div>
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
            </div>
          </div>
        </fieldset>
      </section>
    </div>
  </div>
</template>

<script>
    import moment from 'moment'
    import { mapGetters } from 'vuex'
    export default {
      name: 'ListaRelExec',
      data () {
        return {
          data: [],
          titulo: 'SGP',
          configuracoes: {
            altura: 25,
            zoom: 1,
            mostrarGrade: true,
            mostrarHoje: true,
            mostrarExcluidos: false,
            mostrarLegenda: true,
            tutorial: {
              concluido: false,
              passo: 1
            }
          },
          mostrarOpcoes: true,
          hoje: new Date(),
          relatorioEditando: null,
          modoEdicao: false,
          desabilitarDatas: {
            from: new Date(),
            to: new Date()
          },
          loading: {
            carregando: false,
            processando: false
          },
          relatorios: [],
          relatoriosBackup: [],
          alteracao: {
            incluidos: [],
            excluidos: [],
            alterados: [],
            justificativa: null
          },
          coresSituacao: [
            {termo: 'aprovado', corTexto: '#008000', corFundo: '#00ff1c33'},
            {termo: 'análise', corTexto: '#1d0fff', corFundo: '#0065ff33'},
            {termo: 'pendente', corTexto: '#1d0fff', corFundo: '#0065ff33'},
            {termo: 'devolvido', corTexto: '#1d0fff', corFundo: '#0065ff33'},
            {termo: 'não apresentado', corTexto: '#ff0000', corFundo: '#ff000033'},
            {termo: 'projeto encerrado', corTexto: '#ff0000', corFundo: '#ff000033'},
            {termo: 'fora do período', corTexto: '#ff9e00', corFundo: 'transparent'},
            {termo: 'excluído', corTexto: '#dd4b39', corFundo: '#f0f0f033'}
          ],
          validacaoPeriodos: [],
          mostrarGantt: true,
          formatter1: ``,
          relatorio: {},
          filtro: {
            createdAt: null
          },
          statusERP: [],
          blockStatusERP: false,
          projeto: {},
          ativado: false,
          fieldsRelatorios: [
            { key: 'sequencia', label: 'Período do relatório', thStyle: 'width:6%; text-align: center', sortable: true, 'class': 'text-center' },
            { key: 'final_ciclo', label: 'Final do Ciclo', thStyle: 'width: 10%; text-align: center', sortable: true, 'class': 'text-center' },
            { key: 'apresentado_em', label: 'Apresentado em', thStyle: 'width: 10%; text-align: center', sortable: true, 'class': 'word-wrap:break-word text-center' },
            { key: 'aprovado_em', label: 'Aprovado em', thStyle: 'width: 10%; text-align: center', sortable: true, 'class': 'text-center' },
            { key: 'situacao', label: 'Situação', thStyle: 'width:  12%; text-align: center', 'class': 'text-center' },
            { key: 'actions', label: 'Ações', thStyle: 'width: 5.7%; text-align: center', 'class': 'text-center' }
          ],
          tableRelatorios: {
            currentPage: 1,
            perPage: 20,
            sortBy: 'sequencia',
            sortDesc: false,
            filter: null,
            bordered: true
          },
          store: this.$store
        }
      },
      computed: {
        ...mapGetters([
          'usuarioLogado'
        ]),
        // Monta data final
        finPer: function () {
          return moment(this.relatorios.finPer).format('DD/MM/YYYY')
        },
        idProjeto: function () {
          return this.relatorios[0].id_projeto
        },
        qtdeRelatoriosTela: function () {
          let vm = this
          return (_.countBy(vm.relatorios, function (r) { return !_.includes(['Excluído via Sapiens', 'Excluído via SGP'], r.situacao) || (vm.configuracoes.mostrarExcluidos && _.includes(['Excluído via Sapiens', 'Excluído via SGP'], r.situacao)) }))['true']
        },
        idProposta: function () {
          return this.relatorios[0].id_proposta
        }
      },
      created: function () {
        if (_.has(this.usuarioLogado, 'configuracoes') && _.has(this.usuarioLogado.configuracoes, 'cronograma_relatorios_execucao')) {
          this.configuracoes = this.usuarioLogado.configuracoes.cronograma_relatorios_execucao
        }
        this.listaRelatorios()
      },
      methods: {
        configuracaoPadrao () {
          this.configuracoes = {'altura': 25, 'zoom': 1, 'mostrarGrade': true, 'mostrarHoje': true, 'mostrarExcluidos': false, 'mostrarLegenda': true, 'tutorial': {'concluido': true, passo: 1}}
          this.salvarConfiguracoes()
        },
        listaRelatorios () {
          this.titulo = 'SGP Carregando Relatórios de Execução'
          this.$snotify.async('Lendo Cronograma de Relatórios de Execução...', {timeout: 0})
          this.loading.carregando = true
          axiosLaravel.get('/relatorio_execucao/busca_relatorios/' + this.$route.params.id).then((response) => {
            if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
              if (_.isEmpty(response.data.retorno) || response.data.retorno.length === 0) {
                this.$snotify.clear()
                this.$snotify.error('Este projeto não tem Relatórios de Execução no SGP')
                this.loading.carregando = false
                this.titulo = 'SGP - Sem Relatórios de Execução'
              } else {
                this.relatorios = response.data.retorno
                this.relatoriosBackup = _.cloneDeep(response.data.retorno)
                // Carregando valores básicos para uso do cronograma
                this.projeto['nome'] = this.relatorios[0].projeto
                this.projeto['numero'] = this.relatorios[0].numero
                this.projeto['data_vigencia_projeto'] = this.relatorios[0].data_vigencia_projeto
                this.projeto['data_aprovacao_projeto'] = this.relatorios[0].data_aprovacao_projeto
                this.projeto['data_final_projeto'] = this.relatorios[0].data_final_projeto
                this.projeto['situacao_projeto'] = this.relatorios[0].situacao_projeto
                if (_.includes(['ENC', 'ESE'], this.projeto['situacao_projeto'])) {
                  // Não precisa mostrar data de hoje nem os excluídos em projetos encerrados
                  this.configuracoes.mostrarHoje = false
                  this.configuracoes.mostrarExcluidos = false
                }
                let mesReferenciaAprovacao = moment(this.projeto['data_aprovacao_projeto']).startOf('month') // Primeiro do projeto (desconsiderando o dia que fica como 01)
                this.projeto['lista_meses'] = [] // Lista simples dos meses/anos (ignorando dia) entre aprovação e vigência excluindo eles
                let dataTerminoProjeto = moment(this.projeto['data_final_projeto'])
                do { // Gerando um array de meses para er usado na grade do cronograma
                  this.projeto['lista_meses'].push(mesReferenciaAprovacao)
                  mesReferenciaAprovacao = moment(mesReferenciaAprovacao).add(1, 'month')
                } while (dataTerminoProjeto.isAfter(mesReferenciaAprovacao))
                this.projeto['dias'] = {
                  'duracao': this.dias(this.projeto.data_aprovacao_projeto, this.projeto.data_final_projeto),
                  'ateHoje': this.dias(this.projeto.data_aprovacao_projeto, this.hoje)
                }
                this.correcoesPeriodos()
                this.loading.carregando = false
                this.$snotify.clear()
                this.$snotify.success('Cronograma carregado!', {timeout: 1000})
                this.titulo = 'SGP - ' + this.projeto.numero + ' - ' + this.projeto.nome
              }
            } else {
              this.$snotify.clear()
              this.$snotify.error(response.data.mensagem, {timeout: 1000})
            }
          })
            .catch((error) => {
              console.log('error', error)
              this.$root.trataErro(error)
              this.$snotify.clear()
            })
        },
        validandoPeriodos () {
          this.validacaoPeriodos = []
          let relatoriosAtivos = this.relatoriosAtivos()
          // Valida se todos os períodos com ants e depois estão com 60 dias
          relatoriosAtivos.forEach((relatorioPrazoMinimo) => {
            if (this.dias(relatorioPrazoMinimo['antes_30_final_ciclo'], relatorioPrazoMinimo['depois_30_final_ciclo']) < 60) {
              console.log('Prazo minimo não observado')
              this.validacaoPeriodos.push({'relatorio1': relatorioPrazoMinimo, 'relatorio2': relatorioPrazoMinimo, 'inicio': relatorioPrazoMinimo['antes_30_final_ciclo'], 'termino': relatorioPrazoMinimo['depois_30_final_ciclo'], 'tipo': 'Não tem prazo mínimo 60 dias'})
            }
          })
          // Valida se não há choque de um relatório com seus seguintes quanto a descasamento de ordem ou quanto um termina ante do próximo
          relatoriosAtivos.forEach((relatorio1) => {
            relatoriosAtivos.forEach((relatorio2) => {
              if (relatorio2.sequencia > relatorio1.sequencia) {
                if (moment(relatorio1.termino_preenchimento).isAfter(relatorio2.inicio_preenchimento)) {
                  let tipo = 'Há sobreposição com o relatório nº ' + relatorio2.sequencia
                  if (moment(relatorio1.inicio_preenchimento).isAfter(relatorio2.termino_preenchimento)) {
                    tipo = 'Começa depois de relatório nº ' + relatorio2.sequencia
                  }
                  this.validacaoPeriodos.push({'relatorio1': relatorio1, 'relatorio2': relatorio2, 'inicio': relatorio2.inicio_preenchimento, 'termino': relatorio1.termino_preenchimento, 'tipo': tipo})
                }
              }
            })
          })
        },
        correcoesPeriodos () {
          let relatoriosAtivos = this.relatoriosAtivos()
          relatoriosAtivos.forEach((relatorio) => {
            // Corrigindo distorções de antes para -30 e depois para 30 do final do ciclo
            relatorio['antes_30_final_ciclo'] = moment(relatorio.final_ciclo).subtract(30, 'days').format('YYYY-MM-DD')
            relatorio['depois_30_final_ciclo'] = moment(relatorio.final_ciclo).add(30, 'days').format('YYYY-MM-DD')
            //
            // Reajusta termino de preenchimento do relatorio para o inicio do relatório seguinte
            let relatorioSeguinte = _.find(relatoriosAtivos, function (rel) { return rel.sequencia > relatorio.sequencia }) // Pega o próximo relatório não excluído da lista
            // Calcula a data de termino de preenchimento com sendo o dia antes do início do próximo relatório não excluido ou a data de termino do projeto
            relatorio['termino_preenchimento'] = relatorioSeguinte ? moment(relatorioSeguinte.inicio_preenchimento).subtract(1, 'days').format('YYYY-MM-DD') : this.projeto.data_final_projeto
            // Caso o cálculo resulte em menos de 60 dias (mínimo para o período antes e depois do final do ciclo) entao deve arrastar a faixa de concluir e antes/depois para a mesma data de termino de preenchimento
            if (this.dias(relatorio['inicio_preenchimento'], relatorio['termino_preenchimento']) < 60) {
              // Garante que haja pelo menos 30 dias para preenchimento após o final de ciclo
              relatorio['termino_preenchimento'] = relatorio['depois_30_final_ciclo']
              relatorio['termino_concluir'] = relatorio['depois_30_final_ciclo']
            }
          })
          //
          let ultimoRelatorio = _.last(relatoriosAtivos)
          if (this.projeto.dias.ateHoje > this.projeto.dias.duracao) {
            ultimoRelatorio['termino_preenchimento'] = (ultimoRelatorio.aprovado_em === '1900-01-01' || _.isNull(ultimoRelatorio.aprovado_em)) ? this.hoje : moment(ultimoRelatorio.aprovado_em).add(5, 'days').format('YYYY-MM-DD') // adicionando 5 dias só pra efeito de formatação
            ultimoRelatorio['termino_concluir'] = ultimoRelatorio['termino_preenchimento']
          }
          this.validandoPeriodos()
        },
        atualizaAlteracao () {
          let diasAlterado = this.relatorioEditando.alteracaoDias - this.dias(this.projeto.data_aprovacao_projeto, this.relatorioEditando.final_ciclo) - 1
          this.relatorioEditando.final_ciclo = moment(this.relatorioEditando.final_ciclo).add(diasAlterado, 'days').format('YYYY-MM-DD')
          this.okEdicao()
        },
        limiteAlteracaoFinalCiclo () {
          let vm = this
          this.relatorioEditando.minimo = 0
          this.relatorioEditando.maximo = this.projeto.dias.duracao + 1 // Adicionando um dia para correção de cálculo
          let relatoriosAtivos = this.relatoriosAtivos()
          let relatorioAnterior = _.find(relatoriosAtivos, function (rel) { return rel.sequencia < vm.relatorioEditando.sequencia }) // Pega o relatório anterior não excluído da lista
          this.relatorioEditando.minimo = relatorioAnterior ? this.dias(this.projeto.data_aprovacao_projeto, moment(relatorioAnterior.depois_30_final_ciclo).add(31, 'days').format('YYYY-MM-DD')) : 1 // Se é o primeiro elatório ou não tem anterior começa do primeiro dia
          this.relatorioEditando.alteracaoDias = this.dias(this.projeto.data_aprovacao_projeto, this.relatorioEditando.final_ciclo)
          this.desabilitarDatas = {'from': this.adicionaDias(this.projeto.data_aprovacao_projeto, this.relatorioEditando.maximo), 'to': this.adicionaDias(this.projeto.data_aprovacao_projeto, this.relatorioEditando.minimo)}
        },
        relatoriosAtivos () {
          return _.filter(this.relatorios, function (relatorio) {
            return !_.includes(['Excluído via Sapiens', 'Excluído via SGP', 'Relatório será Excluído ao Concluir'], relatorio.situacao)
          })
        },
        okEdicao () {
          // Gravar a alteração no array de alteracoes
          if (_.has(this.relatorioEditando, 'id')) { // Este OK para Edição de relatório Existente
            // Verifica se não está em alterados e excluir
            this.buscaLimpaRegistro({'id': this.relatorioEditando.id})
            this.alteracao.alterados.push(_.cloneDeep(this.relatorioEditando))
            let relatorioLista = _.find(this.relatorios, ['id', this.relatorioEditando.id])
            if (relatorioLista) {
              relatorioLista.sequencia = this.relatorioEditando.sequencia
              relatorioLista.final_ciclo = this.relatorioEditando.final_ciclo
              // Preparando dados adicionais da edição ou inclusão
              relatorioLista['antes_30_final_ciclo'] = moment(this.relatorioEditando.final_ciclo).subtract(30, 'days').format('YYYY-MM-DD')
              relatorioLista['depois_30_final_ciclo'] = moment(this.relatorioEditando.final_ciclo).add(30, 'days').format('YYYY-MM-DD')
              relatorioLista['inicio_preenchimento'] = relatorioLista['antes_30_final_ciclo']
              relatorioLista['termino_preenchimento'] = relatorioLista['depois_30_final_ciclo']
              relatorioLista['inicio_concluir'] = relatorioLista['antes_30_final_ciclo']
              relatorioLista['termino_concluir'] = relatorioLista['depois_30_final_ciclo']
              relatorioLista['situacao'] = 'Relatório terá datas Alteradas ao Concluir'
            }
          } else { // Este OK para adição de relatório Novo
            // Preparando dados adicionais da edição ou inclusão
            this.relatorioEditando['antes_30_final_ciclo'] = moment(this.relatorioEditando.final_ciclo).subtract(30, 'days').format('YYYY-MM-DD')
            this.relatorioEditando['depois_30_final_ciclo'] = moment(this.relatorioEditando.final_ciclo).add(30, 'days').format('YYYY-MM-DD')
            this.relatorioEditando['inicio_preenchimento'] = this.relatorioEditando['antes_30_final_ciclo']
            this.relatorioEditando['termino_preenchimento'] = this.relatorioEditando['depois_30_final_ciclo']
            this.relatorioEditando['inicio_concluir'] = this.relatorioEditando['antes_30_final_ciclo']
            this.relatorioEditando['termino_concluir'] = this.relatorioEditando['depois_30_final_ciclo']
            this.relatorioEditando['situacao'] = 'Relatório será Adicionado ao Concluir'
            this.buscaLimpaRegistro({'sequencia': this.relatorioEditando.sequencia}) // Exclui este relatório do registro de alteração, se houver
            _.pullAllBy(this.relatorios, [{'sequencia': this.relatorioEditando.sequencia}], 'sequencia')  // Exclui este relatório da lista de relatórios, se houver
            this.alteracao.incluidos.push(this.relatorioEditando)
            this.relatorios.push(this.relatorioEditando)
          }
          this.correcoesPeriodos()
          this.$forceUpdate()
          this.relatorioEditando = null
        },
        cancelaEdicao () {
          this.relatorioEditando = null
        },
        editarRelatorio (relatorio) {
          this.relatorioEditando = _.cloneDeep(relatorio)
          this.relatorioEditando['alteracaoDias'] = 0
          this.limiteAlteracaoFinalCiclo()
        },
        excluirRelatorio (relatorio) {
          let vm = this
          this.$dialog.confirm('Deseja marcar o relatório nº ' + relatorio.sequencia + ' para excluir ao Concluir?', {html: true, animation: 'fade', customClass: 'avisoAlerta'}).then(function (dialog) {
            // Limpar os registros de alteração para número de relatório
            vm.buscaLimpaRegistro({'sequencia': relatorio.sequencia})
            // Pegar o relatório da lista na tela e vê se já é cadastrado ou é novo
            let relatorioLista = _.find(vm.relatorios, ['sequencia', relatorio.sequencia])
            if (relatorioLista && _.has(relatorioLista, 'id')) { // Já cadastrado: deve adicionar na lista de excluidos e marcar na lista de relatórios na tela
              relatorioLista['situacao'] = 'Relatório será Excluído ao Concluir'
              relatorio['situacao'] = relatorioLista['situacao']
              relatorio.final_ciclo = _.get(_.find(vm.relatoriosBackup, ['id', relatorio.id]), 'final_ciclo')
              vm.alteracao.excluidos.push(_.cloneDeep(relatorio))
            } else { // Novo: está só eliminando algo criado nesta seção, então só basta excluir da lista e não adicionar registro de exclusão
              _.pullAllBy(vm.relatorios, [{ 'sequencia': relatorio.sequencia }], 'sequencia')
              // Renumerar a sequencias dos incluidos que sobraram quando algum deles foi excluido
              let ultimoNumero = _.get(_.maxBy(vm.relatoriosBackup, 'sequencia'), 'sequencia')
              vm.alteracao.incluidos.forEach((relatorio) => {
                _.set(relatorio, 'sequencia', ++ultimoNumero)
              })
            }
            vm.correcoesPeriodos()
            vm.cancelaEdicao()
            vm.$forceUpdate()
          })
        },
        novoRelatorio () {
          this.relatorioEditando = {}
          this.relatorioEditando['sequencia'] = _.get(_.maxBy(this.relatorios, 'sequencia'), 'sequencia') + 1 // Cosidera todos os relatórios e pega a última sequencia + 1
          this.relatorioEditando['final_ciclo'] = this.projeto.data_final_projeto // Atribuindo data de término do projeto
          // Preparando dados adicionais da inclusão
          this.relatorioEditando['antes_30_final_ciclo'] = moment(this.relatorioEditando.final_ciclo).subtract(30, 'days').format('YYYY-MM-DD')
          this.relatorioEditando['depois_30_final_ciclo'] = moment(this.relatorioEditando.final_ciclo).add(30, 'days').format('YYYY-MM-DD')
          this.relatorioEditando['inicio_preenchimento'] = this.relatorioEditando['antes_30_final_ciclo']
          this.relatorioEditando['termino_preenchimento'] = this.relatorioEditando['depois_30_final_ciclo']
          this.relatorioEditando['inicio_concluir'] = this.relatorioEditando['antes_30_final_ciclo']
          this.relatorioEditando['termino_concluir'] = this.relatorioEditando['depois_30_final_ciclo']
          this.relatorioEditando['situacao'] = 'Relatório será Adicionado ao Concluir'
          this.limiteAlteracaoFinalCiclo() // Complemetando com limites de alteração
          this.buscaLimpaRegistro({'sequencia': this.relatorioEditando.sequencia}) // Exclui este relatório do registro de alteração, se houver
          _.pullAllBy(this.relatorios, [{'sequencia': this.relatorioEditando.sequencia}], 'sequencia')  // Exclui este relatório da lista de relatórios, se houver
          this.alteracao.incluidos.push(this.relatorioEditando)
          this.relatorios.push(this.relatorioEditando)
          this.clickAcaoBarra(this.relatorioEditando) // Colocando em modo de alteração
        },
        alterarListaRelatorios () {
          this.modoEdicao = true
        },
        cancelarAlteracaoListaRelatorios () {
          this.validacaoPeriodos = []
          this.alteracao = {incluidos: [], excluidos: [], alterados: []}
          this.cancelaEdicao()
          this.modoEdicao = false
          this.relatorios = _.cloneDeep(this.relatoriosBackup)
        },
        concluirAlteracaoListaRelatorios () {
          let restricoesConcluir = []
          if (this.alteracao.incluidos.length === 0 && this.alteracao.excluidos.length === 0 && this.alteracao.alterados.length === 0) {
            restricoesConcluir.push('Não foi feita nenhuma alteração nos relatórios')
          }
          if (!_.isNull(this.relatorioEditando)) {
            restricoesConcluir.push('Caixa de edição de relatório aberta. Clique em OK ou Cancelar antes de Concluir as alterações')
          }
          if (this.validacaoPeriodos.length > 0) {
            restricoesConcluir.push('Atenção, há ' + this.validacaoPeriodos.length + ' choques em relatórios que não permite concluir. Regularize primeiro.')
          }
          if (restricoesConcluir.length > 0) {
            let mensagens = '<div class=avisoAlerta><li>' + _.join(restricoesConcluir, '<li>') + '</div>'
            this.$dialog.alert(mensagens, {html: true, animation: 'fade', customClass: 'avisoAlerta'}).then(function (dialog) {})
          }
          this.$validator.validateAll().then((result) => {
            if (result && restricoesConcluir.length === 0) {
              this.$snotify.async('Processando as alterações...', {timeout: 0})
              let registroAlteracao = {'fkProjeto': this.$route.params.id, 'antes': this.relatoriosBackup, 'depois': this.relatorios, 'alteracao': this.alteracao}
              this.loading.processando = true
              axiosLaravel.post('/relatorio_execucao/alteracoes/', registroAlteracao).then((response) => {
                this.$snotify.clear()
                this.loading.processando = false
                if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
                  this.$snotify.success(response.data.mensagem, {timeout: 1000})
                  this.$router.go(0)
                } else {
                  this.$snotify.error(response.data)
                }
              })
                .catch((error) => {
                  this.loading.processando = false
                  console.log('error atualizando relatorios', error)
                  this.$root.trataErro(error)
                  this.$snotify.clear()
                })
              this.cancelaEdicao()
            }
          })
        },
        buscaLimpaRegistro (busca) {
          _.pullAllBy(this.alteracao.incluidos, [busca], _.head(_.keys(busca)))
          _.pullAllBy(this.alteracao.excluidos, [busca], _.head(_.keys(busca)))
          _.pullAllBy(this.alteracao.alterados, [busca], _.head(_.keys(busca)))
        },
        realceAlteracao (relatorio) {
          let realce = {'class': '', 'cor': 'transparent', 'sombra': 'transparent'}
          if (_.find(this.alteracao.alterados, {'sequencia': relatorio.sequencia, 'id': relatorio.id})) {
            realce = {'class': 'info text-info', 'cor': '#d9edf7', 'sombra': '#d9edf7'}
          } else if (_.find(this.alteracao.excluidos, {'sequencia': relatorio.sequencia, 'id': relatorio.id})) {
            realce = {'class': 'active text-muted', 'cor': '#e8e5e5', 'sombra': '#e8e5e5'}
          } else if (_.find(this.alteracao.incluidos, ['sequencia', relatorio.sequencia])) {
            realce = {'class': 'success text-success', 'cor': '#dff0d8', 'sombra': '#dff0d8'}
          } else if (_.includes(['Excluído via Sapiens', 'Excluído via SGP'], relatorio.situacao)) {
            realce = {'class': 'active text-muted', 'cor': '#transparent', 'sombra': 'transparent'}
          }
          return realce
        },
        formataData (data) {
          return moment(data).format('DD/MM/YYYY')
        },
        dias (inicio, termino) {
          inicio = _.isNull(inicio) ? moment() : moment.utc(moment(inicio).format('YYYY-MM-DD'))
          termino = _.isNull(termino) ? moment() : moment.utc(moment(termino).format('YYYY-MM-DD'))
          let dif = moment.duration(termino.diff(inicio))
          let emDias = dif.asDays()
          return _.toNumber(emDias)
        },
        adicionaDias (data, dias) {
          dias = _.toNumber(dias)
          let date = new Date(data)
          date.setDate(date.getDate() + dias)
          return date
        },
        haRelatoriosPelasSituacoes (listaSituacoes) {
          let achados = 0
          listaSituacoes.forEach((termo) => {
            if (_.find(this.relatorios, function (relatorio) { return (_.toLower(relatorio.situacao)).includes(termo) })) {
              achados++
            }
          })
          return (achados > 0)
        },
        cor (situacaoRelatorio, parametroRetorno) {
          let corSituacao = _.find(this.coresSituacao, function (cor) {
            return (_.toLower(situacaoRelatorio)).includes(_.toLower(cor.termo))
          })
          return corSituacao ? _.get(corSituacao, parametroRetorno) : (parametroRetorno === 'corTexto' ? 'black' : 'transparent')
        },
        estaExcluido (relatorio) {
          return (_.toLower(relatorio.situacao)).includes('exclu')
        },
        ehRelatorioEditavel (relatorio) {
          return _.includes(['Não apresentado', 'Fora do período de preenchimento', 'Pendente de preenchimento', 'Relatório terá datas Alteradas ao Concluir', 'Relatório será Adicionado ao Concluir', 'Relatório será Excluído ao Concluir'], relatorio.situacao)
        },
        clickAcaoBarra (relatorio) {
          if (this.modoEdicao) {
            if (this.ehRelatorioEditavel(relatorio) || !_.has(relatorio, 'situacao')) {
              this.editarRelatorio(relatorio)
            }
          } else {
            if (relatorio.acao !== 'OCULTO') {
              this.$router.push({name: 'edita-relatorio-execucao', params: { id_proposta: this.idProposta, id: this.idProjeto, row: {item: relatorio} }})
            }
          }
        },
        salvarConfiguracoes () {
          _.set(this.usuarioLogado, 'configuracoes.cronograma_relatorios_execucao', this.configuracoes)
          axiosLaravel.post('/usuario/configuracoes', {'configuracoes': this.usuarioLogado.configuracoes}).then((response) => {
            console.log('configuracoes', this.usuarioLogado.configuracoes)
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
  .icone_ajuda {
    color: silver;
    cursor: default;
    font-size: x-large;
  }
  .icone_ajuda:hover {
    color: black
  }
  .relatorio_execucao .legenda {
    color: steelblue;
    font-weight: bold;
    cursor: default;
    float: right;
    font-size: 14px !important;
  }
  .relatorio_execucao .legenda_etiqueta {
    width: 140px;
    border: 3px solid white;
    padding: 3px 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }



  #gantt_relatorios {
    zoom: 1;
    overflow-x: auto;
  }

  #grafico_relatorio {
    margin-top: 50px;
  }

  #limites_projeto {
    border-left: 1px solid var(--cor-borda);
    border-right: 1px solid var(--cor-borda);
    padding: 0px 5px;
  }

  #bloco_relatorios {
    float: left;
    min-height: 180px;
    margin-left: 30px;
  }

  #bloco_relatorios #grade_meses {
    position: absolute;
    font-family: monospace;
    color: gray;
  }

  #bloco_relatorios .texto_vertical {
    transform: rotate(-90deg);
    transform-origin: right, top;
    -ms-transform: rotate(-90deg);
    -ms-transform-origin: right, top;
    -webkit-transform: rotate(-90deg);
    -webkit-transform-origin: right, top;
    -moz-transform: rotate(-90deg);
    -o-transform: rotate(-90deg);
    position: absolute;
  }

  #bloco_relatorios .texto_vertical {
    margin: 10px -10px;
  }

  #bloco_relatorios .secao_periodo {
    border-left: 1px solid var(--cor-borda);
    position: absolute;
    font-size: 12px;
    margin-top: 5px;
    padding: 5px;
  }


  /* camada principal das barras */
  #grafico_relatorio .barras_relatorios {
    padding-top: 25px;
  }

  #grafico_relatorio .relatorio {
    width: 100%;
    float: left;
    /*height: 25px;*/
    padding-top: 2px;
  }

  #grafico_relatorio .relatorio .info_acao {
    border: 1px solid whitesmoke;
    position: absolute;
    text-align: right;
    min-width: 60px;
    z-index: 120;
  }
  #grafico_relatorio .relatorio .info_acao:hover {
    border: 1px solid white;
    box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.2) !important;
  }

  #grafico_relatorio .relatorio .faixa_preenchimento {
    background: #f0f0ff;
    position: absolute;
    /*height: 20px;*/
    z-index: 100;
  }

  #grafico_relatorio .relatorio .faixa_regular {
    background: lightsteelblue;
    position: absolute;
    /*height: 20px;*/
    z-index: 110;
  }

  .data_periodo_entre {
    font-weight: bold;
    color: var(--cor-alerta);
  }

  #grafico_relatorio .relatorio .data_final_ciclo {
    background: darkred;
    position: absolute;
    cursor: default;
    z-index: 130;
    width: 4px;
  }
  .data_final_ciclo_em {
    font-weight: bold;
    color: var(--cor-atencao-dark);
  }

  #grafico_relatorio .relatorio .data_apresentacao {
    background: #337ab7;
    position: absolute;
    cursor: default;
    z-index: 130;
    width: 4px;
  }
  .data_apresentado_em {
    font-weight: bold;
    color: var(--cor-destaque-dark);
  }

  #grafico_relatorio .relatorio .data_aprovacao {
    background: darkgreen;
    position: absolute;
    cursor: default;
    z-index: 130;
    width: 4px;
  }
  .data_aprovado_em {
    font-weight: bold;
    color: var(--cor-sucesso-dark);
  }


  /* camada de informação - acima das barras */
  #grafico_relatorio .linha_hoje {
    width: 300px;
    position: absolute;
    z-index: 500;
    border-left: 4px solid #ca1b1b61;
    color: #b32b2b;
    display: flex;
    align-items: flex-end;
    /* abaixo ignora evendos na div cursor sobre a div permitindo apontar o que esta atrás */
    pointer-events: none;
    background: none !important;
    padding-left: 5px;
  }


  /* camada de validação choque - acima das demais */
  #grafico_relatorio .validacao_periodo {
    position: absolute;
    z-index: 10;
    background: rgba(202, 123, 73, 0.38);
    display: flex;
    align-items: flex-end;
    /* abaixo ignora evendos na div cursor sobre a div permitindo apontar o que esta atrás */
    pointer-events: none;
  }


  /* Opções de configuração */
  #gantt_relatorios .opcoes {
    cursor: pointer;
    border: 1px solid #ddd;
    border-radius: 25px;
    padding: 0px 10px;
    margin-right: 10px;
    z-index: 1000;
    background: #eee;
    float: left;
  }

  #gantt_relatorios div.opcoes:hover {
    color: black;
    background: white;
    border: 1px solid silver;
  }


  /* Slider de alteração da barra do relatório no Gantt */
  .slider_alteracao_final_ciclo {
    z-index: 1000;
    position: absolute;
    border: 1px solid whitesmoke;
    background: rgba(255, 255, 255, 0.6);
  }

  .escalaZoom {
    background: linear-gradient(to right bottom, white 50%, gray 50%);
    padding: 10px 10px;
    width: 100%;
  }

  .relatorio_execucao .tutorial .passo {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: 0 0 0 5px #ccc;
    background-color: #fff;
  }
  .relatorio_execucao .tutorial .passo.active {
    background: #4cae4c;
    box-shadow: 0 0 0 5px #4cae4c;
  }


</style>

