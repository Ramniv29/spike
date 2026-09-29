import { Great_Vibes, Playfair_Display } from "next/font/google";
import "./globals.css";
import Background from "@/components/3d/Background";

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-great-vibes",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata = {
  title: "Strike | Vintage To-Do",
  description: "A productivity app for managing tasks with an interactive 3D aesthetic.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${greatVibes.variable} ${playfairDisplay.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#121212] text-[#f4f4f5] selection:bg-[#3f3f46]">
        <div className="z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
