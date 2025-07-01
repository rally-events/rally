import "./globals.css"
import localFont from "next/font/local"

export const metadata = {
  title: "Rally",
  description: "Cool startup coming soon!!!",
}

const roobert = localFont({
  src: "./_fonts/Roobert.ttf",
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${roobert.className} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
