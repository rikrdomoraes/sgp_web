<template>
  <div class="box-body">
    <!-- grid -->
    <div v-if="showgrid">
      <div class="row">
        <div class="col-md-12">
          <button v-if="formEditavel" @click="inserirAtividade()"type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Nova Atividade</button>
        </div>
      </div>
      <br v-if="formEditavel">
      <!--tabela-->
      <div class="row">
        <div class="">
          <div class="table-responsive" :key="altera">
            <b-container fluid>
              <!-- Main table element -->
              <b-table show-empty
                       stacked="md"
                       :bordered="table.bordered"
                       :ref="'ATIVIDADES-' + atualizar"
                       :items="('' + modoVisualizacaoAlteracoes) === 'DETALHADO' ? _.union(table.items, _.filter(propsPropostaBackup.atividades, function(a) { return _.includes(_.get(processoSolicitacao, 'exclusao', []), a.id) }) ) : table.items"
                       :hover="table.hover"
                       :fields="table.fields"
                       :filter="table.filter"
                       :current-page="table.currentPage"
                       :per-page="table.perPage"
                       :sort-by.sync="table.sortBy"
                       :sort-desc.sync="table.sortDesc"
                       :tbody-tr-class="modificacaoLinha"
                       empty-text="Nenhum registro encontrado">
                <template slot="metas" scope="row">
                  <div v-for="meta of row.value">
                    <span>{{meta.ds_descricao}}</span>
                  </div>
                </template>
                <template slot="ds_nome" scope="row">
                  <div style="display: flex;justify-content: space-evenly;align-items: center;">
                    <span v-if="('' + modoVisualizacaoAlteracoes) === 'DETALHADO'" class="pull-left">
                      <span v-if="ehItemNovo(row.item)" class="label label-info">Novo</span>
                      <span v-if="ehItemExcluido(row.item)" class="label label-danger">Excluído</span>
                    </span>
                    <div class="input-group" style="display: inline-block;">
                      <span><strong>{{row.value}}</strong></span>
                      <span v-if="('' + modoVisualizacaoAlteracoes) === 'DETALHADO' && _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'ds_nome.0')" class="input-group-addon valorAlterado" style="text-align: left">
                        {{ _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'ds_nome.0') }}
                      </span>
                    </div>
                  </div>
                </template>

                <template slot="ds_documento_comprobatorio" scope="row">
                  <div class="input-group" style="display: inline-block;">
                    <span>{{ row.value }}</span>
                    <span class="input-group-addon valorAlterado" v-if="('' + modoVisualizacaoAlteracoes) === 'DETALHADO' && _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'ds_documento_comprobatorio.0')">
                      {{ _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'ds_documento_comprobatorio.0', '0') }}
                    </span>
                  </div>
                </template>

                <template slot="nr_periodo_inicial" scope="row">
                  <div class="input-group" style="display: inline-block;">
                    <span>{{ row.value }}</span>
                    <span class="input-group-addon valorAlterado" v-if="('' + modoVisualizacaoAlteracoes) === 'DETALHADO' && _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'nr_periodo_inicial.0')">
                      {{ _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'nr_periodo_inicial.0', '0') }}
                    </span>
                  </div>
                </template>

                <template slot="nr_periodo_final" scope="row">
                  <div class="input-group" style="display: inline-block;">
                    <span>{{ row.value }}</span>
                    <span class="input-group-addon valorAlterado" v-if="('' + modoVisualizacaoAlteracoes) === 'DETALHADO' && _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'nr_periodo_final.0')">
                      {{ _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'nr_periodo_final.0', '0') }}
                    </span>
                  </div>
                </template>

                <template slot="actions" scope="row">
                  <!-- 72422  Atividades não estavam podendo ser editadas-->
                  <div v-if="_.isNaN(row.item.percAtingimento) || row.item.percAtingimento < 1 || _.includes(['CADASTRO','ANALISE', 'DEFERIMENTO', 'FORMALIZACAO', 'APROVACAO_PROJETO', 'REVISAO'], propsProposta.ds_fase)">
                    <span v-if="ehItemExcluido(row.item)">
                      <b-button v-show="false" type="button" @click.stop="_.remove(processoSolicitacao.exclusao, row.item.id); $forceUpdate()" class="btn btn-warning btn-sm btn-flat"><i class="fa fa-refresh" aria-hidden="true"></i> Reincluir</b-button>
                    </span>
                    <span v-else>
                      <b-button v-if="formEditavel" type="button" :disabled="false" @click.stop="edita(row)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>
                      <b-button type="button" :disabled="false" class="btn btn-danger btn-sm btn-flat" v-if="formEditavel" v-confirm="{ok: retorno => exclui(row), cancel: doNothing, message: 'Deseja <b>APAGAR</b> a atividade ' + row.item.ds_nome + ' ?'}">
                        <i class="fa fa-trash" aria-hidden="true"></i> Excluir
                      </b-button>
                    </span>
                  </div>
                </template>
              </b-table>

              <b-row v-if="table.items.length > table.perPage">
                <b-col md="12" class="my-1" right>
                  <b-pagination :total-rows="table.items.length" :per-page="table.perPage" v-model="table.currentPage" class="" />
                </b-col>
              </b-row>

            </b-container>
          </div>
        </div>
      </div>
    </div>
    <!-- form -->
    <div v-if="!showgrid" style="padding-left:0" class="row well well-sm no-shadow animated fadeInDownOutUp">
      <div class="col-md-12">

        <!-- objective -->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('meta')}">
          <label for="objective" class="control-label col-md-2">Metas:</label>
          <div class="col-md-8">
            <div>
              <multiselect v-model="metaIndex" :options="propsMetas" style="font-size: 4px"
                           :multiple="true"
                           placeholder="Selecione um ou mais metas"
                           label="ds_descricao" track-by="ds_descricao"
                           :preselect-first="false"
                           selectLabel="Aperte ENTER para selecionar"
                           deselectLabel="Aperte ENTER para remover"
                           selectedLabel=""
                           name="meta"
                           v-validate="'required'"
                           :value="metaIndex">
                <template slot-scope="props"><span class="multiselect__tag"><span>{{ props.option.type }}</span><span class="custom__remove" @click="props.remove(props.option)">❌</span></span></template>
                <span slot="noResult"><font color="red">Nenhum registro localizado!</font></span>
              </multiselect>
            </div>
            <span v-if="errors.first('meta')" class="label label-danger"> {{ errors.first('meta') }}</span>
          </div>
        </div>

        <!-- Descrição da atividade -->
        <div  class="form-group required-field"
              :class="{ 'has-error' : errors.first('nome da atividade')}">
          <label class="control-label col-md-2">Nome da atividade: </label>
          <div class="col-md-8">
            <div>
              <input v-model="atividadeForm.ds_nome" name="nome da atividade" class="form-control" id="proposal-activity-name"
                     :title="'<h5>A atividade é uma ação que será realizada para atingir o objetivo acima</h5>'"
                     v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                     placeholder="Qual atividade será realizada para cumprir o objetivo acima"
                     type="text" maxlength="255" v-validate="'required'">
            </div>
            <span v-if="errors.first('nome da atividade')" class="label label-danger"> {{ errors.first('nome da atividade') }}</span>
          </div>
        </div>

        <!-- Documento comprobatório -->
        <div  class="form-group required-field"
              :class="{ 'has-error' : errors.first('Documento comprobatório')}">
          <label class="control-label col-md-2">Documento comprobatório: </label>
          <div class="col-md-4">
            <div  approval="addGoalCtrl.approval" state="addGoalCtrl.approvalState">
              <input v-model="atividadeForm.ds_documento_comprobatorio" name="Documento comprobatório" class="form-control" type="text" maxlength="255"
                     :title="'<h5>Que tipo de documento será usado para comprovar a execução da atividade?</h5>'"
                     v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                     placeholder="Informe o tipo de documento que será usado para comprovar a execução da atividade"
                     v-validate="'required'">
            </div>
            <span v-if="errors.first('Documento comprobatório')" class="label label-danger"> {{ errors.first('Documento comprobatório') }}</span>
          </div>
        </div>

        <!-- Período de Início e Fim (duração da atividade) -->
        <div  class="col-md-12" style="margin: 0 0 20px -20px !important;">
 
        <div  class="required-field"
              :class="{ 'has-error' : errors.first('Período de início')}">
          <label class="control-label col-md-2">Período da atividade: </label>
          <div class="col-md-2">
            <div>
              Início:
              <input v-model="atividadeForm.nr_periodo_inicial" name="Período de início" class="form-control text-left" type="number" min="1" @change="alteraPeriodo"
                      v-validate="'required|min_value:1|max_value:' + terminoAtividade">
            </div>
            <span v-if="errors.first('Período de início')" class="label label-danger"> {{ errors.first('Período de início') }}</span>
          </div>
        </div>

        <div  class="required-field" :class="{ 'has-error' : errors.first('Período de fim')}">
          <div class="col-md-2">
            <div>
              Fim:
              <input v-model="atividadeForm.nr_periodo_final" name="Período de fim" class="form-control text-left" type="number" min="1" @change="alteraPeriodo"
                      v-validate="'required|min_value:' + inicioAtividade + '|max_value:' + periodoProjeto">
            </div>
            <span v-if="errors.first('Período de fim')" class="label label-danger"> {{ errors.first('Período de fim') }}</span>
          </div>
        </div>

        </div>

        <!-- buttons -->
        <div class="form-group">
          <div class="col-md-8 col-md-offset-2">
            <button @click="onAdd(meta, atividadeForm)" type="button" class="btn btn-confirm btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Ok</button>
            <button @click="onCancel" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'atividades',
      data () {
        return {
          showgrid: true,
          table: {
            items: this.propsAtividades,
            filter: null,
            hover: true,
            bordered: true,
            currentPage: 1,
            perPage: 100,
            fields: [
              { key: 'metas', label: 'Metas', sortable: true, thStyle: 'text-align: center; width: 30%;', class: 'text-left' },
              { key: 'ds_nome', label: 'Atividades', sortable: true, thStyle: 'text-align: center; width: 30%;', class: 'text-left' },
              { key: 'ds_documento_comprobatorio', label: 'Documento comprobatório', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'nr_periodo_inicial', label: 'Início', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'nr_periodo_final', label: 'Fim', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 13%', class: 'text-center' }
            ]
          },
          meta: {},
          metaIndex: [],
          formasContratacao: [],
          editando: null,
          formEditavel: false,
          indexEdit: 0,
          atividadeForm: {
            nr_periodo_final: null,
            itens_orcamentos: [],
            metas: {},
            ds_nome: '',
            nr_periodo_inicial: null,
            ds_documento_comprobatorio: ''
          }, // formulário de edição e nova meta os dados serão guardados aqui
          numeracaoAtividadeNova: 0,
          terminoAtividade: 1,
          inicioAtividade: 1,
          periodoProjeto: 1
        }
      },
      props: ['propsObjetivos', 'propsMetas', 'propsAtividades', 'meses', 'propsProposta', 'editavel', 'novaAtividade', 'propsPropostaBackup',
        'modoVisualizacaoAlteracoes', // opcional - exibe as alterações realizadas. Se o valor for RESUMIDO mostra só o total de modificações, se DETALHADO mostrará quais alterações houveram. Sem valor, null ou outra opção, não mostrará as modificações
        'atualizar', // opcional - valor qualquer somente para disparar atualização
        'processoSolicitacao' // opcional - recebe o objeto da solicitação de alteração
      ],
      computed: {
        altera () {
          for (let i = 0; i < this.propsMetas.length; i++) {
            for (let j = 0; j < this.propsAtividades.length; j++) {
              for (let x = 0; x < this.propsAtividades[j].metas.length; x++) {
                if (this.propsMetas[i].id === this.propsAtividades[j].metas[x].id) {
                  // Não estava atulizando metas.objetivos.
                  this.propsAtividades[j].metas[x] = _.cloneDeep(this.propsMetas[i])
                }
              }
            }
          }
          this.$nextTick(() => {
            this.table.items = this.propsAtividades
          })
          this.$forceUpdate()
        }
      },
      watch: {
        propsAtividades: function () {
          this.table.items = this.propsAtividades
          this.metas = this.propsMetas
          this.table.items.forEach((atividade) => {
            if (this.ehAtividadeNova(atividade)) {
              this.numeracaoAtividadeNova++
            }
          })
        },
        atualizar: function () {
          this.$forceUpdate()
        },
        propsMetas: function () {
          for (let i = 0; i < this.propsMetas.length; i++) {
            for (let j = 0; j < this.propsAtividades.length; j++) {
              for (let x = 0; x < this.propsAtividades[j].metas.length; x++) {
                if (this.propsMetas[i].id === this.propsAtividades[j].metas[x].id) {
                  this.propsAtividades[j].metas[x].ds_descricao = _.cloneDeep(this.propsMetas[i].ds_descricao)
                }
              }
            }
          }
          this.$nextTick(() => {
            this.table.items = this.propsAtividades
          })
          this.$forceUpdate()
        },
        editavel: function () {
          this.formEditavel = this.editavel
        },
        showgrid: function () {
          this.$emit('validacaoAtividades', {'tag': 'atividadeEditando', 'ativo': (!this.showgrid), 'tipo': 'restricao', 'acao': null, 'mensagem': '<span class=\'restricaoEditandoInformacao\'>Atividade em edição<span>'})
        },
        novaAtividade: function () {
          this.inserirAtividade()
        },
        'table.items': function () {
          this.$emit('atividadeAdicionada', this.table.items)
        }
      },
      mounted: function () {
      },
      created: function () {
        this.formEditavel = this.editavel
        if (!this.formEditavel) {
          this.table.fields = _.reject(this.table.fields, {key: 'actions'})
        }
      },
      methods: {
        alteraPeriodo () {
          this.inicioAtividade = _.get(this.atividadeForm, 'nr_periodo_inicial', 1)
          this.terminoAtividade = _.get(this.atividadeForm, 'nr_periodo_final', parseInt(this.propsProposta.nr_periodos))
          this.periodoProjeto = this.meses
        },
        onCancel () {
          this.metaIndex = []
          this.atividadeForm = {}
          this.showgrid = true
          this.editando = null
        },
        reajustarItensNoPeriodo (inicio, termino, item) {
          console.log(' >>> reajustarItensNoPeriodo (inicio, termino, item)', inicio, termino, item)
          // Recebe o item para ajuste dentro do período de inicio e termino novos
          let itemTipo = ('' + item.fk_itens).substr(0, 1) // P, S, C
          let itemOrigem = ('' + item.origem).substr(0, 1) // 1, 2, 5
          let mensalizacao = _.get(item, 'orcamentos_mensalizados', [])
          if (mensalizacao.length > 0) {
            let mensalizacaoAgrupada = _.groupBy(mensalizacao, 'fk_itens_orcamentos')
            let novaMensalizacao = []
            _.forEach(mensalizacaoAgrupada, function (periodos, fkProcesso) {
              let totalValor = _.sumBy(periodos, 'valor')
              let totalQuantidade = _.sumBy(periodos, 'quantidade')
              if (itemOrigem === '2') { // Se for contrapartida
                // Jogar tudo no ultimo mês do novo periodo
                novaMensalizacao.push({'id': null, 'periodo': termino, 'quantidade': totalQuantidade, 'valor': totalValor, 'fk_itens_orcamentos': item.id})
                console.log('     Contrapartida', {'id': null, 'periodo': termino, 'quantidade': totalQuantidade, 'valor': totalValor, 'fk_itens_orcamentos': item.id})
              } else if (itemTipo === 'P') { // Não é contraparida, Se for produto
                // Jogar tudo no primeiro mês do novo periodo
                novaMensalizacao.push({'id': null, 'periodo': inicio, 'quantidade': totalQuantidade, 'valor': totalValor, 'fk_itens_orcamentos': item.id})
                console.log('     Produto', {'id': null, 'periodo': inicio, 'quantidade': totalQuantidade, 'valor': totalValor, 'fk_itens_orcamentos': item.id})
              } else if (itemTipo === 'S') { // Não é contraparida, Se for serviço
                let numeroPeriodos = termino - inicio + 1
                let valorRateio = Math.trunc(totalValor / numeroPeriodos)
                let quantidadeRateio = Math.round((totalQuantidade / numeroPeriodos) * 100) / 100 // duas decimais
                console.log('     Servico')
                console.log('        numeroPeriodos', numeroPeriodos)
                console.log('        valorRateio', valorRateio)
                console.log('        quantidadeRateio', quantidadeRateio)
                // Rateio nos meses do novo período
                for (var i = inicio; i <= termino; i++) {
                  if (termino === i) {
                    valorRateio = totalValor - (valorRateio * (numeroPeriodos - 1))
                    quantidadeRateio = totalQuantidade - (quantidadeRateio * (numeroPeriodos - 1))
                  }
                  novaMensalizacao.push({'id': null, 'periodo': i, 'quantidade': quantidadeRateio, 'valor': valorRateio, 'fk_itens_orcamentos': item.id})
                  console.log('        mensalização rateio', {'id': null, 'periodo': i, 'quantidade': quantidadeRateio, 'valor': valorRateio, 'fk_itens_orcamentos': item.id})
                }
              } else {
                alert('Algo de errado com o item #' + item.id)
                console.log('Verificar erro com o item', item)
              }
            })
            mensalizacao = novaMensalizacao
            console.log('mensalização', mensalizacao)
            // Reescrever mensalização nova sobre a anterior
          }
          return item
        },
        //
        onAdd () {
          // let atividadeBackup = _.find(this.table.items, ['id', this.atividadeForm.id]) || {nr_periodo_final: null, itens_orcamentos: [], metas: {}, ds_nome: '', nr_periodo_inicial: null, ds_documento_comprobatorio: ''}
          let atividadeBackup = this.table.items[this.indexEdit] || {nr_periodo_final: null, itens_orcamentos: [], metas: {}, ds_nome: '', nr_periodo_inicial: null, ds_documento_comprobatorio: ''}
          // Se houver alteração de período entre antes e depois
          if (!_.isEqualWith(atividadeBackup, this.atividadeForm, (a, b) => { return ('' + a.nr_periodo_inicial) === ('' + b.nr_periodo_inicial) && ('' + a.nr_periodo_final) === ('' + b.nr_periodo_final) })) {
            let periodoInicial = _.toNumber(this.atividadeForm.nr_periodo_inicial)
            let periodoFinal = _.toNumber(this.atividadeForm.nr_periodo_final)
            if ((_.get(this.atividadeForm, 'itens_orcamentos', [])).length > 0) { // Ver se tem itens de orçamento
              this.atividadeForm.itens_orcamentos.forEach((item) => {
                item = this.reajustarItensNoPeriodo(periodoInicial, periodoFinal, item)
              })
            }
          }
          this.$validator.validateAll().then((result) => {
            if (result) {
              if (_.isNull(this.atividadeForm.id)) {
                // Atividade Nova Inserindo
                this.atividadeForm.metas = this.metaIndex
                _.set(this.atividadeForm, 'id', 'novo-' + this.numeracaoAtividadeNova++)
                this.table.items.push(this.atividadeForm)
              } else {
                // Atividade Nova ou Já Existente Editando
                // let idxAtividadeEditando = _.findIndex(this.table.items, ['id', this.atividadeForm.id])
                let idxAtividadeEditando = this.indexEdit
                this.atividadeForm.metas = this.metaIndex
                _.set(this.table, ['items', idxAtividadeEditando], this.atividadeForm)
                this.$forceUpdate()
                // Atualiza endereço de memória
                let items = _.cloneDeep(this.table.items)
                this.table.items = items
                this.$emit('atividadeAdicionada', this.table.items)
              }
              this.onCancel()
              this.$emit('acaoAtualizaSolicitacoes', new Date())
              this.$forceUpdate()
            }
          })
        },
        exclui (row) {
          if (_.has(row.item, 'itens_orcamentos') && row.item.itens_orcamentos.length > 0) {
            this.$snotify.error('A Atividade não pode ser excluída pois possui ' + row.item.itens_orcamentos.length + ' item(s) vinculado(s).')
          } else {
            this.table.items.splice(row.index, 1)
          }
        },
        inserirAtividade () {
          this.metaIndex = []
          this.atividadeForm = {id: null, itens_orcamentos: []}
          this.showgrid = false
          this.editando = true
          this.alteraPeriodo()
        },
        ehAtividadeNova (atividade) {
          return _.includes(('' + atividade.id), 'novo')
        },
        edita (row) {
          // console.log('this.table.items', this.table.items)
          // console.log('ROW', row)
          this.indexEdit = row.index
          this.metaIndex = row.item.metas
          // cria um novo objeto atividade, se fizesse só '=' iria somente apontar para o ponto da memoria, mas
          // queremos realmente criar um outro objeto
          this.atividadeForm = Object.assign({}, row.item)
          // Aqui apontamos a nova variavel global para a atividade que esta no objeto meta que estamos trabalhando
          this.showgrid = false
          this.editando = true
          this.alteraPeriodo()
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

</style>
