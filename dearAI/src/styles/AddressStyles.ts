import styled from "styled-components";

export const ModalContainer = styled.div`
    background: white;
    border-radius: 20px;
    width: 600px;
    font-family: "Pretendard", sans-serif;
    height: 785px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    position: relative;
    margin: 0 16px;
    display: flex;
    flex-direction: column;
    border: 3px solid #82e0bb;
    overflow: hidden;
`;

export const AddressTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-family: "Pretendard", sans-serif;
    margin-top: 16px;
`;

export const AddressHeader = styled.thead`
    background-color: #82e0bb;
    color: white;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
`;

export const AddressHeaderCell = styled.th`
    padding: 12px;
    text-align: left;
`;

export const AddressBody = styled.tbody`
    background-color: white;
    font-size: 0.95rem;
`;

export const AddressRow = styled.tr`
    border-bottom: 1px solid #ddd;
`;

export const AddressCell = styled.td`
    padding: 12px;
    font-weight: 500;
`;

export const ActionButton = styled.button`
    padding: 6px 10px;
    border-radius: 8px;
    border: none;
    color: white;
    font-weight: bold;
    margin-right: 6px;
    font-family: "Pretendard", sans-serif;

    &:last-child {
        margin-right: 0;
    }
`;

export const SendMailButton = styled(ActionButton)`
    background-color: #82e0bb;
`;

export const EditButton = styled(ActionButton)`
    background-color: #ffd43b;
    color: #333;
`;

export const DeleteButton = styled(ActionButton)`
    background-color: #fa5252;
`;

export const TopBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
`;

export const SearchInput = styled.input`
    padding: 8px 12px;
    border-radius: 12px;
    border: 1px solid #ccc;
    font-family: "Pretendard", sans-serif;
    margin-left: auto;
    margin-right: 12px;

    &::placeholder {
        font-family: "Pretendard", sans-serif;
    }
`;

export const AddButton = styled.button`
    background-color: #40c057;
    color: white;
    font-weight: bold;
    padding: 8px 12px;
    border-radius: 12px;
    border: none;
    font-family: "Pretendard", sans-serif;
`;

export const HeaderBar = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const Logo = styled.h1`
    font-family: "DungGeunMo", sans-serif;
    color: #82e0bb;
    font-size: 1.8rem;
`;

export const CloseButton = styled.button`
    font-size: 1.2rem;
    background: none;
    border: none;
    color: #82e0bb;
    cursor: pointer;
    font-family: "DungGeunMo", sans-serif;
`;

export const AddressHeaderBar = styled.div`
    width: 100%;
    background-color: #82e0bb;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const InnerContainer = styled.div`
    padding: 40px 60px;
    overflow-y: auto;
    flex: 1;
`;
