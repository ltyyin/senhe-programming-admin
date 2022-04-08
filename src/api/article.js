import request from "@/utils/request";

export function getArticleList() {
  return request({
    url: "/articles",
    method: "get",
  });
}

export function queryArticle(params) {
  return request({
    url: "/articles/query",
    method: "get",
    params,
  });
}

export function auditSuccess(id) {
  return request({
    url: "/articles/audit/success",
    method: "get",
    params: { id },
  });
}

export function auditFail(id) {
  return request({
    url: "/articles/audit/fail",
    method: "get",
    params: { id },
  });
}

export function deleteArticle(id) {
  return request({
    url: `/articles/${id}`,
    method: "delete",
  });
}
