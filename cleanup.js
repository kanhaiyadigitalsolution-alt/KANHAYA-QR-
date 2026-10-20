import { db } from './db';
// १ तासापेक्षा जुन्या फाईल्स डिलीट करतो
export async function cleanup() {
  const d = db();
  const t = new Date(Date.now() - 3600e3).toISOString();
  const { data } = await d.from('jobs').select('id,file_path').not('file_path', 'is', null).lt('created_at', t).limit(200);
  if (data?.length) {
    await d.storage.from('files').remove(data.map((j) => j.file_path));
    await d.from('jobs').update({ file_path: null, status: 'expired' }).in('id', data.map((j) => j.id));
  }
}
