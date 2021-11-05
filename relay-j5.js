const five = require("johnny-five");
const EventEmitter = require('events');

const relays = [1, 2, 4, 8, 16];
const ARDUINO_NANO_MAX_PIN = 19;
const ON = 1;
const OFF = 0;

class RelayJ5 extends EventEmitter{
  constructor (relayCount = undefined) {
    super();
    this.__relayCount = relayCount;
    this.__fiveboard = undefined;
    this.__isConnected = undefined;
    this.__port = undefined;
    this.connect = this.connect.bind(this);
    this.setRelay = this.setRelay.bind(this);
  }

  get relayCount(){
    return this.__relayCount;
  }
  get isConnected(){
    return this.__isConnected;
  }
  get port(){
    return this.__port;
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
          this.__isConnected = false;
        })
        this.__fiveboard.on("ready", () => {
          for (let i = 0; i < ARDUINO_NANO_MAX_PIN; i++) {
            this.__fiveboard.pinMode(i, five.Pin.OUTPUT);
          }
          this.__port = this.__fiveboard.port;
          this.__isConnected = true;
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

  setRelay(n = undefined, value = undefined) {
    try {
      this.__fiveboard.digitalWrite(n, value)
    } catch (e) {
      throw(e)
    }
  }
}

module.exports = {RelayJ5, ON, OFF}


