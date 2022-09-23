const { default: axios } = require('axios')
const fs = require('fs')
const path = require('path')
const { SemVer, lt, maxSatisfying } = require('semver')

async function main(pathOrPackageName) {
  const pathDir = path.join(__dirname, pathOrPackageName)
  const stat = fs.statSync(pathDir)
  let allDependencies = {}
  if (stat.isDirectory()) {
    // 目录
    const packageJsonContent = fs.readFileSync(path.join(pathDir, 'package.json'))
    const packageJson = JSON.parse(packageJsonContent)
    allDependencies = Object.assign({}, packageJson.dependencies, packageJson.devDependencies)
    console.log(allDependencies)
  } else {

  }
  const packageNames = Object.keys(allDependencies)
  const result = {}
  for (let i = 0; i < packageNames.length; i++) {
    const packageName = packageNames[i]
    const temp = { version: allDependencies[packageName] }
    const packageDependencies = await getPackageDependencies(packageName, temp.version)
    if (Object.keys(packageDependencies).length > 0)
      temp.dependencies = packageDependencies
    result[packageName] = temp
  }
  console.log(JSON.stringify(result, null, 2))
}

async function getPackageDependencies(packageName, version) {
  const registryInfo = await axios.get(`https://registry.npmjs.org/${packageName}`)

  const versions = registryInfo.data.versions
  const versionNums = Object.keys(versions)
  const chooseMaxVersion = maxSatisfying(versionNums, version)
  const chooseVersionInfo = versions[chooseMaxVersion]
  const result = {}
  if (!chooseVersionInfo.dependencies) return result
  const keys = Object.keys(chooseVersionInfo.dependencies)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const temp = { version: chooseVersionInfo.dependencies[key] }
    const packageDependencies = await getPackageDependencies(key, chooseVersionInfo.dependencies[key])
    if (Object.keys(packageDependencies).length > 0)
      temp.dependencies = packageDependencies
    result[key] = temp
  }
  return result
}

const pathOrPackageName = process.argv[2]
console.log(pathOrPackageName)
main(pathOrPackageName)