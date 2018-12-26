const frappe = require('frappejs');

class BankReconciliation {
  async run(params) {
    const filters = {};
    if (params.paymentAccount) filters.paymentAccount = params.paymentAccount;
    if (params.party) filters.party = params.party;
    // if (params.referenceType) filters.referenceType = params.referenceType;
    // if (params.referenceName) filters.referenceName = params.referenceName;
    if (params.toDate || params.fromDate) {
      filters.date = [];
      if (params.toDate) filters.date.push('<=', params.toDate);
      if (params.fromDate) filters.date.push('>=', params.fromDate);
    }

    let data = await frappe.db.getAll({
      doctype: 'Payment',
      fields: ['date', 'account', 'paymentAccount', 'party', 'name', 'referenceDate','clearanceDate'],
      filters: filters,
    });
    console.log(data);

    for (var i = 0; i < data.length; i++) {
      let ledger = await frappe.db.getAll({
        doctype: 'AccountingLedgerEntry',
        fields: ['date', 'referenceType', 'referenceName', 'debit', 'credit'],
        filters: {
          referenceType: 'Payment',
          account: data[i].paymentAccount,
          referenceName: data[i].name
        }
      })
      data[i].credit = ledger[0].credit;
      data[i].debit = ledger[0].debit;
      data[i].referenceName = ledger[0].referenceName;
      data[i].referenceType = ledger[0].referenceType;
    }

    return data;
  }
}

module.exports = BankReconciliation;
