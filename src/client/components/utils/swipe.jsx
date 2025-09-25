

const initSwipe = (handlePrevImg,handleNextImg) => {

  const [touchStart, setTouchStart] = React.useState(null)
  const [touchEnd, setTouchEnd] = React.useState(null)


  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50 

  const onTouchStart = (e) => {
    setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
    const clientX=e.targetTouches[0].clientX
    console.log("clintX ")
    setTouchStart(clientX)
  }

  const onTouchMove = (e) => {
    const clientX=e.targetTouches[0].clientX
    setTouchEnd(clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isRightSwipe) handlePrevImg()
    if (isLeftSwipe ) handleNextImg()
    // add your conditional logic here
  }


  return {
    onTouchStart: onTouchStart,
    onTouchMove: onTouchMove,
    onTouchEnd: onTouchEnd,
  }
}



export default initSwipe;