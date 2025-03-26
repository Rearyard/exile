export const useGeetest = (target: string) => {
    const captchaRef = shallowRef<Geetest|null>(null)

    onMounted(() => {
        nextTick(() => {
            window.initGeetest4({
                captchaId: '4a24a30e8df2ea2176c7fdc435d0758b',
                nativeButton: {
                    height: '46px',
                    width: '100%',
                }
            },function (captcha) {
                captchaRef.value = captcha
                // captcha为验证码实例
                captcha.appendTo(target);// 调用appendTo将验证码插入到页的某一个元素中，这个元素用户可以自定义
            });
        })
    })

    return {
        captchaRef,
        getValidate: captchaRef.value?.getValidate
    }
}