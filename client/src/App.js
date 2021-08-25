import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from "./Header/Header";
import Login from "./Login/Login";
import Profile from "./Profile/Profile";

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then(({ message }) => setData(message));
  }, []);

  return (
    <div className="App">
      <Router>
        <Route path='/:page' component={Header} />
        <Route exact path='/' component={Header} />

        <Route exact path='/' component={Login} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/profile' component={Profile} />
      </Router>

      {/*<p>{!data ? "Loading..." : data}</p>*/}
    </div>
  );
}

export default App;
