<template>
  <div class="box-body parcelasAdiantamento" v-if="(_.has(propsProposta, 'adiantamento') && propsProposta.adiantamento.length > 0) || (totais.projeto.total !== 0) || (table.items.length > 0)">

    <div v-show="loading" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
      <i class="fa fa-refresh fa-spin"></i>
    </div>

    <!-- grid -->
    <div v-show="showgrid">
      <div class="row">
        <div class="col-md-12" v-if="formEditavel">
          <button @click="showgrid = !showgrid" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Nova parcela</button>
          <button v-if="table.items.length > 0" @click="distribuirValores" type="button" class="btn btn-back btn-flat"
                  :title="'<h5>Redistribuirá proporcionalmente, o total de R$ <span class=\'realce\'>' + totais.projeto.total + '</span> nas <span class=\'realce\'>' + table.items.length + '</span> parcelas abaixo</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
            <i class="fa fa-server" aria-hidden="true"></i> Distribuir</button>
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->
      <br v-if="formEditavel">
      <div class="row">
        <div class="">
          <div class="table-responsive">
            <b-container fluid>
              <!-- Main table element -->
              <b-table show-empty
                       stacked="md"
                       :bordered="table.bordered"
                       :items="('' + modoVisualizacaoAlteracoes) === 'DETALHADO' ? _.union(table.items, _.filter(propsPropostaBackup.adiantamentos, function(a) { return _.includes(_.get(processoSolicitacao, 'exclusao', []), a.id) }) ) : table.items"
                       :hover="table.hover"
                       :fields="table.fields"
                       :filter="table.filter"
                       :current-page="table.currentPage"
                       :per-page="table.perPage"
                       :sort-by.sync="table.sortBy"
                       :sort-desc.sync="table.sortDesc"
                       :tbody-tr-class="modificacaoLinha"
                       empty-text="Nenhum registro encontrado">

                <template slot="parcela" scope="row">
                  <div style="display: flex; justify-content: space-between; align-items: center">
                    <div style="width: 30px">
                      <span v-if="('' + modoVisualizacaoAlteracoes) === 'DETALHADO'" class="pull-left">
                        <span v-if="ehItemNovo(row.item)" class="label label-info">Novo</span>
                        <span v-if="ehItemExcluido(row.item)" class="label label-danger">Excluído</span>
                      </span>
                      <span v-else>&nbsp;</span>
                    </div>
                    <div style="width: 30px">{{row.value}}</div>
                    <div style="width: 50px">
                      <span v-if="usuarioLogado.ds_tipo_usuario === 'FUNDACAO' && (formEditavel && !_.has(row.item, 'requisitado'))" class="botoesUpDown">
                        <i class="fa fa-chevron-up" v-if="row.index > 0" @click="moverLinha(row, 'cima')"
                           :title="'<h5>Move essa parcela para Cima<br/>Será a ' + (row.item.parcela - 1) + 'ª parcela</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }"></i>
                        <i class="fa fa-chevron-down" v-if="row.index < table.items.length - 1" @click="moverLinha(row, 'baixo')"
                           :title="'<h5>Move essa parcela para Baixo<br/>Será a ' + (row.item.parcela + 1) + 'ª parcela</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }"></i>
                      </span>
                      <span v-else>&nbsp;</span>
                    </div>
                  </div>
                </template>

                <template slot="origem" scope="row">
                  <div class="input-group" style="display: inline-table;">
                    <span>{{ etiquetaOrigemRecurso(row.value) }}</span>
                    <span v-if="('' + modoVisualizacaoAlteracoes) === 'DETALHADO' && _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'origem.0')" class="input-group-addon valorAlterado">
                      {{ etiquetaOrigemRecurso('' + _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'origem.0', '')) }}
                    </span>
                  </div>
                </template>

                <template slot="valor" scope="row">
                  <div class="input-group" style="display: inline-table;">
                    <span>{{row.value | real}}</span>
                    <span class="input-group-addon valorAlterado" v-if="('' + modoVisualizacaoAlteracoes) === 'DETALHADO' && _.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id])">
                      {{ _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'valor.0', '0') | real}}
                    </span>
                  </div>
                </template>

                <template slot="requisitado" scope="row">
                  <span :title="'<h5>Valor liberado ou em análise para liberação</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                    {{row.value | real}}
                  </span>
                </template>

                <template slot="percentual_comprovado" scope="row">
                  <span :title="'<h5>Refere-se a todas as prestações de contas registradas no SGP sobre o valor requisitado</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }"
                        v-if="row.value > 0"
                        :class="(row.value >= 1 ? 'atingido100' : (row.value >= 0.8 ? 'atingido80' : 'nao_atingido'))">
                    {{row.value | percentage}}
                  </span>
                </template>


                <template slot="actions" scope="row">
                  <div v-if="propsLayout != 'EXECUCAO' || (formEditavel && !_.has(row.item, 'requisitado'))">
                    <span v-if="ehItemExcluido(row.item)">
                      <b-button type="button" @click.stop="reincluir(row)" class="btn btn-back btn-flat btn-sm"><i class="fa fa-refresh" aria-hidden="true"></i> Reincluir</b-button>
                    </span>
                    <span v-else>
                      <b-button type="button" :disabled="false" @click.stop="edita(row)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>
                      <b-button type="button" :disabled="false" class="btn btn-danger btn-sm btn-flat" v-confirm="{ok: retorno => exclui(row), cancel: doNothing, message: 'Deseja <b>APAGAR</b> a parcela número ' + row.item.parcela + ' ?'}">
                        <i class="fa fa-trash" aria-hidden="true"></i> Excluir
                      </b-button>
                    </span>
                  </div>
                </template>
              </b-table>

              <b-row v-if="table.items.length > table.perPage">
                <b-col md="12" class="my-1" right>
                  <b-pagination :total-rows="table.totalRows" :per-page="table.perPage" v-model="table.currentPage" class="" />
                </b-col>
              </b-row>

            </b-container>

          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <table class="totais">
            <tr>
              <td class="centralizado"><span v-if="totais.projeto.fbb !== 0">Total Fundação</span></td>
              <td class="centralizado"><span v-if="totais.projeto.parceiros !== 0">Total Parceiro Estratégico</span></td>
              <td class="centralizado" v-if="totais.distribuidos.misto !== 0"><span>Total Misto</span></td>
              <td class="centralizado">Total do Projeto</td>
            </tr>
            <tr>
              <td class="centralizado valor">
                <span v-if="totais.projeto.fbb !== 0" :title="'<h5>Valor adiantável da Fundação que distribuiu em <span class=\'realce\'>' + ehNulo((_.countBy(table.items, function (m) { return ('' + m.origem) === '1' }))['true'], 'nenhuma') + '</span> parcela(s) acima</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                {{totais.distribuidos.fbb | real}}</span>
              </td>
              <td class="centralizado valor">
                <span v-if="totais.projeto.parceiros !== 0" :title="'<h5>Valor adiantável de Parceiros Estratégicos que distribuiu em <span class=\'realce\'>' + ehNulo((_.countBy(table.items, function (m) { return ('' + m.origem) === '5' }))['true'], 'nenhuma') + '</span> parcela(s) acima</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                {{totais.distribuidos.parceiros | real}}</span>
              </td>
              <td class="centralizado valor" v-if="totais.distribuidos.misto !== 0">
                <span :title="'<h5>Valor adiantável que pode ser usado com recursos da Fundação ou de Parceiros Estratégicos que foi distribuído em <span class=\'realce\'>' + ehNulo((_.countBy(table.items, function (m) { return ('' + m.origem) === '0' }))['true'], 'nenhuma') + '</span> parcela(s) acima</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                {{totais.distribuidos.misto | real}}</span>
              </td>
              <td class="centralizado valor">
                <span v-if="totais.projeto.total >= totais.distribuidos.total" :title="'<h5>Valor total adiantável que distribuiu em <span class=\'realce\'>' + (table.items.length === 0 ? 'nenhuma' : table.items.length) + '</span> parcela(s) acima</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                {{totais.distribuidos.total | real}}</span>
                <span v-else class="atencao" :title="'<h5>Valor total distribuído ultrapassou o total adiantável no cronograma do projeto</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                {{totais.distribuidos.total | real}}</span>
              </td>
            </tr>

            <tr v-if="Math.trunc(totais.restantes.total + totais.residuo.total) > 0 || Math.abs((totais.restantes.total + totais.residuo.total) % 1) > 0.01 && usuarioLogado.ds_tipo_usuario === 'FUNDACAO'">
              <td class="centralizado valor">
                <span class="atencao" v-bind:style="((totais.restantes.fbb + totais.residuo.fbb) >= 0 ? 'background: steelblue !important;' : '')" v-if="totais.restantes.fbb + totais.residuo.fbb !== 0" :title="'<h5>' + ((totais.restantes.fbb + totais.residuo.fbb) >= 0 ? 'Este é <u>restante</u> do valor de <span class=\'realce\'>R$ ' + (totais.projeto.fbb) + '</span> dos itens adiantáveis da Fundação' + (totais.residuo.fbb > 0 ? ' acrescido de <span class=\'realce\'>R$ ' + totais.residuo.fbb + '</span> de resíduos de parcelas não liberadas integralmente' : '') + ' que ainda podem ser lançados em parcelas' : 'Ultrapassou o limite de valores da Fundação para distribuir em parcelas') + '</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                {{totais.restantes.fbb + totais.residuo.fbb | real}}</span>
              </td>
              <td class="centralizado valor">
                <span class="atencao" v-bind:style="((totais.restantes.parceiros + totais.residuo.parceiros) >= 0 ? 'background: steelblue !important;' : '')" v-if="totais.restantes.parceiros + totais.residuo.parceiros !== 0" :title="'<h5>' + ((totais.restantes.fbb + totais.residuo.fbb) >= 0 ? 'Este é <u>restante</u> do valor de <span class=\'realce\'>R$ ' + (totais.projeto.parceiros) + '</span> dos itens adiantáveis de Parc Estratégicos' + (totais.residuo.parceiros > 0 ? ' acrescido de <span class=\'realce\'>R$ ' + totais.residuo.parceiros + '</span> de resíduos de parcelas não liberadas integralmente' : '') + ' que ainda podem ser lançados em parcelas' : 'Ultrapassou o limite de valores da Fundação para distribuir em parcelas') + '</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                  {{totais.restantes.parceiros + totais.residuo.parceiros | real}}</span></td>
              <td class="centralizado valor" v-if="totais.distribuidos.misto !== 0">
                <span class="atencao" v-bind:style="((totais.restantes.misto + totais.residuo.misto) >= 0 ? 'background: steelblue !important;' : '')" v-if="totais.restantes.misto + totais.residuo.misto !== 0" :title="'<h5>' + ((totais.restantes.misto + totais.residuo.misto) >= 0 ? 'Este é <u>restante</u> do valor de <span class=\'realce\'>R$ ' + (totais.projeto.misto) + '</span> dos itens adiantáveis da Fundação e de Parc Estratégicos' + (totais.residuo.misto > 0 ? ' acrescido de <span class=\'realce\'>R$ ' + totais.residuo.misto + '</span> de resíduos de parcelas não liberadas integralmente' : '') + ' que ainda podem ser lançados em parcelas' : 'Ultrapassou o limite de valores da Fundação para distribuir em parcelas') + '</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                  {{totais.restantes.misto + totais.residuo.misto | real}}</span></td>
              <td class="centralizado valor">
                <span class="atencao" v-bind:style="((totais.restantes.total + totais.residuo.total) >= 0 ? 'background: steelblue !important;' : '')" v-if="totais.restantes.total + totais.residuo.total !== 0" :title="'<h5>' + ((totais.restantes.fbb + totais.residuo.fbb) >= 0 ? 'Este é <u>restante</u> do valor de <span class=\'realce\'>R$ ' + (totais.projeto.total) + '</span> dos itens adiantáveis do cronograma do projeto' + (totais.residuo.total > 0 ? ' acrescido de <span class=\'realce\'>R$ ' + totais.residuo.total + '</span> de resíduos de parcelas não liberadas integralmente' : '') + ' que ainda podem ser lançados em parcelas' : 'Ultrapassou o limite de valores da Fundação para distribuir em parcelas') + '</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                  {{totais.restantes.total + totais.residuo.total | real}}</span>
              </td>
            </tr>
          </table>
        </div>
      </div>

    </div>

    <!--Form-->
    <div v-if="!showgrid" class="row well well-sm no-shadow">
      <div class="col-md-12">

        <!-- Parcela -->
        <div class="form-group" v-show="_.has(parcela, 'parcela')">
          <label class="control-label col-md-2">Parcela:</label>
          <div class="col-md-2">
            <div>
              <label class="control-label">{{parcela.parcela}}</label>
            </div>
          </div>
        </div>
        <!-- Origem do recurso -->
        <div class="form-group required-field" :class="{ 'has-error' : errors.first('origem')}">
          <label for="origem" class="control-label col-md-2">Origem:</label>
          <div class="col-md-2">
            <div>
              <select v-model="parcela.origem" @click="verificaFase" :disabled="existeFaseFBB === 0 && existeFaseParc === 0" name="origem" id="origem" class="form-control" v-validate="'required'">
                <option :value='1' v-if="existeFaseFBB > 0">Fundação</option>
                <option :value='5' v-if="existeFaseParc > 0">Parceiro Estratégico</option>
                <option :value='0' v-if="existeFaseParc > 0 && existeFaseFBB > 0">Misto</option>
              </select>
            </div>
            <span v-if="errors.first('origem')" class="label label-danger"> {{ errors.first('origem') }}</span>
          </div>
          <div class="col-md-8" v-show="existeFaseFBB === 0 && existeFaseParc === 0"><span class="atencao">Precisa ter algum item marcado como Adiantavel no cronograma</span></div>
        </div>

        <!-- Valor parcela -->
        <div class="form-group required-field" :class="{ 'has-error' : errors.first('valor')}">
          <label class="control-label col-md-2">Valor:</label>
          <div class="col-md-2">
            <div class="input-group">
              <div>
                <money v-model="parcela.valor" name="valor" class="form-control text-right" type="text" v-validate="'required|min_value:1|max_value:' + limiteParcela(parcela).toFixed(2)"></money>
              </div>
            </div>
            <span v-if="errors.first('valor')" class="label label-danger"> {{ errors.first('valor') }}</span>
          </div>
          <div class="col-md-4">Valor máximo permitido para esta parcela: <strong>{{limiteParcela(parcela) | real}}</strong></div>
        </div>

        <!-- Botões -->
        <div class="form-group">
          <div class="col-md-4 col-md-offset-2">
            <button @click="onAdd" type="button" class="btn btn-confirm btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Ok</button>
            <button @click="onCancel" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
          </div>
        </div>

      </div>
    </div>
  </div>

  <div v-else class="box-header">
    Não há itens adiantáveis nem parcelas cadastradas
  </div>

</template>

<script>
  /* eslint-disable eqeqeq */
  import { mapGetters } from 'vuex'

  export default {
    name: 'parcela-adiantamento',
    data () {
      return {
        loading: false,
        showgrid: true,
        parcelaAdiantameto: [],
        totais: {
          projeto: {
            fbb: 0,
            parceiros: 0,
            misto: 0,
            total: 0
          },
          distribuidos: {
            fbb: 0,
            parceiros: 0,
            misto: 0,
            total: 0
          },
          restantes: {
            fbb: 0,
            parceiros: 0,
            misto: 0,
            total: 0
          },
          residuo: {
            fbb: 0,
            parceiros: 0,
            misto: 0,
            total: 0
          }
        },
        existeFaseFBB: 0,
        existeFaseParc: 0,
        table: {
          items: this.propsParcelas,
          filter: null,
          hover: true,
          bordered: true,
          existe: false,
          currentPage: 1,
          totalRows: 0,
          sortBy: 'parcela',
          sortDesc: false,
          perPage: 100,
          fields: [
            { key: 'parcela', label: 'Parcela', sortable: false, thStyle: 'text-align: center; width: 10%', class: 'text-center' },
            { key: 'origem', label: 'Origem', sortable: false, thStyle: 'text-align: center;width: 20%', class: 'text-center' },
            { key: 'valor', label: 'Valor Adiantável', sortable: false, thStyle: 'text-align: center;width: 20%', class: 'text-center' },
            { key: 'requisitado', label: 'Valor Requisitado', sortable: false, thStyle: 'text-align: center;width: 20%', class: 'text-center' },
            { key: 'percentual_comprovado', label: '% Comprov.', sortable: false, thStyle: 'text-align: center;width: 10%', class: 'text-center' },
            { key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 20%', class: 'text-center' }
          ]
        },
        parcela: {},
        parcelaTabela: {},
        adiantamentosConcedidos: [],
        percentualMaximoSobreResiduos: 0.25,
        editandoIndex: null,
        formEditavel: false
      }
    },
    props: ['propsParcelas', 'editavel', 'propsAtividades', 'propsProposta', 'propsLayout', 'propsPropostaBackup',
      'modoVisualizacaoAlteracoes', // opcional - exibe as alterações realizadas. Se o valor for RESUMIDO mostra só o total de modificações, se DETALHADO mostrará quais alterações houveram. Sem valor, null ou outra opção, não mostrará as modificações
      'atualizar', // opcional - valor qualquer somente para disparar atualização
      'processoSolicitacao', // opcional - recebe o objeto da solicitação de alteração
      'alteracaoProjeto' // opcional - verifica se é alteracao de projeto
    ],
    watch: {
      atualizar: function () {
        this.calcularTotais()
      },
      propsParcelas: function () {
        this.table.items = this.propsParcelas
        this.table.totalRows = this.table.items.length
        this.calcularTotais()
      },
      editavel: function () {
        this.formEditavel = this.editavel
      },
      'table.items' () {
        this.$emit('parcelaAdicionada', this.table.items)
      },
      showgrid: function () {
        if (this.existeFaseFBB > 0 && this.existeFaseParc === 0) {
          this.parcela.origem = 1
        } else if (this.existeFaseFBB === 0 && this.existeFaseParc > 0) {
          this.parcela.origem = 5
        }
        this.$emit('validacaoParcelasAdiantamento', {'tag': 'parcelasEditando', 'ativo': (!this.showgrid), 'tipo': 'restricao', 'acao': null, 'mensagem': '<span class=\'restricaoEditandoInformacao\'>Parcela de Adiantamento em edição<span>'})
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    mounted () {
      let bc = new BroadcastChannel('propostas')
      let vm = this
      bc.onmessage = function (e) {
        let mensagem = e.data
        if (('' + mensagem.id) === ('' + vm.$route.params.id)) {
          if (mensagem.acao === 'notificacaoAtualizacaoCronograma') {
            vm.calcularTotais()
          } else {
          }
        }
      }
      this.calcularTotais()
    },
    created: function () {
      let parc = _.filter(this.propsParcelas, function (value) {
        return value !== null
      })
      this.table.items = _.cloneDeep(this.ajustarParcelas(parc))
      if (this.propsLayout != 'EXECUCAO') {
        this.table.fields = _.remove(this.table.fields, function (f) {
          return f.key !== 'requisitado' && f.key !== 'percentual_comprovado'
        })
      }
      this.calcularTotais()
      if (this.propsLayout == 'EXECUCAO') {
        this.buscaAdiantamentosConcedidos()
      }
      this.formEditavel = this.editavel
    },
    methods: {
      ajustarParcelas (parcelas) {
        let parcelasOrdenadas = _.orderBy(parcelas, ['parcela'], ['asc'])
        let numerosDasParcelas = _.map(parcelasOrdenadas, 'parcela')
        let numeroDasParcelasUnicas = _.uniq(numerosDasParcelas)
        if (numerosDasParcelas.length !== numeroDasParcelasUnicas.length) {
          let parcelasAjustadas = []
          numeroDasParcelasUnicas.forEach((numeroParcela) => {
            let parcelasFiltradas = _.filter(parcelasOrdenadas, ['parcela', numeroParcela])
            if (parcelasFiltradas.length === 2 && this.existeFaseParc > 0 && this.existeFaseFBB > 0) { // Há exatamente dois registros com o mesmo número da parcela e se trata de projeto com recursos adiantáveis mistos
              if ((parcelasFiltradas[0] === 1 && parcelasFiltradas[1] === 5) || (parcelasFiltradas[0] === 5 && parcelasFiltradas[1] === 1)) { // Se essas duas parcelas, uma é de origem 1 (FBB) e outra de origem 5 (Parc. Estrategico)
                let objetoParcela = _.head(parcelasFiltradas)
                _.set(objetoParcela, 'origem', 0)
                _.set(objetoParcela, 'valor', _.round(_.sumBy(parcelasFiltradas, 'valor'), 2) / 2)
                parcelasAjustadas.push(objetoParcela)
              }
            } else {
              parcelasFiltradas.forEach((parcela) => {
                parcelasAjustadas.push(parcela)
              })
            }
          })
          return _.clone(parcelasAjustadas)
        } else {
          return _.clone(parcelasOrdenadas)
        }
      },
      valorProjetoOrigem (fase, texto) {
        let vm = this

        let valorTotal = _.sumBy(vm.propsAtividades, function (atv) {
          // console.log(atv.ds_nome)
          let valorOrc = (_.has(atv, 'itens_orcamentos') && atv.itens_orcamentos.length > 0)
            ? _.sumBy(atv.itens_orcamentos, function (item) {
              // console.log('============================================')
              // console.log(item.observacaoOriginal)
              // console.log('ValorOrcado: ', item.valorOrcado)
              // console.log('valorAlteracao: ', item.valorAlteracao)
              // console.log('id: ', item.id)
              // console.log('TEM VALOR ORÇADO?', _.has(item, 'valorOrcado'))
              // console.log('VALOR ORCADO + ALT: ', vm.truncarValor((item.valorOrcado > 0) ? item.valorOrcado + (!_.includes(item.id, 'novo') ? (_.toNumber(_.get(item, 'valorAlteracao', 0))) : 0) : item.valorOrcado + (_.toNumber(_.get(item, 'valorAlteracao', 0)))))
              let itemDesp = (_.has(item, 'origem') && ('' + item.origem) === '' + fase || item.origem === texto) && ('' + item.adiantavel === '1') // considera só adiantável
                // ? (_.has(item, 'valorOrcado') ? vm.truncarValor(item.valorOrcado + (_.toNumber(_.get(item, 'valorAlteracao', 0))))
                // ? (_.has(item, 'valorOrcado') ? vm.truncarValor(item.valorOrcado + (!_.includes(item.id, 'novo') ? (_.toNumber(_.get(item, 'valorAlteracao', 0))) : 0))
                ? (_.has(item, 'valorOrcado') ? vm.truncarValor((item.valorOrcado > 0) ? item.valorOrcado + (!_.includes(item.id, 'novo') ? (_.toNumber(_.get(item, 'valorAlteracao', 0))) : 0) : item.valorOrcado + (_.toNumber(_.get(item, 'valorAlteracao', 0))))
                  : (_.has(item, 'valor_unitario') && _.has(item, 'quantidade') && !_.isNil(item.valor_unitario) ? vm.truncarValor(parseFloat(item.valor_unitario) * parseFloat(item.quantidade))
                    : _.sumBy(item.orcamentos_mensalizados, function (mes) {
                      return _.has(mes, 'valor') ? vm.truncarValor(mes.valor) : 0
                    }) + (_.toNumber(_.get(item, 'valorAlteracao', 0)))
                  )) : 0
              // console.log('Total item: ', itemDesp)
              // console.log('============================================')
              return itemDesp
            }) : 0
          // console.log(valorOrc)
          return valorOrc
        })
        return this.truncarRound(valorTotal)
      },
      calcularTotais () {
        this.totais.distribuidos.total = 0
        this.totais.distribuidos.fbb = 0
        this.totais.distribuidos.parceiros = 0
        this.totais.distribuidos.misto = 0
        this.totais.projeto.total = 0
        this.totais.projeto.fbb = 0
        this.totais.projeto.parceiros = 0
        this.totais.projeto.misto = 0
        //
        this.totais.projeto.fbb = this.truncarValor(this.valorProjetoOrigem('1', 'FUNDACAO'))
        this.totais.projeto.parceiros = this.truncarValor(this.valorProjetoOrigem('5', 'PARCEIRO_ESTRATEGICO'))
        this.totais.projeto.misto = this.truncarValor(this.totais.projeto.fbb + this.totais.projeto.parceiros)
        this.totais.projeto.total = this.truncarValor(this.totais.projeto.fbb + this.totais.projeto.parceiros)
        this.totais.projeto.total = this.truncarValor(this.totais.projeto.total)
        this.totais.distribuidos.fbb = this.truncarValor(_.sumBy(this.table.items, function (parc) { return ('' + parc.origem) === '1' ? parc.valor : 0 }))
        this.totais.distribuidos.parceiros = this.truncarValor(_.sumBy(this.table.items, function (parc) { return ('' + parc.origem) === '5' ? parc.valor : 0 }))
        this.totais.distribuidos.misto = this.truncarValor(_.sumBy(this.table.items, function (parc) { return ('' + parc.origem) === '0' ? parc.valor : 0 }))
        this.totais.distribuidos.total = this.truncarValor(this.totais.distribuidos.fbb + this.totais.distribuidos.parceiros + this.totais.distribuidos.misto)
        this.totais.restantes.fbb = this.truncarValor(this.totais.projeto.fbb - this.totais.distribuidos.fbb)
        this.totais.restantes.parceiros = this.truncarValor(this.totais.projeto.parceiros - this.totais.distribuidos.parceiros)
        this.totais.restantes.misto = this.truncarValor(this.totais.projeto.misto - (this.totais.distribuidos.fbb + this.totais.distribuidos.parceiros + this.totais.distribuidos.misto))
        this.totais.restantes.total = this.truncarValor(this.totais.restantes.fbb + this.totais.restantes.parceiros - this.totais.distribuidos.misto)
        //
        if (this.totais.residuo.total === 0) { // Evita recalcular todas as vezes, só calcula quando é zero (quando inicia o componente)
          this.totais.residuo.fbb = this.truncarValor(_.sumBy(this.propsParcelas, function (p) {
            return (p.valor - p.requisitado) > 0 && ('' + p.origem) === '1' ? (p.valor - p.requisitado) : 0
          }) * this.percentualMaximoSobreResiduos)
          this.totais.residuo.parceiros = this.truncarValor(_.sumBy(this.propsParcelas, function (p) {
            return (p.valor - p.requisitado) > 0 && ('' + p.origem) === '5' ? (p.valor - p.requisitado) : 0
          }) * this.percentualMaximoSobreResiduos)
          this.totais.residuo.total = this.truncarValor(this.totais.residuo.fbb + this.totais.residuo.parceiros)
        }
        this.numerarParcelas()
        this.verificaFase()
        let totalProjeto = this.totais.projeto.total
        let totalDistribuido = this.totais.distribuidos.total
        if (totalProjeto !== totalDistribuido) {
          let totalProjetoFloor = this.truncarValor2(this.totais.projeto.total)
          let totalDistribuidoFloor = this.truncarValor2(this.totais.distribuidos.total)
          if (totalProjetoFloor !== totalDistribuidoFloor) {
            this.totais.projeto.total = this.truncarCeil(this.totais.projeto.total)
            this.totais.distribuidos.total = this.truncarCeil(this.totais.distribuidos.total)
          } else {
            this.totais.projeto.total = this.truncarValor2(this.totais.projeto.total)
            this.totais.distribuidos.total = this.truncarValor2(this.totais.distribuidos.total)
          }
        }
        // this.$emit('validacaoParcelasAdiantamento', {'tag': 'parcelasAcimaTotalAdiantavel', 'ativo': (this.totais.projeto.total < this.totais.distribuidos.total), 'tipo': 'restricao', 'acao': null, 'mensagem': 'O valor total distribuído ainda não atingiu o valor total solicitado. Distribuir entre os itens o valor de R$ ' + ((this.totais.projeto.total - this.totais.distribuidos.total + this.totais.residuo.total) * -1)})
        // Verificar se é alteração de projeto para abrir excessão
        let requisitadoMenorDisponibilizado = false
        if (this.alteracaoProjeto) {
          // Verifica se parcela de adiantamento X valor requisitado está diferente
          this.propsParcelas.forEach(parcela => {
            // Se requisitado não for undefined, verifica se valor é diferente do
            if (parcela.requisitado) {
              if (parcela.valor > parcela.requisitado) {
                requisitadoMenorDisponibilizado = true
              }
            }
          })
        }
        console.log(requisitadoMenorDisponibilizado)
        if (requisitadoMenorDisponibilizado === false) {
          // Suporte 73435
          // this.$emit('validacaoParcelasAdiantamento', {'tag': 'parcelasAcimaTotalAdiantavel', 'ativo': (this.totais.projeto.total !== this.totais.distribuidos.total), 'tipo': 'restricao', 'acao': null, 'mensagem': 'O total adiantável no extrato (R$ ' + this.totais.projeto.total + ') difere do total nas parcelas de adiantamento (R$ ' + (this.totais.distribuidos.total + this.totais.residuo.total) + ')'})
        }
        // this.$emit('validacaoParcelasAdiantamento', {'tag': 'parcelasAdiantamentoValores', 'ativo': (this.totais.restantes.total + this.totais.residuo.total) < 0, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Valor distribuído ultrapassou o máximo permitido em R$ <b>' + (this.totais.projeto.total - this.totais.distribuidos.total + this.totais.residuo.total) + '</b>'})
        this.$emit('validacaoParcelasAdiantamento', {'tag': 'parcelasAdiantamentoZeradas', 'ativo': (this.table.items.length > 0 && _.filter(this.table.items, ['valor', 0]).length > 0), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Há <b>' + _.filter(this.table.items, ['valor', 0]).length + '</b> Parcela(s) de Adiantamento com valor <b>R$ 0,00</b> (zerada). Deve preencher ou eliminar.'})
      },
      truncarValor (valor) {
        // return Math.ceil(valor * 100) / 100
        return valor
      },
      truncarValor2 (valor) {
        return Math.floor(valor * 100) / 100
        // return valor
      },
      truncarCeil (valor) {
        return Math.ceil(valor * 100) / 100
      },
      truncarRound (valor) {
        return Math.round(valor * 100) / 100
      },
      numerarParcelas () {
        for (let i = 0; i < this.table.items.length; i++) {
          _.set(this.table.items[i], 'parcela', i + 1)
        }
        this.$forceUpdate()
      },
      distribuirValores () {
        let fases = ['1', '5']
        fases.forEach((fase) => {
          let quantidade = _.filter(this.table.items, function (i) { return ('' + i.origem) === fase && !_.has(i, 'requisitado') }).length // pega quantidade de items da tabela
          let acum = 0
          let total = (fase === '1' ? this.totais.projeto.fbb : (fase === '5' ? this.totais.projeto.parceiros : 0)) - (_.sumBy(this.table.items, function (f) { return (_.has(f, 'requisitado') && ('' + f.origem) === fase ? f.valor : 0) }))
          let parcela = Math.ceil(total / quantidade)
          if (quantidade > 0 && total > 0) {
            this.table.items.forEach((item) => { // para cada item recalcula o valor de acordo com a fase
              if (('' + item.origem) === fase && !_.has(item, 'requisitado')) {
                if (acum + parcela > total) {
                  let dif = acum + parcela - total
                  item.valor = parcela - dif
                } else {
                  item.valor = parcela
                }
                acum += item.valor
              }
            })
          }
        })
        this.calcularTotais()
        this.$emit('acaoAtualizaSolicitacoes', new Date())
      },
      ehNulo (valor, opcao) {
        return _.isNull(valor) || _.isNaN(valor) || _.isNil(valor) || _.isUndefined(valor) ? opcao : valor
      },
      buscaAdiantamentosConcedidos () {
        this.loading = true
        let vm = this
        axiosLaravel.get('processos/adiantamento/recursos/' + this.propsProposta.id, {entityId: null}).then((response) => {
          // Traz os adiantamento concedidos do projeto
          this.adiantamentosConcedidos = response.data.adiantamentos_concedidos.row
          _.forEach(this.adiantamentosConcedidos, function (concedido) {
            _.forEach(vm.table.items, function (parcela) {
              if (parcela.id === concedido.id_parcela_adiantamento) {
                _.set(parcela, 'requisitado', concedido.requisitado)
                _.set(parcela, 'percentual_comprovado', concedido.percentual_comprovado)
              }
            })
          })
          this.calcularTotais()
          this.loading = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      verificaFase () {
        this.existeFaseFBB = 0
        this.existeFaseParc = 0
        if (!_.isUndefined(this.propsAtividades)) {
          this.propsAtividades.forEach((atividade) => {
            if (atividade.itens_orcamentos) {
              atividade.itens_orcamentos.forEach((item) => {
                if (item) {
                  if (('' + item.origem) === '1' && ('' + item.adiantavel) === '1') {
                    this.existeFaseFBB++
                  }
                  if (('' + item.origem) === '5' && ('' + item.adiantavel) === '1') {
                    this.existeFaseParc++
                  }
                }
              })
            }
          })
        }
        this.$forceUpdate()
      },
      onCancel () {
        this.parcela = {}
        this.showgrid = true
        this.editandoIndex = null
        this.calcularTotais()
      },
      onAdd () {
        this.$validator.validateAll().then((result) => {
          if (result && this.$validator.errors.all().length === 0) {
            if (_.isNull(this.editandoIndex)) {
              this.table.items.push(this.parcela)
            } else {
              this.table.items.splice(this.editandoIndex, 1, this.parcela)
            }
            this.onCancel()
            this.calcularTotais()
            this.$emit('acaoAtualizaSolicitacoes', new Date())
          }
        })
      },
      exclui (row) {
        this.table.items.splice(row.index, 1)
        this.parcela = {}
        this.calcularTotais()
        this.$emit('acaoAtualizaSolicitacoes', new Date())
      },
      reincluir (row) {
        this.table.items.push(row.item)
        this.calcularTotais()
        this.$emit('acaoAtualizaSolicitacoes', new Date())
      },
      edita (row) {
        this.verificaFase
        this.editandoIndex = row.index
        this.parcela = Object.assign({}, row.item)
        this.parcelaTabela = row.item
        this.showgrid = false
      },
      moverLinha (linha, direcao) {
        let itens = _.clone(this.table.items)
        let idxOrigem = linha.index
        let idxDestino = (direcao === 'cima' ? -1 : 1) + idxOrigem
        let itemBkp = itens[idxDestino]
        itens[idxDestino] = itens[idxOrigem]
        itens[idxOrigem] = itemBkp
        this.table.items = itens
        this.numerarParcelas()
        this.$forceUpdate()
      },
      limiteParcela (parcela) {
        let limiteAcrescimo = 0
        if (this.totais.residuo.fbb > 0 || this.totais.residuo.parceiros > 0) {
          let ultimaParcelaLiberada = _.last(_.filter(this.propsParcelas, function (p) {
            return _.has(p, 'requisitado') || p.requisitado > 0
          }))
          if ((_.has(parcela, 'parcela') && parcela.parcela === ultimaParcelaLiberada.parcela + 1) ||
            (!_.has(parcela, 'parcela') && ultimaParcelaLiberada.parcela === this.propsParcelas.length)) {
            limiteAcrescimo = ('' + parcela.origem) === '1' ? this.totais.residuo.fbb : (('' + parcela.origem) === '5' ? this.totais.residuo.parceiros : this.totais.residuo.fbb + this.totais.residuo.parceiros)
          }
        }
        return ((this.parcelaTabela.valor || 0) * (_.isNull(this.editandoIndex) ? 0 : 1)) +
          (('' + parcela.origem) === '1' ? this.totais.restantes.fbb : (('' + parcela.origem) === '5' ? this.totais.restantes.parceiros : this.totais.restantes.misto)) +
          limiteAcrescimo
      },
      etiquetaOrigemRecurso (valor) {
        return _.includes(['FUNDACAO', '1'], '' + valor) ? 'Fundação' : (_.includes(['CONTRAPARTIDA', '2'], '' + valor) ? 'Contrapartida' : (_.includes(['PARCEIRO_ESTRATEGICO', '5'], '' + valor) ? 'Parceiro Estratégico' : (_.includes(['MISTO', '0'], '' + valor) ? 'Misto' : '')))
      },
      ehItemNovo (item) {
        return !_.has(item, 'id') || _.includes(_.get(item, 'id', ''), 'novo') || _.find(_.get(this.processoSolicitacao, 'inclusao', []), ['id', item.id])
      },
      ehItemExcluido (item) {
        return _.includes(_.get(this.processoSolicitacao, 'exclusao', []), item.id)
      },
      modificacaoLinha (item, type) {
        if (!item || type !== 'row') return
        if (('' + this.modoVisualizacaoAlteracoes) === 'DETALHADO') {
          if (this.ehItemNovo(item)) return 'modificacaoInclusao'
          if (this.ehItemExcluido(item)) return 'modificacaoExlusao'
        }
      }
    }
  }
</script>

<style scoped>
  .parcelasAdiantamento .botoesUpDown {
    float: right;
    text-align: center;
    color: silver;
  }
  .parcelasAdiantamento .botoesUpDown i:hover {
    cursor: pointer;
    color: steelblue;
  }

</style>
