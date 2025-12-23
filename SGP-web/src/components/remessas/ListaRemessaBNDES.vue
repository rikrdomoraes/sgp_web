<template>
  <div class="content-wrapper" style="min-height: 870px;">
    <section class="content-header">
      <h1>
        <span>Remessas</span>
      </h1>
      <b-breadcrumb
        :items="[{text: 'Inicial', href: '/'}, {text: 'Remessa', href: '#'}, {text: 'Lista de Remessas', active: true}]"/>
    </section>


    <section class="content">
      <div class="row" id="listaRemessas">
        <div class="col-md-12">
          <!-- Lista de ratificações em execução ------------------------------------------------------------------------->
          <div class="box box-primary">
            <div v-show="loading.tela" class="overlay"
                 style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i
              class="fa fa-refresh fa-spin"></i></div>
            <div class="box-body">
              <div class="row">
                <div class="col-md-12">
                  <!--Campo de Filtro -->
                  <div class="col-md-4">
                    <div class="form-group required-field" :class="{'has-error': errors.first('numeroProjeto')}">
                      <label class="control-label col-md-4">Numero do Projeto:</label>
                      <div class="col-md-8">
                        <div>
                          <input v-model="formIntervencao.numeroProjeto"
                                 name="numeroProjeto"
                                 class="form-control text-right"
                                 type="text"
                                 v-validate="'required|min:3'">
                        </div>
                        <span v-if="errors.first('conta corrente')"
                              class="label label-danger">{{ errors.first('numeroProjeto') }}</span>
                      </div>
                    </div>
                  </div>
                  <!--Campo de Filtro -->
                  <div class="col-md-4">
                    <div class="form-group required-field" :class="{'has-error': errors.first('intervencao_bndes')}">
                      <label class="control-label col-md-4">Numero da Intervenção</label>
                      <div class="col-md-8">
                        <div>
                          <input v-model="formIntervencao.intervencao_bndes"
                                 name="intervencao_bndes"
                                 class="form-control text-right"
                                 type="text" v-validate="'required|min:3'">
                        </div>
                        <span v-if="errors.first('conta corrente')"
                              class="label label-danger">{{ errors.first('intervencao_bndes') }}</span>
                      </div>
                    </div>
                  </div>
                  <!--Campo de Filtro -->
                  <div class="col-md-4">
                    <div class="input-group">
                      <g-button-moema color="primary" @click.native="salvar" type="button">
                        <i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar
                      </g-button-moema>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">&nbsp;</div>
                <div class="col-md-12">
                  <div class="col-md-4">&nbsp;</div>
                  <!--Campo de Filtro -->
                  <div class="col-md-4">
                    <div class="input-group">
                      <input v-model="table.filter" type="text" class="form-control" placeholder="Pesquisa...">
                      <span class="input-group-btn">
                        <button :disabled="!table.filter" @click="table.filter = ''" type="button"
                                class="btn btn-default btn-flat"><i class="fa fa-search"></i></button>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">&nbsp;</div>
                <div class="col-md-12">
                  <b-container fluid>
                    <b-table show-empty
                             stacked="md"
                             :bordered="table.bordered"
                             :items="listaRemessas"
                             :fields="table.fields"
                             :filter="table.filter"
                             :current-page="table.currentPage"
                             @filtered="filtrar"
                             :sort-by.sync="table.sortBy"
                             :sort-desc.sync="table.sortDesc"
                             empty-text="Nenhum registro encontrado">
                      <template slot="cnpj" scope="row">{{ row.value | cnpj }}</template>
                      <template slot="data_envio" scope="row">{{ row.value | moment('DD/MM/YYYYm') }}</template>
                    </b-table>
                  </b-container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
/* eslint-disable quotes,no-unused-vars */
import {mapGetters} from 'vuex'

export default {
  name: 'ListaRemessaBNDES',
  data () {
    return {
      loading: {
        tela: false
      },
      listaRemessas: [],
      formIntervencao: {
        numeroProjeto: null,
        intervencao_bndes: null
      },
      listaRemessasConcluidas: [],
      ehDoUsuario: false,
      filtro: [],
      table: {
        filter: null,
        bordered: true,
        currentPage: 1,
        perPage: 1000,
        sortBy: 'id_processo',
        sortDesc: true,
        emptyText: 'Não tem nenhum registro para mostrar',
        fields: [
          {
            key: 'id_bndes',
            label: 'ID do BNDES',
            sortable: true,
            thStyle: 'text-align: center; width: 10%',
            class: 'text-center'
          },
          {
            key: 'numero',
            label: 'Numero da nota',
            sortable: true,
            thStyle: 'text-align: center; width: 10%',
            class: 'text-center'
          },
          {
            key: 'cnpj',
            label: 'CNPJ emissor',
            sortable: true,
            thStyle: 'text-align: center; width: 15%',
            class: 'text-center'
          },
          {
            key: 'numero_projeto',
            label: 'Numero do Projeto',
            sortable: true,
            thStyle: 'text-align: center; width: 10%',
            class: 'text-center'
          },
          {
            key: 'data_envio',
            label: 'Data de envio',
            sortable: true,
            thStyle: 'text-align: center; width: 15%',
            class: 'text-center'
          },
          {
            key: 'status',
            label: 'Status',
            sortable: false,
            thStyle: 'text-align: center; width: 20%',
            class: 'text-center'
          }
          // { key: 'acoes', label: 'Ações', thStyle: 'text-align: center; width: 20%', class: 'text-center' }
        ]
      }
    }
  },
  computed: {
    sortOptions () {
      // Create an options list from our fields
      return this.fields
        .table.filter(f => f.sortable)
        .map(f => {
          return {text: f.label, value: f.key}
        })
    },
    ...mapGetters([
      'usuarioLogado'
    ])
  },
  created: function () {
    this.carregarlistaRemessas()
  },
  mounted: function () {

  },
  methods: {
    async salvar () {
      if (await this.$validator.validateAll()) {
        this.loading.tela = true
        axiosLaravel.post('/remessas/bndes/vincula', this.formIntervencao).then((response) => {
          this.$snotify.success(response.data.mensagem)
        })
          .catch((error) => {
            this.$snotify.error(error.response.data.error)
          }).finally(() => {
            this.loading.tela = false
          })
      }
    },
    carregarlistaRemessas () {
      this.loading.tela = true
      axiosLaravel.get('/remessas/bndes').then((response) => {
        this.listaRemessas = response.data
        this.$forceUpdate()
      })
        .catch((error) => {
          if (error) {
            this.$root.trataErro(error)
          }
        }).finally(() => {
          this.loading.tela = false
        })
    },
    filtrar () {
      console.log('filtrar')
    }
  }
}
</script>

<style scoped>
</style>
