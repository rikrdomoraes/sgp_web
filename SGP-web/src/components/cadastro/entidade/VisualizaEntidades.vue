<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="titulo"/>

    <!-- ngView: --><div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
    <section class="content-header ng-scope">
      <h1>Entidades</h1>
      <b-breadcrumb :items="breadcrumb"/>
    </section>

    <!-- main content -->
    <section class="content ng-scope">

      <div class="row">
        <div class="col-md-12">
          <!-- grid -->
          <!-- ngIf: show.grid --><div ng-if="show.grid" class="ng-scope ng-isolate-scope"><div class="box box-primary">
          <div class="box-header with-border">
            <h3 class="box-title"><i class="fa fa-search" aria-hidden="true"></i> Cadastro da Entidade - Visualização</h3>
          </div>
          <!-- /.box-header -->
          <fieldset>
            <div class="box-body" id="dadosCadastrais">
              <div class="row">
                <div class="col-md-12">
                  <form name="frmCommonRegister" class="form-horizontal" novalidate >
                    <div class="col-md-6" id="cadastroJuri">
                      <fieldset :disabled="true">
                        <legend>Dados da entidade:</legend>

                        <!-- company name -->
                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('Razão social')}">
                          <label for="Razão social" class="control-label col-md-4">Razão social:</label>
                          <div class="col-md-8">
                            <input v-model="entidade.ds_nome" name="Razão social" class="form-control" type="text" ref="Razão social" v-validate="'required|min:1|max:255'">
                            <span v-if="errors.first('Razão social')" class="label label-danger"> {{('O campo Razão Social é obrigatório') }}</span>
                          </div>
                        </div>

                        <!-- cnpj -->
                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('CNPJ')}">
                          <label for="CNPJ" class="control-label col-md-4" ref="CNPJ">CNPJ:</label>
                          <div class="col-md-6 col-lg-4">
                            <the-mask v-model="entidade.ds_cnpj" name="CNPJ" class="form-control" type="text"
                                      v-validate="'required|min:14|max:14'" mask="##.###.###/####-##">
                            </the-mask>
                            <span v-if="errors.first('CNPJ')" class="label label-danger"> {{('O campo CNPJ é obrigatório') }}</span>
                          </div>
                        </div>

                        <!-- cnpj expedition time -->
                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('cnpjExpeditionTime')}">
                          <label for="cnpjExpeditionTime" class="control-label col-md-4">Expedição CNPJ:</label>
                          <div class="col-md-6 col-lg-4">
                            <div class="input-group">
                              <input v-model="entidade.dt_data_expedicao_cnpj" name="CNPJ" type="date" class="form-control" :format="formatDate"></input>
                              <span v-if="errors.first('cnpjExpeditionTime')" class="label label-danger"> {{('O campo Expedição do CNPJ é obrigatório') }}</span>
                            </div>
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
                            </multiselect>
                            <span v-if="errors.first('forma_juridica')" class="label label-danger"> {{ errors.first('forma_juridica') }}</span>
                          </div>
                        </div>

                        <!-- Ramo de Atividade -->
                        <div v-show="false" class="form-group required-field" :class="{ 'has-error' : errors.first('ramos_atividade')}">
                          <label for="ramos_atividade" class="control-label col-md-4"> Ramos de Atividade: </label>
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
                                         v-validate="'required'">
                              <template slot-scope="props"><span class="multiselect__tag"><span>{{ props.ds_codigo }}</span><span class="custom__remove" @click="props.remove(props)">❌</span></span></template>
                            </multiselect>
                            <span v-if="errors.first('ramos_atividade')" class="label label-danger"> {{ errors.first('ramos_atividade') }}</span>
                          </div>
                        </div>

                        <!-- Documento de constituição -->
                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('listaDocConstituicao')}">
                          <label for="listaDocConstituicao" class="control-label col-md-4"> Documento de constituição: </label>
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
                            </multiselect>
                            <span v-if="errors.first('listaDocConstituicao')" class="label label-danger"> {{ errors.first('listaDocConstituicao') }}</span>
                          </div>
                        </div>

                      </fieldset>
                    </div>

                    <div class="col-md-5 col-lg-6" id="contato">
                      <fieldset  :disabled="true">
                        <legend>Contato:</legend>

                        <!-- phone -->
                        <div class="form-group required-field">
                          <label for="Telefone" class="control-label col-md-4">Telefone:</label>
                          <div class="col-md-8 col-lg-4">
                            <input v-if="entidade.contato" v-model="entidade.contato.ds_telefone" v-mask="'(##) ####-#####'" :masked="masked" name="Telefone" class="form-control" type="text" v-validate="'required|min:1'" ref="Telefone">
                          </div>
                        </div>

                        <!-- mobile -->
                        <div class="form-group">
                          <label for="mobile" class="control-label col-md-4">Celular:</label>
                          <div class="col-md-8 col-lg-4">
                            <input v-if="entidade.contato" v-model="entidade.contato.ds_celular" v-mask="'(##) #####-#####'" :masked="masked" name="mobile" class="form-control" type="text">
                          </div>
                        </div>


                        <!-- email -->
                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('Email')}">
                          <label for="email" class="control-label col-md-4">E-Mail:</label>
                          <div class="col-md-8">
                            <input v-model="entidade.ds_email" name="Email" class="form-control" type="text" delivery="account" method="uniqueUserEmail" v-validate="'required|min:1|max:255'" ref="Email">
                          </div>
                          <span v-if="errors.first('Email')" class="label label-danger"> {{('O campo E-mail é obrigatório') }}</span>
                        </div>

                        <!-- website -->
                        <div class="form-group">
                          <label for="email" class="control-label col-md-4">Site:</label>
                          <div class="col-md-8">
                            <input v-model="entidade.ds_website" name="website" class="form-control" type="text" v-validate="'max:255'">
                          </div>
                        </div>

                        <!-- Demanda 64830 inclusão da informação se entidade possui CEBAS e/ou CMAS -->
                        <!-- Informação se entidade possui CEBAS ou CMAS-->
                        <div class="form-group required-field">
                          <label for="possuiCebas" class="control-label col-md-4">Possui CEBAS:</label>
                          <div class="col-md-2">
                            <select v-model="possuiCebas" class="form-control" name="possuiCebas">
                              <option>Não</option>
                              <option>Sim</option>
                            </select>
                          </div>
                        </div>

                        <div class="form-group required-field">
                          <label for="possuiCmas" class="control-label col-md-4">Possui CMAS/CAS:</label>
                          <div class="col-md-2">
                            <select v-model="possuiCmas" class="form-control" name="possuiCmas">
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
                      <endereco :entEnderecos="entidade.endereco" :disable="disable"></endereco>
                    </div>

                    <!-- chiefs -->
                    <div class="col-md-12">
                      <div class="box box-widget">
                        <div class="box-header">
                          <h3 class="box-title">Dirigentes:</h3>
                        </div>
                      </div>
                      <dirigentes :entDirigentes="entidade.dirigentes" :entidadeParceira="entidade" name="dirigentes" :disable="disable"></dirigentes>
                    </div>

                    <!-- Assinatura -->
                    <div class="col-md-12">
                      <div class="box box-widget">
                        <div class="box-header">
                          <h3 class="box-title">Assina convênio com a Fundação BB:</h3>
                        </div>
                      </div>
                      <assinaturaDirigentes :visualiza="true"></assinaturaDirigentes>
                    </div>


                    <!-- users -->

                    <div class="col-md-12">
                      <div class="box box-widget">
                        <div class="box-header">
                          <h3 class="box-title">Usuários da entidade:</h3>
                        </div>
                      </div>
                      <usuarios :entUsuarios="entidade.usuarios" :disable="disable"></usuarios>
                    </div>

                    <!--Documentos-->
                    <div class="col-md-12">
                      <div class="box box-widget">
                        <div class="box-header">
                          <h3 class="box-title">Documentos Upload</h3>
                        </div>
                      </div>
                      <div class="col-md-12">
                        <upload-documentos-php-novo :propDocumentos="entidade.documentos" :documentTypes="''" :disable="disable" :local-uso="'TODOS'"></upload-documentos-php-novo>
                      </div>
                    </div>

                    <!-- approval history -->
                    <div class="col-md-12">
                      <div class="box box-widget">
                        <div class="box-header">
                          <h3 class="box-title">Histórico:</h3>
                        </div>
                      </div>
                      <historico-entidade :entHistorico="historico"></historico-entidade>
                    </div>
                  </form>
                </div>
                <!-- /.col -->
              </div>
              <!-- /.row -->
            </div>
          </fieldset>
          <!-- /.box-body -->
          <div class="box-footer" >
            <g-button-moema color="warning" size="button--size-ss" @click.native="$router.go(-1)"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</g-button-moema>
          </div>
          <!-- /.box-footer -->
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

  export default {
    components: {
      Endereco,
      Dirigentes,
      UploadDocumentosPhpNovo,
      HistoricoEntidade,
      Usuarios,
      assinaturaDirigentes
    },
    name: 'cadastro-entidade-visualiza',
    data () {
      return {
        titulo: 'SGP',
        campoErro: null,
        disable: true,
        entidade: {
          contato: {
            ds_telefone: null
          },
          dirigentes: [],
          documentos: [],
          ramo_atividade: []
        },
        listaRamosAtividade: [],
        listaFormasJuridicas: [],
        listaDocConstituicao: [],
        boqueia: false,
        dirigentes: [],
        ramoAtividade: [],
        endereco: {},
        historico: [],
        tarefas: [],
        usuarios: {},
        // Demanda 64830 inclusão da informação se entidade possui CEBAS e/ou CMAS
        possuiCmas: '',
        possuiCebas: ''
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    mounted () {
    },
    async created () {
      this.$snotify.async('Buscando dados da Entidade. Por favor, aguarde...', {timeout: 0})
      // Busca ramo ativiades
      await this.$root.buscaRamoAtividades(this.$store)
      // Seta variaveis com que esta gravado no store
      this.ramoAtividade = this.$store.state.ramoAtividades
      //
      if (this.$route.params.id) {
        // this.loadHistory()
        axiosLaravel.get('entidades/ultimosnapshot/' + this.$route.params.id).then((response) => {
          this.entidade = response.data
          if (_.isNull(this.entidade.contato)) {
            this.entidade.contato = {}
          }
          this.$snotify.clear()
          if (_.isObject(this.entidade.forma_juridica) === false) {
            this.entidade.forma_juridica = []
          }
          if (_.isObject(this.entidade.documento_constituicao) === false) {
            this.entidade.documento_constituicao = []
          }
          // Demanda 64830 inclusão da informação se entidade possui CEBAS e/ou CMAS
          if (this.entidade.documentos.findIndex(e => { return e.tipo_documento.id === 70 }) >= 0) {
            this.possuiCmas = 'Sim'
          } else {
            this.possuiCmas = 'Não'
          }
          if (this.entidade.documentos.findIndex(e => { return e.tipo_documento.id === 71 }) >= 0) {
            this.possuiCebas = 'Sim'
          } else {
            this.possuiCebas = 'Não'
          }
          this.carregaListaFormasJuridicas()
          this.carregaListaRamosAtividade()
          this.carregaListaDocumentosConstituicao()
          this.processos = response.data.processos
          this.cnpj = this.entidade.cnpj
          this.dirigentes = response.data.dirigentes
          this.tarefas = this.processos.map((item) => {
            return item.tarefas
          })
          for (let i = 0; i < this.tarefas.length; i++) {
            for (let j = 0; j < this.tarefas[i].length; j++) {
              if (this.tarefas[i][j].tipo === 'USUARIO') {
                this.historico.push(this.tarefas[i][j])
              }
            }
          }
          // this.loading.show = false
          this.$snotify.clear()
          // volta do backend e retorna para tela anterior
          this.$snotify.success('Dados da Entidade recuperados com sucesso!', {timeout: 2000})
          this.titulo = 'SGP' + (_.has(this.entidade, 'ds_nome') ? ' - ' + this.entidade.ds_nome : '')
          this.$forceUpdate()
          if (this.entidade.bt_ativo === '1' && this.usuarioLogado.userType === 'ENTIDADE') {
            this.$swal({
              title: '<font color="red"><b>Atenção!</b></font>',
              // add a custom html tags by defining a html method.
              html:
                '<div align="left"> A entidade ' + '<b>' + this.entidade.ds_nome + '</b>' + ', já foi aprovada no sistema. Qualquer alteração cadastral será passível de nova aprovação pela FBB.' + '</div>',
              showCloseButton: true,
              showCancelButton: false,
              showLoaderOnConfirm: true,
              focusConfirm: false
            })
          }
          if (this.entidade.ds_tipo_registro === 'CREDENCIAMENTO' && this.entidade.edital) {
            this.boqueia = true
            return
          }
        })
          .catch((error) => {
            if (error) {
              this.$snotify.clear()
              this.$root.trataErro(error)
            }
          })
      }
      this.formasJuridicas = [{c: '101-5', d: 'Órgão Público do Poder Executivo Federal'}, {
        c: '102-3',
        d: 'Órgão Público do Poder Executivo Estadual ou do Distrito Federal'
      }, {c: '103-1', d: 'Órgão Público do Poder Executivo Municipal'}, {
        c: '110-4',
        d: 'Autarquia Federal'
      }, {c: '111-2', d: 'Autarquia Estadual ou do Distrito Federal'}, {
        c: '112-0',
        d: 'Autarquia Municipal'
      }, {c: '113-9', d: 'Fundação Pública de Direito Público Federal'}, {
        c: '114-7',
        d: 'Fundação Pública de Direito Público Estadual ou do Distrito Federal'
      }, {c: '115-5', d: 'Fundação Pública de Direito Público Municipal'}, {
        c: '116-3',
        d: 'Órgão Público Autônomo Federal'
      }, {c: '117-1', d: 'Órgão Público Autônomo Estadual ou do Distrito Federal'}, {
        c: '118-0',
        d: 'Órgão Público Autônomo Municipal'
      }, {c: '123-6', d: 'Estado ou Distrito Federal'}, {c: '124-4', d: 'Município'}, {
        c: '125-2',
        d: 'Fundação Pública de Direito Privado Federal'
      }, {c: '126-0', d: 'Fundação Pública de Direito Privado Estadual ou do Distrito Federal'}, {
        c: '127-9',
        d: 'Fundação Pública de Direito Privado Municipal'
      }, {c: '201-1', d: 'Empresa Pública'}, {c: '214-3', d: 'Cooperativa'}, {
        c: '227-5',
        d: 'Empresa Binacional'
      }, {c: '306-9', d: 'Fundação Privada'}, {c: '307-7', d: 'Serviço Social Autônomo'}, {
        c: '313-1',
        d: 'Entidade Sindical'
      }, {c: '320-4', d: 'Estabelecimento, no Brasil, de Fundação ou Associação Estrangeiras'}, {
        c: '321-2',
        d: 'Fundação ou Associação Domiciliada no Exterior'
      }, {c: '323-9', d: 'Comunidade Indígena'}, {c: '330-1', d: 'Organização Social (OS)'}, {
        c: '399-9',
        d: 'Associação Privada'
      }, {c: '501-0', d: 'Organização Internacional'}, {
        c: '502-9',
        d: 'Representação Diplomática Estrangeira'
      }, {c: '503-7', d: 'Outras Instituições Extraterritoriais'}, {
        c: '204-6',
        d: 'Sociedade Anônima Aberta'
      }, {c: '205-4', d: 'Sociedade Anônima Fechada'}]
    },
    methods: {
      customLabel (option) {
        return `${option.c + ' / ' + option.d}`
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
        //
        this.listaDocConstituicao = [{id: 'ATA_CONSTITUICAO', ds_tipo: 'Ata constituição'}, {id: 'CONTRATO_SOCIAL', ds_tipo: 'Contrato social'}, {id: 'ESTATUTO', ds_tipo: 'Estatuto'}, {id: 'LEI_ORGANICA_MUNICIPAL', ds_tipo: 'Lei orgânica municipal'}]
        //
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
      // verificar () {
      //   if (!this.entidade.hasOwnProperty('contact')) {
      //     this.entidade.contact = {}
      //     this.entidade.contact.phone = ''
      //     this.entidade.contact.mobile = ''
      //   }
      // },
      outrasValidacoes () {
        if (!this.entidade.dirigentes || this.entidade.dirigentes === 0) {
          this.$snotify.error('Os dados obrigatórios do dirigente devem ser preenchidos!')
          return false
        }
        return true
      },
      salvaUsuarios () {
        axios.post('proxy/account/entities/' + this.entidade.id + '/users', this.usuarios).then((response) => {
          this.users = response.data.value
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      salva () {
        if (this.entidade.id) {
          this.atualiza()
        } else {
          this.grava()
        }
      },
      conclui () {
        let entidadeOK = true
        let aba = ''
        if (_.isEmpty(this.endereco)) {
          entidadeOK = false
          aba = 'Endereço'
        }
        if (_.isEmpty(this.dirigentes)) {
          entidadeOK = false
          aba = 'Dirigentes'
        }
        if ((this.entidade.simplified) && (this.entidade.status === 'PENDENTE_APROVACAO')) {
          entidadeOK = true
        }
        if (entidadeOK) {
          this.$validator.validateAll().then((result) => {
            if (result) {
              this.outrasValidacoes()
              if (this.entidade.id) {
                axios.put('/proxy/account/entities/' + this.entidade.id, this.entidade).then((response) => {
                  this.salvaUsuarios()
                })
                  .catch((error) => {
                    this.$root.trataErro(error)
                  })
              } else {
                axios.post('proxy/account/entities/' + this.entidade).then((response) => {
                })
              }
              if (this.entidade.active === false) {
                this.$snotify.success('Cadastro da entidade concluído com sucesso! Aguarde e-mail da Fundação Banco do brasil com as informações para dar continuidade ao processo !')
                setTimeout(() => {
                  this.$router.go(-1)
                }, 2000)
              } else {
                this.$snotify.success('Alteração cadastral concluída com sucesso!')
                this.$router.go(-1)
              }
            } else {
              this.errors.items.forEach((item) => {
                this.campoErro = item.field
                if (this.campoErro === 'cnpjExpeditionTime') {
                  $('input[name="cnpjExpeditionTime"]').focus()
                } else if (this.campoErro === 'CNPJ') {
                  $('input[name="CNPJ"]').focus()
                } else {
                  this.$snotify.error(item.msg, '', this.$root._data.error, this.$refs[this.campoErro].focus())
                }
              })
            }
          })
        } else {
          this.$snotify.error('Erros no preenchimento da aba ' + aba + '. Favor verificar.')
        }
      },
      // loadHistory () {
      //   console.log('caiu aqui')
      //   axios.get('/proxy/account/entities/' + this.$route.params.id + '/history').then((response) => {
      //     this.historico = response.data.value
      //   })
      //     .catch((error) => {
      //       this.$root.trataErro(error)
      //     })
      // },
      atualiza () {
        axiosLaravel.put('entidades/' + this.entidade.id, this.entidade).then((response) => {

        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
        this.entidade.users = this.usuarios
        axios.put('/proxy/account/entities/' + this.entidade.id + '/temp', this.entidade).then((response) => {
          this.salvaUsuarios()
          this.$snotify.success('Entidade salva com sucesso!')
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      grava () {
        this.entidade.users = this.usuarios
        axios.post('proxy/account/entities/temp/' + this.entidade).then((response) => {
          this.$snotify.success('Entidade salva com sucesso!')
        })
      }
    }
  }
</script>

<style scoped>


</style>
