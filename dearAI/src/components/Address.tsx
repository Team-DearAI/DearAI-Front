import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { Contact, ContactApiResponse } from "../types/Contact";
import AddAddress from "./AddAddress";
import {
    AddressTable,
    AddressBody,
    AddressRow,
    AddressCell,
    SendMailButton,
    EditButton,
    DeleteButton,
    SearchInput,
    AddButton,
    ModalContainer,
    HeaderBar,
    Logo,
    CloseButton,
    AddressHeaderBar,
    InnerContainer,
    AddressHeaderLabel,
} from "../styles/AddressStyles";

export default function Address() {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [groups, setGroups] = useState<string[]>([]);
    const [selectedGroup, setSelectedGroup] = useState("전체");

    // 삭제 함수
    const handleDelete = async (contactId: string) => {
        try {
            const tokenData = await chrome.storage.local.get("accessToken");
            const accessToken = tokenData.accessToken;
            if (!accessToken) {
                alert("AccessToken 없음 → 로그인 필요");
                return;
            }
            await axios.delete(
                `https://dearai.cspark.my/contacts/${contactId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setContacts((prev) => prev.filter((c) => c.id !== contactId));
        } catch (err) {
            alert("주소록 삭제 실패");
            console.error("❌ 주소록 삭제 실패:", err);
        }
    };

    // 수정 함수
    const handleEdit = (contact: Contact) => {
        setEditingContact(contact);
    };

    // 📌 주소록 API 불러오기
    const fetchContacts = async () => {
        try {
            const tokenData = await chrome.storage.local.get("accessToken");
            const accessToken = tokenData.accessToken;

            if (!accessToken) {
                console.error("⚠️ AccessToken 없음 → 로그인 필요");
                return;
            }

            const res = await axios.get("https://dearai.cspark.my/contacts/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const raw = res.data;

            // JSON stringify/parse로 순수 데이터화
            const normalized = JSON.parse(JSON.stringify(raw));

            // 무조건 배열화
            const arr = Array.isArray(normalized) ? normalized : [normalized];

            setContacts(
                arr.map((c: ContactApiResponse) => ({
                    id: c.id,
                    name: c.recipient_name,
                    email: c.email,
                    group: c.recipient_group,
                    time_modified: c.time_modified,
                }))
            );

            console.log("📥 불러온 주소록 데이터:", arr);

            const groupRes = await axios.get(
                "https://dearai.cspark.my/contacts/groups",
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setGroups(groupRes.data.groups || []);
        } catch (err) {
            console.error("❌ 주소록 불러오기 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const filteredContacts =
        selectedGroup === "전체"
            ? contacts
            : contacts.filter((c) => c.group === selectedGroup);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "transparent",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 999,
            }}
        >
            <ModalContainer>
                {/* 상단 로고 */}
                <HeaderBar>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <img
                            src="/logo.png"
                            alt="logo"
                            style={{ width: "32px" }}
                        />
                        <Logo>DearAI</Logo>
                    </div>
                    <CloseButton onClick={() => navigate(-1)}>x</CloseButton>
                </HeaderBar>

                {/* 상단 검색/추가 */}
                <AddressHeaderBar>
                    <div
                        style={{
                            display: "flex",
                            gap: "20px",
                            color: "white",
                            fontWeight: "bold",
                        }}
                    >
                        <select
                            style={{
                                background: "transparent",
                                color: "white",
                                fontFamily: "Pretendard, sans-serif",
                                borderRadius: "8px",
                                padding: "4px 12px",
                                border: "1px solid #fff",
                                fontWeight: "bold",
                                appearance: "none",
                                outline: "none",
                                minWidth: "70px",
                            }}
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                        >
                            <option value="전체">전체</option>
                            {groups.map((group) => (
                                <option key={group} value={group}>
                                    {group}
                                </option>
                            ))}
                        </select>
                        <AddressHeaderLabel>이름</AddressHeaderLabel>
                        <AddressHeaderLabel>메일 주소</AddressHeaderLabel>
                    </div>
                    <div style={{ display: "flex" }}>
                        <SearchInput placeholder="검색어를 입력해 주세요.." />
                        <AddButton onClick={() => setShowAddModal(true)}>
                            + 주소 추가
                        </AddButton>
                    </div>
                </AddressHeaderBar>

                {/* 주소록 테이블 */}
                <InnerContainer>
                    {loading ? (
                        <p style={{ textAlign: "center" }}>불러오는 중...</p>
                    ) : (
                        <AddressTable>
                            <AddressBody>
                                {filteredContacts.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            style={{
                                                textAlign: "center",
                                                padding: "20px",
                                            }}
                                        >
                                            등록된 주소록이 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredContacts.map((c) => (
                                        <AddressRow key={c.id}>
                                            <AddressCell>
                                                {c.group ?? "-"}
                                            </AddressCell>
                                            <AddressCell>{c.name}</AddressCell>
                                            <AddressCell>{c.email}</AddressCell>
                                            <AddressCell>
                                                <SendMailButton
                                                    onClick={() =>
                                                        navigate("/modal")
                                                    }
                                                >
                                                    선택
                                                </SendMailButton>
                                                <EditButton
                                                    onClick={() =>
                                                        handleEdit(c)
                                                    }
                                                >
                                                    수정
                                                </EditButton>
                                                <DeleteButton
                                                    onClick={() =>
                                                        handleDelete(c.id)
                                                    }
                                                >
                                                    삭제
                                                </DeleteButton>
                                            </AddressCell>
                                        </AddressRow>
                                    ))
                                )}
                            </AddressBody>
                        </AddressTable>
                    )}
                </InnerContainer>
            </ModalContainer>
            {editingContact ? (
                <AddAddress
                    contact={editingContact}
                    onClose={() => setEditingContact(null)}
                    onSaved={fetchContacts}
                />
            ) : (
                showAddModal && (
                    <AddAddress
                        onClose={() => setShowAddModal(false)}
                        onSaved={fetchContacts}
                    />
                )
            )}
        </div>
    );
}
