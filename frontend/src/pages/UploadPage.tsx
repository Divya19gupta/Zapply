import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const phrases = [
  "Dear Hiring Manager, I am an excellent fit for this role...",
  "My experience speaks for itself. So does my coffee intake.",
  "I bring 3 years of experience and a very clean GitHub. 🚀",
  "Dear Ms. Kloda, I would be a genuine asset to your team.",
  "Motivated, detail-oriented, caffeinated enough to ship by Friday. ☕",
  "Not to brag, but my last PR had zero comments. Zero.",
];

const loadingMessages = [
  "Reading your CV... hoping for the best 🤞",
  "Matching your skills to the JD...",
  "Telling the AI to not be generic...",
  "Removing all instances of 'passionate'...",
  "Making you sound impressive but not delusional...",
  "Almost there, adding final sprinkles ✨",
];

const UploadPage = () => {
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [typed, setTyped] = useState('');
  const [loadingMsg, setLoadingMsg] = useState(0);

  useEffect(() => {
    let pi = 0, ci = 0, deleting = false;
    let timeout: ReturnType<typeof setTimeout>;
    const type = () => {
      const phrase = phrases[pi];
      if (!deleting) { ci++; setTyped(phrase.slice(0, ci)); if (ci === phrase.length) { deleting = true; timeout = setTimeout(type, 1800); return; } }
      else { ci--; setTyped(phrase.slice(0, ci)); if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; } }
      timeout = setTimeout(type, deleting ? 28 : 52);
    };
    type();
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!loading) return;
    setLoadingMsg(0);
    const interval = setInterval(() => {
      setLoadingMsg(prev => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [loading]);

  const handleUpload = async () => {
    const file = fileInput.current?.files?.[0];
    if (!file || !jd) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_description', jd);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/upload', { method: 'POST', body: formData });
      const result = await response.json();
      navigate('/cover-letter', { state: { coverLetter: result.cover_letter } });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <Box sx={{ bgcolor: '#08080F', minHeight: '100vh' }}>

      {/* LOADING OVERLAY */}
      {loading && (
        <Box sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(8,8,15,0.96)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          
          {/* Envelope SVG animation */}
          <Box sx={{ width: 160, height: 120 }}>
            <svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" style={{overflow:'visible'}}>
              {/* Envelope body */}
              <rect x="10" y="40" width="140" height="90" rx="6" fill="#1E1B2E" stroke="#7C3AED" strokeWidth="1.5"/>
              {/* Envelope flap */}
              <path d="M10 40 L80 85 L150 40" fill="none" stroke="#7C3AED" strokeWidth="1.5"/>
              {/* Letter coming out */}
              <g style={{animation:'letterUp 2s ease-in-out infinite'}}>
                <rect x="35" y="-10" width="90" height="70" rx="4" fill="white" stroke="#A78BFA" strokeWidth="1"/>
                <rect x="44" y="4" width="60" height="2.5" rx="1" fill="#A78BFA" opacity="0.6"/>
                <rect x="44" y="12" width="72" height="2" rx="1" fill="#E5E7EB"/>
                <rect x="44" y="18" width="68" height="2" rx="1" fill="#E5E7EB"/>
                <rect x="44" y="24" width="72" height="2" rx="1" fill="#E5E7EB"/>
                <rect x="44" y="30" width="55" height="2" rx="1" fill="#E5E7EB"/>
              </g>
              {/* Sparkles */}
              <circle cx="20" cy="20" r="3" fill="#A78BFA" style={{animation:'sparkle 1.5s ease-in-out infinite'}}/>
              <circle cx="140" cy="15" r="2" fill="#38BDF8" style={{animation:'sparkle 1.5s ease-in-out 0.5s infinite'}}/>
              <circle cx="155" cy="35" r="2.5" fill="#34D399" style={{animation:'sparkle 1.5s ease-in-out 1s infinite'}}/>
            </svg>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: { xs: 20, md: 24 }, fontWeight: 800, color: '#F0EEF9', mb: 1.5 }}>
              Cooking your cover letter...
            </Typography>
            <Typography sx={{ fontSize: { xs: 13, md: 15 }, color: '#A78BFA', minHeight: 24, transition: 'all 0.3s' }}>
              {loadingMessages[loadingMsg]}
            </Typography>
          </Box>

          {/* Progress dots */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {[0,1,2].map(i => (
              <Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#7C3AED', animation: `dot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
          </Box>
        </Box>
      )}

      <Navbar />

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', xl: '1fr 1fr' },
        gap: { xs: 4, xl: 8 },
        px: { xs: 3, sm: 5, md: 8, xl: 10 },
        py: { xs: 5, md: 8 },
        maxWidth: 1400,
        mx: 'auto',
      }}>
        <Box>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, bgcolor: '#13111F', border: '1px solid #2D2A3E', borderRadius: 10, px: 2, py: 0.8, fontSize: { xs: 12, md: 13 }, color: '#A78BFA', fontWeight: 600, mb: 3 }}>
            <span style={{ display: 'inline-block', animation: 'wiggle 1.2s infinite' }}>🔥</span> Actually works. No cap.
          </Box>

          <Typography sx={{ fontSize: { xs: 36, sm: 48, md: 60, xl: 68 }, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-2px', mb: 3, color: '#F0EEF9' }}>
            Stop crying over<br />
            <span style={{ background: 'linear-gradient(135deg,#A78BFA,#818CF8,#38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              cover letters.
            </span>
          </Typography>

          <Box sx={{ bgcolor: '#13111F', border: '1px solid #2D2A3E', borderRadius: 3, p: { xs: 2, md: 3 }, mb: 3 }}>
            <Typography sx={{ fontSize: 10, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, mb: 0.8 }}>✍️ Zapply is writing...</Typography>
            <Typography sx={{ color: '#A78BFA', fontWeight: 600, fontSize: { xs: 13, md: 15 }, minHeight: 24 }}>
              {typed}
              <span style={{ display: 'inline-block', width: 2, height: 16, background: '#A78BFA', marginLeft: 2, verticalAlign: 'middle', animation: 'blink 0.8s infinite' }} />
            </Typography>
          </Box>

          <Typography sx={{ color: '#6B7280', fontSize: { xs: 14, md: 16 }, lineHeight: 1.8, mb: 4 }}>
            Drop your CV + the job description. We handle the rest —{' '}
            <strong style={{ color: '#F0EEF9' }}>tailored, professional, and actually good.</strong>
          </Typography>

          <Box sx={{ bgcolor: '#13111F', border: '1px solid #2D2A3E', borderRadius: 4, overflow: 'hidden' }}>
            <Box sx={{ p: { xs: '20px 20px', md: '24px 28px' }, borderBottom: '1px solid #1E1B2E' }}>
              <Typography sx={{ fontSize: { xs: 16, md: 20 }, fontWeight: 800, color: '#F0EEF9', mb: 0.5 }}>Alright, let's get you hired. 🚀</Typography>
              <Typography sx={{ fontSize: { xs: 12, md: 13 }, color: '#6B7280' }}>Two steps. Fifteen seconds. One very good cover letter.</Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
              <Box sx={{ p: { xs: '20px', md: '24px' }, borderRight: { xs: 'none', sm: '1px solid #1E1B2E' }, borderBottom: { xs: '1px solid #1E1B2E', sm: 'none' } }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: 'white', mb: 1.5 }}>1</Box>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: 1, mb: 1.5 }}>📎 Your CV</Typography>
                <Box onClick={() => fileInput.current?.click()} sx={{ border: '2px dashed #2D2A3E', borderRadius: 2, p: { xs: 3, md: 4 }, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { borderColor: '#7C3AED', bgcolor: '#1A1728' } }}>
                  <Typography sx={{ fontSize: { xs: 24, md: 32 }, mb: 1 }}>📄</Typography>
                  <Typography sx={{ color: '#A78BFA', fontSize: { xs: 13, md: 14 }, fontWeight: 600 }}>{fileName || 'Click to upload'}</Typography>
                  <Typography sx={{ color: '#6B7280', fontSize: 11, mt: 0.5 }}>PDF only</Typography>
                  <input ref={fileInput} type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => setFileName(e.target.files?.[0]?.name || '')} />
                </Box>
              </Box>

              <Box sx={{ p: { xs: '20px', md: '24px' } }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#2D2A3E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#A78BFA', mb: 1.5 }}>2</Box>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: 1, mb: 1.5 }}>💼 Job Description</Typography>
                <textarea value={jd} onChange={e => setJd(e.target.value)} placeholder="Paste the full job description here. The more detail, the better the letter." style={{ width: '100%', height: 150, background: '#0A0A0F', border: '1px solid #2D2A3E', borderRadius: 10, padding: '12px 14px', color: '#F0EEF9', fontSize: 14, resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: 1.6 }} />
              </Box>
            </Box>

            <Box sx={{ p: { xs: '16px 20px', md: '18px 28px' }, borderTop: '1px solid #1E1B2E', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#0D0B18', flexWrap: 'wrap', gap: 2 }}>
              <Typography sx={{ fontSize: 12, color: '#6B7280' }}>⚡ Ready in <span style={{ color: '#34D399', fontWeight: 600 }}>~15 seconds</span></Typography>
              <Button onClick={handleUpload} disabled={loading} sx={{ background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', color: 'white', fontWeight: 700, fontSize: { xs: 13, md: 15 }, px: { xs: 3, md: 4 }, py: { xs: 1.2, md: 1.5 }, borderRadius: 2, textTransform: 'none', boxShadow: '0 4px 14px rgba(124,58,237,0.3)', '&:hover': { transform: 'translateY(-1px)' } }}>
                {loading ? 'Generating...' : 'Generate Cover Letter ✨'}
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ position: 'relative', width: '100%', maxWidth: 420, height: 480 }}>
            <Box sx={{ position: 'absolute', width: '70%', height: '70%', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'breathe 4s ease-in-out infinite' }} />
            {[
              { text: 'Tailored to JD', top: 40, right: 0, color: '#A78BFA', delay: '0s' },
              { text: 'Humanized', top: 160, left: -20, color: '#eeabf8', delay: '0.5s' },
              { text: 'Interview booked!', bottom: 0, left: 0, color: '#34D399', delay: '1s' },
              { text: 'Done in 12s', top: 160, right: -20, color: '#F59E0B', delay: '0.5s' },
              { text: 'No complex steps', bottom: 0, right: -20, color: '#fb8674', delay: '0.5s' },
            ].map((fc, i) => (
              <Box key={i} sx={{ position: 'absolute', bgcolor: '#13111F', border: '1px solid #2D2A3E', borderRadius: 2, px: 2, py: 1.2, fontSize: 13, fontWeight: 700, color: fc.color, whiteSpace: 'nowrap', top: (fc as any).top, bottom: (fc as any).bottom, right: (fc as any).right, left: (fc as any).left, animation: `float 3s ease-in-out ${fc.delay} infinite` }}>
                {fc.text}
              </Box>
            ))}
            <svg viewBox="0 0 280 320" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} xmlns="http://www.w3.org/2000/svg">
              <rect x="40" y="230" width="200" height="12" rx="6" fill="#2D2A3E"/>
              <rect x="60" y="242" width="10" height="50" rx="4" fill="#2D2A3E"/>
              <rect x="210" y="242" width="10" height="50" rx="4" fill="#2D2A3E"/>
              <rect x="90" y="155" width="100" height="70" rx="8" fill="#1E1B2E" stroke="#7C3AED" strokeWidth="2"/>
              <rect x="95" y="160" width="90" height="58" rx="5" fill="#0A0A0F"/>
              <rect x="100" y="168" width="60" height="3" rx="2" fill="#A78BFA" opacity="0.8"/>
              <rect x="100" y="176" width="75" height="2" rx="1" fill="#4B5563"/>
              <rect x="100" y="182" width="65" height="2" rx="1" fill="#4B5563"/>
              <rect x="100" y="188" width="70" height="2" rx="1" fill="#4B5563"/>
              <rect x="100" y="194" width="50" height="2" rx="1" fill="#7C3AED" opacity="0.6"/>
              <rect x="133" y="225" width="14" height="10" rx="2" fill="#2D2A3E"/>
              <rect x="115" y="215" width="50" height="6" rx="3" fill="#1E1B2E"/>
              <rect x="138" y="221" width="4" height="20" rx="2" fill="#1E1B2E"/>
              <rect x="122" y="170" width="36" height="38" rx="10" fill="#7C3AED"/>
              <rect x="100" y="178" width="24" height="8" rx="4" fill="#FDE68A"><animateTransform attributeName="transform" type="translate" values="0,0;0,-2;0,0" dur="0.8s" repeatCount="indefinite"/></rect>
              <rect x="156" y="178" width="24" height="8" rx="4" fill="#FDE68A"><animateTransform attributeName="transform" type="translate" values="0,0;0,-2;0,0" dur="0.8s" begin="0.4s" repeatCount="indefinite"/></rect>
              <circle cx="140" cy="155" r="22" fill="#FDE68A"/>
              <circle cx="133" cy="151" r="3.5" fill="white"/><circle cx="147" cy="151" r="3.5" fill="white"/>
              <circle cx="134" cy="152" r="2" fill="#1a1a1a"/><circle cx="148" cy="152" r="2" fill="#1a1a1a"/>
              <path d="M133 160 Q140 166 147 160" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M118 148 Q120 130 140 130 Q160 130 162 148" fill="#4B3F72"/>
              <rect x="95" y="228" width="90" height="6" rx="3" fill="#1E1B2E"/>
              <rect x="131" y="229" width="20" height="3" rx="1" fill="#7C3AED"/>
            </svg>
          </Box>
        </Box>
      </Box>

      <style>{`
        @keyframes wiggle { 0%,100%{transform:rotate(-8deg)} 50%{transform:rotate(8deg)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes breathe { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.08)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes letterUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes sparkle { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.2;transform:scale(0.5)} }
        @keyframes dot { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-6px);opacity:1} }
      `}</style>
    </Box>
  );
};
export default UploadPage;