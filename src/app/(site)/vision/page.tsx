import { ContentPage, contentMeta } from "@/components/ContentPage";

export const generateMetadata = () => contentMeta("vision", "Our Vision", "Our vision for dependable, secure infrastructure that every business can rely on.");
export default function Page() {
  return <ContentPage slug="vision" title="Vision" />;
}
