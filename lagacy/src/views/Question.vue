<template>
  <div>
    <Row style="margin-top:2rem; ">
        <i-col
            :xs="{ span: 8}"
            :sm="{ span: 7}"
            :md="{ span: 6}"
            :lg="{ span: 5}"
        >
            <div style="padding-left:1.5rem;margin-top:1rem;">
                <Anchor show-ink style="padding-top:1rem;" :offset-top=100>
                    <AnchorLink href="#article_rating" title="1 关于文章的发布和分级">
                        <AnchorLink href="#how_to_rating" title="1.1 发布文章的时候应该如何分级？" />
                        <AnchorLink href="#how_to_tag" title="1.2 发布文章时，应如何填写相应标签？"/>
                        <AnchorLink href="#what_can_i_see" title="1.3 我能够查看哪些分级的文章？" />
                        <AnchorLink href="#rating_problem" style="overflow:visible" title="1.4 我已成年，为何不能查看相应分级的文章？"/>
                    </AnchorLink>
                    <AnchorLink href="#about_account" title="2 关于账号">
                        <AnchorLink href="#why_rating_problem" title="2.1 为什么我的账号只能查看清水文章？" />
                        <AnchorLink href="#my_provement" title="2.2 我的自证审核通过了吗？" />
                        <AnchorLink href="#how_if_failed" title="2.3 我的自证审核失败了怎么办？" />
                        <AnchorLink href="#how_to_activate" title="2.4 无法收到激活邮件该怎么办？" />
                        <AnchorLink href="#forget_username" title="2.5 忘记了注册时的用户名该怎么办？" />
                        <AnchorLink href="#forget_password" title="2.6 忘记了密码该怎么办？" />
                    </AnchorLink>
                    <AnchorLink href="#feedback_bug" title="3 关于BUG">
                        <AnchorLink href="#how_to_feedback" title="3.1 遇到BUG该怎么办？" />
                    </AnchorLink>
                </Anchor>
            </div>
        </i-col>
        <i-col
            :xs="{ span: 16}"
            :sm="{ span: 17}"
            :md="{ span: 18}"
            :lg="{ span: 19}"
        >
            <div style="padding-left:1rem;padding-right:4rem; margin-top:1rem;">
                <div class="wrapper-card">
                    <div id="article_rating">
                        <p style="font-size:1.2rem"><strong>1 关于文章的发布和分级</strong></p>
                        <div id="how_to_rating" style="padding:1rem 0 1rem 0;">
                            <p style="font-size:1.1rem"><strong>1.1 发布文章的时候应该如何给文章分级？</strong></p>
                            <p>文章共设有G、PG-13、R、NC-17四个分级。</p>
                            <p>
                                <strong>G级: </strong>无裸体、性爱描写，极少吸毒暴力描写。文章如果只包含一笔带过的亲吻，不涉及性描写的拥抱，少量的战斗场面和伤口描写，都应该被归类为G级文章。<br/>
                                <strong>PG-13级：</strong>一些内容对儿童不适宜，没有粗野的持续暴力描写，一般无裸体性爱描写，有时有吸毒和脏话描写。文章如果在每一章节内只有少于一个自然段的性爱/暴力/脏话描写，可以被归类为PG-13级文章。<br/>
                                <strong>R级：</strong>包含成人内容，有较多性爱、暴力、吸毒描写和脏话（大于10%）。如果文章涉及大于10%的性爱/暴力/脏话描写，应该被归类为R级。<br/>
                                <strong>NC-17级：</strong>存在大量性爱、暴力、吸毒描写和脏话（大于20%）如果文章涉及大于20%的性爱/暴力/脏话描写，应该被归类为NC-17级。
                            </p>
                        </div>
                        <div id="how_to_tag" style="padding:1rem 0 1rem 0;">
                            <p style="font-size:1.1rem"><strong>1.2 发布文章时，应如何填写相应标签？</strong></p>
                            <p>标题/分级/性向/警告按相应提示填写即可，关于分级的解释见1.1。</p>
                            <strong>值得注意的是“原作”这一栏，如果留空，系统将默认为原创而非同人作品。如果是同人作品请务必填写原作，不要留空。</strong>
                            <br/><strong>如果是作品RPS，请在原作栏填写“真人RPS”或更详细分类。例如：欧美RPS/电竞同人/声入人心等等。</strong>
                        </div>
                        <div id="what_can_i_see" style="padding:1rem 0 1rem 0;">
                            <p style="font-size:1.1rem"><strong>1.3 我能够查看哪些分级的文章？</strong></p>
                            <p>取决于您所填写的年龄，如下表所示：</p>
                            <Table border :columns="columns1" :data="data1"></Table>
                            <strong>如果您无法查看相应分级的文章，请去个人中心检查生日是否填写正确以及自证是否审核通过。</strong>
                        </div>
                        <div id="rating_problem" style="padding:1rem 0 1rem 0;">
                            <p style="font-size:1.1rem"><strong>1.4 我已成年，为何不能查看相应分级的文章？</strong></p>
                            有两种可能导致您无法查看相应分级的文章：① 您的生日填写错误。②您的自证审核未通过。<br/>
                            ① 请先去个人中心-基本信息页查看生日是否填写正确，如果填写错误可以进行修改，<strong>请注意，修改生日需要重新提交自证，每个用户只有一次重新提交自证的机会。</strong>
                            在管理员审核完成之前，您的账号将只能查看G级清水文章。如果审核失败，您的帐号将永久的只拥有查看G级文章的权限。<br/>
                            ② 如果生日确认无误，请在个人中心-基本信息页查看您的自证是否审核通过（如果是电脑端，请点击左侧栏的自证审查）。如果未通过，<strong>每个用户只有一次重新提交自证的机会（注意，如果您要修改生日，也会消耗掉这次机会）。</strong>
                            请尽量描写得详实，提供更多能证明年龄和身份的细节。<strong>例如：只写一句“高考很累也很充实”是不会被通过的，</strong>请提供类似“C++的指针很难学，经常导致内存溢出”或者“能斯特方程真是太神奇了，
                            高中的时候很疑惑自由能是怎么计算的”，或者类似“北三环合租都得三千八一个月”诸如此类能显著突出您拥有成年人阅历的描述，以上只是举个例子，并不是非要提供学术上的感受，如果没有把握，请尽量多写，内容足够真实，以方便管理员审核。
                        </div>
                    </div>
                    <div id="about_account">
                        <p style="font-size:1.2rem"><strong>2 关于账号</strong></p>
                        <div id="why_rating_problem" style="padding:1rem 0 1rem 0;">
                            <p style="font-size:1.1rem"><strong>2.1 为什么我的账号只能查看清水文章？</strong></p>
                            请先阅读<a href="question#what_can_i_see">1.3我能够查看哪些分级的文章？</a>，如果还有问题，请参考<a href="question#rating_problem">1.4 我已成年，为何不能查看相应分级的文章？</a>
                            <br /><strong>注意，如果两次自证审核都失败了，您的账号将永久只拥有查看清水文章的权限。</strong>
                        </div>
                        <div id="#my_provement" style="padding:1rem 0 1rem 0;">
                            <p style="font-size:1.1rem"><strong>2.2 我的自证审核通过了吗？</strong></p>
                            手机端请在底栏处点击最右边一个图标，打开个人中心在底部查看自证审核情况。电脑端请点击右上角的头像打开个人中心，点击左侧栏的“自证审查”查看情况。
                            <br/>如果审查未通过，您将拥有一次且仅拥有一次重新提交自证的机会<strong>（注意，如果您要修改生日，也会消耗掉这次机会。）</strong>。
                        </div>
                        <div id="#how_if_failed" style="padding:1rem 0 1rem 0;">
                            <p style="font-size:1.1rem"><strong>2.3 我的自证审核失败了怎么办？</strong></p>
                            每个用户拥有一次重新提交自证审核的机会<strong>（注意，如果您要修改生日，也会消耗掉这次机会。）</strong>
                            在提交自证审核的时候，请尽可能提供更多能证明年龄和身份的细节，写得越多越具有代表性，被通过的概率就越大。<br/>
                            <strong>只写一句“高考很累也很充实”是不会被通过的，请提供能显著说明您具有成年人阅历的自证。</strong><br/>
                            例如：可以从学术类下手，像“C++的指针很难学，经常导致内存溢出”或者“能斯特方程真是太神奇了，高中的时候很疑惑自由能是怎么计算的”。留学生可以直接写自己神神奇奇的专业或者只有留学生能看懂的暗号。（审核员里也有留学生）
                            也可以从生活阅历下手，例如“北三环去掉五险一金月薪不到一万合租都得三千八一个月”，以上只是举个例子，并不是非要从这些方面下手，内容足够真实即可，如果没有把握，请尽量多写，内容足够真实，以方便管理员审核。
                        </div>
                        <div id="#how_to_activate" style="padding:1rem 0 1rem 0;">
                            <p style="font-size:1.1rem"><strong>2.4 无法收到激活邮件该怎么办？</strong></p>
                            <p>请先去个人中心查看邮箱是否填写无误。如果无误，请先查看垃圾邮件以及被屏蔽邮件（如何查看被屏蔽邮件可以百度一下）。以上操作完之后如果还有问题，可以微博私信@陌_谦以及@珍珠斛_</p>
                        </div>
                        <div id="#forget_username" style="padding:1rem 0 1rem 0;">
                            <p style="font-size:1.1rem"><strong>2.5 忘记了注册时的用户名该怎么办？</strong></p>
                            <p>后续会上线邮箱登录功能，目前暂时没有办法，请牢记自己的用户名，急需登录的可以微博私信@陌_谦以及@珍珠斛_</p>
                        </div>
                        <div id="#forget_password" style="padding:1rem 0 1rem 0;">
                            <p style="font-size:1.1rem"><strong>2.6 忘记了密码该怎么办？</strong></p>
                            <p>点击登录页的“忘记密码”，按照网页要求操作之后去邮箱里找验证邮件，输入验证码之后即可修改新密码。</p>
                        </div>
                    </div>
                    <div id="feedback_bug">
                        <p style="font-size:1.2rem"><strong>3 关于BUG</strong></p>
                        <div id="#how_to_feedback" style="padding:1rem 0 1rem 0;">
                            <p style="font-size:1.1rem"><strong>3.1 遇到BUG该怎么办？</strong></p>
                            <p>后续会上线更详细的反馈渠道，目前请先微博私信@陌_谦以及@珍珠斛_。</p>
                        </div>
                    </div>
                </div>
            </div>
      </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  data() {
    return {
        columns1: [
            {
                title: '年龄',
                key: 'age'
            },
            {
                title: '能够查看的文章分级',
                key: 'rating'
            }
        ],
        data1: [
            {
                age: '小于13',
                rating: 'G',
            },
            {
                age: '13-15',
                rating: 'G、PG-13',
            },
            {
                age: '16-18',
                rating: 'G、PG-13、R',
            },
            {
                age: '大于18',
                rating: 'G、PG-13、R、NC-17',
            }
        ]
    };
  },
  mounted(){
    this._isMobile();
  },
  methods:{
    _isMobile(){
      this.isMobile = this.$store.state.isMobile;
    }
  }
};
</script>

<style scoped>
.wrapper-card {
  margin: 15px 0 15px 0;
  padding: 15px 30px 15px 30px;
  border: 1px solid rgb(226, 226, 226);
  background-color: #ffffff;
  box-shadow: 0px 10px 15px 12px rgba(208, 208, 208, 0.5);
  border-radius: 18px;
}
</style>