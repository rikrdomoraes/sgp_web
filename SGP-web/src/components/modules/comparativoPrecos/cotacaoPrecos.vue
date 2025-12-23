<template>
    
    <div class="w-100">

      <!-- Banco de Preços -->
      <bancoPrecos v-if="abrirBancoPrecos" :gravaSelecaoItens="gravaSelecaoItens" :toggleBancoPrecos="toggleBancoPrecos" />

      <!-- Calculo dos Itens Selecionados -->
      <div class="box-body column centered-start cotacao-itens-container" v-if="!abrirBancoPrecos">
        <div class="row-flex centered-start cotacao-header-container">
          <i class="fa fa-dollar"></i> <b>Cotação de Preços</b>
        </div>
        
        <div class="column centered-start cotacao-main-container">
        <div class="column all-centered cotacao-detalhamento-item" v-if="abrirDetalheItem" ref="detalhamentoContainer">
          <detalheItemLicitacao :itemLicitacao="itemDetalheSelecionado" :toggleDetalhe="toggleDetalhe"></detalheItemLicitacao>
        </div>
        <b-container fluid class="w-100">  
          <div class="column centered-start cotacao-adicionar-container">
            <div class="row centered-start w-100">
              <g-button-ujarak color="primary" @click.native="toggleBancoPrecos(true)"><i class="fa fa-shopping-cart" aria-hidden="true"></i>  Abrir Banco de Cotações  </g-button-ujarak>
              <g-button-ujarak color="warning" @click.native="limparSelecao()"><i class="fa fa-trash" aria-hidden="true"></i> Limpar </g-button-ujarak>
            </div>
          </div>

          <div class="column all-start cotacao-input-container" ref="nomeItemCotacao">
            <label class="f-required">Item de cotação:</label>
            <input v-model="nomeItem" type="text" class="form-control" :class="errorInput ? 'error-input' : ''" placeholder="Digite o nome do item a ser cotado, ref. histórico do cronograma." @input="errorInput = false">
          </div>
  
          <div v-show="loading.show" class="overlay" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;display: none; background: rgba(255, 255, 255, 0.7); z-index: 1000">
              <i class="fa fa-refresh fa-spin" style="top: 50%; left: 50%; position: absolute; font-size: 30px"></i>
          </div>

          <div class="column centered-start cotacao-titulo-container">
            <div class="cotacao-titulo">
              <i class="fa fa-check-circle"></i> Itens Selecionados
            </div>
            <div class="row-flex centered-between cotacao-subtitulo">
              <div>Confira os ({{ table.items.length }}) itens que <b>estão sendo utilizados</b> para compor a cotação</div>
            </div>
          </div>

          <b-table
                  show-empty
                  stacked="md"
                  striped
                  :bordered="table.bordered"
                  :items="table.items"
                  :hover="table.hover"
                  :fields="table.fields"
                  :filter="table.filter"
                  :current-page="table.currentPage"
                  :per-page="table.perPage"
                  :sort-by.sync="table.sortBy"
                  :sort-desc.sync="table.sortDesc"
                  empty-text="Nenhum registro encontrado"
          >
            <template  slot="actions" scope="row">
                    <g-button-ujarak color="primary" @click.native="detalharItem(row.item)"><i class="fa fa-eye" aria-hidden="true"></i></g-button-ujarak>
                </template>
                <template  slot="descricao_item" scope="row">
                  <div class="row-flex all-start banco-precos-table-descricao-container">
                    <div :title="row.value" class="banco-precos-table-descricao">
                      [{{ row.item.id }}] {{row.value}}
                    </div>
                  </div>
                </template>
                <template  slot="valor_item" scope="row">
                    {{ row.value | real }}
                </template>
                <template  slot="selecionado" scope="row">
                    <input v-model="row.item.selecionado" type="checkbox">
                </template>
                <template  slot="data_resultado_licitacao" scope="row">
                    {{ row.value !== '' ? moment.utc(row.value).format('MM/YYYY') : '-' }}
                </template>
                <template  slot="sigla_uf" scope="row">
                    {{ row.value !== '0' ? row.value : '-' }}
                </template>
          </b-table>
          <b-row>
            <b-col md="12" class="my-1" right>
              <b-pagination :total-rows="table.items.length" :per-page="table.perPage" v-model="table.currentPage" class="" />
            </b-col>
          </b-row>
        </b-container>

        <b-container fluid class="w-100" v-if="tableSaneados.items.length > 0">  
          <div class="column centered-start cotacao-titulo-container">
            <div class="cotacao-titulo">
              <i class="fa fa-recycle"></i> Itens Saneados
            </div>
            <div class="row-flex centered-between cotacao-subtitulo">
              <div>Confira os ({{ tableSaneados.items.length }}) itens que foram <b>saneados</b> do cálculo da cotação</div>
            </div>
          </div>

          <b-table
                  show-empty
                  stacked="md"
                  striped
                  :bordered="tableSaneados.bordered"
                  :items="tableSaneados.items"
                  :hover="tableSaneados.hover"
                  :fields="tableSaneados.fields"
                  :filter="tableSaneados.filter"
                  :current-page="tableSaneados.currentPage"
                  :per-page="tableSaneados.perPage"
                  :sort-by.sync="tableSaneados.sortBy"
                  :sort-desc.sync="tableSaneados.sortDesc"
                  empty-text="Nenhum registro encontrado"
          >
            <template  slot="actions" scope="row">
                    <g-button-ujarak color="primary" @click.native="detalharItem(row.item)"><i class="fa fa-eye" aria-hidden="true"></i></g-button-ujarak>
                </template>
                <template  slot="descricao_item" scope="row">
                  <div class="row-flex all-start">
                    <div :title="row.value" class="banco-precos-table-descricao">
                      [{{ row.item.id }}] {{row.value}}
                    </div>
                  </div>
                </template>
                <template  slot="valor_item" scope="row">
                    {{ row.value | real }}
                </template>
                <template  slot="diagnostico" scope="row">
                  <div class="cotacao-saneado-row">
                    <i :class="'fa ' + (parseFloat(row.item.valor_item) > calculoAmostral.LS ? 'fa-arrow-up' : ' fa-arrow-down')"></i> {{ parseFloat(row.item.valor_item) > calculoAmostral.LS ? 'Acima do Limite Superior' : 'Abaixo do Limite Inferior' }}
                  </div>
                </template>
          </b-table>
          <b-row>
            <b-col md="12" class="my-1" right>
              <b-pagination :total-rows="tableSaneados.items.length" :per-page="tableSaneados.perPage" v-model="tableSaneados.currentPage" class="" />
            </b-col>
          </b-row>
        </b-container>

        <b-container fluid class="w-100" v-if="tableContaminados.items.length > 0">  
          <div class="column centered-start cotacao-titulo-container">
            <div class="cotacao-titulo">
              <i class="fa fa-warning"></i> Itens contaminados
            </div>
            <div class="row-flex centered-between cotacao-subtitulo">
              <div>Confira os ({{ tableContaminados.items.length }}) itens que foram <b>removidos</b> do cálculo da cotação por discrepância muito grande de valor</div>
            </div>
          </div>

          <b-table
                  show-empty
                  stacked="md"
                  striped
                  :bordered="tableContaminados.bordered"
                  :items="tableContaminados.items"
                  :hover="tableContaminados.hover"
                  :fields="tableContaminados.fields"
                  :filter="tableContaminados.filter"
                  :current-page="tableContaminados.currentPage"
                  :per-page="tableContaminados.perPage"
                  :sort-by.sync="tableContaminados.sortBy"
                  :sort-desc.sync="tableContaminados.sortDesc"
                  empty-text="Nenhum registro encontrado"
          >
            <template  slot="actions" scope="row">
                    <g-button-ujarak color="primary" @click.native="detalharItem(row.item)"><i class="fa fa-eye" aria-hidden="true"></i></g-button-ujarak>
                </template>
                <template  slot="descricao_item" scope="row">
                  <div class="row-flex all-start banco-precos-table-descricao-container">
                    <div :title="row.value" class="banco-precos-table-descricao">
                      [{{ row.item.id }}] {{row.value}}
                    </div>
                  </div>
                </template>
                <template  slot="valor_item" scope="row">
                    {{ row.value | real }}
                </template>
                <template  slot="diagnostico" scope="row">
                  <div class="cotacao-contaminado-row">
                    <i class="fa fa-warning" aria-hidden="true"></i> {{ parseFloat(row.item.valor_item) > calculoAmostral.LS ? 'Muito Acima do Limite Superior' : 'Abaixo do Limite Inferior' }}
                  </div>
                </template>
          </b-table>
          <b-row>
            <b-col md="12" class="my-1" right>
              <b-pagination :total-rows="tableContaminados.items.length" :per-page="tableContaminados.perPage" v-model="tableContaminados.currentPage" class="" />
            </b-col>
          </b-row>
        </b-container>

        <b-container fluid class="w-100" v-if="tableRemovidosManual.items.length > 0">  
          <div class="column centered-start cotacao-titulo-container">
            <div class="cotacao-titulo">
              <i class="fa fa-exclamation-circle"></i> Itens Removidos Manualmente
            </div>
            <div class="row-flex centered-between cotacao-subtitulo">
              <div>Confira os ({{ tableRemovidosManual.items.length }}) itens que foram <b>removidos manualmente</b> pelo usuário. (Pendente de Validação)</div>
            </div>
          </div>

          <b-table
                  show-empty
                  stacked="md"
                  striped
                  :bordered="tableRemovidosManual.bordered"
                  :items="tableRemovidosManual.items"
                  :hover="tableRemovidosManual.hover"
                  :fields="tableRemovidosManual.fields"
                  :filter="tableRemovidosManual.filter"
                  :current-page="tableRemovidosManual.currentPage"
                  :per-page="tableRemovidosManual.perPage"
                  :sort-by.sync="tableRemovidosManual.sortBy"
                  :sort-desc.sync="tableRemovidosManual.sortDesc"
                  empty-text="Nenhum registro encontrado"
          >
            <template  slot="actions" scope="row">
                    <g-button-ujarak color="primary" @click.native="detalharItem(row.item.item)"><i class="fa fa-eye" aria-hidden="true"></i></g-button-ujarak>
                </template>
                <template  slot="item.descricao_item" scope="row">
                  <div class="row-flex all-start banco-precos-table-descricao-container">
                    <div :title="row.value" class="banco-precos-table-descricao">
                      [{{ row.item.item.id }}] {{row.value}}
                    </div>
                  </div>
                </template>
                <template  slot="item.valor_item" scope="row">
                    {{ row.value | real }}
                </template>
                <template  slot="justificativa" scope="row">
                  <div class="row-flex all-centered cotacao-removido-manual-row">
                    <i class="fa fa-warning" aria-hidden="true"></i> {{ row.value }}
                  </div>
                </template>
          </b-table>
          <b-row>
            <b-col md="12" class="my-1" right>
              <b-pagination :total-rows="tableRemovidosManual.items.length" :per-page="tableRemovidosManual.perPage" v-model="tableRemovidosManual.currentPage" class="" />
            </b-col>
          </b-row>
        </b-container>
        
        </div>
        
  
        <div class="row-flex centered-start cotacao-resumo-container" v-if="universoAmostral.length > 0">
          <i class="fa fa-dollar"></i> <b>Resumo da Cotação</b>
        </div>

        <div class="column all-centered cotacao-calculo-container" v-if="universoAmostral.length > 0">          
          <div class="row-flex all-centered cotacao-calculo-tabela-container">
            <div class="row-flex all-centered cotacao-tabelas">
              <tr class="column centered-start cotacao-tabela">
                <td class="cotacao-tabela-header">Variáveis</td>
                <td class="cotacao-tabela-linha">Média</td>
                <td class="cotacao-tabela-linha">Desvio Padrão (DP):</td>
                <td class="cotacao-tabela-linha">Coeficiente de Variação (CV):</td>
                <td class="cotacao-tabela-linha">Limite Superior (LS):</td>
                <td class="cotacao-tabela-linha">Limite Inferior (LI):</td>
              </tr>
              <tr class="column centered-start cotacao-tabela">
                <td class="cotacao-tabela-header">Universo Amostral Selecionado</td>
                <td class="cotacao-tabela-linha">{{calculoAmostral.media | real}}</td>
                <td class="cotacao-tabela-linha">{{calculoAmostral.DP | real}}</td>
                <td class="cotacao-tabela-linha">{{calculoAmostral.CV}}%</td>
                <td class="cotacao-tabela-linha">{{calculoAmostral.LS | real}}</td>
                <td class="cotacao-tabela-linha">{{calculoAmostral.LI | real}}</td>
              </tr>
              <tr class="column centered-start cotacao-tabela">
                <td class="cotacao-tabela-header">Universo Amostral Saneado</td>
                <td class="cotacao-tabela-linha"><b>{{calculoFinal.media | real}} (Média Saneada)</b></td>
                <td class="cotacao-tabela-linha">-</td>
                <td class="cotacao-tabela-linha"><b>{{calculoFinal.CV}}% (CV Saneado)*</b></td>
                <td class="cotacao-tabela-linha">-</td>
                <td class="cotacao-tabela-linha">-</td>
              </tr>
            </div>

            <div class="column all-centered cotacao-indicativo">
              <div class="column all-centered cotacao-resumo">
                <div class="row-flex centered-start cotacao-titulo">
                  <i class="fa fa-map-pin"></i> Resumo:
                </div>

                <div class="column all-end resumo-container">
                  <div>
                    <b>{{table.items.length + tableSaneados.items.length}} </b> Itens Encontrados
                  </div>
                  <div>
                    <b>{{tableSaneados.items.length}} </b> Itens Saneados
                  </div>
                  <div>
                    <b>{{table.items.length}} </b> Itens Cotados
                  </div>
                  <div>
                    <b>{{calculoFinal.CV}}% </b> Coeficiente de Variação
                  </div>
                </div>

                <div v-if="calculoFinal.CV <= 25 && calculoFinal.CV !== 0" class="row-flex all-centered diagnostico-card diagnostico-ok">
                  <i class="fa fa-thumbs-up"></i> CV calculado indica razoável homogeneização do Valor.
                </div>

                <div v-if="calculoFinal.CV > 25" class="row-flex all-centered diagnostico-card diagnostico-atencao">
                  <i class="fa fa-exclamation-circle"></i> O CV calculado indica baixa homogeneização do Valor, atenção. Sujeito a análise.
                </div>
              </div>
            </div>


          </div>
          <div class="row-flex centered-between cotacao-media-saneada-container">
            Preço referência da Amostra (Média Saneada):
            <span>
              {{ calculoFinal.media | real }}
            </span>
          </div>

          <div class="row-flex all-end w-100"><i>*CV menor que 25% indica razoável homogeneidade.</i></div>

        </div>
  
       <div class="row-flex centered-start w-100 gap-5 button-cotacao-container">
        <g-button-ujarak color="success" @click.native="salvarCotacaoItem()"><i class="fa fa-save" aria-hidden="true"></i> Salvar Cotação de Item </g-button-ujarak>
        <g-button-ujarak color="error" @click.native="toggleAdicionarItem(false)"><i class="fa fa-close" aria-hidden="true"></i> Cancelar </g-button-ujarak>
       </div>

     </div>
    </div>
 </template>
   
 <script>
 import { mapGetters } from 'vuex'
 import moment from 'moment'
 import bancoPrecos from './bancoPrecos.vue'
 import detalheItemLicitacao from './detalheItemLicitacao.vue'
 export default {
   name: 'cotacaoItens',
   components: {
     bancoPrecos,
     detalheItemLicitacao
   },
   data () {
     return {
       moment: moment,
       errorInput: false,
       nomeItem: '',
       loading: {
         show: false
       },
       table: {
         items: [],
         filter: null,
         hover: true,
         bordered: true,
         currentPage: 1,
         perPage: 10,
         sortBy: 'valor_item',
         sortDesc: true,
         sortDirection: 'desc',
         fields: [
             { key: 'actions', label: 'Detalhe', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'descricao_item', label: 'Item', sortable: true, thStyle: 'text-align: left', class: 'text-left' },
             { key: 'quantidade_item_aprovado', label: 'QTD', sortable: true, thStyle: 'text-align: left', class: 'text-left' },
             { key: 'sigla_uf', label: 'UF', sortable: true, thStyle: 'text-align: center', class: 'text-right' },
             { key: 'valor_item', label: 'Valor Unitário', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'data_resultado_licitacao', label: 'Data', thStyle: 'text-align: center', class: 'text-center' }
         ]
       },
       tableSaneados: {
         items: [],
         filter: null,
         hover: true,
         bordered: true,
         currentPage: 1,
         perPage: 10,
         sortBy: 'valor_item',
         sortDesc: true,
         sortDirection: 'desc',
         fields: [
             { key: 'actions', label: 'Detalhe', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'descricao_item', label: 'Item', sortable: true, thStyle: 'text-align: left', class: 'text-left' },
             { key: 'valor_item', label: 'Valor Unitário', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'diagnostico', label: 'Diagnóstico', sortable: true, thStyle: 'text-align: center', class: 'text-center' }
         ]
       },
       tableContaminados: {
         items: [],
         filter: null,
         hover: true,
         bordered: true,
         currentPage: 1,
         perPage: 10,
         sortBy: 'valor_item',
         sortDesc: true,
         sortDirection: 'desc',
         fields: [
             { key: 'actions', label: 'Detalhe', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'descricao_item', label: 'Item', sortable: true, thStyle: 'text-align: left', class: 'text-left' },
             { key: 'valor_item', label: 'Valor Unitário', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'diagnostico', label: 'Diagnóstico', sortable: true, thStyle: 'text-align: center', class: 'text-center' }
         ]
       },
       tableRemovidosManual: {
         items: [],
         filter: null,
         hover: true,
         bordered: true,
         currentPage: 1,
         perPage: 10,
         sortBy: 'valor_item',
         sortDesc: true,
         sortDirection: 'desc',
         fields: [
             { key: 'actions', label: 'Detalhe', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'item.descricao_item', label: 'Item', sortable: true, thStyle: 'text-align: left', class: 'text-center' },
             { key: 'item.valor_item', label: 'Valor Unitário', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'responsavel', label: 'Responsável', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'justificativa', label: 'Justificativa', sortable: true, thStyle: 'text-align: left', class: 'text-left' }
         ]
       },
       universoAmostral: [],
       universoAmostralFinal: [],
       universoAmostralSaneado: [],
       universoAmostralContaminado: [],
       remocaoManual: [],
       abrirBancoPrecos: true,
       calculoAmostral: {
         media: 0,
         DP: 0,
         CV: 0,
         LS: 0,
         LI: 0
       },
       calculoFinal: {
         media: 0,
         DP: 0,
         CV: 0,
         LS: 0,
         LI: 0
       },
       abrirDetalheItem: false,
       itemDetalheSelecionado: []
     }
   },
   props: {
     toggleAdicionarItem: Function,
     adicionarItem: Function
   },
   computed: {
     ...mapGetters([
       'usuarioLogado'
     ])
   },
   watch: {
   },
   mounted: function () {
   },
   methods: {
     detalharItem (item) {
       console.log(item)
       this.itemDetalheSelecionado = item
       setTimeout(() => this.$refs.detalhamentoContainer.scrollIntoView({ behavior: 'smooth' }), 100)
       this.toggleDetalhe(true)
     },
     toggleDetalhe (valor) {
       this.abrirDetalheItem = valor
     },
     toggleBancoPrecos (valor) {
       console.log('toggle banco precos')
       if (valor && this.universoAmostral.length > 0) {
         this.$dialog.confirm('Se você fizer uma nova pesquisa no banco de cotações e clicar em <b>Utilizar Resultado</b> a COTAÇÃO anterior será <b>sobreescrita</b>. Continua?',
          {html: true, animation: 'fade', customClass: 'avisoAlerta'})
          .then(dialog => {
            console.log(this.abrirBancoPrecos)
            this.abrirBancoPrecos = valor
            console.log(this.abrirBancoPrecos)
              .catch((error) => {
                console.log(error)
                return
              })
          })
       } else {
         this.abrirBancoPrecos = valor
       }
     },
     gravaSelecaoItens (itens, definicao, remocaoManual) {
       this.limpar()
       this.universoAmostral = itens
       this.nomeItem = definicao
       this.table.items = this.universoAmostral
       this.remocaoManual = remocaoManual
       this.tableRemovidosManual.items = this.remocaoManual
       this.calcularAmostra()
     },
     calcularAmostra () {
       // Faz o calculo inicial do Universo Amostral Selecionado no banco de preços
       this.calcularVariaveis(this.universoAmostral, this.calculoAmostral)
       // Remove Limites Superiores e Inferiores do Universo Amostral e coloca em UniversoAmostralFinal
       this.removerLimites(this.universoAmostral)
       // Atualiza Tabelas
       this.atualizarTabelas()
     },
     calcularVariaveis (universo, resultado) {
       let amostra = universo.map(item => parseFloat(item.valor_item))
       let n = amostra.length
       let media = amostra.reduce((a, b) => a + b) / n
       let variancia = amostra
        .map(x => Math.pow(x - media, 2))
        .reduce((a, b) => a + b) / (n - 1)
       let desvioPadrao = Math.sqrt(variancia)
       let coeficienteVariacao = (desvioPadrao.toFixed(2) / media.toFixed(2)) * 100
       let limiteSuperior = media + desvioPadrao
       let limiteInferior = Math.abs(media - desvioPadrao)
       resultado.media = media.toFixed(2)
       resultado.DP = desvioPadrao.toFixed(2)
       resultado.CV = coeficienteVariacao.toFixed(2)
       resultado.LS = limiteSuperior.toFixed(2)
       resultado.LI = limiteInferior.toFixed(2)
      //  console.log('N', n)
      //  console.log('Media', media.toFixed(2))
      //  console.log('variancia', variancia.toFixed(2))
      //  console.log('DP', desvioPadrao.toFixed(2))
      //  console.log('CV', coeficienteVariacao.toFixed(2))
      //  console.log('LS', limiteSuperior.toFixed(2))
      //  console.log('LI', limiteInferior.toFixed(2))
     },
     removerLimites (amostra) {
       let LS = this.calculoAmostral.LS
       let LI = this.calculoAmostral.LI
       this.universoAmostralFinal = []
       this.universoAmostralSaneado = []
       amostra.forEach(item => {
        //  console.log(parseFloat(item.valor_item), LS, LI)
         if (parseFloat(item.valor_item) <= LS && parseFloat(item.valor_item) >= LI) {
           this.universoAmostralFinal.push(item)
         } else {
           this.universoAmostralSaneado.push(item)
         }
       })
       console.log(this.universoAmostralFinal)
       // Caso não tenha nenhum valor no array, significa que existe um item de valor muito alto está contaminando a amostra
       if (this.universoAmostralFinal.length <= 1) {
         this.removeMaiorValor()
         return
       }
       // Remover o item com o maior valor e resetar o calculo
       this.calcularVariaveis(this.universoAmostralFinal, this.calculoFinal)
     },
     removeMaiorValor () {
       // Reseta o calculo
       let indiceMaiorValor = this.universoAmostral.reduce((maxIndex, item, index, array) => parseFloat(item.valor_item) > parseFloat(array[maxIndex].valor_item) ? index : maxIndex, 0)
       this.universoAmostralContaminado.push(this.universoAmostral[indiceMaiorValor])
       this.universoAmostral.splice(indiceMaiorValor, 1)
       this.calcularAmostra()
     },
     atualizarTabelas () {
       this.table.items = this.universoAmostralFinal
       this.tableSaneados.items = this.universoAmostralSaneado
       this.tableContaminados.items = this.universoAmostralContaminado
       this.$forceUpdate()
     },
     limparSelecao () {
       this.$dialog.confirm('Deseja limpar a pesquisa? A referência dos itens será <b>Perdida</b>. Continuar?',
          {html: true, animation: 'fade', customClass: 'avisoAlerta'})
          .then(dialog => {
            this.limpar()
              .catch((error) => {
                console.log(error)
                return
              })
          })
     },
     limpar () {
       this.nomeItem = ''
       this.table.items = []
       this.tableSaneados.items = []
       this.tableContaminados.items = []
       this.universoAmostral = []
       this.universoAmostralFinal = []
       this.universoAmostralSaneado = []
       this.universoAmostralContaminado = []
       this.abrirBancoPrecos = false
       this.calculoAmostral = {
         media: 0,
         DP: 0,
         CV: 0,
         LS: 0,
         LI: 0
       }
       this.calculoFinal = {
         media: 0,
         DP: 0,
         CV: 0,
         LS: 0,
         LI: 0
       }
     },
     salvarCotacaoItem () {
       if (this.universoAmostralFinal.length <= 0) {
         this.$snotify.error('Atenção, pesquise o item de cotação antes de concluir. Ou clique em cancelar e cadastre manualmente uma cotação.')
         return
       }
       if (this.nomeItem === '') {
         this.$snotify.error('Atenção, cadastre o nome do item de cotação antes de continuar.')
         this.errorInput = true
         this.$refs.nomeItemCotacao.scrollIntoView({ behavior: 'smooth' })
         return
       }
       // Grava o universo amostral e grava o valor da média saneada
       this.adicionarItem(this.universoAmostralFinal, this.universoAmostralSaneado, this.universoAmostralContaminado, this.calculoFinal.media, this.nomeItem, this.calculoFinal.CV, this.calculoAmostral, this.calculoFinal, this.remocaoManual)
       this.toggleAdicionarItem(false)
     }
   }
 }
 </script>
 <style>
   .cotacao-dialog {
    z-index: 199999 !important;
    background-color: red !important;
    border: 10px solid red;
  }
 </style>
   
 <style scoped>
    .cotacao-itens-container {
      position: relative;
        overflow: auto;
        width: 100%;
        max-height: 800px;
        border-radius: 10px;
        background-color: #ebebeb;
        padding: 10px;
    }
    .cotacao-adicionar-container {
      gap: 10px;
      margin-bottom: 20px;
    }

    .cotacao-main-container {
      width: 100%;
      background-color: #fcfcfc;
      border-radius: 10px;
      box-sizing: border-box;
      padding: 20px;
      box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
      margin-bottom: 20px;
    }
    .cotacao-header-container {
      width: 100%;
      height: 50px;
      background-color: #FFEC86;
      gap: 5px;
      color: #43575D;
      font-size: 1.5rem;
      margin-bottom: 20px;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
    }
    .cotacao-media-saneada-container {
      width: 100%;
      height: 50px;
      font-weight: 600;
      background-color: #FFEC86;
      gap: 5px;
      color: #b3924b;
      font-size: 1.5rem;
      margin-bottom: 20px;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
    }
    .cotacao-media-saneada-container span {
      font-weight: 400;
      font-size: 2rem;
      padding: 5px 10px;
      border-bottom: 2px solid #5c4719;
      color: #5c4719;
    }

    .cotacao-resumo-container {
      width: 100%;
      height: 50px;
      background-color: #1565C0;
      gap: 5px;
      color: #FFFFFF;
      font-size: 1.5rem;
      margin-bottom: 20px;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
    }
    .button-cotacao-container {
      padding: 10px 20px;
    }
    .cotacao-acao-filtros-container {
        width: 15%;
    }
    .cotacao-itens-encontrados {
      margin-bottom: 20px;
    }
    .detalhamento-container {
      width: 100%;
      padding: 30px;
      border: 1px solid #D2D6DE;
      background-color: #fdfbef;
      border-radius: 10px;
      animation: fadeAndSlide 0.3s ease;
    }
    .detalhe-container {
      gap: 25px;
      padding: 10px;
      padding-bottom: 15px;
      border-radius: 5px;
      margin-bottom: 5px;
      border: 1px solid #D2D6DE;
      background-color: #FFFFFF;
    }
    .detalhe-valores {
      /* margin-top: 30px; */
      width: 100%;
      padding: 30px;
      border: 1px solid #D2D6DE;
      border-radius: 5px;
      background-color: #fff4b4;
    }
    .detalhe-valor-titulo {
      width: 50%;
      padding: 10px;
      border-radius: 5px;
      color: #FFFFFF;
      background-color: #1565C0;
      margin-bottom: 20px;
    }
    .desc-text {
      text-align: left;
    }
    .grupo-item {
      width: 250px;
      height: 50px;
      padding: 20px;
      background-color: #FFFFFF;
      border-left: 10px solid #1565C0;
      border-radius: 5px;
    }
    .valor-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      width: 50%;
      text-align: center;
    }
    .banco-precos-table-descricao {
    max-width: 600px;
    cursor:help;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cotacao-calculo-container {
    width: 100%;
    background-color: #fcfcfc;
    box-sizing: border-box;
    box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
    border-radius: 10px;
    padding: 20px;
  }
  .cotacao-calculo-tabela-container {
    width: 100%;
    background-color:  #eaf2ff;
    box-sizing: border-box;
    box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
    border-radius: 10px;
    gap: 10px;
    padding: 20px;
    margin-bottom: 10px;
  }
  .cotacao-tabelas {
    width: 60%;
    height: 250px;
    padding: 20px;
    background-color: #FFFFFF;
    border-bottom: 1px solid #cbe0ff;
    box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
  }
  .cotacao-tabela {
    width: 100%;
  }
  .cotacao-tabela-linha {
    width: 100%;
    border-bottom: 1px solid #cbe0ff;
    padding: 5px;
    text-align: right;
  }
  .cotacao-tabela-linha:nth-child(even) {
    background-color: #eff4fc; 
  }
  .cotacao-tabela-linha:nth-child(odd) {
    background-color: #ffffff; 
  }
  .cotacao-tabela-header {
    background-color: #e3eeff;
    color: #158ac0;
    border-bottom: 1px solid #cbe0ff;
    width: 100%;
    padding: 5px;
    font-weight: 700;
    text-align: right;
  }
  .cotacao-indicativo {
    width: 40%;
    height: 250px;
    box-sizing: border-box;
    border-radius: 10px;
    padding: 20px;
    background-color: #eff4fd;
  }

  .cotacao-titulo-container {
    width: 100%;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 2px solid #158ac0;
  }

  .cotacao-titulo {
    width: 100%;
    gap: 5px;
    font-weight: 700;
    color: #158ac0;
  }

  .cotacao-subtitulo {
    width: 100%;
  }

  .cotacao-resumo {
    width: 100%;
    gap: 10px;
  }

  .resumo-container {
    width: 100%;
    background-color: #fcfcfc;
    border-bottom: 1px solid #cbe0ff;
    padding: 10px;
    /* border-radius: 10px; */
    box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
  }

  .diagnostico-card {
    width: 100%;
    padding: 10px 30px;
    border-radius: 10px;
    color: #FFFFFF;
    font-weight: 700;
    gap: 5px;
    box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
  }

  .diagnostico-card i {
    font-size: 3rem;
    margin-right: 10px;
  }
  .diagnostico-ok {
    background-color: #2E7D32;
  }
  .diagnostico-atencao {
    background-color: #FF9900;
  }


  .cotacao-detalhamento-item {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 9999;
  }

  .cotacao-saneado-row {
    padding: 5px;
    border-radius: 10px;
    font-weight: 700;
    color: #FFFFFF;
    background-color: #867200;
  }

  .cotacao-contaminado-row {
    padding: 5px;
    border-radius: 10px;
    font-weight: 700;
    color: #FFFFFF;
    background-color: #860000;
  }
  .cotacao-removido-manual-row {
    padding: 5px;
    gap: 10px;
    border-radius: 10px;
    font-weight: 700;
    color: #FFFFFF;
    background-color: #bb7a02;
  }

  .cotacao-input-container {
    width: 100%;
    gap: 5px;
    margin-bottom: 10px;
  }

  .error-input {
    border: 2px dashed red !important;
  }

  @keyframes fadeAndSlide {
  0% {
    opacity: 0;
    transform: translateY(-100px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
  }
 </style>