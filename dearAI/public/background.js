chrome.runtime.onInstalled.addListener(() => {
    console.log("DearAI extension installed!");
});

function loginWithGoogle() {
    const redirectUri = chrome.identity.getRedirectURL();
    console.log("Extension redirect URI:", redirectUri);

    // 백엔드 로그인 엔드포인트 (백엔드에서 origin 체크 후 구글로 리다이렉트)
    const loginUrl = "https://dearai.cspark.my/login";

    chrome.identity.launchWebAuthFlow(
        { url: loginUrl, interactive: true },
        (redirectUrl) => {
            if (chrome.runtime.lastError || !redirectUrl) {
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
    if (message.action === "login") {
        console.log("Login message received from popup/content");
        loginWithGoogle();
        sendResponse({ status: "login_started" });
    }
});