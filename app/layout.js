import './globals.css';
import Sidebar from '../components/Sidebar';

export const metadata = {
  title: 'Recruiter Dashboard',
  description: 'Monitor recruiter activity across interviews and resume screening',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <div className="main-content">
          <div className="px-8 py-7">{children}</div>
        </div>
      </body>
    </html>
  );
}
