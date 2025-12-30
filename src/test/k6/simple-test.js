import { check, sleep } from "k6";
import http from "k6/http";

export const options = {
  stages: [
    { duration: "30s", target: 800 },
    { duration: "1m", target: 800 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(99)<100"],
  },
};

export default () => {
  const res = http.get("http://localhost:3000/articles");
  check(res, { "status was 200": (r) => r.status === 200 });
  sleep(1);
};
