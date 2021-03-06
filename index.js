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
  constructor() {
    super();
    this.board = new Board();

    this.size = undefined;
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

  __setSize(size) {
    if (!this.__cboard) {
      return;
    }
    const pinsLenght = Object.keys(this.__cboard.pinMapping).length;
    if (size) {
      if (typeof size !== "number") {
        throw new Error("size must be type of number");
      } else {
        if (size < MIN_SIZE || size > pinsLenght) {
          throw new Error(
            `size must be in range [${MIN_SIZE} - ${pinsLenght}]`
          );
        } else {
          this.size = Math.floor(size);
        }
      }
    } else {
      this.size = pinsLenght;
    }
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
    this.__relaysT = Object.keys(this.__cboard.pinMapping)
      .map(() => {
        return "NO";
      })
      .slice(0, this.size);
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
    if (!this.connected) {
      return [];
    }
    let __relays = [];
    let idx = 0;
    for (const key in this.__cboard.pinMapping) {
      const pin = this.__cboard.pinMapping[key];
      const rlyValue = this.board.pins[pin].value;
      __relays.push({
        type: this.__relaysT[idx],
        state: rlyValue,
      });
      idx += 1;
    }
    const relays = __relays.slice(0, this.size);
    return relays;
  }

  async connect({
    port = undefined,
    size = undefined,
    options = undefined,
  } = {}) {
    try {
      await this.board.disconnect();
      await this.board.connect(port, options);
      this.__findBoardConnected();
      this.__setSize(size);
      await this.__initializeRelays();
      await this.reset();
    } catch (e) {
      throw new Error(e);
    }
    return true;
  }

  async disconnect() {
    try {
      await this.board.disconnect();
    } catch (e) {
      throw new Error(e);
    }
  }

  async reset() {
    try {
      await this.board.execProm(() => {
        let idx = 0;
        for (const key in this.__cboard.pinMapping) {
          if (idx >= this.size) {
            break;
          }

          const pin = this.__cboard.pinMapping[key];
          const mode = this.board.MODES.OUTPUT;
          const value = this.board.LOW;

          this.board.firmata.pinMode(pin, mode);
          this.board.firmata.digitalWrite(pin, value);

          idx += 1;
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
        ) ||
        pin >= this.size
      ) {
        throw new Error("write() failed. Invalid pin");
      }

      const __pin = this.__cboard.pinMapping[pin];
      await this.board.digitalWrite(__pin, value);
    } catch (e) {
      throw new Error(e);
    }
  }

  read(pin) {
    if (
      !this.__cboard.pinMapping.hasOwnProperty.call(
        this.__cboard.pinMapping,
        pin
      ) ||
      pin > this.size
    ) {
      throw new Error("write() failed. Invalid pin");
    }
    if (!this.connected) {
      throw new Error("write() failed. Missing connection");
    }
    const __pin = this.__cboard.pinMapping[pin];
    const rlyValue = this.board.pins[__pin].value;
    return rlyValue;
  }
}

module.exports = { RelayJs };
