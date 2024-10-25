// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "Smartwatch",
    platforms: [.iOS(.v13)],
    products: [
        .library(
            name: "Smartwatch",
            targets: ["SmartwatchApplicationPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", branch: "main")
    ],
    targets: [
        .target(
            name: "SmartwatchApplicationPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/SmartwatchApplicationPlugin"),
        .testTarget(
            name: "SmartwatchApplicationPluginTests",
            dependencies: ["SmartwatchApplicationPlugin"],
            path: "ios/Tests/SmartwatchApplicationPluginTests")
    ]
)