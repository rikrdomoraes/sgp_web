<template>
  <div ng-if="regComProFormCtrl.isAval('COORDINATORPHONE')"
       class="form-group col-md-12 required"
       :class="{ 'has-error' : errors.first(nomeCampo)}">
    <label class="control-label">{{nomeCampo}}</label>
    <div name="proposal.coordinatorPhone" approval="regComProFormCtrl.approval" state="regComProFormCtrl.approvalState" >
      <input v-model="telefone" :name="nomeCampo" class="form-control" type="tel"
             v-validate="'required'" v-mask="['(##) ####-####', '(##) #####-####']">
      <span v-if="errors.first(nomeCampo)" class="label label-danger"> {{ errors.first(nomeCampo) }}</span>
   </div>
  </div>
</template>

<script>
    export default {
      name: 'telefone',
      data () {
        return {
          perfis: {},
          telefone: null
        }
      },
      props: ['nomeCampo'],
      watch: {
        telefone: function () {
          let temp = null
          temp = this.telefone.replace(/[^0-9]+/g, '')
          this.$emit('telefoneChanged', temp)
        },
        propsTelefone: function () {
          this.profile = this.propsProfile
        }
      }
    }
</script>

<style scoped>

</style>
