import './globals.css';
import Sidebar from '../components/Sidebar';

export const metadata = {
  title: 'Recruiter Dashboard',
  description: 'Monitor recruiter activity across interviews and resume screening',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        {/* Prevent flash of wrong theme on load */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var t = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', t);
          })();
        ` }} />
      </head>
      <body>
        <Sidebar />
        <div className="main-content">
          <div className="px-8 py-7">{children}</div>
        </div>
      </body>
    </html>
  );
}
