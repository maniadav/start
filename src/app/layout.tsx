import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from 'state/provider/AuthProvider';
import ProtectedRoute from '@hooks/ProtectedRoute';
import GameWrapper from 'components/GameWrapper';
import { SurveyProvider } from 'state/provider/SurveytProvider';
import {
  LanguageProvider,
  useLanguageProvider,
} from 'state/provider/LanguageProvider';
// import { useMotorStateContext } from 'state/provider/MotorStateProvider';
// require('dotenv').config()
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // console.log({useLanguageProvider})
  // const { language } = useLanguageProvider();
  // const { ballCoordinates } = useMotorStateContext();
  // console.log({ ballCoordinates });
  return (
    <SurveyProvider>
      <LanguageProvider>
        <html lang={'en'}>
          <body className={inter.className}>
            {/* <link rel="manifest" href="../manifest.json"></link> */}
            <AuthProvider>
              <ProtectedRoute>
                <GameWrapper>{children}</GameWrapper>
              </ProtectedRoute>
            </AuthProvider>
          </body>
        </html>
      </LanguageProvider>
    </SurveyProvider>
  );
}
