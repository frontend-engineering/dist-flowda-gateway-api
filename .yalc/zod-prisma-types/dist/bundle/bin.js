#!/usr/bin/env node
'use strict';

var generatorHelper = require('@prisma/generator-helper');
var zod = require('zod');
var generator = require('./generator');

const outputSchema = zod.z.object({
    fromEnvVar: zod.z.string().nullable(),
    value: zod.z.string({ required_error: 'No output path specified' }),
});
generatorHelper.generatorHandler({
    onManifest: () => {
        return {
            defaultOutput: './generated/zod',
            prettyName: 'Zod Prisma Types',
        };
    },
    onGenerate: async (generatorOptions) => {
        if (generator.skipGenerator())
            return;
        const config = generator.parseGeneratorConfig(generatorOptions);
        const output = outputSchema.parse(generatorOptions.generator.output);
        const extendedDMMF = new generator.ExtendedDMMF(generatorOptions.dmmf, config);
        generator.DirectoryHelper.removeDir(output.value);
        generator.DirectoryHelper.createDir(output.value);
        if (extendedDMMF.generatorConfig.useMultipleFiles) {
            return generator.generateMultipleFiles({
                dmmf: extendedDMMF,
                path: output.value,
            });
        }
        return generator.generateSingleFile({
            dmmf: extendedDMMF,
            path: output.value,
        });
    },
});
