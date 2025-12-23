## Adiciona erro ao ErrorBag
    this.$validator.errors.add('arvore de projetos', 'campo Árvore de projetos é obrigatório')

## Datepicker padrão
    <datepicker v-model="filter.beginInactivateDate" input-class="form-control" :language="$datePickerPtBR" format="dd/MM/yyyy"></datepicker>

## Mascara para CNPJ
    <the-mask  v-model="nota.cep" name="cep" :mask="['##.###.###/####-##']" class="form-control"
                @blur="loadCityAndState" v-validate="'required'">
    </the-mask>
    
## Mascara para agência
    <the-mask v-model="analise.proposal.agencyNumber" name="agencia" class="form-control" :mask="['####-#']"
              v-validate="'required'"></the-mask> 
              
## Mascara para Conta corrente
    <the-mask v-model="analise.proposal.agencyCheckingAccount" name="conta corrente" class="form-control"
              v-validate="'required'" :mask="['###-#', '####-#', '#####-#', '######-#', '#######-#', '########-#', '#########-#']"></the-mask>
                 
## Exemplo de ToolTip
    v-tooltip.top="row.item.requestApprovalResult === 'APPROVED' ? 'Aprovado, na aprovação nota a nota!' : 'Encaminhado para análise, na aprovação nota a nota!'"
    
## Como pegar informações usuário logado
Primeiro precisamos fazer o import do Vuex
    
    import { mapGetters } from 'vuex'
Depois no 

    computed: {
          ...mapGetters([
            'usuarioLogado'
          ])
        },

## Como verificar a autorização do usuário logado
    v-if="this.$root.authorize('solicitacao-pagamento-acompanhar')"
