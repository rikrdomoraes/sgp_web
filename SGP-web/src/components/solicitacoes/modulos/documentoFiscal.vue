<template>
  <div class="box box-widget">
    <div class="box-header with-border">
      <h3 class="box-title">Documento fiscal</h3>
    </div>

    <div class="box-body">
      <div class="row" >
        <div class="col-md-6">

          <!-- receiptNumber -->
          <div class="form-group required-field"
               :class="{ 'has-error' : errors.first('número da nota')}">
            <label for="número da nota" class="control-label col-md-4">Número nota fiscal:</label>
            <div class="col-md-7 ">
              <div>
                <the-mask v-model="nota.numero" name="número da nota" class="form-control text-right" type="text" :mask="['#########']"
                       min="1" v-validate="'required'">
                </the-mask>
                <!--<span v-if="etapa === 'Solicitação'" style="font-size: 12px;font-weight: bold;color: #858585;">Número gerado automaticamente pelo sistema. Pode ser alterado, se necessário.</span>-->
              </div>
              <span v-if="errors.first('número da nota')" class="label label-danger"> {{ errors.first('número da nota') }}</span>
            </div>
          </div>

          <!-- Data de emissão -->
          <div class="form-group required-field"
               :class="{ 'has-error' : errors.first('data de emissão')}">
            <label for="data de emissão" class="control-label col-md-4">Data de emissão do documento:</label>
            <div class="col-md-7">

              <div>
                <div class="input-group">
                  <datepicker  name="data de emissao" v-model="nota.emissao" input-class="form-control datepicker"
                               :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                               format="dd/MM/yyyy" v-validate="'required'">
                  </datepicker>
                </div>
              </div>
              <span v-if="errors.first('data de emissão')" class="label label-danger"> {{ errors.first('data de emissão') }}</span>
            </div>
          </div>

        </div>
        <div class="col-md-6">

          <!-- Série -->
          <div class="form-group required-field"
               :class="{ 'has-error' : errors.first('série')}">

            <label for="série" class="control-label col-md-4">Série:</label>
            <div class="col-md-7">
              <div>
                <select v-model="nota.serie" class="form-control" name="série" v-validate="'required'">
                  <option value="NOTA_FISCAL">1 - Nota fiscal</option>
                  <option value="RECIBO_PAGAMENTO_AUTONOMO">10 - Recibo de pagamento a autônomo</option>
                  <option value="DOCUMENTO_NAO_FISCAL">DNF - Documento não fiscal</option>
                </select>
              </div>
              <span v-if="errors.first('série')" class="label label-danger"> {{ errors.first('série') }}</span>
            </div>
          </div>

          <!-- data de validade -->
          <div class="form-group">
            <label for="data de validade" class="control-label col-md-4">Data de validade do documento: (Somente informe se possuir a data)</label>
            <div class="col-md-7">
              <div>
                <div class="input-group">
                  <datepicker  name="data de validade" v-model="nota.validade" input-class="form-control datepicker"
                               :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____" :clear-button="true" clear-button-icon="fa fa-times-circle-o"
                               format="dd/MM/yyyy">
                  </datepicker>
                </div>
              </div>
            </div>
          </div>

          <!-- valot total pagamento -->
          <!--<div class="form-group required-field"-->
               <!--:class="{ 'has-error' : errors.first('valot total pagamento')}">-->
            <!--<label for="valot total pagamento" class="control-label col-md-4">Valor total do pagamento:</label>-->
            <!--<div class="col-md-7">-->
              <!--<div class="input-group" style="text-align: right">-->
                <!--{{valorTotalSolicitacao | real}}-->
              <!--</div>-->
              <!--<span v-if="errors.first('valot total pagamento')" class="label label-danger"> {{ errors.first('valot total pagamento') }}</span>-->
            <!--</div>-->
          <!--</div>-->

        </div>
      </div>
    </div> <!-- ./box-body -->
  </div> <!-- ./box -->
</template>

<script>
    // import moment from 'moment'
    export default {
      name: 'documento-fiscal',
      data () {
        return {
          nota: {},
          total: 0,
          etapa: this.propsEtapa
        }
      },
      props: ['propsNota', 'propsEtapa'],
      watch: {
        propsNota () {
          this.nota = this.propsNota
          // Gera um numero baseado na data e hora para a nota fiscal para que a mesma não se repita
          // if (!this.nota.numero) {
          //   this.nota.numero = moment().format('hhmmss').replace(/\b0+/g, '')
          //   this.$forceUpdate()
          // }
          this.$forceUpdate()
          this.valorTotalSolicitacao
          this.$forceUpdate()
        },
        propsEtapa () {
          this.etapa = this.propsEtapa
        }
      },
      computed: {
        valorTotalSolicitacao () { // Calcula o total dos itens solicitados
          let total = 0
          let i
          if (this.itensProjeto) {
            for (i = 0; i < this.itensProjeto.length; i++) {
              if (this.itensProjeto[i] !== null) {
                if (this.itensProjeto[i].valorSolicitado) {
                  total = total + this.itensProjeto[i].valorSolicitado
                }
              }
            }
          }
          if (this.propsNota.receiptItems) {
            this.total = 0
            for (let j = 0; j < this.propsNota.receiptItems.length; j++) {
              if (this.propsNota.receiptItems[j].valorSolicitado > 0) {
                total = total + this.propsNota.receiptItems[j].valorSolicitado
              }
            }
          }
          return total
        }
      },
      created () {
      },
      mounted () {
        // this.nota = this.propsNota
        // this.$forceUpdate()
      },
      methods: {
      }
    }
</script>

<style scoped>

</style>
