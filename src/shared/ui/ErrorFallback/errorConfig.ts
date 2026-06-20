import { m } from "@generated/paraglide/messages";
import {
  CircleAlert,
  LockKeyhole,
  type LucideIcon,
  ServerCrash,
  ShieldBan,
  Wifi,
} from "lucide-react";

export enum ErrorCategory {
  AUTH = "AUTH",
  ACCESS = "ACCESS",
  NETWORK = "NETWORK",
  SERVER = "SERVER",
  AUTH_CONFIG = "AUTH_CONFIG",
  UNKNOWN = "UNKNOWN",
}

export interface ErrorConfig {
  icon: LucideIcon;
  style: { wrapper: string; icon: string; ring: string };
  getTitle: () => string;
  getDesc: () => string;
  animate?: boolean;
}

export const ERROR_CONFIG: Record<ErrorCategory, ErrorConfig> = {
  [ErrorCategory.AUTH]: {
    icon: LockKeyhole,
    style: {
      wrapper: "bg-warning/10",
      icon: "text-warning",
      ring: "ring-warning",
    },
    getTitle: () => m.error_auth_required(),
    getDesc: () => m.error_auth_desc(),
  },
  [ErrorCategory.AUTH_CONFIG]: {
    icon: ShieldBan,
    style: {
      wrapper: "bg-error/10",
      icon: "text-error",
      ring: "ring-error",
    },
    getTitle: () => m.error_auth_config(),
    getDesc: () => m.error_auth_config_desc(),
  },
  [ErrorCategory.ACCESS]: {
    icon: ShieldBan,
    style: {
      wrapper: "bg-error/10",
      icon: "text-error",
      ring: "ring-error",
    },
    getTitle: () => m.error_access_denied(),
    getDesc: () => m.error_access_desc(),
  },
  [ErrorCategory.NETWORK]: {
    icon: Wifi,
    style: {
      wrapper: "bg-info/10",
      icon: "text-info",
      ring: "ring-info",
    },
    getTitle: () => m.error_network(),
    getDesc: () => m.error_network_desc(),
    animate: true,
  },
  [ErrorCategory.SERVER]: {
    icon: ServerCrash,
    style: {
      wrapper: "bg-error/10",
      icon: "text-error",
      ring: "ring-error",
    },
    getTitle: () => m.error_server(),
    getDesc: () => m.error_server_desc(),
  },
  [ErrorCategory.UNKNOWN]: {
    icon: CircleAlert,
    style: {
      wrapper: "bg-base-200",
      icon: "text-base-content/70",
      ring: "ring-base-300",
    },
    getTitle: () => m.error_unexpected(),
    getDesc: () => m.error_unexpected_desc(),
  },
};

export const ERROR_REGEX = /\b(401|403|404|500|502|503)\b/;

export const AUTH_CONFIG_KEYWORDS = [
  "oidc-config",
  "oidc configuration",
  "discovery",
  ".well-known/openid-configuration",
  "signin_response error",
  "silent renew",
  "authority",
  "client_id",
];
