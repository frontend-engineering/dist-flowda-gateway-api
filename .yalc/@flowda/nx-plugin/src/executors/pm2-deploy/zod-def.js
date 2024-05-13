"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pm2DeployInput = void 0;
const zod_1 = require("zod");
exports.pm2DeployInput = zod_1.z.object({
    user: zod_1.z.string().describe('ssh user'),
    host: zod_1.z.string().describe('ssh host'),
    pemPath: zod_1.z.string().optional().describe('ssh pem'),
    path: zod_1.z.string().describe('remote host, path to deploy'),
    buildTarget: zod_1.z.string().default('depended build target'),
    buildOutput: zod_1.z.string().describe('depended build output'),
    extraOutput: zod_1.z.array(zod_1.z.string()).describe('extra output to scp'),
    pm2AppName: zod_1.z.string().describe('ssh pm2 app name'),
});
//# sourceMappingURL=zod-def.js.map