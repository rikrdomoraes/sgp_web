<template>
    <div class="column start-centered testemunha-container">
        <div>Indique 2 (duas) testemunhas para assinatura da minuta para formalização do projeto:</div>
        <div class="col-md-12">
          <button v-if="!this.editando && !this.gravando && !this.carregando" tooltip="Adiciona uma Testemunha" type="button" class="btn btn-primary btn-flat" @click="toggleEdicao(true)"><i class="fa fa-plus-circle" aria-hidden="true"></i> Nova testemunha</button>
        </div>
        <b-container v-if="!this.editando && !this.gravando && !this.carregando" fluid class="column centered-start w-100 gap-10">
            <b-table
                show-empty
                stacked="md"
                striped
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
            <template  slot="actions" scope="row">
                <g-button-ujarak color="error" v-confirm="{ok: retorno => excluirItem(row.item, row.index), cancel: doNothing,
                                message: 'Confirma Exclusão da Testemunha?'}"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</g-button-ujarak>
            </template>
            </b-table>
        </b-container>
        <div v-if="this.editando && !this.gravando" class="column start-centered testemunha-cadastro-container">
            <b>Cadastro de Testemunha</b>
          <div class="row-flex centered-start testemunha-form">
              <label for="título do curso" class="control-label testemunha-label f-required">Nome:</label>
              <input v-model="testemunhaEdicao.nome" name="título do curso" class="form-control testemunha-input" type="text">
          </div>
          <div class="row-flex centered-start testemunha-form">
              <label for="título do curso" class="control-label testemunha-label f-required">CPF:</label>
              <the-mask v-model="testemunhaEdicao.cpf" name="título do curso" class="form-control testemunha-input" type="text" :mask="'###.###.###-##'" @input="validaCPF()" :class="cpfInvalido ? 'campo-invalido' : ''"></the-mask>
              <span class="span-invalido" v-if="cpfInvalido">CPF inválido.</span>
          </div>
          <div class="row-flex centered-start testemunha-form">
              <label for="título do curso" class="control-label testemunha-label f-required">E-mail:</label>
              <input v-model="testemunhaEdicao.email" name="título do curso" class="form-control testemunha-input" type="text" @input="validaEmail()" :class="emailInvalido ? 'campo-invalido' : ''">
              <span class="span-invalido" v-if="emailInvalido">EMAIL inválido.</span>
          </div>
          <div class="row centered-start testemunha-botao">
                <button @click="adicionarTestemunha()" tooltip="Adiciona uma Testemunha" type="button" class="btn btn-success btn-flat"><i class="fa fa-save" aria-hidden="true"></i> Adicionar Testemunha</button>
                <button @click="toggleEdicao(false)" tooltip="Cancela Procedimento" type="button" class="btn btn-warning btn-flat"><i class="fa fa-close" aria-hidden="true"></i> Cancelar </button>
          </div>
        </div>
        <div v-if="this.gravando" class="column all-centered testemunha-cadastro-container">
            Gravando... <i class="fa fa-refresh fa-spin" aria-hidden="true"></i>
        </div>
        <div v-if="this.carregando" class="column all-centered testemunha-cadastro-container">
            Carregando Testemunhas Cadastradas... <i class="fa fa-refresh fa-spin" aria-hidden="true"></i>
        </div>
    </div>
</template>
<script>
    import CpfValidator from '../i18n/cpf.validator'
    export default {
      name: 'testemunhas',
      data () {
        return {
          carregando: false,
          editando: false,
          gravando: false,
          cpfInvalido: false,
          emailInvalido: false,
          testemunhaEdicao: {
            id: null,
            nome: '',
            cpf: '',
            email: ''
          },
          table: {
            items: this.testemunhasCadastradas,
            filter: null,
            hover: true,
            bordered: true,
            currentPage: 1,
            perPage: 50,
            fields: [
              {key: 'nome', label: 'Nome', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
              {key: 'cpf', label: 'CPF', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
              {key: 'email', label: 'E-mail', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
              {key: 'actions', label: 'Ações', sortable: true, thStyle: 'text-align: center', class: 'text-center'}
            ]
          },
          testemunhasCadastradas: []
        }
      },
      props: ['idProposta'],
      watch: {
      },
      computed: {
      },
      mounted () {
        this.buscarTestemunhasCadastradas()
      },
      methods: {
        toggleEdicao (valor) {
          this.editando = valor
          this.cpfInvalido = false
          this.emailInvalido = false
          this.testemunhaEdicao = {
            id: null,
            nome: '',
            cpf: '',
            email: ''
          }
        },
        adicionarTestemunha () {
          this.gravando = true
          if (this.testemunhasCadastradas.length === 2) {
            this.$snotify.clear()
            this.$snotify.error('Número de testemunhas máximo já encontra-se cadastrado. Favor Verificar.')
            this.gravando = false
            return
          }
          if (!this.verificaCampos()) {
            this.gravando = false
            return
          }
          this.$snotify.clear()
          this.$snotify.async('Gravando testemunha...', {timeout: 0})
          this.gravaTestemunha()
        },
        excluirItem (item, index) {
          this.$snotify.clear()
          this.$snotify.async('Excluindo testemunha...', {timeout: 0})
          if (item.id !== null) {
            this.gravando = true
            this.excluiTestemunha(item)
          }
          this.table.items.splice(index, 1)
          this.testemunhasCadastradas = this.table.items
          this.$forceUpdate()
        },
        verificaTestemunhasCadastradas () {
          if (this.testemunhasCadastradas.length < 2) {
            this.$snotify.error('Cadastre ao menos duas testemunhas para assinatura do contrato antes de continuar.')
            return false
          }
          return true
        },
        validaCPF () {
          let cpfCheck = CpfValidator.validate(this.testemunhaEdicao.cpf)
          if (!cpfCheck) {
            this.cpfInvalido = true
          } else {
            this.cpfInvalido = false
          }
        },
        validaEmail () {
          const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (regex.test(this.testemunhaEdicao.email)) {
            this.emailInvalido = false
          } else {
            this.emailInvalido = true
          }
        },
        verificaCampos () {
          this.$snotify.clear()
          // TODO - Verificar se CPF já existe na lista
          // this.testemunhaEdicao.cpf existe em this.testemunhasCadastradas
          let cpfExistente = this.testemunhasCadastradas.some(testemunha => testemunha.cpf === this.testemunhaEdicao.cpf)
          if (cpfExistente) {
            this.$snotify.error('CPF já cadastrado para esta proposta. Favor Verificar.')
            return false
          }
          if (this.cpfInvalido) {
            this.$snotify.error('CPF inválido. Favor Verificar.')
            return false
          }
          if (this.emailInvalido) {
            this.$snotify.error('Informe um e-mail válido. Favor Verificar.')
            return false
          }
          if (this.testemunhaEdicao.nome === '') {
            this.$snotify.error('Preencha o nome antes de continuar. Favor Verificar.')
            return false
          }
          if (this.testemunhaEdicao.cpf === '') {
            this.$snotify.error('Preencha o CPF antes de continuar. Favor Verificar.')
            return false
          }
          if (this.testemunhaEdicao.email === '') {
            this.$snotify.error('Preencha o E-MAIL antes de continuar. Favor Verificar.')
            return false
          }
          if (this.testemunhaEdicao.email === '') {
            this.$snotify.error('Preencha o E-MAIL antes de continuar. Favor Verificar.')
            return false
          } else if (!this.testemunhaEdicao.email.includes('@')) {
            this.$snotify.error('Informe um e-mail válido. Favor Verificar.')
            return false
          }
          return true
        },
        async gravaTestemunha () {
          if (this.testemunhaEdicao.id !== null) {
            return
          }
          let obj = {
            idProposta: this.idProposta,
            nome: this.testemunhaEdicao.nome,
            cpf: this.testemunhaEdicao.cpf,
            email: this.testemunhaEdicao.email
          }
          await axiosLaravel.post('/testemunha/gravaTestemunha/', obj).then((response) => {
            this.$snotify.clear()
            this.testemunhaEdicao.id = response.data.id
            this.$snotify.success(response.data.message)
            console.log(response.data)
            this.testemunhasCadastradas.push(this.testemunhaEdicao)
            this.table.items = this.testemunhasCadastradas
            this.gravando = false
            this.toggleEdicao(false)
            this.$forceUpdate()
          })
          .catch((error) => {
            this.gravando = false
            this.$snotify.clear()
            console.error(error)
          })
        },
        async buscarTestemunhasCadastradas () {
          console.log('BUSCANDO TESTEMUNHA')
          this.carregando = true
          await axiosLaravel.get('/testemunha/getTestemunha/' + this.idProposta).then((response) => {
            this.testemunhasCadastradas = response.data
            this.table.items = this.testemunhasCadastradas
            this.carregando = false
            console.log('BUSCANDO TESTEMUNHA', this.testemunhasCadastradas)
            this.$forceUpdate()
          })
          .catch((error) => {
            this.carregando = false
            this.$snotify.clear()
            console.error(error)
          })
        },
        async excluiTestemunha (item) {
          if (item.id === null) {
            return
          }
          await axiosLaravel.post('/testemunha/excluiTestemunha/' + item.id).then((response) => {
            this.$snotify.clear()
            this.$snotify.success(response.data)
            this.gravando = false
            this.$forceUpdate()
          })
          .catch((error) => {
            this.gravando = false
            this.$snotify.clear()
            console.error(error)
          })
        }
      }
    }
  </script>
  
  <style>
    .linha_ocultada {
      display: none;
    }
    .testemunha-container {
        width: 100%;
        gap: 10px;
    }
    .testemunha-cadastro-container {
        width: 100%;
        gap: 10px;
        padding: 30px;
        background-color: #F5F5F5;
    }
    .testemunha-form {
        width: 100%;
        gap: 10px;
    }
    .testemunha-label {
        width: 100px;
        text-align: left !important;
    }
    .testemunha-input {
        width: 40% !important; 
    }
    .testemunha-botao {
        margin-top: 10px;
        padding: 0px 20px;
        width: 100%;
    }
    .campo-invalido {
      border: 1px solid red !important;
    }
    .span-invalido {
      color: red;
      font-weight: 700;
      font-size: 1.5rem;
    }
  </style>