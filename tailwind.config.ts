import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#c4122f",
      },
      keyframes: {
        moveImage: {
          "0%, 100%": { transform: "translateX(0) translateY(0)" },
          "25%": { transform: "translateX(-25vw) translateY(15vh)" },
          "50%": { transform: "translateX(-50vw) translateY(-30vh)" },
          "75%": { transform: "translateX(-75vw) translateY(15vh)" },
        },
        recPulse: {
          "0%": { boxShadow: "0px 0px 5px 0px rgba(173,0,0,.3)" },
          "65%": { boxShadow: "0px 0px 5px 13px rgba(173,0,0,.3)" },
          "90%": { boxShadow: "0px 0px 5px 13px rgba(173,0,0,0)" },
        },

        slideRed: {
          "0%": {
            left: "20%",
          },
          "25%": {
            left: "50%",
          },
          "50%": {
            left: "85%",
          },
          "100%": {
            left: "20%",
          },
        },

        slideBlue: {
          "0%": {
            right: "10%",
          },
          "50%": {
            right: "60%",
          },
          "100%": {
            right: "10%",
          },
        },
      },
      animation: {
        moveImage: "moveImage 5s ease-in-out infinite",
        recPulse: "recPulse 1.5s linear infinite",
        redBall: "slideRed 3s linear infinite",
        blueBall: "slideBlue 3s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
