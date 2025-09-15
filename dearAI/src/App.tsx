import { useState } from "react";
import Login from "./components/Login";
import Modal from "./components/Modal";
import Address from "./components/Address";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [step, setStep] = useState<"login" | "modal" | "address">("login");

    if (!isLoggedIn) {
        return (
            <Login
                onClose={() => {
                    setIsLoggedIn(true);
                    setStep("modal");
                }}
            />
        );
    }

    if (step === "address") {
        return <Address />;
    }

    // 기본은 모달 화면
    return <Modal />;
};

export default App;
