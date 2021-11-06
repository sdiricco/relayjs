const {RelayJs, ON, OFF} = require('./relayjs');

const relays = [OFF, OFF, ON, ON, OFF, ON, OFF, OFF, ON, OFF, ON, ON, ON, ON, ON, OFF];


let main = async () => {

  const relayjs = new RelayJs(16);

  relayjs.on("error", (msg)=>{
    console.log(msg)
  })

  await relayjs.connect();
  console.time("t")
  await relayjs.setMulti(relays);
  console.timeEnd("t")

  console.time("t")
  await relayjs.set(4, OFF);
  console.timeEnd("t")

  const r2 = await relayjs.get(2);
  const all = await relayjs.getAll()
    
  console.log("r2", r2);
  console.log("all", all);
}

main();
