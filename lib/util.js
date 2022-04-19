const ora = require('ora')
const sleep = (time) => new Promise((res) => setTimeout(res, time))
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

module.exports = {
    wrapLoading
}