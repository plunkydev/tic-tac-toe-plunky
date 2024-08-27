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