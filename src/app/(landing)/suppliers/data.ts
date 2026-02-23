import { Upload, Package, BarChart3 } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface Step {
  id: string;
  number: string;
  title: string;
  description: string;
}

interface Benefit {
  id: string;
  title: string;
  description: string;
}

interface Feature {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

export const steps: Step[] = [
  {
    id: "register",
    number: "01",
    title: "Register Your Company & Verification",
    description:
      "Sign up your company and complete our verification process to ensure quality standards.",
  },
  {
    id: "inventory",
    number: "02",
    title: "Upload & Manage Your Inventory",
    description:
      "Use our easy-to-use interface to upload and manage your product inventory.",
  },
  {
    id: "orders",
    number: "03",
    title: "Receive Orders Directly",
    description: "Get notified when pharmacies place orders for your products.",
  },
  {
    id: "fulfill",
    number: "04",
    title: "Fulfill Orders",
    description:
      "Prepare orders for Kulobal Health pickup and delivery coordination.",
  },
  {
    id: "analytics",
    number: "05",
    title: "Access Sales Data & AI Insights",
    description:
      "View detailed analytics and AI-powered insights about your sales performance.",
  },
  {
    id: "payment",
    number: "06",
    title: "Prompt Payment",
    description:
      "Receive secure and timely payments for all your completed orders.",
  },
];

export const benefits: Benefit[] = [
  {
    id: "market-access",
    title: "Expanded Market Access",
    description: "Connect with hundreds of pharmacies across Ghana and beyond",
  },
  {
    id: "inventory-management",
    title: "Efficient Inventory Management",
    description: "Centralized platform to manage all your products",
  },
  {
    id: "reduced-overhead",
    title: "Reduced Sales & Marketing Overhead",
    description: "Lower costs with our built-in marketing reach",
  },
  {
    id: "ai-insights",
    title: "AI-Powered Purchasing Insights",
    description: "Understand demand trends and pharmacy purchasing patterns",
  },
  {
    id: "secure-platform",
    title: "Secure & Reliable Platform",
    description: "Trust in our secure payment and order management system",
  },
  {
    id: "prompt-payment",
    title: "Prompt Payment Cycles",
    description: "Get paid faster with our streamlined payment processing",
  },
];

export const features: Feature[] = [
  {
    id: "inventory-upload",
    icon: Upload,
    title: "Easy Inventory Upload",
    description:
      "Bulk upload options and future API integration for seamless inventory management.",
  },
  {
    id: "order-management",
    icon: Package,
    title: "Order Management Dashboard",
    description:
      "Track all your orders, manage fulfillment, and monitor delivery status.",
  },
  {
    id: "reporting",
    icon: BarChart3,
    title: "Reporting & Analytics",
    description:
      "Access detailed sales reports and AI insights visualization tools.",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    name: "Michael Osei",
    role: "Supply Chain Manager",
    company: "MedSupply Ghana",
    content:
      "As a supplier, this platform has expanded our reach significantly. We've connected with over 200 new pharmacies in just 6 months through Kulobal Health.",
    rating: 5,
  },
  {
    id: "testimonial-2",
    name: "Kwame Asante",
    role: "Sales Director",
    company: "PharmaCare Supplies",
    content:
      "The AI insights have helped us understand market demand better. We've optimized our inventory and increased sales by 40% since joining.",
    rating: 5,
  },
];
