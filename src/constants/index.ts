import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { Rss } from "lucide-react";

export const NAV_LIST = [
  { label: "Blog", path: "/blog", icon: Rss },
];

export const SOCIALS = [
  { label: "Github", path: siteConfig.social.github, icon: Icons.github },
  { label: "Facebook", path: siteConfig.social.facebook, icon: Icons.facebook },
  { label: "Twitter", path: siteConfig.social.twitter, icon: Icons.x },
];
