## [名詞解釋](https://mp.weixin.qq.com/s/BwPufhsHDnnw7D50tuFk_g)

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
