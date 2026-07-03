import type { Locale, Translation } from "./types";

export const dictionary = {
  en: {
    nav: {
      home: "Home",
      classes: "Classes",
      events: "Events",
      gallery: "Gallery",
      about: "About",
      partners: "Partners",
      register: "Register",
      admin: "Admin"
    },
    heroTitle: "Elsa Dance School",
    heroSubtitle:
      "Chinese dance, performance training, competitions, and stage-ready confidence in Montreal.",
    reserve: "Reserve a spot",
    viewClasses: "View classes",
    address: "8220 Mayrand, Montreal, Quebec",
    proof: "Annual gala at Place des Arts | Community performances | Competition teams",
    classesTitle: "Classes",
    eventsTitle: "Events and performances",
    galleryTitle: "Gallery",
    aboutTitle: "About Elsa Dance School",
    aboutBody:
      "Elsa Dance School trains dancers with discipline, musicality, and expressive stage presence. The school presents an annual gala at Place des Arts and participates in community activities and competitions across Quebec.",
    partnersTitle: "Partners and private clients",
    partnersBody:
      "Book cultural performances, private lessons, event choreography, and school or community collaborations.",
    registrationTitle: "Reserve your class spot",
    registrationBody:
      "Submit a reservation request now. Your spot is held as payment pending, and staff will follow up for pay-at-school confirmation.",
    available: "spots available",
    unlimited: "Open enrollment",
    full: "Waitlist",
    submit: "Reserve spot",
    success: "Reservation received. We will follow up soon.",
    adminTitle: "Staff admin",
    login: "Log in",
    logout: "Log out",
    inquiries: "Reservations",
    status: "Status"
  },
  fr: {
    nav: {
      home: "Accueil",
      classes: "Cours",
      events: "Evenements",
      gallery: "Galerie",
      about: "A propos",
      partners: "Partenaires",
      register: "Inscription",
      admin: "Admin"
    },
    heroTitle: "Elsa Dance School",
    heroSubtitle:
      "Danse chinoise, entrainement de scene, competitions et confiance artistique a Montreal.",
    reserve: "Reserver une place",
    viewClasses: "Voir les cours",
    address: "8220 Mayrand, Montreal, Quebec",
    proof: "Gala annuel a la Place des Arts | Performances communautaires | Equipes de competition",
    classesTitle: "Cours",
    eventsTitle: "Evenements et spectacles",
    galleryTitle: "Galerie",
    aboutTitle: "A propos d'Elsa Dance School",
    aboutBody:
      "Elsa Dance School forme les danseurs avec discipline, musicalite et presence scenique. L'ecole presente un gala annuel a la Place des Arts et participe a des activites communautaires et competitions au Quebec.",
    partnersTitle: "Partenaires et clients prives",
    partnersBody:
      "Reservez des performances culturelles, cours prives, choregraphies d'evenement et collaborations scolaires ou communautaires.",
    registrationTitle: "Reserver votre place",
    registrationBody:
      "Soumettez une demande de reservation. La place est retenue en attente du paiement, et l'equipe vous contactera pour confirmer le paiement a l'ecole.",
    available: "places disponibles",
    unlimited: "Inscription ouverte",
    full: "Liste d'attente",
    submit: "Reserver",
    success: "Reservation recue. Nous vous contacterons bientot.",
    adminTitle: "Admin equipe",
    login: "Connexion",
    logout: "Deconnexion",
    inquiries: "Reservations",
    status: "Statut"
  },
  zh: {
    nav: {
      home: "首页",
      classes: "课程",
      events: "演出",
      gallery: "相册",
      about: "关于",
      partners: "合作",
      register: "报名",
      admin: "管理"
    },
    heroTitle: "Elsa Dance School",
    heroSubtitle: "蒙特利尔中国舞、舞台训练、比赛团队与自信表达。",
    reserve: "预留名额",
    viewClasses: "查看课程",
    address: "8220 Mayrand, Montreal, Quebec",
    proof: "艺术广场年度汇演 | 社区演出 | 比赛团队",
    classesTitle: "课程",
    eventsTitle: "演出与活动",
    galleryTitle: "相册",
    aboutTitle: "关于 Elsa Dance School",
    aboutBody:
      "Elsa Dance School 注重纪律、音乐性与舞台表现力。学校每年在 Place des Arts 举办汇演，并积极参与社区活动和魁北克各类比赛。",
    partnersTitle: "合作伙伴与私教客户",
    partnersBody: "可预约文化演出、私教课程、活动编舞，以及学校和社区合作项目。",
    registrationTitle: "预留课程名额",
    registrationBody: "提交报名后，名额将标记为待付款预留，工作人员会联系您到校付款确认。",
    available: "个名额",
    unlimited: "开放报名",
    full: "候补",
    submit: "提交预留",
    success: "报名已收到，我们会尽快联系您。",
    adminTitle: "员工管理",
    login: "登录",
    logout: "退出",
    inquiries: "报名记录",
    status: "状态"
  }
} as const;

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "fr" || value === "zh";
}

export function t(value: Translation, locale: Locale) {
  return value[locale] || value.en;
}
