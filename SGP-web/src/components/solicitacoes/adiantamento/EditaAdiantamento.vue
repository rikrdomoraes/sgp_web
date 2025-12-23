<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <section class="content-header">
      <h1>
        <span v-if="ehVisualizacao">Visualizar {{descricaoProcesso[processo]}} {{!_.isNull(id) ? 'ID ' + id : ''}}</span>
        <span v-else-if = "etapa === 'Análise Financeira'">Acerto Contábil de {{descricaoProcesso[processo]}} {{!_.isNull(id) ? 'ID ' + id : ''}}</span>
        <span v-else>{{etapa}} de {{descricaoProcesso[processo]}} {{!_.isNull(id) ? 'ID ' + id : ''}}</span>

        <div class="espacamento_botoes"></div>

        <span v-if="(!loading.processo && !loading.tarefa && !loading.adiantamentos && !loading.projetos) || ehVisualizacao">
          <g-button-moema color="warning" @click.native="$router.go(-1)" type="button"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</g-button-moema>
        </span>

        <div class="espacamento_botoes"></div>

        <span v-show="(!loading.processo && !loading.tarefa && !loading.adiantamentos && !loading.projetos)" v-if="usuarioLogado.userType === 'FUNDACAO' && (!_.isEmpty(projeto) || !_.isNull(id)) && restricaoParaInicializar.length === 0">
          <g-button-ujarak color="primary" size="button--size-ss" @click.native="emitir(199)" href="javascript:void(0)" v-if="!_.isNull(id) && processo === 'ADIANTAMENTO'"
                           :title="'<h5>199 - Comunicado Interno de Adiantamento (PDF)</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
            <i class="fa fa-print" aria-hidden="true"></i> 199
          </g-button-ujarak>

          <g-button-ujarak color="primary" size="button--size-ss" @click.native="emitir(219)" href="javascript:void(0)"
                           :title="'<h5>219 - Adiantamentos (PDF)</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
            <i class="fa fa-print" aria-hidden="true"></i> 219
          </g-button-ujarak>

          <g-button-ujarak color="primary" size="button--size-ss" @click.native="emitir(222)" href="javascript:void(0)"
                           :title="'<h5>222 - Extrato de Projeto (PDF)</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
            <i class="fa fa-print" aria-hidden="true"></i> 222
          </g-button-ujarak>

          <g-button-ujarak color="primary" size="button--size-ss" @click.native="emitir(248)" href="javascript:void(0)"
                           :title="'<h5>248 - Monitoramento Administrativo</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
            <i class="fa fa-print" aria-hidden="true"></i> 248
          </g-button-ujarak>

          <g-button-ujarak color="primary" size="button--size-ss" @click.native="onDownloadZIP()"
                           :title="'<h5>Faz o download de todos os arquivos da solicitação (zip)</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}"
                           v-if="usuarioLogado.userType !== 'ENTIDADE' && etapa !== 'Solicitação'">
                            <i class="fa fa-download" aria-hidden="true">&nbsp;Baixar arquivos</i>
          </g-button-ujarak>
        </span>

        <div class="espacamento_botoes"></div>


        <span v-if="(!loading.processo && !loading.tarefa && !loading.adiantamentos && !loading.projetos) && !_.isEmpty(projeto) && !ehVisualizacao && restricaoParaInicializar.length === 0"
              :title="'<h5>' + (_.includes(['Solicitação', 'Revisão'], etapa) ? 'Ao Concluir esta solicitação será encaminhada para Análise da Fundação BB' : (aprovacao.resultadoAprovacao ? 'Será encaminhado para ' + aprovacao.resultadoAprovacao : 'Aguadando decisão')) + '</h5>'"
              v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
          <g-button-moema color="success" @click.native="concluir" type="button"><i class="fa fa-check" aria-hidden="true"></i> Concluir</g-button-moema>
        </span>

        <span v-if="!_.includes(['Solicitação', 'Revisão'], etapa) && usuarioLogado.userType === 'FUNDACAO' && !loading.tela && !loading.cronograma && !_.isEmpty(projeto) && !ehVisualizacao && restricaoParaInicializar.length === 0"
                    :title="'<h5>Salva esta solicitação<br/>Para encaminhá-la deve-se usar o botão de Concluir' + (usuarioLogado.userType === 'ENTIDADE' && poderes.codigo !== 'DIRIGENTE_SEM_RESTRICAO' ? '<br/>Somente dirigentes estão habilitados para concluir solicitações' : (poderes.mensagem.length > 0 ? '<br/>Restrições:<br/>' + _.join(poderes.mensagem, ', ') : '')) + '</h5>'"
                    v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
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
            <div v-show="loading.processo || loading.tarefa || loading.adiantamentos || loading.projetos" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
            <span v-if="!_.isEmpty(chamado) && usuarioLogado.userType === 'FUNDACAO'" style="color: red; font-size: medium">&nbsp;* Atenção: O processo que será analisado possui chamado vinculado - <b>
                  <span v-for="(c, index) in chamado">
                    <router-link target="_blank" :to="{name: 'cadastro-chamado-edita',  params: { id: c.id}}"> {{c.id}} <span v-if="chamado.length > 1 && index === 0">, &nbsp;</span></router-link>
                </span>
              </b>
            </span>

            <p v-if="adiantamentoSolicitado.suporteFbb.length > 0 && usuarioLogado.userType === 'FUNDACAO'" style="color: red; font-size: medium">
              ** Atenção: Este processo possui {{ adiantamentoSolicitado.suporteFbb.length > 1 ? 'os seguintes suportes vinculados' : 'este suportes vinculado' }}:
              <a v-for="suporte in adiantamentoSolicitado.suporteFbb" :href="'https://suporte.fbb.org.br/ocomon/geral/mostra_consulta.php?numero=' + suporte.numero" target="_blank" style="font-weight: bold; padding-left: 10px">{{suporte.numero}}</a>
            </p>

            <p v-if="adiantamentoSolicitado.suporteFbb.length > 0 && usuarioLogado.userType === 'FUNDACAO'" style="color: red; font-size: medium">
              ** Atenção: Este processo possui {{ adiantamentoSolicitado.suporteFbb.length > 1 ? 'os seguintes suportes vinculados' : 'este suportes vinculado' }}:
              <a v-for="suporte in adiantamentoSolicitado.suporteFbb" :href="'https://suporte.fbb.org.br/ocomon/geral/mostra_consulta.php?numero=' + suporte.numero" target="_blank" style="font-weight: bold; padding-left: 10px">{{suporte.numero}}</a>
            </p>
            <div v-if="_.includes(['PRESTACAO_DE_CONTAS', 'PAGAMENTO', 'ADIANTAMENTO', 'RESSARCIMENTO'], processo) && _.includes(['Solicitação'], etapa) && projetoComAlteracaoEmAndamento"  class="alert alert-danger alert-dismissible">
                  <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
                  <h4><i class="fa fa-warning"></i> Atenção!</h4>
                  <p>Solicitação não disponível. Verificamos que há uma alteração de projetos em andamento.</p>
                </div>

            <div class="box-header">
              <h3 class="box-title">
                <i class="fa fa-pencil" aria-hidden="true"></i>
                {{projeto.Projeto}}
                <span v-if="usuarioLogado.userType === 'FUNDACAO' && _.has(projeto, 'Status_ERP')">
                  (<strong>{{projeto.Status_ERP}}</strong>)
                    <router-link :title="'<h5>Ir para a página do Projeto</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'small', arrow : true }" :to="{name: 'projeto', params: { numero: projeto.Numero_projeto }}" target="_blank">&nbsp<i class="fa fa-external-link"></i></router-link>
                  </span>
              </h3>
            </div>
            <div class="box-body">

              <div class="form-horizontal">

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
                                    <td class="celula centralizado borda">{{ dirigente.dt_fim_mandato| moment("L")}}</td>
                                </tr>
                                </tbody>

                              </table>
                            </div>

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
                    



                <!-- Adiantamentos Concedidos ----------------------------------------------------------------------------------------------------------------->
                <div class="box-body" id="adiantamentosConcedidos" v-if="adiantamentosConcecidos.length > 0 && _.has(adiantamentosConcecidos[0], 'id')">
                  <div class="box-header">
                    <h3 class="box-title">Adiantamentos Concedidos</h3>
                  </div>

                  <div>

                    <div class="col-md-12">
                      <div class="table-responsive">
                        <table class="table table-condensed table-bordered">
                          <thead>
                          <tr>
                            <th class="centralizado borda w10" :title="'<h5>Id da solicitação de adiantamento</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true}">ID</th>
                            <th class="centralizado borda w15" :title="'<h5>Número da parcela (ordem) do adiantamento</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Parcela</th>
                            <th class="centralizado borda w15" :title="'<h5>Data quando foi feita a solicitação de liberação do adiantamento</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Data da solicitação</th>
                            <th class="centralizado borda w15" :title="'<h5>Valor da parcela no instrumento legal</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Valor previsto</th>
                            <th class="centralizado borda w15" :title="'<h5>% Comprovada da parcela, considerando somente prestações de contas efetivamente aprovadas pela Fundação</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true}">% Comprov.</th>
                            <th class="centralizado borda w15" :title="'<h5>Valor solicitado dentro do limite total da parcela</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Valor adiantado</th>
                            <th class="centralizado borda w15" :title="'<h5>Data limite para realizar as Prestações de Contas para esta parcela</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Data limite para prestação</th>
                            <th class="centralizado borda w15" :title="'<h5>Data da última Prestação de Contas solicitda para esta parcela</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Data da última prestação</th>
                          </tr>
                          </thead>

                          <tbody>

                          <!-- Tabela -->
                          <template v-for="adiantamento in adiantamentosConcecidos">
                            <tr>
                              <td class="celula centralizado borda">
                                {{adiantamento.id}}

                                <!-- funcionalidade desabilitada, porque não esta passando os parâmetros -->
                                <router-link v-if="false" :title="'<h5>Clique aqui para abrir este processo de solicitação de adiantamento realizado</h5>'" v-tippy="{ inertia:true, placement:'right', animation:'perspective', distance:'1', size: 'large', arrow:true }"
                                             :to="{name: 'solicitacao-adiantamento', params: {id: adiantamento.id, visualizacao: true}}" target="_blank">
                                  <i class="fa fa-external-link"></i>
                                </router-link>
                              </td>
                              <td class="celula centralizado borda">
                                {{adiantamento.parcela}} <span style="color: var(--cor-destaque); font-size: x-small">{{adiantamento.recurso}}</span>
                              </td>
                              <td class="celula centralizado borda">{{adiantamento.data_solicitacao | moment("L")}}</td>
                              <td class="celula centralizado borda">{{adiantamento.contratado | real}}</td>
                              <!-- <td class="celula centralizado borda">{{(adiantamento.percentual_comprovado * 100).toFixed(2)}} % </td> Alterado em atendimento ao chamado 67.409, pra exibir o valor conforme o cálculo aplicado na restrição -->
                              <td class="celula centralizado borda"><span :style="(((adiantamento.requisitado - (adiantamento.em_execucao + adiantamento.pendente_comprovacao)) / adiantamento.requisitado)) < 0.8 ? 'color: var(--cor-vermelha)' : '' ">{{ (((adiantamento.requisitado - (adiantamento.em_execucao + adiantamento.pendente_comprovacao)) / adiantamento.requisitado) * 100).toFixed(2) }} %</span></td>
                              <td class="celula centralizado borda">{{adiantamento.requisitado | real}}</td>
                              <td class="celula centralizado borda">{{adiantamento.data_limite_prestacao | moment("L")}}</td>
                              <td class="celula centralizado borda">{{adiantamento.data_ultima_prestacao | moment("L")}}</td>
                            </tr>
                          </template>

                          </tbody>
                        </table>
                      </div>

                    </div>

                    <!-- Totais dos adiantamentos concedido -->
                    <div class="col-md-12">
                      <table class="totais">
                        <tr>
                          <td style="padding:10px; font-size: 1.5rem;" class="centralizado"><span>Total de adiantamento já liberado</span></td>
                          <td style="padding:10px; font-size: 1.5rem;" class="centralizado"><span>Total de Prestação de contas em execução</span></td>
                          <td style="padding:10px; font-size: 1.5rem;" class="centralizado"><span>Total Pendente de Prestação de contas</span></td>
                        </tr>
                        <tr>
                          <td style="padding:10px;font-size: 2rem;" class="centralizado valor">
                              <span :title="'<h5>Valor total já solicitado de adiantamento para esta projeto</h5>'" v-tippy="{ inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                                {{totais.liberado | real}}
                              </span>
                          </td>
                          <td style="padding:10px;font-size: 2rem;" class="centralizado valor">
                              <span :title="'<h5>Valor total de prestações de contas Em Execução (solicitadas mas ainda não aprovadas pela Fundação BB)</h5>'" v-tippy="{ inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                                {{totais.emExecucao | real}}
                              </span>
                          </td>
                          <td style="padding:10px;font-size: 2rem;" class="centralizado valor">
                              <span :title="'<h5>Valor total pendente de prestação de contas é o total de adiantamento solicitado subtraindo prestações solicitadas e adicionando devoluções realizadas</h5>'" v-tippy="{ inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                                {{totais.pendenteComprovacao | real}}
                              </span>
                          </td>
                        </tr>
                      </table>
                    </div>

                  </div>

                </div>




                <!-- Solicitação de Adiantamento ----------------------------------------------------------------------------------------------------------------->
                <div class="box-body" id="parcelasAdiantamentoDisponiveis" v-if="restricaoParaInicializar.length === 0 && parcelasAtuais.length > 0">
                  <div class="box-header">
                    <h3 class="box-title">{{processo === 'ADIANTAMENTO' ? (projeto.parcelas_contratadas > 1 ? 'Parcelas Adiantáveis' : 'Parcela Adiantável') : 'Valor para Devolução'}}</h3>
                    <span v-if="projeto.superior === 18182 && projeto.parcelas_contratadas === 1" style="color: var(--cor-destaque)">Este projeto tem parcela única e deve ser liberado integralmente</span>
                  </div>

                  <div>
                    <div class="col-md-12">
                      <div class="table-responsive">
                        <table class="table table-condensed table-bordered">
                          <thead>
                          <tr>
                            <th class="centralizado borda" :title="'<h5>Número da parcela (ordem) do adiantamento</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true}" v-if="processo === 'ADIANTAMENTO'">Parcela</th>
                            <th class="centralizado borda" :title="'<h5>Origem do recurso financeiro</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Recurso</th>
                            <th class="centralizado borda" :title="'<h5>' + (processo === 'ADIANTAMENTO' ? 'Total orçado do recurso nesta parcela' : 'É o total do valor adiantado que ainda não foi prestado contas nem devolvido') + '</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true}">{{processo === 'ADIANTAMENTO' ? 'Valor total' : 'Total pendente'}}</th>

                            <th v-if="parcelasAtuais.length > 1 && processo === 'ADIANTAMENTO' && _.includes(['Solicitação', 'Revisão'], etapa)" class="centralizado borda" :title="'<h5>' + (processo === 'ADIANTAMENTO' ? 'Total disponível do recurso nesta parcela considerando os totais do projeto' : 'É o total do valor adiantado disponível que ainda não foi prestado contas nem devolvido') + '</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'top'}">Valor disponível</th>

                            <th class="centralizado borda" :title="'<h5>' + (processo === 'ADIANTAMENTO' ? 'Valor solicitado dentro do limite total da parcela' : 'Limite que pode devolver nesta solicitação') + '</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true}">{{processo === 'ADIANTAMENTO' ? 'Valor solicitado' : 'Valor para devolução'}}</th>
                            <th class="centralizado borda" :title="'<h5>' + (processo === 'ADIANTAMENTO' ? 'Total não solicitado nesta parcela' : 'Valor pendente de devolução ou prestação de contas') + '</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true}">{{processo === 'ADIANTAMENTO' ? 'Saldo restante' : 'Total Restante'}}</th>
                            <th class="centralizado borda" :title="'<h5>Número do título que será gerado no Sapiens</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true}" v-if="processo === 'ADIANTAMENTO' && usuarioLogado.userType === 'FUNDACAO' && !_.includes(['Solicitação', 'Revisão'], etapa)">Número do Título</th>
                            <th class="centralizado borda" :title="'<h5>Conta financeira de adiantamento ao qual o projeto esta vinculado</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true}" v-if="processo === 'ADIANTAMENTO' && usuarioLogado.userType === 'FUNDACAO' && !_.includes(['Solicitação', 'Revisão'], etapa)">Conta Financeira</th>
                            <th class="centralizado borda" :title="'<h5>Conta de tesouraria ao qual o projeto esta vinculado</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true}" v-if="processo === 'ADIANTAMENTO' && usuarioLogado.userType === 'FUNDACAO' && !_.includes(['Solicitação', 'Revisão'], etapa)">Conta de Tesouraria</th>
                          </tr>
                          </thead>

                          <tbody>

                          <!-- Tabela -->
                          <template v-for="(parcela, idx) in parcelasAtuais">
                            <tr>
                              <td class="celula centralizado borda" v-if="processo === 'ADIANTAMENTO'">{{parcela.parcela}}</td>
                              <td class="celula centralizado borda">{{parcela.resourceSource}}</td>

                              <!-- Valor Disponível, Requisitado e a diferença não requisitada -->
                              <td :class="'celula centralizado borda ' + (processo === 'ADIANTAMENTO' ? 'w15' : 'w20')" :rowspan="parcelasAtuais.length" v-if="idx === 0">{{parcela.disponivel | real}}</td>

                              <!-- Limite de solicitação de adiantamento somente para solicitação e revisão em parcelas mistas -->
                              <td class="celula centralizado borda w15" v-if="parcelasAtuais.length > 1 && processo === 'ADIANTAMENTO' && _.includes(['Solicitação', 'Revisão'], etapa)">
                                <span v-if="(parcela.resourceSource === 'FUNDACAO' ? totais.projeto.fbb.limite : totais.projeto.parceiros.limite) < parcela.disponivel" class="atencao" style="background: steelblue !important;" :title="'<h5>Este é o valor restante no projeto em recursos de ' + parcela.resourceSource + '</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                                  {{_.round((parcela.resourceSource === 'FUNDACAO' ? totais.projeto.fbb.limite : totais.projeto.parceiros.limite) - parcela.requisitado, 2) | real}}
                                </span>
                                <span v-else>
                                  {{_.round(parcela.disponivel - parcela.requisitado, 2) | real}}
                                </span>
                              </td>
                              <td :class="'celula centralizado borda ' + (processo === 'ADIANTAMENTO' ? 'w15' : 'w20')">
                                <money v-if="(processo === 'ADIANTAMENTO')" v-model="parcela.requisitado" name="valor a solicitar" class="form-control valorSolicitacao" type="text"
                                       @keyup.native="parcela.requisitado = limitaFaixaEntrada('decimal', parcela.requisitado, 0,
                                       ((parcela.resourceSource === 'FUNDACAO' ? totais.projeto.fbb.limite : totais.projeto.parceiros.limite) < parcela.disponivel) ?
                                       (parcela.resourceSource === 'FUNDACAO' ? totais.projeto.fbb.limite : totais.projeto.parceiros.limite) : parcela.disponivel)"
                                       @blur.native="calcularTotaisAdiantamento" :disabled="ehVisualizacao || !_.includes(['Solicitação', 'Revisão', 'Análise'], etapa) || (projeto.superior === 18182 && projeto.parcelas_contratadas === 1)"></money>
                                <!-- Suporte 66.712 -->
                                <money v-if="(processo === 'DEVOLUCAO_DE_ADIANTAMENTO')" v-model="parcela.requisitado" name="valor a solicitar" class="form-control valorSolicitacao" type="text"
                                       @blur.native="calcularTotaisAdiantamento" :disabled="ehVisualizacao || !_.includes(['Solicitação', 'Revisão', 'Análise'], etapa)"></money>
                              </td>

                              <td v-if="parcelasAtuais.length === 1" :class="'celula centralizado borda ' + (processo === 'ADIANTAMENTO' ? 'w15' : 'w20')">{{_.round((parcela.disponivel - parcela.requisitado), 2) | real}}</td>

                              <td v-else-if="idx === 0" :class="'celula centralizado borda ' + (processo === 'ADIANTAMENTO' ? 'w15' : 'w20')" :rowspan="parcelasAtuais.length">
                                <!-- <span :class="_.round(((_.sumBy(parcelasAtuais, 'disponivel')/2) - _.sumBy(parcelasAtuais, 'requisitado')), 2) < 0 ? 'atencao' : ''"> Alterado em atendimento ao sup 67456 -->
                                <span :class="_.round(((_.sumBy(parcelasAtuais, 'disponivel')) - _.sumBy(parcelasAtuais, 'requisitado')), 2) < 0 ? 'atencao' : ''">
                                  <!-- {{_.round(((_.sumBy(parcelasAtuais, 'disponivel')/2) - _.sumBy(parcelasAtuais, 'requisitado')), 2) | real}} Alterado em atendimento ao sup 67456 -->
                                  {{_.round((_.sumBy(parcelasAtuais, 'disponivel') - _.sumBy(parcelasAtuais, 'requisitado')), 2) | real}}
                                </span>
                              </td>

                              <!-- Número do titulo e conta financeira -->
                              <td class="celula centralizado borda w15" v-if="processo === 'ADIANTAMENTO' && usuarioLogado.userType === 'FUNDACAO' && !_.includes(['Solicitação', 'Revisão'], etapa)">
                                <span v-if="parcela.requisitado > 0" :class="{ 'has-error' : errors.first('número do título da parcela ' + parcela.parcela + ' de ' + parcela.resourceSource)}">
                                  <input v-model="parcela.numeroTitulo" :name="'número do título da parcela ' + parcela.parcela + ' de ' + parcela.resourceSource"
                                         class="form-control valorSolicitacao" @keyup.native="parcela.numeroTitulo = limitaFaixaEntrada('inteiro', parcela.numeroTitulo, 0, 99999999)"
                                         v-validate="'required'" type="number" :disabled="ehVisualizacao || etapa !== 'Análise'">
                                </span>
                                <span v-else>&nbsp;</span>
                              </td>

                              <td class="celula centralizado borda w20" v-if="processo === 'ADIANTAMENTO' && usuarioLogado.userType === 'FUNDACAO' && !_.includes(['Solicitação', 'Revisão'], etapa)">
                                <span v-if="parcela.requisitado > 0" :class="{ 'has-error' : errors.first('conta financeira da parcela ' + parcela.parcela + ' de ' + parcela.resourceSource)}">
                                  <select
                                          :name="'conta financeira da parcela ' + parcela.parcela + ' de ' + parcela.resourceSource"
                                          v-model="parcela.contaFinanceira"
                                          class="form-control"
                                          aria-hidden="true"
                                          :disabled="ehVisualizacao || etapa !== 'Análise'"
                                          v-validate="'required'">
                                    <option v-for="conta in contasFinanceiras" :value="conta.ctared">{{conta.ctared}} / {{conta.descta}}</option>
                                  </select>
                                </span>
                                <span v-else>&nbsp;</span>
                              </td>

                              <td class="celula centralizado borda w20" v-if="processo === 'ADIANTAMENTO' && usuarioLogado.userType === 'FUNDACAO' && !_.includes(['Solicitação', 'Revisão'], etapa)">
                                <span v-if="parcela.requisitado > 0" :class="{ 'has-error' : errors.first('conta tesouraria da parcela ' + parcela.parcela + ' de ' + parcela.resourceSource)}">
                                  <select
                                          :name="'conta tesouraria da parcela ' + parcela.parcela + ' de ' + parcela.resourceSource"
                                          v-model="parcela.contaTesouraria"
                                          class="form-control"
                                          aria-hidden="true"
                                          :disabled="ehVisualizacao || etapa !== 'Análise'"
                                          v-validate="'required'">
                                    <option v-for="conta in contasTesouraria" :value="conta.numcco">{{conta.numcco}} / {{conta.descco}}</option>
                                  </select>
                                </span>
                                <span v-else>&nbsp;</span>
                              </td>

                            </tr>
                          </template>

                          </tbody>
                        </table>
                      </div>

                    </div>


                    <!-- Totais da Solicitação -->
                    <div class="col-md-12">
                      <table class="totais">
                        <tr>
                          <td class="centralizado w30"><span>{{processo === 'ADIANTAMENTO' ? 'Valor orçado para esta parcela' : 'Total Pendente'}}</span></td>
                          <td class="centralizado w30"><span>{{processo === 'ADIANTAMENTO' ? 'Total valor solicitado' : 'Total para devolução'}}</span></td>
                          <td class="centralizado w30"><span>{{processo === 'ADIANTAMENTO' ? 'Valor disponível para solicitação nesta parcela' : 'Valor ainda não comprovado nem devolvido'}}</span></td>
                        </tr>
                        <tr>
                          <td class="centralizado valor">
                              <span :title="'<h5>' + (processo === 'ADIANTAMENTO' ? 'Valor total disponível nesta parcela do projeto' : 'Soma dos valores em aberto dos adiantamento concedidos que podem ser devolvidos') + '</h5>'" v-tippy="{ inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                                <!-- {{_.round(_.sumBy(parcelasAtuais, 'disponivel')/parcelasAtuais.length, 2) | real}} alterado no suporte 67.456 pois o saldo disponivel estava aparendo a metade quando parcela mista -->
                                {{_.round(_.sumBy(parcelasAtuais, 'disponivel'), 2) | real}}
                              </span>
                          </td>
                          <td class="centralizado valor">
                              <span :title="'<h5>Valor solicitado neste pedido de ' + _.toLower(descricaoProcesso[processo]) + '</h5>'" v-tippy="{ inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                                {{_.sumBy(parcelasAtuais, 'requisitado') | real}}
                              </span>
                          </td>
                          <td class="centralizado valor">
                              <span :title="'<h5>Valor disponível que não foi solicitado</h5>'" v-tippy="{ inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                                <!-- {{_.round(((_.sumBy(parcelasAtuais, 'disponivel')/parcelasAtuais.length) - _.sumBy(parcelasAtuais, 'requisitado')), 2) | real}} alterado no suporte 67.456 pois o saldo disponivel estava aparendo a metade quando parcela mista -->
                                {{_.round(((_.sumBy(parcelasAtuais, 'disponivel')) - _.sumBy(parcelasAtuais, 'requisitado')), 2) | real}}
                              </span>
                          </td>
                        </tr>
                      </table>
                    </div>

                  </div>

                </div>



                <!-- Dados Bancários ----------------------------------------------------------------------------------------->
                <div class="box-body" v-if="_.includes(['ADIANTAMENTO'], processo) && (!loading.processo && !loading.tarefa && !loading.adiantamentos && !loading.projetos) && restricaoParaInicializar.length === 0">
                  <div class="box-header">
                    <h3 class="box-title">Dados Bancários</h3>
                  </div>

                  <div class="row">

                    <!-- Dados Bancários ------------------------------------------------------------------------->
                    <div class="col-md-6">

                      <div>

                        <div>
                          <!-- Banco -->
                          <!-- Demanda 66506 Cadastro da conta de adiantamento -->
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
                                             :disabled="ehVisualizacao || _.includes(['Análise Financeira', 'Autorização', 'Liquidação'], etapa) || restricaoParaInicializar.length > 0 || bancoSelecionado"
                                             v-validate="{required: adiantamentoSolicitado.formaPagamento !== 4}">
                                </multiselect>
                              </div>
                              <span v-if="errors.first('banco')" class="label label-danger">{{ errors.first('banco') }}</span>
                            </div>
                          </div>

                          <!-- Agência -->
                          <!-- Demanda 66506 Cadastro da conta de adiantamento -->
                          <div class="form-group required-field" :class="{'has-error': errors.first('agência')}">
                            <label class="control-label col-md-4">Agência:</label>
                            <div class="col-md-8">
                              <div :title="'<h5> ' + (_.has(bancoSelecionado, 'digitoAgencia') && !bancoSelecionado.digitoAgencia ? 'Caso existam divergência nos dados bancários informados, gentileza <span class=\'realce\'>abrir um chamado</span>.' : 'Caso existam divergência nos dados bancários informados, gentileza <span class=\'realce\'>abrir um chamado</span>.') + ' </h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
                                <the-mask v-model="adiantamentoSolicitado.dados_bancarios.agencia"
                                  name="agência"
                                  class="form-control text-right"
                                  type="text"
                                  :mask="_.has(bancoSelecionado, 'digitoAgencia') && !bancoSelecionado.digitoAgencia ? '####' : '####-X'"
                                  :tokens="agenciaTokens"
                                  v-validate="'required'"
                                  disabled
                                  masked></the-mask>
                              </div>
                              <span v-if="errors.first('agência')" class="label label-danger">{{ errors.first('agência') }}</span>
                            </div>
                          </div>

                          <!-- Conta Corrente -->
                          <!-- Demanda 66506 Cadastro da conta de adiantamento -->
                          <div class="form-group required-field" :class="{'has-error': errors.first('conta corrente')}">
                            <label class="control-label col-md-4">Conta {{adiantamentoSolicitado.dados_bancarios.tipo === 1 ? 'Corrente' : (adiantamentoSolicitado.dados_bancarios.tipo === 2 ? 'Poupança' : '')}}:</label>
                            <div class="col-md-8">
                              <div>
                                <the-mask v-model="adiantamentoSolicitado.dados_bancarios.conta"
                                  name="conta corrente"
                                  class="form-control text-right"
                                  type="text"
                                  v-validate="'required|min:3'"
                                  :mask="['#-X', '##-X', '###-X', '####-X', '#####-X', '######-X', '#######-X', '########-X', '#########-X', '##########-X', '###########-X']"
                                  :tokens="customTokens"
                                  disabled
                                  masked></the-mask>
                              </div>
                              <span v-if="errors.first('conta corrente')" class="label label-danger">{{ errors.first('conta corrente') }}</span>
                            </div>
                          </div>

                          <!-- Tipo da Conta -->
                          <!-- Demanda 66506 Cadastro da conta de adiantamento -->
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
                                             :disabled="ehVisualizacao || _.includes(['Análise Financeira', 'Autorização', 'Liquidação'], etapa) || processo === 'PRESTACAO_DE_CONTAS' || restricaoParaInicializar.length || contaAdiantamento > 0 || adiantamentoSolicitado.dados_bancarios.tipo"
                                             v-validate="{required: adiantamentoSolicitado.formaPagamento !== 4}">
                                </multiselect>
                              </div>
                              <span v-if="errors.first('tipo da conta')" class="label label-danger">{{ errors.first('tipo da conta') }}</span>
                            </div>
                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

                <div class="box-body" v-if="parcelasEmAberto.length > 1 && processo === 'DEVOLUCAO_DE_ADIANTAMENTO'">
                  <div class="box-header">  
                    <h3 class="box-title">  
                      Parcelas em aberto  
                    </h3>  
                  </div>
                  <div class="col-md-12">
                    <div class="table-responsive">
                      <table class="table table-condensed table-bordered">
                        <thead>
                          <tr>
                            <th class="centralizado borda" style="width: 5%;">Selecionar</th>

                            <th class="centralizado borda" :title="'<h5>Número da parcela (ordem) do adiantamento</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Parcela</th>
                            <th class="centralizado borda" :title="'<h5>' + (processo === 'ADIANTAMENTO' ? 'Total orçado do recurso nesta parcela' : 'É o total do valor adiantado que ainda não foi prestado contas nem devolvido') + '</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true}">{{processo === 'ADIANTAMENTO' ? 'Valor total' : 'Total pendente na parcela'}}</th>
                            <th class="centralizado borda" :title="'<h5>' + (processo === 'ADIANTAMENTO' ? 'Valor solicitado dentro do limite total da parcela' : 'Limite que pode devolver nesta solicitação') + '</h5>'" v-tippy="{inertia:true, animation:'perspective', distance:'1', size:'large', arrow:true}">{{processo === 'ADIANTAMENTO' ? 'Valor solicitado' : 'Valor para devolução'}}</th>
                          </tr>
                        </thead>
                        
                        <tbody>
                          <!-- Tabela -->
                          <template>
                            <tr v-for="(parcela, idx) in parcelasEmAberto" :key="parcela.id">
                              
                              <!-- CÉLULA CHECKBOX -->
                              <td class="celula centralizado borda">
                                <input 
                                  type="checkbox" 
                                  :value="idx" 
                                  v-model="parcelasSelecionadas"
                                >
                              </td>
                            <!-- PARCELA -->
                              <td class="celula centralizado borda">{{parcela.parcela}}</td>
                              <!-- CÉLULA CHECKBOX -->
                              <td class="celula centralizado borda">{{parcela.em_execucao + parcela.totalPendente}}</td>
                              <!-- CÉLULA CHECKBOX -->
                              <td :class="'celula centralizado borda ' + (processo === 'ADIANTAMENTO' ? 'w15' : 'w20')">
                                <money v-if="(processo === 'DEVOLUCAO_DE_ADIANTAMENTO')"
                                      v-model="devolucoes[idx]"
                                      name="valor a solicitar"
                                      class="form-control valorSolicitacao"
                                      type="text"
                                      
                                      :disabled="ehVisualizacao || !_.includes(['Solicitação', 'Revisão', 'Análise'], etapa)">
                                </money>
                              </td>
                            </tr>
                          </template>
                        </tbody>
                      </table>
                        <button @click="salvarDevolucoes">  
                          Salvar Devoluções  
                        </button>
                    </div>
                  </div>
                </div>



                <!-- Documentos da solicitação ------------------------------------------------------------------------------------------------------------------------------>
                <div class="box-body" v-if="restricaoParaInicializar.length === 0">
                  <div class="box-header">
                    <h3 class="box-title">Documentos de solicitação de {{_.toLower(descricaoProcesso[processo])}} <span style="font-weight: bold; color: #e32;">*</span></h3>
                  </div>

                  <div class="col-md-12">
                    <upload-documentos-php :propDocumentos="adiantamentoSolicitado.documentosAdiantamento" :documentTypes="''" :disable="ehVisualizacao || _.includes(['Autorização', 'Liquidação'], etapa)" :local-uso="'SOLICITACAO_PAGAMENTO'"></upload-documentos-php>
                  </div>

                </div>


                <!-- Outros Anexos opcionais ------------------------------------------------------------------------------------------------------------------------------>
                <div class="box-body" v-if="restricaoParaInicializar.length === 0">
                  <div class="box-header">
                    <h3 class="box-title">Documentos Anexos</h3>
                  </div>

                  <div class="col-md-12">
                    <upload-documentos-php :propDocumentos="adiantamentoSolicitado.anexos" :documentTypes="''" :disable="ehVisualizacao || _.includes(['Análise Financeira', 'Autorização', 'Liquidação'], etapa)" :local-uso="'SOLICITACAO_PAGAMENTO'"></upload-documentos-php>
                  </div>

                </div> 


                <!-- Histórico do processo ----------------------------------------------------------------------------------------------------------->
                <div class="box-body" v-if="_.includes(['Revisão', 'Análise', 'Análise Financeira', 'Autorização', 'Liquidação'], etapa) || ehVisualizacao">
                  <div>
                    <div class="box-header with-border">
                      <h3 class="box-title">Histórico de solicitação</h3>
                    </div>
                    <historico-solicitacao-pagamento v-if="historicoBack && !_.isNull(historicoBack) && !_.isEmpty(historicoBack)" :propsValidacao="_.head(documentosLiberacao)" :propsHistorico="historicoBack" :key="historicoBack"></historico-solicitacao-pagamento>
                  </div>
                  <div class="text-left box-header" v-if="dataMenor === true || (!historicoBack || _.isNull(historicoBack) || _.isEmpty(historicoBack))">
                    <a href="" v-if="esconderHistorico === false" @click.prevent="esconderHistorico = true"><i class="fa fa-caret-down" aria-hidden="true"></i> Mostrar histórico antigo</a>
                    <a href="" v-if="esconderHistorico === true" @click.prevent="esconderHistorico = false"><i class="fa fa-caret-up" aria-hidden="true"></i> Ocultar histórico antigo</a>
                  </div>
                  <div class="col-md-8" v-if="esconderHistorico === true && dataMenor === true  || (!historicoBack || _.isNull(historicoBack) || _.isEmpty(historicoBack))">
                    <div>
                      <div class="box-header with-border">
                        <h3 class="box-title">Histórico Antigo</h3>
                      </div>
                      <historico-antigo :propsValidacao="_.head(documentosLiberacao)" :propsHistorico="historicoTarefas" :key="historicoTarefas"></historico-antigo>
                      <!--<historico-antigo :propsValidacao="validacao" :propsHistorico="historicoTarefas" :key="historicoTarefas"></historico-antigo>-->
                    </div>
                  </div>
                </div>

                <!-- Observação opcional da entidade ----------------------------------------------------------------------------------------------------------->
                <div class="box-body" v-if="(_.includes(['Solicitação', 'Revisão'], etapa) && usuarioLogado.userType !== 'FUNDACAO' && restricaoParaInicializar.length === 0)">
                  <div>
                    <div class="box-header">
                      <h3 class="box-title">Observação Opcional</h3>
                    </div>
                  </div>

                  <!-- Observação opcional -->
                  <div class="col-md-12">
                    <textarea name="observacao_opcional" id="observacao_opcional" v-model="adiantamentoSolicitado.observacao" rows="3" class="form-control" :disabled="ehVisualizacao"></textarea>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>




      <!-- Decisões ----------------------------------------------------------------------------->
      <div class="row" id="decisoes_aprovação" v-if="_.includes(['Análise', 'Análise Financeira', 'Autorização', 'Liquidação'], etapa) && usuarioLogado.userType === 'FUNDACAO' && !ehVisualizacao">
        <div class="col-md-12 form-horizontal">
          <div class="box box-primary">
            <div v-show="loading.processo || loading.tarefa || loading.adiantamentos || loading.projetos" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

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
                          <input type="radio" name="decisão" :value="etapa === 'Análise' ? (processo === 'DEVOLUCAO_DE_ADIANTAMENTO' ? 'Análise Financeira' : 'Autorização') : (etapa === 'Autorização' ? (ativaGeracaoRemessa ? 'Liquidação' : 'Conclusão') : (etapa === 'Liquidação' || etapa === 'Análise Financeira' ? 'Conclusão' : ''))" :disabled="ehVisualizacao"
                                 v-model="aprovacao.resultadoAprovacao" v-validate="'required'"/>{{ etapa === 'Liquidação' ? 'Concluir processo manualmente' : 'Aprovar solicitação' }}
                          <div class="new-control-indicator"></div>
                        </label>


                        <!-- Observação opcional da aprovação -->
                        <div class="col-md-12">
                          <div v-if="_.includes(['Análise Financeira', 'Autorização', 'Liquidação', 'Conclusão'], aprovacao.resultadoAprovacao) && usuarioLogado.userType === 'FUNDACAO'" class="col-md-12">
                            <label for="observacao_decisao" class="control-label">Observação:</label>
                            <textarea name="observacao_decisao" id="observacao_decisao" v-model="adiantamentoSolicitado.observacao" rows="3" class="form-control" :disabled="ehVisualizacao"></textarea>
                          </div>
                        </div>
                      </div>


                      <!-- Revisão da entidade -------------------------------------------------->
                      <div class="col-md-12" v-if="etapa === 'Análise' || etapa === 'Análise Financeira'">
                        <label class="new-control new-control-radio" style="padding-top: 8px;">
                          <input type="radio" name="decisão" value="Revisão" :disabled="ehVisualizacao"
                                 v-model="aprovacao.resultadoAprovacao" v-validate="'required'"/> Encaminhar para revisão da entidade
                          <div class="new-control-indicator"></div>
                        </label>

                        <!-- Motivo de devolução -->
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
                            <textarea name="motivo para revisão" v-model="adiantamentoSolicitado.observacao" rows="3" id="justificativa_revisão" class="form-control" v-validate="'required'" :disabled="ehVisualizacao"></textarea>
                            <span v-if="errors.first('motivo para revisão')" class="label label-danger"> {{ errors.first('motivo para revisão') }}</span>
                          </div>
                        </div>

                      </div>


                      <!-- Reanalisar -------------------------------------------------->
                      <div class="col-md-12" v-if="_.includes(['Análise Financeira', 'Autorização', 'Liquidação'], etapa)">
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
                            <textarea name="justificativa reanalise" v-model="adiantamentoSolicitado.observacao" rows="3" id="justificativa_reanalise" class="form-control" v-validate="'required'" :disabled="ehVisualizacao"></textarea>
                            <span v-if="errors.first('justificativa reanalise')" class="label label-danger"> {{ errors.first('justificativa reanalise') }}</span>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

                <!-- Vincula chamado do Suporte FBB -------------------------------------------------->
                <div class="row" v-if="_.includes(['Análise', 'Análise Financeira', 'Autorização', 'Liquidação'], etapa) && usuarioLogado.userType === 'FUNDACAO'">
                  <div class="form-group col-md-12">
                    <div class="col-md-8">
                      <span v-if="loading.suportesFbbAtivos" class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando Suportes não encerrados...</span>
                      <span v-else>
                        <multiselect v-model="adiantamentoSolicitado.suporteFbb"
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

  export default {
    components: {
      UploadDocumentosPhp,
      HistoricoSolicitacaoPagamento,
      HistoricoAntigo
    },
    name: 'main-solicitacao-adiantamentos',
    data () {
      return {
        id: null,
        ativaGeracaoRemessa: true, // Desativada até liberação pelo cliente, previsão para final de janeiro/2023
        processo: 'ADIANTAMENTO',
        etapa: 'Solicitação',
        contasFinanceiras: [],
        contasTesouraria: [],
        historico: [],
        projetoSuperior: 0,
        mostrar_representantes: false,
        mostrar_ocorrencias: false,
        razaoSocial: '',
        id_entidade: 0,
        temOcorrencia: false,
        projetoComAlteracaoEmAndamento: false,
        parcelasEmAberto: [],
        parcelasSelecionadas: [],
        parcelasAlteradas: [],
        devolucoes: [],
        ocorrencias: [],
        dirigentes: [],
        cod_cargo: 0,
        cargos: ['', 'Presidente(a)', 'Vice-Presidente', 'Prefeito(a)', 'Diretor(a)', 'Diretor(a) Superintendente', 'Coordenador(a)', 'Outros', 'Reitor(a)', 'Secretário(a)', 'Tesoureiro(a)', 'Contato', 'Designado(a)', 'Procurador(a)'],
        esconderHistorico: false,
        data_edicao: '',
        historicoTarefas: [],
        historicoTarefasTela: [],
        historicoBack: [],
        loading: {
          processo: false,
          tarefa: false,
          adiantamentos: false,
          projetos: false,
          suportesFbbAtivos: false,
          tela: false
        },
        dataMenor: false,
        dataCorte: '2020-12-10',
        chamado: [],
        listaProjetos: [],
        projeto: {},
        entidade: {},
        adiantamentosConcecidos: [],
        parcelasAtuais: [],
        totaisLimites: {},
        documentosLiberacao: [],
        adiantamentoSolicitado: {
          id: null,
          idParcela: null,
          projeto: {},
          processo: null,
          etapa: null,
          proximaEtapa: null,
          numeroTitulo: null,
          serieTitulo: null,
          observacao: null,
          valor: 0,
          fase: null,
          contaFinanceira: null,
          contaTesouraria: null,
          seqBan: null,
          dados_bancarios: {
            banco: null,
            agencia: null,
            conta: null,
            tipo: 1
          },
          anexos: [],
          documentosAdiantamento: [],
          parametrosDocumento: [],
          suporteFbb: []
        },
        aprovacao: {},
        totais: {
          orcado: 0,
          liberado: 0,
          solicitado: 0,
          emExecucao: 0,
          pendenteComprovacao: 0,
          comprovado: 0,
          devolvido: 0,
          projeto: {
            fbb: {
              adiantavel: 0,
              liberado: 0,
              limite: 0
            },
            parceiros: {
              adiantavel: 0,
              liberado: 0,
              limite: 0
            }
          }
        },
        ultimaTarefaFeita: {},
        //
        restricaoParaInicializar: [],
        restricaoParaConcluir: [],
        ehVisualizacao: false,
        validacao: {},
        descricaoProcesso: {'ADIANTAMENTO': 'Adiantamento', 'DEVOLUCAO_DE_ADIANTAMENTO': 'Devolução de Adiantamento'},
        poderes: {
          codigo: '',
          mensagem: []
        },
        listaBancos: [{'codigo': '001', 'nome': 'Banco do Brasil S.A.', 'caracteresConta': 8}, {'codigo': '033', 'nome': 'Banco Santander (Brasil) S.A.', 'caracteresConta': 8, 'digitoAgencia': false}, {'codigo': '070', 'nome': 'BRB - Banco de Brasília S.A.'}, {'codigo': '104', 'nome': 'Caixa Econômica Federal', 'digitoAgencia': false}, {'codigo': '237', 'nome': 'Banco Bradesco S.A.', 'caracteresConta': 7}, {'codigo': '341', 'nome': 'Itaú Unibanco S.A.', 'caracteresConta': 5, 'digitoAgencia': false},
          {'codigo': '', 'nome': '', $isDisabled: true}, // Separador (elemento disabled)
          {'codigo': '003', 'nome': 'BANCO DA AMAZONIA S.A.'}, {'codigo': '004', 'nome': 'Banco do Nordeste do Brasil S.A.'}, {'codigo': '007', 'nome': 'BANCO NACIONAL DE DESENVOLVIMENTO ECONOMICO E SOCIAL'}, {'codigo': '010', 'nome': 'CREDICOAMO CREDITO RURAL COOPERATIVA'}, {'codigo': '011', 'nome': 'CREDIT SUISSE HEDGING-GRIFFO CORRETORA DE VALORES S.A'}, {'codigo': '012', 'nome': 'Banco Inbursa S.A.'}, {'codigo': '014', 'nome': 'STATE STREET BRASIL S.A. ? BANCO COMERCIAL'}, {'codigo': '015', 'nome': 'UBS Brasil Corretora de Câmbio, Títulos e Valores Mobiliários S.A.'}, {'codigo': '016', 'nome': 'COOPERATIVA DE CRÉDITO MÚTUO DOS DESPACHANTES DE TRÂNSITO DE SANTA CATARINA E RI'}, {'codigo': '017', 'nome': 'BNY Mellon Banco S.A.'}, {'codigo': '018', 'nome': 'Banco Tricury S.A.'}, {'codigo': '021', 'nome': 'BANESTES S.A. BANCO DO ESTADO DO ESPIRITO SANTO'}, {'codigo': '024', 'nome': 'Banco Bandepe S.A.'}, {'codigo': '025', 'nome': 'Banco Alfa S.A.'}, {'codigo': '029', 'nome': 'Banco Itaú Consignado S.A.'}, {'codigo': '036', 'nome': 'Banco Bradesco BBI S.A.'}, {'codigo': '037', 'nome': 'Banco do Estado do Pará S.A.'}, {'codigo': '040', 'nome': 'Banco Cargill S.A.'}, {'codigo': '041', 'nome': 'Banco do Estado do Rio Grande do Sul S.A.', 'caracteresConta': 9}, {'codigo': '047', 'nome': 'Banco do Estado de Sergipe S.A.'}, {'codigo': '060', 'nome': 'Confidence Corretora de Câmbio S.A.'}, {'codigo': '062', 'nome': 'Hipercard Banco Múltiplo S.A.'}, {'codigo': '063', 'nome': 'Banco Bradescard S.A.'}, {'codigo': '064', 'nome': 'GOLDMAN SACHS DO BRASIL BANCO MULTIPLO S.A.'}, {'codigo': '065', 'nome': 'Banco AndBank (Brasil) S.A.'}, {'codigo': '066', 'nome': 'BANCO MORGAN STANLEY S.A.'}, {'codigo': '069', 'nome': 'Banco Crefisa S.A.'}, {'codigo': '074', 'nome': 'Banco J. Safra S.A.'}, {'codigo': '075', 'nome': 'Banco ABN Amro S.A.'}, {'codigo': '076', 'nome': 'Banco KDB do Brasil S.A.'}, {'codigo': '077', 'nome': 'Banco Inter S.A.'}, {'codigo': '078', 'nome': 'Haitong Banco de Investimento do Brasil S.A.'}, {'codigo': '079', 'nome': 'Banco Original do Agronegócio S.A.'}, {'codigo': '080', 'nome': 'B&T CORRETORA DE CAMBIO LTDA.'}, {'codigo': '081', 'nome': 'BancoSeguro S.A.'}, {'codigo': '082', 'nome': 'BANCO TOPÁZIO S.A.'}, {'codigo': '083', 'nome': 'Banco da China Brasil S.A.'}, {'codigo': '084', 'nome': 'UNIPRIME NORTE DO PARANÁ – COOPERATIVA DE CRÉDITO LTDA'}, {'codigo': '085', 'nome': 'Cooperativa Central de Crédito – Ailos'}, {'codigo': '088', 'nome': 'BANCO RANDON S.A.'}, {'codigo': '089', 'nome': 'CREDISAN COOPERATIVA DE CRÉDITO'}, {'codigo': '091', 'nome': 'CENTRAL DE COOPERATIVAS DE ECONOMIA E CRÉDITO MÚTUO DO ESTADO DO RIO GRANDE DO S'}, {'codigo': '092', 'nome': 'BRK S.A. Crédito, Financiamento e Investimento'}, {'codigo': '093', 'nome': 'PÓLOCRED   SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORT'}, {'codigo': '094', 'nome': 'Banco Finaxis S.A.'}, {'codigo': '095', 'nome': 'Travelex Banco de Câmbio S.A.'}, {'codigo': '096', 'nome': 'Banco B3 S.A.'}, {'codigo': '097', 'nome': 'Credisis – Central de Cooperativas de Crédito Ltda.'}, {'codigo': '098', 'nome': 'Credialiança Cooperativa de Crédito Rural'}, {'codigo': '099', 'nome': 'UNIPRIME CENTRAL – CENTRAL INTERESTADUAL DE COOPERATIVAS DE CREDITO LTDA.'}, {'codigo': '100', 'nome': 'Planner Corretora de Valores S.A.'}, {'codigo': '101', 'nome': 'RENASCENCA DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '102', 'nome': 'XP INVESTIMENTOS CORRETORA DE CÂMBIO,TÍTULOS E VALORES MOBILIÁRIOS S/A'}, {'codigo': '105', 'nome': 'Lecca Crédito, Financiamento e Investimento S/A'}, {'codigo': '107', 'nome': 'Banco Bocom BBM S.A.'}, {'codigo': '108', 'nome': 'PORTOCRED S.A. – CREDITO, FINANCIAMENTO E INVESTIMENTO'}, {'codigo': '111', 'nome': 'OLIVEIRA TRUST DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIARIOS S.A.'}, {'codigo': '113', 'nome': 'Magliano S.A. Corretora de Cambio e Valores Mobiliarios'}, {'codigo': '114', 'nome': 'Central Cooperativa de Crédito no Estado do Espírito Santo – CECOOP'}, {'codigo': '117', 'nome': 'ADVANCED CORRETORA DE CÂMBIO LTDA'}, {'codigo': '119', 'nome': 'Banco Western Union do Brasil S.A.'}, {'codigo': '120', 'nome': 'BANCO RODOBENS S.A.'}, {'codigo': '121', 'nome': 'Banco Agibank S.A.'}, {'codigo': '122', 'nome': 'Banco Bradesco BERJ S.A.'}, {'codigo': '124', 'nome': 'Banco Woori Bank do Brasil S.A.'}, {'codigo': '125', 'nome': 'Plural S.A. Banco Múltiplo'}, {'codigo': '126', 'nome': 'BR Partners Banco de Investimento S.A.'}, {'codigo': '127', 'nome': 'Codepe Corretora de Valores e Câmbio S.A.'}, {'codigo': '128', 'nome': 'MS Bank S.A. Banco de Câmbio'}, {'codigo': '129', 'nome': 'UBS Brasil Banco de Investimento S.A.'}, {'codigo': '130', 'nome': 'CARUANA S.A. – SOCIEDADE DE CRÉDITO, FINANCIAMENTO E INVESTIMENTO'}, {'codigo': '131', 'nome': 'TULLETT PREBON BRASIL CORRETORA DE VALORES E CÂMBIO LTDA'}, {'codigo': '132', 'nome': 'ICBC do Brasil Banco Múltiplo S.A.'}, {'codigo': '133', 'nome': 'CONFEDERAÇÃO NACIONAL DAS COOPERATIVAS CENTRAIS DE CRÉDITO E ECONOMIA FAMILIAR E'}, {'codigo': '134', 'nome': 'BGC LIQUIDEZ DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '136', 'nome': 'CONFEDERAÇÃO NACIONAL DAS COOPERATIVAS CENTRAIS UNICRED LTDA. – UNICRED DO BRASI'}, {'codigo': '138', 'nome': 'Get Money Corretora de Câmbio S.A.'}, {'codigo': '139', 'nome': 'Intesa Sanpaolo Brasil S.A. – Banco Múltiplo'}, {'codigo': '140', 'nome': 'Easynvest – Título Corretora de Valores SA'}, {'codigo': '142', 'nome': 'Broker Brasil Corretora de Câmbio Ltda.'}, {'codigo': '143', 'nome': 'Treviso Corretora de Câmbio S.A.'}, {'codigo': '144', 'nome': 'BEXS BANCO DE CÂMBIO S/A'}, {'codigo': '145', 'nome': 'LEVYCAM – CORRETORA DE CAMBIO E VALORES LTDA.'}, {'codigo': '146', 'nome': 'GUITTA CORRETORA DE CAMBIO LTDA.'}, {'codigo': '149', 'nome': 'Facta Financeira S.A. – Crédito Financiamento e Investimento'}, {'codigo': '157', 'nome': 'ICAP do Brasil Corretora de Títulos e Valores Mobiliários Ltda.'}, {'codigo': '159', 'nome': 'Casa do Crédito S.A. Sociedade de Crédito ao Microempreendedor'}, {'codigo': '163', 'nome': 'Commerzbank Brasil S.A. – Banco Múltiplo'}, {'codigo': '169', 'nome': 'BANCO OLÉ CONSIGNADO S.A.'}, {'codigo': '173', 'nome': 'BRL Trust Distribuidora de Títulos e Valores Mobiliários S.A.'}, {'codigo': '174', 'nome': 'PEFISA S.A. – CRÉDITO, FINANCIAMENTO E INVESTIMENTO'}, {'codigo': '177', 'nome': 'Guide Investimentos S.A. Corretora de Valores'}, {'codigo': '180', 'nome': 'CM CAPITAL MARKETS CORRETORA DE CÂMBIO, TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '183', 'nome': 'SOCRED S.A. – SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO P'}, {'codigo': '184', 'nome': 'Banco Itaú BBA S.A.'}, {'codigo': '188', 'nome': 'ATIVA INVESTIMENTOS S.A. CORRETORA DE TÍTULOS, CÂMBIO E VALORES'}, {'codigo': '189', 'nome': 'HS FINANCEIRA S/A CREDITO, FINANCIAMENTO E INVESTIMENTOS'}, {'codigo': '190', 'nome': 'SERVICOOP – COOPERATIVA DE CRÉDITO DOS SERVIDORES PÚBLICOS ESTADUAIS DO RIO GRAN'}, {'codigo': '191', 'nome': 'Nova Futura Corretora de Títulos e Valores Mobiliários Ltda.'}, {'codigo': '194', 'nome': 'PARMETAL DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '196', 'nome': 'FAIR CORRETORA DE CAMBIO S.A.'}, {'codigo': '197', 'nome': 'Stone Pagamentos S.A.'}, {'codigo': '208', 'nome': 'Banco BTG Pactual S.A.'}, {'codigo': '212', 'nome': 'Banco Original S.A.'}, {'codigo': '213', 'nome': 'Banco Arbi S.A.'}, {'codigo': '217', 'nome': 'Banco John Deere S.A.'}, {'codigo': '218', 'nome': 'Banco BS2 S.A.'}, {'codigo': '222', 'nome': 'BANCO CRÉDIT AGRICOLE BRASIL S.A.'}, {'codigo': '224', 'nome': 'Banco Fibra S.A.'}, {'codigo': '233', 'nome': 'Banco Cifra S.A.'}, {'codigo': '241', 'nome': 'BANCO CLASSICO S.A.'}, {'codigo': '243', 'nome': 'Banco Máxima S.A.'}, {'codigo': '246', 'nome': 'Banco ABC Brasil S.A.'}, {'codigo': '249', 'nome': 'Banco Investcred Unibanco S.A.'}, {'codigo': '250', 'nome': 'BCV – BANCO DE CRÉDITO E VAREJO S.A.'}, {'codigo': '253', 'nome': 'Bexs Corretora de Câmbio S/A'}, {'codigo': '254', 'nome': 'PARANÁ BANCO S.A.'}, {'codigo': '259', 'nome': 'MONEYCORP BANCO DE CÂMBIO S.A.'}, {'codigo': '260', 'nome': 'Nu Pagamentos S.A.'}, {'codigo': '265', 'nome': 'Banco Fator S.A.'}, {'codigo': '266', 'nome': 'BANCO CEDULA S.A.'}, {'codigo': '268', 'nome': 'BARI COMPANHIA HIPOTECÁRIA'}, {'codigo': '269', 'nome': 'BANCO HSBC S.A.'}, {'codigo': '270', 'nome': 'Sagitur Corretora de Câmbio Ltda.'}, {'codigo': '271', 'nome': 'IB Corretora de Câmbio, Títulos e Valores Mobiliários S.A.'}, {'codigo': '272', 'nome': 'AGK CORRETORA DE CAMBIO S.A.'}, {'codigo': '273', 'nome': 'Cooperativa de Crédito Rural de São Miguel do Oeste – Sulcredi/São Miguel'}, {'codigo': '274', 'nome': 'MONEY PLUS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E A EMPRESA DE PEQUENO PORT'}, {'codigo': '276', 'nome': 'Senff S.A. – Crédito, Financiamento e Investimento'}, {'codigo': '278', 'nome': 'Genial Investimentos Corretora de Valores Mobiliários S.A.'}, {'codigo': '279', 'nome': 'COOPERATIVA DE CREDITO RURAL DE PRIMAVERA DO LESTE'}, {'codigo': '280', 'nome': 'Avista S.A. Crédito, Financiamento e Investimento'}, {'codigo': '281', 'nome': 'Cooperativa de Crédito Rural Coopavel'}, {'codigo': '283', 'nome': 'RB CAPITAL INVESTIMENTOS DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LIMITADA'}, {'codigo': '285', 'nome': 'Frente Corretora de Câmbio Ltda.'}, {'codigo': '286', 'nome': 'COOPERATIVA DE CRÉDITO RURAL DE OURO   SULCREDI/OURO'}, {'codigo': '288', 'nome': 'CAROL DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.'}, {'codigo': '289', 'nome': 'DECYSEO CORRETORA DE CAMBIO LTDA.'}, {'codigo': '290', 'nome': 'Pagseguro Internet S.A.'}, {'codigo': '292', 'nome': 'BS2 Distribuidora de Títulos e Valores Mobiliários S.A.'}, {'codigo': '293', 'nome': 'Lastro RDV Distribuidora de Títulos e Valores Mobiliários Ltda.'}, {'codigo': '296', 'nome': 'VISION S.A. CORRETORA DE CAMBIO'}, {'codigo': '298', 'nome': 'Vip’s Corretora de Câmbio Ltda.'}, {'codigo': '299', 'nome': 'SOROCRED   CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.'}, {'codigo': '300', 'nome': 'Banco de la Nacion Argentina'}, {'codigo': '301', 'nome': 'BPP Instituição de Pagamento S.A.'}, {'codigo': '306', 'nome': 'PORTOPAR DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.'}, {'codigo': '307', 'nome': 'Terra Investimentos Distribuidora de Títulos e Valores Mobiliários Ltda.'}, {'codigo': '309', 'nome': 'CAMBIONET CORRETORA DE CÂMBIO LTDA.'}, {'codigo': '310', 'nome': 'VORTX DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.'}, {'codigo': '311', 'nome': 'DOURADA CORRETORA'}, {'codigo': '312', 'nome': 'HSCM SCMEPP LTDA.'}, {'codigo': '313', 'nome': 'AMAZÔNIA CORRETORA DE CÂMBIO LTDA.'}, {'codigo': '315', 'nome': 'PI Distribuidora de Títulos e Valores Mobiliários S.A.'}, {'codigo': '318', 'nome': 'Banco BMG S.A.'}, {'codigo': '319', 'nome': 'OM DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '320', 'nome': 'China Construction Bank (Brasil) Banco Múltiplo S/A'}, {'codigo': '321', 'nome': 'CREFAZ SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E A EMPRESA DE PEQUENO PORTE LT'}, {'codigo': '322', 'nome': 'Cooperativa de Crédito Rural de Abelardo Luz – Sulcredi/Crediluz'}, {'codigo': '323', 'nome': 'MERCADOPAGO.COM REPRESENTACOES LTDA.'}, {'codigo': '324', 'nome': 'CARTOS SOCIEDADE DE CRÉDITO DIRETO S.A.'}, {'codigo': '325', 'nome': 'Órama Distribuidora de Títulos e Valores Mobiliários S.A.'}, {'codigo': '326', 'nome': 'PARATI – CREDITO, FINANCIAMENTO E INVESTIMENTO S.A.'}, {'codigo': '329', 'nome': 'QI Sociedade de Crédito Direto S.A.'}, {'codigo': '330', 'nome': 'BANCO BARI DE INVESTIMENTOS E FINANCIAMENTOS S.A.'}, {'codigo': '331', 'nome': 'Fram Capital Distribuidora de Títulos e Valores Mobiliários S.A.'}, {'codigo': '332', 'nome': 'Acesso Soluções de Pagamento S.A.'}, {'codigo': '335', 'nome': 'Banco Digio S.A.'}, {'codigo': '336', 'nome': 'Banco C6 S.A.'}, {'codigo': '340', 'nome': 'Super Pagamentos e Administração de Meios Eletrônicos S.A.'}, {'codigo': '342', 'nome': 'Creditas Sociedade de Crédito Direto S.A.'}, {'codigo': '343', 'nome': 'FFA SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE LTDA.'}, {'codigo': '348', 'nome': 'Banco XP S.A.'}, {'codigo': '349', 'nome': 'AL5 S.A. CRÉDITO, FINANCIAMENTO E INVESTIMENTO'}, {'codigo': '350', 'nome': 'COOPERATIVA DE CRÉDITO RURAL DE PEQUENOS AGRICULTORES E DA REFORMA AGRÁRIA DO CE'}, {'codigo': '352', 'nome': 'TORO CORRETORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '354', 'nome': 'NECTON INVESTIMENTOS  S.A. CORRETORA DE VALORES MOBILIÁRIOS E COMMODITIES'}, {'codigo': '355', 'nome': 'ÓTIMO SOCIEDADE DE CRÉDITO DIRETO S.A.'}, {'codigo': '358', 'nome': 'MIDWAY S.A. - SCFI'}, {'codigo': '359', 'nome': 'ZEMA CRÉDITO, FINANCIAMENTO E INVESTIMENTO S/A'}, {'codigo': '360', 'nome': 'TRINUS CAPITAL DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.'}, {'codigo': '362', 'nome': 'CIELO S.A.'}, {'codigo': '363', 'nome': 'SOCOPA SOCIEDADE CORRETORA PAULISTA S.A.'}, {'codigo': '364', 'nome': 'GERENCIANET S.A.'}, {'codigo': '365', 'nome': 'SOLIDUS S.A. CORRETORA DE CAMBIO E VALORES MOBILIARIOS'}, {'codigo': '366', 'nome': 'BANCO SOCIETE GENERALE BRASIL S.A.'}, {'codigo': '367', 'nome': 'VITREO DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.'}, {'codigo': '368', 'nome': 'Banco CSF S.A.'}, {'codigo': '370', 'nome': 'Banco Mizuho do Brasil S.A.'}, {'codigo': '371', 'nome': 'WARREN CORRETORA DE VALORES MOBILIÁRIOS E CÂMBIO LTDA.'}, {'codigo': '373', 'nome': 'UP.P SOCIEDADE DE EMPRÉSTIMO ENTRE PESSOAS S.A.'}, {'codigo': '374', 'nome': 'REALIZE CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.'}, {'codigo': '376', 'nome': 'BANCO J.P. MORGAN S.A.'}, {'codigo': '377', 'nome': 'MS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE LTDA'}, {'codigo': '378', 'nome': 'BBC LEASING S.A. – ARRENDAMENTO MERCANTIL'}, {'codigo': '379', 'nome': 'COOPERFORTE – COOPERATIVA DE ECONOMIA E CRÉDITO MÚTUO DOS FUNCIONÁRIOS DE INSTIT'}, {'codigo': '380', 'nome': 'PICPAY SERVICOS S.A.'}, {'codigo': '381', 'nome': 'BANCO MERCEDES-BENZ DO BRASIL S.A.'}, {'codigo': '382', 'nome': 'FIDÚCIA SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE L'}, {'codigo': '383', 'nome': 'BOLETOBANCÁRIO.COM TECNOLOGIA DE PAGAMENTOS LTDA.'}, {'codigo': '384', 'nome': 'GLOBAL FINANÇAS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO'}, {'codigo': '386', 'nome': 'NU FINANCEIRA S.A. CFI'}, {'codigo': '387', 'nome': 'Banco Toyota do Brasil S.A.'}, {'codigo': '389', 'nome': 'Banco Mercantil do Brasil S.A.'}, {'codigo': '390', 'nome': 'BANCO GM S.A.'}, {'codigo': '391', 'nome': 'COOPERATIVA DE CREDITO RURAL DE IBIAM – SULCREDI/IBIAM'}, {'codigo': '393', 'nome': 'Banco Volkswagen S.A.'}, {'codigo': '394', 'nome': 'Banco Bradesco Financiamentos S.A.'}, {'codigo': '395', 'nome': 'F D GOLD DTVM LTDA'}, {'codigo': '396', 'nome': 'HUB PAGAMENTOS S.A'}, {'codigo': '397', 'nome': 'LISTO SOCIEDADE DE CREDITO DIRETO S.A.'}, {'codigo': '398', 'nome': 'IDEAL CTVM S.A.'}, {'codigo': '399', 'nome': 'Kirton Bank S.A. – Banco Múltiplo'}, {'codigo': '400', 'nome': 'CC POUP SER FIN CO'}, {'codigo': '402', 'nome': 'COBUCCIO SCD S.A.'}, {'codigo': '403', 'nome': 'CORA SOCIEDADE DE CRÉDITO DIRETO S.A.'}, {'codigo': '404', 'nome': 'SUMUP SOCIEDADE DE CRÉDITO DIRETO S.A.'}, {'codigo': '406', 'nome': 'ACCREDITO SCD S.A.'}, {'codigo': '407', 'nome': 'ÍNDIGO INVESTIMENTOS DTVM LTDA.'}, {'codigo': '408', 'nome': 'BÔNUSCRED SOCIEDADE DE CRÉDITO DIRETO S.A.'}, {'codigo': '410', 'nome': 'PLANNER SCM S.A.'}, {'codigo': '411', 'nome': 'VIA CERTA FINANCIADORA S.A. - CFI'}, {'codigo': '412', 'nome': 'BANCO CAPITAL S.A.'}, {'codigo': '419', 'nome': 'NUMBRS SCD S.A.'}, {'codigo': '422', 'nome': 'Banco Safra S.A.'}, {'codigo': '456', 'nome': 'Banco MUFG Brasil S.A.'}, {'codigo': '464', 'nome': 'Banco Sumitomo Mitsui Brasileiro S.A.'}, {'codigo': '473', 'nome': 'Banco Caixa Geral – Brasil S.A.'}, {'codigo': '477', 'nome': 'Citibank N.A.'}, {'codigo': '479', 'nome': 'Banco ItauBank S.A.'}, {'codigo': '487', 'nome': 'DEUTSCHE BANK S.A. – BANCO ALEMAO'}, {'codigo': '488', 'nome': 'JPMorgan Chase Bank, National Association'}, {'codigo': '492', 'nome': 'ING Bank N.V.'}, {'codigo': '495', 'nome': 'Banco de La Provincia de Buenos Aires'}, {'codigo': '505', 'nome': 'Banco Credit Suisse (Brasil) S.A.'}, {'codigo': '545', 'nome': 'SENSO CORRETORA DE CAMBIO E VALORES MOBILIARIOS S.A'}, {'codigo': '600', 'nome': 'Banco Luso Brasileiro S.A.'}, {'codigo': '604', 'nome': 'Banco Industrial do Brasil S.A.'}, {'codigo': '610', 'nome': 'Banco VR S.A.'}, {'codigo': '611', 'nome': 'Banco Paulista S.A.'}, {'codigo': '612', 'nome': 'Banco Guanabara S.A.'}, {'codigo': '613', 'nome': 'Omni Banco S.A.'}, {'codigo': '623', 'nome': 'Banco Pan S.A.'}, {'codigo': '626', 'nome': 'BANCO C6 CONSIGNADO S.A.'}, {'codigo': '630', 'nome': 'Banco Smartbank S.A.'}, {'codigo': '633', 'nome': 'Banco Rendimento S.A.'}, {'codigo': '634', 'nome': 'BANCO TRIANGULO S.A.'}, {'codigo': '637', 'nome': 'BANCO SOFISA S.A.'}, {'codigo': '643', 'nome': 'Banco Pine S.A.'}, {'codigo': '652', 'nome': 'Itaú Unibanco Holding S.A.'}, {'codigo': '653', 'nome': 'BANCO INDUSVAL S.A.'}, {'codigo': '654', 'nome': 'BANCO DIGIMAIS S.A.'}, {'codigo': '655', 'nome': 'Banco Votorantim S.A.'}, {'codigo': '707', 'nome': 'Banco Daycoval S.A.'}, {'codigo': '712', 'nome': 'Banco Ourinvest S.A.'}, {'codigo': '720', 'nome': 'BCO RNX S.A.'}, {'codigo': '739', 'nome': 'Banco Cetelem S.A.'}, {'codigo': '741', 'nome': 'BANCO RIBEIRAO PRETO S.A.'}, {'codigo': '743', 'nome': 'Banco Semear S.A.'}, {'codigo': '745', 'nome': 'Banco Citibank S.A.', 'caracteresConta': 8, 'digitoAgencia': false}, {'codigo': '746', 'nome': 'Banco Modal S.A.'}, {'codigo': '747', 'nome': 'Banco Rabobank International Brasil S.A.'}, {'codigo': '748', 'nome': 'BANCO COOPERATIVO SICREDI S.A.'}, {'codigo': '751', 'nome': 'Scotiabank Brasil S.A. Banco Múltiplo'}, {'codigo': '752', 'nome': 'Banco BNP Paribas Brasil S.A.'}, {'codigo': '753', 'nome': 'Novo Banco Continental S.A. – Banco Múltiplo'}, {'codigo': '754', 'nome': 'Banco Sistema S.A.'}, {'codigo': '755', 'nome': 'Bank of America Merrill Lynch Banco Múltiplo S.A.'}, {'codigo': '756', 'nome': 'BANCO COOPERATIVO DO BRASIL S.A. – BANCOOB'}, {'codigo': '757', 'nome': 'BANCO KEB HANA DO BRASIL S.A.'}],
        listaSuportes: [],
        bancoSelecionado: null,
        tiposConta: [{'codigo': 1, 'tipo': 'Conta Corrente'}, {'codigo': 2, 'tipo': 'Conta Poupança'}],
        tipoContaSelecionado: {'codigo': 1, 'tipo': 'Conta Corrente'}, // pré-selecionar o tipo de conta 1
        motivosDevolucao: [],
        motivoDevolucao: null,
        rotasProcesso: { 'ADIANTAMENTO': '/solicitacao/adiantamento', 'DEVOLUCAO_DE_ADIANTAMENTO': '/solicitacao/devolucao_adiantamento', 'PAGAMENTO': '/solicitacao/pagamento', 'PRESTACAO_DE_CONTAS': '/solicitacao/prestacaocontas', 'CONTRAPARTIDA': '/solicitacao/contrapartida', 'RESSARCIMENTO': '/solicitacao/ressarcimento' }
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ]),
      totalRateado () {
        if (!this.devolucoes || this.devolucoes.length === 0) return 0
        return this.devolucoes.reduce((soma, valor) => {
          const valorNumerico = parseFloat(valor) || 0
          return soma + valorNumerico
        }, 0)
      },
      valoresEstaoCorretos () {
        if (!this.parcelasAtuais || this.parcelasAtuais.requisitado === undefined) {
          return false
        }
        const valorRequisitado = parseFloat(_.sumBy(this.parcelasAtuais, 'requisitado')) || 0
        return this.totalRateado.toFixed(2) === valorRequisitado.toFixed(2)
      },
      dadosEstaoCarregados () {
        return this.parcelasAtuais &&
              this.parcelasAtuais.requisitado !== undefined &&
              this.parcelasEmAberto &&
              this.parcelasEmAberto.length > 0 &&
              this.devolucoes &&
              this.devolucoes.length > 0
      }
    },
    watch: {
    },
    mounted () {
      if (this.$route.params.id) {
        this.verificaChamado()
        this.buscaContasFinanceiras()
      }
      if (this.ehVisualizacao) {
        this.restricaoParaInicializar = ''
      }
    },
    created () {
      console.clear()
      this.data_edicao = moment().format('YYYY-MM-DD HH:mm:ss')
      this.processo = this.$route.path.indexOf('devolucao_adiantamento') >= 0 ? 'DEVOLUCAO_DE_ADIANTAMENTO' : 'ADIANTAMENTO'
      //
      if (_.has(this.$route.params, 'visualizacao')) {
        this.ehVisualizacao = this.$route.params.visualizacao
      }
      if (_.has(this.$route.params, 'id')) {
        // Se trata de uma edição pois é passado um id
        this.id = this.$route.params.id
        this.buscaDados()
      } else {
        if (_.isEmpty(this.listaProjetos)) {
          this.carregarListaProjetos()
        }
      }
      let totalRestante = (_.sumBy(this.parcelasAtuais, 'disponivel') - _.sumBy(this.parcelasAtuais, 'requisitado'))
      totalRestante = _.round(totalRestante, 2)
      console.log('totalRestante = ', totalRestante)
    },
    methods: {
      selecionaBanco (banco) {
        this.adiantamentoSolicitado.dados_bancarios.banco = banco.codigo
        this.$forceUpdate()
      },
      bancoNome (option) {
        return `${option.codigo + ' - ' + option.nome}`
      },
      selecionaTipoConta (tipoSelecionado) {
        this.adiantamentoSolicitado.dados_bancarios.tipo = tipoSelecionado.codigo
        this.$forceUpdate()
      },
      tipoContaNome (option) {
        return `${option.codigo + ' - ' + option.tipo}`
      },
      suporteNome (option) {
        return `${option.numero + ' - ' + option.problema}`
      },

      motivoDevolucaoDescricao (option) {
        return `${option.descricao}`
      },

      buscaContasFinanceiras () {
        axiosLaravel.get('busca_conta_financeira').then((response) => {
          this.contasFinanceiras = response.data
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },

      buscaContasTesouraria () {
        axiosLaravel.get('busca_conta_tesouraria/' + this.projeto.Numero_projeto).then((response) => {
          this.contasTesouraria = response.data
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },

      // Demanda 66506 Cadastro da conta de adiantamento

      async buscaContaAdiantamento () {
        await axiosLaravel.get('conta-adiantamento/buscaConta', {params: {id: this.projeto.Id_proposta}})
          .then((response) => {
            this.bancoSelecionado = {'codigo': '001', 'nome': 'Banco do Brasil S.A.', 'caracteresConta': 8}
            if (!_.includes(Object.keys(response.data), 'codigo') && !this.ehVisualizacao && this.etapa !== 'Análise') {
              const dadosBancarios = response.data
              this.adiantamentoSolicitado.dados_bancarios.agencia = dadosBancarios.agencia
              this.adiantamentoSolicitado.dados_bancarios.conta = dadosBancarios.conta
              this.bancoSelecionado = {'codigo': '001', 'nome': 'Banco do Brasil S.A.', 'caracteresConta': 8}
              this.adiantamentoSolicitado.dados_bancarios.tipo = dadosBancarios.tipo
              this.adiantamentoSolicitado.dados_bancarios.mci = dadosBancarios.mci
            }
          })
      },
      inicializarDevolucoes () {
        if (this.parcelasEmAberto && this.parcelasEmAberto.length > 0) {
          this.devolucoes = new Array(this.parcelasEmAberto.length).fill(0)
        } else {
          this.devolucoes = []
        }
      },
      buscaDados () {
        // Carregando dados da ultima tarefa necessários aos carregamento do Cronograma
        this.loading.tarefa = true
        axiosLaravel.get('pagamento/ultima/tarefa/' + this.id).then((response) => {
          this.projeto.Id_proposta = response.data[0]['id_projeto']
          this.projetoSuperior = response.data[0]['ds_projetoSuperior']
          this.razaoSocial = response.data[0]['ds_razao_social']
          this.projeto.Projeto = response.data[0]['projeto']
          this.projeto.Objetivo = response.data[0]['objetivo_geral']
          this.projeto.Status_ERP = response.data[0]['situacao_projeto_sapiens']
          this.entidade['ds_cnpj'] = response.data[0]['ds_cnpj']
          this.dirigentes = response.data['dirigentes']
          this.projeto.fk_entidade = response.data[0]['id_entidade']
          this.projeto.Numero_projeto = _.has(this.projeto, 'Numero_projeto') ? this.projeto['Numero_projeto'] : this.projeto.Projeto.substring(0, 5)
          this.buscaOcorrencias()
          this.carregarAdiantamentos()
          this.buscaMotivosDevolucao()
          this.buscaContasTesouraria()
          this.loading.tarefa = false
        })
          .catch((error) => {
            this.loading.tarefa = false
            this.$root.trataErro(error)
          })
        // Em paralelo, carregando dados do processo
        this.loading.processo = true
        axiosLaravel.get('processos/' + this.id).then((response) => {
          this.dataProcesso = moment(response.data.inicio).format('DD/MM/YYYY')
          if (moment(this.dataProcesso).isSameOrBefore(moment(this.dataCorte))) {
            this.dataMenor = true
          } else {
            this.dataMenor = false
          }
          //
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
          this.buscaHistorico(this.id)
          //
          this.etapa = _.chain(_.cloneDeep(this.historico)).remove(['tipo', 'Usuário']).sortBy('id').last().get('nome').value()
          this.documentosLiberacao = response.data.documentos_liberacao
          this.validacao.processo = _.omit(response.data, ['documentos_liberacao', 'tarefas']) // TODO verificar se esta sendo usado em algum lugar
          //
          this.adiantamentoSolicitado.anexos = _.get(_.head(this.documentosLiberacao), 'documentos_anexos_adiantamento')
          this.adiantamentoSolicitado.documentosAdiantamento = _.get(_.head(this.documentosLiberacao), 'documentos_adiantamento')
          let dadosBancarios = _.get(_.head(this.documentosLiberacao), 'dados_bancarios')
          console.log('BANCO SELECIONADO: ', dadosBancarios.banco)
          this.bancoSelecionado = _.filter(this.listaBancos, ['codigo', dadosBancarios.banco])[0]
          this.adiantamentoSolicitado.dados_bancarios.banco = dadosBancarios.banco
          this.adiantamentoSolicitado.dados_bancarios.agencia = dadosBancarios.agencia
          this.adiantamentoSolicitado.dados_bancarios.conta = dadosBancarios.conta
          this.adiantamentoSolicitado.dados_bancarios.tipo = dadosBancarios.tipo
          this.tipoContaSelecionado = _.filter(this.tiposConta, ['codigo', dadosBancarios.tipo])[0]
          this.adiantamentoSolicitado.pagamentoPrioritario = _.get(_.head(this.documentosLiberacao), 'prioridade')
          if (_.includes(['Análise', 'Análise Financeira', 'Autorização', 'Liquidação'], this.etapa)) {
            this.carregarSuportesFbb()
          }
          //
          this.$forceUpdate()
          this.loading.processo = false
        })
          .catch((error) => {
            this.loading.processo = false
            console.log('error', error)
            this.$root.trataErro(error)
          })
        //
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
        let suportes = this.carregarParametrosDocumento(_.get(_.head(this.documentosLiberacao), 'parametros_documento'), ['SUPORTE_FBB'])
        this.adiantamentoSolicitado.suporteFbb = this.jsonValido(suportes) || []
        // Se for visualização não precisa pesquisar lista de suportes ativos que será o que já tiver de suporte vinculado ou nada
        if (this.ehVisualizacao) {
          this.listaSuportes = _.cloneDeep(this.adiantamentoSolicitado.suporteFbb)
        } else {
          // Se estiver em curso deve procurar os ativos para montar a lista
          axiosLaravel.get('pagamento/suportes/ativos').then((response) => {
            // A lista terá os suporte ativos e merge com os já vinculados ao chamado deixando eles pré-selecionados
            this.listaSuportes = _.union(_.isNull(response.data.retorno) ? [] : response.data.retorno, this.adiantamentoSolicitado.suporteFbb)
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
          console.log('buscaMotivosDevolucao', response.data)
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
      carregarParametrosDocumento (parametrosCarregados, parametrosBusca) {
        let parametros = _.filter(parametrosCarregados, function (p) {
          return _.includes(parametrosBusca, p.parametro) || _.includes(parametrosBusca, p.valor)
        })
        if (parametros.length > 0) {
          return _.last(_.sortBy(parametros, ['created_at']))['valor']
        } else {
          return ''
        }
      },
      verificaRestricoesAdiantamento () {
        // console.log('verificaRestricoesAdiantamento()')
        // console.log('this.processo', this.processo)
        // Verificações de Devolução de Adiantamento ----------------------------
        // Validação removida em funcao do suporte 63820. TODO criar campo na SP - recursos_adiantamento_completo e refazer a regra UPDATE @adiantamentos_solicitacao SET pendente_comprovacao = Buscar no SAPIENS (Juliano)
        // if (this.processo === 'DEVOLUCAO_DE_ADIANTAMENTO') {
        //   // alterado em 16/12/2021 - ajuste de validação
        //   // if (_.sumBy(this.parcelasAtuais, 'requisitado') > 0 && this.etapa === 'Solicitação') { // Verifica se já há valor requisitado quando é feita uma solicitação
        //   if (_.sumBy(this.parcelasAtuais, 'devolvido') > 0 && this.etapa === 'Solicitação') { // Verifica se já há valor requisitado quando é feita uma solicitação
        //     this.restricaoParaInicializar.push('Devolução de adiantamento já foi solicitado. Reveja as solicitações em andamento.')
        //   }
        // }
        // Verificações de solicitação de Adiantamento ----------------------------
        if (this.processo === 'ADIANTAMENTO') {
          // 68615 - Verificações adicionais em conta de adiantamento
          // Verifica se a conta de adiantamento cadastrada é válida
          if (this.validandoDadosBancarios() !== true) {
            this.restricaoParaInicializar.push('Esta solicitação não pode ser realizada pois a Conta de Adiantamento está inválida ou não foi cadastrada. Entre em contato com a equipe responsável para regularização.')
          }
          // console.log('if (this.processo === "ADIANTAMENTO")')
          // Verifica se o projeto tem situaçao que não permite solicitar adiantamento
          if (_.has(this.projeto, 'Status_ERP') && _.includes(['JUD', 'DLG', 'ETO', 'SPS', 'SO3', 'SO4', 'SAF', 'SPA', 'ENC', 'ESE'], this.projeto.Status_ERP)) {
            // this.restricaoParaInicializar.push('Esta solicitação não pode ser realizada pois o projeto está em estado "' + this.projeto.ds_situacao_erp + '".')
            this.restricaoParaInicializar.push('Esta solicitação não pode ser realizada pois o projeto está em estado "' + this.projeto.Status_ERP + '".')
          }
          // console.log('Passou na verificação de situação restritiva')
          // console.log('this.etapa', this.etapa)
          if (_.includes(['Solicitação', 'Revisão'], this.etapa)) { // Verifica na Solictação ou na Revisão de solicitação de Adiantamento
            // if (this.projeto.superior === 18182 && this.projeto.parcelas_contratadas === 1) { // Se for Voluntariado (superior 18182) com parcela única
            if (this.projeto.parcelas_contratadas === 1) { // Se o adiantamento for de parcela única, então não precisa verificar 80%, 100%, prazos de prestação etc
              console.log(' Verificação de parcela única', this.projeto)
            } else {
              if (this.parcelasAtuais.length === 0) { // Verifica se projeto esta finalizado
                this.restricaoParaInicializar.push('Não há mais parcelas de adiantamento disponíveis neste projeto. A quantidade de solicitações de adiantamento não pode ser maior que a quantidade de parcelas disponíveis no cronograma físico-financeiro. O saldo residual pode ser solicitado através da Solicitação de Pagamento.')
              }
              // Se houver pelo menos uma parcela que foi solicitada e aprovada (liberada)
              if (_.has(this.adiantamentosConcecidos, '[0].id')) {
                if (_.sumBy(this.parcelasAtuais, 'requisitado') > 0) {
                  if (this.etapa === 'Solicitação') { // Verifica se já há valor requisitado quando é feita uma solicitação
                    this.restricaoParaInicializar.push('Adiantamento já foi solicitado. Reveja as solicitações em andamento.')
                  }
                }
                this.adiantamentosConcecidos.some(function (item) { return console.log(' item > ', item) })
                //
                if (this.adiantamentosConcecidos.some(function (item) { return item.atraso90dias })) { // Verifica se projeto esta atrasado a mais de 90 dias
                  this.restricaoParaInicializar.push('Os recursos da solicitação de adiantamento estão bloqueados devido à existência de prestações de contas em aberto em período superior ao previsto em convênio.')
                }
                if (this.adiantamentosConcecidos.some(function (item) { return item.atraso180dias })) { // Verifica se projeto esta atrasado a mais de 180 dias
                  this.restricaoParaInicializar.push('Os recursos da solicitação de adiantamento estão bloqueados devido à existência de prestações de contas em aberto em período superior ao previsto em convênio.')
                }
                // Comentário do suporte 63567 pelo suporte 63805 - TODO O caso do suporte 63567, 63532 precisa de mais discussão em virtude da diferença entre o SGP e o Sapiens (Juliano)
                let adiantamentosConcecidosResumidos = {}
                let propriedadesResumidas = ['requisitado', 'comprovado', 'em_execucao', 'devolvido'] // Separa as informaçoes necessárias para os cálculos a seguir
                this.adiantamentosConcecidos.forEach(adt => {
                  // Vai "agrupar" os registros dos adiantamentos concedidos em um objeto com a key sendo o número da parcela e os valor somados em caso de mais de um registro para a mesma parcela (parcelas mistas)
                  if (_.has(adiantamentosConcecidosResumidos, adt.parcela)) {
                    propriedadesResumidas.forEach(p => {
                      adiantamentosConcecidosResumidos[adt.parcela][p] += adt[p]
                    })
                  } else {
                    adiantamentosConcecidosResumidos[adt.parcela] = _.pick(adt, propriedadesResumidas)
                  }
                })
                //
                _.forEach(adiantamentosConcecidosResumidos, function (adt) { // Calcula o percentual de comprovação (prestação de contas sobre o adiantamento liberado)
                  adt['percentual_comprovado'] = Math.round(((adt.requisitado - (adt.requisitado - (adt.comprovado - adt.em_execucao) - adt.devolvido)) / adt.requisitado) * 10000) / 10000
                })
                //
                let parcelas = _.sortBy(_.keys(adiantamentosConcecidosResumidos), [function (p) { return _.toInteger(p) }])
                if (parcelas.length > 0) { // Já tem alguma parcela liberada
                  if (adiantamentosConcecidosResumidos[_.last(parcelas)]['percentual_comprovado'] >= 0.8) { // Caso a última pracela esteja acima de 80%
                    if (parcelas.length > 1 && adiantamentosConcecidosResumidos[_.nth(parcelas, -2)]['percentual_comprovado'] < 1) { // A penúltima parcela é menor 100%
                      this.restricaoParaInicializar.push('A próxima parcela de adiantamento só será liberada após a comprovação de 100% do valor da parcela anterior, via Solicitação da Prestação de Contas.')
                    }
                  } else { // A última parcela é menor que 80%
                    this.restricaoParaInicializar.push('A próxima parcela de adiantamento só será liberada após a comprovação de 80% do valor da parcela anterior, via Solicitação de Prestação de Contas.')
                  }
                }
                // Se não tiver sido liberada ainda (aprovada), mas foi requisitada
              }
            }
          }
        }
      },
      async carregarAdiantamentos () {
        this.loading.adiantamentos = true
        await this.buscaContaAdiantamento()
        axiosLaravel.get('processos/adiantamento/recursos/' + this.projeto['Id_proposta']).then((response) => {
          console.log('recursos adiantamento', response.data)
          this.adiantamentosConcecidos = response.data.adiantamentos_concedidos.row
          _.set(this.totais, 'projeto', response.data.dados.recursos)
          _.assign(this.projeto, response.data.dados.projeto)
          this.parcelasAtuais = response.data.parcels.row
          this.parcelasAtuais.forEach((parcela) => {
            // Se for uma Devolução de Adiantamento
            if (this.processo === 'DEVOLUCAO_DE_ADIANTAMENTO') {
              // Acerto no valor solicitado de devolucao de adiantamento na validacao do processo
              parcela.requisitado = 0
              // A parcela terá o total não comprovado dos adiantamento concedidos
              // Demanda 66401 correção no arredondamento dos totais prevenindo erro de saldo indisponível
              parcela.disponivel = this.arredondaDecimal(_.sumBy(this.adiantamentosConcecidos, function (adt) {
                return adt.recurso === parcela.resourceSource ? (adt.requisitado - (adt.comprovado + adt.devolvido)) : 0 // Correção na fórmula incluíndo parênteses: (adt.comprovado + adt.devolvido)
              }))
              this.documentosLiberacao.forEach((documento) => {
                if (documento.itens_liberados[0].parcelas_adiantamentos[0].origem === 1 && parcela.resourceSource === 'FUNDACAO') {
                  // Origem do recurso é fundação
                  parcela.requisitado = Math.abs(documento.itens_liberados[0].valor)
                } else if (documento.itens_liberados[0].parcelas_adiantamentos[0].origem === 5 && parcela.resourceSource === 'PARCEIRO_ESTRATEGICO') {
                  // Origem do recurso é parceiro estratégico
                  parcela.requisitado = Math.abs(documento.itens_liberados[0].valor)
                }
              })
              // quando for resourceSource == FUNDACAO, pega o valor do item liberado com origem 1
              // quando for resourceSource == PARCEIRO_ESTRATEGICO, pega o valor do item liberado com origem 5
              // Acerto no valor solicitado de devolucao de adiantamento na validacao do processo
              // axiosLaravel.get('processos/buscarValorTarefa/' + this.validacao.processo.id).then((response) => {
              //   parcela.requisitado = response.data
              // })
              //   .catch((error) => {
              //     this.loading.projetos = false
              //     console.log('error', error)
              //     this.$root.trataErro(error)
              //   })
              // Também terá o valo solicitado como a soma do que já foi pedido e está pendente de aprovação
              // parcela.requisitado = _.sumBy(this.adiantamentosConcecidos, function (adt) {
              //   // ALTERADO EM 01/12/2021 - correção de valor zerado na fase de análise e consulta
              //   // return adt.recurso === parcela.resourceSource ? adt.pendente_devolucao : 0
              //   // console.log('test', adt)
              //   return adt.recurso === parcela.resourceSource ? adt.pendente_comprovacao : 0
              // })
            }
            //
            // Se for uma solicitação de Adiantamento
            if (this.processo === 'ADIANTAMENTO') {
              if (this.projeto.superior === 18182 && this.projeto.parcelas_contratadas === 1) {
                // Se é projeto de Voluntariado (superior 18182) e só tem uma parcela
                parcela.requisitado = parcela.disponivel
              }
            }
            //
            let documentoLiberacao = _.find(this.documentosLiberacao, ['id', parcela.id_documento_liberacao])
            //
            if (!_.has(parcela, 'numeroTitulo') || _.isEmpty(parcela.numeroTitulo)) { // Atribui o número do titulo (numero do documento de liberação) caso não haja algum na parcela
              parcela.numeroTitulo = _.get(documentoLiberacao, 'numero', null)
            }
            //
            let contaFinanceira = this.carregarParametrosDocumento(_.get(documentoLiberacao, 'parametros_documento', []), ['CONTA_FINANCEIRA'])
            if (contaFinanceira !== '') { // Se já existe como parâmetro de documento então atribui a parcela
              parcela.contaFinanceira = contaFinanceira
            } else if (!_.has(parcela, 'contaFinanceira') || _.isNull(parcela.contaFinanceira) || parcela.contaFinanceira.length < 4) { // Se não existe nem na parcela, então sugere conta financeira quando não há nenhuma informada na parcela. Usa a regra: origem 1 -> 10828 | origem -> 5 -> 10829
              parcela.contaFinanceira = parcela.resourceSource === 'FUNDACAO' ? 10828 : 10829
            }
            //
            let contaTesouraria = this.carregarParametrosDocumento(_.get(documentoLiberacao, 'parametros_documento', []), ['CONTA_TESOURARIA'])
            if (contaTesouraria !== '') { // Se já existe como parâmetro de documento então atribui a parcela
              parcela.contaTesouraria = contaTesouraria
            } else if (!_.has(parcela, 'contaTesouraria') || _.isNull(parcela.contaTesouraria) || parcela.contaTesouraria.length < 4) { // Se não existe nem na parcela, então sugere conta de tesouraria quando não há nenhuma informada na parcela. Usa a regra: fase1 = 402248-3; fase5 = 7020-3
              parcela.contaTesouraria = parcela.resourceSource === 'FUNDACAO' ? '402248-3' : '7020-3'
            }
          })
          this.verificaRestricoesAdiantamento()
          this.calcularTotaisAdiantamento()
          this.filtraParcelasEmAberto()
          this.$forceUpdate()
          this.loading.adiantamentos = false
        })
          .catch((error) => {
            this.loading.adiantamentos = false
            console.log('error', error)
            this.$root.trataErro(error)
          })
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
        let saida = tipo === 'inteiro' ? parseInt(valor) : tipo === 'decimal' ? parseFloat(valor) : valor
        this.$forceUpdate()
        return saida
      },
      carregarListaProjetos () {
        this.loading.projetos = true
        axiosLaravel.post('processos/projetos', {'processo': this.processo}).then((response) => {
          // Limitar acesso a projetos
          let listaProjetos = response.data
          let acessosProjetos = _.get(this.usuarioLogado, 'configuracoes.acesso_projetos')
          if (acessosProjetos) {
            let permissoesAcesso = ['INICIA_SOLICITACAO'] // A lista constará quais acessos serão permitidos para que o projeto figure na lista
            acessosProjetos = _.map(_.filter(acessosProjetos, function (p) { return _.find(p.acesso, function (a) { return _.includes(permissoesAcesso, a.codigo) }) }), 'numero')
            listaProjetos = _.filter(listaProjetos, function (p) { return _.includes(acessosProjetos, p['Numero_projeto']) })
          }
          this.listaProjetos = listaProjetos
          this.$forceUpdate()
          this.loading.projetos = false
        })
          .catch((error) => {
            this.loading.projetos = false
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      selecionaProjeto () {
        this.loading.projetos = true
        axiosLaravel.post('pagamento/valida/solicitante', {'projeto': this.projeto, 'processo': this.processo}).then((response) => {
          if (_.has(response.data, 'codigo')) {
            if (response.data.codigo === 'ERRO') {
              this.restricaoParaInicializar = this.processo === 'ADIANTAMENTO' && (_.has(response.data, 'mensagem') && !_.isNull(response.data.mensagem) && response.data.mensagem.length > 0 ? response.data.mensagem : ['Erro de processamento. Não sei o que houve'])
            }
            this.entidade = response.data.retorno
            this.buscaOcorrencias()
            this.carregarAdiantamentos()
            this.consultaProjetosEmAlteracao()
          }
          this.loading.projetos = false
        })
          .catch((error) => {
            this.loading.projetos = false
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
                _.includes(['ADIANTAMENTO'], this.processo)) { // Se houver ocorrência 2201 ou 2202 ... só deve permitir Prestação de Contas
                this.restricaoParaInicializar.push('Possui ocorrência(s) que não permite liberar Parcela de Adiantamento')
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
      calcularTotaisAdiantamento () {
        this.totais.orcado = _.sumBy(this.adiantamentosConcecidos, 'contratado')
        // Demanda 66401 correção no arredondamento dos totais prevenindo erro de saldo indisponível
        this.totais.liberado = this.arredondaDecimal(_.sumBy(this.adiantamentosConcecidos, 'requisitado'))
        this.totais.emExecucao = _.sumBy(this.adiantamentosConcecidos, 'em_execucao')
        this.totais.devolvido = _.sumBy(this.adiantamentosConcecidos, 'devolvido')
        this.totais.comprovado = _.sumBy(this.adiantamentosConcecidos, 'comprovado')
        // Demanda 66401 correção no arredondamento dos totais prevenindo erro de saldo indisponível
        this.totais.pendenteComprovacao = this.arredondaDecimal(this.totais.liberado - (this.totais.comprovado + this.totais.devolvido)) // correção na fórmula
        this.$forceUpdate()
      },

      // Demanda 66401 correção no arredondamento dos totais prevenindo erro de saldo indisponível
      arredondaDecimal (valor) {
        return +(Math.round(valor + 'e+2') + 'e-2')
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
      aviso (retorno) {
        if (_.has(retorno, 'codigo')) {
          let mensagem = (_.has(retorno, 'mensagem') && !_.isNull(retorno.mensagem) && !_.isEmpty(retorno.mensagem)) ? retorno.mensagem : 'Erro de processamento. Não sei o que houve'
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

      salvar () {
        this.aprovacao.resultadoAprovacao = 'Salvar'
        this.validarConclusao()
      },

      concluir () {
        this.aprovacao.resultadoAprovacao = _.includes(['Solicitação', 'Revisão'], this.etapa) ? 'Análise' : this.aprovacao.resultadoAprovacao
        this.validarConclusao()
      },

      validarConclusao () {
        // Restringir se há mais de uma parcela que tem valor informado
        // Suporte 67.456
        // this.adicionaRestricao({'tag': 'valorSolicitadoAcima', 'ativo': ((_.sumBy(this.parcelasAtuais, 'disponivel') / this.parcelasAtuais.length) - _.sumBy(this.parcelasAtuais, 'requisitado')) < 0, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Valor solicitado ultrapassou do valor total. Verifique o saldo restante.'})
        this.adicionaRestricao({'tag': 'valorSolicitadoAcima', 'ativo': ((_.sumBy(this.parcelasAtuais, 'disponivel')) - _.sumBy(this.parcelasAtuais, 'requisitado')) < 0, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Valor solicitado ultrapassou do valor total. Verifique o saldo restante.'})
        // Número do título repetido ou inválido
        // this.adicionaRestricao({'tag': 'numeroTituloRepetido', 'ativo': (this.processo !== 'DEVOLUCAO_DE_ADIANTAMENTO' && this.etapa === 'Análise' && this.parcelasAtuais.length !== (_.uniq(_.map(this.parcelasAtuais, function (p) { return ('' + p.numeroTitulo) }))).length), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Verifique repetição no número do título'})
        // Restringir se não há valor solicitado
        this.adicionaRestricao({'tag': 'nenhumValorInformado', 'ativo': (_.sumBy(this.parcelasAtuais, 'requisitado') === 0), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Não há valor solicitado'})
        // Restringir se não houver arquivo anexo no Adiantamento Solicitado
        this.adicionaRestricao({'tag': 'temAnexo', 'ativo': (this.adiantamentoSolicitado.documentosAdiantamento.length === 0), 'tipo': 'restricao', 'acao': null, 'mensagem': 'É necessário anexar pelo menos um documento comprobatório'})
        // Restringir se não for escolhida uma conta de tesouraria na etapa de análise de Adiantamentos. Chamado 64.682: especificado processo de adiantamento na validação
        this.adicionaRestricao({'tag': 'semContaTesouraria', 'ativo': (this.processo === 'ADIANTAMENTO') && (this.etapa === 'Análise') && (_.filter(this.parcelasAtuais, function (p) { return p.requisitado > 0 && (!_.has(p, 'contaTesouraria') || _.isNull(p.contaTesouraria) || p.contaTesouraria.length < 2) })).length > 0, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Há conta tesouraria que não foi escolhida ainda'})
        //
        this.$validator.validateAll().then(validado => {
          this.adicionaRestricao({'tag': 'camposPendentes', 'ativo': !validado, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Revise os campos: ' + (_.join(_.uniq(_.map(this.$validator.errors.items, 'field')), ', '))})
          //
          let validacaoDadosBancarios = this.validandoDadosBancarios()
          this.adicionaRestricao({'tag': 'dadosBancariosIncorretos', 'ativo': _.isString(validacaoDadosBancarios), 'tipo': 'restricao', 'acao': null, 'mensagem': validacaoDadosBancarios})
          //
          if (this.parcelasEmAberto.length > 1) {
            const temDevolucaoValida = this.devolucoes.some(devolucao =>
              devolucao != null &&
              !isNaN(devolucao))
            console.log('devolucoes', _.sumBy(this.parcelasAtuais, 'requisitado'))
            //
            if (!temDevolucaoValida) {
              console.log('teste correto')
              this.adicionaRestricao({'tag': 'nenhumaParcelaInformada', 'ativo': true, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Há mais de uma parcela de adiantamento em aberto, gentileza escolher a parcela'})
            }
          }
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
        this.adiantamentoSolicitado.id = this.id
        this.adiantamentoSolicitado.projeto = this.projeto
        this.adiantamentoSolicitado.processo = this.processo
        if (this.etapa === 'Análise Financeira') {
          this.adiantamentoSolicitado.etapa = 'Acerto Contábil'
        } else {
          this.adiantamentoSolicitado.etapa = this.etapa
        }
        this.adiantamentoSolicitado.data_edicao = this.data_edicao
        this.adiantamentoSolicitado.proximaEtapa = _.isNull(this.id) ? 'Análise' : this.aprovacao.resultadoAprovacao
        // --- LÓGICA CONDICIONAL PARA O RATEIO ---
        // A condição principal: só executa o rateio se houver mais de um valor a ser devolvido.
        if (this.devolvidos && this.devolvidos.length > 1) {
          console.log('Múltiplas parcelas detectadas. Executando o rateio para a conclusão...')
          this.parcelasAlteradas = this.ratearSaldoDevolucao()
          if (this.parcelasAlteradas.length !== this.devolvidos.length) {
            console.error('Erro de integridade: O número de parcelas alteradas não corresponde ao número de valores devolvidos. A conclusão foi interrompida.')
            // this.$toast.error('Erro ao processar as parcelas. Verifique os dados e tente novamente.')
            return
          }
          this.adiantamentoSolicitado.parcelasAtuais = this.parcelasAlteradas
        } else {
          this.adiantamentoSolicitado.parcelasAtuais = this.parcelasAtuais
        }
        console.log('parcelas alteradas', this.parcelasAlteradas)
        if (this.aprovacao.resultadoAprovacao === 'Revisão' && !_.isNull(this.motivoDevolucao)) {
          _.set(this.motivoDevolucao, 'fk_usuario', this.usuarioLogado.id)
          this.adiantamentoSolicitado.parametrosDocumento.push({ 'fk_documentos_liberacao': this.id, 'parametro': 'MOTIVO_DEVOLUCAO', 'valor': JSON.stringify(this.motivoDevolucao) })
        }
        this.encaminharProximaTarefa()
      },
      encaminharProximaTarefa () {
        // Encaminha o processo para a próxima etapa do documento de liberação
        if (this.aprovacao.resultadoAprovacao === 'Análise Financeira') {
          this.$snotify.async(this.aprovacao.resultadoAprovacao === 'Salvar' ? 'Salvando' : 'Encaminhando ' + (this.descricaoProcesso[this.processo]) + (_.isUndefined(this.aprovacao.resultadoAprovacao) ? '...' : ' para Acerto Contábil'), {timeout: 0})
        } else {
          this.$snotify.async(this.aprovacao.resultadoAprovacao === 'Salvar' ? 'Salvando' : 'Encaminhando ' + (this.descricaoProcesso[this.processo]) + (_.isUndefined(this.aprovacao.resultadoAprovacao) ? '...' : ' para ' + this.aprovacao.resultadoAprovacao), {timeout: 0})
        }
        this.loading.processo = true
        this.$forceUpdate()
        axiosLaravel.post('processos/encaminha/adiantamento', this.adiantamentoSolicitado).then(async (response) => {
          this.$snotify.clear()
          this.gravaHistorico(response.data)
          if (_.includes(['ADIANTAMENTO'], this.processo) && this.etapa === 'Análise' && this.aprovacao.resultadoAprovacao === 'Autorização') {
            this.emitir(199)
          }
          if (this.usuarioLogado.userType === 'FUNDACAO') {
            // Se for o processamento do botão 'Salvar', envia mensagem de sucesso e recarrega a tela com o processo salvo
            if (this.aprovacao.resultadoAprovacao === 'Salvar') {
              this.$router.push(this.rotasProcesso[this.processo] + '/' + response.data.id)
            } else {
              this.$router.go(-1)
            }
          } else {
            this.$router.push('/solicitacao/lista')
          }
          this.$snotify.success(this.aprovacao.resultadoAprovacao === 'Salvar' ? 'Gravado com sucesso. Relendo a solicitação...' : this.descricaoProcesso[this.processo] + ' validado com sucesso')
          this.loading.processo = false
        })
          .catch((error) => {
            this.loading.processo = false
            this.$snotify.clear()
            if (error.response) {
        // Handle HTTP errors (4xx, 5xx)
              console.log('HTTP Error:', error.response.status, error.response.data)
            } else if (error.request) {
              console.log('Network Error:', error.request)
            } else {
              // Handle other errors
              console.log('Error:', error.message)
            }
               // this.$root.trataErro(error)
          })
      },
      gravaHistorico (parm) {
        axiosLaravel.post('historico-tarefas/', parm).then((response) => {
        })
      },

      validandoDadosBancarios () {
        console.log(this.adiantamentoSolicitado.dados_bancarios)
        console.log(this.bancoSelecionado)
        if (this.adiantamentoSolicitado.dados_bancarios.agencia && this.adiantamentoSolicitado.dados_bancarios.conta && (this.adiantamentoSolicitado.dados_bancarios.tipo === 1 || this.tipoContaSelecionado.codigo === 1)) {
          let banco = _.has(this.bancoSelecionado, 'codigo') ? this.bancoSelecionado.codigo : '000'

          let conta = _.words(this.adiantamentoSolicitado.dados_bancarios.conta)
          let digitosConta = _.get(_.head(_.filter(this.listaBancos, ['codigo', banco])), 'caracteresConta') // Se tiver o tamanho da conta na lista de bancos então completa com zeros para o usuário não ter que fazer
          let contaSemDV = digitosConta ? _.padStart(conta[0], digitosConta, '0') : conta[0]
          let contaDV = conta[1] || ''

          let agencia = _.words(this.adiantamentoSolicitado.dados_bancarios.agencia)
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
      },

      emitir (relatorio) {
        this.loading.processo = true
        this.projeto['Numero_projeto'] = _.has(this.projeto, 'Numero_projeto') ? this.projeto['Numero_projeto'] : this.projeto.Projeto.substring(0, 5)
        if (!_.toSafeInteger(this.projeto['Numero_projeto']) > 0) {
          this.$snotify.error('Há algum erro ao pegar o número deste projeto. Favor informar o administrador do sistema')
          return
        }
        let codigoRelatorio = (_.includes([200, 199], relatorio) ? 'SRNF' : 'FJCF') + relatorio + '.GER'
        if (relatorio === 199) { // Comunicado Interno deve pegar o SeqBan gravado no BD porque pode ter sido modificado na Análise
          if (this.processo === 'ADIANTAMENTO') {
            axiosLaravel.get('processos/' + this.id).then((response) => {
              response.data.documentos_liberacao.forEach((documento) => {
                let parcela = _.find(this.parcelasAtuais, ['id_documento_liberacao', documento.id])
                let ESeqBan = parseInt(this.carregarParametrosDocumento(documento.parametros_documento, ['SeqBan']))
                let ENumprj = this.projeto.Numero_projeto
                let EVlrAdt = (parcela.requisitado).toLocaleString('pt-Br', {maximumFractionDigits: 2, minimumFractionDigits: 2, useGrouping: false})
                let EPeriod = 90
                let ECodFpj = documento.serie === 'AMT' ? 'RT' : 'RP'
                let ECtaFin = parcela.contaFinanceira
                let ECtaTesou = parcela.contaTesouraria
                //
                let complementoObservacao = ''
                if (response.data.documentos_liberacao.length > 1) {
                  let titulos = []
                  response.data.documentos_liberacao.forEach((titulo) => {
                    titulos.push(titulo['numero'] + ' ' + titulo['serie'])
                  })
                  complementoObservacao = '{ID com ' + response.data.documentos_liberacao.length + ' titulos: ' + _.join(titulos, ', ') + '} '
                }
                let EObservacao = '{Tarefa SGP (' + this.processo + '): ' + this.id + '} ' + complementoObservacao
                //
                if (this.adiantamentoSolicitado.observacao != null) { EObservacao += this.adiantamentoSolicitado.observacao }
                let Etit = (documento.numero == null) ? 'Sem título' : documento.numero
                // Suporte 64.446 Adicionado parametro de conta financeira a ser enviado ao relatorio 199
                let parametros = '<ECodEmp=1><ENumPrj=' + ENumprj + '><EVlrAdt=' + EVlrAdt + '><EPeriod=' + EPeriod + '><ECodFpj=' + ECodFpj + '><ESeqBan=' + ESeqBan + '><ECtaFin=' + ECtaFin + '><ECtaTesou=' + ECtaTesou + '><EObs=' + EObservacao + '><Etit=' + Etit + '>'
                this.$snotify.clear()
                let textoAviso = response.data.documentos_liberacao.length > 1 ? 'Gerando ' + response.data.documentos_liberacao.length + ' relatórios ' : 'Gerando relatório '
                this.$snotify.async(textoAviso + relatorio + '. Por favor, aguarde...', {timeout: 0})
                axiosLaravel.post('relatorio-erp/emitir', {erpReport: {'ds_codigo': codigoRelatorio}, params: parametros}).then((response) => {
                  this.onDownload(response, relatorio, this)
                })
                  .catch((error) => {
                    this.$snotify.clear()
                    this.loading.processo = false
                    this.$root.trataErro(error)
                  })
              })
            })
              .catch((error) => {
                console.log('error', error)
                this.$root.trataErro(error)
              })
          } else {
            this.$snotify.error('CI de Adiantamento (199) não pode ser emitido para ' + this.descricaoProcesso[this.processo])
          }
        } else {
          let parametros = '<ECodEmp=1><ENumPrj=' + this.projeto['Numero_projeto'] + '>'
          if (relatorio === 222 || relatorio === 219) {
            parametros += ',<ESitPrj=ULT>'
          } else if (relatorio === 248) {
            parametros += ',<ECodFor=>'
          }
          if (relatorio === 222) {
            parametros += ',<EMosDes=S>'
          }
          this.$snotify.clear()
          this.$snotify.async('Gerando relatório ' + relatorio + '. Por favor, aguarde...', {timeout: 0})
          axiosLaravel.post('relatorio-erp/emitir', {erpReport: {'ds_codigo': codigoRelatorio}, params: parametros}).then((response) => {
            this.onDownload(response, relatorio, this)
          })
            .catch((error) => {
              this.$snotify.clear()
              this.loading.processo = false
              this.$root.trataErro(error)
            })
        }
      },
      onDownload (response, relatorio, vm) {
        let item = response.data.arquivo
        const contentType = 'application/pdf'
        const b64Data = response.data.arquivo
        let file = this.b64toBlob(b64Data, contentType)
        let ie = !!window.MSInputMethodContext && !!document.documentMode
        if (relatorio !== 199) {
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
          let tipoProcesso = this.processo === 'ADIANTAMENTO' ? 'ADT' : 'DAT'
          if (!ie) {
            let blob = file
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            // 70137 - Inserir valor da tarefa no nome do arquivo
            link.download = moment(vm.data_edicao).format('YYYYMMDD') + ' ID ' + vm.id + ' ' + tipoProcesso
            // link.download = moment(vm.data_edicao).format('YYYYMMDD') + ' ID ' + vm.id + ' - ' + tipoProcesso + ' VALOR ' + vm.totais.projeto.total.solicitado
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          } else {
            let blob = file
            let link = document.createElement('blob')
            link.href = window.navigator.msSaveOrOpenBlob(blob, item.name)
            // 70137 - Inserir valor da tarefa no nome do arquivo
            link.download = moment(vm.data_edicao).format('YYYYMMDD') + ' ID ' + vm.id + ' ' + tipoProcesso
            // link.download = moment(vm.data_edicao).format('YYYYMMDD') + ' ID ' + vm.id + ' - ' + tipoProcesso + ' VALOR ' + vm.totais.projeto.total.solicitado
            link.click()
          }
        }
        this.$snotify.clear()
        this.$snotify.success('Relatório gerado com sucesso!')
        this.loading.processo = false
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
          // console.log('response.data RLMB', response.data)
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
      filtrarParcelas () {
        console.log('filtra parcelas')
        return this.adiantamentosConcecidos.filter(item => item.em_execucao + item.pendente_comprovacao > 0)
      },
      filtraParcelasEmAberto () {
        console.log('filtra parcelas em aberto')
        this.parcelasEmAberto = this.filtrarParcelas()
        console.log('Filtro aplicado!', this.parcelasEmAberto)
      },
      salvarDevolucoes () {
        console.log('Parcelas Originais:', this.parcelasEmAberto)
        console.log('Valores a devolver digitados:', _.sumBy(this.parcelasAtuais, 'requisitado'))
        const devolucoes = this.devolucoes || []
        const totalRateado = devolucoes.reduce((soma, valor) => {
          const num = parseFloat(valor) || 0
          return soma + num
        }, 0)
        const valorRequisitado = _.sumBy(this.parcelasAtuais, 'requisitado') || 0
        console.log('totalRateado:', totalRateado)
        console.log('valorRequisitado:', valorRequisitado)
        const totalRateadoFixed = parseFloat(totalRateado.toFixed(2))
        const valorRequisitadoFixed = parseFloat(valorRequisitado.toFixed(2))
        let mensagemErro = `O valor total rateado (R$ ${totalRateadoFixed.toFixed(2)}) deve ser exatamente igual ao valor requisitado (R$ ${valorRequisitadoFixed.toFixed(2)}).`
        if (totalRateadoFixed === valorRequisitadoFixed) {
          this.$dialog.alert('Valores conferem! Salvando...', {
            html: true,
            animation: 'fade',
            customClass: 'avisoAlerta'
          }).then(() => {
            // Aqui você faria a chamada para a API
            // this.salvarNaAPI()
          })
        } else {
          this.$dialog.alert(mensagemErro, {
            html: true,
            animation: 'fade',
            customClass: 'avisoAlerta'
          })
          return
        }
      },
      ratearSaldoDevolucao () {
        console.log('Tamanho de valoresDevolvidos:', this.devolvidos.length)
        console.log('Tamanho de parcelasEmAberto:', this.parcelasEmAberto.length)
        console.log('Tamanho de parcelasAtuais (molde):', this.parcelasAtuais.length)
        if (!this.devolvidos || this.devolvidos.length <= 1) {
          return []
        }
        if (!this.parcelasAtuais || this.parcelasAtuais.length === 0) {
          console.error('Erro crítico: `parcelasAtuais` está vazio. Não há um modelo para clonar.')
          return []
        }
        const parcelaModelo = this.parcelasAtuais[0]
        const parcelasAlteradas = this.devolvidos.map((valorDevolvido, idx) => {
          if (!this.parcelasEmAberto[idx]) {
            console.error(`Índice [${idx}] é inválido para 'parcelasEmAberto'. Pulando este item.`)
            return null
          }
          const parcelaAlterada = structuredClone(parcelaModelo)
          parcelaAlterada.id = this.parcelasEmAberto[idx].id_parcela_adiantamento
          parcelaAlterada.parcela = this.parcelasEmAberto[idx].parcela
          parcelaAlterada.requisitado = valorDevolvido || 0
          return parcelaAlterada
        })
        const resultadoFinal = parcelasAlteradas.filter(p => p !== null)
        console.log('resultado final', resultadoFinal)
        return resultadoFinal
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

  #solicitacao .centralizado, .parcelasAdiantamento .centralizado, .municipalizacao .centralizado, .cronogramaff .centralizado, #adiantamentosConcedidos .centralizado {
    text-align: center !important;
  }

  #solicitacao .celula {
    padding: 3px 10px !important;
  }
  #solicitacao .borda {
    border: 1px solid var(--cor-borda) !important;
  }

  #solicitacao .totais, .parcelasAdiantamento .totais, .municipalizacao .totais, .cronogramaff .totais {
    width: 100%;
    border: 1px solid var(--cor-borda);
  }

  #solicitacao .totais .valor, .parcelasAdiantamento .totais .valor, .municipalizacao .totais .valor, .cronogramaff .totais .valor {
    color: var(--cor-padrao);
    font-weight: bold;
  }

  #parcelasAdiantamentoDisponiveis .valorSolicitacao {
    width: 80%;
    margin-left: 10%;
    text-align: center;
  }

  .etiquetaCarregando {
    margin-left: 10px;
    color: var(--cor-azul);
  }
</style>
