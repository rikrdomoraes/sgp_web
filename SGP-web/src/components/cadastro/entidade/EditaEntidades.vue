<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="titulo"/>

    <div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
    <section class="content-header ng-scope">

      <h1>Entidades

          <span v-if="!boqueia && !loading.tela">
          <g-button-moema v-if="((entidade.ds_status !== 'PENDENTE_APROVACAO') && (usuarioLogado.userType === 'ENTIDADE') || (usuarioLogado.userType === 'FUNDACAO'))" color="success" size="button--size-ss" :disabled="!isEditable()" @click.native="permiteConcluir(frmCommonRegister)"><i class="fa fa-check" aria-hidden="true"></i> Concluir</g-button-moema>
          <g-button-moema v-if="((entidade.ds_status !== 'PENDENTE_APROVACAO') && (usuarioLogado.userType === 'ENTIDADE') || (usuarioLogado.userType === 'FUNDACAO'))" color="primary" size="button--size-ss" @click.native="salvar()"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar</g-button-moema>
          <g-button-moema color="warning" size="button--size-ss" @click.native="$router.go(-1)"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</g-button-moema>

          <g-button-moema v-if="entidade.ds_status === 'PENDENTE_APROVACAO' && usuarioLogado.userType === 'ENTIDADE' && propostaUnicaEditalVigente" color="error" size="button--size-ss" @click.native="devolverRevisao()"><i class="fa fa-repeat" aria-hidden="true"></i> Devolver Revisão</g-button-moema>
        </span>

      </h1>
      <b-breadcrumb :items="breadcrumb"/>
    </section>

    <!-- main content -->
    <section class="content ng-scope">

      <div class="row">
        <div class="col-md-12">
          <!-- grid -->
          <div class=""><div class="box box-primary">
          <div class="box-header with-border">
            <h3 class="box-title"><i class="fa fa-search" aria-hidden="true"></i> Cadastro da Entidade  &nbsp;&nbsp;<a :href="urlLaravel + '/docs/manual_cadastro_entidade_dirigentes_usuarios_v1.pdf'" target="_blank"><i class="fa fa-download" aria-hidden="true"></i> Manual</a></h3>
          </div>
          <!-- /.box-header -->
          <fieldset :disabled="boqueia === true">
            <div class="box-body" id="dadosCadastrais">

              <div v-show="loading.tela" class="overlay" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;display: none; background: rgba(255, 255, 255, 0.7); z-index: 1000"><i class="fa fa-refresh fa-spin" style="top: 50%; left: 50%; position: absolute; font-size: 30px"></i></div>

              <!-- <div class="alert alert-warning alert-dismissible" v-if="entidade.ds_status !== 'PENDENTE_APROVACAO' && usuarioLogado.userType === 'ENTIDADE' && !propostaUnicaEditalVigente">
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                <h4><i class="fa fa-warning"></i> Atenção!</h4>
                <span>
                  <p>A análise do cadastro terá início após preenchimento do formulário abaixo e clicado em Concluir</p>
                  <p>No caso de participação em Edital, necessário atualizar estatuto e ata eleição</p>
                </span>
              </div> -->

              <!-- <div v-if="!_.isEmpty(_.get(_.head(historico_atualizado), 'observacao', null)) && !_.isNull(_.get(_.head(historico_atualizado), 'termino', null))" class="alert alert-dismissible alert-info">
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                <h4><i class="fa fa-warning"></i> Atenção!</h4>
                <h5><span v-html="_.get(_.head(historico_atualizado), 'observacao')"></span></h5>
              </div> -->

              <!--<div v-if="boqueia === true" class="alert alert-dismissible alert-warning">-->
              <!--<button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>-->
              <!--<h4><i class="fa fa fa-info"></i>&nbsp&nbspAtenção</h4>-->
              <!--<span v-html="'Favor clicar no botão Inicial no menu à esquerda, para completar o seu Cadastro'"></span>-->
              <!--</div>-->
              <div class="row">
                <div class="col-md-12">
                  <form name="frmCommonRegister" class="form-horizontal" novalidate >
                    <div class="col-md-7 col-lg-6" id="cadastroJuri">
                      <!-- Chamado 64.235 - Ocultar temporariamente a mensagem de validação pendente durante a vigência do edital voluntariado 2022 -->
                      <!--
                      <div class="row">
                        <span v-if="(historico_atualizado.length > 0 && historico_atualizado[0].termino == null  && historico_atualizado[0].nome == 'Analisando')">
                          <div class="alert alert-info" role="alert"><i class="fa fa-info-circle" aria-hidden="true"></i> Cadastro aguardando validação</div>
                        </span>
                          <span v-if="(historico_atualizado.length > 0 && historico_atualizado[0].termino == null  && historico_atualizado[0].nome == 'Revisão')">
                            <div class="alert alert-warning" role="alert"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Cadastro não enviado</div>
                          </span>
                      </div>
                      -->
                      <fieldset :disabled="!isEditable() || boqueia === true">
                        <legend>
                          Dados da entidade:

                            </legend>

                        <!-- company name -->
                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('Razão social')}">
                          <label for="Razão social" class="control-label col-md-4">Razão social:</label>
                          <div class="col-md-8">
                            <input v-model="entidade.ds_nome" name="Razão social" class="form-control" type="text" ref="Razão social" v-validate="'required|min:1|max:255'">
                            <span v-if="errors.first('Razão social')" class="label label-danger"> {{('O campo Razão Social é obrigatório') }}</span>
                          </div>
                        </div>

                        <!-- cnpj -->
                        <div class="form-group" :class="{ 'has-error' : errors.first('CNPJ')}">
                          <label for="CNPJ" class="control-label col-md-4" ref="CNPJ">CNPJ:</label>
                          <div class="col-md-6 col-lg-4">
                            <the-mask v-model="entidade.ds_cnpj" name="CNPJ" class="form-control" type="text"
                                      v-validate="'required|min:14|max:14'" mask="##.###.###/####-##" disabled="true">
                            </the-mask>
                            <span v-if="errors.first('CNPJ')" class="label label-danger"> {{ errors.first('CNPJ') }}</span>
                          </div>
                        </div>

                        <!-- cnpj expedition time -->
                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('cnpjExpeditionTime') || erroData==true}">
                          <label for="cnpjExpeditionTime" class="control-label col-md-4">Expedição CNPJ:</label>
                          <div class="col-md-6 col-lg-4">
                            <input
                            type="text"
                            ref="cnpjExpeditionTime"
                            id="cnpjExpeditionTime"
                            name="cnpjExpeditionTime"
                            v-model="data_expedicao_cnpj"
                            class="form-control"
                            v-mask="'##/##/####'"
                            data-vv-as="Expedição CNPJ"
                            :masked="masked"
                            v-validate="'required|validdate|date_format:dd/MM/yyyy|dateeqpast|after:01/01/1900'"
                            >
                            <!--<datepicker-->
                            <!--ref="cnpjExpeditionTime"-->
                            <!--name="cnpjExpeditionTime"-->
                            <!--v-model="entidade.dt_data_expedicao_cnpj"-->
                            <!--input-class="form-control"-->
                            <!--:language="$datePickerPtBR"-->
                            <!--maxlength="20"-->
                            <!--:use-utc="true"-->
                            <!--:typeable="true"-->
                            <!--placeholder="__ /__ /____"-->
                            <!--format="dd/MM/yyyy"-->
                            <!--v-mask="'##/##/####'"-->
                            <!--:masked="masked" -->
                            <!--v-validate="'required'"-->
                            <!--&gt;-->
                            <!--</datepicker>-->
                            <span v-if="errors.first('cnpjExpeditionTime')" class="label label-danger"> {{ errors.first('cnpjExpeditionTime') }}</span>
                          </div>
                        </div>

                        <!-- business name -->
                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('Nome fantasia')}">
                          <label for="Nome fantasia" class="control-label col-md-4">Nome fantasia:</label>
                          <div class="col-md-8">
                            <input v-model="entidade.ds_nome_fantasia" name="Nome fantasia" ref="Nome fantasia" class="form-control" type="text" v-validate="'required|min:1|max:255'">
                            <span v-if="errors.first('Nome fantasia')" class="label label-danger"> {{('O campo Nome fantasia é obrigatório') }}</span>
                          </div>
                        </div>

                        <!-- Natureza Jurídica -->
                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('forma_juridica')}">
                          <label for="forma_jurídica" class="control-label col-md-4"> Natureza jurídica: </label>
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
                                         data-vv-as="Natureza jurídica"
                                         v-validate="'required'">
                              <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
                            </multiselect>
                            <span v-if="errors.first('forma_juridica')" class="label label-danger"> {{ errors.first('forma_juridica') }}</span>
                          </div>
                        </div>

                        <!-- Ramo de Atividade -->
                        <div v-show="false" class="form-group required-field" :class="{ 'has-error' : errors.first('ramos_atividade')}">
                          <label for="Ramo atividade" class="control-label col-md-4"> Ramos de Atividade: </label>
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
                                         data-vv-as="Ramos de Atividade"
                                         :options-limit="1500">
                              <template slot-scope="props"><span class="multiselect__tag"><span>{{ props.ds_codigo }}</span><span class="custom__remove" @click="props.remove(props)">❌</span></span></template>
                              <span slot="noResult"><font color="red">Nenhum registro localizado!</font></span>
                            </multiselect>
                            <span v-if="errors.first('ramos_atividade')" class="label label-danger"> {{ errors.first('ramos_atividade') }}</span>
                          </div>
                        </div>

                        <!-- Documento de constituição -->
                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('listaDocConstituicao')}">
                          <label for="documento_constituicao" class="control-label col-md-4"> Documento de constituição: </label>
                          <div class="col-md-8">
                            <multiselect v-model="entidade.documento_constituicao" :options="listaDocConstituicao"

                                        :multiple="false"
                                         :close-on-select="true"
                                         :searchable="false"
                                         track-by="id"
                                         label="ds_tipo"
                                         placeholder="Selecione um Documento de constituição"
                                         selectLabel=""
                                         deselectLabel=""
                                         selectedLabel="Selecionado"
                                         name="listaDocConstituicao"
                                         data-vv-as="Documento de constituição"
                                         v-validate="'required'">
                              <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
                            </multiselect>
                            <span v-if="errors.first('listaDocConstituicao')" class="label label-danger"> {{ errors.first('listaDocConstituicao') }}</span>
                          </div>
                        </div>


                      </fieldset>
                    </div>

                    <div class="col-md-5 col-lg-6" id="contato">
                      <fieldset >
                        <legend>Contato:</legend>

                        <!-- phone -->
                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('Telefone')}">
                          <label for="Telefone" class="control-label col-md-4">Telefone:</label>
                          <div class="col-md-8 col-lg-4">
                            <the-mask v-model="entidade.contato.ds_telefone" name="Telefone" data-vv-as="Telefone" ref="Telefone" class="form-control" type="text" :masked="false"
                                      v-validate="'required|min:10|max:11'" :mask="['(##) ####-####', '(##) #####-####']">
                            </the-mask>
                            <!--<input v-model="entidade.contato.ds_telefone" :mask="['(##) ####-####', '(##) #####-####']"  name="Telefone" class="form-control" type="text" v-validate="'required|min:10|max:11'" ref="Telefone">-->
                            <span v-if="errors.first('Telefone')" class="label label-danger"> {{ errors.first('Telefone') }}</span>
                          </div>
                        </div>

                        <!-- mobile -->
                        <div class="form-group">
                          <label for="mobile" class="control-label col-md-4">Celular:</label>
                          <div class="col-md-8 col-lg-4">
                            <!--<input v-model="entidade.contato.ds_celular" v-mask="'(##) #####-#####'" :masked="masked" name="mobile" class="form-control" type="text">-->
                            <the-mask v-model="entidade.contato.ds_celular" name="mobile" data-vv-as="Celular" ref="mobile" class="form-control" type="text" :masked="false"
                                      v-validate="'min:10|max:11'" :mask="['(##) ####-####', '(##) #####-####']">
                            </the-mask>
                            <span v-if="errors.first('mobile')" class="label label-danger"> {{ errors.first('mobile') }}</span>
                          </div>
                        </div>


                        <!-- email -->
                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('Email')}">
                          <label for="email" class="control-label col-md-4">E-Mail:</label>
                          <div class="col-md-8">
                            <input v-model="entidade.ds_email" name="Email" class="form-control" type="text" data-vv-as="E-Mail" delivery="account" method="uniqueUserEmail" v-validate="'required|email|min:1|max:255'" ref="Email">
                            <span v-if="errors.first('Email')" class="label label-danger"> {{ errors.first('Email') }}</span>
                          </div>
                       </div>

                        <!-- website -->
                        <div class="form-group">
                          <label for="website" class="control-label col-md-4">Site:</label>
                          <div class="col-md-8">
                            <input v-model="entidade.ds_website" nam="website" class="form-control" type="text" v-validate="'max:255'">
                          </div>
                        </div>

                        <!-- Demanda 64830 inclusão da informação se entidade possui CEBAS e/ou CMAS -->
                        <!-- Informse entidade possui CEBAS ou CMAS-->
                        <div class="form-group required-field" v-if="!propostaUnicaEditalVigente">
                          <label class="control-label col-md-4">Possui CEBAS:</label>
                          <div class="col-md-2">
                            <select v-model="possuiCebas" @change="onChangeCebasCmas($event)" class="form-control" name="possuiCebas">
                              <option>Não</option>
                              <option>Sim</option>
                            </select>
                          </div>
                        </div>

                        <div class="form-group required-field" v-if="!propostaUnicaEditalVigente">
                          <label class="control-label col-md-4">Possui CMAS/CAS:</label>
                          <div class="col-md-2">
                            <select v-model="possuiCmas" @change="onChangeCebasCmas($event)" class="form-control" name="possuiCmas">
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
                      <endereco :entEnderecos="entidade.endereco"></endereco>
                    </div>

                    <!-- chiefs -->
                    <div class="col-md-12">
                      <div class="box box-widget">
                        <div class="box-header">
                          <h3 class="box-title">Dirigentes/Designados:</h3>
                        </div>
                      </div>
                      <dirigentes :entDirigentes="entidade.dirigentes" :entidadeParceira="entidade"  name="dirigentes" id="dirigentes" @validacaoDirigente="adicionaRestricao($event)"></dirigentes>
                    </div>

                    <!-- Assinatura -->
                    <div class="col-md-12">
                      <div class="box box-widget">
                        <div class="box-header">
                          <h3 class="box-title">Quem vai assinar o convênio com a Fundação BB (Conforme estatuto e/ou procuração)</h3>
                        </div>
                      </div>
                      <assinaturaDirigentes :visualiza="false"></assinaturaDirigentes>
                    </div>

                    <!-- Usuários do sistema -->
                    <div class="col-md-12">
                      <div class="box box-widget">
                        <div class="box-header">
                          <h3 class="box-title">Usuários do sistema:</h3>
                        </div>
                      </div>
                      <usuarios :entUsuarios="entidade.usuarios"></usuarios>
                    </div>


                    <!--Documentos-->
                    <div class="col-md-12">
                      <div class="box box-widget">
                        <div class="box-header">
                          <h3 class="box-title">Documentos anexos:</h3>
                        </div>
                      </div>
                      <div class="col-md-12" id="documentos">
                        <!--<upload-documentos-php-novo :propDocumentos="entidade.documentos" :documentTypes="entidade.tipos_documento" :disable="''"></upload-documentos-php-novo>-->
                        <upload-documentos-php-novo :propDocumentos="entidade.documentos" :documentTypes="entidade.tipos_documento" :localUso="listaDocEntidades" :salvouOK="salvouOK"
                                                    :disable="entidade.ds_status === 'PENDENTE_APROVACAO' && usuarioLogado.userType === 'ENTIDADE' ? 'disable' : ''">
                        </upload-documentos-php-novo>
                      </div>
                    </div>

                    <!-- approval history -->
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

                    <!-- Justificativa -->
                    <div class="col-md-12">
                      <div v-if="entidade.resultadoAprovacao === 'Revisar'" class="form-group full" style="margin-right:0;margin-left:0">
                        <label for="observacao" class="control-label">Observação:</label>
                        <textarea v-model="entidade.observacao" style="height:150px; resize:none;" name="observacao" id="observacao" class="form-control"></textarea>
                      </div>
                    </div>


                  </form>
                </div>
                <!-- /.col -->
              </div>
              <!-- /.row -->
            </div>
          </fieldset>
          <!-- /.box-body -->
        </div>
        </div></div></div>

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
  import assinaturaDirigentes from '../../modules/assinaturaDirigentes.vue'
  import { mapGetters } from 'vuex'
  import moment from 'moment'

  export default {
    components: {
      Endereco,
      Dirigentes,
      UploadDocumentosPhpNovo,
      HistoricoEntidade,
      Usuarios,
      assinaturaDirigentes
    },
    name: 'cadastro-entidade-edita',
    data () {
      return {
        loading: {
          tela: true,
          poderes: true
        },
        propostas: [],
        projetos: [],
        hoje: new Date(),
        propostaUnicaEditalVigente: false,
        poderes: [],
        titulo: 'SGP',
        campoErro: null,
        restricaParaConcluir: [],
        entidade: {
          contato: {},
          dirigentes: [],
          documentos: [],
          usuarios: [],
          proximaEtapa: ''
        },
        salvouOK: false,
        boqueia: false,
        dirigentes: [],
        contEndereco: 0,
        listaRamosAtividade: [],
        endereco: [],
        historico: [],
        historico_atualizado: [],
        listaHistorico: [],
        usuarios: [],
        tarefas: [],
        documentosExidigidos: false,
        representanteLegalAtivo: false,
        cont: 0,
        existePrincipal: false,
        listaFormasJuridicas: [],
        mostraHistorico: false,
        listaDocConstituicao: [],
        listaDocEntidades: 'CADASTRO_ENTIDADE',
        data_expedicao_cnpj: '',
        erroData: false,
        urlLaravel: 'https://projetos.fbb.org.br:5443',
        // Demanda 64830 inclusão da informação se entidade possui CEBAS e/ou CMAS
        possuiCmas: '',
        possuiCebas: '',
        tiposArquivos: []
      }
    },
    watch: {
      data_expedicao_cnpj: function (val) {
        let newdate = moment(val, 'DD/MM/YYYY', true)
        if (newdate.isValid()) {
          this.entidade.dt_data_expedicao_cnpj = newdate.format('YYYY-MM-DD')
        }
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    mounted () {
    },
    created () {
      this.loading.tela = true
      //
      this.propostas = _.get(JSON.parse(window.localStorage.getItem('propostas')), 'lista', [])
      this.projetos = _.get(JSON.parse(window.localStorage.getItem('projetos')), 'lista', [])
      this.cadastroEntidadeRefEdital() // Verifica as propostas e projetos se tem ref com editais
      //
      this.$snotify.async('Buscando dados da Entidade. Por favor, aguarde...', {timeout: 0})
      if (this.$route.params.id) {
        axiosLaravel.get('entidades/' + this.$route.params.id).then((response) => {
          this.entidade = response.data
          // 67869 - Devolucao de cadastro entidade ocultando documentos posteriormente carregados
          // this.entidade.documentos = _.filter(this.entidade.documentos, v => {
          //   return typeof v.id !== 'undefined'
          // })
          this.entidade.tipos_documento = _.filter(this.entidade.tipos_documento, v => v !== null)
          this.entidade.observacao = ''
          this.$route.params.entidade = this.entidade
          if (_.isObject(this.entidade.forma_juridica) === false) {
            this.entidade.forma_juridica = []
          }
          if (_.isObject(this.entidade.documento_constituicao) === false) {
            this.entidade.documento_constituicao = []
          }
          this.carregaListaFormasJuridicas()
          this.carregaListaRamosAtividade()
          this.carregaListaDocumentosConstituicao()
          if (_.isNull(this)) { // Verificação de dirigente desativada temporariamente
            this.verificaUsuarioDirigente()
          }
          this.verificar()
          this.buscaTiposArquivos()
          this.$snotify.clear()
          this.data_expedicao_cnpj = moment(this.entidade.dt_data_expedicao_cnpj).format('DD/MM/YYYY')
          // this.entidade.data_expedicao_cnpj = moment(this.entidade.dt_data_expedicao_cnpj).format('DD/MM/YYYY')
          this.processos = response.data.processos
          this.cnpj = this.entidade.cnpj
          this.dirigentes = response.data.dirigentes
          this.verificarDirigenteAtivo()
          console.log('oi')
          this.tarefas = this.processos.map((item) => {
            return item.tarefas
          })
          this.historico = this.tarefas
          this.historico = _.sortBy(this.historico, 'id').reverse()
          // this.historico = response.data.processos
          this.$snotify.clear()
          // volta do backend e retorna para tela anterior
          this.$snotify.success('Dados da Entidade recuperados com sucesso!', {timeout: 2000})
          this.titulo = 'SGP' + (_.has(this.entidade, 'ds_nome') ? ' - ' + this.entidade.ds_nome : '')
          //
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
          //
          this.loading.tela = false
          this.$forceUpdate()
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
          // if (this.entidade.ds_status === 'PENDENTE_APROVACAO' && this.usuarioLogado.userType === 'ENTIDADE') {
          //   this.$swal({
          //     title: '<font color="red"><b>Atenção!</b></font>',
          //     html:
          //       '<div align="left"> O cadastro da instituição ' + '<b>' + this.entidade.ds_nome_fantasia + '</b>' + ' está em análise pela Fundação BB. Aguarde o retorno ou aprovação para que as funcionalidades de salvar e concluir sejam habilitadas.' + '</div>',
          //     showCloseButton: true,
          //     showCancelButton: false,
          //     showLoaderOnConfirm: true,
          //     focusConfirm: false
          //   })
          // }
          if (this.entidade.ds_tipo_registro === 'CREDENCIAMENTO' && this.entidade.edital) {
            this.boqueia = true
            return
          }
        })
          .catch((error) => {
            if (error) {
              this.loading.tela = false
              this.$snotify.clear()
              this.$root.trataErro(error)
            }
          })
      }
    },
    methods: {
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
      etiquetaListaFormaJuridica (option) {
        return `${option.codigo + ' / ' + option.descricao}`
      },
      etiquetaListaRamosAtividade (option) {
        return `${option.ds_codigo + '    ' + option.ds_descricao}`
      },
      cadastroEntidadeRefEdital () {
        // Como não há um processo de EDITAL com cadastro separado do cadastro desse EditaEntidade, então não tem como ter certeza que um cadastramento ocorre por causa de um edital ou não, quando se tem mais de uma proposta para a entidade
        let propostas = _.cloneDeep(this.propostas)
        // Então se excluímos as propostas que já viraram projeto
        _.remove(propostas, function (p) { return !_.isNull(p.ds_codigo_projeto_erp) })
        let dataTerminoEdital = _.get(propostas[0], 'dt_data_final')
        // Se sobrar uma proposta somente e ela for de um edital com prazo ainda não finalizado, então esse cadastramento deve ser dessa proposta de edital
        this.propostaUnicaEditalVigente = propostas.length === 1 && !_.isNull(dataTerminoEdital) && (new Date(dataTerminoEdital)).getTime() >= this.hoje.getTime()
        console.log('Tem uma só proposta e é de edital vigente', this.propostaUnicaEditalVigente)
      },
      isEditable () {
        return (this.$root.authorize('entidade-editar') || this.$root.authorize('minha-entidade-editar'))
      },
      verificar () {
        if (!this.entidade.contato.ds_telefone) {
          this.entidade.contato = {}
          this.entidade.contato.ds_telefone = ''
          this.entidade.contato.ds_celular = ''
        }
      },
      async carregaListaFormasJuridicas () {
        // Busca ramo atividades
        await this.$root.buscaFormasJuridicas(this.$store)
        // Seta variaveis com que esta gravado no store
        this.listaFormasJuridicas = this.$store.state.formasJuridicas
      },
      async carregaListaRamosAtividade () {
        // Busca ramo ativiades
        await this.$root.buscaRamoAtividades(this.$store)
        // Seta variaveis com que esta gravado no store
        this.listaRamosAtividade = this.$store.state.ramoAtividades
      },
      verificarCondicoes () {
        return this.dirigentes.some(item => {
          console.log('Verificando item:', {
            bt_ativo: item.bt_ativo,
            bt_representante_legal: item.bt_representante_legal,
            fk_cargo_mandato: item.fk_cargo_mandato
          })
          const btAtivo = Number(item.bt_ativo)
          const btRepresentanteLegal = Number(item.bt_representante_legal)
          const fkCargoMandato = Number(item.fk_cargo_mandato)
          return (
            (btAtivo === 1 && btRepresentanteLegal === 1) || (btAtivo === 1 && fkCargoMandato === 12)
          )
        })
      },
      verificarDirigenteAtivo () {
        const temPoderes = this.verificarCondicoes()
        console.log('Tem dirigente ativo?: ', temPoderes)
        if (!temPoderes) {
          this.adicionaRestricao({
            'tag': 'semDirigenteAtivo',
            'ativo': true,
            'tipo': 'restricao',
            'acao': null,
            'mensagem': 'Cadastro sem representante legal ativo. Para a conclusão desta solicitação é necessário o cadastramento pelo menos um representante legal ou designado.'
          })
        }
      },
      async carregaListaDocumentosConstituicao () {
        //
        // this.listaDocConstituicao = [{id: 'ATA_CONSTITUICAO', ds_tipo: 'Ata constituição'}, {id: 'CONTRATO_SOCIAL', ds_tipo: 'Contrato social'}, {id: 'ESTATUTO', ds_tipo: 'Estatuto'}, {id: 'LEI_ORGANICA_MUNICIPAL', ds_tipo: 'Lei orgânica municipal'}]
        //
        await axiosLaravel.post('documentos/tipos/ENTIDADE_DOC_CONSTITUICAO').then((response) => {
          this.listaDocConstituicao = response.data
          // this.entidade.documento_constituicao = this.listaDocConstituicao.filter((item) => {
          //   return item.id.toString() === this.entidade.documento_constituicao
          // })
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      outrasValidacoes () {
        if (!this.entidade.dirigentes || this.entidade.dirigentes === 0) {
          this.$snotify.error('Os dados obrigatórios do dirigente devem ser preenchidos!')
          return false
        }
        return true
      },
      salvaUsuarios () {
        if (this.entidade.usuarios) {
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
        }
      },
      // salva () {
      //   if (this.entidade.id) {
      //     // this.entidade.proximaEtapa = 'SALVAR'
      //     this.gravarCadastroEntidade(false)
      //   } else {
      //     // this.entidade.proximaEtapa = 'ANALISE'
      //     this.gravarCadastroEntidade(true)
      //   }
      // },
      verificaDocumentosExigidos () {
        if (this.entidade.tipos_documento.length > this.entidade.documentos.length) {
          this.documentosExidigidos = false
          return
        }
        //
        // Demanda 64830 inclusão da informação se entidade possui CEBAS e/ou CMAS
        let iguais = []
        this.cont = 0
        this.entidade.documentos.forEach(doc => {
          this.entidade.tipos_documento.forEach(tipo => {
            if (tipo.id === doc.tipo_documento.id) {
              iguais.push(doc.tipo_documento.id)
              this.cont++
            }
          })
        })
        console.log('Cont: ' + this.cont)
        console.log('Tipos: ' + this.entidade.tipos_documento.length)
        console.log('Docs: ' + this.entidade.documentos.length)
        console.log('Iguais: ' + iguais.length)
        let unicos = []
        if (this.entidade.documentos.length >= this.entidade.tipos_documento.length) {
          if (iguais.length >= this.entidade.tipos_documento.length) {
            iguais.forEach(i => {
              if (!unicos.includes(i)) {
                unicos.push(i)
              }
            })
          }
        }
        console.log('Unicos: ' + unicos.length)
        // for (let i = 0; i < this.entidade.tipos_documento.length; i++) {
        //   for (let j = 0; j < this.entidade.documentos.length; j++) {
        //     if (this.entidade.tipos_documento[i].id === this.entidade.documentos[j].tipo_documento.id) {
        //       this.cont++
        //     }
        //   }
        // }
        if (this.cont >= this.entidade.tipos_documento.length && unicos.length === this.entidade.tipos_documento.length) {
          this.documentosExidigidos = true
        }
      },
      verificaUsuarioDirigente () {
        if (this.usuarioLogado.userType !== 'FUNDACAO') {
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
      permiteConcluir (obj) {
        let vm = this
        this.$dialog.confirm('<p>Atenção!</p>Declaro que todas as informações fornecidas neste cadastro são verdadeiras, precisas e completas.<br/>Comprometo-me a informar imediatamente qualquer alteração nas informações prestadas.<br/>Adicionalmente, atesto que os documentos anexados a este cadastro são legítimos e autênticos.<br/>Estou ciente de que a apresentação de informações falsas ou documentos fraudulentos pode resultar em sanções legais.<br/>Assumo total responsabilidade pela veracidade das informações prestadas.', {html: true, animation: 'fade', customClass: 'avisoConfirmacao'}).then(function (dialog) {
          if (vm.restricaParaConcluir.length > 0 && _.filter(vm.restricaParaConcluir, {'ativo': true}).length > 0) {
            let restricoes = _.filter(vm.restricaParaConcluir, {'ativo': true, 'tipo': 'restricao'})
            let informacoes = _.filter(vm.restricaParaConcluir, {'ativo': true, 'tipo': 'informacao'})
            let confirmacoes = _.filter(vm.restricaParaConcluir, {'ativo': true, 'tipo': 'confirmacao'})
            if (restricoes.length > 0) {
              let mensagens = '<div class=avisoAlerta><li>' + _.join(_.map(restricoes, 'mensagem'), '<li>') + '</div>'
              vm.$dialog.alert(mensagens, {html: true, animation: 'fade', customClass: 'avisoAlerta'}).then(function (dialog) {
              })
            } else {
              if (informacoes.length > 0) {
                let mensagens = '<div class=avisoInfo><li>' + _.join(_.map(informacoes, 'mensagem'), '<li>') + '</div>'
                vm.$dialog.alert(mensagens, {html: true, animation: 'fade', customClass: 'avisoInfo'}).then(function (dialog) {
                  //
                  _.forEach(vm.restricaParaConcluir, function (item) {
                    if (item.tipo === 'informacao') {
                      _set(item, 'ativo', false)
                    }
                  })
                })
              } else if (confirmacoes.length > 0) {
                let mensagens = '<div class=avisoConfirmacao><li>' + _.join(_.map(confirmacoes, 'mensagem'), '<li>') + '</div>'
                vm.$dialog.confirm(mensagens, {html: true, animation: 'fade', customClass: 'avisoConfirmacao'}).then(function (dialog) {
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
                  vm.concluir(obj)
                }
              }
            }
          } else {
            vm.concluir(obj)
          }
        }).catch(function () {
        })
      },
      concluir () {
        let vm = this
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
        if (_.isEmpty(this.entidade.documentos)) {
          entidadeOK = false
          aba = 'Documentos'
        }
        //
        this.verificaDocumentosExigidos()
        if (this.documentosExidigidos === false) {
          this.$snotify.error('Favor Preencher Documentos Pendentes!')
          return
        }
        //
        if (entidadeOK === true) {
          this.entidade.endereco.forEach((end) => {
            if (end.bt_principal && (end.bt_principal === true || end.bt_principal === 1)) {
              this.existePrincipal = true
              this.contEndereco++
            } else {
              this.existePrincipal = false
            }
          })
          if (this.existePrincipal === false && this.contEndereco === 0) {
            this.$snotify.error('Favor sinalizar um Endereço como Principal!')
            return
          }
          //
          this.$validator.validateAll().then((result) => {
            if (result) {
              this.outrasValidacoes()
              if (this.entidade.id) {
                if (this.usuarioLogado.userType === 'ENTIDADE') {
                  this.$dialog.confirm('Ao confirmar será enviado esse cadastro para Fundação', {html: true, animation: 'fade', customClass: 'avisoConfirmacao'}).then(function (dialog) {
                    vm.gravarCadastroEntidade('ANALISE')
                  }).catch(function () {
                    console.log('Aviso de Confirmações fechado SEM confirmar conclusão de cadastro de entidade')
                  })
                } else {
                  this.gravarCadastroEntidade('ANALISE')
                }
              }
            } else {
              this.$snotify.error('O formulário de Dados da Entidade possui erros. Favor verificar!')
            }
          })
        } else {
          this.boqueia = false
          this.$snotify.error('Erros no preenchimento da aba ' + aba + '. Favor verificar.')
        }
      },
      devolverRevisao () {
        let vm = this
        this.$dialog.confirm('Esse cadastro foi enviado para Análise da FBB.<br/>Ao confirmar, ele será enviado para revisão da entidade, enquanto o edital não estiver finalizado', {html: true, animation: 'fade', customClass: 'avisoConfirmacao'}).then(function (dialog) {
          vm.loading.tela = true
          vm.$snotify.async('Devolvendo cadastro para revisão da entidade. Por favor, aguarde...', {timeout: 0})
          vm.entidade.proximaEtapa = 'REVISAO'
          vm.salvaUsuarios()
          axiosLaravel.put('entidades/' + vm.entidade.id, vm.entidade).then((response) => {
            if (response.data) {
              vm.$snotify.clear()
              vm.$snotify.success('Cadastro devolvido com sucesso! Abrindo o cadastro da entidade...')
              setTimeout(() => { location.reload(true) }, 3000)
              vm.loading.tela = false
            }
          })
            .catch((error) => {
              vm.$snotify.clear()
              vm.loading.tela = false
              vm.$root.trataErro(error)
            })
        }).catch(function () {
          console.log('Aviso de Confirmações fechado SEM confirmar devolução para revisão')
        })
      },
      salvar () {
        let vm = this
        if (this.usuarioLogado.userType === 'ENTIDADE') {
          this.$dialog.confirm('Salvamento desse cadastro não implica em enviou ainda para Fundação BB', {html: true, animation: 'fade', customClass: 'avisoConfirmacao'}).then(function (dialog) {
            vm.gravarCadastroEntidade('SALVAR')
          }).catch(function () {
            console.log('Aviso de Confirmações fechado SEM confirmar salvamento de cadastro de entidade')
          })
        } else {
          this.gravarCadastroEntidade('SALVAR')
        }
      },
      gravarCadastroEntidade (etapa) {
        let concluir = etapa !== 'SALVAR'
        this.loading.tela = true
        this.boqueia = true
        this.$snotify.async(concluir ? 'Gravando cadastro' : 'Atualizando dados' + ' da entidade. Por favor, aguarde...', {timeout: 0})
        this.entidade.proximaEtapa = etapa
        this.salvaUsuarios()
        axiosLaravel.put('entidades/' + this.entidade.id, this.entidade).then((response) => {
          if (response.data) {
            this.$snotify.clear()
            this.$snotify.success(concluir ? 'Alteração cadastral concluída com sucesso!' : 'Entidade salva com sucesso!')
            this.boqueia = false
            this.loading.tela = false
            if (!concluir) {
              this.$emit('salvou', 'OK')
              this.salvouOK = true
            } else {
              this.$router.go(-1)
            }
          }
        })
          .catch((error) => {
            this.$snotify.clear()
            this.loading.tela = false
            this.boqueia = false
            this.$root.trataErro(error)
          })
      },
      // Demanda 64830 inclusão da informação se entidade possui CEBAS e/ou CMAS
      buscaTiposArquivos () {
        if (this.localUso === undefined) {
          this.localUso = 'TODOS'
        }
        axiosLaravel.post('documentos/tipos/' + this.localUso).then((response) => {
          this.tiposArquivos = response.data
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      // Demanda 64830 inclusão da informação se entidade possui CEBAS e/ou CMAS
      onChangeCebasCmas ($event) {
        const name = $event.target.name
        const value = $event.target.value
        if (name === 'possuiCmas') {
          if (value === 'Sim') {
            this.entidade.tipos_documento.push(this.tiposArquivos.find(e => { return e.id === 70 }))
          } else if (value === 'Não') {
            let index = this.entidade.tipos_documento.findIndex(e => {
              return e.id === 70
            })
            if (index > 0) {
              this.entidade.tipos_documento.splice(index, 1)
            }
          }
        } else if (name === 'possuiCebas') {
          if (value === 'Sim') {
            this.entidade.tipos_documento.push(this.tiposArquivos.find(e => { return e.id === 71 }))
          } else if (value === 'Não') {
            let index = this.entidade.tipos_documento.findIndex(e => {
              return e.id === 71
            })
            if (index > 0) {
              this.entidade.tipos_documento.splice(index, 1)
            }
          }
        }
      }
    }
  }
</script>

<style>
  fieldset[disabled="disabled"] .multiselect * {
    background: #eeeeee;
    color: #555555;
  }
  fieldset[disabled="disabled"] .multiselect {
    border: 1px solid #d2d6de;
    background: #eeeeee;
  }
  /* .multiselect__tags {
     height: 34px !important;
     min-height: 34px !important;
     padding: 4px 40px 0 8px !important;
     border-radius: 0px !important;
     border: 1px solid #d2d6de !important;
   }
   .multiselect__select {
     width: 30px !important;
     height: 33px !important;
     text-align: right !important;
   }
   .multiselect__select:before {
     border-color: #444 transparent transparent !important;
   }*/
  .explicativo_botao {
    color: dodgerblue;
    font-style: italic;
    padding-left: 10px;
    font-size: 16px;
  }
</style>
