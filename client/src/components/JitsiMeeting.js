import React, { useEffect, useRef } from 'react';

const JITSI_SCRIPT_ID = 'jitsi-external-api';
const JITSI_DOMAIN = 'meet.jit.si';

const loadJitsiScript = () =>
  new Promise((resolve, reject) => {
    if (document.getElementById(JITSI_SCRIPT_ID)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = JITSI_SCRIPT_ID;
    script.src = `https://${JITSI_DOMAIN}/external_api.js`;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

const JitsiMeeting = ({ roomName, displayName, onClose }) => {
  const containerRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    loadJitsiScript().then(() => {
      if (!mounted || !containerRef.current || !window.JitsiMeetExternalAPI) return;

      apiRef.current = new window.JitsiMeetExternalAPI(JITSI_DOMAIN, {
        roomName,
        parentNode: containerRef.current,
        userInfo: { displayName: displayName || 'User' },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableDeepLinking: true,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'chat', 'settings',
            'videoquality', 'tileview', 'download', 'help',
          ],
        },
      });

      apiRef.current.addEventListeners({
        readyToClose: onClose,
      });
    });

    return () => {
      mounted = false;
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [roomName, displayName, onClose]);

  return (
    <div className="jitsi-panel">
      <div className="jitsi-toolbar">
        <span className="jitsi-room-label">Room: {roomName}</span>
        <button className="jitsi-leave-btn" onClick={onClose}>Leave Call</button>
      </div>
      <div className="jitsi-frame" ref={containerRef} />
    </div>
  );
};

export default JitsiMeeting;
