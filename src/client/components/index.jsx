/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import Body from './Body.jsx';
import { PrevNavBar, NextNavBar } from './NavBar.jsx';
import useSSE from './utils/useSSE.jsx';

const app = document.getElementById('app');
var clientID;
const baseUrl = SERVER_URL
const url = baseUrl+CHANNEL_ID;

useSSE.init(url)
console.log("tot")
const App = () => {
  const [imglist, setimglist] = React.useState([]);
  const [imgCursor, setimgCursor] = React.useState(3);
  const [error, setError] = React.useState(0);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  
  //console.log("url",url+'/events');
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

  const processNewData = (newData) => {
    if(newData.type=="imagelist") {
        clientID = clientID || newData.id
        //console.log("reception d'un imagelist");
        setimgCursor(newData.cursor)
        setimglist(newData.data);
      }
      if(newData.type=="cursor") {
        //console.log("reception d'un curseur");
        
        setimgCursor(newData.data)
      }
  }

  const updateError = (msg) =>{
    setError(msg);
  }

  const reconnectionCallback = ()=>{
    setTimeout(()=>{
      useSSE.init(url)
    },5000);
    return 0;
  }

  const connectionToServer = () => {
    useSSE.registerCallback(processNewData,updateError,reconnectionCallback);
  }

  connectionToServer();

  // Send a cursor update to server 
  const sendUpdateCursor = async (val) => {
    if(imglist.length>0) {
      //console.log("Update cursor on server");
      const options =  {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cursor: val
        }),
      }
      //console.log("Envoi du curseur");
      const reponse = await fetch(url+'/updatecursor/',options)
      //console.log(reponse);
    }
  }


  const handleNextImg = React.useCallback(() => {
    const new_val = Math.min(imgCursor + 1, imglist.length - 1);
    sendUpdateCursor(new_val);
    //console.log(imgCursor);
  }, [imgCursor]);

  const handlePrevImg = React.useCallback(() => {
    const new_val = Math.max(imgCursor - 1, 0);
    sendUpdateCursor(new_val);
    //console.log(imgCursor);
  }, [imgCursor]);

  const handleLog = React.useCallback(() => {
    console.log('LogOnDemand: imglist', imglist);
  }, [imgCursor]);

  const toggleFullsceen =  React.useCallback(() => {
    //console.log("toggle fullscreen");
    
    setIsFullScreen(!isFullScreen)
  }, [isFullScreen]);

  const handleFullScreen =  React.useCallback((val) => {
    //console.log("toggle fullscreen",val);
    setIsFullScreen(val);
  }, [isFullScreen]);


  if (imglist.length == 0) {
    //console.log("pas d'image");
    return <h4>Rien à afficher</h4>;
  } else {
    return (
      <div onDoubleClick={toggleFullsceen}>
        <HeaderContainer isFullScreen={isFullScreen}/>
        <Body 
          imglist={imglist} 
          imgCursor={imgCursor} 
          fnUpdateCursor={sendUpdateCursor} 
          handlePrevImg={handlePrevImg} 
          handleNextImg={handleNextImg}
          isFullScreen={isFullScreen}
          handleFullScreen={handleFullScreen}
        />
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
          isFullScreen={isFullScreen}
        />
      </div>
    );
  }
};

const HeaderContainer = ({isFullScreen}) => {
  var classHidden=""
  if(isFullScreen==true){
    classHidden="hiddenInFullScreen"
  }
  return (
    <div id="headerContainer"  className={classHidden}>
      <h1>Bot&apos;Cast Science</h1>
    </div>
  );
};

const FooterContainer = ({ imglist, imgCursor, error, handlePrevImg, handleNextImg, handleLog,isFullScreen }) => {
  var classHidden=""
  if(isFullScreen)
  {
    classHidden="hiddenInFullScreen"
  }
  
  return (
    <div id="footerContainer" className={classHidden}>
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

