/**
 * @description Classe responsável pelo comportamento do bot
 * @param {Game} game - Instância do jogo
 * @returns {Bot} - Instância do bot
 */
const HOST = '127.0.0.1'
const PORT = 8088



class Bot {
    constructor(game) {
        this.game = game;
    }

    /**
     * @description Bot faz previsões com base na dica atual e nível de dificuldade
     * @param {number} botLevel - Nível do bot
     */
    async adivinhar(botLevel) {
      console.log(`Bot iniciando adivinhação com nível: ${botLevel}`);
      let palavrasRestantes = [];

      if (botLevel === 0) {
            palavrasRestantes = this.getPalavrasRestantesDoJogador();
            console.log("Palavras que o bot pode adivinhar (nível facil):", palavrasRestantes);
      } else if(botLevel === 0) {
            palavrasRestantes = this.getPalavrasRestantes();
            console.log("Palavras que o bot pode adivinhar (nível dificil):", palavrasRestantes);
      } else {
            palavrasRestantes = this.getPalavrasRestantes();
            console.log("Palavras que o bot pode adivinhar (nível AI):", palavrasRestantes);

      }
      
      // Usar lógica inteligente baseada na dica atual
      const palavrasParaAdivinhar = await this.selecionarPalavrasInteligentes(palavrasRestantes, botLevel);
      console.log("Palavras que o bot vai adivinhar (seleção inteligente):", palavrasParaAdivinhar);
      console.log(palavrasParaAdivinhar)
      
      if (palavrasParaAdivinhar.length > 0) {
          this.clicarPalavrasSequencialmente(palavrasParaAdivinhar, 0);
      } else {
          // Se todas as palavras alvo forem encontradas, avançar para o próximo estado
          setTimeout(() => {
              this.game.avancarParaProximoEstado();
          }, 2000);
      }
    }

    /**
     * @description Seleciona palavras inteligentemente baseado na dica atual
     * @param {Array} palavrasRestantes - Array de palavras restantes
     * @returns {Array} - Array de palavras selecionadas inteligentemente
     */
    async selecionarPalavrasInteligentes(palavrasRestantes, botLevel) {

        const dicaAtual = this.game.dicaAtual;
        console.log("Dica atual para análise:", dicaAtual);

        if (!dicaAtual.palavra || dicaAtual.palavra.trim() === '') {
            console.log("Nenhuma dica disponível, usando seleção aleatória");
            return this.selecionaElementosAleatorios(
                palavrasRestantes,
                Math.min(2, palavrasRestantes.length)
            );
        }

        if (botLevel !== 2) {
            const palavrasAssociadas = this.encontrarPalavrasAssociadas(
                dicaAtual.palavra,
                palavrasRestantes
            );

            if (palavrasAssociadas.length > 0) {
                return palavrasAssociadas.slice(0, Math.min(dicaAtual.numero || 2, palavrasAssociadas.length));
            }

            return this.selecionaElementosAleatorios(
                palavrasRestantes,
                Math.min(2, palavrasRestantes.length)
            );
        }

        // -------------------------------
        //      BOT NIVEL 2 (WebSocket)
        // -------------------------------
        console.log("Mandando msg para o roteador para o GPT.");

        let prompt = "Você está jogando o jogo CodeNames. As palavras brancas são: ";
        prompt += palavrasRestantes.map(p => p.palavra).join(", ");
        prompt += `. A dica é ${dicaAtual.palavra} com ${dicaAtual.numero} palavras associadas. `;
        prompt += "Escolha as palavras e retorne apenas elas separadas por vírgula.";

        console.log("Prompt enviado:", prompt);

        try {
            const resultado = await new Promise((resolve, reject) => {
                const ws = new WebSocket(`ws://${HOST}:${PORT}/`);

                ws.onopen = () => {
                    ws.send(prompt);
                };

                ws.onmessage = (event) => {
                    const palavras = event.data.split(",").map(p => p.trim());
                    let palavras_secionadas = []
                    for (const p of palavras) {
                        for (const p2 of palavrasRestantes){
                            if (p == p2.palavra){
                                palavras_secionadas.push(p2)
                            }
                        }
                    }
                    console.log('Palavras slecionadas após receber a resposta da IA:')
                    console.log(palavras_secionadas)
                    resolve(palavras_secionadas);                    
                    ws.close();
                };

                ws.onerror = (err) => {
                    reject(err);
                    ws.close();
                };
            });

            console.log("Resposta do WebSocket:", resultado);
            return resultado;

        } catch (error) {
            console.log("Erro no WebSocket, fallback para bot local:", error);

            const palavrasAssociadas = this.encontrarPalavrasAssociadas(
                dicaAtual.palavra,
                palavrasRestantes
            );

            if (palavrasAssociadas.length > 0) {
                return palavrasAssociadas.slice(0, Math.min(dicaAtual.numero || 2, palavrasAssociadas.length));
            }

            return this.selecionaElementosAleatorios(
                palavrasRestantes,
                Math.min(2, palavrasRestantes.length)
            );
        }
    }

    /**
     * @description Encontra palavras que têm associações com a dica
     * @param {string} dica - A dica atual
     * @param {Array} listaDePalavras - Array de palavras
     * @returns {Array} - Array de palavras associadas
     */
    encontrarPalavrasAssociadas(dica, listaDePalavras) {
        const palavrasAssociadas = [];
        const dicaLower = dica.toLowerCase().trim();
        
        for (const palavra of listaDePalavras) {
            let pontuacao = 0;
            let razao = "";
            
            // Verificar se a palavra tem associações com a dica
            if (palavra.associadas && palavra.associadas.length > 0) {
                for (const associada of palavra.associadas) {
                    const associadaLower = associada.toLowerCase();
                    
                    // Verificação exata (maior pontuação)
                    if (associadaLower === dicaLower) {
                        pontuacao += 10;
                        razao = `associação exata: "${associada}"`;
                    }
                    // Verificação de inclusão (pontuação média)
                    // else if (associadaLower.includes(dicaLower) || dicaLower.includes(associadaLower)) {
                    //     pontuacao += 5;
                    //     razao = `associação parcial: "${associada}"`;
                    // }
                    // // Verificação de palavras similares (pontuação baixa)
                    // else if (this.saoPalavrasSimilares(associadaLower, dicaLower)) {
                    //     pontuacao += 3;
                    //     razao = `associação similar: "${associada}"`;
                    // }
                }
            }
            
            const palavraLower = palavra.palavra.toLowerCase();
            // Verificar se a própria palavra é similar à dica
            if (palavraLower === dicaLower) {
                pontuacao += 10;
                razao = "palavra exata";
            }
            // } else if (palavraLower.includes(dicaLower) || dicaLower.includes(palavraLower)) {
            //     pontuacao += 5;
            //     razao = "similaridade direta";
            // } else if (this.saoPalavrasSimilares(palavra.palavra.toLowerCase(), dicaLower)) {
            //     pontuacao += 3;
            //     razao = "similaridade parcial";
            // }
            
            // Se tem pontuação, adicionar à lista
            if (pontuacao > 0) {
                palavrasAssociadas.push({
                    ...palavra,
                    pontuacao: pontuacao,
                    razao: razao
                });
                console.log(`Associação encontrada: "${palavra.palavra}" (${pontuacao} pontos) - ${razao}`);
            }
        }
        
        // Ordenar por pontuação (maior primeiro)
        palavrasAssociadas.sort((a, b) => b.pontuacao - a.pontuacao);
        console.log("Palavras associadas")
        console.log(palavrasAssociadas)
        return palavrasAssociadas;
    }

    /**
     * @description Verifica se duas palavras são similares (método simples)
     * @param {string} palavra1 - Primeira palavra
     * @param {string} palavra2 - Segunda palavra
     * @returns {boolean} - Se as palavras são similares
     */
    saoPalavrasSimilares(palavra1, palavra2) {
        // Verificar se compartilham pelo menos 3 caracteres consecutivos
        for (let i = 0; i <= palavra1.length - 3; i++) {
            const substring = palavra1.substring(i, i + 3);
            if (palavra2.includes(substring)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @description Clica nas palavras de forma sequencial, aguardando a resposta de cada uma
     * @param {Array} palavrasParaAdivinhar - Array de palavras para adivinhar
     * @param {number} indiceAtual - Índice atual da palavra sendo clicada
     */
    clicarPalavrasSequencialmente(palavrasParaAdivinhar, indiceAtual) {
        if (indiceAtual >= palavrasParaAdivinhar.length) {
            // Todas as palavras foram clicadas, aguardar um pouco e avançar
            setTimeout(() => {
                this.game.avancarParaProximoEstado();
            }, 2000);
            
            return;
        }

        const palavraAtual = palavrasParaAdivinhar[indiceAtual];
        
        // Encontrar a posição real da palavra no tabuleiro
        const posicaoBoard = this.PosicaoDaPalavraNoBoard(palavraAtual.palavra);
        const elementToClick = document.getElementById(`b${posicaoBoard}`);
        
        if (elementToClick) {
            console.log(`Bot clicando na palavra: ${palavraAtual.palavra} (posição real: ${posicaoBoard})`);
            elementToClick.click();
            console.log("bot clicou")
            console.log(this.game.palavrasDoJogador)

            // Verificar se a palavra clicada é do jogador
            const isPalavraDoJogador = this.game.palavrasDoJogador.some(obj => obj.pos === palavraAtual.pos);
            
            if (!isPalavraDoJogador) {
                console.log("Bot clicou em palavra que não é do jogador, perdendo a vez");
                return; // Para de clicar nas palavras restantes
            }
            
            console.log("Bot acertou! Continuando para próxima palavra");
            
            // Aguardar um tempo antes de clicar na próxima palavra
            setTimeout(() => {
                this.clicarPalavrasSequencialmente(palavrasParaAdivinhar, indiceAtual + 1);
            }, 1500);
        } else {
            console.error(`Elemento não encontrado para palavra: ${palavraAtual.palavra} (posição: ${posicaoBoard})`);
            // Mesmo se não encontrar o elemento, continuar com a próxima palavra
            this.clicarPalavrasSequencialmente(palavrasParaAdivinhar, indiceAtual + 1);
        }
    }

    /**
     * @description Encontra a posição real de uma palavra no tabuleiro
     * @param {string} palavra - A palavra a ser encontrada
     * @returns {number} - A posição real no tabuleiro (0-24)
     */
    PosicaoDaPalavraNoBoard(palavra) {
        for (let i = 0; i < this.game.palavrasSelecionadas.length; i++) {
            if (this.game.palavrasSelecionadas[i].palavra === palavra) {
                return i;
            }
        }
        console.error(`Palavra não encontrada no tabuleiro: ${palavra}`);
        return 0; // Fallback para posição 0
    }

    /**
     * @description Bot gera uma dica
     * @param {number} botLevel - Nível do bot
     */
    async gerarDica(botLevel) {
        console.log(`Bot iniciando geração de dica com nível: ${botLevel}`);
        
        
        let palavrasRestantes = [];
        if (botLevel === 0) {
            palavrasRestantes = this.getPalavrasAlvoDoJogadorRestantes();
        } else {
            // TODO: Implementar gerar dica do nivel fácil
            palavrasRestantes = this.getPalavrasAlvoDoJogadorRestantes();
        }

        // Gerar dica inteligente baseada nas palavras restantes
        const dicaInteligente = await this.gerarDicaInteligente(palavrasRestantes, botLevel);
        console.log("Dica inteligente gerada:", dicaInteligente);

        const inputPalavra = document.querySelector(".input_palavra");
        inputPalavra.value = dicaInteligente.palavra;

        const inputNumero = document.querySelector(".input_numero");
        inputNumero.value = dicaInteligente.numero;

        const botaoEnviarDica = document.querySelector(".botao_enviar_dica");
        setTimeout(() => {
                botaoEnviarDica.click();
        }, 3000);
    
    }

    /**
     * @description Gera uma dica inteligente baseada nas palavras restantes
     * @param {Array} palavrasRestantes - Array de palavras restantes do parceiro
     * @param {number} botLevel - Nível do bot
     * @returns {Object} - Objeto com palavra e número da dica
     */
    async gerarDicaInteligente(palavrasRestantes, botLevel) {
        if (palavrasRestantes.length === 0) {
            return { palavra: "fim", numero: 0 };
        }

        
        
        if (botLevel !== 2) {// Encontrar palavras que podem ser agrupadas por associações comuns
            const gruposAssociacoes = this.agruparPalavrasPorAssociacoes(palavrasRestantes);
            console.log("Grupos de associações encontrados:", gruposAssociacoes);

            // Escolher o melhor grupo (com mais palavras)
            let melhorGrupo = null;
            let maiorTamanho = 0;

            for (const [associacao, palavras] of gruposAssociacoes.entries()) {
                if (palavras.length > maiorTamanho) {
                    maiorTamanho = palavras.length;
                    melhorGrupo = { associacao, palavras };
                }
            }

            // Se encontrou um grupo bom, usar a associação como dica
            if (melhorGrupo && melhorGrupo.palavras.length >= 2) {
                const numero = Math.min(melhorGrupo.palavras.length, 3); // Máximo 3 palavras por dica
                console.log(`Dica inteligente: "${melhorGrupo.associacao}" para ${numero} palavras`);
                return { palavra: melhorGrupo.associacao, numero: numero };
            }

            // Se não encontrou grupos, usar uma palavra aleatória
            const palavraAleatoria = palavrasRestantes[Math.floor(Math.random() * palavrasRestantes.length)];
            console.log("Usando palavra aleatória como dica:", palavraAleatoria.palavra);
            return { palavra: palavraAleatoria.palavra, numero: 1 };

            } else {

            let prompt = "Você está jogando o jogo de associação CodeNames. As palavras são: Vermelho: ";
            prompt += palavrasRestantes.map(p => p.palavra).join(", ");
            prompt += `.Você é o jogador vermelho. É a sua vez de dar a dica. Dê a dica escrevendo somente a palavra seguida do numero de palavaras associadas sem qualquer outro texto.`;
            

            console.log("Prompt enviado:", prompt);

            try {
                const resultado = await new Promise((resolve, reject) => {
                    const ws = new WebSocket(`ws://${HOST}:${PORT}/`);

                    ws.onopen = () => {
                        ws.send(prompt);
                    };

                    ws.onmessage = (event) => {
                        const resposta = event.data.split(" ").map(p => p.trim());
                        console.log('Resposta da IA:')
                        console.log(resposta)
                        resolve(resposta)                        
                        
                        
                    };

                    ws.onerror = (err) => {
                        reject(err);
                        ws.close();
                    };
                });

                console.log("Resposta do WebSocket:", resultado);
                const dica = {palavra: resultado[0], numero: resultado[1]}
                return dica

            } catch (error) {
                console.log("Erro no WebSocket, fallback para bot local:", error);

                return{palavra: "fim", numero: 0}

               
            }



        }
    }

    /**
     * @description Agrupa palavras por suas associações comuns
     * @param {Array} palavrasRestantes - Array de palavras restantes
     * @returns {Map} - Mapa de associações para palavras
     */
    agruparPalavrasPorAssociacoes(palavrasRestantes) {
        const grupos = new Map();

        for (const palavra of palavrasRestantes) {
            if (palavra.associadas && palavra.associadas.length > 0) {
                for (const associada of palavra.associadas) {
                    if (!grupos.has(associada)) {
                        grupos.set(associada, []);
                    }
                    grupos.get(associada).push(palavra);
                }
            }
        }

        // Filtrar grupos com pelo menos 2 palavras
        const gruposValidos = new Map();
        for (const [associacao, palavras] of grupos.entries()) {
            if (palavras.length >= 2) {
                gruposValidos.set(associacao, palavras);
            }
        }

        return gruposValidos;
    }

    /**
     * @description pega todas as palavras restantes do jogo
     * @returns {Array} - Array de palavras restantes do jogo
     */
    getPalavrasRestantes() {
        return this.game.palavrasSelecionadas.filter(item => 
            !this.game.palavrasClicadasDoParceiro.includes(item)
        );
    }

    /**
     * @description Pega as palavras alvo restantes
     * @returns {Array} - Array de palavras alvo restantes
     */
    getPalavrasAlvoDoJogadorRestantes() {
        return this.game.palavrasDoParceiro.filter(item => 
            !this.game.palavrasEncontradasDoParceiro.includes(item)
        );
    }

    /**
     * @description Pega as palavras restantes do parceiro
     * @returns {Array} - Array de palavras restantes do parceiro
     */
    getPalavrasRestantesDoJogador() {
        return this.game.palavrasDoJogador.filter(item => 
            !this.game.palavrasEncontradasDoJogador.includes(item)
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
