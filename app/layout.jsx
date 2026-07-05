import './globals.css';

export const metadata = {
  title: 'Mapa do Emagrecimento 40+',
  description: 'Seu acompanhamento diário, feito pra sua jornada.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans max-w-md mx-auto min-h-screen bg-bg">
        {children}
      </body>
    </html>
  );
}
