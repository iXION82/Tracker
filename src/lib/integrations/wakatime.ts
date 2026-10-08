export const fetchWakatimeStats = async (apiKey: string) => {
  try {
    const res = await fetch(`https://wakatime.com/api/v1/users/current/status_bar/today?api_key=${apiKey}`);
    if (!res.ok) throw new Error('Failed to fetch WakaTime stats');
    const data = await res.json();
    
    return {
      totalSeconds: data.data.grand_total.total_seconds,
      text: data.data.grand_total.text,
      digital: data.data.grand_total.digital,
    };
  } catch (error) {
    console.error('WakaTime API error:', error);
    return null;
  }
};
