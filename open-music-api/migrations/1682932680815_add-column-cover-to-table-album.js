/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.addColumn('album', {
        cover: {
            type: 'VARCHAR(100)',
            default: null,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropColumn('album', 'cover');
};

