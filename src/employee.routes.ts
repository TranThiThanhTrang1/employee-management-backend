import * as mongodb from 'mongodb';
import { Employee } from './employee';
import * as express from 'express';
import { collections } from './database';

export const employeeRouter = express.Router();
employeeRouter.use(express.json());

// Lấy danh sách tất cả nhân viên
employeeRouter.get('/', async (_req, res) => {
    try {
        const employees = await collections.employees.find({}).toArray();
        res.status(200).send(employees);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Lấy thông tin nhân viên theo ID
employeeRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id; // Lấy ID từ params
        const query = { _id: new mongodb.ObjectId(id) }; // Tạo truy vấn

        const employee = await collections.employees.findOne(query); // Tìm nhân viên theo ID
        if (employee) {
            res.status(200).send(employee);
        } else {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        }
    } catch (error) {
        res.status(400).send(`Invalid ID format: ${req.params.id}`); // Xử lý lỗi nếu ID không hợp lệ
    }
});


employeeRouter.post('/', async (req, res) => {
    try {
        const employee: Employee = req.body; // Đảm bảo kiểu dữ liệu
        const result = await collections.employees.insertOne(employee); // Sửa tên collection

        if (result.acknowledged) {
            res.status(201).send(`Created a new employee: ID ${result.insertedId}`); // Sửa thành insertedId
        } else {
            res.status(500).send("Failed to create new employee");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

employeeRouter.put("/:id", async (req, res) => {
    try {
        const id = req.params.id; // Lấy ID từ params
        const updatedEmployee = req.body; // Lấy thông tin cập nhật từ body
        const query = { _id: new mongodb.ObjectId(id) }; // Tạo truy vấn

        const result = await collections.employees.updateOne(query, { $set: updatedEmployee }); // Cập nhật nhân viên

        // Kiểm tra xem có bản ghi nào được cập nhật không
        if (result.modifiedCount === 1) {
            res.status(200).send(`Updated an employee: ID ${id}`);
        } else {
            res.status(404).send(`Failed to find employee: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(`Invalid ID format: ${req.params.id}`); // Xử lý lỗi nếu ID không hợp lệ
    }
});

employeeRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = {_id: new mongodb.ObjectId(id)};
        const result = await collections.employees.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed an employee: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove an employee: ID ${id}`)
        } else {
            res.status(400).send(`Failed to find an employee: ID ${id}`)
        }
    } catch (error) {
        
    }
})
