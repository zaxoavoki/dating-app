import React from "react";
import ReactDOM from "react-dom";
import { positions, transitions, Provider as AlertProvider } from "react-alert";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import App from "./App";
import AuthContextProvider from "./contexts/AuthContext";
import Alert from "./components/layout/Alert";
import reportWebVitals from "./reportWebVitals";

const options = {
  position: positions.BOTTOM_RIGHT,
  timeout: 5000,
  offset: "15px",
  transition: transitions.SCALE,
};

ReactDOM.render(
  <React.StrictMode>
    <AlertProvider template={Alert} {...options}>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </AlertProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();