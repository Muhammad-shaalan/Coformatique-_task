<template>
  <ul class="pagination justify-content-center flex-wrap">
    <li class="page-item prev-page" :class="page - 1 == 0 ? 'disabled' : ''">
      <a class="page-link" @click="$emit('pagination-num', page - 1)"> Prev </a>
    </li>
    <li
      class="page-item"
      v-for="(num, index) in total_pages"
      :key="index"
      :class="page == num ? 'active' : ''"
    >
      <a class="page-link" @click="$emit('pagination-num', num)">{{ num }}</a>
    </li>
    <li
      class="page-item next-page"
      :class="page + 1 > total_pages ? 'disabled' : ''"
    >
      <a class="page-link" @click="$emit('pagination-num', page + 1)">Next</a>
    </li>
  </ul>
</template>

<script>
export default {
  props: ["page", "total_pages"],
};
</script>
