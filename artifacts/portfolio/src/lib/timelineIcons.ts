import {
  Code2, Figma, Video, Bot, Star,
  GraduationCap, Sparkles, Rocket,
  Briefcase, Globe, Zap, Award, Trophy,
  Flame, Heart, Terminal, Users, Lightbulb,
  Camera, Laptop2, Package,
} from "lucide-react";

export const TIMELINE_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  Code2, Figma, Video, Bot, Star,
  GraduationCap, Sparkles, Rocket,
  Briefcase, Globe, Zap, Award, Trophy,
  Flame, Heart, Terminal, Users, Lightbulb,
  Camera, Laptop2, Package,
};

export const TIMELINE_ICON_NAMES = Object.keys(TIMELINE_ICON_MAP);
