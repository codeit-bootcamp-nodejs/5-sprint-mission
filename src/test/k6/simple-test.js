import { check, sleep } from 'k6';
import http from 'k6/http';


export const options = {
    stages: [
        { duration: '10s', target: 800 }, // ramp-up to 200 users
        { duration: '20s', target: 800 }, // stay at 200 users
        { duration: '10s', target: 0 }, // ramp-down to 0 users
    ],
    thresholds: {
        http_req_duration: ['p(99)<100'], // 99% of requests must complete below 100ms
    },
}

export default () => {
    const res = http.get('http://localhost:3000/articles');
    check(res, { 'status was 200': (r) => r.status === 200 });
    sleep(1);
}