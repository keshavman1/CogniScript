import docx
import re
import pymongo
import sys

doc_path = sys.argv[1]

doc = docx.Document(doc_path)
print(doc)

doc_text = ''

questions = []
answers = []

for paragraph in doc.paragraphs:
    doc_text += paragraph.text

patternQ = 'Q\d+\.(.*?)\?'
matchesQ = re.findall(patternQ, doc_text)
patternA = 'Ans\d+\.(.*?)\.'
matchesA = re.findall(patternA, doc_text)

questions.extend(matchesQ)
answers.extend(matchesA)


client = pymongo.MongoClient("mongodb+srv://prakarmisheena:5rIp5UykvaqtaR81@cluster0.otxbose.mongodb.net/")
database = client["quiz"]
collection = database["quizzes"]

uid = 1
test_date = None
teacher_id = None
students_id = []
model_id = None

document = {"uid": uid, "test_date" : test_date, "teacher_id" : teacher_id, "questions": questions, "answers": answers, "Students_present" : students_id, "model_id" : model_id}

result = collection.insert_one(document)
print(f"Inserted document ID: {result.inserted_id}")

client.close()
