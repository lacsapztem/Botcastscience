
var newdataCallback = ()=>{return 0};
var errorCallback = ()=>{return 0};
var reconnectionCallback = ()=>{return 0};
var recoTries=0;

const init= (url) => {
  console.log("connexion en cours...");
  
  const eventSource = new EventSource({
    url: url+'/events',
    headers: {
      'X-Accel-Buffering': 'no'
    }
  });

  // Handle incoming data
  eventSource.onmessage = (event) => {
    //recoTries reinit because if we are here, we are reconnected
    recoTries=0;
    //console.log('data received',event.data);
    var newData = JSON.parse(event.data);
    //console.log('data received',newData);
    newdataCallback(newData);  
  };
  // Handle errors
  eventSource.onerror = () => {
    var delay=1;
    errorCallback('Connection lost. Trying to reconnect...');
    if(recoTries<10) {
      delay=1000; // 1 attempt every second during 10 secondes 
    } else if (recoTries < 150) {
      delay = 5000 // then an attempts every 5 seconds during 11,6 minutes
    } else if (recoTries < 600) {
      delay = 500 // then an attempts every 10 seconds during 75 minutes
    } else {
      errorCallback('I give up...');
    }
    if (recoTries < 600) {
      reconnectionCallback(delay);
    }
    eventSource.close();
  };

  // Cleanup when component unmounts
  return () => eventSource.close();
}

const registerCallback = (new_newdataCallback,new_errorCallback,new_reconnectionCallback) => {
  newdataCallback = new_newdataCallback
  errorCallback = new_errorCallback
  reconnectionCallback = new_reconnectionCallback
}

const useSSE= {
  init: init,
  registerCallback,registerCallback
}

export default useSSE;