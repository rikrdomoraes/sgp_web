<template>
  <div class="content-wrapper" style="min-height: 870px;">
    <!-- ngView: --><div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
    <section class="content-header ng-scope">
      <h1>Parceiros Estratégicos</h1>
      <b-breadcrumb :items="breadcrumb"/>
    </section>

    <!-- main content -->
    <section class="content ng-scope">

      <div class="row">
        <div class="col-md-12">
          <!-- grid -->
          <!-- ngIf: show.grid --><div ng-if="show.grid" class="ng-scope ng-isolate-scope"><div class="box box-primary">
          <div class="box-header with-border">
            <h3 class="box-title"><i class="fa fa-search" aria-hidden="true"></i> Cadastro de Parceiro Estratégico</h3>
          </div>
          <!-- /.box-header -->
          <fieldset :disabled="this.$route.params.opcao === 'visualizar'">
          <div class="box-body" id="dadosCadastrais" >
            <div class="row">
              <div class="col-md-12">
                <form name="frmCommonRegister" class="form-horizontal" novalidate>
                  <div class="col-md-7 col-lg-6" id="cadastroJuri">
                    <fieldset :disabled="!isEditable()">
                      <legend>Dados do parceiro estratégico:</legend>

                      <!-- Razão social -->
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('Razão social')}">
                        <label for="Razão social" class="control-label col-md-3">Razão social:</label>
                        <div class="col-md-8">
                          <input v-model="parceiro.ds_nome" name="Razão social" class="form-control" type="text" ref="Razão social" v-validate="'required|min:1|max:255'">
                          <span v-if="errors.first('Razão social')" class="label label-danger"> {{('O campo Razão Social é obrigatório') }}</span>
                        </div>
                      </div>

                      <!-- Cnpj -->
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('CNPJ')}">
                        <label for="CNPJ" class="control-label col-md-3" ref="CNPJ">CNPJ:</label>
                        <div class="col-md-6 col-lg-4">
                          <the-mask v-model="parceiro.ds_cnpj" name="CNPJ" class="form-control" type="text"
                                    v-validate="'required|min:14|max:14'" mask="##.###.###/####-##">
                          </the-mask>
                          <span v-if="errors.first('CNPJ')" class="label label-danger"> {{('O campo CNPJ é obrigatório') }}</span>
                        </div>
                      </div>


                      <!-- Vinculos -->
                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('vinculo')}">
                          <label for="vinculo" class="control-label col-md-3"> Vínculos: </label>
                          <div class="col-md-6 col-lg-8">
                          <multiselect v-model="parceiro.vinculos" :options="vinculos" name="vinculo"
                                       :multiple="true" :close-on-select="false"
                                       :clear-on-select="true" :hide-selected="false"
                                       :preserve-search="true"
                                       placeholder="Selecione os vínculos do Parceiro"
                                       track-by="id"
                                       :custom-label="customLabel"
                                       :preselect-first="true"
                                       selectLabel=""
                                       deselectLabel=""
                                       selectedLabel="Selecionado"
                                       v-validate="'required'">
                            <template slot-scope="props"><span class="multiselect__tag"><span>{{props.option.desc_vinculo}}</span><span class="custom__remove" @click="props.remove(props.option)">❌</span></span></template>
                            <span slot="noResult"><font color="red">Nenhum registro localizado!</font></span>
                          </multiselect>
                            <span v-if="errors.first('vinculo')" class="label label-danger"> {{ errors.first('vinculo') }}</span>
                          </div>
                        </div>
                    </fieldset>
                  </div>

                  <div class="col-md-5 col-lg-6" id="contato">
                    <fieldset >
                      <legend>Contato:</legend>

                      <!-- phone -->
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('Telefone')}">
                        <label for="Telefone" class="control-label col-md-3">Telefone:</label>
                        <div class="col-md-8 col-lg-4">
                          <the-mask v-model="parceiro.contato.ds_telefone"
                                    name="Telefone"
                                    data-vv-as="Telefone"
                                    ref="Telefone"
                                    class="form-control"
                                    type="text"
                                    v-validate="'required|min:10|max:11'"
                                    :mask="['(##) ####-####', '(##) #####-####']">
                          </the-mask>
                          <!--<input v-model="parceiro.contato.ds_telefone" v-mask="'(##) ####-#####'" :masked="masked" name="Telefone" class="form-control" type="text" v-validate="'required|min:1'" ref="Telefone">-->
                          <span v-if="errors.first('Telefone')" class="label label-danger"> {{ errors.first('Telefone') }}</span>
                        </div>
                      </div>

                      <!-- celular -->
                      <div class="form-group">
                        <label for="celular" class="control-label col-md-3">Celular:</label>
                        <div class="col-md-8 col-lg-4">
                          <the-mask v-model="parceiro.contato.ds_celular"
                                    name="mobile"
                                    data-vv-as="Celular"
                                    ref="mobile"
                                    class="form-control"
                                    type="text"
                                    v-validate="'min:10|max:11'"
                                    :mask="['(##) ####-####', '(##) #####-####']">
                          </the-mask>
                          <!--<input v-model="parceiro.contato.ds_celular" v-mask="'(##) #####-#####'" :masked="masked" name="celular" class="form-control" type="text">-->
                          <span v-if="errors.first('mobile')" class="label label-danger"> {{ errors.first('mobile') }}</span>
                        </div>
                      </div>

                      <!-- email -->
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('Email')}">
                        <label for="email" class="control-label col-md-3">E-Mail:</label>
                        <div class="col-lg-4">
                          <input v-model="parceiro.ds_email"
                                 name="Email"
                                 class="form-control"
                                 type="text"
                                 data-vv-as="E-Mail"
                                 delivery="account"
                                 method="uniqueUserEmail"
                                 v-validate="'required|email|min:1|max:255'"
                                 ref="Email">
                          <span v-if="errors.first('Email')" class="label label-danger"> {{ errors.first('Email') }}</span>
                        </div>
                      </div>

                      <!-- website -->
                      <div class="form-group">
                        <label for="website" class="control-label col-md-3">Site:</label>
                        <div class="col-md-8">
                          <input v-model="parceiro.ds_website" name="website" class="form-control" type="text" v-validate="'max:255'">
                        </div>
                      </div>

                    </fieldset>
                  </div>

                  <!-- Usuários -->
                  <div class="col-md-12">
                    <div class="box box-widget">
                      <div class="box-header">
                        <h3 class="box-title">Usuários do parceiro estratégico:</h3>
                      </div>
                    </div>
                    <usuarios :entUsuarios="parceiro.usuarios"></usuarios>
                  </div>

                </form>
              </div>
              <!-- /.col -->
            </div>
            <!-- /.row -->
          </div>
          </fieldset>
          <!-- /.box-body -->
          <div class="box-footer" v-if="this.$route.params.opcao !== 'visualizar'">
            <g-button-moema  color="success" size="button--size-ss" @click.native="salva(frmCommonRegister)"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</g-button-moema>
            <!--<g-button-moema  color="primary" size="button&#45;&#45;size-ss" @click.native="conclui(frmCommonRegister)"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar</g-button-moema>-->
            <g-button-moema  color="warning" size="button--size-ss" @click.native="$router.go(-1)"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</g-button-moema>
          </div>
          <div class="box-footer" v-if="this.$route.params.opcao === 'visualizar'">
            <!--<g-button-moema  color="primary" size="button&#45;&#45;size-ss" @click.native="conclui(frmCommonRegister)"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar</g-button-moema>-->
            <g-button-moema  color="warning" size="button--size-ss" @click.native="$router.go(-1)"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</g-button-moema>
          </div>
          <!-- /.box-footer -->
        </div>
        </div></div></div>

    </section>
  </div>
  </div>
</template>

<script>
    import Usuarios from '../../modules/usuarios'
    import { mapGetters } from 'vuex'

    export default {
      components: {
        Usuarios
      },
      name: 'EditaParcEstrategico',
      data () {
        return {
          campoErro: null,
          parceiro: {
            contato: {},
            usuarios: [],
            vinculos: []
          },
          vinculos: []
        }
      },
      computed: {
        ...mapGetters([
          'usuarioLogado'
        ])
      },
      created () {
        this.buscaVinculos()
        if (this.$route.params.id) {
          axiosLaravel.get('parceiros/' + this.$route.params.id).then((response) => {
            this.parceiro = response.data
            this.$route.params.parceiro = this.parceiro
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        }
      },
      methods: {
        isEditable () {
          return (this.$root.authorize('parceiro-estrategico-editar') || this.$root.authorize('meu-parceiro-estrategico-editar'))
        },
        customLabel (option) {
          return `${'Cod: ' + option.id + ' - ' + option.desc_vinculo}`
        },
        async buscaVinculos () {
          await axiosLaravel.get('parceiros/create').then((response) => {
            this.vinculos = response.data.vinculos
          })
            .catch((error) => {
              console.log(error.response)
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        },
        salva () {
          if (_.isEmpty(this.parceiro.usuarios) || !this.parceiro.usuarios) {
            this.$snotify.error('É obrigatório incluir ao menos um usuário para o Parceiro Estratégico!')
            return
          }
          this.$validator.validateAll().then((result) => {
            if (result) {
              if (this.parceiro.id) {
                this.atualiza()
              } else {
                this.grava()
              }
            } else {
              this.$snotify.error('O formulário de Cadastro de Parceiro Estratégico possui erros. Favor verificar!')
            }
          })
        },
        atualiza () {
          if (_.isEmpty(this.parceiro.usuarios) || !this.parceiro.usuarios) {
            this.$snotify.error('É obrigatório incluir ao menos um usuário para o Parceiro Estratégico!')
            return
          }
          this.$snotify.async('Atualizando Parceiro Estratégico. Por favor, aguarde...', {timeout: 0})
          axiosLaravel.put('parceiros/' + this.parceiro.id, this.parceiro).then((response) => {
            this.$snotify.clear()
            this.$snotify.success('Parceiro Estratégico salvo com sucesso!')
            setTimeout(() => { this.$router.go(-1) }, 2000)
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        },
        grava () {
          this.$snotify.async('Salvando Parceiro Estratégico. Por favor, aguarde...', {timeout: 0})
          axiosLaravel.post('parceiros/', this.parceiro).then((response) => {
            this.$snotify.clear()
            this.$snotify.success('Parceiro Estratégico salvo com sucesso!')
            setTimeout(() => { this.$router.go(-1) }, 2000)
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
