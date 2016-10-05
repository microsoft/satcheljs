This repository contains shared controls for OWA. To build everything in one go, type this:

    npm run build

When built, individual packages are created inside the "dist" directory. Individual package.json files 
inside the packages/[package name] directories are actually consumed. The dependencies are used by the 
consumers of the packages - so please keep them up-to-date.

Since the controls inside this repository contains multiple packages that share similar versions of 
dependencies, the actual versions are controlled by the top level package.json. The names of the
dependencies are declared inside the individual package.json's. So, after setting up the dependencies,
make sure the main package.json has the updated version numbers. Then, run a special command to
synchronize the versions for all the packages inside this repo:

    npm run normalize

To build and develop individual packages, go inside one and run:

    npm start

Don't forget that if you want to consume it in an application DURING development, you can use the
npm link technique to keep you focused. This means that you would go inside the /dist/[package name],
and type:

    npm link

Then, in your application that consumes the package, you would then type:

    npm link [package name]

 