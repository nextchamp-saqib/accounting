module.exports = {
    "name": "Address",
    "doctype": "DocType",
    "isSingle": 0,
    "titleField": "name",
    "keywordFields": [
        "addressTitle"
    ],
    pageSettings: {
        hideTitle: true
    },
    "naming": "autoincrement",
    "fields": [
        {
            "fieldname": "addressLine1",
            "label": "Address Line 1",
            "fieldtype": "Data",
            "required": 1
        },
        {
            "fieldname": "addressLine2",
            "label": "Address Line 2",
            "fieldtype": "Data"
        },
        {
            "fieldname": "city",
            "label": "City / Town",
            "fieldtype": "Data",
            "required": 1
        },
        {
            "fieldname": "state",
            "label": "State",
            "fieldtype": "Data"
        },
        {
            "fieldname": "country",
            "label": "Country",
            "fieldtype": "Data",
            "required": 1
        },
        {
            "fieldname": "postalCode",
            "label": "Postal Code",
            "fieldtype": "Data"
        }
    ],

    // events: {
    //     validate: (doc) => {

    //     }
    // },

    listSettings: {
        getFields(list) {
            return ['addressTitle', 'addressType'];
        },
        getRowHTML(list, data) {
            return `<div class="col-11">${list.getNameHTML(data)} (${data.addressType})</div>`;
        }
    },

    layout: [
        // section 1
        {
            columns: [{
                fields: ['addressLine1', 'addressLine2']
            }],
        },
        {
            columns: [{
                fields: ['country']
            }, {
                fields: ['state']
            }]
        },
        {
            columns: [{
                fields: ['city']
            }, {
                fields: ['postalCode']
            }]
        }
    ]
}