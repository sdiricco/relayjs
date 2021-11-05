const {RelayJ5, ON, OFF} = require('./relay-j5');
const {RelayJS} = require('./relayjs');

let wait = (ms) => {
  return new Promise(res => {
    setTimeout(()=> res(true), ms)
  })
} 


const main = async () =>{
  let relay = undefined;
  try {
    relay = new RelayJS(8);
    relay.on("error", (msg)=>{
      console.log(msg)
    })
    await relay.connect();
  } catch (e) {
    console.log(e)
    return;
  }
  for (let i = 0; i < 10; i++) {
    try {
      relay.setRelay(13, ON);
      await wait(100);
      relay.setRelay(13, OFF);
      await wait(100);
    } catch (e) {
      console.error(e.message);
    }
  }
  console.log(relay.__port)

}

main();

