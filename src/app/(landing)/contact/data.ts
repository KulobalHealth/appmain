import {
  LucideIcon,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Users,
} from "lucide-react";

interface ContactMethod {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  details: string[];
}

interface InquiryType {
  id: string;
  value: string;
  label: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQSection {
  id: string;
  title: string;
  faqs: FAQ[];
}

export const contactMethods: ContactMethod[] = [
  {
    id: "email",
    icon: Mail,
    title: "Email Us",
    description: "Send us an email and we'll respond within 24 hours",
    details: ["Emmanuel.devi@kulobalhealth.com"],
  },
  {
    id: "phone",
    icon: Phone,
    title: "Call Us",
    description: "Speak directly with our support team",
    details: ["+233 25 678 0758", "Mon-Fri: 8:00 AM - 6:00 PM"],
  },
  {
    id: "visit",
    icon: MapPin,
    title: "Visit Us",
    description: "Come visit our office at Wangara Green Venture",
    details: ["Wangara Green Ventures", "Accra, Ghana"],
  },
];

export const inquiryTypes: InquiryType[] = [
  { id: "general", value: "general", label: "General Inquiry" },
  { id: "pharmacy", value: "pharmacy", label: "Pharmacy Partnership" },
  { id: "supplier", value: "supplier", label: "Supplier Partnership" },
  { id: "technical", value: "technical", label: "Technical Support" },
  { id: "billing", value: "billing", label: "Billing & Payments" },
  { id: "other", value: "other", label: "Other" },
];

export const contactInfo = {
  id: "contact-info",
  items: [
    {
      id: "response-time",
      icon: Clock,
      title: "Response Time",
      description: "We typically respond within 24 hours during business days",
    },
    {
      id: "tech-support",
      icon: MessageSquare,
      title: "Technical Support",
      description:
        "For urgent technical issues, please call our support hotline",
    },
    {
      id: "partnerships",
      icon: Users,
      title: "Partnership Inquiries",
      description:
        "Our partnership team will connect with you to discuss opportunities",
    },
  ],
};

export const faqSections: FAQSection[] = [
  {
    id: "pharmacies",
    title: "For Pharmacies",
    faqs: [
      {
        id: "pharmacy-account",
        question: "How do I create a pharmacy account?",
        answer:
          'Visit our signup page and select "Pharmacy" account type. You\'ll need to provide your pharmacy license and verification documents.',
      },
      {
        id: "min-order",
        question: "What is the minimum order amount?",
        answer:
          "There's no minimum order amount. However, orders above GHS 500 qualify for free delivery.",
      },
      {
        id: "delivery",
        question: "How does the 48-hour delivery work?",
        answer:
          "Orders placed before 2 PM are processed the same day and delivered within 48 hours to major cities in Ghana.",
      },
    ],
  },
  {
    id: "suppliers",
    title: "For Suppliers",
    faqs: [
      {
        id: "supplier-verification",
        question: "How do I become a verified supplier?",
        answer:
          "Submit your company registration, product licenses, and quality certifications. Our team will review and verify your application within 5-7 business days.",
      },
      {
        id: "commission",
        question: "What commission does Kulobal Health charge?",
        answer:
          "Our commission structure varies by product category and volume. Contact our partnership team for detailed pricing information.",
      },
      {
        id: "payments",
        question: "When do I receive payments?",
        answer:
          "Payments are processed weekly for completed orders. You'll receive payment within 7 days of successful delivery confirmation.",
      },
    ],
  },
];
