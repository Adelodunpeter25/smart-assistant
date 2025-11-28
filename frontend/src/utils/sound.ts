let audio: HTMLAudioElement | null = null;

export const playNotificationSound = () => {
  try {
    if (!audio) {
      audio = new Audio('/notification.mp3');
      audio.volume = 0.5;
    }
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Ignore errors (e.g., user hasn't interacted with page yet)
    });
  } catch (error) {
    console.error('Failed to play notification sound:', error);
  }
};
