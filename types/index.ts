export interface BenefitItem {
  icon: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  accent?: boolean;
}

export interface TestimonialItem {
  quote: string;
  name?: string;
  role?: string;
}

export interface TrustCardItem {
  icon: string;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}

export interface NavLink {
  label: string;
  href: string;
}
