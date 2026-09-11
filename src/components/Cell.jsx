/**
 * Repräsentiert eine einzelne Zelle im Game of Life Raster.
 * 
 * @param props - Die Props der Komponente.
 * @param props.isAlive - Bestimmt, ob die Zelle lebendig (true) oder tot (false) ist.
 * @param props.onClick - Die Callback-Funktion, die bei einem Klick auf die Zelle ausgelöst wird.
 * @returns Ein interaktives div-Element, das den visuellen Zustand der Zelle darstellt.
 */

function Cell({ isAlive, onClick }) {
  return (
    <div
      className={`cell ${isAlive ? 'alive' : 'dead'}`}
      onClick={onClick}
    />
  );
}

export default Cell;