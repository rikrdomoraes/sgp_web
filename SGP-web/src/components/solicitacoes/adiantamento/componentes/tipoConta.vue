<template>
  <div class="form-group required-field" :class="{'has-error': errors.first('tipo da conta')}">
    <label class="control-label col-md-4">Tipo da Conta:</label>
    <div class="col-md-8">
      <div>
        <multiselect v-model="tipoContaSelecionado"
                     :options="tiposConta"
                     :multiple="false"
                     :close-on-select="true"
                     :preselect-first="true"
                     :allow-empty="false"
                     :custom-label="tipoContaNome"
                     @select="selecionaTipoConta"
                     placeholder="Selecione um tipo de conta"
                     track-by="codigo"
                     selectedLabel="Selecionado"
                     selectLabel=""
                     deselectLabel=""
                     name="tipo da conta"
                     data-vv-as="tipo da conta"
                     :disabled="$attrs.disabled"
                     v-validate="{required: true}">
        </multiselect>
      </div>
      <span v-if="errors.first('tipo da conta')" class="label label-danger">{{ errors.first('tipo da conta') }}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'tipoConta',
    props: {
      propsTipo: null
    },
    data () {
      return {
        tiposConta: [{'codigo': 1, 'tipo': 'Conta Corrente'}, {'codigo': 2, 'tipo': 'Conta Poupança'}],
        tipoContaSelecionado: null
      }
    },
    created: function () {
      this.tipoContaSelecionado = this.tiposConta.find(conta => conta.codigo === this.propsTipo)
    },
    methods: {
      tipoContaNome (option) {
        return `${option.codigo + ' - ' + option.tipo}`
      },
      selecionaTipoConta (tipoSelecionado) {
        this.$emit('update:tipo', tipoSelecionado)
        this.$forceUpdate()
      }
    }
  }
</script>

<style scoped>

</style>
