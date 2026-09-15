/**
 * Small demo panel showing the RBAC-protected constants store in
 * action: any role can view the current values, but only a
 * successfully authenticated admin can change them.
 */

import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { getConstant, setConstant } from '../store/constantsStore';

function AdminSettings() {
  const { role, login, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [speed, setSpeed] = useState(getConstant('DEFAULT_SIMULATION_SPEED_MS'));
  const [saveMessage, setSaveMessage] = useState('');

  function handleLoginSubmit(event) {
    event.preventDefault();
    const success = login(username, password);
    setLoginError(!success);
  }

  function handleSaveSpeed() {
    const wasAllowed = setConstant('DEFAULT_SIMULATION_SPEED_MS', speed, role);
    setSaveMessage(wasAllowed ? 'Gespeichert.' : 'Keine Berechtigung.');
  }

  if (role !== 'admin') {
    return (
      <div className="admin-settings">
        <form onSubmit={handleLoginSubmit}>
          <input
            type="text"
            placeholder="Benutzername"
            value={username}
            onChange={function handleUsernameChange(e) { setUsername(e.target.value); }}
          />
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={function handlePasswordChange(e) { setPassword(e.target.value); }}
          />
          <button type="submit">Anmelden</button>
        </form>
        {loginError && <p className="admin-settings-error">Login fehlgeschlagen.</p>}
        <p>Aktuelle Standard-Geschwindigkeit: {getConstant('DEFAULT_SIMULATION_SPEED_MS')}ms (nur lesbar)</p>
      </div>
    );
  }

  return (
    <div className="admin-settings">
      <p>Angemeldet als Admin.</p>
      <label htmlFor="admin-speed">Standard-Geschwindigkeit (ms)</label>
      <input
        id="admin-speed"
        type="number"
        value={speed}
        onChange={function handleSpeedInput(e) { setSpeed(Number(e.target.value)); }}
      />
      <button onClick={handleSaveSpeed}>Speichern</button>
      <button onClick={logout}>Abmelden</button>
      {saveMessage && <p>{saveMessage}</p>}
    </div>
  );
}

export default AdminSettings;