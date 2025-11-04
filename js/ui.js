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
            clueButton[0].addEventListener("click", this.game.handleEnviarDica);
        }
    }

    /**
     * @description Inicia o listener de passar vez
     */
    iniciaPassarVezListener() {
        const passButton = document.getElementsByClassName("botao_passar_vez");
        if (passButton[0]) {
            passButton[0].addEventListener("click", this.game.handlePassarVez);
        }
    }

    /**
     * @description Atualiza a informação do jogador
     * @param {string} message - Mensagem a ser exibida
     */
    atualizarInfoJogador(message) {
        const playerInfo = document.getElementById("status-jogador") || document.querySelector("div.info_jogador h1");
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
        const historicoContent = document.getElementById("historico-content");
        const historicoPre = document.querySelector("div.historico-dicas pre");
        
        // Remove mensagem de vazio se existir
        const historicoVazio = document.querySelector(".historico-vazio");
        if (historicoVazio) {
            historicoVazio.remove();
        }
        
        // Usa o novo formato se disponível, senão usa o formato antigo
        if (historicoContent) {
            const historicoItem = document.createElement("div");
            historicoItem.className = "historico-item";
            historicoItem.innerHTML = `<strong>Jogador ${numeroDoJogador}:</strong> "${palavra}" - ${quantidade} palavra${quantidade > 1 ? 's' : ''}`;
            historicoContent.appendChild(historicoItem);
            historicoContent.scrollTop = historicoContent.scrollHeight;
        } else if (historicoPre) {
            historicoPre.textContent += `Jogador ${numeroDoJogador}: Palavra ${palavra}, Quantidade ${quantidade}\n`;
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
        const infoJogador = document.getElementById("status-jogador") || document.querySelector("div.info_jogador h1");
        if (infoJogador) {
            infoJogador.textContent = "Bot está pensando...";
        }
    }

    /**
     * @description Atualiza os contadores de progresso
     * @param {number} jogador1 - Número de palavras encontradas pelo jogador 1
     * @param {number} jogador2 - Número de palavras encontradas pelo jogador 2
     */
    atualizarProgresso(jogador1, jogador2) {
        const progressoJogador1 = document.getElementById("progresso-jogador1");
        const progressoJogador2 = document.getElementById("progresso-jogador2");
        const contadorJogador1 = document.getElementById("contador-jogador1");
        const contadorJogador2 = document.getElementById("contador-jogador2");
        
        const maxPalavras = 7;
        const porcentagem1 = (jogador1 / maxPalavras) * 100;
        const porcentagem2 = (jogador2 / maxPalavras) * 100;
        
        if (progressoJogador1) {
            progressoJogador1.style.width = `${porcentagem1}%`;
        }
        if (progressoJogador2) {
            progressoJogador2.style.width = `${porcentagem2}%`;
        }
        if (contadorJogador1) {
            contadorJogador1.textContent = `${jogador1}/${maxPalavras}`;
        }
        if (contadorJogador2) {
            contadorJogador2.textContent = `${jogador2}/${maxPalavras}`;
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
