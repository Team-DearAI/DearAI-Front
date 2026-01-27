declare const chrome: {
    storage: {
        local: {
            clear: () => Promise<void>;
            get: (keys: string | string[]) => Promise<{ [key: string]: any }>;
            set: (items: { [key: string]: any }) => Promise<void>;
        };
    };
    runtime: {
        sendMessage: (
            message: { action: string; content?: string },
            responseCallback?: (response: {
                success?: boolean;
                recipient?: string;
                content?: string;
                error?: string;
                status?: string;
            }) => void
        ) => void;
    };
};
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
    secureLog,
    secureError,
    isValidKeyword,
    isValidToken,
    debounce,
    isSafeInput,
    validateKeywordsResponse,
    validateMailReviewResponse,
    getSecureStorageValue,
    API_BASE_URL,
} from "../utils/security";
import Logo from "./Logo";
import CloseButton from "./CloseButton";
import Tooltip from "./Tooltip";
import ErrorModal from "./ErrorModal";
import {
    Backdrop,
    Container,
    Header,
    Section,
    Label,
    Input,
    Textarea,
    Footer,
    SmallGreenButton,
    InfoButton,
    CheckboxLabel,
    LanguageSelect,
    NavButton,
    ResultButton,
    KeywordTag,
    TagDeleteButton,
    AddKeywordButton,
    FinalButton,
    WarningMessage,
    Row,
    CheckboxGroup,
    NavButtonGroup,
    TagGroup,
    WhiteLogo,
} from "../styles/ModalStyles";

export const Modal: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSmallScreen, setIsSmallScreen] = React.useState(
        window.innerWidth < 320
    );
    const [logoClickCount, setLogoClickCount] = React.useState(0);
    const [recipient, setRecipient] = React.useState<string>("");
    const [mailContent, setMailContent] = React.useState<string>("");
    const [title, setTitle] = React.useState<string>("");
    const [guide, setGuide] = React.useState<string>("");
    const [option, setOption] = React.useState<string>(""); // 톤/스타일
    const [language, setLanguage] = React.useState<string>(""); // 언어
    const [showTooltip, setShowTooltip] = React.useState(false);
    const [excludedKeywords, setExcludedKeywords] = React.useState<string[]>([]);
    const [isAddingKeyword, setIsAddingKeyword] = React.useState(false);
    const [newKeyword, setNewKeyword] = React.useState("");
    const [isLoadingResult, setIsLoadingResult] = React.useState(false);

    // 검수 히스토리 관리
    type HistoryItem = {
        guide: string;
        result: string;
        title: string;
        timestamp: Date;
    };
    const [history, setHistory] = React.useState<HistoryItem[]>([]);
    const [currentHistoryIndex, setCurrentHistoryIndex] = React.useState<number>(-1);
    const [errorModal, setErrorModal] = React.useState<{
        isVisible: boolean;
        message: string;
    }>({
        isVisible: false,
        message: "",
    });

    // 컴포넌트 마운트 시 및 location 변경 시 저장된 내용 불러오기
    React.useEffect(() => {
        chrome.storage.local.get(['draftRecipient', 'draftMailContent']).then((result) => {
            // Storage 데이터 안전하게 가져오기
            const savedRecipient = getSecureStorageValue(result.draftRecipient);
            const savedMailContent = getSecureStorageValue(result.draftMailContent);

            if (savedRecipient) {
                setRecipient(savedRecipient);
                secureLog('Draft recipient loaded');
            }
            if (savedMailContent) {
                setMailContent(savedMailContent);
                secureLog('Draft mail content loaded');
            }
        });
    }, [location]);

    // 제외 키워드 불러오기 (GET /filter/keywords)
    React.useEffect(() => {
        const fetchFilterKeywords = async () => {
            try {
                const tokenData = await chrome.storage.local.get("accessToken");
                const accessToken = tokenData.accessToken;

                if (!isValidToken(accessToken)) {
                    secureLog('No valid token - skipping keyword fetch');
                    return;
                }

                const res = await axios.get(`${API_BASE_URL}/filter/keywords`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                // API 응답 검증
                if (!validateKeywordsResponse(res.data)) {
                    secureError('Invalid keywords response format');
                    return;
                }

                setExcludedKeywords(res.data.filter_keywords || []);
                secureLog('Filter keywords loaded');
            } catch (err) {
                secureError('Failed to load filter keywords', err);
            }
        };

        fetchFilterKeywords();
    }, []);


    // Debounced 저장 함수들
    const debouncedSaveRecipient = React.useMemo(
        () => debounce((value: string) => {
            chrome.storage.local.set({ draftRecipient: value });
            secureLog('Draft recipient saved');
        }, 500),
        []
    );

    const debouncedSaveMailContent = React.useMemo(
        () => debounce((value: string) => {
            chrome.storage.local.set({ draftMailContent: value });
            secureLog('Draft mail content saved');
        }, 500),
        []
    );

    // 받는 사람이 변경될 때마다 자동 저장 (debounced)
    React.useEffect(() => {
        if (recipient) {
            debouncedSaveRecipient(recipient);
        }
    }, [recipient, debouncedSaveRecipient]);

    // 메일 내용이 변경될 때마다 자동 저장 (debounced)
    React.useEffect(() => {
        if (mailContent) {
            debouncedSaveMailContent(mailContent);
        }
    }, [mailContent, debouncedSaveMailContent]);

    // Optional: Reset click count after a short timeout
    React.useEffect(() => {
        if (logoClickCount === 0) return;
        const timeout = setTimeout(() => {
            setLogoClickCount(0);
        }, 1500);
        return () => clearTimeout(timeout);
    }, [logoClickCount]);

    React.useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 320);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 네이버 메일 화면에서 받는 사람 정보와 메일 내용 불러오기
    const handleLoadRecipient = () => {
        secureLog("Loading recipient from mail");

        chrome.runtime.sendMessage(
            { action: "getRecipient" },
            (response) => {
                if (response?.success) {
                    if (response.recipient) {
                        setRecipient(response.recipient);
                        secureLog("Recipient loaded successfully");
                    }
                    if (response.content) {
                        setMailContent(response.content);
                        secureLog("Mail content loaded successfully");
                    }
                } else {
                    const errorMsg = response?.error || "받는 사람 정보를 찾을 수 없습니다.";
                    secureError("Failed to load recipient", errorMsg);

                    setErrorModal({
                        isVisible: true,
                        message: getErrorMessage(errorMsg),
                    });
                }
            }
        );
    };

    // 에러 메시지를 사용자 친화적으로 변환
    const getErrorMessage = (error: string): string => {
        if (error.includes("찾을 수 없습니다") || error.includes("not found")) {
            return "메일 화면이 아닙니다!\n네이버 메일 작성 화면에서 다시 시도해주세요.";
        }
        if (error.includes("권한") || error.includes("permission")) {
            return "권한이 없습니다!\n익스텐션 권한 설정을 확인해주세요.";
        }
        if (error.includes("응답") || error.includes("timeout")) {
            return "응답이 없습니다!\n잠시 후 다시 시도해주세요.";
        }
        if (error.includes("비어") || error.includes("empty")) {
            return "내용이 비어있습니다!\n받는 사람을 입력한 후 시도해주세요.";
        }
        return "오류가 발생했습니다!\n다시 시도해주세요.";
    };

    // 키워드 추가 (POST /filter/keywords)
    const handleAddKeyword = async () => {
        if (!newKeyword.trim()) {
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

        if (excludedKeywords.includes(newKeyword.trim())) {
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

            setExcludedKeywords(res.data.filter_keywords || []);
            setNewKeyword("");
            setIsAddingKeyword(false);
            secureLog("Keyword added successfully");
        } catch (err) {
            secureError("Failed to add keyword", err);
            setErrorModal({
                isVisible: true,
                message: "키워드 추가에 실패했습니다!\n다시 시도해주세요.",
            });
        }
    };

    // 키워드 삭제 (PUT /filter/keywords)
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

            const updatedKeywords = excludedKeywords.filter((k) => k !== keywordToDelete);

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

            setExcludedKeywords(updatedKeywords);
            secureLog("Keyword deleted successfully");
        } catch (err) {
            secureError("Failed to delete keyword", err);
            setErrorModal({
                isVisible: true,
                message: "키워드 삭제에 실패했습니다!\n다시 시도해주세요.",
            });
        }
    };

    // 키워드 입력 중 엔터 키 처리
    const handleKeywordKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleAddKeyword();
        } else if (e.key === "Escape") {
            setNewKeyword("");
            setIsAddingKeyword(false);
        }
    };

    // 히스토리 이전으로 이동 (<)
    const handlePreviousHistory = () => {
        if (currentHistoryIndex > 0) {
            const newIndex = currentHistoryIndex - 1;
            setCurrentHistoryIndex(newIndex);
            const historyItem = history[newIndex];
            setMailContent(historyItem.result);
            setTitle(historyItem.title);
            setGuide(historyItem.guide);
            secureLog(`History navigation: ${newIndex + 1}/${history.length}`);
        }
    };

    // 히스토리 다음으로 이동 (>)
    const handleNextHistory = () => {
        if (currentHistoryIndex < history.length - 1) {
            const newIndex = currentHistoryIndex + 1;
            setCurrentHistoryIndex(newIndex);
            const historyItem = history[newIndex];
            setMailContent(historyItem.result);
            setTitle(historyItem.title);
            setGuide(historyItem.guide);
            secureLog(`History navigation: ${newIndex + 1}/${history.length}`);
        }
    };

    // 메일 검수 API 호출 (결과 받아오기)
    const handleGetResult = async () => {
        secureLog("Get result button clicked");

        if (!mailContent || !mailContent.trim()) {
            setErrorModal({
                isVisible: true,
                message: "내용이 비어있습니다!\n메일 내용을 입력해주세요.",
            });
            return;
        }

        setIsLoadingResult(true);

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

            const response = await axios.post(
                `${API_BASE_URL}/filter/`,
                {
                    email: recipient,
                    recipient: recipient,
                    title: title,
                    data: mailContent,
                    guide: guide,
                    option: option,
                    language: language,
                    filter_keywords: excludedKeywords,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            secureLog("Mail review completed");

            // API 응답 검증
            if (!validateMailReviewResponse(response.data)) {
                secureError("Invalid mail review response format");
                setErrorModal({
                    isVisible: true,
                    message: "서버 응답 오류!\n다시 시도해주세요.",
                });
                return;
            }

            // 결과를 메일 내용에 반영 및 히스토리에 추가
            if (response.data.result) {
                const result = response.data.result;

                // API 응답: { mail: "...", title: "..." }
                const resultMailContent = result.mail || "";
                const mailTitle = result.title || "";

                // 제목이 있으면 제목 필드에 설정
                if (mailTitle) {
                    setTitle(mailTitle);
                }

                // 히스토리에 추가 (mail 내용과 title 저장)
                const newHistoryItem: HistoryItem = {
                    guide: guide,
                    result: resultMailContent,
                    title: mailTitle,
                    timestamp: new Date(),
                };

                setHistory(prev => {
                    const newHistory = [...prev, newHistoryItem];
                    // 최신 히스토리로 인덱스 이동
                    setCurrentHistoryIndex(newHistory.length - 1);
                    return newHistory;
                });

                // 메일 내용 덮어쓰기
                setMailContent(resultMailContent);
                secureLog("Review result saved to history");
            }
        } catch (err) {
            secureError("Mail review failed", err);
            setErrorModal({
                isVisible: true,
                message: "메일 검수에 실패했습니다!\n다시 시도해주세요.",
            });
        } finally {
            setIsLoadingResult(false);
        }
    };

    // 최종 적용 - 익스텐션 내용을 메일 화면에 적용
    const handleApplyContent = () => {
        secureLog("Apply content button clicked");

        if (!mailContent || !mailContent.trim()) {
            setErrorModal({
                isVisible: true,
                message: "내용이 비어있습니다!\n적용할 내용을 입력해주세요.",
            });
            return;
        }

        chrome.runtime.sendMessage(
            { action: "applyContent", content: mailContent },
            (response) => {
                if (response?.success) {
                    secureLog("Content applied successfully");
                } else {
                    const errorMsg = response?.error || "메일 편집기를 찾을 수 없습니다.";
                    secureError("Failed to apply content", errorMsg);

                    setErrorModal({
                        isVisible: true,
                        message: getErrorMessage(errorMsg),
                    });
                }
            }
        );
    };

    return (
        <Backdrop>
            {isSmallScreen && (
                <WarningMessage>
                    화면이 너무 작습니다. 화면을 조금 더 넓혀주세요.
                </WarningMessage>
            )}
            <Container>
                <CloseButton onClick={() => window.close()} />
                <Header>
                    <Logo
                        size={32}
                        onClick={() => {
                            setLogoClickCount((prev) => {
                                const newCount = prev + 1;
                                if (newCount >= 4) {
                                    if (chrome?.storage?.local) {
                                        chrome.storage.local.clear().then(() => {
                                            secureLog("Logged out via logo clicks");
                                            window.location.reload();
                                        });
                                    }
                                    return 0;
                                }
                                return newCount;
                            });
                        }}
                    />
                    <span>DearAI</span>
                </Header>

                <Section>
                    <Row>
                        <Label style={{ width: "80px" }}>받는 사람</Label>
                        <Input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="받을 사람을 입력하세요."
                            style={{ flex: 1, maxWidth: "200px" }}
                        />
                        <SmallGreenButton onClick={() => navigate("/address")}>
                            주소록 보기
                        </SmallGreenButton>
                        <SmallGreenButton onClick={handleLoadRecipient}>
                            불러오기
                        </SmallGreenButton>
                    </Row>
                </Section>

                <Section>
                    <Row>
                        <Label style={{ width: "80px" }}>제목</Label>
                        <Input
                            type="text"
                            placeholder="메일 제목 입력"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ flex: 1, marginRight: "8px" }}
                        />
                        <InfoButton
                            onClick={() => setShowTooltip(true)}
                            title="메일 제목 작성 팁 보기"
                        >
                            ⓘ
                        </InfoButton>
                    </Row>
                    {/* Selection buttons for tone/style can be added below this line */}
                    <CheckboxGroup>
                        {[
                            "격식 있는",
                            "비공식적인",
                            "친근하게",
                            "예의 바르게",
                            "논리적인",
                            "재치있게",
                            "중립적인",
                            "단호하게",
                            "감성적인",
                        ].map((label, idx) => (
                            <CheckboxLabel key={idx}>
                                <input
                                    type="radio"
                                    name="tone"
                                    value={label}
                                    checked={option === label}
                                    onChange={(e) => setOption(e.target.value)}
                                />
                                {label}
                            </CheckboxLabel>
                        ))}
                    </CheckboxGroup>
                </Section>

                <Section>
                    <Row
                        style={{
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                        }}
                    >
                        <Label>내용</Label>
                        <LanguageSelect
                            style={{ width: "120px" }}
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            <option value="" disabled>
                                언어 선택
                            </option>
                            <option value="한국어">한국어</option>
                            <option value="영어">영어</option>
                        </LanguageSelect>
                    </Row>
                    <Textarea
                        placeholder="메일 본문 작성"
                        value={mailContent}
                        onChange={(e) => setMailContent(e.target.value)}
                    />
                </Section>

                <Section>
                    <Label>리터치</Label>
                    <Input
                        type="text"
                        placeholder="요청 사항을 입력해 주세요."
                        value={guide}
                        onChange={(e) => setGuide(e.target.value)}
                    />
                    <NavButtonGroup>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <NavButton
                                onClick={handlePreviousHistory}
                                disabled={currentHistoryIndex <= 0}
                                style={{
                                    opacity: currentHistoryIndex <= 0 ? 0.3 : 1,
                                    cursor: currentHistoryIndex <= 0 ? "not-allowed" : "pointer"
                                }}
                            >
                                &lt;
                            </NavButton>
                            <NavButton
                                onClick={handleNextHistory}
                                disabled={currentHistoryIndex >= history.length - 1}
                                style={{
                                    marginRight: 0,
                                    opacity: currentHistoryIndex >= history.length - 1 ? 0.3 : 1,
                                    cursor: currentHistoryIndex >= history.length - 1 ? "not-allowed" : "pointer"
                                }}
                            >
                                &gt;
                            </NavButton>
                            {history.length > 0 && (
                                <span style={{ fontSize: "0.85rem", color: "#666" }}>
                                    {currentHistoryIndex + 1} / {history.length}
                                </span>
                            )}
                        </div>
                        <ResultButton onClick={handleGetResult} disabled={isLoadingResult}>
                            {isLoadingResult ? "검수 중..." : "결과 받아오기"}
                        </ResultButton>
                    </NavButtonGroup>
                </Section>

                <Section>
                    <Label>제외 키워드</Label>
                    <TagGroup>
                        {excludedKeywords.map((keyword, idx) => (
                            <KeywordTag key={idx}>
                                {keyword}
                                <TagDeleteButton onClick={() => handleDeleteKeyword(keyword)}>×</TagDeleteButton>
                            </KeywordTag>
                        ))}
                        {isAddingKeyword ? (
                            <Input
                                type="text"
                                value={newKeyword}
                                onChange={(e) => setNewKeyword(e.target.value)}
                                onKeyDown={handleKeywordKeyPress}
                                onBlur={handleAddKeyword}
                                placeholder="키워드 입력"
                                autoFocus
                                style={{
                                    width: "80px",
                                    height: "28px",
                                    padding: "4px 8px",
                                    fontSize: "0.85rem",
                                }}
                            />
                        ) : (
                            <AddKeywordButton onClick={() => setIsAddingKeyword(true)}>+</AddKeywordButton>
                        )}
                    </TagGroup>
                </Section>

                <Footer style={{ justifyContent: "center", marginTop: "12px" }}>
                    <FinalButton onClick={handleApplyContent}>
                        <WhiteLogo src="/logo.png" />
                        최종 적용
                    </FinalButton>
                </Footer>
            </Container>

            {/* Tooltip */}
            <Tooltip isVisible={showTooltip} onClose={() => setShowTooltip(false)} />

            {/* Error Modal */}
            <ErrorModal
                isVisible={errorModal.isVisible}
                onClose={() =>
                    setErrorModal({ isVisible: false, message: "" })
                }
                message={errorModal.message}
            />
        </Backdrop>
    );
};

export default Modal;
