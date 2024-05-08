"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bizLibGroupGeneratorSchema = void 0;
const zod_1 = require("zod");
exports.bizLibGroupGeneratorSchema = zod_1.z.object({
    name: zod_1.z.string(),
    omitGroupName: zod_1.z.boolean().default(false),
});
//# sourceMappingURL=zod-def.js.map