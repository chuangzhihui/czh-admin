import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
// https://vite.dev/config/
// 递归复制目录及文件
function copyDir(src, dest) {
  // 确保目标目录存在
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }

  // 读取源目录内容
  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // 跳过index.html，因为Vite会单独处理
    if (entry.name === 'index.html') continue;

    if (entry.isDirectory()) {
      // 如果是目录，递归复制
      copyDir(srcPath, destPath);
    } else {
      // 如果是文件，直接复制
      copyFileSync(srcPath, destPath);
      console.log(`Copied: ${srcPath} -> ${destPath}`);
    }
  }
}

// 复制public目录内容到dist
function copyPublicAssets() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const publicDir = path.resolve(__dirname, 'public');
  const distDir = path.resolve(__dirname, 'dist');

  copyDir(publicDir, distDir);
}
export default defineConfig(({ mode,command }) => {
  // 从项目根目录加载环境变量
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  // 转换环境变量为客户端可访问的格式
  const envWithProcessPrefix = Object.entries(env).reduce(
      (prev, [key, val]) => {
        return {
          ...prev,
          [`import.meta.env.${key}`]: JSON.stringify(val),
        };
      },
      {}
  );
  return {
    plugins: [react(),
      // 在构建完成后执行复制操作
      {
        name: 'copy-public-assets',
        closeBundle() {
          if (command === 'build') {
            copyPublicAssets();
          }
        }
      }],
    base:"./",
    root:path.resolve(__dirname, 'public'),
    assetsInclude: ['assets'],
    // 配置路径别名，解决 src 目录引用问题
    resolve: {
      alias: {
        '/src': path.resolve(__dirname, 'src')
      }
    },
    // 配置构建输出目录
    build: {
      outDir: '../dist',
      // 确保资源路径正确
      assetsDir: 'assets',
      // 确保所有静态资源都被正确处理
      assetsInclude: [path.resolve(__dirname, 'public/**/*')]
    },
    // 开发服务器配置
    server: {
      // 确保根目录正确
      root: 'public'
    },
    // 直接定义环境变量
    define: envWithProcessPrefix
  };
});
