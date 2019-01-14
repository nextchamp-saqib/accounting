<template>
  <div class="page-header px-4 py-3 border-bottom bg-white">
    <h5 class="m-0" v-if="title">{{ title }}</h5>
    <div v-if="breadcrumbs">
      <a
        v-for="(item, index) in clickableBreadcrumbs"
        :key="index"
        :href="item.route"
        >
        <h5 class="breadCrumbRoute">
          {{ item.title }}
          <feather-icon name="arrow-right"></feather-icon>
        </h5>
      </a>
      <h5 class="breadCrumbRoute">{{ lastBreadcrumb.title }}</h5>
    </div>
  </div>
</template>
<script>
export default {
  props: ['title', 'breadcrumbs'],
  computed: {
    clickableBreadcrumbs() {
      return this.breadcrumbs.slice(0, this.breadcrumbs.length - 1);
    },
    lastBreadcrumb() {
      return this.breadcrumbs[this.breadcrumbs.length - 1];
    }
  }
};
</script>
<style>
.page-header {
  position: sticky;
  top: 0;
  z-index: 1;
}
.breadCrumbRoute {
  display: inline;
}
a:hover {
  text-decoration: none
}
.feather-icon {
  position: relative;
  bottom: -2px
}
</style>
