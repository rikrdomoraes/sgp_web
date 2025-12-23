<template>
  <div class="content-wrapper" ref="contentWrapper" id="validacoes" v-bind:style="'min-height: ' + alturaContentWrapper + 'px'">

    <vue-headful :title="'SGP - ' + enumeradores[validacao]"/>
    <div class="row">

      <!------------------------------------------------------------------------------------------------------------>
      <section class="content-header">
        <p class="visible-xs">&nbsp;</p>

        <h1 class="col-lg-5 col-md-6 col-sm-12 text-left">
          {{enumeradores[validacao]}}

          <i v-show="!mostraCarregando" class="fa fa-caret-down opcao" aria-hidden="true" v-if="mostrarProcesso.length === 0" @click="mostrarProcesso = _.keys(listaValidacoes); $refs['contentWrapper'].scrollIntoView()"
             :title="'<h5>Abre as seções principais</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
          </i>

          <i v-show="!mostraCarregando" class="fa fa-caret-up opcao" aria-hidden="true" v-if="mostrarProcesso.length > 0 || mostrarAtividade.length > 0" @click="mostrarProcesso = []; mostrarAtividade = []; $refs['contentWrapper'].scrollIntoView()"
             :title="'<h5>Fecha todas as seções</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
          </i>
          <!-- Suporte 66175 - Inclusão de farol informativo com os prazos para Execução Financeira -->
          <img src="../../../../static/img/farol_2.png"
            v-if="enumeradores[validacao] === 'Execução financeira'"
            class="semaforo"
            :title="'<h5 style=\'text-align:left\'><b>Pagamento, Ressarcimento e Adiantamento*</b></br><span style=\'text-align: left\'>'+
                    '<p></p>'+
                    '<p><i class=\'fa fa-square\' style=\'color:#218D1E\'></i> até 3 dias úteis</p>'+
                    '<p><i class=\'fa fa-square\' style=\'color:#DBC112\'></i> de 4 a 5 dias úteis</p>'+
                    '<p><i class=\'fa fa-square\' style=\'color:#A3100F\'></i> a partir do 6º dia útil</p>'+
                    '<hr></span></h5>'+
                    '<h5 style=\'text-align:left\'><b>Prestação de Contas e Devolução de Adiantamento*</b></br><span style=\'text-align:left\''+
                    '<p></p>'+
                    '<p><i class=\'fa fa-square\' style=\'color:#218D1E\'></i> até 6 dias úteis</p>'+
                    '<p><i class=\'fa fa-square\' style=\'color:#DBC112\'></i> de 7 a 10 dias úteis</p>'+
                    '<p><i class=\'fa fa-square\' style=\'color:#A3100F\'></i> a partir do 11º dia útil</p>'+
                    '<hr></span></h5>'+
                    '<h5><p><b>*por limitações técnicas, os feriados são computados como dias úteis</b></p></h5>'"
            v-tippy="{
                inertia:true,
                arrow:true,
                animation:'perspective',
                distance:'1',
                size:'large',
                arrow:true,
                delay: [500, 0],
                placement: 'right'}"
            />
        </h1>


        <div class="col-lg-7 col-md-6 col-sm-5">
          <div class="col-md-8 pull-right">
            <div class="input-group">
              <input v-model="pesquisa" v-on:keyup.enter="filtrar()" type="text" class="form-control" placeholder="Pesquisa..." ref="caixaPesquisa" @focus="$event.target.select()"
                     :title="'<h5>Digite uma palavra ou número e pressione Enter</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
              <span class="input-group-btn" v-if="pesquisa.length > 0" :title="'<h5>Limpar essa pesquisa</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                <button @click="pesquisa = ''; filtrar()" type="button" class="btn" style="background: white; border-color: #d2d6de; border-width: 1px 0px;"><i class="fa fa-remove"></i></button>
              </span>
              <span class="input-group-btn">
                <button :disabled="!pesquisa" @click="filtrar()" type="button" class="btn btn-default btn-flat"><i class="fa fa-search"></i></button>
              </span>

            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-3 col-sm-7 text-lg-left">
          <div class="truncar" style="padding-top:5px; font-size:18px; color:darkgray;">
            <span style="margin-left: 5px;color: firebrick; font-weight: bold">{{totalTarefas(listaValidacoes)}}</span> tarefa(s)
            <span v-if="tarefasSelecionadas.length > 0"> com <span style="color: var(--cor-azul)">{{tarefasSelecionadas.length}}</span> selecionada{{tarefasSelecionadas.length > 1 ? 's' : ''}}</span>
          </div>
        </div>

        <div class="col-lg-8 col-md-9 col-sm-12 text-right" style="line-height: 2em;">
          <span class="indicadores-cb-inline">
            <div class="juntos" :disabled="mostraProcessando">
              <i @click="selecionarTodasTarefas = (selecionarTodasTarefas === 'nao') ? 'sim' : 'nao'" :class="(selecionarTodasTarefas === 'nao' ? 'fa fa-square-o' : 'fa fa-check-square-o selecionado')" aria-hidden="true"></i>
              <span :class="selecionarTodasTarefas === 'nao' ? '' : 'selecionado'" >Selecionar tudo</span>
            </div>

            <div class="juntos">
              <i @click="meusFavoritados = (meusFavoritados === 'nao') ? 'sim' : 'nao'" :class="(meusFavoritados === 'nao' ? 'fa fa-square-o' : 'fa fa-check-square-o selecionado')" aria-hidden="true"></i>
              <span :class="meusFavoritados === 'nao' ? '' : 'selecionado'">Favoritos</span>
            </div>

            <div class="juntos">
              <i @click="minhasTarefas = (minhasTarefas === 'nao') ? 'sim' : 'nao'" :class="(minhasTarefas === 'nao' ? 'fa fa-square-o' : 'fa fa-check-square-o selecionado')" aria-hidden="true"></i>
              <span :class="minhasTarefas === 'nao' ? '' : 'selecionado'">Minhas Tarefas</span>
            </div>

            <!--<div class="juntos" v-if="validacao === 'ENTIDADES' || validacao === 'CADASTRO_PARCEIRO_ESTRATEGICO'">-->
            <!--<i @click="comProjetos = (comProjetos === 'nao') ? 'sim' : 'nao'" :class="(comProjetos === 'nao' ? 'fa fa-square-o' : 'fa fa-check-square-o selecionado')" aria-hidden="true"></i>-->
            <!--<span :class="comProjetos === 'nao' ? '' : 'selecionado'">Com projeto</span>-->
            <!--</div>-->

            <div class="juntos">
              <i @click="somenteComTarefas = (somenteComTarefas === 'nao') ? 'sim' : 'nao'" :class="(somenteComTarefas === 'nao' ? 'fa fa-square-o' : 'fa fa-check-square-o selecionado')" aria-hidden="true"></i>
              <span :class="somenteComTarefas === 'nao' ? '' : 'selecionado'">Somente com Tarefas</span>
            </div>

            <div class="pull-right">
              <span style="float: right;">
                <select class="form-control" v-model="ordenacao.por" style="width: auto; float: left;"
                        :title="'<h5>Selecione por qual critério deseja ordenar</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                  <option value="id_processo">ID</option>
                  <option value="projeto" v-if="!_.includes(['ENTIDADES', 'PARCEIRO_ESTRATEGICO'], validacao)">Projeto</option>
                  <option value="extra.situacao_projeto" v-if="_.includes(['SOLICITACOES'], validacao)">Situação do Projeto</option>
                  <option value="entidade">Entidade</option>
                  <option value="valor" v-if="_.includes(['SOLICITACOES'], validacao)">Valor</option>
                  <option value="data_solicitacao">Data da Solicitação</option>
                  <option value="codigo_ocorrencia" v-if="_.includes(['OCORRENCIAS'], validacao)">Código da Ocorrência</option>
                </select>

                <button type="button" @click="ordenacao.ordem = ordenacao.ordem === 'asc' ? 'desc' : 'asc'" class="btn btn-default btn-flat" style="float: left;"
                        :title="'<h5>Clique para inverter a ordenação por ' + _.replace(ordenacao.por, '_', ' ') + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                  <i :class="'fa fa-sort-alpha-' + ordenacao.ordem" style="font-size: 14px;"></i>
                </button>
              </span>
            </div>

          </span>

        </div>

        <div v-if="tarefasSelecionadas.length > 0" class="col-xs-12 text-left">

          <span v-if="!mostraProcessando">
            <g-button-ujarak color="success" size="button--size-ss" @click.native="favoritarLote(true)"
                             :title="'<h5>Favoritar todos os selecionados</h5>'" v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }">
              <i class="fa fa-star"></i> Favoritar
            </g-button-ujarak>

            <g-button-ujarak color="warning" size="button--size-ss" @click.native="favoritarLote(false)"
                             :title="'<h5>Desfavoritar todos os selecionados</h5>'" v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }">
              <i class="fa fa-star-o"></i> Desfavoritar
            </g-button-ujarak>

            <div class="espacamento_botoes"></div>

            <g-button-ujarak color="success" size="button--size-ss" @click.native="atribuirLote(true)"
                             :title="'<h5>Atribuir a mim todos os selecionado</h5>'" v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }">
              <i class="fa fa-user"></i> Assumir
            </g-button-ujarak>
            <!-- 65438 - Problema ao Desatribuir / Assumir quando o usuario pesquisa pelo número do processo -->
            <g-button-ujarak color="warning" size="button--size-ss" @click.native="atribuirLote(false)"
                             :title="'<h5>Desatribuir todos os selecionado</h5>'" v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }">
              <i class="fa fa-user-times"></i> Desatribuir
            </g-button-ujarak>
            <!-- 74510 - Distribuir tarefas para os funcionários da equipe -->
            <span v-if="this.usuarioLogado.perfis.some(perfil => perfil.ds_nome === 'Gerentes')">  
              <g-button-ujarak
              color="success"
              size="button--size-ss"
              @click.native="showModal=true"
              :title="'<h5>Atribuir as tarefas selecionadas a funcionário</h5>'"
              v-tippy="{ inertia: true, arrow: true, animation: 'perspective', distance: '1', size: 'large', arrow: true }">
              <i class="fa fa-user-plus"></i> Atribuir
              </g-button-ujarak>

              <!-- Modal com overlay -->
              <div v-if="showModal" class="modal-overlay">
              <div class="modal-container" style="display: flex; flex-direction: column; align-items: center;">
                  <button class="btn-close" @click="cancelarAtribuicao"><i class="fa fa-times" aria-hidden="true"></i></button>
                  <h2 style="margin-bottom: 30px;"><strong>Selecione o funcionário:</strong></h2>
                  <div style="text-align: center;">
                      <input
                          type="text"
                          id="searchFuncionario"
                          v-model="funcionarioBusca"
                          placeholder="Digite o nome ou a matrícula do funcionário"
                          @keyup.enter="buscarFuncionario"
                          style="display: inline-block; margin-bottom: 10px; margin-right: 10px;"
                      />
                      <button class="btn-confirm" @click="buscarFuncionario" style="display: inline-block;"><i class="fa fa-search" aria-hidden="true"></i></button>
                  </div>
                  <div v-if="funcionarioEncontrado" style="text-align: left;">
                      <p><strong>Funcionário:</strong> {{ funcionarioEncontrado.nome }}</p>
                      <p style="margin-top: -15px;"><strong>Matrícula:</strong> {{ formatarMatricula(funcionarioEncontrado.matricula) }}</p>
                  </div>
                  <div v-if="funcionarioEncontrado">
                      <p>Deseja realmente atribuir as tarefas selecionadas?</p>
                      <div class="modal-actions">
                          <button class="btn-confirm" @click="confirmarAtribuicao">Confirmar</button>
                          <button class="btn-cancel" @click="cancelarAtribuicao">Cancelar</button>
                      </div>
                  </div>
              </div>
          </div>
        </span>


            <div class="espacamento_botoes"></div>

            <span :title="'<h5>Baixar <span class=\'realce\'>' + tarefasSelecionadas.length + '</span> item(ns) selecionado(s) em Excel</h5>'" v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }" style="display: inline-block;">
              <download-excel
                :data   = "tarefasSelecionadas"
                :meta   = "excel_meta"
                :fields = "excel_campos"
                type    = "xls"
                name    = "validacoes.xls">
                <g-button-ujarak color="primary" size="button--size-ss">
                  <i class="fa fa-download" aria-hidden="true"></i> Baixar planilha
                </g-button-ujarak>
              </download-excel>
            </span>

          </span>

          <span v-if="mostraProcessando">
            <i class="fa fa-refresh fa-spin"></i>
          </span>
        </div>

      </section>

    </div>
    <!-- Main content :: Lista de Processos, Atividades e Tarefas ------------------------------------------------>
    <section class="content" style="padding-top: 60px;">
      <p class="visible-sm visible-xs">&nbsp;</p><p class="visible-xs">&nbsp;</p><p class="visible-xs">&nbsp;</p>

      <h4 v-if="mostraCarregando" class="box-body text-center"><i class="fa fa-refresh fa-spin"></i></h4>
      <h4 v-if="somenteComTarefas === 'sim' && totalTarefas(listaValidacoes) === 0" class="box-body">Não há tarefas para o filtro selecionado</h4>

      <!-------------------------------------------------------------------------------------------------------------------------------------------->
      <div class="box box-widget" v-for="processo in _.keysIn(listaValidacoes)" v-show="!mostraCarregando">

        <div class="box-header">
          <h3 class="box-title">
            <span class="grupoMostrarOcultar" @click="mostrar('processo', processo)"><i :class="'fa fa-caret-' + (!_.isUndefined(_.find(mostrarProcesso, function (p) { return p === processo })) ? 'up': 'down')" aria-hidden="true"></i> {{enumeradores[processo]}}<span class="contador">{{totalTarefas(listaValidacoes[processo])}}</span></span>
          </h3>
          <!-- 68898 - Filtro de carteiras em contrapartida apenas quando a aba estiver aberta -->
          <div v-if="processo==='CONTRAPARTIDA' && filtroContrapartida" style="margin-top:20px">
            <div class="filtroCarteira mt-5">
              <select @change="onChangeFiltroCarteiraContrapartida()"
                v-model="filtroCarteiraContrapartida"
                style="width: auto; float: left" class="form-control">
                <option disabled value="">Filtrar por carteira</option>
                <option value="">Todas as carteiras</option>
                <option v-for="carteira in carteiras" :value="carteira">
                  {{ carteira }}
                </option>
              </select>
            </div>
          </div>

          <span v-if="processo === 'ALTERACOES_PROJETO'">
            <div class="pull-right" :title="'<h5>Lista com processos de alteração de projeto nas tarefas listadas abaixo</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', placement:'top', delay: [500, 0]}">
              <select @change="filtrar" v-model="meusProcessos" class="form-control">
                <option value="" style="color: var(--cor-destaque)" selected>{{ meusProcessos === '' ? 'Processos' : 'Limpar Filtro' }}</option>
                <option v-for="prc in _.uniq(_.flatten(_.map(_.flatten(_.valuesIn(listaValidacoes.ALTERACOES_PROJETO)), 'extra.processos')))" :value="prc">{{ enumeradores[prc] }}</option>
              </select>
            </div>

            <div class="pull-right" style="margin: 0px 10px" :title="'<h5>Lista com as carteiras nas tarefas listadas abaixo</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', placement:'top', delay: [500, 0]}">
              <select @change="filtrar" v-model="minhaCarteira" class="form-control">
                <option value="" style="color: var(--cor-destaque)" selected>{{ minhaCarteira === '' ? 'Carteiras' : 'Limpar Filtro' }}</option>
                <option v-for="carteira in _.uniq(_.map(_.flatten(_.valuesIn(listaValidacoes.ALTERACOES_PROJETO)), 'extra.carteira'))" :value="carteira">{{ carteira }}</option>
              </select>
            </div>
          </span>
        </div>

        <div class="box-body" v-if="!_.isUndefined(_.find(mostrarProcesso, function (p) { return p === processo }))">

          <!-------------------------------------------------------------------------------------------------------------------------------------------->
          <div class="box box-widget" v-for="atividade in _.keysIn(listaValidacoes[processo])">

            <div class="box-header">
              <h3 class="box-title">
                <span class="grupoMostrarOcultar" @click="mostrar('atividade', (processo + '.' + atividade))"><i :class="'fa fa-caret-' + (!_.isUndefined(_.find(mostrarAtividade, function (p) { return p === (processo + '.' + atividade) })) ? 'up': 'down')" aria-hidden="true"></i> {{enumeradores[atividade]}}<span class="contador">{{totalTarefas(listaValidacoes[processo][atividade])}}</span></span>
              </h3>
            </div>

            <div class="box-body" v-if="!_.isUndefined(_.find(mostrarAtividade, function (p) { return p === (processo + '.' + atividade) }))" :ref="processo + '.' + atividade">

              <!-------------------------------------------------------------------------------------------------------------------------------------------->
              <div v-show="mostraProcessando" class="overlay box box-widget" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                <i class="fa fa-refresh fa-spin"></i>
              </div>

              <div v-if="true">
                <b-container fluid>
                  <div class="row tarefa" v-bind:style="'border-left: 10px solid ' + (sinalizaCor(tarefa))"
                       v-for="tarefa in (_.includes(['projeto', 'entidade'], ordenacao.por) ?
                           _.orderBy(listaValidacoes[processo][atividade], [function(termo) { return _.lowerCase(termo[ordenacao.por]) }, ordenacao.por], [ordenacao.ordem]) :
                              _.includes(['valor'], ordenacao.por) ? // se for um valor deve converter primeiro antes de ordenar
                              _.orderBy(listaValidacoes[processo][atividade], [function(termo) { return parseFloat(termo[ordenacao.por]) }, ordenacao.por], [ordenacao.ordem]) :
                              _.includes(['codigo_ocorrencia'], ordenacao.por) ? // se código de oorrência deve pegar no 'extra'
                              _.orderBy(listaValidacoes[processo][atividade], ['extra.codigo_ocorrencia'], [ordenacao.ordem]) :
                              _.orderBy(listaValidacoes[processo][atividade], [ordenacao.por], [ordenacao.ordem]) )">

                    <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12" style="height: 46px;">
                      <div class="col-xs-2" style="padding: 2px 0;">
                        <span class="indicadores">
                          <i @click="selecionarItem(tarefa)" :class="(_.find(tarefasSelecionadas, ['id_processo', tarefa.id_processo]) ? 'fa fa-check-square-o' : 'fa fa-square-o') + ' selecao'" aria-hidden="true"></i>
                          <i :class="(tarefa.favoritado === 'sim_fav' ? 'fa fa-star favorito' : 'fa fa-star-o')" aria-hidden="true"></i>


                          <!-- Icones de aviso de Chamado no SGP  -->
                          <span v-if="(_.get(tarefa.extra, 'chamados', [])).length === 1">
                            <a v-for="chamado in _.get(tarefa.extra, 'chamados', [])" :href="urlLaravel + '/cadastro/chamado/edita/' + chamado.id" target="_blank"
                                                          :title="'<h5 class=\'text-left\'>Chamado SGP <span class=\'realce\'>' + chamado.id + '</span><br/>' + ((chamado.descricao).substr(0, 50) + (chamado.descricao.length > 50 ? '...' : '')) + '</h5>'"
                                                          v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', placement:'top', interactive:true}">
                              <i class="fa fa-comments-o" aria-hidden="true"></i>
                            </a>
                          </span>



                          <span v-if="(_.get(tarefa.extra, 'chamados', [])).length > 1" class="dropup menu_chamados">
                            <span data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="balao_chamado dropdown">
                            <span><i class="fa fa-comments-o" aria-hidden="true"></i></span>
                            <span class="contador_chamado">{{(_.get(tarefa.extra, 'chamados', [])).length}}</span>
                          </span>
                          <ul class="dropdown-menu">
                            <li v-for="chamado in _.get(tarefa.extra, 'chamados', [])" role="menuitem">
                              <a :href="urlLaravel + '/cadastro/chamado/edita/' + chamado.id" target="_blank" class="item_chamado">
                                                        Chamado SGP <span class="realce">{{chamado.id}}</span> <i class="fa fa-external-link"></i><br>{{((chamado.descricao).substr(0, 50) + (chamado.descricao.length > 50 ? '...' : ''))}}</a>
                            </li>
                          </ul>
                          </span>

                          <!-- Icones de aviso de Suportes FBB vinculados a processos -->
                          <span v-if="!_.isNull(tarefa.extra) && _.has(tarefa.extra, 'parametros') && _.find(tarefa.extra.parametros, ['parametro', 'SUPORTE_FBB'])">
                            <span v-for="suporte in parametroStringToObject(tarefa.extra.parametros, 'SUPORTE_FBB')">
                              <a :href="'https://suporte.fbb.org.br/ocomon/geral/mostra_consulta.php?numero=' + suporte.numero" target="_blank"
                                    :title="'<h5>Suporte FBB <span class=\'realce\'>' + suporte.numero + '</span><br/>' + suporte.local + ' para ' + suporte.areaoper + '<br/>' + suporte.problema + '</h5>'"
                                    v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'top'}">
                                <i class="fa fa-commenting-o" aria-hidden="true"></i>
                              </a>
                            </span>
                          </span>

                        </span>
                        <br/>
                        <span class="text-muted" v-html="tarefa.id_processo"></span>
                      </div>

                      <div class="col-xs-10">
                        <div class="projeto truncar" v-html="tarefa.projeto"></div>
                        <div class="entidade truncar" v-html="tarefa.entidade"></div>
                      </div>
                    </div>

                    <div class="col-lg-1 col-md-2 col-sm-2 col-xs-6 text-center" style="height: 46px; padding: 2px 0;">
                      <span v-if="_.includes(['ALTERACOES_PROJETO'], processo)"
                            :title="'<h5>' +
                            ((_.get(tarefa.extra.solicitacao, 'processos', [])).length === 0 ? ((_.get(tarefa, 'extra.solicitacao.justificativa', '')).substr(0, 100) + '...') :
                            (_.join(_.orderBy(_.uniq(_.map(_.get(tarefa.extra.solicitacao, 'processos', []), function(p) {return enumeradores[p.nome]})), null, ['asc']), ', '))) + '</h5>'"
                            v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', placement:'top'}">
                        {{ (_.get(tarefa.extra.solicitacao, 'processos', [])).length > 1 ? (_.get(tarefa.extra.solicitacao, 'processos', [])).length + ' processos' : '1 processo' }}
                      </span>
                      <span v-else-if="_.includes(['SOLICITACOES'], validacao)">
                        <span v-if="!_.isNull(tarefa.extra) && _.has(tarefa.extra, 'situacao_projeto')" v-bind:style="'font-weight: bold; color:' + (tarefa.extra.situacao_projeto === 'APR' ? 'var(--cor-destaque)': 'var(--cor-atencao)')"
                              :title="'<h5>' + tarefa.extra.descricao_situacao + '</h5>'"
                              v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'top'}">
                          {{tarefa.extra.situacao_projeto}}
                        </span>
                      </span>
                      <span v-if="_.has(tarefa.extra, 'codigo_ocorrencia')" class="text-bold">
                        <span v-for="nivel in [(_.get(tarefa, 'extra.codigo_ocorrencia')).substr(0, 1)]" v-bind:style="'color: var(--cor-' + (nivel === '4' ? 'atencao' : (nivel === '3' ? 'alerta' : (nivel === '2' ? 'destaque' : 'fraca'))) + ')'">
                          {{ _.get(tarefa, 'extra.codigo_ocorrencia') }}
                        </span>
                      </span>
                      <span v-else v-html="tarefa.info"></span>
                    </div>

                    <div :class="(_.includes(['SOLICITACOES'], validacao) ? 'col-lg-2 col-md-4 col-sm-4 col-xs-6' : 'col-lg-2 col-md-6 col-sm-5 col-xs-6') + ' text-center'" style="height: 46px;">
                      <div v-if="atividade === 'FINALIZADAS'" class="aprovado_por usuario">Aprovado por<br/><div class="truncar" v-html="tarefa.nome_usuario"></div></div>

                      <div v-else>
                        <div v-if="tarefa.nome_usuario" class="usuario" v-html="tarefa.nome_usuario"></div>
                        <div v-else class="text-muted">Aguardando atendimento</div>
                      </div>
                    </div>


                    <div class="col-lg-1 col-md-2 col-sm-2 col-xs-4 text-left" v-if="_.includes(['SOLICITACOES'], validacao)" style="height: 46px;">
                      <span v-if="_.includes(['PAGAMENTO', 'PRESTACAO_DE_CONTAS', 'RESSARCIMENTO'], processo)">
                        <span v-if="_.includes(['AUTORIZACAO', 'ANALISE_TRIBUTARIA', 'LIQUIDACAO_FINANCEIRA'], atividade)">
                          <span :title="'<h5>Tributado: <span class=\'realce\'>' + (_.get(_.last(_.filter(tarefa.extra.parametros, ['parametro', 'TRIBUTACAO'])), 'valor') === 'TRIBUTADO' ? 'Sim' : 'Não') + '</span></h5>'"
                                v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'top'}">
                            {{tarefa.valor | real}}
                          </span>
                          <span v-if="atividade === 'AUTORIZACAO' && !_.isNull(tarefa.extra) && _.has(tarefa.extra, 'parametros') && _.find(tarefa.extra.parametros, ['parametro', 'VALOR_TRIBUTADO'])" style="color: var(--cor-destaque)"
                                :title="'<h5>Valor Líquido</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'top'}">
                            <br/>{{tarefa.valor - (_.toNumber(_.get(_.last(_.filter(tarefa.extra.parametros, ['parametro', 'VALOR_TRIBUTADO'])), 'valor'))) | real}}
                          </span>
                        </span>
                        <span v-else>{{tarefa.valor | real}}</span>
                      </span>
                      <span v-else>{{tarefa.valor | real}}</span>
                    </div>


                    <div class="col-lg-1 col-md-2 col-sm-2 col-xs-4 text-right" style="height: 46px;">
                      <span v-if="_.isNull(tarefa.data_solicitacao)">{{tarefa.inicio | moment("DD/MM/YYYY HH:mm")}}</span>
                      <span v-else>{{tarefa.data_solicitacao | moment("DD/MM/YYYY HH:mm")}}</span>
                    </div>


                    <div :class="(_.includes(['SOLICITACOES'], validacao) ? 'col-lg-1 col-md-2 col-sm-2 col-xs-4' : 'col-lg-2 col-md-2 col-sm-3 col-xs-8') + ' text-right'" style="height: 46px; padding: 2px 0;">
                      <g-button-ujarak color="primary" size="button--size-ss" @click.native="verificarAtribuicao(tarefa)"
                                       :title="'<h5>Assumir e Fazer</h5>'" v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }">
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                      </g-button-ujarak>
                    </div>
                  </div>

                </b-container>
              </div>

              <!-------------------------------------------------------------------------------------------------------------------------------------------->

            </div>

          </div>

          <!-------------------------------------------------------------------------------------------------------------------------------------------->

        </div>

      </div>

    </section>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import moment from 'moment'

  export default {
    name: 'ListaValidacaoSolicitacoes',
    data () {
      return {
        carteiras: ['AABB Comunidade', 'Agroecologia', 'Agroindústria/MUTS', 'Educação para o Futuro', 'Estratégicos', 'Resíduos Sólidos/Água/BTS', 'Ajuda Humanitária', 'Meio Ambiente e Renda', 'Saúde e Bem-Estar', 'Voluntariado'],
        ativaGeracaoRemessa: true, // Desativada até liberação pelo cliente, previsão para final de janeiro/2023
        filtroCarteiraContrapartida: '',
        selecionarTodasTarefas: 'nao',
        somenteComTarefas: 'nao',
        meusFavoritados: 'nao',
        minhasTarefas: 'nao',
        comProjetos: 'nao',
        minhaCarteira: '',
        meusProcessos: '',
        funcis: [],
        ordenacao: {
          por: 'data_solicitacao',
          ordem: 'asc'
        },
        processos: [],
        tarefas: [],
        excel_campos: {
          'ID': 'id_processo',
          'Processo': 'nome_processo',
          'Atividade': 'nome_tarefa',
          'Entidade': 'entidade',
          'Projeto': 'projeto',
          'Atribuido': 'nome_usuario',
          'Informacoes': 'info',
          'Valor': 'valor',
          'Data de Criação': 'data_solicitacao'
        },
        excel_meta: [[{'key': 'charset', 'value': 'utf-8'}]],
        validacao: '',
        mostraCarregando: true,
        mostraProcessando: false,
        showModal: false,
        funcionarioBusca: '',
        funcionarioEncontrado: null,
        tarefasSelecionadas: [],
        mostrarProcesso: [],
        mostrarAtividade: [],
        listaValidacoesBackup: {},
        listaValidacoes: {
          PAGAMENTO: {
            ANALISE: [],
            ANALISE_TRIBUTARIA: [],
            AUTORIZACAO: [],
            LIQUIDACAO_FINANCEIRA: []
          },
          RESSARCIMENTO: {
            ANALISE: [],
            ANALISE_TRIBUTARIA: [],
            AUTORIZACAO: [],
            LIQUIDACAO_FINANCEIRA: []
          },
          ADIANTAMENTO: {
            ANALISE: [],
            AUTORIZACAO: [],
            LIQUIDACAO_FINANCEIRA: []
          },
          PRESTACAO_DE_CONTAS: {
            ANALISE: [],
            ANALISE_TRIBUTARIA: [],
            AUTORIZACAO: []
            // LIQUIDACAO_FINANCEIRA: []
          },
          // RESSARCIMENTO: {
          //   ANALISE: [],
          //   ANALISE_TRIBUTARIA: [],
          //   AUTORIZACAO: []
            // LIQUIDACAO_FINANCEIRA: []
          // },
          DEVOLUCAO_DE_ADIANTAMENTO: {
            ANALISE: [],
            ANALISE_FINANCEIRA: []
          },
          CONTRAPARTIDA: {
            ANALISE: []
          },
          RELATORIO_DE_EXECUCAO: {
            ANALISE: [],
            REVISAO: []
          },
          PROPOSTA_COMPLETA: {
            ANALISE: [],
            DEFERIMENTO: [],
            FORMALIZACAO: [],
            APROVACAO_PROJETO: [],
            REVISAO: []
          },
          PROPOSTA_EDITAL: {
            ANALISE: [],
            DEFERIMENTO: [],
            FORMALIZACAO: [],
            APROVACAO_PROJETO: [],
            REVISAO: []
          },
          CADASTRO_ENTIDADES: {
            ANALISE: []
          },
          CADASTRO_ENTIDADES_COM_PROJETO: {
            ANALISE: []
          },
          ALTERACOES_PROJETO: {
            ANALISE: [],
            AUTORIZACAO: [],
            DELIBERACAO: [],
            PENDENCIAS: [],
            REVISAO: []
          },
          OCORRENCIA_PROJETO: {
            AGUARDA_BAIXA: [],
            AGUARDA_APROVACAO: []
          },
          OCORRENCIA_ENTIDADE: {
            AGUARDA_BAIXA: [],
            AGUARDA_APROVACAO: []
          },
          AVALIACAO_APROVACAO: {
            SOLICITACAO: [],
            REVISAO: [],
            ANALISE: []
          },
          AVALIACAO_ENCERRAMENTO: {
            SOLICITACAO: [],
            REVISAO: [],
            ANALISE: []
          }
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
        pesquisa: '',
        opcoes: '',
        // Suporte 73355 alteração do nome análise financeira para acerto contábil na fase de devolução de adiantamento
        enumeradores: {'PROPOSTA_EDITAL': 'Editais', 'PROPOSTA_COMPLETA': 'Prospecção Direta', 'PAGAMENTO': 'Pagamento', 'RELATORIO_DE_EXECUCAO': 'Relatório de Execução', 'FLUXO_SIMPLIFICADO': 'Fluxo Simplificado', 'DEFERIMENTO': 'Deferimento', 'FORMALIZACAO': 'Formalização', 'APROVACAO_PROJETO': 'Aprovação de projetos', 'CONTRAPARTIDA': 'Contrapartida', 'ADIANTAMENTO': 'Adiantamento', 'DEVOLUCAO_DE_ADIANTAMENTO': 'Devolução de Adiantamento', 'PRESTACAO_DE_CONTAS': 'Prestação de Contas', 'CADASTRO_ENTIDADES': 'Cadastramento de Entidades', 'CADASTRO_ENTIDADES_COM_PROJETO': 'Entidades com projetos aprovados', 'ANALISE': 'Análise', 'PRIMEIRA_APROVACAO': 'Primeira Aprovação', 'SEGUNDA_APROVACAO': 'Segunda Aprovação', 'PENDENCIAS': 'Pendências', 'AUTORIZACAO': 'Autorização', 'ANALISE_FINANCEIRA': 'Acerto Contábil', 'ANALISE_TRIBUTARIA': 'Análise Tributária', 'LIQUIDACAO_FINANCEIRA': 'Liquidação', 'REVISAO': 'Revisão', 'APROVACAO': 'Aprovação', 'ENTIDADES': 'Entidades', 'PROPOSTAS': 'Contratação de projetos', 'SOLICITACOES': 'Execução financeira', 'RESSARCIMENTO': 'Ressarcimento', 'AVALIACOES': 'Avaliações de projeto', 'AVALIACAO_APROVACAO': 'Marco zero', 'AVALIACAO_ENCERRAMENTO': 'Marco um', 'SOLICITACAO': 'Em preenchimento', 'OCORRENCIAS': 'Ocorrências', 'OCORRENCIA_PROJETO': 'Ocorrência em projetos', 'OCORRENCIA_ENTIDADE': 'Ocorrência em entidade', 'AGUARDA_BAIXA': 'Baixa', 'AGUARDA_APROVACAO': 'Aprovação', 'FLEXIBILIZACAO': 'Flexibilização', 'ALTERACAO_ATIVIDADES': 'Atividades', 'ALTERACAO_ATIVIDADES_GANTT': 'Atividades (via Gantt)', 'ALTERACAO_METAS': 'Metas', 'ALTERACAO_MUNICIPIOS': 'Municípios', 'ALTERACAO_PARCELAS_ADIANTAMENTO': 'Parcelas de Adiantamento', 'ALTERACAO_PERIODO_PROJETO': 'Prorrogação de Prazo', 'ALTERACOES_PROJETO': 'Alterações do Projeto', 'REMANEJAMENTO': 'Remanejamento', 'SUPLEMENTACAO': 'Suplementação', 'FEITO': 'Feito', 'EM_EXECUCAO': 'Em Execução', 'CANCELADO': 'Cancelado', 'DELIBERACAO': 'Deliberação'},
        processosPorValidacao: {
          'RELATORIO_DE_EXECUCAO': ['RELATORIO_DE_EXECUCAO'],
          'OCORRENCIAS': ['OCORRENCIA_PROJETO', 'OCORRENCIA_ENTIDADE'],
          'SOLICITACOES': ['PAGAMENTO', 'CONTRAPARTIDA', 'ADIANTAMENTO', 'DEVOLUCAO_DE_ADIANTAMENTO', 'PRESTACAO_DE_CONTAS', 'RESSARCIMENTO'],
          'ENTIDADES': ['CADASTRO_ENTIDADES', 'CADASTRO_ENTIDADES_COM_PROJETO'],
          'AVALIACOES': ['AVALIACAO_APROVACAO', 'AVALIACAO_ENCERRAMENTO'],
          'ALTERACOES_PROJETO': ['ALTERACOES_PROJETO'],
          'PROPOSTAS': ['PROPOSTA_COMPLETA', 'PROPOSTA_EDITAL'],
          'PARCEIRO_ESTRATEGICO': []
        },
        alturaContentWrapper: window.innerHeight - 51,
        filtroContrapartida: false
      }
    },
    watch: {
      selecionarTodasTarefas () {
        this.selecionarTarefas()
      },
      meusFavoritados () {
        this.filtrar()
      },
      minhasTarefas () {
        this.filtrar()
      },
      comProjetos () {
        this.filtrar()
      },
      somenteComTarefas () {
        this.filtrar()
      },
      ordenacao () {
        this.salvarConfiguracoes()
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado',
        'urlLaravel'
      ])
    },
    async created () {
      if (!this.ativaGeracaoRemessa) {
        _.forEach(this.listaValidacoes, function (processo) {
          _.unset(processo, 'LIQUIDACAO_FINANCEIRA')
        })
      }
      this.validacao = this.$route.params.fase
      await this.listaProcessosEtapas()
    },
    methods: {
      onChangeFiltroCarteiraContrapartida () {
        let filtro = this.filtroCarteiraContrapartida
        if (filtro === '') {
          this.listaValidacoes.CONTRAPARTIDA.ANALISE = this.listaValidacoesBackup.CONTRAPARTIDA.ANALISE
        } else {
          let itensFiltrados = _.filter(this.listaValidacoesBackup.CONTRAPARTIDA.ANALISE, function (e) {
            return e.extra.carteira === filtro
          })
          this.listaValidacoes.CONTRAPARTIDA.ANALISE = itensFiltrados
        }
      },
      selecionarTarefas () {
        this.tarefasSelecionadas = []
        if (this.selecionarTodasTarefas === 'sim') {
          let vm = this
          _.forEach(this.listaValidacoes, function (processo) {
            _.forEach(processo, function (atividade) {
              _.forEach(atividade, function (tarefa) {
                vm.tarefasSelecionadas.push(tarefa)
              })
            })
          })
        }
        this.$forceUpdate()
      },
      parametroStringToObject (listaParametros, parametro) {
        let valorParametro = _.get(_.last(_.filter(listaParametros, ['parametro', parametro])), 'valor')
        let valorComAspasDuplas = ('' + valorParametro).replaceAll('\'', '"')
        return JSON.parse(valorComAspasDuplas)
      },
      sinalizaCor (tarefa) {
        let cor = 'transparent'
        let dataSolicitacao = moment(tarefa.data_solicitacao)
        let agora = moment()
        // Suporte 63654 descontar dias não uteis da solicitação exclusivo para pagamento, adiantamento e ressarcimento. +
        // + Implementação realizada com a função isoWeekday que retorna o dia da semana de 1 a 7, sendo 7 para domingo.

        // Suporte 66174 prazo deve começar a contar a partir do próximo dia útil da semana, +
        // + caso seja aberta a solicitação no Sábado ou no Domingo, seu prazo será contato a partir de Segunda.
        if (dataSolicitacao.add('day').isoWeekday() === 6) {
          dataSolicitacao.add(3, 'day')
        } else if (dataSolicitacao.add(1, 'day').isoWeekday() === 7) {
          dataSolicitacao.add(2, 'day')
        } else {
          dataSolicitacao.add(1, 'day')
        }

        let dias = agora.startOf('day').diff(dataSolicitacao.startOf('day'), 'days')
        if (_.includes(['PAGAMENTO', 'ADIANTAMENTO', 'RESSARCIMENTO'], tarefa.nome_processo)) {
          cor = dias < 4 ? 'var(--cor-verde)' : (dias < 6 ? 'var(--cor-amarela)' : 'var(--cor-atencao-dark)')
        } else if (_.includes(['PRESTACAO_DE_CONTAS', 'DEVOLUCAO_DE_ADIANTAMENTO'], tarefa.nome_processo)) {
          cor = dias < 9 ? 'var(--cor-verde)' : (dias < 13 ? 'var(--cor-amarela)' : 'var(--cor-atencao-dark)')
        } else if (_.includes(['CONTRAPARTIDA'], tarefa.nome_processo)) {
          cor = dias <= 5 ? 'var(--cor-verde)' : (dias <= 15 ? 'var(--cor-amarela)' : 'var(--cor-atencao-dark)')
        }
        return cor
      },
      totalTarefas (item) {
        // Se trata de uma função recursiva que busca N níveis de objetos até achar um array onde devolve a quantidade de elementos dele acumulativamente
        let vm = this
        if (_.isArray(item)) {
          return item.length
        } else {
          let total = 0
          _.forEach(_.keys(item), function (i) {
            total += vm.totalTarefas(item[i])
          })
          return total
        }
      },
      mostrar (secao, elemento) {
        console.log(secao, elemento)
        let mostrarSecao = (secao === 'processo') ? this.mostrarProcesso : this.mostrarAtividade
        if (_.isUndefined(_.find(mostrarSecao, function (s) { return s === elemento }))) {
          if (elemento === 'CONTRAPARTIDA') {
            this.filtroContrapartida = true
          }
          mostrarSecao.push(elemento)
        } else {
          if (elemento === 'CONTRAPARTIDA') {
            this.filtroContrapartida = false
          }
          _.pull(mostrarSecao, elemento)
        }
        this.$forceUpdate()
        this.salvarConfiguracoes()
      },
      listaTodosFuncis () {
        axiosLaravel.post('chamado/listaFuncis').then((response) => {
          this.funcis = response.data
          console.log('all funcis: ', response.data)
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.show = false
          })
      },
      processaString (str) {
      // Remove o primeiro caractere 'f' ou 'F' se existir
        if (str.charAt(0).toLowerCase() === 'f') {
          str = str.substring(1)
        }
      // Remove zeros à esquerda
        str = str.replace(/^0+/, '')
        return str
      },
      formatarMatricula (matricula) {
        return 'F' + matricula.toString().padStart(7, '0')
      },
      removeAcentos (texto) {
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      },
      confirmarAtribuicao () {
        this.atribuirTarefas()
        this.funcionarioBusca = ''
        this.funcionarioEncontrado = null
        this.showModal = false
        this.mensagemConfirmacao = 'Tarefas atribuídas com sucesso!'
        // Limpar a mensagem de confirmação após alguns segundos
        setTimeout(() => {
          this.mensagemConfirmacao = ''
        }, 3000)
      },
      cancelarAtribuicao () {
        this.funcionarioBusca = ''
        this.funcionarioEncontrado = null
        this.showModal = false
      },
      buscaFuncionario () {
        if (this.funcionarioBusca) {
        // Verifica se a entrada é uma matrícula
          const regexMatricula = /^f?\d+$/
          if (regexMatricula.test(this.funcionarioBusca)) {
            this.funcionarioBusca = this.processaString(this.funcionarioBusca)
            const funcionario = this.funcis.find(f => f.CD_MTC_FUN === this.funcionarioBusca)
            return funcionario ? {nome: funcionario.ds_nome_usuario, matricula: funcionario.CD_MTC_FUN, id: funcionario.id} : null
          } else {
          // Caso contrário, assume que a entrada é um nome
            this.funcionarioBusca = this.removeAcentos(this.funcionarioBusca)
            console.log('funcionário sem acentos: ', this.funcionarioBusca)
            const funcionario = this.funcis.find(f => f.ds_nome_usuario.toLowerCase().includes(this.funcionarioBusca.toLowerCase()))
            return funcionario ? {nome: funcionario.ds_nome_usuario, matricula: funcionario.CD_MTC_FUN, id: funcionario.id} : null
          }
        }
        return null
      },
      buscarFuncionario () {
      // Chama a função buscaFuncionario ao mudar o valor do input
        this.funcionarioEncontrado = this.buscaFuncionario(this.funcionarioBusca)
        if (this.funcionarioEncontrado === null) {
          this.mensagemErro = 'Funcionário não encontrado. Por favor, verifique a informação digitada e tente novamente.'
          this.$snotify.error(this.mensagemErro)
        } else {
          this.mensagemErro = ''
        }
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
      async listaProcessosEtapas () {
        this.mostraCarregando = true
        let vm = this
        await axiosLaravel.get('/processos/totais_validacoes/' + this.validacao).then(async (response) => {
          let todasTarefas = _.filter(response.data, function (t) { return _.includes(vm.processosPorValidacao[vm.validacao], t.nome_processo) })
          _.forEach(this.listaValidacoes, function (lv, key) {
            if (!_.includes(vm.processosPorValidacao[vm.validacao], key)) {
              _.unset(vm.listaValidacoes, key)
            }
          })
          todasTarefas.forEach((item) => {
            let secao = this.listaValidacoes[item.nome_processo][item.nome_tarefa]
            if (!_.isUndefined(secao)) {
              item['extra'] = this.jsonValido(item.extra) || {}
              item['extra']['processos'] = _.map(_.get(item.extra.solicitacao, 'processos', []), 'nome')
              secao.push(item)
            }
          })
          //
          this.listaValidacoesBackup = _.cloneDeep(this.listaValidacoes)
          // this.listaTarefas.items = todasTarefas
          //
          if (_.has(this.usuarioLogado, 'configuracoes') && _.has(this.usuarioLogado.configuracoes, 'tela_validacao')) {
            let configuracoes = this.usuarioLogado.configuracoes.tela_validacao
            this.pesquisa = configuracoes.pesquisa || ''
            this.mostrarProcesso = configuracoes.mostrarProcesso || []
            this.mostrarAtividade = configuracoes.mostrarAtividade || []
            this.somenteComTarefas = configuracoes.somenteComTarefas || 'nao'
            this.meusFavoritados = configuracoes.meusFavoritados || 'nao'
            this.minhasTarefas = configuracoes.minhasTarefas || 'nao'
            this.comProjetos = configuracoes.comProjetos || 'nao'
            this.ordenacao = configuracoes.ordenacao || { por: 'data_solicitacao', ordem: 'asc' }
            this.filtrar()
          }
          this.mostraCarregando = false
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
            this.$snotify.clear()
          })
      },
      downloadLote () {
        // TODO implementar futuramente download em lote dos anexos
        axiosLaravel.post('processos/download/lote', this.listarSelecionados()).then((response) => {
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      favoritarLote (favoritar) {
        this.mostraProcessando = true
        axiosLaravel.post('processos/validacao/favorito/lote', {'lista': this.tarefasSelecionadas, 'favoritar': favoritar}).then((response) => {
          let vm = this
          let favorito = favoritar ? 'sim_fav' : 'nao_fav'
          _.forEach(this.listaValidacoes, function (processo) {
            _.forEach(processo, function (atividade) {
              _.forEach(atividade, function (tarefa) {
                if (_.includes(_.map(vm.tarefasSelecionadas, 'id_tarefa_atual'), tarefa.id_tarefa_atual)) {
                  tarefa.favoritado = favorito
                }
              })
            })
          })
          //
          this.tarefasSelecionadas = []
          this.selecionarTodasTarefas = 'nao'
          this.mostraProcessando = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.mostraProcessando = false
            this.$root.trataErro(error)
          })
      },
      salvarConfiguracoes () {
        let vm = this
        _.set(this.usuarioLogado, 'configuracoes.tela_validacao', {
          'pesquisa': vm.pesquisa,
          'mostrarProcesso': _.uniq(vm.mostrarProcesso),
          'mostrarAtividade': _.uniq(vm.mostrarAtividade),
          'somenteComTarefas': vm.somenteComTarefas,
          'meusFavoritados': vm.meusFavoritados,
          'minhasTarefas': vm.minhasTarefas,
          'comProjetos': vm.comProjetos,
          'ordenacao': vm.ordenacao
        })
        //
        this.listaTodosFuncis()
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
      // filtrar (abrirDireto) {
      filtrar () {
        let vm = this
        this.mostraProcessando = true
        let lista = _.cloneDeep(this.listaValidacoesBackup)
        //
        lista = this.minhasTarefas === 'sim' ? this.buscarTermosCampos(lista, ['id_usuario'], [this.usuarioLogado.id]) : lista
        console.log(lista)
        lista = this.meusFavoritados === 'sim' ? this.buscarTermosCampos(lista, ['favoritado'], ['sim_fav']) : lista
        lista = this.somenteComTarefas === 'sim' ? this.buscarTermosCampos(lista, [], []) : lista
        //
        lista = this.minhaCarteira !== '' ? this.buscarTermosCampos(lista, ['extra.carteira'], [this.minhaCarteira]) : lista
        lista = this.meusProcessos !== '' ? this.buscarTermosCampos(lista, ['extra.processos'], [this.meusProcessos]) : lista
        //
        let termos = _.split(_.lowerCase(this.pesquisa), ' ')
        //
        if (termos.length > 0 && _.trim(termos[0]) !== '') {
          lista = this.buscarTermosCampos(lista, ['nome_processo', 'nome_usuario', 'entidade', 'projeto', 'id_tarefa_atual', 'id_processo', 'id_entidade', 'id_projeto', 'info', 'extra'], _.uniq(termos))
        }
        if (this.totalTarefas(lista) === 1) {
          _.forEach(lista, function (processo, nomeProcesso) {
            _.forEach(processo, function (atividade, nomeAtividade) {
              if (atividade.length > 0) {
                vm.mostrarProcesso.push(nomeProcesso)
                vm.mostrarAtividade.push(nomeProcesso + '.' + nomeAtividade)
              }
            })
          })
        }
        //
        this.listaValidacoes = _.cloneDeep(lista)
        this.mostraProcessando = false
        if (this.selecionarTodasTarefas === 'sim') {
          this.tarefasSelecionadas = []
          this.selecionarTarefas()
        }
        this.$refs.caixaPesquisa.focus()
        this.$forceUpdate()
        this.salvarConfiguracoes()
      },
      buscarTermosCampos (lista, campos, termos) {
        let vm = this
        _.forEach(lista, function (processo, nomeProcesso) {
          _.forEach(processo, function (atividade, nomeAtividade) {
            if (campos.length === 0) {
            } else if (campos.length === 1) {
              // 72634 - Filtro minhas tarefas
              let busca = [campos[0], termos[0]]
              processo[nomeAtividade] = _.filter(atividade, busca)
            } else {
              _.forEach(atividade, function (tarefa, idxTarefa) {
                let contador = 0
                _.forEach(campos, function (campo) {
                  _.forEach(termos, function (palavra) {
                    if (_.includes(_.lowerCase(tarefa[campo]), palavra)) {
                      // 65438 - Problema ao Desatribuir / Assumir quando o usuario pesquisa pelo número do processo
                      // verifica se está pesquisando por id do processo, se estiver, nao deixa a tag <mark>
                      let idProcesso = lista[nomeProcesso][nomeAtividade][idxTarefa][campo] === lista[nomeProcesso][nomeAtividade][idxTarefa].id_processo
                      if (!idProcesso) {
                        let padrao = new RegExp(palavra, 'gi')
                        lista[nomeProcesso][nomeAtividade][idxTarefa][campo] = ('' + tarefa[campo]).replace(padrao, '<mark>$&</mark>')
                      }
                      contador++
                    }
                  })
                })
                atividade[idxTarefa]['ocorrenciasFiltro'] = contador++
              })
              processo[nomeAtividade] = _.filter(atividade, function (tarefaFiltrada) {
                return _.has(tarefaFiltrada, 'ocorrenciasFiltro') && tarefaFiltrada.ocorrenciasFiltro > 0
              })
            }
            if (vm.somenteComTarefas === 'sim' && _.isEmpty(processo[nomeAtividade])) {
              _.unset(processo, nomeAtividade)
            }
          })
          if (vm.somenteComTarefas === 'sim' && _.isEmpty(lista[nomeProcesso])) {
            _.unset(lista, nomeProcesso)
          }
        })
        //
        return lista
      },
      async atribuirLote (atribuir) {
        this.mostraProcessando = true
        await axiosLaravel.post('processos/validacao/atribuir/lote', {'lista': this.tarefasSelecionadas, 'atribuir': atribuir}).then((response) => {
          let vm = this
          console.log('variavel atribuir', atribuir)
          let idUsuario = atribuir ? vm.usuarioLogado.id : null
          let nomeUsuario = atribuir ? vm.usuarioLogado.userName : null
          _.forEach(this.listaValidacoes, function (processo) {
            _.forEach(processo, function (atividade) {
              _.forEach(atividade, function (tarefa) {
                if (_.includes(_.map(vm.tarefasSelecionadas, 'id_tarefa_atual'), tarefa.id_tarefa_atual)) {
                  tarefa.id_usuario = idUsuario
                  tarefa.nome_usuario = nomeUsuario
                  console.log('Tarefa assumida', tarefa)
                  // if (tarefa.id_usuario != null) {
                  //   vm.marcaAssumido(tarefa)
                  // } else {
                  //   vm.retiraAssumido(tarefa)
                  // }
                }
              })
            })
          })
          // Alterar tambem na listaValidacoesBackup assim não precisará fazer reload da página
          _.forEach(this.listaValidacoesBackup, function (processo) {
            _.forEach(processo, function (atividade) {
              _.forEach(atividade, function (tarefa) {
                if (_.includes(_.map(vm.tarefasSelecionadas, 'id_tarefa_atual'), tarefa.id_tarefa_atual)) {
                  tarefa.id_usuario = idUsuario
                  tarefa.nome_usuario = nomeUsuario
                  console.log('passou aqui')
                }
              })
            })
          })
          //
          this.tarefasSelecionadas = []
          this.selecionarTodasTarefas = 'nao'
          this.mostraProcessando = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.mostraProcessando = false
            this.$root.trataErro(error)
          })
      },
      async atribuirAFunci (atribuir, matriculaFunci, nomeFunci, idFunci) {
        this.mostraProcessando = true
        await axiosLaravel.post('processos/validacao/atribuir/funci', {'lista': this.tarefasSelecionadas, 'atribuir': atribuir, 'mat_funci': matriculaFunci, 'nome_funci': nomeFunci, 'id_funci': idFunci}).then((response) => {
          let vm = this
          _.forEach(this.listaValidacoes, function (processo) {
            _.forEach(processo, function (atividade) {
              _.forEach(atividade, function (tarefa) {
                if (_.includes(_.map(vm.tarefasSelecionadas, 'id_tarefa_atual'), tarefa.id_tarefa_atual)) {
                  tarefa.id_usuario = idFunci
                  tarefa.nome_usuario = nomeFunci
                  console.log('Tarefa atribuida ao funcionário:', tarefa)
                }
              })
            })
          })
          // Alterar tambem na listaValidacoesBackup assim não precisará fazer reload da página
          _.forEach(this.listaValidacoesBackup, function (processo) {
            _.forEach(processo, function (atividade) {
              _.forEach(atividade, function (tarefa) {
                if (_.includes(_.map(vm.tarefasSelecionadas, 'id_tarefa_atual'), tarefa.id_tarefa_atual)) {
                  tarefa.id_usuario = idFunci
                  tarefa.nome_usuario = nomeFunci
                }
              })
            })
          })
          //
          this.tarefasSelecionadas = []
          this.selecionarTodasTarefas = 'nao'
          this.mostraProcessando = false
          this.tarefasSelecionadas = []
          this.$forceUpdate()
        })
          .catch((error) => {
            console.log(error)
            this.mostraProcessando = false
            this.$root.trataErro(error)
          })
        this.$forceUpdate()
      },
      selecionarItem (item) {
        if (_.find(this.tarefasSelecionadas, ['id_processo', item.id_processo])) {
          _.remove(this.tarefasSelecionadas, function (i) {
            return i['id_processo'] === item.id_processo
          })
        } else {
          this.tarefasSelecionadas.push(item)
        }
        this.$forceUpdate()
      },
      async marcaAssumido (request) {
        console.log('request:>>>>>>', request)
        this.dadosHistorico.fk_processo = request.id_processo
        this.dadosHistorico.fk_usuario = this.usuarioLogado.id
        this.dadosHistorico.nome = 'TAREFA_ASSUMIDA'
        this.dadosHistorico.tipo = 'SISTEMA'
        this.dadosHistorico.etapa_anterior = request.nome_tarefa
        this.dadosHistorico.id = request.id_tarefa_atual
        this.dadosHistorico.inicio = moment().format('YYYY-MM-DD HH:mm:ss')
        await axiosLaravel.post('historico-tarefas/', this.dadosHistorico).then((response) => {
          console.log(response.data)
        })
      },
      async retiraAssumido (request) {
        console.log('request:>>>>>>', request)
        this.dadosHistorico.fk_processo = request.id_processo
        this.dadosHistorico.etapa_anterior = request.nome_tarefa
        this.dadosHistorico.fk_usuario = this.usuarioLogado.id
        this.dadosHistorico.nome = 'DEVOLVE_ATRIBUICAO'
        this.dadosHistorico.tipo = 'SISTEMA'
        this.dadosHistorico.id = request.id_tarefa_atual
        this.dadosHistorico.inicio = moment().format('YYYY-MM-DD HH:mm:ss')
        await axiosLaravel.post('historico-tarefas/', this.dadosHistorico).then((response) => {
          console.log(response.data)
        })
      },

      atribuir (item, deveFazer) {
        axiosLaravel.put('processos/validacao/assumir/', { 'id_tarefa': item.id_tarefa_atual, 'item': item }).then((response) => {
          console.log('Tarefa assumida', _.clone(item))
          if (deveFazer) {
            this.fazer(item)
          }
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },

      fazer (item) {
        if (this.validacao === 'PROPOSTAS') {
          this.$router.push({name: 'proposta-edita', params: {id: item.id_projeto, row: item, acao: 'VALIDAR', processo: item.nome_tarefa, etapa: item.nome_tarefa}})
        } else if (this.validacao === 'ENTIDADES') {
          this.$router.push({name: 'validacao-entidades', params: {id: item.id_entidade, row: item, acao: 'VALIDAR'}})
        } else if (this.validacao === 'CADASTRO_PARCEIRO_ESTRATEGICO') {
          this.$router.push({name: 'validacao-parceiro', params: {id: item.id_processo, row: item, acao: 'VALIDAR'}})
        } else if (this.validacao === 'FLUXO_SIMPLIFICADO') {
          this.$router.push({name: 'validacao-inicial', params: {id: item.id_projeto, row: item, acao: 'VALIDAR', processo: item.nome, etapa: item.nome_tarefa}})
        } else if (item.nome_processo === 'PAGAMENTO') {
          this.$router.push({name: 'solicitacao-pagamento', params: {id: item.id_processo, row: item, acao: 'VALIDAR'}})
        } else if (item.nome_processo === 'CONTRAPARTIDA') {
          this.$router.push({name: 'solicitacao-contrapartida', params: {id: item.id_processo, row: item, acao: 'VALIDAR'}})
        } else if (item.nome_processo === 'ADIANTAMENTO') {
          this.$router.push({name: 'solicitacao-adiantamento', params: {id: item.id_processo, row: item, acao: 'VALIDAR'}})
        } else if (item.nome_processo === 'DEVOLUCAO_DE_ADIANTAMENTO') {
          this.$router.push({name: 'solicitacao-devolucao-adiantamento', params: {id: item.id_processo, row: item, acao: 'VALIDAR'}})
        } else if (item.nome_processo === 'PRESTACAO_DE_CONTAS') {
          this.$router.push({name: 'solicitacao-prestacaocontas', params: {id: item.id_processo, row: item, acao: 'VALIDAR'}})
        } else if (item.nome_processo === 'ALTERACOES_PROJETO') {
          this.$router.push({name: 'solicitacao-alteracoes-projeto', params: {id: item.id_processo}})
        } else if (item.nome_processo === 'RESSARCIMENTO') {
          this.$router.push({name: 'solicitacao-ressarcimento', params: {id: item.id_processo, row: item, acao: 'VALIDAR'}})
        // } else if (item.nome_processo === 'PRESTACAO_DE_CONTAS' && item.nome_tarefa === 'ANALISE') {
        //   this.$router.push({name: 'validacao-solicitacao-prestacao', params: {id: item.id_processo, row: item, acao: 'VALIDAR'}})
        // } else if (item.nome_processo === 'PRESTACAO_DE_CONTAS' && item.nome_tarefa === 'AUTORIZACAO') {
        //   this.$router.push({name: 'validacao-solicitacao-prestacao', params: {id: item.id_processo, row: item, acao: 'VALIDAR'}})
        } else if (this.validacao === 'AVALIACOES') {
          this.$router.push({name: 'preenche-formulario', params: {id: _.split(item.extra.link_acesso, '-')[0]}})
        } else if (this.validacao === 'OCORRENCIAS') {
          this.$router.push({name: 'lista-ocorrencias', params: {id: item.id_processo, row: item, voltar: true}})
        } else if (this.validacao === 'RELATORIO_DE_EXECUCAO') {
          this.$route.params.idProjeto = item.id_projeto
          //
          _.set(item, 'data_solicitacao_criada', item.data_solicitacao)
          _.set(item, 'usuario_id', item.id_usuario)
          _.set(item, 'id_projeto', item.id_projeto)
          _.set(item, 'entidade_id', item.id_entidade)
          _.set(item, 'id_solicitacao', item.id_processo)
          _.set(item, 'id_tarefa', item.id_tarefa_atual)
          _.set(item, 'projeto', item.projeto)
          _.set(item, 'usuario_nome', item.nome_usuario)
          _.set(item, 'entidade_nome', item.entidade)
          _.set(item, 'item.numero', (!_.isNull(item.projeto) && item.projeto.length > 5 ? (item.projeto).substr(0, 5) : '0'))
          _.set(item, 'item.sequencia', 0)
          _.set(item, 'item.id_proposta', item.id_proposta)
          _.set(item, 'item.id_relatorio', item.id_relatorio)
          this.$router.push({name: 'edita-relatorio-execucao', params: {id: item.id_projeto, row: item, acao: 'VALIDAR'}})
        } else {
          this.$root.trataErro('Não é possível abrir essa tarefa. Entre em contato com o Administrador do sistema!')
        }
      },
      async atribuirTarefas () {
        if (!this.funcionarioEncontrado) {
          alert('Por favor, selecione um funcionário válido antes de confirmar.')
          return
        }
      // Lógica para atribuir tarefas ao funcionário
        this.atribuirAFunci(true, this.funcionarioEncontrado.matricula, this.funcionarioEncontrado.nome, this.funcionarioEncontrado.id)
        this.showModal = false
        this.$forceUpdate()
      },
      verificarAtribuicao (item) {
        let copiaItem = _.cloneDeep(item)
        let padrao = new RegExp('<(mark|/mark|br|p|/p)[^>]{0,}>', 'gi') // Eliminar marcações desnecessárias ou que atrapalham o formato do objeto
        _.forEach(item, function (valor, parametro) {
          item[parametro] = _.isNull(valor) ? null : ('' + valor).replace(padrao, '')
        })
        if (_.includes(['AVALIACAO_APROVACAO', 'AVALIACAO_ENCERRAMENTO', 'OCORRENCIA_PROJETO', 'OCORRENCIA_ENTIDADE'], item.nome_processo)) { // Os ajustes feitos acima (retirar marcações) eliminam o extra do objeto, então aqui é "recolocado"
          item.extra = copiaItem.extra
        }
        if (_.isNull(item.id_usuario) || ('' + item.id_usuario === 'null')) {
          this.atribuir(item, true) // Atribui e depois Fazer
        } else if (('' + item.id_usuario) === ('' + this.usuarioLogado.id)) {
          this.fazer(item) // Só Fazer
        } else if (!_.isNull(item.id_usuario) && ('' + item.id_usuario !== 'null') && ('' + item.id_usuario) !== ('' + this.usuarioLogado.id)) {
          // Confirmar antes, Atribui e Fazer depois
          this.$dialog.confirm('A tarefa será atribuída para <b>' + item.nome_usuario + '</b><br/>Deseja continuar ?',
            {html: true, animation: 'fade', customClass: 'avisoAlerta', okText: 'Sim', cancelText: 'Não'})
            .then(dialog => {
              if (confirm) {
                this.atribuir(item, true) // Atribui e depois Fazer
              }
            })
            .catch(() => {
              console.log('Cancelou atribuição de tarefa com outro usuário')
            })
        }
      }
    }
  }
</script>

<style>
  .relatorio_final {
    color: orangered;
    font-weight: bold;
  }
  .relatorio_parcial {
    color: cornflowerblue;
    font-weight: bold;
  }
  .edital {
    color: #777;
    font-weight: bold;
  }
  .projeto_entidade {
    color: #808080;
    width: 100px;
    font-weight: bold;
  }
  .aprovado_por {
    color: #3c763d;
    text-align: left;
  }
  .glosa {
    color: red;
  }
  .espacamento_botoes {
    margin: 0px 5px;
    display: inline-block;
  }

  .indicadores-cb-inline div {
    display: inline;
  }

  .indicadores-cb-inline div span {
    font-size: 14px;
    color: gray;
    vertical-align: text-bottom;
    padding-right: 15px;
  }

  .indicadores-cb-inline div i {
    font-size: 20px;
    cursor: pointer;
  }
  .indicadores-cb-inline div i:hover, .indicadores-cb-inline .selecionado {
    color: var(--cor-azul);
  }

  .indicadores {
    font-size: 16px;
    color: silver;
  }

  .indicadores i.selecao {
    cursor: pointer;
    padding-right: 10px;
  }

  .indicadores i.selecao:hover {
    color: steelblue;
  }

  .indicadores i.fa-star.favorito {
    color: goldenrod;
  }

  .indicadores i.fa-star-o {
    color: #ddd;
  }
  .indicadores .menu_chamados ul {
    background: rgb(51, 51, 51);
    margin: 0;
    min-width: 200px;
  }
  .indicadores .balao_chamado {
    color: #3c8dbc;
    display: flex;
    align-items: flex-start;
    cursor: pointer;
  }
  .indicadores .balao_chamado .contador_chamado {
    background: tomato;
    color: white;
    border-radius: 50%;
    font-size: xx-small;
    font-weight: bold;
    padding: 0px 4px;
  }
  .indicadores .item_chamado {
    color: white !important;
    margin-bottom: 5px;
    padding: .4rem .8rem;
  }
  .indicadores .item_chamado:hover {
    color: white !important;
    background: rgb(20, 20, 20);
  }
  .indicadores .item_chamado .fa-external-link {
    float: right;
    font-size: 10px;
    color: darkgray;
  }

  div#listaValidacoes ul li a {
    zoom: 1.3;
  }
  #listaValidacoes h4 {
    margin: 0;
  }

  .grupoMostrarOcultar {
    color: steelblue;
  }
  .grupoMostrarOcultar:hover {
    color: cornflowerblue;
    text-decoration: underline;
    cursor: pointer;
  }
  .contador {
    margin-left: 50px;
    color: firebrick;
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
  .projeto {
    font-weight: bold;
  }
  .entidade {
    font-style: italic;
  }
  .usuario {
    color: steelblue;
  }
  .tarefa:hover {
    background: #ecf0f5;
  }
  .tarefa {
    border-top: 1px solid silver;
  }
  mark {
    background: #f9dd16 !important;
  }
  .truncar {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .juntos {
    page-break-inside: avoid;
  }
  #validacoes .content-header {
    width: auto !important;
  }
  .vc-title {
    color: red !important;
    font-size: x-large !important;
  }
  .vc-text {
    font-size: medium !important;
  }
  .vc-btn.left {
    font-size: medium !important;
  }
  .vc-btn {
    font-size: medium !important;
  }
  .semaforo {
    cursor: pointer;
    width: 60px;
    height: 20px;
    margin-top: 5px;
    transition: 0.5s ease;
  }
  .semaforo:hover {
    width: 65px;
    height: 25px;
    transition: 0.5s ease;
  }
  .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Estilos do container do modal */
.modal-container {
  background: #fff;
  position: relative;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.modal-container h2 {
  margin-bottom: 10px;
  font-size: 22px;
}

.modal-container p {
  margin-bottom: 20px;
  font-size: 16px;
}

/* Botões no modal */
.modal-actions button {
  margin: 5px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-confirm {
  background-color: #4caf50;
  color: white;
}

.btn-cancel {
  background-color: #f44336;
  color: white;
}
 
.btn-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 16px;
}
</style>
