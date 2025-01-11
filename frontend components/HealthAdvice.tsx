import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface HealthAdviceProps {
  advice: string;
  isExtreme: boolean;
}

export function HealthAdvice({ advice, isExtreme }: HealthAdviceProps) {
  return (
    <Card className={`w-full max-w-md ${isExtreme ? 'border-red-500 border-2' : ''}`}>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <AlertCircle className={`w-5 h-5 ${isExtreme ? 'text-red-500' : 'text-blue-500'}`} />
        <h3 className="font-semibold">Health Advice</h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{advice}</p>
      </CardContent>
    </Card>
  );
}
