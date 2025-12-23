<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <!--<vue-headful :title="'SGP - ' + (_.isUndefined(edital.ds_numero_edital) ? 'Abrindo edital' : 'Edital de ' + edital.ds_numero_edital)"/>-->

    <div class="fade-transition" style=""><!-- content header (page header) -->
      <!--Breadcrumb-->
      <section class="content-header">
        <h1>Assunto</h1>
        <b-breadcrumb :items="[{
          text: 'Inicial',
          href: '/'
          }, {
          text: 'Cadastro',
          href: '#'
          }, {
          text: 'Assunto',
          active: true
          }]"/>
      </section>

      <!-- main content -->
      <section class="content">
        <div class="row">
          <div class="col-md-12">
            <div class=""><div class="box box-primary">
              <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Editando Cadastro de Assunto</h3>
              </div>
              <div class="box-body" >
                <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                  <i class="fa fa-refresh fa-spin"></i>
                </div>
                <form name="frmRegNotice" class="form-horizontal" novalidate="" _lpchecked="1" style="">
                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('numeroEdital')}">
                    <label for="assunto" class="control-label col-md-2">Assunto:</label>
                    <div class="col-md-4">
                      <input v-validate="{required: true}" v-model="assunto.assunto" name="assunto" class="form-control " type="text" minlength="1" ng-maxlength="255">
                      <span v-if="errors.first('numeroEdital')" class="label label-danger"> {{ errors.first('assunto') }}</span>
                    </div>
                  </div>


                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('area_responsavel')}">
                    <label for="area_responsavel" class="control-label col-md-2">Área Responsável:</label>
                    <div class="col-md-4">
                      <multiselect v-model="assunto.area_responsavel" :options="areas"
                                   :multiple="false"
                                   :close-on-select="true"
                                   :clear-on-select="false"
                                   :hide-selected="false"
                                   :preserve-search="true"
                                   placeholder="Selecione uma área"
                                   @select="changeArea($event)"
                                   :custom-label="etiquetaArea"
                                   :preselect-first="false"
                                   selectLabel=""
                                   label="nome"
                                   track-by="nome"
                                   deselectLabel=""
                                   selectedLabel="Selecionado"
                                   name="area_responsavel"
                                   data-vv-as="area_responsavel"
                                   :disabled="false"
                                   v-validate="'required'">
                        <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
                      </multiselect>
                      <span v-if="errors.first('parametroEdital')" class="label label-danger"> {{ errors.first('parametroEdital') }}</span>
                    </div>
                  </div>


                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('status')}">
                    <label for="bt_ativo" class="control-label col-md-2">Ativo:</label>
                    <div class="col-md-4">
                      <label class="radio-inline new-control new-control-radio">
                        <input v-validate="{required: true}" type="radio" name="status" v-model="assunto.bt_ativo" id="status" :value="1" checked="" class="" value="1"> Sim
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="radio-inline new-control new-control-radio">
                        <input type="radio" name="status" v-model="assunto.bt_ativo" id="status" :value="0" class="" value="0"> Não
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
    name: 'editar-assunto',
    data () {
      return {
        assunto: {},
        loading: {
          show: false
        },
        areas: [
          {id: 1, nome: 'Gerência de Pagamentos e Contratações', uor: 341862},
          {id: 2, nome: 'Gerência de Monitoramento', uor: 341860},
          {id: 3, nome: 'Gerência de Análise e Avaliação', uor: 341861}]
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
        axiosLaravel.get('assunto/' + this.$route.params.id).then((response) => {
          this.assunto = response.data
          this.assunto.area_responsavel = _.filter(this.areas, {'nome': this.assunto.area_responsavel})
          this.assunto.data_inclusao = moment(this.assunto.data_inclusao).format('DD/MM/YYYY')
          this.assunto.data_atualizado = moment(this.assunto.data_atualizado).format('DD/MM/YYYY')
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
            if (this.assunto.id) {
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
        this.$snotify.async('Salvando o Assunto. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.put('assunto/' + this.assunto.id, this.assunto).then((response) => {
          this.$snotify.clear()
          this.$snotify.success('Assunto salvo com sucesso!')
          this.$router.go(-1)
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      grava () {
        // Chama backend para gravar
        this.$snotify.async('Salvando o Assunto. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.post('assunto', this.assunto).then((response) => {
          this.$snotify.clear()
          this.$snotify.success('Assunto salvo com sucesso!')
          this.$router.go(-1)
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      etiquetaArea (option) {
        return `${option.nome}`
      },
      changeArea (area) {
        this.assunto.area_responsavel = area
      }
    }
  }
</script>

<style scoped>

</style>
