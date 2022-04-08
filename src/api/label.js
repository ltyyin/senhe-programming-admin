import request from "@/utils/request";

export function getLabelListData() {
  return request({
    url: "/labels",
    method: "get",
  });
}

export function queryLabelList(params) {
  return request({
    url: "/labels/query",
    method: "get",
    params,
  });
}

export function addLabel(data) {
  return request({
    url: "/labels/add",
    method: "post",
    data,
  });
}

export function updateLabel(data) {
  return request({
    url: "/labels/modify",
    method: "patch",
    data,
  });
}

export function deleteLabel(id) {
  return request({
    url: `/labels/${id}`,
    method: "delete",
  });
}
