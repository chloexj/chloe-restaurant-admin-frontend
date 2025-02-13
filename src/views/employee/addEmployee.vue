<template>
  <div class="addBrand-container">
    <div class="container">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="180px"
      >
        <el-form-item label="Username" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="Employee Name" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Phone" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="Gender" prop="sex">
          <el-radio v-model="ruleForm.sex" label="1">Male</el-radio>
          <el-radio v-model="ruleForm.sex" label="2">Female</el-radio>
        </el-form-item>
        <el-form-item label="ID Number" prop="idNumber">
          <el-input v-model="ruleForm.idNumber"></el-input>
        </el-form-item>
        <div class="subBox">
          <el-button type="primary" @click="submitForm('ruleForm', false)"
            >Save</el-button
          >
          <el-button
            v-if="this.optType === 'add'"
            type="primary"
            @click="submitForm('ruleForm', true)"
            >Save and Continue
          </el-button>
          <el-button @click="() => this.$router.push('/employee')"
            >Back</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
// import { rules } from '@typescript-eslint/eslint-plugin'
import { addEmployee } from '@/api/employee'
import { queryEmployeeById } from '@/api/employee'
import { updateEmployee } from '@/api/employee'

export default {
  data() {
    return {
      optType: '',
      ruleForm: {
        name: '',
        username: '',
        sex: '2',
        phone: '',
        idNumber: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Please input employee name',
            trigger: 'blur',
          },
          // { min: 3, max: 5, message: 'length from 3 to 5 ', trigger: 'blur' }
        ],
        username: [
          { required: true, message: 'Please input username', trigger: 'blur' },
        ],
        phone: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value === '' || !/^\d{10}$/.test(value)) {
                callback(
                  new Error(
                    'Please input correct phone number!(totally 10 numbers)'
                  )
                )
              } else {
                callback()
              }
            },
          },
        ],
      },
    }
  },
  created() {
    this.optType = this.$route.query.id ? 'update' : 'add'
    if (this.optType === 'update') {
      queryEmployeeById(this.$route.query.id).then((res) => {
        if (res.data.code === 1) {
          this.ruleForm = res.data.data
        }
      })
    }
  },
  methods: {
    submitForm(formName, isContinue) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //如果是add操作
          if (this.optType === 'add') {
            addEmployee(this.ruleForm).then((res) => {
              if (res.data.code === 1) {
                this.$message.success('Successfully add new employee!')
                if (isContinue) {
                  this.ruleForm = {
                    name: '',
                    username: '',
                    sex: '2',
                    phone: '',
                    idNumber: '',
                  }
                } else {
                  this.$router.push('/employee')
                }
              } else {
                this.$message.error(res.data.msg)
              }
            })
          } else {
            //如果是update操作
            updateEmployee(this.ruleForm).then((res) => {
              if (res.data.code === 1) {
                this.$message.success(
                  'Successfully update employee information'
                )
                this.$router.push('/employee')
              }
            })
          }
        } else {
          alert('Fail to verify the form')
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.addBrand {
  &-container {
    margin: 30px;
    margin-top: 30px;
    .HeadLable {
      background-color: transparent;
      margin-bottom: 0px;
      padding-left: 0px;
    }
    .container {
      position: relative;
      z-index: 1;
      background: #fff;
      padding: 30px;
      border-radius: 4px;
      // min-height: 500px;
      .subBox {
        padding-top: 30px;
        text-align: center;
        border-top: solid 1px $gray-5;
      }
    }
    .idNumber {
      margin-bottom: 39px;
    }

    .el-form-item {
      margin-bottom: 29px;
    }
    .el-input {
      width: 293px;
    }
  }
}
</style>
