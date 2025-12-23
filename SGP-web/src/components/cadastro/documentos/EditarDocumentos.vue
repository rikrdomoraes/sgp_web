<template>
    <div class="content-wrapper" style="min-height: 870px;">
        <div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
          <!--Breadcrumb-->
        <section class="content-header ng-scope">
          <h1>Tipo de Documentos</h1>
          <b-breadcrumb :items="[{
          text: 'Inicial',
          href: '/'
          }, {
          text: 'Cadastro',
          href: '#'
          }, {
          text: 'Documentos',
          active: true
          }]"/>
        </section>

        <!-- main content -->
        <section class="content ng-scope">

          <div class="row">
            <div class="col-md-12">
             <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
              <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Cadastro de Documentos</h3>
              </div>
              <div class="box-body" >
                <form name="frmRegNotice" class="form-horizontal ng-pristine ng-valid-mask ng-valid-maxlength ng-valid-minlength ng-valid-max ng-valid-date ng-valid ng-valid-required" novalidate="" _lpchecked="1" style="">
                  <div class="form-group required" :class="{ 'has-error' : errors.first('nomeDocumento')}">
                    <label for="nomeDocumento" class="control-label col-md-2">Nome do Documento:</label>
                    <div class="col-md-4">
                      <input v-validate="{required: true}" v-model="documento.ds_tipo" name="nomeDocumento" class="form-control ng-pristine ng-valid-maxlength ng-valid-minlength ng-not-empty ng-valid ng-valid-required ng-touched" type="text" minlength="1" ng-maxlength="255" required="" style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABHklEQVQ4EaVTO26DQBD1ohQWaS2lg9JybZ+AK7hNwx2oIoVf4UPQ0Lj1FdKktevIpel8AKNUkDcWMxpgSaIEaTVv3sx7uztiTdu2s/98DywOw3Dued4Who/M2aIx5lZV1aEsy0+qiwHELyi+Ytl0PQ69SxAxkWIA4RMRTdNsKE59juMcuZd6xIAFeZ6fGCdJ8kY4y7KAuTRNGd7jyEBXsdOPE3a0QGPsniOnnYMO67LgSQN9T41F2QGrQRRFCwyzoIF2qyBuKKbcOgPXdVeY9rMWgNsjf9ccYesJhk3f5dYT1HX9gR0LLQR30TnjkUEcx2uIuS4RnI+aj6sJR0AM8AaumPaM/rRehyWhXqbFAA9kh3/8/NvHxAYGAsZ/il8IalkCLBfNVAAAAABJRU5ErkJggg==&quot;); background-repeat: no-repeat; background-attachment: scroll; background-size: 16px 18px; background-position: 98% 50%;">
                      <span v-if="errors.first('nomeDocumento')" class="label label-danger"> {{ errors.first('nomeDocumento') }}</span>
                    </div>
                  </div>
                  <div class="form-group required" :class="{ 'has-error' : errors.first('dataInicial')}">
                    <label for="dataInicial" class="control-label col-md-2">Data inicial:</label>
                    <div class="col-md-2">
                      <div class="input-group">
                        <datepicker  v-model="documento.dt_data_inclusao" name="dataInicial" input-class="form-control datepicker"
                                     :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                     format="dd/MM/yyyy" v-validate="'required'">
                        </datepicker>
                      </div>
                      <span v-if="errors.first('dataInicial')" class="label label-danger"> {{ errors.first('dataInicial') }}</span>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="dataFinal" class="control-label col-md-2">Data final:</label>
                    <div class="col-md-2">
                      <div class="input-group">
                        <datepicker  name="dataFinal" v-model="documento.dt_data_vigencia" input-class="form-control datepicker"
                                     :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                     format="dd/MM/yyyy" v-validate="'required'">
                        </datepicker>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
               <div class="box-footer">
                 <g-button-moema color="success" size="button--size-ss" @click.native="salva"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar</g-button-moema>
                 <g-button-moema color="warning" size="button--size-ss" @click.native="$router.go(-1)"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</g-button-moema>
               </div>
            </div>
            </div>
            </div>
          </div>
        </section>
      </div>
      </div>


</template>

<script>
    export default {
      name: 'editar-documento',
      data () {
        return {
          documento: {}
        }
      },
      created () {
        if (this.$route.params.id) {
          axiosLaravel.get('documentos/tipo-documento/' + this.$route.params.id).then((response) => {
            this.documento = response.data
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        }
      },
      methods: {
        salva () {
          this.$validator.validateAll().then((result) => {
            if (result) {
              if (this.documento.id) {
                this.atualiza()
              } else {
                this.grava()
              }
            } else {
              this.errors.items.forEach((item) => {
                this.$snotify.clear()
                this.$snotify.error(item.msg, '', this.$root._data.error)
              })
            }
          })
        },
        atualiza () {
          // Chama backend para atualizar
          axiosLaravel.put('documentos/tipo-documento/' + this.documento.id, this.documento).then((response) => {
            this.$snotify.clear()
            this.$snotify.success('Documento salvo com sucesso', '', this.$root._data.sucesso)
            this.$router.go(-1)
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        },
        grava () {
          // Chama backend para atualizar
          axiosLaravel.post('documentos/tipo-documento/', this.documento).then((response) => {
            this.$snotify.clear()
            this.$snotify.success('Documento salvo com sucesso', '', this.$root._data.sucesso)
            this.$router.go(-1)
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        }
      }
    }
</script>

<style scoped>

</style>
