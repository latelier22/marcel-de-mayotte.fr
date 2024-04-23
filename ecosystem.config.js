module.exports = {
  apps : [{
    script: 'yarn run dev',
    watch: '.'
  }, {
    script: './service-worker/',
    watch: ['./service-worker']
  }],

  deploy : {
    production : {
      user : 'debian',
      host : 'vps.latelier22.fr',
      ref  : 'origin/dev',
      repo : 'git@github.com:latelier22/marcel-de-mayotte.fr.git',
      path : '/home/debian/dev',
      'pre-deploy-local': '',
      'post-deploy' : 'yarn install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
