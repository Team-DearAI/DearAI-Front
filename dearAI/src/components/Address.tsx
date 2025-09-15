import { useNavigate } from "react-router-dom";
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
} from "../styles/AddressStyles";

export default function Address() {
    const navigate = useNavigate();

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 999,
            }}
        >
            <ModalContainer>
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

                <AddressHeaderBar>
                    <div
                        style={{
                            display: "flex",
                            gap: "20px",
                            color: "white",
                            fontWeight: "bold",
                        }}
                    >
                        <div>그룹 ▾</div>
                        <div>이름</div>
                        <div>메일 주소</div>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <SearchInput placeholder="검색어를 입력해 주세요.." />
                        <AddButton>+ 주소 추가</AddButton>
                    </div>
                </AddressHeaderBar>

                <InnerContainer>
                    <AddressTable>
                        <AddressBody>
                            {[
                                ["교수님", "김교수", "kimprof@univmail.edu"],
                                [
                                    "공모전",
                                    "클라우드",
                                    "cloudidea@contesthub.org",
                                ],
                                ["친구", "박찰리", "charliepark@friend.com"],
                                ["친구", "구슬이", "imchoy@chocho.me"],
                                ["친구", "친한", "clsgks@daum.net"],
                                ["교수님", "최연구", "choiresearch@kmu.ac.kr"],
                                [
                                    "공모전",
                                    "공공정보",
                                    "publicinfo@ideaexpo.net",
                                ],
                                ["친구", "한결이", "hangyul@buddyzone.co.kr"],
                                ["친구", "스티브", "steve@minecraft.io"],
                            ].map(([group, name, email], index) => (
                                <AddressRow key={index}>
                                    <AddressCell>{group}</AddressCell>
                                    <AddressCell>{name}</AddressCell>
                                    <AddressCell>{email}</AddressCell>
                                    <AddressCell>
                                        <SendMailButton
                                            onClick={() => navigate("/modal")}
                                        >
                                            메일 보내기
                                        </SendMailButton>
                                        <EditButton>수정</EditButton>
                                        <DeleteButton>삭제</DeleteButton>
                                    </AddressCell>
                                </AddressRow>
                            ))}
                        </AddressBody>
                    </AddressTable>
                </InnerContainer>
            </ModalContainer>
        </div>
    );
}
