/**
 * Full admin panel for constantsStore. Any role can view the login
 * form, but only the admin role can persist changes via
 * setConstant() - enforced inside the store itself, not just here.
 *
 * Edits are held in local "draft" state and only written to the
 * store when "Alle Änderungen speichern" is clicked, so an admin can
 * adjust several fields before committing them all at once.
 */

import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { getAllConstants, setConstant } from '../store/constantsStore';

/**
 * Converts a comma-separated string like "10, 15, 20" into a clean
 * array of positive integers, e.g. [10, 15, 20]. Invalid entries
 * (non-numbers, zero, negatives) are silently dropped rather than
 * causing an error, since this runs on every keystroke while typing.
 * @param {string} text
 * @returns {number[]}
 */
function parseSizeList(text) {
  return text
    .split(',')
    .map(function trimAndParse(part) {
      return Number(part.trim());
    })
    .filter(function isValidNumber(n) {
      return Number.isInteger(n) && n > 0;
    });
}

function AdminSettings() {
  const { role, login, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [draft, setDraft] = useState(getAllConstants);
  const [saveMessage, setSaveMessage] = useState('');

  /**
   * Attempts to log in with the entered credentials. On success,
   * refreshes the draft from the store, so the form reflects any
   * changes made elsewhere since the panel was last opened.
   * @param {SubmitEvent} event
   */
  function handleLoginSubmit(event) {
    event.preventDefault();
    const success = login(username, password);
    setLoginError(!success);
    if (success) {
      setDraft(getAllConstants());
    }
  }

  /**
   * Updates a single top-level field in the local draft, without
   * touching the store yet.
   * @param {string} key
   * @param {*} value
   */
  function updateDraftField(key, value) {
    setDraft(function mergeField(prevDraft) {
      return { ...prevDraft, [key]: value };
    });
  }

  /**
   * Updates a single field inside the nested UI_TEXT object in the
   * local draft, without touching the store yet.
   * @param {string} field
   * @param {string} value
   */
  function updateDraftUiText(field, value) {
    setDraft(function mergeUiText(prevDraft) {
      return { ...prevDraft, UI_TEXT: { ...prevDraft.UI_TEXT, [field]: value } };
    });
  }

  /**
   * Persists every field in the draft to the store in one go.
   * Each individual write still goes through setConstant()'s own
   * role check - handleSaveAll does not bypass that, it just calls
   * it once per key.
   */
  function handleSaveAll() {
    const keysToSave = [
      'DEFAULT_TILE_SIZE',
      'TILE_SIZE_OPTIONS',
      'DEFAULT_SIMULATION_SPEED_MS',
      'MIN_SIMULATION_SPEED_MS',
      'MAX_SIMULATION_SPEED_MS',
      'SIMULATION_SPEED_STEP_MS',
      'MAX_HISTORY_LENGTH',
      'UI_TEXT',
    ];

    const allSucceeded = keysToSave.every(function saveKey(key) {
      return setConstant(key, draft[key], role);
    });

    setSaveMessage(allSucceeded ? 'Gespeichert.' : 'Keine Berechtigung.');
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
      </div>
    );
  }

  return (
    <div className="admin-settings">
      <p>Angemeldet als Admin.</p>

      <label htmlFor="admin-default-tile-size">Standard-Rastergröße</label>
      <input
        id="admin-default-tile-size"
        type="number"
        value={draft.DEFAULT_TILE_SIZE}
        onChange={function handleDefaultTileSize(e) { updateDraftField('DEFAULT_TILE_SIZE', Number(e.target.value)); }}
      />

      <label htmlFor="admin-tile-options">Rastergrößen-Optionen (kommagetrennt)</label>
      <input
        id="admin-tile-options"
        type="text"
        value={draft.TILE_SIZE_OPTIONS.join(', ')}
        onChange={function handleTileOptions(e) { updateDraftField('TILE_SIZE_OPTIONS', parseSizeList(e.target.value)); }}
      />

      <label htmlFor="admin-default-speed">Standard-Geschwindigkeit (ms)</label>
      <input
        id="admin-default-speed"
        type="number"
        value={draft.DEFAULT_SIMULATION_SPEED_MS}
        onChange={function handleDefaultSpeed(e) { updateDraftField('DEFAULT_SIMULATION_SPEED_MS', Number(e.target.value)); }}
      />

      <label htmlFor="admin-min-speed">Minimale Geschwindigkeit (ms)</label>
      <input
        id="admin-min-speed"
        type="number"
        value={draft.MIN_SIMULATION_SPEED_MS}
        onChange={function handleMinSpeed(e) { updateDraftField('MIN_SIMULATION_SPEED_MS', Number(e.target.value)); }}
      />

      <label htmlFor="admin-max-speed">Maximale Geschwindigkeit (ms)</label>
      <input
        id="admin-max-speed"
        type="number"
        value={draft.MAX_SIMULATION_SPEED_MS}
        onChange={function handleMaxSpeed(e) { updateDraftField('MAX_SIMULATION_SPEED_MS', Number(e.target.value)); }}
      />

      <label htmlFor="admin-speed-step">Geschwindigkeits-Schrittweite (ms)</label>
      <input
        id="admin-speed-step"
        type="number"
        value={draft.SIMULATION_SPEED_STEP_MS}
        onChange={function handleSpeedStep(e) { updateDraftField('SIMULATION_SPEED_STEP_MS', Number(e.target.value)); }}
      />

      <label htmlFor="admin-history-length">Maximale History-Länge</label>
      <input
        id="admin-history-length"
        type="number"
        value={draft.MAX_HISTORY_LENGTH}
        onChange={function handleHistoryLength(e) { updateDraftField('MAX_HISTORY_LENGTH', Number(e.target.value)); }}
      />

      <fieldset>
        <legend>Texte</legend>

        <label htmlFor="admin-text-title">Titel</label>
        <input
          id="admin-text-title"
          type="text"
          value={draft.UI_TEXT.appTitle}
          onChange={function handleTitle(e) { updateDraftUiText('appTitle', e.target.value); }}
        />

        <label htmlFor="admin-text-start">Start-Knopf</label>
        <input
          id="admin-text-start"
          type="text"
          value={draft.UI_TEXT.start}
          onChange={function handleStartLabel(e) { updateDraftUiText('start', e.target.value); }}
        />

        <label htmlFor="admin-text-stop">Stop-Knopf</label>
        <input
          id="admin-text-stop"
          type="text"
          value={draft.UI_TEXT.stop}
          onChange={function handleStopLabel(e) { updateDraftUiText('stop', e.target.value); }}
        />

        <label htmlFor="admin-text-reset">Reset-Knopf</label>
        <input
          id="admin-text-reset"
          type="text"
          value={draft.UI_TEXT.reset}
          onChange={function handleResetLabel(e) { updateDraftUiText('reset', e.target.value); }}
        />
      </fieldset>

      <button onClick={handleSaveAll}>Alle Änderungen speichern</button>
      <button onClick={logout}>Abmelden</button>
      {saveMessage && <p>{saveMessage}</p>}
    </div>
  );
}

export default AdminSettings;