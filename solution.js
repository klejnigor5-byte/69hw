// ДЗ 69.1 — Операції з базами даних і документами в Mongo Shell
// Запуск: mongosh < solution.js
// Скрипт очищає колекцію assignments перед наповненням, щоб запуск був повторюваним.

db = db.getSiblingDB("studentDB");

db.assignments.drop();
db.createCollection("assignments");

print("\n1. Додаємо п'ять документів:");
db.assignments.insertMany([
  { name: "Alex", subject: "Mathematics", score: 90 },
  { name: "Maria", subject: "Physics", score: 85 },
  { name: "Andrew", subject: "Mathematics", score: 70 },
  { name: "Olena", subject: "History", score: 95 },
  { name: "Ivan", subject: "Physics", score: 60 }
]);

print("\n2. Усі документи:");
db.assignments.find().forEach(doc => printjson(doc));

print("\n3. Студенти з балом вище 80:");
db.assignments.find({ score: { $gt: 80 } }).forEach(doc => printjson(doc));

print("\n4. Збільшуємо бал Andrew на 5, якщо він менше 85:");
printjson(db.assignments.updateOne(
  { name: "Andrew", score: { $lt: 85 } },
  { $inc: { score: 5 } }
));
printjson(db.assignments.findOne({ name: "Andrew" }));

print("\n5. Видаляємо студента з найнижчим балом:");
const lowestStudent = db.assignments.find().sort({ score: 1 }).limit(1).toArray()[0];
if (lowestStudent) {
  print("Видаляємо: " + lowestStudent.name + ", score: " + lowestStudent.score);
  printjson(db.assignments.deleteOne({ _id: lowestStudent._id }));
}

print("\n6. Виводимо лише ім'я та бал:");
db.assignments.find({}, { _id: 0, name: 1, score: 1 }).forEach(doc => printjson(doc));

print("\n7. НЕОБОВ'ЯЗКОВО: середній бал за предметами, тільки середнє вище 75:");
db.assignments.aggregate([
  { $group: { _id: "$subject", averageScore: { $avg: "$score" } } },
  { $match: { averageScore: { $gt: 75 } } },
  { $project: { _id: 0, subject: "$_id", averageScore: { $round: ["$averageScore", 2] } } }
]).forEach(doc => printjson(doc));

print("\n8. НЕОБОВ'ЯЗКОВО: створюємо унікальний індекс за name:");
printjson(db.assignments.createIndex({ name: 1 }, { unique: true }));

print("\n9. Пошук імен, що починаються на A, з explain:");
printjson(db.assignments.find({ name: { $regex: "^A" } }).explain("executionStats"));

print("\n10. Фінальна колекція:");
db.assignments.find().forEach(doc => printjson(doc));
print("Кількість документів: " + db.assignments.countDocuments({}));
print("Індекси:");
db.assignments.getIndexes().forEach(index => printjson(index));
