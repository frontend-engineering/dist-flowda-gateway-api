"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nrwl/devkit");
const consola_1 = require("consola");
const path = require("path");
const _ = require("radash");
const js_1 = require("@nrwl/js");
const versions_1 = require("@nrwl/js/src/utils/versions");
async function default_1(tree, options) {
    const groupName = _.dash(options.name);
    consola_1.default.start(`generate biz lib group ${groupName}`);
    const suffixes = ['types', 'services', 'trpc-server', 'prisma'];
    let tasks = [];
    for (const suffix of suffixes) {
        tasks = tasks.concat(await createLib(tree, groupName, suffix, options));
    }
    return (0, devkit_1.runTasksInSerial)(...tasks);
}
exports.default = default_1;
async function createLib(tree, groupName, suffix, options) {
    const tasks = [];
    const { libsDir, npmScope } = (0, devkit_1.getWorkspaceLayout)(tree);
    let projectName = options.omitGroupName ? suffix : `${groupName}-${suffix}`;
    let projectRoot = path.join(libsDir, options.omitGroupName ? '' : groupName, suffix);
    const dbPrefix = _.snake(groupName);
    if (suffix === 'prisma') {
        projectName = `prisma-${dbPrefix}`;
        projectRoot = path.join(libsDir, options.omitGroupName ? '' : groupName, projectName);
    }
    const importPath = `@${npmScope}/${projectName}`;
    consola_1.default.info(`  ${projectRoot} (${importPath})`);
    tasks.push(await (0, js_1.initGenerator)(tree, {}));
    (0, devkit_1.generateFiles)(tree, path.join(__dirname, 'files/lib'), projectRoot, {
        tmpl: '',
        dbPrefix,
        projectName,
        projectRoot,
        importPath,
        offsetFromRoot: (0, devkit_1.offsetFromRoot)(projectRoot),
        rootTsConfigPath: (0, js_1.getRelativePathToRootTsConfig)(tree, projectRoot),
    });
    const { className, propertyName, fileName } = (0, devkit_1.names)(groupName);
    if (suffix === 'types') {
        (0, devkit_1.generateFiles)(tree, path.join(__dirname, `files/${suffix}`), projectRoot, {
            tmpl: '',
            className,
            propertyName,
        });
    }
    if (suffix === 'services') {
        (0, devkit_1.generateFiles)(tree, path.join(__dirname, `files/${suffix}`), projectRoot, {
            tmpl: '',
            className,
            propertyName,
            fileName,
            projectName,
            typesImportPath: options.omitGroupName ? `@${npmScope}/types` : `@${npmScope}/${groupName}-types`,
        });
    }
    if (suffix === 'trpc-server') {
        (0, devkit_1.generateFiles)(tree, path.join(__dirname, `files/${suffix}`), projectRoot, {
            tmpl: '',
            propertyName,
            projectName,
        });
    }
    if (suffix === 'prisma') {
        const dbPrefix = _.snake(groupName);
        const prismaProjectRoot = path.join(libsDir, options.omitGroupName ? '' : groupName, `prisma-${dbPrefix}`);
        (0, devkit_1.generateFiles)(tree, path.join(__dirname, `files/${suffix}`), prismaProjectRoot, {
            tmpl: '',
            dbPrefix,
            prismaProjectRoot,
            groupName,
            className,
            offsetFromRoot: (0, devkit_1.offsetFromRoot)(projectRoot),
        });
    }
    addProject(tree, { projectName, projectRoot });
    const lintCallback = await addLint(tree, { projectName, projectRoot });
    tasks.push(lintCallback);
    const jestCallback = await addJest(tree, {
        projectName,
        testEnvironment: suffix === 'types' ? 'jsdom' : 'node',
    });
    tasks.push(jestCallback);
    (0, js_1.updateRootTsConfig)(tree, {
        name: projectName,
        importPath: importPath,
        projectRoot: projectRoot,
        js: false,
    });
    return tasks;
}
function addProject(tree, options) {
    var _a;
    var _b;
    const projectConfiguration = {
        root: options.projectRoot,
        sourceRoot: (0, devkit_1.joinPathFragments)(options.projectRoot, 'src'),
        projectType: 'library',
        targets: {},
        tags: [],
    };
    const outputPath = `dist/${options.projectRoot}`;
    projectConfiguration.targets.build = {
        executor: `@nrwl/js:tsc`,
        outputs: ['{options.outputPath}'],
        options: {
            outputPath,
            main: `${options.projectRoot}/src/index.ts`,
            tsConfig: `${options.projectRoot}/tsconfig.lib.json`,
            assets: [],
        },
    };
    (_a = (_b = projectConfiguration.targets.build.options).assets) !== null && _a !== void 0 ? _a : (_b.assets = []);
    projectConfiguration.targets.build.options.assets.push((0, devkit_1.joinPathFragments)(options.projectRoot, '*.md'));
    (0, devkit_1.addProjectConfiguration)(tree, options.projectName, projectConfiguration);
}
async function addLint(tree, options) {
    const { lintProjectGenerator } = (0, devkit_1.ensurePackage)('@nrwl/linter', versions_1.nxVersion);
    return lintProjectGenerator(tree, {
        project: options.projectName,
        linter: 'eslint',
        skipFormat: true,
        tsConfigPaths: [
            (0, devkit_1.joinPathFragments)(options.projectRoot, 'tsconfig.lib.json'),
        ],
        unitTestRunner: 'jest',
        eslintFilePatterns: [
            `${options.projectRoot}/**/*.ts`,
        ],
        setParserOptionsProject: false,
    });
}
async function addJest(tree, options) {
    const { jestProjectGenerator } = (0, devkit_1.ensurePackage)('@nrwl/jest', versions_1.nxVersion);
    return await jestProjectGenerator(tree, Object.assign(Object.assign({}, options), { project: options.projectName, setupFile: 'none', supportTsx: false, skipSerializers: true, testEnvironment: options.testEnvironment, skipFormat: true, compiler: 'tsc' }));
}
//# sourceMappingURL=generator.js.map