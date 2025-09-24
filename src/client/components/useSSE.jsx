
var newdataCallback = ()=>{return 0};
var errorCallback = ()=>{return 0};
var reconnectionCallback = ()=>{return 0};

const init= (url) => {
  console.log("connexoion en cours...");
  
  const eventSource = new EventSource(url+'/events');

  // Handle incoming data
  eventSource.onmessage = (event) => {
    console.log('data received',event.data);
    var newData = JSON.parse(event.data);
    console.log('data received',newData);
    newdataCallback(newData);  
  };
  // Handle errors
  eventSource.onerror = () => {
    errorCallback('Connection lost. Trying to reconnect...');
    reconnectionCallback();
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