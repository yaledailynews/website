import * as migration_20241120_230850 from "./20241120_230850";

export const migrations = [
  {
    up: migration_20241120_230850.up,
    down: migration_20241120_230850.down,
    name: "20241120_230850",
  },
];
