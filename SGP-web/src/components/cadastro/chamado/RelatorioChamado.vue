<template>
      <div class="content-wrapper" style="min-height: 870px;">

        <vue-headful :title="'SGP - Chamados - Relatório'"/>

          <div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
          <section class="content-header ng-scope">
            <h1>Chamados</h1>
            <b-breadcrumb :items="[{
            text: 'Inicial',
            href: '/'
            }, {
            text: 'Relatório',
            href: '#'
            }, {
            text: 'Chamados',
            active: true
            }]"/>
          </section>

          <!-- main content -->
            <section class="content ng-scope">
              <div class="row">
                <div class="col-md-12">
                  <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
                      <div id="painel" > <!-- style="height:1000px; width:1000px" -->
                        <iframe style="height:800px; width:9000px;" :src="link" :key="" frameborder="0" allowfullscreen="true"></iframe>
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
    import { mapGetters } from 'vuex'
    export default {
      name: 'relatorio-chamado',
      data () {
        return {
          loading: {
            show: false
          },
          link: 'https://app.powerbi.com/view?r=eyJrIjoiYzU0MzNhNzctNmI1YS00MTU0LTkxZDAtMmVlOGI1ODIyOTIzIiwidCI6ImQ1MWI3ZWQ5LWUxOWMtNDBmNi04YmNkLWNiMzE2NmJiYmRiNiJ9'
        }
      },
      computed: {
        ...mapGetters([
          'usuarioLogado'
        ])
      },
      mounted () {
        this.link = 'https://app.powerbi.com/view?r=eyJrIjoiYzU0MzNhNzctNmI1YS00MTU0LTkxZDAtMmVlOGI1ODIyOTIzIiwidCI6ImQ1MWI3ZWQ5LWUxOWMtNDBmNi04YmNkLWNiMzE2NmJiYmRiNiJ9'
        this.$forceUpdate()
      },
      created () {
      },
      methods: {
      }
    }
</script>

<style scoped>

</style>
