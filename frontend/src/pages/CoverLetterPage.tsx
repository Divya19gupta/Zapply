import { Box, Typography, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import Navbar from '../components/Navbar';

const shapes = [
  { emoji: '✉️', size: 28, top: '8%', left: '5%', duration: '6s', delay: '0s' },
  { emoji: '📄', size: 22, top: '15%', right: '8%', duration: '8s', delay: '1s' },
  { emoji: '✉️', size: 18, top: '45%', left: '2%', duration: '7s', delay: '2s' },
  { emoji: '📝', size: 24, top: '60%', right: '4%', duration: '9s', delay: '0.5s' },
  { emoji: '📄', size: 16, bottom: '20%', left: '8%', duration: '6s', delay: '1.5s' },
  { emoji: '✉️', size: 20, bottom: '10%', right: '10%', duration: '10s', delay: '3s' },
  { emoji: '📝', size: 14, top: '30%', left: '12%', duration: '8s', delay: '2.5s' },
  { emoji: '📄', size: 18, top: '75%', right: '15%', duration: '7s', delay: '0.8s' },
];

const CoverLetterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const coverLetter = location.state?.coverLetter;
  const docRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const wordCount = coverLetter ? `${(coverLetter.header + coverLetter.body + coverLetter.footer).split(/\s+/).filter(Boolean).length}` : '—';
  const paraCount = coverLetter ? `${coverLetter.body.split('\n\n').filter((p: string) => p.trim().length > 0).length}` : '—';

  const handleCopy = () => {
    const full = `${coverLetter.header}\n\n${coverLetter.body}\n\n${coverLetter.footer}`;
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!docRef.current) return;
    setDownloading(true);
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf().set({
      margin: [15, 20, 15, 20],
      filename: 'cover-letter-zapply.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(docRef.current).save().then(() => setDownloading(false));
  };

  const cleanLines = (text: string) =>
    text?.split('\n').filter(line =>
      !line.toLowerCase().includes('not provided') &&
      !line.includes('[') &&
      !line.includes(']')
    ) ?? [];

  return (
    <Box sx={{ bgcolor: '#08080F', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* Floating background shapes */}
      {shapes.map((shape, i) => (
        <Box key={i} sx={{
          position: 'fixed',
          top: (shape as any).top,
          bottom: (shape as any).bottom,
          left: (shape as any).left,
          right: (shape as any).right,
          fontSize: shape.size,
          opacity: 0.12,
          pointerEvents: 'none',
          zIndex: 0,
          animation: `drift ${shape.duration} ease-in-out ${shape.delay} infinite`,
        }}>
          {shape.emoji}
        </Box>
      ))}

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Navbar />

        <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 }, maxWidth: 1000, margin: '0 auto' }}>

          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 800, color: '#F0EEF9', mb: 0.5 }}>
              Your cover letter is ready 🎉
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#6B7280' }}>
              Looking good. Now go get that job.
            </Typography>
          </Box>

          <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', mb: 4 }}>

            {/* Floating badges */}
            {[
             { text: 'Tailored to JD', top: 40, right: 0, color: '#A78BFA', delay: '0s' },
              { text: 'Humanized', top: 160, left: -20, color: '#eeabf8', delay: '0.5s' },
              { text: 'Interview booked!', bottom: 0, left: 0, color: '#34D399', delay: '1s' },
              { text: 'Done in 12s', top: 160, right: -20, color: '#F59E0B', delay: '0.5s' },
              { text: 'No complex steps', bottom: 0, right: -20, color: '#fb8674', delay: '0.5s' }, 
            ].map((badge, i) => (
              <Box key={i} sx={{
                position: 'absolute',
                bgcolor: '#13111F',
                border: '1px solid #2D2A3E',
                borderRadius: 2,
                px: 1.8,
                py: 1,
                fontSize: 12,
                fontWeight: 700,
                color: badge.color,
                whiteSpace: 'nowrap',
                top: (badge as any).top,
                bottom: (badge as any).bottom,
                left: (badge as any).left,
                right: (badge as any).right,
                animation: `float 3s ease-in-out ${badge.delay} infinite`,
                zIndex: 10,
                display: { xs: 'none', lg: 'block' },
              }}>
                {badge.text}
              </Box>
            ))}

            {/* LAPTOP FRAME */}
            <Box sx={{ width: '100%', maxWidth: 720, position: 'relative' }}>
              <Box sx={{ bgcolor: '#1E1B2E', border: '2px solid #2D2A3E', borderBottom: 'none', borderRadius: '16px 16px 0 0', px: 2, py: 1.2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FF5F57' }} />
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FFBD2E' }} />
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#28C840' }} />
                <Typography sx={{ fontSize: 12, color: '#6B7280', ml: 'auto', fontFamily: 'monospace' }}>
                  cover-letter-zapply.pdf
                </Typography>
              </Box>

              <Box sx={{ border: '2px solid #2D2A3E', borderTop: 'none', bgcolor: '#f5f5f5', height: { xs: '50vh', md: '55vh' }, overflowY: 'auto', '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-track': { bgcolor: '#e5e5e5' }, '&::-webkit-scrollbar-thumb': { bgcolor: '#7C3AED', borderRadius: 3 } }}>
                <Box ref={docRef} sx={{ bgcolor: 'white', m: 2, borderRadius: 1, p: { xs: '24px 20px', md: '40px 52px' }, boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
                  <Box sx={{ mb: 3, pb: 2.5, borderBottom: '1px solid #eeeeee' }}>
                    {cleanLines(coverLetter?.header ?? '').map((line: string, i: number) => {
                      const isName = i === 0;
                      const isBlank = line.trim() === '';
                      return (
                        <Typography key={i} sx={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: isName ? 15 : 12, fontWeight: isName ? 600 : 400, color: isName ? '#111111' : '#555555', lineHeight: isBlank ? 0.8 : 1.7 }}>
                          {line || '\u00A0'}
                        </Typography>
                      );
                    })}
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    {cleanLines(coverLetter?.body ?? '').map((line: string, i: number) => {
                      const isBlank = line.trim() === '';
                      return (
                        <Typography key={i} sx={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: 13.5, fontWeight: 400, color: '#1a1a1a', lineHeight: isBlank ? 0.8 : 1.9, mb: isBlank ? 1.2 : 0 }}>
                          {line || '\u00A0'}
                        </Typography>
                      );
                    })}
                  </Box>
                  <Box sx={{ pt: 2.5, borderTop: '1px solid #eeeeee' }}>
                    {cleanLines(coverLetter?.footer ?? '').map((line: string, i: number) => (
                      <Typography key={i} sx={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: 13.5, fontWeight: 400, color: '#1a1a1a', lineHeight: 1.7 }}>
                        {line || '\u00A0'}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ bgcolor: '#1E1B2E', border: '2px solid #2D2A3E', borderTop: '3px solid #2D2A3E', borderRadius: '0 0 4px 4px', height: 12 }} />
              <Box sx={{ bgcolor: '#13111F', border: '2px solid #2D2A3E', borderTop: 'none', borderRadius: '0 0 20px 20px', height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ width: 60, height: 4, bgcolor: '#2D2A3E', borderRadius: 2 }} />
              </Box>
            </Box>
          </Box>

          <Box sx={{ maxWidth: 720, margin: '0 auto' }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              {[
                { num: wordCount, label: 'words', icon: '📝' },
                { num: paraCount, label: 'paragraphs', icon: '📄' },
                { num: 'A4', label: 'format', icon: '📐' },
                { num: '✓', label: 'ready to send', icon: '🚀' },
              ].map((s, i) => (
                <Box key={i} sx={{ flex: 1, minWidth: 100, bgcolor: '#13111F', border: '1px solid #2D2A3E', borderRadius: 3, p: '14px 16px', textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 18, mb: 0.3 }}>{s.icon}</Typography>
                  <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#A78BFA', lineHeight: 1 }}>{s.num}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#6B7280', mt: 0.5 }}>{s.label}</Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button onClick={() => navigate('/')} sx={{ flex: 1, bgcolor: 'transparent', border: '1px solid #2D2A3E', color: '#A78BFA', fontWeight: 600, fontSize: 13, py: 1.5, borderRadius: 2, textTransform: 'none', transition: 'all 0.15s', '&:hover': { borderColor: '#7C3AED', bgcolor: '#1A1728', transform: 'translateY(-1px)' }, '&:active': { transform: 'scale(0.97)' } }}>
                ↩ Start over
              </Button>
              <Button onClick={handleCopy} sx={{ flex: 1, bgcolor: copied ? '#0D2010' : 'transparent', border: `1px solid ${copied ? '#34D399' : '#2D2A3E'}`, color: copied ? '#34D399' : '#A78BFA', fontWeight: 600, fontSize: 13, py: 1.5, borderRadius: 2, textTransform: 'none', transition: 'all 0.15s', '&:hover': { borderColor: '#7C3AED', bgcolor: '#1A1728', transform: 'translateY(-1px)' }, '&:active': { transform: 'scale(0.97)' } }}>
                {copied ? '✓ Copied!' : '📋 Copy text'}
              </Button>
              <Button onClick={handleDownload} disabled={downloading} sx={{ flex: 1, background: downloading ? '#4B3A7A' : 'linear-gradient(135deg,#7C3AED,#6D28D9)', color: 'white', fontWeight: 700, fontSize: 13, py: 1.5, borderRadius: 2, textTransform: 'none', boxShadow: '0 4px 12px rgba(124,58,237,0.3)', transition: 'all 0.15s', '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 6px 18px rgba(124,58,237,0.4)' }, '&:active': { transform: 'scale(0.97)' } }}>
                {downloading ? '⏳ Saving...' : '⬇ Download PDF'}
              </Button>
            </Box>
          </Box>

        </Box>
      </Box>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes drift { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
      `}</style>
    </Box>
  );
};

export default CoverLetterPage;