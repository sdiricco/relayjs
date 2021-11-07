const EventEmitter = require('events');
const { resolve } = require('path');

const types = ['RelayJ5']
const defaultType = types[0];

const relaysFamily = [1, 2, 4, 8, 16];
const ARDUINO_NANO_MAX_PIN = 19;
const ON = 1;
const OFF = 0;

/**
 * 
 * Class RelaysJs.
 * @extends EventEmitter
 */
class RelayJs extends EventEmitter{
  /**
   * 
   * @param {Number} relayCount - The number of relay board. 
   */
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
        this.__relayHw = new RelayHw({relayCount: ARDUINO_NANO_MAX_PIN})
    }
    
    this.__relayHw.on("error", (e) => {
        this.emit("error", e)
    })

  }

  /**
   * 
   * @returns {Number[]} The relay board type supported
   */
  static getRelaysFamily(){
    return relaysFamily;
  }

  /**
   * 
   * @returns {String} The port connected to the relay board
   */
  get port(){
    return this.__port;
  }

  /**
   * 
   * @returns {String} The port connected to the relay board
   */
  get relayCount(){
    return this.__relayCount;
  }


  async connect(options = undefined) {
    await this.__relayHw.connect(options);
    this.__port = this.__relayHw.__port;
  }

  async set(n = undefined, value = undefined) {

    if (!this.__relayHw.isConnected) {
      throw(new Error('Connect the board before'));
    }
    if (n === undefined) {
      throw(new Error('relayNumber cannot be undefined'));
    }
    if (isNaN(n)) {
      throw(new Error('n must be Number type'));
    }
    if (n < 0 || n > ARDUINO_NANO_MAX_PIN) {
      throw(new Error(`n must be in range [${0} - ${ARDUINO_NANO_MAX_PIN}]`));
    }

    if (value === undefined) {
      throw(new Error('value cannot be undefined'));
    }
    if (isNaN(value)) {
      throw(new Error('value must be Number type'));
    }
    if (value < 0 || value > 1) {
      throw(new Error('value must be in range [0 - 1]'));
    }

    try {
      await this.__relayHw.set(n, value);
    } catch (e) {
      throw(e)
    }
  }

  async get(n = undefined){

    let value = undefined;

    if (!this.__relayHw.isConnected) {
      throw(new Error('Connect the board before'));
    }
    if (n === undefined) {
      throw(new Error('relayNumber cannot be undefined'));
    }
    if (isNaN(n)) {
      throw(new Error('n must be Number type'));
    }
    if (n < 0 || n > ARDUINO_NANO_MAX_PIN) {
      throw(new Error(`n must be in range [${0} - ${ARDUINO_NANO_MAX_PIN}]`));
    }

    try {
      value = await this.__relayHw.get(n);
    } catch (e) {
      throw(e)
    }

    return value;
  }

  async setMulti(relays = []){
    if (relays === undefined || relays.length === 0 ) {
      throw(new Error('relaysValue shall be an array of value, eg [0, 1, 0, 1, 1]'));
    }
    if (relays.length > this.__relayCount){
      throw(new Error(`You can set maximum ${this.__relayCount} relay`));ì
    }
    for (let i = 0; i < relays.length; i++) {
      try {
        await this.set(i, relays[i])
      } catch (e) {
        throw(new Error(`Relay ${i}: ${e.message}`))
      }
    }
  }

  async getAll(){
    let relays = [];
    for (let i = 0; i < this.__relayCount; i++) {
      try {
        const value = await this.get(i)
        relays.push(value)
      } catch (e) {
        throw(new Error(`Relay ${i}: ${e.message}`))
      }
    }
    return relays;
  }
}

module.exports = {RelayJs, ON, OFF}


