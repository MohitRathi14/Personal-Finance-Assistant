import Transaction from '../model/transaction.js';

// create transaction controller (add income/expense)
export const createTransaction = async (req, res) => {
    try {
        const { amount, type, category, date, description } = req.body;

        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send({ success: false, message: "Unauthorized" });
        }

        if (!amount || isNaN(amount)) {
            return res.status(400).send({ success: false, message: "Invalid amount" });
        }

        if (!["income", "expense"].includes(type)) {
            return res.status(400).send({ success: false, message: "Type must be income or expense" });
        }

        if (!category) {
            return res.status(400).send({ success: false, message: "Category is required" });
        }

        const parsedDate = date ? new Date(date) : new Date();

        const transaction = new Transaction({
            userId,
            amount,
            type,
            category,
            date: parsedDate,
            description: description || "",
            status: "pending"
        });

        await transaction.save();

        res.status(201).send({
            success: true,
            message: "Transaction created",
            data: transaction
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: "Error creating transaction" });
    }
};
// verify transaction controller
export const verifyTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id;

        const updated = await Transaction.findOneAndUpdate(
            { _id: transactionId, userId: req.user.id },
            { status: "verified" },
            { new: true }
        );

        if (!updated) {
            return res.status(404).send({ success: false, message: "Transaction not found" });
        }

        res.status(200).send({ success: true, message: "Transaction verified", data: updated });
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: "Error verifying transaction" });
    }
};

// get user transactions controller
export const getUserTransactions = async (req, res) => {
    try {
        const userId = req.user.id;

        const transactions = await Transaction.find({ userId }).sort({ date: -1 });

        res.status(200).send({
            success: true,
            data: transactions
        });
    } catch (err) {
        res.status(500).send({ success: false, message: "Error fetching transactions" });
    }
};
// get all transactions controllers (list of income/expense)
export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({});

        const incomeList = await Transaction.find({ type: "income" });
        const expenseList = await Transaction.find({ type: "expense" });

        res.status(200).send({
            success: true,
            data: {
                transactions,
                incomeList,
                expenseList
            }
        });
    } catch (err) {
        res.status(500).send({ success: false, message: "Error fetching transactions" });
    }
};

// delete transaction controller
export const deleteTransaction = async (req, res) => {
    try {
        const deleted = await Transaction.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!deleted) {
            return res.status(404).send({ success: false, message: "Transaction not found" });
        }

        res.status(200).send({
            success: true,
            message: "Transaction deleted",
            data: deleted
        });
    } catch (err) {
        res.status(500).send({ success: false, message: "Error deleting transaction" });
    }
};
// edit transaction controller
export const editTransaction = async (req, res) => {
    try {
        const updated = await Transaction.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).send({ success: false, message: "Transaction not found" });
        }

        res.status(200).send({
            success: true,
            message: "Transaction updated",
            data: updated
        });
    } catch (err) {
        res.status(500).send({ success: false, message: "Error updating transaction" });
    }
};

// filter by date controller
export const filterTransactionsByDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;

        const data = await Transaction.find({
            userId: req.user.id,
            date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        });

        res.status(200).send({ success: true, data });
    } catch (err) {
        res.status(500).send({ success: false, message: "Error filtering transactions" });
    }
};
// category-based summary controller
export const categoryBasedSummary = async (req, res) => {
    try {
        const summary = await Transaction.aggregate([
            { $match: { userId: req.user.id } },
            {
                $group: {
                    _id: "$category",
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).send({ success: true, data: summary });
    } catch (err) {
        res.status(500).send({ success: false, message: "Error getting summary" });
    }
};

// graph data controller
export const getGraphData = async (req, res) => {
    try {
        const graphData = await Transaction.aggregate([
            { $match: { userId: req.user.id } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalAmount: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).send({ success: true, data: graphData });
    } catch (err) {
        res.status(500).send({ success: false, message: "Error fetching graph data" });
    }
};
        