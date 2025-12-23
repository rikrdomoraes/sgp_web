<template xmlns:text-align="http://www.w3.org/1999/xhtml">
  <aside class="main-sidebar" >
    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar" style="overflow-y: auto; height:100vh; padding-bottom: 100px">
      <!--&lt;!&ndash; Sidebar user panel &ndash;&gt;-->
      <!--<div class="user-panel">-->
      <!--<div class="pull-left image">-->
      <!--<img src="/static/img/user2-160x160.jpg" class="img-circle" alt="User Image">-->
      <!--</div>-->
      <!--<div class="pull-left info">-->
      <!--<p>Alexander Pierce</p>-->
      <!--<a href="#"><i class="fa fa-circle text-success"></i> Online</a>-->
      <!--</div>-->
      <!--</div>-->
      <!-- search form -->
      <form action="#" method="get" class="sidebar-form">
        <!-- Retira pesquis de MENU<div class="input-group">
          <input type="text" name="q" class="form-control" placeholder="Pesquisar...">
          <span class="input-group-btn">
              <button type="submit" name="search" id="search-btn" class="btn btn-flat"><i class="fa fa-search"></i>
              </button>
            </span>
        </div> -->
      </form>
      <!-- /.search form -->
      <!-- sidebar menu: : style can be found in sidebar.less -->
      <ul class="sidebar-menu">
        <li style="text-align:center" class="header">SGP - MENU</li>
        <li>
          <router-link :to="rota" @click="validaRota">
            <i class="fa fa-home"></i> <span>Inicial</span>
          </router-link>
        </li>
        <!--Cadastro-->
        <li class="treeview" data-widget="tree" v-if="this.$root.authorize('perfil-visualizar')">
          <a href="#">
            <i class="fa fa-folder"></i>
            <span>Cadastro</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li>
              <!--<router-link :to="{name: 'cadastro-acoes-lista' }" v-if="this.$root.authorize('permissao-visualizar')"><i class="fa fa-angle-right"></i> Ações e proprietário</router-link>-->
            </li>
            <li>
              <!-- 66108 - Atualizacao de acesso ao link dos editais -->
              <!-- <router-link :to="{name: 'cadastro-editais-lista'}" v-if="this.$root.authorize('edital-visualizar') && _.includes([341865, 341852, 341856], usuarioLogado.dadosBB.uor)"><i class="fa fa-angle-right"></i> Editais</router-link> -->
              <router-link :to="{name: 'cadastro-editais-lista'}" v-if="this.usuarioLogado.userType === 'FUNDACAO'"><i class="fa fa-angle-right"></i> Editais</router-link>
            </li>
            <li>
              <router-link :to="{name: 'cadastro-entidade-lista'}" v-if="this.$root.authorize('entidade-visualizar|entidade-visualizar-por-mim')"><i class="fa fa-angle-right"></i> Entidades</router-link>
            </li>
            <li>
              <router-link :to="{name: 'cadastro-fep-lista'}" v-if="this.$root.authorize('fav-editar')"><i class="fa fa-angle-right"></i> FEP</router-link>
            </li>
            <li>
              <router-link :to="{name: 'cadastro-formulario'}" v-if="this.$root.authorize('ged-editar')"><i class="fa fa-angle-right"></i> Formulários</router-link>
            </li>
            <li>
              <router-link :to="{name: 'cadastro-ged'}" v-if="this.$root.authorize('ged-editar')"><i class="fa fa-angle-right"></i> GED</router-link>
            </li>
            <li>
              <router-link :to="{name: 'cadastro-motivos-lista'}" v-if="this.$root.authorize('motivo-devolucao-criar')"><i class="fa fa-angle-right"></i> Motivos de Devolução (Gepac)</router-link>
            </li>
            <li>
              <router-link :to="{name: 'lista-articulacoes'}" v-if="this.$root.authorize('ged-editar')"><i class="fa fa-angle-right"></i> Parcerias Estratégicas</router-link>
            </li>
            <li v-if="false">
              <router-link :to="{name: 'cadastro-parceiro-estrategico-lista'}" v-if="this.$root.authorize('parceiro-estrategico-visualizar')"><i class="fa fa-angle-right"></i> Parceiros Estratégicos</router-link>
            </li>
            <li>
              <!--<router-link :to="{name: 'cadastro-perfis-lista'}" v-if="this.$root.authorize('perfil-visualizar')"><i class="fa fa-angle-right"></i> Perfis</router-link>-->
              <a :href="this.$store.state.laravelurl + '/nova/resources/perfils'" target="_blank" v-if="this.$root.authorize('permissao-editar')"><i class="fa fa-angle-right"></i> Perfis</a>
            </li>
            <li>
              <a :href="this.$store.state.laravelurl + '/nova/resources/permissaos'" target="_blank" v-if="this.$root.authorize('permissao-editar')"><i class="fa fa-angle-right"></i> Permissões</a>
              <!--<router-link :to="{name: 'cadastro-permissoes-lista' }" v-if="this.$root.authorize('permissao-visualizar')"><i class="fa fa-angle-right"></i> Permissões</router-link>-->
            </li>
            <li>
              <a :href="this.$store.state.laravelurl + '/nova/resources/tipo-documentos'" target="_blank" v-if="this.$root.authorize('permissao-editar')"><i class="fa fa-angle-right"></i> Tipos de documentos</a>
              <!--<router-link :to="{name: 'cadastro-documentos-lista'}" v-if="this.$root.authorize('tipo-documento-visualizar')"><i class="fa fa-angle-right"></i> Tipos de documentos</router-link>-->
            </li>
            <li>
              <a :href="this.$store.state.laravelurl + '/nova/resources/users'" target="_blank" v-if="this.$root.authorize('permissao-editar')"><i class="fa fa-angle-right"></i> Usuários</a>
              <!--<router-link :to="{name: 'cadastro-usuarios'}" v-if="this.$root.authorize('usuario-agencia-visualizar|usuario-fundacao-visualizar|usuario-entidade-visualizar|usuario-estrategico-visualizar|usuario-superintendencia-visualizar|usuario-entidade-visualizar-por-mim|usuario-estrategico-visualizar-por-mim|usuario-superintendencia-visualizar-por-mim|usuario-fundacao-visualizar-por-mim|usuario-agencia-visualizar-por-mim')"><i class="fa fa-angle-right"></i> Usuários</router-link>-->
            </li>
            <li>
              <router-link :to="{name: 'lista-sumario-executivo'}" v-if="this.$root.authorize('ged-editar')"><i class="fa fa-angle-right"></i> Sumário Executivo</router-link>
            </li>
            <li>
              <router-link :to="{name: 'projetos-usuarios'}" v-if="this.usuarioLogado.userType === 'FUNDACAO'"><i class="fa fa-angle-right"></i> Usuários por Projeto</router-link>
            </li>
            <li>
              <router-link :to="{name: 'lista-ocorrencias'}" v-if="this.usuarioLogado.userType === 'FUNDACAO'"><i class="fa fa-angle-right"></i> Ocorrências</router-link>
            </li>
            <!-- 69906 - ODS -->
            <li>
              <router-link :to="{name: 'lista-ods-fundacao'}" v-if="this.usuarioLogado.userType === 'FUNDACAO'"><i class="fa fa-angle-right"></i> ODS </router-link>
            </li>
            <li>
              <router-link :to="{name: 'lista-cotacao-automatica-excecoes'}" v-if="this.usuarioLogado.userType === 'FUNDACAO'"><i class="fa fa-angle-right"></i> Cotação Automática </router-link>
            </li>
            <li>
              <router-link :to="{name: 'propostas-simplificadas'}" v-if="this.usuarioLogado.userType === 'FUNDACAO'"><i class="fa fa-angle-right"></i> Processo Simplificado </router-link>
            </li>
            <!--<li>-->
              <!--<router-link :to="{name: 'cadastro-simplificado-lista'}" v-if="this.$root.authorize('edital-visualizar')"><i class="fa fa-angle-right"></i> Processo Simplificado</router-link>-->
            <!--</li>-->
          </ul>
        </li>

        <!--Dados cadastrais Entidade-->
        <li v-if="_.get(usuarioLogado, 'entidade.id', 0) !== 1439"> <!-- Usuários ligados a "entidade" FBB (1439) não tem acesso a esta opção (chamado 68455) -->
          <router-link :to="{name: 'cadastro-entidade-edita', params: { id: usuarioLogado.entidade.id}}" v-if="this.$root.authorize('minha-entidade-visualizar')">
            <i class="fa fa-file-text-o"></i> <span>Dados Cadastrais</span>
          </router-link>
        </li>

        <!--GED Parceiro Estratégico-->
        <li>
          <router-link :to="{name: 'cadastro-ged'}" v-if="this.$root.authorize('ged-editar') && usuarioLogado.strategicPartner">
            <i class="fa fa-file-text-o"></i> <span>GED</span>
          </router-link>
        </li>

        <!--Dados cadastrais Parceiro estratégico-->
        <li>
          <router-link v-if="this.$root.authorize('meu-parceiro-estrategico-visualizar')" to="/dashboard">
            <i class="fa fa-money"></i> <span>Dados Cadastrais</span>
          </router-link>
        </li>

        <!--Proposta-->
        <li v-if="_.get(usuarioLogado, 'entidade.id', 0) !== 1439 || usuarioLogado.userType === 'FUNDACAO' || (usuarioLogado.userType !== 'FUNDACAO' && !_.isEmpty(propostas))"> <!-- Usuários ligados a "entidade" FBB (1439) não tem acesso a esta opção (chamado 68455), usuários FBB sempre tem acesso e usuários não FBB que tenham proposta tem acesso -->
          <router-link :to="{name: 'proposta-lista'}" v-if="this.$root.authorize('proposta-visualizar-por-mim|proposta-visualizar')"><i class="fa fa-list-alt"></i> <span>Propostas</span></router-link>
        </li>
        <li v-if="_.get(usuarioLogado, 'entidade.id', 0) !== 1439 || (usuarioLogado.userType !== 'FUNDACAO' && !_.isEmpty(propostas))"> <!-- Usuários ligados a "entidade" FBB (1439) não tem acesso a esta opção (chamado 68455) e usuários não FBB que tenham proposta tem acesso -->
          <router-link :to="{name: 'proposta-lista'}" v-if="this.$root.authorize('minha-proposta-visualizar')"><i class="fa fa-list-alt"></i> <span>Minhas propostas</span></router-link>
        </li>

        <!--Projetos-->
        <li v-if="usuarioLogado.userType === 'FUNDACAO' || (usuarioLogado.userType !== 'FUNDACAO' && !_.isEmpty(projetos))"> <!-- Usuários FBB sempre tem aceso e usuários não FBB se tiverem projeto terão acesso -->
          <router-link :to="{name: 'lista-projetos'}" v-if="this.$root.authorize('projeto-visualizar|projeto-visualizar-por-mim|meu-projeto-visualizar')"><i class="fa fa-rocket"></i><span> Projetos</span></router-link>
        </li>

        <!--Solicitações-->
        <li v-if="usuarioLogado.userType === 'FUNDACAO' || (usuarioLogado.userType !== 'FUNDACAO' && !_.isEmpty(projetos))">
          <router-link :to="{name: 'solicitacao-lista'}" v-if="this.$root.authorize('solicitacao-pagamento-editar|solicitacao-contrapartida-editar|solicitacao-adiantamento-editar|solicitacao-prestacaocontas-editar|solicitacao-devolucaoadiantamento-editar')"><i class="fa fa-money"></i> <span>Solicitações</span></router-link>
        </li>
        <!--Solicitações-->
        <li v-if="usuarioLogado.userType === 'FUNDACAO' || (usuarioLogado.userType !== 'FUNDACAO' && !_.isEmpty(projetos) && prestacaoSimplificada)">
          <router-link :to="{name: 'prestacao-contas-simplificada'}" v-if="this.$root.authorize('solicitacao-pagamento-editar|solicitacao-contrapartida-editar|solicitacao-adiantamento-editar|solicitacao-prestacaocontas-editar|solicitacao-devolucaoadiantamento-editar')"><i class="fa fa-calculator"></i> <span>Prestação de Contas</span></router-link>
        </li>

        <!--Validação-->
        <li class="treeview"  data-widget="tree"  v-if="this.$root.authorize('entidade-validar|pre-analise-primeira-aprovacao-validar|pre-analise-segunda-aprovacao-validar|aceite-proposta-validar|analise-aprovacao-validar|analise-pendencia-aprovacao-validar|deferimento-aprovacao-validar|preparacao-documentos-aprovacao-validar|formalizacao-projetos-aprovacao-validar|relatorio-execucao-aprovar-envio|relatorio-execucao-aprovar-pendencia|solicitacao-pagamento-analisar|solicitacao-pagamento-acompanhar|solicitacao-contrapartida-analisar|solicitacao-adiantamento-analisar|solicitacao-adiantamento-aprovar|solicitacao-adiantamento-analisefinanceira|solicitacao-devolucaoadiantamento-analisar|solicitacao-devolucaoadiantamento-analisefinanceira|solicitacao-prestacaocontas-analisar|solicitacao-prestacaocontas-analisefinanceira|parceiro-estrategico-validar')">
          <a href="#">
            <i class="fa fa-gavel"></i>
            <span>Validação</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li>
              <!--                <router-link :to="{name: 'validacao-entidade-lista'}" v-if="this.$root.authorize('entidade-validar')"><i class="fa fa-angle-right"></i> Entidades</router-link>-->
              <router-link :to="{name: 'validacao-solicitacoes-lista', params: {fase: parametroEnt} }" v-if="this.$root.authorize('entidade-validar')"><i class="fa fa-angle-right"></i> Entidades</router-link>
            </li>
            <!--<li>-->
              <!--<router-link :to="{name: 'validacao-solicitacoes-lista', params: {fase: parametroVi} }" v-if="this.$root.authorize('entidade-validar')"><i class="fa fa-angle-right"></i> Validação Inicial</router-link>-->
            <!--</li>-->
            <!--<li>-->
              <!--<router-link :to="{name: 'validacao-solicitacoes-lista', params: {fase: parametroPar} }" v-if="this.$root.authorize('parceiro-estrategico-validar')"><i class="fa fa-angle-right"></i> Parceiro Estratégico</router-link>-->
            <!--</li>-->
          <!--Proposta-->
            <li>
              <router-link :to="{name: 'validacao-solicitacoes-lista', params: {fase: parametroProp} }" v-if="this.$root.authorize('pre-analise-primeira-aprovacao-validar|pre-analise-segunda-aprovacao-validar|aceite-proposta-validar|analise-aprovacao-validar|analise-pendencia-aprovacao-validar|deferimento-aprovacao-validar|preparacao-documentos-aprovacao-validar|formalizacao-projetos-aprovacao-validar')"><i class="fa fa-angle-right"></i> <span>Propostas</span></router-link>
            </li>
            <li>
              <router-link :to="{name: 'validacao-solicitacoes-lista', params: {fase: parametroRel} }" v-if="this.$root.authorize('relatorio-execucao-aprovar-envio|relatorio-execucao-aprovar-pendencia')"><i class="fa fa-angle-right"></i> Relatório de Execução</router-link>
            </li>
            <li>
              <router-link :to="{name: 'validacao-solicitacoes-financeiras-lista', params: {fase: parametroSol} }" v-if="this.$root.authorize('solicitacao-pagamento-analisar|solicitacao-pagamento-acompanhar|solicitacao-contrapartida-analisar|solicitacao-adiantamento-analisar|solicitacao-adiantamento-aprovar|solicitacao-adiantamento-analisefinanceira|solicitacao-devolucaoadiantamento-analisar|solicitacao-devolucaoadiantamento-analisefinanceira|solicitacao-prestacaocontas-analisar|solicitacao-prestacaocontas-analisefinanceira')"><i class="fa fa-angle-right"></i> Execução financeira</router-link>
            </li>
            <li>
              <router-link :to="{name: 'validacao-solicitacoes-lista', params: {fase: parametroAval} }" v-if="this.$root.authorize('relatorio-execucao-aprovar-envio|relatorio-execucao-aprovar-pendencia')"><i class="fa fa-angle-right"></i> Avaliação de projetos</router-link>
            </li>
            <li>
              <router-link :to="{name: 'validacao-solicitacoes-lista', params: {fase: parametroOco} }" v-if="this.$root.authorize('relatorio-execucao-aprovar-envio|relatorio-execucao-aprovar-pendencia')"><i class="fa fa-angle-right"></i> Ocorrências</router-link>
            </li>
            <li>
              <router-link :to="{name: 'validacao-solicitacoes-lista', params: {fase: parametroAltPrj} }" v-if="this.$root.authorize('relatorio-execucao-aprovar-envio|relatorio-execucao-aprovar-pendencia')"><i class="fa fa-angle-right"></i> Alterações de projetos</router-link>
            </li>
            <li>
              <router-link :to="{name: 'validacao-licencas', params: {fase: parametroLicAmb} }" v-if="this.$root.authorize('relatorio-execucao-aprovar-envio|relatorio-execucao-aprovar-pendencia')"><i class="fa fa-angle-right"></i> Licenciamento Ambiental</router-link>
            </li>
          </ul>
        </li>

        <!--Relatórios-->
        <li class="treeview" v-if="this.$root.authorize('usuario-agencia-configurar|usuario-fundacao-configurar|usuario-entidade-configurar|usuario-estrategico-configurar|usuario-superintendencia-configurar|entidade-configurar|proposta-configurar')">
          <a href="#">
            <i class="fa fa-file-text-o"></i>
            <span>Relatórios</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li>
              <router-link :to="{name: 'impressao-relatorio'}" v-if="this.$root.authorize('usuario-agencia-configurar|usuario-fundacao-configurar|usuario-entidade-configurar|usuario-estrategico-configurar|usuario-superintendencia-configurar|entidade-configurar|proposta-configurar')"><i class="fa fa-angle-right"></i> Relatórios da Proposta</router-link>
            </li>
            <!--<li>-->
              <!--<router-link :to="{name: 'relatorioBi'}" v-if="this.$root.authorize('usuario-agencia-configurar|usuario-fundacao-configurar|usuario-entidade-configurar|usuario-estrategico-configurar|usuario-superintendencia-configurar|entidade-configurar|proposta-configurar')"><i class="fa fa-angle-right"></i> BI</router-link>-->
            <!--</li>-->
            <li>
              <a href="https://app.powerbi.com/view?r=eyJrIjoiNTJiMzQ2OWItYWViOS00Yzk4LWIyYmQtMmY4NGIxMGE3MWIwIiwidCI6ImQ1MWI3ZWQ5LWUxOWMtNDBmNi04YmNkLWNiMzE2NmJiYmRiNiJ9" v-if="this.$root.authorize('solicitacao-ratificacao')" target="_blank"><i class="fa fa-external-link"></i> BI - Acompanhamento de E-mails</a>
            </li>
            <li>
              <a href="https://app.powerbi.com/reportEmbed?reportId=73af5b85-7b51-4eca-8254-f868f97e92a9&autoAuth=true&ctid=d51b7ed9-e19c-40f6-8bcd-cb3166bbbdb6" v-if="this.$root.authorize('solicitacao-ratificacao')" target="_blank"><i class="fa fa-external-link"></i> BI - Estatística de Processos</a>
            </li>
          </ul>
        </li>

        <!-- Processo de Geração, tratamento e comunicação de Remessas Eletrônicas de Pagamento -->
        <li class="treeview" v-if="this.$root.authorize('geracao-remessa-pagamento|movimento-diario|solicitacao-ratificacao|bi-baixa-prestacao')">
          <a href="#">
            <i class="fa fa-share-square-o"></i>
            <span>Remessa</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li v-if="ativaGeracaoRemessa">
              <router-link :to="{name: 'geracao-remessa'}" v-if="this.$root.authorize('geracao-remessa-pagamento')"><i class="fa fa-angle-right"></i> Geração de Remessa</router-link>
            </li>
            <li v-if="ativaGeracaoRemessa">
              <router-link :to="{name: 'tratamento-retorno'}" v-if="this.$root.authorize('geracao-remessa-pagamento')"><i class="fa fa-angle-right"></i> Tratamento de Retorno</router-link>
            </li>
            <li>
              <router-link :to="{name: 'movimento-diario'}" v-if="this.$root.authorize('movimento-diario')"><i class="fa fa-angle-right"></i> Movimento Diário</router-link>
            </li>
            <li>
              <router-link :to="{name: 'lista-ratificacao'}" v-if="this.$root.authorize('solicitacao-ratificacao')"><i class="fa fa-angle-right"></i> Ratificações</router-link>
            </li>
<li>
              <router-link :to="{name: 'lista-remessa-bndes'}" v-if="this.$root.authorize('controle_bndes_pagamentos')"><i class="fa fa-angle-right"></i> Remessas BNDES</router-link>
            </li>
            <li>
              <a href="https://app.powerbi.com/groups/efbe1097-2d5a-4fc5-8a59-89c9a4813220/reports/a18d45ee-0d4c-41e4-815b-333309f7e061/ReportSection?chromeless=1&experience=power-bi" v-if="this.$root.authorize('bi-baixa-prestacao')" target="_blank"><i class="fa fa-external-link"></i> BI - Baixa de Prestações</a>
            </li>
          </ul>
        </li>

        <!--Relatório ERP-->
        <li class="treeview" v-if="this.$root.authorize('relatorio-erp-novo|relatorio-erp-editar|relatorio-erp-excluir|relatorio-erp-visualizar|relatorio-erp-emissao')">
          <a href="#">
            <i class="fa fa-file-text"></i>
            <span>Relatórios ERP</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li>
              <router-link :to="{name: 'cadastro-relatorio'}" v-if="this.$root.authorize('relatorio-erp-visualizar|relatorio-erp-novo|relatorio-erp-editar|relatorio-erp-excluir')"><i class="fa fa-angle-right"></i> Cadastro</router-link>
            </li>
            <li>
              <router-link :to="{name: 'emite-relatorio'}" v-if="this.$root.authorize('relatorio-erp-emissao')"><i class="fa fa-angle-right"></i> Emissão</router-link>
            </li>
          </ul>
        </li>

        <li class="treeview" data-widget="tree" v-if="(usuarioLogado.userType === 'FUNDACAO' && $root.authorize('chamado-visualizar')) || (usuarioLogado.userType !== 'FUNDACAO' && !_.isEmpty(projetos))">
          <a href="#">
            <i class="fa fa-comments-o"></i>
            <span>Chamados</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li>
              <router-link :to="{name: 'abrir-chamado'}" v-if="this.$root.authorize('chamado-novo')"><i class="fa fa-angle-right"></i> Abrir Chamado</router-link>
            </li>
            <li>
              <router-link :to="{name: 'cadastro-chamado-lista'}" v-if="this.$root.authorize('chamado-visualizar')"><i class="fa fa-angle-right"></i> Listar Chamados</router-link>
            </li>
            <li>
              <router-link :to="{name: 'cadastro-assunto-lista'}" v-if="this.$root.authorize('chamado-visualizar-assunto')"><i class="fa fa-angle-right"></i> Gestão de Assuntos</router-link>
            </li>
            <li>
              <!--<a v-if="this.$root.authorize('chamado-relatorios')" target="_blank" href="https://app.powerbi.com/view?r=eyJrIjoiYTgzNWE1YzEtNzYxMi00MmM4LTk3NGQtOGFjMDE4YjVjYmE2IiwidCI6ImQ1MWI3ZWQ5LWUxOWMtNDBmNi04YmNkLWNiMzE2NmJiYmRiNiJ9"><i class="fa fa-angle-right"></i> Relatórios</a>-->
              <!--<a v-if="this.$root.authorize('chamado-relatorios')" target="_blank" href="https://app.powerbi.com/groups/d232807b-4597-4e36-bd39-ed117e8c7769/reports/9e238fa9-3ffa-49d5-912f-8079c87a4b14/ReportSection?ctid=d51b7ed9-e19c-40f6-8bcd-cb3166bbbdb6"><i class="fa fa-angle-right"></i> Relatórios</a>-->
              <a v-if="this.$root.authorize('chamado-relatorios')" target="_blank" href="https://app.powerbi.com/groups/dbeb6ee0-e6c6-41c0-8c97-efb60233dead/reports/a954a7ac-ec89-4f83-91c1-ddd9cbe07202?ctid=d51b7ed9-e19c-40f6-8bcd-cb3166bbbdb6"><i class="fa fa-angle-right"></i> Relatórios</a>
            </li>
          <li>
              <a href="https://app.powerbi.com/reportEmbed?reportId=ae204754-3763-42cc-9a8c-32e84af1d36f&autoAuth=true&ctid=d51b7ed9-e19c-40f6-8bcd-cb3166bbbdb6" v-if="this.$root.authorize('chamado-visualizar')" target="_blank"><i class="fa fa-external-link"></i> BI - Chamados Encerrados</a>
            </li>
          </ul>
        </li>

        <!--Configurações-->
        <li class="treeview" v-if="this.$root.authorize('usuario-agencia-configurar|usuario-fundacao-configurar|usuario-entidade-configurar|usuario-estrategico-configurar|usuario-superintendencia-configurar|entidade-configurar|proposta-configurar')">
          <a href="#">
            <i class="fa fa-gears"></i>
            <span>Configurações</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li>
              <router-link :to="{name: 'conf-gerais'}" v-if="this.$root.authorize('usuario-agencia-configurar|usuario-fundacao-configurar|usuario-entidade-configurar|usuario-estrategico-configurar|usuario-superintendencia-configurar|entidade-configurar|proposta-configurar')"><i class="fa fa-angle-right"></i> Configurações Gerais</router-link>
            </li>
            <li>
              <router-link :to="{name: 'gerenciamento-log'}" target="_blank" v-if="this.usuarioLogado.userType === 'FUNDACAO'"><i class="fa fa-angle-right"></i> Análise Logs</router-link>
            </li>
            <li>
              <router-link :to="{name: 'logs-email'}" v-if="this.$root.authorize('perfil-visualizar')"><i class="fa fa-angle-right"></i> Log de E-mails Enviados</router-link>
            </li>
          </ul>
        </li>

        <!--Manuais-->
        <li class="treeview" v-if="usuarioLogado.userType === 'FUNDACAO' || !_.isEmpty(projetos)">
          <router-link :to="{name: 'manuais'}">
            <i class="fa fa-newspaper-o"></i>
            <span>Manuais e Modelos</span>
          </router-link>
        </li>

        <!--Antigo SGP-->
        <li class="treeview" v-if="!usuarioLogado.strategicPartner && _.get(usuarioLogado, 'entidade.id', 0) !== 1439 && (usuarioLogado.userType === 'FUNDACAO' || (usuarioLogado.userType !== 'FUNDACAO' && !_.isEmpty(projetos)))"> <!-- Usuários ligados a "entidade" FBB (1439) não tem acesso a esta opção (chamado 68455) -->
          <a href="http://www.fbb.org.br/projetos/portal" target="_blank"><i class="fa fa-sign-out"></i>
          <span>Antigo SGP</span>
          </a>
        </li>

        <p v-show="loading.propostas || loading.projetos" class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando menu ...</p>


      </ul>
    </section>
    <!-- /.sidebar -->
  </aside>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'DashboardSidebar',
    data () {
      return {
        loading: {
          propostas: false,
          projetos: false
        },
        propostas: [],
        projetos: [],
        ativaGeracaoRemessa: true,
        prestacaoSimplificada: false,
        parametroRel: '',
        parametroSol: '',
        parametroProp: '',
        parametroEnt: '',
        parametroVi: '',
        parametroPar: '',
        parametroAval: '',
        parametroOco: '',
        parametroAltPrj: '',
        parametroLicAmb: '',
        rota: '/#/inicial'
      }
    },
    watch: {
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ]),
      validaRota () {
        //
        // Se for edital e for usuário de entidade, direciona ao preenchimento do Cadastro/Proposta
        //
        // if (this.usuarioLogado.entidade) {
        //   if (this.usuarioLogado.entidade.registerPhase === 'CREDENCIAMENTO' && this.usuarioLogado.userType === 'ENTIDADE' && this.usuarioLogado.entidade.status === 'INCOMPLETO') {
        //     this.rota = '/cadastro/entidades/entidadePropostaEdital'
        //     this.$forceUpdate()
        //   }
        // }
      }
    },
    async created () {
      this.parametroRel = 'RELATORIO_DE_EXECUCAO'
      this.parametroSol = 'SOLICITACOES'
      this.parametroProp = 'PROPOSTAS'
      this.parametroEnt = 'ENTIDADES'
      this.parametroAval = 'AVALIACOES'
      this.parametroVi = 'VALIDACAO_INICIAL'
      this.parametroPar = 'PARCEIRO_ESTRATEGICO'
      this.parametroOco = 'OCORRENCIAS'
      this.parametroAltPrj = 'ALTERACOES_PROJETO'
      this.parametroLicAmb = 'LICENCIAMENTO AMBIENTAL'
      if (this.usuarioLogado.userType === 'ENTIDADE') {
        await this.buscaPropostas()
        await this.buscaProjetos()
        // await this.buscaPropostaSimplificada()
      }
      // if (this.usuarioLogado.entidade.registerPhase === 'CREDENCIAMENTO' && this.usuarioLogado.userType === 'ENTIDADE') {
      //   this.$router.push({name: 'entidade-proposta-edital'})
      // }
    },
    methods: {
      // checaPropostas () {
      //   this.loading.propostas = true
      //   if (typeof Storage !== 'undefined') { // Ver se o browser suporta localStorage/sessionStorage. Se sim, guardará a lista de codigos de ocorrência (raramente muda) junto com um timestamp da ultima atualizacao
      //     let propostas = JSON.parse(window.localStorage.getItem('sgp-propostas'))
      //     let diferenca = Math.floor((((new Date()).getTime()) / 43200000) - ((_.get(propostas, 'atualizado', (new Date('2024-01-01')).getTime())) / 43200000)) // Calcula a diferenca em dias do timestamp de agora e do que foi gravadp no storage (que se não tiver ainda considera o inicio de 2023 para forçar atualização)
      //     if (diferenca >= 1 || _.isEmpty(propostas)) { // Se não tiver lista, ou lista vazia ou a lista estiver desatualizada (com mais de 1 dia).. atualiza ela
      //       axiosLaravel.get('tipo-ocorrencia/').then((response) => {
      //         this.propostas = response.data
      //         window.localStorage.setItem('codigos-ocorrencia', JSON.stringify({'atualizado': Math.floor((new Date()).getTime()), 'lista': this.propostas}))
      //         this.loading.propostas = false
      //         this.$forceUpdate()
      //       })
      //         .catch((error) => {
      //           this.loading.propostas = false
      //           if (error) {
      //             this.$root.trataErro(error)
      //           }
      //         })
      //     } else {
      //       this.propostas = propostas.lista
      //       this.loading.propostas = false
      //     }
      //   } else {
      //     this.buscaPropostas()
      //   }
      // },
      async buscaPropostas () {
        this.loading.propostas = true
        await axiosLaravel.get('propostas').then((response) => {
          this.propostas = response.data
          if (typeof Storage !== 'undefined') window.localStorage.setItem('propostas', JSON.stringify({'atualizado': Math.floor((new Date()).getTime()), 'lista': this.propostas}))
          this.loading.propostas = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.loading.propostas = false
            this.$root.trataErro(error)
          })
      },
      async buscaProjetos () {
        this.loading.projetos = true
        await axiosLaravel.get('projetos').then((response) => {
          this.projetos = response.data
          if (typeof Storage !== 'undefined') window.localStorage.setItem('projetos', JSON.stringify({'atualizado': Math.floor((new Date()).getTime()), 'lista': this.projetos}))
          this.loading.projetos = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.loading.projetos = false
            this.$root.trataErro(error)
          })
      },
      async buscaPropostaSimplificada () {
        console.log('buscaPropostaSimplificada')
        this.prestacaoSimplificada = false
        this.loading.propostas = true
        // Pega todas as propostas e verifica se estão no processo simplificado
        console.log(this.propostas)
        for (let i = 0; i < this.propostas.length; i++) {
          await axiosLaravel.get('prestacaoSimplificada/verificaPropostaSimplificadaMenu/' + this.propostas[i].id).then((response) => {
            console.log('response.data', response.data)
            if (response.data) {
              this.prestacaoSimplificada = true
            }
            this.loading.propostas = false
          })
            .catch((error) => {
              this.loading.propostas = false
              this.$root.trataErro(error)
            })
        }
      }
    }
  }
</script>
