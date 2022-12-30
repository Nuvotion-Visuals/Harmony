export default ({ env }) => ({
  connection: {
    client: 'mysql',
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 5506),
      database: env('DATABASE_NAME', 'lexi'),
      user: env('DATABASE_USERNAME', 'lexi'),
      password: env('DATABASE_PASSWORD', 'lexirealm'),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
