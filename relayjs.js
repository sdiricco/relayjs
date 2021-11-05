const EventEmitter = require('events');
const defaultType = 'RelayJ5'

const ARDUINO_NANO_MAX_PIN = 19;

class RelayJS extends EventEmitter{
  constructor (options = {}) {
    super();

    let type = options.type ? options.type : defaultType;
    let relays = options.relays ? options.relays : ARDUINO_NANO_MAX_PIN;

    this.__relay = undefined;
    this.__port = undefined;
    this.__relays = relays;

    if (type === 'RelayJ5') {
        const {RelayJ5} = require('./relay-j5');
        this.__relay = new RelayJ5(ARDUINO_NANO_MAX_PIN)
    }else{
        throw(`type ${type} not valid`)
    }
    
    this.__relay.on("error", (e) => {
        this.emit("error", e)
    })
  }
  async connect(options = undefined) {
    await this.__relay.connect(options);
    this.__port = this.__relay.__port;
  }

  async setRelay(n = undefined, value = undefined) {
      await this.__relay.setRelay(n, value);
  }
}

module.exports = {RelayJS}


