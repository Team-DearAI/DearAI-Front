import React from "react";
import styled from "styled-components";

interface ErrorModalProps {
    isVisible: boolean;
    onClose: () => void;
    message: string;
}

const ErrorBackdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ErrorContainer = styled.div`
    background: white;
    border-radius: 16px;
    padding: 24px;
    max-width: 320px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border: 2px solid #ff6b6b;
    font-family: "Pretendard", sans-serif;
    position: relative;
    animation: slideIn 0.3s ease-out;

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const ErrorTitle = styled.h3`
    font-size: 1.1rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const ErrorMessage = styled.div`
    font-size: 0.9rem;
    color: #555;
    line-height: 1.6;
    margin-bottom: 16px;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    background: transparent;
    border: none;
    font-size: 24px;
    color: #999;
    cursor: pointer;
    font-family: "DungGeunMo", sans-serif;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;

    &:hover {
        color: #ff6b6b;
    }
`;

const ConfirmButton = styled.button`
    width: 100%;
    padding: 10px;
    background: #82e0bb;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-family: "Pretendard", sans-serif;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: #6bc9a5;
    }
`;

const ErrorModal: React.FC<ErrorModalProps> = ({
    isVisible,
    onClose,
    message,
}) => {
    if (!isVisible) return null;

    return (
        <ErrorBackdrop onClick={onClose}>
            <ErrorContainer onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>×</CloseButton>
                <ErrorTitle>⚠️ 불러오기 실패</ErrorTitle>
                <ErrorMessage>{message}</ErrorMessage>
                <ConfirmButton onClick={onClose}>확인</ConfirmButton>
            </ErrorContainer>
        </ErrorBackdrop>
    );
};

export default ErrorModal;
