import {useSupabase} from "~/server/utils/useSupabase";
import {CommonResponse} from "~/server/utils/commonResponse";

export default defineEventHandler(async (event) => {
    const {serviceRowClient} = await useSupabase(event);
    const res = await serviceRowClient.from('platform_kv').select('value').eq('key', 'REGISTER_PROOF_QUESTIONS').single()
    const questions = res.data?.value;

    if (!questions) {
        // TODO: log error
        return;
    }
    const questionsArray: Array<string> = (questions as {value: string[]}).value;

    return CommonResponse.success(questionsArray);

})