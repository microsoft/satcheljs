var fs = require('fs');
var path = require('path');
var packagePath = path.resolve(__dirname, '../packages');
var collectPackages = require('./collect-packages');
var packages = collectPackages(packagePath).map(p => p.replace('packages/', ''));

packages.forEach((package) => {
    var target = path.resolve(__dirname, '../node_modules', package);
    var source = path.resolve(__dirname, '../dist/', package);

    if (!fs.existsSync(target)) {
        fs.symlinkSync(source, target, "junction");
    }
});
