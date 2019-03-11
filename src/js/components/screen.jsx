import React from 'react';

/**
 * Stateless functional component responsible
 * for rendering control panel screen.
 *
 * @param {Boolean} backlightOff
 * @param {String} doorState
 * @param {String} statusMessage
 */
const Screen = ({ backlightOff, doorState, statusMessage }) => {
  return (
    <div className={`control-panel__screen ${backlightOff ? 'control-panel__screen--backlight-off' : ''}`}>
      <div className='control-panel__screen__door-state'>{doorState}</div>
      <div className='control-panel__screen__status-message'>{statusMessage}</div>
    </div>
  );
};

export default Screen;