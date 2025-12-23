<template>
  <!-- 69906 - Definicao de publico alvo -->
  <div class="box-body">
    <div v-show="loading.show" class="overlay" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;display: none; background: rgba(255, 255, 255, 0.7); z-index: 1000">
        <i class="fa fa-refresh fa-spin" style="top: 50%; left: 50%; position: absolute; font-size: 30px"></i>
    </div>
    <div class="publico-alvo-previsto-container">
      <div class="publico-alvo-descritivo">
        Descrição de Público-alvo.
      </div>
      <div class="publico-alvo-content">
        <div class="publico-alvo-definicao-container">
          <div v-for="item, index in definicaoPublicoAlvo" class="publico-alvo-item-container"
            @click.self="toogleItem(index)" :class="{ 'adjust-height': item.aberto }">
            <div class="publico-alvo-titulo" @click.self="toogleItem(index)">
              <i class="fa fa-caret-right" aria-hidden="true"
                :class="{ 'rotate-icon': item.aberto }"></i><strong>{{ item.tipo }}</strong> ({{ totalizadoresPorGrupo(item.tipo) }})
            </div>
            <div class="divider" :class="{ 'show-item': item.aberto }" v-if="item.aberto"></div>
            <div class="publico-alvo-content-container" v-if="item.aberto">
              <div v-for="detalhamento in item.subgrupos" :title="detalhamento.descricao" v-if="item.aberto"
                class="publico-alvo-items" :class="{ 'show-item': item.aberto }">
                <label class="conjunto-item">
                  {{ detalhamento.subgrupo }}<div>{{ detalhamento.totalizador }}</div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="publico-alvo-totalizador-content">
        <div class="publico-alvo-total-container">
          Total Geral de Participantes cadastrados com definições de Público-alvo:
          <div>
            {{ totalizadorGeral }}
          </div>
        </div>
      </div>
    </div>
    <vue-snotify></vue-snotify>
  </div>
</template>
  
<script>
export default {
  name: 'publicoAlvoDescricao',
  data () {
    return {
      loading: {
        show: false
      },
      definicaoPublicoAlvo: {},
      totalizadores: [],
      totalizadorGeral: 0,
      editar: false
    }
  },
  props: ['proposta', 'fixado', 'abrirAbas'],
  computed: {
  },
  watch: {
  },
  mounted: function () {
    this.buscaDefinicaoPublicoAlvo()
    this.totalGeralPorProjeto()
  },
  methods: {
    buscaDefinicaoPublicoAlvo () {
      this.loading.show = true
      axiosLaravel.get('definicaoparticipante').then((response) => {
        this.definicaoPublicoAlvo = response.data
        this.definicaoPublicoAlvo.forEach(item => {
          item.aberto = this.abrirAbas
          item.subgrupos.forEach(item => {
            item.selecionado = false
            item.totalizador = 0
          })
        })
        this.buscaTotalizadores()
        this.loading.show = false
      })
        .catch((error) => {
          this.$root.trataErro(error)
          this.loading.show = false
        })
    },
    buscaTotalizadores () {
      this.loading.show = true
      axiosLaravel.get('definicaoparticipante/getTotaisDefinicaoPorProjeto/' + this.proposta).then((response) => {
        this.totalizadores = response.data.result
        console.log('totalizadores:', this.totalizadores)
        this.initContadores()
        this.loading.show = false
      })
        .catch((error) => {
          this.$root.trataErro(error)
          this.loading.show = false
        })
    },
    initContadores () {
      console.log('INIT CONTADORES')
      this.definicaoPublicoAlvo.forEach(item => {
        item.subgrupos.forEach(subgrupo => {
          let totalExiste = this.totalizadores.find(total => total.id === subgrupo.id)
          if (totalExiste) {
            subgrupo.totalizador = totalExiste.contagem
          } else {
            subgrupo.totalizador = 0
          }
        })
      })
    },
    totalizadoresPorGrupo (grupo) {
      let total = 0
      this.totalizadores.forEach(item => {
        if (item.grupo === grupo) {
          total += item.contagem
        }
      })
      return total
    },
    totalGeral () {
      let total = 0
      console.log('totalGeral', this.totalizadores)
      this.totalizadores.forEach(item => {
        total += item.contagem
      })
      return total
    },
    totalGeralPorProjeto () {
      axiosLaravel.get('definicaoparticipante/getTotalizadorPorProjeto/' + this.proposta).then((response) => {
        console.log('totalgeralprojeto', response.data)
        this.totalizadorGeral = response.data[0].participantes
        this.$forceUpdate()
      })
    },
    toogleItem (index) {
      if (this.fixado) {
        return
      }
      this.definicaoPublicoAlvo[index].aberto = !this.definicaoPublicoAlvo[index].aberto
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

.publico-alvo-previsto-container {
  width: 100%;
  min-height: 500px;
  padding: 10px;
  border: 1px solid #DDDDDD;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}

.publico-alvo-descritivo {
  width: 100%;
  padding: 30px;
  background-color: #FFFDD6;
}

.publico-alvo-definicao-container {
  width: 90%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 10px;
}

.publico-alvo-titulo {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
}

.publico-alvo-item-container {
  user-select: none;
  cursor: pointer;
  width: 30%;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #DDDDDD;
}

.publico-alvo-total-container {
  user-select: none;
  cursor: pointer;
  width: 91%;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #DDDDDD;
  margin-top: -20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.adjust-height {
  min-height: 500px;
}

.show-item {
  animation: fade 0.3s ease;
}

.publico-alvo-items {
  padding: 10px;
  border: 1px solid #DDDDDD;
  border-radius: 2px;
  margin-top: 2px;
  margin-bottom: 2px;
  transition: 0.3s ease;
}

.publico-alvo-items:nth-child(even) {
  background-color: #eaeaea;
}

.divider {
  width: 100%;
  height: 2px;
  border-bottom: 1px solid #DDDDDD;
  margin-bottom: 10px;
  margin-top: 10px;
}

.rotate-icon {
  transform: rotate(90deg);
  transition: 0.2s ease;
}

.publico-alvo-content {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.conjunto-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-weight: 400;
  cursor: pointer;
  padding: 2px;
}

.publico-check {
  cursor: pointer;
  width: 20px;
  height: 20px;
}

.publico-alvo-acoes-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
}

.botao-editar-publico {
  margin-left: 10px;
}

.publico-alvo-totalizador-content {
  width: 100%;
  padding-left: 5%;
  padding-right: 5%;
}

.publico-alvo-content-container {
  max-height: 400px;
  overflow-y: auto;
  padding: 5px;
  box-sizing: border-box;
  scrollbar-width: thin;
}
.publico-alvo-content-container::-webkit-scrollbar {
    width: 6px;
}

</style>