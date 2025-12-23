<template>
  <!--Questionario de riscos-->
  <fieldset v-if="propsAnalise.questionario_respostas">
    <div  style="background-color: #FCFCFC">
    <legend>&nbsp;Questionário de riscos</legend>
    </div>
    <div class="row">
      <div class="col-md-6">
        <!--Origem da Proposta-->
        <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('origem da Proposta')}">
          <label class="control-label">Origem da Proposta</label>
          <multiselect v-model="propsAnalise.questionario_respostas.origem_proposta" :options="origemProposta"
                       :multiple="false"
                       :close-on-select="true"
                       :clear-on-select="false"
                       :hide-selected="false"
                       :preserve-search="true"
                       placeholder="Selecione a resposta para o item"
                       @select="onSelectOrigem($event)"
                       :preselect-first="false"
                       :custom-label="etiquetaTipos"
                       selectLabel=""
                       label="ds_descricao" track-by="ds_descricao"
                       deselectLabel=""
                       selectedLabel="Selecionado"
                       name="origem da Proposta"
                       data-vv-as="origem da Proposta"
                       :disabled="false"
                       v-validate="'required'">
            <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
          </multiselect>
          <span v-if="errors.first('origem da Proposta')" class="label label-danger"> {{ errors.first('origem da Proposta') }}</span>
        </div>

        <!--Número de municípios atendidos-->
        <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('número de municípios atendidos')}">
          <label class="control-label">Número de municípios atendidos</label>
          <multiselect v-model="propsAnalise.questionario_respostas.municipios_atendidos" :options="municipiosAtendidos"
                       :multiple="false"
                       :close-on-select="true"
                       :clear-on-select="false"
                       :hide-selected="false"
                       :preserve-search="true"
                       placeholder="Selecione a resposta para o item"
                       label="ds_descricao" track-by="ds_descricao"
                       @select="onSelectMunicipios($event)"
                       :preselect-first="false"
                       :custom-label="etiquetaTipos"
                       selectLabel=""
                       deselectLabel=""
                       selectedLabel="Selecionado"
                       name="número de municípios atendidos"
                       data-vv-as="número de municípios atendidos"
                       :disabled="true"
                       v-validate="'required'">
            <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
          </multiselect>
          <span v-if="errors.first('número de municípios atendidos')" class="label label-danger"> {{ errors.first('número de municípios atendidos') }}</span>
        </div>

        <!--Prazo de execução do projeto-->
        <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('prazo de execução do projeto')}">
          <label class="control-label">Prazo de execução do projeto</label>
          <multiselect v-model="propsAnalise.questionario_respostas.prazo_execucao" :options="prazoExecucao"
                       :multiple="false"
                       :close-on-select="true"
                       :clear-on-select="false"
                       :hide-selected="false"
                       :preserve-search="true"
                       placeholder="Selecione a resposta para o item"
                       label="ds_descricao" track-by="ds_descricao"
                       @select="onSelectPrazos($event)"
                       :preselect-first="false"
                       :custom-label="etiquetaTipos"
                       selectLabel=""
                       deselectLabel=""
                       selectedLabel="Selecionado"
                       name="prazo de execução do projeto"
                       data-vv-as="prazo de execução do projeto"
                       :disabled="true"
                       v-validate="'required'">
            <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
          </multiselect>
          <span v-if="errors.first('prazo de execução do projeto')" class="label label-danger"> {{ errors.first('prazo de execução do projeto') }}</span>
        </div>

        <!--Natureza dos dispêndios-->
        <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('natureza dos dispêndios')}">
          <label class="control-label">Natureza dos dispêndios</label>
          <multiselect v-model="propsAnalise.questionario_respostas.natureza_dispendios" :options="natureza"
                       :multiple="false"
                       :close-on-select="true"
                       :clear-on-select="false"
                       :hide-selected="false"
                       :preserve-search="true"
                       placeholder="Selecione a resposta para o item"
                       label="ds_descricao" track-by="ds_descricao"
                       @select="onSelectNatureza($event)"
                       :preselect-first="false"
                       :custom-label="etiquetaTipos"
                       selectLabel=""
                       deselectLabel=""
                       selectedLabel="Selecionado"
                       name="natureza dos dispêndios"
                       data-vv-as="natureza dos dispêndios"
                       v-validate="'required'">
            <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
          </multiselect>
          <span v-if="errors.first('natureza dos dispêndios')" class="label label-danger"> {{ errors.first('natureza dos dispêndios') }}</span>
        </div>
      </div>
      <!--Região geográfica predominante dos municípios atendidos-->
      <div class="col-md-6">
        <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('região')}">
          <label class="control-label">Região geográfica predominante dos municípios atendidos</label>
          <multiselect v-model="propsAnalise.questionario_respostas.regiao_predominante" :options="regiaoGeografica"
                       :multiple="false"
                       :close-on-select="true"
                       :clear-on-select="false"
                       :hide-selected="false"
                       :preserve-search="true"
                       placeholder="Selecione a resposta para o item"
                       label="ds_descricao" track-by="ds_descricao"
                       @select="onSelectRegiao($event)"
                       :preselect-first="false"
                       :custom-label="etiquetaTipos"
                       selectLabel=""
                       deselectLabel=""
                       selectedLabel="Selecionado"
                       name="região"
                       data-vv-as="região"
                       :disabled="true"
                       v-validate="'required'">
            <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
          </multiselect>
          <span v-if="errors.first('região')" class="label label-danger"> {{ errors.first('região') }}</span>
        </div>

        <!--Investimento social RP+RT por número de participantes-->
        <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('investimento social por número de participantes')}">
          <label class="control-label">Investimento social RP+RT por número de participantes</label>
          <multiselect v-model="propsAnalise.questionario_respostas.investimento_social_participantes" :options="investimentoSocial"
                       :multiple="false"
                       :close-on-select="true"
                       :clear-on-select="false"
                       :hide-selected="false"
                       :preserve-search="true"
                       placeholder="Selecione a resposta para o item"
                       label="ds_descricao" track-by="ds_descricao"
                       @select="onSelectInvestimento($event)"
                       :preselect-first="false"
                       :custom-label="etiquetaTipos"
                       selectLabel=""
                       deselectLabel=""
                       selectedLabel="Selecionado"
                       name="investimento social por número de participantes"
                       data-vv-as="investimento social por número de participantes"
                       :disabled="false"
                       v-validate="'required'">
            <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
          </multiselect>
          <span v-if="errors.first('investimento social por número de participantes')" class="label label-danger"> {{ errors.first('investimento social por número de participantes') }}</span>
        </div>

        <!--Valor do investimento da FBB-->
        <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('valor do investimento da FBB')}">
          <label class="control-label">Valor do investimento da FBB (RP+RT)</label>
          <multiselect v-model="propsAnalise.questionario_respostas.valor_investimento" :options="valorInvestimento"
                       :multiple="false"
                       :close-on-select="true"
                       :clear-on-select="false"
                       :hide-selected="false"
                       :preserve-search="true"
                       placeholder="Selecione a resposta para o item"
                       label="ds_descricao" track-by="ds_descricao"
                       @select="onSelectValor($event)"
                       :preselect-first="false"
                       :custom-label="etiquetaTipos"
                       selectLabel=""
                       deselectLabel=""
                       selectedLabel="Selecionado"
                       name="valor do investimento da FBB"
                       data-vv-as="valor do investimento da FBB"
                       :disabled="true"
                       v-validate="'required'">
            <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
          </multiselect>
          <span v-if="errors.first('valor do investimento da FBB')" class="label label-danger"> {{ errors.first('valor do investimento da FBB') }}</span>
        </div>

        <!--Rating da entidade-->
        <div class="form-group col-md-12" v-if="propsAnalise.rating && propsAnalise.rating.classificacao && !ehSimplificada">
          <label class="control-label">Rating da entidade</label>
          <multiselect v-model="propsAnalise.questionario_respostas.rating" :options="rating"
                       :multiple="false"
                       :close-on-select="true"
                       :clear-on-select="false"
                       :hide-selected="false"
                       :preserve-search="true"
                       placeholder="Selecione a resposta para o item"
                       label="ds_descricao" track-by="ds_descricao"
                       @select="onSelectRating($event)"
                       :preselect-first="false"
                       :custom-label="etiquetaTipos"
                       selectLabel=""
                       deselectLabel=""
                       :disabled="true"
                       selectedLabel="Selecionado"
                       name="rating"
                       data-vv-as="rating"
                       v-validate="'required'">
            <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
          </multiselect>
        </div>
      </div>
    </div>

    <!--Reaplicação-->
    <div class="row">
      <div class="col-md-6">
        <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('reaplicacao')}">
          <label class="control-label">Realização de TS certificado e/ou metodologia padronizada</label>
          <multiselect v-model="propsAnalise.questionario_respostas.realizacao_ts" :options="reaplicacaoTS"
                       :multiple="false"
                       :close-on-select="true"
                       :clear-on-select="false"
                       :hide-selected="false"
                       :preserve-search="true"
                       placeholder="Selecione a resposta para o item"
                       label="ds_descricao" track-by="ds_descricao"
                       @select="onSelectReaplicacao($event)"
                       :preselect-first="false"
                       :custom-label="etiquetaTipos"
                       selectLabel=""
                       deselectLabel=""
                       selectedLabel="Selecionado"
                       name="reaplicacao"
                       data-vv-as="reaplicacao"
                       v-validate="'required'">
            <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
          </multiselect>
          <span v-if="errors.first('reaplicacao')" class="label label-danger"> {{ errors.first('reaplicacao') }}</span>
        </div>

        <!--Adiantamento de recursos-->
        <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('adiantamento de recursos')}">
          <label class="control-label">Adiantamento de recursos</label>
          <multiselect v-model="propsAnalise.questionario_respostas.adiantamento_recursos" :options="adiantamento"
                       :multiple="false"
                       :close-on-select="true"
                       :clear-on-select="false"
                       :hide-selected="false"
                       :preserve-search="true"
                       placeholder="Selecione a resposta para o item"
                       label="ds_descricao" track-by="ds_descricao"
                       @select="onSelectAdiantamento($event)"
                       :preselect-first="false"
                       :custom-label="etiquetaTipos"
                       selectLabel=""
                       deselectLabel=""
                       selectedLabel="Selecionado"
                       name="adiantamento de recursos"
                       data-vv-as="adiantamento de recursos"
                       :disabled="true"
                       v-validate="'required'">
            <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
          </multiselect>
          <span v-if="errors.first('adiantamento de recursos')" class="label label-danger"> {{ errors.first('adiantamento de recursos') }}</span>
        </div>
<!---->
      </div>

      <!--Utilização de recursos de terceiros-->
      <div class="col-md-6">
        <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('utilização de recursos de terceiros')}">
          <label class="control-label">Utilização de recursos de terceiros</label>
          <multiselect v-model="propsAnalise.questionario_respostas.recursos_terceiros" :options="recursosTerceiros"
                       :multiple="false"
                       :close-on-select="true"
                       :clear-on-select="false"
                       :hide-selected="false"
                       :preserve-search="true"
                       placeholder="Selecione a resposta para o item"
                       label="ds_descricao" track-by="ds_descricao"
                       @select="onSelectRT($event)"
                       :preselect-first="false"
                       :custom-label="etiquetaTipos"
                       selectLabel=""
                       deselectLabel=""
                       selectedLabel="Selecionado"
                       name="utilização de recursos de terceiros"
                       data-vv-as="utilização de recursos de terceiros"
                       :disabled="true"
                       v-validate="'required'">
            <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
          </multiselect>
          <span v-if="errors.first('utilização de recursos de terceiros')" class="label label-danger"> {{ errors.first('utilização de recursos de terceiros') }}</span>
        </div>

        <!--Observância de legislação ambiental -->
        <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('observância')}">
          <label class="control-label">Observância de legislação ambiental</label>
          <multiselect v-model="propsAnalise.questionario_respostas.legislacao_ambiental" :options="legislacaoAmbiental"
                       :multiple="false"
                       :close-on-select="true"
                       :clear-on-select="false"
                       :hide-selected="false"
                       :preserve-search="true"
                       placeholder="Selecione a resposta para o item"
                       label="ds_descricao" track-by="ds_descricao"
                       @select="onSelectLA($event)"
                       :preselect-first="false"
                       :custom-label="etiquetaTipos"
                       selectLabel=""
                       deselectLabel=""
                       selectedLabel="Selecionado"
                       name="observância"
                       data-vv-as="observância"
                       v-validate="'required'">
            <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
          </multiselect>
          <span v-if="errors.first('observância')" class="label label-danger"> {{ errors.first('observância') }}</span>
        </div>
<!---->
      </div>
    </div>

  <!-- Cálculo de Risco-->
    <div class="col-md-12" v-if="propsAnalise.ds_fase === 'ANALISE'">
      <div class="form-group">
        <g-button-moema color="primary" size="button--size-ss" v-if="_.has(propsAnalise.questionario_respostas, 'rating')" @click.native="recalcular"><i class="fa fa-refresh" aria-hidden="true"></i> Calcular Risco</g-button-moema>
        <span v-if="riscoCalculado" class="riscoCalculado">
          Risco Calculado: <span :class="'dado riscoNota risco' + riscoCalculado">{{riscoCalculado}}</span>
        </span>
        <span v-else-if="_.has(propsAnalise.questionario_respostas, 'rating')" class="riscoCalculado riscoE"> Risco não calculado ainda</span>
        <span v-else class="riscoCalculado riscoD"> Rating da Entidade não preenchido ainda</span>
      </div>
    </div>

  </fieldset>
</template>

<script>
    export default {
      name: 'questionario-riscos',
      data () {
        return {
          questoes: [],
          respostas: [],
          analise: {
            questionario_respostas: {}
          },
          Temp: {},
          totalInvestido: 0,
          riscoCalculado: '',
          questao: [],
          origemProposta: [],
          rating: [],
          investimentoSocial: [],
          municipiosAtendidos: [],
          regiaoGeografica: [],
          prazoExecucao: [],
          valorInvestimento: [],
          recursosTerceiros: [],
          adiantamento: [],
          natureza: [],
          reaplicacaoTS: [],
          legislacaoAmbiental: [],
          estados: [
            { 'Sigla': 'AC', 'Região': 'Norte' },
            {'Sigla': 'AL', 'Região': 'Nordeste'},
            { 'Sigla': 'AP', 'Região': 'Norte' },
            { 'Sigla': 'AM', 'Região': 'Norte' },
            { 'Sigla': 'BA', 'Região': 'Nordeste' },
            { 'Sigla': 'CE', 'Região': 'Nordeste' },
            { 'Sigla': 'DF', 'Região': 'Centro-Oeste' },
            { 'Sigla': 'ES', 'Região': 'Sudeste' },
            { 'Sigla': 'GO', 'Região': 'Centro-Oeste' },
            { 'Sigla': 'MA', 'Região': 'Nordeste' },
            { 'Sigla': 'MT', 'Região': 'Centro-Oeste' },
            { 'Sigla': 'MS', 'Região': 'Centro-Oeste' },
            { 'Sigla': 'MG', 'Região': 'Sudeste' },
            { 'Sigla': 'PA', 'Região': 'Norte' },
            { 'Sigla': 'PB', 'Região': 'Nordeste' },
            { 'Sigla': 'PR', 'Região': 'Sul' },
            { 'Sigla': 'PE', 'Região': 'Nordeste' },
            { 'Sigla': 'PI', 'Região': 'Nordeste' },
            { 'Sigla': 'RJ', 'Região': 'Sudeste' },
            { 'Sigla': 'RN', 'Região': 'Nordeste' },
            { 'Sigla': 'RS', 'Região': 'Sul' },
            { 'Sigla': 'RO', 'Região': 'Norte' },
            { 'Sigla': 'RR', 'Região': 'Norte' },
            { 'Sigla': 'SC', 'Região': 'Sul' },
            { 'Sigla': 'SP', 'Região': 'Sudeste' },
            { 'Sigla': 'SE', 'Região': 'Nordeste' },
            { 'Sigla': 'TO', 'Região': 'Norte' }
          ]
        }
      },
      inject: ['$validator'],
      provide () {
        return {
          $validator: this.$validator
        }
      },
      props: ['propsAnalise', 'ehSimplificada'],
      watch: {
        propsAnalise () {
          if (this.propsAnalise.id) {
            this.analise = this.propsAnalise
            if (this.propsAnalise.questionario_respostas) {
              if (this.propsAnalise.ds_risco_calculado && !this.riscoCalculado) {
                this.riscoCalculado = this.propsAnalise.ds_risco_calculado
              }
            }
            // TODO - Puxar diretamente da variavel ds_risco_calculado
            // Suporte 70685 - Atualizacao do Risco Calculado
            if (this.propsAnalise.questionario_respostas && Object.keys(this.propsAnalise.questionario_respostas).length > 11) {
              if (this.propsAnalise.ds_risco_calculado === '' || !this.propsAnalise.ds_risco_calculado) {
                axiosLaravel.put('propostas/' + this.propsAnalise.id + '/calcula-risco').then((response) => {
                  this.riscoCalculado = response.data
                })
                  .catch((error) => {
                    this.$root.trataErro(error)
                  })
              }
            }
            if (this.riscoCalculado) {
              this.propsAnalise.questionario_respostas.risco_calculado = this.riscoCalculado
            }
            if (this.ehSimplificada) {
              this.riscoCalculado = 'C'
              this.propsAnalise.questionario_respostas.risco_calculado = this.riscoCalculado
            }
            this.$emit('questionario', this.propsAnalise.questionario_respostas)
            if (this.questoes) {
              this.setQuestionarioRisco(this.questoes)
            }
          }
        }
      },
      mounted () {
        if (_.isUndefined(this.propsAnalise.questionario_respostas) || this.propsAnalise.questionario_respostas.length === 0) {
          // Monta origem da proposta
          this.propsAnalise.questionario_respostas = {}
        }
        // if (this.propsAnalise.origem_proposta) {
        //   this.propsAnalise.questionario_respostas.origem_proposta = this.propsAnalise.origem_proposta
        //   this.$forceUpdate()
        // }
        let rat = {}
        let bc = new BroadcastChannel('test_channel_1')
        let self = this
        bc.onmessage = function (ev) {
          rat = ev.data
          self.Temp = rat
          // ******************************
          // Monta Origem Proposta
          // ******************************
          let origem = ''
          if (self.propsAnalise.ds_categ_edital) {
            if (self.propsAnalise.ds_categ_edital !== 'NA' || self.Temp !== 'NA') {
              origem = 'Edital'
            } else {
              origem = ''
            }
            let textoNum = ''
            if (origem === 'Edital') {
              textoNum = 'Edital'
            } else {
              textoNum = 'Articulação'
            }
            if (!_.isUndefined(self.origemProposta)) {
              self.propsAnalise.questionario_respostas.origem_proposta = _.filter(self.origemProposta, function (atr) {
                return atr.ds_descricao.match(new RegExp(textoNum))
              })
            }
            self.$forceUpdate()
          }
        }
        if (this.ehSimplificada) {
          this.riscoCalculado = 'C'
          this.propsAnalise.questionario_respostas.risco_calculado = this.riscoCalculado
        }
      },
      async created () {
        this.canalAtualizacaoRating()
        // Busca questionario de risco
        await this.$root.buscaQuestionarioRisco(this.$store)
        this.questoes = this.$store.state.questionarioRisco
        this.fkOrigemProposta = this.$parent.$parent.analise.fk_origem_proposta_erp
        this.setQuestionarioRisco()
        // Faz o resto
        // ---------------------- Códigos do tipo de questão ---------------------
        // -----------------------------------------------------------------------
        // 7: 'Origem da proposta',
        // 8: 'Rating da entidade proponente',
        // 9: 'Investimento Social RP + RT por número de participantes diretos',
        // 10: 'Número de municípios atendidos',
        // 11: 'Região geográfica predominante dos municípios atendidos',
        // 12: 'Prazo de execução dos projetos',
        // 13: 'Valor do Investimento da FBB (RP + RT)',
        // 14: 'Utilização dos recursos de terceiros',
        // 15: 'Adiantamento de recursos',
        // 16: 'Natureza dos dispêndios',
        // 17: 'Reaplicação de TS certificada e/ou metodologia padronizada',
        // 18: 'Observância de legislação ambiental'
        // -----------------------------------------------------------------------
      },
      methods: {
        canalAtualizacaoRating () {
          let bcProposta = new BroadcastChannel('propostas')
          let vm = this
          bcProposta.onmessage = function (e) {
            let mensagem = e.data
            if (('' + mensagem.id) === ('' + vm.$route.params.id)) {
              if (mensagem.acao === 'set' && mensagem.objeto === 'proposta.rating') {
                let ratingValor = mensagem.valor
                if (ratingValor) {
                  if (ratingValor.classificacao) {
                    if (_.isUndefined(vm.propsAnalise.questionario_respostas)) {
                      vm.propsAnalise.questionario_respostas = {}
                    }
                    for (let i = 0; i < vm.rating.length; i++) {
                      if (vm.rating[i].ds_descricao === ratingValor.classificacao.nota) {
                        vm.propsAnalise.questionario_respostas.rating = vm.rating[i]
                      }
                    }
                  }
                }
              }
            } else {
            }
            vm.$forceUpdate()
          }
        },
        setQuestionarioRisco () {
          let array = _.filter(this.questoes, item => item.ds_codigo === 7)
          this.origemProposta = array[0].respostas          // ******************************
          // Monta Origem Proposta
          // ******************************
          // let origem = ''
          // if (this.propsAnalise.ds_categ_edital) {
          //   if (this.propsAnalise.ds_categ_edital !== 'NA') {
          //     origem = 'Edital'
          //   } else {
          //     origem = ''
          //   }
          //   let textoNum = ''
          //   if (origem === 'Edital') {
          //     textoNum = 'Edital'
          //   } else {
          //     textoNum = 'Articulação'
          //   }
          //   let array = _.filter(this.origemProposta, function (atr) {
          //     return atr.ds_descricao.match(new RegExp(textoNum))
          //   })
          //   if (_.isUndefined(this.propsAnalise.questionario_respostas)) {
          //     this.propsAnalise.questionario_respostas = {}
          //   }
          //   this.propsAnalise.questionario_respostas.origem_proposta = Object.assign({}, array[0])
          //   this.$forceUpdate()
          // }
          //
          array = _.filter(this.questoes, item => item.ds_codigo === 8)
          this.rating = array[0].respostas
          if (this.propsAnalise.ratingRelatorio && this.propsAnalise.ratingRelatorio.length > 0) {
            for (let i = 0; i < this.rating.length; i++) {
              if (this.rating[i].ds_descricao === this.propsAnalise.ratingRelatorio.classificacao.nota) {
                this.propsAnalise.questionario_respostas.rating = this.rating[i]
              }
            }
          }
          //
          array = _.filter(this.questoes, item => item.ds_codigo === 9)
          this.investimentoSocial = array[0].respostas
          // ******************************
          // Monta valor por participantes
          // ******************************
          if (this.propsAnalise.atividades) {
            this.propsAnalise.atividades.forEach((atividade) => {
              if (_.has(atividade, 'itens_orcamentos') && atividade.itens_orcamentos.length > 0) {
                atividade.itens_orcamentos.forEach(item => {
                  if (item.origem === '5' || item.origem === 5 || item.origem === '1' || item.origem === 1) {
                    this.totalInvestido = parseFloat(this.totalInvestido + (item.valor_unitario * item.quantidade))
                  }
                })
              }
            })
            // let participantes = 0
            // if (this.propsAnalise.publicos_alvo) {
            //   for (let i = 0; i < this.propsAnalise.publicos_alvo.length; i++) {
            //     participantes = parseInt(participantes + this.propsAnalise.publicos_alvo[i].nr_participantes_diretos)
            //   }
            //   if (this.totalInvestido) {
            //     let tamanho = parseFloat(this.totalInvestido / participantes)
            //     let textoNum = ''
            //     if (tamanho <= 1000.00) {
            //       textoNum = '1.000,00'
            //     }
            //     if (tamanho > 1000.00 && tamanho <= 2000.00) {
            //       console.log('caiu aqui')
            //       textoNum = 'De R$ 1.000,01 a R$ 2.000,00'
            //     }
            //     if (tamanho > 2000.00) {
            //       textoNum = '2.000,01 ou mais'
            //     }
            //     let array = _.filter(this.investimentoSocial, function (atr) {
            //       return atr.ds_descricao.match(new RegExp(textoNum))
            //     })
            //     console.log(this.investimentoSocial)
            //     console.log(array)
            //     this.propsAnalise.questionario_respostas.investimento_social_participantes = Object.assign({}, array[0])
            //     this.$forceUpdate()
            //   }
            // }
          }
          //
          array = _.filter(this.questoes, item => item.ds_codigo === 10)
          this.municipiosAtendidos = array[0].respostas
          // ******************************
          // Monta número de municípios
          // ******************************
          if (this.propsAnalise.municipalizacao) {
            const totMun = _.uniq(_.map(this.propsAnalise.municipalizacao, 'ds_municipio'))
            let tamanho = totMun.length
            let textoNum = ''
            if (tamanho === 1) {
              textoNum = '1'
            }
            if (tamanho > 1 && tamanho < 6) {
              textoNum = '2 a 5'
            }
            // 70331 - Correção de contagem de municípios
            if (tamanho > 5) {
              textoNum = '6'
            }
            let array = _.filter(this.municipiosAtendidos, function (atr) {
              return atr.ds_descricao.match(new RegExp(textoNum))
            })
            this.propsAnalise.questionario_respostas.municipios_atendidos = Object.assign({}, array[0])
            this.$forceUpdate()
          }
          //
          array = _.filter(this.questoes, item => item.ds_codigo === 11)
          this.regiaoGeografica = array[0].respostas
          // ******************************
          // Monta região geográfica
          // ******************************
          let contNorte = 0
          let contSulSudeste = 0
          let contCentroNordeste = 0
          if (this.propsAnalise.municipalizacao) {
            for (let i = 0; i < this.propsAnalise.municipalizacao.length; i++) {
              for (let j = 0; j < this.estados.length; j++) {
                if (this.estados[j].Sigla === this.propsAnalise.municipalizacao[i].ds_uf) {
                  if (this.estados[j].Região === 'Centro-Oeste' || this.estados[j].Região === 'Nordeste') {
                    contCentroNordeste = contCentroNordeste + 1
                  }
                  if (this.estados[j].Região === 'Sudeste' || this.estados[j].Região === 'Sul') {
                    contSulSudeste = contSulSudeste + 1
                  }
                  if (this.estados[j].Região === 'Norte') {
                    contNorte = contNorte + 1
                  }
                }
              }
            }
            //
            let textoNum = ''
            if (contCentroNordeste > contSulSudeste && contCentroNordeste > contNorte) {
              textoNum = 'Nordeste'
            }
            if (contSulSudeste > contCentroNordeste && contSulSudeste > contNorte) {
              textoNum = 'Sul'
            }
            if (contNorte > contCentroNordeste && contNorte > contSulSudeste) {
              textoNum = 'Norte'
            }
            let array = _.filter(this.regiaoGeografica, function (atr) {
              return atr.ds_descricao.match(new RegExp(textoNum))
            })
            this.propsAnalise.questionario_respostas.regiao_predominante = Object.assign({}, array[0])
            this.$forceUpdate()
          }
          //
          array = _.filter(this.questoes, item => item.ds_codigo === 12)
          this.prazoExecucao = array[0].respostas
          // ******************************
          // Monta prazo de execução
          // ******************************
          if (this.propsAnalise.nr_periodos) {
            let tamanho = this.propsAnalise.nr_periodos
            let textoNum = ''
            if (tamanho <= 12) {
              textoNum = 'Até 12'
            }
            if (tamanho >= 13 && tamanho <= 24) {
              textoNum = 'De 13 a 24'
            }
            if (tamanho >= 25) {
              textoNum = '25'
            }
            let array = _.filter(this.prazoExecucao, function (atr) {
              return atr.ds_descricao.match(new RegExp(textoNum))
            })
            this.propsAnalise.questionario_respostas.prazo_execucao = Object.assign({}, array[0])
            this.$forceUpdate()
          }
          //
          array = _.filter(this.questoes, item => item.ds_codigo === 13)
          this.valorInvestimento = array[0].respostas
          // ******************************
          // Monta total investido
          // ******************************
          if (this.totalInvestido) {
            let tamanho = Math.trunc(this.totalInvestido)
            let textoNum = ''
            if (tamanho <= 300000) {
              console.log('tamanho1', tamanho)
              textoNum = 'Até R$ 300.000,00'
            }
            if (tamanho > 300000 && tamanho <= 500000) {
              console.log('tamanho2', tamanho)
              textoNum = 'De R$ 300.000,01 a R$ 500.000,00'
            }
            if (tamanho > 500000) {
              console.log('tamanho3', tamanho)
              textoNum = 'De R$ 500.000,01 ou mais'
            }
            let array = _.filter(this.valorInvestimento, function (atr) {
              return atr.ds_descricao === textoNum
            })
            this.propsAnalise.questionario_respostas.valor_investimento = Object.assign({}, array[0])
            this.$forceUpdate()
          }
          //
          array = _.filter(this.questoes, item => item.ds_codigo === 14)
          this.recursosTerceiros = array[0].respostas
          // ******************************
          // Monta RT
          // ******************************
          let existeRT = false
          if (this.propsAnalise.atividades) {
            this.propsAnalise.atividades.forEach((atividade) => {
              if (_.has(atividade, 'itens_orcamentos') && atividade.itens_orcamentos.length > 0) {
                atividade.itens_orcamentos.forEach(item => {
                  if (item.origem === '5') {
                    existeRT = true
                  }
                })
              }
            })
            let tamanho = existeRT
            let textoNum = ''
            if (tamanho === false) {
              textoNum = 'apenas com RP'
            } else {
              textoNum = 'RT total'
            }
            let array = _.filter(this.recursosTerceiros, function (atr) {
              return atr.ds_descricao.match(new RegExp(textoNum))
            })
            this.propsAnalise.questionario_respostas.recursos_terceiros = Object.assign({}, array[0])
            this.$forceUpdate()
          }
          //
          array = _.filter(this.questoes, item => item.ds_codigo === 15)
          this.adiantamento = array[0].respostas
          // ******************************
          // Monta adiantamento
          // ******************************
          if (this.propsAnalise.adiantamentos) {
            let tamanho = this.propsAnalise.adiantamentos.length
            let textoNum = ''
            if (tamanho === 0) {
              textoNum = 'Sem adiantamento'
            }
            if (tamanho > 0 && tamanho <= 3) {
              textoNum = 'Com adiantamento, em até 3 parcelas'
            }
            if (tamanho > 3 && tamanho <= 4) {
              textoNum = 'Com adiantamento, em 4 parcelas'
            }
            if (tamanho >= 5) {
              textoNum = 'Com adiantamento, em 5 parcelas ou mais'
            }
            let array = _.filter(this.adiantamento, function (atr) {
              return atr.ds_descricao.match(new RegExp(textoNum))
            })
            this.propsAnalise.questionario_respostas.adiantamento_recursos = Object.assign({}, array[0])
            this.$forceUpdate()
          }
          //
          array = _.filter(this.questoes, item => item.ds_codigo === 16)
          this.natureza = array[0].respostas
          //
          array = _.filter(this.questoes, item => item.ds_codigo === 17)
          this.reaplicacaoTS = array[0].respostas
          //
          array = _.filter(this.questoes, item => item.ds_codigo === 18)
          this.legislacaoAmbiental = array[0].respostas
          //
          this.$forceUpdate()
        },
        alteracoes () {
          // this.$emit('questionario', this.analise.questionario_respostas)
          this.$forceUpdate()
        },
        recalcular () {
          if (Object.keys(this.propsAnalise.questionario_respostas).length > 11) {
            this.$snotify.async('Recalculando o risco. Por favor, aguarde...', {timeout: 0})
            this.propsAnalise.proximaEtapa = 'SALVAR'
            axiosLaravel.put('propostas/' + this.propsAnalise.id, this.propsAnalise).then((response) => {
              ok = true
              this.$forceUpdate()
            })
              .catch((error) => {
                this.$snotify.clear()
                this.$root.trataErro(error)
              })
            axiosLaravel.put('propostas/' + this.propsAnalise.id + '/calcula-risco').then((response) => {
              this.riscoCalculado = response.data
              this.$snotify.clear()
              this.$snotify.success('Risco atualizado com sucesso!')
            })
              .catch((error) => {
                this.$root.trataErro(error)
              })
          } else {
            this.$snotify.error('É necessário preencher todos os questionario de risco para calcular o Risco!')
            return
          }
          this.$forceUpdate()
        },
        onSelectOrigem (evento) {
          this.analise.questionario_respostas.origem_proposta = evento
        },
        onSelectMunicipios (evento) {
          this.analise.questionario_respostas.municipios_atendidos = evento
        },
        onSelectPrazos (evento) {
          this.analise.questionario_respostas.prazo_execucao = evento
        },
        onSelectNatureza (evento) {
          this.analise.questionario_respostas.natureza_dispendios = evento
        },
        onSelectRegiao (evento) {
          this.analise.questionario_respostas.regiaoGeografica = evento
        },
        onSelectInvestimento (evento) {
          this.analise.questionario_respostas.investimento_social_participantes = evento
        },
        onSelectValor (evento) {
          this.analise.questionario_respostas.valor_investimento = evento
        },
        onSelectRating (evento) {
          this.analise.questionario_respostas.rating = evento
        },
        onSelectReaplicacao (evento) {
          this.analise.questionario_respostas.realizacao_ts = evento
        },
        onSelectAdiantamento (evento) {
          this.analise.questionario_respostas.adiantamento_recursos = evento
        },
        onSelectRT (evento) {
          this.analise.questionario_respostas.recursos_terceiros = evento
        },
        onSelectLA (evento) {
          this.analise.questionario_respostas.legislacao_ambiental = evento
        },
        etiquetaTipos (option) {
          return `${option.ds_descricao}`
        }
      }
    }
</script>

<style scoped>
  .riscoCalculado {
    font-weight: bold;
    font-size: 16px;
  }
  .riscoNota {
    font-size: 40px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    vertical-align: middle;
  }
  .riscoA {
    color: green;
  }
  .riscoB {
    color: #ceb700;
  }
  .riscoC {
    color: orange;
  }
  .riscoD {
    color: orangered;
  }
  .riscoE {
    color: red;
  }
</style>
