/**
 * Displays the app title together with a small glider-shaped icon.
 * The title text is read reactively from constantsStore via
 * useStoreValue, so an admin's edit updates it immediately.
 */

import useStoreValue from '../hooks/useStoreValue';

function Header() {
  const uiText = useStoreValue('UI_TEXT');

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
      <h1>{uiText.appTitle}</h1>
    </div>
  );
}

export default Header;