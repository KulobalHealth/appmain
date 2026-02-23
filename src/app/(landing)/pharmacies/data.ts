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

interface Category {
  id: string;
  name: string;
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
    id: "signup",
    number: "01",
    title: "Sign Up/Login",
    description:
      "Create your pharmacy account and get verified to access our marketplace.",
  },
  {
    id: "browse",
    number: "02",
    title: "Browse Marketplace",
    description:
      "Search and filter products by category, price, manufacturer, and brand.",
  },
  {
    id: "checkout",
    number: "03",
    title: "Add to Cart & Checkout",
    description:
      "Select your products and proceed to our secure checkout process.",
  },
  {
    id: "payment",
    number: "04",
    title: "Secure Payment",
    description: "Complete payment using our secure payment gateway options.",
  },
  {
    id: "track",
    number: "05",
    title: "Track Your Order",
    description:
      "Monitor your order status and delivery progress in real-time.",
  },
  {
    id: "delivery",
    number: "06",
    title: "Receive Delivery",
    description:
      "Get your products delivered within 48 hours to your pharmacy.",
  },
];

export const benefits: Benefit[] = [
  {
    id: "product-range",
    title: "Comprehensive Product Range",
    description:
      "Access to rapid test kits, medical devices, first aid supplies, and pharmaceutical consumables",
  },
  {
    id: "pricing",
    title: "Competitive & Transparent Pricing",
    description:
      "Compare prices across multiple suppliers and get the best deals",
  },
  {
    id: "convenience",
    title: "Time-Saving & Convenient",
    description: "Single point of contact for all your procurement needs",
  },
  {
    id: "delivery",
    title: "Reliable & Fast Delivery",
    description: "Guaranteed delivery within 48 hours across Ghana",
  },
  {
    id: "quality",
    title: "Quality Assurance",
    description:
      "All suppliers are verified and products meet quality standards",
  },
  {
    id: "ai",
    title: "Future AI Recommendations",
    description:
      "Personalized product suggestions based on your ordering history",
  },
];

export const categories: Category[] = [
  {
    id: "test-kits",
    name: "Rapid Test Kits",
    description: "COVID-19, Malaria, HIV, and more",
  },
  {
    id: "medical-devices",
    name: "Medical Devices",
    description: "BP monitors, thermometers, glucose meters",
  },
  {
    id: "first-aid",
    name: "First Aid Supplies",
    description: "Bandages, antiseptics, emergency kits",
  },
  {
    id: "consumables",
    name: "Pharmaceutical Consumables",
    description: "Syringes, gloves, medical supplies",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    name: "Dr. Sarah Mensah",
    role: "Pharmacy Owner",
    company: "HealthCare Plus Pharmacy, Accra",
    content:
      "Kulobal Health has transformed how we manage our inventory. The AI recommendations have helped us reduce stockouts by 80% while optimizing our costs.",
    rating: 5,
  },
  {
    id: "testimonial-2",
    name: "Agnes Boateng",
    role: "Pharmacist",
    company: "Community Health Pharmacy, Kumasi",
    content:
      "The 48-hour delivery promise is real! Our customers are happier, and we can focus more on patient care rather than chasing suppliers.",
    rating: 5,
  },
];
