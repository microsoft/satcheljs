var fs = require('fs');
var path = require('path');
var packagePath = path.resolve(__dirname, '../packages');
var packages = fs.readdirSync(packagePath);
var exec = require('child_process').execSync;

var registry = process.argv[2];

if (!registry) {
    console.error("Registry not specified!");
    process.exit(1);
}

var npmrc = path.resolve(__dirname, '../.npmrc');

packages.forEach((package) => {
    console.log(`publish ${package}...`);

    try {
        var results = exec(`npm publish --registry ${registry} --userconfig ${npmrc}`, {cwd: path.resolve(__dirname, '../dist', package) });
    } catch (err) {
        console.error(`Build error ${err.message}`);
        process.exit(1);
    }

    console.log(results.toString());
});

