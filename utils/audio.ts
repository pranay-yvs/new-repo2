export const playNotificationSound = (type: 'complete' | 'message') => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const now = audioContext.currentTime;

    if (type === 'complete') {
        // A pleasant, multi-tone chime for completion
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.4, now + 0.05);
        oscillator.frequency.setValueAtTime(523.25, now); // C5
        oscillator.frequency.linearRampToValueAtTime(659.25, now + 0.1); // E5
        oscillator.frequency.linearRampToValueAtTime(783.99, now + 0.2); // G5
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    } else { // 'message'
        // A quick, soft pop for a new message
        gainNode.gain.setValueAtTime(0.3, now);
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(880, now); // A5
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    }
    
    oscillator.start(now);
    oscillator.stop(now + 1);
  } catch (e) {
    console.error("Could not play notification sound:", e);
  }
};
