type LogoVariant = 'full' | 'compact' | 'isotipo' | 'mono' | 'header';

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
  // Use appropriate logo based on variant
  const getLogoSrc = () => {
    switch (variant) {
      case 'header':
        return '/logo-header.png';
      case 'mono':
        return '/Logo Báltica Escala de Grises.png';
      case 'full':
      case 'compact':
      case 'isotipo':
      default:
        return '/main-logo.png';
    }
  };

  return (
    <img
      src={getLogoSrc()}
      alt="Báltica Education"
      style={{ height: size, width: 'auto' }}
      className={`object-contain ${className}`}
    />
  );
}

export default BalticaLogo;
