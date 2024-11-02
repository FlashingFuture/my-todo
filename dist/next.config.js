"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/socket.io/:path*",
                destination: "http://localhost:3001/socket.io/:path*",
            },
        ];
    },
    // 다른 옵션들 필요에 따라 추가
};
exports.default = nextConfig;
