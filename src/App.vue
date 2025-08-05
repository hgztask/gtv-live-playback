<script lang="ts" setup>
import {ref, watch} from "vue";
import defUtils from "./utils/defUtils.ts";
import axios from "axios";
import {batchAddVideoInfos, clearVideoInfos, getAllVideoInfos} from "./model/localDb.ts";


// 获取gtv数据
const getGtvDataJson = async () => {
  const updateTIme = localStorage.getItem('update-time');
  const currentDate = defUtils.getCurrentDate();
  //同一天更新时间时直接取本地缓存
  if (updateTIme === currentDate) {
    console.log('使用缓存数据', updateTIme);
    return getAllVideoInfos();
  }
  const url = import.meta.env.MODE === 'development' ? 'http://localhost:81/src/gtv/' : 'https://www.mikuchase.ltd/api/gtv/'
  const {data} = await axios.get(url)
  localStorage.setItem('update-time', currentDate);
  //更新本地缓存
  clearVideoInfos().then(() => {
    return batchAddVideoInfos(data);
  }).then(() => {
    console.log('更新缓存成功');
  }).catch((err) => {
    console.log('更新缓存失败', err);
  })
  return data
}

const gtvDataJson: any = ref([])

const showList: any = ref([])

const searchText = ref('');

const total: {
  value: number
} = ref(0);


const searchCacheShowList: any = ref([])
const handleCurrentChange = (val: number) => {
  if (searchCacheShowList.value.length === 0) {
    showList.value = defUtils.paginateData(gtvDataJson.value, val);
  } else {
    showList.value = defUtils.paginateData(searchCacheShowList.value, val);
  }
}
getGtvDataJson().then((res) => {
  gtvDataJson.value = res
  showList.value = defUtils.paginateData(res, 1);
  total.value = res.length;
})

watch(() => searchText.value, defUtils.debounce((searchVal: string) => {
  if (searchVal === "") {
    showList.value = defUtils.paginateData(gtvDataJson.value, 1);
    total.value = gtvDataJson.value.length;
    searchCacheShowList.value = [];
    return;
  }
  const filter = gtvDataJson.value.filter((item: any) => {
    return item.title.includes(searchVal);
  });
  if (filter.length === 0) {
    showList.value = filter;
    total.value = 0;
    return;
  }
  searchCacheShowList.value = filter
  showList.value = defUtils.paginateData(searchCacheShowList.value, 1);
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
    <el-pagination :background="true" :page-size="50"
                   :total="total" @current-change="handleCurrentChange"/>
  </div>
  <el-backtop :bottom="100" :right="100"/>
</template>

<style scoped>

</style>
