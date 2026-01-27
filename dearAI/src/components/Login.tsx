interface ChromeStorage {
    local: {
        get: (
            keys: string[],
            callback: (
                result: {
                    [key: string]: string | undefined;
                } & {
                    accessToken?: string;
                    refreshToken?: string;
                }
            ) => void
        ) => void;
        set: (items: { [key: string]: string }, callback?: () => void) => void;
    };
}

interface ChromeRuntime {
    sendMessage: (
        message: { action: string },
        responseCallback?: (response: { status: string }) => void
    ) => void;
}

declare const chrome: {
    storage: ChromeStorage;
    runtime: ChromeRuntime;
};
import { useState } from "react";
import { secureLog, secureError } from "../utils/security";
import Modal from "./Modal";
import Logo from "./Logo";
import CloseButton from "./CloseButton";
import {
    LoginBackdrop,
    LoginContainer,
    LoginTitle,
    LoginText,
    GoogleLoginImage,
    LogoRow,
    PrivacyRow,
    PrivacyCheckbox,
    PrivacyLink,
    PrivacyOverlay,
    PrivacyModalBox,
    PrivacyModalTitle,
    PrivacyModalContent,
    PrivacyModalClose,
} from "../styles/LoginStyles";

const PRIVACY_POLICY_TEXT = `DearAI(이하 "서비스")는 이메일 발송 전 검수 기능을 제공하기 위하여, 아래와 같이 개인정보를 수집·이용합니다. 사용자는 본 동의서를 충분히 읽고 이해한 후 동의 여부를 선택할 수 있으며, 동의하지 않을 경우 서비스 이용이 제한될 수 있습니다.

서비스는 사용자의 명시적인 동의 및 이용 목적 범위 내에서만 개인정보를 수집·이용하며, 관련 법령 및 Chrome Web Store 개발자 프로그램 정책을 준수합니다.

1. 수집하는 개인정보 항목

서비스는 다음과 같은 개인정보를 수집할 수 있습니다. Google 계정을 통한 로그인 시 사용자 식별을 위한 이메일 주소 및 기본 프로필 정보, 이메일 검수 요청 시 사용자가 작성한 이메일 제목 및 본문 내용, 서비스 이용 과정에서 사용자가 설정한 검수 옵션 및 제외 키워드와 같은 서비스 설정 정보가 이에 해당합니다.

2. 개인정보의 수집 및 이용 목적

수집된 개인정보는 이메일 발송 전 검수 기능 제공을 위한 목적으로만 사용됩니다. 구체적으로는 사용자 인증 및 세션 관리, 이메일 내용 분석 및 AI 기반 검수 결과 제공, 사용자별 검수 환경 설정 유지에 활용됩니다. 서비스는 수집된 개인정보를 광고, 마케팅, 사용자 추적 등의 목적에 사용하지 않습니다.

3. 개인정보의 보유 및 이용 기간

서비스는 개인정보를 수집·이용 목적 달성 시까지 또는 수집일로부터 최대 1년간 보유 및 이용합니다. 보유 기간이 경과하거나 이용 목적이 달성된 개인정보는 지체 없이 안전한 방법으로 삭제됩니다. 단, 관계 법령에 따라 일정 기간 보관이 필요한 정보는 해당 법령에서 정한 기간 동안 보관될 수 있습니다.

4. 개인정보의 국외 이전에 관한 사항

서비스는 이메일 검수 기능 제공을 위하여 국외에 위치한 외부 AI 서비스 제공업체의 시스템을 이용할 수 있으며, 이 과정에서 사용자가 작성한 이메일 내용이 일시적으로 국외로 이전되어 처리될 수 있습니다. 이전되는 개인정보는 이메일 검수 결과 생성을 위한 최소한의 정보에 한정되며, 검수 처리 목적 외의 용도로는 사용되지 않습니다.

국외 이전되는 개인정보는 검수 요청 처리 후 즉시 파기되거나 결과 생성에 필요한 기간 동안만 일시적으로 처리되며, 서비스는 해당 정보가 광고, 재판매, 독립적인 사용자 식별 또는 프로파일링 목적으로 사용되지 않도록 관리합니다.

5. 개인정보의 제3자 제공 여부

서비스는 원칙적으로 사용자의 개인정보를 제3자에게 제공하거나 판매하지 않습니다. 다만, 이메일 검수 기능 수행을 위해 국외 AI 서비스 제공업체를 통한 처리 과정이 포함될 수 있으며, 이는 개인정보 처리 위탁에 해당합니다. 서비스는 해당 처리 과정이 개인정보 보호 관련 법령을 준수하도록 관리합니다.

6. 이용자의 권리

사용자는 언제든지 개인정보 수집 및 이용에 대한 동의를 철회할 수 있으며, 개인정보 열람, 수정, 삭제를 요청할 수 있습니다. 동의 철회 또는 삭제 요청 시 일부 서비스 기능 이용이 제한될 수 있습니다.

7. 동의 거부 시 불이익

개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으며, 다만 동의하지 않을 경우 이메일 검수 및 개인화된 서비스 제공이 불가능할 수 있습니다.

본인은 위 내용을 충분히 이해하였으며, 개인정보 수집 및 이용에 동의합니다.`;

const Login: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
    const [showModal] = useState(false);
    const [privacyAgreed, setPrivacyAgreed] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    const handleLogin = () => {
        if (!privacyAgreed) return;

        secureLog("Google login button clicked");

        try {
            let responded = false;
            const watchdog = setTimeout(() => {
                if (!responded) {
                    secureLog("No response from background - timeout");
                }
            }, 4000);

            chrome.runtime.sendMessage(
                { action: "login" },
                (_response) => {
                    responded = true;
                    clearTimeout(watchdog);
                    secureLog("Login response received");

                    chrome.storage.local.get(
                        ["accessToken", "refreshToken"],
                        (result) => {
                            secureLog("Token check completed", {
                                hasAccessToken: Boolean(result?.accessToken),
                                hasRefreshToken: Boolean(result?.refreshToken),
                            }, true);

                            if (result && result.accessToken) {
                                secureLog("Login successful");
                                onClose?.();
                            } else {
                                secureLog("Waiting for OAuth completion");
                            }
                        }
                    );
                }
            );
        } catch (e) {
            secureError("Login error", e);
        }
    };

    return (
        <LoginBackdrop>
            <LoginContainer>
                <CloseButton onClick={() => window.close()} />
                <LogoRow>
                    <Logo size={40} />
                    <LoginTitle>DearAI</LoginTitle>
                </LogoRow>
                <LoginText>
                    안녕하세요! <br />
                    서비스 이용을 위해 로그인이 필요합니다. 😊 <br />
                    <span>Google 계정으로 빠르게 시작해 볼까요?</span>
                </LoginText>
                <PrivacyRow>
                    <PrivacyCheckbox
                        type="checkbox"
                        checked={privacyAgreed}
                        onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    />
                    <span>
                        <PrivacyLink onClick={(e) => { e.preventDefault(); setShowPrivacyModal(true); }}>
                            개인정보 수집 및 이용 동의서
                        </PrivacyLink>
                        에 동의합니다.
                    </span>
                </PrivacyRow>
                <GoogleLoginImage
                    src="/google.png"
                    alt="Google Login"
                    disabled={!privacyAgreed}
                    onClick={handleLogin}
                />
            </LoginContainer>
            {showModal && <Modal />}
            {showPrivacyModal && (
                <PrivacyOverlay onClick={() => setShowPrivacyModal(false)}>
                    <PrivacyModalBox onClick={(e) => e.stopPropagation()}>
                        <PrivacyModalTitle>개인정보 수집 및 이용 동의서</PrivacyModalTitle>
                        <PrivacyModalContent>{PRIVACY_POLICY_TEXT}</PrivacyModalContent>
                        <PrivacyModalClose onClick={() => setShowPrivacyModal(false)}>
                            확인
                        </PrivacyModalClose>
                    </PrivacyModalBox>
                </PrivacyOverlay>
            )}
        </LoginBackdrop>
    );
};

export default Login;
