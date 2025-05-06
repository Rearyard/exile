import { z, ZodSchema } from "zod";
import { ErrCode } from "~/types/enums/ErrCode";

const baseSchema = z.object({});

type SchemaType = typeof baseSchema;

interface IUseParmValidGate<Q, B> {
    query?: ZodSchema<Q>;
    body?: ZodSchema<B>;
}

export const useParamValidGate = async <Q, B>(options: IUseParmValidGate<Q, B>) => {
    const result: {
        query: Q;
        body: B;
    } = {
        query: {} as Q,
        body: {} as B,
    };
    const event = useEvent();
    const method = event.method;
    if (options.query) {
        const queryResult = await getValidatedQuery(event, options.query.safeParse);
        if (!queryResult.success) {
            return throwLogicError({
                code: ErrCode.INVALID_PARAM,
                msg: queryResult.error.message,
                data: queryResult.error.format(),
            })
        }
        result.query = queryResult.data;
    }
    if (options.body) {
        if (!(method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            console.warn(`Body is only allowed for POST, PUT and PATCH methods, but got ${method}`);
        } else {
            const bodyResult = await readValidatedBody(event, options.body.safeParse);
            if (!bodyResult.success) {
                return throwLogicError({
                    code: ErrCode.INVALID_PARAM,
                    msg: bodyResult.error.message,
                    data: bodyResult.error.format(),
                })
            }
            result.body = bodyResult.data;
        }
    }
    return result;
}
