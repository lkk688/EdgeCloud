import '@/styles/globals.css';
import Sidebar from '../components/Sidebar';
import { ThemeProvider } from 'next-themes';
import 'bootstrap/dist/css/bootstrap.css';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
    <Sidebar>
      <Component {...pageProps} />
    </Sidebar>
    </ThemeProvider>
  );
}
