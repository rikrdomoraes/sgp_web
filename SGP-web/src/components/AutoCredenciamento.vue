<template>
  <div class="container-edital">
    <div class="edital-modal-container column all-centered" v-if="mostrarCriarProposta">
      <div class="edital-modal-mensagem column centered-start"> 
        <div class="login-logo yellow-bg logo-container-edital" style="margin-top:0;">
          <a href="#/"><img src="static/img/logo-login.png"></a>
        </div>
          <div class="edital-content-container column all-centered" v-if="entidadesExistentes.length > 0 && _.has(entidadesExistentes[0], 'ds_nome') && !_.isNull(entidadesExistentes[0].ds_nome) ">
                <span class="edital-subtitulo">Ótimo! Verificamos que a entidade tem um cadastro na Fundação BB.</span>
                <span class="edital-subtitulo"><b>Clique no link abaixo</b> para acessar e atualizar as informações .</span>
                <p v-for="entidade in entidadesExistentes"  class="edital-link">
                  <router-link :title="'<h5>Clique aqui para atualizar o cadastro da entidade</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }" :to="{name: 'cadastro-entidade-edita', params: { id: entidade.id }}" target="_blank">
                    {{entidade.ds_cnpj | cnpj}} -
                    {{entidade.ds_nome}}
                    ({{entidade.ds_nome_fantasia}})
                    <i class="fa fa-external-link"></i></router-link>
                </p>
                <div class="column all-centered email-edital-container">
                  <div>
                    Atenção, caso o e-mail de acesso <b>não</b> seja nenhum desses listados abaixo, entre em contato com a Fundação BB pelo e-mail <b>{{listaEditais[0].ds_numero_edital === 'ECOFORTE REDES 2024' ? 'ecoforte@fbb.org.br' : 'cataforte@fbb.org.br'}}</b>, constando o assunto: <b>{{listaEditais[0].ds_numero_edital === 'ECOFORTE REDES 2024' ? 'SGP – CHAMADA PÚBLICA Nº 2024/007' : 'SGP – CHAMADA PÚBLICA Nº 2024/008'}}</b>. Você deverá anexar <b>cópia da ata de eleição e posse</b>, <b>documento do representante legal</b> e informar o <b>novo e-mail da entidade</b>, para que seu acesso possa ser regularizado. 
                  </div>
                  <div>
                    <b>ATENÇÃO</b>: os documentos apresentados serão utilizados <b>apenas para fins de atualização do cadastro</b> e <b>NÃO</b> serão utilizados para análise da proposta.
                  </div>
                  <div v-for="email in emailsEntidades" class="edital-titulo">
                    {{email}}
                  </div>
                </div>
                <span class="edital-subtitulo">Após atualizar o seu cadastro, clique no botão <b>Criar Proposta</b> abaixo.</span>
                <span class="edital-subtitulo">Nesse caso <b>não é necessário</b> preencher os dados da Entidade e nem do representante legal.</span>

                <!-- Criar Proposta Autocredenciamento normal -->
                <div class="row-flex all-centered botao-edital-container">
                  <g-button-moema v-if="(mostrarForm && !mostrarArquivo && mostrarCriarProposta) && !gravando" color="warning" size="button--size-ss" @click.native="criaPropostaEdital()"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Criar Proposta </g-button-moema>
                  <g-button-moema v-if="(mostrarForm && !mostrarArquivo && mostrarCriarProposta)" color="error" size="button--size-ss" @click.native="cancelarEnvioEntidadeCadastrada()"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Cancelar </g-button-moema>
                </div>
            </div>
        </div>
    </div>
    <div class="login-box" style="width:60%; height:auto;">

      <div class="login-logo yellow-bg" style="margin-top:0;">
        <a href="#/"><img src="static/img/logo-login.png"></a>
      </div>
      <!-- /.login-logo -->
      <div class="login-box-body">
        
        <div class="box box-widget col-md-14" style="border:none;box-shadow:none">

          <div v-show="loading.tela" class="overlay" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;display: none; background: rgba(255, 255, 255, 0.7); z-index: 1000"><i class="fa fa-refresh fa-spin" style="top: 50%; left: 50%; position: absolute; font-size: 30px"></i></div>

          <div class="box-header with-border" align="center">
            <h3 class="box-title"> <b style="color: dimgrey">SGP - Autocredenciamento</b></h3>
          </div>
          <div v-if="telaTodosEditais" class="box-body">
            <div class="form-group required-field" :class="{ 'has-error' : errors.first('Razão social')}">
                <label for="edital_selecao" class="control-label col-md-2">{{rotuloSelecaoEdital}}</label>
                <div class="col-md-6">
                    <select name="select" v-model="editalAtivoSelecionado" @change="selecionaAtivo()" placeholder="Selecione um Edital Ativo">
                      <option value="" disabled>Selecione um Edital Ativo</option>
                      <option v-for="edital in listaEditais" :value="edital.parametro">{{edital.ds_numero_edital}}</option>
                    </select>
                </div>
              </div>
          </div>
          <div class="box-body form-horizontal" ssm-lte-loading="loading-info" v-if="!telaTodosEditais">
            <div class="row">
              <div class="box-header with-border">

                <!-- Razão social -->
                <div class="form-group required-field" :class="{ 'has-error' : errors.first('Razão social')}">
                  <label for="edital_selecao" class="control-label col-md-2">{{rotuloSelecaoEdital}}</label>
                  <div class="col-md-6">
                    <multiselect v-model="entidade.proposta.edital" :options="listaEditais"
                                 :multiple="false"
                                 :close-on-select="true"
                                 :clear-on-select="true"
                                 :hide-selected="false"
                                 :preserve-search="true"
                                 placeholder="Selecione um Edital"
                                 @select="selecionado($event)"
                                 label="ds_numero_edital"
                                 track-by="ds_numero_edital"
                                 :custom-label="etiquetaEdital"
                                 selectedLabel="Selecionado"
                                 selectLabel="Aperte ENTER para selecionar"
                                 deselectLabel="Aperte ENTER para remover"
                                 name="editais"
                                 data-vv-as="Editais"
                                 :preselect-first="true"
                                 :disabled="desabilitaListaEditais"
                                 v-validate="'required'">
                      <template slot-scope="props"><span class="multiselect__tag"><span>{{ props.ds_numero_edital }}</span><span class="custom__remove" @click="props.remove(props)">❌</span></span></template>
                    </multiselect>
                  </div>
                </div>


                <div class="col-md-12" v-if="mostrarForm && mostrarArquivo">
                  <fieldset>
                    <legend>Anexe a planilha de cadastro da entidade para preenchimento automático dos dados abaixo:</legend>
                    <div class="box-header with-border">

                      <importacao-excel :modelo="'cadastro_entidade'" @analiseExcel="validacaoArquivo = $event" @objetoExcel="excel = $event"></importacao-excel>

                    </div>
                  </fieldset>
                </div>

              </div>
              <!--<div align="right">-->
              <!--<br>-->
              <!--<font style="color: red; font-size: large">&nbsp*</font><i>&nbsp Campos obrigatórios</i>-->
              <!--</div>-->
              <div class="col-md-12" v-if="mostrarForm === true">
                <div name="frmAutoRegister" class="form-horizontal col-md-14">
                  <div class="col-md-6">
                    <br>
                    <fieldset>
                      <legend>Dados da entidade:</legend>
                      <!-- CNPJ -->
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('CNPJ')}">
                        <label for="CNPJ" class="control-label col-md-4">CNPJ:</label>
                        <div class="col-md-6">
                          <the-mask @blur.native="verificaCNPJEntidade" v-model="entidade.ds_cnpj" name="CNPJ" data-vv-as="CNPJ" class="form-control" type="text" ref="CNPJ"
                                    :title="'Informe o CNPJ da sua entidade.'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                                    v-validate="'required|cnpj|min:14|max:14'" mask="##.###.###/####-##">
                          </the-mask>
                          <span v-if="errors.first('CNPJ')" class="label label-danger"> {{ errors.first('CNPJ') }}</span>
                        </div>
                        <!-- verifica se o CNPJ informado existe na base e mostra mensagem e link - suporte 58985 -->
                        <div class="col-md-offset-4 col-md-9" v-if="entidadesExistentes.length > 0 && _.has(entidadesExistentes[0], 'ds_nome') && !_.isNull(entidadesExistentes[0].ds_nome) ">
                          <span class="label label-success">Ótimo! Verificamos que a entidade tem um cadastro na Fundação BB.</span>
                          <span class="label label-success">Clique no link abaixo para acessar e atualizar as informações .</span>
                          <p v-for="entidade in entidadesExistentes">
                            <router-link :title="'<h5>Clique aqui para atualizar o cadastro da entidade</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }" :to="{name: 'cadastro-entidade-edita', params: { id: entidade.id }}" target="_blank">
                              {{entidade.ds_cnpj | cnpj}} -
                              {{entidade.ds_nome}}
                              ({{entidade.ds_nome_fantasia}})
                              <i class="fa fa-external-link"></i></router-link>
                          </p>
                          <span class="label label-warning">Para inscrever sua proposta clique no botão Criar Proposta no rodapé dessa página.</span>
                          <span class="label label-warning">Nesse caso não é necessário preencher os dados da Entidade e nem do representante legal.</span>
                        </div>
                      </div>

                      <!-- Razão social -->
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('Razão social')}">
                        <label for="nome" class="control-label col-md-4">Razão social:</label>
                        <div class="col-md-8">
                          <input v-model="entidade.ds_nome"
                                 :disabled="mostrarArquivo || mostrarCriarProposta"
                                 :title="'Informe a Razão Social da sua entidade.'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                                 name="Razão social" class="form-control" type="text" ref="Razão social" v-validate="'required|min:1|max:255'">
                          <span v-if="errors.first('Razão social')" class="label label-danger"> {{('O campo Razão Social é obrigatório') }}</span>
                        </div>
                      </div>

                      <!-- Data Expedição CNPJ -->
                      <!--<div class="form-group required-field" :class="{ 'has-error' : errors.first('cnpjExpeditionTime')}">-->
                      <!--<label for="cnpjExpeditionTime" class="control-label col-md-4">Expedição CNPJ:</label>-->
                      <!--<div class="col-md-6 col-lg-4">-->
                      <!--<div class="input-group">-->
                      <!--&lt;!&ndash;<datepicker  ref="cnpjExpeditionTime" name="cnpjExpeditionTime" :name="cnpjExpeditionTime" v-model="usuario.entidade.dt_data_expedicao_cnpj" :use-utc="true" style="background-color: white !important;" input-class="form-control" :language="$datePickerPtBR" format="dd/MM/yyyy" v-validate="'required'" :placeholder="dataPlaceholder" ></datepicker>&ndash;&gt;-->
                      <!--<date-picker  ref="cnpjExpeditionTime" name="cnpjExpeditionTime"-->
                      <!--:title="'Informe a Data de Expedição da sua entidade.'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }"-->
                      <!--v-model="entidade.dt_data_expedicao_cnpj" :use-utc="true"  input-class="form-control" :lang="'pt-br'" format="DD/MM/YYYY" v-validate="'required'" :placeholder="''" ></date-picker>-->
                      <!--<span v-if="errors.first('cnpjExpeditionTime')" class="label label-danger"> {{('O campo Expedição do CNPJ é obrigatório') }}</span>-->
                      <!--</div>-->
                      <!--</div>-->
                      <!--</div>-->

                      <!-- Nome fantasia -->
                      <!--<div class="form-group required-field" :class="{ 'has-error' : errors.first('Nome fantasia')}">-->
                      <!--<label for="Nome fantasia" class="control-label col-md-4">Nome fantasia:</label>-->
                      <!--<div class="col-md-8">-->
                      <!--<input v-model="entidade.ds_nome_fantasia" name="Nome fantasia"-->
                      <!--:title="'Informe o Nome Fantasia da sua entidade.'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }"-->
                      <!--ref="Nome fantasia" class="form-control" type="text" v-validate="'required|min:1|max:255'">-->
                      <!--<span v-if="errors.first('Nome fantasia')" class="label label-danger"> {{('O campo Nome fantasia é obrigatório') }}</span>-->
                      <!--</div>-->
                      <!--</div>-->


                      <!-- Email entidade -->
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('Email')}">
                        <label for="email" class="control-label col-md-4">E-Mail:</label>
                        <div class="col-md-8">
                          <input v-model="entidade.ds_email" name="Email" @change="verificaEmailEntidade"
                                 :disabled="mostrarArquivo || mostrarCriarProposta"
                                 :title="'Informe o E-mail da sua entidade.'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                                 class="form-control" type="text" delivery="account" v-validate="'required|email|min:1|max:255'" ref="Email">
                          <span v-if="errors.first('Email')" class="label label-danger"> {{ errors.first('Email') }}</span>
                          <span v-if="entidade.ds_email === usuario.ds_email && entidade.ds_email && usuario.ds_email" class="label label-danger"> {{('Os e-mails da entidade e do usuário não podem ser iguais!') }}</span>
                        </div>
                      </div>

                      <!-- Confirmacao email entidade -->
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('emailConfirmacaoEnt')}">
                        <label for="emailConfirmacaoEnt" class="control-label col-md-4">Confirmar E-Mail:</label>
                        <div class="col-md-8">
                          <input v-model="emailConfirmacaoEnt" @paste.prevent name="emailConfirmacaoEnt"
                                 :disabled="mostrarArquivo || mostrarCriarProposta"
                                 :title="'Confirme o E-mail da sua entidade.'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                                 class="form-control" type="text" delivery="account" method="uniqueUserEmail" v-validate="'required|email|min:1|max:255'" ref="emailConfirmacaoEnt">
                          <span v-if="errors.first('emailConfirmacaoEnt')" class="label label-danger"> {{('O campo confirmação do e-mail da entidade é obrigatório') }}</span>
                          <span v-if="entidade.ds_email !== emailConfirmacaoEnt && emailConfirmacaoEnt.length > 0" class="label label-danger"> {{('Os e-mails informados não são iguais!') }}</span>
                        </div>
                      </div>

                    </fieldset>
                  </div>

                  <div class="col-md-6">
                    <br>
                    <fieldset>
                      <legend>Representante Legal:</legend>

                      <!-- Nome do usuário -->
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('Nome')}">
                        <label for="Nome" class="control-label col-md-4">Nome:</label>
                        <div class="col-md-8">
                          <input v-model="usuario.ds_nome_usuario"
                                 :disabled="mostrarArquivo || mostrarCriarProposta"
                                 :title="'Informe o Nome do Usuário da sua entidade.'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                                 name="Nome" class="form-control" type="text" v-validate="'required'">
                          <span v-if="errors.first('Nome')" class="label label-danger"> {{('O campo Nome é obrigatório') }}</span>
                        </div>
                      </div>

                      <!-- CPF -->
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('Cpf')}">
                        <label for="Nome" class="control-label col-md-4">CPF:</label>
                        <div class="col-md-6">
                          <the-mask v-model="usuario.ds_cpf"
                                    :disabled="mostrarArquivo || mostrarCriarProposta"
                                    name="Cpf" class="form-control" type="text" data-vv-as="CPF"
                                    :title="'Informe o CPF do Usuário da sua entidade.'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                                    :mask="'###.###.###-##'" v-validate="'cpf|required'">
                          </the-mask>
                          <span v-if="errors.first('Cpf')" class="label label-danger"> {{ errors.first('Cpf') }}</span>
                        </div>
                      </div>

                      <!-- Login -->
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('Login')}">
                        <label for="Nome" class="control-label col-md-4">Login:</label>
                        <div class="col-md-6">
                          <input v-model="usuario.ds_login" name="Login" @change="verificaUsuario"
                                 :disabled="mostrarArquivo || mostrarCriarProposta"
                                 :title="'Crie um login para o seu usuário.'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                                 class="form-control" type="text" v-validate="'required'">
                          <span v-if="errors.first('Login')" class="label label-danger"> {{ errors.first('Login') }}</span>
                          <span v-if="entidade.ds_cnpj === usuario.ds_login && entidade.ds_cnpj" class="label label-danger"> {{('O login do usuário não pode ser o número do CNPJ da entidade.') }}</span>

                        </div>
                      </div>

                      <!-- telefone -->
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('Telefone')}">
                        <label for="Nome" class="control-label col-md-4">Telefone:</label>
                        <div class="col-md-6">
                          <the-mask v-model="usuario.ds_telefone" name="Telefone" ref="Telefone" class="form-control" type="text"
                                    :disabled="mostrarArquivo || mostrarCriarProposta"
                                    :title="'Informe o telefone do usuário.'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                                    v-validate="'required|min:10|max:11'" :mask="['(##) ####-####', '(##) #####-####']">
                          </the-mask>
                          <span v-if="errors.first('Telefone')" class="label label-danger"> {{ errors.first('Telefone') }}</span>
                        </div>
                      </div>

                      <!-- Email do usuário -->
                      <div class="form-group required" :class="{ 'has-error' : errors.first('userEmail')}">
                        <label for="userEmail" class="control-label col-md-4">E-Mail:</label>
                        <div class="col-md-8">
                          <input v-model="usuario.ds_email" name="userEmail" @change="verificaEmailUsuario"
                                 :disabled="mostrarArquivo || mostrarCriarProposta"
                                 :title="'Informe o E-mail do Usuário da sua entidade.'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                                 class="form-control" type="text" v-validate="'required|email|min:1|max:255'">
                          <span v-if="errors.first('userEmail')" class="label label-danger"> {{ errors.first('userEmail') }}</span>
                          <span v-if="entidade.ds_email === usuario.ds_email && entidade.ds_email" class="label label-danger"> {{('Os e-mails da entidade e do usuário não podem ser iguais.') }}</span>
                        </div>
                      </div>

                      <!-- Confirmacao email -->
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('emailConfirmacao')}">
                        <label for="emailConfirmacao" class="control-label col-md-4">Confirmar E-Mail:</label>
                        <div class="col-md-8">
                          <input v-model="emailConfirmacao" @paste.prevent name="emailConfirmacao"
                                 :disabled="mostrarArquivo || mostrarCriarProposta"
                                 :title="'Confirme o E-mail do Usuário da sua entidade.'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                                 class="form-control" type="text" delivery="account" method="uniqueUserEmail" v-validate="'required|email|min:1|max:255'" ref="emailConfirmacao">
                          <span v-if="errors.first('emailConfirmacao')" class="label label-danger"> {{('O campo confirmação do e-mail da entidade é obrigatório') }}</span>
                          <span v-if="usuario.ds_email !== emailConfirmacao && emailConfirmacao.length > 0" class="label label-danger"> {{('Os e-mails informados não são iguais!') }}</span>
                          <span v-if="entidade.ds_email === usuario.ds_email && entidade.ds_email && usuario.ds_email" class="label label-danger"> {{('Os e-mails da entidade e do usuário não podem ser iguais!') }}</span>
                        </div>
                      </div>

                    </fieldset>
                  </div>
                </div>
              </div>
              <!-- /.col -->
            </div>
            <!-- /.row -->
          </div>
          <!--<div align="left">-->
          <!--<br>-->
          <!--<font style="color: red; font-size: large">&nbsp*</font><i>&nbsp Campos obrigatórios</i>-->
          <!--</div>-->
        </div>
      </div>
      <!-- /.box-body -->
      <div class="box-footer" v-if="mostrarForm === true && !telaTodosEditais">
        <!-- Concluir Autocredenciamento normal -->
        <g-button-moema v-if="(mostrarForm && !mostrarArquivo && !mostrarCriarProposta && entidadesVoluntariadoDump.length <= 0) && !gravando" color="success" size="button--size-ss" @click.native="grava()"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</g-button-moema>
        <!-- Criar Proposta Autocredenciamento normal -->
        <!-- <g-button-moema v-if="(mostrarForm && !mostrarArquivo && mostrarCriarProposta)" color="warning" size="button--size-ss" @click.native="criaPropostaEdital()"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Criar Proposta </g-button-moema> -->
        <!-- Concluir Autocredenciamento quando tiver botão de arquivo e a validação for OK -->
        <g-button-moema v-if="(mostrarForm && mostrarArquivo && validacaoArquivo)" color="success" size="button--size-ss" @click.native="gravaViaArquivo()"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</g-button-moema>

        <!-- Consultar Entidades Pendentes de Credenciamento -->
        <!-- <g-button-moema v-if="(!_.isNull(usuarioLogado) && usuarioLogado.userType === 'FUNDACAO')" color="warning" size="button--size-ss" @click.native="consultaEntidadesPendentes()"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Consultar Credenciamentos Pendentes </g-button-moema> -->

        <!-- <div v-if="(this.entidadesVoluntariadoDump.length > 0)" class="entidade-container">
          <div class="box-header with-border" align="center">
            <h3 class="box-title"> <b style="color: dimgrey">({{this.entidadesVoluntariadoDump.length}}) Entidades Pendentes de Credenciamento Encontradas</b></h3>
          </div>
          <b-container fluid class="entidade-table">
                    <b-table show-empty
                             stacked="md"
                             striped
                             :bordered="tableProjetos.bordered"
                             :items="entidadesVoluntariadoDump"
                             :fields="fieldsProjetos"
                             :current-page="tableProjetos.currentPage"
                             :per-page="tableProjetos.perPage"
                             :filter="tableProjetos.filter"
                             :filter-function="filtroPorItem"
                             @filtered="onFiltered"
                             empty-filtered-text="Nada foi encontrado. Refaça sua pesquisa!"
                             empty-text="Nenhum registro encontrado"
                             :sort-by.sync="tableProjetos.sortBy"
                             :sort-desc.sync="tableProjetos.sortDesc"
                    >
                  </b-table>
                  <b-row>
                    <b-col md="6" class="my-1" right>
                      <b-pagination :total-rows="tableProjetos.totalRows" :per-page="tableProjetos.perPage" v-model="tableProjetos.currentPage" class="my-3" />
                    </b-col>
                  </b-row>
                  <g-button-moema v-if="(!_.isNull(usuarioLogado) && usuarioLogado.userType === 'FUNDACAO' && !aberturaMassificadaExecutada)" color="success" size="button--size-ss" @click.native="cadastroMassificado()"><i class="fa fa-users" aria-hidden="true"></i> Executar Credenciamento Massificado</g-button-moema>
            </b-container>
        </div> -->

      </div>

      <!-- /.box-footer -->


    </div>
    <vue-snotify></vue-snotify>
    <!-- /.login-box -->
  </div>
</template>

<script>
  import ImportacaoExcel from './cadastro/importacao/ImportacaoExcel'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      ImportacaoExcel
    },
    name: 'auto-credenciamento',
    data () {
      return {
        loading: {
          tela: false
        },
        processos: [],
        tipo: [],
        validacaoArquivo: false,
        excel: {},
        jaExiste: false,
        jaExisteMail: false,
        jaExisteMailUsu: false,
        campoErro: null,
        entidade: {
          ds_cnpj: '',
          usuarios: [],
          proposta: {
            edital: []
          }
        },
        usuario: {
          ds_cpf: ''
        },
        mostrarForm: false,
        mostrarArquivo: false,
        mostrarCriarProposta: false,
        listaEditais: [],
        erroEmail: false,
        emailConfirmacao: '',
        desabilitaListaEditais: false,
        rotuloSelecaoEdital: 'Selecione um Edital:',
        emailConfirmacaoEnt: '',
        entidadesExistentes: [],
        entidadesVoluntariadoDump: [],
        tableProjetos: {
          currentPage: 1,
          perPage: 10,
          totalRows: 0,
          sortBy: 'createdAt',
          sortDesc: true,
          filter: null,
          bordered: true
        },
        fieldsProjetos: [
            { key: 'cnpj', label: 'CNPJ', thStyle: 'width: 100px; text-align: center', sortable: true, 'class': 'text-center' },
            { key: 'razao_social', label: 'Nome Entidade', thStyle: 'text-align: center', sortable: true, 'class': 'word-wrap:break-word text-center' },
            { key: 'nome_representante_legal', label: 'Representante', thStyle: 'width: 150px; text-align: center', sortable: true, 'class': 'word-wrap:break-word text-center' },
            { key: 'cadastro_criado', label: 'Criado', thStyle: 'width: 50px; text-align: center', sortable: true, 'class': 'word-wrap:break-word text-center' }
            // { key: 'actions', label: 'Acessar:', thStyle: 'width: 300px; text-align: center', 'class': 'text-center' }
        ],
        entidadeMassificada: {},
        erroMassificado: false,
        aberturaMassificadaExecutada: false,
        telaTodosEditais: false,
        editalAtivoSelecionado: '',
        emailsEntidades: '',
        gravando: false
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    watch: {
      excel () {
        if (_.has(this.excel, 'dadosBasicos')) {
          this.entidade.ds_nome = this.excel.dadosBasicos[2]['valor']
          this.entidade.ds_cnpj = this.excel.dadosBasicos[3]['valor']
          this.entidade.ds_email = this.excel.dadosBasicos[11]['valor']
          this.emailConfirmacaoEnt = this.entidade.ds_email
          //
          this.usuario.ds_nome_usuario = this.excel.representanteLegal[0]['Nome']
          this.usuario.ds_cpf = this.excel.representanteLegal[0]['CPF']
          this.usuario.ds_login = this.excel.representanteLegal[0]['Nome']
          this.usuario.ds_telefone = this.excel.representanteLegal[0]['Telefone']
          this.usuario.ds_email = this.excel.representanteLegal[0]['E-mail']
          this.emailConfirmacao = this.usuario.ds_email
        } else {
          this.entidade.ds_nome = ''
          this.entidade.ds_cnpj = ''
          this.entidade.ds_email = ''
          this.emailConfirmacaoEnt = ''
          this.usuario.ds_nome_usuario = ''
          this.usuario.ds_cpf = ''
          this.usuario.ds_login = ''
          this.usuario.ds_telefone = ''
          this.usuario.ds_email = ''
          this.emailConfirmacao = ''
        }
        this.$forceUpdate()
      },
      validacaoArquivo () {
        console.log('Arquivo validado', this.validacaoArquivo)
      }
    },
    created () {
      let parametro = _.keys(this.$route.query)
      console.log(parametro)
      if (parametro.length === 0) {
        // Descomentas as 2 linhas abaixo quando encerrar o edital do PIS2020
        // alert('Não foi especificado um edital em particular. Entre em contato com a FBB!')
        // this.$router.push('/login')
        // Comentar ou excluir as duas linha abaixo quando encerrar o edital do PIS2020
        // this.$router.push('/autocredenciamento?pis-2020')
        // location.reload()
        this.buscaTodosAtivos()
        this.telaTodosEditais = true
      } else {
        this.buscaEditaisAtivos(parametro[0])
      }
    },
    methods: {
      limpar () {
        this.entidade.ds_nome = ''
        this.entidade.ds_cnpj = ''
        this.entidade.ds_login = ''
        this.usuario.ds_telefone = ''
        this.entidade.dt_data_expedicao_cnpj = ''
        this.entidade.ds_nome_fantasia = ''
        this.entidade.ds_email = ''
        this.emailConfirmacaoEnt = ''
        this.usuario.ds_nome_usuario = ''
        this.usuario.ds_cpf = ''
        this.usuario.ds_email = ''
        this.usuario.ds_login = ''
        this.emailConfirmacao = ''
      },
      etiquetaEdital (option) {
        return `${option.ds_numero_edital}`
      },
      selecionado (selectedOption) {
        this.mostrarForm = true
        this.mostrarArquivo = (selectedOption.id === 3 || selectedOption.id === 4) // Voluntariado 2020 ou PIS 2020
      },
      buscaEditaisAtivos (parametro) {
        this.loading.tela = true
        axiosLaravel.post('edital/ativos', {'parametro': parametro}).then((response) => {
          console.log('response.data', response.data)
          this.listaEditais = response.data
          //
          if (this.listaEditais.length === 0) {        // Não tem edital para o parâmetro informado (vazio)
            alert('Não localizamos um edital ativo e vigente para o link informado. Entre em contato com a FBB!')
          } else if (this.listaEditais.length > 1) { // Tem mais de um edital com o mesmo parâmetro
            //  Não faz nada
          } else { // Existe apenas um Edital para o parâmetro
            this.desabilitaListaEditais = true
            this.rotuloSelecaoEdital = 'Edital:'
            this.entidade.proposta.edital = this.listaEditais
            this.selecionado(this.entidade.proposta.edital[0])
          }
          //
          this.loading.tela = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.loading.tela = false
            this.$root.trataErro(error)
          })
      },
      buscaTodosAtivos () {
        this.loading.tela = true
        axiosLaravel.get('edital/todosAtivos').then((response) => {
          console.log('response.data', response.data)
          this.listaEditais = response.data
          //
          if (this.listaEditais.length === 0) {        // Não tem edital para o parâmetro informado (vazio)
            alert('Não localizamos um edital ativo e vigente para o link informado. Entre em contato com a FBB!')
          }
          //
          this.loading.tela = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.loading.tela = false
            this.$root.trataErro(error)
          })
      },
      gravaViaArquivo () {
        this.loading.tela = true
        this.$snotify.clear()
        this.$snotify.async('Registrando dados da planilha e expedindo e-mails de credenciamento. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.post('importacao/excel', {'arquivo': this.excel, 'modelo': 'cadastro_entidade', 'edital': this.entidade.proposta.edital[0]}).then((response) => {
          let resultado = response.data
          this.loading.tela = false
          this.$snotify.clear()
          if (resultado.situacao === 'OK') {
            this.$snotify.success(resultado.mensagem, {timeout: 10000})
            alert('E-mails de credenciamento foram enviados para os usuários informados. Verifique em suas caixas de e-mail!')
            window.location.href = 'http://localhost:8082/login'
          } else {
            this.$snotify.error(resultado.mensagem, {timeout: 20000})
          }
          this.$forceUpdate()
        })
          .catch((error) => {
            this.loading.tela = false
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      grava () {
        this.gravando = true
        this.entidade.ds_tipo_registro = 'AUTO_CREDENCIAMENTO'
        this.entidade.ds_fase_registro = 'CREDENCIAMENTO'
        this.entidade.ds_status = 'INCOMPLETO'
        this.$validator.validateAll().then(result => {
          if (result) {
            if (this.usuario.ds_email !== this.emailConfirmacao) {
              this.$snotify.error('O formulário possui erros. Favor verificar!')
              return
            }
            if (this.entidade.ds_email !== this.emailConfirmacaoEnt) {
              this.$snotify.error('O formulário possui erros. Favor verificar!')
              return
            }
            if (this.jaExiste === true) {
              this.$snotify.error('O login informado já existe. Favor verificar!')
              return
            }
            // Se o CNPJ ja estiver cadasdastrado - suporte 59895
            if (this.entidadesExistentes.length > 0 && _.has(this.entidadesExistentes[0], 'ds_nome') && !_.isNull(this.entidadesExistentes[0].ds_nome)) {
              this.$snotify.error('O CNPJ informado possui cadastrado na FBB. Nesse caso acesse o sistema com login e senha e faça a atualização do cadastro da Entidade!')
              return
            }
            if (this.jaExisteMail === true) {
              this.$snotify.error('O e-mail da entidade informado já existe. Favor verificar!')
              return
            }
            if (this.jaExisteMailUsu === true) {
              this.$snotify.error('O e-mail do usuário informado já existe. Favor verificar!')
              return
            }
            // Retira caracteres
            this.usuario.ds_cpf = this.usuario.ds_cpf.replace('.', '')
            this.usuario.ds_cpf = this.usuario.ds_cpf.replace('.', '')
            this.usuario.ds_cpf = this.usuario.ds_cpf.replace('-', '')
            this.entidade.ds_cnpj = this.entidade.ds_cnpj.replace('.', '')
            this.entidade.ds_cnpj = this.entidade.ds_cnpj.replace('.', '')
            this.entidade.ds_cnpj = this.entidade.ds_cnpj.replace('.', '')
            this.entidade.ds_cnpj = this.entidade.ds_cnpj.replace('/', '')
            this.entidade.ds_cnpj = this.entidade.ds_cnpj.replace('-', '')
            this.entidade.ds_login = this.entidade.ds_cnpj
            let obj = _.cloneDeep(this.usuario)
            const resultArray = []
            resultArray.push(obj)
            this.entidade.usuarios = _.cloneDeep(resultArray)
            this.$snotify.async('Credenciando a entidade. Por favor, aguarde...', {timeout: 0})
            this.loading.tela = true
            axiosLaravel.post('autocredenciamento/', this.entidade).then((response) => {
              this.$snotify.clear()
              this.$snotify.success('Entidade credenciada com sucesso!')
              // this.gravando = false
              setTimeout(() => { window.location.href = 'https://projetos.fbb.org.br' }, 1000)
              this.loading.tela = false
            })
              .catch((error) => {
                this.$snotify.clear()
                this.loading.tela = false
                this.gravando = false
                this.$root.trataErro(error)
              })
          } else {
            this.gravando = false
            console.log('nao validou')
          }
        })
      },
      verificaUsuario () {
        axiosLaravel.post('/verifica-usuario/', {'parametro': this.usuario.ds_login}).then((response) => {
          // Pega a lista de usuários
          if (response.data.length > 0) {
            this.jaExiste = true
            let field = this.$validator.fields.find({ name: 'Login' })
            field.setFlags({invalid: true})
            this.errors.add({
              field: 'Login',
              msg: response.data,
              id: field.id,
              scope: field.scope
            })
          } else {
            this.jaExiste = false
          }
        })
          .catch((error) => {
            if (error) {
              this.$root.trataErro(error)
            }
          })
      },
      verificaEmailEntidade () {
        axiosLaravel.post('/verifica-usuario/', {'parametro': this.entidade.ds_email}).then((response) => {
          // Pega a lista de usuários
          if (response.data.length > 0) {
            this.jaExisteMail = true
            let field = this.$validator.fields.find({ name: 'Email' })
            field.setFlags({invalid: true})
            this.errors.add({
              field: 'Email',
              msg: response.data,
              id: field.id,
              scope: field.scope
            })
          } else {
            this.jaExisteMail = false
          }
        })
          .catch((error) => {
            if (error) {
              this.$root.trataErro(error)
            }
          })
      },
      verificaEmailUsuario () {
        axiosLaravel.post('/verifica-usuario/', {'parametro': this.usuario.ds_email}).then((response) => {
          // Pega a lista de usuários
          if (response.data.length > 0) {
            this.jaExisteMailUsu = true
            let field = this.$validator.fields.find({ name: 'userEmail' })
            field.setFlags({invalid: true})
            this.errors.add({
              field: 'userEmail',
              msg: response.data,
              id: field.id,
              scope: field.scope
            })
          } else {
            this.jaExisteMailUsu = false
          }
        })
          .catch((error) => {
            if (error) {
              this.$root.trataErro(error)
            }
          })
      },
      // suporte 63930 mostrar botão de Criar Proposta somente se a entidade já for cadastrada
      // verifica se o CPNJ existe e retorna entidades - suporte 58985
      verificaCNPJEntidade () {
        this.loading.tela = true
        axiosLaravel.post('/entidade/cnpj/', {'cnpj': this.entidade.ds_cnpj}).then((response) => {
          this.entidadesExistentes = response.data
          if (this.entidadesExistentes.length > 0) {
            this.mostrarCriarProposta = true
          } else {
            this.mostrarCriarProposta = false
          }
          this.loading.tela = false
        })
          .catch((error) => {
            this.loading.tela = false
            if (error) {
              this.$root.trataErro(error)
            }
          })
        this.verificaEmailDirigentesEntidade()
      },
      verificaEmailDirigentesEntidade () {
        this.loading.tela = true
        axiosLaravel.post('/entidade/emailDirigentesEntidade/', {'cnpj': this.entidade.ds_cnpj}).then((response) => {
          console.log('EMAILS DIRIGENTES', response.data)
          this.emailsEntidades = response.data
          this.loading.tela = false
        })
          .catch((error) => {
            this.loading.tela = false
            if (error) {
              this.$root.trataErro(error)
            }
          })
      },
      // Cria proposta vazia para o edital - suporte 63930
      criaPropostaEdital () {
        this.loading.tela = true
        this.gravando = true
        this.$snotify.async('Criando proposta deste edital para a entidade. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.post('criaPropostaEdital/', this.entidade).then((response) => {
          this.$snotify.clear()
          this.$snotify.success('Proposta criada com sucesso!')
          setTimeout(() => { this.$router.go(-1) }, 1000)
          this.limpar()
          this.verificaCNPJEntidade()
          this.mostrarCriarProposta = false
          // this.gravando = false
          this.loading.tela = false
          setTimeout(() => { window.location.href = 'https://projetos.fbb.org.br' }, 1000)
        })
          .catch((error) => {
            this.loading.tela = false
            this.mostrarCriarProposta = false
            this.gravando = false
            this.limpar()
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      // 70715 - Cadastro de Entidades / Propostas Voluntariado BB - FBB 2024
      consultaEntidadesPendentes () {
        this.loading.tela = true
        this.$snotify.clear()
        this.$snotify.async('Consultando Registros em Massificados de Credenciamento...', {timeout: 0})
        axiosLaravel.get('consultaEntidadesCredenciamentoDump/').then((response) => {
          this.entidadesVoluntariadoDump = response.data
          this.tableProjetos.totalRows = this.entidadesVoluntariadoDump.length
          this.$snotify.clear()
          this.loading.tela = false
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
            this.loading.tela = false
          })
      },
      async cadastroMassificado () {
        if (this.entidadesVoluntariadoDump.length <= 0) {
          this.$snotify.error('Sem Entidades Pendentes de Credenciamento')
        }
        this.aberturaMassificadaExecutada = true

        // 1 - Percorre lista de Entidade
        for (let i = 0; i < this.entidadesVoluntariadoDump.length; i++) {
          let entidade = this.entidadesVoluntariadoDump[i]
          try {
            // 2 - Valida Dados
            this.validarEntidade(entidade)
            // 3 - Executa Credenciamento chamando a função grava
            await this.gravaMassificado(entidade)
            if (this.erroMassificado === true) {
              this.entidadesVoluntariadoDump[i].cadastro_criado = 'ERRO'
            } else {
              this.entidadesVoluntariadoDump[i].cadastro_criado = 'S'
            }
          } catch (error) {
            this.entidadesVoluntariadoDump[i].cadastro_criado = 'ERRO'
            console.error('Erro ao processar a entidade' + this.entidade.razao_social + ' Erro: ' + error.message)
          }
        }
        this.limpar()
      },

      removerCaracteresEspeciais (str) {
        return str.replace(/[^\w\s]/gi, '')
      },
      limparString (str) {
        return str.replace(/[,"“”'´`~!@#$%^&*()_+={}[\]:;<>,.?\\|]/g, '').replace(/[^a-zA-Z]([áàâãäéèêëíìîïóòôõöúùûü])[^a-zA-Z]/g, ' ')
      },

      validarEntidade (entidade) {
        // Atribui dados vindos da entidade nos campos utilizados para cadastrar
        // ENTIDADE
        // Razao Social
        this.entidade.ds_nome = this.limparString(entidade.razao_social.toUpperCase()).trim()
        // CNPJ
        this.entidade.ds_cnpj = this.removerCaracteresEspeciais(entidade.cnpj)
        // E-MAIL
        this.entidade.ds_email = entidade.email_entidade
        this.emailConfirmacaoEnt = entidade.email_entidade
        // REPRESENTANTE LEGAL
        // Nome
        this.usuario.ds_nome_usuario = entidade.nome_representante_legal.trim()
        // CPF
        this.usuario.ds_cpf = this.removerCaracteresEspeciais(entidade.cpf_representante_legal)
        // Login
        // this.usuario.ds_login = this.removerCaracteresEspeciais(entidade.cpf_representante_legal)
        this.usuario.ds_login = entidade.email_representante_legal
        // Telefone
        this.usuario.ds_telefone = entidade.telefone_representante_legal
        // E-mail
        let emailRepresentanteLegal = entidade.email_representante_legal
        // let confirmarEmailRepresentanteLegal = entidade.confirmar_email_representante_legal
        // if (entidade.email_entidade === entidade.email_representante_legal) {
        //   emailRepresentanteLegal = '_' + emailRepresentanteLegal
        //   confirmarEmailRepresentanteLegal = '_' + confirmarEmailRepresentanteLegal
        // }
        this.usuario.ds_email = emailRepresentanteLegal
        this.emailConfirmacao = emailRepresentanteLegal
      },

      async gravaMassificado (entidade) {
        this.erroMassificado = false
        this.$snotify.clear()
        // Retira caracteres
        this.usuario.ds_cpf = this.usuario.ds_cpf.replace('.', '')
        this.usuario.ds_cpf = this.usuario.ds_cpf.replace('.', '')
        this.usuario.ds_cpf = this.usuario.ds_cpf.replace('-', '')
        this.entidade.ds_cnpj = this.entidade.ds_cnpj.replace('.', '')
        this.entidade.ds_cnpj = this.entidade.ds_cnpj.replace('.', '')
        this.entidade.ds_cnpj = this.entidade.ds_cnpj.replace('.', '')
        this.entidade.ds_cnpj = this.entidade.ds_cnpj.replace('/', '')
        this.entidade.ds_cnpj = this.entidade.ds_cnpj.replace('-', '')
        this.entidade.ds_login = '_' + this.entidade.ds_cnpj

        // let camposEspecificos = [
        //   'valor_fundacao_bb',
        //   'valor_contrapartida',
        //   'prazo_projeto',
        //   'total_pessoas_atendidas',
        //   'atende_mulheres',
        //   'quantidade_mulheres',
        //   'atende_negras',
        //   'quantidade_negras',
        //   'atende_indigenas',
        //   'quantidade_indigenas',
        //   'atende_lgbtqiapn',
        //   'quantidade_lgbtqiapn',
        //   'atende_pcd',
        //   'quantidade_pcd',
        //   'atende_neurodivergentes',
        //   'quantidade_neurodivergentes',
        //   'atende_jovens',
        //   'quantidade_jovens',
        //   'atende_terceira_idade',
        //   'quantidade_terceira_idade',
        //   'declaracao_faturamento',
        //   'declaracao',
        //   'ata_eleicao',
        //   'documento_constitutivo',
        //   'endereco_entidade',
        //   'cep',
        //   'municipio_entidade',
        //   'estado_entidade'
        // ]
        // let resumo = ''
        // camposEspecificos.forEach(campo => {
        //   if (entidade[campo] !== null && entidade[campo] !== undefined) {
        //     let campoEntidade = entidade[campo]
        //     if (campo === 'endereco_entidade') {
        //       campoEntidade = this.limparString(campoEntidade)
        //     }
        //     resumo += campo.replace(/_/g, ' ').toUpperCase() + ' - ' + campoEntidade + '\n\n'
        //   }
        // })
        // console.log(resumo)
        // cria objeto customizado com os dados da proposta
        this.entidadeMassificada = {
          ds_tipo_registro: 'AUTO_CREDENCIAMENTO',
          ds_fase_registro: 'CREDENCIAMENTO',
          ds_status: 'INCOMPLETO',
          ds_nome: this.entidade.ds_nome,
          ds_cnpj: this.entidade.ds_cnpj,
          ds_email: this.entidade.ds_email,
          ds_login: this.entidade.ds_login,
          // colocar os nomes dos campos da tb_proposta (será inserido automaticamente)
          ds_entidade_email: this.entidade.ds_email,
          // ds_entidade_endereco: entidade.endereco_entidade,
          ds_entidade_cep: entidade.cep,
          ds_entidade_cidade: entidade.municipio_entidade,
          ds_estado_entidade: entidade.estado_entidade.slice(-2),
          ds_entidade_telefone: this.removerCaracteresEspeciais(entidade.telefone_representante_legal),
          // ds_apresentacao: entidade.descricao_entidade,
          // ds_justificativa: entidade.justificativa,
          // ds_introducao: entidade.proposta,
          ds_entidade_representante_legal: this.usuario.ds_nome_usuario.toUpperCase()
          // nr_periodos: entidade.prazo_projeto
          // nr_participantes: entidade.total_pessoas_atendidas,
          // ds_cpf_coordenador: this.usuario.ds_cpf,
          // ds_email_coordenador: this.usuario.ds_email,
          // ds_nome_coordenador: this.usuario.ds_nome_usuario,
          // ds_telefone_coordenador: this.usuario.ds_telefone,
          // ds_resumo: resumo
        }
        let objMarcacao = {
          cnpj: entidade.cnpj,
          matricula: this.usuarioLogado.dadosBB.matricula
        }
        let obj = _.cloneDeep(this.usuario)
        const resultArray = []
        resultArray.push(obj)
        this.entidadeMassificada.usuarios = _.cloneDeep(resultArray)
        this.entidadeMassificada.proposta = this.entidade.proposta
        this.$snotify.async('Credenciando a entidade. Por favor, aguarde...', {timeout: 0})
        await axiosLaravel.post('autocredenciamento/', this.entidadeMassificada).then((response) => {
          this.$snotify.clear()
          this.$snotify.success('Entidade credenciada com sucesso!')
          axiosLaravel.post('marcaEntidadeCadastrada/', objMarcacao).then((response) => {
            console.log(response)
          })
          setTimeout(() => { this.$router.go(-1) }, 1000)
        })
          .catch((error) => {
            this.erroMassificado = true
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      selecionaAtivo () {
        this.$router.push('/autocredenciamento?' + this.editalAtivoSelecionado)
        location.reload()
        // console.log(this.editalAtivoSelecionado)
      },
      cancelarEnvioEntidadeCadastrada () {
        window.location.reload()
      }
    }
  }
</script>

<style>
  .login-box div[class*="required"] label.control-label:after {
    content:" *";
    font-weight: bold;
    color: red;
  }

  .entidade-container {
    padding: 50px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .entidade-table {
    min-height: 800px;
  }
  .logo-container-edital {
    width: 100%;
    border-radius: 5px;
    padding: 30px;
  }
  .edital-modal-container {
    z-index: 100;
    width: 100vw;
    min-height: 100vh;
    top:0;
    left:0;
    position: absolute;
    background-color: rgba(0,0,0,0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .container-edital {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .edital-content-container {
    margin-top: 30px;
    gap:5px;
  }

  .edital-modal-mensagem {
    width: 65%;
    min-height: 60%;
    border-radius: 10px;
    background-color: white;
    padding: 20px;
  }

  .edital-titulo {
    color: white;
    background-color: #ff9900;
    border-radius: 5px;
    padding: 5px;
    width: 100%;
    text-align: center;
    font-size: 2rem;
  }

  .edital-subtitulo {
    padding: 5px;
    border-radius: 5px;
    font-size: 1.5rem;
  }

  .botao-edital-container {
    width: 90%;
    gap: 5px;
  }

  .edital-link {
    padding: 20px;
    font-size: 1.5rem;
  }

  .email-edital-container {
    gap: 5px;
    padding: 20px;
    width: 100%;
    border-radius: 5px;
    background-color: #ECF0F5;
  }

</style>
<style src="../../static/css/flexAux.css"></style>
