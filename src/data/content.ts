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
  Bot,
  Ticket,
  PhoneCall,
  Megaphone,
  Radio,
  BarChart3,
  Gift,
  Plug,
  Database,
  EyeOff,
  FileCheck2,
  ScrollText,
} from 'lucide-react';

/** Navigation links shared by the desktop navbar and the mobile menu. */
export const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'Nasıl Çalışır?', href: '#nasil-calisir' },
  { label: 'Yetenekler', href: '#yetenekler' },
  { label: 'Güvenlik', href: '#guvenlik' },
  { label: 'Yol Haritası', href: '#yol-haritasi' },
  { label: 'SSS', href: '#sss' },
];

/** Section 2 — sector strip. */
export interface Sector {
  name: string;
  status: string;
  active: boolean;
}

export const SECTORS: Sector[] = [
  { name: 'Restoran Zincirleri', status: 'AKTİF', active: true },
  { name: 'Emlak', status: 'YAKINDA', active: false },
  { name: 'Perakende', status: 'YAKINDA', active: false },
  { name: 'Otelcilik', status: 'YAKINDA', active: false },
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

/** Section 3 — how it works, 3-step pipeline. */
export interface Step {
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  portrait?: boolean;
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
    image: 'images/step-2-ai-analizi.png',
    imageAlt: 'Yapay zeka geri bildirim analizi: kategori, duygu skoru ve güven oranı',
  },
  {
    number: '03',
    title: 'Tek Merkezden Stratejik Aksiyon',
    description:
      'Dağınık veri değil, önceliklendirilmiş içgörü. Kritik puanlar otomatik olarak aksiyon listenize düşer; ekibiniz vakit kaybetmeden harekete geçer.',
    image: 'images/step-3-stratejik-aksiyon.png',
    imageAlt: 'Bölge yöneticisi paneli: şube NPS performansı, otomatik oluşan ticketlar ve kritik uyarılar',
  },
];

/** Section 4 — capabilities matrix. */
export interface Capability {
  title: string;
  description: string;
  status: 'HAZIR' | 'ÇOK YAKINDA';
  icon: LucideIcon;
}

export const CAPABILITIES: Capability[] = [
  {
    title: 'Çok Katmanlı Rol ve Şube Yönetimi',
    description:
      'Şirket, marka, şube ve departman hiyerarşinizin tamamını tek ekrandan yönetin. Her ekibe tam ihtiyacı kadar yetki verin; kimin neyi görebileceğine siz karar verin.',
    status: 'HAZIR',
    icon: KeyRound,
  },
  {
    title: '360° Merkezi Müşteri Profili',
    description:
      'Her müşterinizin anket, şikayet, kampanya ve satın alma geçmişi tek bir profilde birleşir. KVKK uyumlu, zaman damgalı onay kaydıyla.',
    status: 'HAZIR',
    icon: Contact,
  },
  {
    title: 'Anket & NPS Yönetimi',
    description:
      'QR ile saniyeler içinde anonim anket toplayın; şube ve ürün bazında NPS performansınızı canlı olarak izleyin.',
    status: 'HAZIR',
    icon: ClipboardList,
  },
  {
    title: 'Yapay Zeka Destekli Anlamlandırma Motoru',
    description:
      'Binlerce yorumu otomatik olarak kategori, duygu ve kritiklik düzeyine göre sınıflandırın. Sistem, her insan düzeltmesiyle daha da akıllanır.',
    status: 'HAZIR',
    icon: Sparkles,
  },
  {
    title: 'Kurumsal Akıllı Yanıt ve Otomasyon Sistemi',
    description:
      'Markanızın ses tonuna uygun otomatik yanıtlar; sağlayıcı bağımsız yapay zeka altyapısı ve tam şeffaf maliyet kontrolü.',
    status: 'HAZIR',
    icon: Bot,
  },
  {
    title: 'Şikayet Yönetimi',
    description:
      'Tüm kanallardan gelen şikayetleri tek panelde toplayın; yapay zeka destekli yanıt taslakları, SLA takibi ve Kanban görünümüyle hızlıca çözün.',
    status: 'ÇOK YAKINDA',
    icon: Ticket,
  },
  {
    title: 'Çağrı Merkezi Köprüsü',
    description:
      'Arayan müşteriyi anında tanıyın; maskeli müşteri kartı ekrana düşer, tüm çağrı geçmişi otomatik olarak profile işlenir.',
    status: 'ÇOK YAKINDA',
    icon: PhoneCall,
  },
  {
    title: 'Kampanya & Kupon Motoru',
    description:
      "Segment bazlı kampanyalar kurun, kuponları POS'a otomatik iletin; yapay zeka ile kişiselleştirilmiş, İYS uyumlu mesajlar gönderin.",
    status: 'ÇOK YAKINDA',
    icon: Megaphone,
  },
  {
    title: 'Çok Kanallı Sosyal Dinleme',
    description:
      'Google, Yemeksepeti, Getir ve sosyal medya yorumlarını tek gelen kutusunda toplayın; yapay zeka destekli yanıtlarla anında karşılık verin.',
    status: 'ÇOK YAKINDA',
    icon: Radio,
  },
  {
    title: 'Gelişmiş Raporlama & BI',
    description:
      'Modüller arası birleşik panolar, Excel ve Power BI aktarımı, yapay zeka ile hazırlanan yönetici özetleri.',
    status: 'ÇOK YAKINDA',
    icon: BarChart3,
  },
  {
    title: 'Sadakat ve Ödül Motoru',
    description:
      'Puan ve seviye kurallarını dilediğiniz gibi tanımlayın; müşteri profiliyle senkron üyelik ve otomatik kampanya tetikleme.',
    status: 'ÇOK YAKINDA',
    icon: Gift,
  },
  {
    title: 'Evrensel Entegrasyon Altyapısı',
    description:
      'POS, çağrı merkezi ve tüm dış sistemlerinizle sorunsuz bağlantı. Tedarikçiniz değişse bile platformunuz kesintisiz çalışır.',
    status: 'ÇOK YAKINDA',
    icon: Plug,
  },
];

/** Section 5 — differentiators. */
export interface Differentiator {
  title: string;
  description: string;
}

export const DIFFERENTIATORS: Differentiator[] = [
  {
    title: 'Evrensel Çekirdek Teknolojisi',
    description:
      'Tek bir güçlü çekirdek; sınırsız marka, şube ve sektör. Yeni ihtiyaçlar dakikalar içinde yapılandırmayla eklenir — 3CP bir araç değil, sizinle büyüyen bir platformdur.',
  },
  {
    title: 'Evrensel Entegrasyon ve Altyapı Bağımsızlığı',
    description:
      "3CP tedarikçilerinizin yerini almaz, hepsiyle konuşur. POS'unuz ya da çağrı merkeziniz değişse bile platformunuz kesintisiz çalışmaya devam eder.",
  },
  {
    title: 'Anonim-Öncelikli ve Tam Uyumlu',
    description:
      'Anketler kimlik zorunluluğu olmadan toplanır; bu hem katılımı en üst düzeye çıkarır hem de sizi platform politikalarına aykırı yönlendirme riskinden korur.',
  },
  {
    title: 'Kurumsal Seviye İzole Veri Güvenliği',
    description:
      'Her müşterinin verisi, veritabanı katmanında birbirinden tamamen izole edilir. Akıllı maskeleme ve tam denetim izi; güvenliği sonradan eklenen bir özellik değil, temel bir standart yapar.',
  },
];

/** Section 5 — platform expansion chips. */
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

/** Section 6 — roadmap phases. */
export interface Phase {
  phase: string;
  description: string;
  current: boolean;
  status?: string;
}

export const PHASES: Phase[] = [
  {
    phase: 'Bugün · Canlı Platform',
    description:
      'Çok katmanlı rol yönetimi, 360° müşteri profili, anonim anket ve yapay zeka anlamlandırma motoru — bugün kullanımınızda.',
    current: true,
    status: 'AKTİF',
  },
  {
    phase: 'Q3 2026',
    description:
      'Evrensel entegrasyon altyapısı, şikayet yönetimi ve çağrı merkezi köprüsü.',
    current: false,
  },
  {
    phase: 'Q4 2026',
    description:
      'Kampanya & kupon motoru, çok kanallı sosyal dinleme ve gelişmiş raporlama.',
    current: false,
  },
  {
    phase: '2027 ve Ötesi',
    description:
      'Sadakat ve ödül motoru; emlak, perakende ve yeni sektörlere genişleyen vizyon.',
    current: false,
    status: 'GELECEK VİZYONU',
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
      'Hayır. İlk odağımız restoran zincirleri olsa da 3CP çok sektörlü bir platformdur; emlak, perakende ve daha birçok sektör aynı güçlü çekirdek üzerine kurulur.',
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
