<template>
  <div class="content-wrapper" style="min-height: 870px;">
    <div class="fade-transition ng-scope" style=""><!-- content header (page header) -->
      <section class="content-header ng-scope">
        <h1>Cadastro de um Relatório ERP</h1>
        <b-breadcrumb :items="[{
          text: 'Inicial',
          href: '/'
        }, {
          text: 'Relatório ERP',
          href: '#'
        }, {
          text: 'Edita',
          active: true
        }]"/>
      </section>

      <!-- main content -->
      <section class="content ng-scope">

        <div class="row">
          <div class="col-md-12">
            <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
              <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Cadastro de Relatório </h3>
              </div>
              <div class="box-body" >
                <div class="row">
                  <div class="col-md-12">
                    <form :submit.prevent="onSubmit" name="frmCadastroRel" class="form-horizontal ng-pristine ng-valid-maxlength ng-valid-minlength ng-valid-validate-unique ng-valid ng-valid-required" novalidate="" style="">
                      <div class="form-group required" :class="{ 'has-error' : errors.first('codigo')}">
                        <label for="nome" class="control-label col-md-2">Código do Relatório:  </label>
                        <div class="col-md-4">
                          <input v-validate="{required: true, max: 255}" v-model="relatorio.code" name="codigo" class="form-control ng-pristine ng-untouched ng-isolate-scope ng-valid-maxlength ng-valid-minlength ng-valid-validate-unique ng-not-empty ng-valid ng-valid-required" type="text">
                          <span v-if="errors.first('codigo')" class="label label-danger"> {{ errors.first('codigo') }}</span>
                        </div>
                      </div>
                      <div class="form-group required" :class="{ 'has-error' : errors.first('titulo')}">
                        <label for="nome" class="control-label col-md-2">Título do Relatório:</label>
                        <div class="col-md-4">
                          <input v-validate="{required: true, max: 255}" v-model="relatorio.title" name="titulo" class="form-control ng-pristine ng-untouched ng-isolate-scope ng-valid-maxlength ng-valid-minlength ng-valid-validate-unique ng-not-empty ng-valid ng-valid-required" type="text">
                          <span v-if="errors.first('titulo')" class="label label-danger"> {{ errors.first('titulo') }}</span>
                        </div>
                      </div>
                      <div class="form-group required" :class="{ 'has-error' : errors.first('campos')}">
                        <label for="nome" class="control-label col-md-2">Nome dos campos do Relatório:</label>
                        <div class="col-md-4">
                          <textarea v-validate="{required: true}" v-model="relatorio.fieldNames" style="height: 150px;" name="campos" class="form-control ng-pristine ng-untouched ng-not-empty ng-valid ng-valid-required" required=""></textarea>
                          <span v-if="errors.first('campos')" class="label label-danger"> {{ errors.first('campos') }}</span>
                        </div>
                      </div>
                      <div class="form-group required" :class="{ 'has-error' : errors.first('codCampos')}">
                        <label for="nome" class="control-label col-md-2">Código dos campos do Relatório:</label>
                        <div class="col-md-4">
                          <textarea v-validate="{required: true}" v-model="relatorio.codeNames" style="height: 150px;" name="codeNames" class="form-control ng-pristine ng-untouched ng-not-empty ng-valid ng-valid-required" required=""></textarea>
                          <span v-if="errors.first('codCampos')" class="label label-danger"> {{ errors.first('codCampos') }}</span>
                        </div>
                      </div>
                      <div class="form-group required" :class="{ 'has-error' : errors.first('ordem')}">
                        <label for="nome" class="control-label col-md-2">Ordem do Relatório:</label>
                        <div class="col-md-4">
                          <input v-validate="{required: true, max: 255}" v-model="relatorio.reportOrder" name="ordem" class="form-control ng-pristine ng-untouched ng-isolate-scope ng-valid-maxlength ng-valid-minlength ng-valid-validate-unique ng-not-empty ng-valid ng-valid-required" type="text">
                          <span v-if="errors.first('ordem')" class="label label-danger"> {{ errors.first('repoordemrtOrder') }}</span>
                        </div>
                      </div>
                      <div class="form-group">
                        <label for="nome" class="control-label col-md-2" :class="{ 'has-error' : errors.first('ativo')}">Ativo:</label>
                        <div class="col-md-4">
                          <label class="radio-inline new-control new-control-radio">
                            <input v-validate="'required'" type="radio" name="ativo" v-model="relatorio.active" :value="true" class="ng-pristine ng-untouched ng-valid ng-not-empty"> Sim
                            <div class="new-control-indicator"></div>
                          </label>
                          <label class="radio-inline new-control new-control-radio">
                            <input v-validate="'required'" type="radio" name="ativo" v-model="relatorio.active" :value="false" class="ng-pristine ng-untouched ng-valid ng-not-empty"> Não
                            <input v-validate="'required'" type="radio" name="ativo" v-model="relatorio.active" :value="false" class="ng-pristine ng-untouched ng-valid ng-not-empty"> Não
                            <div class="new-control-indicator"></div>
                          </label>
                          <span v-if="errors.first('active')" class="label label-danger"> {{ errors.first('ativo') }}</span>
                        </div>
                      </div>
                    </form>
                  </div>
                  <!-- /.col -->
                </div>
              </div>
              <div class="box-footer">
               <!-- <button @click.prevent="salva" type="button" class="btn btn-success btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Salvar</button>-->
                <!--<button @click.prevent="onClean" class="btn btn-default btn-flat"><i class="fa fa-eraser" aria-hidden="true"></i> Limpar</button>-->
                <!--<router-link :to="{name: 'cadastro-relatorio'}" type="button" class="btn btn-default btn-flat"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</router-link>-->

                <g-button-moema color="success" size="button--size-ss" @click.native="onSubmit"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar</g-button-moema>
                <g-button-moema color="primary" size="button--size-ss" @click.native="onClean"><i class="fa fa-eraser" aria-hidden="true"></i> Limpar</g-button-moema>
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
      name: 'EditaCadastroRel',
      data () {
        return {
          relatorio: {}
        }
      },
      created () {
        if (this.$route.params.id) {
          axios.get('proxy/utility/erp-report').then((response) => {
            // this.relatorio = response.data.value
            this.relatorio = this.$route.params.id
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        }
      },
      methods: {
        onSubmit () {
          if (this.relatorio.id) {
            // Chama backend para atualizar
            axios.post('proxy/utility/erp-report/', this.relatorio).then((response) => {
              this.$snotify.success('Relatório salvo com sucesso')
              // this.$toast.show('Relatório salvo com sucesso', '', this.$root._data.sucesso)
            })
              .catch((error) => {
                this.$root.trataErro(error)
              })
          } else {
            // Chama backend para atualizar
            axios.post('proxy/utility/erp-report/', this.relatorio).then((response) => {
              this.$snotify.success('Relatório gravado com sucesso')
              // this.$toast.show('Relatório salvo com sucesso', '', this.$root._data.sucesso)
            })
              .catch((error) => {
                this.$root.trataErro(error)
              })
          }
        },
        onClean () {
          this.relatorio.code = ''
          this.relatorio.active = ''
          this.relatorio.title = ''
          this.relatorio.fieldNames = ''
          this.relatorio.codeNames = ''
          this.relatorio.reportOrder = ''
        }
      }
    }
</script>

<style scoped>

</style>
