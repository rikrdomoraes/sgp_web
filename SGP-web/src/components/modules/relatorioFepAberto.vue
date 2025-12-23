<template>

  <div class="content-wrapper">

    <vue-headful v-if="fep.id" :title="'SGP - FEP ' + fep.id"/>

    <section class="content-header ng-scope">

      <h1 v-if="fep">Ficha de Enquadramento de Projetos  -  FEP  Nº  {{fep.ano}}/{{fep.numero}}
        <span :title="'<h5>Gera a FEP abaixo de forma resumida em Excel</h5>'"
              v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
              style="display: inline-block;">
          <download-excel
            :data="json_data"
            :meta="json_meta"
            type="xls"
            :fields="json_fields"
            :name="fepExcel">
            <g-button-ujarak color="primary" size="button--size-ss">
              <i class="fa fa-download" aria-hidden="true"></i>
            </g-button-ujarak>
          </download-excel>
        </span>
        <g-button-ujarak color="warning" size="button--size-ss" @click.native="imprimirRelatorio"><i class="fa fa-print" aria-hidden="true"></i>  Imprimir </g-button-ujarak>
        <g-button-ujarak color="success" size="button--size-ss" @click.native="salva"><i class="fa fa-print" aria-hidden="true"></i>  Salvar </g-button-ujarak>
        <g-button-ujarak color="error" @click.native="$router.push({ path: '/cadastro/fep' })" size="button--size-ss"><i class="fa fa-sign-out" aria-hidden="true"></i> Sair do relatório </g-button-ujarak>
      </h1>

      <b-breadcrumb :items="[{
            text: 'Validação',
            href: '/'
            }, {
            text: 'Propostas',
            href: '#'
            }, {
            text: 'FEP',
            active: true
            }]"/>
    </section>

    <!-- main content -->
    <section class="content ng-scope">

      <div class="row">

        <div id="relatorio_fep">

          <div class="col-md-12">

            <div class="box box-primary">
              <div>
                <div v-show="loading.show" class="overlay"
                     style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                  <i class="fa fa-refresh fa-spin"></i>
                </div>
                <table class="table">
                  <tr>
                    <td><img src="/static/img/logo-login.png" class="logo_relatorio"></td>
                    <td></td>
                    <td class="fep_titulo">
                      <div>Ficha de Enquadramento de projetos</div>
                      <div v-if="fep.id">FEP - Nº <span class="ressaltar titulo"> {{fep.ano}}/{{fep.numero}}</span></div>
                    </td>
                  </tr>
                  <!--<tr>-->
                    <!--<td><img src="/static/img/logo-login.png" class="logo_relatorio"></td>-->
                    <!--<td></td>-->
                    <!--<td class="fep_titulo">-->
                      <!--<div>Ficha de Enquadramento de projetos</div>-->
                      <!--<div v-if="fep.id">FEP - Nº <span class="ressaltar titulo"> {{fep.id}}</span></div>-->
                    <!--</td>-->
                  <!--</tr>-->
                </table>

                <!-- Dados do Projeto -->
                <div class="form-group box-body">
                  <div>
                    <label class="control-label">Dados do Projeto</label>
                  </div>
                  <div>
                    <table class="table table-condensed table-bordered table-striped">
                      <tbody>
                      <tr>
                        <td class="cabecalho required-fep">Título</td>
                        <td class="ressaltar">
                          <div class="required-field"
                               :class="{ 'has-error' : errors.first('nome projeto')}">
                            <input v-model="fep.nome_projeto" name="nome projeto" class="form-control"
                                   type="text" maxlength="255" v-validate="'required'">
                            <span v-if="errors.first('nome projeto')" class="label label-danger"> {{ errors.first('nome projeto') }}</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="cabecalho required-fep">Proponente</td>
                        <td class="ressaltar">
                          <div class="required-field"
                               :class="{ 'has-error' : errors.first('nome entidade')}">
                            <input v-model="fep.nome_entidade" name="nome entidade"
                                                       class="form-control" type="text" maxlength="255" v-validate="'required'">
                            <span v-if="errors.first('nome entidade')" class="label label-danger"> {{ errors.first('nome entidade') }}</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="cabecalho required-fep">CNPJ</td>
                        <td class="ressaltar">
                          <div class="required-field"
                               :class="{ 'has-error' : errors.first('cnpj_entidade')}">
                            <the-mask v-model="fep.cnpj_entidade" name="cnpj_entidade" v-validate="'required|min:14|max:14'"
                                      mask="##.###.###/####-##" class="form-control" type="text"
                                      maxlength="20"></the-mask>
                          </div>
                          <span v-if="errors.first('cnpj_entidade')" class="label label-danger"> {{ errors.first('cnpj_entidade') }}</span>
                        </td>
                      </tr>
                      <tr>
                        <td class="cabecalho required-fep"> Ano da Fep</td>
                        <td class="ressaltar">
                          <div class="required-field"
                               :class="{ 'has-error' : errors.first('Ano Fep')}">
                            <input type="number" v-model="fep.ano" name="Ano Fep"
                                   v-validate="'required|max:4'" min="1901">
                            <span v-if="errors.first('Ano Fep')" class="label label-danger"> {{ errors.first('Ano Fep') }}</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="cabecalho required-fep"> Número da Fep</td>
                        <td class="ressaltar">
                          <div class="required-field"
                               :class="{ 'has-error' : errors.first('Numero Fep')}">
                            <input type="number" v-model="fep.numero" name="Numero Fep"
                                   v-validate="'required|max:3'" min="0">
                            <span v-if="errors.first('Numero Fep')" class="label label-danger"> {{ errors.first('Numero Fep') }}</span>
                          </div>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Enquadramento na árvore de projetos -->
                <div class="form-group box-body">
                  <div>
                    <label class="control-label">Enquadramento na Árvore de Projetos</label>
                  </div>
                  <div>
                    <table class="table table-condensed table-bordered table-striped">
                      <tbody>
                      <tr>
                        <td class="cabecalho required-fep">Projeto Superior</td>
                        <td class="ressaltar">
                          <!--<the-mask v-model="fep.nr_projeto_duplicacao" name="nr_projeto_duplicacao"-->
                          <!--v-validate="'min:5|max:5'" mask="#####" class="form-control" type="text"-->
                          <!--maxlength="5"></the-mask>-->
                          <div class="required-field"
                               :class="{ 'has-error' : errors.first('Projeto Duplicação')}">
                            <select name="Projeto Duplicação" aria-hidden="true" class="form-control"
                                    v-model="fep.nr_projeto_duplicacao" v-validate="'required'">
                              <option value="5004">5004 / ADMINISTRATIVOS (INTERNOS)</option>
                              <option value="5006">5006 / COMUNICACAO INSTITUCIONAL</option>
                              <option value="5012">5012 / CONV. MESA/GM 055/2003 - 402258-0 - ENCERRADO 21-11-2008</option>
                              <option value="5013">5013 / CONV. MTE/GM 01/03 - 402.252-1 - ENCERRADO 31.7.2008</option>
                              <option value="5014">5014 / CONV. MTE/SE 01/02 - 56.569-5 - ENCERRADO/CONCLUÍDO 29-12-2005</option>
                              <option value="5015">5015 / CONV MTE/SENAES 15/2004 - 402.265-3 - ENCERRADO EM 31/12/2009</option>
                              <option value="5016">5016 / CONV. MTUR/Embratur 120/2003 - 402259-9 - ENCERRADO EM 26-12-2008</option>
                              <option value="5017">5017 / CONV MTUR 010/03 - 402.255-6 - ENCERRADO EM 31/12/2009</option>
                              <option value="5018">5018 / CONV. MDS/SAIP 004/2005 - 405314-1 - ENCERRADO EM 27-12-2007</option>
                              <option value="5020">5020 / ASSISTÊNCIA SOCIAL</option>
                              <option value="5021">5021 / DIVERSIDADE</option>
                              <option value="5022">5022 / OUTROS PROJETOS - ASSISTÊNCIA SOCIAL</option>
                              <option value="5024">5024 / BANCO DE TECNOLOGIAS SOCIAIS</option>
                              <option value="5025">5025 / BIO CONSCIÊNCIA </option>
                              <option value="5026">5026 / OUTROS PROJETOS - CIÊNCIA E TECNOLOGIA</option>
                              <option value="5030">5030 / PROJETO MEMÓRIA - MECENATO</option>
                              <option value="5033">5033 / AABB COMUNIDADE</option>
                              <option value="5034">5034 / BANCO NA ESCOLA</option>
                              <option value="5035">5035 / BB EDUCAR</option>
                              <option value="5036">5036 / ESCOLA CAMPEÃ</option>
                              <option value="5037">5037 / INCLUSÃO DIGITAL</option>
                              <option value="5038">5038 / EDUCAÇÃO - PROJETOS INDEPENDENTES</option>
                              <option value="5040">5040 / CRIANÇA E VIDA</option>
                              <option value="5041">5041 / OUTROS PROJETOS - SAÚDE</option>
                              <option value="5045">5045 / CADEIAS-APICULTURA</option>
                              <option value="5046">5046 / CADEIAS-ARTESANATO</option>
                              <option value="5047">5047 / CADEIAS-BIODIESEL</option>
                              <option value="5048">5048 / CADEIAS-CAJUCULTURA</option>
                              <option value="5049">5049 / CADEIAS-OVINOCAPRINOCULTURA</option>
                              <option value="5050">5050 / CADEIAS-FRUTICULTURA TROPICAL</option>
                              <option value="5051">5051 / CADEIAS-MANDIOCULTURA</option>
                              <option value="5052">5052 / CADEIAS-RESÍDUOS SÓLIDOS </option>
                              <option value="5053">5053 / CADEIAS-OUTRAS</option>
                              <option value="5055">5055 / TEMÁTICOS-AGRICULTURA FAMILIAR</option>
                              <option value="5056">5056 / TEMÁTICOS-ÁGUA DOCE</option>
                              <option value="5057">5057 / DRLS-BERIMBAU</option>
                              <option value="5058">5058 / TEMÁTICOS-HORTAS COMUNITÁRIAS</option>
                              <option value="5060">5060 / TEMÁTICOS-TECBOR - BORRACHA</option>
                              <option value="5061">5061 / DRLS-VALE DO URUCUIA</option>
                              <option value="5059">5059 / TEMÁTICOS-INCUBADORAS DE COOPERATIVAS </option>
                              <option value="5062">5062 / TEMÁTICOS-OUTROS</option>
                              <option value="5064">5064 / INDEPENDENTES-CONTRAP.FBB CONV.MESA/GM 055/2003</option>
                              <option value="5065">5065 / INDEPENDENTES-CONTRAP.FBB CONV.MTE/SENAES 15/2004</option>
                              <option value="5067">5067 / INDEPENDENTES-PROJ.TERRA CIDADÃ VILA VINTEM II</option>
                              <option value="5068">5068 / INDEPENDENTES-PROJETOS N</option>
                              <option value="15120">15120 / RP FBB PIS/BB - Agroindústria</option>
                              <option value="17160">17160 / RM FBB INSTITUTO VOTORANTIM PTAC IV</option>
                              <option value="15123">15123 / RP FBB AGROINDúSTRIA VOLUNTARIADO</option>
                              <option value="15126">15126 / RP FBB PIS/BB - Resíduos Sólidos</option>
                              <option value="15129">15129 / RP FBB RESíDUOS SóLIDOS VOLUNTARIADO</option>
                              <option value="15149">15149 / RM FBB BNDES RIO DOCE FS 2015 PTAC 06/2015 - Água</option>
                              <option value="17218">17218 / ACORDO COPASA PRO-MANANCIAIS</option>
                              <option value="6013">6013 / TEMÁTICOS-DESENVOLVIMENTO DE ECONOMIA SOLIDARIA</option>
                              <option value="5158">5158 / DRLS-SÃO BARTOLOMEU</option>
                              <option value="8588">8588 / DRLS-PDTIS MATA DOS COCAIS</option>
                              <option value="9370">9370 / RM FBB BNDES - CADEIAS - RESÍDUOS SÓLIDOS</option>
                              <option value="9372">9372 / RM FBB BNDES - CADEIAS - CAJUCULTURA</option>
                              <option value="9374">9374 / RM FBB BNDES - CADEIAS-MANDIOCULTURA</option>
                              <option value="8583">8583 / INDEPENDENTES-CONTRAPARTIDA FBB CONVÊNIO BID FUMIN BR - M1070</option>
                              <option value="5660">5660 / DRLS-OUTROS PROJETOS</option>
                              <option value="5661">5661 / TEMÁTICOS-VOLUNTARIADO</option>
                              <option value="5662">5662 / TEMÁTICOS-QUILOMBOLAS</option>
                              <option value="5668">5668 / CONVÊNIO MTE/SPPE/Codefat - 405.316-8 - ENCERRADO EM 31/12/2009</option>
                              <option value="5978">5978 / TEMÁTICOS-TECNOLOGIAS SOCIAIS</option>
                              <option value="6004">6004 / INDEPENDENTES-OUTROS</option>
                              <option value="5977">5977 / CADEIAS-AQUICULTURA E PESCA</option>
                              <option value="6010">6010 / TEMÁTICOS-AGROECOLOGIA</option>
                              <option value="6558">6558 / REAPLICAÇÃO DE TECNOLOGIAS SOCIAIS</option>
                              <option value="5144">5144 / DRLS-VALE DO RIO DOCE (WUF)</option>
                              <option value="5160">5160 / CONV. MTE/SENAES 03/2007 - 405.319-2</option>
                              <option value="5161">5161 / RM FBB BID-FUMIN-DRS OUTROS</option>
                              <option value="5189">5189 / DRLS-NOVOS TERRITÓRIOS</option>
                              <option value="5190">5190 / INDEPENDENTES-CONTRAPARTIDA FBB CONVÊNIO MTE/SENAES 003/2007</option>
                              <option value="8934">8934 / ACORDO BNDES - 5.585-9</option>
                              <option value="8940">8940 / INDEPENDENTES-CONTRAPARTIDA FBB CONVÊNIO BNDES</option>
                              <option value="10675">10675 / RM FBB BNDES - TEMÁTICOS - AGRICULTURA FAMILIAR</option>
                              <option value="9460">9460 / RM FBB BNDES - TEMÁTICOS - DESENV. DE ECONOMIA SOLIDÁRIA</option>
                              <option value="9462">9462 / RM FBB BNDES - CADEIAS - ARTESANATO</option>
                              <option value="9388">9388 / RM FBB BNDES-DRLS-PDTIS ENTORNOS DE GRANDES PROJETOS</option>
                              <option value="9393">9393 / RM FBB BNDES - REAPLICAÇÃO DE TECNOLOGIAS SOCIAIS</option>
                              <option value="9376">9376 / RM FBB BNDES - CADEIAS - APICULTURA</option>
                              <option value="9380">9380 / RM FBB BNDES-DRLS-VALE DO URUCUIA</option>
                              <option value="9382">9382 / RM FBB BNDES-DRLS-VALE DO RIO DOCE</option>
                              <option value="9384">9384 / RM FBB BNDES-DRLS-SÃO BARTOLOMEU</option>
                              <option value="9386">9386 / RM FBB BNDES-DRLS-PDTIS MATA DOS COCAIS</option>
                              <option value="11214">11214 / RM FBB BNDES-DRLS-OUTROS PROJETOS</option>
                              <option value="11291">11291 / TEMÁTICOS-PROJETOS INOVADORES</option>
                              <option value="11293">11293 / TEMÁTICOS-PRESERVAÇÃO DE BIOMAS</option>
                              <option value="11851">11851 / TEMÁTICOS-AGROEXTRATIVISMO</option>
                              <option value="11671">11671 / RM FBB-BNDES - PROJETOS INDEPENDENTES</option>
                              <option value="11595">11595 / RM FBB PETROBRAS CADEIAS - RESÍDUOS SÓLIDOS</option>
                              <option value="11745">11745 / RM FBB BNDES - DRLS NOVOS TERRITóRIOS</option>
                              <option value="12368">12368 / RM FBB BNDES-TEMÁTICOS-AGROEXTRATIVISMO</option>
                              <option value="12390">12390 / RM FBB BNDES-TEMÁTICOS-AGROECOLOGIA</option>
                              <option value="12392">12392 / RM FBB BNDES-TEMÁTICOS-PROJETOS INOVADORES</option>
                              <option value="12385">12385 / RM FBB BNDES-TEMÁTICOS-PROSPECÇÃO E PROJETOS INOVADORES</option>
                              <option value="12371">12371 / RM FBB BNDES - ÁGUA DE PRODUÇÃO</option>
                              <option value="12373">12373 / RM FBB BNDES-TEMÁTICOS-HORTAS COMUNITÁRIAS</option>
                              <option value="12375">12375 / RM FBB BNDES-TEMÁTICOS-INCUBADORAS DE COOPERATIVAS</option>
                              <option value="12377">12377 / RM FBB BNDES-TEMÁTICOS-TECBOR - BORRACHA</option>
                              <option value="12379">12379 / RM FBB BNDES-TEMÁTICOS-OUTROS</option>
                              <option value="12381">12381 / RM FBB BNDES-TEMÁTICOS-VOLUNTARIADO</option>
                              <option value="12383">12383 / RM FBB BNDES-TEMÁTICOS-QUILOMBOLAS</option>
                              <option value="12386">12386 / RM FBB BNDES-TEMÁTICOS-TECNOLOGIAS SOCIAIS</option>
                              <option value="12439">12439 / RM FBB BNDES-CADEIAS-AQUICULTURA E PESCA</option>
                              <option value="12366">12366 / RM FBB BNDES-TEMÁTICOS-PRESERVAÇÃO DE BIOMAS</option>
                              <option value="17278">17278 / RM FBB BNDES - Fundo Social PTAC 2013 - Banco de Tecnologias Sociais</option>
                              <option value="17293">17293 / RM FBB BNDES ECOFORTE REDES - FS 06/2015</option>
                              <option value="17360">17360 / INDEPENDENTES EDUCAÇÃO - MINISTÉRIO DA DEFESA</option>
                              <option value="18102">18102 / RP ENCHENTES</option>
                              <option value="18104">18104 / RC ENCHENTES ESPÍRITO SANTO</option>
                              <option value="18108">18108 / RC ENCHENTES MINAS GERAIS</option>
                              <option value="15083">15083 / RP FBB OUTROS PROJETOS ÁGUA</option>
                              <option value="15091">15091 / RM FBB BNDES Ecoforte Extrativismo - Fundo Amazônia 2014</option>
                              <option value="18118">18118 / RP COVID-19</option>
                              <option value="18120">18120 / RC COVID-19</option>
                              <option value="18122">18122 / RC COVID19-GOVERNO</option>
                              <option value="18124">18124 / RC ALUÍZIO CAMPOS</option>
                              <option value="15034">15034 / RM FBB BNDES OUTROS PROJETOS AGROECOLOGIA - FUNDO SOCIAL PTAC 2010</option>
                              <option value="15037">15037 / RM FBB BNDES OUTROS PROJETOS AGROECOLOGIA - FUNDO SOCIAL PTAC 2011</option>
                              <option value="14819">14819 / RP FBB OUT PROJ AGROECOLOGIA</option>
                              <option value="14761">14761 / RP FBB  ECOFORTE REDES</option>
                              <option value="15094">15094 / RP FBB PIS/BB - Demais Iniciativas</option>
                              <option value="15096">15096 / RP FBB DEMAIS VOLUNTARIADO INTEGRAçãO</option>
                              <option value="15098">15098 / BB EDUCAR INTEGRAÇÃO</option>
                              <option value="15132">15132 / RP FBB PIS/BB - Água</option>
                              <option value="15135">15135 / RP FBB ÁGUA VOLUNTAR</option>
                              <option value="14279">14279 / RM FBB BNDES  OUTROS PROJETOS AGROECOLOGIA - FUNDO SOCIAL PTAC 2012</option>
                              <option value="14281">14281 / RM FBB BNDES OUTROS PROJETOS AGROECOLOGIA - FUNDO SOCIAL PTAC 2013</option>
                              <option value="14283">14283 / RM FBB BNDES OUTROS PROJETOS AGROECOLOGIA - FUNDO AMAZÔNIA 2013</option>
                              <option value="14266">14266 / RP FBB ÁGUA BRASIL</option>
                              <option value="14294">14294 / RP FBB CISTERNAS AVALIAÇÃO</option>
                              <option value="14270">14270 / RM FBB BNDES ECOFORTE REDES - FUNDO SOCIAL PTAC 2013</option>
                              <option value="14273">14273 / RM FBB BNDES ECOFORTE REDES - FUNDO AMAZÔNIA 2012</option>
                              <option value="14275">14275 / RM FBB BNDES Ecoforte Extrativismo - Fundo Amazônia 2012</option>
                              <option value="14277">14277 / RM FBB BNDES MUNICÍPIOS VERDES - FUNDO AMAZÔNIA 2013</option>
                              <option value="14301">14301 / RM FBB BNDES OUTROS PROJETOS AGROINDÚSTRIA - FUNDO AMAZÔNIA 2012</option>
                              <option value="14307">14307 / RP FBB OUTROS PROJETOS AGROINDÚSTRIA</option>
                              <option value="14315">14315 / RM FBB PETROBRAS CATAFORTE II CAMINHÕES - 2010</option>
                              <option value="14317">14317 / RM FBB BNDES OUTROS PROJETOS RESÍDUOS SÓLIDOS - FUNDO SOCIAL PTAC 2013</option>
                              <option value="14290">14290 / RM FBB BNDES TERRAFORTE 2013</option>
                              <option value="14292">14292 / RM FBB BNDES TERRAFORTE 2014</option>
                              <option value="14296">14296 / RM FBB BNDES OUTROS PROJETOS AGROINDÚSTRIA - FUNDO SOCIAL PTAC 2009</option>
                              <option value="14298">14298 / RM FBB BNDES OUTROS PROJETOS AGROINDÚSTRIA - FUNDO SOCIAL PTAC 2012</option>
                              <option value="14302">14302 / RM FBB BNDES OUTROS PROJETOS ÁGUA - FUNDO SOCIAL PTAC 2013</option>
                              <option value="14344">14344 / RM FBB BNDES OUTROS PROJETOS AGROINDÚSTRIA - FUNDO AMAZÔNIA 2013</option>
                              <option value="14324">14324 / RM FBB BNDES OUTRAS INICIATIVAS FUNDO SOCIAL PTAC 2013</option>
                              <option value="14326">14326 / RM FBB BNDES OUTRAS INICIATIVAS FUNDO AMAZÔNIA 2012</option>
                              <option value="14328">14328 / RM FBB BID FUMIN OUTRAS INICIATIVAS</option>
                              <option value="14330">14330 / RP FBB OUTRAS INICIATIVAS</option>
                              <option value="14311">14311 / RM FBB MTE SENAES 2013 CATFORTE III BASES</option>
                              <option value="14313">14313 / RM FBB BNDES  CATAFORTE III ESCRITÓRIO - FUNDO SOCIAL PTAC 2013</option>
                              <option value="14333">14333 / RM FBB BNDES DEMAIS INICIATIVAS DRS FUNDO SOCIAL PTAC 2013</option>
                              <option value="14335">14335 / RP FBB DEMAIS INICIATIVAS DRS</option>
                              <option value="14337">14337 / RP FBB DEMAIS INICIATIVAS VOLUNTARIADO</option>
                              <option value="15272">15272 / OUTROS PROJETOS DE EDUCAçãO RIO DOCE - BNDES PTAC 06/2015</option>
                              <option value="14473">14473 / FBB BNDES OUTRAS INICIATIVAS FUNDO SOCIAL PTAC 2012</option>
                              <option value="14474">14474 / FBB BNDES OUTRAS INICIATIVAS FUNDO SOCIAL PTAC 2011</option>
                              <option value="14475">14475 / FBB BNDES OUTRAS INICIATIVAS FUNDO SOCIAL PTAC 2010</option>
                              <option value="14476">14476 / FBB BNDES OUTRAS INICIATIVAS FUNDO SOCIAL PTAC 2009</option>
                              <option value="14482">14482 / RM FBB BNDES OUTROS PROJETOS AGROINDúSTRIA - FUNDO SOCIAL PTAC 2010</option>
                              <option value="14517">14517 / RP FBB OUTROS PROJETOS RESÍDUOS SÓLIDOS</option>
                              <option value="15211">15211 / RP FBB RIO DOCE - AGROECOLOGIA</option>
                              <option value="15213">15213 / RM FBB BNDES RIO DOCE - AGROECOLOGIA</option>
                              <option value="15217">15217 / RP FBB RIO DOCE - AGROINDúSTRIA</option>
                              <option value="15219">15219 / RM FBB BNDES RIO DOCE - AGROINDúSTRIA</option>
                              <option value="15222">15222 / RP FBB RIO DOCE - RESíDUOS SóLIDOS</option>
                              <option value="15224">15224 / RM FBB BNDES RIO DOCE - RESíDUOS SóLIDOS</option>
                              <option value="15160">15160 / OUTROS PROJETOS DE EDUCAçãO - Rio Doce</option>
                              <option value="14749">14749 / RM FBB BNDES JUVENTUDE RURAL - FUNDO SOCIAL 2013</option>
                              <option value="14519">14519 / RM FBB BNDES ÁGUA BRASIL - FUNDO SOCIAL PTAC 2009</option>
                              <option value="14522">14522 / RP FBB PNHU</option>
                              <option value="14540">14540 / RM FBB BNDES Outros Projetos Resíduos Sólidos - Fundo Social PTAC 2010</option>
                              <option value="14509">14509 / RM FBB BNDES OUTROS PROJETOS AGROECOLOGIA - FUNDO AMAZÔNIA 2012</option>
                              <option value="15114">15114 / RP FBB PIS/BB - Agroecologia</option>
                              <option value="15117">15117 / RP FBB AGROECOLOGIA VOLUNTARIADO</option>
                              <option value="15141">15141 / EDUCAÇÃO - PROJETOS INDEPENDENTES - PIS</option>
                              <option value="15143">15143 / EDUCAÇÃO - PROJETOS INDEPENDENTES - VOLUNTARIADO</option>
                              <option value="15146">15146 / ÁGUA - RIO DOCE - RP FBB</option>
                              <option value="15233">15233 / RP FBB RIO DOCE - DEMAIS INIICIATIVAS</option>
                              <option value="15235">15235 / RM FBB BNDES RIO DOCE - DEMAIS INICIATIVAS</option>
                              <option value="14947">14947 / RM FBB BNDES OUTROS PROJETOS AGROECOLOGIA - FUNDO SOCIAL PTAC 2009</option>
                              <option value="15476">15476 / RM FBB ÁGUA DE BEBER</option>
                              <option value="15561">15561 / PROJETO SUPERIOR - BB EDUCAR</option>
                              <option value="15571">15571 / INCLUSãO DIGITAL</option>
                              <option value="15557">15557 / AABB COMUNIDADE</option>
                              <option value="15579">15579 / INDEP. EDUCA RIO DOCE</option>
                              <option value="15586">15586 / Banco de Tecnologias Sociais</option>
                              <option value="15575">15575 / INDEPENDENTES EDUCAÇÃO - PIS</option>
                              <option value="15577">15577 / INDEP. EDUCAÇÃO - VOLUNTARIADO</option>
                              <option value="15581">15581 / INDEP EDUC RIO DOC PTAC</option>
                              <option value="15591">15591 / MEMóRIA DOCUMENTAL</option>
                              <option value="15595">15595 / PROJETO MEMóRIA</option>
                              <option value="15599">15599 / INDEPENDENTES CULTURA</option>
                              <option value="15932">15932 / PROJETOS INDEPENDENTES EM EDUCAÇÃO - FBB</option>
                              <option value="16418">16418 / RM FBB BNDES ÁGUA DE PRODUÇÃO PTAC 06/2015</option>
                              <option value="16520">16520 / RM FBB BNDES ECOFORTE REDES FA 2014</option>
                              <option value="15565">15565 / BB EDUCAR</option>
                              <option value="15567">15567 / BB EDUCAR INTEGRAçãO</option>
                              <option value="16967">16967 / RM FBB BNDES - Fundo Social PTAC 2011 - Banco de Tecnologias Sociais</option>
                              <option value="16969">16969 / RM FBB BNDES - Fundo Social PTAC 2012 - Banco de Tecnologias Sociais</option>
                              <option value="18126">18126 / RP APAGÃO AMAPÁ</option>
                              <option value="18128">18128 / RC APADRINHE UM FUTURO</option>
                              <option value="18132">18132 / RM FBB MUSEU DO IPIRANGA</option>
                              <option value="18137">18137 / RM FBB PROSPECÇÃO DIRETA</option>
                              <option value="18140">18140 / RM FBB PIS MEIO AMBIENTE E RENDA</option>
                              <option value="18144">18144 / RM FBB PRÊMIO DE TECNOLOGIA SOCIAL</option>
                              <option value="18147">18147 / RM FBB/COMPENSA CERRADO</option>
                              <option value="18152">18152 / RP COVID-19</option>
                              <option value="18154">18154 / RC COVID-19 FBB</option>
                              <option value="18157">18157 / RM FBB DESAFIO TRANSFORMA</option>
                              <option value="18160">18160 / RM FBB AABB COMUNIDADE</option>
                              <option value="18163">18163 / RM FBB INSTITUTO VOTORANTIM PTAC 01-2021</option>
                              <option value="18166">18166 / RP ENCHENTES</option>
                              <option value="18169">18169 / RC ENCHENTES ACRE</option>
                              <option value="18171">18171 / RC ENCHENTES MINAS GERAIS</option>
                              <option value="18173">18173 / RC COVID19-CNM PRATO CHEIO 2021</option>
                              <option value="18182">18182 / RM FBB VOLUNTARIADO</option>
                              <option value="18185">18185 / RM FBB ACORDO SUZANO PTAC 01/2021</option>
                              <option value="18188">18188 / RM FBB BNDES FS PTAC 2012 - REAPLICAÇÃO DE TS</option>
                              <option value="18190">18190 / RM FBB BNDES FS PTAC 2013 - REAPLICAÇÃO DE TS</option>
                              <option value="18192">18192 / RC COVID 19 GOVERNO</option>
                              <option value="18192">18195 / RM FBB OUTROS PROJETOS DO PROGRAMA MEIO AMBIENTE E RENDA</option>
                              <option value="18219">18219 / RM FBB BNDES OUTROS PROJETOS DE MEIO AMBIENTE</option>
                              <option value="18309">18309 / RM FBB AABB COMUNIDADE</option>
                              <option value="20030">20030 / RP CICLONE BOMBA</option>
                              <option value="20039">20039 / RC COVID19 MUNICÍPIOS PRATO CHEIO</option>
                              <option value="20241">20241 / RECUPERA CERRADO</option>
                              <option value="20260">20260 / RT MMFDH - SOLIDARIZE-SE</option>
                            </select>
                            <span v-if="errors.first('Projeto Duplicação')" class="label label-danger"> {{ errors.first('Projeto Duplicação') }}</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="cabecalho required-fep">Eixo de Atuação</td>
                        <td class="ressaltar">
                          <!--<input v-model="fep.ds_categ_campo_atuacao" name="ds_categ_campo_atuacao"-->
                          <!--class="form-control" type="text" maxlength="255"></td>-->
                          <div class="required-field"
                               :class="{ 'has-error' : errors.first('eixo de atuação')}">
                            <select name="eixo de atuação" aria-hidden="true"
                                    class="form-control" aria-required="true" aria-invalid="false"
                                    v-model="fep.ds_categ_campo_atuacao" v-validate="'required'">
                              <option value="1">Assistência a comunidades urbano-rurais</option>
                              <option value="2">Assistência Social</option>
                              <option value="3">Ciência e Tecnologia</option>
                              <option value="4">Cultura</option>
                              <option value="5">Educação</option>
                              <option value="6">Recreação e Desporto</option>
                              <option value="7">Saúde</option>
                            </select>
                            <span v-if="errors.first('eixo de atuação')" class="label label-danger"> {{ errors.first('eixo de atuação') }}</span>
                          </div>
                        </td>

                      </tr>
                      <tr>
                        <td class="cabecalho required-fep">Programa</td>
                        <td class="ressaltar">
                          <!--<input v-model="fep.ds_fep_programa" name="ds_fep_programa"-->
                          <!--class="form-control" type="text" maxlength="255">-->
                          <div class="required-field"
                               :class="{ 'has-error' : errors.first('programa')}">
                            <select name="programa" aria-hidden="true" class="form-control"
                                    aria-required="true" aria-invalid="false" v-validate="'required'"
                                    v-model="fep.ds_fep_programa">
                              <option value="1">AABB Comunidade</option>
                              <option value="2">Banco de Tecnologias Sociais</option>
                              <option value="3">BB Educar</option>
                              <option value="4">Inclusão Digital</option>
                              <option value="5">Memória Documental</option>
                              <option value="6">Projeto Memória</option>
                              <option value="7">Reaplicação de Tecnologias Sociais</option>
                              <option value="8">Trabalho e Cidadania</option>
                              <option value="9">Independentes - Assist. a comun. urbano-rurais</option>
                              <option value="10">Independentes - Assistência Social</option>
                              <option value="11">Independentes - Ciência e Tecnologia</option>
                              <option value="12">Independentes - Cultura</option>
                              <option value="13">Independentes - Educação</option>
                              <option value="14">Independentes - Recreação e Desporto</option>
                              <option value="15">Independentes - Saúde</option>
                              <option value="16">Ajuda Humanitária</option>
                              <option value="17">Meio Ambiente e Renda</option>
                              <option value="18">Voluntariado</option>
                              <option value="19">Demais Iniciativas</option>
                              <option value="20">Tecnologia Social</option>
                              <option value="21">Educação para Futuro</option>
                              <option value="22">Educação</option>
                            </select>
                            <span v-if="errors.first('programa')" class="label label-danger"> {{ errors.first('programa') }}</span>
                          </div>
                        </td>
                        <!--<td class="ressaltar">{{troca(proposta.ds_fep_programa)}}</td>-->
                      </tr>
                      <tr>
                        <td class="cabecalho required-fep">Ação</td>
                        <td class="ressaltar">
                          <!--<input v-model="fep.ds_categ_acao" name="ds_categ_acao"-->
                          <!--class="form-control" type="text" maxlength="255">-->
                          <div class="required-field"
                               :class="{ 'has-error' : errors.first('Ação')}">
                            <select name="Ação" aria-hidden="true" v-validate="'required'" v-model="fep.ds_categ_acao"
                                    class="form-control" aria-required="true" aria-invalid="false">
                              <option value="1">Água de Produção</option>
                              <option value="2">Água Brasil</option>
                              <option value="3">DRS</option>
                              <option value="4">Voluntariado</option>
                              <option value="5">Cataforte III - Escritório</option>
                              <option value="6">Cataforte I</option>
                              <option value="7">Cataforte II - Caminhões</option>
                              <option value="8">Cataforte III - Bases</option>
                              <option value="10">Ecoforte Redes</option>
                              <option value="11">Terra Forte</option>
                              <option value="12">Prêmio TS</option>
                              <option value="13">Outros Projetos Água</option>
                              <option value="14">Ecoforte Extrativismo</option>
                              <option value="15">Municípios Verdes</option>
                              <option value="16">Outros Projetos Agroecologia</option>
                              <option value="17">Juventude Rural</option>
                              <option value="18">Outros Projetos Agroindústria</option>
                              <option value="19">Outros Projetos Resíduos Sólidos</option>
                              <option value="20">Outras Iniciativas</option>
                              <option value="21">PNHU</option>
                              <option value="22">Cisternas Avaliação</option>
                              <option value="23">PIS-BB</option>
                              <option value="24">Rio Doce</option>
                              <option value="25">Outros Projetos Educação</option>
                              <option value="26">Água de Beber</option>
                              <option value="27">AABB Comunidade</option>
                              <option value="28">BB Educar</option>
                              <option value="29">BB Educar Integração</option>
                              <option value="30">Inclusão Digital</option>
                              <option value="31">Acordo Ministério da Defesa</option>
                              <option value="32">Fatores Climáticos</option>
                              <option value="33">pandemias e Epidemias</option>
                              <option value="34">Aluízio Campos</option>
                              <option value="35">Museu do Ipiranga</option>
                              <option value="36">PIS - Novo Voluntariado - 2 sem</option>
                              <option value="37">Suzano</option>
                              <option value="38">Vale Pará</option>
                              <option value="39">Voluntariado 2020 a 2021</option>
                              <option value="40">Prospecção Direta</option>
                              <option value="41">Hospital de Jaú</option>
                              <option value="42">Desafio Transforma</option>
                              <option value="43">Enel</option>
                              <option value="44">Prêmio TS</option>
                              <option value="45">Votorantim</option>
                              <option value="46">AABB Comunidade</option>
                              <option value="47">AVSI - Vozes Daqui</option>
                              <option value="48">Cisternas-Escolas</option>
                              <option value="49">Compensa Cerrado</option>
                              <option value="50">Profesp</option>
                              <option value="51">Reaplicação de TS</option>
                              <option value="52">Outros Projetos Educação para o Futuro</option>
                              <option value="53">Outros Projetos Meio Ambiente e Renda</option>
                              <option value="54">Outros Projetos Voluntariado</option>
                              <option value="55">Projetos Estruturantes Arrecadação Solidária-Covid</option>
                              <option value="0">Não se aplica</option>
                            </select>
                            <span v-if="errors.first('Ação')"
                                  class="label label-danger"> {{ errors.first('Ação') }}</span>
                          </div>
                        </td>
                        <!--<td class="ressaltar">{{troca(proposta.ds_categ_acao)}}</td>-->
                      </tr>
                      <tr>
                        <td class="cabecalho required-fep">Parceria Estratégica (Vínculo)</td>
                        <td class="ressaltar">
                          <!--<input v-model="fep.parc_estrategica" name="parc_estrategica"-->
                                                     <!--class="form-control" type="text" maxlength="255">-->
                          <div class="required-field"
                               :class="{ 'has-error' : errors.first('Parceria Estratégica')}">
                            <select name="Parceria Estratégica"
                                  v-model="fep.parc_estrategica"
                                  class="form-control"
                                  aria-hidden="true"
                                  v-validate="'required'">
                            <option value="1">BNDES - 09.2.0708.1/2009 - FS/PTAC 2009 - 5.585-9</option>
                            <option value="2">BNDES - 09.2.0708.1/2009 - FS/PTAC 2010 - 55.805-2</option>
                            <option value="3">BNDES - 09.2.0708.1/2009 - FS/PTAC 2011 - 55.807-9</option>
                            <option value="4">BNDES - 09.2.0708.1/2009 - FS/PTAC 2012 - 55.808-7</option>
                            <option value="5">BNDES - 09.2.0708.1/2009 - FS/PTAC 2013 - 55.813-3</option>
                            <option value="6">BNDES - 10.2.2029.1/2010 - CATAFORTE II - 55.806-0</option>
                            <option value="7">PETROBRAS - 6000.0063847.10.4/2010 - CATAFORTE II - 402002-2</option>
                            <option value="8">BID/FUMIN - 11818/2010 - 405.320-6</option>
                            <option value="9">MTE/SENAES - 03/2007 - CATAFORTE I E II - 405.319-2</option>
                            <option value="10">WESTERN UNION - 405.400-8</option>
                            <option value="11">BNDES - 12.2.0435.1/2012 - FA/CONTRATO 2012 - 55.809-5</option>
                            <option value="12">BNDES - 12.2.0435.1/2012 - FA/CONTRATO 2014 - 55.812-5</option>
                            <option value="13">BNDES - 13.2.0505.1/2013 - ÁGUA DE PRODUÇÃO - 55.811-7</option>
                            <option value="14">BNDES - 13.2.0047.1/2013 - TERRAFORTE 2013 - 55.810-9</option>
                            <option value="15">MTE/SENAES - 795775/2013 - CATAFORTE III - 6.551-X</option>
                            <option value="16">BNDES - 13.2.0047.1/2013 - TERRAFORTE 2014 - 55.814-1</option>
                            <option value="18">BNDES - 15.2.0773.1/2015 - FS/PTAC 06/2015 - 55.816-8</option>
                            <option value="19">INSTITUTO VOTORANTIM - PTAC 2018 - 55.823-0</option>
                            <option value="20">COPASA - 18.1247 - PROGRAMA PRO-MANANCIAIS - 55.820-6</option>
                            <option value="85">DOAÇÃO CONDICIONAL - ACTF FBB-BOLDRINI 01/2020</option>
                            <option value="86">DOAÇÃO COND ESPÓLIO ALUÍSIO A CAMPOS 00101236520028150011</option>
                            <option value="87">DOAÇÃO CONDICIONAL - AÇÃO COVID19-GOVERN - NT PORT 2020/0154</option>
                            <option value="88">DOAÇÃO CONDICIONAL - AÇÃO COVID 19 - NT PORT 2020/0154</option>
                            <option value="89">DOAÇÃO CONDICIONAL - OPERAÇÃO ACOLHIDA</option>
                            <option value="90">DOAÇÃO CONDICIONAL - CÃO GUIA</option>
                            <option value="91">DOAÇÃO CONDICIONAL - MEIO AMBIENTE</option>
                            <option value="92">DOAÇÃO CONDICIONAL - EDUCAÇÃO INCLUSIVA</option>
                            <option value="93">DOAÇÃO CONDICIONAL - ENCHENTES RIO DE JANEIRO</option>
                            <option value="94">DOAÇÃO CONDICIONAL - ENCHENTES MINAS GERAIS</option>
                            <option value="95">DOAÇÃO CONDICIONAL - ENCHENTES ESPÍRITO SANTO</option>
                            <option value="96">BB - BÔNUS AMBIENTAL - ISD - 402.248-3</option>
                            <option value="97">BRASILCAP - TÍT. DE CAP. - ISD - 402.248-3</option>
                            <option value="98">Desvinculado de parceria por ato decisório</option>
                            <option value="99">Não vinculado a parcerias</option>
                          </select>
                            <span v-if="errors.first('Parceria Estratégica')"
                                  class="label label-danger"> {{ errors.first('Parceria Estratégica') }}</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="cabecalho required-fep">Tipo de Ação</td>
                        <td class="ressaltar">
                          <!--<input v-model="fep.ds_fep_tipo_acao" name="ds_fep_tipo_acao" class="form-control" type="text" maxlength="255">-->
                          <div class="required-field"
                               :class="{ 'has-error' : errors.first('Tipo de Ação')}">
                            <select name="Tipo de Ação"
                                    v-model="fep.ds_fep_tipo_acao"
                                    class="form-control"
                                    aria-hidden="true"
                                    v-validate="'required'">
                              <option v-for="i in tiposAcao" :value="i.code">{{i.description}}</option>
                            </select>
                            <span v-if="errors.first('Tipo de Ação')" class="label label-danger"> {{ errors.first('Tipo de Ação') }}</span>
                          </div>
                        </td>
                        <!--<td class="ressaltar">{{troca(proposta.ds_fep_tipo_acao)}}</td>-->
                      </tr>
                      <tr>
                        <td class="cabecalho required-fep">Abrangência</td>
                        <td class="ressaltar">
                          <div class="required-field"
                               :class="{ 'has-error' : errors.first('Abrangência')}">
                            <input v-model="fep.abrangencia" name="Abrangência" class="form-control" type="text"
                                   maxlength="255" v-validate="'required'">
                            <span v-if="errors.first('Abrangência')" class="label label-danger"> {{ errors.first('Abrangência') }}</span>
                          </div>
                          <!--<select v-model="fep.abrangencia" class="form-control" name="abrangencia">-->
                          <!--<option value="0">Não</option>-->
                          <!--<option value="1">SIm</option>-->
                          <!--</select>-->
                        </td>
                        <!--<td class="ressaltar">{{abrangencia}}</td>-->
                      </tr>
                      <tr>
                        <td class="cabecalho required-fep"> Participantes Diretos</td>
                        <td class="ressaltar">
                          <div class="required-field"
                               :class="{ 'has-error' : errors.first('Participantes Diretos')}">
                            <input type="text" v-model="fep.publico_alvo" name="Participantes Diretos"
                                   v-validate="'required'" class="form-control">
                            <span v-if="errors.first('Participantes Diretos')" class="label label-danger"> {{ errors.first('Participantes Diretos') }}</span>
                          </div>
                        </td>
                        <!--<td class="ressaltar">{{publicoAlvo}}</td>-->
                      </tr>
                      <tr>
                        <td class="cabecalho required-fep">Prospecção</td>
                        <td class="ressaltar">
                          <div class="required-field"
                               :class="{ 'has-error' : errors.first('Prospecção')}">
                            <input v-model="fep.ds_categ_prospeccao" name="Prospecção"
                                                       class="form-control" type="text" maxlength="255" v-validate="'required'">
                            <span v-if="errors.first('Prospecção')" class="label label-danger"> {{ errors.first('Prospecção') }}</span>
                          </div>
                        </td>
                        <!--<td class="ressaltar">{{troca(proposta.ds_categ_prospeccao)}}</td>-->
                      </tr>
                      <tr>
                        <td class="cabecalho required-fep">Se Seleção, Nº/Nome Processo</td>
                        <td class="ressaltar">
                          <div class="required-field"
                               :class="{ 'has-error' : errors.first('Processo')}">
                            <input v-model="fep.ds_categ_edital" name="Processo"
                                                       class="form-control" type="text" maxlength="255" v-validate="'required'">
                            <span v-if="errors.first('Processo')" class="label label-danger"> {{ errors.first('Processo') }}</span>
                          </div>
                        </td>
                        <!--<td class="ressaltar">{{troca(proposta.ds_categ_edital)}}</td>-->
                      </tr>
                      <tr>
                        <td class="cabecalho required-fep">Cadeia Produtiva</td>
                        <td class="ressaltar">
                          <!--<input v-model="fep.ds_categ_vetor" name="ds_categ_vetor" class="form-control" type="text"-->
                          <!--maxlength="255">-->
                          <div class="required-field"
                               :class="{ 'has-error' : errors.first('Cadeia Produtiva')}">
                            <select name="Cadeia Produtiva" aria-hidden="true" class="form-control" v-model="fep.ds_categ_vetor"
                                  aria-required="true" aria-invalid="false" v-validate="'required'">
                            <option value="1">Apicultura</option>
                            <option value="2">Avicultura</option>
                            <option value="3">Bovinocultura</option>
                            <option value="4">Cafeicultura</option>
                            <option value="5">Cajucultura</option>
                            <option value="6">Floricultura</option>
                            <option value="7">Mandiocultura</option>
                            <option value="8">Ovinocapricultura</option>
                            <option value="9">Psicultura</option>
                            <option value="10">Suinocultura</option>
                            <option value="11">Resíduos Sólidos</option>
                            <option value="12">Artesanato</option>
                            <option value="13">Fruticultura</option>
                            <option value="14">Turismo</option>
                            <option value="15">Recuperação Ambiental</option>
                            <option value="16">Assistência Técnica</option>
                            <option value="17">Capacitação e Formação</option>
                            <option value="18">Comunicação / Mobilização</option>
                            <option value="19">Articulação e Redes</option>
                            <option value="20">Horticultura</option>
                            <option value="21">Silvicultura</option>
                            <option value="22">Olericultura</option>
                            <option value="0">Não se aplica</option>
                          </select>
                            <span v-if="errors.first('Cadeia Produtiva')" class="label label-danger"> {{ errors.first('Cadeia Produtiva') }}</span>
                          </div>
                        </td>
                        <!--<td class="ressaltar">{{troca(proposta.ds_categ_vetor)}}</td>-->
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Orçamento -->
                <div class="form-group box-body">
                  <div>
                    <label class="control-label">Orçamento</label>
                  </div>
                  <div>
                    <table class="table table-condensed table-bordered table-striped orcamento">
                      <thead>
                      <tr>
                        <th class="cabecalho">Recursos</th>
                        <th class="centralizado">Valor</th>
                        <th class="centralizado">% Valor</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td class="required-fep">Próprios FBB</td>
                        <td class="centralizado">
                          <div class="required-field"
                               :class="{ 'has-error' : errors.first('total fbb')}">
                            <money v-model="fep.total_fbb" name="total fbb" class="form-control" type="text"
                                   maxlength="255" v-validate="'required'"></money>
                            <span v-if="errors.first('total fbb')" class="label label-danger"> {{ errors.first('total fbb') }}</span>
                          </div>
                        </td>
                        <td class="centralizado">{{fep.total_fbb / (fep.total_contrapartida + fep.total_fbb +
                          fep.total_parceiro) | percentage}}
                        </td>
                      </tr>
                      <tr>
                        <td class="required-fep">Terceiros - Parcerias Estratégicas</td>
                        <td class="centralizado">
                          <div class="required-field"
                               :class="{ 'has-error' : errors.first('total parceiro')}">
                            <money v-model="fep.total_parceiro" name="total parceiro" class="form-control" type="text"
                                   maxlength="255" v-validate="'required'"></money>
                            <span v-if="errors.first('total parceiro')" class="label label-danger"> {{ errors.first('total parceiro') }}</span>
                          </div>
                        </td>
                        <td class="centralizado">{{fep.total_parceiro / (fep.total_contrapartida + fep.total_fbb +
                          fep.total_parceiro) | percentage}}
                        </td>
                        <!--<td class="centralizado">{{totalParceiro | real}}</td>-->
                        <!--<td class="centralizado">{{totalParceiro / (totalContrapartida + totalFBB + totalParceiro) | percentage}}</td>-->
                      </tr>
                      <tr>
                        <td class="required-fep">Contrapartida - Proponente</td>
                        <td class="centralizado">
                          <money v-model="fep.total_contrapartida" name="total_contrapartida" class="form-control"
                                 type="text" maxlength="255"></money>
                        </td>
                        <td class="centralizado">{{fep.total_contrapartida / (fep.total_contrapartida + fep.total_fbb +
                          fep.total_parceiro) | percentage}}
                        </td>
                        <!--<td class="centralizado">{{totalContrapartida | real}}</td>-->
                        <!--<td class="centralizado">{{totalContrapartida/ (totalContrapartida + totalFBB + totalParceiro) | percentage}}</td>-->
                      </tr>
                      <!--<tr>-->
                      <!--<td>Contrapartida - Outros Parceiros</td>-->
                      <!--&lt;!&ndash;<td class="centralizado">{{0 | real}}</td>&ndash;&gt;-->
                      <!--&lt;!&ndash;<td class="centralizado">{{0 / (totalContrapartida + totalFBB + totalParceiro) | percentage}}</td>&ndash;&gt;-->
                      <!--</tr>-->
                      <tr>
                        <td>Total</td>
                        <td class="centralizado">{{fep.total_contrapartida + fep.total_fbb + fep.total_parceiro |
                          real}}
                        </td>
                        <td class="centralizado">{{(fep.total_contrapartida + fep.total_fbb + fep.total_parceiro) /
                          (fep.total_contrapartida + fep.total_fbb + fep.total_parceiro)| percentage}}
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Observações -->
                <div class="form-group box-body">
                  <div>
                    <label class="control-label">Observações</label>
                  </div>
                  <div>
                    <textarea v-model="fep.ds_fep_observacao" name="ds_fep_observacao" v-resizable @input="resizable"
                              class="form-control"></textarea>
                  </div>
                </div>


                <div class="form-group box-body">
                  <div>
                    <label class="control-label">Enquadramento Orçamentário</label>
                  </div>

                  <table class="bloco">
                    <tr>
                      <td>
                        <textarea class="form-control">Enquadramento validado em {{hoje}}</textarea>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="assinatura">
                          <span>Assessor Formalização - Orçamento</span>
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>


              </div>

            </div>

          </div>

        </div>

      </div>
      <div class="float">
        <!--<b-button type="button" :disabled="false" @click="imprimirRelatorio" class="btn btn-warning btn-sm btn-flat"><i class="fa fa-print" aria-hidden="true"></i>  Imprimir </b-button>-->
      </div>

    </section>

  </div>
</template>

<script>
  import html2pdf from 'html2pdf.js'
  import moment from 'moment'

  export default {
    name: 'relatorio-fep-aberto',
    data () {
      return {
        showgrid: true,
        relatorioFep: {
          itensFbb: [],
          itensContrapartida: [],
          itensParceiro: []
        },
        loading: {
          show: false
        },
        tiposAcao: [
          {'code': 'AT', 'description': 'Ação Tática'},
          {'code': 'AF', 'description': 'Ação Finalística'}
        ],
        fep: {},
        fepExcel: 'fep.xls',
        json_data: [],
        json_fields: {
          'Ano': 'ds_fep_ano',
          'Numero': 'ds_fep_numero',
          'Título': 'ds_nome',
          'Proponente': 'entidade.ds_nome',
          'CNPJ': 'entidade.ds_cnpj',
          'Projeto Superior': 'nr_projeto_duplicacao',
          'Eixo de Atuação': 'ds_categ_campo_atuacao',
          'Programa': 'ds_fep_programa',
          'Ação': 'ds_categ_acao',
          'Parceria Estratégica': 'ds_categ_acao',
          'Tipo Ação': 'ds_fep_tipo_acao',
          'Abrangência': 'abrangencia',
          'Participantes Diretos': 'participantes_diretos',
          'Prospecção': 'ds_categ_prospeccao',
          'Nome do Processo': 'ds_categ_edital',
          'Cadeia Produtiva': 'ds_categ_vetor',
          'Orçamento FBB': 'totalFBB',
          'Terceiros': 'totalParceiro',
          'Observação': 'ds_fep_observacao'
        },
        json_meta: [
          [{
            'key': 'charset',
            'value': 'utf-8'
          }]
        ],
        id_fep: '',
        ds_fep_ano: '',
        ds_fep_numero: '',
        hoje: moment().format('DD/MM/YYYY'),
        nome: '',
        nomeEntidade: '',
        cnpj: '',
        proposta: {},
        opcoes: ['Sim', 'Não', 'N/A'],
        totalFBB: 0,
        totalContrapartida: 0,
        totalParceiro: 0,
        meta: {},
        perguntas: {},
        metaIndex: [],
        publicosAlvo: {},
        formasContratacao: [],
        editando: null,
        atividadeForm: {
          nr_periodo_final: null,
          itens_orcamentos: [],
          metas: {},
          ds_nome: '',
          nr_periodo_inicial: null,
          ds_documento_comprobatorio: ''
        }, // formulário de edição e nova meta os dados serão guardados aqui
        atividadeTabela: {}, // Guarda o valor do objeto atividade antes da edição
        opcao_qtde_assinaturas: 3
      }
    },
    created: async function () {
      if (this.$route.params.id) {
        await this.buscaFep()
      }
      // FEP Excel
      this.fepExcel = !_.isUndefined(this.fep.id) ? 'fep_' + (this.fep.id).replace('/', '_') + '.xls' : 'fep.xls'
      this.json_data[0] = this.fep
      this.json_data[0]['abrangencia'] = this.fep.abrangencia
      this.json_data[0]['participantes_diretos'] = this.fep.publico_alvo
      this.json_data[0]['totalFBB'] = this.fep.total_fbb
      this.json_data[0]['totalFBB'] = this.totalFBB
      this.json_data[0]['totalContrapartida'] = this.totalContrapartida
      this.json_data[0]['totalParceiro'] = this.totalParceiro

      // window.print()
    },
    methods: {
      async buscaFep () {
        this.loading.show = true
        await axiosLaravel.get('fep/' + this.$route.params.id).then((response) => {
          console.log('Juliano buscaFEp response.data.fep', response.data.fep)
          this.fep = JSON.parse(response.data.fep)
          delete this.fep['fep']
          console.log('Juliano buscaFEp this.fep', this.fep)
          this.id_fep = response.data.id
          // this.fep.id = response.data.id
          this.loading.show = false
        })
          .catch((error) => {
            this.loading.show = false
            this.$root.trataErro(error)
          })
      },
      salva () {
        this.$validator.validateAll().then(result => {
          if (result) {
            if (this.id_fep) {
              this.fep
              console.log('Juliano salva this.fep', this.fep.ano)
              console.log('Juliano salva this.fep', this.id_fep)
              this.$snotify.async('Atualizando a FEP. Por favor, aguarde...', {timeout: 0})
              axiosLaravel.put('fep/atualiza/' + this.id_fep, this.fep).then((response) => {
                this.$snotify.clear()
                this.$snotify.success('FEP atualizada com sucesso!')
                this.fep = JSON.parse(response.data.fep)
                this.id_fep = response.data.id
              })
                .catch((error) => {
                  this.$snotify.clear()
                  this.$root.trataErro(error)
                })
            } else {
              this.$snotify.async('Salvando a FEP. Por favor, aguarde...', {timeout: 0})
              axiosLaravel.post('fep/grava/', this.fep).then((response) => {
                this.$snotify.clear()
                this.$snotify.success('FEP salva com sucesso!')
                this.fep = JSON.parse(response.data.fep)
                this.id_fep = response.data.id
              })
                .catch((error) => {
                  this.$snotify.clear()
                  this.$root.trataErro(error)
                })
            }
          }
        })
      },
      troca (item) {
        if (!_.isNull(item) && !_.isUndefined(item) && !_.isEmpty(item)) {
          let out = item.replace(/^\s*/, '')
          out = out.replace('_', ' ', function (str, offset) {
            if (offset === 0) {
              return (str.toUpperCase())
            } else {
              return (str.substr(0, 1) + ' ' + str.substr(1).toUpperCase())
            }
          })
          return (out)
        }
      },
      async buscaProposta () {
        this.loading.show = true
        await axiosLaravel.get('propostas/' + this.$route.params.id).then((response) => {
          this.proposta = response.data
          this.nome = this.proposta.ds_nome
          this.nomeEntidade = this.proposta.entidade.ds_nome
          // this.cnpj = this.proposta.entidade.ds_cnpj
          this.abrangencia = ''
          for (let i = 0; i < this.proposta.municipalizacao.length; i++) {
            this.abrangencia = this.proposta.municipalizacao[i].ds_municipio + ' , ' + this.abrangencia
          }
          let removeDup = [...new Set(this.abrangencia.split(', '))].join(',')
          this.abrangencia = removeDup
          let str1 = this.abrangencia
          this.abrangencia = str1.substring(0, str1.length - 2) + ''
          this.proposta.atividades.forEach((atividade) => {
            if (atividade.itens_orcamentos) {
              atividade.itens_orcamentos.forEach((item) => {
                if (item.origem === '1') {
                  this.relatorioFep.itensFbb.push(item)
                  this.totalFBB += (item.valor_unitario * item.quantidade)
                }
                if (item.origem === '2') {
                  this.relatorioFep.itensContrapartida.push(item)
                  this.totalContrapartida += (item.valor_unitario * item.quantidade)
                }
                if (item.origem === '5') {
                  this.relatorioFep.itensParceiro.push(item)
                  this.totalParceiro += (item.valor_unitario * item.quantidade)
                }
              })
            }
          })
          this.publicoAlvo = ''
          for (let i = 0; i < this.proposta.publicos_alvo.length; i++) {
            this.publicoAlvo = this.publicoAlvo + this.proposta.publicos_alvo[i].nr_participantes_diretos + ' ' + this.proposta.publicos_alvo[i].fonte.ds_descricao
          }
          this.$forceUpdate()
          this.loading.show = false
        })
          .catch((error) => {
            this.loading.show = false
            this.$root.trataErro(error)
          })
      },
      imprimirRelatorio () {
        window.print()
      },
      print () {
        let element = document.getElementById('relatorio_fep')
        let opt = {
          margin: 1,
          filename: 'myfile.pdf',
          image: {type: 'jpeg', quality: 0.98},
          html2canvas: {scale: 2},
          jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
        }
        html2pdf(element, opt)
      }
    }
  }
</script>

<style>

  @page:left{
    @bottom-left {
      content: "Page " counter(page) " of " counter(pages);
    }
  }

</style>

<style scoped>
  .float{
    position:fixed;
    bottom:40px;
    z-index: 2;
    right:20px;
    color: #c1c1c1;
    text-align:center;
  }

  .titulo {
    font-size: 30px;
  }

  .fep_titulo {
    text-align: right;
    display: none;
  }

  #relatorio_fep .table .cabecalho {
    width: 400px;
    text-align: left;
  }

  #relatorio_fep .table .centralizado {
    text-align: center !important;
  }

  textarea {
    overflow: hidden !important;
    resize: none;
  }

  img.logo_relatorio {
    display: none;
  }

  .assinatura {
    float: left;
    display: none;
  }

  .bloco {
    width: 100% !important;
  }

  .opcao {
    float: right;
    color: cornflowerblue;
  }

  .rodape {
    display: none !important;
  }
  /********************************************************************************************************************************************/

  @media print {

    *:not(.titulo) {
      font-size: 18px;
    }

    .control-label {
      text-transform: uppercase;
    }

    img.logo_relatorio {
      display: block;
    }

    .table {
      margin-bottom: 0px !important;
    }

    .ressaltar {
      font-weight: bold;
    }

    .fep_titulo {
      display: block;
    }

    .juntos {
      page-break-inside: avoid;
    }

    .opcao {
      display: none;
    }

    select, input {
      border: 0;
      padding-left: 20px;
    }

    button {
      display: none;
    }

    .bloco {
      border: 1px solid #d2d6de;
    }

    .bloco textarea {
      border: 0;
    }

    .assinatura {
      display: block;
      text-align: center;
      border-top: 1px solid gray;
      width: 50%;
      margin: 50px 25% 10px 25%;
    }


    select::-ms-expand {
      display: none;
    }
    select{
      -webkit-appearance: none;
      appearance: none;
    }
    @-moz-document url-prefix(){
      .ui-select{border: 1px solid #CCC; border-radius: 4px; box-sizing: border-box; position: relative; overflow: hidden;}
      .ui-select select { width: 110%; background-position: right 30px center !important; border: none !important;}
    }

    @page {
      /*size: portrait;*/
      /*margin: 0;*/
    }

    body {
      background: white !important;
      /*margin: 2cm;*/
    }


    .rodape {
      position: fixed !important;
      bottom: 0 !important;
      width: 100% !important;
      display: block !important;
      margin-top: 10px;
      border-top: 1px solid gray;
      font-size: 10px;
      font-style: italic;
      padding: 0 10px;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .rodape .secao_esquerda {
      float: left;
      text-align: left;
      width: 35%;
    }
    .rodape .secao_centro {
      float: left;
      text-align: center;
      width: 30%;
    }
    .rodape div.secao_centro:after {
      content: "Pág. " counter(page) " de " counter(pages);
    }
    .rodape .secao_direita {
      float: right;
      text-align: right;
      width: 35%;
    }

    .content-wrapper, .box.box-primary {
      border: 0 !important;
    }

    .bloco_texto {
      width: 100% !important;
      border: 1px solid #d2d6de;
      padding: 6px 12px;
      white-space: pre-wrap
    }

    div.nao_imprimir, span.nao_imprimir {
      display: none !important;
    }
    table.nao_imprimir {
      visibility: collapse !important;
    }

    div.imprimir, span.imprimir {
      display: block !important;
    }
    table.imprimir {
      visibility: visible !important;
    }

    #Header, #Footer { display: none !important; }

    #app .content-wrapper * {
      background: white !important;
    }


  }


</style>

<style>
  .main-sidebar, .left-side {
    top: 0;
    left: 0;
    padding-top: 50px;
    min-height: 100%;
    width: 230px;
    z-index: 810;
    -webkit-transition: -webkit-transform .3s ease-in-out,width .3s ease-in-out;
    -moz-transition: -moz-transform .3s ease-in-out,width .3s ease-in-out;
    -o-transition: -o-transform .3s ease-in-out,width .3s ease-in-out;
    transition: transform .3s ease-in-out,width .3s ease-in-out;
    position: fixed !important;
  }


  .main-header {
    position: fixed !important;
    top: 0;
    width: 100%;
  }


  .skin-fbb .content-header {
    position: fixed !important;
    top: 50px;
    width: 87vw;
    z-index: 800;
    background: #ecf0f5 !important;
    border-left: 1px solid #d2d6de;
    margin-left: -1px;
    padding-bottom: 10px;
    box-shadow: 0px 1px 10px rgba(112,112,112,0.5);
    -ms-filter: "progid:DXImageTransform.Microsoft.Shadow(Strength=4, Direction=180, Color='#aaaabb')";
    filter: progid:DXImageTransform.Microsoft.Shadow(Strength=4, Direction=180, Color='#aaaabb');
  }

  .content-header>.breadcrumb {
    position: fixed !important;
    background: transparent;
    margin-top: 50px;
    margin-bottom: 0;
    font-size: 12px;
    padding: 7px 5px;
    top: 60px !important;
    right: 10px;
    border-radius: 2px;
    float: left;
  }

  .content {
    min-height: 250px;
    padding: 15px;
    margin-right: auto;
    margin-left: auto;
    padding-left: 15px;
    padding-right: 15px;
    margin-top: 100px;
  }

  .main-sidebar, .left-side {
    position: fixed !important;
    top: 0;
    left: 0;
    padding-top: 50px;
    min-height: 100%;
    width: 230px;
    z-index: 810;
    -webkit-transition: -webkit-transform .3s ease-in-out,width .3s ease-in-out;
    -moz-transition: -moz-transform .3s ease-in-out,width .3s ease-in-out;
    -o-transition: -o-transform .3s ease-in-out,width .3s ease-in-out;
    transition: transform .3s ease-in-out,width .3s ease-in-out;
  }
  .required-fep:after{
    font-weight: bold;
    color: #e32;
    content: ' *';
    display: inline;
  }
</style>
