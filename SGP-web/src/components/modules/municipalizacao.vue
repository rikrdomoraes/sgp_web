<template>
  <div class="box-body municipalizacao">
    <!--Grid-->
    <div class="column start-centered municipio-duplicidade-container" v-if="travarMunicipios && existeMunicipioRepetido.length > 0">
      <div><i class="fa fa-exclamation-circle" aria-hidden="true"></i> Atenção, existe(m) município(s) cadastrado(s) em duplicidade, favor regularizar antes de criar o número do projeto</div>
      <div>
        <div v-for="municipio in existeMunicipioRepetido">
          - {{ municipio.ds_municipio }} / {{ municipio.ds_uf }}
        </div>
      </div>
    </div>
    <div v-show="mostraGrid">
      <div class="row">
        <div class="col-md-12" v-if="formEditavel">          
          <button @click="onNew" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Novo Município</button>
          <button v-if="table.items.length > 0 && _.includes(layout, 'COM_BOTOES_DISTRIBUICAO')" @click="distribuirParticipantes" type="button" class="btn btn-back btn-flat"
                  :title="'<h5>Redistribuirá proporcionalmente, o total de <span class=\'realce\'>' + totais.participantes.projeto + '</span> participantes desse projeto nos <span class=\'realce\'>' + table.items.length + '</span> municípios abaixo (exceto contrapartidas)</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
            <i class="fa fa-server" aria-hidden="true"></i> Participantes
          </button>
          <button v-if="!visaoReduzida && table.items.length > 0 && _.includes(layout, 'COM_BOTOES_DISTRIBUICAO')" @click="distribuirValores" type="button" class="btn btn-back btn-flat"
                  :title="'<h5>Redistribuirá proporcionalmente, o valor total de cada origem do recurso (fase) nos <span class=\'realce\'>' + table.items.length + '</span> municípios abaixo</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
            <i class="fa fa-server" aria-hidden="true"></i> Valores</button>
        </div>
      </div>
      <br v-if="formEditavel">
      <div class="row">
        <div class="">

          <b-container fluid>
            <!-- Main table element -->
            <div style="max-height:600px; overflow-y:auto; overflow-x:hidden; margin-bottom: 1rem;">
              <b-table show-empty
                      stacked="md"
                      :bordered="table.bordered"
                      :items="('' + modoVisualizacaoAlteracoes) === 'DETALHADO' ? _.union(table.items, _.filter(propsPropostaBackup.municipalizacao, function(m) { return _.includes(_.get(processoSolicitacao, 'exclusao', []), m.id) }) ) : table.items"
                      :hover="table.hover"
                      :fields="table.fields"
                      :filter="table.filter"
                      :current-page="table.currentPage"
                      :per-page="table.perPage"
                      :sort-by.sync="table.sortBy"
                      :sort-desc.sync="table.sortDesc"
                      :tbody-tr-class="modificacaoLinha"
                      empty-text="Nenhum registro encontrado">

                <template slot="ds_fase" scope="row" v-if="!visaoReduzida">
                  <div class="input-group" style="display: inline-table;">
                    <span v-if="('' + modoVisualizacaoAlteracoes) === 'DETALHADO'" class="pull-left">
                      <span v-if="ehItemNovo(row.item)" class="label label-info">Novo</span>
                      <span v-if="ehItemExcluido(row.item)" class="label label-danger">Excluído</span>
                    </span>
                    <span>{{ etiquetaOrigemRecurso(row.value) }}</span>
                    <span v-if="('' + modoVisualizacaoAlteracoes) === 'DETALHADO' && _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'ds_fase.0')" class="input-group-addon valorAlterado">
                      {{ etiquetaOrigemRecurso('' + _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'ds_fase.0', '')) }}
                    </span>
                  </div>
                </template>

                <template slot="ds_cep" scope="row">
                  <div class="input-group" style="display: inline-table;">
                    <span>{{ ('' + row.value) | cep }}</span>
                    <span v-if="('' + modoVisualizacaoAlteracoes) === 'DETALHADO' && _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'ds_cep.0')" class="input-group-addon valorAlterado">
                      {{ ('' + _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'ds_cep.0', '')) | cep }}
                    </span>
                  </div>
                </template>

                <template slot="ds_municipio" scope="row">
                  <div class="input-group" style="display: inline-table;">
                    <span>{{ row.value }} <span v-if="_.has(row.item, 'ds_uf')"> / {{row.item.ds_uf}}</span></span>
                    <span v-if="('' + modoVisualizacaoAlteracoes) === 'DETALHADO' && _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'ds_municipio.0')" class="input-group-addon valorAlterado">
                      {{ _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'ds_municipio.0', '') }}
                    </span>
                  </div>
                </template>

                <template slot="dc_valor_municipio" scope="row" v-if="!visaoReduzida">
                  <div class="input-group" style="display: inline-table;">
                    <span>{{ row.value | real }}</span>
                    <span v-if="('' + modoVisualizacaoAlteracoes) === 'DETALHADO' && _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'dc_valor_municipio.0')" class="input-group-addon valorAlterado">
                      {{ _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'dc_valor_municipio.0', '') | real }}
                    </span>
                  </div>
                </template>

                <template slot="nr_total_participantes" scope="row">
                  <div class="input-group" style="display: inline-table;">
                    <span>{{ row.value }}</span>
                    <span v-if="('' + modoVisualizacaoAlteracoes) === 'DETALHADO' && _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'nr_total_participantes.0')" class="input-group-addon valorAlterado">
                      {{ _.get(_.find(_.get(processoSolicitacao, 'alteracao', []), ['id', row.item.id]), 'nr_total_participantes.0', '') }}
                    </span>
                  </div>
                </template>

                <template slot="actions" scope="row">
                  <div v-if="!_.has($route.params, 'numero') || formEditavel">
                    <span v-if="ehItemExcluido(row.item)">
                      <b-button type="button" @click.stop="reincluir(row)" class="btn btn-back btn-flat btn-sm"><i class="fa fa-refresh" aria-hidden="true"></i> Desfazer</b-button>
                    </span>
                    <span v-else>
                      <b-button type="button" :disabled="false" @click.stop="edita(row)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>
                      <b-button type="button" :disabled="false"  class="btn btn-danger btn-sm btn-flat" v-confirm="{ok: retorno => exclui(row.index), cancel: doNothing, message: 'Deseja <b>APAGAR</b> o municipio ' + row.item.ds_municipio + ' ?'}">
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

            </div><!-- limitador vertical da tabela de municipios -->

          </b-container>

          <div class="">
            <div class="col-md-12">
              <table class="totais">
                <tr><!-- Labels-->
                  <td class="centralizado" v-if="!visaoReduzida && totais.valor.projeto.fbb != 0">Total Fundação</td>
                  <td class="centralizado" v-if="!visaoReduzida && totais.valor.projeto.parceiros != 0">Total Parceiro Estratégico</td>
                  <td class="centralizado" v-if="!visaoReduzida && totais.valor.projeto.contrapartidas != 0">Total Contrapartida</td>
                  <td class="centralizado" v-if="!visaoReduzida">Total do Projeto</td>
                  <td class="centralizado">Participantes</td>
                </tr>

                <tr><!-- Totais distribuídos-->
                  <td class="centralizado" v-if="!visaoReduzida && totais.valor.projeto.fbb != 0">
                    <span class="valor" :title="'<h5>Valor total da Fundação que já distribuiu em <span class=\'realce\'>' + (_.countBy(table.items, function (m) { return m.ds_fase === '1' }))['true'] + '</span> município(s) acima</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                        {{totais.valor.municipalizados.fbb | real}}</span>
                  </td>
                  <td class="centralizado" v-if="!visaoReduzida && totais.valor.projeto.parceiros != 0">
                    <span class="valor" :title="'<h5>Valor total de Parceiro Estrtégico que já distribuiu em <span class=\'realce\'>' + (_.countBy(table.items, function (m) { return m.ds_fase === '5' }))['true'] + '</span> município(s) acima</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                        {{totais.valor.municipalizados.parceiros | real}}</span>
                  </td>
                  <td class="centralizado" v-if="!visaoReduzida && totais.valor.projeto.contrapartidas != 0">
                    <span class="valor" :title="'<h5>Valor total de Contrapartida que já distribuiu em <span class=\'realce\'>' + (_.countBy(table.items, function (m) { return m.ds_fase === '2' }))['true'] + '</span> município(s) acima</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                        {{totais.valor.municipalizados.contrapartidas | real}}</span>
                  </td>
                  <td class="centralizado" v-if="!visaoReduzida">
                    <span class="valor" :title="'<h5>Valor total do projeto que já distribuiu em <span class=\'realce\'>' + table.items.length + '</span> registros(s) acima</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                        {{(totais.valor.municipalizados.fbb + totais.valor.municipalizados.parceiros + totais.valor.municipalizados.contrapartidas) | real}}</span>
                  </td>
                  <td class="centralizado">
                    <span class="valor" :title="'<h5>Total de participantes distribuídos em <span class=\'realce\'>' + table.items.length + '</span> registros(s) acima</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                        {{totais.participantes.municipalizados}}</span>
                  </td>
                </tr>

                <tr><!-- Restante pendente de distribuição-->
                  <td class="centralizado" v-if="!visaoReduzida && totais.valor.projeto.fbb != 0">
                    <span class="valor atencao" :title="'<h5>' + (totais.valor.restantes.fbb < 0 ? 'Ultrapassou o valor máximo de R$ ' + totais.valor.projeto.fbb : 'Valor ainda Restante da Fundação que deve informar para qual município será destinado') + '</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }"
                          v-if="Math.abs(totais.valor.restantes.fbb) > 0.1">{{totais.valor.restantes.fbb | real}}</span>
                  </td>
                  <td class="centralizado" v-if="!visaoReduzida && totais.valor.projeto.parceiros != 0">
                    <span class="valor atencao" :title="'<h5>' + (totais.valor.restantes.parceiros < 0 ? 'Ultrapassou o valor máximo de R$ ' + totais.valor.projeto.parceiros : 'Valor ainda Restante de Parceiro Estratégico que deve informar para qual município será destinado') + '</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }"
                          v-if="Math.abs(totais.valor.restantes.parceiros) > 0.1">{{totais.valor.restantes.parceiros | real}}</span>
                  </td>
                  <td class="centralizado" v-if="!visaoReduzida && totais.valor.projeto.contrapartidas != 0">
                    <span class="valor atencao" :title="'<h5>' + (totais.valor.restantes.contrapartidas < 0 ? 'Ultrapassou o valor máximo de R$ ' + totais.valor.projeto.contrapartidas : 'Valor ainda Restante da Contrapartida que deve informar para qual município será destinado') + '</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }"
                          v-if="Math.abs(totais.valor.restantes.contrapartidas) > 0.1">{{totais.valor.restantes.contrapartidas | real}}</span>
                  </td>
                  <td class="centralizado" v-if="!visaoReduzida">
                    <span class="valor atencao" :title="'<h5>Valor ainda Restante do projeto aguardando em qual município será destinado</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }"
                          v-if="Math.abs(totais.valor.restantes.fbb + totais.valor.restantes.parceiros + totais.valor.restantes.contrapartidas) > 0.1">{{(totais.valor.restantes.fbb + totais.valor.restantes.parceiros + totais.valor.restantes.contrapartidas) | real}}</span>
                  </td>
                  <td class="centralizado">
                    <span class="valor atencao" :title="'<h5>' + (totais.participantes.restantes < 0 ? 'Informou mais participantes do que há em publico-alvo<br/>Corrija e salve a proposta para continuar' : 'Total de participantes ainda Restante do projeto que deve informar a qual município faz parte') + '</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }"
                          v-if="totais.participantes.restantes !== 0">{{totais.participantes.restantes}}</span>
                  </td>
                </tr>

              </table>

            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Formulário -->
    <div v-if="!mostraGrid" style="padding-left:0" class="row well well-sm no-shadow" >
      <div class="col-md-12">

        <!-- Origem (Fase) -->
        <div v-if="!visaoReduzida" class="form-group" :class="{ 'has-error' : errors.first('origem')}">
          <label class="control-label col-md-2">Origem:</label>
          <div class="col-md-2">
            <div>
              <select v-model="cidade.ds_fase" name="origem" aria-label="Recurso" class="form-control" v-validate="'required'" @change="selecionaFase">
                <option value="1" v-if="temItemOrigem(1)">Fundação</option>
                <option value="2" v-if="temItemOrigem(2)">Contrapartida</option>
                <option value="5" v-if="temItemOrigem(5)">Parceiro Estratégico</option>
              </select>
            </div>
            <span v-if="errors.first('origem')" class="label label-danger"> {{ errors.first('origem') }}</span>
          </div>
        </div>

        <!-- CEP -->
        <div class="form-group required-field" :class="{ 'has-error' : errors.first('cep')}">
          <label class="control-label col-md-2">CEP:</label>
          <div class="col-md-2">
            <div>
              <the-mask v-model="cidade.ds_cep" name="cep" class="form-control" type="text" :disabled="loading.cepMunicipio" v-validate="'required|min:8|max:8'" @blur.native="buscaCidades([cidade])" mask="#####-###"></the-mask>
            </div>
            <span v-if="errors.first('cep')" class="label label-danger"> {{ errors.first('cep') }}</span>
          </div>
          <div class="col-md-6" style="padding:7px;">
            <span v-if="loading.cepMunicipio" class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Consultando CEP ...</span>
            <span v-else-if="cidade.ds_municipio">{{cidade.ds_municipio}} - {{cidade.ds_uf}}</span>
          </div>
        </div>

        <!-- Valor das atividades -->
        <div v-if="!visaoReduzida" class="form-group required-field" :class="{ 'has-error' : errors.first('valor')}">
          <label class="control-label col-md-2">Valor neste município:</label>
          <div class="col-md-2">
            <div>
              <!-- // Inclusão de toFixed(2) para formatar saída do valor com 2 casas após a vírgula -->
              <money v-model="cidade.dc_valor_municipio"
                     name="valor"
                     class="form-control text-right"
                     type="text"
                     v-validate="'required|min_value:0|max_value:' + valorMaximo(cidade).toFixed(2)"
                     :disabled="!cidade.ds_fase">
              </money>
            </div>
            <span v-if="errors.first('valor')" class="label label-danger"> {{ errors.first('valor') }}</span>
          </div>
        </div>

        <!-- Participants -->
        <div class="form-group required-field" :class="{ 'has-error' : errors.first('número de participantes')}">
          <label class="control-label col-md-2">Número de participantes:</label>
          <div class="col-md-2">
            <div approval="addMunCtrl.approval" state="addMunCtrl.approvalState">
              <input v-model="cidade.nr_total_participantes" name="número de participantes" class="form-control" type="number" min="0"
                     :disabled="('' + cidade.ds_fase === '2')" v-validate="{required: true, numeric: true}">
              <span v-if="('' + cidade.ds_fase === '2')" class="alerta"><br/>Contrapartida não deve ter participantes</span>
            </div>
            <span v-if="errors.first('número de participantes')" class="label label-danger"> {{ errors.first('número de participantes') }}</span>
          </div>
        </div>

        <!-- Botões -->
        <div class="form-group">
          <div class="col-md-4 col-md-offset-2">
            <button v-if="!loading.cepMunicipio && (_.isNil(processoSolicitacao) || cidade.dc_valor_municipio > 0)" @click="onAdd" type="button" class="btn btn-confirm btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Ok</button>
            <button @click="onCancel" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'municipalizacao',
    data () {
      return {
        mostraGrid: true,
        loading: {
          cepMunicipio: false
        },
        table: {
          items: this.propsProposta.municipalizacao,
          filter: null,
          hover: true,
          bordered: true,
          block: false,
          currentPage: 1,
          perPage: 5000,
          fields: [
            { key: 'ds_fase', label: 'Origem', sortable: true, thStyle: 'text-align: center; width: 150px', class: 'text-center' },
            { key: 'ds_cep', label: 'CEP', sortable: true, thStyle: 'text-align: center; width: 200px', class: 'text-center' },
            { key: 'ds_municipio', label: 'Município', sortable: true, thStyle: 'text-align: center; width: 450px', class: 'text-center' },
            { key: 'dc_valor_municipio', label: 'Valor Total', sortable: true, thStyle: 'text-align: center; width: 250px', class: 'text-center' },
            { key: 'nr_total_participantes', label: 'Participantes', sortable: true, thStyle: 'text-align: center; width: 100px', class: 'text-center' },
            { key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 170px', class: 'text-center' }
          ]
        },
        totais: {
          valor: {
            projeto: {
              fbb: 0,
              parceiros: 0,
              contrapartidas: 0
            },
            municipalizados: {
              fbb: 0,
              parceiros: 0,
              contrapartidas: 0
            },
            restantes: {
              fbb: 0,
              parceiros: 0,
              contrapartidas: 0
            }
          },
          participantes: {
            projeto: 0,
            municipalizados: 0,
            restantes: 0
          },
          municipios: {
            todos: 0
          }
        },
        total: 0,
        totalFBB: 0,
        totalParc: 0,
        totalContra: 0,
        cidade: {},
        cidadeIndex: null,
        cidadeValor: 0,
        editando: false,
        visaoReduzida: true,
        layout: ['SEM_BOTOES_DISTRIBUICAO'],
        formEditavel: false,
        existeMunicipioRepetido: []
      }
    },
    props: ['propsProposta', 'editavel', 'propsLayout', 'propsPropostaBackup',
      'modoVisualizacaoAlteracoes', // opcional - exibe as alterações realizadas. Se o valor for RESUMIDO mostra só o total de modificações, se DETALHADO mostrará quais alterações houveram. Sem valor, null ou outra opção, não mostrará as modificações
      'atualizar', // opcional - valor qualquer somente para disparar atualização
      'processoSolicitacao', // opcional - recebe o objeto da solicitação de alteração
      'travarMunicipios' // opcional - Trava a lista para apenas um municipio / UF independentemente do CEP diferente
    ],
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
          if (mensagem.acao === 'notificacaoAtualizacaoPublicoAlvo') {
            vm.calcularTotais()
          } else if (mensagem.acao === 'notificacaoAtualizacaoCronograma') {
            vm.calcularTotais()
          } else {
          }
        }
      }
    },
    created () {
      this.table.items = this.propsProposta.municipalizacao
      this.formEditavel = this.editavel
      if (!this.propsLayout || _.isNil(this.propsLayout)) {
        this.layout = ['COM_BOTOES_DISTRIBUICAO']
      }
      this.calcularTotais()
      this.ajustarVisao()
      if (this.travarMunicipios) {
        this.existeMunicipioRepetido = this.verificaDuplicidadeMunicipios(this.propsProposta.municipalizacao)
      }
    },
    watch: {
      atualizar: function () {
        this.calcularTotais()
      },
      propsLayout: function () {
        this.layout = this.propsLayout
      },
      'propsProposta.municipalizacao': function () {
        this.table.items = this.propsProposta.municipalizacao
        this.calcularTotais()
        this.ajustarVisao()
        this.existeMunicipioRepetido = this.verificaDuplicidadeMunicipios(this.propsProposta.municipalizacao)
      },
      editavel: function () {
        this.formEditavel = this.editavel
        this.ajustarVisao()
      },
      formEditavel: function () {
        this.ajustarVisao()
      },
      'table.items' () {
        this.$emit('municipioAdicionado', this.propsProposta.municipalizacao)
        let qtdeMunicipios = this.table.items.length
        let qtdeMunicipiosUnicos = (_.uniq(_.map(this.table.items, function (m) { return m.ds_fase + m.ds_municipio + m.ds_uf }))).length
        this.$emit('validacaoMunicipio', {'tag': 'duplicidadeMunicipio', 'ativo': qtdeMunicipios !== qtdeMunicipiosUnicos, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Há municípios cadastros em duplicidade para uma mesma fase'})
      },
      mostraGrid: function () {
        this.$emit('validacaoMunicipio', {'tag': 'municipioEditando', 'ativo': (!this.mostraGrid), 'tipo': 'restricao', 'acao': null, 'mensagem': '<span class=\'restricaoEditandoInformacao\'>Municípios em edição<span>'})
      }
    },
    methods: {
      verificaDuplicidadeMunicipios (lista) {
        const mapa = new Map()
        const duplicados = []
        lista.forEach((item, index) => {
          const municipio = (item.ds_municipio.trim().toUpperCase() || '').trim().toUpperCase()
          const uf = (item.ds_uf.trim().toUpperCase() || '').trim().toUpperCase()
          const fase = (item.ds_fase || 'SEM_FASE').trim().toUpperCase()
          const chave = `${municipio}|${uf}|${fase}`
          if (mapa.has(chave)) {
            duplicados.push(item)
          } else {
            mapa.set(chave, true)
          }
        })
        return duplicados
      },
      truncarValor (valor) {
        return parseInt(valor * 100) / 100
      },
      ajustarVisao () {
        this.visaoReduzida = (this.propsProposta.ds_fase === 'CADASTRO' || this.propsProposta.ds_fase === 'SOLICITACAO' || this.propsProposta.ds_fase === 'REVISAO' || this.usuarioLogado.ds_tipo_usuario !== 'FUNDACAO')
        if (this.visaoReduzida) {
          this.table.fields = _.remove(this.table.fields, function (f) {
            return f.key !== 'ds_fase' && f.key !== 'dc_valor_municipio'
          })
        }
        if (!this.formEditavel) {
          this.table.fields = _.remove(this.table.fields, function (f) {
            return f.key !== 'actions'
          })
        } else if (!_.find(this.table.fields, ['key', 'actions'])) {
          this.table.fields.push({ key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 13%', class: 'text-center' })
        }
        this.$forceUpdate()
      },
      temItemOrigem (origem) {
        let c = 0
        this.propsProposta.atividades.forEach(atividade => {
          if (_.has(atividade, 'itens_orcamentos') && atividade.itens_orcamentos.length > 0) {
            atividade.itens_orcamentos.forEach(item => {
              c = c + (('' + item.origem) === ('' + origem) ? 1 : 0)
            })
          }
        })
        return c > 0
      },
      selecionaFase () {
        this.cidade.dc_valor_municipio = 0 // zera o valor para recalcular
        this.cidade.nr_total_participantes = ('' + this.cidade.ds_fase === '2') ? 0 : this.cidade.nr_total_participantes
        if (this.cidade.ds_cep !== undefined) {
          this.buscaCidades([this.cidade])
        }
      },
      onNew () {
        this.mostraGrid = false
      },
      distribuirParticipantes () { // Redistribui participantes em quantidades iguais a quantidade de items que tem na tabela
        let quantidade = _.filter(this.table.items, function (q) { return ('' + q.ds_fase) !== '2' }).length // pega quantidade de items da tabela excluindo fase 2 (contrapartida)
        let acum = 0
        let total = this.totais.participantes.projeto
        let parcela = Math.ceil(total / quantidade)
        this.table.items.forEach((item) => { // para cada item recalcula a quantidade de participantes
          if (('' + item.ds_fase) !== '2') {
            if (acum + parcela > total) {
              let dif = acum + parcela - total
              item.nr_total_participantes = parcela - dif
            } else {
              item.nr_total_participantes = parcela
            }
            acum += item.nr_total_participantes
          }
        })
        this.calcularTotais()
      },
      distribuirValores () {
        let fases = ['1', '2', '5']
        fases.forEach((fase) => {
          let quantidade = _.filter(this.table.items, ['ds_fase', '' + fase]).length // pega quantidade de items da tabela
          let acum = 0
          let total = (fase === '1' ? this.totais.valor.projeto.fbb : (fase === '2' ? this.totais.valor.projeto.contrapartidas : (fase === '5' ? this.totais.valor.projeto.parceiros : 0)))
          let parcela = Math.ceil(total / quantidade)
          if (quantidade > 0 && total > 0) {
            this.table.items.forEach((item) => { // para cada item recalcula o valor de acordo com a fase
              if ('' + item.ds_fase === fase) {
                if (acum + parcela > total) {
                  let dif = acum + parcela - total
                  item.dc_valor_municipio = parcela - dif
                } else {
                  item.dc_valor_municipio = parcela
                }
                acum += item.dc_valor_municipio
              }
            })
          }
        })
        this.calcularTotais()
      },
      buscaCidades (cidades) {
        console.log('carregando: ', cidades)
        this.loading.cepMunicipio = true
        let lista = _.uniq(_.map(cidades, 'ds_cep'))
        axiosLaravel.post('projeto/cidades', {'referencia': 'CEP', 'lista': lista}).then((response) => {
          cidades.forEach((municipio) => {
            let cidade = _.find(response.data, function (cid) {
              return _.toNumber(municipio.ds_cep) >= _.toNumber(cid.nr_cep_inicio) && _.toNumber(municipio.ds_cep) <= _.toNumber(cid.nr_cep_final)
            })
            if (this.travarMunicipios) {
              console.log('verificando se já existe municipio / uf cadastrado na lista e está na fase 1', cidade)
              let municipalizacaoCadastro = this.propsProposta.municipalizacao
              let jaExiste = _.some(municipalizacaoCadastro, (m) => {
                if (!this.visaoReduzida) {
                  console.log(m)
                  return m.ds_municipio === cidade.ds_nome && m.ds_uf === cidade.ds_uf && m.ds_fase === this.cidade.ds_fase
                } else {
                  return m.ds_municipio === cidade.ds_nome && m.ds_uf === cidade.ds_uf
                }
              })
              if (jaExiste) {
                this.$snotify.warning(`Municipio já cadastrado: ${cidade.ds_nome} - ${cidade.ds_uf}`)
                this.cidade = {}
                return // pula para o próximo da lista
              }
            }
            console.log('ok')
            _.set(municipio, 'ds_municipio', cidade.ds_nome)
            _.set(municipio, 'ds_uf', cidade.ds_uf)
          })
          this.loading.cepMunicipio = false
        })
          .catch((error) => {
            this.loading.cepMunicipio = false
            this.$root.trataErro(error)
          })
      },
      valorMaximo (cidade) {
        if (_.has(cidade, 'ds_fase')) {
          let total = ('' + cidade.ds_fase === '1' ? this.totais.valor.projeto.fbb : ('' + cidade.ds_fase === '2' ? this.totais.valor.projeto.contrapartidas : ('' + cidade.ds_fase === '5' ? this.totais.valor.projeto.parceiros : 0)))
          let municipalizado = ('' + cidade.ds_fase === '1' ? this.totais.valor.municipalizados.fbb : ('' + cidade.ds_fase === '2' ? this.totais.valor.municipalizados.contrapartidas : ('' + cidade.ds_fase === '5' ? this.totais.valor.municipalizados.parceiros : 0)))
          return total - municipalizado + this.cidadeValor
        } else return 0
      },
      edita (row) {
        this.mostraGrid = false
        this.editando = true
        this.cidade = _.cloneDeep(row.item)
        this.cidadeIndex = row.index
        this.cidadeValor = (!_.has(this.cidade, 'dc_valor_municipio') || _.isUndefined(this.cidade.dc_valor_municipio)) ? 0 : this.cidade.dc_valor_municipio
      },
      exclui (index) {
        this.table.items.splice(index, 1)
        this.calcularTotais()
        this.$emit('acaoAtualizaSolicitacoes', new Date())
      },
      reincluir (row) {
        this.table.items.push(row.item)
        this.calcularTotais()
        this.$emit('acaoAtualizaSolicitacoes', new Date())
      },
      onCancel () {
        this.mostraGrid = true
        this.editando = false
        this.cidade = {}
        this.cidadeIndex = null
        this.cidadeValor = 0
      },
      valorProjetoOrigem (fase, texto) {
        return _.sumBy(this.propsProposta.atividades, function (atv) {
          return (_.has(atv, 'itens_orcamentos') && atv.itens_orcamentos.length > 0)
            ? _.sumBy(atv.itens_orcamentos, function (item) {
              return (_.has(item, 'origem') && ('' + item.origem) === '' + fase || item.origem === texto)
              // ? (_.has(item, 'valorOrcado') ? (item.valorOrcado + (!_.includes(item.id, 'novo') ? (_.toNumber(_.get(item, 'valorAlteracao', 0))) : 0))
              ? (_.has(item, 'valorOrcado') ? (((item.valorOrcado > 0) ? item.valorOrcado + (!_.includes(item.id, 'novo') ? (_.toNumber(_.get(item, 'valorAlteracao', 0))) : 0) : item.valorOrcado + (_.toNumber(_.get(item, 'valorAlteracao', 0)))))
                  : (_.has(item, 'valor_unitario') && _.has(item, 'quantidade') && !_.isNil(item.valor_unitario) ? parseFloat(item.valor_unitario) * parseFloat(item.quantidade)
                    : _.sumBy(item.orcamentos_mensalizados, function (mes) {
                      return _.has(mes, 'valor') ? mes.valor : 0
                    }) + (_.toNumber(_.get(item, 'valorAlteracao', 0)))
                  )) : 0
            }) : 0
        })
      },
      calcularTotais () {
        this.totais.participantes.projeto = _.sumBy(this.propsProposta.publicos_alvo, function (p) { return parseInt(p.nr_participantes_diretos) })
        this.totais.participantes.municipalizados = _.sumBy(this.table.items, function (i) { return parseInt(i.nr_total_participantes) })
        this.totais.participantes.restantes = this.totais.participantes.projeto - this.totais.participantes.municipalizados
        this.totais.municipios.todos = this.table.items.length
        // Inclusão de toFixed(2) para formatar saída do valor com 2 casas após a vírgula
        this.totais.valor.projeto.fbb = this.valorProjetoOrigem('1', 'FUNDACAO').toFixed(2)
        this.totais.valor.projeto.parceiros = this.valorProjetoOrigem('5', 'PARCEIRO_ESTRATEGICO').toFixed(2)
        this.totais.valor.projeto.contrapartidas = this.valorProjetoOrigem('2', 'CONTRAPARTIDA').toFixed(2)
        this.totais.valor.municipalizados.fbb = _.sumBy(this.table.items, function (m) { return (('' + m.ds_fase) === '1' || (_.has(m, 'origem') && m.origem === 'FUNDACAO')) ? parseFloat(m.dc_valor_municipio) : 0 })
        this.totais.valor.municipalizados.parceiros = _.sumBy(this.table.items, function (m) { return (('' + m.ds_fase) === '5' || (_.has(m, 'origem') && m.origem === 'PARCEIRO_ESTRATEGICO')) ? parseFloat(m.dc_valor_municipio) : 0 })
        this.totais.valor.municipalizados.contrapartidas = _.sumBy(this.table.items, function (m) { return (('' + m.ds_fase) === '2' || (_.has(m, 'origem') && m.origem === 'CONTRAPARTIDA')) ? parseFloat(m.dc_valor_municipio) : 0 })
        // this.totais.valor.municipalizados.fbb = parseInt(this.totais.valor.municipalizados.fbb * 100) / 100
        // this.totais.valor.municipalizados.parceiros = parseInt(this.totais.valor.municipalizados.parceiros * 100) / 100
        // this.totais.valor.municipalizados.contrapartidas = parseInt(this.totais.valor.municipalizados.contrapartidas * 100) / 100
        this.totais.valor.restantes.fbb = (parseInt(this.totais.valor.projeto.fbb * 100) - parseInt(this.totais.valor.municipalizados.fbb * 100)) / 100
        this.totais.valor.restantes.parceiros = (parseInt(this.totais.valor.projeto.parceiros * 100) - parseInt(this.totais.valor.municipalizados.parceiros * 100)) / 100
        this.totais.valor.restantes.contrapartidas = (parseInt(this.totais.valor.projeto.contrapartidas * 100) - parseInt(this.totais.valor.municipalizados.contrapartidas * 100)) / 100
        // let valorPendente = this.totais.valor.restantes.fbb + this.totais.valor.restantes.parceiros + this.totais.valor.restantes.contrapartidas
        // this.$emit('validacaoMunicipio', {'tag': 'municipiosParticipantes', 'ativo': (this.totais.participantes.restantes !== 0), 'tipo': 'restricao', 'acao': null, 'mensagem': (abs(this.totais.participantes.restantes) > 0 ? 'Ainda falta distribuir <b>' + this.totais.participantes.restantes + '</b> participantes em municípios' : 'Há <b>' + this.totais.participantes.projeto + '</b> público-alvo cadastrados e <b>' + this.totais.participantes.municipalizados + '</b> participantes municipalizados')})
        this.$emit('validacaoMunicipio', {'tag': 'semMunicipiosCadastrados', 'ativo': (this.table.items.length === 0), 'tipo': 'restricao', 'acao': null, 'mensagem': '<b>Não há municipios</b> cadastrado para esse projeto'})
        // Verifica se há municiío sem valor ou participantes informado
        let qtde = _.sumBy(this.table.items, function (o) {
          return ((_.has(o, 'origem') && ('' + o.origem) !== '2') || (_.has(o, 'ds_fase') && ('' + o.ds_fase) !== '2')) && (o.dc_valor_municipio === 0 || o.nr_total_participantes) === 0 ? 1 : 0
        })
        this.$emit('validacaoMunicipio', {'tag': 'municipiosSemValorOuParticipantes', 'ativo': (qtde > 0), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Tem <b>' + qtde + ' municipio(s)</b> que não tem valor ou participantes informados'})
        // Somente obriga o valor na fase de Análise ou quando alterar projeto aprovado
        if (this.propsProposta.ds_fase === 'ANALISE' || _.get(this.processoSolicitacao, 'nome', '') === 'ALTERACAO_MUNICIPIOS') {
          // this.$emit('validacaoMunicipio', {'tag': 'municipiosValores', 'ativo': (valorPendente !== 0), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Há R$ <b>' + valorPendente + '</b> pendentes de distribuição em <b>' + this.totais.municipios.todos + ' município(s)</b> da tabela'})
          this.$emit('validacaoMunicipio', {'tag': 'municipiosValoresFBB', 'ativo': (Math.abs(this.totais.valor.restantes.fbb) > 0.1), 'tipo': 'restricao', 'acao': null, 'mensagem': 'O total no extrato para recursos FBB (<b>R$ ' + this.totais.valor.projeto.fbb + '</b>) difere do total em municípios com recursos FBB (<b>R$ ' + this.totais.valor.municipalizados.fbb + '</b>)'})
          this.$emit('validacaoMunicipio', {'tag': 'municipiosValoresParcEstr', 'ativo': (Math.abs(this.totais.valor.restantes.parceiros) > 0.1), 'tipo': 'restricao', 'acao': null, 'mensagem': 'O total no extrato para recursos de Parceiros Estratégicos (<b>R$ ' + this.totais.valor.projeto.parceiros + '</b>) difere do total em municípios com recursos de Parceiros Estratégicos (<b>R$ ' + this.totais.valor.municipalizados.parceiros + '</b>)'})
          this.$emit('validacaoMunicipio', {'tag': 'municipiosValoresContr', 'ativo': (Math.abs(this.totais.valor.restantes.contrapartidas) > 0.1), 'tipo': 'restricao', 'acao': null, 'mensagem': 'O total no extrato para Contrapartida (<b>R$ ' + this.totais.valor.projeto.contrapartidas + '</b>) difere do total em municípios com Contrapartida (<b>R$ ' + this.totais.valor.municipalizados.contrapartidas + '</b>)'})
        }
        this.$forceUpdate()
      },
      onAdd () {
        if (this.loading.cepMunicipio) {
          this.$snotify.error('Município não carregado. Favor aguardar')
        } else {
          let municipioFaseEditando = this.cidade.ds_fase + this.cidade.ds_municipio + this.cidade.ds_uf
          let municipioIgual = _.find(this.table.items, function (m) { return municipioFaseEditando === (m.ds_fase + m.ds_municipio + m.ds_uf) })
          if (municipioIgual && _.get(municipioIgual, 'id', 0) !== _.get(this.cidade, 'id', 0)) {
            this.$snotify.error('Esse Município já foi cadastrado para essa fase')
          } else {
            this.$validator.validateAll().then((result) => {
              if (result && this.$validator.errors.all().length === 0) {
                if (_.isNull(this.cidadeIndex)) {
                  this.table.items.push(this.cidade)
                } else {
                  this.table.items.splice(this.cidadeIndex, 1, this.cidade)
                }
                this.calcularTotais()
                this.mostraGrid = true
                this.editando = false
                this.cidade = {}
                this.cidadeIndex = null
                this.cidadeValor = 0
                this.$emit('acaoAtualizaSolicitacoes', new Date())
              }
            })
          }
        }
      },
      etiquetaOrigemRecurso (valor) {
        return _.includes(['FUNDACAO', '1'], '' + valor) ? 'Fundação' : (_.includes(['CONTRAPARTIDA', '2'], '' + valor) ? 'Contrapartida' : (_.includes(['PARCEIRO_ESTRATEGICO', '5'], '' + valor) ? 'Parceiro Estratégico' : ''))
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

  .municipio-duplicidade-container {
    width: 100%;
    min-height: 30px;
    background-color:#C62828;
    color: #FFFFFF;
    border-radius: 5px;
    box-sizing: border-box;
    padding: 20px;
    font-weight: 700;
    margin-bottom: 10px;
    gap: 10px;
    border: 1px solid #DDDDDD;
    animation: fade 0.5s ease;
  }

</style>
