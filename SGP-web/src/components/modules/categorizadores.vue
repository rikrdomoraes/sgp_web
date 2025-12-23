<template>
  <div class="box box-widget">
    <div  style="background-color: #FCFCFC">
      <legend>&nbsp;Categorizadores</legend>
    </div>
    <div class="box-body">
      <div class="box-body">
        <div ng-form="frmCategorizers" class="row">
          <!--Sector 1-->
          <div class="col-md-3">
            <dl>
              <dd>
                <div class="form-group col-md-12 required-field" :class="{ 'has-error' : errors.first('vetor')}"
                     :title="'<h5>Definido pelo projeto duplicador ' + this.propsAnalise.numero_projeto + ' selecionado</h5>'" v-tippy="{inertia:true, arrow:true, placement:'top', animation:'perspective', distance:'1', size:'large'}">
                  <label class="control-label">Vetor</label>
                  <select name="vetor" v-model="propsAnalise.ds_categ_vetor" class="form-control" aria-hidden="true" :disabled="!_.isEmpty(_.trim(propsAnalise.duplicadorSapiens.usu_prjvet))"
                          v-validate="'required'">
                    <option v-for="categorizador in _.filter(categorizadores, ['grupo', 'VETOR'])" :value="categorizador.valor">{{categorizador.descricao}}</option>
                  </select>
                  <span v-if="errors.first('vetor')"
                        class="label label-danger"> {{ errors.first('vetor') }}</span>
                </div>
              </dd>

              <dd>
                <div class="form-group col-md-12 required-field" :class="{ 'has-error' : errors.first('ação')}"
                     :title="'<h5>Definido pelo projeto duplicador ' + this.propsAnalise.numero_projeto + ' selecionado</h5>'" v-tippy="{inertia:true, arrow:true, placement:'top', animation:'perspective', distance:'1', size:'large'}">
                  <label class="control-label">Ação</label>
                  <select name="vetor" v-model="propsAnalise.ds_categ_acao" class="form-control" aria-hidden="true" :disabled="!_.isEmpty(_.trim(propsAnalise.duplicadorSapiens.usu_acao))"
                          v-validate="'required'">
                    <option v-for="categorizador in _.filter(categorizadores, ['grupo', 'ACAO'])" :value="categorizador.valor">{{categorizador.descricao}}</option>
                  </select>
                  <span v-if="errors.first('ação')"
                        class="label label-danger"> {{ errors.first('ação') }}</span>
                </div>
              </dd>

              <dd>
                <div class="form-group col-md-12 required-field" :class="{ 'has-error' : errors.first('tecnologia')}"
                     :title="'<h5>Definido pelo projeto duplicador ' + this.propsAnalise.numero_projeto + ' selecionado</h5>'" v-tippy="{inertia:true, arrow:true, placement:'top', animation:'perspective', distance:'1', size:'large'}">
                  <label class="control-label">Tecnologia</label>
                  <select name="tecnologia" v-model="propsAnalise.ds_categ_tecnologia" class="form-control" aria-hidden="true" :disabled="!_.isEmpty(_.trim(propsAnalise.duplicadorSapiens.usu_tecno))"
                          v-validate="'required'">
                    <option v-for="categorizador in _.filter(categorizadores, ['grupo', 'TECNOLOGIA'])" :value="categorizador.valor">{{categorizador.descricao}}</option>
                  </select>
                  <span v-if="errors.first('tecnologia')"
                        class="label label-danger"> {{ errors.first('tecnologia') }}</span>
                </div>
              </dd>
            </dl>
          </div>

          <!--Sector 2-->
          <div class="col-md-3">
            <dl>
              <dd>
                <div class="form-group col-md-12 required-field" :class="{ 'has-error' : errors.first('campo de atuação')}"
                     :title="'<h5>Definido pelo projeto duplicador ' + this.propsAnalise.numero_projeto + ' selecionado</h5>'" v-tippy="{inertia:true, arrow:true, placement:'top', animation:'perspective', distance:'1', size:'large'}">
                  <label class="control-label">Campo de Atuação</label>
                  <select name="campo de atuação" v-model="propsAnalise.ds_categ_campo_atuacao" class="form-control" aria-hidden="true" :disabled="!_.isEmpty(_.trim(propsAnalise.duplicadorSapiens.usu_campatu))"
                          v-validate="'required'">
                    <option v-for="categorizador in _.filter(categorizadores, ['grupo', 'CAMPOS_DE_ATUACAO'])" :value="categorizador.valor">{{categorizador.descricao}}</option>
                  </select>
                  <span v-if="errors.first('campo de atuação')"
                        class="label label-danger"> {{ errors.first('campo de atuação') }}</span>
                </div>
              </dd>

              <dd>
                <div class="form-group col-md-12 required-field" :class="{ 'has-error' : errors.first('prospecção')}">
                  <label class="control-label">Prospecção</label>
                  <select name="prospecção" v-model="propsAnalise.ds_categ_prospeccao" class="form-control" aria-hidden="true" :disabled="false"
                          v-validate="'required'" @change="emitirAlteracao">
                    <option v-for="categorizador in _.filter(categorizadores, ['grupo', 'PROSPECCAO'])" :value="categorizador.valor">{{categorizador.descricao}}</option>
                  </select>
                  <span v-if="errors.first('prospecção')"
                        class="label label-danger"> {{ errors.first('prospecção') }}</span>
                </div>
              </dd>
              <!-- 70897 - Filtro Avaliacao de Projeto -->
              <dd>
                <div class="form-group col-md-12 required-field" :class="{ 'has-error' : errors.first('avaliação')}" v-if="!ehEdital && !ehSimplificada">
                  <label class="control-label">Avaliação</label>
                  <select name="prospecção" v-model="indicativoAvaliacao" class="form-control" aria-hidden="true" 
                          v-validate="'required'" @change="emitirAlteracao">
                    <option disabled value="">Preencha o questionário abaixo</option>
                    <option v-for="categorizador in _.filter(categorizadores, ['grupo', 'AVALIACAO'])" :value="categorizador.valor">{{categorizador.descricao}}</option>
                  </select>
                  <span v-if="errors.first('avaliação')"
                        class="label label-danger"> {{ errors.first('avaliação') }}</span>
                </div>
              </dd>

            </dl>
          </div>

          <!--Sector 3-->
          <div class="col-md-3">
            <dl>
              <dd>
                <div class="form-group col-md-12 required-field" :class="{ 'has-error' : errors.first('programa')}">
                  <label class="control-label">Programa</label>
                  <select name="programa" v-model="propsAnalise.ds_categ_programa" class="form-control" aria-hidden="true" :disabled="false"
                          v-validate="'required'">
                    <option v-for="categorizador in _.filter(categorizadores, ['grupo', 'PROGRAMA'])" :value="categorizador.valor">{{categorizador.descricao}}</option>
                  </select>
                  <span v-if="errors.first('programa')"
                        class="label label-danger"> {{ errors.first('programa') }}</span>
                </div>
              </dd>

              <dd>
                <div class="form-group col-md-12 required-field" :class="{ 'has-error' : errors.first('instrumento')}">
                  <label class="control-label">Instrumento</label>
                  <select name="instrumento" v-model="propsAnalise.ds_categ_instrumento" class="form-control" aria-hidden="true" :disabled="false"
                          v-validate="'required'">
                    <option v-for="categorizador in _.filter(categorizadores, ['grupo', 'INSTRUMENTO'])" :value="categorizador.valor">{{categorizador.descricao}}</option>
                  </select>
                  <span v-if="errors.first('instrumento')"
                        class="label label-danger"> {{ errors.first('instrumento') }}</span>
                </div>
              </dd>
            </dl>
          </div>
          <!---->
          <!--Sector 4-->
          <div class="col-md-3">
            <dl>
              <dd>
                <div class="form-group col-md-12 required-field" :class="{ 'has-error' : errors.first('atividades')}">
                  <label class="control-label">Cadeias Produtivas/Atividades</label>
                  <select name="atividades" v-model="propsAnalise.ds_categ_atividade" class="form-control" aria-hidden="true" :disabled="false"
                          v-validate="'required'">
                    <option v-for="categorizador in _.filter(categorizadores, ['grupo', 'CADEIAS_PRODUTIVAS'])" :value="categorizador.valor">{{categorizador.descricao}}</option>
                  </select>
                  <span v-if="errors.first('atividades')"
                        class="label label-danger"> {{ errors.first('atividades') }}</span>
                </div>
              </dd>

              <dd>
                <div class="form-group col-md-12 required-field" :class="{ 'has-error' : errors.first('edital')}">
                  <label class="control-label">Edital</label>
                  <select name="edital" v-model="propsAnalise.ds_categ_edital" class="form-control" aria-hidden="true" :disabled="false"
                          v-validate="'required'">
                    <option v-for="categorizador in _.filter(categorizadores, ['grupo', 'EDITAL'])" :value="categorizador.valor">{{categorizador.descricao}}</option>
                  </select>
                  <span v-if="errors.first('edital')" class="label label-danger"> {{ errors.first('edital') }}</span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'categorizadores',
    data () {
      return {
        categorizadores: [],
        preAnalise: {},
        ehEdital: true,
        localIndicativoAvaliacao: this.indicativoAvaliacao
      }
    },
    props: ['propsAnalise', 'indicativoAvaliacao', 'ehSimplificada'],
    watch: {
      propsAnalise: {
        handler () {
          if (this.propsAnalise.ds_categ_campo_atuacao) {
            this.propsAnalise.ds_fep_campo_atuacao = this.propsAnalise.ds_categ_campo_atuacao
          }
          if (this.propsAnalise.ds_categ_programa) {
            this.propsAnalise.ds_fep_programa = this.propsAnalise.ds_categ_programa
          }
          if (_.has(this.propsAnalise, 'duplicadorSapiens')) {
            this.carregarCategorizadores()
          } else if (this.propsAnalise.nr_projeto_duplicacao) {
            axiosLaravel.get('projeto/sapiens/' + this.propsAnalise.nr_projeto_duplicacao).then((response) => {
              this.propsAnalise.duplicadorSapiens = response.data[0]
              this.carregarCategorizadores()
            })
              .catch((error) => {
                this.$snotify.clear()
                this.$root.trataErro(error)
              })
          }
        }
      },
      indicativoAvaliacao (newVal) {
        this.localIndicativoAvaliacao = newVal
      }
    },
    created () {
      // Suporte 60721 - Não lista categorizadores quando está na etapa de formalização
      if (this.propsAnalise.ds_fase !== 'ANALISE') {
        this.carregarCategorizadores()
      }
      this.carregarCategorizadores()
    },
    methods: {
      async carregarCategorizadores () {
        axiosLaravel.get('categorizadores/').then((response) => {
          this.categorizadores = response.data
          this.propsAnalise.ds_categ_campo_atuacao = _.has(this.propsAnalise.duplicadorSapiens, 'usu_campatu') && this.propsAnalise.duplicadorSapiens && this.propsAnalise.duplicadorSapiens.usu_campatu ? this.propsAnalise.duplicadorSapiens.usu_campatu : null
          // this.propsAnalise.ds_categ_prospeccao = _.has(this.propsAnalise.duplicadorSapiens, 'usu_prosp') ? this.propsAnalise.duplicadorSapiens.usu_prosp : null
          this.propsAnalise.ds_categ_tecnologia = _.has(this.propsAnalise.duplicadorSapiens, 'usu_tecno') && this.propsAnalise.duplicadorSapiens && this.propsAnalise.duplicadorSapiens.usu_tecno ? this.propsAnalise.duplicadorSapiens.usu_tecno : null
          this.propsAnalise.ds_categ_vetor = _.has(this.propsAnalise.duplicadorSapiens, 'usu_prjvet') && this.propsAnalise.duplicadorSapiens && this.propsAnalise.duplicadorSapiens.usu_prjvet ? this.propsAnalise.duplicadorSapiens.usu_prjvet : null
          this.propsAnalise.ds_categ_acao = _.has(this.propsAnalise.duplicadorSapiens, 'usu_acao') && this.propsAnalise.duplicadorSapiens && this.propsAnalise.duplicadorSapiens.usu_acao ? this.propsAnalise.duplicadorSapiens.usu_acao : null
          this.propsAnalise.numero_projeto = _.has(this.propsAnalise.duplicadorSapiens, 'numprj') && this.propsAnalise.duplicadorSapiens && this.propsAnalise.duplicadorSapiens.numprj ? this.propsAnalise.duplicadorSapiens.numprj : null
          if (this.propsAnalise.ds_categ_prospeccao === '1') {
            this.ehEdital = false
          }
          console.log('props ', this.propsAnalise.ds_categ_prospeccao)
          // 70897 - Filtro Avaliacao de Projeto
          // this.propsAnalise.ds_categ_avaliacao = _.has(this.propsAnalise.duplicadorSapiens, 'usu_avalia') ? this.propsAnalise.duplicadorSapiens.usu_avalia : null
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      emitirAlteracao (event) {
        const valor = event.target.value
        if (valor === '1') {
          this.ehEdital = false
          this.$emit('alteraIndicativoAvaliacao', '1')
          console.log('valor escolhido', this.ehEdital)
        } else {
          this.ehEdital = true
          this.$emit('alteraIndicativoAvaliacao', valor)
        }
        console.log('valor ', this.indicativoAvaliacao)
      }
    }
  }
</script>

<style scoped>

</style>
