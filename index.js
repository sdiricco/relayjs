const {RelayJ5, ON, OFF} = require('./relay-j5');
const {RelayJS} = require('./relayjs');

let wait = (ms) => {
  return new Promise(res => {
    setTimeout(()=> res(true), ms)
  })
} 


const main = async () =>{

  /*
  const relay = new RelayJ5();
  relay.on("error", (msg)=>{
    console.log(msg)
  })
  try {
    await relay.connect();
  } catch (e) {
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
  relay.disconnect();
  */

  const relay = new RelayJS();
  relay.on("error", (msg)=>{
    console.log(msg)
  })
  try {
    await relay.connect();
  } catch (e) {
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

