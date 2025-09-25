interface ChromeStorage {
    local: {
        get: (
            keys: string[],
            callback: (
                result: {
                    [key: string]: string | undefined;
                } & {
                    accessToken?: string;
                    refreshToken?: string;
                }
            ) => void
        ) => void;
        set: (items: { [key: string]: string }, callback?: () => void) => void;
    };
}

interface ChromeRuntime {
    sendMessage: (
        message: { action: string },
        responseCallback?: (response: { status: string }) => void
    ) => void;
}

declare const chrome: {
    storage: ChromeStorage;
    runtime: ChromeRuntime;
};
import { useState } from "react";
import Modal from "./Modal";
import {
    LoginBackdrop,
    LoginContainer,
    LoginLogo,
    LoginTitle,
    LoginText,
    CloseButton,
    GoogleLoginImage,
    LogoRow,
} from "../styles/LoginStyles";

const Login: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
    const [showModal] = useState(false);
    return (
        <LoginBackdrop>
            <LoginContainer>
                <CloseButton onClick={() => onClose?.()}>x</CloseButton>
                <LogoRow>
                    <LoginLogo src="/logo.png" alt="logo" />
                    <LoginTitle>DearAI</LoginTitle>
                </LogoRow>
                <LoginText>
                    안녕하세요! <br />
                    서비스 이용을 위해 로그인이 필요합니다. 😊 <br />
                    <span>Google 계정으로 빠르게 시작해 볼까요?</span>
                </LoginText>
                <GoogleLoginImage
                    src="/google.png"
                    alt="Google Login"
                    onClick={() => {
                        chrome.runtime.sendMessage({ action: "login" }, () => {
                            chrome.storage.local.get(
                                ["accessToken"],
                                (result) => {
                                    if (result.accessToken) {
                                        onClose?.();
                                    }
                                }
                            );
                        });
                    }}
                />
            </LoginContainer>
            {showModal && <Modal />}
        </LoginBackdrop>
    );
};

export default Login;
