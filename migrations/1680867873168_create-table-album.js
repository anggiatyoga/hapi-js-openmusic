/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('album', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: {
            type: 'VARCHAR(1000)',
            notNull: true
        },
        year: {
            type: 'integer',
            notNull: true
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
    pgm.dropTable('album');
};

