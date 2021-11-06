const EventEmitter = require('events');

const types = ['RelayJ5']
const defaultType = types[0];

const relaysFamily = [1, 2, 4, 8, 16];
const ARDUINO_NANO_MAX_PIN = 19;
const ON = 1;
const OFF = 0;

class RelayJs extends EventEmitter{
  constructor (relayCount = undefined) {

    if (relayCount === undefined) {
      throw('specifies the number of relay: [1, 2, 4, 8, 16]')
    }
    if (isNaN(relayCount)) {
      throw('relayCount must be a number in range: [1, 2, 4, 8, 16]')
    }
    if (!relaysFamily.some(el => el === relayCount)) {
      throw('relayCount must be a number in range: [1, 2, 4, 8, 16]')
    }

    super();

    this.__relayHw = undefined;
    this.__port = undefined;
    this.__relayCount = relayCount;

    if (defaultType === 'RelayJ5') {
        const {RelayHw} = require('./relayhw-j5');
        this.__relayHw = new RelayHw(ARDUINO_NANO_MAX_PIN)
    }
    
    this.__relayHw.on("error", (e) => {
        this.emit("error", e)
    })
  }

  static getRelaysFamily(){
    return relaysFamily;
  }

  get port(){
    return this.__port;
  }
  get relayCount(){
    return this.__relayCount;
  }

  async connect(options = undefined) {
    await this.__relayHw.connect(options);
    this.__port = this.__relayHw.__port;
  }

  set(n = undefined, value = undefined) {

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
      this.__relayHw.set(n, value);
    } catch (e) {
      throw(e)
    }
  }

  setMulti(relays = []){
    if (relays === undefined || relays.length === 0 ) {
      throw(new Error('relaysValue shall be an array of value, eg [0, 1, 0, 1, 1]'));
    }
    if (relays.length > this.__relayCount){
      throw(new Error(`You can set maximum ${this.__relayCount} relay`));ì
    }
    for (let i = 0; i < relays.length; i++) {
      try {
        this.set(i, relays[i])
      } catch (e) {
        throw(new Error(`Relay ${i}: ${e.message}`))
      }
    }
  }
}

module.exports = {RelayJs, ON, OFF}


