#!/usr/bin/env ts-node
"use strict";
var fs = require("fs");
var path = require("path");

var projectRootDir = process.env.CAPACITOR_ROOT_DIR || "";
var platform = process.env.CAPACITOR_PLATFORM_NAME;
if (!projectRootDir) {
    throw new Error("CAPACITOR_ROOT_DIR environment variable is not set.");
}
if (platform !== "web") {
    console.log(" >>>> ✅ CAPACITOR_PLATFORM_NAME :: " + platform);
    var configPath = path.join(projectRootDir, "capacitor.config.json");
    console.log(" >>>> ✅ configPath :: " + configPath);
    if (fs.existsSync(configPath)) {
        var config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        console.log(" >>>> \u2705 Application Name: " + config.appName);
        console.log(" >>>> \u2705 Package Id: " + config.appId);

         // Localiza e modifica o arquivo capacitor.build.gradle
    const gradlePath = path.join(
        projectRootDir,
        "android/app",
        "capacitor.build.gradle"
    );
    console.log(` >>>> ✅ Gradle Path: ${gradlePath}`);

    if (fs.existsSync(gradlePath)) {
        let gradleContent = fs.readFileSync(gradlePath, "utf-8");

        // Define a linha que será comentada
        const lineToComment = "implementation project(':smartwatch')";
        const commentedLine = `// ${lineToComment}`;

        if (gradleContent.includes(lineToComment) && !gradleContent.includes(commentedLine)) {
            // Substitui a linha pela versão comentada
            gradleContent = gradleContent.replace(
                lineToComment,
                commentedLine
            );
            fs.writeFileSync(gradlePath, gradleContent, "utf-8");
            console.log(
                ` >>>> ✅ Linha "${lineToComment}" comentada com sucesso no arquivo capacitor.build.gradle`
            );
        } else if (gradleContent.includes(commentedLine)) {
            console.log(
                ` >>>> ⚠️ A linha já está comentada no arquivo capacitor.build.gradle.`
            );
        } else {
            console.log(
                ` >>>> ⚠️ A linha "${lineToComment}" não foi encontrada no arquivo capacitor.build.gradle.`
            );
        }
    } else {
        throw new Error("File capacitor.build.gradle not found.");
    }

    }
    else {
        throw new Error("File capacitor.config.json not found.");
    }
}
