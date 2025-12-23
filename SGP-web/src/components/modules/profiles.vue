<template>
    <select v-model="profile" name="profiles"  class="form-control ng-pristine ng-untouched ng-valid ng-not-empty">
      <option :value="perfil" v-for="perfil in perfis">{{perfil.name}}</option>
    </select>
</template>

<script>
    export default {
      name: 'profiles',
      data () {
        return {
          perfis: {},
          aux: {},
          profile: this.propsProfile
        }
      },
      props: ['propsProfile'],
      watch: {
        profile: function () {
          this.$emit('profileSelected', this.profile)
        },
        propsProfile: function () {
          this.profile = this.propsProfile
        }
      },
      mounted: function () {
        axios.get('/proxy/account/profiles?tiny').then((response) => {
          this.perfis = response.data.value
          for (let i = 0; i < this.perfis.length; i++) {
            if (this.perfis[i].name !== 'Entidade CNPJ') {
              this.aux[i] = this.perfis[i]
            }
          }
          this.perfis = this.aux
          // console.log('this.perfis >>>', this.perfis)
        })
      }
    }
</script>

<style scoped>

</style>
