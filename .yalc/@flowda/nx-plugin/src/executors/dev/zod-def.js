"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devExecutorSchema = exports.buildRollupConfigInputSchema = exports.rollupTransparentSchema = void 0;
const zod_1 = require("zod");
exports.rollupTransparentSchema = zod_1.z.object({
    bundleAlias: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).default({}),
    bundleSuppressWarnCodes: zod_1.z.array(zod_1.z.string()).default([]),
    bundleJs: zod_1.z.boolean().default(false),
    externals: zod_1.z.array(zod_1.z.string()).default([]),
    mts: zod_1.z.boolean().default(false),
});
exports.buildRollupConfigInputSchema = exports.rollupTransparentSchema.extend({
    dtsBundleInput: zod_1.z.string(),
    dtsBundleFile: zod_1.z.string(),
    bundleInput: zod_1.z.string(),
    bundleFileCjs: zod_1.z.string(),
    bundleFile: zod_1.z.string(),
    packageJsonPath: zod_1.z.string(),
});
exports.devExecutorSchema = exports.rollupTransparentSchema.extend({
    outputPath: zod_1.z.string(),
    main: zod_1.z.string().optional(),
    tsConfig: zod_1.z.string().optional(),
    watch: zod_1.z.boolean().default(false),
    yalc: zod_1.z.boolean().default(true),
    bundleDts: zod_1.z.boolean().default(true),
    assets: zod_1.z.array(zod_1.z.any()).default([]),
    onlyTypes: zod_1.z.boolean().default(false),
});
//# sourceMappingURL=zod-def.js.map