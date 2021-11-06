# relayjs

The official javascript library to manage the relayjs board.

## Installation

```bash
npm i relayjs
```

If you have problem see [below]()

## Usage

Set single relays

```javascript
const {RelayJs, ON, OFF} = require('./relayjs');

const relayjs = new RelayJs(16);
relayjs.on("error", (msg)=>{
  console.log(msg)
})
relayjs.connect().then(()=>{
  relayjs.set(13, ON);
});
```

Set multiple relay

```javascript
const {RelayJs, ON, OFF} = require('./relayjs');

const relays = [OFF, OFF, ON, ON, OFF];

const relayjs = new RelayJs(16);
relayjs.on("error", (msg)=>{
  console.log(msg)
})
relayjs.connect().then(()=>{
  relayjs.setMulti(relays);
});
```

