/* eslint-disable no-undef */
//import useSSE from './useSSE';

//import { useCallback } from "react";

//import { useCallback } from "react";

//useSSE = require('./useSSE')
const app = document.getElementById('app');
const Body = () => {
  // eslint-disable-next-line no-undef
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
      //usEeffect retourne une fonction qui sera appelée lors de la destruction du composant
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
    console.log('cursor', imgCursor);
    return (
      <div>
        <NavContainer handlePrevImg={handlePrevImg} handleNextImg={handleNextImg} handleLog={handleLog} />
        <ImgContainer imglist={imglist} imgCursor={imgCursor} error={error} />
        <ImgListContainer imglist={imglist} imgCursor={imgCursor} />
        <LogContainer imglist={imglist} imgCursor={imgCursor} error={error} />
      </div>
    );
  }
};

const NavContainer = ({ handlePrevImg, handleNextImg, handleLog }) => {
  return (
    <div id="navContainer">
      <button onClick={handlePrevImg}>Previous</button>
      <button onClick={handleNextImg}>Next</button>
      <button onClick={handleLog}>log</button>
    </div>
  );
};
const ImgContainer = ({ imglist, imgCursor }) => {
  return (
    <div id="imgContainer">
      <img src={imglist[imgCursor].url}></img>
    </div>
  );
};
const ImgListContainer = ({ imglist, imgCursor }) => {
  console.log("minimg",imglist)
    return (
    <div>
      <div id="imgListContainer">
        {imglist.toReversed().map((minimg,idx) => (
          <MiniImgContainer url={minimg.url} classes={imglist.length-imgCursor-1==idx?"imgListContainer selectedImgContainer":"imgListContainer"}/>
        ))}
      </div>
    </div>
  );
};
const MiniImgContainer = ({ url, classes}) => {
  return (
    <div className={classes}>
      <img src={url}></img>
    </div>
  );
};
const LogContainer = ({ imglist, imgCursor, error }) => {
  return (
    <div id="logContainer">
      <h4>
        {imglist.length - imgCursor}/{imglist.length}:{imglist[imgCursor].id}
        <br />
        {error}
      </h4>
    </div>
  );
};
/*
const LogContainer = (props) => {
  console.log('Logcontainer/imglist:', props.imglist);
  console.log('Logcontainer/imgCursor:', props.imgCursor);
  return (
    <div id="logContainer">
      <h4>
        {props.imglist.length - props.imgCursor}/{props.imglist.length}:{props.imglist[props.imgCursor].id}
        <br />
        {props.error}
      </h4>
    </div>
  );
};
*/
const HomePage = () => {
  return (
    <div>
      <Body />
    </div>
  );
};

const root = ReactDOM.createRoot(app);
root.render(<HomePage />);
