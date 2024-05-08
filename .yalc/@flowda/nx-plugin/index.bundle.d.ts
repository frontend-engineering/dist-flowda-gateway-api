declare function createWallabyConfigFromNxIgnore(nxignorePath: string): Promise<{
    filesOverride: string[];
    testsOverride: string[];
}>;

export { createWallabyConfigFromNxIgnore };
