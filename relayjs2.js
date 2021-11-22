const { Board } = require("./boardjs");

const TIMEOUT_EXEC_PROM = 5;

let wait = (t_ms) => {
  return new Promise(res => setTimeout(() => res(true), t_ms))
}

class RelayJs extends EventEmitter {
  constructor() {
    super();
    this.board = new Board();
    this.relays = [];

    this.__onError = this.__onError.bind(this)
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.autoConnect = this.autoConnect.bind(this);
    this.reset = this.reset.bind(this);
    this.write = this.write.bind(this);
    this.read = this.read.bind(this);
    
  }

  __onError(e){
    this.emit(e)
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

  get board() {
    return this.board;
  }

  get connected() {
    return this.board.connected;
  }

  get relays(){
    return this.relays;
  }

  async connect(port, options) {
    try {
      await this.board.connect(port, options)
      this.board.on("error", this.__onError)
    } catch (e) {
      throw e
    }
  }

  async autoConnect() {
    try {
      await this.board.autoConnect()
    } catch (e) {
      throw e
    }
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

  write(pin, value){

  }

  read(pin){

  }

}

module.exports = { RelayJs };
