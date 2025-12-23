<template>
    <!-- 69906 - Novos Municipios -->
    <div class="box-body" v-if="usuarioLogado.userType === 'FUNDACAO' && novosMunicipios.length > 0">
      <div class="municipios-container">
        <div>
          <i class="fa fa-exclamation-circle" aria-hidden="true"></i> Municípios Encontrados em que a Fundação BB ainda não possui projetos aprovados:
        </div>
        <div v-for="municipio in novosMunicipios" class="municipios-novo">
          - <strong> {{ municipio.nome }} </strong>
        </div>
      </div>
      <vue-snotify></vue-snotify>
    </div>
  </template>
    
  <script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'novosMunicipios',
    data () {
      return {
        consultaMunicipios: [],
        novosMunicipios: []
      }
    },
    props: ['municipalizacao'],
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    watch: {
      municipalizacao () {
        this.buscaNovosMunicipios()
      }
    },
    mounted: function () {
      this.buscaNovosMunicipios()
    },
    methods: {
      async buscaNovosMunicipios () {
        // 69906 - Acertos em TS
        if (this.municipalizacao.length <= 0) {
          return
        }
        let obj = {
          municipalizacao: this.municipalizacao
        }
        await axiosLaravel.post('municipalizacao/buscaMunicipiosLista', obj).then((response) => {
          this.consultaMunicipios = response.data
          this.verificaSeExistemNovos()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      verificaSeExistemNovos () {
        if (this.consultaMunicipios.length > 0) {
          this.novosMunicipios = []
          this.consultaMunicipios.forEach(municipio => {
            if (municipio.novo) {
              this.novosMunicipios.push(municipio)
            }
          })
        } else {
          this.novosMunicipios = []
        }
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
  
  .municipios-container {
    width: 100%;
    padding: 30px;
    border-radius: 5px;
    margin-bottom: 10px;
    background-color: #FFFDD6;
    border: 1px solid #DDDDDD;
    animation: fade 0.5s ease;
  }

  .municipios-novo {
    margin-top: 10px;
  }

</style>