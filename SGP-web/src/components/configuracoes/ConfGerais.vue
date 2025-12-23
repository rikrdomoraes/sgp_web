<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="'SGP - Configurações Gerais'"/>

    <!-- ngView: --><div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
    <section class="content-header ng-scope">
      <h1>Configurações Gerais</h1>
      <b-breadcrumb :items="breadcrumb"/>
    </section>

    <!-- main content -->
    <section class="content ng-scope">
      <div class="row">
        <div class="col-md-12">
          <div class="box box-widget">
            <div class="box-body">
              <div v-show="loading.show === true" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
              <ul class="nav nav-pills">
                <li><a href="#MóduloUsuáriosLogados" data-toggle="tab">Usuários Logados no Sistema</a></li>
                <li><a href="#MóduloUsuario" data-toggle="tab">Módulo Usuário</a></li>
                <li><a href="#MóduloAcoes" data-toggle="tab">Módulo Ações e proprietário</a></li>
                <li><a href="#MóduloEntidade" data-toggle="tab">Módulo Entidade</a></li>
                <li><a href="#MóduloProposta" data-toggle="tab">Módulo Proposta</a></li>
                <!--<li><a href="#MóduloSolicitacao" data-toggle="tab">Módulo Solicitação</a></li>-->
                <li><a href="#MóduloDocumentos" data-toggle="tab">Módulo Documentos</a></li>
              </ul>
              <hr>
              <!--<div id="MóduloUsuáriosLogados" class="tab-pane active">-->
                <!--<div class="form-group"  v-if="usuarioLogado.userType === 'FUNDACAO'">-->
                  <!--&lt;!&ndash;<label class="control-sidebar-subheading">&ndash;&gt;-->
                  <!--&lt;!&ndash;<strong>{{usuario.ds_nome_usuario}}</strong>&ndash;&gt;-->
                  <!--&lt;!&ndash;</label>&ndash;&gt;-->
                  <!--<table  class="table table-condensed table-bordered table-striped text-center">-->
                    <!--<thead>-->
                    <!--<tr style="background-color: #F2F3F4">-->
                      <!--<th class="text-center" width="20%">Nome do usuário</th>-->
                      <!--<th class="text-center" width="20%">Login do usuário</th>-->
                      <!--<th class="text-center" width="20%">E-mail do usuário</th>-->
                      <!--<th class="centro" width="20%">Tipo do Usuário</th>-->
                      <!--<th class="centro" width="20%">Entidade</th>-->
                    <!--</tr>-->
                    <!--</thead>-->
                    <!--<thead>-->
                    <!--<tr v-for="usuario in usuariosLogados">-->
                      <!--<td data-title="'nome'" sortable="'item'" class="text-center" width="20%">{{usuario.ds_nome_usuario}}</td>-->
                      <!--<td data-title="'login'" sortable="'login'" class="text-center" width="20%">{{usuario.ds_login}}</td>-->
                      <!--<td data-title="'email'" sortable="'email'" class="text-center" width="20%">{{usuario.ds_email}}</td>-->
                      <!--<td data-title="'tipo'" sortable="'tipo'" class="text-center" width="20%">{{usuario.ds_tipo_usuario}}-->
                        <!--&lt;!&ndash;<div v-if="usuario.ds_tipo_usuario === 'ENTIDADE'">&ndash;&gt;-->
                        <!--&lt;!&ndash;{{usuario.entidade.ds_nome}}&ndash;&gt;-->
                        <!--&lt;!&ndash;</div>&ndash;&gt;-->
                      <!--</td>-->
                      <!--<td data-title="'email'" sortable="'email'" class="text-center" width="20%">-->
                        <!--<div v-if="usuario.ds_tipo_usuario === 'ENTIDADE'">{{usuario.entidade.ds_nome}} - {{usuario.entidade.ds_cnpj | cnpj}}</div><div v-else-if="usuario.ds_tipo_usuario === 'FUNDACAO'">-</div>-->
                      <!--</td>-->
                    <!--</tr>-->
                    <!--</thead>-->
                  <!--</table>-->
                <!--</div>-->
              <!--</div>-->
              <div class="tab-content">
                <div class="tab-pane active" id="MóduloUsuáriosLogados">
                  <div class="form-group"  v-if="usuarioLogado.userType === 'FUNDACAO'">
                    <!--<label class="control-sidebar-subheading">-->
                    <!--<strong>{{usuario.ds_nome_usuario}}</strong>-->
                    <!--</label>-->
                    <span> Usuários Logados no sistema: </span> {{usuariosLogados.length}}
                    <br>
                    <br>
                    <table  class="table table-condensed table-bordered table-striped text-center">
                      <thead>
                      <tr style="background-color: #F2F3F4">
                        <th class="text-center" width="20%">Nome do usuário</th>
                        <th class="text-center" width="20%">Login do usuário</th>
                        <th class="text-center" width="20%">E-mail do usuário</th>
                        <th class="centro" width="20%">Tipo do Usuário</th>
                        <th class="centro" width="20%">Entidade</th>
                      </tr>
                      </thead>
                      <thead>
                      <tr v-for="usuario in usuariosLogados">
                        <td data-title="'nome'" sortable="'item'" class="text-center" width="20%">{{usuario.ds_nome_usuario}}</td>
                        <td data-title="'login'" sortable="'login'" class="text-center" width="20%">{{usuario.ds_login}}</td>
                        <td data-title="'email'" sortable="'email'" class="text-center" width="20%">{{usuario.ds_email}}</td>
                        <td data-title="'tipo'" sortable="'tipo'" class="text-center" width="20%">{{usuario.ds_tipo_usuario}}
                          <!--<div v-if="usuario.ds_tipo_usuario === 'ENTIDADE'">-->
                          <!--{{usuario.entidade.ds_nome}}-->
                          <!--</div>-->
                        </td>
                        <td data-title="'email'" sortable="'email'" class="text-center" width="20%">
                          <div v-if="usuario.ds_tipo_usuario === 'ENTIDADE' && usuario.entidade && !_.isNull(usuario.entidade)">{{usuario.entidade.ds_nome}} - {{usuario.entidade.ds_cnpj | cnpj}}</div><div v-else-if="usuario.ds_tipo_usuario === 'FUNDACAO'">-</div>
                        </td>
                      </tr>
                      </thead>
                    </table>
                  </div>
                </div>
                <div class="tab-pane" id="MóduloUsuario">
                  <div class="form-group" v-if="$root.authorize('usuario-entidade-configurar')">
                    <button @click="mostrar.isFrmEntityUserOpen = !mostrar.isFrmEntityUserOpen" type="button" class="btn btn-default pull-right" uib-tooltip="Editar">
                      <i class="fa fa-gears"></i>
                    </button>
                    <label class="control-sidebar-subheading">
                      <strong>Cadastro de usuário entidade</strong>
                    </label>
                    <p>Edita comportamentos relativos ao cadastro de usuário entidade.</p>
                  </div>

                  <!-- form entity configuration -->
                  <div v-if="mostrar.isFrmEntityUserOpen" name="frmEntityUser" class="form-horizontal" novalidate>
                    <div class="well well-sm no-shadow animated fadeInDownOutUp">

                      <!-- defaultProfile -->
                      <div class="form-group" :class="{ 'has-error' : errors.first('defaultProfile')}">
                        <label for="active" class="control-label col-md-2">Perfil padrão usuário CNPJ:</label>
                        <div class="col-md-5" >
                          <select class="form-control" name="defaultProfile" v-model="selected">
                            <option value="">Nenhum</option>
                            <option v-for="perfil in perfis" :value="perfil.ds_nome">{{perfil.ds_nome}}</option>
                          </select>
                          <span v-if="errors.first('defaultProfile')" class="label label-danger"> {{ errors.first('defaultProfile') }}</span>
                        </div>
                      </div>

                      <!-- defaultProfileCpf -->
                      <div class="form-group"  :class="{ 'has-error' : errors.first('defaultProfile')}">
                        <label for="active" class="control-label col-md-2">Perfil padrão usuário CPF:</label>
                        <div class="col-md-5" >
                          <select class="form-control" name="defaultProfileCpf" v-model="selectedCpf">
                            <option value="">Nenhum</option>
                            <option v-for="perfil in perfis" :value="perfil.ds_nome">{{perfil.ds_nome}}</option>
                          </select>
                          <span v-if="errors.first('defaultProfileCpf')" class="label label-danger"> {{ errors.first('defaultProfileCpf') }}</span>
                        </div>
                      </div>

                      <!-- isSendEmail -->
                      <!--<div class="form-group required" :class="{ 'has-error' : errors.first('isSendEmail')}">-->
                        <!--<label for="active" class="control-label col-md-2">Enviar e-mail?</label>-->
                        <!--<div class="col-md-10" >-->
                          <!--<label class="radio-inline new-control new-control-radio">-->
                            <!--<input type="radio" name="isSendEmail" v-model="configuracao.configuracao_usuario_entidade.bt_send_email" :value="1" required> Sim<div class="new-control-indicator"></div></label>-->
                          <!--<label class="radio-inline new-control new-control-radio">-->
                            <!--<input type="radio" name="isSendEmail" v-model="configuracao.configuracao_usuario_entidade.bt_send_email" :value="0" required> Não-->
                            <!--<div class="new-control-indicator"></div>-->
                          <!--</label>-->
                          <!--<span v-if="errors.first('isSendEmail')" class="label label-danger"> {{ errors.first('isSendEmail') }}</span>-->
                        <!--</div>-->
                      <!--</div>-->

                      <!--&lt;!&ndash; emailContent &ndash;&gt;-->
                      <!--<div class="form-group" :class="{ 'has-error' : errors.first('registerEntityUserConfigContent')}">-->
                        <!--<label for="rg" class="control-label col-md-2">Conteúdo do e-mail:</label>-->
                        <!--<div class="col-md-10">-->
                          <!--<vue-editor name="registerEntityUserConfigContent" id="editor" v-model="configuracao.configuracao_usuario_entidade.ds_email_content"></vue-editor>-->
                        <!--</div>-->
                      <!--</div>-->


                      <!-- buttons -->
                      <div class="form-group" style="margin-bottom:0">
                        <div class="col-md-10 col-md-offset-2">
                          <button @click="salva" type="submit" class="btn btn-success btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Salvar</button>
                          <button @click="mostrar.isFrmEntityUserOpen = false" type="button" class="btn btn-default btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr v-if="$root.authorize('usuario-entidade-configurar')">


                  <div class="form-group" v-if="$root.authorize('usuario-agencia-configurar')">
                </div>
                </div>
                <div id="MóduloAcoes" class="tab-pane">
                  <div class="form-group" v-if="$root.authorize('perfil-atribuido-configurar')">
                    <button @click="mostrar.isFrmAssignedProfileOpen = !mostrar.isFrmAssignedProfileOpen" type="button" class="btn btn-default pull-right" uib-tooltip="Editar">
                      <i class="fa fa-gears"></i>
                    </button>
                    <label class="control-sidebar-subheading">
                      <strong>Configuração de perfil atribuído</strong>
                    </label>
                    <p>Edita comportamentos relativos à atribuição de perfil.</p>
                  </div>
                  <div v-if="mostrar.isFrmAssignedProfileOpen" name="frmAssignedProfile" class="form-horizontal" novalidate>
                    <div class="well well-sm no-shadow animated fadeInDownOutUp">

                      <!-- manager profiles -->
                      <div class="form-group">
                        <label class="control-label col-md-2">Perfis de Gerência:</label>
                        <div class="col-md-5 col-lg-6">
                          <multiselect v-model="configuracao.assignedProfileConfig.managerProfiles" :options="perfis" :multiple="true" :close-on-select="false" :clear-on-select="true" :hide-selected="true" :preserve-search="true" placeholder="Selecione um perfil" label="ds_nome" track-by="ds_nome" :preselect-first="true">
                            <template slot-scope="props"><span class="multiselect__tag"><span>{{ props.option.name }}</span><span class="custom__remove" @click="props.remove(props.option)">❌</span></span></template>
                          </multiselect>
                        </div>
                      </div>

                      <!-- buttons -->
                      <div class="form-group" style="margin-bottom:0">
                        <div class="col-md-10 col-md-offset-2">
                          <button @click="salva" type="submit" class="btn btn-success btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Salvar</button>
                          <button @click="mostrar.isFrmAssignedProfileOpen = false" type="button" class="btn btn-default btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="MóduloEntidade" class="tab-pane">
                  <div class="form-group" v-if="$root.authorize('entidade-configurar')">
                    <button @click="mostrar.isFrmCredentialOpen = !mostrar.isFrmCredentialOpen" type="button" class="btn btn-default pull-right" uib-tooltip="Editar">
                      <i class="fa fa-gears"></i>
                    </button>
                    <label class="control-sidebar-subheading">
                      <strong>Configuração de credenciamento</strong>
                    </label>
                    <p>Edita comportamentos relativos ao credenciamento.</p>
                  </div>
                  <div v-if="mostrar.isFrmCredentialOpen" name="frmAssignedProfile" class="form-horizontal" novalidate>
                    <div class="well well-sm no-shadow animated fadeInDownOutUp">

                      <!-- isSendEmail -->
                      <div class="form-group required" :class="{ 'has-error' : errors.first('isSendEmail')}">
                        <label for="active" class="control-label col-md-2">Enviar e-mail?</label>
                        <div class="col-md-10" >
                          <label class="radio-inline new-control new-control-radio">
                            <input type="radio" name="isSendEmail" v-model="configuracao.configuracao_entidade.bt_send_email" :value="1" required> Sim<div class="new-control-indicator"></div></label>
                          <label class="radio-inline new-control new-control-radio">
                            <input type="radio" name="isSendEmail" v-model="configuracao.configuracao_entidade.bt_send_email" :value="0" required> Não
                            <div class="new-control-indicator"></div>
                          </label>
                          <span v-if="errors.first('isSendEmail')" class="label label-danger"> {{ errors.first('isSendEmail') }}</span>
                        </div>
                      </div>

                      <!-- emailContent -->
                      <div class="form-group">
                        <label for="rg" class="control-label col-md-2">Conteúdo do e-mail:</label>
                        <div class="col-md-10">
                          <vue-editor v-model="configuracao.configuracao_entidade.ds_email_content"  rows="10" cols="105"></vue-editor>
                        </div>
                      </div>

                      <!-- required documents -->
                      <div class="form-group">
                        <label class="control-label col-md-2">Documentos obrigatórios:</label>
                        <div class="col-md-10">
                          <multiselect v-model="configuracao.configuracao_entidade.documentos_obrigatorios" :options="documentos" :multiple="true" :close-on-select="false" :clear-on-select="true" :hide-selected="true" :preserve-search="true" placeholder="Selecione um documento" label="ds_tipo" track-by="ds_tipo">
                            <template slot-scope="props"><span class="multiselect__tag"><span>{{props.option.type}}</span><span class="custom__remove" @click="props.remove(props.option)">❌</span></span></template>
                          </multiselect>
                        </div>
                      </div>

                      <!-- buttons -->
                      <div class="form-group" style="margin-bottom:0">
                        <div class="col-md-10 col-md-offset-2">
                          <button @click="salva" type="submit" class="btn btn-success btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Salvar</button>
                          <button @click="mostrar.isFrmCredentialOpen = false" type="button" class="btn btn-default btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr >
                </div>
                <div id="MóduloProposta" class="tab-pane">
                  <div class="form-group" v-if="$root.authorize('proposta-configurar')">
                    <button @click="mostrar.isFrmProposalOpen = !mostrar.isFrmProposalOpen" type="button" class="btn btn-default pull-right" uib-tooltip="Editar">
                      <i class="fa fa-gears"></i>
                    </button>
                    <label class="control-sidebar-subheading">
                      <strong>Configuração de proposta</strong>
                    </label>
                    <p>Edita comportamentos relativos a proposta.</p>
                  </div>
                  <div v-if="mostrar.isFrmProposalOpen" name="frmProposal" class="form-horizontal" novalidate>
                    <div class="well well-sm no-shadow animated fadeInDownOutUp">
                      <div class="form-group">
                            <label for="defaultDocumentTypeDraft" class="control-label col-md-2">Tipo de documento padrão Minuta:</label>
                            <div class="col-md-5" >
                              <select class="form-control" name="defaultDocumentTypeDraft" v-model="configuracao.configuracao_proposta.minuta.ds_tipo">
                                <option value="">Nenhum</option>
                                <option v-for="documento in documentos" :value="documento.ds_tipo">{{documento.ds_tipo}}</option>
                              </select>
                              <span v-if="errors.first('defaultDocumentTypeDraft')" class="label label-danger"> {{ errors.first('defaultDocumentTypeDraft') }}</span>
                            </div>
                          </div>

                          <!-- Tipo de documento padrão de Plano de Trabalho -->
                          <div class="form-group">
                            <label for="defaultDocumentTypeWorkPlan" class="control-label col-md-2">Tipo de documento padrão Plano de Trabalho:</label>
                            <div class="col-md-5" >
                              <select class="form-control" name="defaultDocumentTypeDraft" v-model="configuracao.configuracao_proposta.plano_trabalho.ds_tipo">
                                <option value="">Nenhum</option>
                                <option v-for="documento in documentos" :value="documento.ds_tipo">{{documento.ds_tipo}}</option>
                              </select>
                              <span v-if="errors.first('defaultDocumentTypeWorkPlan')" class="label label-danger"> {{ errors.first('defaultDocumentTypeWorkPlan') }}</span>
                            </div>
                          </div>

                          <!-- required documents -->
                          <div class="form-group">
                            <label class="control-label col-md-2">Documentos obrigatórios:</label>
                            <div class="col-md-10">
                                <multiselect v-model="configuracao.configuracao_proposta.documentos_obrigatorios" :options="documentos" :multiple="true" :close-on-select="false" :clear-on-select="true" :hide-selected="true" :preserve-search="true" placeholder="Selecione um documento" label="ds_tipo" track-by="ds_tipo">
                                <template slot-scope="props"><span class="multiselect__tag"><span>{{props.option.type}}</span><span class="custom__remove" @click="props.remove(props.option)">❌</span></span></template>
                              </multiselect>
                            </div>
                          </div>

                          <!-- buttons -->
                          <div class="form-group" style="margin-bottom:0">
                            <div class="col-md-10 col-md-offset-2">
                              <button @click="salva" type="submit" class="btn btn-success btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Salvar</button>
                              <button @click="mostrar.isFrmProposalOpen = false" type="button" class="btn btn-default btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
                            </div>
                          </div>
                        </div>
                      </div>
                  <hr>
                </div>
                <!--<div id="MóduloSolicitacao" class="tab-pane">-->
                  <!--<div class="form-group" v-if="$root.authorize('documento-configurar')">-->
                    <!--<button @click="mostrar.isFrmRequestOpen = !mostrar.isFrmRequestOpen" type="button" class="btn btn-default pull-right" uib-tooltip="Editar">-->
                      <!--<i class="fa fa-gears"></i>-->
                    <!--</button>-->
                    <!--<label class="control-sidebar-subheading">-->
                      <!--<strong>Modelo do documento de solicitação de adiantamento</strong>-->
                    <!--</label>-->
                    <!--<p>Permite adicionar um modelo de solicitação de adiantamento.</p>-->
                  <!--</div>-->
                  <!--<div v-if="mostrar.isFrmRequestOpen" name="frmRequest" class="form-horizontal" novalidate>-->
                    <!--<div class="well well-sm no-shadow animated fadeInDownOutUp">-->
                      <!--<div class="form-group required">-->
                        <!--<label for="type" class="control-label col-md-3 col-lg-2">Tipo de documento:</label>-->
                        <!--<div class="col-md-6 col-lg-4">-->
                         <!--<select class="form-control" name="advanceDefaultDocument" v-model="configuracao.requestConfig.advanceDefaultDocument.documentType.id">-->
                            <!--<option value="">Nenhum</option>-->
                            <!--<option v-for="documento in documentos" :value="documento.id">{{documento.type}}</option>-->
                          <!--</select>-->
                        <!--</div>-->
                      <!--</div>-->
                      <!--<div v-if="state=='STATE_NEW'" class="form-group required">-->
                        <!--<label for="file" class="control-label col-md-3 col-lg-2">Arquivo:</label>-->
                        <!--<div class="col-md-6 col-lg-4">-->
                          <!--<input type="file" name="arquivo" id="file" ref="file" @change="handleFileUpload" v-validate="'required'"/>-->
                          <!--<a v-if="configuracao.requestConfig.advanceDefaultDocument.fileName" @click="onDownload()" href="javascript:void(0)"><i class="fa fa-download" aria-hidden="true"></i> {{configuracao.requestConfig.advanceDefaultDocument.fileName}}</a>-->
                         <!--</div>-->
                      <!--</div>-->
                      <!--<div v-if="state=='STATE_VIEW'" class="form-group required">-->
                        <!--<label for="file" class="control-label col-md-3 col-lg-2">Arquivo:</label>-->
                        <!--<div class="col-md-6 col-lg-4">-->
                          <!--<a @click="onDownload()" href="javascript:void(0)" class="ng-binding"><i class="fa fa-download" aria-hidden="true"></i>{{configuracao.requestConfig.advanceDefaultDocument.fileName}}</a>-->
                          <!--<br>-->
                          <!--<button @click="changeToStateNew()" type="button" class="btn btn-default btn-xs">Alterar</button>-->
                        <!--</div>-->
                      <!--</div>-->
                      <!--&lt;!&ndash; buttons &ndash;&gt;-->
                      <!--<div class="form-group" style="margin-bottom:0">-->
                        <!--<div class="col-md-10 col-md-offset-2">-->
                          <!--<br>-->
                          <!--<button @click="onAdd" type="button" class="btn btn-success btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true" id="cmpt-upload-add"></i> Salvar</button>-->
                          <!--<button @click="mostrar.isFrmRequestOpen = false" type="button" class="btn btn-default btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>-->
                        <!--</div>-->
                      <!--</div>-->

                    <!--</div>-->
                  <!--</div>-->
                <!--</div>-->

                <div id="MóduloDocumentos" class="tab-pane">
                  <div class="form-group" v-if="$root.authorize('documento-configurar')">
                    <button @click="mostrar.isFrmDocumentOpen = !mostrar.isFrmDocumentOpen" type="button" class="btn btn-default pull-right" uib-tooltip="Editar">
                      <i class="fa fa-gears"></i>
                    </button>
                    <label class="control-sidebar-subheading">
                      <strong>Configuração de documentos anexos</strong>
                    </label>
                    <p>Permite escolher os tipos de documentos permitidos e o tamanho dos mesmos.</p>
                  </div>
                  <div v-if="mostrar.isFrmDocumentOpen" name="frmRequest" class="form-horizontal" novalidate>
                    <div class="well well-sm no-shadow animated fadeInDownOutUp">

                      <div class="form-group">
                        <label for="fileSize" class="control-label col-md-2 required">Tamanho máximo:</label>
                        <div class="col-md-3 col-lg-3" >
                          <div class="input-group">
                            <input type="number" class="form-control text-right" step="1" name="fileSize" v-model="configuracao.documento.dc_tamanho_arquivo" required />
                            <div class="input-group-addon">MB</div>
                          </div>
                          <span v-if="errors.first('fileSize')" class="label label-danger"> {{ errors.first('fileSize') }}</span>
                        </div>
                      </div>

                      <!-- mime type -->
                      <div class="form-group">
                        <label class="control-label col-md-2 required">Tipos de arquivos:</label>
                        <div class="col-md-5 col-lg-3">
                          <multiselect v-model="mimeTypes" :options="configuracao.documento.tipo_arquivos" :multiple="true" :close-on-select="false" :clear-on-select="true" :hide-selected="true" :preserve-search="true" placeholder="Adicionar tipo" label="ds_tipo_de_documento" track-by="ds_tipo_de_documento">
                            <template slot-scope="props"><span class="multiselect__tag"><span>{{props.option}}</span><span class="custom__remove" @click="props.remove(props.option)">❌</span></span></template>
                          </multiselect>
                        </div>
                        <span v-if="errors.first('mime')" class="label label-danger"> {{ errors.first('mime') }}</span>
                      </div>

                      <!-- buttons -->
                      <div class="form-group" style="margin-bottom:0">
                        <div class="col-md-10 col-md-offset-2">
                          <button @click="salva" type="submit" class="btn btn-success btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Salvar</button>
                          <button @click="mostrar.isFrmDocumentOpen = false" type="button" class="btn btn-default btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
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
    </section>
  </div>
      <vue-snotify></vue-snotify>
  </div>
</template>

<script>
  /* eslint-disable key-spacing,indent */
  import { mapGetters } from 'vuex'
  import { VueEditor } from 'vue2-editor'
  export default {
    components: {
      VueEditor
    },
    name: 'ConfGerais',
    data () {
      return {
        config: [],
        configUser: [],
        usuariosLogados: [],
        configuracao: [],
        tipo_ant: '',
        file: {},
        data: [],
        loading: {
          show: false
        },
        selected1: '',
        state: 'STATE_VIEW',
        todosUsuarios: [],
        usuariosPesquisa: [],
        usersAdicionar: [],
        selected: '',
        perfil: [],
        perfis: [],
        documento: [],
        documentos: [],
        mostrar: {
          isFrmEntityUserOpen: false,
          isFrmAgencyUserOpen: false,
          isFrmSuperUserOpen: false,
          isFrmFbbUserOpen: false,
          isFrmStrategicUserOpen: false,
          isFrmAssignedProfileOpen: false,
          isFrmCredentialOpen: false,
          isFrmCredentialValidOpen: false,
          isFrmProposalOpen: false,
          isFrmSimplificadoOpen:false,
          isFrmRequestOpen: false,
          isFrmAcolhimentoOpen: false,
          isFrmPreAnalysisProposalOpen: false,
          isFrmAnalysisProposalOpen: false,
          isFrmDocumentOpen: false
                },
        mimeTypes: [
          {id: 1, ds_extensao: '.doc', ds_tipo_de_documento: 'Microsoft Word (DOC)', ds_mime_type: 'application/msword'},
          {id: 2, ds_extensao: '.docx', ds_tipo_de_documento: 'Microsoft Word (DOCX)', ds_mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'},
          {id: 3, ds_extensao: '.gif', ds_tipo_de_documento: 'Graphi cs Interchange Format (GIF)', ds_mime_type: 'image/gif'},
          {id: 4, ds_extensao: '.jpg', ds_tipo_de_documento: 'JPEG images (JPG)', ds_mime_type: 'image/jpeg'},
          {id: 5, ds_extensao: '.png', ds_tipo_de_documento: 'Portable Network Graphics (PNG)', ds_mime_type: 'image/png'},
          {id: 6, ds_extensao: '.pdf', ds_tipo_de_documento: 'Adobe Portable Document Format (PDF)', ds_mime_type: 'application/pdf'},
          {id: 7, ds_extensao: '.ppt', ds_tipo_de_documento: 'Microsoft PowerPoint (PPT)', ds_mime_type: 'application/vnd.ms-powerpoint'},
          {id: 8, ds_extensao: '.pptx', ds_tipo_de_documento: 'Microsoft PowerPoint (PPTX)', ds_mime_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'},
          {id: 9, ds_extensao: '.rtf', ds_tipo_de_documento: 'Rich Text Format (RTF)', ds_mime_type: 'application/rtf'},
          {id:10, ds_extensao: '.svg', ds_tipo_de_documento: 'Scalable Vector Graphics (SVG)', ds_mime_type: 'image/svg+xml'},
          {id:11, ds_extensao: '.rtf', ds_tipo_de_documento: 'Rich Text Format (RTF)', ds_mime_type: 'application/rtf'},
          {id:12, ds_extensao: '.tiff', ds_tipo_de_documento: 'Tagged Image File Format (TIFF)', ds_mime_type: 'image/tiff'},
          {id:13, ds_extensao: '.xls', ds_tipo_de_documento: 'Microsoft Excel (XLS)', ds_mime_type: 'application/vnd.ms-excel'},
          {id:14, ds_extensao: '.xlsx', ds_tipo_de_documento: 'Microsoft Excel (XLSX)', ds_mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'},
          {id:15, ds_extensao: '.txt', ds_tipo_de_documento: 'Arquivo Texto (TXT)', ds_mime_type: 'text/plain'}
      ],
        breadcrumb: [{
          text: 'Inicial',
          href: '/'
        }, {
          text: 'Configurações',
          active: true
        }]
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    created () {
      this.buscaConfig()
      this.buscaPerfil()
      this.buscaDocumentos()
    },
    // beforeUpdate () {
    //   this.assinaUsuariosLogados()
    //   this.$forceUpdate()
    // },
    mounted () {
      this.assinaUsuariosLogados()
      this.$forceUpdate()
    },
    methods: {
      salva () {
        // this.tipo_ant = this.configuracao.requestConfig.advanceDefaultDocument.fileName
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.atualiza()
            this.updateDocumentType()
          } else {
            this.errors.items.forEach((item) => {
              this.$snotify.error(item.msg)
            })
          }
        })
      },
      handleFileUpload () {
        this.file = this.$refs.file.files[0]
      },
      refresh () {
        // location.reload(false)
        this.$router.go(0)
      },
      updateDocumentType () {
      axios.put('/proxy/documents/type/:documentId/' + this.configuracao.requestConfig.advanceDefaultDocument.documentType.id).then((response) => {
        // this.configuracao.requestConfig.advanceDefaultDocument.documentType.id.push(Object.assign({}, this.documentos.id))
      })
      },
      onAdd () {
        const data = new FormData()
        data.append('file', this.file)
        this.documento.pk = 1
        this.documento.loaded = 'upload'
        this.documento.progress = 0
        data.append('document', JSON.stringify(this.configuracao.requestConfig.advanceDefaultDocument))
        axios.post('proxy/document/documents', data, {
          headers: {
            'Content-Type': undefined,
            'Accept': 'application/json'
          },
          transformRequest: [function (data, headers) {
            // Do whatever you want to transform the data
            return data
          }]
        }).then((response) => {
          this.documento = response.data.value
          this.documentos.push(Object.assign({}, this.documento))
          this.salva()
          this.changeToStateView()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
        this.onCancel()
      },
      atualiza () {
        // Chama backend para atualizar
        axiosLaravel.post('configuracoes/', this.configuracao).then((response) => {
          this.$snotify.success('Configuração salva com sucesso.')
            this.mostrar.isFrmEntityUserOpen = false
              this.mostrar.isFrmAgencyUserOpen = false
              this.mostrar.isFrmSuperUserOpen = false
              this.mostrar.isFrmFbbUserOpen = false
              this.mostrar.isFrmStrategicUserOpen = false
              this.mostrar.isFrmAssignedProfileOpen = false
              this.mostrar.isFrmCredentialOpen = false
              this.mostrar.isFrmCredentialValidOpen = false
              this.mostrar.isFrmProposalOpen = false
              this.mostrar.isFrmSimplificadoOpen = false
              this.mostrar.isFrmRequestOpen = false
              this.mostrar.isFrmAcolhimentoOpen = false
              this.mostrar.isFrmPreAnalysisProposalOpen = false
              this.mostrar.isFrmAnalysisProposalOpen = false
              this.mostrar.isFrmDocumentOpen = false
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      // hasConfig () {
      //   let result = false
      //   if (Array.isArray(this.configuracao.documentConfig.mimeTypes) && (this.configuracao.documentConfig.mimeTypes.length > 0)) {
      //     this.configuracao.documentConfig.mimeType
      //     result = true
      //   }
      //   return result
      // },
      assinaUsuariosLogados () {
        this.loading.show = true
        Echo.leave('usuarios-logados')
        window.Echo.join('usuarios-logados')
          .here((users) => {
            this.usuariosLogados = users
            console.log('users', users)
            this.$forceUpdate()
          })
          .joining((user) => {
            this.usuariosLogados.push(user)
          })
          .leaving((user) => {
            this.usuariosLogados.splice(this.usuariosLogados.findIndex(logado => logado.id === user.id), 1)
          })
        for (let i = 0; i < this.usuariosLogados.length; i++) {
          if (!_.isNull(this.usuariosLogados[i].fk_entidade)) {
            if (this.usuariosLogados[i].fk_entidade) {
              axiosLaravel.get('entidades/' + this.usuariosLogados[i].fk_entidade).then((response) => {
                this.usuariosLogados[i].push(response.data)
              })
            }
          }
        }
      },
      changeToStateNew () {
        this.state = 'STATE_NEW'
      },
      changeToStateView () {
        this.state = 'STATE_VIEW'
      },
      onDownload () {
    this.progress = 0
         axios.get('proxy/document/documents/' + this.configuracao.requestConfig.advanceDefaultDocument.id + '/download',
          {
            responseType: 'arraybuffer',
            headers: {
              'Content-Type': 'application/json'
               }
            }).then((response) => {
          let ie = !!window.MSInputMethodContext && !!document.documentMode
          if (!ie) {
            let blob = new Blob([response.data])
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = this.configuracao.requestConfig.advanceDefaultDocument.fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          } else {
            let blob = new Blob([response.data], { type: this.configuracao.requestConfig.advanceDefaultDocument.contentType })
            let link = document.createElement('blob')
            link.href = window.navigator.msSaveOrOpenBlob(blob, this.configuracao.requestConfig.advanceDefaultDocument.fileName)
            link.download = this.configuracao.requestConfig.advanceDefaultDocument.fileName
            link.click()
          }
      })
        .catch((error) => {
          this.$root.trataErro(error)
        })
  },
      changeToStateDownloading () {
        this.state = 'STATE_DOWNLOADING'
      },
      buscaConfig () {
        this.config = null
        axiosLaravel.get('configuracoes/').then((response) => {
          this.config = (JSON.stringify(response.data))
          this.configUser = this.prepareData(response.data.configuracao_usuario_entidade)
          this.configuracao = this.prepareData(response.data)
          this.tipo_ant = this.configuracao.requestConfig.advanceDefaultDocument.fileName
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      onCancel () {
        this.documento.documentType = Object.assign({}, {})
        this.documento = {}
        this.file = null
        this.showGrid = true
        this.$forceUpdate()
      },
      buscaPerfil2 () {
        this.perfis = null
        axios.get('proxy/account/profiles?tiny').then((response) => {
          this.perfis = response.data.value
          this.data = JSON.stringify(this.perfis)
          // Fixa usuário CNPJ
          this.selected = 'Entidade CNPJ'
          this.selectedCpf = 'Entidade CPF'
          this.usuariosPesquisa = []
          let temporario = {id: 0, userName: ''}
          this.todosUsuarios.forEach((option) => { // Varre todos os usuários
            if (this.perfis.some((o) => o.id === option.id)) { // Se não tem correspondência entao adiciona
            } else {
              // Cria variavel temporaria para simplificar o objeto para a pesquisa não ficar pesada
              temporario = {id: 0, name: ''}
              temporario.id = option.id
              temporario.name = option.name
              // Passa para a variavel que vai guardar os usuários que ainda não tem o profile assinado
              this.usuariosPesquisa.push(temporario)
            }
          })
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      buscaPerfil () {
        this.perfis = null
        axiosLaravel.get('perfis/').then((response) => {
          this.perfis = response.data
          this.data = JSON.stringify(this.perfis)
          // Fixa usuário CNPJ
          this.selected = 'Entidade CNPJ'
          this.selectedCpf = 'Entidade CPF'
          this.usuariosPesquisa = []
          let temporario = {id: 0, ds_nome: ''}
          this.todosUsuarios.forEach((option) => { // Varre todos os usuários
            if (this.perfis.some((o) => o.id === option.id)) { // Se não tem correspondência entao adiciona
            } else {
              // Cria variavel temporaria para simplificar o objeto para a pesquisa não ficar pesada
              temporario = {id: 0, name: ''}
              temporario.id = option.id
              temporario.ds_nome = option.ds_nome
              // Passa para a variavel que vai guardar os usuários que ainda não tem o profile assinado
              this.usuariosPesquisa.push(temporario)
            }
          })
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      buscaDocumentos () {
        this.documentos = null
        if (this.localUso === undefined) {
          this.localUso = 'TODOS'
        }
        axiosLaravel.post('documentos/tipos/' + this.localUso).then((response) => {
          this.documentos = response.data
          this.loading.show = false
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      prepareData (data) {
    if (!data) {
      data = {}
    }
    if (!data.assignedProfileConfig) {
      data.assignedProfileConfig = {}
      data.assignedProfileConfig.managerProfiles = []
    }
    if (!data.configuracao_usuario_entidade) {
      data.configuracao_usuario_entidade = {}
      data.configuracao_usuario_entidade.documentos_obrigatorios = []
    }
    if (!data.entitySimplificadoConfig) {
      data.entitySimplificadoConfig = {}
      data.entitySimplificadoConfig.documentTypes = []
    }
    if (!data.proposalConfig) {
      data.proposalConfig = {}
      data.proposalConfig.documentTypes = []
    }
    if (!data.simplificadoConfig) {
      data.simplificadoConfig = {}
      data.simplificadoConfig.documentTypes = []
    }
    if (!data.requestConfig) {
      data.requestConfig = {}
    }
    if (!data.documentConfig) {
      data.documentConfig = {}
      data.documentConfig.mimeTypes = []
    }
    return data
  }
    }
  }
</script>
<style scoped>
</style>
