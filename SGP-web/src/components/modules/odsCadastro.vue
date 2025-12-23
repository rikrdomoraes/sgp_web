<template>
    <!-- 69906 - Prototipo ODS -->
    <div class="ods-cadastro-main-container" v-if="usuarioLogado.userType === 'FUNDACAO'">
        <div v-show="loading.show" class="overlay" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;display: none; background: rgba(255, 255, 255, 0.7); z-index: 1000">
            <i class="fa fa-refresh fa-spin" style="top: 50%; left: 50%; position: absolute; font-size: 30px"></i>
        </div>
        <div class="ods-cadastro-content-container">

            <div v-if="editando == false" class="ods-button-alterar-container">
                <button color="primary" class="btn btn-primary btn-flat" @click="editando = true"><i class="fa fa-plus-circle" aria-hidden="true"></i>
                    Editar Cadastro de Favoritos ODS</button>
            </div>
            <b-container v-if="editando == false" fluid>
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
                </b-table>
            </b-container>

            <div v-if="editando == true" class="ods-check-main-container">
              <div class="ods-input-container">
                 Selecione as Metas e clique em <strong>Salvar</strong> abaixo para definir os favoritos.
              </div>
              <!-- <div class="ods-input-container">
                  <input v-model="termoPesquisa" name="termoPesquisa" class="form-control " type="text" minlength="1" ng-maxlength="255"
                              placeholder="Pesquise a ODS, metas e indicadores aqui.">
              </div> -->
                <div v-for="ods in this.baseODS" class="ods-base">
                  <div class="base-ods-row">
                    <div class="base-ods-content" @click="toggleMeta(ods.id)">
                      <div class="ods-text-container" :class="'cor-' + ods.id ">
                        <div class="ods-id">
                            {{ ods.id }}
                        </div>
                        <div class="ods-descricao">
                            {{ ods.descricao }}
                        </div>
                      </div>
                        <div class="ods-img-container" :class="'cor-' + ods.id ">
                            <img :src="getImageODS(ods.id)" alt="ODS IMG" class="ods-img">
                            <img :src="getImageODS('caret')" alt="ODS IMG" class="ods-carret" :class="{'ods-indicador' : ods.abrirMeta}">
                        </div>
                    </div>
                  </div>
                  <div class="ods-metas-indicador" v-if="ods.abrirMeta">
                    <i class="fa fa-check-circle" aria-hidden="true"></i> Metas
                  </div>

                  <div v-for="meta in ods.metas" v-if="ods.abrirMeta" class="ods-meta-base">
                    <div class="base-ods-row">
                      <div class="base-ods-content" @click="toggleIndicador(ods.id, meta.id)">
                        <div class="ods-meta-text-container" :class="'cor-' + ods.id ">
                          {{ meta.descricao }}
                        </div>
                        <label class="ods-check-container"  @click.stop="">
                          <input type="checkbox" class="ods-check" v-model="meta.selecionado"/>
                        </label>
                      </div>
                    </div>
                    
                    <!-- <div class="ods-metas-indicador" v-if="meta.abrirIndicador">
                      <i class="fa fa-check-circle" aria-hidden="true"></i> Indicadores {{ meta.descricao.slice(0,4) }}
                    </div>

                    <div v-for="indicador in meta.indicadores" v-if="meta.abrirIndicador" class="ods-indicador-base">
                        <div class="base-indicador-row">
                          <div class="base-ods-content">
                            <div class="ods-indicador-text-container" :class="'cor-' + ods.id ">
                              {{indicador.codigo}} {{ indicador.descricao }}
                            </div>
                            <label class="ods-check-container">
                              <input type="checkbox" class="ods-check" v-model="indicador.selecionado"/>
                            </label>
                          </div>
                        </div>
                    </div> -->
                  </div>
                </div>

                <div class="ods-button-cadastro-container">
                  <button color="primary" class="btn btn-primary btn-flat" @click="salvarODS"><i class="fa fa-floppy-o" aria-hidden="true"></i>
                  Salvar</button>
                  <button color="primary" class="btn btn-warning btn-flat" @click="editando = false"><i class="fa fa-remove" aria-hidden="true"></i>
                    Cancelar</button>
                </div>
            </div>
        </div>
      <vue-snotify></vue-snotify>
    </div>
  </template>
    
  <script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'odsFundacao',
    data () {
      return {
        loading: {
          show: false
        },
        odsCadastrado: [],
        odsFavoritos: [],
        baseODS: [],
        editando: false,
        termoPesquisa: '',
        table: {
          items: this.odsCadastrado,
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          perPage: 10,
          fields: [
              { key: 'idOds', label: 'ID', sortable: true, thStyle: 'text-align: center; width: 20%', class: 'text-center' },
              { key: 'ODS', label: 'ODS', sortable: true, thStyle: 'text-align: left; width: 50%', class: 'text-center' },
              { key: 'metas', label: 'Metas', sortable: true, thStyle: 'text-align: center', class: 'text-center' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    watch: {
    },
    mounted: function () {
      this.buscarBaseODS()
    },
    methods: {
      async buscarBaseODS () {
        this.loading.show = true
        await axiosLaravel.get('/ods').then((response) => {
          this.baseODS = response.data
          this.baseODS.forEach(item => {
            item.abrirMeta = false
            item.metas.forEach(meta => {
              meta.abrirIndicador = false
              meta.selecionado = false
              // meta.indicadores.forEach(indicador => {
              //   indicador.selecionado = false
              // })
            })
          })
          // this.loading.show = false
          this.buscarFavoritos()
          console.log(this.baseODS)
        })
          .catch((error) => {
            this.loading.show = false
            this.$root.trataErro(error)
          })
      },
      async buscarFavoritos () {
        this.loading.show = true
        await axiosLaravel.get('/ods/getFavoritosFundacao').then((response) => {
          console.log('Favoritos Fundação!', response.data)
          this.odsFavoritos = response.data
          console.log(this.odsFavoritos)
          this.initFavoritos()
        })
          .catch((error) => {
            this.loading.show = false
            this.$root.trataErro(error)
          })
      },
      getImageODS (id) {
        let caminho = `/static/img/ods/${id}.png`
        return caminho
      },
      toggleMeta (id) {
        this.baseODS.forEach(item => {
          if (item.id === id) {
            item.abrirMeta = !item.abrirMeta
          }
        })
        this.$forceUpdate()
      },
      toggleIndicador (idOds, idMeta) {
        this.baseODS.forEach(ods => {
          if (ods.id === idOds) {
            ods.metas.forEach(meta => {
              if (meta.id === idMeta) {
                meta.abrirIndicador = !meta.abrirIndicador
              }
            })
          }
        })
        this.$forceUpdate()
      },
      salvarODS () {
        console.log(this.baseODS)
        // Verifica quais foram os ODS, Metas e Indicadores Selecionados
        let selecionados = []
        this.baseODS.forEach(ods => {
          ods.metas.forEach(meta => {
            if (meta.selecionado) {
              // Nota protótipo
              // Se for selecionar só a meta, gera registro aqui
              let selecao = {
                odsId: ods.id,
                odsDescricao: ods.descricao,

                metaId: meta.id,
                metaDescricao: meta.descricao,
                numero_meta: meta.numero_meta
              }
              selecionados.push(selecao)
            }
          })
        })
        console.log(selecionados)
        // Organiza Seleção
        this.atualizaSelecaoOds(selecionados)
        this.editando = false
        this.loading.show = true
        let selecaoODS = []
        selecionados.forEach((selecao) => {
          selecaoODS.push(selecao.numero_meta)
        })
        // Marca no banco de dados os favoritos
        axiosLaravel.post('/ods/marcarFavoritosFundacao', selecaoODS).then((response) => {
          this.$snotify.success(response.data)
          this.loading.show = false
          this.$forceUpdate()
        })
        .catch((error) => {
          this.$root.trataErro(error)
          this.loading.show = false
          this.$forceUpdate()
        })
      },
      atualizaSelecaoOds (selecao) {
        // Para cada ODS, quais são
        // AS Metas
        let odsItems = []
        let odsDistintos = [...new Set(selecao.map(item => item.odsId))]
        console.log('AGRUPADOS: ', odsDistintos)
        odsDistintos.forEach(idOds => {
          let itemODS = {
            idOds: idOds,
            ODS: '',
            metas: ''
            // indicadores: ''
          }
          selecao.forEach(item => {
            if (item.odsId === idOds) {
              itemODS.ODS = idOds + ' - ' + item.odsDescricao
              itemODS.metas = itemODS.metas + ',' + item.numero_meta
              // itemODS.indicadores = itemODS.indicadores + item.indicadorCodigo + ', '
            }
          })
          itemODS.metas = itemODS.metas.substring(1)
          // let metasSemDuplicidade = [...new Set(itemODS.metas.split(', '))]
          // let metasStrDuplicidade = metasSemDuplicidade.join(', ')
          // itemODS.metas = metasStrDuplicidade
          // itemODS.indicadores = itemODS.indicadores.slice(0, -2)
          odsItems.push(itemODS)
        })
        console.log(odsItems)
        this.odsCadastrado = odsItems
        this.table.items = this.odsCadastrado
        this.$forceUpdate()
      },
      initFavoritos () {
        console.log('init favoritos')
        let metasFavoritas = this.odsFavoritos
        let odsItems = []
        this.baseODS.forEach(ods => {
          let itemODS = {
            idOds: ods.id,
            ODS: ods.id + ' | ' + ods.descricao,
            metas: ''
          }
          let metas = ''
          metasFavoritas.forEach(meta => {
            if (meta.ods_fk === ods.id) {
              metas = metas + ',' + meta.numero_meta
            }
          })
          metas = metas.substring(1)
          itemODS.metas = metas
          if (metas !== '') {
            odsItems.push(itemODS)
          }
        })
        // console.log(odsItems)
        this.odsCadastrado = odsItems
        this.table.items = this.odsCadastrado
        this.initSelecionadosFavoritos()
        this.$forceUpdate()
        this.loading.show = false
      },
      initSelecionadosFavoritos () {
        console.log('init selecionados')
        this.baseODS.forEach(ods => {
          // console.log(ods)
          ods.metas.forEach(meta => {
            // console.log(meta.numero_meta)
            let numeroMeta = meta.numero_meta
            this.odsCadastrado.forEach(odsCadastrado => {
              if (odsCadastrado.idOds === ods.id) {
                // console.log(odsCadastrado)
                let metas = odsCadastrado.metas.split(',')
                // let metaEncontrada = _.find(numeroMeta.toString(), {metas})
                let foundElem = _.findKey(metas, function (meta) { return meta === numeroMeta })
                if (foundElem) {
                  meta.selecionado = true
                }
              }
            })
            // meta.selecionado = true
          })
        })
        this.$forceUpdate()
      }
    }
  }
  </script>
    
<style scoped>

  @keyframes fade {
    0% {
      opacity: 0;
      transform: translateX(-10px);
    }
  
    100% {
      opacity: 1;
      transform: translateX(0px);
    }
  }

  .ods-cadastro-main-container {
    width: 100%;
  }

  .ods-cadastro-content-container {
    width: 100%;
    background-color: #FFFFFF;
    border: 1px solid #DDDDDD;
    /* padding: 20px; */
    min-height: 400px;
  }
  .ods-button-alterar-container {
    width: 100%;
    margin-bottom: 10px;
    padding: 20px;
  }

  .ods-check-main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    width: 100%;
    padding: 10px;
    background-color: #FFFFFF;
    border: 1px solid #DDDDDD;
  }

  .ods-base {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
  }

  .base-ods-row {
    user-select: none;
    cursor: pointer;
    width: 100%;
    border: 1px solid #DDDDDD;
    border-radius: 5px;
    height: 100px;
  }

  .base-indicador-row {
    user-select: none;
    cursor: pointer;
    width: 100%;
    background-color: #F2F2F2;
    border: 1px solid #DDDDDD;
    border-radius: 5px;
    height: 100px;
  }


  .base-ods-content {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-radius: 5px;
  }

  .ods-text-container {
    background-color: #FFFFFF !important;
    border-left: 10px solid;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-left: 15px;
    padding-left: 15px;
    height: 85%;
    gap: 10px;
    width: 900px;
  }
  .ods-meta-text-container {
    background-color: #FFFFFF !important;
    border-left: 10px solid;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-left: 15px;
    padding-left: 15px;
    height: 85%;
    gap: 10px;
    width: 85%;
  }
  .ods-indicador-text-container {
    background-color: #F2F2F2 !important;
    border-left: 10px solid;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-left: 15px;
    padding-left: 15px;
    height: 85%;
    gap: 10px;
    width: 85%;
  }

  .ods-img-container {
    width: 300px;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .ods-img {
    height: 85px;
  }

  .ods-id {
    font-size: 3rem;
    font-weight: 200;
  }

  .ods-descricao {
    font-size: 1.5rem;
  }

  .ods-carret {
    transition: 0.3s ease;
  }
  .ods-indicador {
    transform: rotate(90deg);
    transition: 0.3s ease;
  }

  .ods-metas-indicador {
    width: 97%;
    background-color: #FFFDD8;
    padding: 10px;
    font-weight: 600;
  }

  .ods-meta-base {
    width: 97%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    margin-bottom: 5px;
    animation: fade 0.2s ease;
  }
  .ods-indicador-base {
    width: 97%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 5px;
    animation: fade 0.2s ease;
  }

  .ods-check-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 10%;
    height: 100%;
  }
  .ods-check {
    cursor: pointer;
    width: 20px;
    height: 20px;
  }
  .ods-input-container {
    margin-bottom: 5px;
    width: 100%;
  }
  .ods-button-cadastro-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    width: 100%;
    gap: 5px;
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
</style>