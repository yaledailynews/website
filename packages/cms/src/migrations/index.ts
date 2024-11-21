import * as migration_20241120_230850 from './20241120_230850';
import * as migration_20241121_043247 from './20241121_043247';

export const migrations = [
  {
    up: migration_20241120_230850.up,
    down: migration_20241120_230850.down,
    name: '20241120_230850',
  },
  {
    up: migration_20241121_043247.up,
    down: migration_20241121_043247.down,
    name: '20241121_043247'
  },
];
