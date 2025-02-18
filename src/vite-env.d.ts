/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />
declare module '*.toml' {
    const content: Record<string>;
    export default content;
}