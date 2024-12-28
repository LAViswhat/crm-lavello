//Использование серверного middleware для работы с куки

import { defineEventHandler, H3Event, setCookie, deleteCookie } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const authHeader = getHeader(event, "Authorization");

  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    setCookie(event, "auth", token, {
      maxAge: 60 * 60 * 24 * 7,
    });
  } else {
    deleteCookie(event, "auth", { path: "/" });
  }
});
