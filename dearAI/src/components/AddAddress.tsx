import React, { useState, useEffect } from "react";
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
import type { Contact } from "../types/Contact";

const AddAddress: React.FC<{ onClose: () => void; contact?: Contact }> = ({
    onClose,
    contact,
}) => {
    const [name, setName] = useState(contact?.name || "");
    const [email, setEmail] = useState(contact?.email || "");
    const [group, setGroup] = useState(contact?.group || "");
    const [groups, setGroups] = useState<string[]>([]);

    useEffect(() => {
        chrome.storage.local.get(["accessToken"], ({ accessToken }) => {
            if (!accessToken) return;
            fetch("https://dearai.cspark.my/contacts/groups", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        setGroups(data);
                    }
                })
                .catch((err) => {
                    console.error("Failed to fetch groups:", err);
                });
        });
    }, []);

    const modalRoot = document.getElementById("modal-root");
    if (!modalRoot) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { name, email, group };

        try {
            if (contact && contact.id) {
                // Update existing contact
                await fetch(`/api/contacts/${contact.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
            } else {
                // Create new contact
                await fetch("/api/contacts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
            }
            onClose();
        } catch (error) {
            console.error("Failed to save contact:", error);
        }
    };

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
                    <form onSubmit={handleSubmit}>
                        <FormRow>
                            <Label htmlFor="group">그룹</Label>
                            <Select
                                id="group"
                                value={group}
                                onChange={(e) => setGroup(e.target.value)}
                                aria-label="그룹 선택"
                            >
                                <option value="" disabled hidden>
                                    그룹을 선택해 주세요.
                                </option>
                                {groups.map((grp) => (
                                    <option key={grp} value={grp}>
                                        {grp}
                                    </option>
                                ))}
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
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FormRow>
                        <FormRow>
                            <Label htmlFor="email">메일</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="메일 주소를 입력해 주세요."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
