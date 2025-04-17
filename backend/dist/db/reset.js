"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = require("./pool");
const fs_1 = require("fs");
const path_1 = require("path");
function resetDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Read SQL files
            const dropSQL = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, 'drop.sql'), 'utf8');
            const initSQL = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, 'init.sql'), 'utf8');
            // Execute drop script
            console.log('Dropping existing tables...');
            yield pool_1.pool.query(dropSQL);
            // Execute init script
            console.log('Creating new tables and inserting sample data...');
            yield pool_1.pool.query(initSQL);
            console.log('Database reset completed successfully!');
            process.exit(0);
        }
        catch (error) {
            console.error('Error resetting database:', error);
            process.exit(1);
        }
    });
}
resetDatabase();
