import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#123A63",
        accent: "#2E7D84",
        background: "#F4F6F8",
        surface: "#FFFFFF",
        neutral: "#6B7280"
      },
      borderRadius: {
        xl: "12px"
      },
      boxShadow: {
        soft: "0 8px 24px rgba(15, 23, 42, 0.06)"
      },
      fontSize: {
        page: ["24px", { lineHeight: "32px", fontWeight: "600" }],
        section: ["18px", { lineHeight: "28px", fontWeight: "500" }],
        body: ["14px", { lineHeight: "22px", fontWeight: "400" }]
      }
    }
  },
  plugins: []
};

export default config;
