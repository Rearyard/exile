import { ErrCode, PostgresErrorCode } from "~/types/enums/ErrCode";
import { xssFilter } from "#shared/utils/xssFilter";
export default defineEventHandler(async (event) => {
  const sqid = getRouterParam(event, "sqid") || "";
  const rawId = decodeSqid(sqid);
  console.log(rawId);

  if (!rawId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid ID",
    });
  }

  const { serviceRoleClient, requiredUser } = await useSupabase();
  // await requiredUser();

  const { data, error } = await serviceRoleClient
    .from("tag")
    .select("id, name")
    .eq("id", rawId)
    .single();

  if (error) {
    switch (error.code) {
      case PostgresErrorCode.SINGLE_ITEM_VIOLATION:
        throw createError({
          statusCode: 404,
          statusMessage: "Not Found",
        });
      default:
        return throwLogicError({
          code: ErrCode.DB_ERROR,
          msg: error.code,
        });
    }
  }

  return {
    id: encodeSqid([data.id]),
    name: xssFilter(data.name),
  };
});
