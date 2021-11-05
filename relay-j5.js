const five = require("johnny-five");
const EventEmitter = require('events');

const ARDUINO_NANO_MAX_PIN = 19;
const ON = 1;
const OFF = 0;

class RelayJ5 extends EventEmitter{
  constructor () {
    super();
    this.__fiveboard = undefined;
    this.__connected = undefined;
    this.__port = undefined;
    this.connect = this.connect.bind(this);
    this.setRelay = this.setRelay.bind(this);
  }
  async connect(options = undefined) {
    return new Promise((res, rej) => {
      if (this.__fiveboard === undefined) {
        let __options = undefined;
        if (options === undefined) {
          __options = {
            repl: false,
            debug: false,
          }
        }
        else{
          __options = options
        }
        try {
          this.__fiveboard = new five.Board(__options);
        } catch (e) {
          rej(false)
        }
        this,this.__fiveboard.on("fail", (e) => {
          this.emit("error", {
            type: "CONNECTION_FAILED",
            message: `Connection Failed. Check the hardware configuration`,
            details: e.message
          })
          rej(false)
        })
        this.__fiveboard.on("error", (e) => {
          this.emit("error", {
            type: "PERMISSION_DENIED",
            message: `Board already connected on ${this.__fiveboard.port}`,
            details: e.message
          })
          rej(false)
        })
        this.__fiveboard.on("close", () => {
          this.emit("error", {
            type: "CLOSE_CONNECTION",
            message: "Board disconnected",
            details: ""
          })
        })
        this.__fiveboard.on("ready", () => {
          for (let i = 0; i < ARDUINO_NANO_MAX_PIN; i++) {
            this.__fiveboard.pinMode(i, five.Pin.OUTPUT);
          }
          this.__port = this.__fiveboard.port;
          this.__connected = true;
          res(true);
        })
      }else{
        if (this.__fiveboard && this.__fiveboard.port) {
          this.emit("error", {
            type: "PERMISSION_DENIED",
            message: `Board already connected on ${port}`,
            details: ""
          })
          rej(false)
        }else{
          this.emit("error", {
            type: "UNKNOWN",
            message: `something wrong during connection`,
            details: ""
          })
          rej(false)
        }
      }
    })
  }

  disconnect(){
    delete this.__fiveboard;
  }

  setRelay(n = undefined, value = undefined) {
    if (!this.__connected) {
      throw(new Error('Connect the board before'));
    }
    if (n === undefined) {
      throw(new Error('n cannot be undefined'));
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
      throw(new Error('n must be in range [0 - 1]'));
    }
    this.__fiveboard.digitalWrite(n, value)
  }
}

module.exports = {RelayJ5, ON, OFF}


