<template>
  <div class="content-wrapper" style="min-height: 870px;">
    <div class="fade-transition ng-scope" style=""><!-- content header (page header) -->
      <section class="content-header ng-scope">
        <h1>Perfis</h1>
        <b-breadcrumb :items="[{
          text: 'Inicial',
          href: '/'
        }, {
          text: 'Cadastro',
          href: '#'
        }, {
          text: 'Perfis',
          active: true
        }]"/>
      </section>

    <!-- main content -->
    <section class="content ng-scope">

      <div class="row">
        <div class="col-md-12">
         <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
          <div class="box-header with-border">
            <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Cadastro de Perfil</h3>
          </div>
          <div class="box-body" >
            <div class="row">
              <div class="col-md-12">
                <form :submit.prevent="onSubmit" name="frmRegProfileEntity" class="form-horizontal ng-pristine ng-valid-maxlength ng-valid-minlength ng-valid-validate-unique ng-valid ng-valid-required" novalidate="" style="">
                  <div class="form-group required" :class="{ 'has-error' : errors.first('nome')}">
                    <label for="nome" class="control-label col-md-2">Nome do perfil:</label>
                    <div class="col-md-4">
                      <input v-validate="{required: true, max: 255}" v-model="profile.name" name="nome" class="form-control ng-pristine ng-untouched ng-isolate-scope ng-valid-maxlength ng-valid-minlength ng-valid-validate-unique ng-not-empty ng-valid ng-valid-required" type="text">
                      <span v-if="errors.first('nome')" class="label label-danger"> {{ errors.first('nome') }}</span>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="nome" class="control-label col-md-2" :class="{ 'has-error' : errors.first('status')}">Ativo:</label>
                    <div class="col-md-4">
                      <label class="radio-inline new-control new-control-radio">
                        <input v-validate="'required'" type="radio" name="status" v-model="profile.active" id="status" :value="true" class="ng-pristine ng-untouched ng-valid ng-not-empty"> Sim
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="radio-inline new-control new-control-radio">
                        <input type="radio" name="status" v-model="profile.active" id="status" :value="false" class="ng-pristine ng-untouched ng-valid ng-not-empty"> Não
                        <div class="new-control-indicator"></div>
                      </label>
                      <span v-if="errors.first('status')" class="label label-danger"> {{ errors.first('status') }}</span>
                    </div>
                  </div>
                  <div class="form-group required" :class="{ 'has-error' : errors.first('descricao')}">
                    <label for="nome" class="control-label col-md-2">Descrição do perfil:</label>
                    <div class="col-md-4">
                      <textarea v-validate="{required: true}" v-model="profile.description" style="height: 150px;" name="descricao" class="form-control ng-pristine ng-untouched ng-not-empty ng-valid ng-valid-required" required=""></textarea>
                      <span v-if="errors.first('descricao')" class="label label-danger"> {{ errors.first('descricao') }}</span>
                    </div>
                  </div>
                  <div v-show="profile.id" class="form-group" style="">
                    <label for="createdAt" class="control-label col-md-2">Data criação:</label>
                    <div class="col-md-2">
                      <input type="text" name="createdAt" :value="profile.createdAt | moment('DD/MM/YYYY HH:mm')" class="form-control" disabled="">
                    </div>
                    <label for="updatedAt" class="control-label col-md-2">Data atualização:</label>
                    <div class="col-md-2">
                      <input type="text" name="updatedAt" :value="profile.updatedAt | moment('DD/MM/YYYY HH:mm')" class="form-control" disabled="">
                    </div>
                  </div>
                  <div v-show="profile.id && profile.inactivateDateTime" class="form-group ng-hide">
                    <label for="nome" class="control-label col-md-2">Data inativação:</label>
                    <div class="col-md-2">
                      <input type="text"  :value="profile.inactivateDateTime | moment('DD/MM/YYYY HH:mm')" class="form-control" disabled="">
                    </div>
                  </div>
                </form>
              </div>
              <!-- /.col -->
            </div>
          </div>
           <div class="box-footer">
             <g-button-moema color="success" size="button--size-ss" @click.native="onSubmit"><i class="fa fa-floppy-o" aria-hidden="true"></i> Concluir</g-button-moema>
             <g-button-moema color="primary" size="button--size-ss" @click.native="onClean"><i class="fa fa-eraser" aria-hidden="true"></i> Limpar</g-button-moema>
             <g-button-moema color="warning" size="button--size-ss" @click.native="$router.go(-1)"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</g-button-moema>
           </div>
        </div>
        </div>
        </div>
      </div>
    </section>
  </div>
  </div>


</template>

<script>
    export default {
      name: 'editar-perfil',
      data: function () {
        return {
          profile: {}
        }
      },
      created: function () {
        if (this.$route.params.id) {
          axios.get('proxy/account/profiles/' + this.$route.params.id).then((response) => {
            this.profile = response.data.value
          })
          .catch((error) => {
            this.$root.trataErro(error)
          })
        }
      },
      methods: {
        onSubmit () {
          if (this.profile.id) {
            axios.put('proxy/account/profiles/' + this.profile.id, this.profile).then((response) => {
              this.$snotify.success('usuário atualizado com sucesso')
              this.$router.push({name: 'cadastro-perfis-lista'})
            })
              .catch((error) => {
                this.$root.trataErro(error)
              })
          } else {
            axios.post('proxy/account/profiles', this.profile).then((response) => {
              this.$snotify.success('usuário criado com sucesso')
              this.$router.push({name: 'cadastro-perfis-lista'})
            })
              .catch((error) => {
                this.$root.trataErro(error)
              })
          }
        },
        onClean () {
          this.profile.name = ''
          this.profile.active = ''
          this.profile.description = ''
        }
      }
    }
</script>

<style scoped>

</style>
