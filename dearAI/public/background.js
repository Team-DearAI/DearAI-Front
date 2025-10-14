console.log("🟢 DearAI background service worker loaded and ready.");

console.log("🧩 Debug: Background script initializing...");
try {
    console.log("🧩 Debug: globalThis keys sample:", Object.keys(globalThis).slice(0, 10));
} catch (e) {
    console.warn("⚠️ Debug: Failed to read globalThis keys:", e);
}

// Prevent background service worker from unloading too early (keep-alive trick)
setInterval(() => {
    chrome.runtime.getManifest(); // lightweight API call to keep worker alive
    console.log("💤 background still alive...");
}, 20000);

// Confirm service worker activation and startup
self.addEventListener("activate", () => {
    try {
        console.log("🔥 Background worker activated and ready for events.");
    } catch (e) {
        console.error("🧨 Error in activate event listener:", e);
    }
});

// Lifecycle events
console.log("🧩 Debug: Registering lifecycle event listeners...");
chrome.runtime.onStartup.addListener(() => {
    try {
        console.log("🚀 Chrome started, background worker running.");
    } catch (e) {
        console.error("🧨 Error in onStartup listener:", e);
    }
});

chrome.runtime.onInstalled.addListener(() => {
    try {
        console.log("📦 DearAI installed or updated, background worker initialized.");
    } catch (e) {
        console.error("🧨 Error in onInstalled listener:", e);
    }
});

// Ping listener to wake background
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    try {
        console.log("🧩 Debug: onMessage triggered with msg:", msg);
        if (msg.action === "ping") {
            console.log("📡 Ping received from popup, replying pong.");
            sendResponse({ pong: true });
            return true; // keep worker alive until sendResponse finishes
        }
    } catch (e) {
        console.error("🧨 Error in onMessage listener:", e);
    }
});

// Keep-alive heartbeat every 4 minutes
chrome.alarms.create("keepAlive", { periodInMinutes: 4 });
chrome.alarms.onAlarm.addListener((alarm) => {
    try {
        if (alarm.name === "keepAlive") {
            console.log("💓 KeepAlive ping - background stays awake.");
        }
    } catch (e) {
        console.error("🧨 Error in alarms.onAlarm listener:", e);
    }
});


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    try {
        if (msg.action === "login") {
            sendResponse({ ok: true });
        }
    } catch (e) {
        console.error("🧨 Error in second onMessage listener:", e);
    }
});

const ts = () => new Date().toISOString();
const logB = (...args) => console.log(`[BG ${ts()}]`, ...args);
const warnB = (...args) => console.warn(`[BG ${ts()}]`, ...args);
const errB = (...args) => console.error(`[BG ${ts()}]`, ...args);
self.addEventListener("unhandledrejection", (e) => {
    errB("🧨 Unhandled promise rejection:", e.reason);
});
self.addEventListener("error", (e) => {
    errB("🧨 Uncaught error:", e.message, e.error);
});

chrome.runtime.onInstalled.addListener(() => {
    logB("🟢 DearAI background script loaded!");
});

console.log("🧩 Debug: Registering port connection listener...");
chrome.runtime.onConnect.addListener((port) => {
    console.log("🧩 Debug: onConnect listener attached successfully.");
    const ts = () => new Date().toISOString();
    const logB = (...args) => console.log(`[BG ${ts()}]`, ...args);
    const errB = (...args) => console.error(`[BG ${ts()}]`, ...args);
    const warnB = (...args) => console.warn(`[BG ${ts()}]`, ...args);

    logB("🔌 Port connected:", port.name);
    logB("🪪 Port sender info:", {
        id: port?.sender?.tab?.id,
        url: port?.sender?.url,
        frameId: port?.sender?.frameId
    });

    port.onDisconnect.addListener(() => {
        logB("🔌 Port disconnected:", port.name);
    });

    port.onMessage.addListener(async (msg) => {
        const reqId = msg?.reqId || `no-req-${Math.random().toString(16).slice(2, 6)}`;
        logB("📩 Port message received:", { action: msg?.action, reqId, portName: port.name });

        if (msg.action === "login") {
            try {
                logB("🧭 Starting login handler...", { reqId, portName: port.name });
                const redirectUri = chrome.identity.getRedirectURL("oauth2");
                logB("🔗 redirectUri computed:", redirectUri, { reqId });
                const genState = () => crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
                const state = genState();
                logB("🧮 Building loginUrl with params", { reqId, state, redirectUri });
                const loginUrl = `https://dearai.cspark.my/login?${new URLSearchParams({
                    redirect_uri: redirectUri,
                    state
                }).toString()}`;
                logB("🚀 launchWebAuthFlow starting...", { reqId, loginUrl });

                const redirectUrl = await new Promise((resolve, reject) => {
                    chrome.identity.launchWebAuthFlow(
                        { url: loginUrl, interactive: true },
                        (url) => {
                            if (chrome.runtime.lastError) {
                                errB("❌ launchWebAuthFlow lastError:", chrome.runtime.lastError.message, { reqId });
                                reject(new Error(chrome.runtime.lastError.message));
                                return;
                            }
                            if (!url) {
                                errB("❌ launchWebAuthFlow returned empty url.", { reqId });
                                reject(new Error("No redirect URL received"));
                                return;
                            }
                            resolve(url);
                        }
                    );
                });

                logB("🟢 launchWebAuthFlow resolved", { reqId, redirectUrl });

                const extractParams = (redirectUrlStr) => {
                    const urlObj = new URL(redirectUrlStr);
                    let params = new URLSearchParams(urlObj.search);
                    if (!params.get("access_token") && urlObj.hash) {
                        const hash = urlObj.hash.startsWith("#") ? urlObj.hash.slice(1) : urlObj.hash;
                        params = new URLSearchParams(hash);
                    }
                    return {
                        accessToken: params.get("access_token"),
                        refreshToken: params.get("refresh_token"),
                        returnedState: params.get("state"),
                        error: params.get("error"),
                        code: params.get("code")
                    };
                };

                const { accessToken, refreshToken, returnedState, error, code } = extractParams(redirectUrl);
                logB("🧾 Parsed params detail:", {
                    accessTokenPresent: Boolean(accessToken),
                    refreshTokenPresent: Boolean(refreshToken),
                    codePresent: Boolean(code),
                    returnedState
                }, { reqId });

                if (error) throw new Error(`OAuth error: ${error}`);
                if (returnedState && returnedState !== state)
                    throw new Error("State mismatch (possible CSRF)");
                if (!accessToken && !code)
                    throw new Error("No tokens found in redirect URL");

                if (accessToken) {
                    logB("💾 Saving tokens to storage via chrome.storage.local.set...", { reqId });
                    await new Promise((resolve, reject) => {
                        chrome.storage.local.set({ accessToken, refreshToken: refreshToken || null }, () => {
                            if (chrome.runtime.lastError)
                                reject(new Error(chrome.runtime.lastError.message));
                            else resolve();
                        });
                    });
                    logB("💾 Tokens saved successfully:", { reqId, accessToken, refreshToken });

                    // Notify popup UI immediately after login success (with fallback and auto window open)
                    chrome.runtime.sendMessage({ action: "loginSuccess", accessToken }, () => {
                        if (chrome.runtime.lastError) {
                            console.warn("⚠️ Popup not open; opening new DearAI window instead");
                            chrome.windows.create({
                                url: chrome.runtime.getURL("index.html"),
                                type: "popup",
                                width: 480,
                                height: 640,
                            });
                        } else {
                            console.log("✅ loginSuccess message delivered to popup");
                        }
                    });

                    port.postMessage({ success: true, accessToken, reqId });
                } else {
                    warnB("ℹ️ Authorization code received, not handled in extension", { reqId });
                    port.postMessage({ success: false, error: "Authorization code flow not implemented", reqId });
                }
            } catch (err) {
                errB("💥 Login flow failed:", err, { reqId });
                errB("🧯 Caught exception:", err && (err.stack || err.message || err), { reqId });
                port.postMessage({ success: false, error: err.message, reqId });
            }
        }

        if (msg.action === "extractMailData") {
            try {
                logB("📩 Extract mail data request received.", { reqId });
                const [tab] = await new Promise((resolve, reject) => {
                    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
                        if (chrome.runtime.lastError)
                            reject(new Error(chrome.runtime.lastError.message));
                        else resolve(tabs);
                    });
                });

                if (!tab?.id) throw new Error("메일 탭을 찾을 수 없습니다.");

                await new Promise((resolve, reject) => {
                    chrome.scripting.executeScript(
                        { target: { tabId: tab.id }, files: ["contentScript.js"] },
                        (injectionResults) => {
                            if (chrome.runtime.lastError)
                                reject(new Error(chrome.runtime.lastError.message));
                            else resolve(injectionResults);
                        }
                    );
                });

                logB("🧩 Script injected successfully into mail tab.", { reqId });

                chrome.tabs.sendMessage(tab.id, { action: "extractMailData" }, (response) => {
                    if (chrome.runtime.lastError) {
                        errB("❌ Communication with content script failed:", chrome.runtime.lastError.message, { reqId });
                        port.postMessage({ error: chrome.runtime.lastError.message, reqId });
                    } else {
                        logB("📨 Response from content script:", response, { reqId });
                        port.postMessage({ ...response, reqId });
                    }
                });
            } catch (err) {
                errB("💥 Mail extraction error:", err, { reqId });
                errB("🧯 Caught exception:", err && (err.stack || err.message || err), { reqId });
                port.postMessage({ error: err.message, reqId });
            }
        }
    });
});

console.log("🧩 Debug: Background script fully parsed and listeners registered.");
