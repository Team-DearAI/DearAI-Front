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

interface Port {
    name: string;
    postMessage: (message: unknown) => void;
    disconnect: () => void;
    onMessage: { addListener: (cb: (msg: unknown) => void) => void };
    onDisconnect: { addListener: (cb: () => void) => void };
}

interface ChromeRuntime {
    sendMessage: (
        message: { action: string; [key: string]: unknown },
        responseCallback?: (response: unknown) => void
    ) => void;
    connect: (connectInfo?: { name?: string }) => Port;
    lastError?: { message?: string };
}

declare const chrome: {
    storage: ChromeStorage;
    runtime: ChromeRuntime;
};
import { useState } from "react";
import Modal from "./Modal";
import {
    LoginBackdrop,
    LoginContainer,
    LoginLogo,
    LoginTitle,
    LoginText,
    CloseButton,
    GoogleLoginImage,
    LogoRow,
} from "../styles/LoginStyles";

const ts = () => new Date().toISOString();
const logL = (...args: unknown[]) => console.log(`[Login ${ts()}]`, ...args);
const warnL = (...args: unknown[]) => console.warn(`[Login ${ts()}]`, ...args);
const errL = (...args: unknown[]) => console.error(`[Login ${ts()}]`, ...args);

const Login: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
    const [showModal] = useState(false);
    return (
        <LoginBackdrop>
            <LoginContainer>
                <CloseButton onClick={() => onClose?.()}>x</CloseButton>
                <LogoRow>
                    <LoginLogo src="/logo.png" alt="logo" />
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
                        logL("🟢 Google login button clicked");
                        try {
                            const reqId = `login-${Date.now()}-${Math.random()
                                .toString(16)
                                .slice(2, 8)}`;
                            const started = performance.now();

                            // Step 1: Wake up background with ping
                            logL(
                                "🟡 Sending ping to wake background service worker...",
                                { reqId }
                            );
                            chrome.runtime.sendMessage(
                                { action: "ping" },
                                () => {
                                    if (chrome.runtime.lastError) {
                                        warnL(
                                            "⚠️ Background may still be sleeping:",
                                            chrome.runtime.lastError.message,
                                            { reqId }
                                        );
                                    } else {
                                        logL(
                                            "✅ Background responded to ping. Preparing to connect...",
                                            {
                                                reqId,
                                            }
                                        );
                                    }

                                    // Step 2: Delay to ensure background ready
                                    setTimeout(() => {
                                        logL(
                                            "🟡 Establishing port connection to background after ping delay...",
                                            { reqId }
                                        );

                                        const port = chrome.runtime.connect({
                                            name: "login-port",
                                        });

                                        port.onDisconnect.addListener(() => {
                                            const elapsed = Math.round(
                                                performance.now() - started
                                            );
                                            if (
                                                chrome.runtime?.lastError
                                                    ?.message
                                            ) {
                                                errL(
                                                    "🔴 Port disconnected with lastError:",
                                                    chrome.runtime.lastError
                                                        .message,
                                                    {
                                                        reqId,
                                                        elapsedMs: elapsed,
                                                    }
                                                );
                                            } else {
                                                warnL(
                                                    "🟠 Port disconnected (no lastError).",
                                                    {
                                                        reqId,
                                                        elapsedMs: elapsed,
                                                    }
                                                );
                                            }
                                        });

                                        // 8초 동안 응답이 없으면 워치독 경고
                                        let firstResponse = false;
                                        const watchdog = setTimeout(() => {
                                            if (!firstResponse) {
                                                warnL(
                                                    "⏰ No response from background within 8s. Service worker may be cold/suspended.",
                                                    { reqId }
                                                );
                                            }
                                        }, 8000);

                                        port.onMessage.addListener(
                                            (response: unknown) => {
                                                firstResponse = true;
                                                clearTimeout(watchdog);
                                                const elapsed = Math.round(
                                                    performance.now() - started
                                                );

                                                logL(
                                                    "📨 Message from background:",
                                                    response,
                                                    {
                                                        reqId,
                                                        elapsedMs: elapsed,
                                                    }
                                                );
                                                if (
                                                    typeof response ===
                                                        "object" &&
                                                    response !== null &&
                                                    "success" in response &&
                                                    Boolean(
                                                        (
                                                            response as Record<
                                                                string,
                                                                unknown
                                                            >
                                                        ).success
                                                    )
                                                ) {
                                                    logL(
                                                        "🟢 Login success reported by background.",
                                                        response,
                                                        { reqId }
                                                    );
                                                } else {
                                                    warnL(
                                                        "⚠️ Background reported non-success or different payload.",
                                                        response,
                                                        { reqId }
                                                    );
                                                }

                                                // accessToken이 오면 모달 종료
                                                if (
                                                    typeof response ===
                                                        "object" &&
                                                    response !== null &&
                                                    "accessToken" in response &&
                                                    typeof (
                                                        response as Record<
                                                            string,
                                                            unknown
                                                        >
                                                    ).accessToken === "string"
                                                ) {
                                                    logL(
                                                        "🔐 Access token received via port. Closing modal.",
                                                        { reqId }
                                                    );
                                                    onClose?.();
                                                    return;
                                                }
                                            }
                                        );

                                        // 백그라운드로 로그인 요청 전송
                                        logL(
                                            "📤 Posting login action to background through port...",
                                            {
                                                reqId,
                                            }
                                        );
                                        port.postMessage({
                                            action: "login",
                                            reqId,
                                        });

                                        // (선택) 스토리지 폴링도 병행하여 상태 추적
                                        logL(
                                            "🔎 Start polling chrome.storage.local for accessToken (10 tries x 500ms).",
                                            { reqId }
                                        );
                                        let attempts = 0;
                                        const interval = setInterval(() => {
                                            attempts++;
                                            chrome.storage.local.get(
                                                ["accessToken", "refreshToken"],
                                                (result) => {
                                                    if (
                                                        chrome.runtime.lastError
                                                            ?.message
                                                    ) {
                                                        errL(
                                                            "🟥 chrome.storage.local.get lastError:",
                                                            chrome.runtime
                                                                .lastError
                                                                .message,
                                                            { reqId, attempts }
                                                        );
                                                    }
                                                    logL(
                                                        `🟣 Poll #${attempts}`,
                                                        result,
                                                        { reqId }
                                                    );
                                                    if (result.accessToken) {
                                                        logL(
                                                            "🟢 Access token detected in storage. Closing modal.",
                                                            { reqId }
                                                        );
                                                        clearInterval(interval);
                                                        onClose?.();
                                                    } else if (attempts >= 10) {
                                                        warnL(
                                                            "🔴 No access token found after 10 tries.",
                                                            { reqId }
                                                        );
                                                        clearInterval(interval);
                                                    }
                                                }
                                            );
                                        }, 500);
                                    }, 300); // short delay after ping
                                }
                            );
                        } catch (err) {
                            errL(
                                "❌ Port connection or message post threw synchronously:",
                                err
                            );
                        }
                    }}
                />
            </LoginContainer>
            {showModal && <Modal />}
        </LoginBackdrop>
    );
};

export default Login;
