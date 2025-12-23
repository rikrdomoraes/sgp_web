<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="'SGP - E-mails Enviados'"/>

    <!-- ngView: --><div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
    <section class="content-header ng-scope">
      <h1>Configurações</h1>
      <b-breadcrumb :items="breadcrumb"/>
    </section>

    <!-- main content -->
    <section class="content ng-scope">

      <div class="row">
        <div class="col-md-12">
          <!-- grid -->
          <!-- ngIf: show.grid --><div ng-if="show.grid" class="ng-scope ng-isolate-scope"><div class="box box-primary">
          <div class="box-header with-border">
            <h3 class="box-title"><i class="fa fa-search" aria-hidden="true"></i> Log's de Email</h3>
          </div>
          <!-- /.box-header -->
          <div class="box-body" >
            <div class="row collapse in"  aria-expanded="true" aria-hidden="false" style="width: inherit; height: auto;">
            </div>
            <br>
            <div class="row">
              <div class="col-sm-12">
              </div>
              <!-- /.col -->
            </div>
            <!-- /.row -->
            <br>
            <div class="row">
              <div class="col-sm-12">
                <b-container fluid>
                  <!-- Main table element -->
                  <b-table show-empty
                           stacked="md"
                           :busy.sync="isBusy"
                           :bordered="bordered"
                           :items="items"
                           :hover="hover"
                           :fields="fields"
                           :current-page="table.currentPage"
                           :per-page="table.perPage"
                           :sort-by.sync="table.sortBy"
                           :sort-desc.sync="table.sortDesc"
                           empty-text="Nenhum registro encontrado"
                           table-layout: fixed
                  >
                    <template slot="ds_desc_erro" scope="row">
                      <div v-if="row.item.DescErro === 'null'">-</div>
                      <div v-else>{{row.value}}</div>
                    </template>
                    <template slot="dt_criado" scope="row">{{row.value | moment("L")}}</template>
                    <template slot="ds_sucesso" scope="row">
                      <i :class="['fa fa-circle ', row.value ? 'text-green' : 'text-red']" aria-hidden="true"></i>
                    </template>
                  </b-table>

                  <b-row>
                    <b-col md="6" class="my-1" right>
                      <b-pagination @change="onSearch" :total-rows="table.totalRows" :per-page="table.perPage"class="my-3" />
                    </b-col>
                  </b-row>


                </b-container>
                <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                  <i class="fa fa-refresh fa-spin"></i>
                </div>
                <!--v-show="loading.show"-->

              </div>
              <!-- /.col -->
            </div>
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
</template>

<script>
    export default {
      name: 'LogEmails',
      data () {
        return {
          data: [],
          items: [],
          loading: {
            show: false
          },
          isBusy: false,
          bordered: true,
          fields: [
            { key: 'ds_assunto', label: 'Assunto', sortable: true, thStyle: 'width: 10%; text-align: center', class: 'word-wrap:break-word text-center' },
            { key: 'ds_destinatario', label: 'Destinatário', sortable: true, thStyle: 'width: 20%; text-align: center', class: 'word-wrap:break-word text-center' },
            { key: 'ds_conteudo', label: 'Conteúdo', sortable: true, thStyle: 'width: 40%; text-align: center', class: 'word-wrap:break-word text-center' },
            { key: 'dt_criado', label: 'Data de Inclusão', sortable: true, thStyle: 'text-align: center', class: 'word-wrap:break-word text-center' },
            { key: 'ds_sucesso', label: 'Sucesso', sortable: true, thStyle: 'width: 4%; text-align: center', class: 'word-wrap:break-word text-center' },
            { key: 'ds_desc_erro', label: 'Descrição do Erro', sortable: true, thStyle: 'width: 20%; text-align: center', class: 'text-center' }
          ],
          table: {
            currentPage: 1,
            perPage: 10,
            totalRows: 0,
            sortBy: 'id',
            sortDesc: true,
            filter: null,
            emptyText: 'Não tem nenhum registro para mostrar'
          },
          store: this.$store,
          breadcrumb: [{
            text: 'Inicial',
            href: '/'
          }, {
            text: 'Configurações',
            active: true
          }]
        }
      },
      computed: {
        sortOptions () {
          // Create an options list from our fields
          return this.fields
            .table.filter(f => f.sortable)
            .map(f => { return {text: f.label, value: f.key} })
        }
      },
      created: function () {
        this.onSearch()
      },
      mounted: function () {
      },
      methods: {
        onSearch (data) {
          this.loading.show = true
          this.isBusy = true
          axiosLaravel.get('emails?page=' + data).then((response) => {
            this.items = response.data.data
            this.table.totalRows = response.data.total
            this.table.perPage = response.data.per_page
            this.loading.show = false
            this.isBusy = false
            this.$forceUpdate()
          })
            .catch((error) => {
              this.isBusy = false
              if (error) {
                this.$root.trataErro(error)
              }
            })
          // axios.post('proxy/utility/search/emails').then((response) => {
          //   this.items = response.data.value
          //   this.table.totalRows = this.items.length
          //   this.loading.show = false
          // })
          //   .catch((error) => {
          //     if (error) {
          //       this.$root.trataErro(error)
          //     }
          //   })
        }
      }
    }
</script>

<style scoped>

</style>
