"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const testimonials = [
  {
    name_en: "Sarah Mitchell",
    name_ar: "سارة ميتشيل",
    role_en: "Product Manager",
    role_ar: "مديرة منتجات",
    type: "ENFJ",
    avatar: "#6C63FF",
    rating: 5,
    text_en: "Nafsiiq completely changed how I understand my team dynamics. The INTJ analysis was spot-on and the career suggestions were incredibly insightful.",
    text_ar: "نفسيّك غيّر تمامًا كيفية فهمي لديناميكيات فريقي. كان تحليل INTJ دقيقًا جدًا واقتراحات المسار المهني كانت ثاقبة بشكل لا يصدق.",
  },
  {
    name_en: "Ahmed Al-Rashid",
    name_ar: "أحمد الراشد",
    role_en: "Software Engineer",
    role_ar: "مهندس برمجيات",
    type: "INTP",
    avatar: "#00C9A7",
    rating: 5,
    text_en: "The depth of analysis here is remarkable. I've taken many personality tests, but Nafsiiq's breakdown of my INTP traits was the most accurate I've seen.",
    text_ar: "عمق التحليل هنا رائع. أجريت العديد من اختبارات الشخصية، لكن تحليل نفسيّك لسمات INTP الخاصة بي كان الأدق الذي رأيته.",
  },
  {
    name_en: "Mia Rodriguez",
    name_ar: "ميا رودريغيز",
    role_en: "Clinical Psychologist",
    role_ar: "طبيبة نفسية سريرية",
    type: "INFJ",
    avatar: "#FF6584",
    rating: 5,
    text_en: "As a psychologist, I was skeptical at first. But the depth and accuracy of Nafsiiq's personality assessments genuinely impressed me. I now recommend it to clients.",
    text_ar: "كطبيبة نفسية، كنت متشككة في البداية. لكن عمق ودقة تقييمات الشخصية في نفسيّك أثارت إعجابي حقًا. أنا الآن أوصي به للعملاء.",
  },
  {
    name_en: "David Chen",
    name_ar: "ديفيد تشن",
    role_en: "Entrepreneur",
    role_ar: "رائد أعمال",
    type: "ENTJ",
    avatar: "#FFB347",
    rating: 5,
    text_en: "The career insights and leadership analysis helped me make a major career pivot. Understanding my ENTJ traits was genuinely life-changing.",
    text_ar: "ساعدتني رؤى المسار المهني وتحليل القيادة على إجراء تحول مهني كبير. فهم سمات ENTJ الخاصة بي كان محوّلًا للحياة بحق.",
  },
  {
    name_en: "Fatima Hassan",
    name_ar: "فاطمة حسن",
    role_en: "University Student",
    role_ar: "طالبة جامعية",
    type: "ISFJ",
    avatar: "#8B85FF",
    rating: 5,
    text_en: "I was confused about my career path, but Nafsiiq's ISFJ analysis helped me understand why I'm drawn to helping professions. Now I'm pursuing nursing!",
    text_ar: "كنت مرتبكة بشأن مساري المهني، لكن تحليل نفسيّك ISFJ ساعدني على فهم سبب انجذابي للمهن المساعِدة. الآن أدرس التمريض!",
  },
  {
    name_en: "Marcus Johnson",
    name_ar: "ماركوس جونسون",
    role_en: "Team Lead",
    role_ar: "قائد فريق",
    type: "ESTP",
    avatar: "#F4A261",
    rating: 5,
    text_en: "Fast, accurate, and beautifully designed. The Arabic interface worked perfectly and the RTL layout was seamless. Highly recommend!",
    text_ar: "سريع ودقيق ومصمم بشكل جميل. عمل الواجهة العربية بشكل مثالي وكان تخطيط RTL سلسًا. أوصي به بشدة!",
  },
];

export function TestimonialsSection() {
  const { t, dir, locale } = useLanguage();

  return (
    <section id="testimonials" dir={dir} className="py-24 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-[var(--primary-faint)] text-[var(--primary)] rounded-full px-4 py-1.5 text-sm font-semibold mb-4 border border-[#6C63FF33]"
          >
            {dir === "rtl" ? "⭐ التقييمات" : "⭐ Testimonials"}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="heading-lg text-[var(--text)] mb-4"
          >
            {t("testimonialsTitle")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[var(--text-muted)] max-w-xl mx-auto"
          >
            {t("testimonialsSubtitle")}
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.name_en}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="relative p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] card-hover overflow-hidden"
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 opacity-5">
                <Quote size={48} />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <Star key={j} size={14} className="fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
                "{locale === "ar" ? item.text_ar : item.text_en}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: item.avatar }}
                >
                  {(locale === "ar" ? item.name_ar : item.name_en)[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text)]">
                    {locale === "ar" ? item.name_ar : item.name_en}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {locale === "ar" ? item.role_ar : item.role_en}
                  </p>
                </div>
                <div className="ml-auto">
                  <span className="text-xs font-bold px-2 py-1 rounded-lg text-white" style={{ background: item.avatar }}>
                    {item.type}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
