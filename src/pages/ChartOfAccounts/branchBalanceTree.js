const frappe = require('frappejs')

let balanceTree = {}

async function createBalanceTree() {
  let entries = await frappe.db.getAll({
    doctype: 'AccountingLedgerEntry',
    fields: ['account', 'debit', 'credit'],
    filters: {}
  });

  for (let entry of entries) {
    let rootAccount = (await getParentAccount(entry.account)).root;
    balanceTree[rootAccount] = 0;

    let amount = Math.floor(entry.credit ? -entry.credit : entry.debit)

    if (!balanceTree[entry.account]) {
      balanceTree[entry.account] = amount
    } else {
      balanceTree[entry.account] += amount
    }

    await setParentBalance(entry.account, rootAccount, amount)
  }
  
  return balanceTree
}

async function setParentBalance(child, root, amount) {
  let parent = await getParentAccount(child);

  if (!parent.name)
    return;

  if (!balanceTree[parent.name]) {
    balanceTree[parent.name] = amount
  } else {
    balanceTree[parent.name] += amount
  }

  await setParentBalance(parent.name, root, amount);
}

async function getParentAccount(name) {
  let data = await frappe.db.getAll({
    doctype: 'Account',
    fields: ['parentAccount', 'rootType'],
    filters: {
      name
    }
  });

  if (data.length)
    return {
      name: data[0].parentAccount,
      root: data[0].rootType
    }
}

async function getFinalBalanceTree() {
  let finalTree = await createBalanceTree();
  return finalTree
}

export default getFinalBalanceTree