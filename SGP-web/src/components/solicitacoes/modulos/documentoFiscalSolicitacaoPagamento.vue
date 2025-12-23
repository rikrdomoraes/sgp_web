<template>
  <div class="box box-widget">
    <div class="box-header with-border">
      <h3 class="box-title">Documento fiscal</h3>
    </div>

    <div class="box-body">
      <div class="row" >



        <!--<div class="col-md-12">-->

            <!--&lt;!&ndash; Chave de acesso a NF-e &ndash;&gt;-->
            <!--<div class="form-group">-->
              <!--<label for="chave de acesso" class="control-label col-md-2">Chave de acesso da NF-e:</label>-->

              <!--<div class="col-md-4">-->
                <!--<input v-model="nfe.chaveAcesso" @keyup="validarChaveNFe" name="chave de acesso" id="chave de acesso" class="form-control text-right" type="text"-->
                       <!--maxlength="80"-->
                <!--/>-->
                       <!--&lt;!&ndash;maxlength="44"&ndash;&gt;-->
              <!--</div>-->

              <!--<div class="col-md-6">-->
                <!--&lt;!&ndash; Retorno da validação da chave de acesso da NF-e &ndash;&gt;-->
                <!--<div v-if="!_.isNull(nfe.resultadoValidacao)" class="text-green"> {{ nfe.resultadoValidacao }} em {{ nfe.dataValidacao | moment("L") }}</div>-->
              <!--</div>-->
            <!--</div>-->


        <!--</div>-->



        <div class="col-md-6">

          <!-- receiptNumber -->
          <div class="form-group required-field"
               :class="{ 'has-error' : errors.first('número da nota')}">
            <label for="número da nota" class="control-label col-md-4">Número nota fiscal:</label>
            <div class="col-md-7 ">
              <div>
                <the-mask v-model="nota.numeroNota" name="número da nota" class="form-control text-right" type="text" :mask="['#########']"
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
                  <datepicker  name="data de emissão" v-model="nota.dataInclusao" input-class="form-control datepicker"
                               :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                               format="dd/MM/yyyy" v-validate="'required|validdate|dateeqpast'">
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
                <select v-model="nota.serieNota" class="form-control" name="série" v-validate="'required'">
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
                  <datepicker  v-model="nota.dataValidade" input-class="form-control datepicker"
                               :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                               format="dd/MM/yyyy">
                  </datepicker>
                </div>
              </div>
            </div>
          </div>

          <!-- valot total pagamento -->
          <!--<div class="form-group required-field"-->
               <!--:class="{ 'has-error' : errors.first('valot total pagamento')}">-->
            <!--<label for="valor total pagamento" class="control-label col-md-4">Valor total do pagamento:</label>-->
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
    name: 'documento-fiscal-solicitacao-pagamento',
    data () {
      return {
        validandoNFe: false,
        nfe: {
          chaveAcesso: null,
          xmlNfe: null,
          dataValidacao: null,
          resultadoValidacao: null,
          retornoValidacao: null,
          usuarioConsulta: null
        },
        nota: {},
        etapa: this.propsEtapa
      }
    },
    props: ['propsNota', 'propsEtapa'],
    watch: {
      propsNota () {
        this.nota = this.propsNota
        // Gera um numero baseado na data e hora para a nota fiscal para que a mesma não se repita
        // if (!this.nota.numeroNota) {
        //   this.nota.numeroNota = moment().format('hhmmss').replace(/\b0+/g, '')
        //   this.$forceUpdate()
        // }
        this.$forceUpdate()
      },
      propsEtapa () {
        this.etapa = this.propsEtapa
      }
    },
    computed: {
      valorTotalSolicitacao () {
        if (this.propsNota.receiptItems) {
          return this.propsNota.receiptItems.reduce((total, item) => total + item.valueRequest, 0)
        }
      }
    },
    created () {
      // console.log('this.nota.numeroNota', this.nota.numeroNota)
      // if (!this.nota.numeroNota) {
      //   console.log('this.nota.numeroNota1', this.nota.numeroNota)
      //   this.nota.numeroNota = moment().format('hhmmss').replace(/\b0+/g, '')
      //   this.$forceUpdate()
      // }
    },
    mounted () {
      // this.nota = this.propsNota
    },
    methods: {
      // Exemplo: 52170522555994000145550010000009651275106690
      validarChaveNFe () {
        if (('' + this.nfe.chaveAcesso).length >= 44) {
          this.nfe.chaveAcesso = this.nfe.chaveAcesso.replace(/\D+/g, '')
        }
        if (('' + this.nfe.chaveAcesso).length === 44) {
          this.$snotify.async('Validando chave de acesso...', {timeout: 0})
          this.validandoNFe = true
        } else if (_.isNull(this.nfe.chaveAcesso) || ('' + this.nfe.chaveAcesso).length !== 0) {
          this.validandoNFe = false
          this.$snotify.clear()
        }
      }
    }
  }
</script>

<style scoped>

</style>
