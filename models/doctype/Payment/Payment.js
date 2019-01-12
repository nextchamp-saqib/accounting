const utils = require('../../../accounting/utils');

module.exports = {
    name: "Payment",
    label: "Payment",
    isSingle: 0,
    isChild: 0,
    isSubmittable: 1,
    keywordFields: [],
    settings: "PaymentSettings",
    fields: [{
            "fieldname": "date",
            "label": "Posting Date",
            "fieldtype": "Date",
            // default: (new Date()).toISOString()
        },
        {
            fieldname: "party",
            label: "Party",
            fieldtype: "Link",
            target: "Party",
            required: 1
        },
        {
            fieldname: "account",
            label: "Account",
            fieldtype: "Link",
            target: "Account",
            required: 1
        },
        {
            fieldname: "paymentAccount",
            label: "Payment Account",
            fieldtype: "Link",
            target: "Account",
            required: 1
        },
        {
            fieldname: "referenceId",
            label: "Ref. / Cheque No.",
            fieldtype: "Data",
            default: "ABC",
            required: 1 // TODO: UNIQUE
        },
        {
            fieldname: "referenceDate",
            label: "Ref. Date",
            fieldtype: "Date",
        },
        {
            fieldname: "clearanceDate",
            label: "Clearance Date",
            fieldtype: "Date",
        },
        {
            fieldname: "amount",
            label: "Amount",
            fieldtype: "Currency",
            required: 1,
            disabled: true,
            formula: (doc) => doc.getSum('for', 'amount')
        },
        {
            fieldname: "writeoff",
            label: "Write Off / Refund",
            fieldtype: "Currency",
        },
        {
            fieldname: "for",
            label: "Payment For",
            fieldtype: "Table",
            childtype: "PaymentFor",
            required: 1
        }
    ],

    layout: [{
            columns: [{
                    fields: ['date', 'party']
                },
                {
                    fields: ['account', 'paymentAccount']
                },
            ]
        },
        {
            columns: [{
                fields: ['referenceId']
            }, {
                fields: ['referenceDate']
            },{
                fields: ['clearanceDate']
            }]
        },
        {
            columns: [{
                fields: ['for']
            }]
        },
        {
            columns: [{
                fields: ['amount', 'writeoff']
            }]
        }
    ],

    links: [
        utils.ledgerLink
    ]
}
