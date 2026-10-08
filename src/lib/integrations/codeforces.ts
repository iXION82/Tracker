export const fetchCodeforcesStats = async (username: string) => {
  try {
    const res = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
    if (!res.ok) throw new Error('Failed to fetch Codeforces stats');
    const data = await res.json();
    
    if (data.status === 'OK') {
      const user = data.result[0];
      return {
        rating: user.rating,
        maxRating: user.maxRating,
        rank: user.rank,
        maxRank: user.maxRank,
      };
    }
    return null;
  } catch (error) {
    console.error('Codeforces API error:', error);
    return null;
  }
};
