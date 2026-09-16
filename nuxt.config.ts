// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/icon",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "nuxt-lucide-icons",
  ],
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            primary: "#3b82f6",
            dark: "#0f172a",
          },
          animation: {
            "fade-in": "fadeIn 0.3s ease-in-out",
            "bounce-in": "bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
            "pulse-ring": "pulseRing 1.5s infinite",
          },
          keyframes: {
            fadeIn: {
              "0%": { opacity: "0", transform: "translateY(10px)" },
              "100%": { opacity: "1", transform: "translateY(0)" },
            },
            bounceIn: {
              "0%": { transform: "scale(0.9)", opacity: "0" },
              "100%": { transform: "scale(1)", opacity: "1" },
            },
            pulseRing: {
              "0%": { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.7)" },
              "70%": { boxShadow: "0 0 0 15px rgba(59, 130, 246, 0)" },
              "100%": { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)" },
            },
          },
        },
      },
    },
  },
});
