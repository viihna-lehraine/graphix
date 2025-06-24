"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const config = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: './dev.db'
        },
        useNullAsDefault: true,
        migrations: {
            directory: path_1.default.resolve(__dirname, '../migrations')
        }
    }
};
module.exports = config;
