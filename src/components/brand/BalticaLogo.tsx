type LogoVariant = 'full' | 'compact' | 'isotipo' | 'mono';

type BalticaLogoProps = {
  variant?: LogoVariant;
  size?: number;
  className?: string;
};

export function BalticaLogo({
  variant = 'compact',
  size = 48,
  className = '',
}: BalticaLogoProps) {
  // Use PNG files
  const logoSrc = variant === 'mono'
    ? '/Logo Báltica Escala de Grises.png'
    : '/Báltica LOGO OFICIAL.png';

  return (
    <img
      src={logoSrc}
      alt="Báltica Education"
      style={{ height: size, width: 'auto' }}
      className={`object-contain ${className}`}
    />
  );
}

export default BalticaLogo;
