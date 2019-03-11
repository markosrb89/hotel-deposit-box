import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ControlPanel from './control-panel';
import Container from './common/container';
import { validatePasscode, getDepositBoxState } from '../libs/resources/guest';
import { setBackLightOff, updateDoorState, updateStatusMessage } from '../redux/modules/deposit-box';

const KEYPAD = [
  { label: 7 },
  { label: 8 },
  { label: 9 },
  { label: 4 },
  { label: 5 },
  { label: 6 },
  { label: 1 },
  { label: 2 },
  { label: 3 },
  { label: '*' },
  { label: 0 },
  { label: 'L' }
];

class App extends Component {

  state = {
    passcode: [],
    typingTimeout: 0,
    backlightOffTiming: 0
  };

  static propTypes = {
    depositBox: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const depositBoxState = getDepositBoxState();
    const doorState = depositBoxState.doorState ? depositBoxState.doorState : 'Unlocked';
    const statusMessage = depositBoxState.doorState === 'Unlocked' || !depositBoxState.doorState ? 'Ready' : '';
    dispatch(updateDoorState(doorState));
    dispatch(updateStatusMessage(statusMessage));
  }

  handleClick = button => () => {
    const { dispatch, depositBox } = this.props;
    const { passcode, backlightOffTiming, typingTimeout } = this.state;
    const { serialNumber, doorState, statusMessage } = depositBox;
    dispatch(setBackLightOff(false));

    if (typingTimeout) clearTimeout(typingTimeout);
    if (backlightOffTiming) clearTimeout(backlightOffTiming);

    this.setState({
      backlightOffTiming: setTimeout(() => {
        dispatch(setBackLightOff(true));
      }, 5000),
      passcode: [...passcode, button.label],
      typingTimeout: setTimeout(() => {
        return validatePasscode(dispatch, this.state.passcode, serialNumber, doorState, statusMessage)
          .then(() => this.setState({ passcode: [] }));
      }, 1000)
    });
  }

  render() {
    const { depositBox } = this.props;
    const {
      statusMessage, doorState,
      serialNumber, backlightOff,
      serialNumbersMatched
    } = depositBox;
    return (
      <Container>
        <ControlPanel
          keypad={KEYPAD}
          doorState={doorState}
          backlightOff={backlightOff}
          serialNumber={serialNumber}
          serialNumbersMatched={serialNumbersMatched}
          statusMessage={statusMessage}
          handleClick={this.handleClick}
        />
      </Container>
    );
  }
}


const mapStateToProps = state => ({
  depositBox: state.depositBox
});

export default connect(mapStateToProps)(App);