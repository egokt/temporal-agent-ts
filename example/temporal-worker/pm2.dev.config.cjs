module.exports = {
  apps: [
    {
      name: 'temporal-worker',
      script: 'build/index.js',
      interpreter: 'node',
      watch: ['build'],
    },
  ],
};
