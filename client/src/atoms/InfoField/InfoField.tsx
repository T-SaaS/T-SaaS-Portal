export interface InfoFieldProps {
  label: string;
  value: string | React.ReactNode;
  className?: string;
}

export function InfoField({ label, value, className = "" }: InfoFieldProps) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="text-slate-900">{value}</div>
    </div>
  );
}
 