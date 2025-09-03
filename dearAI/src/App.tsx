import React from "react";
import Login from "./components/Login";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    return (
        <div className="App">
            {!isLoggedIn && <Login onClose={() => setIsLoggedIn(true)} />}
            {isLoggedIn && <p>환영합니다! 로그인 성공 🎉</p>}
        </div>
    );
};

export default App;
