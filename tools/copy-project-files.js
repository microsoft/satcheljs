var fs = require('fs');
var path = require('path');
var glob = require('glob');
var mkdirp = require('mkdirp');

var outputPath = path.resolve(__dirname, '../dist');
var cwd = process.cwd();
var packageName = path.basename(cwd);

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
}

if (!fs.existsSync(path.join(outputPath, packageName))) {
    fs.mkdirSync(path.join(outputPath, packageName));
}

fs.createReadStream(path.join(cwd, 'package.json'))
  .pipe(fs.createWriteStream(path.join(outputPath, packageName, 'package.json')));

glob.sync('lib/**/*.@(scss|css)').forEach((f) => {
    var outfile = path.join(outputPath, packageName, f);
    mkdirp.sync(path.dirname(outfile));
    fs.writeFileSync(outfile, fs.readFileSync(f));
});
