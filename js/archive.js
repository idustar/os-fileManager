/**
 * Created by dustar on 2017/6/8.
 * archive.js
 * 存档/取档
 */

// 将对象转化为json
function ObjToJson() {
    let data = []
    let diskinfo = []
    for (d in disks) {
        data = disks[d].archiveDisk(disks[d].root, data)
        let layer = {}
        layer["alpha"] = disks[d].name.charAt(0)
        layer["size"] = disks[d].size
        layer["storage"] = disks[d].storage
        diskinfo.push(layer)
    }
    let jsonData = {
        "data": data,
        "disk": diskinfo
    }
    // 提交json
    submit(jsonData)
    $('#successModel').modal("show")

}

// 向远程服务器提交json
function submit(str) {
    jQuery.ajax({
        url: "http://dustark.cn/os3/index.php",
        type: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        contentType: "application/json",
        data: JSON.stringify({
            "data": str
        })
    })
        .done(function(data, textStatus, jqXHR) {
            console.log("HTTP Request Succeeded: " + jqXHR.status);
            console.log(data);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log("HTTP Request Failed");
        })
        .always(function() {
        })
}

// 从远程服务器取档
function httpGet() {
    jQuery.ajax({
        url: "http://dustark.cn/os3/index.php",
        type: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    })
        .done(function(data, textStatus, jqXHR) {
            console.log("HTTP Request Succeeded: " + jqXHR.status)
            loadData(eval('('+data+')'))
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log("HTTP Request Failed")
        })
        .always(function() {
            /* ... */
        })
}

// 解码档案
function loadData(data) {
    let dat = data.data
    currentid = Date.parse(new Date());
    loading = true
    // 开始解码
    disks = new Object()
    // 解码DISK部分
    let _disks = dat.disk
    for (d in _disks) {
        let alpha = _disks[d].alpha
        disk = new Disk(alpha, _disks[d].size)
        disks[alpha] = disk
        let st = _disks[d].storage
        for (s in st)
            disk.storage[parseInt(s)] = st[s]
    }
    // 解码DATA部分
    let datas = dat.data
    for (d in datas) {
        let name = datas[d].name
        console.log(name + "'s id is "+datas[d]['id'])
        let pid = Number(datas[d]['id'])
        let address = datas[d].address
        let type = datas[d].type
        if (type === "dir") {
            goto(address)
            dir.subdirs.push(new Directory(name, dir, datas[d].created_at, datas[d].edited_at, datas[d].visible, pid))
        } else if (type === "txt" || type === "img") {
            goto(address)
            let size = disk.storage[pid].length
            dir.subfiles.push(new File(name, null, size, dir, type, datas[d].visible, datas[d].created_at, datas[d].edited_at, pid))
            dir.disk.remain -= size
        }
        console.log('load ' + address + '/' + name)
    }
    // 结束解码
    loading = false
    // 加载新档案
    goto(disk.name)
    refresh()
    refreshDisks()
    $('#successModel').modal("show")
}