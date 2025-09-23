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
                <CloseButton onClick={() => onClose?.() ?? window.close()}>
                    x
                </CloseButton>
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
                        const loginUrl = "https://dearai.cspark.my/login";
                        console.log("[프런트] 로그인 시도: ", loginUrl);

                        const loginWindow = window.open(
                            loginUrl,
                            "_blank",
                            "width=500,height=600"
                        );

                        const messageListener = (event: MessageEvent) => {
                            console.log(
                                "[프런트] message 수신: ",
                                event.origin,
                                event.data
                            );
                            if (event.origin !== "https://dearai.cspark.my")
                                return;

                            const token = event.data?.token;
                            if (token) {
                                console.log(
                                    "[프런트] 로그인 성공, 토큰:",
                                    token
                                );
                                loginWindow?.close();
                                window.removeEventListener(
                                    "message",
                                    messageListener
                                );
                            }
                        };

                        window.addEventListener("message", messageListener);
                    }}
                />
            </LoginContainer>
            {showModal && <Modal />}
        </LoginBackdrop>
    );
};

export default Login;
