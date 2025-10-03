import styled from "styled-components";

export const ModalContainer = styled.div`
    background: white;
    box-shadow: none;
    border-radius: 16px;
    width: 100%;
    max-width: 600px;
    font-family: "Pretendard", sans-serif;
    height: 600px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    position: relative;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    border: 2px solid #82e0bb;
`;

export const AddressTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-family: "Pretendard", sans-serif;
    margin-top: 16px;
    table-layout: fixed;
`;

export const AddressHeader = styled.thead`
    background-color: #82e0bb;
    color: white;
    font-size: 0.95rem;
    display: table-row;
`;

export const AddressHeaderCell = styled.th`
    display: table-cell;
    padding: 12px;
    text-align: center;
    width: 20%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const AddressBody = styled.tbody`
    background-color: white;
    font-size: 0.95rem;
`;

export const AddressRow = styled.tr`
    display: table-row;
    border-bottom: 1px solid #ddd;
`;

export const AddressCell = styled.td`
    display: table-cell;
    padding: 12px;
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:nth-child(1) {
        width: 15%;
    }
    &:nth-child(2) {
        width: 15%;
    }
    &:nth-child(3) {
        width: 40%;
    }
    &:nth-child(4) {
        width: 30%;
    }
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
    background-color: rgb(136, 214, 183);
    color: white;
    font-weight: bold;
    padding: 8px 12px;
    border-radius: 12px;
    border: 1.5px solid #5dca9f;
    font-family: "Pretendard", sans-serif;
    font-size: 0.7rem;
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

export const AddressHeaderLabel = styled.div`
    flex: 1;
    text-align: center;
    font-weight: bold;
    font-size: 0.8rem;
    color: white;
`;
