

const initSwipe = (handlePrevImg,handleNextImg,handleFullScreen) => {

  const [touchStartX, setTouchStartX] = React.useState(null)
  const [touchEndX, setTouchEndX] = React.useState(null)
  const [touchStartY, setTouchStartY] = React.useState(null)
  const [touchEndY, setTouchEndY] = React.useState(null)



  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50 

  const onTouchStart = (e) => {
    setTouchEndX(null) // otherwise the swipe is fired even with usual touch events
    setTouchEndY(null) // otherwise the swipe is fired even with usual touch events
    const clientX=e.targetTouches[0].clientX
    const clientY=e.targetTouches[0].clientY
    setTouchStartX(clientX)
    setTouchStartY(clientY)
  }

  const onTouchMove = (e) => {
    const clientX=e.targetTouches[0].clientX
    const clientY=e.targetTouches[0].clientY
    setTouchEndX(clientX)
    setTouchEndY(clientY)
  }

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX || !touchStartY || !touchEndY) {
      console.log("non TouchEnd");
      
      return
    }
    const distanceX = touchStartX - touchEndX
    const distanceY = touchStartY - touchEndY
    const isLeftSwipe = distanceX > minSwipeDistance
    const isRightSwipe = distanceX < -minSwipeDistance
    const isUpSwipe = distanceY > minSwipeDistance
    const isDownSwipe = distanceY < -minSwipeDistance
    if (isRightSwipe) handlePrevImg()
    if (isLeftSwipe ) handleNextImg()
    if (isUpSwipe) handleFullScreen(true)
    if (isDownSwipe ) handleFullScreen(false)
    // add your conditional logic here
  }


  return {
    onTouchStart: onTouchStart,
    onTouchMove: onTouchMove,
    onTouchEnd: onTouchEnd,
  }
}



export default initSwipe;