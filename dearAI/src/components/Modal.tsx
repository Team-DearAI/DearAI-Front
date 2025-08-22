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
} from "../styles/ModalStyles";

export const Modal = () => {
    return (
        <Backdrop>
            <Container>
                <CloseButton onClick={() => console.log("close modal")}>
                    ×
                </CloseButton>
                <Header>
                    <img
                        src="/logo.png"
                        alt="logo"
                        style={{ width: "32px", marginRight: "8px" }}
                    />
                    <span>DearAI</span>
                </Header>

                <Section>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "8px",
                        }}
                    >
                        <Label style={{ width: "80px" }}>받는 사람</Label>
                        <select
                            style={{
                                flex: 1,
                                padding: "8px 12px",
                                borderRadius: "6px",
                                border: "1px solid #ccc",
                                marginRight: "8px",
                            }}
                        >
                            <option disabled selected>
                                받을 친구를 선택하세요..
                            </option>
                            <option>친구1@example.com</option>
                            <option>친구2@example.com</option>
                        </select>
                        <button
                            style={{
                                padding: "8px 12px",
                                backgroundColor: "#82e0bb",
                                border: "none",
                                borderRadius: "6px",
                                color: "#fff",
                                cursor: "pointer",
                                marginRight: "6px",
                            }}
                        >
                            주소록 보기
                        </button>
                        <button
                            style={{
                                padding: "8px 12px",
                                backgroundColor: "#82e0bb",
                                border: "none",
                                borderRadius: "6px",
                                color: "#fff",
                                cursor: "pointer",
                            }}
                        >
                            불러오기
                        </button>
                    </div>
                </Section>

                <Section>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "8px",
                        }}
                    >
                        <Label style={{ width: "80px" }}>제목</Label>
                        <Input
                            type="text"
                            placeholder="메일 제목 입력"
                            style={{ flex: 1, marginRight: "8px" }}
                        />
                        <button
                            style={{
                                background: "none",
                                border: "none",
                                color: "#82e0bb",
                                fontSize: "1.2rem",
                                cursor: "pointer",
                            }}
                            title="메일 제목 어떻게 지어야 하나요?"
                        >
                            ⓘ
                        </button>
                    </div>
                    {/* Selection buttons for tone/style can be added below this line */}
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                            marginLeft: "80px",
                        }}
                    >
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
                            <label
                                key={idx}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    fontSize: "0.9rem",
                                }}
                            >
                                <input type="checkbox" />
                                {label}
                            </label>
                        ))}
                        <select
                            style={{
                                padding: "8px",
                                borderRadius: "6px",
                                border: "1px solid #ccc",
                                fontSize: "0.9rem",
                            }}
                        >
                            <option disabled selected>
                                언어 선택
                            </option>
                            <option>한국어</option>
                            <option>영어</option>
                        </select>
                    </div>
                </Section>

                <Section>
                    <Label>내용</Label>
                    <Textarea placeholder="메일 본문 작성" />
                </Section>

                <Section>
                    <Label>리터치</Label>
                    <Input
                        type="text"
                        placeholder="요청 사항을 입력해 주세요."
                    />
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "12px",
                        }}
                    >
                        <div>
                            <button
                                style={{
                                    padding: "6px 10px",
                                    marginRight: "6px",
                                    borderRadius: "6px",
                                    border: "none",
                                    backgroundColor: "#ccc",
                                    cursor: "pointer",
                                }}
                            >
                                &lt;
                            </button>
                            <button
                                style={{
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    border: "none",
                                    backgroundColor: "#ccc",
                                    cursor: "pointer",
                                }}
                            >
                                &gt;
                            </button>
                        </div>
                        <button
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#82e0bb",
                                border: "none",
                                borderRadius: "6px",
                                color: "#fff",
                                cursor: "pointer",
                            }}
                        >
                            결과 받아오기
                        </button>
                    </div>
                </Section>

                <Section>
                    <Label>제외 키워드</Label>
                    <div
                        style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                        }}
                    >
                        {["진짜", "레알", "에바"].map((keyword, idx) => (
                            <span
                                key={idx}
                                style={{
                                    backgroundColor: "#eee",
                                    padding: "6px 12px",
                                    borderRadius: "16px",
                                    fontSize: "0.9rem",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                }}
                            >
                                {keyword}
                                <button
                                    style={{
                                        background: "none",
                                        border: "none",
                                        fontSize: "0.9rem",
                                        cursor: "pointer",
                                    }}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                        <button
                            style={{
                                padding: "0 12px",
                                fontSize: "1.2rem",
                                borderRadius: "16px",
                                border: "1px solid #ccc",
                                background: "none",
                                cursor: "pointer",
                            }}
                        >
                            +
                        </button>
                    </div>
                </Section>

                <Footer style={{ justifyContent: "center", marginTop: "16px" }}>
                    <Button
                        style={{
                            backgroundColor: "#82e0bb",
                            padding: "12px 24px",
                            fontSize: "1rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <img src="/car-icon.png" style={{ width: "20px" }} />
                        최종 적용
                    </Button>
                </Footer>
            </Container>
        </Backdrop>
    );
};
