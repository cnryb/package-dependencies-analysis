const { default: axios } = require('axios')
const fs = require('fs')
const path = require('path')
const { SemVer, lt, maxSatisfying } = require('semver')

async function main(pathOrPackageName) {
  const pathDir = path.join(__dirname, pathOrPackageName)

  let allDependencies = {}
  if (fs.existsSync(pathDir)) {
    const stat = fs.statSync(pathDir)
    if (stat.isDirectory()) {
      // 目录
      const packageJsonContent = fs.readFileSync(path.join(pathDir, 'package.json'))
      const packageJson = JSON.parse(packageJsonContent)
      allDependencies = Object.assign({}, packageJson.dependencies, packageJson.devDependencies)
    } else {
      // 文件
      const packageJsonContent = fs.readFileSync(pathDir)
      const packageJson = JSON.parse(packageJsonContent)
      allDependencies = Object.assign({}, packageJson.dependencies, packageJson.devDependencies)
    }

  } else {
    const registryInfo = await axios.get(`https://registry.npmjs.org/${pathOrPackageName}`)
    const chooseVersion = registryInfo.data['dist-tags'].latest
    const chooseVersionInfo = registryInfo.data.versions[chooseVersion]
    // allDependencies = Object.assign({}, chooseVersionInfo.dependencies, chooseVersionInfo.devDependencies)
    allDependencies = Object.assign({}, chooseVersionInfo.dependencies)
  }
  console.log(allDependencies)
  const packageNames = Object.keys(allDependencies)
  allDependenciesCount = packageNames.length
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
let allDependenciesCount = 0

async function getPackageDependencies(packageName, version) {
  console.log(allDependenciesCount++)
  // const registryInfo = await axios.get(`https://registry.npmjs.org/${packageName}`)
  const registryInfo = await axios.get(`https://registry.npmmirror.com/${packageName}`)
  // https://registry.npmmirror.com/
  const versions = registryInfo.data.versions
  const versionNumbers = Object.keys(versions)
  let chooseVersion = maxSatisfying(versionNumbers, version)
  if (!chooseVersion) {
    chooseVersion = registryInfo.data['dist-tags'][version]
    if (!chooseVersion) chooseVersion = registryInfo.data['dist-tags'].latest
  }
  const chooseVersionInfo = versions[chooseVersion]
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