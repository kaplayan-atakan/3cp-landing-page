import type { LucideIcon } from 'lucide-react';
import {
  Boxes,
  ScanText,
  Building2,
  Lock,
  KeyRound,
  Contact,
  ClipboardList,
  Sparkles,
  PhoneCall,
  Radio,
  Database,
  EyeOff,
  FileCheck2,
  ScrollText,
  UtensilsCrossed,
  Home,
  ShoppingBag,
  BedDouble,
  Network,
  SlidersHorizontal,
  Rocket,
  CreditCard,
} from 'lucide-react';

/** Navigation links shared by the desktop navbar and the mobile menu. */
export const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'Platform', href: '#platform' },
  { label: 'Nasıl Çalışır?', href: '#nasil-calisir' },
  { label: 'Entegrasyon', href: '#entegrasyon' },
  { label: 'Güvenlik', href: '#guvenlik' },
  { label: 'SSS', href: '#sss' },
];

/**
 * Section 1 — hero scope counters.
 *
 * These are not traction metrics. Every figure is countable in the source
 * documents; nothing about uptime, branch counts or processed volume appears
 * here, because 3CP is pre-POC and no such number exists yet.
 */
export interface HeroStat {
  value: number;
  label: string;
}

export const HERO_STATS: HeroStat[] = [
  { value: 12, label: 'yetenek modülü' }, // Yetenek Seti §I.1–I.12
  { value: 18, label: 'ekran grubu' }, // Yetenek Seti §II — gruplar A–R
  { value: 4, label: 'sektör dikeyi' }, // Yetenek Seti §0.3 + §III
  { value: 4, label: 'desteklenen LLM sağlayıcısı' }, // §5.1 — Gemini, OpenAI, Claude, Mistral
];

/** Section 2 — sector strip. */
export interface Sector {
  name: string;
}

export const SECTORS: Sector[] = [
  { name: 'Restoran Zincirleri' },
  { name: 'Emlak' },
  { name: 'Perakende' },
  { name: 'Otelcilik' },
];

/** Section 2 — problem cards. */
export interface Problem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const PROBLEMS: Problem[] = [
  {
    title: 'Kayıp Geri Bildirimler, Kaçan Fırsatlar',
    description:
      'Anketler, Google yorumları, şikayetler ve çağrılar farklı sistemlerde dağınık. Değerli müşteri sinyalleri tek bir görünümde birleşmediği için gözden kaçıyor.',
    icon: Boxes,
  },
  {
    title: 'Saatler Alan Manuel İş Yükü',
    description:
      'Yüzlerce yorumu tek tek okuyup etiketlemek ekibinizin zamanını tüketiyor; kritik uyarılar fark edildiğinde çoktan geç oluyor.',
    icon: ScanText,
  },
  {
    title: 'Çok Şube, Çok Marka, Tek Kaos',
    description:
      'Her şubenin ve markanın performansını karşılaştırmak, doğru kişiye doğru yetkiyi vermek her geçen gün daha da zorlaşıyor.',
    icon: Building2,
  },
  {
    title: 'Görünmeyen Uyum Riski',
    description:
      'Müşteri verisine kimin ne zaman eriştiği izlenemiyor. Bu, hem bir güvenlik açığı hem de ciddi bir KVKK riski anlamına geliyor.',
    icon: Lock,
  },
];

/**
 * Section 3 — how it works, 3-step pipeline.
 *
 * Step 01 stays a raster screenshot (`image`/`imageAlt`) — it is clean and
 * accurate. Steps 02 and 03 render as honest HTML/CSS mockups instead
 * (`mockup`): two raster attempts at these screens baked in defects (English
 * strings, a fabricated "2023" date) that AI image regeneration could not
 * reliably fix, so the panels are built from real markup + seeded data,
 * which makes incorrect text structurally impossible.
 */
export interface Step {
  number: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  portrait?: boolean;
  mockup?: 'analysis' | 'dashboard';
}

export const STEPS: Step[] = [
  {
    number: '01',
    title: 'Kusursuz ve Anonim Katılım',
    description:
      'Müşteriniz masadaki QR kodu okutur ve saniyeler içinde açılan mobil-öncelikli anketi kimlik zorunluluğu olmadan doldurur. Yüksek katılım, sıfır sürtünme.',
    image: 'images/step-1-anonim-katilim.png',
    imageAlt: 'Restoran masasında telefonda açılan anonim 3CP müşteri anketi ekranı',
    portrait: true,
  },
  {
    number: '02',
    title: 'Anında AI Analizi ve Etiketleme',
    description:
      'Yapay zeka her yanıtı otomatik olarak kategori, duygu ve kritiklik düzeyine göre etiketler. Emin olunmayan sonuçlar incelemeniz için işaretlenir.',
    mockup: 'analysis',
  },
  {
    number: '03',
    title: 'Tek Merkezden Stratejik Aksiyon',
    description:
      'Dağınık veri değil, önceliklendirilmiş içgörü. Kritik puanlar otomatik olarak aksiyon listenize düşer; ekibiniz vakit kaybetmeden harekete geçer.',
    mockup: 'dashboard',
  },
];

/**
 * Step 02 mockup data (`StepAnalysisMockup`) — seeded demo data illustrating
 * the AI categorisation/sentiment pipeline. Never live, never real tenant
 * data.
 */
export const STEP_ANALYSIS = {
  feedback: 'Garsonumuz Ayşe harikaydı, ama pizza soğuk geldi ve çok bekledik.',
  categories: [
    { label: 'Personel (Pozitif)', tone: 'success' as const },
    { label: 'Yemek (Kritik)', tone: 'danger' as const },
  ],
  sentimentScore: '7.2',
  sentimentMax: '10',
  positivePct: 65,
  criticalPct: 35,
  confidence: '98%',
};

/**
 * Step 03 mockup data (`StepDashboardMockup`) — seeded demo data illustrating
 * the regional manager panel (branch NPS, auto-generated tickets, critical
 * alerts). Never live, never real tenant data. All timestamps are relative
 * ("Bugün"/"Dün") — no calendar date appears anywhere.
 */
export const STEP_DASHBOARD = {
  nps: [
    { branch: 'Şube A (Levent)', score: 82, delta: '+3' },
    { branch: 'Şube C (Bursa)', score: 78, delta: '+1' },
    { branch: 'Şube B (Kadıköy)', score: 65, delta: '-4' },
    { branch: 'Şube D (İzmit)', score: 71, delta: '+2' },
  ],
  tickets: [
    { id: '#T-0842', branch: 'Şube B', category: 'Yemek Kalitesi', time: 'Bugün 10:15', status: 'Beklemede', tone: 'neutral' as const },
    { id: '#T-0841', branch: 'Şube A', category: 'Hizmet Hızı', time: 'Bugün 09:50', status: 'Atandı', tone: 'information' as const },
    { id: '#T-0840', branch: 'Şube C', category: 'Temizlik', time: 'Dün 16:22', status: 'Kapatıldı', tone: 'neutral' as const },
    { id: '#T-0839', branch: 'Şube B', category: 'Soğuk Yemek', time: 'Dün 14:10', status: 'Kritik', tone: 'danger' as const },
  ],
  alerts: [
    { branch: 'Şube B (Kadıköy)', title: 'Soğuk Yemek Şikayeti Artışı', priority: 'Yüksek Öncelik' },
    { branch: 'Şube D (İzmit)', title: 'Bekleme Süreleri Uzuyor', priority: 'Orta Öncelik' },
  ],
};

/**
 * Section 3 — the four POC-core modules (Yetenek Seti §0.4: IAM + Kişi Kartı +
 * Anonim Anket + RAG segmentasyon). `wide` drives the bento column span.
 *
 * The LLM Gateway is not a fifth card: it is the infrastructure the RAG card
 * runs on, so it appears there as a bullet.
 */
export interface CoreModule {
  title: string;
  description: string;
  bullets: string[];
  icon: LucideIcon;
  wide: boolean;
}

export const CORE_MODULES: CoreModule[] = [
  {
    title: 'Kimlik ve Yetki Altyapısı',
    description:
      'Şirket, marka, şube ve departman hiyerarşinizin tamamı tek bir yetki modelinde toplanır. Sabit rol seti yoktur; her kiracı kendi rollerini tanımlar.',
    bullets: [
      'Modül × kapsam × aksiyon izin matrisi',
      'Alıcı tipine göre dinamik alan maskeleme',
      'Erişim ve değişiklik denetim kaydı',
    ],
    icon: KeyRound,
    wide: true,
  },
  {
    title: '360° Kişi Kartı',
    description:
      'Telefon numarası birincil anahtar; anket, şikayet, kampanya, çağrı ve satın alma geçmişi tek profilde birleşir.',
    bullets: [
      'Değiştirilemez rıza defteri',
      'Kimlik birleştirme ve dedup',
      'KVKK anonimleştirme akışı',
    ],
    icon: Contact,
    wide: false,
  },
  {
    title: 'Anket ve NPS',
    description:
      'Şube ve kampanya bazlı QR üretimi, mobil-öncelikli doldurma arayüzü. Anonim-öncelikli toplama katılımı yüksek tutar.',
    bullets: [
      'Eşik altı yanıt otomatik şikayet ticket’ına döner',
      'Şube, ürün ve kategori bazlı NPS kırılımı',
    ],
    icon: ClipboardList,
    wide: false,
  },
  {
    title: 'Yapay Zeka Geri Bildirim Zekası',
    description:
      'Yorumlar embedding ve vektör arama üzerinden kategori, duygu ve kritiklik düzeyine göre sınıflandırılır. Düşük güvenli sonuçlar insan incelemesi için işaretlenir; her düzeltme örnek havuzunu besler.',
    bullets: [
      'Kiracıya özel kategori taksonomisi',
      'Sağlayıcı-bağımsız LLM Gateway üzerinde çalışır',
      'Kritik eşik aşıldığında otomatik uyarı',
    ],
    icon: Sparkles,
    wide: true,
  },
];

/** Shared shape for the two-up figures on a sector card. */
export interface Stat {
  value: string;
  label: string;
}

/**
 * Section 5 — sector verticals.
 *
 * Restoran and Emlak counts come straight from Yetenek Seti §0.3 and §III.
 * The documents define no module set for Perakende or Otelcilik, so those cards
 * describe the reused core qualitatively instead of inventing a module count.
 */
export interface SectorVertical {
  name: string;
  description: string;
  icon: LucideIcon;
  stats: [Stat, Stat];
}

export const SECTOR_VERTICALS: SectorVertical[] = [
  {
    name: 'Restoran Zincirleri',
    description:
      'İlk dikey pazar. Anket ve NPS, şikayet yönetimi ve kampanya motoru bu dikeyin kendi modülleridir; çekirdek onları taşır.',
    icon: UtensilsCrossed,
    stats: [
      { value: 'İlk', label: 'Dikey pazar' },
      { value: '3', label: 'Sektöre özel modül' }, // Anket/NPS, Şikayet, Kampanya
    ],
  },
  {
    name: 'Emlak',
    description:
      'İlan yönetimi, teklif ve pazarlık süreci, portföy eşleştirme. Aynı çekirdek, yeni modüller ve yeni ilan platformu adaptörleri.',
    icon: Home,
    stats: [
      { value: '3', label: 'Sektöre özel modül' }, // §III
      { value: '3', label: 'İlan platformu adaptörü' }, // Sahibinden, Emlakjet, Hürriyet Emlak
    ],
  },
  {
    name: 'Perakende',
    description:
      'Çok-kiracılık, kişi kartı, dinamik yetki ve entegrasyon çatısı olduğu gibi devralınır. Sektörel modüller çekirdek üzerine kurulur.',
    icon: ShoppingBag,
    stats: [
      { value: 'Tümü', label: 'Çekirdek servisler devralınır' },
      { value: 'Sektörel', label: 'Modüller çekirdek üzerine kurulur' },
    ],
  },
  {
    name: 'Otelcilik',
    description:
      'Çekirdek sektör-agnostiktir: yeni dikey sisteme bileşen ekler, mevcut çekirdeği değiştirmez.',
    icon: BedDouble,
    stats: [
      { value: 'Tümü', label: 'Çekirdek servisler devralınır' },
      { value: 'Sektörel', label: 'Modüller çekirdek üzerine kurulur' },
    ],
  },
];

/** Section 6 — onboarding walkthrough. */
export interface OnboardingStep {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    number: '01',
    title: 'Kurulum',
    description:
      'Kiracınız oluşturulur, marka ve şube hiyerarşiniz tanımlanır. 3CP bulut tabanlıdır; sunucu kurulumu gerektirmez.',
    icon: Building2,
  },
  {
    number: '02',
    title: 'Şube bağlama',
    description:
      'Şubeler ve departmanlar sisteme girilir, ekip üyeleri davet akışıyla eklenir.',
    icon: Network,
  },
  {
    number: '03',
    title: 'Yapılandırma',
    description:
      'Roller, izin matrisi, maskeleme politikası ve marka sesi profili ayarlanır. Kod değil, konfigürasyon.',
    icon: SlidersHorizontal,
  },
  {
    number: '04',
    title: 'Canlıya geçiş',
    description:
      'QR kodlar üretilir, anket yayına alınır. İlk yanıtlar geldiği anda sınıflandırma çalışmaya başlar.',
    icon: Rocket,
  },
];

/**
 * Section 6 — a read-only illustration of the Dense Matrix layout
 * (Tasarım Dili §8.2). Not a real tenant's permission set.
 */
export const PERMISSION_MATRIX: {
  roles: string[];
  actions: string[];
  grid: boolean[][];
} = {
  roles: ['Bölge Müdürü', 'Şube Sorumlusu', 'Çağrı Merkezi Agent'],
  actions: ['Görüntüle', 'Düzenle', 'Sil', 'Onayla'],
  grid: [
    [true, true, true, true],
    [true, true, false, false],
    [true, false, false, false],
  ],
};

/**
 * Section 7 — the adapter framework (Yetenek Seti §6).
 *
 * No third-party supplier is named. The architecture document is explicit that
 * names like RestoPos and AssisTT are the first reference adapters written for
 * the v1 customer's suppliers, not fixed components of 3CP — presenting them as
 * shipped integrations would be false, and using their marks would be a
 * trademark problem. The review and listing platforms below are public
 * surfaces 3CP reads from, and the documents name them outright.
 */
export interface AdapterClass {
  name: string;
  examples: string;
  icon: LucideIcon;
}

export const ADAPTER_CLASSES: AdapterClass[] = [
  {
    name: 'POS adaptörleri',
    examples: 'Kampanya ve kupon iletimi, kullanım verisinin geri akışı',
    icon: CreditCard,
  },
  {
    name: 'Çağrı merkezi adaptörleri',
    examples: 'IVR numara eşleşmesi, maskeli kart ekrana düşürme, rıza kaydı',
    icon: PhoneCall,
  },
  {
    name: 'Yorum platformu adaptörleri',
    examples: 'Google, Yemeksepeti, Getir, Migros Yemek, Trendyol Go',
    icon: Radio,
  },
  {
    name: 'İlan platformu adaptörleri',
    examples: 'Sahibinden, Emlakjet, Hürriyet Emlak',
    icon: Home,
  },
];

/**
 * Mimari §8.4 — the transactional outbox. This is 3CP's *internal* event
 * contract, not a public partner API; the surrounding section says so plainly.
 */
export const OUTBOX_EVENT_SAMPLE = `-- İş verisi ve olay kaydı aynı transaction'da yazılır
INSERT INTO core.outbox_messages (id, type, payload, status)
VALUES (
  gen_random_uuid(),
  'PlatformMentionIngested',
  '{ "sourceType":    "platform",
     "platformCode":  "GOOGLE",
     "feedbackItemId": "…" }',   -- payload kişisel veri taşımaz
  'pending'
);

-- Dispatcher kaldığı yerden devam eder:
-- veritabanına yazıldıysa olay mutlaka işlenir.`;

/**
 * Section 8 — seeded audit ticker. Event names are 3CP's real audit surface
 * (Mimari §8.4). The dataset is fixed: never live, never real tenant data.
 */
export interface AuditLine {
  time: string;
  event: string;
  detail: string;
  tone: 'neutral' | 'warning' | 'danger';
}

export const AUDIT_LOG_LINES: AuditLine[] = [
  { time: '09:14:02', event: 'LOGIN', detail: 'bolge_muduru · sube-34', tone: 'neutral' },
  {
    time: '09:14:19',
    event: 'REVEAL',
    detail: 'telefon · alici_tipi=CALL_CENTER_AGENT',
    tone: 'warning',
  },
  { time: '09:15:41', event: 'LOGIN_FAILED', detail: 'bilinmeyen kimlik · 3. deneme', tone: 'danger' },
  { time: '09:16:03', event: 'ANONYMIZE', detail: 'KVKK silme talebi işlendi', tone: 'warning' },
  { time: '09:17:22', event: 'TOKEN_REUSE', detail: 'oturum iptal edildi', tone: 'danger' },
  { time: '09:18:07', event: 'PROVISION', detail: 'yeni kiracı oluşturuldu', tone: 'neutral' },
  { time: '09:19:35', event: 'REFRESH', detail: 'oturum yenilendi', tone: 'neutral' },
];

/** Section 9 — capability marquee. Every tag maps to a documented module. */
export const MARQUEE_ROW_ONE: string[] = [
  '360° Kişi Kartı',
  'Anket ve NPS',
  'RAG Segmentasyon',
  'Şikayet Yönetimi',
  'Kampanya Motoru',
  'Veri Maskeleme',
  'Denetim İzi',
  'QR Menü',
];

export const MARQUEE_ROW_TWO: string[] = [
  'ABAC İzin Matrisi',
  'LLM Gateway',
  'Marka Sesi Profili',
  'Kupon Motoru',
  'Çağrı Merkezi Köprüsü',
  'Sosyal Dinleme',
  'Loyalty Motoru',
  'Catalog Ürün Master’ı',
];

/**
 * Section 10 — mocked cross-branch activity, rendered inside a panel that
 * carries a DemoBadge. The page never claims this traffic is live.
 */
export interface ActivityItem {
  branch: string;
  title: string;
  meta: string;
  tone: 'success' | 'neutral' | 'information';
}

export const ACTIVITY_FEED: ActivityItem[] = [
  { branch: 'Kadıköy', title: 'Anket yanıtı alındı', meta: 'NPS 9 · Pozitif', tone: 'success' },
  {
    branch: 'Beşiktaş',
    title: 'Kritik uyarı tetiklendi',
    meta: 'Servis hızı · Kritiklik 0.87',
    tone: 'neutral',
  },
  {
    branch: 'Bakırköy',
    title: 'Şikayet ticket’ı açıldı',
    meta: 'Eşik altı NPS · SLA 4 saat',
    tone: 'information',
  },
  { branch: 'Ataşehir', title: 'Anket yanıtı alındı', meta: 'NPS 4 · Negatif', tone: 'neutral' },
  {
    branch: 'Şişli',
    title: 'Sınıflandırma düzeltildi',
    meta: 'İnsan onayı · örnek havuzuna eklendi',
    tone: 'information',
  },
  {
    branch: 'Üsküdar',
    title: 'Google yorumu işlendi',
    meta: 'Kategori: Temizlik · Pozitif',
    tone: 'success',
  },
];

/**
 * Section 11 — the two LLM cost models documented in Mimari §"Birim ekonomisi
 * ve bütçe". High-level only: 3CP's pricing model is not yet built, so there
 * are no tiers, no unit prices and no margin figures anywhere on this page.
 */
export interface CostModel {
  title: string;
  description: string;
  bullets: string[];
  icon: LucideIcon;
}

export const COST_MODELS: CostModel[] = [
  {
    title: 'Kendi API anahtarınız',
    description:
      'Yapay zeka maliyetini doğrudan sağlayıcınıza ödersiniz. 3CP araya girmez, üzerine bir şey eklemez.',
    bullets: [
      'Token kullanımı kiracı, modül ve tarih bazında panelde görünür',
      'Sağlayıcı ve model seçimi her modül için ayrı yapılabilir',
    ],
    icon: KeyRound,
  },
  {
    title: 'Platform havuz anahtarı',
    description:
      'Anahtar yönetimiyle uğraşmazsınız; 3CP çağrıları kendi havuzundan geçirir ve tek faturada toplar.',
    bullets: [
      'Aylık bütçe eşiği ve aşım alarmı tanımlanır',
      'Birincil sağlayıcı yanıt vermezse yedek sağlayıcı devreye girer',
    ],
    icon: Boxes,
  },
];

/** Section 4 — platform expansion chips, rendered inside SectorVerticals. */
export const CORE_CHIPS: string[] = [
  'Çoklu Marka & Şube',
  '360° Müşteri Profili',
  'Rol & Yetki Yönetimi',
  'Akıllı Yanıt Motoru',
  'Evrensel Entegrasyon',
  'Veri Maskeleme',
];

export const SECTOR_CHIPS: string[] = [
  'İlan Yönetimi',
  'Teklif & Pazarlık Süreci',
  'Portföy Eşleştirme',
  'İlan Platformu Entegrasyonları',
];

/** Section 6 — security pillars. */
export interface SecurityPillar {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const SECURITY_PILLARS: SecurityPillar[] = [
  {
    title: 'Kurumsal Seviye İzole Veri Güvenliği',
    description:
      'Her müşterinin verisi, veritabanı katmanında tamamen izole edilir. Bir markanın verisine başka hiçbir hesap erişemez.',
    icon: Database,
  },
  {
    title: 'Akıllı Veri Maskeleme',
    description:
      'Telefon, e-posta gibi hassas bilgiler kullanıcının yetkisine göre otomatik maskelenir. Her “Göster” aksiyonu kayıt altına alınır.',
    icon: EyeOff,
  },
  {
    title: 'Değiştirilemez Onay Kaydı',
    description:
      'Tüm müşteri onayları (SMS/e-posta/telefon) zaman damgalı ve değiştirilemez biçimde saklanır; KVKK silme talepleri tek akıştan yönetilir.',
    icon: FileCheck2,
  },
  {
    title: 'Tam İzlenebilirlik ve Denetim',
    description:
      'Kim, ne zaman, hangi veriyi gördü ya da değiştirdi — hepsi eksiksiz kayıt altında.',
    icon: ScrollText,
  },
];

/** Section 6 — platform capability groups (calendar-free, present tense). */
export interface Phase {
  phase: string;
  description: string;
}

export const PHASES: Phase[] = [
  {
    phase: 'Çekirdek Platform',
    description:
      'Çok katmanlı rol yönetimi, 360° müşteri profili, anonim anket ve yapay zeka anlamlandırma motoru.',
  },
  {
    phase: 'Entegrasyon Çatısı',
    description:
      'Evrensel entegrasyon altyapısı, şikayet yönetimi ve çağrı merkezi köprüsü.',
  },
  {
    phase: 'Etkileşim Motoru',
    description:
      'Kampanya ve kupon motoru, çok kanallı sosyal dinleme ve gelişmiş raporlama.',
  },
  {
    phase: 'Sektör Genişliği',
    description:
      'Sadakat ve ödül motoru; emlak, perakende ve otelcilik dikeyleri aynı çekirdek üzerinde.',
  },
];

/** Section 6 — FAQ. */
export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ: FaqItem[] = [
  {
    question: '3CP yalnızca restoranlar için mi?',
    answer:
      'Hayır. 3CP çok sektörlü bir platformdur; restoran zincirleri, emlak, perakende ve otelcilik aynı güçlü çekirdek üzerine kurulur.',
  },
  {
    question: 'Mevcut POS veya çağrı merkezi sistemimle çalışır mı?',
    answer:
      'Evet. 3CP altyapı bağımsızdır; mevcut sistemlerinizle sorunsuz entegre olur ve tedarikçiniz değişse bile çalışmaya devam eder.',
  },
  {
    question: 'Verilerimiz KVKK açısından güvende mi?',
    answer:
      'Kesinlikle. Anonim-öncelikli anket toplama, değiştirilemez onay kaydı, akıllı veri maskeleme ve kurumsal seviye izole veri güvenliği standart olarak sunulur.',
  },
  {
    question: 'Anketler için müşterinin telefon numarası zorunlu mu?',
    answer:
      'Hayır. Anketler varsayılan olarak kimlik istemeden doldurulur; iletişim bilgisi yalnızca müşteri kendisi isterse alınır. Bu, katılım oranını en üst düzeye çıkarır.',
  },
  {
    question: 'Hangi yapay zeka teknolojisini kullanıyorsunuz?',
    answer:
      'Altyapımız sağlayıcı bağımsızdır: Gemini, OpenAI, Claude, Mistral ve gelecekteki modeller. Her modül için en uygun modeli seçme esnekliği sizde.',
  },
  {
    question: 'Platformu ne kadar hızlı kullanmaya başlayabiliriz?',
    answer:
      '3CP bulut tabanlı bir SaaS platformudur; kurulum gerektirmez. Size özel bir demo ve hızlı kurulum sürecinin ardından kısa sürede canlıya alırsınız.',
  },
];

/** Section 7 — footer link groups. */
export interface FooterGroup {
  title: string;
  links: { label: string; href: string }[];
}

export const FOOTER_GROUPS: FooterGroup[] = [
  {
    title: 'Ürün',
    links: [
      { label: 'Yetenekler', href: '#yetenekler' },
      { label: 'Nasıl Çalışır', href: '#nasil-calisir' },
      { label: 'Güvenlik', href: '#guvenlik' },
      { label: 'Yol Haritası', href: '#yol-haritasi' },
    ],
  },
  {
    title: 'Şirket',
    links: [
      { label: 'İletişim', href: '#demo' },
      { label: 'Demo İste', href: '#demo' },
    ],
  },
  {
    title: 'Yasal',
    links: [
      { label: 'KVKK Aydınlatma Metni', href: 'belgeler/kvkk-gizlilik.pdf' },
      { label: 'Gizlilik Politikası', href: 'belgeler/kvkk-gizlilik.pdf' },
    ],
  },
];

/** Shared contact target for the closing band's e-mail action. */
export const CONTACT_EMAIL = 'demo@3cp.app';
