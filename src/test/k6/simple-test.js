import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    scenarios: {
        heavy_get: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '1m', target: 100 }, // ramp up
                { duration: '1m', target: 200 }, // sustain
                { duration: '1m', target: 300 },    // ramp down
            ],

            // 서버 한계치 찾아보자! (논리적 오류 확인 ㄱㄱ, 전략이 맞나? 사바사)
            // 많이 요청할 API 위주로 테스트 ㄱㄱ 
            // - set user request interval 
            // - total request  
            // - server limit
            gracefulRampDown: '2m',
        },
    },
    thresholds: {
        http_req_duration: ['p(95)<1000'],
        http_req_failed: ['rate<0.01'],
    },
};

const BASE_URL = 'http://localhost:3000';

export default function () {
    const resArticles = http.get(`${BASE_URL}/articles/0ebee3eb-d404-4fe3-b208-21580806fd0a`);
    const resProducts = http.get(`${BASE_URL}/products/575acc8a-b858-4d90-a6eb-daf6fb711cb0`);

    check(resArticles, { 'articles 200': (r) => r.status === 200 });
    check(resProducts, { 'products 200': (r) => r.status === 200 });

    sleep(1);
}
// ...existing code...