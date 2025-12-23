<template>
    <!-- 69906 - Marcação de ODS no projeto -->
    <div v-if="usuarioLogado.userType === 'FUNDACAO'">
        <div v-show="loading.show" class="overlay" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;display: none; background: rgba(255, 255, 255, 0.7); z-index: 1000">
            <i class="fa fa-refresh fa-spin" style="top: 50%; left: 50%; position: absolute; font-size: 30px"></i>
        </div>
        <legend style="background-color: #fcfcfc" v-if="!telaProjeto">
            Cadastro de ODS
        </legend>

        <div class="ods-button-tag" v-if="editando && !detalhamento">
          <i :class="mostrarTodos ? 'fa fa-check-circle-o' : 'fa fa-star'" aria-hidden="true"></i> {{ !mostrarTodos ? 'Favoritos Fundação BB' : 'Todos ODS' }}
        </div>
        <div class="ods-cadastro-container">
            <div v-if="!editando && !detalhamento" class="ods-button-alterar-container">
                <button color="primary" class="btn btn-primary btn-flat" @click="abrirEdicao()"><i class="fa fa-plus-circle" aria-hidden="true"></i>
                    Editar Cadastro de ODS</button>
                <!-- 71994 - Garantir carregamento do ODS cadastrado                     -->
                <button v-if="this.odsCadastrado.length <= 0" color="primary" class="btn btn-primary btn-flat" @click="buscarODSCadastro()"><i class="fa fa-refresh" aria-hidden="true" title="Buscar ODS cadastrado"></i>
                </button>
            </div>
            <div v-if="editando && !detalhamento" class="ods-search-input">
                <multiselect v-model="odsSelecionado"
                            :options="baseODS"
                            :multiple="true"
                            :close-on-select="false"
                            :clear-on-select="false"
                            :hide-selected="false"
                            :preserve-search="true"
                            :custom-label="customLabel" 
                            :show-labels="false"
                            group-values="metas"
                            group-label="ods"
                            track-by="descricao"
                            label="numeroMeta"
                            placeholder="Selecione ou Pesquise as Metas do ODS"
                            selectedLabel="Selecionado"
                            selectLabel="Aperte ENTER para selecionar"
                            deselectLabel="Aperte ENTER para remover"
                            class="multiselect-ods">
                            <template slot="selection" slot-scope="values">
                                <div class="ods-items-lista" v-html="customTag(values.values)"></div>
                            </template>
                    </multiselect>
            </div>
            <b-container v-if="!editando && !detalhamento" fluid class="ods-table">
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
                    <template slot="idOds" scope="row">
                    <div :class="'cor-' + row.item.idOds ">
                        <img :src="getImageODS(row.item.idOds)" alt="ODS IMG" class="ods-img">
                    </div>
                    </template>
                    <template slot="actions" scope="row">
                        <g-button-ujarak color="primary" size="button--size-ss" @click.native="detalharLinha(row.item)"><i class="fa fa-pencil" aria-label="false"></i> Detalhar</g-button-ujarak>
                      </template>
                </b-table>
            </b-container>
        </div>
        <div class="ods-button-cadastro-container-m" v-if="editando && !detalhamento">
          <div class="ods-button-filtro" v-if="editando">
            <button color="primary" class="btn btn-confirm btn-flat" @click="mudarVisualizacao()"><i class="fa fa-arrows" aria-hidden="true"></i>
              {{ mostrarTodos ? 'Mostrar Favoritos FBB' : 'Mostrar Todos ODS' }}</button>
          </div>
            <button color="primary" class="btn btn-primary btn-flat" @click="salvarODS()"><i class="fa fa-floppy-o" aria-hidden="true"></i>
            Salvar</button>
            <button color="primary" class="btn btn-warning btn-flat" @click="cancelarEdicao()"><i class="fa fa-remove" aria-hidden="true"></i>
            Cancelar</button>
        </div>
        <div v-if="detalhamento" class="detalhamento-ods-container">
          <div class="detalhamento-ods-titulo" :class="'cor-' + this.itemDetalhamento.idOds">
            <div>
              <img :src="getImageODS(this.itemDetalhamento.idOds)" alt="ODS IMG" class="ods-img">
            </div>
            {{ this.itemDetalhamento.ods }}
          </div>
          <div class="detalhamento-ods-meta" v-for="meta in this.itemDetalhamento.metas">
            {{ meta }}
          </div>
        </div>
        <div class="ods-button-cadastro-container-m" v-if="detalhamento">
            <button color="primary" class="btn btn-warning btn-flat" @click="detalhamento = false"><i class="fa fa-remove" aria-hidden="true"></i>
            Voltar</button>
        </div>
        <vue-snotify></vue-snotify>
    </div>
  </template>
    
<script>
  import { mapGetters } from 'vuex'
  import odsCadastro from './odsCadastro.vue'
  export default {
    name: 'odsFundacao',
    components: {
      odsCadastro
    },
    data () {
      return {
        mostrarTodos: false,
        detalhamento: false,
        itemDetalhamento: {
          idOds: '',
          ods: 'ODS',
          metas: []
        },
        loading: {
          show: false
        },
        editando: false,
        baseODS: [
          {
            ods: '1 - Número da ODS / Descrição',
            metas: [
                {numeroMeta: '1.1', descricao: '1.a Garantir uma mobilização significativa de recursos a partir de uma variedade de fontes, inclusive por meio do reforço da cooperação para o desenvolvimento, para proporcionar meios adequados e previsíveis para que os países em desenvolvimento, em particular os países menos desenvolvidos, implementem programas e políticas para acabar com a pobreza em todas as suas dimensões', odsFk: '1'},
                {numeroMeta: '2.1', descricao: '2.a Aumentar o investimento, inclusive via o reforço da cooperação internacional, em infraestrutura rural, pesquisa e extensão de serviços agrícolas, desenvolvimento de tecnologia, e os bancos de genes de plantas e animais, para aumentar a capacidade de produção agrícola nos países em desenvolvimento, em particular nos países menos desenvolvidos', odsFk: '2'}
            ]
          },
          {
            ods: '2 - Número da ODS / Descrição',
            metas: [
                {numeroMeta: '1.1', descricao: '3.7 Até 2030, assegurar o acesso universal aos serviços de saúde sexual e reprodutiva, incluindo o planejamento familiar, informação e educação, bem como a integração da saúde reprodutiva em estratégias e programas nacionais', odsFk: '1'},
                {numeroMeta: '2.1', descricao: '8.5 Até 2030, alcançar o emprego pleno e produtivo e trabalho decente para todas as mulheres e homens, inclusive para os jovens e as pessoas com deficiência, e remuneração igual para trabalho de igual valor', odsFk: '2'}
            ]
          }
        ],
        odsTodaBase: [],
        odsFavoritos: [],
        odsCadastrado: [],
        odsSelecionado: [],
        backupSelecionado: [],
        table: {
          items: this.odsCadastrado,
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          perPage: 10,
          fields: [
              { key: 'idOds', label: 'ID', sortable: true, thStyle: 'text-align: center; width: 20%', class: 'text-center' },
              { key: 'descricao', label: 'ODS', sortable: true, thStyle: 'text-align: left; width: 50%', class: 'text-center' },
              { key: 'metas', label: 'Metas', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'actions', label: 'Ações', thStyle: 'width: 10%; text-align: center;', sortable: false, 'class': 'text-center' }
          ]
        }
      }
    },
    props: ['proposta', 'telaProjeto'],
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    watch: {
      // 71994 - Garantir carregamento do ODS cadastrado
      proposta () {
        // this.buscarODSCadastro()
      }
    },
    mounted: function () {
      this.buscarBaseODSFavoritos()
      this.buscarBaseODS()
    },
    methods: {
      async buscarBaseODS () {
        console.log('1 - BUSCA BASE ODS')
        this.loading.show = true
        await axiosLaravel.get('/ods').then((response) => {
          // this.baseODS = []
          this.initListaODS(response.data, false)
          this.buscarODSCadastro()
          // this.loading.show = false
          this.$forceUpdate()
        })
          .catch((error) => {
            // this.loading.show = false
            this.$root.trataErro(error)
          })
      },
      async buscarODSCadastro () {
        console.log('3 - CADASTRO PROPOSTA ODS')
        if (!this.proposta) {
          return null
        }
        this.odsCadastrado = []
        this.loading.show = true
        await axiosLaravel.get('/ods/getMetasODS/' + this.proposta).then((response) => {
          // Cria lista da tabela
          let cadastro = response.data
          console.log(cadastro)
          this.loading.show = true
          if (cadastro.length > 0) {
            let idsODs = [...new Set(cadastro.map(item => item.ods_fk))]
            console.log(idsODs)
            idsODs.forEach(id => {
              let ods = {
                idOds: id,
                descricao: '',
                metas: ''
              }
              this.odsTodaBase.forEach(item => {
                if (item.odsId === Number(id)) {
                  ods.descricao = item.ods
                }
              })
              cadastro.forEach(selecionado => {
                if (selecionado.ods_fk === id) {
                  ods.metas = ods.metas + ', ' + selecionado.numero_meta
                }
              })
              ods.metas = ods.metas.substring(1)
              this.odsCadastrado.push(ods)
            })
            this.table.items = this.odsCadastrado
            this.$forceUpdate()
            this.loading.show = true
            this.odsCadastrado.forEach(ods => {
              let metas = ods.metas.split(', ')
              metas.forEach(meta => {
                // Cria lista de selecionados
                let selecionado = {
                  descricao: '',
                  numeroMeta: '',
                  odsFk: ods.idOds
                }
                selecionado.numeroMeta = meta.trim()
                this.odsTodaBase.forEach(ods => {
                  ods.metas.forEach(meta => {
                    if (meta.numeroMeta === selecionado.numeroMeta) {
                      selecionado.descricao = meta.descricao
                    }
                  })
                })
                this.odsSelecionado.push(selecionado)
              })
            })
          } else {
            this.odsCadastrado = []
          }
          this.loading.show = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.loading.show = false
            this.$root.trataErro(error)
          })
      },
      async buscarBaseODSFavoritos () {
        this.loading.show = true
        await axiosLaravel.get('/ods/indexFavoritos').then((response) => {
          // this.baseODS = []
          this.initListaODS(response.data, true)
          // this.loading.show = false
          this.$forceUpdate()
        })
          .catch((error) => {
            // this.loading.show = false
            this.$root.trataErro(error)
          })
      },
      salvarODS () {
        // Grava na Base
        // Adiciona a tabela de Gravados
        this.odsCadastrado = []
        this.table.items = this.odsCadastrado
        let obj = {
          proposta: this.proposta,
          metasOds: this.odsSelecionado
        }
        this.odsCadastrado = []
        if (this.odsSelecionado.length > 0) {
          this.odsSelecionado.forEach(item => {
            item.odsFk = Number(item.odsFk)
          })
          let idsODs = [...new Set(this.odsSelecionado.map(item => item.odsFk))]
          // console.log(idsODs)
          idsODs.forEach(id => {
            let ods = {
              idOds: id,
              descricao: '',
              metas: ''
            }
            this.odsTodaBase.forEach(item => {
              if (Number(item.odsId) === Number(id)) {
                ods.descricao = item.ods
              }
            })
            this.odsSelecionado.forEach(selecionado => {
              if (selecionado.odsFk === id) {
                ods.metas = ods.metas + ', ' + selecionado.numeroMeta
              }
            })
            ods.metas = ods.metas.substring(1)
            this.odsCadastrado.push(ods)
          })
          this.table.items = this.odsCadastrado
          this.$forceUpdate()
        } else {
          this.odsCadastrado = []
        }
        this.$forceUpdate()
        this.loading.show = true
        axiosLaravel.post('/ods/vincular', obj).then((response) => {
          this.$snotify.success(response.data.message)
          this.editando = false
          this.loading.show = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.loading.show = false
            this.$root.trataErro(error)
          })
      },
      initListaODS (lista, favoritos) {
        console.log('2 - INIT ODS')
        let ods = lista
        ods.forEach(itemODS => {
          // Cria objeto de grupo
          let odsItem = {
            odsId: itemODS.id,
            ods: itemODS.id + ' | ' + itemODS.descricao,
            metas: []
          }
          itemODS.metas.forEach(meta => {
            let metaItem = {
              numeroMeta: meta.numero_meta,
              descricao: meta.descricao,
              odsFk: meta.ods_fk
            }
            odsItem.metas.push(metaItem)
          })
          if (!favoritos) {
            this.odsTodaBase.push(odsItem)
          } else {
            this.odsFavoritos.push(odsItem)
          }
          this.$forceUpdate()
        })
        if (this.mostrarTodos) {
          this.baseODS = this.odsTodaBase
        } else {
          this.baseODS = this.odsFavoritos
        }
      },
      mudarVisualizacao () {
        this.mostrarTodos = !this.mostrarTodos
        if (this.mostrarTodos) {
          // this.buscarBaseODS()
          this.baseODS = this.odsTodaBase
        } else {
          // this.buscarBaseODSFavoritos()
          this.baseODS = this.odsFavoritos
        }
      },
      getImageODS (id) {
        let caminho = `/static/img/ods/${id}.png`
        return caminho
      },
      customLabel (option) {
        return `${option.numeroMeta} | ${option.descricao}`
      },
      customTag (values) {
        let tags = ''
        if (values.length > 0) {
          values.forEach(value => {
            tags = tags + ' ' + '<span class="ods-items-selecao"> ODS: <b>' + value.odsFk + '</b> Meta: <b>' + value.numeroMeta + '</b></span>'
          })
          tags = tags.substring(1)
        }
        return tags
      },
      abrirEdicao () {
        this.editando = true
        this.backupSelecionado = this.odsSelecionado
      },
      cancelarEdicao () {
        this.editando = false
        this.odsSelecionado = this.backupSelecionado
      },
      detalharLinha (row) {
        this.detalhamento = true
        this.itemDetalhamento.idOds = row.idOds
        this.itemDetalhamento.ods = row.descricao
        let metas = row.metas.split(',')
        let metasDescricao = []
        metas.forEach(metaDesc => {
          this.odsTodaBase.forEach(item => {
            if (row.odsId === item.idOds) {
              item.metas.forEach(meta => {
                // console.log(meta.numeroMeta, metaDesc.trim())
                if (Number(meta.numeroMeta === metaDesc.trim())) {
                  let desc = meta.descricao
                  metasDescricao.push(desc)
                }
              })
            }
          })
        })

        this.itemDetalhamento.metas = metasDescricao
      }
    }
  }
  </script>
    
<style>
.ods-cadastro-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;
}
.ods-table {
    width: 100%;
}
.ods-search-input {
    width: 100%;
}

.ods-button-cadastro-container-m {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 5px;
    margin-top: 10px;
}

.ods-items-lista {
    width: 100%;
    max-height: 400px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: center;
    gap: 5px;
    margin-bottom: 5px;
}

.ods-items-selecao { 
  color: white; 
  background-color: #41B883;
  padding: 5px;
  border-radius: 5px;
}

.ods-button-filtro {
  margin-bottom: 10px;
}


/* CORES ODS */
.cor-1 {
  background-color: #e81f2d;
  border-color: #e81f2d;
}
.cor-2 {
  background-color: #d09f2d;
  border-color: #d09f2d;
}
.cor-3 {
  background-color: #2b9b4a;
  border-color: #2b9b4a;
}
.cor-4 {
  background-color: #c42738;
  border-color: #c42738;
}
.cor-5 {
  background-color: #ed422b;
  border-color: #ed422b;
}
.cor-6 {
  background-color: #00acd8;
  border-color: #00acd8;
}
.cor-7 {
  background-color: #fbb617;
  border-color: #fbb617;
}
.cor-8 {
  background-color: #972e47;
  border-color: #972e47;
}
.cor-9 {
  background-color: #f16e25;
  border-color: #f16e25;
}
.cor-10 {
  background-color: #de1c84;
  border-color: #de1c84;
}
.cor-11 {
  background-color: #f79c26;
  border-color: #f79c26;
}
.cor-12 {
  background-color: #bf8b2e;
  border-color: #bf8b2e;
}
.cor-13 {
  background-color: #3f7e44;
  border-color: #3f7e44;
}
.cor-14 {
  background-color: #007CBB;
  border-color: #007CBB;
}
.cor-15 {
  background-color: #3dae4a;
  border-color: #3dae4a;
}
.cor-16 {
  background-color: #00578B;
  border-color: #00578B;
}
.cor-17 {
  background-color: #28426E;
  border-color: #28426E;
}

.ods-button-tag {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 5px;
  margin-bottom: 5px;
  font-weight: 700;
  width:200px;
  color: #28426E;
  gap: 5px;
}

.detalhamento-ods-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 5px;
}

.detalhamento-ods-titulo {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  color: #FFFFFF;
  padding-left: 30px;
  font-size: 1.7rem;
  gap: 10px;
}

.detalhamento-ods-meta {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 1.5rem;
  border: 1px solid #C0C0C0;
  padding: 5px 30px;
  gap: 5px;
}

</style>