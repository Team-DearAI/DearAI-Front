import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LogoImage from "./Logo";
import CloseBtn from "./CloseButton";
import ErrorModal from "./ErrorModal";
import {
    secureLog,
    secureError,
    isValidToken,
    isValidKeyword,
    isSafeInput,
    validateKeywordsResponse,
    API_BASE_URL,
} from "../utils/security";
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
    const [errorModal, setErrorModal] = useState<{
        isVisible: boolean;
        message: string;
    }>({
        isVisible: false,
        message: "",
    });

    // 키워드 목록 조회
    const fetchKeywords = async () => {
        try {
            const tokenData = await chrome.storage.local.get("accessToken");
            const accessToken = tokenData.accessToken;

            if (!isValidToken(accessToken)) {
                secureLog("No valid token - skipping keyword fetch");
                return;
            }

            const res = await axios.get(`${API_BASE_URL}/filter/keywords`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // API 응답 검증
            if (!validateKeywordsResponse(res.data)) {
                secureError("Invalid keywords response format");
                return;
            }

            setKeywords(res.data.filter_keywords || []);
            secureLog("Filter keywords loaded");
        } catch (err) {
            secureError("Failed to load filter keywords", err);
        } finally {
            setLoading(false);
        }
    };

    // 키워드 추가
    const handleAddKeyword = async () => {
        if (!newKeyword.trim()) {
            setErrorModal({
                isVisible: true,
                message: "키워드를 입력해주세요!",
            });
            return;
        }

        if (!isValidKeyword(newKeyword)) {
            setErrorModal({
                isVisible: true,
                message: "키워드는 1~50자 이내로 입력해주세요!",
            });
            return;
        }

        // 보안 검증: XSS, SQL Injection 패턴 감지
        if (!isSafeInput(newKeyword, 50)) {
            setErrorModal({
                isVisible: true,
                message: "유효하지 않은 키워드입니다!\n특수문자를 확인해주세요.",
            });
            return;
        }

        if (keywords.includes(newKeyword.trim())) {
            setErrorModal({
                isVisible: true,
                message: "이미 등록된 키워드입니다!",
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

            const res = await axios.post(
                `${API_BASE_URL}/filter/keywords`,
                {
                    filter_keywords: [newKeyword.trim()],
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            // API 응답 검증
            if (!validateKeywordsResponse(res.data)) {
                secureError("Invalid keywords response format");
                setErrorModal({
                    isVisible: true,
                    message: "서버 응답 오류!\n다시 시도해주세요.",
                });
                return;
            }

            setKeywords(res.data.filter_keywords || []);
            setNewKeyword("");
            secureLog("Keyword added successfully");
        } catch (err) {
            setErrorModal({
                isVisible: true,
                message: "키워드 추가에 실패했습니다!\n다시 시도해주세요.",
            });
            secureError("Failed to add keyword", err);
        }
    };

    // 키워드 삭제
    const handleDeleteKeyword = async (keywordToDelete: string) => {
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

            const updatedKeywords = keywords.filter((k) => k !== keywordToDelete);

            await axios.put(
                `${API_BASE_URL}/filter/keywords`,
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
            secureLog("Keyword deleted successfully");
        } catch (err) {
            setErrorModal({
                isVisible: true,
                message: "키워드 삭제에 실패했습니다!\n다시 시도해주세요.",
            });
            secureError("Failed to delete keyword", err);
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
                            onKeyDown={(e) => {
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

            {/* Error Modal */}
            <ErrorModal
                isVisible={errorModal.isVisible}
                onClose={() => setErrorModal({ isVisible: false, message: "" })}
                message={errorModal.message}
            />
        </div>
    );
}
