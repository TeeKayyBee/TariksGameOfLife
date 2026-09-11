import Cell from './Cell';
import { GRID_SIZE } from '../helpers/gameLogic';

/**
 * Das Spielfeld-Raster, das alle Zellen in einer Matrix-Struktur rendert.
 * 
 * @param props - Die Props der Komponente.
 * @param props.grid - Das zweidimensionale Array, welches den aktuellen Zustand aller Zellen enthält.
 * @param props.onCellClick - Die Callback-Funktion, die beim Klick auf eine spezifische Zelle mit deren Koordinaten aufgerufen wird.
 * @returns Das gerenderte Raster mit dynamisch berechneter CSS-Spielfeldgröße.
 */

function Grid({ grid, onCellClick }) {
  return (
    <div
      className="grid"
      style={{ '--grid-size': GRID_SIZE }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cellValue, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            isAlive={cellValue === 1}
            onClick={() => onCellClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
}

export default Grid;