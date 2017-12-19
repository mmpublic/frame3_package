#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const packFile = process.argv[2];
const packListJsonFile = path.resolve(__dirname, '../list.json');

// 缺省发布使用master进行测试
const DIST_URL_BASE = 'https://github.com/mmpublic/github_frame3_packages/raw/master/packages';


if (!fs.existsSync(packFile)) {
  console.log("not found ", packFile);
  process.exit(1);
}

// 从文件名中解析包名和版本
const packFileName = path.parse(packFile).base
const m = packFileName.match(/^(.*)\.pack\.(.*)$/);
const packName = m[1];
const packVersion = m[2];

// 读取现有列表
let packList = {}
try {
  packList = JSON.parse(fs.readFileSync(packListJsonFile));
} catch (e) {
  console.log('Parse ', packListJsonFile, " Error:", e.message);
  console.log('Create New  ', packListJsonFile);
}

const stat = fs.statSync(packFile);

// 计算hash
const buffer = fs.readFileSync(packFile);
const fsHash = crypto.createHash('md5');
fsHash.update(buffer);
const md5 = fsHash.digest('hex');

// 更新列表文件
packList[packName] = {
  version: packVersion,
  size: stat.size,
  url: DIST_URL_BASE + '/' + packFileName,
  hash: md5
}
fs.writeFileSync(packListJsonFile, JSON.stringify(packList, null, 2));




