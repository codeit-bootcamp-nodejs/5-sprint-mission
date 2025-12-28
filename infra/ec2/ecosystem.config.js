module.exports = {
    apps: [
        {
            name: "app1",
            script: "./dist/app.js",
            env: { PORT: 3000 }
        },
        {
            name: "app2",
            script: "./dist/app.js",
            env: { PORT: 3001 }
        },
        
        // --- aws 프리티어는 CPU 코어가 2개라서 아래 주석처리 ---
        // {
        //     name: "app3",
        //     script: "./dist/app.js",
        //     env: { PORT: 3002 }
        // },
        // {
        //     name: "app4",
        //     script: "./dist/app.js",
        //     env: { PORT: 3003 }
        // }
    ]
};
