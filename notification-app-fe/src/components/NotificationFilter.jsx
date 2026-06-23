import { ToggleButton, ToggleButtonGroup, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box } from "@mui/material";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { fetchNotifications } from "../api/notifications";

export function NotificationFilter({ urlDatabase = [] }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleView = (link) => {
    setSelected(link);
    fetchNotifications('info', 'ui', `Inspecting database table click logs for: /${link.shortcode}`);
  };

  return (
    <Box>
      {/* Consolidated Single View Controller */}
      <ToggleButtonGroup
        value="All"
        exclusive
        size="small"
        sx={{ flexWrap: "wrap", gap: 0.5, mb: 3 }}
      >
        <ToggleButton value="All" sx={{ textTransform: "none", px: 3, fontWeight: 600 }}>
          All Notifications Workspace
        </ToggleButton>
      </ToggleButtonGroup>

      <Typography variant="h6" fontWeight={600} sx={{ mb: 2, mt: 1, color: '#111827' }}>
        Active Registries Data Log Table
      </Typography>

      {urlDatabase.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No generated links currently saved inside this workspace scope.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e5e7eb', borderRadius: 2 }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#f9fafb' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Route Link</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Created Timestamp</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Expiration Lifespan</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Clicks Count</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {urlDatabase.map((row, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>
                    <span 
                      style={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }} 
                      onClick={() => navigate(`/${row.shortcode}`)}
                    >
                      /{row.shortcode}
                    </span>
                  </TableCell>
                  <TableCell color="text.secondary">{row.creationTime}</TableCell>
                  <TableCell color="text.secondary">{row.expiryTime}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>{row.clicks?.length || 0}</TableCell>
                  <TableCell align="center">
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => handleView(row)}
                      sx={{ textTransform: 'none', color: '#111827', borderColor: '#d1d5db', '&:hover': { borderColor: '#111827', backgroundColor: '#f9fafb' } }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Detailed Parameter Inspector Sub-Panel */}
      {selected && (
        <Box sx={{ mt: 4, p: 3, border: '1px solid #e5e7eb', borderRadius: 2, backgroundColor: '#ffffff' }}>
          <Typography variant="subtitle1" fontWeight={600} mb={1} sx={{ color: '#111827' }}>
            Telemetry Inspector Matrix Panel: /{selected.shortcode}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: '#4b5563', wordBreak: 'break-all' }}>
            <strong>Target Redirect Location:</strong> {selected.longUrl}
          </Typography>

          {selected.clicks.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No interaction traffic registers captured for this path target yet.</Typography>
          ) : (
            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #f3f4f6' }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f9fafb' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Click Time</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Client Context</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Location Context</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selected.clicks.map((click, cIdx) => (
                    <TableRow key={cIdx}>
                      <TableCell color="text.secondary">{click.timestamp}</TableCell>
                      <TableCell color="text.secondary">{click.source}</TableCell>
                      <TableCell color="text.secondary">{click.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}
    </Box>
  );
}