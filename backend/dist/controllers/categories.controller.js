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
exports.CategoriesController = void 0;
const pool_1 = require("../db/pool");
class CategoriesController {
    static getAllCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield pool_1.pool.query('SELECT * FROM categories ORDER BY name');
                res.json(result.rows);
            }
            catch (error) {
                console.error('Error fetching categories:', error);
                res.status(500).json({
                    error: 'Failed to fetch categories',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    static getCategoryById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield pool_1.pool.query('SELECT * FROM categories WHERE id = $1', [id]);
                if (result.rows.length === 0) {
                    return res.status(404).json({
                        error: 'Category not found',
                        details: 'No category found with the provided ID'
                    });
                }
                res.json(result.rows[0]);
            }
            catch (error) {
                console.error('Error fetching category:', error);
                res.status(500).json({
                    error: 'Failed to fetch category',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    static createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description } = req.body;
                if (!name || !description) {
                    return res.status(400).json({
                        error: 'Missing required fields',
                        details: 'Name and description are required'
                    });
                }
                const result = yield pool_1.pool.query('INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *', [name, description]);
                res.status(201).json(result.rows[0]);
            }
            catch (error) {
                console.error('Error creating category:', error);
                res.status(500).json({
                    error: 'Failed to create category',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    static updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, description } = req.body;
                const result = yield pool_1.pool.query(`UPDATE categories 
         SET name = COALESCE($1, name),
             description = COALESCE($2, description)
         WHERE id = $3
         RETURNING *`, [name, description, id]);
                if (result.rows.length === 0) {
                    return res.status(404).json({
                        error: 'Category not found',
                        details: 'No category found with the provided ID'
                    });
                }
                res.json(result.rows[0]);
            }
            catch (error) {
                console.error('Error updating category:', error);
                res.status(500).json({
                    error: 'Failed to update category',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    static deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield pool_1.pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
                if (result.rows.length === 0) {
                    return res.status(404).json({
                        error: 'Category not found',
                        details: 'No category found with the provided ID'
                    });
                }
                res.json({ message: 'Category deleted successfully' });
            }
            catch (error) {
                console.error('Error deleting category:', error);
                res.status(500).json({
                    error: 'Failed to delete category',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
}
exports.CategoriesController = CategoriesController;
