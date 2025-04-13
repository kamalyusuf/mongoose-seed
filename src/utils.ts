export const measure = <T>(fn: () => T): { result: T; elapsed: number } => {
  const start = performance.now();

  const result = fn();

  const end = performance.now();

  return { result, elapsed: end - start };
};

measure.async = async <T>(arg: Promise<T> | (() => Promise<T>)) => {
  const start = performance.now();

  const result = typeof arg === "function" ? await arg() : await arg;

  const end = performance.now();

  return { result, elapsed: end - start };
};

export const BLUE = "\x1b[34m";
export const GREEN = "\x1b[32m";
export const YELLOW = "\x1b[33m";
export const RESET = "\x1b[0m";

export const info = (message: string) =>
  console.log(`ℹ️  ${BLUE}${message}${RESET}`);
export const success = (message: string) =>
  console.log(`✅ ${GREEN}${message}${RESET}`);
export const warning = (message: string) =>
  console.log(`⚠️  ${YELLOW}${message}${RESET}`);

export const format_memory = (bytes: number) => {
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(2)} MB`;
};

export const memory_usage = () => {
  const usage = process.memoryUsage();

  return {
    rss: format_memory(usage.rss),
    heapTotal: format_memory(usage.heapTotal),
    heapUsed: format_memory(usage.heapUsed),
    external: format_memory(usage.external)
  };
};
