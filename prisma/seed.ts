import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

// ── Personalities ────────────────────────────────────────────────────────────
const personalities = [
  { id: 1, code: "S1", nameAr: "القائد",      emoji: "😎", color: "#6C63FF", descriptionAr: "شخص واثق من نفسه، يتخذ القرارات بحسم ويؤثر في من حوله. يحب السيطرة والتوجيه ويسعى دائماً نحو القمة." },
  { id: 2, code: "S2", nameAr: "الاجتماعي",   emoji: "🤝", color: "#00C9A7", descriptionAr: "شخص يستمد طاقته من الناس ويحب التواصل وبناء العلاقات. يجعل الجميع يشعر بالترحيب والانتماء." },
  { id: 3, code: "S3", nameAr: "المحلل",      emoji: "📊", color: "#3B82F6", descriptionAr: "شخص يفكر بعمق ومنطق، يحب الأرقام والبيانات ويسعى دائماً لفهم الأشياء بشكل كامل قبل القرار." },
  { id: 4, code: "S4", nameAr: "الهادئ",      emoji: "🌿", color: "#10B981", descriptionAr: "شخص هادئ ومتزن، يفضل الاستقرار والوضوح ويكون صخرة الأمان لمن حوله في الأوقات الصعبة." },
  { id: 5, code: "S5", nameAr: "المبدع",      emoji: "🎨", color: "#F59E0B", descriptionAr: "شخص مليء بالأفكار الجديدة، يرى العالم بطريقة مختلفة ويحول الخيال إلى واقع بأساليب مبتكرة." },
  { id: 6, code: "S6", nameAr: "الحذر",       emoji: "🛡️", color: "#6B7280", descriptionAr: "شخص يفكر قبل أن يتصرف، يدرس المخاطر بعناية ويضع خططاً محكمة لتجنب المفاجآت." },
  { id: 7, code: "S7", nameAr: "المتعاطف",    emoji: "💙", color: "#EC4899", descriptionAr: "شخص حساس لمشاعر الآخرين، يضع نفسه مكانهم ويقدم الدعم والرعاية بصدق وإخلاص." },
  { id: 8, code: "S8", nameAr: "الطموح",      emoji: "🚀", color: "#EF4444", descriptionAr: "شخص يضع أهدافاً كبيرة ولا يتوقف حتى يحققها. طاقته لا تنضب وتحدياته تزيده قوة." },
  { id: 9, code: "S9", nameAr: "المرح",       emoji: "😄", color: "#F97316", descriptionAr: "شخص خفيف الظل يضفي البهجة على كل مكان. يرى الجانب المضيء في كل شيء ويجعل الحياة أجمل." },
  { id: 10, code: "S10", nameAr: "الانعزالي", emoji: "🌙", color: "#8B5CF6", descriptionAr: "شخص يفضل عالمه الداخلي، يحتاج وقتاً بمفرده ليشحن طاقته. عميق التفكير وانتقائي في علاقاته." },
];

// ── Axes ─────────────────────────────────────────────────────────────────────
const axes = [
  { id: 1, nameAr: "الطاقة" },
  { id: 2, nameAr: "القرار" },
  { id: 3, nameAr: "العلاقات" },
  { id: 4, nameAr: "الضغط" },
  { id: 5, nameAr: "الهدف" },
];

// ── Questions + options + scores ─────────────────────────────────────────────
// scores: null = 0 points (not stored). Format: [S1,S2,S3,S4,S5,S6,S7,S8,S9,S10]
const questions = [
  // ── Axis 1: الطاقة ──────────────────────────────────────────────────────
  {
    id: 1, axisId: 1, orderNum: 1,
    textAr: "زُوِّدت بعطلة أسبوع كامل وحر، ماذا تفعل؟",
    options: [
      { orderNum: 1, textAr: "أنظم لقاءات وأستغل الوقت بمشاريع",    scores: [2,0,1,0,1,0,0,3,0,0] },
      { orderNum: 2, textAr: "أجمع الأصدقاء وأقضي الوقت معهم",       scores: [0,3,0,2,0,0,2,0,2,0] },
      { orderNum: 3, textAr: "أجلس وحدي أقرأ أو أفكر",               scores: [0,0,3,2,1,1,0,0,0,3] },
      { orderNum: 4, textAr: "أجرب شيئاً جديداً لم أفعله من قبل",   scores: [1,1,0,0,3,0,0,1,2,0] },
    ],
  },
  {
    id: 2, axisId: 1, orderNum: 2,
    textAr: "أيهما أقرب إليك؟",
    options: [
      { orderNum: 1, textAr: "أستمد طاقتي من الناس",   scores: [2,3,0,0,0,0,2,1,3,0] },
      { orderNum: 2, textAr: "أستمد طاقتي من الوحدة",  scores: [0,0,3,3,2,2,0,1,0,3] },
    ],
  },
  {
    id: 3, axisId: 1, orderNum: 3,
    textAr: "بعد يوم طويل ومرهق، ما الذي يريحك فعلاً؟",
    options: [
      { orderNum: 1, textAr: "أتكلم مع أحد أثق به",        scores: [0,2,0,1,0,0,3,0,1,0] },
      { orderNum: 2, textAr: "أنام أو أجلس بصمت تام",      scores: [0,0,1,3,0,2,0,0,0,3] },
      { orderNum: 3, textAr: "أمارس هواية أو أبدع شيئاً",  scores: [0,0,1,1,3,0,0,1,1,2] },
      { orderNum: 4, textAr: "أضع خطة لليوم التالي",        scores: [2,0,2,0,0,3,0,3,0,0] },
    ],
  },
  // ── Axis 2: القرار ──────────────────────────────────────────────────────
  {
    id: 4, axisId: 2, orderNum: 4,
    textAr: "عُرض عليك عرض مغرٍ لكنه محفوف بالمخاطر، ماذا تفعل؟",
    options: [
      { orderNum: 1, textAr: "أقبل فوراً، الفرص لا تتكرر",          scores: [3,1,0,0,2,0,0,3,2,0] },
      { orderNum: 2, textAr: "أستشير من أثق بهم أولاً",              scores: [0,2,1,1,0,1,3,0,0,0] },
      { orderNum: 3, textAr: "أجلس وأحلل المخاطر والفوائد",           scores: [0,0,3,1,0,3,0,2,0,1] },
      { orderNum: 4, textAr: "أتريث وأنتظر حتى أطمئن",              scores: [0,0,2,3,0,3,1,0,0,2] },
    ],
  },
  {
    id: 5, axisId: 2, orderNum: 5,
    textAr: "عند اتخاذ القرار تعتمد أكثر على؟",
    options: [
      { orderNum: 1, textAr: "العقل والمنطق والأرقام",        scores: [2,0,3,0,1,3,0,2,0,1] },
      { orderNum: 2, textAr: "الحدس والمشاعر والغريزة",       scores: [1,3,0,2,0,3,2,0,2,1] },
    ],
  },
  {
    id: 6, axisId: 2, orderNum: 6,
    textAr: "فريقك اختلف في قرار مهم ولا يوجد اتفاق، ماذا تفعل؟",
    options: [
      { orderNum: 1, textAr: "أحسم الأمر وأتخذ القرار أنا",         scores: [3,0,1,0,0,1,0,3,0,0] },
      { orderNum: 2, textAr: "أجمع الآراء وأبحث عن توافق",           scores: [0,3,0,2,0,0,2,0,2,0] },
      { orderNum: 3, textAr: "أطلب مزيداً من البيانات أولاً",        scores: [0,0,3,1,1,3,0,2,0,1] },
      { orderNum: 4, textAr: "أقترح فكرة مبتكرة تكسر الجمود",       scores: [0,0,1,0,3,0,0,1,2,0] },
    ],
  },
  {
    id: 7, axisId: 2, orderNum: 7,
    textAr: "ما أكبر خطأ تقع فيه عند اتخاذ القرارات؟",
    options: [
      { orderNum: 1, textAr: "أتسرع دون أن أفكر كفاية",             scores: [3,1,0,0,2,0,0,2,3,0] },
      { orderNum: 2, textAr: "أفكر كثيراً حتى تفوتني الفرصة",       scores: [0,0,3,2,0,3,1,0,0,2] },
      { orderNum: 3, textAr: "أتأثر بمشاعر الآخرين أكثر مما ينبغي", scores: [0,1,0,3,0,0,3,0,1,0] },
      { orderNum: 4, textAr: "أمل من الموضوع قبل أن أكمله",          scores: [0,0,1,0,3,1,0,1,2,2] },
    ],
  },
  {
    id: 8, axisId: 2, orderNum: 8,
    textAr: "أيهما أقرب إليك؟",
    options: [
      { orderNum: 1, textAr: "أفضل التخطيط المسبق",    scores: [1,0,3,2,0,3,1,2,0,1] },
      { orderNum: 2, textAr: "أفضل التصرف اللحظي",     scores: [3,2,0,0,3,0,0,1,3,0] },
    ],
  },
  // ── Axis 3: العلاقات ────────────────────────────────────────────────────
  {
    id: 9, axisId: 3, orderNum: 9,
    textAr: "دخلت حفلة ولا تعرف أحداً، ماذا تفعل؟",
    options: [
      { orderNum: 1, textAr: "أبادر وأعرّف نفسي على الجميع",          scores: [3,3,0,0,1,0,0,2,2,0] },
      { orderNum: 2, textAr: "أنتظر أن يبادرني أحد",                   scores: [0,1,1,2,0,1,2,0,0,2] },
      { orderNum: 3, textAr: "أجد ركناً هادئاً وألاحظ من بعيد",       scores: [0,0,3,2,2,2,0,0,0,3] },
      { orderNum: 4, textAr: "أكسر الجو بنكتة أو موقف مضحك",          scores: [1,2,0,0,1,0,0,0,3,0] },
    ],
  },
  {
    id: 10, axisId: 3, orderNum: 10,
    textAr: "ما الذي يقوله عنك أصدقاؤك أكثر شيء؟",
    options: [
      { orderNum: 1, textAr: "إنك قائد وحاسم وواثق",          scores: [3,0,0,0,0,1,0,2,0,0] },
      { orderNum: 2, textAr: "إنك مستمع وحنون وتفهم",         scores: [0,1,1,2,0,0,3,0,1,0] },
      { orderNum: 3, textAr: "إنك مرح وخفيف وتشحن الجو",      scores: [0,2,0,0,1,0,0,0,3,0] },
      { orderNum: 4, textAr: "إنك عميق وهادئ وتفكر كثيراً",  scores: [0,0,3,2,1,2,0,1,0,3] },
    ],
  },
  {
    id: 11, axisId: 3, orderNum: 11,
    textAr: "صديق قريب أخطأ في حقك، كيف تتصرف؟",
    options: [
      { orderNum: 1, textAr: "أكلمه مباشرة وأقول ما أشعر به",          scores: [3,1,0,0,0,0,1,2,0,0] },
      { orderNum: 2, textAr: "أتجاوز الموضوع لأن العلاقة أهم",          scores: [0,2,0,3,0,0,3,0,2,0] },
      { orderNum: 3, textAr: "أبتعد مؤقتاً حتى أهضم الموضوع",           scores: [0,0,2,1,1,2,0,0,0,3] },
      { orderNum: 4, textAr: "أحول الموضوع لنقاش هادئ ومنطقي",         scores: [1,0,3,1,0,2,1,1,0,0] },
    ],
  },
  {
    id: 12, axisId: 3, orderNum: 12,
    textAr: "في علاقاتك، أيهما أنت؟",
    options: [
      { orderNum: 1, textAr: "من يعطي الدعم والاهتمام",      scores: [0,2,0,2,0,0,3,0,1,0] },
      { orderNum: 2, textAr: "من يبحث عن الاستقلالية",       scores: [3,0,2,0,2,2,0,2,0,3] },
    ],
  },
  {
    id: 13, axisId: 3, orderNum: 13,
    textAr: "رأيت شخصاً يمر بضائقة أمامك، ماذا تفعل؟",
    options: [
      { orderNum: 1, textAr: "أبادر فوراً وأسأله كيف أساعد",    scores: [0,2,0,1,0,0,3,0,1,0] },
      { orderNum: 2, textAr: "أراقب أولاً وأقدّر الموقف",       scores: [2,0,3,2,1,3,0,1,0,2] },
      { orderNum: 3, textAr: "أحاول أشغله وأرفع معنوياته",      scores: [0,3,0,1,0,0,2,0,2,0] },
      { orderNum: 4, textAr: "أقدم له حلاً عملياً لمشكلته",     scores: [0,0,3,1,1,0,0,2,0,0] },
    ],
  },
  // ── Axis 4: الضغط ───────────────────────────────────────────────────────
  {
    id: 14, axisId: 4, orderNum: 14,
    textAr: "في آخر لحظة اكتشفت خطأً كبيراً في عمل مهم، ماذا تفعل؟",
    options: [
      { orderNum: 1, textAr: "أتحرك فوراً لإصلاحه بأي طريقة",   scores: [3,0,0,0,2,0,0,3,1,0] },
      { orderNum: 2, textAr: "أتنفس وأرتب أفكاري أولاً",          scores: [0,0,2,3,0,2,1,0,0,2] },
      { orderNum: 3, textAr: "أطلب المساعدة من الفريق فوراً",     scores: [0,3,0,1,0,0,3,1,0,0] },
      { orderNum: 4, textAr: "أحلل المشكلة وأضع خطة إنقاذ",      scores: [1,0,3,0,1,3,0,2,0,1] },
    ],
  },
  {
    id: 15, axisId: 4, orderNum: 15,
    textAr: "ما الذي يحدث لك تحت الضغط الشديد؟",
    options: [
      { orderNum: 1, textAr: "أصبح أكثر حدة وسيطرة",             scores: [3,0,0,0,1,0,0,3,0,0] },
      { orderNum: 2, textAr: "أبحث عن أحد يسمعني",               scores: [0,3,0,0,0,0,2,0,1,0] },
      { orderNum: 3, textAr: "أنسحب وأحتاج وقتاً بمفردي",        scores: [0,0,2,2,1,2,0,0,0,3] },
      { orderNum: 4, textAr: "أشعر بقلق لكني أكمل",              scores: [0,0,1,1,3,0,1,2,1,0] },
    ],
  },
  {
    id: 16, axisId: 4, orderNum: 16,
    textAr: "في الأزمة، أيهما أنت؟",
    options: [
      { orderNum: 1, textAr: "أتحرك بسرعة حتى لو أخطأت",  scores: [3,1,0,0,2,0,0,3,2,0] },
      { orderNum: 2, textAr: "أتمهل حتى لو تأخرت",         scores: [0,0,3,3,0,3,1,0,0,2] },
    ],
  },
  {
    id: 17, axisId: 4, orderNum: 17,
    textAr: "انتقدك أحدهم بشدة أمام الآخرين، ماذا تفعل؟",
    options: [
      { orderNum: 1, textAr: "أرد عليه فوراً بثقة وحزم",              scores: [3,0,0,0,0,0,0,2,1,0] },
      { orderNum: 2, textAr: "أصمت وأهضم الموقف ثم أرد لاحقاً",      scores: [0,0,2,2,1,2,0,1,0,3] },
      { orderNum: 3, textAr: "أتأثر كثيراً لكني لا أُظهر ذلك",       scores: [0,1,1,1,0,1,3,0,0,1] },
      { orderNum: 4, textAr: "أحول الموقف بخفة لتهدئة الجو",          scores: [0,3,0,0,0,0,1,0,2,0] },
    ],
  },
  {
    id: 18, axisId: 4, orderNum: 18,
    textAr: "فشلت في شيء كنت تتوقع النجاح فيه، ماذا تفعل؟",
    options: [
      { orderNum: 1, textAr: "أحلل الأسباب وأضع خطة جديدة فوراً",   scores: [2,0,3,0,0,2,0,3,0,0] },
      { orderNum: 2, textAr: "أحتاج وقتاً للتعافي ثم أعود",          scores: [0,0,1,3,1,1,2,0,0,2] },
      { orderNum: 3, textAr: "أتكلم عنه مع أحد قريب",               scores: [0,1,0,3,0,0,3,0,1,0] },
      { orderNum: 4, textAr: "أتجاوزه بسرعة وأكمل",                  scores: [3,1,0,0,2,0,0,2,3,0] },
    ],
  },
  // ── Axis 5: الهدف ───────────────────────────────────────────────────────
  {
    id: 19, axisId: 5, orderNum: 19,
    textAr: "عند اختيار وظيفة، الأهم بالنسبة لك؟",
    options: [
      { orderNum: 1, textAr: "السلطة والتأثير والمكانة",            scores: [3,0,0,0,0,0,0,2,0,0] },
      { orderNum: 2, textAr: "العلاقات الجيدة والجو المريح",        scores: [0,3,0,2,0,0,2,0,2,0] },
      { orderNum: 3, textAr: "التحدي الفكري والتطور",               scores: [0,0,3,0,2,1,0,2,0,1] },
      { orderNum: 4, textAr: "الاستقرار والأمان والوضوح",           scores: [0,0,1,3,0,3,1,0,0,2] },
      { orderNum: 5, textAr: "الحرية والإبداع والتجديد",            scores: [0,0,0,0,3,0,0,1,1,2] },
    ],
  },
  {
    id: 20, axisId: 5, orderNum: 20,
    textAr: "ما الذي يشعرك بالرضا الحقيقي؟",
    options: [
      { orderNum: 1, textAr: "أن يتبعك الناس ويحترموا رأيك",         scores: [3,0,0,0,0,0,0,2,1,0] },
      { orderNum: 2, textAr: "أن تُحَبَّ وتشعر بالانتماء",            scores: [0,3,0,2,0,0,3,0,1,0] },
      { orderNum: 3, textAr: "أن تفهم شيئاً معقداً وتحله",           scores: [0,0,3,0,2,2,0,1,0,1] },
      { orderNum: 4, textAr: "أن تنجز هدفاً كبيراً كنت تسعى إليه",  scores: [1,0,1,0,0,1,0,3,0,1] },
      { orderNum: 5, textAr: "أن تصنع شيئاً من لا شيء",             scores: [0,0,1,0,3,0,0,1,2,0] },
    ],
  },
  {
    id: 21, axisId: 5, orderNum: 21,
    textAr: "نجحت في مشروع كبير، ما أول ما تفعله؟",
    options: [
      { orderNum: 1, textAr: "أعلن عنه وأحتفل بالإنجاز",             scores: [3,2,0,0,1,0,0,2,2,0] },
      { orderNum: 2, textAr: "أشارك الفضل مع من ساعدني",             scores: [0,2,0,2,0,0,3,0,1,0] },
      { orderNum: 3, textAr: "أحلل ما نجح وما يمكن تحسينه",          scores: [0,0,3,0,0,3,0,2,0,1] },
      { orderNum: 4, textAr: "أضع هدفاً أكبر وأبدأ فوراً",           scores: [2,0,0,0,2,0,0,3,0,0] },
    ],
  },
  {
    id: 22, axisId: 5, orderNum: 22,
    textAr: "ما الذي يدفعك للعمل أكثر؟",
    options: [
      { orderNum: 1, textAr: "الفوز والتفوق على الآخرين",            scores: [3,0,1,0,0,0,0,3,1,0] },
      { orderNum: 2, textAr: "مساعدة الآخرين والتأثير فيهم",         scores: [0,2,0,1,0,0,3,0,0,0] },
      { orderNum: 3, textAr: "الفهم العميق والاكتشاف",               scores: [0,0,3,1,2,2,0,1,0,2] },
      { orderNum: 4, textAr: "الحرية والاستقلالية",                  scores: [1,0,0,1,2,1,0,0,1,3] },
    ],
  },
  {
    id: 23, axisId: 5, orderNum: 23,
    textAr: "لو كان لك يوم واحد تفعل فيه ما تريد تماماً، ماذا تختار؟",
    options: [
      { orderNum: 1, textAr: "أقود مشروعاً أو أؤثر في قرار كبير",   scores: [3,0,0,0,0,0,0,2,0,0] },
      { orderNum: 2, textAr: "أجمع أحبائي في يوم لا يُنسى",          scores: [0,3,0,2,0,0,2,0,2,0] },
      { orderNum: 3, textAr: "أقرأ وأفكر وأكتب أفكاري",              scores: [0,0,3,2,1,1,0,0,0,3] },
      { orderNum: 4, textAr: "أجرب تجربة إبداعية جديدة",             scores: [0,0,1,0,3,0,0,1,2,0] },
      { orderNum: 5, textAr: "أنجز مهمة كنت أؤجلها",                 scores: [1,0,3,0,0,3,0,3,0,0] },
    ],
  },
  {
    id: 24, axisId: 5, orderNum: 24,
    textAr: "ما الجملة التي تصف حياتك المثالية؟",
    options: [
      { orderNum: 1, textAr: "أن أكون في القمة وأصنع الفارق",         scores: [3,0,0,0,0,0,0,2,0,0] },
      { orderNum: 2, textAr: "أن أكون محاطاً بمن أحب ويحبني",        scores: [0,3,0,2,0,0,3,0,1,0] },
      { orderNum: 3, textAr: "أن أفهم الحياة وأتركها أجمل",          scores: [0,0,2,1,0,3,1,0,0,1] },
      { orderNum: 4, textAr: "أن أعيش بأمان وهدوء واستقرار",         scores: [0,0,0,3,1,0,2,0,0,2] },
      { orderNum: 5, textAr: "أن أكون حراً أفعل ما أشاء",            scores: [1,0,1,0,1,1,0,1,2,3] },
    ],
  },
];

async function main() {
  console.log("Seeding database...");

  console.log("Seeding data...");

  // Personalities
  for (const p of personalities) {
    await prisma.personality.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    });
  }
  console.log("✓ Personalities");

  // Axes
  for (const a of axes) {
    await prisma.axis.upsert({
      where: { id: a.id },
      update: a,
      create: a,
    });
  }
  console.log("✓ Axes");

  // Questions, options, scores
  for (const q of questions) {
    const { options: opts, ...qData } = q;
    await prisma.question.upsert({
      where: { id: qData.id },
      update: { axisId: qData.axisId, orderNum: qData.orderNum, textAr: qData.textAr },
      create: { id: qData.id, axisId: qData.axisId, orderNum: qData.orderNum, textAr: qData.textAr },
    });

    let optionIdCounter = getOptionStartId(qData.id);
    for (const opt of opts) {
      const optId = optionIdCounter++;
      await prisma.option.upsert({
        where: { id: optId },
        update: { questionId: qData.id, orderNum: opt.orderNum, textAr: opt.textAr },
        create: { id: optId, questionId: qData.id, orderNum: opt.orderNum, textAr: opt.textAr },
      });

      for (let pIdx = 0; pIdx < opt.scores.length; pIdx++) {
        const pts = opt.scores[pIdx];
        if (pts === 0) continue;
        const pId = pIdx + 1;
        await prisma.optionScore.upsert({
          where: { optionId_personalityId: { optionId: optId, personalityId: pId } },
          update: { points: pts },
          create: { optionId: optId, personalityId: pId, points: pts },
        });
      }
    }
  }
  console.log("✓ Questions, options, scores");
  console.log("Seed complete.");
}

// Assign deterministic option IDs based on question order
function getOptionStartId(questionId: number): number {
  const starts: Record<number, number> = {
    1: 1, 2: 5, 3: 7, 4: 11, 5: 15, 6: 17, 7: 21, 8: 25,
    9: 27, 10: 31, 11: 35, 12: 39, 13: 41, 14: 45, 15: 49,
    16: 53, 17: 55, 18: 59, 19: 63, 20: 68, 21: 73, 22: 77,
    23: 81, 24: 86,
  };
  return starts[questionId];
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
