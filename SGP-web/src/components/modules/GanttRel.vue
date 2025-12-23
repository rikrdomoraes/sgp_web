<template>
  <div class="box-body" style="overflow: auto" >
    <div class="row">
      <div class="col-md-12 financial-physical-schedule">
      <div class="modal-body"></div>
      <div class="ng-isolate-scope">
        <div class="gantt unselectable ng-isolate-scope">
          <table class="" style="width:100%">
            <thead>
            <tr>
              <th >Atividades</th>
              <th v-for="mes in periodo" class="gantt_cabecalho_periodo" :class="mesAtual === mes ? 'gantt_mes_atual' : ''">{{mes}}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="atividade of atividades">
              <td style="width: 30%; padding: 2px 0px">{{atividade.ds_nome}}</td>

              <td v-for="mes in periodo" style="width: 20px" :class="mesAtual === mes ? 'gantt_mes_atual' : ''">
                <div id="barra_atividade" :class="mes >= atividade.nr_periodo_inicial && mes <= atividade.nr_periodo_final ? atividade.execucao > 100 || atividade.execucao === '' ? 'gantt_atividade_erro' : (atividade.execucao == 100 ? 'gantt_atividade_completa' : (mes <= ((atividade.nr_periodo_final - atividade.nr_periodo_inicial) * (atividade.execucao / 100)) + atividade.nr_periodo_inicial - (atividade.execucao === 0 ? 1 : 0) ? 'gantt_executado' : 'gantt_pendente')) : ''">
                  <div id="percentual_atividade" v-if="(mes - (atividade.execucao === 0 ? 1 : 0) === Math.trunc(((atividade.nr_periodo_final - atividade.nr_periodo_inicial) * (atividade.execucao / 100)) + atividade.nr_periodo_inicial - (atividade.execucao === 0 ? 1 : 0)))" class="gantt_percentual">
                    {{atividade.execucao}} %
                  </div>
                  <div v-else>&nbsp;</div>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
          <div class="gantt_legenda">
            <span> Legenda: </span>
            <div class="gantt_atividade_completa">&nbsp;</div><span>Atividade completada</span>
            <div class="gantt_executado">&nbsp;</div><span>Meses executados percentualmente</span>
            <div class="gantt_pendente">&nbsp;</div><span>Meses pendentes</span>
            <div class="gantt_atividade_erro">&nbsp;</div><span>Erro de preenchimento do percentual de execução</span>
            <div class="gantt_mes_atual">&nbsp;</div><span>Mês atual de execução do projeto</span>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
</template>

<script>
    export default {
      name: 'ganttRel',
      data () {
        return {
          mesAtual: 0
        }
      },
      props: ['periodo', 'dataInicial', 'propsObjetivos', 'atividades'],
      watch: {
        dataInicial: function () {
          this.dt = this.dataInicial
          let d = new Date(this.dt)
          let d1 = new Date(d.getFullYear(), d.getMonth() + 1, 1, 0, 0, 0, 0)
          let d2 = new Date()
          let diff = (d2.getTime() - d1.getTime()) / 1000
          diff /= (60 * 60 * 24 * 7 * 4)
          this.mesAtual = Math.abs(Math.round(diff)) + 1
        }
      },
      computed: {
        propsObjetivos () {
          if (this.propsObjetivos.length > 0) {
            this.propsObjetivos.forEach((objetivo) => {
              if (objetivo.goals) {
                objetivo.goals.forEach((meta) => {
                  if (meta.activities) {
                    meta.activities.forEach((atividade) => {
                      this.atividades.push(atividade)
                    })
                  }
                })
              }
            })
          }
        }
      },
      mounted () {
      },
      created () {
      }
    }
</script>

<style scoped>
  th {
    border: 1px solid #DFE4EB;
    border-collapse: collapse;
  }
   #teste {
    margin-top: 2px;
    margin-bottom: 2px;
  }
   .gantt_executado {
     background-color: #1565C0DB;
  }
   .gantt_pendente {
     background-color: #808080DB;
  }
  .gantt_percentual {
    font-weight: bold;
    color: white;
    text-align: center;
  }
  .gantt_cabecalho_periodo {
    text-align: center;
  }
  .gantt_atividade_erro {
    background-color: #c62828DB;
  }
  .gantt_atividade_completa {
    background-color: #2E7D32DB;
  }
  .gantt_mes_atual {
    background-color: #ccc;
  }
  .gantt_legenda {
    width: 100%;
    font-style: italic;
    font-size: small;
    margin: 20px 10px;
    color: gray;
  }
  .gantt_legenda * {
    float: left;
  }
  .gantt_legenda div {
    width: 10px;
    margin: 0px 2px;
  }
  .gantt_legenda span {
    margin-right: 20px;
  }
</style>
