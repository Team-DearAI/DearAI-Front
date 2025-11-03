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
} from "../styles/LoginStyles";

const Login: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
    const [showModal] = useState(false);
    return (
        <LoginBackdrop>
            <LoginContainer>
                <CloseButton onClick={() => onClose?.()} />
                <LogoRow>
                    <Logo size={40} />
                    <LoginTitle>DearAI</LoginTitle>
                </LogoRow>
                <LoginText>
                    안녕하세요! <br />
                    서비스 이용을 위해 로그인이 필요합니다. 😊 <br />
                    <span>Google 계정으로 빠르게 시작해 볼까요?</span>
                </LoginText>
                <GoogleLoginImage
                    src="/google.png"
                    alt="Google Login"
                    onClick={() => {
                        const startedAt = Date.now();
                        console.log(
                            "[Login][STEP 0] Google button clicked at",
                            new Date(startedAt).toISOString()
                        );

                        try {
                            console.log(
                                "[Login][DEBUG] chrome.runtime object:",
                                chrome.runtime
                            );
                            console.log(
                                "[Login][DEBUG] typeof chrome.runtime.sendMessage:",
                                typeof chrome.runtime.sendMessage
                            );

                            console.log(
                                "[Login][STEP 1] Sending message to background: { action: 'login' }"
                            );
                            let responded = false;
                            const watchdog = setTimeout(() => {
                                if (!responded) {
                                    console.warn(
                                        "[Login][WATCHDOG] No response from background after 4s. Check if background is active and 'runtime.onMessage' listener is registered."
                                    );
                                }
                            }, 4000);

                            chrome.runtime.sendMessage(
                                { action: "login" },
                                (response) => {
                                    console.log(
                                        "[Login][DEBUG] sendMessage callback triggered with:",
                                        response
                                    );
                                    responded = true;
                                    clearTimeout(watchdog);
                                    const elapsed = Date.now() - startedAt;
                                    console.log(
                                        "[Login][STEP 2] Response from background after",
                                        elapsed,
                                        "ms:",
                                        response
                                    );

                                    // Immediately check storage for tokens
                                    console.log(
                                        "[Login][STEP 3] Reading tokens from chrome.storage.local..."
                                    );
                                    console.log(
                                        "[Login][DEBUG] Checking chrome.storage.local existence:",
                                        chrome.storage?.local
                                    );
                                    chrome.storage.local.get(
                                        ["accessToken", "refreshToken"],
                                        (result) => {
                                            console.log(
                                                "[Login][DEBUG] chrome.storage.local.get callback triggered with raw result:",
                                                result
                                            );
                                            console.log(
                                                "[Login][STEP 4] Tokens read:",
                                                {
                                                    hasAccessToken: Boolean(
                                                        result?.accessToken
                                                    ),
                                                    hasRefreshToken: Boolean(
                                                        result?.refreshToken
                                                    ),
                                                    raw: result,
                                                }
                                            );

                                            if (result && result.accessToken) {
                                                console.log(
                                                    "[Login][STEP 5] accessToken detected — closing login modal."
                                                );
                                                onClose?.();
                                            } else {
                                                console.warn(
                                                    "[Login][STEP 5] No accessToken yet. The OAuth window may still be pending, or the flow failed. Inspect background console for launchWebAuthFlow logs."
                                                );
                                            }
                                        }
                                    );
                                }
                            );
                        } catch (e) {
                            console.error(
                                "[Login][ERROR] Exception during click handler:",
                                e
                            );
                        }
                        console.log(
                            "[Login][TRACE] Login click handler completed execution at",
                            new Date().toISOString()
                        );
                    }}
                />
            </LoginContainer>
            {showModal && <Modal />}
        </LoginBackdrop>
    );
};

export default Login;
