/**
 * O módulo virtual com o build do servidor só existe depois que o plugin do
 * React Router roda. Declarado solto para o `tsc --noEmit` do CI não depender
 * de um build prévio.
 */
declare module 'virtual:react-router/server-build';
