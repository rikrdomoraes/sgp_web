<template>
  <div class="col-md-12">
    <div class="box box-widget" >
      <div class="box-header with-border">
        <h3 class="box-title">Dados bancários</h3>
      </div>
      <div class="box-body">
        <div class="row" >
          <div class="col-md-6">

            <!-- bank -->
            <div class="form-group required-field" :class="{ 'has-error' : errors.first('banco')}">
              <label  class="control-label col-md-4">Banco:</label>
              <div class="col-md-7 ">
                <!--CÓDIGO ALTERADO EM 22/12/2020 POR AKIRA - SUPORTE 59454-->
                <!--<div>-->
                  <!--<the-mask v-model="nota.banco" name="banco" class="form-control text-right" type="text"-->
                            <!--:mask="['####']" v-validate="{required: nota.formaPagamento !== 4}" change="$ctrl.onChangeBank()">-->
                  <!--</the-mask>-->
                <!--</div>-->
                <select name="banco" class="form-control" for="banco" v-model="nota.banco">
                  <option disabled selected>Escolha um banco</option>
                  <option v-for="banco in bancosMain" v-bind:value="banco.value">{{banco.value + ' - ' + banco.label}}</option>
                  <option disabled>--------------------------------------------------------------------------</option>
                  <option v-for="banco in bancos" v-bind:value="banco.value">{{banco.value + ' - ' + banco.label}}</option>
                </select>
                <span v-if="errors.first('banco')" class="label label-danger"> {{ errors.first('banco') }}</span>
              </div>
            </div>

            <!-- conta -->
            <div class="form-group required-field" :class="{ 'has-error' : errors.first('conta corrente')}">
              <label for="conta corrente" class="control-label col-md-4">Conta Corrente:</label>
              <div class="col-md-7 ">
                <div>
                  <the-mask v-model="nota.conta" name="conta corrente"  class="form-control text-right" type="text"
                            v-validate="'required'" :mask="['###-X', '####-X', '#####-X', '######-X', '#######-X', '########-X', '#########-X']">
                  </the-mask>
                </div>
                <span v-if="errors.first('conta corrente')" class="label label-danger"> {{ errors.first('conta corrente') }}</span>
              </div>
            </div>
          </div>

          <div class="col-md-6">

            <!-- agencia -->
            <div class="form-group required-field"
                 :class="{ 'has-error' : errors.first('agência')}">
              <label for="agência" class="control-label col-md-4">Agência:</label>
              <div class="col-md-7">
                <div>
                  <the-mask v-model="nota.agencia" name="agência" class="form-control text-right" type="text" :mask="['####-X']" :tokens="customTokens"
                            v-validate="'required|agency'"></the-mask>
                </div>
                <span v-if="errors.first('agência')" class="label label-danger"> {{ errors.first('agência') }}</span>
              </div>
            </div>

          </div>
        </div>
      </div> <!-- ./box-body -->
    </div>
  </div>
</template>

<script>
  export default {
    name: 'dados-bancarios-solicitacao',
    data () {
      return {
        nota: {
          dados_bancarios: {}
        },
        customTokens: {
          '#': {pattern: /\d/},
          'X': { pattern: /[0-9x-xX-X]/, transform: v => v.toUpperCase() }
        },
        bancosMain: [{value: '001', label: 'Banco do Brasil S.A.'},
          {value: '033', label: 'BANCO SANTANDER (BRASIL) S.A.'},
          {value: '070', label: 'BRB – BANCO DE BRASILIA S.A.'},
          {value: '104', label: 'CAIXA ECONOMICA FEDERAL'},
          {value: '237', label: 'Banco Bradesco S.A.'},
          {value: '341', label: 'ITAÚ UNIBANCO S.A.'}],
        bancos: [{value: '332', label: 'Acesso Soluções de Pagamento S.A.'},
          {value: '117', label: 'ADVANCED CORRETORA DE CÂMBIO LTDA'},
          {value: '272', label: 'AGK CORRETORA DE CAMBIO S.A.'},
          {value: '349', label: 'AL5 S.A. CRÉDITO, FINANCIAMENTO E INVESTIMENTO'},
          {value: '313', label: 'AMAZÔNIA CORRETORA DE CÂMBIO LTDA.'},
          {value: '188', label: 'ATIVA INVESTIMENTOS S.A. CORRETORA DE TÍTULOS, CÂMBIO E VALORES'},
          {value: '280', label: 'Avista S.A. Crédito, Financiamento e Investimento'},
          {value: '080', label: 'B&T CORRETORA DE CAMBIO LTDA.'},
          {value: '246', label: 'Banco ABC Brasil S.A.'},
          {value: '075', label: 'Banco ABN Amro S.A.'},
          {value: '121', label: 'Banco Agibank S.A.'},
          {value: '025', label: 'Banco Alfa S.A.'},
          {value: '065', label: 'Banco AndBank (Brasil) S.A.'},
          {value: '213', label: 'Banco Arbi S.A.'},
          {value: '096', label: 'Banco B3 S.A.'},
          {value: '024', label: 'Banco Bandepe S.A.'},
          {value: '330', label: 'BANCO BARI DE INVESTIMENTOS E FINANCIAMENTOS S.A.'},
          {value: '318', label: 'Banco BMG S.A.'},
          {value: '752', label: 'Banco BNP Paribas Brasil S.A.'},
          {value: '107', label: 'Banco Bocom BBM S.A.'},
          {value: '063', label: 'Banco Bradescard S.A.'},
          {value: '036', label: 'Banco Bradesco BBI S.A.'},
          {value: '122', label: 'Banco Bradesco BERJ S.A.'},
          {value: '394', label: 'Banco Bradesco Financiamentos S.A.'},
          {value: '218', label: 'Banco BS2 S.A.'},
          {value: '208', label: 'Banco BTG Pactual S.A.'},
          {value: '626', label: 'BANCO C6 CONSIGNADO S.A.'},
          {value: '336', label: 'Banco C6 S.A.'},
          {value: '473', label: 'Banco Caixa Geral – Brasil S.A.'},
          {value: '412', label: 'BANCO CAPITAL S.A.'},
          {value: '040', label: 'Banco Cargill S.A.'},
          {value: '266', label: 'BANCO CEDULA S.A.'},
          {value: '739', label: 'Banco Cetelem S.A.'},
          {value: '233', label: 'Banco Cifra S.A.'},
          {value: '745', label: 'Banco Citibank S.A.'},
          {value: '241', label: 'BANCO CLASSICO S.A.'},
          {value: '756', label: 'BANCO COOPERATIVO DO BRASIL S.A. – BANCOOB'},
          {value: '748', label: 'BANCO COOPERATIVO SICREDI S.A.'},
          {value: '222', label: 'BANCO CRÉDIT AGRICOLE BRASIL S.A.'},
          {value: '505', label: 'Banco Credit Suisse (Brasil) S.A.'},
          {value: '069', label: 'Banco Crefisa S.A.'},
          {value: '368', label: 'Banco CSF S.A.'},
          {value: '003', label: 'BANCO DA AMAZONIA S.A.'},
          {value: '083', label: 'Banco da China Brasil S.A.'},
          {value: '707', label: 'Banco Daycoval S.A.'},
          {value: '300', label: 'Banco de la Nacion Argentina'},
          {value: '495', label: 'Banco de La Provincia de Buenos Aires'},
          {value: '654', label: 'BANCO DIGIMAIS S.A.'},
          {value: '335', label: 'Banco Digio S.A.'},
          {value: '047', label: 'Banco do Estado de Sergipe S.A.'},
          {value: '037', label: 'Banco do Estado do Pará S.A.'},
          {value: '041', label: 'Banco do Estado do Rio Grande do Sul S.A.'},
          {value: '004', label: 'Banco do Nordeste do Brasil S.A.'},
          {value: '265', label: 'Banco Fator S.A.'},
          {value: '224', label: 'Banco Fibra S.A.'},
          {value: '094', label: 'Banco Finaxis S.A.'},
          {value: '390', label: 'BANCO GM S.A.'},
          {value: '612', label: 'Banco Guanabara S.A.'},
          {value: '269', label: 'BANCO HSBC S.A.'},
          {value: '012', label: 'Banco Inbursa S.A.'},
          {value: '604', label: 'Banco Industrial do Brasil S.A.'},
          {value: '653', label: 'BANCO INDUSVAL S.A.'},
          {value: '077', label: 'Banco Inter S.A.'},
          {value: '249', label: 'Banco Investcred Unibanco S.A.'},
          {value: '184', label: 'Banco Itaú BBA S.A.'},
          {value: '029', label: 'Banco Itaú Consignado S.A.'},
          {value: '479', label: 'Banco ItauBank S.A.'},
          {value: '074', label: 'Banco J. Safra S.A.'},
          {value: '376', label: 'BANCO J.P. MORGAN S.A.'},
          {value: '217', label: 'Banco John Deere S.A.'},
          {value: '076', label: 'Banco KDB do Brasil S.A.'},
          {value: '757', label: 'BANCO KEB HANA DO BRASIL S.A.'},
          {value: '600', label: 'Banco Luso Brasileiro S.A.'},
          {value: '243', label: 'Banco Máxima S.A.'},
          {value: '389', label: 'Banco Mercantil do Brasil S.A.'},
          {value: '381', label: 'BANCO MERCEDES-BENZ DO BRASIL S.A.'},
          {value: '370', label: 'Banco Mizuho do Brasil S.A.'},
          {value: '746', label: 'Banco Modal S.A.'},
          {value: '066', label: 'BANCO MORGAN STANLEY S.A.'},
          {value: '456', label: 'Banco MUFG Brasil S.A.'},
          {value: '007', label: 'BANCO NACIONAL DE DESENVOLVIMENTO ECONOMICO E SOCIAL'},
          {value: '169', label: 'BANCO OLÉ CONSIGNADO S.A.'},
          {value: '079', label: 'Banco Original do Agronegócio S.A.'},
          {value: '212', label: 'Banco Original S.A.'},
          {value: '712', label: 'Banco Ourinvest S.A.'},
          {value: '623', label: 'Banco Pan S.A.'},
          {value: '611', label: 'Banco Paulista S.A.'},
          {value: '643', label: 'Banco Pine S.A.'},
          {value: '747', label: 'Banco Rabobank International Brasil S.A.'},
          {value: '088', label: 'BANCO RANDON S.A.'},
          {value: '633', label: 'Banco Rendimento S.A.'},
          {value: '741', label: 'BANCO RIBEIRAO PRETO S.A.'},
          {value: '120', label: 'BANCO RODOBENS S.A.'},
          {value: '422', label: 'Banco Safra S.A.'},
          {value: '743', label: 'Banco Semear S.A.'},
          {value: '754', label: 'Banco Sistema S.A.'},
          {value: '630', label: 'Banco Smartbank S.A.'},
          {value: '366', label: 'BANCO SOCIETE GENERALE BRASIL S.A.'},
          {value: '637', label: 'BANCO SOFISA S.A.'},
          {value: '464', label: 'Banco Sumitomo Mitsui Brasileiro S.A.'},
          {value: '082', label: 'BANCO TOPÁZIO S.A.'},
          {value: '387', label: 'Banco Toyota do Brasil S.A.'},
          {value: '634', label: 'BANCO TRIANGULO S.A.'},
          {value: '018', label: 'Banco Tricury S.A.'},
          {value: '393', label: 'Banco Volkswagen S.A.'},
          {value: '655', label: 'Banco Votorantim S.A.'},
          {value: '610', label: 'Banco VR S.A.'},
          {value: '119', label: 'Banco Western Union do Brasil S.A.'},
          {value: '124', label: 'Banco Woori Bank do Brasil S.A.'},
          {value: '348', label: 'Banco XP S.A.'},
          {value: '081', label: 'BancoSeguro S.A.'},
          {value: '021', label: 'BANESTES S.A. BANCO DO ESTADO DO ESPIRITO SANTO'},
          {value: '755', label: 'Bank of America Merrill Lynch Banco Múltiplo S.A.'},
          {value: '268', label: 'BARI COMPANHIA HIPOTECÁRIA'},
          {value: '378', label: 'BBC LEASING S.A. – ARRENDAMENTO MERCANTIL'},
          {value: '250', label: 'BCV – BANCO DE CRÉDITO E VAREJO S.A.'},
          {value: '144', label: 'BEXS BANCO DE CÂMBIO S/A'},
          {value: '253', label: 'Bexs Corretora de Câmbio S/A'},
          {value: '134', label: 'BGC LIQUIDEZ DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'},
          {value: '017', label: 'BNY Mellon Banco S.A.'},
          {value: '383', label: 'BOLETOBANCÁRIO.COM TECNOLOGIA DE PAGAMENTOS LTDA.'},
          {value: '408', label: 'BÔNUSCRED SOCIEDADE DE CRÉDITO DIRETO S.A.'},
          {value: '301', label: 'BPP Instituição de Pagamento S.A.'},
          {value: '126', label: 'BR Partners Banco de Investimento S.A.'},
          {value: '092', label: 'BRK S.A. Crédito, Financiamento e Investimento'},
          {value: '173', label: 'BRL Trust Distribuidora de Títulos e Valores Mobiliários S.A.'},
          {value: '142', label: 'Broker Brasil Corretora de Câmbio Ltda.'},
          {value: '292', label: 'BS2 Distribuidora de Títulos e Valores Mobiliários S.A.'},
          {value: '309', label: 'CAMBIONET CORRETORA DE CÂMBIO LTDA.'},
          {value: '288', label: 'CAROL DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.'},
          {value: '324', label: 'CARTOS SOCIEDADE DE CRÉDITO DIRETO S.A.'},
          {value: '130', label: 'CARUANA S.A. – SOCIEDADE DE CRÉDITO, FINANCIAMENTO E INVESTIMENTO'},
          {value: '159', label: 'Casa do Crédito S.A. Sociedade de Crédito ao Microempreendedor'},
          {value: '114', label: 'Central Cooperativa de Crédito no Estado do Espírito Santo – CECOOP'},
          {value: '091', label: 'CENTRAL DE COOPERATIVAS DE ECONOMIA E CRÉDITO MÚTUO DO ESTADO DO RIO GRANDE DO S'},
          {value: '320', label: 'China Construction Bank (Brasil) Banco Múltiplo S/A'},
          {value: '362', label: 'CIELO S.A.'},
          {value: '477', label: 'Citibank N.A.'},
          {value: '180', label: 'CM CAPITAL MARKETS CORRETORA DE CÂMBIO, TÍTULOS E VALORES MOBILIÁRIOS LTDA'},
          {value: '127', label: 'Codepe Corretora de Valores e Câmbio S.A.'},
          {value: '163', label: 'Commerzbank Brasil S.A. – Banco Múltiplo'},
          {value: '133', label: 'CONFEDERAÇÃO NACIONAL DAS COOPERATIVAS CENTRAIS DE CRÉDITO E ECONOMIA FAMILIAR E'},
          {value: '136', label: 'CONFEDERAÇÃO NACIONAL DAS COOPERATIVAS CENTRAIS UNICRED LTDA. – UNICRED DO BRASI'},
          {value: '060', label: 'Confidence Corretora de Câmbio S.A.'},
          {value: '085', label: 'Cooperativa Central de Crédito – Ailos'},
          {value: '016', label: 'COOPERATIVA DE CRÉDITO MÚTUO DOS DESPACHANTES DE TRÂNSITO DE SANTA CATARINA E RI'},
          {value: '281', label: 'Cooperativa de Crédito Rural Coopavel'},
          {value: '322', label: 'Cooperativa de Crédito Rural de Abelardo Luz – Sulcredi/Crediluz'},
          {value: '391', label: 'COOPERATIVA DE CREDITO RURAL DE IBIAM – SULCREDI/IBIAM'},
          {value: '286', label: 'COOPERATIVA DE CRÉDITO RURAL DE OURO   SULCREDI/OURO'},
          {value: '350', label: 'COOPERATIVA DE CRÉDITO RURAL DE PEQUENOS AGRICULTORES E DA REFORMA AGRÁRIA DO CE'},
          {value: '279', label: 'COOPERATIVA DE CREDITO RURAL DE PRIMAVERA DO LESTE'},
          {value: '273', label: 'Cooperativa de Crédito Rural de São Miguel do Oeste – Sulcredi/São Miguel'},
          {value: '379', label: 'COOPERFORTE – COOPERATIVA DE ECONOMIA E CRÉDITO MÚTUO DOS FUNCIONÁRIOS DE INSTIT'},
          {value: '403', label: 'CORA SOCIEDADE DE CRÉDITO DIRETO S.A.'},
          {value: '098', label: 'Credialiança Cooperativa de Crédito Rural'},
          {value: '010', label: 'CREDICOAMO CREDITO RURAL COOPERATIVA'},
          {value: '089', label: 'CREDISAN COOPERATIVA DE CRÉDITO'},
          {value: '097', label: 'Credisis – Central de Cooperativas de Crédito Ltda.'},
          {value: '011', label: 'CREDIT SUISSE HEDGING-GRIFFO CORRETORA DE VALORES S.A'},
          {value: '342', label: 'Creditas Sociedade de Crédito Direto S.A.'},
          {value: '321', label: 'CREFAZ SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E A EMPRESA DE PEQUENO PORTE LT'},
          {value: '289', label: 'DECYSEO CORRETORA DE CAMBIO LTDA.'},
          {value: '487', label: 'DEUTSCHE BANK S.A. – BANCO ALEMAO'},
          {value: '140', label: 'Easynvest – Título Corretora de Valores SA'},
          {value: '149', label: 'Facta Financeira S.A. – Crédito Financiamento e Investimento'},
          {value: '196', label: 'FAIR CORRETORA DE CAMBIO S.A.'},
          {value: '343', label: 'FFA SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE LTDA.'},
          {value: '382', label: 'FIDÚCIA SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE L'},
          {value: '331', label: 'Fram Capital Distribuidora de Títulos e Valores Mobiliários S.A.'},
          {value: '285', label: 'Frente Corretora de Câmbio Ltda.'},
          {value: '278', label: 'Genial Investimentos Corretora de Valores Mobiliários S.A.'},
          {value: '364', label: 'GERENCIANET S.A.'},
          {value: '138', label: 'Get Money Corretora de Câmbio S.A.'},
          {value: '384', label: 'GLOBAL FINANÇAS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO'},
          {value: '064', label: 'GOLDMAN SACHS DO BRASIL BANCO MULTIPLO S.A.'},
          {value: '177', label: 'Guide Investimentos S.A. Corretora de Valores'},
          {value: '146', label: 'GUITTA CORRETORA DE CAMBIO LTDA.'},
          {value: '078', label: 'Haitong Banco de Investimento do Brasil S.A.'},
          {value: '062', label: 'Hipercard Banco Múltiplo S.A.'},
          {value: '189', label: 'HS FINANCEIRA S/A CREDITO, FINANCIAMENTO E INVESTIMENTOS'},
          {value: '396', label: 'HUB PAGAMENTOS S.A'},
          {value: '271', label: 'IB Corretora de Câmbio, Títulos e Valores Mobiliários S.A.'},
          {value: '157', label: 'ICAP do Brasil Corretora de Títulos e Valores Mobiliários Ltda.'},
          {value: '132', label: 'ICBC do Brasil Banco Múltiplo S.A.'},
          {value: '492', label: 'ING Bank N.V.'},
          {value: '139', label: 'Intesa Sanpaolo Brasil S.A. – Banco Múltiplo'},
          {value: '652', label: 'Itaú Unibanco Holding S.A.'},
          {value: '488', label: 'JPMorgan Chase Bank, National Association'},
          {value: '399', label: 'Kirton Bank S.A. – Banco Múltiplo'},
          {value: '293', label: 'Lastro RDV Distribuidora de Títulos e Valores Mobiliários Ltda.'},
          {value: '105', label: 'Lecca Crédito, Financiamento e Investimento S/A'},
          {value: '145', label: 'LEVYCAM – CORRETORA DE CAMBIO E VALORES LTDA.'},
          {value: '397', label: 'LISTO SOCIEDADE DE CREDITO DIRETO S.A.'},
          {value: '113', label: 'Magliano S.A. Corretora de Cambio e Valores Mobiliarios'},
          {value: '323', label: 'MERCADOPAGO.COM REPRESENTACOES LTDA.'},
          {value: '274', label: 'MONEY PLUS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E A EMPRESA DE PEQUENO PORT'},
          {value: '259', label: 'MONEYCORP BANCO DE CÂMBIO S.A.'},
          {value: '128', label: 'MS Bank S.A. Banco de Câmbio'},
          {value: '377', label: 'MS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE LTDA'},
          {value: '354', label: 'NECTON INVESTIMENTOS  S.A. CORRETORA DE VALORES MOBILIÁRIOS E COMMODITIES'},
          {value: '191', label: 'Nova Futura Corretora de Títulos e Valores Mobiliários Ltda.'},
          {value: '753', label: 'Novo Banco Continental S.A. – Banco Múltiplo'},
          {value: '260', label: 'Nu Pagamentos S.A.'},
          {value: '111', label: 'OLIVEIRA TRUST DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIARIOS S.A.'},
          {value: '319', label: 'OM DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'},
          {value: '613', label: 'Omni Banco S.A.'},
          {value: '325', label: 'Órama Distribuidora de Títulos e Valores Mobiliários S.A.'},
          {value: '355', label: 'ÓTIMO SOCIEDADE DE CRÉDITO DIRETO S.A.'},
          {value: '290', label: 'Pagseguro Internet S.A.'},
          {value: '254', label: 'PARANÁ BANCO S.A.'},
          {value: '326', label: 'PARATI – CREDITO, FINANCIAMENTO E INVESTIMENTO S.A.'},
          {value: '194', label: 'PARMETAL DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'},
          {value: '174', label: 'PEFISA S.A. – CRÉDITO, FINANCIAMENTO E INVESTIMENTO'},
          {value: '315', label: 'PI Distribuidora de Títulos e Valores Mobiliários S.A.'},
          {value: '380', label: 'PICPAY SERVICOS S.A.'},
          {value: '100', label: 'Planner Corretora de Valores S.A.'},
          {value: '125', label: 'Plural S.A. Banco Múltiplo'},
          {value: '093', label: 'PÓLOCRED   SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORT'},
          {value: '108', label: 'PORTOCRED S.A. – CREDITO, FINANCIAMENTO E INVESTIMENTO'},
          {value: '306', label: 'PORTOPAR DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.'},
          {value: '329', label: 'QI Sociedade de Crédito Direto S.A.'},
          {value: '283', label: 'RB CAPITAL INVESTIMENTOS DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LIMITADA'},
          {value: '374', label: 'REALIZE CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.'},
          {value: '101', label: 'RENASCENCA DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'},
          {value: '270', label: 'Sagitur Corretora de Câmbio Ltda.'},
          {value: '751', label: 'Scotiabank Brasil S.A. Banco Múltiplo'},
          {value: '276', label: 'Senff S.A. – Crédito, Financiamento e Investimento'},
          {value: '545', label: 'SENSO CORRETORA DE CAMBIO E VALORES MOBILIARIOS S.A'},
          {value: '190', label: 'SERVICOOP – COOPERATIVA DE CRÉDITO DOS SERVIDORES PÚBLICOS ESTADUAIS DO RIO GRAN'},
          {value: '363', label: 'SOCOPA SOCIEDADE CORRETORA PAULISTA S.A.'},
          {value: '183', label: 'SOCRED S.A. – SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO P'},
          {value: '365', label: 'SOLIDUS S.A. CORRETORA DE CAMBIO E VALORES MOBILIARIOS'},
          {value: '299', label: 'SOROCRED   CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.'},
          {value: '014', label: 'STATE STREET BRASIL S.A. ? BANCO COMERCIAL'},
          {value: '197', label: 'Stone Pagamentos S.A.'},
          {value: '404', label: 'SUMUP SOCIEDADE DE CRÉDITO DIRETO S.A.'},
          {value: '340', label: 'Super Pagamentos e Administração de Meios Eletrônicos S.A.'},
          {value: '307', label: 'Terra Investimentos Distribuidora de Títulos e Valores Mobiliários Ltda.'},
          {value: '352', label: 'TORO CORRETORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'},
          {value: '095', label: 'Travelex Banco de Câmbio S.A.'},
          {value: '143', label: 'Treviso Corretora de Câmbio S.A.'},
          {value: '360', label: 'TRINUS CAPITAL DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.'},
          {value: '131', label: 'TULLETT PREBON BRASIL CORRETORA DE VALORES E CÂMBIO LTDA'},
          {value: '129', label: 'UBS Brasil Banco de Investimento S.A.'},
          {value: '015', label: 'UBS Brasil Corretora de Câmbio, Títulos e Valores Mobiliários S.A.'},
          {value: '099', label: 'UNIPRIME CENTRAL – CENTRAL INTERESTADUAL DE COOPERATIVAS DE CREDITO LTDA.'},
          {value: '084', label: 'UNIPRIME NORTE DO PARANÁ – COOPERATIVA DE CRÉDITO LTDA'},
          {value: '373', label: 'UP.P SOCIEDADE DE EMPRÉSTIMO ENTRE PESSOAS S.A.'},
          {value: '298', label: 'Vip’s Corretora de Câmbio Ltda.'},
          {value: '296', label: 'VISION S.A. CORRETORA DE CAMBIO'},
          {value: '367', label: 'VITREO DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.'},
          {value: '310', label: 'VORTX DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.'},
          {value: '371', label: 'WARREN CORRETORA DE VALORES MOBILIÁRIOS E CÂMBIO LTDA.'},
          {value: '102', label: 'XP INVESTIMENTOS CORRETORA DE CÂMBIO,TÍTULOS E VALORES MOBILIÁRIOS S/A'},
          {value: '359', label: 'ZEMA CRÉDITO, FINANCIAMENTO E INVESTIMENTO S/A'}]
      }
    },
    props: ['propsNota'],
    watch: {
      propsNota () {
        this.nota = this.propsNota
      }
    },
    created () {
    },
    mounted () {
      this.nota = this.propsNota
    },
    methods: {}
  }
</script>

<style scoped>

</style>
