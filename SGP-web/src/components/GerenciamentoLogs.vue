<template>
  <div v-if="usuarioLogado.userType === 'FUNDACAO'" class="content-container">
    <div v-show="loading.show" class="overlay" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;display: none; background: rgba(255, 255, 255, 0.7); z-index: 1000">
        <i class="fa fa-refresh fa-spin" style="top: 50%; left: 50%; position: absolute; font-size: 30px"></i>
    </div>
    <div class="main-container-log">
        <h1 class="consulta-logs-title">
            ANALISADOR DE LOGS <i class="fa fa-search"></i>
        </h1>
        <select v-model="logSelected" class="select-log" name="LogNames" @change="consultarArquivoLog">
            <option :value="logName" v-for="logName in logNames"> {{ logName }}</option>
        </select>
        <div class="input-log">
          <input v-model="logSearch" type="text" name="searchBar" class="search-log" placeholder="Pesquisar no Log" @input="debounceLog">
          <button @click="limparLog">
            <i class="fa fa-eraser" aria-hidden="true"></i>
          </button>
        </div>
        <div class="log-container">
            <div v-for="line, index in textLog" class="line-log" id="inputText">
                <span>{{ index }} </span> <div v-html="line"></div>
            </div>
        </div>
    </div>
  </div>
</template>
  
<script>
  import ImportacaoExcel from './cadastro/importacao/ImportacaoExcel'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      ImportacaoExcel
    },
    name: 'auto-credenciamento',
    data () {
      return {
        loading: {
          show: false
        },
        logNames: {},
        logSearch: '',
        logSelected: '',
        textLog: {},
        textBaseLog: {},
        debounceTimer: null
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    watch: {
    },
    created () {
      this.consultaArquivosLog()
    },
    methods: {
      consultaArquivosLog () {
        if (this.usuarioLogado.userType !== 'FUNDACAO') {
          window.location.href = 'https://projetos.fbb.org.br'
        }
        console.log('ConsultaArquivos de Log')
        this.loading.show = true
        this.$snotify.clear()
        this.$snotify.async('Consultando Arquivos de Log...', {timeout: 0})
        axiosLaravel.get('log/files/').then((response) => {
          console.log(response.data)
          this.logNames = response.data.log_files
          this.loading.show = false
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
            this.loading.show = false
          })
      },
      consultarArquivoLog () {
        console.log('ConsultaArquivo')
        console.log(this.logSelected)
        this.loading.show = true
        let obj = {
          file: this.logSelected
        }
        axiosLaravel.post('log/', obj).then((response) => {
          this.textLog = response.data.log
          this.textBaseLog = this.textLog
          console.log(this.textLog)
          this.loading.show = false
        })
      },
      debounceLog () {
        clearTimeout(this.debounceTimer)
        this.debounceTimer = setTimeout(() => {
          this.filtrarLog()
        }, 500)
      },
      filtrarLog () {
        let filter = _.filter(this.textLog, (linha) => {
          return _.includes(linha, this.logSearch)
        })
        if (_.isEmpty(this.logSearch)) {
          filter = this.textBaseLog
          this.textLog = filter
          return
        }
        this.textLog = filter
        this.highlight(this.logSearch)
      },
      limparLog () {
        this.textLog = this.textBaseLog
        this.logSearch = ''
      },
      highlight (text) {
      // Implemente a lógica de destaque de sintaxe aqui
      // Use regex, split, etc., para analisar o código e aplicar estilos CSS
      // Exemplo simples: destacando a string especificada
        console.log('highlighting...')
        for (const prop in this.textLog) {
          if (this.textLog.hasOwnProperty(prop) && typeof this.textLog[prop] === 'string') {
            this.textLog[prop] = this.textLog[prop].replace(new RegExp(`\\b${text}\\b`, 'g'), `<span class="highlight">${text}</span>`)
          }
        }
        // this.textLog = this.textLog.replace(new RegExp(`\\b${text}\\b`, 'g'), `<span class="highlight">${text}</span>`)
      }
    }
  }
</script>
  
<style>
.content-container {
    width: 100%;
    min-height: 100vh;
    padding: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
}
.form-container {
  width: 100%;
}
.main-container-log {
    width: 80%;
    padding: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
    border-radius: 10px;
}

.input-log {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 5px;
}

.consulta-logs-title {
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 3rem;
}

.select-log {
    width: 90%;
}

.search-log {
    width: 88%;
}

.log-container {
    width: 100%;
    padding: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 15px;
}

.line-log {
  display: flex;
  flex-direction: row;
  gap: 10px;
  font-size: 2rem;
}

.line-log span {
  user-select: none;
  font-size: 2.5rem;
  opacity: 0.2;
}

.highlight {
  background-color: yellow;
  opacity: 1 !important;
  font-size: 2.5rem;
  padding: 5px;
}

</style>
  