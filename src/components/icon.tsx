import { Icon as IconifyIcon, type IconProps } from "@iconify/react/offline";
import icons from "virtual:iconify-icons";

export function Icon({ icon, ...props }: IconProps) {
  const resolved = typeof icon === "string" ? (icons[icon] ?? icon) : icon;
  return <IconifyIcon icon={resolved} {...props} />;
}
