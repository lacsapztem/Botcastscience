/* eslint-disable react/prop-types */

const Body = ({ imglist, imgCursor }) => {
  return (
    <div>
      <ImgContainer imglist={imglist} imgCursor={imgCursor} />
      <ThumbnailListContainer imglist={imglist} imgCursor={imgCursor} />
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
  return (
    <div>
      <div id="thumbnailListContainer">
        {imglist.map((minimg, idx) => (
          <ThumbnailContainer
            key={idx}
            url={minimg.url}
            classes={imgCursor == idx ? 'thumbnailContainer selectedThumbnailContainer' : 'thumbnailContainer'}
            offset={idx-imgCursor}
          />
        ))}
      </div>
    </div>
  );
};
const ThumbnailContainer = ({ url, classes, offset }) => {
  const style = { '--offset': offset };
  return (
    <div className={classes} style={style}>
      <img src={url}></img>
    </div>
  );
};

export default Body;
