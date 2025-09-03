import React from "react";
import {
    Backdrop,
    Container,
    Header,
    Section,
    Label,
    Input,
    Textarea,
    Footer,
    Button,
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
    CarIcon,
    WarningMessage,
    Row,
    CheckboxGroup,
    NavButtonGroup,
    TagGroup,
    WhiteLogo,
} from "../styles/ModalStyles";

export const Modal = () => {
    const [isSmallScreen, setIsSmallScreen] = React.useState(
        window.innerWidth < 320
    );

    React.useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 320);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Backdrop>
            {isSmallScreen && (
                <WarningMessage>
                    화면이 너무 작습니다. 화면을 조금 더 넓혀주세요.
                </WarningMessage>
            )}
            <Container>
                <CloseButton onClick={() => console.log("close modal")}>
                    ×
                </CloseButton>
                <Header>
                    <Logo src="/logo.png" alt="logo" />
                    <span>DearAI</span>
                </Header>

                <Section>
                    <Row>
                        <Label style={{ width: "80px" }}>받는 사람</Label>
                        <RecipientSelect>
                            <option disabled selected>
                                받을 친구를 선택하세요.
                            </option>
                            <option>친구1@example.com</option>
                            <option>친구2@example.com</option>
                        </RecipientSelect>
                        <SmallGreenButton>주소록 보기</SmallGreenButton>
                        <SmallGreenButton>불러오기</SmallGreenButton>
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

                <Footer style={{ justifyContent: "center", marginTop: "16px" }}>
                    <FinalButton>
                        <WhiteLogo src="/logo.png" />
                        최종 적용
                    </FinalButton>
                </Footer>
            </Container>
        </Backdrop>
    );
};
