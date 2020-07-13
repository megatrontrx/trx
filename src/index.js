import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

var waitForGlobal = async () =>{
    if (window.tronWeb) {
        let tronWeb = window.tronWeb;
        const nodes = await tronWeb.isConnected();
        const connected = !Object.entries(nodes).map(([name, connected]) => {
            if (!connected) {
              //  alert("Please install TronLink Wallet")
            }
            return connected;
        }).includes(false);
        ReactDOM.render(<App />, document.getElementById('root'));
        if (connected){
           
        } else {
          //  console.error(`Error: TRON node is not connected`);
           // alert("Please install TronLink Wallet");
            setTimeout(async () => {
                await waitForGlobal();
            }, 1);
        }

    } else {
       // alert("Please install TronLink Wallet");
        setTimeout(async () => {
            await waitForGlobal();
        }, 1);
    }
};

waitForGlobal().then();

