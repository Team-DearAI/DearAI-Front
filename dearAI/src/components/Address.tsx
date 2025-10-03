import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

interface Contact {
    id: string;
    name: string;
    email: string;
    group?: string;
    time_modified: string;
}

export default function Address() {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    // 📌 주소록 API 불러오기
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const tokenData = await chrome.storage.local.get("accessToken");
                const accessToken = tokenData.accessToken;

                if (!accessToken) {
                    console.error("⚠️ AccessToken 없음 → 로그인 필요");
                    return;
                }

                const res = await axios.get(
                    "https://dearai.cspark.my/contacts/",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                setContacts(res.data);
            } catch (err) {
                console.error("❌ 주소록 불러오기 실패:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

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
                            defaultValue="전체"
                        >
                            <option value="전체">전체</option>
                            <option value="교수님">교수님</option>
                            <option value="공모전">공모전</option>
                            <option value="친구">친구</option>
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
                                {contacts.length === 0 ? (
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
                                    contacts.map((c) => (
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
                                                    메일 보내기
                                                </SendMailButton>
                                                <EditButton>수정</EditButton>
                                                <DeleteButton>
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
            {showAddModal && (
                <AddAddress onClose={() => setShowAddModal(false)} />
            )}
        </div>
    );
}
