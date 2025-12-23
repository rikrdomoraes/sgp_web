<template>


  <div class="box box-primary roteiro" v-if="propostas.length > 0">


    <div v-show="loadingShow" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
      <i class="fa fa-refresh fa-spin"></i>
    </div>


    <div class="box-header with-border">
      <h3 class="box-title">
        <i aria-hidden="true" class="fa fa-map-o"></i> Roteiro
      </h3>
    </div>
    <div class="box-body">
      <div class="row" v-for="proposta in propostas">

        <div class="col-md-7">

          <div class="proposta_dados">{{proposta.nome}}</div>

          <ol class="lista">

            <li v-for="passo in proposta.passos">

              <span class="passo">{{passo.texto}}</span><span :class="'situacao ' + passo.situacao_codigo">
                    {{passo.situacao}}
                    {{_.includes(['concluido', 'cancelado', 'atencao'], passo.situacao_codigo) ? ' em ' : ''}}
                    {{(passo.situacao_codigo === 'atencao' ? passo.termino : (_.includes(['concluido', 'cancelado'], passo.situacao_codigo) ? passo.termino : '')) | moment('DD/MM/YYYY')}}

                    <a v-if="passo.codigo === 'cadastro_entidade' && !(_.includes(['concluido', 'cancelado'], passo.situacao_codigo))" :href="'/cadastro/entidades/edita/' + usuarioLogado.entity.id" target="_blank"
                       :title="'<h5>Vá para ´Dados Cadastrais´ e complete o formulário</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'top', animation : 'perspective', distance:'1', size: 'large', arrow : true }">
                      <i class="fa fa-external-link"></i>
                    </a>

                    <a v-if="passo.codigo === 'proposta' && !(_.includes(['concluido', 'cancelado'], passo.situacao_codigo))" :href="'/proposta/edita/' + proposta.id" target="_blank"
                       :title="'<h5>Vá para a ´Minhas propostas´ e complete o formulário</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'top', animation : 'perspective', distance:'1', size: 'large', arrow : true }">
                      <i class="fa fa-external-link"></i>
                    </a>
                  </span>

              <p v-if="_.size(passo.info) > 0" class="informacao">{{passo.info}}</p>

            </li>

          </ol>
          <i>Atenção: A análise somente será iniciada quando o cadastro da entidade e a proposta forem concluídos</i>
        </div>


        <div class="col-md-5 lista_documentos">
          <span>Documentos para download:</span>
          <ul v-if="proposta.fk_edital === 3">
            <li><a :href="urlLaravel + '/docs/roteiro_voluntariado_2020_v1.pdf'">Roteiro para preenchimento da proposta  <i class="fa fa-download" aria-hidden="true"></i> </a></li>
            <li><a :href="urlLaravel + '/docs/memoria_calculo_voluntariado_2020_v1.xls'">Memória de Cálculo - Voluntariado 2020 <i class="fa fa-download" aria-hidden="true"></i> </a></li>
          </ul>
          <ul v-if="proposta.fk_edital === 4">
            <li><a :href="urlLaravel + '/docs/roteiro_pis_2020_v1.pdf'">Roteiro para preenchimento da proposta <i class="fa fa-download" aria-hidden="true"></i> </a></li>
            <li><a :href="urlLaravel + '/docs/memoria_calculo_pis_2020_v1.xls'">Memória de Cálculo - PIS 2020 <i class="fa fa-download" aria-hidden="true"></i> </a></li>
          </ul>
        </div>

      </div>
    </div>



    <g-button-ujarak v-show="false"
                     color="dark-primary"
                     @click.native="carregarPropostas()"
                     size="button--size-ss"
                     aria-haspopup="true"
                     aria-expanded="false">
      <i class="fa fa-search" aria-hidden="true"></i> Atualizar
    </g-button-ujarak>



  </div>



</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'visualiza-roteiro',
    data () {
      return {
        loadingShow: false,
        propostas: []
      }
    },
    watch: {
    },
    computed: {
      ...mapGetters([
        'usuarioLogado',
        'urlLaravel'
      ])
    },
    mounted () {
    },
    created () {
      this.carregarPropostas()
    },
    methods: {
      carregarPropostas () {
        let idEntidade = _.has(this.usuarioLogado.entidade, 'id') ? this.usuarioLogado.entidade.id : (!_.isNull(this.usuarioLogado.fk_entidade) ? this.usuarioLogado.fk_entidade : null)
        this.loadingShow = true
        if (!_.isNull(idEntidade)) {
          axiosLaravel.post('roteiro/contratacao', {'id_entidade': idEntidade}).then((response) => {
            console.log('roteiro/contratacao', response.data)
            this.propostas = response.data
            this.loadingShow = false
          })
            .catch((error) => {
              this.$root.trataErro(error)
              this.loadingShow = false
            })
        }
      }
    }
  }
</script>

<style>
  .roteiro {
    width: 100%;
  }

  .roteiro .lista {
    width: 100%;
    margin-left: 20px;
    font-size: 16px;
    line-height: 35px;
  }

  .roteiro .proposta_dados {
    color: cornflowerblue;
    font-size: 20px;
  }

  .roteiro .passo {
    padding: 10px 10px 10px 0px;
  }

  .roteiro .lista .fa-external-link {
    padding-left: 8px;
    font-weight: bold;
  }

  .roteiro .informacao {
    margin-left: 20px;
    color: #808080;
  }

  .roteiro .situacao {
    font-size: 16px;
    padding-left: 10px;
  }

  .roteiro .situacao.concluido {
    color: #2e7d32;
  }

  .roteiro .situacao.pendente {
    color: #808080;
  }

  .roteiro .situacao.atencao {
    color: #c62828;
  }

  .roteiro .situacao.executando {
    color: #1565c0;
  }

  .roteiro .situacao.cancelado {
    color: #808080;
    /*background: orange;*/
    /*border-radius: 10px;*/
    /*color: white;*/
    /*padding: 2px;    */
  }

  .roteiro ol {
    list-style: none;
    counter-reset: li
  }

  .roteiro ol li::before {
    content: counter(li);
    color: #8fb6d8;
    display: inline-block;
    width: 1em;
    margin-left: -1em;
  }

  .roteiro ol li {
    counter-increment: li
  }

  .roteiro .lista_documentos {
    font-size: 16px;
    line-height: 35px;
  }
</style>
