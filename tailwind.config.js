/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brandBlue: "#103A7E",     // deep blue
        brandBlueLight: "#E9F1FF",// light tint for backgrounds
        brandYellow: "#FFD200",   // CTA yellow
        ink: "#0F172A"            // slate-900-ish
      },
      boxShadow: {
        card: "0 8px 30px rgba(16,58,126,0.08)",
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    },
  },
  plugins: [],
};
