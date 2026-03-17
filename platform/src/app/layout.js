import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata = {
  title: "EVOLVE | Circular Plastic Economy on Hedera",
  description: "Diverting waste, empowering informal collectors, and verifying recycling through Hedera HCS and HTS.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`font-sans bg-slate-50 min-h-screen flex`}>
        <Navigation />
        <main className="flex-1 overflow-y-auto h-screen">
          <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
