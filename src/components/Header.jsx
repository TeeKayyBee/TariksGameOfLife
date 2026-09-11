/**
 * Displays the app title together with a small glider-shaped icon,
 * mirroring the pattern used in the PWA app icons and favicon.
 */
function Header() {
  return (
    <div className="app-header">
      <svg
        className="app-icon"
        viewBox="0 0 5 5"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="1" y="0" width="1" height="1" />
        <rect x="2" y="1" width="1" height="1" />
        <rect x="0" y="2" width="1" height="1" />
        <rect x="1" y="2" width="1" height="1" />
        <rect x="2" y="2" width="1" height="1" />
      </svg>
      <h1>Tarik's Game of Life</h1>
    </div>
  );
}

export default Header;