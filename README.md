# test-1

a [Sails v1](https://sailsjs.com) application

### Links

- [Sails framework documentation](https://sailsjs.com/get-started)
- [Version notes / upgrading](https://sailsjs.com/documentation/upgrading)
- [Deployment tips](https://sailsjs.com/documentation/concepts/deployment)
- [Community support options](https://sailsjs.com/support)
- [Professional / enterprise options](https://sailsjs.com/enterprise)

### Version info

This app was originally generated on Sun Feb 16 2025 12:22:10 GMT+0500 (Pakistan Standard Time) using Sails v1.5.14.

<!-- Internally, Sails used [`sails-generate@2.0.13`](https://github.com/balderdashy/sails-generate/tree/v2.0.13/lib/core-generators/new). -->

This project's boilerplate is based on an expanded seed app provided by the [Sails core team](https://sailsjs.com/about) to make it easier for you to build on top of ready-made features like authentication, enrollment, email verification, and billing. For more information, [drop us a line](https://sailsjs.com/support).

<!--
Note:  Generators are usually run using the globally-installed `sails` CLI (command-line interface).  This CLI version is _environment-specific_ rather than app-specific, thus over time, as a project's dependencies are upgraded or the project is worked on by different developers on different computers using different versions of Node.js, the Sails dependency in its package.json file may differ from the globally-installed Sails CLI release it was originally generated with.  (Be sure to always check out the relevant [upgrading guides](https://sailsjs.com/upgrading) before upgrading the version of Sails used by your app.  If you're stuck, [get help here](https://sailsjs.com/support).)
-->

Hostname: ssh.employeeinneed.com
Username: u3125-zzxhnkdoawm4
Password: Test@123
Port: 18765

ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDuFLuh3JYF1lE7Cev7vv/FFm4jlTNYalSdqmRbL7nptLyWH5JwCqqkklFyTePbNGJwu53V6nhbkHfYxnEI+LjrttZW0UmJozFvdjreIrrJ87Qvxr8YzS/PDpBaz3MHNFs4mIfrMY5FfDbrfmi9no/1STZQ1uvKdhW6sceHLC3meX4T7Sv/0tJh2au+kzlt12E6fQgtXv2ibWgpT/jqxfeO5zIV9meIdfTok/wzliVLbKx3SvUNACPm80IfbGPXEZoDkxHBgT/bjMbSv4LIQSPcgGK7BFH28wqKzoCGTWKdlk8cx5OdYg5SxTWFDSq48NxIjla3dEFC9iIfOZXYb3FeGBxRxnI/Cf13SDoACC9JH6kQYu6c95ThdATM6tNu0N5zAPxN1R7iKtvbhF9FcI2rlKtEVqPk8Xh8PKRdCSbfk6F95vYpuoEXBDs34DHt7L5KLQ2ZI8XNS7ajnX6HL+ICS1GPXCotL5SujtsP/gVuCpFuRF38ngDY8iGKdgLq4hvrHC4B4eTUQp8hE6b4+qTTk7iheMy8tWSg+REN1ZpSKtMI4QyyDjWB+GJoInTZK+jmUtEB11EphoYDjNOOtqd3JKTNOxqFaiUyvrUL4VOI1MBjZGs2pX0//bF7zcX/i6hk3QWDsM4PTxQ+qkw07vGwT8w4nvpsUBp2+R3tl6UfnQ==

generate key
ssh-keygen -t rsa -b 4096 -C "mohsinalisoomro23@gmail.com"

verify key
ssh -i ~/.ssh/id_rsa u3125-zzxhnkdoawm4@35.212.6.98
connect server


ssh -vvv -i ~/.ssh/id_rsa -p 18765 u3125-zzxhnkdoawm4@35.212.6.98

module.exports = {
port: process.env.PORT || 3000,
environment: 'production',
};

module.exports.bootstrap = async function() {
sails.log('Sails application is starting in production mode...');

}

pm2 start app.js --name "sails-app"
pm2 save
pm2 startup

server {
listen 80;
server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

}
