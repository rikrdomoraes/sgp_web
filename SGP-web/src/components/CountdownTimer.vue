<template>
    <div>
      <!-- Exibe o tempo restante -->
      <p>{{ tempoRestante }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      // Propriedade que recebe a data final do countdown
      endDate: {
        type: Date,
        required: true
      }
    },
    data () {
      return {
        tempoRestante: ''
      }
    },
    mounted () {
      this.startCountdown()
    },
    methods: {
      startCountdown () {
        // Função que atualiza o countdown
        const updateCountdown = () => {
          const now = new Date()
          const distance = this.endDate - now
          console.log('startCountdown this.endDate', this.endDate)
  
           // Verifica se o tempo acabou
          if (distance < 0) {
            this.tempoRestante = 'Tempo esgotado'
            clearInterval(this.interval)
            return
          }
  
          // Calcula dias, horas, minutos e segundos restantes
          const days = Math.floor(distance / (1000 * 60 * 60 * 24))
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((distance % (1000 * 60)) / 1000)
  
          // Atualiza a variável tempoRestante com o tempo formatado
          this.tempoRestante = `${days}dias ${hours}horas ${minutes}minutos ${seconds}s`
        }
  
        updateCountdown()
        this.interval = setInterval(updateCountdown, 1000)
      }
    },
    beforeDestroy () {
      // Limpa o intervalo quando o componente é destruído
      clearInterval(this.interval)
    }
  }
  </script>