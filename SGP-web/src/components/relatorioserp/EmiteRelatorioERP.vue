<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="'SGP - Impressão de Relatórios'"/>

    <div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
      <!--Breadcrumb-->
      <section class="content-header ng-scope">
        <h1>Relatórios</h1>

      </section>
      <section class="content ng-scope">
        <div class="row">
          <div class="col-md-12">
            <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
              <div class="box-header with-border">
                <h3 class="box-ds_titulo"><i class="fa fa-pencil" aria-hidden="true"></i> Impressão de Relatórios</h3>
              </div>
              <div class="box-body" >
                <form name="frmRegNotice" class="form-horizontal ng-pristine ng-valid-mask ng-valid-maxlength ng-valid-minlength ng-valid-max ng-valid-date ng-valid ng-valid-required" novalidate="" _lpchecked="1" style="">
                  <div class="form-group required">
                    <label for="projetos" class="control-label col-md-2">Relatório:</label>
                    <div class="col-md-4">
                      <select @click="show = true" @change="campo" v-model="relatorio" name="relatorio" class="form-control ng-pristine ng-untouched ng-valid ng-empty">
                        <option :value="relatorio" v-for="relatorio in relatorios">{{relatorio.ds_codigo + ' - ' + relatorio.ds_titulo}}</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div v-show="show" class="box box-widget">
                      <div class="box-header with-border" v-if="this.usuarioLogado.userType === 'FUNDACAO'">
                        <h4 class="box-ds_titulo"><b>Campos do Relatório: </b></h4>
                      </div>

                      <div class="box-body">
                        <div class="row">
                          <div class="col-sm-12">

                            <div class="form-group" v-if="this.usuarioLogado.userType === 'FUNDACAO'">
                              <div class="form-group" v-for="item in relatorioForm">
                                <label class="control-label col-sm-2">{{item.ds_titulo}}:</label>
                                <div class="col-sm-2">
                                  <input type="text" class="form-control" required v-model="item.value" :name="item.ds_codigo">
                                    <p>{{valores[item.ds_codigo]}}</p>
                                </div>
                              </div>
                            </div>
                            <div class="form-group" v-if="this.usuarioLogado.userType === 'ENTIDADE'">
                              <div class="form-group required" :disabled="trava === 1">
                                <label for="projeto" class="control-label col-xs-4 col-sm-3 col-lg-2"><span class="pull-left">Projeto:</span></label>
                                <div class="col-sm-12">

                                  <select name="projeto"
                                          v-model="projeto"
                                          class="form-control"
                                          :disabled="carregou !== 1"
                                          aria-hidden="true"
                                          @change="changeProjeto(projeto)" v-validate="'required'">
                                    <option v-for="projeto in projetos" :value="projeto">{{projeto.ds_codigo_projeto_erp}} - {{projeto.ds_nome}}</option>
                                  </select>
                                  <div v-if="carregou !== 1" >
                                    <i class="fa fa-refresh fa-spin"></i>&nbsp;Carregando listagem de projetos....
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="box-footer">
                    <!--<button @click="onLoad" href="javascript:void(0)" type="button" class="btn btn-primary btn-flat "><i class="fa fa-print" aria-hidden="true"></i> Emitir Relatório</button>-->
                    <g-button-moema color="success" size="button--size-ss" @click.native.prevent="onLoad" href="javascript:void(0)"><i class="fa fa-print" aria-hidden="true"></i> Emitir Relatório</g-button-moema>
                  </div>
                </form>
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
  import { mapGetters } from 'vuex'
  export default {
    name: 'EmiteRelatorioERP',
    data () {
      return {
        loading: {
          show: false
        },
        items: [],
        relatorios: [],
        relatorio: {},
        item: {},
        relatorioForm: [],
        valores: [],
        carregou: 0
      }
    },
    created: function () {
      this.onSearch()
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    watch: {
      relatorio () {
        this.relatorioForm = []
        let campos = _.split(this.relatorio.ds_nome_campos, ';')
        let camposNomes = _.split(this.relatorio.ds_codigo_campos, ';')
        camposNomes.forEach((campoNome, index) => {
          let field = {
            ds_codigo_campos: campoNome,
            ds_titulo: campos[index],
            value: null
          }
          this.relatorioForm.push(field)
          if (this.relatorio.ds_codigo === 'FJCF222.GER') {
            this.relatorioForm.forEach(item => {
              if (item.ds_codigo_campos === 'ESitPrj') {
                item.value = 'ULT'
              }
            })
          }
          if (this.relatorio.ds_codigo === 'FJCF248.GER') {
            this.relatorioForm.forEach(item => {
              if (item.ds_codigo_campos === 'ECodFor') {
                item.value = ''
              }
            })
          }
        })
        this.$forceUpdate()
      }
    },
    methods: {
      criaParametro () {
        let temp = ''
        this.relatorioForm.forEach(item => {
          // 69143 - Acerto de parametros nulos na emissao de relatorio ERP
          temp += '<' + item.ds_codigo_campos + '=' + (_.isNull(item.value) ? '' : item.value) + '>,'
        })
        temp = temp.slice(0, -1)
        return temp
      },
      onSearch () {
        let rel = []
        axiosLaravel.get('relatorio-erp').then((response) => {
          this.relatorios = response.data
          if (this.usuarioLogado.userType === 'ENTIDADE') {
            for (let x = 0; x < this.relatorios.length; x++) {
              if (this.relatorios[x].ds_codigo === 'FJCF219.GER' || this.relatorios[x].code === 'FJCF222.GER') {
                rel.push(this.relatorios[x])
              }
            }
            this.relatorios = rel
          } else {
            this.relatorios = response.data
          }
          this.buscaProjetos()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      onClean () {
        this.relatorio = null
      },
      onLoad () {
        this.$snotify.clear()
        this.$snotify.async('Gerando relatório. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.post('relatorio-erp/emitir', {erpReport: this.relatorio, params: this.criaParametro()}).then((response) => {
          this.onDownload(response)
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      onDownload (response) {
        this.item = response.data.arquivo
        const contentType = 'application/pdf'
        const b64Data = response.data.arquivo
        this.file = this.b64toBlob(b64Data, contentType)
        let ie = !!window.MSInputMethodContext && !!document.documentMode
        console.log('relatorioForm', this.relatorioForm)
        console.log('relatorio', this.relatorio)
        if (!ie) {
          let blob = this.file
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          // 69143 - Acerto de parametros nulos na emissao de relatorio ERP
          link.download = this.relatorioForm[0].ds_titulo + ' - ' + this.relatorioForm[0].value + ' / ' + this.relatorio.ds_titulo
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } else {
          let blob = this.file
          let link = document.createElement('blob')
          link.href = window.navigator.msSaveOrOpenBlob(blob, this.item.name)
          // 69143 - Acerto de parametros nulos na emissao de relatorio ERP
          link.download = this.relatorioForm[0].ds_titulo + ' - ' + this.relatorioForm[0].value + ' / ' + this.relatorio.ds_titulo
          link.click()
        }
        this.$snotify.clear()
        this.$snotify.success('Relatório gerado com sucesso!')
      },
      buscaProjetos () {
        this.loadingShow = true // bloquea a tela enquanto busca os dados
        this.projetos = null
        this.loading.show = true
        axiosLaravel.get('projetos').then((response) => {
          this.$snotify.clear()
          this.projetos = response.data
          this.loading.show = false
          this.carregou = 1
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      changeProjeto: function (projeto) {
        this.relatorioForm[0].value = projeto.ds_codigo_projeto_erp
      },
      b64toBlob (b64Data, contentType = '', sliceSize = 512) {
        const byteCharacters = atob(b64Data)
        const byteArrays = []
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize)
          const byteNumbers = new Array(slice.length)
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          byteArrays.push(byteArray)
        }
        const blob = new Blob(byteArrays, {type: contentType})
        return blob
      }
    }
  }
</script>

<style scoped>

</style>
