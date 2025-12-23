<template>
  <div class="box-body">
    <!--Grid-->
    <div v-show="mostraGrid">
      <div class="row">
        <div class="col-md-12">
          <button @click="onNew" type="button" class="btn btn-primary btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Novo Município</button>
          <button @click="redistributeParticipants" type="button" class="btn btn-default btn-flat"><i aria-hidden="true"></i> Distribuir Participantes Proporcionalmente</button>
          <button v-if="proposta.proposalPhase === 'ANALISE' || proposta.proposalPhase === 'PENDENTE_EM_ANALISE'" @click="redistributeValues" type="button" class="btn btn-default btn-flat"><i aria-hidden="true"></i> Distribuir Valores Proporcionalmente</button>
        </div>
      </div>
      <br>
      <div class="row">
        <div class="col-md-12">
          <b-container fluid>
            <table class="table table-condensed table-bordered table-striped">
              <thead style="text-align: center; font-weight: bold" >
              <tr>
                <td v-if="proposta.proposalPhase === 'ANALISE' || proposta.proposalPhase === 'PENDENTE_EM_ANALISE'">Fase</td>
                <td>CEP</td>
                <td>Município</td>
                <td v-if="proposta.proposalPhase === 'ANALISE' || proposta.proposalPhase === 'PENDENTE_EM_ANALISE'">Valor das ativ. por município</td>
                <td v-if="proposta.proposalPhase === 'ANALISE' || proposta.proposalPhase === 'PENDENTE_EM_ANALISE'">% das ativ. por município</td>
                <td>Número de participantes por município</td>
                <td>% participantes por municípios</td>
                <td>Ações</td>
              </tr>
              </thead>
              <tbody style="text-align: center;">
              <tr v-for="(item, index) in table.items">
                <td v-if="proposta.proposalPhase === 'ANALISE' || proposta.proposalPhase === 'PENDENTE_EM_ANALISE'">{{item.phase}}</td>
                <td>{{item.cep}}</td>
                <td>{{item.name}}</td>
                <td v-if="proposta.proposalPhase === 'ANALISE' || proposta.proposalPhase === 'PENDENTE_EM_ANALISE'">{{item.valueByActivity | real}}</td>
                <td v-if="proposta.proposalPhase === 'ANALISE' || proposta.proposalPhase === 'PENDENTE_EM_ANALISE'">{{item.percentageByActivity | percentage}}</td>
                <td>{{item.totalParticipants}}</td>
                <td>{{item.percentage | percentage}}</td>
                <td>
                  <div>
                    <b-button type="button" :disabled="proposta.proposalPhase !== 'CADASTRO' && proposta.proposalPhase !== 'ANALISE' && proposta.proposalPhase !== 'PRE_ANALISE'" @click.stop="edita(item)" :class="['btn btn-flat btn-sm', proposta.proposalPhase === 'CADASTRO' || proposta.proposalPhase === 'ANALISE' || proposta.proposalPhase === 'PENDENTE_EM_ANALISE' ? 'btn-primary' : 'btn-default']"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>
                    <b-button type="button" :disabled="false" @click.stop="exclui(index)" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</b-button>
                  </div>
                </td>
                <!--                <td-->
                <!--                  class="text-center">{{item.id}}</td>-->
                <!--                <td data-title="'Processo de solicitação em andamento'" sortable="'projectName'"-->
                <!--                    class="text-center">{{adiantamento.projectName +' - '+ adiantamento.createDate}}</td>-->
                <!--                <td data-title="'Valor liberado'" sortable="'valueReleased'"-->
                <!--                    class="text-center">{{adiantamento.totalValue | real}}</td>-->
                <!--                <td data-title="'Valor não solicitado'" sortable="'totalValueBalance'"-->
                <!--                    class="text-center">{{adiantamento.totalValueBalance | real }}</td>-->
                <!--                <td data-title="'Data limite para prestação de contas'" sortable="'datLimAcc'"-->
                <!--                    class="text-center">{{adiantamento.limitDate}}</td>-->
                <!--                <td data-title="'Data da última prestação de contas'" sortable="'lastDatLimAcc'"-->
                <!--                    class="text-center">{{adiantamento.lastParcelDate}}</td>-->
                <!--<td data-title="'Visualização'" ng-if="!grantedSolicCtrl.hideSnapshot" class="text-center">-->
                <!--<button type="button" ng-click="grantedSolicCtrl.openGrantedSnapshotModal(o.eventId, o.discriminator)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-search" aria-hidden="true"></i></button>-->
                <!--</td>-->
              </tr>
              </tbody>
              <!--              <tr v-show="(item.length === 0)">-->
              <!--                <td colspan="100%" class="text-center">Nenhum registro encontrado!</td>-->
              <!--              </tr>-->
            </table>
            <!-- Main table element -->
            <!--            <b-table show-empty-->
            <!--                     stacked="md"-->
            <!--                     :bordered="table.bordered"-->
            <!--                     :items="table.items"-->
            <!--                     :hover="table.hover"-->
            <!--                     :fields="table.fields"-->
            <!--                     :filter="table.filter"-->
            <!--                     :current-page="table.currentPage"-->
            <!--                     :per-page="table.perPage"-->
            <!--                     :sort-by.sync="table.sortBy"-->
            <!--                     :sort-desc.sync="table.sortDesc"-->
            <!--                     empty-text="Nenhum registro encontrado"-->
            <!--            >-->
            <!--              <template   slot="phase" scope="row">{{row.item.phase}}</template>-->
            <!--              <template v-if="proposta.proposalPhase === 'ANALISE' || proposta.proposalPhase === 'PENDENTE_EM_ANALISE'" slot="valueByActivity" scope="row">{{row.item.valueByActivity | real}}</template>-->
            <!--              <template slot="percentage" scope="row">{{row.item.percentage | percentage}}</template>-->
            <!--              <template slot="percentageByActivity" scope="row">{{row.item.percentageByActivity | percentage}}</template>-->
            <!--              <template slot="actions" scope="row">-->
            <!--                <div>-->
            <!--                  <b-button type="button" :disabled="proposta.proposalPhase !== 'CADASTRO' && proposta.proposalPhase !== 'ANALISE'" @click.stop="edita(row.item)" :class="['btn btn-flat btn-sm', proposta.proposalPhase === 'CADASTRO' || proposta.proposalPhase === 'ANALISE' || proposta.proposalPhase === 'PENDENTE_EM_ANALISE' ? 'btn-primary' : 'btn-default']"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>-->
            <!--                  <b-button type="button" :disabled="false" @click.stop="exclui(row)" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</b-button>-->
            <!--                </div>-->
            <!--              </template>-->
            <!--            </b-table>-->
          </b-container>
          <b-container fluid>
            <table v-if="proposta.proposalPhase === 'ANALISE' || proposta.proposalPhase === 'PENDENTE_EM_ANALISE'" class="table b-table table-bordered b-table-stacked-md" style="font-weight: bold">
              <tbody>
              <tr>
                <td colspan="5" class="text-center" style="border-right: none;">Total Fundação: {{calculaValorAtividadeporFase('FUNDACAO') | real}}</td>
                <td colspan="3" class="text-center" style="border-left: none;">Total Fundação Restante: {{calculaValorPermitidoAtividadeporFase('FUNDACAO') | real}}</td>
              </tr>
              <tr>
                <td colspan="5" class="text-center" style="border-right: none;">Total Contrapartida: {{calculaValorAtividadeporFase('CONTRAPARTIDA') | real}}</td>
                <td colspan="3" class="text-center" style="border-left: none;">Total Contrapartida Restante: {{calculaValorPermitidoAtividadeporFase('CONTRAPARTIDA') | real}}</td>
              </tr>
              <tr>
                <td colspan="5" class="text-center" style="border-right: none;">Total Parceiro Estratégico: {{calculaValorAtividadeporFase('PARCEIRO_ESTRATEGICO') | real}}</td>
                <td colspan="3" class="text-center" style="border-left: none;">Total Parceiro Estratégico Restante: {{calculaValorPermitidoAtividadeporFase('PARCEIRO_ESTRATEGICO') | real}}</td>
              </tr>
              <tr>
                <td colspan="5" class="text-center" style="border-right: none;">Total do Projeto: {{calculaValorAtividadeporFase('PARCEIRO_ESTRATEGICO') + calculaValorAtividadeporFase('CONTRAPARTIDA') + calculaValorAtividadeporFase('FUNDACAO') | real}}</td>
                <td colspan="3" class="text-center" style="border-left: none;">Total  Parceiro Estratégico Restante: {{calculaValorPermitidoAtividadeporFase('PARCEIRO_ESTRATEGICO') + calculaValorPermitidoAtividadeporFase('CONTRAPARTIDA') + calculaValorPermitidoAtividadeporFase('FUNDACAO') | real}}</td>
              </tr>
              <tr>
                <td colspan="5" class="text-center" style="border-right: none;">Total Participantes: {{totalParticipantes}}</td>
                <td colspan="3" class="text-center" style="border-left: none;">Total  Parceiro Estratégico Restante: {{totalParticipantes - totalParticipantesMunicipios}}</td>
              </tr>
              </tbody>
            </table>
          </b-container>
        </div>
      </div>
    </div>
    <!-- form -->
    <div v-if="!mostraGrid" style="padding-left:0" class="row" >
      <div class="col-md-6 well">

        <!-- phase -->
        <div v-if="proposta.proposalPhase === 'ANALISE' || proposta.proposalPhase === 'PENDENTE_EM_ANALISE'" class="form-group"
             :class="{ 'has-error' : errors.first('fase')}">
          <label for="phase" class="control-label col-md-4">Fase:</label>
          <div class="col-md-8">
            <div>
              <select v-model="cidade.phase" name="fase" aria-label="Recurso" class="form-control"
                      v-validate="'required'" @change="selecionaFase">
                <option value="FUNDACAO">Fundação</option>
                <option value="CONTRAPARTIDA">Contrapartida</option>
                <option value="PARCEIRO_ESTRATEGICO">P.Estratégico</option>
              </select>
            </div>
            <span v-if="errors.first('fase')" class="label label-danger"> {{ errors.first('fase') }}</span>
          </div>
        </div>

        <!-- cep -->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('cep')}">
          <label for="cep" class="control-label col-md-4">CEP:</label>
          <div class="col-md-4">
            <div  approval="addMunCtrl.approval" state="addMunCtrl.approvalState">
              <the-mask v-model="cidade.cep" name="cep" class="form-control" type="text"
                        v-validate="'required|min:8|max:8'" @blur.native="loadCityAndState" mask="#####-###"></the-mask>
            </div>
            <span v-if="errors.first('cep')" class="label label-danger"> {{ errors.first('cep') }}</span>
          </div>
          <div class="col-md-4 col-lg-3" style="padding:7px;">
            {{cidade.name}}
          </div>
        </div>

        <!-- Valor das atividades -->
        <div v-if="proposta.proposalPhase === 'ANALISE' || proposta.proposalPhase === 'PENDENTE_EM_ANALISE'" class="form-group required-field"
             :class="{ 'has-error' : errors.first('valor')}">
          <label for="valueByActivity" class="control-label col-md-4">Valor das atividades por município:</label>
          <div class="col-md-8">
            <div  approval="addMunCtrl.approval" state="addMunCtrl.approvalState">
              <money v-model="cidade.valueByActivity"
                     name="valor"
                     class="form-control"
                     type="text"
                     ng-change="addMunCtrl.onChangeValueByActivity(cidade)"
                     ng-blur="addMunCtrl.onChangeMunicipalizationValues()"
                     v-validate="'required|max_value:' + valorPermitidoAtividade"
                     :disabled="!cidade.phase">
              </money>
            </div>
            <span v-if="errors.first('valor')" class="label label-danger"> {{ errors.first('valor') }}</span>
          </div>
        </div>

        <!--percentage by activities .-->
        <div v-if="proposta.proposalPhase === 'ANALISE' || proposta.proposalPhase === 'PENDENTE_EM_ANALISE'" class="form-group required-field"
             :class="{ 'has-error' : errors.first('porcentagem das atividades')}">
          <label for="percentageByActivity" class="control-label col-md-4">Porcentagem das atividades por município:</label>
          <div class="col-md-8">
            <div>
              <the-mask v-model="porcentagemAtividade"
                        name="porcentagem das atividades"
                        class="form-control"
                        type="text"
                        :mask="['###,##%', '##,##%', '#,##%']"
                        v-validate="'required'"
              >
              </the-mask>
            </div>
            <span v-if="errors.first('porcentagem das atividades')" class="label label-danger"> {{ errors.first('porcentagem das atividades') }}</span>
          </div>
        </div>

        <!-- total participants -->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('número de participantes')}">
          <label for="totalParticipants" class="control-label col-md-4">Número de participantes:</label>
          <div class="col-md-8">
            <div approval="addMunCtrl.approval" state="addMunCtrl.approvalState">
              <input v-model="cidade.totalParticipants" name="número de participantes" class="form-control" type="number" min="0"
                     @change="onChangeTotalParticipants" @keyup="onChangeTotalParticipants" v-validate="{required: true, numeric: true}">
            </div>
            <span v-if="errors.first('número de participantes')" class="label label-danger"> {{ errors.first('número de participantes') }}</span>
          </div>
        </div>

        <!-- porcentagem -->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('porcentagem de participantes')}">
          <label for="porcentagem de participantes" class="control-label col-md-4">Porcentagem de participantes</label>
          <div class="col-md-8">
            <div approval="addMunCtrl.approval" state="addMunCtrl.approvalState">
              <the-mask v-model="porcentagemParticipantes" name="porcentagem de participantes"
                        :mask="['###,##%', '##,##%', '#,##%']"
                        class="form-control" type="text"
                        v-validate="'required'">
              </the-mask>
            </div>
            <span v-if="errors.first('porcentagem de participantes')" class="label label-danger"> {{ errors.first('porcentagem de participantes') }}</span>
          </div>
        </div>

        <!-- buttons -->
        <div class="form-group" style="margin-bottom:0">
          <div class="col-md-8 col-md-offset-4">
            <button @click="onAdd" type="button"
                    class="btn btn-primary btn-flat" id="proposal-municipalization-add">
              <i class="fa fa-check" aria-hidden="true"></i> Ok
            </button>
            <button @click="onCancel" type="button"
                    class="btn btn-default btn-flat" id="proposal-municipalization-cancel">
              <i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar
            </button>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'municipalizacaoOld',
    data () {
      return {
        mostraGrid: true,
        table: {
          items: this.proposta.municipalizationResume,
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          perPage: 10,
          fields: [
            { key: 'phase', label: 'Fase', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'cep', label: 'CEP', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'name', label: 'Município', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'valueByActivity', label: 'Valor das ativ. por município', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'percentageByActivity', label: '% das ativ. por município', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'totalParticipants', label: 'Número de participantes por município', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'percentage', label: '% participantes por municípios', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'actions', label: 'Ações', thStyle: 'text-align: center', class: 'text-center' }

          ]
        },
        cidade: {},
        cidadeTabela: {},
        editando: false,
        totalParticipantsAdicionar: 0,
        // totalParticipantesMunicipios: 0,
        porcentagemParticipantes: 0,
        porcentagemAtividade: 0,
        valorPermitidoAtividade: 0,
        dadosOriginais: { // Guarda os dados originais da edição
          fase: null,
          valor: null
        }
      }
    },
    props: ['proposta'],
    computed: {
      totalParticipantes () {
        let totalParticipantes = 0
        this.proposta.audiences.forEach((publico) => {
          totalParticipantes = totalParticipantes + publico.directParticipants
        })
        return totalParticipantes
      },
      totalParticipantesMunicipios () {
        let total = 0
        if (this.table.items.length > 0) {
          this.table.items.forEach((item) => {
            total += item.totalParticipants
          })
        }
        return total
      }
    },
    watch: {
      proposta () {
        this.table.items = this.proposta.municipalizationResume
      },
      'table.items' () {
        // this.atualizaQuantidadesParticipantes()
        this.$emit('municipioAdicionado', this.proposta)
      },
      porcentagemAtividade () {
        this.cidade.percentageByActivity = Number(this.porcentagemAtividade / 10000)
        this.$validator.errors.remove('porcentagem das atividades') // Limpa errobag
        if (this.cidade.percentageByActivity > 1) { // Verifica se valor maior que  100%
          this.$validator.errors.add('porcentagem das atividades', 'Porcentagem não pode ser maior que 100%')
        }
        this.ajustaValorAtividades()
      },
      porcentagemParticipantes () {
        this.cidade.percentage = Number(this.porcentagemParticipantes / 10000)
        this.$validator.errors.remove('porcentagem de participantes') // Limpa errobag
        if (this.cidade.percentage > 1) { // Verifica se valor maior que  100%
          this.$validator.errors.add('porcentagem de participantes', 'Porcentagem não pode ser maior que 100%')
          return
        }
        this.ajustaQuantidadeParticipantes()
      }
    },
    methods: {
      selecionaFase () {
        this.cidade.valueByActivity = 0 // zera o valor para recalcular
        this.valorPermitidoAtividade = this.calculaValorPermitidoAtividade()
      },
      onNew () {
        this.mostraGrid = false
        this.calculaMaximo()
      },
      redistributeParticipants () { // Redistribui participantes em quantidades iguais a quantidade de items que tem na tabela
        let quantidade = this.table.items.length // pega quantidade de items da tabela
        this.table.items.forEach((item) => { // para cada item recalcula a quantidade de participantes
          item.percentage = Number(1 / quantidade).toPrecision(4) // precison delimita as casas decimais
          item.totalParticipants = this.totalParticipantes / quantidade
        })
        this.$forceUpdate()
      },
      redistributeValues () {
        this.redistribuePraFase('FUNDACAO')
        this.redistribuePraFase('CONTRAPARTIDA')
        this.redistribuePraFase('PARCEIRO_ESTRATEGICO')
      },
      redistribuePraFase (fase) {
        // pega o valor por fase
        let valorTotalDaFase = this.calculaValorAtividadeporFase(fase)
        // pega os items daquela fase
        let items = this.table.items.filter(item => {
          return item.phase === fase
        })
        // atualiza cada item daquela fase
        if (items && items.length > 0) {
          items.forEach((item) => { // para cada item recalcula a quantidade de participantes
            item.percentageByActivity = Number(1 / items.length).toPrecision(4) // precison delimita as casas decimais
            item.valueByActivity = valorTotalDaFase / items.length
          })
        }
      },
      loadCityAndState () {
        if (this.cidade.cep) {
          axios.get('proxy/project/city/within-zip-code-range/' + this.cidade.cep).then((response) => {
            this.cidade.name = response.data.value.name
            this.$forceUpdate()
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        } else {
          this.cidade.name = ''
          this.$forceUpdate()
        }
      },
      edita (cidade) {
        this.mostraGrid = false
        this.editando = true
        this.cidade = Object.assign({}, cidade)
        this.cidadeTabela = cidade
        this.calculaMaximo()
        if (this.cidade.percentageByActivity) {
          this.porcentagemAtividade = Number(this.cidade.percentageByActivity * 10000)
        }
        this.porcentagemParticipantes = Number(this.cidade.percentage * 10000)
        this.dadosOriginais.fase = this.cidade.phase
        this.dadosOriginais.valor = this.cidade.valueByActivity
        this.valorPermitidoAtividade = this.calculaValorPermitidoAtividade()
      },
      exclui (index) {
        this.table.items.splice(index, 1)
      },
      // atualizaQuantidadesParticipantes () {
      //   this.totalParticipantesMunicipios = 0
      //   if (this.table.items.length > 0) {
      //     // this.totalParticipantesMunicipios
      //     this.table.items.forEach((item) => {
      //       this.totalParticipantesMunicipios = Number(this.totalParticipantesMunicipios) + Number(item.totalParticipants)
      //     })
      //   }
      // },
      onCancel () {
        this.mostraGrid = !this.mostraGrid
        this.editando = false
        this.cidade = {}
        this.totalParticipantsAdicionar = 0
        this.porcentagemParticipantes = 0
        this.porcentagemAtividade = 0
      },
      onAdd () {
        this.$validator.validateAll().then((result) => {
          if (result && this.$validator.errors.all().length === 0) {
            if (this.editando === true) {
              for (let i in this.cidade) this.cidadeTabela[i] = this.cidade[i]
            } else {
              this.table.items.push(this.cidade)
            }
            // this.atualizaQuantidadesParticipantes()
            this.onCancel()
          }
        })
      },
      calculaMaximo () {
        this.totalParticipantsAdicionar = 0
        if (this.cidade.totalParticipants > 0) {
          this.totalParticipantsAdicionar = this.totalParticipantes - Number(this.totalParticipantesMunicipios) + this.cidade.totalParticipants
        } else {
          this.totalParticipantsAdicionar = Number(this.totalParticipantes) - Number(this.totalParticipantesMunicipios)
          this.$forceUpdate()
        }
      },
      onChangeTotalParticipants () {
        if (this.cidade.totalParticipants > 0) {
          let totalParticipoantesPorcentagem = ((this.cidade.totalParticipants / this.totalParticipantes) * 100).toFixed(2)
          this.porcentagemParticipantes = totalParticipoantesPorcentagem
        }
      },
      ajustaQuantidadeParticipantes () {
        if (this.porcentagemParticipantes > 0 && this.porcentagemParticipantes < 10001) {
          let totalParticipants = Math.round(this.totalParticipantes * (this.porcentagemParticipantes / 10000))
          this.cidade.totalParticipants = parseInt(totalParticipants)
        }
      },
      ajustaValorAtividades () {
        if (this.porcentagemAtividade > 0 && this.porcentagemAtividade < 10001) {
          // pega o valor máximo permitido para fase e calcula com a porcentagem
          let valorAtividades = Math.round(this.calculaValorPermitidoAtividade() * (this.porcentagemAtividade / 10000))
          this.cidade.valueByActivity = parseInt(valorAtividades)
        }
      },
      calculaValorAtividade () {
        let total = 0
        if (this.proposta.objectives.length > 0) {
          this.proposta.objectives.forEach((objetivo) => {
            if (objetivo.goals) {
              objetivo.goals.forEach((meta) => {
                if (meta.activities) {
                  meta.activities.forEach((atividade) => {
                    atividade.items.forEach(item => {
                      if (item.resourceSource === this.cidade.phase) {
                        total += item.totalValue
                      }
                    })
                  })
                }
              })
            }
          })
        }
        return total
      },
      calculaValorAtividadeporFase (fase) {
        let total = 0
        if (this.proposta.objectives.length > 0) {
          this.proposta.objectives.forEach((objetivo) => {
            if (objetivo.goals) {
              objetivo.goals.forEach((meta) => {
                if (meta.activities) {
                  meta.activities.forEach((atividade) => {
                    atividade.items.forEach(item => {
                      if (item.resourceSource === fase) {
                        total += item.totalValue
                      }
                    })
                  })
                }
              })
            }
          })
        }
        return total
      },
      calculaValorPermitidoAtividade () {
        let valorAtividadeTotal = this.calculaValorAtividade()
        let items = this.table.items.filter(item => {
          return item.phase === this.cidade.phase
        })
        let totalAtividadeJaAlocado = items.reduce((acumulador, objeto) => acumulador + objeto.valueByActivity, 0)
        if (this.cidade.phase === this.dadosOriginais.fase) {
          return valorAtividadeTotal - totalAtividadeJaAlocado + this.dadosOriginais.valor
        } else {
          return valorAtividadeTotal - totalAtividadeJaAlocado
        }
      },
      calculaValorPermitidoAtividadeporFase (fase) {
        let valorAtividadeTotal = this.calculaValorAtividadeporFase(fase)
        let items = this.table.items.filter(item => {
          return item.phase === fase
        })
        let totalAtividadeJaAlocado = items.reduce((acumulador, objeto) => acumulador + objeto.valueByActivity, 0)
        return valorAtividadeTotal - totalAtividadeJaAlocado
      }
    }
  }
</script>

<style scoped>

</style>
