<template>
  <div class="box-body">
    <!-- grid -->
    <div v-show="showgrid">
      <div class="row">
        <div class="col-md-12" v-if="somenteLeitura !== false">
          <button v-if="formEditavel" @click="showgrid = !showgrid" tooltip="Adiciona um público alvo" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Novo Objetivo Específico</button>
        </div>
      </div>
      <br v-if="formEditavel">
      <!--tabela-->
      <div class="row">
        <div class="">
          <div class="table-responsive">

            <div  class="container-fluid">
              <table role="table" aria-busy="false" aria-colcount="2" aria-rowcount="-1" class="table b-table table-hover table-bordered b-table-stacked-md">
                <thead class="">
                <tr>
                  <th tabindex="0" aria-colindex="1" aria-label="Click to sort Descending" aria-sort="ascending" class="sorting sorting_asc text-center" style="text-align: center;">Objetivo específico</th>
                  <th aria-colindex="2" class="text-center" style="text-align: center; width: 13%;" v-if="formEditavel">Ações</th>
                </tr>
                </thead><!---->
                <tbody role="rowgroup" class="">
                <tr v-for="(item, index) in table.items" aria-rowindex="1" role="row" class="">
                  <td aria-colindex="1" data-label="Objetivo específico" role="cell" class="text-left">
                    <strong>{{item.ds_descricao}}</strong>
                  </td>
                  <td aria-colindex="2" data-label="Ações" role="cell" class="text-center" v-if="formEditavel">
                    <div v-if="somenteLeitura !== false">
                      <button type="button" :disabled="false" @click.stop="edita(item, index )" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</button>
                      <button type="button" :disabled="false" @click.stop="exclui(item, index )" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</button>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--Form-->
    <div v-if="!showgrid" style="padding-left:0" class="row well well-sm no-shadow animated fadeInDownOutUp">
      <div class="col-md-12">

        <!--Descrição-->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('descrição')}">
          <label for="description" class="control-label col-md-2">Descrição:</label>
          <div class="col-md-8">
            <div approval="addSpeObjCtrl.approval" state="addSpeObjCtrl.approvalState">
              <input v-model="objetivos.ds_descricao" name="descrição" class="form-control" type="text" maxlength="255"
                     v-validate="'required'" v-on:keyup.enter="onAdd">
              <input  v-model="objetivos.id" name="id" class="form-control" type="hidden">
            </div>
            <span v-if="errors.first('descrição')" class="label label-danger"> {{ errors.first('descrição') }}</span>
          </div>
        </div>
        <!-- Botões -->
        <div class="form-group">
          <div class="col-md-8 col-md-offset-2">
            <button @click="onAdd" type="button" class="btn btn-confirm btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Ok</button>
            <button @click="onCancel" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
          </div>
        </div>

      </div>
    </div>



  </div>


</template>

<script>
    export default {
      name: 'objetivoEspecifico',
      data () {
        return {
          showgrid: true,
          table: {
            items: this.propsObjetivos
          },
          contador: 0,
          objetivos: {
            id: '',
            ds_descricao: ''
          },
          objetivosTable: [],
          editandoIndex: null,
          formEditavel: false
        }
      },
      props: ['propsObjetivos', 'propsProposta', 'somenteLeitura', 'editavel'],
      watch: {
        propsObjetivos: function () {
          this.table.items = this.propsObjetivos
        },
        'table.items': function () {
          this.$emit('objetivoAdicionado', this.table.items)
        }
      },
      mounted: function () {
        this.formEditavel = !_.has(this.$route.params, 'numero') && this.editavel === true
      },
      methods: {
        onCancel () {
          this.objetivos = {}
          this.showgrid = true
          this.editandoIndex = null
        },
        onAdd () {
          this.$validator.validateAll().then((result) => {
            if (result) {
              if (_.find(this.table.items, ['ds_descricao', this.objetivos.ds_descricao])) {
                this.$dialog.alert('Já existe um objetivo com essa descrição', {html: true, animation: 'fade', customClass: 'avisoInfo'})
              } else {
                // Se estiver em forma de edição então adiciona na tabela
                if (this.editandoIndex !== null) {
                  // this.table.items[this.editandoIndex] = this.objective
                  for (let i in this.objetivos) this.objetivosTable[i] = this.objetivos[i]
                } else {
                  this.contador = this.contador + 1
                  this.objetivos.id = _.cloneDeep(this.contador + this.objetivos.ds_descricao)
                  this.table.items.push(this.objetivos)
                }
                this.onCancel()
              }
            }
          })
        },
        exclui (item, index) {
          let vm = this
          this.$dialog.confirm('Deseja <b>APAGAR</b> o objetivo:<br/>' + item.ds_descricao + '?', {html: true, animation: 'fade', customClass: 'avisoConfirmacao'}).then(function (dialog) {
            let qtdMetas = _.chain(vm.propsProposta.metas).map('objetivos').flatten().filter({ds_descricao: item.ds_descricao}).value().length
            if (qtdMetas > 0) {
              vm.$dialog.alert('Deve apagar <b>' + qtdMetas + ' metas</b> vinculadas a este objetivo primeiro', {html: true, animation: 'fade', customClass: 'avisoInfo'})
            } else {
              vm.table.items.splice(index, 1)
            }
            vm.$forceUpdate()
          }).catch(function () {
            console.log('Aviso de Confirmações fechado SEM confirmar exclusão de objetivo')
          })
        },
        edita (item, index) {
          // if (this.propsProposta.metas) {
          //   let obj = this.propsProposta.metas.find(el => el.objetivos[0].ds_descricao === item.ds_descricao)
          //   if (!_.isNil(obj)) {
          //     this.$snotify.error('O Objetivo "' + item.ds_descricao + '" não pode se editado pois possui meta(s) vinculada(s).')
          //     return
          //   }
          // }
          this.editandoIndex = index
          this.objetivos = Object.assign({}, item)
          this.objetivosTable = item
          this.showgrid = false
        }
      }
    }
</script>

<style scoped>

</style>
