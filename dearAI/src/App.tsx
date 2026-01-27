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
import Filter from "./components/Filter";
import { isValidToken, secureLog } from "./utils/security";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        chrome.storage.local.get(["accessToken"], (result) => {
            // 토큰 존재 여부만 체크하던 것을 토큰 유효성까지 검증
            const tokenValid = isValidToken(result.accessToken);
            setIsLoggedIn(tokenValid);
            secureLog(`Auth check: ${tokenValid ? 'valid' : 'invalid'}`);
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
                <Route
                    path="/filter"
                    element={isLoggedIn ? <Filter /> : <Login />}
                />
            </Routes>
        </HashRouter>
    );
};

export default App;
