import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoField } from "@/atoms/InfoField";
import { LucideIcon } from "lucide-react";

export interface InfoCardProps {
  title: string;
  icon?: LucideIcon;
  fields: Array<{
    label: string;
    value: string | React.ReactNode;
  }>;
}

export function InfoCard({ title, icon: Icon, fields }: InfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <InfoField key={index} label={field.label} value={field.value} />
        ))}
      </CardContent>
    </Card>
  );
}
 