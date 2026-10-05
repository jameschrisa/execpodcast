import { InstagramLogoIcon, TiktokLogoIcon, YoutubeLogoIcon } from "@phosphor-icons/react/ssr";
import type { PlatformId } from "@/content/show";

export function PlatformIcon({ platform, size = 20, className }: { platform: PlatformId; size?: number; className?: string }) {
  const props = { size, weight: "fill" as const, className, "aria-hidden": true };
  if (platform === "instagram") return <InstagramLogoIcon {...props} />;
  if (platform === "tiktok") return <TiktokLogoIcon {...props} />;
  return <YoutubeLogoIcon {...props} />;
}
