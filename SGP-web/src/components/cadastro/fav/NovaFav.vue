<template>
  <div>
    <div class="content-wrapper" style="min-height: 870px;">
      <!-- ngView: --><div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
      <section class="content-header ng-scope">
        <h1>FAV</h1>
        <b-breadcrumb :items="breadcrumb"/>
      </section>

      <!-- main content -->
      <section class="content ng-scope">

        <div class="row">
          <div class="col-md-12">
            <!-- grid -->
            <!-- ngIf: show.grid --><div ng-if="show" class="ng-scope ng-isolate-scope"><div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title"><i class="fa fa-caret-right" aria-hidden="true"></i> Cadastro de uma FAV</h3>
            </div>
            <!-- /.box-header -->
            <div class="box-body" ><div class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: none;"><i class="fa fa-refresh fa-spin"></i></div>
              <form name="user" class="form-horizontal ng-pristine ng-valid-maxlength ng-valid-minlength ng-valid-mask ng-valid-parse ng-valid-date ng-valid-max ng-valid ng-valid-required" novalidate="" style="">
                <br>
                <br>
                <div class="form-group required" ng-class="{ 'has-error' : frmRegUserFbb.$submitted &amp;&amp; frmRegUserFbb.userName.$error.required }">
                  <label for="nome" class="control-label col-sm-2">Nome:</label>
                  <div class="col-sm-4">
                    <input v-model="fav.name"
                           name="favName"
                           class="form-control ng-pristine ng-untouched ng-valid-maxlength ng-valid-minlength ng-not-empty ng-valid ng-valid-required"
                           v-validate="{required: true}"
                           type="text">
                  </div>
                </div>

                <div v-if="this.$root.authorize('perfil-novo')" class="ng-scope ng-isolate-scope"><fieldset>
                  <legend>Cadastro de Perguntas</legend>

                  <!-- menu bar -->
                  <div class="form-group">
                    <div class="col-sm-8">
                      <button @click="onAdd" v-show="this.$root.authorize('perfil-novo')" type="button" class="btn btn-primary btn-flat">
                        <i class="fa fa-plus-circle" aria-hidden="true"></i> Atribuir</button>
                    </div>
                  </div>

                  <!-- form -->
                  <div v-if="show" class="well well-sm no-shadow animated fadeInDownOutUp ng-pristine ng-valid-mask ng-invalid ng-invalid-required ng-valid-maxlength ng-valid-max ng-valid-date ng-hide">
                    <!-- profile type -->
                    <div class="form-group">
                      <label for="questionNumber" class="control-label col-sm-2">Número da Pergunta:</label>
                      <div class="col-sm-2">
                        <div class="input-group">
                          <input name="questionNumber" v-model="questao.questionNumber" type="text" class="form-control ng-pristine ng-untouched ng-valid ng-isolate-scope ng-valid-mask ng-empty ng-valid-maxlength">
                        </div>
                        <!--<span ng-show="frmAddProfile.$submitted &amp;&amp; frmAddProfile.inactivateDate.$error.date" class="label label-danger ng-hide">Data inválida</span>-->
                      </div>
                    </div>

                    <!-- local -->
                    <div class="form-group required">
                      <label for="local" class="control-label col-sm-2">Local:</label>
                      <div class="col-sm-2">
                        <div class="input-group">
                          <select v-model="questao.local" name="local"  class="form-control ng-pristine ng-untouched ng-valid ng-not-empty">
                            <option :value="local" v-for="local in listaLocais">{{local}}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <!-- pergunta -->
                    <div class="form-group required" ng-class="{ 'has-error' : frmRegUserFbb.$submitted &amp;&amp; frmRegUserFbb.userName.$error.required }">
                      <label for="pergunta" class="control-label col-sm-2">Pergunta:</label>
                      <div class="col-sm-4">
                        <input v-model="questao.question"
                               name="favQuestion"
                               class="form-control ng-pristine ng-untouched ng-valid-maxlength ng-valid-minlength ng-not-empty ng-valid ng-valid-required"
                               type="text">
                      </div>
                    </div>

                    <!-- conformity -->
                    <div class="form-group required">
                      <label for="bt_conformidade" class="control-label col-sm-2">Respostas:</label>
                      <input type="checkbox" value="Sim" v-model="questao.conformityYes">
                      <label for="conformityYes">Sim</label>
                      <input type="checkbox" value="Não" v-model="questao.conformityNo">
                      <label for="conformityNo">Não</label>
                      <input type="checkbox" value="NA" v-model="questao.conformityNA">
                      <label for="conformityNA">N/A</label>
                      <br>
                    </div>

                    <!-- buttons -->
                    <div class="form-group" style="margin-bottom:0">
                      <div class="col-sm-10 col-sm-offset-2">
                        <button @click="onAdd" type="button" class="btn btn-primary btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Ok</button>
                        <button @click="onCancel" type="button" class="btn btn-default btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
                      </div>
                    </div>

                  </div>

                  <!-- grid -->
                  <div class="row">
                    <div class="col-sm-12">
                      <b-container fluid>
                        <!-- Main table element -->
                        <b-table
                                 :items="table2.items"
                                 :hover="table2.hover"
                                 :fields="table2.fields"
                                 :current-page="table2.currentPage"
                                 :per-page="table2.perPage"
                                 :sort-by.sync="table2.sortBy"
                                 :sort-desc.sync="table2.sortDesc"
                                 empty-text="Nenhum registro encontrado"
                        >
                          <template slot="actions" scope="row">
                            <div>
                              <b-button type="button" @click="onEdit(row)" :disabled="false" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>
                              <b-button type="button" @click="onDelete(row)" :disabled="false" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i>Excluir</b-button>
                            </div>
                          </template>
                          <template slot="conformityYes" scope="row">
                            <input type="checkbox" name="conformityYes" v-model="row.item.conformityYes" :disabled="true"/>
                          </template>
                          <template slot="conformityNo" scope="row">
                            <input type="checkbox" name="conformityNo" v-model="row.item.conformityNo" :disabled="true"/>
                          </template>
                          <template slot="conformityNA" scope="row">
                            <input type="checkbox" name="conformityNA" v-model="row.item.conformityNA" :disabled="true"/>
                          </template>
                        </b-table>
                        <b-row>
                          <b-col md="6" class="my-1" right>
                            <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-3" />
                          </b-col>
                        </b-row>


                      </b-container>
                      <div v-show="loadingShow" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                        <i class="fa fa-refresh fa-spin"></i>
                      </div>
                    </div>
                  </div>

                  <div class="col-sm-12">
                    <button @click.prevent="onSave" type="submit" class="btn btn-success btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Salvar</button>
                    <button @click="onClean" type="button" class="btn btn-default btn-flat"><i class="fa fa-eraser" aria-hidden="true"></i> Limpar</button>
                    <a href="javascript:history.go(-1)"><button type="button" class="btn btn-default btn-flat"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</button></a>
                  </div>
                </fieldset>
                </div>
              </form>

              <!-- /.row -->
            </div>
            <!-- /.box-body -->
          </div>
            <!-- /.box -->
          </div><!-- end ngIf: show.grid -->

          </div>
          <!-- /.col -->
        </div>
        <!-- /.row -->
      </section>
      <!-- /.content -->
    </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NovaFav',
    data () {
      return {
        favs: {},
        salvar: {},
        fav: {
          id: null,
          name: null,
          situation: null,
          favQuestions: []
        },
        editandoIndex: null,
        questao: {},
        listaLocais: [
          'Pré-Análise',
          'Aceite',
          'Análise',
          'Deferimento',
          'Preparação de Documentos',
          'Formalização de Projeto'
        ],
        show: null,
        table2: {
          items: [],
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          perPage: 10,
          fields: [
            { key: 'questionNumber', label: 'Número', sortable: true, thStyle: 'text-align: center; width: 15%', class: 'text-center' },
            { key: 'question', label: 'Pergunta', sortable: true, thStyle: 'text-align: center; width: 15%', class: 'text-center' },
            { key: 'local', label: 'Local', sortable: true, thStyle: 'text-align: center; width: 15%', class: 'text-center' },
            { key: 'conformityYes', label: 'Sim', sortable: true, thStyle: 'text-align: center; width: 5%', class: 'text-center' },
            { key: 'conformityNo', label: 'Não', sortable: true, thStyle: 'text-align: center; width: 5%', class: 'text-center' },
            { key: 'conformityNA', label: 'N/A', sortable: true, thStyle: 'text-align: center; width: 5%', class: 'text-center' },
            { key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 13%', class: 'text-center' }
          ]
        }
      }
    },
    created () {
      this.carregaFav()
    },
    methods: {
      onNew () {
        this.show = true
      },
      carregaFav () {
        axios.get('proxy/project/favs').then((response) => {
          this.favs = response.data.value
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      onFiltered (filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      onAdd () {
        this.show = true

        this.errors.clear()

        if (!this.questao.questionNumber) {
          this.errors.add('questionNumber', 'Campo número da pergunta é obrigatório')
        }
        if (!this.questao.local) {
          this.errors.add('local', 'Campo local é obrigatório')
        }
        if (!this.questao.question) {
          this.errors.add('question', 'Campo pergunta é obrigatório')
        }
        if (this.errors.items.length !== 0) {
          return
        }
        if (this.editandoIndex !== null) {
          for (let i in this.fav.favQuestions) this.questao = this.fav.favQuestions[i]
        } else {
          this.table2.items.push(Object.assign({}, this.questao))
        }
        this.$forceUpdate()
        this.onCancel()
      },
      onCancel () {
        this.show = false
        this.editandoIndex = null
        this.questao = {}
      },
      onClean () {
        this.show = false
        this.editandoIndex = null
        this.fav = {}
      },
      onEdit (row) {
        this.questao = row.item
        this.editandoIndex = row.index
        this.show = true
      },
      onDelete (row) {
        this.editandoIndex = null
        this.table2.items.splice(row.index, 1)
      },
      onSave () {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.fav.favQuestions = this.table2.items
            axios.post('proxy/project/favs', this.fav).then((response) => {
              this.items = response.data.value
              this.show = false
              this.$forceUpdate()
              this.onCancel()
              this.$snotify.success('Fav salva com sucesso!')
              this.$router.go(-1)
            })
              .catch((error) => {
                if (error) {
                  this.$root.trataErro(error)
                }
              })
          } else {
            this.errors.items.forEach((item) => {
              this.$snotify.error(item.msg, '', this.$root._data.error)
            })
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
