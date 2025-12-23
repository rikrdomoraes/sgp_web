<template>
  <div class="box box-widget" >
    <div class="box-header with-border">
      <h3 class="box-title">Cronograma Físico-Financeiro</h3>
    </div>

    <div v-show="loadingShow" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
      <i class="fa fa-refresh fa-spin"></i>
    </div>

    <div class="row" style="overflow:auto;" v-if="totais.aglutinado === 'Sim'">
      <div class="col-md-12 financial-physical-schedule">

        <table class="table table-condensed table-bordered" ref="tabelaCronogramaAglutinado">
          <thead>
          <tr>
            <th>Item</th>
            <th>Tipo</th>
            <th>Quantidade</th>
            <th>Valor Total</th>
            <th>Quantidade a solicitar</th>

            <!-- Titulos referentes ao campo 'quantidadeSolicitada' -->
            <th>Valor a solicitar</th>
            <!--<th v-if="finPhySchSolCtrl.solicitation == 'COUNTERPART'">Economicidade</th>-->

            <th>Quantidade a comprovar</th>

            <!-- Titulos referentes ao campo 'quantityProve' -->
            <th>Valor a comprovar</th>
            <th>Ações</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in itensProjeto">
            <!--Item-->
            <td>{{item.Item_Descricao}}</td>
            <!--Tipo-->
            <td>{{item.Item_Tipo}}</td>
            <!--Quantidade-->
            <td class="text-center">{{item.Qtde_orcado}}</td>
            <!--Valor Total-->
            <td class="text-center">{{item.Valor_orcado | real}}</td>
            <!--Quantidade a solicitar-->
            <td v-if="item.editing === false || !item.editing" class="text-center">{{item.quantidadeSolicitada}}</td>
            <td v-if="item.editing === true" class="text-center"> <input v-model="item.quantidadeSolicitada" name="quantidade a solicitar" class="form-control text-right" type="text">
            </td>
            <!--Valor a Solicitar-->
            <td v-if="item.editing === false || !item.editing" class="text-center">{{item.valorSolicitado | real}}</td>
            <td v-if="item.editing === true" class="text-center"><money v-model="item.valorSolicitado" name="valor a solicitar" class="form-control text-right" type="text"></money>
            </td>
            <!--Quantidade a comprovar-->
            <td v-if="propsEtapa !== 'Solicitação'" class="text-center">{{item.Qtde_orcado - item.quantidadeSolicitada - item.Qtde_liberado || 0}}</td>
            <td v-if="propsEtapa === 'Solicitação'" class="text-center">{{item.Qtde_saldo - (item.quantidadeSolicitada ? item.quantidadeSolicitada : 0)}}</td>
            <!--Valor a comprovar-->
            <td v-if="propsEtapa !== 'Solicitação'" class="text-center">{{item.Valor_orcado - item.valorSolicitado - item.Valor_liberado | real }}</td>
            <td v-if="propsEtapa === 'Solicitação'" class="text-center">{{item.Valor_saldo - (item.valorSolicitado ? item.valorSolicitado : 0) | real }}</td>
            <td class="text-center">
              <i v-if="item.editing === false || !item.editing" v-show="propsEtapa !== 'Autorização'" class="fa fa-edit" @click.prevent="editItem(item, 1)" style="margin-left:5px"></i>
              <i v-if="item.editing === true" v-show="propsEtapa !== 'Autorização'" class="fa fa-check" @click="editItem(item, 2)" style="color: green; margin-left: 5px; cursor: pointer;"></i>
              <!--<i class="fa fa-times" @click="cancelaEdicao(item)"  style="color: red;margin-left:5px; cursor: pointer"-->
                 <!--v-if="item.editing === true"-->
                 <!--uib-tooltip="Cancelar a alteração dos valores dessa linha" tooltip-append-to-body="true"></i>-->
            </td>

          </tr>
          </tbody>
          <tfoot style="font-weight: bold;">
          <tr >
            <td colspan="4" style="border-right: none;">Valor total de recursos contratados: </td>
            <td colspan="4" class="text-right" style="border-left: none;">{{totais.valor_total_contratado | real}}</td>
            <td></td>
          </tr>
          <tr >
            <td colspan="4" bgcolor="#F0F8FF" style="border-right: none;">Valor total da solicitação:	</td>
            <td colspan="4" class="text-right"  bgcolor="#F0F8FF" style="border-left: none;">{{total | real}}</td>
            <td></td>
          </tr>
          <tr >
            <td colspan="4" style="border-right: none;">Saldo restante do projeto:	</td>
            <td colspan="4" class="text-right" style="border-left: none;">{{totais.valor_total_contratado -  total | real}}</td>
            <td></td>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <div class="box-body" v-if="totais.aglutinado === 'Não'">
      <div class="row" style="overflow:auto;">
        <div class="col-md-12 financial-physical-schedule">

          <table class="table table-condensed table-bordered">
            <thead>
            <tr>
              <th width="30%">Item</th>
              <th>Tipo</th>
              <th width="7%">Quantidade</th>
              <th>Valor Total</th>
              <th >Quantidade a solicitar</th>
              <th>Valor a solicitar</th>
              <th width="12%">Quantidade a comprovar</th>
              <th>Valor a comprovar</th>
              <th>Ações</th>
            </tr>
            </thead>
            <tbody v-for="item in itensProjeto">
            <tr style="background-color: rgb(223, 228, 235);">
              <td colspan="9">
                <b>Atividade:</b> {{ item.Atividade_nome }}
              </td>
            </tr>
            <!--Item-->
            <td  style="border-right: 0.5px solid lavender;">{{item.Item}} - {{item.Item_Descricao}}<br>#{{item.Id_item}} {{item.Item_Observacao}}</td>
            <!--Tipo-->
            <td style="border-right: 0.5px solid lavender;">{{item.Item_Tipo}}</td>
            <!--Quantidade-->
            <td class="text-center" style="border-right: 0.5px solid lavender;">{{item.Qtde_orcado}}</td>
            <!--Valor Total-->
            <td class="text-center" style="border-right: 0.5px solid lavender;">{{item.Valor_orcado | real}}</td>
            <!--Quantidade a solicitar-->
            <td v-if="item.editing === false || !item.editing" class="text-center" style="border-right: 0.5px solid lavender;">{{item.quantidadeSolicitada}}</td>
            <td v-if="item.editing === true" class="text-center" style="border-right: 0.5px solid lavender;" > <input v-model="item.quantidadeSolicitada" name="quantidade a solicitar" class="form-control text-right" type="text">
            </td>
            <!--Valor a Solicitar-->
            <td v-if="item.editing === false || !item.editing" class="text-center" style="border-right: 0.5px solid lavender;">{{item.valorSolicitado | real}}</td>
            <td v-if="item.editing === true" class="text-center" style="border-right: 0.5px solid lavender;"><money v-model="item.valorSolicitado" name="valor a solicitar" class="form-control text-right" type="text"></money>
            </td>
            <!--Quantidade a comprovar-->
            <td v-if="propsEtapa !== 'Solicitação'" class="text-center" style="border-right: 0.5px solid lavender;">{{item.Qtde_orcado - item.quantidadeSolicitada - item.Qtde_liberado || 0 }}</td>
            <td v-if="propsEtapa === 'Solicitação'" class="text-center" style="border-right: 0.5px solid lavender;">{{item.Qtde_saldo - (item.quantidadeSolicitada ? item.quantidadeSolicitada : 0)}}</td>
            <!--Valor a comprovar-->
            <td v-if="propsEtapa !== 'Solicitação'" class="text-center" style="border-right: 0.5px solid lavender;">{{item.Valor_orcado - item.valorSolicitado - item.Valor_liberado | real }}</td>
            <td v-if="propsEtapa === 'Solicitação'" class="text-center" style="border-right: 0.5px solid lavender;">{{item.Valor_saldo - (item.valorSolicitado ? item.valorSolicitado : 0) | real }}</td>
            <td class="text-center" style="border-right: 0.5px solid lavender;">
              <i v-if="item.editing === false || !item.editing" v-show="propsEtapa !== 'Autorização'" class="fa fa-edit" @click.prevent="editItem(item, 1)" style="margin-left:5px"></i>
              <i v-if="item.editing === true" v-show="propsEtapa !== 'Autorização'" class="fa fa-check" @click="editItem(item, 2)" style="color: green; margin-left: 5px; cursor: pointer;"></i>
              <!--<i class="fa fa-times" @click="cancelaEdicao(item)"  style="color: red;margin-left:5px; cursor: pointer"-->
                 <!--v-if="item.editing === true"-->
                 <!--uib-tooltip="Cancelar a alteração dos valores dessa linha" tooltip-append-to-body="true"></i>-->
            </td>
            </tbody>
            <tfoot style="font-weight: bold;">
            <tr >
              <td colspan="4" style="border-right: none;">Valor total de recursos contratados: </td>
              <td colspan="4" class="text-right" style="border-left: none;">{{totais.valor_total_contratado | real}}</td>
              <td></td>
            </tr>
            <tr >
              <td colspan="4" bgcolor="#F0F8FF" style="border-right: none;">Valor total da solicitação:	</td>
              <td colspan="4" class="text-right"  bgcolor="#F0F8FF" style="border-left: none;">{{ valorTotalSolicitacao | real }}</td>
              <td></td>
            </tr>
            <tr >
              <td colspan="4" style="border-right: none;">Saldo restante do projeto:	</td>
              <td colspan="4" class="text-right" style="border-left: none;">{{ totais.valor_total_contratado - valorTotalSolicitacao | real }}</td>
              <td></td>
            </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div class="col-md-12 financial-physical-schedule">
        <table class="table table-condensed table-striped table-bordered" style="min-width:750px">
          <thead>
          <tr>
            <th>Recurso</th>
            <th>Fase</th>
            <th>Valor total da fase</th>
            <th>Valor total de adiantamento por fase</th>
            <th>Valor total já adiantado</th>
            <th>Saldo de adiantamento restante por fase</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="totalFBB  > 0 || totalFaseFBB  > 0">
            <td>Fundação</td>
            <td class="text-center">1</td>
            <td class="text-right">{{ totalFBB | real }}</td>
            <td class="text-right">{{ totalFaseFBB | real }}</td>
            <td class="text-right">{{ adiantadoFaseFBB | real }}</td>
            <td  class="text-right">{{ saldoFaseFBB  | real }}</td>
          </tr>
          <tr v-if="totalPAR  > 0 || totalFasePAR > 0">
            <td>Parceiro Estratégico</td>
            <td class="text-center">5</td>
            <td class="text-right">{{ totalPAR | real }}</td>
            <td class="text-right">{{ totalFasePAR  | real }}</td>
            <td class="text-right">{{ adiantadoFasePAR | real }}</td>
            <td class="text-right">{{ saldoFasePAR  | real }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div> <!-- ./box-body -->
  </div> <!-- ./box -->

</template>

<script>
  export default {
    name: 'cronograma-solicitacao-prestacaocontas',
    data () {
      return {
        itemsProjetoIgualNota: [],
        itensProjeto: [],
        totais: []
      }
    },
    props: ['propsNota', 'propsProjeto', 'propsEtapa', 'propsValidacao'],
    computed: {
      saldoFinanceiroProjeto () {
        return this.itensProjeto.reduce((total, item) => total + (item.totalValue - item.totalvalorSolicitadoed), 0)
      },
      valorTotalSolicitacao () {
        let total = 0
        if (this.itensProjeto) {
          this.itensProjeto.forEach(item => {
            if (item.valorSolicitado) {
              total += item.valorSolicitado
            }
          })
        }
        return total.toFixed(2)
      }
    },
    watch: {
      propsProjeto () {
        this.buscaItensProjetoBackEnd()
      }
    },
    methods: {
      cancelaEdicao (item) {
        if (item.quantidadeSolicitada === 0 || item.quantidadeSolicitada === '0' || item.quantidadeSolicitada === '') {
          this.$snotify.error('Quantidade solicitada não pode ser 0!')
          return
        }
        if (item.valorSolicitado === 0 || item.valorSolicitado === '0' || item.valorSolicitado === '') {
          this.$snotify.error('Valor solicitado não pode ser 0!')
          return
        }
        if (item.quantidadeSolicitada > item.Qtde_saldo) {
          this.$snotify.error('Quantidade solicitada maior que o disponível!')
          return
        }
        if (item.valorSolicitado > item.Valor_saldo) {
          this.$snotify.error('Valor solicitado maior que o disponível!')
          return
        }
        item.editing = false
        item = []
        this.$forceUpdate()
      },
      editItem (item, parm) {
        if (parm === 2) {
          if (item.quantidadeSolicitada === 0 || item.quantidadeSolicitada === '0' || item.quantidadeSolicitada === '') {
            this.$snotify.error('Quantidade solicitada não pode ser 0!')
            return
          }
          if (item.valorSolicitado === 0 || item.valorSolicitado === '0' || item.valorSolicitado === '') {
            this.$snotify.error('Valor solicitado não pode ser 0!')
            return
          }
        }
        this.total = 0
        if (this.propsEtapa === 'Solicitação') {
          if (item.quantidadeSolicitada > item.Qtde_saldo) {
            this.$snotify.error('Quantidade solicitada maior que o disponível!')
            return
          }
          if (item.valorSolicitado > item.Valor_saldo) {
            this.$snotify.error('Valor solicitado maior que o disponível!')
            return
          }
          if (item.quantidadeSolicitada === 0 || item.quantidadeSolicitada === '0' || item.quantidadeSolicitada === '') {
            this.$snotify.error('Quantidade solicitada tem que ser maior que zero!')
            return
          }
          if (item.valorSolicitado === 0 || item.valorSolicitado === '') {
            this.$snotify.error('Valor solicitado tem que ser maior que zero!')
            return
          }
        }
        if (!item.editing) {
          item.editing = true
        } else {
          item.editing = !item.editing
          if (!_.hasIn(this.propsNota, 'receiptItems')) { // se ainda não tem receiptItems na nota...
            this.propsNota.receiptItems = [] // Cria o array
            this.propsNota.receiptItems.push(item) // adiciona o item no array
          }
          if (this.propsNota.receiptItems.indexOf(item) === -1) {
            this.propsNota.receiptItems.push(item)
          } // Se o item não esta no receiptItems adiciona
        }
        if (this.propsNota.receiptItems) {
          for (var j = 0; j < this.propsNota.receiptItems.length; j++) {
            if (this.propsNota.receiptItems[j].valorSolicitado > 0) {
              this.total = this.total + this.propsNota.receiptItems[j].valorSolicitado
            }
          }
        }
        this.$forceUpdate()
      },
      async buscaItensProjetoBackEnd () {
        if (!this.propsProjeto.Id_projeto) {
          this.propsProjeto.Id_projeto = this.propsProjeto.id
        }
        this.buscaRecursos()
        let documento = 0

        if (this.propsNota.id) {
          documento = this.propsNota.id
        }
        this.itensProjeto = []
        this.loadingShow = true
        this.$forceUpdate()
        this.$snotify.async('Carregando cronograma do projeto. Por favor, aguarde...', {timeout: 0})
        let idProposta = _.isUndefined(this.propsProjeto.Id_proposta) ? this.propsProjeto.fk_proposta : this.propsProjeto.Id_proposta
        await axiosLaravel.post('processos/cronograma/projeto/', {'proposta': idProposta, 'processo': 'PRESTACAO_DE_CONTAS', 'aglutinado': 'Não', 'documento': documento}).then((response) => {
          this.itensProjeto = response.data.itens
          this.propsValidacao.aglutinado = response.data.totais.aglutinado
          this.$forceUpdate()
          this.loadingShow = false // desbloquea a tela
          if (this.propsEtapa !== 'Solicitação') {
            this.itensProjeto = this.itensProjeto.filter((item) => {
              return item.Valor_solicitado > 0
            })
          }
          let projFiltro = []
          this.totais = response.data.totais
          if (this.propsEtapa) {
            for (let i = 0; i < this.itensProjeto.length; i++) {
              for (let j = 0; j < this.propsNota.itens_liberados.length; j++) {
                if (this.itensProjeto[i].Id_item === this.propsNota.itens_liberados[j].itens_orcamentos[0].id) {
                  projFiltro[j] = this.itensProjeto[i]
                }
              }
            }
            if (this.totais.aglutinado === 'Não') {
              this.itensProjeto = _.cloneDeep(projFiltro)
            }
          }
          // this.$forceUpdate()
          // this.preencheCronograma()
          this.itensProjeto = this.itensProjeto.map((item) => {
            item.valorSolicitado = item.Valor_solicitado
            item.quantidadeSolicitada = item.Qtde_solicitado
            return item
          })
          this.$forceUpdate() // força o update da tela para não ter problema
          this.$snotify.clear()
          this.$snotify.success('Cronograma carregado com sucesso!')
        })
          .catch((error) => {
            this.$snotify.clear()
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      buscaRecursos () {
        this.totalFBB = 0
        this.totalFaseFBB = 0
        this.adiantadoFaseFBB = 0
        this.saldoFaseFBB = 0
        this.totalPAR = 0
        this.totalFasePAR = 0
        this.adiantadoFasePAR = 0
        this.saldoFasePAR = 0
        axiosLaravel.get('processos/adiantamento/recursos/' + this.propsProjeto.Id_proposta).then((response) => {
          this.resultado = response.data.parcels.row
          for (var i = 0; i < this.resultado.length; i++) {
            if (this.resultado[i].resourceSource === 'FUNDACAO') {
              this.totalFBB = this.totalFBB + this.resultado[i].totalValue
              this.totalFaseFBB = this.totalFaseFBB + this.resultado[i].totalValueAdvance
              this.adiantadoFaseFBB = this.adiantadoFaseFBB + this.resultado[i].totalValueAdvanceRequested
              this.saldoFaseFBB = this.saldoFaseFBB + this.resultado[i].balanceAdvanceAccumulated
            }
            if (this.resultado[i].resourceSource === 'PARCEIRO_ESTRATEGICO') {
              this.totalPAR += parseFloat(this.resultado[i].totalValue)
              this.totalFasePAR += parseFloat(this.resultado[i].totalValueAdvance)
              this.adiantadoFasePAR += parseFloat(this.resultado[i].totalValueAdvanceRequested)
              this.saldoFasePAR += parseFloat(this.resultado[i].balanceAdvanceAccumulated)
            }
          }
          this.$forceUpdate()
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      preencheCronograma () {
        var i = 0
        var j = 0
        if (!_.isUndefined(this.propsNota.receiptItems)) {
          this.itensProjeto.forEach((item, index) => {
            if (item.Item === this.propsNota.receiptItems[0].Item) {
              this.itensProjeto[index] = this.propsNota.receiptItems[0]
              this.$forceUpdate()
            }
          })
        }
        if (this.propsNota.itens_liberados) {
          for (i = 0; i < this.itensProjeto.length; i++) {
            for (j = 0; j < this.propsNota.itens_liberados.length; j++) {
              if (this.propsNota.itens_liberados[j].itens_orcamentos[0].fk_itens === this.itensProjeto[i].Item) {
                this.itensProjeto[i].quantidadeSolicitada = this.propsNota.itens_liberados[j].quantidade
                this.itensProjeto[i].valorSolicitado = this.propsNota.itens_liberados[j].valor
                if (_.isUndefined(this.propsNota.receiptItems)) { // Se não esta definido receiptItems na chave adiciona com array limpo
                  this.propsNota.receiptItems = []
                }
                this.propsNota.receiptItems.push(this.itensProjeto[i])
              }
            }
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
