import request from "@/utils/request";

export function getCourseList() {
  return request({
    url: "/courses",
    method: "get",
  });
}

export function queryCourse(params) {
  return request({
    url: "/courses/query",
    method: "get",
    params,
  });
}

export function auditSuccess(id) {
  return request({
    url: "/courses/audit/success",
    method: "get",
    params: { id },
  });
}

export function auditFail(id) {
  return request({
    url: "/courses/audit/fail",
    method: "get",
    params: { id },
  });
}

export function deleteCourse(id) {
  return request({
    url: `/courses/${id}`,
    method: "delete",
  });
}
