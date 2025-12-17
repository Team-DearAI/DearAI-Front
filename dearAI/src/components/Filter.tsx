import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LogoImage from "./Logo";
import CloseBtn from "./CloseButton";
import {
    ModalContainer,
    HeaderBar,
    Logo,
    AddressHeaderBar,
    InnerContainer,
    AddButton,
} from "../styles/AddressStyles";
import {
    FilterContainer,
    KeywordList,
    KeywordItem,
    KeywordText,
    DeleteKeywordButton,
    AddKeywordSection,
    KeywordInput,
} from "../styles/FilterStyles";

export default function Filter() {
    const navigate = useNavigate();
    const [keywords, setKeywords] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [newKeyword, setNewKeyword] = useState("");

    // 키워드 목록 조회
    const fetchKeywords = async () => {
        try {
            const tokenData = await chrome.storage.local.get("accessToken");
            const accessToken = tokenData.accessToken;

            if (!accessToken) {
                console.error("⚠️ AccessToken 없음 → 로그인 필요");
                return;
            }

            const res = await axios.get("https://dearai.cspark.my/filter/keywords", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setKeywords(res.data.filter_keywords || []);
            console.log("📥 불러온 필터 키워드:", res.data.filter_keywords);
        } catch (err) {
            console.error("❌ 필터 키워드 불러오기 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    // 키워드 추가
    const handleAddKeyword = async () => {
        if (!newKeyword.trim()) {
            alert("키워드를 입력해주세요.");
            return;
        }

        if (keywords.includes(newKeyword.trim())) {
            alert("이미 등록된 키워드입니다.");
            return;
        }

        try {
            const tokenData = await chrome.storage.local.get("accessToken");
            const accessToken = tokenData.accessToken;

            if (!accessToken) {
                alert("AccessToken 없음 → 로그인 필요");
                return;
            }

            const res = await axios.post(
                "https://dearai.cspark.my/filter/keywords",
                {
                    filter_keywords: [newKeyword.trim()],
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            setKeywords(res.data.filter_keywords || []);
            setNewKeyword("");
            console.log("✅ 키워드 추가 성공:", res.data.filter_keywords);
        } catch (err) {
            alert("키워드 추가 실패");
            console.error("❌ 키워드 추가 실패:", err);
        }
    };

    // 키워드 삭제
    const handleDeleteKeyword = async (keywordToDelete: string) => {
        try {
            const tokenData = await chrome.storage.local.get("accessToken");
            const accessToken = tokenData.accessToken;

            if (!accessToken) {
                alert("AccessToken 없음 → 로그인 필요");
                return;
            }

            const updatedKeywords = keywords.filter((k) => k !== keywordToDelete);

            await axios.put(
                "https://dearai.cspark.my/filter/keywords",
                {
                    filter_keywords: updatedKeywords,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            setKeywords(updatedKeywords);
            console.log("✅ 키워드 삭제 성공");
        } catch (err) {
            alert("키워드 삭제 실패");
            console.error("❌ 키워드 삭제 실패:", err);
        }
    };

    useEffect(() => {
        fetchKeywords();
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
                            gap: "12px",
                        }}
                    >
                        <LogoImage size={36} />
                        <Logo>DearAI - 제외 키워드</Logo>
                    </div>
                    <CloseBtn
                        onClick={() => navigate("/modal")}
                        size={32}
                        absolute={false}
                    />
                </HeaderBar>

                {/* 키워드 추가 섹션 */}
                <AddressHeaderBar>
                    <AddKeywordSection>
                        <KeywordInput
                            type="text"
                            placeholder="제외할 키워드를 입력하세요"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handleAddKeyword();
                                }
                            }}
                        />
                        <AddButton onClick={handleAddKeyword}>+ 추가</AddButton>
                    </AddKeywordSection>
                </AddressHeaderBar>

                {/* 키워드 목록 */}
                <InnerContainer>
                    {loading ? (
                        <p style={{ textAlign: "center" }}>불러오는 중...</p>
                    ) : (
                        <FilterContainer>
                            {keywords.length === 0 ? (
                                <p style={{ textAlign: "center", padding: "20px" }}>
                                    등록된 제외 키워드가 없습니다.
                                </p>
                            ) : (
                                <KeywordList>
                                    {keywords.map((keyword, index) => (
                                        <KeywordItem key={index}>
                                            <KeywordText>{keyword}</KeywordText>
                                            <DeleteKeywordButton
                                                onClick={() => handleDeleteKeyword(keyword)}
                                            >
                                                삭제
                                            </DeleteKeywordButton>
                                        </KeywordItem>
                                    ))}
                                </KeywordList>
                            )}
                        </FilterContainer>
                    )}
                </InnerContainer>
            </ModalContainer>
        </div>
    );
}
