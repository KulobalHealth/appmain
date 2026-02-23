import { Heart, Shield, Lightbulb, Users, type LucideIcon } from "lucide-react";

interface Value {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
}

interface Reason {
  id: string;
  title: string;
  description: string;
}

export const values: Value[] = [
  {
    id: "patient-centered",
    icon: Heart,
    title: "Patient-Centered Care",
    description:
      "Everything we do is focused on improving patient outcomes and healthcare accessibility.",
  },
  {
    id: "quality-safety",
    icon: Shield,
    title: "Quality & Safety",
    description:
      "We maintain the highest standards for product quality and platform security.",
  },
  {
    id: "innovation",
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We leverage cutting-edge AI technology to solve complex supply chain challenges.",
  },
  {
    id: "partnership",
    icon: Users,
    title: "Partnership",
    description:
      "We believe in building strong relationships with pharmacies and suppliers.",
  },
];

export const challenges: Challenge[] = [
  {
    id: "fragmented-networks",
    title: "Fragmented Supply Networks",
    description: "Pharmacies struggle to find reliable suppliers",
  },
  {
    id: "product-availability",
    title: "Inconsistent Product Availability",
    description: "Critical medicines and supplies are often out of stock",
  },
  {
    id: "inefficient-procurement",
    title: "Inefficient Procurement",
    description: "Time-consuming processes with multiple suppliers",
  },
  {
    id: "market-visibility",
    title: "Limited Market Visibility",
    description: "Suppliers can't easily reach new pharmacy customers",
  },
  {
    id: "inventory-management",
    title: "Poor Inventory Management",
    description: "Lack of data-driven insights for better planning",
  },
];

export const whyChooseUs: Reason[] = [
  {
    id: "track-record",
    title: "Proven Track Record",
    description:
      "Successfully connecting pharmacies and suppliers across Ghana",
  },
  {
    id: "ai-technology",
    title: "AI-Powered Technology",
    description:
      "Advanced algorithms for better inventory management and insights",
  },
  {
    id: "delivery-network",
    title: "Reliable Delivery Network",
    description: "Consistent 48-hour delivery commitment",
  },
  {
    id: "quality-assurance",
    title: "Quality Assurance",
    description: "Rigorous supplier verification and product quality standards",
  },
  {
    id: "customer-support",
    title: "Customer Support",
    description: "Dedicated support team for pharmacies and suppliers",
  },
  {
    id: "transparent-pricing",
    title: "Transparent Pricing",
    description: "No hidden fees, competitive and fair pricing for all",
  },
];
