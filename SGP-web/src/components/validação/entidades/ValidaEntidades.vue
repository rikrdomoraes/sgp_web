<template>
  <div class="content-wrapper" style="min-height: 870px;">
    <!-- ngView: --><div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
    <section class="content-header ng-scope">
      <h1>Entidades</h1>
      <b-breadcrumb :items="breadcrumb"/>
    </section>

    <!-- main content -->
    <section class="content ng-scope">

      <div class="row">
        <div class="col-md-12">
          <div v-if="(historico_atualizado.length > 0 && historico_atualizado[0] && historico_atualizado[0].termino == null && historico_atualizado[1].observacao != null && historico_atualizado[1].observacao != '')" class="alert alert-dismissible alert-info">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
            <h4><i class="fa fa fa-info"></i>&nbsp&nbsp Atenção!</h4>
            <h5><span v-html=historico_atualizado[1].observacao></span></h5>
          </div>

          <!-- grid -->
          <!-- ngIf: show.grid --><div ng-if="show.grid" class="ng-scope ng-isolate-scope"><div class="box box-primary">
          <div class="box-header with-border">
            <h3 class="box-title"><i class="fa fa-search" aria-hidden="true"></i> Validação da Entidade  &nbsp;&nbsp;<a :href="urlLaravel + '/docs/manual_cadastro_entidade_dirigentes_usuarios_v1.pdf'" target="_blank"><i class="fa fa-download" aria-hidden="true"></i> Manual</a></h3>
          </div>

          <div class="row">
            <div class="col-md-12 box-body">
              <div class="col-md-3">
                <span class="fa fa-warning indicador_alteracao"></span><label class="control-label">&nbsp Dados alterados pela entidade</label>
              </div>
              <div class="col-md-3">
                <span class="fa fa-warning indicador_insercao"></span><label class="control-label">&nbsp Dados novos inseridos pela entidade</label>
              </div>
              <div class="col-md-3">
                <span class="fa fa-warning indicador_exclusao"></span><label class="control-label">&nbsp Dados excluídos pela entidade</label>
              </div>
            </div>
          </div>

          <!-- /.box-header -->
          <fieldset :disabled="boqueia === true">
            <div class="box-body" id="dadosCadastrais">
              <!--<div v-if="boqueia === true" class="alert alert-dismissible alert-warning">-->
              <!--<button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>-->
              <!--<h4><i class="fa fa fa-info"></i>&nbsp&nbspAtenção</h4>-->
              <!--<span v-html="'Favor clicar no botão Inicial no menu à esquerda, para completar o seu Cadastro'"></span>-->
              <!--</div>-->
              <div class="row">
                <div class="col-md-12">
                  <form name="frmCommonRegister" class="form-horizontal" novalidate >
                    <div class="col-md-7 col-lg-6" id="cadastroJuri">
                      <fieldset :disabled="!isEditable() || boqueia === true">
                        <legend>Dados da entidade:</legend>

                        <!-- company name -->
                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('Razão social')}">
                          <label for="Razão social" class="control-label col-md-4">
                            <span v-if="_.hasIn(mudancas, 'ds_nome')"  class="fa fa-warning indicador_alteracao"
                                  :title="'Conteúdo anterior: ' + diferenca.ds_nome"
                                  v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                            Razão social:</label>
                          <div class="col-md-8">
                            <input v-model="entidade.ds_nome" name="Razão social" class="form-control" type="text" ref="ds_nome" v-validate="'required|min:1|max:255'">
                          </div>
                          <span v-if="errors.first('Razão social')" class="label label-danger"> {{('O campo Razão Social é obrigatório') }}</span>
                        </div>

                        <!-- cnpj -->
                        <div class="form-group" :class="{ 'has-error' : errors.first('CNPJ')}">
                          <label for="CNPJ" class="control-label col-md-4" ref="CNPJ">
                            <span v-if="_.hasIn(mudancas, 'ds_cnpj')"  class="fa fa-warning indicador_alteracao"
                                  :title="'Conteúdo anterior: ' + diferenca.ds_cnpj"
                                  v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                            CNPJ:</label>
                          <div class="col-md-4">
                            <the-mask v-model="entidade.ds_cnpj" name="CNPJ" class="form-control" type="text" ref="ds_cnpj"
                                      v-validate="'required|min:14|max:14'" mask="##.###.###/####-##" disabled="true">
                            </the-mask>
                          </div>
                          <span v-if="errors.first('CNPJ')" class="label label-danger"> {{('O campo CNPJ é obrigatório') }}</span>
                        </div>

                        <!-- cnpj expedition time -->
                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('cnpjExpeditionTime')}">
                          <label for="cnpjExpeditionTime" class="control-label col-md-4">
                            <span v-if="_.hasIn(mudancas, 'dt_data_expedicao_cnpj')"  class="fa fa-warning indicador_alteracao"
                                  :title="'Conteúdo anterior: ' + diferenca.dt_data_expedicao_cnpj | moment('L')"
                                  v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                            Expedição CNPJ:</label>
                          <div class="col-md-3">
                            <!--<datepicker name="cnpjExpeditionTime" v-model="entidade.dt_data_expedicao_cnpj"  input-class="form-control datepicker" ref="dt_data_expedicao_cnpj" id="dt_data_expedicao_cnpj"-->
                            <!--:language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"-->
                            <!--format="dd/MM/yyyy" v-validate="'required'">-->
                            <!--</datepicker>-->
                            <input
                              type="text"
                              ref="cnpjExpeditionTime"
                              name="cnpjExpeditionTime"
                              v-model="dt_data_expedicao_cnpj"
                              class="form-control"
                              v-mask="'##/##/####'"
                              data-vv-as="Expedição CNPJ"
                              :masked="masked"
                              v-validate="'required|validdate|dateeqpast'"
                            >
                          </div>
                          <span v-if="errors.first('cnpjExpeditionTime')" class="label label-danger"> {{('O campo Expedição do CNPJ é obrigatório') }}</span>
                        </div>

                        <!-- business name -->
                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('Nome fantasia')}">
                          <label for="Nome fantasia" class="control-label col-md-4">
                            <span v-if="_.hasIn(mudancas, 'ds_nome_fantasia')"  class="fa fa-warning indicador_alteracao"
                                  :title="'Conteúdo anterior: ' + diferenca.ds_nome_fantasia"
                                  v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                            Nome fantasia:</label>
                          <div class="col-md-8">
                            <input v-model="entidade.ds_nome_fantasia" name="Nome fantasia" class="form-control" type="text" v-validate="'required|min:1|max:255'" ref="ds_nome_fantasia">
                          </div>
                          <span v-if="errors.first('Nome fantasia')" class="label label-danger"> {{('O campo Nome fantasia é obrigatório') }}</span>
                        </div>

                        <!-- Natureza Jurídica -->
                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('Natureza jurídica')}">
                          <label for="forma_jurídica" class="control-label col-md-4">
                            <span v-if="_.hasIn(mudancas, 'forma_juridica') && diferenca.forma_juridica"  class="fa fa-warning indicador_alteracao"
                                  :title="'Conteúdo anterior: ' + diferenca.forma_juridica.descricao"
                                  v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                            Natureza jurídica: </label>
                          <div class="col-md-8">
                            <multiselect v-model="entidade.forma_juridica" :options="listaFormasJuridicas"
                                         :multiple="false"
                                         :close-on-select="true"
                                         :clear-on-select="true"
                                         :hide-selected="false"
                                         :preserve-search="true"
                                         placeholder="Selecione uma Natureza Jurídica"
                                         track-by="codigo"
                                         :custom-label="etiquetaListaFormaJuridica"
                                         :preselect-first="false"
                                         selectLabel=""
                                         deselectLabel=""
                                         selectedLabel="Selecionado"
                                         name="forma_juridica"
                                         v-validate="'required'">
                              <span slot="noResult"><font color="red">Nenhum registro localizado!</font></span>
                            </multiselect>
                          </div>
                          <span v-if="errors.first('Natureza jurídica')" class="label label-danger"> {{ errors.first('Natureza jurídica') }}</span>
                        </div>

                        <!--activity -->
                        <div v-show="false" class="form-group required-field" :class="{ 'has-error' : errors.first('Ramo atividade')}">
                          <label for="Ramo atividade" class="control-label col-md-4">
                            <!--<span v-if="_.has(mudancas, 'ramos_atividade') && naoExisteRamo == true" class="fa fa-warning indicador_alteracao"-->
                            <!--:title="'Alteração: ' + altRamoTexto"-->
                            <!--v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>-->
                            <span v-if="inclRamo && naoExisteRamo === false" class="fa fa-warning indicador_insercao"
                                  :title="'Inclusões: ' + inclRamoTexto"
                                  v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                            <span v-if="exclRamo && exclRamo.length > 0" class="fa fa-warning indicador_exclusao"
                                  v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                            Ramos de Atividade: </label>
                          <div class="col-md-8">
                            <multiselect v-model="entidade.ramos_atividade" :options="listaRamosAtividade"
                                         :multiple="true"
                                         :close-on-select="false"
                                         :clear-on-select="true"
                                         :hide-selected="false"
                                         :preserve-search="true"
                                         placeholder="Selecione os Ramos de Atividade"
                                         label="ds_codigo"
                                         track-by="ds_codigo"
                                         :custom-label="etiquetaListaRamosAtividade"
                                         selectedLabel="Selecionado"
                                         selectLabel="Aperte ENTER para selecionar"
                                         deselectLabel="Aperte ENTER para remover"
                                         name="ramos_atividade"
                                         :options-limit="1500">
                              <template slot-scope="props"><span class="multiselect__tag"><span>{{ props.ds_codigo }}</span><span class="custom__remove" @click="props.remove(props)">❌</span></span></template>
                              <span slot="noResult"><font color="red">Nenhum registro localizado!</font></span>
                            </multiselect>
                          </div>
                          <span v-if="errors.first('Ramo atividade')" class="label label-danger"> {{ errors.first('Ramo atividade') }}</span>
                        </div>

                        <!-- constitution document -->
                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('Doc. constituição')}">
                          <label for="constitutionDocument" class="control-label col-md-4">
                              <span v-if="_.hasIn(mudancas, 'documento_constituicao') && diferenca.documento_constituicao" class="fa fa-warning indicador_alteracao"
                                    :title="'Conteúdo anterior: ' + diferenca.documento_constituicao.ds_tipo"
                                    v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                            Documento de constituição:</label>
                          <div class="col-md-8">
                            <multiselect v-model="entidade.documento_constituicao" :options="listaDocConstituicao"
                                         :multiple="false"
                                         :close-on-select="true"
                                         track-by="id"
                                         label="ds_tipo"
                                         placeholder="Selecione um Documento de constituição"
                                         selectLabel=""
                                         deselectLabel=""
                                         selectedLabel="Selecionado"
                                         name="listaDocConstituicao"
                                         v-validate="'required'">
                            </multiselect>
                          </div>
                          <span v-if="errors.first('Doc. constituição')" class="label label-danger"> {{('O campo Doc. constituição é obrigatório') }}</span>
                        </div>

                      </fieldset>
                    </div>

                    <div class="col-md-5 col-lg-6" id="contato">
                      <fieldset >
                        <legend>Contato:</legend>

                        <!-- phone -->
                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('Telefone')}">
                          <label for="Telefone" class="control-label col-md-4">
                              <span v-if="_.hasIn(mudancas, 'contato.ds_telefone') && diferenca.contato" class="fa fa-warning indicador_alteracao"
                                    :title="'Conteúdo anterior: ' + diferenca.contato.ds_telefone"
                                    v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                            Telefone:</label>
                          <div class="col-md-4">
                            <!--<input v-model="entidade.contato.ds_telefone" v-mask="'(##) ####-#####'" :masked="masked" name="Telefone" class="form-control" type="text" v-validate="'required|min:10|max:11'" ref="ds_telefone">-->
                            <the-mask v-model="entidade.contato.ds_telefone" name="Telefone" data-vv-as="Telefone" ref="Telefone" class="form-control" type="text" :masked="false"
                                      v-validate="'required|min:10|max:11'" :mask="['(##) ####-####', '(##) #####-####']">
                            </the-mask>
                          </div>
                          <span v-if="errors.first('Telefone')" class="label label-danger"> {{ errors.first('Telefone') }}</span>
                        </div>

                        <!-- celular -->
                        <div class="form-group">
                          <label for="mobile" class="control-label col-md-4">
                              <span v-if="_.hasIn(mudancas, 'contato.ds_celular') && diferenca.ds_contato == null"  class="fa fa-warning indicador_insercao"
                                    ></span>
                              <span v-else-if="_.hasIn(mudancas, 'contato.ds_celular')"  class="fa fa-warning indicador_alteracao"
                                    :title="'Conteúdo anterior: ' + diferenca.ds_celular"
                                    v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                            Celular:</label>
                          <div class="col-md-8 col-lg-4">
                            <the-mask v-model="entidade.contato.ds_celular" name="mobile" data-vv-as="Celular" ref="mobile" class="form-control" type="text" :masked="false"
                                      v-validate="'min:10|max:11'" :mask="['(##) ####-####', '(##) #####-####']">
                            </the-mask>
                            <span v-if="errors.first('mobile')" class="label label-danger"> {{ errors.first('mobile') }}</span>
                          </div>
                        </div>


                        <!-- email -->
                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('Email')}">
                          <label for="email" class="control-label col-md-4">
                              <span v-if="_.hasIn(mudancas, 'ds_email')"  class="fa fa-warning indicador_alteracao"
                                    :title="'Conteúdo anterior: ' + diferenca.contato.ds_email"
                                    v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                            E-Mail:</label>
                          <div class="col-md-8">
                            <input v-model="entidade.ds_email" name="Email" class="form-control" type="text" delivery="account" method="uniqueUserEmail" v-validate="'required|min:1|max:255'" ref="ds_email">
                          </div>
                          <span v-if="errors.first('Email')" class="label label-danger"> {{('O campo E-mail é obrigatório') }}</span>
                        </div>

                        <!-- website -->
                        <div class="form-group">
                          <label for="email" class="control-label col-md-4">
                              <span v-if="_.hasIn(mudancas, 'ds_website') && diferenca.ds_website == null"  class="fa fa-warning indicador_insercao"></span>
                              <span v-else-if="_.hasIn(mudancas, 'ds_website')"  class="fa fa-warning indicador_alteracao"
                                    :title="'Conteúdo anterior: ' + diferenca.ds_website"
                                    v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                            Site:</label>
                          <div class="col-md-8">
                            <input v-model="entidade.ds_website" name="website" class="form-control" type="text" v-validate="'max:255'" ref="ds_website">
                          </div>
                        </div>

                        <!-- Demanda 64830 inclusão da informação se entidade possui CEBAS e/ou CMAS -->
                        <!-- Informação se entidade possui CEBAS ou CMAS-->
                        <div class="form-group required-field">
                          <label for="possuiCebas" class="control-label col-md-4">Possui CEBAS:</label>
                          <div class="col-md-2">
                            <select v-model="possuiCebas" class="form-control" name="possuiCebas" :disabled="true">
                              <option>Não</option>
                              <option>Sim</option>
                            </select>
                          </div>
                        </div>

                        <div class="form-group required-field">
                          <label for="possuiCmas" class="control-label col-md-4">Possui CMAS/CAS:</label>
                          <div class="col-md-2">
                            <select v-model="possuiCmas" class="form-control" name="possuiCmas" :disabled="true">
                              <option>Não</option>
                              <option>Sim</option>
                            </select>
                          </div>
                        </div>

                      </fieldset>
                    </div>

                    <!-- addresses -->
                    <div class="col-md-12">
                      <div class="box box-widget">
                        <div class="box-header">
                          <h3 class="box-title">Endereço:</h3>
                        </div>
                      </div>
                      <endereco :entEnderecos="entidade.endereco" :mudaEndereco="mudancas" :analise="analise" :revisao="revisao" :diferenca="diferenca"></endereco>
                    </div>

                    <!-- chiefs -->
                    <div class="col-md-12">
                      <div class="box box-widget">
                        <div class="box-header">
                          <h3 class="box-title">Dirigentes/Designados:</h3>
                        </div>
                      </div>
                      <dirigentes :entDirigentes="entidade.dirigentes" :entidadeParceira="entidade" :componenteSuperior="componenteSuperior" :mudaDirigente="mudancas" :analise="analise" :revisao="revisao" :diferenca="diferenca" name="dirigentes"></dirigentes>
                    </div>


                    <!-- users -->

                    <div class="col-md-12">
                      <div class="box box-widget">
                        <div class="box-header">
                          <h3 class="box-title">Usuários do sistema:</h3>
                        </div>
                      </div>
                      <usuarios :entUsuarios="entidade.usuarios" :mudaUsuario="mudancas" :componenteSuperior="componenteSuperior" :analise="analise" :revisao="revisao" :diferenca="diferenca"></usuarios>
                    </div>

                    <!--Documentos-->
                    <div class="col-md-12">
                      <div class="box box-widget">
                        <div class="box-header">
                          <h3 class="box-title">Documentos anexos:</h3>
                        </div>
                      </div>
                      <div class="col-md-12">
                        <upload-documentos-php-novo :propDocumentos="entidade.documentos" :documentTypes="entidade.tipos_documento" :disable="''" :local-uso="'CADASTRO_ENTIDADE'" :mudaDocumento="mudancas" :analise="analise" :revisao="revisao" :diferenca="diferenca" :salvouOK="salvouOK"></upload-documentos-php-novo>
                      </div>
                    </div>

                    <div class="col-md-12">
                      <div class="box box-widget">
                        <div class="box-header">
                          <h3 class="box-title">Histórico:</h3>
                        </div>
                      </div>
                      <div class="col-md-12">
                        <!--<button @click="mostraHistorico = !mostraHistorico" uib-tooltip="Oculta ou Mostra o histórico de alterações da Entidade" type="button" class="btn btn-primary btn-flat"><i class="fa fa-eye" aria-hidden="true"></i> {{mostraHistorico ? 'Ocultar histórico' : 'Mostrar histórico'}}</button>-->
                        <historico-entidade :entHistorico="historico" @historico_itens="historico_atualizado = $event"></historico-entidade>
                      </div>
                    </div>

                  </form>

                  <div class="col-md-6 col-lg-12">
                    <legend>Análise da entidade:</legend>
                    <div class="col-md-12">
                      <div class="form-group required full" style="margin-right:0;margin-left:0">
                        <label for="approvalResult" class="control-label">Decisões:</label>
                        <div class="col-md-12">
                          <label class="radio-inline new-control new-control-radio" style="padding-top: 8px;">
                            <input type="radio" name="resultado" id="resultado" v-model="entidade.resultadoAprovacao" @change="limpaObs" value="Aprovar"
                                   v-validate="'required'"> Aprovar
                            <div class="new-control-indicator"></div>
                          </label>
                        </div>
                        <div class="col-md-12">
                          <label class="radio-inline new-control new-control-radio" style="padding-top: 8px;">
                            <input  type="radio" name="resultado" v-model="entidade.resultadoAprovacao" value="Revisar"
                                    v-validate="'required'"> Devolver para ajustes
                            <div class="new-control-indicator"></div>
                          </label>
                        </div>
                        <div class="col-md-12">
                          <label class="radio-inline new-control new-control-radio" style="padding-top: 8px;">
                            <input  type="radio" name="resultado" v-model="entidade.resultadoAprovacao" value="Cancelar"
                                    v-validate="'required'"> Cancelar Alteração
                            <div class="new-control-indicator"></div>
                          </label>
                        </div>
                        <!--<span v-if="errors.first('resultado')" class="label label-danger"> {{ errors.first('resultado') }}</span>-->
                        <br>
                      </div>
                      <br>
                      <br><br><br>
                      <!-- Justificativa -->
                      <div v-if="entidade.resultadoAprovacao === 'Cancelar' || entidade.resultadoAprovacao === 'Revisar'" class="form-group required full required-field"
                           :class="{ 'has-error' : errors.first('justificativa')}" style="margin-right:0;margin-left:0">
                        <label for="justificativa" class="control-label">Justificativa:</label>
                        <textarea v-model="entidade.observacao" style="height:150px; resize:none;" name="justificativa" id="justificativa" class="form-control"
                                  v-validate="'required'"></textarea>
                        <span v-if="errors.first('justificativa')" class="label label-danger"> {{ errors.first('justificativa') }}</span>
                      </div>

                    </div>
                  </div>
                </div>
                <!-- /.col -->
              </div>
              <!-- /.row -->
            </div>
          </fieldset>
          <!-- /.box-body -->
          <div class="box-footer" v-if="boqueia === false" >
            <g-button-moema color="success" size="button--size-ss" :disabled="!isEditable()" @click.native="conclui(frmCommonRegister)"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</g-button-moema>
            <g-button-moema color="primary" size="button--size-ss" @click.native="salva(frmCommonRegister)"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar</g-button-moema>
            <g-button-moema color="warning" size="button--size-ss" @click.native="$router.go(-1)"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</g-button-moema>
          </div>
          <!-- /.box-footer -->
        </div>
        </div></div></div>
      <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
        <i class="fa fa-refresh fa-spin"></i>
      </div>

    </section>
  </div>
  </div>
  <!-- /.box -->
</template>
<script>
  import Endereco from '../../modules/endereco'
  import Dirigentes from '../../modules/dirigentes'
  import Usuarios from '../../modules/usuarios'
  import UploadDocumentosPhpNovo from '../../modules/uploadDocumentosPhpNovo'
  import HistoricoEntidade from '../../modules/historico-entidade'
  import { mapGetters } from 'vuex'
  import { detailedDiff } from 'deep-object-diff'
  import moment from 'moment'

  export default {
    components: {
      Endereco,
      Dirigentes,
      UploadDocumentosPhpNovo,
      HistoricoEntidade,
      Usuarios
    },
    name: 'ValidaEntidades',
    data () {
      return {
        campoErro: null,
        entidade: {
          contato: [],
          dirigentes: [],
          documentos: [],
          usuarios: [],
          mudancas: {},
          mostraHistorico: false,
          proximaEtapa: '',
          naoExisteRamo: false,
          ramo_atividade: {}
        },
        loading: {
          show: false
        },
        salvouOK: false,
        exibeIcone: false,
        mostraInclusao: false,
        mostraExclusao: false,
        mostraAlteracao: false,
        componenteSuperior: 'validacao',
        analise: [],
        boqueia: false,
        dirigentes: [],
        ramoAtividade: [],
        listaFormasJuridicas: [],
        listaDocConstituicao: [],
        listaRamosAtividade: [],
        dt_data_expedicao_cnpj: '',
        endereco: {},
        historico: [],
        historico_atualizado: [],
        listaHistorico: [],
        usuarios: {},
        formasJuridicas: [],
        inclRamoTexto: [],
        tarefas: [],
        // Demanda 64830 inclusão da informação se entidade possui CEBAS e/ou CMAS
        possuiCmas: '',
        possuiCebas: ''
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado',
        'urlLaravel'
      ])
    },
    watch: {
      dt_data_expedicao_cnpj: function (val) {
        let newdate = moment(val, 'DD/MM/YYYY', true)
        if (newdate.isValid()) {
          this.entidade.dt_data_expedicao_cnpj = newdate.format('YYYY-MM-DD')
        }
      }
    },
    beforeCreate () {
      // this.entidade.ramo_atividade.ds_codigo = 'TERC'
      // this.entidade.ramo_atividade.ds_descricao = 'TERCEIRO SETOR'
      this.$snotify.async('Buscando dados da Entidade. Por favor, aguarde...', {timeout: 0})
      if (this.$route.params.id) {
        // this.carregaHistorico()
        axiosLaravel.get('entidades/' + this.$route.params.id).then(async (response) => {
          this.entidade = response.data
          this.entidade.observacao = ''
          this.$route.params.entidade = this.entidade
          this.dt_data_expedicao_cnpj = moment(this.entidade.dt_data_expedicao_cnpj).format('DD/MM/YYYY')
          this.$forceUpdate()
          await this.carregaListaFormasJuridicas()
          await this.carregaListaRamosAtividade()
          await this.carregaListaDocumentosConstituicao()
          await this.verMudancas()
          this.$forceUpdate()
          this.$snotify.clear()
          this.$snotify.success('Dados da Entidade recuperados com sucesso!', {timeout: 2000})
          this.processos = response.data.processos
          this.cnpj = this.entidade.cnpj
          this.dirigentes = response.data.dirigentes
          this.tarefas = this.processos.map((item) => {
            return item.tarefas
          })
          this.historico = this.tarefas
          this.historico = _.sortBy(this.historico, 'id').reverse()
          this.$snotify.clear()

          // Demanda 64830 inclusão da informação se entidade possui CEBAS e/ou CMAS
          if (this.entidade.tipos_documento.findIndex(e => { return e.id === 70 }) >= 0 || this.entidade.documentos.findIndex(e => { return e.tipo_documento.id === 70 }) >= 0) {
            this.possuiCmas = 'Sim'
          } else {
            this.possuiCmas = 'Não'
          }
          if (this.entidade.tipos_documento.findIndex(e => { return e.id === 71 }) >= 0 || this.entidade.documentos.findIndex(e => { return e.tipo_documento.id === 71 }) >= 0) {
            this.possuiCebas = 'Sim'
          } else {
            this.possuiCebas = 'Não'
          }
          this.$forceUpdate()
          // this.historico = response.data.processos
          // this.$forceUpdate()
          // if (this.entidade.bt_ativo === '1' && this.usuarioLogado.userType === 'ENTIDADE') {
          //   this.$swal({
          //     title: '<font color="red"><b>Atenção!</b></font>',
          //     // add a custom html tags by defining a html method.
          //     html:
          //       '<div align="left"> A entidade ' + '<b>' + this.entidade.ds_nome + '</b>' + ', já foi aprovada no sistema. Qualquer alteração cadastral será passível de nova aprovação pela FBB.' + '</div>',
          //     showCloseButton: true,
          //     showCancelButton: false,
          //     showLoaderOnConfirm: true,
          //     focusConfirm: false
          //   })
          // }
          // if (this.entidade.ds_tipo_registro === 'CREDENCIAMENTO' && this.entidade.edital) {
          //   this.boqueia = true
          //   return
          // }
        })
          .catch((error) => {
            if (error) {
              this.$snotify.clear()
              this.$root.trataErro(error)
            }
          })
      }
      this.formasJuridicas = [ { c: '101-5', d: 'Órgão Público do Poder Executivo Federal' }, { c: '102-3', d: 'Órgão Público do Poder Executivo Estadual ou do Distrito Federal' }, { c: '103-1', d: 'Órgão Público do Poder Executivo Municipal' }, { c: '110-4', d: 'Autarquia Federal' }, { c: '111-2', d: 'Autarquia Estadual ou do Distrito Federal' }, { c: '112-0', d: 'Autarquia Municipal' }, { c: '113-9', d: 'Fundação Pública de Direito Público Federal' }, { c: '114-7', d: 'Fundação Pública de Direito Público Estadual ou do Distrito Federal' }, { c: '115-5', d: 'Fundação Pública de Direito Público Municipal' }, { c: '116-3', d: 'Órgão Público Autônomo Federal' }, { c: '117-1', d: 'Órgão Público Autônomo Estadual ou do Distrito Federal' }, { c: '118-0', d: 'Órgão Público Autônomo Municipal' }, { c: '123-6', d: 'Estado ou Distrito Federal' }, { c: '124-4', d: 'Município' }, { c: '125-2', d: 'Fundação Pública de Direito Privado Federal' }, { c: '126-0', d: 'Fundação Pública de Direito Privado Estadual ou do Distrito Federal' }, { c: '127-9', d: 'Fundação Pública de Direito Privado Municipal' }, { c: '201-1', d: 'Empresa Pública' }, { c: '214-3', d: 'Cooperativa' }, { c: '227-5', d: 'Empresa Binacional' }, { c: '306-9', d: 'Fundação Privada' }, { c: '307-7', d: 'Serviço Social Autônomo' }, { c: '313-1', d: 'Entidade Sindical' }, { c: '320-4', d: 'Estabelecimento, no Brasil, de Fundação ou Associação Estrangeiras' }, { c: '321-2', d: 'Fundação ou Associação Domiciliada no Exterior' }, { c: '323-9', d: 'Comunidade Indígena' }, { c: '330-1', d: 'Organização Social (OS)' }, { c: '399-9', d: 'Associação Privada' }, { c: '501-0', d: 'Organização Internacional' }, { c: '502-9', d: 'Representação Diplomática Estrangeira' }, { c: '503-7', d: 'Outras Instituições Extraterritoriais' }, { c: '204-6', d: 'Sociedade Anônima Aberta' }, { c: '205-4', d: 'Sociedade Anônima Fechada' } ]
    },
    methods: {
      async verMudancas () {
        this.$snotify.clear()
        this.$snotify.async('Verificando alterações efetuadas no cadastro. Por favor, aguarde...', {timeout: 0})
        // Verifica os campos que sofreram alterações pela entidade
        this.exibeIcone = false
        for (let i = 0; i < this.entidade.processos.length; i++) {
          if (this.entidade.processos[i].situacao === 'EM_EXECUCAO') {
            this.idProcesso = this.entidade.processos[i].id
          }
        }
        await axiosLaravel.get('/entidades/' + this.entidade.id + '/alteracoes/', {
        }).then((response) => {
          this.mudancas = response.data.diferenca
          this.diferenca = response.data.diferencaAnaliseRevisao
          console.log('meu deus: ', this.diferenca)
          console.log('mudancas: ', this.mudancas)
          this.analise = response.data.analise
          this.revisao = response.data.revisao
          console.log('analise: ', this.analise)
          console.log('revisao: ', this.revisao)
          this.$forceUpdate()
          if (this.analise && this.revisao) {
            if (this.analise.length > this.revisao.length) {
              this.mostraExclusao = true
              this.mostraInclusao = false
            } else {
              this.mostraExclusao = true
            }
            if (this.analise.length < this.revisao.length) {
              this.mostraInclusao = true
              this.mostraExclusao = false
            } else {
              this.mostraInclusao = false
            }
            if (this.analiseEnd === this.revisao.length) {
              this.mostraExclusao = false
            }
          }
          this.adicionados = detailedDiff(this.analise, this.revisao).added
          this.excluidos = detailedDiff(this.analise, this.revisao).deleted
          if (this.adicionados) {
            if (this.adicionados.ramos_atividade) {
              this.inclRamo = this.adicionados.ramos_atividade
              this.inclRamoTexto = _.map(this.inclRamo, 'ds_descricao')
              this.naoExisteRamo = false
            } else {
              this.naoExisteRamo = true
            }
          }
          if (this.excluidos) {
            this.exclRamo = _.values(_.keys(this.excluidos.ramos_atividade))
            if (this.exclRamo) {
              this.naoExisteRamo = false
            } else {
              this.naoExisteRamo = true
            }
          }
          if (_.hasIn(this.adicionados, 'ramos_atividade') && this.excluidos !== {}) {
            this.naoExisteRamo = false
          } else {
            this.naoExisteRamo = true
            this.altRamoTexto = _.map(this.analise.ramos_atividade, 'ds_descricao')
          }
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
        // // Razão Social
        // if (this.mudancas.ds_nome) {
        //   // this.$refs['ds_nome'].style.borderColor = 'red'
        //   // this.$refs['ds_nome'].style.borderWidth = '1.5px'
        //   this.exibeIcone = true
        // } else {
        //   this.exibeIcone = false
        // }
        // // CNPJ
        // if (this.mudancas.ds_cnpj) {
        //   this.exibeIcone = true
        // } else {
        //   this.exibeIcone = false
        // }
        // //
        // // Documento Constituição
        // if (this.mudancas.ds_documento_constituicao) {
        //   // this.$refs['ds_documento_constituicao'].style.borderColor = 'red'
        //   // this.$refs['ds_documento_constituicao'].style.borderWidth = '1.5px'
        //   this.exibeIcone = true
        // } else {
        //   this.exibeIcone = false
        // }
        // // Expedicao
        // if (this.mudancas.dt_data_expedicao_cnpj) {
        //   // this.$refs['dt_data_expedicao_cnpj'].style.borderColor = 'red'
        //   // this.$refs['dt_data_expedicao_cnpj'].style.borderWidth = '1.5px'
        //   this.exibeIcone = true
        // } else {
        //   this.exibeIcone = false
        // }
        // // Nome fantasia
        // if (this.mudancas.ds_nome_fantasia) {
        //   // this.$refs['dt_data_expedicao_cnpj'].style.borderColor = 'red'
        //   // this.$refs['dt_data_expedicao_cnpj'].style.borderWidth = '1.5px'
        //   this.exibeIcone = true
        // } else {
        //   this.exibeIcone = false
        // }
        // // Contato - Telefone
        // // if (this.mudancas.contato) {
        // //   if (this.mudancas.contato.ds_telefone) {
        // //     // this.$refs['dt_data_expedicao_cnpj'].style.borderColor = 'red'
        // //     // this.$refs['dt_data_expedicao_cnpj'].style.borderWidth = '1.5px'
        // //     this.exibeIcone = true
        // //   } else {
        // //     this.exibeIcone = false
        // //   }
        // // }
        // // Contato - Celular
        // // if (this.mudancas.contato) {
        // //   if (this.mudancas.contato.ds_celular) {
        // //     // this.$refs['dt_data_expedicao_cnpj'].style.borderColor = 'red'
        // //     // this.$refs['dt_data_expedicao_cnpj'].style.borderWidth = '1.5px'
        // //     this.exibeIcone = true
        // //   } else {
        // //     this.exibeIcone = false
        // //   }
        // // }
        // // Contato - Website
        // if (_.hasIn(this.mudancas, 'ds_website')) {
        //   console.log('this.ds_website', this.mudancas.ds_website)
        //   // this.$refs['dt_data_expedicao_cnpj'].style.borderColor = 'red'
        //   // this.$refs['dt_data_expedicao_cnpj'].style.borderWidth = '1.5px'
        //   this.exibeIcone = true
        // } else {
        //   this.exibeIcone = false
        // }
      },
      etiquetaListaFormaJuridica (option) {
        return `${option.codigo + ' / ' + option.descricao}`
      },
      etiquetaListaRamosAtividade (option) {
        return `${option.ds_codigo + '    ' + option.ds_descricao}`
      },
      async carregaListaFormasJuridicas () {
        // Busca ramo atividades
        await this.$root.buscaFormasJuridicas(this.$store)
        // Seta variaveis com que esta gravado no store
        this.listaFormasJuridicas = this.$store.state.formasJuridicas
      },
      async carregaListaRamosAtividade () {
        // Busca ramo atividades
        await this.$root.buscaRamoAtividades(this.$store)
        // Seta variaveis com que esta gravado no store
        this.listaRamosAtividade = this.$store.state.ramoAtividades
      },
      carregaListaDocumentosConstituicao () {
        axiosLaravel.post('documentos/tipos/ENTIDADE_DOC_CONSTITUICAO').then((response) => {
          this.listaDocConstituicao = response.data
          // this.entidade.documento_constituicao = this.listaDocConstituicao.filter((item) => {
          //   return item.id.toString() === this.entidade.documento_constituicao
          // })
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      isEditable () {
        return (this.$root.authorize('entidade-editar') || this.$root.authorize('minha-entidade-editar'))
      },
      customLabel (option) {
        return `${option.c + ' / ' + option.d}`
      },
      // verificar () {
      //   if (!this.entidade.hasOwnProperty('contact')) {
      //     this.entidade.contact = {}
      //     this.entidade.contact.phone = ''
      //     this.entidade.contact.mobile = ''
      //   }
      // },
      // carregaRamoAtividade () {
      //   // A pedido da GEPRO, mandar sempre TERC fixo.
      //   axiosLaravel.get('ramo-atividades/').then((response) => {
      //     for (let i = 0; i < response.data.length; i++) {
      //       if (response.data[i].ds_codigo === 'TERC') {
      //         this.ramoAtividade.push(response.data[i])
      //         this.entidade.ramo_atividade = Object.assign({}, this.ramoAtividade[0])
      //       }
      //     }
      //   })
      // },
      outrasValidacoes () {
        if (!this.entidade.dirigentes || this.entidade.dirigentes === 0) {
          this.$snotify.error('Os dados obrigatórios do dirigente devem ser preenchidos!')
          return false
        }
        return true
      },
      salvaUsuarios () {
        for (let i = 0; i < this.entidade.usuarios.length; i++) {
          if (!this.entidade.usuarios[i].ds_tipo_usuario) {
            this.entidade.usuarios[i].ds_tipo_usuario = 'ENTIDADE'
            // this.entidade.usuarios[i].ds_login = this.entidade.usuarios[i].ds_cpf
            this.entidade.usuarios[i].fk_entidade = this.entidade.id
            this.entidade.usuarios[i].fk_usuario_criador = this.usuarioLogado.id
            this.entidade.usuarios[i].fk_preferencia = null
            this.entidade.usuarios[i].dt_data_inativacao = null
            this.entidade.usuarios[i].fk_agencia = null
            this.entidade.usuarios[i].fk_parceiro_estrategico = null
            this.entidade.usuarios[i].fk_superintendencia = null
          }
        }
      },
      salva () {
        if (this.entidade.id) {
          this.atualiza()
        } else {
          this.grava()
        }
      },
      conclui () {
        if (this.entidade.resultadoAprovacao === 'Aprovar') {
          this.entidade.proximaEtapa = 'CONCLUSAO'
        }
        if (this.entidade.resultadoAprovacao === 'Revisar') {
          this.entidade.proximaEtapa = 'REVISAO'
        }
        if (this.entidade.resultadoAprovacao === 'Cancelar') {
          this.entidade.proximaEtapa = 'CANCELAR'
        }
        let entidadeOK = true
        let aba = ''
        if (_.isEmpty(this.entidade.endereco)) {
          entidadeOK = false
          aba = 'Endereço'
        }
        if (_.isEmpty(this.entidade.dirigentes)) {
          entidadeOK = false
          aba = 'Dirigentes'
        }
        if (entidadeOK === true) {
          this.$validator.validateAll().then((result) => {
            if (result) {
              this.boqueia = true
              this.outrasValidacoes()
              if (this.entidade.id) {
                if (this.resultadoAprovacao === 'Aprovar') {
                  this.entidade.observacao = ''
                }
                this.salvaUsuarios()
                this.$snotify.async('Gravando cadastro da entidade. Por favor, aguarde...', {timeout: 0})
                axiosLaravel.put('entidades/' + this.entidade.id, this.entidade).then((response) => {
                  if (response.data) {
                    this.$snotify.clear()
                    this.$snotify.success('Alteração cadastral concluída com sucesso!')
                    this.boqueia = false
                    this.$router.go(-1)
                  }
                })
                  .catch((error) => {
                    this.boqueia = false
                    this.$snotify.clear()
                    this.$root.trataErro(error)
                  })
              }
            } else {
              this.$snotify.error('O formulário de Dados da Entidade possui erros. Favor verificar!')
            }
          })
        } else {
          this.$snotify.error('Erros no preenchimento da aba ' + aba + '. Favor verificar.')
        }
      },
      // carregaHistorico () {
      //   axios.get('/proxy/account/entities/' + this.$route.params.id + '/history').then((response) => {
      //     this.historico = response.data.value
      //   })
      //     .catch((error) => {
      //       this.$snotify.clear()
      //       this.$root.trataErro(error)
      //     })
      // },
      atualiza () {
        this.entidade.proximaEtapa = 'SALVAR'
        this.salvaUsuarios()
        this.$snotify.async('Atualizando dados da entidade. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.put('entidades/' + this.entidade.id, this.entidade).then((response) => {
          this.$emit('salvou', 'OK')
          this.salvouOK = true
          this.$snotify.clear()
          this.$snotify.success('Entidade salva com sucesso!')
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      grava () {
        this.entidade.proximaEtapa = 'SALVAR'
        this.$snotify.async('Atualizando dados da entidade. Por favor, aguarde...', {timeout: 0})
        this.entidade.users = this.usuarios
        axios.post('proxy/account/entities/temp/' + this.entidade).then((response) => {
          this.$emit('salvou', 'OK')
          this.salvouOK = true
          this.$snotify.clear()
          this.$snotify.success('Entidade salva com sucesso!')
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      limpaObs () {
        this.entidade.observacao = ''
      }
    }
  }
</script>

<style scoped>


</style>
