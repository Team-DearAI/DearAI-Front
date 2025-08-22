import React from "react";
import { Modal } from "./components/Modal";

const App = () => {
    const isLoggedIn = true; // 나중에 로직으로 바꿔도 됨

    return (
        <div className="App">
            {isLoggedIn ? <Modal /> : <p>로그인이 필요합니다.</p>}
        </div>
    );
};

export default App;
