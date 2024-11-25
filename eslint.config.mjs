// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    prettierConfig,
    {
        ignores: [
            'node_modules/',    // 忽略依赖文件夹
            'dist/',            // 忽略输出目录
            '*.config.js',      // 忽略配置文件
        ],
    }
);