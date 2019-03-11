import Auth from '../services/auth';
import { updateStatusMessage, updateDoorState, validateMasterCode } from '../../redux/modules/deposit-box';

/**
 * This function is responsible for passcode validation
 * and based on that, appropriate action will be dispatched.
 *
 * Passcode rules: guestPasscode array should have 6 characters or 7 with lock button.
 * If lock button exists, it should be the last item in the array
 *
 * @param {Function} dispatch Dispatches an action
 * @param {Array} guestPasscode Array of values, e.g. [ 1, 2, 3, 0, 4, 6, "L" ]
 * @param {String} serialNumber
 * @param {String} doorState
 * @param {String} statusMessage
 */
export const validatePasscode = async (dispatch, guestPasscode, serialNumber, doorState, statusMessage) => {
  dispatch(updateStatusMessage('Validating'));
  const masterCode = checkMasterCode(guestPasscode);

  if (!validateLengthAndTypedCode(guestPasscode, masterCode)) {
    return dispatch(updateStatusMessage('Error'));
  }

  const depositBoxIsLocked = guestLockedDepositBox(guestPasscode);
  const passcode = depositBoxIsLocked ? guestPasscode.slice(0, guestPasscode.length - 1) : guestPasscode;
  const serviceModeEnabled = enableServiceMode(passcode);

  performValidation(
    passcode, depositBoxIsLocked,
    serviceModeEnabled, masterCode,
    doorState, serialNumber, statusMessage, dispatch);
};

// Utility functions
const authenticateGuest = passcode => {
  return Auth.authenticateGuest(passcode.join(''));
};

const isGuestAuthenticated = () => {
  return Auth.isGuestAuthenticated();
};

const getPasscode = () => {
  return Auth.getPasscode();
};

const setDepositBoxState = (doorState, statusMessage) => {
  return Auth.setDepositBoxState(doorState, statusMessage);
};

export const getDepositBoxState = () => {
  return Auth.getDepositBoxState();
};

/**
 * In this function is decided should deposit box
 * be unlocked/locked, should control panel be in the service mode
 * or perform unlocking with super secret master code.
 *
 * @param {Array} passcode
 * @param {Boolean} depositBoxIsLocked
 * @param {Boolean} serviceModeEnabled
 * @param {Boolean} masterCode
 * @param {String} doorState
 * @param {String} serialNumber
 * @param {String} statusMessage
 * @param {Function} dispatch
 */
const performValidation = (
  passcode, depositBoxIsLocked,
  serviceModeEnabled, masterCode,
  doorState, serialNumber, statusMessage, dispatch
) => {

  if (isGuestAuthenticated() && (getPasscode() === passcode.join('')) && !depositBoxIsLocked && doorState === 'Locked') {
    unlockSafeDepositBox('Unlocking', 'Unlocked', 'Ready', dispatch);
  } else if (isGuestAuthenticated() && !(getPasscode() === passcode.join('')) && !serviceModeEnabled && !masterCode) {
    dispatch(updateStatusMessage('Error'));
  } else {
    if (serviceModeEnabled && !masterCode && doorState === 'Locked') {
      dispatch(updateStatusMessage('Service'));
    } else if (!serviceModeEnabled && masterCode && doorState === 'Locked' && statusMessage === 'Service') {
      dispatch(validateMasterCode(passcode, serialNumber));
    } else {
      if (depositBoxIsLocked && doorState !== 'Locked' && !masterCode) {
        lockSafeDepositBox(passcode, 'Locking', 'Locked', dispatch);
      } else {
        dispatch(updateStatusMessage('Error'));
      }
    }
  }
};

/**
 * This function checks if entered values meets the
 * requirements for master code.
 * @param {Array} passcode
 * @returns {Boolean}
 */
const checkMasterCode = passcode => {
  const hasDuplicates = (new Set(passcode)).size !== passcode.length;
  return !hasDuplicates && passcode.length === 12 ? true : false;
};

/**
 * This function checks if entered values meets the
 * requirements to enable service mode.
 * @param {Array} passcode
 * @returns {Boolean}
 */
const enableServiceMode = passcode => {
  if (passcode.length === 6) {
    return passcode.every(item => item === passcode[0] && item === 0);
  } else {
    return false;
  }
};

/**
 * This function checks if door is locked.
 * @param {Array} passcode
 * @returns {Boolean}
 */
const guestLockedDepositBox = passcode => {
  const lastValue = passcode[passcode.length - 1];
  return lastValue === 'L' ? true : false;
};

/**
 * This function is responsible to check
 * the length of the passcode and to make sure
 * lock button 'L' is pressed in the right order.
 * @param {Array} passcode
 * @param {Boolean} masterCode
 * @returns {Boolean}
 */
const validateLengthAndTypedCode = (passcode, masterCode) => {
  const allowedPasscodeLength = masterCode ? 12 : passcode.includes('L') ? 7 : 6;
  if (passcode.length === allowedPasscodeLength) {
    if (passcode.includes('L') && passcode[passcode.length - 1] === 'L') {
      return true;
    } else if (passcode.includes('L') && !(passcode[passcode.length - 1] === 'L') && !masterCode) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};

/**
 * This function is responsible to save guest's passcode
 * and state to local storage and dispatch the action to lock deposit box.
 * @param {String} passcode
 * @param {String} statusMessage
 * @param {String} doorState
 * @param {Function} dispatch
 */
const lockSafeDepositBox = (passcode, statusMessage, doorState, dispatch) => {
  authenticateGuest(passcode);
  setDepositBoxState('Locked', '');
  dispatch(updateStatusMessage(statusMessage));
  setTimeout(() => {
    dispatch(updateDoorState(doorState));
    dispatch(updateStatusMessage(''));
  }, 3000);
};

/**
 * @param {String} statusMessage
 * @param {String} doorState
 * @param {String} readyStatusMessage
 * @param {Function} dispatch
 */
const unlockSafeDepositBox = (statusMessage, doorState, readyStatusMessage, dispatch) => {
  setDepositBoxState('Unlocked', 'Ready');
  dispatch(updateStatusMessage(statusMessage));
  setTimeout(() => {
    dispatch(updateDoorState(doorState));
    dispatch(updateStatusMessage(readyStatusMessage));
  }, 3000);
};