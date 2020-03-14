# webpack核心概念
- entry: 入口
- output: 输出
- loader: 模块转换器，用于把模块原内容按照需求转换成新内容
- 插件(plugins): 扩展插件，在webpack构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要做的事情

### 如何处理样式文件
- 安装依赖
```
npm install style-loader less-loader css-loader postcss-loader autoprefixer less -D
```
```javascript
//webpack.config.js
module.exports = {
    //...
    module: {
        rules: [
            {
                test: /\.(le|c)ss$/,
                use: ['style-loader', 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: function () {
                            return [
                                require('autoprefixer')({
                                    "overrideBrowserslist": [
                                        ">0.25%",
                                        "not dead"
                                    ]
                                })
                            ]
                        }
                    }
                }, 'less-loader'],
                exclude: /node_modules/
            }
        ]
    }
}
```
  - style-loader 动态创建 style 标签，将 css 插入到 head 中.
  - css-loader 负责处理 @import 等语句。
  - postcss-loader 和 autoprefixer，自动生成浏览器兼容性前缀 —— 2020了，应该没人去自己徒手去写浏览器前缀了吧
  - less-loader 负责处理编译 .less 文件,将其转为 css
  ##### 注意
  - loader 的执行顺序是从右向左执行的，也就是后面的 loader 先执行，上面 loader 的执行顺序为: less-loader ---> postcss-loader ---> css-loader ---> style-loader

  - 当然，loader 其实还有一个参数，可以修改优先级，enforce 参数，其值可以为: pre(优先执行) 或 post (滞后执行)。

  - 现在，我们已经可以处理 .less 文件啦，.css 文件只需要修改匹配规则，删除 less-loader 即可。
