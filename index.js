const {RelayJs, ON, OFF} = require('./relayjs');

const relays = [OFF, OFF, ON, ON, OFF];

const relayjs = new RelayJs(16);
relayjs.on("error", (msg)=>{
  console.log(msg)
})
relayjs.connect().then(()=>{
  try {
    relayjs.setMulti(relays);
  } catch (e) {
    console.log(e.message)
  }
});
