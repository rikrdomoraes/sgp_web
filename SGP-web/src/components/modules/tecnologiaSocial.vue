<template>
    <!-- 69906 - Cadastro de Tecnologia Social -->
    <div class="box-body">
        <div v-show="loading.show" class="overlay" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;display: none; background: rgba(255, 255, 255, 0.7); z-index: 1000">
            <i class="fa fa-refresh fa-spin" style="top: 50%; left: 50%; position: absolute; font-size: 30px"></i>
        </div>
        <div class="ts-content-container">
            <div class="ts-button-alterar-container" v-if="!cadastrando && !permiteEditar">
                <button color="primary" class="btn btn-primary btn-flat" @click="permiteEditar = true"><i class="fa fa-pencil" aria-hidden="true"></i>
                    Alterar</button>
            </div>
            <label class="ts-label">
                <div class="ts-label-text">Existe <strong>Tecnologia Social</strong> vinculada ao projeto? <span style="color:red">*</span></div>
                <select class="form-control ts-label-dropdown" v-model="possuiTecnologiaSocial" @change="confirmarDialog()" :disabled="!permiteEditar">
                    <option value="" selected disabled> Selecione </option>
                    <option :value="true"> Sim </option>
                    <option :value="false"> Não </option>
                </select>
            </label>
            <!-- <label class="ts-label" v-if="!possuiTecnologiaSocial">
                Existe <strong>Tecnologia Social</strong> vinculada ao projeto? <input :disabled="!permiteEditar" type="checkbox" v-model="possuiTecnologiaSocial" class="ts-check" />
            </label>
            <label class="ts-label" v-if="possuiTecnologiaSocial">
                Existe <strong>Tecnologia Social</strong> vinculada ao projeto? <input :disabled="!permiteEditar" type="checkbox" v-model="possuiTecnologiaSocial" class="ts-check" v-confirm="{ok: retorno => inputTecnologiaCheck(), cancel: doNothing,
                                message: 'Confirma <strong>EXCLUSÃO</strong> das Tecnologias Sociais cadastradas?'}"/>
            </label> -->
            <div class="ts-button-container" v-if="!cadastrando && possuiTecnologiaSocial && permiteEditar">
                <button color="primary" class="btn btn-primary btn-flat" @click="ativarCadastro()"><i class="fa fa-pencil" aria-hidden="true"></i>
                  Vincular Tecnologia Social</button>
            </div>
            <div v-if="!cadastrando && possuiTecnologiaSocial" class="ts-table-container">
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
                    <template slot="actions" scope="row">
                    <div>
                        <b-button type="button" :disabled="!permiteEditar" v-confirm="{ok: retorno => excluiTecnologia(row.item), cancel: doNothing,
                                message: 'Confirma Exclusão?'}" class="btn btn-danger btn-sm btn-flat"
                                data-cy='exclui-publico-alvo'><i class="fa fa-trash" aria-hidden="true"></i> Excluir</b-button>
                    </div>
                    </template>
                    <template  slot="url" scope="row">
                          <a :href="'https://transforma.fbb.org.br/tecnologia-social/' + row.value" target="_blank"> <i class="fa fa-external-link"></i> </a>
                    </template>
                    </b-table>
                </b-container>
            </div>
            <div v-if="cadastrando && possuiTecnologiaSocial && permiteEditar" class="ts-cadastro-container">
                <div class="ts-search-container">
                  <b-container fluid>
                    <div class="ts-input-container">
                      <input v-model="termoPesquisa" name="termoPesquisa" class="form-control " type="text" minlength="1" ng-maxlength="255"
                                  placeholder="Pesquise a Tecnologia Social aqui." @input="debounceFiltro">
                    </div>
                    <!-- Main table element -->
                    <b-table show-empty
                            stacked="md"
                            :bordered="tsTable.bordered"
                            :items="tsTable.items"
                            :hover="tsTable.hover"
                            :fields="tsTable.fields"
                            :filter="tsTable.filter"
                            :current-page="tsTable.currentPage"
                            :per-page="tsTable.perPage"
                            :sort-by.sync="tsTable.sortBy"
                            :sort-desc.sync="tsTable.sortDesc"
                            empty-text="Nenhum registro encontrado"
                    >
                        <template slot="actions" scope="row">
                        <div>
                            <b-button type="button" :disabled="false" class="btn btn-primary btn-sm btn-flat" @click="selecionaTecnologia(row.item)"
                                    data-cy='exclui-publico-alvo'><i class="fa fa-check-circle" aria-hidden="true"></i> Selecionar</b-button>
                        </div>
                        </template>
                        <template  slot="url" scope="row">
                          <a :href="'https://transforma.fbb.org.br/tecnologia-social/' + row.value" target="_blank"> <i class="fa fa-external-link"></i> </a>
                        </template>
                    </b-table>
                <b-row v-if="tsTable.items.length > tsTable.perPage" class="ts-pagination-container">
                    <b-pagination :total-rows="tsTable.totalRows" :per-page="tsTable.perPage" v-model="tsTable.currentPage" class="" />
                    <div v-if="tsTable.currentPage === 10">
                        <button color="primary" @click="carregarMais" class="btn btn-success btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i>
                        Carregar Mais</button>
                    </div>
                </b-row>
                </b-container>
                </div>
                <div class="ts-button-cadastro-container">
                    <button color="primary" @click="cancelar" class="btn btn-warning btn-flat"><i class="fa fa-remove" aria-hidden="true"></i>
                    Cancelar</button>
                </div>
            </div>
            <div class="ts-button-cadastro-container" v-if="!cadastrando && possuiTecnologiaSocial && permiteEditar">
                    <button color="primary" @click="salvarTecnologia" class="btn btn-primary btn-flat"><i class="fa fa-floppy-o" aria-hidden="true"></i>
                    Salvar</button>
                    <button v-if="telaProjeto" color="primary" @click="permiteEditar = false" class="btn btn-warning btn-flat"><i class="fa fa-remove" aria-hidden="true"></i>
                    Cancelar</button>
            </div>
        </div>
      <vue-snotify></vue-snotify>
    </div>
  </template>
    
  <script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'tecnologiaSocial',
    data () {
      return {
        loading: {
          show: false
        },
        paginaConsulta: 1,
        tecnologiasCadastradas: [],
        tecnologiasSociais: [],
        cadastrando: false,
        termoPesquisa: '',
        totalRows: 0,
        debounceTimer: null,
        possuiTecnologiaSocial: '',
        permiteEditar: true,
        table: {
          items: this.tecnologiasCadastradas,
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          perPage: 10,
          fields: [
              { key: 'id', label: 'ID', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'nome', label: 'Nome', sortable: true, thStyle: 'text-align: left', class: 'text-center' },
              { key: 'url', label: 'Saiba Mais', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'actions', label: 'Ações', thStyle: 'text-align: center', class: 'text-center' }
          ]
        },
        tsTable: {
          items: this.tecnologiasSociais,
          totalRows: 0,
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          perPage: 10,
          fields: [
              { key: 'id', label: 'ID', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'ano', label: 'Ano', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'nome', label: 'Nome', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'url', label: 'Saiba Mais', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'tema', label: 'Tema', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'actions', label: 'Ações', thStyle: 'text-align: center', class: 'text-center' }
          ]
        },
        editar: false
      }
    },
    props: ['proposta', 'fk_processo', 'telaProjeto'],
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    watch: {
      proposta () {
        // this.consultaTecnologiasCadastradas()
      }
    },
    mounted: function () {
      this.consultaTecnologiasCadastradas()
      this.permiteEditar = !this.telaProjeto
    },
    methods: {
      buscarTecnologiasSociais (carregarMais) {
        // Mantém cache da última consulta
        this.loading.show = true
        if (this.tecnologiasSociais.length > 0 && !carregarMais) {
          this.tsTable.items = this.tecnologiasSociais
          this.tsTable.totalRows = this.tecnologiasSociais.length
          this.tsTable.currentPage = 1
          this.loading.show = false
          return
        }
        this.loading.show = true
        let query = 'tecnologiasocial?page=' + this.paginaConsulta + '&perpage=100'
        axiosLaravel.get(query).then((response) => {
          this.tecnologiasSociais = response.data
          this.tsTable.items = this.tecnologiasSociais
          this.tsTable.totalRows = this.tecnologiasSociais.length
          this.tsTable.currentPage = 1
          this.loading.show = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.show = false
            this.$forceUpdate()
          })
      },
      filtrarTecnologias () {
        this.loading.show = true
        let query = 'tecnologiasocial?page=1&perpage=100&search=' + this.termoPesquisa
        axiosLaravel.get(query).then((response) => {
          this.tecnologiasSociais = response.data
          this.tsTable.items = this.tecnologiasSociais
          this.tsTable.totalRows = this.tecnologiasSociais.length
          this.tsTable.currentPage = 1
          this.loading.show = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.show = false
            this.$forceUpdate()
          })
      },
      ativarCadastro () {
        this.cadastrando = true
        this.buscarTecnologiasSociais(false)
      },
      carregarMais () {
        this.paginaConsulta += 1
        this.buscarTecnologiasSociais(true)
      },
      cancelar () {
        this.paginaConsulta = 1
        this.tecnologiasSociais = []
        this.cadastrando = false
      },
      debounceFiltro () {
        clearTimeout(this.debounceTimer)
        this.debounceTimer = setTimeout(() => {
          this.filtrarTecnologias()
        }, 500)
      },
      selecionaTecnologia (row) {
        // verifica se tecnologia já está no array
        let possuiItem = _.find(this.tecnologiasCadastradas, function (item) { if (item.id === row.id) { return item } })
        if (!_.isEmpty(possuiItem)) {
          this.$snotify.warning(row.nome + ' - Já está cadastrado na lista.')
          return
        }
        this.tecnologiasCadastradas.push(row)
        this.table.items = this.tecnologiasCadastradas
        this.table.totalRows = this.tecnologiasCadastradas.length
        this.table.perPage = this.tecnologiasCadastradas.length
        this.table.currentPage = 1
        this.cadastrando = false
      },
      excluiTecnologia (row) {
        this.table.items.splice(row.index, 1)
        this.tecnologiasCadastradas = this.table.items
      },
      salvarTecnologia () {
        let obj = {
          proposta: this.proposta,
          tecnologias: this.tecnologiasCadastradas,
          processo: this.fk_processo,
          usuario: this.usuarioLogado.id
        }
        this.loading.show = true
        axiosLaravel.post('/tecnologiasocial/salvarTecnologias/', obj).then((response) => {
          this.$snotify.success(response.data)
          this.loading.show = false
          this.permiteEditar = !this.telaProjeto
          this.$forceUpdate()
        })
        .catch((error) => {
          this.$root.trataErro(error)
          this.loading.show = false
          this.$forceUpdate()
        })
      },
      async inputTecnologiaCheck () {
        if (!this.possuiTecnologiaSocial) {
          this.loading.show = true
          let obj = {
            proposta: this.proposta,
            tecnologias: this.tecnologiasCadastradas,
            processo: this.fk_processo,
            usuario: this.usuarioLogado.id
          }
          await axiosLaravel.post('/tecnologiasocial/apagarPorProposta', obj).then((response) => {
            this.$snotify.success(response.data)
            this.loading.show = false
            this.$forceUpdate()
          })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.show = false
            this.$forceUpdate()
          })
          this.loading.show = false
          this.tecnologiasCadastradas = []
          this.table.items = []
          this.possuiTecnologiaSocial = false
          this.cadastrando = false
        }
      },
      async consultaTecnologiasCadastradas () {
        // 69906 - Acertos em TS
        if (typeof (this.proposta) === 'undefined') {
          return
        }
        console.log('entrou na consulta')
        this.loading.show = true
        await axiosLaravel.get('/tecnologiasocial/consultarTecnologiaPorProposta/' + this.proposta).then((response) => {
          if (response.data.length > 0) {
            this.tecnologiasCadastradas = response.data
            this.possuiTecnologiaSocial = true
            this.table.items = response.data
            this.$forceUpdate()
          } else {
          // se não tiver tecnologias cadastradas, verifica se foi acionado deliberadamente o NÃO
            axiosLaravel.get('/tecnologiasocial/consultarSePossuiTecnologiaProposta/' + this.proposta).then((response) => {
              if (response.data.possui_ts === 'N') {
                this.possuiTecnologiaSocial = false
                this.$forceUpdate()
              } else if (response.data.possui_ts === 'S') {
                this.possuiTecnologiaSocial = true
                this.$forceUpdate()
              }
            })
            .catch((error) => {
              this.$root.trataErro(error)
              this.loading.show = false
              this.$forceUpdate()
            })
          }
          this.loading.show = false
          this.$forceUpdate()
        })
        .catch((error) => {
          this.$root.trataErro(error)
          this.loading.show = false
          this.$forceUpdate()
        })
      },
      voltarDropDown () {
        this.possuiTecnologiaSocial = true
        this.$forceUpdate()
      },
      confirmarDialog () {
        if (!this.possuiTecnologiaSocial && this.tecnologiasCadastradas.length > 0) {
          this.$dialog.confirm(`Confirma a Exclusão de <strong> todas tecnologais sociais cadastradas </strong> ? (Esta operação não poderá ser desfeita)`, {html: true, animation: 'fade', customClass: 'avisoAlerta'})
          .then(dialog => {
            this.inputTecnologiaCheck()
          }).catch(() => {
            this.voltarDropDown()
            this.$snotify.warning('Operação não realizada.')
          })
        } else if (!this.possuiTecnologiaSocial) {
          this.inputTecnologiaCheck()
        }
      }
    }
  }
  </script>
    
<style scoped>
  .ts-content-container {
    width: 100%;
    padding: 20px;
    border: 1px solid #DDDDDD;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  .ts-table-container {
    width: 100%;
    margin-top: 10px;
  }
  .ts-button-container {
    width: 100%;
    padding: 15px;
  }

  .ts-button-alterar-container {
    width: 100%;
    margin-bottom: 10px;
  }

  .ts-button-cadastro-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    gap: 5px;
  }

  .ts-cadastro-container {
    width: 100%;
    /* background-color: #F3F3F3; */
    min-height: 400px;
    padding: 10px;
  }

  .ts-pagination-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 5px;
  }

  .test-debug {
    border: 1px solid red;
  }

  .ts-input-container {
    margin-bottom: 5px;
  }

.ts-check {
  cursor: pointer;
  width: 20px;
  height: 20px;
}

.ts-label {
  min-width: 500px;
  user-select: none;
  font-weight: 400;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
}

.ts-label-dropdown {
  max-width: 100px;
}


</style>