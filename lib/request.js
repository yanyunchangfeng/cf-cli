// 通过axios来获取结果
const axios = require('axios')
axios.interceptors.response.use(res => {
    return res.data;
})
async function fetchRepoList() {
    // 可以通过配置文件拉取不同的仓库对应的用户下的文件
    return axios.get('https://api.github.com/orgs/yycfFSET/repos')
    // return axios.get('https://api.github.com/users/yanyunchangfeng/repos')
}
async function fetchTagList(repo) {
    // 可以通过配置文件拉取不用的仓库对应的用户下的文件
    return axios.get(`https://api.github.com/repos/yycfFSET/${repo}/tags`)
    // return axios.get(`https://api.github.com/repos/yanyunchangfeng/${repo}/tags`)
}

module.exports = {
    fetchRepoList,
    fetchTagList
}