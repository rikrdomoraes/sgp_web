<template>
  <div class="content-wrapper" style="min-height: 870px;">
    <!-- ngView: --><div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
    <section class="content-header ng-scope">
      <h1>Entidades</h1>
      <b-breadcrumb :items="breadcrumb"/>
    </section>

    <div v-show="!entidadeUsu.companyName" class="box-header with-border"  ssm-lte-loading="cmptSimpleRegisterEntityForm" ng-hide="$ctrl.entity.status === 'PENDENTE_APROVACAO'  ||  $ctrl.entity.status === 'COMPLETO' || $ctrl.entity.status =='INCOMPLETO'">
      <div class="box-header with-border">
        <h3 class="box-title"><i class="fa fa-caret-right" aria-hidden="true"></i> Processo: </h3>
      </div>
      <div class="col-md-6 col-lg-4">
        <input :disabled="true" v-model="entidadeEdital.noticeNumber" name="Razão social" class="form-control" type="text" ref="Razão social" v-validate="'required|min:1|max:255'">
      </div>
    </div>
    <div class="box-header with-border">
      <div class="col-md-6 col-lg-4">
    <ul class="nav nav-pills">
      <li><a id="tabEntidade" href="#Entidade" data-toggle="tab" class="btn btn-flat active"> Entidade </a></li>
      <li><a href="#Proposta" data-toggle="tab" class="btn btn-flat"> Proposta </a></li>
    </ul>
      </div>
  </div>

    <!-- main content -->
    <div class="tab-content">
      <div class="tab-pane active" id="Entidade">
      <section class="content ng-scope" v-if="procSelecionado">
      <div class="row">
        <div class="col-md-12">
          <div ng-if="show.grid" class="ng-scope ng-isolate-scope"><div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title"><i class="fa fa-caret-right" aria-hidden="true"></i> Cadastro da Entidade: </h3>
            </div>
          <div class="box-body" id="dadosCadastrais">
        <div class="row">
          <form name="frmCommonRegister" class="form-horizontal" novalidate>
            <div class="col-md-7 col-lg-6" id="cadastroJuri">
                <fieldset>
                  <legend>Dados da entidade:</legend>

                  <!-- company name -->
                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('Razão social')}">
                    <label for="nome" class="control-label col-sm-4 col-md-3">Razão social:</label>
                    <div class="col-md-8">
                      <input v-model="entidadeUsu.companyName" name="Razão social" class="form-control" type="text" ref="Razão social" v-validate="'required|min:1|max:255'">
                      <span v-if="errors.first('Razão social')" class="label label-danger"> {{('O campo Razão Social é obrigatório') }}</span>
                    </div>
                  </div>

                  <!-- cnpj -->
                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('CNPJ')}">
                    <label for="CNPJ" class="control-label col-sm-4 col-md-3" ref="CNPJ">CNPJ:</label>
                    <div class="col-md-5">
                      <the-mask v-model="entidadeUsu.cnpj" name="CNPJ" class="form-control" type="text"
                                v-validate="'required|min:14|max:14'" mask="##.###.###/####-##">
                      </the-mask>
                      <span v-if="errors.first('CNPJ')" class="label label-danger"> {{('O campo CNPJ é obrigatório') }}</span>
                    </div>
                  </div>

                  <!-- cnpj expedition time -->
                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('cnpjExpeditionTime')}">
                    <label for="cnpjExpeditionTime" class="control-label col-sm-4 col-md-3">Expedição CNPJ:</label>
                    <div class="col-md-5">
                      <div class="input-group">
                        <!--<datepicker ref="cnpjExpeditionTime" name="cnpjExpeditionTime" v-model="entidadeUsu.cnpjExpeditionTime" :use-utc="true" input-class="form-control"
                         :language="$datePickerPtBR" format="dd/MM/yyyy" v-validate="'required'" :placeholder="dataPlaceholder" ></datepicker>-->
                        <input ref="cnpjExpeditionTime" name="cnpjExpeditionTime" v-model="entidadeUsu.cnpjExpeditionTime" type="date" class="form-control" format="DD/MM/YYYY"/>
                        <span v-if="errors.first('cnpjExpeditionTime')" class="label label-danger"> {{('O campo Expedição do CNPJ é obrigatório') }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- business name -->
                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('Nome fantasia')}">
                    <label for="Nome fantasia" class="control-label col-sm-4 col-md-3">Nome fantasia:</label>
                    <div class="col-md-8">
                      <input v-model="entidadeUsu.businessName" name="Nome fantasia" ref="Nome fantasia" class="form-control" type="text" v-validate="'required|min:1|max:255'">
                      <span v-if="errors.first('Nome fantasia')" class="label label-danger"> {{('O campo Nome fantasia é obrigatório') }}</span>
                    </div>
                  </div>
                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('Natureza jurídica')}">
                    <label for="Natureza jurídica" class="control-label col-sm-4 col-md-3">Natureza jurídica:</label>
                    <div class="col-md-8">
                      <select v-model="entidadeUsu.legalType" name="Natureza jurídica" class="form-control" v-validate="'required'" ref="Natureza jurídica">
                        <option value="ASSOCIAÇÃO">Associação</option>
                        <option value="COOPERATIVA">Cooperativa</option>
                        <option value="EMPRESA_PUBLICA">Empresa pública</option>
                        <option value="FUNDACAO">Fundação</option>
                        <option value="ORGAO_PUBLICO_EXECUTIVO_ESTADUAL">Orgão público executivo estadual</option>
                        <option value="ORGAO_PUBLICO_EXECUTIVO_MUNICIPAL">Orgão público executivo municipal</option>
                        <option value="SEM_FINS_LUCRATIVOS">Sem fins lucrativos</option>
                        <option value="SERVICO_SOCIAL_AUTONOMO">Serviço social autônomo</option>
                        <option value="SOCIEDADE_LTDA">Sociedade ltda</option>
                        <option value="SOCIEDADE_POR_ACOES">Sociedade por Ações</option>
                      </select>
                      <span v-if="errors.first('Natureza jurídica')" class="label label-danger"> {{('O campo Natureza jurídica é obrigatório') }}</span>
                    </div>
                  </div>

                  <!-- activity -->
                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('Ramo atividade')}">
                    <label for="Ramo atividade" class="control-label col-sm-4 col-md-3">Ramo atividade:</label>
                    <div class="col-md-8">
                      <select v-model="entidadeUsu.activity" class="form-control" name="Ramo atividade"
                              v-validate="'required'" ref="Ramo atividade">
                        <option :label="ramoAtividade.code + ' - ' + ramoAtividade.description" :value="ramoAtividade" v-for="(ramoAtividade) in ramoAtividade">{{ramoAtividade.code + ' - ' + ramoAtividade.description}}</option>
                      </select>
                      <span v-if="errors.first('Ramo atividade')" class="label label-danger"> {{('O campo Ramo atividade é obrigatório') }}</span>
                    </div>
                  </div>

                  <!-- constitution document -->
                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('Doc. constituição')}">
                    <label for="constitutionDocument" class="control-label col-sm-4 col-md-3">Doc. constituição:</label>
                    <div class="col-md-8">
                      <select v-model="entidadeUsu.constitutionDocument" name="Doc. constituição" class="form-control" v-validate="'required'" ref="Doc. constituição">
                        <option value="ATA_CONSTITUICAO">Ata constituição</option>
                        <option value="CONTRATO_SOCIAL">Contrato social</option>
                        <option value="ESTATUTO">Estatuto</option>
                        <option value="LEI_ORGANICA_MUNICIPAL">Lei orgânica municipal</option>
                      </select>
                      <span v-if="errors.first('Doc. constituição')" class="label label-danger"> {{('O campo Doc. constituição é obrigatório') }}</span>
                    </div>
                  </div>
                </fieldset>
              </div>
            <div class="col-md-6">
            <fieldset>
              <legend>Contato:</legend>

              <!--Telefone Fixo-->
              <div  class="form-group required-field col-md-7"
                    :class="{ 'has-error' : errors.first('Telefone')}">
                <label class="control-label col-md-4">Telefone Fixo: </label>
                <div name="Telefone" class="col-md-8">
                  <the-mask v-model="entidadeUsu.contact.phone"
                            name="Telefone" class="form-control" type="text"
                            :mask="['(##) ####-####', '(##) #####-####']"
                            v-validate="'required'">
                  </the-mask>
                </div>
                <span v-if="errors.first('Telefone')" class="label label-danger"> {{ errors.first('Telefone') }}</span>
              </div>
              <div class="form-group required-field col-md-7">
                <label for="mobile" class="col-md-4">Telefone Celular:</label>
                <div name="celular" class="col-md-8">
                  <input v-model="entidadeUsu.contact.mobile" v-mask="'(##) #####-#####'" :masked="masked" name="mobile" class="form-control" type="text">
                </div>
              </div>


              <!--Email-->
              <div class="form-group required-field col-md-7"
                   :class="{ 'has-error' : errors.first('email')}">
                <label class="control-label col-md-4">E-mail:</label>
                <div name="email" class="col-md-8">
                  <input v-model="entidadeUsu.contact.email"
                         @input="entidadeUsu.contact.email=$event.target.value.toLowerCase()"
                         name="email" class="form-control" type="text"
                         maxlength="255" v-validate="'required'">
                </div>
                <span v-if="errors.first('email')" class="label label-danger"> {{ errors.first('email') }}</span>
              </div>
            </fieldset>
            </div>

            <div class="col-md-12">
              <div class="box box-widget">
                <div class="box-header">
                  <h3 class="box-title">Endereço:</h3>
                </div>
              </div>
              <endereco :entEnderecos="entidadeUsu.address"></endereco>
            </div>


            <!-- chiefs -->
            <div class="col-md-12">
              <div class="box box-widget">
                <div class="box-header">
                  <h3 class="box-title">Dirigentes:</h3>
                </div>
              </div>
              <dirigentes :entDirigentes="entidadeUsu.chiefs" name="dirigentes"></dirigentes>
            </div>

            <div class="col-md-12">
              <div class="box box-widget">
                <div class="box-header">
                  <h3 class="box-title">Documentos Upload</h3>
                </div>
              </div>
              <div class="col-md-12">
                <upload-documentos :propDocumentos="entidadeUsu.documents" :documentTypes="documentosObrigatorios" :documentosObrigatorios="documentosObrigatorios"></upload-documentos>
              </div>
            </div>
            </form>
          </div>
          <!-- /.col -->
        </div>
        <!-- /.row -->
      </div>
          <!-- /.box-body -->

          <!-- /.box-footer -->


      </div>
        </div></div>
    </section>
  </div>
      <div class="tab-pane" id="Proposta">
        <div class="ng-scope ng-isolate-scope"><div class="box-body"><div class="box box-primary">
          <div class="box-header with-border">
            <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Cadastro da Proposta: </h3>
            <div class="row">
              <div class="col-md-6">
                <br>
              </div></div></div>
        <div class="box-body">
          <div class="row">
          <div class="col-md-12 form-horizontal">
          <h2 class="h4">Projeto</h2>

          <!--Nome do projeto-->
          <div class="col-md-6">
            <div class="form-group">
              <div class="form-group required-field col-md-12"
                   :class="{ 'has-error' : errors.first('nome da proposta')}">
                <label for="nome da proposta" class="control-label">Nome do Projeto:</label>
                <div>
                  <input v-model="propostaSimplificada.name" name="nome da proposta" id="nome da proposta" class="form-control" type="text"
                         v-validate="'required|max:255'">
                </div>
                <span v-if="errors.first('nome da proposta')" class="label label-danger"> {{ errors.first('nome da proposta') }}</span>
              </div>
            </div>
            <fieldset>
              <legend>Responsável pela Proposta</legend>
              <div  class="form-group required-field col-md-12 required"
                   :class="{ 'has-error' : errors.first('nome do coordenador')}">
                <label class="control-label">Nome</label>
                <div>
                  <input v-model="propostaSimplificada.coordinatorName"
                         name="nome do coordenador" class="form-control" type="text" v-validate="'required|max:100'"
                         maxlength="100">
                </div>
                <span v-if="errors.first('nome do coordenador')" class="label label-danger"> {{ errors.first('nome do coordenador') }}</span>
              </div>
              <div  class="form-group required-field col-md-12 required"
                   :class="{ 'has-error' : errors.first('cpf do coordenador')}">
                <label class="control-label">CPF</label>
                <div name="proposal.coordinatorCpf" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                  <the-mask v-model="propostaSimplificada.coordinatorCpf"
                            name="cpf do coordenador" class="form-control" type="text"
                            :mask="'###.###.###-##'" v-validate="'cpf|required'">
                  </the-mask>
                </div>
                <span v-if="errors.first('cpf do coordenador')" class="label label-danger"> {{ errors.first('cpf do coordenador') }}</span>
              </div>
              <div class="form-group required-field col-md-12 required"
                   :class="{ 'has-error' : errors.first('email do coordenador')}">
                <label class="control-label">E-mail</label>
                <div name="proposal.coordinatorEmail">
                  <input v-model="propostaSimplificada.coordinatorEmail"
                         name="email do coordenador" class="form-control" type="email"
                         maxlength="255"
                         v-validate="'required|email|max:255'"
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
                  <the-mask v-model="propostaSimplificada.coordinatorPhone" name="Telefone" class="form-control" type="tel"
                            v-validate="'required'" :mask="['(##) ####-####', '(##) #####-####']"></the-mask>
                  <span v-if="errors.first('Telefone')" class="label label-danger"> {{ errors.first('Telefone') }}</span>
                </div>
              </div>

              <!--Celular-->
              <div ng-if="regComProFormCtrl.isAval('COORDINATORPHONE')"
                   class="form-group col-md-12 required"
                   :class="{ 'has-error' : errors.first('Telefone Celular')}">
                <label class="control-label">Telefone Celular</label>
                <div name="proposal.coordinatorPhone" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState" >
                  <the-mask v-model="propostaSimplificada.coordinatorMobile" name="Telefone Celular" class="form-control" type="tel"
                            v-validate="'required'" :mask="['(##) ####-####', '(##) #####-####']"></the-mask>
                  <span v-if="errors.first('Telefone Celular')" class="label label-danger"> {{ errors.first('Telefone Celular') }}</span>
                </div>
              </div>

              <!--Fax-->
              <div ng-if="regComProFormCtrl.isAval('COORDINATORPHONE')"
                   class="form-group col-md-12 required">
                <label class="control-label">Telefone fax</label>
                <div name="proposal.coordinatorPhone" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState" >
                  <the-mask v-model="propostaSimplificada.coordinatorFax" name="Telefone Fax" class="form-control" type="tel"
                            :mask="['(##) ####-####', '(##) #####-####']"></the-mask>
                </div>
              </div>
            </fieldset>
          </div>

        <div class="col-md-6" form-horizontal>
          <h2 class="h4">Período de execução do projeto</h2>

          <!--Data inicial-->
          <div class=" col-md-12 ng-scope required" style="margin-left: -15px"
               :class="{ 'has-error' : errors.first('Data Inicial')}">
            <label class="control-label">Data inicial </label>
            <div class="input-group">
              <div name="proposal.initialDate" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState" class="ng-isolate-scope">
                <datepicker  name="Data Inicial" v-model="propostaSimplificada.initialDate" input-class="form-control datepicker"
                             :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                             format="dd/MM/yyyy" v-validate="'required'">
                </datepicker>
              </div>
            </div>
          </div>

          <!--numero de meses do projeto-->
          <div ng-if="regComProFormCtrl.isAval('PERIODS')" class="form-group required-field col-md-12 ng-scope required"
               :class="{ 'has-error' : errors.first('periodo')}">
            <label class="control-label">Número de meses do projeto</label>
            <div name="proposal.periods" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState" class="ng-isolate-scope">
              <input v-model="propostaSimplificada.periods" lang="pt-br" name="periodo" class="form-control ng-pristine ng-untouched ng-scope ng-invalid ng-not-empty ng-invalid-min ng-valid-required" type="number" min="1"
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
            <div class="row">
              <div class="col-md-12">
                <h2 class="h4">Informações introdutórias</h2>
                <div class="col-md-8">

                  <!--locais de execução do projeto-->
                  <div class="col-md-4 col-sm-6 col-xs-12" style="z-index: 10;">
                  <div class="form-group">
                    <div class="form-group required-field col-md-12"
                         :class="{ 'has-error' : errors.first('presentation')}">
                      <label for="presentation" class="control-label"> Apresentação </label>
                      <div class="ng-isolate-scope">
                            <textarea v-model="propostaSimplificada.presentation" name="presentation" id="presentation" class="form-control" rows="5" cols="12"
                                      v-validate="'required'" :placeholder="'DESCREVA, DE FORMA SUCINTA, A ÁREA DE ATUAÇÃO E AÇÕES DESENVOLVIDAS PELA ENTIDADE.'"></textarea>
                      </div>
                      <span v-if="errors.first('presentation')" class="label label-danger"> {{ errors.first('presentation') }}</span>
                    </div>
                  </div>
                  </div>

                  <!--objetivo geral-->
                  <div class="col-md-4 col-sm-6 col-xs-12" style="z-index: 10;">
                  <div class="form-group ">
                    <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('objetivo geral')}">
                      <label for="objetivo geral" class="control-label"> Objetivo Geral </label>
                      <div class="ng-isolate-scope">
                            <textarea v-model="propostaSimplificada.generalObjective" name="objetivo geral" id="objetivo geral"  rows="5" cols="10"
                                      class="form-control" v-validate="'required'" :placeholder="'Defina de forma sucinta o que se pretende alcançar com o projeto. O objetivo geral deve refletir a transformação desejada pela sua organização, levando em consideração o problema apresentado e a solução proposta. Ele deve ser passível de ser alcançado por meio dos objetivos específicos e as atividades propostas. O objetivo deve ser iniciado com um verbo no infinitivo, exemplo: elevar, aprimorar, fortalecer, transformar, etc.'"></textarea>
                      </div>
                      <span v-if="errors.first('objetivo geral')" class="label label-danger"> {{ errors.first('objetivo geral') }}</span>
                    </div>
                  </div>
                  </div>
                  <div class="col-md-4 col-sm-6 col-xs-12" style="z-index: 10;">

                    <div class="form-group required-field col-md-12"
                         :class="{ 'has-error' : errors.first('resumo')}">
                      <label for="resumo" class="control-label"> Justificativa </label>
                      <div class="ng-isolate-scope">
                            <textarea v-model="propostaSimplificada.justification" name="justification" id="resumo" class="form-control"  rows="5" cols="10"
                                      v-validate="'required'" :placeholder="'QUAL O PROBLEMA QUE A SUA ORGANIZAÇÃO QUER RESOLVER? Descreva aqui o problema que a sua organização quer solucionar. Utilize os tópicos abaixo para orientar seu texto: - Qual é a situação-problema a ser solucionado? - Quais as suas origens? - Quais os fatores sociais, políticos, ambientais e culturais que o agravam? - Quais são as consequências desse problema para a região e para o público alvo da proposta?  - Quem serão as pessoas atendidas pelo projeto?\\n\\n O QUE A SUA ORGANIZAÇÃO PRETENDE FAZER PARA SOLUCIONAR O PROBLEMA APRESENTADO?\\n\\n Descreva aqui o que a sua organização apresenta como alternativa de solução. Utilize os tópicos abaixo para orientar seu texto:\\n \\n - O quê sua instituição propõe como solução?\\n - Quais são as atividades propostas?\\n - Como as atividades propostas contribuem para a solução do problema?'"></textarea>
                      </div>
                      <span v-if="errors.first('resumo')" class="label label-danger"> {{ errors.first('resumo') }}</span>
                    </div>
                  </div>
                </div>
                  <!--objetivo-->
                  <!--<div class="form-group">-->
                    <!--<div class="form-group required-field col-md-12"-->
                         <!--:class="{ 'has-error' : errors.first('objetivo')}">-->
                      <!--<label for="infoObjectives" class="control-label"> Objetivo: </label>-->
                      <!--<div class="ng-isolate-scope">-->
                            <!--<textarea v-model="propostaSimplificada.infoObjectives" name="objetivo" id="objetivo" class="form-control " rows="3"-->
                                      <!--v-validate="'required'"></textarea>-->
                      <!--</div>-->
                      <!--<span v-if="errors.first('objetivo')" class="label label-danger"> {{ errors.first('objetivo') }}</span>-->
                    <!--</div>-->
                  <!--</div>-->
                  <!--resumo-->


              </div>
            </div>


            <div class="row">
              <!--<div class="col-md-12">-->
                <!--<h2 class="h4">Número de Participantes</h2>-->
                <!--<div class="col-md-6">-->
                  <!--&lt;!&ndash;participantes diretos&ndash;&gt;-->
                  <!--<div class="form-group">-->
                    <!--<div class="form-group required col-md-12"-->
                         <!--:class="{ 'has-error' : errors.first('participantes diretos')}">-->
                      <!--<label for="participantes diretos" class="control-label"> Participantes diretos: </label>-->
                      <!--<div>-->
                        <!--<input v-model="propostaSimplificada.participants" name="participantes diretos" id="participantes diretos"-->
                               <!--class="form-control text-right" type="number"-->
                               <!--v-validate="'required|min_value:1'">-->
                      <!--</div>-->
                      <!--<span v-if="errors.first('participantes diretos')" class="label label-danger"> {{ errors.first('participantes diretos') }}</span>-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->


            <br />
            <!--Publico alvo-->
            <div class="col-md-12 form-horizontal">
              <div class="box box-widget">
                <div class="box-header">
                  <h3 class="box-title">Público-alvo</h3>
                </div>
              </div>
              <publico-alvo :propsPublicosGrid="propostaSimplificada.audiences" @publicoAlvoAdicionado="propostaSimplificada.audiences = $event"></publico-alvo>
            </div>
              <div class="col-md-12">
                <div class="box box-widget">
                  <div class="box-header">
                    <h3 class="box-title">Equipe do Projeto</h3>
                  </div>
                </div>
                <equipe-projeto :propsEquipes="propostaSimplificada.teams" @equipeAdicionada="propostaSimplificada.teams = $event"></equipe-projeto>
              </div>
            </div>
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
                                        <textarea v-model="propostaSimplificada.results" name="Resultados esperados"
                                                  class="form-control" rows="4"
                                                  v-validate="'required'">
                                        </textarea>
                        </div>
                        <!--<ng-messages ng-if="frmProposalRegister.$submitted" for="frmProposalRegister.results.$error" role="alert">-->
                        <!--<ng-message when="required" class="label label-danger">Campo requerido</ng-message>-->
                        <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
                        <!--</ng-messages>-->
                        <span v-if="errors.first('Resultados esperados')" class="label label-danger"> {{ errors.first('Resultados esperados') }}</span>
                      </div>
                    </div>

                    <!-- Operacionalização -->
                    <div class="col-md-4 col-sm-6 col-xs-12">
                      <div class="form-group required-field col-md-12"
                           :class="{ 'has-error' : errors.first('Operacionalização')}">
                        <label for="operation" class="control-label">Operacionalização</label>
                        <div name="proposal.operation" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                        <textarea v-model="propostaSimplificada.operation" name="Operacionalização"
                                                  class="form-control" rows="4"
                                                  v-validate="'required'">
                                        </textarea>
                        </div>
                        <!--<ng-messages ng-if="frmProposalRegister.$submitted" for="frmProposalRegister.operation.$error" role="alert">-->
                        <!--<ng-message when="required" class="label label-danger">Campo requerido</ng-message>-->
                        <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
                        <!--</ng-messages>-->
                        <span v-if="errors.first('Operacionalização')" class="label label-danger"> {{ errors.first('Operacionalização') }}</span>
                      </div>
                    </div>

                    <!-- Parceria -->
                    <div class="col-md-4 col-sm-6 col-xs-12">
                      <div class="form-group col-md-12"
                           :class="{ 'has-error' : errors.first('Parceria')}">
                        <label for="partner" class="control-label">Parceria</label>
                        <div name="proposal.partner" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                                        <textarea v-model="propostaSimplificada.partner" name="Parceria"
                                                  class="form-control" rows="4"
                                                  v-validate="'required'">
                                        </textarea>
                        </div>
                        <span v-if="errors.first('Parceria')" class="label label-danger"> {{ errors.first('Parceria') }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <label>Listagem de Tecnologias Sociais, conforme mencionado no campo operacionalização, acima.</label>
            <a target="_blank" href="https://projetos.fbb.org.br/docs/ListaTS.xlsx" style="font-weight:bold">Lista de Tecnolias Sociais</a> - (Faça o download do arquivo.)
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
                      <div>
                        <label class="radio-inline control-label">
                          <input type="radio" name="entityExecutingBool" id="proposal-entity-executing-true"
                                 v-model="propostaSimplificada.entityIsExecutioner" :value="'true'"> Sim
                        </label>
                        <label class="radio-inline control-label">
                          <input type="radio" name="entityExecutingBool" id="proposal-entity-executing-false"
                                 v-model="propostaSimplificada.entityIsExecutioner":value="'false'"> Não
                        </label>
                      </div>
                    </fieldset>

                    <!--Se Não mostra os campos abaixo-->
                    <div v-if="propostaSimplificada.entityIsExecutioner === 'false'">

                      <!-- dados da entidade -->
                      <fieldset class="col-md-4 col-sm-6 col-xs-12">
                        <legend>Entidade</legend>
                        <!--Nome Entidade Executora-->
                        <div class="form-group required-field  col-md-12"
                             :class="{ 'has-error' : errors.first('Nome Entidade Executora')}">
                          <label class="control-label">Nome</label>
                          <div approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                            <input v-model="propostaSimplificada.entityExecutingName"
                                   name="Nome Entidade Executora" class="form-control" type="text"
                                   maxlength="255"
                                   v-validate="'required:!propostaSimplificada.entityIsExecutioner'">
                          </div>
                          <span v-if="errors.first('Nome Entidade Executora')" class="label label-danger"> {{ errors.first('Nome Entidade Executora') }}</span>
                        </div>

                        <!--Representante legal-->
                        <div  class="form-group required-field col-md-12"
                              :class="{ 'has-error' : errors.first('Representante legal')}">
                          <label class="control-label">Representante legal</label>
                          <div name="proposal.entityExecutingProcurator" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                            <input v-model="propostaSimplificada.entityExecutingProcurator"
                                   name="Representante legal" class="form-control" type="text"
                                   maxlength="255"
                                   v-validate="'required:!propostaSimplificada.entityIsExecutioner'">
                          </div>
                          <span v-if="errors.first('Representante legal')" class="label label-danger"> {{ errors.first('Representante legal') }}</span>
                        </div>

                        <!--CNPJ Entidade Executora-->
                        <div  class="form-group required-field col-md-12"
                              :class="{ 'has-error' : errors.first('CNPJ entidade executora')}">
                          <label class="control-label">CNPJ</label>
                          <div name="proposal.entityExecutingCNPJ" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                            <the-mask v-model="propostaSimplificada.entityExecutingCNPJ"
                                      name="CNPJ entidade executora" class="form-control" type="text"
                                      v-validate="'required:!propostaSimplificada.entityIsExecutioner|cnpj'" :mask="['##.###.###/####-##']">
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
                            <input v-model="propostaSimplificada.entityExecutingEmail"
                                   name="E-mail executora" class="form-control" type="text"
                                   maxlength="255"
                                   v-validate="'required:!propostaSimplificada.entityIsExecutioner|email'">
                          </div>
                          <span v-if="errors.first('E-mail executora')" class="label label-danger"> {{ errors.first('E-mail executora') }}</span>
                        </div>

                        <!--Telefone Fixo-->
                        <div  class="form-group required-field col-md-12"
                              :class="{ 'has-error' : errors.first('Telefone Executora')}">
                          <label class="control-label">Telefone fixo</label>
                          <div name="proposal.entityExecutingPhone" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                            <the-mask v-model="propostaSimplificada.entityExecutingPhone"
                                      name="Telefone Executora" class="form-control" type="text"
                                      :mask="['(##) ####-####', '(##) #####-####']"
                                      v-validate="'required:!propostaSimplificada.entityIsExecutioner'">
                            </the-mask>
                          </div>
                          <span v-if="errors.first('Telefone Executora')" class="label label-danger"> {{ errors.first('Telefone Executora') }}</span>
                        </div>

                        <!--Celular-->
                        <div ng-if="regComProFormCtrl.isAval('ENTITYEXECUTINGMOBILE')" class="form-group required-field col-md-12"
                             :class="{ 'has-error' : errors.first('Telefone celular da executora')}">
                          <label class="control-label">Telefone celular</label>
                          <div name="proposal.entityExecutingMobile" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                            <the-mask v-model="propostaSimplificada.entityExecutingMobile"
                                      name="Telefone celular da executora" class="form-control" type="text"
                                      :mask="['(##) ####-####', '(##) #####-####']"
                                      v-validate="'required:!propostaSimplificada.entityIsExecutioner'">
                            </the-mask>
                          </div>
                          <span v-if="errors.first('Telefone celular da executora')" class="label label-danger"> {{ errors.first('Telefone celular da executora') }}</span>
                        </div>

                        <!--Fax-->
                        <div class="form-group col-md-12">
                          <label class="control-label">Telefone fax</label>
                          <div name="proposal.entityExecutingFax" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                            <the-mask v-model="propostaSimplificada.entityExecutingFax"
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
                            <the-mask v-model="propostaSimplificada.entityExecutingCEP"
                                      name="CEP da executora" class="form-control" type="text"
                                      :mask="['#####-###']"
                                      v-validate="'required:!propostaSimplificada.entityIsExecutioner'">
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
                            <select v-model="propostaSimplificada.entityExecutingState"
                                    class="form-control" name="UF executora"
                                    v-validate="'required:!propostaSimplificada.entityIsExecutioner'">
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
                            <input v-model="propostaSimplificada.entityExecutingCity"
                                   name="Cidade da Executora" class="form-control" type="text"
                                   v-validate="'required:!propostaSimplificada.entityIsExecutioner'">
                          </div>
                          <span v-if="errors.first('Cidade da Executora')" class="label label-danger"> {{ errors.first('Cidade da Executora') }}</span>
                        </div>

                        <!--Endereço-->
                        <div ng-if="regComProFormCtrl.isAval('ENTITYEXECUTINGADDRESS')" class="form-group required-field col-md-12"
                             :class="{ 'has-error' : errors.first('Endereço da Executora')}">
                          <label class="control-label">Endereço</label>
                          <div name="proposal.entityExecutingAddress" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState">
                            <input v-model="propostaSimplificada.entityExecutingAddress"
                                   name="Endereço da Executora" class="form-control" type="text"
                                   maxlength="255"
                                   v-validate="'required:!propostaSimplificada.entityIsExecutioner'">
                          </div>
                          <span v-if="errors.first('Endereço da Executora')" class="label label-danger"> {{ errors.first('Endereço da Executora') }}</span>
                        </div>
                      </fieldset>
                    </div>
                    <div class="col-md-12">
                      <div class="box box-widget">
                        <div class="box-header">
                          <h3 class="box-title">Objetivo Específico</h3>
                        </div>
                      </div>
                      <objetivo-especifico :propsObjetivos="propostaSimplificada.objectives" @objetivoAdicionado="propostaSimplificada.objectives = $event"></objetivo-especifico>
                    </div>

                    <!--Metas-->
                    <div class="col-md-12">
                      <div class="box box-widget">
                        <div class="box-header">
                          <h3 class="box-title">Metas</h3>
                        </div>
                      </div>
                      <metas :propsObjetivos="propostaSimplificada.objectives" @metaAdicionada="propostaSimplificada.objectives = $event"></metas>
                    </div>

                    <!--Atividades-->
                    <div class="col-md-12">
                      <div class="box box-widget">
                        <div class="box-header">
                          <h3 class="box-title">Atividades</h3>
                        </div>
                      </div>
                      <atividades :meses="propostaSimplificada.periods" :propsObjetivos="propostaSimplificada.objectives" @metaAdicionada="propostaSimplificada.objectives = $event"></atividades>
                    </div>
                    <!--<div class="col-md-12">-->
                      <!--<div class="modal-body"></div>-->
                      <!--<div class="box box-widget">-->
                        <!--<div  class="box-header">-->
                          <!--<h3  class="box-title">Municípios - Locais de execução</h3>-->
                        <!--</div>-->
                      <!--</div>-->
                      <!--<div class="form-group required-field"-->
                           <!--:class="{ 'has-error' : errors.first('cep')}">-->
                        <!--<label for="cep" class="control-label col-sm-1">CEP:</label>-->
                        <!--<div class="col-md-2">-->
                          <!--<div  approval="addMunCtrl.approval" state="addMunCtrl.approvalState">-->
                            <!--<the-mask v-model="propostaSimplificada.cep" name="cep" class="form-control" type="text"-->
                                      <!--v-validate="'required|min:8|max:8'" @blur="loadCityAndState" mask="#####-###"></the-mask>-->
                          <!--</div>-->
                          <!--<span v-if="errors.first('cep')" class="label label-danger"> {{ errors.first('cep') }}</span>-->
                        <!--</div>-->
                        <!--<div class="col-md-4 col-lg-3" style="padding:7px;">-->
                          <!--{{propostaSimplificada.name}}-->
                        <!--</div>-->
                      <!--</div>-->
                      <!--<div class="form-group required-field"-->
                           <!--:class="{ 'has-error' : errors.first('número de participantes')}">-->
                        <!--<label for="totalParticipants" class="control-label col-sm-1">Participantes:</label>-->
                        <!--<div class="col-md-2">-->
                          <!--<div approval="addMunCtrl.approval" state="addMunCtrl.approvalState">-->
                            <!--<input v-model="propostaSimplificada.totalParticipants" name="número de participantes" class="form-control" type="number" min="0"-->
                                   <!--v-validate="{required: true, numeric: true}">-->
                          <!--</div>-->
                          <!--<span v-if="errors.first('número de participantes')" class="label label-danger"> {{ errors.first('número de participantes') }}</span>-->
                        <!--</div>-->
                      <!--</div>-->
                    <!--</div>-->
                    <municipalizacao :proposta="propostaSimplificada" @municipioAdicionado="propostaSimplificada = $event"></municipalizacao>

                    <!--Cursos-->
                    <div class="col-md-12">
                      <div class="box box-widget">
                        <div class="box-header">
                          <h3 class="box-title">Cursos</h3>
                        </div>
                      </div>
                      <cursos :propsCursos="propostaSimplificada.careers"></cursos>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div  class="col-md-12" id="teste">
              <legend >Declaração</legend>
              <label>Preencha a Declaração com os dados da entidade proponente conforme item 12.1.2 da Chamada.</label>
              <a target="_blank" href="https://projetos.fbb.org.br/docs/declaracao.pdf" style="font-weight:bold">Baixar Declaração</a> - (Faça o download do arquivo e após assinar, anexe no campo abaixo.)
              <br>
              <br>
               <upload-documentos :propDocumentos="propostaSimplificada.documents" :documentTypes="''" :documentosObrigatorios="''"></upload-documentos>
            </div>
            <!--Documentos-->
            <!--<div class="col-md-12 form-horizontal">-->
              <!--<div class="box box-widget">-->
                <!--<div class="box-header">-->
                  <!--<h3 class="box-title">Documentos Upload</h3>-->
                <!--</div>-->
              <!--</div>-->
              <!--<upload-documentos :propDocumentos="propostaSimplificada.documents" :documentTypes="documentosProp" :documentosObrigatorios="documentosObrigatoriosProp"></upload-documentos>-->
            <!--</div>-->

        </div>
          </div>
        </div>
        </div></div>
      </div>
      </div>
    </div>
    </div>
    <br>
    <div class="box-footer">
      <g-button-moema color="success" size="button--size-ss" @click.native="conclui()"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</g-button-moema>
      <g-button-moema color="primary" size="button--size-ss" @click.native="atualiza()"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar</g-button-moema>
      <g-button-moema color="warning" size="button--size-ss" @click.native="$router.go(-1)"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</g-button-moema>
     </div>
   </div>
   <!-- /.box -->
</template>

<script>
  /* eslint-disable no-useless-escape */

  import Endereco from '../../modules/endereco'
  import Dirigentes from '../../modules/dirigentes'
  import Usuarios from '../../modules/usuarios'
  import UploadDocumentos from '../../modules/uploadDocumentos'
  import HistoricoEntidade from '../../modules/historico-entidade'
  import PublicoAlvo from '../../modules/publicoAlvo'
  import EquipeProjeto from '../../modules/equipeProjeto'
  import ObjetivoEspecifico from '../../modules/objetivoEspecifico'
  import Metas from '../../modules/metas'
  import Municipalizacao from '../../modules/municipalizacao'
  import Cursos from '../../modules/cursos'
  import Atividades from '../../modules/atividades'
  import moment from 'moment'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      Endereco,
      Dirigentes,
      UploadDocumentos,
      HistoricoEntidade,
      Atividades,
      Cursos,
      Municipalizacao,
      Metas,
      ObjetivoEspecifico,
      Usuarios,
      EquipeProjeto,
      PublicoAlvo
    },
    name: 'entidade-proposta-edital',
    data () {
      return {
        okGeral: false,
        okEndereco: false,
        configuracoes: {},
        concluded: false,
        propostaSimplificada: {
          documents: [],
          documentStatements: [],
          audiences: [],
          objectives: [],
          periods: '',
          careers: [],
          teams: [],
          municipalizationResume: [],
          entityIsExecutioner: ''
        },
        agencias: [],
        agenciaSelecionada: null,
        documentosProp: [],
        documentosObrigatoriosProp: ['Memória de cálculo', 'Declaração'],
        adimplencia: [],
        adimplenciaObrig: ['Declaração de Adimplência e Inexistência de outras fontes'],
        processos: [],
        processo: [],
        tipo: [],
        entidade: {
          address: [],
          chiefs: [],
          documents: [],
          contact: []
        },
        procSelecionado: true,
        campoErro: null,
        user: {
          entity: {
            contact: {
              phone: null,
              mobile: null
            }
          }
        },
        entidadeUsu: {
          address: [],
          documents: [],
          contact: []
        },
        entidadeEdital: [],
        contato: [],
        criarProposta: true,
        documentosObrigatorios: [],
        docs: [],
        docsProp: [],
        documentTypes: [],
        tiposArquivos: [],
        mandatos: {},
        mandato: {},
        dirigentes: {},
        ramoAtividade: [],
        endereco: {},
        historico: {},
        usuarios: {}
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ]),
      dataFinal: function () {
        if (this.propostaSimplificada.initialDate) {
          return moment(this.propostaSimplificada.initialDate).add(this.propostaSimplificada.periods, 'M').format('DD/MM/YYYY')
        } else {
          return ''
        }
      }
    },
    watch: {
    },
    created () {
      this.buscaArquivosEsperados()
      this.loadEntityActivity()
      this.buscaDocumentos()
      this.buscaConfiguracoes()
      this.buscaDocumentosProp()
    },
    mounted () {
      $('#tabEntidade').trigger('click')
      this.entidadeUsu = this.usuarioLogado.entity
      if (this.entidadeUsu.id) {
        this.carregaProposta()
      }
      this.entidadeEdital = this.usuarioLogado.entity.notice
      this.verificar()
      this.entidadeUsu.contact.email = this.usuarioLogado.entity.email
    },
    methods: {
      verificar () {
        if (!this.entidadeUsu.hasOwnProperty('contact')) {
          this.entidadeUsu.contact = {}
          this.entidadeUsu.contact.phone = ''
          this.entidadeUsu.contact.email = ''
        }
      },
      buscaEntidade () {
        axios.get('proxy/account/entities/' + this.entidade.id).then((response) => {
          this.entity = response.data.value
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      buscaDocumentosProp () {
        axios.get('proxy/account/config/general-system-config').then((response) => {
          this.documentosProp = response.data.value.proposalConfig.documentTypes
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      verificaDocumentosCarregados () {
        if (!this.propostaSimplificada.documents) {
          return false
        }
        let documentosCarregados = this.propostaSimplificada.documents.map((item) => {
          return item.documentType.type
        })
        return _.isEqual(this.documentosObrigatorios.sort(), documentosCarregados.sort())
      },
      buscaConfiguracoes () {
        axios.get('proxy/account/config/general-system-config').then((response) => {
          this.configuracoes = response.data.value
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      buscaArquivosEsperados () {
        axios.get('proxy/account/config/general-system-config').then((response) => {
          this.documentosObrigatorios = response.data.value.entitySimplificadoConfig.documentTypes
          for (let i = 0; i < this.documentosObrigatorios.length; i++) {
            this.docs[i] = this.documentosObrigatorios[i]
          }
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      buscaDocumentos () {
        axios.get('proxy/document/documents/type?active').then((response) => {
          this.tiposArquivos = response.data.value
          const str = this.tiposArquivos.find(d => d.type === 'Declaração de Adimplência e Inexistência de outras fontes')
          this.adimplencia[0] = Object.assign({}, str)
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      isEditable () {
        return (this.$root.authorize('entidade-editar') || this.$root.authorize('minha-entidade-editar'))
      },
      loadEntityActivity () {
        axios.get('proxy/project/entity-activity/').then((response) => {
          this.ramoAtividade = response.data.value
        })
      },
      loadCityAndState () {
        if (this.propostaSimplificada.cep) {
          axios.get('proxy/project/city/within-zip-code-range/' + this.cidade.cep).then((response) => {
            this.propostaSimplificada.name = response.data.value.name
            this.$forceUpdate()
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        } else {
          this.cidade.name = ''
          this.$forceUpdate()
        }
      },
      carregaProposta () {
        axios.get('proxy/project/proposal/' + this.entidadeUsu.id + '/entityAutoRegister').then((response) => {
          if (response.data.value !== undefined) {
            this.propostaSimplificada = response.data.value[0]
          } else {
            this.propostaSimplificada = {}
          }
        })
          .catch((error) => {
            this.$snotify.clear()
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      conclui () {
        this.entidadeUsu.registerPhase = 'CADASTRO_COMPLETO'
        this.propostaSimplificada.documents = this.documentos
        this.propostaSimplificada.createdBy = this.usuarioLogado
        this.propostaSimplificada.entity = this.entidadeUsu
        this.propostaSimplificada.proposalPhase = 'PRE_ANALISE'
        this.propostaSimplificada.proposalStatus = 'OPE'
        this.propostaSimplificada.notice = this.entidadeEdital
        this.propostaSimplificada.fav = null
        this.criarProposta = true
        this.entidadeOK = true
        let aba = ''
        let docsOK = false
        if (this.entidadeOK) {
          if (this.entidadeUsu.businessName && this.entidadeUsu.cnpj && this.entidadeUsu.cnpjExpeditionTime && this.entidadeUsu.companyName && this.entidadeUsu.phone && this.entidadeUsu.email) {
            this.okGeral = true
          } else {
            this.okGeral = false
          }
          if (this.entidadeUsu.chiefs.length < 1) {
            this.$snotify.warning('Verifique o preenchimento do formulário. O dirigente deve ser preenchido!')
            return
          }
          if (this.entidadeUsu.address.length < 1) {
            this.$snotify.warning('Verifique o preenchimento do formulário. O endereço deve ser preenchido!')
            return
          }
          if (!this.propostaSimplificada.name && this.okGeral === true) {
            this.$snotify.warning('O preenchimento da proposta é obrigatório. Favor verificar.')
            $('[href="#Proposta"]').tab('show')
          }
          if (Object.keys(this.entidadeUsu.documents).length < 4) {
            this.$snotify.warning('Existem documentos obrigatórios não anexados. Favor verificar.')
            docsOK = false
            return docsOK
          } else {
            docsOK = true
            if (!this.propostaSimplificada.name && this.okGeral === true && docsOK === true) {
              this.$snotify.warning('O preenchimento da proposta é obrigatório. Favor verificar.')
              $('[href="#Proposta"]').tab('show')
            }
          }
          this.$validator.validateAll().then((result) => {
            if (result) {
              if (this.entidadeUsu.id) {
                this.$snotify.async('Cadastrando entidade. Por favor, aguarde...', {timeout: 0})
                axios.put('/proxy/account/entities/' + this.entidadeUsu.id, this.entidadeUsu).then((response) => {
                  this.$snotify.clear()
                  this.$snotify.async('Cadastrando proposta. Por favor, aguarde...', {timeout: 0})
                  axios.post('proxy/project/proposal/pre-proposal/', this.propostaSimplificada).then((response) => {
                    this.$snotify.clear()
                    this.$snotify.success('Proposta simplificada cadastrada com sucesso!')
                    setTimeout(() => {
                      this.$router.push({name: 'cadastro-entidade-lista'})
                    }, 2000)
                  })
                    .catch((error) => {
                      this.$snotify.clear()
                      console.log('error', error)
                      this.$root.trataErro(error)
                    })
                })
                  .catch((error) => {
                    this.$snotify.clear()
                    this.$root.trataErro(error)
                  })
              } else {
                axios.post('proxy/account/entities/', this.entidadeUsu).then((response) => {
                  this.$snotify.clear()
                  this.propostaSimplificada.entity.id = response.data.value.id
                  axios.post('proxy/project/proposal/pre-proposal/entity', this.propostaSimplificada).then((response) => {
                    this.$snotify.success('Proposta simplificada cadastrada com sucesso!')
                    setTimeout(() => {
                      this.$router.push({name: 'cadastro-entidade-lista'})
                    }, 2000)
                  })
                    .catch((error) => {
                      this.$snotify.clear()
                      console.log('error', error)
                      this.$root.trataErro(error)
                    })
                })
              }
            } else {
              this.errors.items.forEach((item) => {
                this.$snotify.clear()
                this.campoErro = item.field
              })
            }
          })
        } else {
          this.$snotify.error('Erros no preenchimento da aba ' + aba + '. Favor verificar.')
        }
      },
      atualiza () {
        if (this.documentos) {
          this.propostaSimplificada.documents = this.documentos
        }
        this.propostaSimplificada.createdBy = this.usuarioLogado
        this.propostaSimplificada.entity = this.entidadeUsu
        this.propostaSimplificada.proposalPhase = 'PRE_ANALISE'
        this.propostaSimplificada.proposalOrigin = 'COMPLETO'
        this.propostaSimplificada.proposalStatus = 'OPE'
        this.propostaSimplificada.notice = this.entidadeEdital
        // this.entidade.users = this.usuarios
        // this.entidade.registerPhase = 'CADASTRO_SIMPLIFICADO'
        axios.put('/proxy/account/entities/' + this.entidadeUsu.id + '/temp', this.entidadeUsu).then((response) => {
          // this.salvaUsuarios()
          axios.post('proxy/project/proposal/temp/', this.propostaSimplificada).then((response) => {
            this.$snotify.success('Proposta simplificada salva com sucesso!')
          })
            .catch((error) => {
              console.log('error', error)
              this.$root.trataErro(error)
            })
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      grava () {
        this.propostaSimplificada.documentTypes = this.documentos
        this.propostaSimplificada.createdBy = this.usuarioLogado
        this.propostaSimplificada.entity = this.entidadeUsu
        this.propostaSimplificada.proposalPhase = 'CADASTRO'
        this.propostaSimplificada.simplified = this.processos.simplifiedNumber.id
        this.entidadeUsu.registerPhase = 'CADASTRO_SIMPLIFICADO'
        axios.post('proxy/account/entities/temp/', this.entidadeUsu).then((response) => {
          axios.post('proxy/project/proposal/pre-proposal/entity', this.propostaSimplificada).then((response) => {
            this.$snotify.success('Proposta simplificada salva com sucesso!')
          })
            .catch((error) => {
              console.log('error', error)
              this.$root.trataErro(error)
            })
        })
      }
    }
  }
</script>

<style scoped>
  .nav-pills > li.active > a, .nav-pills > li.active > a:focus {
    color: white;
    background-color: #2109ff;
  }

  .nav-pills > li.active > a:hover {
    color: white;
    background-color: #2109ff;
  }

  .nav > li > a:hover, .nav > li > a:focus {
    text-decoration: none;
    background-color: none !important;
  }


</style>
