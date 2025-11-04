import React from "react";
import styled from "styled-components";

interface TooltipProps {
    isVisible: boolean;
    onClose: () => void;
}

const TooltipBackdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const TooltipContainer = styled.div`
    background: white;
    border-radius: 16px;
    padding: 24px;
    max-width: 400px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border: 2px solid #82e0bb;
    font-family: "Pretendard", sans-serif;
    position: relative;
    animation: slideIn 0.3s ease-out;

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const TooltipTitle = styled.h3`
    font-size: 1.1rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const TooltipContent = styled.div`
    font-size: 0.9rem;
    color: #555;
    line-height: 1.6;
    margin-bottom: 16px;
`;

const TooltipSubtitle = styled.strong`
    display: block;
    color: #82e0bb;
    font-weight: 600;
    margin-bottom: 6px;
`;

const TooltipExample = styled.div`
    background: #f8f9fa;
    border-left: 3px solid #82e0bb;
    padding: 12px;
    border-radius: 8px;
    margin-top: 12px;
`;

const ExampleTitle = styled.div`
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
    font-size: 0.85rem;
`;

const ExampleItem = styled.div`
    font-size: 0.85rem;
    color: #666;
    margin: 4px 0;
    padding-left: 8px;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    background: transparent;
    border: none;
    font-size: 24px;
    color: #999;
    cursor: pointer;
    font-family: "DungGeunMo", sans-serif;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;

    &:hover {
        color: #82e0bb;
    }
`;

const Tooltip: React.FC<TooltipProps> = ({ isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
        <TooltipBackdrop onClick={onClose}>
            <TooltipContainer onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>×</CloseButton>
                <TooltipTitle>
                    ✉️ 메일 제목 작성 Tip
                </TooltipTitle>
                <TooltipContent>
                    <TooltipSubtitle>제목은 간결하고 명확하게!</TooltipSubtitle>
                    메일 내용을 한눈에 파악할 수 있도록
                    <br />
                    주요 키워드와 핵심 내용을 포함해 작성하세요.
                </TooltipContent>
                <TooltipExample>
                    <ExampleTitle>📌 예시</ExampleTitle>
                    <ExampleItem>
                        - [PR] 프로젝트 리스트 UI 중간 구현 사항 공유드립니다
                    </ExampleItem>
                    <ExampleItem>
                        - [요청] 11/5 회의자료 검토 부탁드립니다
                    </ExampleItem>
                    <ExampleItem>
                        - [2025 AI 해커톤] 발표 자료 초안 공유드립니다
                    </ExampleItem>
                </TooltipExample>
            </TooltipContainer>
        </TooltipBackdrop>
    );
};

export default Tooltip;
