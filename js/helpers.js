/**
 * Created by dustar on 2017/6/9.
 * helpers.js
 * 工具函数
 */

// 拆分地址
function splitAddress(str) {
    let addr = new Array()
    addr = str.split('/')
    console.log(addr)
    return addr
}


// 检查名字合法性
function checkNameValidity(name, elem, mode="edit") {
    if (name == "") {
        $('.alert-danger').show()
        $('.alert-danger').text('该值不能为空。')
        return false
    }
    let pattern = /^[.a-zA-Z0-9\u4e00-\u9fa5]+$/
    if (!pattern.test(name)) {
        $('.alert-danger').show()
        $('.alert-danger').text('该值只能为汉字、数字和字母的组合。')
        return false
    }
    if (mode == "edit") {
        if (name === elem.name) {
            $('.alert-danger').show()
            $('.alert-danger').text('和先前对比，您并没有做出任何修改。')
            return false
        } else if (elem.father.getElement(name)) {
            $('.alert-danger').show()
            $('.alert-danger').text('同一目录上有重名文件或子目录！')
            return false
        }
    } else {
        if (elem.getElement(name)) {
            $('.alert-danger').show()
            $('.alert-danger').text('同一目录上有重名文件或子目录！')
            return false
        }
    }
    return true
}

// 将图片转为Base64编码
function gen_base64() {
    console.log("hiwjs")
    let f = $('#upload_file').prop('files')[0]
    console.log(f)
    r = new FileReader()  //本地预览
    r.onload = function(){
        $('#image-base64').val(r.result)
        $('.alert-danger').show()
        $('.alert-danger').text('您上传的图片将占用'+r.result.length+'字节，请慎重上传。')
    }
    r.readAsDataURL(f) //Base64
}