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

interface LoginProps {
    onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
    const [showModal, setShowModal] = useState(false);
    return (
        <LoginBackdrop>
            <LoginContainer>
                <CloseButton onClick={onClose}>x</CloseButton>
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
                    onClick={() => setShowModal(true)}
                />
            </LoginContainer>
            {showModal && <Modal />}
        </LoginBackdrop>
    );
};

export default Login;
