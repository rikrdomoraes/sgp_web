<template>
  <div class="box box-widget">
    <div class="box-header with-border" style="background-color: #FCFCFC">
      <h3 class="box-title">FEP</h3>
    </div>
    <br>
    <router-link v-if="propsAnalise.fep" :to="{name: 'relatorio-fep', params: { id: propsAnalise.id}, props: {propsRel: propsAnalise}}" target="_blank" class="btn btn-primary btn-sm btn-flat" style="text-decoration: none"><i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp FEP</router-link>
    <div class="box-body" v-if="propsAnalise.fep">
      <div class="form-group required-field col-md-2" :class="{ 'has-error' : errors.first('numeroFEP')}">
      <label class="control-label">Número da FEP:</label>
      {{propsAnalise.fep.ano}}/{{propsAnalise.fep.numero}}
      </div>
    </div>
      <div class="box-body">
        <div class="row">
          <!--Sector 1-->
          <div class="col-md-3">
            <dl>
              <dd>
                <div class="form-group required-field col-md-12"
                     :class="{ 'has-error' : errors.first('título do projeto')}">
                  <label class="control-label">Título do Projeto</label>
                  <input v-model="propsAnalise.ds_nome" name="título do projeto" class="form-control" type="text" maxlength="255" placeholder="Título do Projeto" readonly
                         v-validate="'required|max:255'">
                  <span v-if="errors.first('título do projeto')"
                        class="label label-danger"> {{ errors.first('título do projeto') }}</span>
                </div>
              </dd>

              <dd>
                <div class="form-group required-field col-md-12"
                     :class="{ 'has-error' : errors.first('participantes diretos')}">
                  <label class="control-label">Participantes Diretos</label>
                  <input v-model="participantesDiretos" name="participantes diretos" class="form-control" type="text" maxlength="255" placeholder="Participantes Diretos" readonly
                         v-validate="'required|max:255'">
                  <span v-if="errors.first('participantes diretos')"
                        class="label label-danger"> {{ errors.first('participantes diretos') }}</span>
                </div>
              </dd>

            </dl>
          </div>

          <!--Sector 2-->
          <div class="col-md-3">
            <dl>
              <dd>
                <div class="form-group required-field col-md-12">
                  <label class="control-label">Objetivo Geral</label>
                  <input v-model="propsAnalise.ds_objetivo_geral" name="objetivo geral" class="form-control" type="text" placeholder="Objetivo Geral" readonly>
                </div>
              </dd>

              <!--<dd>-->
                <!--<div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('campo de atuação')}">-->
                  <!--<label class="control-label">Campo de Atuação</label>-->
                  <!--<select name="campo de atuação" v-model="propsPreAnalise.ds_fep_campo_atuacao" class="form-control" aria-hidden="true"-->
                          <!--v-validate="'required'">-->
                    <!--<option v-for="opt in fep.activityFields" :value="opt.id">{{opt.value}}</option>-->
                  <!--</select>-->
                  <!--<span v-if="errors.first('campo de atuação')"-->
                        <!--class="label label-danger"> {{ errors.first('campo de atuação') }}</span>-->
                <!--</div>-->
              <!--</dd>-->

              <dd>
                <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('orçamento')}">
                  <label class="control-label">Orçamento</label>
                  <money v-model="totalFBB" name="orçamento" class="form-control" type="text" maxlength="255" readonly
                         v-validate="'required|max:255'"></money>
                  <span v-if="errors.first('orçamento')"
                        class="label label-danger"> {{ errors.first('orçamento') }}</span>
                </div>
              </dd>
            </dl>
          </div>
<!---->
          <!--Sector 3-->
          <div class="col-md-3">
            <dl>
              <dd>
                <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('proponente')}">
                  <label class="control-label">Proponente</label>
                  <input v-if="propsAnalise.entidade" v-model="propsAnalise.entidade.ds_nome" name="proponente" class="form-control" type="text" maxlength="255" placeholder="Proponente" readonly
                         v-validate="'required|max:255'">
                  <span v-if="errors.first('proponente')"
                        class="label label-danger"> {{ errors.first('proponente') }}</span>
                </div>
              </dd>

              <dd>
                <div class="form-group required-field col-md-12"
                     :class="{ 'has-error' : errors.first('tipo de ação')}">
                  <label class="control-label">Tipo de Ação</label>
                  <select name="tipo de ação"
                          v-model="propsAnalise.ds_fep_tipo_acao"
                          class="form-control"
                          aria-hidden="true"
                          v-validate="'required'">
                    <option v-for="i in fep.actionTypes" :value="i.code">{{i.description}}</option>
                  </select>
                  <span v-if="errors.first('tipo de ação')"
                        class="label label-danger"> {{ errors.first('tipo de ação') }}</span>
                </div>
              </dd>
<!---->
              <!--<dd>-->
                <!--<div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('programa')}">-->
                  <!--<label class="control-label">Programa</label>-->
                  <!--<select name="programa" v-model="propsPreAnalise.ds_fep_programa" class="form-control" aria-hidden="true"-->
                          <!--v-validate="'required'">-->
                    <!--<option v-for="opt in fep.programs" :value="opt.id">{{opt.value}}</option>-->
                  <!--</select>-->
                  <!--<span v-if="errors.first('programa')"-->
                        <!--class="label label-danger"> {{ errors.first('programa') }}</span>-->
                <!--</div>-->
              <!--</dd>-->
            </dl>
          </div>
<!---->
          <!--Sector 4-->
          <div class="col-md-3">
            <dl>
              <dd>
                <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('cnpj')}">
                  <label class="control-label">CNPJ</label>
                  <the-mask  v-if="propsAnalise.entidade" v-model="propsAnalise.entidade.ds_cnpj" name="cnpj" class="form-control" :mask="['##.###.###/####-##']" readonly
                            v-validate="'required'"></the-mask>
                  <span v-if="errors.first('cnpj')"
                        class="label label-danger"> {{ errors.first('cnpj') }}</span>
                </div>
              </dd>
<!---->
              <dd>
                <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('abrangencia')}">
                  <label class="control-label">Abrangência Nacional</label>
                  <div>
                    <select v-model="propsAnalise.bt_fep_abrangencia" class="form-control" name="abrangencia" v-validate="'required'">
                      <option value="0">Não</option>
                      <option value="1">Sim</option>
                    </select>
                    <!--<label class="new-control new-control-radio" style="padding-top: 8px;">-->
                      <!--<input type="radio" name="abrangencia"-->
                             <!--:value="1" v-model="propsAnalise.bt_fep_abrangencia" v-validate="'required'"/> Sim-->
                      <!--<div class="new-control-indicator"></div>-->
                    <!--</label>-->
                    <!--<label class="new-control new-control-radio" style="padding-top: 8px;">-->
                      <!--<input type="radio" name="abrangencia"-->
                             <!--:value="0" v-model="propsAnalise.bt_fep_abrangencia" v-validate="'required'"/> Não-->
                      <!--<div class="new-control-indicator"></div>-->
                    <!--</label>-->
                  </div>
                  <span v-if="errors.first('abrangencia')"
                        class="label label-danger"> {{ errors.first('abrangencia') }}</span>
                </div>
              </dd>
            </dl>
          </div>
          <div class="col-md-12">
            <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('parecer')}">
              <label class="control-label">Parecer</label>
              <textarea-autosize v-resizable @input="resizable" v-model="propsAnalise.ds_fep_parecer" style="height:150px;resize:none;" name="parecer" class="form-control"
                                 v-validate="'required'"></textarea-autosize>
              <span v-if="errors.first('parecer')" class="label label-danger"> {{ errors.first('parecer') }}</span>
            </div>
          </div>
          <div class="col-md-12">
            <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('observacao')}">
              <label class="control-label">Observações</label>
              <textarea-autosize v-resizable @input="resizable" v-model="propsAnalise.ds_fep_observacao" style="height:150px;resize:none;" name="observacao" class="form-control"
                                 v-validate="'required'"></textarea-autosize>
              <span v-if="errors.first('observacao')" class="label label-danger"> {{ errors.first('observacao') }}</span>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
    export default {
      name: 'fep',
      data () {
        return {
          totalFBB: 0,
          totalContrapartida: 0,
          totalParceiro: 0,
          fep: {
            actionTypes: [
              {'code': 'AT', 'description': 'Ação Tática'},
              {'code': 'AF', 'description': 'Ação Finalística'}
            ]
          },
          opcoes: ['Sim', 'Não'],
          preAnalise: {
            publicos_alvo: [],
            entidade: {}
          }
        }
      },
      mounted () {
        this.calculaTotais()
        let vm = this
        let bc = new BroadcastChannel('propostas')
        bc.onmessage = function (e) {
          let mensagem = e.data
          if ((mensagem.acao === 'notificacaoAtualizaFep') && (mensagem.fep.fk_proposta === vm.propsAnalise.id)) {
            vm.propsAnalise.fep = mensagem['fep']
            this.$forceUpdate()
          }
        }
      },
      inject: ['$validator'],
      provide () {
        return {
          $validator: this.$validator
        }
      },
      props: ['propsAnalise'],
      watch: {
        propsAnalise () {
          this.analise = this.propsAnalise
          this.calculaTotais()
        }
      },
      computed: {
        participantesDiretos () {
          let total = 0
          if (this.propsAnalise.publicos_alvo) {
            this.propsAnalise.publicos_alvo.forEach((item) => {
              total += parseInt(item.nr_participantes_diretos)
            })
            return total
          }
        }
      },
      methods: {
        calculaTotais () {
          this.totalFBB = 0
          this.propsAnalise.atividades.forEach((atividade) => {
            if (atividade.itens_orcamentos) {
              atividade.itens_orcamentos.forEach((item) => {
                if (item.origem === '1' || item.origem === 1) {
                  // console.log('ITEM FEP: ', item)
                  // console.log('valor unitario ', item.valor_unitario)
                  // console.log('quantidade ', item.quantidade)
                  this.totalFBB += (item.valor_unitario * item.quantidade)
                  // console.log('TOTAL PARCIAL: ', this.totalFBB)
                }
                if (item.origem === '2' || item.origem === 2) {
                  this.totalContrapartida += (item.valor_unitario * item.quantidade)
                }
                if (item.origem === '5' || item.origem === 5) {
                  this.totalParceiro += (item.valor_unitario * item.quantidade)
                }
              })
            }
          })
        }
      }
    }
</script>

<style scoped>

</style>
