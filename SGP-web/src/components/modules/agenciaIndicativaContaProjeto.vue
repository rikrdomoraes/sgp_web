<template>
    <div class="column start-centered indicativo-container">
        <div>Indique a agência de abertura de conta para movimentação dos recursos do Projeto:</div>
        <div v-if="!this.gravando" class="column start-centered indicativo-agencia-container">
          <div class="row-flex centered-start indicativo-form">
              <label for="título do curso" class="control-label indicativo-label f-required">Agência:</label>
              <the-mask :mask="'####'" v-model="consultaAgencia" name="título do curso" class="form-control indicativo-input" @input="digitandoAgencia()" type="text"></the-mask>
          </div>
          <div v-if="this.consultando">
            <i class="fa fa-refresh fa-spin" aria-hidden="true"></i>
          </div>
          <div class="column start-centered indicativo-info-container" v-if="!this.consultando && this.agenciaSelecionada.nomeAgencia !== ''">
             <div class="row start-centered">
                <label>Número: </label> {{ this.agenciaSelecionada.agencia }}
             </div>
             <div class="row start-centered">
                <label>Nome: </label> {{ this.agenciaSelecionada.nomeAgencia }}
             </div>
             <div class="row start-centered">
                <label>E-mail: </label> {{ this.agenciaSelecionada.emailAgencia }}
             </div>
             <!-- TODO - Retirar quando for pra prod -->
             <div class="row start-centered">
                <label>Gerente Geral: </label> {{ this.agenciaSelecionada.informacoesGerenteGeral.nome }}
             </div>
          </div>
        </div>
    </div>
</template>
<script>
    export default {
      name: 'agenciaIndicativo',
      data () {
        return {
          editando: false,
          gravando: false,
          consultando: false,
          consultaAgencia: '',
          agenciaSelecionada: {
            agencia: '',
            nomeAgencia: '',
            emailAgencia: '',
            informacoesGerenteGeral: {
              nome: '[NOME DO GERENTE]',
              cpf: '[000.000.000-00]',
              estadoCivil: '[ESTADO CIVIL GERENTE]',
              municipioResidencia: '[MUNICIPIO RESIDENCIA GERENTE]',
              email: '[EMAIL GERENTE]'
            }
          }
        }
      },
      props: ['proposta', 'agenciaSelecionadaProp'],
      watch: {
        agenciaSelecionadaProp (newVal) {
          if (newVal !== null) {
            this.agenciaSelecionada = newVal
          }
          console.log('Alterou agenciaSelecionada', newVal)
        }
      },
      computed: {
      },
      created () {
        this.debouncedConsultaDetalhesAgencia = _.debounce(this.consultaDetalhesAgencia, 500)
        if (this.agenciaSelecionadaProp !== null) {
          this.agenciaSelecionada = this.agenciaSelecionadaProp
        }
      },
      methods: {
        digitandoAgencia () {
          if (this.consultaAgencia === '') {
            this.agenciaSelecionada = {
              agencia: '',
              nomeAgencia: '',
              emailAgencia: '',
              informacoesGerenteGeral: {
                nome: '[NOME DO GERENTE]',
                cpf: '[000.000.000-00]',
                estadoCivil: '[ESTADO CIVIL GERENTE]',
                municipioResidencia: '[MUNICIPIO RESIDENCIA GERENTE]',
                email: '[EMAIL GERENTE]'
              }
            }
          }
          if (this.consultaAgencia.length < 4) {
            return
          }
          this.consultando = true
          this.debouncedConsultaDetalhesAgencia()
        },
        verificaSelecaoAgencia () {
          if (this.agenciaSelecionada.agencia === '') {
            this.$snotify.error('Indique a agência pretendida para abertura de conta do projeto. Favor Verificar.')
            return false
          }
          return true
        },
        consultaDetalhesAgencia () {
          console.log('Consultando agencia')
          axiosLaravel.get('testemunha/getAgenciaGerente/' + this.consultaAgencia).then((response) => {
            let agenciaInfo = response.data
            console.log(response.data)
            this.agenciaSelecionada.agencia = agenciaInfo.ds_codigo_agencia
            this.agenciaSelecionada.nomeAgencia = agenciaInfo.ds_nome
            this.agenciaSelecionada.emailAgencia = agenciaInfo.ds_email
            console.log('AGENCIA SELECIONADA', this.agenciaSelecionada)
            this.proposta.agenciaSelecionada = this.agenciaSelecionada
            this.consultando = false
          })
          .catch((error) => {
            this.consultando = false
            console.error(error)
          })
        }
      }
    }
  </script>
  
  <style scoped>
      .indicativo-container {
        width: 100%;
        gap: 10px;
    }
    .indicativo-agencia-container {
        width: 100%;
        gap: 10px;
        padding: 30px;
        background-color: #F5F5F5;
    }
    .indicativo-form {
        width: 100%;
        gap: 10px;
    }
    .indicativo-label {
        width: 60px;
        text-align: left !important;
    }
    .indicativo-input {
        width: 10% !important; 
    }
    .indicativo-info-container {
        width: 100%;
        padding: 20px 50px;
        border-radius: 10px;
        background-color: antiquewhite;
    }
  </style>