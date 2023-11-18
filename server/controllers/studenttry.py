import pymongo
import sys

student = sys.argv[1]

client = pymongo.MongoClient("mongodb+srv://prakarmisheena:5rIp5UykvaqtaR81@cluster0.otxbose.mongodb.net/")
database = client["students_test"]
#student = "Hrishit"
collection = database[student]


uid = None
test_id = None
answers = []
scores = []
final_score = None


document = {"uid" : uid, "test_id" : test_id, "answers" : answers, "scores" : scores, "MarksObtained" : final_score}

result = collection.insert_one(document)
print(f"Inserted document ID: {result.inserted_id}")

sys.exit(0)