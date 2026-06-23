import { useState } from "react";
import { Alert, Badge, Box, CircularProgress, Divider, Pagination, Stack, Typography, TextField, Button } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from 'react-router-dom';

import { NotificationFilter } from "../components/NotificationFilter";
import { useNotifications } from "../hooks/useNotifications";
import { fetchNotifications } from "../api/notifications";

export function NotificationsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [formError, setFormError] = useState('');
  const [result, setResult] = useState(null);

  const { notifications, setUrlDatabase, totalPages, loading, error } = useNotifications();

  const [rows, setRows] = useState([
    { longUrl: '', validity: '', customCode: '' },
    { longUrl: '', validity: '', customCode: '' },
    { longUrl: '', validity: '', customCode: '' },
    { longUrl: '', validity: '', customCode: '' },
    { longUrl: '', validity: '', customCode: '' },
  ]);

  const unreadCount = notifications.length;

  const updateField = (index, field, value) => {
    const nextRows = [...rows];
    nextRows[index][field] = value;
    setRows(nextRows);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    fetchNotifications('info', 'ui', `Dashboard analytics view filtered to: ${newFilter}`);
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setResult(null);

    const activeRows = rows.filter(r => r.longUrl.trim() !== '');
    if (activeRows.length === 0) {
      setFormError('Please fill at least one Original Long URL field.');
      fetchNotifications('warn', 'ui', 'Shortener batch submitted with empty paths');
      return;
    }

    const outputBatch = [];

    for (let i = 0; i < activeRows.length; i++) {
      const current = activeRows[i];
      if (!current.longUrl.startsWith('http://') && !current.longUrl.startsWith('https://')) {
        setFormError(`Row ${i + 1}: URL must start with http:// or https://`);
        fetchNotifications('error', 'ui', `Validation failed: Invalid prefix at row ${i + 1}`);
        return;
      }

      let shortcode = current.customCode.trim();
      if (shortcode) {
        if (!/^[a-zA-Z0-9]+$/.test(shortcode)) {
          setFormError(`Row ${i + 1}: Shortcode can only contain letters and numbers.`);
          return;
        }
        const exists = notifications.some(x => x.shortcode === shortcode) || outputBatch.some(x => x.shortcode === shortcode);
        if (exists) {
          setFormError(`Row ${i + 1}: Shortcode "${shortcode}" is already in use.`);
          fetchNotifications('error', 'state', `Collision matching records for shortcode: ${shortcode}`);
          return;
        }
      } else {
        shortcode = Math.random().toString(36).substring(2, 8);
      }

      const totalMins = parseInt(current.validity, 10);
      const validityPeriod = isNaN(totalMins) ? 30 : totalMins;
      const expiryDate = new Date(new Date().getTime() + validityPeriod * 60000);

      outputBatch.push({
        longUrl: current.longUrl,
        shortcode: shortcode,
        creationTime: new Date().toLocaleString(),
        expiryTime: expiryDate.toLocaleString(),
        clicks: []
      });
    }

    const updatedDatabase = [...notifications, ...outputBatch];
    localStorage.setItem('url_db', JSON.stringify(updatedDatabase));
    setUrlDatabase(updatedDatabase);
    setResult(outputBatch);
    fetchNotifications('info', 'api', `Successfully generated batch array cluster of ${outputBatch.length} components`);

    setRows([
      { longUrl: '', validity: '', customCode: '' },
      { longUrl: '', validity: '', customCode: '' },
      { longUrl: '', validity: '', customCode: '' },
      { longUrl: '', validity: '', customCode: '' },
      { longUrl: '', validity: '', customCode: '' },
    ]);
  };

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: 2, py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <Badge badgeContent={unreadCount} color="primary" max={99}>
          <NotificationsIcon sx={{ fontSize: 28, color: '#111827' }} />
        </Badge>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#111827' }}>
          Link Workspace Control Panel
        </Typography>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {formError && <Alert severity="error" sx={{ mb: 3 }}>{formError}</Alert>}

      <Box component="form" onSubmit={onSubmit} sx={{ mb: 4 }}>
        {[0, 1, 2, 3, 4].map((index) => (
          <Box 
            key={index} 
            sx={{ 
              display: 'flex', 
              gap: 2, 
              mb: 2, 
              alignItems: 'center', 
              backgroundColor: '#ffffff', 
              p: 2, 
              borderRadius: 2, 
              border: '1px solid #e5e7eb' 
            }}
          >
            <TextField fullWidth size="small" label={`Original Long URL ${index + 1}`} value={rows[index].longUrl} onChange={(e) => updateField(index, 'longUrl', e.target.value)} />
            <TextField size="small" type="number" label="Minutes" value={rows[index].validity} onChange={(e) => updateField(index, 'validity', e.target.value)} sx={{ width: '120px' }} />
            <TextField size="small" label="Shortcode" value={rows[index].customCode} onChange={(e) => updateField(index, 'customCode', e.target.value)} sx={{ width: '160px' }} />
          </Box>
        ))}

        <Button type="submit" variant="contained" sx={{ mt: 1, backgroundColor: '#111827', color: '#ffffff', px: 4, py: 1.2, fontWeight: 'bold', '&:hover': { backgroundColor: '#1f2937' } }}>
          Generate Shorten Links
        </Button>
      </Box>

      {result && (
        <Box sx={{ mb: 4, p: 3, backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>Newly Shortened Paths:</Typography>
          {(result || []).map((link, idx) => (
            <Box key={idx} sx={{ pb: 2, mb: 2, borderBottom: idx !== result.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
              <Typography variant="body2" color="text.secondary" noWrap><strong>Target:</strong> {link.longUrl}</Typography>
              <Typography variant="body1" sx={{ my: 0.5 }}>
                <strong>Short Route:</strong>{' '}
                <span style={{ color: '#3b82f6', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate(`/${link.shortcode}`)}>
                  http://localhost:3000/{link.shortcode}
                </span>
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Divider sx={{ my: 4 }} />

      <Box sx={{ marginBottom: 3 }}>
        <NotificationFilter urlDatabase={notifications} />
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error">Failed to synchronize data matrix logs with the testing endpoint</Alert>
      )}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No generated links currently saved inside this registry profile.</Alert>
      )}

      {!loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}