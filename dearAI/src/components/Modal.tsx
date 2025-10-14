import Login from "./Login";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Backdrop,
    Container,
    Header,
    Section,
    Label,
    Input,
    Textarea,
    Footer,
    CloseButton,
    Logo,
    RecipientSelect,
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
    const [isSmallScreen, setIsSmallScreen] = React.useState(
        window.innerWidth < 320
    );
    const [logoClickCount, setLogoClickCount] = React.useState(0);
    const [recipientEmail, setRecipientEmail] = React.useState("");
    const [subjectText, setSubjectText] = React.useState("");
    const [bodyText, setBodyText] = React.useState("");
    const [extraRecipients, setExtraRecipients] = React.useState<string[]>([]);

    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    React.useEffect(() => {
        // ✅ 1. 창이 새로 열리면 바로 accessToken 체크
        const checkTokenImmediately = async () => {
            const result = await chrome.storage.local.get("accessToken");
            if (result.accessToken) {
                console.log(
                    "✅ Found accessToken on startup, switching UI immediately"
                );
                setIsLoggedIn(true);
            }
        };
        checkTokenImmediately();

        // ✅ 2. storage 변경 감지 (fallback)
        const handleStorageChange = (
            changes: { [key: string]: chrome.storage.StorageChange },
            area: string
        ) => {
            if (area === "local" && changes.accessToken?.newValue) {
                console.log(
                    "✅ accessToken added — switching UI to main modal"
                );
                setIsLoggedIn(true);
            }
        };
        chrome.storage.onChanged.addListener(handleStorageChange);

        // ✅ 3. background에서 메시지 수신 (즉시 반응)
        const handleLoginMessage = (message: { action?: string }) => {
            if (message.action === "loginSuccess") {
                console.log(
                    "✅ Received loginSuccess message — switching immediately"
                );
                setIsLoggedIn(true);
            }
        };
        chrome.runtime.onMessage.addListener(handleLoginMessage);

        // ✅ 4. cleanup
        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
            chrome.runtime.onMessage.removeListener(handleLoginMessage);
        };
    }, []);

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

    const pickFirstEmail = (raw: string | undefined | null) => {
        if (!raw) return "";
        const m = String(raw).match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
        return m ? m[0] : "";
    };

    const sendMessageAsync = <T = unknown, R = unknown>(
        message: T
    ): Promise<R | null> => {
        return new Promise((resolve) => {
            try {
                if (!chrome?.runtime?.sendMessage) {
                    console.warn(
                        "⚠️ chrome.runtime.sendMessage is not available"
                    );
                    resolve(null);
                    return;
                }
                chrome.runtime.sendMessage(message, (response: R) => {
                    if (chrome.runtime.lastError) {
                        console.warn(
                            "⚠️ Message port closed or error (ignored):",
                            chrome.runtime.lastError.message
                        );
                        resolve(null);
                        return;
                    }
                    resolve(response);
                });
            } catch (err) {
                console.error("💥 sendMessageAsync failed:", err);
                resolve(null);
            }
        });
    };

    const handleExtractMail = async () => {
        try {
            // Define response/data types to satisfy TypeScript
            type ExtractMailData = {
                subject?: string;
                to?: string;
                body?: string;
                attachments?: string[];
            };

            type ExtractMailResponse = {
                data?: ExtractMailData;
                error?: string;
            };

            const response = await sendMessageAsync<
                unknown,
                ExtractMailResponse
            >({
                action: "extractMailData",
            });

            if (!response) {
                alert("메일 데이터를 가져오지 못했습니다.");
                return;
            }

            if (response.error) {
                alert("메일 데이터를 불러오지 못했습니다.");
                console.error("Error from background:", response.error);
                return;
            }

            const data = response.data;
            if (!data) {
                alert("메일 데이터를 가져오지 못했습니다.");
                return;
            }

            const nextSubject = (data?.subject || "").trim();
            const nextBody = (data?.body || "").trim();
            const nextTo = pickFirstEmail(data?.to);

            if (nextSubject && nextBody && nextTo) {
                setSubjectText(nextSubject);
                setBodyText(nextBody);
                setRecipientEmail(nextTo);
                setExtraRecipients((prev) =>
                    prev.includes(nextTo) ? prev : [...prev, nextTo]
                );
                console.log("📩 추출된 메일 데이터:", {
                    nextTo,
                    nextSubject,
                    nextBody,
                });
            } else {
                console.warn("필수 정보가 부족합니다:", data);
                alert(
                    "필수 정보(받는 사람/제목/내용)가 모두 있어야 불러옵니다."
                );
            }
        } catch (err) {
            console.error("Message send failed:", err);
            alert("메일 데이터를 불러오지 못했습니다.");
        }
    };

    return (
        <Backdrop>
            {!isLoggedIn ? (
                <Login />
            ) : (
                <>
                    {isSmallScreen && (
                        <WarningMessage>
                            화면이 너무 작습니다. 화면을 조금 더 넓혀주세요.
                        </WarningMessage>
                    )}
                    <Container>
                        <CloseButton onClick={() => window.close()}>
                            ×
                        </CloseButton>
                        <Header>
                            <Logo
                                src="/logo.png"
                                alt="logo"
                                onClick={() => {
                                    setLogoClickCount((prev) => {
                                        const newCount = prev + 1;
                                        if (newCount >= 4) {
                                            if (chrome?.storage?.local) {
                                                chrome.storage.local.clear(
                                                    () => {
                                                        console.log(
                                                            "Logged out via logo clicks"
                                                        );
                                                        window.location.reload();
                                                    }
                                                );
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
                                <Label style={{ width: "80px" }}>
                                    받는 사람
                                </Label>
                                <RecipientSelect
                                    value={recipientEmail}
                                    onChange={(e) =>
                                        setRecipientEmail(e.target.value)
                                    }
                                >
                                    <option value="" disabled>
                                        받을 친구를 선택하세요.
                                    </option>
                                    <option value="친구1@example.com">
                                        친구1@example.com
                                    </option>
                                    <option value="친구2@example.com">
                                        친구2@example.com
                                    </option>
                                    {extraRecipients.map((email) => (
                                        <option key={email} value={email}>
                                            {email}
                                        </option>
                                    ))}
                                </RecipientSelect>
                                <SmallGreenButton
                                    onClick={() => navigate("/address")}
                                >
                                    주소록 보기
                                </SmallGreenButton>
                                <SmallGreenButton onClick={handleExtractMail}>
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
                                    value={subjectText}
                                    onChange={(e) =>
                                        setSubjectText(e.target.value)
                                    }
                                    style={{ flex: 1, marginRight: "8px" }}
                                />
                                <InfoButton title="메일 제목 어떻게 지어야 하나요?">
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
                                        <input type="radio" name="tone" />
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
                                <LanguageSelect style={{ width: "120px" }}>
                                    <option disabled selected>
                                        언어 선택
                                    </option>
                                    <option>한국어</option>
                                    <option>영어</option>
                                </LanguageSelect>
                            </Row>
                            <Textarea
                                placeholder="메일 본문 작성"
                                value={bodyText}
                                onChange={(e) => setBodyText(e.target.value)}
                            />
                        </Section>

                        <Section>
                            <Label>리터치</Label>
                            <Input
                                type="text"
                                placeholder="요청 사항을 입력해 주세요."
                            />
                            <NavButtonGroup>
                                <div>
                                    <NavButton>&lt;</NavButton>
                                    <NavButton style={{ marginRight: 0 }}>
                                        &gt;
                                    </NavButton>
                                </div>
                                <ResultButton>결과 받아오기</ResultButton>
                            </NavButtonGroup>
                        </Section>

                        <Section>
                            <Label>제외 키워드</Label>
                            <TagGroup>
                                {["진짜", "레알", "에바"].map(
                                    (keyword, idx) => (
                                        <KeywordTag key={idx}>
                                            {keyword}
                                            <TagDeleteButton>×</TagDeleteButton>
                                        </KeywordTag>
                                    )
                                )}
                                <AddKeywordButton>+</AddKeywordButton>
                            </TagGroup>
                        </Section>

                        <Footer
                            style={{
                                justifyContent: "center",
                                marginTop: "12px",
                            }}
                        >
                            <FinalButton>
                                <WhiteLogo src="/logo.png" />
                                최종 적용
                            </FinalButton>
                        </Footer>
                    </Container>
                </>
            )}
        </Backdrop>
    );
};

export default Modal;
