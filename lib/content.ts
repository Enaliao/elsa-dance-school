import type { ClassOption, EventItem, MediaItem, ProgramId, Translation } from "./types";

export const locales = ["en", "fr", "zh"] as const;

export const programNames: Record<ProgramId, Translation> = {
  "chinese-dance": {
    en: "Chinese Dance",
    fr: "Danse chinoise",
    zh: "中国舞"
  },
  contemporary: {
    en: "Contemporary",
    fr: "Contemporain",
    zh: "现代舞"
  },
  "k-pop": {
    en: "K-pop",
    fr: "K-pop",
    zh: "K-pop"
  },
  "private-lessons": {
    en: "Private Lessons",
    fr: "Cours privés",
    zh: "私教课程"
  },
  "summer-camp": {
    en: "Summer Camp",
    fr: "Camp d'ete",
    zh: "夏令营"
  }
};

export const teachers = [
  {
    id: "elsa",
    name: "Elsa",
    role: {
      en: "Artistic director and performance coach",
      fr: "Directrice artistique et coach de scene",
      zh: "艺术总监与舞台表演老师"
    },
    bio: {
      en: "Elsa guides choreography, performance preparation, and stage expression for students preparing for galas, community events, and competitions.",
      fr: "Elsa guide la choregraphie, la preparation de scene et l'expression artistique pour les galas, evenements communautaires et competitions.",
      zh: "Elsa 负责舞蹈编排、演出准备与舞台表现训练，带领学生参加汇演、社区活动和比赛。"
    }
  },
  {
    id: "helen",
    name: "Helen",
    role: {
      en: "Foundation and youth instructor",
      fr: "Professeure fondations et jeunes",
      zh: "基础与青少年课程老师"
    },
    bio: {
      en: "Helen helps young dancers build posture, coordination, rhythm, and confidence. She is also an accomplished dancer with multiple awards, including a top placement at the North America Taoli Cup.",
      fr: "Helen aide les jeunes danseurs a developper posture, coordination, rythme et confiance. Elle est aussi une danseuse accomplie avec plusieurs prix, dont un excellent classement a la Coupe Taoli d'Amerique du Nord.",
      zh: "Helen 注重帮助学生建立体态、协调性、节奏感与自信心。她不仅是一位优秀的老师，也是一位优秀的舞者，获得多个奖项，包括北美桃李杯顶级名次。"
    }
  }
];

export const classes: ClassOption[] = [
  {
    id: "kids-chinese-foundation",
    programId: "chinese-dance",
    title: {
      en: "Chinese Dance Foundation",
      fr: "Fondations de danse chinoise",
      zh: "中国舞基础班"
    },
    ageGroup: "kids",
    level: { en: "Beginner", fr: "Debutant", zh: "初级" },
    schedule: {
      en: "Saturday 10:00-11:15",
      fr: "Samedi 10 h 00-11 h 15",
      zh: "周六 10:00-11:15"
    },
    capacity: 30,
    reserved: 9
  },
  {
    id: "teens-chinese-performance",
    programId: "chinese-dance",
    title: {
      en: "Chinese Dance Performance Team",
      fr: "Equipe de performance en danse chinoise",
      zh: "中国舞表演队"
    },
    ageGroup: "teens",
    level: { en: "Intermediate", fr: "Intermediaire", zh: "中级" },
    schedule: {
      en: "Sunday 13:00-15:00",
      fr: "Dimanche 13 h 00-15 h 00",
      zh: "周日 13:00-15:00"
    },
    capacity: 30,
    reserved: 12
  },
  {
    id: "adult-chinese-dance",
    programId: "chinese-dance",
    title: {
      en: "Adult Chinese Dance",
      fr: "Danse chinoise adulte",
      zh: "成人中国舞"
    },
    ageGroup: "adults",
    level: { en: "Open level", fr: "Tous niveaux", zh: "开放级别" },
    schedule: {
      en: "Wednesday 19:00-20:30",
      fr: "Mercredi 19 h 00-20 h 30",
      zh: "周三 19:00-20:30"
    },
    capacity: 30,
    reserved: 7
  },
  {
    id: "kpop-teens",
    programId: "k-pop",
    title: { en: "K-pop Choreo", fr: "Choregraphie K-pop", zh: "K-pop 编舞" },
    ageGroup: "teens",
    level: { en: "Open level", fr: "Tous niveaux", zh: "开放级别" },
    schedule: {
      en: "Friday 18:30-20:00",
      fr: "Vendredi 18 h 30-20 h 00",
      zh: "周五 18:30-20:00"
    },
    capacity: 30,
    reserved: 15
  },
  {
    id: "contemporary-mixed",
    programId: "contemporary",
    title: { en: "Contemporary Technique", fr: "Technique contemporaine", zh: "现代舞技巧" },
    ageGroup: "mixed",
    level: { en: "Intermediate", fr: "Intermediaire", zh: "中级" },
    schedule: {
      en: "Tuesday 18:30-20:00",
      fr: "Mardi 18 h 30-20 h 00",
      zh: "周二 18:30-20:00"
    },
    capacity: 30,
    reserved: 8
  },
  {
    id: "private-coaching",
    programId: "private-lessons",
    title: { en: "Private Coaching", fr: "Coaching prive", zh: "一对一私教" },
    ageGroup: "private",
    level: { en: "By assessment", fr: "Sur evaluation", zh: "按评估安排" },
    schedule: {
      en: "By appointment",
      fr: "Sur rendez-vous",
      zh: "预约安排"
    },
    capacity: 30,
    reserved: 3
  },
  {
    id: "summer-camp-2026",
    programId: "summer-camp",
    title: { en: "Summer Dance Camp", fr: "Camp de danse d'ete", zh: "暑期舞蹈营" },
    ageGroup: "kids",
    level: { en: "Mixed level", fr: "Niveaux mixtes", zh: "混合级别" },
    schedule: {
      en: "July-August weekly sessions",
      fr: "Sessions hebdomadaires juillet-aout",
      zh: "七月至八月每周课程"
    },
    capacity: 30,
    reserved: 14
  }
];

export const events: EventItem[] = [
  {
    id: "place-des-arts-gala",
    title: {
      en: "Annual Gala at Place des Arts",
      fr: "Gala annuel a la Place des Arts",
      zh: "艺术广场年度汇演"
    },
    date: "2026-05-24",
    location: {
      en: "Place des Arts, Montreal",
      fr: "Place des Arts, Montreal",
      zh: "蒙特利尔艺术广场"
    },
    summary: {
      en: "A full-stage school production celebrating technique, artistry, and ensemble performance.",
      fr: "Une production complete qui celebre la technique, l'art et le travail d'ensemble.",
      zh: "整台舞台演出，呈现技巧、艺术表现和团队合作。"
    },
    type: "gala"
  },
  {
    id: "community-culture-festival",
    title: {
      en: "Community Culture Festival",
      fr: "Festival culturel communautaire",
      zh: "社区文化节"
    },
    date: "2026-02-08",
    location: { en: "Montreal", fr: "Montreal", zh: "蒙特利尔" },
    summary: {
      en: "Students shared Chinese dance repertoire with families and local partners.",
      fr: "Les eleves ont presente un repertoire de danse chinoise aux familles et partenaires locaux.",
      zh: "学生为家庭和社区伙伴展示中国舞作品。"
    },
    type: "community"
  },
  {
    id: "regional-competition",
    title: {
      en: "Regional Dance Competition",
      fr: "Competition regionale de danse",
      zh: "地区舞蹈比赛"
    },
    date: "2025-11-16",
    location: { en: "Quebec", fr: "Quebec", zh: "魁北克" },
    summary: {
      en: "Performance teams represented Elsa Dance School in solo and group categories.",
      fr: "Les equipes ont represente Elsa Dance School en categories solo et groupe.",
      zh: "表演队参加独舞和群舞项目，代表学校参赛。"
    },
    type: "competition"
  }
];

export const media: MediaItem[] = [
  {
    id: "gala-stage",
    kind: "photo",
    eventId: "place-des-arts-gala",
    title: { en: "Gala Group Photo", fr: "Photo de groupe du gala", zh: "汇演合影" },
    src: "/photos/optimized-group-photo.jpg"
  },
  {
    id: "silks-rehearsal",
    kind: "photo",
    eventId: "community-culture-festival",
    title: { en: "Fan Dance Rehearsal", fr: "Repetition de danse aux eventails", zh: "扇舞彩排" },
    src: "/photos/optimized-rehearsal.jpg"
  },
  {
    id: "ensemble",
    kind: "photo",
    eventId: "regional-competition",
    title: { en: "Stage Performance", fr: "Performance sur scene", zh: "舞台演出" },
    src: "/photos/optimized-performance.jpg"
  }
];
