<template>
  <div>
    <Row>
      <Row>
        <iCol span="20">
          <span class="tag tag-green">生化危机</span>
          <span class="tag tag-red">NC-17</span>
          <span class="title">【Wesker/Chris】那些好日子</span>
        </iCol>
        <iCol span="4">
          <Button type="info">编辑</Button>
        </iCol>
      </Row>
      <Row class="list-content">
        <iCol>
          <p>我会晚上在你耳边呢喃爱你，又在天明时抽身离去。</p>
        </iCol>
      </Row>
      <Row class="list-footer">
        <iCol span="16">
          <span>字数：12000 章节：3/5 评论：20 阅读：1300</span>
        </iCol>
        <iCol span="8">
          <i>25 seconds ago/25 seconds ago</i>
        </iCol>
      </Row>
      <Divider />
    </Row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {}
    };
  }
};
</script>

<style scoped>
.tag {
  color: #fff;
  background: gray;
  padding: 4px;
  border-radius: 5px;
  margin: 2px;
}
.tag-green {
  background: #9dd1a9;
}
.tag-red {
  background: #ea534f;
}
.title {
  font-size: 1.2em;
}
.list-content,.list-footer{
  margin:5px;
  padding:5px;
}
.list-footer {
  font-size: 0.9em;
  color: gray;
}
</style>