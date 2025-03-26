
interface CommonResponseType<T> {
    statusCode: number
    msg: string
    data: T
}

export const CommonResponse = {
    success: <T>(data: T): CommonResponseType<T> => {
        return {
            statusCode: 200,
            msg: 'success',
            data: data
        }
    }
}