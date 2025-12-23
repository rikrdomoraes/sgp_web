<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="'SGP - ' + (_.isNull(fep.id) ? 'FEP' : 'FEP nº ' + fep.id)"/>

    <div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
      <!--Breadcrumb-->
      <section class="content-header ng-scope">
        <h1>FEP</h1>
        <b-breadcrumb :items="[{
          text: 'Inicial',
          href: '/'
          }, {
          text: 'Cadastro',
          href: '#'
          }, {
          text: 'Edital',
          active: true
          }]"/>
      </section>

      <!-- main content -->
      <section class="content ng-scope">

        <div class="row">
          <div class="col-md-12">
            <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
              <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Cadastro de FEP</h3>
              </div>
              <div class="box-body" >
                <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                  <i class="fa fa-refresh fa-spin"></i>
                </div>
                <form name="frmRegNotice" class="form-horizontal ng-pristine ng-valid-mask ng-valid-maxlength ng-valid-minlength ng-valid-max ng-valid-date ng-valid ng-valid-required" novalidate="" _lpchecked="1" style="">
                  <div class="form-group required" :class="{ 'has-error' : errors.first('projeto')}">
                    <label for="initialDate" class="control-label col-md-2">Propostas: </label>
                    <div class="col-md-10">
                      <div class="input-group">
                        <div class="col-md-12">
                          <multiselect v-model="fep.proposta" :options="projetos"
                                       :multiple="false"
                                       :close-on-select="false"
                                       :clear-on-select="true"
                                       :hide-selected="false"
                                       :preserve-search="true"
                                       placeholder="Selecione uma Proposta"
                                       label="ds_nome"
                                       @select="moveObjeto($event)"
                                       @remove="removeObjeto()"
                                       track-by="id"
                                       selectedLabel="Selecionado"
                                       selectLabel="Aperte ENTER para selecionar"
                                       deselectLabel="Aperte ENTER para remover"
                                       name="proposta"
                                       data-vv-as="Propostas"
                                       :options-limit="1500">
                          </multiselect>
                          <!--<select v-model="projetoSelecionado" @change="moveObjeto" name="projeto" class="form-control ng-pristine ng-untouched ng-valid ng-empty">-->
                            <!--<option :value="projeto" v-for="projeto in projetos" :selected="projetoSelecionado">{{projeto.ds_nome}}</option>-->
                          <!--</select>-->
                        </div>
                      </div>
                      <span v-if="errors.first('projeto')" class="label label-danger"> {{ errors.first('projeto') }}</span>
                    </div>
                  </div>
                  <div class="form-group required" :class="{ 'has-error' : errors.first('numeroEdital')}">
                    <label for="numeroFep" class="control-label col-md-2">Número da FEP:</label>
                    <div class="col-md-8">
                      <div class="col-md-3">
                        <input v-validate="{required: true}" v-model="fep.id" name="numeroFep" :disabled="true" class="form-control ng-pristine ng-valid-maxlength ng-valid-minlength ng-not-empty ng-valid ng-valid-required ng-touched" type="text" minlength="1" ng-maxlength="255" required="">
                      </div>
                      <div class="col-md-4">
                        <button type="button" @click="grava" :disabled="fep.id > 0 || selecionado === false" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Gerar Número</button>
                      </div>
                      <span v-if="errors.first('numeroEdital')" class="label label-danger"> {{ errors.first('numeroFep') }}</span>
                    </div>
                  </div>
                </form>
              </div>
              <div class="box-footer">
                <!--<button @click="salva" type="submit" class="btn btn-success btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Salvar</button>-->
                <!--<button @click="$router.go(-1)" type="button" class="btn btn-default btn-flat"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</button>-->
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
  export default {
    name: 'EditaFep',
    data () {
      return {
        fep: {
          id: null,
          fk_proposta: null,
          proposta: []
        },
        selecionado: false,
        loading: {
          show: false
        },
        projetos: [],
        projetoSelecionado: {}
      }
    },
    created () {
      if (this.$route.params.id) {
        this.loading.show = true
        console.log('this.$route.params.id', this.$route.params.id)
        axiosLaravel.get('fep/' + this.$route.params.id).then((response) => {
          this.fep = response.data
          if (this.fep.proposta) {
            this.projetoSelecionado.id = this.fep.proposta.id
            this.projetoSelecionado.ds_nome = this.fep.proposta.ds_nome
          }
          console.log('this.fep', this.fep)
          this.loading.show = false
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.show = false
          })
      }
    },
    mounted () {
      this.loading.show = true
      this.$snotify.async('Listando propostas. Por favor, aguarde...', {timeout: 1000})
      axiosLaravel.get('propostas').then((response) => {
        this.projetos = _.sortBy(response.data, 'ds_nome')
        this.$snotify.clear()
        this.loading.show = false
        this.$forceUpdate()
      })
        .catch((error) => {
          this.$root.trataErro(error)
        })
    },
    methods: {
      moveObjeto (evento) {
        console.log('caiu aqui')
        console.log(evento)
        this.selecionado = true
        this.fep.fk_proposta = evento.id
      },
      removeObjeto () {
        this.projetoSelecionado = {}
        this.fep.fk_proposta = null
      },
      salva () {
        this.$validator.validateAll().then((result) => {
          if (result) {
            if (this.fep.id) {
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
        axiosLaravel.put('fep/' + this.fep.id, this.fep).then((response) => {
          this.$snotify.success('Fep alterada com sucesso!')
          this.$router.go(-1)
        })
          .catch((error) => {
            console.log('error>>>>', error.message)
            if (error.message === 'Request failed with status code 422') {
              this.$snotify.error('Proposta já vinculada a uma FEP!')
            } else {
              this.$root.trataErro(error)
            }
          })
      },
      grava () {
        // Chama backend para gravar
        axiosLaravel.post('fep', this.fep).then((response) => {
          console.log('response', response.data)
          this.$snotify.success('Número gerado sucesso!')
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
