import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Modal from "./components/Modal";
import Address from "./components/Address";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(true); //수정요망

    return (
        <Router>
            {!isLoggedIn ? (
                <Routes>
                    <Route
                        path="*"
                        element={<Login onClose={() => setIsLoggedIn(true)} />}
                    />
                </Routes>
            ) : (
                <Routes>
                    <Route path="/" element={<Modal />} />
                    <Route path="/address" element={<Address />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            )}
        </Router>
    );
};

export default App;
