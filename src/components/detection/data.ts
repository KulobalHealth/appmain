import {
  TrendingDown,
  Zap,
  Facebook,
  Instagram,
  Twitter,
  Wifi,
  Smartphone,
  DollarSign,
  Shield,
  Check,
} from "lucide-react";

export const results = [
  {
    icon: TrendingDown,
    value: "26% drop",
    description: "in adverse-event reports across pilot pharmacies*",
    color: "text-[#03C486]",
  },
  {
    icon: Zap,
    value: "2x faster",
    description: "dispensing workflow*",
    color: "text-[#0EA5E9]",
  },
];

export const features = [
  {
    feature: "Instant interaction screen",
    benefit:
      "POST a medication list and get severity-ranked warnings in <300 ms.",
  },
  {
    feature: "African-tuned knowledge base",
    benefit:
      "Model trained on Ghana NPDIC, EAC, WHO, and local formularies—no Western-only blind spots.",
  },
  {
    feature: "Plain-language explanations",
    benefit:
      "Return includes human-readable risk, mechanism, and next-best alternative.",
  },
  {
    feature: "Allergy & contra-indicator guardrails",
    benefit:
      "Flags patient-specific issues (age, pregnancy, renal function) when you include context fields.",
  },
  {
    feature: "Counterfeit cross-check",
    benefit:
      "Optional barcode endpoint verifies batch & FDA numbers in the same call.",
  },
];

export const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

export const integrationSteps = [
  {
    number: 1,
    title: "Sign up",
    description: "Get your sandbox key in seconds.",
    bgColor: "bg-primary-50",
    textColor: "text-primary-600",
  },
  {
    number: 2,
    title: "Call the API",
    description:
      "Call the /check endpoint from any stack (cURL, Python, Node, PHP).",
    bgColor: "bg-primary-50",
    textColor: "text-primary-600",
  },
  {
    number: 3,
    title: "Render results",
    description:
      "Render the JSON results inside your dispensing UI or mobile app.",
    bgColor: "bg-primary-50",
    textColor: "text-primary-600",
  },
];

export const requestData = [
  "POST /v1/check",
  "{",
  '  "patient": {',
  '    "age": 45,',
  '    "weight": 72,',
  '    "renal_status": "CKD-3",',
  '    "allergies": ["penicillin"]',
  "  },",
  '  "drugs": [',
  '    {"code": "ATC:C01AA05", "name": "Paracetamol"},',
  '    {"code": "ATC:J01CA04", "name": "Amoxicillin"}',
  "  ]",
  "}",
];

export const responseData = [
  "{",
  '  "summary": "Moderate interaction",',
  '  "alerts": [',
  "    {",
  '      "severity": "moderate",',
  '      "pair": ["paracetamol", "Amoxicillin"],',
  '      "mechanism": "Competitive glucuronidation",',
  '      "recommendation": "Monitor liver enzymes; reduce dose"',
  "    }",
  "  ]",
  "}",
];

export const africanRealities = [
  {
    icon: Wifi,
    title: "Works offline first",
    description:
      "Bundle the Lite dataset for remote clinics, sync when back online.",
    color: "text-[#03C486]",
  },
  {
    icon: Smartphone,
    title: "5G-friendly",
    description: "Compressed responses average 5 KB.",
    color: "text-[#0EA5E9]",
  },
  {
    icon: DollarSign,
    title: "Flexible pricing",
    description: "Plans that scale with your needs.",
    color: "text-[#8B5CF6]",
  },
];

export const pricingPlans = [
  {
    title: "Starter",
    description: "Perfect for small clinics",
    price: "Free",
    priceColor: "text-[#03C486]",
    buttonText: "Get Started",
    buttonClass: "bg-[#03C486] hover:bg-[#02b377]",
    isPopular: false,
  },
  {
    title: "Growth",
    description: "For expanding pharmacies",
    price: "$29",
    priceColor: "text-[#0EA5E9]",
    buttonText: "Choose Growth",
    buttonClass: "bg-[#0EA5E9] hover:bg-[#0284c7]",
    isPopular: true,
  },
  {
    title: "Enterprise",
    description: "Custom solutions",
    price: "Custom",
    priceColor: "text-[#8B5CF6]",
    buttonText: "Contact Sales",
    buttonClass: "",
    isPopular: false,
  },
];

export const securityFeatures = [
  { icon: Shield, text: "End-to-end TLS 1.3" },
  { icon: Check, text: "AES-256 at rest" },
  { icon: Shield, text: "GDPR/HIPAA-aligned data handling" },
  { icon: Check, text: "Ghana FDA cyber-security guidelines compliant" },
  { icon: Shield, text: "Registered with Data Protection Agency" },
];
