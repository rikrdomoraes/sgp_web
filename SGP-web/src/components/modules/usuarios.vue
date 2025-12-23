<template>
  <!-- states -->
  <div>

    <!-- grid -->
    <div class="box-body">
      <div class="row" v-if="!disable">
        <div class="col-md-2">
          <button @click="onNew()" uib-tooltip="Adiciona um usuário" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Novo usuário</button>
        </div>

        <div class="col-md-3">
          <button @click="inativosOcultados = !inativosOcultados" uib-tooltip="Oculta usuários sem acesso ao sistema ou mostra todos os usuários" type="button" class="btn btn-primary btn-flat"><i class="fa fa-user" aria-hidden="true"></i> {{inativosOcultados ? 'Mostrar Inativos' : 'Somente Ativos'}}</button>
        </div>
        <div class="col-md-12" v-if="mostraInclusao === true && mostraInclusao">
          <span class="fa fa-warning indicador_insercao"
                :title="'<h5>Inclusões: ' + inclUsuTexto + '</h5>'"
                v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', placement : 'right', size: 'large', arrow : true }">
            <label class="control-label" style="color: #000;">&nbsp Houve a inserção de novo(s) usuario(s)</label>
          </span>
        </div>
        <div class="col-md-12" v-if="mostraExclusao === true">
          <span class="fa fa-warning indicador_exclusao"
                :title="'<h5>Exclusões: ' + excUsuTexto + '</h5>'"
                v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', placement : 'right', size: 'large', arrow : true }">
            <label class="control-label" style="color: #000;">&nbsp Houve a exclusão de usuario(s)</label>
          </span>
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
                     ref="tabelaUsuarios"
                     stacked="md"
                     id="usuarios-table"
                     :bordered="table.bordered"
                     :items="table.items"
                     :hover="table.hover"
                     :fields="table.fields"
                     :filter="table.filter"
                     :current-page="table.currentPage"
                     :per-page="table.perPage"
                     :sort-by.sync="table.sortBy"
                     :sort-desc.sync="table.sortDesc"
                     :tbody-tr-class="inativosMostrarOcultar"
                     empty-text="Nenhum registro encontrado"
            >
              <template slot="ds_telefone" scope="row">{{row.value}}</template>
              <template slot="ds_cpf" scope="row">{{row.value | cpf}}</template>

              <template slot="bt_ativo" scope="row">
                <i :class="row.value === 0 ? 'fa fa-circle text-red' : 'fa fa-circle text-green'" aria-hidden="true"></i>
              </template>

              <template slot="actions" scope="row">
                <div v-if="!disable">
                  <b-button type="button" @click.stop="edita(row)" v-if="row.item.ds_cpf !== null" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>
                  <div class="col-sm-offset-0 fa-lg">
              <span v-if="indiceAlt == row.index && mostraAlteracao === true && mostraInclusao === false"  class="fa fa-warning" style="position:relative; top:8px; margin-left:2px; color: #fb2916;"
                    :title="'<h5>Clique em editar para ver as mudanças.</h5>'"
                    v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true, placement:'left' }"
              ></span>
                  </div>
                </div>
              </template>
            </b-table>

            <b-row v-if="table.items && (table.items.length > table.perPage)">
              <b-col md="12" class="my-1" right>
                <b-pagination :total-rows="table.items.length" :per-page="table.perPage" v-model="table.currentPage" class="" />
              </b-col>
            </b-row>

          </b-container>
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->
    </div>

    <!-- form -->
    <div v-if="state === 'FORM'" style="padding-left:0" class="row well well-sm no-shadow animated fadeInDownOutUp" name="frmAddUser">

      <div class="form-group required-field" :class="{ 'has-error' : errors.first('nome')}">
        <div class="control-label col-md-2"></div>
        <div class="col-md-4"><strong>Cadastre abaixo o usuário que utilizará o sistema pela entidade</strong></div>
      </div>


      <div class="form-group required-field" :class="{ 'has-error' : errors.first('nome')}">
        <label for="nome" class="control-label col-md-2">Nome:</label>
        <div class="col-md-16">
          <div class="col-md-4">
            <input v-model="usuario.ds_nome_usuario" name="nome" class="form-control" type="text" v-validate="'required|min:1|max:100'" :disabled="bloqueioCampos === true || disable" ref="ds_nome_usuario">
          </div>
          <div class="col-sm-offset-2 fa-lg">
                            <span v-if="_.hasIn(mudancas, 'ds_nome_usuario')"  class="fa fa-warning" style="position:relative; top:8px; margin-left:2px; color: red;"
                                  :title="'<h5>Conteúdo anterior: ' + texto.ds_nome_usuario + '</h5>'"
                                  v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                            ></span>
          </div>
          <span v-if="errors.first('nome')" class="label label-danger"> {{('O campo Nome do Usuário é obrigatório') }}</span>
        </div>
      </div>

      <div class="form-group required-field" :class="{ 'has-error' : errors.first('cpf')}">
        <label for="cpf" class="control-label col-md-2">CPF:</label>
        <div class="col-md-16">
          <div class="col-md-2">
            <the-mask v-model="usuario.ds_cpf"
                      name="cpf" data-vv-as="CPF" class="form-control" type="text" :disabled="bloqueioCampos === true"
                      :mask="'###.###.###-##'" v-validate="'cpf|required'">
            </the-mask>
          </div>
          <div class="col-sm-offset-2 fa-lg">
                            <span v-if="_.hasIn(mudancas, 'ds_cpf')"  class="fa fa-warning" style="position:relative; top:8px; margin-left:2px; color: red;"
                                  :title="'<h5>Conteúdo anterior: ' + texto.ds_cpf + '</h5>'"
                                  v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                            ></span>
          </div>
          <span v-if="errors.first('cpf')" class="label label-danger">{{ errors.first('cpf') }}</span>
        </div>
      </div>

      <div class="form-group required-field" :class="{ 'has-error' : errors.first('login')}">
        <label for="login" class="control-label col-md-2">Login:</label>
        <div class="col-md-16">
          <div class="col-md-2">
            <input v-model="usuario.ds_login" @change="verificaUsuario('ds_login', usuario.ds_login)" name="login" class="form-control" type="text" :disabled="bloqueioCampos === true" v-validate="'required'">
          </div>
          <div class="col-sm-offset-2 fa-lg">
                            <span v-if="_.hasIn(mudancas, 'ds_login')"  class="fa fa-warning" style="position:relative; top:8px; margin-left:2px; color: red;"
                                  :title="'<h5>Conteúdo anterior: ' + texto.ds_login + '</h5>'"
                                  v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                            ></span>
          </div>
          <span v-if="errors.first('login')" class="label label-danger"> {{ errors.first('login') }}</span>
        </div>
      </div>

      <!-- telefone -->
      <div class="form-group required-field" :class="{ 'has-error' : errors.first('Telefone')}">
        <label for="Telefone" class="control-label col-md-2">Telefone:</label>
        <div class="col-md-16">
          <div class="col-md-2">
            <the-mask v-model="usuario.ds_telefone" name="Telefone" ref="Telefone" class="form-control" type="text" :masked="false"
                      v-validate="'required|min:10|max:11'" :mask="['(##) ####-####', '(##) #####-####']">
            </the-mask>
          </div>
          <div class="col-sm-offset-2 fa-lg">
                            <span v-if="_.hasIn(mudancas, 'ds_telefone')"  class="fa fa-warning" style="position:relative; top:8px; margin-left:2px; color: red;"
                                  :title="'<h5>Conteúdo anterior: ' + texto.ds_telefone + '</h5>'"
                                  v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                            ></span>
          </div>
          <span v-if="errors.first('Telefone')" class="label label-danger"> {{ errors.first('Telefone') }}</span>
        </div>
      </div>

      <div class="form-group required-field" :class="{ 'has-error' : errors.first('email')}">
        <label for="email" class="control-label col-md-2">E-Mail:</label>
        <div class="col-md-16">
          <div class="col-md-2">
            <input v-model="usuario.ds_email" name="email" data-vv-as="E-Mail" @change="verificaUsuario('ds_email', usuario.ds_email)" class="form-control" type="text" :disabled="bloqueioCampos === true" v-validate="'required|email'">
          </div>
          <div class="col-sm-offset-2 fa-lg">
                            <span v-if="_.hasIn(mudancas, 'ds_email')"  class="fa fa-warning" style="position:relative; top:8px; margin-left:2px; color: red;"
                                  :title="'<h5>Conteúdo anterior: ' + texto.ds_email + '</h5>'"
                                  v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                            ></span>
          </div>
          <span v-if="errors.first('email')" class="label label-danger">{{ errors.first('email') }}</span>
        </div>
      </div>

      <div class="form-group required-field" :class="{ 'has-error' : errors.first('status')}">
        <label for="active" class="control-label col-md-2">Status:</label>
        <div class="col-md-16">
          <div class="col-md-2">
            <select v-model="usuario.bt_ativo" name="status" class="form-control" v-validate="'required'">
              <option value="1">Ativo</option>
              <option value="0">Inativo</option>
            </select>
          </div>
          <div class="col-sm-offset-2 fa-lg">
                            <span v-if="_.hasIn(mudancas, 'bt_ativo')"  class="fa fa-warning" style="position:relative; top:8px; margin-left:2px; color: red;"
                                  :title="'<h5>Conteúdo anterior: ' + (texto.bt_ativo | 'Ativo') + '</h5>'"
                                  v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                            ></span>
          </div>
          <span v-if="errors.first('status')" class="label label-danger"> {{('O campo Status do Usuário é obrigatório') }}</span>
        </div>
      </div>

      <!-- buttons -->
      <div class="form-group">
        <div class="col-md-offset-2 col-md-4">
          <span v-if="!verificandoLoginEmail">
            <button @click="onAdd(frmAddUser)"  uib-tooltip="Salva o cadastro" type="button" class="btn btn-confirm btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Salvar Usuário</button>
            <button @click="onCancel(frmAddUser)" type="button" class="btn btn-back" uib-tooltip="Cancela a edição"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
          </span>
          <span v-else>
            <i class="fa fa-refresh fa-spin" style="font-size: 30px"></i>&nbsp; Verificando se já existe...
          </span>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
  // eslint-disable-next-line no-unused-vars
  import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff'
  export default {
    name: 'usuarios',
    data () {
      return {
        showgrid: true,
        state: 'GRID',
        users: [],
        curIndex: 0,
        bloqueioCampos: false,
        statusEntidade: '',
        usuario: {},
        index: 0,
        mudancas: [],
        listaUsu: [],
        verificandoLoginEmail: false,
        jaExisteEmail: false,
        jaExisteLogin: false,
        editandoIndex: null,
        inativosOcultados: true,
        mostraInclusao: false,
        mostraExclusao: false,
        mostraAlteracao: false,
        table: {
          items: this.entUsuarios,
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          perPage: 50,
          fields: [
            {key: 'ds_nome_usuario', label: 'Nome', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
            {key: 'ds_cpf', label: 'CPF', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
            {key: 'ds_login', label: 'Login', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
            {key: 'ds_telefone', label: 'Telefone', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
            {key: 'ds_email', label: 'E-mail', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
            {key: 'bt_ativo', label: 'Ativo', thStyle: 'text-align: center; width: 7%', class: 'text-center'},
            { key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 13%', class: 'text-center' }
          ]
        }
      }
    },
    props: ['entUsuarios', 'disable', 'mudaUsuario', 'diferenca', 'analise', 'revisao'],
    watch: {
      entUsuarios: function () {
        this.table.items = this.entUsuarios
        if (this.mudaUsuario) {
          this.mudancas = this.mudaUsuario
        }
      },
      'table.items': function () {
        this.$emit('usuarioAdicionado', this.table.items)
      },
      diferenca: function () {
        this.diferencaUsu = this.diferenca
      },
      analise: function () {
        if (this.analise) {
          this.analiseUsu = this.analise.usuarios
        }
      },
      revisao: function () {
        if (this.revisao) {
          this.revisaoUsu = this.revisao.usuarios
        }
        this.mostraExclusao = false
        this.mostraInclusao = false
        if (this.analiseUsu && this.revisaoUsu) {
          if (this.analiseUsu.length > this.revisaoUsu.length) {
            this.mostraExclusao = true
            this.mostraInclusao = false
          } else {
            this.mostraExclusao = true
          }
          if (this.analiseUsu.length < this.revisaoUsu.length) {
            this.mostraInclusao = true
            this.mostraExclusao = false
          } else {
            this.mostraInclusao = false
          }
          if (this.analiseUsu.length === this.revisaoUsu.length) {
            this.mostraExclusao = false
          }
        }
        this.adicionados = detailedDiff(this.analise, this.revisao).added
        this.excluidos = _.differenceBy(this.analise.usuario, this.revisao.usuario, 'ds_nome_usuario')
        if (this.adicionados) {
          if (this.adicionados.usuarios) {
            this.inclUsu = this.adicionados.usuarios
            this.inclUsuTexto = _.map(this.inclUsu, 'ds_nome_usuario')
            this.naoExisteUsu = false
          } else {
            this.naoExisteUsu = true
          }
        }
        if (this.excluidos) {
          this.excUsuTexto = _.map(this.excluidos, 'ds_nome_usuario')
        }
        if (this.indiceAlt !== -1) {
          this.mostraAlteracao = true
          this.texto = this.diferencaUsu.usuarios[this.indiceAlt]
          if (this.texto.bt_ativo === 1) {
            this.texto.bt_ativo = 'Ativo'
          } else {
            this.texto.bt_ativo = 'Inativo'
          }
        } else {
          this.texto = []
          this.mostraAlteracao = false
        }
      },
      mudaUsuario: function () {
        // let index = _.findIndex(_.map(this.mudaUsuario.usuarios))
        this.mudancas = this.mudaUsuario.usuarios
        if (this.mudancas) {
          if (_.findKey(this.mudancas, 'ds_nome_usuario')) {
            this.indiceAlt = _.findKey(this.mudancas, 'ds_nome_usuario')
          }
          if (_.findKey(this.mudancas, 'ds_telefone')) {
            this.indiceAlt = _.findKey(this.mudancas, 'ds_telefone')
          }
          if (_.findKey(this.mudancas, 'ds_email')) {
            this.indiceAlt = _.findKey(this.mudancas, 'ds_email')
          }
          if (_.findKey(this.mudancas, 'ds_login')) {
            this.indiceAlt = _.findKey(this.mudancas, 'ds_login')
          }
          if (_.findKey(this.mudancas, 'bt_ativo')) {
            this.indiceAlt = _.findKey(this.mudancas, 'bt_ativo')
          }
          if (this.indiceAlt !== -1) {
            this.mostraAlteracao = true
            this.texto = this.diferencaUsu.usuarios[this.indiceAlt]
          } else {
            this.mostraAlteracao = false
          }
          // this.listaEnd = this.mudaEndereco.endereco[this.indiceAlt]
          // console.log('listaEnd', this.listaEnd)
        }
      }
    },
    computed: {
      rows () {
        return this.table.items.length
      }
    },
    created () {
    },
    methods: {
      inativosMostrarOcultar (item) {
        if (this.inativosOcultados) {
          if (item.bt_ativo === 0 || item.bt_ativo === '0') return 'linha_ocultada' // Pegar todos os inativos e atribui classe para ocultá-los
        } else {
          if (!item.bt_ativo) return ''  // Pegar todos os inativos e exclui todas as classes
        }
      },
      onNew () {
        this.usuario = {}
        this.state = 'FORM'
        this.curIndex = -1
        this.editandoIndex = null
        this.bloqueioCampos = false
        this.jaExisteEmail = false
        this.jaExisteLogin = false
      },
      onCancel () {
        this.state = 'GRID'
        this.curIndex = -1
        this.bloqueioCampos = false
      },
      onAdd () {
        this.$validator.validateAll().then((result) => {
          if (result) {
            if (this.editandoIndex !== null) {
              // Pega o index da tabela e atualiza o item
              this.table.items[this.editandoIndex] = this.usuario
              // Força o refresh da tabela
              this.$refs.tabelaUsuarios.refresh()
            } else {
              if (this.jaExisteEmail === false && this.jaExisteLogin === false) {
                this.table.items.push(this.usuario)
              } else {
                if (this.jaExisteEmail === true) {
                  this.$snotify.error('O E-mail informado já existe. Favor verificar!')
                  return
                } else if (this.jaExisteLogin === true) {
                  this.$snotify.error('O Login já existe. Favor verificar!')
                  return
                }
                // this.$snotify.error('O login/e-mail informado já existe. Favor verificar!')
                // return
              }
            }
            this.$forceUpdate()
            this.onCancel()
          }
        })
      },
      edita (row) {
        if (this.$route.params.entidade) {
          this.statusEntidade = this.$route.params.entidade.ds_status
        }
        if (this.$route.params.parceiro) {
          this.parceiro = this.$route.params.parceiro
        }
        if (this.statusEntidade === 'COMPLETO' && row.item.id) {
          this.bloqueioCampos = true
          this.$forceUpdate()
        } else {
          this.bloqueioCampos = false
          this.$forceUpdate()
        }
        if (this.parceiro) {
          if (row.item.id) {
            this.bloqueioCampos = true
            this.$forceUpdate()
          }
        }
        if (row.item.id) {
          this.bloqueioCampos = true
          this.$forceUpdate()
        }
        if (this.statusEntidade === 'INCOMPLETO') {
          this.bloqueioCampos = false
        }
        this.state = 'FORM'
        this.editandoIndex = row.index
        this.usuario = _.cloneDeep(row.item)
        if (this.mostraInclusao === true) {
          this.mudancas = _.cloneDeep(this.usuarios[row.index])
        } else {
          this.mudancas = _.cloneDeep(this.mudaUsuario.usuarios[row.index])
        }
        this.$forceUpdate()
      },
      exclui (row) {
        this.table.items.splice(row.index, 1)
      },
      verificaUsuario (parametro, valor) {
        this.verificandoLoginEmail = true
        if (this.usuario.ds_login) {
          axiosLaravel.post('/verifica-usuario/', {'parametro': parametro, 'valor': valor}).then((response) => {
            if (response.data.length > 0) {
              let campo = parametro === 'ds_login' ? 'login' : parametro === 'ds_email' ? 'email' : 'erro'
              this.jaExisteLogin = true
              let field = this.$validator.fields.find({ name: campo })
              field.setFlags({invalid: true})
              this.errors.add({ field: campo, msg: 'Este ' + campo + ' já esta sendo usado no sistema. Favor alterar.', id: field.id, scope: field.scope })
            } else {
              this.verificandoLoginEmail = false
              this.jaExisteLogin = false
            }
            this.$forceUpdate()
          })
            .catch((error) => {
              if (error) {
                this.$root.trataErro(error)
              }
            })
        }
        // if (this.usuario.ds_email) {
        //   axiosLaravel.post('/verifica-usuario/', {'parametro': this.usuario.ds_email}).then((response) => {
        //     // Verifica e-mail
        //     if (response.data.length > 0) {
        //       this.jaExisteEmail = true
        //       // this.$forceUpdate()
        //       let field = this.$validator.fields.find({ name: 'email' })
        //       field.setFlags({invalid: true})
        //       this.errors.add({
        //         field: 'email',
        //         msg: response.data,
        //         id: field.id,
        //         scope: field.scope
        //       })
        //     } else {
        //       this.jaExisteEmail = false
        //       // this.$forceUpdate()
        //     }
        //   })
        //     .catch((error) => {
        //       if (error) {
        //         this.$root.trataErro(error)
        //       }
        //     })
        // }
      }
    }
  }
</script>

<style>
  .linha_ocultada {
    display: none;
  }
</style>
