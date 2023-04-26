/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('playlist', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: {
            type: 'VARCHAR(100)',
            notNull: true
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        created_at: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        updated_at: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
    });

    pgm.addConstraint('playlist', 'fk_playlist.owner_user.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropTable('playlist')
};
