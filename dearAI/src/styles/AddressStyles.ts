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
    padding: 10px 6px 12px 12px
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
    padding: 12px 6px 12px 12px;
    font-weight: 400;
    font-size: 0.85rem;
    text-align: center;
    white-space: normal;
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
        width: 40%;
    }
`;

export const ActionButton = styled.button`
    padding: 6px 10px;
    border-radius: 8px;
    border: none;
    color: white;
    font-weight: 500;
    font-size: 0.75rem;
    margin-right: 6px;
    font-family: "Pretendard", sans-serif;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:last-child {
        margin-right: 0;
    }
`;

export const SendMailButton = styled(ActionButton)`
    background-color: #82e0bb;
    border: 1.5px solid #68d7ab;
    color: #fff;
`;

export const EditButton = styled(ActionButton)`
    background-color: #face4e;
    border: 1.5px solid #fbbc04;
    color: #fff;
`;

export const DeleteButton = styled(ActionButton)`
    background-color: #f66969;
    border: 1.5px solid #eb5151;
    color: #fff;
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
    cursor: pointer;
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
