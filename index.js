const fs = require('fs')
const path = require('path')

function main(pathOrPackageName) {
  const pathDir = path.join(__dirname, pathOrPackageName)
  const stat = fs.statSync(pathDir)
  if (stat.isDirectory()) {
    // 目录
    const packageJsonContent = fs.readFileSync(path.join(pathDir, 'package.json'))
    const packageJson = JSON.parse(packageJsonContent)
    const allDependencies = Object.assign({},packageJson.dependencies,packageJson.devDependencies)
    console.log(allDependencies)
  }

}

const pathOrPackageName = process.argv[2]
console.log(pathOrPackageName)
main(pathOrPackageName)