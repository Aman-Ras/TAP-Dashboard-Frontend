import './globals.css';
import NavWrapper from '../components/NavWrapper';

export const metadata = {
  title: 'Recruiter Dashboard',
  description: 'Monitor recruiter activity across interviews and resume screening',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var t = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', t);
          })();
        ` }} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <NavWrapper>{children}</NavWrapper>
      </body>
    </html>
  );
}
