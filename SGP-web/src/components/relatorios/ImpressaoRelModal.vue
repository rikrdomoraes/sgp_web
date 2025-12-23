<template>
  <div>
    <div v-show="loadingShow" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
      <i class="fa fa-refresh fa-spin"></i>
    </div>
      <section class="content ng-scope">
        <div class="row">
          <div class="col-md-12">
            <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
              <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Impressão de Relatórios</h3>
              </div>
              <div class="box-body" >
                <form name="frmRegNotice" class="form-horizontal ng-pristine ng-valid-mask ng-valid-maxlength ng-valid-minlength ng-valid-max ng-valid-date ng-valid ng-valid-required" novalidate="" _lpchecked="1" style="">
                  <div class="form-group required">
                    <label for="extensao" class="control-label col-md-2">Extensão:</label>
                    <div class="col-md-4">
                      <label class="radio-inline new-control new-control-radio">
                        <input v-validate="{required: true}" type="radio" name="status" v-model="tipoDoArquivo" value="1" checked="" class="ng-pristine ng-untouched ng-valid ng-not-empty"> PDF
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="radio-inline new-control new-control-radio">
                        <input type="radio" name="status" v-model="tipoDoArquivo" value="2" class="ng-pristine ng-untouched ng-valid ng-not-empty"> Excel
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                  </div>
                  <div class="form-group required" :class="{ 'has-error' : errors.first('tipoDoArquivo')}">
                    <label for="tipoDoArquivo" class="control-label col-md-2">Relatório:</label>
                    <div class="col-md-4">
                      <select v-model="relatorio" name="tipoRelatorio" class="form-control ng-pristine ng-untouched ng-valid ng-empty">
                        <option v-if="tipoDoArquivo == 1" value="ANALISE">Análise</option>
                        <option v-if="tipoDoArquivo == 1" value="PROPOSTA">Proposta</option>
                        <!--<option v-if="tipoDoArquivo == 2" value="PLANO">Trabalho</option>-->
                        <option v-if="tipoDoArquivo == 2" value="APLICACAO">Proposta</option>
                      </select>
                      <span v-if="errors.first('')" class="label label-danger"> {{ errors.first('tipoDoArquivo') }}</span>
                    </div>
                  </div>
                  <!--<div class="form-group required">-->
                    <!--<label for="projetos" class="control-label col-md-2">Proposta:</label>-->
                    <!--<div class="col-md-4">-->
                      <!--&lt;!&ndash;<select v-model="projeto" name="projeto" class="form-control ng-pristine ng-untouched ng-valid ng-empty">&ndash;&gt;-->
                        <!--&lt;!&ndash;<option :value="projeto" v-for="projeto in projetos">{{projeto.idProjectErp + ' - ' + projeto.name}}</option>&ndash;&gt;-->
                      <!--&lt;!&ndash;</select>&ndash;&gt;-->
                      <!--<input type="text" :value="projeto.id + ' - ' + projeto.name" disabled>-->
                    <!--</div>-->
                  <!--</div>-->
                  <div class="box-footer">
                    <button v-if="relatorio !== ''" @click="onDownload" href="javascript:void(0)" type="button" class="btn btn-success btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Gerar</button>
                    <button @click="onClean" type="button"  class="btn btn-default btn-flat"><i class="fa fa-eraser" aria-hidden="true"></i> Limpar</button>
                  </div>
                </form>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>
  </div>
</template>
<script>
    export default {
      name: 'impressao-relatorio-modal',
      data () {
        return {
          loadingShow: false,
          items: [],
          tipoDoArquivo: 0,
          relatorio: '',
          projeto: {},
          filtros: {
            onlyIntegratedProposals: true,
            projectProposals: false
          }
        }
      },
      props: ['propsAnalise'],
      methods: {
        onClean () {
          this.relatorio = null
          this.tipoDoArquivo = null
        },
        onDownload () {
          this.loadingShow = true
          this.name = null
          this.file = null
          if (Number(this.tipoDoArquivo) === 1) {
            this.rel = 'proxy/project/proposal/generate-report/pdf'
          } else {
            this.rel = 'proxy/project/proposal/generate-report/xls'
          }
          axios.post(this.rel, {proposal: String(this.propsAnalise.proposal.id), report: this.relatorio}, {responseType: 'arraybuffer', headers: {'Content-Type': 'application/json'}}).then((response) => {
            this.item = response.data.value
            if (Number(this.tipoDoArquivo) === 1) {
              this.file = new Blob([response.data], {type: 'application/pdf'})
            } else {
              this.file = new Blob([response.data], {type: 'application/vnd.ms-excel'})
            }
            let ie = !!window.MSInputMethodContext && !!document.documentMode
            if (!ie) {
              let blob = this.file
              let link = document.createElement('a')
              link.href = window.URL.createObjectURL(blob)
              link.download = this.propsAnalise.proposal.name
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            } else {
              let blob = this.file
              let link = document.createElement('blob')
              link.href = window.navigator.msSaveOrOpenBlob(blob, this.item.name)
              link.download = this.projeto.name
              link.click()
            }
            this.loadingShow = false
          })
            .catch((error) => {
              console.log('error', error)
              this.$root.trataErro(error)
              this.loadingShow = false
            })
        }
      }
    }
</script>

<style scoped>

</style>
