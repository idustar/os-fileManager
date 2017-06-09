/**
 * Created by dustar on 2017/6/7.
 * Main.js 公共函数
 */

// 全局变量
disks = {}  // 磁盘集合
disk = {}   // 当前磁盘
dir = {}    // 当前目录
currentid = -1  // 当前最大文件/目录id
currentElement = "" // 当前正被操作的文件名
selected = []   // 被选中的文件/目录集合
toBeCopyed = [] // 剪贴板中的文件/目录集合
loading = false // 是否加载中
typing = false  // 是否快捷修改文件/目录名中


$(document).ready(function() {
    $('.address').hide()
    $('#txt-panel').hide()

    // 加载自定义编辑器
    var E = window.wangEditor
    editor = new E('#editor')

    // 自定义菜单配置
    editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'quote',  // 引用
        'table',  // 表格
        'undo',  // 撤销
        'redo'  // 重复
    ]
    editor.create()

    // 生成初始数据
    build()

    // 定义一些DOM事件
    $('.breadcrumb').click(function(event) {
        $('.breadcrumb').hide()
        $('.address').show()
        $('.address>input').focus()
        $('.address>input').val(dir.getCompleteAddress())
    })

    $('.address>input').blur(function(event) {
        $('.breadcrumb').show()
        $('.address').hide()
    })

    $('.address>input').keydown(function(e){
        console.log(e.keyCode)
        if(e.keyCode===13){
            goto($('.address>input').val())
            $('.address>input').blur()
        }
    })

    // 加载完毕
    $('body').addClass('loaded');
    $('#loader-wrapper .load_title').remove();
})

// 生成初始数据
function build() {
    disk = new Disk('G')
    disks['G'] = disk
    disk.createDirectory("Hi")
    disk.createDirectory("HQ")
    let file = disk.root.getDirectory("Hi")
    file = file.createDirectory("Hi1")
    file = file.createDirectory("Hi2")
    dir = file
    file = file.createDirectory("Hi3")
    file = file.createFile("d.txt","<p>hi</p>")

    // 加载
    refreshDirectoryTree()
    refreshDisks()
    goto(dir.getCompleteAddress())
}

// 刷新分区信息及目录树
function refreshDirectoryTree() {
    if (loading) return;

    // 刷新分区信息
    $('#current-disk-name').text(disk.nickname)
    $('#disk-use').text(disk.remain)
    $('#disk-all').text(disk.size)
    let remain = disk.remain/disk.size*100

    // 刷新目录树
    $('#disk-remain').css("width", remain+"%")
    if (remain >= 50) {
        $('#disk-remain').removeClass('progress-bar-warning progress-bar-danger')
    } else if (remain >= 25){
        $('#disk-remain').removeClass('progress-bar-danger')
        $('#disk-remain').addClass('progress-bar-warning')
    } else {
        $('#disk-remain').addClass('progress-bar-danger')
        $('#disk-remain').removeClass('progress-bar-warning')
    }
    let tree = [disk.getDirectoryTree(disk.root)]
    tree[0].text = "本地磁盘"
    tree[0].icon = "fa fa-laptop"
    $('#tree').treeview({
        data: tree,
        onNodeSelected: function(event, data) {
            goto(data.to)
        }
    })
}

// 最重要函数之一，将主页面重定向指定地址
function goto(str) {
    selected = []
    // 字符串处理，去掉头尾空格
    str = str.replace(/(^s*)|(s*$)/g, "")
    if (str.charAt(str.length-1) === "/") str = str.substr(0, str.length-1)
    let addr = []
    let current = {}
    if (str.charAt(0) === "/") {
        // 若首位为/，则从当前目录开始展开
        addr = splitAddress(str.substr(1, str.length))
        current = dir
    } else {
        // 先分析位于哪个分区，从指定分区的root目录开始展开
        addr = splitAddress(str.substr(3, str.length))
        current = disks[str.charAt(0).toUpperCase()]
        if (!current) {
            console.log('not exist')
            return {error: '磁盘 '+ str.charAt(0) + ' 不存在。'}
        }
        current = current.root
    }

    // 依次展开目录
    let len = addr.length
    if (addr[0] != '')
        for (let i in addr) {
            let pre_current = current.getDirectory(addr[i])
            if (i == len - 1 && pre_current == null)
                pre_current = current.getFile(addr[i])
            if (pre_current)
                current = pre_current
            else
                return {error: '找不到 ' + current.getCompleteAddress() + '/' + addr[i]}
        }

    if (current.disk.name !== disk.name) {
        current.disk.initDisk()
        refreshDisks()
        refreshDirectoryTree()
    }
    // 渲染面包屑
    renderBreadCrumb(current)
    dir = current

    // 渲染主面板
    current.show()
}

// 渲染面包屑
function renderBreadCrumb(current) {
    if (loading) return;
    let source_addr = current.getAddress()
    addr = splitAddress(source_addr)
    let code = ''
    let curaddr = ''
    for (let i in addr) {
        curaddr = curaddr + addr[i] + '/'
        if (i == 0) addr[0] = '本地磁盘 ' + addr[0].charAt(0) + " (" + addr[0] + ')'
        code += '<li><a href="javascript:;" onclick="goto(\''+curaddr.substr(0, curaddr.length - 1) +'\')">'+addr[i]+'</a></li>'
    }
    code += '<li class="active">'+ current.name +'</li>'
    $('.breadcrumb').html(code)
    $('#file-container').html('&nbsp;')
    dir = current
}

// 刷新页面
function refresh() {
    if (loading) return;
    // 重新渲染面包屑，主页面和目录树
    renderBreadCrumb(dir)
    dir.show()
    refreshDirectoryTree()
    $('#tree').treeview('search', [ dir.name, {
        ignoreCase: false,     // case insensitive
        exactMatch: true,    // like or equals
        revealResults: true,  // reveal matching nodes
    }]);
}

// 修改文件（目录）名
function reverseName() {
    dir.getElement(currentElement).reverseName()
}

// 开始快捷修改文件（目录）名
function quickReverse(obj) {
    // 修改当前typing为true
    typing = true
    currentElement = $(obj).text()?$(obj).text():currentElement
    $(obj).html('<input autofocus class="quickReverse" value="'+currentElement+'">')
}

// 快捷修改文件（目录）名
function doQuickReverse() {
    $('#new-name').val($('.quickReverse').val())
    reverseName()
}

// 创建文件夹命令
function createElem() {
    dir.createElem()
}

// 触发重命名
function edit() {
    $('.alert-danger').hide()
    dir.edit()
    $('#text-panel').show()
    $('#editor-panel').hide()
    $('#text-container').html(dir.getContent())
}

// 退出重命名状态
function noedit() {
    $('.alert-danger').hide()
    editor.txt.html(dir.getContent())
}

// 开始重命名操作
function startedit() {
    $('.alert-danger').hide()
    $('#text-panel').hide()
    $('#editor-panel').show()
    editor.txt.html(dir.getContent())
}

// 创建文件命令
function createFile(type) {
    $('.alert-danger').hide()
    if (type === "txt")
        dir.createElem(1)
    if (type === "img")
        dir.createElem(2)
}

// 刷新磁盘集合
function refreshDisks() {
    if (loading) return;
    if (typing) {
        typing = false
        doQuickReverse()
    }
    let code = ""
    // 加载磁盘列表
    for (let d in disks) {
        if (disks[d].name != disk.name) {
            code += '<li><a href="javascript:;" onclick="switchDisk(\'' + disks[d].name + '\')">' + disks[d].nickname +
                ' (' + disks[d].remain + '/' + disks[d].size + ')' + '</a></li>'
        }
    }
    // 加载磁盘菜单指令
    if (code === "") code = "<li class='disabled'><a>无可切换的分区</a></li>"
    code+='<li role="separator" class="divider"></li><li><a href="javascript:;" onclick="showNewDiskModal()">新分区</a></li>' +
        '<li><a href="javascript:;" onclick="formatDisk()">格式化当前分区</a></li>' +
        '<li><a href="javascript:;" onclick="startEditDisk()">修改当前分区内存空间</a></li>'
    $('.dropdown-menu').html('<li class="dropdown-header">可切换的分区</li>'+code)
}

// 切换当前分区
function switchDisk(name) {
    toBeCopyed = []
    goto(name)
}

// 创建新分区命令
function showNewDiskModal() {
    $('#newdir-name').val("")
    $('.alert-danger').hide()
    $('#newDiskModal').modal('show')
}

// 创建新分区
function newDisk() {
    $('.alert-danger').hide()
    let alpha = $('#disk-alpha').val()
    let size = $('#disk-size').val()
    if (disks[alpha]) {
        $('.alert-danger').show()
        $('.alert-danger').text('当前磁盘下已存在此盘符分区。')
        return false
    } else if(!(size >= 100 && size <= 5*1024*1024)) {
        $('.alert-danger').show()
        $('.alert-danger').text('请为分区分配100B~5KB的内存空间。')
        return false
    } else {
        $('#newDiskModal').modal('hide')
        disk = new Disk(alpha, size)
        disks[alpha] = disk
        goto(alpha+':')
        refreshDisks()
        refreshDirectoryTree()
        return true
    }
}

// 格式化分区命令
function formatDisk() {
    disk.format()
    disk.remain = disk.size
    goto(disk.name)
    refreshDirectoryTree()
    $('#successModel').modal('show')
}

// 开始修改分区内存容量操作
function startEditDisk() {
    $('.alert-danger').hide()
    $('#editDiskModal').modal('show')
    $('#new-disk-size').val(disk.size)
}

// 修改分区内存容量
function editDisk() {
    disk.reverseSize()
}

// 回退至上一目录
function back() {
    goto(dir.getAddress())
}

// 切换文件/目录被选择状态
function select(obj, event) {
    if (typing) {
        typing = false
        doQuickReverse()
    }
    let name = $(obj).attr("elementname")
    let elem = dir.getElement(name)
    let ans = undefined
    // 查找其是否被选中
    for (let i in selected) {
        if (selected[i].name === name) {
            ans = selected[i]
            break
        }
    }

    if (ans && event.button !== 2) {
        // 若被选中且非右键点选，则取消选择
        selected.splice(ans, 1)
        $(obj).removeClass('selected')
    } else if (ans) {
        // 若右键点选被选中文件/目录，则什么也不做
    } else {
        // 选择文件/目录
        selected.push(elem)
        $(obj).addClass('selected')
    }
}

// 取消选择全部
function unselectAll() {
    if (typing) {
        typing = false
        doQuickReverse()
    }
    selected = []
    refresh()
}

