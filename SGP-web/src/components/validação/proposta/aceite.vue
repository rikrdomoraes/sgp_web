<template>
  <div class="content-wrapper" style="min-height: 870px;">
    <div class="fade-transition ng-scope" style=""><!-- content header (page header) -->
      <section class="content-header ng-scope">
        <h1>Proposta</h1>
        <b-breadcrumb :items="[{
            text: 'Inicial',
            href: '/'
            }, {
            text: 'Proposta',
            href: '#'
            }, {
            text: 'Aceite',
            active: true
            }]"/>
      </section>

      <!-- main content -->
      <section class="content ng-scope">

        <div class="row">
          <div class="col-md-12">
            <div class="ng-scope ng-isolate-scope">
              <div class="box box-primary">
                <div class="box-header with-border">
                  <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Cadastro de Proposta</h3>
                </div>

                <div class="box-body">
                  <div v-show="loadingShow" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                    <i class="fa fa-refresh fa-spin"></i>
                  </div>
                  <fieldset :disabled="true" >
                    <div class="form-horizontal ng-valid-maxlength ng-invalid ng-invalid-required ng-valid-date ng-invalid-min ng-dirty ng-valid-mask ng-valid-parse">
                      <!--Proposta-->
                      <div class="col-md-12">
                        <div class="box box-widget">
                          <div class="box-header with-border" ng-init="check()">
                            <input type="hidden" v-model="proposta.simplified" name="tipo" id="tipo" autocomplete="off" class="ng-pristine ng-untouched ng-valid ng-not-empty" style="">
                            <h3 class="box-title">Proposta </h3>
                          </div>
                          <div class="box-body" >
                            <div class="row">

                              <!-- Dados do Projeto -->
                              <div class="col-md-4">
                                <fieldset :disabled="this.$router.currentRoute.name === 'proposta-visualiza'" >
                                  <legend>Projeto </legend>

                                  <div ng-if="regComProFormCtrl.isAval('NAME')" class="form-group required-field col-md-12 required"
                                       :class="{ 'has-error' : errors.first('nome')}">

                                    <label class="">Número do projeto </label>
                                    <div name="proposal.idProjectErp" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                      <input :disabled="true" v-model="proposta.idProjectErp" name="idProjectErp" class="form-control" type="text" maxlength="10">
                                    </div>
                                    <label class="control-label">Nome do projeto </label>
                                    <div   name="proposal.name" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                      <input v-model="proposta.name" name="nome"
                                             class="form-control" type="text" maxlength="255"
                                             >
                                    </div>
                                    <span v-if="errors.first('nome')" class="label label-danger"> {{ errors.first('nome') }}</span>
                                  </div>
                                </fieldset>
                                <fieldset>
                                  <legend>Responsável pela Proposta</legend>
                                  <div ng-if="regComProFormCtrl.isAval('COORDINATORNAME')"
                                       class="form-group required-field col-md-12 required"
                                       :class="{ 'has-error' : errors.first('nome do coordenador')}">
                                    <label class="control-label">Nome</label>
                                    <div name="proposal.coordinatorName" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                      <input v-model="proposta.coordinatorName"
                                             name="nome do coordenador" class="form-control" type="text"
                                             maxlength="100">
                                    </div>
                                    <span v-if="errors.first('nome do coordenador')" class="label label-danger"> {{ errors.first('nome do coordenador') }}</span>
                                  </div>
                                  <div ng-if="regComProFormCtrl.isAval('COORDINATORCPF')"
                                       class="form-group required-field col-md-12 required"
                                       :class="{ 'has-error' : errors.first('cpf do coordenador')}">
                                    <label class="control-label">CPF</label>
                                    <div name="proposal.coordinatorCpf" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                      <the-mask v-model="proposta.coordinatorCpf"
                                                name="cpf do coordenador" class="form-control" type="text"
                                                :mask="'###.###.###-##'" >
                                      </the-mask>
                                    </div>
                                    <span v-if="errors.first('cpf do coordenador')" class="label label-danger"> {{ errors.first('cpf do coordenador') }}</span>
                                  </div>

                                  <div ng-if="regComProFormCtrl.isAval('COORDINATOREMAIL')"
                                       class="form-group required-field col-md-12 required"
                                       :class="{ 'has-error' : errors.first('email do coordenador')}">
                                    <label class="control-label">E-mail</label>
                                    <div name="proposal.coordinatorEmail" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                      <input v-model="proposta.coordinatorEmail"
                                             name="email do coordenador" class="form-control" type="email"
                                             maxlength="255"
                                      >
                                    </div>
                                    <span v-if="errors.first('email do coordenador')" class="label label-danger"> {{ errors.first('email do coordenador') }}</span>
                                  </div>

                                  <!--Telefone-->
                                  <div ng-if="regComProFormCtrl.isAval('COORDINATORPHONE')"
                                       class="form-group col-md-12 required"
                                       :class="{ 'has-error' : errors.first('Telefone')}">
                                    <label class="control-label">Telefone</label>
                                    <div name="proposal.coordinatorPhone" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState" >
                                      <the-mask v-model="proposta.coordinatorPhone" name="Telefone" class="form-control" type="tel"
                                                 :mask="['(##) ####-####', '(##) #####-####']"></the-mask>
                                      <span v-if="errors.first('Telefone')" class="label label-danger"> {{ errors.first('Telefone') }}</span>
                                    </div>
                                  </div>

                                  <!--Celular-->
                                  <div ng-if="regComProFormCtrl.isAval('COORDINATORPHONE')"
                                       class="form-group col-md-12 required"
                                       :class="{ 'has-error' : errors.first('Telefone Celular')}">
                                    <label class="control-label">Telefone</label>
                                    <div name="proposal.coordinatorPhone" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState" >
                                      <the-mask v-model="proposta.coordinatorMobile" name="Telefone Celular" class="form-control" type="tel"
                                                :mask="['(##) ####-####', '(##) #####-####']"></the-mask>
                                      <span v-if="errors.first('Telefone Celular')" class="label label-danger"> {{ errors.first('Telefone Celular') }}</span>
                                    </div>
                                  </div>

                                  <!--Fax-->
                                  <div ng-if="regComProFormCtrl.isAval('COORDINATORPHONE')"
                                       class="form-group col-md-12 required"
                                       :class="{ 'has-error' : errors.first('Telefone Fax')}">
                                    <label class="control-label">Telefone</label>
                                    <div name="proposal.coordinatorPhone" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState" >
                                      <the-mask v-model="proposta.coordinatorFax" name="Telefone Fax" class="form-control" type="tel"
                                                :mask="['(##) ####-####', '(##) #####-####']"></the-mask>
                                      <span v-if="errors.first('Telefone Celular')" class="label label-danger"> {{ errors.first('Telefone Fax') }}</span>
                                    </div>
                                  </div>
                                  <!--<telefone v-model="proposta.coordinatorPhone" :nomeCampo="'Telefone'" @telefoneChanged="proposta.coordinatorPhone = $event"></telefone>-->
                                  <!--<telefone v-model="proposta.coordinatorMobile" :nomeCampo="'Telefone Celular'" @telefoneChanged="proposta.coordinatorMobile = $event"></telefone>-->
                                  <!--<telefone v-model="proposta.coordinatorFax" :nomeCampo="'Telefone Fax'" @telefoneChanged="proposta.coordinatorFax = $event"></telefone>-->

                                </fieldset>
                              </div>

                              <!--Dados da entidade-->
                              <div class="col-md-7 col-md-offset-1">
                                <div class="col-md-6">
                                  <h2 class="h4">Dados da Entidade</h2>
                                  <dl class="proposal-definition-list">
                                    <dt>Entidade</dt>
                                    <dd class="ng-binding">{{proposta.entity.companyName}}</dd>

                                    <dt>Endereço</dt>
                                    <dd>
                                      <address v-for="addr in proposta.entity.address" class="ng-binding ng-scope" style="">
                                        {{addr.street}} <br>
                                        {{addr.neighbourhood}} - {{addr.city}} / {{addr.state}}
                                      </address>
                                    </dd>

                                    <dt>E-mail</dt>
                                    <dd class="ng-binding">{{proposta.entity.email}}</dd>
                                  </dl>
                                  <h2 class="h4">Período de execução do projeto</h2>

                                  <!--Data inicial-->
                                  <div ng-if="regComProFormCtrl.isAval('INITIALDATE')" class=" col-md-12 ng-scope required" style="margin-left: -15px"
                                       :class="{ 'has-error' : errors.first('Data Inicial')}">
                                    <label class="control-label">Data inicial</label>
                                    <div class="input-group">
                                      <div name="proposal.initialDate" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState" class="ng-isolate-scope">
                                        <!--<input name="Data Inicial" v-model="proposta.initialDate" type="date" class="form-control ng-pristine ng-untouched ng-scope ng-isolate-scope ng-valid-maxlength ng-valid-date ng-valid-mask ng-not-empty ng-valid ng-valid-required" placeholder="__/__/____"-->
                                        <!--maxlength="20" style=""-->
                                        <!--v-validate="'required'">-->
                                        <datepicker name="Data Inicial" v-model="proposta.initialDate"
                                                    input-class="form-control" :use-utc="true"
                                                    :language="$datePickerPtBR" maxlength="20"
                                                    format="dd/MM/yyyy">
                                        </datepicker>
                                      </div>
                                      <span class="input-group-btn">
                                            <span class="btn btn-default"><i class="fa fa-calendar"></i></span>
                                        </span>
                                    </div>
                                  </div>

                                  <!--numero de meses do projeto-->
                                  <div ng-if="regComProFormCtrl.isAval('PERIODS')" class="form-group required-field col-md-12 ng-scope required"
                                       :class="{ 'has-error' : errors.first('periodo')}">
                                    <label class="control-label">Número de meses do projeto</label>
                                    <div name="proposal.periods" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState" class="ng-isolate-scope">
                                      <input v-model="proposta.periods" name="periodo" class="form-control ng-pristine ng-untouched ng-scope ng-invalid ng-not-empty ng-invalid-min ng-valid-required" type="number" min="1">
                                    </div>
                                    <span v-if="errors.first('periodo')" class="label label-danger"> {{ errors.first('periodo') }}</span>
                                  </div>

                                  <!--data final de execução-->
                                  <dl class="col-md-12" style="margin-left: -15px">
                                    <dt>Data final de execução:</dt>
                                    <dd class="ng-binding">{{dataFinal}}</dd>
                                  </dl>
                                </div>
                              </div>

                            </div>
                          </div>

                        </div>
                      </div>

                      <!--Informações introdutórias-->
                      <div class="col-md-12">
                        <div class="box box-widget">
                          <div class="box-header with-border">
                            <h3 class="box-title">Informações introdutórias</h3>
                          </div>

                          <div class="box-body">
                            <div class="row">

                              <!-- introdução -->
                              <div class="col-md-4 col-sm-6 col-xs-12">
                                <div ng-if="regComProFormCtrl.isAval('INTRODUCTION')" class="form-group required-field required-field col-md-12 ng-scope"
                                     :class="{ 'has-error' : errors.first('introducao')}">
                                  <label for="introduction" class="control-label ">Introdução</label>
                                  <div name="proposal.introduction" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState" class="ng-isolate-scope">
                                    <textarea v-model="proposta.introduction"
                                              name="introducao"
                                              class="form-control ng-pristine ng-scope ng-not-empty ng-valid ng-valid-required ng-touched"
                                              rows="4">

                                    </textarea>
                                  </div>
                                </div>
                              </div>

                              <!-- Apresentação -->
                              <div class="col-md-4 col-sm-6 col-xs-12">
                                <div ng-if="regComProFormCtrl.isAval('PRESENTATION')" class="form-group required-field col-md-12 ng-scope required"
                                     :class="{ 'has-error' : errors.first('apresentacao')}">
                                  <label for="presentation" class="control-label">Apresentação</label>
                                  <div name="proposal.presentation" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState" class="ng-isolate-scope">
                                      <textarea v-model="proposta.presentation" name="apresentacao" class="form-control ng-pristine ng-untouched ng-scope ng-empty ng-invalid ng-invalid-required" rows="4"
                                                >
                                      </textarea>
                                  </div>
                                </div>
                              </div>

                              <!-- território -->
                              <div class="col-md-4 col-sm-6 col-xs-12">
                                <div ng-if="regComProFormCtrl.isAval('TERRITORY')" class="form-group required-field col-md-12 ng-scope required"
                                     :class="{ 'has-error' : errors.first('territorio')}">
                                  <label for="territory" class="control-label">Território de desenvolvimento do projeto</label>
                                  <div name="proposal.territory" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState" class="ng-isolate-scope">
                                    <textarea v-model="proposta.territory" name="territorio" class="form-control ng-pristine ng-untouched ng-scope ng-empty ng-invalid ng-invalid-required" rows="4"
                                              >
                                    </textarea>
                                  </div>
                                </div>
                              </div>

                              <!-- justification -->
                              <div class="col-md-4 col-sm-6 col-xs-12">
                                <div ng-if="regComProFormCtrl.isAval('JUSTIFICATION')" class="form-group required-field col-md-12 ng-scope required"
                                     :class="{ 'has-error' : errors.first('justificativa')}">
                                  <label for="justification" class="control-label">Justificativa</label>
                                  <div name="proposal.justification" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState" class="ng-isolate-scope">
                                    <textarea v-model="proposta.justification" name="justificativa" class="form-control ng-pristine ng-untouched ng-scope ng-empty ng-invalid ng-invalid-required" rows="4"
                                              >
                                    </textarea>
                                  </div>
                                </div>
                              </div>

                              <!-- generalObjective -->
                              <div class="col-md-4 col-sm-6 col-xs-12">
                                <div ng-if="regComProFormCtrl.isAval('GENERALOBJECTIVE')" class="form-group required-field col-md-12 ng-scope required"
                                     :class="{ 'has-error' : errors.first('objetivo Geral')}">
                                  <label for="generalObjective" class="control-label">Objetivo geral</label>
                                  <div name="proposal.generalObjective" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState" class="ng-isolate-scope">
                                    <textarea v-model="proposta.generalObjective" name="objetivo Geral" class="form-control ng-pristine ng-untouched ng-scope ng-not-empty ng-valid ng-valid-required" rows="4"
                                             >

                                    </textarea>
                                  </div>
                                </div>
                              </div>

                              <!-- summary -->
                              <div class="col-md-4 col-sm-6 col-xs-12">
                                <div ng-if="regComProFormCtrl.isAval('SUMMARY')" class="form-group required-field col-md-12 ng-scope required"
                                     :class="{ 'has-error' : errors.first('sumario')}">
                                  <label for="summary" class="control-label">Resumo</label>
                                  <div name="proposal.summary" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState" class="ng-isolate-scope">
                                    <textarea v-model="proposta.summary" name="sumario" class="form-control ng-pristine ng-untouched ng-scope ng-not-empty ng-valid ng-valid-required" rows="4"
                                              >
                                    </textarea>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!--Publico alvo-->
                      <div class="col-md-12">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Público-alvo</h3>
                          </div>
                        </div>
                        <publico-alvo :propsPublicosGrid="this.proposta.audiences" @publicoAlvoAdicionado="proposta.audiences = $event"></publico-alvo>
                      </div>

                      <!--Equipe do Projeto-->
                      <div class="col-md-12">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Equipe do Projeto</h3>
                          </div>
                        </div>
                        <equipe-projeto :propsEquipes="this.proposta.teams" @equipeAdicionada="proposta.teams = $event"></equipe-projeto>
                      </div>

                      <!-- Informações Gerais -->
                      <div class="col-md-12">
                        <div class="box box-widget">
                          <div class="box-header with-border">
                            <h3 class="box-title">Informações Gerais</h3>
                          </div>

                          <div class="box-body">
                            <div class="row">

                              <!-- Resultados esperados -->
                              <div class="col-md-4 col-sm-6 col-xs-12">
                                <div class="form-group required-field col-md-12"
                                     :class="{ 'has-error' : errors.first('Resultados esperados')}">
                                  <label for="results" class="control-label">Resultados esperados</label>
                                  <div name="proposal.results" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                        <textarea v-model="proposta.results" name="Resultados esperados"
                                                  class="form-control" rows="4"
                                                  >
                                        </textarea>
                                  </div>
                                  <span v-if="errors.first('Resultados esperados')" class="label label-danger"> {{ errors.first('Resultados esperados') }}</span>
                                </div>
                              </div>

                              <!-- Operacionalização -->
                              <div class="col-md-4 col-sm-6 col-xs-12">
                                <div class="form-group required-field col-md-12"
                                     :class="{ 'has-error' : errors.first('Operacionalização')}">
                                  <label for="operation" class="control-label">Operacionalização</label>
                                  <div name="proposal.operation" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                        <textarea v-model="proposta.operation" name="Operacionalização"
                                                  class="form-control" rows="4"
                                                  >
                                        </textarea>
                                  </div>
                                  <span v-if="errors.first('Operacionalização')" class="label label-danger"> {{ errors.first('Operacionalização') }}</span>
                                </div>
                              </div>

                              <!-- Parceria -->
                              <div class="col-md-4 col-sm-6 col-xs-12">
                                <div class="form-group col-md-12"
                                     :class="{ 'has-error' : errors.first('Parceria')}">
                                  <label for="partner" class="control-label">Parceria</label>
                                  <div name="proposal.partner" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                        <textarea v-model="proposta.partner" name="Parceria"
                                                  class="form-control" rows="4"
                                                  >
                                        </textarea>
                                  </div>
                                  <span v-if="errors.first('Parceria')" class="label label-danger"> {{ errors.first('Parceria') }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Entidade executora  -->
                      <div class="col-md-12">
                        <div class="box box-widget">
                          <div class="box-header with-border">
                            <h3 class="box-title">Entidade executora</h3>
                          </div>

                          <div class="box-body">
                            <div class="row">
                              <!--Sim ou Não -->
                              <fieldset class="col-md-12">
                                <legend>A proponente será a executora do projeto?</legend>
                                <div name="proposal.entityIsExecutioner" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                  <label class="radio-inline control-label">
                                    <input type="radio" name="entityExecutingBool" id="proposal-entity-executing-true"
                                           v-model="proposta.entityIsExecutioner" value="true" :selected="proposta.entityIsExecutioner === 'true'"> Sim
                                  </label>
                                  <label class="radio-inline control-label">
                                    <input type="radio" name="entityExecutingBool" id="proposal-entity-executing-false"
                                           v-model="proposta.entityIsExecutioner" value="false" :selected="proposta.entityIsExecutioner === 'false'"> Não
                                  </label>
                                </div>
                              </fieldset>

                              <!--Se Não mostra os campos abaixo-->
                              <div v-if="proposta.entityIsExecutioner === 'false'">

                                <!-- dados da entidade -->
                                <fieldset class="col-md-4 col-sm-6 col-xs-12">
                                  <legend>Entidade</legend>
                                  <!--Nome Entidade Executora-->
                                  <div class="form-group required-field  col-md-12"
                                       :class="{ 'has-error' : errors.first('Nome Entidade Executora')}">
                                    <label class="control-label">Nome</label>
                                    <div approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                      <input v-model="proposta.entityExecutingName"
                                             name="Nome Entidade Executora" class="form-control" type="text"
                                             maxlength="255"
                                             >
                                    </div>
                                    <span v-if="errors.first('Nome Entidade Executora')" class="label label-danger"> {{ errors.first('Nome Entidade Executora') }}</span>
                                  </div>

                                  <!--Representante legal-->
                                  <div  class="form-group required-field col-md-12"
                                        :class="{ 'has-error' : errors.first('Representante legal')}">
                                    <label class="control-label">Representante legal</label>
                                    <div name="proposal.entityExecutingProcurator" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                      <input v-model="proposta.entityExecutingProcurator"
                                             name="Representante legal" class="form-control" type="text"
                                             maxlength="255"
                                             >
                                    </div>
                                    <span v-if="errors.first('Representante legal')" class="label label-danger"> {{ errors.first('Representante legal') }}</span>
                                  </div>

                                  <!--CNPJ Entidade Executora-->
                                  <div  class="form-group required-field col-md-12"
                                        :class="{ 'has-error' : errors.first('CNPJ entidade executora')}">
                                    <label class="control-label">CNPJ</label>
                                    <div name="proposal.entityExecutingCNPJ" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                      <the-mask v-model="proposta.entityExecutingCNPJ"
                                                name="CNPJ entidade executora" class="form-control" type="text"
                                                 :mask="['##.###.###/####-##']">
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
                                    <div name="proposal.entityExecutingEmail" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                      <input v-model="proposta.entityExecutingEmail"
                                             name="E-mail executora" class="form-control" type="text"
                                             maxlength="255"
                                             >
                                    </div>
                                    <span v-if="errors.first('E-mail executora')" class="label label-danger"> {{ errors.first('E-mail executora') }}</span>
                                  </div>

                                  <!--Telefone Fixo-->
                                  <div  class="form-group required-field col-md-12"
                                        :class="{ 'has-error' : errors.first('Telefone Executora')}">
                                    <label class="control-label">Telefone fixo</label>
                                    <div name="proposal.entityExecutingPhone" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                      <the-mask v-model="proposta.entityExecutingPhone"
                                                name="Telefone Executora" class="form-control" type="text"
                                                :mask="['(##) ####-####', '(##) #####-####']"
                                                >
                                      </the-mask>
                                    </div>
                                    <span v-if="errors.first('Telefone Executora')" class="label label-danger"> {{ errors.first('Telefone Executora') }}</span>
                                  </div>

                                  <!--Celular-->
                                  <div ng-if="regComProFormCtrl.isAval('ENTITYEXECUTINGMOBILE')" class="form-group required-field col-md-12"
                                       :class="{ 'has-error' : errors.first('Telefone celular da executora')}">
                                    <label class="control-label">Telefone celular</label>
                                    <div name="proposal.entityExecutingMobile" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                      <the-mask v-model="proposta.entityExecutingMobile"
                                                name="Telefone celular da executora" class="form-control" type="text"
                                                :mask="['(##) ####-####', '(##) #####-####']"
                                                >
                                      </the-mask>
                                    </div>
                                    <span v-if="errors.first('Telefone celular da executora')" class="label label-danger"> {{ errors.first('Telefone celular da executora') }}</span>
                                  </div>

                                  <!--Fax-->
                                  <div class="form-group col-md-12">
                                    <label class="control-label">Telefone fax</label>
                                    <div name="proposal.entityExecutingFax" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                      <the-mask v-model="proposta.entityExecutingFax"
                                                name="entityExecutingFax" class="form-control" type="text"
                                                :mask="['(##) ####-####', '(##) #####-####']">
                                      </the-mask>
                                    </div>
                                  </div>
                                </fieldset>

                                <!-- dados de endereço -->
                                <fieldset class="col-md-4 col-sm-6 col-xs-12">
                                  <legend>Endereço</legend>
                                  <!--CEP-->
                                  <div ng-if="regComProFormCtrl.isAval('ENTITYEXECUTINGCEP')" class="form-group required-field col-md-12"
                                       :class="{ 'has-error' : errors.first('CEP da executora')}">
                                    <label class="control-label">CEP</label>
                                    <div name="proposal.entityExecutingCEP" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                      <the-mask v-model="proposta.entityExecutingCEP"
                                                name="CEP da executora" class="form-control" type="text"
                                                :mask="['#####-###']"
                                                >
                                      </the-mask>
                                    </div>
                                    <span v-if="errors.first('CEP da executora')" class="label label-danger"> {{ errors.first('CEP da executora') }}</span>
                                  </div>

                                  <!--UF-->
                                  <div ng-if="regComProFormCtrl.isAval('ENTITYEXECUTINGSTATE')"
                                       class="form-group required-field col-md-12"
                                       :class="{ 'has-error' : errors.first('UF executora')}">
                                    <label class="control-label">UF</label>
                                    <div name="proposal.entityExecutingState" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                      <select v-model="proposta.entityExecutingState"
                                              class="form-control" name="UF executora"
                                              >
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
                                    <span v-if="errors.first('UF executora')" class="label label-danger"> {{ errors.first('UF executora') }}</span>
                                  </div>

                                  <!--Cidade-->
                                  <div ng-if="regComProFormCtrl.isAval('ENTITYEXECUTINGCITY')" class="form-group required-field col-md-12"
                                       :class="{ 'has-error' : errors.first('Cidade da Executora')}">
                                    <label class="control-label">Cidade</label>
                                    <div name="proposal.entityExecutingCity" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                      <input v-model="proposta.entityExecutingCity"
                                             name="Cidade da Executora" class="form-control" type="text"
                                             >
                                    </div>
                                    <span v-if="errors.first('Cidade da Executora')" class="label label-danger"> {{ errors.first('Cidade da Executora') }}</span>
                                  </div>

                                  <!--Endereço-->
                                  <div ng-if="regComProFormCtrl.isAval('ENTITYEXECUTINGADDRESS')" class="form-group required-field col-md-12"
                                       :class="{ 'has-error' : errors.first('Endereço da Executora')}">
                                    <label class="control-label">Endereço</label>
                                    <div name="proposal.entityExecutingAddress" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                      <input v-model="proposta.entityExecutingAddress"
                                             name="Endereço da Executora" class="form-control" type="text"
                                             maxlength="255"
                                             >
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
                      <div class="col-md-12" v-show="usuarioLogado.userType === 'FUNDACAO'">

                        <div class="box box-widget">
                          <div class="box-header with-border">
                            <h3 class="box-title">Projeto de duplicação</h3>
                          </div>

                          <div class="box-body">
                            <div class="row">
                              <div class="col-md-6">
                                <div class="form-group col-md-12 required" uib-tooltip="Projeto de duplicação"
                                     :class="{ 'has-error' : errors.first('Projeto Duplicação')}">
                                  <div name="proposal.duplicateProject" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                    <select name="Projeto Duplicação"
                                            class="form-control"
                                            aria-hidden="true"
                                            v-model="proposta.duplicateProject">
                                      <option v-for="projeto in arvoreProjetos"
                                              :value="projeto.projectNumber" >{{projeto.projectNumber}}/{{projeto.projectName}}</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!--Objetivos Específicos-->
                      <div class="col-md-12">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Objetivo Específico</h3>
                          </div>
                        </div>
                        <objetivo-especifico :propsObjetivos="proposta.objectives" @objetivoAdicionado="proposta.objectives = $event"></objetivo-especifico>
                      </div>

                      <!--Metas-->
                      <div class="col-md-12">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Metas</h3>
                          </div>
                        </div>
                        <metas :propsObjetivos="proposta.objectives" @metaAdicionada="proposta.objectives = $event"></metas>
                      </div>

                      <!--Atividades-->
                      <div class="col-md-12">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Atividades</h3>
                          </div>
                        </div>
                        <atividades :meses="proposta.periods" :propsObjetivos="proposta.objectives" @metaAdicionada="proposta.objectives = $event"></atividades>
                      </div>

                      <!--Cronograma-->
                      <!--Se tiver alguma atividade dentro da proposta mostra o cronograma-->
                      <div class="col-md-12" v-show="mostraCronograma">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Cronograma Físico-Financeiro</h3>
                          </div>
                        </div>
                        <cronograma :propsObjetivos="proposta.objectives" :atividades="atividades" :meses="proposta.periods" :projeto-duplicacao="proposta.duplicateProject" @itemAdicionado="proposta.objectives = $event"></cronograma>
                      </div>

                      <!--Gantt-->
                      <div class="col-md-12">
                        <gantt :periodo="proposta.periods" :propsObjetivos="proposta.objectives" :atividades="atividades"></gantt>
                      </div>


                      <div class="col-md-12">
                        <div class="modal-body"></div>
                        <div class="box box-widget">
                          <div  class="box-header">
                            <h3  class="box-title">Municípios - Locais de execução</h3>
                          </div>
                        </div>
                      </div>
                      <municipalizacao :proposta="proposta" @municipioAdicionado="proposta = $event"></municipalizacao>

                      <!--Cursos-->
                      <div class="col-md-12">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Cursos</h3>
                          </div>
                        </div>
                        <cursos :propsCursos="proposta.careers"></cursos>
                      </div>

                      <!--Solenização-->
                      <div class="col-md-12">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Solenização</h3>
                          </div>
                        </div>
                        <solenizacao @solenizacaoAdicionada="proposta.solemnizations = $event"></solenizacao>
                      </div>

                      <!--Documentos-->
                      <div class="col-md-12">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Documentos Upload</h3>
                          </div>
                        </div>
                        <upload-documentos :propDocumentos="proposta.documents" :documentTypes="proposta.documentTypes" :documentosObrigatorios="documentosObrigatorios"></upload-documentos>
                      </div>

                      <!--Declaração de Adimplência e Inexistência de Outras Fontes:-->
                      <div class="col-md-12">
                        <div class="box box-widget">
                          <div class="box-header">
                            <h3 class="box-title">Declaração de Adimplência e Inexistência de Outras Fontes:</h3>
                          </div>
                          <label>Na qualidade de representante legal do proponente, declaro para fins de prova junto à Fundação Banco do Brasil, não contar com
                            outras fontes de recursos para as mesmas despesas custeadas pela Fundação Banco do Brasil neste projeto.</label>
                        </div>
                        <upload-documentos :propDocumentos="proposta.documentStatements" :documentTypes="[]" :documentosObrigatorios="[]"></upload-documentos>
                      </div>

                    </div>
                  </fieldset>
                  <!--Histórico de Aprovações:-->
                  <div class="col-md-12">
                    <div class="box box-widget">
                      <div class="box-header">
                        <h3 class="box-title">Histórico de Aprovações:</h3>
                      </div>
                    </div>
                    <historico-proposta :proposta="proposta"></historico-proposta>
                  </div>
                </div>

              </div>

              <!--Aceite da Proposa-->
              <fieldset class="ng-isolate-scope"><div class="box box-primary">
                <div class="box-header with-border">
                  <h3 class="box-title"><i class="fa fa-caret-right" aria-hidden="true"></i> Aceite da Proposta</h3>
                </div>
                <!-- /.box-header -->
                <div class="box-body"><div class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: none;"><i class="fa fa-refresh fa-spin"></i></div>
                  <div class="row">
                    <div class="col-md-12">
                      <form name="frmAcceptance" class="form-horizontal ng-pristine ng-invalid ng-invalid-required" novalidate="">
                        <fieldset>
                          <!--<legend>Ficha de Auto Verificação</legend>-->

                          <!--<div class="col-md-12">-->

                            <!-- FAV -->
                            <fav :propsPreAnalise="analise" fase="Aceite"></fav>


                          <!--</div>-->
                          <div class="col-md-6">

                            <!-- resultado do aceite -->
                            <div class="form-group required-field full" :class="{ 'has-error' : errors.first('resultado aceite')}" style="margin-right:0;margin-left:0">
                              <label for="resultadoAceite" class="control-label">Proposta aceita pela Gepro?</label>
                              <div class="col-md-12">
                                <label class="radio-inline new-control new-control-radio">
                                  <input type="radio" name="resultado aceite" v-model="analise.approval.acceptanceApprovalResult" value="APPROVED"
                                         v-validate="'required'" > Sim
                                  <div class="new-control-indicator"></div>
                                </label>
                              </div>
                              <div class="col-md-12">
                                <label class="radio-inline new-control new-control-radio">
                                  <input type="radio" name="resultado aceite" v-model="analise.approval.acceptanceApprovalResult" value="REJECTED"
                                         v-validate="'required'"> Não
                                  <div class="new-control-indicator"></div>
                                </label>
                              </div>
                              <span v-if="errors.first('resultado aceite')" class="label label-danger"> {{ errors.first('resultado aceite') }}</span>
                            </div>

                            <!-- reasonToReject -->
                            <div v-if="analise.approval.acceptanceApprovalResult === 'REJECTED'" class="form-group required-field full ng-hide"
                                 :class="{ 'has-error' : errors.first('motivo')}" style="margin-right:0;margin-left:0">
                              <label for="motivo" class="control-label">Motivo de devolver para Geate:</label>
                              <select v-model="analise.motivoRejeicao" name="motivo" class="form-control ng-pristine ng-untouched ng-empty ng-valid ng-valid-required"
                                      v-validate="'required'">
                              <option value="Outro">Outro</option>
                              <option v-for="razao in razoes" :value="razao">{{razao}}</option>
                              </select>
                              <span v-if="errors.first('motivo')" class="label label-danger"> {{ errors.first('motivo') }}</span>
                            </div>

                            <!-- justify -->
                            <div v-if="analise.approval.reasonToReject === 'Outro'" class="form-group required-field full ng-hide"
                                 :class="{ 'has-error' : errors.first('justificativa')}" style="margin-right:0;margin-left:0">
                              <label for="justificativa" class="control-label">Justificativa:</label>
                              <textarea name="justificativa" v-model="analise.approval.justify" rows="3" class="form-control ng-pristine ng-untouched ng-empty ng-valid ng-valid-required"
                                        v-validate="'required'">
                              </textarea>
                              <span v-if="errors.first('justificativa')" class="label label-danger"> {{ errors.first('justificativa') }}</span>
                            </div>
                          </div>
                          <div class="col-md-6">

                            <!-- analyst -->
                            <div class="form-group" style="margin-right:0;margin-left:0">
                              <label for="analyst" class="control-label">Analista responsável:</label>
                              <select v-model="analise.approval.analyst" name="analyst" class="form-control ng-pristine ng-untouched ng-valid ng-empty">
                                <option v-for="analista in analistas" :value="analista">{{analista.userName}}</option>
                              </select>
                            </div>
                          </div>
                        </fieldset>
                      </form>
                    </div>
                    <!-- /.col -->
                  </div>
                  <!-- /.row -->
                </div>
                <!-- /.box-body -->
                <div class="box-footer" v-if="aguardaEnviar === 0">
                  <button v-if="analise.approval.acceptanceApprovalResult" @click="onConclude" type="button" class="btn btn-success btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</button>
                  <button @click="$router.go(-1)" type="button" class="btn btn-default btn-flat"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</button>
                </div>
                <!-- /.box-footer -->
              </div>
                <!-- /.box --></fieldset>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  // eslint-disable-next-line no-unused-vars
  import moment from 'moment'
  import PublicoAlvo from '../../modules/publicoAlvo'
  import EquipeProjeto from '../../modules/equipeProjeto'
  import ObjetivoEspecifico from '../../modules/objetivoEspecifico'
  import Metas from '../../modules/metas'
  import Atividades from '../../modules/atividades'
  import Cronograma from '../../modules/cronograma'
  import Gantt from '../../modules/Gantt'
  import Municipalizacao from '../../modules/municipalizacao'
  import Cursos from '../../modules/cursos'
  import Solenizacao from '../../modules/solenizacao'
  import UploadDocumentos from '../../modules/uploadDocumentos'
  import HistoricoProposta from '../../modules/historicoProposta'
  import Analise from './analise'
  import PreparacaoDocumento from './formalizacao'
  import Fav from '../../modules/fav'

  export default {
    components: {
      Fav,
      PreparacaoDocumento,
      Analise,
      HistoricoProposta,
      UploadDocumentos,
      Solenizacao,
      Cursos,
      Municipalizacao,
      Gantt,
      Cronograma,
      Atividades,
      Metas,
      ObjetivoEspecifico,
      EquipeProjeto,
      PublicoAlvo},
    name: 'aceite',
    data () {
      return {
        loadingShow: false,
        analistas: [],
        razoes: [],
        proposta: {
          entity: {
            companyName: ''
          },
          duplicateProjectDescription: ''
        },
        analise: {
          motivoRejeicao: null,
          approval: {
            reasonToReject: null
          }
        },
        aguardaEnviar: 0,
        arvoreProjetos: [],
        documentosObrigatorios: ['Memória de cálculo', 'Declaração']
      }
    },
    watch: {
      'analise.motivoRejeicao' () {
        this.analise.approval.reasonToReject = this.analise.motivoRejeicao
      }
    },
    computed: {
      dataFinal: function () {
        return moment(this.proposta.initialDate).add(this.proposta.periods, 'M').format('DD/MM/YYYY')
      },
      ...mapGetters([
        'usuarioLogado'
      ]),
      mostraCronograma: function () {
        if (this.proposta.objectives) {
          return this.proposta.objectives.some((o) => { return o.goals.activities !== null })
        }
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
    created () {
      this.buscaAnalise()
      this.buscaArvoreProjeto()
      this.buscaRazoes()
      this.buscaAnalistas()
    },
    methods: {
      buscaAnalise () {
        this.loadingShow = true
        axios.get('proxy/project/approval-acceptance/' + this.$route.params.id).then((response) => {
          this.proposta = response.data.value.proposal
          this.analise = response.data.value
          this.analise.approval = {}
          this.loadingShow = false
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      buscaAnalistas () {
        axios.get('proxy/project/approval-acceptance/analyst/list').then((response) => {
          this.analistas = response.data.value
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      buscaRazoes () {
        axios.get('proxy/project/standardized-reason/valid').then((response) => {
          this.razoes = response.data.value
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      async onConclude () {
        // Verifica se algum componente filho tem algum erro
        if (await this.$root.verificaFormulario(this)) {
          this.$snotify.error('Formulario possui erros favor verificar')
          return
        }
        this.$validator.validateAll().then((result) => {
          if (!result) {
            this.$snotify.error('Formulario possui erros favor verificar')
          } else {
            this.enviaBackEnd()
          }
        })
      },
      enviaBackEnd () {
        this.aguardaEnviar = 1
        this.$snotify.async('Validando proposta. Por favor, aguarde...', {timeout: 0})
        axios.put('proxy/project//approval-acceptance/' + this.analise.id, this.analise).then((response) => {
          this.$snotify.clear()
          this.$snotify.success('Validação atualizada com sucesso')
          setTimeout(() => { this.$router.go(-1) }, 2000)
        })
          .catch((error) => {
            this.aguardaEnviar = 0
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      buscaArvoreProjeto () {
        axios.get('/proxy/project/project-tree').then((response) => {
          this.arvoreProjetos = response.data.value
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      }
    }
  }
</script>

<style scoped>

</style>
