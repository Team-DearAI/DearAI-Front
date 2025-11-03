// 네이버 메일 화면에서 받는 사람 정보를 추출하는 함수
export const getRecipientFromNaverMail = (): string | null => {
    try {
        // button_user 클래스를 가진 버튼 찾기
        const recipientButton = document.querySelector('.button_user');

        if (recipientButton && recipientButton.textContent) {
            return recipientButton.textContent.trim();
        }

        return null;
    } catch (error) {
        console.error('Failed to get recipient from Naver Mail:', error);
        return null;
    }
};

// Chrome extension의 content script를 통해 페이지 정보 가져오기
export const getRecipientFromActivePage = async (): Promise<string | null> => {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab.id) {
            return null;
        }

        const result = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const recipientButton = document.querySelector('.button_user');
                return recipientButton?.textContent?.trim() || null;
            }
        });

        return result[0]?.result || null;
    } catch (error) {
        console.error('Failed to get recipient from active page:', error);
        return null;
    }
};
