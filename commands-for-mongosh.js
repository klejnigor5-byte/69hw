// Виконуйте команди по черзі в mongosh.
// 1. База та колекція
use studentDB
db.createCollection("assignments")

// 2. П'ять документів
db.assignments.insertMany([
  { name: "Alex", subject: "Mathematics", score: 90 },
  { name: "Maria", subject: "Physics", score: 85 },
  { name: "Andrew", subject: "Mathematics", score: 70 },
  { name: "Olena", subject: "History", score: 95 },
  { name: "Ivan", subject: "Physics", score: 60 }
])

// 3. Бал > 80
db.assignments.find({ score: { $gt: 80 } })

// 4. Додати Andrew 5 балів, якщо бал < 85
db.assignments.updateOne(
  { name: "Andrew", score: { $lt: 85 } },
  { $inc: { score: 5 } }
)

// 5. Видалити документ з найнижчим балом
const lowestStudent = db.assignments.find().sort({ score: 1 }).limit(1).toArray()[0]
db.assignments.deleteOne({ _id: lowestStudent._id })

// 6. Тільки ім'я та бал
db.assignments.find({}, { _id: 0, name: 1, score: 1 })

// Завдання 2 (необов'язкове): агрегація
db.assignments.aggregate([
  { $group: { _id: "$subject", averageScore: { $avg: "$score" } } },
  { $match: { averageScore: { $gt: 75 } } },
  { $project: { _id: 0, subject: "$_id", averageScore: { $round: ["$averageScore", 2] } } }
])

// Завдання 3 (необов'язкове): індекс і пошук
db.assignments.createIndex({ name: 1 }, { unique: true })
db.assignments.find({ name: { $regex: "^A" } }).explain("executionStats")
