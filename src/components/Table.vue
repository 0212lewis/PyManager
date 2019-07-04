<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="请输入项目名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="项目名称" width="180" sortable>
			</el-table-column>
			<el-table-column prop="operationStatu" label="运行状态" width="150"  sortable >
				<template slot-scope="scope">
					<span :class="{ 'operation-stop': scope.row.operationStatu == 'STOP','operation-running': scope.row.operationStatu == 'RUNNING','operation-debug': scope.row.operationStatu == 'DEBUG','operation-checking': scope.row.operationStatu == 'CHECKING','operation-todo': scope.row.operationStatu == 'TODO'}"
						  style="color: white;text-align: center;padding: 8px">
						{{ scope.row.operationStatu }}
					</span>
				</template>
			</el-table-column>

			<el-table-column label="维护状态" width="150" sortable>
				<template slot-scope="scope">
					<span :class="{ 'operation-stop': scope.row.preserveStatu == '待修复','operation-todo': scope.row.preserveStatu == '待开发','operation-debug': scope.row.preserveStatu == '数据停更','operation-running': scope.row.preserveStatu == '已维护'}"
						  style="color: white;text-align: center;padding: 8px">
						{{ scope.row.preserveStatu }}
					</span>
				</template>
			</el-table-column>
			<el-table-column prop="date" label="上次维护日期" width="180">
			</el-table-column>
			<el-table-column prop="technician" label="操作人员" width="150" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
				<el-form-item label="项目名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="运行状态">
					<template>
						<el-select v-model="editForm.operationStatu">
							<el-option
									v-for="item in operationStatusOptions"
									:key="item.value"
									:value="item.value">
							</el-option>
						</el-select>
					</template>
				</el-form-item>
				<el-form-item label="维护状态">
					<template>
						<el-select v-model="editForm.preserveStatu">
							<el-option
									v-for="item in statusOptions"
									:key="item.value"
									:value="item.value">
							</el-option>
						</el-select>
					</template>
				</el-form-item>

				<el-form-item label="上次维护日期">
					<el-date-picker type="date" v-model="editForm.date"></el-date-picker>
				</el-form-item>
				<el-form-item label="操作人员">
					<template>
						<el-select v-model="editForm.technician">
							<el-option
									v-for="item in technicianOptions"
									:key="item.value"
									:value="item.value">
							</el-option>
						</el-select>
					</template>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../api/api';

	export default {
		data() {
			return {
				operationStatusOptions:[{
					value: 'RUNNING'
				}, {
					value: 'STOP'
				}, {
					value: 'CHECKING'
				}, {
					value: 'DEBUG'
				}, {
					value: 'TODO'
				}],
				operationStatuValue:'',
				preserveStatusOptions: [{
					value: '已维护'
				}, {
					value: '待修复'
				}, {
					value: '数据停更'
				}, {
					value: '待开发'
				}],
				preserveStatuValue: '',

				technicianOptions: [{
					value: '陈远志'
				},{
					value: '宋铮'
				}],
				filters: {
					name: ''
				},
				users: [
					{"name":"Adobe","operationStatu":"RUNNING","preserveStatu":"已维护","date":"2019-07-04","technician":"陈远志"},
					{"name":"easyaq","operationStatu":"STOP","preserveStatu":"待修复","date":"2019-07-04","technician":"陈远志"},
					{"name":"securitynewspaper","operationStatu":"RUNNING","preserveStatu":"数据停更","date":"2019-07-04","technician":"陈远志"},
					{"name":"vuldb","operationStatu":"DEBUG","preserveStatu":"待修复","date":"2019-07-04","technician":"陈远志"},
					{"name":"vuldb5","operationStatu":"CHECKING","preserveStatu":"待修复","date":"2019-07-04","technician":"陈远志"},


				],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					name: '',
					operationStatu:'',
					preserveStatu: '',
					date: '',
					technician: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				}

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getUserListPage(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.users;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			// this.getUsers();
		}
	}

</script>

<style scoped>
	.el-dropdown-link {
		cursor: pointer;
		color: #409EFF;
	}
	.el-icon-arrow-down {
		font-size: 12px;
	}
	.operation-running{
		background-color: #5cb85c;
	}
	.operation-stop{
		background-color: #d9534f;
	}
	.operation-checking{
		background-color: #ffde10;
	}
	.operation-debug{
		background-color: #428bca;
	}
	.operation-todo{
		background-color: #f0ad4e;
	}
</style>