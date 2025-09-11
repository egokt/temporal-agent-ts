module.exports = {
  apps: [
    {
      name: 'api',
      script: 'build/index.js',
      interpreter: 'node',
      watch: ['build'],
    },
  ],
};
