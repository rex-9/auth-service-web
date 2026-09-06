// src/modules/landing/types.ts
export interface ISocialProfile {
  platform: string;
  username: string;
  link: string;
  iconSrc: string;
}

export interface ISkillItem {
  name: string;
  url: string;
}

export interface IProjectItem {
  id: number;
  name: string;
  image: string;
  techs: string[];
  details: string[];
  live: string | null;
  source: string | null;
}

export interface ITestimonialItem {
  name: string;
  link: string;
  recommendation: string;
  isAi?: boolean;
  rating?: string;
  ratingLink?: string;
}
