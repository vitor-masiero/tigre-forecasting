import clsx from "clsx";

type ButtonProps = {
  text: string;
  theme?: "primary" | "secondary" | "outline";
};

const Button = ({ text, theme = "primary" }: ButtonProps) => {
  const themes = {
    primary:
      "text-white bg-[linear-gradient(135deg,_#3b82f6,_#2563eb)] shadow-[0_4px_20px_rgba(59,_130,_246,_0.4)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(59,_130,_246,_0.5)] hover:bg-[linear-gradient(135deg,_#2563eb,_#1d4ed8)]",
    secondary:
      "text-white bg-[rgba(255,_255,_255,_0.15)] border-[1px_solid_rgba(255,_255,_255,_0.2)] backdrop-blur-md hover:translate-y-[-1px] hover:bg-[rgba(255,_255,_255,_0.3)]",
    outline:
      "bg-transparent text-[#3b82f6] border-2 border-solid border-[#3b82f6] hover:text-white hover:bg-[#3b82f6]",
  };

  return (
    <button
      type="button"
      className={clsx(
        "relative flex cursor-pointer items-center gap-2 overflow-hidden rounded-[10px] border-none px-6 py-3 text-[0.9rem] font-semibold transition-[all_0.3s_cubic-bezier(0.4,_0,_0.2,_1)]",
        themes[theme],
      )}
    >
      {text}
    </button>
  );
};

export default Button;
