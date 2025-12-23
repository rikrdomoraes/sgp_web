<template>
  <div>
    <div>
      <multiselect v-model="bancoSelecionado"
                   :options="listaBancos"
                   :multiple="false"
                   :close-on-select="true"
                   placeholder="Selecione um banco"
                   :custom-label="bancoNome"
                   @select="selecionaBanco"
                   track-by="codigo"
                   selectedLabel="Selecionado"
                   selectLabel="Aperte ENTER para selecionar"
                   deselectLabel="Aperte ENTER para remover"
                   name="banco"
                   data-vv-as="banco"
                   :disabled="$attrs.disabled"
                   v-validate="{required: true}">
      </multiselect>
    </div>
    <span v-if="errors.first('banco')" class="label label-danger">{{ errors.first('banco') }}</span></div>
</template>

<script>
  export default {
    name: 'listaBancos',
    props: {
      propsBanco: null
    },
    data () {
      return {
        listaBancos: [{'codigo': '001', 'nome': 'Banco do Brasil S.A.', 'caracteresConta': 8}, {
          'codigo': '033',
          'nome': 'Banco Santander (Brasil) S.A.',
          'caracteresConta': 8,
          'digitoAgencia': false
        }, {'codigo': '070', 'nome': 'BRB - Banco de Brasília S.A.'}, {
          'codigo': '104',
          'nome': 'Caixa Econômica Federal',
          'digitoAgencia': false
        }, {'codigo': '237', 'nome': 'Banco Bradesco S.A.', 'caracteresConta': 7}, {
          'codigo': '341',
          'nome': 'Itaú Unibanco S.A.',
          'caracteresConta': 5,
          'digitoAgencia': false
        },
          {'codigo': '', 'nome': '', $isDisabled: true}, // Separador (elemento disabled)
          {'codigo': '003', 'nome': 'BANCO DA AMAZONIA S.A.'}, {
            'codigo': '004',
            'nome': 'Banco do Nordeste do Brasil S.A.'
          }, {'codigo': '007', 'nome': 'BANCO NACIONAL DE DESENVOLVIMENTO ECONOMICO E SOCIAL'}, {
            'codigo': '010',
            'nome': 'CREDICOAMO CREDITO RURAL COOPERATIVA'
          }, {'codigo': '011', 'nome': 'CREDIT SUISSE HEDGING-GRIFFO CORRETORA DE VALORES S.A'}, {
            'codigo': '012',
            'nome': 'Banco Inbursa S.A.'
          }, {'codigo': '014', 'nome': 'STATE STREET BRASIL S.A. ? BANCO COMERCIAL'}, {
            'codigo': '015',
            'nome': 'UBS Brasil Corretora de Câmbio, Títulos e Valores Mobiliários S.A.'
          }, {
            'codigo': '016',
            'nome': 'COOPERATIVA DE CRÉDITO MÚTUO DOS DESPACHANTES DE TRÂNSITO DE SANTA CATARINA E RI'
          }, {'codigo': '017', 'nome': 'BNY Mellon Banco S.A.'}, {
            'codigo': '018',
            'nome': 'Banco Tricury S.A.'
          }, {'codigo': '021', 'nome': 'BANESTES S.A. BANCO DO ESTADO DO ESPIRITO SANTO'}, {
            'codigo': '024',
            'nome': 'Banco Bandepe S.A.'
          }, {'codigo': '025', 'nome': 'Banco Alfa S.A.'}, {
            'codigo': '029',
            'nome': 'Banco Itaú Consignado S.A.'
          }, {'codigo': '036', 'nome': 'Banco Bradesco BBI S.A.'}, {
            'codigo': '037',
            'nome': 'Banco do Estado do Pará S.A.'
          }, {'codigo': '040', 'nome': 'Banco Cargill S.A.'}, {
            'codigo': '041',
            'nome': 'Banco do Estado do Rio Grande do Sul S.A.',
            'caracteresConta': 9
          }, {'codigo': '047', 'nome': 'Banco do Estado de Sergipe S.A.'}, {
            'codigo': '060',
            'nome': 'Confidence Corretora de Câmbio S.A.'
          }, {'codigo': '062', 'nome': 'Hipercard Banco Múltiplo S.A.'}, {
            'codigo': '063',
            'nome': 'Banco Bradescard S.A.'
          }, {'codigo': '064', 'nome': 'GOLDMAN SACHS DO BRASIL BANCO MULTIPLO S.A.'}, {
            'codigo': '065',
            'nome': 'Banco AndBank (Brasil) S.A.'
          }, {'codigo': '066', 'nome': 'BANCO MORGAN STANLEY S.A.'}, {
            'codigo': '069',
            'nome': 'Banco Crefisa S.A.'
          }, {'codigo': '074', 'nome': 'Banco J. Safra S.A.'}, {
            'codigo': '075',
            'nome': 'Banco ABN Amro S.A.'
          }, {'codigo': '076', 'nome': 'Banco KDB do Brasil S.A.'}, {
            'codigo': '077',
            'nome': 'Banco Inter S.A.'
          }, {'codigo': '078', 'nome': 'Haitong Banco de Investimento do Brasil S.A.'}, {
            'codigo': '079',
            'nome': 'Banco Original do Agronegócio S.A.'
          }, {'codigo': '080', 'nome': 'B&T CORRETORA DE CAMBIO LTDA.'}, {
            'codigo': '081',
            'nome': 'BancoSeguro S.A.'
          }, {'codigo': '082', 'nome': 'BANCO TOPÁZIO S.A.'}, {
            'codigo': '083',
            'nome': 'Banco da China Brasil S.A.'
          }, {'codigo': '084', 'nome': 'UNIPRIME NORTE DO PARANÁ – COOPERATIVA DE CRÉDITO LTDA'}, {
            'codigo': '085',
            'nome': 'Cooperativa Central de Crédito – Ailos'
          }, {'codigo': '088', 'nome': 'BANCO RANDON S.A.'}, {
            'codigo': '089',
            'nome': 'CREDISAN COOPERATIVA DE CRÉDITO'
          }, {
            'codigo': '091',
            'nome': 'CENTRAL DE COOPERATIVAS DE ECONOMIA E CRÉDITO MÚTUO DO ESTADO DO RIO GRANDE DO S'
          }, {'codigo': '092', 'nome': 'BRK S.A. Crédito, Financiamento e Investimento'}, {
            'codigo': '093',
            'nome': 'PÓLOCRED   SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORT'
          }, {'codigo': '094', 'nome': 'Banco Finaxis S.A.'}, {
            'codigo': '095',
            'nome': 'Travelex Banco de Câmbio S.A.'
          }, {'codigo': '096', 'nome': 'Banco B3 S.A.'}, {
            'codigo': '097',
            'nome': 'Credisis – Central de Cooperativas de Crédito Ltda.'
          }, {'codigo': '098', 'nome': 'Credialiança Cooperativa de Crédito Rural'}, {
            'codigo': '099',
            'nome': 'UNIPRIME CENTRAL – CENTRAL INTERESTADUAL DE COOPERATIVAS DE CREDITO LTDA.'
          }, {'codigo': '100', 'nome': 'Planner Corretora de Valores S.A.'}, {
            'codigo': '101',
            'nome': 'RENASCENCA DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'
          }, {
            'codigo': '102',
            'nome': 'XP INVESTIMENTOS CORRETORA DE CÂMBIO,TÍTULOS E VALORES MOBILIÁRIOS S/A'
          }, {'codigo': '105', 'nome': 'Lecca Crédito, Financiamento e Investimento S/A'}, {
            'codigo': '107',
            'nome': 'Banco Bocom BBM S.A.'
          }, {'codigo': '108', 'nome': 'PORTOCRED S.A. – CREDITO, FINANCIAMENTO E INVESTIMENTO'}, {
            'codigo': '111',
            'nome': 'OLIVEIRA TRUST DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIARIOS S.A.'
          }, {'codigo': '113', 'nome': 'Magliano S.A. Corretora de Cambio e Valores Mobiliarios'}, {
            'codigo': '114',
            'nome': 'Central Cooperativa de Crédito no Estado do Espírito Santo – CECOOP'
          }, {'codigo': '117', 'nome': 'ADVANCED CORRETORA DE CÂMBIO LTDA'}, {
            'codigo': '119',
            'nome': 'Banco Western Union do Brasil S.A.'
          }, {'codigo': '120', 'nome': 'BANCO RODOBENS S.A.'}, {
            'codigo': '121',
            'nome': 'Banco Agibank S.A.'
          }, {'codigo': '122', 'nome': 'Banco Bradesco BERJ S.A.'}, {
            'codigo': '124',
            'nome': 'Banco Woori Bank do Brasil S.A.'
          }, {'codigo': '125', 'nome': 'Plural S.A. Banco Múltiplo'}, {
            'codigo': '126',
            'nome': 'BR Partners Banco de Investimento S.A.'
          }, {'codigo': '127', 'nome': 'Codepe Corretora de Valores e Câmbio S.A.'}, {
            'codigo': '128',
            'nome': 'MS Bank S.A. Banco de Câmbio'
          }, {'codigo': '129', 'nome': 'UBS Brasil Banco de Investimento S.A.'}, {
            'codigo': '130',
            'nome': 'CARUANA S.A. – SOCIEDADE DE CRÉDITO, FINANCIAMENTO E INVESTIMENTO'
          }, {'codigo': '131', 'nome': 'TULLETT PREBON BRASIL CORRETORA DE VALORES E CÂMBIO LTDA'}, {
            'codigo': '132',
            'nome': 'ICBC do Brasil Banco Múltiplo S.A.'
          }, {
            'codigo': '133',
            'nome': 'CONFEDERAÇÃO NACIONAL DAS COOPERATIVAS CENTRAIS DE CRÉDITO E ECONOMIA FAMILIAR E'
          }, {
            'codigo': '134',
            'nome': 'BGC LIQUIDEZ DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'
          }, {
            'codigo': '136',
            'nome': 'CONFEDERAÇÃO NACIONAL DAS COOPERATIVAS CENTRAIS UNICRED LTDA. – UNICRED DO BRASI'
          }, {'codigo': '138', 'nome': 'Get Money Corretora de Câmbio S.A.'}, {
            'codigo': '139',
            'nome': 'Intesa Sanpaolo Brasil S.A. – Banco Múltiplo'
          }, {'codigo': '140', 'nome': 'Easynvest – Título Corretora de Valores SA'}, {
            'codigo': '142',
            'nome': 'Broker Brasil Corretora de Câmbio Ltda.'
          }, {'codigo': '143', 'nome': 'Treviso Corretora de Câmbio S.A.'}, {
            'codigo': '144',
            'nome': 'BEXS BANCO DE CÂMBIO S/A'
          }, {'codigo': '145', 'nome': 'LEVYCAM – CORRETORA DE CAMBIO E VALORES LTDA.'}, {
            'codigo': '146',
            'nome': 'GUITTA CORRETORA DE CAMBIO LTDA.'
          }, {
            'codigo': '149',
            'nome': 'Facta Financeira S.A. – Crédito Financiamento e Investimento'
          }, {
            'codigo': '157',
            'nome': 'ICAP do Brasil Corretora de Títulos e Valores Mobiliários Ltda.'
          }, {
            'codigo': '159',
            'nome': 'Casa do Crédito S.A. Sociedade de Crédito ao Microempreendedor'
          }, {'codigo': '163', 'nome': 'Commerzbank Brasil S.A. – Banco Múltiplo'}, {
            'codigo': '169',
            'nome': 'BANCO OLÉ CONSIGNADO S.A.'
          }, {
            'codigo': '173',
            'nome': 'BRL Trust Distribuidora de Títulos e Valores Mobiliários S.A.'
          }, {'codigo': '174', 'nome': 'PEFISA S.A. – CRÉDITO, FINANCIAMENTO E INVESTIMENTO'}, {
            'codigo': '177',
            'nome': 'Guide Investimentos S.A. Corretora de Valores'
          }, {
            'codigo': '180',
            'nome': 'CM CAPITAL MARKETS CORRETORA DE CÂMBIO, TÍTULOS E VALORES MOBILIÁRIOS LTDA'
          }, {
            'codigo': '183',
            'nome': 'SOCRED S.A. – SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO P'
          }, {'codigo': '184', 'nome': 'Banco Itaú BBA S.A.'}, {
            'codigo': '188',
            'nome': 'ATIVA INVESTIMENTOS S.A. CORRETORA DE TÍTULOS, CÂMBIO E VALORES'
          }, {'codigo': '189', 'nome': 'HS FINANCEIRA S/A CREDITO, FINANCIAMENTO E INVESTIMENTOS'}, {
            'codigo': '190',
            'nome': 'SERVICOOP – COOPERATIVA DE CRÉDITO DOS SERVIDORES PÚBLICOS ESTADUAIS DO RIO GRAN'
          }, {
            'codigo': '191',
            'nome': 'Nova Futura Corretora de Títulos e Valores Mobiliários Ltda.'
          }, {
            'codigo': '194',
            'nome': 'PARMETAL DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'
          }, {'codigo': '196', 'nome': 'FAIR CORRETORA DE CAMBIO S.A.'}, {
            'codigo': '197',
            'nome': 'Stone Pagamentos S.A.'
          }, {'codigo': '208', 'nome': 'Banco BTG Pactual S.A.'}, {
            'codigo': '212',
            'nome': 'Banco Original S.A.'
          }, {'codigo': '213', 'nome': 'Banco Arbi S.A.'}, {
            'codigo': '217',
            'nome': 'Banco John Deere S.A.'
          }, {'codigo': '218', 'nome': 'Banco BS2 S.A.'}, {
            'codigo': '222',
            'nome': 'BANCO CRÉDIT AGRICOLE BRASIL S.A.'
          }, {'codigo': '224', 'nome': 'Banco Fibra S.A.'}, {
            'codigo': '233',
            'nome': 'Banco Cifra S.A.'
          }, {'codigo': '241', 'nome': 'BANCO CLASSICO S.A.'}, {
            'codigo': '243',
            'nome': 'Banco Máxima S.A.'
          }, {'codigo': '246', 'nome': 'Banco ABC Brasil S.A.'}, {
            'codigo': '249',
            'nome': 'Banco Investcred Unibanco S.A.'
          }, {'codigo': '250', 'nome': 'BCV – BANCO DE CRÉDITO E VAREJO S.A.'}, {
            'codigo': '253',
            'nome': 'Bexs Corretora de Câmbio S/A'
          }, {'codigo': '254', 'nome': 'PARANÁ BANCO S.A.'}, {
            'codigo': '259',
            'nome': 'MONEYCORP BANCO DE CÂMBIO S.A.'
          }, {'codigo': '260', 'nome': 'Nu Pagamentos S.A.'}, {
            'codigo': '265',
            'nome': 'Banco Fator S.A.'
          }, {'codigo': '266', 'nome': 'BANCO CEDULA S.A.'}, {
            'codigo': '268',
            'nome': 'BARI COMPANHIA HIPOTECÁRIA'
          }, {'codigo': '269', 'nome': 'BANCO HSBC S.A.'}, {
            'codigo': '270',
            'nome': 'Sagitur Corretora de Câmbio Ltda.'
          }, {'codigo': '271', 'nome': 'IB Corretora de Câmbio, Títulos e Valores Mobiliários S.A.'}, {
            'codigo': '272',
            'nome': 'AGK CORRETORA DE CAMBIO S.A.'
          }, {
            'codigo': '273',
            'nome': 'Cooperativa de Crédito Rural de São Miguel do Oeste – Sulcredi/São Miguel'
          }, {
            'codigo': '274',
            'nome': 'MONEY PLUS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E A EMPRESA DE PEQUENO PORT'
          }, {'codigo': '276', 'nome': 'Senff S.A. – Crédito, Financiamento e Investimento'}, {
            'codigo': '278',
            'nome': 'Genial Investimentos Corretora de Valores Mobiliários S.A.'
          }, {'codigo': '279', 'nome': 'COOPERATIVA DE CREDITO RURAL DE PRIMAVERA DO LESTE'}, {
            'codigo': '280',
            'nome': 'Avista S.A. Crédito, Financiamento e Investimento'
          }, {'codigo': '281', 'nome': 'Cooperativa de Crédito Rural Coopavel'}, {
            'codigo': '283',
            'nome': 'RB CAPITAL INVESTIMENTOS DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LIMITADA'
          }, {'codigo': '285', 'nome': 'Frente Corretora de Câmbio Ltda.'}, {
            'codigo': '286',
            'nome': 'COOPERATIVA DE CRÉDITO RURAL DE OURO   SULCREDI/OURO'
          }, {'codigo': '288', 'nome': 'CAROL DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.'}, {
            'codigo': '289',
            'nome': 'DECYSEO CORRETORA DE CAMBIO LTDA.'
          }, {'codigo': '290', 'nome': 'Pagseguro Internet S.A.'}, {
            'codigo': '292',
            'nome': 'BS2 Distribuidora de Títulos e Valores Mobiliários S.A.'
          }, {
            'codigo': '293',
            'nome': 'Lastro RDV Distribuidora de Títulos e Valores Mobiliários Ltda.'
          }, {'codigo': '296', 'nome': 'VISION S.A. CORRETORA DE CAMBIO'}, {
            'codigo': '298',
            'nome': 'Vip’s Corretora de Câmbio Ltda.'
          }, {'codigo': '299', 'nome': 'SOROCRED   CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.'}, {
            'codigo': '300',
            'nome': 'Banco de la Nacion Argentina'
          }, {'codigo': '301', 'nome': 'BPP Instituição de Pagamento S.A.'}, {
            'codigo': '306',
            'nome': 'PORTOPAR DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.'
          }, {
            'codigo': '307',
            'nome': 'Terra Investimentos Distribuidora de Títulos e Valores Mobiliários Ltda.'
          }, {'codigo': '309', 'nome': 'CAMBIONET CORRETORA DE CÂMBIO LTDA.'}, {
            'codigo': '310',
            'nome': 'VORTX DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.'
          }, {'codigo': '311', 'nome': 'DOURADA CORRETORA'}, {
            'codigo': '312',
            'nome': 'HSCM SCMEPP LTDA.'
          }, {'codigo': '313', 'nome': 'AMAZÔNIA CORRETORA DE CÂMBIO LTDA.'}, {
            'codigo': '315',
            'nome': 'PI Distribuidora de Títulos e Valores Mobiliários S.A.'
          }, {'codigo': '318', 'nome': 'Banco BMG S.A.'}, {
            'codigo': '319',
            'nome': 'OM DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'
          }, {'codigo': '320', 'nome': 'China Construction Bank (Brasil) Banco Múltiplo S/A'}, {
            'codigo': '321',
            'nome': 'CREFAZ SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E A EMPRESA DE PEQUENO PORTE LT'
          }, {
            'codigo': '322',
            'nome': 'Cooperativa de Crédito Rural de Abelardo Luz – Sulcredi/Crediluz'
          }, {'codigo': '323', 'nome': 'MERCADOPAGO.COM REPRESENTACOES LTDA.'}, {
            'codigo': '324',
            'nome': 'CARTOS SOCIEDADE DE CRÉDITO DIRETO S.A.'
          }, {'codigo': '325', 'nome': 'Órama Distribuidora de Títulos e Valores Mobiliários S.A.'}, {
            'codigo': '326',
            'nome': 'PARATI – CREDITO, FINANCIAMENTO E INVESTIMENTO S.A.'
          }, {'codigo': '329', 'nome': 'QI Sociedade de Crédito Direto S.A.'}, {
            'codigo': '330',
            'nome': 'BANCO BARI DE INVESTIMENTOS E FINANCIAMENTOS S.A.'
          }, {
            'codigo': '331',
            'nome': 'Fram Capital Distribuidora de Títulos e Valores Mobiliários S.A.'
          }, {'codigo': '332', 'nome': 'Acesso Soluções de Pagamento S.A.'}, {
            'codigo': '335',
            'nome': 'Banco Digio S.A.'
          }, {'codigo': '336', 'nome': 'Banco C6 S.A.'}, {
            'codigo': '340',
            'nome': 'Super Pagamentos e Administração de Meios Eletrônicos S.A.'
          }, {'codigo': '342', 'nome': 'Creditas Sociedade de Crédito Direto S.A.'}, {
            'codigo': '343',
            'nome': 'FFA SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE LTDA.'
          }, {'codigo': '348', 'nome': 'Banco XP S.A.'}, {
            'codigo': '349',
            'nome': 'AL5 S.A. CRÉDITO, FINANCIAMENTO E INVESTIMENTO'
          }, {
            'codigo': '350',
            'nome': 'COOPERATIVA DE CRÉDITO RURAL DE PEQUENOS AGRICULTORES E DA REFORMA AGRÁRIA DO CE'
          }, {'codigo': '352', 'nome': 'TORO CORRETORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA'}, {
            'codigo': '354',
            'nome': 'NECTON INVESTIMENTOS  S.A. CORRETORA DE VALORES MOBILIÁRIOS E COMMODITIES'
          }, {'codigo': '355', 'nome': 'ÓTIMO SOCIEDADE DE CRÉDITO DIRETO S.A.'}, {
            'codigo': '358',
            'nome': 'MIDWAY S.A. - SCFI'
          }, {'codigo': '359', 'nome': 'ZEMA CRÉDITO, FINANCIAMENTO E INVESTIMENTO S/A'}, {
            'codigo': '360',
            'nome': 'TRINUS CAPITAL DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.'
          }, {'codigo': '362', 'nome': 'CIELO S.A.'}, {
            'codigo': '363',
            'nome': 'SOCOPA SOCIEDADE CORRETORA PAULISTA S.A.'
          }, {'codigo': '364', 'nome': 'GERENCIANET S.A.'}, {
            'codigo': '365',
            'nome': 'SOLIDUS S.A. CORRETORA DE CAMBIO E VALORES MOBILIARIOS'
          }, {'codigo': '366', 'nome': 'BANCO SOCIETE GENERALE BRASIL S.A.'}, {
            'codigo': '367',
            'nome': 'VITREO DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.'
          }, {'codigo': '368', 'nome': 'Banco CSF S.A.'}, {
            'codigo': '370',
            'nome': 'Banco Mizuho do Brasil S.A.'
          }, {'codigo': '371', 'nome': 'WARREN CORRETORA DE VALORES MOBILIÁRIOS E CÂMBIO LTDA.'}, {
            'codigo': '373',
            'nome': 'UP.P SOCIEDADE DE EMPRÉSTIMO ENTRE PESSOAS S.A.'
          }, {'codigo': '374', 'nome': 'REALIZE CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.'}, {
            'codigo': '376',
            'nome': 'BANCO J.P. MORGAN S.A.'
          }, {
            'codigo': '377',
            'nome': 'MS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE LTDA'
          }, {'codigo': '378', 'nome': 'BBC LEASING S.A. – ARRENDAMENTO MERCANTIL'}, {
            'codigo': '379',
            'nome': 'COOPERFORTE – COOPERATIVA DE ECONOMIA E CRÉDITO MÚTUO DOS FUNCIONÁRIOS DE INSTIT'
          }, {'codigo': '380', 'nome': 'PICPAY SERVICOS S.A.'}, {
            'codigo': '381',
            'nome': 'BANCO MERCEDES-BENZ DO BRASIL S.A.'
          }, {
            'codigo': '382',
            'nome': 'FIDÚCIA SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE L'
          }, {'codigo': '383', 'nome': 'BOLETOBANCÁRIO.COM TECNOLOGIA DE PAGAMENTOS LTDA.'}, {
            'codigo': '384',
            'nome': 'GLOBAL FINANÇAS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO'
          }, {'codigo': '386', 'nome': 'NU FINANCEIRA S.A. CFI'}, {
            'codigo': '387',
            'nome': 'Banco Toyota do Brasil S.A.'
          }, {'codigo': '389', 'nome': 'Banco Mercantil do Brasil S.A.'}, {
            'codigo': '390',
            'nome': 'BANCO GM S.A.'
          }, {'codigo': '391', 'nome': 'COOPERATIVA DE CREDITO RURAL DE IBIAM – SULCREDI/IBIAM'}, {
            'codigo': '393',
            'nome': 'Banco Volkswagen S.A.'
          }, {'codigo': '394', 'nome': 'Banco Bradesco Financiamentos S.A.'}, {
            'codigo': '395',
            'nome': 'F D GOLD DTVM LTDA'
          }, {'codigo': '396', 'nome': 'HUB PAGAMENTOS S.A'}, {
            'codigo': '397',
            'nome': 'LISTO SOCIEDADE DE CREDITO DIRETO S.A.'
          }, {'codigo': '398', 'nome': 'IDEAL CTVM S.A.'}, {
            'codigo': '399',
            'nome': 'Kirton Bank S.A. – Banco Múltiplo'
          }, {'codigo': '400', 'nome': 'CC POUP SER FIN CO'}, {
            'codigo': '402',
            'nome': 'COBUCCIO SCD S.A.'
          }, {'codigo': '403', 'nome': 'CORA SOCIEDADE DE CRÉDITO DIRETO S.A.'}, {
            'codigo': '404',
            'nome': 'SUMUP SOCIEDADE DE CRÉDITO DIRETO S.A.'
          }, {'codigo': '406', 'nome': 'ACCREDITO SCD S.A.'}, {
            'codigo': '407',
            'nome': 'ÍNDIGO INVESTIMENTOS DTVM LTDA.'
          }, {'codigo': '408', 'nome': 'BÔNUSCRED SOCIEDADE DE CRÉDITO DIRETO S.A.'}, {
            'codigo': '410',
            'nome': 'PLANNER SCM S.A.'
          }, {'codigo': '411', 'nome': 'VIA CERTA FINANCIADORA S.A. - CFI'}, {
            'codigo': '412',
            'nome': 'BANCO CAPITAL S.A.'
          }, {'codigo': '419', 'nome': 'NUMBRS SCD S.A.'}, {
            'codigo': '422',
            'nome': 'Banco Safra S.A.'
          }, {'codigo': '456', 'nome': 'Banco MUFG Brasil S.A.'}, {
            'codigo': '464',
            'nome': 'Banco Sumitomo Mitsui Brasileiro S.A.'
          }, {'codigo': '473', 'nome': 'Banco Caixa Geral – Brasil S.A.'}, {
            'codigo': '477',
            'nome': 'Citibank N.A.'
          }, {'codigo': '479', 'nome': 'Banco ItauBank S.A.'}, {
            'codigo': '487',
            'nome': 'DEUTSCHE BANK S.A. – BANCO ALEMAO'
          }, {'codigo': '488', 'nome': 'JPMorgan Chase Bank, National Association'}, {
            'codigo': '492',
            'nome': 'ING Bank N.V.'
          }, {'codigo': '495', 'nome': 'Banco de La Provincia de Buenos Aires'}, {
            'codigo': '505',
            'nome': 'Banco Credit Suisse (Brasil) S.A.'
          }, {'codigo': '545', 'nome': 'SENSO CORRETORA DE CAMBIO E VALORES MOBILIARIOS S.A'}, {
            'codigo': '600',
            'nome': 'Banco Luso Brasileiro S.A.'
          }, {'codigo': '604', 'nome': 'Banco Industrial do Brasil S.A.'}, {
            'codigo': '610',
            'nome': 'Banco VR S.A.'
          }, {'codigo': '611', 'nome': 'Banco Paulista S.A.'}, {
            'codigo': '612',
            'nome': 'Banco Guanabara S.A.'
          }, {'codigo': '613', 'nome': 'Omni Banco S.A.'}, {
            'codigo': '623',
            'nome': 'Banco Pan S.A.'
          }, {'codigo': '626', 'nome': 'BANCO C6 CONSIGNADO S.A.'}, {
            'codigo': '630',
            'nome': 'Banco Smartbank S.A.'
          }, {'codigo': '633', 'nome': 'Banco Rendimento S.A.'}, {
            'codigo': '634',
            'nome': 'BANCO TRIANGULO S.A.'
          }, {'codigo': '637', 'nome': 'BANCO SOFISA S.A.'}, {
            'codigo': '643',
            'nome': 'Banco Pine S.A.'
          }, {'codigo': '652', 'nome': 'Itaú Unibanco Holding S.A.'}, {
            'codigo': '653',
            'nome': 'BANCO INDUSVAL S.A.'
          }, {'codigo': '654', 'nome': 'BANCO DIGIMAIS S.A.'}, {
            'codigo': '655',
            'nome': 'Banco Votorantim S.A.'
          }, {'codigo': '707', 'nome': 'Banco Daycoval S.A.'}, {
            'codigo': '712',
            'nome': 'Banco Ourinvest S.A.'
          }, {'codigo': '720', 'nome': 'BCO RNX S.A.'}, {
            'codigo': '739',
            'nome': 'Banco Cetelem S.A.'
          }, {'codigo': '741', 'nome': 'BANCO RIBEIRAO PRETO S.A.'}, {
            'codigo': '743',
            'nome': 'Banco Semear S.A.'
          }, {
            'codigo': '745',
            'nome': 'Banco Citibank S.A.',
            'caracteresConta': 8,
            'digitoAgencia': false
          }, {'codigo': '746', 'nome': 'Banco Modal S.A.'}, {
            'codigo': '747',
            'nome': 'Banco Rabobank International Brasil S.A.'
          }, {'codigo': '748', 'nome': 'BANCO COOPERATIVO SICREDI S.A.'}, {
            'codigo': '751',
            'nome': 'Scotiabank Brasil S.A. Banco Múltiplo'
          }, {'codigo': '752', 'nome': 'Banco BNP Paribas Brasil S.A.'}, {
            'codigo': '753',
            'nome': 'Novo Banco Continental S.A. – Banco Múltiplo'
          }, {'codigo': '754', 'nome': 'Banco Sistema S.A.'}, {
            'codigo': '755',
            'nome': 'Bank of America Merrill Lynch Banco Múltiplo S.A.'
          }, {'codigo': '756', 'nome': 'BANCO COOPERATIVO DO BRASIL S.A. – BANCOOB'}, {
            'codigo': '757',
            'nome': 'BANCO KEB HANA DO BRASIL S.A.'
          }],
        bancoSelecionado: null
      }
    },
    created: function () {
      this.bancoSelecionado = this.listaBancos.find(banco => banco.codigo === this.propsBanco)
    },
    methods: {
      selecionaBanco (banco) {
        this.$emit('update:banco', banco)
        this.$forceUpdate()
      },
      bancoNome (option) {
        return `${option.codigo + ' - ' + option.nome}`
      }
    }
  }
</script>

<style scoped>

</style>
