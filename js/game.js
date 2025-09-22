/**
 * Lógica principal e gerenciamento de estados
 * @param {HTMLElement} parentElement - Elemento pai do jogo
 * @constructor
 * @returns {Game} - Instância do jogo
 */
class Game {
    constructor(parentElement) {
        // Estado do jogo: 0 - player 1 digitando a dica, 1 - player 2 adivinhando, 2 - player 2 digitando a dica, 3 - player 1 adivinhando
        this.estado = 3;
        
        // Configuração do jogo
        this.tipoDeJogo = 0; // 0 - vs bot, 1 - vs player
        this.botLevel = 1; // 0 - fácil, 1 - difícil
        
        // Elementos DOM
        this.parent = parentElement;
        
        // Rastreamento do progresso do jogo
        this.jogadorEncontrouTodos = false;
        this.parceiroEncontrouTodos = false;
        this.dicaAtual = { word: '', number: 0 };
        this.jogosAnteriores = 0;
        
        // Listas de palavras
        this.bancoDePalavras = this.inicializaBancoDePalavras();
        this.palavrasSelecionadas = [];
        this.palavrasDoJogador = [];
        this.palavrasAssassinasDoJogador = [];
        this.palavrasClicadasDoJogador = [];
        this.palavrasEncontradasDoJogador = [];
        this.palavrasDoParceiro = [];
        this.palavrasAssassinasDoParceiro = [];
        this.palavrasClicadasDoParceiro = [];
        this.palavrasEncontradasDoParceiro = [];
        
        // Bind methods to preserve context
        this.handleBoardClick = this.handleBoardClick.bind(this);
        this.handleDicaSubmit = this.handleDicaSubmit.bind(this);
        this.handlePassarVez = this.handlePassarVez.bind(this);
        
        // Inicializar o jogo
        this.criarBoard();
    }

    /**
     * Inicializar o banco de palavras com palavras e suas associações
     */
    inicializaBancoDePalavras() {
        return [
            { palavra: "amor", associadas: ["sentimento", "coração", "emoção"] },
            { palavra: "amizade", associadas: ["confiança", "sentimento", "lealdade"] },
            { palavra: "trabalho", associadas: ["esforço", "meta", "tempo"] },
            { palavra: "escola", associadas: ["educação", "aprendizado", "professor"] },
            { palavra: "professor", associadas: ["aula", "educação", "conhecimento"] },
            { palavra: "aluno", associadas: ["escola", "aprendizado", "prova"] },
            { palavra: "computador", associadas: ["tecnologia", "processador", "informação"] },
            { palavra: "celular", associadas: ["tecnologia", "mensagem", "bateria"] },
            { palavra: "internet", associadas: ["rede", "informação", "conexão"] },
            { palavra: "livro", associadas: ["conhecimento", "leitura", "papel"] },
            { palavra: "papel", associadas: ["escrita", "livro", "caneta"] },
            { palavra: "caneta", associadas: ["escrita", "papel", "mão"] },
            { palavra: "mão", associadas: ["toque", "escrita", "braço"] },
            { palavra: "olho", associadas: ["visão", "rosto", "sentido"] },
            { palavra: "ouvido", associadas: ["audição", "rosto", "sentido"] },
            { palavra: "boca", associadas: ["fala", "rosto", "comida"] },
            { palavra: "nariz", associadas: ["cheiro", "rosto", "ar"] },
            { palavra: "ar", associadas: ["respiração", "vento", "nariz"] },
            { palavra: "vento", associadas: ["ar", "frio", "clima"] },
            { palavra: "frio", associadas: ["clima", "inverno", "vento"] },
            { palavra: "calor", associadas: ["clima", "verão", "sol"] },
            { palavra: "sol", associadas: ["luz", "calor", "dia"] },
            { palavra: "lua", associadas: ["noite", "céu", "luz"] },
            { palavra: "estrela", associadas: ["céu", "noite", "brilho"] },
            { palavra: "céu", associadas: ["azul", "sol", "nuvem"] },
            { palavra: "nuvem", associadas: ["chuva", "céu", "vento"] },
            { palavra: "chuva", associadas: ["água", "nuvem", "clima"] },
            { palavra: "rio", associadas: ["água", "peixe", "natureza"] },
            { palavra: "mar", associadas: ["água", "areia", "onda"] },
            { palavra: "praia", associadas: ["areia", "mar", "sol"] },
            { palavra: "areia", associadas: ["praia", "grão", "solo"] },
            { palavra: "floresta", associadas: ["árvore", "natureza", "animais"] },
            { palavra: "árvore", associadas: ["folha", "tronco", "floresta"] },
            { palavra: "folha", associadas: ["verde", "árvore", "vento"] },
            { palavra: "terra", associadas: ["solo", "natureza", "planta"] },
            { palavra: "planta", associadas: ["terra", "verde", "água"] },
            { palavra: "flor", associadas: ["planta", "beleza", "colorido"] },
            { palavra: "animal", associadas: ["vida", "natureza", "instinto"] },
            { palavra: "cachorro", associadas: ["animal", "amizade", "fidelidade"] },
            { palavra: "gato", associadas: ["animal", "independente", "casa"] },
            { palavra: "pássaro", associadas: ["animal", "asa", "céu"] },
            { palavra: "peixe", associadas: ["água", "animal", "mar"] },
            { palavra: "carro", associadas: ["transporte", "motor", "rua"] },
            { palavra: "ônibus", associadas: ["transporte", "cidade", "viagem"] },
            { palavra: "avião", associadas: ["transporte", "céu", "viagem"] },
            { palavra: "viagem", associadas: ["lazer", "avião", "descoberta"] },
            { palavra: "cidade", associadas: ["rua", "prédio", "pessoas"] },
            { palavra: "rua", associadas: ["cidade", "carro", "trânsito"] },
            { palavra: "prédio", associadas: ["cidade", "janela", "andar"] },
            { palavra: "casa", associadas: ["janela", "porta", "família"] },
            { palavra: "porta", associadas: ["entrada", "fechadura", "casa"] },
            { palavra: "janela", associadas: ["vidro", "casa", "vento"] },
            { palavra: "família", associadas: ["amor", "casa", "união"] },
            { palavra: "bebê", associadas: ["família", "vida", "criança"] },
            { palavra: "criança", associadas: ["escola", "brincadeira", "família"] },
            { palavra: "brinquedo", associadas: ["criança", "diversão", "plástico"] },
            { palavra: "jogo", associadas: ["diversão", "regras", "competição"] },
            { palavra: "bola", associadas: ["jogo", "esporte", "passe"] },
            { palavra: "esporte", associadas: ["bola", "movimento", "corpo"] },
            { palavra: "futebol", associadas: ["bola", "equipe", "gol"] },
            { palavra: "equipe", associadas: ["trabalho", "união", "meta"] },
            { palavra: "meta", associadas: ["trabalho", "objetivo", "planejamento"] },
            { palavra: "tempo", associadas: ["relógio", "vida", "mudança"] },
            { palavra: "relógio", associadas: ["tempo", "ponteiro", "pulso"] },
            { palavra: "dia", associadas: ["sol", "tempo", "trabalho"] },
            { palavra: "noite", associadas: ["lua", "sono", "escuro"] },
            { palavra: "sono", associadas: ["cama", "noite", "descanso"] },
            { palavra: "cama", associadas: ["sono", "travesseiro", "quarto"] },
            { palavra: "quarto", associadas: ["cama", "porta", "luz"] },
            { palavra: "luz", associadas: ["sol", "energia", "visão"] },
            { palavra: "energia", associadas: ["luz", "eletricidade", "movimento"] },
            { palavra: "movimento", associadas: ["corpo", "energia", "dança"] },
            { palavra: "dança", associadas: ["música", "corpo", "movimento"] },
            { palavra: "música", associadas: ["som", "arte", "emoção"] },
            { palavra: "arte", associadas: ["cor", "música", "expressão"] },
            { palavra: "pintura", associadas: ["arte", "cor", "tela"] },
            { palavra: "tela", associadas: ["pintura", "computador", "imagem"] },
            { palavra: "imagem", associadas: ["foto", "tela", "olho"] },
            { palavra: "foto", associadas: ["imagem", "lembrança", "papel"] },
            { palavra: "lembrança", associadas: ["foto", "emoção", "passado"] },
            { palavra: "emoção", associadas: ["sentimento", "lembrança", "música"] },
            { palavra: "história", associadas: ["passado", "livro", "lembrança"] },
            { palavra: "passado", associadas: ["tempo", "história", "memória"] },
            { palavra: "memória", associadas: ["passado", "mente", "lembrança"] },
            { palavra: "mente", associadas: ["pensamento", "memória", "emoção"] },
            { palavra: "pensamento", associadas: ["mente", "reflexão", "ideia"] },
            { palavra: "ideia", associadas: ["criatividade", "pensamento", "inovação"] },
            { palavra: "criatividade", associadas: ["arte", "ideia", "expressão"] },
            { palavra: "expressão", associadas: ["emoção", "arte", "fala"] },
            { palavra: "fala", associadas: ["voz", "palavra", "boca"] },
            { palavra: "palavra", associadas: ["fala", "significado", "leitura"] },
            { palavra: "leitura", associadas: ["palavra", "livro", "conhecimento"] },
            { palavra: "conhecimento", associadas: ["leitura", "sabedoria", "educação"] },
            { palavra: "educação", associadas: ["conhecimento", "escola", "valores"] },
            { palavra: "valores", associadas: ["ética", "educação", "respeito"] },
            { palavra: "respeito", associadas: ["valores", "amizade", "cidadania"] },
            { palavra: "cidadania", associadas: ["respeito", "sociedade", "direitos"] },
            { palavra: "sociedade", associadas: ["pessoas", "cidadania", "mundo"] },
            { palavra: "mundo", associadas: ["vida", "sociedade", "planeta"] },
            { palavra: "vida", associadas: ["mundo", "emoção", "existência"] }
        ];
    }

    /**
     * Verificar se uma palavra é a palavra assassina do parceiro
     */
    isPalavraAssassinaDoParceiro(position) {
        return this.palavrasAssassinasDoParceiro.some(obj => obj.pos === position);
    }

    /**
     * Verificar se uma palavra é a palavra assassina do jogador
     */
    isPalavraAssassinaDoJogador(position) {
        return this.palavrasAssassinasDoJogador.some(obj => obj.pos === position);
    }

    /**
     * Verificar se uma palavra é uma das palavras alvo do parceiro
     */
    isPalavraAlvoDoParceiro(position) {
        return this.palavrasDoParceiro.some(obj => obj.pos === position);
    }

    /**
     * Verificar se uma palavra é uma das palavras alvo do jogador
     */
    isPalavraAlvoDoJogador(position) {
        return this.palavrasDoJogador.some(obj => obj.pos === position);
    }

    /**
     * Avançar para o próximo estado do jogo
     */
    avancarParaProximoEstado() {
        this.estado = (this.estado + 1) % 4;
        console.log("New estado:", this.estado);
        
        this.atualizarUIParaEstadoAtual();
    }

    /**
     * Atualizar os elementos da interface baseado no estado atual
     */
    atualizarUIParaEstadoAtual() {
        const infoJogador = document.querySelector("div.info_jogador h1");
        const boardButtons = this.parent.getElementsByClassName("board-item");
        const botaoEnviarDica = document.getElementsByClassName("botao_enviar_dica");
        
        switch(this.estado) {
            case 0:
                infoJogador.textContent = "Jogador 1 está digitando a dica.";
                break;
            case 1:
                infoJogador.textContent = "Jogador 2 está adivinhando.";
                if (this.botAdivinhar) {
                    this.botAdivinhar(this.botLevel);
                }
                break;
            case 2:
                infoJogador.textContent = "Jogador 2 está digitando a dica.";
                if (this.botGerarDica) {
                    this.botGerarDica(this.botLevel);
                }
                break;
            case 3:
                infoJogador.textContent = "Jogador 1 está adivinhando.";
                for(const button of boardButtons) {
                    button.disabled = false;
                }
                break;
        }
    }

    /**
     * Manipular cliques no tabuleiro
     */
    handleBoardClick(event) {
        const clickedElement = event.target.closest(".board-item");
        const wordElement = clickedElement.querySelector('.palavra_item');
        const wordText = wordElement.textContent;
        
        const selectedWord = this.selectedWords.find(obj => obj.palavra === wordText);
        console.log('Palavra selecionada:', selectedWord);
        
        if (this.estado === 3) {
            this.handleJogadorAdivinhar(clickedElement, selectedWord);
        } else if (this.estado === 1) {
            this.handleParceiroAdivinhar(clickedElement, selectedWord);
        }
    }

    /**
     * Manipular a tentativa do jogador (estado 3)
     */
    handleJogadorAdivinhar(clickedElement, palavraSelecionada) {
        const statusElement = clickedElement.querySelector('.palavra_item_bot_acertado');
        const isAssassin = this.isPalavraAssassinaDoParceiro(palavraSelecionada.pos);
        
        if (isAssassin) {
            alert("Você selecionou o Assassino e por isso vocês perderam o jogo!!!");
            statusElement.textContent = "ASSASSINO";
        } else {
            const isPalavraAlvo = this.isPalavraAlvoDoParceiro(palavraSelecionada.pos);
            
            if (isPalavraAlvo) {
                statusElement.textContent = "AGENTE";
                this.palavrasEncontradasDoParceiro.push(palavraSelecionada);
                this.palavrasClicadasDoParceiro.push(palavraSelecionada);
                this.verificarVitoria();
            } else {
                statusElement.textContent = "CIVIL";
                this.palavrasClicadasDoParceiro.push(palavraSelecionada);
                this.avancarParaProximoEstado();
            }
        }
    }

    /**
     * Manipular a tentativa do parceiro (estado 1)
     */
    handleParceiroAdivinhar(clickedElement, palavraSelecionada) {
        const statusElement = clickedElement.querySelector('.palavra_item_jogador_acertado');
        const isAssassin = this.isPalavraAssassinaDoJogador(palavraSelecionada.pos);
        
        if (isAssassin) {
            alert("O parceiro selecionou o Assassino e por isso vocês perderam o jogo!!!");
            statusElement.textContent = "ASSASSINO";
        } else {
            const isPalavraAlvo = this.isPalavraAlvoDoJogador(palavraSelecionada.pos);
            
            if (isPalavraAlvo) {
                statusElement.textContent = "AGENTE";
                this.palavrasEncontradasDoJogador.push(palavraSelecionada);
                this.palavrasClicadasDoJogador.push(palavraSelecionada);
                this.verificarVitoria();
            } else {
                statusElement.textContent = "CIVIL";
                this.palavrasClicadasDoJogador.push(palavraSelecionada);
                this.avancarParaProximoEstado();
            }
        }
    }

    /**
     * Manipular a submissão da dica
     */
    handleEnviarDica(event) {
        const clickedElement = event.target.closest(".botao_enviar_dica");
        const parent = clickedElement.parentElement;
        
        const inputPalavra = parent.querySelector(".input_palavra");
        const palavra = inputPalavra.value;
        const inputNumero = parent.querySelector(".input_numero");
        const numero = inputNumero.value;
        
        console.log("Dica enviada:", palavra, numero);
        
        this.dicaAtual.palavra = palavra;
        this.dicaAtual.numero = numero;
        
        const numeroDoJogador = this.estado === 0 ? 1 : 2;
        this.atualizarHistoricoDeDicas(numeroDoJogador, palavra, numero);
        
        this.avancarParaProximoEstado();
    }

    /**
     * Manipular o botão de passar a vez
     */
    handlePassarVez(event) {
        this.avancarParaProximoEstado();
    }

    /**
     * Atualizar o histórico de dicas
     */
    atualizarHistoricoDeDicas(numeroDoJogador, palavra, numero) {
        const historicoDeDicas = document.querySelectorAll("div.historico-dicas pre");
        historicoDeDicas[0].textContent += `Jogador ${numeroDoJogador}: Palavra ${palavra}, Quantidade ${numero}\n`;
    }

    /**
     * Verificar se o jogo foi vencido
     */
    verificarVitoria() {
        if (this.palavrasEncontradasDoJogador.length === 7 && this.palavrasEncontradasDoParceiro.length === 7) {
            alert("Jogo Vencido!");
        }
    }

    /**
     * Criar o tabuleiro do jogo
     */
    criarBoard() {
        // Selecionar 25 palavras aleatórias para o tabuleiro
        this.palavrasSelecionadas = this.selecionarPalavrasAleatorias(this.bancoDePalavras, 25);
        
        // Selecionar as palavras do jogador (7 alvo + 1 assassino)
        this.palavrasDoJogador = this.selecionarPalavrasAleatorias(this.palavrasSelecionadas, 7);
        this.palavrasAssassinasDoJogador = this.selecionarPalavrasAleatorias(this.palavrasSelecionadas, 1);
        
        // Selecionar as palavras do parceiro (7 alvo + 1 assassino)
        this.palavrasDoParceiro = this.selecionarPalavrasAleatorias(this.palavrasSelecionadas, 7);
        this.palavrasAssassinasDoParceiro = this.selecionarPalavrasAleatorias(this.palavrasSelecionadas, 1);
        
        console.log("Palavras selecionadas:", this.palavrasSelecionadas);
        console.log("Palavras do jogador:", this.palavrasDoJogador);
        console.log("Palavras assassinas do jogador:", this.palavrasAssassinasDoJogador);
        console.log("Palavras do parceiro:", this.palavrasDoParceiro);
        console.log("Palavras assassinas do parceiro:", this.palavrasAssassinasDoParceiro);
        
        this.criarElementosDoBoard();
    }

    /**
     * Selecionar palavras aleatórias de uma lista sem duplicatas
     */
    selecionarPalavrasAleatorias(listaDePalavras, count) {
        const selecionada = [];
        const palavrasDisponiveis = [...listaDePalavras];
        
        for (let i = 0; i < count; i++) {
            const indexAleatorio = Math.floor(Math.random() * palavrasDisponiveis.length);
            const palavraSelecionada = palavrasDisponiveis[indexAleatorio];
            palavraSelecionada.pos = selecionada.length; // Atribuir posição
            selecionada.push(palavraSelecionada);
            palavrasDisponiveis.splice(indexAleatorio, 1);
        }
        
        return selecionada;
    }

    /**
     * Criar elementos HTML para o tabuleiro
     */
    criarElementosDoBoard() {
        for (let i = 0; i < 25; i++) {
            const linha = parseInt(i / 5);
            const coluna = i % 5;
            
            const item = document.createElement("button");
            item.setAttribute("id", "b" + i);
            item.setAttribute("class", "board-item");
            
            // Exibição da palavra
            const palavraElement = document.createElement("p");
            palavraElement.setAttribute("class", "palavra_element");
            palavraElement.textContent = this.palavrasSelecionadas[i].palavra;
            item.append(palavraElement);
            
            // Exibição do status do jogador
            const jogadorStatusElement = document.createElement("p");
            jogadorStatusElement.textContent = "?";
            jogadorStatusElement.setAttribute("class", "palavra_item_jogador_acertado");
            item.append(jogadorStatusElement);
            
            // Exibição do status do parceiro
            const parceiroStatusElement = document.createElement("p");
            parceiroStatusElement.setAttribute("class", "palavra_item_bot_acertado");
            parceiroStatusElement.textContent = "?";
            item.append(parceiroStatusElement);
            
            item.addEventListener('click', this.handleBoardClick);
            this.parent.append(item);
        }
    }
}
