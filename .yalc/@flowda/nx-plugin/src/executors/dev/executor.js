"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRollupConfig = void 0;
const tslib_1 = require("tslib");
const devkit_1 = require("@nrwl/devkit");
const zod_def_1 = require("./zod-def");
const rollup = require("rollup");
const rollup_plugin_dts_1 = require("rollup-plugin-dts");
const path = require("path");
const tsc_impl_1 = require("@nrwl/js/src/executors/tsc/tsc.impl");
const child_process_1 = require("child_process");
const consola_1 = require("consola");
const fs = require("fs-extra");
const plugin_alias_1 = require("@rollup/plugin-alias");
const _ = require("radash");
const plugin_node_resolve_1 = require("@rollup/plugin-node-resolve");
function buildRollupConfig(input) {
    const packageJson = fs.readJSONSync(input.packageJsonPath);
    const cfgs = [
        {
            onwarn: (warning, next) => {
                if (input.bundleSuppressWarnCodes.indexOf(warning.code) > -1)
                    return;
                next(warning);
            },
            input: input.dtsBundleInput,
            output: [
                {
                    file: input.dtsBundleFile,
                    format: 'es',
                },
            ],
            plugins: [
                (0, rollup_plugin_dts_1.default)({}),
                (0, plugin_alias_1.default)({
                    entries: input.bundleAlias,
                }),
            ],
        },
    ];
    if (input.bundleJs) {
        cfgs.push({
            onwarn: (warning, next) => {
                if (input.bundleSuppressWarnCodes.indexOf(warning.code) > -1)
                    return;
                next(warning);
            },
            input: input.bundleInput,
            output: [
                {
                    file: input.bundleFileCjs,
                    format: 'cjs',
                    interop: 'auto',
                },
                {
                    file: input.bundleFile,
                    format: 'es',
                    interop: 'auto',
                },
            ],
            external: [
                ...Object.keys(packageJson.peerDependencies),
                ...Object.keys(packageJson.dependencies),
                ...input.externals,
            ].filter(k => {
                return Object.keys(input.bundleAlias).indexOf(k) === -1;
            }),
            plugins: [
                (0, plugin_alias_1.default)({
                    entries: input.bundleAlias,
                }),
                (0, plugin_node_resolve_1.nodeResolve)(),
            ],
        });
    }
    return cfgs;
}
exports.buildRollupConfig = buildRollupConfig;
function devExecutor(_options, context) {
    return tslib_1.__asyncGenerator(this, arguments, function* devExecutor_1() {
        var _a, e_1, _b, _c;
        const options = zod_def_1.devExecutorSchema.parse(_options);
        const tscGenerator = (0, tsc_impl_1.tscExecutor)({
            buildableProjectDepsInPackageJsonType: 'peerDependencies',
            generateLockfile: false,
            outputPath: options.outputPath,
            main: options.main || `libs/${context.projectName}/src/index.ts`,
            tsConfig: options.tsConfig || `libs/${context.projectName}/tsconfig.lib.json`,
            assets: options.assets,
            watch: options.watch,
            clean: true,
            transformers: [],
            updateBuildableProjectDepsInPackageJson: true,
            externalBuildTargets: ['build'],
        }, Object.assign(Object.assign({}, context), { targetName: 'build' }));
        try {
            for (var _d = true, tscGenerator_1 = tslib_1.__asyncValues(tscGenerator), tscGenerator_1_1; tscGenerator_1_1 = yield tslib_1.__await(tscGenerator_1.next()), _a = tscGenerator_1_1.done, !_a; _d = true) {
                _c = tscGenerator_1_1.value;
                _d = false;
                const output = _c;
                yield yield tslib_1.__await(output);
                if (options.bundleDts) {
                    const rollupOptions = buildRollupConfig(zod_def_1.buildRollupConfigInputSchema.parse({
                        dtsBundleInput: options.mts
                            ? path.join(options.outputPath, `src/index.d.mts`)
                            : path.join(options.outputPath, `src/index.d.ts`),
                        dtsBundleFile: path.join(options.outputPath, `index.bundle.d.ts`),
                        packageJsonPath: path.join(options.outputPath, `package.json`),
                        bundleInput: options.mts
                            ? path.join(options.outputPath, `src/index.mjs`)
                            : path.join(options.outputPath, `src/index.js`),
                        bundleFile: path.join(options.outputPath, `index.bundle.js`),
                        bundleFileCjs: path.join(options.outputPath, `index.bundle.cjs`),
                        bundleAlias: _.mapValues(options.bundleAlias, value => path.join(context.root, value)),
                        bundleSuppressWarnCodes: options.bundleSuppressWarnCodes,
                        externals: options.externals,
                        bundleJs: options.bundleJs,
                    }));
                    try {
                        for (const rollupOption of rollupOptions) {
                            consola_1.default.start(`Bundling [${context.projectName}] ${rollupOption.input}...`);
                            const bundle = yield tslib_1.__await(rollup.rollup(rollupOption));
                            if (Array.isArray(rollupOption.output)) {
                                for (const output of rollupOption.output) {
                                    yield tslib_1.__await(bundle.write(output));
                                }
                            }
                            else {
                                yield tslib_1.__await(bundle.write(rollupOption.output));
                            }
                            consola_1.default.success(`Bundle done.`);
                        }
                    }
                    catch (e) {
                        if (e instanceof Error) {
                            consola_1.default.error(`Bundle error ${e.message}`);
                        }
                        else {
                            consola_1.default.error(e);
                        }
                    }
                }
                consola_1.default.start('To update package.json');
                const packageJsonPath = path.join(options.outputPath, 'package.json');
                const packageJson = (0, devkit_1.readJsonFile)(packageJsonPath);
                if (options.bundleDts) {
                    packageJson.types = './index.bundle.d.ts';
                    consola_1.default.info('  updated package.json#types: ./index.bundle.d.ts');
                }
                else {
                    if (options.yalc) {
                        // 如果不 bundle dts 则 yalc 不用支持 d.ts，因为 yalc 永远会 ignore src/**/*.d.ts
                        delete packageJson.types;
                        consola_1.default.info('  deleted package.json#types');
                    }
                }
                if (options.mts && !options.bundleJs) {
                    packageJson.main = './src/index.mjs';
                    consola_1.default.info('  updated package.json#main: ./src/index.mjs');
                }
                if (options.bundleJs) {
                    packageJson.main = './index.bundle.cjs';
                    consola_1.default.info('  updated package.json#main: ./index.bundle.cjs');
                    packageJson.module = './index.bundle.js';
                    consola_1.default.info('  updated package.json#module: ./index.bundle.js');
                    delete packageJson.type;
                    consola_1.default.info('  deleted package.json#type');
                }
                if (Object.keys(options.bundleAlias).length > 0) {
                    Object.keys(options.bundleAlias).forEach(k => {
                        delete packageJson.dependencies[k];
                        delete packageJson.peerDependencies[k];
                    });
                    consola_1.default.info('  deleted bundleAlias in package.json#{peerDependencies,dependencies}');
                }
                if (options.onlyTypes) {
                    delete packageJson.main;
                    delete packageJson.scripts;
                    delete packageJson.peerDependencies;
                    delete packageJson.dependencies;
                    consola_1.default.info('  deleted package.json#{main,scripts,peerDependencies,dependencies}');
                }
                (0, devkit_1.writeJsonFile)(`${options.outputPath}/package.json`, packageJson);
                consola_1.default.success('Updated package.json');
                if (options.yalc) {
                    consola_1.default.start(`yalc publish ${context.projectName} ...`);
                    if (options.onlyTypes || options.bundleJs) {
                        fs.writeFileSync(path.join(options.outputPath, '.yalcignore'), `src/**/*
testing/**/*
`);
                    }
                    else {
                        fs.writeFileSync(path.join(options.outputPath, '.yalcignore'), `*.js.map
src/**/*.d.ts
src/**/__fixtures__/**/*
src/**/__tests__/**/*
testing/**/*
`);
                    }
                    if (options.watch) {
                        (0, child_process_1.execSync)(`yalc publish --push --changed`, {
                            cwd: options.outputPath,
                            stdio: 'inherit',
                        });
                    }
                    else {
                        (0, child_process_1.execSync)(`yalc publish --push`, {
                            cwd: options.outputPath,
                            stdio: 'inherit',
                        });
                    }
                    consola_1.default.success('yalc publish done.');
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = tscGenerator_1.return)) yield tslib_1.__await(_b.call(tscGenerator_1));
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
exports.default = devExecutor;
//# sourceMappingURL=executor.js.map