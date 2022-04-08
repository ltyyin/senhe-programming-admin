import request from "@/utils/request";

export function getCategoryListData() {
  return request({
    url: "/articles/category",
    method: "get",
  });
}

export function getCategorySearch(params) {
  return request({
    url: "/articles/category/search",
    method: "get",
    params,
  });
}

export function addCategory(data) {
  return request({
    url: "/articles/category/add",
    method: "post",
    data,
  });
}

export function updateCategory(id) {
  return request({
    url: "/articles/category/modify",
    method: "patch",
    data: { id },
  });
}

export function deleteCategory(id) {
  return request({
    url: `/articles/category/${id}`,
    method: "delete",
  });
}

export function getNormalList() {
  return request({
    url: "/articles/normal-list",
    method: "get",
  });
}
