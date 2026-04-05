// Vercel Serverless Function
// 파일 위치: /api/winning-numbers.js

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET 요청만 허용
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { round } = req.query;

    if (!round) {
      res.status(400).json({ error: 'Round number is required' });
      return;
    }

    // 로또 API 호출
    const apiUrl = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${round}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // 성공 응답
    res.status(200).json(data);

  } catch (error) {
    console.error('Error fetching lottery data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch lottery data',
      message: error.message 
    });
  }
}
