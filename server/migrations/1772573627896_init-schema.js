exports.up = (pgm) => {
    // Countries
    pgm.createTable('countries', {
      id: 'id',
      name: { type: 'varchar(100)', notNull: true },
      code: { type: 'char(3)', notNull: true, unique: true }
    })

    // Leagues
    pgm.createTable('leagues', {
        id: 'id',
        name: { type: 'varchar(100)', notNull: true },
        country_id: {
        type: 'integer',
        references: '"countries"',
        onDelete: 'SET NULL'
      },
        logo_url: { type: 'text' }
    })
  
    // Clubs
    pgm.createTable('clubs', {
      id: 'id',
      name: { type: 'varchar(100)', notNull: true },
      short_name: { type: 'varchar(50)' },
      country_id: {
        type: 'integer',
        references: '"countries"',
        onDelete: 'SET NULL'
      },
      league_id: {           
        type: 'integer',
        references: '"leagues"',
        onDelete: 'SET NULL'
      },
      logo_url: { type: 'text' }
    })
  
    // Players
    pgm.createTable('players', {
      id: 'id',
      name: { type: 'varchar(100)', notNull: true },
      nationality_id: {
        type: 'integer',
        references: '"countries"',
        onDelete: 'SET NULL'
      },
      date_of_birth: { type: 'date' },
      position: { type: 'varchar(30)' },
      image_url: { type: 'text' }
    })
  
    // Player Clubs (many-to-many)
    pgm.createTable('player_clubs', {
      id: 'id',
      player_id: {
        type: 'integer',
        notNull: true,
        references: '"players"',
        onDelete: 'CASCADE'
      },
      club_id: {
        type: 'integer',
        notNull: true,
        references: '"clubs"',
        onDelete: 'CASCADE'
      },
      season_start: { type: 'integer' },
      season_end: { type: 'integer' }
    })
  
    // Competitions
    pgm.createTable('competitions', {
      id: 'id',
      name: { type: 'varchar(100)', notNull: true },
      type: { type: 'varchar(50)' }
    })
  
    // Player Trophies
    pgm.createTable('player_trophies', {
      id: 'id',
      player_id: {
        type: 'integer',
        notNull: true,
        references: '"players"',
        onDelete: 'CASCADE'
      },
      competition_id: {
        type: 'integer',
        notNull: true,
        references: '"competitions"',
        onDelete: 'CASCADE'
      },
      year: { type: 'integer' }
    })
  
    // Users
    pgm.createTable('users', {
      id: 'id',
      username: { type: 'varchar(50)', notNull: true, unique: true },
      email: { type: 'varchar(100)', unique: true },
      password_hash: { type: 'text' },
      is_anonymous: { type: 'boolean', default: false },
      created_at: { type: 'timestamp', default: pgm.func('NOW()') }
    })
  
    // Grids
    pgm.createTable('grids', {
      id: 'id',
      created_at: { type: 'timestamp', default: pgm.func('NOW()') },
      is_daily: { type: 'boolean', default: false },
      row_1: { type: 'jsonb' },
      row_2: { type: 'jsonb' },
      row_3: { type: 'jsonb' },
      col_1: { type: 'jsonb' },
      col_2: { type: 'jsonb' },
      col_3: { type: 'jsonb' }
    })
  
    // Games
    pgm.createTable('games', {
      id: 'id',
      grid_id: {
        type: 'integer',
        references: '"grids"',
        onDelete: 'SET NULL'
      },
      player_x_id: {
        type: 'integer',
        references: '"users"',
        onDelete: 'SET NULL'
      },
      player_o_id: {
        type: 'integer',
        references: '"users"',
        onDelete: 'SET NULL'
      },
      status: { type: 'varchar(20)', default: "'waiting'" },
      winner: { type: 'char(1)' },
      created_at: { type: 'timestamp', default: pgm.func('NOW()') }
    })
  
    // Enable fuzzy search
    pgm.sql('CREATE EXTENSION IF NOT EXISTS pg_trgm')
  
    // Add fuzzy search index on player names
    pgm.sql('CREATE INDEX player_name_trgm_idx ON players USING GIN (name gin_trgm_ops)')
  }
  
  exports.down = (pgm) => {
    pgm.dropTable('games')
    pgm.dropTable('grids')
    pgm.dropTable('users')
    pgm.dropTable('player_trophies')
    pgm.dropTable('player_clubs')
    pgm.dropTable('competitions')
    pgm.dropTable('players')
    pgm.dropTable('clubs')
    pgm.dropTable('leagues')
    pgm.dropTable('countries')
  }