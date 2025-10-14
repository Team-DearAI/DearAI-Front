function waitForIframeLoad(iframe, timeout = 2000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();

        function check() {
            try {
                const innerDoc = iframe.contentDocument || iframe.contentWindow?.document;
                if (innerDoc && innerDoc.body?.innerText?.trim()) {
                    resolve(innerDoc);
                    return;
                }
            } catch (e) {
                // cross-origin 방어
            }
            if (Date.now() - start > timeout) reject(new Error("iframe load timeout"));
            else setTimeout(check, 100);
        }
        check();
    });
}

function extractEmailsFromText(text = "") {
    const matches = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi);
    return matches ? Array.from(new Set(matches)) : [];
}

function queryWithinCompose(selector) {
    // Prefer Gmail compose dialog, else document
    const compose = document.querySelector('div[role="dialog"][aria-label], div[role="dialog"]');
    return (compose || document).querySelector(selector);
}

async function extractMailData() {
    const host = location.host;

    // Gmail specific selectors
    if (/mail\.google\.com$/.test(host)) {
        const subject =
            queryWithinCompose('input[name="subjectbox"]')?.value ||
            queryWithinCompose('input[aria-label*="Subject"]')?.value ||
            queryWithinCompose('input[aria-label*="제목"]')?.value ||
            "";

        const toContainer =
            queryWithinCompose('div[aria-label^="To"], div[aria-label*="받는사람"]') ||
            queryWithinCompose('div[name="to"]');
        const toText = toContainer?.innerText || "";
        const toEmails = extractEmailsFromText(toText).join(", ");

        const body =
            queryWithinCompose('div[aria-label="Message Body"]')?.innerText?.trim() ||
            queryWithinCompose('div[aria-label*="메시지 본문"]')?.innerText?.trim() ||
            queryWithinCompose('div[role="textbox"][g_editable="true"]')?.innerText?.trim() ||
            "";

        console.log("📋 Gmail 추출 데이터:", { subject, to: toEmails, body });
        return { subject, to: toEmails, body };
    }

    // Naver Mail and general fallback
    const subject =
        document.querySelector('input[name="subject"]')?.value ||
        document.querySelector('[data-testid="subjectInput"]')?.value ||
        document.querySelector('[role="textbox"][aria-label*="제목"]')?.innerText?.trim() ||
        document.querySelector('div[placeholder="제목을 입력하세요"]')?.innerText?.trim() ||
        "";

    const to =
        Array.from(document.querySelectorAll('.mail_input_address_item span'))
            .map((el) => el.innerText.trim())
            .filter(Boolean)
            .join(", ") ||
        document.querySelector('input[name="to"]')?.value ||
        document.querySelector('[data-testid="recipientInput"]')?.value ||
        // As a last resort, extract emails from the whole page header area
        extractEmailsFromText(
            document.querySelector('#readFrame, #writeFrame, body')?.innerText || ""
        ).join(", ") ||
        "";

    // 본문 추출 (Naver는 보통 iframe 기반 에디터)
    let body = "";
    const iframe =
        document.querySelector('iframe#editorFrame') ||
        document.querySelector('iframe[id*="se_canvas"]') ||
        document.querySelector('iframe[id*="smart_editor"]');

    try {
        if (iframe) {
            const innerDoc = await waitForIframeLoad(iframe);
            const bodyEl =
                innerDoc.querySelector('[contenteditable="true"]') ||
                innerDoc.querySelector('.se_textarea') ||
                innerDoc.querySelector('body');
            body = bodyEl?.innerText?.trim() || "";
        } else {
            const inlineEditor =
                document.querySelector('[contenteditable="true"]') ||
                document.querySelector('.editor_body') ||
                document.querySelector('.se_textarea') ||
                document.querySelector('textarea');
            body = inlineEditor?.innerText?.trim() || inlineEditor?.value?.trim() || "";
        }
    } catch (err) {
        console.warn("⚠️ iframe 접근 실패 또는 로드 타임아웃:", err.message);
    }

    console.log("📋 최종 추출된 데이터:", { subject, to, body });
    return { subject, to, body };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "extractMailData") {
        (async () => {
            try {
                const data = await extractMailData();
                sendResponse({ data });
            } catch (e) {
                sendResponse({ error: e.message });
            }
        })();
        return true;
    }
});
