// Mock institutions and signals for demo UI

const INSTITUTIONS = [
  {
    id: 'hdfc_bank',
    name: 'HDFC Bank',
    type: 'Large private bank',
    region: 'Pan-India',
    riskScore: 36,
    riskLevel: 'low',
    riskChange: +4,
    shortTermScore: 42,
    structuralScore: 18,
    stock: {
      ticker: 'HDFCBANK',
      price: 1523.6,
      changePct: -0.8,
    },
    marketCapCr: 1100000,
    signalAccelerationPct: 18,
    pcaStatus: 'watch',
    pcaSummary:
      'Heightened supervisory attention due to recurring digital outages and emerging SME asset-quality signals. RBI has flagged multiple incidents of net banking and UPI unavailability in the last quarter; SME book shows modest NPA reclassification in North India. Follow-up meetings scheduled with the bank on outage root-cause and communication protocols.',
    dominantThemes: [
      { id: 'it_outages', label: 'IT/Payment Outages', changePct: 9 },
      { id: 'liquidity', label: 'Liquidity Concerns', changePct: 2 },
    ],
    financials: {
      periodLabel: 'FY 2024',
      totalRevenueCr: 25774,
      totalRevenueChangePct: 13.3,
      operatingMarginPct: 24.4,
      operatingMarginChangePct: 1.8,
      freeCashFlowCr: 2928,
      freeCashFlowChangePct: 39.2,
      contingentLiabilities2024Cr: 633.96,
      contingentLiabilities2023Cr: 566.55,
      contingentLiabilitiesChangePct: 11.9,
      auditOpinion: 'Unqualified Opinion',
      auditOpinionSummary:
        'No qualifications, reservations, adverse remarks, or disclaimers in both standalone and consolidated financial statements.',
      keyAuditMatters: [
        'Allegations of overcharging under specific regulatory price control orders.',
        'Recoverability assessment of investments in subsidiaries.',
        'Revenue recognition from fee and commission income.',
      ],
    },
  },
  {
    id: 'icici_bank',
    name: 'ICICI Bank',
    type: 'Large private bank',
    region: 'Pan-India',
    riskScore: 44,
    riskLevel: 'medium',
    riskChange: +7,
    shortTermScore: 51,
    structuralScore: 24,
    stock: {
      ticker: 'ICICIBANK',
      price: 999.4,
      changePct: 1.3,
    },
    marketCapCr: 750000,
    signalAccelerationPct: 12,
    pcaStatus: 'normal',
    pcaSummary:
      'Signals broadly stable; focus on conduct/mis-selling themes and AML processes in select portfolios.',
    dominantThemes: [
      { id: 'conduct', label: 'Mis-selling & Conduct', changePct: 5 },
      { id: 'liquidity', label: 'Liquidity Concerns', changePct: 1 },
    ],
    financials: {
      periodLabel: 'FY 2024',
      totalRevenueCr: 21540,
      totalRevenueChangePct: 11.1,
      operatingMarginPct: 22.7,
      operatingMarginChangePct: 1.2,
      freeCashFlowCr: 2410,
      freeCashFlowChangePct: 31.5,
      contingentLiabilities2024Cr: 712.4,
      contingentLiabilities2023Cr: 658.1,
      contingentLiabilitiesChangePct: 8.3,
      auditOpinion: 'Unqualified Opinion',
      auditOpinionSummary:
        'Auditors report true and fair view with no modified opinion on both standalone and consolidated financials.',
      keyAuditMatters: [
        'Measurement of expected credit losses on retail and SME portfolios.',
        'Valuation of complex financial instruments held for trading.',
        'IT access controls and change management around core banking systems.',
      ],
    },
  },
  {
    id: 'sbi',
    name: 'State Bank of India',
    type: 'Public sector bank',
    region: 'Pan-India',
    riskScore: 41,
    riskLevel: 'medium',
    riskChange: -3,
    shortTermScore: 37,
    structuralScore: 29,
    stock: {
      ticker: 'SBIN',
      price: 725.2,
      changePct: 0.6,
    },
    marketCapCr: 600000,
    signalAccelerationPct: 9,
    pcaStatus: 'normal',
    pcaSummary:
      'Macro exposure remains key; recent signals dominated by MSME restructuring and system loads during events.',
    dominantThemes: [
      { id: 'msme', label: 'MSME & Restructuring', changePct: 4 },
      { id: 'liquidity', label: 'Liquidity Concerns', changePct: 3 },
    ],
    financials: {
      periodLabel: 'FY 2024',
      totalRevenueCr: 35210,
      totalRevenueChangePct: 9.4,
      operatingMarginPct: 21.1,
      operatingMarginChangePct: 0.9,
      freeCashFlowCr: 3180,
      freeCashFlowChangePct: 27.8,
      contingentLiabilities2024Cr: 1120.3,
      contingentLiabilities2023Cr: 1042.7,
      contingentLiabilitiesChangePct: 7.4,
      auditOpinion: 'Unqualified Opinion',
      auditOpinionSummary:
        'No adverse remarks; emphasis of matter around macroeconomic uncertainties but no modification.',
      keyAuditMatters: [
        'Valuation of large corporate stressed assets and provisioning adequacy.',
        'Accuracy of interest income on restructured loans.',
        'Pension and gratuity liability assumptions for staff.',
      ],
    },
  },
  {
    id: 'auj_small_finance',
    name: 'AU Small Finance Bank',
    type: 'Small finance bank',
    region: 'Rajasthan + metros',
    riskScore: 58,
    riskLevel: 'medium',
    riskChange: +11,
    shortTermScore: 72,
    structuralScore: 35,
    stock: {
      ticker: 'AUBANK',
      price: 638.1,
      changePct: -2.1,
    },
    marketCapCr: 45000,
    signalAccelerationPct: 21,
    pcaStatus: 'elevated',
    pcaSummary:
      'Early warning on used CV stress and rural delivery infrastructure; closer monitoring of liquidity buffers advised.',
    dominantThemes: [
      { id: 'it_outages', label: 'IT/Payment Outages', changePct: 6 },
      { id: 'liquidity', label: 'Liquidity Concerns', changePct: 4 },
    ],
    financials: {
      periodLabel: 'FY 2024',
      totalRevenueCr: 8120,
      totalRevenueChangePct: 18.6,
      operatingMarginPct: 19.8,
      operatingMarginChangePct: 2.1,
      freeCashFlowCr: 640,
      freeCashFlowChangePct: 22.4,
      contingentLiabilities2024Cr: 210.5,
      contingentLiabilities2023Cr: 189.3,
      contingentLiabilitiesChangePct: 11.2,
      auditOpinion: 'Unqualified Opinion with Emphasis of Matter',
      auditOpinionSummary:
        'Clean opinion; emphasis on concentration risk in certain product and geographic segments.',
      keyAuditMatters: [
        'Assessment of provisioning on used CV and micro-entrepreneur portfolios.',
        'Valuation of collateral in semi-urban and rural markets.',
        'IT general controls over branch CBS migration.',
      ],
    },
  },
  {
    id: 'ujjivan_sfb',
    name: 'Ujjivan Small Finance Bank',
    type: 'Small finance bank',
    region: 'Urban + semi-urban',
    riskScore: 63,
    riskLevel: 'high',
    riskChange: +15,
    shortTermScore: 69,
    structuralScore: 48,
    stock: {
      ticker: 'UJJIVANSFB',
      price: 53.4,
      changePct: 3.7,
    },
    marketCapCr: 10000,
    signalAccelerationPct: 24,
    pcaStatus: 'watch',
    pcaSummary:
      'Microfinance portfolio under closer watch given political noise around recoveries and cluster‑level shocks.',
    dominantThemes: [
      { id: 'collections', label: 'Collections & Field Risk', changePct: 7 },
      { id: 'liquidity', label: 'Liquidity Concerns', changePct: 4 },
    ],
    financials: {
      periodLabel: 'FY 2024',
      totalRevenueCr: 4260,
      totalRevenueChangePct: 16.2,
      operatingMarginPct: 17.4,
      operatingMarginChangePct: 1.5,
      freeCashFlowCr: 320,
      freeCashFlowChangePct: 29.1,
      contingentLiabilities2024Cr: 146.2,
      contingentLiabilities2023Cr: 133.7,
      contingentLiabilitiesChangePct: 9.3,
      auditOpinion: 'Unqualified Opinion',
      auditOpinionSummary:
        'No qualifications; key areas of focus relate to microfinance credit quality and provisioning.',
      keyAuditMatters: [
        'Provisioning methodology for group-based microfinance loans.',
        'Assessment of political and natural disaster events on recoverability.',
        'Revenue recognition on securitisation and assignment transactions.',
      ],
    },
  },
  {
    id: 'urban_coop_pune',
    name: 'Shivaji Urban Co-operative Bank, Pune',
    type: 'Urban co-operative bank',
    region: 'Pune district',
    riskScore: 71,
    riskLevel: 'high',
    riskChange: +22,
    shortTermScore: 78,
    structuralScore: 52,
    marketCapCr: 2000,
    signalAccelerationPct: 35,
    pcaStatus: 'elevated',
    pcaSummary:
      'Rumour‑driven depositor anxiety warrants immediate supervisory communication and liquidity monitoring. Social media rumours about solvency led to branch-level withdrawal spikes in Pune district; the bank has issued clarifications and is in dialogue with RBI. Liquidity buffer is above minimum but trend in wholesale deposits needs monitoring.',
    dominantThemes: [
      { id: 'rumours', label: 'Viral Rumours & Runs', changePct: 11 },
      { id: 'liquidity', label: 'Liquidity Concerns', changePct: 6 },
    ],
  },
];

// Unique institution types for dashboard bank-type filter
const INSTITUTION_TYPES = [
  'Large private bank',
  'Public sector bank',
  'Small finance bank',
  'Urban co-operative bank',
];

const SIGNAL_TYPES = ['news', 'social', 'legal', 'filing', 'internal'];
const IMPORTANCE_LEVELS = ['critical', 'medium', 'low'];

// Exhaustive list of signal categories (themes); used for filtering and tagging
const SIGNAL_CATEGORIES = [
  { id: 'it_outages', label: 'IT/Payment Outages' },
  { id: 'liquidity', label: 'Liquidity Concerns' },
  { id: 'conduct', label: 'Mis-selling & Conduct' },
  { id: 'msme', label: 'MSME & Restructuring' },
  { id: 'collections', label: 'Collections & Field Risk' },
  { id: 'rumours', label: 'Viral Rumours & Runs' },
  { id: 'aml', label: 'AML & Compliance' },
  { id: 'fraud', label: 'Fraud & Forgery' },
  { id: 'cyber', label: 'Cyber & Data Breach' },
  { id: 'governance', label: 'Governance & Board' },
  { id: 'real_estate', label: 'Real Estate Exposure' },
  { id: 'retail_stress', label: 'Retail & Unsecured Stress' },
];

// Mock signals: each item is already scored, tagged and ranked
const SIGNALS = [
  {
    id: 'sig1',
    institutionId: 'hdfc_bank',
    title:
      'HDFC Bank sees minor outage in net banking for Western India customers on salary day',
    body:
      'Multiple users from Mumbai and Pune report intermittent failures while initiating NEFT and RTGS payments. Bank acknowledges a “transient infrastructure issue” and claims resolution within 45 minutes.',
    sourceType: 'news',
    sourceName: 'Economic Times',
    importance: 'high',
    sentiment: 'negative',
    timestampOffsetHours: 2.3,
    shortTerm: true,
    structural: false,
    score: 81,
    tags: ['payments', 'retail', 'tech-ops'],
    categoryIds: ['it_outages'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'news_crawler',
      location: 's3://ews-raw/news/econ-times/hdfc/netbanking-outage.json',
      ingestionLagMinutes: 12,
    },
    supervisorySummary:
      'Early visibility into geographically concentrated digital outages allows supervisors to validate root cause, monitor customer impact and assess adherence to outage communication protocols.',
    rawSources: [
      {
        type: 'article',
        label: 'Economic Times – HDFC customers face net banking issues on salary day',
        url: 'https://economictimes.indiatimes.com/industry/banking/finance/hdfc-bank-net-banking-outage-salary-day',
      },
      {
        type: 'tweet',
        label: '@mumbaibanker: “HDFC app down again? NEFT stuck since morning.”',
        url: 'https://twitter.com/search?q=%23HDFCBankDown',
      },
    ],
  },
  {
    id: 'sig2',
    institutionId: 'hdfc_bank',
    title:
      'Surge in X (Twitter) complaints around HDFC credit card declines at POS terminals',
    body:
      'Spike in social chatter around card declines at large format retail stores in Bengaluru and Hyderabad. Pattern suggests one acquiring partner rather than network-wide issue.',
    sourceType: 'social',
    sourceName: 'Twitter',
    importance: 'medium',
    sentiment: 'negative',
    timestampOffsetHours: 0.8,
    shortTerm: true,
    structural: false,
    score: 73,
    tags: ['cards', 'merchant', 'ops'],
    categoryIds: ['it_outages'],
    cacheStatus: 'streaming',
    sourceSystem: {
      type: 'social_stream',
      location: 'kafka:ews.social.hdfc.upi_pos',
      ingestionLagMinutes: 1,
    },
    supervisorySummary:
      'Social media complaints around POS declines can indicate localized acquiring or issuer issues before internal dashboards show abnormal failure ratios.',
    rawSources: [
      {
        type: 'tweet',
        label: '@blr_shopper: “ICICI / HDFC cards repeatedly declining at BigBazaar today.”',
        url: 'https://twitter.com/search?q=card%20decline%20POS%20HDFC',
      },
      {
        type: 'forum',
        label: 'Consumer thread: “Why are my card transactions failing at one store only?”',
        url: 'https://www.creditcardforum.in/threads/card-declines-specific-merchant',
      },
    ],
  },
  {
    id: 'sig3',
    institutionId: 'hdfc_bank',
    title:
      'RBI inspection notes mild divergence in NPA classification for select SME book',
    body:
      'Media summary of RBI observations indicates reclassification of ₹230–250 crore of SME assets to NPA, largely in North India hospitality and commercial real estate.',
    sourceType: 'news',
    sourceName: 'Business Standard',
    importance: 'medium',
    sentiment: 'negative',
    timestampOffsetHours: 48,
    shortTerm: false,
    structural: true,
    score: 69,
    tags: ['asset-quality', 'SME', 'regulatory'],
    categoryIds: ['msme'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'regulatory_summary',
      location: 'db:ews_warehouse.rbi_inspection_summaries',
      ingestionLagMinutes: 180,
    },
    supervisorySummary:
      'Media summaries of RBI inspection findings help cross-check divergences in reported NPAs, especially for vulnerable sectors like hospitality and CRE.',
    rawSources: [
      {
        type: 'article',
        label: 'Business Standard – RBI flags minor divergence in HDFC SME NPAs',
        url: 'https://www.business-standard.com/article/finance/rbi-divergence-hdfc-sme-book',
      },
      {
        type: 'filing',
        label: 'HDFC Bank – Annual report note on SME asset quality',
        url: 'https://www.hdfcbank.com/investor-relations/financials',
      },
    ],
  },
  {
    id: 'sig4',
    institutionId: 'icici_bank',
    title:
      'ICICI Bank announces strong Q3 results with stable asset quality and improving margins',
    body:
      'Net profit up 21% YoY, GNPA ratio down 22 bps QoQ. Management commentary highlights healthy retail growth and controlled slippages in unsecured portfolios.',
    sourceType: 'filing',
    sourceName: 'Exchange filing',
    importance: 'medium',
    sentiment: 'positive',
    timestampOffsetHours: 18,
    shortTerm: false,
    structural: true,
    score: 64,
    tags: ['earnings', 'asset-quality', 'retail'],
    categoryIds: ['msme', 'retail_stress'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'exchange_filing',
      location: 's3://ews-raw/filings/icici/q3fy24-results.pdf',
      ingestionLagMinutes: 20,
    },
    supervisorySummary:
      'Stronger-than-expected earnings with improving asset quality can offset negative signals from other sources and help calibrate overall risk scoring.',
    rawSources: [
      {
        type: 'filing',
        label: 'ICICI Bank – Q3 FY26 results presentation',
        url: 'https://www.icicibank.com/about-us/investor-relations/q3fy26-results',
      },
      {
        type: 'filing',
        label: 'ICICI Bank – Management discussion and analysis',
        url: 'https://www.icicibank.com/about-us/investor-relations/annual-reports',
      },
    ],
  },
  {
    id: 'sig5',
    institutionId: 'icici_bank',
    title:
      'Regional Marathi daily flags protests by small borrowers against recovery agents',
    body:
      'Report from Kolhapur mentions aggressive recovery practices in gold loan and small ticket business loans. Volume of coverage still limited but tone is strongly negative.',
    sourceType: 'news',
    sourceName: 'Regional newspaper (Marathi)',
    importance: 'high',
    sentiment: 'negative',
    timestampOffsetHours: 6,
    shortTerm: true,
    structural: false,
    score: 78,
    tags: ['collections', 'gold-loans', 'reputational'],
    categoryIds: ['collections'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'regional_news_crawler',
      location: 's3://ews-raw/regional/kolhapur/marathi/collections-story.json',
      ingestionLagMinutes: 45,
    },
    supervisorySummary:
      'Local reports of aggressive recovery methods in specific products highlight conduct risk and may warrant targeted supervisory reviews or thematic inspections.',
    rawSources: [
      {
        type: 'article',
        label: 'Kolhapur Marathi daily – Protests against loan recovery agents',
        url: 'https://lokmat.com/kolhapur/protests-against-bank-recovery-agents',
      },
    ],
  },
  {
    id: 'sig6',
    institutionId: 'sbi',
    title:
      'SBI faces PIL in Delhi High Court on alleged delay in loan restructuring for MSME cluster',
    body:
      'Public Interest Litigation alleges lack of transparency and delay in processing restructuring applications for MSME borrowers in textile cluster.',
    sourceType: 'legal',
    sourceName: 'Delhi HC cause list',
    importance: 'critical',
    sentiment: 'negative',
    timestampOffsetHours: 12,
    shortTerm: false,
    structural: true,
    score: 89,
    tags: ['MSME', 'legal', 'reputational'],
    categoryIds: ['msme'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'court_scraper',
      location: 'db:ews_warehouse.delhi_hc_cause_list',
      ingestionLagMinutes: 60,
    },
    supervisorySummary:
      'An MSME-focused PIL about restructuring delays can signal process or policy gaps and potential reputational risk beyond pure credit quality.',
    rawSources: [
      {
        type: 'legal',
        label: 'Delhi HC cause list – MSME restructuring PIL vs SBI',
        url: 'https://delhihighcourt.nic.in/cause-list',
      },
      {
        type: 'article',
        label: 'Legal news portal summary of MSME restructuring PIL',
        url: 'https://barandbench.com/news/litigation/pil-msme-restructuring-sbi',
      },
    ],
  },
  {
    id: 'sig7',
    institutionId: 'sbi',
    title:
      'Net banking and UPI traffic elevated but stable during major IPO listing window',
    body:
      'Monitoring shows 1.8x baseline volumes on UPI mandate creation and ASBA flows. No material spike in failure rates observed.',
    sourceType: 'internal',
    sourceName: 'Synthetic metric (mock)',
    importance: 'low',
    sentiment: 'neutral',
    timestampOffsetHours: 1.4,
    shortTerm: true,
    structural: false,
    score: 41,
    tags: ['UPI', 'ASBA', 'ops'],
    categoryIds: ['it_outages'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'internal_metric',
      location: 'db:bank_internal_metrics.sbi_realtime_traffic',
      ingestionLagMinutes: 2,
    },
    supervisorySummary:
      'Internal telemetry showing elevated but stable traffic during events like major IPOs reassures supervisors that systems are scaling without hidden stress.',
    rawSources: [
      {
        type: 'internal',
        label: 'Synthetic metric – UPI and ASBA throughput vs baseline',
        url: '',
      },
    ],
  },
  {
    id: 'sig8',
    institutionId: 'auj_small_finance',
    title:
      'Cluster of local news reports on rising delinquencies in used CV portfolio',
    body:
      'Hindi and Rajasthani regional outlets report stress among small fleet operators due to freight rate compression. Mentions AU SFB along with two NBFC peers.',
    sourceType: 'news',
    sourceName: 'Regional newspapers',
    importance: 'high',
    sentiment: 'negative',
    timestampOffsetHours: 5,
    shortTerm: true,
    structural: true,
    score: 84,
    tags: ['CV', 'delinquency', 'regional'],
    categoryIds: ['retail_stress'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'regional_news_crawler',
      location: 's3://ews-raw/regional/rajasthan/cv-delinquency/*.json',
      ingestionLagMinutes: 90,
    },
    supervisorySummary:
      'Clusters of regional reports on stress in used CV portfolios can pre-empt rising NPAs in concentrated geographic segments.',
    rawSources: [
      {
        type: 'article',
        label: 'Rajasthan Hindi daily – CV operators struggle with freight rates',
        url: 'https://rajasthanpatrika.com/business/used-cv-delinquencies',
      },
    ],
  },
  {
    id: 'sig9',
    institutionId: 'auj_small_finance',
    title:
      'Twitter chatter around micro-ATM outages in rural Rajasthan villages served by AU SFB BC partners',
    body:
      'NGO workers and local journalists highlight intermittent downtime on micro-ATM cash-out points, leading to queues and cash shortages for government scheme beneficiaries.',
    sourceType: 'social',
    sourceName: 'Twitter',
    importance: 'medium',
    sentiment: 'negative',
    timestampOffsetHours: 0.6,
    shortTerm: true,
    structural: false,
    score: 76,
    tags: ['micro-ATM', 'financial-inclusion', 'ops'],
    categoryIds: ['it_outages'],
    cacheStatus: 'streaming',
    sourceSystem: {
      type: 'social_stream',
      location: 'kafka:ews.social.micro_atm.rajasthan',
      ingestionLagMinutes: 2,
    },
    supervisorySummary:
      'Micro-ATM outages around government benefit disbursals directly impact financial inclusion outcomes and can trigger regulatory scrutiny on last-mile infrastructure.',
    rawSources: [
      {
        type: 'tweet',
        label: '@ngo_worker: “Micro-ATM down again in our block, pension beneficiaries in queue for hours.”',
        url: 'https://twitter.com/search?q=micro%20ATM%20Rajasthan%20outage',
      },
      {
        type: 'video',
        label: 'Local reporter video – queues at AU SFB micro-ATM',
        url: 'https://youtube.com/watch?v=micro-atm-outage-au-sfb',
      },
    ],
  },
  {
    id: 'sig10',
    institutionId: 'ujjivan_sfb',
    title:
      'Ujjivan SFB management commentary signals tightening in microfinance underwriting norms',
    body:
      'Post-results call transcript suggests stricter scorecard thresholds in flood-affected districts and gradual reduction of high-risk centres.',
    sourceType: 'filing',
    sourceName: 'Earnings call transcript',
    importance: 'medium',
    sentiment: 'neutral',
    timestampOffsetHours: 30,
    shortTerm: false,
    structural: true,
    score: 62,
    tags: ['microfinance', 'underwriting', 'risk-policy'],
    categoryIds: ['retail_stress', 'msme'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'earnings_call_transcript',
      location: 's3://ews-raw/transcripts/ujjivan/q3fy24-call.txt',
      ingestionLagMinutes: 240,
    },
    supervisorySummary:
      'Tightening underwriting norms in stressed districts shows management response and can partially mitigate concerns from adverse field-level signals.',
    rawSources: [
      {
        type: 'filing',
        label: 'Ujjivan SFB – Q3 earnings call transcript',
        url: 'https://www.ujjivansfb.in/investor-relations/earnings-call',
      },
    ],
  },
  {
    id: 'sig11',
    institutionId: 'ujjivan_sfb',
    title:
      'Local language social media posts flag political pressure around microfinance recoveries',
    body:
      'Short-form videos and posts from Eastern India allege coercive recoveries by field agents. Volume still limited but correlation with upcoming state elections.',
    sourceType: 'social',
    sourceName: 'YouTube / regional social',
    importance: 'critical',
    sentiment: 'negative',
    timestampOffsetHours: 3.5,
    shortTerm: true,
    structural: true,
    score: 92,
    tags: ['collections', 'political-risk', 'microfinance'],
    categoryIds: ['collections'],
    cacheStatus: 'streaming',
    sourceSystem: {
      type: 'video_monitoring',
      location: 's3://ews-raw/social_video/microfinance/eastern_india/',
      ingestionLagMinutes: 20,
    },
    supervisorySummary:
      'Political pressure around microfinance recoveries ahead of elections can rapidly change collection behaviour and needs proactive supervisory watch.',
    rawSources: [
      {
        type: 'video',
        label: 'Regional YouTube – local leaders warn against paying microfinance dues',
        url: 'https://youtube.com/watch?v=regional-microfinance-recoveries',
      },
      {
        type: 'social',
        label: 'Facebook posts in local language alleging coercive collections',
        url: 'https://facebook.com/groups/microfinance-collections-complaints',
      },
    ],
  },
  // 1. Digital banking outages & service disruptions
  {
    id: 'sig12',
    institutionId: 'hdfc_bank',
    title:
      '#HDFCBankDown trends as users report repeated UPI and mobile banking failures on salary credit day',
    body:
      'Within 20 minutes, more than 1,200 tweets from Mumbai, Delhi and Bengaluru complain about failed UPI payments and mobile app login errors. Screenshots show “Something went wrong” messages across Android and iOS.',
    sourceType: 'social',
    sourceName: 'Twitter hashtag stream (#HDFCBankDown, #UPIissues)',
    importance: 'high',
    sentiment: 'negative',
    timestampOffsetHours: 0.3,
    shortTerm: true,
    structural: false,
    score: 86,
    tags: ['digital-outage', 'UPI', 'mobile-banking'],
    categoryIds: ['it_outages'],
    cacheStatus: 'streaming',
    sourceSystem: {
      type: 'social_stream',
      location: 'kafka:ews.social.hashtags.hdfc_outages',
      ingestionLagMinutes: 1,
    },
    supervisorySummary:
      'Large spikes in geo-tagged outage complaints on salary day can trigger rapid supervisory engagement before formal incident reports arrive.',
    rawSources: [
      {
        type: 'tweet',
        label: '#HDFCBankDown search timeline',
        url: 'https://twitter.com/search?q=%23HDFCBankDown',
      },
      {
        type: 'tweet',
        label: '@delhi_user: “Salary credited but UPI & HDFC app dead since morning.”',
        url: 'https://twitter.com/delhi_user/status/1234567890',
      },
    ],
  },
  {
    id: 'sig13',
    institutionId: 'sbi',
    title:
      'Consumer forums log burst of SBI YONO app outage complaints before bank issues official clarification',
    body:
      'Mouthshut.com, IndiaConsumerForum.org and app store reviews show a sudden spike in 1★ ratings citing “YONO not opening”, “cannot transfer” and “salary stuck” for over 90 minutes.',
    sourceType: 'news',
    sourceName: 'Consumer forum aggregation (Mouthshut, app store reviews)',
    importance: 'medium',
    sentiment: 'negative',
    timestampOffsetHours: 1.1,
    shortTerm: true,
    structural: false,
    score: 74,
    tags: ['digital-outage', 'consumer-forum', 'retail'],
    categoryIds: ['it_outages'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'consumer_forum_scrape',
      location: 's3://ews-raw/forums/yono-outage/*.json',
      ingestionLagMinutes: 30,
    },
    supervisorySummary:
      'Consumer forums and app-store reviews provide corroboration of systemic outages and help assess disclosure quality and SLAs.',
    rawSources: [
      {
        type: 'forum',
        label: 'Mouthshut – “SBI YONO not working, salary stuck”',
        url: 'https://www.mouthshut.com/review/SBI-YONO-app-outage',
      },
      {
        type: 'forum',
        label: 'Play Store reviews – spike in 1★ YONO ratings',
        url: 'https://play.google.com/store/apps/details?id=in.sbi.SBIFreedomPlus',
      },
    ],
  },
  {
    id: 'sig14',
    institutionId: 'icici_bank',
    title:
      'Localized ICICI UPI failures reported at petrol pumps and kirana stores in South India',
    body:
      'Small merchants in Coimbatore, Kochi and Visakhapatnam share videos of customers unable to pay via UPI. Discussion threads suggest the problem is concentrated on one PSP/app integration, not NPCI rails overall.',
    sourceType: 'social',
    sourceName: 'WhatsApp forwards, Twitter local business handles',
    importance: 'medium',
    sentiment: 'negative',
    timestampOffsetHours: 0.7,
    shortTerm: true,
    structural: false,
    score: 79,
    tags: ['digital-outage', 'merchant', 'UPI'],
    categoryIds: ['it_outages'],
    cacheStatus: 'streaming',
    sourceSystem: {
      type: 'social_stream',
      location: 'kafka:ews.social.icici.upi_outage',
      ingestionLagMinutes: 1,
    },
    supervisorySummary:
      'Merchant-level UPI failures highlight ecosystem fragility even when core payment rails appear stable on central dashboards.',
    rawSources: [
      {
        type: 'tweet',
        label: '@coimbatore_fuel: “UPI down again, queues at petrol pump due to ICICI app issues.”',
        url: 'https://twitter.com/search?q=ICICI%20UPI%20petrol%20pump',
      },
      {
        type: 'social',
        label: 'WhatsApp forward screenshot of “server down” errors at local kirana',
        url: '',
      },
    ],
  },
  // 2. Fraud & phishing scams
  {
    id: 'sig15',
    institutionId: 'hdfc_bank',
    title:
      'Screenshots of HDFC phishing SMS and fake login pages circulate widely on social media',
    body:
      'Customers post screenshots of SMS links mimicking official HDFC domains, redirecting to look-alike netbanking pages. Cyber-security blogs flag active phishing kits targeting Indian IP ranges.',
    sourceType: 'social',
    sourceName: 'Twitter, Telegram public groups',
    importance: 'high',
    sentiment: 'negative',
    timestampOffsetHours: 4,
    shortTerm: true,
    structural: false,
    score: 88,
    tags: ['phishing', 'retail', 'fraud-risk'],
    categoryIds: ['fraud', 'cyber'],
    cacheStatus: 'streaming',
    sourceSystem: {
      type: 'phishing_feed',
      location: 's3://ews-raw/phishing/hdfc/sms_links/*.json',
      ingestionLagMinutes: 5,
    },
    supervisorySummary:
      'User-shared screenshots of phishing messages and fake sites provide early evidence of fraud waves and targeting patterns.',
    rawSources: [
      {
        type: 'tweet',
        label: '@hdfc_cust: “Got this fake HDFC SMS, please be careful!”',
        url: 'https://twitter.com/search?q=HDFC%20phishing%20SMS',
      },
      {
        type: 'article',
        label: 'Cyber-security blog – phishing kits targeting Indian banks',
        url: 'https://securityblog.in/hdfc-phishing-kits',
      },
    ],
  },
  {
    id: 'sig16',
    institutionId: 'icici_bank',
    title:
      'News portals pick up user reports of spoofed ICICI net banking sites harvesting credentials',
    body:
      'Tech news outlets compile user complaints and CERT-In advisories warning about domain names closely resembling official ICICI properties, with stolen credentials reportedly sold on dark web forums.',
    sourceType: 'news',
    sourceName: 'LiveMint, Moneycontrol tech desk',
    importance: 'high',
    sentiment: 'negative',
    timestampOffsetHours: 7,
    shortTerm: true,
    structural: true,
    score: 83,
    tags: ['phishing', 'cyber', 'compliance'],
    categoryIds: ['cyber', 'fraud'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'news_crawler',
      location: 's3://ews-raw/news/tech-press/icici-phishing-alerts.json',
      ingestionLagMinutes: 60,
    },
    supervisorySummary:
      'News coverage of spoofed domains and CERT-In alerts supports supervisory follow-up on takedown speeds and customer communication by banks.',
    rawSources: [
      {
        type: 'article',
        label: 'LiveMint – Fake ICICI websites harvest net banking passwords',
        url: 'https://www.livemint.com/market/alert-icici-fake-websites',
      },
      {
        type: 'filing',
        label: 'CERT-In advisory on Indian banking phishing campaigns',
        url: 'https://www.cert-in.org.in/phishing-advisory',
      },
    ],
  },
  // 3. Mis-selling or unfair practices
  {
    id: 'sig17',
    institutionId: 'icici_bank',
    title:
      'Wave of mis-selling complaints on credit cards and bundled insurance surfaces on consumer platforms',
    body:
      'Long-form posts on Mouthshut and Quora allege unsolicited card upgrades and insurance cross-sell without explicit consent. Users share call recordings and screenshots of confusing consent flows.',
    sourceType: 'social',
    sourceName: 'Mouthshut.com, Quora finance threads',
    importance: 'medium',
    sentiment: 'negative',
    timestampOffsetHours: 10,
    shortTerm: true,
    structural: true,
    score: 77,
    tags: ['mis-selling', 'cards', 'insurance'],
    categoryIds: ['conduct'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'consumer_forum_scrape',
      location: 'db:ews_warehouse.mis_selling_complaints',
      ingestionLagMinutes: 120,
    },
    supervisorySummary:
      'Public complaints with call recordings and screenshots give granular evidence of mis-selling practices that can inform thematic reviews and penalties.',
    rawSources: [
      {
        type: 'forum',
        label: 'Mouthshut – “ICICI upgraded my card without consent”',
        url: 'https://www.mouthshut.com/review/ICICI-credit-card-mis-selling',
      },
      {
        type: 'forum',
        label: 'Quora thread – “Can banks add insurance to my loan without permission?”',
        url: 'https://www.quora.com/can-bank-add-insurance-without-permission',
      },
    ],
  },
  {
    id: 'sig18',
    institutionId: 'auj_small_finance',
    title:
      'Regional media story highlights aggressive microfinance cross-sell practices by AU SFB field staff',
    body:
      'A Hindi news channel aggregates borrower interviews alleging pressure to take top-up loans and bundled insurance products, especially in districts with recent flood impact.',
    sourceType: 'news',
    sourceName: 'Regional TV + vernacular portals',
    importance: 'medium',
    sentiment: 'negative',
    timestampOffsetHours: 15,
    shortTerm: true,
    structural: true,
    score: 72,
    tags: ['mis-selling', 'microfinance', 'conduct-risk'],
    categoryIds: ['conduct'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'regional_news_crawler',
      location: 's3://ews-raw/regional/microfinance/cross-sell-au.json',
      ingestionLagMinutes: 90,
    },
    supervisorySummary:
      'Vernacular TV coverage of cross-sell pressure in microfinance regions can spotlight branch-level incentive issues and conduct risk.',
    rawSources: [
      {
        type: 'video',
        label: 'Regional TV segment – borrowers allege pressure for top-up loans',
        url: 'https://youtube.com/watch?v=microfinance-cross-sell-au-sfb',
      },
    ],
  },
  // 4. Key management changes or resignations
  {
    id: 'sig19',
    institutionId: 'hdfc_bank',
    title:
      'Market gossip on finance forums hints at senior treasury head exit ahead of official announcement',
    body:
      'Anonymous handles on Indian stock forums and Telegram channels discuss “likely resignation” of a senior treasury executive citing differences over risk appetite. No stock exchange filing yet.',
    sourceType: 'social',
    sourceName: 'Telegram finance groups, stock forums',
    importance: 'medium',
    sentiment: 'negative',
    timestampOffsetHours: 20,
    shortTerm: false,
    structural: true,
    score: 68,
    tags: ['management', 'governance', 'rumour'],
    categoryIds: ['governance', 'rumours'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'forum_monitoring',
      location: 's3://ews-raw/forums/finance/hdfc-management-rumours.json',
      ingestionLagMinutes: 60,
    },
    supervisorySummary:
      'Unverified management exit rumours help supervisors prepare questions for early engagement while validating facts with the institution.',
    rawSources: [
      {
        type: 'forum',
        label: 'Stock forum – “Senior treasury head likely to resign at HDFC?”',
        url: 'https://forum.valueinvestorclub.com/hdfc-management-rumour',
      },
      {
        type: 'social',
        label: 'Telegram finance group chat logs mentioning leadership churn',
        url: '',
      },
    ],
  },
  {
    id: 'sig20',
    institutionId: 'ujjivan_sfb',
    title:
      'Business news site runs speculative piece on impending CXO reshuffle at Ujjivan SFB',
    body:
      'Article cites unnamed sources suggesting upcoming changes in CRO and retail head roles following board strategy review, triggering discussion on social media about continuity in microfinance leadership.',
    sourceType: 'news',
    sourceName: 'Economic Times, anonymous sources',
    importance: 'medium',
    sentiment: 'neutral',
    timestampOffsetHours: 26,
    shortTerm: false,
    structural: true,
    score: 63,
    tags: ['management', 'board', 'microfinance'],
    categoryIds: ['governance'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'news_crawler',
      location: 's3://ews-raw/news/et/ujjivan-cxo-speculation.json',
      ingestionLagMinutes: 75,
    },
    supervisorySummary:
      'Business media speculation on CXO reshuffles can be cross-checked with the board and used to assess continuity in critical portfolios like microfinance.',
    rawSources: [
      {
        type: 'article',
        label: 'Economic Times – Sources hint at leadership changes at Ujjivan SFB',
        url: 'https://economictimes.indiatimes.com/industry/banking/finance/ujjivan-sfb-cxo-changes',
      },
    ],
  },
  // 5. Regulatory / compliance lapses
  {
    id: 'sig21',
    institutionId: 'sbi',
    title:
      'Social media complaints allege repeated rejection of digital KYC updates despite valid documents',
    body:
      'Users share screenshots of in-app messages citing “KYC incomplete” after multiple upload attempts. Posts tag RBI and banking ombudsman handles, asking whether new video-KYC norms are being followed.',
    sourceType: 'social',
    sourceName: 'Twitter, Facebook banking groups',
    importance: 'medium',
    sentiment: 'negative',
    timestampOffsetHours: 8,
    shortTerm: true,
    structural: true,
    score: 75,
    tags: ['KYC', 'compliance', 'digital-onboarding'],
    categoryIds: ['aml'],
    cacheStatus: 'streaming',
    sourceSystem: {
      type: 'social_stream',
      location: 'kafka:ews.social.sbi.kyc_complaints',
      ingestionLagMinutes: 3,
    },
    supervisorySummary:
      'High volumes of failed KYC updates reported online may signal operational or policy gaps in digital onboarding implementations.',
    rawSources: [
      {
        type: 'tweet',
        label: '@sbi_user: “Tried 4 times to upload KYC, app still says incomplete.”',
        url: 'https://twitter.com/search?q=SBI%20KYC%20incomplete',
      },
      {
        type: 'forum',
        label: 'Banking complaint board – delayed KYC approvals',
        url: 'https://indiaconsumerforum.org/sbi-digital-kyc-complaints',
      },
    ],
  },
  {
    id: 'sig22',
    institutionId: 'icici_bank',
    title:
      'Investigative news story flags potential AML process gaps in select NBFC partnerships',
    body:
      'Business daily highlights repeated SAR (suspicious activity report) triggers on co-lending portfolios where ICICI is the funding partner, with questions raised on transaction monitoring thresholds.',
    sourceType: 'news',
    sourceName: 'Business Standard, investigative desk',
    importance: 'high',
    sentiment: 'negative',
    timestampOffsetHours: 40,
    shortTerm: false,
    structural: true,
    score: 87,
    tags: ['AML', 'co-lending', 'compliance'],
    categoryIds: ['aml'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'news_crawler',
      location: 's3://ews-raw/news/bs/aml-co-lending-icici.json',
      ingestionLagMinutes: 120,
    },
    supervisorySummary:
      'Investigative coverage of AML gaps in co-lending arrangements helps identify where responsibility and monitoring thresholds may be weak.',
    rawSources: [
      {
        type: 'article',
        label: 'Business Standard – AML red flags in NBFC co-lending deals',
        url: 'https://www.business-standard.com/finance/aml-gaps-co-lending-icici',
      },
    ],
  },
  // 6. Cash shortages during demonetisation-like stress
  {
    id: 'sig23',
    institutionId: 'sbi',
    title:
      'Throwback pattern: archive of 2016 tweets shows ATM queues and cash-outs peaking in specific districts',
    body:
      'Geo-tagged social media posts from 2016 demonetisation period reveal that districts in Eastern UP and Bihar saw 2–3x higher ATM outage mentions compared to metros, indicating stress in local cash logistics.',
    sourceType: 'social',
    sourceName: 'Historical Twitter archive, geo-tagged',
    importance: 'medium',
    sentiment: 'negative',
    timestampOffsetHours: 72,
    shortTerm: true,
    structural: true,
    score: 70,
    tags: ['cash-shortage', 'ATM', 'logistics'],
    categoryIds: ['liquidity'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'historical_social_archive',
      location: 's3://ews-archive/2016-demonetisation/sbi_atm_shortages.parquet',
      ingestionLagMinutes: 0,
    },
    supervisorySummary:
      'Historical social media patterns during demonetisation-like events can inform stress scenario design for future cash logistics planning.',
    rawSources: [
      {
        type: 'tweet',
        label: '2016 archive – “No cash in ATMs in Gorakhpur for 3rd day”',
        url: 'https://twitter.com/search?q=ATM%20no%20cash%202016',
      },
    ],
  },
  {
    id: 'sig24',
    institutionId: 'auj_small_finance',
    title:
      'Local reporters highlight cash shortages at AU SFB micro-ATMs during government scheme payout days',
    body:
      'Vernacular news and YouTube channels in rural Rajasthan show long queues at micro-ATMs for NREGA and pension withdrawals, with agents citing “server down” and limited cash replenishment.',
    sourceType: 'news',
    sourceName: 'Regional YouTube, vernacular portals',
    importance: 'high',
    sentiment: 'negative',
    timestampOffsetHours: 9,
    shortTerm: true,
    structural: true,
    score: 82,
    tags: ['cash-shortage', 'micro-ATM', 'govt-schemes'],
    categoryIds: ['liquidity'],
    cacheStatus: 'streaming',
    sourceSystem: {
      type: 'regional_video_monitoring',
      location: 's3://ews-raw/regional_video/rajasthan/micro_atm_cashouts/',
      ingestionLagMinutes: 15,
    },
    supervisorySummary:
      'Coverage of cash shortages at micro-ATMs on benefit payout days highlights where logistical constraints may undermine government schemes.',
    rawSources: [
      {
        type: 'video',
        label: 'Rural Rajasthan YouTube vlog – queues at micro-ATMs',
        url: 'https://youtube.com/watch?v=cash-shortage-micro-atm',
      },
      {
        type: 'article',
        label: 'Vernacular news – “NREGA beneficiaries wait hours for cash”',
        url: 'https://rajasthanbhasha.com/nrega-micro-atm-cash-issue',
      },
    ],
  },
  // 7. Viral rumours & local events around cooperative banks
  {
    id: 'sig25',
    institutionId: 'urban_coop_pune',
    title:
      'WhatsApp forwards claim “branch closure” at Pune co-operative bank, triggering anxious depositor visits',
    body:
      'Local WhatsApp groups circulate unverified voice notes claiming that a small co-operative bank in Pune will “shut next week”. Branch CCTV and local reporters capture unusual spike in walk-ins and enquiry calls.',
    sourceType: 'social',
    sourceName: 'WhatsApp forwards, local Facebook groups',
    importance: 'critical',
    sentiment: 'negative',
    timestampOffsetHours: 1.9,
    shortTerm: true,
    structural: false,
    score: 91,
    tags: ['rumour', 'liquidity-risk', 'cooperative-bank'],
    categoryIds: ['rumours', 'liquidity'],
    cacheStatus: 'streaming',
    sourceSystem: {
      type: 'messaging_monitoring',
      location: 'kafka:ews.whatsapp.voice_forwards.shivaji_urban',
      ingestionLagMinutes: 2,
    },
    supervisorySummary:
      'Early detection of viral but false closure rumours enables quick RBI clarification and local engagement to prevent withdrawal spikes.',
    rawSources: [
      {
        type: 'social',
        label: 'Forwarded WhatsApp audio claiming “bank closing next week”',
        url: '',
      },
      {
        type: 'social',
        label: 'Local Facebook group discussion about “bank safety”',
        url: 'https://facebook.com/groups/pune-coop-bank-rumours',
      },
    ],
  },
  {
    id: 'sig26',
    institutionId: 'urban_coop_pune',
    title:
      'Regional Marathi channels run clarificatory pieces after RBI statement on stability of Pune co-operative bank',
    body:
      'Following rumours and local queues, RBI issues a short clarification note carried by Marathi TV channels, stating there is no moratorium and deposits are safe, which gradually cools social chatter.',
    sourceType: 'news',
    sourceName: 'Marathi news channels, RBI press note',
    importance: 'medium',
    sentiment: 'positive',
    timestampOffsetHours: 1.2,
    shortTerm: true,
    structural: false,
    score: 73,
    tags: ['rumour-control', 'communication', 'cooperative-bank'],
    categoryIds: ['rumours'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'news_crawler',
      location: 's3://ews-raw/regional/marathi/shivaji-urban-rbi-clarification.json',
      ingestionLagMinutes: 45,
    },
    supervisorySummary:
      'Broadcast amplification of RBI clarification helps rebuild depositor confidence and can be tracked as the rumour subsides.',
    rawSources: [
      {
        type: 'article',
        label: 'RBI press note – No moratorium on Shivaji Urban Co-operative Bank',
        url: 'https://rbi.org.in/pressreleases/shivaji-urban-coop-clarification',
      },
      {
        type: 'video',
        label: 'Marathi news clip carrying RBI clarification',
        url: 'https://youtube.com/watch?v=shivaji-coop-rbi-clarification',
      },
    ],
  },
  // 8. FX risk and offshore funding
  {
    id: 'sig27',
    institutionId: 'hdfc_bank',
    title:
      'Offshore investors flag rising hedging costs on HDFC Bank AT1 dollar bonds',
    body:
      'Sell-side research and investor commentary highlight that cross-currency basis and swap costs have increased materially for recent AT1 issuances, squeezing carry trades for leveraged offshore investors.',
    sourceType: 'news',
    sourceName: 'Global fixed income research notes',
    importance: 'medium',
    sentiment: 'negative',
    timestampOffsetHours: 30,
    shortTerm: false,
    structural: true,
    score: 71,
    tags: ['FX', 'wholesale-funding', 'AT1'],
    categoryIds: ['liquidity'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'research_ingest',
      location: 's3://ews-raw/research/global/hdfc_at1_fx_hedging.pdf',
      ingestionLagMinutes: 180,
    },
    supervisorySummary:
      'Higher FX hedging costs on AT1 instruments can change the investor base mix and funding stability, particularly if combined with other wholesale funding pressures.',
    rawSources: [
      {
        type: 'report',
        label: 'Global FI house – “HDFC AT1: carry trade less attractive as basis widens”',
        url: '',
      },
    ],
  },
  {
    id: 'sig28',
    institutionId: 'icici_bank',
    title:
      'Sudden widening in ICICI 5Y CDS spreads relative to peer private banks',
    body:
      'Bloomberg and dealer quotes show ICICI 5Y CDS widening 18–22 bps over the week, while HDFC and Axis have moved only 5–7 bps, prompting questions about idiosyncratic risk.',
    sourceType: 'internal',
    sourceName: 'Market data feed (mock)',
    importance: 'high',
    sentiment: 'negative',
    timestampOffsetHours: 10,
    shortTerm: true,
    structural: true,
    score: 86,
    tags: ['market-risk', 'CDS', 'FX'],
    categoryIds: ['liquidity'],
    cacheStatus: 'streaming',
    sourceSystem: {
      type: 'marketdata_stream',
      location: 'kafka:ews.marketdata.cds.icici',
      ingestionLagMinutes: 0,
    },
    supervisorySummary:
      'A disproportionate CDS widening versus peers may reflect market concerns beyond broad macro factors and can warrant closer supervisory dialogue.',
    rawSources: [
      {
        type: 'market',
        label: 'ICICI 5Y CDS time series (in-house dashboard)',
        url: '',
      },
    ],
  },
  // 9. Wholesale funding and liquidity
  {
    id: 'sig29',
    institutionId: 'sbi',
    title:
      'ALM reports show rising share of bulk deposits with residual maturity under 3 months',
    body:
      'Internal ALM snapshot indicates that the proportion of time deposits maturing within 3 months has moved from 17% to 24% of total deposits over two quarters, largely driven by bulk corporate flows.',
    sourceType: 'internal',
    sourceName: 'ALM system extract (mock)',
    importance: 'high',
    sentiment: 'negative',
    timestampOffsetHours: 50,
    shortTerm: false,
    structural: true,
    score: 82,
    tags: ['liquidity', 'ALM', 'bulk-deposits'],
    categoryIds: ['liquidity'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'internal_alm',
      location: 'db:bank_internal_alm.sbi_maturity_buckets',
      ingestionLagMinutes: 120,
    },
    supervisorySummary:
      'A build-up in short-tenor bulk deposits can increase rollover risk, especially if combined with market stress or rating changes.',
    rawSources: [
      {
        type: 'internal',
        label: 'ALM report – deposit maturity ladder (Q3 vs Q2)',
        url: '',
      },
    ],
  },
  {
    id: 'sig30',
    institutionId: 'auj_small_finance',
    title:
      'Rating agency commentary highlights increased reliance on high-cost term borrowings for AU SFB',
    body:
      'A recent rating note points out that AU SFB has grown its term borrowing book faster than deposits, with a noticeable shift toward higher-cost NBFC lines and market borrowings.',
    sourceType: 'news',
    sourceName: 'Rating agency release',
    importance: 'medium',
    sentiment: 'negative',
    timestampOffsetHours: 60,
    shortTerm: false,
    structural: true,
    score: 74,
    tags: ['liquidity', 'wholesale-funding', 'ratings'],
    categoryIds: ['liquidity'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'rating_feed',
      location: 's3://ews-raw/ratings/au_sfb/liquidity_profile.json',
      ingestionLagMinutes: 240,
    },
    supervisorySummary:
      'A shift toward higher-cost term borrowings may compress margins and increase liquidity risk if markets turn risk-off.',
    rawSources: [
      {
        type: 'report',
        label: 'Rating rationale – AU SFB liquidity and funding profile',
        url: '',
      },
    ],
  },
  // 10. Cyber incidents
  {
    id: 'sig31',
    institutionId: 'hdfc_bank',
    title:
      'Cyber security researchers disclose critical API vulnerability in HDFC mobile banking app (patched)',
    body:
      'Independent researchers report that a now-patched vulnerability allowed enumeration of partially masked account details through a public API. No confirmed fraud, but disclosure attracts media attention.',
    sourceType: 'news',
    sourceName: 'Cyber security blogs + tech press',
    importance: 'high',
    sentiment: 'negative',
    timestampOffsetHours: 20,
    shortTerm: true,
    structural: true,
    score: 88,
    tags: ['cyber', 'API', 'mobile-banking'],
    categoryIds: ['cyber'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'security_feed',
      location: 's3://ews-raw/security/hdfc/api_vuln_disclosure.json',
      ingestionLagMinutes: 30,
    },
    supervisorySummary:
      'Even when patched quickly, public disclosures of critical vulnerabilities can impact trust and require supervisors to assess secure SDLC practices.',
    rawSources: [
      {
        type: 'article',
        label: 'Security blog – “Account detail enumeration in major Indian bank apps”',
        url: '',
      },
    ],
  },
  {
    id: 'sig32',
    institutionId: 'icici_bank',
    title:
      'Dark web monitoring flags dataset claiming to contain ICICI customer email and phone hashes',
    body:
      'Automated dark web crawlers detect a dump advertised as “ICICI partial PII”. Hash structure suggests marketing data leakage rather than core banking compromise, but verification is pending.',
    sourceType: 'internal',
    sourceName: 'Dark web monitoring service',
    importance: 'medium',
    sentiment: 'negative',
    timestampOffsetHours: 12,
    shortTerm: true,
    structural: true,
    score: 79,
    tags: ['cyber', 'data-leak', 'reputational'],
    categoryIds: ['cyber'],
    cacheStatus: 'streaming',
    sourceSystem: {
      type: 'darkweb_monitor',
      location: 's3://ews-raw/darkweb/icici/marketing_dataset_claim.json',
      ingestionLagMinutes: 10,
    },
    supervisorySummary:
      'Potential leakage of PII, even if marketing-only, may raise questions about vendor and internal data-handling controls.',
    rawSources: [
      {
        type: 'internal',
        label: 'Dark web alert snapshot – ICICI marketing list claim',
        url: '',
      },
    ],
  },
  // 11. ESG and conduct / climate-related
  {
    id: 'sig33',
    institutionId: 'sbi',
    title:
      'ESG activists question SBI exposure to new coal-linked projects via syndicated loans',
    body:
      'NGO reports and social media campaigns highlight SBI’s participation in syndicated facilities to companies expanding coal mining and coal-based power, citing climate commitments.',
    sourceType: 'news',
    sourceName: 'ESG NGO reports + financial press',
    importance: 'medium',
    sentiment: 'negative',
    timestampOffsetHours: 72,
    shortTerm: false,
    structural: true,
    score: 69,
    tags: ['ESG', 'climate', 'syndicated-loans'],
    categoryIds: ['governance'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'esg_feed',
      location: 's3://ews-raw/esg_reports/sbi/coal_exposure_2026.json',
      ingestionLagMinutes: 1440,
    },
    supervisorySummary:
      'Climate-related reputational and transition risks can affect long-term credit quality and access to certain investor bases.',
    rawSources: [
      {
        type: 'report',
        label: 'NGO report – “Coal financing by Indian banks 2023–26”',
        url: '',
      },
    ],
  },
  {
    id: 'sig34',
    institutionId: 'ujjivan_sfb',
    title:
      'Local press questions treatment of women borrowers in flood-affected districts under microfinance relief schemes',
    body:
      'Case studies in vernacular media highlight that some women self-help group borrowers report confusion about moratorium eligibility and continued collections despite state announcements.',
    sourceType: 'news',
    sourceName: 'Vernacular print + digital',
    importance: 'medium',
    sentiment: 'negative',
    timestampOffsetHours: 36,
    shortTerm: true,
    structural: true,
    score: 76,
    tags: ['ESG', 'social-risk', 'microfinance'],
    categoryIds: ['governance'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'regional_news_crawler',
      location: 's3://ews-raw/regional/microfinance/ujjivan_relief_issues.json',
      ingestionLagMinutes: 360,
    },
    supervisorySummary:
      'Social risk issues in microfinance, particularly affecting vulnerable groups, can rapidly escalate into reputational and political risk.',
    rawSources: [
      {
        type: 'article',
        label: 'Vernacular profile – SHG groups complain of unclear relief communication',
        url: '',
      },
    ],
  },
  // 12. Cooperative bank inspections and enforcement
  {
    id: 'sig35',
    institutionId: 'urban_coop_pune',
    title:
      'RBI inspection team flags deficiencies in credit appraisal documentation at Pune co-operative bank',
    body:
      'Summary of an onsite inspection (mock) notes inconsistent documentation for small business loans, including missing income proofs and post-disbursement visit records.',
    sourceType: 'internal',
    sourceName: 'Regulatory inspection note (mock)',
    importance: 'high',
    sentiment: 'negative',
    timestampOffsetHours: 200,
    shortTerm: false,
    structural: true,
    score: 90,
    tags: ['inspection', 'credit-process', 'cooperative-bank'],
    categoryIds: ['governance'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'inspection_system',
      location: 'db:rbi_internal.inspection_findings.shivaji_urban_credit',
      ingestionLagMinutes: 1440,
    },
    supervisorySummary:
      'Process weaknesses in co-operative bank credit appraisal amplify idiosyncratic credit risk and can trigger PCA-like actions if not remediated.',
    rawSources: [
      {
        type: 'internal',
        label: 'Inspection summary – credit documentation findings',
        url: '',
      },
    ],
  },
  // 13. Additional streaming social & news noise vs signal
  {
    id: 'sig36',
    institutionId: 'hdfc_bank',
    title:
      'Weekend spike in generic complaints about card reward points expiry at HDFC',
    body:
      'Social media monitoring sees a temporary rise in complaints around reward points expiry rather than core service outages or fraud, considered low materiality but tracked as customer sentiment.',
    sourceType: 'social',
    sourceName: 'Twitter, Facebook',
    importance: 'low',
    sentiment: 'negative',
    timestampOffsetHours: 0.4,
    shortTerm: true,
    structural: false,
    score: 42,
    tags: ['customer-experience', 'cards', 'noise'],
    categoryIds: ['conduct'],
    cacheStatus: 'streaming',
    sourceSystem: {
      type: 'social_stream',
      location: 'kafka:ews.social.hdfc.card_rewards',
      ingestionLagMinutes: 1,
    },
    supervisorySummary:
      'Low-materiality complaints can still indicate UX issues but generally do not warrant supervisory escalation unless patterns persist or connect to mis-selling.',
    rawSources: [
      {
        type: 'tweet',
        label: 'Sample tweets complaining of unexpected reward expiry',
        url: '',
      },
    ],
  },
  {
    id: 'sig37',
    institutionId: 'icici_bank',
    title:
      'ICICI mobile app rating improves post major UI revamp, with drop in “app crashes” keyword frequency',
    body:
      'App store analytics show a move from 3.9 to 4.3 average rating over three months, with a measurable decline in reviews mentioning crashes and login issues.',
    sourceType: 'internal',
    sourceName: 'App store analytics (mock)',
    importance: 'low',
    sentiment: 'positive',
    timestampOffsetHours: 5,
    shortTerm: true,
    structural: false,
    score: 55,
    tags: ['customer-experience', 'mobile-banking', 'ops'],
    categoryIds: ['it_outages'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'appstore_scrape',
      location: 's3://ews-raw/appstore_reviews/icici/mobile_app_ratings.parquet',
      ingestionLagMinutes: 60,
    },
    supervisorySummary:
      'Improving app stability metrics can mitigate concerns raised by earlier outage-related signals for the same channel.',
    rawSources: [
      {
        type: 'internal',
        label: 'App store analytics dashboard – ICICI app',
        url: '',
      },
    ],
  },
  // 14. Backfilled legal / enforcement actions
  {
    id: 'sig38',
    institutionId: 'sbi',
    title:
      'Archived SAT order reveals past penalty on SBI for delayed disclosure of related party transactions',
    body:
      'Backfilled enforcement database notes a 2018 SAT order upholding penalty for delayed disclosure of related party transactions in a specific subsidiary.',
    sourceType: 'legal',
    sourceName: 'SAT orders archive',
    importance: 'medium',
    sentiment: 'negative',
    timestampOffsetHours: 24 * 365, // approximately 1 year backfill
    shortTerm: false,
    structural: true,
    score: 60,
    tags: ['enforcement', 'governance', 'related-party'],
    categoryIds: ['governance'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'enforcement_archive',
      location: 'db:rbi_internal.enforcement_archive.sbi_sat_orders',
      ingestionLagMinutes: 0,
    },
    supervisorySummary:
      'Historical enforcement actions are relevant for understanding governance track record and for model back-testing.',
    rawSources: [
      {
        type: 'legal',
        label: 'SAT order – penalty on delayed RPT disclosure',
        url: '',
      },
    ],
  },
  // 15. Micro-cluster performance metrics
  {
    id: 'sig39',
    institutionId: 'ujjivan_sfb',
    title:
      'Internal MIS shows early improvement in PAR30 for two flood-affected microfinance districts',
    body:
      'Branch-level MIS indicates that portfolio at risk >30 days has started declining in two previously stressed districts following tightened underwriting and focused collection strategies.',
    sourceType: 'internal',
    sourceName: 'Branch MIS (mock)',
    importance: 'medium',
    sentiment: 'positive',
    timestampOffsetHours: 14,
    shortTerm: true,
    structural: true,
    score: 68,
    tags: ['asset-quality', 'microfinance', 'collections'],
    categoryIds: ['collections', 'retail_stress'],
    cacheStatus: 'cached',
    sourceSystem: {
      type: 'internal_mis',
      location: 'db:bank_internal_mis.ujjivan.par30_district_trends',
      ingestionLagMinutes: 180,
    },
    supervisorySummary:
      'Improving PAR metrics in previously high-risk districts provide counter-signals to adverse field reports and can influence supervisory stance.',
    rawSources: [
      {
        type: 'internal',
        label: 'District-wise PAR30 trend report',
        url: '',
      },
    ],
  },
];

export {
  INSTITUTIONS,
  SIGNALS,
  SIGNAL_TYPES,
  IMPORTANCE_LEVELS,
  SIGNAL_CATEGORIES,
  INSTITUTION_TYPES,
};

