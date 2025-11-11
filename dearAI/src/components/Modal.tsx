declare const chrome: {
    storage: {
        local: {
            clear: (callback?: () => void) => void;
        };
    };
    runtime: {
        sendMessage: (
            message: { action: string },
            responseCallback?: (response: {
                success?: boolean;
                recipient?: string;
                error?: string;
                status?: string;
            }) => void
        ) => void;
    };
};
import React from "react";
import { useNavigate } from "react-router-dom";
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
    const [isSmallScreen, setIsSmallScreen] = React.useState(
        window.innerWidth < 320
    );
    const [logoClickCount, setLogoClickCount] = React.useState(0);
    const [recipient, setRecipient] = React.useState<string>("");
    const [showTooltip, setShowTooltip] = React.useState(false);
    const [errorModal, setErrorModal] = React.useState<{
        isVisible: boolean;
        message: string;
    }>({
        isVisible: false,
        message: "",
    });

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

    // 네이버 메일 화면에서 받는 사람 정보 불러오기
    const handleLoadRecipient = () => {
        console.log("[Modal] Sending getRecipient message to background");

        chrome.runtime.sendMessage(
            { action: "getRecipient" },
            (response) => {
                console.log("[Modal] Response from background:", response);

                if (response?.success && response.recipient) {
                    setRecipient(response.recipient);
                    console.log("받는 사람 불러오기 성공:", response.recipient);
                    // 성공 시 자동으로 입력창에 채워짐
                } else {
                    const errorMsg = response?.error || "받는 사람 정보를 찾을 수 없습니다.";
                    console.error("받는 사람 불러오기 실패:", errorMsg);

                    // 에러 모달 표시
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
                                        chrome.storage.local.clear(() => {
                                            console.log(
                                                "Logged out via logo clicks"
                                            );
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
                    <Textarea placeholder="메일 본문 작성" />
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
                        {["진짜", "레알", "에바"].map((keyword, idx) => (
                            <KeywordTag key={idx}>
                                {keyword}
                                <TagDeleteButton>×</TagDeleteButton>
                            </KeywordTag>
                        ))}
                        <AddKeywordButton>+</AddKeywordButton>
                    </TagGroup>
                </Section>

                <Footer style={{ justifyContent: "center", marginTop: "12px" }}>
                    <FinalButton>
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
