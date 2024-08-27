const GameBoard = (() => {      // Definición del módulo GameBoard usando una IIFE (Immediately Invoked Function Expression).
    let board = ["", "", "", "", "", "", "", "", ""];// Inicializa el tablero con 9 espacios vacíos.

    const getBoard = () => board;// Método para obtener el estado actual del tablero.

    const setCell = (index, marker) => {  // Método para colocar un marcador ('X' o 'O') en una celda específica.
        if (board[index] === "") {        // Verifica si la celda está vacía.
            board[index] = marker;        // Si está vacía, coloca el marcador.
            return true;                  // Retorna true si se ha colocado el marcador.
        }
        return false;                     // Retorna false si la celda ya estaba ocupada.
    };

    const resetBoard = () => {            // Método para reiniciar el tablero.
        board = ["", "", "", "", "", "", "", "", ""];  // Resetea el tablero a su estado inicial (vacío).
    };

    return { getBoard, setCell, resetBoard };  // Expone los métodos `getBoard`, `setCell` y `resetBoard` como API pública del módulo.
})();


const GameController = (() => {      // Definición del módulo GameController usando una IIFE.
    const Player = (name, marker, className) => { // Fabrica para crear jugadores con nombre, marcador y clase CSS.
        return { name, marker, className }; //Retorna un objeto para crear los jugadores
    };

    const player1 = Player("Ironman", "X", "player1");  // Crea el primer jugador con el marcador 'X'.
    const player2 = Player("Cap America", "O", "player2");  // Crea el segundo jugador con el marcador 'O'.

    let currentPlayer = player1;    // Inicializa el jugador actual como `player1`.

    const getCurrentPlayer = () => currentPlayer;   // Método para obtener el jugador actual.
    
    const switchPlayer = () => {            // Método para cambiar el jugador actual.
        currentPlayer = (currentPlayer === player1) ? player2 : player1;    // Alterna entre `player1` y `player2`.
    };

    const playRound = (index) => { // Método para jugar una ronda.
        if (DisplayController.getPc()) {  // Verifica si el modo PC está activado.
            player2.name = "Ultron";      // Si es así, cambia el nombre del jugador 2 a "Ultron".
        }
        if (GameBoard.setCell(index, currentPlayer.marker)) {  // Coloca el marcador en la celda seleccionada.
            DisplayController.updateBoard();  // Actualiza la visualización del tablero.
            if (checkWin()) {               // Verifica si el jugador actual ha ganado.
                updateStatus(`${currentPlayer.name} gana!`);  // Muestra el mensaje de victoria.
                return;  // Termina la ronda.
            }
            if (isDraw()) {                 // Verifica si hay un empate.
                updateStatus("Empate!");    // Muestra el mensaje de empate.
                return;  // Termina la ronda.
            }
            switchPlayer();  // Cambia de jugador.
            updateStatus(`Turno de ${currentPlayer.name}`);// Actualiza el mensaje de estado para el próximo turno.
            
            // Si el jugador actual es `player2` y el modo PC está activado, realiza una jugada automática.
            if (currentPlayer === player2 && DisplayController.getPc()) {
                setTimeout(() => {// Retrasa la jugada automática 1 segundo.
                    const availableMoves = GameBoard.getBoard().map((cell, idx) => cell === "" ? idx : null).filter(index => index !== null);// Busca las celdas vacías.
                    if (availableMoves.length > 0) { //Mientras la longitud de las celdas no sea cero se ejecuta
                        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];  // Selecciona un movimiento aleatorio.
                        playRound(randomMove);  // Realiza la jugada.
                    }
                }, 1000); // Pausa de 1 segundo antes de que player2 haga su movimiento
            } 
        }
    };

    const checkWin = () => {               // Método para verificar si hay un ganador.
        const board = GameBoard.getBoard();  // Obtiene el estado actual del tablero.
        const winPatterns = [              // Define los patrones ganadores.
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  // horizontales
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  // verticales
            [0, 4, 8], [2, 4, 6]            // diagonales
        ];

        return winPatterns.some(pattern => // Verifica si alguno de los patrones es cumplido por el jugador actual.
            pattern.every(index => board[index] === currentPlayer.marker)
        );
    };

    const isDraw = () => {                 // Método para verificar si hay un empate.
        return GameBoard.getBoard().every(cell => cell !== "");  // Verifica si todas las celdas están ocupadas.
    };

    const resetGame = () => {              // Método para reiniciar el juego.
        GameBoard.resetBoard();            // Resetea el tablero.
        currentPlayer = player1;           // Reinicia el jugador actual a `player1`.
        player2.name = "Cap America";      // Restaura el nombre del jugador 2.
        updateStatus(`Turno de ${currentPlayer.name}`);  // Actualiza el mensaje de estado.
        DisplayController.updateBoard();   // Actualiza la visualización del tablero.
        DisplayController.botonVs.classList.remove("vsActive");  // Restaura el estilo del botón VS.
        DisplayController.botonVs.classList.add('vs');
        DisplayController.botonVs.innerText = "Iron Man VS Cap America";  // Restaura el texto del botón VS.
    };

    const updateStatus = (message) => {    // Método para actualizar el mensaje de estado.
        const statusElement = document.getElementById("game-status");  // Obtiene el elemento de estado del DOM.
        if (statusElement) {
            statusElement.textContent = message;  // Actualiza el contenido del elemento de estado.
        } else {
            console.error("Elemento 'game-status' no encontrado");  // Muestra un error si el elemento no se encuentra.
        }
    };

    return { getCurrentPlayer, playRound, resetGame };  // Expone los métodos `getCurrentPlayer`, `playRound` y `resetGame` como API pública del módulo.

})();