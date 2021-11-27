/**
 * 
 * Scope of test:
 * Verify the functionallity of connect() method
 * in auto-connect mode
 * 
 * Prerequisites:
 * - a board with a valid firmata.ino firmware connected
 * 
 * Description step:
 * - call <constructor()> of RelayJs class
 * - listen on <error> event
 * - call <connect()> method with no parameters. auto-connect mode.
 * 
 * Asserts: 
 * - connected property
 * - result of connect() method
 * 
 */

 const{RelayJs} = require('../index');
 const { Test } = require("./utils");
 
 let main = async () => {
 
   const test = new Test(
     module.filename,
     "Verify the functionallity of connect() method in auto-connect mode"
   );
 
   const relay = new RelayJs();
   let __connect = false;
 
   try {
 
     relay.on("error", (e) => {
       console.log("error raised:", e)
     });
 
     console.log("connecting..");
     __connect = await relay.connect();
     console.log("connected");

     await relay.write(13, relay.CLOSE);

     console.log(relay.relays);
     
     if (relay.relays[13].state === relay.CLOSE) {
        console.log('RELAY CLOSE')
     }
     if (relay.relays[13].state === relay.OPEN) {
      console.log('RELAY OPEN')
     }
     
   } catch (e) {
     console.log("error catched:", e);
   }
 
   test.assert(relay.connected, "connected property");
   test.assert(__connect, "result of connect() method");
   test.end({exit: true});
 
 }
 
 main();