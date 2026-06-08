<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="分类状态" clearable>
          <el-option label="草稿" value="0" />
          <el-option label="发布" value="1" />
          <el-option label="下架" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['cms:category:add']">
          新增
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="categoryList"
      row-key="categoryId"
      :tree-props="{ children: 'children' }"
      default-expand-all
    >
      <el-table-column label="分类名称" prop="categoryName" min-width="260">
        <template #default="scope">
          {{ scope.row.categoryName?.zh || '' }}
        </template>
      </el-table-column>
      <el-table-column label="URL_KEY" prop="urlKey" />
      <el-table-column label="重定向地址" prop="redirectUrl" />
      <el-table-column label="栏目类型" prop="templateType" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.templateType === 'news'">新闻列表</el-tag>
          <el-tag v-if="scope.row.templateType === 'products'" type="success">产品列表</el-tag>
          <el-tag v-if="scope.row.templateType === 'content'" type="warning">内容页</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="orderNum" width="100" />
      <el-table-column label="推荐" prop="isRecommend" width="80">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isRecommend"
            active-value="1"
            inactive-value="0"
            @change="handleRecommendChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.status === '0'" type="info">草稿</el-tag>
          <el-tag v-else-if="scope.row.status === '1'" type="success">发布</el-tag>
          <el-tag v-else type="warning">下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['cms:category:edit']"
            >修改</el-button
          >
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cms:category:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改分类对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form v-if="open" ref="categoryRef" :model="form" :rules="rules" label-width="150px">
        <el-tabs v-model="activeTab">
          <el-tab-pane :label="item.name" :name="item.code" v-for="item in locales" :key="item.code">
            <el-form-item :label="`分类名称(${item.name})`" :prop="`categoryName.${item.code}`">
              <div style="display: flex; gap: 8px; flex: 1">
                <el-input v-model="form.categoryName[item.code]" :placeholder="`请输入分类名称(${item.name})`" style="flex: 1" />
                <el-button
                  v-if="item.code !== 'zh' && form.categoryName?.zh"
                  type="primary"
                  :icon="icons.MagicStick"
                  :loading="translating.categoryName"
                  @click="handleTranslate('categoryName', item.code)"
                  title="AI翻译"
                >
                  AI翻译
                </el-button>
              </div>
            </el-form-item>
            <el-form-item :label="`关键词(${item.name})`">
              <div style="display: flex; gap: 8px; flex: 1">
                <el-input v-model="form.keywords[item.code]" :placeholder="`请输入关键词(${item.name})`" style="flex: 1" />
                <el-button
                  v-if="item.code !== 'zh' && form.keywords?.zh"
                  type="primary"
                  :icon="icons.MagicStick"
                  :loading="translating.keywords"
                  @click="handleTranslate('keywords', item.code)"
                  title="AI翻译"
                >
                  AI翻译
                </el-button>
              </div>
            </el-form-item>
            <el-form-item :label="`描述(${item.name})`">
              <div style="display: flex; gap: 8px; flex: 1">
                <el-input v-model="form.description[item.code]" :placeholder="`请输入描述(${item.name})`" style="flex: 1" />
                <el-button
                  v-if="item.code !== 'zh' && form.description?.zh"
                  type="primary"
                  :icon="icons.MagicStick"
                  :loading="translating.description"
                  @click="handleTranslate('description', item.code)"
                  title="AI翻译"
                >
                  AI翻译
                </el-button>
              </div>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>

        <!-- 一键翻译所有语言按钮 -->
        <el-form-item v-if="hasNonZhLanguages">
          <el-button type="success" :icon="icons.MagicStick" :loading="translating.all" @click="handleTranslateAll">
            一键翻译所有语言
          </el-button>
          <span style="margin-left: 10px; color: #999; font-size: 12px"> 将中文内容翻译成所有其他语言 </span>
        </el-form-item>
        <el-form-item label="父级分类" prop="parentCategoryId">
          <el-tree-select
            :render-after-expand="false"
            v-model="form.parentCategoryId"
            :data="categoryOptions"
            :props="{ value: 'id', label: 'label', children: 'children' }"
            value-key="id"
            placeholder="选择父级分类"
            check-strictly
            clearable
          />
        </el-form-item>
        <el-form-item label="URL_KEY" prop="urlKey">
          <el-input v-model="form.urlKey" />
        </el-form-item>
        <el-form-item label="栏目类型" prop="templateType">
          <el-radio-group v-model="form.templateType">
            <el-radio label="news">新闻列表</el-radio>
            <el-radio label="products">产品列表</el-radio>
            <el-radio label="content">内容页</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="重定向地址" prop="redirectUrl">
          <el-input v-model="form.redirectUrl" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="显示排序" prop="orderNum">
          <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="推荐" prop="isRecommend">
          <el-switch v-model="form.isRecommend" active-value="1" inactive-value="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="0">草稿</el-radio>
            <el-radio label="1">发布</el-radio>
            <el-radio label="2">下架</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 产品参数模板（仅 products 顶级子分类可配） -->
        <template v-if="form.templateType === 'products' && isTopLevel">
          <el-divider content-position="left">
            <span style="font-size: 14px; font-weight: 600">📋 产品参数模板</span>
          </el-divider>

          <div
              v-for="(param, index) in form.paramTemplate"
              :key="index"
              style="margin-bottom: 12px; padding: 10px; border: 1px solid #e4e7ed; border-radius: 6px; background: #fafafa"
            >
              <el-row :gutter="8" align="middle">
                <el-col :span="8">
                  <el-input
                    v-model="param.label[activeTab]"
                    :placeholder="'参数名(' + (locales.find(l => l.code === activeTab)?.name || '') + ')'"
                    size="small"
                    @input="activeTab === 'zh' && onParamLabelChange(param)"
                  />
                </el-col>
                <el-col :span="5">
                  <el-input v-model="param.unit" placeholder="单位" size="small" />
                </el-col>
                <el-col :span="5">
                  <el-select v-model="param.type" placeholder="类型" size="small" style="width: 100%">
                    <el-option label="数字" value="number" />
                    <el-option label="文本" value="string" />
                    <el-option label="下拉" value="select" />
                  </el-select>
                </el-col>
                <el-col :span="4" style="text-align: right">
                  <el-button
                    type="danger"
                    :icon="icons.Delete"
                    size="small"
                    circle
                    @click="removeParam(index)"
                  />
                  <el-button
                    :icon="icons.Top"
                    size="small"
                    circle
                    :disabled="index === 0"
                    @click="moveParam(index, -1)"
                  />
                  <el-button
                    :icon="icons.Bottom"
                    size="small"
                    circle
                    :disabled="index === form.paramTemplate.length - 1"
                    @click="moveParam(index, 1)"
                  />
                </el-col>
              </el-row>
            </div>

            <!-- 快捷模板 -->
            <div style="margin-bottom: 10px; display: flex; gap: 8px; align-items: center">
              <el-select
                v-model="selectedTemplate"
                placeholder="选择产品模板快速加载"
                size="small"
                clearable
                style="width: 260px"
              >
                <el-option
                  v-for="(tpl, key) in paramTemplates"
                  :key="key"
                  :label="tpl.name?.zh || key"
                  :value="key"
                />
              </el-select>
              <el-button
                type="warning"
                plain
                size="small"
                :disabled="!selectedTemplate"
                @click="loadTemplate"
              >
                加载模板
              </el-button>
            </div>

            <el-button type="primary" plain size="small" :icon="icons.Plus" @click="addParam">
              添加参数
            </el-button>
            <span style="margin-left: 10px; font-size: 12px; color: #999">
              参数名(中文)修改后会自动更新字段 Key
            </span>
        </template>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Category" lang="ts">
  import {
    listCategory,
    getCategory,
    addCategory,
    updateCategory,
    delCategory,
    changeCategoryRecommend
  } from '@/api/cms/category';
  import { useListLocale } from '@/hooks/useListLocale';
  import { translateText, getCategoryParamTemplate } from '@/api/ai';
  import * as ElementPlusIconsVue from '@element-plus/icons-vue';
  import request from '@/utils/request';

  const { locales } = useListLocale();
  const { proxy } = getCurrentInstance();
  const icons = ElementPlusIconsVue;

  const categoryList = ref([]);
  const categoryOptions = ref([]);
  const open = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const activeTab = ref('zh');
  const title = ref('');

  // 翻译状态
  const translating = reactive({
    categoryName: false,
    keywords: false,
    description: false,
    all: false
  });

  // 参数模板快捷加载
  const selectedTemplate = ref('');
  const paramTemplates = ref({});

  const data = reactive({
    form: {},
    queryParams: {
      categoryType: null,
      status: null,
      limit: 1000
    },
    rules: {
      'categoryName.zh': [{ required: true, message: '分类名称(中文)不能为空', trigger: 'blur' }],
      urlKey: [{ required: true, message: '请输入URL_KEY', trigger: 'change' }],
      templateType: [{ required: true, message: '请选择模板类型', trigger: 'change' }]
    }
  });

  const { queryParams, form, rules } = toRefs(data);

  // 计算是否有非中文语言
  const hasNonZhLanguages = computed(() => {
    return locales.value.some(locale => locale.code !== 'zh');
  });

  // 是否顶级分类
  const isTopLevel = ref(false);

  // ========== 参数模板操作 ==========

  /** 添加参数行 */
  function addParam() {
    if (!form.value.paramTemplate) form.value.paramTemplate = [];
    const label: Record<string, string> = {};
    locales.value.forEach((l: any) => { label[l.code] = ''; });
    form.value.paramTemplate.push({
      key: '',
      label,
      unit: '',
      type: 'string',
      sort: form.value.paramTemplate.length
    });
  }

  /** 删除参数行 */
  function removeParam(index) {
    form.value.paramTemplate.splice(index, 1);
    form.value.paramTemplate.forEach((p, i) => (p.sort = i));
  }

  /** 移动参数行 */
  function moveParam(index, direction) {
    const arr = form.value.paramTemplate;
    const target = index + direction;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    arr.forEach((p, i) => (p.sort = i));
  }

  /** 中文名变更时自动生成 key（拼音风格标识符） */
  function onParamLabelChange(param: any) {
    if (!param.label.zh) {
      param.key = '';
      return;
    }
    // 生成英文风格的 key：去除非 ASCII，小写，空格转下划线
    let key = param.label.zh
      .trim()
      .replace(/[\u4e00-\u9fa5]+/g, '')  // 去掉中文
      .replace(/[^a-zA-Z0-9\s_-]/g, '')     // 去掉特殊符号
      .replace(/\s+/g, '_')                  // 空格转下划线
      .toLowerCase();

    // 纯中文则用英文名作为 key 的来源
    if (!key && param.label.en) {
      key = param.label.en
        .replace(/[^a-zA-Z0-9\s_-]/g, '')
        .replace(/\s+/g, '_')
        .toLowerCase();
    }

    param.key = key;
  }

  /** 获取预设参数模板列表 */
  function fetchParamTemplates() {
    request({ url: '/cms/category/param-templates', method: 'get' }).then(response => {
      paramTemplates.value = response.data || {};
    }).catch(() => {});
  }

  /** 加载预设模板到当前分类 */
  function loadTemplate() {
    const tpl = paramTemplates.value[selectedTemplate.value];
    if (!tpl?.params?.length) return;

    if (form.value.paramTemplate?.length > 0) {
      proxy.$modal.confirm('加载模板将覆盖当前参数列表，是否继续？').then(() => {
        applyTemplate(tpl.params);
      }).catch(() => {});
    } else {
      applyTemplate(tpl.params);
    }
  }

  function applyTemplate(params: any[]) {
    form.value.paramTemplate = params.map((p: any, i: number) => {
      const label: Record<string, string> = {};
      // 复制模板中的所有语言标签
      if (p.label && typeof p.label === 'object') {
        Object.assign(label, p.label);
      }
      // 确保所有支持的语种都存在
      locales.value.forEach((l: any) => {
        if (!(l.code in label)) label[l.code] = '';
      });
      return {
        key: p.key || '',
        label,
        unit: p.unit || '',
        type: p.type || 'string',
        sort: i
      };
    });
    selectedTemplate.value = '';
    proxy.$modal.msgSuccess('模板加载成功');
  }

  /** 查询分类列表 */
  function getList() {
    loading.value = true;
    listCategory(queryParams.value).then(response => {
      categoryList.value = proxy.handleTree(response.data.rows, 'categoryId', 'parentCategoryId');
      loading.value = false;
    });
  }

  /** 查询分类下拉树结构 */
  function getTreeselect() {
    listCategory().then(response => {
      categoryOptions.value = [
        {
          id: 0,
          label: '顶级分类',
          children: proxy.handleTree(
            response.data.rows.map(item => ({ ...item, id: item.categoryId, label: item.categoryName.zh })),
            'categoryId',
            'parentCategoryId'
          )
        }
      ];
    });
  }

  /** 取消按钮 */
  function cancel() {
    open.value = false;
    reset();
  }

  /** 表单重置 */
  function reset() {
    form.value = {
      categoryId: null,
      parentCategoryId: 0,
      categoryName: {},
      keywords: {},
      description: {},
      categoryType: '1',
      orderNum: 0,
      isRecommend: '0',
      status: '1',
      urlKey: undefined,
      templateType: undefined,
      detailTemplateType: undefined,
      paramTemplate: []
    };
    proxy.resetForm('categoryRef');
  }

  /** 搜索按钮操作 */
  function handleQuery() {
    getList();
  }

  /** 重置按钮操作 */
  function resetQuery() {
    proxy.resetForm('queryRef');
    handleQuery();
  }

  /** 新增按钮操作 */
  function handleAdd() {
    reset();
    getTreeselect();
    fetchParamTemplates();
    open.value = true;
    title.value = '添加分类';
  }

  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    getTreeselect();
    fetchParamTemplates();
    const categoryId = row.categoryId || ids[0];
    getCategory(categoryId).then(response => {
      form.value = {
        ...response.data,
        paramTemplate: response.data.paramTemplate || response.data.param_template || []
      };
      // 从后端获取 isTopLevel（产品中心下的直接子分类可配置参数模板）
      if (form.value.templateType === 'products') {
        getCategoryParamTemplate(categoryId).then((res: any) => {
          console.log('[DEBUG] param-template response:', JSON.stringify(res));
          isTopLevel.value = res.data?.isTopLevel ?? false;
          console.log('[DEBUG] isTopLevel set to:', isTopLevel.value);
        }).catch((err: any) => {
          console.log('[DEBUG] param-template FAILED:', err);
          isTopLevel.value = !form.value.parentCategoryId || form.value.parentCategoryId === 0;
          console.log('[DEBUG] isTopLevel fallback to:', isTopLevel.value);
        });
      }
      open.value = true;
      title.value = '修改分类';
    });
  }

  /** 提交按钮 */
  function submitForm() {
    proxy.$refs['categoryRef'].validate(valid => {
      if (valid) {
        const data = {
          ...form.value
        };
        if (form.value.categoryId != undefined) {
          updateCategory(data).then(response => {
            proxy.$modal.msgSuccess('修改成功');
            open.value = false;
            getList();
          });
        } else {
          addCategory(data).then(response => {
            proxy.$modal.msgSuccess('新增成功');
            open.value = false;
            getList();
          });
        }
      }
    });
  }

  /** 删除按钮操作 */
  function handleDelete(row) {
    proxy.$modal
      .confirm('是否确认删除名称为"' + row.categoryName?.zh + '"的数据项？')
      .then(function () {
        return delCategory(row.categoryId);
      })
      .then(() => {
        getList();
        proxy.$modal.msgSuccess('删除成功');
      })
      .catch(() => {});
  }

  /** 推荐操作 */
  function handleRecommendChange(row) {
    const text = row.isRecommend === '1' ? '设为推荐' : '取消推荐';
    proxy.$modal
      .confirm(`确认要${text}""${row.categoryName?.zh}"分类吗？`)
      .then(() => {
        return changeCategoryRecommend(row.categoryId, row.isRecommend);
      })
      .then(() => {
        proxy.$modal.msgSuccess('操作成功');
        getList();
      })
      .catch(() => {
        row.isRecommend = row.isRecommend === '1' ? '0' : '1';
      });
  }

  /** AI翻译单个字段 */
  async function handleTranslate(field, targetLang) {
    const sourceText = form.value[field]?.zh;
    if (!sourceText || !sourceText.trim()) {
      proxy.$modal.msgWarning('请先输入中文内容');
      return;
    }

    translating[field] = true;
    try {
      const response = await translateText({
        text: sourceText,
        targetLang: targetLang
      });

      if (response.data && response.data.translatedText) {
        form.value[field][targetLang] = response.data.translatedText;
        proxy.$modal.msgSuccess('翻译成功');
      } else {
        proxy.$modal.msgError('翻译失败，请重试');
      }
    } catch (error) {
      console.error('AI翻译错误:', error);
      proxy.$modal.msgError(error.message || '翻译失败，请检查AI配置');
    } finally {
      translating[field] = false;
    }
  }

  /** AI翻译所有字段 */
  async function handleTranslateAll() {
    const hasChineseContent =
      (form.value.categoryName?.zh && form.value.categoryName.zh.trim()) ||
      (form.value.keywords?.zh && form.value.keywords.zh.trim()) ||
      (form.value.description?.zh && form.value.description.zh.trim());

    if (!hasChineseContent) {
      proxy.$modal.msgWarning('请先输入中文内容');
      return;
    }

    translating.all = true;
    const nonZhLocales = locales.value.filter(locale => locale.code !== 'zh');

    try {
      for (const locale of nonZhLocales) {
        if (form.value.categoryName?.zh && form.value.categoryName.zh.trim()) {
          try {
            const response = await translateText({
              text: form.value.categoryName.zh,
              targetLang: locale.code
            });
            if (response.data?.translatedText) {
              form.value.categoryName[locale.code] = response.data.translatedText;
            }
          } catch (e) {
            console.error(`翻译分类名称到${locale.name}失败:`, e);
          }
        }

        if (form.value.keywords?.zh && form.value.keywords.zh.trim()) {
          try {
            const response = await translateText({
              text: form.value.keywords.zh,
              targetLang: locale.code
            });
            if (response.data?.translatedText) {
              form.value.keywords[locale.code] = response.data.translatedText;
            }
          } catch (e) {
            console.error(`翻译关键词到${locale.name}失败:`, e);
          }
        }

        if (form.value.description?.zh && form.value.description.zh.trim()) {
          try {
            const response = await translateText({
              text: form.value.description.zh,
              targetLang: locale.code
            });
            if (response.data?.translatedText) {
              form.value.description[locale.code] = response.data.translatedText;
            }
          } catch (e) {
            console.error(`翻译描述到${locale.name}失败:`, e);
          }
        }

        await new Promise(resolve => setTimeout(resolve, 500));
      }

      proxy.$modal.msgSuccess('批量翻译完成');
    } catch (error) {
      console.error('批量翻译错误:', error);
      proxy.$modal.msgError(error.message || '批量翻译失败');
    } finally {
      translating.all = false;
    }
  }

  getList();
</script>
