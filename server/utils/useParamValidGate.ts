import { z, ZodType } from "zod/v4";
import { ErrCode } from "~/types/enums/ErrCode";
import { fromError, createErrorMap } from 'zod-validation-error/v4';

const baseSchema = z.object({});

z.config({
    customError: createErrorMap({
      includePath: true,
    }),
  });

type SchemaType = typeof baseSchema;

interface IUseParmValidGate<Q, B> {
    query?: ZodType<Q>;
    body?: ZodType<B>;
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
            const validationError = fromError(queryResult.error);
            return throwLogicError({
                code: ErrCode.INVALID_PARAM,
                msg: validationError.message || 'Invalid query',
                data: {
                    name: validationError.name,
                    details: validationError.details,
                },
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
                const validationError = fromError(bodyResult.error);
                return throwLogicError({
                    code: ErrCode.INVALID_PARAM,
                    msg: validationError.message || 'Invalid body',
                    data: {
                        name: validationError.name,
                        details: validationError.details,
                    },
                })
            }
            result.body = bodyResult.data;
        }
    }
    return result;
}
