var fs = require('fs');
var path = require('path');
var packagePath = path.resolve(__dirname, '../packages');
var collectPackages = require('./collect-packages');
var packages = collectPackages(packagePath).map(p => p.replace('packages/', ''));
var exec = require('child_process').execSync;
var copy = require('./copy');

var npmrc = path.resolve(__dirname, '../npmrc-publish-only');

packages.forEach((package) => {
    console.log(`publish ${package}...`);

    var cwd = path.resolve(__dirname, '../dist', package);
    var pkgNpmrc = path.join(cwd, '.npmrc');

    console.log(`Copy ${npmrc} to ${pkgNpmrc}`);
    copy(npmrc, pkgNpmrc);

    if (process.env['NPM_AUTH_TOKEN']) {
        fs.writeFileSync(pkgNpmrc, fs.readFileSync(pkgNpmrc).toString() + "\n//registry.npmjs.org/:_authToken=" + process.env['NPM_AUTH_TOKEN'] + "\n");
    }

    // If we're publishing from a branch other than master, tag the release with the branch name
    let publishCommand = 'npm publish';
    //let branch = process.env['TRAVIS_BRANCH'];
    let branch = exec('git symbolic-ref --short HEAD', {cwd: cwd, stdio: 'inherit'});
    if (branch != 'master') {
        publishCommand += ` --tag ${branch}`;
    }

    try {
        console.log(`Publishing to registry`);
        console.log(publishCommand);
        //var results = exec(publishCommand, {cwd: cwd });
    } catch (err) {
        console.error(`Build error ${err.message}`);
    }

    //console.log(results.toString());
});

