<template>
  <div>
    <page-header :breadcrumbs="breadcrumbs"/>
    <div class="p-4">
      <div class="row">
        <h4 class="col-6 pb-4">{{ reportConfig.title }}</h4>
        <div class="col-6 text-right">
          <f-button primary @click="openExportWizard">{{ 'Export' }}</f-button>
        </div>
      </div>
      
      
      <report-filters
        v-if="filtersExists"
        :filters="reportConfig.filterFields"
        :filterDefaults="filters"
        @change="getReportData"
      ></report-filters>
      <div class="pt-2" ref="datatable" v-once></div>
    </div>
    <not-found v-if="!reportConfig"/>
  </div>
</template>
<script>
import DataTable from 'frappe-datatable';
import frappe from 'frappejs';
import ReportFilters from 'frappejs/ui/pages/Report/ReportFilters';
import utils from 'frappejs/client/ui/utils';
import ExportWizard from '../../components/ExportWizard';
import PageHeader from '@/components/PageHeader';

export default {
  name: 'Report',
  props: ['reportName', 'reportConfig', 'filters'],
  computed: {
    filtersExists() {
      return (this.reportConfig.filterFields || []).length;
    },
    breadcrumbs() {
      return [
        {
          title: 'Report',
          route: '#/reportList'
        },
        {
          title: this.reportConfig.title,
          route: ''
        }
      ];
    }
  },
  methods: {
    async openExportWizard() {
      this.$modal.show({
        modalProps: {
          title: 'Export Wizard',
          noFooter: true
        },
        component: ExportWizard,
        props: await this.getReportDetails()
      });
    },
    async getReportDetails() {
      let { title, filterFields } = this.reportConfig;
      let [rows, columns] = await this.getReportData(filterFields || []);
      let columnData = columns.map(column => {
        return {
          id: column.id,
          content: column.content,
          checked: true
        };
      });
      // console.log(columnData);
      return {
        title: title,
        rows: rows,
        columnData: columnData
      };
    },
    async getReportData(filters) {
      let data = await frappe.call({
        method: this.reportConfig.method,
        args: filters
      });

      let rows, columns;
      if (data.rows) {
        rows = data.rows;
      } else {
        rows = data;
      }

      if (data.columns) {
        columns = this.getColumns(data);
      }

      if (!rows) {
        rows = [];
      }

      if (!columns) {
        columns = this.getColumns();
      }

      for (let column of columns) {
        column.editable = false;
      }

      if (this.datatable) {
        this.datatable.refresh(rows, columns);
      } else {
        this.datatable = new DataTable(this.$refs.datatable, {
          columns: columns,
          data: rows
        });
      }
      return [rows, columns];
    },
    getColumns(data) {
      const columns = this.reportConfig.getColumns(data);
      return utils.convertFieldsToDatatableColumns(columns);
    }
  },
  components: {
    ReportFilters,
    PageHeader
  }
};
</script>
<style>
</style>
