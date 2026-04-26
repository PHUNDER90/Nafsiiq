"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageToggle } from "@/components/layout/LanguageToggle";

export default function RegisterPage() {
  const { t, dir } = useLanguage();
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = t("required");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = t("invalidEmail");
    if (!password || password.length < 8) newErrors.password = t("passwordMinLength");
    if (password !== confirmPassword) newErrors.confirmPassword = t("passwordsDoNotMatch");
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setServerError("");
    try {
      await register(name, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setServerError(err.message || t("error"));
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
        <h1 className="heading-md text-[var(--text)]">{t("registerTitle")}</h1>
        <p className="text-[var(--text-muted)] mt-1">{t("registerSubtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label={t("nameLabel")}
          type="text"
          placeholder={t("namePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<User size={16} />}
          error={errors.name}
          required
          autoComplete="name"
        />

        <Input
          label={t("emailLabel")}
          type="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail size={16} />}
          error={errors.email}
          required
          autoComplete="email"
        />

        <Input
          label={t("passwordLabel")}
          type={showPass ? "text" : "password"}
          placeholder={t("passwordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
          autoComplete="new-password"
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

        <Input
          label={t("confirmPasswordLabel")}
          type={showPass ? "text" : "password"}
          placeholder={t("confirmPasswordPlaceholder")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
        />

        {serverError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-3 rounded-lg bg-[#EF444422] border border-[#EF4444] text-sm text-[#EF4444]"
          >
            {serverError}
          </motion.div>
        )}

        <Button
          type="submit"
          size="lg"
          variant="gradient"
          className="w-full mt-2"
          loading={isLoading}
        >
          {t("registerBtn")}
        </Button>
      </form>

      <p className="text-xs text-[var(--text-muted)] text-center mt-4">
        {t("termsAgreement")}
      </p>

      <div className="mt-6 text-center">
        <p className="text-sm text-[var(--text-muted)]">
          <Link href="/login" className="text-[var(--primary)] font-medium hover:underline">
            {t("loginLink")}
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
