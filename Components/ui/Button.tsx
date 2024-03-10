import React from "react";

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  text: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, disabled, text }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="relative group disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gold group-hover:text-black group-active:text-black font-dragon uppercase">
        {text}
      </div>
      <picture>
        <img
          src="/images/default.png"
          className="w-full group-hover:hidden group-active:hidden"
          alt=""
        />
      </picture>
      <picture>
        <img
          src="/images/hover.png"
          className="w-full hidden group-hover:block group-active:hidden"
          alt=""
        />
      </picture>
      <picture>
        <img
          src="/images/active.png"
          className="w-full hidden group-active:block"
          alt=""
        />
      </picture>
    </button>
  );
};

export default Button;
