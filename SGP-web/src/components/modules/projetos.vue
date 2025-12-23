<template>
  <!-- states -->
  <div>

    <!-- grid -->
    <div class="box-body">
      <div class="row">
        <div class="col-md-12">
          <button @click="onNew()" uib-tooltip="Adiciona seu respectivo projeto" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Novo Projeto</button>
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->
      <br>
      <div class="row">
        <div class="table-responsive">
          <b-container fluid>
            <!-- Main table element -->
            <b-table how-empty
                     stacked="md"
                     :bordered="table.bordered"
                     :items="table.items"
                     :hover="table.hover"
                     :fields="table.fields"
                     :filter="table.filter"
                     :current-page="table.currentPage"
                     :per-page="table.perPage"
                     :sort-by.sync="table.sortBy"
                     :sort-desc.sync="table.sortDesc"
                     empty-text="Nenhum registro encontrado"
            >
              <template slot="actions" scope="row">
                <div>
                  <!--<b-button type="button" :disabled="false" @click.stop="edita(row)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>-->
                  <b-button type="button" :disabled="false" @click.stop="exclui(row)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</b-button>
                </div>
              </template>
              <template slot="proposal.entity.cnpj"  scope="row">{{row.value | cnpj}}</template>
            </b-table>
          </b-container>
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->
    </div>

    <!-- form -->
    <div v-if="state === 'FORM'" style="padding-left:0" class="row well well-sm no-shadow animated fadeInDownOutUp" name="frmAddPrj">

      <div class="form-group required-field">
        <label for="Projeto" class="control-label col-md-2">Projeto:</label>
        <div class="col-md-4">
          <select name="projetoNome"
                  v-model="projetoNome"
                  class="form-control"
                  aria-hidden="true"
                  @change="escolhido(projetoNome)"
          >
            <option v-for="i in projetoNome" :label="i.proposal.idProjectErp + ' - ' + i.proposal.name" :value="i.id"></option>
          </select>
        </div>
      </div>

      <div class="form-group required-field">
        <label for="nome" class="control-label col-md-2">Entidade:</label>
        <div class="col-md-4">
          <input :disabled="true" v-model="tabela.entity" id="nome" type="text" class="form-control ng-pristine ng-untouched ng-valid ng-empty">
        </div>
      </div>

      <div class="form-group required-field">
        <label for="cnpj" class="control-label col-md-2">CNPJ:</label>
        <div class="col-md-4">
          <the-mask :disabled="true" v-model="tabela.cnpj" name="cnpj" id="cnpj" class="form-control" type="text" :mask="['##.###.###/####-##']">
          </the-mask>
        </div>
      </div>

      <!-- buttons -->
      <div class="form-group">
        <div class="col-md-offset-2 col-md-4">
          <button @click="onAdd(frmAddPrj)"  uib-tooltip="Salva o cadastro" type="button" class="btn btn-primary btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Ok</button>
          <button @click="onCancel(frmAddPrj)" type="button" class="btn btn-default" uib-tooltip="Cancela a edição"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'projetos',
      data () {
        return {
          selected: null,
          showgrid: true,
          state: 'GRID',
          users: [],
          curIndex: 0,
          projeto: [],
          entidade: [],
          projetoNome: {},
          proposta: [],
          projetos: {},
          filtro: {
            createdBy: null
          },
          tabela: {
            name: null,
            proposal: {
              entity: {
                businessName: null,
                cnpj: null
              }
            }
          },
          editandoIndex: null,
          table: {
            items: {
              name: null,
              proposal: {
                entity: {
                  businessName: null,
                  cnpj: null
                }
              }
            },
            filter: null,
            hover: true,
            bordered: true,
            currentPage: 1,
            perPage: 10,
            fields: [
              {key: 'proposal.idProjectErp', label: 'Nº do Projeto', sortable: true, thStyle: 'text-align: center; width: 9%', class: 'text-center'},
              {key: 'proposal.name', label: 'Nome do Projeto', sortable: true, thStyle: 'text-align: center; width: 50%', class: 'text-center'},
              {key: 'proposal.entity.businessName', label: 'Entidade', sortable: true, thStyle: 'text-align: center; width: 12%', class: 'text-center'},
              {key: 'proposal.entity.cnpj', label: 'CNPJ', sortable: true, thStyle: 'text-align: center; width: 10%', class: 'text-center'},
              { key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 8%', class: 'text-center' }
            ]
          }
        }
      },
      props: ['ParcProjetos'],
      watch: {
        ParcProjetos: function () {
          this.ParcProjetos.forEach((proposal) => {
            this.table.items = proposal
          })
          this.table.items = this.ParcProjetos
        },
        'table.items': function () {
          this.$emit('projetoAdicionado', this.table.items)
        }
      },
      created () {
        if (this.ParcProjetos) {
          this.table.items = this.ParcProjetos
        }
        this.onSearch()
      },
      methods: {
        onNew () {
          this.projetos = []
          this.state = 'FORM'
          this.curIndex = -1
        },
        escolhido (id) {
          axios.get('proxy/project/project-management/' + id).then((response) => {
            this.proposta = response.data.value
            this.entidade = this.proposta.proposal.entity
            $('#cnpj').val(this.entidade.cnpj)
            $('#nome').val(this.entidade.businessName)
            this.$forceUpdate()
          })
        },
        onSearch () {
          axios.post('proxy/project/project-management/search/sql', this.filtro).then((response) => {
            this.projetos = response.data.value
            this.projetoNome = Object.assign([], this.projetos)
          })
        },
        onCancel () {
          this.projetoNome = {}
          this.state = 'GRID'
          this.curIndex = -1
          this.onSearch()
        },
        onAdd () {
          // this.tabela = {}
          this.tabela.proposal.entity.businessName = this.entidade.businessName
          this.tabela.proposal.entity.cnpj = this.entidade.cnpj
          this.tabela.name = this.proposta.name
          console.log(this.table.items)
          this.table.items.push(this.proposta)
          this.$forceUpdate()
          this.onCancel()
        },
        edita (row) {
          this.state = 'FORM'
          this.editandoIndex = row.index
          this.tabela = Object.assign({}, row.item)
          this.tabela = row.item
          this.$forceUpdate()
        },
        exclui (row) {
          this.table.items.splice(row.index, 1)
        }
      }
    }
</script>

<style scoped>

</style>
