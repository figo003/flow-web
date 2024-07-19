<template>
    <div 
        class="app-container caseManagementIndex scrollcontainer scrollcontainer_auto" 
        ref="caseManagementIndex" 
        >
        <el-select 
            v-model="value" 
            filterable 
            :multiple="multiple" 
            placeholder="请选择" 
            :popper-append-to-body="false" 
            :filter-method="assetsTypeFilter"
            @change="changeValue($event)"
            >
            <el-option :value="selectTree" class="setstyle" disabled >
                <el-tree
                    :data="list"
                    :props="defaultProps"
                    ref="tree"
                    node-key="key"
                    show-checkbox
                    :expand-on-click-node="false"
                    check-on-click-node
                    @check-change="checkChangeClick"
                ></el-tree>
            </el-option>
        </el-select>
    </div>
</template>

<script>
import { compose } from '../../utils'

export default {
    name: 'caseManagementIndex',
    // import引入的组件需要注入到对象中才能使用PopupTreeInput
    components: {},
    props: {
        list: {
            type: Array,
            default: () => [],
        },
        defaultProps: {
            type: Object,
            default: () => {
                return {
                    children: 'children',
                    label: 'label',
                    value: 'value',
                }
            }
        },
        selectType: {
            type: String,
            default: 'multiple',
        },
        selectValue: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        // 这里存放数据
        return {
            origin: [],
            selectItem:[],
            value: [],
            selectId:[],
            selectTree:[],
            allTreeList: [],
            multiple: true,
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {
        selectValue: {
            handler: function (value) {
                if(value.length){
                    setTimeout(()=> {
                        this.selectItem = []
                        this.filterArr(this.list, value)
                        this.setDefalutValue()
                    })
                        
                }
            },
            deep: true
        },
        list: {
            handler: function (value) {
            },
            deep: true 
        },
    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.origin = JSON.parse(JSON.stringify(this.list));
        this.selectTree = this.flatten(this.list)
        
    },
    // 方法集合
    methods: {
        flatten(arr) {
            return [].concat(
                ...arr.map((item) => {
                    if (item.children) {
                        let arr = [].concat(item, ...this.flatten(item.children))
                        delete item.children
                        return arr
                    }
                    return [].concat(item)
                }),
            )
        },
        assetsTypeFilter(val) {
            // 下拉框调用tree树筛选
            this.$refs.tree.filter(val)
        },
       
        filterArr(arr, value){
            arr.map((item) => {
                if(value.indexOf(item.key) > -1){
                    this.selectItem.push(item) 
                    return;
                }     
                if (item.children) {
                    this.filterArr(item.children, value)
                }
            })
        },
        // 选择节点的方法，获取所有的key以及name
        checkChangeClick(data, self, child) {
            if (this.selectType == 'multiple') {
                let datalist = this.$refs.tree.getCheckedNodes()
                this.value = []
                datalist.forEach((item) => {
                    this.value.push(item.name)
                })
                this.selectId = datalist.map((item) => {
                    return item.key
                })
                this.$emit('getdetail', this.selectId)
            } else {
                if (self) {
                    this.$refs.tree.setCheckedNodes([data])
                    this.multiple = false
                    this.value = data.name
                    this.$emit('getdetail', data)
                }
            }
        },
        // 设置默认值
        setDefalutValue(){
            this.$refs.tree.setCheckedNodes(this.selectItem)
            this.multiple = true
        },
        changeValue(value){
            let ids = []
            console.log();
            let allTreeList = this.flatten(this.list)
            value.forEach((valueItem)=> {
                allTreeList.forEach((item)=> {
                    if(item.name == valueItem){
                        ids.push(item.key)
                    }
                })
            })
            this.selectItem = []
            this.filterArr(this.list, ids)
            this.setDefalutValue()
        },
        filterNode(value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
    },
}
</script>
<style lang="less">
.setstyle {
    min-height: 200px;
    padding: 0 !important;
    margin: 0;
    overflow: auto;
    cursor: default !important;
}
</style>