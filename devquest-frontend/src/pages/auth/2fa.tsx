import { useState } from 'react';

const TwoFactorAuth = () => {
  const [isSetup, setIsSetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [code, setCode] = useState('');

  const setup2FA = async () => {
    const res = await fetch('/api/auth/2fa/setup', { method: 'POST', body: JSON.stringify({ userId: 'user-id' }) });
    const data = await res.json();
    setQrCodeUrl(data.qrCodeUrl);  // Display the QR code to the user for scanning
  };

  const verify2FA = async () => {
    const res = await fetch('/api/auth/2fa/verify', { method: 'POST', body: JSON.stringify({ userId: 'user-id', code }) });
    const data = await res.json();
    if (data.success) {
      setIsSetup(true);
    }
  };

  return (
    <div>
      {!isSetup ? (
        <>
          <button onClick={setup2FA}>Setup 2FA</button>
          <img src={qrCodeUrl} alt="QR Code for 2FA" />
        </>
      ) : (
        <div>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter 2FA code" />
          <button onClick={verify2FA}>Verify 2FA</button>
        </div>
      )}
    </div>
  );
};

export default TwoFactorAuth;
