import { http, HttpResponse, delay } from 'msw';

export const handlers = [
  // Crop Diagnosis
  http.post('/api/diagnose', async ({ request }) => {
    await delay(3000); // Simulate AI processing
    const body = await request.formData();
    
    return HttpResponse.json({
      disease: "Early Blight",
      scientific: "Alternaria solani",
      confidence: 0.92,
      status: "high",
      advice: [
        "Remove infected leaves away from field",
        "Apply copper fungicide, repeat in 10 days if needed",
        "Avoid overhead irrigation at night"
      ],
      alternatives: [
        { disease: "Septoria leaf spot", confidence: 0.07 }
      ],
      timestamp: new Date().toISOString()
    });
  }),

  // Market Prices
  http.get('/api/market', async ({ request }) => {
    await delay(500);
    const url = new URL(request.url);
    const crop = url.searchParams.get('crop') || 'tomato';
    const district = url.searchParams.get('district') || 'Bengaluru';

    return HttpResponse.json({
      crop,
      market: `Yeshwanthpur, ${district}`,
      unit: "₹/Quintal",
      today: 1150,
      yesterday: 1200,
      trend: -4.17,
      last7: [1100, 1120, 1150, 1180, 1175, 1200, 1150],
      timestamp: new Date().toISOString()
    });
  }),

  // Government Schemes
  http.get('/api/schemes', async ({ request }) => {
    await delay(500);
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';

    const allSchemes = [
      {
        id: "scheme-001",
        title: "Drip Irrigation Subsidy (State)",
        summary: "Up to 75% subsidy for micro-irrigation for small farmers.",
        eligibility: ["Small & marginal farmers", "Land ownership proof"],
        documents: ["Aadhaar", "Land record", "Bank passbook"],
        apply: "Visit: Agriculture Block Office, Taluk X or Link: /apply/drip",
        contact: "1800-XXX-XXXX"
      },
      {
        id: "scheme-002",
        title: "Soil Health Card Scheme",
        summary: "Free soil testing and recommendations for nutrient management.",
        eligibility: ["All farmers", "Active land cultivation"],
        documents: ["Aadhaar", "Land details"],
        apply: "Visit nearest Agriculture Office or online portal",
        contact: "1800-YYY-YYYY"
      },
      {
        id: "scheme-003",
        title: "PM-KISAN Direct Benefit Transfer",
        summary: "₹6000 per year in three installments for small farmers.",
        eligibility: ["Small & marginal farmers", "Land < 2 hectares"],
        documents: ["Aadhaar", "Bank account", "Land records"],
        apply: "Register at PM-KISAN portal or CSC",
        contact: "1800-ZZZ-ZZZZ"
      }
    ];

    const filtered = query 
      ? allSchemes.filter(s => 
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.summary.toLowerCase().includes(query.toLowerCase())
        )
      : allSchemes;

    return HttpResponse.json(filtered);
  }),

  // Chat History (localStorage fallback)
  http.get('/api/history', async () => {
    await delay(200);
    const history = JSON.parse(localStorage.getItem('kisan-history') || '[]');
    return HttpResponse.json(history.slice(-5));
  })
];
