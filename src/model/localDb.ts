import Dexie, {type EntityTable} from "dexie";

interface videoInfo {
    url: string;
    time: string;
    date: string;
    title: string;
    img: string;
}

const db = new Dexie('gtv-db') as Dexie & {
    videoInfos: EntityTable<videoInfo, 'url'>
};

db.version(1).stores({
    videoInfos: 'url,time,date,title,img',
});


//批量插入
export async function batchAddVideoInfos(videoInfos: any[]) {
    await db.videoInfos.bulkAdd(videoInfos);
}

//获取所有视频数据
export async function getAllVideoInfos() {
    return db.videoInfos.toArray();
}

//清空视频数据
export async function clearVideoInfos() {
    await db.videoInfos.clear();
}


export type {videoInfo};

