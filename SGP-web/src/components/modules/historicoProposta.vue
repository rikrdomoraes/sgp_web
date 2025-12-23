<template>
  <div>
  <button @click="mostraHistorico = !mostraHistorico" uib-tooltip="Oculta ou Mostra o histórico de alterações da Entidade" type="button" class="btn btn-primary btn-flat"><i class="fa fa-eye" aria-hidden="true"></i> {{mostraHistorico ? 'Ocultar histórico' : 'Mostrar histórico'}}</button>
  <br><br>
  <div class="box-body" v-show="mostraHistorico">

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
         <template slot="inicio" scope="row">{{row.value | moment("DD/MM/YYYY HH:mm")}}</template>
          <template slot="termino" scope="row"><span v-if="row.value !== null">{{row.value | moment("DD/MM/YYYY HH:mm")}}</span><span v-else-if="row.value === null">-</span></template>
          <template slot="nome" scope="row">
            <span v-if="row.value === 'SOLICITACAO'">Solicitação</span>
            <span v-if="row.value === 'REVISAO'">Em Revisão</span>
            <span v-if="row.value === 'ANALISE'">Análise</span>
            <span v-if="row.value === 'ANULACAO'">Anulação</span>
            <span v-if="row.value === 'DEFERIMENTO'">Deferimento</span>
            <span v-if="row.value === 'FORMALIZACAO'">Formalização</span>
            <span v-if="row.value === 'APROVACAO'">Aprovação</span>
          </template>
          <template slot="actions" scope="row">
            <div>
              <b-button v-if="row.item.termino" type="button" :disabled="false" @click="showModal = true, testFunc(row)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-search" aria-hidden="true"></i></b-button>
            </div>
          </template>
        </b-table>
        <b-row>
          <b-col md="6" class="my-1" right>
            <b-pagination :total-rows="table.items.length" :per-page="table.perPage" v-model="table.currentPage" class="my-3" />
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
                      <fieldset :disabled="true" >
                        <div class="form-horizontal ng-valid-maxlength ng-invalid ng-invalid-required ng-valid-date ng-invalid-min ng-dirty ng-valid-mask ng-valid-parse">
                          <!--Proposta-->
                          <div class="col-md-12">
                            <div class="box box-widget">
                              <div class="box-body" >
                                <div class="row">

                                  <!-- Dados do Projeto -->
                                  <div class="col-md-6">
                                    <legend>Projeto </legend>

                                    <div class="form-group required-field col-md-10 required"
                                         :class="{ 'has-error' : errors.first('nome')}">

                                      <div>
                                        <div v-if="snap.ds_codigo_projeto_erp">
                                          <label class="">Número do projeto </label>
                                          <div name="proposal.idProjectErp" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                            <input :disabled="true" v-model="proposta.ds_codigo_projeto_erp" name="idProjectErp" class="form-control" type="text" maxlength="10">
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <label class="control-label">Nome do projeto </label>
                                        <div   name="proposal.name">
                                          <input v-model="snap.ds_nome" name="nome" data-vv-as="Nome da Proposta"
                                                 class="form-control" type="text" maxlength="255"
                                                 v-validate="'required|max:255'">
                                        </div>
                                        <span v-if="errors.first('nome')" class="label label-danger"> {{ errors.first('nome') }}</span>
                                      </div>

                                    </div>
                                  </div>
                                </div>
                                <div class="row">

                                  <!-- Responsável pela Proposta -->
                                  <div  class="col-md-5">
                                    <legend>Responsável pela Proposta</legend>
                                    <div
                                         class="form-group required-field col-md-12 required"
                                         :class="{ 'has-error' : errors.first('nome do coordenador')}">
                                      <label class="control-label">Nome</label>
                                      <div name="proposal.coordinatorName">
                                        <input v-model="snap.ds_nome_coordenador"
                                               name="nome do coordenador" class="form-control" type="text" v-validate="'required|max:100'" data-vv-as="Nome do Coordenador"
                                               maxlength="100">
                                      </div>
                                      <span v-if="errors.first('nome do coordenador')" class="label label-danger"> {{ errors.first('nome do coordenador') }}</span>
                                    </div>
                                    <div
                                         class="form-group required-field col-md-12 required"
                                         :class="{ 'has-error' : errors.first('cpf do coordenador')}">
                                      <label class="control-label">CPF</label>
                                      <div name="proposal.coordinatorCpf">
                                        <the-mask v-if="this.$router.currentRoute.name === 'proposta-visualiza'" v-model="snap.ds_cpf_coordenador"
                                                  name="cpf do coordenador" class="form-control" type="text" data-vv-as="CPF do Coordenador"
                                                  :mask="'###.###.###-##'">
                                        </the-mask>
                                        <the-mask v-if="this.$router.currentRoute.name !== 'proposta-visualiza'" v-model="snap.ds_cpf_coordenador"
                                                  name="cpf do coordenador" class="form-control" type="text"
                                                  :mask="'###.###.###-##'" v-validate="'cpf|required'">
                                        </the-mask>
                                      </div>
                                      <span v-if="errors.first('cpf do coordenador')" class="label label-danger"> {{ errors.first('cpf do coordenador') }}</span>
                                    </div>

                                    <div
                                         class="form-group required-field col-md-12 required"
                                         :class="{ 'has-error' : errors.first('email do coordenador')}">
                                      <label class="control-label">E-mail</label>
                                      <div name="proposal.coordinatorEmail">
                                        <input v-model="snap.ds_email_coordenador"
                                               name="email do coordenador" class="form-control" type="email" data-vv-as="E-mail do Coordenador"
                                               maxlength="255"
                                               v-validate="'required|email|max:255'">
                                      </div>
                                      <span v-if="errors.first('email do coordenador')" class="label label-danger"> {{ errors.first('email do coordenador') }}</span>
                                    </div>

                                    <!--Telefone-->
                                    <div
                                         class="form-group col-md-12 required-field"
                                         :class="{ 'has-error' : errors.first('Telefone')}">
                                      <label class="control-label">Telefone</label>
                                      <div name="proposal.coordinatorPhone">
                                        <the-mask v-model="snap.ds_telefone_coordenador" name="Telefone" class="form-control" type="tel" data-vv-as="Telefone do Coordenador"
                                                  v-validate="'required'" :mask="['(##) ####-####', '(##) #####-####']"></the-mask>
                                        <span v-if="errors.first('Telefone')" class="label label-danger"> {{ errors.first('Telefone') }}</span>
                                      </div>
                                    </div>

                                    <!--Celular-->
                                    <div
                                         class="form-group col-md-12">
                                      <label class="control-label">Telefone Celular</label>
                                      <div name="proposal.coordinatorPhone">
                                        <the-mask v-model="snap.ds_celular_coordenador" name="Telefone Celular" class="form-control" type="tel" data-vv-as="Celular do Coordenador"
                                                  :mask="['(##) ####-####', '(##) #####-####']"></the-mask>
                                      </div>
                                    </div>

                                  </div>


                                  <div class="col-md-5">

                                    <legend>Período de execução do projeto</legend>

                                    <div>
                                      <!--Data inicial-->
                                      <div class=" col-md-12 ng-scope required" style="margin-left: -15px"
                                           :class="{ 'has-error' : errors.first('Data Inicial')}">
                                        <label class="control-label">Data inicial </label>
                                        <div class="input-group">
                                          <div name="proposal.initialDate" class="ng-isolate-scope">
                                            <datepicker  name="Data Inicial" v-model="snap.dt_data_inicial" input-class="form-control datepicker"
                                                         :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____" data-vv-as="Data Inicial"
                                                         format="dd/MM/yyyy" v-validate="'required'">
                                            </datepicker>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <!--numero de meses do projeto-->
                                    <div class="form-group required-field col-md-12 ng-scope required"
                                         :class="{ 'has-error' : errors.first('periodo')}">
                                      <label class="control-label">Número de meses do projeto</label>
                                      <div name="proposal.periods" class="ng-isolate-scope">
                                        <input v-model="snap.nr_periodos" data-vv-as="Número de Meses do Projeto" lang="pt-br" name="periodo" class="form-control ng-pristine ng-untouched ng-scope ng-invalid ng-not-empty ng-invalid-min ng-valid-required" type="number" min="1"
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
                              <!--Dados da entidade-->
                              <div class="box box-widget">
                                <div class="text-left box-header">
                                  <a href="" v-if="esconderEntidade === false" @click.prevent="esconderEntidade = true"><i class="fa fa-caret-down" aria-hidden="true"></i> Mostrar dados da Entidade - <span  style="color: steelblue;font-weight: bold;">{{proposta.entidade.ds_nome}}</span></a>
                                  <a href="" v-if="esconderEntidade === true" @click.prevent="esconderEntidade = false"><i class="fa fa-caret-up" aria-hidden="true"></i> Ocultar dados da Entidade - <span  style="color: steelblue;font-weight: bold;">{{proposta.entidade.ds_nome}}</span></a>
                                </div>
                                <div class="col-md-8" v-if="esconderEntidade === true">
                                  <legend>Dados da Entidade</legend>
                                  <dl class="proposal-definition-list">
                                    <dt>Entidade</dt>
                                    <dd class="ng-binding"><router-link :title="'Ir para o Cadastro da entidade'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }" :to="{name: 'cadastro-entidade-visualiza', params: { id: proposta.entidade.id }}" target="_blank"> {{proposta.entidade.ds_nome}} &nbsp<i class="fa fa-external-link"></i></router-link></dd>

                                    <dt>CNPJ</dt>
                                    <dd>
                                      {{snap.entidade.ds_cnpj | cnpj}}
                                    </dd>

                                    <dt>E-mail</dt>
                                    <dd class="ng-binding">{{snap.entidade.ds_email}}</dd>
                                    <dt>Endereço</dt>
                                    <dd class="ng-binding" v-if="snap.entidade.endereco">{{snap.entidade.endereco[0].ds_rua}}, {{snap.entidade.endereco[0].ds_numero}} -
                                      {{snap.entidade.endereco[0].ds_bairro}}, {{snap.entidade.endereco[0].ds_cidade}} - {{snap.entidade.endereco[0].ds_estado}}
                                    </dd>
                                    <dt>Telefone</dt>
                                    <dd id="phone">
                                      {{telefone}}
                                    </dd>
                                  </dl>
                                </div>
                              </div>
                              <!--Informações introdutórias-->
                              <div class="col-md-12">
                                <div class="box box-widget">
                                  <div class="box-header with-border">
                                    <h3 class="box-title">Informações do Projeto</h3>
                                  </div>

                                  <div class="box-body">
                                    <div class="row">

                                      <!-- introdução -->
                                      <div class="col-md-12">
                                        <div  class="form-group required-field required-field col-md-12 ng-scope"
                                             :class="{ 'has-error' : errors.first('introducao')}">
                                          <label for="introduction" class="control-label ">Introdução</label>
                                          <div class="ng-isolate-scope">
                                    <textarea v-resizable placeholder="Ver texto padrão com a GEPRO..."
                                              v-model="snap.ds_introducao"
                                              name="introducao"
                                              class="form-control"
                                              data-vv-as="Informações Introdutórias do Projeto"
                                              rows="4" v-validate="'required'">
                                    </textarea>
                                          </div>
                                        </div>
                                      </div>

                                      <!-- Apresentação -->
                                      <div  class="col-md-12">
                                        <div  class="form-group required-field col-md-12 ng-scope required"
                                              :class="{ 'has-error' : errors.first('apresentacao')}">
                                          <label for="presentation" class="control-label">Apresentação</label>
                                          <div name="proposal.presentation" class="ng-isolate-scope">
                                    <textarea v-resizable placeholder="Ver texto padrão com a GEPRO..." data-vv-as="Apresentação do Projeto" v-model="snap.ds_apresentacao" name="apresentacao" class="form-control ng-pristine ng-untouched ng-scope ng-empty ng-invalid ng-invalid-required" rows="4"
                                              v-validate="'required'">

                                      </textarea>
                                          </div>
                                        </div>
                                      </div>

                                      <!-- território -->
                                      <div  class="col-md-12">
                                        <div  class="form-group required-field col-md-12 ng-scope required"
                                              :class="{ 'has-error' : errors.first('territorio')}">
                                          <label for="territory" class="control-label">Território de desenvolvimento do projeto</label>
                                          <div name="proposal.territory" class="ng-isolate-scope">
                                    <textarea v-resizable placeholder="Ver texto padrão com a GEPRO..." data-vv-as="Território de Desenvolvimento do Projeto" v-model="snap.ds_territorio" name="territorio" class="form-control ng-pristine ng-untouched ng-scope ng-empty ng-invalid ng-invalid-required" rows="4"
                                              v-validate="'required'">
                                    </textarea>
                                          </div>
                                        </div>
                                      </div>

                                      <!-- justification -->
                                      <div  class="col-md-12">
                                        <div  class="form-group required-field col-md-12 ng-scope required"
                                              :class="{ 'has-error' : errors.first('justificativa')}">
                                          <label for="justification" class="control-label">Justificativa</label>
                                          <div name="proposal.justification" class="ng-isolate-scope">
                                    <textarea v-resizable placeholder="Ver texto padrão com a GEPRO..." data-vv-as="Justificativa do Projeto" v-model="snap.ds_justificativa" name="justificativa" class="form-control ng-pristine ng-untouched ng-scope ng-empty ng-invalid ng-invalid-required" rows="4"
                                              v-validate="'required'">
                                    </textarea>
                                          </div>
                                        </div>
                                      </div>

                                      <!-- Objetivo Geral -->
                                      <div  class="col-md-12">
                                        <div  class="form-group required-field col-md-12 ng-scope required"
                                              :class="{ 'has-error' : errors.first('objetivo Geral')}">
                                          <label for="generalObjective" class="control-label">Objetivo geral</label>
                                          <div name="proposal.generalObjective" class="ng-isolate-scope">
                                    <textarea v-resizable placeholder="Ver texto padrão com a GEPRO..." data-vv-as="Objetivo Geral do Projeto" v-model="snap.ds_objetivo_geral" name="objetivo Geral" class="form-control ng-pristine ng-untouched ng-scope ng-not-empty ng-valid ng-valid-required" rows="4"
                                              v-validate="'required'">

                                    </textarea>
                                          </div>
                                        </div>
                                      </div>



                                      <!-- Resultados esperados -->
                                      <div class="col-md-12">
                                        <div class="form-group required-field col-md-12"
                                             :class="{ 'has-error' : errors.first('Resultados esperados')}">
                                          <label for="results" class="control-label">Resultados esperados</label>
                                          <div name="proposal.results">
                                        <textarea v-resizable placeholder="Ver texto padrão com a GEPRO..." data-vv-as="Resultados Esperados do Projeto" v-model="snap.ds_resultados" name="Resultados esperados"
                                                  class="form-control" rows="4"
                                                  v-validate="'required'">
                                        </textarea>
                                          </div>
                                        </div>
                                      </div>

                                      <!-- Operacionalização -->
                                      <div  class="col-md-12">
                                        <div class="form-group required-field col-md-12"
                                             :class="{ 'has-error' : errors.first('Operacionalização')}">
                                          <label for="operation" class="control-label">Operacionalização</label>
                                          <div name="proposal.operation">
                                        <textarea v-resizable placeholder="Ver texto padrão com a GEPRO..." data-vv-as="Operacionalização do Projeto" v-model="snap.ds_operacao" name="Operacionalização"
                                                  class="form-control" rows="4"
                                                  v-validate="'required'">
                                        </textarea>
                                          </div>
                                        </div>
                                      </div>

                                      <!-- Parceria -->
                                      <div class="col-md-12">
                                        <div class="form-group required-field col-md-12"
                                             :class="{ 'has-error' : errors.first('Parceria')}">
                                          <label for="partner" class="control-label">Parceria</label>
                                          <div name="proposal.partner">
                                        <textarea v-resizable placeholder="Ver texto padrão com a GEPRO..." data-vv-as="Parceria do Projeto" v-model="snap.ds_parceria" name="Parceria"
                                                  class="form-control" rows="4"
                                                  v-validate="'required'">
                                        </textarea>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="col-md-12">
                                        <div class="form-group required-field col-md-12 ng-scope required"
                                             :class="{ 'has-error' : errors.first('sumario')}">
                                          <label for="summary" class="control-label">Resumo</label>
                                          <div name="proposal.summary" class="ng-isolate-scope">
                                        <textarea v-resizable placeholder="Ver texto padrão com a GEPRO..." data-vv-as="Resumo do Projeto" v-model="snap.ds_resumo" name="sumario" class="form-control ng-pristine ng-untouched ng-scope ng-not-empty ng-valid ng-valid-required" rows="4"
                                                  v-validate="'required'">
                                        </textarea>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              </div>
                              </div>
                            <div  class="col-md-12">
                              <div class="box box-widget">
                                <div class="box-header">
                                  <h3 class="box-title">Público-alvo</h3>
                                </div>
                              </div>
                              <publico-alvo :propsPublicosGrid="snap.publicos_alvo" @publicoAlvoAdicionado="snap.publicos_alvo = $event"></publico-alvo>
                            </div>

                            <!--Equipe do Projeto-->
                            <div class="col-md-12">
                              <div class="box box-widget">
                                <div class="box-header">
                                  <h3 class="box-title">Equipe do Projeto</h3>
                                </div>
                              </div>
                              <equipe-projeto :propsEquipes="snap.equipes" @equipeAdicionada="snap.equipes = $event"></equipe-projeto>
                            </div>

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
                                        <div name="proposal.duplicateProject">
                                          <select name="Projeto Duplicação"
                                                  class="form-control"
                                                  aria-hidden="true"
                                                  v-model="snap.nr_projeto_duplicacao">
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
                            <div class="col-md-12">
                              <div class="box box-widget">
                                <div class="box-header">
                                  <h3 class="box-title">Objetivo Específico</h3>
                                </div>
                              </div>
                              <objetivo-especifico :propsObjetivos="snap.objetivos" @objetivoAdicionado="snap.objetivos = $event"></objetivo-especifico>
                            </div>

                            <!--Metas-->
                            <div  class="col-md-12">
                              <div class="box box-widget">
                                <div class="box-header">
                                  <h3 class="box-title">Metas</h3>
                                </div>
                              </div>
                              <metas :propsObjetivos="snap.objetivos" :propsMetas="snap.metas" @metaAdicionada="snap.metas = $event"></metas>
                            </div>

                            <!--Atividades-->
                            <div class="col-md-12">
                              <div class="box box-widget">
                                <div class="box-header">
                                  <h3 class="box-title">Atividades</h3>
                                </div>
                              </div>
                              <atividades :meses="snap.nr_periodos" :propsMetas="snap.metas" :propsAtividades="snap.atividades" @atividadeAdicionada="snap.atividades = $event"></atividades>
                            </div>

                            <div class="col-md-12">
                            <div class="box box-widget">
                              <div class="box-header">
                                <h3 class="box-title">Cronograma Físico-Financeiro</h3>
                              </div>
                            </div>
                            <cronograma :propsObjetivos="proposta.objetivos" :key="componentKey" :propsAtividades="proposta.atividades" :metas="proposta.metas" :proposta="proposta" :meses="proposta.nr_periodos" :projeto-duplicacao="proposta.nr_projeto_duplicacao" @itemAdicionado="proposta.atividades = $event"></cronograma>
                          </div>

                          <!--Gantt-->
                          <div  class="col-md-12">
                            <!--<gantt :periodo="proposta.nr_periodos" :propsObjetivos="proposta.objetivos" :atividades="proposta.atividades"></gantt>-->
                          </div>

                          <!-- Parcela de adiantamento -->
                          <div class="col-md-12">
                            <div class="box-header with-border">
                              <h3 class="box-title">Parcela de Adiantamento</h3>
                            </div>
                            <parcela-adiantamento :propsParcelas="snap.adiantamentos" :propsAtividades="snap.atividades" @parcelaAdicionada="snap.adiantamentos = $event"></parcela-adiantamento>
                          </div>


                          <!-- Municípios -->
                          <div class="col-md-12">
                            <div class="modal-body"></div>
                            <div class="box box-widget">
                              <div  class="box-header">
                                <h3  class="box-title">Municípios - Locais de execução</h3>
                              </div>
                            </div>
                          </div>
                          <municipalizacao :proposta="snap" @municipioAdicionado="snap.municipalizacao = $event"></municipalizacao>

                          <!--Cursos-->
                          <div class="col-md-12">
                            <div class="box box-widget">
                              <div class="box-header">
                                <h3 class="box-title">Cursos</h3>
                              </div>
                            </div>
                            <cursos :propsCursos="snap.cursos"></cursos>
                          </div>

                        </div>
                          </div>
                          </fieldset>
                      <fieldset v-show="usuarioLogado.userType === 'FUNDACAO'" :disabled="true" v-if="fase === 'PRE_ANALISE' && termino !== null">
                        <pre-analise-form :propsPreAnalise="snap"></pre-analise-form>
                      </fieldset>
                      <fieldset v-show="usuarioLogado.userType === 'FUNDACAO'" :disabled="true" v-if="fase === 'ANALISE' && termino !== null">
                        <analise :propsAnalise="snap"></analise>
                      </fieldset>
                      <fieldset v-show="usuarioLogado.userType === 'FUNDACAO'" :disabled="true" v-if="fase === 'DEFERIMENTO' && termino !== null">
                        <deferimento :propsDeferimento="snap"></deferimento>
                      </fieldset>
                      <div align="right">
                      <br>
                      <b-button type="button" :disabled="false" @click="showModal = false" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-close" aria-hidden="true"></i>  Fechar </b-button>
                    </div></div></div></div></div></div>
          </transition>
        </div>
      </div>
      </div>
      <div v-show="false">
        <pre id="myDiv" ref="myDiv"></pre>
      <!-- /.col -->
    </div>
    </div>
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
    import PreAnaliseForm from '../validação/proposta/preAnaliseForm'
    import Analise from '../validação/proposta/analise'
    import Deferimento from '../validação/proposta/deferimento'

    export default {
      components: {
        HistoricoProposta,
        UploadDocumentos,
        PreAnaliseForm,
        Analise,
        Deferimento,
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
      name: 'historico-proposta',
      data () {
        return {
          showgrid: true,
          showModal: false,
          esconderEntidade: false,
          mostraHistorico: false,
          confirmed: true,
          state: 'GRID',
          fase: '',
          termino: '',
          historico: {},
          snap: {},
          idProcesso: null,
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
            sortBy: 'inicio',
            sortDesc: true,
            fields: [
              { key: 'inicio', label: 'Data Início', sortable: true, thStyle: 'text-align: center; width: 15%', class: 'text-center' },
              { key: 'termino', label: 'Data Término', sortable: true, thStyle: 'text-align: center; width: 15%', class: 'text-center' },
              { key: 'nome', label: 'Evento', sortable: true, thStyle: 'text-align: center; width: 15%', class: 'text-center' },
              { key: 'observacao', label: 'Justificativa', sortable: true, thStyle: 'text-align: center; width: 25%', class: 'text-center' },
              { key: 'usuario.ds_nome_usuario', label: 'Usuário Responsável', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'actions', label: 'Visualização', thStyle: 'text-align: center', class: 'text-center' }
            ]
          }
        }
      },
      props: ['proposta'],
      watch: {
        proposta () {
          let array = []
          array = _.filter(this.proposta.processo.tarefas, function (o) {
            if (o.tipo === 'USUARIO') return o
          })
          this.table.items = _.sortBy(array, 'termino').reverse()
        },
        'table.items': function () {
          this.$emit('historico_itens', this.table.items)
        }
      },
      computed: {
        ...mapGetters([
          'usuarioLogado'
        ]),
        atividades () {
          return this.proposta.atividades
        },
        telefone: function () {
          if (this.snap.entidade.contato) {
            let size = this.snap.entidade.contato.ds_telefone.length
            if (size < 11) {
              this.tel = '(' + this.snap.entidade.contato.ds_telefone.substring(0, 2) + ') ' + this.snap.entidade.contato.ds_telefone.substring(2, 6) + ' - ' + this.snap.entidade.contato.ds_telefone.substring(6, 10)
            } else {
              this.tel = '(' + this.snap.entidade.contato.ds_telefone.substring(0, 2) + ') ' + this.snap.entidade.contato.ds_telefone.substring(2, 7) + ' - ' + this.snap.entidade.contato.ds_telefone.substring(7, 11)
            }
            return this.tel
          }
        }
      },
      created () {
        this.buscaHistorico()
      },
      methods: {
        testFunc: function (row) {
          this.idProcesso = null
          this.idProcesso = row.item.id
          this.fase = row.item.nome
          this.termino = row.item.termino
          this.$forceUpdate()
          this.carregaProcesso()
        },
        carregaProcesso () {
          axiosLaravel.get('processos/tarefas/buscahistorico/' + this.idProcesso).then((response) => {
            this.snap = response.data
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        },
        buscaHistorico () {
          let array = []
          array = _.filter(this.proposta.processo.tarefas, function (o) {
            if (o.tipo === 'USUARIO') return o
          })
          this.table.items = _.sortBy(array, 'termino').reverse()
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
    display: inherit;
    vertical-align: auto;
  }
  .modal-dialog {
    width: 80%;
  }
</style>

