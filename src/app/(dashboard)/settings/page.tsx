"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Palette, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils/cn";

export default function SettingsPage() {
  const { user, token, refreshUser } = useAuth();
  const { t, dir, locale, setLocale } = useLanguage();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setProfileLoading(true);
    setProfileMsg("");
    try {
      const res = await fetch(`/api/users/${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        await refreshUser();
        setProfileMsg(dir === "rtl" ? "تم حفظ التغييرات" : "Profile updated successfully");
      } else {
        const d = await res.json();
        setProfileMsg(d.error || t("error"));
      }
    } catch {
      setProfileMsg(t("error"));
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) { setPwMsg(t("passwordsDoNotMatch")); return; }
    if (newPw.length < 8) { setPwMsg(t("passwordMinLength")); return; }
    setPwLoading(true);
    setPwMsg("");
    try {
      const res = await fetch(`/api/users/${user?.id}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      if (res.ok) {
        setCurrentPw(""); setNewPw(""); setConfirmPw("");
        setPwMsg(dir === "rtl" ? "تم تغيير كلمة المرور" : "Password changed successfully");
      } else {
        const d = await res.json();
        setPwMsg(d.error || t("error"));
      }
    } catch {
      setPwMsg(t("error"));
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div dir={dir} className="max-w-2xl space-y-6">
      <h1 className="heading-sm text-[var(--text)]">{t("navSettings")}</h1>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6C63FF22] flex items-center justify-center">
              <User size={18} className="text-[#6C63FF]" />
            </div>
            <CardTitle>{dir === "rtl" ? "معلومات الملف الشخصي" : "Profile Information"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <Input
                label={t("nameLabel")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label={t("emailLabel")}
                type="email"
                value={email}
                disabled
                className="opacity-60 cursor-not-allowed"
              />
              {profileMsg && (
                <p className={cn(
                  "text-sm",
                  profileMsg.includes("success") || profileMsg.includes("تم") ? "text-[#00C9A7]" : "text-[#EF4444]"
                )}>
                  {profileMsg}
                </p>
              )}
              <Button type="submit" variant="gradient" loading={profileLoading}>
                {t("save")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Password */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF658422] flex items-center justify-center">
              <Lock size={18} className="text-[#FF6584]" />
            </div>
            <CardTitle>{t("changePassword")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSave} className="space-y-4">
              <Input
                label={t("currentPassword")}
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                required
              />
              <Input
                label={t("newPassword")}
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                required
              />
              <Input
                label={t("confirmNewPassword")}
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                required
              />
              {pwMsg && (
                <p className={cn(
                  "text-sm",
                  pwMsg.includes("success") || pwMsg.includes("تم") ? "text-[#00C9A7]" : "text-[#EF4444]"
                )}>
                  {pwMsg}
                </p>
              )}
              <Button type="submit" variant="gradient" loading={pwLoading}>
                {t("changePassword")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00C9A722] flex items-center justify-center">
              <Palette size={18} className="text-[#00C9A7]" />
            </div>
            <CardTitle>{dir === "rtl" ? "المظهر" : "Appearance"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {(["light", "dark", "system"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setTheme(opt)}
                  className={cn(
                    "flex-1 py-2 rounded-xl text-sm font-medium border-2 transition-all",
                    theme === opt
                      ? "border-[var(--primary)] bg-[var(--primary-faint)] text-[var(--primary)]"
                      : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]"
                  )}
                >
                  {opt === "light" ? (dir === "rtl" ? "فاتح" : "Light") :
                   opt === "dark" ? (dir === "rtl" ? "داكن" : "Dark") :
                   (dir === "rtl" ? "تلقائي" : "System")}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Language */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6C63FF22] flex items-center justify-center">
              <Globe size={18} className="text-[#6C63FF]" />
            </div>
            <CardTitle>{dir === "rtl" ? "اللغة" : "Language"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {(["en", "ar"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLocale(lang)}
                  className={cn(
                    "flex-1 py-2 rounded-xl text-sm font-medium border-2 transition-all",
                    locale === lang
                      ? "border-[var(--primary)] bg-[var(--primary-faint)] text-[var(--primary)]"
                      : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]"
                  )}
                >
                  {lang === "en" ? "English" : "العربية"}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
