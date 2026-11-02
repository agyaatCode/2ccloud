import { ContentPage, contentMeta } from "@/components/ContentPage";

export const generateMetadata = () => contentMeta("about", "About Us", "About Cirrostratus Services Pvt. Ltd. (2CCloud): engineers who design, secure and operate cloud and server infrastructure.");
export default function Page() {
  return <ContentPage slug="about" title="About Us" />;
}
