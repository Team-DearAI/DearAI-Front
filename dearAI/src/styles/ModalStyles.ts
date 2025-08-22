import styled from "styled-components";

export const Backdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const Container = styled.div`
    background: white;
    padding: 24px;
    border-radius: 12px;
    width: 400px;
    max-width: 90%;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    position: relative;
`;

export const Header = styled.header`
    font-size: 1.8rem;
    font-family: "DungGeunMo", cursive;
    color: #82e0bb;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
`;

export const Section = styled.section`
    margin-bottom: 16px;
`;

export const Label = styled.label`
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 6px;
`;

export const Input = styled.input`
    width: 100%;
    padding: 8px 12px;
    font-size: 0.95rem;
    border-radius: 6px;
    border: 1px solid #ccc;
`;

export const Textarea = styled.textarea`
    width: 100%;
    height: 100px;
    padding: 8px 12px;
    font-size: 0.95rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    resize: vertical;
`;

export const Footer = styled.footer`
    display: flex;
    justify-content: flex-end;
`;

export const Button = styled.button`
    padding: 10px 16px;
    background-color: #3182ce;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
        background-color: #2563eb;
    }
`;

export const CloseButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    background: transparent;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #999;

    &:hover {
        color: #333;
    }
`;
