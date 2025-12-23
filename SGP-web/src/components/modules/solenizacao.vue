<template>

  <div class="box-body">
    <div>
      <p>
      <ol>
        <li>A Convenente informará à FBB pelo e-mail fbb.imprensa@fbb.org.br, 30 dias antes da data de assinatura do convênio:
          <ul>
            <li>Entidade convenente, responsável legal e contatos</li>
            <li>Objeto do convênio</li>
            <li>Data, local e horário provável do evento</li>
            <li>Autoridades precistas no cerimonial e nº de participantes</li>
            <li>Programação prévia e contatos da imprensa local</li>
          </ul>
        <li>Informar no Assunto do e-mail: Nº e nome do Projeto - Assinatura de convênio</li>
        <li>A Convenente fará, obrigatoriamente, a cobertura fotográfica do evento, com uso de, no mínimo, um banner indicativo do investimento social da FBB<br>
          e enviará as fotos com resolução mínima 320 x 233 pixels ou o equivalente a 150 DPI, formato 12 x 10 cm, similar ou proporcional.
        </li>
        <li>No evento deverá participar funcionário do BB.</li>
        <li>Se possível, a Convenente fará a filmagem e/ou cobertura fotográfica de outras fases do convênio e divulgará em sua página na Internet.</li>
        <li>Após o evento, enviar foto para o e-mail descrito no item 1.</li>
      </ol>
      </p>
      <p style="margin: 30px;">Valor Padrão (Após Criação):<br>
        Cifrato: Não
      </p>
    </div>
    <div v-if="eventosDisponiveis.length > 0">
      <label>Eventos</label>
      <select v-model="solenizacao" name="profiles"  class="form-control ng-pristine ng-untouched ng-valid ng-not-empty">
        <option :value="evento" v-for="evento in eventosDisponiveis">{{evento.event}}</option>
      </select>

      <button @click="addEvent(solenizacao)" v-if=""
              uib-tooltip="Inclui um evento na tabela abaixo"
              type="button"
              class="btn btn-primary btn-flat"
              style="margin-top:10px">
        <i class="fa fa-plus-circle" aria-hidden="true"></i> Incluir Evento</button>
    </div>

    <div v-if="eventosTabela.length > 0" style="margin-top:10px">
      <table ng-table="tableEvents" class="table">
        <thead>
        <tr>
          <td><strong>Tabela de Eventos Adicionados</strong></td>
          <td><strong>Ações</strong></td>
        </tr>
        </thead>
        <tbody v-for="(evento, eventoIndex) in eventosTabela">
        <tr class="ng-table-group" ng-hide="eventos.event === ''">
          <td>
            <strong>{{ evento.event }}</strong>
          </td>
          <td>
            <button type="button" @click="onDelete(evento, eventoIndex)" ng-disabled="!solemnizationCtrl.isNewAvaiable()"
                    ng-class="{'btn-danger':solemnizationCtrl.approvalState!='VIEW_TYPE', 'btn-default':solemnizationCtrl.approvalState=='VIEW_TYPE'}"
                    class="btn btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <vue-snotify></vue-snotify>
  </div>
</template>

<script>
    export default {
      name: 'solenizacao',
      data () {
        return {
          solenizacao: {},
          eventosTabela: this.propsSolenizacao,
          eventosDisponiveis: []
        }
      },
      props: ['propsSolenizacao'],
      watch: {
        eventosTabela: function () {
          this.$emit('solenizacaoAdicionada', this.eventosTabela)
        },
        propsSolenizacao: function () {
          this.eventosTabela = this.propsSolenizacao
        }
      },
      mounted () {
        axios.get('proxy/project/solemnization').then((response) => {
          this.eventosDisponiveis = response.data.value
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      methods: {
        addEvent (evento) {
          if (Object.keys(evento).length > 0) {
            this.eventosTabela.push(evento)
            this.eventosDisponiveis = this.eventosDisponiveis.filter((item) => {
              return item.id !== this.solenizacao.id
            })
            this.solenizacao = {}
          } else {
            this.$snotify.error('escolha um evento')
          }
        },
        onDelete (evento, eventoIndex) {
          this.eventosDisponiveis.push(evento)
          this.eventosTabela.splice(eventoIndex, 1)
        }
      }
    }
</script>

<style scoped>

</style>
