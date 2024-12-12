#!/usr/bin/env ts-node
var fs = require("fs");
var path = require("path");

var projectRootDir = process.env.CAPACITOR_ROOT_DIR || "";
var platform = process.env.CAPACITOR_PLATFORM_NAME;
if (!projectRootDir) {
    throw new Error("CAPACITOR_ROOT_DIR environment variable is not set.");
}

if (platform !== "web") {
    console.log(" >>>> ✅ CAPACITOR_PLATFORM_NAME :: " + platform);
    var buildGradlePath = path.join(projectRootDir, "android", "build.gradle");
    console.log(" >>>> ✅ Build Gradle Path :: " + buildGradlePath);

    if (fs.existsSync(buildGradlePath)) {
        let gradleContent = fs.readFileSync(buildGradlePath, "utf-8");

        const newClasspath = `classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:1.9.0"`;

        if (gradleContent.includes(newClasspath)) {
            console.log(" >>>> ⚠️ Classpath is already there build.gradle.");
        } else {
            const classpathRegex = /(classpath\s+["'][^"']+["'])/g;
            const matches = gradleContent.match(classpathRegex);

            if (matches && matches.length > 0) {
                const lastClasspath = matches[matches.length - 1];
                gradleContent = gradleContent.replace(
                    lastClasspath,
                    `${lastClasspath}\n        ${newClasspath}`
                );

                fs.writeFileSync(buildGradlePath, gradleContent, "utf-8");
                console.log(" >>>> ✅ Classpath added with success in build.gradle.");
            } else {
                console.log(" >>>> ⚠️ No file found build.gradle.");
            }
        }
    } else {
        throw new Error("File android/build.gradle not found.");
    }
}