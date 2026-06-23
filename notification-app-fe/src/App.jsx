import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { NotificationsPage } from './pages/NotificationsPage';
import { useNotifications } from './hooks/useNotifications';
import { fetchNotifications } from './api/notifications';

function HandleRedirect({ urlDatabase, setUrlDatabase }) {
  const { shortcode } = useParams();
  const currentLocalData = JSON.parse(localStorage.getItem('url_db')) || [];
  const match = currentLocalData.find(x => x.shortcode === shortcode);

  useEffect(() => {
    if (match) {
      if (new Date() > new Date(match.expiryTime)) {
        fetchNotifications("warn", "state", `Redirection block: Link expired for /${shortcode}`);
        return;
      }

      const click = {
        timestamp: new Date().toLocaleString(),
        source: window.innerWidth < 600 ? "Mobile" : "Desktop",
        location: "Visakhapatnam"
      };

      const updatedDb = currentLocalData.map(item => {
        if (item.shortcode === shortcode) {
          const isDuplicate = item.clicks.some(c => c.timestamp === click.timestamp);
          return { ...item, clicks: isDuplicate ? item.clicks : [...item.clicks, click] };
        }
        return item;
      });

      localStorage.setItem('url_db', JSON.stringify(updatedDb));
      setUrlDatabase(updatedDb);

      fetchNotifications("info", "api", `Redirecting path /${shortcode} directly to long URL: ${match.longUrl}`);
      window.location.replace(match.longUrl);
    } else {
      fetchNotifications("error", "api", `Redirection failure: Shortcode /${shortcode} not matching dataset records`);
    }
  }, []); 

  if (!match) return <h2 style={{ textAlign: 'center', marginTop: '50px', color: '#dc2626', fontFamily: 'sans-serif' }}>URL Not Found</h2>;
  if (new Date() > new Date(match.expiryTime)) return <h2 style={{ textAlign: 'center', marginTop: '50px', color: '#dc2626', fontFamily: 'sans-serif' }}>This Link Has Expired</h2>;
  return <h2 style={{ textAlign: 'center', marginTop: '50px', color: '#64748b', fontFamily: 'sans-serif' }}>Routing to target destination...</h2>;
}

export default function App() {
  const { notifications, setUrlDatabase } = useNotifications();

  useEffect(() => {
    fetchNotifications('info', 'state', 'Notification-App-FE framework booted on Port 3000');
  }, []);

  return (
    <BrowserRouter>
      <AppBar position="static" style={{ backgroundColor: '#111827', boxShadow: 'none', borderBottom: '1px solid #1f2937' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold', color: '#ffffff', letterSpacing: '0.5px' }}>
            URL Shortener
          </Typography>
          <Button color="inherit" component={Link} to="/" style={{ color: '#f3f4f6', fontWeight: 500 }}>
            Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      <Box style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingTop: '16px', paddingBottom: '40px' }}>
        <Routes>
          <Route path="/" element={<NotificationsPage />} />
          <Route path="/:shortcode" element={<HandleRedirect urlDatabase={notifications} setUrlDatabase={setUrlDatabase} />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}