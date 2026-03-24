import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isAdminAuthenticated, isAdminCredentialsSet } from "@/lib/admin-auth";
import { getSiteCms } from "@/lib/site-cms";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const credentialsConfigured = isAdminCredentialsSet();
  const authenticated = credentialsConfigured ? await isAdminAuthenticated() : false;
  const cms = authenticated ? await getSiteCms() : null;

  return (
    <div className="min-h-screen bg-background py-12">
      <main className="axion-container space-y-8">
        <div className="space-y-3">
          <Badge className="border-primary/35 bg-primary/10 text-primary" variant="outline">
            Admin
          </Badge>
          <h1 className="axion-title text-4xl text-foreground">Board Dashboard</h1>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            Manage lightweight website content without editing code.
          </p>
        </div>

        {!credentialsConfigured ? (
          <Card className="border-border bg-card/80">
            <CardHeader>
              <CardTitle className="axion-title text-2xl text-foreground">
                Configuration required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-7 text-muted-foreground">
                Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env` to enable the admin page.
              </p>
            </CardContent>
          </Card>
        ) : authenticated && cms ? (
          <AdminDashboard
            initialApplicationsOpen={cms.applicationsOpen}
            initialBanners={cms.banners}
            initialTeamMembers={cms.teamMembers}
          />
        ) : (
          <AdminLoginForm />
        )}
      </main>
    </div>
  );
}
