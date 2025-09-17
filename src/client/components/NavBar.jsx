/* eslint-disable react/prop-types */
export const PrevNavBar = ({ eventcb }) => {
  return (
    <div id="PrevNavBar" onClick={eventcb} className="NavBar">
      <span>&lt;</span>
    </div>
  );
};
export const NextNavBar = ({ eventcb }) => {
  return (
    <div id="NextNavBar" onClick={eventcb} className="NavBar">
      <span>&gt;</span>
    </div>
  );
};

export default PrevNavBar;
