# relayjs

The official javascript library to manage the relayjs board.

## Installation

```bash
npm i relayjs
```

If you have problem see [below]()

## Basic Usage

```javascript
const { RelayJs } = require("@sdiricco/relayjs");

let main = async () => {
  const relay = new RelayJs();

  try {
    relay.on("error", (e) => {
      console.log("error raised:", e);
    });

    console.log("connecting..");
    await relay.connect();
    console.log("connected");

    await relay.write(13, relay.CLOSE);

    console.log(relay.relays);

    if (relay.relays[13].state === relay.CLOSE) {
      console.log("relay 13 close");
    } else {
      console.log("relay 13 open");
    }
  } catch (e) {
    console.log("error catched:", e);
  }
};

main();
```

