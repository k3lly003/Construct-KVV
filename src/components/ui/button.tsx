import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface ButtonProp {
  text?: string;
  texSize?: string;
  hoverBg?: string;
  borderCol?: string;
  bgCol?: string;
  textCol?: string;
  border?: string;
  padding?: string;
  round?: string;
  handleButton?: () => void | Promise<boolean>;
  children?: ReactNode;
  variant?: string;
  size?: string;
  className?: string;
}

const Button = ({
  text,
  texSize = "",
  hoverBg = "",
  borderCol = "",
  bgCol = "",
  textCol = "",
  border = "",
  padding = "",
  round = "",
  handleButton = () => {},
  children,
  variant = "",
  size = "",
  className = "",
}: ButtonProp) => {
  const { t } = useTranslation();
  // If the text matches a key in 'common', use translation, else show as-is
  const translatedText = text ? t(`common.${text}`, text) : "";
  return (
    <div>
      <button
        onClick={handleButton}
        className={`${border} ${padding} ${bgCol} ${textCol} cursor-pointer mt-3 w-full ${borderCol} ${round} py-2 text-sm font-semibold ${hoverBg} transition-colors ${texSize} ${variant} ${size} ${className}`}
      >
        {children ? children : translatedText}
      </button>
    </div>
  );
};

export default Button;
