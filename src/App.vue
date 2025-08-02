<script lang="ts" setup>
import gtvDataJson from './assets/yk.json'
import {ref, watch} from "vue";
import defUtils from "./utils/defUtils.ts";


function paginateData(dataArray: any[], pageNumber: any, itemsPerPage = pageSize.value) {
  // 确保页码是正整数（最小为1）
  const currentPage = Math.max(1, parseInt(pageNumber) || 1);

  // 计算截取的起始索引（从0开始）
  const startIndex = (currentPage - 1) * itemsPerPage;

  // 计算结束索引（不超过数组长度）
  const endIndex = Math.min(startIndex + itemsPerPage, dataArray.length);

  // 返回截取后的分页数据
  return dataArray.slice(startIndex, endIndex);
}

const showList: any = ref([])

const searchText = ref('');

const total: {
  value: number
} = ref(0);

const pageSize: {
  value: number
} = ref(50);

const searchCacheShowList: any = ref([])
const handleCurrentChange = (val: number) => {
  if (searchCacheShowList.value.length === 0) {
    showList.value = paginateData(gtvDataJson, val);
  } else {
    showList.value = paginateData(searchCacheShowList.value, val);
  }
}

showList.value = paginateData(gtvDataJson, 1);
total.value = gtvDataJson.length;

watch(() => searchText.value, defUtils.debounce((searchVal: string) => {
  if (searchVal === "") {
    showList.value = paginateData(gtvDataJson, 1);
    total.value = gtvDataJson.length;
    searchCacheShowList.value = [];
    return;
  }
  const filter = gtvDataJson.filter(item => item.title.includes(searchVal));
  if (filter.length === 0) {
    showList.value = filter;
    total.value = 0;
    return;
  }
  searchCacheShowList.value = filter
  showList.value = paginateData(searchCacheShowList.value, 1);
  total.value = searchCacheShowList.value.length;
}, 1000))


</script>
<template>
  <div>
    <el-form>
      <el-form-item label="统计">
        <el-tag>总数：{{ gtvDataJson.length }}</el-tag>
        <el-tag>列表数：{{ total }}</el-tag>
        <el-tag>当前列数：{{ showList.length }}</el-tag>
        <el-tag>搜索结果：{{ searchCacheShowList.length }}</el-tag>
      </el-form-item>
      <el-form-item label="标题搜索">
        <el-input v-model.trim.lazy="searchText" placeholder="标题关键词"></el-input>
      </el-form-item>
    </el-form>
    <el-table :data="showList" border stripe style="width: 100%">
      <el-table-column label="封面" width="220">
        <template #default="scope">
          <el-link :href="scope.row.url" target="_blank">
            <el-image :src="scope.row.img" fit="contain" lazy/>
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="日期" prop="date" width="140"/>
      <el-table-column label="标题" prop="title">
        <template #default="scope">
          <el-link :href="scope.row.url" target="_blank">{{ scope.row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="时长" prop="time" width="80"/>
      <el-table-column label="视频地址" prop="url" width="700">
        <template #default="scope">
          <el-link :href="scope.row.url" target="_blank">{{ scope.row.url }}</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :background="true" :page-size="pageSize"
                   :total="total" @current-change="handleCurrentChange"/>
  </div>
  <el-backtop :bottom="100" :right="100"/>
</template>

<style scoped>

</style>
