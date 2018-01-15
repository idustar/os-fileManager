# 操作系统

# 文件管理器 

## 设计目的

- 理理解 文件存储空间的管理理；

- 掌握 文件的物理理结构、 目录结构和 文件操作；实现简单 文件系统管理理；

- 加深 文件系统实现过程的理理解；


## DEMO

[DEMO](https://idustar.github.io/os-fileManager/index.html)



## 使用说明

打开 `index.html` 即可运行。


![pUZUAJ.png](https://s1.ax1x.com/2018/01/15/pUZUAJ.png)
![pUZYBF.png](https://s1.ax1x.com/2018/01/15/pUZYBF.png)
![pUZm7Q.png](https://s1.ax1x.com/2018/01/15/pUZm7Q.png)
![pUZA6f.png](https://s1.ax1x.com/2018/01/15/pUZA6f.png)
![pUZEX8.png](https://s1.ax1x.com/2018/01/15/pUZEX8.png)
![pUZZnS.png](https://s1.ax1x.com/2018/01/15/pUZZnS.png)
![pUZMhn.png](https://s1.ax1x.com/2018/01/15/pUZMhn.png)
![pUZe0g.png](https://s1.ax1x.com/2018/01/15/pUZe0g.png)
![pUZdhR.png](https://s1.ax1x.com/2018/01/15/pUZdhR.png)
![pUZukj.png](https://s1.ax1x.com/2018/01/15/pUZukj.png)
![pUZ8XT.png](https://s1.ax1x.com/2018/01/15/pUZ8XT.png)
![pUZ110.png](https://s1.ax1x.com/2018/01/15/pUZ110.png)


## 分区系统


用户可创建多个分区，并为每个分区分配适当的内存空间。不不同分区之间独 立 工作， 用户可随时创建、格式化分区或切换到另 一分区，切换之后将进 入该分区的根 目录下。如地址“A:/dir1/dir2”对应的 目录位于分区“本地磁盘 A”。

分区的盘符仅限 大写字 母A-Z，内存容量量仅限100B-5MB，修改内存容量量时新内存空间不不得 小于已被分配的内存空间。

点击左上⻆角的分区 面板即可弹出下拉菜单。


## 资源管理器 
 

资源管理理器 直观地展示了了当前的 目录结构和当前 目录下的 子 目录和 文件。资源管理理器  支持返回上级 目录、刷新、剪切和粘贴、打开 文件/ 目录、重命名、删除、隐藏、查看属性、通过地址栏或是 目录树访问某 一 目录或 文件，以及新建 文件夹、 文本 文件和图 片的功能。
































- 右键菜单 -



返回上级 目录： 返回上级 目录有两种 方法。点击地址栏左侧的“返回上级 目录”按钮或是在右键菜单中选择“返回上级 目录”。在分区根 目录下返回上级 目录并不不会离开原 目录。

刷新： 在右键菜单中选择“刷新”可刷新本 目录（虽然好像也没什什么卵卵 用）。
 








-	返回上级 目录按钮 –



选中/取消选中：  大部分右击事件均需要选中 一个或多个 文件和 目录进 行行操作。（右键本身就是选中的 一种 方法）。 用户单击 文件/ 目录图标即可选中或取消选中该 文件/ 目录。系统默认多选，即在选中某些 文件/ 目录的情况下点按未选中的 文件/ 目录即可同时选中这些 文件/ 目录。点击资源管理理器 空 白处或者跳转其他地址均取消选中所有已选 文件/ 目录。
 


































-	选中 –



打开 文件/ 目录：  鼠标单击资源管理理器 中的图标或者在某 一图标右键选择“打开”。

重命名：在某 一图标上右键选择“重命名”。新 文件/ 目录名仅限汉字、数字、英 文字 母和句句号组合且不不可于该 目录下任何 文件/ 目录重名，不不限制修改后缀名。

快捷重命名：在某 一图标的 文件/ 目录名上单击， 文件/ 目录名即可变为可编辑模式。 文件/ 目录名实时保存，若修改后的名字不不合法，则回滚回未修改前状态。
 

























- 重命名 -



剪切和粘贴： 用户选中 一个或多个 文件/ 目录后右键选择“剪切”，即可将这些 文件/ 目录加 入剪贴板； 用户进 入某 目录下右键选择“粘贴”，即可完成粘贴操作。剪切操作仅限同 一分区下完成，且不不可将某 一 目录粘贴到其 子 目录下。对于同名现象，本系统采取不不覆盖策略略，即若存在同名“demo.txt”，粘贴后的“demo.txt”将改名“demo.txt.副本”，删除 文件时将 自动将 文件移出剪贴板。

隐藏：在某 一图标上右键选择“隐藏”。隐藏操作不不可逆， 文件/ 目录设为只读后，只能通过 目录树或地址栏访问。

查看属性：在某 一图标上右键选择“属性”。
 
























-	查看 文件夹属性 –

 





























- 查看 文件属性 -
 

新建 文件夹：右键菜单选择“新建 文件夹”。新 目录名仅限汉字、数字、英 文字 母和句句号组合且不不可于该 目录下任何 文件/ 目录重名。


























-	新建 文件夹 –



新建 文本 文件：右键菜单选择“新建 文本 文件”。 文本 文件类型为txt，默认后缀为“.txt”，可在创建之后进 行行重命名操作以修改或取消后缀，后缀与 文件类型不不绑定。 文本 文件创建后将 自动打开。 文件 文件默认内容为“<p></p>”，若分区剩余空间少于8字节，则创建失败。
 

















- 新建 文本 文件 -





新建图 片：右键菜单选择“新建图 片”。图 片类型为img，默认后缀为“.img”，可在创建之后进 行行重命名操作以修改或取消后缀，后缀与 文件类型不不绑定。新建图 片时要求选取图 片，选取 文件类型包括但不不限于jpg/gif/png/bmp/svg等。注意：分区存储容量量有限，谨慎选择 大图 片。若分区剩余时间少于图 片 大 小，则创建失败。
 


























- 新建图 片 -





通过地址栏访问地址：地址栏以 面包屑形式显示当前 目录地址。单击任意 一层 目录即可进 入该 目录。当 用户单击地址栏，地址栏将进 入可编辑模式。输 入地址后按回 车键跳转。注意：系统将忽略略前后空格和末尾的“/”。如输 入“G:”和“G:/”等价，均进 入G盘根 目录。






-	常规模式 –

-



-	可编辑模式 -

 

通过 目录树访问地址：单击左侧 目录树任意 一 行行即可进 行行对应 目录。

按每 一 行行左侧的“+”和“-”可分别展开或折叠 目录。























































-  目录树 -
 


3.	 文本编辑器 




查看模式： 文本编辑器 默认以富 文本形式（html代码）显示内容。新建 文本 文件默认内容“<p></p>”。
























-	查看模式 –



编辑模式：在查看模式下点击“编辑 文件”进 入编辑模式。本系统提供了了 一个功能强 大的富 文本编辑器 ，可随意为 文本添加样式。
 
























- 编辑模式 -








4.	图 片查看器 




打开图 片即可查看图 片。













程序设计
 

Disk.js


































Directory.js
 

 

File.js













































其他 文件

-	main.js 主要函数

-	helpers.js 辅助函数

-	archive.js 存档与取档相关函数
 


全局变量量disks表示 用户计算机， 用于存储Disk（分区）类的实例例。Disk类可 广义地分为两部分： Data和Storage。Data存储分区相关的信息， 而Storage则为该分区下所有File类实例例指向的存储空间，空闲空间采 用位图分配的 方式。 文件实际填充Storage。每个Disk实例例在构造的时候会 生成 一个Directory实例例作为其Root 目录，如G盘的root对应地址“G:/”或“G:”





'$7$	6725$*(
 


1DPH

,G

&UHDWHGBDW  'DWH

(GLWBDW  'DWH

5RRW  'LUHFWRU\

6L]H LQW

5HPDLQ6L]H LQW
 













 




Directory类为 目录类。同样也由信息Data和其指向的 子 目录subdirs和 文件subfiles组成。 用户新建 文件夹，即在当前 目录实例例的成员变量量subdirs中push 一个新的Directory实例例； 用户新建 文本 文件或 目录，即在当前 目录实例例的成员变量量subfiles中push 一个新的File实例例。
 
'$7$   68%',56


1DPH

,G
7\SH ŉURRWŊŉGLUŊ

&UHDWHGBDW  'DWH
(GLWBDW  'DWH
'LVN	'LVN	68%),/(6	
			
)DWKHU	'LUHFWRU\		
9LVLEOH	%RROHDQ		




File类为 文件类， 文件的type变量量有txt和img两种取值。 文件类有成员函数getContent()和setContent(content)，可向当前分区Disk实例例的Storage中请求返回 文件内容。在创建或者编辑 文件时，先向Disk发送请求，询问其是否能分配 足够的内存空间。若能，则将内容写 入this.disk.storage。

File实例例和Directory实例例均有唯 一的地址和其对应。系统在解析地址时，按 一定规则解析地址串串。规范地址串串时忽略略其前后空格、尾部斜杠和盘符的 大 小写。解析第 一步为根据盘符进 入对应的分区的root 文件夹，随后按解析结果逐层顺序访问其相应 子 目录或 文件。如“G:/A/B”，解析时 首先访问G盘的root 文件夹，随后进 入root 文件夹的 子 目录A，并进 入A 目录的 子 目录B，并调 用B对应的Directory实例例的show()函数渲染资源管理理器 ，访问 一个 文件原理理等同。同样，每个Directory实例例和File实例例调 用getAddress()和

getCompleteAddress()函数可返回其 目录所在地址和完整地址， 方法也是递归遍历其 父 目录直到访问到root 文件夹。
 

 用户选中某 文件/ 目录，即将该 文件或 目录对应的实例例添加到全局变量量Selected中。同样，在选择或取消选择时，系统将判断该 文件或 目录是否被添加到Selected中。若已添加，则移除；若未添加，则选中。

复制和粘贴功能通过全局变量量toBeCopyed实现。当剪切操作时，清空Selected并 用Selected的内容覆盖ToBeCopyed。粘贴操作分为三步。当在指定 目录进 行行粘贴操作时，系统 首先遍历ToBeCopyed中的元素，判断操作是否合法，即搜索是否存在将 目录移到其 子 目录下的情况；然后从原 目录Directory实例例的subfiles或subdirs删除该实例例；最后将实例例添加到新 目录Directory实例例的

subfiles或subdirs中去。

删除 文件时，释放对应的File实例例，并释放其在Storage中的数据所占 用的内存空间。删除 目录，不不仅要释放对应的Directory实例例，还要对 目录下 文件和 目录所有 子 目录下的 文件进 行行删除操作。

隐藏 文件或 目录的原理理相对简单。即将对应的File实例例或Directory实例例的visible设置为false。资源管理理器 在渲染的时候 自动忽略略visible为false的 文件和 目录。

存档和取档利利 用远程服务器 来实现。 一 方 面，这样能让档案变为公共资源，任何使 用该系统的 人将使 用同 一套磁盘状态；另 一 方 面，受JavaScript安全机制限制，应调 用远端php进 行行 文件读写。存档时，将现有Disk实例例保存，将Directory和File实例例并列列保存，以JSON形式POST给远端；读档时，先格式化当前所有磁盘，随后翻译从远端GET到的JSONDATA。JSONDATA中的 文件、 目录均给出
 

了了其address和其他信息。在取档时，先打开其所在的address，并在该 目录的subfiles或subdirs中直接插 入File实例例或Directory实例例。Disk信息通过 一定规则转换成Disk类。渲染的顺序是先分区后 文件和 目录。

图 片以Base64形式存在Storage中。
