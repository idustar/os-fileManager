/**
 * Created by dustar on 2017/6/7.
 * Directory.js
 * 目录类
 */

class Directory {
    // 构造函数
    constructor(name, father, c=new Date(), e=new Date(), v=true, id = -1) {
        this.id = (id < 0)?(++currentid):id
        this.name = name
        this.type = (name === "")?"root":"dir"
        this.subdirs = []
        this.subfiles = []
        this.father = father
        this.created_at = c
        this.edited_at = e
        this.disk = father.disk ? father.disk : father
        this.visible = v
    }

    // 在该目录下新建目录或文件， r: 0=>目录 1=>文本文件 2=>图片
    createElem(r = 0) {
        $('.alert-danger').hide()
        let newName = ''
        if (r === 0)
            newName = $('#newdir-name').val()
        else if (r === 1)
            newName = $('#newtext-name').val() + '.txt'
        else
            newName = $('#newimg-name').val() + '.img'
        if (checkNameValidity(newName, this, "create")) {
            if (r === 0) {
                this.createDirectory(newName)
                $('#newDirectoryModal').modal('hide')
            } else if (r===1) {
                this.createTextFile(newName, "<p></p>")
                $('#newTextModal').modal('hide')
            } else if (r===2) {
                this.createImgFile(newName, $('#image-base64').val())
                $('#newImgModal').modal('hide')
            }
            refresh()
        }
    }
    // 在该目录下新建目录
    createDirectory(name) {
        let dir = new Directory(name, this)
        this.subdirs.push(dir)
        return dir
    }

    // 在该目录下新建文件
    createFile(name, content, type) {
        let size = content.length
        if (disk.remain < size) {
            $('.alert-danger').show()
            $('.alert-danger').text('内存不够，存储失败。')
            return null
        } else {
            disk.remain -= size
            let file = new File(name, content, size, this, type)
            this.subfiles.push(file)
            return file
        }
    }

    // 在该目录下新建文本文件
    createTextFile(name, content) {
        let ans = this.createFile(name, content, "txt")
        if (ans !== null) {
            goto('/'+name)
        }
    }

    // 在该目录下新建图片
    createImgFile(name, content) {
        let ans = this.createFile(name, content, "img")
        if (ans !== null) {
            goto('/'+name)
        }
    }

    // 由文件/目录名获取子目录或子文件，若不存在则返回null
    getElement(name) {
        let ans
        if (ans = this.getDirectory(name))
            return ans
        else if (ans = this.getFile(name))
            return ans
        else
            return null
    }

    // 由目录名获取子目录，若不存在则返回null
    getDirectory(name) {
        let ans = this.subdirs.findIndex((n) => n.name === name)
        if (ans >= 0)
            return this.subdirs[ans]
        else
            return null
    }

    // 由文件名获取子文件，若不存在则返回null
    getFile(name) {
        let ans = this.subfiles.findIndex((n) => n.name === name)
        if (ans >= 0)
            return this.subfiles[ans]
        else
            return null
    }

    // 获取当前目录所在目录的地址
    getAddress() {
        if (this.type === "root")
            return this.disk.name
        let current = this.father
        let address = []
        while (current && current.type !== "root") {
            address.push(current.name)
            current = current.father
        }
        address.push(this.disk.name)
        return address.reverse().join("/")
    }

    // 获取当前目录的地址
    getCompleteAddress() {
        if (this.root)
            return this.disk.name
        return this.getAddress() + "/" + this.name
    }

    // 在主面板中加载该目录对应的元素块
    renderIcon() {
        if (!this.visible) return ""
        let icon = "fa-folder-o"
        let head = '<div class="file-block" ondblclick="goto(\'/'+this.name+'\')" onmousedown="event.stopPropagation();select(this, event)" ' +
            'elementname="'+this.name+'">'+
            '<span class="file-icon"><i class="fa '+icon+'"></i></span>'+
            '<span class="file-name"><span onclick="quickReverse(this)">'+this.name+'</span></span>'
        let context = '</div>'
        return head + context
    }

    // 在主面板中加载目录下所有元素的元素块
    renderIconsInThisDirectory() {
        let code = ""
        for (let i in this.subdirs)
            code += this.subdirs[i].renderIcon()
        for (let i in this.subfiles)
            code += this.subfiles[i].renderIcon()
        $('#file-container').html(code)
        this.showMenu()
    }

    // 加载主面板菜单
    showMenu() {
        $('#file-panel').contextMenu({
            selector: 'div',    // 菜单对div元素有效
            callback: function(key, options) {
                // 指定一个被选中项作为当前活动元素
                if (selected[0])
                    currentElement = selected[0].name
                switch (key) {
                    case "edit":    // 重命名
                        $('#new-name').val("")
                        $('.alert-danger').hide()
                        $('#editModal').modal(options)
                        $('#source-name').val(currentElement)
                        break
                    case "newDir":  // 新建文件夹
                        $('#newdir-name').val("")
                        $('.alert-danger').hide()
                        $('#newDirectoryModal').modal(options)
                        break
                    case "view":    // 查看
                        goto("/"+currentElement)
                        break
                    case "attr":    // 查看属性
                        $('#attrModal').modal(options)
                        let elm = dir.getElement(currentElement)
                        $('.attr-elem-name').text(elm.name + ' 的属性')
                        // 生成类型名
                        let typetostr = {
                            "txt": "文本文件",
                            "img": "图像文件",
                            "dir": "文件夹",
                        }
                        // 生成类型对应的ICON
                        let typetoicon = {
                            "txt": "fa fa-file-code-o",
                            "img": "fa fa-file-image-o",
                            "dir": "fa fa-folder-o",
                        }
                        // 填充信息
                        let iconstr = typetoicon[elm.type]?typetoicon[elm.type]:"fa fa-file-o"
                        $('.attr-type').text(typetostr[elm.type]?typetostr[elm.type]:"其它")
                        $('.attr-icon').html('<i class="'+iconstr+'"></i>')
                        $('.attr-disk').text(disk.nickname)
                        $('.attr-addr').text(elm.getCompleteAddress())
                        $('.attr-ca').text(elm.created_at.toLocaleString())
                        $('.attr-ea').text(elm.edited_at.toLocaleString())
                        if (elm.type == "txt" || elm.type == "img")
                            $('.attr-size').text(elm.size)
                        else
                            $('.attr-size').text("/")
                        break
                    case "newText": // 新建文本文件
                        $('#newtext-name').val("")
                        $('.alert-danger').hide()
                        $('#newTextModal').modal(options)
                        break
                    case "newImg":  // 新建图片
                        $('#upload_file').val("")
                        $('#newimg-name').val("")
                        $('.alert-danger').hide()
                        $('#newImgModal').modal(options)
                        break
                    case "delete":  // 删除
                        for (let e in selected) {
                            currentElement = selected[e].name
                            selected[e].del()
                        }
                        selected = []
                        $('#successModel').modal('show')
                        break
                    case "cut": // 剪切
                        toBeCopyed = selected
                        selected = []
                        $('#successModel').modal('show')
                        break
                    case "paste":   // 粘贴
                        // 遍历检查粘贴合法性（是否可能发生嵌套迭代），若不合法，终止操作
                        for (let e in toBeCopyed) {
                            let em = toBeCopyed[e]
                            let ed = dir
                            if (ed.id === em.id) {
                                $('#deadModel').modal('show')
                                return
                            }
                            while (ed.type !== "root") {
                                ed = ed.father
                                if (ed.id === em.id) {
                                    $('#deadModel').modal('show')
                                    return
                                }
                            }
                        }
                        // 从原节点移除
                        for (let e in toBeCopyed) {
                            currentElement = toBeCopyed[e].name
                            if (toBeCopyed[e].type == "txt" || toBeCopyed[e].type == "img") {
                                let files = toBeCopyed[e].father.subfiles
                                let ip = -1
                                for (let i in files) {
                                    if (files[i].name == currentElement) {
                                        ip = i
                                        break
                                    }
                                }
                                toBeCopyed[e].father.subfiles.splice(ip, 1)
                            } else {
                                let dirs = toBeCopyed[e].father.subdirs
                                let ip = -1
                                for (let i in dirs)
                                    if (dirs[i].name == currentElement) {
                                        ip = i
                                        break
                                    }
                                toBeCopyed[e].father.subdirs.splice(ip, 1)
                            }
                        }
                        // 加入到新节点
                        for (let e in toBeCopyed) {
                            toBeCopyed[e].father = dir
                            let ans = dir.getElement(toBeCopyed[e].name)
                            if (!ans) {
                                if (toBeCopyed[e].type == "dir") {
                                    dir.subdirs.push(toBeCopyed[e])
                                } else {
                                    dir.subfiles.push(toBeCopyed[e])
                                }
                            } else {
                                if (toBeCopyed[e].type == "dir") {
                                    ans = toBeCopyed[e]
                                } else {
                                    ans = toBeCopyed[e]
                                }
                            }
                        }
                        currentElement = dir.name
                        selected = []
                        toBeCopyed = []
                        refresh()
                        break
                    case "hide":    // 隐藏元素
                        for (let e in selected) {
                            currentElement = selected[e].name
                            selected[e].visible = false
                        }
                        refresh()
                        $('#successModel').modal('show')
                        break
                    case "back":    // 回退至上一页
                        back()
                        break
                    case "refresh": // 刷新
                        refresh()
                        break
                }
            },
            items: {
                "back": {name: "返回上一层目录" ,icon: "fa-chevron-left", disabled: function(key, opt) {
                    return dir.type === "root"
                }},
                "refresh": {name: "刷新" ,icon: "fa-rotate-left"},
                "sep1": "---------",
                "view": {name: "查看", icon: "fa-tv", disabled: function(key, opt) {
                    return selected.length !== 1
                }},
                "cut": {name: "剪切", icon: "fa-scissors", disabled: function(key, opt) {
                    return selected.length < 1
                }},
                "paste": {name: "粘贴", icon: "fa-clipboard", disabled: function(key, opt) {
                    return toBeCopyed.length < 1
                }},
                "edit": {name: "重命名", icon: "fa-pencil", disabled: function(key, opt) {
                    return selected.length !== 1
                }},
                "delete": {name: "删除", icon: "delete", disabled: function(key, opt) {
                    return selected.length < 1
                }},
                "hide": {name: "隐藏", icon: "fa-low-vision", disabled: function(key, opt) {
                    return selected.length < 1
                }},
                "attr": {name: "属性", icon: "fa-hand-stop-o", disabled: function(key, opt) {
                    return selected.length !== 1
                }},
                "sep2": "---------",
                "newDir": {name:"新建文件夹", icon: "fa-folder"},
                "newText": {name: "新建文本文件", icon: "fa-file-text"},
                "newImg": {name: "新建图片", icon: "fa-file-photo-o"}
            }
        })
    }

    // 渲染主面板
    show() {
        if (loading) return;
        $('#file-panel').show()
        $('#txt-panel').hide()
        $('#img-panel').hide()
        this.renderIconsInThisDirectory()
        this.refreshTreeView()
    }

    // 当前面板在目录树上对应的位置变亮
    refreshTreeView() {
        if (loading) return;
        $('#tree').treeview('search', [ this.name, {
            ignoreCase: false,     // case insensitive
            exactMatch: true,    // like or equals
            revealResults: true,  // reveal matching nodes
        }])
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
        for (let i in this.subdirs)
            this.subdirs[i].del()
        for (let i in this.subfiles)
            this.subfiles[i].del()
        let dirs = this.father.subdirs
        let ip = -1
        for (let i in dirs) {
            if (dirs[i].name == currentElement) {
                ip = i
                break
            }
        }
        currentElement = this.father.name
        this.father.subdirs.splice(ip, 1)
        refresh()
    }
}
