export const fetchGitHubStats = async (username: string) => {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/events/public`);
    if (!res.ok) throw new Error('Failed to fetch GitHub stats');
    const data = await res.json();
    
    // Count commits from push events
    let commits = 0;
    data.forEach((event: any) => {
      if (event.type === 'PushEvent') {
        commits += event.payload.commits ? event.payload.commits.length : 0;
      }
    });
    
    return {
      commitsToday: commits,
      recentEvents: data.slice(0, 5),
    };
  } catch (error) {
    console.error('GitHub API error:', error);
    return null;
  }
};
