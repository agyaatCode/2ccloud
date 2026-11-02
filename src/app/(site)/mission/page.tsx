import { ContentPage, contentMeta } from "@/components/ContentPage";

export const generateMetadata = () => contentMeta("mission", "Our Mission", "Our mission: deliver reliable, secure technology services through engineering skill and clear communication.");
export default function Page() {
  return <ContentPage slug="mission" title="Mission" />;
}
