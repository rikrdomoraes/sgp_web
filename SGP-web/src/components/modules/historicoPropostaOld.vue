<template>

  <!-- grid -->
  <div class="row">
    <!--Lista de Editais-->
    <div class="col-sm-12">
      <b-container fluid>
        <!-- Main table element -->
        <b-table show-empty
                 stacked="md"
                 :bordered="table.bordered"
                 :items="table.items"
                 :hover="table.hover"
                 :fields="table.fields"
                 :filter="table.filter"
                 :current-page="table.currentPage"
                 :per-page="table.perPage"
                 :sort-by.sync="table.sortBy"
                 :sort-desc.sync="table.sortDesc"
                 empty-text="Nenhum registro encontrado"
        >
          <template slot="eventDate" scope="row">{{row.value | moment("DD/MM/YYYY HH:mm:ss")}}</template>
          <template slot="actions" scope="row">
            <div>
              <b-button type="button" :disabled="false" @click="showModal = true, testFunc(row)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-search" aria-hidden="true"></i></b-button>
            </div>
          </template>
        </b-table>
        <b-row>
          <b-col md="6" class="my-1" right>
            <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-3" />
          </b-col>
        </b-row>


      </b-container>
      <div v-if="loadingShow" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
        <i class="fa fa-refresh fa-spin"></i>
      </div>
      <div id="app">
        <div v-if="showModal">
          <transition name="modal">
            <div class="modal-mask">
              <div class="modal-wrapper" @click="$emit(showModal=false)">
                <div class="modal-dialog">
                  <div class="modal-content" @click.stop>
                    <div class="modal-header">
                      <button type="button" class="close" @click="showModal=false">
                        <span aria-hidden="true">&times;</span>
                      </button>
                      <h4 class="modal-title">Histórico</h4>
                    </div>
                    <div class="box-body">
                      <fieldset :disabled="this.$router.currentRoute.name === 'proposta-visualiza'" >
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
                                    <fieldset disabled="true">
                                      <legend>Projeto </legend>

                                      <div ng-if="regComProFormCtrl.isAval('NAME')" class="form-group required-field col-md-12 required"
                                           :class="{ 'has-error' : errors.first('nome')}">

                                        <label class="">Número do projeto </label>
                                        <div name="proposal.idProjectErp" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                          <input :disabled="true" v-model="snap.snapshot.proposal.idProjectErp" name="idProjectErp" class="form-control" type="text" maxlength="10">
                                        </div>
                                        <label class="control-label">Nome do projeto </label>
                                        <div   name="proposal.name" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                          <input v-model="snap.snapshot.proposal.name" name="nome"
                                                 class="form-control" type="text" maxlength="255"
                                                 v-validate="'required|max:255'">
                                        </div>
                                      </div>
                                    </fieldset>
                                    <fieldset disabled="true">
                                      <legend>Responsável pela Proposta</legend>
                                      <div ng-if="regComProFormCtrl.isAval('COORDINATORNAME')"
                                           class="form-group required-field col-md-12 required"
                                           :class="{ 'has-error' : errors.first('nome do coordenador')}">
                                        <label class="control-label">Nome</label>
                                        <div name="proposal.coordinatorName" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                          <input v-model="snap.snapshot.proposal.coordinatorName"
                                                 name="nome do coordenador" class="form-control" type="text" v-validate="'required|max:100'"
                                                 maxlength="100">
                                        </div>
                                      </div>
                                      <div ng-if="regComProFormCtrl.isAval('COORDINATORCPF')"
                                           class="form-group required-field col-md-12 required"
                                           :class="{ 'has-error' : errors.first('cpf do coordenador')}">
                                        <label class="control-label">CPF</label>
                                        <div name="proposal.coordinatorCpf" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                          <the-mask v-if="this.$router.currentRoute.name === 'proposta-visualiza'" v-model="snap.snapshot.proposal.coordinatorCpf"
                                                    name="cpf do coordenador" class="form-control" type="text"
                                                    :mask="'###.###.###-##'">
                                          </the-mask>
                                          <the-mask v-if="this.$router.currentRoute.name !== 'proposta-visualiza'" v-model="snap.snapshot.proposal.coordinatorCpf"
                                                    name="cpf do coordenador" class="form-control" type="text"
                                                    :mask="'###.###.###-##'" v-validate="'cpf|required'">
                                          </the-mask>
                                        </div>
                                      </div>

                                      <div ng-if="regComProFormCtrl.isAval('COORDINATOREMAIL')"
                                           class="form-group required-field col-md-12 required"
                                           :class="{ 'has-error' : errors.first('email do coordenador')}">
                                        <label class="control-label">E-mail</label>
                                        <div name="proposal.coordinatorEmail" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                          <input v-model="snap.snapshot.proposal.coordinatorEmail"
                                                 name="email do coordenador" class="form-control" type="email"
                                                 maxlength="255"
                                                 v-validate="'required|email|max:255'"
                                          >
                                        </div>
                                      </div>

                                      <!--Telefone-->
                                      <div ng-if="regComProFormCtrl.isAval('COORDINATORPHONE')"
                                           class="form-group col-md-12 required"
                                           :class="{ 'has-error' : errors.first('Telefone')}">
                                        <label class="control-label">Telefone</label>
                                        <div name="proposal.coordinatorPhone" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState" >
                                          <the-mask v-model="snap.snapshot.proposal.coordinatorPhone" name="Telefone" class="form-control" type="tel"
                                                    v-validate="'required'" :mask="['(##) ####-####', '(##) #####-####']"></the-mask>
                                        </div>
                                      </div>

                                      <!--Celular-->
                                      <div ng-if="regComProFormCtrl.isAval('COORDINATORPHONE')"
                                           class="form-group col-md-12 required"
                                           :class="{ 'has-error' : errors.first('Telefone Celular')}">
                                        <label class="control-label">Telefone</label>
                                        <div name="proposal.coordinatorPhone" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState" >
                                          <the-mask v-model="snap.snapshot.proposal.coordinatorMobile" name="Telefone Celular" class="form-control" type="tel"
                                                    v-validate="'required'" :mask="['(##) ####-####', '(##) #####-####']"></the-mask>
                                        </div>
                                      </div>

                                      <!--Fax-->
                                      <div ng-if="regComProFormCtrl.isAval('COORDINATORPHONE')"
                                           class="form-group col-md-12 required"
                                           :class="{ 'has-error' : errors.first('Telefone Fax')}">
                                        <label class="control-label">Telefone</label>
                                        <div name="proposal.coordinatorPhone" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState" >
                                          <the-mask v-model="snap.snapshot.proposal.coordinatorFax" name="Telefone Fax" class="form-control" type="tel"
                                                    v-validate="'required'" :mask="['(##) ####-####', '(##) #####-####']"></the-mask>
                                        </div>
                                      </div>

                                    </fieldset>
                                  </div>

                                  <!--Dados da entidade-->
                                  <div class="col-md-7 col-md-offset-1">
                                    <div class="col-md-6">
                                      <h2 class="h4">Dados da Entidade</h2>
                                      <dl class="proposal-definition-list">
                                        <dt>Entidade</dt>
                                        <dd class="ng-binding">{{snap.snapshot.proposal.entity.companyName}}</dd>

                                        <dt>Endereço</dt>
                                        <dd>
                                          <address v-for="addr in snap.snapshot.proposal.entity.address" class="ng-binding ng-scope" style="">
                                            {{addr.street}} <br>
                                            {{addr.neighbourhood}} - {{addr.city}} / {{addr.state}}
                                          </address>
                                        </dd>

                                        <dt>E-mail</dt>
                                        <dd class="ng-binding">{{snap.snapshot.proposal.entity.email}}</dd>
                                      </dl>
                                      <h2 class="h4">Período de execução do projeto</h2>

                                      <!--Data inicial-->
                                      <div ng-if="regComProFormCtrl.isAval('INITIALDATE')" class=" col-md-12 ng-scope required" style="margin-left: -15px"
                                           :class="{ 'has-error' : errors.first('Data Inicial')}">
                                        <label class="control-label">Data inicial</label>
                                        <div class="input-group">
                                          <div name="proposal.initialDate" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState" class="ng-isolate-scope">
                                            <input disabled="true" name="Data Inicial" v-model="snap.snapshot.proposal.initialDate" type="date" class="form-control ng-pristine ng-untouched ng-scope ng-isolate-scope ng-valid-maxlength ng-valid-date ng-valid-mask ng-not-empty ng-valid ng-valid-required" placeholder="__/__/____"
                                                   maxlength="20" style=""
                                                   v-validate="'required'">
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
                                          <input disabled="true" v-model="snap.snapshot.proposal.periods" name="periodo" class="form-control ng-pristine ng-untouched ng-scope ng-invalid ng-not-empty ng-invalid-min ng-valid-required" type="number" min="1"
                                                 v-validate="'required|min_value:1'">
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
                                    <textarea v-model="snap.snapshot.proposal.introduction" disabled="true"
                                              name="introducao"
                                              class="form-control ng-pristine ng-scope ng-not-empty ng-valid ng-valid-required ng-touched"
                                              rows="4" v-validate="'required'">

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
                                      <textarea v-model="snap.snapshot.proposal.presentation" name="apresentacao" class="form-control ng-pristine ng-untouched ng-scope ng-empty ng-invalid ng-invalid-required" disabled="true" rows="4"
                                                v-validate="'required'">

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
                                    <textarea v-model="snap.snapshot.proposal.territory"  disabled="true" name="territorio" class="form-control ng-pristine ng-untouched ng-scope ng-empty ng-invalid ng-invalid-required" rows="4"
                                              v-validate="'required'">
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
                                    <textarea v-model="snap.snapshot.proposal.justification"  disabled="true"name="justificativa" class="form-control ng-pristine ng-untouched ng-scope ng-empty ng-invalid ng-invalid-required" rows="4"
                                              v-validate="'required'">
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
                                    <textarea v-model="snap.snapshot.proposal.generalObjective" disabled="true" name="objetivo Geral" class="form-control ng-pristine ng-untouched ng-scope ng-not-empty ng-valid ng-valid-required" rows="4"
                                              v-validate="'required'">

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
                                    <textarea v-model="snap.snapshot.proposal.summary" disabled="true" name="sumario" class="form-control ng-pristine ng-untouched ng-scope ng-not-empty ng-valid ng-valid-required" rows="4"
                                              v-validate="'required'">
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
                            <publico-alvo :propsPublicosGrid="this.snap.snapshot.proposal.audiences" @publicoAlvoAdicionado="snap.snapshot.proposal.audiences = $event"></publico-alvo>
                          </div>

                          <!--Equipe do Projeto-->
                          <div class="col-md-12">
                            <div class="box box-widget">
                              <div class="box-header">
                                <h3 class="box-title">Equipe do Projeto</h3>
                              </div>
                            </div>
                            <equipe-projeto :propsEquipes="this.snap.snapshot.proposal.teams" @equipeAdicionada="snap.snapshot.proposal.teams = $event"></equipe-projeto>
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
                                        <textarea disabled="true" v-model="snap.snapshot.proposal.results" name="Resultados esperados"
                                                  class="form-control" rows="4"
                                                  v-validate="'required'">
                                        </textarea>
                                      </div>
                                    </div>
                                  </div>

                                  <!-- Operacionalização -->
                                  <div class="col-md-4 col-sm-6 col-xs-12">
                                    <div class="form-group required-field col-md-12"
                                         :class="{ 'has-error' : errors.first('Operacionalização')}">
                                      <label for="operation" class="control-label">Operacionalização</label>
                                      <div name="proposal.operation" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                        <textarea disabled="true" v-model="snap.snapshot.proposal.operation" name="Operacionalização"
                                                  class="form-control" rows="4"
                                                  v-validate="'required'">
                                        </textarea>
                                      </div>
                                    </div>
                                  </div>

                                  <!-- Parceria -->
                                  <div class="col-md-4 col-sm-6 col-xs-12">
                                    <div class="form-group col-md-12"
                                         :class="{ 'has-error' : errors.first('Parceria')}">
                                      <label for="partner" class="control-label">Parceria</label>
                                      <div name="proposal.partner" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                        <textarea disabled="true" v-model="snap.snapshot.proposal.partner" name="Parceria"
                                                  class="form-control" rows="4"
                                                  v-validate="'required'">
                                        </textarea>
                                      </div>
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
                                  <fieldset class="col-md-12" disabled="true">
                                    <legend>A proponente será a executora do projeto?</legend>
                                    <div name="proposal.entityIsExecutioner" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                      <label class="radio-inline control-label">
                                        <input type="radio" name="entityExecutingBool" id="proposal-entity-executing-true"
                                               v-model="snap.snapshot.proposal.entityIsExecutioner" value="true" :selected="snap.snapshot.proposal.entityIsExecutioner === 'true'"> Sim
                                      </label>
                                      <label class="radio-inline control-label">
                                        <input type="radio" name="entityExecutingBool" id="proposal-entity-executing-false"
                                               v-model="snap.snapshot.proposal.entityIsExecutioner" value="false" :selected="snap.snapshot.proposal.entityIsExecutioner === 'false'"> Não
                                      </label>
                                    </div>
                                  </fieldset>

                                  <!--Se Não mostra os campos abaixo-->
                                  <div v-if="snap.snapshot.proposal.entityIsExecutioner === 'false'">

                                    <!-- dados da entidade -->
                                    <fieldset class="col-md-4 col-sm-6 col-xs-12">
                                      <legend>Entidade</legend>
                                      <!--Nome Entidade Executora-->
                                      <div class="form-group required-field  col-md-12"
                                           :class="{ 'has-error' : errors.first('Nome Entidade Executora')}">
                                        <label class="control-label">Nome</label>
                                        <div approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                          <input v-model="snap.snapshot.proposal.entityExecutingName"
                                                 name="Nome Entidade Executora" class="form-control" type="text"
                                                 maxlength="255"
                                                 v-validate="'required:!proposta.entityIsExecutioner'">
                                        </div>
                                        <!--<ng-messages ng-if="frmProposalRegister.$submitted" for="frmProposalRegister.entityExecutingName.$error" role="alert">-->
                                        <!--<ng-message when="required" class="label label-danger">Campo requerido</ng-message>-->
                                        <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
                                        <!--<ng-message when="maxlength" class="label label-danger">Tamanho máximo de caracteres: 255</ng-message>-->
                                        <!--</ng-messages>-->
                                        <span v-if="errors.first('Nome Entidade Executora')" class="label label-danger"> {{ errors.first('Nome Entidade Executora') }}</span>
                                      </div>

                                      <!--Representante legal-->
                                      <div  class="form-group required-field col-md-12"
                                            :class="{ 'has-error' : errors.first('Representante legal')}">
                                        <label class="control-label">Representante legal</label>
                                        <div name="proposal.entityExecutingProcurator" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                          <input v-model="snap.snapshot.proposal.entityExecutingProcurator"
                                                 name="Representante legal" class="form-control" type="text"
                                                 maxlength="255"
                                                 v-validate="'required:!proposta.entityIsExecutioner'">
                                        </div>
                                        <!--<ng-messages ng-if="frmProposalRegister.$submitted" for="frmProposalRegister.entityExecutingProcurator.$error" role="alert">-->
                                        <!--<ng-message when="required" class="label label-danger">Campo requerido</ng-message>-->
                                        <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
                                        <!--<ng-message when="maxlength" class="label label-danger">Tamanho máximo de caracteres: 255</ng-message>-->
                                        <!--</ng-messages>-->
                                        <span v-if="errors.first('Representante legal')" class="label label-danger"> {{ errors.first('Representante legal') }}</span>
                                      </div>

                                      <!--CNPJ Entidade Executora-->
                                      <div  class="form-group required-field col-md-12"
                                            :class="{ 'has-error' : errors.first('CNPJ entidade executora')}">
                                        <label class="control-label">CNPJ</label>
                                        <div name="proposal.entityExecutingCNPJ" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                          <the-mask v-model="snap.snapshot.proposal.entityExecutingCNPJ"
                                                    name="CNPJ entidade executora" class="form-control" type="text"
                                                    v-validate="'required:!proposta.entityIsExecutioner|cnpj'" :mask="['##.###.###/####-##']">
                                          </the-mask>
                                        </div>
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
                                          <input v-model="snap.snapshot.proposal.entityExecutingEmail"
                                                 name="E-mail executora" class="form-control" type="text"
                                                 maxlength="255"
                                                 v-validate="'required:!proposta.entityIsExecutioner|email'">
                                        </div>
                                        <!--<ng-messages ng-if="frmProposalRegister.$submitted" for="frmProposalRegister.entityExecutingEmail.$error" role="alert">-->
                                        <!--<ng-message when="required" class="label label-danger">Campo requerido</ng-message>-->
                                        <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
                                        <!--<ng-message when="validateEmail"  class="label label-danger">E-mail inválido</ng-message>-->
                                        <!--<ng-message when="maxlength" class="label label-danger">Tamanho máximo de caracteres: 255</ng-message>-->
                                        <!--</ng-messages>-->
                                        <span v-if="errors.first('E-mail executora')" class="label label-danger"> {{ errors.first('E-mail executora') }}</span>
                                      </div>

                                      <!--Telefone Fixo-->
                                      <div  class="form-group required-field col-md-12"
                                            :class="{ 'has-error' : errors.first('Telefone Executora')}">
                                        <label class="control-label">Telefone fixo</label>
                                        <div name="proposal.entityExecutingPhone" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                          <the-mask v-model="snap.snapshot.proposal.entityExecutingPhone"
                                                    name="Telefone Executora" class="form-control" type="text"
                                                    :mask="['(##) ####-####', '(##) #####-####']"
                                                    v-validate="'required:!proposta.entityIsExecutioner'">
                                          </the-mask>
                                        </div>
                                        <!--<ng-messages ng-if="frmProposalRegister.$submitted" for="frmProposalRegister.entityExecutingPhone.$error" role="alert">-->
                                        <!--<ng-message when="required" class="label label-danger">Campo requerido</ng-message>-->
                                        <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
                                        <!--<ng-message when="maxlength" class="label label-danger">Tamanho máximo de caracteres: 255</ng-message>-->
                                        <!--</ng-messages>-->
                                        <span v-if="errors.first('Telefone Executora')" class="label label-danger"> {{ errors.first('Telefone Executora') }}</span>
                                      </div>

                                      <!--Celular-->
                                      <div ng-if="regComProFormCtrl.isAval('ENTITYEXECUTINGMOBILE')" class="form-group required-field col-md-12"
                                           :class="{ 'has-error' : errors.first('Telefone celular da executora')}">
                                        <label class="control-label">Telefone celular</label>
                                        <div name="proposal.entityExecutingMobile" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                          <the-mask v-model="snap.snapshot.proposal.entityExecutingMobile"
                                                    name="Telefone celular da executora" class="form-control" type="text"
                                                    :mask="['(##) ####-####', '(##) #####-####']"
                                                    v-validate="'required:!proposta.entityIsExecutioner'">
                                          </the-mask>
                                        </div>
                                      </div>

                                      <!--Fax-->
                                      <div class="form-group col-md-12">
                                        <label class="control-label">Telefone fax</label>
                                        <div name="proposal.entityExecutingFax" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                          <the-mask v-model="snap.snapshot.proposal.entityExecutingFax"
                                                    name="entityExecutingFax" class="form-control" type="text"
                                                    :mask="['(##) ####-####', '(##) #####-####']">
                                          </the-mask>
                                        </div>
                                        <!--<ng-messages ng-if="frmProposalRegister.$submitted" for="frmProposalRegister.entityExecutingFax.$error" role="alert">-->
                                        <!--<ng-message when="required" class="label label-danger">Campo requerido</ng-message>-->
                                        <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
                                        <!--<ng-message when="maxlength" class="label label-danger">Tamanho máximo de caracteres: 255</ng-message>-->
                                        <!--</ng-messages>-->
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
                                          <the-mask v-model="snap.snapshot.proposal.entityExecutingCEP"
                                                    name="CEP da executora" class="form-control" type="text"
                                                    :mask="['#####-###']"
                                                    v-validate="'required:!proposta.entityIsExecutioner'">
                                          </the-mask>
                                        </div>
                                      </div>

                                      <!--UF-->
                                      <div ng-if="regComProFormCtrl.isAval('ENTITYEXECUTINGSTATE')"
                                           class="form-group required-field col-md-12"
                                           :class="{ 'has-error' : errors.first('UF executora')}">
                                        <label class="control-label">UF</label>
                                        <div name="proposal.entityExecutingState" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                          <select v-model="snap.snapshot.proposal.entityExecutingState"
                                                  class="form-control" name="UF executora"
                                                  v-validate="'required:!proposta.entityIsExecutioner'">
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

                                      <!--Cidade-->
                                      <div ng-if="regComProFormCtrl.isAval('ENTITYEXECUTINGCITY')" class="form-group required-field col-md-12"
                                           :class="{ 'has-error' : errors.first('Cidade da Executora')}">
                                        <label class="control-label">Cidade</label>
                                        <div name="proposal.entityExecutingCity" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                          <input v-model="snap.snapshot.proposal.entityExecutingCity"
                                                 name="Cidade da Executora" class="form-control" type="text"
                                                 v-validate="'required:!proposta.entityIsExecutioner'">
                                        </div>
                                      </div>

                                      <!--Endereço-->
                                      <div ng-if="regComProFormCtrl.isAval('ENTITYEXECUTINGADDRESS')" class="form-group required-field col-md-12"
                                           :class="{ 'has-error' : errors.first('Endereço da Executora')}">
                                        <label class="control-label">Endereço</label>
                                        <div name="proposal.entityExecutingAddress" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                          <input v-model="snap.snapshot.proposal.entityExecutingAddress"
                                                 name="Endereço da Executora" class="form-control" type="text"
                                                 maxlength="255"
                                                 v-validate="'required:!proposta.entityIsExecutioner'">
                                        </div>
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
                                        <select name="Projeto Duplicação" disabled="true"
                                                class="form-control"
                                                aria-hidden="true"
                                                v-model="snap.snapshot.proposal.duplicateProject">
                                          <option v-for="projeto in arvoreProjetos"
                                                  :value="projeto.projectNumber" >{{projeto.projectNumber + ' / ' + projeto.projectName}}</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!--Objetivos Específicos-->
                          <div class="col-md-12" >
                            <div class="box box-widget">
                              <div class="box-header">
                                <h3 class="box-title">Objetivo Específico</h3>
                              </div>
                            </div>
                            <objetivo-especifico :propsObjetivos="snap.snapshot.proposal.objectives" @objetivoAdicionado="snap.snapshot.proposal.objectives = $event"></objetivo-especifico>
                          </div>

                          <!--Metas-->
                          <div class="col-md-12">
                            <div class="box box-widget">
                              <div class="box-header">
                                <h3 class="box-title">Metas</h3>
                              </div>
                            </div>
                            <metas :propsObjetivos="snap.snapshot.proposal.objectives" @metaAdicionada="snap.snapshot.proposal.objectives = $event"></metas>
                          </div>

                          <!--Atividades-->
                          <div class="col-md-12">
                            <div class="box box-widget">
                              <div class="box-header">
                                <h3 class="box-title">Atividades</h3>
                              </div>
                            </div>
                            <atividades :meses="snap.snapshot.proposal.periods" :propsObjetivos="snap.snapshot.proposal.objectives" @metaAdicionada="snap.snapshot.proposal.objectives = $event"></atividades>
                          </div>

                          <!--Cronograma-->
                          <!--Se tiver alguma atividade dentro da proposta mostra o cronograma-->
                          <div class="col-md-12" v-show="mostraCronograma">
                            <div class="box box-widget">
                              <div class="box-header">
                                <h3 class="box-title">Cronograma Físico-Financeiro</h3>
                              </div>
                            </div>
                            <cronograma :propsObjetivos="snap.snapshot.proposal.objectives" :meses="snap.snapshot.proposal.periods" :atividades="atividades" :projeto-duplicacao="snap.snapshot.proposal.duplicateProject" @itemAdicionado="proposta.objectives = $event"></cronograma>
                          </div>

                          <!--Gantt-->

                          <div class="col-md-12">
                            <gantt :periodo="snap.snapshot.proposal.periods" :propsObjetivos="snap.snapshot.proposal.objectives" :atividades="atividades"></gantt>
                          </div>


                          <div class="col-md-12">
                            <div class="modal-body"></div>
                            <div class="box box-widget">
                              <div  class="box-header">
                                <h3  class="box-title">Municípios - Locais de execução</h3>
                              </div>
                            </div>
                          </div>
                          <municipalizacao :snap.snapshot.proposal="snap.snapshot.proposal" @municipioAdicionado="snap.snapshot.proposal = $event"></municipalizacao>

                          <!--Cursos-->
                          <div class="col-md-12">
                            <div class="box box-widget">
                              <div class="box-header">
                                <h3 class="box-title">Cursos</h3>
                              </div>
                            </div>
                            <cursos :propsCursos="snap.snapshot.proposal.careers"></cursos>
                          </div>

                          <!--Solenização-->
                          <div class="col-md-12">
                            <div class="box box-widget">
                              <div class="box-header">
                                <h3 class="box-title">Solenização</h3>
                              </div>
                            </div>
                            <solenizacao @solenizacaoAdicionada="snap.snapshot.proposal.solemnizations = $event"></solenizacao>
                          </div>

                          <!--Documentos-->
                          <div class="col-md-12">
                            <div class="box box-widget">
                              <div class="box-header">
                                <h3 class="box-title">Documentos Upload</h3>
                              </div>
                            </div>
                            <upload-documentos :propDocumentos="snap.snapshot.proposal.documents" :documentTypes="snap.snapshot.proposal.documentTypes"></upload-documentos>
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
                            <upload-documentos :propDocumentos="snap.snapshot.proposal.documentStatements" :documentTypes="[]"></upload-documentos>
                          </div>
                        </div>
                      </fieldset>
                      <div align="right">
                        <br>
                        <b-button type="button" :disabled="false" @click="showModal = false" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-close" aria-hidden="true"></i>  Fechar </b-button>
                      </div>

                      <!--<fieldset :enabled="this.$router.currentRoute.name === 'proposta-visualiza'" >-->

                      <!--&lt;!&ndash;Histórico de Aprovações:&ndash;&gt;-->
                      <!--<div class="col-md-12">-->
                      <!--<div class="box box-widget">-->
                      <!--<div class="box-header">-->
                      <!--<h3 class="box-title">Histórico de Aprovações:</h3>-->
                      <!--</div>-->
                      <!--</div>-->
                      <!--<historico-proposta :proposta="snap.snapshot.proposal"></historico-proposta>-->
                      <!--</div>-->
                      <!--</fieldset>-->
                      <!-- buttons -->
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </transition>
        </div>
      </div>
    </div>
    <div v-show="false">
      <pre id="myDiv" ref="myDiv"></pre>
      <!-- /.col -->
    </div>
  </div>
  <!-- /.col -->
  <!-- /.row -->

</template>

<script>
  import { mapGetters } from 'vuex'
  import Telefone from '../modules/telefone'
  import PublicoAlvo from '../modules/publicoAlvo'
  import EquipeProjeto from '../modules/equipeProjeto'
  import ObjetivoEspecifico from '../modules/objetivoEspecifico'
  import Metas from '../modules/metas'
  import Atividades from '../modules/atividades'
  import Cronograma from '../modules/cronograma'
  import Gantt from '../modules/Gantt'
  import Municipalizacao from '../modules/municipalizacao'
  import Cursos from '../modules/cursos'
  import Solenizacao from '../modules/solenizacao'
  import UploadDocumentos from '../modules/uploadDocumentos'
  import HistoricoProposta from '../modules/historicoProposta'

  export default {
    components: {
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
      Telefone,
      PublicoAlvo,
      EquipeProjeto},
    name: 'historico-proposta-old',
    data () {
      return {
        showgrid: true,
        showModal: false,
        confirmed: true,
        state: 'GRID',
        historico: {},
        snap: {},
        idEvento: null,
        disable: true,
        curIndex: 0,
        editandoIndex: null,
        table: {
          items: [],
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          perPage: 10,
          sortBy: 'createdAt',
          sortDesc: true,
          fields: [
            { key: 'eventDate', label: 'Data', sortable: true, thStyle: 'text-align: center; width: 15%', class: 'text-center' },
            { key: 'result', label: 'Evento', sortable: true, thStyle: 'text-align: center; width: 15%', class: 'text-center' },
            { key: 'phase', label: 'Fase', sortable: true, thStyle: 'text-align: center; width: 20%', class: 'text-center' },
            { key: 'justify', label: 'Justificativa', sortable: true, thStyle: 'text-align: center; width: 5%', class: 'text-center' },
            { key: 'usu', label: 'Usuário Responsável', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'actions', label: 'Visualização', thStyle: 'text-align: center', class: 'text-center' }
          ]
        }
      }
    },
    props: ['proposta'],
    watch: {
      proposta () {
        this.buscaHistorico()
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ]),
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
    methods: {
      testFunc: function (row) {
        this.idEvento = null
        this.idEvento = row.item.id
        this.carregaEvento()
      },
      carregaEvento () {
        axios.get('/proxy/utility/events/' + this.idEvento).then((response) => {
          this.snap = response.data.value
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      buscaHistorico () {
        axios.get('proxy/project/proposal/' + this.proposta.id + '/history').then((response) => {
          this.table.items = response.data.value
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      }
    }
  }
</script>

<style scoped>
  .modal-mask {
    position: fixed;
    z-index: 9999;
    overflow-y: scroll;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    transition: opacity .3s ease;
  }
  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }
  .modal-dialog {
    width: 70%;
  }
</style>

