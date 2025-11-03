import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Logo from "./Logo";
import CloseButton from "./CloseButton";
import {
    ModalContainer,
    Header,
    Title,
    FormRow,
    Label,
    Input,
    Button,
    Footer,
} from "../styles/AddAddressStyles";
import type { Contact } from "../types/Contact";

const AddAddress: React.FC<{
    onClose: () => void;
    contact?: Contact;
    onSaved?: () => void;
}> = ({ onClose, contact, onSaved }) => {
    const [name, setName] = useState(contact?.name || "");
    const [email, setEmail] = useState(contact?.email || "");
    const [group, setGroup] = useState(contact?.group || "");
    const [groups, setGroups] = useState<string[]>([]);

    useEffect(() => {
        chrome.storage.local.get("accessToken", async ({ accessToken }) => {
            if (!accessToken) return;
            try {
                const response = await fetch(
                    "https://dearai.cspark.my/contacts/groups",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                const data = await response.json();
                if (data.groups) {
                    setGroups(data.groups);
                }
            } catch (error) {
                console.error("Failed to fetch groups:", error);
            }
        });
    }, []);

    const modalRoot = document.getElementById("modal-root");
    if (!modalRoot) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        chrome.storage.local.get("accessToken", async ({ accessToken }) => {
            if (!accessToken) {
                console.error("No access token found");
                return;
            }
            const payload = {
                name,
                email,
                group,
            };

            try {
                if (contact && contact.id) {
                    // Update existing contact
                    await fetch(
                        `https://dearai.cspark.my/contacts/${contact.id}`,
                        {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${accessToken}`,
                            },
                            body: JSON.stringify(payload),
                        }
                    );
                } else {
                    // Create new contact
                    await fetch("https://dearai.cspark.my/contacts/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify(payload),
                    });
                }
                onSaved?.();
                onClose();
            } catch (error) {
                console.error("Failed to save contact:", error);
            }
        });
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
                            <Logo size={32} />
                            <Title>DearAI</Title>
                        </div>
                        <CloseButton onClick={onClose} />
                    </Header>
                    <form onSubmit={handleSubmit}>
                        <FormRow>
                            <Label htmlFor="group">그룹</Label>
                            <Input
                                list="groups"
                                value={group}
                                onChange={(e) => setGroup(e.target.value)}
                                placeholder="그룹 입력 또는 선택"
                            />
                            <datalist id="groups">
                                {groups.map((g) => (
                                    <option key={g} value={g} />
                                ))}
                            </datalist>
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
                            <Button type="submit">
                                {contact ? "수정" : "추가"}
                            </Button>
                        </Footer>
                    </form>
                </ModalContainer>
            </div>
        </div>,
        modalRoot
    );
};

export default AddAddress;
