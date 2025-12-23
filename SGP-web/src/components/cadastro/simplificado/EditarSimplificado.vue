<template>
    <div class="content-wrapper" style="min-height: 870px;">
        <div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
          <!--Breadcrumb-->
        <section class="content-header ng-scope">
          <h1>Simplificado</h1>
          <b-breadcrumb :items="[{
          text: 'Inicial',
          href: '/'
          }, {
          text: 'Cadastro',
          href: '#'
          }, {
          text: 'Simplificado',
          active: true
          }]"/>
        </section>

        <!-- main content -->
        <section class="content ng-scope">

          <div class="row">
            <div class="col-md-12">
             <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
              <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Cadastro de Simplificado</h3>
              </div>
              <div class="box-body" >
                <form name="frmRegNotice" class="form-horizontal ng-pristine ng-valid-mask ng-valid-maxlength ng-valid-minlength ng-valid-max ng-valid-date ng-valid ng-valid-required" novalidate="" _lpchecked="1" style="">
                  <div class="form-group required" :class="{ 'has-error' : errors.first('numeroProcesso')}">
                    <label for="noticeNumber" class="control-label col-md-2">Número do Processo:</label>
                    <div class="col-md-4">
                      <input v-validate="{required: true}" v-model="processo.simplifiedNumber" name="numeroProcesso" class="form-control ng-pristine ng-valid-maxlength ng-valid-minlength ng-not-empty ng-valid ng-valid-required ng-touched" type="text" minlength="1" ng-maxlength="255" required="" style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABHklEQVQ4EaVTO26DQBD1ohQWaS2lg9JybZ+AK7hNwx2oIoVf4UPQ0Lj1FdKktevIpel8AKNUkDcWMxpgSaIEaTVv3sx7uztiTdu2s/98DywOw3Dued4Who/M2aIx5lZV1aEsy0+qiwHELyi+Ytl0PQ69SxAxkWIA4RMRTdNsKE59juMcuZd6xIAFeZ6fGCdJ8kY4y7KAuTRNGd7jyEBXsdOPE3a0QGPsniOnnYMO67LgSQN9T41F2QGrQRRFCwyzoIF2qyBuKKbcOgPXdVeY9rMWgNsjf9ccYesJhk3f5dYT1HX9gR0LLQR30TnjkUEcx2uIuS4RnI+aj6sJR0AM8AaumPaM/rRehyWhXqbFAA9kh3/8/NvHxAYGAsZ/il8IalkCLBfNVAAAAABJRU5ErkJggg==&quot;); background-repeat: no-repeat; background-attachment: scroll; background-size: 16px 18px; background-position: 98% 50%;">
                      <span v-if="errors.first('numeroProcesso')" class="label label-danger"> {{ errors.first('numeroProcesso') }}</span>
                    </div>
                  </div>
                  <div class="form-group required">
                    <label for="active" class="control-label col-md-2">Ativo:</label>
                    <div class="col-md-4">
                      <label class="radio-inline new-control new-control-radio">
                        <input v-validate="{required: true}" type="radio" name="status" v-model="processo.active" id="status" :value="true" checked="" class="ng-pristine ng-untouched ng-valid ng-not-empty" value="true"> Sim
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="radio-inline new-control new-control-radio">
                        <input type="radio" name="status" v-model="processo.active" id="status" :value="false" class="ng-pristine ng-untouched ng-valid ng-not-empty" value="false"> Não
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                  </div>
                  <div class="form-group required" :class="{ 'has-error' : errors.first('dataInicial')}">
                    <label for="initialDate" class="control-label col-md-2">Data inicial:</label>
                    <div class="col-md-2">
                      <div class="input-group">
                        <datepicker  v-model="processo.initialDate" name="dataInicial" input-class="form-control datepicker"
                                     :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                     format="dd/MM/yyyy" v-validate="'required'">
                        </datepicker>
                      </div>
                      <span v-if="errors.first('dataInicial')" class="label label-danger"> {{ errors.first('dataInicial') }}</span>
                    </div>
                  </div>
                  <div class="form-group required" :class="{ 'has-error' : errors.first('dataFinal')}">
                    <label for="endDate" class="control-label col-md-2">Data final:</label>
                    <div class="col-md-2">
                      <div class="input-group">
                        <datepicker  name="dataFinal" v-model="processo.endDate" input-class="form-control datepicker"
                                     :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                     format="dd/MM/yyyy" v-validate="'required'">
                        </datepicker>
                      </div>
                      <span v-if="errors.first('dataFinal')" class="label label-danger"> {{ errors.first('dataFinal') }}</span>
                    </div>
                  </div>
                  <div v-show="processo.id" class="form-group" style="">
                    <label for="createdAt" class="control-label col-md-2">Data criação:</label>
                    <div class="col-md-2">
                      <input type="text" name="createdAt" :value="processo.createdAt | moment('DD-MM-YYYY HH:MM')" class="form-control" disabled="">
                    </div>
                    <label for="updatedAt" class="control-label col-md-2">Data atualização:</label>
                    <div class="col-md-2">
                      <input type="text" name="updatedAt" :value="processo.updatedAt | moment('DD-MM-YYYY HH:MM')" class="form-control" disabled="">
                    </div>
                  </div>
                  <div class="form-group" v-if="processo.id">
                    <label for="inactivateDateTime" v-show="processo.id && processo.inactivateDateTime" class="control-label col-md-2" style="">Data inativação:</label>
                    <div class="col-md-2" v-show="processo.id && processo.inactivateDateTime" style="">
                      <input type="text" name="inactivateDateTime" :value="processo.inactivateDateTime | moment('DD-MM-YYYY HH:MM')" class="form-control" disabled="">
                    </div>
                    <label for="changedBy" class="control-label col-md-2 ng-scope" style="">Alterado por:</label>
                    <div class="col-md-2 ng-scope" style="">
                    <input type="text" name="changedBy" :value="processo.changedBy" class="form-control" disabled="">
                  </div>
                  </div>
                </form>
              </div>
               <div class="box-footer">
                 <button @click="salva" type="submit" class="btn btn-success btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Salvar</button>
                 <!-- ngIf: !$ctrl.isEditing -->
                 <button @click="$router.go(-1)" type="button" class="btn btn-default btn-flat"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</button>
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
      name: 'editar-simplificado',
      data () {
        return {
          processo: {}
        }
      },
      created () {
        if (this.$route.params.id) {
          axios.get('proxy/document/simplified/' + this.$route.params.id).then((response) => {
            console.log(response)
            this.processo = response.data.value
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
              if (this.processo.id) {
                this.atualiza()
              } else {
                this.grava()
              }
            } else {
              this.errors.items.forEach((item) => {
                this.$snotify.success(item.msg)
              })
            }
          })
        },
        atualiza () {
          // Chama backend para atualizar
          axios.put('proxy/document/simplified/' + this.processo.id, this.processo).then((response) => {
            this.$snotify.success('processo salvo com sucesso')
            this.$router.go(-1)
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        },
        grava () {
          // Chama backend para atualizar
          axios.post('proxy/document/simplified', this.processo).then((response) => {
            this.$snotify.success('Processo salvo com sucesso')
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
