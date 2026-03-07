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

    // URL에 redirect_uri를 명시적으로 추가
    const encodedRedirectUri = encodeURIComponent(redirectUri);
    const loginUrl = `https://dearai.cspark.my/login?redirect_uri=${encodedRedirectUri}`;
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
            if (chrome.runtime.lastError) {
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

            if (!redirectUrl) {
                console.error("[BG] No redirect URL received");
                return;
            }

            console.log("Redirect URL received:", redirectUrl);

            try {
                const url = new URL(redirectUrl);
                const params = new URLSearchParams(url.search);

                // Hash fragment도 확인 (OAuth2 implicit flow의 경우)
                const hashParams = new URLSearchParams(url.hash.substring(1));

                const accessToken = params.get("access_token") || hashParams.get("access_token");
                const refreshToken = params.get("refresh_token") || hashParams.get("refresh_token");
                console.log("Parsed tokens from redirect URL:", { accessToken, refreshToken });

                if (accessToken) {
                    chrome.storage.local.set({ accessToken, refreshToken }, () => {
                        console.log("Tokens saved:", { accessToken, refreshToken });

                        // 로그인 완료 후 팝업 자동으로 열기
                        chrome.action.openPopup().then(() => {
                            console.log("[BG] Popup opened after login");
                        }).catch((err) => {
                            console.log("[BG] Could not open popup automatically:", err);
                            // 자동 열기 실패 시 사용자에게 알림
                            chrome.action.setBadgeText({ text: "✓" });
                            chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
                            // 3초 후 배지 제거
                            setTimeout(() => {
                                chrome.action.setBadgeText({ text: "" });
                            }, 3000);
                        });
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

    if (message.action === "applyContent") {
        console.log("[BG] applyContent action received");
        console.log("[BG] Content to apply:", message.content);

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
                func: (contentToApply) => {
                    console.log("\n\n");
                    console.log("═".repeat(60));
                    console.log("📤 [Content] 메일 내용 적용 시작");
                    console.log("═".repeat(60));
                    console.log("[Content] 적용할 내용:", contentToApply);

                    // iframe 찾기
                    console.log("\n[Content] 📍 Step 1: iframe 검색");
                    const iframes = document.querySelectorAll('iframe');
                    console.log("[Content]   └─ 발견된 iframe 개수:", iframes.length);

                    let success = false;
                    for (let i = 0; i < iframes.length; i++) {
                        try {
                            const iframe = iframes[i];
                            console.log(`\n[Content]   ┌─ iframe ${i} 확인:`);

                            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                            if (iframeDoc) {
                                console.log(`[Content]   │  ├─ contentDocument: ✅ 접근 가능`);

                                // workseditor-content 찾기
                                const workseditorContent = iframeDoc.querySelector('.workseditor-content');
                                if (workseditorContent) {
                                    console.log(`[Content]   │  └─ ✅ workseditor-content 발견!`);
                                    console.log(`[Content]   │     ├─ 기존 내용: "${workseditorContent.textContent?.substring(0, 50)}"`);

                                    // 내용 적용
                                    workseditorContent.innerText = contentToApply;

                                    console.log(`[Content]   │     └─ ✅ 새 내용 적용 완료!`);
                                    console.log(`[Content]   │        └─ 새 내용: "${workseditorContent.textContent?.substring(0, 50)}"`);
                                    success = true;
                                    break;
                                } else {
                                    console.log(`[Content]   │  └─ workseditor-content 없음`);
                                }
                            } else {
                                console.log(`[Content]   │  └─ ❌ contentDocument 접근 불가`);
                            }
                        } catch (e) {
                            console.log(`[Content]   │  └─ ❌ 오류: ${e.message}`);
                        }
                    }

                    console.log("\n" + "═".repeat(60));
                    console.log("📊 [Content] 최종 결과");
                    console.log("═".repeat(60));
                    console.log("[Content] 적용 성공:", success);
                    console.log("═".repeat(60));

                    return { success };
                },
                args: [message.content]
            }, (results) => {
                if (chrome.runtime.lastError) {
                    console.error("[BG] Script execution error:", chrome.runtime.lastError);
                    sendResponse({ success: false, error: chrome.runtime.lastError.message });
                    return;
                }

                const result = results?.[0]?.result;
                console.log("[BG] Apply result:", result);

                if (result?.success) {
                    sendResponse({ success: true });
                } else {
                    sendResponse({ success: false, error: "메일 편집기를 찾을 수 없습니다." });
                }
            });
        });

        return true; // 비동기 응답
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

            // 메인 페이지에서만 실행하고, iframe은 직접 접근
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                func: () => {
                    console.log("\n\n");
                    console.log("═".repeat(60));
                    console.log("🔍 [Content] 크롤링 스크립트 시작");
                    console.log("═".repeat(60));
                    console.log("[Content] 📍 Step 1: 현재 실행 환경 확인");
                    console.log("[Content]   ├─ 현재 프레임 URL:", window.location.href);
                    console.log("[Content]   ├─ window === window.top:", window === window.top);
                    console.log("[Content]   ├─ document.body 존재:", !!document.body);
                    console.log("[Content]   └─ document.readyState:", document.readyState);

                    // 이 스크립트가 iframe 내부에서 실행 중인지 확인
                    const isInFrame = window !== window.top;
                    console.log("\n[Content] 📍 Step 2: 프레임 타입 판별");
                    console.log("[Content]   └─ 실행 위치:", isInFrame ? "🎯 IFRAME 내부" : "📄 메인 페이지");

                    // 현재 페이지의 모든 클래스 이름 출력 (디버깅용)
                    console.log("\n[Content] 📍 Step 3: workseditor 요소 검색 (전체 탐색)");
                    const allElements = document.querySelectorAll('[class*="workseditor"]');
                    console.log("[Content]   └─ 발견된 workseditor 관련 요소:", allElements.length, "개");

                    if (allElements.length > 0) {
                        allElements.forEach((el, i) => {
                            console.log(`[Content]      ${i + 1}. className: "${el.className}"`);
                            console.log(`[Content]         ├─ tagName: ${el.tagName}`);
                            console.log(`[Content]         ├─ id: "${el.id || "(없음)"}"`);
                            console.log(`[Content]         ├─ contentEditable: ${el.contentEditable}`);
                            console.log(`[Content]         ├─ 텍스트 길이: ${el.textContent?.length || 0}자`);
                            console.log(`[Content]         └─ 내용 미리보기: "${el.textContent?.substring(0, 50) || "(비어있음)"}"`);
                        });
                    } else {
                        console.log("[Content]      ⚠️ workseditor 요소를 찾지 못했습니다!");
                    }

                    // 받는 사람 추출 (메인 프레임에서만 시도)
                    let recipientText = null;

                    console.log("\n[Content] 📍 Step 4: 받는 사람 추출 시도");
                    if (!isInFrame) {
                        console.log("[Content]   ├─ 메인 프레임에서 받는 사람 검색 중...");
                        const recipientSelectors = [
                            '.button_user',
                            'button.button_user',
                            '#mail_object_element_button_to_0',
                            '[class*="button_user"]',
                            'button[type="button"][class*="user"]'
                        ];

                        console.log("[Content]   ├─ 시도할 selector 개수:", recipientSelectors.length);
                        for (let i = 0; i < recipientSelectors.length; i++) {
                            const selector = recipientSelectors[i];
                            console.log(`[Content]   ├─ [${i + 1}/${recipientSelectors.length}] 시도: "${selector}"`);
                            const element = document.querySelector(selector);
                            if (element && element.textContent) {
                                recipientText = element.textContent.trim();
                                console.log(`[Content]   └─ ✅ 받는 사람 발견: "${recipientText}"`);
                                if (recipientText) break;
                            } else {
                                console.log(`[Content]   │  └─ ❌ 요소 없음`);
                            }
                        }

                        // ID로도 시도
                        if (!recipientText) {
                            console.log("[Content]   ├─ CSS selector로 못 찾음, ID로 재시도...");
                            const buttonById = document.getElementById('mail_object_element_button_to_0');
                            if (buttonById) {
                                recipientText = buttonById.textContent.trim();
                                console.log("[Content]   └─ ✅ 받는 사람 발견 (by ID):", recipientText);
                            } else {
                                console.log("[Content]   └─ ❌ ID로도 못 찾음");
                            }
                        }
                    } else {
                        console.log("[Content]   └─ iframe 내부이므로 받는 사람 추출 건너뜀");
                    }

                    // 메일 본문 추출
                    console.log("\n" + "═".repeat(60));
                    console.log("📝 [Content] 메일 본문 추출 시작");
                    console.log("═".repeat(60));

                    // 페이지 전체 구조 확인
                    console.log("[Content] 📍 Step 5: 페이지 구조 분석");
                    console.log("[Content]   ├─ 현재 URL:", window.location.href);
                    console.log("[Content]   ├─ document.body 존재:", document.body ? "✅ 있음" : "❌ 없음");
                    console.log("[Content]   └─ body의 자식 요소 개수:", document.body?.children.length || 0);

                    // 모든 contenteditable 요소 찾기
                    console.log("\n[Content] 📍 Step 6: contenteditable 요소 전체 검색");
                    const editableElements = document.querySelectorAll('[contenteditable="true"]');
                    console.log("[Content]   └─ 발견된 contenteditable 요소:", editableElements.length, "개");

                    if (editableElements.length > 0) {
                        editableElements.forEach((el, idx) => {
                            console.log(`[Content]      ${idx + 1}. contenteditable 요소:`);
                            console.log(`[Content]         ├─ tagName: ${el.tagName}`);
                            console.log(`[Content]         ├─ className: "${el.className}"`);
                            console.log(`[Content]         ├─ id: "${el.id || "(없음)"}"`);
                            console.log(`[Content]         ├─ 텍스트 길이: ${el.textContent?.length || 0}자`);
                            console.log(`[Content]         └─ 내용 미리보기: "${el.textContent?.substring(0, 50) || "(비어있음)"}"`);
                        });
                    } else {
                        console.log("[Content]      ⚠️ contenteditable 요소를 찾지 못했습니다!");
                    }

                    // workseditor 관련 모든 요소 찾기
                    console.log("\n[Content] 📍 Step 7: workseditor 요소 상세 분석");
                    const allWorkseditor = document.querySelectorAll('[class*="workseditor"]');
                    console.log("[Content]   └─ 발견된 workseditor 관련 요소:", allWorkseditor.length, "개");

                    if (allWorkseditor.length > 0) {
                        allWorkseditor.forEach((el, idx) => {
                            console.log(`[Content]      ${idx + 1}. workseditor 요소:`);
                            console.log(`[Content]         ├─ tagName: ${el.tagName}`);
                            console.log(`[Content]         ├─ className: "${el.className}"`);
                            console.log(`[Content]         ├─ id: "${el.id || "(없음)"}"`);
                            console.log(`[Content]         ├─ contentEditable: ${el.contentEditable}`);
                            console.log(`[Content]         ├─ 텍스트 길이: ${el.textContent?.length || 0}자`);
                            console.log(`[Content]         └─ 내용 미리보기: "${el.textContent?.substring(0, 50) || "(비어있음)"}"`);
                        });
                    } else {
                        console.log("[Content]      ⚠️ workseditor 요소를 찾지 못했습니다!");
                    }

                    let mailContent = null;
                    let successSelector = null;

                    // 본문 내용 추출
                    console.log("\n" + "═".repeat(60));
                    console.log("🎯 [Content] 본문 내용 추출 시작");
                    console.log("═".repeat(60));

                    // 메인 페이지에서 iframe을 찾아서 직접 접근
                    console.log("[Content] 📍 Step 8: iframe 검색 및 접근");
                    const iframes = document.querySelectorAll('iframe');
                    console.log("[Content]   └─ 발견된 iframe 개수:", iframes.length);

                    let iframeDoc = null;
                    for (let i = 0; i < iframes.length; i++) {
                        try {
                            const iframe = iframes[i];
                            console.log(`\n[Content]   ┌─ iframe ${i} 확인:`);
                            console.log(`[Content]   │  ├─ id: "${iframe.id || "(없음)"}"`);
                            console.log(`[Content]   │  ├─ src: "${iframe.src || "(없음)"}"`);

                            const tempDoc = iframe.contentDocument || iframe.contentWindow?.document;
                            if (tempDoc) {
                                console.log(`[Content]   │  ├─ contentDocument: ✅ 접근 가능`);

                                // workseditor-content가 있는지 확인
                                const workseditorContent = tempDoc.querySelector('.workseditor-content');
                                if (workseditorContent) {
                                    console.log(`[Content]   │  └─ ✅ workseditor-content 발견!`);
                                    iframeDoc = tempDoc;
                                    break;
                                } else {
                                    console.log(`[Content]   │  └─ workseditor-content 없음`);
                                }
                            } else {
                                console.log(`[Content]   │  └─ ❌ contentDocument 접근 불가`);
                            }
                        } catch (e) {
                            console.log(`[Content]   │  └─ ❌ 오류: ${e.message}`);
                        }
                    }

                    // iframe document를 찾았는지 확인
                    if (!iframeDoc) {
                        console.log("\n[Content]   ⚠️ workseditor-content가 있는 iframe을 찾지 못했습니다!");
                        console.log("[Content]   메인 페이지에서 직접 시도해봅니다...");
                        iframeDoc = document;
                    } else {
                        console.log("\n[Content]   ✅ iframe document 확보 완료!");
                    }

                    // 모든 프레임에서 시도할 selector들 (우선순위 순)
                    const contentSelectors = [
                        '.workseditor-content',
                        'div.workseditor-content',
                        'body > div > div.workseditor-body > div.workseditor-content',
                        'div[class*="workseditor-content"]',
                        'div.workseditor-body > div.workseditor-content',
                        'div[contenteditable="true"]',
                        '[contenteditable="true"]',
                        'div.editor-content',
                        'div[class*="editor"]'
                    ];

                    console.log("\n[Content] 📍 Step 9: Selector 순차 시도 (iframe document에서)");
                    console.log("[Content]   └─ 총", contentSelectors.length, "개의 selector 준비됨");

                    for (let i = 0; i < contentSelectors.length; i++) {
                        const selector = contentSelectors[i];
                        console.log(`\n[Content]   ┌─ [${i + 1}/${contentSelectors.length}] Selector 시도`);
                        console.log(`[Content]   │  └─ "${selector}"`);

                        try {
                            console.log(`[Content]   │  └─ iframeDoc.querySelector() 실행 중...`);
                            const element = iframeDoc.querySelector(selector);

                            if (element) {
                                console.log(`[Content]   │  └─ ✅ 요소 발견!`);
                                console.log(`[Content]   │     ├─ tagName: ${element.tagName}`);
                                console.log(`[Content]   │     ├─ className: "${element.className}"`);
                                console.log(`[Content]   │     ├─ id: "${element.id || "(없음)"}"`);
                                console.log(`[Content]   │     └─ contentEditable: ${element.contentEditable}`);

                                const innerTextVal = element.innerText;
                                const textContentVal = element.textContent;
                                const innerHTMLVal = element.innerHTML;

                                console.log(`[Content]   │     ├─ innerText: "${innerTextVal?.substring(0, 50) || "(없음)"}"`);
                                console.log(`[Content]   │     ├─ textContent: "${textContentVal?.substring(0, 50) || "(없음)"}"`);
                                console.log(`[Content]   │     ├─ innerText 길이: ${innerTextVal?.length || 0}자`);
                                console.log(`[Content]   │     ├─ textContent 길이: ${textContentVal?.length || 0}자`);
                                console.log(`[Content]   │     └─ innerHTML 길이: ${innerHTMLVal?.length || 0}자`);

                                if (innerTextVal?.trim()) {
                                    mailContent = innerTextVal.trim();
                                    successSelector = selector;
                                    console.log(`[Content]   └─ 🎉🎉🎉 innerText로 추출 성공!`);
                                    console.log(`[Content]       ├─ 추출된 내용: "${mailContent}"`);
                                    console.log(`[Content]       └─ 사용된 selector: "${successSelector}"`);
                                    break;
                                } else if (textContentVal?.trim()) {
                                    mailContent = textContentVal.trim();
                                    successSelector = selector;
                                    console.log(`[Content]   └─ 🎉🎉🎉 textContent로 추출 성공!`);
                                    console.log(`[Content]       ├─ 추출된 내용: "${mailContent}"`);
                                    console.log(`[Content]       └─ 사용된 selector: "${successSelector}"`);
                                    break;
                                } else if (innerHTMLVal?.trim()) {
                                    mailContent = innerHTMLVal.trim();
                                    successSelector = selector;
                                    console.log(`[Content]   └─ 🎉🎉🎉 innerHTML로 추출 성공!`);
                                    console.log(`[Content]       ├─ 추출된 내용 (처음 200자): "${mailContent.substring(0, 200)}"`);
                                    console.log(`[Content]       └─ 사용된 selector: "${successSelector}"`);
                                    break;
                                } else {
                                    console.log(`[Content]   │  └─ ⚠️ 요소는 찾았지만 내용이 비어있음`);
                                }
                            } else {
                                console.log(`[Content]   │  └─ ❌ 요소 없음 (null)`);
                            }
                        } catch (error) {
                            console.error(`[Content]   │  └─ ❌ 오류 발생:`, error);
                        }
                    }

                    console.log("\n" + "═".repeat(60));
                    console.log("📊 [Content] 최종 결과 (현재 프레임)");
                    console.log("═".repeat(60));
                    console.log("[Content] 📍 Step 10: 추출 결과 확인");
                    console.log("[Content]   ├─ 받는 사람:", recipientText || "❌ 없음");
                    console.log("[Content]   ├─ 메일 내용:", mailContent || "❌ 없음");
                    console.log("[Content]   └─ 성공한 Selector:", successSelector || "❌ 없음");
                    console.log("═".repeat(60));

                    return {
                        recipient: recipientText || null,
                        content: mailContent || null
                    };
                }
            }, (results) => {
                if (chrome.runtime.lastError) {
                    console.error("\n[BG] ❌ 스크립트 실행 오류:", chrome.runtime.lastError);
                    sendResponse({ success: false, error: chrome.runtime.lastError.message });
                    return;
                }

                console.log("\n\n");
                console.log("═".repeat(60));
                console.log("🔄 [BG] 백그라운드 - 결과 병합 시작");
                console.log("═".repeat(60));
                console.log("[BG] 📍 Step 1: 전체 프레임 실행 결과 확인");
                console.log("[BG]   └─ 실행된 프레임 개수:", results?.length || 0);

                // 모든 프레임의 결과를 병합
                let recipient = null;
                let content = null;

                console.log("\n[BG] 📍 Step 2: 각 프레임 결과 분석 및 병합");
                results?.forEach((frameResult, idx) => {
                    console.log(`\n[BG]   ┌─ Frame ${idx} 결과:`);
                    console.log(`[BG]   │  └─ 전체 결과:`, frameResult?.result);

                    const frameData = frameResult?.result;
                    if (frameData) {
                        // 받는 사람이 아직 없고, 이 프레임에서 발견했다면
                        if (!recipient && frameData.recipient) {
                            recipient = frameData.recipient;
                            console.log(`[BG]   │     ✅ 받는 사람 발견: "${recipient}"`);
                        } else if (frameData.recipient) {
                            console.log(`[BG]   │     ⚠️ 받는 사람 있지만 이미 다른 프레임에서 발견됨`);
                        } else {
                            console.log(`[BG]   │     ❌ 받는 사람 없음`);
                        }

                        // 메일 내용이 아직 없고, 이 프레임에서 발견했다면
                        if (!content && frameData.content) {
                            content = frameData.content;
                            console.log(`[BG]   │     ✅ 메일 내용 발견: "${content?.substring(0, 100)}"`);
                        } else if (frameData.content) {
                            console.log(`[BG]   │     ⚠️ 메일 내용 있지만 이미 다른 프레임에서 발견됨`);
                        } else {
                            console.log(`[BG]   │     ❌ 메일 내용 없음`);
                        }
                    } else {
                        console.log(`[BG]   │  └─ ❌ frameData가 null 또는 undefined`);
                    }
                });

                console.log("\n" + "═".repeat(60));
                console.log("🎯 [BG] 최종 병합 결과");
                console.log("═".repeat(60));
                console.log("[BG] 📍 Step 3: 최종 병합 결과");
                console.log("[BG]   ├─ 받는 사람:", recipient || "❌ 없음");
                console.log("[BG]   └─ 메일 내용:", content || "❌ 없음");
                console.log("═".repeat(60));

                if (recipient || content) {
                    sendResponse({
                        success: true,
                        recipient: recipient || "",
                        content: content || ""
                    });
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