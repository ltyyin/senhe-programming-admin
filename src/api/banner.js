import request from "@/utils/request";

export function getBannerList() {
  return request({
    url: "/banner",
    method: "get",
  });
}

export function addBanner(data) {
  return request({
    url: "/banner/add",
    method: "post",
    data,
  });
}

export function updateBanner(data) {
  return request({
    url: "/banner/modify",
    method: "patch",
    data,
  });
}

export function deleteBanner(id) {
  return request({
    url: `/banner/${id}`,
    method: "delete",
  });
}
