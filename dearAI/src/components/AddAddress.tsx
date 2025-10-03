import React from "react";
import ReactDOM from "react-dom";
import {
    ModalContainer,
    Header,
    Logo,
    Title,
    CloseButton,
    FormRow,
    Label,
    Select,
    Input,
    Button,
    Footer,
} from "../styles/AddAddressStyles";

const AddAddress: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const modalRoot = document.getElementById("modal-root");
    if (!modalRoot) return null;

    return ReactDOM.createPortal(
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.4)",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            onClick={onClose}
        >
            <div onClick={(e) => e.stopPropagation()}>
                <ModalContainer>
                    <Header>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Logo src="/logo.png" alt="logo" />
                            <Title>DearAI</Title>
                        </div>
                        <CloseButton onClick={onClose} aria-label="Close modal">
                            x
                        </CloseButton>
                    </Header>
                    <form>
                        <FormRow>
                            <Label htmlFor="group">그룹</Label>
                            <Select
                                id="group"
                                defaultValue=""
                                aria-label="그룹 선택"
                            >
                                <option value="" disabled hidden>
                                    그룹을 선택해 주세요.
                                </option>
                                {/* Options can be added here */}
                            </Select>
                            <Button type="button" style={{ marginLeft: "8px" }}>
                                그룹 추가
                            </Button>
                        </FormRow>
                        <FormRow>
                            <Label htmlFor="name">이름</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="이름을 입력해 주세요."
                            />
                        </FormRow>
                        <FormRow>
                            <Label htmlFor="email">메일</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="메일 주소를 입력해 주세요."
                            />
                        </FormRow>
                        <Footer>
                            <Button type="submit">확인</Button>
                        </Footer>
                    </form>
                </ModalContainer>
            </div>
        </div>,
        modalRoot
    );
};

export default AddAddress;
