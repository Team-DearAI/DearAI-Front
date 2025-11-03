import React from "react";
import styled from "styled-components";

interface CloseButtonProps {
    onClick: () => void;
    size?: number;
    color?: string;
    absolute?: boolean;
}

const StyledCloseButton = styled.button<{
    $size: number;
    $color: string;
    $absolute: boolean;
}>`
    position: ${(props) => (props.$absolute ? "absolute" : "relative")};
    ${(props) =>
        props.$absolute
            ? `
    top: 16px;
    right: 16px;
    `
            : ""}
    background: transparent;
    border: none;
    font-size: ${(props) => props.$size}px;
    color: ${(props) => props.$color};
    font-family: "DungGeunMo", sans-serif;
    font-weight: bold;
    cursor: pointer;
    padding: 8px 12px;
    min-width: ${(props) => props.$size + 16}px;
    min-height: ${(props) => props.$size + 16}px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
    line-height: 1;
    z-index: 10;

    &:hover {
        opacity: 0.7;
        transform: scale(1.1);
    }
`;

const CloseButton: React.FC<CloseButtonProps> = ({
    onClick,
    size = 24,
    color = "#82e0bb",
    absolute = true,
}) => {
    return (
        <StyledCloseButton
            onClick={onClick}
            $size={size}
            $color={color}
            $absolute={absolute}
            aria-label="Close"
        >
            x
        </StyledCloseButton>
    );
};

export default CloseButton;
