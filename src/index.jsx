import React from "react";
import ReactDom from "react-dom";

import "./index.less";
import ICON_GIRL from './images/girl.jpg';

const App = () => {
  function handleClick() {
    console.log("clicked...");
  }

  return (
    <div onClick={handleClick}>
      <h2>I&apos;m React</h2>
      <div className="sub-title">我是子标题</div>
      <div>
        <img src={ICON_GIRL} alt="girl" width="600" />
      </div>
    </div>
  );
};

ReactDom.render(<App />, document.querySelector("#root"));
