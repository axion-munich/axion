import Link from "next/link";

import { ApplyForm } from "@/components/apply/apply-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSiteCms } from "@/lib/site-cms";

export const dynamic = "force-dynamic";

export default async function ApplyPage() {
  const cms = await getSiteCms();

  if (!cms.applicationsOpen) {
    return (
      <div className="min-h-screen bg-background py-12">
        <main className="axion-container">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              Back to homepage
            </Link>

            <Badge className="border-primary/35 bg-primary/10 text-primary" variant="outline">
              Student Application
            </Badge>
          </div>

          <Card className="mx-auto w-full max-w-2xl border-border bg-card/80">
            <CardHeader>
              <CardTitle className="axion-title text-3xl text-foreground">
                Applications are currently closed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm leading-7 text-muted-foreground">
                The board has currently paused applications. Please check back later or contact the team directly if you have a question.
              </p>
              <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/#contacts">Contact the team</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return <ApplyForm />;
}
