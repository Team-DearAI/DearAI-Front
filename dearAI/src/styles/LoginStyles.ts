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

export const GoogleLoginImage = styled.img`
    width: 280px;
    cursor: pointer;
    display: block;
    margin-left: auto;
    margin-right: 0;
`;
