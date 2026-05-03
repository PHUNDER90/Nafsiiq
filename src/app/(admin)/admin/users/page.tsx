"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Shield, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/lib/utils/cn";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "psychologist" | "admin";
  createdAt: string;
}

export default function AdminUsersPage() {
  const { token } = useAuth();
  const { dir, locale } = useLanguage();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users);
        }
      } catch {}
      finally { setIsLoading(false); }
    };
    if (token) fetchUsers(); else setIsLoading(false);
  }, [token]);

  const handleDelete = async (userId: string) => {
    if (!confirm(dir === "rtl" ? "هل أنت متأكد من حذف هذا المستخدم؟" : "Are you sure you want to delete this user?")) return;
    setDeletingId(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {}
    finally { setDeletingId(null); }
  };

  const roleVariant = (role: string) =>
    role === "admin" ? "destructive" : role === "psychologist" ? "secondary" : "outline";

  return (
    <div dir={dir} className="space-y-6">
      <h1 className="heading-sm text-[var(--text)]">
        {dir === "rtl" ? "إدارة المستخدمين" : "User Management"}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>{users.length} {dir === "rtl" ? "مستخدم" : "users"}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">{[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : (
            <div className="space-y-2">
              {users.map((u, i) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {u.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[var(--text)] truncate">{u.name}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{u.email}</p>
                    <p className="text-xs text-[var(--text-muted)]">{formatDate(u.createdAt, locale)}</p>
                  </div>
                  <Badge variant={roleVariant(u.role)}>{u.role}</Badge>
                  {u.role !== "admin" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(u.id)}
                      loading={deletingId === u.id}
                      className="text-[#EF4444] hover:bg-[#EF444422] hover:text-[#EF4444]"
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
