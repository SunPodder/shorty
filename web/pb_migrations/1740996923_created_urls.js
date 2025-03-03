/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "",
    "deleteRule": "id = @request.auth.id",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{8}",
        "hidden": false,
        "id": "text3208210256",
        "max": 8,
        "min": 4,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "exceptDomains": [],
        "hidden": false,
        "id": "url4101391790",
        "name": "url",
        "onlyDomains": [],
        "presentable": true,
        "required": true,
        "system": false,
        "type": "url"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "relation2375276105",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "user",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "number551164161",
        "max": null,
        "min": null,
        "name": "clicks",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "bool1260321794",
        "name": "active",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_228151313",
    "indexes": [
      "CREATE INDEX `idx_8cldzNVqci` ON `urls` (`user`)"
    ],
    "listRule": "id = @request.auth.id",
    "name": "urls",
    "system": false,
    "type": "base",
    "updateRule": "id = @request.auth.id",
    "viewRule": ""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_228151313");

  return app.delete(collection);
})
