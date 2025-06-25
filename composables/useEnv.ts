export const useEnv = () => {
  return {
    env: import.meta.env,
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
    isSSR: import.meta.env.SSR,
  }
}