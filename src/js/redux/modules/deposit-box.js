import { validateSecretPasscode } from '../../libs/services/api';

// Actions
const UPDATE_DOOR_STATE = 'UPDATE_DOOR_STATE';
const UPDATE_STATUS_MESSAGE = 'UPDATE_STATUS_MESSAGE';
const SET_BACK_LIGHT = 'BACK_LIGHT_TOGGLE';
const SERIAL_NUMBERS_MATCHED = 'SERIAL_NUMBERS_MATCHED';

// Reducer
const initialState = {
  backlightOff: true,
  statusMessage: undefined,
  doorState: undefined,
  serialNumber: '4815162342',
  serialNumbersMatched: false
};

export default function depositBox(state = initialState, action = {}) {
  switch (action.type) {
  case SET_BACK_LIGHT:
    return {
      ...state,
      backlightOff: action.backlightOff
    };
  case UPDATE_STATUS_MESSAGE:
    return {
      ...state,
      statusMessage: action.message
    };
  case UPDATE_DOOR_STATE:
    return {
      ...state,
      doorState: action.message
    };
  case SERIAL_NUMBERS_MATCHED:
    return {
      ...state,
      serialNumbersMatched: action.serialNumbersMatched
    };
  default:
    return state;
  }
}

// Action creators
export const setBackLightOff = backlightOff => {
  return {
    type: SET_BACK_LIGHT,
    backlightOff
  };
};

export const validateMasterCode = (passcode, serialNumber) => dispatch => {
  return validateSecretPasscode(passcode.join(''))
    .then(data => {
      dispatch(updateStatusMessage('Validating'));
      if (data.sn === parseInt(serialNumber, 10)) {
        dispatch(updateStatusMessage('Unlocking'));
        dispatch(updateDoorState('Unlocked'));
        dispatch(updateStatusMessage('Ready'));
        dispatch(serialNumbersMatched(true));
      } else {
        dispatch(updateStatusMessage('Error'));
      }
    })
    .catch(() => dispatch(updateStatusMessage('Error')));
};

const serialNumbersMatched = serialNumbersMatched => {
  return {
    type: SERIAL_NUMBERS_MATCHED,
    serialNumbersMatched
  };
};

export const updateStatusMessage = message => {
  return {
    type: UPDATE_STATUS_MESSAGE,
    message
  };
};

export const updateDoorState = message => {
  return {
    type: UPDATE_DOOR_STATE,
    message
  };
};