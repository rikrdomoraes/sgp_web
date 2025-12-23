<template>
    <div class="content-wrapper" style="min-height: 870px;">

      <vue-headful :title="'SGP - ' + (_.isUndefined(edital.ds_numero_edital) ? 'Abrindo edital' : 'Edital de ' + edital.ds_numero_edital)"/>

      <div class="fade-transition" style=""><!-- content header (page header) -->
        <section class="content-header">
          <h1>Edital</h1>
          <b-breadcrumb :items="[{text: 'Inicial', href: '/'}, {text: 'Cadastro', href: '#'}, {text: 'Edital', active: true}]"/>
        </section>

        <section class="content">
          <div class="row">
            <div class="col-md-12">
              <div class="">
                <div class="box box-primary">
                  <div class="box-header with-border">
                    <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Editando Cadastro de Edital</h3>
                  </div>

                  <div class="box-body">
                    <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

                    <div class="form-horizontal">
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('numeroEdital')}">
                        <label class="control-label col-md-2">Edital:</label>
                        <div class="col-md-8">
                          <input v-validate="{required: true}" v-model="edital.ds_numero_edital" name="numeroEdital" class="form-control" type="text" minlength="1" maxlength="255">
                          <span v-if="errors.first('numeroEdital')" class="label label-danger"> {{ errors.first('numeroEdital') }}</span>
                        </div>
                      </div>

                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('parametroEdital')}">
                        <label class="control-label col-md-2">Parâmetro da url:</label>
                        <div class="col-md-8">
                          <input v-validate="{required: true}" v-model="edital.parametro" name="parametroEdital" class="form-control" type="text" required="">
                          <span v-if="errors.first('parametroEdital')" class="label label-danger"> {{ errors.first('parametroEdital') }}</span>
                        </div>
                      </div>

                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('acesso antecipado')}">
                        <label class="control-label col-md-2"
                               :title="'<h5>Se escolhido:<br/><span class=\'realce\'>Sim</span> Usuários da FBB poderão acessar a proposta a qualquer tempo<br/><span class=\'realce\'>Não</span> Usuários da FBB não poderão acessar a proposta antes do término do prazo ou edital inativado</h5>'"
                               v-tippy="{inertia:true, arrow:true, placement:'top', animation:'perspective', distance:'1', size:'large'}">
                          <i class="fa fa-exclamation-circle text-muted"></i> Acessar FBB:
                        </label>
                        <div class="col-md-8">
                          <label class="radio-inline new-control new-control-radio">
                            <input v-validate="'required'" type="radio" name="acesso antecipado" v-model="edital.opcoes.acesso.antecipado" :value="true"> Sim
                            <div class="new-control-indicator"></div>
                          </label>
                          <label class="radio-inline new-control new-control-radio">
                            <input type="radio" name="acesso antecipado" v-model="edital.opcoes.acesso.antecipado" :value="false" checked="checked"> Não
                            <div class="new-control-indicator"></div>
                          </label>
                          <span v-if="errors.first('acesso antecipado')" class="label label-danger"> Escolha uma opção acima</span>
                        </div>
                      </div>

                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('status')}">
                        <label class="control-label col-md-2">Inscrições abertas:</label>
                        <div class="col-md-10">
                          <label class="radio-inline new-control new-control-radio">
                            <input v-validate="{required: true}" type="radio" name="status" v-model="edital.bt_ativo" :value="1" checked="" value="1" v-on:change="validateDates"> Sim
                            <div class="new-control-indicator"></div>
                          </label>
                          <label class="radio-inline new-control new-control-radio">
                            <input type="radio" name="status" v-model="edital.bt_ativo" :value="0" value="0" v-on:change="validateDates"> Não
                            <div class="new-control-indicator"></div>
                          </label>
                        </div>
                      </div>

                      <!-- Informações de leitura de registro -->
                      <div class="form-group">
                        <label class="control-label col-md-2">Período de inscrições: </label>
                        <div class="required-field" :class="{ 'has-error' : errors.first('dataInicial')}">
                          <label class="control-label col-md-2">Data inicial: </label>
                          <div class="col-md-2">
                            <div class="input-group">
                              <DatePicker :config="{ awareOfUnicodeTokens: true }" :confirm="true" ref="dtInicial" name="dataInicial" data-vv-as="Data Inicial" v-model="edital.dt_data_inicial" type="datetime" format="DD/MM/YYYY HH:mm" value-type="format" placeholder="Selecionar data e hora" :lang="'pt-br'" v-validate="'required|validdatetime|date_format:dd/MM/yyyy HH:mm'" />
                            </div>
                            <span v-if="errors.first('dataInicial')" class="label label-danger"> {{ errors.first('dataInicial') }}</span>
                          </div>
                        </div>

                        <div class="required-field" :class="{ 'has-error' : errors.first('dataFinal')}">
                          <label class="control-label col-md-2">Data final:</label>
                          <div class="col-md-2">
                            <div class="input-group">
                              <DatePicker :config="{ awareOfUnicodeTokens: true }" :confirm="true" ref="dtFinal" name="dataFinal" data-vv-as="Data Final" v-model="edital.dt_data_final" type="datetime" format="DD/MM/YYYY HH:mm" value-type="format" placeholder="Selecionar data e hora" :lang="'pt-br'" v-if="edital.bt_ativo === 1" v-validate="'required|validdatetime|datetimeeqfuture|date_format:dd/MM/yyyy HH:mm|after:dtInicial'"/>
                              <DatePicker :config="{ awareOfUnicodeTokens: true }" :confirm="true" ref="dtFinal" name="dataFinal" data-vv-as="Data Final" v-model="edital.dt_data_final" type="datetime" format="DD/MM/YYYY HH:mm" value-type="format" placeholder="Selecionar data e hora" :lang="'pt-br'" v-else v-validate="'required|validdatetime|datetimeeqpast|date_format:dd/MM/yyyy HH:mm|after:dtInicial'"/>
                            </div>
                            <span v-if="errors.first('dataFinal')" class="label label-danger"> {{ errors.first('dataFinal') }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="control-label col-md-2">Edição Ativa para Entidade:</label>
                        <div class="col-md-8">
                          <select name="projeto"
                              v-model="edital.edicao"
                              class="form-control"
                              aria-hidden="true">
                            <option value="S">Ativo</option>
                            <option value="N">Desabilitado</option>
                        </select>
                        </div>
                      </div>
                      <span v-if="edital.id">
                        <div class="form-group">
                          <label class="control-label col-md-2">Data criação:</label>
                          <div class="col-md-2">
                            <input type="text" name="createdAt" :value="edital.dt_criado | moment('DD/MM/YYYY HH:MM')" class="form-control" disabled="">
                          </div>
                          <label class="control-label col-md-2">Data atualização:</label>
                          <div class="col-md-2">
                            <input type="text" name="updatedAt" :value="edital.dt_criado | moment('DD/MM/YYYY HH:MM')" class="form-control" disabled="">
                          </div>
                          <label v-show="edital.dt_data_inativacao" class="control-label col-md-2">Data inativação:</label>
                          <div class="col-md-2" v-show="edital.dt_data_inativacao">
                            <input type="text" name="inactivateDateTime" :value="edital.dt_data_inativacao | moment('DD/MM/YYYY HH:MM')" class="form-control" disabled="">
                          </div>
                        </div>

                        <div class="form-group">
                          <label class="control-label col-md-2" style="">Alterado por:</label>
                          <div class="col-md-4">
                            <input type="text" name="changedBy" :value="edital.ds_alterado_por" class="form-control" disabled="">
                          </div>
                        </div>
                      </span>

                      <div class="col-lg-12">&nbsp;</div><!-- pula linha -->

                      <div class="col-md-offset-2">
                        <g-button-ujarak color="primary" size="button--size-ss" @click.native="salva"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar</g-button-ujarak >
                        <g-button-ujarak color="warning" size="button--size-ss" @click.native="$router.go(-1)"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</g-button-ujarak>
                      </div>

                    </div>

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
    import moment from 'moment'

    export default {
      name: 'editar-edital',
      data () {
        return {
          edital: {
            bt_ativo: 1,
            dt_data_final: '',
            dt_data_inicial: '',
            opcoes: {
              acesso: {
                antecipado: false
              }
            }
          },
          loading: {
            tela: false
          }
        }
      },
      created () {
        if (this.$route.params.id) {
          this.loading.tela = true
          axiosLaravel.get('editais/' + this.$route.params.id).then((response) => {
            this.edital = response.data
            this.edital.dt_data_inicial = moment(this.edital.dt_data_inicial).format('DD/MM/YYYY HH:mm')
            this.edital.dt_data_final = moment(this.edital.dt_data_final).format('DD/MM/YYYY HH:mm')
            this.loading.tela = false
          })
            .catch((error) => {
              this.$root.trataErro(error)
              this.loading.tela = false
            })
        }
      },
      methods: {
        validateDates () {
          this.$validator.validate('dataInicial')
          this.$validator.validate('dataFinal')
        },
        salva () {
          this.$validator.validateAll().then((result) => {
            if (result) {
              if (this.edital.id) {
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
          this.loading.tela = true
          this.$snotify.async('Salvando o Edital. Por favor, aguarde...', {timeout: 0})
          axiosLaravel.put('editais/' + this.edital.id, this.edital).then((response) => {
            this.$snotify.clear()
            this.$snotify.success('Edital salvo com sucesso!')
            this.loading.tela = false
            this.$router.go(-1)
          })
            .catch((error) => {
              this.$snotify.clear()
              this.loading.tela = false
              this.$root.trataErro(error)
            })
        },
        grava () {
          // Chama backend para gravar
          this.loading.tela = true
          this.$snotify.async('Salvando o Edital. Por favor, aguarde...', {timeout: 0})
          axiosLaravel.post('editais', this.edital).then((response) => {
            this.$snotify.clear()
            this.$snotify.success('Edital salvo com sucesso!')
            this.loading.tela = false
            this.$router.go(-1)
          })
            .catch((error) => {
              this.$snotify.clear()
              this.loading.tela = false
              this.$root.trataErro(error)
            })
        }
      }
    }
</script>

<style>
.control-label-data{
  padding-top: 7px;
  margin-bottom: 0;
  text-align: left;
  margin-right: 0;
  }
</style>
