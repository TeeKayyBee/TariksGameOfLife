/**
 * Full admin panel for constantsStore. Authentication state (role,
 * login, logout) is owned by the parent (App.jsx via useAuth) and
 * passed in as props, rather than held locally - this way the login
 * session survives the panel being closed and reopened, since
 * closing the panel only unmounts this component, not its parent's
 * auth state.
 *
 * Edits are held in local "draft" state and only written to the
 * store when "Alle Änderungen speichern" is clicked. All numeric
 * fields are kept as raw strings in the draft (not parsed numbers)
 * while editing, so a user can freely clear or retype a field
 * without it silently collapsing to 0 - parsing and validation only
 * happen at save time, and saving is all-or-nothing: if anything
 * fails validation, nothing is written to the store.
 */

import { useState } from 'react';
import { getAllConstants, setConstant } from '../store/constantsStore';
import { isPositiveInteger, isValidTileSize, isNonEmptyString } from '../helpers/validation';
import { MAX_TILE_SIZE } from '../constants';

/** Maps the UI_TEXT fields this form exposes to their display labels, used both for form labels and validation error messages. */
const UI_TEXT_FIELD_LABELS = {
  appTitle: 'Titel',
  start: 'Start-Knopf',
  stop: 'Stop-Knopf',
  reset: 'Reset-Knopf',
};

/**
 * Converts a comma-separated string like "10, 15, 20" into a clean
 * array of positive integers, e.g. [10, 15, 20]. Invalid entries
 * (non-numbers, zero, negatives, decimals) are silently dropped
 * rather than causing an error, since this runs on every keystroke
 * while typing - the result is only checked for emptiness at save time.
 * Exported so it can be unit tested independently of the component.
 * @param {string} text
 * @returns {number[]}
 */
export function parseSizeList(text) {
  return text
    .split(',')
    .map(function trimAndParse(part) {
      return Number(part.trim());
    })
    .filter(isPositiveInteger);
}

/**
 * Parses a raw form field into a positive integer using the shared
 * isPositiveInteger predicate, or null if the field is empty or the
 * parsed value fails that check. Returning null (rather than 0 or
 * NaN) lets the caller distinguish "invalid" from "a real value of
 * zero" and report a proper error instead of silently accepting a
 * broken setting.
 * @param {string} text
 * @returns {number | null}
 */
function parsePositiveInteger(text) {
  const trimmed = text.trim();
  if (trimmed === '') return null;
  const parsed = Number(trimmed);
  return isPositiveInteger(parsed) ? parsed : null;
}

/**
 * Builds the initial/reset draft state directly from the store's
 * current values. Numeric fields are converted to strings for
 * editing; TILE_SIZE_OPTIONS is joined into a display string.
 * @returns {object}
 */
function buildDraftFromStore() {
  const current = getAllConstants();
  return {
    DEFAULT_TILE_SIZE: String(current.DEFAULT_TILE_SIZE),
    TILE_SIZE_OPTIONS: current.TILE_SIZE_OPTIONS.join(', '),
    DEFAULT_SIMULATION_SPEED_MS: String(current.DEFAULT_SIMULATION_SPEED_MS),
    MIN_SIMULATION_SPEED_MS: String(current.MIN_SIMULATION_SPEED_MS),
    MAX_SIMULATION_SPEED_MS: String(current.MAX_SIMULATION_SPEED_MS),
    SIMULATION_SPEED_STEP_MS: String(current.SIMULATION_SPEED_STEP_MS),
    MAX_HISTORY_LENGTH: String(current.MAX_HISTORY_LENGTH),
    UI_TEXT: { ...current.UI_TEXT },
  };
}

/**
 * Validates a draft in full and, if valid, returns the parsed values
 * ready to be written to the store. Runs every check before
 * returning, so the caller sees every problem at once instead of
 * one at a time across repeated save attempts.
 * @param {object} draft
 * @returns {{ errors: string[], parsed: object }}
 */
function validateDraft(draft) {
  const errors = [];
  const parsed = {};

  const tileSizeOptions = parseSizeList(draft.TILE_SIZE_OPTIONS);
  const oversizedOptions = tileSizeOptions.filter(function isOversized(size) {
    return !isValidTileSize(size);
  });

  if (tileSizeOptions.length === 0) {
    errors.push('Rastergrößen-Optionen: mindestens eine gültige Zahl angeben.');
  } else if (oversizedOptions.length > 0) {
    errors.push(`Rastergrößen-Optionen: maximal ${MAX_TILE_SIZE} erlaubt (zu groß: ${oversizedOptions.join(', ')}).`);
  } else {
    parsed.TILE_SIZE_OPTIONS = tileSizeOptions;
  }

  const defaultTileSize = parsePositiveInteger(draft.DEFAULT_TILE_SIZE);
  if (defaultTileSize === null) {
    errors.push('Standard-Rastergröße: gültige positive Zahl erforderlich.');
  } else if (!isValidTileSize(defaultTileSize)) {
    errors.push(`Standard-Rastergröße: maximal ${MAX_TILE_SIZE} erlaubt.`);
  } else {
    parsed.DEFAULT_TILE_SIZE = defaultTileSize;
  }

  const minSpeed = parsePositiveInteger(draft.MIN_SIMULATION_SPEED_MS);
  const maxSpeed = parsePositiveInteger(draft.MAX_SIMULATION_SPEED_MS);
  const defaultSpeed = parsePositiveInteger(draft.DEFAULT_SIMULATION_SPEED_MS);
  const stepSpeed = parsePositiveInteger(draft.SIMULATION_SPEED_STEP_MS);
  const historyLength = parsePositiveInteger(draft.MAX_HISTORY_LENGTH);

  if (minSpeed === null) errors.push('Minimale Geschwindigkeit: gültige positive Zahl erforderlich.');
  if (maxSpeed === null) errors.push('Maximale Geschwindigkeit: gültige positive Zahl erforderlich.');
  if (defaultSpeed === null) errors.push('Standard-Geschwindigkeit: gültige positive Zahl erforderlich.');
  if (stepSpeed === null) errors.push('Geschwindigkeits-Schrittweite: gültige positive Zahl erforderlich.');
  if (historyLength === null) errors.push('Maximale History-Länge: gültige positive Zahl erforderlich.');

  if (minSpeed !== null && maxSpeed !== null) {
    if (minSpeed >= maxSpeed) {
      errors.push('Minimale Geschwindigkeit muss kleiner als die maximale sein.');
    } else {
      parsed.MIN_SIMULATION_SPEED_MS = minSpeed;
      parsed.MAX_SIMULATION_SPEED_MS = maxSpeed;

      if (defaultSpeed !== null && (defaultSpeed < minSpeed || defaultSpeed > maxSpeed)) {
        errors.push('Standard-Geschwindigkeit muss zwischen Minimum und Maximum liegen.');
      } else if (defaultSpeed !== null) {
        parsed.DEFAULT_SIMULATION_SPEED_MS = defaultSpeed;
      }
    }
  }

  if (stepSpeed !== null) parsed.SIMULATION_SPEED_STEP_MS = stepSpeed;
  if (historyLength !== null) parsed.MAX_HISTORY_LENGTH = historyLength;

 Object.keys(UI_TEXT_FIELD_LABELS).forEach(function checkUiTextField(field) {
    if (!isNonEmptyString(draft.UI_TEXT[field])) {
      errors.push(`${UI_TEXT_FIELD_LABELS[field]}: darf nicht leer sein.`);
    }
  });
  if (Object.keys(UI_TEXT_FIELD_LABELS).every(function fieldIsFilled(field) {
    return isNonEmptyString(draft.UI_TEXT[field]);
  })) {
    parsed.UI_TEXT = draft.UI_TEXT;
  }

  return { errors, parsed };
}

/**
 * @param {{
 *   role: 'guest' | 'admin',
 *   onLogin: (username: string, password: string) => boolean,
 *   onLogout: () => void
 * }} props
 */
function AdminSettings({ role, onLogin, onLogout }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [draft, setDraft] = useState(buildDraftFromStore);
  const [saveErrors, setSaveErrors] = useState([]);
  const [saveMessage, setSaveMessage] = useState('');

  function handleLoginSubmit(event) {
    event.preventDefault();
    const success = onLogin(username, password);
    setLoginError(!success);
    if (success) {
      setDraft(buildDraftFromStore());
    }
  }

  function updateDraftField(key, value) {
    setDraft(function mergeField(prevDraft) {
      return { ...prevDraft, [key]: value };
    });
  }

  function updateDraftUiText(field, value) {
    setDraft(function mergeUiText(prevDraft) {
      return { ...prevDraft, UI_TEXT: { ...prevDraft.UI_TEXT, [field]: value } };
    });
  }

  /**
   * Validates the entire draft first; only if everything passes does
   * it write anything to the store. This makes the save all-or-nothing:
   * either every field updates together, or none do.
   */
  function handleSaveAll() {
    const { errors, parsed } = validateDraft(draft);

    if (errors.length > 0) {
      setSaveErrors(errors);
      setSaveMessage('');
      return;
    }

    const keysToSave = Object.keys(parsed);
    const allSucceeded = keysToSave.every(function saveKey(key) {
      return setConstant(key, parsed[key], role);
    });

    setSaveErrors([]);
    if (allSucceeded) {
      setSaveMessage('Gespeichert.');
      setDraft(buildDraftFromStore());
    } else {
      setSaveMessage('Keine Berechtigung.');
    }
  }

  if (role !== 'admin') {
    return (
      <div className="admin-settings">
        <form onSubmit={handleLoginSubmit}>
          <label htmlFor="admin-username">Benutzername</label>
          <input
            id="admin-username"
            type="text"
            value={username}
            onChange={function handleUsernameChange(e) { setUsername(e.target.value); }}
          />
          <label htmlFor="admin-password">Passwort</label>
          <input
            id="admin-password"
            type="password"
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

      <label htmlFor="admin-default-tile-size">Standard-Rastergröße (max. {MAX_TILE_SIZE})</label>
      <input
        id="admin-default-tile-size"
        type="text"
        inputMode="numeric"
        value={draft.DEFAULT_TILE_SIZE}
        onChange={function handleDefaultTileSize(e) { updateDraftField('DEFAULT_TILE_SIZE', e.target.value); }}
      />

      <label htmlFor="admin-tile-options">Rastergrößen-Optionen (kommagetrennt, max. {MAX_TILE_SIZE})</label>
      <input
        id="admin-tile-options"
        type="text"
        value={draft.TILE_SIZE_OPTIONS}
        onChange={function handleTileOptions(e) { updateDraftField('TILE_SIZE_OPTIONS', e.target.value); }}
      />

      <label htmlFor="admin-default-speed">Standard-Geschwindigkeit (ms)</label>
      <input
        id="admin-default-speed"
        type="text"
        inputMode="numeric"
        value={draft.DEFAULT_SIMULATION_SPEED_MS}
        onChange={function handleDefaultSpeed(e) { updateDraftField('DEFAULT_SIMULATION_SPEED_MS', e.target.value); }}
      />

      <label htmlFor="admin-min-speed">Minimale Geschwindigkeit (ms)</label>
      <input
        id="admin-min-speed"
        type="text"
        inputMode="numeric"
        value={draft.MIN_SIMULATION_SPEED_MS}
        onChange={function handleMinSpeed(e) { updateDraftField('MIN_SIMULATION_SPEED_MS', e.target.value); }}
      />

      <label htmlFor="admin-max-speed">Maximale Geschwindigkeit (ms)</label>
      <input
        id="admin-max-speed"
        type="text"
        inputMode="numeric"
        value={draft.MAX_SIMULATION_SPEED_MS}
        onChange={function handleMaxSpeed(e) { updateDraftField('MAX_SIMULATION_SPEED_MS', e.target.value); }}
      />

      <label htmlFor="admin-speed-step">Geschwindigkeits-Schrittweite (ms)</label>
      <input
        id="admin-speed-step"
        type="text"
        inputMode="numeric"
        value={draft.SIMULATION_SPEED_STEP_MS}
        onChange={function handleSpeedStep(e) { updateDraftField('SIMULATION_SPEED_STEP_MS', e.target.value); }}
      />

      <label htmlFor="admin-history-length">Maximale History-Länge</label>
      <input
        id="admin-history-length"
        type="text"
        inputMode="numeric"
        value={draft.MAX_HISTORY_LENGTH}
        onChange={function handleHistoryLength(e) { updateDraftField('MAX_HISTORY_LENGTH', e.target.value); }}
      />

      <fieldset>
        <legend>Texte</legend>

        <label htmlFor="admin-text-title">{UI_TEXT_FIELD_LABELS.appTitle}</label>
        <input
          id="admin-text-title"
          type="text"
          value={draft.UI_TEXT.appTitle}
          onChange={function handleTitle(e) { updateDraftUiText('appTitle', e.target.value); }}
        />

        <label htmlFor="admin-text-start">{UI_TEXT_FIELD_LABELS.start}</label>
        <input
          id="admin-text-start"
          type="text"
          value={draft.UI_TEXT.start}
          onChange={function handleStartLabel(e) { updateDraftUiText('start', e.target.value); }}
        />

        <label htmlFor="admin-text-stop">{UI_TEXT_FIELD_LABELS.stop}</label>
        <input
          id="admin-text-stop"
          type="text"
          value={draft.UI_TEXT.stop}
          onChange={function handleStopLabel(e) { updateDraftUiText('stop', e.target.value); }}
        />

        <label htmlFor="admin-text-reset">{UI_TEXT_FIELD_LABELS.reset}</label>
        <input
          id="admin-text-reset"
          type="text"
          value={draft.UI_TEXT.reset}
          onChange={function handleResetLabel(e) { updateDraftUiText('reset', e.target.value); }}
        />
      </fieldset>

      {saveErrors.length > 0 && (
        <ul className="admin-settings-error">
          {saveErrors.map(function renderError(error, index) {
            return <li key={index}>{error}</li>;
          })}
        </ul>
      )}

      <button onClick={handleSaveAll}>Alle Änderungen speichern</button>
      <button onClick={onLogout}>Abmelden</button>
      {saveMessage && <p>{saveMessage}</p>}
    </div>
  );
}

export default AdminSettings;