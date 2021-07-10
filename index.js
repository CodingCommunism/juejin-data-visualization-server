const superagent = require('superagent');
const { Base64 } = require('js-base64');
const express = require('express')

const app = express();
const port = 8080
const cateList = [{
    type: '前端',
    id: '6809637767543259144'
}, {
    type: '后端',
    id: "6809637769959178254"
}, {
    type: 'Android',
    id: "6809635626879549454"
}, {
    type: 'ios',
    id: "6809635626661445640"
}, {
    type: '人工智能',
    id: "6809637773935378440"
}, {
    type: '开发工具',
    id: "6809637771511070734"
}, {
    type: '代码人生',
    id: "6809637776263217160"
}, {
    type: '阅读',
    id: "6809637772874219534"
}
]
const getArticles = async (cateId) => {
    let articleList = [];
    let i = 0;
    let cursorObject = {
        "v": '',
        "i": 0,
    }
    while (i < 100) {
        const isInit = i == 0;
        cursorObject["i"] = i;
        const resData = await superagent.post('https://api.juejin.cn/recommend_api/v1/article/recommend_cate_feed').send({
            id_type: 2,
            sort_type: 0,
            cate_id: cateId,
            cursor: i == 0 ? "0" : Base64.encode(JSON.stringify(cursorObject)),
            limit: 20
        })
        const resArticles = JSON.parse(resData.text).data;
        if (isInit) {
            cursorObject["v"] = resArticles[0].article_id;
        }
        articleList.push(...resArticles);
        i += 20;
    }
    return articleList;
}
app.get('/api/local/article', async (req, res) => {
    const articleList = [];
    for (const cate of cateList) {
        const articles = await getArticles(cate.id)
        articleList.push({
            type: cate.type,
            articles
        })
    }
    res.send(articleList)
})



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})