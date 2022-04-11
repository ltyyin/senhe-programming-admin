import request from "@/utils/request";

export function getRoleList() {
  return request({
    url: "/roles",
    method: "get",
  });
}

export function queryRole(params) {
  return request({
    url: "/roles/query",
    method: "get",
    params,
  });
}

export function addRole(data) {
  return request({
    url: "/roles/add",
    method: "post",
    data,
  });
}

export function updateRole(data) {
  return request({
    url: "/roles/modify",
    method: "patch",
    data,
  });
}

export function deleteRole(id) {
  return request({
    url: `/roles/${id}`,
    method: "delete",
  });
}

export function getPowerMenuList() {
  return request({
    url: "/roles/power/list",
    method: "get",
  });
}

export function updateRolePowers() {
  return request({
    url: "/roles/modify/power",
    method: "patch",
  });
}
