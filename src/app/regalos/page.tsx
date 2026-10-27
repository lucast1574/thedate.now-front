import GiftCodeEntry from "@/features/gifts/gift-code-entry";
import { giftMetadata } from "@/lib/products/metadata";
export const generateMetadata = () => giftMetadata();
export default function Page() {
  return <GiftCodeEntry />;
}
