import React from "react";

interface LogoProps {
    size?: number;
    onClick?: () => void;
    style?: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({ size = 32, onClick, style }) => {
    return (
        <img
            src="/logo.png"
            alt="logo"
            onClick={onClick}
            style={{
                width: `${size}px`,
                cursor: onClick ? "pointer" : "default",
                ...style,
            }}
        />
    );
};

export default Logo;
