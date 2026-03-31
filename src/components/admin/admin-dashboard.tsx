"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

import type { BannerItem, EditableTeamMember } from "@/lib/site-cms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AdminDashboardProps = {
  initialApplicationsOpen: boolean;
  initialBanners: BannerItem[];
  initialTeamMembers: EditableTeamMember[];
};

type AdminToast = {
  id: number;
  title: string;
  tone: "success" | "error" | "info";
};

export function AdminDashboard({
  initialApplicationsOpen,
  initialBanners,
  initialTeamMembers,
}: AdminDashboardProps) {
  const router = useRouter();
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [applicationsOpen, setApplicationsOpenState] = useState(initialApplicationsOpen);
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [memberLoading, setMemberLoading] = useState(false);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [toasts, setToasts] = useState<AdminToast[]>([]);
  const [banners, setBanners] = useState<BannerItem[]>(initialBanners);
  const [bannerLoading, setBannerLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
  });

  function showToast(tone: AdminToast["tone"], title: string) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current, { id, title, tone }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  }

  function resetMemberForm() {
    setEditingMemberId(null);
    setForm({
      name: "",
      role: "",
    });
    setImageFile(null);
    setFileInputKey((current) => current + 1);
  }

  async function toggleApplications(nextValue: boolean) {
    setToggleLoading(true);

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
      showToast(
        "success",
        data.applicationsOpen ? "Applications are now open." : "Applications are now closed."
      );
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Could not update application status."
      );
    } finally {
      setToggleLoading(false);
    }
  }

  function updateBannerText(index: number, value: string) {
    setBanners((prev) => prev.map((b, i) => (i === index ? { text: value } : b)));
  }

  function addBannerRow() {
    setBanners((prev) => [...prev, { text: "" }]);
  }

  async function removeBannerRow(index: number) {
    const next = banners.filter((_, i) => i !== index);
    setBanners(next);

    const filtered = next.filter((b) => b.text.trim());
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banners: filtered }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Could not remove banner.");
      }

      showToast("success", "Banner removed.");
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Could not remove banner.");
    }
  }

  async function saveBanners() {
    setBannerLoading(true);
    const filtered = banners.filter((b) => b.text.trim());

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banners: filtered }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Could not update banners.");
      }

      setBanners(filtered.length > 0 ? filtered : []);
      showToast("success", filtered.length > 0 ? "Banners updated." : "Banners cleared.");
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Could not update banners.");
    } finally {
      setBannerLoading(false);
    }
  }

  async function clearBanners() {
    setBanners([]);
    setBannerLoading(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banners: [] }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Could not clear banners.");
      }

      showToast("success", "Banners cleared.");
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Could not clear banners.");
    } finally {
      setBannerLoading(false);
    }
  }

  async function saveMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMemberLoading(true);

    try {
      if (!editingMemberId && !imageFile) {
        throw new Error("Please upload an image before adding a team member.");
      }

      const payload = new FormData();
      if (editingMemberId) {
        payload.append("id", editingMemberId);
      }
      payload.append("name", form.name);
      payload.append("role", form.role);
      if (imageFile) {
        payload.append("image", imageFile);
      }

      const response = await fetch("/api/admin/team", {
        method: editingMemberId ? "PATCH" : "POST",
        body: payload,
      });

      const data = (await response.json()) as {
        error?: string;
        teamMembers?: EditableTeamMember[];
      };

      if (!response.ok || !Array.isArray(data.teamMembers)) {
        throw new Error(data.error || "Could not save team member.");
      }

      setTeamMembers(data.teamMembers.filter(m => m.role.toLowerCase() === "board member"));
      resetMemberForm();
      showToast("success", editingMemberId ? "Team member updated." : "Team member added.");
    } catch (error) {
      showToast(
        "error",
        error instanceof Error
          ? error.message
          : editingMemberId
            ? "Could not update team member."
            : "Could not add team member."
      );
    } finally {
      setMemberLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  async function removeMember(id: string) {
    setRemovingMemberId(id);

    try {
      const response = await fetch("/api/admin/team", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = (await response.json()) as {
        error?: string;
        teamMembers?: EditableTeamMember[];
      };

      if (!response.ok || !Array.isArray(data.teamMembers)) {
        throw new Error(data.error || "Could not remove team member.");
      }

      setTeamMembers(data.teamMembers.filter(m => m.role.toLowerCase() === "board member"));
      if (editingMemberId === id) {
        resetMemberForm();
      }
      showToast("success", "Team member removed.");
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Could not remove team member."
      );
    } finally {
      setRemovingMemberId(null);
    }
  }

  function startEditingMember(member: EditableTeamMember) {
    setEditingMemberId(member.id);
    setForm({
      name: member.name,
      role: member.role,
    });
    setImageFile(null);
    setFileInputKey((current) => current + 1);
    showToast("info", `Editing ${member.name}. Save changes when ready.`);
  }

  return (
    <>
      <div className="fixed right-4 bottom-4 z-[80] flex w-full max-w-sm flex-col gap-3" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-sm ${
              toast.tone === "success"
                ? "border-emerald-500/35 bg-emerald-500/12 text-emerald-100"
                : toast.tone === "error"
                  ? "border-red-500/35 bg-red-500/12 text-red-100"
                  : "border-sky-500/35 bg-sky-500/12 text-sky-100"
            }`}
          >
            <div className="flex items-start gap-3">
              {toast.tone === "success" ? (
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-300" />
              ) : toast.tone === "error" ? (
                <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-300" />
              ) : (
                <Info className="mt-0.5 size-5 shrink-0 text-sky-300" />
              )}
              <p className="text-sm font-medium">{toast.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <Card className="border-border bg-card/80">
            <CardHeader>
              <CardTitle className="axion-title text-2xl text-foreground">Applications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-7 text-muted-foreground">
                Current state:{" "}
                <span className="font-semibold text-foreground">
                  {applicationsOpen ? "Open" : "Closed"}
                </span>
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
            </CardContent>
          </Card>

          <Card className="border-border bg-card/80">
            <CardHeader>
              <CardTitle className="axion-title text-2xl text-foreground">Announcement Banners</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {banners.map((banner, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={banner.text}
                    onChange={(e) => updateBannerText(index, e.target.value)}
                    className="h-11 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/35"
                    placeholder="Banner text"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeBannerRow(index)}
                    className="shrink-0 rounded-full border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/15 hover:text-red-500"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addBannerRow}
                className="rounded-full border-border bg-card/70 hover:bg-accent"
              >
                + Add announcement
              </Button>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  disabled={bannerLoading}
                  onClick={saveBanners}
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {bannerLoading ? "Saving..." : "Save banners"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={bannerLoading || banners.length === 0}
                  onClick={clearBanners}
                  className="rounded-full border-border bg-card/70 hover:bg-accent"
                >
                  Clear all
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Multiple banners rotate every 30 seconds on the homepage. Remove all to hide the banner.
              </p>
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
            <CardTitle className="axion-title text-2xl text-foreground">Team Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="grid gap-4" onSubmit={saveMember}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">
                  {editingMemberId ? "Edit team member" : "Add team member"}
                </p>
                {editingMemberId ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetMemberForm}
                    className="rounded-full border-border bg-card/70 hover:bg-accent"
                  >
                    Cancel edit
                  </Button>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Name
                  </label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, name: event.target.value }))
                    }
                    className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/35"
                    placeholder="Full name"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="role" className="text-sm font-medium text-foreground">
                    Position
                  </label>
                  <input
                    id="role"
                    value={form.role}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, role: event.target.value }))
                    }
                    className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/35"
                    placeholder="Founder or Board Member"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="image" className="text-sm font-medium text-foreground">
                  Image upload
                </label>
                <input
                  key={fileInputKey}
                  id="image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-primary/15 file:px-3 file:py-1.5 file:text-primary focus:ring-2 focus:ring-primary/35"
                />
                <p className="text-xs text-muted-foreground">
                  {editingMemberId
                    ? "Upload a new image only if you want to replace the current one. It will be auto-cropped and converted into a consistent portrait format in public/uploads/team."
                    : "Upload PNG, JPG, WEBP, or AVIF. It will be auto-cropped and converted into a consistent portrait format in public/uploads/team."}
                </p>
                {imageFile ? (
                  <p className="text-xs text-muted-foreground">Selected file: {imageFile.name}</p>
                ) : null}
              </div>

              <Button
                type="submit"
                disabled={memberLoading}
                className="w-fit rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {memberLoading
                  ? editingMemberId
                    ? "Saving..."
                    : "Adding..."
                  : editingMemberId
                    ? "Save changes"
                    : "Add team member"}
              </Button>
            </form>

            <div className="space-y-3 border-t border-border pt-6">
              <p className="text-sm font-medium text-foreground">
                Current members ({teamMembers.length})
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="rounded-2xl border border-border bg-background/70 px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => startEditingMember(member)}
                          className="rounded-full border-border bg-card/70 hover:bg-accent"
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={removingMemberId === member.id}
                          onClick={() => removeMember(member.id)}
                          className="rounded-full border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/15 hover:text-red-500"
                        >
                          {removingMemberId === member.id ? "Removing..." : "Remove"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
