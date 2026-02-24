// ============================================================================
// TELEGRAM WEBAPP INTEGRATION
// ============================================================================
// This file provides utilities for integrating with Telegram WebApp.
// 
// To use Telegram authentication:
// 1. Include the Telegram WebApp script in index.html:
//    <script src="https://telegram.org/js/telegram-web-app.js"></script>
//
// 2. The Telegram WebApp will automatically inject user data when the app
//    is opened from Telegram.
//
// 3. For production, validate initData on your backend using the bot token
//    to ensure the request is authentic.
//
// For demo/public access, these functions will return null when not running
// inside Telegram, and the app will use mock data instead.
// ============================================================================

import type { ThemeParams, WebAppUser } from "telegram-web-app";

/**
 * Get the current Telegram user from WebApp initData.
 * Returns null if not running inside Telegram WebApp.
 */
export function getTelegramUser(): WebAppUser | null {
  if (window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp.initDataUnsafe.user || null;
  }
  return null;
}

/**
 * Get the current Telegram theme parameters.
 * Returns null if not running inside Telegram WebApp.
 */
export function getTelegramTheme(): ThemeParams | null {
  if (window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp.themeParams;
  }
  return null;
}

/**
 * Get the current Telegram color scheme (light/dark).
 * Returns null if not running inside Telegram WebApp.
 */
export function getTelegramColorScheme(): "light" | "dark" | null {
  if (window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp.colorScheme;
  }
  return null;
}

export type { ThemeParams as TelegramTheme, WebAppUser as TelegramUser };
