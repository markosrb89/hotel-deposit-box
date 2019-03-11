import React from 'react';

/**
 * Stateless functional component responsible
 * for rendering control panel keypad.
 *
 * @param {Array} keypad Array of objects
 * @param {callback} handleClick
 */
const Keypad = ({ keypad, handleClick }) => {
  return (
    <div className='control-panel__keypad'>
      {keypad.map((item, index) => (
        <div
          key={index}
          onClick={handleClick(item)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default Keypad;