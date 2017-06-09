/**
 * Created by dustar on 2017/6/7.
 * File.js
 * 文件类
 */

class File {
    // 构造函数
    constructor(name, content = null, size, father, type="txt", v = true, c = new Date(), e = new Date(), id = -1) {
        this.id = (id < 0)?(++currentid):id
        this.name = name
        this.type = type
        this.size = size
        this.father = father
        this.created_at = c
        this.edited_at = e
        this.disk = father.disk
        if (content) this.setContent(content)
        this.visible = v
    }

    // 获取当前文件所在目录的地址
    getAddress() {
        let current = this.father
        let address = []
        while (current && current.type!=='root') {
            address.push(current.name)
            current = current.father
        }
        address.push(this.disk.name)
        return address.reverse().join("/")
    }

    // 获取当前文件地址
    getCompleteAddress() {
        return this.getAddress() + "/" + this.name
    }

    // 保存编辑结果
    edit() {
        let content = editor.txt.html()
        let storage = disk.remain + this.size
        let size = content.length
        if (storage < size) {
            $('.alert-danger').text("内存不够了，存储失败。")
            alert("内存不够，存储失败。")
            return null
        } else {
            disk.remain = storage - size
            this.setContent(content)
            this.edited_at = new Date()
            let t = this.father
            while (t.type !== "root") {
                t.edited_at = new Date()
                t = t.father
            }
            t.edited_at = new Date()
            this.size = size
        }
        refresh()
    }

    getElement(name) {
        return null
    }

    // 获取文件内容
    getContent() {
        let ans
        if (ans = disk.storage[this.id])
            return ans
        else
            return null
    }

    // 修改文件内容
    setContent(content) {
        disk.storage[this.id] = content
    }

    // 渲染当前文件在主面板中的元素块
    renderIcon() {
        if (!this.visible) return ""
        let icon = this.type === "img" ? "fa-file-image-o" : "fa-file-text-o"
        let head = '<div class="file-block" ondblclick="goto(\'/'+this.name+'\')" onmousedown="event.stopPropagation();select(this, event)"' +
            'elementname="'+this.name+'">'+
            '<span class="file-icon"><i class="fa '+icon+'"></i></span>'+
            '<span class="file-name"><span onclick="quickReverse(this)">'+this.name+'</span></span>'
        let context = '</div>'
        return head + context
    }

    // 打开文件
    show() {
        if (loading) return;
        if (this.type === "txt") {
            $('#file-panel').hide()
            $('#txt-panel').show()
            $('#img-panel').hide()
            $('#text-panel').show()
            $('#editor-panel').hide()
            this.father.refreshTreeView()
            $('#text-container').html(this.getContent())
            $('.alert-danger').hide()
        } else {
            $('#file-panel').hide()
            $('#txt-panel').hide()
            $('#img-panel').show()
            this.father.refreshTreeView()
            $('#img-panel').html('<img src="'+this.getContent()+'">')
            $('.alert-danger').hide()
        }
    }

    // 重命名
    reverseName() {
        $('.alert-danger').hide()
        let newName = $('#new-name').val()
        if (checkNameValidity(newName, this)) {
            this.name = newName
            $('#editModal').modal('hide')
            refresh()
        }
    }

    // 删除
    del() {
        let files = this.father.subfiles
        let ip = -1
        for (let i in files) {
            if (files[i].name == currentElement) {
                ip = i
                break
            }
        }
        currentElement = this.father.name
        disk.storage[this.id] = undefined
        this.father.subfiles.splice(ip, 1)
        disk.remain += this.size
        refresh()
    }
}
