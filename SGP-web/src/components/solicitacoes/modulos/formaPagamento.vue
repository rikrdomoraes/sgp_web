<template>
  <div class="box box-widget" >
    <div class="box-header with-border">
      <h3 class="box-title">Forma de pagamento</h3>
    </div>

    <div class="box-body" ng-form="payTypSolicForm" >
      <div class="row" >
        <div class="col-md-6">
          <!-- forma de pagamento -->
          <div class="form-group required-field"
               :class="{ 'has-error' : errors.first('forma de pagamento')}">
            <label for="forma de pagamento" class="control-label col-md-4">Forma de pagamento:</label>
            <div class="col-md-7 ">
              <div>
                <select v-model="nota.forma_pagamento" :disabled="validacao.processo.nome === 'Prestação de Contas' || validacao.processo.nome === 'PRESTACAO_DE_CONTAS'"
                        name="forma de pagamento" class="form-control" v-validate="'required'">
                  <!--<option v-for="opcao in formasPagamento" :value="opcao.code">{{opcao.description}}</option>-->
                  <option  v-if="validacao.processo.nome === 'Prestação de Contas' || validacao.processo.nome === 'PRESTACAO_DE_CONTAS'" value="2">Crédito Conta Beneficiário</option>
                  <option  v-if="validacao.processo.nome !== 'Prestação de Contas' && validacao.processo.nome !== 'PRESTACAO_DE_CONTAS'" value="3">Crédito Conta Fornecedor</option>
                  <option  v-if="validacao.processo.nome !== 'Prestação de Contas' && validacao.processo.nome !== 'PRESTACAO_DE_CONTAS'" value="4">Docum. Código de Barras</option>
                </select>
              </div>
              <span v-if="errors.first('forma de pagamento')" class="label label-danger"> {{ errors.first('forma de pagamento') }}</span>
            </div>
          </div>
        </div>

        <!--pagamento prioritário-->
        <div class="col-md-6" v-show="usuarioLogado.userType === 'FUNDACAO'">
          <!-- paymentPriority -->
          <div class="form-group required-field"
               :class="{ 'has-error' : errors.first('pagamento prioritário')}">
            <label for="pagamento prioritário" class="control-label col-md-4">Pagamento Prioritário:</label>
            <div class="col-md-7">
              <div>
                <select v-model="nota.prioridade"
                        class="form-control" name="pagamento prioritário" v-validate="'required'">
                  <option value="0">Não</option>
                  <option value="1">Sim</option>
                </select>
              </div>
              <span v-if="errors.first('pagamento prioritário')" class="label label-danger"> {{ errors.first('pagamento prioritário') }}</span>
            </div>
          </div>

        </div>
      </div>
    </div> <!-- ./box-body -->
  </div> <!-- ./box -->

</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
      name: 'forma-pagamento',
      data () {
        return {
          nota: this.propsNota,
          validacao: this.propsValidacao || {
            processo: {
              nome: null
            }
          }
        }
      },
      props: ['propsNota', 'propsValidacao'],
      computed: {
        ...mapGetters([
          'usuarioLogado'
        ])
      },
      watch: {
        propsNota () {
          this.nota = this.propsNota
          if (!_.has(this.nota, 'prioridade')) {
            this.nota.prioridade = '0'
          }
        },
        propsValidacao () {
          console.log('entrou propsValidacao', this.propsValidacao)
          this.validacao = this.propsValidacao
          if (this.validacao.processo.nome && (this.validacao.processo.nome === 'Prestação de Contas' || this.validacao.processo.nome === 'PRESTACAO_DE_CONTAS')) {
            this.nota.forma_pagamento = 2
          }
        }
      },
      created () {
      },
      mounted () {
        if (this.validacao.processo.nome && (this.validacao.processo.nome === 'Prestação de Contas' || this.validacao.processo.nome === 'PRESTACAO_DE_CONTAS')) {
          this.nota.forma_pagamento = 2
        }
        this.$forceUpdate()
      },
      methods: {
      }
    }
</script>

<style scoped>

</style>
