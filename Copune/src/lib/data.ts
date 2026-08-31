export type Category = {
  slug: string;
  name: string;
  desc: string;
  icon: string;
  tint: string; // tailwind-ish hex for soft background
  fg: string;
};

export type Store = {
  slug: string;
  name: string;
  en: string;
  mono: string;
  color: string;
  fg: string;
  url: string;
  affiliate_url?: string | null;
  tagline: string;
  desc: string;
  rating: number;
  reviews: number;
  cats: string[];
  updatedH: number;
  featured?: boolean;
};

export type Coupon = {
  id: string;
  store: string;
  code: string;
  label: string; // e.g. "25%"
  value: number; // numeric discount for sorting
  title: string;
  desc: string;
  badges: string[];
  rate: number; // success rate %
  uses: number;
  lastMin: number; // minutes since last successful use
  exp: number | null; // days until expiry
  terms: string[];
  featured?: boolean;
  app?: boolean;
  first?: boolean;
  bank?: boolean;
  ship?: boolean;
  addedD: number; // days ago added
};

export type Deal = {
  id: string;
  store: string;
  title: string;
  label: string;
  value: number;
  desc: string;
  cat: string;
  ends: number;
  uses: number;
  rating: number;
  addedD: number;
};

export const categories: Category[] = [
  { slug: "fashion", name: "الأزياء", desc: "ملابس، أحذية، ساعات وإكسسوارات", icon: "shirt", tint: "#f6edd3", fg: "#86601f" },
  { slug: "electronics", name: "الإلكترونيات", desc: "جوالات، لابتوبات وأجهزة ذكية", icon: "cpu", tint: "#dbe6fd", fg: "#1e369c" },
  { slug: "beauty", name: "العطور والجمال", desc: "عطور، عناية ومكياج", icon: "sparkles", tint: "#faddd6", fg: "#922c1f" },
  { slug: "food", name: "المطاعم والتوصيل", desc: "طلبات المطاعم والبقالة", icon: "utensils", tint: "#d3f1df", fg: "#115f3e" },
  { slug: "travel", name: "السفر والفنادق", desc: "طيران، فنادق وبرامج سياحية", icon: "plane", tint: "#e4eaf4", fg: "#2a3f6c" },
  { slug: "home", name: "المنزل", desc: "أثاث، ديكور وأجهزة منزلية", icon: "sofa", tint: "#eddba8", fg: "#6b4d1e" },
  { slug: "kids", name: "الأطفال", desc: "ألعاب، ملابس ومستلزمات الأطفال", icon: "baby", tint: "#b9ccfb", fg: "#1b2f7c" },
  { slug: "health", name: "الصحة", desc: "فيتامينات، مكملات وعناية صحية", icon: "heartpulse", tint: "#a9e3c2", fg: "#104b33" },
  { slug: "sports", name: "الرياضة", desc: "ملابس رياضية ومعدات لياقة", icon: "dumbbell", tint: "#f5bbae", fg: "#74271f" },
];

export const stores: Store[] = [
  {
    slug: "noon", name: "نون", en: "noon", mono: "n", color: "#f2c200", fg: "#241a00",
    url: "https://www.noon.com/saudi-ar/",
    affiliate_url: "https://s.noon.com/k5EPQc7GatE",
    tagline: "كل اللي تحتاجه، بمكان واحد",
    desc: "منصة التسوق الأشهر في السعودية — إلكترونيات، أزياء، بقالة، جمال وأكثر، مع توصيل سريع داخل جميع المدن.",
    rating: 4.6, reviews: 3214, cats: ["electronics", "home", "beauty", "fashion", "kids"], updatedH: 2, featured: true,
  },
  {
    slug: "amazon", name: "أمازون السعودية", en: "Amazon.sa", mono: "a", color: "#232f3e", fg: "#ffffff",
    url: "https://www.amazon.sa/", tagline: "تشكيلة عالمية بأسعار محلية",
    desc: "ملايين المنتجات من أمازون العالمية مع شحن سريع وبرنامج برايم وإرجاع سهل داخل السعودية.",
    rating: 4.7, reviews: 5402, cats: ["electronics", "home", "kids", "health"], updatedH: 3, featured: true,
  },
  {
    slug: "namshi", name: "نمشي", en: "Namshi", mono: "N", color: "#111111", fg: "#ffffff",
    url: "https://sa.namshi.com/", tagline: "الموضة أولاً",
    desc: "وجهة الموضة الأولى في المنطقة — ماركات عالمية وماركات حصرية مع توصيل سريع وإرجاع مجاني.",
    rating: 4.5, reviews: 2187, cats: ["fashion", "sports"], updatedH: 5, featured: true,
  },
  {
    slug: "shein", name: "شي إن", en: "SHEIN", mono: "S", color: "#161616", fg: "#ffffff",
    url: "https://sain-ar.shein.com/", tagline: "أحدث صيحات الموضة بأسعار مميزة",
    desc: "آلاف القطع الجديدة يومياً من الأزياء والإكسسوارات بأسعار منافسة وشحن مباشر للسعودية.",
    rating: 4.3, reviews: 4873, cats: ["fashion", "beauty", "kids"], updatedH: 6,
  },
  {
    slug: "iherb", name: "آي هيرب", en: "iHerb", mono: "i", color: "#4c8c40", fg: "#ffffff",
    url: "https://sa.iherb.com/", tagline: "صحتك من الطبيعة",
    desc: "متجر الصحة الأول عالمياً — فيتامينات، مكملات، منتجات طبيعية وعضوية مع شحن سريع للسعودية.",
    rating: 4.8, reviews: 6931, cats: ["health", "beauty"], updatedH: 1, featured: true,
  },
  {
    slug: "jarir", name: "مكتبة جرير", en: "Jarir", mono: "J", color: "#e2231a", fg: "#ffffff",
    url: "https://www.jarir.com/", tagline: "تقنية وقرطاسية وكتب",
    desc: "الوجهة الأولى للتقنية والقرطاسية والكتب في السعودية — جوالات، لابتوبات، ألعاب ومستلزمات مكتبية.",
    rating: 4.6, reviews: 3058, cats: ["electronics", "home", "kids"], updatedH: 8,
  },
  {
    slug: "extra", name: "إكسترا", en: "eXtra", mono: "X", color: "#0072ce", fg: "#ffffff",
    url: "https://www.extra.com/", tagline: "أجهزة منزلية وإلكترونيات",
    desc: "سلسلة إلكترونيات سعودية رائدة — أجهزة منزلية، شاشات، جوالات مع ضمان وخدمة تركيب.",
    rating: 4.4, reviews: 1930, cats: ["electronics", "home"], updatedH: 10,
  },
  {
    slug: "nike", name: "نايكي", en: "Nike", mono: "N", color: "#0a0a0a", fg: "#ffffff",
    url: "https://www.nike.com/sa/", tagline: "Just Do It",
    desc: "أحذية وملابس رياضية من نايكي — أحدث الإصدارات والتشكيلات الحصرية للسوق السعودي.",
    rating: 4.7, reviews: 1644, cats: ["sports", "fashion"], updatedH: 12,
  },
  {
    slug: "adidas", name: "أديداس", en: "adidas", mono: "A", color: "#242424", fg: "#ffffff",
    url: "https://www.adidas.com.sa/", tagline: "أداء وتصميم كلاسيكي",
    desc: "ملابس وأحذية رياضية من أديداس — أداء عالٍ وتصاميم كلاسيكية مع عضوية adiClub.",
    rating: 4.5, reviews: 1287, cats: ["sports", "fashion"], updatedH: 14,
  },
  {
    slug: "ikea", name: "ايكيا", en: "IKEA", mono: "I", color: "#0058a3", fg: "#ffdb00",
    url: "https://www.ikea.com/sa/ar/", tagline: "حلول ذكية لمنزلك",
    desc: "أثاث وديكور وحلول تخزين بتصميم اسكندنافي وأسعار مناسبة، مع توصيل وتركيب داخل السعودية.",
    rating: 4.5, reviews: 2496, cats: ["home", "kids"], updatedH: 16,
  },
  {
    slug: "careem", name: "كريم", en: "Careem", mono: "C", color: "#29b474", fg: "#ffffff",
    url: "https://www.careem.com/", tagline: "توصيل ومشاوير ودفع",
    desc: "تطبيق المشاوير والتوصيل الرائد — مشاوير، توصيل طعام وبقالة وباقات اشتراك كريم بلس.",
    rating: 4.4, reviews: 3388, cats: ["food"], updatedH: 4, featured: true,
  },
  {
    slug: "hungerstation", name: "هنقرستيشن", en: "HungerStation", mono: "H", color: "#f7941d", fg: "#3d2400",
    url: "https://hungerstation.com/", tagline: "جوعك علينا",
    desc: "منصة توصيل الطعام الأولى سعودياً — مطاعم، مقاهي وبقالة مع عروض يومية على الطلبات.",
    rating: 4.3, reviews: 2719, cats: ["food"], updatedH: 7,
  },
  {
    slug: "almosafer", name: "المسافر", en: "Almosafer", mono: "M", color: "#6e3fa3", fg: "#ffffff",
    url: "https://www.almosafer.com/", tagline: "سفر أسهل وأوفر",
    desc: "منصة سعودية لحجوزات الطيران والفنادق والباقات السياحية بأفضل الأسعار وعروض حصرية.",
    rating: 4.4, reviews: 1512, cats: ["travel"], updatedH: 9,
  },
  {
    slug: "bathbody", name: "باث اند بودي", en: "Bath & Body", mono: "B", color: "#0b5cab", fg: "#ffffff",
    url: "https://www.bathandbodyworks.com.sa/", tagline: "عناية تدوم طويلاً",
    desc: "منتجات العناية بالجسم والعطور المنزلية من باث اند بودي وركس — تشكيلات موسمية وعروض مستمرة.",
    rating: 4.6, reviews: 986, cats: ["beauty"], updatedH: 11,
  },
];

export const coupons: Coupon[] = [
  {
    id: "c-noon-25", store: "noon", code: "MUV26", label: "25%", value: 25,
    title: "كاش باك عبد العزيز",
    desc: "احصل على خصم فوري حتى 50 ر.س عند إتمام أول طلب لك من تطبيق نون.",
    badges: ["حصري", "أول طلب", "التطبيق"], rate: 94, uses: 12450, lastMin: 12, exp: 9,
    terms: ["يسري على الطلب الأول فقط من تطبيق نون", "الحد الأقصى للخصم 50 ر.س", "لا يشمل منتجات السوق المفتوح المحددة", "قابل للدمج مع عروض الشحن المجاني"],
    featured: true, app: true, first: true, addedD: 0,
  },
  {
    id: "c-noon-70", store: "noon", code: "AF70", label: "70 ر.س", value: 23,
    title: "خصم 70 ر.س على الطلبات فوق 300 ر.س",
    desc: "وفّر 70 ر.س مباشرة عند الدفع للطلبات التي تتجاوز 300 ر.س.",
    badges: ["مجرب"], rate: 91, uses: 8327, lastMin: 28, exp: null,
    terms: ["الحد الأدنى للطلب 300 ر.س", "يسري على المنتجات المباعة من نون", "مرة واحدة لكل حساب"],
    featured: false, addedD: 1,
  },
  {
    id: "c-noon-ship", store: "noon", code: "SHIP", label: "شحن مجاني", value: 8,
    title: "شحن مجاني لجميع الطلبات",
    desc: "ألغِ رسوم التوصيل على أي طلب بدون حد أدنى.",
    badges: ["مجرب"], rate: 96, uses: 5219, lastMin: 45, exp: 5,
    terms: ["يشمل التوصيل القياسي", "لا يشمل التوصيل السريع"],
    ship: true, addedD: 2,
  },
  {
    id: "c-noon-bank", store: "noon", code: "BANK10", label: "10%", value: 10,
    title: "خصم 10% إضافي عند الدفع بالبطاقات البنكية",
    desc: "خصم إضافي 10% حتى 60 ر.س عند الدفع ببطاقات مدى والائتمانية المشاركة.",
    badges: ["بطاقات بنكية"], rate: 90, uses: 4102, lastMin: 60, exp: 14,
    terms: ["يسري مع بطاقات البنوك المشاركة", "الحد الأقصى 60 ر.س", "يُطبق قبل نقاط الولاء"],
    bank: true, addedD: 1,
  },
  {
    id: "c-amazon-15", store: "amazon", code: "SA15", label: "15%", value: 15,
    title: "خصم 15% على الإلكترونيات والأجهزة",
    desc: "خصم مباشر على تشكيلة مختارة من الإلكترونيات والأجهزة الذكية.",
    badges: ["مجرب"], rate: 89, uses: 9841, lastMin: 18, exp: null,
    terms: ["على منتجات مختارة تحمل علامة العرض", "حتى نفاد الكمية"],
    addedD: 0,
  },
  {
    id: "c-amazon-100", store: "amazon", code: "WFR100", label: "100 ر.س", value: 20,
    title: "خصم 100 ر.س على الطلبات فوق 500 ر.س",
    desc: "كود حصري لقرّاء وفّر — وفّر 100 ر.س على سلة تتجاوز 500 ر.س.",
    badges: ["حصري", "مجرب"], rate: 92, uses: 6133, lastMin: 9, exp: 12,
    terms: ["الحد الأدنى 500 ر.س", "يشمل المنتجات المباعة من أمازون", "لا يشمل بطاقات الهدايا"],
    featured: true, addedD: 0,
  },
  {
    id: "c-namshi-30", store: "namshi", code: "NM30", label: "30%", value: 30,
    title: "خصم 30% على كامل الموقع",
    desc: "أقوى كود نمشي هذا الأسبوع — خصم عام يشمل معظم الماركات والتشكيلات.",
    badges: ["مجرب", "حصري"], rate: 93, uses: 15218, lastMin: 6, exp: 4,
    terms: ["يشمل المنتجات غير المخفضة", "قد يستثني بعض الماركات الفاخرة", "يسري على الموقع والتطبيق"],
    featured: true, addedD: 0,
  },
  {
    id: "c-namshi-app", store: "namshi", code: "APP20", label: "20%", value: 20,
    title: "خصم 20% إضافي من التطبيق",
    desc: "خصم إضافي فوق التخفيضات عند الشراء من تطبيق نمشي.",
    badges: ["التطبيق"], rate: 90, uses: 7344, lastMin: 33, exp: null,
    terms: ["حصرياً لطلبات التطبيق", "يُضاف فوق أسعار التخفيضات"],
    app: true, addedD: 3,
  },
  {
    id: "c-shein-20", store: "shein", code: "SHN20", label: "20%", value: 20,
    title: "خصم 20% + شحن مجاني",
    desc: "خصم على أول طلب مع شحن مجاني للسعودية بدون حد أدنى.",
    badges: ["أول طلب", "مجرب"], rate: 88, uses: 11502, lastMin: 21, exp: null,
    terms: ["للطلب الأول فقط", "يشمل الشحن القياسي المجاني"],
    first: true, ship: true, addedD: 1,
  },
  {
    id: "c-iherb-10", store: "iherb", code: "IHB10", label: "10%", value: 10,
    title: "خصم 10% على جميع الطلبات",
    desc: "كود دائم يعمل على كامل السلة — فيتامينات ومكملات وعناية.",
    badges: ["مجرب"], rate: 97, uses: 21480, lastMin: 4, exp: null,
    terms: ["بدون حد أدنى", "قابل للاستخدام المتكرر"],
    featured: true, addedD: 0,
  },
  {
    id: "c-iherb-60", store: "iherb", code: "GOLD60", label: "60 ر.س", value: 15,
    title: "خصم 60 ر.س على الطلبات فوق 250 ر.س",
    desc: "توفير إضافي لطلباتك الكبيرة من آي هيرب للعملاء الجدد.",
    badges: ["أول طلب"], rate: 95, uses: 3892, lastMin: 51, exp: 20,
    terms: ["للمتسوقين الجدد", "الحد الأدنى 250 ر.س"],
    first: true, addedD: 2,
  },
  {
    id: "c-jarir-15", store: "jarir", code: "JR15", label: "15%", value: 15,
    title: "خصم 15% على اللابتوبات والتابلت",
    desc: "وفّر على أحدث أجهزة اللابتوب والتابلت من مكتبة جرير.",
    badges: ["مجرب"], rate: 87, uses: 2914, lastMin: 74, exp: 7,
    terms: ["على موديلات مختارة", "لا يُدمج مع عروض التقسيط الخاصة"],
    addedD: 2,
  },
  {
    id: "c-extra-50", store: "extra", code: "EX50", label: "50 ر.س", value: 12,
    title: "خصم 50 ر.س على الطلبات فوق 400 ر.س",
    desc: "كود حصري يعمل على الأجهزة المنزلية والإلكترونيات في إكسترا.",
    badges: ["حصري"], rate: 90, uses: 1873, lastMin: 95, exp: 11,
    terms: ["الحد الأدنى 400 ر.س", "يشمل معظم الأقسام"],
    addedD: 4,
  },
  {
    id: "c-nike-25", store: "nike", code: "NK25", label: "25%", value: 25,
    title: "خصم 25% على التشكيلات الجديدة",
    desc: "خصم قوي على أحدث إصدارات نايكي — أحذية وملابس رياضية.",
    badges: ["مجرب", "حصري"], rate: 92, uses: 4560, lastMin: 15, exp: 6,
    terms: ["على المنتجات غير المخفضة", "يشمل أعضاء Nike فقط"],
    featured: true, addedD: 1,
  },
  {
    id: "c-adidas-30", store: "adidas", code: "AD30", label: "30%", value: 30,
    title: "خصم 30% لأعضاء adiClub",
    desc: "سجّل مجاناً في adiClub واستمتع بخصم 30% على تشكيلة واسعة.",
    badges: ["مجرب"], rate: 89, uses: 3241, lastMin: 120, exp: null,
    terms: ["يتطلب عضوية adiClub المجانية", "يستثني المنتجات المحدودة"],
    addedD: 3,
  },
  {
    id: "c-ikea-10", store: "ikea", code: "IKEA10", label: "10%", value: 10,
    title: "خصم 10% لأعضاء عائلة ايكيا",
    desc: "خصم إضافي لأعضاء برنامج IKEA Family على مشترياتك أونلاين.",
    badges: ["مجرب"], rate: 88, uses: 1650, lastMin: 140, exp: null,
    terms: ["يتطلب عضوية IKEA Family", "يشمل الأقسام المشاركة"],
    addedD: 5,
  },
  {
    id: "c-careem-20", store: "careem", code: "CR20", label: "20%", value: 20,
    title: "خصم 20% على 3 مشاوير قادمة",
    desc: "كود حصري يمنحك خصماً على مشاويرك الثلاثة القادمة مع كريم.",
    badges: ["حصري"], rate: 93, uses: 8804, lastMin: 8, exp: 10,
    terms: ["حتى 15 ر.س لكل مشوار", "يسري في المدن السعودية"],
    featured: true, addedD: 0,
  },
  {
    id: "c-hs-15", store: "hungerstation", code: "HS15", label: "15%", value: 15,
    title: "خصم 15% على أول طلب",
    desc: "جرّب هنقرستيشن بخصم 15% على أول طلب طعام أو بقالة.",
    badges: ["أول طلب", "مجرب"], rate: 91, uses: 6721, lastMin: 26, exp: null,
    terms: ["للحسابات الجديدة", "الحد الأقصى 30 ر.س"],
    first: true, addedD: 1,
  },
  {
    id: "c-almosafer-25", store: "almosafer", code: "MS25", label: "25%", value: 25,
    title: "خصم 25% على حجوزات الفنادق",
    desc: "وفّر ربع القيمة على فنادق مختارة داخل السعودية والخليج.",
    badges: ["مجرب"], rate: 86, uses: 1980, lastMin: 180, exp: 15,
    terms: ["على فنادق مختارة", "حسب توفر الغرف"],
    addedD: 4,
  },
  {
    id: "c-bathbody-20", store: "bathbody", code: "BB20", label: "20%", value: 20,
    title: "خصم 20% + هدية مع كل طلب",
    desc: "خصم على كامل السلة مع هدية عناية مجانية عند الشراء أونلاين.",
    badges: ["مجرب"], rate: 94, uses: 1240, lastMin: 66, exp: 8,
    terms: ["الهدية حسب توفر المخزون", "يشمل التشكيلات الموسمية"],
    addedD: 2,
  },
];

export const deals: Deal[] = [
  { id: "d-noon-70", store: "noon", title: "تخفيضات كبرى حتى 70% على الإلكترونيات", label: "70%", value: 70, desc: "خصومات مباشرة بدون كود على شاشات، جوالات وأجهزة منزلية مختارة.", cat: "electronics", ends: 5, uses: 9310, rating: 4.7, addedD: 0 },
  { id: "d-amazon-45", store: "amazon", title: "أجهزة أمازون بخصم حتى 45%", label: "45%", value: 45, desc: "Echo وFire TV وKindle بأسعار مخفضة لفترة محدودة.", cat: "electronics", ends: 3, uses: 7204, rating: 4.8, addedD: 0 },
  { id: "d-namshi-50", store: "namshi", title: "تصفية نهاية الموسم حتى 50%", label: "50%", value: 50, desc: "خصومات مباشرة على آلاف القطع من ماركات عالمية ومحلية.", cat: "fashion", ends: 7, uses: 8452, rating: 4.6, addedD: 1 },
  { id: "d-shein-80", store: "shein", title: "قسم التخفيضات — حتى 80%", label: "80%", value: 80, desc: "أكبر قسم تصفيات في شي إن بأسعار تبدأ من 9 ر.س.", cat: "fashion", ends: 12, uses: 13120, rating: 4.4, addedD: 1 },
  { id: "d-iherb-week", store: "iherb", title: "عروض الأسبوع — خصم إضافي 20%", label: "20%", value: 20, desc: "تخفيضات أسبوعية متجددة على فيتامينات ومكملات مختارة.", cat: "health", ends: 2, uses: 5320, rating: 4.9, addedD: 0 },
  { id: "d-jarir-30", store: "jarir", title: "عروض العودة للمدارس حتى 30%", label: "30%", value: 30, desc: "قرطاسية، حقائب وأجهزة تعليمية بأسعار مخفضة.", cat: "kids", ends: 9, uses: 3150, rating: 4.5, addedD: 2 },
  { id: "d-extra-40", store: "extra", title: "عروض الصيف على الأجهزة حتى 40%", label: "40%", value: 40, desc: "مكيفات، ثلاجات وغسالات بخصومات مباشرة مع التركيب.", cat: "home", ends: 6, uses: 2760, rating: 4.3, addedD: 2 },
  { id: "d-ikea-35", store: "ikea", title: "تخفيضات المنزل حتى 35%", label: "35%", value: 35, desc: "أثاث وحلول تخزين وتخفيضات غرف النوم.", cat: "home", ends: 10, uses: 4102, rating: 4.6, addedD: 3 },
  { id: "d-careem-plus", store: "careem", title: "شهر مجاني من كريم بلس", label: "شهر مجاني", value: 25, desc: "اشترك في كريم بلس واحصل على أول شهر مجاناً مع مشاوير مخفضة.", cat: "food", ends: 4, uses: 6030, rating: 4.4, addedD: 1 },
  { id: "d-hs-free", store: "hungerstation", title: "توصيل مجاني للطلبات فوق 60 ر.س", label: "توصيل مجاني", value: 10, desc: "وفّر رسوم التوصيل على طلبات المطاعم المشاركة.", cat: "food", ends: 8, uses: 9840, rating: 4.5, addedD: 3 },
  { id: "d-almosafer-199", store: "almosafer", title: "رحلات داخلية تبدأ من 199 ر.س", label: "من 199 ر.س", value: 30, desc: "أسعار خاصة على رحلات الطيران الداخلية لفترة محدودة.", cat: "travel", ends: 14, uses: 1890, rating: 4.2, addedD: 4 },
  { id: "d-nike-60", store: "nike", title: "قسم الأوتلت حتى 60%", label: "60%", value: 60, desc: "أحذية وملابس من الموسم الماضي بخصومات قوية.", cat: "sports", ends: 11, uses: 5210, rating: 4.7, addedD: 2 },
  { id: "d-adidas-3for2", store: "adidas", title: "اشترِ قطعتين والثالثة مجاناً", label: "3 بسعر 2", value: 33, desc: "على تشكيلة مختارة من الملابس والإكسسوارات.", cat: "sports", ends: 6, uses: 2310, rating: 4.5, addedD: 3 },
  { id: "d-bathbody-3for2", store: "bathbody", title: "3 منتجات عناية بسعر 2", label: "3 بسعر 2", value: 33, desc: "على غسولات الجسم واللوشنات المشاركة بالعرض.", cat: "beauty", ends: 5, uses: 1720, rating: 4.6, addedD: 2 },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "كيف أستخدم كود الخصم من وفّر؟",
    a: "اضغط زر «عرض الكود» في أي كوبون، سيتم نسخ الكود تلقائياً وفتح المتجر في نافذة جديدة. أضف منتجاتك إلى السلة، ثم الصق الكود في خانة «كود الخصم» عند إتمام الدفع ليُطبق الخصم فوراً.",
  },
  {
    q: "هل الأكواد والكوبونات مجانية بالكامل؟",
    a: "نعم، جميع الأكواد والعروض في وفّر مجانية 100%. لا نطلب رسوماً أو اشتراكاً — هدفنا أن نوفّر عليك المال، لا أن نأخذ منه.",
  },
  {
    q: "لماذا لا يعمل كود الخصم أحياناً؟",
    a: "الأسباب الأكثر شيوعاً: انتهاء صلاحية الكود، عدم استيفاء الحد الأدنى للطلب، أو أن الكود مخصص للطلب الأول أو للتطبيق فقط. تجد شروط كل كود مكتوبة بوضوح داخل الكوبون، ويمكنك تقييم الكود بزر «يعمل / لا يعمل» لنحدّث حالته بسرعة.",
  },
  {
    q: "كيف تتحققون من صلاحية الأكواد؟",
    a: "فريقنا يختبر الأكواد يدوياً بشكل دوري، ونعتمد أيضاً على تقييمات المستخدمين الفورية. كل كوبون يعرض حالة التحقق وآخر استخدام ونسبة النجاح الفعلية المبنية على تقييمات حقيقية.",
  },
  {
    q: "هل يحصل وفّر على عمولة عند شرائي؟",
    a: "نعم وبكل شفافية: بعض الروابط روابط شراكة (أفلييت)، وقد نحصل على عمولة صغيرة من المتجر عند إتمام الشراء من خلالها — دون أي تكلفة إضافية عليك إطلاقاً. هذه العمولة هي ما يبقي المنصة مجانية.",
  },
  {
    q: "كيف أنبّهكم إذا لم يعمل كود؟",
    a: "من داخل أي كوبون اضغط زر «لا يعمل» بعد تجربتك. يصلنا التنبيه فوراً ويعيد الفريق فحص الكود خلال ساعات، وتُحدّث نسبة نجاحه بناءً على التقييمات.",
  },
  {
    q: "هل المنصة متاحة لدول الخليج؟",
    a: "حالياً نركز على السوق السعودي بأفضل تجربة ممكنة، والتوسع للإمارات والكويت وقطر والبحرين وعُمان على خارطة الطريق القريبة — اشترك في التنبيهات لتكون أول من يعلم.",
  },
  {
    q: "كيف أستقبل تنبيهات الكوبونات الجديدة؟",
    a: "أنشئ حساباً وتابع متاجرك المفضلة، وسنرسل لك تنبيهاً فور نزول أي كود جديد. يمكنك اختيار القناة المفضلة: بريد إلكتروني، واتساب، تيليجرام أو إشعارات المتصفح.",
  },
];

export const storeBy = (slug: string) => stores.find((s) => s.slug === slug);
export const catBy = (slug: string) => categories.find((c) => c.slug === slug);
export const storeCoupons = (slug: string) => coupons.filter((c) => c.store === slug);
export const storeDeals = (slug: string) => deals.filter((d) => d.store === slug);
