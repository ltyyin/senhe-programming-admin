import request from "@/utils/request";

export function getCategoryListData() {
  return request({
    url: "/categories",
    method: "get",
  });
}

export function queryCategory(params) {
  return request({
    url: "/categories/query",
    method: "get",
    params,
  });
}

export function addCategory(data) {
  return request({
    url: "/categories/add",
    method: "post",
    data,
  });
}

export function updateCategory(id) {
  return request({
    url: "/categories/modify",
    method: "patch",
    data: { id },
  });
}

export function deleteCategory(id) {
  return request({
    url: `/categories/${id}`,
    method: "delete",
  });
}

export function getNormalList() {
  return request({
    url: "/categories/normal-list",
    method: "get",
  });
}
