chrome.runtime.onInstalled.addListener(() => {
    console.log("DearAI extension installed!");
    console.log("[BG] onInstalled fired. Manifest DearAI loaded.");
});

function loginWithGoogle() {
    const t0 = Date.now();
    console.log("[BG] loginWithGoogle() invoked at", new Date(t0).toISOString());

    console.log("loginWithGoogle() started.");
    const redirectUri = chrome.identity.getRedirectURL();
    console.log("Extension redirect URI:", redirectUri);
    console.log("[BG] chrome.runtime.id:", chrome.runtime?.id);

    const loginUrl = "https://dearai.cspark.my/login";
    console.log("Prepared login URL:", loginUrl);

    let waitSeconds = 0;
    const heartbeat = setInterval(() => {
        waitSeconds += 1;
        console.log(`[BG] Waiting for launchWebAuthFlow callback... ${waitSeconds}s elapsed`);
    }, 1000);
    console.log("[BG] Calling chrome.identity.launchWebAuthFlow with options:", { url: loginUrl, interactive: true });

    chrome.identity.launchWebAuthFlow(
        { url: loginUrl, interactive: true },
        (redirectUrl) => {
            clearInterval(heartbeat);
            const t1 = Date.now();
            console.log("[BG] launchWebAuthFlow callback fired after", (t1 - t0), "ms");

            console.log("launchWebAuthFlow callback triggered.");
            if (chrome.runtime.lastError || !redirectUrl) {
                try {
                    console.error("[BG] lastError (object):", chrome.runtime.lastError);
                    if (chrome.runtime.lastError && chrome.runtime.lastError.message) {
                        console.error("[BG] lastError.message:", chrome.runtime.lastError.message);
                    }
                } catch (e) {
                    console.error("[BG] Failed to print lastError:", e);
                }
                console.error("LaunchWebAuthFlow failed raw:", chrome.runtime.lastError);
                try {
                    console.error(
                        "LaunchWebAuthFlow failed JSON:",
                        JSON.stringify(chrome.runtime.lastError, null, 2)
                    );
                } catch (e) {
                    console.error("Could not stringify lastError:", e);
                }
                return;
            }

            console.log("Redirect URL received:", redirectUrl);

            try {
                const url = new URL(redirectUrl);
                const params = new URLSearchParams(url.search);

                const accessToken = params.get("access_token");
                const refreshToken = params.get("refresh_token");
                console.log("Parsed tokens from redirect URL:", { accessToken, refreshToken });

                if (accessToken) {
                    chrome.storage.local.set({ accessToken, refreshToken }, () => {
                        console.log("Tokens saved:", { accessToken, refreshToken });
                    });
                } else {
                    console.warn("No tokens found in redirect:", redirectUrl);
                }
            } catch (e) {
                console.error("Error parsing redirectUrl:", e, redirectUrl);
            }
        }
    );
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("[BG] onMessage received:", message);
    console.log("[BG] Sender info:", {
        tabId: sender?.tab?.id,
        tabUrl: sender?.tab?.url,
        frameId: sender?.frameId,
        url: sender?.url,
    });

    if (message.action === "login") {
        console.log("Login message received from popup/content");
        loginWithGoogle();
        console.log("[BG] Responding to popup/content with status: login_started");
        sendResponse({ status: "login_started" });
    }

    if (message.action === "getRecipient") {
        console.log("[BG] getRecipient action received");

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];

            if (!activeTab || !activeTab.id) {
                console.error("[BG] No active tab found");
                sendResponse({ success: false, error: "No active tab" });
                return;
            }

            console.log("[BG] Active tab:", activeTab.url);

            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                func: () => {
                    console.log("[Content] Starting recipient search...");

                    // 여러 선택자 시도
                    const selectors = [
                        '.button_user',
                        'button.button_user',
                        '#mail_object_element_button_to_0',
                        '[class*="button_user"]',
                        'button[type="button"][class*="user"]'
                    ];

                    let recipientText = null;

                    for (const selector of selectors) {
                        const element = document.querySelector(selector);
                        console.log(`[Content] Trying selector "${selector}":`, element);

                        if (element && element.textContent) {
                            recipientText = element.textContent.trim();
                            console.log(`[Content] Found with selector "${selector}":`, recipientText);
                            if (recipientText) break;
                        }
                    }

                    // ID로도 시도
                    if (!recipientText) {
                        const buttonById = document.getElementById('mail_object_element_button_to_0');
                        if (buttonById) {
                            recipientText = buttonById.textContent.trim();
                            console.log("[Content] Found by ID:", recipientText);
                        }
                    }

                    console.log("[Content] Final result:", recipientText);
                    return recipientText || null;
                }
            }, (results) => {
                if (chrome.runtime.lastError) {
                    console.error("[BG] Script execution error:", chrome.runtime.lastError);
                    sendResponse({ success: false, error: chrome.runtime.lastError.message });
                    return;
                }

                const recipient = results?.[0]?.result;
                console.log("[BG] Recipient found:", recipient);

                if (recipient) {
                    sendResponse({ success: true, recipient });
                } else {
                    sendResponse({ success: false, error: "받는 사람 정보를 찾을 수 없습니다. 네이버 메일 화면에서 받는 사람이 입력되어 있는지 확인해주세요." });
                }
            });
        });

        return true; // 비동기 응답을 위해 true 반환
    }
});

self.addEventListener("unhandledrejection", (e) => {
    console.error("[BG] Unhandled promise rejection:", e?.reason || e);
});
self.addEventListener("error", (e) => {
    console.error("[BG] Uncaught error:", e?.message, e?.error || e);
});