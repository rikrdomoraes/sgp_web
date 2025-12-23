<!-- 74213 - Módulo de Prestação de Contas para Processo Simplificado-->
<template>
    <div class="content-wrapper" style="min-height: 870px;">
      <section class="content-header ng-scope">
        <vue-headful :title="'SGP - Solicitações'"/>
        <h1> <i class="fa fa-file-pdf-o" aria-hidden="true"></i> Prestação de Contas | Gerenciador de Documentos Fiscais</h1>

        <div class="row-flex all-start prest-button-container" v-if="Object.keys(parcelaSelecionada).length > 0">
          <span v-if="!loading.show">
          <g-button-moema color="warning" @click.native="$router.go(-1)" type="button"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</g-button-moema>
          </span>
          <div class="espacamento_botoes"></div>
          <span v-show="!loading.show && totalPorcentagem >= 80 && usuarioLogado.userType == 'ENTIDADE' && chiefActive()">
            <g-button-moema color="success" @click.native.stop="concluir()" type="button"><i class="fa fa-check" aria-hidden="true"></i> Concluir</g-button-moema>
          </span>
          <span v-if="!loading.show && usuarioLogado.userType == 'ENTIDADE' && !chiefActive() && totalPorcentagem >= 80">
            <div class="row-flex centered-start prest-declaracoes-container-aviso-small">
              <div class="column all-centered prest-declaracoes-icon">
                <i class="fa fa-exclamation-circle" aria-hidden="true" ></i>
              </div>
              <div>
                Aviso: Já é possível solicitar a <b>baixa do título de adiantamento</b>. <i>*Apenas <b>representantes legais</b> podem concluir a prestação de contas.</i>
              </div>
            </div>
          </span>

          <div class="espacamento_botoes"></div>
        </div>

        <b-breadcrumb :items="breadcrumb"/>

      </section>
      <div v-if="loading.show" class="overlay-loading"><i class="fa fa-refresh fa-spin"></i>
         [{{ mensagemLoading }}]
      </div>
      <div class="column start-centered prest-section-container" v-if="!loading.show">
        <!-- SELECIONAR PROJETO AQUI CASO NAO EXISTA ID NA ROTA, É UMA NOVA SOLICITACAO -->
        <div v-if="mensagemAviso.length > 0" class="column all-start prest-main-container-ged">
          <div class="row-flex centered-start prest-declaracoes-container-aviso" v-for=" aviso in mensagemAviso" :key="aviso">
            <div class="column all-centered prest-declaracoes-icon">
              <i class="fa fa-exclamation-circle" aria-hidden="true" ></i>
            </div>
            <div>
              {{ aviso }}
            </div>
          </div>
        </div>
        <div class="column all-start prest-main-container-ged">
           <div class="box-header">
              <h3 class="prest-box-title row-flex centered-start">
                <i class="fa fa-pencil" aria-hidden="true"></i>
                {{dadosComplementares.numeroProjeto}} - {{dadosComplementares.projeto}}
                <span v-if="usuarioLogado.userType === 'FUNDACAO' && !loading.tela">
                  (<strong>{{dadosComplementares.statusERP}}</strong>)
                  <router-link :title="'<h5>Ir para a página do Projeto</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'small', arrow : true }" :to="{name: 'projeto', params: { numero: dadosComplementares.numeroProjeto }}" target="_blank">&nbsp<i class="fa fa-external-link"></i></router-link>
                </span> 
              </h3>
            </div>

            <div class="column start-centered prest-entidade-info-container">
              <router-link :title="'<h5>Ir para o Cadastro dessa Entidade</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }" :to="{name: 'cadastro-entidade-visualiza', params: { id: dadosComplementares.fk_entidade }}" target="_blank"> {{dadosComplementares.nome_entidade}} &nbsp<i class="fa fa-external-link"></i></router-link>
              <div class="row-flex centered-start prest-label-info">
                  <b>Período de execução:</b>
                  <div>{{ dadosComplementares.data_inicial }} a {{ dadosComplementares.data_final }}</div>
              </div>
              <div class="row-flex centered-start prest-label-info">
                <b>CNPJ:</b>
                <div>{{dadosComplementares.cnpj_entidade | cnpj}}</div>
              </div>
              <div class="row-flex centered-start prest-label-info" v-if="usuarioLogado.userType == 'FUNDACAO'">
                <b>Projeto Superior:</b>
                <div>{{dadosComplementares.ds_projeto_superior}}</div>
              </div>
            </div>
        </div>
        <div class="column all-start prest-main-container-ged">
          <div class="box-header with-border">
            <h3 class="prest-box-title row-flex centered-start">Selecione a Parcela de Adiantamento para Vinculação dos Documentos <i class="fa fa-dollar" aria-hidden="true"></i></h3>
          </div>
          <select name="projeto"
                          v-model="parcelaSelecionada"
                          class="form-control"
                          aria-hidden="true"
                          @change="buscaDados()">
                  <option :value="[]" disabled selected>Selecione a Parcela de Adiantamento</option>
                  <option v-for="parcelaAdiantamento in parcelasAdiantamento" :value="parcelaAdiantamento">Parcela {{parcelaAdiantamento.parcela}} - Valor Adiantado: {{ parcelaAdiantamento.valor_parcela | real }} ({{ parseFloat(parcelaAdiantamento.valor_gravado * 100 / parcelaAdiantamento.valor_parcela).toFixed() }}% comprovado)</option>
          </select>
        </div>
        <div class="column all-start prest-main-container-ged" v-if="Object.keys(parcelaSelecionada).length > 0">
          <div v-if="loading.documentos" class="overlay-loading"><i class="fa fa-refresh fa-spin"></i>
            [{{ mensagemLoading }}]
          </div>
          <div v-if="!loading.documentos" class="column all-start prest-w-100">
            <cronogramaGED
              ref="cronograma" 
              :cronograma="cronograma" 
              :setNota="setNota"
              :dataInicioSapiens="dadosComplementares.data_inicio_sapiens"
              :dataInicial="dadosComplementares.data_inicial"
              :dataFinal="dadosComplementares.data_final"
              :idEntidade="dadosComplementares.fk_entidade"
              :cnpjEntidade="dadosComplementares.cnpj_entidade"
              :fkPrestacaoSimplificada="parcelaSelecionada.id"
              :notasCadastradas="notasCadastradas"
              :acertoValoresCancelamentoEdicaoCronograma="acertoValoresCancelamentoEdicaoCronograma"
            ></cronogramaGED>
            <div class="column end-centered prest-total-container">
              <div>
                Total Registrado: <b>{{ parcelaSelecionada.valor_gravado | real }}</b>
              </div>
              <div>
                Total Pendente: <b>{{ parseFloat(parcelaSelecionada.valor_parcela) - parseFloat(parcelaSelecionada.valor_gravado) | real }} </b>
              </div>
              <div class="column end-centered prest-total-container-processo" v-if="existeProcesso.length > 0">
                <div>
                  Total em Processo de Baixa/Baixado: <b style="font-size: 2rem;">{{totalProcesso | real}}</b>
                </div>
                <div>
                  Total registrado pendente de Baixa: <b style="color: #FF9900; font-size: 2rem;">{{totalSemProcesso | real}}</b>
                </div>
              </div>

              <b-progress class="prest-progress-bar" :max="100" :animated="true">
                <b-progress-bar class="prest-progress-bar-internal" :class="totalPorcentagem  >= 80 ? 'prest-progress-valid' : ''" :value="totalPorcentagem" :max="100" :animated="true">
                  <b>{{totalPorcentagem}}%</b>
                </b-progress-bar>
              </b-progress>
              <div>
                <i>*Ao chegar a 80% de comprovação, será possível encaminhar a prestação de contas para a Fundação Banco do Brasil, ciente de que o processo de prestação de contas deverá continuar até que se alcance 100% do recurso adiantado.</i>
              </div>
            </div>
          </div>
          <div class="box-body prest-notas-cadastradas-container" v-if="!loading.documentos">
              <div class="row-flex start-between">
                <h4 class="prest-box-title row-flex centered-start">Documentos Cadastrados <i class="fa fa-sticky-note" aria-hidden="true" ></i></h4>
                <div class="row-flex all-ceentered prest-action-notas-container" v-if="usuarioLogado.userType == 'FUNDACAO'">
                  <!-- Botão para baixar o excel -->
                  <download-excel
                    :data   = "formattedItems"
                    :meta   = "excelMeta"
                    :fields = "excelCampos.basico"
                    type    = "xls"
                    :name    = "`${moment().format('DDMMYYYYhhmmss')} Documentos Fiscais ${dadosComplementares.numeroProjeto}(Parcela Adiantamento ${parcelaSelecionada.parcela}).xls`">
                    <g-button-ujarak color="success" size="button--size-ss" :title="'<h5> Baixar Planilha com os Documentos Cadastrados </h5>'" v-tippy="{ arrow: false, followCursor: true, theme: 'light' }"><i class="fa fa-file-excel-o" aria-hidden="true"></i> </g-button-ujarak>
                  </download-excel>
                  <!-- Botao pra baixar todos os arquivos -->
                  <g-button-ujarak color="primary" size="button--size-ss" @click.native="onDownloadZIP()" :title="'<h5> Baixar Todos os Anexos </h5>'" v-tippy="{ arrow: false, followCursor: true, theme: 'light' }"><i class="fa fa-cloud-download" aria-hidden="true"></i> </g-button-ujarak>
                </div>
              </div>
              <b-container fluid>
                <b-table show-empty
                          stacked="md"
                          :key="tableDataKey"
                          striped
                          :bordered="table.bordered"
                          :items="table.items"
                          :fields="table.fields"
                          :current-page="table.currentPage"
                          :per-page="table.perPage"
                          :filter="table.filter"
                          empty-text="Nenhum registro encontrado"
                          :sort-by.sync="table.sortBy"
                          :sort-desc.sync="table.sortDesc">
                          <template slot="data_emissao_documento" scope="row">{{row.value | moment("L")}}</template>
                          <template slot="valor_documento" scope="row">{{row.value | real}}</template>
                          <template slot="serie_documento" scope="row">{{row.value.replace('_', ' ')}}</template>
                          <template slot="item" scope="row">{{row.value}}</template>
                          <template slot="fornecedor_cpf_cnpj" scope="row">
                            <span v-if="row.value.length < 12">{{row.value | cpf}}</span>
                            <span v-else>{{row.value | cnpj}}</span>
                          </template>
                          <template slot="actions" scope="row">
                            <div class="row-flex all-centered prest-button-row" v-if="!editandoNota">
                              <g-button-ujarak  color="success" size="button--size-ss" @click.native="toggleDetalheNota(true, row.item)" :title="'<h5> Detalhar Documento </h5>'" v-tippy="{ arrow: false, followCursor: true, theme: 'light' }"><i class="fa fa-search" aria-hidden="true"></i> </g-button-ujarak>
                              <g-button-ujarak  v-if="usuarioLogado.userType == 'ENTIDADE' && (!row.item.hasOwnProperty('fk_processo') || _.isNull(row.item.fk_processo))" color="primary" size="button--size-ss"  @click.native="editarNota(row.item)" :title="'<h5> Editar Documento </h5>'" v-tippy="{ arrow: false, followCursor: true, theme: 'light' }"><i class="fa fa-pencil-square-o" aria-hidden="true" ></i> </g-button-ujarak>
                              <g-button-ujarak  v-if="usuarioLogado.userType == 'ENTIDADE' && (!row.item.hasOwnProperty('fk_processo') || _.isNull(row.item.fk_processo))" color="error" size="button--size-ss" @click.native="excluirNota(row.item)" title="'<h5> Excluir Documento </h5>'" v-tippy="{ arrow: false, followCursor: true, theme: 'light' }"> <i class="fa fa-trash-o" aria-hidden="true"></i> </g-button-ujarak>
                              <div v-if="row.item.fk_processo && usuarioLogado.userType == 'ENTIDADE'" class="prest-label-info-button" :title="'<h5> Documentos vinculados a um processo de baixa não podem ser editados ou excluídos. </h5>'" v-tippy="{ arrow: false, followCursor: true, theme: 'light' }">
                                <i class="fa fa-exclamation-circle" aria-hidden="true"></i> Baixa de título: {{ row.item.fk_processo }}
                              </div>
                            </div>
                            <div v-else class="column all-centered prest-button-row">
                              <div class="prest-label-info-button">
                                Nota em Edição
                              </div>
                            </div>
                          </template>
                          <template slot="status" scope="row">
                            <span :class="getClassStatus(row.value)"><b>{{ row.value }}</b></span>
                          </template>
                          <template slot="anexos" scope="row">
                            <div class="row-flex all-centered prest-anexo-container" @click="toggleAnexos(true, row.value)" :title="'<h5> Clique para ver os Anexos </h5>'" v-tippy="{ arrow: false, followCursor: true, theme: 'light' }">
                              <i class="fa fa-paperclip" aria-hidden="true"></i>
                            </div>
                          </template>
                </b-table>
                <div class="row-flex all-end prest-total-documentos">
                    <div>
                        Total de Documentos: <b>{{ table.items.length }}</b>
                    </div>
                </div>
                <div class="row-flex all-end prest-total-container">
                    <div>
                        Total Registrado: <b>{{ parcelaSelecionada.valor_gravado | real }}</b> ({{ totalPorcentagem }}%)
                    </div>
                </div>
              </b-container>
              <!-- Detalhes de Anexo e de Nota Cadastrada -->
              <div class="column all-centered prest-modal" v-if="mostrarAnexos" @click="toggleAnexos(false)">
                <div class="column all-start prest-content-modal" @click.stop>
                  <h4 class="prest-box-title row-flex centered-start">Detalhe dos Anexos: <i class="fa fa-search" aria-hidden="true" ></i></h4>
                  <h5>Clique no link para fazer o <b>download</b> do anexo:</h5>
                  <a v-for="anexo in anexosNotaModal" :key="anexo.id" @click="downloadAnexo(anexo)" class="prest-modal-link">
                    <i class="fa fa-download" aria-hidden="true"></i> [{{ anexo.dt_criado | moment('DD/MM/YYYY HH:mm') }}] {{anexo.ds_nome_arquivo}} 
                  </a>
                </div>
              </div>

              <!-- Detalhes de Anexo e de Nota Cadastrada -->
              <div class="column all-centered prest-modal" v-if="mostrarDetalheNota" @click="toggleDetalheNota(false)">
                <div class="column all-start prest-content-modal-detalhes" @click.stop>
                  <h4 class="prest-box-title row-flex centered-start">Detalhe do Documento Fiscal: <i class="fa fa-search" aria-hidden="true"></i></h4>
                  
                  <ul>
                    <!-- <li><strong>ID:</strong> {{ detalhesNotaModal.id }}</li>
                    <li><strong>Prestação Simplificada:</strong> {{ detalhesNotaModal.fk_prestacao_simplificada }}</li> -->
                    <li><strong>Número do Documento:</strong> {{ detalhesNotaModal.numero_documento }}</li>
                    <li><strong>Série do Documento:</strong> {{ detalhesNotaModal.serie_documento.replace('_', ' ') }}</li>
                    <li><strong>Data de Emissão:</strong> {{ detalhesNotaModal.data_emissao_documento | moment('DD/MM/YYYY HH:mm')}}</li>
                    <li v-if="detalhesNotaModal.data_validade_documento"><strong>Data de Validade:</strong> {{ detalhesNotaModal.data_validade_documento | moment('DD/MM/YYYY HH:mm')}}</li>
                    <li><strong>Valor do Documento:</strong> {{ detalhesNotaModal.valor_documento | real }}</li>
                    <li><strong>Tipo de Fornecedor:</strong> {{ detalhesNotaModal.fornecedor_tipo }}</li>
                    <li v-if="detalhesNotaModal.fornecedor_tipo == 'Pessoa Jurídica'"><strong>CNPJ do Fornecedor:</strong> {{ detalhesNotaModal.fornecedor_cpf_cnpj | cnpj}}</li>
                    <li v-if="detalhesNotaModal.fornecedor_tipo == 'Pessoa Física'"><strong>CPF do Fornecedor:</strong> {{ detalhesNotaModal.fornecedor_cpf_cnpj | cpf}}</li>
                    <li><strong>Nome do Fornecedor:</strong> {{ detalhesNotaModal.fornecedor_nome }}</li>
                    <li><strong>Endereço do Fornecedor:</strong> {{ detalhesNotaModal.fornecedor_endereco }}</li>
                    <li><strong>CEP do Fornecedor:</strong> {{ detalhesNotaModal.fornecedor_cep }}</li>
                    <li><strong>Item:</strong> {{ detalhesNotaModal.item }}</li>
                    <li><strong>Item Cronograma:</strong> <i style="color: #6495ED;">[#{{ detalhesNotaModal.fk_item_cronograma }}]</i> {{ detalhesNotaModal.item_cronograma }}</li>
                    <li><strong>Gravado em:</strong> {{ detalhesNotaModal.created_at | moment('DD/MM/YYYY HH:mm')}}</li>
                    <li><strong>Atualizado em:</strong> {{ detalhesNotaModal.updated_at | moment('DD/MM/YYYY HH:mm')}}</li>
                  </ul>
                  <h5>Clique no link para fazer o <b>download</b> do anexo:</h5>
                  <a v-for="anexo in detalhesNotaModal.anexos" :key="anexo.id" @click="downloadAnexo(anexo)" class="prest-modal-link">
                    <i class="fa fa-download" aria-hidden="true"></i> [{{ anexo.dt_criado | moment('DD/MM/YYYY HH:mm') }}] {{anexo.ds_nome_arquivo}} 
                  </a>
                </div>
              </div>
            </div>
        </div>
        <div v-else class="column all-start prest-main-container-ged">
          <div class="row-flex centered-start prest-declaracoes-container-aviso">
            <div class="column all-centered prest-declaracoes-icon">
              <i class="fa fa-exclamation-circle" aria-hidden="true" ></i>
            </div>
            <div>
              Selecione uma parcela de Adiantamento para carregar os documentos fiscais vinculados.
            </div>
          </div>
        </div>   
        <div class="column all-start prest-main-container-ged">
          <AnexosComplementares :dadosComplementares="dadosComplementares"></AnexosComplementares>
          <PrestacaoDeclaracoes v-if="Object.keys(parcelaSelecionada).length > 0" 
            ref="prestacaoDeclaracoes"
            :dadosComplementares="dadosComplementares" 
            :idPrestacao="parcelaSelecionada.id"
            :parcelaSelecionada="parcelaSelecionada"
            :infoParcelasAdiantamento="infoParcelasAdiantamento"
            >
          </PrestacaoDeclaracoes>
          <PrestacaoHistorico v-if="usuarioLogado.userType == 'FUNDACAO'"></PrestacaoHistorico>
        </div>
      </div>
    </div>
</template>
  
  <script>
    import { mapGetters } from 'vuex'
    import moment from 'moment'
    import cronogramaGED from './cronogramaGED.vue'
    import uploadDocumentosPhpPrestacao from './uploadDocumentosPhpPrestacao.vue'
    import AnexosComplementares from './AnexosComplementares.vue'
    import PrestacaoHistorico from './PrestacaoHistorico.vue'
    import PrestacaoDeclaracoes from './PrestacaoDeclaracoes.vue'

    export default {
      components: {
        cronogramaGED,
        uploadDocumentosPhpPrestacao,
        AnexosComplementares,
        PrestacaoHistorico,
        PrestacaoDeclaracoes
      },
      name: 'PrestacaoSimplificadaGED',
      data () {
        return {
          loading: {
            show: false,
            documentos: false
          },
          moment: moment,
          mostrarAnexos: false,
          mostrarDetalheNota: false,
          editandoNota: false,
          tableDataKey: 0,
          anexosNotaModal: [],
          detalhesNotaModal: [],
          ehVisualizacao: false,
          parcelaSelecionada: [],
          parcelasAdiantamento: [],
          infoParcelasAdiantamento: [],
          mensagemAviso: [],
          cienteDeclaracoes: [],
          declaracoes: [{'codigo': 'fornecedoresNaoLigadosDirigentes', 'texto': 'Declaro que esta liberação de recurso não será destinada ao pagamento de fornecedores de bens e serviços dos quais seu(s) proprietário(s), sócio(s) ou dirigente(s) seja(m) componentes da diretoria e conselhos da {{entidade.ds_nome}}'}, {'codigo': 'recursosNaoDestinadosDirigentesParentes', 'texto': 'Declaro ainda que o recurso não será destinado a fornecedores de bens e serviços dos quais seu(s) proprietário(s), sócio(s) ou dirigente(s) seja(m) parente(s) consanguíneo(s) ou afins, em linha reta ou colateral, até o terceiro grau com dirigente(s) ou conselheiro(s) da {{entidade.ds_nome}}'}],
          cronograma: {},
          mensagemLoading: '',
          dadosComplementares: {},
          notasCadastradas: [],
          notaTarefa: {},
          table: {
            items: [],
            currentPage: 0,
            perPage: 999,
            totalRows: 0,
            sortBy: 'id',
            sortDesc: true,
            filter: null,
            emptyText: 'Não tem nenhum registro para mostrar',
            fields: [
                { key: 'item_cronograma', label: 'Item', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
                { key: 'numero_documento', label: 'Número Documento', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
                { key: 'item', label: 'Nome Item', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
                { key: 'serie_documento', label: 'Tipo Documento', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
                { key: 'data_emissao_documento', label: 'Data Emissão', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
                // { key: 'fornecedor_cpf_cnpj', label: 'CPF/CNPJ', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
                { key: 'fornecedor_nome', label: 'Nome Emitente', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
                { key: 'valor_documento', label: 'Valor', thStyle: 'text-align: center', class: 'text-center' },
                { key: 'anexos', label: 'Anexos', thStyle: 'text-align: center', class: 'text-center' },
                { key: 'actions', label: 'Ações', thStyle: 'text-align: center', class: 'text-center' }
            ]
          },
          excelCampos: {
            basico: {
              // 'ID': 'id',
              // 'Prestação Simplificada': 'fk_prestacao_simplificada',
              'Série Documento': 'serie_documento',
              'Número Documento': 'numero_documento',
              'Data Emissão': 'data_emissao_documento',
              'Data Validade': 'data_validade_documento',
              'Valor Documento': 'valor_documento',
              'Código Fornecedor': 'fornecedor_codigo',
              'Tipo Fornecedor': 'fornecedor_tipo',
              'CPF/CNPJ Fornecedor': 'fornecedor_cpf_cnpj',
              'Nome Fornecedor': 'fornecedor_nome',
              'Endereço Fornecedor': 'fornecedor_endereco',
              'CEP Fornecedor': 'fornecedor_cep',
              'Item': 'item',
              'Item Orçamento': 'fk_item_cronograma',
              'Item Cronograma': 'item_cronograma',
              'Processo': 'fk_processo',
              // 'Excluído': 'excluido',
              'Criado em': 'created_at',
              'Atualizado em': 'updated_at',
              'Anexos': 'anexos'
            }
          },
          excelMeta: [[{'key': 'charset', 'value': 'utf-8'}]],
          breadcrumb: [{
            text: 'Inicial',
            href: '/'
          }, {
            text: 'Solcitações Prestação de Contas Simplificada',
            active: true
          }]
        }
      },
      computed: {
        ...mapGetters([
          'usuarioLogado'
        ]),
        formattedItems () {
          return this.notasCadastradas.map(item => {
            return {
              ...item,
              // fazer um foreach ou um map pra criar link para todos os anexos
              // Mudar o link quando for subir pra prod/homologa
              anexos: item.anexos.map(anexo => {
                return `<div><a href=https://sgphomologacao.fbb.org.br/baixarArquivoPrestacao/${anexo.id}>${anexo.ds_nome_arquivo}</a></div>`
              }).join(' ')
            }
          })
        },
        existeProcesso () {
          return this.notasCadastradas.filter(nota => {
            return nota.fk_processo !== null
          })
        },
        totalProcesso () {
          let total = 0
          if (this.notasCadastradas.length > 0) {
            this.notasCadastradas.forEach(nota => {
              if (nota.hasOwnProperty('fk_processo')) {
                if (nota.fk_processo !== null) {
                  total += parseFloat(nota.valor_documento)
                }
              }
            })
          }
          return total
        },
        totalSemProcesso () {
          let total = 0
          if (this.notasCadastradas.length > 0) {
            this.notasCadastradas.forEach(nota => {
              if (nota.fk_processo === null || nota.hasOwnProperty('fk_processo') === false) {
                total += parseFloat(nota.valor_documento)
              }
            })
          }
          return total
        },
        totalPorcentagem () {
          let total = 0
          if (this.parcelaSelecionada.valor_parcela > 0) {
            total = this.parcelaSelecionada.valor_gravado * 100 / this.parcelaSelecionada.valor_parcela
          }
          // faz um pad de 2 casas decimais
          total = parseFloat(total).toFixed()
          return parseFloat(total)
        }
      },
      created: function () {
        console.log('CREATED')
      },
      mounted: function () {
        console.log('MOUNTED', this.$route.params.id)
        if (this.$route.params.id) {
          this.initDados()
        }
      },
      methods: {
        chiefActive () {
          // Verifica se o nome do usuario ds_nome é igual ao nome do chefe que está no mesmo objeto em um array usuarioLogado.entidade.dirigentes, precisa ter bt_ativo = 1 e bt_representante_legal = 1
          let chefe = this.usuarioLogado.entity.dirigentes.find(dirigente => {
            return (dirigente.bt_ativo === 1 && dirigente.bt_representante_legal === 1)
          })
          if (chefe) {
            return String(chefe.ds_cpf).trim() === String(this.usuarioLogado.ds_cpf).trim()
          }
        },
        toggleAnexos (valor, anexos = null) {
          this.mostrarAnexos = valor
          if (this.mostrarAnexos) {
            this.anexosNotaModal = anexos
          }
        },
        toggleDetalheNota (valor, nota = null) {
          this.mostrarDetalheNota = valor
          if (this.mostrarDetalheNota) {
            this.detalhesNotaModal = nota
          }
        },
        editarNota (nota) {
          // Acerta valor do cronograma para não impactar no total final
          this.editandoNota = true
          this.acertoValoresEdicaoCronograma(nota)
          this.$refs.cronograma.initEdicao(nota)
        },
        async initDados () {
          await this.getDadosComplementares()
          await this.getParcelasAdiantamento()
          await this.getInformacoesAdiantamentos()
        },
        async buscaDados () {
          console.log('BUSCANDO DADOS')
          await this.carregarCronograma()
          if (this.usuarioLogado.userType === 'ENTIDADE') {
            // Verifica se é representante legal
          }
          await this.getNotas()
        },
        excluirNota (nota) {
          console.log('Excluir nota', nota)
          // Confirma exclusão com o dialog.confirm
          this.$dialog.confirm('Deseja realmente excluir esse documento? Essa ação <b>não</b> pode ser desfeita.', {
            title: 'Excluir Nota',
            type: 'warning',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
          }).then(() => {
            this.excluirNotaConfirmado(nota)
          }).catch(() => {
            console.log('Exclusão cancelada')
          })
        },
        async excluirNotaConfirmado (nota) {
          this.$snotify.async('Excluindo Nota, aguarde...', { timeout: 0 })
          this.mensagemLoading = 'Excluindo documento...'
          this.loading.documentos = true
          console.log('Excluir nota confirmada', nota)
          let usuario = this.usuarioLogado.userType === 'FUNDACAO' ? this.usuarioLogado.ds_nome_usuario + ' (' + this.usuarioLogado.ds_login + ')' : this.usuarioLogado.ds_nome_usuario
          let obj = {
            idProposta: this.$route.params.id,
            nota: nota,
            usuario: usuario
          }
          await axiosLaravel.post('/prestacaoSimplificada/excluirNota', obj)
            .then(response => {
              console.log('response', response.data)
              this.$snotify.clear()
              this.$snotify.success('Nota excluída com sucesso!')
              // Atualiza valores do cronograma
              this.acertoValoresEdicaoCronograma(nota)
              this.getNotas()
            })
            .catch(error => {
              console.error('Error deleting nota:', error)
              this.$snotify.clear()
              this.$snotify.error('Erro ao excluir a nota.')
            })
          this.$forceUpdate()
        },
        async carregarCronograma () {
          this.mensagemLoading = 'Carregando cronograma...'
          this.loading.documentos = true
          await axiosLaravel.post('processos/cronograma/projeto/', {'proposta': this.$route.params.id, 'processo': 'PRESTACAO_DE_CONTAS', 'aglutinado': 'Completo', 'documento': 1}).then((response) => {
            this.cronograma = response.data
            this.loading.documentos = false
          })
            .catch((error) => {
              console.log('error', error)
              this.loading.documentos = false
              this.$root.trataErro(error)
            })
        },
        async getParcelasAdiantamento () {
          console.log('getParcelasAdiantamento')
          this.mensagemLoading = 'Buscando parcelas de adiantamento...'
          this.loading.show = true
          await axiosLaravel.get('/prestacaoSimplificada/getParcelasAdiantamento/' + this.$route.params.id)
            .then(response => {
              console.log('response', response.data)
              this.parcelasAdiantamento = response.data
              if (this.parcelasAdiantamento.length === 0) {
                this.mensagemAviso.push('Nenhuma parcela de adiantamento encontrada para o projeto selecionado.')
              }
              this.loading.show = false
            })
            .catch(error => {
              console.error('Error fetching parcelas adiantamento:', error)
              this.loading.show = false
            })
        },
        async getInformacoesAdiantamentos () {
          console.log('getInformacoesAdiantamentos')
          this.mensagemLoading = 'Buscando informações de todas as parcelas de adiantamento...'
          this.loading.show = true
          await axiosLaravel.get('/prestacaoSimplificada/verificaAdiantamentos/' + this.$route.params.id)
            .then(response => {
              console.log('getInformacoesAdiantamentos', response.data)
              this.infoParcelasAdiantamento = response.data.adiantamentosProposta
              this.loading.show = false
            })
            .catch(error => {
              console.error('Error fetching parcelas adiantamento:', error)
              this.loading.show = false
            })
        },
        async getDadosComplementares () {
          console.log('dadosComplementares')
          this.mensagemLoading = 'Buscando dados complementares...'
          this.loading.show = true
          await axiosLaravel.get('/prestacaoSimplificada/getDadosComplementaresProposta/' + this.$route.params.id)
            .then(response => {
              console.log('response', response.data)
              this.dadosComplementares = response.data[0]
              if (this.usuarioLogado.userType === 'ENTIDADE') {
                if (this.dadosComplementares.fk_entidade !== this.usuarioLogado.entity.id) {
                  console.log('ENTIDADE DIFERENTE')
                  this.$snotify.error('Você não tem permissão para acessar essa proposta.')
                  this.$router.push({ name: 'prestacao-contas-simplificada' })
                  return
                }
              }
              let datetimeInicial = new Date(this.dadosComplementares.data_inicio_sapiens)
              let datetimeFim = new Date(this.dadosComplementares.data_fim_sapiens)
              console.log(this.dadosComplementares)
              this.dadosComplementares.data_inicial = datetimeInicial.toLocaleDateString('pt-BR')
              this.dadosComplementares.data_final = datetimeFim.toLocaleDateString('pt-BR')
              // this.loading.show = false
            })
            .catch(error => {
              console.error('Error fetching dados complementares:', error)
              this.loading.show = false
            })
        },

        async getNotas () {
          this.mensagemLoading = 'Buscando documentos cadastrados...'
          this.loading.documentos = true
          await axiosLaravel.get('/prestacaoSimplificada/carregarNotas/' + this.parcelaSelecionada.id)
            .then(response => {
              console.log('response', response.data)
              this.notasCadastradas = response.data
              this.table.items = this.notasCadastradas
              this.acertoValoresCronograma()
              this.$forceUpdate()
              this.loading.documentos = false
            })
            .catch(error => {
              console.error('Error fetching notas:', error)
              this.loading.documentos = false
            })
        },
        acertoValoresCronograma () {
          this.notasCadastradas.forEach((nota) => {
            console.log('NOTA', nota)
            this.cronograma.itens.forEach((item) => {
              if (String(item.Id_item) === String(nota.fk_item_cronograma)) {
                console.log('Valor Solicitado', item.Valor_solicitado)
                console.log('Valor documento', nota.valor_documento)
                // Verifica se nota possui fk_processo, caso tenha, remove do Valor_saldo
                if (!nota.fk_processo) {
                  item.Valor_solicitado += parseFloat(nota.valor_documento)
                }
              }
            })
          })
        },
        acertoValoresEdicaoCronograma (nota) {
          this.cronograma.itens.forEach((item) => {
            if (String(item.Id_item) === String(nota.fk_item_cronograma)) {
              item.Valor_solicitado -= parseFloat(nota.valor_documento)
            }
          })
           // Sensibiliza o valor total gravado para parcela
          this.parcelaSelecionada.valor_gravado = parseFloat(this.parcelaSelecionada.valor_gravado) - parseFloat(nota.valor_documento)
          this.parcelaSelecionada.valor_gravado = this.parcelaSelecionada.valor_gravado.toFixed(2)
        },
        acertoValoresCancelamentoEdicaoCronograma (nota) {
          console.log('ACERTO CANCELAMENTO', nota)
          this.editandoNota = false
          this.cronograma.itens.forEach((item) => {
            if (String(item.Id_item) === String(nota.fk_item_cronograma)) {
              item.Valor_solicitado += parseFloat(nota.valor_documento)
            }
          })
          // Sensibiliza o valor total gravado para parcela
          this.parcelaSelecionada.valor_gravado = parseFloat(this.parcelaSelecionada.valor_gravado) + parseFloat(nota.valor_documento)
          this.parcelaSelecionada.valor_gravado = this.parcelaSelecionada.valor_gravado.toFixed(2)
        },
        // faz um concluir com dialog pra confirmar
        concluir () {
          console.log('Concluir')
          let totalSolicitacao = 0
          this.notasCadastradas.forEach((nota) => {
            if (!nota.fk_processo) {
              totalSolicitacao += parseFloat(nota.valor_documento)
            }
          })
          if (totalSolicitacao <= 0) {
            this.$snotify.error('Nenhum documento cadastrado para concluir a prestação de contas.')
            return
          }
          this.$dialog.confirm('<p>Deseja realmente concluir a prestação de contas deste valor e solicitar a baixa do título? Essa ação <b>não</b> poderá ser desfeita e os arquivos dessa sessão <b>não</b> poderão mais ser editados.</p> <br/> <p>Caso os valores não estejam em <b>100% do total</b>, você poderá gravar o restante dos documentos posteriormente.</p> <br/> <p>Total desta solicitação: <b>R$ ' + totalSolicitacao.toFixed(2) + '</b></p>', {
            title: 'Concluir Prestação de Contas',
            type: 'warning',
            confirmButtonText: 'Sim, concluir!',
            cancelButtonText: 'Cancelar'
          }).then(() => {
            // 1 Verifica se as declarações para parcela de adiantamento foram preenchidas
            if (this.$refs.prestacaoDeclaracoes) {
              if (this.$refs.prestacaoDeclaracoes.validarDeclaracoes() === false) {
                this.$snotify.clear()
                this.$snotify.error('Declaração não aceita, para concluir a prestação de contas desta parcela de adiantamento, é necessário aceitar todas as declarações.')
                this.loading.show = false
                return
              }
            }
            this.concluirSolicitacao()
          }).catch(() => {
            console.log('Concluir cancelado')
          })
        },
        async concluirSolicitacao () {
          console.log('Concluindo solicitacao')
          this.mensagemLoading = 'Criando tarefa de baixa de título...'
          this.$snotify.async('Criando tarefa de baixa de título, por favor, não feche essa janela... Aguarde... ', {timeout: 0})
          this.loading.show = true
          // console.log('PASSOU VERIFICACAO', this.cronograma)
          // 2 Cria o objeto de nota fiscal para ser criada a tarefa de baixa de título
          // Vamos criar com os dados da entidade, número da nota vai ser a data/hora + numero da proposta
          this.notaTarefa = {
            // Dados do historico
            idProposta: this.$route.params.id,
            usuario: this.usuarioLogado.ds_nome_usuario,
            idPrestacao: this.parcelaSelecionada.id,
            // Cria um número de nota único para um int
            numeroNota: this.$route.params.id,
            fkPrestacaoSimplificada: this.parcelaSelecionada.id,
            serieNota: 'NOTA_FISCAL',
            dataInclusao: moment().format('YYYY-MM-DD HH:mm:ss'),
            dataValidade: null,
            observacao: 'BAIXA DE TITULO DE ADIANTAMENTO PELA PRESTACAO DE CONTAS SIMPLIFICADA.',
            dados_bancarios: {
              banco: '000',
              agencia: '0',
              conta: 1,
              tipo: 1
            },
            tipoFornecedor: 'Pessoa Jurídica',
            codigoFornecedor: null,
            cnpjFornecedor: this.dadosComplementares.cnpj_entidade,
            nomeFornecedor: this.dadosComplementares.nome_entidade,
            enderecoFornecedor: 'N/A',
            cepFornecedor: '000000000',
            anexos: [],
            forma_pagamento: 2,
            pagamentoPrioritario: 0,
            bypass: null,
            dadosComplementares: [],
            suporteFbb: [],
            tributacao: '',
            valorTributado: '',
            // Pega declarações e coloca aqui
            parametros_documento: [],
            boleto: {
              sucesso: false,
              mensagem: null,
              tipoCodigoInput: null,
              tipoBoleto: null,
              codigoBarras: null,
              linhaDigitavel: null,
              numeroInformadoTela: null,
              vencimento: null,
              valor: null
            },
            favorecido: {
              CodBan: '',
              CodAge: '',
              CcbFav: '',
              contas: [],
              incluidos: [],
              excluidos: [],
              resultado: [],
              dadosBancariosSelecionados: null
            },
            notasCadastradas: this.notasCadastradas
          }
          // Seta Projeto de acordo com o modelo comentado abaixo
          this.notaTarefa.projeto = {
            Id_proposta: this.$route.params.id,
            Numero_projeto: this.dadosComplementares.numeroProjeto,
            Projeto: this.dadosComplementares.projeto,
            fk_entidade: this.dadosComplementares.fk_entidade,
            Objetivo: this.dadosComplementares.objetivo,
            Status_ERP: this.dadosComplementares.statusERP,
            edital: null,
            data_inicial_formatada: this.dadosComplementares.data_inicial,
            data_final_formatada: this.dadosComplementares.data_final,
            dateInicioSapiens: this.dadosComplementares.data_inicio_sapiens,
            dateFimSapiens: this.dadosComplementares.data_fim_sapiens,
            dateAprovacao: this.dadosComplementares.data_aprovacao
          }
          // Seta declarações
          this.cienteDeclaracoes = []
          this.ciente('fornecedoresNaoLigadosDirigentes')
          this.ciente('recursosNaoDestinadosDirigentesParentes')
          this.notaTarefa.parametros_documento.push({ 'parametro': 'DECLARACOES', 'valor': this.cienteDeclaracoes })
          // (seta novamente pra entrar no 'modelo' da solicitação do EditaPagamento tsc)
          // Seta projeto
          // Seta banco
          // Seta agencia
          // Seta tipo
          // Seta conta
          // Seta processo e tarefa
          this.notaTarefa.banco = this.notaTarefa.dados_bancarios.banco
          this.notaTarefa.agencia = this.notaTarefa.dados_bancarios.agencia
          this.notaTarefa.conta = this.notaTarefa.dados_bancarios.conta
          this.notaTarefa.tipo = this.notaTarefa.dados_bancarios.tipo
          this.notaTarefa.processo = {'nome': 'PRESTACAO_DE_CONTAS', 'situacao': 'EM_EXECUCAO'}
          this.notaTarefa.tarefa = {'nome': 'SOLICITACAO', 'tipo': 'USUARIO', 'situacao': 'PADRAO'}
          // 3 Pega informações do Cronograma para compor o objeto de envio
          // A soma do valor da tarefa será o valor cadastrado sem fk_processo vinculado
          this.notaTarefa.itens = []
          // Pega os documentos cadastrados, verifica se não existe fk_processo, caso não exista, adiciona o objeto relacionado ao cronograma a nota.itens
          this.notasCadastradas.forEach((nota) => {
            if (!nota.fk_processo) {
              this.cronograma.itens.forEach((item) => {
                if (String(item.Id_item) === String(nota.fk_item_cronograma)) {
                  item['valorSolicitado'] = item.Valor_solicitado
                  item['quantidadeSolicitada'] = 1
                  item['Qtde_solicitado'] = 1
                  // Verifica se o item já existe na notaTarefa.itens, se não existir, dá um push
                  if (!this.notaTarefa.itens.find(i => i.Id_item === item.Id_item)) {
                    this.notaTarefa.itens.push(item)
                  }
                }
              })
            }
          })
          this.notaTarefa.valorTotal = _.sumBy(this.notaTarefa.itens, 'valorSolicitado')
          _.set(this.notaTarefa, 'proximaEtapa', 'Análise')
          // Adicionando os parâmetros novos que Renato criou para Histórico
          _.set(this.notaTarefa, 'proxima_etapa', 'Análise')
          _.set(this.notaTarefa, 'data_edicao', moment().format('YYYY-MM-DD HH:mm:ss'))
          // 5 Cria a tarefa de baixa de título
          await axiosLaravel.post('/prestacaoSimplificada/gravaTarefaPrestacao', this.notaTarefa)
            .then(response => {
              console.log('response', response.data)
              this.$snotify.clear()
              this.$snotify.success('Tarefa de baixa de título criada com sucesso!')
              this.loading.show = false
              // 6 Retorna para a tela de solicitação
              setTimeout(() => {
                this.$router.push({ name: 'prestacao-contas-simplificada' })
              }, 2000)
            })
            .catch(error => {
              console.error('Error tarefa:', error)
              console.log(error.response)
              this.loading.show = false
              this.$snotify.clear()
              this.$snotify.error('Erro ao criar a tarefa de baixa de título. Tente novamente mais tarde. ' + error.response.data.mensagem)
            })
        },
        ciente (codigo) {
          if (_.find(this.cienteDeclaracoes, ['codigo', codigo])) {
            _.remove(this.cienteDeclaracoes, ['codigo', codigo])
          } else {
            this.cienteDeclaracoes.push({'codigo': codigo, 'texto': _.get(_.find(this.declaracoes, ['codigo', codigo]), 'texto', ''), 'data': new Date(), 'usuario': {'id': this.usuarioLogado.id, 'nome': this.usuarioLogado.ds_nome_usuario}})
          }
          this.$forceUpdate()
        },
        setNota (nota, edicao = false) {
          console.log('setNota', nota)
          if (edicao) {
            // Atualiza nota em notasCadastradas pelo id e seta no table.items
            let index = this.notasCadastradas.findIndex((item) => String(item.id) === String(nota.id))
            console.log('INDEX', index)
            console.log(this.notasCadastradas[index])
            if (index !== -1) {
              this.notasCadastradas[index] = {}
              this.notasCadastradas[index] = _.cloneDeep(nota)
              this.table.items = []
              this.$forceUpdate()
              this.table.items = this.notasCadastradas
              this.$forceUpdate()
              console.log('DEPOIS', this.notasCadastradas[index])
            } else {
              this.$snotify.error('Erro ao atualizar a nota localmente, favor verificar.')
            }
          } else {
            this.notasCadastradas.push(nota)
            this.table.items = this.notasCadastradas
            this.$forceUpdate()
          }
          // Sensibiliza o valor do campo no cronograma
          this.cronograma.itens.forEach((item) => {
            if (item.Id_item === nota.fk_item_cronograma) {
              console.log('item', item)
              // Quantidade sempre será 1 para acerto do cronograma
              item.Qtde_solicitado = 1
              // Valor irá somar o total dos valores de todas as notas do item do cronograma
              item.Valor_solicitado += parseFloat(nota.valor_documento)
            }
          })
          // Sensibiliza o valor total gravado para parcela
          this.parcelaSelecionada.valor_gravado = parseFloat(this.parcelaSelecionada.valor_gravado) + parseFloat(nota.valor_documento)
          this.parcelaSelecionada.valor_gravado = this.parcelaSelecionada.valor_gravado.toFixed(2)
          this.editandoNota = false
          // Forca a atualizaçao da B-TABLE (tsc)
          this.tableDataKey++
          this.$forceUpdate()
        },
        downloadAnexo (documento) {
          this.$snotify.async('Baixando anexo: ' + documento.ds_nome_arquivo, {timeout: 0})
          axiosLaravel.get('documentos/download/' + documento.id, {responseType: 'arraybuffer'}).then((response) => {
            let ie = !!window.MSInputMethodContext && !!document.documentMode
            if (!ie) {
              let blob = new Blob([response.data], { type: documento.ds_content_type })
              let link = document.createElement('a')
              link.href = window.URL.createObjectURL(blob)
              link.download = documento.ds_nome_arquivo
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            } else {
              var bytes = new Uint8Array(resultByte)
              let blob = new Blob([bytes], { type: documento.ds_content_type })
              let link = document.createElement('blob')
              link.href = window.navigator.msSaveOrOpenBlob(blob, documento.ds_nome_arquivo)
              link.download = documento.ds_nome_arquivo
              link.click()
            }
            this.$snotify.clear()
          })
            .catch((error) => {
              this.$snotify.clear()
              console.log(error)
              this.$root.trataErro(error)
            })
        },
        onDownloadZIP () {
          this.$forceUpdate()
          this.$snotify.async('Baixando arquivos. Por favor, aguarde...', {timeout: 0})
          axiosLaravel({
            url: 'prestacaoSimplificada/downloadArquivosPrestacaoSimplificada/' + this.parcelaSelecionada.id,
            method: 'GET',
            responseType: 'blob'
          }).then((response) => {
            const blob = new Blob([response.data], { type: 'application/zip' })
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.setAttribute('download', moment().format('DDMMYYYYhhmmss') + '-' + 'prestacao-simplificada-documentos-cadastrados-' + this.dadosComplementares.numeroProjeto + '.zip')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            this.$snotify.clear()
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        }
      }
    }
  </script>
  
  <style src="../../../../static/css/prestacaoContasNovo.css">
  </style>
  