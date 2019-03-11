class Auth {

  /**
   * Authenticate guest.
   * Save the passcode in Local Storage
   * @param {String} token
   */
  static authenticateGuest(passcode) {
    localStorage.setItem('Passcode', passcode);
  }

  /**
   * Check if the passcode is saved in Local Storage
   * @returns {Boolean}
   */
  static isGuestAuthenticated() {
    return localStorage.getItem('Passcode') !== null;
  }

  /**
   * Get the passcode value.
   * @returns {String}
   */
  static getPasscode() {
    return localStorage.getItem('Passcode');
  }

  /**
   * Stores the deposit box state and status message.
   * @param {String} state
   * @param {String} message
   */
  static setDepositBoxState(state, message) {
    localStorage.setItem('statusMessage', message);
    localStorage.setItem('doorState', state);
  }

  /**
   * Get the deposit box state and status message.
   * @returns {Object}
   */
  static getDepositBoxState() {
    const doorState = localStorage.getItem('doorState');
    const statusMessage = localStorage.getItem('statusMessage');
    return { doorState, statusMessage };
  }
}

export default Auth;