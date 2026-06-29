const fs = require("fs")
const path = require("path")

const statsPath = path.join(__dirname, "stats.json")
const weeklyPath = path.join(__dirname, "weeklyStats.json")

function carregarStats(){
    if(!fs.existsSync(statsPath)){
        fs.writeFileSync(statsPath, JSON.stringify({}))
    }
    return JSON.parse(fs.readFileSync(statsPath, "utf-8"))
}

function salvarStats(stats){
    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2))
}

function carregarWeeklyStats(){
    if(!fs.existsSync(weeklyPath)){
        fs.writeFileSync(weeklyPath, JSON.stringify({}))
    }
    return JSON.parse(fs.readFileSync(weeklyPath, "utf-8"))
}

function salvarWeeklyStats(weeklyStats){
    fs.writeFileSync(weeklyPath, JSON.stringify(weeklyStats, null, 2))
}

module.exports = {
    carregarStats,
    salvarStats,
    carregarWeeklyStats,
    salvarWeeklyStats
}