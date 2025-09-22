/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import Body from './Body.jsx';
import { PrevNavBar, NextNavBar } from './NavBar.jsx';
const baseUrl = "http://localhost:8000/"

const app = document.getElementById('app');

const App = () => {
  const [imglist, setimglist] = React.useState([]);
  const [imgCursor, setimgCursor] = React.useState(3);
  const [error, setError] = React.useState(0);
  const url = baseUrl+CHANNEL_ID;
  console.log("url",url+'/events');
  const keyDownHandler = React.useCallback(
    (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextImg();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevImg();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleLog();
      }
    },
    [imgCursor],
  );

  React.useEffect(() => {
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      //useEffect retourne une fonction qui sera appelée lors de la destruction du composant
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [imgCursor]);

  //React.useEffect(() => {
  //  setimgCursor(Math.max(0, imglist.length - 1));
  //}, [imglist]);

  
  React.useEffect(() => {
    
    const eventSource = new EventSource(url+'/events');

    // Handle incoming data
    eventSource.onmessage = (event) => {
      console.log('data received',event.data);
      var newData = JSON.parse(event.data);
      console.log('data received',newData);
      if(newData.type=="imagelist") {
        setimgCursor(newData.cursor)
        setimglist(newData.data);
      }
      if(newData.type=="cursor") {
        setimgCursor(newData.data)
      }
    };

    // Handle errors
    eventSource.onerror = () => {
      setError('Connection lost. Trying to reconnect...');
      eventSource.close();
    };

    // Cleanup when component unmounts
    return () => eventSource.close();
  }, [url]);

  // Send a cursor update to server 
  const sendUpdateCursor = async (val) => {
    if(imglist.length>0) {
      console.log("Update cursor on server");
      const options =  {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cursor: imgCursor
        }),
      }
      console.log("Envoi du curseur");
      const reponse = await fetch(url+'/updatecursor/',options)
      console.log(reponse);
    }
  }

  // Send an update to server each time the cursor change
  const updateServerCursor = React.useEffect(() =>{
    sendUpdateCursor(imgCursor)
  },[imgCursor])

  // Update the cursor, but only if the new value is different for the old one
  const updateCursor = React.useCallback((newval) => {
    console.log(imgCursor+'/'+newval);
    if(imgCursor!=newval){
      setimgCursor(newval)
      console.log('nouveau curseur',imgCursor)
    } else {
      console.log('curseur inchangé')
    }
  }, [imgCursor]);


  const handleNextImg = React.useCallback(() => {
    // /!\ imglist est indexé à l'envers
    const new_val = Math.min(imgCursor + 1, imglist.length - 1);
    setimgCursor(new_val);
    console.log(imgCursor);
  }, [imgCursor]);

  const handlePrevImg = React.useCallback(() => {
    // /!\ imglist est indexé à l'envers()
    const new_val = Math.max(imgCursor - 1, 0);
    setimgCursor(new_val);
    console.log(imgCursor);
  }, [imgCursor]);

  const handleLog = React.useCallback(() => {
    console.log('LogOnDemand: imglist', imglist);
  }, [imgCursor]);

  if (imglist.length == 0) {
    console.log("pas d'image");
    return <h4>Rien à afficher</h4>;
  } else {
    return (
      <div >
        <HeaderContainer />
        {imgCursor}
        <Body imglist={imglist} imgCursor={imgCursor} />
        <PrevNavBar
          eventcb={() => {
            handlePrevImg();
          }}
        />
        <NextNavBar
          eventcb={() => {
            handleNextImg();
          }}
        />
        <FooterContainer
          imglist={imglist}
          imgCursor={imgCursor}
          error={error}
          handlePrevImg={handlePrevImg}
          handleNextImg={handleNextImg}
          handleLog={handleLog}
        />
      </div>
    );
  }
};

const HeaderContainer = () => {
  return (
    <div id="headerContainer">
      <h1>Bot&apos;Cast Science</h1>
    </div>
  );
};

const FooterContainer = ({ imglist, imgCursor, error, handlePrevImg, handleNextImg, handleLog }) => {
  return (
    <div id="footerContainer">
      <h4>
        {imglist.length - imgCursor}/{imglist.length}:{imglist[imgCursor].id} - {error}
      </h4>
      <LogContainer handlePrevImg={handlePrevImg} handleNextImg={handleNextImg} handleLog={handleLog} />
    </div>
  );
};

const LogContainer = ({ handlePrevImg, handleNextImg, handleLog }) => {
  return (
    <div id="logContainer">
      <button onClick={handlePrevImg}>Previous</button>
      <button onClick={handleNextImg}>Next</button>
      <button onClick={handleLog}>log</button>
    </div>
  );
};

const root = ReactDOM.createRoot(app);
root.render(
    <App ></App>
);

