# linknote
A note-taking tool that help you study and research.
![image](public/image/logov0.2.png)

linknote，中文取名 联想笔记，是一支旨在协助和提高学习者或研究工作者作业效率的笔记工具。

## 介绍

我们工作，生活和学习都离不开信息的处理，做笔记是重要体现。相对于日常事务处理，学习和成长更依赖特定设计的信息处理协助工具——笔记工具。这是本项目设立初衷——针对认知和学习特性而设计笔记工具。

## 目录

- [linknote](#linknote)
  - [介绍](#介绍)
  - [目录](#目录)
  - [背景](#背景)
  - [实现技术](#实现技术)
  - [安装](#安装)
    - [1 项目源码依赖](#1-项目源码依赖)
    - [2 node版本14以上](#2-node版本14以上)
    - [3 mongodb配置](#3-mongodb配置)
  - [使用](#使用)
  - [Contributing](#contributing)
  - [License](#license)

## 背景

市面上大部分笔记工具只是针对日常事务作简单的设计，包括生活和工作的辅助，这些设计只是简单对笔记进行线性分类，要么简单一层（以笔记本为比喻），或者树状分类（工作文档以树状为多）。没有针对 人学习的特性而设计的笔记工具。

人学习的特性包括：
    - 第一，以主题为中心；将某个主题相关的笔记集中在一起；
    - 第二，联想，新思想都在多个思想片断“交锋”下产生，工具应该方便交叉关联多个思想片断；笔记的分类需更灵活；
    - 第三，新观念，工具可增加信息可能输入，简化信息输入，和降低消化的难度；这需工具的特殊的功能，例如外文翻译，文字格式化优化阅读等；

## 实现技术
本项目使用了最新Web 全栈技术实现，包括：
    - [Node.js](https://nodejs.org/en/)
    - [Express.js](https://www.expressjs.com)
    - [MongoDB(https://www.mongodb.com/)/ [Mongoose.js](http://www.mongoosejs.net)
    - [Pug](https://pugjs.org/api/getting-started.html)
    - [Passport.js](http://www.passportjs.org/)

## 安装
安装注意以下三点：
### 1 项目源码依赖
``` shell
$ npm install
```
### 2 node版本14以上
项目使用了最新ESM 模块系统（不是流行的CommonJS格式），故必须运行在 node 14 +

### 3 mongodb配置
MongoDB 可使用本地安装的，或者[官方](https://www.mongodb.com/))提供的测试实例。配置要在项目根目录下创建.env文件（[dotenv](https://www.npmjs.com/package/dotenv)），内容：

远程服务器：
MONGODB_URI＝mongodb+srv://<youdb_user>:<password>@cluster0.XXfc6.mongodb.net/<youdb_name>?retryWrites=true&w=majority
本地：
MONGODB_URI＝mongodb://localhost/linknote-app


## 使用
![image](public/image/mainpagev0.2.png)

## Contributing

PRs accepted.

## License

