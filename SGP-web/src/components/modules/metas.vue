<template>
  <div class="box-body">
    <!-- grid -->
    <div v-show="showgrid">
      <div class="row">
        <div class="col-md-12" v-if="somenteLeitura !== false">
          <button v-if="formEditavel" @click="showgrid = !showgrid" tooltip="Adiciona uma meta" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Nova Meta</button>
        </div>
      </div>
      <br v-if="formEditavel">
      <!--tabela-->
      <div class="row">
        <div class="">
          <div class="table-responsive" ref="tabelaMetas" :key="altera">
            <b-container fluid>
              <!-- Main table element -->
              <b-table show-empty
                       stacked="md"
                       :bordered="table.bordered"
                       :items="('' + modoVisualizacaoAlteracoes) === 'DETALHADO' ? _.union(table.items, _.filter(propsPropostaBackup.metas, function(m) { return _.includes(_.get(processoSolicitacao, 'exclusao', []), m.id) }) ) : table.items"
                       :hover="table.hover"
                       :fields="table.fields"
                       :filter="table.filter"
                       :current-page="table.currentPage"
                       :per-page="table.perPage"
                       :sort-by.sync="table.sortBy"
                       :sort-desc.sync="table.sortDesc"
                       :tbody-tr-class="modificacaoLinha"
                       empty-text="Nenhum registro encontrado">
                <template slot="objetivos" scope="row">
                  <div v-for="obj of row.value">
                  <span>{{obj.ds_descricao}}</span>
                  </div>
                </template>
                <template slot="ds_descricao" scope="row">
                  <div style="display: flex;justify-content: space-evenly;align-items: center;">
                    <span v-if="('' + modoVisualizacaoAlteracoes) === 'DETALHADO'" class="pull-left">
                      <span v-if="ehItemNovo(row.item)" class="label label-info">Novo</span>
                      <span v-if="ehItemExcluido(row.item)" class="label label-danger">Excluído</span>
                    </span>
                    <div class="input-group" style="display: inline-block;">
                      <span><strong>{{row.value}}</strong></span>
                      <span v-if="('' + modoVisualizacaoAlteracoes) === 'DETALHADO' && _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'ds_descricao.0')" class="input-group-addon valorAlterado" style="text-align: left">
                        {{ _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'ds_descricao.0') }}
                      </span>
                    </div>
                  </div>
                </template>

                <template slot="nr_quantidade" scope="row">
                  <div class="input-group" style="display: inline-block;">
                    <span class="text-bold">{{ row.value }}</span>
                    <span class="input-group-addon valorAlterado" v-if="('' + modoVisualizacaoAlteracoes) === 'DETALHADO' && _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'nr_quantidade.0')">
                      {{ _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'nr_quantidade.0', '0') }}
                    </span>
                  </div>
                </template>

                <template slot="ds_unidade_medida" scope="row">
                  <div class="input-group" style="display: inline-block;">
                    <span>{{ row.value }}</span>
                    <span class="input-group-addon valorAlterado" v-if="('' + modoVisualizacaoAlteracoes) === 'DETALHADO' && _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'ds_unidade_medida.0')">
                      {{ _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'ds_unidade_medida.0', '0') }}
                    </span>
                  </div>
                </template>

                <template slot="ds_indicadores_execucao" scope="row">
                  <div class="input-group" style="display: inline-block; max-width: 380px">
                    <span>{{ row.value }}</span>
                    <span class="input-group-addon valorAlterado" v-if="('' + modoVisualizacaoAlteracoes) === 'DETALHADO' && _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'ds_indicadores_execucao.0')">
                      {{ _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'ds_indicadores_execucao.0', '0') }}
                    </span>
                  </div>
                </template>

                <template slot="actions" scope="row">
                  <span v-if="ehItemExcluido(row.item)">
                    <b-button v-show="false" type="button" @click.stop="_.remove(processoSolicitacao.exclusao, row.item.id); $forceUpdate()" class="btn btn-warning btn-sm btn-flat"><i class="fa fa-refresh" aria-hidden="true"></i> Reincluir</b-button>
                  </span>
                  <span v-else-if="somenteLeitura !== false">
                    <b-button v-if="formEditavel" type="button" :disabled="false" @click.stop="edita(row)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>
                    <b-button v-if="formEditavel" type="button" :disabled="false" @click.stop="exclui(row)" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</b-button>
                  </span>
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
             :class="{ 'has-error' : errors.first('objetivo')}">
          <label class="control-label col-md-2">Objetivo Específico:</label>
          <div class="col-md-8">
            <div>
              <multiselect v-model="objetivoIndex" :options="propsObjetivos" style="font-size: 4px"
                           :multiple="true"
                           placeholder="Selecione um ou mais objetivos"
                           label="ds_descricao" track-by="ds_descricao"
                           :preselect-first="false"
                           selectLabel="Aperte ENTER para selecionar"
                           deselectLabel="Aperte ENTER para remover"
                           selectedLabel=""
                           name="objetivo"
                           v-validate="'required'"
                           :value="objetivoIndex">
                <template slot-scope="props"><span class="multiselect__tag"><span>{{ props.option.type }}</span><span class="custom__remove" @click="props.remove(props.option)">❌</span></span></template>
                <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
              </multiselect>
            </div>
            <span v-if="errors.first('objetivo')" class="label label-danger"> {{ errors.first('objetivo') }}</span>
          </div>
        </div>

        <!-- Descrição -->
        <div  class="form-group required-field"
              :title="'<h5>A meta deve ser algo quantificado</h5>'"
              v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
              :class="{ 'has-error' : errors.first('O que')}">
          <label class="control-label col-md-2">Qual a meta e quanto ela realizará? </label>
          <div class="col-md-8">
            <div  approval="addGoalCtrl.approval" state="addGoalCtrl.approvalState">
              <input v-model="meta.ds_descricao" name="O que" class="form-control" type="text" maxlength="255"
                     placeholder="Descreva a meta e quanto pretende realizar com ela"
                     v-validate="'required'">
            </div>
            <span v-if="errors.first('O que')" class="label label-danger"> {{ errors.first('O que') }}</span>
          </div>
        </div>

        <!-- Quanto -->
        <div  class="form-group">
          <div  class="required-field" :class="{ 'has-error' : errors.first('quantidade')}">
            <label for="quantidade" class="control-label col-md-2">Quanto?</label>
            <div class="col-md-2">
              <div>
                <input v-model="meta.nr_quantidade" name="quantidade" id="quantidade" class="form-control text-right" type="number" min="1" max="2147483647"
                       step="1" onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                       :title="'<h5>Informe o número a que se refere a quantidade da meta acima</h5>'"
                       v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                       v-validate="'required'">
              </div>
              <span v-if="errors.first('quantidade')" class="label label-danger"> {{ errors.first('quantidade') }}</span>
            </div>
          </div>

          <!-- Unidade de Medida -->
          <div  class="required-field" :class="{ 'has-error' : errors.first('unidade de medida')}">
            <label for="unidade de medida" class="control-label col-md-2">Unidade de medida:</label>
            <div class="col-md-2">
              <div>
                <input v-model="meta.ds_unidade_medida" name="unidade de medida" id="unidade de medida" class="form-control" type="text" maxlength="50"
                       :title="'<h5>O número ao lado é medido em qual unidade?  Exemplos:<br/>Caixas,<br/>Reais,<br/>Unidades,<br/>Metros Quadrados etc</h5>'"
                       v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                       v-validate="'required'">
              </div>
              <span v-if="errors.first('unidade de medida')" class="label label-danger"> {{ errors.first('unidade de medida') }}</span>
            </div>
          </div>
        </div>

        <!-- Indicadores -->
        <div  class="form-group required-field"
              :class="{ 'has-error' : errors.first('Indicadores de execução')}">
          <label class="control-label col-md-2">Indicadores de execução:</label>
          <div class="col-md-2">
            <div  approval="addGoalCtrl.approval" state="addGoalCtrl.approvalState">
              <select v-model="meta.ds_indicadores_execucao" name="Indicadores de execução" class="form-control"
                      v-validate="'required'">
                <option :value="indicador" v-for="(indicador, index) in listaIndicadores">{{indicador}}</option>
              </select>
            </div>
            <span v-if="errors.first('Indicadores de execução')" class="label label-danger"> {{ errors.first('Indicadores de execução') }}</span>
          </div>
        </div>

        <div  class="form-group required-field" v-if="meta.ds_indicadores_execucao === 'Outros'"
              :class="{ 'has-error' : errors.first('outros')}">
          <label class="control-label col-md-2">Descrição do indicador:</label>
          <div class="col-md-4">
            <div>
              <input v-model="meta.ds_descricao_outros" name="outros" class="form-control" type="text" maxlength="50"
                     v-validate="'required'">
            </div>
            <span v-if="errors.first('outros')" class="label label-danger"> {{ errors.first('outros') }}</span>
          </div>
        </div>


        <!-- Botões -->
        <div class="form-group">
          <div class="col-md-8 col-md-offset-2">
            <button @click="onAdd" type="button" class="btn btn-confirm btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Ok</button>
            <button @click="onCancel" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
          </div>
        </div>

      </div>
    </div>



  </div>


</template>

<script>
  export default {
    name: 'metas',
    data () {
      return {
        showgrid: true,
        table: {
          items: this.propsMetas,
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          perPage: 100,
          fields: [
            { key: 'objetivos', label: 'Objetivos', sortable: true, thStyle: 'text-align: center; width: 30%;', class: 'text-left' },
            { key: 'ds_descricao', label: 'Metas', sortable: true, thStyle: 'text-align: center; width: 30%;', class: 'text-left' },
            { key: 'nr_quantidade', label: 'Quanto', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'ds_unidade_medida', label: 'Unidade', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'ds_indicadores_execucao', label: 'Indicador', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 13%', class: 'text-center' }
          ]
        },
        objetivos: {},
        formasContratacao: [],
        editando: false,
        formEditavel: false,
        meta: {
          id: 0,
          objetivos: {}
        },
        contador: 0,
        metaTabela: {},
        metaEdicao: '',
        objetivoIndex: [],
        listaIndicadores: [
          'Capacitação realizada',
          'Consultoria/assessoria contratada',
          'Máquina/equipamento adquirido',
          'Obra concluída',
          'Produto adquirido',
          'Seguro contratado',
          'Serviço realizado',
          'Outros'
        ]
      }
    },
    props: ['propsObjetivos', 'propsMetas', 'propsAtividades', 'propsProposta', 'somenteLeitura', 'editavel', 'propsPropostaBackup',
      'modoVisualizacaoAlteracoes', // opcional - exibe as alterações realizadas. Se o valor for RESUMIDO mostra só o total de modificações, se DETALHADO mostrará quais alterações houveram. Sem valor, null ou outra opção, não mostrará as modificações
      'atualizar', // opcional - valor qualquer somente para disparar atualização
      'processoSolicitacao' // opcional - recebe o objeto da solicitação de alteração
    ],
    watch: {
      propsMetas: function () {
      },
      propsObjetivos: function () {
        for (let i = 0; i < this.propsObjetivos.length; i++) {
          for (let j = 0; j < this.propsMetas.length; j++) {
            for (let x = 0; x < this.propsMetas[j].objetivos.length; x++) {
              if (this.propsObjetivos[i].id === this.propsMetas[j].objetivos[x].id) {
                this.propsMetas[j].objetivos[x].ds_descricao = _.cloneDeep(this.propsObjetivos[i].ds_descricao)
              }
            }
          }
        }
        this.$nextTick(() => {
          this.table.items = this.propsMetas
        })
        this.$forceUpdate()
      },
      editavel: function () {
        this.formEditavel = this.editavel
      },
      'table.items': function () {
        this.$emit('metaAdicionada', this.table.items)
      },
      showgrid: function () {
        this.$emit('validacaoMetas', {'tag': 'metaEditando', 'ativo': (!this.showgrid), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Meta em edição'})
      }
    },
    computed: {
      altera () {
        for (let i = 0; i < this.propsObjetivos.length; i++) {
          for (let j = 0; j < this.propsMetas.length; j++) {
            for (let x = 0; x < this.propsMetas[j].objetivos.length; x++) {
              if (this.propsObjetivos[i].id === this.propsMetas[j].objetivos[x].id) {
                this.propsMetas[j].objetivos[x].ds_descricao = _.cloneDeep(this.propsObjetivos[i].ds_descricao)
                this.$forceUpdate()
              }
            }
          }
        }
        this.$nextTick(() => {
          this.table.items = this.propsMetas
        })
        this.$forceUpdate()
      }
    },
    mounted: function () {
    },
    created: function () {
      this.formEditavel = this.editavel
      if (this.$router.currentRoute.name === 'relatorio-analise' || !this.formEditavel) { // Exclui a coluna de Ações se estiver no relatório de análise ou não estiver em edição
        this.table.fields = _.reject(this.table.fields, {key: 'actions'})
        this.$forceUpdate()
      }
    },
    methods: {
      buscaMetas (itens) {
        for (let i in itens) {
          if (itens[i].ds_descricao === 'Não informado') {
            for (let j in itens[i].metas) {
              if (!itens[i].metas[j].hasOwnProperty('ds_unidade_medida')) {
                itens[i].metas.splice(j, 1)
              }
            }
          }
        }
        return itens
      },
      onCancel () {
        this.meta = {}
        this.objetivoIndex = []
        this.metaEdicao = ''
        this.showgrid = true
        this.editando = false
      },
      onAdd () {
        let vm = this
        this.$validator.validateAll().then((result) => {
          if (result) {
            if (_.find(this.table.items, function (m) { return vm.metaEdicao !== vm.meta.ds_descricao && m.ds_descricao === vm.meta.ds_descricao })) {
              this.$dialog.alert('Já existe uma meta com essa descrição', {html: true, animation: 'fade', customClass: 'avisoInfo'})
            } else {
              // Se NÃO estiver em forma de edição então adiciona na tabela
              if (this.editando === true) {
                this.meta.objetivos = this.objetivoIndex
                for (let i in this.meta) this.metaTabela[i] = this.meta[i]
              } else {
                this.meta.objetivos = this.objetivoIndex
                this.contador = this.contador + 1
                this.meta.id = _.cloneDeep(this.contador + this.meta.ds_descricao)
                this.table.items.push(this.meta)
                this.$forceUpdate()
              }
              this.onCancel()
              this.$emit('acaoAtualizaSolicitacoes', new Date())
            }
          }
        })
      },
      exclui (row) {
        let vm = this
        this.$dialog.confirm('Deseja <b>APAGAR</b> a meta:<br/>' + row.item.ds_descricao + '?', {html: true, animation: 'fade', customClass: 'avisoConfirmacao'}).then(function (dialog) {
          let qtdAtividades = _.chain(vm.propsProposta.atividades).map('metas').flatten().filter({ds_descricao: row.item.ds_descricao}).value().length
          if (qtdAtividades > 0) {
            vm.$dialog.alert('Deve apagar <b>' + qtdAtividades + ' atividades</b> vinculadas a esta meta primeiro', {html: true, animation: 'fade', customClass: 'avisoInfo'})
          } else {
            vm.table.items.splice(row.index, 1)
          }
          vm.$forceUpdate()
        }).catch(function () {
          console.log('Aviso de Confirmações fechado SEM confirmar exclusão de metas')
        })
      },
      edita (row) {
        this.objetivoIndex = row.item.objetivos
        this.meta = Object.assign({}, row.item)
        this.metaTabela = row.item
        this.metaEdicao = row.item.ds_descricao
        this.showgrid = false
        this.editando = true
      },
      selecionado (objetivos) {
        console.log('objetivos', objetivos)
        console.log('this.meta', this.meta)
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
