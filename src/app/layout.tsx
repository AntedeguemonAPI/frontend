import { LayoutProps } from '@/components/auth/layout';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ProcessMonitoring } from '@/components/core/ProcessMonitoring';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { UserProvider } from '@/contexts/user-context';

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="pt">
      <body>
        <LocalizationProvider>
          <UserProvider>
            <NotificationProvider>
              <ThemeProvider>
                <ProcessMonitoring /> 
                {children}
              </ThemeProvider>
            </NotificationProvider>
          </UserProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
