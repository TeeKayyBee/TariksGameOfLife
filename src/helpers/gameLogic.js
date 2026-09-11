/**
 * Die konstante Kantenlänge des quadratischen Spielfelds.
 * 
 * @remarks
 * Dieser Wert legt fest, dass das Spielfeld aus 15 Zeilen und 15 Spalten besteht
 * und steuert die Schleifendurchläufe bei der Grid-Generierung und Regelberechnung.
 */
export const GRID_SIZE = 15;

/**
 * Erstellt eine neue, leere Matrix (zweidimensionales Array) für das Spielfeld.
 * 
 * @remarks
 * Alle Zellen werden über verschachtelte Arrays initial mit dem Zustand `0` (tot) befüllt. 
 * Die Dimension richtet sich nach der vordefinierten Kantenlänge `GRID_SIZE`.
 * 
 * @returns Eine neue Spielfeld-Matrix, in der alle Zellen den Wert `0` aufweisen.
 */
export function createEmptyGrid() {
  const grid = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    grid.push(new Array(GRID_SIZE).fill(0));
  }
  return grid;
}

/**
 * Zählt die lebenden Nachbarn einer bestimmten Zelle im Raster.
 * 
 * @param grid - Das aktuelle zweidimensionale Array (Spielfeld).
 * @param row - Die Y-Koordinate (Zeile) der Zielzelle.
 * @param col - Die X-Koordinate (Spalte) der Zielzelle.
 * @returns Die Anzahl der lebenden Nachbarzellen (Wert zwischen 0 und 8).
 */
function countAliveNeighbors(grid, row, col) {
  const neighborOffsets = [
    [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1],
  ];


  let count = 0;
  for (const [rowOffset, colOffset] of neighborOffsets) {
    const neighborRow = row + rowOffset;
    const neighborCol = col + colOffset;

    const isInBounds = neighborRow >= 0 && neighborRow < GRID_SIZE && neighborCol >= 0 && neighborCol < GRID_SIZE;

    if (isInBounds && grid[neighborRow][neighborCol] === 1) {
      count++;
    }
  }

  return count;
}

/**
 * Berechnet die nächste Generation des Spielfelds unter der Anwendung der Conway-Regeln.
 * 
 * @remarks
 * Die Funktion iteriert durch jede Koordinate des Rasters, ermittelt die lebenden Nachbarn 
 * über `countAliveNeighbors` und wendet folgende Logik an:
 * - Eine lebende Zelle bleibt mit 2 oder 3 Nachbarn am Leben.
 * - Eine tote Zelle wird mit exakt 3 Nachbarn neu geboren.
 * - Alle anderen Zellen werden in der neuen Matrix als `0` (tot) markiert.
 * 
 * @param grid - Das aktuelle Spielfeld-Raster, auf dessen Basis die Berechnung stattfindet.
 * @returns Eine vollständig neue Matrix, die den nachfolgenden Zustand der Simulation darstellt.
 */
export function computeNextGeneration(grid) {
  const newGrid = createEmptyGrid();

  for (let row = 0; row < GRID_SIZE; row++){
    for (let col = 0; col < GRID_SIZE; col++){
      const aliveNeighbors = countAliveNeighbors(grid, row, col);
      const isAlive = grid[row][col] === 1;

      if(isAlive && (aliveNeighbors === 2 || aliveNeighbors === 3)) {
        newGrid[row][col] = 1;
      } else if (!isAlive && aliveNeighbors === 3) {
        newGrid[row][col] = 1;
      } else {
        newGrid[row][col] = 0;
      }
    }
  }

  return newGrid;
}

/**
 * Überprüft das übergebene Raster auf das Vorhandensein von lebenden Zellen.
 * 
 * @remarks
 * Verwendet die Array-Methode `some`, um die Zeilen und Zellen effizient zu durchsuchen. 
 * Bricht ab und gibt `true` zurück, sobald die erste lebende Zelle (`1`) gefunden wird.
 * 
 * @param grid - Die zu überprüfende Spielfeld-Matrix.
 * @returns Gibt `true` zurück, wenn mindestens eine aktive Zelle existiert, andernfalls `false`.
 */
export function hasAliveCells(grid) {
  return grid.some(row => row.some(cell => cell === 1));
}