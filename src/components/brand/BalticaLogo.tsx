type LogoVariant = "color" | "mono";
type LogoLayout = "horizontal" | "stacked";

type BalticaLogoProps = {
  variant?: LogoVariant;
  layout?: LogoLayout;
  size?: number;
};

export function BalticaLogo({
  variant = "color",
  layout = "horizontal",
  size = 48,
}: BalticaLogoProps) {
  const logoSrc =
    variant === "mono"
      ? "/Logo Báltica Escala de Grises.png"
      : "/Báltica LOGO OFICIAL.png";

  return (
    <div
      className={`flex items-center ${
        layout === "stacked" ? "flex-col gap-2" : "gap-3"
      }`}
      style={{ height: size }}
    >
      <img
        src={logoSrc}
        alt="Báltica Education"
        style={{ height: size, width: "auto" }}
        className="object-contain"
      />
    </div>
  );
}

export default BalticaLogo;
