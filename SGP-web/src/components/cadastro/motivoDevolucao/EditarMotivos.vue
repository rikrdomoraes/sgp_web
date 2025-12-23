<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <!--<vue-headful :title="'SGP - ' + (_.isUndefined(edital.ds_numero_edital) ? 'Abrindo edital' : 'Edital de ' + edital.ds_numero_edital)"/>-->

    <div class="fade-transition" style=""><!-- content header (page header) -->
      <!--Breadcrumb-->
      <section class="content-header">
        <h1>Motivos de Devolução</h1>
        <b-breadcrumb :items="[{
          text: 'Inicial',
          href: '/'
          }, {
          text: 'Cadastro',
          href: '#'
          }, {
          text: 'Motivos de Devolução',
          active: true
          }]"/>
      </section>

      <!-- main content -->
      <section class="content">
        <div class="row">
          <div class="col-md-12">
            <div class=""><div class="box box-primary">
              <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Editando Motivos de Devolução<span v-if="motivos && motivos.codigo"> (Código: {{motivos.codigo}} )</span></h3>
              </div>
              <div class="box-body" >
                <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                  <i class="fa fa-refresh fa-spin"></i>
                </div>
                <form name="motivos" class="form-horizontal" novalidate="" _lpchecked="1" style="">
                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('codigo')}" v-if="motivos && !motivos.id">
                    <label for="codigo" class="control-label col-md-2">Código:</label>
                    <div class="col-md-4">
                      <input v-validate="{required: true}" v-model="motivos.codigo" name="codigo" class="form-control " type="text" minlength="1" ng-maxlength="255"
                             placeholder="Informe um identificador para o motivo, no padrão, como por exemplo SEM_DOCUMENTO"
                      >
                      <span v-if="errors.first('codigo')" class="label label-danger"> {{ errors.first('codigo') }}</span>
                    </div>
                  </div>

                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('descricao')}">
                    <label for="descricao" class="control-label col-md-2">Descrição:</label>
                    <div class="col-md-4">
                      <input v-validate="{required: true}" v-model="motivos.descricao" name="descricao" class="form-control " type="text" minlength="1" ng-maxlength="255"
                             placeholder="Informe uma descrição para o motivo, condizente como código acima informado" >
                      <span v-if="errors.first('descricao')" class="label label-danger"> {{ errors.first('descricao') }}</span>
                    </div>
                  </div>


                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('status')}">
                    <label for="bt_ativo" class="control-label col-md-2">Ativo:</label>
                    <div class="col-md-4">
                      <label class="radio-inline new-control new-control-radio">
                        <input v-validate="{required: true}" type="radio" name="status" v-model="motivos.bt_ativo" id="status" :value="1" checked="" class="" value="1"> Sim
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="radio-inline new-control new-control-radio">
                        <input type="radio" name="status" v-model="motivos.bt_ativo" id="status" :value="0" class="" value="0"> Não
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                  </div>
                </form>
              </div>
              <div class="box-footer">
                <g-button-moema color="primary" size="button--size-ss" @click.native="salva"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar</g-button-moema>
                <g-button-moema color="warning" size="button--size-ss" @click.native="$router.go(-1)"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar </g-button-moema>
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
  import moment from 'moment'
  export default {
    name: 'editar-motivos',
    data () {
      return {
        motivos: {},
        loading: {
          show: false
        }
      }
    },
    computed: {
    },
    mounted () {
      this.selectedValue
    },
    created () {
      if (this.$route.params.id) {
        this.loading.show = true
        axiosLaravel.get('motivos/' + this.$route.params.id).then((response) => {
          this.motivos = response.data
          this.motivos.data_inclusao = moment(this.motivos.data_inclusao).format('DD/MM/YYYY')
          this.motivos.data_atualizado = moment(this.motivos.data_atualizado).format('DD/MM/YYYY')
          this.loading.show = false
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.show = false
          })
      }
    },
    methods: {
      selectedValue: function () {
      },
      salva () {
        this.$validator.validateAll().then((result) => {
          if (result) {
            if (this.motivos.id) {
              this.atualiza()
            } else {
              this.grava()
            }
          } else {
            this.errors.items.forEach((item) => {
              this.$snotify.error(item.msg)
            })
          }
        })
      },
      atualiza () {
        // Chama backend para atualizar
        this.$snotify.async('Salvando o Motivo de Devolução. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.put('motivos/' + this.motivos.id, this.motivos).then((response) => {
          this.$snotify.clear()
          this.$snotify.success('Motivo de Devolução salvo com sucesso!')
          this.$router.go(-1)
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      grava () {
        // Chama backend para gravar
        this.$snotify.async('Salvando o Motivo de Devolução. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.post('motivos', this.motivos).then((response) => {
          this.$snotify.clear()
          this.$snotify.success('Motivo de Devolução salvo com sucesso!')
          this.$router.go(-1)
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      }
    }
  }
</script>

<style scoped>

</style>
