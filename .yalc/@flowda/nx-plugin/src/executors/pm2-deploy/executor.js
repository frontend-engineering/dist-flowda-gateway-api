"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const devkit_1 = require("@nrwl/devkit");
const child_process_1 = require("child_process");
const zod_def_1 = require("./zod-def");
const consola_1 = require("consola");
const path = require("path");
const TAR_NAME = 'pm2-deploy.tar.gz';
function pm2DeployExecutor(_options, context) {
    var _a;
    return tslib_1.__asyncGenerator(this, arguments, function* pm2DeployExecutor_1() {
        const opt = zod_def_1.pm2DeployInput.parse(_options);
        consola_1.default.start(`run ${opt.buildTarget}`);
        (0, child_process_1.execSync)(`./node_modules/.bin/nx run ${opt.buildTarget}`, {
            cwd: devkit_1.workspaceRoot,
            stdio: 'inherit',
        });
        consola_1.default.success(`done (run ${opt.buildTarget})`);
        consola_1.default.start('tar');
        (0, child_process_1.execSync)(`tar --exclude "libquery_engine-*.node" -zcf ${TAR_NAME} ${opt.buildOutput} ${opt.extraOutput.join(' ')}`, {
            cwd: devkit_1.workspaceRoot,
            stdio: 'inherit',
        });
        consola_1.default.success('done (tar)');
        consola_1.default.start('scp');
        const pemPath = (_a = opt.pemPath) !== null && _a !== void 0 ? _a : process.env.PEM_PATH;
        const scpCmd = pemPath ? `scp -i ${pemPath}` : `scp`;
        (0, child_process_1.execSync)(`${scpCmd} -r "./${TAR_NAME}" "${opt.user}@${opt.host}:${opt.path}"`, {
            cwd: devkit_1.workspaceRoot,
            stdio: 'inherit',
        });
        consola_1.default.success('done (scp)');
        const sshCmd = pemPath ? `ssh -i ${pemPath} "${opt.user}@${opt.host}"` : `ssh "${opt.user}@${opt.host}"`;
        consola_1.default.start('untar');
        (0, child_process_1.execSync)(`${sshCmd} "cd ${opt.path} && tar -zxf ${TAR_NAME} -C ./release/"`, {
            cwd: devkit_1.workspaceRoot,
            stdio: 'inherit',
        });
        consola_1.default.success('done (untar)');
        consola_1.default.start('install deps');
        consola_1.default.start('  force remove .yalc in node_modules');
        (0, child_process_1.execSync)(`${sshCmd} "cd ${opt.path}/release/${opt.buildOutput} && find ./node_modules/.pnpm -type d -name "file+.yalc+*" -print -exec rm -r {} +"`, {
            cwd: devkit_1.workspaceRoot,
            stdio: 'inherit',
        });
        consola_1.default.success('  done (force remove .yalc in node_modules)');
        consola_1.default.start('  copy extra output');
        opt.extraOutput.forEach(output => {
            const targetDir = path.join(opt.buildOutput, path.dirname(output));
            (0, child_process_1.execSync)(`${sshCmd} "cd ${opt.path}/release && mkdir -p ${targetDir} && cp -r ${output} ${targetDir}"`, {
                cwd: devkit_1.workspaceRoot,
                stdio: 'inherit',
            });
        });
        consola_1.default.success('  done (copy extra output)');
        consola_1.default.start('  pnpm i --frozen-lockfile');
        (0, child_process_1.execSync)(`${sshCmd} "cd ${opt.path}/release/${opt.buildOutput} && pnpm dlx pnpm@7.33.7 i --frozen-lockfile"`, {
            cwd: devkit_1.workspaceRoot,
            stdio: 'inherit',
        });
        consola_1.default.success('  done (pnpm i --frozen-lockfile)');
        consola_1.default.success('done (install deps)');
        consola_1.default.start('pm2 restart');
        (0, child_process_1.execSync)(`${sshCmd} "pm2 restart ${opt.pm2AppName}"`, {
            cwd: devkit_1.workspaceRoot,
            stdio: 'inherit',
        });
        (0, child_process_1.execSync)(`sleep 3`, {
            cwd: devkit_1.workspaceRoot,
            stdio: 'inherit',
        });
        (0, child_process_1.execSync)(`${sshCmd} "pm2 logs ${opt.pm2AppName} --nostream"`, {
            cwd: devkit_1.workspaceRoot,
            stdio: 'inherit',
        });
        consola_1.default.success('done (pm2 restart)');
        return yield tslib_1.__await({
            success: true,
        });
    });
}
exports.default = pm2DeployExecutor;
//# sourceMappingURL=executor.js.map