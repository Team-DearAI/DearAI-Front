import styled from "styled-components";

export const FilterContainer = styled.div`
    padding: 20px;
    font-family: "Pretendard", sans-serif;
`;

export const KeywordList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const KeywordItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: #f8f9fa;
    border-radius: 10px;
    border: 1px solid #e0e0e0;
    transition: all 0.2s;

    &:hover {
        background-color: #f0f0f0;
        border-color: #82e0bb;
    }
`;

export const KeywordText = styled.span`
    font-size: 0.9rem;
    color: #333;
    font-weight: 500;
`;

export const DeleteKeywordButton = styled.button`
    background-color: #f66969;
    border: 1.5px solid #eb5151;
    color: #fff;
    padding: 6px 12px;
    border-radius: 8px;
    font-weight: 500;
    font-size: 0.75rem;
    font-family: "Pretendard", sans-serif;
    cursor: pointer;
    transition: transform 0.2s;
    white-space: nowrap;

    &:hover {
        transform: scale(1.05);
    }
`;

export const AddKeywordSection = styled.div`
    display: flex;
    gap: 10px;
    width: 100%;
    align-items: center;
`;

export const KeywordInput = styled.input`
    flex: 1;
    padding: 8px 12px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.2);
    color: white;
    font-family: "Pretendard", sans-serif;
    font-size: 0.85rem;
    outline: none;
    transition: all 0.2s;

    &:focus {
        background: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.8);
    }

    &::placeholder {
        color: rgba(255, 255, 255, 0.7);
        font-family: "Pretendard", sans-serif;
        font-size: 0.85rem;
    }
`;
