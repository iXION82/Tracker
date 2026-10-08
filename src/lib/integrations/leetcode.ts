export const fetchLeetCodeStats = async (username: string) => {
  try {
    const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
    if (!res.ok) throw new Error('Failed to fetch LeetCode stats');
    const data = await res.json();
    return {
      totalSolved: data.totalSolved,
      easySolved: data.easySolved,
      mediumSolved: data.mediumSolved,
      hardSolved: data.hardSolved,
      ranking: data.ranking,
    };
  } catch (error) {
    console.error('LeetCode API error:', error);
    return null;
  }
};
