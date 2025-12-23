<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <section class="content-header">
      <h1>
        <span v-if="ehVisualizacao">Visualizar {{descricaoProcesso[processo]}} {{!_.isNull(id) ? 'ID ' + id : ''}}</span>
        <span v-else>{{etapa}} de {{descricaoProcesso[processo]}} {{!_.isNull(id) ? 'ID ' + id : ''}}</span>

        <div class="espacamento_botoes"></div>

        <span v-if="!loading.tela || ehVisualizacao">
          <g-button-moema color="warning" @click.native="$router.go(-1)" type="button"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</g-button-moema>
        </span>

        <div class="espacamento_botoes"></div>

        <span v-show="!loading.tela" v-if="(!_.isEmpty(projeto) || !_.isNull(id))">
          <!-- Chamado 64.954: relatório 611 -->
          <g-button-ujarak color="primary" size="button--size-ss" @click.native="emitir(611)" href="javascript:void(0)" v-if="(processo === 'PAGAMENTO') && _.includes(['Autorização', 'Liquidação'], ultimaTarefaFeita.nome)"
                           :title="'<h5>611 - Comprovante de Pagamento (PDF)</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
            <i class="fa fa-print" aria-hidden="true"></i> 611
          </g-button-ujarak>
        </span>

        <span v-show="!loading.tela" v-if="usuarioLogado.userType === 'FUNDACAO' && (!_.isEmpty(projeto) || !_.isNull(id))">
          <!--Fabio desistiu após ter sido criado o botão para o relatório 200, logo ele fica sempre oculto-->
          <g-button-ujarak color="primary" size="button--size-ss" @click.native="emitir(200)" href="javascript:void(0)" v-if="_.has(analiseTributaria, 'nf') && ('' + analiseTributaria.nf.SitNfc === '2') && !(('' + nota.forma_pagamento) === '3' && ('' + nota.dados_bancarios.banco + nota.dados_bancarios.agencia + nota.dados_bancarios.conta).length < 6)"
                           :title="'<h5>200 - Comunicado Interno (PDF)</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
            <i class="fa fa-print" aria-hidden="true"></i> 200
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

        <div class="espacamento_botoes"></div>

        <span v-if="!loading.tela && !loading.cronograma && !_.isEmpty(projeto) && !_.isNull(ehNFe) && !ehVisualizacao && restricaoParaInicializar.length === 0"
                    :title="'<h5>' + (_.includes(['Solicitação', 'Revisão'], etapa) ? 'Ao Concluir esta solicitação será encaminhada para Análise da Fundação BB' : (aprovacao.resultadoAprovacao ? 'Será encaminhado para ' + aprovacao.resultadoAprovacao : 'Aguardando decisão (aprovar, devolver etc)')) + '</h5>'"
                    v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
          <button v-if="_.includes(['Análise', 'Análise Tributária'], etapa)" id="botao_concluir" :disabled="botao_concluir_disabled || (!aprovacao.resultadoAprovacao)" v-on:click.stop="preconcluir" type="button" style="" class="success"><i class="fa fa-check" aria-hidden="true"></i> Concluir</button>
          <!-- Demanda 66430 Correção de múltiplos clicks no botão de concluir -->
          <g-button-moema v-else color="success" @click.native.stop="preconcluir" type="button"><i class="fa fa-check" aria-hidden="true"></i> Concluir</g-button-moema>

        </span>

        <!--<span v-if="!loading.tela && !loading.cronograma && !_.isEmpty(projeto) && !_.isNull(ehNFe) && !ehVisualizacao && restricaoParaInicializar.length === 0-->
                    <!--&& (usuarioLogado.userType === 'FUNDACAO' || (usuarioLogado.userType === 'ENTIDADE' && (poderes.codigo === 'DIRIGENTE_SEM_RESTRICAO')))"-->
                    <!--:title="'<h5>' + (_.includes(['Solicitação', 'Revisão'], etapa) ? 'Ao Concluir esta solicitação será encaminhada para Análise da Fundação BB' : (aprovacao.resultadoAprovacao ? 'Será encaminhado para ' + aprovacao.resultadoAprovacao : 'Aguadando decisão')) + '</h5>'"-->
                    <!--v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">-->
          <!--<g-button-moema color="success" @click.native="concluir" type="button"><i class="fa fa-check" aria-hidden="true"></i> Concluir</g-button-moema>-->
        <!--</span>-->
        <span v-if="!_.includes(['Solicitação', 'Revisão'], etapa) && usuarioLogado.userType === 'FUNDACAO' && !loading.tela && !loading.cronograma && !_.isEmpty(projeto) && !ehVisualizacao && restricaoParaInicializar.length === 0"
                    :title="'<h5>Salva esta solicitação<br/>Para encaminhá-la deve-se usar o botão de Concluir' + (usuarioLogado.userType === 'ENTIDADE' && poderes.codigo !== 'DIRIGENTE_SEM_RESTRICAO' ? '<br/>Somente dirigentes estão habilitados para concluir solicitações' : (poderes.mensagem.length > 0 ? '<br/>Restrições:<br/>' + _.join(poderes.mensagem, ', ') : '')) + '</h5>'"
                    v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
          <g-button-moema color="primary" @click.native="salvar" type="button"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar</g-button-moema>
        </span>

        <div class="espacamento_botoes"></div>

        <span v-if="!loading.tela && !ehVisualizacao && restricaoParaInicializar.length === 0 && (etapa === 'Solicitação' || etapa === 'Revisão') && !_.isEmpty(projeto)"
                    :title="'<h5> Abrir Chamado referente a solicitação atual</h5>'"
                    v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
          <g-button-moema color="error" @click.native.stop="abrirChamado" type="button"><i class="fa  fa-comment-o" aria-hidden="true"></i> Abrir Chamado</g-button-moema>
        </span>

      </h1>

      <b-breadcrumb :items="[{text: 'Inicial', href: '/'}, {text: (_.isNull(id) ? 'Solicitações' : 'Validação'), href: '#'}, {text: descricaoProcesso[processo], active: true}]"/>
    </section>


    <section class="content">


      <!-- Lista de projetos ---------------------------------------------------------------------------------------------------->
      <div class="row" id="listaProjetos" v-if="_.isEmpty(projeto) && _.isNull(id) && !ehVisualizacao">
        <div class="col-md-12 form-horizontal">
          <div class="box box-primary">
            <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

            <div class="box-header with-border">
              <h3 class="box-title"><i :class="ehVisualizacao ? 'fa fa-caret-right' : 'fa fa-pencil'" aria-hidden="true"></i> Selecione o projeto</h3>
            </div>
            <div class="box-body">
              <div v-show="listaProjetos.length === 0" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

              <!--Se for solicitacao de um novo pagamento mostra o campo de seleção de projeto-->
              <div class="row">
                <div class="col-sm-6" >
                  <div class="form-group required">
                    <div class="col-sm-12">
                      <select name="projeto"
                              v-model="projeto"
                              class="form-control"
                              aria-hidden="true"
                              @change="selecionaProjeto()" v-validate="'required'">
                        <option v-for="projetoDisponivel in listaProjetos" :value="projetoDisponivel">{{projetoDisponivel.Projeto}}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>




      <!-- Formulário de principal --------------------------------------------------------------------------------------------------------------->
      <div class="row" id="solicitacao" v-if="!_.isEmpty(projeto) || !_.isNull(id)">
        <div class="col-md-12">
          <div class="box box-primary">
            <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
            <span v-if="!_.isEmpty(chamado) && usuarioLogado.userType === 'FUNDACAO'">
              <span class="text-red">* Atenção: O processo que será analisado possui {{chamado.length > 1 ? 'chamados vinculados' : 'chamado vinculado'}}: </span>
              <span v-for="(c, index) in chamado">
              <span class="text-bold" :title="'<h5 class=\'text-left\'>Chamado SGP <span class=\'realce\'>' + c.id + '</span><br/>' + ((c.descricao).substr(0, 200) + (c.descricao.length > 200 ? '...' : '')) + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', placement:'top', interactive:true}">
              <router-link target="_blank" :to="{name: 'cadastro-chamado-edita', params: { id: c.id}}">{{c.id}}</router-link>
              </span>
                              {{index < chamado.length - 1 ? ', ' : ''}}
              </span>
            </span>
            <p v-if="nota.suporteFbb.length > 0 && usuarioLogado.userType === 'FUNDACAO'">
              <span class="text-red">** Atenção: Este processo possui {{ nota.suporteFbb.length > 1 ? 'os seguintes suportes vinculados' : 'este suportes vinculado' }}:</span>
              <a v-for="(suporte, index) in nota.suporteFbb" :href="'https://suporte.fbb.org.br/ocomon/geral/mostra_consulta.php?numero=' + suporte.numero" target="_blank" class="text-bold">
                              {{suporte.numero}}{{index < nota.suporteFbb.length - 1 ? ', ' : ''}}
              </a>
            </p>
            

            <div class="box-header">
              <h3 class="box-title">
                <i class="fa fa-pencil" aria-hidden="true"></i>
                {{projeto.Projeto}}
                <span v-if="usuarioLogado.userType === 'FUNDACAO' && !loading.tela">
                  (<strong>{{projeto.Status_ERP}}</strong>)
                  <router-link :title="'<h5>Ir para a página do Projeto</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'small', arrow : true }" :to="{name: 'projeto', params: { numero: projeto.Numero_projeto }}" target="_blank">&nbsp<i class="fa fa-external-link"></i></router-link></p>
                </span> 
              </h3>
            </div>
            <div class="box-body">

              <div class="form-horizontal">



                <div v-if="(_.filter(restricaoParaConcluir, function(erro) { return (erro.tag).indexOf('valoresTotaisIncorretosProjeto') !== -1 })).length > 0" class="alert alert-danger alert-dismissible">
                  <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
                  <h4><i class="fa fa-warning"></i> Alerta!</h4>
                  <p v-for="restricao in _.filter(restricaoParaConcluir, function(erro) { return (erro.tag).indexOf('valoresTotaisIncorretosProjeto') !== -1 })">{{restricao.mensagem}} <span class="font-italic font-light">({{ (restricao.tag).substr(-7) }})</span></p>
                </div>

                <div v-if="usuarioLogado.userType === 'FUNDACAO' && (_.filter(restricaoParaConcluir, ['tag', 'adiantamentoNaoDisponivelParaPrestarContas'])).length > 0" class="alert alert-danger alert-dismissible">
                  <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
                  <h4><i class="fa fa-warning"></i> Alerta!</h4>
                  <p>Ainda não há título de adiantamento disponível para prestar contas</p>
                </div>

                <div v-if="restricaoParaInicializar.length > 0" class="alert alert-warning alert-dismissible">
                  <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
                  <h4><i class="fa fa-warning"></i> Alerta!</h4>
                  <p v-for="restricao in restricaoParaInicializar">{{restricao}}</p>
                </div>

                <div v-if="_.has(ultimaTarefaFeita, 'observacao') && !_.isNull(ultimaTarefaFeita.observacao)" class="alert alert-info alert-dismissible">
                  <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
                  <h4><i class="fa fa-warning"></i> Atenção!</h4>
                  <p>{{ultimaTarefaFeita.observacao}}</p>
                </div>

                <div v-if="_.includes(['PRESTACAO_DE_CONTAS', 'PAGAMENTO', 'ADIANTAMENTO', 'RESSARCIMENTO', 'CONTRAPARTIDA'], processo) && _.includes(['Solicitação'], etapa) && projetoComAlteracaoEmAndamento"  class="alert alert-danger alert-dismissible">
                  <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
                  <h4><i class="fa fa-warning"></i> Atenção!</h4>
                  <p>Solicitação não disponível. Verificamos que há uma alteração de projetos em andamento.</p>
                </div>

                <div v-if="_.includes(['PRESTACAO_DE_CONTAS'], processo) && ehVoluntariado && etapa === 'Análise'" class="alert alert-warning alert-dismissible">
                  <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
                  <h4><i class="fa fa-warning"></i> Atenção!</h4>
                  <p>Projeto de Voluntariado com processo simplificado - após a conclusão da análise, a tarefa será finalizada.</p>
                </div>
                <div v-if="_.includes(['PRESTACAO_DE_CONTAS'], processo) && ehPrestacaoSimplificada && etapa === 'Análise'" class="alert alert-warning alert-dismissible">
                  <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
                  <h4><i class="fa fa-exclamation"></i> Atenção!</h4>
                  <p>Projeto em processo simplificado.</p>
                </div>

                <div class="form-group">
                  <!-- <div class="col-md-12">
                    <label class="control-label col-md-2">Objetivo Geral:</label>
                    <div class="col-md-8">
                      <p class="form-control-static">{{projeto.Objetivo}}</p>
                    </div> -->
                  <!-- </div> -->

                  <div class="col-md-12">
                    <label class="control-label col-md-2">Período de execução:</label>
                    <div class="col-md-8">
                      <p class="form-control-static">{{ projeto.data_inicial_formatada }} a {{ projeto.data_final_formatada }}</p>
                    </div>
                  </div>
                

                <!--Dados da entidade ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <div v-if="!_.includes(['Solicitação'], etapa)">
                   <!--Razão social da entidade-->
                      <div class="col-md-12">
                      <label class="control-label col-md-2">Nome da entidade</label>
                      <div class="col-md-8">
                        <p class="form-control-static">
                          <router-link :title="'<h5>Ir para o Cadastro dessa Entidade</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }" :to="{name: 'cadastro-entidade-visualiza', params: { id: projeto.fk_entidade }}" target="_blank"> {{razaoSocial}} &nbsp<i class="fa fa-external-link"></i></router-link></p>
                        </div>
                      </div>

                    <!--CNPJ da entidade-->
                    <div class="col-md-12">
                      <label class="control-label col-md-2">CNPJ</label>
                      <div class="col-md-8">
                        <div class="form-control-static">{{entidade.ds_cnpj | cnpj}}</div>
                      </div>
                    </div>

                    <!--Projeto Superior-->
                    <div class="col-md-12">
                      <label class="control-label col-md-2">Projeto Superior:</label>
                      <div class="col-md-8">
                        <div class="form-control-static">{{ projetoSuperior }}</div>
                      </div>
                    </div>

                    <!--Representantes Legais-->
                    <div class="col-md-12">
                      <label class="control-label col-md-2" @click="mostrar_representantes = !mostrar_representantes"><i :class="'fa fa-caret-' + (mostrar_representantes ? 'up' : 'down')" aria-hidden="true"></i> Representantes Legais:</label>

                      <div class="box-body" v-if="mostrar_representantes">                   
                        <div class="col-md-12">
                          <label class="control-label">Representante Legal da Entidade (que assina pela entidade e tem mandato vigente)</label>
                          <div class="table-responsive">
                            <table class="table table-condensed table-bordered table-striped">
                              <thead>
                              <tr>
                                <td class="centralizado borda">Nome</td>
                                <td class="centralizado borda">Cargo</td>
                                <td class="centralizado borda">Final do Mandato</td>
                                </tr>
                                </thead>

                                <tbody>
                                <tr v-for="dirigente in dirigentes" v-if="dirigente.bt_ativo && dirigente.bt_assinatura_entidade">
                                    <td class="celula centralizado borda">{{dirigente.ds_nome}}</td>
                                    <td class="celula centralizado borda">{{cargos[dirigente.fk_cargo_mandato]}}</td>
                                    <td class="celula centralizado borda">{{dirigente.dt_fim_mandato | moment("L")}}</td>
                                </tr>
                                </tbody>

                              </table>
                            </div>

                          </div>
                        </div>

                    <!--Ocorrências-->
                    <div class="col-md-12">
                      <label class="control-label col-md-2" @click="mostrar_ocorrencias = !mostrar_ocorrencias"><i :class="'fa fa-caret-' + (mostrar_ocorrencias ? 'up' : 'down')" aria-hidden="true"></i> Ocorrências:</label>
                    
                      <div v-if="temOcorrencia">
                        <div class="box-body" v-if="mostrar_ocorrencias">
                          <div class="col-md-12">
                            <div class="table-responsive">
                              <table class="table table-condensed table-bordered table-striped">
                                <thead>
                                <tr>
                                  <td class="centralizado borda">Ocorrência</td>
                                  <td class="centralizado borda">Data</td>
                                  <td class="centralizado borda">Observação</td>
                                  <td class="centralizado borda">Situação</td>
                                  </tr>
                                  </thead>

                                  <tbody>
                                  <tr v-for="ocorrencia in ocorrencias">
                                      <td class="celula centralizado borda">{{ocorrencia.codigo}} {{ocorrencia.descricao}}</td>
                                      <td class="celula centralizado borda">{{ ocorrencia.inicio | moment("L")}}</td>
                                      <td class="celula centralizado borda">{{ocorrencia.observacao}}</td>
                                      <td class="celula centralizado borda">{{ocorrencia.etapa}}</td>
                                  </tr>
                                  </tbody>

                                </table>
                              </div>
                            </div>
                            </div>
                        </div>
                        <div v-else>
                          <div class="col-md-8">
                            <div class="form-control-static">Não há ocorrências ativas</div>
                          </div>
                        </div>
                    </div>
                </div>
              </div>
              </div>
              


                <!-- Pergunta se é NF-e ------------------------------------------------------------------------------------------------------------------------->
                <!-- Comentado div de pergunta de NF-e enquanto não fica concluída esta demanda. Quando ficar pronta basta descomentar esta e excluir a div seguinte -->
                <!--<div class="box-body" v-if="restricaoParaInicializar.length === 0" v-show="processo !== 'CONTRAPARTIDA'">-->
                <div class="box-body" v-if="false">
                  <div class="box-header">
                    <h3 class="box-title">Nota Fiscal Eletrônica</h3>
                  </div>

                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group required-field">
                        <label class="control-label col-md-2">É uma NF-e?</label>
                        <div class="col-md-4">
                          <label class="radio-inline new-control new-control-radio">
                            <input type="radio" name="ehNfe" v-model="ehNFe" :value="true" :disabled="!_.includes(['Solicitação', 'Análise'], etapa) || ehVisualizacao"> Sim
                            <div class="new-control-indicator"></div>
                          </label>
                          <label class="radio-inline new-control new-control-radio">
                            <input type="radio" name="ehNfe" v-model="ehNFe" :value="false" :disabled="!_.includes(['Solicitação', 'Análise'], etapa) || ehVisualizacao"> Não
                            <div class="new-control-indicator"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>


                  <!-- Chave de Acesso da NF-e ------------------------------------------------------------------------------------------------------------------------->
                  <div class="row">
                    <div v-if="ehNFe" class="col-md-12">
                      <div class="form-group required-field" :class="{'has-error': errors.first('chave de acesso')}">
                        <label class="control-label col-md-2">Chave de Acesso da NF-e:</label>
                        <div class="col-md-4">
                          <div>
                            <input v-model="nfe.chaveAcesso" @keyup="validarChaveNFe" name="chave de acesso" id="chave de acesso" class="form-control text-right" type="text" maxlength="80" :disabled="loading.tela || _.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa) || ehVisualizacao" v-validate="'required|min:44|max:44'"/>
                          </div>
                          <span v-if="errors.first('chave de acesso')" class="label label-danger"> {{ errors.first('chave de acesso') }}</span>
                        </div>

                        <!-- Retorno da validação da chave de acesso da NF-e -->
                        <div class="col-md-5">
                          <div v-if="_.has(nfe.protocoloValidacao, 'infProt') && !_.isNull(nfe.protocoloValidacao.infProt)" :class="nfe.protocoloValidacao.infProt.cStat === '100' ? 'text-green' : 'text-red'"> Protocolo nº {{nfe.protocoloValidacao.infProt.nProt}}, {{ nfe.protocoloValidacao.infProt.xMotivo }} em {{ nfe.protocoloValidacao.infProt.dhRecbto | moment('DD/MM/YYYY HH:MM') }}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>



                <div v-if="!_.isNull(ehNFe)"> <!-- Mostrar somente após escolhido Sim ou Não para NF-e-->

                  <!-- Dados do Documento ------------------------------------------------------------------------------------------------------------------------->
                  <div class="box-body" v-if="_.includes(['PAGAMENTO', 'PRESTACAO_DE_CONTAS', 'RESSARCIMENTO'], processo) || (processo === 'CONTRAPARTIDA' && ehNFe)">
                    <div class="box-header">
                      <h3 class="box-title">Dados do Documento</h3>
                    </div>

                    <div class="row">

                      <!-- Número do documento -->
                      <div class="col-md-6">
                        <!--<div class="form-group required-field" :class="{ 'has-error' : errors.first('número da nota')}">-->
                        <div class="form-group" :class="(processo !== 'RESSARCIMENTO' ? 'required-field' : '' ) + (errors.first('número da nota') ? ' has-error' : '')">
                          <label class="control-label col-md-4">Número do Documento:
                            <i class="fa fa-question-circle text-gray" aria-hidden="true" v-if="processo === 'RESSARCIMENTO' && _.includes(['Solicitação', 'Revisão', 'Análise'], etapa)"
                               :title="'<h5>Informe o número quando se tratar de documento fiscal ou um RPA com numeração<br/>Se for um documento sem numeração fiscal, como contra-cheque etc, pode deixar em branco</h5>'"
                               v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'top'}"></i>
                          </label>
                          <div class="col-md-8">
                            <div>
                              <the-mask v-model="nota.numeroNota" name="número da nota" class="form-control text-right" type="text" :mask="processo !== 'RESSARCIMENTO' ? '#########' : '##########'"
                                        min="1" max="2147483647" v-validate="processo !== 'RESSARCIMENTO' ? 'required' : ''" :disabled="ehNFe || ehVisualizacao || _.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa)">
                              </the-mask>
                            </div>
                            <span v-if="errors.first('número da nota')" class="label label-danger"> {{ errors.first('número da nota') }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Série -->
                      <div class="col-md-6">
                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('série')}">
                          <label class="control-label col-md-4">Série:</label>
                          <div class="col-md-8">
                            <div>
                              <select v-model="nota.serieNota" class="form-control" name="série" v-validate="'required'" :disabled="ehNFe || ehVisualizacao || _.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa)">
                                <option value="NOTA_FISCAL">1 - Nota fiscal</option>
                                <option value="RECIBO_PAGAMENTO_AUTONOMO">10 - Recibo de pagamento a autônomo</option>
                                <option value="DOCUMENTO_NAO_FISCAL">DNF - Documento não fiscal</option>
                              </select>
                            </div>
                            <span v-if="errors.first('série')" class="label label-danger"> {{ errors.first('série') }}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="row">

                      <!-- Data de emissão -->
                      <div class="col-md-6">
                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('data de emissão')}">
                          <label class="control-label col-md-4">Data de emissão do documento:</label>
                          <div class="col-md-8">
                            <div>
                              <div class="input-group">
                                <datepicker  name="data de emissão" v-model="nota.dataInclusao" input-class="form-control datepicker" :disabled="ehNFe || ehVisualizacao || _.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa)"
                                             :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                             :disabled-dates="{to: new Date(projeto.dateInicioSapiens), from: (new Date() < dataFinalConvenio) ? new Date() : dataFinalConvenio }"

                                             format="dd/MM/yyyy" v-validate="'required'">
                                </datepicker>
                              </div>
                            </div>
                            <span v-if="errors.first('data de emissão')" class="label label-danger"> {{ errors.first('data de emissão') }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Data de validade -->
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="control-label col-md-4">Data de validade do documento: (Somente informe se possuir a data)</label>
                          <div class="col-md-8">
                            <div class="input-group">
                              <datepicker  v-model="nota.dataValidade" input-class="form-control datepicker" :disabled="ehNFe || ehVisualizacao || _.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa)"
                                           :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____" :disabled-dates="desabilitarDatasPassadas"
                                           format="dd/MM/yyyy">
                              </datepicker>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>



                  <!-- Dados do Fornecedor ------------------------------------------------------------------------------------------------------------------->
                  <div class="box-body" v-if="_.includes(['PAGAMENTO', 'PRESTACAO_DE_CONTAS', 'RESSARCIMENTO'], processo) || (processo === 'CONTRAPARTIDA' && ehNFe)">
                    <div class="box-header">
                      <h3 class="box-title">Fornecedor</h3>
                    </div>

                    <div class="row">
                      <div class="col-md-6">
                        <!-- Tipo de pessoa (Jurídica ou Fisica) -->
                        <div class="form-group required-field-field" :class="{'has-error': errors.first('tipo de pessoa')}">
                          <label class="control-label col-md-4">Tipo de pessoa:</label>
                          <div class="col-md-8">
                            <div>
                              <select v-model="nota.tipoFornecedor" name="tipo de pessoa" class="form-control" v-validate="'required'"
                                      @change="bloqueiaCamposFornecedorExistente = false, nota.nomeFornecedor = '', nota.cepFornecedor = '', nota.enderecoFornecedor = '', nota.cnpjFornecedor = '', nota.cpfFornecedor = '', nota.codigoFornecedor = ''"
                                      :disabled="ehNFe || ehVisualizacao || _.includes(['Análise', 'Análise Tributária', 'Autorização', 'Liquidação'], etapa)">
                                <option value="Pessoa Física">Pessoa Física</option>
                                <option value="Pessoa Jurídica">Pessoa Jurídica</option>
                              </select>
                            </div>
                            <span v-if="errors.first('tipo de pessoa')" class="label label-danger"> {{ errors.first('tipo de pessoa') }}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-6">
                        <!-- CNPJ -->
                        <div v-if="nota.tipoFornecedor === 'Pessoa Jurídica'" class="form-group required-field" :class="{'has-error': errors.first('cnpj')}">
                          <label class="control-label col-md-4">CNPJ:</label>
                          <div class="col-md-8">
                            <div>
                              <the-mask v-model="nota.cnpjFornecedor" name="cnpj" class="form-control" :mask="['##.###.###/####-##']"
                                        :disabled="bloqueiaCamposFornecedorExistente || ehNFe || ehVisualizacao || _.includes(['Análise','Análise Tributária', 'Autorização', 'Liquidação'], etapa)"
                                        @blur.native="verificaCpfCnpjSapiens(nota.cnpjFornecedor)" type="text" v-bind:style="usuarioLogado.userType === 'FUNDACAO' ? 'width: 65%; float: left' : ''"
                                        v-validate="">
                              </the-mask>
                              <input type="text" v-if="usuarioLogado.userType === 'FUNDACAO'" class="form-control" disabled="disabled" style="width: 30%; float: left; margin-left: 5%; " :value="nota.codigoFornecedor">
                            </div>
                            <span v-if="errors.first('cnpj')" class="label label-danger"> {{ errors.first('cnpj') }}</span>
                            <span v-if="errors.first('cnpj vinculado a dirigente')" class="label label-danger"> {{ errors.first('cnpj vinculado a dirigente') }}</span>
                          </div>
                        </div>

                        <!-- CPF -->
                        <div v-if="nota.tipoFornecedor === 'Pessoa Física'" class="form-group required-field" :class="{'has-error': errors.first('cpf')}">
                          <label class="control-label col-md-4">CPF:</label>
                          <div class="col-md-8">
                            <div>
                              <the-mask v-model="nota.cpfFornecedor" name="cpf" class="form-control" :mask="['###.###.###-##']"
                                        :disabled="bloqueiaCamposFornecedorExistente || ehNFe || ehVisualizacao || _.includes(['Análise','Análise Tributária', 'Autorização', 'Liquidação'], etapa)"
                                        @blur.native="verificaCpfCnpjSapiens(nota.cpfFornecedor)" type="text" v-bind:style="usuarioLogado.userType === 'FUNDACAO' ? 'width: 65%; float: left' : ''"
                                        v-validate="">
                              </the-mask>
                              <input type="text" v-if="usuarioLogado.userType === 'FUNDACAO'" class="form-control" disabled="disabled" style="width: 30%; float: left; margin-left: 5%; " :value="nota.codigoFornecedor">
                            </div>
                            <span v-if="errors.first('cpf')" class="label label-danger"> {{ errors.first('cpf') }}</span>
                          </div>
                        </div>

                      </div>
                      <div class="col-md-6">
                        <!-- Nome -->
                        <div class="form-group required-field" v-if="_.has(nota, 'tipoFornecedor') && !_.isNull(nota.tipoFornecedor)" :class="{'has-error': errors.first('nome')}">
                          <label class="control-label col-md-4">Nome:</label>
                          <div class="col-md-8">
                            <div>
                              <input v-model="nota.nomeFornecedor" name="nome" class="form-control" type="text"
                                     :disabled="bloqueiaCamposFornecedorExistente || ehNFe || ehVisualizacao || _.includes(['Análise','Análise Tributária', 'Autorização', 'Liquidação'], etapa)"
                                     maxlength="255" v-validate="'required'">
                            </div>
                            <span v-if="errors.first('nome')" class="label label-danger"> {{ errors.first('nome') }}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-6">
                        <!-- Endereço -->
                        <div  class="form-group required-field" v-if="_.has(nota, 'tipoFornecedor') && !_.isNull(nota.tipoFornecedor)" :class="{'has-error': errors.first('endereço')}">
                          <label class="control-label col-md-4">Endereço:</label>
                          <div class="col-md-8">
                            <div>
                              <input v-model="nota.enderecoFornecedor" name="endereço" class="form-control" type="text"
                                     :disabled="bloqueiaCamposFornecedorExistente || ehNFe || ehVisualizacao || _.includes(['Análise','Análise Tributária', 'Autorização', 'Liquidação'], etapa)"
                                     v-validate="'required|max:255'">
                            </div>
                            <span v-if="errors.first('endereço ')" class="label label-danger"> {{ errors.first('endereço') }}</span>
                          </div>
                        </div>
                      </div>

                      <div class="col-md-6">
                        <!-- CEP -->
                        <div class="form-group required-field row" v-if="_.has(nota, 'tipoFornecedor') && !_.isNull(nota.tipoFornecedor)" :class="{'has-error': errors.first('cep')}">
                          <label class="control-label col-md-4">CEP:</label>
                          <div class="col-md-3">
                            <div>
                              <the-mask  v-model="nota.cepFornecedor" name="cep" :mask="['#####-###']" class="form-control"
                                         :disabled="bloqueiaCamposFornecedorExistente || ehNFe || ehVisualizacao || _.includes(['Análise','Análise Tributária', 'Autorização', 'Liquidação'], etapa)"
                                         @blur.native="procurandoCidadeUF" v-validate="'required'">
                              </the-mask>
                            </div>
                            <span v-if="errors.first('cep')" class="label label-danger"> {{ errors.first('cep') }}</span>
                          </div>
                          <div class="col-md-5" style="padding:7px;" v-if="nota.cepFornecedor">
                            {{nota.cidadeFornecedor}} {{(nota.estadoFornecedor) ? ' / ' + nota.estadoFornecedor : ''}}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                  <!--</span>-->



                  <!-- Forma e Prioridade de pagamento e Dados Bancários ----------------------------------------------------------------------------------------->
                  <div class="box-body" v-if="_.includes(['PAGAMENTO', 'PRESTACAO_DE_CONTAS', 'RESSARCIMENTO'], processo)">
                    <div class="box-header">
                      <h3 class="box-title">Dados Bancários {{processo === 'RESSARCIMENTO' ? ' de Beneficiário' : ''}} <span v-if="loading.favorecido" class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando...</span></h3>
                    </div>

                    <div class="row">

                      <div class="col-md-6">
                        <div v-if="processo === 'RESSARCIMENTO' && !loading.favorecido">
                          <!-- CNPJ -->
                          <div class="form-group">
                            <label class="control-label col-md-4">CNPJ:</label>
                            <div class="col-md-8">
                              <the-mask v-model="nota.favorecido.codfav" class="form-control" :mask="['##.###.###/####-##']" :disabled="true" type="text"></the-mask>
                            </div>
                          </div>

                          <!-- Razão social da baneficiária -->
                          <div class="form-group">
                            <label class="control-label col-md-4">Nome:</label>
                            <div class="col-md-8">
                              <input v-model="nota.favorecido.nomfav" class="form-control" type="text" disabled="disabled">
                            </div>
                          </div>
                        </div>


                      <!-- Forma de pagamento -->
                        <div class="form-group required-field" :class="{'has-error': errors.first('forma de pagamento')}" v-if="usuarioLogado.userType === 'FUNDACAO' || (usuarioLogado.userType !== 'FUNDACAO' && processo !== 'RESSARCIMENTO')">
                          <label class="control-label col-md-4">Forma de pagamento:</label>
                          <div class="col-md-8">
                            <div>
                              <select v-model="nota.forma_pagamento" name="forma de pagamento" class="form-control" v-validate="'required'"
                                      :disabled="_.includes(['PRESTACAO_DE_CONTAS', 'RESSARCIMENTO'], processo) || ehVisualizacao || _.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa)">
                                <option v-for="fp in listaFormasPagamento" :value="fp.CodFpg">{{fp.DesFpg}}</option>
                              </select>
                            </div>
                            <span v-if="errors.first('forma de pagamento')" class="label label-danger"> {{ errors.first('forma de pagamento') }}</span>
                          </div>
                        </div>


                        <!--Prioridade do Pagamento -->
                        <div class="" v-if="usuarioLogado.userType === 'FUNDACAO'">
                          <div class="form-group required-field" :class="{'has-error': errors.first('pagamento prioritário')}">
                            <label class="control-label col-md-4">Pagamento Prioritário:</label>
                            <div class="col-md-8">
                              <div>
                                <select v-model="nota.pagamentoPrioritario" class="form-control" name="pagamento prioritário" v-validate="'required'"
                                        :disabled="ehVisualizacao || _.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa)">
                                  <option value="0">Não</option>
                                  <option value="1">Sim</option>
                                </select>
                              </div>
                              <span v-if="errors.first('pagamento prioritário')" class="label label-danger"> {{ errors.first('pagamento prioritário') }}</span>
                            </div>
                          </div>
                        </div>

                        <!-- 61191 - Verificar as contas do fornecedor informado na solicitação -->
                        <div class="form-group" v-if="processo === 'PAGAMENTO' && _.includes(['Solicitação', 'Revisão', 'Análise'], etapa) && !mostrarIncluindoConta && !ehVisualizacao && (nota.forma_pagamento === 3 || nota.forma_pagamento === '3')">
                          <label class="control-label col-md-4">Contas Cadastradas Fornecedor:</label>
                          <div class="col-md-8">
                              <!-- Tabela de contas de fornecedores -->
                              <div>
                                  <multiselect v-model="nota.favorecido.dadosBancariosSelecionados"
                                                :options="dadosBancariosFornecedores"
                                                :searchable="false"
                                                :close-on-select="true"
                                                :show-labels="false"
                                                :allow-empty="false"
                                                @select="selecionaDadosBancariosFornecedor"
                                                placeholder="Selecione um dado bancário da lista ou inclua um novo"
                                                name="contas já cadastradas"
                                                :key="dadosBancariosFornecedores.length"
                                                :disabled="ehVisualizacao">

                                    <template slot="singleLabel" slot-scope="props">
                                      <span class="text-blue">Banco: {{ props.option.banco }}</span> | <span class="text-blue">Agência: {{ props.option.agencia }}</span> | <span class="text-blue">Conta: {{ props.option.conta }}</span> | <span class="text-blue">{{ props.option.ccbfav }}</span> <span class="text-blue">{{('' + props.option.tipo) === '1' ? 'Conta Corrente' : ('' + props.option.tipo) === '2' ? 'Conta Poupança' : 'Tipo de conta não definido'}}</span>
                                    </template>

                                    <template slot="noOptions" slot-scope="props">
                                      <span class="text-red">Nenhum dado bancário encontrado.</span>
                                    </template>

                                    <template slot="option" slot-scope="props">
                                      Banco: <span class="text-blue">{{ props.option.banco }}  </span>
                                      Agência: <span class="text-blue">{{ props.option.agencia }}  </span>
                                      Conta: <span class="text-blue">{{ props.option.conta }}</span>
                                      Tipo: <span class="text-blue">{{('' + props.option.tipo) === '1' ? 'Conta Corrente' : ('' + props.option.tipo) === '2' ? 'Conta Poupança' : 'Tipo de conta não definido'}}</span>
                                    </template>
                                  </multiselect>
                                </div>
                                <span v-if="errors.first('contas já cadastradas')" class="label label-danger">{{ errors.first('contas já cadastradas') }}</span>
                            </div>
                        </div>
                            <div class="form-group" v-if="processo === 'PAGAMENTO' && _.includes(['Solicitação', 'Revisão', 'Análise'], etapa) && !mostrarIncluindoConta && !ehVisualizacao && (nota.forma_pagamento === 3 || nota.forma_pagamento === '3')">
                              <label class="control-label col-md-4" style="color: #FF9900"> <strong>*</strong></label>
                              <div class="col-md-8">
                                  <span style="color: #FF9900">Caso as informações bancárias do fornecedor <strong>não sejam encontradas </strong> no menu acima, preencha os dados ao lado para cadastrar uma nova conta. Se houver agências/contas iguais com <strong>digitos diferentes</strong>, favor atentar ao escolher a opção correta. </span>
                              </div>
                          </div>
                      </div>
                        <!-- 70525 - Verificacao de preenchimento de código do boleto -->
                      <div class="col-md-6" v-if="('' + nota.forma_pagamento) === '4' && _.includes(['PAGAMENTO', 'RESSARCIMENTO'], processo)">
                        <!--<div class="form-group required-field" :class="{'has-error': errors.first('código de barras')}">-->
                        <div class="form-group">
                          <label class="required control-label col-md-4">Tipo Documento:</label>
                          <div class="col-md-6 form-group required-field" v-if="('' + nota.forma_pagamento) === '4' && _.includes(['PAGAMENTO', 'RESSARCIMENTO'], processo)">
                                <label class="radio-inline new-control new-control-radio">
                                  <input type="radio" name="status" id="status" @click="mudarTipoDocumento('boleto')" class="" checked="true"> Boleto
                                  <div class="new-control-indicator"></div>
                                </label>
                                <label class="radio-inline new-control new-control-radio">
                                  <input type="radio" name="status" id="status" @click="mudarTipoDocumento('imposto')" class="" > Imposto
                                  <div class="new-control-indicator"></div>
                                </label>
                              </div>
                        </div>
                      </div>

                      <!-- Código de Barras ------------------------------------------------------------------------->
                      <div class="col-md-6" v-if="('' + nota.forma_pagamento) === '4' && _.includes(['PAGAMENTO', 'RESSARCIMENTO'], processo)">
                        <!--<div class="form-group required-field" :class="{'has-error': errors.first('código de barras')}">-->
                        <div class="form-group">
                          <label class="control-label col-md-4"><span v-if="this.tipoDocumento === 'boleto'" style="color: red; margin-right: 2px">*</span>Código de Barras:</label>
                          <div class="col-md-8">
                            <!--:disabled="ehVisualizacao || _.includes(['Análise', 'Análise Tributária', 'Autorização', 'Liquidação'], etapa)" @keyup="validaAjustaCodigoBarras" v-validate="'required'">-->
                            <input type="text" v-model="nota.boleto.numeroInformadoTela" class="form-control" name="código de barras"
                                   :disabled="ehVisualizacao || _.includes(['Análise', 'Análise Tributária', 'Autorização'], etapa)" @keyup="validaAjustaCodigoBarras">
                                   <!--:disabled="ehVisualizacao || _.includes(['Análise', 'Análise Tributária', 'Autorização'], etapa)" @keyup="validaAjustaCodigoBarras" v-validate="'required'">-->
                            <span v-if="errors.first('código de barras')" class="label label-danger">{{ errors.first('código de barras') }}</span>
                            <span v-else-if="nota.boleto.sucesso" class="label label-success">
                              {{_.capitalize((nota.boleto.tipoCodigoInput + ' de ' + nota.boleto.tipoBoleto).replaceAll('_', ' ')) + ' correto!'}}
                            </span>
                          </div>
                        </div>
                      </div>


                      <!-- Dados Bancários ------------------------------------------------------------------------->
                      <div class="col-md-6" v-if="nota.forma_pagamento === 3 || nota.forma_pagamento === '3' || _.includes(['RESSARCIMENTO'], processo)">

                        <div v-if="!loading.favorecido && !loading.tela">
                          <!-- Contas Favorecidos já cadastradas -->
                          <div class="form-group required-field" :class="{'has-error': errors.first('contas já cadastradas')}"
                               v-if="_.includes(['RESSARCIMENTO'], processo) && _.includes(['Solicitação', 'Revisão', 'Análise'], etapa)"
                               v-show="!mostrarIncluindoConta && !ehVisualizacao"
                               :disabled="nota.favorecido.dadosBancariosSelecionados">
                            <label class="control-label col-md-4">Contas já cadastradas:</label>
                            <div class="col-md-8">
                              <div>
                                <multiselect v-model="nota.favorecido.dadosBancariosSelecionados"
                                             :options="opcoesContasExistentesFavorecido"
                                             :searchable="false"
                                             :close-on-select="true"
                                             :show-labels="false"
                                             :allow-empty="false"
                                             @select="selecionaDadosBancariosFavorecido"
                                             placeholder="Selecione um dado bancário da lista ou inclua um novo"
                                             name="contas já cadastradas"
                                             :key="opcoesContasExistentesFavorecido.length"
                                             :disabled="ehVisualizacao"
                                             v-validate="{required: nota.formaPagamento !== 4}">

                                  <template slot="singleLabel" slot-scope="props">
                                    <span class="text-blue">{{ props.option.codban }}</span> | <span class="text-blue">{{ props.option.codage }}</span> | <span class="text-blue">{{ props.option.ccbfav }}</span> | <span class="text-blue">{{('' + props.option.tiptcc) === '1' ? 'Conta Corrente' : ('' + props.option.tiptcc) === '2' ? 'Conta Poupança' : 'Tipo de conta não definido'}}</span>
                                  </template>

                                  <template slot="noOptions" slot-scope="props">
                                    <span class="text-red">Nenhum dado bancário cadastrado. Favor Incluir banco, agência e conta</span>
                                  </template>

                                  <template slot="option" slot-scope="props">
                                    Banco: <span class="text-blue">{{ props.option.codban }}  </span>
                                    Agência: <span class="text-blue">{{ props.option.codage }}  </span>
                                    Conta {{('' + props.option.tiptcc) === '1' ? 'Corrente' : ('' + props.option.tiptcc) === '2' ? 'Poupança' : 'não definida'}}: <span class="text-blue">{{ props.option.ccbfav }}</span>
                                  </template>

                                </multiselect>
                              </div>
                              <span v-if="errors.first('contas já cadastradas')" class="label label-danger">{{ errors.first('contas já cadastradas') }}</span>
                            </div>
                          </div>

                          <!-- Botões para Incluir ou Excluir Dados Bancários -->
                          <div class="form-group" v-if="processo === 'RESSARCIMENTO' && _.includes(['Solicitação', 'Revisão', 'Análise'], etapa) && !mostrarIncluindoConta && !ehVisualizacao">
                            <div class="col-md-8 col-md-offset-4">
                              <span v-if="!loading.tela || ehVisualizacao" :title="'<h5>Permite incluir na lista novo conjunto de dados bancários</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
                                <g-button-moema color="primary" @click.native="favorecidoDadosBancariosIncluir" type="button"><i class="fa fa-plus" aria-hidden="true"></i> Incluir</g-button-moema>
                              </span>

                              <span v-if="opcoesContasExistentesFavorecido.length > 0 && !_.isNull(nota.favorecido.dadosBancariosSelecionados)" :title="'<h5>Exclui da lista os dados bancário selecionados</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
                                <g-button-moema color="error" @click.native="favorecidoDadosBancariosExcluir" type="button"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</g-button-moema>
                              </span>
                            </div>
                          </div>

                          <div v-show="_.includes(['PAGAMENTO', 'PRESTACAO_DE_CONTAS'], processo) || (processo === 'RESSARCIMENTO' && (!_.isEmpty(nota.favorecido.dadosBancariosSelecionados) || mostrarIncluindoConta))">
                            <!-- Banco -->
                            <div class="form-group required-field" :class="{'has-error': errors.first('banco')}">
                              <label class="control-label col-md-4">Banco:</label>
                              <div class="col-md-8">
                                <div>
                                  <multiselect v-model="bancoSelecionado"
                                               :options="listaBancos"
                                               :multiple="false"
                                               :close-on-select="true"
                                               placeholder="Selecione um banco"
                                               :custom-label="bancoNome"
                                               @select="selecionaBanco"
                                               track-by="codigo"
                                               selectedLabel="Selecionado"
                                               selectLabel="Aperte ENTER para selecionar"
                                               deselectLabel="Aperte ENTER para remover"
                                               name="banco"
                                               data-vv-as="banco"
                                               :disabled="ehVisualizacao || _.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa) || (processo === 'RESSARCIMENTO' && !mostrarIncluindoConta)"
                                               v-validate="{required: nota.formaPagamento !== 4}">
                                  </multiselect>
                                </div>
                                <span v-if="errors.first('banco')" class="label label-danger">{{ errors.first('banco') }}</span>
                              </div>
                            </div>

                            <!-- Agência -->
                            <div class="form-group required-field" :class="{'has-error': errors.first('agência')}">
                              <label class="control-label col-md-4">Agência:</label>
                              <div class="col-md-8">
                                <div :title="'<h5> ' + (_.has(bancoSelecionado, 'digitoAgencia') && !bancoSelecionado.digitoAgencia ? 'Informe a agência com 4 número sem dígito verificador. Exemplo: <span class=\'realce\'>1234</span>' : 'Informe a agência com 4 número e o dígito verificador. Exemplo: <span class=\'realce\'>1234-5</span>') + ' </h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
                                  <the-mask v-model="nota.dados_bancarios.agencia" name="agência" class="form-control text-right" :disabled="ehVisualizacao || _.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa) || (processo === 'RESSARCIMENTO' && !mostrarIncluindoConta)"
                                            type="text" :mask="_.has(bancoSelecionado, 'digitoAgencia') && !bancoSelecionado.digitoAgencia ? '####' : '####-X'" :tokens="agenciaTokens" v-validate="'required'" masked></the-mask>
                                </div>
                                <span v-if="errors.first('agência')" class="label label-danger">{{ errors.first('agência') }}</span>
                              </div>
                            </div>

                            <!-- Conta Corrente -->
                            <div class="form-group required-field" :class="{'has-error': errors.first('conta corrente')}">
                              <label class="control-label col-md-4">Conta:</label>
                              <div class="col-md-8">
                                <div>
                                  <the-mask v-model="nota.dados_bancarios.conta" name="conta corrente" class="form-control text-right" :disabled="ehVisualizacao || _.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa) || (processo === 'RESSARCIMENTO' && !mostrarIncluindoConta)"
                                            type="text" v-validate="'required|min:3'" :mask="['#-X', '##-X', '###-X', '####-X', '#####-X', '######-X', '#######-X', '########-X', '#########-X', '##########-X', '###########-X']"
                                            :tokens="customTokens" masked></the-mask>
                                </div>
                                <span v-if="errors.first('conta corrente')" class="label label-danger">{{ errors.first('conta corrente') }}</span>
                              </div>
                            </div>

                            <!-- Tipo da Conta -->
                            <div class="form-group required-field" :class="{'has-error': errors.first('tipo da conta')}">
                              <label class="control-label col-md-4">Tipo da Conta:</label>
                              <div class="col-md-8">
                                <div>
                                  <multiselect v-model="tipoContaSelecionado"
                                               :options="tiposConta"
                                               :multiple="false"
                                               :close-on-select="true"
                                               :preselect-first="true"
                                               :allow-empty="false"
                                               :custom-label="tipoContaNome"
                                               @select="selecionaTipoConta"
                                               placeholder="Selecione um tipo de conta"
                                               track-by="codigo"
                                               selectedLabel="Selecionado"
                                               selectLabel=""
                                               deselectLabel=""
                                               name="tipo da conta"
                                               data-vv-as="tipo da conta"
                                               :disabled="ehVisualizacao || _.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa) || processo === 'PRESTACAO_DE_CONTAS' || (processo === 'RESSARCIMENTO' && !mostrarIncluindoConta)"
                                               v-validate="{required: nota.formaPagamento !== 4}">
                                  </multiselect>
                                </div>
                                <span v-if="errors.first('tipo da conta')" class="label label-danger">{{ errors.first('tipo da conta') }}</span>
                              </div>
                            </div>
                          </div>

                            <div>
                              <label class="control-label col-md-4">OBS:</label>
                              <div class="col-md-8">
                                <span style="color: #1565C0; font-weight: bold">Favor atentar para que os dados bancários sejam da mesma titularidade do CPF/CNPJ informado no quadro anterior (Fornecedor), caso contrário o pagamento será devolvido.</span>
                              </div>
                            </div>

                          <!-- Botões para Ok (incluir na lista) ou Cancelar dados bancários -->
                          <div class="form-group" v-if="mostrarIncluindoConta">
                            <div class="col-md-8 col-md-offset-4">
                              <g-button-moema color="success" @click.native="favorecidoDadosBancariosOk" type="button"><i class="fa fa-check" aria-hidden="true"></i> Ok</g-button-moema>
                              <g-button-moema color="warning" @click.native="favorecidoDadosBancariosCancelar" type="button"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</g-button-moema>
                            </div>
                          </div>

                        </div>

                      </div>

                    </div>

                  </div>


                  <!-- Adiantamentos Concedidos ----------------------------------------------------------------------------------------------------------------->
                  <div v-show="true" class="box-body" id="adiantamentosConcedidos" v-if="processo === 'PRESTACAO_DE_CONTAS'">
                    <div class="box-header">
                      <h3 class="box-title">Adiantamentos Concedidos <span v-if="loading.adiantamentos" class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando...</span></h3>
                    </div>

                    <div v-if="!loading.adiantamentos">
                      <div class="row">
                        <div class="col-md-6">

                          <div class="form-group">
                            <label class="control-label col-md-4" :title="'<h5>Filtros não alteram o total</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Mostrar adiantamentos: </label>
                            <div class="col-md-8">
                              <div class="checkbox-inline" :title="'<h5>Mostrar o(s) adiantmentos com prestações pendentes</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                                <label class="checkbox-inline new-control new-control-checkbox">
                                  <input type="checkbox" v-model="adiantamentosFiltrosSelecionados" value="adiantamento_pendente"/> Pendente de prestação de contas <div class="new-control-indicator"></div>
                                </label>
                              </div>
                            </div>
                          </div>

                        </div>

                      </div>

                      <div class="col-md-12">
                        <div class="table-responsive parcelasAdiantamento">
                          <table class="table table-condensed table-bordered table-striped">
                            <thead>
                            <tr>
                              <td class="centralizado borda" :title="'<h5>Número da parcela (ordem) do adiantamento</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Parcela</td>
                              <td class="centralizado borda" :title="'<h5>Valor da parcela no instrumento legal</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Valor previsto</td>
                              <td class="centralizado borda" :title="'<h5>Valor solicitado dentro do limite total da parcela</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Valor adiantado</td>
                              <td class="centralizado borda" :title="'<h5>Total das prestações de contas realizadas para o valor adiantado</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Valor Pendente</td>
                              <td class="centralizado borda" :title="'<h5>Percentual das prestações de contas realizadas para o valor adiantado</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">% Comprov.</td>
                            </tr>
                            </thead>

                            <tbody>

                            <!-- Tabela -->
                            <template v-for="adiantamento in adiantamentosConcecidos">
                              <template v-if="!_.has(adiantamento, 'mostrar') || adiantamento.mostrar">
                                <tr>
                                  <td class="celula centralizado borda">{{adiantamento.parcela}}</td>
                                  <td class="celula centralizado borda">{{adiantamento.contratado | real}}</td>
                                  <td class="celula centralizado borda">{{adiantamento.requisitado | real}}</td>
                                  <td class="celula centralizado borda">{{adiantamento.pendente_comprovacao | real}}</td>
                                  <td :class="'celula centralizado borda ' + (adiantamento.percentual_comprovado >= 1 ? 'atingido100' : (adiantamento.percentual_comprovado >= 0.8 ? 'atingido80' : 'nao_atingido'))">{{adiantamento.percentual_comprovado | percentage}}</td>
                                </tr>
                              </template>
                            </template>

                            </tbody>
                          </table>
                        </div>

                      </div>

                      <!-- Totais -->
                      <div class="col-md-12">
                        <table class="totais" v-if="_.keys(_.groupBy(adiantamentosConcecidos, 'recurso')).length === 2">
                          <tr>
                            <td class="centralizado"><span>Total Solicitado Fundação BB</span></td>
                            <td class="centralizado"><span>Total Pendente Fundação BB</span></td>
                            <td class="centralizado"><span>Total Solicitado Parceiros Estratégicos</span></td>
                            <td class="centralizado"><span>Total Pendente Parceiros Estratégicos</span></td>
                          </tr>
                          <tr>
                            <td class="centralizado valor">
                              <span :title="'<h5>Valor total já solicitado de adiantamento para esta projeto em parcela(s) com recursos da Fundação BB</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large' }">
                                {{totais.adiantamento.fbb.solicitado | real}}
                              </span>
                            </td>
                            <td class="centralizado valor">
                              <span :title="'<h5>Valor total pendente de prestação de contas de acordo com total de adiantamento solicitado com recursos da Fundação BB</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large' }">
                                {{totais.adiantamento.fbb.saldo | real}}
                              </span>
                            </td>

                            <td class="centralizado valor">
                              <span :title="'<h5>Valor total já solicitado de adiantamento para esta projeto em parcela(s) com recursos de Parceiros Estratégicos</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large' }">
                                {{totais.adiantamento.parceiros.solicitado | real}}
                              </span>
                            </td>
                            <td class="centralizado valor">
                              <span :title="'<h5>Valor total pendente de prestação de contas de acordo com total de adiantamento solicitado com recursos de Parceiros Estratégicos</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large' }">
                                {{totais.adiantamento.parceiros.saldo | real}}
                              </span>
                            </td>
                          </tr>
                        </table>
                        <table class="totais" v-else>
                          <tr>
                            <td class="centralizado"><span>Total de adiantamento solicitado</span></td>
                            <td class="centralizado"><span>Total Pendente de Prestação de contas</span></td>
                          </tr>
                          <tr>
                            <td class="centralizado valor">
                              <span :title="'<h5>Valor total já solicitado de adiantamento para esta projeto</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large' }">
                                {{totais.adiantamento.total.solicitado | real}}
                              </span>
                            </td>
                            <td class="centralizado valor">
                              <span :title="'<h5>Valor total pendente de prestação de contas de acordo com total de adiantamento solicitado</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large' }">
                                {{totais.adiantamento.total.saldo | real}}
                              </span>
                            </td>
                          </tr>
                        </table>
                      </div>

                    </div>

                  </div>


                  <!-- Calculo de Impostos ----------------------------------------------------------------------------------------------------------------->
                  <div class="box-body" id="calculoImposto" v-if="processo !== 'CONTRAPARTIDA' && _.includes(['Análise', 'Análise Tributária', 'Autorização', 'Liquidação'], etapa) && usuarioLogado.userType === 'FUNDACAO'">
                    <div class="box-header">
                      <h3 class="box-title">Cálculo de Impostos <span v-if="loading.analise_tributaria" class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando...</span></h3>
                    </div>

                    <div class="col-md-12">
                      <div class="col-md-12 form-group required-field">
                        <label class="control-label">Tributado?</label>
                        <span>
                          <label class="radio-inline new-control new-control-radio">
                            <input type="radio" name="tributacao" v-model="nota.tributacao" :value="'TRIBUTADO'" :disabled="ehVisualizacao || (_.includes(['TRIBUTADO', 'NAO_TRIBUTADO'], nota.tributacao) && !_.includes(['Análise', 'Análise Tributária'], etapa)) || processo === 'RESSARCIMENTO'" v-validate="'required'"> Sim
                            <div class="new-control-indicator"></div>
                          </label>
                          <label class="radio-inline new-control new-control-radio">
                            <input type="radio" name="tributacao" v-model="nota.tributacao" :value="'NAO_TRIBUTADO'" :disabled="ehVisualizacao || (_.includes(['TRIBUTADO', 'NAO_TRIBUTADO'], nota.tributacao) && !_.includes(['Análise', 'Análise Tributária'], etapa)) || processo === 'RESSARCIMENTO'" v-validate="'required'"> Não
                            <div class="new-control-indicator"></div>
                          </label>
                        </span>
                        <span v-if="errors.first('tributacao')" class="label label-danger"> {{ errors.first('tributacao') }}</span>
                      </div>
                    </div>

                    <div v-if="!loading.analise_tributaria && !_.isEmpty(analiseTributaria) && _.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa)">
                      <div class="col-md-12">
                        <div class="table-responsive">
                          <table class="table table-condensed table-bordered table-striped">
                            <thead>
                            <tr>
                              <td class="centralizado borda">Item</td>
                              <td class="centralizado borda">Transação</td>
                              <td class="centralizado borda">ISS</td>
                              <td class="centralizado borda">COFINS</td>
                              <td class="centralizado borda">PIS</td>
                              <td class="centralizado borda">CSLL</td>
                              <td class="centralizado borda">IRRF</td>
                              <td class="centralizado borda">INSS</td>
                              <td class="centralizado borda">Outros</td>
                              <!--<td class="centralizado borda">Tributação</td>-->
                              <!--<td class="centralizado borda">Líquido</td>-->
                            </tr>
                            </thead>

                            <tbody>
                            <!-- Produtos -->
                            <tr v-for="produto in analiseTributaria.produtos">
                              <td class="celula centralizado borda" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"
                                  :title="'<h5>' + produto.CplPro + '</h5>'">{{produto.CodPro}} / {{produto.DesPro}}</td>
                              <!--<td class="celula centralizado borda">{{produto.TnsPro}} {{buscaTransacaoProdutos(produto.TnsPro)}}</td>-->
                              <td class="celula centralizado borda">{{0 | real}}<br/>{{0 / 100 | percentage}}</td>
                              <td class="celula centralizado borda">{{produto.VlrCrt | real}}<br/>{{produto.PerCof / 100 | percentage}}</td>
                              <td class="celula centralizado borda">{{produto.VlrPit | real}}<br/>{{produto.PerPit / 100 | percentage}}</td>
                              <td class="celula centralizado borda">{{produto.VlrCsl | real}}<br/>{{produto.PerCsl / 100 | percentage}}</td>
                              <td class="celula centralizado borda">{{produto.VlrIrf | real}}<br/>{{produto.PerIrf / 100 | percentage}}</td>
                              <td class="celula centralizado borda">{{0 | real}}<br/>{{0 / 100 | percentage}}</td>
                              <td class="celula centralizado borda">{{produto.VlrOur | real}}<br/>{{produto.PerOur / 100 | percentage}}</td>
                              <!--<td class="celula centralizado borda">{{produto.VlrBru - produto.VlrLiq | real}}</td>-->
                              <!--<td class="celula centralizado borda">{{produto.vlrliq | real}}</td>-->
                            </tr>
                            <!-- Serviços -->
                            <tr v-for="servico in analiseTributaria.servicos">
                              <td class="celula centralizado borda" style="width: 25%; font-weight: bold" :title="'<h5>' + servico.CplSer + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', placement:'top', distance:'1', size:'large', arrow:true}">
                                {{servico.CodSer}} / {{servico.DesSer}}
                              </td>
                              <!--<td class="celula centralizado borda">{{servico.TnsSer}} {{buscaTransacaoServicos(servico.TnsSer)}}</td>-->
                              <td class="celula centralizado borda">{{servico.VlrIss | real}}<br/>{{servico.PerIss / 100 | percentage}}</td>
                              <td class="celula centralizado borda">{{servico.VlrCrt | real}}<br/>{{servico.PerCof / 100 | percentage}}</td>
                              <td class="celula centralizado borda">{{servico.VlrPit | real}}<br/>{{servico.PerPit / 100 | percentage}}</td>
                              <td class="celula centralizado borda">{{servico.VlrCsl | real}}<br/>{{servico.PerCsl / 100 | percentage}}</td>
                              <td class="celula centralizado borda">{{servico.VlrIrf | real}}<br/>{{servico.PerIrf / 100 | percentage}}</td>
                              <td class="celula centralizado borda">{{servico.VlrIns | real}}<br/>{{servico.PerIns / 100 | percentage}}</td>
                              <td class="celula centralizado borda">{{servico.VlrOur | real}}<br/>{{servico.PerOur / 100 | percentage}}</td>
                              <!--<td class="celula centralizado borda">{{servico.VlrBru - servico.VlrLiq | real}}</td>-->
                              <!--<td class="celula centralizado borda">{{servico.VlrLiq | real}}</td>-->
                            </tr>
                            </tbody>

                          </table>
                        </div>

                      </div>

                      <!-- Totais -->
                      <div class="col-md-12">
                        <table class="totais">
                          <tr>
                            <td class="centralizado">Total desta Solicitação</td>
                            <td class="centralizado" v-if="nota.tributacao === 'TRIBUTADO'">Total de Tributação</td>
                            <td class="centralizado" v-if="nota.tributacao === 'TRIBUTADO'">Total Líquido</td>
                          </tr>
                          <tr>
                            <td class="centralizado valor">{{analiseTributaria.nf.VlrInf | real}}</td>
                            <td class="centralizado valor" v-if="nota.tributacao === 'TRIBUTADO'">
                              <money v-model="nota.valorTributado" name="Total valorTributado" class="form-control text-center" type="text" style="width: 60%; margin-left: 20%"
                                     @keyup.native="nota.valorTributado = limitaFaixaEntrada('decimal', nota.valorTributado, 0, analiseTributaria.nf.VlrInf)" :disabled="!_.includes(['Análise Tributária'], etapa)">
                              </money>
                            </td>
                            <td class="centralizado valor" v-if="nota.tributacao === 'TRIBUTADO'">{{(parseFloat(analiseTributaria.nf.VlrInf) - nota.valorTributado) | real}}</td>
                          </tr>
                        </table>
                      </div>

                    </div>

                  </div>



                  <!-- Cronograma ------------------------------------------------------------------------------------------------------------------------------>
                  <div class="box-body" id="cronogramaPagamento">
                    <div class="box-header">
                      <h3 class="box-title">Cronograma <span v-if="loading.cronograma" class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando...</span></h3>
                    </div>


                    <div v-if="!loading.cronograma">
                      <div class="row">
                        <div class="col-md-12">

                          <div class="form-group">
                            <!-- Demanda 64547: Adição de filtro por Fundação e P. Estratégico  -->
                            <label class="control-label col-md-2" :title="'<h5>Filtros não alteram o total</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Mostrar item: </label>
                            <div class="col-md-10">
                              <div class="checkbox-inline" :title="'<h5>Mostrar o(s) item(ns) que ainda contém saldo</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                                <label class="checkbox-inline new-control new-control-checkbox">
                                  <input type="checkbox" v-model="extratoFiltrosSelecionados" value="saldos" disabled/> Com saldo <div class="new-control-indicator"></div>
                                </label>
                              </div>

                              <div class="checkbox-inline" v-if="_.has(validacao, 'itens_liberados')" :title="'<h5>Mostrar somente o(s) item(ns) que foram solicitados</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                                <label class="checkbox-inline new-control new-control-checkbox">
                                  <input type="checkbox" v-model=extratoFiltrosSelecionados value="solicitados" @change="filtrarExtrato(); calcularTotaisExtato()" :disabled="ehVisualizacao || !_.includes(['Solicitação', 'Revisão', 'Análise'], etapa)" /> Somente solicitado <div class="new-control-indicator"></div>
                                </label>
                              </div>

                              <div class="espacamento_botoes"></div>

                              <span v-if="totais.projeto.fbb.orcado > 0 && totais.projeto.parceiros.orcado > 0">
                                <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;" :title="'<h5>' + (processo === 'PRESTACAO_DE_CONTAS' && totais.adiantamento.fbb.saldo <= 0 ? 'Não há pendência de prestação de contas com recursos da Fundação BB' : 'Mostrar o(s) item(ns) relacionados a Fundação BB') + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                                  <input type="radio" name="filtro_origem_recurso"  @click="filtrarPorOrigemRecurso('fundacao')" :checked="_.includes(extratoFiltrosSelecionados, 'fundacao')" :disabled="ehVisualizacao || (processo === 'PRESTACAO_DE_CONTAS' && totais.adiantamento.fbb.saldo <= 0) || !_.includes(['Solicitação', 'Revisão', 'Análise'], etapa)"> Fundação <div class="new-control-indicator"></div>
                                </label>
                                <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;" :title="'<h5>' + (processo === 'PRESTACAO_DE_CONTAS' && totais.adiantamento.parceiros.saldo <= 0 ? 'Não há pendência de prestação de contas com recursos de Parceiro Estratégico' : 'Mostrar o(s) item(ns) relacionados ao Parceiro Estratégico') + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                                  <input type="radio" name="filtro_origem_recurso" @click="filtrarPorOrigemRecurso('parceiro')" :checked="_.includes(extratoFiltrosSelecionados, 'parceiro')" :disabled="ehVisualizacao || (processo === 'PRESTACAO_DE_CONTAS' && totais.adiantamento.parceiros.saldo <= 0) || !_.includes(['Solicitação', 'Revisão', 'Análise'], etapa)"> Parceiro Estratégico <div class="new-control-indicator"></div>
                                </label>
                              </span>
                            </div>
                            </div>
                        </div>
                        <div class="col-md-offset-2 col-md-10" style="color: var(--cor-destaque); margin-top: -10px" v-if="totais.projeto.fbb.orcado > 0 && totais.projeto.parceiros.orcado > 0">
                          Atenção: Selecione os itens relacionados a Fundação <strong>OU</strong> ao Parceiro Estratégico
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-12">
                          <table class="table table-condensed">
                            <thead>
                            <tr class="cabecalho">
                              <th>&nbsp;</th>
                              <th colspan="2" class="centralizado" :title="'<h5>Valor total contratado no projeto por Atividade e Item</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Orçado</th>
                              <th colspan="2" class="centralizado" :title="'<h5>Informe o que consta no documento (quantidade e valor)</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">{{processo === 'CONTRAPARTIDA' ? 'Comprovação' : 'Solicitação'}}</th>
                              <th colspan="2" class="centralizado" :title="'<h5>Saldo restante de cada Atividade e Item</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Saldo</th>
                              <th v-if="processo === 'CONTRAPARTIDA' && _.includes(['Análise'], etapa)"></th>
                            </tr>
                            <tr class="cabecalho">
                              <th>{{(layoutExtrato === 'porOrigem' ? 'Origem do Recurso' : 'Atividade')}} / Recursos (itens do cronograma)</th>
                              <th class="centralizado">Qtde</th>
                              <th class="centralizado">Valor</th>
                              <th class="centralizado">Qtde</th>
                              <th class="centralizado">Valor</th>
                              <th class="centralizado">Qtde</th>
                              <th class="centralizado">Valor</th>
                              <th class="centralizado" v-if="processo === 'CONTRAPARTIDA' && _.includes(['Análise'], etapa)">Economicidade</th>
                            </tr>
                            </thead>

                            <tbody>

                            <!-- Tabela -->
                            <template v-for="origem in (layoutExtrato === 'classico' ? [['1', '5', '2']] : (layoutExtrato === 'porOrigem') ? [['1', '5']] : [['2']])">

                              <tr v-if="layoutExtrato === 'porOrigem'">
                                <td colspan="8" class="atividade">{{(_.includes(origem, '2')) ? 'Recursos de Contrapartida' : 'Recursos da Fundação BB'}}</td>
                                <!-- <td colspan="8" class="atividade">{{(_.includes(origem, '2')) ? 'Recursos de Contrapartida' : (_.includes(origem, '1')) ? 'Recursos da Fundação BB' : 'Recusros de Parceiro Estratégico'}}</td> -->
                              </tr>

                              <template v-for="(atividade) in cronograma.atividades" v-if="(_.filter(cronograma.itens, function (i) { return i.Atividade_nome === atividade.Nome && _.includes((processo === 'CONTRAPARTIDA' ? ['2'] : ['1', '5']), ('' + i.Item_Origem).substring(0, 1)) && (!_.has(i, 'mostrar') || i.mostrar)})).length > 0">
                                <tr class="atividade" v-if="layoutExtrato === 'classico'">
                                  <!-- <tr class="atividade" v-if="layoutExtrato === 'porOrigem'"> -->
                                  <td class="esquerda celula b1 b3 b4 nome_atividade">{{atividade.Nome}}</td>
                                  <td class="centralizado celula b1 b3 b4">&nbsp;</td>
                                  <td class="centralizado celula b1 b3">&nbsp;</td>
                                  <td class="centralizado celula b1 b3 b4">&nbsp;</td>
                                  <td class="centralizado celula b1 b3">&nbsp;</td>
                                  <td class="centralizado celula b1 b3 b4">&nbsp;</td>
                                  <td class="centralizado celula b1 b3 b2">&nbsp;</td>
                                  <td class="centralizado celula b1 b3 b2" v-if="processo === 'CONTRAPARTIDA' && _.includes(['Análise'], etapa)">&nbsp;</td>
                                </tr>

                                <template v-for="item in _.filter(cronograma.itens, {'Atividade_nome': atividade.Nome})" v-if="_.includes((processo === 'CONTRAPARTIDA' ? ['2'] : ['1', '5']), ('' + item.Item_Origem).substring(0, 1))">

                                  <template v-if="!_.has(item, 'mostrar') || item.mostrar">

                                    <tr>
                                      <!-- <td  class="centralizado celula b1 b3 b4">
                                        <span v-if="item.Item_Origem === 1">Fundação</span>
                                        <span v-else-if="item.Item_Origem === 2">Contrapartida</span>
                                        <span v-else-if="item.Item_Origem === 5">P.Estratégico</span>
                                      </td> -->
                                      <td class="celula b3 b4">
                                        <div class="item" v-bind:style="usuarioLogado.userType === 'FUNDACAO' ? 'width: 80%; float: left;' : ''">
                                          <div class="item_despesa esquerda">({{_.upperFirst(_.lowerCase(item.Item_Tipo))}})  {{item.Item + ' / ' + item.Item_Descricao}}</div>
                                          <div class="observacao esquerda" v-html="'<span class=id_item>#' + item.Id_item + '</span>  ' + item.Item_Observacao + '</span>'"/>
                                        </div>
                                        <div v-if="usuarioLogado.userType === 'FUNDACAO'" style="width: 20%; text-align: right; float: right; color: var(--cor-fraca)">{{item.Item_Conta}}</div>
                                      </td>

                                      <!-- Seção de orçamento -->
                                      <td class="centralizado celula b3 b4" :title="'<h5>' + (!_.has(item, 'Item_Unidade_medida') || _.isNull(item.Item_Unidade_medida) ? 'Sem unid. de medida' : (item.Item_Unidade_medida === 'Outros' && _.has(item, 'Item_Unidade_medida_outros') && !_.isNull(item.Item_Unidade_medida_outros) ? ('Outros:<br/>' + item.Item_Unidade_medida_outros) : item.Item_Unidade_medida)) + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                                        {{item.Qtde_orcado}}
                                      </td>
                                      <td class="centralizado celula b3">
                                        {{item.Valor_orcado | decimal2}}
                                      </td>


                                      <!-- Seção de solicitação -->
                                      <td class="centralizado celula b3 b4 qtdeSolicitacao" :class="parseFloat(item.Qtde_solicitado) === 0 && parseFloat(item.Valor_solicitado) !== 0 ? 'qtde_pendente' : ''">
                                        <input v-model="item.Qtde_solicitado" name="quantidade a solicitar" class="form-control text-right qtdeSolicitacao" type="text" @keyup="item.Qtde_solicitado = limitaFaixaEntrada('inteiro', item.Qtde_solicitado, 0, item.Qtde_saldo)" @blur="verificaCorrigeDados" :disabled="parseFloat(item.Qtde_saldo) <= 0 || parseFloat(item.Valor_saldo) <= 0 || ehVisualizacao || _.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa)"/>
                                      </td>
                                      <td class="centralizado celula b3 valorSolicitacao" :class="parseFloat(item.Qtde_solicitado) !== 0 && parseFloat(item.Valor_solicitado) === 0 ? 'valor_pendente' : ''">
                                        <money v-model="item.Valor_solicitado" name="valor a solicitar" class="form-control text-right valorSolicitacao" type="text" @keyup.native="item.Valor_solicitado = limitaFaixaEntrada('decimal', item.Valor_solicitado, 0, item.Valor_saldo)" @blur.native="calcularTotaisExtato" :disabled="parseFloat(item.Qtde_saldo) <= 0 || parseFloat(item.Valor_saldo) <= 0 || ehVisualizacao || _.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa)"></money>
                                      </td>


                                      <!-- Seção de saldos -->
                                      <td class="centralizado celula b3 b4" :title="'<h5>' + (!_.has(item, 'Item_Unidade_medida') || _.isNull(item.Item_Unidade_medida) ? 'Sem unid. de medida' : (item.Item_Unidade_medida === 'Outros' && _.has(item, 'Item_Unidade_medida_outros') && !_.isNull(item.Item_Unidade_medida_outros) ? ('Outros:<br/>' + item.Item_Unidade_medida_outros) : item.Item_Unidade_medida)) + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                                        {{item.Qtde_saldo - parseFloat(item.Qtde_solicitado)}}
                                      </td>
                                      <td class="centralizado celula b2 b3">
                                        {{item.Valor_saldo - parseFloat(item.Valor_solicitado) | decimal2}}
                                      </td>


                                      <!-- Seção de Economicidade -->
                                      <td class="centralizado celula b2 b3 b4" v-if="processo === 'CONTRAPARTIDA' && _.includes(['Análise'], etapa)" :title="'<h5>Seleciona aqui se o item está comprovado com economicidade</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                                        <label class="checkbox-inline new-control new-control-checkbox" style="vertical-align: top;">
                                          <input type="checkbox" :false-value="0" :true-value="1" v-model="item.Economicidade" @change="selecaoEconomicidade"
                                                 :disabled="parseFloat(item.Qtde_solicitado) === 0 && parseFloat(item.Valor_solicitado) === 0 || _.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa) || ehVisualizacao"/>
                                          <div class="new-control-indicator"></div>
                                        </label>
                                      </td>


                                    </tr>

                                  </template>

                                </template>

                              </template>

                            </template>

                            </tbody>

                          </table>

                        </div>
                      </div>

                      <!-- Totais -->
                      <div class="row" v-if="!loading.cronograma">
                        <div class="col-md-12">
                          <table class="totais">
                            <tr>
                              <td class="centralizado"><span v-if="totais.projeto.fbb.orcado !== 0">Total Fundação</span></td>
                              <td class="centralizado"><span v-if="totais.projeto.parceiros.orcado !== 0">Total Parceiro Estratégico</span></td>
                              <td class="centralizado"><span v-if="totais.projeto.contrapartida.orcado !== 0">Total Contrapartida</span></td>
                              <td class="centralizado">Total do Projeto</td>
                              <td class="centralizado"><span v-if="totais.adiantamento.total.orcado !== 0">Total Adiantável</span></td>
                              <td class="centralizado" v-if="processo === 'PRESTACAO_DE_CONTAS'">Limite pendente</td>
                              <td class="centralizado">Total desta Solicitação</td>
                            </tr>
                            <tr>
                              <td class="centralizado valor">
                                <span v-if="totais.projeto.fbb.orcado !== 0" :title="'<h5>Valor total orçado com recursos da Fundação</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                                  {{totais.projeto.fbb.orcado | real}}
                                </span>
                              </td>
                              <td class="centralizado valor">
                                <span v-if="totais.projeto.parceiros.orcado !== 0" :title="'<h5>Valor total orçado com recursos de Parceiro Estratégico</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                                  {{totais.projeto.parceiros.orcado | real}}
                                </span>
                              </td>
                              <td class="centralizado valor">
                                <span v-if="totais.projeto.contrapartida.orcado !== 0" :title="'<h5>Valor total orçado com recursos da Contrapartida</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                                  {{totais.projeto.contrapartida.orcado | real}}
                                </span>
                              </td>
                              <td class="centralizado valor">
                                <span :title="'<h5>Valor total orçado para este projeto</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                                  {{totais.projeto.total.orcado | real}}
                                </span>
                              </td>
                              <td class="centralizado valor">
                                <span v-if="totais.adiantamento.total.orcado !== 0" :title="'<h5>Valor total orçado para Adiantamento</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                                  {{totais.adiantamento.total.orcado | real}}
                                </span>
                              </td>

                              <td v-if="processo === 'PRESTACAO_DE_CONTAS'" class="centralizado valor">
                                <span v-if="_.includes(extratoFiltrosSelecionados, 'fundacao')" :title="'<h5>Saldo máximo disponível sobre o(s) adiantamento(s) liberados(s) com recursos da <span class=\'realce\'>Fundação</span> para prestar contas ou devolver</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">{{totais.adiantamento.fbb.saldo | real}}</span>
                                <span v-else-if="_.includes(extratoFiltrosSelecionados, 'parceiro')" :title="'<h5>Saldo máximo disponível sobre o(s) adiantamento(s) liberados(s) com recursos de <span class=\'realce\'>Parceiro Estratégicos</span> para prestar contas ou devolver</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">{{totais.adiantamento.parceiros.saldo | real}}</span>
                                <span v-else class="realce">Deve selecionar Fundação ou Parceiro no filtro</span>
                              </td>

                              <td class="centralizado valor" rowspan="2">
                                <span class="label label-danger" style="font-style: unset"
                                      v-if="processo === 'PRESTACAO_DE_CONTAS' && (
                                               (_.includes(extratoFiltrosSelecionados, 'fundacao') && totais.projeto.fbb.solicitado > totais.adiantamento.fbb.saldo) ||
                                               (_.includes(extratoFiltrosSelecionados, 'parceiro') && totais.projeto.parceiros.solicitado > totais.adiantamento.parceiros.saldo))"
                                      :title="'<h5>O total desta solicitação ultrapassou o limite pendente (saldo máximo disponível) para prestar contas</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                                  {{totais.projeto.total.solicitado | real}}
                                </span>
                                <span v-else :title="'<h5>Valor total desta solicitação</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                                  {{totais.projeto.total.solicitado | real}}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td class="centralizado valor">
                                <span v-if="totais.projeto.fbb.orcado !== 0" class="saldo" :title="'<h5>Saldo dos recursos da Fundação com <span class=\'realce\'>' + (Math.round(100 - ((totais.projeto.fbb.saldo / totais.projeto.fbb.orcado) * 100)) | percent) + '%</span> de atingimento</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                                  {{totais.projeto.fbb.saldo | real}}
                                </span>
                              </td>
                              <td class="centralizado valor">
                                <span v-if="totais.projeto.parceiros.orcado !== 0" class="saldo" :title="'<h5>Saldo dos recursos de Parceiro Estratégico com <span class=\'realce\'>' + (Math.round(100 - ((totais.projeto.parceiros.saldo / totais.projeto.parceiros.orcado) * 100)) | percent) + '%</span> de atingimento</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                                  {{totais.projeto.parceiros.saldo | real}}
                                </span>
                              </td>
                              <td class="centralizado valor">
                                <span v-if="totais.projeto.contrapartida.orcado !== 0" class="saldo" :title="'<h5>Saldo dos recursos da Contrapartida com <span class=\'realce\'>' + (Math.round(100 - ((totais.projeto.contrapartida.saldo / totais.projeto.contrapartida.orcado) * 100)) | percent) + '%</span> de atingimento</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                                  {{totais.projeto.contrapartida.saldo | real}}
                                </span>
                              </td>
                              <td class="centralizado valor">
                                <span class="saldo" :title="'<h5>Saldo total do projeto com <span class=\'realce\'>' + (Math.round(100 - ((totais.projeto.total.saldo / totais.projeto.total.orcado) * 100)) | percent) + '%</span> de atingimento</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                                  {{totais.projeto.total.saldo | real}}
                                </span>
                              </td>
                              <td class="centralizado valor">
                                <span v-if="totais.adiantamento.total.orcado !== 0 && false" class="saldo" :title="'<h5>Saldo dos Adiantamento não solicitados ainda</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                                  {{totais.adiantamento.total.saldo | real}}
                                </span>
                              </td>
                              <td class="centralizado valor">&nbsp;</td>

                              <td class="centralizado valor">&nbsp;</td>

                            </tr>
                          </table>
                        </div>
                      </div>
                    </div>

                  </div>


                  <!-- Itens da NF-e ------------- : ---------------------------------------------------------------------------------------------------------------->
                  <div class="box-body" v-if="ehNFe && !_.isNull(nfe.xmlNfe) && !_.isNull(nfe.protocoloValidacao)">
                    <div class="box-header">
                      <h3 class="box-title">Itens da NF-e</h3>
                    </div>

                    <div class="col-md-12">

                      <table class="table table-condensed">
                        <thead>
                        <tr>
                          <th class="text-center">Ordem</th>
                          <th>Item</th>
                          <th>Qtde</th>
                          <th>Valor Unitário</th>
                          <th>Total</th>
                        </tr>
                        </thead>

                        <tbody>
                        <tr v-for="item in _.isPlainObject(nfe.xmlNfe.NFe.infNFe.det) ? [nfe.xmlNfe.NFe.infNFe.det] : nfe.xmlNfe.NFe.infNFe.det">
                          <td>{{item['@nItem']}}</td>
                          <td>{{item.prod.xProd}} <span v-if="_.has(item.prod, 'DI')" style="color: var(--cor-atencao); font-weight: bold;"> (importado)</span></td>
                          <td>{{item.prod.qCom | decimal2}}</td>
                          <td>{{item.prod.vUnCom | real}}</td>
                          <td>{{item.prod.vProd | real}}</td>
                        </tr>
                        </tbody>
                      </table>

                    </div>

                    <!-- Totais da lista de itens da NF-e-->
                    <div class="col-md-12">
                      <table class="totais">
                        <tr>
                          <td class="centralizado">Quantidade de itens</td>
                          <td class="centralizado">Total desta NF-e</td>
                        </tr>
                        <tr>
                          <td class="centralizado valor">
                            <span :title="'<h5>Quantidade de itens que consta nesta NF-e</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                              {{ (_.isPlainObject(nfe.xmlNfe.NFe.infNFe.det) ? [nfe.xmlNfe.NFe.infNFe.det] : nfe.xmlNfe.NFe.infNFe.det).length }}
                            </span>
                          </td>
                          <td class="centralizado valor">
                            <span :title="'<h5>Valor total bruto desta NF-e</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                              {{_.sumBy((_.isPlainObject(nfe.xmlNfe.NFe.infNFe.det) ? [nfe.xmlNfe.NFe.infNFe.det] : nfe.xmlNfe.NFe.infNFe.det), function(i) { return (i.prod.indTot === '1' ? parseFloat(i.prod.vProd) : 0) }) | real}}
                            </span>
                          </td>
                        </tr>
                      </table>
                    </div>


                  </div>


                  <!-- Dados Complementares da Liberação de Recursos ------------------------------------------------------------------------------------------------------------------------------>
                  <div class="box-body" v-if="ehProjetoEspecial && usuarioLogado.userType === 'FUNDACAO' && processo === 'PAGAMENTO' && aprovacao.resultadoAprovacao !== 'Revisão'">
                    <div class="box-header">
                      <h3 class="box-title">
                        <span @click="mostrarDadosComplementares = !mostrarDadosComplementares"><i :class="'fa fa-caret-' + (mostrarDadosComplementares ? 'up' : 'down')" aria-hidden="true"></i>
                          <span style="cursor:pointer;">Dados complementares</span>
                            <i class="fa fa-question-circle text-gray" aria-hidden="true"
                               :title="'<h5>Projetos Especiais (Enchentes, Covid, BPB etc) nescessitam de dados complementares como qual o município, valor e quantidade de participantes os quais são destinados este pagamento</h5>'"
                               v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'top'}"></i>

                            <span v-if="loading.municipios" class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando...</span>
                        </span>
                      </h3>
                    </div>

                    <div class="col-md-12" v-if="mostrarDadosComplementares">
                      <span v-if="etapa === 'Análise'">
                        <g-button-ujarak color="primary" size="button--size-ss" @click.native="novoDadosComplementares" href="javascript:void(0)">
                          <i class="fa fa-plus" aria-hidden="true"></i> Incluir
                        </g-button-ujarak>
                        <br/><br/>
                      </span>

                      <table class="table table-condensed table-bordered">
                        <thead>
                        <tr>
                          <th class="centralizado w20">Município</th>
                          <th class="centralizado w15">Valor</th>
                          <th class="centralizado w30">Destinação</th>
                          <th class="centralizado w10">Famílias</th>
                          <th class="centralizado w10">Participantes</th>
                          <th class="centralizado w10" v-if="etapa === 'Análise'">Ações</th>
                        </tr>
                        </thead>

                        <tbody>
                        <tr v-for="(item, index) in nota.dadosComplementares" v-if="nota.dadosComplementares.length > 0" :key="index + item.municipio">

                          <td class="centralizado">
                            <span :title="'<h5>' + (_.has(item.municipio, 'nomcid') ? item.municipio.nomcid + ' / ' + item.municipio.sigufs : 'Selecione um município') + '</h5>'"
                                  v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'top'}">
                              <multiselect v-model="item.municipio"
                                           :options="municipiosUf"
                                           :disabled="ehVisualizacao || etapa !== 'Análise'"
                                           placeholder="Nome do município"
                                           label="nomcid"
                                           group-values="municipios"
                                           group-label="uf"
                                           track-by="codrai"
                                           :preselect-first="false"
                                           :close-on-select="true"
                                           selectLabel="Selecionar"
                                           deselectLabel="Desselecionar"
                                           selectedLabel=""
                                           name="municipio"
                                           v-validate="'required'">
                              </multiselect>
                            </span>
                          </td>

                          <td class="centralizado">
                            <money v-model="item.valor" name="valor em dado complementar" class="form-control text-center" type="text"
                                   @keyup.native="item.valor = limitaFaixaEntrada('decimal', item.valor, 0, totais.projeto.total.solicitado)"
                                   :disabled="ehVisualizacao || etapa !== 'Análise'"></money>
                          </td>

                          <td class="centralizado">
                            <input v-model="item.destinacao" name="destinacao em dado complementar" class="form-control" type="text"
                                   :disabled="ehVisualizacao || etapa !== 'Análise'"/>
                          </td>

                          <td class="centralizado">
                            <input v-model="item.familias" name="familias em dado complementar" class="form-control text-center" type="text"
                                   @keyup="item.familias = limitaFaixaEntrada('inteiro', item.familias, 0, 9999999)"
                                   :disabled="ehVisualizacao || etapa !== 'Análise'"/>
                          </td>

                          <td class="centralizado">
                            <input v-model="item.participantes" name="participantes em dado complementar" class="form-control text-center" type="text"
                                   @keyup="item.participantes = limitaFaixaEntrada('inteiro', item.participantes, 0, 9999999)"
                                   :disabled="ehVisualizacao || etapa !== 'Análise'"/>
                          </td>

                          <td class="centralizado" v-if="etapa === 'Análise'">
                            <g-button-moema color="error" @click.native="excluiDadosComplementares(index)" type="button"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</g-button-moema>
                          </td>
                        </tr>
                        </tbody>
                      </table>

                    </div>


                    <!-- Totais da lista de dados complementares -->
                    <div class="col-md-12" v-if="mostrarDadosComplementares">
                      <table class="totais" v-if="nota.dadosComplementares.length > 0">
                        <tr>
                          <td class="centralizado">Registros</td>
                          <td class="centralizado">Total</td>
                          <td class="centralizado">Famílias</td>
                          <td class="centralizado">Participantes</td>
                        </tr>
                        <tr>
                          <td class="centralizado valor">
                            <span :title="'<h5>Se trata da quantidade registros de dados complementares que há acima</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                              {{ nota.dadosComplementares.length }}
                            </span>
                          </td>
                          <td class="centralizado valor">
                            <span :title="'<h5>Valor total discriminado nos registros destes dados complementares<br/><br/>Não pode exceder o limite do solicitado nesta ID de<br/>R$ ' + (totais.projeto.total.solicitado) + '</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                              {{ _.sumBy(nota.dadosComplementares, function (d) { return parseFloat(d.valor) }) | real }}
                              <span class="label label-danger" v-if="_.sumBy(nota.dadosComplementares, function (d) { return parseFloat(d.valor) }) > totais.projeto.total.solicitado">Ultrapassou {{(_.sumBy(nota.dadosComplementares, function (d) { return parseFloat(d.valor) }) - totais.projeto.total.solicitado) | real}}</span>
                            </span>
                          </td>
                          <td class="centralizado valor">
                            <span :title="'<h5>Quantidde total de famílias beneficiadas informadas nestes dados complementares</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                              {{ _.sumBy(nota.dadosComplementares, function (d) { return parseInt(d.familias) }) }}
                            </span>
                          </td>
                          <td class="centralizado valor">
                            <span :title="'<h5>Quantidde total de participantes beneficiários informados nestes dados complementares</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                              {{ _.sumBy(nota.dadosComplementares, function (d) { return parseInt(d.participantes) }) }}
                            </span>
                          </td>
                        </tr>
                      </table>
                    </div>

                  </div>

                  <!-- Informações das Parcelas ----------------------------------------------------------------------------------------------------------------->
                  <!--<div class="box-body" id="infoParcelas" v-if="_.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa) && usuarioLogado.userType === 'FUNDACAO'">-->
                    <!--<div class="box-header">-->
                      <!--<h3 class="box-title">Parcela(s) <span v-if="loading.analise_tributaria" class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando...</span></h3>-->
                    <!--</div>-->

                    <!--<div v-if="!_.isEmpty(analiseTributaria.parcelas)">-->
                      <!--<div class="col-md-12">-->
                        <!--<div class="table-responsive">-->

                          <!--<table class="table table-condensed">-->
                            <!--<thead>-->
                            <!--<tr>-->
                              <!--<td class="centralizado borda">Tipo Título</td>-->
                              <!--<td class="centralizado borda">Título</td>-->
                              <!--<td class="centralizado borda">Vencimento</td>-->
                              <!--<td class="centralizado borda">Valor</td>-->
                            <!--</tr>-->
                            <!--</thead>-->

                            <!--<tbody>-->
                            <!--<tr v-for="item in analiseTributaria.parcelas">-->
                              <!--<td class="celula centralizado borda">{{item.CodTpt}} - {{buscaTiposTitulo(item.CodTpt)}}</td>-->
                              <!--<td class="celula centralizado borda">{{item.NumTit}}</td>-->
                              <!--<td class="celula centralizado borda">{{item.VctPar | moment("L")}}</td>-->
                              <!--<td class="celula centralizado borda">{{item.VlrPar | real}}</td>-->
                            <!--</tr>-->
                            <!--</tbody>-->
                          <!--</table>-->

                        <!--</div>-->

                      <!--</div>-->

                    <!--</div>-->

                  <!--</div>-->


                  <!-- Informações do Projeto e Observação do Comunicado Interno ----------------------------------------------------------------------------------------------------------------->
                  <div class="box-body" id="infoProjetoObservacoes" v-if="_.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa) && usuarioLogado.userType === 'FUNDACAO'">
                    <div class="box-header">
                      <h3 class="box-title">Informações do Projeto <span v-if="loading.analise_tributaria" class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando...</span></h3>
                    </div>

                    <div v-if="!_.isEmpty(analiseTributaria)">
                      <div class="col-md-12">
                        <div class="table-responsive">
                          <table class="table table-condensed table-bordered table-striped">
                            <thead>
                            <tr>
                              <td colspan="3" class="centralizado">Conta Interna do Projeto</td>
                              <td colspan="3" class="centralizado">Outras Informações</td>
                            </tr>
                            <tr>
                              <td class="centralizado borda">Banco</td>
                              <td class="centralizado borda">Agência</td>
                              <td class="centralizado borda">Conta</td>
                              <td class="centralizado borda">MCI</td>
                              <td class="centralizado borda">Conta Movimento</td>
                              <td class="centralizado borda">Tipo do Projeto</td>
                            </tr>
                            </thead>

                            <tbody>
                            <!-- Tabela -->
                            <tr>
                              <td class="celula centralizado borda">{{analiseTributaria.projeto.codban}}</td>
                              <td class="celula centralizado borda">{{analiseTributaria.projeto.codage}}</td>
                              <td class="celula centralizado borda">{{analiseTributaria.projeto.ccbfor}}</td>
                              <td class="celula centralizado borda">{{analiseTributaria.projeto.usu_mci}}</td>
                              <!--<td class="celula centralizado borda">{{analiseTributaria.contas_projeto.NumCco}} - {{analiseTributaria.contas_projeto.DesCco}}</td>-->
                              <td class="celula centralizado borda" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }"
                                  :title="'<h5>' + analiseTributaria.contas_projeto.DesCco + '</h5>'">
                                {{analiseTributaria.contas_projeto.NumCco}}
                              </td>
                              <td class="celula centralizado borda">{{analiseTributaria.projeto.codtpj}}</td>
                            </tr>
                            </tbody>

                          </table>
                        </div>

                      </div>

                    </div>

                  </div>


                  <!-- Observação do Documento Fiscal (Comunicado Interno) ----------------------------------------------------------------------------------------------------------------->
                  <div class="box-body" id="observacaoCI" v-if="_.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa) && usuarioLogado.userType === 'FUNDACAO'">
                    <div class="box-header">
                      <h3 class="box-title">Observação do Documento Fiscal <span v-if="loading.analise_tributaria" class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando...</span></h3>
                    </div>

                    <div v-if="!_.isEmpty(analiseTributaria)">
                      <div class="col-md-12">
                        <textarea-autosize v-resizable name="observacao_nf" v-model="analiseTributaria.nf.ObsNfc" rows="3" class="form-control" :disabled="true"></textarea-autosize>
                      </div>
                    </div>

                  </div>



                  <!-- Anexos ------------------------------------------------------------------------------------------------------------------------------>
                  <div class="box-body">
                    <div class="box-header">
                      <h3 class="box-title">Documentos Anexos</h3>
                    </div>

                    <div class="col-md-12">
                      <upload-documentos-php :propDocumentos="nota.anexos" :documentTypes="''" :disable="ehVisualizacao || _.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa)" :local-uso="'SOLICITACAO_PAGAMENTO'"></upload-documentos-php>
                    </div>

                  </div>


                  <!--&lt;!&ndash; Histórico do processo -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;-->
                  <!--<div class="box-body" v-if="_.includes(['Revisão', 'Análise', 'Análise Tributária', 'Autorização', 'Liquidação'], etapa) || ehVisualizacao">-->
                    <!--<div class="box-header">-->
                      <!--<h3 class="box-title">Histórico</h3>-->
                    <!--</div>-->

                    <!--<div class="col-md-12">-->
                      <!--<div class="table-responsive">-->
                        <!--<table class="table table-condensed table-bordered table-striped">-->
                          <!--<thead style="text-align: center;">-->
                          <!--<tr>-->
                            <!--<td>Data</td>-->
                            <!--<td>Fase</td>-->
                            <!--<td>Justificativa</td>-->
                            <!--<td>Usuário Responsável</td>-->
                          <!--</tr>-->
                          <!--</thead>-->
                          <!--<tbody>-->
                          <!--<tr v-for="item in _.filter(historico, ['tipo', 'Usuário'])">-->
                            <!--<td class="text-center" style="width: 120px">{{item.inicio | moment('DD/MM/YYYY hh:mm')}}</td>-->
                            <!--<td class="text-center">{{item.nome}}</td>-->
                            <!--<td class="text-center">{{item.observacao}}</td>-->
                            <!--<td class="text-center" style="width: 210px">{{_.has(item, 'usuario') && _.has(item.usuario, 'ds_nome_usuario') ? item.usuario.ds_nome_usuario : ''}}</td>-->
                          <!--</tr>-->
                          <!--</tbody>-->
                        <!--</table>-->
                      <!--</div>-->
                    <!--</div>-->
                  <!--</div>-->

                  <!-- Histórico do processo ----------------------------------------------------------------------------------------------------------->
                  <div class="box-body" v-if="_.includes(['Revisão', 'Análise', 'Análise Tributária', 'Autorização', 'Liquidação'], etapa) || ehVisualizacao">
                    <div>
                      <div class="box-header with-border">
                        <h3 class="box-title">Histórico de solicitação <span v-if="loading.cronograma" class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando...</span> </h3>
                      </div>
                      <historico-solicitacao-pagamento v-if="historicoBack && !_.isNull(historicoBack) && !_.isEmpty(historicoBack)" :propsValidacao="validacao" :propsHistorico="historicoBack" :key="historicoBack"></historico-solicitacao-pagamento>
                    </div>
                    <div class="text-left box-header" v-if="dataMenor === true || (!historicoBack || _.isNull(historicoBack) || _.isEmpty(historicoBack)) && !loading.cronograma">
                      <a href="" v-if="esconderHistorico === false" @click.prevent="esconderHistorico = true"><i class="fa fa-caret-down" aria-hidden="true"></i> Mostrar histórico antigo</a>
                      <a href="" v-if="esconderHistorico === true" @click.prevent="esconderHistorico = false"><i class="fa fa-caret-up" aria-hidden="true"></i> Ocultar histórico antigo</a>
                    </div>
                    <div class="col-md-8" v-if="esconderHistorico === true && dataMenor === true  || (!historicoBack || _.isNull(historicoBack) || _.isEmpty(historicoBack)) && !loading.cronograma">
                      <div>
                        <div class="box-header with-border">
                          <h3 class="box-title">Histórico Antigo</h3>
                        </div>
                        <historico-antigo :propsValidacao="validacao" :propsHistorico="historicoTarefas" :key="historicoTarefas"></historico-antigo>
                      </div>
                    </div>
                  </div>

                  <!-- Observação opcional da entidade ----------------------------------------------------------------------------------------------------------->
                  <div class="box-body" v-if="(_.includes(['Solicitação', 'Revisão'], etapa) && usuarioLogado.userType !== 'FUNDACAO')">
                    <div>
                      <div class="box-header">
                        <h3 class="box-title">Observação Opcional</h3>
                      </div>
                    </div>

                    <!-- Observação opcional da aprovação -->
                    <div class="col-md-12">
                      <textarea name="observacao_opcional" id="observacao_opcional" v-model="nota.observacao" rows="3" class="form-control" :disabled="ehVisualizacao"></textarea>
                    </div>

                  </div>

                  <!-- Marcação de ciente em declarações para liberação de recursos ----------------------------------------------------------------------------------------------------------->
                  <div class="box-body ciente_declaracoes" v-if="!_.isEmpty(entidade) && !loading.tela && processo !== 'CONTRAPARTIDA' && !ehProjetosPovosTradicionais">

                    <div v-if="_.includes(['Solicitação', 'Revisão'], etapa) && !ehVisualizacao">
                      <div :class="'alert alert-dismissible alert-' + (_.find(cienteDeclaracoes, ['codigo', declaracao.codigo]) ? 'success' : 'warning')" v-for="declaracao in declaracoes">
                        <h4><i class="fa fa-warning"></i> Atenção!</h4>
                        <p>
                          <i @click="ciente(declaracao.codigo)" :class="_.find(cienteDeclaracoes, ['codigo', declaracao.codigo]) ? 'fa fa-check-square-o selecionado' : 'fa fa-square-o'" aria-hidden="true"></i>
                          {{ textoDeclaracao(declaracao.texto) }}
                        </p>
                      </div>
                    </div>

                    <div v-else class="col-md-12">
                      <div v-for="declaracao in cienteDeclaracoes" class="form-group well">
                        <div class="col-md-9">{{ textoDeclaracao(declaracao.texto) }}</div>
                        <div class="col-md-3 text-right">
                          {{ declaracao.usuario.nome }}<br/>
                          {{ declaracao.data | moment('DD/MM/YYYY HH:mm') }}
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




      <!-- Decisões ----------------------------------------------------------------------------->
      <div class="row" id="decisoes_aprovação" v-if="_.includes(['Análise', 'Análise Tributária', 'Autorização', 'Liquidação'], etapa) && usuarioLogado.userType === 'FUNDACAO' && !ehVisualizacao">
        <div class="col-md-12 form-horizontal">
          <div class="box box-primary">
            <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

            <div class="box-header with-border">
              <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Decisão</h3>
            </div>

            <div class="form-horizontal">

              <div class="box-body">
                <div class="row">
                  <div class="col-md-12">
                    <div class="form-group required col-md-12">

                      <div class="col-md-12">
                        <!-- Aprovação -------------------------------------------------->
                        <label class="new-control new-control-radio" style="padding-top: 8px;">
                          <input type="radio" name="decisão" :value="etapa === 'Análise' ? (processo === 'CONTRAPARTIDA' ? 'Conclusão' : 'Análise Tributária') : (etapa === 'Análise Tributária' ? 'Autorização' : (etapa === 'Autorização' ? (processo === 'PRESTACAO_DE_CONTAS' ? 'Conclusão' : (ativaGeracaoRemessa ? 'Liquidação' : 'Conclusão')) : (etapa === 'Liquidação' ? 'Conclusão' : '')))" :disabled="ehVisualizacao"
                                 v-model="aprovacao.resultadoAprovacao" v-validate="'required'"/> {{ etapa === 'Liquidação' ? 'Concluir processo manualmente' : 'Aprovar solicitação' }}
                          <div class="new-control-indicator"></div>
                        </label>

                        <div class="col-md-12" v-if="processo !== 'CONTRAPARTIDA' && ((etapa === 'Análise' && aprovacao.resultadoAprovacao === 'Análise Tributária') || (etapa === 'Análise Tributária' && aprovacao.resultadoAprovacao === 'Autorização') || (etapa === 'Autorização' && aprovacao.resultadoAprovacao === 'Conclusão') || (etapa === 'Autorização' && aprovacao.resultadoAprovacao === 'Liquidação'))">
                          <div class="col-md-12">
                            <label class="control-label">Integrar com Sapiens?</label>
                            <span>
                                <label class="radio-inline new-control new-control-radio">
                                  <input type="radio" name="bypass" v-model="nota.bypass" :value="''" :disabled="etapa !== 'Análise' || ehVisualizacao"> Sim
                                  <div class="new-control-indicator"></div>
                                </label>
                                <label class="radio-inline new-control new-control-radio">
                                  <input type="radio" name="bypass" v-model="nota.bypass" :value="'BYPASS'" :disabled="etapa !== 'Análise' || ehVisualizacao"> Não
                                  <div class="new-control-indicator"></div>
                                </label>
                              </span>
                          </div>
                        </div>

                        <!-- Observação opcional da aprovação -->
                        <div class="col-md-12">
                          <div v-if="(etapa === 'Análise' && aprovacao.resultadoAprovacao === 'Análise Tributária') || (etapa === 'Análise Tributária' && aprovacao.resultadoAprovacao === 'Autorização') || (etapa === 'Autorização' && aprovacao.resultadoAprovacao === 'Conclusão') || (etapa === 'Autorização' && aprovacao.resultadoAprovacao === 'Liquidação') || (etapa === 'Análise' && aprovacao.resultadoAprovacao === 'Conclusão')" class="col-md-12">
                            <label for="observacao_decisao" class="control-label">Observação:</label>
                            <textarea name="observacao_decisao" id="observacao_decisao" v-model="nota.observacao" rows="3" class="form-control" :disabled="ehVisualizacao"></textarea>
                          </div>
                        </div>
                      </div>


                      <!-- Revisão da entidade -------------------------------------------------->
                      <div class="col-md-12" v-if="etapa === 'Análise'">
                        <label class="new-control new-control-radio" style="padding-top: 8px;">
                          <input type="radio" name="decisão" value="Revisão" :disabled="ehVisualizacao || (_.includes(['PAGAMENTO', 'RESSARCIMENTO', 'PRESTACAO_DE_CONTAS'], this.processo) && ((projeto.Status_ERP !== 'APR' && possuiNotaSapiens) || tituloMovimentado))"
                                 v-model="aprovacao.resultadoAprovacao" v-validate="'required'"/> Encaminhar para revisão da entidade
                          <div class="new-control-indicator"></div>
                        </label>

                        <div v-if="_.includes(['PAGAMENTO', 'RESSARCIMENTO', 'PRESTACAO_DE_CONTAS'], this.processo)">
                          <p v-if="projeto.Status_ERP !== 'APR' && possuiNotaSapiens" class="col-md-12 text-danger"><strong> Atenção:</strong> Não é possível devolver para a entidade pois o projeto está com status diferente de APR e com nota no Sapiens.</p>
                          <p v-if="tituloMovimentado" class="col-md-12 text-danger"><strong> Atenção:</strong> Não é possível devolver para a entidade pois a nota possui movimento contábil.</p>
                        </div>

                        <!-- Motivo de devolução Suporte 59885 -->
                        <div class="form-group required-field full col-md-12" v-if="aprovacao.resultadoAprovacao === 'Revisão' && usuarioLogado.userType === 'FUNDACAO'"
                             :class="{'has-error' : errors.first('motivo de devolucao')}" style="margin-right:0;margin-left:0">
                          <label class="control-label">Motivo de devolução:</label>
                          <div class="col-md-12">
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

                        <!-- Justificativa de devolução para entidade -->
                        <div class="col-md-12">
                          <div v-if="aprovacao.resultadoAprovacao === 'Revisão' && usuarioLogado.userType === 'FUNDACAO'"
                               class="required-field col-md-12" :class="{ 'has-error' : errors.first('justificativa')}">
                            <label for="justificativa_revisão" class="control-label">Motivo para revisão:</label>
                            <textarea name="motivo para revisão" v-model="nota.observacao" rows="3" id="justificativa_revisão" class="form-control" v-validate="'required'" :disabled="ehVisualizacao"></textarea>
                            <span v-if="errors.first('motivo para revisão')" class="label label-danger"> {{ errors.first('motivo para revisão') }}</span>
                          </div>
                        </div>

                      </div>


                      <!-- Reanalisar -------------------------------------------------->
                      <div class="col-md-12" v-if="_.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa)">
                        <label class="new-control new-control-radio" style="padding-top: 8px;">
                          <input type="radio" name="decisão" value="Análise" :disabled="ehVisualizacao"
                                 v-model="aprovacao.resultadoAprovacao" v-validate="'required'"/> Retornar para análise
                          <div class="new-control-indicator"></div>
                        </label>

                        <!-- Motivo para reanalisar -->
                        <div class="col-md-12">
                          <div v-if="aprovacao.resultadoAprovacao === 'Análise' && usuarioLogado.userType === 'FUNDACAO'"
                               class="required-field col-md-12" :class="{ 'has-error' : errors.first('justificativa reanalise')}">
                            <label for="justificativa_reanalise" class="control-label">Motivo para reanalisar:</label>
                            <textarea name="justificativa reanalise" v-model="nota.observacao" rows="3" id="justificativa_reanalise" class="form-control" v-validate="'required'" :disabled="ehVisualizacao"></textarea>
                            <span v-if="errors.first('justificativa reanalise')" class="label label-danger"> {{ errors.first('justificativa reanalise') }}</span>
                          </div>
                        </div>
                      </div>


                      <!-- Encaminhar para Análise Tributária -------------------------------------------------->
                      <div class="col-md-12" v-if="_.includes(['Autorização'], etapa)">
                        <label class="new-control new-control-radio" style="padding-top: 8px;">
                          <input type="radio" name="decisão" value="Análise Tributária" :disabled="ehVisualizacao"
                                 v-model="aprovacao.resultadoAprovacao" v-validate="'required'"/> Retornar para Análise Tributária
                          <div class="new-control-indicator"></div>
                        </label>

                        <!-- Motivo para encaminhar a Analise Tributaria -->
                        <div class="col-md-12">
                          <div v-if="aprovacao.resultadoAprovacao === 'Análise Tributária' && usuarioLogado.userType === 'FUNDACAO'"
                               class="required-field col-md-12" :class="{ 'has-error' : errors.first('justificativa encaminhar analise tributaria')}">
                            <label for="justificativa_reanalise" class="control-label">Motivo para devolver para Análise Tributária:</label>
                            <textarea name="justificativa reanalise" v-model="nota.observacao" rows="3" id="justificativa_encaminhar_analise_tributaria" class="form-control" v-validate="'required'" :disabled="ehVisualizacao"></textarea>
                            <span v-if="errors.first('justificativa encaminhar analise tributaria')" class="label label-danger"> {{ errors.first('justificativa encaminhar analise tributaria') }}</span>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

                <!-- Vincula chamado do Suporte FBB -------------------------------------------------->
                <div class="row" v-if="_.includes(['Análise', 'Análise Tributária', 'Autorização', 'Liquidação'], etapa) && usuarioLogado.userType === 'FUNDACAO'">
                  <div class="form-group col-md-12">
                    <!--<label class="control-label col-md-2" :title="'<h5>Opcionalmente, pode vincular um chamdo do Suporte FBB que não esteja encerrado</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">Suporte FBB:</label>-->
                    <div class="col-md-8">
                      <span v-if="loading.suportesFbbAtivos" class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando Supotes não encerrados...</span>
                      <span v-else>
                        <multiselect v-model="nota.suporteFbb"
                                     :options="listaSuportes"
                                     :multiple="true"
                                     :max=3
                                     :close-on-select="true"
                                     :placeholder="'Neste id ' + id + ' pode ter vinculado opcionalmente de um a três Suportes desta lista de chamados não encerrados'"
                                     :custom-label="suporteNome"
                                     track-by="numero"
                                     selectedLabel="Selecionado"
                                     selectLabel="Aperte ENTER para selecionar"
                                     deselectLabel="Aperte ENTER para remover"
                                     name="suporte_fbb"
                                     data-vv-as="suporte_fbb"
                                     :disabled="ehVisualizacao">
                          <template slot="maxElements" slot-scope="props"><span class="text-red">Já escolheu o limite de três suportes que pode vincular a este ID</span></template>

                        </multiselect>
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <dialog ref="alertaValorOriginal" id="alertaValorOriginal" style="width: 500px; max-width: 100%; padding: 20px;">
        <p><strong>Informação relevante</strong> </p>
        <p style="margin:20px 0">
          ⚠️ O valor desta solicitação mudou em relação ao que foi informado na etapa de solicitação ({{ valorOriginal | real }}).
        </p>
        <button class="btn btn-danger" @click="$refs.alertaValorOriginal.close();botao_concluir_disabled = false">Cancelar e revisar</button>
        <button class="btn btn-neutral" @click="confirmaValorOriginalDiferente = true; $refs.alertaValorOriginal.close(); concluir()">Estou ciente, continuar</button>
      </dialog>
    </section>

    


  </div>


</template>

<script>
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  import UploadDocumentosPhp from '../../modules/uploadDocumentosPhp'
  import HistoricoSolicitacaoPagamento from '../../solicitacoes/modulos/historicoSolicitacaoPagamento'
  import HistoricoAntigo from '../../solicitacoes/modulos/historicoAntigo'
  import BankAccountValidator from 'br-bank-account-validator'
  import { cpf, cnpj } from 'cpf-cnpj-validator'
  import boleto from '@mrmgomes/boleto-utils'

  export default {
    components: {
      UploadDocumentosPhp,
      HistoricoSolicitacaoPagamento,
      HistoricoAntigo
    },
    name: 'main-solicitacao-pagamentos',
    data () {
      return {
        id: null,
        ativaGeracaoRemessa: true, // Desativada até liberação pelo cliente, previsão para final de janeiro/2023
        ehNFe: false, // Desativada pergunta de NF-e enquanto não fica concluída esta demanda. Quando ficar pronta este valor default será null
        processo: 'PAGAMENTO',
        etapa: 'Solicitação',
        historico: [],
        projetoSuperior: 0,
        temOcorrencia: false,
        razaoSocial: '',
        id_entidade: 0,
        mostrar_ocorrencias: false,
        ocorrencias: [],
        mostrar_representantes: false,
        dirigentes: [],
        cod_cargo: 0,
        cargos: ['', 'Presidente(a)', 'Vice-Presidente', 'Prefeito(a)', 'Diretor(a)', 'Diretor(a) Superintendente', 'Coordenador(a)', 'Outros', 'Reitor(a)', 'Secretário(a)', 'Tesoureiro(a)', 'Contato', 'Designado(a)', 'Procurador(a)'],
        esconderHistorico: false,
        data_edicao: '',
        dataFinalConvenio: '',
        historicoTarefas: [],
        historicoTarefasTela: [],
        historicoBack: [],
        restricao: false,
        projetoComAlteracaoEmAndamento: false,
        loading: {
          tela: false,
          cronograma: false,
          adiantamentos: false,
          analise_tributaria: false,
          suportesFbbAtivos: false,
          favorecido: false
        },
        dataMenor: false,
        dataCorte: '2020-12-10',
        chamado: [],
        listaProjetos: [],
        projeto: {},
        entidade: {},
        cronograma: [],
        desabilitarDatasFuturas: {
          from: new Date() // Desabilitar todas as datas depois desta (neste caso não permite data depois de hoje)
        },
        desabilitarDatasPassadas: {
          to: new Date() // Desabilitar todas as datas antes desta (neste caso não permite data antes de hoje)
        },
        nota: {
          numeroNota: null,
          serieNota: null,
          dataInclusao: null,
          dataValidade: null,
          observacao: null,
          dados_bancarios: {
            banco: null,
            agencia: null,
            conta: null,
            tipo: 1
          },
          tipoFornecedor: null,
          codigoFornecedor: '',
          cpfFornecedor: '',
          cnpjFornecedor: '',
          nomeFornecedor: '',
          enderecoFornecedor: '',
          cepFornecedor: '',
          // cidadeFornecedor: '',
          // estadoFornecedor: '',
          anexos: [],
          forma_pagamento: null,
          pagamentoPrioritario: 0,
          bypass: '',
          dadosComplementares: [],
          suporteFbb: [],
          tributacao: '',
          valorTributado: '',
          parametros_documento: [],
          boleto: {
            sucesso: false,
            mensagem: null,
            tipoCodigoInput: null,
            tipoBoleto: null,
            codigoBarras: null,
            linhaDigitavel: null,
            numeroInformadoTela: null,
            vencimento: null,
            valor: null
          },
          favorecido: {
            CodBan: '',
            CodAge: '',
            CcbFav: '',
            contas: [],
            incluidos: [],
            excluidos: [],
            resultado: [],
            dadosBancariosSelecionados: null
          }
        },
        ehVoluntariado: null,
        ehPrestacaoSimplificada: false,
        cienteDeclaracoes: [],
        declaracoes: [{'codigo': 'fornecedoresNaoLigadosDirigentes', 'texto': 'Declaro que esta liberação de recurso não será destinada ao pagamento de fornecedores de bens e serviços dos quais seu(s) proprietário(s), sócio(s) ou dirigente(s) seja(m) componentes da diretoria e conselhos da {{entidade.ds_nome}}'}, {'codigo': 'recursosNaoDestinadosDirigentesParentes', 'texto': 'Declaro ainda que o recurso não será destinado a fornecedores de bens e serviços dos quais seu(s) proprietário(s), sócio(s) ou dirigente(s) seja(m) parente(s) consanguíneo(s) ou afins, em linha reta ou colateral, até o terceiro grau com dirigente(s) ou conselheiro(s) da {{entidade.ds_nome}}'}],
        municipiosUf: [],
        // projetosEspeciais: {
        //   enchentes: [18106, 18107, 18111, 18112, 20304, 20305, 20306, 20307],
        //   covid: [20019, 20012, 20023, 20022, 20024, 20020],
        //   bpb: [21263, 21270, 21299, 21319, 21320, 21318, 21316, 21322]
        // },
        projetosPovosTradicionais: [21810, 21833],
        ehProjetosPovosTradicionais: false,
        ehProjetoEspecial: false,
        mostrarDadosComplementares: false,
        opcoesContasExistentesFavorecido: [],
        nfe: {
          xmlNfe: {},
          validada: false,
          protocoloValidacao: null,
          chaveAcesso: null,
          dataValidacao: null,
          resultadoValidacao: null,
          retornoValidacao: null,
          idUsuarioConsulta: null
        },
        //
        aprovacao: {},
        analiseTributaria: {},
        layoutExtrato: 'classico',
        // layoutExtrato: 'porOrigem',
        extratoFiltrosSelecionados: this.$route.name === 'solicitacao-contrapartida' ? ['saldos'] : ['saldos', 'fundacao'],
        adiantamentosFiltrosSelecionados: ['adiantamento_pendente'],
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
        ultimaTarefaFeita: {},
        //
        //
        bloqueiaCamposFornecedorExistente: false,
        restricaoParaInicializar: [],
        restricaoParaConcluir: [],
        ehVisualizacao: false,
        validacao: {},
        descricaoProcesso: {'PAGAMENTO': 'Pagamento', 'PRESTACAO_DE_CONTAS': 'Prestação de Contas', 'CONTRAPARTIDA': 'Contrapartida', 'RESSARCIMENTO': 'Ressarcimento'},
        rotasProcesso: {'PAGAMENTO': '/solicitacao/pagamento', 'PRESTACAO_DE_CONTAS': '/solicitacao/prestacaocontas', 'CONTRAPARTIDA': '/solicitacao/contrapartida', 'RESSARCIMENTO': '/solicitacao/ressarcimento'},
        poderes: {
          codigo: '',
          mensagem: []
        },
        listaBancos: [{'codigo': '001', 'nome': 'Banco do Brasil S.A.', 'caracteresConta': 8}, {'codigo': '033', 'nome': 'Banco Santander (Brasil) S.A.', 'caracteresConta': 8, 'digitoAgencia': false}, {'codigo': '070', 'nome': 'BRB - Banco de Brasília S.A.'}, {'codigo': '104', 'nome': 'Caixa Econômica Federal', 'digitoAgencia': false}, {'codigo': '237', 'nome': 'Banco Bradesco S.A.', 'caracteresConta': 7}, {'codigo': '341', 'nome': 'Itaú Unibanco S.A.', 'caracteresConta': 5, 'digitoAgencia': false},
          {'codigo': '', 'nome': '', $isDisabled: true}, // Separador (elemento disabled)
          {'codigo': '003', 'nome': 'BANCO DA AMAZONIA S.A.'}, {'codigo': '004', 'nome': 'Banco do Nordeste do Brasil S.A.'}, {'codigo': '007', 'nome': 'BANCO NACIONAL DE DESENVOLVIMENTO ECONOMICO E SOCIAL'}, {'codigo': '010', 'nome': 'CREDICOAMO CREDITO RURAL COOPERATIVA'}, {'codigo': '011', 'nome': 'CREDIT SUISSE HEDGING-GRIFFO CORRETORA DE VALORES S.A'}, {'codigo': '012', 'nome': 'Banco Inbursa S.A.'}, {'codigo': '014', 'nome': 'STATE STREET BRASIL S.A. ? BANCO COMERCIAL'}, {'codigo': '015', 'nome': 'UBS Brasil Corretora de Câmbio, Títulos e Valores Mobiliários S.A.'}, {'codigo': '016', 'nome': 'COOPERATIVA DE CRÉDITO MÚTUO DOS DESPACHANTES DE TRÂNSITO DE SANTA CATARINA E RI'}, {'codigo': '017', 'nome': 'BNY Mellon Banco S.A.'}, {'codigo': '018', 'nome': 'Banco Tricury S.A.'}, {'codigo': '021', 'nome': 'BANESTES S.A. BANCO DO ESTADO DO ESPIRITO SANTO'}, {'codigo': '024', 'nome': 'Banco Bandepe S.A.'}, {'codigo': '025', 'nome': 'Banco Alfa S.A.'}, {'codigo': '029', 'nome': 'Banco Itaú Consignado S.A.'}, {'codigo': '036', 'nome': 'Banco Bradesco BBI S.A.'}, {'codigo': '037', 'nome': 'Banco do Estado do Pará S.A.'}, {'codigo': '040', 'nome': 'Banco Cargill S.A.'}, {'codigo': '041', 'nome': 'Banco do Estado do Rio Grande do Sul S.A.', 'caracteresConta': 9}, {'codigo': '047', 'nome': 'Banco do Estado de Sergipe S.A.'}, {'codigo': '060', 'nome': 'Confidence Corretora de Câmbio S.A.'}, {'codigo': '062', 'nome': 'Hipercard Banco Múltiplo S.A.'}, {'codigo': '063', 'nome': 'Banco Bradescard S.A.'}, {'codigo': '064', 'nome': 'GOLDMAN SACHS DO BRASIL BANCO MULTIPLO S.A.'}, {'codigo': '065', 'nome': 'Banco AndBank (Brasil) S.A.'}, {'codigo': '066', 'nome': 'BANCO MORGAN STANLEY S.A.'}, {'codigo': '069', 'nome': 'Banco Crefisa S.A.'}, {'codigo': '074', 'nome': 'Banco J. Safra S.A.'}, {'codigo': '075', 'nome': 'Banco ABN Amro S.A.'}, {'codigo': '076', 'nome': 'Banco KDB do Brasil S.A.'}, {'codigo': '077', 'nome': 'Banco Inter S.A.'}, {'codigo': '078', 'nome': 'Haitong Banco de Investimento do Brasil S.A.'}, {'codigo': '079', 'nome': 'Banco Original do Agronegócio S.A.'}, {'codigo': '080', 'nome': 'B&T CORRETORA DE CAMBIO LTDA.'}, {'codigo': '081', 'nome': 'BancoSeguro S.A.'}, {'codigo': '082', 'nome': 'BANCO TOPÁZIO S.A.'}, {'codigo': '083', 'nome': 'Banco da China Brasil S.A.'}, {'codigo': '084', 'nome': 'UNIPRIME NORTE DO PARANÁ – COOPERATIVA DE CRÉDITO LTDA'}, {'codigo': '085', 'nome': 'Cooperativa Central de Crédito – Ailos'}, {'codigo': '088', 'nome': 'BANCO RANDON S.A.'}, {'codigo': '089', 'nome': 'CREDISAN COOPERATIVA DE CRÉDITO'}, {'codigo': '091', 'nome': 'CENTRAL DE COOPERATIVAS DE ECONOMIA E CRÉDITO MÚTUO DO ESTADO DO RIO GRANDE DO S'}, {'codigo': '092', 'nome': 'BRK S.A. Crédito, Financiamento e Investimento'}, {'codigo': '093', 'nome': 'PÓLOCRED   SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORT'}, {'codigo': '094', 'nome': 'Banco Finaxis S.A.'}, {'codigo': '095', 'nome': 'Travelex Banco de Câmbio S.A.'}, {'codigo': '096', 'nome': 'Banco B3 S.A.'}, {'codigo': '097', 'nome': 'Credisis – Central de Cooperativas de Crédito Ltda.'}, {'codigo': '098', 'nome': 'Credialiança Cooperativa de Crédito Rural'}, {'codigo': '099', 'nome': 'UNIPRIME CENTRAL – CENTRAL INTERESTADUAL DE COOPERATIVAS DE CREDITO LTDA.'}, {'codigo': '100', 'nome': 'Planner Corretora de Valores S.A.'}, {'codigo': '101', 'nome': 'RENASCENCA DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '102', 'nome': 'XP INVESTIMENTOS CORRETORA DE CÂMBIO,TÍTULOS E VALORES MOBILIÁRIOS S/A'}, {'codigo': '105', 'nome': 'Lecca Crédito, Financiamento e Investimento S/A'}, {'codigo': '107', 'nome': 'Banco Bocom BBM S.A.'}, {'codigo': '108', 'nome': 'PORTOCRED S.A. – CREDITO, FINANCIAMENTO E INVESTIMENTO'}, {'codigo': '111', 'nome': 'OLIVEIRA TRUST DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIARIOS S.A.'}, {'codigo': '113', 'nome': 'Magliano S.A. Corretora de Cambio e Valores Mobiliarios'}, {'codigo': '114', 'nome': 'Central Cooperativa de Crédito no Estado do Espírito Santo – CECOOP'}, {'codigo': '117', 'nome': 'ADVANCED CORRETORA DE CÂMBIO LTDA'}, {'codigo': '119', 'nome': 'Banco Western Union do Brasil S.A.'}, {'codigo': '120', 'nome': 'BANCO RODOBENS S.A.'}, {'codigo': '121', 'nome': 'Banco Agibank S.A.'}, {'codigo': '122', 'nome': 'Banco Bradesco BERJ S.A.'}, {'codigo': '124', 'nome': 'Banco Woori Bank do Brasil S.A.'}, {'codigo': '125', 'nome': 'Plural S.A. Banco Múltiplo'}, {'codigo': '126', 'nome': 'BR Partners Banco de Investimento S.A.'}, {'codigo': '127', 'nome': 'Codepe Corretora de Valores e Câmbio S.A.'}, {'codigo': '128', 'nome': 'MS Bank S.A. Banco de Câmbio'}, {'codigo': '129', 'nome': 'UBS Brasil Banco de Investimento S.A.'}, {'codigo': '130', 'nome': 'CARUANA S.A. – SOCIEDADE DE CRÉDITO, FINANCIAMENTO E INVESTIMENTO'}, {'codigo': '131', 'nome': 'TULLETT PREBON BRASIL CORRETORA DE VALORES E CÂMBIO LTDA'}, {'codigo': '132', 'nome': 'ICBC do Brasil Banco Múltiplo S.A.'}, {'codigo': '133', 'nome': 'CONFEDERAÇÃO NACIONAL DAS COOPERATIVAS CENTRAIS DE CRÉDITO E ECONOMIA FAMILIAR E'}, {'codigo': '134', 'nome': 'BGC LIQUIDEZ DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '136', 'nome': 'CONFEDERAÇÃO NACIONAL DAS COOPERATIVAS CENTRAIS UNICRED LTDA. – UNICRED DO BRASI'}, {'codigo': '138', 'nome': 'Get Money Corretora de Câmbio S.A.'}, {'codigo': '139', 'nome': 'Intesa Sanpaolo Brasil S.A. – Banco Múltiplo'}, {'codigo': '140', 'nome': 'Easynvest – Título Corretora de Valores SA'}, {'codigo': '142', 'nome': 'Broker Brasil Corretora de Câmbio Ltda.'}, {'codigo': '143', 'nome': 'Treviso Corretora de Câmbio S.A.'}, {'codigo': '144', 'nome': 'BEXS BANCO DE CÂMBIO S/A'}, {'codigo': '145', 'nome': 'LEVYCAM – CORRETORA DE CAMBIO E VALORES LTDA.'}, {'codigo': '146', 'nome': 'GUITTA CORRETORA DE CAMBIO LTDA.'}, {'codigo': '149', 'nome': 'Facta Financeira S.A. – Crédito Financiamento e Investimento'}, {'codigo': '157', 'nome': 'ICAP do Brasil Corretora de Títulos e Valores Mobiliários Ltda.'}, {'codigo': '159', 'nome': 'Casa do Crédito S.A. Sociedade de Crédito ao Microempreendedor'}, {'codigo': '163', 'nome': 'Commerzbank Brasil S.A. – Banco Múltiplo'}, {'codigo': '169', 'nome': 'BANCO OLÉ CONSIGNADO S.A.'}, {'codigo': '173', 'nome': 'BRL Trust Distribuidora de Títulos e Valores Mobiliários S.A.'}, {'codigo': '174', 'nome': 'PEFISA S.A. – CRÉDITO, FINANCIAMENTO E INVESTIMENTO'}, {'codigo': '177', 'nome': 'Guide Investimentos S.A. Corretora de Valores'}, {'codigo': '180', 'nome': 'CM CAPITAL MARKETS CORRETORA DE CÂMBIO, TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '183', 'nome': 'SOCRED S.A. – SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO P'}, {'codigo': '184', 'nome': 'Banco Itaú BBA S.A.'}, {'codigo': '188', 'nome': 'ATIVA INVESTIMENTOS S.A. CORRETORA DE TÍTULOS, CÂMBIO E VALORES'}, {'codigo': '189', 'nome': 'HS FINANCEIRA S/A CREDITO, FINANCIAMENTO E INVESTIMENTOS'}, {'codigo': '190', 'nome': 'SERVICOOP – COOPERATIVA DE CRÉDITO DOS SERVIDORES PÚBLICOS ESTADUAIS DO RIO GRAN'}, {'codigo': '191', 'nome': 'Nova Futura Corretora de Títulos e Valores Mobiliários Ltda.'}, {'codigo': '194', 'nome': 'PARMETAL DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '196', 'nome': 'FAIR CORRETORA DE CAMBIO S.A.'}, {'codigo': '197', 'nome': 'Stone Pagamentos S.A.'}, {'codigo': '208', 'nome': 'Banco BTG Pactual S.A.'}, {'codigo': '212', 'nome': 'Banco Original S.A.'}, {'codigo': '213', 'nome': 'Banco Arbi S.A.'}, {'codigo': '217', 'nome': 'Banco John Deere S.A.'}, {'codigo': '218', 'nome': 'Banco BS2 S.A.'}, {'codigo': '222', 'nome': 'BANCO CRÉDIT AGRICOLE BRASIL S.A.'}, {'codigo': '224', 'nome': 'Banco Fibra S.A.'}, {'codigo': '233', 'nome': 'Banco Cifra S.A.'}, {'codigo': '241', 'nome': 'BANCO CLASSICO S.A.'}, {'codigo': '243', 'nome': 'Banco Máxima S.A.'}, {'codigo': '246', 'nome': 'Banco ABC Brasil S.A.'}, {'codigo': '249', 'nome': 'Banco Investcred Unibanco S.A.'}, {'codigo': '250', 'nome': 'BCV – BANCO DE CRÉDITO E VAREJO S.A.'}, {'codigo': '253', 'nome': 'Bexs Corretora de Câmbio S/A'}, {'codigo': '254', 'nome': 'PARANÁ BANCO S.A.'}, {'codigo': '259', 'nome': 'MONEYCORP BANCO DE CÂMBIO S.A.'}, {'codigo': '260', 'nome': 'Nu Pagamentos S.A.'}, {'codigo': '265', 'nome': 'Banco Fator S.A.'}, {'codigo': '266', 'nome': 'BANCO CEDULA S.A.'}, {'codigo': '268', 'nome': 'BARI COMPANHIA HIPOTECÁRIA'}, {'codigo': '269', 'nome': 'BANCO HSBC S.A.'}, {'codigo': '270', 'nome': 'Sagitur Corretora de Câmbio Ltda.'}, {'codigo': '271', 'nome': 'IB Corretora de Câmbio, Títulos e Valores Mobiliários S.A.'}, {'codigo': '272', 'nome': 'AGK CORRETORA DE CAMBIO S.A.'}, {'codigo': '273', 'nome': 'Cooperativa de Crédito Rural de São Miguel do Oeste – Sulcredi/São Miguel'}, {'codigo': '274', 'nome': 'MONEY PLUS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E A EMPRESA DE PEQUENO PORT'}, {'codigo': '276', 'nome': 'Senff S.A. – Crédito, Financiamento e Investimento'}, {'codigo': '278', 'nome': 'Genial Investimentos Corretora de Valores Mobiliários S.A.'}, {'codigo': '279', 'nome': 'COOPERATIVA DE CREDITO RURAL DE PRIMAVERA DO LESTE'}, {'codigo': '280', 'nome': 'Avista S.A. Crédito, Financiamento e Investimento'}, {'codigo': '281', 'nome': 'Cooperativa de Crédito Rural Coopavel'}, {'codigo': '283', 'nome': 'RB CAPITAL INVESTIMENTOS DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LIMITADA'}, {'codigo': '285', 'nome': 'Frente Corretora de Câmbio Ltda.'}, {'codigo': '286', 'nome': 'COOPERATIVA DE CRÉDITO RURAL DE OURO   SULCREDI/OURO'}, {'codigo': '288', 'nome': 'CAROL DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.'}, {'codigo': '289', 'nome': 'DECYSEO CORRETORA DE CAMBIO LTDA.'}, {'codigo': '290', 'nome': 'Pagseguro Internet S.A.'}, {'codigo': '292', 'nome': 'BS2 Distribuidora de Títulos e Valores Mobiliários S.A.'}, {'codigo': '293', 'nome': 'Lastro RDV Distribuidora de Títulos e Valores Mobiliários Ltda.'}, {'codigo': '296', 'nome': 'VISION S.A. CORRETORA DE CAMBIO'}, {'codigo': '298', 'nome': 'Vip’s Corretora de Câmbio Ltda.'}, {'codigo': '299', 'nome': 'SOROCRED   CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.'}, {'codigo': '300', 'nome': 'Banco de la Nacion Argentina'}, {'codigo': '301', 'nome': 'BPP Instituição de Pagamento S.A.'}, {'codigo': '306', 'nome': 'PORTOPAR DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.'}, {'codigo': '307', 'nome': 'Terra Investimentos Distribuidora de Títulos e Valores Mobiliários Ltda.'}, {'codigo': '309', 'nome': 'CAMBIONET CORRETORA DE CÂMBIO LTDA.'}, {'codigo': '310', 'nome': 'VORTX DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.'}, {'codigo': '311', 'nome': 'DOURADA CORRETORA'}, {'codigo': '312', 'nome': 'HSCM SCMEPP LTDA.'}, {'codigo': '313', 'nome': 'AMAZÔNIA CORRETORA DE CÂMBIO LTDA.'}, {'codigo': '315', 'nome': 'PI Distribuidora de Títulos e Valores Mobiliários S.A.'}, {'codigo': '318', 'nome': 'Banco BMG S.A.'}, {'codigo': '319', 'nome': 'OM DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '320', 'nome': 'China Construction Bank (Brasil) Banco Múltiplo S/A'}, {'codigo': '321', 'nome': 'CREFAZ SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E A EMPRESA DE PEQUENO PORTE LT'}, {'codigo': '322', 'nome': 'Cooperativa de Crédito Rural de Abelardo Luz – Sulcredi/Crediluz'}, {'codigo': '323', 'nome': 'MERCADOPAGO.COM REPRESENTACOES LTDA.'}, {'codigo': '324', 'nome': 'CARTOS SOCIEDADE DE CRÉDITO DIRETO S.A.'}, {'codigo': '325', 'nome': 'Órama Distribuidora de Títulos e Valores Mobiliários S.A.'}, {'codigo': '326', 'nome': 'PARATI – CREDITO, FINANCIAMENTO E INVESTIMENTO S.A.'}, {'codigo': '329', 'nome': 'QI Sociedade de Crédito Direto S.A.'}, {'codigo': '330', 'nome': 'BANCO BARI DE INVESTIMENTOS E FINANCIAMENTOS S.A.'}, {'codigo': '331', 'nome': 'Fram Capital Distribuidora de Títulos e Valores Mobiliários S.A.'}, {'codigo': '332', 'nome': 'Acesso Soluções de Pagamento S.A.'}, {'codigo': '335', 'nome': 'Banco Digio S.A.'}, {'codigo': '336', 'nome': 'Banco C6 S.A.'}, {'codigo': '340', 'nome': 'Super Pagamentos e Administração de Meios Eletrônicos S.A.'}, {'codigo': '342', 'nome': 'Creditas Sociedade de Crédito Direto S.A.'}, {'codigo': '343', 'nome': 'FFA SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE LTDA.'}, {'codigo': '348', 'nome': 'Banco XP S.A.'}, {'codigo': '349', 'nome': 'AL5 S.A. CRÉDITO, FINANCIAMENTO E INVESTIMENTO'}, {'codigo': '350', 'nome': 'COOPERATIVA DE CRÉDITO RURAL DE PEQUENOS AGRICULTORES E DA REFORMA AGRÁRIA DO CE'}, {'codigo': '352', 'nome': 'TORO CORRETORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '354', 'nome': 'NECTON INVESTIMENTOS  S.A. CORRETORA DE VALORES MOBILIÁRIOS E COMMODITIES'}, {'codigo': '355', 'nome': 'ÓTIMO SOCIEDADE DE CRÉDITO DIRETO S.A.'}, {'codigo': '358', 'nome': 'MIDWAY S.A. - SCFI'}, {'codigo': '359', 'nome': 'ZEMA CRÉDITO, FINANCIAMENTO E INVESTIMENTO S/A'}, {'codigo': '360', 'nome': 'TRINUS CAPITAL DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.'}, {'codigo': '362', 'nome': 'CIELO S.A.'}, {'codigo': '363', 'nome': 'SOCOPA SOCIEDADE CORRETORA PAULISTA S.A.'}, {'codigo': '364', 'nome': 'GERENCIANET S.A.'}, {'codigo': '365', 'nome': 'SOLIDUS S.A. CORRETORA DE CAMBIO E VALORES MOBILIARIOS'}, {'codigo': '366', 'nome': 'BANCO SOCIETE GENERALE BRASIL S.A.'}, {'codigo': '367', 'nome': 'VITREO DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.'}, {'codigo': '368', 'nome': 'Banco CSF S.A.'}, {'codigo': '370', 'nome': 'Banco Mizuho do Brasil S.A.'}, {'codigo': '371', 'nome': 'WARREN CORRETORA DE VALORES MOBILIÁRIOS E CÂMBIO LTDA.'}, {'codigo': '373', 'nome': 'UP.P SOCIEDADE DE EMPRÉSTIMO ENTRE PESSOAS S.A.'}, {'codigo': '374', 'nome': 'REALIZE CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.'}, {'codigo': '376', 'nome': 'BANCO J.P. MORGAN S.A.'}, {'codigo': '377', 'nome': 'MS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE LTDA'}, {'codigo': '378', 'nome': 'BBC LEASING S.A. – ARRENDAMENTO MERCANTIL'}, {'codigo': '379', 'nome': 'COOPERFORTE – COOPERATIVA DE ECONOMIA E CRÉDITO MÚTUO DOS FUNCIONÁRIOS DE INSTIT'}, {'codigo': '380', 'nome': 'PICPAY SERVICOS S.A.'}, {'codigo': '381', 'nome': 'BANCO MERCEDES-BENZ DO BRASIL S.A.'}, {'codigo': '382', 'nome': 'FIDÚCIA SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE L'}, {'codigo': '383', 'nome': 'BOLETOBANCÁRIO.COM TECNOLOGIA DE PAGAMENTOS LTDA.'}, {'codigo': '384', 'nome': 'GLOBAL FINANÇAS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO'}, {'codigo': '386', 'nome': 'NU FINANCEIRA S.A. CFI'}, {'codigo': '387', 'nome': 'Banco Toyota do Brasil S.A.'}, {'codigo': '389', 'nome': 'Banco Mercantil do Brasil S.A.'}, {'codigo': '390', 'nome': 'BANCO GM S.A.'}, {'codigo': '391', 'nome': 'COOPERATIVA DE CREDITO RURAL DE IBIAM – SULCREDI/IBIAM'}, {'codigo': '393', 'nome': 'Banco Volkswagen S.A.'}, {'codigo': '394', 'nome': 'Banco Bradesco Financiamentos S.A.'}, {'codigo': '395', 'nome': 'F D GOLD DTVM LTDA'}, {'codigo': '396', 'nome': 'HUB PAGAMENTOS S.A'}, {'codigo': '397', 'nome': 'LISTO SOCIEDADE DE CREDITO DIRETO S.A.'}, {'codigo': '398', 'nome': 'IDEAL CTVM S.A.'}, {'codigo': '399', 'nome': 'Kirton Bank S.A. – Banco Múltiplo'}, {'codigo': '400', 'nome': 'CC POUP SER FIN CO'}, {'codigo': '402', 'nome': 'COBUCCIO SCD S.A.'}, {'codigo': '403', 'nome': 'CORA SOCIEDADE DE CRÉDITO DIRETO S.A.'}, {'codigo': '404', 'nome': 'SUMUP SOCIEDADE DE CRÉDITO DIRETO S.A.'}, {'codigo': '406', 'nome': 'ACCREDITO SCD S.A.'}, {'codigo': '407', 'nome': 'ÍNDIGO INVESTIMENTOS DTVM LTDA.'}, {'codigo': '408', 'nome': 'BÔNUSCRED SOCIEDADE DE CRÉDITO DIRETO S.A.'}, {'codigo': '410', 'nome': 'PLANNER SCM S.A.'}, {'codigo': '411', 'nome': 'VIA CERTA FINANCIADORA S.A. - CFI'}, {'codigo': '412', 'nome': 'BANCO CAPITAL S.A.'}, {'codigo': '419', 'nome': 'NUMBRS SCD S.A.'}, {'codigo': '422', 'nome': 'Banco Safra S.A.'}, {'codigo': '456', 'nome': 'Banco MUFG Brasil S.A.'}, {'codigo': '464', 'nome': 'Banco Sumitomo Mitsui Brasileiro S.A.'}, {'codigo': '473', 'nome': 'Banco Caixa Geral – Brasil S.A.'}, {'codigo': '477', 'nome': 'Citibank N.A.'}, {'codigo': '479', 'nome': 'Banco ItauBank S.A.'}, {'codigo': '487', 'nome': 'DEUTSCHE BANK S.A. – BANCO ALEMAO'}, {'codigo': '488', 'nome': 'JPMorgan Chase Bank, National Association'}, {'codigo': '492', 'nome': 'ING Bank N.V.'}, {'codigo': '495', 'nome': 'Banco de La Provincia de Buenos Aires'}, {'codigo': '505', 'nome': 'Banco Credit Suisse (Brasil) S.A.'}, {'codigo': '545', 'nome': 'SENSO CORRETORA DE CAMBIO E VALORES MOBILIARIOS S.A'}, {'codigo': '600', 'nome': 'Banco Luso Brasileiro S.A.'}, {'codigo': '604', 'nome': 'Banco Industrial do Brasil S.A.'}, {'codigo': '610', 'nome': 'Banco VR S.A.'}, {'codigo': '611', 'nome': 'Banco Paulista S.A.'}, {'codigo': '612', 'nome': 'Banco Guanabara S.A.'}, {'codigo': '613', 'nome': 'Omni Banco S.A.'}, {'codigo': '623', 'nome': 'Banco Pan S.A.'}, {'codigo': '626', 'nome': 'BANCO C6 CONSIGNADO S.A.'}, {'codigo': '630', 'nome': 'Banco Smartbank S.A.'}, {'codigo': '633', 'nome': 'Banco Rendimento S.A.'}, {'codigo': '634', 'nome': 'BANCO TRIANGULO S.A.'}, {'codigo': '637', 'nome': 'BANCO SOFISA S.A.'}, {'codigo': '643', 'nome': 'Banco Pine S.A.'}, {'codigo': '652', 'nome': 'Itaú Unibanco Holding S.A.'}, {'codigo': '653', 'nome': 'BANCO INDUSVAL S.A.'}, {'codigo': '654', 'nome': 'BANCO DIGIMAIS S.A.'}, {'codigo': '655', 'nome': 'Banco Votorantim S.A.'}, {'codigo': '707', 'nome': 'Banco Daycoval S.A.'}, {'codigo': '712', 'nome': 'Banco Ourinvest S.A.'}, {'codigo': '720', 'nome': 'BCO RNX S.A.'}, {'codigo': '739', 'nome': 'Banco Cetelem S.A.'}, {'codigo': '741', 'nome': 'BANCO RIBEIRAO PRETO S.A.'}, {'codigo': '743', 'nome': 'Banco Semear S.A.'}, {'codigo': '745', 'nome': 'Banco Citibank S.A.', 'caracteresConta': 8, 'digitoAgencia': false}, {'codigo': '746', 'nome': 'Banco Modal S.A.'}, {'codigo': '747', 'nome': 'Banco Rabobank International Brasil S.A.'}, {'codigo': '748', 'nome': 'BANCO COOPERATIVO SICREDI S.A.'}, {'codigo': '751', 'nome': 'Scotiabank Brasil S.A. Banco Múltiplo'}, {'codigo': '752', 'nome': 'Banco BNP Paribas Brasil S.A.'}, {'codigo': '753', 'nome': 'Novo Banco Continental S.A. – Banco Múltiplo'}, {'codigo': '754', 'nome': 'Banco Sistema S.A.'}, {'codigo': '755', 'nome': 'Bank of America Merrill Lynch Banco Múltiplo S.A.'}, {'codigo': '756', 'nome': 'BANCO COOPERATIVO DO BRASIL S.A. – BANCOOB'}, {'codigo': '757', 'nome': 'BANCO KEB HANA DO BRASIL S.A.'}],
        listaFormasPagamento: [{'CodFpg': '1', 'DesFpg': 'Dinheiro'}, {'CodFpg': '2', 'DesFpg': 'Crédito Conta Beneficiário'}, {'CodFpg': '3', 'DesFpg': 'Crédito Conta Fornecedor'}, {'CodFpg': '4', 'DesFpg': 'Docum. Código de Barras'}, {'CodFpg': '5', 'DesFpg': 'DDA - Débito direto autorizado'}, {'CodFpg': '6', 'DesFpg': 'Recibo/Orpag'}, {'CodFpg': '7', 'DesFpg': 'Em teste Pgto TED e DOC'}],
        listaSuportes: [],
        formasPagamentoPorProcesso: {'PAGAMENTO': ['3', '4'], 'PRESTACAO_DE_CONTAS': ['2'], 'CONTRAPARTIDA': ['1'], 'RESSARCIMENTO': ['3']},
        bancoSelecionado: null,
        tiposConta: [{'codigo': 1, 'tipo': 'Conta Corrente'}, {'codigo': 2, 'tipo': 'Conta Poupança'}],
        tipoContaSelecionado: {'codigo': 1, 'tipo': 'Conta Corrente'}, // pré-selecionar o tipo de conta 1
        motivosDevolucao: [],
        // motivosDevolucao: [{'codigo': '', 'descricao': 'Limpar dados do motivo de devolução'}, {'codigo': 'SEM_DOCUMENTO', 'descricao': 'Ausência de documento - documento fiscal / holerite / ofício'}, {'codigo': 'SEM_DOCUMENTO_OBRA_CIVIL', 'descricao': 'Ausência ou divergência de documentos de obra civil (termo de medição, contrato, ART ou RRT)'}, {'codigo': 'SEM_NUMERO_BNDES', 'descricao': 'Ausência ou divergência do número do acordo BNDES'}, {'codigo': 'CADASTRO_DESATUALIZADO', 'descricao': 'Cadastro desatualizado'}, {'codigo': 'COMPROVANTE_INVALIDO', 'descricao': 'Comprovante de pagamento ausente, divergente ou ilegível'}, {'codigo': 'DADOS_BANCARIOS_INVALIDOS', 'descricao': 'Dados bancários incorretos'}, {'codigo': 'FORNECEDOR_INVALIDO', 'descricao': 'Dados do fornecedor incorretos'}, {'codigo': 'DOCUMENTO_ILEGIVEL', 'descricao': 'Documento fiscal ilegível ou divergente'}, {'codigo': 'OCORRENCIA_IMPEDITIVA', 'descricao': 'Existência de ocorrência impeditiva'}, {'codigo': 'ITENS_DIVERGENTES_CRONOGRAMA', 'descricao': 'Itens da nota fiscal divergentes do cronograma físico-financeiro'}, {'codigo': 'PENDENCIA_PRESTACAO_CONTAS', 'descricao': 'Pendência de prestação de contas'}, {'codigo': 'RECOLHIMENTO_AUSENTE', 'descricao': 'Recolhimento de tributos ausente ou divergente'}, {'codigo': 'OUTROS', 'descricao': 'Outros'}],
        motivoDevolucao: null,
        //
        mostrarIncluindoConta: false,
        //
        adiantamentosConcecidos: [],
        //
        dadosBancariosFornecedores: [],
        // Demanda 66430 Correção de múltiplos clicks no botão de concluir
        wait: false,
        botao_concluir_disabled: false,
        tipoDocumento: 'boleto',
        possuiNotaSapiens: null,
        table: {
          items: this.entDirigentes,
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          perPage: 50,
          fields: [
            {key: 'ds_nome', label: 'Nome', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
            {key: 'dt_inicio_mandato', label: 'Inicio do mandato', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
            {key: 'dt_fim_mandato', label: 'Vigência do mandato', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
            {key: 'bt_ativo', label: 'Ativo', thStyle: 'text-align: center; width: 13%', class: 'text-center'},
            { key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 13%', class: 'text-center' }
          ]
        },
        tituloMovimentado: null,
        valorOriginal: null,
        confirmaValorOriginalDiferente: null
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    watch: {
      loading: {
        deep: true,
        handler (carregando) {
          if (carregando.tela) {
            this.botao_concluir_disabled = true
          }
          if (!carregando.tela) {
            setTimeout(() => { if (!this.loading.tela) this.botao_concluir_disabled = false }, 5000)
          }
        }
      },
      adiantamentosFiltrosSelecionados () {
        if (this.adiantamentosConcecidos.length > 0) {
          this.filtrarAdiantamentosConcedidos()
          this.calcularTotaisAdiantamento()
        }
      }
    },
    mounted () {
      if (this.$route.params.id) {
        this.verificaChamado()
      }
      if (this.ehVisualizacao) {
        this.restricaoParaInicializar = []
      }
    },
    created () {
      let vm = this
      console.clear()
      this.verificaPoderes()
      this.data_edicao = moment().format('YYYY-MM-DD HH:mm:ss')
      this.processo = this.$route.path.indexOf('prestacaocontas') >= 0 ? 'PRESTACAO_DE_CONTAS' : this.$route.path.indexOf('contrapartida') >= 0 ? 'CONTRAPARTIDA' : this.$route.path.indexOf('ressarcimento') >= 0 ? 'RESSARCIMENTO' : 'PAGAMENTO'
      //
      if (_.has(this.$route.params, 'visualizacao')) {
        this.ehVisualizacao = this.$route.params.visualizacao
      }
      //
      // Para contrapartidas não há a opção de NF-e
      if (this.processo === 'CONTRAPARTIDA') {
        this.ehNFe = false
      }
      this.listaFormasPagamento = _.filter(this.listaFormasPagamento, function (f) { return _.includes(vm.formasPagamentoPorProcesso[vm.processo], f.CodFpg) })
      this.nota.forma_pagamento = this.listaFormasPagamento.length === 1 ? this.listaFormasPagamento[0]['CodFpg'] : null
      if (_.has(this.$route.params, 'id')) {
        // Se trata de uma edição pois é passado um id
        this.id = this.$route.params.id
        this.buscaPrestacaoSimplificada()
        this.buscaDados()
      } else {
        if (_.isEmpty(this.listaProjetos)) { // TODO usar o store para agilizar esata lista. Usar com time de 12 horas
          console.log('Carregar lista de projeto')
          console.log('tarefa:', this.ultimaTarefaFeita)
          this.carregarListaProjetos()
        }
      }
    },
    methods: {
      // Demanda 64547 e 64530: A solicitação deve ser feita apenas para um tipo de Recurso
      // Demanda 64547: Adição de filtro por Fundação e P. Estratégico
      filtrarPorOrigemRecurso (origem) { // origem pode ser 'fundacao', 'parceiro'
        _.pull(this.extratoFiltrosSelecionados, 'fundacao', 'parceiro')
        _.uniq(this.extratoFiltrosSelecionados.push(origem))
        this.filtrarExtrato()
        this.calcularTotaisExtato()
      },
      selecionaBanco (banco) {
        this.nota.dados_bancarios.banco = banco.codigo
        if (_.has(this.nota, 'favorecido')) {
          this.nota.favorecido.codban = banco.codigo
        }
        this.$forceUpdate()
      },
      bancoNome (option) {
        return `${option.codigo + ' - ' + option.nome}`
      },
      selecionaTipoConta (tipoSelecionado) {
        this.nota.dados_bancarios.tipo = tipoSelecionado.codigo
        this.$forceUpdate()
      },
      tipoContaNome (option) {
        return `${option.codigo + ' - ' + option.tipo}`
      },
      suporteNome (option) {
        return `${option.numero + ' - ' + option.problema}`
      },

      selecionaDadosBancariosFavorecido (item) {
        this.nota.dados_bancarios.banco = item ? item.codban : ''
        this.nota.dados_bancarios.agencia = item ? item.codage : ''
        this.nota.dados_bancarios.conta = item ? item.ccbfav : ''
        this.nota.dados_bancarios.tipo = item ? item.tiptcc : 1
        this.bancoSelecionado = item ? _.filter(this.listaBancos, ['codigo', this.nota.dados_bancarios.banco])[0] : null
        this.tipoContaSelecionado = item ? _.filter(this.tiposConta, ['codigo', this.nota.dados_bancarios.tipo])[0] : null
        this.$forceUpdate()
      },
      motivoDevolucaoDescricao (option) {
        return `${option.descricao}`
      },
      verificaPoderes () {
        axiosLaravel.get('entidades/verificaPoderes/' + this.usuarioLogado.id).then(async (response) => {
          if (_.has(response.data, 'codigo')) {
            this.poderes = response.data
          }
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      carregaMunicipios () {
        this.loading.municipios = true
        let listaMunicipios = []
        axiosLaravel.get('consulta/municipios/').then((response) => {
          let listaAgrupada = _.groupBy(response.data, 'sigufs')
          _.forEach(listaAgrupada, function (municipios, uf) {
            listaMunicipios.push({'uf': uf, 'municipios': municipios})
          })
          this.municipiosUf = _.sortBy(listaMunicipios, ['uf'])
          this.loading.municipios = false
        })
      },
      buscaPrestacaoSimplificada () {
        // Verifica se é uma prestação simplificada
        this.loading.tela = true
        console.log('buscaPrestacaoSimplificada')
        axiosLaravel.get('prestacaoSimplificada/ehPrestacaoSimplificada/' + this.id).then((response) => {
          this.ehPrestacaoSimplificada = response.data
        })
      },
      buscaDados () {
        console.log('buscaDados')
        this.loading.tela = true
        // Carregando dados da ultima tarefa necessários aos carregamento do Cronograma
        axiosLaravel.get('pagamento/ultima/tarefa/' + this.id).then((response) => {
          this.id_entidade = response.data[0]['id_entidade']
          this.razaoSocial = response.data[0]['ds_razao_social']
          this.projeto.Id_proposta = response.data[0]['id_projeto']
          this.projeto.Projeto = response.data[0]['projeto']
          this.projeto.Objetivo = response.data[0]['objetivo_geral']
          this.projeto.Status_ERP = response.data[0]['situacao_projeto_sapiens']
          this.ehVoluntariado = _.includes(['15577'], ('' + response.data[0]['projeto_superior_sapiens']))
          this.projetoSuperior = response.data[0]['ds_projetoSuperior']
          this.projeto.fk_entidade = response.data[0]['id_entidade']
          this.entidade['ds_cnpj'] = response.data[0]['ds_cnpj']
          this.projeto.Numero_projeto = _.has(this.projeto, 'Numero_projeto') ? this.projeto['Numero_projeto'] : this.projeto.Projeto.substring(0, 5)
          this.nota.id = response.data[0]['id_documento_liberacao']
          this.extratoFiltrosSelecionados.push('solicitados')
          this.dirigentes = response.data['dirigentes']
          this.buscaOcorrencias()
          this.carregarCronograma()
          if (this.processo === 'PRESTACAO_DE_CONTAS') {
            this.carregarPrestacaoAdiantamento()
          }
          this.buscaMotivosDevolucao()
          // 65931 - Aprimora controle de projetos municipalizados
          this.verificaMunicipalizacao()
          // Pega dados da entidade
          axiosLaravel.post('pagamento/valida/solicitante', {'projeto': this.projeto, 'processo': this.processo}).then((response) => {
            if (_.get(response.data, 'codigo', 'ERRO') !== 'ERRO') {
              this.entidade = response.data.retorno
            }
          })
            .catch((error) => {
              console.log('error', error)
              this.$root.trataErro(error)
            })
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
        // Em paralelo, carregando dados do processo com todas as informações da NF
        axiosLaravel.get('processos/' + this.id).then((response) => {
          this.dataProcesso = moment(response.data.inicio).format('DD/MM/YYYY')
          if (moment(this.dataProcesso).isSameOrBefore(moment(this.dataCorte))) {
            this.dataMenor = true
          } else {
            this.dataMenor = false
          }
          //
          // TODO dataMenor
          this.historico = response.data.tarefas
          this.historicoTarefas = _.cloneDeep(response.data.tarefas)
          this.historicoTarefasTela = _.cloneDeep(response.data.tarefas)
          let array = this.historicoTarefas.filter((item) => {
            return item.tipo === 'Usuário' && !_.isNull(item.termino)
          })
          this.historicoTarefas = _.cloneDeep(array)
          for (let i = 0; i < this.historicoTarefas.length; i++) {
            if (this.historicoTarefas.usuario !== null) {
              this.usuario = this.historicoTarefas.usuario
            }
          }
          //
          this.ultimaTarefaFeita = _.chain(_.cloneDeep(this.historico)).filter(function (h) { return h.tipo === 'Usuário' && !_.isNull(h.termino) }).sortBy('id').last().value()
          //
          this.valorOriginal = response.data.valorOriginal
          this.buscaHistorico(this.id)
          //
          this.etapa = _.chain(_.cloneDeep(this.historico)).remove(['tipo', 'Usuário']).sortBy('id').last().get('nome').value()
          this.validacao = response.data.documentos_liberacao[0]
          this.validacao.processo = _.omit(response.data, ['documentos_liberacao', 'tarefas'])
          //
          this.possuiNotaSapiens = response.data.possuiNotaSapiens
          this.tituloMovimentado = response.data.tituloMovimentado
          this.nota.bypass = this.carregarParametrosDocumento(this.validacao.parametros_documento, ['OPCOES', 'BYPASS'])
          this.nota.tributacao = this.carregarParametrosDocumento(this.validacao.parametros_documento, ['TRIBUTACAO'])
          this.nota.tributacao = this.nota.tributacao === '' ? 'NAO_TRIBUTADO' : this.nota.tributacao
          this.nota.valorTributado = parseFloat(this.carregarParametrosDocumento(this.validacao.parametros_documento, ['VALOR_TRIBUTADO']))
          if (this.carregarParametrosDocumento(this.validacao.parametros_documento, ['BOLETO']) !== '') {
            this.nota.boleto = JSON.parse(this.carregarParametrosDocumento(this.validacao.parametros_documento, ['BOLETO']))
          }
          this.cienteDeclaracoes = JSON.parse(this.carregarParametrosDocumento(this.validacao.parametros_documento, ['DECLARACOES']))
          if (_.includes(['PRESTACAO_DE_CONTAS'], this.processo) && this.ehVoluntariado) {
            if (this.nota.codigoFornecedor !== '') {
              this.verificaCpfCnpjSapiens(this.entidade.ds_cnpj)
            }
          }
          //
          if (this.ehProjetoEspecial) {
            let dados = this.carregarParametrosDocumento(this.validacao.parametros_documento, ['DADOS_COMPLEMENTARES'])
            this.nota.dadosComplementares = (dados === '' || _.isNull(dados)) ? [] : JSON.parse(dados)
          }
          if (this.processo === 'RESSARCIMENTO') {
            let favorecido = this.carregarParametrosDocumento(this.validacao.parametros_documento, ['FAVORECIDO'])
            // Verifica se os dados do favorecido estão no parametro do documento ou senão deve buscar dadosFavorecido de novo
            if (favorecido === '' || _.isNull(favorecido)) {
              this.dadosFavorecido({'tipo': 'porIdProcesso', 'termo': this.id})
            } else {
              let favorecidoJson = JSON.parse(favorecido)
              if (_.has(favorecidoJson, 'codfav') || _.has(favorecidoJson, 'resultado')) {
                this.nota.favorecido = favorecidoJson
                this.nota.favorecido.incluidos = []
                this.nota.favorecido.excluidos = []
                this.nota.favorecido['dadosBancariosSelecionadosAnterior'] = _.clone(this.nota.favorecido.dadosBancariosSelecionados) // Simples cópia só para verificar na gravação se foi selecionado outro dado bancário diferente do informado pela entidade
                this.validacao.dados_bancarios.banco = this.nota.favorecido.dadosBancariosSelecionados.codban
                this.validacao.dados_bancarios.agencia = this.nota.favorecido.dadosBancariosSelecionados.codage
                this.validacao.dados_bancarios.conta = this.nota.favorecido.dadosBancariosSelecionados.ccbfav
                this.validacao.dados_bancarios.tipo = this.nota.favorecido.dadosBancariosSelecionados.tiptcc
                this.opcoesContasExistentesFavorecido = this.nota.favorecido.resultado
              } else {
                this.dadosFavorecido({'tipo': 'porIdProcesso', 'termo': this.id})
              }
            }
            this.nota.tributacao = 'NAO_TRIBUTADO'
          }
          //
          let nfes = _.filter(this.validacao.parametros_documento, ['parametro', 'NFe'])
          this.ehNFe = nfes.length > 0 // Se houver NF-e
          if (this.ehNFe) {
            this.nfe = JSON.parse((_.last(_.sortBy(nfes, ['created_at'])))['valor']) // Pega a última se houver mais de uma NF-e registrada
          }
          //
          this.nota.anexos = this.validacao.documentos
          this.nota.numeroNota = this.validacao.numero
          this.nota.serieNota = this.validacao.serie
          this.nota.dataInclusao = this.validacao.emissao
          this.nota.dataValidade = this.validacao.validade
          if (this.processo !== 'CONTRAPARTIDA') {
            this.bancoSelecionado = _.filter(this.listaBancos, ['codigo', this.validacao.dados_bancarios.banco])[0]
            this.nota.dados_bancarios.banco = this.validacao.dados_bancarios.banco
            this.nota.dados_bancarios.agencia = this.validacao.dados_bancarios.agencia
            this.nota.dados_bancarios.conta = this.validacao.dados_bancarios.conta
            this.nota.dados_bancarios.tipo = this.validacao.dados_bancarios.tipo
            this.tipoContaSelecionado = _.filter(this.tiposConta, ['codigo', this.nota.dados_bancarios.tipo])[0]
            let fornecedor = this.validacao.dados_bancarios.fornecedor
            this.nota.tipoFornecedor = (fornecedor.identificador.length === 14 ? 'Pessoa Jurídica' : 'Pessoa Física')
            this.nota.cpfFornecedor = (this.nota.tipoFornecedor === 'Pessoa Física' ? fornecedor.identificador : '')
            this.nota.cnpjFornecedor = (this.nota.tipoFornecedor === 'Pessoa Jurídica' ? fornecedor.identificador : '')
            this.nota.nomeFornecedor = (fornecedor.nome)
            this.nota.enderecoFornecedor = (fornecedor.endereco)
            this.nota.cepFornecedor = (fornecedor.cep)
            this.verificaCpfCnpjSapiens(fornecedor.identificador)
            this.procurandoCidadeUF()
            this.nota.forma_pagamento = this.validacao.forma_pagamento
            this.nota.pagamentoPrioritario = this.validacao.prioridade
            if (_.includes(['Análise', 'Análise Tributária', 'Autorização', 'Liquidação'], this.etapa)) {
              this.dadosAnaliseTributaria()
              this.carregarSuportesFbb()
            }
          } else { // Se o processo for Contrapartida
            if (_.includes(['Análise'], this.etapa)) {
              this.carregarSuportesFbb()
            }
          }
          //
          this.$forceUpdate()
          this.loading.tela = false
          this.periodoExecucao()
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
        //
      },
      // 65931 - Aprimora controle de projetos municipalizados
      verificaMunicipalizacao () {
        axiosLaravel.get('propostas/verifica_projeto_municipalizado/' + this.projeto.Id_proposta).then((response) => {
          this.ehProjetoEspecial = !!response.data
          if (this.ehProjetoEspecial) {
            this.carregaMunicipios()
          }
          return !!response.data // !! é casting para booleano
        })
      },
      verificaProjetoPovosTradicionais () {
        const numeroProj = Number(this.projeto.Numero_projeto)
        this.ehProjetosPovosTradicionais = this.projetosPovosTradicionais.includes(numeroProj)
        if (this.ehProjetosPovosTradicionais) {
          this.ciente('fornecedoresNaoLigadosDirigentes')
          this.ciente('recursosNaoDestinadosDirigentesParentes')
        }
        console.log('tradicional', this.ehProjetosPovosTradicionais)
      },
      periodoExecucao () {
        axiosLaravel.get('propostas/' + this.projeto.Id_proposta + '/periodo_execucao_sapiens').then(response => {
          let datetimeInicial = new Date(response.data.data_inicio_sapiens)
          let datetimeFim = new Date(response.data.data_final_sapiens)
          this.dataFinalConvenio = new Date(response.data.data_fim_convenio)
          this.projeto.data_inicial_formatada = datetimeInicial.toLocaleDateString('pt-BR')
          this.projeto.data_final_formatada = datetimeFim.toLocaleDateString('pt-BR')
          this.projeto.dateInicioSapiens = datetimeInicial.setDate(datetimeInicial.getDate() - 1)
          this.projeto.dateFimSapiens = new Date(response.data.data_final_sapiens)
          this.projeto.dateAprovacao = new Date(response.data.data_aprovacao)
          this.ehVoluntariado = _.includes(['15577'], ('' + response.data.projeto_superior))
        })
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
      carregarSuportesFbb () {
        this.loading.suportesFbbAtivos = true
        // Verifica se há suportes já gravados no objeto e lança eles nos suportes vinculado a nota
        let suportes = this.carregarParametrosDocumento(this.validacao.parametros_documento, ['SUPORTE_FBB'])
        // this.nota.suporteFbb = (suportes !== '' || !_.isNull(suportes)) ? JSON.parse(suportes) : []
        this.nota.suporteFbb = this.jsonValido(suportes) || []
        // Se for visualização não precisa pesquisar lista de suportes ativos que será o que já tiver de suporte vinculado ou nada
        if (this.ehVisualizacao) {
          this.listaSuportes = _.cloneDeep(this.nota.suporteFbb)
        } else {
          // Se estiver em curso deve procurar os ativos para montar a lista
          axiosLaravel.get('pagamento/suportes/ativos').then((response) => {
            // A lista terá os suporte ativos e merge com os já vinculados ao chamado deixando eles pré-selecionados
            this.listaSuportes = _.union(_.isNull(response.data.retorno) ? [] : response.data.retorno, this.nota.suporteFbb)
            if (response.data.codigo === 'ERRO') {
              this.$snotify.error(response.data.mensagem)
            }
            this.loading.suportesFbbAtivos = false
          })
            .catch((error) => {
              this.loading.suportesFbbAtivos = false
              console.log('error de carregamento de suportes', error)
            })
        }
      },
      buscaMotivosDevolucao () {
        axiosLaravel.post('motivos/ativos').then((response) => {
          this.motivosDevolucao = response.data
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      buscaHistorico (request) {
        axiosLaravel.post('historico-tarefas/lista', {'parametro': request}).then((response) => {
          this.historicoBack = response.data
          let tar = _.find(this.historico, {nome: 'Solicitação'})
          if (!_.isEmpty(this.historicoBack) && !_.find(this.historicoBack, {nome: 'SOLICITACAO'})) {
            if (tar.nome === 'Solicitação' && this.dataMenor === false) {
              this.historicoBack.push({
                fk_processo: tar.fk_processo,
                fk_tarefa: tar.id,
                fk_usuario: tar.fk_usuario,
                nome: 'SOLICITACAO',
                proxima_etapa: '',
                usuario: tar.usuario,
                data_edicao: null,
                inicio: tar.inicio,
                termino: tar.termino,
                observacao: tar.observacao
              })
            }
          }
          // Remove quando tem inconsistência de já estar em REVISAO e a proxima etapa Revisão
          let tar2 = _.find(this.historicoBack, {nome: 'REVISAO', proxima_etapa: 'Revisão'})
          let index = _.findIndex(this.historicoBack, { id: tar2.id })
          this.historicoBack.splice(index, 1)
        })
      },
      consultaProjetosEmAlteracao () {
        console.log('consultando se o projeto possui alteração em andamento', this.projeto.Numero_projeto)
        axiosLaravel.get('projeto/alteracoes/verificaAlteracaoEmAndamento/' + this.projeto.Numero_projeto).then((response) => {
          console.log(response.data)
          this.projetoComAlteracaoEmAndamento = response.data.alteracao_em_andamento
          if (this.projetoComAlteracaoEmAndamento === true) {
            console.log('erro, projeto com alteração em andamento')
            this.adicionaRestricao({'tag': 'projetoComAlteracaoEmAndamento', 'ativo': true, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Solicitação não disponível. Verificamos que há uma alteração de projetos em andamento.'})
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
      carregarParametrosDocumento (parametrosCarregados, parametrosBusca) {
        let parametros = _.filter(parametrosCarregados, function (p) {
          return _.includes(parametrosBusca, p.parametro) || _.includes(parametrosBusca, p.valor)
        })
        if (parametros.length > 0) {
          return _.last(_.sortBy(parametros, ['created_at']))['valor']
        } else {
          return _.includes(parametrosBusca, 'DECLARACOES') ? '[]' : ''
        }
      },
      carregarPrestacaoAdiantamento () {
        this.loading.adiantamentos = true
        axiosLaravel.get('processos/adiantamento/recursos/' + this.projeto['Id_proposta']).then((response) => {
          this.adiantamentosConcecidos = response.data.adiantamentos_concedidos.row
          this.calcularTotaisAdiantamento()
          this.$forceUpdate()
          this.loading.adiantamentos = false
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      novoDadosComplementares () {
        this.nota.dadosComplementares.push({municipio: {}, valor: 0, familias: 0, participantes: 0, destinacao: ''})
      },
      excluiDadosComplementares (index) {
        _.pullAt(this.nota.dadosComplementares, index)
        this.$forceUpdate()
      },
      limitaFaixaEntrada (tipo, valor, minimo, maximo) {
        if (_.isNil(valor) && _.isNull(valor) && _.isNaN(valor)) {
          valor = minimo
        } else {
          if (tipo === 'inteiro') {
            valor = _.toSafeInteger(('' + valor).replace(/\D+/g, ''))
          } else if (tipo === 'decimal') {
            valor = _.toNumber(('' + valor).replace(/[^.0-9]+/g, ''))
          }
          valor = valor <= minimo ? minimo : (valor >= maximo ? maximo : valor)
        }
        return tipo === 'inteiro' ? parseInt(valor) : tipo === 'decimal' ? parseFloat(valor) : valor
      },
      carregarListaProjetos () {
        this.loading.tela = true
        if (typeof Storage !== 'undefined') { // Ver se o browser suporta localStorage/sessionStorage.
          // Se sim, guardará a lista de codigos de ocorrência (raramente muda) junto com um timestamp da ultima atualizacao
          let listaProjetos = JSON.parse(window.localStorage.getItem('lista-projetos'))
          // Calcula a diferenca em dias do timestamp de agora e do que foi gravadp no storage (que se não tiver ainda considera o inicio de 2024 para forçar atualização)
          let diferenca = Math.floor((((new Date()).getTime()) / 3600000) - ((_.get(listaProjetos, 'atualizado', (new Date('2024-02-20')).getTime())) / 3600000))
          if (diferenca >= 1 || _.isEmpty(listaProjetos)) { // Se não tiver lista ou a lista estiver desatualizada (com mais de 1 dia).. atualiza ela
            axiosLaravel.post('processos/projetos', {'processo': this.processo, 'tipoBusca': 'simples'}).then((response) => {
              // Limitar acesso a projetos
              let listaProjetos = response.data
              let acessosProjetos = _.get(this.usuarioLogado, 'configuracoes.acesso_projetos')
              if (acessosProjetos) {
                let permissoesAcesso = ['INICIA_SOLICITACAO'] // A lista constará quais acessos serão permitidos para que o projeto figure na lista
                acessosProjetos = _.map(_.filter(acessosProjetos, function (p) { return _.find(p.acesso, function (a) { return _.includes(permissoesAcesso, a.codigo) }) }), 'numero')
                listaProjetos = _.filter(listaProjetos, function (p) { return _.includes(acessosProjetos, p['Numero_projeto']) })
              }
              this.listaProjetos = listaProjetos
              this.alertaRetorna()
              window.localStorage.setItem('lista-projetos', JSON.stringify({'atualizado': Math.floor((new Date()).getTime()), 'lista': this.listaProjetos}))
              this.$forceUpdate()
              this.loading.tela = false
            })
              .catch((error) => {
                console.log('error', error)
                this.$root.trataErro(error)
              })
          } else {
            this.listaProjetos = _.cloneDeep(listaProjetos.lista)
            this.alertaRetorna()
            this.loading.tela = false
          }
        }
      },
      alertaRetorna () {
        if (_.isEmpty(this.listaProjetos)) { // Se não tem projeto algum, notifica e retorna a tela anterior
          this.$snotify.error('Não há projetos para ' + this.descricaoProcesso[this.processo])
          setTimeout(() => { this.$router.go(-1) }, 1000)
        } else if (this.listaProjetos.length === 1) { // Quando somente há um projeto, pega esse projeto na lista e o seleciona para iniciar a solicitação
          this.projeto = _.head(this.listaProjetos)
          this.selecionaProjeto()
        }
      },
      verificarTitulosDisponiveisPC () {
        // Verifica se há algum titulo de adiantamento para esse projeto com transação 90530 e valor em aberto
        axiosLaravel.post('processos/verifica_titulos_adiantamento', {'numeroProjeto': this.projeto.Numero_projeto}).then((response) => {
          console.log('verificarTitulosDisponiveisPC', response.data)
          if (_.get(response.data, 'codigo', '') === 'ERRO') {
            this.adicionaRestricao({'tag': 'adiantamentoNaoDisponivelParaPrestarContas', 'ativo': true, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Ainda não há título de adiantamento disponível para prestar contas'})
          } else {
            console.log('verificarTitulosDisponiveisPC ERRO', response.data)
          }
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      selecionaProjeto () {
        this.loading.tela = true
        this.periodoExecucao()
        this.verificaMunicipalizacao()
        this.consultaProjetosEmAlteracao()
        this.verificaProjetoPovosTradicionais()
        // this.buscaDadosbancariosFornecedor()
        axiosLaravel.post('pagamento/valida/solicitante', {'projeto': this.projeto, 'processo': this.processo}).then((response) => {
          if (_.has(response.data, 'codigo')) {
            if (response.data.codigo === 'ERRO') {
              this.restricaoParaInicializar = (_.has(response.data, 'mensagem') && !_.isNull(response.data.mensagem) && response.data.mensagem.length > 0 ? response.data.mensagem : ['Erro de processamento. Não sei o que houve'])
            } else {
              this.entidade = response.data.retorno
              this.buscaOcorrencias()
              this.carregarCronograma()
              if (this.processo === 'PRESTACAO_DE_CONTAS') {
                this.carregarPrestacaoAdiantamento()
              }
              if (this.processo === 'RESSARCIMENTO') {
                // 66111 - Impedir solicitações de Ressarcimento em projetos com situação diferente de APR
                if (this.projeto.Status_ERP !== 'APR') {
                  this.bloqueiaCamposFornecedorExistente = true
                  this.ehVisualizacao = true
                  this.restricaoParaInicializar.push('Apenas projetos com Status APR estão aptos a solicitar ressarcimento.')
                }
                this.dadosFavorecido({'tipo': 'porCNPJ', 'termo': this.entidade.ds_cnpj})
              }
            }
          }
          this.loading.tela = false
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      buscaOcorrencias () {
        axiosLaravel.post('ocorrencia/busca', {'informacao': 'SIMPLIFICADO', 'projeto': this.projeto.Numero_projeto, 'nivel': [2, 3, 4], 'situacao': 'LIBERADO'}).then((response) => {
          if (_.get(response.data, 'codigo', '') === 'OK') {
            this.ocorrencias = response.data.retorno
            if (this.ocorrencias.length > 0) { // Se há ocorrências ativas para esse projeto
              this.temOcorrencia = true
              if (_.find(this.ocorrencias, function (o) { return _.includes([2201, 2202], o.codigo) }) &&
                _.includes(['PAGAMENTO', 'RESSARCIMENTO'], this.processo)) { // Se houver ocorrência 2201 ou 2202 ... só deve permitir Prestação de Contas
                this.restricaoParaInicializar.push('Possui ocorrência(s) que não permite liberar Pagamentos nem Ressarcimentos')
              }
            }
          } else {
            this.$snotify.error(response.data.mensagem)
          }
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      carregarCronograma () {
        this.loading.cronograma = true
        let idDocumento = _.has(this.nota, 'id') ? this.nota.id : 1
        axiosLaravel.post('processos/cronograma/projeto/', {'proposta': this.projeto['Id_proposta'], 'processo': this.processo, 'aglutinado': 'Completo', 'documento': idDocumento}).then((response) => {
          this.cronograma = response.data
          if (_.has(this.validacao, 'itens_liberados')) {
            this.validacao.itens_liberados.forEach((itemLiberado) => {
              this.cronograma.itens.forEach((itemOrcamento) => {
                if (itemOrcamento.Id_item === itemLiberado.itens_orcamentos[0]['id']) {
                  itemOrcamento.Qtde_saldo += itemLiberado.quantidade
                  itemOrcamento.Valor_saldo += itemLiberado.valor
                }
              })
            })
            // Inicia com filtro por Fundação ou Parc. Estrategico de acordo com os itens já solicitados (a validação traz o que foi solicitado)
            this.filtrarPorOrigemRecurso(_.some(_.flatten(_.map(_.filter(this.validacao.itens_liberados, ['tipo', 'BASE']), 'itens_orcamentos')), {'origem': 1}) ? 'fundacao' : 'parceiro')
          } else {
            // Inicia definindo filtro por Fundação ou Parc. Estrategico de acordo com os itens do cronograma
            this.filtrarPorOrigemRecurso(_.find(this.cronograma.itens, function (i) { return ('' + i.Item_Origem).substring(0, 1) === '1' }) ? 'fundacao' : 'parceiro')
          }
          //
          this.valoresProjeto() // Em todas as etapas verifica antes se há inconsistências ao carregar os valores totais do projeto
          if (_.includes(['PRESTACAO_DE_CONTAS'], this.processo) && _.includes(['Análise', 'Análise Tributária', 'Autorização', 'Liquidação'], this.etapa) && this.usuarioLogado.userType === 'FUNDACAO') {
            this.verificarTitulosDisponiveisPC()
          }
          this.loading.cronograma = false
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      valoresProjeto () {
        axiosLaravel.post('processos/valores/projeto/', {'numeroProjeto': this.projeto['Numero_projeto'], 'processo': this.processo, 'etapa': this.etapa}).then((response) => {
          console.log('valoresProjeto >>> ', response.data)
          if (_.get(response.data, 'codigo', '') === 'ERRO' && response.data.mensagem.length > 0) {
            response.data.mensagem.forEach((msg) => {
              this.adicionaRestricao({'tag': 'valoresTotaisIncorretosProjeto_' + msg.codigo, 'ativo': true, 'tipo': 'restricao', 'acao': null, 'mensagem': msg.mensagem})
            })
          }
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      filtrarExtrato () {
        let ehProjetoSemServico = this.ehProjetoComRestricaoPagamentoServico() // chamado 66.552
        // Percorrer todos os itens do cronograma
        this.cronograma.itens.forEach((item) => {
          let selecionados = 0
          // Mostrar ou não se o filtro for de 'saldo' e tiver saldo
          selecionados += _.includes(this.extratoFiltrosSelecionados, 'saldos') && _.has(item, 'Valor_saldo') && item.Valor_saldo > 0 ? 1 : 0

          // Demanda 64547: Adição de filtro por Fundação e P. Estratégico
          selecionados += _.includes(this.extratoFiltrosSelecionados, 'fundacao') && _.has(item, 'Item_Origem') && item.Item_Origem === 1 ? 1 : 0
          selecionados += _.includes(this.extratoFiltrosSelecionados, 'parceiro') && _.has(item, 'Item_Origem') && item.Item_Origem === 5 ? 1 : 0

          // Mostrar ou não se o filtro for de 'solicitados' e tiver valor e quantidade acima de zero
          selecionados += _.includes(this.extratoFiltrosSelecionados, 'solicitados') && _.has(item, 'Valor_solicitado') && item.Valor_solicitado > 0 && _.has(item, 'Qtde_solicitado') && item.Qtde_solicitado > 0 ? 1 : 0
          item['mostrar'] = this.processo === 'CONTRAPARTIDA' ? true : this.extratoFiltrosSelecionados.length === selecionados
          if (ehProjetoSemServico && item.Item_Tipo === 'SERVICO') {
            item.mostrar = false
          }
        })
      },
      filtrarAdiantamentosConcedidos () {
        this.adiantamentosConcecidos.forEach((item) => {
          let selecionados = 0
          // Mostrar ou não se o a prestação de contas de um adiantamento está pendete ou concluída
          selecionados += _.includes(this.adiantamentosFiltrosSelecionados, 'adiantamento_pendente') && item.pendente_comprovacao !== 0 ? 1 : 0
          item['mostrar'] = this.adiantamentosFiltrosSelecionados.length === selecionados
        })
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
      removeRestricao (ev) {
        _.remove(this.restricaoParaConcluir, function (i) {
          return i.tag === ev.tag
        })
      },
      selecaoEconomicidade () {
        this.verificaCorrigeDados()
      },
      verificaCorrigeDados () {
        //  Aqui será percorrido todos os itens e corrigidos campos em branco e outrs informações inconsistentes
        this.$forceUpdate()
        this.nota.itens = []
        this.cronograma.itens.forEach((item) => {
          item['valorSolicitado'] = item.Valor_solicitado
          item['quantidadeSolicitada'] = item.Qtde_solicitado
          if (parseFloat(item.Qtde_solicitado) > 0 && parseFloat(item.Valor_solicitado) > 0) {
            // TODO futuramente acrescentar verificação para Prestação de contas = adiantável
            this.nota.itens.push(item)
          }
        })
      },
      // O calcularTotaisExtato com return de multiplas variáveis economiza a quantidade de vezes que percorre o cronograma
      calcularTotaisExtato () {
        this.verificaCorrigeDados()
        let fbb = this.valorProjetoOrigem('1')
        let contrapartida = this.valorProjetoOrigem('2')
        let parceiro = this.valorProjetoOrigem('5')
        this.totais.projeto.fbb.orcado = fbb.orcado
        this.totais.projeto.fbb.solicitado = fbb.solicitado
        this.totais.projeto.fbb.saldo = fbb.saldo
        this.totais.projeto.contrapartida.orcado = contrapartida.orcado
        this.totais.projeto.contrapartida.solicitado = contrapartida.solicitado
        this.totais.projeto.contrapartida.saldo = contrapartida.saldo
        this.totais.projeto.parceiros.orcado = parceiro.orcado
        this.totais.projeto.parceiros.solicitado = parceiro.solicitado
        this.totais.projeto.parceiros.saldo = parceiro.saldo
        this.totais.projeto.total.orcado = fbb.orcado + contrapartida.orcado + parceiro.orcado
        // Demanda 64547 e 64530 solicitação de apenas uma fonte por vez
        if (this.etapa === 'Solicitação') {
          if (this.extratoFiltrosSelecionados.includes('fundacao')) {
            parceiro.solicitado = 0
            this.cronograma.itens.forEach((item) => {
              if (item.Item_Origem === 5) {
                item.Qtde_solicitado = 0
                item.Valor_solicitado = 0
              }
            })
          } else if (this.extratoFiltrosSelecionados.includes('parceiro')) {
            fbb.solicitado = 0
            this.cronograma.itens.forEach((item) => {
              if (item.Item_Origem === 1) {
                item.Qtde_solicitado = 0
                item.Valor_solicitado = 0
              }
            })
          }
        }

        this.totais.projeto.total.solicitado = fbb.solicitado + contrapartida.solicitado + parceiro.solicitado
        this.totais.projeto.total.saldo = fbb.saldo + contrapartida.saldo + parceiro.saldo
        // forçando para carregar 2 casas após a vírgula: erro de arredondamento
        this.totais.projeto.total.solicitado = Math.round(this.totais.projeto.total.solicitado * 100) / 100
        this.$forceUpdate()
      },
      calcularTotaisAdiantamento () {
        // TODO os saldos não podem considerar a própria solicitação atual
        this.totais.adiantamento.fbb.saldo = _.sumBy(this.adiantamentosConcecidos, function (i) { return i.recurso === 'FUNDACAO' ? i.pendente_comprovacao : 0 })
        this.totais.adiantamento.fbb.orcado = _.sumBy(this.adiantamentosConcecidos, function (i) { return i.recurso === 'FUNDACAO' ? i.contratado : 0 })
        this.totais.adiantamento.fbb.solicitado = _.sumBy(this.adiantamentosConcecidos, function (i) { return i.recurso === 'FUNDACAO' ? i.requisitado : 0 })
        this.totais.adiantamento.parceiros.saldo = _.sumBy(this.adiantamentosConcecidos, function (i) { return i.recurso === 'PARCEIRO_ESTRATEGICO' ? i.pendente_comprovacao : 0 })
        this.totais.adiantamento.parceiros.orcado = _.sumBy(this.adiantamentosConcecidos, function (i) { return i.recurso === 'PARCEIRO_ESTRATEGICO' ? i.contratado : 0 })
        this.totais.adiantamento.parceiros.solicitado = _.sumBy(this.adiantamentosConcecidos, function (i) { return i.recurso === 'PARCEIRO_ESTRATEGICO' ? i.requisitado : 0 })
        this.totais.adiantamento.total.solicitado = this.totais.adiantamento.fbb.solicitado + this.totais.adiantamento.parceiros.solicitado
        this.totais.adiantamento.total.orcado = this.totais.adiantamento.fbb.orcado + this.totais.adiantamento.parceiros.orcado
        this.totais.adiantamento.total.saldo = this.totais.adiantamento.fbb.saldo + this.totais.adiantamento.parceiros.saldo
        this.$forceUpdate()
        // Alterar o filtro do cronograma se não tiver limite disponível em um recurso quando se tratar de parcelas mistas na solicitação ou revisão
        if (_.includes(['Solicitação', 'Revisão'], this.etapa) && this.adiantamentosConcecidos.length !== (_.uniq(_.map(this.adiantamentosConcecidos, function (p) { return ('' + p.numeroTitulo) }))).length) {
          this.filtrarPorOrigemRecurso(this.totais.adiantamento.fbb.saldo > 0 ? 'fundacao' : 'parceiro')
        }
      },
      valorProjetoOrigem (origem) {
        let valorOrcado = 0
        let valorSolicitado = 0
        let valorSaldo = 0
        let valorAdiantavelOrcado = 0
        if (_.isEmpty(this.cronograma) || !_.has(this.cronograma, 'itens') || this.cronograma.itens.length === 0) {
          return { orcado: 0, saldo: 0, solicitado: 0, adiantavel: 0 }
        }
        this.cronograma.itens.forEach((item) => {
          if (('' + item.Item_Origem).substring(0, 1) === origem) {
            valorOrcado += parseFloat(item.Valor_orcado)
            valorSolicitado += parseFloat(item.Valor_solicitado)
            valorSaldo += parseFloat(item.Valor_saldo)
            valorAdiantavelOrcado += ('' + item.Adiantavel === '1') ? parseFloat(item.Valor_orcado) : 0
          }
        })
        return { orcado: valorOrcado, saldo: valorSaldo, solicitado: valorSolicitado, adiantavel: valorAdiantavelOrcado }
      },
      validaAjustaCodigoBarras () {
        let numeroInformadoLimpo = ('' + this.nota.boleto.numeroInformadoTela).replace(/\D+/g, '')
        if (numeroInformadoLimpo.length > 0 && ('' + this.nota.forma_pagamento) === '4') {
          let tipo = boleto.identificarTipoCodigo(numeroInformadoLimpo)
          this.errors.remove('código de barras')
          if (tipo === 'TAMANHO_INCORRETO' || !_.includes([44, 47, 48], numeroInformadoLimpo.length)) {
            this.errors.add({field: 'código de barras', msg: 'Tamanho do número incorreto!'})
          } else {
            let validacao = boleto.validarBoleto(numeroInformadoLimpo, tipo)
            if (validacao.sucesso) {
              this.nota.boleto = validacao
              _.set(this.nota.boleto, 'numeroInformadoTela', numeroInformadoLimpo)
            } else {
              let mensagem = _.capitalize(tipo.replaceAll('_', ' ')) + ' acima está incorreto!'
              this.errors.add({field: 'código de barras', msg: mensagem})
            }
          }
        }
      },
      verificaCpfCnpjSapiens (CpfCnpj) {
        if (_.isNull(CpfCnpj) || _.isEmpty(CpfCnpj) || _.isUndefined(CpfCnpj)) {
          return
        }
        if (_.isString(this.validandoCpfCnpj())) {
          // Mostrar a validação do CNPJ ou CPF
        } else {
          if ((_.toNumber(this.entidade.ds_cnpj) === _.toNumber(CpfCnpj)) && _.includes(['PAGAMENTO', 'RESSARCIMENTO'], this.processo) && _.includes(['Solicitação', 'Revisão', 'Análise'], this.etapa)) {
            let mensagem = this.processo === 'PAGAMENTO'
              ? 'O CNPJ inserido coincide com o da entidade.<br/>Se for solicitar <a href="./ressarcimento">Ressarcimento</a> favor escolher a opção correspondente em Nova Solicitação.'
              : 'O CNPJ inserido coincide com o da entidade.<br/>Favor inserir uma solicitação para cada documento conforme a numeração, CPF, CNPJ ou data.'
            this.$dialog.alert(mensagem, {html: true, animation: 'fade', customClass: 'avisoAlerta'}).then(function (dialog) {})
          }
          this.loading.tela = true
          axiosLaravel.get('consulta/busca-fornecedor/' + CpfCnpj).then((response) => {
            if ((_.includes(['Solicitação'], this.etapa)) && (!_.includes(['PRESTACAO_DE_CONTAS', 'RESSARCIMENTO'], this.processo))) {
              this.limpaDadosBancarios()
            }
            if (!_.isEmpty(response.data)) {
              this.nota.enderecoFornecedor = response.data.EndFor
              this.nota.nomeFornecedor = response.data.NomFor
              this.nota.cepFornecedor = response.data.CepFor
              this.nota.codigoFornecedor = response.data.CodFor
              this.bloqueiaCamposFornecedorExistente = true
              this.procurandoCidadeUF()
              this.buscaDadosbancariosFornecedor(CpfCnpj)
            }
            if (_.isNull(_.get(this.projeto, 'edital', null)) && this.nota.tipoFornecedor === 'Pessoa Jurídica' && ('' + this.entidade.nr_codigo_forn_erp !== '' + this.nota.codigoFornecedor) && _.includes(['Solicitação', 'Revisão'], this.etapa)) {
              this.verificaCnpjEmpresaLigada(CpfCnpj)
            }
            this.loading.tela = false
            this.$forceUpdate()
          })
            .catch((error) => {
              this.loading.tela = false
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
          // Suporte 62054 - Validação do dirigente segundo a regra 536
          if (this.nota.tipoFornecedor === 'Pessoa Física') {
            axiosLaravel.post('entidades/verificaDirigente', {'cpf': CpfCnpj, 'cnpj': this.entidade.ds_cnpj, 'projeto': this.projeto.Numero_projeto}).then((response) => {
            })
              .catch((error) => {
                this.$snotify.clear()
                this.$root.trataErro(error)
              })
          }
        }
      },
      ciente (codigo) {
        console.log('codigo: ', codigo)
        if (_.find(this.cienteDeclaracoes, ['codigo', codigo])) {
          _.remove(this.cienteDeclaracoes, ['codigo', codigo])
        } else {
          this.cienteDeclaracoes.push({'codigo': codigo, 'texto': _.get(_.find(this.declaracoes, ['codigo', codigo]), 'texto', ''), 'data': new Date(), 'usuario': {'id': this.usuarioLogado.id, 'nome': this.usuarioLogado.ds_nome_usuario}})
        }
        this.$forceUpdate()
      },
      textoDeclaracao (texto) {
        let regex = /{{(.*?)}}/g
        let correspondencias = texto.match(regex)
        correspondencias.forEach((correspondencia) => {
          let valor = _.get(this, correspondencia.replaceAll('{{', '').replaceAll('}}', ''))
          valor = _.isUndefined(valor) || _.isNull(valor) || _.isEmpty(valor) ? '' : valor
          texto = _.replace(texto, '' + correspondencia, '' + valor)
        })
        return texto
      },
      verificaCnpjEmpresaLigada (cnpj) {
        // Verificará se o CNPJ está em lista de empresas ligadas aos dirigentes da entidade parceira nos últimos 12 meses após seu desligamento, se houver
        this.loading.tela = true
        axiosLaravel.post('consulta/empresas-ligadas', {'id': this.projeto.fk_entidade, 'cnpj': cnpj}).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            let qtdeDirigentesEmpresasLigadas = response.data.retorno
            this.errors.remove('cnpj vinculado a dirigente')
            if (qtdeDirigentesEmpresasLigadas > 0) {
              this.errors.add({field: 'cnpj vinculado a dirigente', rule: 'cnpj_empresa_ligada', msg: 'Não pode usar esse CNPJ, pois esta vinculado a ' + (qtdeDirigentesEmpresasLigadas + ' ' + (qtdeDirigentesEmpresasLigadas > 1 ? 'dirigentes' : 'dirigente'))})
            }
            this.adicionaRestricao({'tag': 'temEmpresaLigada', 'ativo': qtdeDirigentesEmpresasLigadas > 0, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Não pode prosseguir com esse CNPJ, pois está vinculado a ' + (qtdeDirigentesEmpresasLigadas + ' ' + (qtdeDirigentesEmpresasLigadas > 1 ? 'dirigentes ativos' : 'dirigente ativo')) + ' a menos de 12 meses'})
          } else {
            this.$snotify.error(response.data.mensagem)
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
      aviso (retorno) {
        if (_.has(retorno, 'codigo')) {
          let mensagem = (_.has(retorno, 'mensagem') && !_.isNull(retorno.mensagem) && !_.isEmpty(retorno.mensagem)) ? retorno.mensagem : 'Erro ao processar a requisição'
          if (retorno.codigo === 'ERRO') {
            this.$snotify.clear()
            this.$snotify.error(mensagem)
          } else {
            if (_.includes(['OK', 'AVISO'], retorno.codigo)) {
              this.$snotify.success(mensagem, {timeout: 30000})
            }
          }
        }
      },
      // Exemplo: 52170522555994000145550010000009651275106690
      validarChaveNFe () {
        this.$snotify.clear()
        // Limpa a chave retirando carecteres não numéricos
        if (('' + this.nfe.chaveAcesso).length >= 0) {
          this.nfe.chaveAcesso = this.nfe.chaveAcesso.replace(/\D+/g, '')
        }
        // Não pesquisar quando a chave de acesso é a mesma do protocolo recente de validação
        if (_.has(this.nfe.protocoloValidacao, 'infProt') && this.nfe.chaveAcesso === this.nfe.protocoloValidacao.infProt.chNFe) {
          return
        }
        // Processa somente se a chave tiver 44 números
        if (('' + this.nfe.chaveAcesso).length === 44) {
          this.loading.tela = true
          this.$snotify.async('Validando chave de acesso...', {timeout: 0})
          //
          this.nfe.validada = false
          this.nfe.dataValidacao = null
          this.nfe.idUsuarioConsulta = null
          // TODO rever protocolo para saber se é da consulta ou do processamento da NF na SEFAZ
          this.nfe.protocoloValidacao = null
          //
          axiosLaravel.post('pagamento/valida/nfe', {'tipo': 'NF-e', 'idProcesso': this.id, 'chave': this.nfe.chaveAcesso}).then((response) => {
            if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
              let retorno = response.data.retorno
              this.nfe.dataValidacao = Date.now()
              this.nfe.idUsuarioConsulta = this.usuarioLogado.id
              this.nfe.xmlNfe = retorno.NFe
              this.nfe.protocoloValidacao = retorno.protocoloValidacao
              this.nfe.validada = true
              this.preenchendoSolicitacao()
            }
            this.$snotify.clear()
            this.aviso(response.data.mensagem)
            this.loading.tela = false
          })
            .catch((error) => {
              this.loading.tela = false
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
          //
        } else if (_.isNull(this.nfe.chaveAcesso) || ('' + this.nfe.chaveAcesso).length !== 44) {
          // Se chave vazia ou com menos de 44 números então limpa os campos
          this.$snotify.clear()
          this.limparSolicitacao()
        }
      },
      limparSolicitacao () {
        this.nota.numeroNota = ''
        this.nota.dataInclusao = null
        this.nota.dataValidade = null
        this.nota.serieNota = null
        this.nota.tipoFornecedor = null
        this.nota.cpfFornecedor = ''
        this.nota.cnpjFornecedor = ''
        this.nota.nomeFornecedor = ''
        this.nota.enderecoFornecedor = ''
        this.nota.codigoFornecedor = ''
        this.nota.cepFornecedor = ''
        this.nota.serieNota = null
        this.nota.formaPagamento = null
        this.nota.dados_bancarios.banco = ''
        this.nota.dados_bancarios.agencia = ''
        this.nota.dados_bancarios.conta = ''
        this.nota.dados_bancarios.tipo = 1
        this.nota.observacao = null
      },
      preenchendoSolicitacao () {
        // TODO validar tipo do ambiente se é de produção
        // TODO validar situação da NF
        // TODO validar destinatário da NF se é para a entidade do projeto
        // TODO Pesquisar se fornecedor já está no Sapiens
        //
        let info = this.nfe.xmlNfe.NFe.infNFe
        let emitente = this.nfe.xmlNfe.NFe.infNFe.emit
        let endereco = emitente.enderEmit
        this.nota.numeroNota = info.ide.nNF
        this.nota.dataInclusao = info.ide.dhEmi
        this.nota.serieNota = 'NOTA_FISCAL'
        if (_.has(emitente, 'CNPJ')) {
          this.nota.tipoFornecedor = 'Pessoa Jurídica'
          this.nota.cpfFornecedor = ''
          this.nota.cnpjFornecedor = emitente.CNPJ
          this.nota.nomeFornecedor = emitente.xNome.substring(0, 255)
          let enderecoCompleto = endereco.xLgr + ', ' + endereco.nro + ', ' + endereco.xCpl + ', ' + endereco.xBairro
          this.nota.enderecoFornecedor = enderecoCompleto.substring(0, 255)
          this.nota.cepFornecedor = endereco.CEP
          this.procurandoCidadeUF()
        }
        this.nota.serieNota = 'NOTA_FISCAL'
        this.$validator.validateAll()
      },

      salvar () {
        this.aprovacao.resultadoAprovacao = 'Salvar'
        // Coloca um timer se a etapa for autorização
        if (this.etapa === 'Autorização') {
          let timer = Math.floor(Math.random() * 5000) + 10000
          this.loading.tela = true
          this.$snotify.async('Analisando dados...', {timeout: 0})
          setTimeout(() => {
            this.$snotify.clear()
            this.validarConclusao()
          }, timer)
        } else {
          this.validarConclusao()
        }
      },
      preconcluir () {
        if (this.usuarioLogado.userType === 'FUNDACAO') {
          if (!this.confirmaValorOriginalDiferente && this.processo === 'PRESTACAO_DE_CONTAS' && this.totais.projeto.total.solicitado !== this.valorOriginal && this.etapa !== 'Solicitação') {
            this.$dialog.confirm(`⚠️ O valor desta solicitação mudou em relação ao que foi informado na etapa de solicitação (R$ ${this.valorOriginal}).`, {
              html: true,
              animation: 'fade',
              customClass: 'avisoAlerta',
              type: 'warning',
              confirmButtonText: 'Estou ciente, continuar!',
              cancelButtonText: 'Cancelar e revisar'
            })
            .then(dialog => {
              this.concluir()
            }).catch(() => {
              this.$snotify.warning('Operação não realizada, revise os valores')
            })
          } else {
            this.concluir()
          }
        } else {
          this.concluir()
        }
      },
      concluir () {
        this.botao_concluir_disabled = true
        // Demanda 66430 Correção de múltiplos clicks no botão de concluir
        if (this.wait) {
          return
        }
        this.wait = true
        // eslint-disable-next-line
        setTimeout(() => this.wait = false, 2000)
        // Suporte 75431
        this.loading.tela = true
        this.aprovacao.resultadoAprovacao = _.includes(['Solicitação', 'Revisão'], this.etapa) ? 'Análise' : this.aprovacao.resultadoAprovacao
        this.validarConclusao()
        this.loading.tela = false
        // }
      },

      async validarConclusao () {
        // 70525 - Verificacao de preenchimento de código do boleto
        // 70588 - Verificacao de forma de pagamento antes de verificar codigo do boleto
        if (this.etapa === 'Solicitação' && ['PAGAMENTO'].includes(this.processo) && this.nota.forma_pagamento === '4') {
          this.adicionaRestricao({'tag': 'boletoInvalido', 'ativo': (_.isEmpty(this.nota.boleto.numeroInformadoTela)) && this.tipoDocumento === 'boleto', 'tipo': 'restricao', 'acao': null, 'mensagem': 'Código de Barras do Boleto não informado.'})
        }
        this.verificaCorrigeDados()
        // Restringir se NF-e não está validada
        this.adicionaRestricao({'tag': 'nfeValidada', 'ativo': (this.ehNFe && !this.nfe.validada), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Se é NF-e, informe uma chave válida'})
        //
        this.adicionaRestricao({'tag': 'cienteDeclaracoes', 'ativo': (this.cienteDeclaracoes.length < 2 && _.includes(['Solicitação', 'Revisão'], this.etapa) && !this.ehVisualizacao && this.processo !== 'CONTRAPARTIDA' && !this.ehProjetosPovosTradicionais), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Deve confirmar que está ciente das declarações no final desta solicitação'})
        // Restringir se não há item solicitado do cronograma
        this.adicionaRestricao({'tag': 'nenhumItemInformado', 'ativo': (this.nota.itens.length === 0), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Não há item indicado no cronograma'})
        //
        // TODO Verificar se os total de itens não ultrapassa o total da NF-e
        // this.adicionaRestricao({'tag': 'totalSuperiorNFe', 'ativo': (ehNFe && this.totais.projeto.total.solicitado > this.nfe.), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Não há item indicado no cronograma'})
        //
        // Restringir se não houver arquivo anexo na nota
        if (!this.ehPrestacaoSimplificada) {
          this.adicionaRestricao({'tag': 'temAnexo', 'ativo': (this.nota.anexos.length === 0), 'tipo': 'restricao', 'acao': null, 'mensagem': 'É necessário anexar pelo menos um documento comprobatório'})
        }
        // TODO verifica o que fazer com NF-e
        // Validar nota quando a etapa for análise e o processo for prestação de contas
        if (this.etapa === 'Análise' && ['PRESTACAO_DE_CONTAS', 'PAGAMENTO', 'RESSARCIMENTO'].includes(this.processo)) {
          let identificador = this.nota.cpfFornecedor
          if (this.nota.cpfFornecedor === '') {
            identificador = this.nota.cnpjFornecedor
          }
          let data = {
            numero: this.nota.numeroNota,
            identificador: identificador,
            serie: this.nota.serieNota,
            id: this.id
          }
          await axiosLaravel.post('processos/tarefas/validaDocumentoAnalisePrestacao', data).then((response) => {
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$root.trataErro(error)
              console.log('ERRO')
              this.loading.tela = false
              throw error
            })
        }
        // Regras caso se trate só de prestação de contas e se é pra devolver em revisão para a entidade aí não sensibiliza a validação.
        // Suporte 62096 Ajuste para que de Análise Tributária volte para análise sem validar o saldo disponível para prestação de contas.
        // Suporte 63184 Ajuste para que de Autorização volte para análise sem validar o saldo disponível para prestação de contas.
        // O saldo disponível é calculado somando os processos em_execução e tem como objetivo impedir abertura de novas prestações de contas que extrapolem o saldo
        // Se o processo já estiver aberto, não precisa restringir, pode movimentar-se livremente entre as diversas etapas
        if (this.processo === 'PRESTACAO_DE_CONTAS' && (_.isNull(this.id) || this.etapa === 'Solicitação')) {
          // TODO Não verificar até colher os dados corretos de prestações anteriores
          // Suporte 75611 - reativação da restrição de falta de saldo para prestação de contas
          this.adicionaRestricao({'tag': 'prestacaoAcimaSaldo', 'ativo': (this.totais.projeto.total.solicitado > this.totais.adiantamento.total.saldo), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Solicitação superior ao pendente de prestação R$ ' + this.totais.adiantamento.total.saldo})
          // Suporte 61222
          this.adicionaRestricao({'tag': 'prestacaoContasComSaldoZerado', 'ativo': (this.totais.adiantamento.fbb.saldo + this.totais.projeto.total.solicitado <= 0 && this.totais.adiantamento.parceiros.saldo + this.totais.projeto.total.solicitado <= 0), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Não há saldo disponível para solicitação de Prestação de Contas'})
        }
        if (this.processo === 'PRESTACAO_DE_CONTAS' && this.etapa !== 'Solicitação' && this.etapa !== 'Revisão') {
          // Suporte 76048 não deixa devolver se o projeto estiver diferente de APR
          this.adicionaRestricao({'tag': 'projeto diferente de APR', 'ativo': (this.projeto.Status_ERP !== 'APR'), tipo: 'restricao', acao: null, mensagem: 'É necessário incluir flexibilização para o projeto para prosseguir.'})
        }
        if (this.processo === 'PRESTACAO_DE_CONTAS' && _.includes(['Solicitação'], this.etapa)) {
          // Suporte 66130 - Correção de erro na conclusão na solicitação de Prestação de Contas
          this.adicionaRestricao({'tag': 'solicitacaoAcimaSaldoDisponível', 'ativo': (this.totais.projeto.total.solicitado > (_.includes(this.extratoFiltrosSelecionados, 'fundacao') ? this.totais.adiantamento.fbb.saldo : this.totais.adiantamento.parceiros.saldo)), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Valor da solicitação superior ao saldo máximo disponível R$ ' + (_.includes(this.extratoFiltrosSelecionados, 'fundacao') ? this.totais.adiantamento.fbb.saldo : this.totais.adiantamento.parceiros.saldo)})
        }
        //
        // Regras caso se trate de prestação de contas ou pagamento somente
        // 67600 Não incluir validacao para devolver a solicitacao para a entidade ou para análise
        const ehDevolucaoParaRevisao = this.aprovacao.resultadoAprovacao === 'Revisão'
        const ehDevolucaoParaAnalise = this.aprovacao.resultadoAprovacao === 'Análise' && this.etapa === 'Análise Tributária'
        if (_.includes(['PRESTACAO_DE_CONTAS', 'PAGAMENTO', 'RESSARCIMENTO'], this.processo) && (!ehDevolucaoParaRevisao) && (!ehDevolucaoParaAnalise)) {
          // Restringuir caso seja tributado e tenha algum produto ou mais de um serviço
          let itensSolicitados = _.filter(this.cronograma.itens, function (i) { return i.Qtde_solicitado > 0 && i.Valor_solicitado > 0 })
          let qtdeProdutos = _.sumBy(itensSolicitados, function (i) { return i.Item_Tipo === 'PRODUTO' ? 1 : 0 })
          let qtdeServicos = _.sumBy(itensSolicitados, function (i) { return i.Item_Tipo === 'SERVICO' ? 1 : 0 })
          this.adicionaRestricao({'tag': 'validaTributacao', 'ativo': ((this.nota.tributacao === 'TRIBUTADO') && (qtdeServicos > 1 || qtdeProdutos > 0)), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Está marcado com Tributado, mas tem ' + qtdeServicos + ' serviço(s) e ' + qtdeProdutos + ' produto(s)'})
          //
          // Restringuir se encontrar valor solicitado acima do orçado
          let itensSolicitadoSaldoNegativo = []
          this.nota.itens.forEach((item) => {
            if (item.Valor_saldo - parseFloat(item.Valor_solicitado) < 0) { // Verifica se o saldo é negativo de algum item
              itensSolicitadoSaldoNegativo.push('#' + item.Id_item)
            }
          })
          this.adicionaRestricao({'tag': 'itemSolicitadoSaldoNegativo', 'ativo': itensSolicitadoSaldoNegativo.length > 0, 'tipo': 'restricao', 'acao': null, 'mensagem': (itensSolicitadoSaldoNegativo.length > 1 ? 'Itens' : 'Item') + ' com saldo negativo: ' + (_.join(_.uniq(itensSolicitadoSaldoNegativo), ', '))})
        }
        // Restringir quando se tratar projetos especiais
        if (this.ehProjetoEspecial && this.processo === 'PAGAMENTO' && this.etapa === 'Análise' && this.aprovacao.resultadoAprovacao !== 'Revisão') {
          this.adicionaRestricao({'tag': 'dadosComplementresValorAcima', 'ativo': (_.sumBy(this.nota.dadosComplementares, 'valor') > this.totais.projeto.total.solicitado), 'tipo': 'restricao', 'acao': null, 'mensagem': 'O total informado nos dados complementares é superior ao total desta solicitação'})
          this.adicionaRestricao({'tag': 'dadosComplementresFaltandoProjetoEspecial', 'ativo': (this.nota.dadosComplementares.length === 0), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Se trata de projeto especial que deve ter pelo menos um registro de dados complementares deste pagamento'})
          this.adicionaRestricao({'tag': 'dadosComplementresIncompletoMunicipio', 'ativo': (_.filter(this.nota.dadosComplementares, function (d) { return _.isEmpty(d.municipio) })).length > 0, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Há dados complementares que não tem município'})
          this.adicionaRestricao({'tag': 'dadosComplementresIncompletoValor', 'ativo': (_.filter(this.nota.dadosComplementares, function (d) { return d.valor === 0 })).length > 0, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Há dados complementares onde não foi informado valor'})
          this.adicionaRestricao({'tag': 'dadosComplementresIncompletoDestinacao', 'ativo': (_.filter(this.nota.dadosComplementares, function (d) { return _.isEmpty(d.destinacao) || d.destinacao.length < 1 })).length > 0, 'tipo': 'restricao', 'acao': null, 'mensagem': 'A destinação em dados complementares é obrigatória'})
          // Comentado abaixo para desobrigar preenchimento de participantes
          // this.adicionaRestricao({'tag': 'dadosComplementresIncompletoParticipantes', 'ativo': (_.filter(this.nota.dadosComplementares, function (d) { return d.participantes === 0 })).length > 0, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Tem dados complementares sem participantes atendidos'})
        }
        // Quando set tratar de encaminhar para Revisão da entidade deve-se excluir as retrições de conclusão (para permitir a devolução) ref. alertas de inconsistência de valores e titulos não refeito pela Gefic
        if (this.aprovacao.resultadoAprovacao === 'Revisão') {
          this.restricaoParaConcluir.forEach((erro) => {
            if (erro.tag === 'adiantamentoNaoDisponivelParaPrestarContas' || _.includes(erro.tag, 'valoresTotaisIncorretosProjeto')) {
              this.removeRestricao({'tag': erro.tag})
            }
          })
        }
        //
        this.$validator.validateAll().then(validado => {
          this.validaAjustaCodigoBarras() // Verifica se há codigo de brras e se está sem erros
          this.adicionaRestricao({'tag': 'camposPendentes', 'ativo': !validado || this.errors.items.length !== 0, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Revise os campos: ' + (_.join(_.uniq(_.map(this.errors.items, 'field')), ', '))})
          //
          let validacaoDadosBancarios = this.validandoDadosBancarios()
          this.adicionaRestricao({'tag': 'dadosBancariosIncorretos', 'ativo': _.isString(validacaoDadosBancarios), 'tipo': 'restricao', 'acao': null, 'mensagem': validacaoDadosBancarios})
          //
          let validacaoCpfCnpj = this.validandoCpfCnpj()
          this.adicionaRestricao({'tag': 'invalidoCpfCnpj', 'ativo': _.isString(validacaoCpfCnpj), 'tipo': 'restricao', 'acao': null, 'mensagem': validacaoCpfCnpj})

          // // Verificar se o cep ainda não está cadastrado no Sapiens
          // let validaCep = ((this.nota.cidadeFornecedor === '' && this.nota.estadoFornecedor === ''))
          // this.adicionaRestricao({'tag': 'cepNaoCadastrado', 'ativo': validaCep, 'tipo': 'restricao', 'acao': null, 'mensagem': 'CEP não encontrado no sistema. Pedimos abrir um suporte solicitando o cadastramento do CEP.'})

          if (this.restricaoParaConcluir.length > 0 && _.filter(this.restricaoParaConcluir, {'ativo': true}).length > 0) {
            let restricoes = _.filter(this.restricaoParaConcluir, {'ativo': true, 'tipo': 'restricao'})
            if (restricoes.length > 0) {
              let mensagens = '<div class=avisoAlerta><li>' + _.join(_.map(restricoes, 'mensagem'), '<li>') + '</div>'
              this.$dialog.alert(mensagens, {html: true, animation: 'fade', customClass: 'avisoAlerta'}).then(function (dialog) {})
            }
          } else {
            this.processarConclusao()
          }
        })
      },
      processarConclusao () {
        this.loading.tela = true
        if (this.nfe.validada) {
          this.nota.opcoes = {'parametro': 'NFe', 'valor': this.nfe}
        }
        if (this.processo === 'RESSARCIMENTO') {
          this.verificarAlteracaoContasFavorecido()
          this.nota.opcoes = {'parametro': 'FAVORECIDO', 'valor': JSON.stringify(this.nota.favorecido)}
          this.nota.numeroNota = _.isNil(this.nota.numeroNota) || _.isNaN(this.nota.numeroNota) || ('' + this.nota.numeroNota) === '0' || ('' + this.nota.numeroNota).length === 0 ? '0' : this.nota.numeroNota // Atribuir numero '0' para o sistema gerar um número único usando Ano e parte do ID do processo
        }
        if (('' + this.nota.forma_pagamento) === '4') {
          this.nota.parametros_documento.push({ 'parametro': 'BOLETO', 'valor': this.nota.boleto })
        }
        if (_.includes(['PAGAMENTO', 'PRESTACAO_DE_CONTAS', 'RESSARCIMENTO'], this.processo) && _.includes(['Solicitação', 'Revisão'], this.etapa)) {
          this.nota.parametros_documento.push({ 'parametro': 'DECLARACOES', 'valor': this.cienteDeclaracoes })
        }
        this.nota.valorTotal = _.sumBy(this.nota.itens, 'totalValue')
        // Só CPF ou só CNPJ são validos
        if (this.nota.tipoFornecedor === 'Pessoa Jurídica') {
          _.unset(this.nota, 'cpfFornecedor')
        } else if (this.nota.tipoFornecedor === 'Pessoa Física') {
          _.unset(this.nota, 'cnpjFornecedor')
        }
        this.nota.projeto = this.projeto
        this.nota.banco = this.nota.dados_bancarios.banco
        this.nota.agencia = this.nota.dados_bancarios.agencia
        this.nota.conta = this.nota.dados_bancarios.conta
        this.nota.tipo = this.nota.dados_bancarios.tipo
        //
        this.nota.processo = {'nome': this.processo, 'situacao': 'EM_EXECUCAO'}
        this.nota.tarefa = {'nome': 'SOLICITACAO', 'tipo': 'USUARIO', 'situacao': 'PADRAO'}
        //
        // Quando se trata de processo novo (não tem id ainda) --------------------------------------------------------
        if (_.isNull(this.id)) {
          _.set(this.nota, 'proximaEtapa', this.aprovacao.resultadoAprovacao)
          // Adicionando os parâmetros novos que Renato criou para Histórico
          _.set(this.nota, 'proxima_etapa', this.aprovacao.resultadoAprovacao)
          _.set(this.nota, 'data_edicao', this.data_edicao)
          if (_.includes(['RESSARCIMENTO'], this.processo) && _.includes(['Solicitação', 'Revisão', 'Análise'], this.etapa)) {
            this.gravarContasFavorecido()
          }
          // if (this.nota) {
          //   console.log('NOTA DEBUG:', this.nota)
          //   return
          // }
          this.criarSolicitacao(this.nota)
        } else {
          let doc = {}
          // Quando o processo já foi criado (tem id) -----------------------------------------------------------------
          _.set(doc, 'id', this.id)
          _.set(doc, 'tarefas', this.historico)
          // _.set(doc, 'glosa', (!_.isEmpty(this.motivoDevolucao) ? '#' + this.motivoDevolucao.descricao + '# ' : '') + this.nota.observacao)
          _.set(doc, 'glosa', this.nota.observacao)
          //
          // Adicionando os parâmetros novos que Renato criou para Histórico
          _.set(doc, 'proxima_etapa', this.aprovacao.resultadoAprovacao)
          _.set(doc, 'data_edicao', this.data_edicao)
          //
          _.set(doc, 'documentos_liberacao', this.validacao)
          _.set(doc, 'documentos_liberacao.numero', this.nota.numeroNota)
          _.set(doc, 'documentos_liberacao.serie', this.nota.serieNota)
          _.set(doc, 'documentos_liberacao.prioridade', this.nota.pagamentoPrioritario)
          _.set(doc, 'documentos_liberacao.forma_pagamento', this.nota.forma_pagamento)
          _.set(doc, 'documentos_liberacao.emissao', this.nota.dataInclusao)
          _.set(doc, 'documentos_liberacao.validade', this.nota.dataValidade)
          _.set(doc, 'documentos_liberacao.fk_dados_bancarios', this.validacao.fk_dados_bancarios)
          _.set(doc, 'documentos_liberacao.dados_bancarios', this.nota.dados_bancarios)
          _.set(doc, 'documentos_liberacao.dados_bancarios.fk_fornecedor', _.has(this.validacao.dados_bancarios, 'fk_fornecedor') ? this.validacao.dados_bancarios.fk_fornecedor : 0)
          _.set(doc, 'documentos_liberacao.dados_bancarios.fornecedor.nome', this.nota.nomeFornecedor)
          _.set(doc, 'documentos_liberacao.dados_bancarios.fornecedor.identificador', this.nota.tipoFornecedor === 'Pessoa Jurídica' ? this.nota.cnpjFornecedor : this.nota.cpfFornecedor)
          _.set(doc, 'documentos_liberacao.dados_bancarios.fornecedor.cep', this.nota.cepFornecedor)
          _.set(doc, 'documentos_liberacao.dados_bancarios.fornecedor.endereco', this.nota.enderecoFornecedor)
          //
          _.set(doc, 'documentos_liberacao.receiptItems', this.nota.itens)
          //
          // Parâmetros do documento de liberação
          this.validacao.parametros_documento = []
          // if (this.nota.zerar !== '') { // Desabilitado
          // this.validacao.parametros_documento.push({ 'fk_documentos_liberacao': this.validacao.id, 'parametro': 'OPCOES', 'valor': this.nota.zerar })
          // }
          if (this.nota.bypass !== '') {
            this.validacao.parametros_documento.push({ 'fk_documentos_liberacao': this.validacao.id, 'parametro': 'OPCOES', 'valor': this.nota.bypass })
          }
          if (('' + this.nota.forma_pagamento) === '4') {
            this.validacao.parametros_documento.push({ 'fk_documentos_liberacao': this.validacao.id, 'parametro': 'BOLETO', 'valor': JSON.stringify(this.nota.boleto) })
          }
          if (this.nota.suporteFbb.length > 0) {
            this.validacao.parametros_documento.push({ 'fk_documentos_liberacao': this.validacao.id, 'parametro': 'SUPORTE_FBB', 'valor': JSON.stringify(this.nota.suporteFbb) })
          }
          if (this.aprovacao.resultadoAprovacao === 'Revisão' && !_.isNull(this.motivoDevolucao)) {
            _.set(this.motivoDevolucao, 'fk_usuario', this.usuarioLogado.id)
            this.validacao.parametros_documento.push({ 'fk_documentos_liberacao': this.validacao.id, 'parametro': 'MOTIVO_DEVOLUCAO', 'valor': JSON.stringify(this.motivoDevolucao) })
          }
          if (this.processo !== 'CONTRAPARTIDA' && _.includes(['Análise', 'Análise Tributária'], this.etapa) && _.includes(['TRIBUTADO', 'NAO_TRIBUTADO'], this.nota.tributacao)) {
            this.validacao.parametros_documento.push({ 'fk_documentos_liberacao': this.validacao.id, 'parametro': 'TRIBUTACAO', 'valor': this.nota.tributacao })
            this.validacao.parametros_documento.push({ 'fk_documentos_liberacao': this.validacao.id, 'parametro': 'VALOR_TRIBUTADO', 'valor': _.isNull(this.nota.valorTributado) || this.nota.valorTributado === '' || this.nota.tributacao === 'NAO_TRIBUTADO' ? '0' : this.nota.valorTributado })
          }
          if (this.processo === 'RESSARCIMENTO') {
            this.verificarAlteracaoContasFavorecido()
            this.validacao.parametros_documento.push({ 'fk_documentos_liberacao': this.validacao.id, 'parametro': 'FAVORECIDO', 'valor': JSON.stringify(this.nota.favorecido) })
          }
          if (this.processo !== 'CONTRAPARTIDA' && this.ehNFe) {
            this.validacao.parametros_documento.push({ 'fk_documentos_liberacao': this.validacao.id, 'parametro': 'NFe', 'valor': JSON.stringify(this.nfe) })
          }
          if (this.ehProjetoEspecial && this.processo === 'PAGAMENTO' && !_.isEmpty(this.nota.dadosComplementares)) {
            this.validacao.parametros_documento.push({ 'fk_documentos_liberacao': this.validacao.id, 'parametro': 'DADOS_COMPLEMENTARES', 'valor': JSON.stringify(this.nota.dadosComplementares) })
          }
          if (_.includes(['PAGAMENTO', 'PRESTACAO_DE_CONTAS', 'RESSARCIMENTO'], this.processo) && _.includes(['Solicitação', 'Revisão'], this.etapa)) {
            this.validacao.parametros_documento.push({ 'fk_documentos_liberacao': this.validacao.id, 'parametro': 'DECLARACOES', 'valor': JSON.stringify(this.cienteDeclaracoes) })
          }
          if (_.isEmpty(this.validacao.parametros_documento)) {
            _.set(doc, 'documentos_liberacao.parametros_documento', this.validacao.parametros_documento)
          }
          // if (this.ehPrestacaoSimplificada) {
          //   _.set(doc, 'documentos_liberacao.etapa', 'Análise Tributária')
          //   _.set(doc, 'documentos_liberacao.resultado_aprovacao', 'Autorização')
          // } else {
          //   _.set(doc, 'documentos_liberacao.etapa', this.etapa)
          //   _.set(doc, 'documentos_liberacao.resultado_aprovacao', this.aprovacao.resultadoAprovacao)
          // }
          _.set(doc, 'processo', this.validacao.processo)
          _.set(doc, 'processo.nome', this.processo)
          _.set(doc, 'proximaEtapa', this.aprovacao.resultadoAprovacao)
          //
          //
          // if (doc) {
          //   console.log('DOC DEBUG:', doc)
          //   return
          // }
          // Processamentos adicionais antes de encaminhar tarefa
          if (_.includes(['PAGAMENTO', 'PRESTACAO_DE_CONTAS', 'RESSARCIMENTO'], this.processo)) {
            // alterado em 10/11/2021, referente ao suporte 63455 -> se o processo estiver em Análise Tributária e retornar para Análise, o título não foi aprovado ainda
            // if (_.includes(['Análise Tributária', 'Autorização', 'Liquidação'], this.etapa) && this.aprovacao.resultadoAprovacao === 'Análise') {
            if (_.includes(['Autorização', 'Liquidação'], this.etapa) && this.aprovacao.resultadoAprovacao === 'Análise') {
            // Quando estiver An. Tributária, Autorização ou Liquidação e for Devolver para Análise... deve desaprovar o título
              this.aprovacaoTitulo('D', doc)
            } else if (_.includes(['Análise Tributária'], this.etapa) && this.aprovacao.resultadoAprovacao === 'Autorização') {
            // Quando estiver An. Tributária e for Aprovar o processo... deve aprovar o título
              this.aprovacaoTitulo('A', doc)
            } else if (_.includes(['PRESTACAO_DE_CONTAS'], this.processo) && _.includes(['Autorização'], this.etapa) && this.aprovacao.resultadoAprovacao === 'Conclusão') {
              // Quando for Prestação de Contas, estiver na Autorização e for Aprovar o processo... deve baixar o título de adiantamento
              this.baixaTitulo(doc)
            } else if (_.includes(['RESSARCIMENTO'], this.processo) && _.includes(['Solicitação', 'Revisão', 'Análise'], this.etapa)) {
              // Quando for Ressarcimento e estiver na Solicitação, Revisão, Análise que é quando se pode alterar contas de favorecido... deve enviar primeiro as alterações das contas se houver
              this.gravarContasFavorecido(doc)
            } else {
              // Para todos os demais casos só encaminhar o processo para próxima etapa
              this.encaminharProximaTarefa(doc)
            }
          } else if (_.includes(['CONTRAPARTIDA'], this.processo)) {
            this.encaminharProximaTarefa(doc)
          } else {
          //   Erro pois não se trata de processo de execução financeira
          }
        }
      },
      verificarAlteracaoContasFavorecido () {
        let favorecido = _.clone(this.nota.favorecido)
        // Os 'incluidos', 'excluidos' e 'resultado' servem somente para registro da alteração para ficar guardado no objeto para fins de auditoria já que o Sapiens não tem
        let incluidosNaoExcluidos = _.differenceWith(this.nota.favorecido.incluidos, this.nota.favorecido.excluidos, _.isEqual)
        let excluidosNaoIncluidos = _.differenceWith(this.nota.favorecido.excluidos, this.nota.favorecido.incluidos, _.isEqual)
        favorecido['incluidos'] = incluidosNaoExcluidos
        favorecido['excluidos'] = excluidosNaoIncluidos
        favorecido['resultado'] = this.opcoesContasExistentesFavorecido
        //
        this.nota.favorecido = _.clone(favorecido)
      },
      gravarContasFavorecido (doc = null) {
        // Se houver alteração nas contas
        // TODO criar nova verificação que não tenha mais 'incluidos' nem 'excluidos' só deixar o de 'resultado'
        if (this.nota.favorecido.incluidos.length > 0 || this.nota.favorecido.excluidos.length > 0 || !_.isEqual(this.nota.favorecido.dadosBancariosSelecionados, this.nota.favorecido.dadosBancariosSelecionadosAnterior)) {
          this.$snotify.async('Registrando alterações nas contas do Favorecido...', {timeout: 0})
          axiosLaravel.post('pagamento/contas/favorecido/alteracao/', {'alteracao': this.nota.favorecido}).then((response) => {
            if (_.has(response.data, 'codigo') && _.includes(['OK'], response.data.codigo)) {
              // Se o resultado da alteração for ok, então pode continuar o processo
              if (!_.isNull(doc)) {
                this.encaminharProximaTarefa(doc)
              }
            } else {
              this.aviso(response.data)
              if (response.data.codigo === 'ERRO') {
                this.saiDaTela()
              }
            }
            // this.loading.tela = false
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$root.trataErro(error)
              this.loading.tela = false
            })
        } else {
          if (!_.isNull(doc)) {
            // Se houver documento anexado então encaminha o processo
            this.encaminharProximaTarefa(doc)
          }
        }
      },
      baixaTitulo (doc) {
        this.$snotify.async('Baixando título de prestação contra adiantamento...', {timeout: 0})
        this.loading.tela = true
        axiosLaravel.post('prestacao_contas/adiantamento/baixa/', {'idProcesso': this.id, 'doc': doc}).then((response) => {
          this.aviso(response.data)
          if (response.data.codigo === 'ERRO') {
            this.saiDaTela()
          }
          if (_.has(response.data, 'codigo') && _.includes(['OK', 'AVISO'], response.data.codigo)) {
            // Se o resultado da baixa for ok ou um aviso qualquer, então pode continuar o processo
            this.$snotify.clear()
            this.encaminharProximaTarefa(doc)
          }
          // this.loading.tela = false
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
            this.loading.tela = false
          })
      },
      aprovacaoTitulo (operacao, doc) {
        this.$snotify.async('Processando ' + (operacao === 'A' ? 'aprovação' : 'desaprovação') + ' do título...', {timeout: 0})
        this.loading.tela = true
        axiosLaravel.post('pagamento/titulo/aprovacao', {'idProcesso': this.id, 'tipoOperacao': operacao}).then((response) => {
          this.$snotify.clear()
          this.aviso(response.data)
          if (response.data.codigo === 'ERRO') {
            this.saiDaTela()
          }
          if (_.has(response.data, 'codigo') && _.includes(['OK', 'AVISO'], response.data.codigo)) {
            // Se o resultado da (des)aprovação do titulo for ok ou um aviso qualquer então pode continuar o processo
            this.encaminharProximaTarefa(doc)
          }
        })
        .catch((error) => {
          this.$snotify.clear()
          this.loading.tela = false
          this.$root.trataErro(error)
        })
      },
      criarSolicitacao (nota) {
        this.$snotify.async((nota.proximaEtapa === 'Salvar' ? 'Salvando' : 'Encaminhando') + ' Solicitação de ' + this.descricaoProcesso[this.processo] + '. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.post('processos/grava', nota).then((response) => {
          this.$snotify.clear()
          if (_.hasIn(response, 'error')) {
            this.$snotify.clear()
            this.$snotify.error(response.data.value.error[0], '', 10000)
          } else {
            this.gravaHistorico(response.data)
            this.$snotify.clear()
            if (nota.proximaEtapa === 'Salvar') {
              this.id = response.data.id
              this.$snotify.success('Gravado com sucesso. Relendo a solicitação...')
              this.$router.push(this.rotasProcesso[this.processo] + '/' + this.id)
            } else {
              this.$snotify.success('Solicitação encaminhada com sucesso!')
              this.$router.push('/solicitacao/lista')
            }
          }
          this.loading.tela = false
        })
          .catch((error) => {
            this.loading.tela = false
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      encaminharProximaTarefa (doc) {
        // Encaminha o processo para a próxima etapa do documento de liberação
        console.log('encaminharProximaTarefa (doc) >>>>', doc)
        this.loading.tela = true
        let msgProcessando = 'Salvando a solicitação...'
        let msgConclusao = 'Gravado com sucesso. Relendo a solicitação...'
        let msgExclusaoNota = (this.aprovacao.resultadoAprovacao === 'Revisão' || (this.aprovacao.resultadoAprovacao === 'Análise' && this.etapa !== 'Solicitação')) && this.possuiNotaSapiens ? ' e excluindo notas do ERP' : ''
        if (!_.isUndefined(this.aprovacao.resultadoAprovacao) && this.aprovacao.resultadoAprovacao !== 'Salvar') {
          msgProcessando = 'Encaminhando ' + (this.descricaoProcesso[this.processo]) + (_.isUndefined(this.aprovacao.resultadoAprovacao) ? '...' : ' para ' + this.aprovacao.resultadoAprovacao + msgExclusaoNota)
          msgConclusao = 'Encaminhado com sucesso!'
        }
        this.$snotify.async(msgProcessando, {timeout: 0})
        this.$forceUpdate()
        axiosLaravel.put('processos/tarefas/atualiza/', doc).then((response) => {
          this.$snotify.clear()
          if (_.hasIn(response, 'error')) {
            this.$snotify.clear()
            this.$snotify.error(response.data.value.error[0], '', 10000)
          } else {
            this.gravaHistorico(response.data)
            this.$snotify.clear()
            this.$snotify.success(msgConclusao)
            if (_.includes(['PAGAMENTO', 'PRESTACAO_DE_CONTAS', 'RESSARCIMENTO'], this.processo) && this.etapa === 'Análise' && this.aprovacao.resultadoAprovacao === 'Análise Tributária') {
              this.dadosAnaliseTributaria({'acao': 'emitirRelatorio', 'parametros': [200]})
            }
            if (_.includes(['PRESTACAO_DE_CONTAS'], this.processo) && this.ehVoluntariado) { // Como se trata de prestação de contas em voluntariado, então já manda processar a aprovação do titulo e depois a baixa parcial
              if (_.get(doc, 'proximaEtapa', '') === 'Análise Tributária') {
                _.set(doc, 'proximaEtapa', 'Autorização')
                _.set(doc, 'proxima_etapa', 'Autorização')
                this.aprovacaoTitulo('A', doc)
              } else if (_.get(doc, 'proximaEtapa', '') === 'Autorização') {
                _.set(doc, 'proximaEtapa', 'Conclusão')
                _.set(doc, 'proxima_etapa', 'Conclusão')
                this.baixaTitulo(doc)
              } else if (_.get(doc, 'proximaEtapa', '') === 'Conclusão') {
                this.$router.go(-1)
              }
            } else {
              if (_.get(this.aprovacao, 'resultadoAprovacao', '') !== 'Salvar') {
                if (this.usuarioLogado.userType === 'FUNDACAO') {
                  this.$router.go(-1)
                } else {
                  this.$router.push('/solicitacao/lista')
                }
              }
            }
          }
        })
          .catch((error) => {
            this.loading.tela = false
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      gravaHistorico (parm) {
        axiosLaravel.post('historico-tarefas/', parm).then((response) => {
        })
      },

      validandoDadosBancarios () {
        if (this.processo === 'PRESTACAO_DE_CONTAS' || !_.includes(['2', '3', '7'], ('' + this.nota.forma_pagamento))) {
          // Em se tratando de Prestação de contas ou quando a forma não exige dados bancários, então "limpa" os dados bancários
          this.nota.dados_bancarios.banco = '000'
          this.nota.dados_bancarios.agencia = '0'
          this.nota.dados_bancarios.conta = '0'
          this.nota.dados_bancarios.conta = 1
          // } else if (!_.includes(['2', '3', '7'], ('' + this.nota.forma_pagamento))) {
          //   // Não sendo Prestação de Contas, quando a forma não exige dados bancários, então "limpa" os dados bancários
          //   this.nota.dados_bancarios.banco = ''
          //   this.nota.dados_bancarios.agencia = ''
          //   this.nota.dados_bancarios.conta = ''
        } else {
          if (this.nota.dados_bancarios.banco && this.nota.dados_bancarios.agencia && this.nota.dados_bancarios.conta && (this.nota.dados_bancarios.tipo === 1 || this.tipoContaSelecionado.codigo === 1)) {
            let banco = _.has(this.bancoSelecionado, 'codigo') ? this.bancoSelecionado.codigo : '000'

            let conta = _.words(this.nota.dados_bancarios.conta)
            let digitosConta = _.get(_.head(_.filter(this.listaBancos, ['codigo', banco])), 'caracteresConta') // Se tiver o tamanho da conta na lista de bancos então completa com zeros para o usuário não ter que fazer
            let contaSemDV = digitosConta ? _.padStart(conta[0], digitosConta, '0') : conta[0]
            let contaDV = conta[1] || ''

            let agencia = _.words(this.nota.dados_bancarios.agencia)
            let agenciaSemDV = agencia[0] || ''
            let agenciaDV = agencia[1] || ''
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
              return e.message
            }
          }
          return false
        }
      },

      validaDadosBancariosFornecedor (bancoVer, agenciaVer, contaVer) {
        let banco = bancoVer

        let conta = _.words(contaVer)
        let digitosConta = _.get(_.head(_.filter(this.listaBancos, ['codigo', banco])), 'caracteresConta') // Se tiver o tamanho da conta na lista de bancos então completa com zeros para o usuário não ter que fazer
        let contaSemDV = digitosConta ? _.padStart(conta[0], digitosConta, '0') : conta[0]
        let contaDV = conta[1] || ''

        let agencia = _.words(agenciaVer)
        let agenciaSemDV = agencia[0] || ''
        let agenciaDV = agencia[1] || ''

        console.log('banco: ', banco)
        console.log('digitosConta ', digitosConta)
        console.log('contaSemDV ', contaSemDV)
        console.log('contaDV ', contaDV)
        console.log('agencia ', agencia)
        console.log('agenciaSemDV ', agenciaSemDV)
        console.log('agenciaDV ', agenciaDV)
        try {
          BankAccountValidator.validate({
            bankNumber: banco,
            agencyNumber: agenciaSemDV,
            agencyCheckNumber: agenciaDV,
            accountNumber: contaSemDV,
            accountCheckNumber: contaDV
          })
          console.log('Validado')
          return true
        } catch (e) {
          console.log('Conta incorreta')
          return false
        }
      },

      validandoCpfCnpj () {
        if (this.nota.tipoFornecedor === 'Pessoa Física') {
          this.nota.cpfFornecedor = _.padStart(this.nota.cpfFornecedor, 11, '0')
          return cpf.isValid(this.nota.cpfFornecedor) ? true : 'CPF inválido'
        }
        if (this.nota.tipoFornecedor === 'Pessoa Jurídica') {
          this.nota.cnpjFornecedor = _.padStart(this.nota.cnpjFornecedor, 14, '0')
          return cnpj.isValid(this.nota.cnpjFornecedor) ? true : 'CNPJ inválido'
        }
      },

      procurandoCidadeUF () {
        if (this.nota.cepFornecedor) {
          axiosLaravel.get('municipios/cep/' + this.nota.cepFornecedor).then((response) => {
            if (!_.isEmpty(response.data) && !_.isString(response.data)) {
              this.nota.cidadeFornecedor = response.data.ds_nome
              this.nota.estadoFornecedor = response.data.ds_uf
              this.$forceUpdate()
            }
          })
            .catch((error) => {
              this.$root.trataErro(error)
              // this.nota.cidadeFornecedor = ''
              // this.nota.estadoFornecedor = ''
              this.$forceUpdate()
            })
        } else {
          this.nota.cidadeFornecedor = ''
          this.nota.estadoFornecedor = ''
          this.$forceUpdate()
        }
      },
      dadosAnaliseTributaria (executarAposOk) {
        this.loading.analise_tributaria = true
        axiosLaravel.get('pagamento/dados/tributacao/' + this.id).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'ERRO') {
            this.aviso(response.data)
          } else if (_.has(response.data, 'retorno')) {
            this.analiseTributaria = response.data.retorno
            if (!_.isUndefined(executarAposOk) && !(('' + this.nota.forma_pagamento) === '3' && ('' + this.nota.dados_bancarios.banco + this.nota.dados_bancarios.agencia + this.nota.dados_bancarios.conta).length < 6)) {
              if (executarAposOk.acao === 'emitirRelatorio') {
                this.emitir(executarAposOk.parametros[0])
                if (!(_.includes(['PRESTACAO_DE_CONTAS'], this.processo) && this.ehVoluntariado)) {
                  this.$router.go(-1)
                }
              }
            }
          }
          // this.nota.liquido = parseFloat(this.nota.liquido === '' ? this.analiseTributaria.nf.Vlrliq : this.nota.liquido)
          this.nota.valorTributado = !_.isNaN(this.nota.valorTributado) && _.isNumber(this.nota.valorTributado) ? this.nota.valorTributado : 0
          this.loading.analise_tributaria = false
        })
          .catch((error) => {
            this.$snotify.clear()
            this.loading.analise_tributaria = false
            this.$root.trataErro(error)
          })
      },
      // buscaTransacaoProdutos (codigo) {
      //   const desc = _.filter(this.analiseTributaria.transacoes, item => item.CodTns === codigo)
      //   return desc[0].DesTns
      // },
      // buscaTransacaoServicos (codigo) {
      //   const desc = _.filter(this.analiseTributaria.transacoes, item => item.CodTns === codigo)
      //   return desc[0].DesTns
      // },
      // buscaTiposTitulo (codigo) {
      //   const desc = _.filter(this.analiseTributaria.tipos_titulo, item => item.CodTpt === codigo)
      //   return desc[0].DesTpt
      // },
      dadosFavorecido (busca) {
        this.loading.favorecido = true
        axiosLaravel.post('pagamento/dados/favorecido/', busca).then((response) => {
          if (_.has(response.data, 'retorno') && !_.isNull(response.data.retorno)) {
            if (_.has(response.data, 'codigo') && _.includes(['OK'], response.data.codigo)) {
              this.nota.favorecido = response.data.retorno
              let contaPrincipalFavorecido = _.trim(this.nota.favorecido.codban) !== '' ? [{'seqban': 0, 'codban': this.nota.favorecido.codban, 'codage': this.nota.favorecido.codage, 'ccbfav': this.nota.favorecido.ccbfav, 'tiptcc': this.nota.favorecido.tiptcc}] : []
              let todasOpcoes = _.concat(contaPrincipalFavorecido, this.nota.favorecido.contas)
              todasOpcoes.forEach((opcao) => {
                if (!_.isEmpty(opcao)) { // Gera a lista para o multselect se não houver campos vazios no retorno do Sapiens
                  this.opcoesContasExistentesFavorecido.push(_.pick(opcao, ['seqban', 'codban', 'codage', 'ccbfav', 'tiptcc'])) // LIsta simplificada somente com dados básicos para usar o ws
                }
              })
              _.set(this.nota, 'favorecido.dadosBancariosSelecionados', contaPrincipalFavorecido[0])
              this.selecionaDadosBancariosFavorecido(contaPrincipalFavorecido[0])
            } else {
              this.aviso(response.data)
              if (response.data.codigo === 'ERRO') {
                this.saiDaTela()
              }
            }
          }
          this.$forceUpdate()
          this.loading.favorecido = false
        })
          .catch((error) => {
            this.$snotify.clear()
            this.loading.favorecido = false
            this.$root.trataErro(error)
          })
      },
      // Seção de funções de contas de Favorecido
      favorecidoDadosBancariosIncluir () {
        this.mostrarIncluindoConta = true
        this.selecionaDadosBancariosFavorecido()
      },

      favorecidoDadosBancariosExcluir () {
        let dadosSelecionados = this.nota.favorecido.dadosBancariosSelecionados
        _.remove(this.opcoesContasExistentesFavorecido, dadosSelecionados)
        _.remove(this.nota.favorecido.excluidos, _.pick(dadosSelecionados, ['codban', 'codage', 'ccbfav', 'tiptcc']))
        this.nota.favorecido.excluidos.push(dadosSelecionados)
        this.selecionaDadosBancariosFavorecido()
        this.nota.favorecido.dadosBancariosSelecionados = null
        this.$forceUpdate()
      },

      favorecidoDadosBancariosOk () {
        this.$validator.validate('banco')
        this.$validator.validate('agência')
        this.$validator.validate('conta corrente')
        let dadosPreenchidos = _.xor(['banco', 'agência', 'conta corrente'], _.uniq(_.map(this.$validator.errors.items, 'field')))
        if (dadosPreenchidos < 3) {
          this.$dialog.alert('Falta preencher: ' + _.join(dadosPreenchidos, ', '), {html: true, animation: 'fade', customClass: 'avisoAlerta'}).then(function (dialog) {})
        } else {
          let dadosNovos = {'codban': this.nota.dados_bancarios.banco, 'codage': this.nota.dados_bancarios.agencia, 'ccbfav': this.nota.dados_bancarios.conta, 'tiptcc': this.nota.dados_bancarios.tipo}
          if ((_.filter(this.opcoesContasExistentesFavorecido, dadosNovos)).length === 0) {
            this.opcoesContasExistentesFavorecido.push(dadosNovos)
            _.remove(this.nota.favorecido.incluidos, dadosNovos)
            this.nota.favorecido.incluidos.push(dadosNovos)
            _.remove(this.nota.favorecido.excluidos, dadosNovos)
          }
          this.nota.favorecido.dadosBancariosSelecionados = dadosNovos
          this.selecionaDadosBancariosFavorecido(dadosNovos)
          this.mostrarIncluindoConta = false
          this.$forceUpdate()
        }
      },

      favorecidoDadosBancariosCancelar () {
        this.mostrarIncluindoConta = false
        this.selecionaDadosBancariosFavorecido(this.nota.favorecido.dadosBancariosSelecionados)
      },

      emitir (relatorio) {
        this.loading.tela = true
        this.projeto['Numero_projeto'] = _.has(this.projeto, 'Numero_projeto') ? this.projeto['Numero_projeto'] : this.projeto.Projeto.substring(0, 5)
        if (!_.toSafeInteger(this.projeto['Numero_projeto']) > 0) {
          this.$snotify.error('Há algum erro ao pegar o número deste projeto. Favor informar o administrador do sistema')
          return
        }
        let parametros = '<ECodEmp=1><ENumPrj=' + this.projeto['Numero_projeto'] + '>'
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
        // Suporte 61615 - Ajuste para definir o nome do arquivo no download no formato YYYYMMDD ID PG/PC/RE
        // Suporte 62097 - inclusão do número do projeto para o caso de PC
        let tipoProcesso = ''
        switch (vm.processo) {
          case 'PAGAMENTO':
            tipoProcesso = 'PG'
            break
          case 'PRESTACAO_DE_CONTAS':
            tipoProcesso = 'PC ' + this.projeto.Numero_projeto
            break
          case 'RESSARCIMENTO':
            tipoProcesso = 'RE'
            break
        }
        let ie = !!window.MSInputMethodContext && !!document.documentMode
        if (relatorio !== 200) {
          if (!ie) {
            let blob = file
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = 'Relatório ' + relatorio + ' » ' + vm.projeto.Projeto
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          } else {
            let blob = file
            let link = document.createElement('blob')
            link.href = window.navigator.msSaveOrOpenBlob(blob, item.name)
            link.download = 'Relatório ' + relatorio + ' » ' + vm.projeto.Projeto
            link.click()
          }
        } else {
          if (!ie) {
            let blob = file
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            // 70137 - Inserir valor da tarefa no nome do arquivo
            link.download = moment(vm.data_edicao).format('YYYYMMDD') + ' ID ' + vm.id + ' - ' + tipoProcesso + ' VALOR ' + vm.totais.projeto.total.solicitado
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          } else {
            let blob = file
            let link = document.createElement('blob')
            link.href = window.navigator.msSaveOrOpenBlob(blob, item.name)
            // 70137 - Inserir valor da tarefa no nome do arquivo
            link.download = moment(vm.data_edicao).format('YYYYMMDD') + ' ID ' + vm.id + ' - ' + tipoProcesso + ' VALOR ' + vm.totais.projeto.total.solicitado
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
      // 61191 - Verificar as contas do fornecedor informado na solicitação
      buscaDadosbancariosFornecedor (cpfcgc) {
        axiosLaravel.get('pagamento/dadosBancariosFornecedores/' + cpfcgc).then((response) => {
          let dadosBancarios = response.data
          // formata dados para filtro único
          let dadosBancariosFormat = dadosBancarios.map((item) => {
            item.banco = item.banco.replace(/^0+/, '')
            item.banco = item.banco.padStart(3, '0')
            // TODO - fazer isso pra todos os bancos que nao exigem digito na conta
            if (item.banco === '104' && item.agencia.length > 4) {
              item.agencia = item.agencia.slice(0, -1)
            }
            item.agencia = item.agencia.replace('-', '').toUpperCase()
            item.conta = parseInt(item.conta.replace('-', ''), 10)
            return item
          })

          // filtra registros potencialmente repetidos
          let arrayUnique = _.uniqBy(dadosBancariosFormat, ({agencia, conta}) => agencia + ':' + conta)

          // formata dados para apresentação ao usuário (digitos de agencia e conta)
          let dadosFormatados = arrayUnique.map((item) => {
            if (item.agencia.length > 4) {
              item.agencia = item.agencia.substring(0, item.agencia.length - 1) + '-' + item.agencia.substring(item.agencia.length - 1)
            }
            item.conta = String(item.conta)
            item.conta = item.conta.substring(0, item.conta.length - 1) + '-' + item.conta.substring(item.conta.length - 1)
            return item
          })

          // valida dados
          for (let i = 0; i < dadosFormatados.length; i++) {
            if (!this.validaDadosBancariosFornecedor(dadosFormatados[i].banco, dadosFormatados[i].agencia, dadosFormatados[i].conta)) {
              console.log(dadosFormatados[i])
              dadosFormatados.splice(i, 1)
            }
          }

          // TO DO verifica se ainda assim existem dados repetidos, com diferenças entre o digito da agencia e da conta
          // em caso positivo, leva em consideração o mais recente

          console.log('dados bancarios lenght: ', dadosBancarios.length)
          console.log(dadosBancarios)
          console.log('dados bancarios unicos lenght: ', dadosFormatados.length)
          console.log(dadosFormatados)
          this.dadosBancariosFornecedores = dadosFormatados
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      limpaDadosBancarios () {
        this.nota.forma_pagamento = null
        this.nota.favorecido.dadosBancariosSelecionados = ''
        this.dadosBancariosFornecedores = []
        this.nota.dados_bancarios.banco = ''
        this.nota.dados_bancarios.agencia = ''
        this.nota.dados_bancarios.conta = ''
        this.nota.dados_bancarios.tipo = ''
        this.bancoSelecionado = null
        this.tipoContaSelecionado = null
      },
      selecionaDadosBancariosFornecedor (item) {
        this.nota.dados_bancarios.banco = ''
        this.nota.dados_bancarios.agencia = ''
        this.nota.dados_bancarios.conta = ''
        this.nota.dados_bancarios.tipo = ''
        this.nota.dados_bancarios.banco = item ? item.banco : ''
        this.nota.dados_bancarios.agencia = item ? item.agencia : ''
        this.nota.dados_bancarios.conta = item ? item.conta : ''
        this.nota.dados_bancarios.tipo = item ? item.tipo : 1
        this.bancoSelecionado = item ? _.filter(this.listaBancos, ['codigo', this.nota.dados_bancarios.banco])[0] : null
        this.tipoContaSelecionado = item ? _.filter(this.tiposConta, ['codigo', this.nota.dados_bancarios.tipo])[0] : null
        this.$forceUpdate()
      },
      async verificaNotaDuplicada (doc) {
        console.log('VERIFICA NOTA DUPLICADA')
        let data = {
          numero: doc.documentos_liberacao.numero,
          identificador: doc.documentos_liberacao.dados_bancarios.fornecedor.identificador,
          serie: doc.documentos_liberacao.serie,
          id: doc.id
        }
        await axiosLaravel.post('processos/tarefas/validaDocumentoAnalisePrestacao', data).then((response) => {
          console.log('PASSOU')
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
            console.log('ERRO')
          })
      },
      ehProjetoComRestricaoPagamentoServico () {
        // Se for pagamento e for projeto elegível para bloquear pagamento de serviços, aplica restrição
        let naoEhExecutadoPelaFundacaoBB = (parseInt(this.projeto.fk_entidade) !== 1439) // Projetos executados pela Fundação não devem ter restrição, conforme suporte 66701
        let ehPagamento = (this.processo === 'PAGAMENTO')
        let projetoAprovadoAposRegra = this.projeto.dateAprovacao > (new Date('2022-10-01')) // data de corte para os projetos com restricao
        return (naoEhExecutadoPelaFundacaoBB && ehPagamento && projetoAprovadoAposRegra) // true se for projeto com restrição
      },
      abrirChamado () {
        let urlString = ''
        let projeto = this.projeto.Numero_projeto
        let processo = this.processo
        let idTarefa = null

        if (this.etapa === 'Revisão') {
          idTarefa = this.validacao.fk_processos
        }
        urlString = `/cadastro/chamado/criar?projeto=${projeto}&processo=${processo}&idTarefa=${idTarefa}`
        console.log('Abrindo chamado')
        window.open(urlString, '_blank')
      },
      saiDaTela () {
        if (this.usuarioLogado.userType === 'FUNDACAO') {
          this.$router.go(-1)
        } else {
          this.$router.push('/solicitacao/lista')
        }
      },
      mudarTipoDocumento (tipo) {
        this.tipoDocumento = tipo
        this.$forceUpdate()
      }
    }
  }
</script>

<style>
  /* Chrome, Safari, Edge, Opera */
  #solicitacao input::-webkit-outer-spin-button, #solicitacao input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  #solicitacao input[type=number] {
    -moz-appearance: textfield;
  }

  #solicitacao .editarItem {
    background: #fffcf2 !important;
  }

  #solicitacao .solicitacoesItem {
    background: #cff0ff !important;
  }

  #solicitacao .quadroEdicaoItem, #solicitacao .quadroSolicitacoesItem, .cronogramaff .edicaoItem {
    border: 1px solid white;
    padding: 15px 20px 0px 0px;
    box-shadow: 0px 0px 20px 2px rgba(0,0,0,.4) !important;
    background-color: #f5f5f5;
  }

  #solicitacao {
    width: 100%;
    --cor-padrao: black;
    --cor-fraca: silver;
    --cor-destaque: cornflowerblue;
    --cor-alerta: darkgoldenrod;
    --cor-atencao: #dd4b39;
    --cor-borda: rgb(221, 221, 221);
    /**/
    --cor-verde: forestgreen;
    --cor-azul: steelblue;
    --cor-vermelha: tomato;
    --cor-cinza: silver;
    --cor-branca: white;
  }

  #solicitacao .centralizado, .parcelasAdiantamento .centralizado, .municipalizacao .centralizado, .cronogramaff .centralizado, #adiantamentosConcedidos .centralizado {
    text-align: center !important;
  }

  #solicitacao .direita, .parcelasAdiantamento .direita, .municipalizacao .direita, .cronogramaff .direita {
    text-align: right !important;
  }

  #solicitacao .esquerda, .parcelasAdiantamento .esquerda, .municipalizacao .esquerda, .cronogramaff .esquerda {
    text-align: left !important;
  }

  #solicitacao .atividade, .parcelasAdiantamento .atividade, .municipalizacao .atividade, .cronogramaff .atividade {
    background: rgb(223, 228, 235) !important;
    font-weight: bold;
  }

  #solicitacao .nome_atividade, .parcelasAdiantamento .nome_atividade {
    width: 60%;
  }

  #solicitacao .celula, .parcelasAdiantamento .celula, .cronogramaff .celula {
    padding: 3px 10px !important;
  }
  #solicitacao .b0, .parcelasAdiantamento .b0, .cronogramaff .b0 {
    border: 0px !important;
  }
  #solicitacao .b1, .parcelasAdiantamento .b1, .cronogramaff .b1 {
    border-top: 1px solid var(--cor-borda) !important;
  }
  #solicitacao .b2, .parcelasAdiantamento .b2, .cronogramaff .b2 {
    border-right: 1px solid var(--cor-borda) !important;
  }
  #solicitacao .b3, .parcelasAdiantamento .b3, .cronogramaff .b3 {
    border-bottom: 1px solid var(--cor-borda) !important;
  }
  #solicitacao .b4, .parcelasAdiantamento .b4, .cronogramaff .b4 {
    border-left: 1px solid var(--cor-borda) !important;
  }
  #solicitacao .borda, .parcelasAdiantamento .borda, .cronogramaff .borda {
    border: 1px solid var(--cor-borda) !important;
  }

  #solicitacao .cabecalho th, .parcelasAdiantamento .cabecalho th, .cronogramaff .cabecalho th {
    border: 0 !important;
    color: var(--cor-fraca);
    font-weight: normal !important;
    vertical-align: bottom !important;
    padding: 0 !important;
  }

  #solicitacao .adiantavel, .parcelasAdiantamento .adiantavel, .cronogramaff .adiantavel {
    color: var(--cor-destaque);
    font-style: italic;
  }

  #solicitacao .esmaecido, .parcelasAdiantamento .esmaecido, .cronogramaff .esmaecido  {
    float: left;
    width: 50%;
    color: var(--cor-fraca);
  }

  #solicitacao .conta_financeira, .parcelasAdiantamento .conta_financeira, .cronogramaff .conta_financeira {
    float: right;
    width: 50%;
    color: var(--cor-fraca);
  }

  #solicitacao .observacao, .parcelasAdiantamento .observacao, .cronogramaff .observacao {
    /*font-weight: bold;*/
    color: var(--cor-padrao);
    width: 100%;
    float: left;
  }

  #solicitacao .item_despesa, .parcelasAdiantamento .item_despesa, .cronogramaff .item_despesa {
    font-weight: bold;
    color: var(--cor-padrao);
    width: 50%;
    float: left;
  }

  #solicitacao .totais, .parcelasAdiantamento .totais, .municipalizacao .totais, .cronogramaff .totais {
    width: 100%;
    border: 1px solid var(--cor-borda);
  }

  #solicitacao .totais .valor, .parcelasAdiantamento .totais .valor, .municipalizacao .totais .valor, .cronogramaff .totais .valor {
    color: var(--cor-padrao);
    font-weight: bold;
  }

  #solicitacao .totais .saldo, .parcelasAdiantamento .totais .saldo, .municipalizacao .totais .saldo {
    color: var(--cor-destaque);
  }

  #solicitacao .totais .saldonegativo, .parcelasAdiantamento .totais .saldonegativo, .municipalizacao .totais .saldonegativo {
    color: var(--cor-atencao);
  }

  #solicitacao .atencao, .parcelasAdiantamento .atencao, .municipalizacao .atencao {
    color: white !important;
    background: var(--cor-atencao) !important;
    padding: 0.1em 0.4em;
    border-radius: 0.25em;
  }

  #solicitacao .alerta, .parcelasAdiantamento .alerta, .municipalizacao .alerta {
    color: var(--cor-atencao) !important;
  }

  #solicitacao .economicidade {
    color: var(--cor-destaque) !important;
  }

  #solicitacao .id_item {
    color: var(--cor-destaque) !important;
    font-style: italic;
    margin-right: 10px;
  }

  #solicitacao label.checkbox-inline {
    padding-top: 0 !important;
  }

  #solicitacao .ciente_declaracoes i {
    font-size: 18px;
    margin-right: 5px;
    cursor: pointer;
  }

  /********************/

  #solicitacao .qtdeSolicitacao {
    width: 60px;
  }
  #solicitacao .valorSolicitacao {
    width: 100px;
  }

  .skin-fbb input.datepicker[disabled='disabled'] {
    background-color: #eee !important;
  }

  #solicitacao .qtde_pendente input, #solicitacao .valor_pendente input {
    border: 1px solid var(--cor-vermelha);
  }

  #solicitacao .valor_pendente:after, #solicitacao .qtde_pendente:after {
    content: "Pendente";
    display: inline;
    padding: 0.2em 0.6em 0.3em;
    font-size: 75%;
    font-weight: 700;
    line-height: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25em;
    background-color: #dd4b39
  }
  #solicitacao .qtde_acima:after {
    content: "Acima";
    display: inline;
    padding: 0.2em 0.6em 0.3em;
    font-size: 75%;
    font-weight: 700;
    line-height: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25em;
    background-color: #dd4b39
  }
  .etiquetaCarregando {
    margin-left: 10px;
    color: var(--cor-azul);
  }

  .fornecedorGridContainer {
    height: 50px;
    border: 2px solid #eee;
    border-radius: 5px;
    background: #eee;
  }
  .border-test{
    border: 2px solid red;
  }
  button#botao_concluir {
    padding:0.8em 1.2em;
    background-color: var(--cor-sucesso);
    color:#ffffff;
    font-size:12px;
    font-family:inherit;
    border:none;
    transition: opacity 200ms;
    box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
    margin-top:1px;
  }
  #botao_concluir:hover {
    opacity: 0.7;
    animation-name: concluir_hover;
    animation-duration: 200ms;
  }
  #botao_concluir[disabled], #botao_concluir[disabled]:hover {
    opacity: 0.3;
    cursor:not-allowed;
  }
  .listaDirigentes .cabecalho {
    font-weight: bold;
  }
  @keyframes concluir_hover {
  from {
    scale:0.9
  }

  50% {
    scale:1.1
  }
  to {
    scale: 1;
  }
}

#alertaValorOriginal {
  border-radius: 0.5rem;
  border: 0px;
  background-color: #fff9c4;
  padding: 35px 45px;
  box-shadow: 1px 1px 15px #444;
  z-index: 999999;
  position: fixed;
}
#alertaValorOriginal button {
  color: #002D4B;
}
#alertaValorOriginal::backdrop {
  background-color: #222222;
  opacity: 0.8;
}

</style>
