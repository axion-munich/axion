"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import type { EditableTeamMember } from "@/lib/site-cms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AdminDashboardProps = {
  initialApplicationsOpen: boolean;
  initialTeamMembers: EditableTeamMember[];
};

export function AdminDashboard({
  initialApplicationsOpen,
  initialTeamMembers,
}: AdminDashboardProps) {
  const router = useRouter();
  const [applicationsOpen, setApplicationsOpenState] = useState(initialApplicationsOpen);
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [memberLoading, setMemberLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [memberMessage, setMemberMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    role: "",
    image: "",
    bio: "",
    expertise: "",
  });

  async function toggleApplications(nextValue: boolean) {
    setToggleLoading(true);
    setStatusMessage("");

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ applicationsOpen: nextValue }),
      });

      const data = (await response.json()) as { error?: string; applicationsOpen?: boolean };

      if (!response.ok || typeof data.applicationsOpen !== "boolean") {
        throw new Error(data.error || "Could not update application status.");
      }

      setApplicationsOpenState(data.applicationsOpen);
      setStatusMessage(data.applicationsOpen ? "Applications are now open." : "Applications are now closed.");
      router.refresh();
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Could not update application status.");
    } finally {
      setToggleLoading(false);
    }
  }

  async function addMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMemberLoading(true);
    setMemberMessage("");

    try {
      const response = await fetch("/api/admin/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as {
        error?: string;
        teamMembers?: EditableTeamMember[];
      };

      if (!response.ok || !Array.isArray(data.teamMembers)) {
        throw new Error(data.error || "Could not add team member.");
      }

      setTeamMembers(data.teamMembers);
      setForm({ name: "", role: "", image: "", bio: "", expertise: "" });
      setMemberMessage("Team member added.");
      router.refresh();
    } catch (error) {
      setMemberMessage(error instanceof Error ? error.message : "Could not add team member.");
    } finally {
      setMemberLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6">
        <Card className="border-border bg-card/80">
          <CardHeader>
            <CardTitle className="axion-title text-2xl text-foreground">
              Applications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-7 text-muted-foreground">
              Current state: <span className="font-semibold text-foreground">{applicationsOpen ? "Open" : "Closed"}</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                disabled={toggleLoading || applicationsOpen}
                onClick={() => toggleApplications(true)}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Open applications
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={toggleLoading || !applicationsOpen}
                onClick={() => toggleApplications(false)}
                className="rounded-full border-border bg-card/70 hover:bg-accent"
              >
                Close applications
              </Button>
            </div>
            {statusMessage ? (
              <p className="text-sm text-muted-foreground">{statusMessage}</p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="border-border bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle className="axion-title text-2xl text-foreground">Session</CardTitle>
            <Button
              type="button"
              variant="outline"
              onClick={logout}
              className="rounded-full border-border bg-card/70 hover:bg-accent"
            >
              Log out
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7 text-muted-foreground">
              This admin page is for lightweight content updates by the board. More controls can be added here later.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card/80">
        <CardHeader>
          <CardTitle className="axion-title text-2xl text-foreground">
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="grid gap-4" onSubmit={addMember}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">Name</label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/35"
                  placeholder="Full name"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="role" className="text-sm font-medium text-foreground">Position</label>
                <input
                  id="role"
                  value={form.role}
                  onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
                  className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/35"
                  placeholder="Founder or Board Member"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="image" className="text-sm font-medium text-foreground">Image URL</label>
              <input
                id="image"
                value={form.image}
                onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))}
                className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/35"
                placeholder="https://..."
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="bio" className="text-sm font-medium text-foreground">Bio (optional)</label>
              <textarea
                id="bio"
                rows={4}
                value={form.bio}
                onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/35"
                placeholder="Short background for the dialog"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="expertise" className="text-sm font-medium text-foreground">Expertise (optional)</label>
              <input
                id="expertise"
                value={form.expertise}
                onChange={(event) => setForm((current) => ({ ...current, expertise: event.target.value }))}
                className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/35"
                placeholder="Comma separated, e.g. Strategy, Finance, Operations"
              />
            </div>

            {memberMessage ? (
              <p className="text-sm text-muted-foreground">{memberMessage}</p>
            ) : null}

            <Button
              type="submit"
              disabled={memberLoading}
              className="w-fit rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {memberLoading ? "Adding..." : "Add team member"}
            </Button>
          </form>

          <div className="space-y-3 border-t border-border pt-6">
            <p className="text-sm font-medium text-foreground">
              Current members ({teamMembers.length})
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {teamMembers.map((member) => (
                <div key={member.id} className="rounded-2xl border border-border bg-background/70 px-4 py-3">
                  <p className="font-medium text-foreground">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
