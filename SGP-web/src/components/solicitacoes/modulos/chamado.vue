<template>
<!-- Modal -->
  <div class="">
      <section class="footer">
        <span>
            <g-button-ujarak color="success" size="button--size-ss" @click.native="salvaChamado()"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar</g-button-ujarak>
        </span>
      </section>
        <div class="col-md-12">
          <form name="frmCommonRegister" class="form-horizontal" novalidate >
            <div class="col-md-7 col-lg-6" id="chamado">
              <fieldset>
                <legend>
                 O chamado é para um projeto específico?
                </legend>
                <div class="row">
                  <div class="box-body" style="padding-top: 0px;">
                    <div class="col-md-2 form-group required" :class="{ 'has-error' : errors.first('projetoSN')}">
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input v-validate="'required'" type="radio" name="projetoSN" v-model="projetoEspecifico" value="SIM" class=""> Sim
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input v-validate="'required'" type="radio" name="projetoSN"  v-model="projetoEspecifico" value="NAO" class=""> Não
                        <div class="new-control-indicator"></div>
                      </label>
                      <span v-if="errors.first('projetoSN')" class="label label-danger"> {{('O campo acima deve ser marcado com Sim ou Não') }}</span>
                    </div>
                  </div>
                </div>
                <!-- projeto -->
                <div class="row" v-if="projetoEspecifico === 'SIM'">
                  <div class="col-sm-10" >
                    <div class="form-group required" :class="{ 'has-error' : errors.first('projeto')}">
                      <label for="projeto" class="control-label col-xs-4 col-sm-3 col-lg-2"><span class="pull-left">Projeto:</span></label>
                      <div class="col-sm-12">
                        <multiselect v-model="projeto" :options="projetos"
                                     :multiple="false"
                                     :close-on-select="true"
                                     :clear-on-select="false"
                                     :hide-selected="false"
                                     :preserve-search="true"
                                     placeholder="Selecione um projeto"
                                     @select="changeProjeto($event)"
                                     :preselect-first="false"
                                     :custom-label="etiquetaTipos"
                                     selectLabel=""
                                     label="Projeto"
                                     track-by="Projeto"
                                     deselectLabel=""
                                     selectedLabel="Selecionado"
                                     name="projeto"
                                     data-vv-as="Projeto"
                                     :disabled="false"
                                     v-validate="{required: projetoEspecifico === 'SIM'}">
                          <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
                        </multiselect>
                        <!--<select name="projeto"-->
                                <!--v-model="projeto"-->
                                <!--class="form-control"-->
                                <!--aria-hidden="true"-->
                                <!--@change="changeProjeto(projeto)" v-validate="'required'">-->
                          <!--<option v-for="projeto in projetos" :value="projeto">{{projeto.Projeto}}</option>-->
                        <!--</select>-->
                      </div>
                    </div>
                    <span v-if="errors.first('projeto')" class="label label-danger"> {{('O campo Projeto deve ser selecionado') }}</span>
                  </div>
                </div>
                <legend v-if="projetoEspecifico === 'SIM' && projeto.Numero_projeto">
                  O chamado é para uma tarefa específica?
                </legend>
                <div class="row" v-if="projetoEspecifico === 'SIM' && projeto.Numero_projeto">
                  <div class="box-body" style="padding-top: 0px;">
                    <div class="col-md-2 form-group required" :class="{ 'has-error' : errors.first('tarefaSN')}">
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input v-validate="'required'" type="radio" name="tarefaSN" v-model="tarefaEspecifica" value="SIM"> Sim
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input v-validate="'required'" type="radio" name="tarefaSN"  v-model="tarefaEspecifica" value="NAO"> Não
                        <div class="new-control-indicator"></div>
                      </label>
                      <span v-if="errors.first('tarefaSN')" class="label label-danger"> {{('O campo acima deve ser marcado com Sim ou Não') }}</span>
                    </div>
                  </div>
                </div>
                <div class="row" v-if="projetoEspecifico === 'SIM' && tarefaEspecifica === 'SIM'">
                  <div class="col-sm-10" >
                    <div class="form-group required" :class="{ 'has-error' : errors.first('tarefa')}">
                      <label for="tarefa" class="control-label col-xs-4 col-sm-3 col-lg-2"><span class="pull-left">Tarefa:</span></label>
                      <div class="col-sm-12">
                        <multiselect v-model="tarefa" :options="tarefas"
                                     :multiple="false"
                                     :close-on-select="true"
                                     :clear-on-select="false"
                                     :hide-selected="false"
                                     :preserve-search="true"
                                     placeholder="Selecione um projeto"
                                     @select="changeTarefa($event)"
                                     :preselect-first="false"
                                     :custom-label="etiquetaTarefas"
                                     selectLabel=""
                                     label="id"
                                     track-by="id"
                                     deselectLabel=""
                                     selectedLabel="Selecionado"
                                     name="tarefa"
                                     data-vv-as="Tarefa"
                                     :disabled="false"
                                     v-validate="{required: tarefaEspecifica === 'SIM'}">
                          <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
                        </multiselect>
                      </div>
                    </div>
                    <span v-if="errors.first('tarefa')" class="label label-danger"> {{('O campo Tarefa deve ser selecionado') }}</span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-10" >
                    <div class="form-group required" :class="{ 'has-error' : errors.first('assunto')}">
                      <label for="assunto" class="control-label col-xs-4 col-sm-3 col-lg-2"><span class="">Assunto:</span><font style="color: red; font-size: medium">*</font></label>
                      <div class="col-sm-12">
                        <multiselect v-model="assunto" :options="listaAssuntos"
                                     :multiple="false"
                                     :close-on-select="true"
                                     :clear-on-select="false"
                                     :hide-selected="false"
                                     :preserve-search="true"
                                     placeholder="Selecione um projeto"
                                     @select="changeAssunto($event)"
                                     :custom-label="etiquetaAssuntos"
                                     :preselect-first="false"
                                     selectLabel=""
                                     label="id"
                                     track-by="id"
                                     deselectLabel=""
                                     selectedLabel="Selecionado"
                                     name="assunto"
                                     data-vv-as="assunto"
                                     :disabled="false"
                                     v-validate="'required'">
                          <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
                        </multiselect>
                      </div>
                    </div>
                  </div>
                </div>
                <span v-if="errors.first('assunto')" class="label label-danger"> {{('O campo Assunto é obrigatório') }}</span>
              </fieldset>
            </div>
            <div class="col-md-7 col-lg-6 " id="chamado2">
              <div class="required-field" :class="{ 'has-error' : errors.first('descricao')}">
              <label class="control-label">Descrição do problema ou dúvida:</label>
              <textarea v-model="chamadoObj.descricao" style="height:350px;resize:none;border: #0a568c;border: 1px solid #a8a3a5;" name="descricao" class="form-control"
                                 v-validate="'required'"></textarea>
              </div>
              <span v-if="errors.first('descricao')" class="label label-danger"> {{('O campo Descrição é obrigatório') }}</span>
              <br>
              <div class="large-12 medium-12 small-12 cell">
                  <div class="box-header with-border">
                    <h3 class="box-title">Anexo</h3>
                  </div>
                  <upload-documentos-chamado :propDocumentos="chamadoObj.anexos"></upload-documentos-chamado>
                </div>
            </div>
            <div><br><br></div>
            <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
              <i class="fa fa-refresh fa-spin"></i>
            </div>
          </form>

      </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import UploadDocumentosChamado from '../../modules/uploadDocumentosChamado'
  export default {
    name: 'chamado',
    components: {UploadDocumentosChamado},
    data () {
      return {
        data: [],
        items: [],
        projeto: [],
        projetos: [],
        tarefas: [],
        tarefa: [],
        assuntos: [{
          id: 1,
          nome: 'Geral'
        }],
        listaAssuntos: [],
        assunto: [],
        filtros: {
          createdAt: null,
          createdAtDate: null,
          entityId: null,
          project: null,
          requestType: null
        },
        chamadoObj: {
          anexos: [],
          fk_documento: null,
          entidade_id: null,
          processo_id: null,
          projeto_id: null,
          tarefa_id: null,
          assunto_id: null,
          descricao: null
        },
        projetoEspecifico: null,
        tarefaEspecifica: null,
        pesquisa: '',
        loading: {
          show: false
        }
      }
    },
    props: ['propsProjetos'],
    watch: {
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    async mounted () {
      this.loading.show = true
      this.buscaAssuntosAtivos()
      if (this.usuarioLogado.userType === 'ENTIDADE') {
        this.chamadoObj.entidade_id = this.usuarioLogado.entidade.id
      }
      this.$parent.$on('listaProjetos', message => {
        this.projetos = message
        this.loading.show = false
        console.log('.....', this.projetos)
      })
    },
    methods: {
      changeProjeto: async function (projeto) {
        console.log('projeto', projeto)
        this.loading.show = true
        this.pesquisa = projeto.Numero_projeto
        console.log('this.pesquisa', this.pesquisa)
        // this.pesquisa = (this.usuarioLogado.userType !== 'FUNDACAO' && this.pesquisa.length === 0) ? null : this.pesquisa
        console.log('this.pesquisa', this.pesquisa)
        await axiosLaravel.post('processos/pesquisa/', {'termo': this.pesquisa}).then((response) => {
          console.log('response.data>>>>>>>', response.data)
          this.chamadoObj.projeto_id = response.data[0].id_projeto
          this.chamadoObj.entidade_id = response.data[0].id_entidade
          this.tarefas = response.data
          this.pesquisa = ''
          this.loading.show = false
          this.$forceUpdate()
        })
          .catch((error) => {
            if (error) {
              this.loading.show = false
              this.$root.trataErro(error)
            }
          })
      },
      changeTarefa: async function (tarefa) {
        console.log('tarefa', tarefa)
        this.chamadoObj.processo_id = tarefa.id
        this.chamadoObj.tarefa_id = tarefa.id_tarefa
      },
      changeAssunto: async function (assunto) {
        console.log('tarefa', assunto)
        this.chamadoObj.assunto_id = assunto.id
      },
      buscaProjetos () {
        this.loading.show = true
        console.log('caiu aqui')
        axiosLaravel.post('processos/projetos', {processo: 'PAGAMENTO'}).then((response) => {
          this.projetos = response.data
          this.loading.show = false
          this.$forceUpdate() // força o update da tela para não ter problema
        })
          .catch((error) => {
            this.loading.show = false
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      etiquetaTarefas (option) {
        console.log('etiqueta', option)
        let valor = parseFloat(option.valor).toFixed(2)
        return `ID: ${option.id} - Tipo: ${option.tipo_solicitacao} - Valor: R$ ${valor}`
      },
      etiquetaAssuntos (option) {
        return `${option.assunto}`
      },
      salvaChamado () {
        // Chamado novo sempre 1 - Aguardando Atendimento
        this.chamadoObj.status_id = 1
        this.$validator.validateAll().then((result) => {
          if (result) {
            console.log('chamadoObj', this.chamadoObj)
            this.$snotify.async('Salvando o Chamado. Por favor, aguarde...', {timeout: 0})
            axiosLaravel.post('chamado/grava', this.chamadoObj).then((response) => {
              this.$snotify.clear()
              this.$snotify.success('Chamado salvo com sucesso!')
              this.$emit('fechaModal', false)
              this.$router.push('/cadastro/chamado/lista/')
            })
              .catch((error) => {
                this.$snotify.clear()
                this.$root.trataErro(error)
              })
          } else {
            this.$snotify.error('O formulário possui erros. Favor verificar!')
          }
        })
      },
      buscaAssuntosAtivos () {
        axiosLaravel.post('assuntos/ativos').then((response) => {
          console.log('response.data', response.data)
          this.listaAssuntos = response.data
          //
          this.$forceUpdate()
        })
          .catch((error) => {
            if (error) {
              this.$root.trataErro(error)
            }
          })
      },
      onDownload (documento) {
        if (documento.file) {
          download(documento.file, documento.ds_nome_arquivo, documento.ds_content_type)
        } else {
          axiosLaravel.get('documentos/download/' + documento.id, {responseType: 'arraybuffer'}).then((response) => {
            let ie = !!window.MSInputMethodContext && !!document.documentMode
            if (!ie) {
              let blob = new Blob([response.data], {type: documento.ds_content_type})
              let link = document.createElement('a')
              link.href = window.URL.createObjectURL(blob)
              link.download = documento.ds_nome_arquivo
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            } else {
              var bytes = new Uint8Array(resultByte)
              let blob = new Blob([bytes], {type: documento.ds_content_type})
              let link = document.createElement('blob')
              link.href = window.navigator.msSaveOrOpenBlob(blob, documento.ds_nome_arquivo)
              link.download = documento.ds_nome_arquivo
              link.click()
            }
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        }
      }
    }
  }
</script>

<style scoped>
  .footer{
    width: 100%;
    height: 100px;
    position: relative;
    bottom: 0%;
    left: 0;
  }
</style>
