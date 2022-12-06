module.exports = {
  apps: [
    {
      name: 'API Server',
      script: 'npm',
      args: 'start',
      autorestart: true,
      exp_backoff_restart_delay: 1000,
      error_file: '~/.pm2/errors/API.log',
      out_file: '~/.pm2/out/API.log',
    },
    {
      name: 'API Worker',
      script: './src/worker.js',
      autorestart: false,
      cron_restart: '*/5 * * * *',
      error_file: '~/.pm2/errors/Worker.log',
      out_file: '~/.pm2/out/Worker.log',
    },
  ],
};
