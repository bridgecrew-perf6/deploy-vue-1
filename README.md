# 部署Vue项目

准备工作：打包生成dist文件

```bash
npm run build
```

## 方法一、serve

**实际项目并不会这么部署，纯属了解。**

* 优点：一行命令搞定，非常便捷

* 如果是history模式下，刷新页面会报404。这是因为刷新时从服务器找不到url对应的资源。
* hash模式则不存在此问题，因为hash后面的内容并不会发送到服务器。浏览器获取到的是html，再由单页面根据hash进行页面内的调转。
* 下面的方法二、方法三、方法四均可解决history模式下页面刷新404的问题

1. 安装 [serve](https://www.npmjs.com/package/serve)

    ```bash
    # npm
    npm install -g serve
    # yarn
    yarn global add serve
    ```

2. 启动 server

    ```bash
    # 在dist所在目录执行
    serve dist
    ```

3. 访问 http://localhost:5000

## 方法二、express

**实际项目并不会这么部署，纯属了解。**

1. 创建一个express项目

   ```bash
   mkdir express-server
   cd express-server
   npm init -y
   npm i express
   ```

2. 在express-server中新建static目录，将dist放到static目录下

3. 在express-server中新建app.js

   ```js
   const express = require('express')
   const app = express()
   
   app.use(express.static(__dirname + '/static/dist/'))
   app.listen(8086, (err) => {
       if(!err) {
           console.log('服务器启动成功...');
       }
   })
   ```

4. 启动 server

   ```bash
   # express-server目录下执行
   node app.js
   ```

5. 访问 http://localhost:8086

6. 如果vue项目路由使用history模式，则需要进行以下操作

7. 安装 [connect-history-api-fallback](https://www.npmjs.com/package/connect-history-api-fallback)

   ```bash
   npm i connect-history-api-fallback
   ```

8. 修改 app.js

   ```js
   const express = require('express')
   const history = require('connect-history-api-fallback')
   
   const app = express()
   
   // 注意顺序
   app.use(history())
   app.use(express.static(__dirname + '/static/dist/'))
   
   app.listen(8086, (err) => {
       if(!err) {
           console.log('服务器启动成功...');
       }
   })
   ```

## 方法三、SpringBoot

**实际项目并不会这么部署，纯属了解。**

1. 创建一个 SpringBoot 项目，要引入`spring-boot-starter-web` 依赖
2. 将dist中的所有文件拷贝到SpringBoot项目的resources/static目录下
3. 启动 server
4. 访问 http://localhost:8080
5. 如果vue项目路由使用history模式，则需要进行以下操作
6. 新建配置类

```java
import org.springframework.boot.web.server.ConfigurableWebServerFactory;
import org.springframework.boot.web.server.ErrorPage;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class WebConfig {
    @Bean
    public WebServerFactoryCustomizer<ConfigurableWebServerFactory> webServerFactoryCustomizer(){
        return factory -> {
            // 将错误页面指定为index.html
            ErrorPage error404Page = new ErrorPage(HttpStatus.NOT_FOUND, "/index.html");
            Set<ErrorPage> errorPages = new HashSet<>();
            errorPages.add(error404Page);
            factory.setErrorPages(errorPages);
        };
    }
}
```

## 方法四、nginx

**实际项目常用部署方式**

1. 修改nginx的配置文件 `nginx.conf`

   ```conf
   # 新增server
   server {
       listen       8088;
       server_name  localhost;
   
       location / {
           root   vue-demo/dist;
           index  index.html index.htm;
       }
   }
   ```

2. 将dist拷贝至nginx目录下的vue-demo

3. 启动nginx

4. 访问 http://localhost:8088

5. 如果vue项目路由使用history模式，则需要进行以下操作

6. 修改 `nginx.conf`,  try_files配置项参考[博客](https://www.cnblogs.com/jedi1995/p/10900224.html)，作用：在匹配不到url时返回index.html，由前端进行路由跳转

   ```conf
   server {
       listen       8088;
       server_name  localhost;
   
       location / {
           root   vue-demo/dist;
           index  index.html index.htm;
           try_files $uri $uri/ /index.html;
       }
   }
   ```

7. 重启nginx

   ```bash
   nginx -s reload
   ```

   
