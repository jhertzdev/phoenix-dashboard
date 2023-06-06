import { instance } from ".";

export default async function getBank({ list = 1, } = {}) {
  const { data } = await instance.get(
    `/bank?list=${list}`
  );
  return data;
}