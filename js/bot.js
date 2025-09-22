/**
 * @description Classe responsável pelo comportamento do bot
 * @param {Game} game - Instância do jogo
 * @returns {Bot} - Instância do bot
 */
class Bot {
    constructor(game) {
        this.game = game;
    }

    /**
     * @description Bot faz previsões com base na dica atual e nível de dificuldade
     * @param {number} botLevel - Nível do bot
     */
    adivinhar(botLevel) {
      let palavrasRestantes = [];

      if (botLevel === 1) {
            palavrasRestantes = this.getPalavrasAlvoRestantes();
            console.log("Palavras que o bot pode adivinhar:", palavrasRestantes);
      } else {
            palavrasRestantes = this.getPalavrasRestantes();
            console.log("Palavras que o bot pode adivinhar:", palavrasRestantes);
      }
      
      const palavrasParaAdivinhar = this.selecionaElementosAleatorios(palavrasRestantes, 2);
      console.log("Palavras bot vai adivinhar:", palavrasParaAdivinhar.length);
      
      if (palavrasParaAdivinhar.length > 0) {
          for (let i = 0; i < palavrasParaAdivinhar.length; i++) {
              const palavraId = palavrasParaAdivinhar[i].pos;
              const elementToClick = document.getElementById(`b${palavraId}`);
              elementToClick.click();
              
              if (palavrasParaAdivinhar.length === 1) {
                  break;
              }
          }

          setTimeout(() => {
              this.game.avancarParaProximoEstado();
          }, 5000);
      } else {
          // Se todas as palavras alvo forem encontradas, avançar para o próximo estado
          setTimeout(() => {
              this.game.avancarParaProximoEstado();
          }, 5000);
      }
        }

    /**
     * @description Bot gera uma dica
     * @param {number} botLevel - Nível do bot
     */
    gerarDica(botLevel) {
        // Passa para o próximo estado se todas as palavras do parceiro forem encontradas
        if (this.game.parceiroFoundWords.length === 7) {
                this.game.avancarParaProximoEstado();
        } else {
            let palavrasRestantes = [];
            if (botLevel === 1) {
                palavrasRestantes = this.getPalavrasRestantesDoParceiro();
            } else {
                // TODO: Implementar gerar dica do nivel fácil
                palavrasRestantes = this.getPalavrasRestantesDoParceiro();
            }

            const palavraAleatoria = palavrasRestantes[Math.floor(Math.random() * palavrasRestantes.length)];

            const inputPalavra = document.querySelector(".input_palavra");
            inputPalavra.value = palavraAleatoria.palavra;

            const inputNumero = document.querySelector(".input_numero");
            inputNumero.value = 1;

            const botaoEnviarDica = document.querySelector(".botao_enviar_dica");
            setTimeout(() => {
                    botaoEnviarDica.click();
            }, 5000);
        }
    }


    /**
     * @description Pega as palavras alvo restantes
     * @returns {Array} - Array de palavras alvo restantes
     */
    getPalavrasAlvoRestantes() {
        return this.game.palavrasDoJogador.filter(item => 
            !this.game.palavrasEncontradasDoJogador.includes(item)
        );
    }

    /**
     * @description Pega as palavras restantes do parceiro
     * @returns {Array} - Array de palavras restantes do parceiro
     */
    getPalavrasRestantesDoParceiro() {
        return this.game.palavrasDoParceiro.filter(item => 
            !this.game.palavrasEncontradasDoParceiro.includes(item)
        );
    }

    /**
     * @description Seleciona elementos aleatórios de um array
     * @param {Array} arr - Array de elementos
     * @param {number} count - Quantidade de elementos a serem selecionados
     * @returns {Array} - Array de elementos selecionados
     */
    selecionaElementosAleatorios(arr, count) {
        if (arr.length === 0) {
            return [];
        }
        
        if (arr.length === 1) {
            return [arr[0]];
        }

        if (count >= arr.length) {
            return [...arr];
        }

        const indexAleatorio1 = Math.floor(Math.random() * arr.length);
        let indexAleatorio2 = Math.floor(Math.random() * arr.length);

        // Garante que os dois índices sejam diferentes
        while (indexAleatorio2 === indexAleatorio1) {
            indexAleatorio2 = Math.floor(Math.random() * arr.length);
        }

        return [arr[indexAleatorio1], arr[indexAleatorio2]];
    }
}
