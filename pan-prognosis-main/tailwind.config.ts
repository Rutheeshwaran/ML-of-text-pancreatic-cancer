import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        clinical: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Primary Medical Colors
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "hsl(var(--primary-light))",
          glow: "hsl(var(--primary-glow))",
        },
        
        // Secondary Medical Colors
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          light: "hsl(var(--secondary-light))",
          bg: "hsl(var(--secondary-bg))",
        },
        
        // Alert & Status Colors
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        
        // Utility Colors
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        
        // Card System
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          elevated: "hsl(var(--card-elevated))",
        },
        
        // Interactive Elements
        interactive: {
          DEFAULT: "hsl(var(--interactive))",
          hover: "hsl(var(--interactive-hover))",
          active: "hsl(var(--interactive-active))",
        },
        
        // Enhanced Risk Assessment Colors
        risk: {
          low: "hsl(var(--risk-low))",
          "low-bg": "hsl(var(--risk-low-bg))",
          "low-border": "hsl(var(--risk-low-border))",
          moderate: "hsl(var(--risk-moderate))",
          "moderate-bg": "hsl(var(--risk-moderate-bg))",
          "moderate-border": "hsl(var(--risk-moderate-border))",
          high: "hsl(var(--risk-high))",
          "high-bg": "hsl(var(--risk-high-bg))",
          "high-border": "hsl(var(--risk-high-border))",
        },
        
        // Clinical Teal Palette
        teal: {
          50: "hsl(180 100% 97%)",
          100: "hsl(180 100% 94%)",
          200: "hsl(180 100% 87%)",
          300: "hsl(180 100% 76%)",
          400: "hsl(180 100% 60%)",
          500: "hsl(180 100% 25%)", // Primary teal
          600: "hsl(180 100% 20%)",
          700: "hsl(180 100% 15%)",
          800: "hsl(180 100% 10%)",
          900: "hsl(180 100% 5%)",
        },
        
        // Medical Blue Palette  
        "medical-blue": {
          50: "hsl(207 90% 97%)",
          100: "hsl(207 90% 94%)",
          200: "hsl(207 90% 87%)",
          300: "hsl(207 90% 76%)",
          400: "hsl(207 90% 64%)",
          500: "hsl(207 90% 54%)", // Medical blue
          600: "hsl(207 90% 44%)",
          700: "hsl(207 90% 34%)",
          800: "hsl(207 90% 24%)",
          900: "hsl(207 90% 14%)",
        },

        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
