declare const chrome: {
    storage: {
        local: {
            get: (
                keys: string[],
                callback: (result: {
                    [key: string]: string | undefined;
                    accessToken?: string;
                    refreshToken?: string;
                }) => void
            ) => void;
            set: (
                items: { [key: string]: string },
                callback?: () => void
            ) => void;
        };
    };
};
import { HashRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import Modal from "./components/Modal";
import Address from "./components/Address";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        chrome.storage.local.get(["accessToken"], (result) => {
            setIsLoggedIn(!!result.accessToken);
        });
    }, []);

    if (isLoggedIn === null) return <div>Loading...</div>;

    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={isLoggedIn ? <Modal /> : <Login />} />
                <Route
                    path="/modal"
                    element={isLoggedIn ? <Modal /> : <Login />}
                />
                <Route
                    path="/address"
                    element={isLoggedIn ? <Address /> : <Login />}
                />
            </Routes>
        </HashRouter>
    );
};

export default App;
