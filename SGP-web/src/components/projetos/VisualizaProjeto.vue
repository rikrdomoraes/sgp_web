<template>
  <div class="content-wrapper" style="min-height: 870px;">
    <div class="fade-transition ng-scope" style=""><!-- content header (page header) -->
      <section class="content-header ng-scope">
        <h1>Projetos</h1>
        <b-breadcrumb :items="[{
            text: 'Inicial',
            href: '/'
            }, {
            text: 'Projetos',
            href: '#'
            }]"/>
      </section>

      <!-- main content -->
      <section class="content">

        <div class="row">
          <div class="col-md-12">
            <div class="ng-scope ng-isolate-scope">
              <div class="box box-primary">
                <div class="box-header with-border">
                  <h3 class="box-title cursor_pointer" @click="mostrarCabecalhoProjeto = !mostrarCabecalhoProjeto"><i :class="'fa fa-caret-' + (mostrarCabecalhoProjeto ? 'right' : 'down')" aria-hidden="true"></i> Projeto <span v-show="!mostrarCabecalhoProjeto">{{projeto.proposal.idProjectErp}} - {{projeto.proposal.name}}</span></h3>
                </div>
                <div class="box-body">
                  <div v-show="loading.show" class="overlay"
                       style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                    <i class="fa fa-refresh fa-spin"></i>
                  </div>
                  <div class="form-horizontal">
                    <!--Proposta-->
                    <div v-show="mostrarCabecalhoProjeto" class="col-md-12">
                      <div class="box box-widget">
                        <div class="box-body">
                          <div class="row">

                            <!-- Dados do Projeto -->
                            <div class="col-md-4">
                              <fieldset :disabled="this.$router.currentRoute.name === 'visualiza-projeto'">
                                <legend>Projeto</legend>

                                <div class="form-group col-md-12">
                                  <label class="">Número do projeto </label>
                                  <div name="idProjectErp" approval="regComProFormCtrl.approval"
                                       state="regComProFormCtrl.approvalState">
                                    <input :disabled="true" v-model="projeto.proposal.idProjectErp" name="idProjectErp"
                                           class="form-control">
                                  </div>
                                  <label class="">Nome do projeto </label>
                                  <div name="proposal.name">
                                    <input v-model="projeto.proposal.name" name="nome"
                                           class="form-control" type="text" maxlength="255">
                                  </div>
                                </div>
                              </fieldset>
                              <fieldset :disabled="this.$router.currentRoute.name === 'visualiza-projeto'">
                                <legend>Responsável pela Proposta</legend>
                                <div class="form-group col-md-12">
                                  <label class="control-label">Nome</label>
                                  <div name="proposal.coordinatorName" approval="regComProFormCtrl.approval"
                                       state="regComProFormCtrl.approvalState">
                                    <input v-model="projeto.proposal.coordinatorName"
                                           name="nome do coordenador" class="form-control" type="text">
                                  </div>
                                </div>
                                <div class="form-group col-md-12 required">
                                  <label class="">CPF</label>
                                  <div name="proposal.coordinatorCpf" approval="regComProFormCtrl.approval"
                                       state="regComProFormCtrl.approvalState">
                                    <the-mask v-model="projeto.proposal.coordinatorCpf"
                                              name="cpf do coordenador" class="form-control" type="text"
                                              :mask="'###.###.###-##'" v-validate="'cpf|required'">
                                    </the-mask>
                                  </div>
                                </div>
                                <!---->
                                <div class="form-group col-md-12">
                                  <label class="">E-mail</label>
                                  <div name="proposal.coordinatorEmail" approval="regComProFormCtrl.approval"
                                       state="regComProFormCtrl.approvalState">
                                    <input v-model="projeto.proposal.coordinatorEmail"
                                           name="email do coordenador" class="form-control" type="email"
                                    >
                                  </div>
                                </div>
                                <!---->
                                <!--Telefone-->
                                <div class="form-group col-md-12">
                                  <label class="">Telefone</label>
                                  <div name="proposal.coordinatorPhone" approval="regComProFormCtrl.approval"
                                       state="regComProFormCtrl.approvalState">
                                    <the-mask v-model="projeto.proposal.coordinatorPhone" name="Telefone"
                                              class="form-control" type="tel"
                                              v-validate="'required'"
                                              :mask="['(##) ####-####', '(##) #####-####']"></the-mask>
                                  </div>
                                </div>
                                <!---->
                                <!--Celular-->
                                <div class="form-group col-md-12">
                                  <label class="">Telefone celular</label>
                                  <div name="proposal.coordinatorPhone" approval="regComProFormCtrl.approval"
                                       state="regComProFormCtrl.approvalState">
                                    <the-mask v-model="projeto.proposal.coordinatorMobile" name="Telefone Celular"
                                              class="form-control" type="tel"
                                              :mask="['(##) ####-####', '(##) #####-####']"></the-mask>
                                  </div>
                                </div>
                                <!---->
                                <!--Fax-->
                                <div class="form-group col-md-12">
                                  <label class="">Telefone fax</label>
                                  <div name="proposal.coordinatorPhone" approval="regComProFormCtrl.approval"
                                       state="regComProFormCtrl.approvalState">
                                    <the-mask v-model="projeto.proposal.coordinatorFax" name="Telefone Fax"
                                              class="form-control" type="tel"
                                              :mask="['(##) ####-####', '(##) #####-####']"></the-mask>
                                  </div>
                                </div>
                              </fieldset>
                            </div>
                            <!---->
                            <!--Dados da entidade-->
                            <div class="col-md-7 col-md-offset-1">
                              <fieldset :disabled="this.$router.currentRoute.name === 'visualiza-projeto'">
                                <div class="col-md-6">
                                  <h2 class="h4">Dados da Entidade</h2>
                                  <dl class="proposal-definition-list">
                                    <dt>Entidade</dt>
                                    <dd class="ng-binding">{{projeto.proposal.entity.companyName}}</dd>
                                    <!---->
                                    <dt>Endereço</dt>
                                    <dd>
                                      <address v-for="addr in projeto.proposal.entity.address"
                                               class="ng-binding ng-scope" style="">
                                        {{addr.street}} <br>
                                        {{addr.neighbourhood}} - {{addr.city}} / {{addr.state}}
                                      </address>
                                    </dd>
                                    <!---->
                                    <dt>E-mail</dt>
                                    <dd class="ng-binding">{{projeto.proposal.entity.email}}</dd>
                                  </dl>
                                  <h2 class="h4">Período de execução do projeto</h2>
                                  <!---->
                                  <!--Data inicial-->
                                  <div class=" col-md-12 ng-scope" style="margin-left: -15px">
                                    <label class="">Data inicial</label>
                                    <div class="input-group">
                                      <div name="proposal.initialDate" approval="regComProFormCtrl.approval"
                                           state="regComProFormCtrl.approvalState" class="ng-isolate-scope">
                                        <input name="Data Inicial" v-model="projeto.proposal.initialDate" type="date"
                                               class="form-control ng-pristine ng-untouched ng-scope ng-isolate-scope ng-valid-maxlength ng-valid-date ng-valid-mask ng-not-empty ng-valid ng-valid-required"
                                               placeholder="__/__/____" style="">
                                      </div>
                                    </div>
                                  </div>
                                  <!---->
                                  <!--numero de meses do projeto-->
                                  <div class="form-group col-md-12 ng-scope">
                                    <label class="">Número de meses do projeto</label>
                                    <div name="proposal.periods" approval="regComProFormCtrl.approval"
                                         state="regComProFormCtrl.approvalState" class="ng-isolate-scope">
                                      <input v-model="projeto.proposal.periods" name="periodo"
                                             class="form-control ng-pristine ng-untouched ng-scope ng-invalid ng-not-empty ng-invalid-min ng-valid-required"
                                             type="number" min="1">
                                    </div>
                                  </div>
                                  <!---->
                                  <!--data final de execução-->
                                  <dl class="col-md-12" style="margin-left: -15px">
                                    <dt>Data final de execução:</dt>
                                    <dd class="ng-binding">{{dataFinal}}</dd>
                                  </dl>
                                </div>
                              </fieldset>
                            </div>
                            <!---->
                          </div>
                        </div>

                      </div>
                    </div>


                    <!-- Timeline do projeto -->
                    <div class="row">
                      <div class="col-sm-12">
                      <visualiza-timeline v-if="this.$root.isFundacao(this.usuarioLogado)" :numeroProjeto="projeto.proposal.idProjectErp" :atualizar="atualizar_timeline" @idAcompanhamento="filtro_acompanhamento = $event" @idAlteracoes="filtro_alteracoes = $event"></visualiza-timeline>
                      </div>
                    </div>

                    <!--Acompanhamento de Projeto-->
                    <div class="col-md-12" v-if="this.$root.isFundacao(this.usuarioLogado)" ref="acompanhamento">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Acompanhamento do Projeto</h3>
                          </div>
                        </div>
                        <acompanhamentoProjetos :ParmProjetos="projeto" :ParmAcompanhamento="acProp" :filtro="filtro_acompanhamento" @atualizarTimeline="atualizar_timeline = $event"></acompanhamentoProjetos>
                    </div>

                    <!--Alterações no Projeto-->
                    <div class="col-md-12" v-if="this.$root.isFundacao(this.usuarioLogado)" ref="alteracoes">
                      <div class="box box-widget">
                        <div class="box-header">
                          <h3 class="box-title">Alterações no Projeto</h3>
                        </div>
                      </div>
                      <alteracoesProjetos :ParmProjetos="projeto" :ParmAlteracao="atProp" :filtro="filtro_alteracoes" @atualizarTimeline="atualizar_timeline = $event"></alteracoesProjetos>
                    </div>

                    <!--Informações introdutórias-->
                    <div class="col-md-12">
                      <fieldset :disabled="this.$router.currentRoute.name === 'visualiza-projeto'">
                        <div class="box box-widget">
                          <div class="box-header with-border">
                            <h3 class="box-title">Informações introdutórias</h3>
                          </div>
                          <!---->
                          <div class="box-body">
                            <div class="row">
                              <!---->
                              <!-- introdução -->
                              <div class="col-md-4 col-sm-6 col-xs-12">
                                <div ng-if="regComProFormCtrl.isAval('INTRODUCTION')"
                                     class="form-group col-md-12 ng-scope">
                                  <label for="introduction" class=" ">Introdução</label>
                                  <div name="proposal.introduction" approval="regComProFormCtrl.approval"
                                       state="regComProFormCtrl.approvalState" class="ng-isolate-scope">
                                    <textarea v-model="projeto.proposal.introduction"
                                              name="introducao"
                                              class="form-control ng-pristine ng-scope ng-not-empty ng-valid ng-valid-required ng-touched"
                                              rows="4">
<!---->
                                    </textarea>
                                  </div>
                                </div>
                              </div>
                              <!---->
                              <!-- Apresentação -->
                              <div class="col-md-4 col-sm-6 col-xs-12">
                                <div class="form-group col-md-12 ng-scope">
                                  <label for="presentation" class="">Apresentação</label>
                                  <div name="proposal.presentation" approval="regComProFormCtrl.approval"
                                       state="regComProFormCtrl.approvalState" class="ng-isolate-scope">
                                      <textarea v-model="projeto.proposal.presentation" name="apresentacao"
                                                class="form-control ng-pristine ng-untouched ng-scope ng-empty ng-invalid ng-invalid-required"
                                                rows="4">
                                      </textarea>
                                  </div>
                                </div>
                              </div>
                              <!---->
                              <!-- território -->
                              <div class="col-md-4 col-sm-6 col-xs-12">
                                <div class="form-group col-md-12 ng-scope">
                                  <label for="territory" class="">Território de desenvolvimento do projeto</label>
                                  <div name="proposal.territory" approval="regComProFormCtrl.approval"
                                       state="regComProFormCtrl.approvalState" class="ng-isolate-scope">
                                    <textarea v-model="projeto.proposal.territory" name="territorio"
                                              class="form-control ng-pristine ng-untouched ng-scope ng-empty ng-invalid ng-invalid-required"
                                              rows="4">
                                    </textarea>
                                  </div>
                                </div>
                              </div>
                              <!---->
                              <!-- justification -->
                              <div class="col-md-4 col-sm-6 col-xs-12">
                                <div class="form-group col-md-12 ng-scope">
                                  <label for="justification" class="">Justificativa</label>
                                  <div name="proposal.justification" approval="regComProFormCtrl.approval"
                                       state="regComProFormCtrl.approvalState" class="ng-isolate-scope">
                                    <textarea v-model="projeto.proposal.justification" name="justificativa"
                                              class="form-control ng-pristine ng-untouched ng-scope ng-empty ng-invalid ng-invalid-required"
                                              rows="4">
                                    </textarea>
                                  </div>
                                </div>
                              </div>
                              <!---->
                              <!-- generalObjective -->
                              <div class="col-md-4 col-sm-6 col-xs-12">
                                <div class="form-group col-md-12 ng-scope">
                                  <label for="generalObjective" class="">Objetivo geral</label>
                                  <div name="proposal.generalObjective" approval="regComProFormCtrl.approval"
                                       state="regComProFormCtrl.approvalState" class="ng-isolate-scope">
                                    <textarea v-model="projeto.proposal.generalObjective" name="objetivo Geral"
                                              class="form-control ng-pristine ng-untouched ng-scope ng-not-empty ng-valid ng-valid-required"
                                              rows="4">
                                    </textarea>
                                  </div>
                                </div>
                              </div>
                              <!---->
                              <!-- summary -->
                              <div class="col-md-4 col-sm-6 col-xs-12">
                                <div class="form-group col-md-12 ng-scope">
                                  <label for="summary" class="">Resumo</label>
                                  <div name="proposal.summary" approval="regComProFormCtrl.approval"
                                       state="regComProFormCtrl.approvalState" class="ng-isolate-scope">
                                    <textarea v-model="projeto.proposal.summary" name="sumario"
                                              class="form-control ng-pristine ng-untouched ng-scope ng-not-empty ng-valid ng-valid-required"
                                              rows="4">
                                    </textarea>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                    <!---->
                    <!--Publico alvo-->
                    <div class="col-md-12">
                      <fieldset :disabled="this.$router.currentRoute.name === 'visualiza-projeto'">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Público-alvo</h3>
                          </div>
                        </div>
                        <publicoAlvoOld :propsPublicosGrid="this.projeto.proposal.audiences"></publicoAlvoOld>
                      </fieldset>
                    </div>
                    <!---->
                    <!--Equipe do Projeto-->
                    <div class="col-md-12">
                      <fieldset :disabled="this.$router.currentRoute.name === 'visualiza-projeto'">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Equipe do Projeto</h3>
                          </div>
                        </div>
                        <equipe-projetoOld :propsEquipes="this.projeto.proposal.teams"></equipe-projetoOld>
                      </fieldset>
                    </div>
                    <!---->
                    <!-- Informações Gerais -->
                    <div class="col-md-12">
                      <fieldset :disabled="this.$router.currentRoute.name === 'visualiza-projeto'">
                        <div class="box box-widget">
                          <div class="box-header with-border">
                            <h3 class="box-title">Informações Gerais</h3>
                          </div>
                          <!---->
                          <div class="box-body">
                            <div class="row">
                              <!---->
                              <!-- Resultados esperados -->
                              <div class="col-md-4 col-sm-6 col-xs-12">
                                <div class="form-group col-md-12"
                                     :class="{ 'has-error' : errors.first('Resultados esperados')}">
                                  <label for="results" class="control-label">Resultados esperados</label>
                                  <div name="proposal.results" approval="regComProFormCtrl.approval"
                                       state="regComProFormCtrl.approvalState">
                                        <textarea v-model="projeto.proposal.results" name="Resultados esperados"
                                                  class="form-control" rows="4"
                                                  v-validate="'required'">
                                        </textarea>
                                  </div>
                                </div>
                              </div>
                              <!---->
                              <!-- Operacionalização -->
                              <div class="col-md-4 col-sm-6 col-xs-12">
                                <div class="form-group col-md-12"
                                     :class="{ 'has-error' : errors.first('Operacionalização')}">
                                  <label for="operation" class="control-label">Operacionalização</label>
                                  <div name="proposal.operation" approval="regComProFormCtrl.approval"
                                       state="regComProFormCtrl.approvalState">
                                        <textarea v-model="projeto.proposal.operation" name="Operacionalização"
                                                  class="form-control" rows="4"
                                                  v-validate="'required'">
                                        </textarea>
                                  </div>
                                </div>
                              </div>
                              <!---->
                              <!-- Parceria -->
                              <div class="col-md-4 col-sm-6 col-xs-12">
                                <div class="form-group col-md-12">
                                  <label for="partner" class="control-label">Parceria</label>
                                  <div name="proposal.partner" approval="regComProFormCtrl.approval"
                                       state="regComProFormCtrl.approvalState">
                                        <textarea v-model="projeto.proposal.partner" name="Parceria"
                                                  class="form-control" rows="4">
                                        </textarea>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                    <!---->
                    <!-- Entidade executora  -->
                    <div class="col-md-12">
                      <fieldset>
                        <div class="box box-widget">
                          <div class="box-header with-border">
                            <h3 class="box-title">Entidade executora</h3>
                          </div>
                          <!---->
                          <div class="box-body">
                            <div class="row">
                              <!--Sim ou Não -->
                              <fieldset class="col-md-12">
                                <legend>A proponente será a executora do projeto?</legend>
                                <div name="proposal.entityIsExecutioner" approval="regComProFormCtrl.approval"
                                     state="regComProFormCtrl.approvalState">
                                  <label class="radio-inline control-label">
                                    <input type="radio" name="entityExecutingBool" id="proposal-entity-executing-true"
                                           v-model="projeto.proposal.entityIsExecutioner" value="true"
                                           :selected="projeto.proposal.entityIsExecutioner === 'true'"> Sim
                                  </label>
                                  <label class="radio-inline control-label">
                                    <input type="radio" name="entityExecutingBool" id="proposal-entity-executing-false"
                                           v-model="projeto.proposal.entityIsExecutioner" value="false"
                                           :selected="projeto.proposal.entityIsExecutioner === 'false'"> Não
                                  </label>
                                </div>
                              </fieldset>
                              <!---->
                              <!--Se Não mostra os campos abaixo-->
                              <div v-if="projeto.proposal.entityIsExecutioner === 'false'">
                                <!---->
                                <!-- dados da entidade -->
                                <fieldset class="col-md-4 col-sm-6 col-xs-12">
                                  <legend>Entidade</legend>
                                  <!--Nome Entidade Executora-->
                                  <div class="form-group   col-md-12">
                                    <label class="control-label">Nome</label>
                                    <div approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                      <input v-model="projeto.proposal.entityExecutingName"
                                             name="Nome Entidade Executora" class="form-control" type="text"
                                             maxlength="255">
                                    </div>
                                  </div>
                                  <!---->
                                  <!--Representante legal-->
                                  <div class="form-group col-md-12"
                                       :class="{ 'has-error' : errors.first('Representante legal')}">
                                    <label class="control-label">Representante legal</label>
                                    <div name="proposal.entityExecutingProcurator" approval="regComProFormCtrl.approval"
                                         state="regComProFormCtrl.approvalState">
                                      <input v-model="projeto.proposal.entityExecutingProcurator"
                                             name="Representante legal" class="form-control" type="text"
                                             maxlength="255">
                                    </div>
                                  </div>
                                  <!---->
                                  <!--CNPJ Entidade Executora-->
                                  <div class="form-group required-field col-md-12"
                                       :class="{ 'has-error' : errors.first('CNPJ entidade executora')}">
                                    <label class="control-label">CNPJ</label>
                                    <div name="proposal.entityExecutingCNPJ" approval="regComProFormCtrl.approval"
                                         state="regComProFormCtrl.approvalState">
                                      <the-mask v-model="projeto.proposal.entityExecutingCNPJ"
                                                name="CNPJ entidade executora" class="form-control" type="text"
                                                :mask="['##.###.###/####-##']">
                                      </the-mask>
                                    </div>
                                  </div>
                                </fieldset>
                                <!---->
                                <!-- dados de contato -->
                                <fieldset class="col-md-4 col-sm-6 col-xs-12">
                                  <legend>Contato</legend>
                                  <!--Email-->
                                  <div class="form-group required-field col-md-12"
                                       :class="{ 'has-error' : errors.first('E-mail executora')}">
                                    <label class="control-label">E-mail</label>
                                    <div name="proposal.entityExecutingEmail" approval="regComProFormCtrl.approval"
                                         state="regComProFormCtrl.approvalState">
                                      <input v-model="projeto.proposal.entityExecutingEmail"
                                             name="E-mail executora" class="form-control" type="text"
                                             maxlength="255">
                                    </div>
                                  </div>
                                  <!---->
                                  <!--Telefone Fixo-->
                                  <div class="form-group required-field col-md-12"
                                       :class="{ 'has-error' : errors.first('Telefone Executora')}">
                                    <label class="control-label">Telefone fixo</label>
                                    <div name="proposal.entityExecutingPhone" approval="regComProFormCtrl.approval"
                                         state="regComProFormCtrl.approvalState">
                                      <the-mask v-model="projeto.proposal.entityExecutingPhone"
                                                name="Telefone Executora" class="form-control" type="text"
                                                :mask="['(##) ####-####', '(##) #####-####']">
                                      </the-mask>
                                    </div>
                                  </div>
                                  <!---->
                                  <!--Celular-->
                                  <div ng-if="regComProFormCtrl.isAval('ENTITYEXECUTINGMOBILE')"
                                       class="form-group required-field col-md-12"
                                       :class="{ 'has-error' : errors.first('Telefone celular da executora')}">
                                    <label class="control-label">Telefone celular</label>
                                    <div name="proposal.entityExecutingMobile" approval="regComProFormCtrl.approval"
                                         state="regComProFormCtrl.approvalState">
                                      <the-mask v-model="projeto.proposal.entityExecutingMobile"
                                                name="Telefone celular da executora" class="form-control" type="text"
                                                :mask="['(##) ####-####', '(##) #####-####']">
                                      </the-mask>
                                    </div>
                                  </div>
                                  <!---->
                                  <!--Fax-->
                                  <div class="form-group col-md-12">
                                    <label class="control-label">Telefone fax</label>
                                    <div name="proposal.entityExecutingFax" approval="regComProFormCtrl.approval"
                                         state="regComProFormCtrl.approvalState">
                                      <the-mask v-model="projeto.proposal.entityExecutingFax"
                                                name="entityExecutingFax" class="form-control" type="text"
                                                :mask="['(##) ####-####', '(##) #####-####']">
                                      </the-mask>
                                    </div>
                                  </div>
                                </fieldset>
                                <!---->
                                <!-- dados de endereço -->
                                <fieldset class="col-md-4 col-sm-6 col-xs-12">
                                  <legend>Endereço</legend>
                                  <!--CEP-->
                                  <div ng-if="regComProFormCtrl.isAval('ENTITYEXECUTINGCEP')"
                                       class="form-group required-field col-md-12"
                                       :class="{ 'has-error' : errors.first('CEP da executora')}">
                                    <label class="control-label">CEP</label>
                                    <div name="proposal.entityExecutingCEP" approval="regComProFormCtrl.approval"
                                         state="regComProFormCtrl.approvalState">
                                      <the-mask v-model="projeto.proposal.entityExecutingCEP"
                                                name="CEP da executora" class="form-control" type="text"
                                                :mask="['#####-###']">
                                      </the-mask>
                                    </div>
                                  </div>
                                  <!---->
                                  <!--UF-->
                                  <div ng-if="regComProFormCtrl.isAval('ENTITYEXECUTINGSTATE')"
                                       class="form-group required-field col-md-12"
                                       :class="{ 'has-error' : errors.first('UF executora')}">
                                    <label class="control-label">UF</label>
                                    <div name="proposal.entityExecutingState" approval="regComProFormCtrl.approval"
                                         state="regComProFormCtrl.approvalState">
                                      <select v-model="projeto.proposal.entityExecutingState"
                                              class="form-control" name="UF executora">
                                        <option value="AC">AC</option>
                                        <option value="AL">AL</option>
                                        <option value="AM">AM</option>
                                        <option value="AP">AP</option>
                                        <option value="BA">BA</option>
                                        <option value="CE">CE</option>
                                        <option value="DF">DF</option>
                                        <option value="ES">ES</option>
                                        <option value="GO">GO</option>
                                        <option value="MA">MA</option>
                                        <option value="MG">MG</option>
                                        <option value="MS">MS</option>
                                        <option value="MT">MT</option>
                                        <option value="PA">PA</option>
                                        <option value="PB">PB</option>
                                        <option value="PE">PE</option>
                                        <option value="PI">PI</option>
                                        <option value="PR">PR</option>
                                        <option value="RJ">RJ</option>
                                        <option value="RN">RN</option>
                                        <option value="RO">RO</option>
                                        <option value="RR">RR</option>
                                        <option value="RS">RS</option>
                                        <option value="SC">SC</option>
                                        <option value="SE">SE</option>
                                        <option value="SP">SP</option>
                                        <option value="TO">TO</option>
                                      </select>
                                    </div>
                                  </div>
                                  <!---->
                                  <!--Cidade-->
                                  <div ng-if="regComProFormCtrl.isAval('ENTITYEXECUTINGCITY')"
                                       class="form-group required-field col-md-12"
                                       :class="{ 'has-error' : errors.first('Cidade da Executora')}">
                                    <label class="control-label">Cidade</label>
                                    <div name="proposal.entityExecutingCity" approval="regComProFormCtrl.approval"
                                         state="regComProFormCtrl.approvalState">
                                      <input v-model="projeto.proposal.entityExecutingCity"
                                             name="Cidade da Executora" class="form-control" type="text">
                                    </div>
                                  </div>
                                  <!---->
                                  <!--Endereço-->
                                  <div ng-if="regComProFormCtrl.isAval('ENTITYEXECUTINGADDRESS')"
                                       class="form-group required-field col-md-12"
                                       :class="{ 'has-error' : errors.first('Endereço da Executora')}">
                                    <label class="control-label">Endereço</label>
                                    <div name="proposal.entityExecutingAddress" approval="regComProFormCtrl.approval"
                                         state="regComProFormCtrl.approvalState">
                                      <input v-model="projeto.proposal.entityExecutingAddress"
                                             name="Endereço da Executora" class="form-control" type="text"
                                             maxlength="255">
                                    </div>
                                  </div>
                                </fieldset>
                              </div>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                    <!---->
                    <!--Projeto Duplicação-->
                    <div class="col-md-12" v-show="usuarioLogado.userType === 'FUNDACAO'">
                      <fieldset :disabled="this.$router.currentRoute.name === 'visualiza-projeto'">
                        <!---->
                        <div class="box box-widget">
                          <div class="box-header with-border">
                            <h3 class="box-title">Projeto de duplicação</h3>
                          </div>
                          <!---->
                          <div class="box-body">
                            <div class="row">
                              <div class="col-md-6">
                                <div class="form-group col-md-12 required" uib-tooltip="Projeto de duplicação"
                                     :class="{ 'has-error' : errors.first('Projeto Duplicação')}">
                                  <div name="proposal.duplicateProject" approval="regComProFormCtrl.approval"
                                       state="regComProFormCtrl.approvalState">
                                    <select name="Projeto Duplicação"
                                            class="form-control"
                                            aria-hidden="true"
                                            v-model="projeto.proposal.duplicateProject">
                                      <option v-for="projeto in arvoreProjetos"
                                              :value="projeto.projectNumber">{{projeto.projectNumber + ' / ' +
                                        projeto.projectName}}
                                      </option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                    <!---->
                    <!--Objetivos Específicos-->
                    <div class="col-md-12">
                      <fieldset :disabled="this.$router.currentRoute.name === 'visualiza-projeto'">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Objetivo Específico</h3>
                          </div>
                        </div>
                        <objetivoEspecificoOld :propsObjetivos="projeto.proposal.objectives"></objetivoEspecificoOld>
                      </fieldset>
                    </div>
                    <!---->
                    <!--Metas-->
                    <div class="col-md-12">
                      <fieldset :disabled="this.$router.currentRoute.name === 'visualiza-projeto'"  name="metas" id="metas" ref="metas">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Metas</h3>
                          </div>
                        </div>
                        <metasOld :propsObjetivos="projeto.proposal.objectives"></metasOld>
                      </fieldset>
                    </div>
                    <!---->
                    <!--Atividades-->
                    <div class="col-md-12">
                      <fieldset :disabled="this.$router.currentRoute.name === 'visualiza-projeto'" name="atividades" id="atividades" ref="atividades">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Atividades</h3>
                          </div>
                        </div>
                        <atividadesOld :meses="projeto.proposal.periods"
                                    :propsObjetivos="projeto.proposal.objectives"></atividadesOld>
                      </fieldset>
                    </div>
                    <!-- Solicitar pagamento/ressarcimento -->
                    <div class="col-md-12" style="text-align: right; padding-right: 10px;">
<!--                      <button @click="onChangeViewFinPhy()" uib-tooltip="Altera a visão do cronograma físico-financeiro"-->
<!--                              type="button" class="btn btn-primary btn-flat" style="float: right;"><i-->
<!--                        class="fa fa-refresh" aria-hidden="true"></i> Alterar visão-->
<!--                      </button>-->
                    </div>
<!--                    <button @click="mostraItens()" id="cronograma" ng-value="$ctrl.project.id"-->
<!--                            ng-click="$ctrl.onChangeViewFinPhy()" type="button" class="btn btn-primary btn-flat"-->
<!--                            style="float: right; margin-right: 5px;">-->
<!--                      <i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;<span>Orçamento</span>-->
<!--                    </button>-->
                    <!-- Itens do cronograma -->
<!--                    <div class="col-md-12 box-body" id="grid_cronograma"></div>-->
                    <div class="col-md-12" style="text-align: right; padding-right: 18px;">
                    <button @click="mudaVisaoOrc" style="float: right; margin-right: 5px;" v-if="mudarCro === 1"
                            type="button" class="btn btn-bitbucket btn-flat"><i class="fa fa-refresh" aria-hidden="true"></i> Orçamento
                    </button>
                    <button @click="mudaVisaoCro" style="float: right; margin-right: 5px;" v-if="mudarOrc === 1"
                            type="button" class="btn btn-bitbucket btn-flat"><i class="fa fa-refresh" aria-hidden="true"></i> Cronograma
                    </button>
                    </div>
                    <div class="col-md-12 box-body" id="grid_cronograma" v-if="mudarOrc === 1">
                      <table class="table table-condensed">
                        <thead>
                        <tr>
                          <td style="width: 70%" class="text-left linha-abaixo-larga">
                            <div class="texto-azul cabecalho" style="float: left">Recurso da Fundação e Parceiros
                              Estratégicos
                            </div>
                            <div class="div-esquerda ng-binding">
                              {{totalFundacaoContratado | real}}<br><span class="texto-esmaecido">Total contratado</span></div>
                            <div class="div-esquerda ng-binding">
                              {{totalFundacaoSaldo | real}}<br><span class="texto-esmaecido">Saldo disponível</span></div>
                            <div class="div-esquerda ng-binding">{{(totalFundacaoContratado - totalFundacaoSaldo) / totalFundacaoContratado | percentage}}<br><span class="texto-esmaecido">Percentual executado</span>
                            </div>
                          </td>
                          <td style="width: 10%" class="centralizado texto-claro realcado linha-abaixo-larga">Quantidade<br>Saldo
                          </td>
                          <td style="width: 10%" class="centralizado realcado linha-abaixo-larga"><span
                            class="texto-claro">Saldo<br>Financeiro</span></td>
                          <td style="width: 10%" class="a_direita texto-claro realcado linha-abaixo-larga">Atingimento
                          </td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in itensCronogramaFundacao"
                        :title='"Previsto do " + item.Item_Periodo_Inicio + "º ao " + item.Item_Periodo_Inicio + "º mês do projeto. Contratado:  Quantidade " + item.Qtde_orcado + "  e  Valor Total  R$ " + formatarNumero(item.Valor_orcado, "moeda")' >
                          <td class="linha-abaixo-larga"><span class="texto-claro ng-binding">{{item.Item}} - {{item.Item_Descricao}}</span><br><span
                            class="ng-binding">#{{item.Id_item}}   - {{item.Item_Observacao}}</span></td>
                          <td class="centralizado linha-abaixo-larga ng-binding">{{item.Qtde_saldo}}</td>
                          <td class="a_direita linha-abaixo-larga ng-binding">{{item.Valor_saldo | real}}
                          </td>
                          <td class="a_direita linha-abaixo-larga"><span class="percentual ng-binding">{{((item.Valor_orcado - item.Valor_saldo) / item.Valor_orcado) | percentage}}</span><span v-if="((item.Valor_orcado - item.Valor_saldo) / item.Valor_orcado) > 0.99" class="fa fa-check" style="color: green"></span></td>
                        </tr>
                        </tbody>
                      </table>
                      <table class="table table-condensed">
                        <thead>
                        <tr>
                          <td style="width: 70%" class="text-left linha-abaixo-larga">
                            <div class="texto-azul cabecalho" style="float: left">Recurso de Contrapartida de Entidade
                            </div>
                            <div class="div-esquerda ng-binding">
                              {{totalFundacaoContratadoContrapartida | real}}<br><span class="texto-esmaecido">Total contratado</span></div>
                            <div class="div-esquerda ng-binding">
                              {{totalFundacaoSaldoContrapartida | real}}<br><span class="texto-esmaecido">Saldo disponível</span></div>
                            <div class="div-esquerda ng-binding">{{(totalFundacaoContratadoContrapartida - totalFundacaoSaldoContrapartida) / totalFundacaoContratadoContrapartida | percentage}}<br><span class="texto-esmaecido">Percentual executado</span>
                            </div>
                          </td>
                          <td style="width: 10%" class="centralizado texto-claro realcado linha-abaixo-larga">Quantidade<br>Saldo
                          </td>
                          <td style="width: 10%" class="centralizado realcado linha-abaixo-larga"><span
                            class="texto-claro">Saldo<br>Financeiro</span></td>
                          <td style="width: 10%" class="a_direita texto-claro realcado linha-abaixo-larga">Atingimento
                          </td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in itensCronogramaContrapartida"
                            :title='"Previsto do " + item.Item_Periodo_Inicio + "º ao " + item.Item_Periodo_Inicio + "º mês do projeto. Contratado:  Quantidade " + item.Qtde_orcado + "  e  Valor Total  R$ " + formatarNumero(item.Valor_orcado, "moeda")' >
                          <td class="linha-abaixo-larga"><span class="texto-claro ng-binding">{{item.Item}} - {{item.Item_Descricao}}</span><br><span
                            class="ng-binding">#{{item.Id_item}}   - {{item.Item_Observacao}}</span></td>
                          <td class="centralizado linha-abaixo-larga ng-binding">{{item.Qtde_saldo}}</td>
                          <td class="a_direita linha-abaixo-larga ng-binding">{{item.Valor_saldo | real}}
                          </td>
                          <td class="a_direita linha-abaixo-larga"><span class="percentual ng-binding">{{((item.Valor_orcado - item.Valor_saldo) / item.Valor_orcado) | percentage}}</span><span v-if="((item.Valor_orcado - item.Valor_saldo) / item.Valor_orcado) > 0.99" class="fa fa-check" style="color: green"></span></td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                    <!---->
                    <!--Cronograma-->
                    <!--Se tiver alguma atividade dentro da proposta mostra o cronograma-->
                    <div class="col-md-12" v-if="mudarCro === 1">
                      <fieldset :disabled="this.$router.currentRoute.name === 'visualiza-projeto'">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Cronograma Físico-Financeiro</h3>
                          </div>
                        </div>
                        <cronogramaOld :propsObjetivos="proposta.objectives" :key="componentKey" :atividades="atividades"
                                    :proposta="proposta" :meses="proposta.periods"
                                    :projeto-duplicacao="proposta.duplicateProject"
                                    @itemAdicionado="proposta.objectives = $event"
                                    :disabled="this.$router.currentRoute.name === 'visualiza-projeto'"></cronogramaOld>
                      </fieldset>
                    </div>

                    <!-- Gantt de Atividades do projeto-->
                    <div class="row">
                      <visualiza-gantt-old :idProjeto="proposta.idProjectErp" :tipoBarra="'financeiro'" :mostrarExecFinanc="true" :mostrarExecDeclarada="false"></visualiza-gantt-old>
                    </div>

                    <div class="form-group col-md-12" style="text-align: right; padding-right: 10px;">
                      <br>
                      <!-- Solicitar pagamento/ressarcimento -->
                      <button v-if="this.$root.authorize('solicitacao-contrapartida-editar')"
                              @click="onRedirect('COUNTERPART')" :disabled="blockCounterpart"
                              uib-tooltip="Redireciona para a tela de Solicitação de contrapartida"
                              type="button" class="btn btn-primary btn-flat" style="float: right;">
                        <i class="fa fa-pie-chart" aria-hidden="true"></i> Comprovar contrapartida
                      </button>
                      <button v-if="this.$root.authorize('solicitacao-pagamento-editar')"
                              @click="onRedirect('PAYMENT')" :disabled="blockPayment"
                              uib-tooltip="Redireciona para a tela de Solicitação de pagamento/ressarcimento"
                              type="button" class="btn btn-primary btn-flat" style="float: right; margin-right: 5px;">
                        <i class="fa fa-usd" aria-hidden="true"></i> Solicitar pagamento/ressarcimento
                      </button>
                    </div>
                    <!-- Parcela de adiantamento -->
                    <div class="col-md-12">
                      <div class="box-header with-border">
                        <h3 class="box-title">Parcela de Adiantamento</h3>
                      </div>
                      <b-container fluid>
                        <!-- Main table element -->
                        <b-table show-empty
                                 stacked="md"
                                 striped
                                 :bordered="table.bordered"
                                 :items="projeto.proposal.advancePlots"
                                 :fields="fields"
                                 :current-page="table.currentPage"
                                 :per-page="table.perPage"
                                 :filter="table.filter"
                                 :sort-by.sync="table.sortBy"
                                 :sort-desc.sync="table.sortDesc"
                        >
                          <template slot="value" scope="row">{{row.value.toLocaleString('pt-BR', formato)}}</template>
                        </b-table>
                        <b-row>
                          <b-col md="6" class="my-1" right>
                            <b-pagination :total-rows="table.totalRows" :per-page="table.perPage"
                                          v-model="table.currentPage" class="my-3"/>
                          </b-col>
                        </b-row>
                        <!---->
                        <!---->
                      </b-container>
                      <div v-show="loadingShow" class="overlay"
                           style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                        <i class="fa fa-refresh fa-spin"></i>
                      </div>
                    </div>

                    <!--                      Botões de solicitações-->
                    <div class="form-group col-md-12" style="text-align: right; padding-right: 10px;">
                      <!-- Solicitar adiantamento -->
                      <button v-if="this.$root.authorize('solicitacao-prestacaocontas-editar')"
                              @click="onRedirect('ACCOUNTABILITY')"
                              uib-tooltip="Redireciona para a tela de Solicitação de prestação de contas"
                              type="button" class="btn btn-primary btn-flat" style="float : right;">
                        <i class="fa fa-file-text-o" aria-hidden="true"></i> Realizar prestação de contas
                      </button>
                      <button v-if="this.$root.authorize('solicitacao-devolucaoadiantamento-editar')"
                              @click="onRedirect('DEVOLUTION')" ng-disabled="blockRefund"
                              uib-tooltip="Redireciona para a tela de Solicitação de devolução de adiantamento"
                              type="button" class="btn btn-primary btn-flat" style="float : right; margin-right : 5px;">
                        <i class="fa fa-reply-all" aria-hidden="true"></i> Solicitar devolução de adiantamento
                      </button>
                      <button v-if="this.$root.authorize('solicitacao-adiantamento-editar')"
                              @click="onRedirect('ADVANCE')" ng-disabled="blockAdvance"
                              uib-tooltip="Redireciona para a tela de Solicitação de adiantamento"
                              type="button" class="btn btn-primary btn-flat" style="float : right; margin-right : 5px;">
                        <i class="fa fa-money" aria-hidden="true"></i> Solicitar adiantamento
                      </button>
                    </div>
                    <!---->
                    <div class="col-md-12">
                      <fieldset :disabled="this.$router.currentRoute.name === 'visualiza-projeto'">
                        <div class="modal-body"></div>
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Municípios - Locais de execução</h3>
                          </div>
                        </div>
                        <municipalizacaoOld :proposta="projeto.proposal"
                                         @municipioAdicionado="proposta = $event"></municipalizacaoOld>
                      </fieldset>
                    </div>
                    <!--Cursos-->
                    <div class="col-md-12">
                      <fieldset :disabled="this.$router.currentRoute.name === 'visualiza-projeto'">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Cursos</h3>
                          </div>
                        </div>
                        <cursosOld :propsCursos="projeto.proposal.careers"></cursosOld>
                      </fieldset>
                    </div>
                    <!--Solenização-->
                    <div class="col-md-12">
                      <fieldset :disabled="this.$router.currentRoute.name === 'visualiza-projeto'">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Solenização</h3>
                          </div>
                        </div>
                        <solenizacao :propsSolenizacao="proposta.solemnizations"
                                     @solenizacaoAdicionada="proposta.solemnizations = $event"></solenizacao>
                      </fieldset>
                    </div>
                    <!--Documentos-->
                    <div class="col-md-12">
                      <fieldset :disabled="this.$router.currentRoute.name === 'visualiza-projeto'">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Documentos Upload</h3>
                          </div>
                        </div>
                        <upload-documentos :propDocumentos="projeto.proposal.documents"
                                           :documentTypes="[]"></upload-documentos>
                      </fieldset>
                    </div>
                    <!--Declaração de Adimplência e Inexistência de Outras Fontes:-->
                    <div class="col-md-12">
                      <fieldset :disabled="this.$router.currentRoute.name === 'visualiza-projeto'">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Declaração de Adimplência e Inexistência de Outras Fontes:</h3>
                          </div>
                          <label>Na qualidade de representante legal do proponente, declaro para fins de prova junto à
                            Fundação Banco do Brasil, não contar com
                            outras fontes de recursos para as mesmas despesas custeadas pela Fundação Banco do Brasil
                            neste projeto.</label>
                        </div>
                        <upload-documentos :propDocumentos="projeto.proposal.documentStatements"
                                           :documentTypes="[]"></upload-documentos>
                      </fieldset>
                    </div>
                    <!--Histórico de Aprovações:-->
                    <div v-if="usuarioLogado.userType !== 'PARCEIRO_ESTRATEGICO'" class="col-md-12">
                      <fieldset id="teste" name="teste">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Histórico de Aprovações:</h3>
                          </div>
                        </div>
                        <historico-proposta-old :proposta="proposta"></historico-proposta-old>
                      </fieldset>
                    </div>
                  </div>
                  <!-- buttons -->
                  <div class="col-md-12">
                    <!--<button @click="onClean" type="button" class="btn btn-default btn-flat"><i class="fa fa-eraser" aria-hidden="true"></i> Limpar</button>-->
                    <button v-if="this.$router.currentRoute.name === 'visualiza-projeto'" @click="$router.go(-1)"
                            type="button" class="btn btn-default btn-flat"><i class="fa fa-chevron-circle-left"
                                                                              aria-hidden="true"></i> Voltar à lista de
                      projetos
                    </button>
                  </div>
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
  import PublicoAlvoOld from '../modules/publicoAlvoOld'
  import acompanhamentoProjetos from '../projetos/acompanhamentoProjetos'
  import alteracoesProjetos from '../projetos/alteracoesProjetos'
  import EquipeProjetoOld from '../modules/equipeProjetoOld'
  import ObjetivoEspecificoOld from '../modules/objetivoEspecificoOld'
  import MetasOld from '../modules/metasOld'
  import AtividadesOld from '../modules/atividadesOld'
  import CronogramaOld from '../modules/cronogramaOld'
  import {mapGetters} from 'vuex'
  import Gantt from '../modules/Gantt'
  import MunicipalizacaoOld from '../modules/municipalizacaoOld'
  import CursosOld from '../modules/cursosOld'
  import Solenizacao from '../modules/solenizacao'
  import UploadDocumentos from '../modules/uploadDocumentos'
  import HistoricoPropostaOld from '../modules/historicoPropostaOld'
  // eslint-disable-next-line no-unused-vars
  import moment from 'moment'
  import VisualizaTimeline from './Timeline'
  import VisualizaGanttOld from './AtividadesOld'

  export default {
    components: {
      VisualizaTimeline,
      VisualizaGanttOld,
      HistoricoPropostaOld,
      UploadDocumentos,
      Solenizacao,
      CursosOld,
      MunicipalizacaoOld,
      Gantt,
      acompanhamentoProjetos,
      alteracoesProjetos,
      CronogramaOld,
      AtividadesOld,
      MetasOld,
      ObjetivoEspecificoOld,
      Telefone,
      PublicoAlvoOld,
      EquipeProjetoOld
    },
    name: 'visualiza-projeto',
    data () {
      return {
        mostrarCabecalhoProjeto: false,
        itensCronograma: [],
        itensCronogramaContrapartida: [],
        itensCronogramaFundacao: [],
        atividadesCronograma: [],
        loading: {
          show: false
        },
        filtro_acompanhamento: '',
        filtro_alteracoes: '',
        atualizar_timeline: null,
        alteracao: [],
        acProp: [],
        atProp: [],
        mudarOrc: 0,
        mudarCro: 0,
        projeto: {
          proposal: {
            entity: {
              active: true
            }
          }
        },
        blockCounterpart: false,
        blockPayment: false,
        blockRefund: false,
        blockAdvance: false,
        blockAccountability: false,
        blockStatusERP: false,
        warnAccountability: false,
        objetivos: {},
        changeFinPhy: 'ACTIVITIES',
        proposta: {
          periods: null,
          entity: {
            companyName: ''
          },
          duplicateProjectDescription: ''
        },
        fields: [
          {
            key: 'plot',
            label: 'Número da Parcela',
            thStyle: 'width: 40%; text-align: center',
            sortable: true,
            'class': 'text-center'
          },
          {
            key: 'period',
            label: 'Período',
            thStyle: 'width: 6%; text-align: center',
            sortable: true,
            'class': 'text-center'
          },
          {
            key: 'value',
            label: 'Valor Adiantável',
            thStyle: 'width: 30%; text-align: center',
            sortable: true,
            'class': 'word-wrap:break-word text-center'
          }
        ],
        table: {
          currentPage: 1,
          perPage: 10,
          totalRows: 0,
          sortBy: 'id',
          sortDesc: false,
          filter: null,
          bordered: true
        },
        arvoreProjetos: []
      }
    },
    watch: {
      'proposta.duplicateProject': function () {
        if (this.arvoreProjetos.length) {
          let projetoSelecionado = this.arvoreProjetos.find((projeto) => {
            return projeto.projectNumber === this.proposta.duplicateProject
          })
          this.projeto.proposal.duplicateProjectDescription = projetoSelecionado.projectName
        }
      }
    },
    computed: {
      dataFinal: function () {
        return moment(this.projeto.proposal.initialDate).add(this.projeto.proposal.periods, 'M').format('DD/MM/YYYY')
      },
      ...mapGetters([
        'usuarioLogado'
      ]),
      mostraCronograma: function () {
        if (this.projeto.proposal.objectives) {
          return this.projeto.proposal.objectives.some((o) => {
            return o.goals.activities !== null
          })
        }
      },
      totalFundacaoContratado () {
        if (this.itensCronogramaFundacao.length > 0) {
          return this.itensCronogramaFundacao.reduce((acumulador, objeto) => acumulador + objeto.Valor_orcado, 0)
        }
        return 0
      },
      totalFundacaoSaldo () {
        if (this.itensCronogramaFundacao.length > 0) {
          return this.itensCronogramaFundacao.reduce((acumulador, objeto) => acumulador + objeto.Valor_saldo, 0)
        }
        return 0
      },
      totalFundacaoContratadoContrapartida () {
        if (this.itensCronogramaContrapartida.length > 0) {
          return this.itensCronogramaContrapartida.reduce((acumulador, objeto) => acumulador + objeto.Valor_orcado, 0)
        }
        return 0
      },
      totalFundacaoSaldoContrapartida () {
        if (this.itensCronogramaContrapartida.length > 0) {
          return this.itensCronogramaContrapartida.reduce((acumulador, objeto) => acumulador + objeto.Valor_saldo, 0)
        }
        return 0
      },
      atividades () { // Carrega as atividades
        let atividades = []
        if (this.proposta.objectives) {
          this.proposta.objectives.forEach((objetivo) => {
            if (objetivo.goals) {
              objetivo.goals.forEach((meta) => {
                if (meta.activities) {
                  meta.activities.forEach((atividade) => {
                    atividades.push(atividade)
                    this.$forceUpdate()
                  })
                }
              })
            }
          })
        }
        return atividades
      }
    },
    async created () {
      this.mudarOrc = 0
      this.mudarCro = 1
      this.proposta = {}
      // this.$snotify.clear()
      // this.$snotify.async('Buscando dados do projeto. Por favor, aguarde...', {timeout: 0})
      await this.buscaProjeto()
      this.buscaCronograma()
      this.buscaArvoreProjeto()
      if (this.projeto && this.projeto.proposal.entity && !this.projeto.proposal.entity.active) {
        this.blockPayment = true
        this.blockRefund = true
        this.blockAdvance = true
        this.blockStatusERP = true
        show.info = true
        show.message = 'Algumas solicitações não podem ser realizadas pois a entidade está inativa.'
      }
      if (this.projeto.proposal.statusERP === 'JUD' || this.projeto.proposal.statusERP === 'DLG' || this.projeto.proposal.statusERP === 'ETO' || this.projeto.proposal.statusERP === 'SPS' || this.projeto.proposal.statusERP === 'ENC') {
        this.blockPayment = true
        this.blockRefund = true
        this.blockAdvance = true
        this.blockStatusERP = true
      }
      if (this.projeto.proposal.statusERP === 'SAF' || this.projeto.proposal.statusERP === 'ESE') {
        this.blockCounterpart = true
        this.blockAccountability = true
        this.blockPayment = true
        this.blockRefund = true
        this.blockAdvance = true
        this.blockStatusERP = true
      }
      if (this.projeto.proposal.statusERP === 'SO3' || this.projeto.proposal.statusERP === 'SO4') {
        this.warnAccountability = true
        this.blockPayment = true
        this.blockRefund = true
        this.blockAdvance = true
        this.blockStatusERP = true
      }
      if (this.blockStatusERP) {
        this.$swal({
          title: '<font color="red"><b>Atenção!</b></font>',
          html:
            '<div align="left"> Algumas solicitações não podem ser realizadas pois o projeto está em estado ' + '<b>' + this.projeto.proposal.statusERP + '' + '</div>'
        })
      }
      // if (this.warnAccountability) {
      //   this.$swal({
      //     title: '<font color="red"><b>Atenção!</b></font>',
      //     html:
      //       '<div align="left"> A prestação de contas estará sujeita a análise da Fundação Banco do Brasil (FBB).' + '</div>'
      //   })
      // }
    },
    methods: {
      buscaProposta () {
        this.proposta = {}
        this.loading.show = true
        axios.get('proxy/project/proposal/' + this.projeto.proposal.id).then((response) => {
          this.proposta = response.data.value
          this.loading.show = false
          // this.$snotify.clear()
          // this.$snotify.success('Dados carregados com sucesso!')
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      async buscaProjeto () {
        await axios.get('proxy/project/project-management/' + this.$route.params.id).then(async (response) => {
          this.projeto = response.data.value
          console.log('this.projeto', this.projeto)
          this.objetivos = this.projeto.proposal.objectives
          this.proposta = {}
          await this.buscaProposta()
          // await this.buscaAlteracaoProp()
          // await this.buscaAcompanhamentoProp()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      // async buscaAcompanhamentoProp () {
      //   console.log('this.projeto.proposal.id', this.projeto.proposal.id)
      //   await axiosLaravel.get('/acompanhamento/' + this.projeto.proposal.id).then(async(response) => {
      //     console.log('response', response.data)
      //     this.acProp = response.data
      //     this.loading.show = false
      //     this.$snotify.clear()
      //     this.$snotify.success('Dados carregados com sucesso!')
      //   })
      //     .catch((error) => {
      //       console.log('error', error)
      //       this.$root.trataErro(error)
      //     })
      // },
      // async buscaAlteracaoProp () {
      //   await axiosLaravel.get('/alteracao/' + this.projeto.proposal.id).then(async(response) => {
      //     this.atProp = response.data
      //     console.log('this.atProp', this.atProp)
      //   })
      //     .catch((error) => {
      //       console.log('error', error)
      //       this.$root.trataErro(error)
      //     })
      // },
      onRedirect (type) {
        if (type === 'COUNTERPART') {
          this.$router.push('/solicitacao/contrapartida/')
        }
        if (type === 'PAYMENT') {
          this.$router.push('/solicitacao/pagamento/')
        }
        if (type === 'ACCOUNTABILITY') {
          this.$router.push('/solicitacao/prestacaocontas/')
        }
        if (type === 'DEVOLUTION') {
          this.$router.push('/solicitacao/devolucao_adiantamento/')
        }
        if (type === 'ADVANCE') {
          this.$router.push('/solicitacao/adiantamento/')
        }
      },
      buscaArvoreProjeto () {
        axios.get('/proxy/project/project-tree').then((response) => {
          this.arvoreProjetos = response.data.value
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      mudaVisaoOrc () {
        this.mudarOrc = 1
        this.mudarCro = 0
      },
      mudaVisaoCro () {
        this.mudarOrc = 0
        this.mudarCro = 1
      },
      buscaCronograma () {
        axiosLaravel.post('/processos/cronograma/projeto/', {
          'projeto': this.projeto.id,
          'documento': 0,
          'processo': 'PAGAMENTO',
          'aglutinado': 'Completo'
        }).then((response) => {
          this.itensCronograma = response.data.itens
          this.itensCronogramaContrapartida = response.data.itens.filter((item) => {
            return item.Item_Recurso === 'Contrapartida'
          })
          this.itensCronogramaFundacao = response.data.itens.filter((item) => {
            return item.Item_Recurso !== 'Contrapartida'
          })
          this.atividadesCronograma = response.data.itens
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      formatarNumero (numero, formato) {
        if (formato === 'moeda') {
          return numero.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        } else if (formato === 'percentual') {
          return (numero * 100).toLocaleString('pt-BR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          })
        } else if (formato === 'inteiro') {
          return numero.toLocaleString('pt-BR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          })
        }
      }
      // linhaSaldo ($item) {
      //   let tooltip = 'Previsto do ' + $item.Item_Periodo_Inicio + 'º ao ' + $item.Item_Periodo_Termino + 'º mês do projeto. Contratado:  Quantidade ' + formatarNumero($item.Qtde_orcado, 'inteiro') + '  e  Valor Total  R$ ' + formatarNumero($item.Valor_orcado, 'moeda') + ''
      //   let check = Math.ceil((($item.Valor_orcado - $item.Valor_saldo) / $item.Valor_orcado) * 100) >= 100 ? '<i class=\'fa fa-check\' aria-hidden=\'true\' style=\'color: #10BD10\'></i>' : ''
      //   let linha =
      //     '<tr title=\'' + tooltip + '\'>' +
      //     '<td class=\'linha-abaixo-larga\'>' +
      //     '<span class=\'texto-claro ng-binding\'>' + $item.Item + ' - ' + $item.Item_Descricao + '</span><br>' +
      //     '<span class=\'ng-binding\'>#' + $item.Id_item + '  ' + $item.Item_Observacao + '</span>' +
      //     '</td>' +
      //     '<td class=\'centralizado linha-abaixo-larga ng-binding\'>' + formatarNumero($item.Qtde_saldo, 'inteiro') + '</td>' +
      //     '<td class=\'a_direita linha-abaixo-larga ng-binding\'><span class=\'texto-esmaecido\'>R$</span>  ' + formatarNumero($item.Valor_saldo, 'moeda') + '</td>' +
      //     '<td class=\'a_direita linha-abaixo-larga\'><span class=\'percentual ng-binding\'>' + formatarNumero((($item.Valor_orcado - $item.Valor_saldo) / $item.Valor_orcado), 'percentual') + '%</span>' + check +
      //     '</td>' +
      //     '</tr>'
      //   return linha
      // },
      // cabecalhoSaldo (cebacalho, orcado, saldo) {
      //   let cabecalho =
      //     '<thead><tr>' +
      //     '<td style=\'width: 70%\' class=\'text-left linha-abaixo-larga\'><div class=\'texto-azul cabecalho\' style=\'float: left\'>' + cebacalho + '</div>' +
      //     '<div class=\'div-esquerda ng-binding\'><span class=\'texto-esmaecido\'>R$</span>  ' + formatarNumero(orcado, 'moeda') + '<br><span class=\'texto-esmaecido\'>Total contratado</span></div>' +
      //     '<div class=\'div-esquerda ng-binding\'><span class=\'texto-esmaecido\'>R$</span>  ' + formatarNumero(saldo, 'moeda') + '<br><span class=\'texto-esmaecido\'>Saldo disponível</span></div>' +
      //     '<div class=\'div-esquerda ng-binding\'>' + formatarNumero(((orcado - saldo) / orcado), 'percentual') + '%<br><span class=\'texto-esmaecido\'>Percentual executado</span></div>' +
      //     '</td>' +
      //     '<td style=\'width: 10%\' class=\'centralizado texto-claro realcado linha-abaixo-larga\'>Quantidade<br>Saldo</td>' +
      //     '<td style=\'width: 10%\' class=\'centralizado realcado linha-abaixo-larga\'><span class=\'texto-claro\'>Saldo<br>Financeiro</span></td>' +
      //     '<td style=\'width: 10%\' class=\'a_direita texto-claro realcado linha-abaixo-larga\'>Atingimento</td>' +
      //     '</tr></thead>'
      //   return cabecalho
      // },
      // cabecalhoOrcamento () {
      //   return '<thead><tr><th colspan=\'4\' style=\'width: 50%\' class=\'ng-scope\'>Atividade</th><th colspan=\'2\' class=\'text-center\'>Período</th><th colspan=\'3\' class=\'text-center\'>Total</th></tr></thead>'
      // },
      // cabecalhoAtividade ($item, total) {
      //   let atividade = '<tr style=\'background-color: rgb(223, 228, 235);\' class=\'\'><td colspan=\'4\' class=\'\'>' + $item.Atividade_nome + '</td><td class=\'text-center\'>' + $item.Atividade_Periodo_Inicio + '</td><td class=\'text-center\'>' + $item.Atividade_Periodo_Termino + '</td><td colspan=\'3\' class=\'text-right\'>R$ ' + formatarNumero(total, 'moeda') + '</td></tr>'
      //   let cabecalhoAtividade = '<tr style=\'background-color:#ECF0F5; font-weight:bold;\' class=\'ng-scope\'><th>Recurso</th><th>Tipo</th><th>Item</th><th style=\'width: 15%;\'>Descrição Item</th><th style=\'min-width: 55px;\' class=\'text-center\'>Início</th><th style=\'min-width: 55px;\' class=\'text-center\'>Fim</th><th class=\'text-center\'>Quantidade</th><th>Valor Unitário</th><th>Valor Total</th></tr>'
      //   return atividade + cabecalhoAtividade
      // },
      // linhaOrcamento ($item) {
      //   console.log('linhaOrcamento')
      //   return '<tr class=\'\' style=\'\'>' +
      //     '<td>' + $item.Item_Recurso + '</td>' +
      //     '<td class=\'\'>' + $item.Item_Tipo + ($item.Adiantavel === 1 ? '<br/><span class=\'info\'>Adiantável</span>' : '') + '</td>' +
      //     '<td class=\'\'>' + $item.Item + ' / ' + $item.Item_Descricao + '</td>' +
      //     '<td class=\'\'>' + $item.Item_Observacao + '</td>' +
      //     '<td class=\'text-center\'>' + $item.Item_Periodo_Inicio + '</td>' +
      //     '<td class=\'text-center\'>' + $item.Item_Periodo_Termino + '</td>' +
      //     '<td class=\'text-center\'>' + $item.Qtde_orcado + '</td>' +
      //     '<td class=\'text-right\'>R$ ' + formatarNumero(($item.Valor_orcado / $item.Qtde_orcado), 'moeda') + '</td>' +
      //     '<td class=\'text-right\'>R$ ' + formatarNumero($item.Valor_orcado, 'moeda') + '</td>' +
      //     '</tr>'
      // },
      // totaisOrcamento (totalFbb, totalParceria, totalContrapartida, totalProjeto) {
      //   let totais =
      //     '<tfoot>' +
      //     '<tr class=\'\'><td colspan=\'6\'>Total Fundação</td><td colspan=\'3\' class=\'text-right\' style=\'border-left: none;\'>R$ ' + formatarNumero(totalFbb, 'moeda') + '</td></tr>' +
      //     '<tr class=\'\'><td colspan=\'6\'>Total Parceiro Estratégico</td><td colspan=\'3\' class=\'text-right\' style=\'border-left: none;\'>R$ ' + formatarNumero(totalParceria, 'moeda') + '</td></tr>' +
      //     '<tr class=\'\'><td colspan=\'6\'>Total Contrapartida</td><td colspan=\'3\' class=\'text-right\' style=\'border-left: none;\'>R$ ' + formatarNumero(totalContrapartida, 'moeda') + '</td></tr>' +
      //     '<tr class=\'\'><td colspan=\'6\'>Total do Projeto</td><td colspan=\'3\' class=\'text-right\'>R$ ' + formatarNumero(totalProjeto, 'moeda') + '</td></tr>' +
      //     '</tfoot>'
      //   return totais
      // },
      // mostraItens () {
      //   let id = this.projeto.id
      //
      //   $('#grid_cronograma').html('')
      //   if (id.length !== 0) {
      //     axiosLaravel.post('/processos/cronograma/projeto/', {
      //       'projeto': id,
      //       'documento': 0,
      //       'processo': 'PAGAMENTO',
      //       'aglutinado': 'Completo'
      //     })
      //       .then(function (response) {
      //         let mostrar = $('#cronograma span').text().toLowerCase()
      //         console.log('mostrar', mostrar)
      //         let itens = response.data.itens
      //         let atividades = response.data.atividades
      //         console.log('atividades ', atividades)
      //         if (mostrar === 'saldos') {
      //           // eslint-disable-next-line no-unused-vars
      //           let linhasFbb = ''
      //           // eslint-disable-next-line no-unused-vars
      //           let orcadoFbb = 0
      //           // eslint-disable-next-line no-unused-vars
      //           let saldoFbb = 0
      //           // eslint-disable-next-line no-unused-vars
      //           let linhasCtp = ''
      //           // eslint-disable-next-line no-unused-vars
      //           let orcadoCtp = 0
      //           // eslint-disable-next-line no-unused-vars
      //           let saldoCtp = 0
      //
      //           for (let i = 0; i < itens.length; i++) {
      //             $item = itens[i]
      //             // eslint-disable-next-line no-unused-vars
      //             let tooltip = 'Previsto do ' + $item.Item_Periodo_Inicio + 'º ao ' + $item.Item_Periodo_Termino + 'º mês do projeto. Contratado:  Quantidade ' + $item.Qtde_orcado + '  e  Valor Total  R$ ' + $item.Valor_orcado + ''
      //
      //             if ($item.Item_Recurso === 'Contrapartida') {
      //               linhasCtp += linhaSaldo($item)
      //               orcadoCtp += $item.Valor_orcado
      //               saldoCtp += $item.Valor_saldo
      //             } else {
      //               linhasFbb += linhaSaldo($item)
      //               orcadoFbb += $item.Valor_orcado
      //               saldoFbb += $item.Valor_saldo
      //             }
      //           }
      //           // eslint-disable-next-line no-unused-vars
      //           let recursosFbb = '<table class=\'table table-condensed\'>' + this.cabecalhoSaldo('Recurso da Fundação e Parceiros Estratégicos', orcadoFbb, saldoFbb) + linhasFbb + '</table>'
      //           // eslint-disable-next-line no-unused-vars
      //           let recursosCtp = '<table class=\'table table-condensed\'>' + this.cabecalhoSaldo('Recurso de Contrapartida de Entidade', orcadoCtp, saldoCtp) + linhasCtp + '</table>'
      //           // let grid = recursosFbb + recursosCtp;
      //         } else {
      //           console.log('1')
      //           let atividadesCronograma = ''
      //           let atividadeAtual = ''
      //           let atividadeAnterior = ''
      //           let linhasOrcamento = ''
      //           let totalAtividade = 0
      //           let totalFbb = 0
      //           let totalParceria = 0
      //           let totalContrapartida = 0
      //           let totalProjeto = 0
      //           console.log('2')
      //           for (let i = 0; i < itens.length; i++) {
      //             console.log('3')
      //             console.log('itens', itens)
      //             console.log('i', i)
      //             console.log('itens[i]', itens[i])
      //             let $item = itens[i]
      //             console.log('3.1')
      //             atividadeAtual = $item.Atividade_nome
      //             console.log('3.2')
      //             console.log('atividadeAtual', atividadeAtual)
      //             console.log('atividadeAnterior', atividadeAnterior)
      //             console.log('i > 0 && atividadeAtual !== atividadeAnterior', i > 0 && atividadeAtual !== atividadeAnterior)
      //             if (i > 0 && atividadeAtual !== atividadeAnterior) {
      //               console.log('4')
      //               atividadesCronograma += this.cabecalhoAtividade($itemAnterior, totalAtividade) + linhasOrcamento
      //               linhasOrcamento = ''
      //               totalAtividade = 0
      //             }
      //             console.log('5')
      //             console.log('itens[i]', itens[i])
      //             let itemAnterior = itens[i]
      //             console.log('itemAnterior', itemAnterior)
      //             linhasOrcamento += this.linhaOrcamento($item)
      //             console.log('61')
      //             totalAtividade += $item.Valor_orcado
      //             console.log('62')
      //             atividadeAnterior = $item.Atividade_nome
      //             console.log('63')
      //
      //             if (i === itens.length - 1) {
      //               console.log('7')
      //               atividadesCronograma += this.cabecalhoAtividade($item, totalAtividade) + linhasOrcamento
      //             }
      //             totalFbb += ($item.Item_Recurso === 'Fundação') ? $item.Valor_orcado : 0
      //
      //             totalParceria += ($item.Item_Recurso === 'Parceiro Estratégico') ? $item.Valor_orcado : 0
      //             totalContrapartida += ($item.Item_Recurso === 'Contrapartida') ? $item.Valor_orcado : 0
      //             totalProjeto += $item.Valor_orcado
      //             console.log('8')
      //           }
      //
      //           // GANTT ------------------------------------------------------------------------------------------------
      //           let AatividadesGantt = '<table class=\'table table-condensed table-bordered table-striped gantt_simples\'>'
      //           let numeroMeses = atividades[0].Termino
      //           AatividadesGantt += '<thead><tr><th>' + atividades[0].Nome + '</th>'
      //           for (let j = 1; j <= numeroMeses; j++) {
      //             AatividadesGantt += '<th>' + j + '</th>'
      //           }
      //           AatividadesGantt += '</tr></thead>'
      //
      //           AatividadesGantt += '<tbody>'
      //           for (let i = 1; i < atividades.length; i++) {
      //             $atividade = atividades[i]
      //
      //             let ini = $atividade.Inicio
      //             let fim = $atividade.Termino
      //             let atual = $atividade.Atual
      //
      //             AatividadesGantt += '<tr><td classe=\'ganttAtividade\'>' + $atividade.Nome + '</td>'
      //             for (let j = 1; j <= numeroMeses; j++) {
      //               let classe = ''
      //               if (j >= ini && j < atual) {
      //                 classe = 'passou'
      //               } else if (j === atual) {
      //                 classe = 'atual'
      //               } else if (j > atual && j <= fim) classe = 'pendente'
      //               let conteudo = '&nbsp;'
      //               AatividadesGantt += '<td class=\'meses ' + classe + '\'>' + conteudo + '</td>'
      //             }
      //             AatividadesGantt += '</tr>'
      //           }
      //           AatividadesGantt += '</tbody></table>'
      //
      //           let orcamento = '<table class=\'table table-condensed table-bordered\'>' + cabecalhoOrcamento() + atividadesCronograma + totaisOrcamento(totalFbb, totalParceria, totalContrapartida, totalProjeto) + '</table>'
      //
      //           let gantt = '<div style=\'overflow-x: auto; width: 100%;\'>' + AatividadesGantt + '</div>'
      //           let ganttLegenda = '<table class=\'gantt_simples\'><tr><td class=\'passou meses\'>&nbsp;</td><td>  Período da atividade no projeto</td><td>&nbsp;</td><td class=\'atual meses\'>&nbsp;</td><td>  Mês atual do projeto</td><td>&nbsp;</td></tr></table>'
      //
      //           // eslint-disable-next-line no-unused-vars
      //           let grid = orcamento + gantt + ganttLegenda
      //         }
      //         $('#grid_cronograma').html(grid)
      //         let textoBotao = (mostrar === 'saldos') ? 'Orçamento' : 'Saldos'
      //         $('#cronograma span').text(textoBotao)
      //       })
      //       .catch(function (error) {
      //         console.log(error.response.data)
      //         alert(error.response.data)
      //       })
      //   }
      // }
    }
  }
</script>

<style scoped>
  .texto-claro {
    color: #9E9E9E !important;
  }

  .texto-esmaecido {
    color: #BDBDBD !important;
    font-size: smaller;
  }

  .realcado {
    font-weight: bold;
  }

  .div-esquerda {
    float: left;
    margin-left: 15px;
    font-weight: bold;
  }

  .texto-azul {
    color: cornflowerblue !important;
  }

  .centralizado {
    text-align: center !important;
  }

  .a_direita {
    text-align: right !important;
  }

  .cabecalho {
    font-size: 18px;
  }

  td.linha-abaixo-larga {
    border-bottom: 2px solid silver;
  }

  .cabecalho {
    font-size: 18px;
  }
  .gantt_simples {
    width: 100%;
  }

  .gantt_simples thead th:nth-child(n+2) {
    text-align: center;
    max-width: 10px !important;
  }

  .gantt_simples td.meses {
    width: 30px !important;
  }

  td.passou {
    background: #204d74;
  }

  td.atual {
    background: #4c84b5;
  }

  td.pendente {
    background: #2e5a80
  }

  .gantt_simples tbody td.ganttAtividade {
    width: 20% !important;
  }

  .info {
    color: cornflowerblue;
    font-style: italic;
  }

  .cursor_pointer {
    cursor: pointer;
    color: #3c8dbc;
  }
</style>
