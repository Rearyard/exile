<template>
  <div>
    <Layout class="layout">
      <Header class="layout-header-bar">Header</Header>
      <Content>
        <router-view />
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  </div>
</template>
<script>
export default {};
</script>

<script>

export default {
  name: "app",

};
</script>

<style>
.layout {
  min-height: 100vh;
}
.layout-header-bar {
  background: #333333;
  color:#fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
</style>
