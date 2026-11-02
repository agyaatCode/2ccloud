import type { Hero } from "@/lib/data";

export const baseHero = (over: Partial<Hero>): Hero => ({
  eyebrow: "", title: "", description: "", primaryText: "", primaryUrl: "", secondaryText: "", secondaryUrl: "",
  type: "image", imageUrl: "", mobileImageUrl: "", videoUrl: "", posterUrl: "",
  overlayColor: "#0A1F44", overlayOpacity: 80, align: "left", height: 540,
  posDesktop: "center center", posMobile: "center center", animate: true, parallax: true,
  ...over,
});
