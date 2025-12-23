<template>
    <div class="content-wrapper" style="min-height: 870px;">

      <vue-headful :title="'SGP - Registro de Ocorrências'"/>

      <div>
        <section class="content-header">
          <h1>
            <span>Ocorrências</span>
          </h1>
          <b-breadcrumb :items="[{text: 'Inicial', href: '/'}, {text: 'Cadastro', href: '#'}, {text: 'Ocorrência', active: true}]"/>
        </section>

        <section class="content">

          <div class="row" id="listaOcorrencias">

            <div class="col-md-12">
              <div class="box box-primary">
                <edita-ocorrencias
                  :idProcesso="id"
                  :botaoVoltar="botaoVoltar"
                  @acaoOcorrencia="ocorrenciaSelecionada = $event"
                  @acaoProcessamento="loading.tela = true"
                  @acaoAguardando="loading.tela = false"
                  @acaoCancelar="$router.go(-1)"
                  @acaoOk="loading.tela = false">
                </edita-ocorrencias>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

  </template>


  <script>
    import { mapGetters } from 'vuex'
    import EditaOcorrencias from './EditaOcorrencias'
    export default {
      name: 'ListaOcorrencias',
      components: {
        EditaOcorrencias
      },
      data () {
        return {
          id: null,
          botaoVoltar: false,
          loading: {
            tela: false,
            detalhes: false
          }
        }
      },
      created () {
        this.id = this.$route.params.id || null
        this.botaoVoltar = _.get(this.$route.params, 'voltar', false)
      },
      watch: {
      },
      computed: {
        ...mapGetters([
          'usuarioLogado',
          'urlLaravel'
        ])
      },
      mounted: function () {
      },
      methods: {
      }
    }
  </script>

<style>
  .centralizado {
    text-align: center !important;
  }
  .botao_filtro {
    float: right !important;
  }
  .botao_filtro button {
    zoom: 0.7;
  }
  .botao_filtro .dropdown-menu {
    padding: 10px;
    width: max-content;
  }
  .botao_filtro li input, .botao_filtro li span {
    cursor: pointer;
  }
  .botao_filtro li span:hover {
    color: var(--cor-destaque-dark);
  }
  .limpar_filtro {
    font-size: small;
    color: var(--cor-fraca-dark);
    cursor: pointer;
    font-weight: normal;
  }
  .limpar_todos_filtros_processos {
    font-size: small;
    font-style: italic;
    color: var(--cor-destaque);
    cursor: pointer;
    float: right;
  }
  .limpar_todos_filtros_processos:hover, .limpar_filtro:hover {
    color: var(--cor-destaque-dark);
  }
  .limpar_todos_filtros_processos span i:nth-child(2), .limpar_filtro span i:nth-child(2) {
    font-size: x-small;
    left: 6px;
    top: 2px;
    color: tomato;
  }
</style>
