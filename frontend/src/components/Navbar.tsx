import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', px:5, py:2.5, borderBottom:'1px solid #1E1B2E', position:'sticky', top:0, zIndex:100, bgcolor:'#08080F', backdropFilter:'blur(12px)' }}>
      <Typography onClick={() => navigate('/')} sx={{ fontSize:21, fontWeight:800, letterSpacing:'-0.5px', cursor:'pointer', color:'#F0EEF9' }}>
        ⚡Zap<span style={{color:'#7C3AED'}}>ply</span>
      </Typography>
    </Box>
  );
};
export default Navbar;