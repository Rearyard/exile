import { EventHandler, EventHandlerRequest } from "h3";

export const defineDevOnlyHandler = <T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>
): EventHandler<T, D> =>
  defineEventHandler<T>(async (event) => {
    if (import.meta.dev) {
      return handler(event);
    }

    throw createError({
      statusCode: 404,
    });
  });
