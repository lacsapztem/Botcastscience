/* eslint-disable react/prop-types */
import initSwipe from "./utils/swipe.jsx";

const Body = ({ imglist, imgCursor,fnUpdateCursor,handlePrevImg,handleNextImg }) => {
  return (
    <div>
      <ImgContainer imglist={imglist} imgCursor={imgCursor} handlePrevImg={handlePrevImg} handleNextImg={handleNextImg}/>
      <ThumbnailListContainer imglist={imglist} imgCursor={imgCursor} fnUpdateCursor={fnUpdateCursor} />
    </div>
  );
};

const ImgContainer = ({ imglist, imgCursor ,handlePrevImg,handleNextImg}) => {
  const swipeCBS = initSwipe(handlePrevImg,handleNextImg);
  return (
    <div id="imgContainer">
      <img src={imglist[imgCursor].url} onTouchStart={swipeCBS.onTouchStart} onTouchMove={swipeCBS.onTouchMove} onTouchEnd={swipeCBS.onTouchEnd} ></img>
    </div>
  );
};

const ThumbnailListContainer = ({ imglist, imgCursor,fnUpdateCursor }) => {
  return (
    <div>
      <div id="thumbnailListContainer">
        {imglist.map((minimg, idx) => (
          <ThumbnailContainer
            key={idx}
            url={minimg.url}
            classes={imgCursor == idx ? 'thumbnailContainer selectedThumbnailContainer' : 'thumbnailContainer'}
            offset={idx-imgCursor}
            idx={idx}
            fnUpdateCursor={fnUpdateCursor}
          />
        ))}
      </div>
    </div>
  );
};
const ThumbnailContainer = ({ url, classes, offset,idx,fnUpdateCursor }) => {
  const style = { '--offset': offset };
  return (
    <div className={classes} style={style} onClick={()=>{fnUpdateCursor(idx)}}>
      <img src={url}></img>
    </div>
  );
};

export default Body;
