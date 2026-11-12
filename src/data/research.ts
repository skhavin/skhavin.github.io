export interface ResearchLink {
  label: string;
  url: string;
}

export interface PaperEntry {
  index: string;
  date: string;
  venue: string;
  title: string;
  summary: string;
  abstract: string;
  links: ResearchLink[];
}

export interface WritingEntry {
  tag: string;
  title: string;
  description: string;
  cta: string;
  url: string;
}

export interface LedgerEntry {
  period: string;
  primary: string;
  detail: string;
}

export const SITE_LINKS = {
  openReview: 'https://openreview.net/profile?id=~S_Khavin1',
  github: 'https://github.com/skhavin',
  mainSite: 'https://skhavin.in',
  researchExternal: 'https://skhavin.in/research',
  blogExternal: 'https://skhavin.in/blog',
  email: 'mailto:skhavin.res@gmail.com',
};

export const FEATURED_PAPER = {
  index: '00',
  date: 'Aug 2026',
  venue: 'Zenodo · Mechanistic Interpretability & Geometry',
  title:
    'The Shape of Computation: Language Models Build Universal, Conserved Task Geometries That Are Causally Inert',
  oneLiner:
    'Uncovers CKA-DTW conserved trunk-and-branch task manifolds built by MLP layers across three architectures—and shows under strict null controls that this geometry is causally inert.',
  abstractParagraphs: [
    'Large language models appear to represent distinct cognitive operations (arithmetic, sorting, comparison, fact recall) as separable regions of their residual stream. Eliminating embedding-layer template leakage across three architecturally distinct models and applying train/test-separated PCA, layer-wise F-statistics, and CKA-aligned dynamic time warping with permutation controls reveals a consistent “trunk-and-branch” trajectory constructed almost entirely by MLP layers rather than attention heads.',
    'Testing causal sufficiency through contrastive activation steering with magnitude-matched random controls and out-of-distribution generalization checks yields a clear null result: causal efficacy does not track geometric maturation, showing that this universal task map is an epiphenomenal byproduct of computation rather than the mechanism driving behavior.',
  ],
  image: 'https://skhavin.in/assets/trunkandbranchthumbnail.png',
  fallbackImage: 'https://skhavin.github.io/assets/trunkandbranchthumbnail.png',
  caption: 'FIG. 01 — QWEN2.5-1.5B RESIDUAL TASK TRAJECTORY MANIFOLD (GLOBAL PCA)',
  links: [
    { label: 'Zenodo Preprint', url: 'https://zenodo.org/records/21738187' },
    {
      label: 'Field Note Essay',
      url: 'https://skhavin.in/blog/trunk-and-branch-theory-of-computation',
    },
  ],
};

export const PREPRINTS: PaperEntry[] = [
  {
    index: '01',
    date: 'Aug 2026',
    venue: 'OpenReview · Zenodo',
    title:
      'K Heads is All You Need: Task-Dependent Circuit Granularity and Zero-Training Routing in LLMs',
    summary:
      'Isolates a 6-head retrieval circuit in Qwen2.5-1.5B and builds an early-layer cosine router validated on RULER 4K with zero false activations.',
    abstract:
      'Demonstrates that needle-in-a-haystack retrieval in Qwen2.5-1.5B relies on a 6-head causal circuit, while counting, sorting, and variable tracking resist sparsification and naive gradient attribution degrades working circuits. Builds a zero-training early-layer geometric router across four model families validated on NVIDIA RULER 4K with zero false activations across 100 out-of-distribution samples.',
    links: [
      { label: 'OpenReview', url: 'https://openreview.net/forum?id=eFLz0H38En' },
      { label: 'Zenodo', url: 'https://zenodo.org/records/22082191' },
    ],
  },
  {
    index: '02',
    date: 'Jul 2026',
    venue: 'OpenReview · Zenodo',
    title:
      'Necessary but Not Sufficient: Convergent Computational Geometry in the Transformer Residual Stream',
    summary:
      'Shows residual relational geometry aligns across Qwen2.5, Llama-3.2, and Phi-1.5 (ρ = 0.38–0.75), yet ablation breaks tasks while steering fails to induce them.',
    abstract:
      'Falsifies fixed head-level hardware taxonomies across models and shifts focus to residual-stream geometry across 12 operation categories. Shows conserved relational directions generalize to held-out operations via Procrustes alignment and remain invariant to operand content, characterizing the necessity-without-sufficiency gap under causal intervention.',
    links: [
      { label: 'OpenReview', url: 'https://openreview.net/forum?id=PZOx6oz6TT' },
      { label: 'Zenodo', url: 'https://zenodo.org/records/21300225' },
    ],
  },
  {
    index: '03',
    date: 'Jul 2026',
    venue: 'OpenReview · Zenodo',
    title:
      'The HeadGenome Taxonomy: A Structural and Causal Map of Attention Head Specialization',
    summary:
      'Maps 1,568 attention heads across four models into Sink, Local, Retrieval, and Induction classes, yielding 13.3× KV-cache compression over StreamingLLM.',
    abstract:
      'Classifies 1,568 attention heads across four architectures using dynamic entropy-collapse probing, uncovers Early vs. Late Induction subpopulations, exposes the perplexity illusion caused by positional leakage, and applies the resulting structural taxonomy to achieve zero-degradation KV compression.',
    links: [
      { label: 'OpenReview', url: 'https://openreview.net/forum?id=iG4i2pc4wg' },
      { label: 'Zenodo', url: 'https://zenodo.org/records/21108324' },
      { label: 'Code', url: 'https://github.com/skhavin/headgenome' },
      { label: 'Site', url: 'https://skhavin.github.io/attentionheadgenome/' },
    ],
  },
  {
    index: '04',
    date: 'May 2026',
    venue: 'Zenodo · OpenReview',
    title:
      'O(1) Decode Step Attention for Any Transformer via Training-Free Proactive KV Cache Eviction',
    summary:
      'Predicts active attention prototypes offline before query arrival to bound decode to O(1) cost, delivering a 3.09× speedup on LLaMA 3.1 8B.',
    abstract:
      'Profiles frozen pretrained attention heads offline and predicts active prototypes at ingest to bound the KV cache to a fixed budget B without weight updates. Outperforms StreamingLLM on LLaMA 3.1 8B (PPL 10.25 vs. 47.34) and PG-19 books while delivering a 3.09× decode speedup at 2048 context.',
    links: [{ label: 'Zenodo', url: 'https://zenodo.org/records/20465915' }],
  },
  {
    index: '05',
    date: 'Mar 2026',
    venue: 'OpenReview · Zenodo',
    title:
      'Trinetra: O(N) Video Ingest, O(1) Query — A Proactive Temporal Event Graph for Long Video',
    summary:
      'Compresses long video streams in O(N) into a dual-FAISS Temporal Event Graph for O(1) queries with a 9× temporal gain and 317,500× fewer FLOPs.',
    abstract:
      'Introduces Temporal Event Graphs (TEG), multi-scale Temporal Attention Shift (TAS₂, TAS₈, TAS₃₂), and dual semantic-temporal FAISS indexing so long video streams ingest in O(N) and answer queries in constant O(1) time with 70% clean output vs. 20% for static attention.',
    links: [
      { label: 'OpenReview', url: 'https://openreview.net/forum?id=jUtTzSVplk' },
      { label: 'Zenodo', url: 'https://zenodo.org/records/19144365' },
    ],
  },
];

export const WRITING_ENTRIES: WritingEntry[] = [
  {
    tag: 'Essay 01',
    title: 'The Trunk and Branch Theory of Computation',
    description:
      'Why task representations diverge progressively from a shared semantic trunk across architectures—and what null steering controls tell us about causal readouts.',
    cta: 'Read ↗',
    url: 'https://skhavin.in/blog/trunk-and-branch-theory-of-computation',
  },
  {
    tag: 'Archive',
    title: 'Field Notes — Ideas, Experiments & Working Fragments',
    description:
      'Browse research essays, open mechanistic interpretability questions, and lab notes hosted on the main site.',
    cta: 'Open Blog ↗',
    url: 'https://skhavin.in/blog',
  },
];

export const EXPERIENCE: LedgerEntry[] = [
  {
    period: '2025–26',
    primary: 'Independent AI Researcher',
    detail: 'Mechanistic Interpretability, Residual Geometry & Efficient Inference',
  },
  { period: '2025', primary: 'SWE Co-Op Intern', detail: 'AlgoUniversity (YC)' },
  { period: '2024', primary: 'ML Research Intern (Co-Lead)', detail: 'Omdena' },
  { period: '2024', primary: 'AI & Automation Intern', detail: 'Chennai Airport' },
  { period: '2023', primary: 'Business Analytics Intern', detail: 'Business.io · IITM' },
];

export const SELECTED_EXPERIENCE: LedgerEntry[] = EXPERIENCE.slice(0, 3);

export const AWARDS: LedgerEntry[] = [
  {
    period: '2024',
    primary: 'Google GenAI Hackathon',
    detail: 'Team Lead · National Top Project',
  },
  {
    period: '2024',
    primary: 'AlgoUniversity Technology Fellowship (ATF)',
    detail: 'Top 5% of 20,000 applicants nationwide',
  },
  {
    period: '2024',
    primary: 'National Entrepreneurship Challenge · IIT Bombay',
    detail: '5th Place nationwide',
  },
  {
    period: '2023',
    primary: 'Udacity Next Gen Tech Booster Scholarship',
    detail: 'Top 500 of 17,000 global applicants',
  },
];

export const SELECTED_AWARDS: LedgerEntry[] = [AWARDS[0], AWARDS[1], AWARDS[3]];

export const COMMUNITY: LedgerEntry[] = [
  { period: 'IITM', primary: 'Sponsorship & Collab Head', detail: 'LingoLabs IITM' },
  {
    period: 'LEAD',
    primary: 'Technical Architecture Lead',
    detail: 'Pod SIST · Alpha Gamma Nu IITM · GDSC',
  },
  { period: 'GDSC', primary: 'Technical Team Member', detail: 'GDSC SIST' },
  { period: 'CLUB', primary: 'Web Development Specialist', detail: 'Philosophy Club' },
];
