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
    padding: 40px 60px;
    border-radius: 20px;
    width: 480px;
    font-family: "Pretendard", sans-serif;

    @media (max-width: 319px) {
        /* Screen width less than 320px */
        /* Warning message should be handled in Modal.tsx */
    }

    height: 725px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    position: relative;
    margin: 0 16px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    border: 3px solid #82e0bb;
`;

export const Header = styled.header`
    font-size: 1.8rem;
    font-family: "DungGeunMo", cursive;
    color: #82e0bb;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
`;

export const Logo = styled.img`
    width: 32px;
    margin-right: 12px;
`;

export const WhiteLogo = styled(Logo)`
    filter: brightness(0) invert(1);
`;

export const Section = styled.section`
    margin-bottom: 16px;
`;

export const Label = styled.label`
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 6px;
    font-family: "Pretendard", sans-serif;
`;

export const Input = styled.input`
    width: 96%;
    padding: 8px 12px;
    font-size: 0.95rem;
    border-radius: 12px;
    border: 1px solid #ccc;
    font-family: "Pretendard", sans-serif;

    &::placeholder {
        font-family: "Pretendard", sans-serif;
    }
`;

export const Textarea = styled.textarea`
    width: 96%;
    height: 140px;
    padding: 8px 12px;
    font-size: 0.95rem;
    border-radius: 12px;
    border: 1px solid #ccc;
    resize: none;
    font-family: "Pretendard", sans-serif;

    &::placeholder {
        font-family: "Pretendard", sans-serif;
    }
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
    border-radius: 12px;
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
    font-size: 1.5rem;
    font-family: "DungGeunMo", cursive;
    cursor: pointer;
    color: #82e0bb;

    &:hover {
        color: #66c8a3;
    }
`;

export const RecipientSelect = styled.select`
    flex: 1;
    padding: 8px 12px;
    border-radius: 12px;
    border: 1px solid #ccc;
    margin-right: 8px;
    font-family: "Pretendard", sans-serif;
`;

export const SmallGreenButton = styled.button`
    padding: 8px 12px;
    background-color: #82e0bb;
    border: none;
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    margin-right: 6px;
    font-family: "Pretendard", sans-serif;

    &:last-child {
        margin-right: 0;
    }
`;

export const InfoButton = styled.button`
    background: none;
    border: none;
    color: #82e0bb;
    font-size: 1.2rem;
    cursor: pointer;
    font-family: "Pretendard", sans-serif;
`;

export const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    font-family: "Pretendard", sans-serif;
    cursor: pointer;

    input[type="radio"] {
        appearance: none;
        width: 18px;
        height: 18px;
        border: 1.5px solid #ccc;
        border-radius: 4px;
        position: relative;
        cursor: pointer;
        outline: none;
    }

    input[type="radio"]:checked {
        background-color: #82e0bb;
        border-color: #68d7ab;
    }

    input[type="radio"]:checked::before {
        content: "✔";
        color: white;
        position: absolute;
        top: 0;
        left: 3px;
        font-size: 14px;
        line-height: 18px;
    }
`;

export const LanguageSelect = styled.select`
    padding: 8px;
    border-radius: 12px;
    border: 1px solid #ccc;
    font-size: 0.9rem;
    font-family: "Pretendard", sans-serif;
`;

export const NavButton = styled.button`
    padding: 6px 10px;
    margin-right: 6px;
    border-radius: 12px;
    border: none;
    background-color: #d9d9d9;
    color: #ffffff;
    cursor: pointer;
    font-family: "Pretendard";
    font-weight: 700;

    &:hover {
        background-color: #bfbfbf;
    }
`;

export const ResultButton = styled.button`
    padding: 8px 16px;
    background-color: #82e0bb;
    border: none;
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    font-family: "Pretendard", sans-serif;
`;

export const KeywordTag = styled.span`
    border: 1px solid #d9d9d9;
    padding: 6px 16px;
    border-radius: 10px;
    font-size: 0.8rem;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: "Pretendard", sans-serif;
    color: #d9d9d9;
`;

export const TagDeleteButton = styled.button`
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 1px solid #d9d9d9;
    background: none;
    color: #d9d9d9;
    font-size: 0.85rem;
    font-weight: normal;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const AddKeywordButton = styled.button`
    width: 40px;
    height: 40px;
    font-size: 1rem;
    border-radius: 10px;
    border: 1px solid #d9d9d9;
    background: none;
    cursor: pointer;
    color: #d9d9d9;
    font-family: "Pretendard", sans-serif;
    display: inline-flex;
    justify-content: center;
    align-items: center;
`;

export const FinalButton = styled(Button)`
    background-color: #82e0bb;
    padding: 12px 24px;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: "Pretendard", sans-serif;
`;

export const CarIcon = styled.img`
    width: 20px;
`;

export const WarningMessage = styled.div`
    background-color: #ffe0e0;
    color: #c00;
    padding: 8px;
    text-align: center;
    border-radius: 12px;
    margin-bottom: 8px;
`;

export const Row = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 8px;
`;

export const CheckboxGroup = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 20px;
`;

export const NavButtonGroup = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
`;

export const TagGroup = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
`;
