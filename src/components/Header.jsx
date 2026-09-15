/**
 * Displays the app title together with a small glider-shaped icon.
 * The title text is read from constantsStore, so an admin can
 * change it at runtime.
 */

import { getConstant } from '../store/constantsStore';

function Header() {
  const uiText = getConstant('UI_TEXT');

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