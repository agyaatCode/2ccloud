export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const { seedIfNeeded } = await import("./db/seed");
      await seedIfNeeded();
    } catch (e) {
      console.error("[seed] skipped:", (e as Error).message);
    }
  }
}
