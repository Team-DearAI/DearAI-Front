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
        onChanged: {
            addListener: (
                callback: (
                    changes: { [key: string]: { oldValue?: string; newValue?: string } },
                    areaName: string
                ) => void
            ) => void;
            removeListener: (
                callback: (
                    changes: { [key: string]: { oldValue?: string; newValue?: string } },
                    areaName: string
                ) => void
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
        // 초기 토큰 체크
        chrome.storage.local.get(["accessToken"], (result) => {
            const tokenValid = isValidToken(result.accessToken);
            setIsLoggedIn(tokenValid);
            secureLog(`Auth check: ${tokenValid ? 'valid' : 'invalid'}`);
        });

        // 스토리지 변경 감지 (로그인 완료 시 자동 전환)
        const handleStorageChange = (
            changes: { [key: string]: { oldValue?: string; newValue?: string } },
            areaName: string
        ) => {
            if (areaName === 'local' && changes.accessToken) {
                const newToken = changes.accessToken.newValue;
                const tokenValid = isValidToken(newToken);
                secureLog(`Token changed: ${tokenValid ? 'valid' : 'invalid'}`);
                setIsLoggedIn(tokenValid);
            }
        };

        chrome.storage.onChanged.addListener(handleStorageChange);

        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
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
