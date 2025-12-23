<template>
    <div class="fundao">

        <div v-if="new Date() < new Date('2024-10-17 00:00')" style="margin: 20px 0; padding: 20px; border: 1px solid #b8bdc2; border-radius: 10px;">
            <div style="font-size:22px; font-weight: bolder; text-align: center; color: #002d48">
                <p>Chamada Pública nº 2024/008</p>
                <p>Edital Novo Cataforte </p>
                <p>COMUNICADO - PRORROGAÇÃO</p>
            </div>
            <div style="text-align: center">
                <p style="font-size: 16px;  color: #002D4B">Informamos que as inscrições para o Edital Novo Cataforte encerram-se às 23h e 59 min do dia 16/10/2024 (quarta-feira).</p>
            </div>
        </div>
        <div class="main-container" v-else>
            <div class="main-content">
                <div class="header-container">
                    <div class="title-header">
                        <h4><i class="fa fa-warning"></i> Atualizações no sistema!</h4>
                    </div>
                </div>

                <div class="texto-principal">
                    <p>Prezado parceiro, <br/>
                    Informamos que foram realizadas alterações de aprimoramento de processos no Sistema de Gerenciamento de Projetos (SGP).
                    Seguem as mudanças realizadas.

                    </p>
                    <div class="item-mudanca">
                        <div>
                            <strong>1.	Relatório de execução:</strong>
                        </div>
                        <div class="paragrafo-item">
                            Para a conclusão e envio do Relatório de Execução para a Fundação BB será necessário anexar as  certidões abaixo, informando  as respectivas  datas de vigência: <br/>
                            As  certidões são emitidas online gratuitamente conforme endereços indicados abaixo.
                        </div>
                        <div class="item-lista">
                            <div>•	CNDT - Certidão Negativa de Débitos Trabalhistas. Emitir em: <a href="https://www.tst.jus.br/certidao1" target="_blank">Certidão Negativa de Débitos Trabalhistas - TST</a></div>
                            <div>•	CNEP/CEPIM - Cadastro Nacional de Empresas Punidas – CNEP e Cadastro de Entidades Privadas sem Fins Lucrativos Impedidas – CEPIM e (Lei Anticorrupção nº 12.846/2013). Emitir em: <a href="https://certidoes.cgu.gov.br/" target="_blank">Certidões (cgu.gov.br)</a></div>
                        </div>
                        <div class="paragrafo-item">
                            Informamos que a existência de restrição em qualquer certidão não impedirá a conclusão e o  envio do Relatório. 
                            No entanto, a instituição deverá adotar os procedimentos visando a regularização das pendências identificadas. As pendências  não regularizadas em até 30 dias resultarão no bloqueio no projeto, incluindo a liberação de recursos.
                        </div>
                    </div>

                    <div class="item-mudanca">
                        <div>
                            <strong>2.	Cadastro dos dirigentes :</strong>
                        </div>
                        <div class="paragrafo-item">
                            Caso algum dirigente esteja vinculado a outras empresas (como proprietário, participante ou dirigente), será necessário adicionar em seu cadastro, no SGP, o CNPJ de todas as empresas às quais ele esteja vinculado e, também o CNPJ das empresas que tenha se desvinculado há menos de 1 ano.
                        </div>
                    </div>
                </div>
                
                <div>Para esclarecimento de dúvidas favor utilizar o canal: <strong>Chamados</strong>. <br/>Agradecemos a parceria.</div>
                <br />

            </div>
        </div>

    </div>
</template>

<script>
    /* eslint-disable no-unused-vars */
</script>
<style scoped>
    html,
    body {
        font-family: 'Arial sans-serif';
        margin: 0;
        padding: 0;
        border: 0;
    }

    .item-mudanca {
        display: flex;
        width: 100%;
        padding: 5px;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        /* border: 1px solid red; */
        margin-top: 10px;
        margin-bottom: 10px;
        text-align: justify;
    }

    .item-lista {
        display: flex;
        width: 100%;
        padding: 5px;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        margin-left: 20px;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .paragrafo-item {
        margin-left: 15px;
    }

    .test {
        width: 50px;
        height: 50px;
        background-color: green;
    }

    .fundao {
        /* background-color: #AFAFAF;
        text-align: -webkit-center;
        border-radius: 10px; */
    }

    .main-container {
        width: 100%;
        padding: 10px;
        background-color: #ECF0F5;
        min-height: 250px;
        border-radius: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border: 1px solid #b8bdc2;
        margin-bottom: 5px;
    }

    .main-content {
        width: 95%;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
    }

    .cursos-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .header-container {
        width: 100%;
        margin-bottom: 20px;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: flex-start;
    }

    .title-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;

        /* background-color: #002d48; */
        color: #002d48;

        width: 500px;
        height: 30px;

        font-size: 18px;
        font-weight: 600;
        text-align: center;

    }

    .button-container {
        width: 95%;
        height: 50px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .title-button-container {
    }

    .texto-principal {
        width: 95%;
        font-size: 13px;
        text-align: left;
        /* margin-top: -0px; */
    }

    .ilustracao {
        padding: 20px;
        width: 30%;
    }

    .diretoria {
        color: #002D4B;
        font-size: 16px;
        font-family: Arial;
        font-weight: 700;
        text-align: left;
    }

    .conheca {
        color: #002D4B;
        font-size: 12px;
        font-family: Arial;
        font-weight: 700;
        text-align: center;
    }

    .cta-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 10px;
    }

    .botaoazul {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 10px;

        width: 200px;
        height: 40px;
        border-radius: 30px;
        color: #ffff;
        font-size: 12px;
        font-family: Arial;
        font-weight: 700;
        border: 2px solid #002D4B;
        background-color: #002d4b;
        transition: 0.2s ease;
    }

    .botaoazul:hover {
        scale: 0.98;
    }

    .botaoamarelo {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 10px;

        width: 200px;
        height: 40px;
        border-radius: 30px;
        color: #002D4B;
        font-size: 12px;
        font-family: Arial;
        font-weight: 700;
        border: 2px solid #002D4B;
        background-color: #FCFC30;
        transition: 0.2s ease;
    }
    .botaoamarelo:hover {
        scale: 0.98;
    }


    .cursosEscolas {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;

        gap: 5px;
        margin-top: 5px;
        width: 100%;
    }

    .blocoCursos {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }

    .containerUnibb {
        border: 1px solid #b8bdc2;
        width: 62%;
        height: 451px;
        background-color: #ECF0F5;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        z-index: 0;
    }

    .cursos {
        height: 328px;
        width: 230px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        border-radius: 5px;
        padding-top: 26px;
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    }

    .cursoRosa {
        background-color: #DCA09B;
    }

    .cursoVerde {
        background-color: #87C3BE;
    }

    .cursoLilas {
        background-color: #b4afd2;
    }

    .cursoCinza {
        background-color: #AFAFAF;
    }

    .descricao {
        height: 240px;
        background-color: #ffff;
        padding: 8px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
    }

    .botoesCursos {
        background-color: #002D4B;
        color: white;
        border: none;
        border-radius: 10px;
        width: 200px;
        margin-top: -50px;
        height: 50px;
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
        transition: 0.2s ease;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 5px;
    }
    .botoesCursos:hover {
        scale: 0.95;
    }

    .containerEscola {
        border: 1px solid #b8bdc2;
        width: 38%;
        height: 451px;
        border-radius: 10px;
        background: #ECF0F5;
        display: flex;
        flex-direction: column;
        justify-content: center;
        z-index: 0;
    }

    .titulos {
        display: flex;
        align-items: center;
        width: 300px;
        height: 40px;
        border-radius: 0px 5px 5px 0px;
        background-color: #002D4B;
        margin-bottom: 20px;
    }

    .titulos>img {
        margin-left: 20px;
    }

    .escola {
        align-self: center;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 550px;
        height: 150px;
        border-radius: 0px 10px 10px 0px;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    }

    .escolaDescricao {
        margin-left: 9px;
        width: 70%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        text-align: center;
    }

    .escolaRosa {
        background-color: #DCA09B;
    }

    .escolaLilas {
        background-color: #b4afd2;
    }

    .botaoEscola {
        color: #fff;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: transparent;
        border: none;
        margin-left: 20px;
        transition: 0.2s ease;
        height: 100%;
        gap: 5px;
    }

    .botaoEscola:hover {
        scale: 0.98;
    }

    .titulo-curso {
        font-size: 18px;
        font-weight: 700;
        max-width: 240px;
        line-height: 18px;
    }

    .texto-curso {
        margin-top: 20px;
        font-size: 14px;
        text-align: center;
        line-height: 15px;
        width: 160px;
    }

    .titulo-curso-escola {
        font-size: 18px;
        font-weight: 700;
        max-width: 300px;
        line-height: 18px;
        margin-top: 5px;
        margin-bottom: -10px;
    }

    .texto-curso-escola {
        margin-top: 20px;
        font-size: 14px;
        text-align: center;
        line-height: 14px;
        width: 350px;
    }

    .escola-aberta-cursos {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 310px;
        gap: 10px;
        margin-top: 15px;
    }

    .aviso {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: -20px;
        background-color: #FCFC30;
        border-radius: 10px;
        width: 80%;
        height: 50px;
        color: #002D4B;
        font-size: 15px;
        font-weight: 700;
        z-index: 1;
    }

    .logo-img {
        width: 80px;
    }

    .logo-escola {
        width: 160px;
    }

    .icon {
        width: 16px;
    }

    @media (-webkit-min-device-pixel-ratio: 1.2), (min-resolution: 144dpi) {
        .cursos {
            height: 260px;
            width: 145px;
            display: flex;
            justify-content: center;
            border-radius: 5px;
            padding-top: 26px;
        }

        .descricao {
            height: 180px;
        }

        .titulo-curso {
            font-size: 12px;
            max-width: 180px;
            line-height: 14px;
        }

        .texto-curso {
            margin-top: 10px;
            font-size: 12px;
            text-align: center;
            line-height: 12px;
            width: 120px;
        }

        .botoesCursos {
            border-radius: 10px;
            width: 120px;
            margin-top: -30px;
            height: 40px;
            font-size: 12px;
        }

        .escola {
            width: 350px;
            height: 130px;
        }

        .titulo-curso-escola {
            font-size: 12px;
            font-weight: 700;
            max-width: 280px;
            line-height: 12px;
            margin-top: 5px;
            margin-bottom: -10px;
        }

        .texto-curso-escola {
            margin-top: 10px;
            font-size: 10px;
            text-align: center;
            line-height: 10px;
            width: 200px;
        }
        .botaoEscola {
            font-size: 12px;
            width: 150px;
            border: none;
            margin-left: 10px;
            transition: 0.2s ease;
            gap: 5px;
        }

        .aviso {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: -20px;
            background-color: #FCFC30;
            border-radius: 10px;
            width: 80%;
            height: 50px;
            color: #002D4B;
            font-size: 12px;
            font-weight: 700;
            z-index: 1;
        }
        .escola-aberta-cursos {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 310px;
            gap: 10px;
            margin-top: -30px;
        }
        .blocoCursos {
            margin-top: 20px;
        }

    }


</style>
