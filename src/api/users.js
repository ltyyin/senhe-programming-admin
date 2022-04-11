import request from "@/utils/request";

export function getUserMList() {
  return request({
    url: "/users-m",
    method: "get",
  });
}

export function updateUserAccount(data) {
  return request({
    url: "/users-m",
    method: "patch",
    data,
  });
}

export function queryUserM(params) {
  console.log(params);
  return request({
    url: "/users-m/query",
    method: "get",
    params,
  });
}

export function deleteUserM(id) {
  return request({
    url: `/users-m/${id}`,
    method: "delete",
  });
}

export function setRole(data) {
  return request({
    url: `/users-m/set/role`,
    method: "patch",
    data,
  });
}
