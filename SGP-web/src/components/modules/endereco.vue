<template>
  <!-- states -->
  <div>
    <div class="box-body">
      <!-- grid -->
      <div>
        <div class="row" v-if="!disable">
          <div class="col-md-12">

            <button @click.stop="onNew()" uib-tooltip="Adiciona um endereço" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Novo endereço</button>
            <div v-if="mostraInclusao === true && mostraInclusao">
              <span class="fa fa-warning indicador_insercao"
                    :title="'<h5>Inclusões: ' + inclEndTexto + '</h5>'"
                    v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', placement : 'right', size: 'large', arrow : true }">
                <label class="control-label" style="color: #000;">&nbsp Houve a inserção de novo(s) endereço(s)</label>
              </span>
            </div>
            <div class="col-md-12" v-if="mostraExclusao === true">
              <span class="fa fa-warning indicador_exclusao"
                    :title="'<h5>Exclusões: ' + excEndTexto + '</h5>'"
                    v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', placement : 'right', size: 'large', arrow : true }">
                <label class="control-label" style="color: #000;">&nbsp Houve a exclusão de endereço(s)</label>
              </span>
            </div>
            <!--<g-button-ujarak color="dark-primary" size="button&#45;&#45;size-sm" @click.native="onNew()" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-plus-circle" aria-hidden="true"></i> Novo endereço </g-button-ujarak>-->
            <!-- /.col -->
          </div>
        </div>
        <!-- /.row -->
        <br>
        <!-- form -->
        <div class="row" ref="listagem">
          <div class="table-responsive">
            <b-container fluid>
              <!-- Main table element -->
              <b-table
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
                <template slot="bt_principal" scope="row">
                  <i :class="['fa fa-star ', row.value ? 'text-yellow' : 'text-gray']" aria-hidden="true"></i>
                </template>
                <template slot="ds_cep" scope="row">{{row.value | cep}}</template>
                <template slot="actions" scope="row">
                  <div v-if="disable">
                    <b-button type="button" :disabled="false" @click.stop="edita(row)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Detalhar</b-button>
                  </div>
                  <div v-else>
                    <span v-if="indiceAlt == row.index && mostraAlteracao === true && mostraInclusao === false"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Clique em editar para ver as mudanças.</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true, placement:'left' }"></span>
                    <b-button type="button" :disabled="false" @click.stop="edita(row)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>
                    <b-button type="button" :disabled="false" @click.stop="exclui(row)" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true" ></i> Excluir</b-button>
                  </div>
                </template>
              </b-table>
            </b-container>
          </div>
        </div>
      </div>
    </div>
    <div v-if="state === 'FORM'" style="padding-left:0" class="row well well-sm no-shadow animated fadeInDownOutUp" name="frmAddAddress">
      <div class="col-md-6">
        <!-- cep -->
        <div class="form-group required-field" :class="{ 'has-error' : errors.first('CEP')}">
          <label class="control-label col-md-4">
                <span v-if="_.hasIn(mudancas, 'ds_cep')"  class="fa fa-warning indicador_alteracao"
                      :title="'<h5>Conteúdo anterior: ' + texto.ds_cep + '</h5>'"
                      v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
            CEP:</label>
          <div class="col-md-3">
            <the-mask v-model="endereco.ds_cep" name="CEP" class="form-control" type="text"
                      v-validate="'required|min:8|max:8'" @blur.native="buscaCEP" mask="#####-###" :disabled="disable" ref="CEP"></the-mask>
          </div>
          <span v-if="errors.first('CEP')" class="label label-danger"> {{ errors.first('CEP') }}</span>
          <div class="col-md-4 col-lg-3" style="padding:7px;" v-if="endereco.name">
          </div>
        </div>

        <!-- street -->
        <div class="form-group required-field" :class="{ 'has-error' : errors.first('Endereço')}">
          <label for="Endereço" class="control-label col-md-4">
                <span v-if="_.hasIn(mudancas, 'ds_rua')"  class="fa fa-warning indicador_alteracao"
                      :title="'<h5>Conteúdo anterior: ' + texto.ds_rua + '</h5>'"
                      v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
            Endereço:</label>
          <div class="col-md-8">
            <input v-model="endereco.ds_rua" name="Endereço" class="form-control" type="text" v-validate="'required|min:1|max:100'" :disabled="disable" ref="Endereço">
          </div>
          <span v-if="errors.first('Endereço')" class="label label-danger"> {{('O campo Endereço é obrigatório') }}</span>
        </div>

        <!-- number -->
        <div class="form-group">
          <label for="Número" class="control-label col-md-4">
              <span v-if="_.hasIn(mudancas, 'ds_numero')"  class="fa fa-warning indicador_alteracao"
                    :title="'<h5>Conteúdo anterior: ' + texto.ds_numero + '</h5>'"
                    v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
            Número:</label>
          <div class="col-md-6 col-lg-4">
            <input v-model="endereco.ds_numero" name="Número" class="form-control" type="text" v-validate="'max:26'" :disabled="disable">
          </div>
          <span v-if="errors.first('number')" class="label label-danger"> {{('Limite de 26 caracteres excedido') }}</span>
        </div>

        <!-- complement -->
        <div class="form-group">
          <label for="Complemento" class="control-label col-md-4">
                <span v-if="_.hasIn(mudancas, 'ds_complemento') || _.hasIn(mudancas[0], 'ds_complemento')"  class="fa fa-warning indicador_alteracao"
                      :title="'<h5>Conteúdo anterior: ' + texto.ds_complemento + '</h5>'"
                      v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
            Complemento:</label>
          <div class="col-md-6">
            <input v-model="endereco.ds_complemento" name="Complemento" class="form-control" type="text" v-validate="'max:200'" :disabled="disable">
          </div>
          <span v-if="errors.first('Complemento')" class="label label-danger"> {{('Limite de 200 caracteres excedido') }}</span>
        </div>

        <!-- neighbourhood -->
        <div class="form-group">
          <label for="Bairro" class="control-label col-md-4">
              <span v-if="_.hasIn(mudancas, 'ds_bairro')"  class="fa fa-warning indicador_alteracao"
                    :title="'<h5>Conteúdo anterior: ' + texto.ds_bairro + '</h5>'"
                    v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
            Bairro:</label>
          <div class="col-md-6">
            <input v-model="endereco.ds_bairro" name="Bairro" class="form-control" type="text" v-validate="'max:75'" :disabled="disable">
          </div>
          <span v-if="errors.first('Bairro')" class="label label-danger"> {{('Limite de 75 caracteres excedido') }}</span>
        </div>

        <div class="form-group">
          <label for="city" class="control-label col-md-4">Cidade:</label>
          <div class="col-md-8">
            <input v-model="endereco.ds_cidade" name="city" class="form-control" type="text" :disabled="true">
          </div>
        </div>

        <div class="form-group">
          <label for="state" class="control-label col-md-4">UF:</label>
          <div class="col-md-8">
            <input v-model="endereco.ds_estado" name="state" class="form-control" type="text" v-validate="'max:2'" :disabled="true">
          </div>
        </div>

        <!-- isMain -->
        <div class="form-group">
          <div class="col-md-8 col-md-offset-4">
            <label class="new-control new-control-checkbox" >
              <input type="checkbox" v-model="endereco.bt_principal" @change="verificaPrincipal(endereco)" :disabled="disable" value="true"/>Endereço principal
              <div class="fa-lg">
                            <span v-if="_.hasIn(mudancas, 'bt_principal')"  class="fa fa-warning" style="position:relative; top:8px; margin-left:2px; color: red;"
                                  :title="'<h5>Conteúdo anterior: ' + texto.bt_principal + '</h5>'"
                                  v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                            ></span>
              </div>
              <div class="new-control-indicator"></div>
            </label>
          </div>
        </div>

        <!-- buttons -->
        <div class="form-group" style="margin-bottom:0">
          <div class="col-md-8 col-md-offset-4">
            <!--<g-button-ujarak color="success" size="button&#45;&#45;size-ss" type="button" @click.native="onAdd(frmAddAddress)" ><i class="fa fa-check" aria-hidden="true"></i> Ok</g-button-ujarak>
            <g-button-ujarak color="error" size="button&#45;&#45;size-ss"  @click.native="onCancel(frmAddAddress)" type="button"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</g-button-ujarak>-->
            <button @click="onAdd(frmAddAddress)" :disabled="jaExiste === 1" type="button" class="btn btn-confirm btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Salvar Endereço</button>
            <button @click="onCancel(frmAddAddress)" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
          </div>
        </div>
        <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {detailedDiff} from 'deep-object-diff'

  export default {
    name: 'endereco',
    data () {
      return {
        showgrid: true,
        state: '',
        address: [],
        naoAchou: 0,
        curIndex: 0,
        endereco: {},
        listaEnd: {},
        jaExiste: 0,
        indiceAlt: -1,
        acao: '',
        texto: {
          ds_numero: '',
          ds_complemento: ''
        },
        mostraInclusao: false,
        mostraExclusao: false,
        mostraAlteracao: false,
        naoExisteSapiens: false,
        loading: {
          show: false
        },
        mudancas: [],
        tabEndereco: [],
        retornoCEP: {},
        tempArray: {},
        editandoIndex: null,
        table: {
          items: this.entEnderecos,
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          perPage: 10,
          fields: [
            {key: 'ds_cep', label: 'CEP', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
            {key: 'ds_rua', label: 'Endereço', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
            {key: 'ds_numero', label: 'Número', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
            {
              key: 'ds_complemento',
              label: 'Complemento',
              sortable: true,
              thStyle: 'text-align: center',
              class: 'text-center'
            },
            {key: 'ds_bairro', label: 'Bairro', thStyle: 'text-align: center; width: 13%', class: 'text-center'},
            {key: 'ds_cidade', label: 'Cidade', thStyle: 'text-align: center; width: 13%', class: 'text-center'},
            {key: 'ds_estado', label: 'UF', thStyle: 'text-align: center; width: 13%', class: 'text-center'},
            {key: 'bt_principal', label: 'Principal', thStyle: 'text-align: center; width: 13%', class: 'text-center'},
            { key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 13%', class: 'text-center' }
          ]
        }
      }
    },
    props: ['entEnderecos', 'disable', 'mudaEndereco', 'diferenca', 'analise', 'revisao'],
    watch: {
      entEnderecos: function () {
        this.table.items = this.entEnderecos
        this.desativado = this.disable
      },
      diferenca: function () {
        this.diferencaEnd = this.diferenca
      },
      analise: function () {
        if (this.analise) {
          this.analiseEnd = this.analise.endereco
        }
      },
      revisao: function () {
        this.revisaoEnd = this.revisao.endereco
        this.mostraExclusao = false
        this.mostraInclusao = false
        if (this.analiseEnd && this.revisaoEnd) {
          if (this.analiseEnd.length > this.revisaoEnd.length) {
            this.mostraExclusao = true
            this.mostraInclusao = false
          } else {
            this.mostraExclusao = true
          }
          if (this.analiseEnd.length < this.revisaoEnd.length) {
            this.mostraInclusao = true
            this.mostraExclusao = false
          } else {
            this.mostraInclusao = false
          }
          if (this.analiseEnd.length === this.revisaoEnd.length) {
            this.mostraExclusao = false
          }
        }
        this.adicionados = detailedDiff(this.analise, this.revisao).added
        this.excluidos = _.differenceBy(this.analise.endereco, this.revisao.endereco, 'ds_rua')
        if (this.adicionados) {
          if (this.adicionados.endereco) {
            this.inclEnd = this.adicionados.endereco
            this.inclEndTexto = _.map(this.inclEnd, 'ds_rua')
            this.naoExisteEnd = false
          } else {
            this.naoExisteEnd = true
          }
        }
        if (this.excluidos) {
          this.excEndTexto = _.map(this.excluidos, 'ds_rua')
        }
      },
      mudaEndereco: function () {
        this.mudancas = this.diferencaEnd.endereco
        console.log('mudança de endereço')
        console.log(this.mudancas)
        if (this.mudancas) {
          if (_.findKey(this.mudancas, 'ds_cep')) {
            this.indiceAlt = _.findKey(this.mudancas, 'ds_cep')
          }
          if (_.findKey(this.mudancas, 'ds_cidade')) {
            this.indiceAlt = _.findKey(this.mudancas, 'ds_cidade')
          }
          if (_.findKey(this.mudancas, 'ds_estado')) {
            this.indiceAlt = _.findKey(this.mudancas, 'ds_estado')
          }
          if (_.findKey(this.mudancas, 'ds_numero')) {
            this.indiceAlt = _.findKey(this.mudancas, 'ds_numero')
          }
          if (_.findKey(this.mudancas, 'ds_rua')) {
            this.indiceAlt = _.findKey(this.mudancas, 'ds_rua')
          }
          if (_.findKey(this.mudancas, 'ds_bairro')) {
            this.indiceAlt = _.findKey(this.mudancas, 'ds_bairro')
          }
          if (_.findKey(this.mudancas, 'ds_complemento')) {
            this.indiceAlt = _.findKey(this.mudancas, 'ds_complemento')
          }
          if (_.findKey(this.mudancas, 'bt_principal')) {
            this.indiceAlt = _.findKey(this.mudancas, 'bt_principal')
          }
          if (this.indiceAlt !== -1) {
            console.log('caiu aqui>>>>>>>>>>>')
            console.log(this.diferencaEnd.endereco[this.indiceAlt])
            this.mostraAlteracao = true
            this.texto = this.diferencaEnd.endereco[this.indiceAlt]
          } else {
            this.mostraAlteracao = false
          }
          // this.listaEnd = this.mudaEndereco.endereco[this.indiceAlt]
          // console.log('listaEnd', this.listaEnd)
        }
      },
      'table.items': function () {
        this.$emit('enderecoAdicionado', this.table.items)
      }
    },
    created () {
      this.acao = this.$route.params.acao
      // this.mostraInclusao = false
      // this.mostraExclusao = false
      // if (this.analiseEnd && this.revisaoEnd) {
      //   if (this.analiseEnd.length < this.revisaoEnd.length) {
      //     this.mostraExclusao = true
      //     console.log('mostraExclusao', this.mostraExclusao)
      //   }
      //   if (this.analiseEnd.length > this.revisaoEnd.length) {
      //     this.mostraInclusao = true
      //   }
      // }
    },
    updated () {
      this.acao = this.$route.params.acao
    },
    methods: {
      onNew () {
        this.endereco = {}
        this.address = {}
        this.editandoIndex = null
        this.state = 'FORM'
        this.curIndex = -1
      },
      onCancel () {
        this.state = 'GRID'
        this.curIndex = -1
        // this.endereco = {}
      },
      onAdd () {
        this.$validator.validateAll().then((result) => {
          if (result) {
            if (this.editandoIndex !== null) {
              for (let i in this.endereco) this.address[i] = this.endereco[i]
            } else {
              // this.endereco.city = this.address.city
              // this.endereco.state = this.address.state
              this.table.items.push(this.endereco)
            }
            this.$forceUpdate()
            this.onCancel()
          }
        })
      },
      edita (row) {
        this.state = 'FORM'
        this.editandoIndex = row.index
        this.endereco = Object.assign({}, row.item)
        this.address = row.item
        if (this.mostraInclusao === true) {
          this.mudancas = _.cloneDeep(this.endereco[row.index])
        } else {
          this.mudancas = _.cloneDeep(this.mudaEndereco.endereco[row.index])
        }
        if (this.texto === undefined || this.texto === 'undefined') {
          this.texto.ds_numero = ''
          this.texto.ds_complemento = ''
        }
        this.$forceUpdate()
      },
      exclui (row) {
        this.table.items.splice(row.index, 1)
      },
      buscaCEP () {
        if (this.endereco.ds_cep !== undefined && this.endereco.ds_cep !== null && this.endereco.ds_cep !== '') {
          if (this.endereco.ds_cep) {
            this.loading.show = true
            let cep = this.endereco.ds_cep.replace('-', '')
            axiosLaravel.get('municipios/cep/' + cep).then((response) => {
              this.endereco.ds_cidade = response.data.ds_nome
              this.endereco.ds_estado = response.data.ds_uf
              this.$forceUpdate()
              this.loading.show = false
            })
              .catch((error) => {
                cep = _.repeat('0', 8 - ('' + cep).length) + cep
                this.$viaCep.buscarCep(cep).then((obj) => { // Buscando através do serviço ViaCEP
                  if (obj.erro) { // Se não achar através do serviço ViaCEP
                    this.$snotify.error('Não foi encontrado esse CEP. Entre em contato com a FBB.')
                  } else {
                    this.endereco.ds_cidade = _.toUpper(obj.localidade)
                    this.endereco.ds_estado = _.toUpper(obj.uf)
                  }
                  this.loading.show = false
                  this.$forceUpdate()
                }).catch((errorViaCep) => {
                  this.$snotify.error('Erro ao buscar CEP externamente. Entre em contato com a FBB.')
                  this.loading.show = false
                  this.$root.trataErro(error)
                })
              })
          }
        }
      },
      verificaPrincipal (entidade) {
        if (entidade.bt_principal === true || entidade.bt_principal === 0) {
          for (let i = 0; i < this.table.items.length; i++) {
            if (this.table.items[i].ds_cep !== entidade.ds_cep) {
              if (this.table.items[i].bt_principal === true || this.table.items[i].bt_principal === 1) {
                this.jaExiste = 1
              }
            }
          }
          if (this.jaExiste === 1) {
            this.$snotify.error('Somente 1 endereço pode ser selecionado como principal!')
            return
          }
        } else {
          this.jaExiste = 0
        }
      }
    }
  }
</script>

<style scoped>

</style>
