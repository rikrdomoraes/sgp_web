<template>
  <div class="box-body">
    <!--grid-->
    <div v-show="mostraGridPublicoAlvo">
      <div class="row" ng-show="$ctrl.isNewAvaiable()">
        <div class="col-md-12">
          <button @click="mostraGridPublicoAlvo = !mostraGridPublicoAlvo" uib-tooltip="Adiciona um público alvo" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Novo Público alvo</button>
        </div>
        <!-- /.col -->
      </div>
      <br>
      <div class="row">
        <div class="col-md-12">
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
              <template slot="youngs" scope="row">{{row.value? 'Sim' : 'Não'}}</template>
              <template slot="women" scope="row">{{row.value? 'Sim' : 'Não'}}</template>
              <template slot="actions" scope="row">
                <div>
                  <b-button type="button" :disabled="false" @click.stop="edita(row.item)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>
                  <b-button type="button" :disabled="false" @click.stop="exclui(row)" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</b-button>
                </div>
              </template>
            </b-table>
          </b-container>
        </div>
      </div>
    </div>
    <!-- form -->
    <div v-if="!mostraGridPublicoAlvo" :disabled="mostraGridPublicoAlvo" ng-form="frmAddTargetAudience" ssm-isolated-form style="padding-left:0" class="row well well-sm no-shadow animated fadeInDownOutUp">
      <div class="col-md-6">

        <!-- audience -->
        <div ng-if="$ctrl.isAval('AUDIENCE')" class="form-group required-field"
             :class="{ 'has-error' : errors.first('Público-alvo')}">
          <label for="audience" class="control-label col-md-4">Público-alvo:</label>
          <div class="col-md-8">
            <div approval="$ctrl.approval" state="$ctrl.approvalState">
              <select v-model="publicoAlvo.audience" name="Público-alvo"  class="form-control ng-pristine ng-untouched ng-valid ng-not-empty"
                      v-validate="'required'">
                <option :value="publico" v-for="publico in publicosAlvo">{{publico.description}}</option>
              </select>

            </div>
            <!--<ng-messages ng-if="frmAddTargetAudience.$submitted" for="frmAddTargetAudience.audience.$error" role="alert">-->
            <!--<ng-message when="required"  class="label label-danger">Campo requerido</ng-message>-->
            <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
            <!--</ng-messages>-->
            <span v-if="errors.first('Público-alvo')" class="label label-danger"> {{ errors.first('Público-alvo') }}</span>
          </div>
        </div>

        <!-- audienceTypeOthers -->
        <!--<div ng-if="$ctrl.isAval('AUDIENCETYPEOTHERS') && $ctrl.audience.audience.code==19" class="form-group"-->
        <!--ng-class="{ 'required' : $ctrl.isReq('AUDIENCETYPEOTHERS'), 'has-error' : frmAddTargetAudience.$submitted && (frmAddTargetAudience.audienceTypeOthers.$error.required || frmAddTargetAudience.audienceTypeOthers.$error.maxlength) || frmAddTargetAudience.audienceTypeOthers.$error.validateChange  }">-->
        <!--<label for="audienceTypeOthers" class="control-label col-md-4">Descreva quais outros:</label>-->
        <!--<div class="col-md-6">-->
        <!--<div name="{{ 'audience.audienceTypeOthers.'+$ctrl.audience.id }}" approval="$ctrl.approval" state="$ctrl.approvalState">-->
        <!--<input ng-model="$ctrl.audience.audienceTypeOthers" name="audienceTypeOthers" class="form-control" type="text" maxlength="255" ng-required="$ctrl.isAval('AUDIENCETYPEOTHERS') && $ctrl.audience.audienceType=='10'">-->
        <!--</div>-->
        <!--<ng-messages ng-if="frmAddTargetAudience.$submitted" for="frmAddTargetAudience.audienceTypeOthers.$error" role="alert">-->
        <!--<ng-message when="required"  class="label label-danger">Campo requerido</ng-message>-->
        <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
        <!--<ng-message when="maxlength" class="label label-danger">Tamanho máximo de caracteres: 255</ng-message>-->
        <!--</ng-messages>-->
        <!--</div>-->
        <!--</div>-->

        <!-- TIPO DE AUDIÊNCIA -->
        <div ng-if="$ctrl.isAval('AUDIENCETYPE')" class="form-group required-field"
             :class="{ 'has-error' : errors.first('Tipo público-alvo')}">
          <label for="audienceType" class="control-label col-md-4">Tipo público-alvo:</label>
          <div class="col-md-6">
            <div approval="$ctrl.approval" state="$ctrl.approvalState">
              <select v-model="publicoAlvo.audienceType" class="form-control" name="Tipo público-alvo" v-validate="'required'">
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
            <!--<ng-messages ng-if="frmAddTargetAudience.$submitted" for="frmAddTargetAudience.audienceType.$error" role="alert">-->
            <!--<ng-message when="required"  class="label label-danger">Campo requerido</ng-message>-->
            <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
            <!--</ng-messages>-->
          </div>
        </div>


        <!-- Participantes diretos -->
        <div ng-if="$ctrl.isAval('DIRECTPARTICIPANTS')" class="form-group required-field"
             :class="{ 'has-error' : errors.first('participantes diretos')}">
          <label for="directParticipants" class="control-label col-md-4">Participantes diretos:</label>
          <div class="col-md-4">
            <div approval="$ctrl.approval" state="$ctrl.approvalState">
              <input v-model="publicoAlvo.directParticipants" name="participantes diretos" class="form-control" min="1" max="2147483647" type="number" required
                     v-validate="'required|min_value:1|max_value:2147483647'">
            </div>
            <!--<ng-messages ng-if="frmAddTargetAudience.$submitted" for="frmAddTargetAudience.directParticipants.$error" role="alert">-->
            <!--<ng-message when="required"  class="label label-danger">Campo requerido</ng-message>-->
            <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
            <!--<ng-message when="min"  class="label label-danger">Valor mínimo de: 1</ng-message>-->
            <!--<ng-message when="max"  class="label label-danger">Valor máximo excedido</ng-message>-->
            <!--</ng-messages>-->
            <span v-if="errors.first('participantes diretos')" class="label label-danger"> {{ errors.first('participantes diretos') }}</span>
          </div>
        </div>

        <!-- Participantes indiretos -->
        <div ng-if="$ctrl.isAval('INDIRECTPARTICIPANTS')" class="form-group"
             :class="{ 'has-error' : errors.first('participantes Indiretos')}">
          <label for="indirectParticipants" class="control-label col-md-4">Participantes indiretos:</label>
          <div class="col-md-4">
            <div  approval="$ctrl.approval" state="$ctrl.approvalState">
              <input v-model="publicoAlvo.indirectParticipants" name="participantes Indiretos" class="form-control" type="number"  max="2147483647" v-validate="'max_value:2147483647'">
            </div>
            <span v-if="errors.first('participantes Indiretos')" class="label label-danger"> {{ errors.first('participantes Indiretos') }}</span>
          </div>
        </div>

        <!-- youngsBool -->
        <div ng-if="$ctrl.isAval('YOUNGSBOOL')" class="form-group"
             :class="{ 'has-error' : errors.first('Atende jovens')}">
          <label for="youngsBool" class="control-label col-md-4">Atende jovens?</label>
          <div class="col-md-3 col-xs-4">
            <div approval="$ctrl.approval" state="$ctrl.approvalState">
              <select v-model="youngsBool" name="Atende jovens" class="form-control" v-validate="'required'">
                <option value="Sim" :selected="publicoAlvo.youngs">Sim</option>
                <option value="Não">Não</option>
              </select>
            </div>
            <!--<ng-messages ng-if="frmAddTargetAudience.$submitted" for="frmAddTargetAudience.youngsBool.$error" role="alert">-->
            <!--<ng-message when="required"  class="label label-danger">Campo requerido</ng-message>-->
            <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
            <!--</ng-messages>-->
            <span v-if="errors.first('Atende jovens')" class="label label-danger"> {{ errors.first('Atende jovens') }}</span>
          </div>
        </div>

        <!-- youngs -->
        <div v-if="youngsBool === 'Sim'" class="form-group"
             :class="{ 'has-error' : errors.first('Número de jovens atendidos')}">
          <label for="youngs" class="control-label col-md-4">Número de jovens atendidos:</label>
          <div class="col-md-4">
            <div approval="$ctrl.approval" state="$ctrl.approvalState">
              <input v-model="publicoAlvo.youngs" name="Número de jovens atendidos" class="form-control" type="number" min="1" :max="publicoAlvo.indirectParticipants + publicoAlvo.directParticipants" v-validate="{required: youngsBool === 'Sim'}">
            </div>
            <!--<ng-messages ng-if="frmAddTargetAudience.$submitted" for="frmAddTargetAudience.youngs.$error" role="alert">-->
            <!--<ng-message when="required"  class="label label-danger">Campo requerido</ng-message>-->
            <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
            <!--<ng-message when="min" class="label label-danger">Valor mínimo de: 1</ng-message>-->
            <!--<ng-message when="max"  class="label label-danger">Valor total de participantes excedido</ng-message>-->
            <span v-if="errors.first('Número de jovens atendidos')" class="label label-danger"> {{ errors.first('Número de jovens atendidos') }}</span>
            <!--</ng-messages>-->
          </div>
        </div>

        <!-- womenBool -->
        <div ng-if="$ctrl.isAval('WOMENBOOL')" class="form-group"
             :class="{ 'has-error' : errors.first('Atende mulheres')}">
          <label for="womenBool" class="control-label col-md-4">Atende mulheres?</label>
          <div class="col-md-3 col-xs-4">
            <div approval="$ctrl.approval" state="$ctrl.approvalState">
              <select v-model="womenBool" name="Atende mulheres" class="form-control"
                      v-validate="'required'">
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </div>
            <!--<ng-messages ng-if="frmAddTargetAudience.$submitted" for="frmAddTargetAudience.womenBool.$error" role="alert">-->
            <!--<ng-message when="required"  class="label label-danger">Campo requerido</ng-message>-->
            <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
            <!--</ng-messages>-->
            <span v-if="errors.first('Atende mulheres')" class="label label-danger"> {{ errors.first('Atende mulheres') }}</span>
          </div>
        </div>

        <!-- women -->
        <div v-if="womenBool === 'Sim'" class="form-group"
             :class="{ 'has-error' : errors.first('Número de mulheres atendidas')}">
          <label for="women" class="control-label col-md-4">Número de mulheres atendidas:</label>
          <div class="col-md-4">
            <div approval="$ctrl.approval" state="$ctrl.approvalState">
              <input v-model="publicoAlvo.women" name="Número de mulheres atendidas" class="form-control" type="number" min="1" :max="publicoAlvo.indirectParticipants + publicoAlvo.directParticipants" v-validate="{required: womenBool=='Sim'}">
            </div>
            <!--<ng-messages ng-if="frmAddTargetAudience.$submitted" for="frmAddTargetAudience.women.$error" role="alert">-->
            <!--<ng-message when="required"  class="label label-danger">Campo requerido</ng-message>-->
            <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
            <!--<ng-message when="min" class="label label-danger">Valor mínimo de: 1</ng-message>-->
            <!--<ng-message when="max"  class="label label-danger">Valor total de participantes excedido</ng-message>-->
            <!--</ng-messages>-->
            <span v-if="errors.first('Número de mulheres atendidas')" class="label label-danger"> {{ errors.first('Número de mulheres atendidas') }}</span>
          </div>
        </div>

        <!-- buttons -->
        <div class="form-group" style="margin-bottom:0">
          <div class="col-md-8 col-md-offset-4">
            <button @click="onAdd" type="button"
                    class="btn btn-primary btn-flat" id="proposal-audience-add">
              <i class="fa fa-check" aria-hidden="true"></i> Ok
            </button>
            <button @click="cancelaPublico()" type="button"
                    class="btn btn-default btn-flat" id="proposal-audience-cancel">
              <i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
    <vue-snotify></vue-snotify>  </div></template>

<script>
  export default {
    name: 'publicoAlvoOld',
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
            { key: 'audience.description', label: 'Público Alvo', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'directParticipants', label: 'Participantes Diretos', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'indirectParticipants', label: 'Participantes Indiretos', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'youngs', label: 'Atende Jovens?', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'women', label: 'Atende Mulheres?', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'actions', label: 'Ações', thStyle: 'text-align: center', class: 'text-center' }

          ]
        },
        mostraGridPublicoAlvo: true,
        publicosAlvo: [],
        publicosAlvoTabela: [],
        publicoAlvo: {},
        womenBool: null,
        youngsBool: null,
        editando: false
      }
    },
    props: ['propsPublicosGrid'],
    watch: {
      propsPublicosGrid: function () {
        this.table.items = this.propsPublicosGrid
      }
    },
    mounted: function () {
      this.buscaPublicoAlvo()
    },
    methods: {
      buscaPublicoAlvo () {
        axios.get('proxy/project/target-audience-source').then((response) => {
          this.publicosAlvo = response.data.value
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      cancelaPublico () {
        this.publicoAlvo = {}
        this.womenBool = null
        this.youngsBool = null
        this.mostraGridPublicoAlvo = true
        this.editando = false
      },
      onAdd () {
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
        })
      },
      edita (item) {
        this.editando = true
        this.publicoAlvo = Object.assign({}, item)
        this.publicosAlvoTabela = item
        this.publicoAlvo.women ? this.womenBool = 'Sim' : this.womenBool = 'Não'
        this.publicoAlvo.youngs ? this.youngsBool = 'Sim' : this.youngsBool = 'Não'
        this.mostraGridPublicoAlvo = false
      },
      exclui (row) {
        this.table.items.splice(row.index, 1)
      }
    }
  }
</script>

<style scoped>

</style>
