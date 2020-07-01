export default async (
  array: any[],
  callback: (val: any, index: number, arr: any[]) => void
) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};
