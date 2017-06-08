/**
 * Created by dustar on 2017/6/7.
 * Disk.js
 * 分区类
 */

class Disk {
    // 构造函数
    constructor(alpha, size = 1024000) {
        this.name = alpha + ":"
        this.nickname = "本地磁盘 " + alpha
        this.size = size
        this.remain = this.size
        this.root = new Directory('', this);
        this.storage = {}
    }

    // 在根目录下创建新目录
    createDirectory(name) {
        this.root.createDirectory(name)
    }

    // 递归获取分区下目录树
    getDirectoryTree(root = this.root) {
        let layer = {}
        layer.text = root.name
        layer.href = "javascript:;"
        layer.to = root.getCompleteAddress()
        layer.icon = "fa fa-folder"
        for (let i in root.subdirs) {
            let child = this.getDirectoryTree(root.subdirs[i])
            if (!layer.nodes)
                layer.nodes = []
            layer.nodes.push(child)
        }
        return layer
    }

    // 分区存档
    archiveDisk(root = this.root, data) {
        let layer = new Object()
        layer["id"] = root.id
        layer["name"] = root.name
        layer["created_at"] = root.created_at.toString()
        layer["edited_at"] = root.edited_at.toString()
        layer["visible"] = root.visible.toString()
        layer["type"] = root.type
        layer["address"] = root.getAddress()
        data.push(layer)
        for (let i in root.subdirs)
            data = this.archiveDisk(root.subdirs[i], data)
        for (let i in root.subfiles)
            data = this.archiveDisk(root.subfiles[i], data)
        return data
    }

    // 加载分区
    initDisk() {
        disk = this
    }

    // 格式化
    format() {
        this.root = new Directory('', this)
        this.storage = new Object()
    }

    // 修改分区内存容量
    reverseSize() {
        let newsize = $('#new-disk-size').val()
        if(!(newsize >= 100 && newsize <= 5*1024*1024)) {
            $('.alert-danger').show()
            $('.alert-danger').text('请为分区分配100B~5KB的内存空间。')
            return false
        }
        if (newsize < this.size - this.remain) {
            $('.alert-danger').show()
            $('.alert-danger').text('请先在此分区下删除部分文件后再试。')
            return false
        }
        this.remain = newsize - (this.size - this.remain)
        this.size = newsize
        $('#editDiskModal').modal('hide')
        refresh()
    }
}