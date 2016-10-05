var fs = require('fs');
var path = require('path');
var packagePath = path.resolve(__dirname, '../packages');
var collectPackages = require('./collect-packages');
var packages = collectPackages(packagePath).map(p => p.replace('packages/', ''));
var exec = require('child_process').execSync;
var copy = require('./copy');

var registry = process.argv[2];

if (!registry) {
    console.error("Registry not specified!");
    process.exit(1);
}

var npmrc = path.resolve(__dirname, '../npmrc-publish-only');

packages.forEach((package) => {
    console.log(`publish ${package}...`);

    var cwd = path.resolve(__dirname, '../dist', package);
    var pkgNpmrc = path.join(cwd, '.npmrc');

    copy(npmrc, pkgNpmrc);

    if (process.env['NPM_AUTH_TOKEN']) {
        fs.writeFileSync(pkgNpmrc, fs.readFileSync(pkgNpmrc).toString() + "\n_auth=" + process.env['NPM_AUTH_TOKEN'] + "\n");
    }

    try {
        var results = exec(`npm publish`, {cwd: cwd });
    } catch (err) {
        console.error(`Build error ${err.message}`);
    }

    console.log(results.toString());
});

