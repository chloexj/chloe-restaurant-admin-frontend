<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <label style="margin-right: 5px">Employee Name :</label>
        <el-input
          v-model="name"
          placeholder="Please input employee's name"
          style="width: 20%"
        />
        <el-button type="primary" style="margin-left: 20px" @click="pageQuery()"
          >Search</el-button
        >
        <el-button type="primary" style="float: right"
          @click="handleAddEmp">+ Add Employee</el-button
        >
      </div>
    </div>
    <!-- table -->
    <el-table :data="records" stripe style="width: 100%">
      <el-table-column prop="name" label="Employee Name"> </el-table-column>
      <el-table-column prop="username" label="Username"> </el-table-column>
      <el-table-column prop="phone" label="Phone"> </el-table-column>
      <el-table-column prop="status" label="Account Status">
        <template slot-scope="scope">
          {{ scope.row.status === 0 ? 'Disable' : 'Enable' }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="Update Time"> </el-table-column>
      <el-table-column label="Operate">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdateEmp(scope.row)">Update</el-button>
          <el-button type="text" @click="handleEnableOrDisable(scope.row)">
            {{ scope.row.status === 1 ? 'Disable' : 'Enable' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- Pagination -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[3, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- alert box -->
  </div>
</template>
<script lang="ts">
import { getEmployeeList } from '@/api/employee'
import { enableOrDisableEmployee } from '@/api/employee'

export default {
  data() {
    return {
      name: '',
      page: 1,
      pageSize: 3,
      total: 0,
      records: [],
    }
  },
  created() {
    this.pageQuery()
  },
  methods: {
    pageQuery() {
      // alert('Page query')
      const params = {
        name: this.name,
        page: this.page,
        pageSize: this.pageSize,
      }
      getEmployeeList(params)
        .then((res) => {
          if (res.data.code === 1) {
            this.total = res.data.data.total
            this.records = res.data.data.records
          }
        })
        .catch((err) => {
          this.$message.error('Request error' + err.message)
        })
    },
    //trigger it when pageSize change
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.pageQuery()
    },
    handleCurrentChange(page) {
      this.page = page
      this.pageQuery()
    },
    handleEnableOrDisable(row) {
      if (row.username === 'admin') {
        this.$message.error(
          'admin is default administrator account, cannot update status'
        )
        return
      }

      this.$confirm(
        'Are you sure to update this employee account status?',
        'Alert',
        {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      ).then(() => {
        const p = {
          id: row.id,
          status: !row.status ? 1 : 0,
        }
        // alert(`id=${p.id} status=${p.status}`)

        enableOrDisableEmployee(p).then((res) => {
          if (res.data.code === 1) {
            this.$message.success('Status update successfully')
            this.pageQuery()
          }
        })
      })
    },
    // jump to add new emp
    handleAddEmp(){
// alert("add new emp")
this.$router.push('/employee/add')
    },
    //jump to update emp
    handleUpdateEmp(row){
      if (row.username === 'admin') {
        this.$message.error(
          'admin is default administrator account, cannot update status'
        )
        return
      }
this.$router.push({
  path:'/employee/add',
  query:{id:row.id}
  //路由跳转的同时传了个参数
})

    }
  },
}
</script>

<style lang="scss" scoped>
.disabled-text {
  color: #bac0cd !important;
}
</style>
