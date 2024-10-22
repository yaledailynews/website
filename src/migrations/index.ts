import * as migration_20241021_065007 from './20241021_065007';
import * as migration_20241022_044617 from './20241022_044617';

export const migrations = [
  {
    up: migration_20241021_065007.up,
    down: migration_20241021_065007.down,
    name: '20241021_065007',
  },
  {
    up: migration_20241022_044617.up,
    down: migration_20241022_044617.down,
    name: '20241022_044617'
  },
];
