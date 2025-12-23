<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="titulo"/>

    <div style=""><!-- content header (page header) -->
      <section class="content-header ">
        <h1 class="row-flex centered-start h1-container">Proposta
          <!-- Botões -->
          <span v-if="bloqueiaBotoes === false && travarEdicao === false && travaSessao === false">
            <g-button-moema v-if="mostrarRef('botao_concluir') && this.$router.currentRoute.name === 'proposta-edita'" color="success"  @click.native="confirmaConclusao()" type="button"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</g-button-moema>
            <g-button-moema v-if="mostrarRef('botao_salvar') && this.$router.currentRoute.name === 'proposta-edita'" color="primary" @click.native="confirmaSalvamento()" type="button"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar</g-button-moema>
            <!-- 65071 - Implementar cancelamento de proposta nas fases de [Análise] e [Cadastro]-->
            <g-button-moema
              v-if="(proposta.ds_fase === 'ANALISE' || proposta.ds_fase === 'CADASTRO') &&
                    this.$router.currentRoute.name === 'proposta-edita'
                    && usuarioLogado.userType === 'FUNDACAO'"
              color="error"
              @click.native="cancelarProposta"
              type="button"
            >
              <i class="fa fa-remove" aria-hidden="true"></i> Cancelar Proposta
            </g-button-moema>
            <g-button-moema color="warning" v-if="mostrarRef('botao_voltar') && this.$router.currentRoute.name === 'proposta-visualiza' && this.$route.params.aprovAnt" @click="$router.push({name: 'validacao-inicial', params: { id: $route.params.aprovAnt }})" type="button">
              <i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar
            </g-button-moema>
            <g-button-moema color="warning" v-if="mostrarRef('botao_voltar') && this.$router.currentRoute.name === 'proposta-visualiza' && this.$route.params.aprovAnt2" @click="$router.push({name: 'validacao-entidades', params: { id: $route.params.aprovAnt2 }})" type="button">
              <i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar
            </g-button-moema>
            <g-button-moema color="warning" v-if="mostrarRef('botao_voltar') && this.$router.currentRoute.name === 'proposta-edita' || (this.$router.currentRoute.name === 'proposta-visualiza' && this.$route.params.aprovAnt === undefined && this.$route.params.aprovAnt2 === undefined)" @click.native="$router.go(-1)" type="button"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</g-button-moema>
          </span>

          <NavegadorProposta v-if="usuarioLogado.userType === 'FUNDACAO'" :ids="idsNavegador" offset="300" class="navegador-proposta-container"></NavegadorProposta>

          <span v-if="proposta.ds_fase === 'DEFERIMENTO' || proposta.ds_fase === 'APROVACAO_PROJETO'">
              <router-link :to="{name: 'relatorio-analise', params: { id: this.$route.params.id } }" target="_blank" class="btn btn-primary btn-sm btn-flat" style="text-decoration: none;height: 34px;margin-top: 3px;padding-top: 8px;margin-left: 30px;"><i class="fa fa-pencil-square-o"></i> Relatório de Análise</router-link>
              <router-link v-if="proposta.fep" :to="{name: 'relatorio-fep', params: { id: this.$route.params.id }}" target="_blank" class="btn btn-primary btn-sm btn-flat" style="text-decoration: none;height: 34px;margin-top: 3px;padding-top: 8px;"><i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp; FEP nº {{proposta.fep.ano}} / {{proposta.fep.numero}}</router-link>
              <router-link :to="{name: 'relatorio-rating', params: { id: this.$route.params.id } }" target="_blank" class="btn btn-primary btn-sm btn-flat" style="text-decoration: none;height: 34px;margin-top: 3px;padding-top: 8px;"><i class="fa fa-pencil-square-o"></i>&nbsp; Rating da Entidade</router-link>
          </span>
        </h1>
        <br>
        <span v-if="travarEdicao"> A edição da proposta neste edital está desabilitada. </span>
        <b-progress v-if="!_.isNull(progressBar.stepTotal) && finalizou === false" class="w-50 mb-2" :max="progressBar.stepTotal">
          <b-progress-bar :value="progressBar.stepAtual">
            {{progressBar.tarefaAtual}} :   <strong>{{ progressBar.stepAtual }} / {{ progressBar.stepTotal }}</strong>
          </b-progress-bar>
        </b-progress>

        <b-breadcrumb :items="[{text: 'Inicial', href: '/'}, {text: 'Proposta', href: '#'}, {text: 'Edita', active: true}]"/>
        <div class="row-flex centered-start trava-sessao-container" v-if="travaSessao">
          <i class="fa fa-warning" aria-hidden="true"></i>
          ATENÇÃO: PROPOSTA EM <b>VISUALIZAÇÃO</b> - <b>NÃO</b> será possível salvar ou concluir.
        </div>
      </section>
      <section class="gerenciador-edicao-container">
        <GerenciadorEdicaoProposta v-if="verificaSessao" @sessaoVerificada="sessaoVerificada($event)" :numeroProposta="this.$route.params.id"></GerenciadorEdicaoProposta>
      </section>

      <!-- main content -->
      <section class="content" v-if="carregaProposta">
        <br>

        <div v-if="proposta.ds_fase === 'REVISAO' && !_.isUndefined(historico_atualizado) && historico_atualizado.length > 1 && historico_atualizado[1].observacao !== null" class="alert alert-dismissible alert-info">
          <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
          <h4><i class="fa fa fa-info"></i>&nbsp&nbsp Atenção!</h4>
          <h5><span v-html="historico_atualizado[1].observacao"></span></h5>
        </div>

        <div class="row">
          <div class="col-md-12">
            <div class="" ref="topo">
              <div class="alert alert-warning" style="margin-top: 10px;" v-if="((!_.isEmpty(restricoesAtivasProjetosDaEntidade) || !_.isEmpty(restricoesAtivasEntidade)) && usuarioLogado.userType === 'FUNDACAO')">
                <h4><i class="fa fa-warning"></i> Atenção!</h4>
                <p><strong>A Entidade possui restrições impeditivas</strong></p>
                <p v-for="restricaoEntidade in this.restricoesAtivasEntidade">
                  {{ restricaoEntidade.codoco }} - {{  restricaoEntidade.desroc }}
                </p>
                <p v-for="restricaoProjeto in this.restricoesAtivasProjetosDaEntidade">
                  {{ restricaoProjeto.codoco }} - {{  restricaoProjeto.desroc }}
                </p>
              </div>
              <div v-if="_.get(proposta, 'rating.consultas.PEP', 0) > 0 && usuarioLogado.userType === 'FUNDACAO'" class="alert alert-warning alert-dismissible" style="margin-top: 10px;">
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
                <h4><i class="fa fa-warning"></i> Alerta!</h4>
                <p>Indicou no Rating da Entidade que há {{ proposta.rating.consultas.PEP }} {{ proposta.rating.consultas.PEP > 1 ? 'Pessoas Expostas' : 'Pessoa Exposta' }} Politicamente (PEP), então deve encaminhar o deferimento para o C.E.</p>
              </div>

              <div class="row">
                <div class="text-left box-header" v-if="proposta.ds_fase !== 'REVISAO' && proposta.ds_fase !== 'CADASTRO'">
                  <a v-if="esconder === false" @click.prevent="esconder = true"><i class="fa fa-caret-down" aria-hidden="true"></i> Mostrar a proposta <b><span v-if="proposta.ds_codigo_projeto_erp">{{ proposta.ds_codigo_projeto_erp }} - </span>{{ proposta.ds_nome }}</b></a>
                  <a v-if="esconder === true" @click.prevent="esconder = false"><i class="fa fa-caret-up" aria-hidden="true"></i> Ocultar a proposta <b><span v-if="proposta.ds_codigo_projeto_erp">{{ proposta.ds_codigo_projeto_erp }} - </span>{{ proposta.ds_nome }}</b></a>
                </div>
              </div>
              <div class="box box-primary">
                <div class="box-body">
                  <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                    <i class="fa fa-refresh fa-spin"></i>
                  </div>
                  <fieldset :disabled="this.$router.currentRoute.name === 'proposta-visualiza' || (_.includes(['DEFERIMENTO', 'FORMALIZACAO', 'APROVACAO_PROJETO'], proposta.ds_fase)) || proposta.ds_fase === 'FORMALIZACAO'" v-show="esconder === true || proposta.ds_fase === 'REVISAO' || proposta.ds_fase === 'REVISAO'">
                    <div class="form-horizontal">
                      <!--Proposta-->
                      <div class="col-md-12">
                        <div class="box box-widget">
                          <div class="box-body" >
                            <div class="row">

                              <!-- Dados do Projeto -->
                              <div class="col-md-12" id="inicio">

                                <div class="form-group required-field required"
                                     :class="{ 'has-error' : errors.first('nome')}">
                                     <div>
                                       <template>
                                         <div id="contador" style="text-align: right;">
                                          <label class="control-label"> Tempo que falta para encerramento do edital: </label>
                                           <CountdownTimer :endDate="new Date(dataHoraEncerramentoEdital)" />
                                         </div>
                                       </template>
                                     </div>

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
                                  <!-- Muda número máximo para 150caracteres, igual o permitido no Sapiens-->
                                  <div v-if="mostrarRef('projeto_nome')">
                                    <div class="col-md-10">
                                      <label class="control-label">Nome do projeto </label>
                                      <div name="proposal.name">
                                        <input v-model="proposta.ds_nome" name="nome" data-vv-as="Nome da Proposta" @keypress="retiraAspas" @paste.prevent
                                               class="form-control col" type="text" maxlength="150"
                                               v-validate="'required|max:150'">
                                      </div>
                                      <span v-if="errors.first('nome')" class="label label-danger"> {{ errors.first('nome') }}</span>
                                    </div>
                                  </div>

                                </div>
                              </div>
                            </div>

                            <div class="row">

                              <!-- Responsável pela Proposta -->
                              <div v-if="mostrarRef('coordenador') && (!ehEdital || !(ehEdital && editalAtivoVigente))" class="col-md-5">
                                <legend>Responsável pela Proposta</legend>
                                <div v-if="mostrarRef('coordenador_nome')"
                                     class="form-group required-field col-md-12 required"
                                     :class="{ 'has-error' : errors.first('nome do coordenador')}">
                                  <label class="control-label">Nome</label>
                                  <div name="proposal.coordinatorName">
                                    <input v-model="proposta.ds_nome_coordenador"
                                           name="nome do coordenador" class="form-control" type="text" v-validate="'required|max:100'" data-vv-as="Nome do Coordenador"
                                           maxlength="100" data-cy="nome_do_coordenador">
                                  </div>
                                  <span v-if="errors.first('nome do coordenador')" class="label label-danger"> {{ errors.first('nome do coordenador') }}</span>
                                </div>
                                <div v-if="mostrarRef('coordenador_cpf')"
                                     class="form-group required-field col-md-12 required"
                                     :class="{ 'has-error' : errors.first('cpf do coordenador')}">
                                  <label class="control-label">CPF</label>
                                  <div name="proposal.coordinatorCpf">
                                    <the-mask v-if="this.$router.currentRoute.name === 'proposta-visualiza'" v-model="proposta.ds_cpf_coordenador"
                                              name="cpf do coordenador" class="form-control" type="text" data-vv-as="CPF do Coordenador"
                                              :mask="'###.###.###-##'" data-cy="cpf_do_coordenador">
                                    </the-mask>
                                    <the-mask v-if="this.$router.currentRoute.name !== 'proposta-visualiza'" v-model="proposta.ds_cpf_coordenador"
                                              name="cpf do coordenador" class="form-control" type="text"
                                              :mask="'###.###.###-##'" v-validate="'cpf|required'" data-cy="cpf_do_coordenador">
                                    </the-mask>
                                  </div>
                                  <span v-if="errors.first('cpf do coordenador')" class="label label-danger"> {{ errors.first('cpf do coordenador') }}</span>
                                </div>

                                <div v-if="mostrarRef('coordenador_email')"
                                     class="form-group required-field col-md-12 required"
                                     :class="{ 'has-error' : errors.first('ds_email_coordenador')}">
                                  <label class="control-label">E-mail</label>
                                  <div name="proposal.coordinatorEmail">
                                    <input v-model="proposta.ds_email_coordenador"
                                           @input="proposta.ds_email_coordenador=$event.target.value.toLowerCase()"
                                           name="ds_email_coordenador" class="form-control" type="email" data-vv-as="E-mail do Coordenador"
                                           maxlength="255"
                                           v-validate="'required|email|max:255'" data-cy="ds_email_coordenador">
                                  </div>
                                  <span v-if="errors.first('ds_email_coordenador')" class="label label-danger"> {{ errors.first('ds_email_coordenador') }}</span>
                                </div>

                                <!--Telefone-->
                                <div v-if="mostrarRef('coordenador_telefone')"
                                     class="form-group col-md-12 required-field"
                                     :class="{ 'has-error' : errors.first('Telefone')}">
                                  <label class="control-label">Telefone</label>
                                  <div name="proposal.coordinatorPhone">
                                    <the-mask v-model="proposta.ds_telefone_coordenador" name="Telefone" class="form-control" type="tel" data-vv-as="Telefone do Coordenador"
                                              v-validate="'required'" :mask="['(##) ####-####', '(##) #####-####']" data-cy="ds_telefone_coordenador"></the-mask>
                                    <span v-if="errors.first('Telefone')" class="label label-danger"> {{ errors.first('Telefone') }}</span>
                                  </div>
                                </div>

                                <!--Celular-->
                                <div v-if="mostrarRef('coordenador_celular')"
                                     class="form-group col-md-12">
                                  <label class="control-label">Telefone Celular</label>
                                  <div name="proposal.coordinatorPhone">
                                    <the-mask v-model="proposta.ds_celular_coordenador" name="Telefone Celular" class="form-control" type="tel" data-vv-as="Celular do Coordenador"
                                              :mask="['(##) ####-####', '(##) #####-####']" data-cy="ds_celular_coordenador"></the-mask>
                                  </div>
                                </div>

                              </div>


                              <div class="col-md-5">

                                <legend>Período de execução do projeto</legend>

                                <div v-if="mostrarRef('projeto_periodo_execucao')">
                                  <!--Data inicial-->
                                  <div v-if="mostrarRef('projeto_data_inicial')"  class=" col-md-12 required" style="margin-left: -15px"
                                       :class="{ 'has-error' : errors.first('Data Inicial')}">
                                    <label class="control-label">Data prevista para início</label>
                                    <div class="input-group">
                                      <div name="proposal.initialDate" class="">
                                        <datepicker  name="Data Inicial" v-model="proposta.dt_data_inicial" input-class="form-control datepicker"
                                                     :language="$datePickerPtBR" maxlength="20" :use-utc="false" placeholder="__ /__ /____" data-vv-as="Data Inicial"
                                                     format="dd/MM/yyyy" v-validate="'required'" data-cy="dt_data_inicial">
                                        </datepicker>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <!--numero de meses do projeto-->
                                <div v-if="mostrarRef('projeto_periodo_execucao')" class="form-group required-field col-md-12 required"
                                     :class="{ 'has-error' : errors.first('periodo')}">
                                  <label class="control-label">Número de meses do projeto</label>
                                  <div name="proposal.periods" class="">
                                    <input v-model="proposta.nr_periodos" data-vv-as="Número de Meses do Projeto" lang="pt-br" name="periodo" class="form-control" type="number" min="1"
                                           v-validate="'required|min_value:1'" data-cy="nr_periodos">
                                  </div>
                                  <span v-if="errors.first('periodo')" class="label label-danger"> {{ errors.first('periodo') }}</span>
                                </div>

                                <div v-if="usuarioLogado.userType === 'FUNDACAO'" class="form-group required-field col-md-12 required">
                                  <!--Período de vigência-->
                                  <div class=" col-md-12 required" style="margin-left: -15px"
                                       :class="{ 'has-error' : errors.first('periodoVigencia')}">
                                    <label class="control-label">Período de vigência </label>
                                    <div class="input-group">
                                      <div class="">
                                        <input v-model="proposta.periodo_vigencia" v-on:change="datas()" v-on:keyup="datas()" data-vv-as="Período Vigência" lang="pt-br" name="periodoVigencia" class="form-control" type="number"
                                               v-validate="'required|min_value:' + proposta.nr_periodos">
                                      </div>
                                    </div>
                                  </div>
                                  <span v-if="errors.first('periodoVigencia')" class="label label-danger"> {{ errors.first('periodoVigencia') }}</span>
                                </div>
                                <div v-if="usuarioLogado.userType === 'FUNDACAO'" class="form-group required-field col-md-12 required">
                                  <!--Período de vigência-->
                                  <div class=" col-md-12 required" style="margin-left: -15px">
                                    <label class="control-label">Data de Vigência do Projeto </label>
                                    <div class="input-group">
                                      <dd class="">{{dataVigencia}}</dd>
                                    </div>
                                  </div>
                                  <span v-if="errors.first('periodo')" class="label label-danger"> {{ errors.first('periodo') }}</span>
                                </div>

                                <!--data final de execução-->
                                <dl v-if="mostrarRef('projeto_periodos') && mostrarRef('projeto_data_inicial')" class="col-md-12" style="margin-left: -15px">
                                  <dt>Data final de execução:</dt>
                                  <dd class="">{{dataFinal}}</dd>
                                </dl>

                              </div>

                            </div>
                          </div>

                        </div>
                        <!--Dados da entidade-->
                        <div class="box box-widget" id="dadosEntidade">
                          <div class="text-left box-header">
                            <a href="" v-if="esconderEntidade === false" @click.prevent="esconderEntidade = true"><i class="fa fa-caret-down" aria-hidden="true"></i> Mostrar dados da Entidade - <span  style="color: steelblue;font-weight: bold;">{{proposta.entidade.ds_nome}}</span></a>
                            <a href="" v-if="esconderEntidade === true" @click.prevent="esconderEntidade = false"><i class="fa fa-caret-up" aria-hidden="true"></i> Ocultar dados da Entidade - <span  style="color: steelblue;font-weight: bold;">{{proposta.entidade.ds_nome}}</span></a>
                          </div>
                          <div class="col-md-8" v-if="esconderEntidade === true">
                            <legend>Dados da Entidade</legend>
                            <dl class="proposal-definition-list">
                              <dt>Entidade</dt>
                              <dd class=""><router-link :title="'<h5>Ir para o Cadastro da entidade</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }" :to="{name: 'cadastro-entidade-visualiza', params: { id: proposta.entidade.id }}" target="_blank"> {{proposta.entidade.ds_nome}} &nbsp<i class="fa fa-external-link"></i></router-link></dd>

                              <dt>CNPJ</dt>
                              <dd>
                                {{proposta.entidade.ds_cnpj | cnpj}}
                              </dd>

                              <dt>E-mail</dt>
                              <dd class="">{{proposta.entidade.ds_email}}</dd>
                              <dt>Endereço</dt>
                              <dd class="" v-if="proposta.entidade.endereco[0]">{{proposta.entidade.endereco[0].ds_rua}}, {{proposta.entidade.endereco[0].ds_numero}} -
                                {{proposta.entidade.endereco[0].ds_bairro}}, {{proposta.entidade.endereco[0].ds_cidade}} - {{proposta.entidade.endereco[0].ds_estado}}
                              </dd>
                              <dt>Telefone</dt>
                              <dd id="phone">
                                {{telefone}}
                              </dd>
                            </dl>
                          </div>
                        </div>


                      </div>

                      <!--Informações introdutórias-->
                      <div v-if="mostrarRef('informacoes_introdutorias')" class="col-md-12" id="informacoesProjeto">
                        <div class="box box-widget">
                          <div class="box-header with-border">
                            <h3 class="box-title">Informações do Projeto</h3>
                          </div>

                          <div class="box-body">
                            <div class="row">

                              <!-- introdução -->
                              <div class="col-md-12">

                                <!-- <span class="label label-danger">ehEdital: {{ ehEdital }} | editalAntesPrazo: {{ editalAtivoVigente }}</span> -->

                                <div v-if="mostrarRef('informacoes_introdutorias_introducao') && (!ehEdital || !(ehEdital && editalAtivoVigente))" class="form-group required-field required-field col-md-12"
                                     :class="{ 'has-error' : errors.first('introducao')}">
                                  <label for="introduction" class="control-label ">Introdução</label>
                                  <div class="">
                                    <textarea-autosize v-resizable @input="resizable" :placeholder="ehEdital ? '' : 'Nenhum texto informativo...'" :min-height="200" :autosize="true" @blur.native="onBlurTextarea" v-model="proposta.ds_introducao" name="introducao" class="form-control" data-vv-as="Informações Introdutórias do Projeto" rows="4" v-validate="'required'" data-cy="ds_introducao"></textarea-autosize>
                                    <span v-if="errors.first('introducao')" class="label label-danger"> {{ errors.first('introducao') }}</span>
                                  </div>
                                </div>
                              </div>

                              <!-- Apresentação -->
                              <div v-if="mostrarRef('informacoes_introdutorias_apresentacao')" class="col-md-12">
                                <div  class="form-group required-field col-md-12 required"
                                      :class="{ 'has-error' : errors.first('apresentacao')}">
                                  <label for="presentation" class="control-label">Apresentação</label>
                                  <div name="proposal.presentation" class="">
                                    <textarea-autosize v-if="ehEdital" v-resizable v-model="proposta.ds_apresentacao" name="apresentacao" class="form-control" rows="4" @input="resizable" :min-height="200" :autosize="true" v-validate="'required'" data-cy="ds_apresentacao" data-vv-as="Apresentação do Projeto"></textarea-autosize>
                                    <textarea-autosize v-else v-resizable v-model="proposta.ds_apresentacao" name="apresentacao" class="form-control" rows="4" @input="resizable" :min-height="200" :autosize="true" v-validate="'required'" data-cy="ds_apresentacao" data-vv-as="Apresentação do Projeto"
                                              placeholder="Descreva aqui histórico, capacidade técnica e experiências da sua organização. Utilize os tópicos abaixo para orientar seu texto:
- Por que sua organização foi criada. Qual o seu propósito?
- Quais são as principais atividades desenvolvidas pela sua instituição?
- A sua organização possui experiência acumulada no mesmo tema da atual proposta? Cite os projetos mais importantes, descrevendo os resultados alcançados, perfil e número de participantes atendidos.
- Qual a infraestrutura disponível para a sua organização? Existem planos para expansão?
- Quais são seus principais parceiros e apoiadores?
- Como sua organização garante a continuidade de suas ações?
- A sua entidade possui uma estratégia de captação de recursos?
- A sua instituição possui associados ou cooperados? Cite quantidade e perfil.
- Como funciona a interação da organização com a comunidade?
- A comunidade participa dos processos de tomada de decisão da sua organização?">
                                      </textarea-autosize>
                                    <span v-if="errors.first('apresentacao')" class="label label-danger"> {{ errors.first('apresentacao') }}</span>

                                  </div>
                                </div>
                              </div>

                              <!-- Território -->
                              <div v-if="mostrarRef('informacoes_introdutorias_territorio')"  class="col-md-12">
                                <div  class="form-group required-field col-md-12 required"
                                      :class="{ 'has-error' : errors.first('territorio')}">
                                  <label for="territory" class="control-label">Território de desenvolvimento do projeto</label>
                                  <div name="proposal.territory" class="">
                                    <textarea-autosize v-if="ehEdital" v-resizable @input="resizable" :min-height="200" :autosize="true" @blur.native="onBlurTextarea" data-vv-as="Território de Desenvolvimento do Projeto" v-model="proposta.ds_territorio" name="territorio" class="form-control" rows="4" v-validate="'required'" data-cy="ds_territorio"></textarea-autosize>
                                    <textarea-autosize v-else v-resizable @input="resizable" :min-height="200" :autosize="true" @blur.native="onBlurTextarea" data-vv-as="Território de Desenvolvimento do Projeto" v-model="proposta.ds_territorio" name="territorio" class="form-control" rows="4" v-validate="'required'" data-cy="ds_territorio"
                                              placeholder="Descreva aqui o contexto local, considerando aspectos sociais, econômicos e ambientais do município e da comunidade a ser assistida. Utilize os tópicos abaixo para orientar seu texto:
- Quais as características socioeconômicas, ambientais e culturais da região?
- Além dos beneficiários e da sua organização, quem são os demais interessados pelo projeto?
- Quais são os equipamentos sociais* e serviços públicos que estão disponíveis para a comunidade local?
- Como é a relação da instituição e da comunidade com o poder público local?
- De que maneira a realidade local se relaciona ao projeto proposto?
- De que maneira a realidade local pode ser uma barreira para o desenvolvimento do projeto?

*São equipamento sociais: postos de saúde, creches, pré-escolas, centros comunitários, etc.">
                                    </textarea-autosize>
                                    <span v-if="errors.first('territorio')" class="label label-danger"> {{ errors.first('territorio') }}</span>

                                  </div>
                                </div>
                              </div>

                              <!-- Justificativa -->
                              <div  v-if="mostrarRef('informacoes_introdutorias_justificativa')" class="col-md-12">
                                <div  class="form-group required-field col-md-12  required"
                                      :class="{ 'has-error' : errors.first('propostaJustificativa')}">
                                  <label for="justification" class="control-label">Justificativa</label>
                                  <div name="proposal.justification" class="">
                                    <textarea-autosize v-if="ehEdital" v-resizable @input="resizable" :min-height="200" :autosize="true" @blur.native="onBlurTextarea" data-vv-as="Justificativa do Projeto" v-model="proposta.ds_justificativa" name="propostaJustificativa" class="form-control" rows="4" v-validate="'required'" data-cy="ds_justificativa"></textarea-autosize>
                                    <textarea-autosize v-else v-resizable @input="resizable" :min-height="200" :autosize="true" @blur.native="onBlurTextarea" data-vv-as="Justificativa do Projeto" v-model="proposta.ds_justificativa" name="propostaJustificativa" class="form-control" rows="4" v-validate="'required'" data-cy="ds_justificativa">
                                              placeholder="Descreva aqui o problema que a sua organização quer solucionar. Utilize os tópicos abaixo para orientar seu texto:
- Qual é a situação-problema a ser solucionado?
- Quais as suas origens?
- Quais os fatores sociais, políticos, ambientais e culturais que o agravam?
- Quais são as consequências desse problema para a região e para o público alvo da proposta?">
                                    </textarea-autosize>
                                    <span v-if="errors.first('propostaJustificativa')" class="label label-danger"> {{ errors.first('propostaJustificativa') }}</span>
                                  </div>
                                </div>
                              </div>

                              <!-- Objetivo Geral -->
                              <div v-if="mostrarRef('informacoes_introdutorias_objetivo_geral')" class="col-md-12">
                                <div  class="form-group required-field col-md-12  required"
                                      :class="{ 'has-error' : errors.first('objetivo Geral')}">
                                  <label for="generalObjective" class="control-label">Objetivo geral</label>
                                  <div name="proposal.generalObjective" class="">
                                    <textarea-autosize v-resizable @input="resizable" :min-height="200" :autosize="true" @blur.native="onBlurTextarea" data-vv-as="Objetivo Geral do Projeto" v-model="proposta.ds_objetivo_geral" name="objetivo Geral" class="form-control" rows="4" v-validate="'required'" data-cy="ds_objetivo_geral"
                                              :placeholder="ehEdital ? '' : 'Defina de forma sucinta o que se pretende alcançar com o projeto. O objetivo geral deve refletir a transformação desejada pela sua organização, levando em consideração o problema apresentado e a solução proposta. Ele deve ser passível de ser alcançado por meio dos objetivos específicos e as atividades propostas. O objetivo deve ser iniciado com um verbo no infinitivo, exemplo: elevar, aprimorar, fortalecer, transformar, etc.'">
                                    </textarea-autosize>
                                    <span v-if="errors.first('objetivo Geral')" class="label label-danger"> {{ errors.first('objetivo Geral') }}</span>

                                  </div>
                                </div>
                              </div>



                              <!-- Resultados esperados -->
                              <div v-if="mostrarRef('informacoes_gerais_resultados')" class="col-md-12">
                                <div class="form-group required-field col-md-12"
                                     :class="{ 'has-error' : errors.first('Resultados esperados')}">
                                  <label for="results" class="control-label">Resultados esperados</label>
                                  <div name="proposal.results">
                                        <textarea-autosize v-if="ehEdital" v-resizable @input="resizable" :min-height="200" :autosize="true" data-vv-as="Resultados Esperados do Projeto" v-model="proposta.ds_resultados" name="Resultados esperados" class="form-control" rows="4" v-validate="'required'" data-cy="ds_resultados"></textarea-autosize>
                                        <textarea-autosize v-else v-resizable @input="resizable" :min-height="200" :autosize="true" data-vv-as="Resultados Esperados do Projeto" v-model="proposta.ds_resultados" name="Resultados esperados" class="form-control" rows="4" v-validate="'required'" data-cy="ds_resultados"
                                                  placeholder="Descreva quais os efeitos e reflexos esperados sobre o cotidiano da comunidade por meio da implantação do projeto proposto.
Os resultados esperados devem ser coerentes com os objetivos propostos.">
                                        </textarea-autosize>
                                    <span v-if="errors.first('Resultados esperados')" class="label label-danger"> {{ errors.first('Resultados esperados') }}</span>
                                  </div>
                                </div>
                              </div>

                              <!-- Operacionalização -->
                              <div v-if="mostrarRef('informacoes_gerais_operacionalizacao') && (!ehEdital || !(ehEdital && editalAtivoVigente))" class="col-md-12">
                                <div class="form-group required-field col-md-12"
                                     :class="{ 'has-error' : errors.first('Operacionalização')}">
                                  <label for="operation" class="control-label">Operacionalização</label>
                                  <div name="proposal.operation">
                                    <textarea-autosize v-if="ehEdital" v-resizable @input="resizable" :min-height="200" :autosize="true" data-vv-as="Operacionalização do Projeto" v-model="proposta.ds_operacao" name="Operacionalização" class="form-control" rows="4" v-validate="'required'" data-cy="ds_operacao"></textarea-autosize>
                                    <textarea-autosize v-else v-resizable @input="resizable" :min-height="200" :autosize="true" data-vv-as="Operacionalização do Projeto" v-model="proposta.ds_operacao" name="Operacionalização" class="form-control" rows="4" v-validate="'required'" data-cy="ds_operacao"
                                                  placeholder="Descreva aqui o que a sua organização apresenta como método para a execução das atividades. Utilize os tópicos abaixo para orientar seu texto:
- Quais são as etapas, processos e rotinas previstas para o projeto?
- O método já foi utilizado em outras situações?
- Será utilizada alguma tecnologia social?
- O método já foi sistematizado? Há previsão de sistematização (caso não haja processo sistematizado)?
- Como será realizado o processo de seleção dos participantes?
- Qual a estratégia para manutenção das ações do projeto após o fim da vigência do convênio com a FBB?">
                                    </textarea-autosize>
                                    <span v-if="errors.first('Operacionalização')" class="label label-danger"> {{ errors.first('Operacionalização') }}</span>
                                  </div>
                                </div>
                              </div>

                              <!-- Parceria -->
                              <div v-if="mostrarRef('informacoes_gerais_parceria') && (!ehEdital || !(ehEdital && editalAtivoVigente))" class="col-md-12">
                                <div class="form-group required-field col-md-12"
                                     :class="{ 'has-error' : errors.first('Parceria')}">
                                  <label for="partner" class="control-label">Parceria</label>
                                  <div name="proposal.partner">
                                    <textarea-autosize v-if="ehEdital" v-resizable @input="resizable" :min-height="200" :autosize="true" data-vv-as="Parceria do Projeto" v-model="proposta.ds_parceria" name="Parceria" class="form-control" rows="4" v-validate="'required'" data-cy="ds_parceria"></textarea-autosize>
                                    <textarea-autosize v-else v-resizable @input="resizable" :min-height="200" :autosize="true" data-vv-as="Parceria do Projeto" v-model="proposta.ds_parceria" name="Parceria" class="form-control" rows="4" v-validate="'required'" data-cy="ds_parceria"
                                                  placeholder="Descreva aqui como a sua organização se relaciona com atores sociais da região. Utilize os tópicos abaixo para orientar o seu texto:
- Como ocorrerá a participação da comunidade no projeto?
- Como a comunidade contribuiu para identificação da demanda e elaboração da proposta?
- Existe cooperação do governo, empresas ou outras fundações no projeto?
- Existe envolvimento de outras organizações da sociedade civil, escolas ou universidades?
- A sua instituição participa de alguma rede?
- A sua instituição participa de conselho ou fórum de política pública relacionada ao tema da atual proposta?
- A sua proposta interage com alguma política pública?">
                                    </textarea-autosize>
                                    <span v-if="errors.first('Parceria')" class="label label-danger"> {{ errors.first('Parceria') }}</span>

                                  </div>
                                </div>
                              </div>
                              <div v-if="mostrarRef('informacoes_introdutorias_resumo')" class="col-md-12">
                                <div class="form-group required-field col-md-12  required"
                                     :class="{ 'has-error' : errors.first('sumario')}">
                                  <label for="summary" class="control-label">Resumo</label>
                                  <div name="proposal.summary" class="">
                                    <textarea-autosize v-resizable @input="resizable" :placeholder="ehEdital ? '' : 'Nenhum texto informativo...'" data-vv-as="Resumo do Projeto" v-model="proposta.ds_resumo" name="sumario" class="form-control" rows="4"  :min-height="200" :autosize="true" v-validate="'required'" data-cy="ds_resumo"></textarea-autosize>
                                    <span v-if="errors.first('sumario')" class="label label-danger"> {{ errors.first('sumario') }}</span>
                                  </div>
                                </div>
                              </div>

                              <div v-if="mostrarRef('informacoes_introdutorias_acoes') && (!ehEdital || !(ehEdital && editalAtivoVigente))" class="col-md-12">
                                <div class="form-group required-field col-md-12  required"
                                     :class="{ 'has-error' : errors.first('acoes')}">
                                  <label for="acoes" class="control-label">Ações de Comunicação</label>
                                  <div>
                                    <textarea-autosize v-resizable @input="resizable" :placeholder="ehEdital ? '' : 'Informe as acões de comunicação'" :min-height="200" :autosize="true" data-vv-as="indicadores" v-model="proposta.ds_acoes_comunicacao" name="acoes" class="form-control" rows="4" v-validate="'required'" data-cy="ds_acoes_comunicacao"></textarea-autosize>
                                    <span v-if="errors.first('acoes')" class="label label-danger"> {{ errors.first('acoes') }}</span>

                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>

                        </div>
                      </div>

                      <!--Publico alvo-->
                      <div v-if="mostrarRef('publico_alvo')" class="col-md-12" id="publicoAlvo">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Público-alvo</h3>
                          </div>
                        </div>
                        <publico-alvo :propsPublicosGrid="proposta.publicos_alvo" @publicoAlvoAdicionado="proposta.publicos_alvo = $event"></publico-alvo>
                      </div>

                      <!-- 69906 - Definicao de publico alvo -->                      
                      <div v-if="mostrarRef('publico_alvo')" class="col-md-12">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Detalhamento do Público-alvo <strong>Previsto</strong>:</h3>
                          </div>
                        </div>
                        <publicoAlvoDescricaoProposta ref="publicoAlvoDescricao" :proposta="this.$route.params.id" :fixado="false" :permiteEditar="true" :abrirAbas="true"/>
                      </div>

                      <!-- 69906 - Cadastro de Tecnologia Social -->
                      <div class="col-md-12" id="tecnologiaSocial">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Tecnologia Social:</h3>
                          </div>
                        </div>
                        <tecnologiaSocial ref="tecnologiaSocial" :proposta="this.$route.params.id" :fk_processo="proposta.fk_processo" :telaProjeto="false"/>
                      </div>

                      <!--  66201 - Licenciamento Ambiental - Indicativo de Licenças - Fase CADASTRO) -->
                      <!-- <div class="col-md-12" v-if="_.includes(['CADASTRO', 'REVISAO'], proposta.ds_fase)"> -->
                        <!-- <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Licenciamento Ambiental:</h3>
                          </div>
                        </div> -->
                        <!-- <cadastroLicencas ref="licenciamentoAmbiental" :idProposta="proposta.id" :cadastroProposta="_.includes(['CADASTRO', 'REVISAO'], proposta.ds_fase)? true : false"/> -->
                      <!-- </div> -->

                      <!--Equipe do Projeto-->
                      <div v-if="mostrarRef('equipe_do_projeto')" class="col-md-12" id="equipeProjeto">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Equipe do Projeto</h3>
                          </div>
                        </div>
                        <span v-if="entidadeEhFundacao" class="col-md-12 entidadeEhFundacao">
                          Dispensado registro pela proponente Fundação BB
                        </span>
                        <span v-else>
                          <equipe-projeto :propsEquipes="proposta.equipes" @equipeAdicionada="proposta.equipes = $event"></equipe-projeto>
                        </span>
                      </div>


                      <!-- Entidade executora  -->
                      <div v-if="mostrarRef('entidade_executora_proponente')" class="col-md-12" id="entidadeExecutora">
                        <div class="box box-widget">
                          <div class="box-header with-border">
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
                                           v-model="proposta.bt_entidade_executora" value="1" selected="selected"> Sim
                                  </label>
                                  <label class="radio-inline control-label">
                                    <input type="radio" name="entityExecutingBool" id="proposal-entity-executing-false"
                                           v-model="proposta.bt_entidade_executora" value="0"> Não
                                  </label>
                                </div>
                              </fieldset>

                              <!--Se Não mostra os campos abaixo-->
                              <div v-if="proposta.bt_entidade_executora == 0">

                                <!-- dados da entidade -->
                                <fieldset class="col-md-4 col-sm-6 col-xs-12">
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
                                <fieldset class="col-md-4 col-sm-6 col-xs-12">
                                  <legend>Contato</legend>
                                  <!--Email-->
                                  <div class="form-group required-field col-md-12"
                                       :class="{ 'has-error' : errors.first('E-mail executora')}">
                                    <label class="control-label">E-mail</label>
                                    <div name="proposal.entityExecutingEmail">
                                      <input v-model="proposta.ds_entidade_email"
                                             @input="proposta.ds_entidade_email=$event.target.value.toLowerCase()"
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
                                <fieldset class="col-md-4 col-sm-6 col-xs-12">
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

                      <!--Projeto Duplicação-->
                      <div v-if="mostrarRef('projeto_de_duplicacao')" class="col-md-12" v-show="usuarioLogado.userType === 'FUNDACAO'" id="projetoDuplicacao">

                        <div class="box box-widget" v-if="$route.params.processo !== 'CADASTRO' && $route.params.processo !== 'SOLICITACAO' && $route.params.processo !== 'REVISAO'">
                          <div class="box-header with-border">
                            <h3 class="box-title">Projeto de duplicação</h3><span v-if="$route.params.processo === 'ANALISE'" style="color: red; margin-left: 5px; font-size: large; cursor: pointer;">*</span>
                          </div>

                          <div class="box-body" v-if="$route.params.processo !== 'CADASTRO' && $route.params.processo !== 'SOLICITACAO'">
                            <div class="row">
                              <div class="col-md-6">
                                <div class="form-group col-md-12 required"
                                     :class="{ 'has-error' : errors.first('Projeto Duplicação')}">
                                  <div name="proposal.duplicateProject">
                                    <select name="Projeto Duplicação"
                                            class="form-control"
                                            @change="duplicador"
                                            aria-hidden="true"
                                            v-model="proposta.nr_projeto_duplicacao">
                                      <option v-for="projeto in arvoreProjetos"
                                              :value="projeto.numprj" >{{projeto.numprj + ' / ' + projeto.nomprj}}</option>
                                    </select>
                                    <div v-if="projetoSuperior !== ''">
                                      <label class="control-label">Projeto Superior:</label>
                                      <div>{{projetoSuperior}}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="col-md-12" v-if="usuarioLogado.userType === 'FUNDACAO'" id="edital">
                        <div class="box box-widget">
                          <div class="box-header with-border">
                            <h3 class="box-title">Edital</h3>
                            </div>
                            <div v-if="_.has(proposta, 'fk_edital') & proposta.fk_edital!==null">
                              {{proposta.fk_edital}}-{{ proposta.edital.ds_numero_edital }}

                              </div>
                              <div v-else>
                                <div class="box-body">
                                  <div class="form-group row">
                                    <div class="col-md-6">
                                      <div class="form-group col-md-12">
                                        <label class="control-label">Escolha o Edital a ser vinculado</label>
                                          <select v-model="editalSelecionado" class="form-control">
                                            <option :value="null">Escolha o edital</option>
                                            <option v-for="edital in listaEditais" :value="edital.id">{{edital.ds_numero_edital}}</option>
                                          </select>
                                      </div>
                                      <g-button-ujarak color="primary" size="button--size-ss" @click.native="editaEdital" ><i class="fa fa-pencil" aria-hidden="true"></i> Confirmar</g-button-ujarak>
                                  
                                    </div>
                                  </div>
                                </div>
                          
                            </div>
                            
                          </div>
                        </div>

                      <!--Objetivos Específicos-->
                      <div v-if="mostrarRef('objetivo_especifico')" class="col-md-12" id="objetivoEspecifico">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Objetivo Específico</h3>
                          </div>
                        </div>
                        <objetivo-especifico :editavel="true" :propsObjetivos="proposta.objetivos" :propsMetas="proposta.metas" :propsProposta="proposta" @objetivoAdicionado="proposta.objetivos = $event"></objetivo-especifico>
                      </div>

                      <!--Metas-->
                      <div v-if="mostrarRef('metas')" class="col-md-12" ref="tabelaMetas" id="metas">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Metas</h3>
                          </div>
                        </div>
                        <metas :editavel="true" :propsObjetivos="proposta.objetivos" :propsMetas="proposta.metas" :propsAtividades="proposta.atividades" :propsProposta="proposta" @metaAdicionada="proposta.metas = $event" :atvSemMetas="atvSemMetas"></metas>
                      </div>

                      <!--Atividades-->
                      <div v-if="mostrarRef('atividades')" class="col-md-12" id="atividades">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Atividades</h3>
                          </div>
                        </div>
                        <atividades :editavel="true" :meses="proposta.nr_periodos" :propsObjetivos="proposta.objetivos" :propsMetas="proposta.metas" :propsAtividades="proposta.atividades" :propsProposta="proposta" @atividadeAdicionada="proposta.atividades = $event"></atividades>
                      </div>

                      <!--Cronograma-->
                      <!--Se tiver alguma atividade dentro da proposta mostra o cronograma-->
                      <div class="col-md-12" id="cronograma">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Cronograma Físico-Financeiro</h3>
                          </div>
                        </div>
                        <cronograma v-if="!previewCotacao && !ehExcecao" :propsObjetivos="proposta.objetivos" :key="componentKey" :propsAtividades="proposta.atividades" :metas="proposta.metas" :proposta="proposta" :meses="proposta.nr_periodos" :projetoDuplicacao="proposta.nr_projeto_duplicacao" @itemAdicionado="proposta.atividades = $event" @validacaoCronograma="adicionaRestricao($event)"></cronograma>
                        <cronogramaCotacao v-if="ehExcecao" :propsObjetivos="proposta.objetivos" :key="componentKey" :propsAtividades="proposta.atividades" :metas="proposta.metas" :proposta="proposta" :meses="proposta.nr_periodos" :projetoDuplicacao="proposta.nr_projeto_duplicacao" @itemAdicionado="proposta.atividades = $event" @validacaoCronograma="adicionaRestricao($event)" ref="cronogramaCotacao"></cronogramaCotacao>
                      </div>

                      <!--Gantt-->
                      <div v-if="mostrarRef('gantt')" class="col-md-12">
                        <!-- Gantt de Atividades do projeto-->
                        <visualiza-gantt :numeroProjeto="null" :propsProposta="proposta" :tipoBarra="'financeiro'" :mostrarExecFinanc="true" :mostrarExecDeclarada="false"></visualiza-gantt>
                      </div>

                      <!-- Parcela de adiantamento -->
                      <!-- Suporte 60751 solicitando para exibir Parcela de Adiantamento em todas as fases -->
                      <!--<div class="col-md-12" v-if="$route.params.processo === 'ANALISE' || $route.params.processo === 'DEFERIMENTO'">-->
                      <div v-if="possuiAdiandamento && proposta.adiantamentos.length <= 0" class="row-flex centered-start parcela-erro" id="parcelaAdiantamento">
                         <i class="fa fa-exclamation-circle" aria-hidden="true"></i> Atenção. Itens adiantáveis sem parcela de adiantamento cadastrada.
                      </div>
                      <div class="col-md-12" v-if="_.find(proposta.atividades, function(atv) { return _.find(_.get(atv, 'itens_orcamentos', []), function(ite) { return ('' + ite.adiantavel) === '1' }) })">
                        <div class="box-header with-border">
                          <h3 class="box-title">Parcela de Adiantamento</h3>
                        </div>
                        <parcela-adiantamento :editavel="true" :propsParcelas="proposta.adiantamentos" :propsAtividades="proposta.atividades" @parcelaAdicionada="proposta.adiantamentos = $event" @validacaoParcelasAdiantamento="adicionaRestricao($event)"></parcela-adiantamento>
                      </div>
                      <br>
                      <br>
                      <br>
                      <br>
                      <div class="col-md-4 col-sm-6" :class="{ 'has-error' : errors.first('abrangencia')}" v-if="proposta.ds_fase === 'CADASTRO'" id="abrangenciaNacional">
                          <!--<label class="control-label">O projeto tem Abrangência Nacional?</label>-->
                          <div>
                            <fieldset class="col-md-12">
                              <legend>O projeto é de Abrangência Nacional? <span style="color:red">*</span></legend>
                              <div name="proposal.entityIsExecutioner">
                                <label class="radio-inline control-label">
                                  <input type="radio" name="abrangencia"
                                         v-model="proposta.bt_fep_abrangencia" value="1" @change="verificaAbrangenciaNacional()"> Sim
                                </label>
                                <label class="radio-inline control-label">
                                  <input type="radio" name="abrangencia"
                                         v-model="proposta.bt_fep_abrangencia" value="0" @change="verificaAbrangenciaNacional()"> Não
                                </label>
                              </div>
                            </fieldset>
                          </div>
                          <span v-if="errors.first('abrangencia')"
                                class="label label-danger"> {{ errors.first('abrangencia') }}</span>
                        </div>

                      <!-- Municípios -->
                      <div v-if="mostrarRef('municipios')" class="col-md-12" id="municipiosExecucao">
                        <div class="modal-body"></div>
                        <div class="box box-widget">
                          <div  class="box-header">
                            <h3  class="box-title">Municípios - Locais de execução</h3>
                          </div>
                        </div>
                        <municipalizacao :propsProposta="proposta" @municipioAdicionado="proposta.municipalizacao = $event" @validacaoMunicipio="adicionaRestricao($event)" :editavel="true" :travarMunicipios="true" ref="municipalizacao"></municipalizacao>
                        <!-- 69906 - Novos Municípios -->                      
                        <municipiosNovos :municipalizacao="proposta.municipalizacao"/>
                      </div>

                      <!--Cursos-->
                      <div v-if="mostrarRef('cursos') && (!ehEdital || !(ehEdital && editalAtivoVigente))" class="col-md-12" id="cursos">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Cursos</h3>
                          </div>
                        </div>
                        <cursos :propsCursos="proposta.cursos"></cursos>
                      </div>

                      <!--TesteMunhas-->
                      <div v-if="mostrarRef('cursos')" class="col-md-12" id="testemunhas">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Testemunhas</h3>
                          </div>
                        </div>
                        <testemunhas :idProposta="this.$route.params.id" ref="testemunhas"></testemunhas>
                      </div>

                      <!--Indicativo de Agência-->
                      <div v-if="mostrarRef('cursos')" class="col-md-12" id="indicacaoAgencia">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Indicação de Agência</h3>
                          </div>
                        </div>
                        <agenciaIndicativaContaProjeto :proposta="this.proposta" :agenciaSelecionadaProp="this.proposta.hasOwnProperty('agenciaSelecionada') ? this.proposta.agenciaSelecionada : null" ref="agenciaIndicativa"></agenciaIndicativaContaProjeto>
                      </div>

                      <!--Solenização-->
                      <!--<div v-if="mostrarRef('solenizacao')" class="col-md-12">-->
                      <!--<div class="box box-widget">-->
                      <!--<div class="box-header">-->
                      <!--<h3 class="box-title">Solenização</h3>-->
                      <!--</div>-->
                      <!--</div>-->
                      <!--<div>-->
                      <!--<p>-->
                      <!--<ol>-->
                      <!--<li>A Convenente informará à FBB pelo e-mail fbb.imprensa@fbb.org.br, 30 dias antes da data de assinatura do convênio:-->
                      <!--<ul>-->
                      <!--<li>Entidade convenente, responsável legal e contatos</li>-->
                      <!--<li>Objeto do convênio</li>-->
                      <!--<li>Data, local e horário provável do evento</li>-->
                      <!--<li>Autoridades precistas no cerimonial e nº de participantes</li>-->
                      <!--<li>Programação prévia e contatos da imprensa local</li>-->
                      <!--</ul>-->
                      <!--<li>Informar no Assunto do e-mail: Nº e nome do Projeto - Assinatura de convênio</li>-->
                      <!--<li>A Convenente fará, obrigatoriamente, a cobertura fotográfica do evento, com uso de, no mínimo, um banner indicativo do investimento social da FBB<br>-->
                      <!--e enviará as fotos com resolução mínima 320 x 233 pixels ou o equivalente a 150 DPI, formato 12 x 10 cm, similar ou proporcional.-->
                      <!--</li>-->
                      <!--<li>No evento deverá participar funcionário do BB.</li>-->
                      <!--<li>Se possível, a Convenente fará a filmagem e/ou cobertura fotográfica de outras fases do convênio e divulgará em sua página na Internet.</li>-->
                      <!--<li>Após o evento, enviar foto para o e-mail descrito no item 1.</li>-->
                      <!--</ol>-->
                      <!--<p style="margin: 30px;">Valor Padrão (Após Criação):<br>-->
                      <!--Cifrato: Não-->
                      <!--</p>-->
                      <!--</div>-->
                      <!--</div>-->

                      <!--Documentos-->
                      <div v-if="mostrarRef('documentos')" class="col-md-12" id="anexos">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Documentos da Proposta</h3>
                          </div>
                        </div>
                        <upload-documentos-php-novo :propDocumentos="documentosProposta" :documentTypes="proposta.tipo_documentos" :localUso="'PROPOSTA_COMPLETA_DOCUMENTOS_ANEXOS'" :propsEtapa="nulo"></upload-documentos-php-novo>
                      </div>
                      <div class="col-md-12">
                        <div class="box box-widget">
                          <div class="row-flex all-start gap-10">
                            <label>Mostra anexos cotação:</label>
                            <input type="checkbox" v-model="abrirVisualizacaoCotacao" class="ng-pristine ng-untouched ng-valid ng-empty"/>
                          </div>
                          <div class="box-header">
                            <h3 v-if="abrirVisualizacaoCotacao"class="box-title">Documentos da Cotacao</h3>
                          </div>
                          <visualizacaoDocumentosCotacao v-if="abrirVisualizacaoCotacao" :proposta="proposta"></visualizacaoDocumentosCotacao>
                        </div>
                      </div>

                      <!--Declaração de Adimplência e Inexistência de Outras Fontes:-->
                      <!--<div class="col-md-12">-->
                      <!--<div class="box box-widget">-->
                      <!--<div class="box-header">-->
                      <!--<h3 class="box-title">Declaração de Adimplência e Inexistência de Outras Fontes:</h3>-->
                      <!--</div>-->
                      <!--<label>Na qualidade de representante legal do proponente, declaro para fins de prova junto à Fundação Banco do Brasil, não contar com-->
                      <!--outras fontes de recursos para as mesmas despesas custeadas pela Fundação Banco do Brasil neste projeto.</label>-->
                      <!--</div>-->
                      <!--<upload-documentos-php-novo :propDocumentos="proposta.documentos" :documentTypes="[]"></upload-documentos-php-novo>-->
                      <!--</div>-->
                    </div>
                  </fieldset>

                  <fieldset v-if="mostrarRef('historico')" :enabled="this.$router.currentRoute.name === 'proposta-visualiza'" id="historicoAprovacoes">

                    <!--Histórico de Aprovações:-->
                    <div class="col-md-12" v-show="usuarioLogado.userType === 'FUNDACAO' && esconder === true">
                      <div class="box box-widget">
                        <div class="box-header">
                          <h3 class="box-title">Histórico de Aprovações:</h3>
                        </div>
                      </div>
                      <historico-proposta :proposta="proposta" @historico_itens="historico_atualizado = $event"></historico-proposta>
                    </div>
                  </fieldset>
                  <fieldset>
                    <!--<pre-analise-form :propsPreAnalise="proposta" :propsFluxo="fluxo" @preAnaliseProposta="preAnalise = $event" ref="child"></pre-analise-form>-->
                    <div align="right" v-if="esconder === true"><span style="cursor: pointer;" @click="irTopo()"><i class="fa fa-caret-up">&nbspIr para o início</i></span></div>
                    <!--componente de análise-->
                    <fieldset v-if="(this.$route.params.processo !== 'SOLICITACAO' && !_.isNull(proposta) && !_.isEmpty(proposta))">
                      <div v-show="usuarioLogado.userType === 'FUNDACAO'" v-if="(this.$route.params.processo === 'ANALISE') || (proposta.ds_fase === 'ANALISE' && !_.isEmpty(this.analise))">
                        <analise :propsAnalise="proposta" :propsFluxo="fluxo" @analiseProposta="analise = $event" ref="analise" @setPropostaSimplificada="setPropostaSimplificada($event)"></analise>
                      </div>
                      <!--componente de análise (VISUALIZAÇÃO)-->
                      <div v-if="usuarioLogado.userType === 'FUNDACAO' && ((this.$router.currentRoute.name === 'proposta-visualiza' && proposta.ds_fase === 'ANALISE'))">
                        <analise :propsAnalise="proposta" :propsFluxo="fluxo" @analiseProposta="analise = $event" ref="analise" @setPropostaSimplificada="setPropostaSimplificada($event)"></analise>
                      </div>
                      <div class="text-left box-header" v-if="proposta.ds_fase === 'DEFERIMENTO' || proposta.ds_fase === 'FORMALIZACAO' || proposta.ds_fase === 'APROVACAO_PROJETO'">
                        <a  v-if="esconderAnalise === false" @click.prevent="esconderAnalise = true" style="cursor: pointer"><i class="fa fa-caret-down" aria-hidden="true"></i> Mostrar a análise realizada em <b>{{analiseData | moment('L')}}</b> <span v-if="analiseUsuario !== null"> por <b>{{ analiseUsuario }}</b></span></a>
                        <a  v-if="esconderAnalise === true" @click.prevent="esconderAnalise = false" style="cursor: pointer"><i class="fa fa-caret-up" aria-hidden="true"></i> Ocultar a análise</a>
                      </div>
                      <!--componente de análise (VISUALIZAÇÃO)-->
                      <div v-if="esconderAnalise === true">
                        <analise :propsAnalise="proposta" :propsFluxo="fluxo" ref="analise" @setPropostaSimplificada="setPropostaSimplificada($event)"></analise>
                      </div>
                    </fieldset>
                    <!--componente de deferimento-->
                    <div v-if="usuarioLogado.userType === 'FUNDACAO' && ((this.$route.params.processo === 'DEFERIMENTO' && this.$router.currentRoute.name !== 'proposta-visualiza') || (proposta.ds_fase === 'DEFERIMENTO' && !_.isEmpty(this.deferimento)))">
                      <deferimento :propsDeferimento="proposta" :propsFluxo="fluxo" @deferimentoProposta="deferimento = $event" ref="child"></deferimento>
                    </div>
                    <div v-if="usuarioLogado.userType === 'FUNDACAO' && this.$router.currentRoute.name === 'proposta-visualiza' && proposta.ds_fase === 'DEFERIMENTO'">
                      <deferimento :propsDeferimento="proposta" :propsFluxo="fluxo" @deferimentoProposta="deferimento = $event" ref="child"></deferimento>
                    </div>
                    <!--componente de formalização-->
                    <div v-if="usuarioLogado.userType === 'FUNDACAO' && (this.$route.params.processo === 'FORMALIZACAO' && this.$router.currentRoute.name !== 'proposta-visualiza')  || (proposta.ds_fase === 'FORMALIZACAO' && !_.isEmpty(this.formalizacao) && this.$router.currentRoute.name !== 'proposta-visualiza')">
                      <formalizacao :propsFormalizacao="proposta" @formalizacaoProposta="proposta = $event" @validacaoFormalizacao="adicionaRestricao($event)" ref="child" :propsAdiantaveis="possuiItensAdiantaveis"></formalizacao>
                    </div>
                    <!--componente de formalização (VISUALIZAÇÃO)-->
                    <div v-if="usuarioLogado.userType === 'FUNDACAO' &&  this.$router.currentRoute.name === 'proposta-visualiza' && proposta.ds_fase === 'FORMALIZACAO'" :propsAdiantaveis="possuiItensAdiantaveis">
                      <formalizacao :propsFormalizacao="proposta" @formalizacaoProposta="proposta = $event" ref="child"></formalizacao>
                    </div>
                    <!--componente de aprovacao-->
                    <div v-if="usuarioLogado.userType === 'FUNDACAO' && (this.$route.params.processo === 'APROVACAO_PROJETO' && this.$router.currentRoute.name !== 'proposta-visualiza')  || (proposta.ds_fase === 'APROVACAO_PROJETO' && !_.isEmpty(this.aprovacao) && this.$router.currentRoute.name !== 'proposta-visualiza')">
                      <!--<aprovacao :propsAprovacao="proposta" @aprovacaoProposta="aprovacao = $event" ref="child"></aprovacao>-->
                      <aprovacao :propsAprovacao="proposta" @aprovacaoProposta="aprovacao = $event" @validacaoAprovacao="adicionaRestricao($event)" ref="child"></aprovacao>
                    </div>
                    <!--componente de aprovacao (VISUALIZAÇÃO)-->
                    <div v-if="usuarioLogado.userType === 'FUNDACAO' &&  this.$router.currentRoute.name === 'proposta-visualiza' && proposta.ds_fase === 'APROVACAO_PROJETO'">
                      <aprovacao :propsAprovacao="proposta" @aprovacaoProposta="aprovacao = $event" ref="child"></aprovacao>
                    </div>
                  </fieldset>
                  <!--<div v-show="usuarioLogado.userType === 'FUNDACAO'" v-if="this.$route.params.processo === 'FORMALIZAR_PROJETOS' || (proposta.ds_fase === 'FORMALIZAR_PROJETOS' && !_.isEmpty(this.aprovacao))" ref="child">-->
                  <!--<aprovacao :propsAprovacao="proposta" @aprovacaoProposta="aprovacao = $event"></aprovacao>-->
                  <!--</div>-->
                </div>
                <div class="modal-content" style="z-index: 10000">
                </div>
              </div>
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
  import cronogramaCotacao from '../modules/comparativoPrecos/cronogramaCotacao.vue'
  import { mapGetters } from 'vuex'
  import Gantt from '../modules/Gantt'
  import Municipalizacao from '../modules/municipalizacao'
  import Cursos from '../modules/cursos'
  import Solenizacao from '../modules/solenizacao'
  import HistoricoProposta from '../modules/historicoProposta'
  import PreAnaliseForm from '../validação/proposta/preAnaliseForm'
  import Analise from '../validação/proposta/analise'
  import Deferimento from '../validação/proposta/deferimento'
  import Formalizacao from '../validação/proposta/formalizacao'
  import Aprovacao from '../validação/proposta/aprovacao'
  import moment from 'moment'
  import UploadDocumentosPhpNovo from '../modules/uploadDocumentosPhpNovo'
  import VisualizaGantt from '../projetos/Atividades'
  import publicoAlvoDescricaoProposta from '../modules/publicoAlvoDescricaoProposta.vue'
  import tecnologiaSocial from '../modules/tecnologiaSocial.vue'
  import municipiosNovos from '../modules/municipiosNovos.vue'
  import CountdownTimer from '../CountdownTimer.vue'
  import testemunhas from '../modules/testemunhas.vue'
  import agenciaIndicativaContaProjeto from '../modules/agenciaIndicativaContaProjeto.vue'
  import visualizacaoDocumentosCotacao from '../modules/comparativoPrecos/visualizacaoDocumentosCotacao.vue'
  import GerenciadorEdicaoProposta from './GerenciadorEdicaoProposta.vue'
  import NavegadorProposta from './NavegadorProposta.vue'

  export default {
    components: {
      CountdownTimer,
      VisualizaGantt,
      UploadDocumentosPhpNovo,
      PreAnaliseForm,
      ParcelaAdiantamento,
      Analise,
      Deferimento,
      Formalizacao,
      Aprovacao,
      HistoricoProposta,
      Solenizacao,
      Cursos,
      Municipalizacao,
      Gantt,
      Cronograma,
      cronogramaCotacao,
      Atividades,
      Metas,
      ObjetivoEspecifico,
      Telefone,
      PublicoAlvo,
      EquipeProjeto,
      publicoAlvoDescricaoProposta,
      tecnologiaSocial,
      municipiosNovos,
      testemunhas,
      agenciaIndicativaContaProjeto,
      visualizacaoDocumentosCotacao,
      GerenciadorEdicaoProposta,
      NavegadorProposta
    },
    name: 'edita-proposta',
    data () {
      return {
        titulo: 'SGP',
        dataHoraEncerramentoEdital: null,
        progressBar: {
          stepAtual: null,
          stepTotal: null,
          tarefaAtual: null
        },
        poderes: [],
        loading: {
          show: false,
          poderes: false
        },
        MunTotalParticipantes: 0,
        enderecoEntidadePrincipal: [],
        entidadeEhFundacao: false,
        textoAlerta: 'É necessário preencher o projeto duplicador!',
        documentosProposta: [],
        tel: '',
        finalizou: false,
        nulo: null,
        array: [],
        atvSemMetas: [],
        metaNaoAchada: [],
        camposOK: true,
        verificaFilhos: false,
        esconder: true,
        esconderAnalise: false,
        esconderEntidade: false,
        analise: {},
        deferimento: {},
        formalizacao: {},
        aprovacao: {},
        fluxo: {},
        filtro: [],
        elementos: {
          visivel: ''
        },
        analiseUsuario: '',
        analiseData: '',
        mensagem: '',
        historico_atualizado: [],
        bloqueiaBotoes: false,
        restricaParaConcluir: [],
        projetoSuperior: '',
        listaEditais: [],
        numeroEdital: '',
        editalSelecionado: '',
        hoje: new Date(),
        ehEdital: false,
        editalAtivoVigente: false,
        preencheuAbrangencia: false,
        proposta: {
          entidade: {},
          documentos: {
            proposta: [],
            analise: [],
            deferimento: [],
            formalizacao: []
          },
          ds_projeto_duplicacao_descricao: ''
        },
        componentKey: 0,
        estados: ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'],
        titulosAba: {'SOLICITACAO': 'Cadastro', 'CADASTRO': 'Cadastro', 'REVISAO': 'Revisão pela entidade', 'ANALISE': 'Análise', 'DEFERIMENTO': 'Deferimento', 'FORMALIZACAO': 'Formalização', 'APROVACAO_PROJETO': 'Aprovação do projeto'},
        arvoreProjetos: [],
        possuiItensAdiantaveis: false,
        restricoesAtivasEntidade: null,
        restricoesAtivasProjetosDaEntidade: null,
        previewCotacao: false,
        // Excecoes de propostas para cotação
        ehExcecao: false,
        abrirVisualizacaoCotacao: false,
        travarEdicao: false,
        verificaSessao: true,
        travaSessao: false,
        carregaProposta: false,
        idsNavegador: [
          {
            id: 'inicio',
            label: 'Inicio'
          },
          {
            id: 'dadosEntidade',
            label: 'Dados da Entidade'
          },
          {
            id: 'informacoesProjeto',
            label: 'Informações do Projeto'
          },
          {
            id: 'publicoAlvo',
            label: 'Público-Alvo'
          },
          {
            id: 'tecnologiaSocial',
            label: 'Tecnologia Social'
          },
          {
            id: 'equipeProjeto',
            label: 'Equipe do Projeto'
          },
          {
            id: 'entidadeExecutora',
            label: 'Entidade Executora'
          },
          {
            id: 'projetoDuplicacao',
            label: 'Projeto Duplicação'
          },
          {
            id: 'edital',
            label: 'Edital'
          },
          {
            id: 'objetivoEspecifico',
            label: 'Objetivo Específico'
          },
          {
            id: 'metas',
            label: 'Metas'
          },
          {
            id: 'atividades',
            label: 'Atividades'
          },
          {
            id: 'cronograma',
            label: 'Cronograma'
          },
          {
            id: 'parcelaAdiantamento',
            label: 'Parcela de Adiantamento'
          },
          {
            id: 'abrangenciaNacional',
            label: 'Abrangência Nacional'
          },
          {
            id: 'municipiosExecucao',
            label: 'Municípios - Locais de execução'
          },
          {
            id: 'cursos',
            label: 'Cursos'
          },
          {
            id: 'testemunhas',
            label: 'Testemunhas'
          },
          {
            id: 'indicacaoAgencia',
            label: 'Indicação de Agência'
          },
          {
            id: 'anexos',
            label: 'Documentos da Proposta'
          },
          {
            id: 'historicoAprovacoes',
            label: 'Histórico de Aprovações'
          },
          {
            id: 'analise',
            label: 'Análise'
          },
          {
            id: 'fep',
            label: 'FEP'
          },
          {
            id: 'odsMarcacao',
            label: 'Cadastro de ODS'
          },
          {
            id: 'relatorioAnalise',
            label: 'Relatório da Análise'
          },
          {
            id: 'ratingEntidade',
            label: 'Rating da Entidade'
          },
          {
            id: 'questionarioRiscos',
            label: 'Questionário de Riscos'
          },
          {
            id: 'categorizadores',
            label: 'Categorizadores'
          },
          {
            id: 'periodicidadeRelatorio',
            label: 'Perodicidade Relatório Execução'
          },
          {
            id: 'parecerJuridico',
            label: 'Parecer Jurídico'
          },
          {
            id: 'documentosAnalise',
            label: 'Documentos da Análise'
          },
          {
            id: 'formalizacao',
            label: 'Formalização'
          },
          {
            id: 'aprovacao',
            label: 'Aprovação'
          }
        ]
      }
    },
    inject: ['$validator'],
    provide () {
      return {
        $validator: this.$validator
      }
    },
    watch: {
      documentosProposta () {
        if (this.documentosProposta) {
          this.proposta.documentos.proposta = this.documentosProposta
        }
      },
      'proposta.entidade.id': function () {
        if (this.proposta.entidade.id) {
          this.verificaSeExisteRestricoesAtivas()
        }
      }

    },
    computed: {
      possuiAdiandamento () {
        let comAdiantamento = _.find(this.proposta.atividades, function (atv) { return _.find(_.get(atv, 'itens_orcamentos', []), function (ite) { return ('' + ite.adiantavel) === '1' }) })
        return !!comAdiantamento
      },
      totalParticipantes () {
        let totalParticipantes = 0
        this.proposta.publicos_alvo.forEach((publico) => {
          totalParticipantes = parseInt(totalParticipantes) + parseInt(publico.nr_participantes_diretos)
        })
        return parseInt(totalParticipantes)
      },
      totalParticipantesMunicipios () {
        let total = 0
        if (this.proposta.municipalizacao.length > 0) {
          this.proposta.municipalizacao.forEach((item) => {
            total += parseInt(item.nr_total_participantes)
          })
        }
        return parseInt(total)
      },
      datas: function () {
        if (this.proposta.dt_assinatura_convenio) {
          this.proposta.dt_data_vigencia = moment(this.proposta.dt_assinatura_convenio).add(parseInt(this.proposta.periodo_vigencia), 'M').format('DD/MM/YYYY')
        } else {
          if (this.proposta.dt_data_inicial) {
            this.proposta.dt_data_vigencia = moment(this.proposta.dt_data_inicial).add(parseInt(this.proposta.periodo_vigencia), 'M').format('DD/MM/YYYY')
          }
        }
      },
      dataFinal: function () {
        if (this.proposta.dt_data_inicial) {
          return moment(this.proposta.dt_data_inicial).add(this.proposta.nr_periodos, 'M').format('DD/MM/YYYY')
        }
      },
      // Inclusão de função para imprimir a data de vigência que estava quebrando MM e DD
      dataVigencia: function () {
        if (this.proposta.dt_assinatura_convenio) {
          return moment(this.proposta.dt_assinatura_convenio).add(this.proposta.periodo_vigencia, 'M').format('DD/MM/YYYY')
        } else {
          if (this.proposta.dt_data_inicial) {
            return moment(this.proposta.dt_data_inicial).add(this.proposta.periodo_vigencia, 'M').format('DD/MM/YYYY')
          }
        }
      },
      telefone: function () {
        if (this.proposta.entidade.contato) {
          if (this.proposta.entidade.contato.ds_telefone.substring(0, 1) !== '(') {
            let size = this.proposta.entidade.contato.ds_telefone.length
            if (size < 11) {
              this.tel = '(' + this.proposta.entidade.contato.ds_telefone.substring(0, 2) + ') ' + this.proposta.entidade.contato.ds_telefone.substring(2, 6) + ' - ' + this.proposta.entidade.contato.ds_telefone.substring(6, 10)
            } else {
              this.tel = '(' + this.proposta.entidade.contato.ds_telefone.substring(0, 2) + ') ' + this.proposta.entidade.contato.ds_telefone.substring(2, 7) + ' - ' + this.proposta.entidade.contato.ds_telefone.substring(7, 11)
            }
          } else {
            this.tel = this.proposta.entidade.contato.ds_telefone
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
      // atividades () { // Carrega as atividades
      //   let atividades = []
      //   if (this.proposta.objetivos) {
      //     this.proposta.objetivos.forEach((objetivo) => {
      //       if (objetivo.metas) {
      //         objetivo.metas.forEach((meta) => {
      //           if (meta.atividades) {
      //             meta.atividades.forEach((atividade) => {
      //               atividades.push(atividade)
      //               this.$forceUpdate()
      //             })
      //           }
      //         })
      //       }
      //     })
      //   }
      //   return atividades
      // }
    },
    destroyed () {
      Echo.leave(`Edita.Proposta.${this.proposta.id}`)
    },
    async created () {
      if (!this.verificaSessao) {
        this.loading.show = true
        // Cria o id da aba para analisar snapshot
        if (!sessionStorage.getItem('tabId')) {
          const tabId = Date.now().toString() + Math.random().toString(36).substr(2)
          sessionStorage.setItem('tabId', tabId)
        }
        if (this.$route.params.processo === 'ANALISE' || this.$route.params.processo === 'DEFERIMENTO' || this.$route.params.processo === 'REVISAO' || this.$route.params.processo === 'FORMALIZACAO' || this.$route.params.processo === 'APROVACAO_PROJETO') {
          this.esconder = false
        }
        this.titulo = 'SGP' + (_.has(this.$route.params, 'processo') && _.has(this.titulosAba, this.$route.params.processo) ? ' - ' + _.get(this.titulosAba, this.$route.params.processo) : '')
        if (this.$router.currentRoute.name === 'proposta-visualiza') {
          this.esconder = true
        }
        this.$snotify.async('Buscando dados da proposta. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.post('processos/historico/', {'id_proposta': this.$route.params.id, 'tipo': 'USUARIO'}).then((response) => {
          let analise = _.last(_.sortBy(_.filter(response.data, function (t) {
            return t.nome === 'ANALISE'
          }), ['id']))
          if (analise.termino) {
            this.analiseData = analise.termino
          }
          this.analiseUsuario = analise.usuario ? analise.usuario.ds_nome_usuario : null
          this.proposta.periodo_vigencia = (!_.has(this.proposta, 'periodo_vigencia') || _.isNull(this.proposta.periodo_vigencia) || _.isUndefined(this.proposta.periodo_vigencia)) ? parseInt(this.proposta.nr_periodos) + 12 : this.proposta.periodo_vigencia
          this.$forceUpdate()
        })
        await this.buscaProposta()
        this.entidadeEhFundacao = this.proposta.entidade.ds_cnpj === '01641000000133'
        // Limpa dados que afetam a decisão do usuário
        this.analise.proximaEtapa = null
        this.analise.resultadoAprovacao = null
        this.assinaCanalProposta()
      }
    },
    mounted () {
      this.buscaArvoreProjeto()
      if (!this.verificaSessao) {
        console.log('BUSCANDO ARVORE DE PROJETO')
        this.buscaArvoreProjeto()
        //
        let bc = new BroadcastChannel('proposta-' + this.$route.params.id)
        let vm = this
        bc.onmessage = function (e) {
          let mensagem = e.data
          if (('' + mensagem.id) === ('' + vm.$route.params.id)) {
            if (mensagem.acao === 'salvarProposta') {
              vm.salvar()
            } else if (mensagem.acao === 'set') {
              _.set(vm, ('' + mensagem.objeto), mensagem.valor)
              vm.$forceUpdate()
            }
          } else {
          }
        }
      }
    },
    methods: {
      async sessaoVerificada (edicaoAtiva) {
        // Todas as rotinas de carregamento da sessao
        // Mostra os componentes da proposta
        this.carregaProposta = true
        this.travaSessao = !edicaoAtiva
        console.log('travasessao', this.travaSessao)
        // Carrega as funçoes que estão no created e no mounted
        this.initProposta()
      },
      async initProposta () {
        this.loading.show = true
        // Cria o id da aba para analisar snapshot
        if (!sessionStorage.getItem('tabId')) {
          const tabId = Date.now().toString() + Math.random().toString(36).substr(2)
          sessionStorage.setItem('tabId', tabId)
        }
        if (this.$route.params.processo === 'ANALISE' || this.$route.params.processo === 'DEFERIMENTO' || this.$route.params.processo === 'REVISAO' || this.$route.params.processo === 'FORMALIZACAO' || this.$route.params.processo === 'APROVACAO_PROJETO') {
          this.esconder = false
        }
        this.titulo = 'SGP' + (_.has(this.$route.params, 'processo') && _.has(this.titulosAba, this.$route.params.processo) ? ' - ' + _.get(this.titulosAba, this.$route.params.processo) : '')
        if (this.$router.currentRoute.name === 'proposta-visualiza') {
          this.esconder = true
        }
        this.$snotify.async('Buscando dados da proposta. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.post('processos/historico/', {'id_proposta': this.$route.params.id, 'tipo': 'USUARIO'}).then((response) => {
          let analise = _.last(_.sortBy(_.filter(response.data, function (t) {
            return t.nome === 'ANALISE'
          }), ['id']))
          if (analise.termino) {
            this.analiseData = analise.termino
          }
          this.analiseUsuario = analise.usuario ? analise.usuario.ds_nome_usuario : null
          this.proposta.periodo_vigencia = (!_.has(this.proposta, 'periodo_vigencia') || _.isNull(this.proposta.periodo_vigencia) || _.isUndefined(this.proposta.periodo_vigencia)) ? parseInt(this.proposta.nr_periodos) + 12 : this.proposta.periodo_vigencia
          this.$forceUpdate()
        })
        await this.buscaProposta()
        this.entidadeEhFundacao = this.proposta.entidade.ds_cnpj === '01641000000133'
        // Limpa dados que afetam a decisão do usuário
        this.analise.proximaEtapa = null
        this.analise.resultadoAprovacao = null
        this.assinaCanalProposta()
        // this.buscaArvoreProjeto()
        //
        let bc = new BroadcastChannel('proposta-' + this.$route.params.id)
        let vm = this
        bc.onmessage = function (e) {
          let mensagem = e.data
          if (('' + mensagem.id) === ('' + vm.$route.params.id)) {
            if (mensagem.acao === 'salvarProposta') {
              vm.salvar()
            } else if (mensagem.acao === 'set') {
              _.set(vm, ('' + mensagem.objeto), mensagem.valor)
              vm.$forceUpdate()
            }
          } else {
          }
        }
      },
      dataHoraTerminoEdital () {
        this.proposta.edital.dt_data_final = moment(this.proposta.edital.dt_data_final).format('YYYY-MM-DDTHH:mm:ss')
        this.dataHoraEncerramentoEdital = new Date(this.proposta.edital.dt_data_final).toISOString()
      },
      verificaUsuarioDirigente () {
        if (this.usuarioLogado.userType !== 'FUNDACAO' && !this.ehVisualizacao) {
          this.loading.poderes = true
          axiosLaravel.get('projeto/usuario/dirigente').then((response) => {
            if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
              if (!_.isNull(response.data.retorno)) {
                _.remove(this.poderes, 'PERMITE_CONCLUIR')
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
      // Demanda 66506 - Adiciona o campo da Conta de Adiantamento
      async buscaContaAdiantamento () {
        await axiosLaravel.get('conta-adiantamento/buscaConta', {params: {id: this.proposta.id}}).then((response) => {
          if (!_.includes(Object.keys(response.data), 'codigo')) {
            const dadosBancarios = response.data
            this.proposta.ds_agencia_adiantamento = dadosBancarios.agencia
            this.proposta.ds_conta_adiantamento = dadosBancarios.conta
            this.proposta.mci = dadosBancarios.mci
          }
        })
      },

      verificaObsDuplicada () {
        // Se houver observacoes duplicadas, retorna os duplicados
        // Se não, retorna false
        let observacoes = []
        _.map(this.proposta.atividades, atividade => _.map(atividade.itens_orcamentos, item => observacoes.push(item.observacao.trim())))
        let duplicadas = Object.entries(_.countBy(observacoes)).reduce((acc, [key, val]) => val > 1 ? acc.concat(key) : acc, [])
        return duplicadas.length > 0 ? duplicadas : false
      },
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
      confirmaConclusao () {
        // 71539 - Confirmacao de conclusao de envio para entidade
        if (this.usuarioLogado.userType !== 'FUNDACAO') {
          this.$dialog.confirm(`Você está enviando a sua proposta para <b>Fundação BB.</b> Caso deseje apenas salvar para preenchimento posterior, clique em <b>Salvar</b>. Confirma envio pelo <b>Representante Legal</b> da Entidade? `, {html: true, animation: 'fade'})
          .then(dialog => { this.permiteConcluir() }).catch(() => {
            this.$snotify.warning('Operação não realizada.')
          })
        } else {
          this.permiteConcluir()
        }
      },
      confirmaSalvamento () {
        // 66108 - Confirmacao de salvamento de proposta
        if (this.usuarioLogado.userType !== 'FUNDACAO') {
          this.$dialog.confirm(`Você está salvando os dados para preenchimento posterior. Para enviar a proposta para <b>Fundação BB</b>, clique em <b>Concluir</b>. Confirma salvamento?`, {html: true, animation: 'fade'})
          .then(dialog => { this.salvar() }).catch(() => {
            this.$snotify.warning('Operação não realizada.')
          })
        } else {
          this.salvar()
        }
      },
      permiteConcluir () {
        if (this.proposta.ds_fase === 'ANALISE') {
          // Verifica se existem municipios repetidos
          if (this.$refs.municipalizacao.existeMunicipioRepetido.length > 0) {
            this.$snotify.error('Existem municípios cadastrados em duplicidade, regularize antes de continuar.')
            return
          }
          // Verifica se existem itens adiantaveis sem parcela de adiantamento cadastrada
          if (this.possuiAdiandamento && this.proposta.adiantamentos.length <= 0) {
            this.$snotify.error('Existem itens adiantáveis sem parcela de adiantamento cadastrada. Favor verificar.')
            return
          }
        }
        // Verifica se Entidade cadastrou Testemunhas
        if ((this.proposta.ds_fase === 'CADASTRO') || (this.proposta.ds_fase === 'REVISAO')) {
          if (this.$refs.testemunhas.verificaTestemunhasCadastradas() === false) {
            return
          }
        }
        if ((this.proposta.ds_fase === 'CADASTRO') || (this.proposta.ds_fase === 'REVISAO')) {
          if (this.$refs.agenciaIndicativa.verificaSelecaoAgencia() === false) {
            return
          }
        }
        // Verifica se para próxima etapa da Análise (deferimento) os itens de orçamento foram validados
        if (this.proposta.resultadoAprovacao === 'ENCAMINHAR_DEFERIMENTO' && this.ehExcecao === true) {
          if (this.$refs.cronogramaCotacao.verificaPendentesDeValidacao() === false) {
            this.$snotify.error('Itens de orçamento pendentes de validação.')
            return
          }
        }
        // 68615 - Verificacoes adicionais em conta de adiantamento
        if (this.usuarioLogado.userType === 'FUNDACAO' &&
          (!_.isEmpty(this.restricoesAtivasEntidade) || !_.isEmpty(this.restricoesAtivasProjetosDaEntidade)) &&
          (_.includes(['ENCAMINHAR_DEFERIMENTO', 'INCLUIR_SAPIENS', 'APROVAR'], this.proposta.resultadoAprovacao))
        ) {
          this.$snotify.error('A Entidade possui restrições impeditivas')
          return
        }
        if (!this.verificaContaAdiamento() && this.proposta.ds_fase === 'FORMALIZACAO') {
          this.$snotify.error('Agência/Conta/MCI de adiantamento não preenchidos ou inválidos.')
          return
        }
        if ((this.proposta.ds_fase === 'CADASTRO') && !this.preencheuAbrangencia) {
          this.$snotify.error('Informar se o projeto é de Abrangência Nacional.')
          return
        }
        if ((this.$refs.tecnologiaSocial.possuiTecnologiaSocial === '') && (this.proposta.ds_fase === 'CADASTRO' || this.proposta.ds_fase === 'ANALISE')) {
          this.$snotify.error('Selecione se a proposta possui ou não Tecnologia Social Vinculada.')
          return
        }
        if (this.proposta.resultadoAprovacao !== 'VOLTAR_ANALISE' && this.proposta.resultadoAprovacao !== 'DEVOLVER_ENTIDADE' && this.restricaParaConcluir.length > 0 && _.filter(this.restricaParaConcluir, {'ativo': true}).length > 0) {
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
                this.concluir()
              }
            }
          }
        } else {
          this.concluir()
        }
      },
      async duplicador () { // Busca dados do projeto duplicador
        if (this.proposta.nr_projeto_duplicacao) {
          await axiosLaravel.get('projeto/sapiens/' + this.proposta.nr_projeto_duplicacao).then((response) => {
            this.proposta['duplicadorSapiens'] = response.data[0]
            this.carregarProjetoSuperior()
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        }
      },
      carregarProjetoSuperior () {
        this.projetoSuperior = 'Buscando...'
        axiosLaravel.get('projeto/sapiens/' + this.proposta.duplicadorSapiens.prjsup).then((response) => {
          this.proposta['superiorSapiens'] = response.data[0]
          this.projetoSuperior = this.proposta.superiorSapiens.numprj + ' - ' + this.proposta.superiorSapiens.nomprj
          this.proposta['ds_projeto_superior'] = this.projetoSuperior
        })
          .catch((error) => {
            this.projetoSuperior = ''
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      verificaNavegador () {
        console.log('Verifica Navegador...')
        const ua = navigator.userAgent
        let navegador = ''
        if (ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR')) {
          navegador = 'Chrome'
        } else if (ua.includes('Firefox')) {
          navegador = 'Firefox'
        } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
          navegador = 'Safari'
        } else if (ua.includes('Edg')) {
          navegador = 'Edge'
        } else if (ua.includes('OPR') || ua.includes('Opera')) {
          navegador = 'Opera'
        } else {
          navegador = 'Desconhecido'
        }
        return navegador
      },
      assinaCanalProposta () {
        console.log('Assinando canal de proposta', this.$route.params.id)
        Echo.join(`Edita.Proposta.${this.$route.params.id}`).listen('PropostaEvents', (e) => {
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
      carregaRating () {
        axiosLaravel.post('rating/carregar/', {'idProposta': this.proposta.id}).then(async (response) => {
          if (!_.isNil(response.data) && !_.isEmpty(response.data)) {
            _.set(this.proposta, 'rating', response.data)
          }
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      buscaFluxo () {
        //  Verificar no retorno se a atividade atual é referente a esta página se não então erro
        //  Carregar array de refs de elementos ou não (v-if)
        this.loading.show = true
        if (this.proposta.ds_fase === 'CADASTRO') {
          this.$route.params.processo = 'SOLICITACAO'
        }
        if (this.$router.currentRoute.name === 'proposta-visualiza') {
          this.$route.params.processo = this.proposta.ds_fase
        }
        if (!this.$route.params.processo || this.$route.params.processo === undefined) {
          this.$route.params.processo = this.proposta.ds_fase
          this.esconder = false
          this.$forceUpdate()
        }
        axiosLaravel.post('fluxo/', {'id_proposta': this.proposta.id, 'atividade': this.$route.params.processo}).then((response) => {
          this.$snotify.clear()
          this.fluxo = response.data
          this.elementos = this.fluxo.elementos
          this.loading.show = false
          // this.$snotify.success('Fluxo carregado com sucesso!', {timeout: 1000})
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      async buscaProposta () {
        this.loading.show = true
        await axiosLaravel.get('propostas/' + this.$route.params.id).then((response) => {
          this.$snotify.clear()
          this.proposta = response.data
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
          this.ehEdital = _.has(this.proposta, 'edital.id')
          console.log('edital', this.proposta.edital)
          this.editalAtivoVigente = this.ehEdital && !_.isEmpty(_.get(this.proposta, 'edital.dt_data_final', null)) && (new Date(_.get(this.proposta, 'edital.dt_data_final') + ' 00:00')).getTime() > this.hoje.getTime()
          if (this.proposta.edital !== null) {
            if (this.proposta.edital.dt_data_final !== null) {
              this.dataHoraTerminoEdital()
            }
          }
          // this.verificaUsuarioDirigente()
          this.carregaRating()
          this.buscaTodosEditais()
          // }
          this.buscaNumProjeto()
          this.buscaFluxo()
          this.buscaContaAdiantamento()
          this.buscaArquivosEsperados()
          this.verificaItensAdiantaveis()
          this.verificaExcecaoCotacaoAutomatica()
          this.$snotify.success('Proposta carregada com sucesso!', {timeout: 1000})
          this.$forceUpdate()
          if (this.proposta.ds_fase === 'REVISAO' && this.usuarioLogado.userType === 'FUNDACAO' && this.$router.currentRoute.name !== 'proposta-visualiza') {
            this.$swal({
              title: '<font color="red"><b>Atenção!</b></font>',
              html:
                '<div align="left" style="font-size: smaller"> A proposta ' + '<b>' + this.proposta.ds_nome + '</b>' + ', está ' + '<u>' + 'Em Revisão' + '</u>' + ' pela entidade ' + '<i>' + this.proposta.entidade.ds_nome + '</i>' + '</div>',
              showCloseButton: false,
              showCancelButton: false,
              cancelButtonText: 'OK',
              showLoaderOnConfirm: true,
              allowOutsideClick: false,
              focusConfirm: false
            })
          }
          console.log('editalAtivoNaoFinalizado', this.ehEditalAtivoNaoFinalizado(this.proposta))
          if ((this.ehEdital === true && this.ehEditalAtivoNaoFinalizado(this.proposta) === false) && this.proposta.ds_fase === 'CADASTRO' && this.usuarioLogado.userType === 'ENTIDADE') {
            console.log('bloqueia botões')
            this.bloqueiaBotoes = true
            // 74188 - Editar proposta pela Entidade em fase de Cadastro apos o termino do edital Mulheres Negras
            if (this.proposta.edital.id === 12) {
              this.bloqueiaBotoes = false
            }
          }
          // Busca dados do projeto duplicador
          this.duplicador()
          if (this.titulo === 'SGP') {
            this.titulo = 'SGP' + (_.has(this.proposta, 'ds_fase') && _.has(this.titulosAba, this.proposta.ds_fase) ? ' - ' + _.get(this.titulosAba, this.proposta.ds_fase) : '')
          }
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
        // if (this.proposta.processo) {
        //   this.proposta.processo.forEach((processo) => {
        //     processo.tarefas.forEach(tarefa => {
        //       if (tarefa.nome === 'REVISAO' && tarefa.termino === null) {
        //         this.mensagem = tarefa.observacao
        //         this.$forceUpdate()
        //       }
        //     })
        //   })
        // }
        await axiosLaravel.get('fep/consultaFepProposta/' + this.$route.params.id).then((response) => {
          this.proposta.fep = response.data
        })
      },
      async buscaArvoreProjeto () {
        await axiosLaravel.get('projetos-duplicacao').then((response) => {
          this.$store.commit('SET_PROJETOS_DUPLICACAO', response.data)
          this.arvoreProjetos = _.sortBy(this.$store.state.projetosDuplicacao, 'numprj').reverse()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
        // if (_.isEmpty(this.$store.state.projetosDuplicacao)) {
        //   console.log('STORE STATE')
        //   axiosLaravel.get('projetos-duplicacao').then((response) => {
        //     this.$store.commit('SET_PROJETOS_DUPLICACAO', response.data)
        //     this.arvoreProjetos = _.sortBy(this.$store.state.projetosDuplicacao, 'numprj').reverse()
        //   })
        //     .catch((error) => {
        //       this.$root.trataErro(error)
        //     })
        // } else {
        //   this.arvoreProjetos = _.sortBy(this.$store.state.projetosDuplicacao, 'numprj').reverse()
        // }
      },
      async buscaNumProjeto () {
        console.log('buscaNumProjeto')
        if (!this.proposta.ds_codigo_projeto_erp || this.proposta.ds_codigo_projeto_erp.length === 0) {
          console.log('Iniciando busca por número do projeto...')
          try {
            const url = `/propostas/consultaNumeroProjetoERP/${this.proposta.id}`
            const response = await axiosLaravel.post(url)
            console.log('Projeto encontrado com sucesso:', response.data)
            this.proposta.ds_codigo_projeto_erp = response.data
          } catch (error) {
            console.error('Erro ao buscar o número do projeto ERP:', error)
          }
        } else {
          console.log('Número do projeto já existe, busca não necessária.')
        }
      },
      verificaExcecaoCotacaoAutomatica () {
        console.log('Verificando excecao cotacao', this.$route.params.id)
        let obj = {
          idProposta: this.$route.params.id,
          idEdital: this.ehEdital ? this.proposta.edital.id : 0
        }
        axiosLaravel.post('/cotacao/verificaExcecao/', obj).then((response) => {
          console.log('excecao: ', response.data)
          this.ehExcecao = response.data
        })
          .catch((error) => {
            console.error(error)
          })
      },
      limpar () {
        this.proposta = Object.assign({}, {
          entidade: {
            ds_nome: ''
          },
          ds_projeto_duplicacao_descricao: ''})
      },
      irTopo () {
        this.$nextTick(() => {
          this.$refs['topo'].scrollIntoView()
        })
      },
      buscaArquivosEsperados () {
        if (!_.isEmpty(this.$store.state.configuracoes)) {
          this.proposta.tipoDocumentos = this.$store.state.configuracoes.configuracao_proposta.documentos_obrigatorios
          this.$forceUpdate()
        } else {
          axiosLaravel.get('configuracoes/').then((response) => {
            this.$store.commit('SET_CONFIGURACOES', response.data)
            this.proposta.tipoDocumentos = this.$store.state.configuracoes.configuracao_proposta.documentos_obrigatorios
            this.$forceUpdate()
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        }
      },
      salvar () {
        this.loading.show = true
        this.proposta.proximaEtapa = ''
        this.bloqueiaBotoes = true
        // if (_.includes(['CADASTRO', 'REVISAO'], this.proposta.ds_fase)) {
        //   if (this.$refs.licenciamentoAmbiental.salvarLicencas() === false) {
        //     // this.$snotify.error('Selecione se a proposta possui ou não licenciamento ambiental')
        //     this.loading.show = false
        //     this.bloqueiaBotoes = false
        //     return
        //   }
        // }
        this.proposta.proximaEtapa = 'SALVAR'
        if (_.includes(['ANALISE'], this.proposta.ds_fase)) {
          this.$refs.analise.salvarAvaliacao(true)
        }
        if (this.proposta.documentos) {
          if (_.isUndefined(this.proposta.documentos.proposta) || this.proposta.documentos.proposta.length <= 0) {
            this.proposta.documentos.proposta = []
            this.proposta.documentos.proposta = this.documentosProposta
          } else {
            this.documentosProposta = this.proposta.documentos.proposta
          }
        }
        // if (!_.isEmpty(this.deferimento)) {
        //   this.proposta = this.deferimento
        //   this.proposta.proximaEtapa = 'SALVAR'
        // }
        // if (!_.isEmpty(this.analise)) {
        //   this.proposta = this.analise
        //   this.proposta.proximaEtapa = 'SALVAR'
        // }
        // if (!_.isEmpty(this.aprovacao)) {
        //   this.proposta = this.aprovacao
        //   this.proposta.proximaEtapa = 'SALVAR'
        // }
        this.proposta.proximaEtapa = 'SALVAR'
        this.$snotify.async('Salvando proposta. Por favor, aguarde...', {timeout: 0})
        this.proposta.navegador = this.verificaNavegador()
        this.proposta.usuarioSalvamento = this.usuarioLogado.ds_login + ' ' + this.usuarioLogado.ds_nome_usuario
        this.proposta.tabId = sessionStorage.getItem('tabId') // Armazena o ID da aba para análise de snapshot
        let vm = this
        axiosLaravel.put('propostas/' + this.proposta.id, this.proposta).then((response) => {
          // Demanda 66506 - Adiciona o campo da Conta de Adiantamento
          axiosLaravel.post('conta-adiantamento/salvaConta', {
            id: this.proposta.id,
            banco: this.proposta.ds_agencia_banco,
            agencia: this.proposta.ds_agencia_adiantamento,
            conta: this.proposta.ds_conta_adiantamento,
            mci: this.proposta.mci,
            tipo: 1
          })
          this.$snotify.clear()
          this.bloqueiaBotoes = false
          this.$snotify.success('Proposta atualizada com sucesso')
          this.loading.show = false
          //
          let bc = new BroadcastChannel('propostas')
          bc.postMessage({acao: 'notificarSalvamento', id: vm.proposta.id})
        })
          .catch((error) => {
            this.loading.show = false
            this.bloqueiaBotoes = false
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
        // this.$refs.publicoAlvoDescricao.salvarSelecao()
        // this.$refs.tecnologiaSocial.salvarTecnologia()
      },
      async concluir () {
        let pulaVerificacao = false
        let faseBkp = this.proposta.ds_fase
        // if (_.includes(['CADASTRO', 'REVISAO'], this.proposta.ds_fase)) {
        //   if (this.$refs.licenciamentoAmbiental.salvarLicencas() === false) {
        //     // this.$snotify.error('Selecione se a proposta possui ou não licenciamento ambiental')
        //     return
        //   }
        // }
        if (_.includes(['ANALISE'], this.proposta.ds_fase)) {
          console.log('salvandopontuacao')
          if (this.$refs.analise.salvarAvaliacao() === false) {
            this.loading.show = false
            this.bloqueiaBotoes = false
            return
          }
        }
        // this.$refs.publicoAlvoDescricao.salvarSelecao()
        // this.$refs.tecnologiaSocial.salvarTecnologia()
        this.proposta.proximaEtapa = ''
        // Cadastro
        if (faseBkp === 'SOLICITACAO') {
          faseBkp = this.proposta.ds_fase
          this.proposta.proximaEtapa = 'ANALISE'
          this.proposta.ds_fase = 'ANALISE'
          this.verificaFilhos = false
          pulaVerificacao = false
        }
        if (faseBkp === 'CADASTRO') {
          faseBkp = this.proposta.ds_fase
          this.proposta.proximaEtapa = 'ANALISE'
          this.proposta.ds_fase = 'ANALISE'
          this.verificaFilhos = false
          pulaVerificacao = false
        }
        // Revisão Análise
        if (faseBkp === 'REVISAO') {
          faseBkp = this.proposta.ds_fase
          this.proposta.proximaEtapa = 'ANALISE'
          this.proposta.ds_fase = 'ANALISE'
          this.verificaFilhos === false
        }
        // ----------
        // Análise
        // ----------
        if (faseBkp === 'ANALISE') {
          this.verificaFilhos = true
          // this.proposta = this.analise
          if (this.proposta.resultadoAprovacao === 'ENCAMINHAR_DEFERIMENTO') {
            faseBkp = this.proposta.ds_fase
            this.proposta.proximaEtapa = 'DEFERIMENTO'
            this.proposta.ds_fase = 'DEFERIMENTO'
            if (_.isNull(this.proposta.fep) || !this.proposta.fep) {
              this.$snotify.error('É necessário gerar o Número da FEP antes de aprovar a Análise ')
              this.proposta.ds_fase = faseBkp
              return
            }
          }
          if (this.proposta.resultadoAprovacao === 'DEVOLVER_ENTIDADE') {
            faseBkp = this.proposta.ds_fase
            this.proposta.proximaEtapa = 'REVISAO'
            this.proposta.ds_fase = 'REVISAO'
            pulaVerificacao = true
          }
          if (this.proposta.resultadoAprovacao === 'INCLUIR_SAPIENS') {
            faseBkp = this.proposta.ds_fase
            this.proposta.proximaEtapa = 'INCLUIR_SAPIENS'
            this.proposta.ds_estado_proposta = 'ANA'
            this.proposta.ds_situacao_erp = 'ANA'
          }
          if (this.proposta.resultadoAprovacao === 'ANULAR_PROPOSTA') {
            faseBkp = this.proposta.ds_fase
            this.proposta.ds_fase = 'ANULADO'
            this.proposta.proximaEtapa = 'ANULACAO'
          }
        }
        // -----------
        // Deferimento
        // -----------
        if (faseBkp === 'DEFERIMENTO') {
          this.verificaFilhos = true
          // this.proposta = this.deferimento
          if (this.proposta.resultadoAprovacao === 'APROVAR') {
            faseBkp = this.proposta.ds_fase
            this.proposta.proximaEtapa = 'FORMALIZACAO'
            this.proposta.ds_fase = 'FORMALIZACAO'
            this.proposta.ds_estado_proposta = 'DEF'
            this.proposta.ds_situacao_erp = 'DEF'
          }
          if (this.proposta.resultadoAprovacao === 'INDEFERIR') {
            faseBkp = this.proposta.ds_fase
            this.proposta.proximaEtapa = 'INDEFERIR'
            this.proposta.ds_fase = 'INDEFERIDO'
          }
          if (this.proposta.resultadoAprovacao === 'VOLTAR_ANALISE') {
            pulaVerificacao = true
            this.verificaFilhos = false
            faseBkp = this.proposta.ds_fase
            this.proposta.proximaEtapa = 'ANALISE'
            this.proposta.ds_fase = 'ANALISE'
          }
        }
        // ------------
        // Formalização
        // ------------
        if (faseBkp === 'FORMALIZACAO') {
          // this.verificaFilhos = true
          // this.proposta = this.formalizacao
          if (this.proposta.resultadoAprovacao === 'APROVAR') {
            faseBkp = this.proposta.ds_fase
            this.proposta.proximaEtapa = 'APROVACAO_PROJETO'
            this.proposta.ds_fase = 'APROVACAO_PROJETO'
            this.proposta.ds_estado_proposta = 'APROVACAO_PROJETO'
          }
          if (this.proposta.resultadoAprovacao === 'VOLTAR_ANALISE') {
            pulaVerificacao = true
            this.verificaFilhos = false
            faseBkp = this.proposta.ds_fase
            this.proposta.proximaEtapa = 'ANALISE'
            this.proposta.ds_fase = 'ANALISE'
            this.proposta.ds_situacao_erp = 'ANA'
            this.proposta.ds_estado_proposta = 'ANA'
          }
        }
        // ------------
        // Aprovação
        // ------------
        if (faseBkp === 'APROVACAO_PROJETO') {
          this.verificaFilhos = true
          // this.proposta = this.aprovacao
          if (this.proposta.resultadoAprovacao === 'APROVAR') {
            faseBkp = this.proposta.ds_fase
            this.proposta.proximaEtapa = 'CONCLUSAO'
            this.proposta.ds_fase = 'APROVADO'
            // Atualiza a situação do projeto no Sapiens
            this.proposta.ds_situacao_erp = 'APR'
            this.proposta.ds_estado_proposta = 'APR'
          }
          if (this.proposta.resultadoAprovacao === 'VOLTAR_ANALISE') {
            this.proposta.proximaEtapa = 'ANALISE'
            this.proposta.ds_fase = 'ANALISE'
            // Atualiza a situação do projeto no Sapiens
            this.proposta.ds_situacao_erp = 'ANA'
            this.proposta.ds_estado_proposta = 'ANA'
          }
          if (this.proposta.resultadoAprovacao === 'VOLTAR_FORMALIZACAO') {
            this.proposta.proximaEtapa = 'FORMALIZACAO'
            this.proposta.ds_fase = 'FORMALIZACAO'
          }
        }
        // Aprovação
        // if (!_.isEmpty(this.aprovacao)) {
        //   this.verificaFilhos = true
        //   this.proposta = this.aprovacao
        //   if (this.aprovacao.resultadoAprovacao === 'ENVIAR_REVISAO') {
        //     faseBkp = this.proposta.ds_fase
        //     this.proposta.proximaEtapa = 'REVISAO'
        //   }
        //   if (this.aprovacao.resultadoAprovacao === 'ENVIAR_CONVENIO') {
        //     this.proposta.proximaEtapa = 'ENVIAR_CONVENIO'
        //   }
        //   if (this.aprovacao.resultadoAprovacao === 'APROVAR') {
        //     faseBkp = this.proposta.ds_fase
        //     this.proposta.proximaEtapa = 'CONCLUSAO'
        //     this.proposta.ds_fase = 'APROVADO'
        //   }
        //   if (this.aprovacao.resultadoAprovacao === 'REPROVAR') {
        //     faseBkp = this.proposta.ds_fase
        //     this.proposta.proximaEtapa = 'CANCELA'
        //     this.proposta.ds_fase = 'CANCELADO'
        //   }
        // }
        //
        // Não obriga preenchimento em casos de devolução, somente para aprovar
        //
        if (this.proposta.resultadoAprovacao === 'APROVAR' && this.proposta.ds_fase === 'ANALISE') {
          pulaVerificacao = false
        }
        if (this.proposta.resultadoAprovacao === 'APROVAR' && this.proposta.ds_fase === 'DEFERIMENTO') {
          pulaVerificacao = true
        }
        if (this.proposta.resultadoAprovacao === 'ENCAMINHAR_DEFERIMENTO') {
          pulaVerificacao = false
        }
        if (this.proposta.resultadoAprovacao === 'ENVIAR_REVISAO') {
          pulaVerificacao = true
        }
        if (this.proposta.resultadoAprovacao === 'REPROVAR') {
          pulaVerificacao = true
        }
        if (this.proposta.resultadoAprovacao === 'DEVOLVER_ENTIDADE') {
          pulaVerificacao = true
        }
        if (this.proposta.resultadoAprovacao === 'INCLUIR_SAPIENS') {
          pulaVerificacao = true
        }
        if (this.proposta.resultadoAprovacao === 'ENVIAR_PENDENCIAS') {
          pulaVerificacao = true
        }
        if (this.proposta.resultadoAprovacao === 'ANULAR_PROPOSTA') {
          pulaVerificacao = true
        }
        //
        // verifica as metas não tem atividades vinculadas
        //
        const metas = _.map(this.proposta.metas, 'ds_descricao')
        let metasAtv = []
        if (!_.isUndefined(this.proposta.atividades)) {
          for (let i = 0; i < this.proposta.atividades.length; i++) {
            if (this.proposta.atividades[i].metas) {
              for (let j = 0; j < this.proposta.atividades[i].metas.length; j++) {
                metasAtv.push(this.proposta.atividades[i].metas[j])
              }
            }
          }
        }
        this.array = _.chain(metasAtv).map('ds_descricao').uniq().value()
        let dif = _.differenceWith(metas, this.array, _.isEqual)
        if (!_.isEmpty(dif)) {
          this.show()
        }
        this.atvSemMetas = dif
        this.$emit('dif', dif)
        // for (let x = 0; x < dif.length; x++) {
        //   this.$nextTick(() => {
        //     this.$refs['tabelaMetas'].scrollIntoView()
        //   })
        //   // let textFormatado = dif.join(',')
        //   // let textFormatadoFinal = textFormatado.split(',').join('\n').split('\n')
        //   this.$snotify.error('A proposta possui ' + this.atvSemMetas.length + ' meta(s) não vinculada(s) a uma atividade!')
        //   this.proposta.ds_fase = faseBkp
        //   return
        // }
        //
        if (pulaVerificacao === false) {
          console.log('VERIFICACAO')
          if (this.verificaFilhos === true && faseBkp !== 'CADASTRO' && faseBkp !== 'ANALISE') {
            await this.$refs.child.$validator.validateAll().then((result) => {
              if (result === false) {
                this.camposOK = false
                this.proposta.ds_fase = faseBkp
                this.$forceUpdate()
              } else {
                this.camposOK = true
                this.$forceUpdate()
              }
            })
          } else if (faseBkp === 'ANALISE') {
            await this.$refs.analise.$validator.validateAll().then((result) => {
              if (result === false) {
                this.camposOK = false
                this.proposta.ds_fase = faseBkp
                this.$forceUpdate()
              } else {
                this.camposOK = true
                this.$forceUpdate()
              }
            })
          } else {
            await this.$validator.validateAll().then((result) => {
              if (result === false) {
                this.camposOK = false
                this.proposta.ds_fase = faseBkp
                this.$forceUpdate()
              } else {
                this.camposOK = true
                this.$forceUpdate()
              }
            })
          }
        }
        this.$forceUpdate()
        if (pulaVerificacao === false) {
          if (this.camposOK === true) {
            if (_.isEmpty(this.proposta.publicos_alvo)) {
              this.$snotify.error('É necessário preencher o Publico-alvo!')
              this.proposta.ds_fase = faseBkp
              return
            }
            if (faseBkp === 'ANALISE' && this.proposta.atividades) {
              let verificaContas = 0
              if (this.proposta.atividades.length > 0) {
                this.proposta.atividades.forEach((atividade) => {
                  if (_.has(atividade, 'itens_orcamento') && atividade.itens_orcamentos.length > 0) {
                    atividade.itens_orcamentos.forEach(item => {
                      if (!item.conta_financeira) {
                        verificaContas = verificaContas + 1
                      }
                    })
                  }
                })
              }
              if (verificaContas > 0) {
                this.$snotify.error('É necessário preencher as contas financeiras no cronograma!')
                this.proposta.ds_fase = faseBkp
                return
              }
            }
            // if (faseBkp === 'ANALISE' && _.isEmpty(this.proposta.relatorio_analise)) {
            //   this.$snotify.error('O Relatório da Análise não foi preenchido!')
            //   this.proposta.ds_fase = faseBkp
            //   return
            // }
            if (!this.entidadeEhFundacao && _.isEmpty(this.proposta.equipes)) {
              this.$snotify.error('É necessário preencher a Equipe do projeto!')
              this.proposta.ds_fase = faseBkp
              return
            }
            if (_.isEmpty(this.proposta.objetivos)) {
              this.$snotify.error('É necessário preencher o(s) Objetivo(s) do Projeto!')
              this.proposta.ds_fase = faseBkp
              return
            }
            if (_.isEmpty(this.proposta.metas)) {
              this.$snotify.error('É necessário preencher a(s) Meta(s) do Projeto!')
              this.proposta.ds_fase = faseBkp
              return
            }
            if (_.isEmpty(this.proposta.atividades)) {
              this.$snotify.error('É necessário preencher a(s) Atividade(s) do Projeto!')
              this.proposta.ds_fase = faseBkp
              return
            }
            if (!_.isEmpty(this.proposta.atividades)) {
              let atividadesSemItens = _.sumBy(this.proposta.atividades, function (atv) {
                return !_.has(atv, 'itens_orcamentos') || atv.itens_orcamentos.length === 0 ? 1 : 0
              })
              if (this.proposta.atividades.length === atividadesSemItens) {
                this.$snotify.error('É necessário preencher o(s) Item(s) do Cronograma!')
                this.proposta.ds_fase = faseBkp
                return
              }
              if (this.verificaObsDuplicada()) {
                let duplicadas = this.verificaObsDuplicada()
                let listaDuplicadas = ''
                duplicadas.forEach(d => {
                  listaDuplicadas += d
                  if (d !== duplicadas.at(-1)) {
                    listaDuplicadas += ' / '
                  }
                })
                this.$snotify.error('Existem descrições de itens do cronograma em duplicidade: ' + listaDuplicadas)
                this.proposta.ds_fase = faseBkp
                return
              }
            }
            if (this.$route.params.processo === 'ANALISE' || this.$route.params.processo === 'DEFERIMENTO' || this.$route.params.processo === 'SOLICITACAO' || this.$route.params.processo === 'CADASTRO') {
              if (_.isEmpty(this.proposta.municipalizacao)) {
                this.$snotify.error('É necessário preencher o(s) Municípios(s) Atendido(s) do Projeto!')
                this.proposta.ds_fase = faseBkp
                return
              }
              if (this.totalParticipantesMunicipios !== this.totalParticipantes) {
                this.$snotify.error('A quantidade de participantes gerais não bate com o total de participantes nos municípios')
                this.proposta.ds_fase = faseBkp
                return
              }
            }
            // Verifica os documentos obrigatórios se foram preenchidos
            if ((this.proposta.ds_fase === 'CADASTRO' || this.proposta.ds_fase === 'SOLICITACAO') && (_.isEmpty(this.proposta.documentos.proposta) || this.proposta.documentos.proposta.length === 0)) {
              this.$snotify.error('É necessário anexar o(s) Documento(s) Obrigatório(s)!')
              this.proposta.ds_fase = faseBkp
              return
            } else if ((this.proposta.ds_fase === 'CADASTRO' || this.proposta.ds_fase === 'SOLICITACAO') && (this.proposta.documentos.proposta.length < this.proposta.tipoDocumentos.length)) {
              this.$snotify.error('É necessário anexar todo(s) o(s) Documento(s) Obrigatório(s)!')
              this.proposta.ds_fase = faseBkp
              return
            }
          }
        }
        if (faseBkp === 'DEFERIMENTO' && this.proposta.resultadoAprovacao !== 'VOLTAR_ANALISE') {
          if (!this.proposta.documentos.deferimento) {
            this.$snotify.error('É necessário anexar o(s) documento(s) de Deferimento.')
            this.proposta.ds_fase = faseBkp
            return
          } else {
            if (this.proposta.documentos.deferimento) {
              if (this.proposta.documentos.deferimento.length === 0) {
                this.$snotify.error('É necessário anexar o(s) documento(s) de Deferimento.')
                this.proposta.ds_fase = faseBkp
                return
              }
            }
          }
        }
        if (faseBkp === 'FORMALIZACAO' && this.proposta.resultadoAprovacao !== 'VOLTAR_ANALISE') {
          if (!this.proposta.documentos.formalizacao) {
            this.$snotify.error('É necessário anexar o(s) documento(s) de Formalização.')
            this.proposta.ds_fase = faseBkp
            return
          } else {
            if (this.proposta.documentos.formalizacao) {
              if (this.proposta.documentos.formalizacao.length === 0) {
                this.$snotify.error('É necessário anexar o(s) documento(s) de Formalização.')
                this.proposta.ds_fase = faseBkp
                return
              }
            }
          }
        }
        if (this.analise.proximaEtapa === 'INCLUIR_SAPIENS') {
          if (!this.proposta.ds_fase === 'ANALISE') {
            await this.$refs.child.$validator.validateAll().then((result) => {
              if (result === false) {
                this.camposOK = false
                pulaVerificacao = false
                this.proposta.ds_fase = faseBkp
                this.$forceUpdate()
              } else {
                this.camposOK = true
                this.$forceUpdate()
              }
            })
          } else {
            await this.$refs.analise.$validator.validateAll().then((result) => {
              if (result === false) {
                this.camposOK = false
                pulaVerificacao = false
                this.proposta.ds_fase = faseBkp
                this.$forceUpdate()
              } else {
                this.camposOK = true
                this.$forceUpdate()
              }
            })
          }
        }
        if (this.camposOK === true || pulaVerificacao === true) {
          this.bloqueiaBotoes = true
          // this.proposta.dt_data_vigencia = moment(this.proposta.dt_data_vigencia).format('LLLL')
          this.$snotify.async('Validando a proposta. Por favor, aguarde...', {timeout: 0})
          axiosLaravel.put('propostas/' + this.proposta.id, this.proposta).then((response) => {
            axiosLaravel.post('conta-adiantamento/salvaConta', {
              id: this.proposta.id,
              banco: this.proposta.ds_agencia_banco,
              agencia: this.proposta.ds_agencia_adiantamento,
              conta: this.proposta.ds_conta_adiantamento,
              mci: this.proposta.mci,
              tipo: 1
            })
            this.$snotify.clear()
            this.$snotify.success('Proposta atualizada com sucesso')
            this.bloqueiaBotoes = false
            this.finalizou = true
            setTimeout(() => {
              this.$router.go(-1)
            }, 2000)
          })
            .catch((error) => {
              this.bloqueiaBotoes = false
              this.proposta.ds_fase = faseBkp
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        } else {
          this.proposta.ds_fase = faseBkp
          this.$snotify.error('Existem campos obrigatórios que não foram preenchidos. Favor verificar')
          this.bloqueiaBotoes = false
        }
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
      editaEdital () {
        this.proposta.fk_edital = this.editalSelecionado
        this.$snotify.success('Edital selecionado com sucesso. Não esqueça de Salvar a Proposta.')
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
      verificaAbrangenciaNacional () {
        // Quando for Abrangência Nacional, busca dados do município com base no endereço principal da entidade - Suporte 60023
        if ((this.proposta.ds_fase === 'CADASTRO') && (this.proposta.bt_fep_abrangencia === 1 || this.proposta.bt_fep_abrangencia === '1')) {
          this.preencheuAbrangencia = true
          if (this.proposta.entidade.endereco) {
            let enderecoEntidade = this.proposta.entidade.endereco
            if (enderecoEntidade.length > 1) {
              // Busca o endereço que esta marcado como principal
              let entidadeFiltro = _.filter(enderecoEntidade, {'bt_principal': 1}).first()
              this.enderecoEntidadePrincipal = entidadeFiltro[0]
            } else {
              this.enderecoEntidadePrincipal = this.proposta.entidade.endereco[0]
            }
            // Busca total de participantes
            if ((this.proposta.publicos_alvo) && !_.isNull(this.proposta.publicos_alvo)) {
              let publicos = this.proposta.publicos_alvo
              this.MunTotalParticipantes = _.sumBy(publicos, function (p) {
                return parseInt(p.nr_participantes_diretos)
              })
            }
            //
            this.buscaCidadeMun()
          }
        } else if ((this.proposta.ds_fase === 'CADASTRO') && (this.proposta.bt_fep_abrangencia === 0 || this.proposta.bt_fep_abrangencia === '0')) {
          this.preencheuAbrangencia = true
        }
      },
      buscaTodosEditais () {
        this.loading.tela = true
        axiosLaravel.get('edital/').then((response) => {
          this.listaEditais = response.data
          console.log('editais:', this.listaEditais)
          //
          if (this.listaEditais.length === 0) {        // Não tem edital para o parâmetro informado (vazio)
            alert('Não localizamos um edital ativo e vigente para o link informado. Entre em contato com a FBB!')
          }
          // Verifica se o edital está travado para edição
          this.verificaTravaEdital()
          this.loading.tela = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.loading.tela = false
            this.$root.trataErro(error)
          })
      },
      verificaTravaEdital () {
        console.log('VERIFICA EDITAL', this.proposta.fk_edital)
        if (this.proposta.fk_edital === null || this.proposta.fk_edital === undefined) {
          return
        }
        if (this.proposta.fk_edital !== null && this.proposta.fk_edital !== undefined) {
          let edital = _.find(this.listaEditais, {'id': this.proposta.fk_edital})
          if (edital) {
            if (edital.edicao === 'N' && this.usuarioLogado.userType === 'ENTIDADE' && (this.proposta.ds_fase === 'CADASTRO' || this.proposta.ds_fase === 'ANALISE')) {
              this.travarEdicao = true
              this.$dialog.alert('<font color="red"><b>Atenção!</b></font><div align="left" style="font-size: smaller">Edição de proposta desabilitada pelo fim do prazo do Edital.</div>', {html: true, animation: 'fade', customClass: 'avisoAlerta'}).then(function (dialog) {
              })
              return
            }
          }
        }
        this.travarEdicao = false
      },
      buscaCidadeMun () {
        axiosLaravel.get('municipios/cep/' + this.enderecoEntidadePrincipal.ds_cep).then((response) => {
          let retorno = response.data
          this.proposta.municipalizacao = []
          this.proposta.municipalizacao.push({
            ds_cep: this.enderecoEntidadePrincipal.ds_cep,
            ds_municipio: retorno.ds_nome,
            ds_uf: retorno.ds_uf,
            nr_total_participantes: this.MunTotalParticipantes
          })
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      // 65071 - Implementar cancelamento de proposta nas fases de [Análise] e [Cadastro]
      cancelarProposta () {
        this.$dialog.confirm(`Confirma a Exclusão da proposta - <strong> ${this.proposta.ds_nome} </strong> ? (Esta operação não poderá ser desfeita)`, {html: true, animation: 'fade', customClass: 'avisoAlerta'})
        .then(dialog => {
          axiosLaravel.post('propostas/cancela-proposta/' + this.proposta.id, {'id_proposta': this.proposta.id, 'fk_processo': this.proposta.fk_processo, 'fk_entidade': this.proposta.fk_entidade, 'fk_usuario': this.usuarioLogado.id}).then((response) => {
            console.log(response.data)
            this.$snotify.success('Proposta cancelada com sucesso.')
            // Aguarda alguns segundos e redireciona para página de listagem de propostas
            return new Promise(resolve => setTimeout(resolve, 3000)).then(() => {
              this.$router.push('/proposta/lista')
            })
          })
          .catch((error) => {
            this.$snotify.clear()
            this.$snotify.error('Erro na requisição da operação.')
            this.$root.trataErro(error)
          })
        }).catch(() => {
          this.$snotify.warning('Operação não realizada.')
        })
      },
      // 68615 - Verificacoes adicionais em conta de adiantamento
      verificaItensAdiantaveis () {
        // Verifica se a proposta possui itens adiantaveis
        console.log('VERIFICA ITENS ADIANTAVEIS', this.proposta.atividades)
        const atividades = this.proposta.atividades
        const existeAdiantavel = atividades.some((atividade) => {
          return atividade.itens_orcamentos.some((item) => {
            return item.adiantavel === '1'
          })
        })
        console.log('Existe item adiantavel? ', existeAdiantavel)
        if (existeAdiantavel) {
          this.possuiItensAdiantaveis = existeAdiantavel
        }
        // console.log('AGENCIA ADIANTAMENTO: ', this.proposta.ds_agencia_adiantamento)
        // console.log('CONTA ADIANTAMENTO: ', this.proposta.ds_conta_adiantamento)
      },
      verificaContaAdiamento () {
        // se a fase for formalização, verifica se a conta de adiantamento está preenchida caso possua itens adiantaveis cadastrados
        if (!this.possuiItensAdiantaveis) {
          return true
        }
        if (typeof this.proposta.ds_agencia_adiantamento === 'undefined' || this.proposta.ds_agencia_adiantamento === '' || typeof this.proposta.ds_conta_adiantamento === 'undefined' || this.proposta.ds_conta_adiantamento === '' || typeof this.proposta.mci === 'undefined' || this.proposta.mci === '') {
          // As variáveis são undefined ou vazias
          console.log('As variáveis são undefined ou vazias')
          return false
        } else {
          // As variáveis têm algum valor definido
          console.log('As variáveis têm algum valor definido')
          return true
        }
      },
      verificaSeExisteRestricoesAtivas () {
        if (this.proposta.entidade.id === 1439) {
          return false
        }
        axiosLaravel.post('consulta/ocorrencias/entidade/', { 'id_entidade': this.proposta.entidade.id, 'tipo': 4, 'situacao_ocorrencia': 'vigentes' }).then((response) => {
          this.restricoesAtivasEntidade = response.data
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
        axiosLaravel.post('consulta/ocorrencias/projeto/', { 'id_entidade': this.proposta.entidade.id, 'tipo': 3, 'situacao_ocorrencia': 'vigentes' }).then((response) => {
          this.restricoesAtivasProjetosDaEntidade = response.data
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      ehEditalAtivoNaoFinalizado (proposta) {
        let dataTerminoEdital = _.get(proposta, 'edital.dt_data_final')
        let ldsTerminoEdital = new Date(dataTerminoEdital + ' 00:00:00').toLocaleDateString('en-US', {timeZone: 'America/Sao_Paulo'})
        let ldsHojeBrasilia = new Date().toLocaleDateString('en-US', {timeZone: 'America/Sao_Paulo'})
        return dataTerminoEdital && (new Date(ldsHojeBrasilia).getTime() < new Date(ldsTerminoEdital).getTime())
      },
      async setPropostaSimplificada (risco) {
        // Verifica se a proposta está em fase de cadastro
        if (this.proposta.ds_fase === 'CADASTRO') {
          return
        }
        // Seta os valores padrão de proposta simplificada aqui
        console.log('SET RISCO CALCULADO ', risco)
        this.proposta.ds_risco_calculado = risco
        this.proposta.ds_periodicidade_formulario = 'QUADRIMESTRAL'
        if (typeof this.proposta.questionario_respostas === 'undefined') {
          this.proposta.questionario_respostas = {}
        }
        // Seta rating para C
        this.proposta.questionario_respostas.rating = {}
        this.proposta.questionario_respostas.rating.fk_questao_codigo = '8'
        this.proposta.questionario_respostas.rating.ds_codigo = '3'
        this.proposta.questionario_respostas.rating.ds_descricao = 'C'
        this.proposta.questionario_respostas.rating.dc_nota_resposta = '180'
        this.proposta.questionario_respostas.rating.ds_id = '83'
        console.log('RISCO QUESTIONARIO', this.proposta.questionario_respostas)
        // Grava na base de dados
        let obj = {
          fk_proposta: this.$route.params.id,
          // TODO - Colocar valor total de investimento FBB aqui
          valor_fbb: 0
        }
        await axiosLaravel.post('simplificado/gravarSimplificada/', obj).then((response) => {
          console.log(response.data)
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
        this.$forceUpdate()
      }
    }
  }
</script>

<style>
  .avisoConfirmacao {
    color: darkgreen;
    font-size: 18px;
  }
  .avisoAlerta {
    color: darkred;
    font-size: 18px;
    padding: 20px;
  }
  .avisoAlerta .dg-content-cont {
    top: 50%;
  }
  .avisoAlerta .dg-main-content {
    max-width: 50%;
  }
  .avisoInfo {
    font-size: 18px;
  }
  .avisoConfirmacao li, .avisoAlerta li, .avisoInfo li {
    padding-bottom: 20px;
  }
  .botao-editar-edital {
    padding-bottom: 20px;
}

</style>

<style scoped>
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

  .entidadeEhFundacao {
    color: var(--cor-azul);
    margin: 0 0 30px 0;
  }
  .edital-cadastrado {
  width: 100%;
  padding: 30px;
  background-color: #FFFDD6;
}
.gerenciador-edicao-container {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  margin-top: 130px;
  margin-bottom: -145px;
}
.parcela-erro {
    width: 100%;
    min-height: 30px;
    background-color:#FF9900;
    color: #FFFFFF;
    border-radius: 5px;
    box-sizing: border-box;
    padding: 20px;
    font-weight: 700;
    margin-bottom: 10px;
    gap: 10px;
    border: 1px solid #DDDDDD;
    animation: fade 0.5s ease;
  }

  .navegador-proposta-container {
    box-sizing: border-box;
    margin-left: 20px;
    /* margin-right: 10px; */
  }

  .h1-container {
    gap: 5px;
  }

  .trava-sessao-container {
      margin: 5px 0px;
      width: 100%;
      border: 1px solid rgba(198, 188, 188, 0.5);
      background-color: #ffe551;
      color: #303030;
      border-radius: 8px !important;
      box-sizing: border-box;
      gap: 5px;
      padding: 5px;
      z-index: 9999999;
  }

</style>
