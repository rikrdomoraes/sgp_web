<template>
    <div class="scroll-nav">
        <div class="row-flex centered-between">
            <div class="row-flex all-centered scroll-nav__row">
                <input
                      v-model.trim="query"
                      @input="onInput"
                      @keyup.enter="onEnterFromInput"
                      class="scroll-nav__input"
                      type="text"
                      placeholder="Ir para…"
                        />

                        <!-- Dropdown de sugestões -->
                        <div
                          class="scroll-nav__suggestions"
                          v-if="isSuggestOpen && suggestions.length"
                        >
                          <ul class="scroll-nav__suggestions-list">
                            <li
                                  v-for="(item, i) in suggestions"
                                  :key="item.id"
                                  class="scroll-nav__suggestion"
                                  @mousedown.prevent="onSuggestionClick(item)"
                            >
                              <!-- <span class="scroll-nav__suggestion-id">#{{ item.id }}</span> -->
                              <span class="scroll-nav__suggestion-label">{{ item.label }}</span>
                            </li>
                          </ul>
                        </div>


                        <button class="scroll-nav__btn" @click="prev" :disabled="!hasPrev" :title="hasPrev ? '<h5> ir para: #' + ids[currentIndex - 1].id + '</h5>' : '' " v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }">
                          <i class="fa fa-arrow-up" aria-hidden="true"></i>
                        </button>
                        <button class="scroll-nav__btn" @click="next" :disabled="!hasNext" :title="hasNext ? '<h5> ir para: #' + ids[currentIndex + 1].id + '</h5>' : '' " v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }">
                          <i class="fa fa-arrow-down" aria-hidden="true"></i>
                        </button>
                        <button class="scroll-nav__btn-home" @click="home" title="<h5> Voltar ao início </h5>" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }">
                          <i class="fa fa-home" aria-hidden="true"></i>
                        </button>
            </div>
        </div>
    </div>
</template>
<script>
  export default {
    components: {
    },
    name: 'NavegadorProposta',
    data () {
      return {
        currentIndex: 0,
        query: '',
        io: null, // IntersectionObserver (opcional, auto-detectar seção atual)
        isSuggestOpen: false
      }
    },
    props: {
      ids: {
        type: Array,
        default: [{id: 'teste', label: 'Teste'}],
        required: true // IDs existentes no DOM (definidos por você)
      },
      offset: {
        type: String,
        default: 0 // compensação pra header fixo (px)
      },
      behavior: {
        type: String,
        default: 'smooth', // 'smooth' ou 'auto'
        validator: v => ['smooth', 'auto'].includes(v)
      }
    },
    computed: {
      hasPrev () {
        return this.currentIndex > 0
      },
      hasNext () {
        return this.currentIndex < this.ids.length - 1
      },
      suggestions () {
        const q = (this.query || '').trim().toLowerCase()
        if (!q) return []
        // busca por id ou label (aproximação simples)
        return this.ids
          .filter(x =>
            x.id.toLowerCase().includes(q) ||
            (x.label && x.label.toLowerCase().includes(q))
          )
          .slice(0, 8) // limita pra não crescer infinito
      }
    },
    created: function () {
      console.log('NAVEGADOR ON')
    },
    mounted: function () {
    },
    methods: {
      onInput () {
        this.isSuggestOpen = !!this.query && this.suggestions.length > 0
      },
      onSuggestionClick (item) {
        this.query = item.id
        this.isSuggestOpen = false
        this.$nextTick(() => this.goToQuery())
      },
      onEnterFromInput () {
        if (this.suggestions.length) {
          const first = this.suggestions[0]
          this.query = first.id
          this.isSuggestOpen = false
          this.$nextTick(() => this.goToQuery())
        } else {
          // fallback pro comportamento antigo
          this.isSuggestOpen = false
          this.goToQuery()
        }
      },
      getElById (id) {
        return document.getElementById(id)
      },
      scrollToId (id) {
        const el = this.getElById(id)
        if (!el) {
          // se o id não existe, só ignora
          return
        }
        const rect = el.getBoundingClientRect()
        const top = window.pageYOffset + rect.top - this.offset
        window.scrollTo({
          top,
          behavior: this.behavior
        })
        // atualiza índice se achar na lista
        const idx = this.ids.indexOf(id)
        if (idx !== -1) this.currentIndex = idx
      },
      home () {
        this.currentIndex = 0
        this.scrollToId(this.ids[this.currentIndex].id)
        this.query = this.ids[this.currentIndex].label
      },
      next () {
        if (!this.hasNext) return
        this.currentIndex += 1
        this.scrollToId(this.ids[this.currentIndex].id)
        this.query = this.ids[this.currentIndex].label
      },
      prev () {
        if (!this.hasPrev) return
        this.currentIndex -= 1
        this.scrollToId(this.ids[this.currentIndex].id)
        this.query = this.ids[this.currentIndex].label
      },
      goToQuery () {
        if (!this.query) return
        const id = this.query
        // match exato
        const exact = this.ids.find(x => x.id === id)
        if (exact) {
          this.scrollToId(exact.id)
          this.query = exact.label
          let index = this.ids.findIndex(x => x.id === exact.id)
          this.currentIndex = index
          return
        }
        // fallback: procura por prefixo no id
        const candidate = this.ids.find(x =>
          x.id.toLowerCase().startsWith(id.toLowerCase())
        )
        if (candidate) {
          this.scrollToId(candidate.id)
          this.query = candidate.label
          let index = this.ids.findIndex(x => x.id === candidate.id)
          this.currentIndex = index
        }
      },
      onKey (e) {
      // Evita brigar com inputs/textareas fora do painel
        const tag = (e.target && e.target.tagName) || ''
        const isTyping = ['INPUT', 'TEXTAREA'].includes(tag)
        if (isTyping && e.target !== this.$el.querySelector('.scroll-nav__input')) return
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          this.next()
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          this.prev()
        } else if (e.key === 'Enter') {
          if (document.activeElement === this.$el.querySelector('.scroll-nav__input')) {
            this.goToQuery()
          }
        }
      },
      setupObserver () {
        if (!('IntersectionObserver' in window)) return
        try {
          this.io = new IntersectionObserver(
            entries => {
                // pega o primeiro mais visível
              const visible = entries
                .filter(en => en.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
              if (visible && visible.target && visible.target.id) {
                const idx = this.ids.indexOf(visible.target.id)
                if (idx !== -1) this.currentIndex = idx
              }
            },
            {
              root: null,
              rootMargin: `-${this.offset}px 0px 0px 0px`, // compensa header
              threshold: [0.25, 0.5, 0.75] // diferentes níveis de visibilidade
            }
            )
            // observar todos os ids
          this.ids.forEach(id => {
            const el = this.getElById(id)
            if (el) this.io.observe(el)
          })
        } catch (e) {
          // suave se não rolar
          this.io = null
        }
      },
      teardownObserver () {
        if (this.io) {
          this.io.disconnect()
          this.io = null
        }
      }
    }
  }
</script>

<style scoped>
    .scroll-nav {
        margin-top: 2px;
        z-index: 9999;
    }
    
    .scroll-nav__row {
      gap: 5px;
    }
    
    .scroll-nav__input {
    width: 250px;
    height: 35px;
    border-radius: 5px;
    border: 1px solid #2d7dff;
    background: #FFFFFF;
    color: #555f70;
    font-size: 1.5rem;
    padding: 0 10px;
    outline: none;
    }
    
    .scroll-nav__btn {
    height: 32px;
    width: 32px;
    /* padding: 0 10px; */
    font-size: 1rem;
    border-radius: 8px;
    border: none;
    background: #2d7dff;
    color: #fff;
    cursor: pointer;
    }
    .scroll-nav__btn-home {
    height: 32px;
    width: 32px;
    /* padding: 0 10px; */
    font-size: 1.5rem;
    border-radius: 8px;
    border: none;
    background: #fbff2d;
    color: #1565C0;
    border: 2px solid #1565C0;
    cursor: pointer;
    }
    .scroll-nav__btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    }
    
    .scroll-nav__status {
    /* font-size: 12px; */
    opacity: 0.8;
    min-width: 70px;
    text-align: center;
    }
    .scroll-nav__row { 

  gap: 5px;

  position: relative;          /* importante pro dropdown posicionar */

}
 
.scroll-nav__suggestions {

  position: absolute;
  top: 36px;                   /* logo abaixo do input (input tem 32px) */
  left: 0;
  width: 250px;                /* igual ao input */
  font-size: 1rem;
  max-height: 220px;
  overflow-y: auto;
  border-radius: 8px;
  border: 1px solid #2d7dff;
  background: #FFFFFF;
  color: #555f70;
  z-index: 10000;
  box-shadow: 0 8px 18px rgba(0,0,0,.35);

}
 
.scroll-nav__suggestions-list {

  list-style: none;
  margin: 0;
  padding: 4px;

}
 
.scroll-nav__suggestion {

  display: flex;
  gap: 6px;
  align-items: center;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;

}
 
.scroll-nav__suggestion:hover {

  background: #ebebeb;

}
 
.scroll-nav__suggestion-id {

  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;

  opacity: .9;

}
 
.scroll-nav__suggestion-label {

  color: #3f3f3f;

  opacity: .85;

}

 
</style>