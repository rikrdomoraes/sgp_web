<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="'SGP - Entidades Parceiras'"/>

   <div class="fade-transition ng-scope" style="">
    <section class="content-header ng-scope">
      <h1>Entidades</h1>
      <b-breadcrumb :items="breadcrumb"/>
    </section>

      <!-- main content -->
    <section class="content ng-scope">

      <div class="row">
        <div class="col-md-12">
          <!-- grid -->
          <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
          <div class="box-header with-border">
            <h3 class="box-title"><i class="fa fa-search" aria-hidden="true"></i> Consulta de Entidades</h3>
          </div>
          <!-- /.box-header -->
          <div class="box-body" >
            <div class="row collapse in" uib-collapse="isSearchCollapsed" aria-expanded="true" aria-hidden="false" style="width: inherit; height: auto;">
              <div class="col-sm-12">
                <br>
                  <div class="form-group">
                    <!-- entity -->
                    <div class="col-sm-offset-4 col-sm-4">
                      <div class="input-group">
                        <input v-model="filtro" v-on:keyup.enter="busca"  type="text" class="form-control ng-pristine ng-untouched ng-valid ng-empty" placeholder="Pesquisa..." autofocus>
                        <span class="input-group-btn">
                          <button :disabled="!filtro" @click="busca()" type="button" class="btn btn-default btn-flat"><i class="fa fa-search"></i></button>
                        </span>
                      </div>
                    </div>

                  </div>
                <br>
              </div>
            </div>
            <div class="btn-group col-sm-12" uib-dropdown>
              <g-button-ujarak color="dark-primary" :disabled="this.$root.authorize('!entidade-credenciar')" size="button--size-ss"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" @click.native="$router.push({name: 'entidade-credenciamento'})"><i class="fa fa-plus-circle" aria-hidden="true"></i> &nbspNova Entidade </g-button-ujarak>
              <ul class="dropdown-menu">
                <!--<li role="menuitem" :disabled="!this.$root.authorize('entidade-credenciar')"  class="ng-scope"><router-link :to="{name: 'entidade-credenciamento'}" ><i class="fa fa-angle-right"></i> Credenciamento</router-link></li>-->
                <!--<li role="menuitem" href="javascript:void(0)">-->
                  <!--<router-link role="menuitem"  :to="{name: 'entidade-simplificado'}" :disabled="!this.$root.authorize('entidade-cadastro-simplificado')" id="simplificado">-->
                    <!--<i class="fa fa-angle-right" aria-hidden="true"></i> Cadastro Simplificado-->
                  <!--</router-link>-->
                <!--</li>-->
                <!--<li role="menuitem" v-if="this.$root.authorize('entidade-cadastro-entidade-proposta-simplificado')" >-->
                  <!--<router-link role="menuitem"  :to="{name: 'entidade-proposta'}" :disabled="!this.$root.authorize('entidade-cadastro-entidade-proposta-simplificado')" id="entprop">-->
                    <!--<i class="fa fa-angle-right" aria-hidden="true"></i> Entidade/Proposta Simplificado-->
                  <!--</router-link>-->
                <!--</li>-->
              </ul>
            </div>
          </div>
            <div class="row">
              <div class="col-sm-12">
                <b-container fluid>
                  <!-- Main table element -->
                  <b-table show-empty
                           stacked="md"
                           :items="snap"
                           striped hover
                           :bordered="bordered"
                           :fields="fields"
                           :current-page="items.currentPage"
                           :per-page="items.per_page"
                           :filter="filter"
                           :sort-by.sync="table.sortBy"
                           :sort-desc.sync="table.sortDesc"
                           empty-text="Nenhum registro encontrado"
                           table-layout: fixed
                  >
                    <template slot="ds_status" scope="row">
                      <div v-if="row.value === 'COMPLETO'">
                        <div style="color:green; ">Cadastro aprovado</div>
                      </div>
                      <div v-if="row.value === 'EM_REVISAO_PELA_ENTIDADE'">
                        <div style="color:#344cff; ">Em revisão pela entidade</div>
                      </div>
                      <div v-if="row.value === 'PENDENTE_APROVACAO'">
                        <div style="color:red;">Aguardando validação</div>
                      </div>
                      <div v-if="row.value === 'INCOMPLETO'">
                        <div style="color:orange;">Cadastro não enviado</div>
                      </div>
                    </template>
                    <template slot="ds_status_snap" scope="row">
                      <div v-if="row.value === 'COMPLETO'">
                        <div style="color:green; ">Cadastro aprovado</div>
                      </div>
                      <div v-if="row.value === 'EM_REVISAO_PELA_ENTIDADE'">
                        <div style="color:#344cff; ">Em revisão pela entidade</div>
                      </div>
                      <div v-if="row.value === 'PENDENTE_APROVACAO'">
                        <div style="color:red;">Aguardando validação</div>
                      </div>
                      <div v-if="row.value === 'INCOMPLETO'">
                        <div style="color:orange;">Cadastro não enviado</div>
                      </div>
                    </template>
                    <template slot="bt_ativo" scope="row">
                      <i :class="['fa fa-circle ', row.value ? 'text-green' : 'text-red']" aria-hidden="true"></i>
                    </template>
                    <template slot="dt_criado" scope="row">{{row.value | moment("L")}}</template>
                    <template slot="ds_cnpj"  scope="row">{{row.value | cnpj}}</template>
                    <template slot="actions" scope="row">
                      <!--Botão para cadastramento de proposta Liberação ou Simplificada-->
                      <div class="btn-group">
                        <g-button-ujarak color="success" size="button--size-ss"  type="button" @click.native="$router.push({name: 'cadastro-entidade-visualiza', params: {id: row.item.id}})">
                          <i class="fa fa-search" aria-hidden="true"></i>&nbsp&nbsp<font v-html="textoVisualizar"></font></g-button-ujarak>
                      </div>
                      <div class="btn-group">
                        <g-button-ujarak v-if="row.item.ds_status !== 'PENDENTE_APROVACAO'" color="primary" size="button--size-ss"  @click.native="$router.push({name: 'cadastro-entidade-edita', params: {id: row.item.id}})"><i class="fa fa-pencil-square-o" aria-hidden="true" ></i>&nbsp&nbsp<font v-html="textoEditar"></font></g-button-ujarak>
                        <g-button-ujarak v-if="row.item.ds_status === 'PENDENTE_APROVACAO'" color="primary" size="button--size-ss"  @click.native="$router.push({name: 'validacao-entidades', params: {id: row.item.id}})"><i class="fa fa-check" aria-hidden="true" ></i>&nbsp&nbspValidar<br/>Cadastro</g-button-ujarak>
                      </div>
                      <div class="btn-group" v-if="row.item.ds_status === 'COMPLETO'">
                        <g-button-ujarak :id="'entity-new-proposal-' + row.item.id" @click.native="$router.push({name: 'proposta-liberacao', params: {id: row.item.id}})" color="warning" size="button--size-ss"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-book" aria-hidden="true"></i>&nbsp&nbsp<font v-html="textoProposta"></font></g-button-ujarak>
                        <!--<ul class="dropdown-menu dropdown-menu-right btn-flat"  role="menu" aria-labelledby="new-register">-->
                          <!--<li role="menuitem"><router-link v-show="$root.authorize('proposta-liberar')" :to="{name: 'proposta-liberacao', params: { id: row.item.id }}"><i class="fa fa-angle-right"></i> Liberação</router-link></li>-->
                          <!--&lt;!&ndash;<li role="menuitem"><router-link v-show="$root.authorize('proposta-cadastro-simplificado')" :to="{name: 'proposta-simplificada', params: { id: row.item.id }}"><i class="fa fa-angle-right"></i> Simplificada</router-link></li>&ndash;&gt;-->
                        <!--</ul>-->
                      </div>
                     </template>
                   </b-table>

                   <b-row>
                     <b-col md="6" class="my-1" right>
                       <b-pagination @change="recarrega" :total-rows="items.total" :per-page="items.per_page" v-model="items.current_page" class="my-3" />
                     </b-col>
                   </b-row>

                 </b-container>
                 <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                   <i class="fa fa-refresh fa-spin"></i>
                 </div>

              </div>
              <!-- /.col -->
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
      name: 'ListaEntidades',
      data () {
        return {
          data: [],
          loading: {
            show: false
          },
          snap: [],
          // textoEditar: 'Editar',
          // textoVisualizar: 'Visualizar',
          // textoProposta: 'Liberar Proposta',
          textoEditar: 'Editar <br> <div align="right">Cadastro</div>',
          textoVisualizar: 'Visualizar <br> <div align="right">Cadastro</div>',
          textoProposta: 'Liberar <br> <div align="right">Proposta</div>',
          items: [],
          filtro: '',
          perfis: {},
          filtros: {
            active: '',
            cnpj: '',
            situation: '',
            companyName: '',
            id: ''
          },
          bordered: true,
          fields: [
            {key: 'ds_nome', label: 'Razão Social', sortable: true, thStyle: 'width: 25%; text-align: center', class: 'centraliza'},
            {key: 'ds_cnpj', label: 'CNPJ', sortable: true, thStyle: 'width: 10%; text-align: center', class: 'text-center'},
            {key: 'ds_nome_fantasia', label: 'Nome Fantasia', sortable: true, thStyle: 'width: 25%; text-align: center', class: 'centraliza'},
            {key: 'dt_criado', label: 'Inclusão', sortable: true, thStyle: 'width: 6%; text-align: center', class: 'text-center'},
            // {key: 'ds_status', label: 'Situação', thStyle: 'width: 6%; text-align: center', class: 'text-center'},
            {key: 'ds_status_snap', label: 'Situação', thStyle: 'width: 6%; text-align: center', class: 'text-center'},
            {key: 'bt_ativo', label: 'Ativo', sortable: true, thStyle: 'text-align: center; width: 5%', class: 'text-center'},
            {key: 'actions', label: 'Ações', thStyle: 'width: 18%; text-align: center', class: 'text-center'}
          ],
          table: {
            currentPage: 1,
            perPage: 10,
            totalRows: 0,
            sortBy: 'createdAt',
            sortDesc: true,
            filter: null,
            emptyText: 'Não há registros a serem mostrados'
          },
          store: this.$store,
          breadcrumb: [{
            text: 'Inicial',
            href: '/'
          }, {
            text: 'Cadastro',
            href: '#'
          }, {
            text: 'Entidade',
            active: true
          }],
          status_snapshot: []
        }
      },
      created: function () {
        this.getStatusSnap()
        this.busca()
      },
      computed: {
        totalRows: {
          get: function () {
            return this.items.length
          },
          set: function () {
          }
        },
        sortOptions () {
          return this.fields
            .table.filter(f => f.sortable)
            .map(f => {
              return {text: f.label, value: f.key}
            })
        }
      },
      mounted: function () {
      },
      methods: {
        busca () {
          this.snap = []
          // adiciona filtro
          this.loading.show = true
          if (this.filtro.length > 0) {
            axiosLaravel.get('entidades?filtro=' + this.filtro).then((response) => {
              this.items = response.data
              // console.log('this.items', this.items)
              // let sp = _.cloneDeep(this.items.data)
              // for (let i = 0; i < sp.length; i++) {
              this.snap = _.cloneDeep(this.items.data)
              //   if (sp[i].snapshot === null) {
              //     // convert json para array
              //     this.snap.push(Object.assign({}, sp[i]))
              //   } else {
              //     this.snap.push(Object.assign({}, JSON.parse(sp[i].snapshot)))
              //   }
              // }
              this.atualizarStatusSnapshot()
              this.loading.show = false
              this.$forceUpdate()
            })
              .catch((error) => {
                if (error) {
                  this.$root.trataErro(error)
                  this.loading.show = false
                }
              })
          } else {
            // busca inicial
            this.snap = []
            this.loading.show = true
            axiosLaravel.get('entidades/').then((response) => {
              this.items = response.data
              // let sp = _.cloneDeep(this.items.data)
              this.snap = _.cloneDeep(this.items.data)
              // for (let i = 0; i < sp.length; i++) {
              //   if (sp[i].snapshot === null || !_.has(sp[i], 'snapshot')) {
              //     // convert json para array
              //     this.snap.push(Object.assign({}, sp[i]))
              //   } else {
              //     this.snap.push(Object.assign({}, JSON.parse(sp[i].snapshot)))
              //   }
              // }
              this.atualizarStatusSnapshot()
              this.loading.show = false
              this.$forceUpdate()
            })
              .catch((error) => {
                if (error) {
                  this.$root.trataErro(error)
                }
              })
          }
        },
        remove: function (retorno, item) {
          axios.delete('/proxy/account/entities/' + item).then((response) => {
            this.$snotify.clear()
            this.$snotify.success('Entidade Removida com Sucesso.')
            this.busca()
          })
            .catch((error) => {
              if (error) {
                this.$root.trataErro(error)
              }
            })
        },
        onNew () {
          this.$root.$emit('cadastro-entidade-edita')
        },
        recarrega (data) {
          this.snap = []
          // Recebe parâmetro da página que foi clicada na pesquisa e chama backend
          this.loading.show = true
          axiosLaravel.get('entidades?filtro=' + this.filtro + '&page=' + data).then((response) => {
            this.items = response.data
            this.table.totalRows = response.data.total
            this.snap = this.items.data
            this.atualizarStatusSnapshot()
            // let sp = _.cloneDeep(this.items.data)
            // for (let i = 0; i < sp.length; i++) {
            //   if (sp[i].snapshot === null) {
            //     this.snap.push(Object.assign({}, sp[i]))
            //   } else {
            //     this.snap.push(Object.assign({}, JSON.parse(sp[i].snapshot)))
            //   }
            // }
            this.loading.show = false
            this.$forceUpdate()
          })
            .catch((error) => {
              if (error) {
                this.$root.trataErro(error)
              }
            })
        },
        async getStatusSnap () {
          this.loading.show = true
          await axiosLaravel.post('entidades/getSnapShotStatus').then((response) => {
            this.status_snapshot = response.data
            this.$forceUpdate()
          })
            .catch((error) => {
              if (error) {
                this.$root.trataErro(error)
              }
            })
        },
        atualizarStatusSnapshot () {
          console.log('atualizando status snapshot')
          this.snap.forEach(item => {
            let snapshot = this.status_snapshot.find(snapshot => snapshot.id === item.id)
            if (snapshot) {
              if (item.ds_status !== 'COMPLETO') {
                item.ds_status_snap = snapshot.status_snapshot
              } else {
                item.ds_status_snap = 'COMPLETO'
              }
            }
          })
          this.$forceUpdate()
        }
      }
    }
</script>

<style>
  .centraliza {
    text-align: center;
  }

</style>
