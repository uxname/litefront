import { m } from "@generated/paraglide/messages";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/card";
import { Bug, Zap } from "lucide-react";
import type { FC } from "react";
import { useErrorBoundary } from "react-error-boundary";

export const ErrorSimulator: FC = () => {
  const { showBoundary } = useErrorBoundary();

  return (
    <Card className="relative items-center justify-center overflow-hidden px-8 py-8">
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-destructive to-warning"
      />
      <Badge className="bg-destructive/10 font-bold text-destructive uppercase">
        <Bug /> {m.home_error_boundary_badge()}
      </Badge>

      <div className="space-y-1 text-center">
        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          {m.home_debug_tool()}
        </p>
        <h3 className="text-xl font-bold tracking-tight">
          {m.home_system_resilience()}
        </h3>
      </div>

      <Button
        variant="destructive"
        onClick={() =>
          showBoundary(
            new Error(
              "Simulated Critical Failure: This is a test of the Error Boundary system.",
            ),
          )
        }
        className="w-full max-w-[200px] shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
      >
        <Zap className="fill-current" />
        {m.home_crash_app()}
      </Button>

      <p className="max-w-[220px] text-center text-xs text-muted-foreground">
        {m.home_error_sim_hint()}
      </p>
    </Card>
  );
};
