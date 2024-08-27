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


const GameController = (() => {  
    const Player = (name, marker, className) => {  // Función para crear un objeto jugador con nombre, marcador y clase CSS.
        return { name, marker, className }; // Devuelve un objeto con las propiedades name, marker y className.
    };

    const player1 = Player("Ironman", "X", "player1"); // Crea al primer jugador, llamado Ironman, con el marcador "X" y la clase "player1".
    const player2 = Player("Cap America", "O", "player2"); // Crea al segundo jugador, llamado Cap America, con el marcador "O" y la clase "player2".
    
    let currentPlayer = player1; // Define al jugador actual, empezando por player1 (Ironman).
    
    const getCurrentPlayer = () => currentPlayer; // Función para obtener el jugador actual.
    
    const switchPlayer = () => {  // Función para cambiar al siguiente jugador.
        currentPlayer = (currentPlayer === player1) ? player2 : player1; // Si el jugador actual es player1, cambia a player2, y viceversa.
    };

    const playRound = (index) => {  // Función principal que ejecuta una ronda de juego.
        if (DisplayController.getPc()) {  // Verifica si el modo PC está activado.
            player2.name = "Ultron"; // Cambia el nombre de player2 a Ultron si el modo PC está activado.
        }
        if (GameBoard.setCell(index, currentPlayer.marker)) {  // Intenta colocar el marcador del jugador actual en la celda indicada.
            DisplayController.updateBoard(); // Actualiza la visualización del tablero.
            if (checkWin()) {  // Verifica si el jugador actual ha ganado.
                updateStatus(`${currentPlayer.name} gana!`); // Si gana, actualiza el estado con un mensaje de victoria.
                return; // Termina la ronda.
            }
            if (isDraw()) {  // Verifica si hay un empate (todas las celdas llenas y sin ganador).
                updateStatus("Empate!"); // Si hay empate, actualiza el estado con un mensaje de empate.
                return; // Termina la ronda.
            }
            switchPlayer(); // Cambia al otro jugador.
            updateStatus(`Turno de ${currentPlayer.name}`); // Actualiza el mensaje de estado con el nombre del próximo jugador.
            
            if (currentPlayer === player2 && DisplayController.getPc()) {  // Si es el turno de la PC y el modo PC está activado:
                setTimeout(() => {  // Espera 1 segundo antes de que la PC haga su movimiento.
                    const availableMoves = GameBoard.getBoard()  // Obtiene el tablero y mapea las celdas disponibles.
                        .map((cell, idx) => cell === "" ? idx : null)  // Mapea las celdas vacías (disponibles).
                        .filter(index => index !== null);  // Filtra las celdas que no están vacías.
                    const blockMove = findBlockingMove(); // Llama a la función para encontrar un movimiento que bloquee a player1.
                    if (blockMove !== null) {  // Si hay un movimiento de bloqueo:
                        playRound(blockMove); // Realiza ese movimiento de bloqueo.
                    } else if (availableMoves.length > 0) {  // Si no hay necesidad de bloquear y hay movimientos disponibles:
                        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)]; // Selecciona un movimiento aleatorio.
                        playRound(randomMove); // Realiza el movimiento aleatorio.
                    }
                }, 1000); // Pausa de 1 segundo antes de que la PC realice su movimiento.
            } 
        }
    };

    const winPatterns = [  // Define los patrones ganadores (3 en línea).
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Patrones horizontales.
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Patrones verticales.
        [0, 4, 8], [2, 4, 6]  // Patrones diagonales.
    ];
    const findBlockingMove = () => {  // Función que encuentra el movimiento de bloqueo.
        const board = GameBoard.getBoard(); // Obtiene el estado actual del tablero.

        for (let pattern of winPatterns) {  // Recorre cada patrón ganador.
            const [a, b, c] = pattern;  // Desestructura los índices del patrón.
            if (board[a] === "X" && board[b] === "X" && board[c] === "") return c; // Si hay dos "X" y un espacio vacío en una línea, devuelve el índice del espacio vacío.
            if (board[a] === "X" && board[b] === "" && board[c] === "X") return b; // Si hay dos "X" en los extremos y un espacio vacío en el medio, devuelve el índice del espacio vacío.
            if (board[a] === "" && board[b] === "X" && board[c] === "X") return a; // Si hay un espacio vacío al inicio y dos "X" después, devuelve el índice del espacio vacío.
        }
        return null; // Si no hay necesidad de bloquear, devuelve null.
    };

    const checkWin = () => {  // Función que verifica si hay un ganador.
        const board = GameBoard.getBoard(); // Obtiene el estado actual del tablero.
        return winPatterns.some(pattern =>  // Retorna true si algún patrón ganador es completado por el jugador actual.
            pattern.every(index => board[index] === currentPlayer.marker) // Verifica si todos los índices del patrón tienen el marcador del jugador actual.
        );
    };

    const isDraw = () => {  // Función que verifica si hay un empate.
        return GameBoard.getBoard().every(cell => cell !== ""); // Retorna true si todas las celdas están ocupadas.
    };

    const resetGame = () => {  // Función que reinicia el juego.
        GameBoard.resetBoard(); // Reinicia el tablero.
        currentPlayer = player1; // Reinicia el jugador actual a player1.
        player2.name = "Cap America"; // Restaura el nombre de player2 a Cap America.
        updateStatus(`Turno de ${currentPlayer.name}`); // Actualiza el mensaje de estado con el nombre de player1.
        DisplayController.updateBoard(); // Actualiza la visualización del tablero.
        DisplayController.botonVs.classList.remove("vsActive"); // Elimina la clase "vsActive" del botón VS.
        DisplayController.botonVs.classList.add('vs'); // Añade la clase "vs" al botón VS.
        DisplayController.botonVs.innerText = "Iron Man VS Cap America"; // Restaura el texto del botón VS.
    };

    const updateStatus = (message) => {  // Función que actualiza el mensaje de estado del juego.
        const statusElement = document.getElementById("game-status"); // Obtiene el elemento de estado del DOM.
        if (statusElement) {  
            statusElement.textContent = message; // Si el elemento existe, actualiza su texto con el mensaje proporcionado.
        } else {  
            console.error("Elemento 'game-status' no encontrado"); // Muestra un error en la consola si el elemento no se encuentra.
        }
    };

    return { getCurrentPlayer, playRound, resetGame }; // Retorna las funciones públicas del módulo (`getCurrentPlayer`, `playRound`, `resetGame`).
})();