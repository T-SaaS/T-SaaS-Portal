import { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        {description && <p className="text-slate-600 mt-2">{description}</p>}
      </div>
      {children && <div className="flex space-x-2">{children}</div>}
    </div>
  );
}
 