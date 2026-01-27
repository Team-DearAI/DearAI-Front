// 보안 관련 유틸리티 함수들

// API URL 환경변수 (HTTPS 강제)
const rawApiUrl = import.meta.env.VITE_API_URL || "https://dearai.cspark.my";
export const API_BASE_URL = rawApiUrl.startsWith("https://") ? rawApiUrl : rawApiUrl.replace("http://", "https://");

// 프로덕션 환경 체크
const isProduction = import.meta.env.PROD;

/**
 * HTTPS URL 검증
 */
export const isSecureUrl = (url: string): boolean => {
    return url.startsWith("https://");
};

/**
 * 안전한 로깅 함수 - 프로덕션에서는 민감 정보 제외
 */
export const secureLog = (message: string, data?: unknown, isSensitive = false) => {
    if (isProduction && isSensitive) {
        return; // 프로덕션에서 민감 정보 로깅 차단
    }

    if (isProduction) {
        // 프로덕션에서는 최소한의 로그만
        console.log(`[DearAI] ${message}`);
    } else {
        // 개발 환경에서는 상세 로그
        if (data !== undefined) {
            console.log(`[DearAI] ${message}`, data);
        } else {
            console.log(`[DearAI] ${message}`);
        }
    }
};

/**
 * 에러 로깅 함수
 */
export const secureError = (message: string, error?: unknown) => {
    if (isProduction) {
        console.error(`[DearAI Error] ${message}`);
    } else {
        console.error(`[DearAI Error] ${message}`, error);
    }
};

/**
 * 이메일 형식 검증
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
};

/**
 * 입력값 새니타이징 (XSS 방지)
 */
export const sanitizeInput = (input: string): string => {
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;");
};

/**
 * 이름 검증 (특수문자 제한)
 */
export const isValidName = (name: string): boolean => {
    // 한글, 영문, 숫자, 공백, 일부 특수문자(., -)만 허용
    const nameRegex = /^[가-힣a-zA-Z0-9\s.\-]+$/;
    return name.trim().length > 0 && name.trim().length <= 50 && nameRegex.test(name);
};

/**
 * 그룹명 검증
 */
export const isValidGroup = (group: string): boolean => {
    if (!group || group.trim() === "") return true; // 빈 그룹은 허용
    const groupRegex = /^[가-힣a-zA-Z0-9\s.\-_]+$/;
    return group.trim().length <= 30 && groupRegex.test(group);
};

/**
 * 키워드 검증
 */
export const isValidKeyword = (keyword: string): boolean => {
    return keyword.trim().length > 0 && keyword.trim().length <= 50;
};

/**
 * JWT 토큰 디코딩 (검증용)
 */
export const decodeJWT = (token: string): { exp?: number; [key: string]: unknown } | null => {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;

        const payload = parts[1];
        const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(decoded);
    } catch {
        return null;
    }
};

/**
 * 토큰 만료 여부 확인
 */
export const isTokenExpired = (token: string): boolean => {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;

    // 현재 시간 (초 단위) + 30초 버퍼
    const currentTime = Math.floor(Date.now() / 1000) + 30;
    return decoded.exp < currentTime;
};

/**
 * 토큰 유효성 검증
 */
export const isValidToken = (token: string | undefined | null): boolean => {
    if (!token || typeof token !== "string") return false;
    if (token.trim() === "") return false;
    return !isTokenExpired(token);
};

/**
 * Debounce 함수 (Rate Limiting)
 */
export const debounce = <T extends (...args: string[]) => void>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

/**
 * Throttle 함수 (Rate Limiting)
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle = false;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

/**
 * API 응답 데이터 검증 - Contact 타입
 */
export const validateContactResponse = (data: unknown): boolean => {
    if (!data || typeof data !== "object") return false;
    const contact = data as Record<string, unknown>;
    return (
        typeof contact.id === "string" &&
        typeof contact.recipient_name === "string" &&
        typeof contact.email === "string"
    );
};

/**
 * API 응답 데이터 검증 - Contact 배열
 */
export const validateContactsResponse = (data: unknown): boolean => {
    if (!Array.isArray(data)) return false;
    return data.every(validateContactResponse);
};

/**
 * API 응답 데이터 검증 - 키워드 배열
 */
export const validateKeywordsResponse = (data: unknown): boolean => {
    if (!data || typeof data !== "object") return false;
    const response = data as Record<string, unknown>;
    if (!Array.isArray(response.filter_keywords)) return false;
    return response.filter_keywords.every((k: unknown) => typeof k === "string");
};

/**
 * API 응답 데이터 검증 - 메일 검수 결과
 */
export const validateMailReviewResponse = (data: unknown): boolean => {
    if (!data || typeof data !== "object") return false;
    const response = data as Record<string, unknown>;
    if (!response.result || typeof response.result !== "object") return false;
    const result = response.result as Record<string, unknown>;
    return typeof result.mail === "string";
};

/**
 * Chrome Storage 데이터 검증
 */
export const validateStorageData = (key: string, value: unknown): boolean => {
    switch (key) {
        case "accessToken":
        case "refreshToken":
            return typeof value === "string" && value.length > 0;
        case "draftRecipient":
        case "draftMailContent":
            return typeof value === "string";
        default:
            return true;
    }
};

/**
 * 안전한 Storage 데이터 가져오기
 */
export const getSecureStorageValue = (value: unknown, defaultValue: string = ""): string => {
    if (typeof value === "string") {
        return value;
    }
    return defaultValue;
};

/**
 * CSP 위반 감지 리스너 등록
 */
export const setupCSPViolationListener = (): void => {
    if (typeof document !== "undefined") {
        document.addEventListener("securitypolicyviolation", (e) => {
            secureError(`CSP Violation: ${e.violatedDirective}`, {
                blockedURI: e.blockedURI,
                violatedDirective: e.violatedDirective,
            });
        });
    }
};

/**
 * 입력값 길이 제한 검증
 */
export const isWithinMaxLength = (input: string, maxLength: number): boolean => {
    return input.length <= maxLength;
};

/**
 * SQL Injection 패턴 감지
 */
export const hasSQLInjectionPattern = (input: string): boolean => {
    const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b)/i,
        /(--|#|\/\*|\*\/)/,
        /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
        /(;|\x00)/,
    ];
    return sqlPatterns.some((pattern) => pattern.test(input));
};

/**
 * XSS 패턴 감지
 */
export const hasXSSPattern = (input: string): boolean => {
    const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe/gi,
        /<embed/gi,
        /<object/gi,
    ];
    return xssPatterns.some((pattern) => pattern.test(input));
};

/**
 * 안전한 입력값 검증 (종합)
 */
export const isSafeInput = (input: string, maxLength: number = 1000): boolean => {
    if (!isWithinMaxLength(input, maxLength)) return false;
    if (hasSQLInjectionPattern(input)) return false;
    if (hasXSSPattern(input)) return false;
    return true;
};
