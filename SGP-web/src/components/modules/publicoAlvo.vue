<template>
  <div class="box-body">
    <!--grid-->
    <div v-show="mostraGridPublicoAlvo">
      <div class="row">
        <div class="col-md-12" v-if="somenteLeitura !== false">
          <button v-if="formEditavel" @click="mostraGridPublicoAlvo = !mostraGridPublicoAlvo" uib-tooltip="Adiciona um público alvo" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Novo Público alvo</button>
        </div>
        <!-- /.col -->
      </div>
      <br v-if="formEditavel">
      <div class="row">
        <div v-if="somenteLeitura !== false">
          <b-container fluid>
            <!-- Main table element -->
            <b-table show-empty
                     stacked="md"
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
              <template slot="nr_jovens" scope="row">{{row.value}}</template>
              <template slot="nr_mulheres" scope="row">{{row.value}}</template>
              <!-- chamado 64.285 : Permitir editar enquanto não é projeto aprovado (não tem número de projeto) -->
              <template slot="actions" scope="row" v-if="somenteLeitura !== false && formEditavel">
                <div>
                  <b-button type="button" :disabled="false" @click.stop="edita(row.item)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>
                  <b-button type="button" :disabled="false" v-confirm="{ok: retorno => exclui(row), cancel: doNothing,
                           message: 'Deseja <b>APAGAR</b> o item ' + row.item.fonte.ds_descricao + ' ?'}" class="btn btn-danger btn-sm btn-flat"
                            data-cy='exclui-publico-alvo'><i class="fa fa-trash" aria-hidden="true"></i> Excluir</b-button>
                </div>
              </template>
            </b-table>
          </b-container>
        </div>
        
      </div>
    </div>
    <!-- form -->
    <div v-if="!mostraGridPublicoAlvo" :disabled="mostraGridPublicoAlvo"  style="padding-left:0" class="row well well-sm no-shadow animated fadeInDownOutUp">
    <div class="col-md-12">

      <!-- Público-Alvo -->
      <div class="form-group required-field"
           :class="{ 'has-error' : errors.first('Público-alvo')}">
        <label class="control-label col-md-2">Público-alvo:</label>
        <div class="col-md-4">
          <div>
            <select v-model="publicoAlvo.fonte" name="Público-alvo"  class="form-control" data-vv-as="Descrição do Público-alvo"
                    v-validate="'required'" data-cy="fonte">
              <option :value="publico" v-for="publico in publicosAlvo">{{publico.ds_descricao}}</option>
            </select>

          </div>
          <span v-if="errors.first('Público-alvo')" class="label label-danger"> {{ errors.first('Público-alvo') }}</span>
        </div>
      </div>


      <!-- TIPO DO PUBLICO-ALVO -->
      <div class="form-group required-field"
           :class="{ 'has-error' : errors.first('Tipo público-alvo')}">
        <label class="control-label col-md-2">Tipo público-alvo:</label>
        <div class="col-md-3">
          <div>
            <select v-model="publicoAlvo.ds_tipo_publico_alvo" data-cy="ds_tipo_publico_alvo" class="form-control" data-vv-as="Tipo do Público-alvo" name="Tipo público-alvo" v-validate="'required'">
            <option value="10">Outros</option>
            <option value="20">Agricultores familiares</option>
            <option value="30">Assentados da reforma agrária</option>
            <option value="40">Extrativistas</option>
            <option value="50">Indígenas</option>
            <option value="60">Catadores de materiais recicláveis</option>
            <option value="70">Associados</option>
            <option value="80">Jovens de 18 a 24 anos (ambos os sexos) do Programa Jovem Aprendiz no Campo</option>
            <option value="90">Estudantes Ensino Superior Público (UFOB) da Área de alimentos (18 a 24 anos - ambos os sexos)</option>
          </select>
          </div>
          <span v-if="errors.first('Tipo público-alvo')" class="label label-danger"> {{ errors.first('Tipo público-alvo') }}</span>
      </div>
      </div>


      <!-- Participantes diretos -->
      <div class="form-group required-field"
           :class="{ 'has-error' : errors.first('participantes diretos')}">
        <label class="control-label col-md-2">Participantes diretos:</label>
        <div class="col-md-2">
          <div>
            <input v-model="publicoAlvo.nr_participantes_diretos" data-cy="nr_participantes_diretos" name="participantes diretos" data-vv-as="Participantes Diretos" class="form-control" min="1" max="2147483647" type="number" required
                   v-validate="'required|min_value:1|max_value:2147483647'">


          </div>
          <span v-if="errors.first('participantes diretos')" class="label label-danger"> {{ errors.first('participantes diretos') }}</span>
        </div>


        <div class="col-md-4">
          <span class="message" style="color: red"> * Os relatórios de execução do projeto, exigirão os dados dos participantes diretos.</span>
        </div>


      </div>

      <!-- Participantes indiretos -->
      <div class="form-group" v-if="false"
           :class="{ 'has-error' : errors.first('participantes Indiretos')}">
        <label class="control-label col-md-2">Participantes indiretos:</label>
          <div class="col-md-2">
            <div>
              <input v-if="false" v-model="publicoAlvo.nr_participantes_indiretos" data-cy="nr_participantes_indiretos" name="participantes Indiretos" data-vv-as="Participantes Indiretos"  class="form-control" type="number"  max="2147483647" v-validate="'max_value:2147483647'">
            </div>
            <span v-if="errors.first('participantes Indiretos')" class="label label-danger"> {{ errors.first('participantes Indiretos') }}</span>
        </div>
      </div>
      <br>

      <div class="input-group">
        <span style="color: red; margin-bottom: 10px">* Dentre os participantes diretos informe, se houver, quantos são Jovens e/ou Mulheres</span>
      <!-- Atende Jovens -->
      <div class="form-group"
           :class="{ 'has-error' : errors.first('Atende jovens')}">
        <label class="control-label col-md-2">Atende jovens?</label>
        <div class="col-md-2">
          <div>
            <select v-model="jovensBool" data-cy="jovensBool" name="Atende jovens" class="form-control" v-validate="'required'" @change="alteraJovens">
            <option value="Sim" :selected="publicoAlvo.nr_jovens">Sim</option>
            <option value="Não">Não</option>
          </select>
          </div>
          <span v-if="errors.first('Atende jovens')" class="label label-danger"> {{ errors.first('Atende jovens') }}</span>
        </div>
      </div>

      <!-- jovens -->
      <div v-if="jovensBool === 'Sim'" class="form-group"
           :class="{ 'has-error' : errors.first('Número de jovens atendidos')}">
      <label class="control-label col-md-2">Número de jovens atendidos:</label>
      <div class="col-md-2">
        <div>
          <input v-model="publicoAlvo.nr_jovens" name="Número de jovens atendidos" class="form-control" type="number" min="1" :max="publicoAlvo.nr_participantes_diretos"  v-validate="{required: jovensBool === 'Sim'}">
        </div>
          <span v-if="errors.first('Número de jovens atendidos')" class="label label-danger"> {{ errors.first('Número de jovens atendidos') }}</span>
        </div>
      </div>

      <!-- atende mulheres -->
      <div class="form-group"
           :class="{ 'has-error' : errors.first('Atende mulheres')}">
        <label class="control-label col-md-2">Atende mulheres?</label>
        <div class="col-md-2">
          <div>
            <select v-model="mulheresBool" data-cy="mulheresBool" name="Atende mulheres" class="form-control" v-validate="'required'" @change="alteraMulheres">
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </div>
          <span v-if="errors.first('Atende mulheres')" class="label label-danger"> {{ errors.first('Atende mulheres') }}</span>
        </div>
      </div>

      <!-- women -->
      <div v-if="mulheresBool === 'Sim'" class="form-group"
           :class="{ 'has-error' : errors.first('Número de mulheres atendidas')}">
      <label class="control-label col-md-2">Número de mulheres atendidas:</label>
        <div class="col-md-2">
          <div>
            <input v-model="publicoAlvo.nr_mulheres" name="Número de mulheres atendidas" class="form-control" type="number" min="1" :max="publicoAlvo.nr_participantes_diretos" v-validate="{required: mulheresBool=='Sim'}">
          </div>
          <span v-if="errors.first('Número de mulheres atendidas')" class="label label-danger"> {{ errors.first('Número de mulheres atendidas') }}</span>
        </div>
      </div>
      </div>
<br>
      <!-- botões -->
      <div class="form-group" style="margin-bottom:0">
        <div class="col-md-4 col-md-offset-2">

          <button @click="onAdd" data-cy="adiciona-publico" id="proposal-audience-add" type="button" class="btn btn-confirm btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Ok</button>
          <button @click="cancelaPublico" id="proposal-audience-cancel" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>

        </div>
      </div>
    </div>
  </div>
<vue-snotify></vue-snotify>
  </div>
</template>

<script>
    export default {
      name: 'publicoAlvo',
      data () {
        return {
          perfis: {},
          table: {
            items: this.propsPublicosGrid,
            filter: null,
            hover: true,
            bordered: true,
            currentPage: 1,
            perPage: 10,
            fields: [
              { key: 'fonte.ds_descricao', label: 'Público Alvo', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'nr_participantes_diretos', label: 'Participantes Diretos', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              // { key: 'nr_participantes_indiretos', label: 'Participantes Indiretos', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'nr_jovens', label: 'Jovens atendidos', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'nr_mulheres', label: 'Mulheres atendidas', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'actions', label: 'Ações', thStyle: 'text-align: center', class: 'text-center' }

            ],
            fields2: [
              { key: 'fonte.ds_descricao', label: 'Público Alvo', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'nr_participantes_diretos', label: 'Participantes Diretos', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              // { key: 'nr_participantes_indiretos', label: 'Participantes Indiretos', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'nr_jovens', label: 'Jovens atendidos', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'nr_mulheres', label: 'Mulheres atendidas', sortable: true, thStyle: 'text-align: center', class: 'text-center' }
              // { key: 'actions', label: 'Ações', thStyle: 'text-align: center', class: 'text-center' }

            ]
          },
          mostraGridPublicoAlvo: true,
          publicosAlvo: {},
          publicosAlvoTabela: [],
          publicoAlvo: {},
          mulheresBool: null,
          jovensBool: null,
          editando: false,
          formEditavel: !_.has(this.$route.params, 'numero'),
          // Verifica se é projeto da carteira Ajuda Humanitária. Se for, permitirá edição do Público Alvo
          // TODO: adicionar regra ao Novo Gerenciador de Configurações do backlog
          // É uma lista com os projetos de Ajuda Humanitária. No futuro, carregar automaticamente ou delegar pro sistema de Configurações
          // Verifica se o projeto em questão é de Ajuda Humanitária para permitir alterações
          projetoAjudaHumanitaria: [20020, 20313, 20314, 20731, 21263, 21270, 21276, 21277, 21299, 21305, 21310, 21311, 20250, 21316, 20022, 20023, 20262].includes(parseInt(this.$route.params.numero))
        }
      },
      props: ['propsPublicosGrid', 'editavel', 'somenteLeitura'],
      computed: {
      },
      watch: {
        propsPublicosGrid: function () {
          this.table.items = this.propsPublicosGrid
        },
        editavel: function () {
          this.formEditavel = this.editavel
        },
        mostraGridPublicoAlvo: function () {
          this.$emit('validacaoPublicoAlvo', {'tag': 'publicoditando', 'ativo': (!this.mostraGridPublicoAlvo), 'tipo': 'restricao', 'acao': null, 'mensagem': '<span class=\'restricaoEditandoInformacao\'>Ainda está editando um Público-alvo<span>'})
        }
      },
      mounted: function () {
        this.buscaPublicoAlvo()
      },
      methods: {
        buscaPublicoAlvo () {
          axiosLaravel.get('publico-alvo-fonte').then((response) => {
            this.publicosAlvo = response.data
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        },
        cancelaPublico () {
          this.publicoAlvo = {}
          this.mulheresBool = null
          this.jovensBool = null
          this.mostraGridPublicoAlvo = true
          this.editando = false
        },
        onAdd () {
          console.log('this.publicoAlvo.nr_jovens', this.publicoAlvo.nr_jovens)
          console.log('this.publicoAlvo.nr_mulheres', this.publicoAlvo.nr_mulheres)
          console.log('this.publicoAlvo.nr_participantes_diretos', this.publicoAlvo.nr_participantes_diretos)
          if ((parseInt(this.publicoAlvo.nr_jovens) > parseInt(this.publicoAlvo.nr_participantes_diretos) || parseInt(this.publicoAlvo.nr_mulheres)) > parseInt(this.publicoAlvo.nr_participantes_diretos)) {
            this.$snotify.error('O número de jovens ou mulheres excede o total de ' + this.publicoAlvo.nr_participantes_diretos + ' participantes diretos!')
            return
          }
          this.$validator.validateAll().then((result) => {
            if (result) {
              // Se estiver NÃO estiver em forma de edição então adiciona na tabela
              if (this.editando === true) {
                for (let i in this.publicoAlvo) this.publicosAlvoTabela[i] = this.publicoAlvo[i]
              } else {
                this.table.items.push(this.publicoAlvo)
              }
              this.$emit('publicoAlvoAdicionado', this.table.items)
              this.cancelaPublico()
            }
            let bc = new BroadcastChannel('propostas')
            bc.postMessage({acao: 'notificacaoAtualizacaoPublicoAlvo', id: this.$route.params.id})
          })
        },
        edita (item) {
          this.editando = true
          this.publicoAlvo = Object.assign({}, item)
          this.publicosAlvoTabela = item
          this.publicoAlvo.nr_mulheres ? this.mulheresBool = 'Sim' : this.mulheresBool = 'Não'
          this.publicoAlvo.nr_jovens ? this.jovensBool = 'Sim' : this.jovensBool = 'Não'
          this.mostraGridPublicoAlvo = false
        },
        alteraJovens () {
          // ajusta jovens
          this.publicoAlvo.nr_jovens = this.jovensBool === 'Sim' ? this.publicoAlvo.nr_jovens : 0
        },
        alteraMulheres () {
          // ajusta mulheres
          this.publicoAlvo.nr_mulheres = this.mulheresBool === 'Sim' ? this.publicoAlvo.nr_mulheres : 0
        },
        exclui (row) {
          this.table.items.splice(row.index, 1)
          let bc = new BroadcastChannel('propostas')
          bc.postMessage({acao: 'notificacaoAtualizacaoPublicoAlvo', id: this.$route.params.id})
        }
      }
    }
</script>

<style scoped>

</style>
