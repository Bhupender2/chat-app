import react from "react";
import ReactDOM from "react-dom";

import App from "./App";

ReactDOM.render(<App />, document.querySelector("#root")); // ReactDOM.render() is the method provided by the ReactDOM library which is used to render react Element to the DOM . so basically here this line of code is telling react to render the <App/> component into the HTML element with the id "root"
