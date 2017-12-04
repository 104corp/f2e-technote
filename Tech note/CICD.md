## [名詞解釋](https://mp.weixin.qq.com/s/BwPufhsHDnnw7D50tuFk_g)

## 參考教材

- [一條龍佈署 CI/CD 從 Github 跑 Travis 到 AWS CodeDeploy](https://shazi.info/%E4%B8%80%E6%A2%9D%E9%BE%8D%E4%BD%88%E7%BD%B2-ci-%E5%BE%9E-github-%E8%B7%91-travis-%E5%88%B0-aws-codedeploy-%E4%BB%8B%E7%B4%B9%E5%8F%8A%E6%8E%88%E6%AC%8A-travis-%E5%88%B0-github/)
- [CodeDeploy 權限設定](https://blog.gslin.org/archives/2017/02/04/7117/codedeploy-%E7%9A%84%E6%AC%8A%E9%99%90%E8%A8%AD%E5%AE%9A/)
- [Travis CI Deployment 官方教學](https://docs.travis-ci.com/user/deployment/)
- [建立 Amazon EC2 免費主機](http://diary.taskinghouse.com/posts/309383-setup-free-amazon-ec2-instance)
- [EC2 安裝 CodeDeploy Agent 官方教學](http://docs.aws.amazon.com/codedeploy/latest/userguide/codedeploy-agent-operations-install-linux.html)
- [AppSpec.xml 官方教學](http://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file.html)
- [打包的 Revision 規劃](http://docs.aws.amazon.com/codedeploy/latest/userguide/application-revisions-plan.html)
- [AWS Policy Generator](https://awspolicygen.s3.amazonaws.com/policygen.html)

## precautions

### travis
* [build lifecycle](https://docs.travis-ci.com/user/customizing-the-build/)
* node_module記得加[cache](https://blog.travis-ci.com/2013-12-05-speed-up-your-builds-cache-your-dependencies)
* 可將iam user設定在該專案的[envirment varialbe](https://docs.travis-ci.com/user/environment-variables/)
* hook deploy provider有幾個，hook before_deploy就會跑幾次 [issue](https://github.com/travis-ci/travis-ci/issues/2570)

### codedeploy
* [hook lifecycle](http://docs.aws.amazon.com/autoscaling/latest/userguide/lifecycle-hooks.html)
* 一定要先確認server上的code deploy agent有run起來，而且server要有取得s3 and node install policy
* 如果server有辦法對外存取，正常會跑hook流程，hook不論哪一階段錯誤，都可在aws console上看錯誤訊息
* check server startup on hook ValidateService, and then startup load balance
* 注意有使用 npm、node、nvm 等指令，除了 `runas: ec2-user` 要設定以外，還要多加 `source /home/ec2-user/.bash_profile` 才能正常呼叫指令（[reference](https://stackoverflow.com/questions/34032751/npm-issue-deploying-a-nodejs-instance-using-aws-codedeploy)）
* 如果是直接部署在 EC2 內，要使用 forever 等套件讓 node 程式背景執行，才不會導致 travis.xml 開了 `wait-until-deployed` 卻被 node 程式 block 住無法完成 CD
