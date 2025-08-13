export interface StatusIconProps {
  icon: string;
  className?: string;
}

export function StatusIcon({ icon, className = "" }: StatusIconProps) {
  return (
    <div
      className={`flex items-center justify-center w-10 h-10 bg-white/50 rounded-full text-xl ${className}`}
    >
      {icon}
    </div>
  );
}
