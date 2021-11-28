const { Board } = require("@sdiricco/boardjs");
const { EventEmitter } = require("events");

const NC = "NC";
const NO = "NO";

const ARDUINO_NANO_BOARD = "ARDUINO_NANO_BOARD";
const boardSupported = [
  {
    model: ARDUINO_NANO_BOARD,
    pinCount: 22,
    pinMapping: {
      0: 2,
      1: 3,
      2: 4,
      3: 5,
      4: 6,
      5: 7,
      6: 8,
      7: 9,
      8: 10,
      9: 11,
      10: 12,
      11: 13,
      12: 14,
      13: 15,
      14: 16,
      15: 17,
    },
  },
];

const MAX_SIZE = 64;
const MIN_SIZE = 1;

class RelayJs extends EventEmitter {
  constructor({size = undefined, inverseOut = false} = {}) {
    super();
    this.board = new Board();

    //error check on size
    if (size) {
      if (typeof size !== "number") {
        throw new Error("size must be type of number");
      } else {
        if (size < MIN_SIZE || size > MAX_SIZE) {
          throw new Error(`size must be in range [${MIN_SIZE} - ${MAX_SIZE}]`);
        } else {
          this.size = Math.floor(size);
        }
      }
    } else {
      this.size = MAX_SIZE;
    }

    if (inverseOut && typeof inverseOut !== 'boolean') {
      throw new Error("inverseOut must be type of boolean");
    }
    else {
      this.inverseOut = inverseOut;
    }

    this.__relaysT = [];
    this.__cboard = undefined;

    this.__findBoardConnected = this.__findBoardConnected.bind(this);
    this.__initializePins = this.__initializeRelays.bind(this);

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.reset = this.reset.bind(this);
    this.write = this.write.bind(this);

    this.board.on("error", (e) => {
      this.emit("error", e);
    });
  }

  __findBoardConnected() {
    const boardConnected = boardSupported.find(
      (board) => board.pinCount === this.board.pins.length
    );
    if (!boardConnected) {
      throw new Error(`The board connected is not support by RelayJs library`);
    }
    this.__cboard = boardConnected;
  }

  async __initializeRelays() {
    this.__relaysT = Object.keys(this.__cboard.pinMapping).map(() => {
      return "NO";
    });
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

  get relays() {
    let relays = [];
    let idx = 0;
    for (const key in this.__cboard.pinMapping) {
      const pin = this.__cboard.pinMapping[key];
      const brdValue = this.board.pins[pin].value;
      const rlyValue = this.inverseOut ? Number(!Boolean(brdValue)) : brdValue
      relays.push({
        type: this.__relaysT[idx],
        state: rlyValue,
      });
      idx += 1;
    }
    return relays;
  }

  async connect({ port = undefined, options = undefined } = {}) {
    try {
      await this.board.connect(port, options);
      await this.__findBoardConnected();
      await this.__initializeRelays();
      await this.reset();
    } catch (e) {
      throw e;
    }
    return true;
  }

  async disconnect() {
    try {
      this.board.off("error", this.__onError);
      await this.board.disconnect();
    } catch (e) {
      throw e;
    }
  }

  async reset() {
    try {
      await this.board.execProm(() => {
        for (const key in this.__cboard.pinMapping) {
          this.board.firmata.pinMode(
            this.__cboard.pinMapping[key],
            this.board.MODES.OUTPUT
          );
          const value = this.inverseOut ? this.board.HIGH : this.board.LOW
          this.board.firmata.digitalWrite(
            this.__cboard.pinMapping[key],
            value
          );
        }
      });
    } catch (e) {
      throw e;
    }
  }

  async write(pin, value) {
    try {
      if (
        !this.__cboard.pinMapping.hasOwnProperty.call(
          this.__cboard.pinMapping,
          pin
        )
      ) {
        throw new Error("write() failed. Invalid pin");
      }
      const __pin = this.__cboard.pinMapping[pin];
      const __value = this.inverseOut ? Number(!Boolean(value)): value;
      await this.board.digitalWrite(__pin, __value);
    } catch (e) {
      throw new Error(e);
    }
  }

  read(pin) {
    if (
      !this.__cboard.pinMapping.hasOwnProperty.call(
        this.__cboard.pinMapping,
        pin
      )
    ) {
      throw new Error("write() failed. Invalid pin");
    }
    if (!this.board || !this.connected) {
      throw "write() failed. Missing connection";
    }
    const __pin = this.__cboard.pinMapping[pin];
    const brdValue = this.board.pins[__pin].value;
    const rlyValue = this.inverseOut ? Number(!Boolean(brdValue)) : brdValue
    return rlyValue;
  }
}

module.exports = { RelayJs };
