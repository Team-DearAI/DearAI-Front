import styled from "styled-components";

export const ModalContainer = styled.div`
    background: white;
    box-shadow: none;
    border-radius: 16px;
    width: 98%;
    max-width: 1000px;
    font-family: "Pretendard", sans-serif;
    height: 600px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    position: relative;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    border: 2px solid #82e0bb;
    overflow: hidden;
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
    padding: 12px 6px;
    font-weight: 400;
    font-size: 0.85rem;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:nth-child(1) {
        width: 12%;
    }
    &:nth-child(2) {
        width: 13%;
    }
    &:nth-child(3) {
        width: 30%;
    }
    &:nth-child(4) {
        width: 45%;
        text-align: right;
        padding-right: 12px;
    }
`;

export const ActionButton = styled.button`
    padding: 6px 12px;
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
    white-space: nowrap;
    transition: transform 0.2s;
    min-width: fit-content;

    &:hover {
        transform: scale(1.05);
    }

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
    padding: 6px 10px;
    border-radius: 10px 0 0 10px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    font-family: "Pretendard", sans-serif;
    font-size: 0.75rem;
    width: 150px;
    outline: none;

    &::placeholder {
        font-family: "Pretendard", sans-serif;
        font-size: 0.75rem;
        color: #999;
    }
`;

export const AddButton = styled.button`
    background-color: rgb(136, 214, 183);
    color: white;
    font-weight: bold;
    padding: 7px 12px;
    border-radius: 10px;
    border: 1.5px solid #5dca9f;
    font-family: "Pretendard", sans-serif;
    font-size: 0.75rem;
    cursor: pointer;
    white-space: nowrap;
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.05);
    }
`;

export const HeaderBar = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    position: relative;
`;

export const Logo = styled.h1`
    font-family: "DungGeunMo", sans-serif;
    color: #82e0bb;
    font-size: 1.8rem;
    margin: 0;
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
    padding: 12px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
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
    text-align: center;
    font-weight: bold;
    font-size: 0.75rem;
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const GroupSelect = styled.select`
    background: rgba(255, 255, 255, 0.2);
    color: white;
    font-family: "Pretendard", sans-serif;
    font-size: 0.75rem;
    border-radius: 6px;
    padding: 6px 20px 6px 8px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    font-weight: bold;
    outline: none;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 8L2 4h8z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 4px center;
    min-width: 70px;
    max-width: 90px;

    option {
        background: #82e0bb;
        color: white;
    }
`;

export const SearchButton = styled.button`
    background-color: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 0 10px 10px 0;
    padding: 6px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -1px;

    &:hover {
        background-color: white;
    }
`;
