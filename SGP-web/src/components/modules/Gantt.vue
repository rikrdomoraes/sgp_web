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
              <th v-for="mes in periodo" >{{mes}}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="atividade of atividades">
              <td style="width: 30%;">{{atividade.name}}</td>

              <td v-for="mes in periodo"><div id="teste" :style="mes >= atividade.startPeriod && mes <= atividade.finalPeriod ? 'background-color: #0038a8' : ''">&nbsp</div></td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
    </div>
</template>

<script>
    export default {
      name: 'gantt',
      data () {
        return { }
      },
      props: ['periodo', 'propsObjetivos', 'atividades'],
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

</style>
