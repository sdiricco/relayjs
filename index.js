const { RelayJs, ON, OFF } = require("./relayjs");

const relays = [OFF, OFF, ON, ON, OFF, ON, OFF, OFF, ON, OFF];

const relayjs = new RelayJs({
  relayCount: 16,
  defaultType: 'NO',
  relaysConfiguration: [
    {
      n: 12,
      type: 'NC'
    }
  ]
});

relayjs.on("error", (msg) => {
  console.log(msg);
});

relayjs
  .connect()
  .then(() => {
    return relayjs.setMulti(relays);
  })
  .then(() => {
    return relayjs.get(2);
  })
  .then((r2) => {
    console.log("r2", r2);
    return relayjs.getAll();
  })
  .then((all) => {
    console.log("all", all);
  });

/*
Expected output
r2 1
all [
  0, 0, 1, 1, 0, 1,
  0, 0, 1, 0, 0, 0,
  0, 0, 0, 0
]
*/
