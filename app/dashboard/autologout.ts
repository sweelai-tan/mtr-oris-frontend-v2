'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AutoLogout: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    let logoutTimer: NodeJS.Timeout;

    function resetLogoutTimer() {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(logoutUser, 43200000); // 12 hours in milliseconds
    }

    function logoutUser() {
      // Perform logout actions, e.g., redirect to login page, clear session, etc.
      console.log('User has been logged out due to inactivity.');
      router.push('/login'); // Redirect to login page
    }

    // Reset the timer on any of these events
    window.onload = resetLogoutTimer;
    document.onmousemove = resetLogoutTimer;
    document.onkeypress = resetLogoutTimer;
    document.onscroll = resetLogoutTimer;
    document.onclick = resetLogoutTimer;

    return () => {
      clearTimeout(logoutTimer);
      window.onload = null;
      document.onmousemove = null;
      document.onkeypress = null;
      document.onscroll = null;
      document.onclick = null;
    };
  }, [router]);

  return null;
};

export default AutoLogout;
