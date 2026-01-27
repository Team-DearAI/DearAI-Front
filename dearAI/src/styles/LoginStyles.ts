import styled from "styled-components";

export const LogoRow = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 12px;
    margin-bottom: 18px;
`;

export const LoginBackdrop = styled.div`
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const LoginContainer = styled.div`
    background: #fff;
    border: 2px solid #82e0bb;
    border-radius: 16px;
    padding: 40px;
    width: 400px;
    height: 512px;
    font-family: "Pretendard", sans-serif;
    position: relative;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

export const CloseButton = styled.button`
    position: absolute;
    top: 14px;
    right: 14px;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    color: #82e0bb;
    cursor: pointer;
    font-family: "DungGeunMo", cursive;
`;

export const LoginLogo = styled.img`
    width: 40px;
    display: block;
`;

export const LoginTitle = styled.h1`
    font-family: "DungGeunMo", cursive;
    color: #82e0bb;
    font-size: 1.8rem;
    line-height: 40px;
    padding-top: 2px;
    margin: 0;
`;

export const LoginText = styled.p`
    text-align: left;
    color: #333;
    font-family: "DungGeunMo";
    font-size: 0.8rem;
    margin-bottom: 24px;
    line-height: 1.5;
`;

export const GoogleButton = styled.button`
    width: 100%;
    padding: 10px 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: white;
    font-size: 0.95rem;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    img {
        width: 20px;
        height: 20px;
    }

    &:hover {
        background: #f7f7f7;
    }
`;

export const GoogleLoginImage = styled.img<{ disabled?: boolean }>`
    width: 280px;
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    display: block;
    margin-left: auto;
    margin-right: 0;
    opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
    transition: opacity 0.2s;
`;

export const PrivacyRow = styled.label`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    margin-bottom: 12px;
    cursor: pointer;
    font-family: "DungGeunMo", cursive;
    font-size: 0.75rem;
    color: #333;
`;

export const PrivacyCheckbox = styled.input`
    width: 16px;
    height: 16px;
    accent-color: #82e0bb;
    cursor: pointer;
    flex-shrink: 0;
`;

export const PrivacyLink = styled.span`
    color: #82e0bb;
    text-decoration: underline;
    cursor: pointer;
    font-weight: bold;
`;

export const PrivacyOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

export const PrivacyModalBox = styled.div`
    background: #fff;
    border: 2px solid #82e0bb;
    border-radius: 16px;
    padding: 28px 24px;
    width: 380px;
    max-height: 480px;
    display: flex;
    flex-direction: column;
    font-family: "Pretendard", sans-serif;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

export const PrivacyModalTitle = styled.h2`
    font-family: "DungGeunMo", cursive;
    color: #82e0bb;
    font-size: 1rem;
    margin: 0 0 16px 0;
    text-align: center;
`;

export const PrivacyModalContent = styled.div`
    flex: 1;
    overflow-y: auto;
    font-size: 0.78rem;
    line-height: 1.7;
    color: #333;
    white-space: pre-wrap;
    padding-right: 8px;

    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background: #82e0bb;
        border-radius: 3px;
    }
`;

export const PrivacyModalClose = styled.button`
    margin-top: 16px;
    padding: 8px 0;
    width: 100%;
    background: #82e0bb;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: "DungGeunMo", cursive;
    font-size: 0.85rem;
    cursor: pointer;

    &:hover {
        background: #6fd1a9;
    }
`;
