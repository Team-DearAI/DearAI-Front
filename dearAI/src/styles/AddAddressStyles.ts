import styled from "styled-components";

export const ModalContainer = styled.div`
    background-color: white;
    border: 2px solid #82e0bb;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(130, 224, 187, 0.3);
    width: 320px;
    padding: 20px;
    font-family: "Press Start 2P", cursive;
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

export const Logo = styled.img`
    width: 24px;
    margin-right: 8px;
`;

export const Title = styled.span`
    font-size: 1.2rem;
    font-family: "DungGeunMo", cursive;
    color: #82e0bb;
`;

export const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #82e0bb;
    font-weight: bold;
    font-family: "DungGeunMo", cursive;
`;

export const FormRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 16px;
`;

export const Label = styled.label`
    width: 60px;
    font-size: 14px;
    color: #333;
    font-weight: 500;
`;

export const Select = styled.select`
    flex: 1;
    width: 80%;
    padding: 8px 12px;
    border: 1.5px solid #d9d9d9;
    border-radius: 8px;
    font-size: 14px;
    color: #666;
    background-color: white;
    appearance: none;
    &::placeholder {
        color: #999;
    }
`;

export const Input = styled.input`
    flex: 1;
    width: 80%;
    padding: 8px 12px;
    border: 1.5px solid #d9d9d9;
    border-radius: 8px;
    font-size: 14px;
    color: #333;
    &::placeholder {
        color: #999;
    }
`;

export const Button = styled.button`
    background-color: #82e0bb;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    white-space: nowrap;
`;

export const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
`;
