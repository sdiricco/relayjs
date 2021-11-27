const { Board } = require("@sdiricco/boardjs");
const { EventEmitter } = require('events')

const NC = 'NC';
const NO = 'NO';

class RelayJs extends EventEmitter {
  constructor() {
    super();
    this.board = new Board();

    this.__relaysT = [];

    this.__initializePins = this.__initializeRelays.bind(this); 

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.reset = this.reset.bind(this);
    this.write = this.write.bind(this);

    this.board.on("error", (e)=>{
      this.emit('error', e)
    });

  }

  async __initializeRelays(){
    this.board.pins.forEach((el)=>{
      this.__relaysT.push('NO')
    })
  }

  get CLOSE() {
    return this.board.HIGH;
  }

  get OPEN() {
    return this.board.LOW;
  }

  get port() {
    return this.board.port;
  }

  get connected() {
    return this.board.connected;
  }

  get relays(){
    return this.board.pins.map((pin, idx) => {
      const pinOn = Boolean(pin.value);
      const relayT = this.__relaysT[idx];
      const relayClose = relayT === NO ? pinOn: !pinOn;
      const relayValue = relayClose ? this.CLOSE : this.OPEN;
      return {
        type: relayT,
        state: relayValue
      }
    });
  }

  async connect({ port = undefined, options = undefined } = {}) {
    try {
      await this.board.connect(port, options)
      await this.board.reset();
      await this.__initializeRelays();
    } catch (e) {
      throw e;
    }
    return true;
  }

  async disconnect() {
    try {
      this.board.off("error", this.__onError)
      await this.board.disconnect()
    } catch (e) {
      throw e
    }
  }

  async reset() {
    try {
      await this.board.reset()
    } catch (e) {
      throw e
    }
  }

  async write(pin, value){
    try {
      await this.board.digitalWrite(pin, value);
    } catch (e) {
      throw (e)
    }
  }

  read(pin){
    if (!this.board || !this.connected) {
      throw ('write() failed. Missing connection')
    }
    return this.board.pins[pin].value;
  }

}

module.exports = { RelayJs };
