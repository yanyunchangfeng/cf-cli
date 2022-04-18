const { fetchRepoList, fetchTagList } = require("./request");
const Inquirer = require('inquirer');
const sleep = (time) => new Promise((res) => setTimeout(res, time))
const downloadGitRepo = require('download-git-repo')
const util = require('util')
const ora = require('ora')
const path = require('path')
async function wrapLoading(fn, message, ...args) {
    const spinner = ora(message);
    spinner.start();
    try {
        let repos = await fn(...args);
        spinner.succeed();//成功
        return repos
    } catch (e) {
        spinner.fail('request failed, refetch ...' + e);
        await sleep(1000)
        return wrapLoading(fn, message, ...args)
    }
}
class Creator {
    constructor(projectName, targetDir) {
        this.name = projectName;
        this.target = targetDir;
        this.downloadGitRepo = util.promisify(downloadGitRepo)
    }
    async fetchRepo() {
        // 失败重新拉取
        let repos = await wrapLoading(fetchRepoList, 'waiting fetch template')
        // let repos = await fetchRepoList();
        // console.log(repos)
        if (!repos) return;
        repos = repos.map(item => item.name);
        let { repo } = await Inquirer.prompt({
            name: 'repo',
            type: 'list',
            choices: repos,
            message: 'please choose a template to create project:'
        })
        console.log(repo, 'repo')
        return repo
    }
    async fetchTag(repo) {
        let tags = await wrapLoading(fetchTagList, 'waiting fetch tag', repo);
        console.log(tags)
        if (!tags) return
        let { tag } = await Inquirer.prompt({
            name: 'tag',
            type: 'list',
            choices: tags,
            message: 'please choose a tag to create project:'
        })
        console.log(repo, 'repo')
        return tag
    }
    async download(repo, tag) {
        // 1. 需要拼接出下载路径来
        // yanyunchangfeng/vue-template#1.0
        let requestUrl = `yanyunchangfeng/${repo}${tag ? '#' + tag : ''}`
        // 2. 把资源下载到某个路径上（后续可以增加缓存功能,应该下载到系统目录中，稍后可以再使用ejs handlerbar 去渲染模版 最后生成结果 再写入）

        // 放到系统文件中 -> 模版和 用户的其他选择 =》 生成结果 放到当前目录下
        // await this.downloadGitRepo(requestUrl, path.resolve(process.cwd(), `${repo}@${tag}`))
        await wrapLoading(this.downloadGitRepo, 'waiting for download', requestUrl, path.resolve(process.cwd(), `${repo}@${tag}`))
        return this.targetDir
    }
    async create() {
        // 真实开始创建了
        // 采用远程拉取的方式 github
        // 2). 我们要实现脚手架 先做一个命令行交互的功能 inquirer
        // 3). 将模版下载下来 download-git-repo
        // 4). 根据用户的选择动态的生成内容 metalsmith

        // 1.先去拉取当前组织下的模版
        let repo = await this.fetchRepo();
        console.log(repo, 'repo')
        // 2. 再通过模版找到版本号
        let tag = await this.fetchTag(repo);
        //3 下载
        let downloadurl = await this.download(repo, tag)

        //4 编译模版
    }
}
module.exports = Creator