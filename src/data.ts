import personalStatementContent from "../content/personal_statement.json";
import travelManifestContent from "./generated/travelManifest.json";

export const personalStatement = personalStatementContent;

export const profile = {
  nameZh: "齐恒",
  nameEn: "Qi Heng",
  schoolZh: "东华大学物理学院",
  schoolEn: "College of Physics, Donghua University",
  majorZh: "应用物理学（新能源与微电子）",
  majorEn: "Applied Physics, New Energy and Microelectronics Track",
  directionZh: "AI Agent · 计算物理 · AI for Science",
  directionEn: "AI Agents · Computational Physics · AI for Science",
  email: "19836740005@163.com",
  github: "https://github.com/hengqi61-maker",
  githubLabel: "github.com/hengqi61-maker",
  cv: "./Qi_Heng_CV.pdf",
  statementPdf: "./Qi_Heng_Statement.pdf",
  interviewDeck: "./materials/Qi_Heng_Interview_Presentation.pptx",
  statementZh: "把走向未知的探索欲，转化为可以计算、实现和验证的技术实践。",
  statementEn:
    "Turning curiosity about the unknown into computational, testable, and practical systems.",
};

export const metrics = [
  { value: "3.91 / 5.00", labelZh: "平均绩点", labelEn: "GPA" },
  { value: "5 / 65", labelZh: "专业排名 · 前 7.7%", labelEn: "Major rank" },
  { value: "CET-6 551", labelZh: "英语能力", labelEn: "English proficiency" },
];

export const interests = [
  {
    zh: "AI Agent 与科研工作流",
    en: "AI agents and research workflows",
    detailZh: "探索智能系统如何协助学习、文献理解、代码实验、知识管理和项目迭代。",
    detailEn:
      "Intelligent systems for learning, literature, code experiments, knowledge management, and iteration.",
  },
  {
    zh: "计算物理与数值模拟",
    en: "Computational physics and simulation",
    detailZh: "关注从物理问题理解、计算建模、程序实现到结果验证的完整链条。",
    detailEn:
      "From physical questions and computational models to implementation and validation.",
  },
  {
    zh: "物理可视化",
    en: "Physics visualization",
    detailZh: "把晶格、倒空间、波函数概率分布等抽象对象转化为可解释图形。",
    detailEn:
      "Turning lattices, reciprocal space, and probability fields into interpretable visuals.",
  },
  {
    zh: "AI for Science 与量子系统",
    en: "AI for Science and quantum systems",
    detailZh: "希望结合 Transformer、AI Agent 与量子信息、量子系统模拟等物理问题。",
    detailEn:
      "Connecting transformers and AI agents with quantum information and physical simulation.",
  },
];

export const journeyPhotos = [
  {
    file: "travel-01.webp",
    alt: "一名旅行者站在海边岩石上望向远处海面",
    layout: "wide",
  },
  {
    file: "travel-02.webp",
    alt: "四位同行者在夜晚城市灯光前合影",
    layout: "wide",
  },
  {
    file: "travel-03.webp",
    alt: "两位同行者在夜景前并肩合影",
    layout: "standard",
  },
  {
    file: "travel-04.webp",
    alt: "透过室内落地窗看到海滩和海面",
    layout: "standard",
  },
  {
    file: "travel-05.webp",
    alt: "一群同行者围坐餐桌分享旅途中的一餐",
    layout: "wide",
  },
  {
    file: "travel-06.webp",
    alt: "穿橙色外套的旅行者面向雪山和林地",
    layout: "standard",
  },
  {
    file: "travel-07.webp",
    alt: "徒步者站在高山湖泊前指向远处山峰",
    layout: "feature",
  },
  {
    file: "travel-08.webp",
    alt: "背着徒步背包的旅行者站在层叠山峦前",
    layout: "standard",
  },
  {
    file: "travel-09.webp",
    alt: "旅行者站在山间建筑与远景前",
    layout: "standard",
  },
  {
    file: "travel-10.webp",
    alt: "阳光照亮远处连绵雪山",
    layout: "wide",
  },
  {
    file: "travel-11.webp",
    alt: "蓝天下随风展开的户外布幡",
    layout: "standard",
  },
  {
    file: "travel-12.webp",
    alt: "戴耳机的行人剪影与城市街道",
    layout: "portrait",
  },
];

export type TravelAlbumPhoto = {
  id?: string;
  file: string;
  thumb?: string;
  preview?: string;
  large?: string;
  width?: number;
  height?: number;
  titleZh: string;
  titleEn: string;
  meta: string;
  place: string;
  time: string;
  mood: string;
  note: string;
  sourceFolder?: string;
  sourceName?: string;
  featured?: boolean;
};

export type TravelDestination = {
  id: string;
  nameZh: string;
  nameEn: string;
  status: string;
  descriptionZh: string;
  stats: {
    places: number;
    photos: number;
    videos: number;
  };
  mapLabel: {
    x: number;
    y: number;
  };
  cover: string;
  accent: string;
  photos: TravelAlbumPhoto[];
  sourceFolder?: string;
};

export const legacyTravelDestinations: TravelDestination[] = [
  {
    id: "yunnan",
    nameZh: "云南",
    nameEn: "Yunnan",
    status: "已探索",
    descriptionZh: "雪山、湖泊、山谷和风马旗，把一次徒步展开成一条高原记忆线。",
    stats: {
      places: 5,
      photos: 5,
      videos: 0,
    },
    mapLabel: {
      x: 39,
      y: 70,
    },
    cover: "travel-10.webp",
    accent: "#0b6ffb",
    photos: [
      {
        file: "travel-06.webp",
        titleZh: "雪山栈道",
        titleEn: "Snow Mountain Trail",
        meta: "雪山徒步",
        place: "云南 · 高原山线",
        time: "2024 夏",
        mood: "清醒 / 开阔",
        note: "从栈道望向雪线，远方第一次变得可以靠近。",
      },
      {
        file: "travel-07.webp",
        titleZh: "高山湖泊",
        titleEn: "Alpine Lake",
        meta: "湖边坐标",
        place: "云南 · 高山湖",
        time: "2024 夏",
        mood: "自由 / 平静",
        note: "在湖和雪山之间，重新理解远方。",
      },
      {
        file: "travel-08.webp",
        titleZh: "山谷远眺",
        titleEn: "Valley Outlook",
        meta: "徒步节点",
        place: "云南 · 山谷",
        time: "2024 夏",
        mood: "专注 / 开阔",
        note: "把长路拆成脚下的一步，很多问题也变得可以推进。",
      },
      {
        file: "travel-10.webp",
        titleZh: "日照金山",
        titleEn: "Golden Mountain",
        meta: "晨光雪线",
        place: "云南 · 雪山",
        time: "2024 夏",
        mood: "震撼 / 清醒",
        note: "山体被光照亮的瞬间，像地图上突然出现的答案。",
      },
      {
        file: "travel-11.webp",
        titleZh: "风马旗",
        titleEn: "Prayer Flags",
        meta: "风向记录",
        place: "云南 · 高原路边",
        time: "2024 夏",
        mood: "明亮 / 轻盈",
        note: "风吹过布幡，也把旅途的速度慢下来。",
      },
    ],
  },
  {
    id: "hongkong",
    nameZh: "香港",
    nameEn: "Hong Kong",
    status: "已探索",
    descriptionZh: "夜色、海风、街道和朋友，把城市旅行压缩成明亮的胶片。",
    stats: {
      places: 3,
      photos: 3,
      videos: 0,
    },
    mapLabel: {
      x: 55,
      y: 77,
    },
    cover: "travel-02.webp",
    accent: "#0f7cff",
    photos: [
      {
        file: "travel-02.webp",
        titleZh: "山顶夜色",
        titleEn: "Harbor Night",
        meta: "城市夜景",
        place: "香港 · 夜景观景点",
        time: "2024",
        mood: "明亮 / 兴奋",
        note: "灯光从海湾一路铺开，像一张可以被点亮的地图。",
      },
      {
        file: "travel-03.webp",
        titleZh: "夜色同行",
        titleEn: "Night Company",
        meta: "同行合影",
        place: "香港 · 城市夜行",
        time: "2024",
        mood: "轻松 / 亲近",
        note: "人的存在让风景从地点变成记忆。",
      },
      {
        file: "travel-05.webp",
        titleZh: "旅途餐桌",
        titleEn: "Travel Table",
        meta: "城市补给",
        place: "香港 · 餐桌片段",
        time: "2024",
        mood: "热烈 / 放松",
        note: "一顿饭能把长途跋涉重新连接成共同记忆。",
      },
    ],
  },
  {
    id: "japan",
    nameZh: "日本",
    nameEn: "Japan",
    status: "已探索",
    descriptionZh: "寺庙、街景和独自规划的路线，记录一次真正意义上的远行。",
    stats: {
      places: 2,
      photos: 2,
      videos: 0,
    },
    mapLabel: {
      x: 79,
      y: 57,
    },
    cover: "travel-09.webp",
    accent: "#d4485a",
    photos: [
      {
        file: "travel-09.webp",
        titleZh: "寺院木台",
        titleEn: "Temple Terrace",
        meta: "古都建筑",
        place: "日本 · 京都",
        time: "2024",
        mood: "安静 / 好奇",
        note: "木质廊台和远处城市并置，让时间感变得很具体。",
      },
      {
        file: "travel-12.webp",
        titleZh: "街道剪影",
        titleEn: "Street Silhouette",
        meta: "城市转场",
        place: "日本 · 城市街道",
        time: "2024",
        mood: "清醒 / 流动",
        note: "城市的轮廓很快，照片把它留下来。",
      },
    ],
  },
  {
    id: "jeju",
    nameZh: "济州岛",
    nameEn: "Jeju Island",
    status: "已探索",
    descriptionZh: "海岸、礁石和窗边光线，是另一种更松弛的岛屿记忆。",
    stats: {
      places: 2,
      photos: 2,
      videos: 0,
    },
    mapLabel: {
      x: 70,
      y: 49,
    },
    cover: "travel-01.webp",
    accent: "#00a7c7",
    photos: [
      {
        file: "travel-01.webp",
        titleZh: "海岸礁石",
        titleEn: "Coastal Rock",
        meta: "岛屿海岸",
        place: "济州岛 · 海边",
        time: "2024",
        mood: "松弛 / 开阔",
        note: "站在海边岩石上，才更容易意识到自己正在出发。",
      },
      {
        file: "travel-04.webp",
        titleZh: "窗外海岸",
        titleEn: "Window Coast",
        meta: "海景窗边",
        place: "济州岛 · 海岸咖啡馆",
        time: "2024",
        mood: "温柔 / 缓慢",
        note: "透过窗看见远处，像把旅途暂时折进一张纸里。",
      },
    ],
  },
];

type TravelManifest = {
  generatedAt: string;
  sourceZip: string;
  totals: {
    destinations: number;
    photos: number;
    videos: number;
  };
  destinations: TravelDestination[];
};

export type AtlasNode = {
  x: number;
  y: number;
};

export type TravelAlbum = {
  id: string;
  titleZh: string;
  titleEn: string;
  cover: string;
  accent: string;
  descriptionZh: string;
  stats: {
    places: number;
    photos: number;
    videos: number;
  };
  photos: TravelAlbumPhoto[];
  destinationId: string;
};

export type JourneyRegion = {
  id: string;
  level: "country" | "region";
  nameZh: string;
  nameEn: string;
  type: "国家" | "地区";
  status: string;
  descriptionZh: string;
  stats: {
    places: number;
    photos: number;
    videos: number;
  };
  cover: string;
  node: AtlasNode;
  accent: string;
  albumId?: string;
  childrenType?: "province-map";
};

export type ChinaDestination = TravelDestination & {
  node: AtlasNode;
  geo?: {
    lon: number;
    lat: number;
  };
  albumId: string;
};

export const generatedTravelManifest = travelManifestContent as TravelManifest;

export const generatedTravelDestinations: TravelDestination[] =
  generatedTravelManifest.destinations;

const generatedDestinationById = new Map(
  generatedTravelDestinations.map((destination) => [destination.id, destination]),
);

const legacyDestinationById = new Map(
  legacyTravelDestinations.map((destination) => [destination.id, destination]),
);

const getDestination = (id: string) =>
  generatedDestinationById.get(id) ?? legacyDestinationById.get(id);

export const travelDestinations =
  generatedTravelDestinations.length > 0 ? generatedTravelDestinations : legacyTravelDestinations;

const chinaDestinationOrder = [
  "wuhan",
  "yunnan",
  "rizhao",
  "huangshan",
  "ningbo",
  "wugongshan",
  "kulagangri",
  "laojunshan",
  "changbaishan",
];

const chinaMapNodeOverrides: Record<string, AtlasNode> = {
  wuhan: { x: 54, y: 59 },
  yunnan: { x: 37, y: 77 },
  rizhao: { x: 64, y: 48 },
  huangshan: { x: 62, y: 64 },
  ningbo: { x: 69, y: 59 },
  wugongshan: { x: 49, y: 72 },
  kulagangri: { x: 27, y: 66 },
  laojunshan: { x: 45, y: 52 },
  changbaishan: { x: 72, y: 32 },
};

const chinaDestinationCoordinates: Record<string, { lon: number; lat: number }> = {
  wuhan: { lon: 114.3055, lat: 30.5928 },
  yunnan: { lon: 102.7123, lat: 25.0406 },
  rizhao: { lon: 119.5269, lat: 35.4164 },
  huangshan: { lon: 118.3375, lat: 29.7147 },
  ningbo: { lon: 121.5504, lat: 29.8746 },
  wugongshan: { lon: 114.169, lat: 27.47 },
  kulagangri: { lon: 90.65, lat: 28.23 },
  laojunshan: { lon: 111.65, lat: 33.75 },
  changbaishan: { lon: 128.06, lat: 42.01 },
};

export const chinaDestinations: ChinaDestination[] = chinaDestinationOrder
  .map((id) => getDestination(id))
  .filter((destination): destination is TravelDestination => Boolean(destination))
  .map((destination) => ({
    ...destination,
    node: chinaMapNodeOverrides[destination.id] ?? destination.mapLabel,
    geo: chinaDestinationCoordinates[destination.id],
    albumId: `${destination.id}-album`,
  }));

const sumTravelStats = (destinations: TravelDestination[]) =>
  destinations.reduce(
    (total, destination) => ({
      places: total.places + destination.stats.places,
      photos: total.photos + destination.stats.photos,
      videos: total.videos + destination.stats.videos,
    }),
    { places: 0, photos: 0, videos: 0 },
  );

const makeAlbum = (destination: TravelDestination): TravelAlbum => ({
  id: `${destination.id}-album`,
  titleZh: `${destination.nameZh}折页相册`,
  titleEn: `${destination.nameEn} Accordion Album`,
  cover: destination.cover,
  accent: destination.accent,
  descriptionZh: destination.descriptionZh,
  stats: destination.stats,
  photos: destination.photos,
  destinationId: destination.id,
});

export const travelAlbums: Record<string, TravelAlbum> = Object.fromEntries(
  travelDestinations.map((destination) => [`${destination.id}-album`, makeAlbum(destination)]),
);

const chinaStats = sumTravelStats(chinaDestinations);
const hongkongDestination = getDestination("hongkong") ?? legacyTravelDestinations[1];
const japanDestination = getDestination("japan") ?? legacyTravelDestinations[2];
const jejuDestination = getDestination("jeju") ?? legacyTravelDestinations[3];
const chinaCoverDestination = getDestination("yunnan") ?? chinaDestinations[0];

export const journeyRegions: JourneyRegion[] = [
  {
    id: "hongkong",
    level: "region",
    nameZh: "香港",
    nameEn: "Hong Kong",
    type: "地区",
    status: hongkongDestination.status,
    descriptionZh: hongkongDestination.descriptionZh,
    stats: hongkongDestination.stats,
    cover: hongkongDestination.cover,
    node: {
      x: 62,
      y: 62,
    },
    accent: hongkongDestination.accent,
    albumId: "hongkong-album",
  },
  {
    id: "china",
    level: "country",
    nameZh: "中国",
    nameEn: "China",
    type: "国家",
    status: "已探索",
    descriptionZh: "用脚步丈量山河，用镜头收藏光影，把每一段经历折叠成记忆。",
    stats: chinaStats,
    cover: chinaCoverDestination.cover,
    node: {
      x: 40,
      y: 56,
    },
    accent: "#0077ed",
    childrenType: "province-map",
  },
  {
    id: "japan",
    level: "country",
    nameZh: "日本",
    nameEn: "Japan",
    type: "国家",
    status: japanDestination.status,
    descriptionZh: japanDestination.descriptionZh,
    stats: japanDestination.stats,
    cover: japanDestination.cover,
    node: {
      x: 74,
      y: 42,
    },
    accent: japanDestination.accent,
    albumId: "japan-album",
  },
  {
    id: "jeju",
    level: "region",
    nameZh: "韩国 · 济州岛",
    nameEn: "Jeju Island",
    type: "地区",
    status: jejuDestination.status,
    descriptionZh: jejuDestination.descriptionZh,
    stats: jejuDestination.stats,
    cover: jejuDestination.cover,
    node: {
      x: 52,
      y: 34,
    },
    accent: jejuDestination.accent,
    albumId: "jeju-album",
  },
];

export const defaultJourneyRegionId = "hongkong";
export const defaultAlbumId = "hongkong-album";

export const summerCamps = {
  updatedAt: "2026-07-07",
  title: "2026 夏令营参营情况",
  subtitle:
    "Current summer-camp admissions and attendance plan, kept concise for supervisors and reviewers.",
  statement:
    "南方科技大学交流已结束；我接下来重点准备西湖大学理学院和上海科技大学物质科学与技术学院相关交流。其他机会会根据入营结果、时间冲突和研究匹配度及时调整。",
  rows: [
    {
      school: "南方科技大学物理系",
      program: "2026年优秀大学生夏季交流会",
      time: "2026年7月3日-7月6日",
      status: "已结束",
      statusKey: "done",
      note: "已完成线下交流，后续根据导师沟通和匹配度继续评估。",
    },
    {
      school: "北京理工大学物理学院",
      program: "2026年全国优秀大学生夏令营",
      time: "2026年7月3日-7月5日",
      status: "已结束，未参加",
      statusKey: "inactive",
      note: "入营机会已记录；活动已结束，后续不作为准备事项推进。",
    },
    {
      school: "北京师范大学系统科学学院",
      program: "2026年优秀大学生夏令营",
      time: "2026年7月7日-7月9日",
      status: "不再推进",
      statusKey: "inactive",
      note: "因时间与整体参营安排冲突，已不作为当前准备事项推进。",
    },
    {
      school: "西湖大学理学院物理系",
      program: "2026年理学院夏令营",
      time: "2026年7月9日-7月11日",
      status: "重点准备",
      statusKey: "upcoming",
      note: "已获入营资格，当前作为下一阶段重点准备对象。",
    },
    {
      school: "中山大学物理学院",
      program: "2026年全国优秀大学生夏令营",
      time: "2026年7月9日-7月10日",
      status: "不再推进",
      statusKey: "inactive",
      note: "已确认入营；因与西湖大学安排重叠，后续不作为当前准备事项推进。",
    },
    {
      school: "西安交通大学物理学院",
      program: "2026年夏令营",
      time: "2026年7月11日-7月12日",
      status: "不再推进",
      statusKey: "inactive",
      note: "已确认入营；因当前优先准备西湖大学和上海科技大学，后续不作为重点推进。",
    },
    {
      school: "厦门大学物理科学与技术学院",
      program: "2026年夏令营",
      time: "2026年7月13日-7月15日",
      status: "待确认",
      statusKey: "pending",
      note: "官网说明入选营员预计2026年7月5日前邮件通知，未入选者不另行通知；当前按疑似未入营处理，待邮箱和报名系统复核。",
    },
    {
      school: "上海科技大学物质科学与技术学院",
      program: "2026年暑期学校（第二批）",
      time: "2026年7月13日-7月17日",
      status: "重点准备",
      statusKey: "upcoming",
      note: "第二批短期班时间为2026年7月13日至7月17日；当前列为下一阶段重点准备对象。",
    },
    {
      school: "香港中文大学（深圳）理工学院 / AISE",
      program: "2026卓越本科生夏令营",
      time: "2026年7月13日-7月27日",
      status: "其他已获 offer",
      statusKey: "other",
      note: "Course Track offer，作为其他已获机会记录。",
    },
  ],
};

export const projects = [
  {
    title: "memory_engine",
    subtitle: "OpenClaw 类脑记忆引擎",
    tech: ["Python", "FAISS", "JSON storage", "pytest"],
    url: "https://github.com/hengqi61-maker/memory_engine",
    problemZh: "长期记忆、语义检索与类脑记忆机制。",
    problemEn: "Long-term memory, semantic retrieval, and brain-inspired memory mechanisms.",
    methodZh:
      "模块化设计短期工作记忆、情绪评估、长期存储、语义联想检索与记忆巩固流程。",
    methodEn:
      "A modular pipeline for working memory, emotional appraisal, long-term storage, semantic recall, and consolidation.",
    evidenceZh:
      "包含架构文档、模块接口说明、示例存储、测试脚本和文献目录。",
    evidenceEn:
      "Includes architecture docs, module interfaces, example storage, tests, and literature notes.",
  },
  {
    title: "solid-physics-visualizer",
    subtitle: "固体物理交互式可视化",
    tech: ["TypeScript", "Vite", "Visualization"],
    url: "https://github.com/hengqi61-maker/solid-physics-visualizer",
    problemZh: "晶体结构、Miller 面/方向、倒格子和布里渊区等抽象概念。",
    problemEn:
      "Crystal structures, Miller planes and directions, reciprocal lattices, and Brillouin zones.",
    methodZh:
      "支持 SC/BCC/FCC/HCP/Diamond/NaCl、正/倒空间对照、Ewald 球、消光规则和 CIF 导入。",
    methodEn:
      "Supports crystal views, real/reciprocal-space split views, Ewald sphere, extinction rules, and basic CIF import.",
    evidenceZh: "体现物理概念建模、交互设计和可视化表达能力。",
    evidenceEn:
      "Evidence of physics modeling, interaction design, and visual explanation.",
  },
  {
    title: "thermal-physics-abg-solver",
    subtitle: "热物理离散方程求解",
    tech: ["Python", "Numerical methods", "Matplotlib"],
    url: "https://github.com/hengqi61-maker/thermal-physics-abg-solver",
    problemZh: "热物理边值问题的离散化与线性系统求解。",
    problemEn: "Discretization and linear solving for a thermal physics boundary-value problem.",
    methodZh:
      "基于 alpha/beta/gamma 系数组装三对角矩阵，并用高斯消元和 LU 分解求解。",
    methodEn:
      "Builds a tri-diagonal system from alpha/beta/gamma coefficients and solves it with Gaussian elimination and LU decomposition.",
    evidenceZh: "完整覆盖参数设置、边界条件修正、线性求解和温度场可视化。",
    evidenceEn:
      "Covers parameter setup, boundary correction, linear solving, and temperature-profile visualization.",
  },
  {
    title: "session-memory-processor",
    subtitle: "OpenClaw 会话到记忆处理管道",
    tech: ["Python", "JSONL", "SQLite", "Vector storage"],
    url: "https://github.com/hengqi61-maker/session-memory-processor",
    problemZh: "AI 助手会话文件的信息抽取、增量处理和结构化组织。",
    problemEn:
      "Information extraction, incremental processing, and structured organization for AI assistant session files.",
    methodZh:
      "实现会话扫描、JSONL 流式解析、对话重构、重要性评分、语义抽取和存储适配。",
    methodEn:
      "Implements session scanning, JSONL streaming parse, dialogue reconstruction, importance scoring, semantic extraction, and storage adapters.",
    evidenceZh: "采用采集、解析、分析、存储、服务与监控的分层工程结构。",
    evidenceEn:
      "Layered engineering structure across collection, parsing, analysis, storage, services, and monitoring.",
  },
];

export const education = {
  school: profile.schoolZh,
  program: profile.majorZh,
  period: "2023.09 - 2027.06（预计）",
  averageScore: "89.1",
  courses: [
    "经典力学 100",
    "光学 99",
    "数学物理方法 98",
    "一元微积分 A 96/94",
    "线性代数 A 95",
    "偏微分方程及其应用 92",
    "量子力学 91",
    "电磁学 90",
  ],
};

export const honors = [
  "东华大学一等奖学金",
  "国家励志奖学金",
  "全国大学生数学竞赛三等奖",
  "全国大学生光电设计大赛三等奖",
  "上海市跆拳道锦标赛男子个人竞技二等奖",
  "东华大学“学习型寝室”荣誉",
];
