/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('song', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        title: {
            type: 'VARCHAR(1000)',
            notNull: true
        },
        year: {
            type: 'integer',
            notNull: true
        },
        genre: {
            type: 'VARCHAR(64)',
            primaryKey: true,
        },
        performer: {
            type: 'VARCHAR(1000)',
            primaryKey: true,
        },
        duration: {
            type: 'integer'
        },
        album_id: {
            type: 'VARCHAR(50)',
        },
        created_at: {
            type: 'VARCHAR(100)',
            notNull: true,
        },
        updated_at: {
            type: 'VARCHAR(100)',
            notNull: true,
        },
    })
};

exports.down = pgm => {
    pgm.dropTable('song');
};

