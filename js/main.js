// Instância global do jogo
let game;
let bot;
let uiManager;

/**
 * Inicializa o jogo quando o DOM é carregado
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando jogo...');
    inicializarJogo();
});

/**
 * @description Inicializa o jogo
 */
function inicializarJogo() {
    try {
        // Pega o container do board
        const boardContainer = document.getElementById("board");
        if (!boardContainer) {
            console.error("Container do board não encontrado!");
            return;
        }

        // Inicializa os componentes do jogo
        console.log('Criando instância do jogo...');
        game = new Game(boardContainer);
        console.log('Criando instância do bot...');
        bot = new Bot(game);
        console.log('Criando instância do UI manager...');
        uiManager = new UIManager(game);

        // Conecta o uiManager ao game para acesso mútuo
        game.uiManager = uiManager;

        // Adiciona os métodos do bot ao jogo para fácil acesso
        game.botAdivinhar = (botLevel) => bot.adivinhar(botLevel);
        game.botGerarDica = (botLevel) => bot.gerarDica(botLevel);

        // Inicia o jogo
        console.log('Iniciando jogo...');
        game.avancarParaProximoEstado();
        
        console.log("Jogo inicializado com sucesso!");
    } catch (error) {
        console.error("Erro ao inicializar o jogo:", error);
    }
}

/**
 * @description Reinicia o jogo
 */
function restartGame() {
    if (game) {
        // Limpa o board
        const boardContainer = document.getElementById("board");
        boardContainer.innerHTML = "";
        
        // Reseta o estado do jogo
        game = new Game(boardContainer);
        bot = new Bot(game);
        uiManager = new UIManager(game);
        
        // Conecta o uiManager ao game para acesso mútuo
        game.uiManager = uiManager;
        
        // Adiciona os métodos do bot ao jogo
        game.botAdivinhar = (botLevel) => bot.adivinhar(botLevel);
        game.botGerarDica = (botLevel) => bot.gerarDica(botLevel);
        
        // Inicia o novo jogo
        game.avancarParaProximoEstado();
    }
}

/**
 * @description Pega o estado atual do jogo (para debug)
 */
function getEstadoDoJogo() {
    return {
        estado: game ? game.estado : null,
        palavrasEncontradasDoJogador: game ? game.palavrasEncontradasDoJogador.length : 0,
        palavrasEncontradasDoParceiro: game ? game.palavrasEncontradasDoParceiro.length : 0,
        dicaAtual: game ? game.dicaAtual : null
    };
}
