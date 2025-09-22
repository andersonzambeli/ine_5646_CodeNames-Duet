/**
 * @description Gerencia a interface do usuário
 * @param {Game} game - Instância do jogo
 * @returns {UIManager} - Instância do UI manager
 */
class UIManager {
    constructor(game) {
        this.game = game;
        this.iniciaEventListeners();
    }

    /**
     * @description Inicia todos os listeners de eventos
     */
    iniciaEventListeners() {
        this.iniciaDicaSubmitListener();
        this.iniciaPassarVezListener();
    }

    /**
     * @description Inicia o listener de envio de dica
     */
    iniciaDicaSubmitListener() {
        const clueButton = document.getElementsByClassName("botao_enviar_dica");
        if (clueButton[0]) {
            clueButton[0].addEventListener("click", this.game.handleClueSubmit);
        }
    }

    /**
     * @description Inicia o listener de passar vez
     */
    iniciaPassarVezListener() {
        const passButton = document.getElementsByClassName("botao_passar_vez");
        if (passButton[0]) {
            passButton[0].addEventListener("click", this.game.handlePassTurn);
        }
    }

    /**
     * @description Atualiza a informação do jogador
     * @param {string} message - Mensagem a ser exibida
     */
    atualizarInfoJogador(message) {
        const playerInfo = document.querySelector("div.info_jogador h1");
        if (playerInfo) {
            playerInfo.textContent = message;
        }
    }

    /**
     * @description Habilita ou desabilita os botões do board
     * @param {boolean} enabled - Se os botões devem ser habilitados ou desabilitados
     */
    habilitarDesabilitarBotoesDoBoard(enabled) {
        const boardButtons = document.getElementsByClassName("board-item");
        for (const button of boardButtons) {
            button.disabled = !enabled;
        }
    }

    /**
     * @description Mostra a mensagem de vitória
     */
    mostrarMensagemDeVitoria() {
        alert("Parabéns! Vocês venceram o jogo!");
    }

    /**
     * @description Mostra a mensagem de derrota
     */
    mostrarMensagemDeDerrota() {
        alert("Game Over! Vocês perderam o jogo!");
    }

    /**
     * @description Atualiza o histórico de dicas
     * @param {number} numeroDoJogador - Número do jogador
     * @param {string} palavra - Palavra
     * @param {number} quantidade - Quantidade
     */
    atualizarHistoricoDeDicas(numeroDoJogador, palavra, quantidade) {
        const historicoDeDicasElements = document.querySelectorAll("div.historico-dicas pre");
        if (historicoDeDicasElements[0]) {
            historicoDeDicasElements[0].textContent += `Jogador ${numeroDoJogador}: Palavra ${palavra}, Quantidade ${quantidade}\n`;
        }
    }

    /**
     * @description Limpa os inputs de dica
     */
    limparInputsDeDica() {
        const inputPalavra = document.querySelector(".input_palavra");
        const inputNumero = document.querySelector(".input_numero");
        
        if (inputPalavra) inputPalavra.value = "";
        if (inputNumero) inputNumero.value = "";
    }

    /**
     * @description Mostra o estado de carregamento para as ações do bot
     */
    mostrarBotPensando() {
        const infoJogador = document.querySelector("div.info_jogador h1");
        if (infoJogador) {
            infoJogador.textContent = "Bot está pensando...";
        }
    }

    /**
     * @description Atualiza o status da palavra no board
     * @param {number} posicao - Posição da palavra
     * @param {string} status - Status da palavra
     * @param {boolean} isPalavraDoJogador - Se a palavra é do jogador
     */
    atualizarStatusDaPalavra(posicao, status, isPalavraDoJogador = false) {
        const element = document.getElementById(`b${posicao}`);
        if (element) {
            const statusClass = isPalavraDoJogador ? "palavra_item_jogador_acertado" : "palavra_item_bot_acertado";
            const statusElement = element.querySelector(`.${statusClass}`);
            if (statusElement) {
                statusElement.textContent = status;
            }
        }
    }

    /**
     * @description destacar palavra no board
     * @param {number} posicao - Posição da palavra
     * @param {boolean} isPalavraCorreta - Se a palavra é correta
     */
    destacarPalavra(posicao, isPalavraCorreta) {
        const element = document.getElementById(`b${posicao}`);
        if (element) {
            element.classList.add(isPalavraCorreta ? "correct-word" : "incorrect-word");
        }
    }

    /**
     * Remove destacar palavra do board
     */
    limparDestacarPalavra() {
        const elements = document.querySelectorAll(".correct-word, .incorrect-word");
        elements.forEach(element => {
            element.classList.remove("correct-word", "incorrect-word");
        });
    }
}
