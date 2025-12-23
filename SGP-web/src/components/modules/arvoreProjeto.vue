<template>
  <div>
    <div v-for="projeto in arvoreProjetos" class="tree-collapsed" style="cursor: pointer;">
      <i class="tree-branch-head fa fa-plus-square" style="margin-right: 0.2em;" @click="mostraFilhos(projeto)"></i>
      <span @click="selecionaPai(projeto)"
            :class="projetoSelecionado.projectNumber === projeto.projectNumber ? 'tree-selected': ''">
          {{projeto.projectNumber}} - {{projeto.projectName}}</span>
      <div v-for="filho in projeto.children" v-show="projeto.show" style="cursor: pointer;">
        <li @click="selecionaFilho(filho)" :class="projetoSelecionado.projectNumber === filho.projectNumber ? 'tree-selected': ''">
          <i class="fa fa-file"></i>
          {{filho.projectNumber}} - {{filho.projectName}}
        </li>
      </div>

    </div>
    <br>

  </div>
</template>

<script>
  export default {
    name: 'arvore-projeto',
    data () {
      return {
        projetos: [],
        projetoSelecionado: {},
        arvoreProjetos: [],
        projetoDuplicacao: {}
      }
    },
    mounted () {
      axios.get('proxy/project/project-tree/list').then((response) => {
        this.arvoreProjetos = response.data.value
        this.arvoreProjetos.forEach((projeto) => {
          projeto.show = false
        })
      })
        .catch((error) => {
          console.log(error)
          this.$root.trataErro(error)
        })
    },
    methods: {
      mostraFilhos (projeto) {
        projeto.show = !projeto.show
        this.$forceUpdate()
      },
      selecionaPai (projeto) {
        delete projeto.show
        this.projetoSelecionado = projeto
        this.$emit('selecionaProjeto', projeto)
      },
      selecionaFilho (filho) {
        this.projetoSelecionado = filho
        this.$emit('selecionaProjeto', filho)
      }
    }
  }
</script>

<style scoped>
  li { list-style-type: none; padding-left: 20px}
  .tree-selected {
    background-color: #aaddff;
    font-weight: bold;
  }
</style>
