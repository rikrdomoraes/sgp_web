<template>
  <div>
    <!--FAV Seleção-->
    <div v-if="favs.length > 1" class="row">
      <div class="col-md-12">
        <div class="box box-widget">
          <div class="box-header with-border">
            <h3 class="box-title">Fichas de Auto Verificação - Seleção</h3>
          </div>
          <div class="box-body" style="padding-top: 0px;">
            <div class="col-md-3">
              <dl>
                <dd>
                  <div class="form-group"
                       :class="{ 'has-error' : errors.first('favs')}">
                    <select name="favs"
                            v-model="preAnalise.proposal.fav"
                            class="form-control"
                            aria-hidden="true"
                            @change="montaQuestoes" v-validate="'required'">
                      <option v-for="fav in favs" :value="fav">{{fav.name}}</option>
                    </select>
                    <span v-if="errors.first('favs')"
                          class="label label-danger"> {{ errors.first('favs') }}</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--FAV Respostas-->
    <div class="row">
      <div class="col-md-12">
        <div class="box box-widget">
          <div class="box-header with-border">
            <h3 class="box-title">Ficha de Auto Verificação</h3>
          </div>
          <div class="box-body" style="padding-top: 0px;">
            <div class="col-md-12"
                 :class="{ 'has-error-div' : errors.first('respostaFAV')}">
              <table role="table" class="table b-table table-hover table-bordered b-table-stacked-md">
                <thead class="">
                <tr>
                  <th tabindex="0" aria-colindex="1" aria-label="Click to sort Descending" class="sorting text-center" style="text-align: center; width: 15%;">Número</th>
                  <th tabindex="0" aria-colindex="2" aria-label="Click to sort Descending" class="sorting text-center" style="text-align: center; width: 50%;">Pergunta</th>
                  <th aria-colindex="3" class="text-center" style="text-align: center; width: 6%;">Sim</th>
                  <th aria-colindex="4" class="text-center" style="text-align: center; width: 5%;">Não</th>
                  <th aria-colindex="5" class="text-center" style="text-align: center; width: 5%;">N/A</th>
                </tr>
              </thead>
              <tbody role="rowgroup" class="">
                <tr aria-rowindex="1" role="row" v-for="(questao, index) in this.preAnalise.favAnswers">
                  <td aria-colindex="1" data-label="Número" role="cell" class="text-center">
                    <div>{{questao.favQuestion.questionNumber}}</div>
                  </td>
                  <td aria-colindex="2" data-label="Pergunta" role="cell" class="text-center">
                    <div>{{questao.favQuestion.question}}</div>
                  </td>
                  <td aria-colindex="3" data-label="Sim" role="cell" class="text-center">
                    <div>
                      <label class="new-control new-control-radio" style="padding-top: 25px;">
                        <input type="radio" name="respostaFAV" value="YES" v-model="questao.conformity"
                               v-validate="'required'">
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                  </td>
                  <td aria-colindex="4" data-label="Não" role="cell" class="text-center">
                    <div>
                      <label class="new-control new-control-radio" style="padding-top: 25px;">
                        <input type="radio" name="respostaFAV" value="NO" v-model="questao.conformity"
                               v-validate="'required'">
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                  </td>
                  <td aria-colindex="5" data-label="N/A" role="cell" class="text-center">
                    <div>
                      <label class="new-control new-control-radio" style="padding-top: 25px;">
                        <input type="radio" name="respostaFAV" value="NA" v-model="questao.conformity"
                               v-validate="'required'">
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                  </td>
                </tr>
              <tr v-if="this.preAnalise.favAnswers.length === 0">
                <td colspan="5" style="text-align: center;"> Nenhuma pergunta atribuída!</td>
              </tr>
              </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
    export default {
      name: 'fav',
      data () {
        return {
          favs: [],
          questoes: [],
          preAnalise: {
            proposal: {}
          }
        }
      },
      props: ['propsPreAnalise', 'fase'],
      watch: {
        // Se tiver alguma alteração no objeto 'fav' da proposta atualiza as questoes
        // isso serve tanto para o carregamento com as favs já respondidas como para as respostas em branco
        'preAnalise.proposal.fav' () {
          if (this.preAnalise.proposal.fav) {
            this.montaQuestoes()
          }
        },
        propsPreAnalise () {
          this.preAnalise = this.propsPreAnalise
        }
      },
      created () {
        // Busca todas as FAVs ativas
        axios.get('proxy/project/favs/situation/true').then((response) => {
          this.favs = response.data.value
          // Se tiver somente uma FAV cadastrada para o aceite mostra na tela a tabela carregada
          if (this.favs.length === 1) {
            this.montaQuestoes()
          }
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      mounted () {
      },
      methods: {
        montaQuestoes () {
          // Pega todas as questões da fase atual e monta as questoes
          let questoes = []
          this.preAnalise.favAnswers = []
          this.favs.forEach((fav) => {
            if (fav.id) {
              fav.favQuestions.forEach((questao) => {
                if (questao.local === this.fase) {
                  let item = {}
                  item.conformityYes = questao.conformityYes
                  item.conformityNo = questao.conformityNo
                  item.conformityNA = questao.conformityNA
                  item.favQuestion = questao
                  item.createdAt = null
                  item.id = 0
                  item.local = this.fase
                  item.question = questao.question
                  item.question = questao.questionNumber
                  item.updatedAt = null
                  questoes.push(item)
                }
              })
            }
          })
          this.preAnalise.favAnswers = questoes
        }
      }
    }
</script>

<style scoped>
.has-error-div {
  border: solid 1px red;
}
</style>
