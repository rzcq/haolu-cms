module.exports = {
  apps: [
    {
      name: 'node_forge',
      port: '3000',
      exec_mode: 'fork', // cluster
      // instances: 'max',
      script: '.output/server/index.mjs',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      watch: false,
      env: {
        NODE_ENV: 'production',
        NUXT_HOST: '0.0.0.0',
        NUXT_PORT: '3000',
        PORT: '3000',
        SERVER_HOST=https://mycms.hnzdzg.com/
        IMG_HOST=https://mycms.hnzdzg.com/
        REDIS_HOST: '127.0.0.1',
        REDIS_PORT: '6379',
        REDIS_URL: 'redis://127.0.0.1:6379/0',
        DATABASE_URL: 'mysql://node_forge_cms:a9EDD7RsSca9EDD7RsSc@172.0.0.1:3306/node_forge_cms',
        MYSQL_DATABASE: 'node_forge_cms',
        MYSQL_USER: 'node_forge_cms',
        MYSQL_PASSWORD: 'a9EDD7RsSca9EDD7RsSc',
        MYSQL_HOST: '172.0.0.1',
        JWT_SECRET: 'Kx9mP2vL8nQ4wR7tY1uI5oA3sD6fG0hJ2kM8bN4cV7xZ9lW3eR5tY1uI7oP0aS'
      }
    }
  ]
};
