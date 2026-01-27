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
import {
    secureLog,
    secureError,
    isValidEmail,
    isValidName,
    isValidGroup,
    isValidToken,
    API_BASE_URL,
} from "../utils/security";

const AddAddress: React.FC<{
    onClose: () => void;
    contact?: Contact;
    onSaved?: () => void;
}> = ({ onClose, contact, onSaved }) => {
    const [name, setName] = useState(contact?.name || "");
    const [email, setEmail] = useState(contact?.email || "");
    const [group, setGroup] = useState(contact?.group || "");
    const [groups, setGroups] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        chrome.storage.local.get("accessToken", async ({ accessToken }) => {
            if (!isValidToken(accessToken)) return;
            try {
                const response = await fetch(
                    `${API_BASE_URL}/contacts/groups`,
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
                secureLog("Groups loaded");
            } catch (err) {
                secureError("Failed to fetch groups", err);
            }
        });
    }, []);

    const modalRoot = document.getElementById("modal-root");
    if (!modalRoot) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // 입력값 검증
        if (!isValidName(name)) {
            setError("이름은 1~50자의 한글, 영문, 숫자만 입력 가능합니다.");
            return;
        }

        if (!isValidEmail(email)) {
            setError("올바른 이메일 형식을 입력해주세요.");
            return;
        }

        if (!isValidGroup(group)) {
            setError("그룹명은 30자 이내의 한글, 영문, 숫자만 입력 가능합니다.");
            return;
        }

        chrome.storage.local.get("accessToken", async ({ accessToken }) => {
            if (!isValidToken(accessToken)) {
                secureError("No valid access token found");
                setError("로그인이 필요합니다.");
                return;
            }
            const payload = {
                name: name.trim(),
                email: email.trim(),
                group: group.trim(),
            };

            try {
                if (contact && contact.id) {
                    // Update existing contact
                    await fetch(
                        `${API_BASE_URL}/contacts/${contact.id}`,
                        {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${accessToken}`,
                            },
                            body: JSON.stringify(payload),
                        }
                    );
                    secureLog("Contact updated successfully");
                } else {
                    // Create new contact
                    await fetch(`${API_BASE_URL}/contacts/`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify(payload),
                    });
                    secureLog("Contact created successfully");
                }
                onSaved?.();
                onClose();
            } catch (err) {
                secureError("Failed to save contact", err);
                setError("저장에 실패했습니다. 다시 시도해주세요.");
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
                        <CloseButton onClick={onClose} absolute={false} />
                    </Header>
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div style={{
                                color: "#e74c3c",
                                fontSize: "0.85rem",
                                marginBottom: "12px",
                                padding: "8px",
                                backgroundColor: "#fdeaea",
                                borderRadius: "4px",
                            }}>
                                {error}
                            </div>
                        )}
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
