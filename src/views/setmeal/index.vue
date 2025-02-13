<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <label style="margin-right: 5px">Setmeal Name :</label>
        <el-input
          v-model="name"
          placeholder="Please input setmeal's name"
          style="width: 18%; margin-right: 8px"
        />
        <label style="margin-right: 5px">Setmeal Category :</label>
        <el-select
          v-model="categoryId"
          placeholder="Select"
          style="width: 10%; margin-right: 8px"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <label style="margin-right: 5px">Status :</label>
        <el-select v-model="saleStatus" placeholder="Select" style="width: 10%">
          <el-option
            v-for="item in saleStatusArr"
            :key="item.saleStatus"
            :label="item.label"
            :value="item.saleStatus"
          >
          </el-option>
        </el-select>
        <el-button type="primary" style="margin-left: 20px" @click="pageQuery()"
          >Search</el-button
        >
        <div style="float: right">
          <el-button type="danger" @click="handleDelete('B')"
            >- Batch Delete</el-button
          >
          <el-button type="info" @click="()=> this.$router.push('/setmeal/add')">+ Add Setmeal</el-button>
        </div>
      </div>
      <el-table
        :data="records"
        stripe
        class="tableBox"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="25" />
        <el-table-column prop="name" label="Setmeal Name" />
        <el-table-column label="Picture">
          <template slot-scope="scope">
            <el-image
              style="width: 80px; height: 40px; border: none"
              :src="scope.row.image"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="Category" />
        <el-table-column prop="price" label="Price" />
        <el-table-column label="Status">
          <template slot-scope="scope">
            <div
              class="tableColumn-status"
              :class="{ 'stop-use': scope.row.status === 0 }"
            >
              {{ scope.row.status === 0 ? 'Not On Sale' : 'On Sale' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="Update Time" />
        <el-table-column label="Operate" align="center" width="250px">
          <template slot-scope="scope">
            <el-button type="text" size="small"> Update </el-button>
            <el-button
              type="text"
              size="small"
              @click="handleStartOrStop(scope.row)"
            >
              {{ scope.row.status == '1' ? 'Disable' : 'Enable' }}
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="handleDelete('S', scope.row.id)"
            >
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pageList"
        :page-sizes="[5, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { getCategoryByType } from '@/api/category'
import { getSetmealPage } from '@/api/setMeal'
import { enableOrDisableSetmeal } from '@/api/setMeal'
import { deleteSetmeal } from '@/api/setMeal'
export default {
  data() {
    return {
      name: '',
      page: 1,
      pageSize: 5,
      total: 0,
      records: [],
      options: [],
      categoryId: '',
      saleStatusArr: [
        { value: '0', label: 'Not On Sale' },
        { value: '1', label: 'On Sale' },
      ],
      saleStatus: '',
      multipleSelection: '',
    }
  },
  created() {
    getCategoryByType({ type: 2 }).then((res) => {
      if (res.data.code === 1) {
        this.options = res.data.data
      }
    })
    this.pageQuery()
  },
  methods: {
    pageQuery() {
      // alert("test")
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        name: this.name,
        status: this.status,
        categoryId: this.categoryId,
      }
      getSetmealPage(params).then((res) => {
        if (res.data.code === 1) {
          this.total = res.data.data.total
          this.records = res.data.data.records
        }
      })
    },
    //分页条的事件处理函数，pageSize 改变时会触发
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.pageQuery()
    },
    //分页条的事件处理函数，currentPage 改变时会触发
    handleCurrentChange(page) {
      this.page = page
      this.pageQuery()
    },
    handleStartOrStop(row) {
      this.$confirm('Are you sure to update this setmeal status?', 'Alert', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(() => {
        enableOrDisableSetmeal({ id: row.id, status: !row.status ? 1 : 0 })
          .then((res) => {
            if (res.status === 200) {
              this.$message.success('Successfully update setmeal status!')
              this.pageQuery()
            }
          })
          .catch((err) => {
            this.$message.error('Request wrong: ' + err.message)
          })
      })
    },
    handleDelete(type: string, id: string) {
      this.$confirm('Are you sure to delete?', 'Alert', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(() => {
        let param = ''
        if (type === 'B') {
          // alert( this.multipleSelection.length)
          const arr = new Array()
          this.multipleSelection.forEach((element) => {
            arr.push(element.id)
          })
          param = arr.join(',')
        } else {
          param = id
        }

        deleteSetmeal(param).then((res) => {
          if (res.data.code === 1) {
            this.$message.success('Successfully delete')
            this.pageQuery()
          } else {
            this.$message.error(res.data.msg)
          }
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val

      // console.log('当前表格勾选了几项：'+val.length)
      // val.forEach(element => {
      //   console.log('id='+element.id)
      // });
    },
  },
}
</script>
<style lang="scss">
.el-table-column--selection .cell {
  padding-left: 10px;
}
</style>
<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;

    .container {
      background: #fff;
      position: relative;
      z-index: 1;
      padding: 30px 28px;
      border-radius: 4px;

      .tableBar {
        margin-bottom: 20px;
        .tableLab {
          float: right;
          span {
            cursor: pointer;
            display: inline-block;
            font-size: 14px;
            padding: 0 20px;
            color: $gray-2;
          }
        }
      }

      .tableBox {
        width: 100%;
        border: 1px solid $gray-5;
        border-bottom: 0;
      }

      .pageList {
        text-align: center;
        margin-top: 30px;
      }
      //查询黑色按钮样式
      .normal-btn {
        background: #333333;
        color: white;
        margin-left: 20px;
      }
    }
  }
}
</style>
