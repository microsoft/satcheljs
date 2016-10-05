var fs = require('fs');
var path = require('path');
var packagePath = path.resolve(__dirname, '../packages');
var packages = fs.readdirSync(packagePath);
var exec = require('child_process').execSync;

packages.forEach((package) => {
    console.log(`building ${package}...`);

    try {
        var results = exec(`npm run build`, {cwd: path.join(packagePath, package) });
    } catch (err) {
        console.error(`Build error ${err.message}`);
        process.exit(1);
    }

    console.log(results.toString());
});

