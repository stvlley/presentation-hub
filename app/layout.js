import "./globals.css";

export const metadata = {
  title: "Presentation Hub",
  description: "Interactive presentation system — Performance Rebuttal & FDOSE",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, overflow: "hidden" }}>
        {children}
      </body>
    </html>
  );
}
