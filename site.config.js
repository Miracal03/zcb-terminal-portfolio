window.SITE_CONFIG = {
  identity: {
    name: "周驰斌",
    callsign: "ZCB / AI LAB",
    role: "AI 算法实习生",
    location: "Shanghai / Hangzhou, CN",
    coordinates: "31.2304 N / 121.4737 E",
    availability: "可连续实习 3-6 个月",
    statement: "让大模型推理更高效，让知识检索真正可验证。",
    bio: "中国科学技术大学计算机科学与技术硕士在读，关注大模型推理、RAG 与机器学习。能够独立完成问题建模、方案实现、实验评测与性能分析闭环，坚持用数据和消融实验验证结论。",
    email: "zcb_ustc@mail.ustc.edu.cn"
  },
  stats: [
    { value: "34", label: "篇方案与文献调研" },
    { value: "98.5%", label: "KV Cache 内存降低" },
    { value: "+45.3%", label: "解码吞吐提升" }
  ],
  capabilities: [
    { code: "01", title: "大模型与深度学习", detail: "PyTorch / Transformers / LLaMA-Factory / LoRA" },
    { code: "02", title: "RAG 与模型评测", detail: "SentenceTransformers / FAISS / MedMCQA / LongBench" },
    { code: "03", title: "推理优化与工程", detail: "KV Cache / Attention / vLLM / PagedAttention" }
  ],
  projects: [
    {
      id: "P-01",
      year: "CORE",
      title: "TECKV / 长上下文 KV Cache 压缩",
      category: "inference",
      categoryLabel: "大模型推理",
      description: "从标量头门控的排序不变性出发，将压缩问题重构为 Token-to-Head 路由并设计头自适应配额；在 4 类模型、16 项 LongBench 评测中，512 Token/KV 头预算下保留 96.36% FullKV 质量，最高降低 98.5% KV Cache 内存并提升 45.3% 解码吞吐。",
      services: "Python / PyTorch / Transformers / KV Cache",
      image: "assets/project-signal.jpg",
      alt: "电子电路板的微距画面"
    },
    {
      id: "P-02",
      year: "RAG",
      title: "医疗大模型领域知识注入与问答系统",
      category: "rag",
      categoryLabel: "RAG 与模型评测",
      description: "将医疗知识注入拆解为 LoRA 参数化学习与 RAG 非参数化检索两条链路，完成数据处理、两阶段训练和统一评测；MedMCQA 准确率由 21.7% 提升至 52.7%，并通过消融定位泛化与知识冲突问题。",
      services: "Python / LoRA / SentenceTransformers / RAG / MedMCQA",
      image: "assets/project-space.jpg",
      alt: "具有玻璃隔断的现代工作空间"
    },
    {
      id: "P-03",
      year: "RESEARCH",
      title: "Attention Head 协同优化研究",
      category: "research",
      categoryLabel: "科研与方案设计",
      description: "围绕 Task-KV、DuoAttention、PagedAttention/vLLM、GQA/MQA/MLA 等 34 项文献与开源方案，抽象 H_score 与 Priority 评分函数，设计热度评估、任务调度、差异化缓存分配与多维评估闭环。",
      services: "KV Cache / Attention / LongBench / MMLU / MBPP",
      image: "assets/project-form.jpg",
      alt: "黑白抽象艺术装置"
    }
  ],
  logs: [
    { date: "FOCUS.01", title: "从机制分析出发完成问题建模与算法设计", type: "MODELING" },
    { date: "FOCUS.02", title: "用统一评测与消融实验验证技术结论", type: "EVALUATION" },
    { date: "FOCUS.03", title: "从异常结果定位知识冲突与系统瓶颈", type: "ENGINEERING" }
  ],
  links: [
    { label: "Email", href: "mailto:zcb_ustc@mail.ustc.edu.cn" }
  ]
};
