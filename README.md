# package-dependencies-analysis

这是一个包依赖分析工具，主要功能包括：

1. 分析 npm 包的依赖关系，可以分析本地项目或者远程 npm 包
1. 递归地获取所有依赖及其子依赖，构建完整的依赖树
1. 支持两种输入方式：
  - 本地项目路径或 package.json 文件路径
  - npm 包名称


程序的工作流程：

1. 接收命令行参数作为输入路径或包名
1. 如果是本地路径，读取 package.json 文件并解析依赖
1. 如果是包名，从 npm 注册表获取最新版本信息和依赖
1. 对每个直接依赖，递归获取其所有子依赖
1. 最终输出完整的依赖树结构（JSON 格式）

程序使用了 semver 库来处理版本号比较和满足版本要求的包选择，使用 axios 进行 HTTP 请求获取包信息。整个过程是递归的，从顶层依赖一直深入到最底层的依赖包。




<!-- 

https://registry.npmjs.org/package-dependencies-analysis/[version][tag]  
https://registry.npmjs.org/package-dependencies-analysis/0.0.1-beta.2  
https://registry.npmjs.org/package-dependencies-analysis/latest  


-->