/* eslint-disable react/prop-types */
/* eslint-disable no-undef */

const app = document.getElementById('app');
const Body = () => {
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
        <ThumbnailListContainer imglist={imglist} imgCursor={imgCursor} />
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
const ThumbnailListContainer = ({ imglist, imgCursor }) => {
  console.log('minimg', imglist);
  return (
    <div>
      <div id="thumbnailListContainer">
        {imglist.toReversed().map((minimg, idx) => (
          <ThumbnailContainer
            key={idx}
            url={minimg.url}
            classes={imglist.length - imgCursor - 1 == idx ? 'thumbnailContainer selectedThumbnailContainer' : 'thumbnailContainer'}
          />
        ))}
      </div>
      <div id="thumbnailListContainer2">
        {imglist.toReversed().map((minimg, idx) => (
          <ThumbnailContainer2
            key={idx}
            url={minimg.url}
            classes={imglist.length - imgCursor - 1 == idx ? 'thumbnailContainer2 selectedThumbnailContainer' : 'thumbnailContainer2'}
            offset={idx + imgCursor - imglist.length + 1}
          />
        ))}
      </div>
    </div>
  );
};
const ThumbnailContainer = ({ url, classes }) => {
  return (
    <div className={classes}>
      <img src={url}></img>
    </div>
  );
};
const ThumbnailContainer2 = ({ url, classes, offset }) => {
  /*-: '
  const leftval = 150 * offset;
  const leftstr = leftval + 'px';
  const style = { left: leftstr };
  */
  const style = { '--offset': offset };
  return (
    <div className={classes} style={style}>
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

const HomePage = () => {
  return (
    <div>
      <Body />
    </div>
  );
};

const root = ReactDOM.createRoot(app);
root.render(<HomePage />);
