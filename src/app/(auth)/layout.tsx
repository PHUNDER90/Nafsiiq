import { Logo } from "@/components/shared/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh flex">
      {/* Left: form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-12 bg-[var(--bg)]">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Logo size={40} />
          </div>
          {children}
        </div>
      </div>

      {/* Right: decorative panel (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-primary-gradient relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-12">
          <div className="text-6xl mb-6">🧠</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Discover Your True Self
          </h2>
          <p className="text-white/70 text-lg max-w-sm">
            Join thousands who've unlocked deep insights about their personality, strengths, and purpose.
          </p>
          {/* Personality type cloud */}
          <div className="mt-10 flex flex-wrap gap-2 justify-center max-w-xs">
            {["INTJ","ENFP","ISTP","ENTJ","INFJ","ESFP","ISTJ","ENTP","INFP","ESTJ","ENFJ","INTP","ESTP","ISFJ","ISFP","ESFJ"].map((type, i) => (
              <span
                key={type}
                className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-semibold"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
