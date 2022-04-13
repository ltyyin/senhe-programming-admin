import request from "@/utils/request";

export function getListData() {
  return request({
    url: "/home",
    method: "get",
  });
}
