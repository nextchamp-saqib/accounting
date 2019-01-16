<template>
  <div class="p-3" v-if="root">
    <branch :label="root.label" :parentValue="''" :doctype="doctype" ref="root" v-if="balance" :balance="balance"/>
  </div>
</template>
<script>
import frappe from 'frappejs';
import Branch from './Branch';
import { setTimeout } from 'timers';
import getBalanceTree from './branchBalanceTree';

export default {
  components: {
    Branch,
  },
  data() {
    return {
      root: null,
      doctype: "Account",
      balance: false
    }
  },
  async mounted() {
    this.settings = frappe.getMeta(this.doctype).treeSettings;
    this.root = {
      label: await this.settings.getRootLabel(),
    };
  },
  async created(){
    this.balance = await getBalanceTree();
    console.log(this.balance)
  },
  methods: {
    async getChildren(parentValue) {
      let filters = {
        [this.settings.parentField]: parentValue
      };

      const children = await frappe.db.getAll({
        doctype: this.doctype,
        filters,
        fields: [this.settings.parentField, 'isGroup', 'name'],
        orderBy: 'name',
        order: 'asc'
      });

      return children.map(c => {
        c.label = c.name;
        return c;
      });
    }
  }
}
</script>
