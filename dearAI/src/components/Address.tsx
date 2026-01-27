import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { Contact, ContactApiResponse } from "../types/Contact";
import {
    secureLog,
    secureError,
    isValidToken,
    validateContactsResponse,
    isSafeInput,
    API_BASE_URL,
} from "../utils/security";
import AddAddress from "./AddAddress";
import ErrorModal from "./ErrorModal";
import LogoImage from "./Logo";
import CloseBtn from "./CloseButton";
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
    AddressHeaderBar,
    InnerContainer,
    AddressHeaderLabel,
    GroupSelect,
} from "../styles/AddressStyles";

export default function Address() {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [groups, setGroups] = useState<string[]>([]);
    const [selectedGroup, setSelectedGroup] = useState("전체");
    const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [errorModal, setErrorModal] = useState<{
        isVisible: boolean;
        message: string;
    }>({
        isVisible: false,
        message: "",
    });

    // 삭제 함수
    const handleDelete = async (contactId: string) => {
        // contactId 검증
        if (!isSafeInput(contactId, 100)) {
            setErrorModal({
                isVisible: true,
                message: "유효하지 않은 요청입니다!",
            });
            return;
        }

        try {
            const tokenData = await chrome.storage.local.get("accessToken");
            const accessToken = tokenData.accessToken;
            if (!isValidToken(accessToken)) {
                setErrorModal({
                    isVisible: true,
                    message: "로그인이 필요합니다!",
                });
                return;
            }
            await axios.delete(
                `${API_BASE_URL}/contacts/${contactId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setContacts((prev) => prev.filter((c) => c.id !== contactId));
            secureLog("Contact deleted successfully");
        } catch (err) {
            setErrorModal({
                isVisible: true,
                message: "주소록 삭제에 실패했습니다!\n다시 시도해주세요.",
            });
            secureError("Failed to delete contact", err);
        }
    };

    // 수정 함수
    const handleEdit = (contact: Contact) => {
        setEditingContact(contact);
    };

    // 주소록 API 불러오기
    const fetchContacts = async () => {
        try {
            const tokenData = await chrome.storage.local.get("accessToken");
            const accessToken = tokenData.accessToken;

            if (!isValidToken(accessToken)) {
                secureLog("No valid token - skipping contacts fetch");
                return;
            }

            const res = await axios.get(`${API_BASE_URL}/contacts/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const raw = res.data;

            // JSON stringify/parse로 순수 데이터화
            const normalized = JSON.parse(JSON.stringify(raw));

            // 무조건 배열화
            const arr = Array.isArray(normalized) ? normalized : [normalized];

            // API 응답 검증
            if (arr.length > 0 && !validateContactsResponse(arr)) {
                secureError("Invalid contacts response format");
                return;
            }

            setContacts(
                arr.map((c: ContactApiResponse) => ({
                    id: c.id,
                    name: c.recipient_name,
                    email: c.email,
                    group: c.recipient_group,
                    time_modified: c.time_modified,
                }))
            );

            secureLog("Contacts loaded successfully");

            const groupRes = await axios.get(
                `${API_BASE_URL}/contacts/groups`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setGroups(groupRes.data.groups || []);
        } catch (err) {
            secureError("Failed to load contacts", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const filteredContacts = contacts.filter((c) => {
        // 그룹 필터
        const groupMatch = selectedGroup === "전체" || c.group === selectedGroup;

        // 검색어 필터 (그룹, 이름, 이메일 중 하나라도 포함되면 true)
        const keyword = searchKeyword.trim().toLowerCase();
        const searchMatch = keyword === "" ||
            (c.group?.toLowerCase().includes(keyword) ?? false) ||
            c.name.toLowerCase().includes(keyword) ||
            c.email.toLowerCase().includes(keyword);

        return groupMatch && searchMatch;
    });

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
                            gap: "12px",
                        }}
                    >
                        <LogoImage size={36} />
                        <Logo>DearAI</Logo>
                    </div>
                    <CloseBtn
                        onClick={() => navigate("/modal")}
                        size={32}
                        absolute={false}
                    />
                </HeaderBar>

                {/* 상단 검색/추가 */}
                <AddressHeaderBar>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "60px 1fr 2.3fr",
                            gap: "6px",
                            alignItems: "center",
                            flex: 1,
                        }}
                    >
                        <GroupSelect
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                        >
                            <option value="전체">그룹</option>
                            {groups.map((group) => (
                                <option key={group} value={group}>
                                    {group}
                                </option>
                            ))}
                        </GroupSelect>
                        <AddressHeaderLabel>이름</AddressHeaderLabel>
                        <AddressHeaderLabel>메일 주소</AddressHeaderLabel>
                    </div>
                    <div
                        style={{ display: "flex", flexShrink: 0, gap: "10px" }}
                    >
                        <SearchInput
                            placeholder="검색어를 입력해 주세요."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                        <AddButton onClick={() => setShowAddModal(true)}>
                            + 추가
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
                                        <AddressRow
                                            key={c.id}
                                            style={{
                                                backgroundColor: selectedRecipient === c.email ? "#e8f5f1" : "transparent"
                                            }}
                                        >
                                            <AddressCell>
                                                {c.group ?? "-"}
                                            </AddressCell>
                                            <AddressCell>{c.name}</AddressCell>
                                            <AddressCell>{c.email}</AddressCell>
                                            <AddressCell>
                                                <SendMailButton
                                                    onClick={() => {
                                                        setSelectedRecipient(c.email);
                                                        const recipientText = `${c.name}(${c.email})`;
                                                        chrome.storage.local.set({
                                                            draftRecipient: recipientText
                                                        }).then(() => {
                                                            secureLog("Recipient saved");
                                                            navigate("/modal");
                                                        });
                                                    }}
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

            {/* Error Modal */}
            <ErrorModal
                isVisible={errorModal.isVisible}
                onClose={() => setErrorModal({ isVisible: false, message: "" })}
                message={errorModal.message}
            />
        </div>
    );
}
