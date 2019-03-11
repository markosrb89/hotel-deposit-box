import React from 'react';

import Screen from './screen';
import Keypad from './keypad';

/**
 * Stateless functional component responsible
 * for rendering control panel.
 *
 * @param {Boolean} backlightOff
 * @param {callback} handleClick
 * @param {String} serialNumber
 * @param {Array} keypad
 * @param {String} statusMessage
 * @param {String} doorState
 * @param {Boolean} serialNumbersMatched
 */
const ControlPanel = ({
  backlightOff, handleClick,
  serialNumber, keypad, statusMessage,
  doorState, serialNumbersMatched }) => (
  <section className='control-panel'>
    <Screen
      backlightOff={backlightOff}
      statusMessage={statusMessage}
      doorState={doorState}
    />
    <Keypad
      keypad={keypad}
      handleClick={handleClick}
    />
    {serialNumbersMatched ? (<div className='control-panel__serial-number'>{`S/N: ${serialNumber}`}</div>) : null}
  </section>
);

export default ControlPanel;