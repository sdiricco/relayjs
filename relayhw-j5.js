const five = require("johnny-five");
const EventEmitter = require('events');

const TIMEOUT_CONNECT_MS = 2000;
const ARDUINO_NANO_MAX_PIN = 19;

const OUT = five.Pin.OUTPUT;
const OFF = 0;
const ON = 1;

class RelayHw extends EventEmitter{
  constructor (relayCount = undefined) {
    super();
    this.__relayCount = relayCount;
    this.__fiveboard = undefined;
    this.__isConnected = undefined;
    this.__port = undefined;
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
            timeout: TIMEOUT_CONNECT_MS,
          }
        }
        else{
          __options = options
        }

        //try to auto-connect
        try {
          this.__fiveboard = new five.Board(__options);
        } catch (e) {
          rej(false)
        }

        //Event "fail", failed to connect.
        //Typically when you try to open a connection to a board but it is
        //not connected to the usb port or when the board does not have
        //the correct firmware
        this.__fiveboard.on("fail", (e) => {
          this.emit("error", {
            type: "CONNECTION_FAILED",
            message: `Connection Failed. Check the hardware configuration`,
            details: e.message
          })
          rej(false)
        })

        //Event "error", failed to connect.
        //Typically when you try to open a connection when the board is already
        //connected. This could happen when you use multiple software instances
        this.__fiveboard.on("error", (e) => {
          this.emit("error", {
            type: "PERMISSION_DENIED",
            message: `Board already connected on ${this.__fiveboard.port}`,
            details: e.message
          })
          rej(false)
        })

        //Event "close", board disconnected.
        //Typically when the board is disconnected from the USB port
        this.__fiveboard.on("close", () => {
          this.emit("error", {
            type: "CLOSE_CONNECTION",
            message: "Board disconnected",
            details: ""
          })
          this.__isConnected = false;
        })

        this.__fiveboard.on("exit", () => {
          this.__deinitializeHw();
          this.__isConnected = false;
        })

        //Event "ready", board successfully connected and ready to receive commands
        this.__fiveboard.on("ready", () => {
          this.__initializeHw(ARDUINO_NANO_MAX_PIN);
          this.__port = this.__fiveboard.port;
          this.__isConnected = true;
          res(true);
        })
      }else{
        //board already connected to this software instance.
        //Typically when you call multiple times connect() method
        res(true);
      }
    })
  }

  __initializeHw(pins = ARDUINO_NANO_MAX_PIN){
    for (let i = 0; i < pins; i++) {
      this.__fiveboard.pinMode(i, OUT);
      this.__fiveboard.digitalWrite(i, OFF)
    }
  }

  __deinitializeHw(pins = ARDUINO_NANO_MAX_PIN){
    for (let i = 0; i < pins; i++) {
      this.__fiveboard.digitalWrite(i, OFF)
    }
  }

  set(n = undefined, value = undefined) {
    try {
      this.__fiveboard.digitalWrite(n, value)
    } catch (e) {
      throw(e)
    }
  }

  get(n = undefined){
    let value = undefined;
    try {
      value = this.__fiveboard.digitalRead(n)
    } catch (e) {
      throw(e)
    }
    return value;
  }
}

module.exports = {RelayHw}

