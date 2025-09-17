/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import Body from './Body.jsx';
import { PrevNavBar, NextNavBar } from './NavBar.jsx';

const app = document.getElementById('app');
const App = () => {
  const [imglist, setimglist] = React.useState([]);
  const [imgCursor, setimgCursor] = React.useState(3);
  const [error, setError] = React.useState(0);
  const url = 'http://localhost:8000/events';
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
    [imgCursor, imglist],
  );

  React.useEffect(() => {
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      //useEffect retourne une fonction qui sera appelée lors de la destruction du composant
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [imgCursor, imglist]);

  React.useEffect(() => {
    const eventSource = new EventSource(url);

    // Handle incoming data
    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setimglist(newData);
      setimgCursor(0);
    };

    // Handle errors
    eventSource.onerror = () => {
      setError('Connection lost. Trying to reconnect...');
      eventSource.close();
    };

    // Cleanup when component unmounts
    return () => eventSource.close();
  }, [url]);

  const handleNextImg = React.useCallback(() => {
    // imglist est indexé à l'envers
    const new_val = Math.max(imgCursor - 1, 0);
    setimgCursor(new_val);
  }, [imgCursor, imglist]);

  const handlePrevImg = React.useCallback(() => {
    // imglist est indexé à l'envers
    const new_val = Math.min(imgCursor + 1, imglist.length - 1);
    setimgCursor(new_val);
  }, [imgCursor, imglist]);

  const handleLog = React.useCallback(() => {
    console.log('LogOnDemand: imglist', imglist);
  }, [imgCursor, imglist]);

  if (imglist.length == 0) {
    console.log("pas d'image");
    return <h4>Rien à afficher</h4>;
  } else {
    return (
      <div>
        <HeaderContainer />
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
const HomePage = () => {
  return (
    <div>
      <App />
    </div>
  );
};

const root = ReactDOM.createRoot(app);
root.render(<HomePage />);
