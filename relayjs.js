const EventEmitter = require('events');

const types = ['RelayJ5']
const defaultType = types[0];

const relays = [1, 2, 4, 8, 16];
const ARDUINO_NANO_MAX_PIN = 19;
const ON = 1;
const OFF = 0;

class RelayJS extends EventEmitter{
  constructor (relayCount = undefined) {
    if (relayCount === undefined) {
      throw('specifies the number of relay: [1, 2, 4, 8, 16]')
    }
    if (isNaN(relayCount)) {
      throw('relayCount must be a number in range: [1, 2, 4, 8, 16]')
    }
    if (!relays.some(el => el === relayCount)) {
      throw('relayCount must be a number in range: [1, 2, 4, 8, 16]')
    }
    super();
    this.__relayHw = undefined;
    this.__port = undefined;
    this.__relays = relays;

    if (defaultType === 'RelayJ5') {
        const {RelayJ5} = require('./relay-j5');
        this.__relayHw = new RelayJ5(ARDUINO_NANO_MAX_PIN)
    }
    
    this.__relayHw.on("error", (e) => {
        this.emit("error", e)
    })
  }
  async connect(options = undefined) {
    await this.__relayHw.connect(options);
    this.__port = this.__relayHw.__port;
  }

  setRelay(n = undefined, value = undefined) {
    if (!this.__relayHw.isConnected) {
      throw(new Error('Connect the board before'));
    }
    if (n === undefined) {
      throw(new Error('relayNumber cannot be undefined'));
    }
    if (value === undefined) {
      throw(new Error('value cannot be undefined'));
    }
    if (isNaN(n)) {
      throw(new Error('n must be Number type'));
    }
    if (n < 0 || n > ARDUINO_NANO_MAX_PIN) {
      throw(new Error(`n must be in range [${0} - ${ARDUINO_NANO_MAX_PIN}]`));
    }
    if (isNaN(value)) {
      throw(new Error('value must be Number type'));
    }
    if (value < 0 || value > 1) {
      throw(new Error('value must be in range [0 - 1]'));
    }
    try {
      this.__relayHw.setRelay(n, value);
    } catch (e) {
      throw(e)
    }
  }
}

module.exports = {RelayJS}


