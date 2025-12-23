  <!-- 74213 - Módulo de Prestação de Contas para Processo Simplificado-->
  <template>
      <div  class="prest-modulo-container" id="adiantamentosConcedidos">
        <div>
          <h3 class="prest-box-title row-flex centered-start">Adiantamentos Concedidos <i class="fa fa-money" aria-hidden="true" ></i> <span v-if="loading.adiantamentos" class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando...</span></h3>
        </div>

        <div v-if="!loading.adiantamentos" id="solicitacao">
          <div class="col-md-12">
            <div class="table-responsive parcelasAdiantamento">
              <table class="table table-condensed table-bordered table-striped">
                <thead>
                <tr>
                  <td class="centralizado borda" :title="'<h5>Número da parcela (ordem) do adiantamento</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Parcela</td>
                  <td class="centralizado borda" :title="'<h5>Valor da parcela no instrumento legal</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Valor previsto</td>
                  <td class="centralizado borda" :title="'<h5>Valor solicitado dentro do limite total da parcela</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Valor adiantado</td>
                  <td class="centralizado borda" :title="'<h5>Total das prestações de contas realizadas para o valor adiantado</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Valor Pendente</td>
                  <td class="centralizado borda" :title="'<h5>Percentual das prestações de contas realizadas para o valor adiantado</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">% Comprov.</td>
                </tr>
                </thead>

                <tbody>

                <!-- Tabela -->
                <template v-for="adiantamento in adiantamentosConcedidos">
                  <template v-if="!_.has(adiantamento, 'mostrar') || adiantamento.mostrar">
                    <tr>
                      <td class="celula centralizado borda">{{adiantamento.parcela}}</td>
                      <td class="celula centralizado borda">{{adiantamento.contratado | real}}</td>
                      <td class="celula centralizado borda">{{adiantamento.requisitado | real}}</td>
                      <td class="celula centralizado borda">{{adiantamento.pendente_comprovacao | real}}</td>
                      <td :class="'celula centralizado borda ' + (adiantamento.percentual_comprovado >= 1 ? 'atingido100' : (adiantamento.percentual_comprovado >= 0.8 ? 'atingido80' : 'nao_atingido'))">{{adiantamento.percentual_comprovado | percentage}}</td>
                    </tr>
                  </template>
                </template>

                </tbody>
              </table>
            </div>

          </div>

          <!-- Totais -->
          <div class="col-md-12">
            <table class="totais" v-if="_.keys(_.groupBy(adiantamentosConcedidos, 'recurso')).length === 2">
              <tr>
                <td class="centralizado"><span>Total Solicitado Fundação BB</span></td>
                <td class="centralizado"><span>Total Pendente Fundação BB</span></td>
                <td class="centralizado"><span>Total Solicitado Parceiros Estratégicos</span></td>
                <td class="centralizado"><span>Total Pendente Parceiros Estratégicos</span></td>
              </tr>
              <tr>
                <td class="centralizado valor">
                  <span :title="'<h5>Valor total já solicitado de adiantamento para esta projeto em parcela(s) com recursos da Fundação BB</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large' }">
                    {{totais.adiantamento.fbb.solicitado | real}}
                  </span>
                </td>
                <td class="centralizado valor">
                  <span :title="'<h5>Valor total pendente de prestação de contas de acordo com total de adiantamento solicitado com recursos da Fundação BB</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large' }">
                    {{totais.adiantamento.fbb.saldo | real}}
                  </span>
                </td>

                <td class="centralizado valor">
                  <span :title="'<h5>Valor total já solicitado de adiantamento para esta projeto em parcela(s) com recursos de Parceiros Estratégicos</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large' }">
                    {{totais.adiantamento.parceiros.solicitado | real}}
                  </span>
                </td>
                <td class="centralizado valor">
                  <span :title="'<h5>Valor total pendente de prestação de contas de acordo com total de adiantamento solicitado com recursos de Parceiros Estratégicos</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large' }">
                    {{totais.adiantamento.parceiros.saldo | real}}
                  </span>
                </td>
              </tr>
            </table>
            <table class="totais" v-else>
              <tr>
                <td class="centralizado"><span>Total de adiantamento solicitado</span></td>
                <td class="centralizado"><span>Total Pendente de Prestação de contas</span></td>
              </tr>
              <tr>
                <td class="centralizado valor">
                  <span :title="'<h5>Valor total já solicitado de adiantamento para esta projeto</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large' }">
                    {{totais.adiantamento.total.solicitado | real}}
                  </span>
                </td>
                <td class="centralizado valor">
                  <span :title="'<h5>Valor total pendente de prestação de contas de acordo com total de adiantamento solicitado</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large' }">
                    {{totais.adiantamento.total.saldo | real}}
                  </span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
  </template>
  
  <script>
    import { mapGetters } from 'vuex'
    import moment from 'moment'
    export default {
      components: {
      },
      name: 'adiantamentosPrestacaoSimplificada',
      data () {
        return {
          layoutExtrato: 'classico'
        }
      },
      props: {
        adiantamentosConcedidos: Array,
        totais: Object,
        loading: Object
      },
      computed: {
        ...mapGetters([
          'usuarioLogado'
        ]),
        chiefActive () {
          return this.usuarioLogado.entity.chiefs.some(chefe => {
            return chefe.active === true && moment(new Date()).isSameOrAfter(moment(chefe.initialMandateDate)) && moment(new Date()).isSameOrBefore(moment(chefe.endMandateDate))
          })
        }
      },
      created: function () {
      },
      mounted: function () {
      },
      methods: {
      }
    }
  </script>
  
  <style src="../../../../static/css/prestacaoContasNovo.css">
  </style>
  