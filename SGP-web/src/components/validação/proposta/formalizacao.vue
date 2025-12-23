<template>

  <div class="box box-primary" id="formalizacao">
    <fieldset :disabled="this.$router.currentRoute.name === 'proposta-visualiza'">
      <div class="box-header with-border">
        <h3 class="box-title">Formalização<span v-if="propsFormalizacao.ds_codigo_projeto_erp">  do projeto <b>{{propsFormalizacao.ds_codigo_projeto_erp}}</b></span></h3>
      </div>

      <div class="box-body">
        
        <form name="cmptDocPreparationForm" class="form-horizontal" novalidate @submit.prevent>

          <div class="row">

            <!-- Dados da Agência -->
            <div class="col-md-4">
              <legend>Conta Impessoal (Transitória - DEB)</legend>
              <dl class="col-md-12">
                <dd>
                  <div class="form-group col-md-12">
                    <label class="control-label">Banco</label>
                    <span name="banco" class="form-control" disabled="disabled">{{formalizacao.ds_agencia_banco}} - Banco do Brasil</span>
                  </div>
                </dd>
                <dd>
                  <div class="form-group col-md-12 required-field"
                       :class="{ 'has-error' : errors.first('agencia')}">
                    <label class="control-label">Agência</label>
                    <the-mask v-model="formalizacao.ds_agencia_nome" name="agencia" class="form-control" :mask="['####-X']" :tokens="customTokens"
                              v-validate="'required|agency'" :masked="true"></the-mask>
                    <span v-if="errors.first('agencia')" class="label label-danger"> {{ errors.first('agencia') }}</span>
                  </div>
                </dd>
                <dd>
                  <div class="form-group col-md-12 required-field"
                       :class="{ 'has-error' : errors.first('conta corrente')}">
                    <label class="control-label">Conta Corrente</label>
                    <the-mask v-model="formalizacao.ds_agencia_conta_corrente" :tokens="customTokens" name="conta corrente" class="form-control" :masked="true"
                              v-validate="'required|contacorrente'" :mask="['###-X', '####-X', '#####-X', '######-X', '#######-X', '########-X', '#########-X']">
                    </the-mask>
                    <span v-if="errors.first('conta corrente')" class="label label-danger"> {{ errors.first('conta corrente') }}</span>
                  </div>
                </dd>
              </dl>
            </div>
            <!--  Demanda 66506 - incluir conta que receberá adiantamento na formalização do projeto -->
            <div class="col-md-4" :class="{'required-field' : propsAdiantaveis }">
              <legend>Conta Corrente (Adiantamento)</legend>
              <dl class="col-md-12">
                <dd>
                  <div class="form-group col-md-12">
                    <label class="control-label">Banco</label>
                    <span name="banco" class="form-control" disabled="disabled">{{formalizacao.ds_agencia_banco}} - Banco do Brasil</span>
                  </div>
                </dd>
                <dd>
                  <div class="form-group col-md-12"
                       :class="{ 'has-error' : errors.first('agencia de adiantamento')}">
                    <label class="control-label">Agência</label>
                    <the-mask  @blur.native="verificarInputContaAdiantamento" v-model="formalizacao.ds_agencia_adiantamento" name="agencia de adiantamento" class="form-control" :mask="['####-X']" :tokens="customTokens"
                              v-validate="'agency'" :masked="true"></the-mask>
                    <span v-if="errors.first('agencia de adiantamento')" class="label label-danger"> {{ errors.first('agencia de adiantamento') }}</span>
                  </div>
                </dd>
                <dd>
                  <div class="form-group col-md-12"
                       :class="{ 'has-error' : errors.first('conta corrente de adiantamento')}">
                    <label class="control-label">Conta Corrente</label>
                    <the-mask @blur.native="verificarInputContaAdiantamento" v-model="formalizacao.ds_conta_adiantamento" :tokens="customTokens" name="conta corrente de adiantamento" class="form-control" :masked="true"
                              v-validate="'contacorrente'" :mask="['###-X', '####-X', '#####-X', '######-X', '#######-X', '########-X', '#########-X']">
                    </the-mask>
                    <span v-if="errors.first('conta corrente de adiantamento')" class="label label-danger"> {{ errors.first('conta corrente de adiantamento') }}</span>
                  </div>
                </dd>
                <dd>
                  <div class="form-group col-md-12">
                    <label class="control-label">MCI</label>
                    <input type="number" class="form-control" v-model="formalizacao.mci"  @input="limitarDigitosMCI">
                  </div>
                </dd>
              </dl>
            </div>

            <div class="col-md-4">
              <legend>Datas</legend>
              <dl class="col-md-12">
                <!--Data da Proposta-->
                <div class="form-group col-md-12 required-field-field"
                     :class="{ 'has-error' : errors.first('data proposta')}">
                  <label class="control-label">Data da Proposta</label>
                  <!--<span class="form-control" disabled="disabled">{{formalizacao.dt_proposta | moment("L")}}</span>-->
                  <div class="input-group">
                    <datepicker name="data proposta" v-model="formalizacao.dt_proposta"  v-on:input="validaDatas" input-class="form-control datepicker"
                                :language="$datePickerPtBR" maxlength="20" :use-utc="false" placeholder="__ /__ /____"
                                format="dd/MM/yyyy" v-validate="'required'">
                    </datepicker>
                  </div>
                  <span v-if="errors.first('data proposta')" class="label label-danger"> {{ errors.first('data proposta') }}</span>
                </div>
              </dl>
              <dl class="col-md-12">
                <!--Data de análise-->
                <div class="form-group col-md-12 required-field"
                     :class="{ 'has-error' : errors.first('data análise')}">
                  <label class="control-label">Data de análise</label>
                  <!--<span class="form-control" disabled="disabled">{{formalizacao.dt_analise | moment("L")}}</span>-->
                  <div class="input-group">
                    <datepicker name="data análise" v-model="formalizacao.dt_analise" v-on:input="validaDatas" input-class="form-control datepicker"
                                :language="$datePickerPtBR" maxlength="20" :use-utc="false" placeholder="__/__/____"
                                format="dd/MM/yyyy" v-validate="'required'" ></datepicker>
                  </div>
                  <span v-if="errors.first('data análise')" class="label label-danger"> {{ errors.first('data análise') }}</span>
                </div>
              </dl>

              <dl class="col-md-12">
                <!--Data de deferimento-->
                <div class="form-group col-md-12 required-field" uib-tooltip="Data de deferimento"
                     :class="{ 'has-error' : errors.first('data deferimento')}">
                  <label class="control-label">Data de deferimento</label>
                  <!--<span class="form-control" disabled="disabled">{{formalizacao.dt_deferimento | moment("L")}}</span>-->
                  <div class="input-group">
                    <datepicker name="data deferimento" v-model="propsFormalizacao.dt_deferimento" v-on:input="validaDatas" input-class="form-control datepicker"
                                :language="$datePickerPtBR" maxlength="20" :use-utc="false" placeholder="__/__/____"
                                format="dd/MM/yyyy" v-validate="'required'" ></datepicker>
                  </div>
                  <span v-if="errors.first('data deferimento')" class="label label-danger"> {{ errors.first('data deferimento') }}</span>
                </div>
              </dl>

              <!--Data de assinatura do convênio-->
              <dl class="col-md-12">
                <div class="form-group col-md-12 required-field" :class="{ 'has-error' : errors.first('data assinatura')}">
                  <label class="control-label">Data de assinatura do convênio</label>
                  <!--<span class="form-control" disabled="disabled">{{formalizacao.dt_assinatura_convenio | moment("L")}}</span>-->
                  <div class="input-group">
                    <datepicker name="data assinatura" v-model="formalizacao.dt_assinatura_convenio" @change="datas"
                                input-class="form-control datepicker" :language="$datePickerPtBR" :use-utc="false"
                                format="dd/MM/yyyy"
                                v-validate="'required'"
                                placeholder="__/__/____"></datepicker>
                  </div>
                  <span v-if="errors.first('data assinatura')" class="label label-danger"> {{ errors.first('data assinatura') }}</span>
                  <span><i><font size="1">* Data de assinatura do convênio deve ser igual ou posterior a Data de deferimento</font></i></span>
                </div>
              </dl>

              <!-- Data de Vigência -->
              <dl class="col-md-12">
                <div class="form-group col-md-12 required-field" :class="{ 'has-error' : errors.first('data vigência')}">
                  <label class="control-label">Data de Vigência do Projeto</label>
                  <span class="form-control" disabled="disabled">{{formalizacao.dt_data_vigencia | moment("L")}}</span>
                  <!--<div class="input-group">-->
                    <!--<datepicker name="data vigência" v-model="formalizacao.dt_data_vigencia" :disabled="true"-->
                                <!--input-class="form-control datepicker" :language="$datePickerPtBR" :use-utc="false"-->
                                <!--format="dd/MM/yyyy"-->
                                <!--placeholder="__/__/____"-->
                                <!--v-validate="'required'">-->
                    <!--</datepicker>-->
                  <!--</div>-->
                  <!--<span v-if="errors.first('data vigência')" class="label label-danger"> {{ errors.first('data vigência') }}</span>-->
                </div>
              </dl>

            </div>


          </div>

          <!--Documentos Deferimento Inclusão dessa div para mostrar os documentos que embasaram o deferimento para serem visualizados na formalização-->
          <div class="row">
            <div class="col-md-12" v-if="formalizacao.hasOwnProperty('agenciaSelecionada')">
              <legend>Dados Complementares (Salve antes de gerar a minuta)</legend>
              <dl>
                <dd>
                  <div class="form-group col-md-12">
                    <label class="control-label">Agência: </label>
                    <input type="text" class="form-control" placeholder="Número da Agência"v-model="formalizacao.agenciaSelecionada.agencia">
                  </div>
                </dd>
                <dd>
                  <div class="form-group col-md-12">
                    <label class="control-label">Nome da Agência: </label>
                    <input type="text" class="form-control" placeholder="Nome da Agência"v-model="formalizacao.agenciaSelecionada.nomeAgencia">
                  </div>
                </dd>
                <dd>
                  <div class="form-group col-md-12">
                    <label class="control-label">Agência CNPJ: </label>
                    <the-mask type="text" class="form-control" v-model="formalizacao.agenciaSelecionada.cnpj" placeholder="CNPJ da Agência" mask="##.###.###/####-##"></the-mask>
                  </div>
                </dd>
                <dd>
                  <div class="form-group col-md-12">
                    <label class="control-label">Nome Gerente: </label>
                    <input type="text" class="form-control" placeholder="Nome do Gerente Geral" v-model="formalizacao.agenciaSelecionada.informacoesGerenteGeral.nome">
                  </div>
                </dd>
                <dd>
                  <div class="form-group col-md-12">
                    <label class="control-label">Estado Civil Gerente: </label>
                    <select class="form-control" v-model="formalizacao.agenciaSelecionada.informacoesGerenteGeral.estadoCivil">
                      <option value="[ESTADO CIVIL GERENTE]">Estado Civil do Gerente Geral</option>
                      <option value="solteiro">Solteiro(a)</option>
                      <option value="casado">Casado(a)</option>
                      <option value="divorciado">Divorciado(a)</option>
                      <option value="viuvo">Viúvo(a)</option>
                    </select>
                  </div>
                </dd>
                <dd>
                  <div class="form-group col-md-12">
                    <label class="control-label">RG Gerente: </label>
                    <!-- <the-mask type="text" class="form-control" placeholder="RG do Gerente Geral" v-model="formalizacao.agenciaSelecionada.informacoesGerenteGeral.rg" mask="##.###.###-#"></the-mask> -->
                    <input type="text" class="form-control" placeholder="RG do Gerente Geral" v-model="formalizacao.agenciaSelecionada.informacoesGerenteGeral.rg">
                  </div>
                </dd>
                <dd>
                  <div class="form-group col-md-12">
                    <label class="control-label">CPF Gerente: </label>
                    <the-mask type="text" class="form-control" placeholder="CPF do Gerente Geral" v-model="formalizacao.agenciaSelecionada.informacoesGerenteGeral.cpf" mask="###.###.###-##"></the-mask>
                  </div>
                </dd>
                <dd>
                  <div class="form-group col-md-12">
                    <label class="control-label">Município Gerente: </label>
                    <input type="text" class="form-control" placeholder="Município de Residencia do Gerente Geral" v-model="formalizacao.agenciaSelecionada.informacoesGerenteGeral.municipioResidencia">
                  </div>
                </dd>
              </dl>
            </div>

          </div>
          <div class="row">
            <div class="col-md-12">
              <legend>Documentos de Deferimento</legend>
              <div class="col-md-12">
                <upload-documentos-php-novo :disable="true" :propDocumentos="formalizacao.documentos.deferimento" :documentTypes="''" :documentosObrigatorios="''" :localUso="'PROPOSTA_DEFERIMENTO'"></upload-documentos-php-novo>
              </div>
            </div>
          </div>
        <!--Documentos Formalização-->
          <div class="row">
            <div class="col-md-12">
              <legend>Documentos da Formalização</legend>
              <!-- 73443 - Automatização de Minutas -->
              <div class="col-md-12">
                <div class="row-flex all-start gap-10" v-if="!_.includes(editaisComMinuta, formalizacao.fk_edital)">
                    <label>Minuta para Proposta Simplificada:</label>
                    <input type="checkbox" v-model="minutaSimplificada" class="ng-pristine ng-untouched ng-valid ng-empty"/>
                </div>
                <div v-if="_.includes(editaisComMinuta, formalizacao.fk_edital)" style="color: red; margin-bottom: 10px;">
                  *Edital com minuta exclusiva
                </div>
                <div v-if="formalizacao.fk_edital == 10" style="margin-bottom: 10px;">
                  <select v-model="tipoMinutaEcoforte" class="form-control respostaFav">
                    <option value="" disabled>Edital Ecoforte: Selecione o tipo de minuta que será gerada.</option>
                    <option :value="1">Ecoforte: Regiões Sudeste, Sul, Centro-Oeste e Nordeste</option>
                    <option :value="2">Ecoforte: Amazônia Legal, no âmbito dos recursos do Fundo Amazônia</option>
                  </select>
                </div>
                <div v-if="formalizacao.fk_edital == 10">
                  <g-button-ujarak v-if="tipoMinutaEcoforte !== ''" type="button" color="success" size="button--size-ss" @click.native="gerarMinutaAutomatica()" ><i class="fa fa-download" aria-hidden="true"></i> Gerar Minuta</g-button-ujarak>
                  <router-link ref="planoTrabalhoLink" :to="{name: 'plano-trabalho', params: { id: $route.params.id } }" target="_blank" class="btn btn-primary btn-sm btn-flat botao-plano" style="text-decoration: none"><i class="fa fa-pencil-square-o"></i>&nbsp; Plano de Trabalho</router-link>
                </div>
                <div v-else>
                  <g-button-ujarak type="button" color="success" size="button--size-ss" @click.native="gerarMinutaAutomatica()" ><i class="fa fa-download" aria-hidden="true"></i> Gerar Minuta</g-button-ujarak>
                  <router-link ref="planoTrabalhoLink" :to="{name: 'plano-trabalho', params: { id: $route.params.id } }" target="_blank" class="btn btn-primary btn-sm btn-flat botao-plano" style="text-decoration: none"><i class="fa fa-pencil-square-o"></i>&nbsp; Plano de Trabalho</router-link>
                </div>
              </div>
              <div class="col-md-12">
                <upload-documentos-php-novo :propDocumentos="formalizacaoDocumentos" :documentTypes="tiposDocumentos" :documentosObrigatorios="''" :local-uso="'TODOS'" :faseProposta="propsFormalizacao.ds_fase"></upload-documentos-php-novo>
              </div>
            </div>
          </div>


          <!-- Ficha de autoverificação -->
          <div class="row">
            <div class="col-md-12">
              <legend>&nbsp;Ficha de Auto Verificação</legend>
              <div v-for="item in perguntasFAV">
                <label v-if="item.nivel === 3" class="control-label col-md-10" :class="'favNivel' + item.nivel">{{item.numero}} {{item.pergunta}}</label>
                <span v-if="item.nivel !== 3" class="control-label col-md-10" :class="'favNivel' + item.nivel">{{item.pergunta}}</span>
                <div class="col-md-1" style="alignment: left" :title="'<h5>Pergunta <span class=\'realce\'>' + item.numero + '</span></h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                  <select v-model="item.resposta" class="form-control respostaFav" @change="verificarFAV" v-if="item.nivel === 3">
                    <option v-for="opcao in respostaFAV" :value="opcao.valor">{{opcao.resposta}}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>


          <!--Decisões da FORMALIZAÇÃO da proposta-->
          <div class="row">
            <div class="col-md-12">
              <legend>Decisões</legend>
              <div class="form-group col-md-12 required-field" uib-tooltip="Decisões da preparação de documentos"
                   :class="{ 'has-error' : errors.first('aprovacao')}">
                <div class="col-md-12">
                  <label class="new-control new-control-radio" style="padding-top: 8px;">
                    <input type="radio" name="aprovacao" value="APROVAR"
                           v-model="formalizacao.resultadoAprovacao"
                           v-validate="'required'"/>
                    Formalizar o Projeto
                    <div class="new-control-indicator"></div>
                  </label>
                </div>
                <div class="col-md-12">
                  <label class="new-control new-control-radio" style="padding-top: 8px;">
                    <input type="radio" name="aprovacao" value="VOLTAR_ANALISE"
                           v-model="formalizacao.resultadoAprovacao" id="msgDef"
                           />
                    Devolver para Reanálise
                    <div class="new-control-indicator"></div>
                  </label>
                </div>
                <span v-if="errors.first('aprovacao')" class="label label-danger"> {{ errors.first('aprovacao') }}</span>
              </div>

              <!-- justificativa -->
              <div class="col-md-12">
                <div v-if="formalizacao.resultadoAprovacao === 'VOLTAR_ANALISE'" class="form-group full col-md-12 required-field"
                     :class="{ 'has-error' : errors.first('justificativa')}">
                  <label class="control-label">Justificativa</label>
                  <textarea v-model="formalizacao.justificativa"
                            name="justificativa"
                            class="form-control" v-validate="'required'">
                  </textarea>
                  <span v-if="errors.first('justificativa')" class="label label-danger"> {{ errors.first('justificativa') }}</span>
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>
    </fieldset>
  </div>

</template>

<script>
  import Fav from '../../modules/fav'
  import UploadDocumentosPhpNovo from '../../modules/uploadDocumentosPhpNovo'
  import moment from 'moment'
  import BankAccountValidator from 'br-bank-account-validator'
  import geraMinuta from '../../../mixins/geraMinuta'

  export default {
    name: 'formalizacao',
    components: {
      UploadDocumentosPhpNovo,
      Fav},
    data () {
      return {
        customTokens: {
          '#': {pattern: /\d/},
          'X': { pattern: /[0-9x-xX-X]/, transform: v => v.toUpperCase() }
        },
        minutaSimplificada: false,
        tipoMinutaEcoforte: '',
        requiredFormalizationDocumentsType: [],
        documentosObrigatorios: ['Minuta', 'Plano de Trabalho'],
        formalizacaoDocumentos: [],
        aguardaEnviar: 0,
        tiposDocumentos: [],
        dataProposta: null,
        dt_analise: null,
        grantDate: null,
        dt_assinatura_convenio: null,
        dt_data_vigencia: null,
        // Insira aqui a ID do edital que possui minuta
        editaisComMinuta: [10, 12],
        perguntasFAV: [
          {'nivel': 1, 'numero': '1', 'pergunta': 'DEFERIMENTO', 'resposta': null},
          {'nivel': 2, 'numero': '', 'pergunta': 'Pré-Comitê', 'resposta': null},
          {'nivel': 3, 'numero': '1.1', 'pergunta': 'Em projetos de valor igual ou acima de R$ 3,8 milhões foi aplicado, pela COI, previamente à deliberação da instância decisória competente, o Teste de Verificação de Conformidade?', 'resposta': null},
          {'nivel': 2, 'numero': '', 'pergunta': 'Pós-Comitê', 'resposta': null},
          {'nivel': 3, 'numero': '1.2', 'pergunta': 'O despacho contém todas as assinaturas e carimbos dos componentes da instância decisória competente?', 'resposta': null},
          {'nivel': 3, 'numero': '1.3', 'pergunta': 'O despacho está datado?', 'resposta': null},
          {'nivel': 1, 'numero': '2', 'pergunta': 'PRÉ-FORMALIZAÇÃO', 'resposta': null},
          {'nivel': 2, 'numero': '', 'pergunta': 'Procedimentos Gerais', 'resposta': null},
          {'nivel': 3, 'numero': '2.1', 'pergunta': 'Foram cumpridas as condicionantes estabelecidas na análise e no deferimento?', 'resposta': null},
          {'nivel': 3, 'numero': '2.2', 'pergunta': 'Existe consulta ao CADIN - Cadastro Informatizado de Créditos não Quitados do Setor Público Federal, sem registro de ocorrências?', 'resposta': null},
          {'nivel': 3, 'numero': '2.3', 'pergunta': 'Existe consulta ao CEPIM - Cadastro de Entidades Privadas sem fins Lucrativos Impeditivas para a entidade, sem registro de ocorrências?', 'resposta': null},
          {'nivel': 3, 'numero': '2.4', 'pergunta': 'Foi verificado se existe(m) ocorrência(s) impeditiva(s) da entidade proponente e de seu(s) representante(s) legal(is) no sistema informatizado da Fundação? (Relatório 268 Sapiens)', 'resposta': null},
          {'nivel': 3, 'numero': '2.5', 'pergunta': 'Existe Certidão Negativa de Débitos Relativos a Tributos Federais e à Dívida Ativa da União ou Certidão Conjunta Positiva com Efeitos de Negativa?', 'resposta': null},
          {'nivel': 3, 'numero': '2.6', 'pergunta': 'Na minuta de convênio foram foram incluídas as cláusulas específicas do programa estruturado e de adiantamento de recursos, se for o caso?', 'resposta': null},
          {'nivel': 3, 'numero': '2.7', 'pergunta': 'Foi indicada, na minuta de convênio, a periodicidade de apresentação dos relatórios parciais conforme definido no deferimento?', 'resposta': null},
          {'nivel': 3, 'numero': '2.8', 'pergunta': 'Foi indicada, na minuta de convênio, o prazo de execução do projeto conforme definido no deferimento?', 'resposta': null},
          {'nivel': 3, 'numero': '2.9', 'pergunta': 'A minuta de convênio observou as recomendações do parecer jurídico?', 'resposta': null},
          {'nivel': 3, 'numero': '2.10', 'pergunta': 'Os signatários estão qualificados corretamente?', 'resposta': null},
          {'nivel': 3, 'numero': '2.11', 'pergunta': 'Foi encaminhada correspondência à agência condutora, com cópia para a entidade e eventuais intervenientes, contendo documentos e orientações para a formalização?', 'resposta': null},
          {'nivel': 3, 'numero': '2.12', 'pergunta': 'O instrumento jurídico está datado, assinado e rubricado pelas partes em todas as páginas, bem como contém a assinatura e identificação de testemunhas e o número da conta específica do projeto?', 'resposta': null},
          {'nivel': 3, 'numero': '2.13', 'pergunta': 'Foram registrados a data de assinatura, datas de início e fim de execução, número da conta corrente específica e o códido MCI da instituição no sistema informatizado?', 'resposta': null},
          {'nivel': 3, 'numero': '2.14', 'pergunta': 'Foi providenciada a publicação do instrumento jurídico na imprensa oficial?', 'resposta': null},
          {'nivel': 3, 'numero': '2.15', 'pergunta': 'A documentação do projeto está devidamente arquivada, com as páginas numeradas e rubricadas?', 'resposta': null},
          {'nivel': 2, 'numero': '', 'pergunta': 'Em caso de Parcerias Estratégicas', 'resposta': null},
          {'nivel': 3, 'numero': '2.16', 'pergunta': 'Foram realizados os procedimentos para verificação de internalização de recursos de parcerias estratégias, se necessário?', 'resposta': null},
          {'nivel': 3, 'numero': '2.17', 'pergunta': 'Foi verificada a situação de regularidade da entidade em instâncias específicas (FGTS, CNDT, Serasa, SPC, etc), se necessário?', 'resposta': null}
        ],
        //
        respostaFAV: [{resposta: 'Sim', valor: 1}, {resposta: 'Não', valor: 0}, {resposta: 'N/A', valor: 2}],
        formalizacao: {
          documentos: {
            formalizacao: []
          }
        },
        listaBancos: [{'codigo': '001', 'nome': 'Banco do Brasil S.A.', 'caracteresConta': 8}, {'codigo': '033', 'nome': 'Banco Santander (Brasil) S.A.', 'caracteresConta': 8, 'digitoAgencia': false}, {'codigo': '070', 'nome': 'BRB - Banco de Brasília S.A.'}, {'codigo': '104', 'nome': 'Caixa Econômica Federal', 'digitoAgencia': false}, {'codigo': '237', 'nome': 'Banco Bradesco S.A.', 'caracteresConta': 7}, {'codigo': '341', 'nome': 'Itaú Unibanco S.A.', 'caracteresConta': 5, 'digitoAgencia': false},
          {'codigo': '', 'nome': '', $isDisabled: true}, // Separador (elemento disabled)
          {'codigo': '003', 'nome': 'BANCO DA AMAZONIA S.A.'}, {'codigo': '004', 'nome': 'Banco do Nordeste do Brasil S.A.'}, {'codigo': '007', 'nome': 'BANCO NACIONAL DE DESENVOLVIMENTO ECONOMICO E SOCIAL'}, {'codigo': '010', 'nome': 'CREDICOAMO CREDITO RURAL COOPERATIVA'}, {'codigo': '011', 'nome': 'CREDIT SUISSE HEDGING-GRIFFO CORRETORA DE VALORES S.A'}, {'codigo': '012', 'nome': 'Banco Inbursa S.A.'}, {'codigo': '014', 'nome': 'STATE STREET BRASIL S.A. ? BANCO COMERCIAL'}, {'codigo': '015', 'nome': 'UBS Brasil Corretora de Câmbio, Títulos e Valores Mobiliários S.A.'}, {'codigo': '016', 'nome': 'COOPERATIVA DE CRÉDITO MÚTUO DOS DESPACHANTES DE TRÂNSITO DE SANTA CATARINA E RI'}, {'codigo': '017', 'nome': 'BNY Mellon Banco S.A.'}, {'codigo': '018', 'nome': 'Banco Tricury S.A.'}, {'codigo': '021', 'nome': 'BANESTES S.A. BANCO DO ESTADO DO ESPIRITO SANTO'}, {'codigo': '024', 'nome': 'Banco Bandepe S.A.'}, {'codigo': '025', 'nome': 'Banco Alfa S.A.'}, {'codigo': '029', 'nome': 'Banco Itaú Consignado S.A.'}, {'codigo': '036', 'nome': 'Banco Bradesco BBI S.A.'}, {'codigo': '037', 'nome': 'Banco do Estado do Pará S.A.'}, {'codigo': '040', 'nome': 'Banco Cargill S.A.'}, {'codigo': '041', 'nome': 'Banco do Estado do Rio Grande do Sul S.A.', 'caracteresConta': 9}, {'codigo': '047', 'nome': 'Banco do Estado de Sergipe S.A.'}, {'codigo': '060', 'nome': 'Confidence Corretora de Câmbio S.A.'}, {'codigo': '062', 'nome': 'Hipercard Banco Múltiplo S.A.'}, {'codigo': '063', 'nome': 'Banco Bradescard S.A.'}, {'codigo': '064', 'nome': 'GOLDMAN SACHS DO BRASIL BANCO MULTIPLO S.A.'}, {'codigo': '065', 'nome': 'Banco AndBank (Brasil) S.A.'}, {'codigo': '066', 'nome': 'BANCO MORGAN STANLEY S.A.'}, {'codigo': '069', 'nome': 'Banco Crefisa S.A.'}, {'codigo': '074', 'nome': 'Banco J. Safra S.A.'}, {'codigo': '075', 'nome': 'Banco ABN Amro S.A.'}, {'codigo': '076', 'nome': 'Banco KDB do Brasil S.A.'}, {'codigo': '077', 'nome': 'Banco Inter S.A.'}, {'codigo': '078', 'nome': 'Haitong Banco de Investimento do Brasil S.A.'}, {'codigo': '079', 'nome': 'Banco Original do Agronegócio S.A.'}, {'codigo': '080', 'nome': 'B&T CORRETORA DE CAMBIO LTDA.'}, {'codigo': '081', 'nome': 'BancoSeguro S.A.'}, {'codigo': '082', 'nome': 'BANCO TOPÁZIO S.A.'}, {'codigo': '083', 'nome': 'Banco da China Brasil S.A.'}, {'codigo': '084', 'nome': 'UNIPRIME NORTE DO PARANÁ – COOPERATIVA DE CRÉDITO LTDA'}, {'codigo': '085', 'nome': 'Cooperativa Central de Crédito – Ailos'}, {'codigo': '088', 'nome': 'BANCO RANDON S.A.'}, {'codigo': '089', 'nome': 'CREDISAN COOPERATIVA DE CRÉDITO'}, {'codigo': '091', 'nome': 'CENTRAL DE COOPERATIVAS DE ECONOMIA E CRÉDITO MÚTUO DO ESTADO DO RIO GRANDE DO S'}, {'codigo': '092', 'nome': 'BRK S.A. Crédito, Financiamento e Investimento'}, {'codigo': '093', 'nome': 'PÓLOCRED   SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORT'}, {'codigo': '094', 'nome': 'Banco Finaxis S.A.'}, {'codigo': '095', 'nome': 'Travelex Banco de Câmbio S.A.'}, {'codigo': '096', 'nome': 'Banco B3 S.A.'}, {'codigo': '097', 'nome': 'Credisis – Central de Cooperativas de Crédito Ltda.'}, {'codigo': '098', 'nome': 'Credialiança Cooperativa de Crédito Rural'}, {'codigo': '099', 'nome': 'UNIPRIME CENTRAL – CENTRAL INTERESTADUAL DE COOPERATIVAS DE CREDITO LTDA.'}, {'codigo': '100', 'nome': 'Planner Corretora de Valores S.A.'}, {'codigo': '101', 'nome': 'RENASCENCA DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '102', 'nome': 'XP INVESTIMENTOS CORRETORA DE CÂMBIO,TÍTULOS E VALORES MOBILIÁRIOS S/A'}, {'codigo': '105', 'nome': 'Lecca Crédito, Financiamento e Investimento S/A'}, {'codigo': '107', 'nome': 'Banco Bocom BBM S.A.'}, {'codigo': '108', 'nome': 'PORTOCRED S.A. – CREDITO, FINANCIAMENTO E INVESTIMENTO'}, {'codigo': '111', 'nome': 'OLIVEIRA TRUST DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIARIOS S.A.'}, {'codigo': '113', 'nome': 'Magliano S.A. Corretora de Cambio e Valores Mobiliarios'}, {'codigo': '114', 'nome': 'Central Cooperativa de Crédito no Estado do Espírito Santo – CECOOP'}, {'codigo': '117', 'nome': 'ADVANCED CORRETORA DE CÂMBIO LTDA'}, {'codigo': '119', 'nome': 'Banco Western Union do Brasil S.A.'}, {'codigo': '120', 'nome': 'BANCO RODOBENS S.A.'}, {'codigo': '121', 'nome': 'Banco Agibank S.A.'}, {'codigo': '122', 'nome': 'Banco Bradesco BERJ S.A.'}, {'codigo': '124', 'nome': 'Banco Woori Bank do Brasil S.A.'}, {'codigo': '125', 'nome': 'Plural S.A. Banco Múltiplo'}, {'codigo': '126', 'nome': 'BR Partners Banco de Investimento S.A.'}, {'codigo': '127', 'nome': 'Codepe Corretora de Valores e Câmbio S.A.'}, {'codigo': '128', 'nome': 'MS Bank S.A. Banco de Câmbio'}, {'codigo': '129', 'nome': 'UBS Brasil Banco de Investimento S.A.'}, {'codigo': '130', 'nome': 'CARUANA S.A. – SOCIEDADE DE CRÉDITO, FINANCIAMENTO E INVESTIMENTO'}, {'codigo': '131', 'nome': 'TULLETT PREBON BRASIL CORRETORA DE VALORES E CÂMBIO LTDA'}, {'codigo': '132', 'nome': 'ICBC do Brasil Banco Múltiplo S.A.'}, {'codigo': '133', 'nome': 'CONFEDERAÇÃO NACIONAL DAS COOPERATIVAS CENTRAIS DE CRÉDITO E ECONOMIA FAMILIAR E'}, {'codigo': '134', 'nome': 'BGC LIQUIDEZ DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '136', 'nome': 'CONFEDERAÇÃO NACIONAL DAS COOPERATIVAS CENTRAIS UNICRED LTDA. – UNICRED DO BRASI'}, {'codigo': '138', 'nome': 'Get Money Corretora de Câmbio S.A.'}, {'codigo': '139', 'nome': 'Intesa Sanpaolo Brasil S.A. – Banco Múltiplo'}, {'codigo': '140', 'nome': 'Easynvest – Título Corretora de Valores SA'}, {'codigo': '142', 'nome': 'Broker Brasil Corretora de Câmbio Ltda.'}, {'codigo': '143', 'nome': 'Treviso Corretora de Câmbio S.A.'}, {'codigo': '144', 'nome': 'BEXS BANCO DE CÂMBIO S/A'}, {'codigo': '145', 'nome': 'LEVYCAM – CORRETORA DE CAMBIO E VALORES LTDA.'}, {'codigo': '146', 'nome': 'GUITTA CORRETORA DE CAMBIO LTDA.'}, {'codigo': '149', 'nome': 'Facta Financeira S.A. – Crédito Financiamento e Investimento'}, {'codigo': '157', 'nome': 'ICAP do Brasil Corretora de Títulos e Valores Mobiliários Ltda.'}, {'codigo': '159', 'nome': 'Casa do Crédito S.A. Sociedade de Crédito ao Microempreendedor'}, {'codigo': '163', 'nome': 'Commerzbank Brasil S.A. – Banco Múltiplo'}, {'codigo': '169', 'nome': 'BANCO OLÉ CONSIGNADO S.A.'}, {'codigo': '173', 'nome': 'BRL Trust Distribuidora de Títulos e Valores Mobiliários S.A.'}, {'codigo': '174', 'nome': 'PEFISA S.A. – CRÉDITO, FINANCIAMENTO E INVESTIMENTO'}, {'codigo': '177', 'nome': 'Guide Investimentos S.A. Corretora de Valores'}, {'codigo': '180', 'nome': 'CM CAPITAL MARKETS CORRETORA DE CÂMBIO, TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '183', 'nome': 'SOCRED S.A. – SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO P'}, {'codigo': '184', 'nome': 'Banco Itaú BBA S.A.'}, {'codigo': '188', 'nome': 'ATIVA INVESTIMENTOS S.A. CORRETORA DE TÍTULOS, CÂMBIO E VALORES'}, {'codigo': '189', 'nome': 'HS FINANCEIRA S/A CREDITO, FINANCIAMENTO E INVESTIMENTOS'}, {'codigo': '190', 'nome': 'SERVICOOP – COOPERATIVA DE CRÉDITO DOS SERVIDORES PÚBLICOS ESTADUAIS DO RIO GRAN'}, {'codigo': '191', 'nome': 'Nova Futura Corretora de Títulos e Valores Mobiliários Ltda.'}, {'codigo': '194', 'nome': 'PARMETAL DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '196', 'nome': 'FAIR CORRETORA DE CAMBIO S.A.'}, {'codigo': '197', 'nome': 'Stone Pagamentos S.A.'}, {'codigo': '208', 'nome': 'Banco BTG Pactual S.A.'}, {'codigo': '212', 'nome': 'Banco Original S.A.'}, {'codigo': '213', 'nome': 'Banco Arbi S.A.'}, {'codigo': '217', 'nome': 'Banco John Deere S.A.'}, {'codigo': '218', 'nome': 'Banco BS2 S.A.'}, {'codigo': '222', 'nome': 'BANCO CRÉDIT AGRICOLE BRASIL S.A.'}, {'codigo': '224', 'nome': 'Banco Fibra S.A.'}, {'codigo': '233', 'nome': 'Banco Cifra S.A.'}, {'codigo': '241', 'nome': 'BANCO CLASSICO S.A.'}, {'codigo': '243', 'nome': 'Banco Máxima S.A.'}, {'codigo': '246', 'nome': 'Banco ABC Brasil S.A.'}, {'codigo': '249', 'nome': 'Banco Investcred Unibanco S.A.'}, {'codigo': '250', 'nome': 'BCV – BANCO DE CRÉDITO E VAREJO S.A.'}, {'codigo': '253', 'nome': 'Bexs Corretora de Câmbio S/A'}, {'codigo': '254', 'nome': 'PARANÁ BANCO S.A.'}, {'codigo': '259', 'nome': 'MONEYCORP BANCO DE CÂMBIO S.A.'}, {'codigo': '260', 'nome': 'Nu Pagamentos S.A.'}, {'codigo': '265', 'nome': 'Banco Fator S.A.'}, {'codigo': '266', 'nome': 'BANCO CEDULA S.A.'}, {'codigo': '268', 'nome': 'BARI COMPANHIA HIPOTECÁRIA'}, {'codigo': '269', 'nome': 'BANCO HSBC S.A.'}, {'codigo': '270', 'nome': 'Sagitur Corretora de Câmbio Ltda.'}, {'codigo': '271', 'nome': 'IB Corretora de Câmbio, Títulos e Valores Mobiliários S.A.'}, {'codigo': '272', 'nome': 'AGK CORRETORA DE CAMBIO S.A.'}, {'codigo': '273', 'nome': 'Cooperativa de Crédito Rural de São Miguel do Oeste – Sulcredi/São Miguel'}, {'codigo': '274', 'nome': 'MONEY PLUS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E A EMPRESA DE PEQUENO PORT'}, {'codigo': '276', 'nome': 'Senff S.A. – Crédito, Financiamento e Investimento'}, {'codigo': '278', 'nome': 'Genial Investimentos Corretora de Valores Mobiliários S.A.'}, {'codigo': '279', 'nome': 'COOPERATIVA DE CREDITO RURAL DE PRIMAVERA DO LESTE'}, {'codigo': '280', 'nome': 'Avista S.A. Crédito, Financiamento e Investimento'}, {'codigo': '281', 'nome': 'Cooperativa de Crédito Rural Coopavel'}, {'codigo': '283', 'nome': 'RB CAPITAL INVESTIMENTOS DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LIMITADA'}, {'codigo': '285', 'nome': 'Frente Corretora de Câmbio Ltda.'}, {'codigo': '286', 'nome': 'COOPERATIVA DE CRÉDITO RURAL DE OURO   SULCREDI/OURO'}, {'codigo': '288', 'nome': 'CAROL DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.'}, {'codigo': '289', 'nome': 'DECYSEO CORRETORA DE CAMBIO LTDA.'}, {'codigo': '290', 'nome': 'Pagseguro Internet S.A.'}, {'codigo': '292', 'nome': 'BS2 Distribuidora de Títulos e Valores Mobiliários S.A.'}, {'codigo': '293', 'nome': 'Lastro RDV Distribuidora de Títulos e Valores Mobiliários Ltda.'}, {'codigo': '296', 'nome': 'VISION S.A. CORRETORA DE CAMBIO'}, {'codigo': '298', 'nome': 'Vip’s Corretora de Câmbio Ltda.'}, {'codigo': '299', 'nome': 'SOROCRED   CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.'}, {'codigo': '300', 'nome': 'Banco de la Nacion Argentina'}, {'codigo': '301', 'nome': 'BPP Instituição de Pagamento S.A.'}, {'codigo': '306', 'nome': 'PORTOPAR DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.'}, {'codigo': '307', 'nome': 'Terra Investimentos Distribuidora de Títulos e Valores Mobiliários Ltda.'}, {'codigo': '309', 'nome': 'CAMBIONET CORRETORA DE CÂMBIO LTDA.'}, {'codigo': '310', 'nome': 'VORTX DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.'}, {'codigo': '311', 'nome': 'DOURADA CORRETORA'}, {'codigo': '312', 'nome': 'HSCM SCMEPP LTDA.'}, {'codigo': '313', 'nome': 'AMAZÔNIA CORRETORA DE CÂMBIO LTDA.'}, {'codigo': '315', 'nome': 'PI Distribuidora de Títulos e Valores Mobiliários S.A.'}, {'codigo': '318', 'nome': 'Banco BMG S.A.'}, {'codigo': '319', 'nome': 'OM DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '320', 'nome': 'China Construction Bank (Brasil) Banco Múltiplo S/A'}, {'codigo': '321', 'nome': 'CREFAZ SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E A EMPRESA DE PEQUENO PORTE LT'}, {'codigo': '322', 'nome': 'Cooperativa de Crédito Rural de Abelardo Luz – Sulcredi/Crediluz'}, {'codigo': '323', 'nome': 'MERCADOPAGO.COM REPRESENTACOES LTDA.'}, {'codigo': '324', 'nome': 'CARTOS SOCIEDADE DE CRÉDITO DIRETO S.A.'}, {'codigo': '325', 'nome': 'Órama Distribuidora de Títulos e Valores Mobiliários S.A.'}, {'codigo': '326', 'nome': 'PARATI – CREDITO, FINANCIAMENTO E INVESTIMENTO S.A.'}, {'codigo': '329', 'nome': 'QI Sociedade de Crédito Direto S.A.'}, {'codigo': '330', 'nome': 'BANCO BARI DE INVESTIMENTOS E FINANCIAMENTOS S.A.'}, {'codigo': '331', 'nome': 'Fram Capital Distribuidora de Títulos e Valores Mobiliários S.A.'}, {'codigo': '332', 'nome': 'Acesso Soluções de Pagamento S.A.'}, {'codigo': '335', 'nome': 'Banco Digio S.A.'}, {'codigo': '336', 'nome': 'Banco C6 S.A.'}, {'codigo': '340', 'nome': 'Super Pagamentos e Administração de Meios Eletrônicos S.A.'}, {'codigo': '342', 'nome': 'Creditas Sociedade de Crédito Direto S.A.'}, {'codigo': '343', 'nome': 'FFA SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE LTDA.'}, {'codigo': '348', 'nome': 'Banco XP S.A.'}, {'codigo': '349', 'nome': 'AL5 S.A. CRÉDITO, FINANCIAMENTO E INVESTIMENTO'}, {'codigo': '350', 'nome': 'COOPERATIVA DE CRÉDITO RURAL DE PEQUENOS AGRICULTORES E DA REFORMA AGRÁRIA DO CE'}, {'codigo': '352', 'nome': 'TORO CORRETORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {'codigo': '354', 'nome': 'NECTON INVESTIMENTOS  S.A. CORRETORA DE VALORES MOBILIÁRIOS E COMMODITIES'}, {'codigo': '355', 'nome': 'ÓTIMO SOCIEDADE DE CRÉDITO DIRETO S.A.'}, {'codigo': '358', 'nome': 'MIDWAY S.A. - SCFI'}, {'codigo': '359', 'nome': 'ZEMA CRÉDITO, FINANCIAMENTO E INVESTIMENTO S/A'}, {'codigo': '360', 'nome': 'TRINUS CAPITAL DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.'}, {'codigo': '362', 'nome': 'CIELO S.A.'}, {'codigo': '363', 'nome': 'SOCOPA SOCIEDADE CORRETORA PAULISTA S.A.'}, {'codigo': '364', 'nome': 'GERENCIANET S.A.'}, {'codigo': '365', 'nome': 'SOLIDUS S.A. CORRETORA DE CAMBIO E VALORES MOBILIARIOS'}, {'codigo': '366', 'nome': 'BANCO SOCIETE GENERALE BRASIL S.A.'}, {'codigo': '367', 'nome': 'VITREO DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.'}, {'codigo': '368', 'nome': 'Banco CSF S.A.'}, {'codigo': '370', 'nome': 'Banco Mizuho do Brasil S.A.'}, {'codigo': '371', 'nome': 'WARREN CORRETORA DE VALORES MOBILIÁRIOS E CÂMBIO LTDA.'}, {'codigo': '373', 'nome': 'UP.P SOCIEDADE DE EMPRÉSTIMO ENTRE PESSOAS S.A.'}, {'codigo': '374', 'nome': 'REALIZE CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.'}, {'codigo': '376', 'nome': 'BANCO J.P. MORGAN S.A.'}, {'codigo': '377', 'nome': 'MS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE LTDA'}, {'codigo': '378', 'nome': 'BBC LEASING S.A. – ARRENDAMENTO MERCANTIL'}, {'codigo': '379', 'nome': 'COOPERFORTE – COOPERATIVA DE ECONOMIA E CRÉDITO MÚTUO DOS FUNCIONÁRIOS DE INSTIT'}, {'codigo': '380', 'nome': 'PICPAY SERVICOS S.A.'}, {'codigo': '381', 'nome': 'BANCO MERCEDES-BENZ DO BRASIL S.A.'}, {'codigo': '382', 'nome': 'FIDÚCIA SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE L'}, {'codigo': '383', 'nome': 'BOLETOBANCÁRIO.COM TECNOLOGIA DE PAGAMENTOS LTDA.'}, {'codigo': '384', 'nome': 'GLOBAL FINANÇAS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO'}, {'codigo': '386', 'nome': 'NU FINANCEIRA S.A. CFI'}, {'codigo': '387', 'nome': 'Banco Toyota do Brasil S.A.'}, {'codigo': '389', 'nome': 'Banco Mercantil do Brasil S.A.'}, {'codigo': '390', 'nome': 'BANCO GM S.A.'}, {'codigo': '391', 'nome': 'COOPERATIVA DE CREDITO RURAL DE IBIAM – SULCREDI/IBIAM'}, {'codigo': '393', 'nome': 'Banco Volkswagen S.A.'}, {'codigo': '394', 'nome': 'Banco Bradesco Financiamentos S.A.'}, {'codigo': '395', 'nome': 'F D GOLD DTVM LTDA'}, {'codigo': '396', 'nome': 'HUB PAGAMENTOS S.A'}, {'codigo': '397', 'nome': 'LISTO SOCIEDADE DE CREDITO DIRETO S.A.'}, {'codigo': '398', 'nome': 'IDEAL CTVM S.A.'}, {'codigo': '399', 'nome': 'Kirton Bank S.A. – Banco Múltiplo'}, {'codigo': '400', 'nome': 'CC POUP SER FIN CO'}, {'codigo': '402', 'nome': 'COBUCCIO SCD S.A.'}, {'codigo': '403', 'nome': 'CORA SOCIEDADE DE CRÉDITO DIRETO S.A.'}, {'codigo': '404', 'nome': 'SUMUP SOCIEDADE DE CRÉDITO DIRETO S.A.'}, {'codigo': '406', 'nome': 'ACCREDITO SCD S.A.'}, {'codigo': '407', 'nome': 'ÍNDIGO INVESTIMENTOS DTVM LTDA.'}, {'codigo': '408', 'nome': 'BÔNUSCRED SOCIEDADE DE CRÉDITO DIRETO S.A.'}, {'codigo': '410', 'nome': 'PLANNER SCM S.A.'}, {'codigo': '411', 'nome': 'VIA CERTA FINANCIADORA S.A. - CFI'}, {'codigo': '412', 'nome': 'BANCO CAPITAL S.A.'}, {'codigo': '419', 'nome': 'NUMBRS SCD S.A.'}, {'codigo': '422', 'nome': 'Banco Safra S.A.'}, {'codigo': '456', 'nome': 'Banco MUFG Brasil S.A.'}, {'codigo': '464', 'nome': 'Banco Sumitomo Mitsui Brasileiro S.A.'}, {'codigo': '473', 'nome': 'Banco Caixa Geral – Brasil S.A.'}, {'codigo': '477', 'nome': 'Citibank N.A.'}, {'codigo': '479', 'nome': 'Banco ItauBank S.A.'}, {'codigo': '487', 'nome': 'DEUTSCHE BANK S.A. – BANCO ALEMAO'}, {'codigo': '488', 'nome': 'JPMorgan Chase Bank, National Association'}, {'codigo': '492', 'nome': 'ING Bank N.V.'}, {'codigo': '495', 'nome': 'Banco de La Provincia de Buenos Aires'}, {'codigo': '505', 'nome': 'Banco Credit Suisse (Brasil) S.A.'}, {'codigo': '545', 'nome': 'SENSO CORRETORA DE CAMBIO E VALORES MOBILIARIOS S.A'}, {'codigo': '600', 'nome': 'Banco Luso Brasileiro S.A.'}, {'codigo': '604', 'nome': 'Banco Industrial do Brasil S.A.'}, {'codigo': '610', 'nome': 'Banco VR S.A.'}, {'codigo': '611', 'nome': 'Banco Paulista S.A.'}, {'codigo': '612', 'nome': 'Banco Guanabara S.A.'}, {'codigo': '613', 'nome': 'Omni Banco S.A.'}, {'codigo': '623', 'nome': 'Banco Pan S.A.'}, {'codigo': '626', 'nome': 'BANCO C6 CONSIGNADO S.A.'}, {'codigo': '630', 'nome': 'Banco Smartbank S.A.'}, {'codigo': '633', 'nome': 'Banco Rendimento S.A.'}, {'codigo': '634', 'nome': 'BANCO TRIANGULO S.A.'}, {'codigo': '637', 'nome': 'BANCO SOFISA S.A.'}, {'codigo': '643', 'nome': 'Banco Pine S.A.'}, {'codigo': '652', 'nome': 'Itaú Unibanco Holding S.A.'}, {'codigo': '653', 'nome': 'BANCO INDUSVAL S.A.'}, {'codigo': '654', 'nome': 'BANCO DIGIMAIS S.A.'}, {'codigo': '655', 'nome': 'Banco Votorantim S.A.'}, {'codigo': '707', 'nome': 'Banco Daycoval S.A.'}, {'codigo': '712', 'nome': 'Banco Ourinvest S.A.'}, {'codigo': '720', 'nome': 'BCO RNX S.A.'}, {'codigo': '739', 'nome': 'Banco Cetelem S.A.'}, {'codigo': '741', 'nome': 'BANCO RIBEIRAO PRETO S.A.'}, {'codigo': '743', 'nome': 'Banco Semear S.A.'}, {'codigo': '745', 'nome': 'Banco Citibank S.A.', 'caracteresConta': 8, 'digitoAgencia': false}, {'codigo': '746', 'nome': 'Banco Modal S.A.'}, {'codigo': '747', 'nome': 'Banco Rabobank International Brasil S.A.'}, {'codigo': '748', 'nome': 'BANCO COOPERATIVO SICREDI S.A.'}, {'codigo': '751', 'nome': 'Scotiabank Brasil S.A. Banco Múltiplo'}, {'codigo': '752', 'nome': 'Banco BNP Paribas Brasil S.A.'}, {'codigo': '753', 'nome': 'Novo Banco Continental S.A. – Banco Múltiplo'}, {'codigo': '754', 'nome': 'Banco Sistema S.A.'}, {'codigo': '755', 'nome': 'Bank of America Merrill Lynch Banco Múltiplo S.A.'}, {'codigo': '756', 'nome': 'BANCO COOPERATIVO DO BRASIL S.A. – BANCOOB'}, {'codigo': '757', 'nome': 'BANCO KEB HANA DO BRASIL S.A.'}]
      }
    },
    props: ['propsFormalizacao', 'propsAdiantaveis'],
    inject: ['$validator'],
    provide () {
      return {
        $validator: this.$validator
      }
    },
    computed: {
      datas: async function () {
        if (this.formalizacao.dt_assinatura_convenio) {
          this.formalizacao.dt_data_vigencia = moment(this.formalizacao.dt_assinatura_convenio).add(parseInt(this.propsFormalizacao.periodo_vigencia), 'M')
          this.formalizacao.dt_data_vigencia = moment(this.formalizacao.dt_data_vigencia).format('YYYY-MM-DD HH:mm:ss')
          this.formalizacao.dt_assinatura_convenio = moment(this.formalizacao.dt_assinatura_convenio).format('YYYY-MM-DD HH:mm:ss')
        } else {
          this.formalizacao.dt_data_vigencia = moment(this.formalizacao.dt_proposta).add(parseInt(this.propsFormalizacao.periodo_vigencia), 'M')
          this.formalizacao.dt_data_vigencia = moment(this.formalizacao.dt_data_vigencia).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      // Forçar para que o número da agência fique igual ao nome que é a entrada no formulário
      codigoAgencia () {
        this.formalizacao.ds_agencia_numero = this.formalizacao.ds_agencia_nome
      }
    },
    watch: {
      propsFormalizacao () {
        this.formalizacao = this.propsFormalizacao
        if (this.formalizacao.perguntasFAV) {
          this.perguntasFAV = this.formalizacao.perguntasFAV
        } else {
          if (this.perguntasFAV) {
            this.formalizacao.perguntasFAV = this.perguntasFAV
          }
        }
        this.verificarFAV()
        this.formalizacao.ds_agencia_banco = '001'
        this.initAgenciaSelecionada()
        // A partir de julho/2021 não pegar as datas do t_tarefas
        // await this.buscaDatas()
        this.$forceUpdate()
        // Ajusta as datas
        // this.grantDate = moment(this.formalizacao.grantDate, moment.defaultFormat).toDate()
        // this.dt_proposta = moment(this.formalizacao.dt_proposta, moment.defaultFormat).toDate()
        // this.dt_analise = moment(this.formalizacao.dt_analise, moment.defaultFormat).toDate()
        // this.dt_assinatura_convenio = moment(this.formalizacao.dt_assinatura_convenio, moment.defaultFormat).toDate()
        // this.dt_data_vigencia = moment(this.formalizacao.dt_data_vigencia, moment.defaultFormat).toDate()
        if (this.formalizacao.documentos) {
          if (this.formalizacao.documentos.formalizacao.length <= 0) {
            this.formalizacao.documentos.formalizacao = []
          } else {
            this.formalizacaoDocumentos = this.formalizacao.documentos.formalizacao
          }
        }
        this.$emit('formalizacaoProposta', this.formalizacao)
        // this.preparaArquivos()
        this.$forceUpdate()
      },
      formalizacaoDocumentos () {
        if (this.formalizacaoDocumentos) {
          this.formalizacao.documentos.formalizacao = this.formalizacaoDocumentos
        }
      }
    },
    mounted () {
      this.datas()
      // A partir de julho/2021 não pegar as datas do t_tarefas
      // this.buscaDatas()
      // this.perguntasFAV = _.cloneDeep(this.propsFormalizacao.perguntasFAV)
      // this.initAgenciaSelecionada()
    },
    created () {
      let vm = this
      // Data de assinatura de convênio deve ser posterior a data de deferimento
      this.$validator.extend('depoisDeferimento', {
        getMessage (field, val) {
          return 'data da assinatura de convênio deve ser igual ou posterior a data de deferimento'
        },
        validate (value, field) {
          // Pega somente as datas sem horário
          let dataAssinatura = moment(vm.formalizacao.dt_assinatura_convenio, 'YYYY-MM-DD-hh:mm:ss').format('DD/MM/YYYY')
          console.log(dataAssinatura)
          let dataDeferimento = moment(vm.formalizacao.dt_deferimento, 'YYYY-MM-DD-hh:mm:ss').format('DD/MM/YYYY')
          console.log(dataDeferimento)
          // Converte as duas datas em moment object e compara para ver se é igual ou anterior
          return moment(dataAssinatura, 'YYYY-MM-DD').isSameOrAfter(moment(dataDeferimento, 'YYYY-MM-DD'))
        }
      })
      // Data de assinatura de convênio deve ser posterior a data de analise
      this.$validator.extend('depoisAnalise', {
        getMessage (field, val) {
          return 'data da assinatura de convênio deve ser igual ou posterior a data de analise'
        },
        validate (value, field) {
          // Pega somente as datas sem horário
          let dataAssinatura = moment(vm.formalizacao.dt_assinatura_convenio, 'YYYY-MM-DD-hh:mm:ss').format('DD/MM/YYYY')
          let dataAnalise = moment(vm.formalizacao.dt_analise, 'YYYY-MM-DD-hh:mm:ss').format('DD/MM/YYYY')
          // Converte as duas datas em moment object e compara para ver se é igual ou anterior
          return moment(dataAssinatura, 'YYYY-MM-DD').isSameOrAfter(moment(dataAnalise, 'YYYY-MM-DD'))
        }
      })// Data de assinatura de convênio deve ser posterior a data de analise
      this.$validator.extend('hojeAnterior', {
        getMessage (field, val) {
          return `data ${field} deve ser igual ou anterior a data de hoje.`
        },
        validate (value, field) {
          let newdate = moment(value, 'YYYY-MM-DD-hh:mm:ss')
          if (newdate.isValid()) {
            let datenow = moment()
            return newdate.isSameOrBefore(datenow, 'date')
          } else {
            return false
          }
        }
      })
      this.buscaArquivosEsperados()
      // A partir de julho/2021 não pegar as datas do t_tarefas
      // this.buscaDatas()
      this.verificarFAV()
    },
    methods: {
      verificarFAV () {
        let irregulares = _.filter(this.perguntasFAV, function (o) { return o.nivel === 3 && o.resposta === 0 })
        let pendentes = _.filter(this.perguntasFAV, function (o) { return o.nivel === 3 && _.isNull(o.resposta) })
        this.$emit('validacaoFormalizacao', {'tag': 'formalizacaoProjetoFavNao', 'ativo': irregulares.length > 0, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Há <b>' + irregulares.length + ' ' + (irregulares.length > 1 ? 'questões' : 'questão') + ' na FAV</b> que não permitem Concluir'})
        this.$emit('validacaoFormalizacao', {'tag': 'formalizacaoProjetoFavPendente', 'ativo': pendentes.length > 0, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Há <b>' + pendentes.length + ' ' + (pendentes.length > 1 ? 'questões' : 'questão') + ' pendente de escolha na FAV</b>'})
      },
      buscaArquivosEsperados () {
        axiosLaravel.get('configuracoes/').then((response) => {
          this.tiposDocumentos.push(response.data.configuracao_proposta.minuta)
          this.tiposDocumentos.push(response.data.configuracao_proposta.plano_trabalho)
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      initAgenciaSelecionada () {
        console.log('INIT AGENCIA SELECIONADA')
        if (!this.formalizacao.hasOwnProperty('agenciaSelecionada')) {
          this.formalizacao.agenciaSelecionada = {
            agencia: '0000',
            nomeAgencia: 'NOME_AGENCIA',
            emailAgencia: 'EMAIL_AGENCIA',
            informacoesGerenteGeral: {
              nome: 'NOME',
              cpf: '00000000000',
              estadoCivil: '',
              municipioResidencia: 'MUNICIPIO_RESIDENCIA',
              email: 'EMAIL_GERENTE',
              rg: '000000000'
            },
            cnpj: '00000000'
          }
        }
      },
      async buscaDatas () {
        await axiosLaravel.post('processos/historico/', {'id_proposta': this.$route.params.id, 'tipo': 'USUARIO'}).then((response) => {
          // Pega a última tarefa de Solicitação ou Revisão da proposta ordenada por id
          let ultima = _.last(_.sortBy(_.filter(response.data, function (t) {
            return t.nome === 'SOLICITACAO' || t.nome === 'REVISAO'
          }), ['id']))
          if (!_.isUndefined(ultima)) {
            this.formalizacao.dt_proposta = ultima.termino
          }
          this.$forceUpdate()
          let analise = _.last(_.sortBy(_.filter(response.data, function (t) {
            return t.nome === 'ANALISE'
          }), ['id']))
          this.formalizacao.dt_analise = analise.termino
          this.$forceUpdate()
          // Suporte 60806 - a data do deferimento não é a mesma do campo de término do t_tarefas
          let deferimento = _.last(_.sortBy(_.filter(response.data, function (t) {
            return t.nome === 'DEFERIMENTO'
          }), ['id']))
          this.formalizacao.dt_deferimento = deferimento.termino
          this.$forceUpdate()
        })
      },
      // ajustaDatas () {
      //   this.formalizacao.dataProposta = moment(this.dataProposta, 'DD/MM/YYYY', true).format('YYYY-MM-DD')
      //   this.formalizacao.dt_analise = moment(this.dt_analise, 'DD/MM/YYYY', true).format('YYYY-MM-DD')
      //   this.formalizacao.grantDate = moment(this.grantDate, 'DD/MM/YYYY', true).format('YYYY-MM-DD')
      //   this.formalizacao.dt_assinatura_convenio = moment(this.dt_assinatura_convenio, 'DD/MM/YYYY', true).format('YYYY-MM-DD')
      //   this.formalizacao.dt_data_vigencia = moment(this.dt_data_vigencia, 'DD/MM/YYYY', true).format('YYYY-MM-DD')
      //   this.formalizacao.dataProposta = moment(this.dataProposta, 'DD/MM/YYYY', true).format('YYYY-MM-DD')
      //   this.formalizacao.analysisDate = moment(this.analysisDate, 'DD/MM/YYYY', true).toISOString()
      //   this.formalizacao.grantDate = moment(this.grantDate, 'DD/MM/YYYY', true).format('YYYY-MM-DD')
      //   this.formalizacao.agreementAssignmentDate = moment(this.agreementAssignmentDate, 'DD/MM/YYYY', true).format('YYYY-MM-DD')
      // },
      // onSave () {
      //   // this.ajustaDatas()
      //  // this.analise.approval.proposal = this.analise.proposal
      //   this.$snotify.info('Atualizando Validação', {timeout: 0})
      //   axios.post('proxy/project/document-preparation/', this.analise).then((response) => {
      //     this.$snotify.clear()
      //     this.$snotify.success('Validação salva com sucesso')
      //   })
      //     .catch((error) => {
      //       this.$snotify.clear()
      //
      //       this.$root.trataErro(error)
      //     })
      // },
      // onConclude () {
      //   // this.ajustaDatas()
      //   this.$validator.validateAll().then((result) => {
      //     if (!result) {
      //       this.$snotify.error('Formulario possui erros favor verificar')
      //     } else {
      //       this.enviaBackEnd()
      //     }
      //   })
      // },
      // enviaBackEnd () {
      //   this.aguardaEnviar = 1
      //   this.$snotify.async('Validando proposta. Por favor, aguarde...', {timeout: 0})
      //   axios.put('proxy/project/document-preparation/' + this.approval.id, this.approval).then((response) => {
      //     this.$snotify.clear()
      //     this.$snotify.success('Formalização concluída com sucesso')
      //     setTimeout(() => { this.$router.go(-1) }, 2000)
      //   })
      //     .catch((error) => {
      //       this.aguardaEnviar = 0
      //       this.$snotify.clear()
      //       this.$root.trataErro(error)
      //     })
      // },
      onReturn () {
        this.$router.go(-1)
      },
      preparaArquivos () {
        this.analise.documentDraft = []
        if (this.analise.proposal.documentDraft) {
          this.analise.documentDraft.push(this.analise.proposal.documentDraft)
        }
        if (this.analise.proposal.documentWorkPlan) {
          this.analise.documentDraft.push(this.analise.proposal.documentWorkPlan)
        }
      },
      validaDatas () {
        // Força atualização formato da data.
        this.formalizacao.dt_proposta = moment(this.formalizacao.dt_proposta).format('YYYY-MM-DD HH:mm:ss')
        this.formalizacao.dt_analise = moment(this.formalizacao.dt_analise).format('YYYY-MM-DD HH:mm:ss')
        this.formalizacao.dt_deferimento = moment(this.formalizacao.dt_deferimento).format('YYYY-MM-DD HH:mm:ss')
        if (this.formalizacao.dt_analise) {
          if (this.formalizacao.dt_proposta) {
            if (this.formalizacao.dt_analise < this.formalizacao.dt_proposta) {
              this.$snotify.error('Data da análise não pode ser anterior a data da proposta.')
              return
            }
          }
        }
        if (this.formalizacao.dt_deferimento) {
          if (this.formalizacao.dt_analise) {
            if (this.formalizacao.dt_deferimento < this.formalizacao.dt_analisea) {
              this.$snotify.error('Data do deferimento não pode ser anterior a data da análise.')
              return
            }
          }
        }
      },
      // 68615 - Verificações adicionais em conta de adiantamento
      verificarInputContaAdiantamento () {
        if (this.formalizacao.ds_agencia_adiantamento && this.formalizacao.ds_conta_adiantamento) {
          this.validandoDadosBancarios(this.formalizacao.ds_agencia_adiantamento, this.formalizacao.ds_conta_adiantamento)
        }
      },
      validandoDadosBancarios (agenciaVal, contaVal) {
        console.log('Validando dados bancários - conta adiantamento')
        if (agenciaVal && contaVal) {
          let banco = '001'
          let conta = _.words(contaVal)
          let digitosConta = _.get(_.head(_.filter(this.listaBancos, ['codigo', banco])), 'caracteresConta') // Se tiver o tamanho da conta na lista de bancos então completa com zeros para o usuário não ter que fazer
          let contaSemDV = digitosConta ? _.padStart(conta[0], digitosConta, '0') : conta[0]
          let contaDV = conta[1] || ''

          let agencia = _.words(agenciaVal)
          let agenciaSemDV = agencia[0] || ''
          let agenciaDV = agencia[1] || ''
          console.log(agencia, conta, banco)
          try {
            BankAccountValidator.validate({
              bankNumber: banco,
              agencyNumber: agenciaSemDV,
              agencyCheckNumber: agenciaDV,
              accountNumber: contaSemDV,
              accountCheckNumber: contaDV
            })
            console.log('PASSOU')
            return true
          } catch (e) {
            console.log('Erro na validação de dados bancários', e.message)
            this.$snotify.error(e.message)
            this.formalizacao.ds_agencia_adiantamento = ''
            this.formalizacao.ds_conta_adiantamento = ''
            return e.message
          }
        }
        console.log('NÃO ENCONTROU DADOS PARA COMPARAR')
        return false
      },
      limitarDigitosMCI () {
        if (this.formalizacao.mci.length > 9) {
          this.formalizacao.mci = this.formalizacao.mci.slice(0, 9)
        }
      },
      async gerarMinutaAutomatica () {
        // 1 - Pegar o ID da proposta
        // let projetoId = this.propsFormalizacao.ds_codigo_projeto_erp
        // 2 - Consumir Endpoint do kennedy
        // 3 - Preencher a Minuta Automática de Acordo com o Modelo
        // https://sgphomologacao.fbb.org.br:5443/dadosMinutaPorProposta/4379 <<- usar essa proposta por enquanto AKA response
        // 4 - Devolver o Arquivo para Download para o usuário
        let fkEdital = _.includes(this.editaisComMinuta, this.formalizacao.fk_edital) ? this.formalizacao.fk_edital : 0
        this.$snotify.async('Gerando Minuta. Por favor, aguarde...', {timeout: 1000})
        if (await geraMinuta.methods.gerarMinuta(this.$route.params.id, this.minutaSimplificada, fkEdital, this.tipoMinutaEcoforte)) {
          this.$snotify.clear()
          this.$snotify.success('Minuta Gerada com sucesso!')
          const url = this.$router.resolve({
            name: 'plano-trabalho',
            params: { id: this.$route.params.id },
            query: { print: true }
          }).href
          window.open(url, '_blank')
        } else {
          this.$snotify.clear()
          this.$snotify.error('Modelo de minuta não cadastrada para o tipo de proposta.')
        }
      }
    }
  }
</script>

<style scoped>
.botao-plano {
  height: 35px !important;
}
</style>
