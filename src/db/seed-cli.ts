import "dotenv/config";
import { seedIfNeeded } from "./seed";

seedIfNeeded()
  .then(() => {
    console.log("Seed complete.");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
