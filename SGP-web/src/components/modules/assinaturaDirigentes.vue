<template>
  <!-- states -->
  <div class="box-body">
    <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
    <div class="box-body">
      
      <div class="row" v-if="!disable && !visualiza">
        <div class="col-md-2" v-if="!adicionando">
          <button @click="onNew()" tooltip="Adiciona um dirigente / designado para Assinar o Convênio com a Fundação BB" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Adicionar Dirigente / Designado </button>
        </div>
      </div>
      <div v-if="adicionando" class="column all-start adicionar-dirigente-container">
        <div class="row-flex all-start required-field w-100">
          <label for="forma_jurídica" class="control-label col-md-4 w-100"> Dirigente/Designado: </label>
          <div class="w-100">
            <select v-model="dirigenteSelecionado"  class="form-control">
              <option value="" disabled>Selecione um Dirigente / Designado:</option>
              <option v-for="dirigente in dirigentesParaAdicionar" :value="dirigente">{{dirigente.ds_nome}}</option>
            </select>
            <div class="box-body">
              <button @click="onAdd()" tooltip="Adiciona um dirigente / designado para Assinar o Convênio com a Fundação BB" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Adicionar </button>
              <button @click="adicionando = false" tooltip="Adiciona um dirigente / designado para Assinar o Convênio com a Fundação BB" type="button" class="btn btn-warning btn-flat"><i class="fa fa-close" aria-hidden="true"></i> Cancelar </button>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div>
      <b-container fluid>
              <!-- Main table element -->
              <b-table how-empty
                       ref="tableDirigentes"
                       stacked="md"
                       id="dirigentes-table"
                       :bordered="table.bordered"
                       :items="table.items"
                       :hover="table.hover"
                       :fields="table.fields"
                       :filter="table.filter"
                       :current-page="table.currentPage"
                       :per-page="table.perPage"
                       :sort-by.sync="table.sortBy"
                       :sort-desc.sync="table.sortDesc"
                       :tbody-tr-class="inativosMostrarOcultar"
                       empty-text="Nenhum registro encontrado"
              >
                <template slot="ds_nome" scope="row">{{row.value }}&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: cornflowerblue">{{row.item.cargo.ds_descricao }}</span></template>
                <template slot="dt_inicio_mandato" scope="row">{{row.value | moment("L")}}</template>
                <template slot="dt_fim_mandato" scope="row">{{row.value | moment("L")}}</template>
                <template slot="actions" scope="row">
                  <div v-if="!disable && !visualiza">
                    <b-button type="button" :disabled="false"v-confirm="{ok: retorno => exclui(row), cancel: doNothing,
                              message: 'Deseja <b>APAGAR</b> o dirigente / designado ' + row.item.ds_nome + ' ?'}"
                              class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</b-button>
                  </div>
                  <div v-else>
                    -
                  </div>
                </template>
                <template slot="bt_ativo" scope="row">
                  <i :class="['fa fa-circle ', row.value ? 'text-green' : 'text-red']" aria-hidden="true"></i>
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
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    components: {
    },
    name: 'assinaturaDirigentes',
    data () {
      return {
        showgrid: true,
        adicionando: false,
        bloqueioCampos: false,
        loading: {
          show: false
        },
        table: {
          items: [],
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          perPage: 50,
          fields: [
            {key: 'ds_nome', label: 'Nome', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
            {key: 'dt_inicio_mandato', label: 'Inicio do mandato', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
            {key: 'dt_fim_mandato', label: 'Vigência do mandato', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
            {key: 'bt_ativo', label: 'Ativo', thStyle: 'text-align: center; width: 13%', class: 'text-center'},
            { key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 13%', class: 'text-center' }
          ]
        },
        dirigentesParaAdicionar: [],
        dirigentesAdicionados: [],
        dirigenteSelecionado: ''
      }
    },
    props: ['visualiza'],
    watch: {
    },
    'table.items': function () {
      this.$emit('dirigenteAdicionado', this.table.items)
    },
    computed: {
      ...mapGetters([
        'usuarioLogado',
        'urlLaravel'
      ]),
      rows () {
        return this.table.items.length
      }
    },
    created () {
      console.log('CREATED ASSINATURA', this.$route.params.id)
      if (this.$route.params.id) {
        this.loading.show = true
        this.consultaDirigentesAssinatura()
        this.consultaDirigentesCadastrados()
        // Consulta dirigentes cadastrados e consulta dirigentes que podem ser cadastrados
      }
    },
    methods: {
      onNew () {
        this.adicionando = true
        this.dirigenteSelecionado = ''
      },
      async consultaDirigentesAssinatura () {
        console.log('Consulta dirigentes para assinar  : ', this.$route.params.id)
        await axiosLaravel.get('simplificado/dirigentesQuePodemAssinar/' + this.$route.params.id).then((response) => {
          console.log(response.data)
          this.dirigentesParaAdicionar = response.data
        })
          .catch((error) => {
            this.loading.show = false
            this.$root.trataErro(error)
          })
      },
      async consultaDirigentesCadastrados () {
        await axiosLaravel.get('simplificado/indexAssinatura/' + this.$route.params.id).then((response) => {
          this.table.items = response.data
          this.dirigentesAdicionados = response.data
          this.loading.show = false
        })
          .catch((error) => {
            this.loading.show = false
            this.$root.trataErro(error)
          })
      },
      async onAdd () {
        // Verifica se o dirigente já está na lista
        const dirigenteJaAdicionado = this.dirigentesAdicionados.some(dirigente => dirigente.id === this.dirigenteSelecionado.id)
        // if (this.dirigentesAdicionados.length >= 2) {
        //   this.$snotify.error('Máximo de dois Dirigentes / Designados.')
        //   return
        // }
        if (dirigenteJaAdicionado) {
          this.$snotify.error('Dirigente / Designado já se encontra cadastrado na lista. Favor Verificar .')
        } else {
          // Adiciona o dirigente à lista
          this.table.items.push(this.dirigenteSelecionado)
          // Grava na base de dados
          this.loading.show = true
          let obj = {
            fk_entidade: this.$route.params.id,
            fk_dirigente: this.dirigenteSelecionado.id,
            responsavel: this.usuarioLogado.ds_login + ' ' + this.usuarioLogado.ds_nome_usuario
          }
          await axiosLaravel.post('simplificado/gravaEntidadeDirigente/', obj).then((response) => {
            this.loading.show = false
            this.$snotify.success(response.data)
            this.dirigenteSelecionado = ''
            this.adicionando = false
          })
          .catch((error) => {
            this.loading.show = false
            this.$root.trataErro(error)
          })
        }
      },
      async exclui (row) {
        console.log(row.item)
        this.table.items.splice(row.index, 1)
        this.loading.show = true
        let obj = {
          fk_entidade: this.$route.params.id,
          fk_dirigente: row.item.id,
          responsavel: this.usuarioLogado.ds_login + ' ' + this.usuarioLogado.ds_nome_usuario
        }
        console.log(obj)
        await axiosLaravel.post('simplificado/excluirEntidadeDirigente/', obj).then((response) => {
          this.loading.show = false
          this.$snotify.success(response.data)
        })
        .catch((error) => {
          this.loading.show = false
          this.$root.trataErro(error)
        })
      }
    }
  }
</script>

<style>
  .junto {
    padding: 0px !important;
  }
  #cadastroEmpresasLigadasDirigentes .vdp-datepicker input[placeholder="__ /__ /____"] {
    background: white;
  }
  .w-100 {
    width: 100%;
  }
  .adicionar-dirigente-container {
    width: 100%;
  }
</style>
