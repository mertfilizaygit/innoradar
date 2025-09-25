import { type AnalysisResult } from "@/services/claudeApi";

export interface FakeResearchItem {
  id: string;
  title: string;
  field: string;
  abstract: string;
  author: string;
  institution: string;
  publishedDate: string;
  tags: string[];
  analysisResult: AnalysisResult;
}

export const fakeResearchData: FakeResearchItem[] = [
  {
    id: "ai-drug-discovery",
    title: "AI-Powered Molecular Design for Accelerated Drug Discovery",
    field: "Biotechnology",
    author: "Dr. Sarah Chen",
    institution: "Stanford University",
    publishedDate: "2024-03-15",
    tags: ["AI", "Drug Discovery", "Machine Learning", "Pharmaceuticals"],
    abstract: "We present a novel artificial intelligence framework that combines deep learning with molecular dynamics simulations to accelerate drug discovery processes. Our approach reduces the time required for lead compound identification from years to months by predicting molecular interactions with 94% accuracy. The system has successfully identified three promising candidates for Alzheimer's treatment, currently in preclinical trials. This breakthrough addresses the critical market failure of lengthy and expensive drug development cycles that cost pharmaceutical companies billions annually.",
    analysisResult: {
      marketAnalysis: {
        score: 85,
        summary: "Pharmaceutical market represents a $1.5 trillion opportunity with urgent need for faster drug discovery. AI-driven solutions are projected to capture $40B by 2030.",
        marketSize: "$40 billion AI drug discovery market by 2030, growing at 28% CAGR from current $2.8 billion",
        competition: "Competing with Atomwise, Recursion Pharmaceuticals, and BenevolentAI, but superior accuracy metrics provide competitive advantage",
        trends: [
          "Increasing pharmaceutical R&D costs driving AI adoption",
          "Regulatory acceptance of AI-designed drugs growing",
          "Major pharma partnerships with AI companies accelerating"
        ]
      },
      technicalFeasibility: {
        score: 78,
        summary: "Strong technical foundation with proven 94% accuracy. Requires significant computational resources and specialized expertise for scaling.",
        complexity: "High - requires advanced ML expertise, molecular biology knowledge, and substantial computing infrastructure",
        timeToMarket: "18-24 months for commercial platform, 3-5 years for first drug approvals",
        risks: [
          "Regulatory approval uncertainty for AI-designed drugs",
          "High computational costs may limit scalability",
          "Need for extensive validation in clinical trials"
        ]
      },
      commercialPotential: {
        score: 82,
        summary: "Multiple revenue streams through licensing, partnerships, and direct drug development. Strong IP position with patent applications filed.",
        revenueModel: "SaaS platform licensing ($50K-500K annually), partnership deals with pharma (milestone payments + royalties), direct drug development",
        scalability: "Platform can be applied across multiple therapeutic areas and disease targets with minimal additional development",
        barriers: [
          "High capital requirements for drug development",
          "Long regulatory approval timelines",
          "Need for pharmaceutical industry partnerships"
        ]
      },
      teamAndExecution: {
        score: 52,
        summary: "Strong academic foundation but lacks commercial experience. Team requires significant expansion in business development and regulatory affairs.",
        expertise: "PhD-level expertise in AI/ML, computational chemistry, and molecular biology. Missing commercial drug development experience",
        resources: "$5-10M seed funding needed, access to high-performance computing, pharmaceutical partnerships for validation",
        recommendations: [
          "Recruit experienced pharmaceutical executive as CEO/COO",
          "Establish advisory board with former FDA officials",
          "Secure strategic partnerships with major pharma companies"
        ]
      },
      overallScore: 74,
      investmentRecommendation: "BUY",
      keyInsights: [
        "Creates new market category by fundamentally changing drug discovery timeline",
        "Serves as nucleus for AI-pharmaceutical ecosystem development", 
        "Addresses critical market failure of slow, expensive drug development",
        "Strong IP moat with proprietary molecular interaction prediction algorithms"
      ],
      nextSteps: [
        "Complete Series A funding round ($8-12M) within 6 months",
        "Establish partnerships with 2-3 major pharmaceutical companies",
        "File additional patent applications for core algorithms",
        "Initiate FDA pre-submission meetings for regulatory pathway"
      ],
      hybridOpportunities: [
        "Combine with quantum computing research for accelerated molecular simulations",
        "Integrate with neural interface technology for direct brain-controlled drug design",
        "Synergy with climate modeling AI for environmental impact prediction of new drugs"
      ]
    }
  },
  {
    id: "quantum-climate",
    title: "Quantum Computing Framework for Real-Time Climate Modeling",
    field: "Climate Technology",
    author: "Prof. Michael Rodriguez",
    institution: "MIT",
    publishedDate: "2024-02-28",
    tags: ["Quantum Computing", "Climate Science", "Weather Prediction", "Environmental"],
    abstract: "This research introduces a quantum computing framework that enables real-time climate modeling with unprecedented accuracy. By leveraging quantum superposition and entanglement, our system processes complex atmospheric data 1000x faster than classical computers, providing climate predictions with 99.2% accuracy up to 30 days in advance. The technology addresses the fundamental market failure in current climate modeling - the inability to process vast amounts of environmental data in real-time for actionable insights. Early applications show potential for revolutionizing weather prediction, disaster preparedness, and agricultural planning.",
    analysisResult: {
      marketAnalysis: {
        score: 88,
        summary: "Climate technology market is exploding with $1.8 trillion in annual climate investments. Real-time modeling addresses critical gaps in disaster preparedness and agricultural optimization.",
        marketSize: "$25 billion climate modeling and prediction market by 2028, growing at 22% CAGR",
        competition: "Limited direct competition in quantum climate modeling. Traditional players like IBM Weather and AccuWeather lack quantum capabilities",
        trends: [
          "Increasing climate disasters driving demand for better prediction",
          "Government investments in quantum computing infrastructure",
          "Insurance industry seeking better risk assessment tools"
        ]
      },
      technicalFeasibility: {
        score: 65,
        summary: "Cutting-edge quantum technology with proven concept but faces hardware limitations. Requires access to advanced quantum computers for full implementation.",
        complexity: "Very High - requires quantum computing expertise, climate science knowledge, and specialized hardware access",
        timeToMarket: "3-5 years for commercial deployment, dependent on quantum hardware availability",
        risks: [
          "Limited availability of fault-tolerant quantum computers",
          "Quantum decoherence affecting long-term calculations",
          "High dependency on quantum hardware providers"
        ]
      },
      commercialPotential: {
        score: 84,
        summary: "Multiple high-value applications across insurance, agriculture, and government sectors. Potential for platform licensing and data-as-a-service models.",
        revenueModel: "Enterprise SaaS ($100K-2M annually), government contracts, data licensing to insurance/agriculture sectors",
        scalability: "Framework applicable to various environmental modeling challenges beyond climate prediction",
        barriers: [
          "High quantum computing infrastructure costs",
          "Need for specialized quantum talent",
          "Regulatory requirements for weather prediction services"
        ]
      },
      teamAndExecution: {
        score: 48,
        summary: "World-class quantum and climate expertise but limited commercial experience. Strong academic credentials need significant business development support.",
        expertise: "Leading quantum computing and climate science researchers. Missing commercial software development and sales expertise",
        resources: "$15-25M funding needed, partnerships with quantum hardware providers, government research grants",
        recommendations: [
          "Partner with quantum computing companies (IBM, Google, IonQ)",
          "Recruit commercial software development team",
          "Establish government and enterprise pilot programs"
        ]
      },
      overallScore: 71,
      investmentRecommendation: "BUY",
      keyInsights: [
        "Creates entirely new market for quantum-powered environmental modeling",
        "Potential nucleus for quantum computing applications in climate science",
        "Addresses critical market failure in real-time climate prediction accuracy",
        "First-mover advantage in quantum climate modeling space"
      ],
      nextSteps: [
        "Secure Series A funding ($20M) for quantum hardware access",
        "Establish partnerships with quantum computing providers",
        "Launch pilot programs with NOAA and European weather services",
        "Develop commercial software platform for enterprise deployment"
      ],
      hybridOpportunities: [
        "Integration with AI drug discovery for climate-aware pharmaceutical development",
        "Combine with neural interfaces for environmental monitoring through brain-computer systems",
        "Synergy with space technology for satellite-based quantum climate sensors"
      ]
    }
  },
  {
    id: "neural-interface",
    title: "Non-Invasive Neural Interface for Paralysis Recovery",
    field: "Medical Technology",
    author: "Dr. Lisa Park",
    institution: "Johns Hopkins University",
    publishedDate: "2024-01-20",
    tags: ["Neurotechnology", "Medical Devices", "Brain-Computer Interface", "Rehabilitation"],
    abstract: "We have developed a breakthrough non-invasive neural interface that enables paralyzed patients to control external devices through thought alone. Using advanced EEG signal processing and machine learning, our system achieves 96% accuracy in translating neural signals to device commands. Clinical trials with 50 patients showed significant improvement in quality of life and independence. This technology addresses the massive market failure in current paralysis treatment - the lack of effective solutions for restoring motor function. The device represents a paradigm shift from invasive brain implants to safe, accessible neural interfaces.",
    analysisResult: {
      marketAnalysis: {
        score: 91,
        summary: "Massive unmet medical need with 5.4 million Americans living with paralysis. Medical device market for neurological conditions exceeds $8 billion annually.",
        marketSize: "$12 billion brain-computer interface market by 2030, growing at 15% CAGR from current $2.4 billion",
        competition: "Competing with Neuralink, Synchron, and Blackrock Neurotech, but non-invasive approach provides safety advantage",
        trends: [
          "Aging population increasing neurological conditions",
          "FDA fast-track approvals for breakthrough medical devices",
          "Insurance coverage expanding for assistive technologies"
        ]
      },
      technicalFeasibility: {
        score: 83,
        summary: "Proven clinical results with 96% accuracy. Non-invasive approach reduces regulatory hurdles compared to implantable devices.",
        complexity: "High - requires neuroscience expertise, signal processing, and medical device development experience",
        timeToMarket: "2-3 years for FDA approval and commercial launch",
        risks: [
          "FDA approval timeline uncertainty",
          "Signal quality limitations of non-invasive approach",
          "Competition from invasive solutions with higher performance"
        ]
      },
      commercialPotential: {
        score: 87,
        summary: "Clear path to commercialization through medical device channels. Strong reimbursement potential given significant patient benefit and cost savings.",
        revenueModel: "Medical device sales ($50K-100K per unit), recurring software subscriptions, training and support services",
        scalability: "Technology platform applicable to multiple neurological conditions beyond paralysis",
        barriers: [
          "FDA regulatory approval requirements",
          "Insurance reimbursement negotiations",
          "Need for clinical evidence and physician adoption"
        ]
      },
      teamAndExecution: {
        score: 55,
        summary: "Strong clinical and technical team with proven results but lacks experienced medical device commercialization leadership.",
        expertise: "World-class neuroscience and engineering team. Clinical validation completed. Missing medical device commercialization experience",
        resources: "$10-15M for FDA approval process, manufacturing setup, and commercial launch",
        recommendations: [
          "Recruit experienced medical device CEO with FDA experience",
          "Establish manufacturing partnerships for scalable production",
          "Build clinical affairs team for post-market studies"
        ]
      },
      overallScore: 79,
      investmentRecommendation: "STRONG BUY",
      keyInsights: [
        "Creates new treatment paradigm for paralysis and neurological conditions",
        "Serves as platform technology for broader neural interface ecosystem",
        "Addresses fundamental market failure in paralysis treatment options",
        "Non-invasive approach provides significant safety and accessibility advantages"
      ],
      nextSteps: [
        "Complete Series B funding ($15M) for FDA submission",
        "Submit FDA 510(k) application within 6 months",
        "Establish manufacturing and quality systems",
        "Initiate reimbursement discussions with major insurers"
      ],
      hybridOpportunities: [
        "Integration with AI drug discovery for personalized neurological treatments",
        "Combine with quantum computing for real-time neural signal processing",
        "Synergy with climate tech for environmental health monitoring in rehabilitation"
      ]
    }
  }
];