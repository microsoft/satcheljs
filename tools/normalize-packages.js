var fs = require('fs');
var path = require('path');
var packagePath = path.resolve(__dirname, '../packages');
var packages = fs.readdirSync(packagePath);
var exec = require('child_process').execSync;

var mainPackageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json')));

packages.forEach((package) => {
    console.log(`normalizing ${package}...`);
    normalizePackageJson(package, packages);
    normalizeTsConfigJson(package, packages);
});

function readPackageJson(package) {
    var packageJsonFilePath = path.join(packagePath, package, 'package.json');
    var content = fs.readFileSync(packageJsonFilePath);
    var packageJson = JSON.parse(content);
    return packageJson;
}

function normalizePackageJson(package, packages) {
    var packageJsonFilePath = path.join(packagePath, package, 'package.json');
    var packageJson = readPackageJson(package);

    Object.keys(packageJson.dependencies).forEach((dep) => {
        if (packages.indexOf(dep) > -1) {
            packageJson.dependencies[dep] = mainPackageJson.version;
        } else if (mainPackageJson.dependencies[dep]) {
            packageJson.dependencies[dep] = mainPackageJson.dependencies[dep];
        } else {
            console.error("there is a missing dependency in the main package.json: ", dep);
        }
    });

    packageJson.version = mainPackageJson.version;

    packageJson.scripts = {
        "copy-project-files": "node ../../tools/copy-project-files.js",
        "build": "npm run copy-project-files && node ../../node_modules/typescript/lib/tsc.js",
        "start": "npm run copy-project-files && node ../../node_modules/typescript/lib/tsc.js -w"
    };

    fs.writeFileSync(packageJsonFilePath, JSON.stringify(packageJson, null, 2));
}

function normalizeTsConfigJson(package, packages) {
    var tsConfigJsonFilePath = path.join(packagePath, package, 'tsconfig.json');
    var content = fs.readFileSync(tsConfigJsonFilePath);
    var packageJson = readPackageJson(package);
    var json = JSON.parse(content);

    json.compilerOptions.paths = {};

    Object.keys(packageJson.dependencies).forEach((dep) => {
        if (packages.indexOf(dep) > -1) {
            json.compilerOptions.paths[`${dep}/lib/*`] = [`../${dep}/lib/*`];
        }
    });

    if (Object.keys(json.compilerOptions.paths).length == 0) {
        json.compilerOptions.outDir = `../../dist/${package}/lib`;
    } else {
        json.compilerOptions.outDir = `../../dist/`;
    }

    fs.writeFileSync(tsConfigJsonFilePath, JSON.stringify(json, null, 2));
}