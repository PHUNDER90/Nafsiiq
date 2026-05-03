"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { cn } from "@/lib/utils/cn";

export default function LoginPage() {
  const { t, dir } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return t("invalidEmail");
    if (!password || password.length < 8) return t("passwordMinLength");
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setIsLoading(true);
    setError("");
    try {
      const user = await login(email, password);
      if (user.role === "admin") router.push("/admin");
      else if (user.role === "psychologist") router.push("/psychologist");
      else router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || t("error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      dir={dir}
    >
      {/* Top controls */}
      <div className="flex justify-end gap-2 mb-6">
        <ThemeToggle />
        <LanguageToggle />
      </div>

      <div className="mb-8">
        <h1 className="heading-md text-[var(--text)]">{t("loginTitle")}</h1>
        <p className="text-[var(--text-muted)] mt-1">{t("loginSubtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Input
          label={t("emailLabel")}
          type="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail size={16} />}
          required
          autoComplete="email"
        />

        <div className="space-y-1.5">
          <Input
            label={t("passwordLabel")}
            type={showPass ? "text" : "password"}
            placeholder={t("passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            icon={
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            iconPosition="right"
          />
          <div className="flex justify-end">
            <a href="#" className="text-xs text-[var(--primary)] hover:underline">
              {t("forgotPassword")}
            </a>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-3 rounded-lg bg-[#EF444422] border border-[#EF4444] text-sm text-[#EF4444]"
          >
            {error}
          </motion.div>
        )}

        <Button
          type="submit"
          size="lg"
          variant="gradient"
          className="w-full"
          loading={isLoading}
        >
          {t("loginBtn")}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-[var(--text-muted)]">
          <Link href="/register" className="text-[var(--primary)] font-medium hover:underline">
            {t("registerLink")}
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
