import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className='bg-white'>
        {children}
      </body>
    </html>
  );
}